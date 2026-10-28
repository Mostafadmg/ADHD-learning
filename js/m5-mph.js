/* M5 lesson 2: methylphenidate products. Product buttons are grouped by family; one product card shows at a time.
   Markup: [data-mph] holds buttons [data-p="id"] and cards [data-panel="id"]. Without JS every card stays visible. */
(function () {
  'use strict';
  document.querySelectorAll('[data-mph]').forEach(function (box) {
    var btns = Array.prototype.slice.call(box.querySelectorAll('[data-p]'));
    var cards = Array.prototype.slice.call(box.querySelectorAll('[data-panel]'));
    if (!btns.length || !cards.length) return;
    box.classList.add('mph-js');
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(id, focus) {
      btns.forEach(function (b) {
        var on = b.dataset.p === id;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.classList.toggle('cur', on);
      });
      cards.forEach(function (c) {
        var on = c.dataset.panel === id;
        c.hidden = !on;
        if (on && !still) { c.classList.remove('mph-in'); void c.offsetWidth; c.classList.add('mph-in'); }
        if (on && focus) {
          var h = c.querySelector('h4');
          if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
        }
      });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.p, false); }); });
    show(btns[0].dataset.p, false);
  });
})();
