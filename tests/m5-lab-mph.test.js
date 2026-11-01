/* Test for js/m5-lab-mph.js: loads the data file with a stub window and checks every conversion against the research
   (UK SmPCs on emc, SPS updated 28 Aug 2025, MHRA Drug Safety Update 26 Sep 2022), read 1 Nov 2026.
   Run:  node tests/m5-lab-mph.test.js */
'use strict';
var fs = require('fs'), path = require('path'), assert = require('assert'), vm = require('vm');
var def = null;
var win = { M5LAB: { add: function (id, d) { assert.strictEqual(id, 'mph'); def = d; } } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'js', 'm5-lab-mph.js'), 'utf8'), { window: win });
assert.ok(def && def.tabs && def.tabs.length === 2, 'two tabs registered');
var conv = def.tabs[0], safe = def.tabs[1];
assert.strictEqual(conv.kind, 'tool'); assert.strictEqual(safe.kind, 'tool');
var fails = 0, n = 0;
function t(name, fn) { n++; try { fn(); } catch (e) { fails++; console.log('FAIL ' + name + '\n  ' + e.message); } }
function C(o) { return conv.compute(Object.assign({ who: 'adult', from: 'ir', to: 'tab', ird: 10, irn: '3', mr: '36' }, o)); }
function S(f, to) { return safe.compute({ from: f, to: to }); }
function txt(r) { return [r.head, (r.rows || []).map(function (x) { return x.h + ' ' + x.t; }).join(' '), (r.notes || []).join(' '), r.src || ''].join(' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '); }
function has(r, s) { assert.ok(txt(r).indexOf(s) >= 0, 'expected text "' + s + '" in: ' + txt(r).slice(0, 500)); }
var BADGES = ['SmPC table', 'SmPC statement', 'SPS equivalence', 'Guideline (no numbers)', 'Worked out from the SmPC table (not official)', 'No official conversion', 'Same product'];
var WORKED = 'Worked out from the SmPC table (not official)';

/* ---- IR to Concerta XL-type tablets: SmPC Table 1 (IR three times a day) ---- */
[[5, 18], [10, 36], [15, 54], [20, 72]].forEach(function (p) {
  t('IR ' + p[0] + ' mg TDS -> tab ' + p[1], function () {
    var r = C({ ird: p[0], irn: '3', to: 'tab' });
    assert.strictEqual(r.badge, 'SmPC table'); assert.strictEqual(r.tone, 'ok');
    has(r, p[1] + ' mg once a day'); assert.ok(r.chart && r.chart.kind === 'day');
    var kx = C({ ird: p[0], irn: '3', to: 'kixel' }); assert.strictEqual(kx.badge, 'SmPC table'); has(kx, p[1] + ' mg once a day'); has(kx, 'not on any SPS list');
  });
});
t('IR 10 mg BD -> tab: no table row, clinical judgement', function () {
  var r = C({ ird: 10, irn: '2', to: 'tab' }); assert.strictEqual(r.badge, 'SmPC statement'); assert.strictEqual(r.tone, 'warn');
  has(r, 'no row in the table'); has(r, 'between the 15 mg a day row (18 mg) and the 30 mg a day row (36 mg)'); has(r, 'clinical judgement');
});
t('IR 15 mg BD (30 a day) -> tab: matches the 30 row but not the shape', function () { has(C({ ird: 15, irn: '2', to: 'tab' }), 'matches the 30 mg a day row (36 mg), but that row is for three doses a day'); });
t('IR 25 mg TDS -> tab: above the table', function () { var r = C({ ird: 25, irn: '3', to: 'tab' }); assert.strictEqual(r.badge, 'SmPC statement'); has(r, 'above the table'); has(r, 'licensed maximum of 72 mg'); });
t('child 20 mg TDS -> tab 72 mg is above 54 mg', function () { var r = C({ who: 'child', ird: 20, irn: '3', to: 'tab' }); assert.strictEqual(r.tone, 'warn'); has(r, 'above the licensed maximum of 54 mg a day for children'); });
t('Matoride three-row note at 72 mg', function () { has(C({ ird: 20, irn: '3', to: 'tab' }), 'Matoride XL'); });
t('tab text says Matoride prints three rows and Delmosart unread', function () { var r = C({ ird: 5, irn: '3', to: 'tab' }); has(r, 'Matoride XL prints only the first three rows'); });

