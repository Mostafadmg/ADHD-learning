// cmp.js — summarise one run and compare it with a reference run. node tools/cmp.js <run> [<refRun>]
const fs = require('fs'), path = require('path');
function load(dir) {
  const f = path.join(dir, 'walk-log.json');
  if (!fs.existsSync(f)) return null;
  const l = JSON.parse(fs.readFileSync(f, 'utf8'));
  let seq = l.map(e => e.sig).filter(Boolean); const ri = seq.indexOf('107988'); if (ri >= 0) seq = seq.slice(0, ri + 1);
  const rec = l.find(e => e.sig === '107988');
  const last = l[l.length - 1];
  return { l, seq, rec, last };
}
function summ(dir, ref) {
  const r = load(dir), b = ref && fs.existsSync(ref) && path.resolve(ref) !== path.resolve(dir) ? load(ref) : null;
  if (!r) { console.log('no walk-log in ' + dir); return; }
  console.log('PATH: ' + r.seq.join(' > '));
  if (b) {
    const add = r.seq.filter(s => !b.seq.includes(s)), rem = b.seq.filter(s => !r.seq.includes(s));
    console.log('ADDED vs base: ' + (add.join(', ') || '-') + ' | REMOVED vs base: ' + (rem.join(', ') || '-'));
    for (const e of r.l) if (e.sig && !b.seq.includes(e.sig) && e.questions) for (const q of e.questions) console.log('  NEW ' + q.id + ' [' + q.type + '] ' + (q.title ? q.title + ': ' : '') + q.text.slice(0, 500) + (q.options.length && !q.cards.length ? ' || ' + q.options.join(' | ').slice(0, 300) : ''));
  }
  if (r.rec) {
    const q = r.rec.questions[0];
    console.log('REC TEXT: ' + q.text.replace(/^Dr\. Sameer Sanghvi General Practitioner \(GP\) GMC no\. 7085078 /, ''));
    if (b && b.rec) console.log('  (same text as base: ' + (b.rec.questions[0].text === q.text) + ')');
    for (const c of q.cards) console.log('  CARD ' + [c.title, c.label, '£' + c.price, c.perWeek, 'inStock=' + c.inStock, 'rec=' + c.recommended, 'pref=' + c.preference, 'main=' + c.mainOption].join(' | '));
    if (b && b.rec) {
      const t = q.cards.map(c => c.title), bt = b.rec.questions[0].cards.map(c => c.title);
      console.log('  CARDS vs base: removed [' + bt.filter(x => !t.includes(x)).join(', ') + '] added [' + t.filter(x => !bt.includes(x)).join(', ') + '] order same: ' + (t.join() === bt.filter(x => t.includes(x)).join()));
    }
  } else {
    console.log('NO RECOMMENDATION SCREEN. Last screen ' + r.last.n + ' sig=' + r.last.sig + ' title=' + r.last.title);
    const sm = r.l.filter(e => e.sig === 'SUMMARY');
    if (sm.length) console.log('  reached SUMMARY ' + sm.length + 'x; last text: ' + String(r.last.text || '').replace(/\s+/g, ' ').slice(0, 600));
  }
}
module.exports = summ;
if (require.main === module) summ(process.argv[2], process.argv[3]);
