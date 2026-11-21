/* Assessment steps, part A: before you start, screening questionnaires, safety and risk,
   clinical history and the co-occurring conditions screen.
   Each step registers AA.steps.<id> = {render(el, ctx)} (see ARCHITECTURE.md, section 6).
   The frame renders the h1, step strip, live panel and previous/next buttons, so step content
   starts at h2. Steps write through ctx.set (undefined deletes) and re-read with ctx.get.
   Age: adults (18+) and young people (6-17) share one record. The age group comes from
   AA.diagnosis.band/young/bandInfo (with a local fallback); under 6 the setup step stops and advises referral.
   Layout (DESIGN.md): one card per purpose, each with an icon, a title, a one-line purpose and a status chip;
   checklists are hairline rows grouped by purpose with a count; questionnaires sit in one grouped accordion per
   group (core, optional) with the score on each row; the history areas show one at a time (ui.stepper); depth
   folds away; sources sit in one closed disclosure at the end. */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui;
  AA.steps = AA.steps || {};

  /* ---------- Age group ---------- */

  function arr(x) { return Array.isArray(x) ? x : null; }
  function ageOf(a) { var n = a && a.patient ? parseInt(a.patient.age, 10) : NaN; return isNaN(n) ? null : n; }
  /* 'under6' | 'child' (6-11) | 'teen' (12-16) | 'y17' | 'adult' (18+ or age missing). */
  function bandOf(a) {
    var D = AA.diagnosis;
    if (D && typeof D.band === 'function') { try { var b = D.band(a); if (b) return b; } catch (e) { /* fall back */ } }
    var n = ageOf(a);
    if (n === null || n >= 18) return 'adult';
    if (n < 6) return 'under6';
    if (n < 12) return 'child';
    return n < 17 ? 'teen' : 'y17';
  }
  function isYoung(a) {
    var D = AA.diagnosis;
    if (D && typeof D.young === 'function') { try { return !!D.young(a); } catch (e) { /* fall back */ } }
    var b = bandOf(a);
    return b === 'child' || b === 'teen' || b === 'y17';
  }
  function bandInfo(a) {
    var D = AA.diagnosis;
    if (D && typeof D.bandInfo === 'function') {
      try { var i = D.bandInfo(a); if (i && typeof i === 'object' && Object.keys(i).length) return i; } catch (e) { /* fall back */ }
    }
    return (AA.data.ageBands || {})[bandOf(a)] || {};
  }
  function needOf(a) {
    var D = AA.diagnosis;
    if (D && typeof D.need === 'function') { try { return D.need(a); } catch (e) { /* fall back */ } }
    var n = ageOf(a);
    return n !== null && n < 17 ? 6 : 5;
  }
  var BAND_LABEL = { under6: 'Under 6', child: 'Child (6 to 11)', teen: 'Young person (12 to 16)', y17: 'Young person (17)', adult: 'Adult (18 and over)' };

  /* Data items may carry ages: 'young' | 'adult' | 'all' (missing means all). */
  function forAge(it, young) { var g = it && it.ages; return !g || g === 'all' || g === (young ? 'young' : 'adult'); }
  /* They may also carry bands: ['child', 'teen', 'y17', 'adult'] (missing or empty means every band),
     for example substance use from age 12. An item shows only when both fit. */
  function forBand(it, band) { var b = it && it.bands; return !Array.isArray(b) || !b.length || b.indexOf(band) > -1; }
  function fitsGroup(it, young, band) { return forAge(it, young) && forBand(it, band); }
  /* Tool age range (numeric ageMin/ageMax, inclusive). strict: a tool without numbers counts as an adult tool. */
  function fitsAge(t, age, strict, young) {
    var lo = typeof t.ageMin === 'number' ? t.ageMin : null, hi = typeof t.ageMax === 'number' ? t.ageMax : null;
    if (lo === null && hi === null) return strict ? !young : true;
    if (age === null) return hi === null || hi >= 18;
    return (lo === null || age >= lo) && (hi === null || age <= hi);
  }

  /* A young-person version of a data field when there is one (for example introYoung), else the field itself. */
  function pick(o, key, young) {
    var y = young && o ? o[key + 'Young'] : null;
    return y && (!Array.isArray(y) || y.length) ? y : (o ? o[key] : null);
  }
  function srcList(x) { return typeof x === 'string' && x.trim() ? [x] : arr(x); }
  /* Single sources from strings such as "NICE NG87 1.3.2; Clinical practice": split, trimmed, no repeats. */
  function srcParts(list) {
    var out = [];
    (list || []).forEach(function (s) {
      String(s || '').split(';').forEach(function (p) {
        p = p.trim();
        if (!p) return;
        p = p.charAt(0).toUpperCase() + p.slice(1);
        if (out.indexOf(p) < 0) out.push(p);
      });
    });
    return out;
  }
  /* Closed "Sources" disclosure at the end of a card or step. lines (optional): [label, text] rows, for example
     an area and the sources behind its items, or a source and the items it covers. n: the number shown on the
     summary (the count of distinct sources; defaults to the number of entries). */
  function sourcesBox(list, lines, n) {
    list = (list || []).filter(Boolean);
    lines = (lines || []).filter(function (l) { return l && l[1]; });
    if (!list.length && !lines.length) return null;
    if (!lines.length) return ui.details('Sources', h('p', { class: 'source' }, list.join('; ')), { cls: 'guide-src', meta: String(list.length) });
    if (typeof n !== 'number' || !n) n = list.length + lines.length;
    return ui.details('Sources', h('div', null,
      list.length ? h('p', { class: 'source' }, list.join('; ')) : null,
      h('ul', { class: 'as-srclist' }, lines.map(function (l) { return h('li', { class: 'source' }, h('span', { class: 'source-k' }, l[0] + ': '), l[1]); }))),
      { cls: 'guide-src', meta: String(n) });
  }
  /* Rows for sourcesBox from data items with a src field: one row per source, naming the items it covers. */
  function itemSourceLines(items, label) {
    var order = [], by = {};
    (items || []).forEach(function (it) {
      var s = it && typeof it.src === 'string' ? it.src.trim() : '';
      if (!s) return;
      if (!by[s]) { by[s] = []; order.push(s); }
      by[s].push(label(it));
    });
    return order.map(function (s) { return [s, by[s].filter(Boolean).join('; ')]; });
  }

  /* ---------- Layout: cards, groups, rows (no boxes inside boxes) ---------- */

  function fill(host, node) { U.clear(host); U.append(host, node); }

  /* One card per purpose: an icon tile, the title, a one-line purpose and a status slot on the right.
     o: {icon, title, sub, side (node), tone: 'err' | 'warn', cls}. The returned card has .side (the status slot). */
  function card(o, content) {
    var hid = ui.nid('as-h');
    var side = h('div', { class: 'as-chead-side' }, o.side || null);
    var el = h('section', { class: 'card as-card' + (o.tone ? ' as-tone-' + o.tone : '') + (o.cls ? ' ' + o.cls : ''), 'aria-labelledby': hid },
      h('header', { class: 'as-chead' },
        o.icon ? h('span', { class: 'as-chead-ico', 'aria-hidden': 'true' }, ui.icon(o.icon)) : null,
        h('div', { class: 'as-chead-t' }, h('h2', { id: hid }, o.title), o.sub ? h('p', { class: 'as-csub' }, o.sub) : null),
        side),
      content);
    el.side = side;
    return el;
  }
  /* A titled group inside a card: a small heading, a count on the right and an optional one-line purpose. */
  function group(title, content, o) {
    o = o || {};
    return h('div', { class: 'as-grp' + (o.cls ? ' ' + o.cls : '') },
      h('div', { class: 'as-grp-head' }, h('h3', { class: 'as-grp-t' }, title), o.side ? h('span', { class: 'as-grp-n' }, o.side) : null),
      o.sub ? h('p', { class: 'as-grp-p' }, o.sub) : null,
      content);
  }
  /* Checkbox rows divided by hairlines. */
  function rows(list, cls) { return h('div', { class: 'as-rows' + (cls ? ' ' + cls : '') }, list); }
  /* Checkboxes shown as toggle pills, for short sets of options. */
  function pills(list) { return h('div', { class: 'as-pills' }, list); }
  /* A borderless disclosure row inside a card: depth on demand. */
  function fold(summary, content, o) {
    o = o || {};
    return ui.details(summary, content, { open: !!o.open, meta: o.meta, cls: 'as-fold' + (o.cls ? ' ' + o.cls : ''), onToggle: o.onToggle });
  }
  /* The tick that completes a card: a row with an accent bar. */
  function confirmRow(content) { return h('div', { class: 'as-confirm' }, content); }
  function countText(n, of, word) { return n + ' of ' + of + (word ? ' ' + word : ''); }

  /* ---------- Questionnaires ---------- */

  function toolList(ids) {
    return ids.map(function (id) { return AA.byId('tools', id); }).filter(Boolean);
  }
  function hasItems(t) { return !!(t && t.interactive !== false && t.items && t.items.length); }

  /* Tool ids for the screening ('screen') or co-occurring ('comorbid') step: {all, core}.
     Preference: AA.diagnosis.stepTools(a, step), then the age band's lists, then AA.diagnosis.STEP_TOOLS. */
  function stepToolIds(a, step) {
    var D = AA.diagnosis || {}, all = null, core = null;
    if (typeof D.stepTools === 'function') {
      try {
        var r = D.stepTools(a, step);
        if (arr(r)) {
          all = r;
          try { var rc = D.stepTools(a, step + 'Core'); if (arr(rc)) core = rc; } catch (e2) { core = null; }
        } else if (r && typeof r === 'object') {
          all = arr(r.all) || arr(r.list) || arr(r.ids) || arr(r.tools) || arr(r[step]);
          core = arr(r.core) || arr(r[step + 'Core']);
        }
      } catch (e) { all = null; core = null; }
    }
    var info = bandInfo(a);
    var young = isYoung(a), age = ageOf(a);
    var T = D.STEP_TOOLS || {};
    if (!all) all = arr(info[step]);
    if (!core) core = arr(info[step + 'Core']);
    if (!all) all = T[step] || [];
    /* No core list for this group: adults keep the standard core; young people treat every listed tool as optional. */
    if (!core) core = young ? [] : (T[step + 'Core'] || []);
    /* Young people: drop tools outside their age range. When the band has no list of its own (the engine then
       falls back to the adult list), a tool without an age range counts as an adult tool and is left out.
       Adult lists are used exactly as listed. */
    if (young) {
      var ok = function (strict) { return function (id) { var t = AA.byId('tools', id); return !t || fitsAge(t, age, strict, true); }; };
      all = all.filter(ok(!arr(info[step]))); core = core.filter(ok(!arr(info[step + 'Core'])));
    }
    return { all: all, core: core, young: young, age: age };
  }

  /* Result of an information-only (licensed) tool, entered by hand: tools.<id>.result. */
  var RATERS = [{ v: 'parent', l: 'Parent or carer' }, { v: 'teacher', l: 'Teacher' }, { v: 'self', l: 'Self' }, { v: 'clinician', l: 'Clinician' }];
  function manualResult(ctx, t) {
    var r = ctx.get('tools.' + t.id + '.result', null);
    if (!r || typeof r !== 'object') return null;
    var score = String(r.score || '').trim();
    var has = !!(score || r.cutoff);
    if (!has && !r.rater && !r.date && !String(r.notes || '').trim()) return null;
    return { manual: true, answered: has ? 1 : 0, of: 1, complete: has, total: null, max: null, band: null, sev: null, flags: [],
      positive: r.cutoff === 'yes' ? true : r.cutoff === 'no' ? false : null, score: score, cutoff: r.cutoff || null, rater: r.rater || null };
  }

  /* Score a tool from the stored answers (or read the entered result for an information-only tool).
     Never throws: odd data gives null. */
  function resultFor(ctx, t) {
    if (!t) return null;
    if (!hasItems(t)) return manualResult(ctx, t);
    try { return AA.scoring.score(t, ctx.get('tools.' + t.id + '.answers', {}) || {}); } catch (e) { return null; }
  }
  /* Same rule as AA.diagnosis.ddxScreens: positive flag, or a band of moderate or above. */
  function isPositive(r) { return !!r && r.answered > 0 && (r.positive === true || (r.sev !== null && r.sev !== undefined && r.sev >= 2)); }
  function isNegative(r) {
    if (!r || !r.answered || isPositive(r)) return false;
    return r.positive === false || (r.complete && r.sev !== null && r.sev !== undefined && r.sev < 2);
  }
  function urgentFlags(r) { return r && r.flags ? r.flags.filter(function (f) { return f.level === 'urgent'; }) : []; }

  /* What a questionnaire row shows on the right: progress or score, the band, and the screen result as chips. */
  function toolMeta(t, r) {
    var out = [];
    if (!hasItems(t)) {
      if (r && r.complete) {
        if (r.score) out.push(h('span', { class: 'as-mres' }, r.score));
        out.push(isPositive(r) ? ui.badge('Positive', 'warn') : isNegative(r) ? ui.badge('Negative', 'ok') : ui.badge('Result entered', 'ok'));
      } else out.push(ui.badge('Official form', 'neutral'));
      return out;
    }
    if (!r || !r.answered) return [h('span', { class: 'as-mtext' }, 'Not started')];
    if (!r.complete) out.push(h('span', { class: 'as-mtext' }, r.answered + ' of ' + r.of + ' answered'));
    else {
      if (r.total !== null && r.total !== undefined && r.max) out.push(h('span', { class: 'as-mscore' }, r.total + ' / ' + r.max));
      if (r.band) out.push(h('span', { class: 'as-mband' }, r.band));
    }
    if (isPositive(r)) out.push(ui.badge('Positive', 'warn'));
    else if (isNegative(r)) out.push(ui.badge('Negative', 'ok'));
    if (urgentFlags(r).length) out.push(ui.badge('Urgent flag', 'err'));
    return out;
  }

  /* <details> whose body is built the first time it opens (questionnaires can be long). */
  function lazyDetails(summary, build, o) {
    var body = h('div', { class: 'as-dbody' });
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
    d.open = true;
    if (d.ensure) d.ensure();
    var s = d.querySelector('summary');
    try { d.scrollIntoView({ block: 'start' }); } catch (e) { /* old browsers */ }
    if (s) { try { s.focus({ preventScroll: true }); } catch (e) { s.focus(); } }
  }

  /* Facts line for a tool (who, time, items, ages) and its longer guidance, folded away so the items come first. */
  function toolFacts(t) { return [t.who, t.time, t.items_n ? U.plural(t.items_n, 'item') : null, t.ages].filter(Boolean).join(' · '); }
  function toolAbout(t) {
    var more = [
      t.purpose ? h('p', null, t.purpose) : null,
      t.when ? h('p', null, h('strong', null, 'When: '), t.when) : null,
      t.how ? [h('h4', { class: 'as-abouth' }, 'How to give it'), h('p', null, t.how)] : null,
      t.adhdNotes ? [h('h4', { class: 'as-abouth' }, 'Reading the result in an ADHD assessment'), h('p', null, t.adhdNotes)] : null
    ].filter(Boolean);
    return more.length ? fold('About this questionnaire', h('div', { class: 'as-aboutbody' }, more)) : null;
  }
  function aboutTool(t) {
    var facts = toolFacts(t);
    return h('div', { class: 'as-about' }, facts ? h('p', { class: 'as-facts' }, facts) : null, toolAbout(t));
  }

  /* Licence line with a link to the official source. */
  function licenceLine(t) {
    if (!t.licence && !t.url) return null;
    return h('p', { class: 'as-lic' },
      t.licence ? [h('strong', null, 'Licence: '), t.licence] : null,
      t.url ? [t.licence ? ' ' : null, h('a', { href: t.url, target: '_blank', rel: 'noopener noreferrer' }, 'Official page ↗')] : null);
  }

  /* Result entry for a licensed tool that is not reproduced here (tools.<id>.result). */
  function resultForm(ctx, t) {
    var base = 'tools.' + t.id + '.result';
    var r = ctx.get(base, {}) || {};
    function save(k, v) { ctx.set(base + '.' + k, v === '' || v === null || v === undefined ? undefined : v); }
    return h('div', { class: 'as-result' },
      h('p', { class: 'as-result-p' }, 'This instrument is not reproduced here because of its licence. Use the official form, score it as its manual says, then enter the result.'),
      licenceLine(t),
      h('h3', { class: 'as-subh' }, 'Enter the result'),
      h('div', { class: 'form-grid' },
        ui.field('Score or result', ui.input({ value: r.score, placeholder: 'For example: inattention T-score 72; total 18',
          onSave: function (v) { save('score', v.trim()); } })),
        ui.field('Date completed', ui.input({ type: 'date', value: r.date, onSave: function (v) { save('date', v); } }))),
      h('div', { class: 'as-resultsegs' },
        ui.seg({ label: 'Cut-off met?', options: [{ v: 'yes', l: 'Yes' }, { v: 'no', l: 'No' }, { v: 'unsure', l: 'Unsure', kind: 'unsure' }],
          value: r.cutoff || null, onChange: function (v) { save('cutoff', v); } }),
        ui.seg({ label: 'Who completed it', options: RATERS, value: r.rater || null, onChange: function (v) { save('rater', v); } })),
      ui.field('Notes on the result', ui.input({ rows: 2, value: r.notes,
        placeholder: 'For example: parent and teacher versions, subscale scores, how the result fits the interview.',
        onSave: function (v) { save('notes', v.trim() ? v : undefined); } })));
  }

  /* One questionnaire as an accordion row: the row shows the score and the screen result; the body has the
     facts, the items with a live score (or the result entry), notes and the library link. o: {open, extra(t) -> {el, update}, next} */
  function toolBlock(ctx, t, o) {
    var meta = h('span', { class: 'as-meta' });
    var extra = null;
    var nextHost = null;
    var d = lazyDetails(h('span', { class: 'as-ttl' }, h('strong', null, t.abbr || t.id), t.name ? h('span', { class: 'as-tname-inline' }, t.name) : null), function (body) {
      body.appendChild(aboutTool(t));
      if (hasItems(t)) {
        body.appendChild(h('div', { class: 'as-qwrap' }, AA.components.questionnaire(t, {
          answers: ctx.get('tools.' + t.id + '.answers', {}) || {},
          onAnswer: function (n, v) { ctx.set('tools.' + t.id + '.answers.' + n, v === null ? undefined : v); }
        })));
        /* Once this scale is complete, offer the next core scale that still needs answers. */
        nextHost = h('div', { class: 'row as-foot', 'aria-live': 'polite' });
        body.appendChild(nextHost);
      } else {
        body.appendChild(resultForm(ctx, t));
      }
      if (o.extra) { extra = o.extra(t); extra.update(resultFor(ctx, t)); body.appendChild(extra.el); }
      /* Information-only tools keep their notes inside the result; older notes stay visible. */
      if (hasItems(t) || String(ctx.get('tools.' + t.id + '.notes', '') || '').trim()) {
        body.appendChild(h('div', { class: 'as-notes' }, ui.field('Notes on ' + (t.abbr || t.id), ui.input({
          rows: 2, value: ctx.get('tools.' + t.id + '.notes', ''),
          placeholder: 'For example: checked the answers with the patient, items they were unsure about, who completed it.',
          onSave: function (v) { ctx.set('tools.' + t.id + '.notes', v.trim() ? v : undefined); }
        }))));
      }
      body.appendChild(h('div', { class: 'row as-foot' }, ui.btn({ label: 'Scoring guide in the tools library', kind: 'quiet', small: true, go: 'tool-' + t.id })));
      if (nextHost) update(resultFor(ctx, t));
    }, { open: o.open, meta: meta, cls: 'as-tool' });
    d.id = 'as-tool-' + t.id;
    function update(r) {
      fill(meta, toolMeta(t, r));
      if (extra && extra.update) extra.update(r);
      if (nextHost) {
        var nb = r && r.complete && o.next ? o.next() : null;
        U.clear(nextHost);
        if (nb) nextHost.appendChild(ui.btn({ label: 'Next questionnaire: ' + (nb.t.abbr || nb.t.id) + ' →', kind: 'secondary', small: true, onClick: function () { d.open = false; reveal(nb.el); } }));
      }
    }
    return { el: d, update: update, t: t };
  }

  /* Differentials whose screen list includes this tool. */
  function condsFor(toolId) {
    return (AA.data.ddx || []).filter(function (c) { return (c.screen || []).indexOf(toolId) > -1; });
  }
  /* Condition names without the bracketed detail, for compact lists (the full name is in the title). */
  function shortName(c) { return String(c.name || c.id).replace(/\s*\([^)]*\)/g, '').trim() || c.id; }
  function condLinks(conds) {
    return h('ul', { class: 'as-plist' }, conds.map(function (c) {
      return h('li', null, h('a', { href: '#cond-' + c.id, 'data-go': 'cond-' + c.id, title: c.name }, shortName(c)));
    }));
  }

  /* Questionnaire flags for a set of tools, shown prominently. Re-renders only when the set changes,
     so screen readers do not hear the same alert again on every answer. */
  function flagPanel(ctx) {
    var host = h('div', { class: 'as-flagpanel' });
    var sig = '';
    function update(list, results) {
      var urgent = [], warn = [];
      list.forEach(function (t) {
        var r = results[t.id];
        ((r && r.flags) || []).forEach(function (f) {
          var line = h('li', null, h('strong', null, (t.abbr || t.id) + (f.item !== undefined ? ' item ' + f.item : '') + ': '), f.text);
          (f.level === 'urgent' ? urgent : warn).push({ key: t.id + ':' + f.item + ':' + f.level, node: line });
        });
      });
      var next = urgent.concat(warn).map(function (x) { return x.key; }).join('|');
      if (next === sig) return;
      sig = next;
      U.clear(host);
      if (urgent.length) {
        host.appendChild(ui.callout('err', h('div', null, h('ul', { class: 'list' }, urgent.map(function (x) { return x.node; })),
          h('p', null, 'Ask about this now and record what you find in the safety and risk step.'),
          ui.btn({ label: 'Go to safety and risk', kind: 'secondary', small: true, onClick: function () { ctx.go('risk'); } })), 'Urgent: act on this today'));
      }
      if (warn.length) host.appendChild(ui.callout('warn', h('ul', { class: 'list' }, warn.map(function (x) { return x.node; })), 'Items to follow up'));
    }
    return { el: host, update: update };
  }

  /* Shared body of the screening and co-occurring steps: the rule, any flags, a results card, then one grouped
     accordion per group (core, optional) where each row shows its score and screen result.
     o: {tools, optional(t), intro, groups: [{title, hint, filter}], extra, points, emptyTitle, emptyBody, sources} */
  function questionnaireStep(el, ctx, o) {
    var list = o.tools;
    if (!list.length) {
      if (o.intro) el.appendChild(o.intro);
      el.appendChild(ui.empty(o.emptyTitle || 'No questionnaires available', o.emptyBody || 'The tools library has not loaded, so there is nothing to score here. Record results in your notes.'));
      if (o.sources) el.appendChild(o.sources);
      return null;
    }
    var results = {};
    function rescoreAll() { list.forEach(function (t) { results[t.id] = resultFor(ctx, t); }); }
    rescoreAll();

    el.appendChild(o.intro);
    var flags = flagPanel(ctx);
    el.appendChild(flags.el);

    var blocks = {};
    function openTool(id) { if (blocks[id]) reveal(blocks[id].el); }

    /* Results at a glance: core progress, positive screens (each opens its scale) and, for the co-occurring
       screen, the way on to the differentials. */
    var coreList = list.filter(function (t) { return !o.optional(t) && (hasItems(t) || t.interactive === false); });
    var progText = h('span', { class: 'as-kvnum' }), progMeter = h('div', { class: 'as-meter' }), posHost = h('div', { class: 'as-poshost' });
    var live = h('p', { class: 'sr-only', 'aria-live': 'polite' });
    var resSide = h('span');
    el.appendChild(card({ icon: 'chart', title: 'Results at a glance', sub: 'Scores update as you answer. Select a positive screen to open it.', side: resSide }, [
      h('dl', { class: 'ds-kv as-kv' },
        h('dt', null, coreList.length ? 'Core scales' : 'Scales recorded'), h('dd', null, h('div', { class: 'as-kvrow' }, progText, progMeter)),
        h('dt', null, 'Positive screens'), h('dd', null, posHost)),
      live]));

    /* Open the first core scale that is not finished; failing that, the first core official form without a result.
       Optional scales stay folded (they are used when something points to them), except where no core list exists
       (young people), where the first unfinished scale opens. */
    var firstOpen = null;
    var openable = coreList.length ? function (t) { return !o.optional(t); } : function () { return true; };
    list.forEach(function (t) {
      var r = results[t.id];
      if (!firstOpen && openable(t) && hasItems(t) && !(r && r.complete)) firstOpen = t.id;
    });
    if (!firstOpen) list.forEach(function (t) {
      var r = results[t.id];
      if (!firstOpen && !hasItems(t) && !o.optional(t) && !(r && r.complete)) firstOpen = t.id;
    });

    var order = [];
    function nextCore(id) {
      for (var j = order.indexOf(id) + 1; j < order.length; j++) {
        var r = results[order[j]];
        if (!o.optional(blocks[order[j]].t) && hasItems(blocks[order[j]].t) && !(r && r.complete)) return blocks[order[j]];
      }
      return null;
    }
    var groupCounts = [];
    o.groups.forEach(function (g) {
      var members = list.filter(g.filter);
      if (!members.length) return;
      var count = h('span', { class: 'as-acc-n' });
      var acc = h('section', { class: 'ds-acc as-acc', 'aria-label': g.title },
        h('div', { class: 'ds-acc-head as-acchead' },
          h('div', { class: 'as-acchead-t' }, h('h2', null, g.title), g.hint ? h('p', { class: 'as-acc-p' }, g.hint) : null),
          count));
      members.forEach(function (t) {
        order.push(t.id);
        var b = toolBlock(ctx, t, { open: t.id === firstOpen, extra: o.extra || null, next: function () { return nextCore(t.id); } });
        blocks[t.id] = b;
        acc.appendChild(b.el);
      });
      groupCounts.push({ el: count, members: members });
      el.appendChild(acc);
    });
    /* One questionnaire open at a time: opening one folds the others and keeps the opened row in view. */
    order.forEach(function (tid) {
      var d = blocks[tid].el;
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        var moved = false;
        order.forEach(function (other) { var od = blocks[other].el; if (od !== d && od.open) { od.open = false; moved = true; } });
        if (moved) {
          try { if (d.getBoundingClientRect().top < 100) d.scrollIntoView({ block: 'start' }); } catch (e) { /* old browsers */ }
        }
      });
    });
    if (o.sources) el.appendChild(o.sources);

    var posSig = null;
    function update() {
      rescoreAll();
      flags.update(list, results);
      list.forEach(function (t) { if (blocks[t.id]) blocks[t.id].update(results[t.id]); });
      groupCounts.forEach(function (g) {
        var n = g.members.filter(function (t) { return results[t.id] && results[t.id].complete; }).length;
        fill(g.el, ui.badge(n + ' of ' + g.members.length + ' done', n === g.members.length ? 'ok' : 'neutral'));
      });
      /* Core = scored scales plus official forms in the core list (complete once a result is entered). */
      var basis = coreList.length ? coreList : list;
      var done = basis.filter(function (t) { return results[t.id] && results[t.id].complete; }).length;
      var pos = list.filter(function (t) { return isPositive(results[t.id]); });
      progText.textContent = countText(done, basis.length, coreList.length ? 'complete' : 'recorded');
      fill(progMeter, ui.progress(done, basis.length, coreList.length ? 'Core scales complete' : 'Scales recorded'));
      fill(resSide, done === basis.length ? ui.badge(coreList.length ? 'Core complete' : 'All recorded', 'ok') : ui.badge(countText(done, basis.length), 'neutral'));
      var sig = pos.map(function (t) { return t.id; }).join(',');
      if (sig !== posSig) {
        posSig = sig;
        fill(posHost, pos.length ? [
          h('ul', { class: 'as-poslist' }, pos.map(function (t) {
            return h('li', null, h('button', { type: 'button', class: 'ds-chip as-poschip', onclick: function () { openTool(t.id); } },
              h('span', { class: 'as-posdot', 'aria-hidden': 'true' }), t.abbr || t.id, h('span', { class: 'sr-only' }, ': open the questionnaire')));
          })),
          o.points ? ui.btn({ label: 'Review in differentials', kind: 'ghost', small: true, onClick: function () { ctx.go('ddx'); } }) : null
        ] : h('span', { class: 'muted' }, 'None so far.'));
      }
      live.textContent = (coreList.length ? 'Core scales complete: ' : 'Scales recorded: ') + done + ' of ' + basis.length + '. ' +
        (pos.length ? 'Positive: ' + pos.map(function (t) { return t.abbr || t.id; }).join(', ') + '.' : 'No positive screens so far.');
    }
    update();
    ctx.onChange('tools', U.debounce(function () { if (el.isConnected) update(); }, 60));
    return { update: update };
  }

  /* ---------- 1. Before you start ---------- */

  var SEXES = [['', 'Not recorded'], ['Female', 'Female'], ['Male', 'Male'], ['Intersex', 'Intersex'], ['Prefer not to say', 'Prefer not to say']];
  var PRESENT = [['patient', 'The patient'], ['partner', 'Partner'], ['parent', 'Parent or carer'], ['sibling', 'Brother or sister']];
  var PRESENT_YOUNG = [['patient', 'The child or young person'], ['parent', 'Parent or carer'], ['sibling', 'Brother or sister'],
    ['teacher', 'Teacher or school (form, report or phone call)']];
  var PREP = [
    ['questionnaires', 'Pre-appointment questionnaires returned and checked'],
    ['informant', 'Informant here today, or can be contacted later'],
    ['school', 'School reports or early records to hand, or requested'],
    ['time', 'Enough time booked (allow 1.5 to 3 hours)'],
    ['room', 'Quiet, private room with few interruptions'],
    ['records', 'Referral letter, previous records and assessments reviewed'],
    ['physical', 'Physical health baseline possible (pulse, blood pressure, weight, height)']
  ];
  var PREP_YOUNG = [
    ['questionnaires', 'Parent and teacher rating scales returned and checked (for example Conners 4 or SNAP-IV, and the SDQ)'],
    ['school', 'Current school report with work samples to hand, or requested'],
    ['informant', 'Parent or carer here today, and a teacher who can be contacted'],
    ['pr', 'Checked who has parental responsibility and who can consent'],
    ['time', 'Enough time booked, with breaks'],
    ['room', 'Quiet, child-friendly room, with something for the child to do with their hands'],
    ['records', 'Referral letter and previous records reviewed (for example health visitor, GP, speech and language therapy, educational psychology, CAMHS)'],
    ['physical', 'Physical baseline possible: pulse and blood pressure with the right cuff size, height and weight against the normal range for age']
  ];
  /* The checklist grouped by when it is done. Keys not listed here fall into the last group. */
  var PREP_GROUPS = [
    { title: 'Before the appointment', sub: 'Forms, records and booking.', keys: ['questionnaires', 'records', 'school', 'pr', 'time'] },
    { title: 'On the day', sub: 'People, the room and the physical checks.', keys: ['informant', 'room', 'physical'] }
  ];
  var SEN = [{ v: 'none', l: 'None' }, { v: 'sen_support', l: 'SEN support' }, { v: 'ehcp', l: 'EHCP' }];

  /* Consent basis for a young person. It depends on age (under 16, or 16 to 17), not the band: 16 sits inside the 12-16 band.
     From 16, "lacks capacity" is its own value (lacks_capacity_16), never parent_assent: assent is for under-16s. */
  function consentOptions(age) {
    if (age !== null && age >= 16) return [
      { v: 'capacity_16', l: 'Young person consents', d: 'From 16, a young person is presumed to have capacity to consent for themselves (in Scotland they have full legal capacity at 16). Involve parents or carers as they agree.' },
      { v: 'lacks_capacity_16', l: 'Lacks capacity for this decision', d: 'Capacity was assessed and the young person lacks it for this decision. In England and Wales, a person with parental responsibility can consent in their best interests, or the decision is made in their best interests under the Mental Capacity Act 2005. In Scotland, the Adults with Incapacity (Scotland) Act 2000 applies. In Northern Ireland, a parent can consent in their best interests. Follow local policy, record the capacity assessment, and involve the young person as far as they can.' }
    ];
    return [
      { v: 'parent_assent', l: 'Parent consents, child assents', d: 'A person with parental responsibility consents. The child agrees to take part (assent) after an explanation they understand.' },
      { v: 'gillick', l: 'Gillick competent', d: 'The young person understands what the assessment involves and consents for themselves (Gillick competence). Involve parents or carers as they agree.' }
    ];
  }

  /* What to say at the start. The parent or carer and the child or young person each get their own version. */
  function adultScript() {
    return {
      intro: 'Thank you for coming. Before we start, I will explain how today works.',
      items: [
        'I will ask about things like concentration, getting organised, restlessness and acting on the spur of the moment.',
        'First we talk about the last six months. Then we go back to when you were at primary school, roughly age 5 to 12.',
        'For each question I will ask for real examples from your own life. Examples help me understand what it is like for you.',
        'With your permission, I would also like to hear from someone who knew you as a child, or knows you well now.',
        'It usually takes between one and a half and three hours. We can take a break whenever you need one.',
        'This is a conversation, not a test. There are no right or wrong answers. "I don\'t know" or "I can\'t remember" are fine answers.',
        'At the end I will tell you what I think, or explain what else I need before I can give you an answer.',
        'What you tell me is confidential. The exception is if I am worried about your safety or someone else\'s: then I may need to share it.'
      ],
      outro: 'Do you have any questions before we begin?'
    };
  }
  function parentScript(band) {
    var child = band === 'child';
    return {
      intro: 'Thank you for coming. Before we start, I will explain how today works.',
      items: [
        'I will ask about your child\'s concentration, activity, organisation and acting without thinking: at home, at school and with friends.',
        child ? 'We will focus on the last six months, and on when you first noticed these things.'
          : 'We will talk about the last six months, and then about what your child was like at primary school, before age 12.',
        'For each area I will ask for real, recent examples. Examples help me more than labels.',
        'With your consent, I would also like information from school, such as a teacher\'s report or rating scale.',
        'I will ask about development, health and family history, and how things are for you and the family, because that matters too.',
        child ? 'I would like to hear your child\'s own view, in a way that suits their age.'
          : 'I would like to talk with your child on their own for part of the time. This is a normal part of the assessment.',
        'Rating scales help, but no single form or test gives the answer. I will put everything together before I give an opinion.',
        'At the end I will tell you what I think, or explain what else I need before I can give an answer.',
        'What you tell me is confidential. The exception is if I am worried about your child\'s safety or someone else\'s: then I may need to share it.'
      ],
      outro: 'Do you have any questions before we begin?'
    };
  }
  function youngScript(band) {
    if (band === 'child') return {
      intro: 'Hello. My job is to find out what things are like for you at home and at school.',
      items: [
        'I will ask you some questions. There are no right or wrong answers, and you are not in trouble.',
        'I will also talk to the grown-ups who look after you and, if they agree, to your teacher.',
        'You can say "I don\'t know". You can ask for a break whenever you need one.',
        'You can draw or play while we talk.'
      ],
      outro: 'Is there anything you want to ask me?'
    };
    return {
      intro: 'Thanks for coming. I want to understand what things are like for you at school, at home and with friends.',
      items: [
        'I will ask about concentration, getting organised, restlessness and doing things on the spur of the moment.',
        'Your own view matters. I will ask you, as well as your parent or carer and your school.',
        'Part of the time I would like to talk with you on your own.',
        'What you tell me is private. The exception is if I am worried about your safety or someone else\'s. If that happens, I will talk to you first about who needs to know, where I can.',
        'There are no right or wrong answers. "I don\'t know" is fine, and you can take a break at any time.'
      ],
      outro: 'Do you have any questions before we start?'
    };
  }
  /* A script to read aloud: the opening line, the points in order, then the question to close. */
  function scriptBox(s) {
    return h('div', { class: 'as-script' },
      h('p', { class: 'as-script-say' }, s.intro),
      h('ol', { class: 'as-script-list' }, s.items.map(function (x) { return h('li', null, x); })),
      h('p', { class: 'as-script-say' }, s.outro));
  }

  var SETUP_SRC_YOUNG = [
    'NICE NG87 1.3.1 (full assessment with observer reports), 1.3.2 (rating scales such as the Conners and SDQ are added tools; school observation when in doubt), 1.3.4 (assess the parents\' or carers\' mental health), 1.3.6 (take the child\'s or young person\'s views into account), 1.4.12 (consent before contacting the school), 1.7.4 (baseline height, weight, pulse and blood pressure)',
    'Gillick v West Norfolk and Wisbech AHA [1986] AC 112 (consent under 16)',
    'Mental Capacity Act 2005, England and Wales (presumed capacity from 16)',
    'Age of Legal Capacity (Scotland) Act 1991 s1 (full legal capacity at 16); Adults with Incapacity (Scotland) Act 2000',
    'Age of Majority Act (Northern Ireland) 1969 (consent at 16 and 17)',
    'GMC 0-18 years: guidance for all doctors, paragraph 28 and footnote 8 (16 and 17-year-olds who lack capacity, by UK nation)',
    'Children Act 1989 (parental responsibility; looked-after children)',
    'Clinical practice: seeing a young person on their own for part of the assessment; checking local consent policy and the law where you work'
  ];

  AA.steps.setup = { render: function (el, ctx) {
    if (!ctx.get('patient.date')) ctx.set('patient.date', U.today());

    /* What this step needs (mirrors AA.diagnosis.stepProgress: reference, age, consent). */
    var todo = h('div', { class: 'as-todo', 'aria-live': 'polite' });
    function renderTodo() {
      var q = ctx.get('patient', {}) || {};
      U.clear(todo);
      todo.appendChild(h('span', { class: 'as-todo-k' }, bandOf(ctx.a()) === 'under6' ? 'Needed for the referral' : 'Needed to complete this step'));
      [['Reference', !!q.ref], ['Age', !!q.age], ['Consent', !!q.consent]].forEach(function (x) {
        todo.appendChild(h('span', { class: 'as-req' + (x[1] ? ' is-done' : '') }, h('span', { class: 'as-req-i', 'aria-hidden': 'true' }, x[1] ? '✓' : ''), x[0],
          h('span', { class: 'sr-only' }, x[1] ? ', done' : ', to do')));
      });
    }
    el.appendChild(todo);

    /* Card 1, the patient: age first (everything below adapts to the age group), then the details. */
    var p0 = ctx.get('patient', {}) || {};
    var ageIn = ui.input({ type: 'number', inputmode: 'numeric', min: 0, max: 120, value: p0.age === null || p0.age === undefined ? '' : p0.age,
      onSave: function (v) { var n = parseInt(v, 10); ctx.set('patient.age', isNaN(n) || n < 0 ? null : n); } });
    var bandHost = h('div', { class: 'as-bandhost', 'aria-live': 'polite' });
    var detailsHost = h('div', { class: 'as-details' });
    var patientSide = h('span');
    var patientCard = card({ icon: 'file', title: 'Patient', sub: 'Enter the age first. The steps adapt to the age group.', side: patientSide, cls: 'as-agecard' }, [
      h('div', { class: 'as-agerow' }, h('div', { class: 'as-agefield' }, ui.field('Age (years)', ageIn)), bandHost),
      detailsHost]);
    el.appendChild(patientCard);

    var body = h('div', { class: 'as-setup' });
    el.appendChild(body);

    var bandSig = null, layout = null, api = {};

    function paintPatient() {
      var q = ctx.get('patient', {}) || {};
      fill(patientSide, q.ref && q.age ? ui.badge('✓ Done', 'ok') : ui.badge(!q.ref && !q.age ? 'Reference and age needed' : !q.ref ? 'Reference needed' : 'Age needed', 'warn'));
    }

    function renderBand(a) {
      var band = bandOf(a), age = ageOf(a), need = needOf(a);
      var sig = band + '|' + need + '|' + (age === null);
      if (sig === bandSig) return;
      bandSig = sig;
      U.clear(bandHost);
      if (age === null) {
        bandHost.appendChild(h('p', { class: 'hint as-bandnone' }, 'Adults are 18 and over. Young people aged 6 to 17 get versions of each step for the parent or carer, the school and the young person. For a child under 6, the app advises referral.'));
        return;
      }
      var info = bandInfo(a);
      var label = info.label || BAND_LABEL[band] || band;
      if (band === 'under6') {
        bandHost.appendChild(h('div', { class: 'as-band as-band-stop' },
          h('p', { class: 'as-band-k' }, ui.badge(label, 'err'), h('span', null, 'Refer: this workspace covers ages 6 and over.'))));
        return;
      }
      var young = band !== 'adult';
      bandHost.appendChild(h('div', { class: 'as-band' + (young ? ' as-band-young' : '') },
        h('p', { class: 'as-band-k' }, ui.badge(label, young ? 'accent' : 'neutral'), young ? h('span', null, 'Young person mode') : null),
        info.note ? h('p', null, info.note) : null,
        young ? h('p', null, 'DSM-5-TR needs ' + need + ' symptoms in a domain at this age. The scoring applies this automatically.') : null,
        band === 'child' ? h('p', { class: 'hint' }, 'From 6 to 11, "now" and "before age 12" are the same period, so the interview asks about the last six months only.') : null));
    }

    function stopCard(a) {
      var info = bandInfo(a);
      return card({ icon: 'alert', tone: 'err', title: 'Under 6: refer, do not assess here', sub: info.note || 'Refer to a service with expertise in ADHD in young children.' }, [
        ui.list([
          'This workspace covers people aged 6 and over. Do not continue the assessment steps here.',
          'Record the referral below: the concerns, how they affect the child and family at home and at nursery or school, the support already tried, whether parent training was offered, and any safeguarding concern.',
          'Act on any safety or safeguarding concern today, under local procedures, and record it in the safety step.',
          'The Report step builds a short referral note from what you record here.',
          'If the age is wrong, correct it above and the steps will open again.'
        ], 'list as-stoplist'),
        h('div', { class: 'row as-actions' },
          ui.btn({ label: 'Open the referral note', kind: 'primary', onClick: function () { ctx.go('report'); } }),
          ui.btn({ label: 'Safety and safeguarding', kind: 'ghost', onClick: function () { ctx.go('risk'); } }),
          ui.btn({ label: 'Change the age', kind: 'ghost', onClick: function () { try { ageIn.focus(); ageIn.select(); } catch (e) { /* ignore */ } } })),
        sourcesBox(srcList(info.src) || ['NICE NG87 1.5.7 to 1.5.9 (ADHD in children under 5)', 'Clinical practice: this workspace covers ages 6 and over'])]);
    }
    /* Under 6: the details a referral needs (reference, referrer, reason, who gave information, consent and the
       referral notes). No assessment fields. */
    function referralCard() {
      var p = ctx.get('patient', {}) || {}, y = p.young || {}, inf = p.informants || {};
      function text(key, ph, rows) { return ui.input({ value: p[key], placeholder: ph, rows: rows, onSave: function (v) { ctx.set('patient.' + key, key === 'ref' ? v.trim() : v); } }); }
      var refIn = text('ref', 'For example AB0412 or J.S.');
      refIn.setAttribute('aria-required', 'true');
      return card({ icon: 'route', title: 'Referral details', sub: 'What the receiving service needs to know.' }, [
        h('div', { class: 'form-grid' },
          ui.field('Reference or initials', refIn, 'Required. Never a name or NHS number.'),
          ui.field('Referred by', text('referrer', 'For example GP, health visitor, nursery, paediatrician')),
          ui.field('Date', ui.input({ type: 'date', value: p.date || U.today(), onSave: function (v) { ctx.set('patient.date', v || undefined); } })),
          ui.field('Who has parental responsibility', ui.input({ value: y.pr, placeholder: 'For example both parents, a special guardian', onSave: function (v) { ctx.set('patient.young.pr', v); } })),
          h('div', { class: 'as-span' }, ui.field('Reason for referral', text('reason', 'The main concerns, in the parent\'s or carer\'s words', 3))),
          h('div', { class: 'as-span' }, ui.field('Referral notes', text('referralNotes', 'Concerns; impact at home and at nursery or school; support already tried; whether ADHD-focused group parent training was offered; any safeguarding concern and what you did', 6)))),
        group('Who gave information', pills(PRESENT_YOUNG.map(function (x) {
          return ui.check({ label: x[0] === 'patient' ? 'The child' : x[0] === 'teacher' ? 'Nursery or school' : x[1], checked: !!inf[x[0]], onChange: function (v) { ctx.set('patient.informants.' + x[0], v); } });
        }))),
        confirmRow(ui.check({ label: 'A person with parental responsibility consents to the referral', hint: 'Record who consented. If consent is not given, note why and act on any safeguarding concern anyway.',
          checked: !!p.consent, onChange: function (v) { ctx.set('patient.consent', v); } }))]);
    }

    /* The rest of the step, built for the current age group. Rebuilt only when the layout changes. */
    function build() {
      var a = ctx.a() || {};
      renderBand(a);
      var band = bandOf(a), age = ageOf(a);
      var key = band + '|' + (age !== null && age < 16 ? 'u16' : 'o16') + '|' + (age !== null && age >= 12 ? '12' : '');
      if (key === layout) return;
      layout = key;
      U.clear(body);
      U.clear(detailsHost);
      api = {};
      if (band === 'under6') { body.appendChild(stopCard(a)); body.appendChild(referralCard()); return; }
      details(isYoung(a), band, age);
    }

    function details(young, band, age) {
      var p = ctx.get('patient', {}) || {};
      var y = p.young || {};

      /* Patient details, inside the patient card under the age. */
      var refMsg = h('p', { class: 'as-warnmsg', id: ui.nid('refmsg'), 'aria-live': 'polite' });
      var refHint = h('p', { class: 'hint', id: ui.nid('refhint') }, 'Required. Never a name or NHS number.');
      var refIn = ui.input({ value: p.ref, placeholder: 'For example AB0412 or J.S.', onSave: function (v) { ctx.set('patient.ref', v.trim()); refCheck(); } });
      refIn.setAttribute('aria-required', 'true');
      refIn.setAttribute('aria-describedby', refHint.id + ' ' + refMsg.id);
      var refField = ui.field('Reference or initials', refIn);
      refField.appendChild(refHint);
      refField.appendChild(refMsg);
      function refCheck() {
        var v = String(ctx.get('patient.ref', '') || '').trim();
        refMsg.textContent = /\d{3}\s?\d{3}\s?\d{4}/.test(v) ? 'This looks like an NHS number. Use a local reference instead.'
          : /^[A-Z][a-z]+\s+[A-Z][a-z'-]+$/.test(v) ? 'This looks like a full name. Use initials or a reference.' : '';
      }
      refCheck();

      var sexSel = h('select', null, SEXES.map(function (o) { return h('option', { value: o[0], selected: (p.sex || '') === o[0] }, o[1]); }));
      sexSel.addEventListener('change', function () { ctx.set('patient.sex', sexSel.value); });

      function text(key, ph, rows) {
        return ui.input({ value: p[key], placeholder: ph, rows: rows, onSave: function (v) { ctx.set('patient.' + key, v); } });
      }
      function ytext(key, ph, rows) {
        return ui.input({ value: y[key], placeholder: ph, rows: rows, onSave: function (v) { ctx.set('patient.young.' + key, v); } });
      }
      detailsHost.appendChild(h('div', { class: 'form-grid as-detailgrid' },
        refField,
        ui.field('Sex', sexSel),
        ui.field('Gender identity (optional)', text('gender', 'How the patient describes themselves')),
        young ? ui.field('School', ytext('school', 'For example: primary school, secondary school, college')) : ui.field('Occupation', text('occupation', 'For example nurse, student, between jobs')),
        young ? ui.field('Year group', ytext('year', 'For example Year 4')) : null,
        ui.field('Referred by', text('referrer', young ? 'For example GP, school, paediatrician, CAMHS' : 'For example GP, self-referral, CAMHS transition')),
        ui.field('Date of assessment', ui.input({ type: 'date', value: p.date || U.today(), onSave: function (v) { ctx.set('patient.date', v || undefined); } })),
        h('div', { class: 'as-span' }, ui.field('Reason for referral', text('reason', young
          ? 'The main concerns in the referral, in the parent\'s or carer\'s words and in the child\'s own words'
          : 'The main concerns in the referral and in the patient\'s own words', 3)))));

      /* Card 2: who gives information, and what you have. */
      var inf = p.informants || {}, src = p.sources || {};
      var whoList = young ? PRESENT_YOUNG : PRESENT;
      body.appendChild(card({ icon: 'users', title: young ? 'Who gives information' : 'Informants and records',
        sub: young ? 'Hear from home and from school about how things are now, and hear the child\'s or young person\'s own view. If someone is not here, note how you will contact them.'
          : 'The most useful informant knew the patient before age 12. If nobody is here, note who could be contacted.' }, [
        h('div', { class: 'as-cols' },
          group(young ? 'Informants' : 'Present today', [
            pills(whoList.map(function (x) {
              return ui.check({ label: x[1], checked: !!inf[x[0]], onChange: function (v) { ctx.set('patient.informants.' + x[0], v); } });
            })),
            ui.field('Someone else (who)', ui.input({ value: inf.other, placeholder: young ? 'For example foster carer, grandparent, SENCO, social worker' : 'For example friend, support worker',
              onSave: function (v) { ctx.set('patient.informants.other', v.trim()); } }))]),
          group(young ? 'School and records' : 'Records to hand', [
            young ? ui.seg({ label: 'Special educational needs', options: SEN, value: y.sen || null, onChange: function (v) { ctx.set('patient.young.sen', v); } }) : null,
            young ? h('p', { class: 'hint as-senhint' }, 'SEN support is extra help from the school. An EHCP (education, health and care plan, England) is a legal plan from the local authority.') : null,
            rows([
              ui.check({ label: young ? 'School reports and work samples' : 'School reports', hint: young ? 'The current report, attendance and any exclusions. Earlier reports if concerns started sooner.' : 'Primary school reports are the most useful.',
                checked: !!src.schoolReports, onChange: function (v) { ctx.set('patient.sources.schoolReports', v); } }),
              ui.check({ label: 'Previous records or assessments', hint: young ? 'For example health visitor or GP records, speech and language therapy, educational psychology or CAMHS letters.' : 'For example GP records, CAMHS letters, educational psychology reports.',
                checked: !!src.previousRecords, onChange: function (v) { ctx.set('patient.sources.previousRecords', v); } })])])),
        h('div', { class: 'as-cardfoot' }, ui.check({ label: 'Interpreter needed', hint: young ? 'Book a professional interpreter. Avoid family members, and never the child, interpreting.' : 'Book a professional interpreter. Avoid family members interpreting.',
          checked: !!p.interpreter, onChange: function (v) { ctx.set('patient.interpreter', v); } }))]));

      /* Card 3: explain, and record consent. */
      var consentSide = h('span', { 'aria-live': 'polite' });
      if (!young) {
        body.appendChild(card({ icon: 'shield', title: 'Explain the interview', sub: 'Read this aloud or say it in your own words.', side: consentSide }, [
          scriptBox(adultScript()),
          confirmRow(ui.check({ label: 'Patient understands the purpose and agrees to the assessment', hint: 'Record verbal consent. If the patient does not agree, stop and note why.',
            checked: !!p.consent, onChange: function (v) { ctx.set('patient.consent', v); } }))]));
        api.paint = function () {
          var q = ctx.get('patient', {}) || {};
          fill(consentSide, q.consent ? ui.badge('✓ Consent recorded', 'ok') : ui.badge('Consent needed', 'warn'));
        };
      } else {
        /* Explain the assessment: one version for the parent or carer, one for the child or young person. */
        body.appendChild(card({ icon: 'info', title: 'Explain the assessment', sub: 'Read these aloud or say them in your own words. Use the version for the person you are talking to.' },
          ui.tabs([
            { id: 'parent', label: 'To the parent or carer', render: function () { return scriptBox(parentScript(band)); } },
            { id: 'young', label: band === 'child' ? 'To the child' : 'To the young person', render: function () { return scriptBox(youngScript(band)); } }
          ], 'parent')));

        /* Parental responsibility and consent */
        var copts = consentOptions(age);
        /* Older records stored "lacks capacity" at 16 or 17 as parent_assent: show it as that choice. */
        var basisOf = function (v) { return v === 'parent_assent' && age !== null && age >= 16 ? 'lacks_capacity_16' : v; };
        var basisDesc = h('p', { class: 'hint as-basisdesc', 'aria-live': 'polite' });
        var basisMsg = h('p', { class: 'as-warnmsg', 'aria-live': 'polite' });
        var consentMsg = h('p', { class: 'as-warnmsg', 'aria-live': 'polite' });
        var swField = h('div', { class: 'as-subfield', hidden: !y.lac },
          ui.field('Social worker', ui.input({ value: y.socialWorker, placeholder: 'Team and how to contact them', onSave: function (v) { ctx.set('patient.young.socialWorker', v); } })));
        api.paint = function () {
          var q = ctx.get('patient', {}) || {};
          var yy = q.young || {};
          var v = basisOf(yy.consentBasis) || null;
          var cur = copts.filter(function (o) { return o.v === v; })[0];
          basisDesc.textContent = cur ? cur.d : 'Choose how consent was given. Check local policy and the law where you work.';
          basisMsg.textContent = v && !cur ? 'The consent basis recorded does not fit this age. Choose it again.' : '';
          consentMsg.textContent = q.consent && !cur ? 'Record the consent basis above.' : '';
          swField.hidden = !yy.lac;
          fill(consentSide, q.consent && cur ? ui.badge('✓ Consent recorded', 'ok') : q.consent ? ui.badge('Basis needed', 'warn') : ui.badge('Consent needed', 'warn'));
        };
        body.appendChild(card({ icon: 'shield', title: 'Parental responsibility and consent', sub: 'Who can consent, on what basis, and what the child or young person agrees to.', side: consentSide }, [
          group('Who can consent', [
            h('div', { class: 'as-narrow' }, ui.field('Who has parental responsibility', ytext('pr', 'For example both parents, a special guardian, or the local authority with the parents'),
              'Check who can consent before you start.')),
            rows([ui.check({ label: 'Looked after by the local authority', hint: 'Who can consent depends on the legal order. Record the social worker.', checked: !!y.lac,
              onChange: function (v) { ctx.set('patient.young.lac', v); } })]),
            swField]),
          group('Consent basis', [
            ui.seg({ label: 'Consent basis', hideLabel: true, options: copts.map(function (o) { return { v: o.v, l: o.l }; }), value: basisOf(y.consentBasis) || null,
              onChange: function (v) { ctx.set('patient.young.consentBasis', v); } }),
            basisDesc, basisMsg]),
          group('Agreement and school contact', rows([
            ui.check({ label: 'The child or young person agrees to take part (assent)', hint: 'Explain in words they understand and record their view. If they do not want to take part, pause and talk it through.',
              checked: !!y.assent, onChange: function (v) { ctx.set('patient.young.assent', v); } }),
            age !== null && age >= 12 ? ui.check({ label: 'Seen on their own for part of the assessment', hint: 'Explain confidentiality and its limits first.',
              checked: !!y.seenAlone, onChange: function (v) { ctx.set('patient.young.seenAlone', v); } }) : null,
            ui.check({ label: 'Consent to contact the school', hint: 'For a teacher report or rating scale now, and later to share the outcome and support plan.',
              checked: !!y.schoolConsent, onChange: function (v) { ctx.set('patient.young.schoolConsent', v); } })])),
          confirmRow([
            ui.check({ label: 'Consent given on the basis above', hint: 'Record who gave consent and what was agreed. If consent is not given, stop and note why.',
              checked: !!p.consent, onChange: function (v) { ctx.set('patient.consent', v); } }),
            consentMsg])]));
      }
      api.paint();

      /* Card 4: preparation, grouped by when it is done. */
      var PL = young ? PREP_YOUNG : PREP;
      var prepSide = h('span', { 'aria-live': 'polite' });
      var prepMeter = h('div', { class: 'as-meter as-prepmeter' });
      var prep = ctx.get('patient.prep', {}) || {};
      var used = [], grpCounts = [];
      var grpEls = PREP_GROUPS.map(function (g, gi) {
        var its = g.keys.map(function (k) { return PL.filter(function (x) { return x[0] === k; })[0]; }).filter(Boolean);
        if (gi === PREP_GROUPS.length - 1) its = its.concat(PL.filter(function (x) { return used.concat(its.map(function (i) { return i[0]; })).indexOf(x[0]) < 0; }));
        its.forEach(function (x) { used.push(x[0]); });
        if (!its.length) return null;
        var n = h('span');
        grpCounts.push({ el: n, its: its });
        return group(g.title, rows(its.map(function (x) {
          return ui.check({ label: x[1], checked: !!prep[x[0]], onChange: function (v) { ctx.set('patient.prep.' + x[0], v ? true : undefined); } });
        })), { side: n, sub: g.sub });
      });
      body.appendChild(card({ icon: 'list', title: 'Have you got everything?', side: prepSide,
        sub: 'Missing something is not a reason to stop. Note it, and plan how to fill the gap (for example, phone ' + (young ? 'the school' : 'an informant') + ' later).' }, [
        prepMeter, h('div', { class: 'as-cols' }, grpEls)]));
      api.renderPrep = function () {
        var pr = ctx.get('patient.prep', {}) || {};
        var n = PL.filter(function (x) { return pr[x[0]]; }).length;
        fill(prepSide, ui.badge(n + ' of ' + PL.length + ' ready', n === PL.length ? 'ok' : 'neutral'));
        fill(prepMeter, ui.progress(n, PL.length, 'Preparation checklist'));
        grpCounts.forEach(function (g) { g.el.textContent = countText(g.its.filter(function (x) { return pr[x[0]]; }).length, g.its.length); });
      };
      api.renderPrep();

      if (young) body.appendChild(h('div', { class: 'as-srcend' }, sourcesBox(SETUP_SRC_YOUNG.concat(srcList(bandInfo(ctx.a()).src) || []))));
    }

    build();
    renderTodo();
    paintPatient();
    ctx.onChange('patient', U.debounce(function () {
      if (!el.isConnected) return;
      build();
      renderTodo();
      paintPatient();
      if (api.renderPrep) api.renderPrep();
      if (api.paint) api.paint();
    }, 60));
  } };

  /* ---------- 2. Screening questionnaires ---------- */

  AA.steps.screen = { render: function (el, ctx) {
    var ids = stepToolIds(ctx.a(), 'screen');
    var core = ids.core;
    var all = ids.all.concat(core.filter(function (id) { return ids.all.indexOf(id) < 0; }));
    var list = toolList(all);
    function optional(t) { return core.indexOf(t.id) < 0; }
    if (!ids.young) {
      questionnaireStep(el, ctx, {
        tools: list,
        optional: optional,
        intro: ui.callout('info', h('p', null, 'Rating scales support the assessment but never make the diagnosis. A positive screen means "assess carefully". A negative screen does not rule ADHD out, especially in people who mask or have little insight.'), 'Scales support, the interview decides'),
        groups: [
          { title: 'Core scales', hint: 'Ideally completed before the appointment. Go through the answers with the patient and ask for an example of any high score.', filter: function (t) { return !optional(t); } },
          { title: 'Optional scales', hint: 'Use these when they add something to the picture.', filter: optional }
        ]
      });
      return;
    }
    questionnaireStep(el, ctx, {
      tools: list,
      optional: optional,
      intro: ui.callout('info', h('div', null,
        h('p', null, 'Parent and teacher rating scales are helpful added tools, but they never make the diagnosis on their own. A negative scale does not rule ADHD out.'),
        h('p', null, 'Ask for forms from home and from school. When raters disagree, ask each of them for recent examples: the gap is information, not a verdict.')), 'Scales support, the interview decides'),
      groups: [
        { title: 'Core scales', hint: 'Complete these for everyone at this age.', filter: function (t) { return !optional(t); } },
        { title: 'Rating scales', hint: 'Ideally completed before the appointment by a parent or carer and by a teacher. Licensed scales are not reproduced here: score the official form, then enter the result.', filter: optional }
      ],
      emptyTitle: 'No rating scales listed for this age',
      emptyBody: 'Use your service\'s usual parent and teacher forms and record the results in your notes.',
      sources: h('div', { class: 'as-srcend' }, sourcesBox(['NICE NG87 1.3.1 (observer reports), 1.3.2 (rating scales such as the Conners and SDQ are added tools; school observation when in doubt)', 'Licences and official forms: see each tool\'s licence line']))
    });
  } };

  /* ---------- 3. Safety and risk ---------- */

  var LEVELS = [
    { id: 'urgent', badge: 'Urgent', kind: 'err', title: 'Act today' },
    { id: 'high', badge: 'High', kind: 'warn', title: 'Act and plan' },
    { id: 'note', badge: 'Note', kind: 'info', title: 'Note for the plan' }
  ];
  function levelOf(it) { return it.level === 'urgent' || it.level === 'high' ? it.level : 'note'; }

  AA.steps.risk = { render: function (el, ctx) {
    var R = AA.data.risk || {};
    var a0 = ctx.a();
    /* Under 6 the safety step records the child's safety and safeguarding for the referral note: the young items. */
    var young = isYoung(a0) || bandOf(a0) === 'under6', age = ageOf(a0), band = bandOf(a0);
    var items = (R.items || []).filter(function (it) { return fitsGroup(it, young, band); });
    /* Ask list: a young version when the data has one; items may also be {q, ages, bands} objects. */
    var askSrc = arr(pick(R, 'ask', young)) || [];
    var ask = askSrc.filter(function (q) { return typeof q === 'string' || fitsGroup(q, young, band); })
      .map(function (q) { return typeof q === 'string' ? q : (q.q || q.t || ''); }).filter(Boolean);
    var riskActions = arr(pick(R, 'actions', young)) || [];
    var cssrs = AA.byId('tools', 'cssrs');
    if (cssrs && young && !fitsAge(cssrs, age, true, true)) cssrs = null;

    el.appendChild(ui.callout('warn', h('p', null, young
      ? 'Ask about safety early, and again if anything changes. This includes the child\'s or young person\'s own safety at home, at school, online and in the community. If there is immediate risk, pause the ADHD assessment and follow your local crisis or safeguarding pathway.'
      : 'Ask about safety early, and again if anything changes. If there is immediate risk, pause the ADHD assessment and follow your local crisis pathway.'), 'Safety first'));

    /* Card 1: the questions. */
    var intro = pick(R, 'intro', young);
    el.appendChild(card({ icon: 'search', title: 'Ask about safety',
      sub: young ? 'Ask the parent or carer, and ask the child or young person in words that suit their age. Where you can, see a young person on their own for part of this.'
        : 'Ask each question in your own words. Record what you find in the next card.' }, [
      ask.length ? h('ol', { class: 'as-asklist' }, ask.map(function (q) { return h('li', null, q); }))
        : h('p', { class: 'muted' }, 'Risk prompts are not available in this build. Use your local risk assessment.'),
      intro ? fold('Why this matters', h('p', { class: 'as-foldp' }, intro)) : null]));

    /* Card 2: findings, grouped by level. Ticks are stored as risk.<itemId> = true. */
    var alerts = h('div', { class: 'as-alerts' });
    var findSide = h('span', { 'aria-live': 'polite' });
    var levelCounts = [];
    var levelEls = LEVELS.map(function (lv) {
      var its = items.filter(function (it) { return levelOf(it) === lv.id; });
      if (!its.length) return null;
      var n = h('span');
      levelCounts.push({ el: n, its: its });
      return h('div', { class: 'as-grp as-level as-level-' + lv.id },
        h('div', { class: 'as-grp-head' }, h('h3', { class: 'as-grp-t' }, ui.badge(lv.badge, lv.kind), h('span', null, lv.title)), h('span', { class: 'as-grp-n' }, n)),
        rows(its.map(function (it) {
          return ui.check({ label: it.text || it.short || it.id, checked: !!ctx.get('risk.' + it.id),
            onChange: function (v) { ctx.set('risk.' + it.id, v ? true : undefined); renderAlerts(); } });
        })));
    });
    el.appendChild(card({ icon: 'flag', title: 'What did you find?', side: findSide,
      sub: young ? 'Tick anything the child or young person, the parent or carer, or the school describes. Actions appear below as you tick.'
        : 'Tick anything the patient describes. Actions appear below as you tick.' }, [
      items.length ? levelEls : h('p', { class: 'muted' }, 'No risk items available. Record what you found in the notes.'),
      alerts]));

    /* Card 3: the C-SSRS screen, when the tools library has it (and, for young people, it covers their age).
       Its questions fold away once the screen is complete; the result shows on the card. */
    var csSide = h('span', { 'aria-live': 'polite' }), csMeta = h('span');
    if (cssrs) {
      var csBody;
      if (hasItems(cssrs)) {
        var r0 = cssrsResult();
        csBody = lazyDetails('Questions', function (body) {
          body.appendChild(h('div', { class: 'as-qwrap' }, AA.components.questionnaire(cssrs, {
            answers: ctx.get('tools.cssrs.answers', {}) || {},
            onAnswer: function (n, v) { ctx.set('tools.cssrs.answers.' + n, v === null ? undefined : v); renderAlerts(); }
          })));
        }, { open: !(r0 && r0.complete), meta: csMeta, cls: 'as-fold as-csfold' });
      } else {
        csBody = ui.callout('info', h('p', null, 'Not reproduced here. Use the official form and record the result in the notes.'));
      }
      el.appendChild(card({ icon: 'shield', title: cssrs.name || cssrs.abbr || 'C-SSRS', sub: toolFacts(cssrs), side: csSide }, [
        toolAbout(cssrs),
        csBody,
        h('div', { class: 'row as-foot' }, ui.btn({ label: 'Scoring guide in the tools library', kind: 'quiet', small: true, go: 'tool-cssrs' }))]));
    }

    /* Card 4: notes, the plan, and the tick that completes the step. */
    var actionHint = h('p', { class: 'as-warnmsg', 'aria-live': 'polite' });
    var revSide = h('span', { 'aria-live': 'polite' });
    el.appendChild(card({ icon: 'file', title: 'Notes and plan', sub: 'What was said, what you did, and your confirmation.', side: revSide }, [
      h('div', { class: 'as-fieldstack' },
        ui.field(young ? 'What the young person and the parent or carer said' : 'What the patient said', ui.input({ rows: 3, value: ctx.get('risk.notes', ''),
          placeholder: young ? 'Their words, protective factors, who is around them, any professionals involved.' : 'Their words, protective factors, supports, access to means.',
          onSave: function (v) { ctx.set('risk.notes', v.trim() ? v : undefined); } })),
        ui.field('Action taken or safety plan', ui.input({ rows: 3, value: ctx.get('risk.action', ''),
          placeholder: young ? 'Who you told (for example the safeguarding lead), what was agreed, crisis contacts given, follow-up.' : 'Who you told, what was agreed, crisis contacts given, follow-up.',
          onSave: function (v) { ctx.set('risk.action', v.trim() ? v : undefined); } }))),
      confirmRow([
        ui.check({ label: 'Safety reviewed: no immediate risk, or risk plan in place', hint: 'This completes the step. You can come back and change it at any time.',
          checked: !!ctx.get('risk.reviewed'), onChange: function (v) { ctx.set('risk.reviewed', v); } }),
        actionHint])]));

    /* One closed Sources disclosure for the step: the risk data's sources for this age group
       (risk.srcYoung for young people) and the source behind each finding shown above. */
    var rList = srcList(pick(R, 'src', young)) || [];
    var rLines = itemSourceLines(items, function (it) { return it.short || it.text || it.id; });
    var riskSrc = sourcesBox(rList, rLines, srcParts(rList.concat(rLines.map(function (l) { return l[0]; }))).length);
    if (riskSrc) el.appendChild(h('div', { class: 'as-srcend' }, riskSrc));

    function serious() {
      var r = ctx.get('risk', {}) || {};
      return items.filter(function (it) { return r[it.id] && levelOf(it) !== 'note'; });
    }
    function cssrsResult() {
      if (!hasItems(cssrs)) return null;
      try { var ans = ctx.get('tools.cssrs.answers', {}) || {}; return Object.keys(ans).length ? AA.scoring.score(cssrs, ans) : null; } catch (e) { return null; }
    }
    /* Urgent flags from other questionnaires (for example a depression scale item on self-harm). */
    function toolFlags() {
      var out = [];
      Object.keys(ctx.get('tools', {}) || {}).forEach(function (id) {
        if (id === 'cssrs') return;
        var t = AA.byId('tools', id);
        var r = hasItems(t) ? resultFor(ctx, t) : null;
        urgentFlags(r).forEach(function (f) { out.push({ key: id + ':' + f.item, label: (t.abbr || id) + (f.item !== undefined ? ' item ' + f.item : ''), text: f.text }); });
      });
      return out;
    }

    var sig = null;
    function renderAlerts() {
      var r = ctx.get('risk', {}) || {};
      var hi = serious();
      var notes = items.filter(function (it) { return r[it.id] && levelOf(it) === 'note'; });
      var cr = cssrsResult();
      var crHit = cr && cr.answered && cr.sev !== null && cr.sev !== undefined && cr.sev >= 2;
      var tf = toolFlags();
      var next = hi.map(function (x) { return x.id; }).join(',') + '|' + notes.map(function (x) { return x.id; }).join(',') + '|' + (crHit ? cr.band : '') + '|' + tf.map(function (x) { return x.key; }).join(',');
      if (next !== sig) {
        sig = next;
        U.clear(alerts);
        if (hi.length || crHit || tf.length) {
          var lines = hi.map(function (it) {
            return h('li', null, h('strong', null, (it.short || it.text) + ': '), it.action || 'Act on this today and record what you did.');
          });
          if (crHit) lines.push(h('li', null, h('strong', null, (cssrs.abbr || 'C-SSRS') + ': ' + (cr.band || 'risk endorsed') + '. '), cr.action || 'Follow your local suicide risk pathway.'));
          tf.forEach(function (f) { lines.push(h('li', null, h('strong', null, f.label + ': '), f.text)); });
          alerts.appendChild(ui.callout('err', h('div', null,
            h('ul', { class: 'list' }, lines),
            riskActions.length ? h('div', null, h('p', { class: 'as-strong' }, 'In every case'), ui.list(riskActions)) : null), 'Act on these before you continue'));
        }
        if (notes.length) {
          alerts.appendChild(ui.callout('info', h('ul', { class: 'list' }, notes.map(function (it) {
            return h('li', null, h('strong', null, (it.short || it.text) + ': '), it.action || 'Include in the plan.');
          })), 'For the plan'));
        }
      }
      var needAction = (hi.length || crHit) && !String(ctx.get('risk.action', '') || '').trim();
      actionHint.textContent = needAction ? 'Risk items are ticked: record the action taken or the safety plan above.' : '';
      /* Status chips on the cards. */
      var ticked = items.filter(function (it) { return r[it.id]; }).length;
      fill(findSide, hi.length ? ui.badge(U.plural(hi.length, 'item') + ' to act on', 'err') : ticked ? ui.badge(ticked + ' noted', 'info') : ui.badge('Nothing ticked', 'neutral'));
      levelCounts.forEach(function (g) { g.el.textContent = countText(g.its.filter(function (it) { return r[it.id]; }).length, g.its.length, 'ticked'); });
      fill(revSide, r.reviewed ? ui.badge('✓ Reviewed', 'ok') : ui.badge('Not reviewed yet', 'warn'));
      if (cssrs) {
        fill(csSide, !hasItems(cssrs) ? ui.badge('Official form', 'neutral') : !cr || !cr.answered ? ui.badge('Not started', 'neutral')
          : !cr.complete ? ui.badge(cr.answered + ' of ' + cr.of + ' answered', 'neutral') : ui.sevChip(cr.sev, cr.band || 'Complete'));
        csMeta.textContent = !cr || !cr.answered ? 'Not started' : cr.complete ? 'Complete' : cr.answered + ' of ' + cr.of + ' answered';
      }
    }
    renderAlerts();
    ctx.onChange('risk', U.debounce(function () { if (el.isConnected) renderAlerts(); }, 80));
    if (cssrs) ctx.onChange('tools', U.debounce(function () { if (el.isConnected) renderAlerts(); }, 80));
  } };

  /* ---------- 4. Clinical history ---------- */

  var FLAG_TAG = { adhd: ['Supports ADHD', 'accent'], ddx: ['Consider differential', 'warn'], risk: ['Risk', 'err'], treat: ['Relevant to treatment', 'info'] };
  /* Short names for the area track (the full title shows above each area). */
  var AREA_SHORT = { presenting: 'Presenting problem', dev: 'Early life', school: 'Education', work: 'Work', relationships: 'Relationships', mental: 'Mental health',
    substance: 'Substances', physical: 'Physical health', meds: 'Medicines', family: 'Family', forensic: 'Police and courts', social: 'Daily life', sleep: 'Sleep', strengths: 'Strengths and goals' };
  function areaShort(s) {
    if (AREA_SHORT[s.id]) return AREA_SHORT[s.id];
    var t = String(s.title || s.id).split(/[,:]| and /)[0].trim();
    return t.length > 3 ? t : String(s.title || s.id);
  }

  function condName(id) { var c = AA.byId('ddx', id); return c ? c.name : id; }
  function condLink(id, text) {
    if (!AA.byId('ddx', id)) return h('span', null, text || id);
    return h('a', { href: '#cond-' + id, 'data-go': 'cond-' + id }, text || condName(id));
  }
  /* Some items point to a young-only differential for under-18s (ddxYoung) and keep the adult link otherwise. */
  function ddxOf(it, young) { return (young && it.ddxYoung) || it.ddx || null; }
  function flagTags(it, young) {
    var tags = [];
    var f = FLAG_TAG[it.flag];
    var dx = ddxOf(it, young);
    if (f && it.flag !== 'ddx') tags.push(ui.badge(f[0], f[1]));
    if (it.flag === 'ddx' || dx) {
      var b = ui.badge(dx ? 'Consider: ' + condName(dx) : f ? f[0] : 'Consider differential', 'warn');
      tags.push(dx && AA.byId('ddx', dx)
        ? h('a', { class: 'as-taglink', href: '#cond-' + dx, 'data-go': 'cond-' + dx, title: 'Open the differential: ' + condName(dx) }, b)
        : b);
    }
    return tags.length ? h('span', { class: 'as-tags' }, tags) : null;
  }

  AA.steps.history = { render: function (el, ctx) {
    var a0 = ctx.a();
    var young = isYoung(a0), band = bandOf(a0);
    /* Sections and items for this age group (ages: 'young' | 'adult' | 'all', missing means all;
       bands: a list of age bands, missing means every band). Young people get titleYoung, whyYoung
       and promptsYoung when the data has them. */
    var secs = (AA.data.history || []).filter(function (s) { return fitsGroup(s, young, band); }).map(function (s) {
      var c = Object.assign({}, s);
      c.title = pick(s, 'title', young) || s.title || s.id;
      c.items = (s.items || []).filter(function (it) { return fitsGroup(it, young, band); });
      c.prompts = arr(pick(s, 'prompts', young)) || [];
      c.why = pick(s, 'why', young);
      return c;
    });
    if (!secs.length) {
      el.appendChild(ui.empty('History prompts are not available', 'Take the history as usual and record it in your notes.'));
      return;
    }
    function covered(r) {
      return !!(r && ((r.checks && Object.keys(r.checks).some(function (k) { return r.checks[k]; })) || r.notes || r.none));
    }

    /* Card 1: what the history has flagged so far. */
    var live = h('p', { class: 'as-live', 'aria-live': 'polite' });
    var flagHost = h('div', { class: 'as-flaghost' });
    var covSide = h('span');
    el.appendChild(card({ icon: 'flag', title: 'Flags from the history', sub: 'Items that point to a differential, to risk or to treatment choices collect here as you tick them.', side: covSide, cls: 'as-flags' }, [live, flagHost]));

    /* The areas, one at a time. Starts at the first area not covered yet. */
    var rec0 = ctx.get('history', {}) || {};
    var start = 0;
    secs.some(function (s, i) { if (!covered(rec0[s.id])) { start = i; return true; } return false; });
    var cur = null;   /* {s, status, ticks}: the area on screen, repainted as answers change */
    function paintArea() {
      if (!cur) return;
      var r = (ctx.get('history', {}) || {})[cur.s.id] || {};
      var c = r.checks || {};
      var n = cur.s.items.filter(function (it) { return c[it.id]; }).length;
      var chips = [];
      if (n) chips.push(ui.badge(U.plural(n, 'item') + ' ticked', 'accent'));
      if (r.notes) chips.push(ui.badge('Notes', 'info'));
      if (r.none) chips.push(ui.badge('Nothing relevant', 'neutral'));
      chips.push(covered(r) ? ui.badge('✓ Covered', 'ok') : ui.badge('Not covered yet', 'warn'));
      fill(cur.status, chips);
      if (cur.ticks) cur.ticks.textContent = countText(n, cur.s.items.length, 'ticked');
    }
    function areaBody(s) {
      var r = (ctx.get('history', {}) || {})[s.id] || {};
      var checks = r.checks || {};
      var status = h('div', { class: 'as-astatus', 'aria-live': 'polite' });
      var ticks = h('span');
      cur = { s: s, status: status, ticks: ticks };
      var node = h('div', { class: 'as-area' },
        status,
        s.why ? fold('Why this area matters', h('p', { class: 'as-foldp' }, s.why)) : null,
        s.prompts && s.prompts.length ? group('Ask', h('ul', { class: 'as-prompts' }, s.prompts.map(function (q) { return h('li', null, q); })), { side: U.plural(s.prompts.length, 'question') }) : null,
        s.items && s.items.length ? group('Tick what applies', rows(s.items.map(function (it) {
          var row = ui.check({ label: it.t, hint: it.note || null, checked: !!checks[it.id], cls: 'as-item',
            onChange: function (v) { ctx.set('history.' + s.id + '.checks.' + it.id, v ? true : undefined); } });
          var tags = flagTags(it, young);
          if (tags) row.appendChild(tags);
          return row;
        }), 'as-items'), { side: ticks }) : null,
        h('div', { class: 'as-none' }, ui.check({ label: 'Nothing relevant in this area', checked: !!r.none,
          onChange: function (v) { ctx.set('history.' + s.id + '.none', v ? true : undefined); } })),
        ui.field('Notes: ' + s.title, ui.input({ rows: 3, value: r.notes || '',
          placeholder: young ? 'Details, dates, and what the parent or carer and the young person said.' : 'Details, dates and the patient\'s own words.',
          onSave: function (v) { ctx.set('history.' + s.id + '.notes', v.trim() ? v : undefined); } })));
      paintArea();
      return node;
    }
    var stepper = ui.stepper(secs.map(function (s) {
      return { title: s.title, label: areaShort(s), done: function () { return covered((ctx.get('history', {}) || {})[s.id]); }, render: function () { return areaBody(s); } };
    }), { start: start, label: 'History areas', eyebrow: function (i) { return 'Area ' + (i + 1) + ' of ' + secs.length; } });
    el.appendChild(h('div', { class: 'as-stephead' },
      h('p', { class: 'ds-label' }, 'History by area'),
      h('p', { class: 'hint' }, young
        ? 'One area at a time. Ask the parent or carer and the child or young person the prompts that fit, and tick what applies. If there is nothing of note, tick "Nothing relevant". Green areas are covered.'
        : 'One area at a time. Ask the prompts that fit and tick what applies. If there is nothing of note, tick "Nothing relevant". Green areas are covered.')));
    el.appendChild(stepper);

    /* Mental state observations (NICE NG87 1.3.1). Stored with the history as history.mse.notes. */
    el.appendChild(card({ icon: 'eye', title: 'Mental state observations', cls: 'as-mse',
      sub: young
        ? 'Observe the child throughout, including in the waiting room and with their parent or carer. A calm, focused child in a new one-to-one setting does not rule ADHD out. Note anything that points away from ADHD or needs action today.'
        : 'Observe throughout the interview. Note anything that points away from ADHD or needs action today, such as low mood, elation, psychotic features or intoxication.' }, [
      h('ul', { class: 'ds-chips as-mse-areas', 'aria-label': 'Areas to cover' },
        ['Appearance and behaviour', 'Restlessness and distractibility', 'Speech', 'Mood and affect', 'Thought form and content', 'Perception', 'Cognition', 'Insight'].map(function (x) { return h('li', null, h('span', { class: 'ds-chip' }, x)); })),
      ui.field('What you observed', ui.input({ rows: 4, value: ctx.get('history.mse.notes', ''),
        placeholder: young
          ? 'For example: played with the toys, left the chair often, interrupted their parent, speech normal for age, mood "fine", no concerns about safety.'
          : 'For example: casually dressed, fidgeting throughout, speech normal rate, mood "fed up", reactive affect, no psychotic features, good insight.',
        onSave: function (v) { ctx.set('history.mse.notes', v.trim() ? v : undefined); } }))]));

    /* One closed Sources disclosure for the step: for each area, the sources behind its items
       (src fields, mostly on the young-person items) and any area-level source. */
    var histAll = [];
    var histLines = secs.map(function (s) {
      var parts = srcParts((srcList(pick(s, 'src', young)) || []).concat(s.items.map(function (it) { return it.src; })));
      histAll = histAll.concat(parts);
      return [s.title, parts.join('; ')];
    });
    var histSrc = sourcesBox([], histLines, srcParts(histAll).length);
    if (histSrc) el.appendChild(h('div', { class: 'as-srcend' }, histSrc));

    function flagRows(list) {
      return h('ul', { class: 'as-flaglist' }, list.map(function (x) { return h('li', null, h('span', { class: 'as-fl-name' }, x[0]), h('span', { class: 'as-fl-items' }, x[1])); }));
    }
    function update() {
      var rec = ctx.get('history', {}) || {};
      var byDdx = {}, order = [], treat = [], risk = [], adhd = 0, ticked = 0, done = 0;
      secs.forEach(function (s) {
        var r = rec[s.id] || {};
        var c = r.checks || {};
        (s.items || []).forEach(function (it) {
          if (!c[it.id]) return;
          ticked++;
          var dx = ddxOf(it, young);
          if (dx) {
            if (!byDdx[dx]) { byDdx[dx] = []; order.push(dx); }
            byDdx[dx].push(it.t);
          }
          if (it.flag === 'treat') treat.push([it.t, s.title]);
          if (it.flag === 'risk') risk.push([it.t, s.title]);
          if (it.flag === 'adhd') adhd++;
        });
        if (covered(r)) done++;
      });
      live.textContent = done + ' of ' + secs.length + ' areas covered. ' + U.plural(ticked, 'item') + ' ticked' + (adhd ? ', ' + adhd + ' supporting ADHD' : '') + '.';
      fill(covSide, ui.badge(done + ' of ' + secs.length + ' areas', done === secs.length ? 'ok' : 'neutral'));
      stepper.refresh();
      paintArea();

      U.clear(flagHost);
      if (!order.length && !treat.length && !risk.length) {
        flagHost.appendChild(h('p', { class: 'muted' }, 'Nothing flagged yet. Items that point to a differential, to risk or to treatment choices will collect here.'));
        return;
      }
      if (order.length) {
        flagHost.appendChild(group('Consider in the differential', [
          h('ul', { class: 'as-flaglist' }, order.map(function (id) {
            return h('li', null, h('span', { class: 'as-fl-name' }, condLink(id)), h('span', { class: 'as-fl-items' }, byDdx[id].join('; ')));
          })),
          h('div', { class: 'row as-foot' }, ui.btn({ label: 'Review in differentials', kind: 'ghost', small: true, onClick: function () { ctx.go('ddx'); } }))], { side: String(order.length) }));
      }
      if (risk.length) {
        flagHost.appendChild(group('Risk', [flagRows(risk),
          h('div', { class: 'row as-foot' }, ui.btn({ label: 'Go to safety and risk', kind: 'ghost', small: true, onClick: function () { ctx.go('risk'); } }))], { side: String(risk.length) }));
      }
      if (treat.length) flagHost.appendChild(group('Relevant to treatment', flagRows(treat), { side: String(treat.length) }));
    }
    update();
    ctx.onChange('history', U.debounce(function () { if (el.isConnected) update(); }, 80));
  } };

  /* ---------- 5. Co-occurring conditions screen ---------- */

  AA.steps.comorbid = { render: function (el, ctx) {
    var a = ctx.a();
    var cm = stepToolIds(a, 'comorbid');
    var sc = stepToolIds(a, 'screen');
    var listed = cm.all, core = cm.core, young = cm.young, age = cm.age;
    var skip = sc.all.concat(sc.core, ['cssrs']);
    var ids = core.concat(listed.filter(function (id) { return core.indexOf(id) < 0; }));
    /* Any other scored scale for this stage. Young people: only tools whose age range covers them.
       Adults: as before, leaving out tools made only for under-18s. */
    (AA.data.tools || []).forEach(function (t) {
      if (ids.indexOf(t.id) > -1 || skip.indexOf(t.id) > -1 || !hasItems(t) || (t.stage || []).indexOf('comorbid') < 0) return;
      if (young ? !fitsAge(t, age, true, true) : (typeof t.ageMax === 'number' && t.ageMax < 18)) return;
      ids.push(t.id);
    });
    var list = toolList(ids);
    function optional(t) { return core.indexOf(t.id) < 0; }

    questionnaireStep(el, ctx, {
      tools: list,
      optional: optional,
      points: true,
      intro: ui.callout('info', h('div', null,
        h('p', null, young
          ? 'These scales look for conditions that often co-occur with ADHD in children and young people, or can look like it. A positive screen is a prompt to explore in the interview and the differential step. It is not a diagnosis.'
          : 'These brief scales look for conditions that often co-occur with ADHD or can mimic it. A positive screen is a prompt to explore in the interview and the differential step. It is not a diagnosis.'),
        h('p', null, 'Most scales describe the last two weeks or the current state. Low mood, anxiety or poor sleep on the day can raise scores.')), 'Screen widely, then ask'),
      groups: [
        { title: 'Core screens', hint: 'Complete these for everyone' + (young ? ' in this age group.' : '.'), filter: function (t) { return !optional(t); } },
        { title: 'Optional screens', hint: 'Use these when the history or the interview points to them.', filter: optional }
      ],
      emptyTitle: young ? 'No co-occurring condition scales listed for this age' : null,
      emptyBody: young ? 'Use your service\'s usual forms, then record what you find in the history and differential steps.' : null,
      /* Inside each tool: which differentials it informs, and a prompt when it is positive. */
      extra: function (t) {
        var conds = condsFor(t.id);
        var host = h('div', { class: 'as-pointsbox' });
        return { el: host, update: function (r) {
          U.clear(host);
          if (!conds.length) return;
          host.appendChild(h('p', { class: 'as-strong' }, 'Informs these differentials'));
          host.appendChild(condLinks(conds));
          if (isPositive(r)) {
            host.appendChild(ui.callout('warn', h('div', null,
              h('p', null, 'Positive screen. Explore it in the interview, then weigh it in the differential step.'),
              ui.btn({ label: 'Review in differentials', kind: 'ghost', small: true, onClick: function () { ctx.go('ddx'); } }))));
          }
        } };
      }
    });
  } };
})(window.AA);
