/* Tools library, tool reference cards with practice scoring, and the assessment pathway.
   Routes: "tools", "tool-<id>" and "pathway[-<stageId>]" (see ARCHITECTURE.md, section 6).
   All clinical content comes from AA.data.tools, AA.data.pathway, AA.data.guidelines and AA.data.ddx;
   this file only arranges it. Per-clinician state lives in AA.progress: 'libraryFilters' (the tools
   page filters) and 'sandbox.<toolId>' (practice answers, never linked to a patient). */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui;

  /* Tool groups in display order (ARCHITECTURE.md 5.4). Unknown groups fall back to "Other". */
  var GROUPS = [
    ['adhd-screen', 'ADHD screening'], ['adhd-childhood', 'Childhood recall'], ['adhd-impairment', 'Impairment'],
    ['adhd-interview', 'Diagnostic interviews'], ['adhd-rating', 'ADHD rating scales'], ['mood', 'Depression'],
    ['bipolar', 'Bipolar'], ['anxiety', 'Anxiety'], ['trauma', 'Trauma'], ['substance', 'Alcohol and drugs'],
    ['autism', 'Autism'], ['personality', 'Personality'], ['psychosis', 'Psychosis'], ['sleep', 'Sleep'], ['risk', 'Risk'],
    ['cognition', 'Cognition'], ['child', 'Children and adolescents'], ['objective', 'Objective tests'],
    ['validity', 'Symptom validity'], ['other', 'Other']
  ];
  var GROUP_NAME = {};
  GROUPS.forEach(function (g) { GROUP_NAME[g[0]] = g[1]; });
  function groupKey(t) { return GROUP_NAME[t.group] ? t.group : 'other'; }
  function groupName(id) { return GROUP_NAME[id] || GROUP_NAME.other; }

  /* Readable stage names for ids that the pathway data does not (yet) describe. */
  var STAGE_FALLBACK = {
    referral: 'Referral', pre: 'Before the appointment', interview: 'Diagnostic interview', collateral: 'Collateral history',
    comorbid: 'Co-occurring conditions', risk: 'Safety and risk', physical: 'Physical health', diagnosis: 'Diagnosis and feedback',
    followup: 'Follow-up'
  };

  /* PCL-5 symptom clusters (DSM-5 PTSD criteria B-E) and how many endorsed items each needs (as in AA.scoring). */
  var CLUSTERS = [['B', 'Intrusion', 1], ['C', 'Avoidance', 1], ['D', 'Negative changes in thinking and mood', 2], ['E', 'Arousal and reactivity', 2]];

  /* ---------- Data helpers (never throw on missing or partial data) ---------- */

  function allTools() { return (AA.data.tools || []).filter(function (t) { return t && t.id; }); }
  function arr(x) { return Array.isArray(x) ? x.filter(function (v) { return v !== null && v !== undefined && v !== ''; }) : (x ? [x] : []); }
  function stagesOf(t) { return arr(t && t.stage); }
  function scorable(t) { return !!(t && t.interactive !== false && t.items && t.items.length); }
  function byN(a, b) { return (typeof a.n === 'number' ? a.n : 99) - (typeof b.n === 'number' ? b.n : 99); }
  function pathway() { return (AA.data.pathway || []).filter(function (s) { return s && s.id; }).slice().sort(byN); }
  function stageById(id) { var p = pathway(); for (var i = 0; i < p.length; i++) if (p[i].id === id) return p[i]; return null; }
  function stageName(id) { var s = stageById(id); return (s && s.title) || STAGE_FALLBACK[id] || id; }
  function stageLabel(id) { var s = stageById(id); return (s && typeof s.n === 'number' ? s.n + '. ' : '') + stageName(id); }
  function toolLabel(t) { return t.abbr || t.id; }
  function itemsText(t) {
    var n = t.items_n || (t.items && t.items.length) || 0;
    return n ? U.plural(n, 'item') : null;
  }
  function inStage(t, s) { return arr(s.tools).indexOf(t.id) > -1 || stagesOf(t).indexOf(s.id) > -1; }
  function condsFor(id) {
    return (AA.data.ddx || []).filter(function (c) { return c && c.id && arr(c.screen).indexOf(id) > -1; });
  }
  function itemOf(t, n) { return (t.items || []).filter(function (x) { return x.n === n; })[0] || null; }
  function optsOf(t, it) { return (it && it.opts) || t.options || []; }
  function optLabel(t, it, v) { var o = optsOf(t, it).filter(function (x) { return x.v === v; })[0]; return o ? o.l : String(v); }

  /* Score with empty answers to learn the range (max, number of items). Null when the tool cannot be scored. */
  function blankScore(t) {
    if (!scorable(t)) return null;
    try { return AA.scoring.score(t, {}); } catch (e) { return null; }
  }

  /* "1-6, 9, 12" from a list of item numbers. */
  function ranges(nums) {
    var list = arr(nums).filter(function (n) { return typeof n === 'number'; }).slice().sort(function (a, b) { return a - b; });
    var out = [], i = 0;
    while (i < list.length) {
      var j = i;
      while (j + 1 < list.length && list[j + 1] === list[j] + 1) j++;
      out.push(j > i + 1 ? list[i] + '–' + list[j] : j === i + 1 ? list[i] + ', ' + list[j] : String(list[i]));
      i = j + 1;
    }
    return out.join(', ');
  }

  function hostOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return String(url); }
  }
  function safeUrl(url) { return typeof url === 'string' && /^https?:\/\//i.test(url); }
  /* External link that opens in a new tab and says so to screen readers. */
  function extLink(url, label) {
    if (!safeUrl(url)) return url ? h('span', null, String(url)) : null;
    return h('a', { href: url, target: '_blank', rel: 'noopener' }, label || hostOf(url), h('span', { class: 'sr-only' }, ' (opens in a new tab)'));
  }
  function stageLink(id) {
    return h('a', { href: '#pathway-' + id, 'data-go': 'pathway-' + id }, stageLabel(id));
  }

  /* ======================================================================
     Route: tools (library with filters)
     ====================================================================== */

  function readFilters() {
    var f = AA.progress.get('libraryFilters', null) || {};
    return {
      q: typeof f.q === 'string' ? f.q : '',
      groups: Array.isArray(f.groups) ? f.groups.filter(function (g) { return typeof g === 'string'; }) : [],
      stage: typeof f.stage === 'string' ? f.stage : '',
      scorable: !!f.scorable
    };
  }
  function saveFilters(f) {
    AA.progress.set('libraryFilters', { q: f.q, groups: f.groups.slice(), stage: f.stage, scorable: f.scorable });
  }
  function norm(s) { return String(s || '').toLowerCase(); }
  function haystack(t) {
    return norm([t.abbr, String(t.abbr || '').replace(/[^a-z0-9]/gi, ''), t.name, t.purpose, t.id, groupName(groupKey(t))].join(' '));
  }

  function toolCard(t) {
    var facts = [t.who, t.time, itemsText(t)].filter(Boolean).join(' · ');
    var st = stagesOf(t);
    return h('a', { class: 'card card-link lib-card', href: '#tool-' + t.id, 'data-go': 'tool-' + t.id },
      h('span', { class: 'lib-card-top' },
        h('span', { class: 'lib-abbr' }, toolLabel(t)),
        scorable(t) ? ui.badge('Score it here', 'accent') : ui.badge('Licensed: described only', 'neutral')),
      t.name ? h('span', { class: 'lib-card-name' }, t.name) : null,
      facts ? h('span', { class: 'lib-card-facts' }, facts) : null,
      st.length ? h('span', { class: 'lib-card-stages' }, h('span', { class: 'sr-only' }, 'Stages: '),
        st.map(function (id, i) { return h('span', { class: 'lib-tag' }, stageName(id), i < st.length - 1 ? h('span', { class: 'sr-only' }, ',') : null); })) : null);
  }

  function renderTools(el) {
    var tools = allTools();
    el.appendChild(ui.pageHead({
      eyebrow: 'Library', title: 'Tools and scoring',
      lead: 'Every screening, rating and interview tool used in adult ADHD assessment: when to use it, how to score it, its licence and where to get it.',
      actions: [ui.btn({ label: 'Assessment pathway', kind: 'ghost', go: 'pathway', icon: '→' })]
    }));
    if (!tools.length) {
      el.appendChild(ui.empty('No tools loaded', 'The tools library is not available in this build.', ui.btn({ label: 'Go to home', kind: 'primary', go: 'home' })));
      return;
    }
    el.appendChild(ui.callout('info', h('p', null, 'Questionnaires screen and measure. They never make the diagnosis on their own: that rests on the clinical interview, the history and information from people who knew the patient as a child.')));

    var f = readFilters();
    var present = GROUPS.filter(function (g) { return tools.some(function (t) { return groupKey(t) === g[0]; }); });
    f.groups = f.groups.filter(function (g) { return present.some(function (p) { return p[0] === g; }); });

    /* Stage options: pathway stages in order, then any stage a tool names that the pathway lacks. */
    var stageIds = pathway().map(function (s) { return s.id; });
    tools.forEach(function (t) { stagesOf(t).forEach(function (id) { if (stageIds.indexOf(id) < 0) stageIds.push(id); }); });
    if (f.stage && stageIds.indexOf(f.stage) < 0) f.stage = '';

    /* ---- Filters ---- */
    var search = ui.search('Search by name, abbreviation or purpose', function (q) { f.q = q; apply(); saveFilters(f); }, f.q);
    var chipBtns = {};
    var chips = h('div', { class: 'lib-chips', role: 'group', 'aria-labelledby': 'lib-groups-l' }, present.map(function (g) {
      var n = tools.filter(function (t) { return groupKey(t) === g[0]; }).length;
      var b = h('button', { type: 'button', class: 'lib-chip', 'aria-pressed': 'false', onclick: function () {
        var i = f.groups.indexOf(g[0]);
        if (i > -1) f.groups.splice(i, 1); else f.groups.push(g[0]);
        apply(); saveFilters(f);
      } }, h('span', null, g[1]), h('span', { class: 'lib-chip-n' }, String(n), h('span', { class: 'sr-only' }, n === 1 ? ' tool' : ' tools')));
      chipBtns[g[0]] = b;
      return b;
    }));
    var stageSel = h('select', { id: ui.nid('lib-stage') },
      h('option', { value: '' }, 'All stages'),
      stageIds.map(function (id) { return h('option', { value: id }, stageLabel(id)); }));
    stageSel.value = f.stage;
    stageSel.addEventListener('change', function () { f.stage = stageSel.value; apply(); saveFilters(f); });
    var scoreCheck = ui.check({ label: 'Can be scored here', hint: 'Only tools you can fill in and score in this app', checked: f.scorable,
      onChange: function (v) { f.scorable = v; apply(); saveFilters(f); } });
    var scoreInput = scoreCheck.querySelector('input');
    var clearBtn = ui.btn({ label: 'Clear filters', kind: 'quiet', small: true, onClick: function () { reset(); search.focus(); } });

    function reset() {
      f.q = ''; f.groups = []; f.stage = ''; f.scorable = false;
      search.value = ''; stageSel.value = ''; scoreInput.checked = false;
      apply(); saveFilters(f);
    }

    el.appendChild(h('div', { class: 'card lib-filters', role: 'search', 'aria-label': 'Filter tools' },
      search,
      h('div', null, h('p', { class: 'lib-flabel', id: 'lib-groups-l' }, 'Groups'), chips),
      h('div', { class: 'lib-frow' }, ui.field('Assessment stage', stageSel), scoreCheck, h('span', { class: 'lib-fclear' }, clearBtn))));

    /* ---- Results: all cards are built once; filtering only toggles `hidden`. ---- */
    var countEl = h('p', { class: 'lib-count', role: 'status', 'aria-live': 'polite' });
    var sections = present.map(function (g) {
      var items = tools.filter(function (t) { return groupKey(t) === g[0]; }).map(function (t) {
        return { t: t, el: toolCard(t), hay: haystack(t), stages: stagesOf(t), can: scorable(t) };
      });
      var nEl = h('span', { class: 'lib-group-n' });
      var hid = 'lib-g-' + g[0];
      var sec = h('section', { class: 'lib-group', 'aria-labelledby': hid },
        h('h2', { id: hid }, h('span', null, g[1]), nEl),
        h('div', { class: 'grid lib-grid' }, items.map(function (x) { return x.el; })));
      return { id: g[0], el: sec, items: items, nEl: nEl };
    });
    var emptyEl = ui.empty('No tools match these filters', 'Try another word, choose a different stage or group, or clear the filters.',
      ui.btn({ label: 'Clear filters', kind: 'primary', onClick: function () { reset(); search.focus(); } }));
    el.appendChild(countEl);
    el.appendChild(h('div', { class: 'lib-results' }, sections.map(function (s) { return s.el; }), emptyEl));

    function apply() {
      var words = norm(f.q).split(/\s+/).filter(Boolean);
      var shown = 0, canShown = 0;
      sections.forEach(function (s) {
        var groupOn = !f.groups.length || f.groups.indexOf(s.id) > -1;
        var n = 0;
        s.items.forEach(function (x) {
          var on = groupOn && (!f.stage || x.stages.indexOf(f.stage) > -1) && (!f.scorable || x.can) &&
            words.every(function (w) { return x.hay.indexOf(w) > -1; });
          x.el.hidden = !on;
          if (on) { n++; if (x.can) canShown++; }
        });
        s.el.hidden = !n;
        s.nEl.textContent = U.plural(n, 'tool');
        shown += n;
      });
      emptyEl.hidden = shown > 0;
      Object.keys(chipBtns).forEach(function (k) { chipBtns[k].setAttribute('aria-pressed', f.groups.indexOf(k) > -1 ? 'true' : 'false'); });
      var active = !!(f.q || f.groups.length || f.stage || f.scorable);
      clearBtn.hidden = !active;
      countEl.textContent = (active ? 'Showing ' + shown + ' of ' + U.plural(tools.length, 'tool') : 'All ' + U.plural(tools.length, 'tool')) +
        (shown ? ' · ' + canShown + ' can be scored here' : '');
    }
    apply();
  }

  /* ======================================================================
     Route: tool-<id> (reference card)
     ====================================================================== */

  var tabMemo = {};   // last tab per tool, so refresh() and coming back keep the place

  function renderTool(el, params) {
    var id = params[0];
    var t = id ? AA.byId('tools', id) : null;
    if (!t) {
      el.appendChild(ui.pageHead({ eyebrow: 'Tools and scoring', title: 'Tool not found',
        lead: 'This tool is not in the library. It may have been renamed or removed.',
        actions: [ui.btn({ label: 'Back to library', kind: 'primary', go: 'tools', icon: '←' })] }));
      return;
    }
    var can = scorable(t);
    el.appendChild(ui.pageHead({
      eyebrow: groupName(groupKey(t)), title: toolLabel(t) + (t.name ? ' · ' + t.name : ''), lead: t.purpose || null,
      actions: [ui.btn({ label: 'Back to library', kind: 'ghost', go: 'tools', icon: '←' })]
    }));

    /* ---- At a glance, when, how ---- */
    var st = stagesOf(t);
    var rows = [];
    if (t.who) rows.push(['Completed by', t.who]);
    if (t.time) rows.push(['Time', t.time]);
    if (itemsText(t)) rows.push(['Items', itemsText(t)]);
    if (t.ages) rows.push(['Ages', t.ages]);
    rows.push(['Stages', st.length ? h('span', { class: 'lib-links' }, st.map(stageLink)) : h('span', { class: 'muted' }, 'Not assigned')]);
    rows.push(['In this app', can ? ui.badge('Score it here', 'accent') : ui.badge('Licensed: described only', 'neutral')]);
    rows.push(['Licence', t.licence || h('span', { class: 'muted' }, 'Not stated')]);

    el.appendChild(h('div', { class: 'grid-2 lib-top' },
      h('section', { class: 'card lib-glance', 'aria-labelledby': 'lib-glance-h' }, h('h2', { id: 'lib-glance-h' }, 'At a glance'), ui.kv(rows)),
      h('div', { class: 'lib-stack' },
        h('section', { class: 'card', 'aria-labelledby': 'lib-when-h' }, h('h2', { id: 'lib-when-h' }, 'When to use it'),
          t.when ? h('p', null, t.when) : h('p', { class: 'muted' }, 'No guidance recorded yet.')),
        h('section', { class: 'card', 'aria-labelledby': 'lib-how-h' }, h('h2', { id: 'lib-how-h' }, 'How to give it'),
          t.how ? h('p', null, t.how) : h('p', { class: 'muted' }, 'Follow the instructions on the official form.')))));

    /* ---- Tabs ---- */
    var tabs = [];
    if (can) tabs.push({ id: 'practise', label: 'Practise scoring', render: function () { return sandbox(t); } });
    tabs.push({ id: 'rules', label: 'Scoring rules', render: function () { return rulesPanel(t); } });
    tabs.push({ id: 'interp', label: 'Interpretation', render: function () { return interpPanel(t); } });
    tabs.push({ id: 'licence', label: 'Licence and download', render: function () { return licencePanel(t); } });
    var active = tabs.some(function (x) { return x.id === tabMemo[t.id]; }) ? tabMemo[t.id] : tabs[0].id;
    el.appendChild(h('section', { class: 'section lib-tabsec', 'aria-labelledby': 'lib-tabs-h' },
      h('h2', { id: 'lib-tabs-h' }, can ? 'Practise, score and interpret' : 'Scoring and interpretation'),
      can ? null : ui.callout('info', h('p', null, 'There is no practice form for this tool. Its items are not reproduced here, usually because the licence does not allow it, or because it is a clinician-run interview or a computer test. Use the official materials, then record the result in your assessment notes.'), 'Described, not reproduced'),
      ui.tabs(tabs, active, function (tid) { tabMemo[t.id] = tid; })));

    /* ---- Related ---- */
    el.appendChild(related(t));
  }

  /* Practice form. Answers persist in AA.progress('sandbox.<id>') and are never linked to a patient. */
  function sandbox(t) {
    var key = 'sandbox.' + t.id;
    var host = h('div', { class: 'lib-panel lib-sandbox' });
    var qHost = h('div');
    var status = h('p', { class: 'hint lib-sb-status' });
    function answers() { var a = AA.progress.get(key, null); return a && typeof a === 'object' ? Object.assign({}, a) : {}; }
    var clearBtn = ui.btn({ label: 'Clear practice answers', kind: 'ghost', small: true, onClick: function () {
      U.confirm({ title: 'Clear your practice answers for ' + toolLabel(t) + '?', body: 'This only empties the practice form. No assessment changes.', ok: 'Clear', danger: true })
        .then(function (yes) {
          if (!yes) return;
          AA.progress.set(key, undefined);
          build(); updateStatus();
          U.toast('Practice answers cleared');
        });
    } });
    function updateStatus() {
      var n = Object.keys(answers()).length;
      status.textContent = n ? U.plural(n, 'answer') + ' saved in your profile.' : 'Nothing saved yet.';
      clearBtn.disabled = !n;
    }
    function build() {
      U.clear(qHost);
      qHost.appendChild(AA.components.questionnaire(t, { answers: answers(), onAnswer: function (n, v) {
        AA.progress.set(key + '.' + n, v === null ? undefined : v);
        updateStatus();
      } }));
    }
    host.appendChild(h('div', { class: 'lib-sb-head' },
      h('div', { class: 'lib-sb-text' },
        h('h3', null, 'Practice form'),
        h('p', null, 'Fill it in to see exactly how the tool scores. Your answers stay in your profile so you can come back to them. They are not linked to any patient and never appear in an assessment.'),
        status),
      clearBtn));
    host.appendChild(qHost);
    build(); updateStatus();
    return host;
  }

  /* ---- Scoring rules, explained in words ---- */

  function sub(title, nodes) { return [h('h3', null, title), nodes]; }

  /* Options and points as a small table (numbers only; "n/a"-style options are noted). */
  function optionTable(t) {
    var opts = t.options || [];
    if (!opts.length) return null;
    var numeric = opts.filter(function (o) { return typeof o.v === 'number'; });
    var other = opts.filter(function (o) { return typeof o.v !== 'number'; });
    if (!numeric.length) return null;
    return h('div', null,
      ui.table(['Answer', 'Points'], numeric.map(function (o) { return [o.l, h('span', { class: 'num' }, String(o.v))]; }), 'table-compact lib-opts'),
      other.length ? h('p', { class: 'hint' }, other.map(function (o) { return '"' + o.l + '"'; }).join(', ') + ': left out of the score.') : null);
  }

  function methodNodes(t, sc, base) {
    var m = sc.method || 'sum';
    var max = base && typeof base.max === 'number' ? base.max : null;
    var of = base ? base.of : (t.items || []).length;
    var out = [];
    var provisional = h('p', null, 'The app shows a result band only when every scored item is answered. A part-completed form is marked provisional.');
    if (m === 'sum' || m === 'count') {
      out.push(h('p', null, m === 'count'
        ? 'Count the answers given in the scored direction: each one is worth 1 point' + (max !== null ? ', so totals run from 0 to ' + max : '') + '.'
        : 'Add up the points for every item' + (max !== null ? '. Totals run from 0 to ' + max : '') + '.'));
      out.push(provisional);
      var keyedN = (t.items || []).filter(function (it) { return it.score && typeof it.score === 'object'; }).length;
      if (keyedN < (t.items || []).length) {
        out.push(optionTable(t));
        if (keyedN) out.push(h('p', { class: 'hint' }, 'Except the items listed under "Items scored differently" below.'));
      }
    } else if (m === 'asrs18') {
      var partA = (t.items || []).filter(function (it) { return it.part === 'A'; });
      var need = sc.partA || 4;
      out.push(h('p', null, 'Part A (items ' + ranges(partA.map(function (it) { return it.n; })) + ') is the screener. Each item has a shaded range that starts at a set answer.'));
      out.push(h('p', null, h('strong', null, 'Count the Part A answers that fall in the shaded range. ' + need + ' or more of ' + partA.length + ' is a positive screen.')));
      out.push(h('p', null, 'Part B items describe the symptoms in more detail. They do not change the screen result.' + (max !== null ? ' The app also adds up all item points (0 to ' + max + ') as extra information.' : '')));
      var thr = (t.items || []).filter(function (it) { return it.threshold !== undefined; });
      if (thr.length) {
        out.push(h('h4', null, 'Where the shading starts'));
        out.push(ui.table(['Item', 'Part', 'Shaded from'], thr.map(function (it) {
          return [h('span', null, h('span', { class: 'num' }, String(it.n)), it.t ? h('span', { class: 'lib-itemtext' }, it.t) : null),
            it.part || 'B', ui.badge(optLabel(t, it, it.threshold), 'warn')];
        }), 'table-compact lib-thr'));
      }
    } else if (m === 'wfirs') {
      var rule = sc.rule || { twos: 2, threes: 1 };
      out.push(h('p', null, 'Rate each item from 0 to 3, or mark it not applicable. Not-applicable answers are left out of every calculation.'));
      out.push(h('p', null, h('strong', null, 'A domain counts as impaired when at least ' + U.plural(rule.twos, 'item') + ' ' + (rule.twos === 1 ? 'is' : 'are') + ' rated 2 or more, or at least ' +
        U.plural(rule.threes, 'item') + ' ' + (rule.threes === 1 ? 'is' : 'are') + ' rated 3' + (rule.mean !== undefined ? ', or the domain average is ' + rule.mean + ' or more' : '') + '.')));
      out.push(h('p', null, 'The app reports how many domains are impaired. It reads two or more impaired domains as a positive result.'));
      var doms = sc.domains || [];
      if (doms.length) out.push(ui.table(['Domain', 'Items'], doms.map(function (d) { return [d.label || d.id, ranges(d.items)]; }), 'table-compact'));
      out.push(optionTable(t));
    } else if (m === 'mdq') {
      var p1 = (t.items || []).filter(function (it) { return it.part === '1'; });
      var need1 = sc.part1 || 7;
      out.push(h('p', null, 'Three parts. The screen is positive only when all three are met:'));
      out.push(h('ol', { class: 'list' },
        h('li', null, h('strong', null, 'Part 1: '), need1 + ' or more "yes" answers to the ' + p1.length + ' symptom questions' + (p1.length ? ' (items ' + ranges(p1.map(function (it) { return it.n; })) + ')' : '') + '.'),
        h('li', null, h('strong', null, 'Part 2: '), '"yes" to several of these happening during the same period.'),
        h('li', null, h('strong', null, 'Part 3: '), 'they caused moderate or serious problems.')));
      out.push(h('p', null, 'A high Part 1 count with a "no" to Part 2 or minor problems in Part 3 is a negative screen. Read it alongside the history.'));
    } else if (m === 'pcl5') {
      var two = optLabel(t, null, 2);
      out.push(h('p', null, 'Add up the points for every item' + (max !== null ? ' (' + U.plural(of, 'item') + ', 0 to ' + max + ')' : '') + '.'));
      out.push(h('p', null, 'The app also checks the provisional DSM-5 pattern. An item rated 2' + (two !== '2' ? ' ("' + two + '")' : '') + ' or more counts as endorsed.'));
      var cl = sc.clusters || {};
      out.push(ui.table(['Cluster', 'Items', 'Endorsed items needed'], CLUSTERS.map(function (c) {
        return [c[0] + ' · ' + c[1], ranges(cl[c[0]]) || '-', String(c[2])];
      }), 'table-compact'));
      out.push(provisional);
      out.push(optionTable(t));
    } else if (m === 'triage') {
      out.push(h('p', null, 'This tool gives a level of risk, not a total. The app checks the levels in order, from the top. The first level with a "yes" to any of its items applies.'));
      var levels = sc.levels || [];
      if (levels.length) {
        out.push(ui.table(['Level', 'Triggered by a yes to', 'Action'], levels.map(function (lv) {
          return [ui.sevChip(lv.sev, lv.label || 'Level'), arr(lv.any).length ? 'Item ' + ranges(lv.any) : '-', lv.text || '-'];
        }), 'table-compact'));
      }
      out.push(h('p', null, 'No "yes" answers gives "No risk items endorsed". This never replaces a full risk assessment.'));
    } else {
      out.push(h('p', null, 'Add up the points for every item.'));
    }
    return out;
  }

  function rulesPanel(t) {
    var sc = t.scoring || null;
    var w = h('div', { class: 'lib-panel lib-rules' });
    if (!sc) {
      w.appendChild(h('h3', null, 'How it is scored'));
      w.appendChild(h('p', null, 'Scoring is set out in the publisher\'s manual and is not reproduced here. See the Interpretation tab for how to use the result, and the Licence tab for where to get the materials.'));
      return w;
    }
    var base = blankScore(t);
    U.append(w, sub('How it is scored', methodNodes(t, sc, base)));

    var bands = AA.components.bands(t);
    if (bands) U.append(w, sub('Score bands', [bands, h('p', { class: 'hint' }, 'Bands describe symptom level. They are not diagnoses.')]));
    if (sc.cutoff && sc.cutoff.value !== undefined) {
      U.append(w, sub('Cut-off', h('p', { class: 'lib-cut' }, h('strong', { class: 'num' }, sc.cutoff.value + ' or more'), sc.cutoff.text ? ': ' + sc.cutoff.text : '')));
    }
    var subs = arr(sc.subscales);
    if (subs.length) {
      U.append(w, sub('Subscales', ui.table(['Subscale', 'Items', 'Cut-off or bands'], subs.map(function (s) {
        var res = s.cutoff !== undefined ? s.cutoff + ' or more' :
          arr(s.bands).length ? arr(s.bands).map(function (b) { return (b.max === undefined || b.max === null ? b.min + '+' : b.min + '–' + b.max) + ' ' + b.label; }).join('; ') : '-';
        return [s.label || s.id, ranges(s.items), res];
      }), 'table-compact')));
    }
    var flags = arr(sc.flags);
    if (flags.length) {
      U.append(w, sub('Answers that need action', h('ul', { class: 'lib-flags' }, flags.map(function (fl) {
        var it = itemOf(t, fl.item);
        var when = fl.equals !== undefined ? 'answered "' + optLabel(t, it, fl.equals) + '"' : (fl.min === undefined || fl.min <= 1) ? 'scored 1 or more' : 'scored ' + fl.min + ' or more';
        return h('li', null, ui.badge(fl.level === 'urgent' ? 'Urgent' : 'Note', fl.level === 'urgent' ? 'err' : 'warn'),
          h('span', null, h('strong', null, 'Item ' + fl.item + ' ' + when + ': '), fl.text || ''));
      }))));
    }
    var keyed = (t.items || []).filter(function (it) { return it.score && typeof it.score === 'object'; });
    var rev = (t.items || []).filter(function (it) { return it.reverse; });
    var unscored = (t.items || []).filter(function (it) { return it.unscored; });
    if (keyed.length || rev.length || unscored.length) {
      var nodes = [];
      if (keyed.length) {
        nodes.push(ui.table(['Item', 'Points per answer'], keyed.map(function (it) {
          return [String(it.n), Object.keys(it.score).map(function (k) {
            var o = optsOf(t, it).filter(function (x) { return String(x.v) === k; })[0];
            return (o ? o.l : k) + ' = ' + it.score[k];
          }).join(' · ')];
        }), 'table-compact'));
      }
      if (rev.length) nodes.push(h('p', null, 'Reverse scored: item ' + ranges(rev.map(function (it) { return it.n; })) + '.'));
      if (unscored.length) nodes.push(h('p', null, 'Not scored (context only): item ' + ranges(unscored.map(function (it) { return it.n; })) + '.'));
      U.append(w, sub('Items scored differently', nodes));
    }
    if (!scorable(t)) w.appendChild(h('p', { class: 'hint' }, 'Score this tool on the official form.'));
    return w;
  }

  function interpPanel(t) {
    var w = h('div', { class: 'lib-panel' });
    var interp = arr(t.interpretation), pit = arr(t.pitfalls);
    if (interp.length) U.append(w, sub('How to read the result', ui.list(interp)));
    if (t.adhdNotes) U.append(w, sub('In an ADHD assessment', ui.callout('info', h('p', null, t.adhdNotes))));
    if (t.psychometrics) U.append(w, sub('Accuracy and evidence', h('p', null, t.psychometrics)));
    if (pit.length) U.append(w, sub('Pitfalls', ui.callout('warn', ui.list(pit))));
    if (!w.firstChild) w.appendChild(ui.empty('No interpretation notes yet', 'Use the guidance in the official manual.'));
    return w;
  }

  function licencePanel(t) {
    var w = h('div', { class: 'lib-panel' });
    var can = scorable(t);
    var rows = [['Licence', t.licence || h('span', { class: 'muted' }, 'Not stated')]];
    if (t.source) rows.push(['Source', t.source]);
    rows.push(['Official page', safeUrl(t.url) ? extLink(t.url) : h('span', { class: 'muted' }, 'No official page recorded')]);
    U.append(w, sub('Licence and source', ui.kv(rows)));
    var file = typeof t.file === 'string' && t.file && !/^\s*javascript:/i.test(t.file) ? t.file : null;
    if (file) {
      U.append(w, sub('Form', [
        h('p', null, h('a', { class: 'btn btn-sm', href: file, target: '_blank', rel: 'noopener' }, 'Open the form (PDF)', h('span', { class: 'sr-only' }, ' (opens in a new tab)'))),
        h('p', { class: 'hint' }, 'A copy kept with this app, reproduced under the licence above. Check the official page for the latest version.')]));
    }
    w.appendChild(can
      ? ui.callout('info', h('p', null, 'The items are shown in this app for practice and clinical use. Check the licence terms above before you copy the form anywhere else, and use the official version if your service requires it.'))
      : ui.callout('warn', h('p', null, 'This is a licensed instrument. Get the official form, manual and scoring materials from the publisher or the official page. Do not copy, adapt or translate it without permission.'), 'Obtain it from the publisher'));
    return w;
  }

  /* Related differentials, pathway stages and a shortcut into the current assessment. */
  function related(t) {
    var conds = condsFor(t.id);
    var st = stagesOf(t);
    var T = (AA.diagnosis && AA.diagnosis.STEP_TOOLS) || {};
    var stepId = arr(T.screen).indexOf(t.id) > -1 ? 'screen' : arr(T.comorbid).indexOf(t.id) > -1 ? 'comorbid' : null;
    var step = stepId ? (AA.STEP_LIST || []).filter(function (s) { return s.id === stepId; })[0] : null;
    var last = null;
    try { last = AA.shell && AA.shell.lastAssessment ? AA.shell.lastAssessment() : null; } catch (e) { last = null; }
    var useNode = null;
    if (step) {
      useNode = h('div', { class: 'lib-use' },
        h('p', null, 'Built into the assessment: step "' + step.title + '".'),
        last && scorable(t) ? ui.btn({ label: 'Score it for ' + ((last.patient && last.patient.ref) || 'the current patient'), kind: 'primary', small: true,
          go: 'assess-' + last.id + '-' + stepId }) : null);
    }
    return h('section', { class: 'section', 'aria-labelledby': 'lib-rel-h' }, h('h2', { id: 'lib-rel-h' }, 'Related'),
      h('div', { class: 'grid-2' },
        h('div', { class: 'card' }, h('h3', null, 'Differential diagnoses that use it'),
          conds.length ? h('ul', { class: 'lib-rlist' }, conds.map(function (c) {
            return h('li', null, h('a', { href: '#cond-' + c.id, 'data-go': 'cond-' + c.id }, c.name || c.id));
          })) : h('p', { class: 'muted' }, 'No differential in the library lists this tool as a screen.')),
        h('div', { class: 'card' }, h('h3', null, 'Where it fits in the pathway'),
          st.length ? h('ul', { class: 'lib-rlist' }, st.map(function (id) { return h('li', null, stageLink(id)); }))
            : h('p', { class: 'muted' }, 'Not assigned to a pathway stage.'),
          useNode)));
  }

  /* ======================================================================
     Route: pathway[-<stageId>]
     ====================================================================== */

  function focusStage(id) {
    var li = document.getElementById('lib-stage-' + id);
    if (!li) return;
    U.$$('.lib-stage-on').forEach(function (x) { x.classList.remove('lib-stage-on'); });
    li.classList.add('lib-stage-on');
    var hd = li.querySelector('h3');
    try { li.scrollIntoView({ block: 'start' }); } catch (e) { /* old browsers */ }
    if (hd) { try { hd.focus({ preventScroll: true }); } catch (e) { hd.focus(); } }
  }

  function stageItem(s, i) {
    var n = typeof s.n === 'number' ? s.n : i + 1;
    var what = arr(s.what), tips = arr(s.tips), sources = arr(s.sources);
    var tools = arr(s.tools).map(function (id) {
      var t = AA.byId('tools', id);
      if (!t) return h('li', null, h('span', { class: 'chip' }, id));
      return h('li', null, h('a', { class: 'chip lib-tchip', href: '#tool-' + id, 'data-go': 'tool-' + id, title: t.name || null },
        toolLabel(t), scorable(t) ? h('span', { class: 'lib-tchip-mark', title: 'Can be scored here' }, h('span', { 'aria-hidden': 'true' }, '✓'), h('span', { class: 'sr-only' }, ' (can be scored here)')) : null));
    });
    var hid = 'lib-stage-h-' + s.id;
    return h('li', { class: 'lib-stage', id: 'lib-stage-' + s.id },
      h('span', { class: 'lib-stage-n', 'aria-hidden': 'true' }, String(n)),
      h('article', { class: 'card lib-stage-card', 'aria-labelledby': hid },
        h('h3', { id: hid, tabindex: '-1' }, h('span', { class: 'sr-only' }, 'Stage ' + n + ': '), s.title || stageName(s.id)),
        s.who ? h('p', { class: 'lib-who' }, h('strong', null, 'Who: '), s.who) : null,
        what.length ? [h('h4', null, 'What happens'), ui.list(what)] : null,
        tools.length ? [h('h4', null, 'Tools'), h('ul', { class: 'chip-list lib-tchips' }, tools)] : null,
        tips.length ? h('div', { class: 'lib-tips' }, h('h4', null, 'Tips'), ui.list(tips)) : null,
        sources.length ? ui.source(sources.join('; ')) : null));
  }

  /* "Which tool, when": tools by row (grouped), stages by column; a tick plus screen-reader text marks use. */
  function matrix(stages) {
    var tools = allTools().filter(function (t) { return stages.some(function (s) { return inStage(t, s); }); });
    if (!tools.length || !stages.length) return ui.empty('Nothing to show yet', 'No tools are linked to the pathway stages.');
    var cols = stages.length + 2;
    var head = h('thead', null, h('tr', null,
      h('th', { scope: 'col', class: 'lib-mx-tool' }, 'Tool'),
      h('th', { scope: 'col', class: 'lib-mx-kind' }, 'In this app'),
      stages.map(function (s, i) {
        return h('th', { scope: 'col', class: 'lib-mx-stage', title: s.title || s.id },
          h('span', { class: 'lib-mx-n' }, String(typeof s.n === 'number' ? s.n : i + 1)), h('span', { class: 'lib-mx-t' }, s.title || stageName(s.id)));
      })));
    var bodies = GROUPS.map(function (g) {
      var rows = tools.filter(function (t) { return groupKey(t) === g[0]; });
      if (!rows.length) return null;
      return h('tbody', null,
        h('tr', { class: 'lib-mx-group' }, h('th', { scope: 'rowgroup', colspan: String(cols) }, h('span', null, g[1]))),
        rows.map(function (t) {
          return h('tr', null,
            h('th', { scope: 'row', class: 'lib-mx-tool' }, h('a', { href: '#tool-' + t.id, 'data-go': 'tool-' + t.id }, toolLabel(t)),
              t.name ? h('span', { class: 'lib-mx-name' }, t.name) : null),
            h('td', { class: 'lib-mx-kind' }, scorable(t) ? ui.badge('Scored here', 'accent') : ui.badge('Licensed', 'neutral')),
            stages.map(function (s) {
              var on = inStage(t, s);
              return h('td', { class: 'lib-mx-cell' + (on ? ' lib-mx-on' : '') },
                on ? [h('span', { 'aria-hidden': 'true' }, '✓'), h('span', { class: 'sr-only' }, 'Used')] : h('span', { class: 'sr-only' }, 'Not used'));
            }));
        }));
    });
    return h('div', null,
      h('p', { class: 'hint lib-mx-key' }, h('span', { 'aria-hidden': 'true' }, '✓ '), 'marks the stages where a tool is used. ', h('span', { class: 'lib-mx-phone' }, 'Scroll the table sideways to see every stage.')),
      h('div', { class: 'table-wrap lib-mx-wrap', tabindex: '0', role: 'region', 'aria-label': 'Which tool, when (scrolls sideways)' },
        h('table', { class: 'table lib-matrix' }, h('caption', { class: 'sr-only' }, 'Tools by assessment stage'), head, bodies)));
  }

  function guidelineCard(g) {
    var kp = arr(g.keyPoints), as = arr(g.assessment);
    var hid = 'lib-gl-' + g.id;
    return h('article', { class: 'card lib-gl', 'aria-labelledby': hid },
      h('h3', { id: hid }, g.name || g.id),
      g.org || g.year ? h('p', { class: 'lib-gl-meta' }, [g.org, g.year].filter(Boolean).join(' · ')) : null,
      g.scope ? h('p', null, g.scope) : null,
      as.length ? ui.details('What it says about assessment', ui.list(as), { meta: U.plural(as.length, 'point') }) : null,
      kp.length ? ui.details('Key recommendations', ui.list(kp), { meta: U.plural(kp.length, 'point') }) : null,
      safeUrl(g.url) ? h('p', { class: 'lib-gl-link' }, extLink(g.url, 'Read the guideline on ' + hostOf(g.url))) : null);
  }

  function renderPathway(el, params) {
    var stages = pathway();
    var target = params && params[0] ? params[0] : null;
    el.appendChild(ui.pageHead({
      eyebrow: 'Library', title: 'Assessment pathway',
      lead: 'The order of a full adult ADHD assessment and which tool belongs where, built from UK NICE NG87 and international guidance.',
      actions: [ui.btn({ label: 'Tools and scoring', kind: 'ghost', go: 'tools', icon: '▤' })]
    }));

    var stageSec = h('section', { class: 'section lib-pw', 'aria-labelledby': 'lib-pw-h' }, h('h2', { id: 'lib-pw-h' }, 'Stages of a full assessment'));
    if (!stages.length) {
      stageSec.appendChild(ui.empty('The pathway is not available', 'Pathway content has not loaded in this build.'));
    } else {
      stageSec.appendChild(h('nav', { class: 'lib-jump', 'aria-label': 'Jump to a stage' }, h('ol', null, stages.map(function (s, i) {
        var n = typeof s.n === 'number' ? s.n : i + 1;
        return h('li', null, h('button', { type: 'button', class: 'lib-chip', onclick: function () { focusStage(s.id); } },
          h('span', { class: 'lib-chip-n' }, String(n)), h('span', null, s.title || stageName(s.id))));
      }))));
      stageSec.appendChild(h('ol', { class: 'lib-timeline' }, stages.map(stageItem)));
    }
    el.appendChild(stageSec);

    el.appendChild(h('section', { class: 'section', 'aria-labelledby': 'lib-mx-h' }, h('h2', { id: 'lib-mx-h' }, 'Which tool, when'),
      h('p', { class: 'muted lib-intro' }, 'Every tool linked to a stage, grouped by what it measures. Licensed tools are described in the library; the rest can be scored here.'),
      matrix(stages)));

    var gl = (AA.data.guidelines || []).filter(function (g) { return g && g.id; });
    el.appendChild(h('section', { class: 'section', 'aria-labelledby': 'lib-gl-h' }, h('h2', { id: 'lib-gl-h' }, 'Guidelines behind the pathway'),
      gl.length ? h('div', { class: 'grid-2 lib-gls' }, gl.map(guidelineCard)) : ui.empty('No guidelines loaded', 'Guideline summaries are not available in this build.')));

    if (target) setTimeout(function () { focusStage(target); }, 0);
  }

  /* ---------- Routes ---------- */
  AA.router.register('tools', { title: 'Tools and scoring', render: function (el) { renderTools(el); } });
  AA.router.register('tool', {
    title: function (p) { var t = p && p[0] ? AA.byId('tools', p[0]) : null; return t ? toolLabel(t) + ' · Tools' : 'Tool'; },
    render: function (el, params) { renderTool(el, params); }
  });
  AA.router.register('pathway', { title: 'Assessment pathway', render: function (el, params) { renderPathway(el, params); } });

  AA.views.library = { groupName: groupName, stageName: stageName };
})(window.AA);
