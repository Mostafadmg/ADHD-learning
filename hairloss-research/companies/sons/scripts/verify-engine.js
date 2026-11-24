// Stage 3: independent offline re-run of Sons' newer rules (module 30216) for the highest-consequence rules.
// No network. Writes runs/verify-offline/results.json.
const fs = require('fs'); const path = require('path');
const mods = require('../engine-newer.extract.js');
const cache = {};
function req(id) { if (cache[id]) return cache[id].exports; const m = (cache[id] = { exports: {} }); mods[id](m, m.exports, req); return m.exports; }
req.d = (exp, defs) => { for (const k in defs) Object.defineProperty(exp, k, { enumerable: true, get: defs[k] }); };
req.r = () => {};
const base = { '5143': 0, '3216': 0, '5148': [], 'What treatment type do you prefer?': 2, '5155': [], date_of_birth: '1994-06-01' };
const dob = age => { const d = new Date(); d.setFullYear(d.getFullYear() - age); d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0, 10); };
const cases = {
  'v-baseline': {}, 'v-sudden': { '5143': 1 }, 'v-phq2': { '3216': 1, '3275': 2, '3276': 0 }, 'v-phq1': { '3216': 1, '3275': 1, '3276': 1 },
  'v-fin-se': { '5148': [0], '5149': 1 }, 'v-minox-se': { '5148': [1], '5151': 1 }, 'v-hbp': { '5155': [0] }, 'v-cardio': { '5155': [1] },
  'v-kidney': { '5155': [2] }, 'v-sexdys': { '5155': [8] }, 'v-scalp': { '5155': [5] }, 'v-phaeo': { '5155': [6] }, 'v-lactose': { '5155': [7] },
  'v-age65': { date_of_birth: dob(65) }, 'v-age66': { date_of_birth: dob(66) }, 'v-topical': { 'What treatment type do you prefer?': 0 },
  'v-hbp+sexdys': { '5155': [0, 8] }, 'v-picture-patches': { '5147': 2 },
};
const out = {};
for (const [id, ch] of Object.entries(cases)) {
  const r = req(30216).S({ consultationResults: { consult_results: { ...base, ...ch } }, customerTags: [], marketCode: 'uk', specialType: '' });
  out[id] = { changed: ch, primary: r.primary.map(c => c.slug), secondary: r.secondary.map(c => c.slug), switches: r.eligibilityFlags };
  console.log(id.padEnd(18), 'PRIMARY', out[id].primary.join(','), '| OTHERS', out[id].secondary.join(','));
}
const od = path.join(__dirname, '..', 'runs', 'verify-offline'); fs.mkdirSync(od, { recursive: true });
fs.writeFileSync(path.join(od, 'results.json'), JSON.stringify(out, null, 1));
