/* Module 5 quiz wiring. Loaded after every data-quiz-m5*.js file and before data-final.js.
   - Lesson checks (two questions per lesson) are rebuilt in the order the lessons now run:
     glance, methylphenidate doses, release profiles, switching methylphenidate, day builder, lisdexamfetamine,
     dexamfetamine, atomoxetine, guanfacine, contraindications, titration, switching and controlled drugs, recap.
   - The module quiz gains the extra questions from the lab lessons, plus the earlier lisdexamfetamine and
     non-stimulant checks (m5l5, m5l6), without repeating any question. */
(function () {
  'use strict';
  var Q = window.QUIZ; if (!Q || !Q.m5l1) return;
  function g(k) { return Q[k] || []; }
  Q.m5checks = [].concat(g('m5l1'), g('m5l2'), g('m5l3'), g('m5x_mph_l1'), g('m5l4'), g('m5x_amf_l1'), g('m5x_amf_l2'),
    g('m5x_ns_l1'), g('m5x_ns_l2'), g('m5l7'), g('m5l8'), g('m5l9'), g('m5l10'));
  var seen = {}; (Q.m5 || []).forEach(function (q) { seen[q.q] = 1; });
  ['m5x_mph_more', 'm5x_amf_more', 'm5x_ns_more', 'm5l5', 'm5l6'].forEach(function (k) {
    g(k).forEach(function (q) { if (!seen[q.q]) { seen[q.q] = 1; Q.m5.push(q); } });
  });
})();
