// Stage 3 (VERIFY) overlay for companies/sons/company.json.
// build-company.js writes the stage 1 map, calls s2-overlay.js (stage 2), then calls this file.
// It records what the independent stage 3 review re-tested, corrects what was wrong and adds the "verification" block.
// Live facts come from run folders runs/verify-* (walk.js); code checks from runs/verify-code-freshness, runs/verify-offline;
// product checks from runs/verify-products and runs/verify-catalogue. Results the review wrote by hand are in
// scripts/verify-results.json. usage: node scripts/build-company.js   (or node scripts/verify-overlay.js to re-apply)
const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const d = J('company.json');
const VR = J('scripts/verify-results.json');
const exists = r => fs.existsSync(path.join(ROOT, r));
const allQ = () => d.flows.flatMap(f => f.questions);
const q = id => { const x = allQ().find(x => x.id === id); if (!x) throw new Error('no question ' + id); return x; };
const opt = (qid, start) => { const o = q(qid).options.find(o => o.label.startsWith(start)); if (!o) throw new Error('no option ' + qid + ' ' + start); return o; };
const rule = id => { const r = d.rules.find(r => r.id === id); if (!r) throw new Error('no rule ' + id); return r; };
const corrected = []; const checked = [];

// ---------------------------------------------------------------- 1. a run folder named as proof that does not exist
// runs/s2-baseline-women was never written (stage 2 replayed the woman as runs/exp-02). Point at the folders that exist.
(function fixMissingRun() {
  let n = 0;
  const walk = o => { for (const k of Object.keys(o)) { const v = o[k];
    if (typeof v === 'string' && v.includes('runs/s2-baseline-women')) { o[k] = v.replace(/runs\/s2-baseline-women/g, 'runs/baseline-women, runs/verify-baseline-women'); n++; }
    else if (v && typeof v === 'object') walk(v); } };
  walk(d);
  if (n) corrected.push(`${n} claims named runs/s2-baseline-women as proof, a folder that does not exist (stage 2 replayed the woman as runs/exp-02). They now name runs/baseline-women and the stage 3 replay runs/verify-baseline-women, which both end on the same female notice.`);
})();

