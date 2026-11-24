#!/usr/bin/env node
/* build-site.js — turn companies/<slug>/company.json into:
 *   site/data/<slug>.json   (what the report page loads for one company)
 *   site/data/index.json    (summary of every company + the "who sells what" matrix)
 *   reports/<slug>.md       (a readable report per company)
 *   reports/README.md       (index of the reports)
 * Usage: node tools/build-site.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const CO = path.join(ROOT, 'companies');
const OUT = path.join(ROOT, 'site', 'data');
const REP = path.join(ROOT, 'reports');
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(REP, { recursive: true });

// order and grouping of companies in the report
const ORDER = ['hims-uk', 'voy', 'hair-and-me', 'sons', 'numan', 'treated', 'dr-fox', 'philip-kingsley', 'oxford-online-pharmacy', 'superdrug-online-doctor', 'boots-online-doctor', 'lloyds-online-doctor',
  'hims-us', 'hers-us', 'keeps', 'ro', 'happy-head', 'strut', 'musely', 'xyon', 'oana', 'nutrafol', 'pilot'];
const GROUP = s => ['hims-uk', 'voy', 'hair-and-me', 'sons', 'numan', 'treated', 'dr-fox', 'philip-kingsley'].includes(s) ? 'UK specialists'
  : ['oxford-online-pharmacy', 'superdrug-online-doctor', 'boots-online-doctor', 'lloyds-online-doctor'].includes(s) ? 'UK pharmacies and online doctors'
  : ['pilot'].includes(s) ? 'Rest of world' : 'United States';

const EFFECT_LABEL = { 'none': 'No effect', 'next-question': 'Next question', 'extra-questions': 'Adds questions', 'skip-questions': 'Skips questions', 'hard-stop': 'Stops the patient', 'soft-warning': 'Shows a warning', 'product-removed': 'Removes a product', 'product-added': 'Adds a product', 'product-switched': 'Switches product', 'strength-changed': 'Changes strength', 'flag-for-clinician': 'Flags for the clinician', 'marketing-only': 'Marketing only', 'unknown': 'Unknown' };

// ---- "who sells what" matrix -------------------------------------------------
const ACTIVES = [
  ['finasteride', /finasteride/i], ['dutasteride', /dutasteride/i], ['minoxidil', /minoxidil/i], ['spironolactone', /spironolactone/i],
  ['tretinoin', /tretinoin|retinoic/i], ['ketoconazole', /ketoconazole/i], ['latanoprost / bimatoprost', /latanoprost|bimatoprost/i],
  ['melatonin', /melatonin/i], ['caffeine', /caffeine/i], ['cetirizine', /cetirizine/i], ['biotin', /biotin/i], ['saw palmetto', /saw palmetto|serenoa/i],
];
const isOral = p => /oral/.test(p.category) || /tablet|capsule|chew|gumm|pill|softgel|oral|sublingual|lozenge|troche/i.test(p.form || '');
function matrixFor(d) {
  const cells = {};
  for (const p of d.products || []) {
    if (p.category === 'service') continue;
    const rx = /^rx/.test(p.category), comp = /compounded/.test(p.category) || /compound|special|unlicensed/i.test(p.legalStatus || '');
    for (const a of p.actives || []) {
      for (const [name, re] of ACTIVES) {
        if (!re.test(a.name || '')) continue;
        let route = isOral(p) ? 'oral' : 'topical';
        if (p.category === 'bundle') route = /tablet|capsule|oral/i.test((a.form || '') + ' ' + (a.name || '')) ? 'oral' : (/spray|solution|foam|serum|topical|drops|gel/i.test((a.form || '') + ' ' + (a.name || '')) ? 'topical' : null);
        if (/oral/i.test(a.name || '')) route = 'oral'; if (/topical/i.test(a.name || '')) route = 'topical';
        if (!route) continue;
        const key = `${name}|${route}`;
        const c = cells[key] = cells[key] || { strengths: new Set(), compounded: false, rx: false, combos: 0, products: [] };
        if (a.strength) c.strengths.add(String(a.strength).trim());
        c.compounded = c.compounded || comp; c.rx = c.rx || rx;
        if ((p.actives || []).length > 1) c.combos++;
        c.products.push(p.name);
      }
    }
  }
  const out = {};
  for (const k of Object.keys(cells)) out[k] = { strengths: [...new Set([...cells[k].strengths].map(x => x.split('(')[0].trim()).filter(x => x && x.length <= 18))].slice(0, 6), compounded: cells[k].compounded, rx: cells[k].rx, combos: cells[k].combos, n: cells[k].products.length };
  return out;
}

// ---- helpers ------------------------------------------------------------------
const count = (arr, f) => arr.reduce((n, x) => n + (f(x) ? 1 : 0), 0);
const tally = (arr, f) => arr.reduce((m, x) => { const k = f(x); m[k] = (m[k] || 0) + 1; return m; }, {});
const mdEsc = s => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n+/g, ' ');
const clip = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };

function summarise(d) {
  const qs = (d.flows || []).flatMap(f => (f.questions || []).map(q => ({ ...q, flow: f.id })));
  const opts = qs.flatMap(q => q.options || []);
  const rules = d.rules || [];
  const deciding = q => q.branches || (q.options || []).some(o => !['none', 'next-question', 'marketing-only', 'unknown'].includes(o.effectType));
  return {
    slug: d.slug, company: d.company, market: d.market, group: GROUP(d.slug), website: d.website, parent: d.parent || null,
    audiences: d.audiences || [], model: d.model, checkedOn: d.checkedOn,
    howTested: (d.access || {}).howTested || [], accountWall: (d.access || {}).accountWall || null, blockers: ((d.access || {}).blockers || []).length,
    coverageNote: (d.access || {}).coverageNote || '',
    counts: {
      products: (d.products || []).filter(p => p.category !== 'service').length, flows: (d.flows || []).length, questions: qs.length,
      anonymousQuestions: count(qs, q => q.stage === 'anonymous'), decidingQuestions: count(qs, deciding), options: opts.length,
      rules: rules.length, hardStops: count(rules, r => r.effectType === 'hard-stop'), experiments: (d.experiments || []).length,
      profiles: (d.recommendations || []).length,
    },
    ruleEvidence: tally(rules, r => r.evidence), ruleEffects: tally(rules, r => r.effectType),
    productCategories: tally((d.products || []).filter(p => p.category !== 'service'), p => p.category),
    engineSummary: d.engineSummary || '', verdict: (d.verification || {}).verdict || '', verified: !!d.verification,
    matrix: matrixFor(d),
    topOpportunities: (d.opportunities || []).slice(0, 3),
  };
}

function report(d, s) {
  const L = [];
  const P = Object.fromEntries((d.products || []).map(p => [p.id, p.name]));
  const names = ids => (ids || []).map(i => P[i] || i).join(', ');
  L.push(`# ${d.company}: consultation and product report`, '');
  L.push(`**Market:** ${d.market} · **Website:** ${d.website} · **Checked:** ${d.checkedOn}${d.parent ? ` · **Owner:** ${mdEsc(d.parent)}` : ''}`, '');
  L.push(`> ${d.model}`, '');
  L.push('## 1. How far this could be tested', '');
  L.push(`- **Tested by:** ${(d.access.howTested || []).join(', ') || 'unknown'}`);
  L.push(`- **Account wall:** ${d.access.accountWall || 'none found'}`);
  (d.access.blockers || []).forEach(b => L.push(`- **Blocker:** ${b}`));
  L.push('', d.access.coverageNote || '', '');
  L.push('Evidence labels used below: **observed** (seen in a live replay), **code** (read in the site\'s own served code), **docs** (the company says so publicly), **inferred** (reasoned, not seen).', '');
  if (d.engineSummary) L.push('## 2. How the engine decides (short version)', '', d.engineSummary, '');
  L.push(`## 3. Engine rules (${(d.rules || []).length})`, '');
  if ((d.rules || []).length) {
    L.push('| # | Route | When | Then | Effect | Evidence | Confidence |', '|---|---|---|---|---|---|---|');
    d.rules.forEach(r => L.push(`| ${r.id} | ${r.flow} | ${mdEsc(r.when)} | ${mdEsc(r.then)}${(r.affects || []).length ? ` _(affects: ${mdEsc(names(r.affects))})_` : ''} | ${EFFECT_LABEL[r.effectType] || r.effectType} | ${r.evidence} | ${r.confidence} |`));
  } else L.push('No rules could be derived.');
  L.push('', `## 4. Products (${s.counts.products})`, '');
  L.push('| Product | Type | Actives and strengths | Form | For | Legal status | Price | Offered when | Evidence |', '|---|---|---|---|---|---|---|---|---|');
  (d.products || []).forEach(p => L.push(`| ${p.url ? `[${mdEsc(p.name)}](${p.url})` : mdEsc(p.name)} | ${p.category} | ${mdEsc((p.actives || []).map(a => a.name + (a.strength ? ' ' + a.strength : '')).join('; ') || 'n/a')} | ${mdEsc(p.form)} | ${p.audience} | ${mdEsc(p.legalStatus)} | ${mdEsc(p.price)}${p.priceDetail ? ` (${mdEsc(clip(p.priceDetail, 220))})` : ''} | ${mdEsc(p.recommendedWhen)} | ${p.evidence} |`));
  L.push('', `## 5. Who gets what (${(d.recommendations || []).length} patient profiles)`, '');
  (d.recommendations || []).forEach(r => L.push(`- **${r.profile}** → ${names(r.offered) || 'nothing offered'}${r.default ? ` (default: ${P[r.default] || r.default})` : ''}. ${r.note || ''} _[${r.evidence}]_`));
  L.push('', '## 6. The consultation, question by question', '');
  (d.flows || []).forEach(f => {
    L.push(`### ${f.name}`, '', `Entry: ${f.entryUrl}`, '', f.stagesSummary, '');
    (f.questions || []).slice().sort((a, b) => a.order - b.order).forEach(q => {
      L.push(`**${q.order}. ${mdEsc(q.text)}**  `);
      L.push(`_${q.type} · ${q.stage} · role: ${q.engineRole} · shown: ${mdEsc(q.shownWhen)} · ${q.branches ? 'BRANCHES' : 'no branch'} · ${q.evidence}_  `);
      L.push(`Why they ask: ${q.purpose}${q.branchDetail ? `  \nDownstream: ${q.branchDetail}` : ''}`, '');
      (q.options || []).forEach(o => L.push(`- \`${mdEsc(o.label)}\` → **${EFFECT_LABEL[o.effectType] || o.effectType}**: ${mdEsc(o.effect)}${(o.affects || []).length ? ` _(affects: ${mdEsc(names(o.affects))})_` : ''} _[${o.evidence}]_`));
      L.push('');
    });
  });
  L.push('## 7. Competitive read', '');
  L.push('**Strengths**', '', ...(d.strengths || []).map(x => `- ${x}`), '');
  L.push('**Weaknesses**', '', ...(d.weaknesses || []).map(x => `- ${x}`), '');
  L.push('**Gaps a new competitor could use**', '', ...(d.opportunities || []).map(x => `- ${x}`), '');
  if ((d.experiments || []).length) {
    L.push(`## 8. Experiments run (${d.experiments.length})`, '', '| Id | Route | What was changed | What happened |', '|---|---|---|---|');
    d.experiments.forEach(x => L.push(`| ${x.id} | ${x.flow} | ${mdEsc(x.changed)} | ${mdEsc(x.result)} |`));
    L.push('');
  }
  if (d.verification) {
    L.push('## 9. Independent verification', '', d.verification.verdict || '', '');
    L.push('**Re-checked**', '', ...(d.verification.checked || []).map(x => `- ${x}`), '');
    L.push('**Corrected**', '', ...(d.verification.corrected || []).map(x => `- ${x}`), '');
    L.push('**Still unverified**', '', ...(d.verification.stillUnverified || []).map(x => `- ${x}`), '');
  }
  L.push('## 10. Limits of this report', '', ...(d.limitations || []).map(x => `- ${x}`), '');
  L.push('## 11. Sources', '', ...(d.sources || []).map(x => `- [${mdEsc(x.title || x.url)}](${x.url})`), '');
  return L.join('\n');
}

// ---- main ---------------------------------------------------------------------
const onlyArg = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null;   // --only a,b,c  limits the site to these companies
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.json')) fs.unlinkSync(path.join(OUT, f));
const slugs = fs.readdirSync(CO).filter(s => fs.existsSync(path.join(CO, s, 'company.json')) && (!onlyArg || onlyArg.includes(s)));
slugs.sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99) || a.localeCompare(b));
const index = [];
for (const slug of slugs) {
  let d;
  try { d = JSON.parse(fs.readFileSync(path.join(CO, slug, 'company.json'), 'utf8')); } catch (e) { console.log(`skip ${slug}: ${e.message}`); continue; }
  if (!d.access || !Array.isArray(d.products)) { console.log(`skip ${slug}: incomplete`); continue; }
  const s = summarise(d);
  index.push(s);
  // per-company file for the page: drop bulky fields the page does not show
  const slim = { ...d };
  slim.experiments = (d.experiments || []).map(x => ({ id: x.id, flow: x.flow, changed: x.changed, result: x.result }));
  fs.writeFileSync(path.join(OUT, slug + '.json'), JSON.stringify(slim));
  fs.writeFileSync(path.join(REP, slug + '.md'), report(d, s));
  console.log(`${slug}: ${s.counts.products} products, ${s.counts.questions} questions, ${s.counts.rules} rules${s.verified ? ', verified' : ''}`);
}
const cols = [];
for (const [name] of ACTIVES) for (const route of ['oral', 'topical']) { const key = `${name}|${route}`; if (index.some(s => s.matrix[key])) cols.push({ key, name, route }); }
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ built: new Date().toISOString().slice(0, 10), effectLabels: EFFECT_LABEL, matrixColumns: cols, companies: index }));
fs.writeFileSync(path.join(REP, 'README.md'), ['# Company reports', '', '| Company | Market | Products | Questions | Rules | Verified |', '|---|---|---|---|---|---|',
  ...index.map(s => `| [${s.company}](${s.slug}.md) | ${s.market} | ${s.counts.products} | ${s.counts.questions} | ${s.counts.rules} | ${s.verified ? 'yes' : 'not yet'} |`), ''].join('\n'));
// ---- documents: background research + the new-company plan ----------------------
const DOCS = [
  ['blueprint', 'plan', 'The plan', 'blueprint/plan.md'], ['blueprint', 'products', 'Product range', 'blueprint/products.md'], ['blueprint', 'engine', 'Consultation engine', 'blueprint/engine.md'],
  ['blueprint', 'launch', 'Launch and numbers', 'blueprint/launch.md'], ['blueprint', 'risks', 'Rules and risks', 'blueprint/risks.md'],
  ['evidence', 'synthesis', 'What the research shows', 'synthesis/cross-company.md'],
  ['evidence', 'clinical-men', 'Evidence: men', 'foundations/clinical-men.md'], ['evidence', 'clinical-women', 'Evidence: women', 'foundations/clinical-women.md'],
  ['evidence', 'uk-regulation', 'UK rules', 'foundations/uk-regulation.md'], ['evidence', 'customer-voice', 'What customers say', 'foundations/customer-voice.md'],
  ['evidence', 'market-economics', 'Market and money', 'foundations/market-economics.md'], ['evidence', 'uk-sweep', 'Other UK sellers', 'market/uk-sweep.md'], ['evidence', 'us-intl-sweep', 'Other sellers worldwide', 'market/us-intl-sweep.md'],
];
const docs = [];
// documents are only included with --docs (use it once they have been fact-checked)
for (const [kind, id, title, rel] of (process.argv.includes('--docs') ? DOCS : [])) {
  const f = path.join(ROOT, rel); if (!fs.existsSync(f)) continue;
  const markdown = fs.readFileSync(f, 'utf8'); if (markdown.trim().length < 200) continue;
  fs.writeFileSync(path.join(OUT, `doc-${id}.json`), JSON.stringify({ id, title, markdown }));
  docs.push({ kind, id, title, file: `doc-${id}.json` });
}
fs.writeFileSync(path.join(OUT, 'docs.json'), JSON.stringify(docs));
const fj = path.join(ROOT, 'synthesis', 'findings.json'); if (fs.existsSync(fj)) fs.copyFileSync(fj, path.join(OUT, 'findings.json'));
console.log(`\nbuilt ${index.length} companies and ${docs.length} documents -> site/data, reports/`);
