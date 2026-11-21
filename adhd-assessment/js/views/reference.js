/* Reference pages used during the interview: differential diagnosis (conditions A to Z, the differential
   finder, and how to tell co-occurring from better explained), one condition's reference page, the diagnostic
   criteria, the question bank and one symptom's reference page. Routes: "ddx[-finder]", "cond-<id>",
   "criteria", "bank[-<symptomId>]" and "sym-<id>" (see ARCHITECTURE.md, section 6).
   Layout follows DESIGN.md: a page head, a hero where it helps, tabs or an on-page contents list (ui.split +
   ui.toc) for long pages, depth folded away and sources in one closed disclosure at the end.
   Content comes from AA.data.ddx, symptoms, criteria, ageBands, impairment, history, risk and tools; this file
   only arranges it (long paragraphs are split into their sentences, never reworded) and never throws on
   missing or partial data. Per-clinician state lives in AA.progress 'sandbox.ddxfinder' = {f: {<featureId>:
   true}} (practice ticks in the differential finder, never linked to a patient). Tab and filter choices are
   remembered in memory for the session only. The question bank index is built once and cached. */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui;

  /* ---------- Data helpers (never throw on missing or partial data) ---------- */

  function arr(x) { return Array.isArray(x) ? x.filter(function (v) { return v !== null && v !== undefined && v !== ''; }) : (x ? [x] : []); }
  function isObj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function txt(x) { return typeof x === 'string' ? x.trim() : (typeof x === 'number' ? String(x) : ''); }
  function texts(x) { return arr(x).map(txt).filter(Boolean); }
  function norm(s) { return String(s || '').toLowerCase(); }
  function wordsOf(q) { return norm(q).split(/\s+/).filter(Boolean); }
  function li(t) { return h('li', null, t); }
  function ext(a, b) { return Object.assign({}, a, b); }
  function safeId(s) { return String(s || '').replace(/[^a-z0-9_]/gi, '_'); }
  function fmt(n) { try { return Number(n).toLocaleString('en-GB'); } catch (e) { return String(n); } }
  function cap(s) { s = txt(s); return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
  function lastA() { try { return AA.shell && AA.shell.lastAssessment ? AA.shell.lastAssessment() : null; } catch (e) { return null; } }
  function go(token, label, cls) { return h('a', { href: '#' + token, 'data-go': token, class: cls || null }, label); }
  function muted(t) { return h('p', { class: 'muted rf-none' }, t); }

  function copyLines(lines, what) {
    U.copyText(lines.join('\n')).then(function (ok) {
      U.toast(ok ? what + ' copied' : 'Copy failed. Your browser blocked the clipboard.', ok ? 'ok' : 'err');
    });
  }
  function numbered(list) { return list.map(function (t, i) { return (i + 1) + '. ' + t; }); }

  /* A paragraph as its sentences, so long text can be shown as a short list. Never splits after "et al.",
     "e.g." or "i.e.", or inside numbers such as 1.3.3 or 18.6%. */
  var ABBR = /(?:\bet al|\be\.g|\bi\.e|\bvs|\bapprox|\bcf)\.$/i;
  function sentences(s) {
    var t = txt(s), out = [], start = 0, m;
    if (!t) return out;
    var re = /[.!?]['"’”)\]]*\s+(?=[A-Z0-9'"‘“(])/g;
    while ((m = re.exec(t))) {
      if (ABBR.test(t.slice(start, m.index + 1))) continue;
      var cut = m.index + m[0].length, part = t.slice(start, cut).trim();
      if (part) out.push(part);
      start = cut;
    }
    var rest = t.slice(start).trim();
    if (rest) out.push(rest);
    return out;
  }
  function bullets(s, cls) { var l = sentences(s); return l.length > 1 ? h('ul', { class: 'rf-dots' + (cls ? ' ' + cls : '') }, l.map(li)) : (l.length ? h('p', { class: cls || null }, l[0]) : null); }

  /* Percentages in bold, so the figures stand out without being lifted out of their sentence. */
  function figures(s) {
    var t = txt(s), out = [], pos = 0, m, re = /\d+(?:[.,]\d+)?(?:\s?(?:-|–|to)\s?\d+(?:[.,]\d+)?)?\s?%/g;
    while ((m = re.exec(t))) {
      if (m.index > pos) out.push(t.slice(pos, m.index));
      out.push(h('strong', { class: 'rf-fig' }, m[0]));
      pos = m.index + m[0].length;
    }
    if (pos < t.length) out.push(t.slice(pos));
    return out;
  }

  /* "Label: the rest" -> ['Label', 'The rest'] when a short label leads the line; otherwise null. */
  function labelSplit(s) {
    var t = txt(s), i = t.indexOf(': ');
    if (i < 2 || i > 60) return null;
    var k = t.slice(0, i);
    if (/[.;!?]\s/.test(k)) return null;
    return [k, cap(t.slice(i + 2))];
  }
  /* "What changed" as a short timeline: a line labelled "DSM-IV to DSM-5 (2013): ..." starts a group, and the
     lines after it belong to that change until the next one. Without such labels, plain label rows. */
  function changeGroups(list) {
    var items = texts(list), groups = [];
    var isStep = function (k) { return /^(DSM|ICD)[\w.-]* to (DSM|ICD)[\w.-]*/.test(k); };
    if (!items.some(function (t) { var p = labelSplit(t); return p && isStep(p[0]); })) return labelRows(items, 'rf-kv-changes');
    items.forEach(function (t) {
      var p = labelSplit(t);
      if (p && isStep(p[0])) groups.push({ k: p[0], first: p[1], rest: [] });
      else if (groups.length) groups[groups.length - 1].rest.push(t);
      else groups.push({ k: '', first: t, rest: [] });
    });
    return h('ol', { class: 'rf-timeline' }, groups.map(function (g) {
      return h('li', null, g.k ? h('h2', { class: 'rf-timeline-k' }, g.k) : null,
        h('p', { class: 'rf-timeline-p' }, g.first),
        g.rest.length ? labelRows(g.rest, 'rf-kv-changes') : null);
    }));
  }

  /* Label and value rows (dl.ds-kv) for lines written as "Label: text"; lines without a label span the row. */
  function labelRows(list, cls) {
    return h('dl', { class: 'ds-kv rf-kv' + (cls ? ' ' + cls : '') }, texts(list).map(function (t) {
      var p = labelSplit(t);
      return p ? [h('dt', null, p[0]), h('dd', null, p[1])] : h('dd', { class: 'rf-kv-wide' }, t);
    }));
  }

  /* Previous / next links at the foot of a reference page. p, n: {go, t} or null. */
  function pnNav(p, n, label) {
    if (!p && !n) return null;
    return h('nav', { class: 'rf-pn', 'aria-label': label },
      p ? h('a', { class: 'rf-pn-link', href: '#' + p.go, 'data-go': p.go },
        h('span', { class: 'rf-pn-k' }, h('span', { 'aria-hidden': 'true' }, '← '), 'Previous'), h('span', { class: 'rf-pn-t' }, p.t)) : h('span'),
      n ? h('a', { class: 'rf-pn-link rf-pn-next', href: '#' + n.go, 'data-go': n.go },
        h('span', { class: 'rf-pn-k' }, 'Next', h('span', { 'aria-hidden': 'true' }, ' →')), h('span', { class: 'rf-pn-t' }, n.t)) : null);
  }

  function notFound(el, eyebrow, title, lead, back, backLabel) {
    el.appendChild(ui.pageHead({ eyebrow: eyebrow, title: title, lead: lead,
      actions: [ui.btn({ label: backLabel, kind: 'primary', go: back, icon: '←' })] }));
  }

  /* Phones get one thing at a time: paired lists become tabs, card grids become a compact accordion. */
  function narrow() { try { return window.matchMedia('(max-width: 640px)').matches; } catch (e) { return false; } }

  /* Two (or more) lists side by side on wide screens, or as tabs on phones.
     parts: [{id, tab (short tab label), title (column heading, nodes allowed), count, cls, node}] */
  function pairOrTabs(parts, wrapCls) {
    parts = parts.filter(Boolean);
    if (narrow() && parts.length > 1) {
      var t = ui.tabs(parts.map(function (p) {
        return { id: p.id, label: p.tab, count: p.count, render: function () { return h('div', { class: (p.cls || '') + ' is-tab' }, p.node); } };
      }));
      t.classList.add('rf-pairtabs');
      return t;
    }
    return h('div', { class: wrapCls }, parts.map(function (p) {
      return h('div', { class: p.cls || null }, h('h3', { class: 'rf-k3' }, p.title, p.count !== undefined ? h('span', { class: 'rf-n' }, String(p.count)) : null), p.node);
    }));
  }

  /* ui.stats with this view's class (compact tiles that sit side by side on phones too). */
  function statTiles(items) { var s = ui.stats(items); s.classList.add('rf-stats'); return s; }

  /* ui.split with this view's class, so its contents list and side column can be tuned here. */
  function splitOf(main, aside, cls) { var s = ui.split(main, aside); s.classList.add('rf-split'); if (cls) s.classList.add(cls); return s; }

  /* One closed "Sources" disclosure (DESIGN.md rule 6). */
  function sourcesBox(refs) {
    var list = texts(refs);
    if (!list.length) return null;
    return ui.details('Sources (' + list.length + ')', h('ol', { class: 'rf-refs' }, list.map(li)), { cls: 'guide-src rf-src' });
  }

  /* Cards with block content (lists), in the design system's card grid. items: [{icon, title, body, tone}] */
  function infoCards(items, wide) {
    return h('ul', { class: 'ds-cards rf-icards' + (wide ? ' is-2' : '') }, items.filter(Boolean).map(function (x) {
      return h('li', null, h('div', { class: 'ds-card' + (x.tone ? ' tone-' + x.tone : '') },
        h('div', { class: 'rf-icard-head' }, x.icon ? h('span', { class: 'ds-card-ico', 'aria-hidden': 'true' }, ui.icon(x.icon)) : null, h('h3', { class: 'ds-card-t' }, x.title)),
        h('div', { class: 'ds-card-p' }, x.body)));
    }));
  }

  /* Chips that pick one group of items at a time; the chosen group's items show below.
     groups: [{k, label, items}] ; memo: object holding the chosen key under memoKey. */
  function chipPicker(groups, memo, memoKey, label, listCls) {
    groups = groups.filter(function (g) { return g.items.length; });
    if (!groups.length) return null;
    var cur = groups.filter(function (g) { return g.k === memo[memoKey]; })[0] || groups[0];
    var body = h('div', { class: 'rf-pick-body', 'aria-live': 'polite' });
    var chips = ui.chips(groups.map(function (g) { return { label: g.label, n: g.items.length, on: g === cur, onClick: function () { show(g); } }; }));
    var btns = U.$$('button', chips);
    function show(g) {
      cur = g; memo[memoKey] = g.k;
      btns.forEach(function (b, i) { var on = groups[i] === g; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      U.clear(body);
      body.appendChild(h('ul', { class: 'rf-dots ' + (listCls || 'rf-cols2') }, g.items.map(li)));
    }
    show(cur);
    return h('div', { class: 'rf-pick' }, h('div', { class: 'rf-chiprow', role: 'group', 'aria-label': label }, chips), body);
  }

  /* ---------- Differentials ---------- */

  /* Condition groups in display order (same labels as the assessment's differential step), with an icon and
     a one-line purpose for the A to Z list. */
  var GROUPS = { mood: 'Mood', anxiety: 'Anxiety and obsessive-compulsive', trauma: 'Trauma and stress', personality: 'Personality',
    neurodevelopmental: 'Neurodevelopmental', substance: 'Substances and behavioural addictions', psychosis: 'Psychosis', sleep: 'Sleep',
    medical: 'Physical health and medicines', cognitive: 'Cognitive', other: 'Other explanations' };
  var GROUP_ORDER = ['mood', 'anxiety', 'trauma', 'personality', 'neurodevelopmental', 'substance', 'psychosis', 'sleep', 'medical', 'cognitive', 'other'];
  var GROUP_INFO = {
    mood: ['heart', 'Depression and bipolar conditions: episodes or long spells that change mood, energy and drive.'],
    anxiety: ['repeat', 'Worry, fear and compulsions that pull attention away.'],
    trauma: ['shield', 'Reactions to trauma, early adversity and long-term stress.'],
    personality: ['users', 'Long-standing patterns of emotion, relationships and behaviour.'],
    neurodevelopmental: ['brain', 'Conditions that start in early development and can occur alongside ADHD.'],
    substance: ['drop', 'Substances, gambling and gaming that can affect attention and self-control.'],
    psychosis: ['eye', 'Psychotic disorders and the at-risk mental state.'],
    sleep: ['moon', 'Sleep disorders that cause poor focus, tiredness or restlessness.'],
    medical: ['pill', 'Physical conditions and medicines that can affect attention, energy or memory.'],
    cognitive: ['clock', 'Memory and thinking problems that start in mid or later life.'],
    other: ['compass', 'Other explanations to weigh: normal variation, high ability, eating disorders, feigned symptoms, and behaviour or circumstances in children.']
  };
  var COEXIST = { yes: ['Can co-occur', 'ok'], sometimes: ['Sometimes co-occurs', 'info'], no: ['Alternative only', 'neutral'] };
  var COEXIST_N = { yes: 'Yes', sometimes: 'Sometimes', no: 'No' };
  var COEXIST_TEXT = { yes: 'Yes. It often occurs alongside ADHD.', sometimes: 'Sometimes.', no: 'No. It is an alternative explanation rather than a co-occurring condition.' };
  var BAND = { strong: ['Strong fit', 'warn'], possible: ['Possible fit', 'info'], weak: ['Weak fit', 'neutral'] };
  var WEIGHT_TEXT = { 1: 'weak', 2: 'moderate', 3: 'strong' };
  /* Young people's age bands (ARCHITECTURE.md, AA.diagnosis.band) and their core differential lists (ageBands). */
  var YOUNG_BANDS = [['child', 6, 11], ['teen', 12, 16], ['y17', 17, 17]];
  var AGES = [['all', 'All ages'], ['adult', 'Adults'], ['young', 'Young people']];

  function groupKey(c) { return txt(c.group) || 'other'; }
  function groupLabel(g) { return GROUPS[g] || (g.charAt(0).toUpperCase() + g.slice(1)); }
  function conds() { return arr(AA.data.ddx).filter(function (c) { return isObj(c) && txt(c.id); }); }
  function groupsOf(list) {
    var seen = [];
    list.forEach(function (c) { if (seen.indexOf(groupKey(c)) < 0) seen.push(groupKey(c)); });
    return seen.sort(function (x, y) {
      var a = GROUP_ORDER.indexOf(x), b = GROUP_ORDER.indexOf(y);
      return (a < 0 ? 99 : a) - (b < 0 ? 99 : b);
    });
  }
  /* Conditions grouped, then in data order. Previous/next and the A to Z list use the same order. */
  function condsOrdered() {
    var list = conds(), out = [];
    groupsOf(list).forEach(function (g) { list.forEach(function (c) { if (groupKey(c) === g) out.push(c); }); });
    return out;
  }
  function condName(c) { return txt(c.name) || c.id; }
  /* "Depression (major depressive disorder)" -> "Depression" for titles and running text, and the bracket
     on its own ("major depressive disorder") for a subtitle. */
  function shortName(c) { var n = condName(c); return n.replace(/\s*\([^)]*\)\s*$/, '') || n; }
  function subName(c) { var m = condName(c).match(/\(([^)]*)\)\s*$/); return m && shortName(c) !== condName(c) ? txt(m[1]) : ''; }
  function condById(id) { var l = conds(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function features(c) { return arr(c.features).filter(function (f) { return isObj(f) && txt(f.id); }); }
  function weightOf(f) { return U.clamp(parseInt(f.w, 10) || 1, 1, 3); }
  /* Leading ICD-11 code for compact use ("6A70 single episode..." -> "6A70"); '' when the field starts with words. */
  function icdShort(c) { var m = txt(c.icd11).match(/^([0-9A-Z]{4}(?:\.[0-9A-Z]+)?(?:-[0-9A-Z]{4}(?:\.[0-9A-Z]+)?)?)(?![0-9A-Za-z])/); return m ? m[1] : ''; }
  function icdRest(c) { var code = icdShort(c); return code ? txt(c.icd11).slice(code.length).replace(/^[\s:;,.-]+/, '') : ''; }
  function coexistBadge(c) { var m = COEXIST[c.coexist]; return m ? ui.badge(m[0], m[1]) : null; }
  function weightTag(w) {
    return h('span', { class: 'rf-w', title: 'Weight ' + w + ' of 3' },
      h('span', { class: 'rf-w-dots', 'aria-hidden': 'true' }, '●●●'.slice(0, w) + '○○○'.slice(0, 3 - w)),
      h('span', { class: 'rf-w-t' }, WEIGHT_TEXT[w]), h('span', { class: 'sr-only' }, ' pointer, weight ' + w + ' of 3'));
  }
  /* Ages at which the condition is on a young person's core list: '6 to 17', '12 to 17', '6 to 11 and 17' or ''. */
  function youngCore(c) {
    var ab = isObj(AA.data.ageBands) ? AA.data.ageBands : {}, spans = [];
    YOUNG_BANDS.forEach(function (b) {
      var info = isObj(ab[b[0]]) ? ab[b[0]] : null;
      if (!info || arr(info.ddxCore).indexOf(c.id) < 0) return;
      var last = spans[spans.length - 1];
      if (last && last[1] + 1 === b[1]) last[1] = b[2]; else spans.push([b[1], b[2]]);
    });
    return spans.map(function (s) { return s[0] === s[1] ? String(s[0]) : s[0] + ' to ' + s[1]; }).join(' and ');
  }
  function ageOk(c, age) { var a = txt(c.ages) || 'all'; return age === 'all' || a === 'all' || a === age; }
  function coreFor(c, age) { var y = !!youngCore(c); return age === 'adult' ? !!c.core : age === 'young' ? y : (!!c.core || y); }
  function ageBadge(c) { return c.ages === 'young' ? ui.badge('Young people only', 'info') : c.ages === 'adult' ? ui.badge('Adults only', 'info') : null; }

  /* Score as the assessment does (AA.diagnosis.ddxScore), with a local fallback. */
  function scoreFor(c, ticks) {
    try { if (AA.diagnosis && AA.diagnosis.ddxScore) return AA.diagnosis.ddxScore(c, { f: ticks }); } catch (e) { /* fall through */ }
    var max = 0, score = 0, checked = 0;
    features(c).forEach(function (f) { var w = weightOf(f); max += w; if (ticks[f.id]) { score += w; checked++; } });
    var pct = max ? Math.round(100 * score / max) : 0;
    return { score: score, max: max, pct: pct, checked: checked, band: !score ? 'none' : pct >= 50 ? 'strong' : pct >= 25 ? 'possible' : 'weak' };
  }

  /* ---------- Symptoms ---------- */

  var DIMS = [['IA', 'Inattention', 'A1'], ['HI', 'Hyperactivity and impulsivity', 'A2']];
  var PROBE_LABEL = { frequency: 'How often', severity: 'How severe', pervasive: 'In which settings', duration: 'How long',
    peers: 'Compared with others', impact: 'Impact', compensation: 'Coping and compensation', onset: 'When it started' };
  var SPECIAL = [['women', 'Women and girls'], ['older', 'Older adults'], ['highIQ', 'High ability or high IQ'],
    ['sud', 'Substance use'], ['asd', 'Autism'], ['culture', 'Culture and language'], ['young', 'Young people']];
  var ANCHOR = { yes: ['Yes', 'ok'], unsure: ['Unsure', 'warn'], no: ['No', 'neutral'] };

  function dimOf(s) { return s.dim === 'HI' || s.dim === 'IA' ? s.dim : (/^hi/.test(s.id) ? 'HI' : 'IA'); }
  /* IA before HI, then by symptom number; data order breaks ties. */
  function syms() {
    var list = arr(AA.data.symptoms).filter(function (s) { return isObj(s) && txt(s.id); });
    var pos = {};
    list.forEach(function (s, i) { pos[s.id] = i; });
    function num(s) { var m = String(s.id).match(/(\d+)$/); return m ? parseInt(m[1], 10) : 99; }
    return list.slice().sort(function (a, b) {
      return (dimOf(a) === 'IA' ? 0 : 1) - (dimOf(b) === 'IA' ? 0 : 1) || num(a) - num(b) || pos[a.id] - pos[b.id];
    });
  }
  function symById(id) { var l = syms(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function dsmCode(s) { return (isObj(s.codes) && txt(s.codes.dsm5)) || ''; }
  function divaCode(s) { return (isObj(s.codes) && txt(s.codes.diva)) || ''; }
  function asrsItems(s) { return arr(isObj(s.codes) ? s.codes.asrs : null).filter(function (n) { return typeof n === 'number' || txt(n); }); }
  function symTitle(s) { return txt(s.title) || s.id; }
  /* Label as used in the bank and in links: DSM-5-TR code first ("A1c Seems not to listen (DIVA A3)"). */
  function symLabel(s) { var c = dsmCode(s), dv = divaCode(s); return (c ? c + ' ' : '') + symTitle(s) + (dv ? ' (DIVA ' + dv + ')' : ''); }
  function probeLabel(p) { var l = txt(p.label); return l && l !== p.k ? l : PROBE_LABEL[p.k] || l || txt(p.k) || 'Probes'; }

  /* ======================================================================
     Route: ddx (conditions A to Z, the differential finder, how to decide)
     ====================================================================== */

  var ddxMemo = { tab: 'list', q: '', group: '', core: false, age: 'all' };

  function condHay(c) {
    return norm([condName(c), txt(c.summary), txt(c.icd11), groupLabel(groupKey(c)), c.id]
      .concat(features(c).map(function (f) { return txt(f.t); })).join(' \n '));
  }

  /* One condition as a card: name, the bracketed part of the name, the first sentence of the summary,
     then core status, whether it can co-occur, the ICD-11 code and any age limit. */
  function condCard(c, age) {
    var sub = subName(c), first = sentences(c.summary)[0] || '', yc = youngCore(c);
    var m = COEXIST[c.coexist];
    return {
      title: shortName(c),
      text: [sub ? h('span', { class: 'rf-cc-sub' }, cap(sub)) : null, first ? h('span', { class: 'rf-cc-sum' }, first) : null],
      meta: h('span', { class: 'rf-cc-meta' },
        c.core && age !== 'young' ? ui.badge('Core: adults', 'accent', 'Review in every adult assessment') : null,
        yc && age !== 'adult' ? ui.badge('Core: ' + yc, 'accent', 'Review in every assessment at ages ' + yc) : null,
        m ? h('span', { class: 'rf-co rf-co-' + c.coexist }, m[0]) : null,
        icdShort(c) ? h('span', { class: 'rf-cc-code' }, 'ICD-11 ' + icdShort(c)) : null,
        c.ages === 'young' ? h('span', { class: 'rf-cc-age' }, 'Young people') : c.ages === 'adult' ? h('span', { class: 'rf-cc-age' }, 'Adults') : null),
      go: 'cond-' + c.id
    };
  }

  function groupBlock(g, members, age) {
    var info = GROUP_INFO[g] || ['layers', ''];
    var hid = 'rf-g-' + safeId(g);
    return h('section', { class: 'rf-cgroup', 'aria-labelledby': hid },
      h('div', { class: 'rf-cgroup-head' },
        h('span', { class: 'rf-cgroup-ico', 'aria-hidden': 'true' }, ui.icon(info[0])),
        h('div', { class: 'rf-cgroup-text' },
          h('h3', { id: hid }, groupLabel(g), h('span', { class: 'rf-n' }, ' · ' + U.plural(members.length, 'condition'))),
          info[1] ? h('p', null, info[1]) : null)),
      ui.cards(members.map(function (c) { return condCard(c, age); })));
  }

  function conditionsPanel(list) {
    var hay = {};
    list.forEach(function (c) { hay[c.id] = condHay(c); });
    var groups = groupsOf(list);
    if (ddxMemo.group && groups.indexOf(ddxMemo.group) < 0) ddxMemo.group = '';
    var host = h('div', { class: 'rf-cgroups' });
    var status = h('p', { class: 'rf-status', role: 'status', 'aria-live': 'polite' });
    var search = ui.search('Search by name, clue or ICD-11 code', function (q) { ddxMemo.q = q; apply(); }, ddxMemo.q);
    search.classList.add('rf-bigsearch');

    var gList = ui.chips([{ label: 'All groups', n: list.length, on: !ddxMemo.group, onClick: function () { ddxMemo.group = ''; apply(); } }]
      .concat(groups.map(function (g) { return { label: groupLabel(g), n: 0, on: ddxMemo.group === g, onClick: function () { ddxMemo.group = ddxMemo.group === g ? '' : g; apply(); } }; })));
    var gBtns = U.$$('button', gList);
    var aList = ui.chips(AGES.map(function (a) { return { label: a[1], on: ddxMemo.age === a[0], onClick: function () { ddxMemo.age = a[0]; apply(); } }; }));
    var aBtns = U.$$('button', aList);
    var cList = ui.chips([{ label: 'Core conditions only', on: ddxMemo.core, onClick: function () { ddxMemo.core = !ddxMemo.core; apply(); } }]);
    var coreBtn = U.$('button', cList);
    var clearBtn = ui.btn({ label: 'Clear search and filters', kind: 'quiet', small: true, onClick: clearAll });

    function setOn(b, on) { if (!b) return; b.classList.toggle('is-on', !!on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }
    function setN(b, n) { var s = b ? U.$('.ds-chip-n', b) : null; if (s) s.textContent = fmt(n); if (b) b.classList.toggle('is-empty', !n); }
    function clearAll() {
      ddxMemo.q = ''; ddxMemo.group = ''; ddxMemo.core = false; ddxMemo.age = 'all';
      search.value = '';
      apply();
      search.focus();
    }
    function apply() {
      var ws = wordsOf(ddxMemo.q), age = ddxMemo.age;
      var base = list.filter(function (c) {
        if (!ageOk(c, age) || (ddxMemo.core && !coreFor(c, age))) return false;
        for (var i = 0; i < ws.length; i++) if (hay[c.id].indexOf(ws[i]) < 0) return false;
        return true;
      });
      var per = {};
      base.forEach(function (c) { var g = groupKey(c); per[g] = (per[g] || 0) + 1; });
      setOn(gBtns[0], !ddxMemo.group); setN(gBtns[0], base.length);
      groups.forEach(function (g, i) { setOn(gBtns[i + 1], ddxMemo.group === g); setN(gBtns[i + 1], per[g] || 0); });
      AGES.forEach(function (a, i) { setOn(aBtns[i], age === a[0]); });
      setOn(coreBtn, ddxMemo.core);
      var shown = ddxMemo.group ? base.filter(function (c) { return groupKey(c) === ddxMemo.group; }) : base;
      U.clear(host);
      if (!shown.length) {
        host.appendChild(ui.empty('No condition matches', 'Try another word, or clear the search and filters.',
          ui.btn({ label: 'Clear search and filters', kind: 'primary', onClick: clearAll })));
      } else {
        groupsOf(shown).forEach(function (g) { host.appendChild(groupBlock(g, shown.filter(function (c) { return groupKey(c) === g; }), age)); });
      }
      var filtered = !!(ws.length || ddxMemo.group || ddxMemo.core || age !== 'all');
      status.textContent = filtered ? 'Showing ' + U.plural(shown.length, 'condition') + ' of ' + list.length + '.' : '';
      clearBtn.hidden = !filtered;
      if (statusRow) statusRow.classList.toggle('is-idle', !filtered);
    }

    var statusRow = h('div', { class: 'rf-status-row' }, status, clearBtn);
    var hero = ui.hero({ label: 'Find a condition', eyebrow: U.plural(list.length, 'condition') + ' · ' + U.plural(groups.length, 'group'), title: 'Find a condition',
      text: h('div', { class: 'rf-find' },
        h('div', { class: 'rf-searchbox', role: 'search', 'aria-label': 'Find a condition' }, ui.icon('search'), search),
        h('div', { class: 'rf-chiprow', role: 'group', 'aria-label': 'Group' }, gList),
        h('div', { class: 'rf-find-sub' },
          h('div', { class: 'rf-chiprow', role: 'group', 'aria-label': 'Age' }, aList),
          h('div', { class: 'rf-chiprow', role: 'group', 'aria-label': 'Core conditions' }, cList))) });
    apply();
    return h('div', { class: 'rf-list' }, hero, statusRow, host);
  }

  /* ---- Differential finder: ticks live in AA.progress('sandbox.ddxfinder.f') ---- */
  var FINDER = 'sandbox.ddxfinder';
  function readTicks() { var f = AA.progress.get(FINDER + '.f', null); return isObj(f) ? Object.assign({}, f) : {}; }
  function tickCount() { var t = readTicks(); return Object.keys(t).filter(function (k) { return t[k]; }).length; }

  /* The clue lists (about 500 checkboxes) are built group by group when a group is first opened or a
     search needs it, so the page opens instantly; ranking works from the saved ticks alone.
     onTicks(n) reports the number of ticked clues (for the tab count). */
  function finderPanel(list, onTicks) {
    var ticks = readTicks();
    var rows = [];
    var groups = groupsOf(list).map(function (g) {
      var members = list.filter(function (c) { return groupKey(c) === g && features(c).length; });
      if (!members.length) return null;
      return { g: g, members: members, meta: h('span'), blocks: [], n: members.length, built: false, body: h('div', { class: 'rf-fbody' }),
        feats: members.reduce(function (acc, c) { return acc.concat(features(c).map(function (f) { return f.id; })); }, []) };
    }).filter(Boolean);
    if (!groups.length) return ui.empty('No clues to tick', 'The conditions in this build have no listed features.');

    function build(grp) {
      if (grp.built) return;
      grp.built = true;
      grp.blocks = grp.members.map(function (c) {
        var bRows = features(c).map(function (f) {
          var chk = ui.check({ label: [h('span', null, txt(f.t) || f.id), ' ', weightTag(weightOf(f))], checked: !!ticks[f.id], cls: 'rf-clue',
            onChange: function (on) { toggle(f.id, on); } });
          var r = { el: chk, input: chk.querySelector('input'), id: f.id, hay: norm((f.t || '') + ' ' + condName(c)) };
          rows.push(r);
          return r;
        });
        return { el: h('div', { class: 'rf-fblock' }, h('h3', { class: 'rf-fcond' }, condName(c)), h('div', null, bRows.map(function (r) { return r.el; }))), rows: bRows };
      });
      var frag = document.createDocumentFragment();
      grp.blocks.forEach(function (b) { frag.appendChild(b.el); });
      grp.body.appendChild(frag);
    }

    var acc = ui.acc(groups.map(function (grp) {
      return { title: groupLabel(grp.g), meta: grp.meta, render: function () { build(grp); return grp.body; } };
    }));
    acc.classList.add('rf-facc');
    U.$$('details', acc).forEach(function (d, i) { if (groups[i]) groups[i].el = d; });

    var status = h('p', { class: 'rf-fstatus', role: 'status', 'aria-live': 'polite' });
    var searchNote = h('p', { class: 'hint rf-fnote' });
    var noMatch = h('p', { class: 'muted rf-fnone', hidden: true }, 'No clue matches that search. Try a shorter word.');
    var rankList = h('ol', { class: 'rf-rank' });
    var rankEmpty = h('p', { class: 'muted rf-rank-empty' }, 'Tick the clues you have found. The conditions that fit best appear here, strongest first.');
    var moreNote = h('p', { class: 'hint rf-rank-more' });
    var resetBtn = ui.btn({ label: 'Reset', kind: 'ghost', small: true, onClick: reset });
    var NOTE = 'Open a group to see its clues. More dots means the clue points more strongly to that condition.';
    /* On narrower screens the ranking sits above a long list, so a small bar at the foot of the list shows the
       current best fit while ticking, with a jump back to the ranking. */
    var resCard = null;
    var dockText = h('span', { class: 'rf-fdock-t' });
    var dock = h('div', { class: 'rf-fdock', hidden: true }, dockText,
      ui.btn({ label: 'See ranking', kind: 'primary', small: true, onClick: function () {
        if (!resCard) return;
        try { resCard.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { resCard.scrollIntoView(); }
      } }));

    var savedOpen = null;
    var search = ui.search('Filter the clues', function (q) {
      var ws = wordsOf(q);
      if (ws.length && !savedOpen) savedOpen = groups.map(function (g) { return g.el.open; });
      var shown = 0;
      groups.forEach(function (g) {
        if (ws.length) build(g);
        var n = 0;
        g.blocks.forEach(function (b) {
          var m = 0;
          b.rows.forEach(function (r) {
            var on = ws.every(function (w) { return r.hay.indexOf(w) > -1; });
            r.el.hidden = !on;
            if (on) m++;
          });
          b.el.hidden = !m;
          n += m;
        });
        g.el.hidden = ws.length ? !n : false;
        if (ws.length) g.el.open = n > 0;
        shown += ws.length ? n : 1;
      });
      if (!ws.length && savedOpen) { groups.forEach(function (g, i) { g.el.open = !!savedOpen[i]; }); savedOpen = null; }
      noMatch.hidden = shown > 0;
      searchNote.textContent = ws.length ? U.plural(shown, 'clue') + ' match "' + q + '".' : NOTE;
    });
    search.classList.add('rf-bigsearch');

    function toggle(id, on) {
      if (on) ticks[id] = true; else delete ticks[id];
      var keep = {};
      Object.keys(ticks).forEach(function (k) { if (ticks[k]) keep[k] = true; });
      AA.progress.set(FINDER + '.f', Object.keys(keep).length ? keep : undefined);
      rank();
    }
    function reset() {
      U.confirm({ title: 'Clear all ticked clues?', body: 'This only clears the finder. No assessment changes.', ok: 'Clear', danger: true }).then(function (yes) {
        if (!yes) return;
        ticks = {};
        AA.progress.set(FINDER, undefined);
        rows.forEach(function (r) { r.input.checked = false; });
        rank();
        U.toast('Clues cleared');
      });
    }

    function rank() {
      var scored = list.map(function (c, i) { return { c: c, i: i, r: scoreFor(c, ticks) }; })
        .filter(function (x) { return x.r.score > 0; })
        .sort(function (a, b) { return b.r.score - a.r.score || b.r.pct - a.r.pct || a.i - b.i; });
      U.clear(rankList);
      scored.slice(0, 8).forEach(function (x) {
        var b = BAND[x.r.band] || BAND.weak;
        rankList.appendChild(h('li', { class: 'rf-rank-item' },
          h('div', { class: 'rf-rank-top' }, go('cond-' + x.c.id, condName(x.c), 'rf-rank-name'), ui.badge(b[0], b[1])),
          ui.progress(x.r.score, x.r.max, 'Share of the clue weight for ' + condName(x.c)),
          h('p', { class: 'rf-rank-meta' }, 'Score ' + x.r.score + ' of ' + x.r.max + ' · ' + x.r.pct + '% · ' + U.plural(x.r.checked, 'clue') + ' ticked')));
      });
      var n = 0;
      groups.forEach(function (g) {
        var t = g.feats.filter(function (id) { return ticks[id]; }).length;
        n += t;
        g.meta.textContent = U.plural(g.n, 'condition') + (t ? ' · ' + t + ' ticked' : '');
      });
      rankEmpty.hidden = scored.length > 0;
      moreNote.textContent = scored.length > 8 ? U.plural(scored.length - 8, 'more condition') + ' with a lower score.' : '';
      resetBtn.disabled = !n;
      status.textContent = !n || !scored.length ? 'No clues ticked yet.' : U.plural(n, 'clue') + ' ticked. Best fit: ' + condName(scored[0].c) + ', score ' + scored[0].r.score + ' (' + scored[0].r.pct + '%).';
      dock.hidden = !n || !scored.length;
      dockText.textContent = scored.length ? U.plural(n, 'clue') + ' · Best fit: ' + shortName(scored[0].c) + ' (' + scored[0].r.pct + '%)' : '';
      if (onTicks) onTicks(n);
    }

    rank();
    searchNote.textContent = NOTE;

    var main = h('div', { class: 'rf-fpick' },
      h('div', { class: 'rf-searchbox', role: 'search', 'aria-label': 'Filter the clues' }, ui.icon('search'), search),
      status, searchNote, acc, noMatch, dock);
    var aside = resCard = h('section', { class: 'card rf-fres', 'aria-labelledby': 'rf-fres-h' },
      h('div', { class: 'rf-fres-head' }, h('h2', { id: 'rf-fres-h' }, 'Best fit'), resetBtn),
      rankEmpty, rankList, moreNote);
    return h('div', { class: 'rf-finder', id: 'rf-finder' },
      h('div', { class: 'rf-fintro' },
        h('p', { class: 'rf-lead' }, 'Tick every clue you have found in the history, the interview or the screens. Conditions are ranked by the total weight of their ticked clues.'),
        h('p', { class: 'ds-note' }, ui.icon('info'), h('span', null, 'It prompts your thinking; it does not make a diagnosis. Ticks are saved in your profile and are not linked to any patient.'))),
      splitOf(main, aside, 'rf-fsplit'));
  }

  /* ---- How to decide: co-occurring or better explained, and the clues that help ---- */
  function decidePanel() {
    var clues = [
      ['timeline', 'Trait or change', 'ADHD is a lasting trait. A clear change from the person\'s usual self points to something else.'],
      ['calendar', 'Onset before 12', 'Several symptoms were there before age 12. A late start needs another explanation first.'],
      ['compass', 'Every setting', 'ADHD shows at home, at work and with friends. Problems in one setting only suggest a cause in that setting.'],
      ['flag', 'Specific triggers', 'Symptoms that come with stress, trauma reminders, social situations or substance use suggest another cause.'],
      ['pill', 'Response to treatment', 'If symptoms lift with better sleep, stopping a substance or treating low mood, that was probably the cause.'],
      ['users', 'Family history', 'ADHD runs in families. A family history of bipolar disorder or psychosis means screening for it with care.']
    ];
    return h('div', { class: 'rf-decide-tab' },
      ui.section({ id: 'rf-cob', title: 'Co-occurring or better explained?', text: 'For every condition you consider, decide whether it sits alongside ADHD or explains the symptoms instead.' },
        infoCards([
          { icon: 'layers', title: 'Co-occurring', body: h('p', null, 'Both conditions are present. The ADHD symptoms were there before the other condition and carry on between its episodes. Diagnose both, and plan which to treat first.') },
          { icon: 'scale', title: 'Better explained', tone: 'warn', body: h('p', null, 'The other condition accounts for the symptoms. DSM-5-TR criterion E: do not diagnose ADHD when another mental disorder better explains the symptoms, or when they happen only during a psychotic illness.') }
        ], true)),
      ui.section({ id: 'rf-clues', title: 'Clues that help you decide', text: 'Check each of these against the history before you settle on an answer.' },
        (function () { var g = ui.cards(clues.map(function (c) { return { icon: c[0], title: c[1], text: c[2] }; })); g.classList.add('rf-clue-cards'); return g; })()),
      sourcesBox(['DSM-5-TR criterion E (paraphrased); clinical practice.']));
  }

  function renderDdx(el, params) {
    var list = condsOrdered();
    var last = lastA();
    el.appendChild(ui.pageHead({
      eyebrow: 'During the interview', title: 'Differential diagnosis',
      lead: 'Conditions that can mimic ADHD or occur alongside it. Open one for the questions that tell it apart, or tick the clues you have found to see which fit best.',
      actions: [
        AA.router.has('ddxguide') ? ui.btn({ label: 'Differential protocol', kind: 'ghost', go: 'ddxguide' }) : null,
        last ? ui.btn({ label: 'Differentials in the assessment', kind: 'primary', go: 'assess-' + last.id + '-ddx' }) : null
      ].filter(Boolean)
    }));
    if (!list.length) {
      el.appendChild(decidePanel());
      el.appendChild(h('div', { class: 'rf-sec' }, ui.empty('No conditions loaded', 'The differential diagnosis library is not available in this build.',
        ui.btn({ label: 'Go to home', kind: 'primary', go: 'home' }))));
      return;
    }
    if (params && params[0] === 'finder') ddxMemo.tab = 'finder';
    var tabs = null;
    function finderCount(n) {
      if (!tabs) return;
      tabs.setCount('finder', n);
      var b = U.$$('.tab', tabs)[1], c = b ? U.$('.tab-count', b) : null;
      if (c) { c.hidden = !n; c.setAttribute('aria-label', U.plural(n, 'clue') + ' ticked'); }
    }
    tabs = ui.tabs([
      { id: 'list', label: 'Conditions A to Z', count: list.length, render: function () { return conditionsPanel(list); } },
      { id: 'finder', label: 'Differential finder', render: function () { return finderPanel(list, finderCount); } },
      { id: 'decide', label: 'How to decide', render: decidePanel }
    ], ['list', 'finder', 'decide'].indexOf(ddxMemo.tab) > -1 ? ddxMemo.tab : 'list', function (id) { ddxMemo.tab = id; });
    tabs.classList.add('rf-tabs');
    el.appendChild(tabs);
    finderCount(tickCount());
  }

  /* ======================================================================
     Route: cond-<id> (one condition's reference page)
     ====================================================================== */

  function mimicsOf(id) {
    var out = [];
    syms().forEach(function (s) { arr(s.mimics).forEach(function (m) { if (isObj(m) && m.ddx === id) out.push({ s: s, m: m }); }); });
    return out;
  }

  function toolChips(ids) {
    return h('ul', { class: 'ds-chips rf-tools' }, ids.map(function (id) {
      var t = AA.byId('tools', id);
      if (!t) return h('li', null, h('span', { class: 'ds-chip' }, id, h('span', { class: 'sr-only' }, ' (not in the tools library)')));
      return h('li', null, h('a', { class: 'ds-chip rf-tchip', href: '#tool-' + id, 'data-go': 'tool-' + id, title: t.name || null }, t.abbr || t.name || id));
    }));
  }

  /* Discriminating questions split into runs by who is asked: "(Parent) ..." starts a "Parent" run.
     Conditional notes such as "(If they menstruate)" stay with the person and show beside the question. */
  function questionRuns(list) {
    var runs = [];
    list.forEach(function (q, i) {
      var m = q.match(/^\(([^)]{1,48})\)\s*/), who = m ? txt(m[1]) : '', rest = m ? q.slice(m[0].length) : q, note = '';
      if (who && /^(if\b|older adults)/i.test(who)) { note = who; who = ''; }
      who = cap(who.replace(/^to (a|an|the) /i, ''));
      var cur = runs[runs.length - 1];
      if (!cur || cur.who !== who) { cur = { who: who, items: [] }; runs.push(cur); }
      cur.items.push({ n: i + 1, q: rest, note: note });
    });
    return runs;
  }

  function renderCond(el, params) {
    var list = condsOrdered();
    var idx = -1;
    list.forEach(function (x, i) { if (x.id === params[0]) idx = i; });
    var c = idx > -1 ? list[idx] : null;
    if (!c) {
      notFound(el, 'Differential diagnosis', 'Condition not found', 'This condition is not in the library. It may have been renamed or removed.', 'ddx', 'All conditions');
      return;
    }
    var name = condName(c), short = shortName(c), sub = subName(c);
    var last = lastA();
    el.appendChild(ui.pageHead({
      eyebrow: 'Differential diagnosis · ' + groupLabel(groupKey(c)),
      title: sub ? [short, h('span', { class: 'sr-only' }, ' ('), h('span', { class: 'rf-h1-sub' }, cap(sub)), h('span', { class: 'sr-only' }, ')')] : name,
      actions: [ui.btn({ label: 'All conditions', kind: 'ghost', go: 'ddx', icon: '←' }),
        last ? ui.btn({ label: 'Review in the assessment', kind: 'primary', go: 'assess-' + last.id + '-ddx' }) : null].filter(Boolean)
    }));

    /* ---- Hero: summary, who reviews it, how common; stat tiles for co-occurrence and the ICD-11 code ---- */
    var detail = [];      // rows for the closing "More detail" card: {title, meta, render}
    var yc = youngCore(c);
    var coreLine = c.core && yc ? 'Review it in every assessment for adults and for young people aged ' + yc + '.'
      : c.core ? 'Review it in every adult assessment.'
      : yc ? 'Review it in every assessment for young people aged ' + yc + '.'
      : 'Consider it when the history points to it.';
    var prev = sentences(c.prevalence);
    var stats = [];
    if (COEXIST_N[c.coexist]) stats.push({ n: COEXIST_N[c.coexist], l: 'Can it co-occur with ADHD?' });
    var code = icdShort(c), rest = icdRest(c), icdFull = txt(c.icd11);
    /* The tile shows the leading code large and, when there is more, the whole ICD-11 text under it. */
    var icdInTile = !!code && (!rest || icdFull.length <= 120);
    if (code) stats.push({ n: code, l: 'ICD-11 code', s: rest && icdInTile ? icdFull : '' });
    if (icdFull && !icdInTile) detail.push({ title: 'ICD-11 classification', render: function () { return h('p', null, icdFull); } });
    if (prev.length > 1) detail.unshift({ title: 'How common', meta: U.plural(prev.length, 'point'), render: function () { return h('ul', { class: 'rf-dots' }, prev.map(function (p) { return h('li', null, figures(p)); })); } });

    var moreFigures = prev.length > 1 ? ui.btn({ label: 'See all ' + prev.length + ' points', kind: 'quiet', small: true, onClick: function () { openDetail('How common'); } }) : null;
    el.appendChild(ui.hero({ label: 'At a glance', eyebrow: 'At a glance',
      text: h('div', { class: 'rf-glance' },
        txt(c.summary) ? h('p', { class: 'ds-hero-p' }, c.summary) : null,
        h('p', { class: 'rf-glance-core' }, c.core || yc ? ui.badge('Core', 'accent') : ui.badge('Not core', 'neutral'), h('span', null, coreLine), ageBadge(c)),
        prev.length ? h('div', { class: 'rf-hc' }, h('p', { class: 'ds-label' }, 'How common'), h('p', { class: 'rf-hc-p' }, figures(prev[0])), moreFigures) : null),
      aside: stats.length ? statTiles(stats) : null }));

    /* ---- Sections, with an on-page contents list ---- */
    var main = [], toc = [];
    function add(id, label, title, text, content, actions) {
      if (!content) return;
      toc.push({ id: id, label: label });
      main.push(ui.section({ id: id, title: title, text: text, actions: actions }, content));
    }

    var flags = texts(c.redFlags);
    if (flags.length) {
      toc.push({ id: 'rf-flags', label: 'Red flags' });
      main.push(h('div', { id: 'rf-flags', class: 'rf-flags' },
        ui.callout('warn', h('ul', { class: 'rf-flaglist' }, flags.map(li)), [ui.icon('alert'), ' Red flags'])));
    }

    var overlap = texts(c.overlap), fa = texts(c.favoursADHD), fb = texts(c.favoursAlt);
    if (overlap.length || fa.length || fb.length) {
      add('rf-diff', 'How it differs', 'How it differs from ADHD', 'What the two share, and the clues that point one way or the other.',
        h('div', { class: 'card rf-diff' },
          fa.length || fb.length ? pairOrTabs([
            { id: 'adhd', tab: 'Points to ADHD', title: 'Points to ADHD', count: fa.length, cls: 'rf-diff-col is-adhd',
              node: fa.length ? h('ul', { class: 'rf-dots' }, fa.map(li)) : muted('Not listed.') },
            { id: 'alt', tab: 'Points to ' + short, title: 'Points to ' + short, count: fb.length, cls: 'rf-diff-col is-alt',
              node: fb.length ? h('ul', { class: 'rf-dots' }, fb.map(li)) : muted('Not listed.') }
          ], 'rf-diff-cols') : null,
          overlap.length ? h('div', { class: 'rf-diff-shared' },
            ui.details('Where it overlaps with ADHD', h('ul', { class: 'rf-dots rf-cols2' }, overlap.map(li)),
              { cls: 'rf-fold', meta: String(overlap.length), open: !fa.length && !fb.length })) : null));
    }

    var asks = texts(c.ask);
    if (asks.length) {
      var runs = questionRuns(asks);
      add('rf-asks', 'Questions to ask', 'Questions that tell them apart', 'Ask these to separate ' + short + ' from ADHD. Who to ask is shown above each group.',
        h('div', { class: 'card rf-qcard' }, runs.map(function (r) {
          return h('div', { class: 'rf-qrun' },
            h('h3', { class: 'rf-k3' }, r.who ? 'Ask: ' + r.who : 'Ask the person', h('span', { class: 'rf-n' }, String(r.items.length))),
            h('ol', { class: 'rf-qlist' }, r.items.map(function (x) {
              return h('li', { value: String(x.n) }, x.note ? h('span', { class: 'rf-qnote' }, x.note) : null, x.q);
            })));
        })),
        ui.btn({ label: 'Copy questions', kind: 'ghost', small: true, onClick: function () { copyLines(numbered(asks), 'Questions'); } }));
    }

    var feats = features(c);
    if (feats.length) {
      var byW = [3, 2, 1].map(function (w) { return { w: w, items: feats.filter(function (f) { return weightOf(f) === w; }) }; }).filter(function (g) { return g.items.length; });
      add('rf-feat-sec', 'Features', 'Features that point to ' + short, 'More dots means the feature points more strongly to ' + short + ' rather than ADHD.',
        h('div', { class: 'card rf-feat' },
          h('div', { class: 'rf-feat-cols' }, byW.map(function (g) {
            return h('div', { class: 'rf-feat-col' },
              h('h3', { class: 'rf-k3' }, weightTag(g.w), h('span', { class: 'rf-n' }, String(g.items.length))),
              h('ul', { class: 'rf-checks' }, g.items.map(function (f) { return h('li', null, ui.icon('check'), h('span', null, txt(f.t) || f.id)); })));
          })),
          h('p', { class: 'ds-note' }, ui.icon('info'), h('span', null, 'Tick the ones you find in the assessment\'s differential step.'),
            last ? go('assess-' + last.id + '-ddx', 'Open it') : null)));
    }

    var dc = isObj(c.decide) ? c.decide : {};
    var decCards = [];
    if (txt(dc.better)) decCards.push({ icon: 'scale', title: 'It better explains the symptoms when', tone: 'warn', body: bullets(dc.better) });
    if (txt(dc.both)) decCards.push({ icon: 'layers', title: 'Diagnose both when', body: bullets(dc.both) });
    var next = sentences(dc.next);
    add('rf-decide', 'How to decide', 'How to decide', 'Co-occurring or better explained, and what to do next.',
      h('div', { class: 'rf-decide' },
        COEXIST[c.coexist] || txt(c.coexistNote) ? h('div', { class: 'rf-coexist' },
          h('p', { class: 'rf-coexist-k' }, coexistBadge(c), ' ', h('strong', null, COEXIST_TEXT[c.coexist] || 'Can it co-occur? Not stated.')),
          txt(c.coexistNote) ? bullets(c.coexistNote, 'rf-coexist-note') : null) : null,
        decCards.length ? infoCards(decCards, true) : null,
        next.length ? ui.callout('info', h('ul', { class: 'rf-dots rf-next' }, next.map(li)), 'What to do next') : null,
        !decCards.length && !next.length ? muted('No decision guidance recorded yet. Use the questions and features above.') : null));

    var screens = texts(c.screen), inv = texts(c.investigations);
    add('rf-tests', 'Screening and tests', 'Screening and tests', 'Questionnaires that help, and checks to consider.',
      h('div', { class: 'card rf-tests' },
        h('h3', { class: 'rf-k3' }, 'Screening tools', screens.length ? h('span', { class: 'rf-n' }, String(screens.length)) : null),
        screens.length ? toolChips(screens) : muted('No screening tool listed.'),
        inv.length ? ui.details('Investigations to consider', h('ul', { class: 'rf-dots' }, inv.map(li)), { cls: 'rf-fold rf-inv', meta: String(inv.length) }) : null));

    var mm = mimicsOf(c.id);
    add('rf-mimic', 'Symptoms it mimics', 'Symptoms it can mimic', mm.length ? 'Open a symptom for the clue to look for and the question to ask.' : '',
      mm.length ? ui.acc(mm.map(function (x) {
        return { n: dsmCode(x.s) || '•', title: symTitle(x.s), meta: divaCode(x.s) ? 'DIVA ' + divaCode(x.s) : '',
          render: function () {
            return h('div', { class: 'rf-mbody' },
              txt(x.m.clue) ? h('p', null, h('span', { class: 'rf-k' }, 'Clue'), x.m.clue) : null,
              txt(x.m.ask) ? h('p', { class: 'rf-ask' }, h('span', { class: 'rf-k' }, 'Ask'), x.m.ask) : null,
              h('p', { class: 'rf-mlink' }, go('sym-' + x.s.id, 'Open the symptom page →')));
          } };
      })) : muted('No symptom in the interview lists ' + short + ' as a common mimic.'),
      mm.length ? h('span', { class: 'rf-n' }, U.plural(mm.length, 'symptom')) : null);

    var pearls = texts(c.pearls), refs = texts(c.refs);
    if (pearls.length) detail.push({ title: 'Clinical pearls', meta: String(pearls.length), render: function () { return h('ul', { class: 'rf-dots' }, pearls.map(li)); } });
    if (refs.length) detail.push({ title: 'Sources', meta: String(refs.length), render: function () { return h('ol', { class: 'rf-refs' }, refs.map(li)); } });
    var detailAcc = detail.length ? ui.acc(detail) : null;
    add('rf-more', 'More detail', 'More detail', 'How common it is, practice pearls and sources.', detailAcc);
    function openDetail(title) {
      if (!detailAcc) return;
      var i = -1;
      detail.forEach(function (d, j) { if (d.title === title) i = j; });
      var d = U.$$('details', detailAcc)[i];
      if (!d) return;
      d.open = true;
      try { d.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { d.scrollIntoView(); }
      var s = U.$('summary', d);
      if (s) { try { s.focus({ preventScroll: true }); } catch (e) { s.focus(); } }
    }

    var nav = ui.toc(toc);
    el.appendChild(splitOf(main, nav));

    var p = list[idx - 1], n = list[idx + 1];
    el.appendChild(pnNav(p ? { go: 'cond-' + p.id, t: condName(p) } : null, n ? { go: 'cond-' + n.id, t: condName(n) } : null, 'Previous and next condition'));
    return function () { if (nav.disconnect) nav.disconnect(); };
  }

  /* ======================================================================
     Route: criteria (DSM-5-TR, ICD-11, how they differ, DIVA 2.0, what changed, the 18 symptoms)
     Known parts get their own layout (criteria as lettered cards, codes as rows, labelled lists); anything
     else in AA.data.criteria renders generically: strings as paragraphs, arrays as lists and objects as
     subsections titled by their t/title field, with d/text as the body.
     ====================================================================== */

  var crMemo = { tab: '' };
  var TITLE_KEYS = ['t', 'title', 'name', 'label', 'h', 'heading'];
  var TEXT_KEYS = ['d', 'text', 'desc', 'description', 'summary', 'body', 'what', 'def'];
  var SKIP_KEYS = ['id', 'n', 'order', 'html'];
  var KEY_LABEL = { intro: '', presentations: 'Presentations', specifiers: 'Specifiers', severity: 'Severity', remission: 'In partial remission',
    ia: 'Inattention', hi: 'Hyperactivity and impulsivity', symptoms: 'Symptoms', items: 'Items', threshold: 'Threshold', onset: 'Onset',
    duration: 'Duration', settings: 'Settings', pervasive: 'Settings', impairment: 'Impairment', exclusion: 'Exclusions', exclusions: 'Exclusions',
    codes: 'Codes', code: 'Code', notes: 'Notes', note: 'Note', differences: 'Differences', scoring: 'Scoring', structure: 'Structure',
    examples: 'Examples', adult: 'Adults', adults: 'Adults', child: 'Children', children: 'Children', subtypes: 'Subtypes', changes: 'Changes',
    refs: 'References', sources: 'Sources', source: 'Source', url: 'Link', age: 'Age', essential: 'Essential features', course: 'Course',
    boundary: 'Boundary with normality', culture: 'Culture', sex: 'Sex and gender', differential: 'Differential diagnosis', qualifiers: 'Qualifiers',
    from: 'Before', to: 'Now', dsm4: 'DSM-IV', dsm5: 'DSM-5-TR', icd11: 'ICD-11', diva2: 'DIVA 2.0', why: 'Why it matters',
    other: 'Other specified and unspecified ADHD' };
  function keyLabel(k) {
    if (Object.prototype.hasOwnProperty.call(KEY_LABEL, k)) return KEY_LABEL[k];
    if (/^[A-Z]$/.test(k)) return 'Criterion ' + k;
    var s = String(k).replace(/_/g, ' ').replace(/([a-z])([A-Z0-9])/g, '$1 $2').toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function titleOf(o) {
    if (!isObj(o)) return '';
    for (var i = 0; i < TITLE_KEYS.length; i++) if (txt(o[TITLE_KEYS[i]])) return txt(o[TITLE_KEYS[i]]);
    return '';
  }
  function textOf(o) {
    if (!isObj(o)) return '';
    for (var i = 0; i < TEXT_KEYS.length; i++) if (txt(o[TEXT_KEYS[i]])) return txt(o[TEXT_KEYS[i]]);
    return '';
  }
  function looksHtml(s) { return /^\s*<(p|ul|ol|h3|h4|table|blockquote|div|strong|em)\b/i.test(s); }
  function para(s) { return looksHtml(s) ? ui.html(s) : h('p', null, s); }
  function has(v) { return v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && !arr(v).length); }
  function crHeading(t, depth) {
    if (depth <= 3) return h('h3', null, t);
    if (depth === 4) return h('h4', null, t);
    return h('p', { class: 'rf-crk' }, t);
  }
  function crNode(v, depth) {
    if (v === null || v === undefined || typeof v === 'boolean') return null;
    if (typeof v === 'string') return txt(v) ? para(v) : null;
    if (typeof v === 'number') return para(String(v));
    if (Array.isArray(v)) return crList(v, depth);
    if (isObj(v)) return crBody(v, depth);
    return null;
  }
  function crList(a, depth) {
    var items = a.filter(function (x) { return x !== null && x !== undefined && x !== '' && typeof x !== 'boolean'; });
    if (!items.length) return null;
    return h('ul', { class: 'rf-dots rf-crlist' }, items.map(function (x) {
      if (isObj(x)) { var t = titleOf(x); return h('li', null, t ? h('strong', { class: 'rf-crli-t' }, t) : null, crBody(x, depth + 1)); }
      if (Array.isArray(x)) return h('li', null, crList(x, depth + 1));
      return h('li', null, typeof x === 'string' && looksHtml(x) ? ui.html(x) : String(x));
    }));
  }
  /* Text fields first, then short scalar fields as a key/value grid, then everything else as subsections. */
  function crBody(o, depth) {
    var lead = [], kv = [], subs = [];
    TEXT_KEYS.forEach(function (k) { if (typeof o[k] === 'string' && txt(o[k])) lead.push(para(o[k])); });
    if (typeof o.html === 'string' && txt(o.html)) lead.push(ui.html(o.html));
    Object.keys(o).forEach(function (k) {
      if (TITLE_KEYS.indexOf(k) > -1 || TEXT_KEYS.indexOf(k) > -1 || SKIP_KEYS.indexOf(k) > -1) return;
      var v = o[k];
      if (!has(v) || typeof v === 'boolean') return;
      var label = keyLabel(k);
      if (label === '') { var b0 = crNode(v, depth); if (b0) lead.push(b0); return; }
      if ((typeof v === 'string' || typeof v === 'number') && String(v).length <= 90 && !looksHtml(String(v))) { kv.push([label, String(v)]); return; }
      var title = isObj(v) && titleOf(v) ? titleOf(v) : label;
      var body = crNode(v, depth + 1);
      if (body) subs.push(h('div', { class: 'rf-crsub' }, crHeading(title, depth), body));
    });
    var out = lead.concat(kv.length ? [ui.kv(kv)] : [], subs);
    return out.length ? out : null;
  }
  /* A titled card holding any criteria value. */
  function crCard(title, v, cls) {
    var body = Array.isArray(v) ? h('ul', { class: 'rf-dots' }, texts(v).map(li)) : typeof v === 'string' ? bullets(v) : crNode(v, 3);
    if (!body) return null;
    return h('section', { class: 'card rf-crcard' + (cls ? ' ' + cls : '') }, h('h2', { class: 'rf-crcard-h' }, title), body);
  }

  /* Short cell text for the comparison table. */
  function cellOf(v) {
    if (!has(v)) return h('span', { class: 'muted' }, 'Not specified');
    if (typeof v === 'string') return looksHtml(v) ? ui.html(v) : v;
    if (typeof v === 'number') return String(v);
    if (Array.isArray(v)) return h('ul', { class: 'rf-cell-list' }, arr(v).map(function (x) { return h('li', null, isObj(x) ? (titleOf(x) || textOf(x)) : String(x)); }));
    if (isObj(v)) return textOf(v) || titleOf(v) || crBody(v, 6) || h('span', { class: 'muted' }, 'Not specified');
    return String(v);
  }

  var SYSTEMS = [{ k: 'dsm5', label: 'DSM-5-TR', alt: ['dsm5tr', 'dsm'] }, { k: 'icd11', label: 'ICD-11 (6A05)', alt: ['icd'] },
    { k: 'diva2', label: 'DIVA 2.0 (DSM-IV)', alt: ['diva'] }];
  var CMP_SKIP = TITLE_KEYS.concat(TEXT_KEYS, ['intro', 'id', 'html', 'refs', 'sources', 'source', 'url', 'note', 'notes']);

  /* Side-by-side table: an explicit cr.compare / cr.comparison list, or every field that two or more systems share. */
  function compareTable(cr, present) {
    var explicit = arr(cr.compare || cr.comparison).filter(isObj);
    var head, rows;
    if (explicit.length) {
      var cols = SYSTEMS.filter(function (s) { return explicit.some(function (r) { return has(r[s.k]); }); });
      if (!cols.length) return null;
      head = ['Aspect'].concat(cols.map(function (s) { return s.label; }));
      rows = explicit.map(function (r) {
        return [txt(r.aspect) || titleOf(r) || keyLabel(txt(r.k) || '') || '-'].concat(cols.map(function (s) { return cellOf(r[s.k]); }));
      });
    } else {
      var objs = present.filter(function (p) { return isObj(p.v); });
      if (objs.length < 2) return null;
      var keys = [];
      objs.forEach(function (p) { Object.keys(p.v).forEach(function (k) { if (keys.indexOf(k) < 0 && CMP_SKIP.indexOf(k) < 0) keys.push(k); }); });
      keys = keys.filter(function (k) { return objs.filter(function (p) { return has(p.v[k]); }).length >= 2; });
      if (!keys.length) return null;
      head = ['Aspect'].concat(objs.map(function (p) { return p.label; }));
      rows = keys.map(function (k) { return [keyLabel(k) || k].concat(objs.map(function (p) { return cellOf(p.v[k]); })); });
    }
    return h('div', { class: 'table-wrap rf-cmp-wrap', tabindex: '0', role: 'region', 'aria-label': 'Comparison of the criteria (scrolls sideways on small screens)' },
      h('table', { class: 'table rf-cmp' },
        h('caption', { class: 'sr-only' }, 'DSM-5-TR, ICD-11 and DIVA 2.0 side by side'),
        h('thead', null, h('tr', null, head.map(function (c) { return h('th', { scope: 'col' }, c); }))),
        h('tbody', null, rows.map(function (r) { return h('tr', null, r.map(function (c, i) { return i === 0 ? h('th', { scope: 'row' }, c) : h('td', null, c); })); }))));
  }

  /* One DSM-5-TR criterion as a lettered card: the requirement as short points, practice notes folded away.
     Criterion A's items are the 18 symptoms, shown as two lists (A1 and A2). */
  function critCard(k, o) {
    var title = (isObj(o) ? titleOf(o) : '').replace(new RegExp('^Criterion\\s+' + k + '\\s*[:.\\-–]\\s*', 'i'), '');
    var points = sentences(isObj(o) ? textOf(o) : txt(o));
    var items = isObj(o) ? texts(o.items) : [];
    var fold = null;
    if (items.length) {
      var symItems = items.filter(function (x) { return /^A[12][a-z]\.\s/.test(x); });
      var body;
      if (symItems.length === items.length && symItems.length > 2) {
        body = h('div', { class: 'rf-crsyms' }, DIMS.map(function (d) {
          var rowsFor = items.filter(function (x) { return x.indexOf(d[2]) === 0; });
          if (!rowsFor.length) return null;
          return h('div', null, h('h3', { class: 'rf-k3' }, d[1] + ' (' + d[2] + ')', h('span', { class: 'rf-n' }, String(rowsFor.length))),
            h('ul', { class: 'rf-codes' }, rowsFor.map(function (x) {
              var m = x.match(/^(A[12][a-z])\.\s+(.*)$/);
              return h('li', null, h('span', { class: 'rf-code' }, m[1]), h('span', null, m[2]));
            })));
        }));
      } else body = h('ul', { class: 'rf-dots' }, items.map(li));
      fold = ui.details(symItems.length === items.length && symItems.length > 2 ? 'The ' + items.length + ' symptoms' : 'In practice', body,
        { cls: 'rf-fold', meta: symItems.length === items.length && symItems.length > 2 ? null : U.plural(items.length, 'note') });
    }
    return h('article', { class: 'rf-crit' + (k === 'A' ? ' is-wide' : ''), id: 'rf-crit-' + k, 'aria-labelledby': 'rf-crit-' + k + '-h' },
      h('div', { class: 'rf-crit-head' },
        h('span', { class: 'rf-crit-k', 'aria-hidden': 'true' }, k),
        h('h2', { id: 'rf-crit-' + k + '-h' }, h('span', { class: 'sr-only' }, 'Criterion ' + k + ': '), cap(title) || 'Criterion ' + k)),
      points.length ? h('ul', { class: 'rf-dots rf-crit-pts' }, points.map(li)) : null,
      fold);
  }

  function dsmPanel(v) {
    if (!isObj(v)) return h('div', { class: 'card rf-crcard' }, crNode(v, 3));
    var out = [], done = { intro: true, presentations: true, specifiers: true, other: true };
    if (txt(v.intro)) out.push(h('p', { class: 'rf-lead' }, v.intro));
    var letters = Object.keys(v).filter(function (k) { return /^[A-Z]$/.test(k) && has(v[k]); }).sort();
    letters.forEach(function (k) { done[k] = true; });
    if (letters.length) out.push(h('div', { class: 'rf-crit-grid' }, letters.map(function (k) { return critCard(k, v[k]); })));
    var pair = [has(v.presentations) ? crCard('Presentations', v.presentations) : null, has(v.specifiers) ? crCard('Specifiers', v.specifiers) : null].filter(Boolean);
    if (pair.length) out.push(h('div', { class: 'rf-crpair' }, pair.map(function (cdd) {
      U.$$('li', cdd).forEach(function (l) { var p = labelSplit(l.textContent); if (p) { U.clear(l); U.append(l, [h('strong', null, p[0]), ' ', p[1]]); } });
      return cdd;
    })));
    if (has(v.other)) out.push(crCard(keyLabel('other'), v.other));
    Object.keys(v).forEach(function (k) { if (!done[k] && has(v[k])) out.push(crCard(keyLabel(k) || 'More', v[k])); });
    return h('div', { class: 'rf-crpanel' }, out);
  }

  function icdPanel(v, skip) {
    if (!isObj(v)) return h('div', { class: 'card rf-crcard' }, crNode(v, 3));
    var out = [], done = { intro: true, essential: true, codes: true };
    (skip || []).forEach(function (k) { done[k] = true; });
    if (txt(v.intro)) out.push(h('p', { class: 'rf-lead' }, v.intro));
    var ess = texts(v.essential);
    if (ess.length) out.push(h('section', { class: 'card rf-crcard' }, h('h2', { class: 'rf-crcard-h' }, 'Essential features'),
      h('ol', { class: 'rf-numlist' }, ess.map(li))));
    var codes = texts(v.codes);
    if (codes.length) {
      var coded = [], notes = [];
      codes.forEach(function (t) { var m = t.match(/^([0-9A-Z]{4}(?:\.[0-9A-Z]+)?)\s+(.+)$/); if (m) coded.push(m); else notes.push(t); });
      out.push(h('section', { class: 'card rf-crcard' }, h('h2', { class: 'rf-crcard-h' }, 'Codes'),
        coded.length ? h('ul', { class: 'rf-codes rf-codes-lg' }, coded.map(function (m) { return h('li', null, h('span', { class: 'rf-code' }, m[1]), h('span', null, m[2])); })) : null,
        notes.length ? h('ul', { class: 'rf-dots rf-crnotes' }, notes.map(li)) : null));
    }
    Object.keys(v).forEach(function (k) { if (!done[k] && has(v[k])) out.push(crCard(keyLabel(k) || 'More', v[k])); });
    return h('div', { class: 'rf-crpanel' }, out);
  }

  function comparePanel(diffs, table) {
    return h('div', { class: 'rf-crpanel' },
      h('p', { class: 'rf-lead' }, 'Where DSM-5-TR and ICD-11 differ. NICE accepts either. Read the full criteria in the other tabs before you apply a rule.'),
      diffs.length ? h('section', { class: 'card rf-crcard' }, h('h2', { class: 'rf-crcard-h' }, 'Differences'), labelRows(diffs)) : null,
      table ? h('section', { class: 'card rf-crcard' }, h('h2', { class: 'rf-crcard-h' }, 'Side by side'), table) : null);
  }

  function divaPanel(v) {
    if (!isObj(v)) return h('div', { class: 'card rf-crcard' }, crNode(v, 3));
    var out = [], done = { intro: true, scoring: true, note: true };
    var intro = sentences(v.intro);
    if (intro.length) out.push(h('section', { class: 'card rf-crcard' }, h('h2', { class: 'rf-crcard-h' }, 'What it is'), h('ul', { class: 'rf-dots' }, intro.map(li))));
    var sc = texts(v.scoring);
    if (sc.length) out.push(h('section', { class: 'card rf-crcard' }, h('h2', { class: 'rf-crcard-h' }, 'How it is scored'),
      h('ol', { class: 'rf-numlist' }, sc.map(function (t) { var p = labelSplit(t); return h('li', null, p ? [h('strong', null, p[0]), ' ', p[1]] : t); }))));
    if (txt(v.note)) out.push(ui.callout('info', bullets(v.note), 'How this app uses DIVA 2.0'));
    Object.keys(v).forEach(function (k) { if (!done[k] && has(v[k])) out.push(crCard(keyLabel(k) || 'More', v[k])); });
    return h('div', { class: 'rf-crpanel' }, out);
  }

  /* The 18 symptoms as rows: code, title (link) and the criterion in plain words, grouped by list. */
  function symptomPanel() {
    var list = syms();
    if (!list.length) return ui.empty('Symptoms not loaded', 'The symptom content is not available in this build.');
    return h('div', { class: 'rf-crpanel' },
      h('p', { class: 'rf-lead' }, 'DSM-5-TR criterion A, with the matching DIVA and ASRS v1.1 items. Open a symptom for its questions, examples and scoring rules.'),
      DIMS.map(function (d) {
        var rows = list.filter(function (s) { return dimOf(s) === d[0]; });
        if (!rows.length) return null;
        var hid = 'rf-sl-' + d[0];
        return h('section', { class: 'rf-symgroup', 'aria-labelledby': hid },
          h('h2', { id: hid, class: 'rf-symgroup-h' }, d[1] + ' (' + d[2] + ')', h('span', { class: 'rf-n' }, ' · ' + U.plural(rows.length, 'symptom'))),
          h('ul', { class: 'rf-symrows' }, rows.map(function (s) {
            var asrs = asrsItems(s), codes = [divaCode(s) ? 'DIVA ' + divaCode(s) : '', asrs.length ? 'ASRS ' + asrs.join(', ') : ''].filter(Boolean).join(' · ');
            return h('li', null, h('a', { class: 'rf-symrow', href: '#sym-' + s.id, 'data-go': 'sym-' + s.id },
              h('span', { class: 'rf-code' }, dsmCode(s) || '-'),
              h('span', { class: 'rf-symrow-main' },
                h('span', { class: 'rf-symrow-t' }, symTitle(s)),
                txt(s.criterion) ? h('span', { class: 'rf-symrow-p' }, s.criterion) : null,
                codes ? h('span', { class: 'rf-symrow-m' }, codes) : null),
              h('span', { class: 'rf-symrow-go', 'aria-hidden': 'true' }, '›')));
          })));
      }));
  }

  function renderCriteria(el) {
    var cr = AA.data.criteria;
    el.appendChild(ui.pageHead({
      eyebrow: 'During the interview', title: 'Diagnostic criteria',
      lead: 'DSM-5-TR and ICD-11 criteria for ADHD in plain words, how DIVA 2.0 applies the older DSM-IV rules, what changed, and the 18 symptoms with their codes.',
      actions: [ui.btn({ label: 'Question bank', kind: 'ghost', go: 'bank' })]
    }));
    var tabs = [];
    if (isObj(cr)) {
      var done = { compare: true, comparison: true, changes: true }, present = [], sys = {};
      SYSTEMS.forEach(function (s) {
        var key = [s.k].concat(s.alt).filter(function (k) { return has(cr[k]); })[0];
        if (!key) return;
        done[key] = true;
        sys[s.k] = cr[key];
        present.push({ label: s.label, v: cr[key] });
      });
      var diffs = isObj(sys.icd11) ? texts(sys.icd11.differences) : [];
      var table = compareTable(cr, present);
      if (sys.dsm5) tabs.push({ id: 'dsm5', label: 'DSM-5-TR', render: function () { return dsmPanel(sys.dsm5); } });
      if (sys.icd11) tabs.push({ id: 'icd11', label: 'ICD-11', render: function () { return icdPanel(sys.icd11, diffs.length ? ['differences'] : []); } });
      if (diffs.length || table) tabs.push({ id: 'compare', label: 'How they differ', render: function () { return comparePanel(diffs, table); } });
      if (sys.diva2) tabs.push({ id: 'diva2', label: 'DIVA 2.0', render: function () { return divaPanel(sys.diva2); } });
      if (has(cr.changes)) tabs.push({ id: 'changes', label: 'What changed', render: function () {
        return h('div', { class: 'rf-crpanel' }, h('p', { class: 'rf-lead' }, 'What changed from DSM-IV to DSM-5 and DSM-5-TR, and from ICD-10 to ICD-11.'),
          h('section', { class: 'card rf-crcard' }, Array.isArray(cr.changes) ? changeGroups(cr.changes) : crNode(cr.changes, 3)));
      } });
      Object.keys(cr).forEach(function (k) {
        if (done[k] || !has(cr[k])) return;
        tabs.push({ id: 'x_' + safeId(k), label: keyLabel(k) || 'More', render: function () { return h('div', { class: 'card rf-crcard' }, crNode(cr[k], 3)); } });
      });
    } else if (has(cr)) {
      tabs.push({ id: 'main', label: 'Criteria', render: function () { return h('div', { class: 'card rf-crcard' }, crNode(cr, 3)); } });
    } else {
      el.appendChild(ui.callout('info', h('p', null, 'The criteria text is not available in this build. The 18 symptoms and their codes are below.')));
    }
    tabs.push({ id: 'syms', label: 'The 18 symptoms', render: symptomPanel });
    var ids = tabs.map(function (t) { return t.id; });
    var t = ui.tabs(tabs, ids.indexOf(crMemo.tab) > -1 ? crMemo.tab : ids[0], function (id) { crMemo.tab = id; });
    t.classList.add('rf-tabs');
    el.appendChild(t);
  }

  /* ======================================================================
     Route: bank[-<symptomId>] (question bank)
     The index is built once per session (it holds every askable line in the content) and filtered in memory.
     ====================================================================== */

  var TYPES = ['Question', 'Rephrase', 'Example', 'Probe', 'Informant', 'Impairment', 'Onset', 'Collateral', 'Differential', 'History', 'Risk'];
  var TYPE_WORDS = { Example: ['example', 'examples'], Probe: ['probe', 'probes'], Rephrase: ['other wording', 'other wordings'],
    Informant: ['informant question', 'informant questions'] };
  var PERIOD_LABEL = { adult: 'Adulthood', child: 'Childhood' };
  var FIRST = 40, LIMIT = 120;   // results drawn at once: a short first page (instant), then larger pages
  var bankCache = null;
  var bankMemo = { q: '', types: [], sym: '', period: '', ctx: '', param: '' };

  function bankIndex() {
    var S = syms(), C = condsOrdered();
    var I = isObj(AA.data.impairment) ? AA.data.impairment : {};
    var H = arr(AA.data.history).filter(isObj), R = isObj(AA.data.risk) ? AA.data.risk : {};
    var sig = [S.length, C.length, H.length, Object.keys(I).length, Object.keys(R).length].join(':');
    if (bankCache && bankCache.sig === sig) return bankCache;
    var list = [], ctxs = [], seen = {}, totals = {};
    TYPES.forEach(function (t) { totals[t] = 0; });
    function addCtx(key, label, group) { if (key && !seen[key]) { seen[key] = true; ctxs.push({ k: key, l: label || key, g: group }); } }
    function add(text, type, src, o) {
      var t = txt(text);
      if (!t) return;
      o = o || {};
      var e = { i: list.length, text: t, type: type, src: src || '', period: o.period || '', ctx: o.ctx || '', ctxKey: o.ctxKey || '',
        sym: o.sym || '', route: o.route || '', step: o.step || '' };
      e.low = t.toLowerCase();
      e.hay = (t + '\n' + e.src + '\n' + e.ctx + '\n' + type).toLowerCase();
      list.push(e);
      totals[type]++;
    }
    S.forEach(function (s) {
      var src = symLabel(s), base = { sym: s.id, route: 'sym-' + s.id };
      var ask = isObj(s.ask) ? s.ask : {};
      add(ask.adult, 'Question', src, ext(base, { period: 'adult' }));
      add(ask.child, 'Question', src, ext(base, { period: 'child' }));
      texts(s.rephrase).forEach(function (t) { add(t, 'Rephrase', src, ext(base, { period: 'adult' })); });
      ['adult', 'child'].forEach(function (p) {
        arr(isObj(s.examples) ? s.examples[p] : null).forEach(function (g) {
          if (!isObj(g)) return;
          var key = txt(g.ctx), label = txt(g.label) || key;
          addCtx(key, label, p === 'adult' ? 'Adult life' : 'Childhood');
          texts(g.items).forEach(function (t) { add(t, 'Example', src, ext(base, { period: p, ctx: label, ctxKey: key })); });
        });
      });
      arr(s.probes).forEach(function (pg) {
        if (!isObj(pg)) return;
        var label = probeLabel(pg);
        texts(pg.items).forEach(function (t) { add(t, 'Probe', src, ext(base, { ctx: label })); });
      });
      var inf = isObj(s.informant) ? s.informant : {};
      texts(inf.partner).forEach(function (t) { add(t, 'Informant', src, ext(base, { period: 'adult', ctx: 'Partner' })); });
      texts(inf.parent).forEach(function (t) { add(t, 'Informant', src, ext(base, { period: 'child', ctx: 'Parent' })); });
      texts(inf.school).forEach(function (t) { add(t, 'Informant', src, ext(base, { period: 'child', ctx: 'School reports' })); });
    });
    /* Supplement questions (DIVA): asked once per domain after the nine symptoms. */
    var sp = isObj(I.supplement) ? I.supplement : {};
    [['ia', 'Supplement: inattention'], ['hi', 'Supplement: hyperactivity-impulsivity']].forEach(function (x) {
      var q = isObj(sp[x[0]]) ? sp[x[0]] : {};
      add(q.adult, 'Question', x[1], { period: 'adult', step: x[0] });
      add(q.child, 'Question', x[1], { period: 'child', step: x[0] });
    });
    arr(I.domains).forEach(function (d) {
      if (!isObj(d)) return;
      var key = txt(d.id), label = txt(d.label) || key;
      addCtx(key, label, 'Impairment areas');
      ['adult', 'child'].forEach(function (p) {
        var b = isObj(d[p]) ? d[p] : {};
        texts(b.ask).forEach(function (t) { add(t, 'Impairment', label, { period: p, ctxKey: key, step: 'onset' }); });
        texts(b.items).forEach(function (t) { add(t, 'Impairment', label, { period: p, ctx: 'Example', ctxKey: key, step: 'onset' }); });
      });
    });
    var on = isObj(I.onset) ? I.onset : {};
    texts(on.ask).forEach(function (t) { add(t, 'Onset', 'Age of onset', { period: 'child', step: 'onset' }); });
    texts(on.memoryAids).forEach(function (t) { add(t, 'Onset', 'Memory aids', { period: 'child', step: 'onset' }); });
    texts(isObj(I.duration) ? I.duration.ask : null).forEach(function (t) { add(t, 'Onset', 'Duration', { period: 'adult', step: 'onset' }); });
    var co = isObj(I.collateral) ? I.collateral : {};
    arr(isObj(co.parent) ? co.parent.questions : null).forEach(function (q) { add(isObj(q) ? q.q : q, 'Collateral', 'Parent or carer', { period: 'child', step: 'collateral' }); });
    arr(isObj(co.partner) ? co.partner.questions : null).forEach(function (q) { add(isObj(q) ? q.q : q, 'Collateral', 'Partner', { period: 'adult', step: 'collateral' }); });
    texts(isObj(co.school) ? co.school.lookFor : null).forEach(function (t) { add(t, 'Collateral', 'School reports', { period: 'child', ctx: 'Look for', step: 'collateral' }); });
    C.forEach(function (c) { texts(c.ask).forEach(function (t) { add(t, 'Differential', condName(c), { period: 'adult', route: 'cond-' + c.id }); }); });
    H.forEach(function (sec) { texts(sec.prompts).forEach(function (t) { add(t, 'History', txt(sec.title) || txt(sec.id), { step: 'history' }); }); });
    texts(R.ask).forEach(function (t) { add(t, 'Risk', 'Safety and risk', { period: 'adult', step: 'risk' }); });
    bankCache = { sig: sig, list: list, ctxs: ctxs, totals: totals, syms: S };
    return bankCache;
  }

  /* Text with every match wrapped in <mark>, built from text nodes (never innerHTML). */
  function marked(text, ws) {
    var s = String(text || '');
    ws = ws.filter(function (w) { return !/^[a-z]$/.test(w); });   // a lone letter would light up every line
    if (!ws.length || !s) return s;
    var low = s.toLowerCase();
    if (low.length !== s.length) return s;
    var ranges = [];
    ws.forEach(function (w) { var i = low.indexOf(w); while (i > -1) { ranges.push([i, i + w.length]); i = low.indexOf(w, i + w.length); } });
    if (!ranges.length) return s;
    ranges.sort(function (a, b) { return a[0] - b[0] || b[1] - a[1]; });
    var merged = [];
    ranges.forEach(function (r) { var m = merged[merged.length - 1]; if (m && r[0] <= m[1]) m[1] = Math.max(m[1], r[1]); else merged.push([r[0], r[1]]); });
    var out = [], pos = 0;
    merged.forEach(function (r) {
      if (r[0] > pos) out.push(s.slice(pos, r[0]));
      out.push(h('mark', { class: 'rf-mark' }, s.slice(r[0], r[1])));
      pos = r[1];
    });
    if (pos < s.length) out.push(s.slice(pos));
    return out;
  }

  function selectEl(id, options, value) {
    var sel = h('select', { id: id }, options.map(function (o) {
      return o.items ? h('optgroup', { label: o.g }, o.items.map(function (x) { return h('option', { value: x.v }, x.l); })) : h('option', { value: o.v }, o.l);
    }));
    sel.value = value || '';
    if (sel.value !== (value || '')) sel.value = '';
    return sel;
  }
  /* A labelled filter select that looks like a chip and shows when it is set. */
  function facet(label, sel) {
    function paint() { wrap.classList.toggle('is-set', !!sel.value); }
    var wrap = h('label', { class: 'rf-facet', for: sel.id }, h('span', { class: 'rf-facet-k' }, label), sel);
    sel.addEventListener('change', paint);
    paint();
    wrap.paint = paint;
    return wrap;
  }

  function renderBank(el, params) {
    var idx = bankIndex();
    var last = lastA();
    var f = { q: bankMemo.q, types: bankMemo.types.slice(), sym: bankMemo.sym, period: bankMemo.period, ctx: bankMemo.ctx };
    /* "bank-ia3" opens the bank on one symptom; refresh() of the same route keeps the clinician's later changes. */
    var param = params && params[0] ? params[0] : '';
    if (param && param !== bankMemo.param) { f.sym = param; f.q = ''; f.types = []; f.period = ''; f.ctx = ''; }
    if (f.sym && !idx.syms.some(function (s) { return s.id === f.sym; })) f.sym = '';
    if (f.ctx && !idx.ctxs.some(function (c) { return c.k === f.ctx; })) f.ctx = '';
    f.types = f.types.filter(function (t) { return idx.totals[t] > 0; });

    el.appendChild(ui.pageHead({
      eyebrow: 'During the interview', title: 'Question bank',
      lead: 'Every interview question, other wording, example and probe in one place. Search with a word or two, then narrow the results.',
      actions: [last ? ui.btn({ label: 'Back to the assessment', kind: 'ghost', go: AA.shell.resumeRoute ? AA.shell.resumeRoute(last) : 'assess-' + last.id + '-' + (last.step || 'setup'), icon: '←' }) : null].filter(Boolean)
    }));
    if (!idx.list.length) {
      el.appendChild(ui.empty('The question bank is empty', 'No interview content is loaded in this build.', ui.btn({ label: 'Go to home', kind: 'primary', go: 'home' })));
      return;
    }
    function save() { bankMemo = { q: f.q, types: f.types.slice(), sym: f.sym, period: f.period, ctx: f.ctx, param: param }; }
    save();

    /* ---- Search and filters, in the hero ---- */
    var search = ui.search('Search questions and examples', function (q) { f.q = q; apply(); save(); }, f.q);
    search.classList.add('rf-bigsearch');
    var chipEls = {};
    var chips = h('ul', { class: 'ds-chips rf-tchips' }, TYPES.filter(function (t) { return idx.totals[t] > 0; }).map(function (t) {
      var n = h('span', { class: 'ds-chip-n' });
      var b = h('button', { type: 'button', class: 'ds-chip', 'aria-pressed': 'false', onclick: function () {
        var i = f.types.indexOf(t);
        if (i > -1) f.types.splice(i, 1); else f.types.push(t);
        apply(); save();
      } }, h('span', null, t), n);
      chipEls[t] = { b: b, n: n };
      return h('li', null, b);
    }));
    var symSel = selectEl(ui.nid('rf-sym'), [{ v: '', l: 'Any symptom' }].concat(DIMS.map(function (d) {
      return { g: d[1], items: idx.syms.filter(function (s) { return dimOf(s) === d[0]; }).map(function (s) { return { v: s.id, l: symLabel(s) }; }) };
    }).filter(function (g) { return g.items.length; })), f.sym);
    var perSel = selectEl(ui.nid('rf-per'), [{ v: '', l: 'Any period' }, { v: 'adult', l: 'Adulthood' }, { v: 'child', l: 'Childhood' }], f.period);
    var ctxGroups = [];
    idx.ctxs.forEach(function (c) { if (ctxGroups.indexOf(c.g) < 0) ctxGroups.push(c.g); });
    var ctxSel = selectEl(ui.nid('rf-ctx'), [{ v: '', l: 'Any life area' }].concat(ctxGroups.map(function (g) {
      return { g: g, items: idx.ctxs.filter(function (c) { return c.g === g; }).map(function (c) { return { v: c.k, l: c.l }; }) };
    })), f.ctx);
    var facets = [facet('Symptom', symSel), facet('Period', perSel), facet('Life area', ctxSel)];
    symSel.addEventListener('change', function () { f.sym = symSel.value; apply(); save(); });
    perSel.addEventListener('change', function () { f.period = perSel.value; apply(); save(); });
    ctxSel.addEventListener('change', function () { f.ctx = ctxSel.value; apply(); save(); });
    var clearBtn = ui.btn({ label: 'Clear all', kind: 'quiet', small: true, onClick: function () {
      f.q = ''; f.types = []; f.sym = ''; f.period = ''; f.ctx = '';
      search.value = ''; symSel.value = ''; perSel.value = ''; ctxSel.value = '';
      apply(); save(); search.focus();
    } });

    el.appendChild(ui.hero({ label: 'Search the question bank', eyebrow: 'Search ' + fmt(idx.list.length) + ' questions and examples',
      text: h('div', { class: 'rf-bfilters', role: 'search', 'aria-label': 'Search the question bank' },
        h('div', { class: 'rf-bsearch-row' }, h('div', { class: 'rf-searchbox' }, ui.icon('search'), search), h('span', { class: 'hint rf-kbd' }, 'Press ', h('kbd', null, '/'), ' to search')),
        h('div', { class: 'rf-brow' }, h('span', { class: 'rf-brow-k', id: 'rf-type-k' }, 'Type'),
          h('div', { class: 'rf-chiprow', role: 'group', 'aria-labelledby': 'rf-type-k' }, chips)),
        h('div', { class: 'rf-brow' }, h('span', { class: 'rf-brow-k' }, 'Narrow by'), h('div', { class: 'rf-facets' }, facets))) }));

    var countEl = h('p', { class: 'rf-status', role: 'status', 'aria-live': 'polite', tabindex: '-1' });
    el.appendChild(h('div', { class: 'rf-status-row' }, countEl, clearBtn));

    /* ---- Overview (no search or filter yet): built once ---- */
    function setSym(id) { f.sym = id; symSel.value = id; apply(); save(); countEl.focus(); }
    function setType(t) { f.types = [t]; apply(); save(); countEl.focus(); }
    var perSym = {};
    idx.list.forEach(function (e) { if (e.sym) { var m = perSym[e.sym] = perSym[e.sym] || {}; m[e.type] = (m[e.type] || 0) + 1; } });
    var other = ['Impairment', 'Onset', 'Collateral', 'Differential', 'History', 'Risk'].filter(function (t) { return idx.totals[t] > 0; });
    var overview = h('div', { class: 'rf-ov' },
      ui.section({ id: 'rf-ov-syms', title: 'Start from a symptom', text: 'Or type a word or two above, for example "deadline", "keys" or "school report". All words must match.' },
        DIMS.map(function (d) {
          var list = idx.syms.filter(function (s) { return dimOf(s) === d[0]; });
          if (!list.length) return null;
          return h('section', { class: 'rf-ov-sec', 'aria-labelledby': 'rf-ov-' + d[0] },
            h('h3', { id: 'rf-ov-' + d[0], class: 'rf-k3' }, d[1], h('span', { class: 'rf-n' }, String(list.length))),
            h('ul', { class: 'rf-ov-grid' }, list.map(function (s) {
              var m = perSym[s.id] || {};
              var parts = ['Example', 'Probe', 'Rephrase', 'Informant'].filter(function (t) { return m[t]; }).map(function (t) { return fmt(m[t]) + ' ' + TYPE_WORDS[t][m[t] === 1 ? 0 : 1]; });
              return h('li', null, h('button', { type: 'button', class: 'rf-ov-sym', onclick: function () { setSym(s.id); } },
                h('span', { class: 'rf-code' }, divaCode(s) || dsmCode(s) || ''),
                h('span', { class: 'rf-ov-main' }, h('span', { class: 'rf-ov-title' }, symTitle(s)),
                  h('span', { class: 'rf-ov-counts' }, parts.join(' · ') || 'No items'))));
            })));
        })),
      other.length ? ui.section({ id: 'rf-ov-other', title: 'Other question sets', text: 'Impairment, onset, collateral, differential, history and risk questions.' },
        ui.chips(other.map(function (t) { return { label: t, n: fmt(idx.totals[t]), onClick: function () { setType(t); } }; }))) : null);

    /* ---- Results ---- */
    var resList = h('ul', { class: 'rf-res-list', 'aria-labelledby': 'rf-res-h' });
    var moreBtn = ui.btn({ label: 'Show more', kind: 'secondary', onClick: function () { more(true); } });
    var noRes = ui.empty('Nothing matches', 'Try fewer or shorter words, or clear a filter.', ui.btn({ label: 'Clear all', kind: 'primary', onClick: function () { clearBtn.click(); } }));
    var results = h('section', { class: 'rf-results', 'aria-labelledby': 'rf-res-h' },
      h('h2', { id: 'rf-res-h', class: 'sr-only' }, 'Results'), resList, noRes, h('div', { class: 'rf-more' }, moreBtn));
    el.appendChild(overview);
    el.appendChild(results);

    var hits = [], shown = 0, curWords = [];
    resList.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button[data-copy]') : null;
      if (!b) return;
      var it = idx.list[+b.getAttribute('data-copy')];
      if (it) copyLines([it.text], 'Text');
    });
    function routeOf(e) { return e.route || (e.step && last ? 'assess-' + last.id + '-' + e.step : ''); }
    function sep() { return h('span', { class: 'rf-sep', 'aria-hidden': 'true' }, '·'); }
    function item(e) {
      var r = routeOf(e);
      return h('li', { class: 'rf-res' },
        h('div', { class: 'rf-res-body' },
          h('p', { class: 'rf-res-text' }, marked(e.text, curWords)),
          h('p', { class: 'rf-res-meta' },
            h('span', { class: 'rf-type rf-type-' + e.type.toLowerCase() }, e.type),
            r ? h('a', { href: '#' + r, 'data-go': r }, marked(e.src, curWords)) : h('span', null, marked(e.src, curWords)),
            e.ctx ? [sep(), h('span', null, marked(e.ctx, curWords))] : null,
            e.period ? [sep(), h('span', null, PERIOD_LABEL[e.period])] : null)),
        h('button', { type: 'button', class: 'btn btn-quiet btn-sm rf-copy', 'data-copy': String(e.i), 'aria-label': 'Copy: ' + (e.text.length > 60 ? e.text.slice(0, 57) + '...' : e.text) }, 'Copy'));
    }
    /* Draw the next page of results. focus: move focus to the first new result (the button's own click). */
    function more(focus) {
      var frag = document.createDocumentFragment();
      var end = Math.min(hits.length, shown + (shown ? LIMIT : FIRST));
      var first = null;
      for (var i = shown; i < end; i++) { var node = item(hits[i]); if (!first) first = node; frag.appendChild(node); }
      var focusNext = focus === true && shown > 0 && first;
      resList.appendChild(frag);
      shown = end;
      moreBtn.parentNode.hidden = shown >= hits.length;
      moreBtn.textContent = 'Show ' + Math.min(LIMIT, hits.length - shown) + ' more';
      countEl.textContent = 'Showing ' + fmt(shown) + ' of ' + U.plural(hits.length, 'match', 'matches').replace(/^\d+/, fmt(hits.length));
      if (focusNext) { var cb = first.querySelector('button'); if (cb) cb.focus(); }
    }
    /* Scrolling near the end of the list draws the next page by itself; the button stays for keyboards. */
    var autoMore = null;
    if (typeof window.IntersectionObserver === 'function') {
      try {
        autoMore = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; }) && !results.hidden && shown < hits.length && shown > 0) more(false);
        }, { rootMargin: '0px 0px 600px 0px' });
        autoMore.observe(moreBtn.parentNode);
      } catch (e) { autoMore = null; }
    }
    function apply() {
      var ws = wordsOf(f.q);
      var active = !!(ws.length || f.types.length || f.sym || f.period || f.ctx);
      var tc = {};
      TYPES.forEach(function (t) { tc[t] = 0; });
      hits = [];
      idx.list.forEach(function (e) {
        if (f.sym && e.sym !== f.sym) return;
        if (f.period && e.period !== f.period) return;
        if (f.ctx && e.ctxKey !== f.ctx) return;
        for (var i = 0; i < ws.length; i++) if (e.hay.indexOf(ws[i]) < 0) return;
        tc[e.type]++;
        if (!f.types.length || f.types.indexOf(e.type) > -1) hits.push(e);
      });
      /* Lines whose own text holds the words come before lines that match only on their source or area. */
      if (ws.length) {
        hits.forEach(function (e) { var r = 0; for (var i = 0; i < ws.length; i++) if (e.low.indexOf(ws[i]) > -1) r++; e._r = r; });
        hits.sort(function (a, b) { return b._r - a._r || a.i - b.i; });
      }
      Object.keys(chipEls).forEach(function (t) {
        var c = chipEls[t], on = f.types.indexOf(t) > -1;
        c.b.setAttribute('aria-pressed', on ? 'true' : 'false');
        c.b.classList.toggle('is-on', on);
        c.b.classList.toggle('is-empty', !tc[t]);
        U.clear(c.n);
        U.append(c.n, [fmt(tc[t]), h('span', { class: 'sr-only' }, tc[t] === 1 ? ' match' : ' matches')]);
      });
      facets.forEach(function (x) { x.paint(); });
      curWords = ws;
      overview.hidden = active;
      results.hidden = !active;
      clearBtn.hidden = !active;
      U.clear(resList);
      shown = 0;
      noRes.hidden = !active || hits.length > 0;
      resList.hidden = !hits.length;
      if (!active) {
        countEl.textContent = fmt(idx.list.length) + ' questions and examples in the bank.';
        moreBtn.parentNode.hidden = true;
        return;
      }
      if (!hits.length) { countEl.textContent = 'No matches.'; moreBtn.parentNode.hidden = true; return; }
      more(false);
    }
    apply();

    /* "/" focuses the search box, as in many search tools. */
    function onKey(e) {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      e.preventDefault();
      search.focus();
      search.select();
    }
    document.addEventListener('keydown', onKey);
    return function () { document.removeEventListener('keydown', onKey); if (autoMore) autoMore.disconnect(); };
  }

  /* ======================================================================
     Route: sym-<id> (one symptom's reference page, outside any assessment)
     ====================================================================== */

  var symMemo = { q: 'adult', exP: 'adult', ex_adult: '', ex_child: '', probe: '', inf: '', anchor: '' };
  /* The main question in each wording the interview uses (ARCHITECTURE.md 5.1). */
  var QV = [['adult', 'Adulthood', 'Adulthood: the last 6 months'], ['child', 'Childhood', 'Childhood: age 5 to 12'],
    ['parent', 'Parent or carer', 'To the parent or carer of a child aged 6 to 11, about the last 6 months'],
    ['teen', 'Young person', 'To the young person aged 12 to 17, about the last 6 months'],
    ['teacher', 'Teacher', 'To the teacher, compared with others in the class']];
  var INF = [['partner', 'Partner', 'Questions for a partner about now.'],
    ['parent', 'Parent or carer', 'Questions for a parent or older relative about childhood.'],
    ['school', 'School reports: look for', 'Phrases to look for in old school reports.'],
    ['teacher', 'Teacher may say', 'What a teacher may say about a young person now.']];

  function renderSym(el, params) {
    var list = syms();
    var idx = -1;
    list.forEach(function (x, i) { if (x.id === params[0]) idx = i; });
    var s = idx > -1 ? list[idx] : null;
    if (!s) {
      notFound(el, 'Question bank', 'Symptom not found', 'This symptom is not in the interview content.', 'bank', 'Question bank');
      return;
    }
    var dsm = dsmCode(s), diva = divaCode(s), asrs = asrsItems(s), dim = dimOf(s);
    var same = list.filter(function (x) { return dimOf(x) === dim; });
    var last = lastA();
    var useRoute = last ? 'assess-' + last.id + '-' + dim.toLowerCase() + '-' + s.id : null;
    el.appendChild(ui.pageHead({
      eyebrow: (dim === 'HI' ? 'Hyperactivity and impulsivity' : 'Inattention') + ' · symptom ' + (same.indexOf(s) + 1) + ' of ' + same.length,
      title: symTitle(s),
      actions: [
        useRoute ? ui.btn({ label: 'Use in an assessment', kind: 'primary', go: useRoute, title: 'Open this symptom in the assessment for ' + ((last.patient && last.patient.ref) || 'the current patient') }) : null,
        ui.btn({ label: 'Search the bank', kind: 'ghost', go: 'bank-' + s.id })
      ].filter(Boolean)
    }));

    var stats = [];
    if (dsm) stats.push({ n: dsm, l: 'DSM-5-TR criterion' });
    if (diva) stats.push({ n: diva, l: 'DIVA 2.0 item' });
    if (asrs.length) stats.push({ n: asrs.join(', '), l: asrs.length > 1 ? 'ASRS v1.1 items' : 'ASRS v1.1 item' });
    el.appendChild(ui.hero({ label: 'The criterion', eyebrow: 'The criterion in plain words',
      text: txt(s.criterion) ? h('p', { class: 'ds-hero-p rf-crit-text' }, s.criterion) : h('p', { class: 'ds-hero-p' }, 'No criterion text recorded.'),
      aside: stats.length ? statTiles(stats) : null }));

    var main = [], toc = [];
    function add(id, label, title, text, content, actions) {
      if (!content) return;
      toc.push({ id: id, label: label });
      main.push(ui.section({ id: id, title: title, text: text, actions: actions }, content));
    }

    /* ---- What it looks like ---- */
    if (txt(s.adultForm) || txt(s.why)) {
      add('rf-look', 'What it looks like', 'What it looks like', 'How it shows in adults, and what lies behind it.', infoCards([
        txt(s.adultForm) ? { icon: 'users', title: 'How it shows in adults', body: bullets(s.adultForm) } : null,
        txt(s.why) ? { icon: 'brain', title: 'Why it happens', body: bullets(s.why) } : null
      ], true));
    }

    /* ---- Questions ---- */
    var ask = isObj(s.ask) ? s.ask : {};
    var qs = QV.filter(function (q) { return txt(ask[q[0]]); });
    if (qs.length) {
      var qPanel = function (q) { return h('div', { class: 'rf-qv' }, h('p', { class: 'rf-q-k' }, q[2]), h('p', { class: 'sx-ask' }, ask[q[0]])); };
      add('rf-q', 'Main questions', 'Main questions', 'The question to read out, in each wording the interview uses.',
        h('div', { class: 'card rf-qcard' }, qs.length > 1 ? ui.tabs(qs.map(function (q) { return { id: q[0], label: q[1], render: function () { return qPanel(q); } }; }),
          qs.some(function (q) { return q[0] === symMemo.q; }) ? symMemo.q : qs[0][0], function (id) { symMemo.q = id; }) : qPanel(qs[0])),
        ui.btn({ label: 'Copy questions', kind: 'ghost', small: true, onClick: function () {
          copyLines(qs.map(function (q) { return q[2] + ': ' + ask[q[0]]; }), 'Questions');
        } }));
    }
    var reph = texts(s.rephrase);
    if (reph.length) {
      add('rf-reph', 'Other ways to ask', 'Other ways to ask', 'Plainer, more open or more concrete wordings when the main question does not land.',
        h('div', { class: 'card' }, h('ol', { class: 'rf-numlist rf-cols2' }, reph.map(li))),
        ui.btn({ label: 'Copy all', kind: 'ghost', small: true, onClick: function () { copyLines(reph, 'Wordings'); } }));
    }

    /* ---- Examples by life area: one period, one area at a time ---- */
    var ex = isObj(s.examples) ? s.examples : {};
    function exGroups(p) {
      return arr(ex[p]).filter(function (g) { return isObj(g) && texts(g.items).length; })
        .map(function (g) { return { k: txt(g.ctx) || txt(g.label), label: txt(g.label) || txt(g.ctx) || 'Examples', items: texts(g.items) }; });
    }
    var periods = [['adult', 'Adulthood'], ['child', 'Childhood']].map(function (p) {
      var gs = exGroups(p[0]);
      return { k: p[0], label: p[1], groups: gs, n: gs.reduce(function (n, g) { return n + g.items.length; }, 0) };
    }).filter(function (p) { return p.n; });
    if (periods.length) {
      var exPanel = function (p) { return chipPicker(p.groups, symMemo, 'ex_' + p.k, 'Life area'); };
      add('rf-ex-sec', 'Examples', 'Examples by life area', 'Concrete behaviours to ask about or recognise. Pick a life area; tick them in the interview, not here.',
        h('div', { class: 'card rf-excard' }, periods.length > 1
          ? ui.tabs(periods.map(function (p) { return { id: p.k, label: p.label, count: fmt(p.n), render: function () { return exPanel(p); } }; }),
            periods.some(function (p) { return p.k === symMemo.exP; }) ? symMemo.exP : periods[0].k, function (id) { symMemo.exP = id; })
          : exPanel(periods[0])));
    }

    /* ---- Probes and informants ---- */
    var probes = arr(s.probes).filter(function (p) { return isObj(p) && texts(p.items).length; });
    if (probes.length) {
      add('rf-probes', 'Probes', 'Probes', 'Follow-up questions on how often, how much, where and since when.',
        h('div', { class: 'card' }, chipPicker(probes.map(function (p) { return { k: txt(p.k) || probeLabel(p), label: probeLabel(p), items: texts(p.items) }; }), symMemo, 'probe', 'Probe type', 'rf-single')));
    }
    var inf = isObj(s.informant) ? s.informant : {};
    var infs = INF.filter(function (x) { return texts(inf[x[0]]).length; });
    if (infs.length) {
      var infPanel = function (x) { return h('div', null, h('p', { class: 'rf-q-k' }, x[2]), h('ul', { class: 'rf-dots rf-cols2' }, texts(inf[x[0]]).map(li))); };
      add('rf-inf', 'Informants', 'Informant questions', 'What to ask people who know them, and what to look for in reports.',
        h('div', { class: 'card' }, infs.length > 1
          ? ui.tabs(infs.map(function (x) { return { id: x[0], label: x[1], count: texts(inf[x[0]]).length, render: function () { return infPanel(x); } }; }),
            infs.some(function (x) { return x[0] === symMemo.inf; }) ? symMemo.inf : infs[0][0], function (id) { symMemo.inf = id; })
          : infPanel(infs[0])));
    }

    /* ---- How to score ---- */
    var counts = texts(s.counts), notCount = texts(s.notCount);
    var anchors = arr(s.anchors).filter(function (a) { return isObj(a) && (txt(a.quote) || txt(a.why)); });
    if (counts.length || notCount.length || anchors.length) {
      var aGroups = ['yes', 'unsure', 'no'].map(function (k) { return { k: k, items: anchors.filter(function (a) { return a.score === k; }) }; })
        .filter(function (g) { return g.items.length; });
      var otherAnchors = anchors.filter(function (a) { return !ANCHOR[a.score]; });
      if (otherAnchors.length) aGroups.push({ k: 'other', items: otherAnchors });
      var anchorList = function (g) {
        return h('ul', { class: 'rf-anchors' }, g.items.map(function (a) {
          var m = ANCHOR[a.score] || ['Score', 'neutral'];
          return h('li', { class: 'rf-anchor is-' + (ANCHOR[a.score] ? a.score : 'other') },
            h('div', { class: 'rf-anchor-top' }, ui.badge(m[0], m[1]), txt(a.quote) ? h('p', { class: 'rf-anchor-q' }, a.quote) : null),
            txt(a.why) ? h('p', { class: 'rf-anchor-why' }, a.why) : null);
        }));
      };
      add('rf-score', 'How to score', 'How to score', 'When it counts as present, when it does not, and examples to calibrate against.',
        h('div', { class: 'card rf-score' },
          counts.length || notCount.length ? pairOrTabs([
            counts.length ? { id: 'yes', tab: 'Count it', title: [ui.icon('check'), 'Count it as present when'], count: counts.length, cls: 'rf-score-col is-yes',
              node: h('ul', { class: 'rf-dots' }, counts.map(li)) } : null,
            notCount.length ? { id: 'no', tab: 'Do not count it', title: [ui.icon('alert'), 'Do not count it when'], count: notCount.length, cls: 'rf-score-col is-no',
              node: h('ul', { class: 'rf-dots' }, notCount.map(li)) } : null
          ], 'rf-score-cols') : null,
          aGroups.length ? h('div', { class: 'rf-anchors-wrap' }, h('h3', { class: 'rf-k3' }, 'Calibration examples', h('span', { class: 'rf-n' }, String(anchors.length))),
            aGroups.length > 1 ? ui.tabs(aGroups.map(function (g) { return { id: g.k, label: (ANCHOR[g.k] || ['Other'])[0], count: g.items.length, render: function () { return anchorList(g); } }; }),
              aGroups.some(function (g) { return g.k === symMemo.anchor; }) ? symMemo.anchor : aGroups[0].k, function (id) { symMemo.anchor = id; })
              : anchorList(aGroups[0])) : null));
    }

    /* ---- Could it be something else? ---- */
    var mimics = arr(s.mimics).filter(function (m) { return isObj(m) && txt(m.ddx); });
    if (mimics.length) {
      add('rf-sm', 'Something else?', 'Could it be something else?', 'Conditions that can look like this symptom: the clue to notice and the question to ask.',
        narrow() ? ui.acc(mimics.map(function (m) {
          var c = condById(m.ddx);
          return { title: c ? condName(c) : m.ddx, render: function () {
            return h('div', { class: 'rf-mbody' },
              txt(m.clue) ? h('p', null, h('span', { class: 'rf-k' }, 'Clue'), m.clue) : null,
              txt(m.ask) ? h('p', { class: 'rf-ask' }, h('span', { class: 'rf-k' }, 'Ask'), m.ask) : null,
              c ? h('p', { class: 'rf-mlink' }, go('cond-' + c.id, 'Open the condition →')) : null);
          } };
        })) : h('ul', { class: 'ds-cards is-2 rf-mimics' }, mimics.map(function (m) {
          var c = condById(m.ddx);
          var inner = [h('span', { class: 'ds-card-t' }, c ? condName(c) : m.ddx),
            txt(m.clue) ? h('span', { class: 'ds-card-p' }, h('span', { class: 'rf-k' }, 'Clue'), m.clue) : null,
            txt(m.ask) ? h('span', { class: 'ds-card-p rf-ask' }, h('span', { class: 'rf-k' }, 'Ask'), m.ask) : null,
            c ? h('span', { class: 'ds-card-m' }, 'Open the condition →') : null];
          return h('li', null, c ? h('a', { class: 'ds-card rf-mimic', href: '#cond-' + c.id, 'data-go': 'cond-' + c.id }, inner) : h('div', { class: 'ds-card rf-mimic' }, inner));
        })),
        h('span', { class: 'rf-n' }, U.plural(mimics.length, 'condition')));
    }

    /* ---- Special groups (folded) and sources ---- */
    var sp = isObj(s.special) ? s.special : {};
    var spRows = SPECIAL.filter(function (x) { return txt(sp[x[0]]); }).map(function (x) { return [x[1], sp[x[0]]]; });
    Object.keys(sp).forEach(function (k) { if (!SPECIAL.some(function (x) { return x[0] === k; }) && txt(sp[k])) spRows.push([keyLabel(k), sp[k]]); });
    if (spRows.length) {
      add('rf-sp-sec', 'Special groups', 'Special groups', 'How it can look different, and what to check, in particular groups.',
        ui.acc(spRows.map(function (r) { return { title: r[0], render: function () { return bullets(r[1]); } }; })));
    }
    var src = sourcesBox(s.refs);
    if (src) main.push(h('div', { class: 'rf-srcwrap' }, src));

    var nav = ui.toc(toc);
    el.appendChild(splitOf(main, nav));

    if (useRoute) {
      el.appendChild(h('div', { class: 'rf-use' },
        h('p', null, 'Ready to ask it? Open ', h('strong', null, symTitle(s)), ' in the assessment for ', (last.patient && last.patient.ref) || 'the current patient', '.'),
        ui.btn({ label: 'Use in an assessment', kind: 'primary', go: useRoute })));
    }
    var p = list[idx - 1], n = list[idx + 1];
    el.appendChild(pnNav(p ? { go: 'sym-' + p.id, t: symLabel(p) } : null, n ? { go: 'sym-' + n.id, t: symLabel(n) } : null, 'Previous and next symptom'));
    return function () { if (nav.disconnect) nav.disconnect(); };
  }

  /* ---------- Routes ---------- */
  AA.router.register('ddx', { title: 'Differential diagnosis', render: function (el, params) { renderDdx(el, params || []); } });
  AA.router.register('cond', {
    title: function (p) { var c = p && p[0] ? condById(p[0]) : null; return c ? condName(c) + ' · Differentials' : 'Condition'; },
    render: function (el, params) { return renderCond(el, params || []); }
  });
  AA.router.register('criteria', { title: 'Diagnostic criteria', render: function (el) { renderCriteria(el); } });
  AA.router.register('bank', { title: 'Question bank', render: function (el, params) { return renderBank(el, params || []); } });
  AA.router.register('sym', {
    title: function (p) { var s = p && p[0] ? symById(p[0]) : null; return s ? symTitle(s) + ' · Symptoms' : 'Symptom'; },
    render: function (el, params) { return renderSym(el, params || []); }
  });

  AA.views.reference = { bankIndex: bankIndex, groupLabel: groupLabel };
})(window.AA);
