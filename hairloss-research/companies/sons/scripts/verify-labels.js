// Stage 3: audit evidence labels in company.json. Every "observed" claim must point at a run folder that exists.
const fs = require('fs'); const path = require('path');
const D = path.join(__dirname, '..');
const c = JSON.parse(fs.readFileSync(path.join(D, 'company.json'), 'utf8'));
const runRefs = s => (String(s || '').match(/runs\/[A-Za-z0-9._-]+/g) || []).map(r => r.replace(/[.,;)]+$/, ''));
const exists = r => fs.existsSync(path.join(D, r));
const out = [];
function check(where, obj, text) {
  if (!obj || obj.evidence !== 'observed') return;
  const refs = runRefs(text); const bad = refs.filter(r => !exists(r));
  if (!refs.length) out.push(['NO-RUN', where]); if (bad.length) out.push(['MISSING-RUN', where, bad.join(',')]);
}
for (const r of c.rules) check('rule ' + r.id, r, r.proof + ' ' + r.then);
for (const e of c.experiments) { const refs = runRefs(e.run); for (const x of refs) if (!exists(x)) out.push(['MISSING-RUN', 'exp ' + e.id, x]); }
for (const p of c.products) { if (p.evidence === 'observed') out.push(['PRODUCT-OBSERVED', p.id, p.name]); if (p.evidence === 'docs' && !/^https?:/.test(p.url || '')) out.push(['DOCS-NO-URL', p.id]); }
for (const r of c.recommendations) check('reco ' + r.profile, r, r.note + ' ' + JSON.stringify(r));
for (const f of c.flows) for (const q of f.questions) {
  check('q ' + q.id, q, JSON.stringify(q));
  for (const o of q.options || []) check('opt ' + q.id + ' ' + o.label.slice(0, 30), o, o.effect);
}
const counts = {}; for (const o of out) counts[o[0]] = (counts[o[0]] || 0) + 1;
console.log(JSON.stringify(counts)); for (const o of out) console.log(o.join(' | '));
