/* Assessment steps, part B: differential diagnosis (criterion E), symptom validity and consistency,
   scoring and diagnosis, and the draft report with the agreed plan.
   Each step registers AA.steps.<id> = {render(el, ctx)} (see ARCHITECTURE.md, section 6).
   The frame renders the h1, step strip, live panel and previous/next buttons, so step content
   starts at h2. Steps write through ctx.set (undefined deletes) and re-read with ctx.get.
   Everything computed here summarises what was recorded. The clinician makes the decision. */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui, D = AA.diagnosis;
  AA.steps = AA.steps || {};

  /* ---------- Shared helpers ---------- */

  function arr(x) { return Array.isArray(x) ? x : []; }
  function has(v) { return v !== null && v !== undefined && v !== ''; }
  function nil(v) { return v === null ? undefined : v; }
  function textOrNone(v) { return String(v || '').trim() ? v : undefined; }
  function fill(host, node) { U.clear(host); U.append(host, node); }
  function syms() { return arr(AA.data.symptoms).filter(function (s) { return s && s.id; }); }
  function symCode(s) { return (s.codes && s.codes.dsm5) || s.id; }
  function condName(c) { return c ? (c.name || c.id) : ''; }
  var KNOWN_ABBR = { asrs18: 'ASRS v1.1', wurs25: 'WURS-25', wfirs: 'WFIRS-S' };
  function toolAbbr(id) { var t = AA.byId('tools', id); return t ? (t.abbr || t.id) : (KNOWN_ABBR[id] || id); }
  /* Score a stored questionnaire. Never throws: odd data gives null. */
  function scoreOf(a, id) { try { return AA.scoring.forAssessment(a, id); } catch (e) { return null; } }
  function isPositive(r) { return !!r && r.answered > 0 && (r.positive === true || (r.sev !== null && r.sev !== undefined && r.sev >= 2)); }
  function sevLabels() {
    var s = arr(AA.data.impairment && AA.data.impairment.severity);
    var out = { 0: 'None', 1: 'Mild', 2: 'Moderate', 3: 'Severe' };
    s.forEach(function (x) { if (x && typeof x.v === 'number' && x.l) out[x.v] = x.l; });
    return out;
  }
  function ratingLabels() {
    var r = arr(AA.data.impairment && AA.data.impairment.collateral && AA.data.impairment.collateral.rating);
    var out = { 0: 'None or little support', 1: 'Some support', 2: 'Clear support' };
    r.forEach(function (x) { if (x && typeof x.v === 'number' && x.l) out[x.v] = x.l; });
    return out;
  }

  /* <details> whose body is built the first time it opens (40 conditions with long content). */
  function lazyDetails(summary, build, o) {
    var body = h('div', { class: 'ab-dbody' });
    var built = false;
    function ensure() { if (!built) { built = true; build(body); } }
    var d = ui.details(summary, body, { open: !!o.open, meta: o.meta, cls: o.cls, onToggle: function (open) { if (open) ensure(); } });
    if (o.open) ensure();
    d.ensure = ensure;
    return d;
  }
  /* Open a disclosure, build it if needed and move focus to its summary. */
  function reveal(d) {
    if (!d) return;
    d.hidden = false;
    d.open = true;
    if (d.ensure) d.ensure();
    var s = d.querySelector('summary');
    try { d.scrollIntoView({ block: 'start' }); } catch (e) { /* old browsers */ }
    if (s) { try { s.focus({ preventScroll: true }); } catch (e) { s.focus(); } }
  }
  function copy(text, what) {
    U.copyText(text).then(function (ok) { U.toast(ok ? what + ' copied' : 'Copy failed. Your browser blocked the clipboard.', ok ? 'ok' : 'err'); });
  }

  var SCORE_LABEL = { yes: 'Present', no: 'Absent', unsure: 'Unsure' };
  var SCORE_KIND = { yes: 'ok', no: 'neutral', unsure: 'warn' };
  function scoreBadge(v) { return SCORE_LABEL[v] ? ui.badge(SCORE_LABEL[v], SCORE_KIND[v]) : h('span', { class: 'ab-none' }, 'Not scored'); }
  var INF_LABEL = { na: 'n/a', 0: 'none', 1: 'some', 2: 'clear' };

  /* ---------- Differential verdicts and feature bands ---------- */

  var VERDICTS = [
    { v: 'absent', l: 'Absent', kind: 'no', badge: 'ok', d: 'No convincing evidence of this condition, now or in the past.' },
    { v: 'comorbid', l: 'Co-occurring', kind: 'yes', badge: 'info', d: 'Present, but it does not account for the ADHD symptoms. Diagnose both.' },
    { v: 'better', l: 'Better explains', kind: 'better', badge: 'err', d: 'It accounts for the symptoms. ADHD is not diagnosed (criterion E not met).' },
    { v: 'uncertain', l: 'Uncertain', kind: 'unsure', badge: 'warn', d: 'You cannot decide yet. Note what information you need.' }
  ];
  function verdictOf(v) { return VERDICTS.filter(function (x) { return x.v === v; })[0] || null; }
  function verdictBadge(v) { var m = verdictOf(v); return m ? ui.badge(m.l, m.badge) : ui.badge('Not reviewed', 'neutral'); }

  var BAND = {
    none: { l: 'None', kind: 'neutral', d: 'No features of this condition ticked yet.' },
    weak: { l: 'Weak', kind: 'info', d: 'A few features. Unlikely to explain the picture on their own.' },
    possible: { l: 'Possible', kind: 'warn', d: 'Several features. Explore further before you decide.' },
    strong: { l: 'Strong', kind: 'err', d: 'Many features. This condition may explain the symptoms, or co-occur.' }
  };
  function bandOf(b) { return BAND[b] || BAND.none; }

  var GROUPS = { mood: 'Mood', anxiety: 'Anxiety and obsessive-compulsive', trauma: 'Trauma and stress', personality: 'Personality',
    neurodevelopmental: 'Neurodevelopmental', substance: 'Substances and behavioural addictions', psychosis: 'Psychosis', sleep: 'Sleep',
    medical: 'Physical health and medicines', cognitive: 'Cognitive', other: 'Other explanations' };
  var GROUP_ORDER = ['mood', 'anxiety', 'trauma', 'personality', 'neurodevelopmental', 'substance', 'psychosis', 'sleep', 'medical', 'cognitive', 'other'];
  function groupKey(c) { return c.group || 'other'; }
  function groupLabel(g) { return GROUPS[g] || (g.charAt(0).toUpperCase() + g.slice(1)); }
  function groupOrder(list) {
    var seen = [];
    list.forEach(function (c) { if (seen.indexOf(groupKey(c)) < 0) seen.push(groupKey(c)); });
    return seen.sort(function (x, y) {
      var a = GROUP_ORDER.indexOf(x), b = GROUP_ORDER.indexOf(y);
      return (a < 0 ? 99 : a) - (b < 0 ? 99 : b);
    });
  }

  /* What this assessment already says about a condition: positive screens, ticked history items
     linked to it, and symptoms where it was flagged as a possible mimic. */
  function signalsFor(a, cond) {
    var out = { screens: [], history: [], symptoms: [], n: 0 };
    try { D.ddxScreens(a, cond).forEach(function (s) { if (s.positive) out.screens.push(s); }); } catch (e) { /* missing tools */ }
    var hist = (a && a.history) || {};
    arr(AA.data.history).forEach(function (sec) {
      var checks = (hist[sec.id] && hist[sec.id].checks) || {};
      arr(sec.items).forEach(function (it) { if (it && it.ddx === cond.id && checks[it.id]) out.history.push({ t: it.t, sec: sec.title }); });
    });
    var rec = (a && a.symptoms) || {};
    syms().forEach(function (s) {
      var f = rec[s.id] && rec[s.id].flags;
      if (!f || !f[cond.id]) return;
      var m = arr(s.mimics).filter(function (x) { return x && x.ddx === cond.id; })[0];
      out.symptoms.push({ s: s, clue: m ? m.clue : '' });
    });
    out.n = out.screens.length + out.history.length + out.symptoms.length;
    return out;
  }
  function resultText(r) {
    if (!r) return '';
    var bits = [];
    if (typeof r.total === 'number' && r.max) bits.push(r.total + '/' + r.max);
    if (r.band) bits.push(r.band);
    return bits.join(', ');
  }
  function signalList(sig) {
    var li = [];
    sig.screens.forEach(function (s) {
      var t = resultText(s.result);
      li.push(h('li', null, h('span', { class: 'ab-src' }, 'Screen'), h('span', null, s.abbr + ' positive' + (t ? ' (' + t + ')' : ''))));
    });
    sig.history.forEach(function (x) {
      li.push(h('li', null, h('span', { class: 'ab-src' }, 'History'), h('span', null, x.t + (x.sec ? ' (' + x.sec + ')' : ''))));
    });
    sig.symptoms.forEach(function (x) {
      li.push(h('li', null, h('span', { class: 'ab-src' }, 'Interview'), h('span', null, 'Flagged at ' + symCode(x.s) + ' ' + (x.s.title || '') + (x.clue ? ': ' + x.clue : ''))));
    });
    return h('ul', { class: 'ab-siglist' }, li);
  }

  /* Weight tag for a feature: dots for sighted users, words for everyone. */
  function weightTag(w) {
    return h('span', { class: 'ab-w', title: 'Weight ' + w + ' of 3' },
      h('span', { class: 'ab-w-dots', 'aria-hidden': 'true' }, '●●●'.slice(0, w) + '○○○'.slice(0, 3 - w)),
      h('span', { class: 'sr-only' }, ' (weight ' + w + ' of 3)'));
  }

  /* ===================================================================================
     Step: differential diagnosis (criterion E)
     =================================================================================== */

  var JUDGE = [
    ['Trait or episode', 'ADHD symptoms are long-standing traits, present most of the time. Problems that start, worsen or only appear during episodes (low mood, hypomania, anxiety, substance use, poor sleep) point to another cause.'],
    ['Onset', 'ADHD symptoms are present before age 12. A clear later start, after a settled childhood, makes another explanation more likely.'],
    ['Pervasiveness', 'ADHD shows across settings and relationships. Problems limited to one setting, or to particular situations, suggest something else.'],
    ['Timeline', 'Draw a life chart. Which came first? Do the attention problems persist when the other condition is treated or in remission?']
  ];

  AA.steps.ddx = { render: function (el, ctx) {
    var conds = arr(AA.data.ddx).filter(function (c) { return c && c.id; });
    var a0 = ctx.a() || {};
    var reviewed0 = conds.filter(function (c) { var e = (a0.ddx || {})[c.id]; return e && e.verdict; }).length;
    var rows = {};

    /* Criterion E summary and the decision rule. */
    var eLive = h('div', { class: 'ab-crit', 'aria-live': 'polite' });
    var eLists = h('div', { class: 'ab-elists' });
    el.appendChild(h('section', { class: 'card ab-card' },
      h('h2', null, 'Criterion E: is there a better explanation?'),
      eLive, eLists,
      h('h3', { class: 'ab-subh' }, 'For each condition, decide'),
      h('dl', { class: 'ab-vdefs' }, VERDICTS.map(function (x) { return h('div', { class: 'ab-vdef' }, h('dt', null, verdictBadge(x.v)), h('dd', null, x.d)); })),
      ui.details('How to judge', h('dl', { class: 'ab-judge' }, JUDGE.map(function (j) { return h('div', null, h('dt', null, j[0]), h('dd', null, j[1])); })),
        { open: !reviewed0, meta: 'Trait or episode, onset, settings, timeline', cls: 'ab-howto' })));

    function paintE() {
      var a = ctx.a() || {};
      var E = D.criterionE(a);
      var rec = a.ddx || {};
      var core = conds.filter(function (c) { return c.core; });
      var coreDone = core.filter(function (c) { return rec[c.id] && rec[c.id].verdict; }).length;
      var all = conds.filter(function (c) { return rec[c.id] && rec[c.id].verdict; }).length;
      fill(eLive, [ui.statusPill(E.status), h('p', { class: 'ab-crit-d' }, E.detail)]);
      var parts = [h('div', { class: 'ab-prog' },
        h('span', { class: 'ab-prog-k' }, 'Core conditions reviewed: ' + coreDone + ' of ' + core.length),
        h('div', { class: 'ab-prog-m' }, ui.progress(coreDone, core.length || 1, 'Core conditions reviewed')),
        h('span', { class: 'muted' }, 'All conditions: ' + all + ' of ' + conds.length))];
      var todo = core.filter(function (c) { return !(rec[c.id] && rec[c.id].verdict); });
      if (todo.length && conds.length) {
        parts.push(h('div', { class: 'ab-todo' }, h('span', { class: 'ab-todo-k' }, 'Still to review:'),
          h('ul', { class: 'ab-chips' }, todo.map(function (c) {
            return h('li', null, h('button', { type: 'button', class: 'ab-chipbtn', onclick: function () { if (rows[c.id]) reveal(rows[c.id].d); } }, condName(c)));
          }))));
      }
      fill(eLists, parts);
    }

    if (!conds.length) {
      paintE();
      el.appendChild(ui.empty('Differential content is not available', 'Review other explanations as usual and record them in the notes of the scoring step.'));
      return null;
    }

    /* Signals gathered from the earlier steps (they do not change on this page). */
    var sigs = {};
    conds.forEach(function (c) { sigs[c.id] = signalsFor(a0, c); });
    var sigHost = h('div');
    el.appendChild(h('section', { class: 'card ab-card' },
      h('h2', null, 'Signals from this assessment'),
      h('p', { class: 'hint' }, 'Positive screens, history items and interview flags that point to a condition. Start with these.'),
      sigHost));
    function paintSignals() {
      var rec = (ctx.a() || {}).ddx || {};
      var hits = conds.filter(function (c) { return sigs[c.id].n; }).sort(function (x, y) { return sigs[y.id].n - sigs[x.id].n; });
      if (!hits.length) {
        fill(sigHost, h('p', { class: 'muted' }, 'No signals yet. Positive screens, history items linked to a condition and symptoms flagged in the interview will collect here. Still review the core conditions below.'));
        return;
      }
      fill(sigHost, [h('ul', { class: 'ab-sigs' }, hits.map(function (c) {
        var e = rec[c.id] || {};
        return h('li', { class: 'ab-sig' },
          h('div', { class: 'ab-sig-head' },
            h('button', { type: 'button', class: 'ab-link', onclick: function () { reveal(rows[c.id].d); }, 'aria-label': 'Review ' + condName(c) }, condName(c)),
            ui.badge(U.plural(sigs[c.id].n, 'signal'), 'warn'), verdictBadge(e.verdict)),
          signalList(sigs[c.id]));
      })), conds.length > hits.length ? h('p', { class: 'hint' }, 'No signals for the other ' + U.plural(conds.length - hits.length, 'condition') + '.') : null]);
    }

    /* Systematic protocol (guides.js), when present: embedded in a disclosure, otherwise linked. */
    if (AA.data.ddxProtocol) el.appendChild(protocolBlock(ctx));

    /* Find a condition */
    var found = h('p', { class: 'hint ab-found', 'aria-live': 'polite' });
    var blocks = [];
    function filter(q) {
      var s = String(q || '').toLowerCase(), shown = 0;
      Object.keys(rows).forEach(function (id) {
        var hit = !s || rows[id].hay.indexOf(s) > -1;
        rows[id].d.hidden = !hit;
        if (hit) shown++;
      });
      blocks.forEach(function (b) {
        var any = false;
        b.groups.forEach(function (g) {
          var vis = g.ids.some(function (id) { return !rows[id].d.hidden; });
          g.el.hidden = !vis;
          if (vis) any = true;
        });
        b.el.hidden = !any;
      });
      found.textContent = s ? (shown ? shown + ' of ' + conds.length + ' conditions match.' : 'No condition matches "' + q + '".') : '';
    }
    el.appendChild(h('div', { class: 'ab-findbar' }, ui.search('Find a condition, for example sleep or bipolar', filter), found));

    /* One condition: summary row plus a body built on first open. */
    function makeRow(c) {
      var meta = h('span', { class: 'ab-meta' });
      var r = { cond: c, meta: meta, refs: {}, sig: sigs[c.id] };
      r.hay = [c.name, c.id, groupLabel(groupKey(c)), c.icd11, c.summary].join(' ').toLowerCase();
      r.d = lazyDetails(h('span', { class: 'ab-ctitle' }, h('strong', null, condName(c)), c.core ? ui.badge('Core', 'accent') : null),
        function (body) { buildCond(ctx, c, body, r); paintRow(r); }, { meta: meta, cls: 'ab-cond' });
      r.d.id = 'ab-c-' + c.id;
      rows[c.id] = r;
      paintRow(r);
      return r;
    }
    function paintRow(r) {
      var e = ctx.get('ddx.' + r.cond.id, {}) || {};
      var sc = D.ddxScore(r.cond, e);
      var b = bandOf(sc.band);
      U.clear(r.meta);
      if (r.sig.n) r.meta.appendChild(ui.badge(U.plural(r.sig.n, 'signal'), 'warn'));
      if (sc.checked) r.meta.appendChild(ui.badge('Features: ' + b.l.toLowerCase() + ' ' + sc.score + '/' + sc.max, b.kind));
      r.meta.appendChild(verdictBadge(e.verdict));
      if (r.refs.score) paintScore(r.refs.score, r.cond, sc);
      if (r.refs.vhint) r.refs.vhint.textContent = verdictOf(e.verdict) ? verdictOf(e.verdict).d : 'Not decided yet.';
    }
    function groupBlock(title, hint, list) {
      if (!list.length) return;
      var sec = h('section', { class: 'ab-sec' }, h('h2', null, title), hint ? h('p', { class: 'hint' }, hint) : null);
      var groups = [];
      groupOrder(list).forEach(function (g) {
        var members = list.filter(function (c) { return groupKey(c) === g; });
        var box = h('div', { class: 'ab-group' }, h('h3', { class: 'ab-gh' }, groupLabel(g)));
        members.forEach(function (c) { box.appendChild(makeRow(c).d); });
        groups.push({ el: box, ids: members.map(function (c) { return c.id; }) });
        sec.appendChild(box);
      });
      blocks.push({ el: sec, groups: groups });
      el.appendChild(sec);
    }
    groupBlock('Core conditions', 'Review these in every adult assessment. Each one can mimic ADHD or commonly co-occurs with it.', conds.filter(function (c) { return c.core; }));
    groupBlock('Consider when relevant', 'Open these when the history, screens or interview point to them.', conds.filter(function (c) { return !c.core; }));

    paintE();
    paintSignals();
    ctx.onChange('ddx', U.debounce(function () {
      if (!el.isConnected) return;
      paintE(); paintSignals();
      Object.keys(rows).forEach(function (k) { paintRow(rows[k]); });
    }, 60));
    return null;
  } };

  /* Systematic differential protocol (guides.js): AA.components.ddxProtocol({checked, onCheck, compact, actions}).
     Ticks are stored on the record as ddxProtocol.<checkId>. Without the component, link to the guide page. */
  function protocolCounts(a) {
    var P = AA.data.ddxProtocol || {}, rec = (a && a.ddxProtocol) || {}, of = 0, done = 0;
    arr(P.steps).forEach(function (st) {
      arr(st && st.checks).forEach(function (c) { if (c && c.id) { of++; if (rec[c.id]) done++; } });
    });
    return { of: of, done: done };
  }
  function protocolBlock(ctx) {
    var guideBtn = ui.btn({ label: 'Protocol guide page', kind: 'quiet', small: true, go: 'ddxguide' });
    var sec = h('section', { class: 'ab-sec ab-protocol' }, h('h2', null, 'Step-by-step differential protocol'),
      h('p', { class: 'hint' }, 'A systematic method so no condition is missed. Ticks are saved with this assessment.'));
    if (typeof AA.components.ddxProtocol !== 'function') { sec.appendChild(h('div', { class: 'row' }, guideBtn)); return sec; }
    var pc = protocolCounts(ctx.a());
    var det = lazyDetails('Work through the protocol', function (body) {
      var node = null;
      try {
        node = AA.components.ddxProtocol({
          checked: ctx.get('ddxProtocol', {}) || {}, compact: true, actions: [guideBtn],
          onCheck: function (id, on) { ctx.set('ddxProtocol.' + id, on ? true : undefined); }
        });
      } catch (e) { if (window.console) console.error(e); node = null; }
      U.append(body, node instanceof Node ? node : h('div', { class: 'row' }, guideBtn));
    }, { meta: pc.of ? pc.done + ' of ' + pc.of + ' checks ticked' : null, cls: 'ab-protodet' });
    sec.appendChild(det);
    ctx.onChange('ddxProtocol', U.debounce(function () {
      var m = det.querySelector('.disclosure-meta'), c = protocolCounts(ctx.a());
      if (m && c.of) m.textContent = c.done + ' of ' + c.of + ' checks ticked';
    }, 80));
    return sec;
  }

  function paintScore(host, cond, sc) {
    var b = bandOf(sc.band);
    fill(host, [
      h('div', { class: 'ab-scorehead' },
        h('span', { class: 'ab-scorenum' }, sc.score + ' / ' + sc.max),
        ui.badge(b.l, b.kind),
        h('span', { class: 'muted' }, U.plural(sc.checked, 'feature') + ' ticked')),
      ui.progress(sc.score, sc.max || 1, 'Feature score for ' + condName(cond)),
      h('p', { class: 'hint' }, b.d + ' This is an app heuristic to organise your thinking, not a validated scale.')]);
  }

  /* Body of one condition: what it is, how it differs, questions, features, screens, guidance, verdict. */
  function buildCond(ctx, c, body, r) {
    var name = condName(c);
    var entry = ctx.get('ddx.' + c.id, {}) || {};
    var a = ctx.a() || {};
    var coexist = { yes: 'Yes, it often co-occurs.', no: 'Usually not diagnosed together.', sometimes: 'Sometimes.' }[c.coexist];

    body.appendChild(h('div', { class: 'ab-ov' },
      c.summary ? h('p', null, c.summary) : null,
      c.prevalence ? h('p', { class: 'hint' }, h('strong', null, 'How common: '), c.prevalence) : null,
      coexist || c.coexistNote ? h('p', { class: 'hint' }, h('strong', null, 'Co-occurs with ADHD? '), [coexist, c.coexistNote].filter(Boolean).join(' ')) : null,
      c.icd11 ? h('p', { class: 'hint' }, h('strong', null, 'ICD-11: '), c.icd11) : null));

    /* The verdict sits at the end of a long body; a jump link keeps it one tap away. */
    var verdictBox = null;
    body.appendChild(h('div', { class: 'ab-jump' }, h('button', { type: 'button', class: 'btn btn-quiet btn-sm', onclick: function () {
      if (!verdictBox) return;
      try { verdictBox.scrollIntoView({ block: 'center' }); } catch (e) { verdictBox.scrollIntoView(); }
      var first = verdictBox.querySelector('input'); if (first) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
    } }, 'Go to your verdict ↓')));
    if (r.sig.n) body.appendChild(ui.callout('warn', signalList(r.sig), 'Signals in this assessment'));
    if (arr(c.overlap).length) body.appendChild(h('div', null, h('h4', { class: 'ab-h4' }, 'Where it overlaps with ADHD'), ui.list(c.overlap)));
    if (arr(c.favoursADHD).length || arr(c.favoursAlt).length) {
      body.appendChild(h('div', { class: 'ab-cols' },
        h('div', { class: 'ab-col ab-col-adhd' }, h('h4', { class: 'ab-h4' }, 'Points towards ADHD'), arr(c.favoursADHD).length ? ui.list(c.favoursADHD) : h('p', { class: 'muted' }, 'Not listed.')),
        h('div', { class: 'ab-col ab-col-alt' }, h('h4', { class: 'ab-h4' }, 'Points towards ' + name), arr(c.favoursAlt).length ? ui.list(c.favoursAlt) : h('p', { class: 'muted' }, 'Not listed.'))));
    }

    var asks = arr(c.ask);
    if (asks.length) {
      body.appendChild(h('div', { class: 'ab-subhead' }, h('h4', { class: 'ab-h4' }, 'Questions that tell them apart'),
        ui.btn({ label: 'Copy all questions', kind: 'ghost', small: true, onClick: function () { copy(asks.join('\n'), 'Questions'); } })));
      body.appendChild(h('ol', { class: 'list ab-asks' }, asks.map(function (q) { return h('li', null, q); })));
    }

    var feats = arr(c.features).filter(function (f) { return f && f.id; });
    if (feats.length) {
      var score = h('div', { class: 'ab-score', 'aria-live': 'polite' });
      r.refs.score = score;
      var f0 = entry.f || {};
      body.appendChild(h('div', { class: 'ab-featbox' },
        h('h4', { class: 'ab-h4' }, 'Features in this patient'),
        h('p', { class: 'hint' }, 'Tick what you found. More dots means the feature points more strongly to ' + name + '.'),
        h('div', { class: 'ab-feats' }, feats.map(function (f) {
          var w = U.clamp(parseInt(f.w, 10) || 1, 1, 3);
          return ui.check({ label: [h('span', null, f.t || f.id), ' ', weightTag(w)], checked: !!f0[f.id], cls: 'ab-feat',
            onChange: function (on) { ctx.set('ddx.' + c.id + '.f.' + f.id, on ? true : undefined); } });
        })),
        score));
    }

    var screens = arr(c.screen);
    if (screens.length) {
      var T = D.STEP_TOOLS || {};
      body.appendChild(h('div', null, h('h4', { class: 'ab-h4' }, 'Screening results'),
        h('ul', { class: 'ab-screens' }, screens.map(function (id) {
          var t = AA.byId('tools', id);
          var res = scoreOf(a, id);
          var where = arr(T.screen).indexOf(id) > -1 ? 'screen' : arr(T.comorbid).indexOf(id) > -1 ? 'comorbid' : null;
          var status = !t ? h('span', { class: 'muted' }, 'Not in the tools library')
            : !(t.items && t.items.length) ? ui.badge('Official form', 'neutral')
            : !res ? ui.badge('Not done', 'neutral')
            : isPositive(res) ? ui.badge('Positive', 'warn') : res.complete ? ui.badge('Negative', 'ok') : ui.badge('Incomplete', 'neutral');
          var text = res ? resultText(res) : '';
          return h('li', null,
            h('span', { class: 'ab-scr-name' }, toolAbbr(id)),
            status,
            text ? h('span', { class: 'muted' }, text) : null,
            !res && where ? ui.btn({ label: 'Go to ' + (where === 'screen' ? 'screening' : 'co-occurring screen'), kind: 'quiet', small: true, onClick: function () { ctx.go(where); } })
              : t ? ui.btn({ label: 'Tool guide', kind: 'quiet', small: true, go: 'tool-' + id }) : null);
        }))));
    }

    var inv = arr(c.investigations), pearls = arr(c.pearls);
    if (inv.length || pearls.length) {
      body.appendChild(h('div', { class: 'ab-cols' },
        inv.length ? h('div', null, h('h4', { class: 'ab-h4' }, 'Investigations to consider'), ui.list(inv)) : null,
        pearls.length ? h('div', null, h('h4', { class: 'ab-h4' }, 'Clinical pearls'), ui.list(pearls)) : null));
    }
    if (arr(c.redFlags).length) body.appendChild(ui.callout('warn', ui.list(c.redFlags), 'Red flags'));

    var dc = c.decide || {};
    if (dc.better || dc.both || dc.next) {
      body.appendChild(h('div', { class: 'ab-decide' },
        dc.better ? h('div', { class: 'ab-dec' }, h('h4', { class: 'ab-h4' }, 'Better explains the symptoms when'), h('p', null, dc.better)) : null,
        dc.both ? h('div', { class: 'ab-dec' }, h('h4', { class: 'ab-h4' }, 'Diagnose both when'), h('p', null, dc.both)) : null,
        dc.next ? h('div', { class: 'ab-dec' }, h('h4', { class: 'ab-h4' }, 'What to do next'), h('p', null, dc.next)) : null));
    }

    var vhint = h('p', { class: 'hint', 'aria-live': 'polite' });
    r.refs.vhint = vhint;
    body.appendChild(verdictBox = h('div', { class: 'ab-verdict' },
      h('h4', { class: 'ab-h4' }, 'Your verdict on ' + name),
      ui.seg({ label: 'Verdict on ' + name, hideLabel: true, value: entry.verdict || null,
        options: VERDICTS.map(function (x) { return { v: x.v, l: x.l, kind: x.kind, title: x.d }; }),
        onChange: function (v) { ctx.set('ddx.' + c.id + '.verdict', nil(v)); } }),
      vhint,
      ui.field('Notes on ' + name, ui.input({ rows: 2, value: entry.notes || '', placeholder: 'What you asked, what you found and why you decided this.',
        onSave: function (v) { ctx.set('ddx.' + c.id + '.notes', textOrNone(v)); } })),
      h('div', { class: 'row' }, ui.btn({ label: 'Full reference page', kind: 'quiet', small: true, go: 'cond-' + c.id }))));
  }

  /* ===================================================================================
     Consistency checks computed from the record (used by the validity step and the report)
     =================================================================================== */

  function chk(id, label, status, text) { return { id: id, label: label, status: status, text: text }; }

  function consistencyChecks(a) {
    a = a || {};
    var out = [];
    var need = D.need(a);
    var ad = D.counts(a, 'adult');
    var ofAd = ad.ofIA + ad.ofHI, answeredAd = ad.answeredIA + ad.answeredHI;
    var reached = ad.IA >= need || ad.HI >= need;
    var canReach = ad.IA + (ad.ofIA - ad.answeredIA) >= need || ad.HI + (ad.ofHI - ad.answeredHI) >= need;
    var interviewA = reached ? true : (ofAd && !canReach ? false : null);
    var adText = 'interview ' + ad.IA + ' inattention and ' + ad.HI + ' hyperactive-impulsive, ' + need + ' needed';

    /* 1. ASRS Part A against the adult interview */
    var asrs = scoreOf(a, 'asrs18');
    var aName = toolAbbr('asrs18') + ' Part A and the adult interview';
    if (!asrs || asrs.positive === null || asrs.positive === undefined) out.push(chk('asrs', aName, 'na', 'Part A is not complete.'));
    else if (interviewA === null) out.push(chk('asrs', aName, 'na', 'The adult interview is not finished.'));
    else {
      var pa = asrs.partA ? 'Part A ' + asrs.partA.shaded + ' of ' + asrs.partA.of + ' shaded' : 'screen ' + (asrs.positive ? 'positive' : 'negative');
      if (asrs.positive === interviewA) out.push(chk('asrs', aName, 'ok', 'Agree: ' + pa + '; ' + adText + '.'));
      else if (asrs.positive) out.push(chk('asrs', aName, 'warn', 'Screen positive but the interview is below threshold (' + pa + '; ' + adText + '). Consider over-reporting on the form, distress raising scores, or another condition. Ask what lay behind the high ratings.'));
      else out.push(chk('asrs', aName, 'warn', 'Screen negative but the interview meets the symptom count (' + pa + '; ' + adText + '). Consider low insight or masking on the form, or leading questions in the interview. Check the examples behind each "yes".'));
    }

    /* 2. WURS-25 against childhood criterion B */
    var wurs = scoreOf(a, 'wurs25');
    var B = D.criterionB(a);
    var wName = toolAbbr('wurs25') + ' and childhood criterion B';
    if (!wurs || !wurs.complete) out.push(chk('wurs', wName, 'na', 'The WURS-25 is not complete.'));
    else if (B.status === 'pending' || B.status === 'partial') out.push(chk('wurs', wName, 'na', 'Childhood criterion B is not decided yet.'));
    else {
      var wpos = wurs.total >= 46, bpos = B.status === 'met';
      var wt = 'WURS-25 total ' + wurs.total + ' (cut-off 46)';
      if (wpos === bpos) out.push(chk('wurs', wName, 'ok', 'Agree: ' + wt + '; criterion B ' + (bpos ? 'met' : 'not met') + '.'));
      else if (wpos) out.push(chk('wurs', wName, 'warn', wt + ' is high, but the childhood interview does not support criterion B. High WURS scores also occur with depression, anxiety, trauma and personality difficulties. Check with informants and school reports.'));
      else out.push(chk('wurs', wName, 'warn', wt + ' is below the cut-off, but the childhood interview supports criterion B. Recall of childhood may be poor. Lean on informants and school reports.'));
    }

    /* 3. Symptoms scored present where the informant gave no support */
    var clash = [], rated = 0;
    syms().forEach(function (s) {
      var r = (a.symptoms || {})[s.id] || {};
      if (typeof r.infA === 'number') rated++;
      if (typeof r.infC === 'number') rated++;
      if (r.adult === 'yes' && r.infA === 0) clash.push(symCode(s) + ' ' + (s.title || '') + ' (adulthood)');
      if (r.child === 'yes' && r.infC === 0) clash.push(symCode(s) + ' ' + (s.title || '') + ' (childhood)');
    });
    var iName = 'Patient and informant, symptom by symptom';
    if (!rated) out.push(chk('inf', iName, 'na', 'No informant ratings recorded for individual symptoms.'));
    else if (clash.length) out.push(chk('inf', iName, 'warn', U.plural(clash.length, 'symptom') + ' scored present where the informant gave no support: ' + clash.join('; ') + '. The informant may not have seen it, or the patient may be over-reporting. Explore the difference.'));
    else out.push(chk('inf', iName, 'ok', 'No symptom scored present against an informant rating of none (' + U.plural(rated, 'rating') + ').'));

    /* 4. Adult symptoms scored unsure */
    var unsure = ad.unsureIA + ad.unsureHI;
    var uName = 'Adult symptoms scored "unsure"';
    if (!answeredAd) out.push(chk('unsure', uName, 'na', 'The adult interview has not started.'));
    else if (unsure >= 3) out.push(chk('unsure', uName, 'warn', unsure + ' adult symptoms are "unsure". Ask for more examples or collateral before you decide.'));
    else out.push(chk('unsure', uName, 'ok', unsure ? unsure + ' adult symptom' + (unsure === 1 ? ' is' : 's are') + ' "unsure".' : 'No adult symptoms are "unsure".'));

    /* 5. Every adult symptom endorsed */
    var allName = 'Pattern of adult symptoms';
    if (!answeredAd) out.push(chk('all18', allName, 'na', 'The adult interview has not started.'));
    else if (ofAd && ad.IA + ad.HI === ofAd) out.push(chk('all18', allName, 'warn', 'All ' + ofAd + ' adult symptoms are scored present. This is unusual, even in ADHD. Check that each has concrete, specific examples.'));
    else out.push(chk('all18', allName, 'ok', (ad.IA + ad.HI) + ' of ' + ofAd + ' adult symptoms scored present.'));

    /* 6. Self-rated impairment (WFIRS-S) against the interview */
    var wf = scoreOf(a, 'wfirs');
    var Dd = D.criterionD(a);
    var fName = toolAbbr('wfirs') + ' and interview impairment';
    if (!wf || wf.positive === null || wf.positive === undefined) out.push(chk('wfirs', fName, 'na', 'The impairment scale is not completed.'));
    else if (Dd.status === 'pending') out.push(chk('wfirs', fName, 'na', 'Impairment is not yet rated in the interview.'));
    else {
      var intImp = Dd.status === 'met';
      var wfText = wf.band ? wf.band : (wf.positive ? 'impairment' : 'no impairment');
      if (wf.positive === intImp) out.push(chk('wfirs', fName, 'ok', 'Agree: scale shows ' + wfText + '; interview ' + (intImp ? 'moderate or severe' : 'no more than mild') + ' impairment.'));
      else if (wf.positive) out.push(chk('wfirs', fName, 'warn', 'The scale shows ' + wfText + ', but the interview found no more than mild impairment. Ask for concrete consequences: warnings at work, debts, lost jobs, relationship breakdowns.'));
      else out.push(chk('wfirs', fName, 'warn', 'The interview found moderate or severe impairment, but the scale does not (' + wfText + '). Self-report can understate problems when insight is low or others compensate.'));
    }

    /* 7. Collateral against self-report */
    var col = D.collateral(a);
    var cName = 'Collateral information and self-report';
    var lv = { clear: 'clear', some: 'some', none: 'little or no' }[col.level];
    if (col.level === 'unavailable') out.push(chk('col', cName, 'na', 'No collateral rating yet.'));
    else if (col.level === 'none' && interviewA) out.push(chk('col', cName, 'warn', 'Informants and records give little or no support for symptoms the patient reports. Seek further sources and weigh self-report with care.'));
    else out.push(chk('col', cName, 'ok', 'Collateral gives ' + lv + ' support' + (interviewA === false ? ', and the interview is below threshold.' : '.')));
    return out;
  }
  AA.components.consistencyChecks = consistencyChecks;

  var CHK_BADGE = { ok: ['Consistent', 'ok'], warn: ['Check', 'warn'], na: ['Not available', 'neutral'] };

  /* ===================================================================================
     Step: symptom validity and consistency
     =================================================================================== */

  var CONCERN = [
    { v: 'none', l: 'None', kind: 'yes', d: 'The account is consistent across sources and backed by concrete examples. Self-report can carry its usual weight.' },
    { v: 'some', l: 'Some', kind: 'unsure', d: 'Some inconsistency, vague examples or an external incentive. Give more weight to collateral and records, and say so in the report.' },
    { v: 'major', l: 'Major', kind: 'major', d: 'Marked inconsistency, implausible or exaggerated reporting, or failed validity tests. Do not diagnose on self-report alone. Seek objective evidence.' }
  ];

  AA.steps.validity = { render: function (el, ctx) {
    var V = AA.data.validity && typeof AA.data.validity === 'object' ? AA.data.validity : null;
    var checks0 = ctx.get('validity.checks', {}) || {};

    if (V) {
      el.appendChild(ui.callout('info', h('div', null,
        h('p', null, 'No single sign proves exaggeration or under-reporting. Record what you checked and how much weight the history can bear.'),
        V.intro ? ui.details('Background', h('p', null, V.intro), { cls: 'ab-bg' }) : null), 'Why this matters'));
    } else {
      el.appendChild(ui.callout('info', h('div', null,
        h('p', null, 'Self-report can overstate or understate symptoms. Some people exaggerate, for example to get stimulant medicine or exam support. Others under-report because of low insight or masking.'),
        h('p', null, 'Weigh the account against collateral information, school reports, records and how the patient presents in the room. Embedded validity scales and stand-alone validity tests exist; use them when concern is high and you are trained to read them.'),
        h('p', null, 'No single sign proves exaggeration. Record what you checked and how much weight the history can bear.')), 'Why this matters'));
    }

    /* Automatic checks from the record */
    var list = consistencyChecks(ctx.a());
    var nWarn = list.filter(function (x) { return x.status === 'warn'; }).length;
    var nNa = list.filter(function (x) { return x.status === 'na'; }).length;
    el.appendChild(h('section', { class: 'card ab-card' },
      h('h2', null, 'Consistency checks from this assessment'),
      h('p', { class: 'ab-live' }, nWarn ? U.plural(nWarn, 'check') + ' to look at.' : 'Nothing inconsistent found so far.',
        nNa ? h('span', { class: 'muted' }, ' ' + nNa + ' not available yet.') : null),
      h('ul', { class: 'ab-checks' }, list.map(function (x) {
        var b = CHK_BADGE[x.status];
        return h('li', { class: 'ab-chk ab-chk-' + x.status }, h('div', { class: 'ab-chk-b' }, ui.badge(b[0], b[1])),
          h('div', null, h('p', { class: 'ab-chk-l' }, x.label), h('p', { class: 'ab-chk-t' }, x.text)));
      })),
      h('p', { class: 'hint' }, 'Worked out from the screening scales, interview, informant ratings and impairment. They update when you change those steps.')));

    /* Indicators and incentives */
    var indLive = h('p', { class: 'ab-live', 'aria-live': 'polite' });
    var indMeter = h('div', { class: 'ab-meter' });
    function paintInd() {
      var c = ctx.get('validity.checks', {}) || {};
      var inds = V ? arr(V.indicators) : [];
      var max = 0, score = 0, n = 0;
      inds.forEach(function (x) { var w = U.clamp(parseInt(x.w, 10) || 1, 1, 3); max += w; if (c[x.id]) { score += w; n++; } });
      var inc = V ? arr(V.incentives).filter(function (x) { return c[x.id]; }).length : 0;
      indLive.textContent = 'Indicators ticked: ' + n + ' (weighted ' + score + ' of ' + max + '). External incentives: ' + inc + '.';
      fill(indMeter, ui.progress(score, max || 1, 'Weighted validity indicators'));
    }
    function checkRow(x, weighted) {
      var w = U.clamp(parseInt(x.w, 10) || 1, 1, 3);
      return ui.check({ label: weighted ? [h('span', null, x.t || x.id), ' ', weightTag(w)] : (x.t || x.id), hint: x.why || null, checked: !!checks0[x.id], cls: 'ab-vcheck',
        onChange: function (on) { ctx.set('validity.checks.' + x.id, on ? true : undefined); } });
    }
    if (V && (arr(V.indicators).length || arr(V.incentives).length)) {
      el.appendChild(h('section', { class: 'card ab-card' },
        h('h2', null, 'What did you notice?'),
        h('div', { class: 'ab-indhead' }, indLive, indMeter),
        arr(V.indicators).length ? [h('h3', { class: 'ab-subh' }, 'Indicators of possible over-reporting'),
          h('p', { class: 'hint' }, 'More dots means a stronger indicator. The total is a prompt for judgement, not a cut-off.'),
          h('div', { class: 'ab-vlist' }, arr(V.indicators).filter(function (x) { return x && x.id; }).map(function (x) { return checkRow(x, true); }))] : null,
        arr(V.incentives).length ? [h('h3', { class: 'ab-subh' }, 'External incentives'),
          h('p', { class: 'hint' }, 'An incentive does not mean the account is false. It means the account needs support from other sources.'),
          h('div', { class: 'ab-vlist' }, arr(V.incentives).filter(function (x) { return x && x.id; }).map(function (x) { return checkRow(x, false); }))] : null));
      paintInd();
    }
    if (V && arr(V.consistency).length) {
      el.appendChild(h('section', { class: 'card ab-card' }, h('h2', null, 'Things to cross-check'), ui.list(V.consistency)));
    }

    /* Overall concern and notes */
    var defs = {};
    var notesIn = ui.input({ rows: 3, value: ctx.get('validity.notes', ''), placeholder: 'What you checked, what was inconsistent, and how much weight you give the self-report.',
      onSave: function (v) { ctx.set('validity.notes', textOrNone(v)); } });
    var concernSeg = ui.seg({ label: 'Overall concern about symptom validity', hideLabel: true, value: ctx.get('validity.concern', null),
      options: CONCERN.map(function (x) { return { v: x.v, l: x.l, kind: x.kind, title: x.d }; }),
      onChange: function (v) { ctx.set('validity.concern', nil(v)); } });
    el.appendChild(h('section', { class: 'card ab-card ab-concern' },
      h('h2', null, 'Overall concern about validity'),
      h('p', { class: 'hint' }, 'This feeds into the evidence strength on the scoring step and the report.'),
      concernSeg,
      h('dl', { class: 'ab-cdefs' }, CONCERN.map(function (x) {
        defs[x.v] = h('div', { class: 'ab-cdef' }, h('dt', null, x.l), h('dd', null, x.d));
        return defs[x.v];
      })),
      ui.field('Notes on validity', notesIn)));
    function paintConcern() {
      var cur = ctx.get('validity.concern', null);
      CONCERN.forEach(function (x) {
        defs[x.v].classList.toggle('ab-on', cur === x.v);
        if (cur === x.v) defs[x.v].setAttribute('aria-current', 'true'); else defs[x.v].removeAttribute('aria-current');
      });
    }
    paintConcern();

    /* Reference material */
    if (V && arr(V.tests).length) {
      el.appendChild(ui.details('Symptom validity measures', h('div', null,
        h('p', { class: 'hint' }, 'Embedded scales inside rating instruments and stand-alone performance tests. Use them only if you are trained to give and interpret them.'),
        ui.table(['Measure', 'What it does', 'Note'], arr(V.tests).map(function (t) { return [t.name || '', t.what || '', t.note || '']; }), 'table-compact')),
        { meta: String(arr(V.tests).length), cls: 'ab-ref' }));
    }
    if (V && arr(V.wording).length) {
      el.appendChild(ui.details('Example wording for the report', h('ul', { class: 'ab-wording' }, arr(V.wording).map(function (w) {
        return h('li', null, h('p', null, w), ui.btn({ label: 'Add to notes', kind: 'quiet', small: true, aria: 'Add this sentence to the validity notes', onClick: function () {
          var cur = String(ctx.get('validity.notes', '') || '');
          var next = cur.trim() ? cur.replace(/\s+$/, '') + '\n' + w : w;
          notesIn.value = next;
          ctx.set('validity.notes', next);
          U.toast('Added to the notes', 'ok');
        } }));
      })), { meta: String(arr(V.wording).length), cls: 'ab-ref' }));
    }
    if (V && arr(V.refs).length) el.appendChild(ui.source(arr(V.refs).join('; ')));

    ctx.onChange('validity', U.debounce(function () { if (!el.isConnected) return; paintInd(); paintConcern(); }, 60));
    return null;
  } };

  /* ===================================================================================
     Step: scoring and diagnosis
     =================================================================================== */

  var OUT_KIND = { met: 'ok', 'not-met': 'neutral', subthreshold: 'warn', 'better-explained': 'info', incomplete: 'neutral' };
  var CRIT = [
    { k: 'A', name: 'Symptoms', step: 'ia' },
    { k: 'B', name: 'Onset before 12', step: 'onset' },
    { k: 'C', name: 'Two or more settings', step: 'onset' },
    { k: 'D', name: 'Impairment', step: 'onset' },
    { k: 'E', name: 'Not better explained', step: 'ddx' }
  ];
  function critNeed(k, need) {
    return {
      A: need + ' or more symptoms in either domain, present for at least 6 months' + (need === 6 ? ' (6 under age 17)' : ''),
      B: 'Several symptoms present before age 12',
      C: 'Several symptoms in two or more settings',
      D: 'Clear interference with functioning (NICE: at least moderate)',
      E: 'Not better explained by another condition'
    }[k];
  }
  var DECISIONS = [
    { v: 'met', l: 'Criteria met', kind: 'yes', d: 'In your judgement the DSM-5-TR criteria A to E are met. ADHD is diagnosed.' },
    { v: 'other-specified', l: 'Other specified', kind: 'unsure', d: 'Impairing ADHD symptoms that do not meet full criteria. Record the reason, for example "with insufficient inattention symptoms".' },
    { v: 'not-met', l: 'Not met', kind: 'no', d: 'The criteria are not met, or the symptoms are better explained by another condition.' },
    { v: 'deferred', l: 'Deferred', kind: null, d: 'You need more information first, for example an informant, school reports, or treatment of another condition.' }
  ];
  var SEVERITY = [
    { v: 'mild', l: 'Mild', d: 'Few, if any, symptoms beyond those needed, and no more than minor impairment.' },
    { v: 'moderate', l: 'Moderate', d: 'Between mild and severe.' },
    { v: 'severe', l: 'Severe', d: 'Many symptoms beyond those needed, several particularly severe symptoms, or marked impairment.' }
  ];
  var CONF = { high: ['High', 'ok'], moderate: ['Moderate', 'info'], low: ['Low', 'warn'] };
  var SIGN = { '+': ['+', 'Strengthens', 'plus'], '-': ['−', 'Weakens', 'minus'], '!': ['!', 'Check', 'check'] };

  function comorbidSuggestion(a) {
    var rec = (a && a.ddx) || {};
    return arr(AA.data.ddx).filter(function (c) { return c && rec[c.id] && rec[c.id].verdict === 'comorbid'; }).map(condName).join('; ');
  }
  function chosenPresentation(a) {
    var f = (a && a.formulation) || {};
    return f.presentation !== undefined ? f.presentation : D.presentation(a);
  }

  /* Where the clinician's decision and the recorded findings disagree. */
  function conflicts(a) {
    var f = (a && a.formulation) || {};
    var cr = D.criteria(a), o = D.outcome(a), out = [];
    var names = { A: 'symptoms', B: 'onset before 12', C: 'two or more settings', D: 'impairment', E: 'not better explained' };
    if (f.decision === 'met') {
      ['A', 'B', 'C', 'D', 'E'].forEach(function (k) {
        var s = cr[k].status;
        if (s === 'not-met') out.push('Criterion ' + k + ' (' + names[k] + ') is not met. ' + cr[k].detail);
        else if (s === 'pending') out.push('Criterion ' + k + ' (' + names[k] + ') is not complete yet. ' + cr[k].detail);
        else if (s === 'partial') out.push('Criterion ' + k + ' (' + names[k] + '): ' + cr[k].detail);
      });
      if (f.remission && cr.A.status === 'met') out.push('"In partial remission" is ticked, but the full symptom count is met for the past 6 months.');
    } else if (f.decision === 'other-specified') {
      if (o.code === 'met') out.push('All criteria A to E are recorded as met. "Other specified" is for impairing symptoms that do not meet full criteria.');
      if (cr.E.status === 'not-met') out.push('Criterion E is not met. ' + cr.E.detail + ' If another condition better explains the symptoms, ADHD should not be diagnosed.');
    } else if (f.decision === 'not-met') {
      if (o.code === 'met') out.push('All criteria A to E are recorded as met. If you disagree with the recorded findings, explain why in the notes.');
    }
    return out;
  }

  function codeLine(a) {
    var f = (a && a.formulation) || {};
    var P = null;
    if (f.decision === 'met') P = D.PRESENTATIONS[chosenPresentation(a)];
    else if (f.decision === 'other-specified') P = D.PRESENTATIONS.other;
    if (!P) return null;
    return { label: P.label, dsm: P.dsm, icd11: P.icd11 };
  }

  AA.steps.summary = { render: function (el, ctx) {
    var a = ctx.a() || {};
    var o = D.outcome(a);
    var cr = o.criteria || D.criteria(a);
    var need = D.need(a);
    var P = o.presentation ? D.PRESENTATIONS[o.presentation] : null;

    /* Outcome banner */
    var codes = [];
    if (o.dsm) codes.push(['DSM-5-TR / ICD-10-CM', o.dsm]);
    if (o.icd11) codes.push(['ICD-11', o.icd11]);
    el.appendChild(h('section', { class: 'ab-outcome ab-out-' + (OUT_KIND[o.code] || 'neutral'), 'aria-labelledby': 'ab-out-t' },
      h('p', { class: 'eyebrow' }, 'Recorded findings'),
      h('h2', { id: 'ab-out-t' }, o.title),
      P || o.severity ? h('p', { class: 'ab-out-sub' },
        P ? h('span', null, h('strong', null, 'Presentation: '), P.label) : null,
        o.severity ? h('span', null, h('strong', null, 'Suggested severity: '), o.severity) : null) : null,
      codes.length ? h('dl', { class: 'ab-codes' }, codes.map(function (c) { return h('div', null, h('dt', null, c[0]), h('dd', null, c[1])); })) : null,
      o.reasons && o.reasons.length ? ui.list(o.reasons, 'list ab-out-reasons') : null,
      h('p', { class: 'hint' }, 'This summarises what you recorded. It is not a diagnosis on its own: your conclusion is below.')));

    /* Criteria A-E */
    var crTable = h('div', { class: 'table-wrap ab-stack' }, h('table', { class: 'table' },
      h('thead', null, h('tr', null, ['Criterion', 'What is needed', 'Status', 'What you recorded', ''].map(function (x, i) {
        return h('th', { scope: 'col' }, i === 4 ? h('span', { class: 'sr-only' }, 'Go to step') : x);
      }))),
      h('tbody', null, CRIT.map(function (c) {
        var r = cr[c.k] || { status: 'pending', detail: '' };
        return h('tr', null,
          h('th', { scope: 'row' }, h('span', { class: 'ab-ck' }, c.k), ' ', c.name),
          h('td', { 'data-label': 'Needed' }, critNeed(c.k, need)),
          h('td', { 'data-label': 'Status' }, ui.statusPill(r.status)),
          h('td', { 'data-label': 'Recorded' }, r.detail),
          h('td', { 'data-label': '' }, ui.btn({ label: 'Review', kind: 'quiet', small: true, aria: 'Review criterion ' + c.k, onClick: function () { ctx.go(c.step); } })));
      }))));
    el.appendChild(h('section', { class: 'ab-sec' }, h('h2', null, 'DSM-5-TR criteria A to E'), crTable));

    /* Symptom summary (like the DIVA summary of symptoms) */
    el.appendChild(h('section', { class: 'ab-sec' }, h('h2', null, 'Summary of symptoms'), symptomTable(ctx, a),
      h('p', { class: 'hint' }, 'Adulthood: ' + need + ' or more in a domain (DSM-5-TR' + (need === 5 ? ', age 17 and over' : ', under 17') + '). Childhood: DSM-5-TR needs several symptoms before age 12 (this app counts 3 or more); the DIVA convention is 6 or more per domain.')));

    /* Evidence strength */
    var cf = o.confidence || D.confidence(a);
    var lv = CONF[cf.level] || CONF.low;
    el.appendChild(h('section', { class: 'card ab-card' },
      h('h2', null, 'Evidence strength'),
      h('div', { class: 'row' }, ui.badge(lv[0], lv[1]), h('span', { class: 'muted' }, 'Points: ' + cf.points)),
      cf.reasons.length ? h('ul', { class: 'ab-reasons' }, cf.reasons.map(function (r) {
        var s = SIGN[r[0]] || SIGN['!'];
        return h('li', null, h('span', { class: 'ab-sign ab-sign-' + s[2], 'aria-hidden': 'true' }, s[0]), h('span', null, h('span', { class: 'sr-only' }, s[1] + ': '), r[1]));
      })) : h('p', { class: 'muted' }, 'Nothing recorded yet.'),
      h('p', { class: 'hint' }, 'An app heuristic, not a validated scale. It shows how well the sources agree and what would strengthen the evidence: collateral, agreement between scales and interview, resolved differentials, and validity.')));

    /* DIVA 2.0 (DSM-IV) score form view */
    var dv = D.diva2(a);
    function yn(v) { return v === true ? ui.badge('Yes', 'ok') : v === false ? ui.badge('No', 'neutral') : ui.badge('Unknown', 'neutral'); }
    el.appendChild(ui.details('DIVA 2.0 score form view (DSM-IV rules)', h('div', null,
      h('p', null, 'DIVA 2.0 was built on DSM-IV: 6 or more symptoms per domain in childhood and in adulthood, and onset before age 7. DSM-5-TR lowered the adult threshold to 5 and moved onset to before age 12. Use this view only to compare with older reports.'),
      h('p', { class: 'hint' }, 'Research note: Kooij and colleagues (2005) found that 4 or more current symptoms in a domain may be enough to identify impairing ADHD in adults. This is research context, not a diagnostic rule.'),
      ui.table(['Score form item', 'Result'], [
        ['Childhood: 6 or more inattention symptoms', yn(dv.childIA6)],
        ['Childhood: 6 or more hyperactivity-impulsivity symptoms', yn(dv.childHI6)],
        ['Adulthood: 6 or more inattention symptoms', yn(dv.adultIA6)],
        ['Adulthood: 6 or more hyperactivity-impulsivity symptoms', yn(dv.adultHI6)],
        ['Adulthood: 4 or more inattention symptoms (research threshold)', yn(dv.adultIA4)],
        ['Adulthood: 4 or more hyperactivity-impulsivity symptoms (research threshold)', yn(dv.adultHI4)],
        ['Onset before age 7', yn(dv.before7)]
      ], 'table-compact')), { cls: 'ab-ref', meta: 'For comparison' }));

    /* Clinician conclusion */
    var f = ctx.get('formulation', {}) || {};
    var sugP = D.presentation(a), sugS = D.severity(a), sugC = comorbidSuggestion(a);
    var decHint = h('p', { class: 'hint', 'aria-live': 'polite' });
    var warnHost = h('div', { 'aria-live': 'polite' });
    var codeHost = h('div', { class: 'ab-codehost', 'aria-live': 'polite' });

    /* Short option text so the select is not clipped on phones; the codes show in the coding line. */
    var PRES_SHORT = { combined: 'Combined', ia: 'Predominantly inattentive', hi: 'Predominantly hyperactive-impulsive', other: 'Other specified ADHD', unspecified: 'Unspecified ADHD' };
    var presSel = h('select', null, [h('option', { value: '' }, 'Not specified')].concat(Object.keys(D.PRESENTATIONS).map(function (k) {
      return h('option', { value: k }, (PRES_SHORT[k] || D.PRESENTATIONS[k].label) + (k === sugP ? ' (suggested)' : ''));
    })));
    presSel.value = (f.presentation !== undefined ? f.presentation : sugP) || '';
    var presHint = h('p', { class: 'hint' });
    function paintPresHint() {
      var cur = ctx.get('formulation.presentation');
      presHint.textContent = cur === undefined ? (sugP ? 'Suggested from the adult symptom counts. Change it if your judgement differs.' : 'No presentation suggested: the adult symptom count is below threshold.')
        : sugP && cur !== sugP ? 'Your choice differs from the suggestion (' + D.PRESENTATIONS[sugP].label.toLowerCase() + ').' : '';
      presHint.hidden = !presHint.textContent;
    }
    presSel.addEventListener('change', function () { ctx.set('formulation.presentation', presSel.value); });

    var comIn = ui.input({ rows: 2, value: f.comorbid !== undefined ? f.comorbid : sugC, placeholder: 'For example: recurrent depressive disorder, currently in remission.',
      onSave: function (v) { ctx.set('formulation.comorbid', v); } });
    var comHint = h('p', { class: 'hint' });
    function paintComHint() {
      var cur = ctx.get('formulation.comorbid');
      comHint.textContent = cur === undefined && sugC ? 'Prefilled from the differentials marked co-occurring.' : '';
      comHint.hidden = !comHint.textContent;
    }

    el.appendChild(h('section', { class: 'card ab-card ab-form' },
      h('h2', null, 'Your conclusion'),
      h('p', { class: 'hint' }, 'You make the diagnosis. Record your decision even when it differs from the recorded findings, and explain why.'),
      h('div', { class: 'ab-q' },
        h('h3', { class: 'ab-qh', id: 'ab-dec-h' }, 'Decision'),
        ui.seg({ label: 'Decision', hideLabel: true, value: f.decision || null,
          options: DECISIONS.map(function (x) { return { v: x.v, l: x.l, kind: x.kind, title: x.d }; }),
          onChange: function (v) { ctx.set('formulation.decision', nil(v)); } }),
        decHint, warnHost, codeHost),
      h('div', { class: 'form-grid ab-fgrid' },
        h('div', null, ui.field('Presentation', presSel), presHint),
        h('div', { class: 'ab-q' },
          h('h3', { class: 'ab-qh' }, 'Severity'),
          ui.seg({ label: 'Severity', hideLabel: true, value: f.severity || null,
            options: SEVERITY.map(function (x) { return { v: x.v, l: x.l + (x.v === sugS ? ' (suggested)' : ''), title: x.d }; }),
            onChange: function (v) { ctx.set('formulation.severity', nil(v)); } }),
          h('p', { class: 'hint' }, sugS ? 'Suggested: ' + sugS + ', from the symptoms beyond the threshold and the worst impairment.' : 'No severity suggested yet.'),
          ui.details('What the levels mean', h('dl', { class: 'ab-judge' }, SEVERITY.map(function (x) { return h('div', null, h('dt', null, x.l), h('dd', null, x.d)); })), { cls: 'ab-mini' }))),
      ui.check({ label: 'In partial remission', hint: 'Full criteria were met in the past. Fewer than full criteria in the past 6 months, with continuing impairment.',
        checked: !!f.remission, onChange: function (on) { ctx.set('formulation.remission', on ? true : undefined); } }),
      h('div', { class: 'stack ab-fstack' },
        h('div', null, ui.field('Co-occurring conditions', comIn), comHint,
          sugC ? ui.btn({ label: 'Fill from differential verdicts', kind: 'quiet', small: true, onClick: function () { comIn.value = sugC; ctx.set('formulation.comorbid', sugC); } }) : null),
        ui.field('Formulation and reasoning', ui.input({ rows: 4, value: f.notes || '', placeholder: 'How the evidence fits together, what weighed most, and anything still uncertain.',
          onSave: function (v) { ctx.set('formulation.notes', textOrNone(v)); } })))));

    function paintDecision() {
      var cur = ctx.a() || {};
      var ff = cur.formulation || {};
      var d = DECISIONS.filter(function (x) { return x.v === ff.decision; })[0];
      decHint.textContent = d ? d.d : 'Not decided yet.';
      var list = conflicts(cur);
      fill(warnHost, list.length ? ui.callout('warn', h('div', null, ui.list(list),
        h('p', null, 'You can still record this decision. Explain your reasoning in the formulation notes.')), 'Your decision differs from the recorded findings') : null);
      var cl = codeLine(cur);
      fill(codeHost, cl ? h('p', { class: 'ab-codeline' }, h('strong', null, 'Coding: '), cl.label + '. DSM-5-TR / ICD-10-CM ' + cl.dsm + '; ICD-11 ' + cl.icd11 + '.')
        : ff.decision === 'met' ? h('p', { class: 'hint' }, 'Choose a presentation to see the codes.') : null);
      paintPresHint();
      paintComHint();
    }
    paintDecision();
    ctx.onChange('formulation', U.debounce(function () { if (el.isConnected) paintDecision(); }, 60));
    return null;
  } };

  /* 18-symptom summary table with totals per domain. */
  function symptomTable(ctx, a) {
    var list = syms();
    if (!list.length) return ui.empty('Symptom content not loaded', 'The symptom summary is not available in this build.');
    var rec = (a && a.symptoms) || {};
    var need = D.need(a), ad = D.counts(a, 'adult'), ch = D.counts(a, 'child');
    var table = h('table', { class: 'table table-compact ab-symtable' },
      h('thead', null, h('tr', null, ['Symptom', 'Adult', 'Child', 'Informant'].map(function (x) { return h('th', { scope: 'col' }, x); }))));
    [['IA', 'Inattention'], ['HI', 'Hyperactivity-impulsivity']].forEach(function (g) {
      var gl = list.filter(function (s) { return s.dim === g[0]; });
      if (!gl.length) return;
      var tb = h('tbody', null, h('tr', { class: 'ab-grow' }, h('th', { scope: 'colgroup', colspan: '4' }, g[1])));
      gl.forEach(function (s) {
        var r = rec[s.id] || {};
        var inf = [];
        if (has(r.infA)) inf.push('A: ' + INF_LABEL[r.infA]);
        if (has(r.infC)) inf.push('C: ' + INF_LABEL[r.infC]);
        tb.appendChild(h('tr', null,
          h('th', { scope: 'row' }, h('span', { class: 'ab-code' }, symCode(s)), ' ', h('button', { type: 'button', class: 'ab-link', onclick: function () { ctx.go(s.dim === 'HI' ? 'hi' : 'ia', s.id); } }, s.title || s.id)),
          h('td', null, scoreBadge(r.adult)),
          h('td', null, scoreBadge(r.child)),
          h('td', { class: 'ab-inf' }, inf.length ? inf.join(' · ') : h('span', { class: 'ab-none' }, '-'))));
      });
      var nA = ad[g[0]], nC = ch[g[0]], uA = ad['unsure' + g[0]];
      tb.appendChild(h('tr', { class: 'ab-total' },
        h('th', { scope: 'row' }, 'Total ' + g[1].toLowerCase()),
        h('td', null, h('span', { class: 'ab-tnum' }, nA + '/' + gl.length), ' ', nA >= need ? ui.badge(need + '+ met', 'ok') : ui.badge('below ' + need, 'neutral')),
        h('td', null, h('span', { class: 'ab-tnum' }, nC + '/' + gl.length), ' ', nC >= 6 ? ui.badge('6+', 'ok') : null),
        h('td', null, uA ? h('span', { class: 'muted' }, uA + ' unsure') : null)));
      table.appendChild(tb);
    });
    return h('div', { class: 'table-wrap ab-symwrap' }, table);
  }

  /* ===================================================================================
     Report model: one structure rendered as HTML (escaped by h()) and as plain text.
     Blocks: {p: text} | {list: [text]} | {kv: [[label, text]]} | {table: {head: [], rows: [[]]}}
     =================================================================================== */

  function yesNo(v, unsure) { return v === 'yes' ? 'Yes' : v === 'no' ? 'No' : v === 'unsure' && unsure ? 'Unsure' : 'Not recorded'; }
  var STATUS_TEXT = { met: 'met', 'not-met': 'not met', pending: 'not yet decided', partial: 'partly met' };

  function exampleTexts(s, map, period) {
    var groups = arr(s.examples && s.examples[period]);
    return Object.keys(map || {}).filter(function (k) { return map[k]; }).map(function (k) {
      var i = k.lastIndexOf('.');
      var ctxKey = k.slice(0, i), idx = parseInt(k.slice(i + 1), 10);
      var g = groups.filter(function (x) { return x && x.ctx === ctxKey; })[0];
      return g && arr(g.items)[idx] ? arr(g.items)[idx] : null;
    }).filter(Boolean);
  }

  function toolOrder(a) {
    var T = D.STEP_TOOLS || {};
    var ids = Object.keys((a && a.tools) || {});
    var first = arr(T.screen).concat(arr(T.comorbid));
    return ids.sort(function (x, y) {
      var i = first.indexOf(x), j = first.indexOf(y);
      return (i < 0 ? 99 : i) - (j < 0 ? 99 : j);
    });
  }
  function toolLine(a, id) {
    var t = AA.byId('tools', id);
    var rec = (a.tools || {})[id] || {};
    var r = scoreOf(a, id);
    var notes = String(rec.notes || '').trim();
    if (!r && !notes) return null;
    var name = t ? (t.abbr || id) + (t.name ? ' (' + t.name + ')' : '') : id;
    var bits = [];
    if (r) {
      var txt = arr(r.lines).join(' ');
      if (r.band && txt.indexOf(r.band) < 0) txt = r.band + '. ' + txt;
      bits.push(txt.trim());
      arr(r.subscales).forEach(function (s) {
        if (!s.answered) return;
        bits.push(s.label + ' ' + s.total + '/' + s.max + (s.band ? ' (' + s.band + ')' : s.positive === true ? ' (above cut-off)' : ''));
      });
      arr(r.flags).forEach(function (fl) { bits.push('Flag: ' + fl.text); });
    } else {
      bits.push('Recorded in notes.');
    }
    if (notes) bits.push('Notes: ' + notes);
    return name + ': ' + bits.join(' ');
  }

  function buildReport(a) {
    a = a || {};
    var p = a.patient || {};
    var me = AA.auth.current() || {};
    var S = [];
    function sec(title) { var s = { title: title, blocks: [] }; S.push(s); return s; }
    var cr = D.criteria(a);
    var o = D.outcome(a);
    var need = D.need(a);
    var ad = D.counts(a, 'adult'), ch = D.counts(a, 'child');

    /* Identifying details */
    sec('Identifying details').blocks.push({ kv: [
      ['Patient reference', p.ref || 'Not recorded'],
      ['Age', has(p.age) ? p.age + ' years' : 'Not recorded'],
      ['Sex', p.sex || 'Not recorded'],
      p.gender ? ['Gender identity', p.gender] : null,
      p.occupation ? ['Occupation', p.occupation] : null,
      p.referrer ? ['Referred by', p.referrer] : null,
      ['Date of assessment', p.date ? U.fmtDate(p.date) || p.date : 'Not recorded'],
      ['Assessing clinician', me.name ? me.name + (me.role ? ', ' + me.role : '') : 'Not recorded']
    ].filter(Boolean) });

    /* Sources of information */
    var inf = p.informants || {}, src = p.sources || {}, col = a.collateral || {}, who = col.who || {};
    var rl = ratingLabels();
    var present = ['The patient'];
    if (inf.partner) present.push('partner');
    if (inf.parent) present.push('parent or carer');
    if (inf.sibling) present.push('brother or sister');
    if (String(inf.other || '').trim()) present.push(inf.other.trim());
    var informants = [];
    if (typeof col.parent === 'number') informants.push('Parent or carer' + (who.parent ? ' (' + who.parent + ')' : ''));
    if (typeof col.partner === 'number') informants.push('Partner' + (who.partner ? ' (' + who.partner + ')' : ''));
    var done = toolOrder(a).filter(function (id) { var r = scoreOf(a, id); return r && r.answered; }).map(toolAbbr);
    sec('Sources of information').blocks.push({ kv: [
      ['Present at the interview', present.join(', ')],
      ['Informants', informants.length ? informants.join('; ') : 'None recorded'],
      ['School reports', src.schoolReports || typeof col.school === 'number' ? 'Available' : 'Not available'],
      ['Previous records', src.previousRecords ? 'Reviewed' : 'Not available'],
      ['Questionnaires completed', done.length ? done.join(', ') : 'None recorded'],
      p.interpreter ? ['Interpreter', 'Used'] : null,
      ['Consent', p.consent ? 'Verbal consent to the assessment recorded' : 'Not recorded']
    ].filter(Boolean) });

    /* Reason for referral */
    sec('Reason for referral').blocks.push({ p: String(p.reason || '').trim() || 'Not recorded.' });

    /* Screening results */
    var tl = toolOrder(a).map(function (id) { return toolLine(a, id); }).filter(Boolean);
    sec('Screening and rating scales').blocks.push(tl.length ? { list: tl } : { p: 'No questionnaires recorded.' });

    /* Relevant history */
    var hs = sec('Relevant history');
    var hist = a.history || {}, hItems = [], hNone = [];
    arr(AA.data.history).forEach(function (s) {
      var r = hist[s.id];
      if (!r) return;
      var ticked = arr(s.items).filter(function (it) { return it && r.checks && r.checks[it.id]; }).map(function (it) { return it.t; });
      var notes = String(r.notes || '').trim();
      if (ticked.length || notes) hItems.push(s.title + ': ' + [ticked.length ? ticked.join('; ') + '.' : '', notes].filter(Boolean).join(' '));
      else if (r.none) hNone.push(s.title);
    });
    if (hItems.length) hs.blocks.push({ list: hItems });
    if (hNone.length) hs.blocks.push({ p: 'Nothing relevant reported: ' + hNone.join(', ') + '.' });
    if (!hItems.length && !hNone.length) hs.blocks.push({ p: 'No history recorded.' });

    /* Mental state (recorded in the clinical history step as history.mse.notes) */
    var mse = String((hist.mse && hist.mse.notes) || '').trim();
    sec('Mental state').blocks.push({ p: mse || 'Not recorded.' });

    /* Safety and risk */
    var rs = sec('Safety and risk');
    var risk = a.risk || {};
    var rItems = arr(AA.data.risk && AA.data.risk.items).filter(function (it) { return it && risk[it.id]; }).map(function (it) { return it.text || it.short || it.id; });
    if (rItems.length) rs.blocks.push({ list: rItems });
    else rs.blocks.push({ p: risk.reviewed ? 'Safety reviewed. No risk items identified.' : 'Safety review not recorded.' });
    var rkv = [];
    if (String(risk.notes || '').trim()) rkv.push(['Notes', risk.notes]);
    if (String(risk.action || '').trim()) rkv.push(['Action and safety plan', risk.action]);
    if (rkv.length) rs.blocks.push({ kv: rkv });

    /* Symptoms */
    var ss = sec('Symptoms');
    var list = syms();
    ss.blocks.push({ p: 'Adulthood (past 6 months): inattention ' + ad.IA + ' of ' + ad.ofIA + ', hyperactivity-impulsivity ' + ad.HI + ' of ' + ad.ofHI +
      '. DSM-5-TR needs ' + need + ' or more in either domain.' + (ad.unsureIA + ad.unsureHI ? ' ' + (ad.unsureIA + ad.unsureHI) + ' scored unsure.' : '') });
    ss.blocks.push({ p: 'Childhood (age 5 to 12): inattention ' + ch.IA + ' of ' + ch.ofIA + ', hyperactivity-impulsivity ' + ch.HI + ' of ' + ch.ofHI + '.' });
    if (list.length) {
      var rec = a.symptoms || {};
      ss.blocks.push({ table: { head: ['Code', 'Symptom', 'Adulthood', 'Childhood'], rows: list.map(function (s) {
        var r = rec[s.id] || {};
        return [symCode(s), s.title || s.id, SCORE_LABEL[r.adult] || 'Not scored', SCORE_LABEL[r.child] || 'Not scored'];
      }) } });
      var exLines = [];
      list.forEach(function (s) {
        var r = rec[s.id] || {};
        var adx = exampleTexts(s, r.exA, 'adult'), chx = exampleTexts(s, r.exC, 'child');
        if (String(r.otherA || '').trim()) adx.push('"' + r.otherA.trim() + '"');
        if (String(r.otherC || '').trim()) chx.push('"' + r.otherC.trim() + '"');
        if (!adx.length && !chx.length && !String(r.notes || '').trim()) return;
        var bits = [];
        if (adx.length) bits.push('Adulthood: ' + adx.join('; ') + '.');
        if (chx.length) bits.push('Childhood: ' + chx.join('; ') + '.');
        if (String(r.notes || '').trim()) bits.push('Notes: ' + r.notes.trim());
        exLines.push(symCode(s) + ' ' + (s.title || s.id) + '. ' + bits.join(' '));
      });
      if (exLines.length) { ss.blocks.push({ p: 'Examples described:' }); ss.blocks.push({ list: exLines }); }
    }
    var sup = a.supplement || {};
    if (sup.iaAdult || sup.iaChild || sup.hiAdult || sup.hiChild) {
      ss.blocks.push({ p: 'Problems greater than in others of the same age (supplement question): inattention, adulthood ' + yesNo(sup.iaAdult).toLowerCase() + ', childhood ' + yesNo(sup.iaChild).toLowerCase() +
        '; hyperactivity-impulsivity, adulthood ' + yesNo(sup.hiAdult).toLowerCase() + ', childhood ' + yesNo(sup.hiChild).toLowerCase() + '.' });
    }

    /* Onset */
    var on = a.onset || {};
    var os = sec('Onset');
    os.blocks.push({ kv: [
      ['Symptoms always present', yesNo(on.always)],
      on.always === 'no' && on.ageOnset ? ['Age at onset', String(on.ageOnset)] : null,
      ['Several symptoms before age 12', yesNo(on.before12, true)],
      ['Lasted at least 6 months', yesNo(on.duration6m)],
      String(on.notes || '').trim() ? ['Notes', on.notes] : null
    ].filter(Boolean) });
    os.blocks.push({ p: 'Criterion B ' + STATUS_TEXT[cr.B.status] + '. ' + cr.B.detail });

    /* Impairment */
    var is = sec('Impairment');
    var sl = sevLabels();
    var dA = D.impairment(a, 'adult'), dC = D.impairment(a, 'child');
    if (dA.length) {
      var byC = {};
      dC.forEach(function (x) { byC[x.id] = x.sev; });
      is.blocks.push({ table: { head: ['Area', 'Adulthood', 'Childhood'], rows: dA.map(function (x) {
        return [x.label, x.sev === null ? 'Not rated' : sl[x.sev], byC[x.id] === null || byC[x.id] === undefined ? 'Not rated' : sl[byC[x.id]]];
      }) } });
      var impRec = a.impairment || {}, iNotes = [];
      ['adult', 'child'].forEach(function (per) {
        dA.forEach(function (x) {
          var n = impRec[per] && impRec[per][x.id] && String(impRec[per][x.id].notes || '').trim();
          if (n) iNotes.push(x.label + ' (' + (per === 'adult' ? 'adulthood' : 'childhood') + '): ' + n);
        });
      });
      if (iNotes.length) is.blocks.push({ list: iNotes });
    } else is.blocks.push({ p: 'Impairment areas not available.' });
    is.blocks.push({ p: 'Criterion C ' + STATUS_TEXT[cr.C.status] + '. ' + cr.C.detail + ' Criterion D ' + STATUS_TEXT[cr.D.status] + '. ' + cr.D.detail });

    /* Collateral */
    var cs = sec('Collateral information');
    function rating(v) { return v === 'na' ? 'Not available' : typeof v === 'number' ? v + ', ' + (rl[v] || '') : 'Not obtained'; }
    var cl = D.collateral(a);
    cs.blocks.push({ kv: [
      ['Parent or carer', rating(col.parent) + (who.parent ? ' (' + who.parent + ')' : '')],
      ['Partner', rating(col.partner) + (who.partner ? ' (' + who.partner + ')' : '')],
      ['School reports', rating(col.school)],
      ['Overall', { clear: 'Clear support for the history', some: 'Some support for the history', none: 'Little or no support for the history', unavailable: 'No collateral information' }[cl.level]],
      String(col.notes || '').trim() ? ['Notes', col.notes] : null
    ].filter(Boolean) });

    /* Differential diagnosis */
    var ds = sec('Differential diagnosis');
    var drec = a.ddx || {};
    var conds = arr(AA.data.ddx).filter(function (c) { return c && c.id; });
    var dl = conds.filter(function (c) { return drec[c.id] && drec[c.id].verdict; }).map(function (c) {
      var e = drec[c.id];
      var sc = D.ddxScore(c, e);
      var v = verdictOf(e.verdict);
      return condName(c) + ': ' + (v ? v.l.toLowerCase() : e.verdict) + '.' + (sc.checked ? ' Features ' + sc.score + '/' + sc.max + ' (' + bandOf(sc.band).l.toLowerCase() + ').' : '') +
        (String(e.notes || '').trim() ? ' ' + e.notes.trim() : '');
    });
    if (dl.length) ds.blocks.push({ list: dl });
    var notRev = conds.filter(function (c) { return c.core && !(drec[c.id] && drec[c.id].verdict); }).map(condName);
    if (notRev.length) ds.blocks.push({ p: 'Core conditions not yet reviewed: ' + notRev.join(', ') + '.' });
    if (!dl.length && !notRev.length) ds.blocks.push({ p: 'No differential review recorded.' });
    ds.blocks.push({ p: 'Criterion E ' + STATUS_TEXT[cr.E.status] + '. ' + cr.E.detail });
    var pc = protocolCounts(a);
    if (pc.of && pc.done) ds.blocks.push({ p: 'Systematic differential protocol: ' + pc.done + ' of ' + pc.of + ' checks completed.' });

    /* Validity */
    var vs = sec('Symptom validity');
    var V = AA.data.validity || {}, vrec = a.validity || {}, vc = vrec.checks || {};
    var cn = CONCERN.filter(function (x) { return x.v === vrec.concern; })[0];
    vs.blocks.push({ p: cn ? 'Concern about symptom validity: ' + cn.l.toLowerCase() + '. ' + cn.d : 'Concern about symptom validity not recorded.' });
    var ind = arr(V.indicators).filter(function (x) { return x && vc[x.id]; }).map(function (x) { return x.t; });
    var inc = arr(V.incentives).filter(function (x) { return x && vc[x.id]; }).map(function (x) { return x.t; });
    if (ind.length) vs.blocks.push({ kv: [['Indicators noted', ind.join('; ')]] });
    if (inc.length) vs.blocks.push({ kv: [['External incentives', inc.join('; ')]] });
    var warns = consistencyChecks(a).filter(function (x) { return x.status === 'warn'; }).map(function (x) { return x.label + ': ' + x.text; });
    if (warns.length) { vs.blocks.push({ p: 'Inconsistencies to note:' }); vs.blocks.push({ list: warns }); }
    if (String(vrec.notes || '').trim()) vs.blocks.push({ kv: [['Notes', vrec.notes]] });

    /* Conclusion */
    var f = a.formulation || {};
    var cs2 = sec('Conclusion');
    var concl;
    var presKey = chosenPresentation(a);
    var P = presKey ? D.PRESENTATIONS[presKey] : null;
    if (f.decision === 'met') {
      concl = 'ADHD' + (P ? ', ' + P.label.toLowerCase() : '') + (f.severity ? ', ' + f.severity : '') + (f.remission ? ', in partial remission' : '') + '.';
    } else if (f.decision === 'other-specified') {
      concl = 'Other specified ADHD' + (f.remission ? ', in partial remission' : '') + '. Impairing ADHD symptoms that do not meet the full criteria.';
    } else if (f.decision === 'not-met') {
      concl = 'The criteria for ADHD are not met.' + (o.code === 'better-explained' ? ' ' + cr.E.detail : '');
    } else if (f.decision === 'deferred') {
      concl = 'Diagnosis deferred until more information is available.';
    } else {
      concl = 'Clinician conclusion not recorded yet. Recorded findings: ' + o.title.toLowerCase() + '.';
    }
    var kv = [['Conclusion', concl]];
    var cl2 = codeLine(a);
    if (cl2) kv.push(['Codes', 'DSM-5-TR / ICD-10-CM ' + cl2.dsm + '; ICD-11 ' + cl2.icd11]);
    kv.push(['Criteria', CRIT.map(function (c) { return c.k + ' ' + STATUS_TEXT[cr[c.k].status]; }).join(', ')]);
    var com = f.comorbid !== undefined ? f.comorbid : comorbidSuggestion(a);
    kv.push(['Co-occurring conditions', String(com || '').trim() || 'None recorded']);
    var cf = D.confidence(a);
    kv.push(['Evidence strength', (CONF[cf.level] || CONF.low)[0] + ' (app heuristic). ' + cf.reasons.map(function (r) { return r[1]; }).join(' ')]);
    if (String(f.notes || '').trim()) kv.push(['Formulation', f.notes]);
    cs2.blocks.push({ kv: kv });

    /* Plan */
    var ps = sec('Plan');
    var plan = f.plan || {};
    var pl = arr(AA.data.plan).filter(function (x) { return x && plan[x.id]; }).map(function (x) { return x.t; });
    if (pl.length) ps.blocks.push({ list: pl });
    if (String(f.planNotes || '').trim()) ps.blocks.push({ p: f.planNotes });
    if (!pl.length && !String(f.planNotes || '').trim()) ps.blocks.push({ p: 'No plan recorded.' });
    return S;
  }

  var REPORT_TITLE = 'Adult ADHD assessment: draft report';

  function reportNode(model) {
    var box = h('article', { class: 'report ab-report', 'aria-label': 'Draft report' }, h('p', { class: 'ab-rtitle' }, REPORT_TITLE));
    model.forEach(function (s) {
      box.appendChild(h('h3', null, s.title));
      s.blocks.forEach(function (b) {
        if (b.p !== undefined) box.appendChild(h('p', null, b.p));
        else if (b.list) box.appendChild(h('ul', null, b.list.map(function (x) { return h('li', null, x); })));
        else if (b.kv) box.appendChild(h('dl', { class: 'ab-rkv' }, b.kv.map(function (r) { return h('div', null, h('dt', null, r[0]), h('dd', null, r[1])); })));
        else if (b.table) {
          box.appendChild(h('div', { class: 'ab-rtable' }, h('table', null,
            h('thead', null, h('tr', null, b.table.head.map(function (x) { return h('th', { scope: 'col' }, x); }))),
            h('tbody', null, b.table.rows.map(function (r) { return h('tr', null, r.map(function (x) { return h('td', null, x); })); })))));
        }
      });
    });
    box.appendChild(h('p', { class: 'ab-rfoot' }, 'Draft prepared on ' + U.fmtDate(new Date().toISOString()) + '. To be checked and edited by the assessing clinician.'));
    return box;
  }

  function reportText(model) {
    var out = [REPORT_TITLE.toUpperCase(), ''];
    model.forEach(function (s) {
      out.push(s.title.toUpperCase());
      s.blocks.forEach(function (b) {
        if (b.p !== undefined) out.push(b.p);
        else if (b.list) b.list.forEach(function (x) { out.push('- ' + x); });
        else if (b.kv) b.kv.forEach(function (r) { out.push(r[0] + ': ' + r[1]); });
        else if (b.table) {
          out.push(b.table.head.join(' | '));
          b.table.rows.forEach(function (r) { out.push(r.join(' | ')); });
        }
      });
      out.push('');
    });
    out.push('Draft prepared on ' + U.fmtDate(new Date().toISOString()) + '. To be checked and edited by the assessing clinician.');
    return out.join('\n');
  }
  AA.components.assessmentReport = { build: buildReport, text: reportText };

  /* ===================================================================================
     Step: report and next steps
     =================================================================================== */

  var PLAN_ORDER = ['Safety', 'After diagnosis', 'Before any medication', 'Other needs', 'If ADHD not diagnosed'];

  AA.steps.report = { render: function (el, ctx) {
    var a0 = ctx.a() || {};
    var f0 = a0.formulation || {};
    var dec = f0.decision;

    el.appendChild(ui.callout('warn', h('p', null, 'The report below is built from what you recorded. Check every line, copy it into the clinical record and edit it there. Then delete the assessment from this browser (Home, then Delete).'),
      'Draft for you to check'));
    if (!dec) {
      el.appendChild(ui.callout('info', h('div', null, h('p', null, 'You have not recorded your conclusion yet. The report will say so.'),
        ui.btn({ label: 'Go to scoring and diagnosis', kind: 'ghost', small: true, onClick: function () { ctx.go('summary'); } }))));
    }

    /* Plan */
    var items = arr(AA.data.plan).filter(function (x) { return x && x.id; });
    var plan0 = f0.plan || {};
    var planLive = h('p', { class: 'ab-live', 'aria-live': 'polite' });
    var planSec = h('section', { class: 'card ab-card no-print' }, h('h2', null, 'Plan'));
    var planGroups = [];
    if (items.length) {
      planSec.appendChild(h('p', { class: 'hint' }, dec ? 'Groups that fit your decision are open. Tick what you agreed with the patient.' : 'Tick what you agreed with the patient. Record your conclusion first to see which groups fit.'));
      planSec.appendChild(planLive);
      var groups = [];
      items.forEach(function (x) { var g = x.group || 'Other needs'; if (groups.indexOf(g) < 0) groups.push(g); });
      groups.sort(function (x, y) {
        var i = PLAN_ORDER.indexOf(x), j = PLAN_ORDER.indexOf(y);
        return (i < 0 ? 99 : i) - (j < 0 ? 99 : j);
      });
      groups.forEach(function (g) {
        var fits = g === 'Safety' ? 'Always consider'
          : (dec === 'met' || dec === 'other-specified') && (g === 'After diagnosis' || g === 'Before any medication') ? 'Fits your decision'
          : dec === 'not-met' && g === 'If ADHD not diagnosed' ? 'Fits your decision' : null;
        var gItems = items.filter(function (x) { return (x.group || 'Other needs') === g; });
        var meta = h('span', { class: 'ab-pmeta' });
        var anyTicked = gItems.some(function (x) { return plan0[x.id]; });
        var det = ui.details(h('h3', { class: 'ab-pgh' }, h('span', null, g), fits ? ui.badge(fits, 'accent') : null),
          h('div', { class: 'ab-plist' }, gItems.map(function (x) {
            return ui.check({ label: x.t || x.id, hint: x.src ? 'Source: ' + x.src : null, checked: !!plan0[x.id], cls: 'ab-pcheck',
              onChange: function (on) { ctx.set('formulation.plan.' + x.id, on ? true : undefined); } });
          })), { open: !!fits || anyTicked, meta: meta, cls: 'ab-pgroup' });
        planGroups.push({ items: gItems, meta: meta });
        planSec.appendChild(det);
      });
    } else {
      planSec.appendChild(h('p', { class: 'muted' }, 'Plan items are not available in this build. Write the plan in the notes below.'));
    }
    planSec.appendChild(ui.field('Plan notes', ui.input({ rows: 3, value: f0.planNotes || '', placeholder: 'What was agreed with the patient, referrals, follow-up date, information given.',
      onSave: function (v) { ctx.set('formulation.planNotes', textOrNone(v)); } })));
    el.appendChild(planSec);
    function paintPlan() {
      if (!items.length) return;
      var p = ctx.get('formulation.plan', {}) || {};
      planLive.textContent = items.filter(function (x) { return p[x.id]; }).length + ' of ' + items.length + ' plan items ticked.';
      planGroups.forEach(function (g) {
        var n = g.items.filter(function (x) { return p[x.id]; }).length;
        g.meta.textContent = n + ' of ' + g.items.length;
      });
    }

    /* Report */
    var host = h('div', { class: 'ab-rhost' });
    var text = '';
    function rebuild() {
      var model;
      try { model = buildReport(ctx.a() || {}); } catch (e) {
        if (window.console) console.error(e);
        fill(host, ui.callout('err', h('p', null, 'The report could not be built: ' + e.message)));
        text = '';
        return;
      }
      text = reportText(model);
      fill(host, reportNode(model));
    }
    var ref = String((a0.patient || {}).ref || 'patient').replace(/[^A-Za-z0-9_]+/g, '_');
    var actions = [ui.btn({ label: 'Copy report', kind: 'primary', onClick: function () { copy(text, 'Report'); } })];
    if (!U.isEmbedded) {
      actions.push(ui.btn({ label: 'Download .txt', kind: 'ghost', onClick: function () {
        if (U.download('adhd-report-' + ref + '-' + U.today() + '.txt', text, 'text/plain')) U.toast('Report saved', 'ok');
        else copy(text, 'Report');
      } }));
      actions.push(ui.btn({ label: 'Print', kind: 'ghost', onClick: function () { try { window.print(); } catch (e) { U.toast('Printing is not available here.', 'warn'); } } }));
    }
    el.appendChild(h('section', { class: 'ab-sec' },
      h('div', { class: 'ab-rhead no-print' },
        h('h2', null, 'Draft report'),
        h('div', { class: 'row' }, actions)),
      h('p', { class: 'hint no-print' }, 'Updates as you change the plan. Copy gives plain text that pastes cleanly into most record systems.'),
      host,
      h('div', { class: 'ab-reviewed no-print' }, ui.check({ label: 'I have reviewed and edited this draft', hint: 'This completes the report step.',
        checked: !!f0.reportReviewed, onChange: function (on) { ctx.set('formulation.reportReviewed', on ? true : undefined); } }))));

    rebuild();
    paintPlan();
    ctx.onChange('formulation', U.debounce(function () { if (!el.isConnected) return; rebuild(); paintPlan(); }, 150));
    return null;
  } };
})(window.AA);
