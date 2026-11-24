// Stage 3: is the older rules script (inline on sons.co.uk/pages/recommendation) unchanged since stage 1?
const fs = require('fs'); const path = require('path');
const D = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(D, 'runs/verify-code-freshness/pages-recommendation.html'), 'utf8');
const ex = fs.readFileSync(path.join(D, 'recommendation-engine.excerpt.js'), 'utf8').split('\n').slice(1); // drop SOURCE header line
const norm = s => s.replace(/\s+/g, ' ').trim();
const live = norm(html);
const probes = ['if (hairLossOnset === 1)', 'if (littleInterest >= 2 || feelingDown >= 2)', 'if (existingConditions.includes(HIGH_BLOOD_PRESSURE))', 'if (existingConditions.includes(SCALP_DISORDERS))', 'if (existingConditions.includes(LACTOSE_ALLERGY))', 'const overSixtyFive = ageInYears > 65;', 'if (existingConditions.includes(PHAEOCHROMOCYTOMA))', 'if (minoxidilSideEffects === 1)'];
for (const p of probes) console.log(live.includes(norm(p)) ? 'FOUND  ' : 'MISSING', p);
// line-level: how many non-trivial excerpt lines are present in the live page?
let tot = 0, hit = 0; const miss = [];
for (const l of ex) { const n = norm(l); if (n.length < 25 || n.startsWith('//')) continue; tot++; if (live.includes(n)) hit++; else miss.push(n); }
console.log('excerpt code lines found in live page:', hit, '/', tot);
console.log(miss.slice(0, 10).join('\n'));