/* ---- IR to Ritalin XL-type capsules: SmPC Table 1 (IR twice a day, same total daily dose) ---- */
[[5, 10], [10, 20], [15, 30], [20, 40], [30, 60]].forEach(function (p) {
  t('IR ' + p[0] + ' mg BD -> cap ' + p[1], function () { var r = C({ ird: p[0], irn: '2', to: 'cap' }); assert.strictEqual(r.badge, 'SmPC table'); assert.strictEqual(r.tone, 'ok'); has(r, 'capsule ' + p[1] + ' mg once a day'); });
});
t('IR 25 mg BD -> cap 50 is a rule, not a table row', function () { var r = C({ ird: 25, irn: '2', to: 'cap' }); assert.strictEqual(r.badge, 'SmPC statement'); has(r, 'capsule 50 mg once a day'); });
t('IR 10 mg TDS -> cap: clinical judgement', function () { var r = C({ ird: 10, irn: '3', to: 'cap' }); assert.strictEqual(r.badge, 'SmPC statement'); assert.strictEqual(r.tone, 'warn'); has(r, 'clinical judgment should be used when selecting the starting dose'); has(r, '30 mg a day'); });
t('IR 30 mg BD child -> 60 ok', function () {
  var r = C({ who: 'child', ird: 30, irn: '2', to: 'cap' }); assert.strictEqual(r.tone, 'ok'); has(r, 'capsule 60 mg');
  assert.strictEqual(C({ ird: 30, irn: '3', to: 'cap' }).badge, 'SmPC statement');
});

/* ---- IR to Medikinet XL / Ambinet XL / Equasym XL / Addepta XL: milligram-equivalent daily dose ---- */
t('IR 10 mg BD -> Medikinet XL adult: 20 mg a day in two doses', function () {
  var r = C({ ird: 10, irn: '2', to: 'mkxl' }); assert.strictEqual(r.badge, 'SmPC statement'); assert.strictEqual(r.tone, 'ok');
  has(r, 'Medikinet XL 20 mg a day in two doses, morning and lunchtime'); has(r, '20 mg of Medikinet XL takes the place of 10 mg at breakfast plus 10 mg at lunchtime');
  assert.strictEqual(r.chart.series[0].doses.length, 2); assert.strictEqual(r.chart.series[0].doses[0].mg, 10);
});
t('IR 10 mg BD -> Medikinet XL child: one morning dose', function () {
  var r = C({ who: 'child', ird: 10, irn: '2', to: 'mkxl' }); has(r, 'one dose in the morning'); assert.strictEqual(r.chart.series[0].doses.length, 1); assert.strictEqual(r.chart.series[0].doses[0].mg, 20);
});
t('IR -> Ambinet XL: statement + not on SPS list', function () { var r = C({ ird: 10, irn: '2', to: 'ambi' }); assert.strictEqual(r.badge, 'SmPC statement'); has(r, 'not on any SPS list'); });
t('IR -> Equasym XL adult is off-label (amber); child ok', function () {
  var a = C({ ird: 10, irn: '2', to: 'eqxl' }); assert.strictEqual(a.badge, 'SmPC statement'); assert.strictEqual(a.tone, 'warn'); has(a, 'Off-label in adults'); has(a, 'Equasym XL 20 mg once a day');
  var c = C({ who: 'child', ird: 10, irn: '2', to: 'eqxl' }); assert.strictEqual(c.tone, 'ok'); has(c, '10 mg once a day may replace IR 5 mg twice a day');
});
t('IR 5 mg TDS -> Equasym XL 15 mg cannot be made up from 10/20/30 mg capsules', function () { has(C({ who: 'child', ird: 5, irn: '3', to: 'eqxl' }), 'cannot be made up exactly'); });
t('IR -> Addepta XL: not launched (SPS 28 Aug 2025)', function () { var r = C({ who: 'child', ird: 10, irn: '2', to: 'addepta' }); has(r, 'not yet launched'); assert.strictEqual(r.badge, 'SmPC statement'); });

