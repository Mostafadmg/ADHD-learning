/* Structure test for js/data-quiz-m5-mph.js: keys, option counts, answer index, explanation and source present, vignette share.
   Run:  node tests/m5-quiz-mph.test.js */
'use strict';
var fs = require('fs'), path = require('path'), assert = require('assert'), vm = require('vm');
var Q = {};
var ctx = { window: { QUIZ: Q }, __mixOpts: function (a) { return a; } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'js', 'data-quiz-m5-mph.js'), 'utf8'), ctx);
assert.deepStrictEqual(Object.keys(Q).sort(), ['m5x_mph_l1', 'm5x_mph_more']);
assert.strictEqual(Q.m5x_mph_l1.length, 2, 'exactly 2 lesson-check questions');
var more = Q.m5x_mph_more; assert.ok(more.length >= 4 && more.length <= 6, '4 to 6 extra questions');
assert.ok(more.filter(function (x) { return x.v; }).length * 2 >= more.length, 'at least half are vignettes');
Q.m5x_mph_l1.concat(more).forEach(function (x, i) {
  assert.strictEqual(x.o.length, 4, 'four options in item ' + i);
  assert.ok(x.a >= 0 && x.a < 4, 'answer index in item ' + i);
  assert.ok(x.e && x.e.length > 200, 'explanation is substantial in item ' + i);
  assert.ok(x.s, 'source chip in item ' + i);
  assert.ok(new Set(x.o).size === 4, 'distinct options in item ' + i);
  assert.ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(x.q + x.o.join('') + x.e), 'no emoji in item ' + i);
});
console.log('quiz structure ok: ' + (2 + more.length) + ' items');
