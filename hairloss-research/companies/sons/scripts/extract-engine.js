// Cuts the two webpack modules that make up the NEWER recommendation engine out of the prettified chunks,
// unchanged, and writes them to engine-newer.extract.js so they can be run offline (see engine-run.js).
//   module 38496 (plan order lists, pairings, answer codes)  from src/chunks/1234-*.pretty.js
//   module 30216 (the function that filters the list)        from src/chunks/app__recommendation__page-*.pretty.js
const fs = require('fs'); const path = require('path'); const ROOT = path.join(__dirname, '..');
const cut = (file, startMarker, endMarker) => { const s = fs.readFileSync(path.join(ROOT, file), 'utf8'); const a = s.indexOf(startMarker); const b = s.indexOf(endMarker, a); if (a < 0 || b < 0) throw new Error('marker not found in ' + file); return s.slice(a + startMarker.length - 'function (e, i, t) {'.length, b).replace(/,\s*$/, ''); };
const m38496 = cut('src/chunks/1234-6277a6fc5802d9fd.pretty.js', '38496: function (e, i, t) {', '17502: function (e, i, t) {');
const s2 = fs.readFileSync(path.join(ROOT, 'src/chunks/app__recommendation__page-9574552c5f8ec4c0.pretty.js'), 'utf8');
const a = s2.indexOf('30216: function (e, t, i) {'); const b = s2.indexOf('54275: function () {}', a);
const m30216 = s2.slice(a + '30216: '.length, b).replace(/,\s*$/, '');
fs.writeFileSync(path.join(ROOT, 'engine-newer.extract.js'),
  '// VERBATIM (only re-indented by prettier) from code served to anonymous visitors by shop.sons.co.uk on 2026-11-23.\n' +
  '// Module 38496 = lists and pairings; module 30216 = function S({consultationResults, customerTags, marketCode, chosenProduct, specialType, rawRecommendations}).\n' +
  'module.exports = {\n38496: ' + m38496.trim().replace(/,$/, '') + ',\n30216: ' + m30216.trim().replace(/,$/, '') + '\n};\n');
console.log('wrote engine-newer.extract.js', m38496.length, m30216.length);
