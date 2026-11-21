/* DIVA 2.0 interview for adults (18 and over, or no age recorded). AA.divaUI, CSS prefix dv- (css/v-diva.css).
   The interview steps delegate to this file for adults: ia (DIVA part 1), hi (part 2) and onset (part 3); the summary
   step shows the DIVA score form, how the score is worked out, and the download of the filled official form.
   Young people (6-17) keep the interview in assess-interview.js.

   Wording. DIVA's own questions and examples come only from the clinician's copy of the DIVA 2.0 PDF, read on this
   device (AA.divaSource, js/components/diva-kit.js). Without a copy the screens use the portal's own questions and
   examples, which are original. The portal's examples always stay available under "More examples".

   Routes (sub tokens): assess-<id>-ia (part 1 overview), -ia-ia3 (one item), -ia-sup (supplement question); the same
   for hi; assess-<id>-onset (part 3 overview), -onset-b (criterion B), -onset-work | relationships | social | leisure |
   selfimage (criterion C, one area of life), -onset-two (two or more areas), -onset-sum (summary of symptoms).

   Record keys (ARCHITECTURE.md section 4): symptoms.<id>.adult|child, divaA|divaC (DIVA example ticks by index),
   exA|exC (portal examples, keys "<ctx>.<i>"), otherA|otherC, infA|infC, notes; supplement.<ia|hi><Adult|Child>;
   onset.always|ageOnset|before12|duration6m; impairment.<adult|child>.<domain>.sev|diva|ex|other;
   diva.twoAreas.<adult|child>, diva.details, diva.score.{B, E, eBy, dx}, diva.src; collateral.* (score form). */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui, D = AA.diagnosis, V = AA.diva;
  var DV = AA.divaUI = {};

  var PERIODS = ['adult', 'child'];
  var PL = { adult: { k: 'A', name: 'Adulthood', when: 'the last 6 months', short: 'Adult' }, child: { k: 'C', name: 'Childhood', when: 'age 5 to 12', short: 'Child' } };
  var PART = { IA: { n: 1, step: 'ia', name: 'Attention deficit', range: 'A1 to A9', key: 'ia' }, HI: { n: 2, step: 'hi', name: 'Hyperactivity-impulsivity', range: 'H/I 1 to H/I 9', key: 'hi' } };
  var AREA_LABEL = { work: 'Work and education', relationships: 'Relationships and family', social: 'Social contacts', leisure: 'Free time and hobbies', selfimage: 'Self-confidence and self-image',
    daily: 'Daily life, money and admin', safety: 'Driving, health and safety' };
  /* Two more areas the portal rates (not on the DIVA form): optional for adults. */
  var EXTRA_AREAS = ['daily', 'safety'];
  var SEV = [{ v: 0, l: 'None' }, { v: 1, l: 'Mild' }, { v: 2, l: 'Moderate' }, { v: 3, l: 'Severe' }];
  var INF = [{ v: 'na', l: 'n/a', title: 'Nobody has commented' }, { v: 0, l: '0', title: 'None or little support' }, { v: 1, l: '1', title: 'Some support' }, { v: 2, l: '2', title: 'Clear support' }];
  var focusNext = false;

  function arr(x) { return Array.isArray(x) ? x : []; }
  function obj(x) { return x && typeof x === 'object' ? x : {}; }
  function str(x) { return x === undefined || x === null ? '' : String(x).trim(); }
  function nil(v) { return v === null ? undefined : v; }
  function size(o) { return Object.keys(obj(o)).filter(function (k) { return o[k]; }).length; }
  function src() { return AA.divaSource ? AA.divaSource.content() : null; }
  function symData(id) { return AA.byId('symptoms', id) || {}; }
  function itemsOf(dim) { return V.ITEMS.filter(function (it) { return it.dim === dim; }); }
  function band(a) { try { return D.band(a); } catch (e) { return 'adult'; } }

  DV.applies = function (a) { return !!(V && band(a) === 'adult'); };

  /* Frame hooks: DIVA titles for the three interview steps (adults only). */
  DV.title = function (meta, a) {
    if (!DV.applies(a)) return null;
    return { ia: 'DIVA part 1: attention deficit', hi: 'DIVA part 2: hyperactivity-impulsivity', onset: 'DIVA part 3: onset and impairment' }[meta.id] || null;
  };
  DV.lead = function (meta, a) {
    if (!DV.applies(a)) return null;
    return { ia: 'Nine questions (A1 to A9). For each one ask about adulthood (the last 6 months), then childhood (age 5 to 12).',
      hi: 'Nine questions (H/I 1 to 9), adulthood then childhood, then the supplement question.',
      onset: 'Criterion B (have the symptoms always been there?), criterion C (problems in five areas of life) and the summary of symptoms.' }[meta.id] || null;
  };

  /* ---------- small shared pieces ---------- */
  function toggleKey(ctx, path, key, on) {
    var cur = Object.assign({}, obj(ctx.get(path, {})));
    if (on) cur[key] = true; else delete cur[key];
    ctx.set(path, Object.keys(cur).length ? cur : undefined);
  }
  function arrowsTaken(t) {
    if (!t || !t.closest) return false;
    if (t.closest('textarea, select, [contenteditable=""], [contenteditable="true"], [role="tab"], .dialog')) return true;
    if (t.tagName === 'INPUT') return !/^(checkbox|button|submit|reset)$/i.test(t.type || '');
    return false;
  }
  function keyNav(fn) {
    var onKey = function (e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (arrowsTaken(e.target) || document.querySelector('.dialog-backdrop')) return;
      e.preventDefault();
      fn(e.key === 'ArrowRight' ? 1 : -1);
    };
    document.addEventListener('keydown', onKey);
    return function () { document.removeEventListener('keydown', onKey); };
  }
  /* Scroll the new screen into view and, after moving between items, focus its heading. */
  function settle(root, title) {
    var moveFocus = focusNext;
    focusNext = false;
    setTimeout(function () {
      if (!root.isConnected) return;
      if (moveFocus && root.scrollIntoView) root.scrollIntoView({ block: 'start' });
      if (moveFocus && title) { try { title.focus({ preventScroll: true }); } catch (e) { title.focus(); } }
    }, 0);
  }
  function go(ctx, step, sub) { focusNext = true; ctx.go(step, sub); }

  /* Yes / No (and "not sure yet") as big buttons. value 'yes'|'no'|'unsure'|null. */
  function decide(label, value, onChange, o) {
    o = o || {};
    var wrap = h('div', { class: 'dv-decide', role: 'group', 'aria-label': label });
    var opts = [['yes', o.yes || 'Yes'], ['no', o.no || 'No']];
    var btns = opts.map(function (x) {
      return h('button', { type: 'button', class: 'dv-dbtn dv-dbtn-' + x[0], 'data-v': x[0], onclick: function () { set(value === x[0] ? null : x[0]); } },
        h('span', { class: 'dv-dmark', 'aria-hidden': 'true' }), x[1]);
    });
    var unsure = o.noUnsure ? null : h('button', { type: 'button', class: 'dv-dunsure', 'data-v': 'unsure', onclick: function () { set(value === 'unsure' ? null : 'unsure'); } }, 'Not sure yet');
    U.append(wrap, [h('div', { class: 'dv-dpair' }, btns), unsure]);
    function paint(v) {
      value = v;
      btns.concat(unsure ? [unsure] : []).forEach(function (b) { var on = b.getAttribute('data-v') === v; b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.classList.toggle('is-on', on); });
      wrap.setAttribute('data-v', v || '');
    }
    function set(v) { paint(v); onChange(v); }
    paint(value || null);
    wrap.paint = paint;
    return wrap;
  }
  function suggestion(text, kind) { return h('p', { class: 'dv-suggest dv-suggest-' + (kind || 'neutral') }, h('span', { class: 'dv-suggest-k' }, 'Suggested'), text); }

  /* ---------- the clinician's DIVA copy ---------- */
  function loadCopy(after) {
    if (!AA.divaSource) { U.toast('The PDF tools are not part of this build.', 'err'); return; }
    AA.divaSource.pick().then(function (file) {
      if (!file) return null;
      U.toast('Reading your DIVA copy…');
      return AA.divaSource.importFile(file).then(function (res) {
        if (res.ok) {
          U.toast(res.content.edition === 'diva2-en' ? 'DIVA 2.0 loaded. DIVA\'s own wording is on.' : 'DIVA loaded. Its layout differs from the tested English DIVA 2.0: check the filled form carefully.', res.content.edition === 'diva2-en' ? 'ok' : 'warn');
          if (after) after(res.content);
          AA.router.refresh();
        } else {
          U.confirm({ title: 'This file could not be used', ok: 'OK', cancel: 'Close',
            body: h('div', null, h('p', null, 'It does not look like the English DIVA 2.0 form. The interview keeps the portal\'s own wording.'), ui.list(res.problems || [])) });
        }
      });
    }).catch(function (e) { U.toast(e && e.message ? e.message : 'The file could not be read.', 'err'); });
  }
  DV.loadCopy = loadCopy;

  /* Status card: which wording is in use, with the load or change button. compact: one line. */
  function sourceCard(ctx, compact) {
    var C = src();
    var a = ctx.a() || {};
    var mismatch = C && obj(a.diva).src && a.diva.src.hash && a.diva.src.hash !== C.hash;
    if (C && compact && !mismatch) return null;
    if (C) {
      var meta = C.meta || {};
      return h('section', { class: 'dv-src dv-src-on' + (compact ? ' is-compact' : '') },
        h('span', { class: 'dv-src-ico', 'aria-hidden': 'true' }, '✓'),
        h('div', { class: 'dv-src-text' },
          h('p', { class: 'dv-src-t' }, 'DIVA 2.0 wording from your own copy'),
          h('p', { class: 'dv-src-d' }, (meta.file ? meta.file + ' · ' : '') + 'kept on this device only.' + (C.edition !== 'diva2-en' ? ' Layout differs from the tested English edition: check the filled form.' : '')),
          mismatch ? h('p', { class: 'dv-src-warn' }, 'The DIVA example ticks in this record were made with a different DIVA copy. The ticks may point to different examples: check them before you fill in the form.') : null),
        compact ? null : h('div', { class: 'dv-src-act' }, ui.btn({ label: 'Change', kind: 'quiet', small: true, onClick: function () { loadCopy(); } })));
    }
    return h('section', { class: 'dv-src dv-src-off' + (compact ? ' is-compact' : '') },
      h('span', { class: 'dv-src-ico', 'aria-hidden': 'true' }, 'PDF'),
      h('div', { class: 'dv-src-text' },
        h('p', { class: 'dv-src-t' }, 'Use DIVA\'s exact questions and examples'),
        h('p', { class: 'dv-src-d' }, 'DIVA is © DIVA Foundation, so the portal does not include its wording. Load your own DIVA 2.0 PDF once. It stays on this device. The questions and examples then appear word for word, and at the end the portal fills in your copy of the official form.'),
        compact ? null : ui.details('Where do I get it, and what happens to the file?', ui.list([
          'Use the DIVA 2.0 (English) PDF you already hold: from the DIVA Foundation (divacenter.eu) or from your service. The current DIVA Foundation version is DIVA-5, which this portal does not read yet.',
          'The file is read in this browser. Nothing is uploaded. It is kept in this browser\'s storage so the form can be filled in later; you can remove it at any time.',
          'Until you load it, the interview uses the portal\'s own questions and examples (original wording, same structure).',
          'For commercial or service-wide digital use of the DIVA, check the DIVA Foundation\'s terms.'
        ]), { cls: 'dv-src-more' })),
      h('div', { class: 'dv-src-act' }, ui.btn({ label: [h('span', { class: 'dv-l-long' }, 'Load my DIVA 2.0 PDF'), h('span', { class: 'dv-l-short' }, 'Load PDF')],
        aria: 'Load my DIVA 2.0 PDF', kind: 'primary', small: !!compact, onClick: function () { loadCopy(); } })));
  }
  DV.sourceCard = sourceCard;

  /* Remember which DIVA copy the example ticks belong to (the first time one is made). */
  function stampSource(ctx) {
    var C = src(), a = ctx.a() || {};
    if (C && !(obj(a.diva).src && a.diva.src.hash)) ctx.set('diva.src', { sig: C.sig, hash: C.hash, edition: C.edition });
  }

  /* ---------- live tally: nine dots per life stage, the DIVA line at 6 ---------- */
  function tally(dim, compact) {
    var host = h('div', { class: 'dv-tally' + (compact ? ' is-compact' : ''), 'aria-live': 'polite' });
    var rows = {};
    PERIODS.forEach(function (per) {
      var dots = h('span', { class: 'dv-dots', 'aria-hidden': 'true' });
      for (var i = 0; i < 9; i++) dots.appendChild(h('span', { class: 'dv-dot' + (i === 5 ? ' is-line' : '') }));
      var n = h('strong', { class: 'dv-tn' }), badge = h('span', { class: 'dv-tbadge' });
      rows[per] = { dots: dots, n: n, badge: badge };
      host.appendChild(h('div', { class: 'dv-trow' }, h('span', { class: 'dv-tl' }, PL[per].name), dots, h('span', { class: 'dv-tcount' }, n, h('span', { class: 'dv-tof' }, ' / 9')), badge));
    });
    host.appendChild(h('p', { class: 'dv-thint' }, 'DIVA 2.0 counts a group as met at 6 of 9. DSM-5-TR needs 5 in adults (age 17 and over).'));
    host.paint = function (a) {
      PERIODS.forEach(function (per) {
        var states = itemsOf(dim).map(function (it) { return obj(obj(a.symptoms)[it.id])[per] || null; });
        var yes = states.filter(function (v) { return v === 'yes'; }).length;
        var order = states.slice().sort(function (x, y) { var r = { yes: 0, unsure: 1, no: 2 }; return (x in r ? r[x] : 3) - (y in r ? r[y] : 3); });
        U.$$('.dv-dot', rows[per].dots).forEach(function (d, i) { d.setAttribute('data-s', order[i] || 'open'); });
        rows[per].n.textContent = String(yes);
        var met = yes >= V.THRESHOLD, open = states.filter(function (v) { return v !== 'yes' && v !== 'no'; }).length;
        rows[per].badge.textContent = met ? 'Met' : open ? open + ' open' : 'Not met';
        rows[per].badge.className = 'dv-tbadge ' + (met ? 'is-met' : open ? 'is-open' : 'is-no');
      });
    };
    return host;
  }

  /* Item pips: A1..A9 (or H/I 1..9) and S, each with an adult and a child half. */
  function pips(ctx, dim, cur) {
    var list = itemsOf(dim);
    var nav = h('nav', { class: 'dv-pips', 'aria-label': 'DIVA part ' + PART[dim].n + ' questions' });
    var btns = list.map(function (it) {
      var s = symData(it.id);
      return h('button', { type: 'button', class: 'dv-pip', 'aria-current': cur === it.id ? 'step' : null, title: it.label + ': ' + (s.title || ''),
        onclick: function () { if (cur !== it.id) go(ctx, PART[dim].step, it.id); } },
        h('span', { class: 'dv-pip-c' }, it.label.replace('H/I ', 'H/I ')),
        h('span', { class: 'dv-pip-bars', 'aria-hidden': 'true' }, h('span', { class: 'dv-pip-a' }), h('span', { class: 'dv-pip-b' })),
        h('span', { class: 'sr-only dv-pip-sr' }));
    });
    var supBtn = h('button', { type: 'button', class: 'dv-pip dv-pip-s', 'aria-current': cur === 'sup' ? 'step' : null, title: 'Supplement question',
      onclick: function () { if (cur !== 'sup') go(ctx, PART[dim].step, 'sup'); } },
      h('span', { class: 'dv-pip-c' }, 'S'), h('span', { class: 'dv-pip-bars', 'aria-hidden': 'true' }, h('span', { class: 'dv-pip-a' }), h('span', { class: 'dv-pip-b' })), h('span', { class: 'sr-only dv-pip-sr' }));
    U.append(nav, [h('ol', null, btns.concat([supBtn]).map(function (b) { return h('li', null, b); }))]);
    nav.paint = function (a) {
      list.forEach(function (it, i) {
        var r = obj(obj(a.symptoms)[it.id]);
        var b = btns[i];
        b.querySelector('.dv-pip-a').setAttribute('data-s', r.adult || 'open');
        b.querySelector('.dv-pip-b').setAttribute('data-s', r.child || 'open');
        b.querySelector('.dv-pip-sr').textContent = ', adulthood ' + (r.adult || 'not answered') + ', childhood ' + (r.child || 'not answered');
      });
      var sup = obj(a.supplement), k = PART[dim].key;
      supBtn.querySelector('.dv-pip-a').setAttribute('data-s', sup[k + 'Adult'] || 'open');
      supBtn.querySelector('.dv-pip-b').setAttribute('data-s', sup[k + 'Child'] || 'open');
      supBtn.querySelector('.dv-pip-sr').textContent = ', supplement question';
    };
    return nav;
  }

  /* ---------- the portal's own examples (always available under "More examples") ---------- */
  function portalGroups(s, per) { return arr(obj(s.examples)[per]).filter(function (g) { return g && arr(g.items).length; }); }
  /* Without a DIVA copy: a short first list, the first example of each area of life. */
  function quickList(groups, max) {
    var out = [];
    for (var round = 0; out.length < max && round < 3; round++) {
      groups.forEach(function (g) { if (out.length < max && g.items[round]) out.push({ key: (g.ctx || 'x') + '.' + round, t: g.items[round] }); });
    }
    return out;
  }
  /* A folded, searchable list of examples. groups: [{label, items: [{key, t}]}]; isOn(key); onToggle(key, on). */
  function moreList(title, groups, isOn, onToggle, o) {
    o = o || {};
    var total = groups.reduce(function (n, g) { return n + g.items.length; }, 0);
    var meta = h('span', { class: 'dv-more-meta' });
    var det = h('details', { class: 'dv-more' + (o.cls ? ' ' + o.cls : '') }, h('summary', null, h('span', { class: 'dv-more-t' }, title), meta));
    function paintMeta() {
      var n = 0; groups.forEach(function (g) { g.items.forEach(function (x) { if (isOn(x.key)) n++; }); });
      meta.textContent = n ? n + ' ticked · ' + total : String(total);
      det.classList.toggle('has-ticks', n > 0);
    }
    var built = false;
    det.addEventListener('toggle', function () {
      if (!det.open || built) return;
      built = true;
      var all = [];
      var body = h('div', { class: 'dv-more-body' });
      var empty = h('p', { class: 'hint', hidden: true }, 'No examples match.');
      var search = ui.search('Search ' + total + ' examples', function (q) {
        var terms = String(q || '').toLowerCase().split(/\s+/).filter(Boolean);
        var shown = 0;
        all.forEach(function (g) {
          var n = 0;
          g.rows.forEach(function (r) { var ok = terms.every(function (t) { return r.text.indexOf(t) > -1; }); r.el.hidden = !ok; if (ok) n++; });
          g.el.hidden = !n; shown += n;
        });
        empty.hidden = shown > 0;
      });
      search.classList.add('dv-more-search');
      body.appendChild(search);
      groups.forEach(function (g) {
        var rows = g.items.map(function (x) {
          var c = ui.check({ label: x.t, checked: isOn(x.key), onChange: function (on) { onToggle(x.key, on); paintMeta(); } });
          return { el: c, text: String(x.t).toLowerCase() };
        });
        var gEl = h('div', { class: 'dv-more-g' }, g.label ? h('p', { class: 'dv-more-gt' }, g.label) : null, h('div', { class: 'dv-checks' }, rows.map(function (r) { return r.el; })));
        all.push({ el: gEl, rows: rows });
        body.appendChild(gEl);
      });
      body.appendChild(empty);
      det.appendChild(body);
    });
    paintMeta();
    det.paintMeta = paintMeta;
    return det;
  }

  /* ===================================================================================
     Parts 1 and 2: overview, items and the supplement question
     =================================================================================== */
  DV.part = function (el, ctx, dim) {
    var sub = ctx.sub;
    if (sub === 'sup') return supplement(el, ctx, dim);
    var list = itemsOf(dim);
    for (var i = 0; i < list.length; i++) if (list[i].id === sub) return itemScreen(el, ctx, dim, i);
    return partOverview(el, ctx, dim);
  };

  function partOverview(el, ctx, dim) {
    var a = ctx.a() || {}, C = src(), P = PART[dim];
    var root = h('div', { class: 'dv stack' });
    var sc = sourceCard(ctx, false);
    var cp = C && C.parts ? C.parts[P.n] : null;
    var first = list0();
    function list0() {
      var l = itemsOf(dim);
      for (var i = 0; i < l.length; i++) { var r = obj(obj(a.symptoms)[l[i].id]); if (!(r.adult === 'yes' || r.adult === 'no') || !(r.child === 'yes' || r.child === 'no')) return l[i]; }
      return null;
    }
    var started = itemsOf(dim).some(function (it) { var r = obj(obj(a.symptoms)[it.id]); return r.adult || r.child; });
    root.appendChild(h('section', { class: 'dv-part-head' },
      h('p', { class: 'dv-part-n' }, 'Part ' + P.n),
      h('h2', null, cp && cp.title ? cp.title : 'Part ' + P.n + ': ' + P.name.toLowerCase() + ' (' + P.range + ')'),
      cp && cp.note ? h('p', { class: 'dv-part-note' }, cp.note) : h('p', { class: 'dv-part-note' }, 'Adulthood means symptoms present for at least the last 6 months; childhood means age 5 to 12. A symptom counts only when it is a long-standing trait, not something that comes and goes in episodes.'),
      h('div', { class: 'row' }, ui.btn({ label: first ? (started ? 'Continue with ' + first.label : 'Start with ' + first.label) : 'Review ' + itemsOf(dim)[0].label, kind: 'primary', onClick: function () { go(ctx, P.step, (first || itemsOf(dim)[0]).id); } }),
        first ? null : ui.btn({ label: 'Supplement question', kind: 'ghost', onClick: function () { go(ctx, P.step, 'sup'); } }))));
    if (sc) root.appendChild(sc);
    if (dim === 'IA') root.appendChild(beforeYouStart(ctx, started));
    var t = tally(dim, false);

    var grid = h('ol', { class: 'dv-grid' });
    itemsOf(dim).forEach(function (it) {
      var s = symData(it.id), r = obj(obj(a.symptoms)[it.id]);
      var ci = C && C.items ? C.items[it.code] : null;
      var nEx = size(r.divaA) + size(r.divaC) + size(r.exA) + size(r.exC);
      grid.appendChild(h('li', null, h('button', { type: 'button', class: 'dv-tile', onclick: function () { go(ctx, P.step, it.id); } },
        h('span', { class: 'dv-code' }, it.label),
        h('span', { class: 'dv-tile-body' },
          h('span', { class: 'dv-tile-t' }, s.title || it.label),
          ci ? h('span', { class: 'dv-tile-q' }, ci.q) : null,
          h('span', { class: 'dv-tile-st' }, stateChip('adult', r.adult), stateChip('child', r.child), nEx ? h('span', { class: 'dv-tile-n' }, U.plural(nEx, 'example')) : null)))));
    });
    var sup = obj(a.supplement);
    grid.appendChild(h('li', null, h('button', { type: 'button', class: 'dv-tile dv-tile-s', onclick: function () { go(ctx, P.step, 'sup'); } },
      h('span', { class: 'dv-code' }, 'S'),
      h('span', { class: 'dv-tile-body' }, h('span', { class: 'dv-tile-t' }, 'Supplement question'),
        h('span', { class: 'dv-tile-q' }, 'More of these symptoms than other people of the same age?'),
        h('span', { class: 'dv-tile-st' }, stateChip('adult', sup[P.key + 'Adult']), stateChip('child', sup[P.key + 'Child']))))));
    root.appendChild(h('section', { class: 'dv-card' }, h('h3', { class: 'dv-h3' }, P.name + ': the count so far'), t, h('div', { class: 'dv-sep' }), grid));
    t.paint(a);
    el.appendChild(root);
    return null;
  }
  function stateChip(per, v) {
    var txt = v === 'yes' ? 'Yes' : v === 'no' ? 'No' : v === 'unsure' ? 'Not sure' : '–';
    return h('span', { class: 'dv-chip dv-chip-' + (v || 'open') }, h('span', { class: 'dv-chip-k' }, PL[per].short), txt);
  }

  /* Part 1 only: what to tell the patient, who is here, and how each question works. */
  function beforeYouStart(ctx, started) {
    var C = src(), a = ctx.a() || {}, inf = obj(obj(a.patient).informants);
    var explain = C && arr(obj(C.intro).explain).length ? C.intro.explain : [
      'I am going to ask about each of the main signs of ADHD, first as they are now (over the last 6 months), then as they were when you were a child, between about 5 and 12.',
      'For each one, tell me whether you recognise it and give me real examples from your own life. I will read out some examples to help.',
      'If your partner or a family member is here, I will ask them too: a partner usually knows you now, family usually knows you as a child. Both parts of your life are needed to make the diagnosis.'];
    var who = [['partner', 'Partner'], ['parent', 'Parent'], ['sibling', 'Brother or sister']];
    var chips = h('div', { class: 'dv-who' }, who.map(function (w) {
      return ui.check({ label: w[1], checked: !!inf[w[0]], onChange: function (on) { ctx.set('patient.informants.' + w[0], on); } });
    }));
    var steps = [
      ['Read the question', 'Read it as written. Adulthood first: the last 6 months.'],
      ['Ask for their examples', 'Tick the DIVA examples they describe. If they are unsure, go through the examples one by one. Add their own words under Other.'],
      ['Ask the partner or family', 'Do they agree, and can they add examples? A partner usually covers adulthood; a parent covers childhood.'],
      ['Decide: present or not', 'Yes only if it happens more often or more severely than in others of the same age, or clearly causes problems, and it is long-standing, not in episodes.'],
      ['Then childhood', 'Ask the same question about age 5 to 12 and decide again. You do not need every example ticked to say Yes.']];
    return h('section', { class: 'dv-card dv-start' },
      h('h3', { class: 'dv-h3' }, 'Before you start'),
      h('div', { class: 'dv-start-grid' },
        h('div', null,
          ui.details(C && arr(obj(C.intro).explain).length ? 'What to tell the patient (from your DIVA copy)' : 'What to tell the patient',
            h('div', { class: 'dv-say' }, explain.map(function (p) { return h('p', null, p); })), { open: !started, cls: 'dv-say-d' }),
          h('p', { class: 'dv-k' }, 'Who is with the patient today?'), chips,
          h('p', { class: 'hint' }, 'DIVA works best with a partner or family member present (about 90 minutes in total).')),
        h('div', null,
          h('p', { class: 'dv-k' }, 'How each question works'),
          h('ol', { class: 'dv-how' }, steps.map(function (s) { return h('li', null, h('strong', null, s[0]), h('span', null, s[1])); })))),
      C && arr(obj(C.intro).instructions).length ? ui.details('DIVA instructions in full (from your copy)', h('div', { class: 'dv-instr' }, C.intro.instructions.map(function (x) {
        return [x.h ? h('h4', null, x.h) : null, x.p ? h('p', null, x.p) : null];
      })), { cls: 'dv-instr-d' }) : null);
  }

  /* ---------- one DIVA item ---------- */
  function itemScreen(el, ctx, dim, idx) {
    var list = itemsOf(dim), it = list[idx], s = symData(it.id), P = PART[dim];
    var C = src(), ci = C && C.items ? C.items[it.code] : null;
    var base = 'symptoms.' + it.id;
    function rec() { return obj(ctx.get(base, {})); }
    var root = h('div', { class: 'dv dv-item' });
    var sc = sourceCard(ctx, true);
    if (sc) root.appendChild(sc);
    var pipNav = pips(ctx, dim, it.id);
    var tl = tally(dim, true);
    root.appendChild(h('div', { class: 'dv-topbar' }, pipNav, tl));

    /* The question */
    var title = h('h2', { class: 'dv-q', tabindex: '-1' }, ci ? ci.q : (obj(s.ask).adult || s.title));
    root.appendChild(h('section', { class: 'dv-qcard', 'aria-label': 'Question ' + it.label },
      h('span', { class: 'dv-code dv-code-lg' }, it.label),
      h('div', { class: 'dv-qbody' },
        h('p', { class: 'dv-qk' }, (s.title || '') + (ci ? '' : ' · portal wording')),
        title,
        h('p', { class: 'dv-qchild' }, ci ? ci.qChild || '' : (obj(s.ask).child ? 'Childhood: ' + s.ask.child : '')))));

    /* Two columns: adulthood and childhood. On a phone one shows at a time. */
    var cols = h('div', { class: 'dv-cols', 'data-show': 'adult' });
    var switcher = h('div', { class: 'dv-switch', role: 'tablist', 'aria-label': 'Life stage' }, PERIODS.map(function (per) {
      return h('button', { type: 'button', role: 'tab', class: 'dv-swbtn', 'data-per': per, 'aria-selected': per === 'adult' ? 'true' : 'false',
        onclick: function () { show(per); } }, PL[per].name, h('span', { class: 'dv-swstate', 'data-per': per }));
    }));
    function show(per) {
      cols.setAttribute('data-show', per);
      U.$$('.dv-swbtn', switcher).forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-per') === per ? 'true' : 'false'); });
    }
    var parts = {};
    PERIODS.forEach(function (per) { var p = periodColumn(per); parts[per] = p; cols.appendChild(p.el); });
    root.appendChild(switcher);
    root.appendChild(cols);

    function periodColumn(per) {
      var k = PL[per].k, r = rec();
      var col = h('section', { class: 'dv-col dv-col-' + per, 'data-per': per, 'aria-label': PL[per].name });
      var count = h('span', { class: 'dv-col-count' });
      col.appendChild(h('header', { class: 'dv-col-head' },
        h('h3', null, PL[per].name), h('span', { class: 'dv-col-when' }, PL[per].when), count));
      /* DIVA examples (from the copy) or the portal's short list */
      var groups = portalGroups(s, per);
      var quick = [];
      if (ci) {
        var exs = arr(ci[per]), ticks = obj(r['diva' + k]);
        if (ci['title' + k]) col.appendChild(h('p', { class: 'dv-ex-k' }, ci['title' + k]));
        col.appendChild(h('div', { class: 'dv-checks dv-diva-ex' }, exs.map(function (e, i) {
          return ui.check({ label: e.t, checked: !!ticks[i], onChange: function (on) { stampSource(ctx); ctx.set(base + '.diva' + k + '.' + i, on ? true : undefined); sync(); } });
        })));
        if (ci['note' + k]) col.appendChild(h('p', { class: 'dv-ex-note' }, ci['note' + k]));
      } else {
        quick = quickList(groups, per === 'adult' ? 8 : 7);
        var ex0 = obj(r['ex' + k]);
        col.appendChild(h('p', { class: 'dv-ex-k' }, 'Common examples'));
        col.appendChild(h('div', { class: 'dv-checks' }, quick.map(function (x) {
          return ui.check({ label: x.t, checked: !!ex0[x.key], onChange: function (on) { toggleKey(ctx, base + '.ex' + k, x.key, on); sync(); more.paintMeta(); } });
        })));
      }
      /* Other: the patient's own words */
      col.appendChild(ui.field(ci && ci['other' + k] ? ci['other' + k].t.replace(/:$/, '') + ' (their own words)' : 'Other (their own words)', ui.input({ rows: 2, value: r['other' + k] || '',
        placeholder: per === 'adult' ? 'What happens, where, how often' : 'What they remember, or what parents and teachers said',
        onSave: function (v) { ctx.set(base + '.other' + k, v.trim() ? v : undefined); sync(); } })));
      /* More examples from the portal */
      var quickKeys = {};
      quick.forEach(function (x) { quickKeys[x.key] = true; });
      var mg = groups.map(function (g) {
        return { label: g.label, items: g.items.map(function (t, i) { return { key: (g.ctx || 'x') + '.' + i, t: t }; }).filter(function (x) { return !quickKeys[x.key]; }) };
      }).filter(function (g) { return g.items.length; });
      var more = moreList('More examples', mg, function (key) { return !!obj(rec()['ex' + k])[key]; },
        function (key, on) { toggleKey(ctx, base + '.ex' + k, key, on); sync(); }, { cls: 'dv-more-ex' });
      col.appendChild(more);
      /* Partner or family */
      col.appendChild(h('div', { class: 'dv-inf' },
        h('span', { class: 'dv-inf-l' }, per === 'adult' ? 'Partner agrees?' : 'Family agrees?'),
        ui.seg({ label: (per === 'adult' ? 'Partner or someone who knows them now' : 'Parent or family') + ': support for this symptom', hideLabel: true, small: true, options: INF,
          value: r['inf' + k] !== undefined && r['inf' + k] !== null ? r['inf' + k] : null, onChange: function (v) { ctx.set(base + '.inf' + k, nil(v)); } }),
        h('span', { class: 'dv-inf-h' }, '0 none, 1 some, 2 clear')));
      /* Decision */
      var nudge = h('p', { class: 'dv-nudge', 'aria-live': 'polite' });
      var dec = decide(PL[per].name + ': symptom present?', r[per] || null, function (v) {
        ctx.set(base + '.' + per, nil(v));
        sync();
        /* After answering adulthood on a phone, move to childhood. */
        if (per === 'adult' && (v === 'yes' || v === 'no') && !(rec().child) && cols.getAttribute('data-show') === 'adult') setTimeout(function () { show('child'); }, 250);
      });
      col.appendChild(h('div', { class: 'dv-dec' }, h('p', { class: 'dv-dec-q' }, 'Symptom present?'), dec, nudge));
      return { el: col, count: count, nudge: nudge, dec: dec, more: more };
    }

    /* Help: how to decide, other ways to ask, probes, partner and family questions, mimics, special groups */
    root.appendChild(helpDrawer(ctx, it, s, base));
    var notes = rec().notes || '';
    root.appendChild(ui.details('Notes on ' + it.label + ' for the report', ui.input({ rows: 3, value: notes, placeholder: 'Anything to remember for the report',
      onSave: function (v) { ctx.set(base + '.notes', v.trim() ? v : undefined); } }), { cls: 'dv-notes', meta: notes ? 'Has a note' : '' }));

    /* Navigation */
    var prev = list[idx - 1], next = list[idx + 1];
    function goTo(d) {
      var j = idx + d;
      if (j < 0) go(ctx, P.step);
      else if (j >= list.length) go(ctx, P.step, 'sup');
      else go(ctx, P.step, list[j].id);
    }
    root.appendChild(h('nav', { class: 'dv-foot', 'aria-label': 'Move between questions' },
      ui.btn({ label: prev ? '← ' + prev.label : '← Part ' + P.n + ' overview', kind: 'ghost', onClick: function () { goTo(-1); } }),
      h('span', { class: 'dv-foot-mid' }, it.label + ' of ' + list.length + ' · use ← → keys'),
      ui.btn({ label: next ? 'Next: ' + next.label + ' →' : 'Supplement question →', kind: 'primary', onClick: function () { goTo(1); } })));
    el.appendChild(root);

    function sync() {
      var r = rec();
      PERIODS.forEach(function (per) {
        var k = PL[per].k, p = parts[per];
        var n = size(r['diva' + k]) + size(r['ex' + k]) + (str(r['other' + k]) ? 1 : 0);
        p.count.textContent = n ? U.plural(n, 'example') : '';
        var v = r[per], msg = '', warn = false;
        if (!v && n) { msg = 'Examples recorded. Now decide: is it present?'; warn = true; }
        else if (v === 'yes' && !n) { msg = 'Present, but no example recorded yet. Note at least one.'; warn = true; }
        else if (v === 'unsure') { msg = 'Come back to this before the score form: decide Yes or No.'; warn = true; }
        p.nudge.textContent = msg; p.nudge.hidden = !msg; p.nudge.classList.toggle('is-warn', warn);
        p.el.classList.toggle('is-done', v === 'yes' || v === 'no');
        var sw = switcher.querySelector('.dv-swstate[data-per="' + per + '"]');
        if (sw) { sw.textContent = v === 'yes' ? ' · Yes' : v === 'no' ? ' · No' : v === 'unsure' ? ' · ?' : ''; }
      });
    }
    sync();
    var a0 = ctx.a() || {};
    pipNav.paint(a0); tl.paint(a0);
    ctx.onChange(base, function () { var a = ctx.a() || {}; pipNav.paint(a); tl.paint(a); });
    settle(root, title);
    return keyNav(goTo);
  }

  /* Help for one item, built when first opened. */
  function helpDrawer(ctx, it, s, base) {
    var tabs = [];
    function add(id, label, items, render) { if (items) tabs.push({ id: id, label: label, render: render }); }
    add('decide', 'How to decide', arr(s.counts).length || arr(s.notCount).length, function () {
      return h('div', { class: 'stack' },
        h('div', { class: 'dv-rules' },
          arr(s.counts).length ? h('div', { class: 'dv-rule dv-rule-yes' }, h('h4', null, 'Mark Yes when'), ui.list(s.counts)) : null,
          arr(s.notCount).length ? h('div', { class: 'dv-rule dv-rule-no' }, h('h4', null, 'Do not count it when'), ui.list(s.notCount)) : null),
        arr(s.anchors).length ? h('div', null, h('h4', null, 'Real answers and how to mark them'), h('div', { class: 'dv-anchors' }, s.anchors.map(function (an) {
          return h('div', { class: 'dv-anchor dv-anchor-' + (an.score || 'x') }, h('p', { class: 'dv-anchor-s' }, an.score === 'yes' ? 'Yes' : an.score === 'no' ? 'No' : 'Not sure yet'), h('blockquote', null, an.quote), h('p', null, an.why));
        }))) : null);
    });
    add('ask', 'Ask it another way', arr(s.rephrase).length, function () { return ui.list(s.rephrase); });
    add('probe', 'Probe', arr(s.probes).length, function () {
      return h('div', { class: 'dv-probes' }, s.probes.map(function (pr) { return h('div', null, h('h4', null, pr.label || pr.k), ui.list(arr(pr.items))); }));
    });
    var inf = obj(s.informant);
    add('family', 'Partner and family', arr(inf.partner).length || arr(inf.parent).length, function () {
      return h('div', { class: 'dv-probes' },
        arr(inf.partner).length ? h('div', null, h('h4', null, 'Ask a partner (adulthood)'), ui.list(inf.partner)) : null,
        arr(inf.parent).length ? h('div', null, h('h4', null, 'Ask a parent (childhood)'), ui.list(inf.parent)) : null,
        arr(inf.school).length ? h('div', null, h('h4', null, 'Look for in school reports'), ui.list(inf.school)) : null);
    });
    add('mimics', 'Could it be something else?', arr(s.mimics).length, function () {
      return h('div', { class: 'dv-mimics' }, s.mimics.map(function (mm) {
        var c = AA.byId('ddx', mm.ddx);
        var flagged = !!obj(obj(ctx.get(base, {})).flags)[mm.ddx];
        var btn = h('button', { type: 'button', class: 'btn btn-ghost btn-sm', 'aria-pressed': flagged ? 'true' : 'false' }, flagged ? '✓ Flagged for the differential step' : 'Flag for the differential step');
        btn.addEventListener('click', function () {
          var on = btn.getAttribute('aria-pressed') !== 'true';
          ctx.set(base + '.flags.' + mm.ddx, on ? true : undefined);
          btn.setAttribute('aria-pressed', on ? 'true' : 'false');
          btn.textContent = on ? '✓ Flagged for the differential step' : 'Flag for the differential step';
        });
        return h('div', { class: 'dv-mimic' }, h('div', { class: 'dv-mimic-h' }, h('h4', null, c ? c.name : mm.ddx), btn),
          mm.clue ? h('p', null, h('strong', null, 'Points to it: '), mm.clue) : null, mm.ask ? h('p', null, h('strong', null, 'Ask: '), mm.ask) : null);
      }));
    });
    var sp = obj(s.special), SP = [['women', 'Women and girls'], ['older', 'Older adults'], ['highIQ', 'High ability'], ['sud', 'Substance use'], ['asd', 'Autism'], ['culture', 'Culture and language']];
    add('special', 'Special groups', SP.some(function (x) { return sp[x[0]]; }), function () {
      return h('dl', { class: 'dv-dl' }, SP.filter(function (x) { return sp[x[0]]; }).map(function (x) { return h('div', null, h('dt', null, x[1]), h('dd', null, sp[x[0]])); }));
    });
    add('what', 'What it means', s.criterion || s.adultForm, function () {
      return h('div', null, h('dl', { class: 'dv-dl' },
        s.criterion ? h('div', null, h('dt', null, 'The criterion (paraphrased)'), h('dd', null, s.criterion)) : null,
        s.adultForm ? h('div', null, h('dt', null, 'In adults'), h('dd', null, s.adultForm)) : null,
        s.why ? h('div', null, h('dt', null, 'What underlies it'), h('dd', null, s.why)) : null),
        arr(s.refs).length ? ui.source(s.refs.join('; ')) : null);
    });
    var body = h('div', { class: 'dv-help-body' });
    var det = h('details', { class: 'dv-help' }, h('summary', null, h('span', { class: 'dv-help-t' }, 'Help with ' + it.label), h('span', { class: 'dv-help-m' }, 'How to decide · other ways to ask · probes · could it be something else?')), body);
    var built = false;
    det.addEventListener('toggle', function () { if (det.open && !built) { built = true; body.appendChild(ui.tabs(tabs, 'decide')); } });
    return det;
  }

  /* ---------- supplement question (after A9 and after H/I 9) ---------- */
  function supplement(el, ctx, dim) {
    var P = PART[dim], C = src(), sp = C && C.supp ? C.supp[P.key] : null;
    var portal = obj(obj(AA.data.impairment).supplement)[P.key] || {};
    var a = ctx.a() || {};
    var root = h('div', { class: 'dv dv-item' });
    var pipNav = pips(ctx, dim, 'sup'), tl = tally(dim, true);
    root.appendChild(h('div', { class: 'dv-topbar' }, pipNav, tl));
    var title = h('h2', { class: 'dv-q', tabindex: '-1' }, sp && sp.title ? sp.title : 'Supplement question');
    root.appendChild(h('section', { class: 'dv-qcard' }, h('span', { class: 'dv-code dv-code-lg' }, 'S'),
      h('div', { class: 'dv-qbody' }, h('p', { class: 'dv-qk' }, P.name + ': compared with others'), title,
        h('p', { class: 'dv-qchild' }, 'Ask once for the whole group of symptoms: are they clearly more frequent or more severe than in other people of the same age?'))));
    var cols = h('div', { class: 'dv-cols dv-cols-both' });
    PERIODS.forEach(function (per) {
      var key = P.key + (per === 'adult' ? 'Adult' : 'Child');
      var q = sp && sp[per] ? sp[per].q : portal[per] || '';
      var n = V.counts(a, per)[dim];
      cols.appendChild(h('section', { class: 'dv-col dv-col-' + per },
        h('header', { class: 'dv-col-head' }, h('h3', null, PL[per].name), h('span', { class: 'dv-col-when' }, PL[per].when), h('span', { class: 'dv-col-count' }, n + ' of 9 marked Yes')),
        h('p', { class: 'dv-supq' }, q),
        h('div', { class: 'dv-dec' }, decide(PL[per].name + ': more than others?', obj(a.supplement)[key] || null, function (v) { ctx.set('supplement.' + key, v === 'yes' || v === 'no' ? v : undefined); }, { noUnsure: true }))));
    });
    root.appendChild(cols);
    var nextLabel = dim === 'IA' ? 'Part 2: hyperactivity-impulsivity →' : 'Part 3: onset and impairment →';
    root.appendChild(h('nav', { class: 'dv-foot' },
      ui.btn({ label: '← ' + itemsOf(dim)[8].label, kind: 'ghost', onClick: function () { go(ctx, P.step, itemsOf(dim)[8].id); } }),
      h('span', { class: 'dv-foot-mid' }, 'End of part ' + P.n),
      ui.btn({ label: nextLabel, kind: 'primary', onClick: function () { if (dim === 'IA') go(ctx, 'hi'); else go(ctx, 'onset'); } })));
    el.appendChild(root);
    pipNav.paint(a); tl.paint(a);
    ctx.onChange('supplement', function () { var a2 = ctx.a() || {}; pipNav.paint(a2); });
    settle(root, title);
    return keyNav(function (d) { if (d < 0) go(ctx, P.step, itemsOf(dim)[8].id); else if (dim === 'IA') go(ctx, 'hi'); else go(ctx, 'onset'); });
  }

  /* ===================================================================================
     Part 3: onset (criterion B), impairment (criterion C), two or more areas, summary
     =================================================================================== */
  var P3 = ['b'].concat(V.DOMAINS).concat(['two', 'sum']);
  function p3Label(k, C) {
    if (k === 'b') return 'Onset';
    if (k === 'two') return 'Two or more areas';
    if (k === 'sum') return 'Summary';
    return AREA_LABEL[k];
  }
  DV.part3 = function (el, ctx) {
    var sub = ctx.sub;
    if (sub === 'b') return critB(el, ctx);
    if (V.DOMAINS.indexOf(sub) > -1 || EXTRA_AREAS.indexOf(sub) > -1) return area(el, ctx, sub);
    if (sub === 'two') return twoAreas(el, ctx);
    if (sub === 'sum') return summary(el, ctx);
    return part3Overview(el, ctx);
  };
  function p3Nav(ctx, cur) {
    var a = ctx.a() || {};
    var S = V.scoreForm(a);
    var nav = h('nav', { class: 'dv-p3nav', 'aria-label': 'Part 3 sections' }, h('ol', null, P3.map(function (k, i) {
      var done = k === 'b' ? !!obj(a.onset).always : k === 'two' ? !!(S.CD.adult.value && S.CD.child.value) : k === 'sum' ? false :
        V.impairment(a, 'adult').concat(V.impairment(a, 'child')).filter(function (d) { return d.id === k && d.sev !== null; }).length === 2;
      return h('li', null, h('button', { type: 'button', class: 'dv-p3btn' + (done ? ' is-done' : ''), 'aria-current': cur === k ? 'step' : null,
        onclick: function () { if (cur !== k) go(ctx, 'onset', k); } }, h('span', { class: 'dv-p3n', 'aria-hidden': 'true' }, done ? '✓' : String(i + 1)), h('span', null, p3Label(k))));
    })));
    return nav;
  }
  function p3Foot(ctx, cur) {
    var i = P3.indexOf(cur), prev = P3[i - 1], next = P3[i + 1];
    var go2 = function (d) { var j = i + d; if (j < 0) go(ctx, 'onset'); else if (j >= P3.length) go(ctx, 'collateral'); else go(ctx, 'onset', P3[j]); };
    return { el: h('nav', { class: 'dv-foot' },
      ui.btn({ label: prev ? '← ' + p3Label(prev) : '← Part 3 overview', kind: 'ghost', onClick: function () { go2(-1); } }),
      h('span', { class: 'dv-foot-mid' }, 'Part 3 · ' + (i + 1) + ' of ' + P3.length),
      ui.btn({ label: next ? 'Next: ' + p3Label(next) + ' →' : 'Collateral information →', kind: 'primary', onClick: function () { go2(1); } })), key: go2 };
  }

  function part3Overview(el, ctx) {
    var C = src(), a = ctx.a() || {};
    var cp = C && C.parts ? C.parts[3] : null;
    var root = h('div', { class: 'dv stack' });
    var sc = sourceCard(ctx, true);
    if (sc) root.appendChild(sc);
    root.appendChild(h('section', { class: 'dv-part-head' },
      h('p', { class: 'dv-part-n' }, 'Part 3'),
      h('h2', null, cp && cp.title ? cp.title : 'Part 3: impairment on account of the symptoms (criteria B, C and D)'),
      h('p', { class: 'dv-part-note' }, 'First ask whether the symptoms have always been there (criterion B). Then go through five areas of life, adulthood then childhood, and tick the problems the patient recognises (criterion C). DIVA needs impairment in at least two areas, at least moderately, in both life stages.'),
      h('div', { class: 'row' }, ui.btn({ label: obj(a.onset).always ? 'Continue' : 'Start with onset', kind: 'primary', onClick: function () {
        var S = V.scoreForm(a);
        var todo = !obj(a.onset).always ? 'b' : V.DOMAINS.filter(function (d) { return V.impairment(a, 'adult').concat(V.impairment(a, 'child')).filter(function (x) { return x.id === d && x.sev !== null; }).length < 2; })[0] || (!(S.CD.adult.value && S.CD.child.value) ? 'two' : 'sum');
        go(ctx, 'onset', todo);
      } }))));
    root.appendChild(p3Nav(ctx, null));
    root.appendChild(extraAreas(ctx));
    el.appendChild(root);
    return null;
  }
  /* The two optional portal areas, as small links. */
  function extraAreas(ctx) {
    var a = ctx.a() || {};
    return h('p', { class: 'dv-extra' }, h('span', { class: 'dv-extra-k' }, 'Optional, not on the DIVA form:'), EXTRA_AREAS.map(function (d) {
      var rated = ['adult', 'child'].filter(function (per) { return typeof obj(obj(obj(a.impairment)[per])[d]).sev === 'number'; }).length;
      return h('button', { type: 'button', class: 'dv-chip' + (rated === 2 ? ' dv-chip-yes' : ' dv-chip-open'), onclick: function () { go(ctx, 'onset', d); } }, AREA_LABEL[d] + (rated === 2 ? ' ✓' : ''));
    }));
  }

  function critB(el, ctx) {
    var C = src(), B = C ? C.critB : null, I = obj(AA.data.impairment), on = obj(I.onset);
    var o = obj(ctx.get('onset', {}));
    var root = h('div', { class: 'dv dv-item' });
    root.appendChild(p3Nav(ctx, 'b'));
    var title = h('h2', { class: 'dv-q', tabindex: '-1' }, B ? B.q : 'Have you always had these symptoms of attention deficit and/or hyperactivity-impulsivity?');
    root.appendChild(h('section', { class: 'dv-qcard' }, h('span', { class: 'dv-code dv-code-lg' }, 'B'),
      h('div', { class: 'dv-qbody' }, h('p', { class: 'dv-qk' }, (B && B.title ? B.title : 'Criterion B') + ': onset'), title,
        h('p', { class: 'dv-qchild' }, 'DIVA 2.0 follows DSM-IV: several symptoms before age 7. Today\'s rule (DSM-5-TR) is several symptoms before age 12: both are recorded below.'))));
    var ageIn = h('input', { type: 'number', min: '1', max: '90', inputmode: 'numeric', class: 'dv-age', value: o.ageOnset || '', 'aria-label': 'Age the symptoms started' });
    ageIn.addEventListener('change', function () { ctx.set('onset.ageOnset', ageIn.value ? ageIn.value : undefined); paint(); });
    var ageRow = h('div', { class: 'dv-agerow' }, h('span', null, B && B.ageBefore ? B.ageBefore : 'If no: starting from age'), ageIn, h('span', null, B && B.ageAfter ? B.ageAfter : ''));
    var dec = decide('Criterion B: always had these symptoms?', o.always || null, function (v) {
      ctx.set('onset.always', v === 'yes' || v === 'no' ? v : undefined);
      if (v === 'yes' && !obj(ctx.get('onset', {})).before12) ctx.set('onset.before12', 'yes');
      paint();
    }, { yes: B && B.yes ? B.yes.t : 'Yes (several symptoms before age 7)', no: B && B.no ? B.no.t : 'No', noUnsure: true });
    dec.classList.add('dv-decide-long');
    var b12Host = h('div');
    function paint() {
      var cur = obj(ctx.get('onset', {}));
      ageRow.hidden = cur.always !== 'no';
      U.clear(b12Host);
      var sug = cur.always === 'yes' ? 'yes' : cur.always === 'no' && cur.ageOnset ? (parseInt(cur.ageOnset, 10) < 12 ? 'yes' : 'no') : null;
      U.append(b12Host, [
        h('div', { class: 'dv-qrow' }, h('div', null, h('p', { class: 'dv-qrow-t' }, 'DSM-5-TR: were several symptoms present before age 12?'),
          sug ? suggestion(sug === 'yes' ? 'Yes, from the answer above' : 'No: the symptoms started at ' + cur.ageOnset, sug === 'yes' ? 'ok' : 'warn') : null),
          ui.seg({ label: 'Several symptoms before age 12', hideLabel: true, value: cur.before12 || null, options: [{ v: 'yes', l: 'Yes', kind: 'yes' }, { v: 'unsure', l: 'Unsure', kind: 'unsure' }, { v: 'no', l: 'No', kind: 'no' }],
            onChange: function (v) { ctx.set('onset.before12', nil(v)); } })),
        h('div', { class: 'dv-qrow' }, h('div', null, h('p', { class: 'dv-qrow-t' }, 'Have the adult symptoms lasted at least 6 months?')),
          ui.seg({ label: 'Present for at least 6 months', hideLabel: true, value: cur.duration6m || null, options: [{ v: 'yes', l: 'Yes', kind: 'yes' }, { v: 'no', l: 'No', kind: 'no' }],
            onChange: function (v) { ctx.set('onset.duration6m', nil(v)); } }))]);
    }
    root.appendChild(h('section', { class: 'dv-card' }, h('div', { class: 'dv-dec dv-dec-wide' }, dec, ageRow), h('div', { class: 'dv-b12' }, b12Host)));
    paint();
    var help = [];
    if (arr(on.memoryAids).length) help.push({ id: 'aids', label: 'Memory aids', render: function () { return ui.list(on.memoryAids); } });
    if (arr(on.lateOnset).length) help.push({ id: 'late', label: 'If it started late', render: function () { return ui.list(on.lateOnset); } });
    if (arr(on.ask).length) help.push({ id: 'ask', label: 'More questions', render: function () { return ui.list(on.ask); } });
    if (help.length) {
      var hb = h('div'), hd = h('details', { class: 'dv-help' }, h('summary', null, h('span', { class: 'dv-help-t' }, 'Help with onset'), h('span', { class: 'dv-help-m' }, 'memory aids · late onset · more questions')), hb);
      var built = false; hd.addEventListener('toggle', function () { if (hd.open && !built) { built = true; hb.appendChild(ui.tabs(help, help[0].id)); } });
      root.appendChild(hd);
    }
    root.appendChild(ui.field('Notes on onset', ui.input({ rows: 2, value: o.notes || '', placeholder: 'For example: school reports from age 6 mention daydreaming', onSave: function (v) { ctx.set('onset.notes', v.trim() ? v : undefined); } })));
    var foot = p3Foot(ctx, 'b');
    root.appendChild(foot.el);
    el.appendChild(root);
    settle(root, title);
    return keyNav(foot.key);
  }

  function area(el, ctx, dom) {
    var C = src(), cc = C ? C.critC : null;
    var I = obj(AA.data.impairment);
    var dd = arr(I.domains).filter(function (d) { return d.id === dom; })[0] || {};
    var root = h('div', { class: 'dv dv-item' });
    root.appendChild(p3Nav(ctx, dom));
    var title = h('h2', { class: 'dv-q', tabindex: '-1' }, cc && cc.q ? cc.q : 'In which areas do you have, or have you had, problems with these symptoms?');
    var idx = V.DOMAINS.indexOf(dom), extra = idx < 0;
    root.appendChild(h('section', { class: 'dv-qcard' }, h('span', { class: 'dv-code dv-code-lg' }, extra ? '+' : 'C' + (idx + 1)),
      h('div', { class: 'dv-qbody' }, h('p', { class: 'dv-qk' }, extra ? 'Extra area (not on the DIVA form): ' + AREA_LABEL[dom] : (cc && cc.title ? cc.title : 'Criterion C') + ': ' + AREA_LABEL[dom]), title,
        h('p', { class: 'dv-qchild' }, extra ? 'Optional. The portal\'s own examples; it counts towards criteria C and D but is not printed on the DIVA form.' : 'Tick what they recognise, then rate how much it affects them in this area.'))));
    var cols = h('div', { class: 'dv-cols', 'data-show': 'adult' });
    var switcher = h('div', { class: 'dv-switch', role: 'tablist', 'aria-label': 'Life stage' }, PERIODS.map(function (per) {
      return h('button', { type: 'button', role: 'tab', class: 'dv-swbtn', 'data-per': per, 'aria-selected': per === 'adult' ? 'true' : 'false',
        onclick: function () { cols.setAttribute('data-show', per); U.$$('.dv-swbtn', switcher).forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-per') === per ? 'true' : 'false'); }); } }, per === 'adult' ? 'Adulthood' : 'Childhood');
    }));
    PERIODS.forEach(function (per) {
      var base = 'impairment.' + per + '.' + dom;
      var r = obj(ctx.get(base, {}));
      var dc = !extra && cc ? arr(cc[per])[idx] : null;
      var colTitle = per === 'adult' ? (cc && cc.titleA) || 'Adulthood' : (cc && cc.titleC) || 'Childhood and adolescence';
      var col = h('section', { class: 'dv-col dv-col-' + per, 'data-per': per });
      var count = h('span', { class: 'dv-col-count' });
      col.appendChild(h('header', { class: 'dv-col-head' }, h('h3', null, colTitle), h('span', { class: 'dv-col-when' }, dc ? dc.title : AREA_LABEL[dom]), count));
      var portalItems = arr(obj(dd[per]).items);
      var quickN = 0;
      if (dc) {
        var ticks = obj(r.diva);
        col.appendChild(h('div', { class: 'dv-checks dv-diva-ex' }, arr(dc.ex).map(function (e, i) {
          return ui.check({ label: e.t, checked: !!ticks[i], onChange: function (on) { stampSource(ctx); ctx.set(base + '.diva.' + i, on ? true : undefined); paint(); } });
        })));
      } else {
        quickN = Math.min(8, portalItems.length);
        var ex0 = obj(r.ex);
        col.appendChild(h('p', { class: 'dv-ex-k' }, 'Common problems'));
        col.appendChild(h('div', { class: 'dv-checks' }, portalItems.slice(0, quickN).map(function (t, i) {
          return ui.check({ label: t, checked: !!ex0[i], onChange: function (on) { ctx.set(base + '.ex.' + i, on ? true : undefined); paint(); } });
        })));
      }
      col.appendChild(ui.field('Other (their own words)', ui.input({ rows: 2, value: r.other || '', placeholder: 'What happened, for example lost jobs, arguments, accidents',
        onSave: function (v) { ctx.set(base + '.other', v.trim() ? v : undefined); paint(); } })));
      var rest = portalItems.map(function (t, i) { return { key: String(i), t: t }; }).slice(quickN);
      if (rest.length) col.appendChild(moreList('More examples', [{ label: '', items: rest }], function (key) { return !!obj(obj(ctx.get(base, {})).ex)[key]; },
        function (key, on) { ctx.set(base + '.ex.' + key, on ? true : undefined); paint(); }));
      var anchors = obj(obj(dd[per]).anchors);
      var sevHint = h('p', { class: 'dv-sev-h' });
      var seg = ui.seg({ label: (per === 'adult' ? 'Adulthood' : 'Childhood') + ': how much does this affect them?', hideLabel: true, value: typeof r.sev === 'number' ? r.sev : null,
        options: SEV.map(function (x) { return { v: x.v, l: x.l }; }), onChange: function (v) { ctx.set(base + '.sev', nil(v)); paint(); } });
      col.appendChild(h('div', { class: 'dv-dec' }, h('p', { class: 'dv-dec-q' }, 'How much does it affect them?'), seg, sevHint));
      cols.appendChild(col);
      function paint() {
        var cur = obj(ctx.get(base, {}));
        var n = size(cur.diva) + size(cur.ex) + (str(cur.other) ? 1 : 0);
        count.textContent = n ? U.plural(n, 'problem') : '';
        sevHint.textContent = typeof cur.sev === 'number' ? (anchors[cur.sev] || '') : n ? 'Problems ticked: now rate how much.' : '';
        sevHint.classList.toggle('is-warn', typeof cur.sev !== 'number' && n > 0);
        col.classList.toggle('is-done', typeof cur.sev === 'number');
      }
      paint();
    });
    root.appendChild(switcher);
    root.appendChild(cols);
    root.appendChild(h('p', { class: 'hint dv-sevkey' }, 'None: no problems. Mild: some problems, little effect. Moderate: clear problems that get in the way. Severe: major effect, for example lost jobs or relationships. DIVA needs at least moderate impairment in two or more areas.'));
    var foot = extra ? { el: h('nav', { class: 'dv-foot' }, ui.btn({ label: '← Part 3 overview', kind: 'ghost', onClick: function () { go(ctx, 'onset'); } }), h('span', { class: 'dv-foot-mid' }, 'Optional area'),
      ui.btn({ label: 'Two or more areas →', kind: 'primary', onClick: function () { go(ctx, 'onset', 'two'); } })), key: function (d) { go(ctx, 'onset', d < 0 ? null : 'two'); } } : p3Foot(ctx, dom);
    root.appendChild(foot.el);
    el.appendChild(root);
    settle(root, title);
    return keyNav(foot.key);
  }

  function twoAreas(el, ctx) {
    var C = src(), T = C ? C.twoAreas : null;
    var root = h('div', { class: 'dv dv-item' });
    root.appendChild(p3Nav(ctx, 'two'));
    var title = h('h2', { class: 'dv-q', tabindex: '-1' }, 'Evidence of impairment in two or more areas?');
    root.appendChild(h('section', { class: 'dv-qcard' }, h('span', { class: 'dv-code dv-code-lg' }, 'C'),
      h('div', { class: 'dv-qbody' }, h('p', { class: 'dv-qk' }, 'Criteria C and D'), title,
        h('p', { class: 'dv-qchild' }, 'Look at the five areas together. The portal suggests an answer from your ratings; you decide.'))));
    var cols = h('div', { class: 'dv-cols dv-cols-both' });
    PERIODS.forEach(function (per) {
      var a = ctx.a() || {};
      var sg = V.twoAreasSuggest(a, per);
      var list = V.impairment(a, per);
      var col = h('section', { class: 'dv-col dv-col-' + per });
      col.appendChild(h('header', { class: 'dv-col-head' }, h('h3', null, PL[per].name), h('span', { class: 'dv-col-when' }, PL[per].when)));
      col.appendChild(h('ul', { class: 'dv-arealist' }, list.map(function (d) {
        return h('li', { class: 'dv-area-' + (d.sev === null ? 'open' : d.sev >= 2 ? 'hi' : d.sev === 1 ? 'lo' : 'none') },
          h('button', { type: 'button', class: 'dv-arealink', onclick: function () { go(ctx, 'onset', d.id); } }, AREA_LABEL[d.id]),
          h('span', { class: 'dv-area-v' }, d.sev === null ? (d.ticks ? d.ticks + ' ticked, not rated' : 'not rated') : SEV[d.sev].l));
      })));
      if (T && T[per] && T[per].q) col.appendChild(h('p', { class: 'dv-supq' }, T[per].q));
      if (sg.v) col.appendChild(suggestion(sg.v === 'yes' ? 'Yes: ' + sg.areas.length + ' areas affected' + (sg.max !== null ? ', highest ' + SEV[sg.max].l.toLowerCase() : ' (from ticked problems)') : 'No: fewer than two areas, or none at least moderate', sg.v === 'yes' ? 'ok' : 'warn'));
      col.appendChild(h('div', { class: 'dv-dec' }, decide(PL[per].name + ': impairment in two or more areas?', obj(obj(a.diva).twoAreas)[per] || null, function (v) {
        ctx.set('diva.twoAreas.' + per, v === 'yes' || v === 'no' ? v : undefined);
      }, { noUnsure: true }),
      h('p', { class: 'hint' }, 'Leave it empty to use the suggestion.')));
      cols.appendChild(col);
    });
    root.appendChild(cols);
    root.appendChild(extraAreas(ctx));
    var dv = obj(ctx.get('diva', {}));
    root.appendChild(ui.field(T && T.detailsLabel ? T.detailsLabel.replace(/:$/, '') : 'Potential details', ui.input({ rows: 3, value: dv.details || '', placeholder: 'Anything else about impairment, who gave the information, or what is still unclear',
      onSave: function (v) { ctx.set('diva.details', v.trim() ? v : undefined); } })));
    if (T && T.end) root.appendChild(h('p', { class: 'dv-end' }, T.end));
    var foot = p3Foot(ctx, 'two');
    root.appendChild(foot.el);
    el.appendChild(root);
    settle(root, title);
    return keyNav(foot.key);
  }

  /* Summary of symptoms A and H/I: which were present in each life stage, and the totals. */
  function summaryTable(ctx, a, opts) {
    opts = opts || {};
    function cell(v) { return v === 'yes' ? h('span', { class: 'dv-mk dv-mk-yes' }, h('span', { 'aria-hidden': 'true' }, '✓'), h('span', { class: 'sr-only' }, 'Present')) : v === 'no' ? h('span', { class: 'dv-mk dv-mk-no' }, h('span', { 'aria-hidden': 'true' }, '–'), h('span', { class: 'sr-only' }, 'Absent')) : h('span', { class: 'dv-mk dv-mk-open' }, v === 'unsure' ? 'Not sure' : 'Open'); }
    var rows = [];
    ['IA', 'HI'].forEach(function (dim) {
      itemsOf(dim).forEach(function (it) {
        var r = obj(obj(a.symptoms)[it.id]);
        rows.push(h('tr', null, h('th', { scope: 'row' }, opts.link === false ? h('span', { class: 'dv-code' }, it.label) : h('button', { type: 'button', class: 'dv-code dv-code-btn', onclick: function () { go(ctx, PART[dim].step, it.id); } }, it.label)),
          h('td', { class: 'dv-sum-t' }, (symData(it.id).title || '')), h('td', { class: 'dv-sum-c' }, cell(r.adult)), h('td', { class: 'dv-sum-c' }, cell(r.child))));
      });
      var ad = V.counts(a, 'adult')[dim], ch = V.counts(a, 'child')[dim];
      rows.push(h('tr', { class: 'dv-sum-total' }, h('th', { scope: 'row', colspan: '2' }, 'Total ' + (dim === 'IA' ? 'attention deficit' : 'hyperactivity-impulsivity')),
        h('td', { class: 'dv-sum-c' }, h('strong', { class: ad >= V.THRESHOLD ? 'is-met' : '' }, ad + ' / 9')), h('td', { class: 'dv-sum-c' }, h('strong', { class: ch >= V.THRESHOLD ? 'is-met' : '' }, ch + ' / 9'))));
    });
    return h('div', { class: 'table-wrap dv-sum' }, h('table', { class: 'table' },
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'DIVA'), h('th', { scope: 'col' }, 'Symptom'), h('th', { scope: 'col' }, 'Adulthood'), h('th', { scope: 'col' }, 'Childhood'))),
      h('tbody', null, rows)));
  }
  DV.summaryTable = summaryTable;

  function summary(el, ctx) {
    var a = ctx.a() || {}, C = src();
    var root = h('div', { class: 'dv dv-item' });
    root.appendChild(p3Nav(ctx, 'sum'));
    var title = h('h2', { class: 'dv-q', tabindex: '-1' }, C && C.summary && C.summary.title ? C.summary.title : 'Summary of symptoms');
    root.appendChild(h('section', { class: 'dv-qcard' }, h('span', { class: 'dv-code dv-code-lg' }, 'Σ'),
      h('div', { class: 'dv-qbody' }, h('p', { class: 'dv-qk' }, 'End of the interview'), title,
        h('p', { class: 'dv-qchild' }, 'The portal fills this in from your answers: which symptoms were present in each life stage, and the totals out of 9.'))));
    var open = [];
    ['adult', 'child'].forEach(function (per) { V.counts(a, per).openIds.forEach(function (code) { open.push({ code: code, per: per }); }); });
    if (open.length) root.appendChild(ui.callout('warn', h('div', null, h('p', null, 'Still to decide (' + open.length + '):'),
      h('div', { class: 'dv-openlist' }, open.slice(0, 24).map(function (x) {
        var it = V.item(x.code);
        return h('button', { type: 'button', class: 'dv-chip dv-chip-open', onclick: function () { go(ctx, PART[it.dim].step, it.id); } }, it.label + ' ' + PL[x.per].short.toLowerCase());
      }))), 'Not finished'));
    root.appendChild(summaryTable(ctx, a));
    root.appendChild(h('p', { class: 'hint' }, 'Next: collateral information, the differential diagnosis and the score form in "Scoring and diagnosis", where you can download the filled DIVA form.'));
    var foot = p3Foot(ctx, 'sum');
    root.appendChild(foot.el);
    el.appendChild(root);
    settle(root, title);
    return keyNav(foot.key);
  }

  /* ===================================================================================
     Score form, explanation and the filled form (summary step, adults)
     =================================================================================== */
  DV.scoreCard = function (el, ctx) {
    var C = src();
    var host = h('section', { class: 'dv dv-score', 'aria-labelledby': 'dv-score-h' });
    var head = h('div', { class: 'dv-score-head' });
    host.appendChild(head);
    var tabsHost = h('div');
    host.appendChild(tabsHost);
    var current = 'form';
    function render() {
      var a = ctx.a() || {}, S = V.scoreForm(a);
      U.clear(head);
      var dx = S.dx.value, label = dx === 'no' ? 'No ADHD diagnosis on the DIVA 2.0 rules' : dx ? 'ADHD, ' + V.SUBTYPES[dx].label.toLowerCase() + ' (' + V.SUBTYPES[dx].code + ')' : 'Not finished yet';
      U.append(head, [
        h('div', { class: 'dv-score-title' }, h('p', { class: 'dv-part-n' }, 'DIVA 2.0 result'), h('h2', { id: 'dv-score-h' }, label),
          h('p', { class: 'dv-score-sub' }, S.dx.set ? 'Your choice on the score form.' : dx ? 'Worked out from your answers, using the rules printed on the form (DSM-IV). You can change it below.' : S.dx.pending.length ? S.dx.pending[0] : '')),
        h('div', { class: 'dv-big4' }, [['Adult', 'A', S.A.adultIA.n], ['Adult', 'H/I', S.A.adultHI.n], ['Child', 'A', S.A.childIA.n], ['Child', 'H/I', S.A.childHI.n]].map(function (x) {
          return h('div', { class: 'dv-big' + (x[2] >= V.THRESHOLD ? ' is-met' : '') }, h('span', { class: 'dv-big-n' }, String(x[2])), h('span', { class: 'dv-big-l' }, x[0] + ' · ' + x[1]), h('span', { class: 'dv-big-of' }, 'of 9'));
        }))]);
      if (S.dsm5.outcome && ((S.dsm5.outcome.code === 'met') !== (dx === 'combined' || dx === 'ia' || dx === 'hi')) && (dx || S.dsm5.outcome.code === 'met')) {
        head.appendChild(ui.callout('info', h('p', null, 'DSM-5-TR (used by NICE) gives a different answer: ' + S.dsm5.outcome.title.toLowerCase() + '. DIVA 2.0 uses the older DSM-IV rules (6 of 9; onset before 7). Record which rules you applied in your conclusion below.'), 'The two rule sets differ'));
      }
      U.clear(tabsHost);
      var t = ui.tabs([
        { id: 'form', label: 'Score form', render: function () { return scoreForm(ctx, S, C, render); } },
        { id: 'how', label: 'How the score works', render: function () { return explainer(ctx, a); } },
        { id: 'pdf', label: 'Fill in the DIVA form', render: function () { return exportPanel(ctx); } }
      ], current, function (id) { current = id; });
      tabsHost.appendChild(t);
    }
    render();
    el.appendChild(host);
    /* Answers on the card change other rows (suggestions, the result), so it is redrawn. Focus stays on the same
       control, and nothing is redrawn while a text box is being typed in (it waits until focus leaves). */
    var pending = false;
    function typing() {
      var ae = document.activeElement;
      return !!(ae && host.contains(ae) && (ae.tagName === 'TEXTAREA' || (ae.tagName === 'INPUT' && /^(text|search|date|number)$/i.test(ae.type || 'text'))));
    }
    function pathOf(node) {
      var p = [];
      while (node && node !== host) { var par = node.parentNode; if (!par || !par.children) return null; p.unshift(Array.prototype.indexOf.call(par.children, node)); node = par; }
      return node === host ? p : null;
    }
    function nodeAt(p) { var n = host; for (var i = 0; i < p.length && n; i++) n = n.children[p[i]]; return n; }
    var rerender = U.debounce(function () {
      if (!host.isConnected) return;
      if (typing()) { pending = true; return; }
      var ae = document.activeElement, p = ae && host.contains(ae) ? pathOf(ae) : null, y = window.scrollY;
      render();
      window.scrollTo(0, y);
      if (p) { var n = nodeAt(p); if (n && n.focus) { try { n.focus({ preventScroll: true }); } catch (e) { n.focus(); } } }
    }, 200);
    host.addEventListener('focusout', function () { if (pending) { pending = false; setTimeout(rerender, 0); } });
    ['diva.score', 'diva.twoAreas', 'onset', 'collateral', 'ddx'].forEach(function (p) { ctx.onChange(p, rerender); });
    return null;
  };

  function scoreForm(ctx, S, C, refresh) {
    var sf = C && C.score && C.score.pattern === V.SCORE_PATTERN ? C.score : null;
    var rows = [];
    function lab(k, fallback) { return sf && sf.rows[k] && sf.rows[k].label ? sf.rows[k].label : fallback; }
    function auto(v) { return v === 'yes' ? ui.badge('Yes', 'ok') : v === 'no' ? ui.badge('No', 'neutral') : ui.badge('Not answered', 'warn'); }
    function aRow(k, life, grp, r) {
      return h('div', { class: 'dv-sf-row' }, h('div', { class: 'dv-sf-q' }, h('span', { class: 'dv-sf-life' }, life), lab(k, 'Is the number of ' + grp + ' characteristics 6 or more?')),
        h('div', { class: 'dv-sf-a' }, h('span', { class: 'dv-sf-num' }, r.n + ' of 9'), r.answered ? auto(r.met ? 'yes' : r.done ? 'no' : null) : auto(null)));
    }
    rows.push(sec('A', 'Criterion A: symptoms', [aRow('aChildIA', 'Childhood', 'A', S.A.childIA), aRow('aChildHI', 'Childhood', 'H/I', S.A.childHI), aRow('aAdultIA', 'Adulthood', 'A', S.A.adultIA), aRow('aAdultHI', 'Adulthood', 'H/I', S.A.adultHI),
      h('p', { class: 'dv-sf-note' }, sf && sf.notes[0] ? sf.notes[0] : 'Footnote on the form: in adults, 4 or more symptoms may be enough (Kooij 2005). Research context, not the rule.')]));
    rows.push(sec('B', 'Criterion B: lifelong pattern', [h('div', { class: 'dv-sf-row' }, h('div', { class: 'dv-sf-q' }, lab('b', 'Are there signs of a lifelong pattern of symptoms and limitations?'), h('p', { class: 'dv-sf-why' }, S.B.why)),
      h('div', { class: 'dv-sf-a' }, overrideSeg(ctx, 'diva.score.B', S.B)))]));
    rows.push(sec('CD', 'Criteria C and D: two or more areas', ['adult', 'child'].map(function (per) {
      var r = S.CD[per];
      var cdLab = lab(per === 'adult' ? 'cdAdult' : 'cdChild', '');
      if (!cdLab || cdLab.toLowerCase() === PL[per].name.toLowerCase()) cdLab = 'Symptoms and impairment in at least two areas of life';
      return h('div', { class: 'dv-sf-row' }, h('div', { class: 'dv-sf-q' }, h('span', { class: 'dv-sf-life' }, PL[per].name), cdLab,
        h('p', { class: 'dv-sf-why' }, r.areas.length ? 'Areas affected: ' + r.areas.map(function (d) { return AREA_LABEL[d].toLowerCase(); }).join(', ') + '.' : 'No areas recorded yet.', ' ', h('button', { type: 'button', class: 'dv-link', onclick: function () { go(ctx, 'onset', 'two'); } }, 'Change in part 3'))),
        h('div', { class: 'dv-sf-a' }, r.value ? auto(r.value) : auto(null), r.set ? h('span', { class: 'dv-sf-set' }, 'your answer') : r.value ? h('span', { class: 'dv-sf-set' }, 'suggested') : null));
    })));
    var eBy = ui.input({ value: S.E.set ? S.E.by : (obj(obj(ctx.a()).diva).score || {}).eBy || '', placeholder: 'Which disorder?', onSave: function (v) { ctx.set('diva.score.eBy', v.trim() ? v : undefined); } });
    /* The form prints a double negative ("cannot be explained ... No / Yes, by"); ask it plainly, show the form's words below. */
    rows.push(sec('E', 'Criterion E: not better explained', [h('div', { class: 'dv-sf-row' }, h('div', { class: 'dv-sf-q' }, 'Are the symptoms better explained by another psychiatric disorder?',
      h('p', { class: 'dv-sf-why' }, S.E.why + ' No means criterion E is met.'), sf && sf.eNo && sf.eNo.label ? h('p', { class: 'dv-sf-note' }, 'On the form: "' + sf.eNo.label + '" (No / Yes, by).') : null),
      h('div', { class: 'dv-sf-a' }, ui.seg({ label: 'Criterion E', hideLabel: true, small: true, value: S.E.set ? S.E.value : null,
        options: [{ v: 'no', l: 'No' + (S.E.auto === 'no' && !S.E.set ? ' (suggested)' : ''), kind: 'yes' }, { v: 'yes', l: 'Yes, by…' + (S.E.auto === 'yes' && !S.E.set ? ' (suggested)' : ''), kind: 'no' }],
        onChange: function (v) { ctx.set('diva.score.E', nil(v)); } }), S.E.value === 'yes' ? eBy : null))]));
    var col = obj(obj(ctx.a()).collateral);
    rows.push(sec('COL', 'Collateral information', [h('p', { class: 'dv-sf-note' }, '0 = none or little support, 1 = some support, 2 = clear support. N/A when there is no such source.')].concat([['parent', 'Parent, brother, sister or other (childhood)'], ['partner', 'Partner, good friend or other (adulthood)'], ['school', 'School reports']].map(function (x) {
      var who = x[0] === 'school' ? null : ui.input({ value: str(obj(col.who)[x[0]]), placeholder: 'Who? e.g. Mother', onSave: function (v) { ctx.set('collateral.who.' + x[0], v.trim() ? v : undefined); } });
      return h('div', { class: 'dv-sf-row' }, h('div', { class: 'dv-sf-q' }, sf && sf.col[x[0]] ? sf.col[x[0]].label.replace(/\s*\*+$/, '') : x[1], who ? h('div', { class: 'dv-sf-who' }, who) : null),
        h('div', { class: 'dv-sf-a' }, ui.seg({ label: x[1] + ': support', hideLabel: true, small: true, value: col[x[0]] !== undefined ? col[x[0]] : null, options: INF.map(function (o) { return { v: o.v, l: o.v === 'na' ? 'N/A' : o.l, title: o.title }; }),
          onChange: function (v) { ctx.set('collateral.' + x[0], nil(v)); } })));
    })).concat([ui.field(sf && sf.explain && sf.explain.label ? sf.explain.label.replace(/:$/, '') : 'Explanation', ui.input({ rows: 2, value: col.notes || '', placeholder: 'How strongly do the sources support the history, and why?', onSave: function (v) { ctx.set('collateral.notes', v.trim() ? v : undefined); } }))])));
    var dxOpts = [{ v: 'no', l: 'No' }, { v: 'combined', l: 'Combined (314.01)' }, { v: 'ia', l: 'Inattentive (314.00)' }, { v: 'hi', l: 'Hyperactive-impulsive (314.01)' }].map(function (o) {
      return { v: o.v, l: o.l + (S.dx.auto === o.v && !S.dx.set ? ' ✓' : ''), kind: o.v === 'no' ? 'no' : 'yes' };
    });
    rows.push(sec('DX', 'Diagnosis ADHD', [h('div', { class: 'dv-sf-row dv-sf-dx' }, h('div', { class: 'dv-sf-q' },
      S.dx.auto ? suggestion(S.dx.auto === 'no' ? 'No' : V.SUBTYPES[S.dx.auto].label + ' (' + V.SUBTYPES[S.dx.auto].code + ')', S.dx.auto === 'no' ? 'warn' : 'ok') : h('p', { class: 'dv-sf-why' }, 'No suggestion until every part is answered.'),
      S.dx.reasons.length ? ui.list(S.dx.reasons, 'list dv-sf-reasons') : null,
      h('p', { class: 'dv-sf-why' }, sf && sf.notes[2] ? sf.notes[2] : 'If the type differs between childhood and adulthood, the adult type is used.')),
      h('div', { class: 'dv-sf-a' }, ui.seg({ label: 'Diagnosis ADHD on the DIVA form', hideLabel: true, small: true, value: S.dx.set ? S.dx.value : null, options: dxOpts,
        onChange: function (v) { ctx.set('diva.score.dx', nil(v)); } }), h('p', { class: 'hint' }, S.dx.set ? 'Your choice. Clear it to use the suggestion.' : 'Leave empty to use the suggestion (✓).')))]));
    return h('div', { class: 'dv-sf' }, rows);
  }
  function sec(k, title, body) { return h('section', { class: 'dv-sf-sec dv-sfs-' + k.toLowerCase() }, h('h3', { class: 'dv-sf-h' }, title), body); }
  function overrideSeg(ctx, path, r) {
    return h('div', { class: 'dv-sf-ov' }, ui.seg({ label: 'Answer', hideLabel: true, small: true, value: r.set ? r.value : null,
      options: [{ v: 'yes', l: 'Yes' + (r.auto === 'yes' && !r.set ? ' (suggested)' : ''), kind: 'yes' }, { v: 'no', l: 'No' + (r.auto === 'no' && !r.set ? ' (suggested)' : ''), kind: 'no' }],
      onChange: function (v) { ctx.set(path, nil(v)); } }));
  }

  /* How the score is worked out, step by step, with this patient's numbers. */
  function explainer(ctx, a) {
    var E = V.explain(a), S = E.S;
    var icon = { yes: '✓', no: '✗', open: '…' };
    var bars = h('div', { class: 'dv-ex-bars' }, [['Adulthood', 'Attention deficit', S.A.adultIA.n], ['Adulthood', 'Hyperactivity-impulsivity', S.A.adultHI.n], ['Childhood', 'Attention deficit', S.A.childIA.n], ['Childhood', 'Hyperactivity-impulsivity', S.A.childHI.n]].map(function (x) {
      var dots = h('span', { class: 'dv-dots dv-dots-lg', 'aria-hidden': 'true' });
      for (var i = 0; i < 9; i++) dots.appendChild(h('span', { class: 'dv-dot' + (i === 5 ? ' is-line' : '') + (i === 4 && x[0] === 'Adulthood' ? ' is-line5' : ''), 'data-s': i < x[2] ? 'yes' : 'no' }));
      return h('div', { class: 'dv-ex-bar' + (x[2] >= V.THRESHOLD ? ' is-met' : '') }, h('span', { class: 'dv-ex-bl' }, h('strong', null, x[0]), ' · ', x[1]), dots, h('span', { class: 'dv-ex-bn' }, x[2] + ' / 9'));
    }));
    return h('div', { class: 'dv-explain' },
      h('p', { class: 'dv-ex-lead' }, 'DIVA does not add points. It counts symptoms and then checks five conditions. Here is each step with this patient\'s answers.'),
      bars,
      h('p', { class: 'hint' }, 'The bold line after the 6th dot is the DIVA 2.0 cut-off. In adulthood the thin line after the 5th dot is the DSM-5-TR cut-off.'),
      h('ol', { class: 'dv-steps' }, E.steps.map(function (st) {
        return h('li', { class: 'dv-step dv-step-' + st.state },
          h('span', { class: 'dv-step-ico', 'aria-hidden': 'true' }, icon[st.state] || '…'),
          h('div', null, h('h4', null, st.title, h('span', { class: 'sr-only' }, st.state === 'yes' ? ' (met)' : st.state === 'no' ? ' (not met)' : ' (not decided)')),
            h('p', null, st.text), st.result ? h('p', { class: 'dv-step-res' }, 'Result: ' + st.result) : null,
            st.nums ? h('dl', { class: 'dv-step-nums' }, st.nums.map(function (n) { return h('div', null, h('dt', null, n[0]), h('dd', null, String(n[1]))); })) : null));
      })),
      ui.details('How to mark each symptom, in short', ui.list([
        'Mark Yes when the patient recognises the problem and gives real examples, and it is clearly more frequent or more severe than in others of the same age, or clearly causes problems.',
        'It must be a long-standing trait: there for at least the last 6 months in adulthood, and part of a pattern since childhood. Problems only during a bad patch (low mood, stress, drink or drugs) do not count.',
        'The examples are prompts. You do not need to tick them all; one or two clear, typical examples can be enough.',
        'Ask the partner (adulthood) and a parent or older relative (childhood). When accounts differ, use your judgement and note why.',
        'Childhood means age 5 to 12. Old school reports help a lot.'
      ]), { cls: 'dv-howto' }));
  }

  /* Download, preview or print the filled form. */
  function exportPanel(ctx) {
    var C = src();
    var box = h('div', { class: 'dv-export' });
    if (!C) {
      box.appendChild(sourceCard(ctx, false));
      box.appendChild(h('p', { class: 'hint' }, 'Without your DIVA copy the portal cannot fill in the official form. The report step still has the full written record.'));
      return box;
    }
    if (!C.canFill) {
      box.appendChild(ui.callout('warn', h('p', null, 'Your DIVA copy was read, but its score form or summary page was not recognised, so it cannot be filled in automatically.'), 'Cannot fill this copy'));
      return box;
    }
    var a = ctx.a() || {}, S = V.scoreForm(a);
    var open = V.counts(a, 'adult').openIds.length + V.counts(a, 'child').openIds.length;
    var me = AA.auth.current() || {};
    var nameIn = h('input', { type: 'text', autocomplete: 'off', placeholder: 'Only printed on the PDF' });
    var dobIn = h('input', { type: 'date' });
    var resIn = h('input', { type: 'text', value: me.name && me.role !== 'guest' ? me.name : '' });
    var numIn = h('input', { type: 'text', value: obj(a.patient).ref || '' });
    var dateIn = h('input', { type: 'date', value: obj(a.patient).date || U.today() });
    box.appendChild(h('div', { class: 'dv-export-grid' },
      h('div', null,
        h('h3', { class: 'dv-h3' }, 'Your official DIVA 2.0 form, filled in'),
        h('p', null, 'The portal ticks every example, the Yes or No answers, the supplement questions, onset, the five areas of life, the summary table with totals and the score form, on your own copy of the PDF.'),
        open ? ui.callout('warn', h('p', null, open + ' symptom answers are still open. They will be left blank on the form.'), 'Not finished') : null,
        S.dx.value ? null : h('p', { class: 'hint' }, 'The diagnosis box stays empty until the score form is complete.'),
        h('p', { class: 'hint' }, 'Name and date of birth are printed on the PDF only. They are not saved in the portal.')),
      h('div', { class: 'dv-export-form' },
        ui.field('Name of the patient', nameIn), ui.field('Date of birth', dobIn), ui.field('Date of interview', dateIn),
        ui.field('Name of researcher (clinician)', resIn), ui.field('Patient number', numIn))));
    var pv = h('div', { class: 'dv-pv' });
    var status = h('p', { class: 'hint', 'aria-live': 'polite' });
    function extra() {
      return { name: nameIn.value.trim(), dob: dobIn.value, date: dateIn.value, researcher: resIn.value.trim(), number: numIn.value.trim(),
        portal: portalTicks(ctx.a() || {}), portalImp: portalImpTicks(ctx.a() || {}) };
    }
    function build() {
      status.textContent = 'Filling in the form…';
      return AA.divaSource.bytes().then(function (bytes) {
        if (bytes) return bytes;
        status.textContent = 'Choose your DIVA PDF again to fill it in (it is not kept in this browser).';
        return AA.divaSource.pick().then(function (f) { if (!f) throw new Error('No file chosen.'); return AA.divaSource.useFileForFill(f); });
      }).then(function (bytes) {
        var plan = V.fillPlan(ctx.a() || {}, C, extra());
        return AA.pdfkit.fill(bytes, plan, { title: 'DIVA 2.0 ' + (numIn.value.trim() || '') });
      }).then(function (out) { status.textContent = ''; return out; }, function (e) { status.textContent = ''; U.toast(e && e.message ? e.message : 'The form could not be filled in.', 'err'); throw e; });
    }
    function fileName() { return 'DIVA-2.0-' + (numIn.value.trim() || 'patient').replace(/[^A-Za-z0-9_-]+/g, '-') + '-' + (dateIn.value || U.today()) + '.pdf'; }
    U.append(box, [h('div', { class: 'dv-export-act' },
      ui.btn({ label: 'Download filled form (PDF)', kind: 'primary', icon: '↓', onClick: function () {
        build().then(function (out) {
          if (U.isEmbedded || !U.download(fileName(), out, 'application/pdf')) U.toast('Downloads are blocked here. Open the portal in its own tab to download.', 'warn');
          else U.toast('Filled DIVA form downloaded.', 'ok');
        }).catch(function () { /* toast shown */ });
      } }),
      ui.btn({ label: 'Preview', kind: 'secondary', onClick: function () {
        build().then(function (out) {
          U.clear(pv);
          pv.appendChild(h('p', { class: 'hint' }, 'Preview of the filled pages (pages 5 to 19 hold the answers).'));
          var pages = h('div', { class: 'dv-pv-pages' });
          pv.appendChild(pages);
          return AA.pdfkit.preview(out, pages, { scale: 1.2, pages: [5, 14, 15, 16, 17, 18, 19] });
        }).catch(function () { /* toast shown */ });
      } }),
      ui.btn({ label: 'Open to print', kind: 'ghost', onClick: function () {
        build().then(function (out) {
          if (U.isEmbedded) { U.toast('Printing is blocked here. Open the portal in its own tab.', 'warn'); return; }
          try { var url = URL.createObjectURL(new Blob([out], { type: 'application/pdf' })); window.open(url, '_blank', 'noopener'); setTimeout(function () { URL.revokeObjectURL(url); }, 60000); }
          catch (e) { U.toast('The PDF could not be opened.', 'err'); }
        }).catch(function () { /* toast shown */ });
      } })), status, pv]);
    return box;
  }
  DV.exportPanel = exportPanel;

  /* The portal examples ticked, by item and life stage, for the "Other" boxes on the form. */
  function portalTicks(a) {
    var out = {};
    V.ITEMS.forEach(function (it) {
      var s = symData(it.id), r = obj(obj(a.symptoms)[it.id]);
      PERIODS.forEach(function (per) {
        var k = PL[per].k, ticks = obj(r['ex' + k]), labels = [];
        portalGroups(s, per).forEach(function (g) { g.items.forEach(function (t, i) { if (ticks[(g.ctx || 'x') + '.' + i]) labels.push(t); }); });
        if (labels.length) out[it.id + k] = labels;
      });
    });
    return out;
  }
  function portalImpTicks(a) {
    var out = {}, doms = arr(obj(AA.data.impairment).domains);
    PERIODS.forEach(function (per) {
      V.DOMAINS.forEach(function (dom) {
        var d = doms.filter(function (x) { return x.id === dom; })[0];
        var ticks = obj(obj(obj(obj(a.impairment)[per])[dom]).ex), items = arr(obj(d && d[per]).items), labels = [];
        Object.keys(ticks).forEach(function (k) { if (ticks[k] && items[+k]) labels.push(items[+k]); });
        if (labels.length) out[per + '.' + dom] = labels;
      });
    });
    return out;
  }
  DV.portalTicks = portalTicks;
})(window.AA);
