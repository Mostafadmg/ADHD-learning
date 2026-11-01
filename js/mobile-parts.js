/* Progressive reading on phones (screens up to 700px; CSS in css/mobile.css).
   A tall lesson is shown a part at a time: the first screen-and-a-bit, then a "Keep going" card reveals the next
   part below it. Nothing is removed or reworded: the hidden parts are still in the page (search, print and
   screen readers see them) and a "Show the whole lesson" link opens everything.
   Parts are cut between blocks (never straight after a heading), about 1.2 screens each. Short lessons are left alone.
   Hooks: the bottom dock (js/mobile-dock.js) uses window.__partsInfo() and window.__partsNext() so its Next button
   means "keep going" until a lesson's parts are all open; scrollIntoView() is wrapped so that anything that jumps
   to an element (search results, "reread this step", case links, #anchors) opens the part that holds it first. */
(function () {
  'use strict';
  var mq = window.matchMedia ? window.matchMedia('(max-width:700px)') : { matches: false };
  var S = new WeakMap();             /* lesson -> { parts:[[el...]], shown:n, btns:[] } */
  var planned = [];                  /* lessons that have been cut up (so they can be put back) */
  var origSIV = Element.prototype.scrollIntoView;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function isHeading(el) { return /^H[2-4]$/.test(el.tagName) || el.classList.contains('fx-lbl'); }
  var STARTER = 'details,figure,.callout,.gst,.ml,.cmp-wrap,.stat-grid,.risk-grid,.ev-list,.mf-grid,.clin-grid,.bflow,.tl,.practice,.takeaways,.say,.xp-mount,.glance,.fx,.cost-grid,table,.rec-grid,.tk,.mph,[data-rp],.pw2,.lab-mount,.agp';
  function isStarter(el) { return /^H[34]$/.test(el.tagName) || (el.matches && el.matches(STARTER)); }
  function outerH(el) {
    var r = el.getBoundingClientRect(); if (!r.height) return 0;
    var cs = getComputedStyle(el); return r.height + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0);
  }
  function viewH() { return Math.max(520, (window.innerHeight || 700) - 150); }   /* the part of the screen left once the dock and top are counted */

  function teaser(part) {
    var h = part.filter(function (e) { return /^H[34]$/.test(e.tagName); })[0];
    if (h) return h.textContent.trim();
    var p = part.filter(function (e) { return e.tagName === 'P' && e.textContent.trim().length > 20; })[0] || part[0];
    var t = p ? p.textContent.replace(/\s+/g, ' ').trim() : '';
    return t.length > 64 ? t.slice(0, 62).replace(/\s+\S*$/, '') + '…' : t;
  }

  function plan(l) {
    if (S.has(l) || !mq.matches || l.hidden) return;
    var kids = Array.prototype.filter.call(l.children, function (k) { return !k.classList.contains('pt-more') && !k.classList.contains('pt-all'); });
    var H = kids.map(outerH), total = H.reduce(function (a, b) { return a + b; }, 0), Hv = viewH();
    if (total < Hv * 2.1) { S.set(l, { parts: null }); return; }                     /* short enough: leave it */
    var target = Hv * 1.15, max = Hv * 1.7, parts = [[]], acc = 0;
    kids.forEach(function (k, i) {
      var cur = parts[parts.length - 1], h = H[i], prev = cur[cur.length - 1];
      var cut = cur.length > 1 && h > 0 && ((acc >= target && isStarter(k)) || (acc + h > max && acc >= Hv * 0.6));
      if (cut) {
        var carry = [];
        while (cur.length > 2 && isHeading(cur[cur.length - 1])) carry.unshift(cur.pop());     /* a heading never ends a part */
        if (cur.length > 1) { parts.push(carry); acc = carry.reduce(function (a, e) { return a + outerH(e); }, 0); cur = parts[parts.length - 1]; }
        else { cur.push.apply(cur, carry); }
      }
      cur.push(k); acc += h;
    });
    /* a very short last part is folded into the one before it */
    if (parts.length > 1) {
      var lastH = parts[parts.length - 1].reduce(function (a, e) { return a + outerH(e); }, 0);
      if (lastH < Hv * 0.3) { var tail = parts.pop(); parts[parts.length - 1] = parts[parts.length - 1].concat(tail); }
    }
    if (parts.length < 2) { S.set(l, { parts: null }); return; }
    var st = { parts: parts, shown: 1, btns: [], all: null };
    S.set(l, st); planned.push(l);
    parts.forEach(function (part, pi) {
      if (pi === 0) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'pt-more'; b.dataset.pt = pi;
      b.innerHTML = '<span class="pt-t"><span class="pt-k">Part ' + (pi + 1) + ' of ' + parts.length + '</span><b>Keep going</b><span class="pt-s">' + esc(teaser(part)) + '</span></span>' +
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
      b.addEventListener('click', function () { showTo(l, pi, true); });
      part[0].parentNode.insertBefore(b, parts[pi - 1][parts[pi - 1].length - 1].nextSibling);
      st.btns[pi] = b;
    });
    var all = document.createElement('button'); all.type = 'button'; all.className = 'pt-all'; all.textContent = 'Show the whole lesson';
    all.addEventListener('click', function () { showTo(l, parts.length - 1, false); });
    st.all = all; l.appendChild(all);
    parts.forEach(function (part, pi) { if (pi > 0) part.forEach(function (e) { e.classList.add('pt-off'); }); });
    refresh(l);
  }

  function refresh(l) {
    var st = S.get(l); if (!st || !st.parts) return;
    st.btns.forEach(function (b, i) { if (b) b.hidden = i !== st.shown; });          /* only the next card is offered */
    if (st.all) st.all.hidden = st.shown >= st.parts.length;
  }

  function showTo(l, k, scroll) {
    var st = S.get(l); if (!st || !st.parts) return;
    var from = st.shown;
    for (var i = st.shown; i <= k && i < st.parts.length; i++) st.parts[i].forEach(function (e) { e.classList.remove('pt-off'); });
    st.shown = Math.max(st.shown, k + 1); refresh(l);
    if (scroll && st.shown > from) {
      var first = st.parts[from][0];
      if (first) { first.style.scrollMarginTop = '72px'; origSIV.call(first, { block: 'start', behavior: 'auto' }); }
    }
  }

  /* anything that jumps to an element opens the part that holds it first */
  function revealFor(el) {
    if (!mq.matches || !el || !el.closest) return;
    var l = el.closest('.lesson'); if (!l) return;
    if (!S.has(l)) plan(l);
    var st = S.get(l); if (!st || !st.parts || st.shown >= st.parts.length) return;
    for (var pi = st.shown; pi < st.parts.length; pi++) {
      if (st.parts[pi].some(function (e) { return e === el || e.contains(el); })) { showTo(l, pi, false); return; }
    }
  }
  Element.prototype.scrollIntoView = function () { try { revealFor(this); } catch (e) {} return origSIV.apply(this, arguments); };

  function activeLesson() { var m = document.querySelector('.module.active'); return m && m.querySelector('.lessons > .lesson:not([hidden])'); }
  /* for the dock: how far through the open lesson are we? */
  window.__partsInfo = function () {
    var l = activeLesson(); if (!l) return null; plan(l);
    var st = S.get(l); return st && st.parts ? { shown: st.shown, total: st.parts.length, next: st.shown < st.parts.length ? teaser(st.parts[st.shown]) : '' } : null;
  };
  window.__partsNext = function () {
    var l = activeLesson(); if (!l) return false; plan(l);
    var st = S.get(l); if (!st || !st.parts || st.shown >= st.parts.length) return false;
    showTo(l, st.shown, true); return true;
  };

  function undo() {
    planned.splice(0).forEach(function (l) {
      var st = S.get(l); if (!st || !st.parts) return;
      st.parts.forEach(function (p) { p.forEach(function (e) { e.classList.remove('pt-off'); e.style.scrollMarginTop = ''; }); });
      st.btns.forEach(function (b) { if (b) b.remove(); }); if (st.all) st.all.remove();
    });
    S = new WeakMap();
  }

  function init() {
    var main = document.querySelector('main') || document.body;
    /* cut a lesson up the first time it is on screen */
    var pend = 0;
    function look() { pend = 0; var l = activeLesson(); if (l) plan(l); }
    new MutationObserver(function () { if (!pend) pend = requestAnimationFrame(function () { setTimeout(look, 30); }); }).observe(main, { attributes: true, attributeFilter: ['hidden', 'class'], subtree: true });
    window.addEventListener('hashchange', function () { setTimeout(look, 80); });
    window.addEventListener('load', function () { setTimeout(look, 150); });
    var change = function () { undo(); if (mq.matches) setTimeout(look, 60); };
    if (mq.addEventListener) mq.addEventListener('change', change); else if (mq.addListener) mq.addListener(change);
    look();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