/* ---- IR to Tuzulby: SmPC examples (IR twice daily), same total, max 60 ---- */
[[10, 20], [15, 30], [20, 40], [30, 60]].forEach(function (p) {
  t('IR ' + p[0] + ' mg BD -> Tuzulby ' + p[1], function () { var r = C({ who: 'child', ird: p[0], irn: '2', to: 'tuz' }); assert.strictEqual(r.badge, 'SmPC table'); has(r, 'Tuzulby ' + p[1] + ' mg once a day'); has(r, 'chewed'); });
});
t('IR 5 mg BD -> Tuzulby 10: SmPC rule, not a row', function () { var r = C({ who: 'child', ird: 5, irn: '2', to: 'tuz' }); assert.strictEqual(r.badge, 'SmPC statement'); has(r, 'Tuzulby 10 mg once a day'); });
t('Tuzulby adult is not indicated', function () { var r = C({ ird: 10, irn: '2', to: 'tuz' }); has(r, 'Off-label in adults'); assert.strictEqual(r.tone, 'warn'); });
t('IR to IR: no source', function () { var r = C({ to: 'ir' }); assert.strictEqual(r.badge, 'No official conversion'); has(r, 'no source says they are interchangeable by dose'); assert.ok(!r.chart); });

/* ---- MR to IR ---- */
t('Concerta XL-type 18 mg -> 15 mg a day IR (SPS equivalence)', function () { var r = C({ from: 'tab', to: 'ir', mr: '18' }); assert.strictEqual(r.badge, 'SPS equivalence'); has(r, 'equivalent to a total daily dose of 15mg IR'); has(r, 'IR 5 mg three times a day (15 mg a day)'); });
[[36, 10, 30], [54, 15, 45], [72, 20, 60]].forEach(function (p) {
  t('Concerta XL-type ' + p[0] + ' -> IR ' + p[1] + ' TDS worked out', function () { var r = C({ from: 'tab', to: 'ir', mr: String(p[0]) }); assert.strictEqual(r.badge, WORKED); assert.strictEqual(r.tone, 'warn'); has(r, 'IR ' + p[1] + ' mg three times a day (' + p[2] + ' mg a day)'); has(r, 'No official MR-to-IR table exists'); has(r, 'arithmetic, not guidance'); has(r, 'individualised approach'); });
});
[27, 45].forEach(function (d) { t('Concerta XL-type ' + d + ' mg: no source', function () { var r = C({ from: 'tab', to: 'ir', mr: String(d) }); assert.strictEqual(r.badge, 'No official conversion'); assert.strictEqual(r.tone, 'stop'); has(r, 'no source gives a figure'); assert.ok(!r.chart); }); });
t('Kixel XL 18 mg is worked out (not on the SPS list)', function () { assert.strictEqual(C({ from: 'kixel', to: 'ir', mr: '18' }).badge, WORKED); });
[[10, 5], [20, 10], [30, 15], [40, 20], [60, 30]].forEach(function (p) {
  t('capsule ' + p[0] + ' -> IR ' + p[1] + ' mg BD worked out', function () { var r = C({ from: 'cap', to: 'ir', mr: String(p[0]) }); assert.strictEqual(r.badge, WORKED); has(r, 'IR ' + p[1] + ' mg twice a day (' + p[0] + ' mg a day)'); has(r, 'Metyrol XL 10 mg once a day is equivalent to a total daily dose of 10 mg IR'); });
});
t('Medikinet XL 10 mg -> IR 10 mg a day (SPS equivalence)', function () { var r = C({ from: 'mkxl', to: 'ir', mr: '10' }); assert.strictEqual(r.badge, 'SPS equivalence'); has(r, 'Medikinet XL 10mg once daily is equivalent to a total daily dose of 10mg IR'); });
t('Medikinet XL 20 mg -> IR 10 mg BD worked out', function () { var r = C({ from: 'mkxl', to: 'ir', mr: '20' }); assert.strictEqual(r.badge, WORKED); has(r, 'IR 10 mg twice a day (20 mg a day)'); });
t('Equasym XL 10 mg -> SPS equivalence; 30 mg worked out', function () {
  assert.strictEqual(C({ who: 'child', from: 'eqxl', to: 'ir', mr: '10' }).badge, 'SPS equivalence');
  var r = C({ who: 'child', from: 'eqxl', to: 'ir', mr: '30' }); assert.strictEqual(r.badge, WORKED); has(r, 'IR 15 mg twice a day (30 mg a day)');
});
t('Ambinet XL 10 and Addepta XL 10 are worked out, not SPS (not on SPS lists)', function () { assert.strictEqual(C({ from: 'ambi', to: 'ir', mr: '10' }).badge, WORKED); assert.strictEqual(C({ who: 'child', from: 'addepta', to: 'ir', mr: '10' }).badge, WORKED); });
t('Tuzulby 40 -> IR 20 mg BD worked out', function () { var r = C({ who: 'child', from: 'tuz', to: 'ir', mr: '40' }); assert.strictEqual(r.badge, WORKED); has(r, 'IR 20 mg twice a day (40 mg a day)'); has(r, 'borrows the shape'); });
t('MR to IR adult notes: Ritalin tablets, Meflynate/Focusim and Medikinet wording', function () {
  has(C({ from: 'cap', to: 'ir', mr: '20' }), 'say only the modified-release form should be used in adults');
  has(C({ from: 'mkxl', to: 'ir', mr: '20' }), 'In adults, only Medikinet XL should be used');
  has(C({ from: 'tab', to: 'ir', mr: '36' }), 'Ritalin tablets are the IR tablet licensed in adults');
});
t('MR to IR carries the SPS misuse and referral advice', function () { var r = C({ from: 'tab', to: 'ir', mr: '36' }); has(r, 'ore risk of misuse and diversion'); has(r, 'referral back to, the specialist who started treatment'); });

