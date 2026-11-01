/* Module 5, phone layer for the older lessons (css/m5-phone.css). Runs on screens up to 700px and undoes itself on wider
   ones. Nothing is removed from the page: every table cell, card and paragraph stays in the markup, and without this script
   phones simply get the normal layout.
   - "The five medicines at a glance": the wide comparison table becomes a picker (one medicine at a time, or one question
     across all five) with a single glance card.
   - "Release profiles and brands": the chart options and the "in practice" notes fold away (the explorer itself is untouched).
   - "Before you prescribe: contraindications": the medicine picker gets three views (do not use, use with care, ask and why)
     that stay the same as you move from one medicine to the next, so lists can be compared.
   - "Switching, stopping and controlled drug rules": the cards become one-at-a-time rows, and the Schedule 2 table shows
     one column at a time (stimulants or non-stimulants). The text of the "Changing treatment" cards is not touched. */
(function () {
  'use strict';
  var root = document.getElementById('m5');
  if (!root) return;
  var mq = window.matchMedia ? window.matchMedia('(max-width:700px)') : { matches: false };
  var hooks = [];

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function txt(n) { return n ? n.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function arr(list) { return Array.prototype.slice.call(list); }
  var CHEV = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 6l-6 6 6 6"/></svg>';
  var CHEV_R = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6"/></svg>';

  /* lessons are found by title, so nothing in index.html depends on this file */
  var L = {};
  each(root.querySelectorAll('.lessons > .lesson'), function (l) { L[l.getAttribute('data-title')] = l; });
  var glance = L['The five medicines at a glance'], release = L['Release profiles and brands'],
      contra = L['Before you prescribe: contraindications'], titr = L['Titration: the method'],
      rules = L['Switching, stopping and controlled drug rules'], recap = L['Recap and practise'];
  [[glance, 'glance'], [release, 'release'], [contra, 'contra'], [titr, 'titr'], [rules, 'rules'], [recap, 'recap']].forEach(function (p) {
    if (p[0]) p[0].classList.add('m5p', 'm5p-' + p[1]);
  });

  /* ================= lesson 1: the five medicines, one at a time ================= */
  function glanceInit() {
    var wrap = glance && glance.querySelector('.mt-wrap'), tbl = wrap && wrap.querySelector('table.mt');
    if (!tbl || !tbl.tBodies[0]) return;
    var meds = arr(tbl.querySelectorAll('thead th')).slice(1).map(function (th) {
      return { ab: txt(th.querySelector('.mt-ab')), name: txt(th.querySelector('.mt-nm')), type: txt(th.querySelector('.mt-ty')), non: th.classList.contains('mt-non') };
    });
    if (meds.length < 2) return;
    var rows = [], groups = [], grp = '';
    each(tbl.tBodies[0].rows, function (tr) {
      if (tr.classList.contains('mt-grp')) { grp = txt(tr); groups.push(tr); return; }
      var r = { tr: tr, label: txt(tr.cells[0]), group: grp, cells: arr(tr.cells).slice(1) };
      r.cells.forEach(function (c, i) { if (!meds[i]) return; c.setAttribute('data-med', meds[i].name); c.classList.add(meds[i].non ? 'm5-non' : 'm5-stim'); });
      rows.push(r);
    });
    if (!rows.length) return;
    var S = { mode: 'med', med: 0, q: 0 }, ui = null, head = null, sel = null;

    function short(g) { return g.split(':')[0]; }
    function build() {
      var opts = '', last = null;
      rows.forEach(function (r, i) {
        if (r.group !== last) { if (last !== null) opts += '</optgroup>'; opts += '<optgroup label="' + esc(short(r.group)) + '">'; last = r.group; }
        var dup = rows.filter(function (o) { return o.label === r.label; }).length > 1;   /* "Children" and "Adults" appear twice */
        opts += '<option value="' + i + '">' + esc(dup ? short(r.group) + ' · ' + r.label : r.label) + '</option>';
      });
      opts += '</optgroup>';
      ui = el('div', 'm5-cmp');
      ui.innerHTML =
        '<div class="m5-seg" role="group" aria-label="How to compare the medicines">' +
          '<button type="button" data-mode="med">One medicine</button><button type="button" data-mode="q">One question</button></div>' +
        '<div class="m5-meds" role="group" aria-label="Choose a medicine">' + meds.map(function (m, i) {
          return '<button type="button" class="m5-chip ' + (m.non ? 'm5-non' : 'm5-stim') + '" data-i="' + i + '"><b>' + esc(m.name) + '</b><small>' + esc(m.type) + '</small></button>';
        }).join('') + '</div>' +
        '<div class="m5-qs"><button type="button" class="m5-qb" data-d="-1" aria-label="Previous question">' + CHEV + '</button>' +
          '<label class="m5-qsel"><span class="m5-sr">Question to compare across the five medicines</span><select>' + opts + '</select></label>' +
          '<button type="button" class="m5-qb" data-d="1" aria-label="Next question">' + CHEV_R + '</button></div>';
      sel = ui.querySelector('select');
      head = el('div', 'm5-head');
      head.setAttribute('aria-live', 'polite');
      ui.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('button') : null;
        if (!b || !ui.contains(b)) return;
        if (b.getAttribute('data-mode')) S.mode = b.getAttribute('data-mode');
        else if (b.classList.contains('m5-chip')) { S.med = +b.getAttribute('data-i'); S.mode = 'med'; }
        else if (b.getAttribute('data-d')) S.q = (S.q + (+b.getAttribute('data-d')) + rows.length) % rows.length;
        apply();
      });
      sel.addEventListener('change', function () { S.q = +sel.value; apply(); });
    }
    function apply() {
      var med = S.mode === 'med';
      ui.setAttribute('data-mode', S.mode); wrap.setAttribute('data-mode', S.mode);
      groups.forEach(function (g) { g.classList.toggle('m5-off', !med); });
      rows.forEach(function (r, i) {
        r.tr.classList.toggle('m5-off', !med && i !== S.q);
        r.cells.forEach(function (c, ci) { c.classList.toggle('m5-off', med && ci !== S.med); });
      });
      each(ui.querySelectorAll('[data-mode]'), function (b) { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', b.getAttribute('data-mode') === S.mode ? 'true' : 'false'); });
      each(ui.querySelectorAll('.m5-chip'), function (b) { b.setAttribute('aria-pressed', med && +b.getAttribute('data-i') === S.med ? 'true' : 'false'); });
      sel.value = String(S.q);
      if (med) {
        var m = meds[S.med];
        head.className = 'm5-head ' + (m.non ? 'm5-non' : 'm5-stim');
        head.innerHTML = '<span class="m5-hab">' + esc(m.ab) + '</span><span class="m5-hn"><b>' + esc(m.name) + '</b><small>' + esc(m.type) + '</small></span>';
      } else {
        var r = rows[S.q];
        head.className = 'm5-head m5-headq';
        head.innerHTML = '<span class="m5-hn"><small>' + esc(short(r.group)) + '</small><b>' + esc(r.label) + '</b></span><span class="m5-hnote">All five medicines</span>';
      }
    }
    var box = null;   /* picker and card live in one block, so the "Keep going" parts never cut between them */
    function on() {
      if (wrap.classList.contains('m5-mt-on')) return;
      if (!ui) build();
      if (!box) box = el('div', 'm5-box');
      wrap.classList.add('m5-mt-on');
      wrap.parentNode.insertBefore(box, wrap);
      box.appendChild(ui); box.appendChild(wrap);
      wrap.insertBefore(head, wrap.firstChild);
      apply();
    }
    function off() {
      if (!wrap.classList.contains('m5-mt-on')) return;
      wrap.classList.remove('m5-mt-on'); wrap.removeAttribute('data-mode');
      if (box && box.parentNode) { box.parentNode.insertBefore(wrap, box); box.parentNode.removeChild(box); }
      if (ui && ui.parentNode) ui.parentNode.removeChild(ui);
      if (head && head.parentNode) head.parentNode.removeChild(head);
      each(tbl.querySelectorAll('.m5-off'), function (n) { n.classList.remove('m5-off'); });
    }
    hooks.push({ on: on, off: off });
  }

  /* ================= lesson 3: fold the chart options and the practice notes ================= */
  function releaseInit() {
    var box = release && release.querySelector('[data-rp]');
    if (!box) return;
    var left = box.querySelector('.rp-left'), panel = box.querySelector('.rp-panel'), opts = box.querySelector('.rp-opts'), note = box.querySelector('.rp-note'), read = box.querySelector('.rp-read');
    if (!left || !panel || !opts) return;
    var fold = null, open = [false, false], mo = null, busy = false;

    function mk(title, hint) {
      return '<summary><span class="mx-t"><b>' + title + '</b><small>' + hint + '</small></span><span class="mx-chev" aria-hidden="true"></span></summary>';
    }
    function foldOptions() {
      fold = el('details', 'mx m5-fold m5-fold-opts');
      fold.innerHTML = mk('Chart options', 'Show the two parts, add a 12:00 dose, compare with another product') + '<div class="mx-b"></div>';
      var body = fold.lastChild;
      left.insertBefore(fold, opts);
      body.appendChild(opts);
      if (note) body.appendChild(note);
    }
    function unfoldOptions() {
      if (!fold) return;
      left.insertBefore(opts, fold);
      if (note) left.insertBefore(note, fold);
      left.removeChild(fold); fold = null;
    }
    /* "What is inside" and "In practice" fold away; "Through the day" stays open next to the chart */
    var HINT = ['How much is released at once and how', 'Practical points, brands and strengths'];
    function foldPanel() {
      if (!mq.matches || busy) return;
      var secs = panel.querySelectorAll('.rp-sec');
      if (secs.length < 3) return;
      busy = true;
      [0, 2].forEach(function (k, n) {
        var sec = secs[k], h = sec.querySelector('h5');
        if (!h || sec.getAttribute('data-m5')) return;
        sec.setAttribute('data-m5', '1');
        var d = el('details', 'mx m5-fold m5-fold-ip');
        if (open[n]) d.open = true;
        var sm = el('summary'), t = el('span', 'mx-t'), b = el('b'), sx = el('small', '', HINT[n]), ch = el('span', 'mx-chev');
        ch.setAttribute('aria-hidden', 'true');
        b.appendChild(h); t.appendChild(b); t.appendChild(sx); sm.appendChild(t); sm.appendChild(ch);
        d.appendChild(sm);
        var body = el('div', 'mx-b');
        while (sec.firstChild) body.appendChild(sec.firstChild);
        d.appendChild(body);
        sec.appendChild(d);
        d.addEventListener('toggle', function () { open[n] = d.open; });
      });
      busy = false;
    }
    function unfoldPanel() {
      each(panel.querySelectorAll('.rp-sec[data-m5]'), function (sec) {
        var d = sec.querySelector('details.m5-fold-ip'); if (!d) return;
        var h = d.querySelector('summary h5'), body = d.querySelector('.mx-b');
        sec.removeAttribute('data-m5');
        while (sec.firstChild) sec.removeChild(sec.firstChild);
        if (h) sec.appendChild(h);
        while (body && body.firstChild) sec.appendChild(body.firstChild);
      });
    }
    function on() {
      if (!fold) foldOptions();
      foldPanel();
      if (!mo && window.MutationObserver) { mo = new MutationObserver(function () { if (!busy) foldPanel(); }); mo.observe(panel, { childList: true }); }
    }
    function off() {
      if (mo) { mo.disconnect(); mo = null; }
      unfoldOptions(); unfoldPanel();
    }
    hooks.push({ on: on, off: off });
  }

  /* ================= lesson 12: one-at-a-time rows and the Schedule 2 switch ================= */
  function accordion(grid) {
    var cards = arr(grid.children).filter(function (c) { return c.classList.contains('clin-c'); });
    if (cards.length < 2) return { on: function () {}, off: function () {} };
    function open(c, yes) {
      c.classList.toggle('m5-open', yes);
      var t = c.querySelector('.clin-t'); if (t) t.setAttribute('aria-expanded', yes ? 'true' : 'false');
    }
    function toggle(c) {
      var yes = !c.classList.contains('m5-open');
      cards.forEach(function (o) { open(o, o === c ? yes : false); });
    }
    function onClick(e) { toggle(e.currentTarget.parentNode); }
    function onKey(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e.currentTarget.parentNode); } }
    return {
      on: function () {
        if (grid.classList.contains('m5-acc')) return;
        grid.classList.add('m5-acc');
        cards.forEach(function (c) {
          var t = c.querySelector('.clin-t'); if (!t) return;
          t.setAttribute('role', 'button'); t.tabIndex = 0;
          open(c, false);
          t.addEventListener('click', onClick); t.addEventListener('keydown', onKey);
        });
      },
      off: function () {
        if (!grid.classList.contains('m5-acc')) return;
        grid.classList.remove('m5-acc');
        cards.forEach(function (c) {
          c.classList.remove('m5-open');
          var t = c.querySelector('.clin-t'); if (!t) return;
          t.removeAttribute('role'); t.removeAttribute('tabindex'); t.removeAttribute('aria-expanded');
          t.removeEventListener('click', onClick); t.removeEventListener('keydown', onKey);
        });
      }
    };
  }

  function rulesInit() {
    if (!rules) return;
    each(rules.querySelectorAll('.clin-grid'), function (g) { hooks.push(accordion(g)); });
    var wrap = rules.querySelector('.table-wrap'), tbl = wrap && wrap.querySelector('table');
    if (!tbl || tbl.rows.length < 3) return;
    var heads = arr(tbl.rows[0].cells).map(txt);
    if (heads.length !== 3) return;
    var body = arr(tbl.rows).slice(1).filter(function (tr) { return tr.cells.length === 3; });
    var S = 0, ui = null, who = null;
    function apply() {
      body.forEach(function (tr) { tr.cells[1].classList.toggle('m5-off', S !== 0); tr.cells[2].classList.toggle('m5-off', S !== 1); });
      each(ui.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-c') === S ? 'true' : 'false'); });
      who.textContent = heads[S + 1];
      who.className = 'm5-who ' + (S === 0 ? 'm5-stim' : 'm5-non');
    }
    var box = null;
    function on() {
      if (wrap.classList.contains('m5-cd-on')) return;
      if (!box) box = el('div', 'm5-box');
      if (!ui) {
        ui = el('div', 'm5-cmp m5-cmp-cd');
        ui.innerHTML = '<div class="m5-seg" role="group" aria-label="Which medicines">' +
          '<button type="button" data-c="0"><b>Stimulants</b><small>Schedule 2</small></button>' +
          '<button type="button" data-c="1"><b>Non-stimulants</b><small>Prescription-only (POM)</small></button></div>';
        who = el('p', 'm5-who');
        ui.addEventListener('click', function (e) { var b = e.target.closest ? e.target.closest('button') : null; if (!b) return; S = +b.getAttribute('data-c'); apply(); });
      }
      wrap.classList.add('m5-cd-on');
      wrap.parentNode.insertBefore(box, wrap);
      box.appendChild(ui); box.appendChild(wrap);
      wrap.insertBefore(who, wrap.firstChild);
      apply();
    }
    function off() {
      if (!wrap.classList.contains('m5-cd-on')) return;
      wrap.classList.remove('m5-cd-on');
      if (box && box.parentNode) { box.parentNode.insertBefore(wrap, box); box.parentNode.removeChild(box); }
      if (ui && ui.parentNode) ui.parentNode.removeChild(ui);
      if (who && who.parentNode) who.parentNode.removeChild(who);
      each(tbl.querySelectorAll('.m5-off'), function (n) { n.classList.remove('m5-off'); });
    }
    hooks.push({ on: on, off: off });
  }

  /* ================= lesson 10: three views of every medicine (do not use, use with care, ask and why) ================= */
  function contraInit() {
    var fx = contra && contra.querySelector('.m5-fx'), tabs = fx && fx.querySelector('.fx-tabs');
    if (!tabs) return;
    var panels = arr(fx.querySelectorAll('.fx-panel')), S = 0, ui = null;
    var VIEWS = [['not', 'Do not use'], ['care', 'Use with care'], ['ask', 'Ask and why']];
    function viewOf(b) { return b.classList.contains('fx-not') ? 0 : b.classList.contains('fx-says') ? 1 : 2; }
    function apply() {
      panels.forEach(function (p) { each(p.querySelectorAll('.fx-box'), function (b) { b.classList.toggle('m5-boff', viewOf(b) !== S); }); });
      each(ui.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-v') === S ? 'true' : 'false'); });
    }
    function on() {
      if (fx.classList.contains('m5-views-on')) return;
      if (!ui) {
        ui = el('div', 'm5-views');
        ui.setAttribute('role', 'group'); ui.setAttribute('aria-label', 'What to show for the medicine');
        ui.innerHTML = VIEWS.map(function (v, i) { return '<button type="button" class="m5-vw m5-vw-' + v[0] + '" data-v="' + i + '">' + v[1] + '</button>'; }).join('');
        ui.addEventListener('click', function (e) { var b = e.target.closest ? e.target.closest('button') : null; if (!b) return; S = +b.getAttribute('data-v'); apply(); });
      }
      fx.classList.add('m5-views-on');
      tabs.parentNode.insertBefore(ui, tabs.nextSibling);
      apply();
    }
    function off() {
      if (!fx.classList.contains('m5-views-on')) return;
      fx.classList.remove('m5-views-on');
      if (ui && ui.parentNode) ui.parentNode.removeChild(ui);
      each(fx.querySelectorAll('.m5-boff'), function (b) { b.classList.remove('m5-boff'); });
    }
    hooks.push({ on: on, off: off });
  }

  function sync() { hooks.forEach(function (h) { if (mq.matches) h.on(); else h.off(); }); }

  glanceInit(); releaseInit(); contraInit(); rulesInit();
  sync();
  if (mq.addEventListener) mq.addEventListener('change', sync); else if (mq.addListener) mq.addListener(sync);
})();
