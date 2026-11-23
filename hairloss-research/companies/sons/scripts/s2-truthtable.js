// Stage 2: every combination of the answers the served recommendation code reads (2 onset x 2 PHQ x 2x2x2 side effects
// x 512 condition sets x 2 age bands = 32,768 patients), run through both copies offline. Prints each distinct set of
// switches with how many answer combinations lead to it and what is then shown. Evidence type: code.
const fs = require('fs'); const path = require('path');
const old = require('./engine-old-run.js'); const mods = require('../engine-newer.extract.js');
const cache = {}; function req(id) { if (cache[id]) return cache[id].exports; const m = (cache[id] = { exports: {} }); mods[id](m, m.exports, req); return m.exports; }
req.d = (e, d) => { for (const k in d) Object.defineProperty(e, k, { enumerable: true, get: d[k] }); }; req.r = () => {};
const PREF = 'What treatment type do you prefer?';
const dob = age => { const d = new Date(); d.setFullYear(d.getFullYear() - age); d.setMonth(d.getMonth() - 6); return d.toISOString().slice(0, 10); };
const sw = s => ['allowedOralFinasteride', 'allowedTopicalFinasteride', 'allowedOralMinoxidil', 'allowedTopicalMinoxidil', 'allowedTopicalCombo'].map(k => (s[k] ? '1' : '0')).join('');
const name = c => (c.slug || c.card) + ((c.paired_slug || c.toggle) ? '/' + (c.paired_slug || c.toggle) : '');
(async () => {
  const out = { older: {}, newer: {} }; let n = 0;
  for (const age of [32, 70]) for (const sudden of [0, 1]) for (const phq of [0, 2]) for (const f of [0, 1]) for (const m of [0, 1]) for (const c of [0, 1])
    for (let mask = 0; mask < 512; mask++) {
      const conds = []; for (let i = 0; i < 9; i++) if (mask & (1 << i)) conds.push(i);
      const a = { 5143: sudden, 3216: phq ? 1 : 0, 3275: phq, 3276: 0, 5148: [0, 1, 2], 5149: f, 5151: m, 5153: c, [PREF]: 2, 5155: conds, date_of_birth: dob(age) };
      const o = await old.run(a, []); const nw = req(30216).S({ consultationResults: { consult_results: a }, customerTags: [], marketCode: 'uk' });
      const ko = sw(o.switches), kn = sw(nw.eligibilityFlags); n++;
      (out.older[ko] = out.older[ko] || { count: 0, primary: o.primary.map(name), rest: o.additional.map(name) }).count++;
      (out.newer[kn] = out.newer[kn] || { count: 0, primary: nw.primary.map(name), rest: nw.secondary.map(name) }).count++;
    }
  out.patients = n;
  fs.writeFileSync(path.join(__dirname, '..', 'runs', 'offline', 'truthtable.json'), JSON.stringify(out, null, 1));
  for (const copy of ['older', 'newer']) { console.log('\n' + copy + ' copy: ' + Object.keys(out[copy]).length + ' distinct switch settings over ' + n + ' answer combinations (format "I don\'t mind")');
    Object.entries(out[copy]).sort((x, y) => y[1].count - x[1].count).forEach(([k, v]) => console.log('  ' + k + '  x' + String(v.count).padStart(5) + '  primary: ' + v.primary.join(' + ') + '  | rest: ' + v.rest.join(' · '))); }
})();