/* ---- MR to MR ---- */
t('tab -> tab same SPS group', function () { var r = C({ from: 'tab', to: 'tab', mr: '36' }); assert.strictEqual(r.badge, 'SPS equivalence'); assert.strictEqual(r.tone, 'ok'); has(r, 'same dose, same quantity'); has(r, 'Matoride XL is children 6+ only'); has(r, 'go back to the usual brand'); has(r, 'No UK SmPC could be read for Delmosart'); });
t('cap -> cap same SPS group', function () { var r = C({ from: 'cap', to: 'cap', mr: '20' }); assert.strictEqual(r.badge, 'SPS equivalence'); has(r, 'sucrose content'); });
t('tab <-> cap: no official conversion', function () {
  [C({ from: 'tab', to: 'cap', mr: '36' }), C({ from: 'cap', to: 'tab', mr: '20' })].forEach(function (r) { assert.strictEqual(r.badge, 'No official conversion'); assert.strictEqual(r.tone, 'stop'); has(r, 'follow the specific dosage recommendations for each formulation'); has(r, 'frequent switching between products should be avoided'); });
});
t('Medikinet XL <-> capsule group: guideline, particular care', function () {
  [C({ from: 'mkxl', to: 'cap', mr: '20' }), C({ from: 'cap', to: 'mkxl', mr: '20' })].forEach(function (r) { assert.strictEqual(r.badge, 'Guideline (no numbers)'); assert.strictEqual(r.tone, 'warn'); has(r, 'not completely bioequivalent with the other four'); });
});
t('Anything with Equasym XL: do not switch', function () {
  ['tab', 'cap', 'mkxl', 'ambi', 'addepta', 'tuz', 'kixel'].forEach(function (o) {
    var a = C({ who: 'child', from: 'eqxl', to: o, mr: '20' }), b = C({ who: 'child', from: o, to: 'eqxl', mr: String(o === 'tuz' ? 20 : (o === 'tab' || o === 'kixel' ? 18 : 10)) });
    [a, b].forEach(function (r) { assert.strictEqual(r.badge, 'No official conversion'); assert.strictEqual(r.tone, 'stop'); has(r, 'should not be switched to or prescribed generically'); });
  });
});
t('products on no SPS list: no conversion', function () {
  [['ambi', 'mkxl'], ['mkxl', 'ambi'], ['kixel', 'tab'], ['tab', 'kixel'], ['tuz', 'cap'], ['addepta', 'tab'], ['ambi', 'cap']].forEach(function (p) {
    var r = C({ who: 'child', from: p[0], to: p[1], mr: String(p[0] === 'tab' || p[0] === 'kixel' ? 18 : (p[0] === 'tuz' ? 20 : 10)) });
    assert.strictEqual(r.badge, 'No official conversion'); assert.strictEqual(r.tone, 'stop'); has(r, 'not on any SPS list'); has(r, 'prescribe methylphenidate MR products by brand');
  });
});
t('same non-group product is not a conversion', function () { assert.strictEqual(C({ from: 'mkxl', to: 'mkxl', mr: '20' }).badge, 'Same product'); });

