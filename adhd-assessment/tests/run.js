#!/usr/bin/env node
/* Test runner: engine unit tests + data validation against ARCHITECTURE.md section 5.
   Usage: node tests/run.js            (all)
          node tests/run.js --data     (data validation only)
   Exit code 1 on any error. Warnings are printed but do not fail. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
let errors = 0, warnings = 0, passed = 0;
const err = (m) => { errors++; console.log('  ✗ ' + m); };
const warn = (m) => { warnings++; console.log('  ! ' + m); };
const ok = (cond, m) => { if (cond) passed++; else err(m); };

function makeContext() {
  const sb = { console, Math, JSON, Date, Object, Array, String, Number, Boolean, RegExp, Error, isNaN, parseInt, parseFloat };
  sb.window = sb; sb.globalThis = sb;
  vm.createContext(sb);
  return sb;
}
function load(sb, rel) {
  const file = path.join(ROOT, rel);
  const code = fs.readFileSync(file, 'utf8');
  vm.runInContext(code, sb, { filename: rel });
}
function scriptList() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  return [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
}

/* ---------------- Engine unit tests ---------------- */
function engineTests() {
  console.log('\nEngine tests');
  const sb = makeContext();
  ['js/core/ns.js', 'js/engine/scoring.js', 'js/engine/diagnosis.js'].forEach((f) => load(sb, f));
  const AA = sb.AA, S = AA.scoring, D = AA.diagnosis;

  // sum with bands, flags, cutoff
  const yn4 = [{ v: 0, l: 'a' }, { v: 1, l: 'b' }, { v: 2, l: 'c' }, { v: 3, l: 'd' }];
  const phq = { id: 'x', abbr: 'X', options: yn4, items: Array.from({ length: 9 }, (_, i) => ({ n: i + 1, t: 'i' + (i + 1) })),
    scoring: { method: 'sum', bands: [{ min: 0, max: 4, label: 'Minimal', sev: 0 }, { min: 5, max: 9, label: 'Mild', sev: 1 }, { min: 10, max: 14, label: 'Moderate', sev: 2 }, { min: 15, max: 19, label: 'Mod-severe', sev: 3 }, { min: 20, max: 27, label: 'Severe', sev: 3 }],
      cutoff: { value: 10 }, flags: [{ item: 9, min: 1, level: 'urgent', text: 'risk' }] } };
  let r = S.score(phq, { 1: 3, 2: 3, 3: 2, 4: 1, 5: 0, 6: 0, 7: 0, 8: 1, 9: 1 });
  ok(r.complete && r.total === 11 && r.band === 'Moderate' && r.positive === true, 'sum: total 11 moderate positive');
  ok(r.flags.length === 1 && r.flags[0].level === 'urgent', 'sum: item 9 flag');
  r = S.score(phq, { 1: 3 });
  ok(!r.complete && r.band === null && r.positive === null && r.answered === 1, 'sum: incomplete gives no band');
  r = S.score(phq, {});
  ok(r.answered === 0 && r.total === 0 && r.max === 27, 'sum: empty');

  // keyed items (AQ-10 style)
  const keyed = { id: 'k', options: [{ v: 1, l: 'Agree' }, { v: 0, l: 'Disagree' }], items: [{ n: 1, t: 'a', score: { 1: 1, 0: 0 } }, { n: 2, t: 'b', score: { 1: 0, 0: 1 } }], scoring: { method: 'sum', cutoff: { value: 2 } } };
  r = S.score(keyed, { 1: 1, 2: 0 });
  ok(r.total === 2 && r.positive === true && r.max === 2, 'keyed: reverse key scored');

  // asrs18
  const asrsOpts = [0, 1, 2, 3, 4].map((v) => ({ v, l: 'o' + v }));
  const asrs = { id: 'asrs18', options: asrsOpts, items: Array.from({ length: 18 }, (_, i) => ({ n: i + 1, t: 'q', part: i < 6 ? 'A' : 'B', threshold: [0, 1, 2, 8, 9, 11, 14, 15, 17].includes(i) ? 2 : 3 })),
    scoring: { method: 'asrs18', partA: 4 } };
  const ans = {}; for (let i = 1; i <= 18; i++) ans[i] = 0;
  Object.assign(ans, { 1: 2, 2: 2, 3: 1, 4: 3, 5: 3, 6: 2 });
  r = S.score(asrs, ans);
  ok(r.partA.shaded === 4 && r.positive === true, 'asrs18: 4 shaded in Part A is positive (item3 below, item6 below)');
  ans[5] = 2; r = S.score(asrs, ans);
  ok(r.partA.shaded === 3 && r.positive === false, 'asrs18: 3 shaded negative');
  r = S.score(asrs, { 1: 4, 2: 4, 3: 4, 4: 4 });
  ok(r.positive === null, 'asrs18: Part A incomplete gives null');

  // wfirs
  const wf = { id: 'wf', options: [0, 1, 2, 3].map((v) => ({ v, l: '' + v })).concat([{ v: 'na', l: 'n/a' }]),
    items: Array.from({ length: 6 }, (_, i) => ({ n: i + 1, t: 'q' })),
    scoring: { method: 'wfirs', domains: [{ id: 'a', label: 'A', items: [1, 2, 3] }, { id: 'b', label: 'B', items: [4, 5, 6] }], rule: { twos: 2, threes: 1 } } };
  r = S.score(wf, { 1: 2, 2: 2, 3: 0, 4: 'na', 5: 1, 6: 1 });
  ok(r.domains[0].impaired === true && r.domains[1].impaired === false && r.domains[1].na === 1 && r.impairedDomains === 1, 'wfirs: two 2s impair, na excluded');
  r = S.score(wf, { 4: 3 });
  ok(r.domains[1].impaired === true && r.domains[0].impaired === null, 'wfirs: one 3 impairs; unanswered domain null');

  // mdq
  const mdq = { id: 'mdq', options: [{ v: 1, l: 'Yes' }, { v: 0, l: 'No' }], items: Array.from({ length: 13 }, (_, i) => ({ n: i + 1, t: 'q', part: '1' }))
    .concat([{ n: 14, t: 'same time', part: '2' }, { n: 15, t: 'problem', part: '3', opts: [0, 1, 2, 3].map((v) => ({ v, l: '' + v })) }]), scoring: { method: 'mdq', part1: 7 } };
  const m = {}; for (let i = 1; i <= 13; i++) m[i] = i <= 7 ? 1 : 0; m[14] = 1; m[15] = 2;
  ok(S.score(mdq, m).positive === true, 'mdq: 7 + same time + moderate = positive');
  m[15] = 1; ok(S.score(mdq, m).positive === false, 'mdq: minor problems = negative');
  m[15] = 3; m[7] = 0; ok(S.score(mdq, m).positive === false, 'mdq: 6 yes = negative');

  // pcl5
  const pcl = { id: 'pcl', options: [0, 1, 2, 3, 4].map((v) => ({ v, l: '' + v })), items: Array.from({ length: 20 }, (_, i) => ({ n: i + 1, t: 'q' })),
    scoring: { method: 'pcl5', cutoff: { value: 33 }, clusters: { B: [1, 2, 3, 4, 5], C: [6, 7], D: [8, 9, 10, 11, 12, 13, 14], E: [15, 16, 17, 18, 19, 20] } } };
  const pa = {}; for (let i = 1; i <= 20; i++) pa[i] = 0; Object.assign(pa, { 1: 2, 6: 3, 8: 2, 9: 2, 15: 2, 16: 4 });
  r = S.score(pcl, pa);
  ok(r.dsmPattern === true && r.total === 15 && r.positive === false, 'pcl5: cluster pattern met, below cut-off');

  // triage
  const cs = { id: 'cs', options: [{ v: 1, l: 'Yes' }, { v: 0, l: 'No' }], items: Array.from({ length: 6 }, (_, i) => ({ n: i + 1, t: 'q' })),
    scoring: { method: 'triage', levels: [{ label: 'High', sev: 3, any: [4, 5, 6], text: 'act now' }, { label: 'Moderate', sev: 2, any: [3], text: 'soon' }, { label: 'Low', sev: 1, any: [1, 2], text: 'note' }] } };
  ok(S.score(cs, { 1: 1, 2: 0, 3: 1 }).band === 'Moderate', 'triage: highest matching level in order');
  ok(S.score(cs, { 1: 0, 2: 0 }).positive === false, 'triage: none endorsed');

  // diagnosis engine with synthetic data
  AA.data.symptoms = [];
  for (let i = 1; i <= 9; i++) AA.data.symptoms.push({ id: 'ia' + i, dim: 'IA' }, { id: 'hi' + i, dim: 'HI' });
  AA.data.impairment = { domains: ['work', 'relationships', 'social', 'leisure', 'selfimage'].map((id) => ({ id, label: id })) };
  AA.data.ddx = [{ id: 'dep', name: 'Depression', core: true, features: [{ id: 'f1', w: 3 }, { id: 'f2', w: 1 }] }, { id: 'osa', name: 'OSA', core: false, features: [] }];
  AA.data.tools = [];
  const a = { patient: { age: 30 }, symptoms: {}, onset: {}, impairment: { adult: {}, child: {} }, collateral: {}, ddx: {}, validity: {} };
  ok(D.need(a) === 5 && D.need({ patient: { age: 16 } }) === 6 && D.need({ patient: {} }) === 5, 'need: 5 from 17, 6 under 17');
  ok(D.criterionA(a).status === 'pending', 'A pending when not started');
  for (let i = 1; i <= 9; i++) { a.symptoms['ia' + i] = { adult: i <= 6 ? 'yes' : 'no', child: i <= 6 ? 'yes' : 'no' }; a.symptoms['hi' + i] = { adult: i <= 2 ? 'yes' : 'no', child: 'no' }; }
  ok(D.criterionA(a).status === 'pending', 'A pending until 6-month duration confirmed');
  a.onset.duration6m = 'yes';
  ok(D.criterionA(a).status === 'met' && D.presentation(a) === 'ia', 'A met, inattentive presentation');
  ok(D.criterionB(a).status === 'pending', 'B pending without onset answer');
  a.onset.before12 = 'yes';
  ok(D.criterionB(a).status === 'met', 'B met with 6 childhood symptoms and onset before 12');
  ok(D.criterionC(a).status === 'pending' && D.criterionD(a).status === 'pending', 'C/D pending before ratings');
  a.impairment.adult = { work: { sev: 2 }, relationships: { sev: 1 } };
  ok(D.criterionC(a).status === 'met' && D.criterionD(a).status === 'met', 'C met with 2 areas, D met with moderate');
  ok(D.criterionE(a).status === 'pending', 'E pending before ddx review');
  a.ddx.dep = { verdict: 'comorbid' };
  ok(D.criterionE(a).status === 'met', 'E met when core reviewed as co-occurring');
  let o = D.outcome(a);
  ok(o.code === 'met' && o.dsm === 'F90.0' && o.icd11 === '6A05.0', 'outcome met with codes F90.0 / 6A05.0');
  ok(D.severity(a) === 'moderate', 'severity moderate (excess 1, moderate impairment)');
  a.ddx.dep.verdict = 'better';
  ok(D.outcome(a).code === 'better-explained', 'outcome better explained');
  a.ddx.dep.verdict = 'absent';
  a.impairment.adult = { work: { sev: 1 }, relationships: { sev: 1 } };
  ok(D.criterionD(a).status === 'partial' && D.outcome(a).code === 'met', 'D partial (mild only) still met with NICE note');
  a.impairment.adult = { work: { sev: 2 }, relationships: { sev: 2 } };
  for (let i = 5; i <= 9; i++) a.symptoms['ia' + i].adult = 'no';
  o = D.outcome(a);
  ok(D.criterionA(a).status === 'not-met' && o.code === 'subthreshold' && o.icd11 === '6A05.Y', 'subthreshold with 4 adult IA symptoms');
  a.onset.before12 = 'no';
  ok(D.criterionB(a).status === 'not-met' && D.outcome(a).code === 'not-met', 'onset after 12 -> not met');
  ok(D.collateral({ collateral: { parent: 2, partner: 0 } }).level === 'clear' && D.collateral({ collateral: {} }).level === 'unavailable', 'collateral levels');
  const sc = D.ddxScore(AA.data.ddx[0], { f: { f1: true } });
  ok(sc.score === 3 && sc.max === 4 && sc.band === 'strong', 'ddx score weighted');
  ok(D.stepProgress(a, 'ia').of === 18, 'step progress counts adult and child');
  const dv = D.diva2({ symptoms: a.symptoms, onset: { always: 'no', ageOnset: '5' } });
  ok(dv.childIA6 === true && dv.before7 === true, 'diva2 view');
}

