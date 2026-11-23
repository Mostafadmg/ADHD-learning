// Runs Sons' own NEWER recommendation function offline, with no browser and no network.
// usage: node scripts/engine-run.js '<json answers>' [tags,comma,separated] [specialType]
//   answers use the survey's own keys and values, e.g.
//   {"5143":0,"3216":0,"5148":[],"What treatment type do you prefer?":2,"5155":[],"date_of_birth":"1994-06-01"}
// Output: primary card, the other cards in order, what was blocked, and the five on/off switches.
const mods = require('../engine-newer.extract.js');
const cache = {};
function req(id) { if (cache[id]) return cache[id].exports; const m = (cache[id] = { exports: {} }); mods[id](m, m.exports, req); return m.exports; }
req.d = (exp, defs) => { for (const k in defs) Object.defineProperty(exp, k, { enumerable: true, get: defs[k] }); };
req.r = () => {};
const answers = JSON.parse(process.argv[2] || '{}');
const tags = (process.argv[3] || '').split(',').filter(Boolean);
const r = req(30216).S({ consultationResults: { consult_results: answers }, customerTags: tags, marketCode: 'uk', specialType: process.argv[4] || '' });
const name = c => c.slug + (c.paired_slug ? ' (toggle: ' + c.paired_slug + ')' : '');
console.log(JSON.stringify({ primary: r.primary.map(name), secondary: r.secondary.map(name), blocked: r.blocked, switches: r.eligibilityFlags }, null, 1));
