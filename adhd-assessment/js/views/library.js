/* Tools library, tool reference pages with practice scoring, and the assessment pathway.
   Routes: "tools", "tool-<id>" and "pathway[-<stageId>]" (see ARCHITECTURE.md, section 6).
   All clinical content comes from AA.data.tools, AA.data.pathway, AA.data.guidelines and AA.data.ddx;
   this file only arranges it, with the design system builders (DESIGN.md): a hero per page, tools grouped by
   purpose, a guide with on-page contents, the pathway as a journey plus a one-stage-at-a-time stepper.
   Per-clinician state lives in AA.progress: 'libraryFilters' (the tools page filters: {q, groups: [family id],
   stage, scorable}) and 'sandbox.<toolId>' (practice answers, never linked to a patient). */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui;

  /* Tool groups as the data names them (ARCHITECTURE.md 5.4). Unknown groups fall back to "Other". */
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

  /* Families: the data groups gathered by what a clinician is looking for, in assessment order.
     Every data group belongs to exactly one family ('other' is in "Risk and other conditions"). */
  var FAMILIES = [
    { id: 'adhd', label: 'ADHD symptom scales', icon: 'target', groups: ['adhd-screen', 'adhd-rating'], text: 'Screen for and rate current ADHD symptoms.' },
    { id: 'history', label: 'Childhood and impairment', icon: 'timeline', groups: ['adhd-childhood', 'adhd-impairment'], text: 'Childhood symptoms looked back on, and how much daily life is affected.' },
    { id: 'interview', label: 'Diagnostic interviews', icon: 'users', groups: ['adhd-interview'], text: 'Structured interviews for the core of the diagnosis.' },
    { id: 'thinking', label: 'Executive function and tests', icon: 'brain', groups: ['cognition', 'objective'], text: 'Executive function scales, a thinking screen and a computer test.' },
    { id: 'mood', label: 'Mood', icon: 'heart', groups: ['mood', 'bipolar'], text: 'Depression and bipolar disorder, which can look like ADHD or occur with it.' },
    { id: 'anxiety', label: 'Anxiety and trauma', icon: 'shield', groups: ['anxiety', 'trauma'], text: 'Anxiety, obsessions and compulsions, and the effects of trauma.' },
    { id: 'substance', label: 'Alcohol and drugs', icon: 'drop', groups: ['substance'], text: 'Alcohol and drug use, which can cause or worsen attention problems.' },
    { id: 'autism', label: 'Autism', icon: 'spark', groups: ['autism'], text: 'Autistic traits, which often occur alongside ADHD.' },
    { id: 'sleep', label: 'Sleep', icon: 'moon', groups: ['sleep'], text: 'Sleepiness, sleep apnoea and insomnia, which affect attention.' },
    { id: 'risk', label: 'Risk and other conditions', icon: 'alert', groups: ['risk', 'personality', 'psychosis', 'validity', 'other'], text: 'Suicide risk, personality, psychosis and broad screens.' },
    { id: 'young', label: 'Children and young people', icon: 'school', groups: ['child'], text: 'Parent, teacher and self-report scales for children and young people.' }
  ];
  function familyOf(t) {
    var g = groupKey(t);
    for (var i = 0; i < FAMILIES.length; i++) if (FAMILIES[i].groups.indexOf(g) > -1) return FAMILIES[i];
    return FAMILIES[FAMILIES.length - 1];
  }

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
  /* A tool's stages in pathway order (stage 1 first), whatever order the data lists them in. */
  function stagesOf(t) {
    var st = arr(t && t.stage), order = (AA.data.pathway || []).map(function (s) { return s && s.id; });
    function pos(id) { var i = order.indexOf(id); return i < 0 ? 99 : i; }
    return st.slice().sort(function (a, b) { return pos(a) - pos(b); });
  }
  function scorable(t) { return !!(t && t.interactive !== false && t.items && t.items.length); }
  function byN(a, b) { return (typeof a.n === 'number' ? a.n : 99) - (typeof b.n === 'number' ? b.n : 99); }
  function pathway() { return (AA.data.pathway || []).filter(function (s) { return s && s.id; }).slice().sort(byN); }
  function stageById(id) { var p = pathway(); for (var i = 0; i < p.length; i++) if (p[i].id === id) return p[i]; return null; }
  function stageName(id) { var s = stageById(id); return (s && s.title) || STAGE_FALLBACK[id] || id; }
  function stageNo(s, i) { return typeof s.n === 'number' ? s.n : i + 1; }
  function stageLabel(id) { var s = stageById(id); return (s && typeof s.n === 'number' ? s.n + '. ' : '') + stageName(id); }
  function toolLabel(t) { return t.abbr || t.id; }
  function itemsN(t) { return t.items_n || (t.items && t.items.length) || 0; }
  function itemsText(t) { var n = itemsN(t); return n ? U.plural(n, 'item') : null; }
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

  /* Age range the app offers the tool for (ageMin/ageMax, ARCHITECTURE.md 5.4): "18+", "6–17" or "All ages". */
  function ageSpan(t) {
    var a = t.ageMin, b = t.ageMax;
    if (typeof a !== 'number' || typeof b !== 'number') return clause(t.ages);
    if (a <= 0 && b >= 120) return 'All ages';
    return b >= 120 ? a + '+' : a + '–' + b;
  }
  function agesLine(t) { var s = ageSpan(t); return !s ? '' : /^\d/.test(s) ? 'Ages ' + s : s; }

  /* First clause of a long data string, for compact cards ("About 5-10 minutes (clinical practice estimate)" -> "About 5-10 minutes"). */
  function clause(x) {
    var s = String(x || '').trim();
    if (!s) return '';
    var cut = s.search(/\. |; | \(/);
    if (cut > 0) s = s.slice(0, cut);
    if (s.length > 48 && s.indexOf(', ') > 0) s = s.slice(0, s.indexOf(', '));
    return s.replace(/[.:,;]+$/, '');
  }

  /* Split authored prose into sentences without changing a word: a full stop (or ? !), any closing quote or
     bracket, a space and a capital, digit or opening quote. Abbreviations and initials ("et al.", "e.g.",
     "L.") never end a sentence. Used to show "how" as numbered steps and "when" as a short list. */
  var NO_END = /(?:\b(?:e\.g|i\.e|et al|approx|vs|cf|Dr|Drs|Prof|Mr|Mrs|Ms|No|St|Fig|vol|pp?)\.|(?:^|[\s(])[A-Z]\.)['"’”)\]]*$/;
  function sentences(text) {
    var s = String(text || '').replace(/\s+/g, ' ').trim();
    if (!s) return [];
    var out = [], start = 0, re = /[.!?]['"’”)\]]*\s+(?=['"‘“(]?[A-Z0-9])/g, m;
    while ((m = re.exec(s))) {
      var cut = m.index + m[0].replace(/\s+$/, '').length;
      var head = s.slice(start, cut);
      if (NO_END.test(head)) continue;
      out.push(head.trim());
      start = cut;
    }
    var rest = s.slice(start).trim();
    if (rest) out.push(rest);
    return out;
  }

  /* A licence label only when the data's own licence text starts with plain words that say it
     ("Free to use", "Public domain", "Proprietary", "Unverified"...). Those words are quoted, never inferred. */
  function licenceTag(t) {
    var s = String(t.licence || '').trim();
    var m = /^(free[^.;:(]*|public domain|open access[^.;:(]*|proprietary|commercial[^.;:(]*|unverified|restricted|licence status not verified)/i.exec(s);
    if (!m) return null;
    var label = m[1].replace(/[\s,]+$/, '');
    label = label.charAt(0).toUpperCase() + label.slice(1);
    if (/^unverified$/i.test(label) || /^licence status not verified$/i.test(label)) return { label: 'Licence not verified', tone: 'neutral' };
    if (/^restricted$/i.test(label)) return { label: 'Restricted licence', tone: 'warn' };
    return { label: label, tone: /^(free|public|open)/i.test(label) ? 'ok' : 'warn' };
  }
  function licEl(l) {
    return h('span', { class: 'lib-lic tone-' + l.tone }, h('span', { class: 'lib-lic-dot', 'aria-hidden': 'true' }), h('span', { class: 'sr-only' }, 'Licence: '), l.label);
  }
  function statusBadge(t) { return scorable(t) ? ui.badge('Scored here', 'accent') : ui.badge('Described only', 'neutral'); }

  function hostOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return String(url); }
  }
  function safeUrl(url) { return typeof url === 'string' && /^https?:\/\//i.test(url); }
  /* External link that opens in a new tab and says so to screen readers. */
  function extLink(url, label, cls) {
    if (!safeUrl(url)) return url ? h('span', null, String(url)) : null;
    return h('a', { href: url, target: '_blank', rel: 'noopener', class: cls || null }, label || hostOf(url), h('span', { class: 'sr-only' }, ' (opens in a new tab)'));
  }
  function stageLink(id) {
    return h('a', { href: '#pathway-' + id, 'data-go': 'pathway-' + id }, stageLabel(id));
  }

  function smooth() { try { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  /* Bring a block into view and move focus to its first heading (in-page jumps keep the route). */
  function jumpTo(node, sel) {
    if (!node) return;
    try { node.scrollIntoView({ block: 'start', behavior: smooth() ? 'smooth' : 'auto' }); } catch (e) { node.scrollIntoView(); }
    var f = node.querySelector(sel || 'h2, h3');
    if (f) { if (!f.hasAttribute('tabindex')) f.setAttribute('tabindex', '-1'); try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
  }

  /* ui.section and ui.stats marked as this view's (CSS keeps the purpose line on its own row, stats compact). */
  function section(o, content) { var s = ui.section(o, content); s.classList.add('lib-sec'); return s; }
  function tiles(items) { var s = ui.stats(items); s.classList.add('lib-hstats'); return s; }
  /* ui.stepper labels its button "Next: step N"; the pathway counts stages, so say so. */
  function relabelNext(stepper, label) {
    var b = stepper ? stepper.querySelector('.ds-stepper-foot .btn-primary') : null;
    if (b && label) b.textContent = label;
  }

  /* Small building pieces used inside cards (hairlines and labels, never a box in a box). */
  function fold(title, content, meta, open) { return ui.details(title, content, { meta: meta || null, cls: 'lib-fold', open: !!open }); }
  function points(list, cls) { return h('ul', { class: 'lib-points' + (cls ? ' ' + cls : '') }, list.map(function (x) { return h('li', null, x); })); }
  function steps(list) { var s = ui.steps(list); s.classList.add('lib-steps'); return s; }
  function kv(rows) {
    return h('dl', { class: 'ds-kv lib-kv' }, rows.filter(Boolean).map(function (r) { return [h('dt', null, r[0]), h('dd', null, r[1])]; }));
  }
  function fact(icon, text) { return text ? h('span', { class: 'lib-fact' }, ui.icon(icon), h('span', null, text)) : null; }

  /* ======================================================================
     Route: tools (library: search, purpose chips, tools grouped by family)
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
    return norm([t.abbr, String(t.abbr || '').replace(/[^a-z0-9]/gi, ''), t.name, t.purpose, t.id, groupName(groupKey(t)), familyOf(t).label].join(' '));
  }

  function toolCard(t) {
    var time = clause(t.time);
    if (/^not stated/i.test(time)) time = '';
    var lic = licenceTag(t);
    return h('a', { class: 'ds-card lib-tcard', href: '#tool-' + t.id, 'data-go': 'tool-' + t.id },
      h('span', { class: 'lib-tcard-top' }, h('span', { class: 'lib-abbr' }, toolLabel(t)), statusBadge(t)),
      t.name ? h('span', { class: 'lib-tcard-name' }, t.name) : null,
      h('span', { class: 'lib-facts' },
        fact('users', clause(t.who)),
        fact('clock', [time, itemsText(t)].filter(Boolean).join(' · ')),
        fact('calendar', agesLine(t))),
      lic ? h('span', { class: 'lib-tcard-foot' }, licEl(lic)) : null);
  }

  function renderTools(el) {
    var tools = allTools();
    var nCan = tools.filter(scorable).length;
    el.appendChild(ui.hero({
      h1: true, eyebrow: 'Library', title: 'Tools and scoring',
      text: h('div', null,
        h('p', { class: 'ds-hero-p' }, 'Every screening, rating and interview tool used in adult ADHD assessment: when to use it, how to score it, its licence and where to get it.'),
        h('p', { class: 'ds-note lib-hero-note' }, ui.icon('info'), h('span', null, 'Questionnaires screen and measure. They never diagnose on their own: the diagnosis rests on the clinical interview, the history and collateral information.'))),
      actions: [ui.btn({ label: 'Assessment pathway', kind: 'ghost', go: 'pathway', icon: '→' })],
      aside: tools.length ? tiles([
        { n: tools.length, l: 'tools in the library' },
        { n: nCan, l: 'you can fill in and score here' },
        { n: tools.length - nCan, l: 'described, with where to get them' }]) : null
    }));
    if (!tools.length) {
      el.appendChild(ui.empty('No tools loaded', 'The tools library is not available in this build.', ui.btn({ label: 'Go to home', kind: 'primary', go: 'home' })));
      return;
    }

    var f = readFilters();
    var fams = FAMILIES.map(function (fam) { return { fam: fam, tools: tools.filter(function (t) { return familyOf(t) === fam; }) }; })
      .filter(function (x) { return x.tools.length; });
    f.groups = f.groups.filter(function (g) { return fams.some(function (x) { return x.fam.id === g; }); }).slice(0, 1);

    /* Stage options: pathway stages in order, then any stage a tool names that the pathway lacks. */
    var stageIds = pathway().map(function (s) { return s.id; });
    tools.forEach(function (t) { stagesOf(t).forEach(function (id) { if (stageIds.indexOf(id) < 0) stageIds.push(id); }); });
    if (f.stage && stageIds.indexOf(f.stage) < 0) f.stage = '';

    /* ---- Search, stage, "scored here" and one purpose chip at a time ---- */
    var search = ui.search('Search by name, abbreviation or purpose', function (q) { f.q = q; apply(); saveFilters(f); }, f.q);
    var stageSel = h('select', { id: ui.nid('lib-stage'), class: 'lib-stage-sel' },
      h('option', { value: '' }, 'All stages'),
      stageIds.map(function (id) { return h('option', { value: id }, stageLabel(id)); }));
    stageSel.value = f.stage;
    stageSel.addEventListener('change', function () { f.stage = stageSel.value; apply(); saveFilters(f); });
    var canBtn = h('button', { type: 'button', class: 'ds-chip lib-can', 'aria-pressed': 'false', onclick: function () { f.scorable = !f.scorable; apply(); saveFilters(f); } },
      ui.icon('check'), 'Can be scored here');
    var chipBtns = {};
    function chip(id, label, n) {
      var b = h('button', { type: 'button', class: 'ds-chip', 'aria-pressed': 'false', onclick: function () { f.groups = id ? [id] : []; apply(); saveFilters(f); } },
        label, h('span', { class: 'ds-chip-n' }, String(n), h('span', { class: 'sr-only' }, n === 1 ? ' tool' : ' tools')));
      chipBtns[id] = b;
      return h('li', null, b);
    }
    var chips = h('ul', { class: 'ds-chips lib-fchips', 'aria-label': 'Show one group' },
      [chip('', 'All', tools.length)].concat(fams.map(function (x) { return chip(x.fam.id, x.fam.label, x.tools.length); })));
    var clearBtn = ui.btn({ label: 'Clear filters', kind: 'quiet', small: true, onClick: function () { reset(); search.focus(); } });
    var countEl = h('p', { class: 'lib-count', role: 'status', 'aria-live': 'polite' });

    function reset() {
      f.q = ''; f.groups = []; f.stage = ''; f.scorable = false;
      search.value = ''; stageSel.value = '';
      apply(); saveFilters(f);
    }

    var stageLbl = h('label', { class: 'sr-only', for: stageSel.id }, 'Assessment stage');
    el.appendChild(h('section', { class: 'card lib-bar', role: 'search', 'aria-label': 'Find a tool' },
      h('div', { class: 'lib-bar-row' }, h('div', { class: 'lib-bar-q' }, ui.icon('search'), search),
        h('div', { class: 'lib-bar-f' }, stageLbl, stageSel, canBtn)),
      chips,
      h('div', { class: 'lib-count-row' }, countEl, clearBtn)));

    /* ---- Results: every card is built once; filtering only toggles `hidden`. ---- */
    var sections = fams.map(function (x) {
      var items = x.tools.map(function (t) {
        var card = toolCard(t);
        return { t: t, li: h('li', null, card), hay: haystack(t), stages: stagesOf(t), can: scorable(t) };
      });
      var nEl = h('span', { class: 'lib-fam-n' });
      var sec = section({ id: 'lib-fam-' + x.fam.id, title: [h('span', { class: 'lib-fam-ico' }, ui.icon(x.fam.icon)), h('span', null, x.fam.label), nEl], text: x.fam.text },
        h('ul', { class: 'lib-grid' }, items.map(function (i) { return i.li; })));
      sec.classList.add('lib-fam');
      return { id: x.fam.id, el: sec, items: items, nEl: nEl };
    });
    var emptyEl = ui.empty('No tools match', 'Try another word, choose a different stage or group, or clear the filters.',
      ui.btn({ label: 'Clear filters', kind: 'primary', onClick: function () { reset(); search.focus(); } }));
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
          x.li.hidden = !on;
          if (on) { n++; if (x.can) canShown++; }
        });
        s.el.hidden = !n;
        s.nEl.textContent = String(n);
        shown += n;
      });
      emptyEl.hidden = shown > 0;
      var cur = f.groups[0] || '';
      Object.keys(chipBtns).forEach(function (k) {
        var on = k === cur;
        chipBtns[k].setAttribute('aria-pressed', on ? 'true' : 'false');
        chipBtns[k].classList.toggle('is-on', on);
      });
      canBtn.setAttribute('aria-pressed', f.scorable ? 'true' : 'false');
      canBtn.classList.toggle('is-on', f.scorable);
      var active = !!(f.q || f.groups.length || f.stage || f.scorable);
      clearBtn.hidden = !active;
      countEl.textContent = (active ? 'Showing ' + shown + ' of ' + U.plural(tools.length, 'tool') : 'All ' + U.plural(tools.length, 'tool')) +
        (shown ? ' · ' + canShown + ' can be scored here' : '');
    }
    apply();
  }

  /* ======================================================================
     Route: tool-<id> (hero, then a guide with on-page contents; practice form in its own tab)
     ====================================================================== */

  var tabMemo = {};   // last tab per tool, so refresh() and coming back keep the place

  function factTiles(t) {
    var rows = [
      ['Completed by', clause(t.who)], ['Time', clause(t.time)], ['Ages', ageSpan(t)], ['Items', itemsN(t) ? String(itemsN(t)) : '']
    ].filter(function (r) { return r[1]; });
    return h('div', { class: 'ds-stats lib-tiles' }, rows.map(function (r) {
      return h('div', { class: 'ds-stat' }, h('span', { class: 'lib-tile-k' }, r[0]), h('span', { class: 'lib-tile-v' }, r[1]));
    }));
  }

  function renderTool(el, params) {
    var id = params[0];
    var t = id ? AA.byId('tools', id) : null;
    if (!t) {
      el.appendChild(ui.pageHead({ eyebrow: 'Tools and scoring', title: 'Tool not found',
        lead: 'This tool is not in the library. It may have been renamed or removed.',
        actions: [ui.btn({ label: 'Back to library', kind: 'primary', go: 'tools', icon: '←' })] }));
      return;
    }
    var can = scorable(t), lic = licenceTag(t);
    var tabsEl = null, tabSec = null, toc = null;
    function dropToc() { if (toc && toc.disconnect) toc.disconnect(); toc = null; }
    function openPractise() {
      if (!tabsEl) return;
      tabsEl.show('practise');
      jumpTo(tabSec, '.tab[aria-selected="true"]');
    }
    el.appendChild(ui.hero({
      h1: true, eyebrow: groupName(groupKey(t)), title: toolLabel(t),
      text: h('div', { class: 'lib-hero-text' },
        t.name ? h('p', { class: 'lib-hero-name' }, t.name) : null,
        t.purpose ? h('p', { class: 'ds-hero-p' }, t.purpose) : null,
        h('p', { class: 'lib-hero-tags' }, statusBadge(t), lic ? licEl(lic) : null)),
      actions: [can ? ui.btn({ label: 'Practise scoring', kind: 'primary', icon: '✎', onClick: openPractise }) : null,
        ui.btn({ label: 'Back to library', kind: 'ghost', go: 'tools', icon: '←' })].filter(Boolean),
      aside: factTiles(t)
    }));

    function drawGuide() { dropToc(); var g = guide(t, can ? openPractise : null); toc = g.toc; return g.node; }
    if (can) {
      var tabs = [
        { id: 'guide', label: 'Guide', render: drawGuide },
        { id: 'practise', label: 'Practise scoring', count: itemsN(t), render: function () { dropToc(); return sandbox(t); } }];
      tabsEl = ui.tabs(tabs, tabMemo[t.id] === 'practise' ? 'practise' : 'guide', function (tid) { tabMemo[t.id] = tid; });
      tabSec = h('section', { class: 'lib-tabsec', 'aria-label': toolLabel(t) + ': guide and practice form' }, tabsEl);
      el.appendChild(tabSec);
    } else {
      el.appendChild(drawGuide());
    }
    return dropToc;
  }

  /* The reference guide: When, How, Scoring, Reading the result, Pitfalls and evidence, Licence, Related. */
  function guide(t, onPractise) {
    var secs = [], main = [];
    function sec(id, label, title, content, plain) {
      secs.push({ id: id, label: label });
      main.push(section({ id: id, title: title }, plain ? content : h('div', { class: 'card lib-body' }, content)));
    }

    var when = sentences(t.when);
    sec('lib-t-when', 'When to use it', 'When to use it',
      when.length > 1 ? points(when) : when.length ? h('p', null, when[0]) : h('p', { class: 'muted' }, 'No guidance recorded yet.'));

    var how = sentences(t.how);
    sec('lib-t-how', 'How to give it', 'How to give it', [
      kv([t.who ? ['Completed by', t.who] : null, t.time ? ['Time', t.time] : null, t.ages ? ['Ages', t.ages] : null, itemsText(t) ? ['Items', itemsText(t)] : null]),
      how.length > 1 ? [h('h3', { class: 'lib-h3' }, 'Step by step'), steps(how)]
        : how.length ? h('p', null, how[0]) : h('p', { class: 'muted' }, 'Follow the instructions on the official form.')]);

    sec('lib-t-score', 'Scoring', 'How it is scored', scoringNodes(t));

    /* The first three points in view (the data lists the core rules first); the rest folded. */
    var interp = arr(t.interpretation), more = interp.length > 4 ? interp.slice(3) : [];
    if (interp.length || t.adhdNotes) {
      sec('lib-t-read', 'Reading the result', 'Reading the result', [
        interp.length ? points(more.length ? interp.slice(0, 3) : interp) : null,
        more.length ? fold('More on reading the result', points(more), U.plural(more.length, 'more point')) : null,
        t.adhdNotes ? ui.callout('info', h('p', null, t.adhdNotes), 'In an ADHD assessment') : null]);
    }

    var pit = arr(t.pitfalls), acc = [];
    if (pit.length) acc.push({ title: 'Pitfalls', meta: U.plural(pit.length, 'point'), render: function () { return points(pit, 'lib-warns'); } });
    if (t.psychometrics) acc.push({ title: 'Accuracy and evidence', meta: 'Studies', render: function () { return h('p', { class: 'lib-psy' }, t.psychometrics); } });
    if (acc.length) sec('lib-t-more', 'Pitfalls and evidence', 'Pitfalls and evidence', ui.acc(acc), true);

    sec('lib-t-lic', 'Licence', 'Licence and source', licenceNodes(t));
    sec('lib-t-rel', 'Related', 'Related', relatedNodes(t));

    var toc = ui.toc(secs, { label: 'On this page' });
    var aside = h('div', { class: 'lib-aside' }, toc,
      onPractise ? h('div', { class: 'lib-aside-go' }, ui.btn({ label: 'Practise scoring', kind: 'primary', small: true, icon: '✎', onClick: onPractise })) : null);
    return { node: h('div', { class: 'lib-guide' }, ui.split(main, aside)), toc: toc };
  }

  /* ---- Scoring, explained in words ---- */

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
    var provisional = h('p', { class: 'hint' }, 'The app shows a result band only when every scored item is answered. A part-completed form is marked provisional.');
    if (m === 'sum' || m === 'count') {
      out.push(h('p', { class: 'lib-rule' }, m === 'count'
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
      out.push(h('p', { class: 'lib-rule' }, 'Count the Part A answers that fall in the shaded range. ' + need + ' or more of ' + partA.length + ' is a positive screen.'));
      out.push(h('p', null, 'Part B items describe the symptoms in more detail. They do not change the screen result.' + (max !== null ? ' The app also adds up all item points (0 to ' + max + ') as extra information.' : '')));
      var thr = (t.items || []).filter(function (it) { return it.threshold !== undefined; });
      if (thr.length) {
        out.push(fold('Where the shading starts', ui.table(['Item', 'Part', 'Shaded from'], thr.map(function (it) {
          return [h('span', null, h('span', { class: 'num' }, String(it.n)), it.t ? h('span', { class: 'lib-itemtext' }, it.t) : null),
            it.part || 'B', ui.badge(optLabel(t, it, it.threshold), 'warn')];
        }), 'table-compact lib-thr'), U.plural(thr.length, 'item')));
      }
    } else if (m === 'wfirs') {
      var rule = sc.rule || { twos: 2, threes: 1 };
      out.push(h('p', null, 'Rate each item from 0 to 3, or mark it not applicable. Not-applicable answers are left out of every calculation.'));
      out.push(h('p', { class: 'lib-rule' }, 'A domain counts as impaired when at least ' + U.plural(rule.twos, 'item') + ' ' + (rule.twos === 1 ? 'is' : 'are') + ' rated 2 or more, or at least ' +
        U.plural(rule.threes, 'item') + ' ' + (rule.threes === 1 ? 'is' : 'are') + ' rated 3' + (rule.mean !== undefined ? ', or the domain average is ' + rule.mean + ' or more' : '') + '.'));
      out.push(h('p', null, 'The app reports how many domains are impaired. It reads two or more impaired domains as a positive result.'));
      var doms = sc.domains || [];
      if (doms.length) out.push(ui.table(['Domain', 'Items'], doms.map(function (d) { return [d.label || d.id, ranges(d.items)]; }), 'table-compact'));
      out.push(optionTable(t));
    } else if (m === 'mdq') {
      var p1 = (t.items || []).filter(function (it) { return it.part === '1'; });
      var need1 = sc.part1 || 7;
      out.push(h('p', { class: 'lib-rule' }, 'Three parts. The screen is positive only when all three are met:'));
      out.push(steps([
        { title: 'Part 1', text: need1 + ' or more "yes" answers to the ' + p1.length + ' symptom questions' + (p1.length ? ' (items ' + ranges(p1.map(function (it) { return it.n; })) + ')' : '') + '.' },
        { title: 'Part 2', text: '"yes" to several of these happening during the same period.' },
        { title: 'Part 3', text: 'they caused moderate or serious problems.' }]));
      out.push(h('p', null, 'A high Part 1 count with a "no" to Part 2 or minor problems in Part 3 is a negative screen. Read it alongside the history.'));
    } else if (m === 'pcl5') {
      var two = optLabel(t, null, 2);
      out.push(h('p', { class: 'lib-rule' }, 'Add up the points for every item' + (max !== null ? ' (' + U.plural(of, 'item') + ', 0 to ' + max + ')' : '') + '.'));
      out.push(h('p', null, 'The app also checks the provisional DSM-5 pattern. An item rated 2' + (two !== '2' ? ' ("' + two + '")' : '') + ' or more counts as endorsed.'));
      var cl = sc.clusters || {};
      out.push(ui.table(['Cluster', 'Items', 'Endorsed items needed'], CLUSTERS.map(function (c) {
        return [c[0] + ' · ' + c[1], ranges(cl[c[0]]) || '-', String(c[2])];
      }), 'table-compact'));
      out.push(provisional);
      out.push(optionTable(t));
    } else if (m === 'triage') {
      out.push(h('p', { class: 'lib-rule' }, 'This tool gives a level of risk, not a total. The app checks the levels in order, from the top. The first level with a "yes" to any of its items applies.'));
      var levels = sc.levels || [];
      if (levels.length) {
        out.push(ui.table(['Level', 'Triggered by a yes to', 'Action'], levels.map(function (lv) {
          return [ui.sevChip(lv.sev, lv.label || 'Level'), arr(lv.any).length ? 'Item ' + ranges(lv.any) : '-', lv.text || '-'];
        }), 'table-compact'));
      }
      out.push(h('p', null, 'No "yes" answers gives "No risk items endorsed". This never replaces a full risk assessment.'));
    } else {
      out.push(h('p', { class: 'lib-rule' }, 'Add up the points for every item.'));
    }
    return out;
  }

  function scoringNodes(t) {
    var sc = t.scoring || null;
    var out = [];
    if (!scorable(t)) {
      out.push(ui.callout('info', h('p', null, 'There is no practice form for this tool. Its items are not reproduced here, usually because the licence does not allow it, or because it is a clinician-run interview or a computer test. Use the official materials, then record the result in your assessment notes.'), 'Described, not reproduced'));
    }
    if (!sc) {
      out.push(h('p', null, 'Scoring is set out in the publisher\'s manual and is not reproduced here. See "Reading the result" for how to use the result, and "Licence and source" for where to get the materials.'));
      return out;
    }
    var base = blankScore(t);
    out = out.concat(methodNodes(t, sc, base));

    var bands = AA.components.bands(t);
    if (bands) out.push(h('h3', { class: 'lib-h3' }, 'Score bands'), bands, h('p', { class: 'hint' }, 'Bands describe symptom level. They are not diagnoses.'));
    if (sc.cutoff && sc.cutoff.value !== undefined) {
      out.push(h('h3', { class: 'lib-h3' }, 'Cut-off'), h('p', { class: 'lib-cut' }, h('strong', { class: 'num' }, sc.cutoff.value + ' or more'), sc.cutoff.text ? h('span', null, sc.cutoff.text) : null));
    }
    var subs = arr(sc.subscales);
    if (subs.length) {
      out.push(h('h3', { class: 'lib-h3' }, 'Subscales'), ui.table(['Subscale', 'Items', 'Cut-off or bands'], subs.map(function (s) {
        var res = s.cutoff !== undefined ? s.cutoff + ' or more' :
          arr(s.bands).length ? arr(s.bands).map(function (b) { return (b.max === undefined || b.max === null ? b.min + '+' : b.min + '–' + b.max) + ' ' + b.label; }).join('; ') : '-';
        return [s.label || s.id, ranges(s.items), res];
      }), 'table-compact'));
    }
    var flags = arr(sc.flags);
    if (flags.length) {
      out.push(h('h3', { class: 'lib-h3' }, 'Answers that need action'), h('ul', { class: 'lib-flags' }, flags.map(function (fl) {
        var it = itemOf(t, fl.item);
        var when = fl.equals !== undefined ? 'answered "' + optLabel(t, it, fl.equals) + '"' : (fl.min === undefined || fl.min <= 1) ? 'scored 1 or more' : 'scored ' + fl.min + ' or more';
        return h('li', null, ui.badge(fl.level === 'urgent' ? 'Urgent' : 'Note', fl.level === 'urgent' ? 'err' : 'warn'),
          h('span', null, h('strong', null, 'Item ' + fl.item + ' ' + when + ': '), fl.text || ''));
      })));
    }
    var keyed = (t.items || []).filter(function (it) { return it.score && typeof it.score === 'object'; });
    var rev = (t.items || []).filter(function (it) { return it.reverse; });
    var unscored = (t.items || []).filter(function (it) { return it.unscored; });
    if (keyed.length || rev.length || unscored.length) {
      var nodes = [];
      if (keyed.length) {
        nodes.push(ui.table(['Item', 'Points per answer'], keyed.map(function (it) {
          /* In the order the options appear on the form; values without an option come last. */
          var opts = optsOf(t, it).filter(function (o) { return Object.prototype.hasOwnProperty.call(it.score, String(o.v)); });
          var rest = Object.keys(it.score).filter(function (k) { return !opts.some(function (o) { return String(o.v) === k; }); });
          return [String(it.n), opts.map(function (o) { return o.l + ' = ' + it.score[String(o.v)]; })
            .concat(rest.map(function (k) { return k + ' = ' + it.score[k]; })).join(' · ')];
        }), 'table-compact'));
      }
      if (rev.length) nodes.push(h('p', null, 'Reverse scored: item ' + ranges(rev.map(function (it) { return it.n; })) + '.'));
      if (unscored.length) nodes.push(h('p', null, 'Not scored (context only): item ' + ranges(unscored.map(function (it) { return it.n; })) + '.'));
      out.push(h('h3', { class: 'lib-h3' }, 'Items scored differently'), nodes);
    }
    if (!scorable(t)) out.push(h('p', { class: 'hint' }, 'Score this tool on the official form.'));
    return out;
  }

  /* Licence: the first sentence and the right action in view; the full terms and citation folded. */
  function licenceNodes(t) {
    var can = scorable(t);
    var lic = String(t.licence || '').trim();
    var first = sentences(lic)[0] || '';
    var file = typeof t.file === 'string' && t.file && !/^\s*javascript:/i.test(t.file) ? t.file : null;
    var acts = [];
    if (safeUrl(t.url)) acts.push(extLink(t.url, 'Official page', 'btn btn-sm'));
    if (file) acts.push(h('a', { class: 'btn btn-sm btn-ghost', href: file, target: '_blank', rel: 'noopener' }, 'Open the form (PDF)', h('span', { class: 'sr-only' }, ' (opens in a new tab)')));
    var rows = [['Licence', lic || h('span', { class: 'muted' }, 'Not stated')]];
    if (t.source) rows.push(['Source', t.source]);
    rows.push(['Official page', safeUrl(t.url) ? extLink(t.url) : h('span', { class: 'muted' }, 'No official page recorded')]);
    return [
      first ? h('p', { class: 'lib-lic-first' }, first) : h('p', { class: 'muted' }, 'No licence statement recorded.'),
      can ? ui.callout('info', h('p', null, 'The items are shown in this app for practice and clinical use. Check the licence terms before you copy the form anywhere else, and use the official version if your service requires it.'))
        : ui.callout('warn', h('p', null, 'This is a licensed instrument. Get the official form, manual and scoring materials from the publisher or the official page. Do not copy, adapt or translate it without permission.'), 'Obtain it from the publisher'),
      acts.length ? h('div', { class: 'row lib-acts' }, acts) : null,
      file ? h('p', { class: 'hint' }, 'The PDF is a copy kept with this app, reproduced under the licence. Check the official page for the latest version.') : null,
      fold('Full licence terms and source', kv(rows), rows.length + ' details')];
  }

  /* Related differentials, pathway stages and a shortcut into the current assessment. */
  function relatedNodes(t) {
    var conds = condsFor(t.id);
    var st = stagesOf(t);
    var T = (AA.diagnosis && AA.diagnosis.STEP_TOOLS) || {};
    var stepId = arr(T.screen).indexOf(t.id) > -1 ? 'screen' : arr(T.comorbid).indexOf(t.id) > -1 ? 'comorbid' : null;
    var step = stepId ? (AA.STEP_LIST || []).filter(function (s) { return s.id === stepId; })[0] : null;
    var last = null;
    try { last = AA.shell && AA.shell.lastAssessment ? AA.shell.lastAssessment() : null; } catch (e) { last = null; }
    function condChips(list) {
      return h('ul', { class: 'ds-chips lib-links' }, list.map(function (c) {
        return h('li', null, h('a', { class: 'ds-chip', href: '#cond-' + c.id, 'data-go': 'cond-' + c.id }, c.name || c.id));
      }));
    }
    /* Six in view; a long list folds the rest. */
    var condNode = !conds.length ? h('span', { class: 'muted' }, 'No differential in the library lists this tool as a screen.')
      : conds.length > 8 ? [condChips(conds.slice(0, 6)), fold('Show ' + (conds.length - 6) + ' more', condChips(conds.slice(6)))]
        : condChips(conds);
    return kv([
      ['Differentials that use it', condNode],
      ['Pathway stages', st.length ? h('ul', { class: 'lib-stage-links' }, st.map(function (id) { return h('li', null, stageLink(id)); }))
        : h('span', { class: 'muted' }, 'Not assigned to a pathway stage.')],
      step ? ['In the assessment', h('div', { class: 'lib-use' },
        h('p', null, 'Built into the step "' + step.title + '".'),
        last && scorable(t) ? ui.btn({ label: 'Score it for ' + ((last.patient && last.patient.ref) || 'the current patient'), kind: 'primary', small: true,
          go: 'assess-' + last.id + '-' + stepId }) : null)] : null]);
  }

  /* Practice form. Answers persist in AA.progress('sandbox.<id>') and are never linked to a patient.
     A slim strip under the form header follows progress on long forms; the full score sits under the items. */
  function sandbox(t) {
    var key = 'sandbox.' + t.id;
    var host = h('div', { class: 'lib-sandbox' });
    var qHost = h('div', { class: 'lib-sb-q' });
    var status = h('span', { class: 'lib-sb-status' });
    var meter = h('span', { class: 'lib-sb-bar' }, h('span'));
    var stripText = h('span', { class: 'lib-sb-text' });
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
    var seeBtn = ui.btn({ label: 'See the score', kind: 'quiet', small: true, onClick: function () {
      var foot = qHost.querySelector('.q-foot');
      if (foot) jumpTo(foot, '.q-foot-title');
    } });
    var strip = h('div', { class: 'lib-sb-strip' }, meter, stripText, seeBtn);
    function updateStatus() {
      var a = answers(), n = Object.keys(a).length;
      status.textContent = n ? U.plural(n, 'answer') + ' saved in your profile.' : 'Nothing saved yet.';
      clearBtn.disabled = !n;
      var r = null;
      try { r = AA.scoring.score(t, a); } catch (e) { r = null; }
      strip.hidden = !r;
      if (!r) return;
      var p = r.of ? Math.round(100 * r.answered / r.of) : 0;
      meter.firstChild.style.width = p + '%';
      stripText.textContent = r.answered + ' of ' + r.of + ' answered' + (typeof r.total === 'number' && r.max ? ' · total ' + r.total + ' of ' + r.max : '');
    }
    function build() {
      U.clear(qHost);
      qHost.appendChild(AA.components.questionnaire(t, { answers: answers(), onAnswer: function (n, v) {
        AA.progress.set(key + '.' + n, v === null ? undefined : v);
        updateStatus();
      } }));
    }
    host.appendChild(h('div', { class: 'lib-sb-head' },
      h('div', { class: 'lib-sb-text-wrap' },
        h('h2', null, 'Practice form'),
        h('p', null, 'Fill it in to see exactly how the tool scores. Your answers stay in your profile so you can come back to them. They are not linked to any patient and never appear in an assessment.'),
        h('p', { class: 'lib-sb-meta' }, ui.icon('check'), status)),
      clearBtn));
    host.appendChild(qHost);
    host.appendChild(strip);   // after the items, so it sticks to the bottom of the screen while you fill them in
    build(); updateStatus();
    return host;
  }

  /* ======================================================================
     Route: pathway[-<stageId>] (journey map, one stage at a time, the tool table, guidelines)
     ====================================================================== */

  /* One stage: what happens as numbered steps, its tools as chips, tips and sources folded. */
  function stageBody(s) {
    var what = arr(s.what), tips = arr(s.tips), sources = arr(s.sources);
    var tools = arr(s.tools).map(function (id) {
      var t = AA.byId('tools', id);
      if (!t) return h('li', null, h('span', { class: 'ds-chip' }, id));
      return h('li', null, h('a', { class: 'ds-chip lib-tchip', href: '#tool-' + id, 'data-go': 'tool-' + id, title: t.name || null },
        toolLabel(t), scorable(t) ? h('span', { class: 'lib-tchip-mark' }, h('span', { 'aria-hidden': 'true' }, '✓'), h('span', { class: 'sr-only' }, ' (can be scored here)')) : null));
    });
    var anyScored = arr(s.tools).some(function (id) { var t = AA.byId('tools', id); return t && scorable(t); });
    return h('div', { class: 'lib-stage' },
      what.length ? [h('h3', { class: 'lib-h3' }, 'What happens'), steps(what)] : null,
      tools.length ? [h('h3', { class: 'lib-h3' }, 'Tools for this stage'), h('ul', { class: 'ds-chips lib-tchips' }, tools),
        anyScored ? h('p', { class: 'hint' }, '✓ marks a tool you can practise scoring in this app.') : null] : null,
      tips.length ? fold('Practical tips', points(tips), U.plural(tips.length, 'tip')) : null,
      sources.length ? fold('Sources', points(sources, 'lib-srcs'), U.plural(sources.length, 'source')) : null);
  }

  /* "Which tool, when": tools by row (grouped by family), stages by column; a tick plus screen-reader text marks use. */
  function matrix(stages) {
    var tools = allTools().filter(function (t) { return stages.some(function (s) { return inStage(t, s); }); });
    if (!tools.length || !stages.length) return ui.empty('Nothing to show yet', 'No tools are linked to the pathway stages.');
    var cols = stages.length + 1;
    var head = h('thead', null, h('tr', null,
      h('th', { scope: 'col', class: 'lib-mx-tool' }, 'Tool'),
      stages.map(function (s, i) {
        return h('th', { scope: 'col', class: 'lib-mx-stage', title: s.title || s.id },
          h('span', { class: 'lib-mx-n' }, String(stageNo(s, i))), h('span', { class: 'lib-mx-t' }, s.title || stageName(s.id)));
      })));
    var bodies = FAMILIES.map(function (fam) {
      var rows = tools.filter(function (t) { return familyOf(t) === fam; });
      if (!rows.length) return null;
      return h('tbody', null,
        h('tr', { class: 'lib-mx-group' }, h('th', { scope: 'rowgroup', colspan: String(cols) }, h('span', null, fam.label))),
        rows.map(function (t) {
          return h('tr', null,
            h('th', { scope: 'row', class: 'lib-mx-tool' },
              h('span', { class: 'lib-mx-head' }, h('a', { href: '#tool-' + t.id, 'data-go': 'tool-' + t.id }, toolLabel(t)), statusBadge(t)),
              t.name ? h('span', { class: 'lib-mx-name' }, t.name) : null),
            stages.map(function (s) {
              var on = inStage(t, s);
              return h('td', { class: 'lib-mx-cell' + (on ? ' lib-mx-on' : '') },
                on ? [h('span', { 'aria-hidden': 'true' }, '✓'), h('span', { class: 'sr-only' }, 'Used')] : h('span', { class: 'sr-only' }, 'Not used'));
            }));
        }));
    });
    return h('div', null,
      h('p', { class: 'hint lib-mx-key' }, 'Columns are the numbered stages. ✓ marks the stages where a tool is used. On a narrow screen, scroll the table sideways.'),
      h('div', { class: 'table-wrap lib-mx-wrap', tabindex: '0', role: 'region', 'aria-label': 'Which tool, when (scrolls sideways)' },
        h('table', { class: 'table lib-matrix' }, h('caption', { class: 'sr-only' }, 'Tools by assessment stage'), head, bodies)));
  }

  function guidelineBody(g) {
    var kp = arr(g.keyPoints), as = arr(g.assessment);
    return h('div', { class: 'lib-gl' },
      g.org || g.year ? kv([g.org ? ['From', g.org] : null, g.year ? ['Published', g.year] : null]) : null,
      g.scope ? h('p', { class: 'lib-gl-scope' }, g.scope) : null,
      as.length ? [h('h4', { class: 'lib-h4' }, 'What it says about assessment'), points(as)] : null,
      kp.length ? [h('h4', { class: 'lib-h4' }, 'Key recommendations'), points(kp)] : null,
      safeUrl(g.url) ? h('p', { class: 'lib-gl-link' }, extLink(g.url, 'Read the guideline on ' + hostOf(g.url))) : null);
  }

  function renderPathway(el, params) {
    var stages = pathway();
    var target = params && params[0] ? params[0] : null;
    var gl = (AA.data.guidelines || []).filter(function (g) { return g && g.id; });
    var linked = allTools().filter(function (t) { return stages.some(function (s) { return inStage(t, s); }); });
    var stepper = null;
    el.appendChild(ui.hero({
      h1: true, eyebrow: 'Library', title: 'Assessment pathway',
      text: 'The order of a full adult ADHD assessment and which tool belongs where, built from UK NICE NG87 and international guidance.',
      actions: [stages.length ? ui.btn({ label: 'Walk through the stages', kind: 'primary', onClick: function () { stepper.show(0); jumpTo(stepper); } }) : null,
        ui.btn({ label: 'Tools and scoring', kind: 'ghost', go: 'tools', icon: '→' })].filter(Boolean),
      aside: stages.length ? tiles([
        { n: stages.length, l: 'stages, in order' },
        { n: linked.length, l: 'tools linked to a stage' },
        { n: gl.length, l: 'guidelines behind it' }]) : null
    }));
    if (!stages.length) {
      el.appendChild(ui.empty('The pathway is not available', 'Pathway content has not loaded in this build.'));
    } else {
      var start = 0;
      stages.forEach(function (s, i) { if (s.id === target) start = i; });
      /* Journey map: every stage in order; choosing one opens it in the stepper below. */
      var nodes = [];
      var map = h('ol', { class: 'lib-journey' }, stages.map(function (s, i) {
        var tl = arr(s.tools).length, wl = arr(s.what).length;
        var b = h('button', { type: 'button', class: 'lib-jnode', onclick: function () { stepper.show(i); jumpTo(stepper); } },
          h('span', { class: 'lib-jn', 'aria-hidden': 'true' }, String(stageNo(s, i))),
          h('span', { class: 'lib-jbody' },
            h('span', { class: 'lib-jt' }, h('span', { class: 'sr-only' }, 'Stage ' + stageNo(s, i) + ': '), s.title || stageName(s.id)),
            h('span', { class: 'lib-jm' }, [wl ? U.plural(wl, 'step') : null, tl ? U.plural(tl, 'tool') : null].filter(Boolean).join(' · '))));
        nodes.push(b);
        return h('li', null, b);
      }));
      var onStage = function (i) {
        nodes.forEach(function (b, k) { if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
        relabelNext(stepper, i < stages.length - 1 ? 'Next: stage ' + stageNo(stages[i + 1], i + 1) + ' →' : 'Last stage');
      };
      stepper = ui.stepper(stages.map(function (s, i) {
        return { title: s.title || stageName(s.id), sub: s.who ? 'Who: ' + s.who : null, label: String(stageNo(s, i)), render: function () { return stageBody(s); } };
      }), {
        start: start, label: 'Stages of a full assessment',
        eyebrow: function (i) { return 'Stage ' + stageNo(stages[i], i) + ' of ' + stages.length; },
        onChange: function (i) { onStage(i); }
      });
      stepper.classList.add('lib-stepper');
      onStage(stepper.index());
      el.appendChild(section({ id: 'lib-pw-map', title: 'The journey at a glance', text: U.plural(stages.length, 'stage') + ', from referral to follow-up. Choose a stage to open it below.' }, map));
      el.appendChild(section({ id: 'lib-pw-stages', title: 'Stage by stage', text: 'Who does it, what happens and which tools belong there. Tips and sources are folded away.' }, stepper));
      el.appendChild(section({ id: 'lib-pw-mx', title: 'Which tool, when', text: 'Every tool linked to a stage, grouped by what it measures. Tools marked "Scored here" have a practice form in this app; the rest are described with where to get them.' },
        fold('Show the table', matrix(stages), linked.length + ' tools · ' + stages.length + ' stages')));
    }
    el.appendChild(section({ id: 'lib-pw-gl', title: 'Guidelines behind the pathway', text: 'What each guideline says about assessment, and its key recommendations. Open one to read it.' },
      gl.length ? ui.acc(gl.map(function (g) {
        return { title: g.name || g.id, meta: clause(g.year) || null, render: function () { return guidelineBody(g); } };
      })) : ui.empty('No guidelines loaded', 'Guideline summaries are not available in this build.')));

    if (target && stepper && stages.some(function (s) { return s.id === target; })) setTimeout(function () { jumpTo(stepper); }, 0);
  }

  /* ---------- Routes ---------- */
  AA.router.register('tools', { title: 'Tools and scoring', render: function (el) { renderTools(el); } });
  AA.router.register('tool', {
    title: function (p) { var t = p && p[0] ? AA.byId('tools', p[0]) : null; return t ? toolLabel(t) + ' · Tools' : 'Tool'; },
    render: function (el, params) { return renderTool(el, params); }
  });
  AA.router.register('pathway', { title: 'Assessment pathway', render: function (el, params) { renderPathway(el, params); } });

  AA.views.library = { groupName: groupName, stageName: stageName };
})(window.AA);