/* ---------------- Data validation ---------------- */
const ID = /^[a-z0-9_]+$/;
function isStrArr(x, min) { return Array.isArray(x) && x.every((s) => typeof s === 'string' && s.trim()) && x.length >= (min || 0); }

function dataTests() {
  console.log('\nData validation');
  const sb = makeContext();
  const scripts = scriptList().filter((s) => s.startsWith('js/core/ns') || s.startsWith('js/engine/') || s.startsWith('js/data/'));
  scripts.forEach((s) => {
    if (!fs.existsSync(path.join(ROOT, s))) { warn('missing file ' + s); return; }
    try { load(sb, s); } catch (e) { err(s + ': ' + e.message); }
  });
  const AA = sb.AA, d = AA.data;
  const toolIds = new Set((d.tools || []).map((t) => t.id));
  const ddxIds = new Set((d.ddx || []).map((x) => x.id));

  // tools
  const seenT = new Set();
  (d.tools || []).forEach((t) => {
    const w = 'tool ' + t.id + ': ';
    if (!ID.test(t.id || '')) err(w + 'bad id');
    if (seenT.has(t.id)) err(w + 'duplicate id'); seenT.add(t.id);
    ['abbr', 'name', 'group', 'purpose', 'when', 'licence'].forEach((k) => { if (!t[k]) err(w + 'missing ' + k); });
    if (!Array.isArray(t.stage) || !t.stage.length) err(w + 'missing stage[]');
    if (t.file && !fs.existsSync(path.join(ROOT, t.file))) warn(w + 'file not found ' + t.file);
    if (t.interactive) {
      if (!Array.isArray(t.items) || !t.items.length) { err(w + 'interactive without items'); return; }
      const ns = new Set();
      t.items.forEach((it) => {
        if (ns.has(it.n)) err(w + 'duplicate item n ' + it.n); ns.add(it.n);
        if (!it.t) err(w + 'item ' + it.n + ' has no text');
        const opts = it.opts || t.options;
        if (!Array.isArray(opts) || !opts.length) err(w + 'item ' + it.n + ' has no options');
      });
      const sc = t.scoring || {};
      if (!['sum', 'count', 'asrs18', 'wfirs', 'mdq', 'pcl5', 'triage'].includes(sc.method)) err(w + 'scoring.method invalid: ' + sc.method);
      (sc.bands || []).forEach((b, i, arr) => { if (i && b.min <= arr[i - 1].max) err(w + 'bands overlap at ' + b.label); if (b.sev === undefined) err(w + 'band without sev'); });
      (sc.flags || []).forEach((f) => { if (!ns.has(f.item)) err(w + 'flag item missing ' + f.item); });
      (sc.subscales || []).forEach((s) => s.items.forEach((n) => { if (!ns.has(n)) err(w + 'subscale ' + s.id + ' item missing ' + n); }));
      if (sc.method === 'asrs18') t.items.forEach((it) => { if (it.threshold === undefined || !it.part) err(w + 'asrs item ' + it.n + ' needs threshold and part'); });
      if (sc.method === 'wfirs') {
        const cov = new Set(); (sc.domains || []).forEach((dm) => dm.items.forEach((n) => { if (!ns.has(n)) err(w + 'domain item missing ' + n); cov.add(n); }));
        t.items.forEach((it) => { if (!cov.has(it.n)) err(w + 'item not in a domain ' + it.n); });
      }
      if (sc.method === 'pcl5') ['B', 'C', 'D', 'E'].forEach((k) => { if (!sc.clusters || !sc.clusters[k]) err(w + 'missing cluster ' + k); });
      if (sc.method === 'triage') (sc.levels || []).forEach((lv) => lv.any.forEach((n) => { if (!ns.has(n)) err(w + 'level item missing ' + n); }));
      passed++;
    }
  });
  console.log('  tools: ' + (d.tools || []).length + ' (' + (d.tools || []).filter((t) => t.interactive).length + ' interactive)');

  // symptoms
  const sy = d.symptoms || [];
  const want = [...Array(9)].map((_, i) => 'ia' + (i + 1)).concat([...Array(9)].map((_, i) => 'hi' + (i + 1)));
  want.forEach((id, i) => { if (!sy[i] || sy[i].id !== id) err('symptoms[' + i + '] should be ' + id + ' (got ' + (sy[i] && sy[i].id) + ')'); });
  const AC = ['work', 'study', 'home', 'admin', 'relationships', 'parenting', 'social', 'driving', 'digital', 'leisure', 'health', 'conversation', 'inner'];
  const CC = ['school', 'homework', 'home', 'play', 'activities', 'reports', 'teen'];
  let totA = 0, totC = 0;
  sy.forEach((s) => {
    const w = 'symptom ' + s.id + ': ';
    if (s.dim !== (s.id.startsWith('ia') ? 'IA' : 'HI')) err(w + 'dim mismatch');
    ['title', 'criterion', 'adultForm', 'why'].forEach((k) => { if (!s[k]) err(w + 'missing ' + k); });
    if (!s.ask || !s.ask.adult || !s.ask.child) err(w + 'ask.adult/child missing');
    if (!isStrArr(s.rephrase, 8)) err(w + 'rephrase needs 8+');
    const ex = s.examples || {};
    const count = (arr, keys, label) => {
      let n = 0; const seen = new Set();
      (arr || []).forEach((g) => {
        if (!keys.includes(g.ctx)) err(w + label + ' ctx not allowed: ' + g.ctx);
        if (!g.label) err(w + label + ' group without label');
        (g.items || []).forEach((t) => { const k = String(t).toLowerCase().trim(); if (seen.has(k)) warn(w + 'duplicate example "' + t + '"'); seen.add(k); n++; });
      });
      return n;
    };
    const na = count(ex.adult, AC, 'adult'), nc = count(ex.child, CC, 'child');
    totA += na; totC += nc;
    if (na < 60) err(w + 'adult examples ' + na + ' < 60'); else if (na < 70) warn(w + 'adult examples ' + na + ' < 70');
    if (nc < 35) err(w + 'child examples ' + nc + ' < 35'); else if (nc < 40) warn(w + 'child examples ' + nc + ' < 40');
    const pk = (s.probes || []).map((p) => p.k);
    ['frequency', 'severity', 'pervasive', 'duration', 'peers', 'impact'].forEach((k) => { if (!pk.includes(k)) err(w + 'probe missing ' + k); });
    (s.probes || []).forEach((p) => { if (!isStrArr(p.items, 3)) err(w + 'probe ' + p.k + ' needs 3+ items'); });
    const inf = s.informant || {};
    if (!isStrArr(inf.partner, 6) || !isStrArr(inf.parent, 6) || !isStrArr(inf.school, 3)) err(w + 'informant lists too short');
    if (!isStrArr(s.counts, 5)) err(w + 'counts needs 5+');
    if (!isStrArr(s.notCount, 6)) err(w + 'notCount needs 6+');
    const an = s.anchors || [];
    if (an.length < 6) err(w + 'anchors needs 6+');
    an.forEach((x) => { if (!['yes', 'no', 'unsure'].includes(x.score) || !x.quote || !x.why) err(w + 'bad anchor'); });
    if (!['yes', 'no', 'unsure'].every((k) => an.some((x) => x.score === k))) err(w + 'anchors need yes, unsure and no');
    (s.mimics || []).forEach((m) => { if (ddxIds.size && !ddxIds.has(m.ddx)) err(w + 'mimic ddx unknown: ' + m.ddx); if (!m.clue || !m.ask) err(w + 'mimic incomplete'); });
    if ((s.mimics || []).length < 6) err(w + 'mimics needs 6+');
    if (!s.special || ['women', 'older', 'highIQ', 'sud', 'asd'].some((k) => !s.special[k])) err(w + 'special incomplete');
  });
  console.log('  symptoms: ' + sy.length + ' (' + totA + ' adult and ' + totC + ' childhood examples)');

  // impairment
  const im = d.impairment;
  if (!im) err('impairment missing');
  else {
    const doms = im.domains || [];
    ['work', 'relationships', 'social', 'leisure', 'selfimage'].forEach((id) => { if (!doms.some((x) => x.id === id)) err('impairment domain missing ' + id); });
    doms.forEach((x) => {
      ['adult', 'child'].forEach((p) => {
        const s = x[p] || {};
        if (!isStrArr(s.ask, 4) || !isStrArr(s.items, 15)) err('impairment ' + x.id + '.' + p + ' ask/items too short');
        if (!s.anchors || [0, 1, 2, 3].some((k) => !s.anchors[k])) err('impairment ' + x.id + '.' + p + ' anchors 0-3 missing');
      });
    });
    if (!im.severity || im.severity.length !== 4) err('impairment.severity needs 4 levels');
    if (!im.onset || !isStrArr(im.onset.ask, 8)) err('impairment.onset.ask too short');
    const c = im.collateral || {};
    const keys = new Set();
    ['parent', 'partner'].forEach((k) => ((c[k] && c[k].questions) || []).forEach((q) => { if (keys.has(q.k)) err('collateral duplicate key ' + q.k); keys.add(q.k); if (!ID.test(q.k)) err('collateral bad key ' + q.k); }));
    if (!c.school || !isStrArr(c.school.lookFor, 10)) err('collateral.school.lookFor too short');
    if (!im.supplement || !im.supplement.ia || !im.supplement.hi) err('impairment.supplement missing');
  }

  // history and risk
  const hs = d.history || [];
  const hid = new Set();
  hs.forEach((s) => {
    if (!s.id || !s.title || !isStrArr(s.prompts, 5)) err('history ' + s.id + ' incomplete');
    (s.items || []).forEach((it) => { if (hid.has(it.id)) err('history duplicate item ' + it.id); hid.add(it.id); if (!ID.test(it.id)) err('history bad id ' + it.id); if (it.ddx && ddxIds.size && !ddxIds.has(it.ddx)) err('history ' + it.id + ' unknown ddx ' + it.ddx); });
  });
  if (hs.length) console.log('  history: ' + hs.length + ' sections, ' + hid.size + ' items');
  if (d.risk) (d.risk.items || []).forEach((r) => { if (!['urgent', 'high', 'note'].includes(r.level)) err('risk ' + r.id + ' bad level'); });

  // ddx
  const seenD = new Set();
  (d.ddx || []).forEach((x) => {
    const w = 'ddx ' + x.id + ': ';
    if (!ID.test(x.id || '')) err(w + 'bad id'); if (seenD.has(x.id)) err(w + 'duplicate'); seenD.add(x.id);
    ['name', 'group', 'summary'].forEach((k) => { if (!x[k]) err(w + 'missing ' + k); });
    if (!isStrArr(x.ask, 10)) err(w + 'ask needs 10+');
    if (!isStrArr(x.favoursAlt, 5) || !isStrArr(x.favoursADHD, 4) || !isStrArr(x.overlap, 4)) err(w + 'overlap/favours lists short');
    const fid = new Set();
    (x.features || []).forEach((f) => { if (fid.has(f.id)) err(w + 'dup feature ' + f.id); fid.add(f.id); if (!(f.w >= 1 && f.w <= 3)) err(w + 'feature weight ' + f.id); if (!f.t) err(w + 'feature text ' + f.id); });
    if ((x.features || []).length < 6) err(w + 'features needs 6+');
    (x.screen || []).forEach((t) => { if (!toolIds.has(t)) err(w + 'unknown screen tool ' + t); });
    if (!x.decide || !x.decide.better || !x.decide.both) err(w + 'decide incomplete');
  });
  if ((d.ddx || []).length) console.log('  ddx: ' + d.ddx.length + ' conditions (' + d.ddx.filter((x) => x.core).length + ' core)');

  // learn
  (d.learn || []).forEach((m) => {
    const w = 'module ' + m.id + ': ';
    if (!m.title || !Array.isArray(m.sections) || !m.sections.length) err(w + 'incomplete');
    const qs = m.quiz || [];
    if (qs.length < 8) err(w + 'quiz needs 8+');
    const pos = [0, 0, 0, 0, 0, 0];
    qs.forEach((q, i) => { if (!(q.a >= 0 && q.a < (q.options || []).length)) err(w + 'quiz ' + i + ' answer index'); else pos[q.a]++; if (!q.why) err(w + 'quiz ' + i + ' no explanation'); });
    if (qs.length && Math.max(...pos) > qs.length * 0.5) warn(w + 'answer positions unbalanced ' + pos.join('/'));
  });
  if ((d.learn || []).length) console.log('  learn: ' + d.learn.length + ' modules, ' + d.learn.reduce((n, m) => n + (m.quiz || []).length, 0) + ' quiz questions');

  // cases
  (d.cases || []).forEach((c) => {
    const w = 'case ' + c.id + ': ';
    if (!c.title || !Array.isArray(c.stages) || !c.stages.length || !c.answer) err(w + 'incomplete');
    (c.stages || []).forEach((s, i) => { if (s.q && !(s.q.a >= 0 && s.q.a < s.q.options.length)) err(w + 'stage ' + i + ' answer index'); });
  });
  if ((d.cases || []).length) console.log('  cases: ' + d.cases.length);

  // pathway
  (d.pathway || []).forEach((p) => (p.tools || []).forEach((t) => { if (!toolIds.has(t)) err('pathway ' + p.id + ' unknown tool ' + t); }));

  // demo
  if (d.demo) {
    const de = d.demo;
    Object.keys(de.symptoms || {}).forEach((k) => { if (!sy.some((s) => s.id === k)) err('demo symptom unknown ' + k); });
    Object.keys(de.ddx || {}).forEach((k) => { if (!ddxIds.has(k)) err('demo ddx unknown ' + k); });
    Object.keys(de.tools || {}).forEach((k) => { if (!toolIds.has(k)) err('demo tool unknown ' + k); });
  }
}

const onlyData = process.argv.includes('--data');
if (!onlyData) engineTests();
dataTests();
console.log('\n' + passed + ' checks passed, ' + errors + ' error(s), ' + warnings + ' warning(s)');
process.exit(errors ? 1 : 0);
