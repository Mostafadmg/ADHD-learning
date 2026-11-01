/* Module 11, phone layer.
   1. Lessons 4 and 7: the tappable medicine cards (table[data-cards]) keep their whole grid together; the detail card
      always sits under the grid (app.js opens it in the middle of the grid on phones). Lesson 2: the four questions
      of the decision aid become four tappable rows, one answer open at a time (phones only).
   2. Lesson 5 ("Turning 18"): a one-question picker, "Is this product licensed at 18?". It is built only from the two
      lists (green and coral) and the footnotes that are already on the page (the green and coral chip lists, and the paragraph that starts
      "* Delmosart"), so nothing is typed twice. If this script does not run, the lists and footnotes are still on the page. */
(function () {
  'use strict';

  /* 1. detail card under the grid */
  Array.prototype.forEach.call(document.querySelectorAll('#m11 .sxc'), function (wrap) {
    var grid = wrap.querySelector('.sxc-grid'), det = wrap.querySelector('.sxc-detail');
    if (!grid || !det) return;
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function park() { if (det.parentNode !== wrap) wrap.appendChild(det); }
    function show() {
      park();
      /* if the answer starts below the middle of the screen, bring it up so a tap always shows something happening */
      var r = det.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.7) window.scrollBy({ top: r.top - window.innerHeight * 0.4, behavior: calm ? 'auto' : 'smooth' });
    }
    park();
    Array.prototype.forEach.call(grid.querySelectorAll('.sxc-card'), function (c) { c.addEventListener('click', show); });
  });

  /* 1b. lesson 2: the four questions are four rows; tap a question to read its answer (one open at a time, phones only) */
  (function () {
    var ol = document.querySelector('#m11-l2 .pj-steps');
    if (!ol) return;
    var items = Array.prototype.slice.call(ol.children);
    var mq = window.matchMedia ? window.matchMedia('(max-width:700px)') : { matches: false };
    function title(li) { return li.querySelector(':scope > b'); }
    function set(li, on) {
      li.classList.toggle('open', on);
      var t = title(li); if (t) t.setAttribute('aria-expanded', on ? 'true' : 'false');
    }
    function pick(li) { var was = li.classList.contains('open'); items.forEach(function (x) { set(x, false); }); set(li, !was); }
    function onKey(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(e.currentTarget.parentNode); } }
    function onClick(e) { pick(e.currentTarget.parentNode); }
    function on() {
      if (ol.classList.contains('pj-acc')) return;
      ol.classList.add('pj-acc');
      items.forEach(function (li, i) {
        var t = title(li); if (!t) return;
        t.setAttribute('role', 'button'); t.tabIndex = 0;
        t.addEventListener('click', onClick); t.addEventListener('keydown', onKey);
        set(li, i === 0);
      });
    }
    function off() {
      if (!ol.classList.contains('pj-acc')) return;
      ol.classList.remove('pj-acc');
      items.forEach(function (li) {
        var t = title(li); if (!t) return;
        t.removeAttribute('role'); t.removeAttribute('tabindex'); t.removeAttribute('aria-expanded');
        t.removeEventListener('click', onClick); t.removeEventListener('keydown', onKey);
        li.classList.remove('open');
      });
    }
    function sync() { if (mq.matches) on(); else off(); }
    sync();
    if (mq.addEventListener) mq.addEventListener('change', sync); else if (mq.addListener) mq.addListener(sync);
  })();

  /* 2. licence picker */
  var host = document.querySelector('#m11 [data-m11lic]');
  if (!host) return;

  function chips(sel) {
    return Array.prototype.map.call(document.querySelectorAll('#m11 ' + sel + ' .m11-chips span'), function (s) { return s.textContent.trim(); });
  }
  var yes = chips('.m11-lic-y'), no = chips('.m11-lic-n');
  var fnEl = null;
  Array.prototype.forEach.call(document.querySelectorAll('#m11-l5 p.cl-progress'), function (p) { if (/^\s*\*/.test(p.textContent)) fnEl = p; });
  var notes = {};
  if (fnEl) {
    var t = fnEl.textContent.replace(/\s+/g, ' ').trim();
    var re = /([*†‡§])\s+([^*†‡§]+)/g, m;
    while ((m = re.exec(t))) notes[m[1]] = m[2].trim();
  }
  /* the two group names are the labels above the two lists */
  var group = ['Licensed in adults', 'Children only: off-label from 18'];
  var gy = document.querySelector('#m11 .m11-lic-y .m11-sk'), gn = document.querySelector('#m11 .m11-lic-n .m11-sk');
  if (gy && gn) group = [gy.textContent.trim(), gn.textContent.trim()];

  function split(label) {
    var m = /^(.*?)([*†‡§]*)$/.exec(label);
    return { name: m[1].trim(), sym: m[2] };
  }
  function esc(x) { return String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  var all = [];
  yes.forEach(function (l) { var p = split(l); all.push({ name: p.name, sym: p.sym, ok: true }); });
  no.forEach(function (l) { var p = split(l); all.push({ name: p.name, sym: p.sym, ok: false }); });

  function opts(ok) {
    return all.filter(function (a) { return a.ok === ok; }).map(function (a) { return '<option value="' + esc(a.name) + '">' + esc(a.name) + '</option>'; }).join('');
  }
  host.innerHTML =
    '<label class="hb-sel"><span>Product</span><select class="m11-lic-sel">' +
    '<option value="">Choose a product</option>' +
    '<optgroup label="' + esc(group[0]) + '">' + opts(true) + '</optgroup>' +
    '<optgroup label="' + esc(group[1]) + '">' + opts(false) + '</optgroup></select></label>' +
    '<div class="m11-lic-out" aria-live="polite"></div>';
  var sel = host.querySelector('select'), out = host.querySelector('.m11-lic-out');
  sel.addEventListener('change', function () {
    var a = all.filter(function (x) { return x.name === sel.value; })[0];
    if (!a) { out.innerHTML = ''; return; }
    out.innerHTML = '<div class="m11-lic-res ' + (a.ok ? 'is-yes' : 'is-no') + '"><span class="m11-lic-pill">' + esc(a.ok ? group[0] : group[1]) + '</span>' +
      '<b>' + esc(a.name) + '</b>' +
      (a.sym && notes[a.sym] ? '<p><span class="m11-lic-sym">' + esc(a.sym) + '</span> ' + esc(notes[a.sym]) + '</p>' : '') + '</div>';
  });
})();
