/* Swipe left or right to change step (touch screens).
   The picture walkthroughs ("Step 2 of 5"), the mechanism diagrams, the steppers and the flashcard decks are driven
   by Previous / Next buttons. This adds the same thing by swiping: swipe left for the next step, right for the previous
   one. It simply presses the component's own button, so every counter, dot, saved state and fade keeps working.
   Ignored on purpose: swipes that start on a chart, slider, field or sideways-scrolling row (those use the gesture
   themselves), swipes that begin at the very edge of the screen (the browser's own back gesture), and anything slow
   or mostly vertical (that is scrolling). */
(function () {
  'use strict';
  var SPECS = [
    { box: 'figure.wt-step', prev: '.wt-prev', next: '.wt-next', hint: 'Swipe the picture left or right to change step', after: 'figcaption' },
    { box: '.mech', prev: '.mprev', next: '.mnext', hint: 'Swipe left or right to change step', after: '.mech-ctrl' },
    { box: '[data-gst]', prev: '.gst-go[data-d="-1"]', next: '.gst-go[data-d="1"]' },
    { box: '.flip-grid[data-deck]', sib: '.deck-nav', prev: '.js-dprev', next: '.js-dnext' }
  ];
  var BLOCK = 'input,select,textarea,[contenteditable],[data-noswipe],.ml-chart,.rp-chart,.dy-chart,.xp-chart,.xp-svg,.xl-chart,.ml-rng,.dk-row,#ls-sheet';
  var KEY = 'adhd.swiped', root = document.documentElement, t0 = null;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { if (localStorage.getItem(KEY) === '1') root.classList.add('sw-known'); } catch (e) {}

  /* a small hint under the arrows, shown only on touch screens until the first swipe */
  function addHints() {
    SPECS.forEach(function (sp) {
      if (!sp.hint) return;
      Array.prototype.forEach.call(document.querySelectorAll(sp.box), function (box) {
        var at = (sp.after && box.querySelector(sp.after)) || box.querySelector('img,svg'); if (!at || box.querySelector('.sw-hint')) return;
        var p = document.createElement('p'); p.className = 'sw-hint'; p.textContent = sp.hint; at.insertAdjacentElement('afterend', p);
      });
    });
  }

  function scrollsSideways(el, stop) {
    for (var a = el; a && a !== stop && a !== document.body; a = a.parentElement) {
      var o = getComputedStyle(a).overflowX;
      if ((o === 'auto' || o === 'scroll') && a.scrollWidth > a.clientWidth + 2) return true;
    }
    return false;
  }

  function buttonIn(box, sp, which) {
    var scope = sp.sib ? box.parentNode.querySelector(sp.sib) : box;
    return scope && scope.querySelector(which === 'next' ? sp.next : sp.prev);
  }

  document.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { t0 = null; return; }
    var t = e.touches[0]; t0 = { x: t.clientX, y: t.clientY, t: Date.now(), el: e.target };
  }, { passive: true });
  document.addEventListener('touchcancel', function () { t0 = null; }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (!t0) return;
    var s = t0, t = e.changedTouches[0]; t0 = null;
    var dx = t.clientX - s.x, dy = t.clientY - s.y, W = window.innerWidth || 375;
    if (Math.abs(dx) < 50 || Math.abs(dx) < 1.6 * Math.abs(dy) || Date.now() - s.t > 800) return;
    if (s.x < 22 || s.x > W - 22) return;                         /* the browser's own back/forward swipe */
    if (!s.el || !s.el.closest || s.el.closest(BLOCK)) return;
    for (var i = 0; i < SPECS.length; i++) {
      var sp = SPECS[i], box = s.el.closest(sp.box);
      if (!box || scrollsSideways(s.el, box)) continue;
      var b = buttonIn(box, sp, dx < 0 ? 'next' : 'prev');
      if (!b || b.disabled) return;
      b.click();
      try { localStorage.setItem(KEY, '1'); } catch (x) {}
      root.classList.add('sw-known');
      var m = box.querySelector('img,svg') || box;
      if (!reduce && m.animate) m.animate([{ transform: 'translateX(' + (dx < 0 ? 26 : -26) + 'px)', opacity: 0.45 }, { transform: 'none', opacity: 1 }], { duration: 230, easing: 'ease-out' });
      return;
    }
  }, { passive: true });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addHints); else addHints();
})();