/* ---- the traffic light ---- */
t('traffic light: green / amber / red', function () {
  assert.strictEqual(S('tab', 'tab').tone, 'ok'); assert.strictEqual(S('cap', 'cap').tone, 'ok');
  assert.strictEqual(S('ir', 'tab').tone, 'ok'); assert.strictEqual(S('ir', 'cap').tone, 'ok');
  assert.strictEqual(S('mkxl', 'cap').tone, 'warn'); assert.strictEqual(S('cap', 'mkxl').tone, 'warn');
  assert.strictEqual(S('tab', 'ir').tone, 'warn'); assert.strictEqual(S('eqxl', 'ir').tone, 'warn');
  assert.strictEqual(S('eqxl', 'mkxl').tone, 'stop'); assert.strictEqual(S('tab', 'eqxl').tone, 'stop'); assert.strictEqual(S('tab', 'cap').tone, 'stop'); assert.strictEqual(S('ambi', 'mkxl').tone, 'stop'); assert.strictEqual(S('tuz', 'kixel').tone, 'stop');
  assert.ok(/^Green: /.test(S('tab', 'tab').head)); assert.ok(/^Amber: /.test(S('mkxl', 'cap').head)); assert.ok(/^Red: /.test(S('tab', 'cap').head));
  has(S('mkxl', 'cap'), 'particular care'); has(S('eqxl', 'tab'), 'No other MR products are bioequivalent to Equasym XL');
});

/* ---- every combination runs, every badge is honest, no section tags, no emoji ---- */
t('exhaustive run', function () {
  var ks = ['ir', 'tab', 'cap', 'mkxl', 'ambi', 'eqxl', 'addepta', 'tuz', 'kixel'], count = 0;
  ['adult', 'child'].forEach(function (w) {
    ks.forEach(function (f) {
      ks.forEach(function (to) {
        var V = { who: w, from: f, to: to, ird: 10, irn: '3', mr: '10' };
        var fo = conv.fields.filter(function (x) { return x.id === 'mr'; })[0].options(V);
        var doses = f === 'ir' ? [[5, '2'], [10, '2'], [10, '3'], [30, '2'], [30, '3'], [5, '3']] : fo.map(function (o) { return [10, '3', o.v]; });
        doses.forEach(function (d) {
          var v = Object.assign({}, V, { ird: d[0], irn: d[1] }); if (d[2]) v.mr = d[2];
          var r = conv.compute(v); count++;
          assert.ok(BADGES.indexOf(r.badge) >= 0, 'badge ' + r.badge);
          assert.ok(['ok', 'info', 'warn', 'stop'].indexOf(r.tone) >= 0);
          var all = txt(r);
          assert.ok(!/(SmPC|section) ?[0-9]\.[0-9]/.test(all) && !/NG87 1\.[0-9]/.test(all), 'section tag in ' + f + '>' + to + ' ' + all.slice(0, 120));
          assert.ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(all), 'emoji');
          assert.ok(!/undefined|NaN|\[object/.test(all), 'bad text in ' + f + '>' + to + ': ' + all.slice(0, 300));
          if (r.chart) {
            r.chart.series.forEach(function (s) { s.doses.forEach(function (x) { assert.ok(isFinite(x.mg) && x.mg > 0 && isFinite(x.at), 'dose ' + JSON.stringify(x)); }); });
            r.chart.moments.forEach(function (m) { assert.ok(isFinite(m.h)); });
          }
        });
        var sr = safe.compute({ from: f, to: to }); count++;
        assert.ok(['ok', 'info', 'warn', 'stop'].indexOf(sr.tone) >= 0); assert.ok(!/undefined|NaN/.test(txt(sr)));
      });
    });
  });
  assert.ok(count > 500, 'ran ' + count);
});
t('dose options follow the patient and the product', function () {
  var o = conv.fields.filter(function (x) { return x.id === 'mr'; })[0].options;
  function vals(V) { return o(V).map(function (x) { return x.v; }); }
  assert.strictEqual(vals({ from: 'tab', who: 'child' }).join(), '18,27,36,45,54');
  assert.strictEqual(vals({ from: 'tab', who: 'adult' }).join(), '18,27,36,45,54,72');
  assert.strictEqual(vals({ from: 'cap', who: 'adult' }).join(), '10,20,30,40,60');
  assert.strictEqual(vals({ from: 'tuz', who: 'child' }).join(), '20,30,40,60');
  assert.strictEqual(vals({ from: 'ir', who: 'adult' }).length, 0);
});

console.log(n - fails + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
