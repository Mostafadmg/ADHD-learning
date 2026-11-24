#!/usr/bin/env node
/* digest.js — compact per-company digests for cross-company work (no question-by-question or experiment lists).
 * Writes synthesis/digest/<slug>.md and synthesis/digest/ALL.md */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), CO = path.join(ROOT, 'companies'), OUT = path.join(ROOT, 'synthesis', 'digest');
fs.mkdirSync(OUT, { recursive: true });
const e = s => String(s == null ? '' : s).replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
const all = [];
for (const slug of fs.readdirSync(CO).sort()) {
  const f = path.join(CO, slug, 'company.json'); if (!fs.existsSync(f)) continue;
  let d; try { d = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (x) { continue; }
  const P = Object.fromEntries((d.products || []).map(p => [p.id, p.name]));
  const qs = (d.flows || []).flatMap(fl => fl.questions || []);
  const L = [`# ${d.company} (${d.market}) — digest`, `Slug: ${slug} · Verified: ${d.verification ? 'yes' : 'NO (not independently checked)'} · Audiences: ${(d.audiences || []).join(', ')}`, '',
    `Model: ${e(d.model)}`, `Account wall: ${e(d.access && d.access.accountWall)}`, `Tested by: ${((d.access || {}).howTested || []).join(', ')}`, `Coverage: ${e((d.access || {}).coverageNote)}`, '',
    `Questions: ${qs.length} (${qs.filter(q => q.stage === 'anonymous').length} before sign-in; ${qs.filter(q => q.branches).length} branch). Flows: ${(d.flows || []).map(fl => `${fl.id} (${(fl.questions || []).length}q)`).join(', ')}`, '',
    '## Engine summary', e(d.engineSummary), '',
    '## Rules', '| id | when | then | effect | evidence | conf |', '|---|---|---|---|---|---|',
    ...(d.rules || []).map(r => `| ${r.id} | ${e(r.when)} | ${e(r.then)}${(r.affects || []).length ? ' [' + r.affects.map(i => P[i] || i).join('; ') + ']' : ''} | ${r.effectType} | ${r.evidence} | ${r.confidence} |`), '',
    '## Products', '| name | category | actives | form | for | legal | price | offered when | ev |', '|---|---|---|---|---|---|---|---|---|',
    ...(d.products || []).map(p => `| ${e(p.name)} | ${p.category} | ${e((p.actives || []).map(a => a.name + (a.strength ? ' ' + a.strength : '')).join('; '))} | ${e(p.form)} | ${p.audience} | ${e(p.legalStatus)} | ${e(p.price)} | ${e(p.recommendedWhen)} | ${p.evidence} |`), '',
    '## Who gets what', ...(d.recommendations || []).map(r => `- ${e(r.profile)} → ${(r.offered || []).map(i => P[i] || i).join('; ') || 'nothing'} [${r.evidence}] ${e(r.note).slice(0, 300)}`), '',
    '## Strengths', ...(d.strengths || []).map(x => '- ' + e(x)), '', '## Weaknesses', ...(d.weaknesses || []).map(x => '- ' + e(x)), '',
    '## Opportunities', ...(d.opportunities || []).map(x => '- ' + e(x)), '',
    '## Verification verdict', e((d.verification || {}).verdict || 'not verified'), '',
    '## Limitations', ...(d.limitations || []).map(x => '- ' + e(x)), ''];
  const md = L.join('\n'); fs.writeFileSync(path.join(OUT, slug + '.md'), md); all.push(md);
}
fs.writeFileSync(path.join(OUT, 'ALL.md'), all.join('\n\n---\n\n'));
console.log('digests:', all.length);
