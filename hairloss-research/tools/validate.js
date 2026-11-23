#!/usr/bin/env node
/* validate.js — check companies/<slug>/company.json against the shape in PROTOCOL.md.
 * Usage: node validate.js <slug> [--stage map|rules|final]
 *   map   : products + flows/questions must exist (rules may be empty)
 *   rules : also rules, experiments, recommendations, engineSummary
 *   final : also a "verification" block
 * Exit 0 = pass (warnings allowed), 1 = errors.
 */
const fs = require('fs');
const path = require('path');
const slug = process.argv[2];
const stage = process.argv.includes('--stage') ? process.argv[process.argv.indexOf('--stage') + 1] : 'map';
if (!slug) { console.error('usage: node validate.js <slug> [--stage map|rules|final]'); process.exit(1); }
const file = path.join(__dirname, '..', 'companies', slug, 'company.json');
let d;
try { d = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { console.error('ERROR cannot read/parse ' + file + ': ' + e.message); process.exit(1); }

const errs = [], warns = [];
const E = m => errs.push(m), W = m => warns.push(m);
const CAT = ['rx-topical-compounded', 'rx-topical-licensed', 'rx-oral', 'rx-oral-compounded', 'otc-medicine', 'cosmetic', 'supplement', 'device', 'bundle', 'service'];
const EV = ['observed', 'code', 'docs', 'inferred'];
const EVU = EV.concat(['unknown']);
const QT = ['single', 'multi', 'text', 'number', 'date', 'photo', 'info', 'consent', 'contact'];
const ET = ['none', 'next-question', 'extra-questions', 'skip-questions', 'hard-stop', 'soft-warning', 'product-removed', 'product-added', 'product-switched', 'strength-changed', 'flag-for-clinician', 'marketing-only', 'unknown'];
const ROLE = ['eligibility-gate', 'safety-screen', 'diagnosis', 'product-selector', 'personalisation', 'expectation-setting', 'marketing', 'data-capture', 'consent', 'identity'];
const STG = ['anonymous', 'after-account', 'checkout'];
const str = (o, k, where, req = true) => { if (typeof o[k] !== 'string' || (req && !o[k].trim())) E(`${where}.${k} must be a non-empty string`); };
const one = (o, k, list, where) => { if (!list.includes(o[k])) E(`${where}.${k} = ${JSON.stringify(o[k])} must be one of: ${list.join(' | ')}`); };
const arr = (o, k, where) => { if (!Array.isArray(o[k])) { E(`${where}.${k} must be an array`); return []; } return o[k]; };

['slug', 'company', 'market', 'website', 'model', 'checkedOn'].forEach(k => str(d, k, 'root'));
if (d.slug !== slug) E(`root.slug "${d.slug}" must equal folder name "${slug}"`);
arr(d, 'audiences', 'root');
if (!d.access || typeof d.access !== 'object') E('root.access missing');
else { arr(d.access, 'howTested', 'access'); arr(d.access, 'blockers', 'access'); str(d.access, 'coverageNote', 'access'); if (!('accountWall' in d.access)) E('access.accountWall missing (use null if there is none)'); }

const pids = new Set();
arr(d, 'products', 'root').forEach((p, i) => {
  const w = `products[${i}]`;
  ['id', 'name', 'form', 'audience', 'legalStatus', 'price', 'recommendedWhen'].forEach(k => str(p, k, w));
  one(p, 'category', CAT, w); one(p, 'evidence', EV, w);
  arr(p, 'actives', w).forEach((a, j) => { if (!a || typeof a.name !== 'string') E(`${w}.actives[${j}].name missing`); });
  if (pids.has(p.id)) E(`${w}.id "${p.id}" is duplicated`); pids.add(p.id);
  if (!p.url) W(`${w} (${p.name}) has no url`);
});
if (!pids.size) E('no products listed');

const qids = new Set(); let qCount = 0, optCount = 0, unknownOpts = 0;
const fids = new Set();
arr(d, 'flows', 'root').forEach((f, i) => {
  const w = `flows[${i}]`;
  ['id', 'name', 'audience', 'entryUrl', 'stagesSummary'].forEach(k => str(f, k, w)); fids.add(f.id);
  arr(f, 'questions', w).forEach((q, j) => {
    const wq = `${w}.questions[${j}]`;
    ['id', 'text', 'purpose', 'shownWhen'].forEach(k => str(q, k, wq));
    one(q, 'type', QT, wq); one(q, 'engineRole', ROLE, wq); one(q, 'evidence', EV, wq); one(q, 'stage', STG, wq);
    if (typeof q.branches !== 'boolean') E(`${wq}.branches must be true or false`);
    if (typeof q.order !== 'number') E(`${wq}.order must be a number`);
    if (qids.has(q.id)) E(`${wq}.id "${q.id}" is duplicated`); qids.add(q.id); qCount++;
    arr(q, 'options', wq).forEach((o, k) => {
      const wo = `${wq}.options[${k}]`;
      str(o, 'label', wo); str(o, 'effect', wo); one(o, 'effectType', ET, wo); one(o, 'evidence', EVU, wo);
      (o.affects || []).forEach(id => { if (!pids.has(id)) E(`${wo}.affects has unknown product id "${id}"`); });
      optCount++; if (o.effectType === 'unknown') unknownOpts++;
    });
    if (['single', 'multi'].includes(q.type) && (!q.options || !q.options.length)) W(`${wq} (${q.id}) is ${q.type} but lists no options`);
  });
});
if (!fids.size) W('no flows listed (fine only if the site has no consultation at all: say so in access.coverageNote)');

arr(d, 'rules', 'root').forEach((r, i) => {
  const w = `rules[${i}]`;
  ['id', 'flow', 'when', 'then', 'proof'].forEach(k => str(r, k, w));
  one(r, 'effectType', ET, w); one(r, 'evidence', EV, w); one(r, 'confidence', ['high', 'medium', 'low'], w);
  (r.affects || []).forEach(id => { if (!pids.has(id)) E(`${w}.affects has unknown product id "${id}"`); });
  if (r.evidence === 'observed' && !/runs\//.test(r.proof)) W(`${w} (${r.id}) is "observed" but proof names no runs/ folder`);
});
arr(d, 'experiments', 'root').forEach((x, i) => { const w = `experiments[${i}]`; ['id', 'flow', 'changed', 'result'].forEach(k => str(x, k, w)); });
arr(d, 'recommendations', 'root').forEach((r, i) => {
  const w = `recommendations[${i}]`; str(r, 'profile', w); one(r, 'evidence', EV, w);
  arr(r, 'offered', w).forEach(id => { if (!pids.has(id)) E(`${w}.offered has unknown product id "${id}"`); });
});
['strengths', 'weaknesses', 'opportunities', 'sources', 'limitations'].forEach(k => arr(d, k, 'root'));

if (stage !== 'map') {
  str(d, 'engineSummary', 'root');
  if (!d.rules.length) W('no rules derived');
  if (!d.recommendations.length) W('no recommendations recorded');
  if (optCount && unknownOpts / optCount > 0.4) W(`${unknownOpts} of ${optCount} options still have effectType "unknown"`);
}
if (stage === 'final') {
  const v = d.verification;
  if (!v || typeof v !== 'object') E('root.verification block missing (checked, corrected, stillUnverified, verdict)');
  else { ['checked', 'corrected', 'stillUnverified'].forEach(k => arr(v, k, 'verification')); str(v, 'verdict', 'verification'); }
}

warns.forEach(w => console.log('warn  ' + w));
errs.forEach(e => console.log('ERROR ' + e));
console.log(`\n${slug}: ${pids.size} products, ${fids.size} flows, ${qCount} questions, ${optCount} options, ${(d.rules || []).length} rules, ${(d.experiments || []).length} experiments, ${(d.recommendations || []).length} recommendation profiles — ${errs.length} error(s), ${warns.length} warning(s) [stage ${stage}]`);
process.exit(errs.length ? 1 : 0);