// ---------------------------------------------------------------- 2. "observed" questions and options that named no run folder
const SCREENS = {}; // run -> visible text of all its screens
for (const r of fs.readdirSync(path.join(ROOT, 'runs'))) {
  const dir = path.join(ROOT, 'runs', r); if (!fs.statSync(dir).isDirectory()) continue;
  let t = ''; for (const f of fs.readdirSync(dir).filter(f => /^\d\d\.txt$/.test(f))) t += (fs.readFileSync(path.join(dir, f), 'utf8').split('--- CONTROLS ---')[0]) + '\n';
  if (t) SCREENS[r] = t.replace(/[’‘]/g, "'").replace(/\s+/g, ' ');
}
const PREF = ['s2-baseline-men', 'verify-baseline-men', 'exp-38', 'exp-44', 'verify-stacked-redflags', 'all-branches-men'];
function runsShowing(text) {
  const key = String(text).replace(/[’‘]/g, "'").replace(/^.*?"/, '').replace(/\s+/g, ' ').trim().slice(0, 45);
  if (key.length < 12) return [];
  const hits = Object.keys(SCREENS).filter(r => SCREENS[r].includes(key));
  return hits.sort((a, b) => (PREF.indexOf(a) + 1 || 99) - (PREF.indexOf(b) + 1 || 99) || a.localeCompare(b));
}
(function addProof() {
  let added = 0, down = [], upgraded = [];
  for (const f of d.flows) for (const qq of f.questions) {
    const has = /runs\//.test(JSON.stringify(qq.proof || '') + (qq.branchDetail || '') + (qq.shownWhen || ''));
    let hits = runsShowing(qq.text);
    if (!hits.length && qq.detail) hits = runsShowing(qq.detail);
    if (qq.evidence === 'code' && qq.stage === 'anonymous' && hits.length && !has) {
      // seen on a saved live screen: the question itself (wording, when shown) is observed, not only read in code
      qq.evidence = 'observed'; qq.proof = 'Seen live in ' + hits.slice(0, 3).map(r => 'runs/' + r).join(', ') + (hits.length > 3 ? ` and ${hits.length - 3} more run folders` : '');
      upgraded.push(qq.id);
    } else if (qq.evidence === 'observed' && !has) {
      if (hits.length) { qq.proof = 'Seen live in ' + hits.slice(0, 3).map(r => 'runs/' + r).join(', ') + (hits.length > 3 ? ` and ${hits.length - 3} more run folders` : ''); added++; }
      else { qq.evidence = 'code'; down.push(qq.id); }
    }
    for (const o of qq.options || []) {
      if (o.evidence !== 'observed' || /runs\//.test(o.effect)) continue;
      const oh = hits.length ? hits : [];
      if (oh.length) { o.effect = o.effect.replace(/\.?\s*$/, '') + ` (seen live, runs/${oh[0]}).`; added++; }
      else { o.evidence = 'code'; down.push(qq.id + ' "' + o.label + '"'); }
    }
  }
  if (upgraded.length) corrected.push(`${upgraded.length} questions were labelled "code" although their wording appears on saved live screens; upgraded to "observed" with the run folders named: ${upgraded.join(', ')}.`);
  corrected.push(`${added} questions and options were labelled "observed" without naming a run folder. Each now names the run folders whose saved screens show it (found by searching every runs/*/NN.txt for the question wording).` + (down.length ? ` Not found on any saved screen, so downgraded to "code": ${down.join('; ')}.` : ' All were found on saved screens; none had to be downgraded.'));
})();

// ---------------------------------------------------------------- 3. live re-tests from stage 3 (hand-written results)
for (const u of VR.upgrades || []) {
  const o = u.option ? opt(u.q, u.option) : null; const target = o || q(u.q);
  if (u.evidence) target.evidence = u.evidence;
  if (u.effect && o) o.effect = u.effect;
  if (u.effectType && o) o.effectType = u.effectType;
  if (u.proof && !o) target.proof = u.proof;
  if (u.note) corrected.push(u.note);
}
for (const rv of VR.rules || []) {
  const r = rule(rv.id);
  r.verification = rv.status + ': ' + rv.note;
  if (rv.then) r.then = rv.then;
  if (rv.effectType) r.effectType = rv.effectType;
  if (rv.proof) r.proof = rv.proof;
  if (rv.confidence) r.confidence = rv.confidence;
  if (rv.evidence) r.evidence = rv.evidence;
  checked.push(`${rv.id} (${rv.short}): ${rv.status}. ${rv.note}`);
  if (rv.status !== 'confirmed') corrected.push(`${rv.id}: ${rv.correction || rv.note}`);
}
for (const nr of VR.newRules || []) if (!d.rules.some(r => r.id === nr.id)) d.rules.push(nr);
for (const x of VR.experiments || []) {
  const runs = (x.run.match(/runs\/[A-Za-z0-9._-]+/g) || []);
  if (runs.some(r => !exists(r))) throw new Error('experiment ' + x.id + ' names a missing run ' + x.run);
  if (!d.experiments.some(e => e.id === x.id)) d.experiments.push(x);
}
for (const p of VR.products || []) {
  const prod = d.products.find(z => z.id === p.id); if (!prod) throw new Error('no product ' + p.id);
  prod.checkedLive = p.note;
  if (p.price) prod.price = p.price;
}
// generic field patches: "q:<id>", "opt:<qid>:<label start>", "flow:<id>", "product:<id>", "rule:<id>"
for (const p of VR.patches || []) {
  const [kind, a, b] = p.path.split(':');
  const t = kind === 'q' ? q(a) : kind === 'opt' ? opt(a, b) : kind === 'flow' ? d.flows.find(f => f.id === a) : kind === 'product' ? d.products.find(z => z.id === a) : kind === 'rule' ? rule(a) : null;
  if (!t) throw new Error('patch target not found ' + p.path);
  Object.assign(t, p.set);
  if (p.note) corrected.push(p.note);
}
for (const nq of VR.newQuestions || []) {
  const f = d.flows.find(f => f.id === nq.flow);
  if (!f.questions.some(x => x.id === nq.q.id)) f.questions.push(nq.q);
}
for (const c of VR.checked || []) checked.push(c);
for (const c of VR.corrected || []) corrected.push(c);

// ---------------------------------------------------------------- 4. summary fields
if (VR.access) Object.assign(d.access, VR.access);
for (const fx of VR.limitationsFix || []) d.limitations = d.limitations.map(l => l.includes(fx.find) ? l.replace(fx.find, fx.replace) : l);
if (VR.limitationsAdd) for (const l of VR.limitationsAdd) if (!d.limitations.includes(l)) d.limitations.push(l);
if (VR.sourcesAdd) for (const s of VR.sourcesAdd) if (!d.sources.some(x => x.url === s.url)) d.sources.push(s);
if (VR.engineSummaryAdd && !d.engineSummary.includes(VR.engineSummaryAdd)) d.engineSummary += ' ' + VR.engineSummaryAdd;
d.checkedOn = VR.checkedOn || d.checkedOn;
d.verification = { checked, corrected, stillUnverified: VR.stillUnverified || [], verdict: VR.verdict || 'Review in progress.' };
fs.writeFileSync(path.join(ROOT, 'company.json'), JSON.stringify(d, null, 1));
console.log('stage 3 overlay: ' + checked.length + ' checks, ' + corrected.length + ' corrections, ' + d.experiments.length + ' experiments, ' + d.rules.length + ' rules');
