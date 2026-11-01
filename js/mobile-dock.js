/* Phone study dock (screens up to 900px wide; CSS in css/mobile.css).
   The lesson bar at the top of a lesson is far from a thumb, so on small screens a bar is fixed to the bottom of the
   screen instead: Back, "Lesson 3 / 10" (tap to open the list of lessons as a bottom sheet) and Next. It does not
   hold its own state: it reads the lesson bar that js/app.js already builds and clicks that bar's own buttons, so
   progress, ticks and the remembered place all keep working in one place.
   Also: the top bar slides away while you scroll down and returns when you scroll up, and the dock hides while a
   text field has focus (the on-screen keyboard would cover it). */
(function () {
  'use strict';
  var mq = window.matchMedia ? window.matchMedia('(max-width:900px)') : { matches: false, addEventListener: function () {} };
  var root = document.documentElement, body = document.body;
  var dock, sheet, list, sheetTitle, prevB, nextB, midB, midN, midT, prog;
  var last = { sig: '' };

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function build() {
    dock = document.createElement('div');
    dock.id = 'ls-dock'; dock.hidden = true; dock.setAttribute('role', 'navigation'); dock.setAttribute('aria-label', 'Lesson navigation');
    dock.innerHTML =
      '<div class="dk-prog" aria-hidden="true"></div>' +
      '<div class="dk-row">' +
        '<button type="button" class="dk-b dk-prev"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>Back</span></button>' +
        '<button type="button" class="dk-mid" aria-haspopup="dialog" aria-expanded="false"><span class="dk-n"></span><span class="dk-t"></span><svg class="dk-c" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button>' +
        '<button type="button" class="dk-b dk-next"><span>Next</span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '</div>';
    sheet = document.createElement('div');
    sheet.id = 'ls-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="sh-back"></div><div class="sh-panel" role="dialog" aria-modal="true" aria-label="All lessons"><div class="sh-grip" aria-hidden="true"></div>' +
      '<div class="sh-head"><b class="sh-title"></b><button type="button" class="sh-x">Close</button></div><ol class="sh-list"></ol></div>';
    body.appendChild(dock); body.appendChild(sheet);
    prevB = $('.dk-prev', dock); nextB = $('.dk-next', dock); midB = $('.dk-mid', dock); midN = $('.dk-n', dock); midT = $('.dk-t', dock); prog = $('.dk-prog', dock);
    list = $('.sh-list', sheet); sheetTitle = $('.sh-title', sheet);

    prevB.addEventListener('click', function () { var b = bar(); if (b) { var t = $('.ls-tprev', b); if (t && !t.disabled) t.click(); } });
    nextB.addEventListener('click', function () { var b = bar(); if (b) { var t = $('.ls-tnext', b); if (t && !t.disabled) t.click(); } });
    midB.addEventListener('click', openSheet);
    $('.sh-back', sheet).addEventListener('click', closeSheet);
    $('.sh-x', sheet).addEventListener('click', closeSheet);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });
    list.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]'); if (!b) return;
      var cur = bar(); var orig = cur && $('.ls-menu button[data-i="' + b.dataset.i + '"]', cur);
      closeSheet(); if (orig) orig.click();
    });
  }

  function bar() { var box = $('.module.active [data-lessons]'); var b = box && $('.ls-bar', box); return b && !b.hidden ? b : null; }

  function openSheet() {
    var b = bar(); if (!b) return;
    var items = $$('.ls-menu button', b);
    list.innerHTML = items.map(function (it) {
      var cls = (it.classList.contains('cur') ? ' cur' : '') + (it.classList.contains('done') ? ' done' : '');
      var n = $('.ls-n', it).textContent, t = $('.ls-t', it).textContent, m = $('.ls-m', it).textContent;
      return '<li><button type="button" data-i="' + it.dataset.i + '" class="' + cls.trim() + '"' + (it.classList.contains('cur') ? ' aria-current="step"' : '') + '><span class="sh-n">' + (it.classList.contains('done') ? '' : esc(n)) + '</span><span class="sh-t">' + esc(t) + '</span><span class="sh-m">' + esc(m) + '</span></button></li>';
    }).join('');
    var mod = $('.module.active'); sheetTitle.textContent = mod ? (mod.dataset.title || 'Lessons') : 'Lessons';
    sheet.hidden = false; root.classList.add('sheet-open'); midB.setAttribute('aria-expanded', 'true');
    var cur = $('.cur', list); if (cur) { cur.scrollIntoView({ block: 'center' }); cur.focus({ preventScroll: true }); } else $('.sh-x', sheet).focus();
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.hidden = true; root.classList.remove('sheet-open'); midB.setAttribute('aria-expanded', 'false'); midB.focus({ preventScroll: true });
  }

  /* Copy the state of the module's own lesson bar into the dock. */
  function sync() {
    if (!dock) return;
    var b = mq.matches ? bar() : null;
    if (!b) { dock.hidden = true; body.classList.remove('has-dock'); if (sheet && !sheet.hidden) { sheet.hidden = true; root.classList.remove('sheet-open'); } last.sig = ''; return; }
    var curBtn = $('.ls-menu button.cur', b), idx = curBtn ? +curBtn.dataset.i : 0, n = $$('.ls-menu button[data-i]', b).filter(function (x) { return +x.dataset.i >= 0; }).length;
    var tprev = $('.ls-tprev', b), tnext = $('.ls-tnext', b), nx = $('.ls-nav .ls-next', b.parentNode);
    var title = curBtn ? $('.ls-t', curBtn).textContent : '', min = curBtn ? $('.ls-m', curBtn).textContent : '';
    var lastLesson = idx === n - 1, label = 'Next';
    if (lastLesson) label = nx && /^Next module/.test(nx.textContent) ? 'Next module' : (nx && /^Next section/.test(nx.textContent) ? 'Next section' : 'Next');
    var dis = !!(tprev && tprev.disabled), ndis = !!(tnext && tnext.disabled);
    var done = $$('.ls-seg', b).map(function (s) { return s.classList.contains('cur') ? 'c' : (s.classList.contains('done') ? 'd' : 'o'); }).join('');
    var sig = [idx, n, title, label, dis, ndis, done].join('|');
    dock.hidden = false; body.classList.add('has-dock');
    if (sig === last.sig) return; last.sig = sig;
    midN.innerHTML = (idx + 1) + '<small>/' + n + '</small>'; midT.textContent = title; midB.setAttribute('aria-label', 'Lesson ' + (idx + 1) + ' of ' + n + ': ' + title + (min ? ', ' + min : '') + '. Open the list of lessons.');
    prevB.disabled = dis; nextB.disabled = ndis; prevB.firstElementChild.nextElementSibling.textContent = idx === 0 ? 'Overview' : 'Back';
    $('span', nextB).textContent = label; nextB.classList.toggle('dk-last', lastLesson);
    prog.innerHTML = done.split('').map(function (c) { return '<i class="' + c + '"></i>'; }).join('');
  }

  var raf = 0;
  function queue() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; sync(); }); }

  /* top bar: away while reading down, back on the first upward scroll */
  var lastY = window.pageYOffset || 0, acc = 0, hid = false;
  function onScroll() {
    var y = window.pageYOffset || 0, d = y - lastY; lastY = y;
    if (!mq.matches) { if (hid) { root.classList.remove('tb-hide'); hid = false; } return; }
    if (y < 80) { acc = 0; if (hid) { root.classList.remove('tb-hide'); hid = false; } return; }
    if ((d > 0) !== (acc > 0)) acc = 0;
    acc += d;
    if (!hid && acc > 24) { root.classList.add('tb-hide'); hid = true; }
    else if (hid && acc < -12) { root.classList.remove('tb-hide'); hid = false; }
  }

  function init() {
    build(); sync();
    var main = $('main') || body;
    new MutationObserver(queue).observe(main, { attributes: true, attributeFilter: ['hidden', 'class', 'aria-current'], subtree: true, childList: true });
    window.addEventListener('hashchange', queue); window.addEventListener('resize', queue);
    if (mq.addEventListener) mq.addEventListener('change', queue); else if (mq.addListener) mq.addListener(queue);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('focusin', function (e) {
      if (e.target.matches && e.target.matches('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=button]),textarea')) root.classList.add('kb-open');
      if ($('.topbar') && $('.topbar').contains(e.target)) { root.classList.remove('tb-hide'); hid = false; }
    });
    document.addEventListener('focusout', function () { root.classList.remove('kb-open'); });
    /* opening the course menu always shows the top bar it hangs from */
    var mb = $('.menu-btn'); if (mb) mb.addEventListener('click', function () { root.classList.remove('tb-hide'); hid = false; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
