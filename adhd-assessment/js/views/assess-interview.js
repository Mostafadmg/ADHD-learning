/* Interview steps: inattention (ia), hyperactivity-impulsivity (hi), onset and impairment (onset)
   and collateral information (collateral). See ARCHITECTURE.md, section 6.
   These steps are used live while the patient is in the room, so every control writes straight to
   the store and then updates only the small parts of the page that depend on it (counts, hints,
   status pills). Ticking an example never re-renders the card, so scroll position and focus stay put.
   Routes: assess-<id>-ia (overview of the nine symptoms) and assess-<id>-ia-ia3 (one symptom); same for hi. */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui, D = AA.diagnosis;
  AA.steps = AA.steps || {};

  var SCORE_OPTS = [{ v: 'yes', l: 'Yes', kind: 'yes' }, { v: 'unsure', l: 'Unsure', kind: 'unsure' }, { v: 'no', l: 'No', kind: 'no' }];
  var YN = [{ v: 'yes', l: 'Yes', kind: 'yes' }, { v: 'no', l: 'No', kind: 'no' }];
  var YNU = [{ v: 'yes', l: 'Yes', kind: 'yes' }, { v: 'unsure', l: 'Unsure', kind: 'unsure' }, { v: 'no', l: 'No', kind: 'no' }];
  var INF_OPTS = [{ v: 'na', l: 'n/a', title: 'No informant has commented on this' }, { v: 0, l: '0 None', title: 'None or little support' },
    { v: 1, l: '1 Some', title: 'Some support' }, { v: 2, l: '2 Clear', title: 'Clear support' }];
  var SCORE_LABEL = { yes: 'Yes', unsure: 'Unsure', no: 'No' };
  var SCORE_KIND = { yes: 'ok', unsure: 'warn', no: 'neutral' };
  var INF_LABEL = { na: 'n/a', 0: 'none', 1: 'some', 2: 'clear' };
  var SPECIAL = [['women', 'Women and girls'], ['older', 'Older adults'], ['highIQ', 'High ability or high IQ'],
    ['sud', 'Substance use'], ['asd', 'Autism'], ['culture', 'Culture and language']];
  var PROBE_LABEL = { frequency: 'How often', severity: 'How severe', pervasive: 'In which settings', duration: 'How long',
    peers: 'Compared with others', impact: 'Impact', compensation: 'Coping and compensation', onset: 'When it started' };
  var SEV_DEFAULT = [{ v: 0, l: 'None' }, { v: 1, l: 'Mild' }, { v: 2, l: 'Moderate' }, { v: 3, l: 'Severe' }];

  /* Set when moving between symptoms, so the next card is scrolled into view and its title focused. */
  var focusCard = false;
  /* Set when leaving the last symptom, so the overview opens at the supplement question. */
  var focusSupplement = false;

  function imp() { return AA.data.impairment || {}; }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function nil(v) { return v === null ? undefined : v; }
  function has(v) { return v !== null && v !== undefined && v !== ''; }
  function size(o) { return o && typeof o === 'object' ? Object.keys(o).filter(function (k) { return o[k]; }).length : 0; }
  function symsOf(dim) { return arr(AA.data.symptoms).filter(function (s) { return s && s.dim === dim; }); }
  function code(s) { return (s.codes && s.codes.dsm5) || ''; }
  function label(s) { return (code(s) ? code(s) + ' ' : '') + (s.title || s.id); }
  function stateOf(r) { return r.adult && r.child ? 'done' : r.adult || r.child ? 'part' : 'todo'; }
  function scoreBadge(v) { return v && SCORE_LABEL[v] ? ui.badge(SCORE_LABEL[v], SCORE_KIND[v]) : h('span', { class: 'iv-none' }, 'Not scored'); }
  function ddxName(id) { var c = AA.byId('ddx', id); return c ? c.name : id; }
  function sevList() { var s = arr(imp().severity); return s.length ? s : SEV_DEFAULT; }
  function sevLabel(v) { var m = sevList().filter(function (x) { return x.v === v; })[0]; return m ? m.l : String(v); }

  /* Toggle one key in a flat map such as exA ({"work.0": true}). The keys contain dots, so the
     whole map is replaced (a copy, never the stored object) instead of writing a dotted path. */
  function toggleKey(ctx, path, key, on) {
    var cur = Object.assign({}, ctx.get(path, {}) || {});
    if (on) cur[key] = true; else delete cur[key];
    ctx.set(path, Object.keys(cur).length ? cur : undefined);
  }

  /* True when the arrow keys belong to the focused control (text fields, radios, tabs, dialogs). */
  function arrowsTaken(t) {
    if (!t || !t.closest) return false;
    if (t.closest('textarea, select, [contenteditable=""], [contenteditable="true"], [role="tab"], .dialog')) return true;
    if (t.tagName === 'INPUT') return !/^(checkbox|button|submit|reset)$/i.test(t.type || '');
    return false;
  }

  /* A visible label for a control whose accessible name is already set (ui.seg with hideLabel). */
  function qrow(text, control, extra) {
    return h('div', { class: 'iv-qrow' }, h('div', { class: 'iv-qrow-text' }, h('span', { 'aria-hidden': 'true' }, text), extra || null), h('div', { class: 'iv-qrow-ctl' }, control));
  }

  /* Details whose body is built on first open (for long lists that are rarely all needed). */
  function lazyDetails(summary, build, o) {
    o = o || {};
    var body = h('div');
    var built = false;
    var fill = function () { if (built) return; built = true; U.append(body, build()); };
    var d = ui.details(summary, body, { open: o.open, meta: o.meta, cls: o.cls, onToggle: function (open) { if (open) fill(); } });
    if (o.open) fill();
    return d;
  }
  function roomy() { try { return window.matchMedia('(min-width: 1000px)').matches; } catch (e) { return true; } }
  function setMeta(details, text) { var m = details && details.querySelector('.disclosure-meta'); if (m) m.textContent = text; }

  /* ===================================================================================
     Symptom interview (ia and hi share this renderer)
     =================================================================================== */
  function interviewStep(dim) {
    return { render: function (el, ctx) {
      var list = symsOf(dim);
      if (!list.length) {
        el.appendChild(ui.empty('Symptom content not loaded', 'The interview questions for this part are not available in this build.'));
        return null;
      }
      if (ctx.sub) {
        var idx = -1;
        list.forEach(function (s, i) { if (s.id === ctx.sub) idx = i; });
        if (idx > -1) return renderSymptom(el, ctx, list, idx);
        el.appendChild(ui.callout('warn', h('p', null, 'That symptom is not part of this section. Here is the overview instead.')));
      }
      return renderOverview(el, ctx, dim, list);
    } };
  }
  AA.steps.ia = interviewStep('IA');
  AA.steps.hi = interviewStep('HI');

  /* ---------- Overview: instructions, the nine symptoms, supplement question ---------- */
  function renderOverview(el, ctx, dim, list) {
    var key = dim.toLowerCase();
    var a = ctx.a() || {};
    var rec = a.symptoms || {};
    var need = D.need(a), ad = D.counts(a, 'adult'), ch = D.counts(a, 'child');
    var first = list.filter(function (s) { return stateOf(rec[s.id] || {}) !== 'done'; })[0];
    var started = list.some(function (s) { return stateOf(rec[s.id] || {}) !== 'todo'; });
    var wrap = h('div', { class: 'iv stack' });

    function tally(name, n, unsure, answered, of, thr, thrNote) {
      return h('div', { class: 'iv-tally-item' },
        h('p', { class: 'iv-tally-k' }, name),
        h('p', { class: 'iv-tally-v' }, h('span', { class: 'num' }, String(n)), h('small', null, ' of ' + of + ' present')),
        h('p', { class: 'hint' }, [unsure ? unsure + ' unsure' : null, of - answered ? (of - answered) + ' not scored' : null, thrNote + ' ' + thr].filter(Boolean).join(' · ')),
        n >= thr ? ui.badge('Threshold reached', 'ok') : null);
    }
    function openSym(sid) { focusCard = true; ctx.go(ctx.step, sid); }
    var cta = first
      ? ui.btn({ label: (started ? 'Continue with ' : 'Start with ') + label(first), kind: 'primary', onClick: function () { openSym(first.id); } })
      : ui.btn({ label: 'Review from ' + label(list[0]), kind: 'secondary', onClick: function () { openSym(list[0].id); } });
    var supNote = h('span', { class: 'iv-cta-sup', 'aria-live': 'polite' });
    function paintSupNote() {
      var sp = ctx.get('supplement', {}) || {};
      U.clear(supNote);
      supNote.appendChild(sp[key + 'Adult'] && sp[key + 'Child'] ? ui.badge('Supplement question answered', 'ok')
        : h('span', null, 'Next: answer the supplement question below.'));
    }

    wrap.appendChild(h('section', { class: 'card iv-intro' },
      h('h2', null, 'Progress in this part'),
      h('div', { class: 'iv-tally' },
        tally('Adulthood', ad[dim], ad['unsure' + dim], ad['answered' + dim], list.length, need, 'DSM-5-TR threshold'),
        tally('Childhood', ch[dim], ch['unsure' + dim], ch['answered' + dim], list.length, 6, 'DIVA convention')),
      h('div', { class: 'iv-cta' }, cta,
        first ? null : h('p', { class: 'iv-cta-note' }, ui.badge('All ' + list.length + ' symptoms scored', 'ok'), supNote)),
      ui.details('How to run this part', ui.list([
        'Adulthood means the last 6 months. Childhood means age 5 to 12.',
        'Look for long-standing traits, present most of the time. Problems that only appear during an episode of low mood, anxiety, stress or substance use do not count.',
        'Ask for real examples from the patient\'s own life. A general "yes, that\'s me" is not enough.',
        'Tick the examples the patient describes, note their own words, then score Yes, Unsure or No.',
        'Score Yes only when the problem is clearly more frequent or severe than in most people of the same age, and it causes difficulties.'
      ], 'list iv-rules'), { open: !started, cls: 'iv-howto' })));

    /* Symptom table: each row opens the symptom. On phones the rows stack into compact cards. */
    var tbody = h('tbody');
    list.forEach(function (s) {
      var r = rec[s.id] || {};
      var open = function () { openSym(s.id); };
      var flags = Object.keys(r.flags || {}).filter(function (k) { return r.flags[k]; }).map(ddxName);
      var inf = [];
      if (has(r.infA)) inf.push('Adult ' + INF_LABEL[r.infA]);
      if (has(r.infC)) inf.push('Child ' + INF_LABEL[r.infC]);
      var nA = size(r.exA), nC = size(r.exC);
      tbody.appendChild(h('tr', { class: 'iv-row is-' + stateOf(r), onclick: function (e) { if (!e.target.closest('button, a')) open(); } },
        h('td', { class: 'iv-code num' }, code(s)),
        h('th', { scope: 'row' },
          h('button', { type: 'button', class: 'iv-link', onclick: open }, s.title || s.id),
          nA || nC ? h('span', { class: 'iv-sub' }, 'Examples ticked: ' + nA + ' adult, ' + nC + ' child') : null),
        h('td', { 'data-label': 'Adult', class: 'iv-c-adult' }, scoreBadge(r.adult)),
        h('td', { 'data-label': 'Child', class: 'iv-c-child' }, scoreBadge(r.child)),
        h('td', { 'data-label': 'Informant', class: 'iv-c-inf' }, inf.length ? inf.join(', ') : h('span', { class: 'iv-none' }, 'Not rated')),
        h('td', { 'data-label': 'Differentials', class: 'iv-c-ddx' }, flags.length ? flags.join(', ') : h('span', { class: 'iv-none' }, 'None'))));
    });
    wrap.appendChild(h('section', { class: 'iv-sec' },
      h('h2', null, 'Symptoms in this part'),
      h('p', { class: 'hint' }, 'Select a symptom to open it. Scores update here as you go.'),
      h('div', { class: 'table-wrap iv-tablewrap' }, h('table', { class: 'table iv-table' },
        h('thead', null, h('tr', null, ['Code', 'Symptom', 'Adult', 'Child', 'Informant', 'Differentials flagged'].map(function (c) { return h('th', { scope: 'col' }, c); }))),
        tbody))));

    /* DIVA-style supplement question. */
    var sup = (imp().supplement || {})[key] || {};
    var supHead = h('h2', { tabindex: '-1' }, 'Supplement question');
    var supSec = h('section', { class: 'card iv-sup' }, supHead,
      h('p', { class: 'muted' }, 'Ask once the nine symptoms are done. It checks the overall picture: are these problems greater than in other people of the same age?'));
    [['adult', 'Adulthood', 'Adult'], ['child', 'Childhood (age 5-12)', 'Child']].forEach(function (p) {
      var path = 'supplement.' + key + p[2];
      supSec.appendChild(h('div', { class: 'iv-sup-item' },
        h('h3', null, p[1]),
        h('p', { class: 'iv-sup-q' }, sup[p[0]] || 'The supplement question is not available in this build. Ask whether these problems are greater than in others of the same age.'),
        ui.seg({ label: 'Supplement answer, ' + p[1].toLowerCase(), hideLabel: true, options: YN, value: ctx.get(path, null), onChange: function (v) { ctx.set(path, nil(v)); } })));
    });
    wrap.appendChild(supSec);
    el.appendChild(wrap);
    paintSupNote();
    ctx.onChange('supplement', paintSupNote);

    if (focusSupplement) {
      focusSupplement = false;
      setTimeout(function () {
        if (supSec.scrollIntoView) supSec.scrollIntoView({ block: 'start' });
        try { supHead.focus({ preventScroll: true }); } catch (e) { supHead.focus(); }
      }, 0);
    }
    return null;
  }

  /* ---------- One symptom ---------- */
  function renderSymptom(el, ctx, list, idx) {
    var s = list[idx];
    var base = 'symptoms.' + s.id;
    var rec = function () { return ctx.get(base, {}) || {}; };
    var r0 = rec();
    var prevS = list[idx - 1], nextS = list[idx + 1];
    var ready = false;
    var curTab = r0.adult && !r0.child ? 'child' : 'adult';
    var titleId = ui.nid('sx');

    function goTo(i) {
      if (i < 0) { ctx.go(ctx.step); return; }
      if (i >= list.length) { focusSupplement = true; ctx.go(ctx.step); return; }
      focusCard = true;
      ctx.go(ctx.step, list[i].id);
    }

    var root = h('article', { class: 'iv iv-sym', 'aria-labelledby': titleId });

    /* Header: codes, title, position and previous / next. */
    var codes = s.codes || {};
    var asrs = arr(codes.asrs);
    var title = h('h2', { class: 'iv-title', id: titleId, tabindex: '-1' }, s.title || s.id);
    root.appendChild(h('header', { class: 'iv-head' },
      h('div', { class: 'iv-head-main' },
        h('div', { class: 'iv-codes' },
          codes.dsm5 ? ui.badge('DSM-5-TR ' + codes.dsm5, 'accent') : null,
          codes.diva ? ui.badge('DIVA ' + codes.diva, 'neutral') : null,
          asrs.length ? ui.badge('ASRS ' + (asrs.length > 1 ? 'items ' : 'item ') + asrs.join(', '), 'neutral') : null),
        title),
      h('div', { class: 'iv-head-nav' },
        h('span', { class: 'iv-pos' }, (idx + 1) + ' of ' + list.length),
        ui.btn({ label: prevS ? '← Previous' : '← Overview', kind: 'ghost', small: true, aria: prevS ? 'Previous symptom: ' + label(prevS) : 'Back to the overview', onClick: function () { goTo(idx - 1); } }),
        ui.btn({ label: nextS ? 'Next →' : 'Summary →', kind: 'ghost', small: true, aria: nextS ? 'Next symptom: ' + label(nextS) : 'Supplement question and summary', onClick: function () { goTo(idx + 1); } }))));

    /* Symptom strip: jump to any symptom in this part; shows which are scored. */
    var chips = [];
    var strip = h('nav', { class: 'iv-strip', 'aria-label': 'Symptoms in this part' }, h('ol', null, list.map(function (x, i) {
      var b = h('button', { type: 'button', class: 'iv-chip', 'aria-current': i === idx ? 'true' : null, onclick: function () { if (i !== idx) goTo(i); } }, String(i + 1));
      chips.push(b);
      return h('li', null, b);
    })), h('button', { type: 'button', class: 'btn btn-quiet btn-sm', onclick: function () { ctx.go(ctx.step); } }, 'All symptoms'));
    function paintChip(i, r) {
      var st = stateOf(r || {});
      var b = chips[i];
      b.className = 'iv-chip is-' + st;
      var txt = { done: 'adult and child scored', part: 'partly scored', todo: 'not scored' }[st];
      b.setAttribute('aria-label', label(list[i]) + ', ' + txt + (i === idx ? ', current' : ''));
      b.title = label(list[i]) + ' (' + txt + ')';
    }
    var all = ctx.get('symptoms', {}) || {};
    list.forEach(function (x, i) { paintChip(i, all[x.id]); });
    root.appendChild(strip);
    root.appendChild(h('p', { class: 'hint iv-keys' }, 'Shortcut: press ', h('kbd', null, '←'), ' or ', h('kbd', null, '→'), ' to move between symptoms when you are not typing.'));

    /* Score panel: sticky under the step strip on large screens; a compact bar fixed to the bottom of the
       screen on phones and tablets, so the clinician can tick examples and score without scrolling back. */
    var nudge = { adult: h('p', { class: 'iv-nudge', 'aria-live': 'polite' }), child: h('p', { class: 'iv-nudge', 'aria-live': 'polite' }) };
    /* Adulthood first, then childhood, for every symptom (DIVA order). Switching shows the childhood question. */
    function showChild() { tabs.show('child'); if (root.scrollIntoView) root.scrollIntoView({ block: 'start' }); }
    var toChild = ui.btn({ label: 'Ask about childhood', kind: 'quiet', small: true, onClick: showChild });
    var cols = {};
    function scoreCol(p, long, short, extra) {
      var seg = ui.seg({ label: long, hideLabel: true, options: SCORE_OPTS, value: r0[p] || null, onChange: function (v) { ctx.set(base + '.' + p, nil(v)); sync(); } });
      cols[p] = h('div', { class: 'iv-score-col iv-sc-' + p },
        h('div', { class: 'iv-score-row' },
          h('span', { class: 'seg-label iv-score-lab', 'aria-hidden': 'true' }, h('span', { class: 'iv-l-long' }, long), h('span', { class: 'iv-l-short' }, short)),
          seg),
        h('div', { class: 'iv-status' }, nudge[p], extra || null));
      return cols[p];
    }
    /* Phone bar: once the adult score is set, the main button first leads to the childhood question. */
    var barNextAria = nextS ? 'Next symptom: ' + label(nextS) : 'Finish: supplement question and summary';
    var barLabel = h('span', null, nextS ? 'Next' : 'Finish');
    var barNext = h('button', { type: 'button', class: 'btn btn-primary iv-bar-next', 'aria-label': barNextAria, onclick: function () {
      if (barNext.getAttribute('data-child') === 'true') showChild(); else goTo(idx + 1);
    } }, barLabel, h('span', { 'aria-hidden': 'true' }, '→'));
    var score = h('section', { class: 'sx-score iv-score', 'aria-label': 'Score this symptom', 'data-tab': curTab },
      scoreCol('adult', 'Adulthood (last 6 months)', 'Adult'),
      scoreCol('child', 'Childhood (age 5-12)', 'Child', toChild),
      barNext);
    root.appendChild(score);

    /* Adulthood / Childhood tabs. Each tab is built once and kept, so filters and ticks survive switching. */
    var cache = {};
    var tabs = ui.tabs([
      { id: 'adult', label: ['Adulthood', h('span', { class: 'sr-only' }, ', examples ticked:')], count: size(r0.exA), render: function () { return cache.adult || (cache.adult = buildPeriod('adult')); } },
      { id: 'child', label: ['Childhood', h('span', { class: 'sr-only' }, ', examples ticked:')], count: size(r0.exC), render: function () { return cache.child || (cache.child = buildPeriod('child')); } }
    ], curTab, function (id) { curTab = id; score.setAttribute('data-tab', id); if (ready) sync(); });
    tabs.classList.add('iv-tabs');
    root.appendChild(tabs);

    function buildPeriod(p) {
      var isA = p === 'adult';
      var exKey = isA ? 'exA' : 'exC', otherKey = isA ? 'otherA' : 'otherC', infKey = isA ? 'infA' : 'infC';
      var r = rec();
      var ask = s.ask || {};
      var box = h('div', { class: 'iv-period' });

      box.appendChild(h('div', { class: 'sx-ask iv-ask' },
        h('span', { class: 'iv-ask-k' }, isA ? 'Ask about the last 6 months' : 'Ask about age 5 to 12'),
        h('span', { class: 'iv-ask-q' }, ask[p] || (isA ? 'Ask how this affects the patient now.' : 'Ask how this was in primary school.')),
        !isA && ask.adult ? h('span', { class: 'sx-ask-sub' }, 'Adult question, for context: ' + ask.adult) : null));
      if (arr(s.rephrase).length) box.appendChild(ui.details('Other ways to ask', ui.list(s.rephrase), { meta: String(s.rephrase.length) }));

      /* Examples checklist with filter. */
      var groups = arr(s.examples && s.examples[p]);
      var ticked = r[exKey] || {};
      var index = [];
      var query = '', onlyTicked = false;
      var empty = h('p', { class: 'hint', hidden: true }, 'No examples match. Clear the filter to see them all.');
      var exHost = h('div', { class: 'iv-examples' });
      groups.forEach(function (g) {
        var items = arr(g.items);
        var count = h('span', { class: 'iv-gcount' });
        var gi = { el: null, count: count, items: [] };
        var listEl = h('div', { class: 'ex-list' });
        items.forEach(function (t, i) {
          var k = (g.ctx || 'x') + '.' + i;
          var c = ui.check({ label: t, checked: !!ticked[k], onChange: function (on) { toggleKey(ctx, base + '.' + exKey, k, on); paintGroup(gi); if (onlyTicked) filter(); sync(); } });
          var it = { el: c, input: c.querySelector('input'), text: String(t).toLowerCase() };
          gi.items.push(it);
          listEl.appendChild(c);
        });
        /* Each area of life folds, so a phone shows a short index of areas instead of a very long list. */
        gi.el = h('details', { class: 'ex-group iv-exg', open: roomy() },
          h('summary', null, h('span', { class: 'iv-exg-t' }, g.label || g.ctx || 'Examples'), count, h('span', { class: 'iv-exg-n' }, U.plural(items.length, 'example'))),
          listEl);
        paintGroup(gi);
        index.push(gi);
        exHost.appendChild(gi.el);
      });
      function paintGroup(gi) {
        var n = gi.items.filter(function (x) { return x.input.checked; }).length;
        gi.count.textContent = n ? n + ' ticked' : '';
        gi.count.hidden = !n;
      }
      var filtering = false;
      function filter() {
        var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        var active = !!terms.length || onlyTicked;
        var shown = 0;
        /* While a filter is on, every area with a match opens; clearing it restores what was open before. */
        if (active && !filtering) index.forEach(function (gi) { gi.wasOpen = gi.el.open; });
        index.forEach(function (gi) {
          var n = 0;
          gi.items.forEach(function (x) {
            var ok = (!onlyTicked || x.input.checked) && terms.every(function (t) { return x.text.indexOf(t) > -1; });
            x.el.hidden = !ok;
            if (ok) n++;
          });
          gi.el.hidden = !n;
          if (active) gi.el.open = n > 0;
          else if (filtering) gi.el.open = !!gi.wasOpen;
          shown += n;
        });
        filtering = active;
        empty.hidden = shown > 0;
        empty.textContent = onlyTicked && !query ? 'Nothing ticked yet.' : 'No examples match. Clear the filter to see them all.';
      }
      var onlyBtn = h('button', { type: 'button', class: 'btn btn-ghost btn-sm iv-only', 'aria-pressed': 'false', onclick: function () {
        onlyTicked = !onlyTicked;
        onlyBtn.setAttribute('aria-pressed', onlyTicked ? 'true' : 'false');
        filter();
      } }, 'Ticked only');
      var search = ui.search('Filter examples', function (q) { query = q; filter(); });
      search.classList.add('iv-search');
      var total = groups.reduce(function (n, g) { return n + arr(g.items).length; }, 0);
      box.appendChild(h('div', { class: 'iv-ex-head' },
        h('h3', null, 'Examples'),
        h('p', { class: 'hint' }, total ? 'Tick what the patient describes. ' + total + ' examples in ' + groups.length + ' areas of life.' : 'No examples are available for this symptom in this build.')));
      if (total) {
        box.appendChild(h('div', { class: 'iv-tools' }, search, onlyBtn));
        box.appendChild(exHost);
        box.appendChild(empty);
      }

      /* Patient's own words. */
      box.appendChild(ui.field(isA ? 'Patient\'s own examples (adulthood)' : 'Patient\'s own examples (childhood)',
        ui.input({ rows: 3, value: r[otherKey] || '', placeholder: isA ? 'In their words: what happens, where, how often' : 'In their words, or what parents and teachers said',
          onSave: function (v) { ctx.set(base + '.' + otherKey, v.trim() ? v : undefined); sync(); } })));

      /* Informant agreement. */
      var inf = s.informant || {};
      var infBox = h('div', { class: 'iv-inf' },
        h('h3', null, 'Informant'),
        qrow(isA ? 'Does a partner or close friend confirm this?' : 'Does a parent or school report confirm this?',
          ui.seg({ label: (isA ? 'Adulthood' : 'Childhood') + ' informant support', hideLabel: true, options: INF_OPTS, value: has(r[infKey]) ? r[infKey] : null,
            onChange: function (v) { ctx.set(base + '.' + infKey, nil(v)); } }),
          h('span', { class: 'hint' }, '0 none or little, 1 some, 2 clear support. Use n/a if nobody has commented.')));
      if (isA && arr(inf.partner).length) infBox.appendChild(ui.details('Questions for a partner or close friend', ui.list(inf.partner), { meta: String(inf.partner.length) }));
      if (!isA && arr(inf.parent).length) infBox.appendChild(ui.details('Questions for a parent or older relative', ui.list(inf.parent), { meta: String(inf.parent.length) }));
      if (!isA && arr(inf.school).length) infBox.appendChild(ui.details('What to look for in school reports', ui.list(inf.school), { meta: String(inf.school.length) }));
      box.appendChild(infBox);
      return box;
    }

    /* Reference sections, collapsed. */
    var refs = h('div', { class: 'iv-refs' });

    if (arr(s.counts).length || arr(s.notCount).length || arr(s.anchors).length) {
      var scoreHelp = h('div', { class: 'stack' },
        h('div', { class: 'iv-rules-grid' },
          arr(s.counts).length ? h('div', { class: 'iv-rule iv-rule-yes' }, h('h3', null, 'Score Yes when'), ui.list(s.counts)) : null,
          arr(s.notCount).length ? h('div', { class: 'iv-rule iv-rule-no' }, h('h3', null, 'Do not count it when'), ui.list(s.notCount)) : null));
      if (arr(s.anchors).length) {
        scoreHelp.appendChild(h('div', null,
          h('h3', null, 'Calibration examples'),
          h('p', { class: 'hint' }, 'Realistic answers and how to score them.'),
          h('div', { class: 'iv-anchors' }, s.anchors.map(function (an) {
            return h('div', { class: 'iv-anchor iv-anchor-' + (an.score || 'x') },
              h('p', { class: 'iv-anchor-score' }, 'Score: ', scoreBadge(an.score)),
              h('blockquote', null, an.quote),
              h('p', { class: 'iv-anchor-why' }, an.why));
          }))));
      }
      refs.appendChild(ui.details('How to score this symptom', scoreHelp));
    }

    if (arr(s.probes).length) {
      refs.appendChild(ui.details('Probe further', h('div', { class: 'iv-probes' }, s.probes.map(function (pr) {
        return h('div', { class: 'iv-probe' }, h('h3', null, pr.label && pr.label !== pr.k ? pr.label : (PROBE_LABEL[pr.k] || pr.label || pr.k)), ui.list(arr(pr.items)));
      })), { meta: 'Frequency, settings, impact' }));
    }

    if (arr(s.mimics).length) {
      var flagMeta = function () { var n = size(rec().flags); return n ? n + ' flagged' : String(s.mimics.length) + ' to consider'; };
      var mimicBox = h('div', { class: 'iv-mimics' }, h('p', { class: 'hint' }, 'Flagged conditions are listed for review in the differential diagnosis step.'));
      var mimicDet = ui.details('Could it be something else?', mimicBox, { meta: flagMeta() });
      s.mimics.forEach(function (m) {
        var btn = h('button', { type: 'button', class: 'btn btn-ghost btn-sm iv-flag' });
        var paint = function (on) {
          btn.setAttribute('aria-pressed', on ? 'true' : 'false');
          U.clear(btn);
          U.append(btn, [h('span', { class: 'iv-flag-box', 'aria-hidden': 'true' }, on ? '✓' : ''), on ? 'Flagged for differential review' : 'Flag for differential review']);
        };
        paint(!!(rec().flags || {})[m.ddx]);
        btn.addEventListener('click', function () {
          var on = btn.getAttribute('aria-pressed') !== 'true';
          ctx.set(base + '.flags.' + m.ddx, on ? true : undefined);
          paint(on);
          setMeta(mimicDet, flagMeta());
        });
        mimicBox.appendChild(h('div', { class: 'iv-mimic' },
          h('div', { class: 'iv-mimic-head' },
            h('h3', null, h('a', { href: '#cond-' + m.ddx, 'data-go': 'cond-' + m.ddx }, ddxName(m.ddx))),
            btn),
          m.clue ? h('p', null, h('strong', null, 'Points to it: '), m.clue) : null,
          m.ask ? h('p', { class: 'iv-mimic-ask' }, h('strong', null, 'Ask: '), m.ask) : null));
      });
      refs.appendChild(mimicDet);
    }

    var sp = s.special || {};
    var spRows = SPECIAL.filter(function (x) { return sp[x[0]]; });
    if (spRows.length) {
      refs.appendChild(ui.details('Special populations', h('dl', { class: 'iv-dl iv-dl-grid' }, spRows.map(function (x) {
        return h('div', null, h('dt', null, x[1]), h('dd', null, sp[x[0]]));
      }))));
    }

    var what = [['Criterion (paraphrased)', s.criterion], ['How it shows in adults', s.adultForm], ['What underlies it', s.why]].filter(function (x) { return x[1]; });
    if (what.length) {
      refs.appendChild(ui.details('What this symptom is', h('div', null,
        h('dl', { class: 'iv-dl' }, what.map(function (x) { return [h('dt', null, x[0]), h('dd', null, x[1])]; })),
        arr(s.refs).length ? ui.source(s.refs.join('; ')) : null)));
    }
    root.appendChild(refs);

    root.appendChild(ui.field('Notes on this symptom', ui.input({ rows: 3, value: r0.notes || '', placeholder: 'Anything to remember for the report',
      onSave: function (v) { ctx.set(base + '.notes', v.trim() ? v : undefined); } })));

    /* Bottom navigation. */
    root.appendChild(h('div', { class: 'iv-foot' },
      ui.btn({ label: prevS ? '← Previous symptom' : '← Overview', kind: 'ghost', onClick: function () { goTo(idx - 1); } }),
      h('div', { class: 'iv-foot-next' },
        nextS ? h('span', { class: 'hint' }, 'Up next: ' + label(nextS)) : null,
        ui.btn({ label: nextS ? 'Next symptom →' : 'Supplement question and summary →', kind: 'primary', onClick: function () { goTo(idx + 1); } }))));

    el.appendChild(root);

    /* Small, local updates after any change on this card. */
    function sync() {
      var r = rec();
      ['adult', 'child'].forEach(function (p) {
        var isA = p === 'adult';
        var n = size(r[isA ? 'exA' : 'exC']);
        var own = !!(r[isA ? 'otherA' : 'otherC'] || '').trim();
        var v = r[p];
        var el2 = nudge[p];
        var msg = '', warn = false;
        if (!v && n) { msg = U.plural(n, 'example') + ' ticked. Now choose a score.'; warn = true; }
        else if (v === 'yes' && !n && !own) { msg = 'Scored Yes, but no example recorded yet.'; warn = true; }
        else if (n) msg = U.plural(n, 'example') + ' ticked.';
        el2.textContent = msg;
        el2.classList.toggle('is-warn', warn);
        el2.hidden = !msg;
        cols[p].classList.toggle('is-warn', warn);
      });
      /* Space for the status line is reserved in CSS, so these never shift the content below. */
      var askChild = !!(r.adult && !r.child && curTab === 'adult');
      toChild.hidden = !askChild || !nudge.child.hidden;
      barNext.setAttribute('data-child', askChild ? 'true' : 'false');
      barNext.setAttribute('aria-label', askChild ? 'Ask about childhood for this symptom' : barNextAria);
      barLabel.textContent = askChild ? 'Child' : nextS ? 'Next' : 'Finish';
      var tabBtns = U.$$('.tab', tabs);
      [size(r.exA), size(r.exC)].forEach(function (n, i) {
        var c = tabBtns[i] && tabBtns[i].querySelector('.tab-count');
        if (c) c.textContent = String(n);
      });
      paintChip(idx, r);
    }
    ready = true;
    sync();

    /* Arrow keys move between symptoms when focus is not in a field that uses them. */
    var onKey = function (e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (arrowsTaken(e.target) || document.querySelector('.dialog-backdrop')) return;
      e.preventDefault();
      goTo(idx + (e.key === 'ArrowRight' ? 1 : -1));
    };
    document.addEventListener('keydown', onKey);

    /* Open with the card in view (the page heading and step guide sit above it). When moving between
       symptoms, focus also moves to the new title. */
    var moveFocus = focusCard;
    focusCard = false;
    setTimeout(function () {
      if (!root.isConnected) return;
      if (root.scrollIntoView) root.scrollIntoView({ block: 'start' });
      if (moveFocus) { try { title.focus({ preventScroll: true }); } catch (e) { title.focus(); } }
    }, 0);
    return function () { document.removeEventListener('keydown', onKey); };
  }

  /* ===================================================================================
     Onset and impairment (criteria B, C and D)
     =================================================================================== */
  AA.steps.onset = { render: function (el, ctx) {
    var I = imp(), on = I.onset || {}, dur = I.duration || {};
    var o0 = ctx.get('onset', {}) || {};
    var wrap = h('div', { class: 'iv stack' });

    /* ---------- Onset ---------- */
    var asks = arr(on.ask);
    var ageIn = ui.input({ type: 'number', inputmode: 'numeric', min: '0', max: '90', value: o0.ageOnset || '', placeholder: 'Age',
      onSave: function (v) { ctx.set('onset.ageOnset', String(v).trim() ? String(v).trim() : undefined); } });
    ageIn.classList.add('iv-age');
    ageIn.setAttribute('aria-label', 'Age when the symptoms started');
    var ageRow = qrow('Age when they started', ageIn, h('span', { class: 'hint' }, 'Best estimate. Use school years or life events to anchor it.'));
    ageRow.hidden = o0.always !== 'no';

    var late = arr(on.lateOnset);
    var lateBox = ui.callout('warn', h('div', null,
      h('p', null, 'Symptoms that start after childhood need a careful search for another cause before ADHD is considered.'),
      late.length ? ui.list(late) : null), 'Onset after age 12: take care');
    lateBox.hidden = o0.before12 !== 'no';

    var bBox = h('div', { class: 'iv-crit', 'aria-live': 'polite' });
    /* A later age at onset and "Yes" before 12 contradict each other: ask the clinician to check. */
    var ageWarn = h('p', { class: 'iv-nudge is-warn', 'aria-live': 'polite', hidden: true });
    function paintB() {
      var oc = ctx.get('onset', {}) || {}, n = parseInt(oc.ageOnset, 10);
      ageWarn.textContent = oc.always === 'no' && !isNaN(n) && n >= 12 && oc.before12 === 'yes'
        ? 'Age at onset is ' + n + ', but "several symptoms before age 12" is Yes. Check which is right: symptoms are often present earlier and only cause problems later.' : '';
      ageWarn.hidden = !ageWarn.textContent;
      var b = D.criterionB(ctx.a() || {});
      U.clear(bBox);
      U.append(bBox, [h('div', { class: 'iv-crit-head' }, h('strong', null, 'Criterion B · several symptoms before age 12'), ui.statusPill(b.status)), h('p', { class: 'hint' }, b.detail)]);
    }

    var onsetCard = h('section', { class: 'card iv-onset' },
      h('h2', null, 'Onset (criterion B)'),
      on.intro ? ui.details('About criterion B', h('p', { class: 'iv-intro-p' }, on.intro), { cls: 'iv-about' }) : null,
      asks.length ? h('div', { class: 'iv-asks' },
        h('h3', null, 'Questions to ask'),
        ui.list(asks.slice(0, 6), 'list iv-asklist'),
        asks.length > 6 ? ui.details('More onset questions', ui.list(asks.slice(6), 'list iv-asklist'), { meta: String(asks.length - 6) }) : null) : null,
      arr(on.memoryAids).length ? ui.details('Memory aids', ui.list(on.memoryAids), { meta: 'Help the patient date it' }) : null,
      h('div', { class: 'iv-qrows' },
        qrow('Have the symptoms always been there?', ui.seg({ label: 'Have the symptoms always been there?', hideLabel: true, options: YN, value: o0.always || null,
          onChange: function (v) { ctx.set('onset.always', nil(v)); ageRow.hidden = v !== 'no'; } })),
        ageRow,
        ageWarn,
        qrow('Were several symptoms present before age 12?', ui.seg({ label: 'Were several symptoms present before age 12?', hideLabel: true, options: YNU, value: o0.before12 || null,
          onChange: function (v) { ctx.set('onset.before12', nil(v)); lateBox.hidden = v !== 'no'; } }),
          h('span', { class: 'hint' }, 'DSM-5-TR needs several symptoms before age 12, not a diagnosis at that age.')),
        lateBox,
        qrow('Have the symptoms lasted at least 6 months?', ui.seg({ label: 'Have the symptoms lasted at least 6 months?', hideLabel: true, options: YN, value: o0.duration6m || null,
          onChange: function (v) { ctx.set('onset.duration6m', nil(v)); } }),
          h('span', { class: 'hint' }, 'Criterion A needs symptoms for at least 6 months.'))),
      arr(dur.ask).length ? ui.details('Questions about duration', ui.list(dur.ask)) : null,
      bBox,
      arr(on.pitfalls).length ? ui.details('Common pitfalls when dating onset', ui.list(on.pitfalls)) : null,
      ui.field('Notes on onset', ui.input({ rows: 2, value: o0.notes || '', placeholder: 'What the patient and informants said about when it started',
        onSave: function (v) { ctx.set('onset.notes', v.trim() ? v : undefined); } })));
    if (!I.onset) onsetCard.insertBefore(ui.callout('info', h('p', null, 'Onset questions are not loaded in this build. You can still record the answers.')), onsetCard.children[1]);
    wrap.appendChild(onsetCard);
    paintB();

    /* ---------- Impairment ---------- */
    var doms = arr(I.domains);
    var sevs = sevList();
    var sumBox = h('div', { class: 'iv-imp-sum', 'aria-live': 'polite' });
    function stats(a, p) {
      var list = D.impairment(a, p);
      var rated = list.filter(function (x) { return x.sev !== null; });
      var hit = rated.filter(function (x) { return x.sev >= 1; });
      var worst = rated.reduce(function (m, x) { return Math.max(m, x.sev); }, -1);
      return { of: list.length, rated: rated.length, hit: hit, worst: worst };
    }
    function paintSum() {
      var a = ctx.a() || {};
      var C = D.criterionC(a), Dd = D.criterionD(a);
      U.clear(sumBox);
      var per = h('div', { class: 'iv-imp-grid' }, [['adult', 'Adulthood'], ['child', 'Childhood and adolescence']].map(function (p) {
        var st = stats(a, p[0]);
        return h('div', { class: 'iv-imp-per' },
          h('p', { class: 'iv-imp-k' }, p[1]),
          h('p', null, h('strong', { class: 'num' }, st.hit.length + ' of ' + st.of), ' areas affected (mild or worse)'),
          st.hit.length ? h('p', { class: 'hint' }, st.hit.map(function (x) { return x.label; }).join(', ')) : null,
          h('p', { class: 'iv-imp-worst' }, 'Worst: ', st.worst < 0 ? h('span', { class: 'iv-none' }, 'not rated') : ui.sevChip(st.worst, sevLabel(st.worst)),
            st.rated < st.of ? h('span', { class: 'hint' }, ' · ' + (st.of - st.rated) + ' not rated') : null));
      }));
      sumBox.appendChild(per);
      sumBox.appendChild(h('ul', { class: 'iv-crit-list' },
        h('li', null, h('div', { class: 'iv-crit-head' }, h('strong', null, 'Criterion C · two or more settings'), ui.statusPill(C.status)), h('p', { class: 'hint' }, C.detail)),
        h('li', null, h('div', { class: 'iv-crit-head' }, h('strong', null, 'Criterion D · clear impairment'), ui.statusPill(Dd.status)), h('p', { class: 'hint' }, Dd.detail))));
      sumBox.appendChild(h('p', { class: 'iv-nice' }, h('strong', null, 'NICE threshold: '),
        'NICE NG87 asks for symptoms that cause at least moderate impairment and are pervasive, in two or more important settings such as work and home. Mild problems alone do not meet it.'));
    }

    var cache = {};
    function ratedCount(p) { var a = ctx.a() || {}; return stats(a, p).rated + '/' + doms.length; }
    var tabs = ui.tabs([
      { id: 'adult', label: ['Adulthood', h('span', { class: 'sr-only' }, ', areas rated:')], count: ratedCount('adult'), render: function () { return cache.adult || (cache.adult = buildImpair('adult')); } },
      { id: 'child', label: ['Childhood and adolescence', h('span', { class: 'sr-only' }, ', areas rated:')], count: ratedCount('child'), render: function () { return cache.child || (cache.child = buildImpair('child')); } }
    ], 'adult');
    tabs.classList.add('iv-tabs');

    function buildImpair(p) {
      var box = h('div', { class: 'stack iv-doms' });
      if (!doms.length) { box.appendChild(ui.empty('Impairment areas not loaded', 'The impairment content is not available in this build.')); return box; }
      box.appendChild(h('p', { class: 'hint' }, p === 'adult'
        ? 'Rate each area for the last 6 months. Ask what happens, how often and what it costs the patient.'
        : 'Rate each area for childhood and the teenage years, using the patient\'s memories, informants and school reports.'));
      doms.forEach(function (d) { box.appendChild(domainCard(d, p)); });
      return box;
    }

    function domainCard(d, p) {
      var dp = d[p] || {};
      var base = 'impairment.' + p + '.' + d.id;
      var cur = ctx.get(base, {}) || {};
      var anchors = dp.anchors || {};
      var badge = h('span', { class: 'iv-dom-badge' });
      var anchorBox = h('p', { class: 'iv-anchor-text', 'aria-live': 'polite' });
      function paint(v) {
        U.clear(badge);
        badge.appendChild(has(v) ? ui.sevChip(v, sevLabel(v)) : ui.badge('Not rated', 'neutral'));
        U.clear(anchorBox);
        anchorBox.classList.toggle('is-empty', !has(v));
        if (!has(v)) { anchorBox.textContent = 'Choose a level to see what it looks like in this area.'; return; }
        var gen = sevList().filter(function (x) { return x.v === v; })[0] || {};
        U.append(anchorBox, [h('strong', null, sevLabel(v) + ': '), anchors[v] || gen.d || '']);
      }
      var seg = ui.seg({ label: 'Severity, ' + (d.label || d.id), hideLabel: true, options: sevs.map(function (x) { return { v: x.v, l: x.v + ' ' + x.l }; }),
        value: typeof cur.sev === 'number' ? cur.sev : null,
        onChange: function (v) { ctx.set(base + '.sev', nil(v)); paint(v); } });
      seg.classList.add('iv-seg-grid');
      var items = arr(dp.items);
      var exDet = null;
      var exMeta = function () { var n = size((ctx.get(base, {}) || {}).ex); return n ? n + ' ticked' : items.length + ' examples'; };
      if (items.length) {
        exDet = lazyDetails('Examples to tick', function () {
          var ex = (ctx.get(base, {}) || {}).ex || {};
          return h('div', { class: 'ex-list' }, items.map(function (t, i) {
            return ui.check({ label: t, checked: !!ex[i], onChange: function (onn) { ctx.set(base + '.ex.' + i, onn ? true : undefined); setMeta(exDet, exMeta()); } });
          }));
        }, { meta: exMeta() });
      }
      var levels = sevs.filter(function (x) { return anchors[x.v]; });
      var card = h('section', { class: 'card iv-dom', 'aria-label': d.label },
        h('div', { class: 'iv-dom-head' }, h('h3', null, d.label || d.id), badge),
        h('div', { class: 'seg-field' }, h('span', { class: 'seg-label', 'aria-hidden': 'true' }, 'Severity'), seg),
        anchorBox,
        d.why ? ui.details('About this area', h('p', { class: 'iv-dom-why' }, d.why)) : null,
        arr(dp.ask).length ? ui.details('Questions to ask', ui.list(dp.ask), { meta: String(dp.ask.length) }) : null,
        exDet,
        levels.length ? ui.details('What each level means here', h('dl', { class: 'iv-dl' }, levels.map(function (x) {
          return [h('dt', null, x.v + ' ' + x.l), h('dd', null, anchors[x.v])];
        }))) : null,
        ui.field('Notes on ' + String(d.label || d.id).toLowerCase(), ui.input({ rows: 2, value: cur.notes || '',
          onSave: function (v) { ctx.set(base + '.notes', v.trim() ? v : undefined); } })));
      if (!d[p]) card.appendChild(h('p', { class: 'hint' }, 'No prompts for this period in this build. You can still rate it.'));
      paint(typeof cur.sev === 'number' ? cur.sev : null);
      return card;
    }

    function paintTabCounts() {
      var btns = U.$$('.tab', tabs);
      ['adult', 'child'].forEach(function (p, i) {
        var c = btns[i] && btns[i].querySelector('.tab-count');
        if (c) c.textContent = ratedCount(p);
      });
    }

    wrap.appendChild(h('section', { class: 'iv-sec iv-imp' },
      h('h2', null, 'Impairment (criteria C and D)'),
      h('p', { class: 'muted' }, 'How much the symptoms get in the way, and where. Rate adulthood and childhood separately.'),
      sumBox, tabs));
    paintSum();

    ctx.onChange('onset', paintB);
    ctx.onChange('impairment', function () { paintSum(); paintTabCounts(); });
    el.appendChild(wrap);
    return null;
  } };

  /* ===================================================================================
     Collateral information
     =================================================================================== */
  AA.steps.collateral = { render: function (el, ctx) {
    var C = imp().collateral || {};
    var rating = arr(C.rating).length ? C.rating : [{ v: 0, l: 'None or little support' }, { v: 1, l: 'Some support' }, { v: 2, l: 'Clear support' }];
    var a = ctx.a() || {};
    var c0 = a.collateral || {};
    var pat = a.patient || {};
    var inf = pat.informants || {}, srcs = pat.sources || {};
    var wrap = h('div', { class: 'iv stack' });

    wrap.appendChild(h('div', { class: 'iv-col-intro' },
      h('p', { class: 'iv-lead' }, 'Rate how far each source supports the history: a parent or older relative for childhood, a partner or close friend for now, and school reports. Use n/a when a source is not available.'),
      C.intro ? ui.details('Why collateral matters', h('p', { class: 'iv-intro-p' }, C.intro), { cls: 'iv-about' }) : null));

    function ratingCtl(k, name) {
      var desc = h('p', { class: 'hint iv-rate-desc', 'aria-live': 'polite' });
      var paint = function (v) {
        var m = rating.filter(function (x) { return x.v === v; })[0];
        desc.textContent = v === 'na' ? 'Not available: no one to ask, or not yet obtained.' : m ? (m.d || '') : 'Not rated yet.';
        desc.hidden = !desc.textContent;
      };
      var val = has(c0[k]) ? c0[k] : null;
      paint(val);
      var seg = ui.seg({ label: name + ': support for the history', hideLabel: true,
        options: [{ v: 'na', l: 'n/a', title: 'Not available' }].concat(rating.map(function (x) { return { v: x.v, l: x.v + ' · ' + x.l, title: x.d }; })),
        value: val, onChange: function (v) { ctx.set('collateral.' + k, nil(v)); paint(v); } });
      seg.classList.add('iv-seg-stack');
      return h('div', { class: 'iv-rate' }, h('span', { class: 'seg-label', 'aria-hidden': 'true' }, 'Support for the history'), seg, desc);
    }

    function checkList(items, keyOf, textOf, summary, metaWord, hint) {
      var answers = c0.answers || {};
      var det = null;
      var meta = function () {
        var cur = ctx.get('collateral.answers', {}) || {};
        var n = items.filter(function (x, i) { return cur[keyOf(x, i)]; }).length;
        return n + ' of ' + items.length + ' ' + metaWord;
      };
      det = ui.details(summary, h('div', null, h('p', { class: 'hint iv-col-hint' }, hint), h('div', { class: 'ex-list iv-col-list' }, items.map(function (x, i) {
        var k = keyOf(x, i);
        return ui.check({ label: textOf(x), checked: !!answers[k], onChange: function (on) { ctx.set('collateral.answers.' + k, on ? true : undefined); setMeta(det, meta()); } });
      }))), { meta: meta() });
      return det;
    }

    function sourceCard(k, title, sec, setupNote) {
      sec = sec || {};
      var qs = arr(sec.questions).filter(function (q) { return q && q.k; });
      return h('section', { class: 'card iv-src' },
        h('div', { class: 'iv-src-head' }, h('h3', null, title), setupNote ? ui.badge(setupNote, 'info') : null),
        sec.intro ? h('p', { class: 'muted' }, sec.intro) : null,
        ui.field('Who gave the information', ui.input({ value: ctx.get('collateral.who.' + k, ''), placeholder: k === 'parent' ? 'e.g. mother, by phone' : 'e.g. partner of 6 years, in clinic',
          onSave: function (v) { ctx.set('collateral.who.' + k, v.trim() ? v : undefined); } })),
        ratingCtl(k, title),
        qs.length ? checkList(qs, function (q) { return q.k; }, function (q) { return q.q; }, 'Questions to ask', 'confirmed', 'Tick each question the informant confirms. Leave it blank if not asked or not confirmed.') : null);
    }

    var parentNote = inf.parent ? 'Parent available (setup)' : inf.sibling ? 'Sibling available (setup)' : null;
    var school = C.school || {};
    var look = arr(school.lookFor);
    wrap.appendChild(h('section', { class: 'iv-sec stack' },
      h('h2', null, 'Sources'),
      sourceCard('parent', 'Parent or older relative (childhood)', C.parent, parentNote),
      sourceCard('partner', 'Partner or close friend (adulthood)', C.partner, inf.partner ? 'Partner available (setup)' : null),
      h('section', { class: 'card iv-src' },
        h('div', { class: 'iv-src-head' }, h('h3', null, 'School reports'), srcs.schoolReports ? ui.badge('Reports available (setup)', 'info') : null),
        school.intro ? h('p', { class: 'muted' }, school.intro) : null,
        ratingCtl('school', 'School reports'),
        look.length ? checkList(look, function (x, i) { return 'school_' + i; }, function (x) { return x; }, 'Phrases to look for', 'found', 'Tick each phrase, or one with the same meaning, that you find in the reports.') : null,
        arr(school.caution).length ? ui.callout('warn', ui.list(school.caution), 'Read reports with care') : null)));

    /* Live summary. */
    var sumBox = h('div', { class: 'iv-col-live', 'aria-live': 'polite' });
    var LEVEL = {
      clear: ['Clear support', 'ok', 'At least one source clearly supports the history. This strengthens the diagnosis.'],
      some: ['Some support', 'info', 'Sources partly support the history. Note where they agree and where they do not.'],
      none: ['Little or no support', 'warn', 'The sources rated do not support the history. Explore why before relying on self-report alone.'],
      unavailable: ['No source rated', 'neutral', 'No informant or report rated yet. If none can be obtained, record why and how you weighed the self-report.']
    };
    function paintSum() {
      var cur = ctx.a() || {};
      var res = D.collateral(cur);
      var L = LEVEL[res.level] || LEVEL.unavailable;
      var cc = cur.collateral || {};
      var show = function (v) { return v === 'na' ? 'Not available' : typeof v === 'number' ? v + ' · ' + ((rating.filter(function (x) { return x.v === v; })[0] || {}).l || '') : 'Not rated'; };
      U.clear(sumBox);
      U.append(sumBox, [
        h('p', { class: 'iv-col-level' }, ui.badge(L[0], L[1]), h('span', null, L[2])),
        h('dl', { class: 'iv-dl iv-dl-inline' },
          h('dt', null, 'Parent or relative'), h('dd', null, show(cc.parent)),
          h('dt', null, 'Partner or friend'), h('dd', null, show(cc.partner)),
          h('dt', null, 'School reports'), h('dd', null, show(cc.school)))
      ]);
    }
    paintSum();
    wrap.appendChild(h('section', { class: 'card iv-col-sum' },
      h('h2', null, 'Overall collateral support'), sumBox));

    wrap.appendChild(h('div', null,
      arr(C.discrepancy).length ? ui.details('When informants disagree', ui.list(C.discrepancy)) : null,
      arr(C.noInformant).length ? ui.details('No informant available', ui.list(C.noInformant)) : null));

    wrap.appendChild(ui.field('Notes on collateral information', ui.input({ rows: 3, value: c0.notes || '', placeholder: 'Who was contacted, what they said, how reliable it seems',
      onSave: function (v) { ctx.set('collateral.notes', v.trim() ? v : undefined); } })));

    if (!imp().collateral) wrap.insertBefore(ui.callout('info', h('p', null, 'Collateral guidance is not loaded in this build. You can still record the ratings.')), wrap.firstChild);
    ctx.onChange('collateral', paintSum);
    el.appendChild(wrap);
    return null;
  } };
})(window.AA);
