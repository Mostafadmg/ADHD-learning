/* M5 lesson 2: methylphenidate products. Three duration tabs (immediate, 8-hour, 12-hour release), the chosen
   family's products, and one product card at a time.
   Markup: [data-mph] holds tabs [data-f], lists [data-fl], product buttons [data-p] and cards [data-panel].
   Without JS every list and card stays visible. A link to a heading inside a card (site search) opens that card. */
(function () {
  'use strict';
  document.querySelectorAll('[data-mph]').forEach(function (box) {
    function all(s) { return Array.prototype.slice.call(box.querySelectorAll(s)); }
    var tabs = all('[data-f]'), lists = all('[data-fl]'), btns = all('[data-p]'), cards = all('[data-panel]');
    var listWrap = box.querySelector('.mph-lists');
    if (!tabs.length || !btns.length || !cards.length) return;
    box.classList.add('mph-js');
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var last = {};   /* family -> the product last shown in it, so a tab reopens where you left it */

    function famOf(id) { var b = box.querySelector('[data-p="' + id + '"]'), l = b && b.closest('[data-fl]'); return l && l.dataset.fl; }
    function show(id, reveal) {
      var f = famOf(id); if (!f) return;
      last[f] = id;
      tabs.forEach(function (t) { var on = t.dataset.f === f; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; });
      lists.forEach(function (l) { l.hidden = l.dataset.fl !== f; });
      btns.forEach(function (b) { var on = b.dataset.p === id; b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.classList.toggle('cur', on); });
      cards.forEach(function (c) {
        var on = c.dataset.panel === id;
        c.hidden = !on;
        if (on && !still) { c.classList.remove('mph-in'); void c.offsetWidth; c.classList.add('mph-in'); }
        if (on && reveal) bring(c);
      });
    }
    /* In a narrow column the card sits under the list: if it opened low on the screen, scroll it up
       to just under the sticky lesson bar. Side by side, it is already in view. */
    function bring(card) {
      var cr = card.getBoundingClientRect(), lr = listWrap.getBoundingClientRect();
      if (cr.top < lr.bottom - 4 || cr.top < window.innerHeight * 0.6) return;
      var bar = box.closest('.lessons'), lb = bar && bar.querySelector('.ls-bar');
      var off = lb ? Math.max(0, lb.getBoundingClientRect().bottom) : 0;
      window.scrollBy({ top: cr.top - off - 12, behavior: still ? 'auto' : 'smooth' });
    }

    btns.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.p, true); }); });
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        var first = box.querySelector('[data-fl="' + t.dataset.f + '"] [data-p]');
        show(last[t.dataset.f] || (first && first.dataset.p), false);
      });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click();
      });
    });
    function fromHash() {
      var el = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
      var c = el && el.closest && el.closest('[data-panel]');
      if (c && box.contains(c)) show(c.dataset.panel, false);
    }
    window.addEventListener('hashchange', fromHash);
    show(btns[0].dataset.p, false);
    fromHash();
  });
})();
