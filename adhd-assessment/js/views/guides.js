/* Pre-appointment forms guide and the differential diagnosis protocol.
   Routes: "forms" (every form, filtered by who completes it), "form-<id>" (how to read one form) and
   "ddxguide" (the step-by-step differential diagnosis protocol). See ARCHITECTURE.md, section 6.
   Also exports AA.components.ddxProtocol(opts), which the assessment's differential step reuses.
   Content comes from AA.data.formsGuide (5.10) and AA.data.ddxProtocol (5.11); this file only arranges it.
   Per-clinician state lives in AA.progress: 'formsFilter' (list filter) and 'sandbox.ddxProtocol.<checkId>'
   (practice ticks on the protocol page, never linked to a patient). */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui;

  /* Who completes the form, in display order. Unknown kinds fall back to "Other forms" (last entry). */
  var KINDS = [
    { id: 'self', label: 'Completed by the patient', short: 'Patient', note: 'Questionnaires the patient fills in about themselves.' },
    { id: 'informant', label: 'Completed by people who know the patient', short: 'Informants', note: 'Questionnaires for a parent, partner, sibling or close friend.' },
    { id: 'records', label: 'Records and reports', short: 'Records', note: 'Documents written at the time, such as school reports and earlier assessments.' },
    { id: 'history', label: 'History questionnaires', short: 'History', note: 'Background questionnaires that save time in the interview.' },
    { id: 'other', label: 'Other forms', short: 'Other', note: '' }
  ];

  /* ---------- Data helpers (never throw on missing or partial data) ---------- */

  function arr(x) { return Array.isArray(x) ? x.filter(function (v) { return v !== null && v !== undefined && v !== ''; }) : (x ? [x] : []); }
  function txt(x) { return typeof x === 'string' ? x.trim() : (typeof x === 'number' ? String(x) : ''); }
  /* Text that says something: '', '-' and similar placeholders count as empty. */
  function filled(x) { var s = txt(x); return s && !/^[-–—\s]+$/.test(s) ? s : ''; }
  function texts(x) { return arr(x).map(filled).filter(Boolean); }
  function norm(s) { return String(s || '').toLowerCase(); }
  function stripTags(s) { return String(s || '').replace(/<[^>]*>/g, ' '); }
  function li(t) { return h('li', null, t); }

  function guide() { var g = AA.data.formsGuide; return g && typeof g === 'object' ? g : {}; }
  function forms() { return arr(guide().forms).filter(function (f) { return f && typeof f === 'object' && txt(f.id); }); }
  function kindOf(f) {
    for (var i = 0; i < KINDS.length - 1; i++) if (KINDS[i].id === f.kind) return KINDS[i];
    return KINDS[KINDS.length - 1];
  }
  /* Forms in display order: grouped by kind, then in data order. Previous/next follows the same order. */
  function ordered() {
    var list = forms(), out = [];
    KINDS.forEach(function (k) { list.forEach(function (f) { if (kindOf(f) === k) out.push(f); }); });
    return out;
  }
  function formById(id) {
    var list = forms();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function formTitle(f) { return filled(f.title) || f.id; }
  function toolOf(f) { var id = f && txt(f.tool); return id ? AA.byId('tools', id) : null; }
  function scorable(t) { return !!(t && t.interactive !== false && t.items && t.items.length); }
  function toolLabel(t) { return t.abbr || t.name || t.id; }

  function copyLines(lines, what) {
    U.copyText(lines.join('\n')).then(function (ok) {
      U.toast(ok ? what + ' copied' : 'Copy failed. Your browser blocked the clipboard.', ok ? 'ok' : 'err');
    });
  }

  /* Move to an in-page section without touching the route (hash links would navigate). */
  function jumpTo(sec) {
    if (!sec) return;
    try { sec.scrollIntoView({ block: 'start' }); } catch (e) { sec.scrollIntoView(); }
    var hd = sec.querySelector('h2');
    if (hd) { try { hd.focus({ preventScroll: true }); } catch (e) { hd.focus(); } }
  }

  /* ======================================================================
     Route: forms (all pre-appointment forms)
     ====================================================================== */

  function readFilter() {
    var f = AA.progress.get('formsFilter', null) || {};
    return { q: typeof f.q === 'string' ? f.q : '', kind: typeof f.kind === 'string' ? f.kind : '' };
  }
  function saveFilter(f) { AA.progress.set('formsFilter', { q: f.q, kind: f.kind }); }

  function haystack(f) {
    var t = toolOf(f);
    return norm([f.id, f.title, stripTags(f.what), texts(f.recommendedBy).join(' '), f.who, f.whenSent, f.strength,
      kindOf(f).label, kindOf(f).short, t ? t.abbr + ' ' + t.name : ''].join(' '));
  }

  function formCard(f) {
    var t = toolOf(f);
    var title = formTitle(f);
    var hid = ui.nid('gd-f');
    var facts = [['Who', filled(f.who)], ['When', filled(f.whenSent)], ['Time', filled(f.time)]].filter(function (r) { return r[1]; });
    var recs = texts(f.recommendedBy);
    return h('article', { class: 'card gd-fcard', 'aria-labelledby': hid },
      h('h3', { id: hid, class: 'gd-fcard-title' }, title),
      facts.length ? h('dl', { class: 'gd-fkv' }, facts.map(function (r) { return [h('dt', null, r[0]), h('dd', null, r[1])]; })) : null,
      recs.length ? h('div', { class: 'gd-recs' }, h('span', { class: 'sr-only' }, 'Recommended by: '),
        recs.map(function (r) { return ui.badge(r, 'info'); })) : null,
      filled(f.strength) ? h('p', { class: 'gd-fstrength' }, h('span', { class: 'gd-k' }, 'Evidence '), filled(f.strength)) : null,
      h('div', { class: 'gd-fcard-foot' },
        ui.btn({ label: 'How to read it', kind: 'primary', small: true, go: 'form-' + f.id, aria: 'How to read it: ' + title }),
        t ? ui.btn({ label: 'Open the tool', kind: 'ghost', small: true, go: 'tool-' + t.id, aria: 'Open the tool: ' + toolLabel(t) }) : null));
  }

  function renderForms(el) {
    var root = h('div', { class: 'gd' });
    el.appendChild(root);
    var g = guide();
    var list = ordered();
    root.appendChild(ui.pageHead({
      eyebrow: 'Before the appointment', title: 'Pre-appointment forms',
      lead: 'The questionnaires, records and informant forms that guidelines recommend gathering before the assessment, and how to read each one: what it is, how to score it, what the result means and what to do next.',
      actions: [ui.btn({ label: 'Tools and scoring', kind: 'ghost', go: 'tools', icon: '▤' })]
    }));

    var intro = filled(g.intro) ? h('section', { class: 'card gd-intro', 'aria-label': 'About pre-appointment forms' }, ui.html(g.intro)) : null;
    var rules = texts(g.principles);
    var rulesCard = rules.length ? h('section', { class: 'card gd-rules-card', 'aria-labelledby': 'gd-rules-h' },
      h('h2', { id: 'gd-rules-h' }, 'Rules for reading any form'),
      h('ol', { class: 'gd-rules' }, rules.map(li))) : null;
    if (intro || rulesCard) root.appendChild(h('div', { class: 'gd-top' + (intro && rulesCard ? '' : ' gd-top-one') }, intro, rulesCard));

    if (!list.length) {
      root.appendChild(ui.empty('No forms in this build', 'The pre-appointment forms guide is not available yet. The tools library describes every questionnaire.',
        ui.btn({ label: 'Open the tools library', kind: 'primary', go: 'tools' })));
      return;
    }

    /* ---- Filters: one kind at a time, plus free-text search ---- */
    var f = readFilter();
    var present = KINDS.filter(function (k) { return list.some(function (x) { return kindOf(x) === k; }); });
    if (f.kind && !present.some(function (k) { return k.id === f.kind; })) f.kind = '';
    var chipBtns = [];
    function chip(id, label, n) {
      var b = h('button', { type: 'button', class: 'gd-chip', 'aria-pressed': 'false', onclick: function () { f.kind = id; apply(); saveFilter(f); } },
        h('span', null, label), h('span', { class: 'gd-chip-n' }, String(n), h('span', { class: 'sr-only' }, n === 1 ? ' form' : ' forms')));
      chipBtns.push({ id: id, el: b });
      return b;
    }
    var search = ui.search('Search forms by name, purpose or guideline', function (q) { f.q = q; apply(); saveFilter(f); }, f.q);
    var clearBtn = ui.btn({ label: 'Clear', kind: 'quiet', small: true, onClick: function () { f.q = ''; f.kind = ''; search.value = ''; apply(); saveFilter(f); search.focus(); } });
    root.appendChild(h('div', { class: 'card gd-filters', role: 'search', 'aria-label': 'Filter forms' },
      h('div', { class: 'gd-frow' }, search, clearBtn),
      h('div', { class: 'gd-chips', role: 'group', 'aria-label': 'Show forms completed by' },
        chip('', 'All forms', list.length),
        present.map(function (k) { return chip(k.id, k.short, list.filter(function (x) { return kindOf(x) === k; }).length); }))));

    /* ---- Groups: every card is built once; filtering only toggles `hidden` ---- */
    var countEl = h('p', { class: 'gd-count', role: 'status', 'aria-live': 'polite' });
    var sections = present.map(function (k) {
      var items = list.filter(function (x) { return kindOf(x) === k; }).map(function (x) { return { el: formCard(x), hay: haystack(x) }; });
      var nEl = h('span', { class: 'gd-group-n' });
      var hid = 'gd-g-' + k.id;
      var sec = h('section', { class: 'gd-group', 'aria-labelledby': hid },
        h('h2', { id: hid, class: 'gd-group-h' }, h('span', null, k.label), nEl),
        k.note ? h('p', { class: 'gd-group-note' }, k.note) : null,
        h('div', { class: 'grid gd-grid' }, items.map(function (x) { return x.el; })));
      return { k: k, el: sec, items: items, nEl: nEl };
    });
    var emptyEl = ui.empty('No forms match', 'Try another word or show all forms.',
      ui.btn({ label: 'Show all forms', kind: 'primary', onClick: function () { f.q = ''; f.kind = ''; search.value = ''; apply(); saveFilter(f); search.focus(); } }));
    root.appendChild(countEl);
    root.appendChild(h('div', { class: 'gd-results' }, sections.map(function (s) { return s.el; }), emptyEl));

    function apply() {
      var words = norm(f.q).split(/\s+/).filter(Boolean);
      var shown = 0;
      sections.forEach(function (s) {
        var on = !f.kind || f.kind === s.k.id;
        var n = 0;
        s.items.forEach(function (x) {
          var vis = on && words.every(function (w) { return x.hay.indexOf(w) > -1; });
          x.el.hidden = !vis;
          if (vis) n++;
        });
        s.el.hidden = !n;
        s.nEl.textContent = U.plural(n, 'form');
        shown += n;
      });
      emptyEl.hidden = shown > 0;
      chipBtns.forEach(function (c) { c.el.setAttribute('aria-pressed', c.id === f.kind ? 'true' : 'false'); });
      clearBtn.hidden = !(f.q || f.kind);
      countEl.textContent = f.q || f.kind ? 'Showing ' + shown + ' of ' + U.plural(list.length, 'form') : U.plural(list.length, 'form') + ' to send or gather before the appointment';
    }
    apply();
  }

  /* ======================================================================
     Route: form-<id> (how to read one form)
     ====================================================================== */

  function meaningTable(rows) {
    rows = arr(rows).filter(function (r) { return r && typeof r === 'object' && (filled(r.result) || filled(r.means) || filled(r.action)); });
    if (!rows.length) return h('p', { class: 'gd-none' }, 'This form has no score bands. Read it for patterns and concrete examples, using the steps above, and weigh it with the rest of the history.');
    return h('div', { class: 'table-wrap gd-mwrap' }, h('table', { class: 'table gd-mtable' },
      h('caption', { class: 'sr-only' }, 'What each result means and what to do'),
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Result'), h('th', { scope: 'col' }, 'What it means'), h('th', { scope: 'col' }, 'What to do'))),
      h('tbody', null, rows.map(function (r) {
        return h('tr', null,
          h('th', { scope: 'row' }, filled(r.result) || '-'),
          h('td', { 'data-label': 'What it means' }, filled(r.means) || '-'),
          h('td', { 'data-label': 'What to do', class: 'gd-act' }, filled(r.action) || '-'));
      }))));
  }

  function exampleBlock(ex) {
    if (typeof ex === 'string') ex = { html: ex };
    if (!ex || typeof ex !== 'object') return null;
    var html = filled(ex.html), take = filled(ex.takeaway);
    if (!html && !take) return null;
    return h('div', { class: 'gd-exwrap' },
      html ? h('div', { class: 'gd-example' }, h('p', { class: 'gd-example-k' }, 'Worked example'), ui.html(html)) : null,
      take ? ui.callout('ok', h('p', null, take), 'Takeaway') : null);
  }

  function renderForm(el, params) {
    var id = params[0];
    if (!id) return renderForms(el);
    var root = h('div', { class: 'gd' });
    el.appendChild(root);
    var f = formById(id);
    if (!f) {
      root.appendChild(ui.pageHead({ eyebrow: 'Pre-appointment forms', title: 'Form not found',
        lead: 'This form is not in the guide. It may have been renamed or removed.',
        actions: [ui.btn({ label: 'All forms', kind: 'primary', go: 'forms', icon: '←' })] }));
      return;
    }
    var k = kindOf(f), t = toolOf(f), can = scorable(t);
    var title = formTitle(f);
    var facts = [['Completed by', filled(f.who)], ['When to send it', filled(f.whenSent)], ['Time to complete', filled(f.time)]]
      .filter(function (r) { return r[1]; });
    var practise = can ? ui.btn({ label: 'Practise scoring this form', kind: 'primary', go: 'tool-' + t.id, icon: '✎' }) : null;
    root.appendChild(ui.pageHead({
      eyebrow: k.label, title: title,
      lead: facts.length ? h('dl', { class: 'gd-facts' }, facts.map(function (r) { return h('div', null, h('dt', null, r[0]), h('dd', null, r[1])); })) : null,
      actions: [ui.btn({ label: 'All forms', kind: 'ghost', go: 'forms', icon: '←' }), practise,
        t && !can ? ui.btn({ label: 'Open the tool', kind: 'ghost', go: 'tool-' + t.id }) : null].filter(Boolean)
    }));

    /* ---- Sections in reading order (empty ones are left out) ---- */
    var secs = [];
    function add(sid, stitle, body) { if (body) secs.push({ id: sid, title: stitle, body: body }); }
    var recs = texts(f.recommendedBy), pits = texts(f.pitfalls);
    add('what', 'What it is', filled(f.what) ? ui.html(f.what) : null);
    add('recs', 'Recommended by', recs.length ? h('ul', { class: 'gd-reclist' }, recs.map(li)) : null);
    add('read', 'How to read and score it', filled(f.howToRead) || can ? h('div', null,
      filled(f.howToRead) ? h('div', { class: 'gd-howto' }, ui.html(f.howToRead)) : null,
      can ? h('div', { class: 'gd-practise' },
        h('p', null, h('strong', null, 'Try it yourself. '), 'Fill in the practice form for ' + toolLabel(t) + ' and watch the score, bands and flags update. Practice answers are never linked to a patient.'),
        ui.btn({ label: 'Practise scoring this form', kind: 'primary', small: true, go: 'tool-' + t.id })) : null) : null);
    add('meaning', 'What the result means', meaningTable(f.meaning));
    add('example', 'Worked example', exampleBlock(f.example));
    add('pitfalls', 'Pitfalls', pits.length ? ui.callout('warn', ui.list(pits)) : null);
    add('feeds', 'How it feeds into the assessment', filled(f.feedsInto) ? h('p', { class: 'gd-feeds' }, filled(f.feedsInto)) : null);
    add('strength', 'Strength of evidence', filled(f.strength) ? h('p', { class: 'gd-strength' }, filled(f.strength)) : null);

    if (!secs.length) {
      root.appendChild(ui.empty('No guidance yet', 'The reading guide for this form has not been written yet.', ui.btn({ label: 'All forms', kind: 'primary', go: 'forms' })));
      return;
    }

    var tocBtns = {};
    secs.forEach(function (s, i) {
      var hid = 'gd-s-' + s.id;
      s.node = h('section', { class: 'gd-sec', id: 'gd-sec-' + s.id, 'aria-labelledby': hid },
        h('h2', { id: hid, tabindex: '-1' }, h('span', { class: 'gd-sec-n', 'aria-hidden': 'true' }, String(i + 1)), h('span', null, s.title)),
        s.body);
    });
    var toc = secs.length > 2 ? h('nav', { class: 'gd-toc', 'aria-label': 'On this page' },
      h('p', { class: 'gd-toc-k' }, 'On this page'),
      h('ol', null, secs.map(function (s, i) {
        var b = h('button', { type: 'button', class: 'gd-toc-btn', onclick: function () { jumpTo(s.node); } },
          h('span', { class: 'gd-toc-n', 'aria-hidden': 'true' }, String(i + 1)), h('span', null, s.title));
        tocBtns[s.id] = b;
        return h('li', null, b);
      }))) : null;
    root.appendChild(h('div', { class: 'gd-doc' + (toc ? '' : ' gd-doc-notoc') }, toc,
      h('div', { class: 'gd-main' }, secs.map(function (s) { return s.node; }))));

    /* ---- Previous / next form ---- */
    var all = ordered(), idx = all.indexOf(f);
    var prev = idx > 0 ? all[idx - 1] : null, next = idx > -1 && idx < all.length - 1 ? all[idx + 1] : null;
    function pnBtn(x, label, cls) {
      return h('button', { type: 'button', class: 'btn btn-ghost gd-pn-btn ' + cls, 'data-go': 'form-' + x.id },
        h('span', { class: 'gd-pn-k' }, label), h('span', { class: 'gd-pn-t' }, formTitle(x)));
    }
    if (prev || next) {
      root.appendChild(h('nav', { class: 'step-nav gd-pn', 'aria-label': 'Other forms' },
        prev ? pnBtn(prev, '← Previous form', 'gd-prev') : h('span'),
        next ? pnBtn(next, 'Next form →', 'gd-next') : h('span')));
    }

    /* ---- Highlight the section in view in the contents list ---- */
    var spy = null;
    if (toc && typeof window.IntersectionObserver === 'function') {
      var seen = {};
      try {
        spy = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
          var cur = secs.filter(function (s) { return seen[s.node.id]; })[0];
          if (!cur) return;
          Object.keys(tocBtns).forEach(function (k2) { tocBtns[k2].setAttribute('aria-current', k2 === cur.id ? 'true' : 'false'); });
        }, { rootMargin: '-72px 0px -55% 0px' });
        secs.forEach(function (s) { spy.observe(s.node); });
      } catch (e) { spy = null; }
    }
    return function () { if (spy) spy.disconnect(); };
  }

  /* ======================================================================
     Component: AA.components.ddxProtocol(opts)
     opts: {checked: {<checkId>: true}, onCheck(checkId, bool), compact: bool, actions: [nodes]}
     The caller persists ticks in onCheck; the component keeps its own copy for the counts.
     Returns the element, with el.setChecked(obj) to re-sync (for example after a reset) and
     el.counts() -> {steps, stepsDone, checks, ticked}.
     ====================================================================== */

  function protocol() { var p = AA.data.ddxProtocol; return p && typeof p === 'object' ? p : {}; }

  function normStep(s, i) {
    var id = txt(s.id) || 'p' + (i + 1);
    return {
      id: id, n: typeof s.n === 'number' ? s.n : i + 1, title: filled(s.title) || 'Step ' + (i + 1), goal: filled(s.goal),
      doList: texts(s['do']), ask: texts(s.ask), tools: texts(s.tools), conds: texts(s.conds), decide: texts(s.decide), redFlags: texts(s.redFlags),
      checks: arr(s.checks).map(function (c, j) {
        if (typeof c === 'string') c = { t: c };
        if (!c || typeof c !== 'object' || !filled(c.t)) return null;
        return { id: txt(c.id) || id + '_c' + (j + 1), t: filled(c.t) };
      }).filter(Boolean)
    };
  }

  function toolChips(ids) {
    return h('ul', { class: 'chip-list gd-links' }, ids.map(function (id) {
      var t = AA.byId('tools', id);
      if (!t) return h('li', null, h('span', { class: 'chip' }, id));
      return h('li', null, h('a', { class: 'chip gd-link', href: '#tool-' + id, 'data-go': 'tool-' + id, title: t.name || null }, toolLabel(t)));
    }));
  }
  function condChips(ids) {
    return h('ul', { class: 'chip-list gd-links' }, ids.map(function (id) {
      var c = AA.byId('ddx', id);
      return h('li', null, h('a', { class: 'chip gd-link', href: '#cond-' + id, 'data-go': 'cond-' + id }, (c && c.name) || id));
    }));
  }
  function blk(title, node, extra, cls) {
    if (!node) return null;
    return h('div', { class: 'gd-blk' + (cls ? ' ' + cls : '') },
      h('div', { class: 'gd-blk-top' }, h('h3', { class: 'gd-blk-h' }, title), extra || null), node);
  }

  AA.components.ddxProtocol = function (opts) {
    opts = opts || {};
    var onCheck = typeof opts.onCheck === 'function' ? opts.onCheck : function () {};
    var state = {};
    function setState(obj) {
      state = {};
      if (obj && typeof obj === 'object') Object.keys(obj).forEach(function (k) { if (obj[k]) state[k] = true; });
    }
    setState(opts.checked);

    var root = h('div', { class: 'gd-proto' + (opts.compact ? ' gd-compact' : '') });
    var steps = arr(protocol().steps).filter(function (s) { return s && typeof s === 'object'; }).map(normStep);
    root.setChecked = function () {};
    root.counts = function () { return { steps: 0, stepsDone: 0, checks: 0, ticked: 0 }; };
    if (!steps.length) {
      root.appendChild(ui.empty('The protocol is not available', 'No protocol steps are loaded in this build.'));
      return root;
    }

    /* ---- Overall progress ---- */
    var status = h('p', { class: 'gd-pstatus', role: 'status', 'aria-live': 'polite' });
    var checksEl = h('p', { class: 'gd-pchecks' });
    var meter = ui.progress(0, 1, 'Protocol checks ticked');
    var toggleAll = ui.btn({ label: 'Open all steps', kind: 'quiet', small: true, onClick: function () {
      var open = !items.every(function (x) { return x.d.open; });
      items.forEach(function (x) { x.d.open = open; });
      syncToggle();
    } });
    root.appendChild(h('div', { class: 'gd-phead' },
      h('div', { class: 'gd-phead-text' }, status, checksEl, meter),
      h('div', { class: 'gd-phead-actions' }, toggleAll, arr(opts.actions))));

    /* ---- Steps ---- */
    var list = h('ol', { class: 'gd-steps', 'aria-label': 'Protocol steps' });
    var items = steps.map(function (s, i) {
      var x = { s: s, inputs: {} };
      x.marker = h('span', { class: 'gd-mark', 'aria-hidden': 'true' }, String(s.n));
      x.countEl = h('span', { class: 'gd-scount' });
      x.doneBadge = ui.badge('Done', 'ok');
      var head = h('span', { class: 'gd-shead' }, x.marker,
        h('span', { class: 'gd-sn' }, 'Step ' + s.n + ' of ' + steps.length),
        h('span', { class: 'gd-stitle' }, s.title),
        s.goal ? h('span', { class: 'gd-sgoal' }, s.goal) : null);
      var meta = h('span', { class: 'gd-smeta' }, x.countEl, x.doneBadge);

      var colA = [
        blk('Do this', s.doList.length ? h('ol', { class: 'gd-dolist' }, s.doList.map(li)) : null),
        blk('Questions to ask', s.ask.length ? h('ul', { class: 'gd-asklist' }, s.ask.map(li)) : null,
          s.ask.length ? ui.btn({ label: 'Copy all', kind: 'quiet', small: true, icon: '⧉', aria: 'Copy all questions for step ' + s.n, onClick: function () { copyLines(s.ask, 'Questions'); } }) : null)
      ].filter(Boolean);
      var colB = [
        blk('Tools to use', s.tools.length ? toolChips(s.tools) : null),
        blk('Conditions this step covers', s.conds.length ? condChips(s.conds) : null),
        blk('Decision rules', s.decide.length ? h('ul', { class: 'list gd-decide' }, s.decide.map(li)) : null),
        s.redFlags.length ? h('div', { class: 'gd-blk' }, ui.callout('warn', ui.list(s.redFlags), 'Red flags')) : null
      ].filter(Boolean);

      var next = steps[i + 1];
      var checks = s.checks.length ? h('div', { class: 'gd-checks' },
        h('h3', { class: 'gd-blk-h' }, 'Before you move on, confirm'),
        s.checks.map(function (c) {
          var row = ui.check({ label: c.t, checked: !!state[c.id], onChange: function (v) {
            if (v) state[c.id] = true; else delete state[c.id];
            try { onCheck(c.id, !!v); } catch (e) { if (window.console) console.error(e); }
            update();
          } });
          x.inputs[c.id] = row.querySelector('input');
          return row;
        })) : null;
      var foot = next ? h('div', { class: 'gd-sfoot' }, ui.btn({ label: 'Next: step ' + next.n + ' →', kind: 'ghost', small: true,
        aria: 'Next: step ' + next.n + ', ' + next.title, onClick: function () { openStep(i + 1, true); } })) : null;

      var body = h('div', { class: 'gd-sbody' },
        colA.length || colB.length ? h('div', { class: 'gd-sgrid' },
          colA.length ? h('div', { class: 'gd-col' }, colA) : null,
          colB.length ? h('div', { class: 'gd-col' }, colB) : null) : null,
        checks, foot);
      x.d = ui.details(head, body, { cls: 'gd-step-d', meta: meta, onToggle: syncToggle });
      x.li = h('li', { class: 'gd-step' }, x.d);
      list.appendChild(x.li);
      return x;
    });
    root.appendChild(list);

    function openStep(i, focus) {
      var x = items[i];
      if (!x) return;
      items.forEach(function (y, j) { if (j === i - 1) y.d.open = false; });
      x.d.open = true;
      syncToggle();
      if (focus) {
        try { x.li.scrollIntoView({ block: 'start' }); } catch (e) { x.li.scrollIntoView(); }
        var sm = x.d.querySelector('summary');
        if (sm) { try { sm.focus({ preventScroll: true }); } catch (e) { sm.focus(); } }
      }
    }
    function syncToggle() {
      if (!items) return;
      var all = items.every(function (x) { return x.d.open; });
      toggleAll.lastChild.textContent = all ? 'Close all steps' : 'Open all steps';
    }
    function counts() {
      var c = { steps: 0, stepsDone: 0, checks: 0, ticked: 0 };
      items.forEach(function (x) {
        var n = x.s.checks.length, k = x.s.checks.filter(function (ch) { return state[ch.id]; }).length;
        c.checks += n; c.ticked += k;
        if (n) { c.steps++; if (k === n) c.stepsDone++; }
      });
      return c;
    }
    function update() {
      var cur = null;
      items.forEach(function (x) {
        var n = x.s.checks.length, k = x.s.checks.filter(function (ch) { return state[ch.id]; }).length;
        var done = n > 0 && k === n;
        x.li.classList.toggle('gd-done', done);
        x.doneBadge.hidden = !done;
        x.marker.textContent = done ? '✓' : String(x.s.n);
        U.clear(x.countEl);
        x.countEl.hidden = !n || done;
        if (n) U.append(x.countEl, [h('span', { 'aria-hidden': 'true' }, k + '/' + n), h('span', { class: 'sr-only' }, k + ' of ' + n + ' checks ticked')]);
        if (!cur && !done) cur = x;
      });
      items.forEach(function (x) { x.li.classList.toggle('gd-current', x === cur); });
      var c = counts();
      status.textContent = c.stepsDone + ' of ' + U.plural(c.steps, 'step') + ' complete';
      checksEl.textContent = c.ticked + ' of ' + U.plural(c.checks, 'check') + ' ticked' + (c.steps && c.stepsDone === c.steps ? ' · every step complete' : '');
      var pct = c.checks ? Math.round(100 * c.ticked / c.checks) : 0;
      meter.setAttribute('aria-valuenow', String(pct));
      if (meter.firstChild) meter.firstChild.style.width = pct + '%';
    }

    root.setChecked = function (obj) {
      setState(obj);
      items.forEach(function (x) { Object.keys(x.inputs).forEach(function (cid) { x.inputs[cid].checked = !!state[cid]; }); });
      update();
    };
    root.counts = counts;

    update();
    /* Open the first step that still has unticked checks (or the first step). */
    var first = items.filter(function (x) { return !x.li.classList.contains('gd-done'); })[0] || items[0];
    first.d.open = true;
    syncToggle();
    return root;
  };

  /* ======================================================================
     Route: ddxguide (differential diagnosis protocol)
     ====================================================================== */

  var SANDBOX = 'sandbox.ddxProtocol';

  function renderGuide(el) {
    var root = h('div', { class: 'gd' });
    el.appendChild(root);
    var P = protocol();
    var last = AA.shell && AA.shell.lastAssessment ? AA.shell.lastAssessment() : null;
    var ref = last && last.patient && last.patient.ref ? last.patient.ref : 'the current patient';
    var useBtn = last ? ui.btn({ label: 'Use with an assessment', kind: 'primary', go: 'assess-' + last.id + '-ddx', title: 'Open the differential diagnosis step for ' + ref }) : null;
    root.appendChild(ui.pageHead({
      eyebrow: 'Step-by-step method', title: 'Differential diagnosis protocol',
      lead: 'Follow these steps in order so that no alternative explanation is missed. The method makes the assessment more reliable, but the conclusion is still a clinical judgement.',
      actions: [useBtn, ui.btn({ label: 'Conditions A to Z', kind: 'ghost', go: 'ddx' })].filter(Boolean)
    }));

    if (!arr(P.steps).length) {
      root.appendChild(ui.empty('The protocol is not available', 'The differential diagnosis protocol is not loaded in this build. The differential diagnosis reference lists every condition to consider.',
        ui.btn({ label: 'Open the differential diagnosis reference', kind: 'primary', go: 'ddx' })));
      return;
    }

    var intro = filled(P.intro) ? h('section', { class: 'card gd-intro', 'aria-label': 'About the protocol' }, ui.html(P.intro)) : null;
    var rules = texts(P.principles);
    var rulesCard = rules.length ? h('section', { class: 'card gd-rules-card', 'aria-labelledby': 'gd-pr-h' },
      h('h2', { id: 'gd-pr-h' }, 'Principles'), h('ol', { class: 'gd-rules' }, rules.map(li))) : null;
    if (intro || rulesCard) root.appendChild(h('div', { class: 'gd-top' + (intro && rulesCard ? '' : ' gd-top-one') }, intro, rulesCard));

    /* ---- The protocol (practice ticks in the clinician's profile) ---- */
    var saved = AA.progress.get(SANDBOX, {});
    var proto = null;
    var resetBtn = ui.btn({ label: 'Reset ticks', kind: 'quiet', small: true, icon: '↺', onClick: function () {
      U.confirm({ title: 'Clear all ticks?', body: 'Every tick on this practice copy of the protocol will be cleared. Assessments are not affected.', ok: 'Clear ticks', danger: true })
        .then(function (yes) {
          if (!yes) return;
          AA.progress.set(SANDBOX, undefined);
          if (proto) proto.setChecked({});
          U.toast('Ticks cleared', 'ok');
        });
    } });
    proto = AA.components.ddxProtocol({
      checked: saved && typeof saved === 'object' ? saved : {},
      onCheck: function (cid, v) { AA.progress.set(SANDBOX + '.' + cid, v || undefined); },
      actions: [resetBtn]
    });
    root.appendChild(h('section', { class: 'section gd-psec', 'aria-labelledby': 'gd-steps-h' },
      h('h2', { id: 'gd-steps-h' }, 'The protocol, step by step'),
      h('p', { class: 'gd-pnote' }, 'Open each step, do what it says, then tick the checks. Ticks here are saved in your profile only and are not linked to any patient. ',
        last ? h('span', null, 'To record the protocol for ' + ref + ', use the differential diagnosis step of the assessment.') :
          h('span', null, 'To record it for a patient, use the differential diagnosis step of an assessment.')),
      proto));

    /* ---- After the last step ---- */
    var fin = P.final && typeof P.final === 'object' ? P.final : {};
    var verdict = texts(fin.rules), docs = texts(fin.documentation);
    if (verdict.length || docs.length) {
      root.appendChild(h('section', { class: 'section gd-final', 'aria-labelledby': 'gd-final-h' },
        h('h2', { id: 'gd-final-h' }, 'After the last step'),
        h('div', { class: 'grid-2' },
          verdict.length ? h('section', { class: 'card gd-fincard', 'aria-labelledby': 'gd-fin-r' },
            h('h3', { id: 'gd-fin-r' }, 'Reaching a verdict for each condition'),
            h('ol', { class: 'gd-rules' }, verdict.map(li))) : null,
          docs.length ? h('section', { class: 'card gd-fincard', 'aria-labelledby': 'gd-fin-d' },
            h('div', { class: 'gd-blk-top' }, h('h3', { id: 'gd-fin-d' }, 'What to document'),
              ui.btn({ label: 'Copy', kind: 'quiet', small: true, icon: '⧉', aria: 'Copy what to document', onClick: function () { copyLines(docs.map(function (d) { return '- ' + d; }), 'Checklist'); } })),
            ui.list(docs, 'list gd-doclist')) : null)));
    }
    var refs = texts(P.refs);
    if (refs.length) root.appendChild(ui.source(refs.join('; ')));
    if (useBtn) {
      root.appendChild(h('div', { class: 'gd-endbar' },
        h('p', null, 'Ready to apply this to ' + ref + '?'),
        ui.btn({ label: 'Use with an assessment', kind: 'primary', go: 'assess-' + last.id + '-ddx' })));
    }
  }

  /* ======================================================================
     Routes
     ====================================================================== */

  AA.router.register('forms', { title: 'Pre-appointment forms', render: function (el) { renderForms(el); } });
  AA.router.register('form', {
    title: function (p) { var f = p && p[0] ? formById(p[0]) : null; return f ? formTitle(f) : 'Pre-appointment forms'; },
    render: function (el, params) { return renderForm(el, params); }
  });
  AA.router.register('ddxguide', { title: 'Differential diagnosis protocol', render: function (el) { renderGuide(el); } });
})(window.AA);
