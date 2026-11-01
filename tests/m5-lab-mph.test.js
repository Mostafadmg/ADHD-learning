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
var FOCUSIM = 'SmPC table (Focusim XL only; MR source not named)';
var BADGES = ['SmPC table', 'SmPC statement', 'SPS equivalence', 'Guideline (no numbers)', 'Worked out from the SmPC table (not official)', 'No official conversion', 'Same product', FOCUSIM];
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
t('IR 25 mg TDS -> tab: above the table', function () { var r = C({ ird: 25, irn: '3', to: 'tab' }); assert.strictEqual(r.badge, 'SmPC statement'); has(r, 'above the table'); has(r, 'The licensed maximum of the tablet itself is 72 mg a day for adults'); });
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

t('IR 30 mg BD -> cap 60 mg: only Metyrol XL and Meflynate XL make 60 mg', function () { has(C({ ird: 30, irn: '2', to: 'cap' }), 'emc lists no 60 mg capsule for Ritalin XL or Focusim XL'); });
t('IR -> Tuzulby chart is flagged as borrowing a shape', function () { var r = C({ who: 'child', ird: 10, irn: '2', to: 'tuz' }); assert.ok(/borrows the shape/.test(JSON.stringify(r.rows))); });

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
t('tab -> tab same SPS group', function () { var r = C({ from: 'tab', to: 'tab', mr: '36' }); assert.strictEqual(r.badge, 'SPS equivalence'); assert.strictEqual(r.tone, 'ok'); has(r, 'same dose, same quantity'); has(r, 'Matoride XL is children 6+ only'); has(r, 'go back to the usual brand'); has(r, 'Delmosart is not on emc: check the Accord SmPC on the MHRA site before relying on its licence or maximum'); assert.ok(txt(r).indexOf('No UK SmPC could be read') < 0); });
t('cap -> cap same SPS group', function () { var r = C({ from: 'cap', to: 'cap', mr: '20' }); assert.strictEqual(r.badge, 'SPS equivalence'); has(r, 'sucrose content'); });
t('tab <-> cap: no SPS/NICE/MHRA conversion (tablet to capsule also shows the one unnamed SmPC column)', function () {
  [C({ from: 'tab', to: 'cap', mr: '36' }), C({ from: 'cap', to: 'tab', mr: '20' })].forEach(function (r) { assert.strictEqual(r.tone, 'stop'); has(r, 'follow the specific dosage recommendations for each formulation'); has(r, 'frequent switching between products should be avoided'); });
  assert.strictEqual(C({ from: 'tab', to: 'cap', mr: '36' }).badge, 'No official conversion'); assert.strictEqual(C({ from: 'cap', to: 'tab', mr: '20' }).badge, 'No official conversion');
  assert.strictEqual(C({ from: 'ambi', to: 'cap', mr: '20' }).badge, FOCUSIM);
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
    assert.strictEqual(r.badge, p[1] === 'cap' && /^(tuz|ambi|addepta)$/.test(p[0]) ? FOCUSIM : 'No official conversion'); assert.strictEqual(r.tone, 'stop'); has(r, 'not on any SPS list'); has(r, 'prescribe methylphenidate MR products by brand');
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


/* =====================================================================================================================
   Reviewer findings, 1 Nov 2026 (each assertion below FAILS on the earlier behaviour). Sources re-read the same day:
   emc SmPCs, SPS (updated 28 Aug 2025), MHRA DSU 26 Sep 2022, NICE NG87.
   ===================================================================================================================== */
function not(r, s) { assert.ok(txt(r).indexOf(s) < 0, 'unexpected text "' + s + '" in: ' + txt(r).slice(0, 400)); }
var HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
function readJs(f) { return fs.readFileSync(path.join(__dirname, '..', 'js', f), 'utf8'); }
function lesson(id) { var a = HTML.indexOf('id="' + id + '"'); assert.ok(a > 0, 'lesson ' + id); a = HTML.lastIndexOf('<section', a); return HTML.slice(a, HTML.indexOf('</section>', a)); }
function plainHtml(h) { return h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '); }
function headText(h) { return h.replace(/<[^>]+>/g, ''); }

/* 1 (blocker) a converted dose above the licensed maximum is always flagged, also for the children-only capsules used in an adult */
['eqxl', 'addepta'].forEach(function (p) {
  [[25, '75'], [30, '90']].forEach(function (d) {
    t('adult IR ' + d[0] + ' mg TDS -> ' + p + ' ' + d[1] + ' mg: above the licensed maximum of 60 mg', function () {
      var r = C({ ird: d[0], irn: '3', to: p }); has(r, d[1] + ' mg a day is above the licensed maximum of 60 mg a day for this product (it is licensed in children only)'); assert.strictEqual(r.tone, 'warn');
    });
  });
  t('adult IR 20 mg TDS -> ' + p + ' 60 mg: at the maximum, no maximum warning', function () { not(C({ ird: 20, irn: '3', to: p }), 'above the licensed maximum'); });
  t('child IR 25 mg TDS -> ' + p + ' still flagged for children', function () { has(C({ who: 'child', ird: 25, irn: '3', to: p }), 'above the licensed maximum of 60 mg a day for children'); });
});
t('Addepta XL gets the same capsule-size note as Equasym XL', function () {
  ['adult', 'child'].forEach(function (w) { has(C({ who: w, ird: 5, irn: '3', to: 'addepta' }), 'Addepta XL capsules are 10, 20 and 30 mg, so 15 mg a day cannot be made up exactly'); });
  not(C({ who: 'child', ird: 10, irn: '2', to: 'addepta' }), 'cannot be made up exactly');
});
t('no IR to MR result prints a dose above the licensed maximum without saying so (every product, both ages)', function () {
  var MAXP = { tab: [54, 72], kixel: [54, 72], cap: [60, 80], mkxl: [60, 80], ambi: [60, 80], eqxl: [60, 60], addepta: [60, 60], tuz: [60, 60] }, seen = 0;
  Object.keys(MAXP).forEach(function (to) {
    ['child', 'adult'].forEach(function (w) {
      [5, 10, 15, 20, 25, 30].forEach(function (d) {
        ['2', '3'].forEach(function (n) {
          var r = C({ who: w, ird: d, irn: n, to: to }), m = headText(r.head).match(/(\d+) mg (?:once )?a day/);
          if (!m) return;
          var dose = +m[1], max = MAXP[to][w === 'child' ? 0 : 1];
          if (dose > max) { seen++; assert.ok(/above the (licensed|Tuzulby) maximum|above the licensed/.test(txt(r)), w + ' IR ' + d + ' x' + n + ' -> ' + to + ' prints ' + dose + ' mg with no warning'); }
        });
      });
    });
  });
  assert.ok(seen >= 8, 'checked ' + seen + ' over-maximum results');
});

/* 2 (blocker) the "no row" bracket follows the dose */
t('Concerta XL-type 27 mg -> IR: bracket is 18 to 36 mg', function () {
  [['tab', '27'], ['kixel', '27']].forEach(function (p) { var r = C({ from: p[0], to: 'ir', mr: p[1] }); has(r, 'between 18 mg (5 mg three times a day, 15 mg a day of IR) and 36 mg (10 mg three times a day, 30 mg a day)'); });
});
t('Concerta XL-type 45 mg -> IR: bracket is 36 to 54 mg, not 18 to 36 mg', function () {
  ['adult', 'child'].forEach(function (w) {
    var r = C({ who: w, from: 'tab', to: 'ir', mr: '45' }); has(r, 'no source gives a figure for this dose');
    has(r, 'between 36 mg (10 mg three times a day, 30 mg a day of IR) and 54 mg (15 mg three times a day, 45 mg a day)'); not(r, 'between 18 mg');
  });
});

/* 3 (major) the Focusim XL "MR" column is the one printed MR to MR rule: shown wherever the new product is the capsule group */
t('Focusim XL MR column is shown for every move to the Ritalin XL-type capsules from another product', function () {
  ['tab', 'mkxl', 'ambi', 'eqxl', 'addepta', 'tuz', 'kixel'].forEach(function (f) {
    var r = C({ who: 'child', from: f, to: 'cap', mr: String(f === 'tab' || f === 'kixel' ? 36 : (f === 'tuz' ? 20 : 10)) });
    has(r, 'Only the Focusim XL SmPC (Table 1, “MR” column) prints a modified-release rule'); has(r, 'It names no product'); has(r, 'Ritalin XL, Metyrol XL and Meflynate XL tables have no MR row');
    has(S(f, 'cap'), 'Only the Focusim XL SmPC (Table 1, “MR” column) prints a modified-release rule');
  });
  has(C({ from: 'eqxl', to: 'cap', mr: '20' }), 'does not override the SPS advice not to switch Equasym XL');
});
t('badges for moves to the capsule group: Focusim badge only where SPS gives no rule; SPS wording wins elsewhere', function () {
  assert.strictEqual(C({ from: 'tab', to: 'cap', mr: '36' }).badge, 'No official conversion'); assert.strictEqual(C({ from: 'ambi', to: 'cap', mr: '20' }).badge, FOCUSIM); assert.strictEqual(S('tab', 'cap').head.indexOf('Red: no SPS, NICE or MHRA conversion') === 0, true);
  assert.strictEqual(C({ from: 'mkxl', to: 'cap', mr: '20' }).badge, 'Guideline (no numbers)'); assert.strictEqual(C({ from: 'eqxl', to: 'cap', mr: '20' }).badge, 'No official conversion');
  assert.strictEqual(C({ from: 'cap', to: 'tab', mr: '20' }).badge, 'No official conversion');
});
t('no result says that no SmPC at all converts MR to MR, and the Focusim row appears only for the capsule destination', function () {
  var ks = ['tab', 'cap', 'mkxl', 'ambi', 'eqxl', 'addepta', 'tuz', 'kixel'];
  ks.forEach(function (f) {
    ks.forEach(function (to) {
      var r = C({ who: 'child', from: f, to: to, mr: '20' }), a = txt(r), s = txt(S(f, to));
      assert.ok(a.indexOf('No SmPC, SPS, NICE or MHRA table converts') < 0 && s.indexOf('No SmPC, SPS, NICE or MHRA table converts') < 0, 'absolute claim in ' + f + '>' + to);
      if (to !== 'cap' && f !== to) assert.ok(a.indexOf('Focusim XL SmPC (Table 1') < 0, 'Focusim row for ' + f + '>' + to);
    });
  });
});
t('Medikinet XL <-> capsule: dose line no longer says "None given"', function () { not(C({ from: 'mkxl', to: 'cap', mr: '20' }), 'None given'); has(C({ from: 'mkxl', to: 'cap', mr: '20' }), 'No SPS dose rule'); });
t('same SPS group: 45 mg tablet is amber, only Atenza XL makes it', function () {
  var r = C({ from: 'tab', to: 'tab', mr: '45' }); assert.strictEqual(r.tone, 'warn'); has(r, 'Only Atenza XL makes a 45 mg tablet'); has(r, 'two tablets (27 + 18 mg)'); assert.strictEqual(r.badge, 'SPS equivalence');
});
t('same SPS group: 60 mg capsule is amber, only Metyrol XL and Meflynate XL make it', function () {
  var r = C({ from: 'cap', to: 'cap', mr: '60' }); assert.strictEqual(r.tone, 'warn'); has(r, 'Only Metyrol XL and Meflynate XL make a 60 mg capsule'); has(r, 'Ritalin XL and Focusim XL would need 40 + 20 mg');
});
t('same SPS group: 27 mg tablet is amber (Matoride XL has no 27 mg); doses every brand makes stay green', function () {
  var r = C({ from: 'tab', to: 'tab', mr: '27' }); assert.strictEqual(r.tone, 'warn'); has(r, 'Matoride XL has no 27 mg tablet');
  [['tab', '18'], ['tab', '36'], ['tab', '54'], ['tab', '72'], ['cap', '10'], ['cap', '20'], ['cap', '30'], ['cap', '40']].forEach(function (p) { var g = C({ from: p[0], to: p[0], mr: p[1] }); assert.strictEqual(g.tone, 'ok', p.join(' ')); not(g, 'Can every brand supply it'); });
});
t('dose menu labels the strengths only some brands make', function () {
  var o = conv.fields.filter(function (x) { return x.id === 'mr'; })[0].options;
  function lab(V, n) { return o(V).filter(function (x) { return x.v === String(n); })[0].l; }
  assert.ok(/Atenza XL only/.test(lab({ from: 'tab', who: 'adult' }, 45))); assert.ok(/not Matoride XL/.test(lab({ from: 'tab', who: 'adult' }, 27))); assert.ok(/Metyrol XL or Meflynate XL only/.test(lab({ from: 'cap', who: 'adult' }, 60)));
});

/* 4 (major) bioequivalence is not taught as "identical blood levels, nothing changes" */
t('same SPS group: expected, not guaranteed; says why the lines overlap; report changes and go back', function () {
  ['tab', 'cap'].forEach(function (g) {
    var r = C({ from: g, to: g, mr: '20' }); not(r, 'that is what bioequivalent means'); not(r, 'sit on top of each other');
    has(r, 'is expected to look the same'); has(r, 'an average finding from studies, not a promise for one person'); has(r, 'overlap only because the chart uses one shape for the group'); has(r, 'report any change and go back to the usual brand');
  });
  has(C({ from: 'tab', to: 'tab', mr: '36' }), '22:78 and 25:75');
});
t('lesson no longer says only bioequivalent products are safe to swap, or that bioequivalent means the same blood levels', function () {
  var L = plainHtml(lesson('m5-switch'));
  assert.ok(L.indexOf('Only then is a like-for-like swap safe') < 0 && L.indexOf('the same dose gives the same blood levels') < 0);
  assert.ok(L.indexOf('release the drug at a similar rate and to a similar extent in studies') > 0 && L.indexOf('go back to the usual brand and have the person report any change') > 0);
  assert.ok(plainHtml(HTML).indexOf('the same dose gives the same blood levels') < 0, 'glossary definition');
  assert.ok(readJs('handbook.js').indexOf('gives the same blood levels') < 0, 'counselling script');
});

/* 5 adults take Medikinet XL and Ambinet XL as two doses */
t('MR to IR headline for adult Medikinet XL and Ambinet XL says two doses, not "once a day"', function () {
  ['mkxl', 'ambi'].forEach(function (f) {
    var nm = f === 'mkxl' ? 'Medikinet XL' : 'Ambinet XL';
    var a = C({ who: 'adult', from: f, to: 'ir', mr: '20' }); has(a, nm + ' 20 mg a day (taken as two doses, morning and lunchtime)'); not(a, '20 mg once a day'); assert.strictEqual(a.chart.series[1].doses.length, 2);
    var c = C({ who: 'child', from: f, to: 'ir', mr: '20' }); has(c, '20 mg once a day'); assert.strictEqual(c.chart.series[1].doses.length, 1);
  });
});

/* 6 the 22:78 ratio is not stated for the whole tablet group */
t('tablet group ratio is "about 22:78", with SPS 25:75 for Delmosart and Xaggitin XL', function () {
  [C({ from: 'tab', to: 'cap', mr: '36' }), S('tab', 'cap'), S('tab', 'mkxl')].forEach(function (r) { has(r, 'about 22:78 (Concerta XL is 22:78; SPS gives Delmosart and Xaggitin XL as 25:75)'); });
  assert.ok(plainHtml(lesson('m5-switch')).indexOf('about 22:78 vs 50:50') > 0);
});

/* 7 Addepta XL launch status is dated, not current */
t('Addepta XL: SPS statement is dated and supply must be checked', function () {
  has(C({ who: 'child', ird: 10, irn: '2', to: 'addepta' }), 'SPS (28 Aug 2025) said Addepta XL was licensed but not yet launched; check current supply with the wholesaler or dm+d before choosing it');
  has(S('ir', 'addepta'), 'SPS (28 Aug 2025) said Addepta XL was licensed but not yet launched; check current supply');
});

/* 8 Equasym XL: SPS has not assessed the unlisted products */
t('Equasym XL against an unlisted product says SPS has not assessed it', function () {
  ['addepta', 'tuz', 'ambi', 'kixel'].forEach(function (o) {
    [C({ who: 'child', from: 'eqxl', to: o, mr: '20' }), C({ who: 'child', from: o, to: 'eqxl', mr: '20' }), S('eqxl', o), S(o, 'eqxl')].forEach(function (r) {
      assert.strictEqual(r.tone, 'stop'); has(r, 'SPS has not assessed'); has(r, 'against Equasym XL. No source says they are interchangeable, so the answer stays: do not switch without the specialist');
    });
  });
  not(S('eqxl', 'mkxl'), 'SPS has not assessed'); not(S('tab', 'eqxl'), 'SPS has not assessed');
});

/* 9 IR to IR in the second tab; tab title does not promise "safe" */
t('Which-switch tab: IR to IR is handled; the title says "official rule"', function () {
  var r = S('ir', 'ir'); assert.strictEqual(r.tone, 'warn'); has(r, 'no source says IR brands are interchangeable by dose'); not(r, 'same product on both sides');
  assert.strictEqual(safe.label, 'Which switches have an official rule?'); assert.ok(/not whether a switch suits this person/.test(safe.intro));
  assert.strictEqual(S('mkxl', 'mkxl').tone, 'info');
});

/* 10 charts compare shapes only */
t('MR to MR charts are drawn at one illustrative size and labelled as not a dose', function () {
  [['tab', 'eqxl', '72'], ['tab', 'cap', '36'], ['tab', 'mkxl', '36'], ['mkxl', 'cap', '20'], ['kixel', 'tab', '54'], ['tuz', 'cap', '60']].forEach(function (p) {
    var r = C({ from: p[0], to: p[1], mr: p[2] }); assert.ok(r.chart, p.join('>'));
    r.chart.series.forEach(function (s) {
      assert.ok(/illustrative shape/.test(s.label), s.label); assert.ok(s.label.indexOf('(same total)') < 0, s.label);
      assert.strictEqual(s.doses.reduce(function (a, d) { return a + d.mg; }, 0), 10, p.join('>') + ' ' + s.label);
    });
    has(r, 'not a conversion and not a dose'); not(r, 'drawn at ' + p[2] + ' mg');
  });
});
t('MR to IR chart says the MR product is drawn at the IR-equivalent total', function () {
  has(C({ from: 'tab', to: 'ir', mr: '36' }), 'drawn at the IR-equivalent total (30 mg) so the shapes compare; the dose is 36 mg');
  not(C({ from: 'mkxl', to: 'ir', mr: '20' }), 'IR-equivalent total');
});

/* 11 the IR total typed in is checked against the IR licence */
t('IR total above the licensed IR maximum is flagged (adult 80 mg, child 60 mg), for IR to MR and IR to IR', function () {
  has(C({ ird: 30, irn: '3', to: 'cap' }), 'Your IR total of 90 mg a day is above the licensed IR maximum of 80 mg a day for an adult');
  has(C({ who: 'child', ird: 25, irn: '3', to: 'cap' }), 'Your IR total of 75 mg a day is above the licensed IR maximum of 60 mg a day for a child');
  has(C({ who: 'child', ird: 25, irn: '3', to: 'tab' }), 'above the licensed IR maximum of 60 mg');
  has(C({ ird: 30, irn: '3', to: 'ir' }), 'above the licensed IR maximum of 80 mg a day for an adult'); has(C({ who: 'child', ird: 25, irn: '3', to: 'ir' }), 'above the licensed IR maximum of 60 mg a day for a child');
  not(C({ ird: 25, irn: '3', to: 'tab' }), 'licensed IR maximum'); not(C({ ird: 30, irn: '2', to: 'cap' }), 'licensed IR maximum'); not(C({ who: 'child', ird: 20, irn: '3', to: 'tab' }), 'licensed IR maximum');
  not(C({ ird: 30, irn: '3', to: 'cap' }), 'BNF');
});
t('an IR over-maximum note never pushes out the product-maximum note', function () { var r = C({ ird: 30, irn: '3', to: 'eqxl' }); has(r, 'licensed IR maximum of 80'); has(r, 'licensed maximum of 60 mg a day for this product'); has(r, 'Off-label in adults'); });

/* 12 a converted dose is a starting point */
t('every IR to MR result says it is a starting dose only and names the one-month review', function () {
  ['tab', 'kixel', 'cap', 'mkxl', 'ambi', 'eqxl', 'addepta', 'tuz'].forEach(function (to) {
    ['adult', 'child'].forEach(function (w) {
      var r = C({ who: w, ird: 10, irn: '2', to: to });
      has(r, 'A starting dose only. Titrate against symptoms and side effects and review at about one month'); has(r, 'stop if there is no improvement after one month of proper dose adjustment');
      assert.strictEqual(r.notes[r.notes.length - 1], 'New Schedule 2 prescription, written by brand.');
    });
  });
});

/* 13 no "not interchangeable" claim the sources do not make */
t('Tuzulby, Ambinet XL and Equasym XL wording says what the sources say', function () {
  var prod = plainHtml(lesson('m5-products')), sw = plainHtml(lesson('m5-switch')), rel = readJs('m5-release.js');
  assert.ok(prod.indexOf('it is not interchangeable with any other product') < 0 && prod.indexOf('It is on no SPS list, so no source says it can be swapped with another product: keep the person on the brand they started.') > 0);
  assert.ok(sw.indexOf('Not interchangeable') < 0 && sw.indexOf('On no SPS list, so no source says they can be swapped.') > 0);
  assert.ok(rel.indexOf('but is not interchangeable') < 0 && rel.indexOf('No other product is interchangeable') < 0, 'm5-release.js');
  assert.ok(rel.indexOf('is on no SPS list, so no source says the two can be swapped') > 0 && rel.indexOf('SPS has not assessed them against it') > 0);
});

/* 14 15 lesson wording that was stated as sourced */
t('lesson key and sourced wording (red key, NICE 1.7.12/1.7.20, teaching note, Medikinet XL start)', function () {
  var sw = plainHtml(lesson('m5-switch')), rl = plainHtml(lesson('m5-release')), pr = plainHtml(lesson('m5-products'));
  assert.ok(sw.indexOf('Red Tablet to capsule or Medikinet XL; any move to or from Equasym XL or a product on no SPS list') > 0, 'red key');
  assert.ok(sw.indexOf('Official tables IR to modified-release only') < 0 && sw.indexOf('Official tables Mostly IR to modified-release') > 0);
  assert.ok(rl.indexOf('asks prescribers to know these profiles') < 0 && rl.indexOf('NICE lists the pharmacokinetic profile as one reason to think about modified-release') > 0);
  assert.ok(rl.indexOf('treatment should not continue if a late IR dose is always needed, unless the same extra dose was needed on IR') > 0);
  assert.ok(pr.indexOf('NICE frames the same idea as a 6-week trial') < 0 && pr.indexOf('NICE (adults): consider switching to lisdexamfetamine after a 6-week trial of methylphenidate at an adequate dose.') > 0);
  assert.ok(pr.indexOf('Teaching note, not a source: the first lesson or meeting may feel slow') > 0 && pr.indexOf('works straight away, so the first lesson') < 0);
  assert.ok(pr.indexOf('IR 5 mg once or twice daily, or Medikinet XL 10 mg once daily in place of IR 5 mg twice daily') > 0 && pr.indexOf('IR 5 mg once or twice daily, or Ambinet XL 10 mg once daily in place of IR 5 mg twice daily') > 0);
});
t('the badge key lists the Focusim badge; the Module 5 flashcards no longer overstate', function () {
  assert.ok(plainHtml(lesson('m5-switch')).indexOf(FOCUSIM) > 0);
  var recap = HTML.slice(HTML.indexOf('data-title="Recap and practise" data-min="19"'));
  assert.ok(recap.indexOf('IR to modified-release only') < 0 && recap.indexOf('Mostly IR to modified-release.') > 0 && recap.indexOf('names no product') > 0);
  assert.ok(recap.indexOf('because no source converts a tablet to a capsule') < 0);
});

/* 16 Delmosart: what we could not read is said honestly */
t('Delmosart is described as not on emc, never as having no SmPC', function () {
  assert.ok(HTML.indexOf('Delmosart has no SmPC on emc') < 0 && HTML.indexOf('No UK SmPC could be read for Delmosart') < 0);
  assert.ok(HTML.indexOf('Delmosart is not on emc: check the Accord SmPC on the MHRA site before relying on its licence or maximum') > 0);
  var B = readJs('data-brands.js');
  assert.ok(B.indexOf('Delmosart is not on emc: check the Accord SmPC on the MHRA site before relying on its licence or maximum') > 0);
  assert.ok(B.indexOf('The Focusim XL SmPC Table 1 also has an “MR” column') > 0, 'Focusim entry');
});

/* 17 BNF-only figures are labelled and kept out of lab results and quiz keys */
t('BNF-only figures: labelled unchecked, and not used by the lab or the methylphenidate quiz', function () {
  assert.ok(plainHtml(HTML).indexOf('the BNF could not be reached on 1 Nov 2026, so confirm every figure in the live BNF') > 0);
  var Lb = readJs('m5-lab-mph.js'), Qz = readJs('data-quiz-m5-mph.js');
  [/108 mg/, /2\.1 mg\/kg/, /100 mg\/day/, /90 mg\/day/].forEach(function (re) { assert.ok(!re.test(Lb), 'lab uses ' + re); assert.ok(!re.test(Qz), 'quiz uses ' + re); });
  assert.ok(/BNF could not be reached on 1 Nov 2026/.test(readJs('data-brands.js')));
});

/* quiz wording (14): the stem says the figure is a reversed table row; the Focusim clause is corrected */
t('quiz: reversed-table stem, Focusim clause corrected', function () {
  var Q = {}; vm.runInNewContext(readJs('data-quiz-m5-mph.js'), { window: { QUIZ: Q }, __mixOpts: function (a) { return a; } });
  var all = Q.m5x_mph_l1.concat(Q.m5x_mph_more), stem = all.filter(function (x) { return /about 30 mg a day of IR/.test(x.q); })[0];
  assert.ok(stem && /^A colleague reverses the Concerta XL table row 10 mg three times a day → 36 mg and says/.test(stem.q), 'stem'); assert.strictEqual(stem.o[stem.a], 'Worked out from the SmPC table (not official)');
  var j = all.map(function (x) { return x.q + ' ' + x.o.join(' ') + ' ' + x.e; }).join(' ');
  assert.ok(j.indexOf('their table has IR rows only') < 0 && j.indexOf('Nothing converts a tablet to a capsule') < 0 && j.indexOf('but not for modified-release to IR or between different release designs') < 0, 'old absolute wording');
  var l1 = Q.m5x_mph_l1[0]; assert.ok(/the only dose rule printed in an SmPC is one unnamed column in the Focusim XL SmPC/.test(l1.o[l1.a]));
  assert.ok(/The Focusim XL table does have an MR column with the same milligrams/.test(l1.e) && /names no product/.test(l1.e));
});

/* =====================================================================================================================
   Second-pass reviewer findings, 1 Nov 2026 (each assertion below FAILS on the earlier behaviour). Sources re-read the same day:
   emc SmPCs (Medikinet XL 313, Ambinet XL 102268, Concerta XL 314, Kixel XL 101341, Focusim XL 100558, Equasym XL 3887,
   Addepta XL 102481, Tuzulby 101828, Matoride XL 3304, Viatris tablets 8724, Medikinet tablets 328), SPS (28 Aug 2025).
   ===================================================================================================================== */
var REASON = 'could lead to a faster release of the total amount of active substance';

/* P2-0 (major) the Medikinet XL and Ambinet XL SmPCs (4.5) do give the reason for the acid-reducing medicines */
t('P2-0: acid-reducing medicines: the lessons, release explorer and lab give the SmPC reason, never "does not say why"', function () {
  var prod = plainHtml(lesson('m5-products')), all = plainHtml(HTML), rel = readJs('m5-release.js'), lab = readJs('m5-lab-mph.js');
  assert.ok(all.indexOf('It does not say why') < 0 && all.indexOf('They do not say why') < 0, 'index.html still says the SmPC gives no reason');
  assert.ok(prod.indexOf('The SmPC gives the reason: taken together, they ' + REASON) > 0, 'Medikinet XL card');
  assert.ok(all.indexOf('They give the reason: taken together, they ' + REASON) > 0, 'rules for every product');
  assert.ok(all.indexOf('Ask about over-the-counter antacids as well as prescribed PPIs and H2 blockers') > 0);
  assert.ok(rel.indexOf('It does not say why') < 0 && rel.indexOf('gives no\n   mechanism') < 0 && rel.indexOf('gives no mechanism') < 0, 'm5-release.js');
  assert.ok(rel.indexOf('The SmPC gives the reason: taken together, they ' + REASON) > 0 && rel.indexOf('over-the-counter antacids') > 0);
  assert.ok(lab.indexOf('together they ' + REASON) > 0);
  ['mkxl', 'ambi'].forEach(function (to) {
    [C({ ird: 10, irn: '2', to: to }), C({ from: 'tab', to: to, mr: '36' }), C({ who: 'child', from: 'cap', to: to, mr: '20' })].forEach(function (r) {
      has(r, 'Not with a PPI, H2 blocker or antacid (contraindications)'); has(r, 'together they ' + REASON); has(r, 'Ask about over-the-counter antacids too');
    });
  });
});

/* P2-1 (major) above the Concerta XL-type table: the tablet's own licensed maximum is for the age, and the IR total is not "above 72 mg" */
t('P2-1: IR total above the Concerta XL-type table names the tablet maximum for the age (54 mg child, 72 mg adult), never 72 mg for a child', function () {
  ['tab', 'kixel'].forEach(function (to) {
    var nm = to === 'tab' ? 'Concerta XL' : 'Kixel XL';
    var c = C({ who: 'child', ird: 25, irn: '3', to: to });
    has(c, 'The ' + nm + ' table stops at 60 mg a day of IR (20 mg three times a day gives 72 mg once daily). Your IR total of 75 mg a day is above the table.');
    has(c, 'The licensed maximum of the tablet itself is 54 mg a day for children'); not(c, 'maximum of the tablet itself is 72'); not(c, 'above it and above the licensed maximum of 72');
    var a = C({ who: 'adult', ird: 30, irn: '3', to: to });
    has(a, 'Your IR total of 90 mg a day is above the table'); has(a, 'The licensed maximum of the tablet itself is 72 mg a day for adults'); not(a, 'for children');
  });
});

/* P2-2 (major) six products are children only: the recap bullet, the flashcard and the old quiz explanation list them all */
t('P2-2: all six children-only methylphenidate products are named in the recap, the flashcard and the licence quiz', function () {
  var six = ['Medikinet tablets', 'Equasym XL', 'Addepta XL', 'Tuzulby', 'Matoride XL'];
  var recap = HTML.slice(HTML.indexOf('data-title="Recap and practise" data-min="19"'));
  var bullet = recap.slice(recap.indexOf('Dose by product, not by drug.'), recap.indexOf('</li>', recap.indexOf('Dose by product, not by drug.')));
  assert.ok(bullet.indexOf('six products are children only') > 0 && bullet.indexOf('generic IR tablets') > 0, bullet);
  six.forEach(function (p) { assert.ok(bullet.indexOf(p) > 0, 'recap bullet lacks ' + p); });
  var q = recap.indexOf('Which methylphenidate products are children-only?'), card = recap.slice(q, recap.indexOf('Tap to flip back', q));
  assert.ok(card.indexOf('Six:') > 0 && card.indexOf('Viatris generic IR tablets') > 0, card);
  six.forEach(function (p) { assert.ok(card.indexOf(p) > 0, 'flashcard lacks ' + p); });
  assert.ok(card.indexOf('not started') > 0 && card.indexOf('other than Matoride XL') > 0, 'Matoride XL nuance');
  assert.ok(card.indexOf('Medikinet tablets and Equasym XL: not licensed in adults') < 0);
  var Q5 = readJs('data-quiz-m5.js'), i = Q5.indexOf('Which methylphenidate product is licensed for adults?'), e = Q5.slice(i, Q5.indexOf('\n', i));
  ['Addepta XL', 'Tuzulby', 'Matoride XL', 'Viatris generic tablets'].forEach(function (p) { assert.ok(e.indexOf(p) > 0, 'quiz explanation lacks ' + p); });
  assert.ok(e.indexOf('bioequivalent tablets other than Matoride XL') > 0);
});

/* P2-3 (minor) the Focusim chip appears only where the chosen daily dose has a row in the Focusim XL MR column */
t('P2-3: the Focusim badge needs a row (10, 20, 30, 40 or 60 mg); every other dose stays "No official conversion" and the row says so', function () {
  var opt = conv.fields.filter(function (x) { return x.id === 'mr'; })[0].options, rows = [10, 20, 30, 40, 60], seen = { yes: 0, no: 0 };
  ['adult', 'child'].forEach(function (w) {
    ['tab', 'kixel', 'ambi', 'addepta', 'tuz'].forEach(function (f) {
      opt({ from: f, who: w }).forEach(function (o) {
        var D = +o.v, r = C({ who: w, from: f, to: 'cap', mr: o.v }), inSet = rows.indexOf(D) >= 0;
        assert.strictEqual(r.badge, inSet ? FOCUSIM : 'No official conversion', w + ' ' + f + ' ' + D + ' -> cap');
        has(r, 'Only the Focusim XL SmPC (Table 1, “MR” column) prints a modified-release rule'); has(r, 'has no row for any other dose');
        if (inSet) { not(r, 'The Focusim XL column has no row for'); seen.yes++; } else { has(r, 'The Focusim XL column has no row for ' + D + ' mg.'); seen.no++; }
      });
    });
  });
  assert.ok(seen.yes >= 10 && seen.no >= 8, JSON.stringify(seen));
  var r36 = C({ from: 'tab', to: 'cap', mr: '36' }); assert.strictEqual(r36.tone, 'stop'); has(r36, 'no SPS, NICE or MHRA conversion');
  /* the second tab has no dose, so its status row never names the Focusim table as the status */
  ['tab', 'kixel', 'ambi', 'addepta', 'tuz'].forEach(function (f) { var s = S(f, 'cap'); has(s, 'Status of the rule No official conversion'); not(s, 'Status of the rule SmPC table'); has(s, 'has no row for any other dose'); });
  assert.ok(plainHtml(lesson('m5-switch')).indexOf('One table column that gives a modified-release rule for 10, 20, 30, 40 and 60 mg but names no product. It is not a conversion for other doses.') > 0, 'badge key');
  assert.ok(plainHtml(lesson('m5-switch')).indexOf('for 10, 20, 30, 40 and 60 mg only, and it names no product') > 0, 'no-script table');
});

/* P2-4 (minor) "the only MR to MR rule" is over-absolute: SPS prints same-dose swaps inside its two groups */
t('P2-4: the quiz key and the flashcard say the only SmPC dose rule, and mention the SPS same-dose swaps', function () {
  var Q = {}; vm.runInNewContext(readJs('data-quiz-m5-mph.js'), { window: { QUIZ: Q }, __mixOpts: function (a) { return a; } });
  var l1 = Q.m5x_mph_l1[0], key = l1.o[l1.a];
  assert.ok(key.indexOf('the only modified-release to modified-release rule is one unnamed column') < 0, 'old absolute wording');
  assert.ok(key.indexOf('Between different release designs there is no SPS, NICE or MHRA conversion') > 0 && key.indexOf('SPS allows same-dose swaps only inside its two bioequivalent groups') > 0, key);
  var recap = HTML.slice(HTML.indexOf('data-title="Recap and practise" data-min="19"')), q = recap.indexOf('have an official conversion table or rule?'), card = recap.slice(q, recap.indexOf('Tap to flip back', q + 200));
  assert.ok(card.indexOf('The only modified-release to modified-release rule is one unnamed') < 0, 'old flashcard wording');
  assert.ok(card.indexOf('SPS allows same-dose swaps only inside its two bioequivalent groups') > 0 && card.indexOf('the only SmPC dose rule is one unnamed “MR” column in the Focusim XL SmPC, for 10, 20, 30, 40 and 60 mg') > 0, card);
});

/* P2-5 (minor) adults cannot take Medikinet XL or Ambinet XL 5 mg a day in two doses */
t('P2-5: no adult 5 mg a day for Medikinet XL or Ambinet XL (children keep it); the adult 10 mg SPS line is explained', function () {
  var opt = conv.fields.filter(function (x) { return x.id === 'mr'; })[0].options;
  ['mkxl', 'ambi'].forEach(function (f) {
    assert.strictEqual(opt({ from: f, who: 'adult' }).map(function (x) { return x.v; }).join(), '10,20,30,40,50,60', f + ' adult');
    assert.strictEqual(opt({ from: f, who: 'child' }).map(function (x) { return x.v; }).join(), '5,10,20,30,40,50,60', f + ' child');
  });
  var a = C({ from: 'mkxl', to: 'ir', mr: '10' });
  has(a, 'Medikinet XL 10 mg a day (taken as two doses, morning and lunchtime)'); has(a, 'SPS words this as once daily; adults take Medikinet XL as two doses.'); assert.strictEqual(a.badge, 'SPS equivalence');
  not(C({ who: 'child', from: 'mkxl', to: 'ir', mr: '10' }), 'SPS words this as once daily'); not(C({ from: 'eqxl', to: 'ir', mr: '10' }), 'SPS words this as once daily');
  has(C({ who: 'child', from: 'mkxl', to: 'ir', mr: '5' }), 'IR 5 mg once a day');
});

/* P2-6 (minor) a dose no capsule can make is never a green tile */
t('P2-6: Equasym XL and Addepta XL totals that 10, 20 and 30 mg capsules cannot make are amber and name the nearest strengths', function () {
  ['eqxl', 'addepta'].forEach(function (p) {
    var nm = p === 'eqxl' ? 'Equasym XL' : 'Addepta XL';
    [[5, '3', 15, 10, 20], [15, '3', 45, 40, 50]].forEach(function (d) {
      var r = C({ who: 'child', ird: d[0], irn: d[1], to: p });
      assert.strictEqual(r.tone, 'warn', nm + ' ' + d[2]); has(r, nm + ' ' + d[2] + ' mg once a day'); has(r, 'before breakfast (no capsule makes ' + d[2] + ' mg: nearest ' + d[3] + ' mg or ' + d[4] + ' mg, or another product)');
      has(r, 'cannot be made up exactly'); assert.ok(r.chart.title.indexOf('no capsule makes') < 0, 'chart title stays short');
    });
    var ok = C({ who: 'child', ird: 10, irn: '2', to: p }); assert.strictEqual(ok.tone, 'ok'); not(ok, 'no capsule makes');
    var over = C({ who: 'child', ird: 25, irn: '3', to: p }); not(over, 'no capsule makes'); has(over, 'above the licensed maximum');
  });
  ['child', 'adult'].forEach(function (w) {
    [5, 10, 15, 20, 25, 30].forEach(function (d) { ['2', '3'].forEach(function (n) {
      ['eqxl', 'addepta'].forEach(function (p) { var r = C({ who: w, ird: d, irn: n, to: p }); if (d * +n % 10 !== 0) assert.notStrictEqual(r.tone, 'ok', w + ' IR ' + d + ' x' + n + ' -> ' + p); });
    }); });
  });
});

/* P2-7 (minor) the colour legend describes every case the tab shows */
t('P2-7: legend and lesson key: Green = an official rule exists, Amber = particular care or no source, Red = no conversion or do not switch', function () {
  assert.ok(/Green<\/b>: an official rule exists \(an SmPC table or statement from IR, or a swap inside an SPS group\)/.test(safe.intro), safe.intro);
  assert.ok(/Amber<\/b>: possible with particular care, an individualised approach \(any modified-release to IR; Medikinet XL and the Ritalin XL-type capsules\), or no source \(IR brand to IR brand\)/.test(safe.intro));
  assert.ok(/Red<\/b>: no conversion, or do not switch/.test(safe.intro) && /not whether a switch suits this person/.test(safe.intro));
  var sw = plainHtml(lesson('m5-switch'));
  assert.ok(sw.indexOf('Green An official rule exists: an SmPC table or statement from IR, or a swap inside an SPS group') > 0, 'lesson Green key');
  assert.ok(sw.indexOf('Amber Particular care, or no source: Medikinet XL to or from the Ritalin XL-type capsules; any MR to IR; IR brand to IR brand') > 0, 'lesson Amber key');
  /* the colours the tab really shows match the legend, for every pair */
  var ks = ['ir', 'tab', 'cap', 'mkxl', 'ambi', 'eqxl', 'addepta', 'tuz', 'kixel'], g = 0, a = 0, r = 0;
  ks.forEach(function (f) { ks.forEach(function (to) {
    if (f === to && f !== 'ir' && f !== 'tab' && f !== 'cap') return;
    var tone = S(f, to).tone;
    var amber = to === 'ir' || (f === 'mkxl' && to === 'cap') || (f === 'cap' && to === 'mkxl');
    var green = (f === 'ir' && to !== 'ir') || (f === to && f !== 'ir');
    if (green) { assert.strictEqual(tone, 'ok', f + '>' + to); g++; } else if (amber) { assert.strictEqual(tone, 'warn', f + '>' + to); a++; } else { assert.strictEqual(tone, 'stop', f + '>' + to); r++; }
  }); });
  assert.ok(g >= 10 && a >= 9 && r >= 30, [g, a, r].join());
});

console.log(n - fails + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
