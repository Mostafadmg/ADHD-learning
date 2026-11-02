/* Keeps the labels and numbered dots on walkthrough pictures from sitting on top of each other.
   The labels (".tag") and the numbered dots (".wk-mark") are placed with percentages, which is right for a large
   picture but crowds them on a phone, where the same picture is about 230-300px wide. This measures them and, only
   where two collide or one hangs over the edge of the picture, nudges it by a few pixels (CSS variables --tdx / --tdy,
   used by "translate" in css/mobile.css). Nothing moves when nothing collides, and it runs again when the picture
   changes size (rotating the phone, a lesson opening, an image finishing loading). */
(function () {
  'use strict';
  var PAD = 3, EDGE = 2;

  function rect(e) { var r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; }
  /* the part you can see: a dot is a circle inside a larger invisible tap area */
  function seen(e) {
    var r = rect(e);
    if (e.classList.contains('wk-mark')) {
      var ins = parseFloat(getComputedStyle(e, '::before').left) || 7;
      return { l: r.l + ins, t: r.t + ins, r: r.r - ins, b: r.b - ins };
    }
    return r;
  }
  function hit(a, b) { return Math.min(a.r, b.r) - Math.max(a.l, b.l) > 1 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 1; }

  function tidy(ov) {
    var img = ov.querySelector('img'); if (!img) return;
    var marks = Array.prototype.slice.call(ov.querySelectorAll('.wk-mark'));
    var tags = Array.prototype.slice.call(ov.querySelectorAll('.tag'));
    var all = marks.concat(tags); if (!all.length) return;
    all.forEach(function (e) { e.style.removeProperty('--tdx'); e.style.removeProperty('--tdy'); });
    var ib = rect(img); if (ib.r - ib.l < 60 || ib.b - ib.t < 40) return;           /* hidden, or not laid out yet */
    if (getComputedStyle(all[0]).display === 'none') return;                          /* picture-only walkthroughs hide them */
    var base = new Map(), off = new Map();
    all.forEach(function (e) { base.set(e, seen(e)); off.set(e, { x: 0, y: 0 }); });
    function cur(e) { var b = base.get(e), o = off.get(e); return { l: b.l + o.x, t: b.t + o.y, r: b.r + o.x, b: b.b + o.y }; }
    function move(e, dx, dy) { var o = off.get(e); o.x += dx; o.y += dy; }
    function inside(b) { return b.l >= ib.l + EDGE - 0.5 && b.r <= ib.r - EDGE + 0.5 && b.t >= ib.t + EDGE - 0.5 && b.b <= ib.b - EDGE + 0.5; }
    function clamp(e) {
      var b = cur(e), dx = 0, dy = 0;
      if (b.r > ib.r - EDGE) dx = ib.r - EDGE - b.r;
      if (b.l + dx < ib.l + EDGE) dx = ib.l + EDGE - b.l;
      if (b.b > ib.b - EDGE) dy = ib.b - EDGE - b.b;
      if (b.t + dy < ib.t + EDGE) dy = ib.t + EDGE - b.t;
      if (dx || dy) move(e, dx, dy);
    }
    all.forEach(clamp);

    /* dots keep their place; labels step aside from dots and from the labels placed before them */
    var placed = [];
    tags.forEach(function (t) {
      for (var pass = 0; pass < 6; pass++) {
        var tb = cur(t), obs = marks.map(cur).concat(placed.map(cur)), h = null;
        for (var i = 0; i < obs.length; i++) { if (hit(tb, obs[i])) { h = obs[i]; break; } }
        if (!h) break;
        var tries = [
          { dx: 0, dy: h.b + PAD - tb.t }, { dx: 0, dy: h.t - PAD - tb.b },
          { dx: h.r + PAD - tb.l, dy: 0 }, { dx: h.l - PAD - tb.r, dy: 0 }
        ].filter(function (c) {
          var n = { l: tb.l + c.dx, t: tb.t + c.dy, r: tb.r + c.dx, b: tb.b + c.dy };
          return inside(n);
        });
        if (!tries.length) break;
        tries.sort(function (a, b) {
          var cost = function (c) {
            var n = { l: tb.l + c.dx, t: tb.t + c.dy, r: tb.r + c.dx, b: tb.b + c.dy }, k = 0;
            obs.forEach(function (o) { if (hit(n, o)) k += 100; });
            return k + Math.abs(c.dx) + Math.abs(c.dy);
          };
          return cost(a) - cost(b);
        });
        move(t, tries[0].dx, tries[0].dy);
      }
      placed.push(t);
    });

    all.forEach(function (e) {
      var o = off.get(e);
      if (Math.abs(o.x) > 0.5) e.style.setProperty('--tdx', Math.round(o.x) + 'px');
      if (Math.abs(o.y) > 0.5) e.style.setProperty('--tdy', Math.round(o.y) + 'px');
    });
  }

  var timer = 0, queued = [];
  function later(ov) { if (ov.classList && !ov.classList.contains('overlay-fig')) ov = ov.closest('.overlay-fig'); if (!ov) return; if (queued.indexOf(ov) < 0) queued.push(ov); if (!timer) timer = setTimeout(flush, 60); }
  function flush() { timer = 0; var q = queued.splice(0); q.forEach(function (ov) { try { tidy(ov); } catch (e) {} }); }

  function init() {
    var ovs = Array.prototype.slice.call(document.querySelectorAll('figure.wt .overlay-fig'));
    var ro = window.ResizeObserver ? new ResizeObserver(function (list) { list.forEach(function (en) { later(en.target); }); }) : null;
    ovs.forEach(function (ov) {
      if (ro) {
        ro.observe(ov);
        /* a label changes width when the web font arrives, without the picture changing size */
        Array.prototype.forEach.call(ov.querySelectorAll('.tag'), function (t) { ro.observe(t); });
      }
      var img = ov.querySelector('img');
      if (img && !img.complete) img.addEventListener('load', function () { later(ov); }, { once: true });
      later(ov);
    });
    if (!ro) window.addEventListener('resize', function () { ovs.forEach(later); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ovs.forEach(later); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.__figTidy = function () { Array.prototype.forEach.call(document.querySelectorAll('figure.wt .overlay-fig'), tidy); };
})();
