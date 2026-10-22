/* Reference pages used during the interview: differential diagnosis (explainer, differential finder and
   every condition), one condition's reference card, the diagnostic criteria, the question bank and one
   symptom's reference card. Routes: "ddx", "cond-<id>", "criteria", "bank[-<symptomId>]" and "sym-<id>"
   (see ARCHITECTURE.md, section 6).
   Content comes from AA.data.ddx, AA.data.symptoms, AA.data.criteria, AA.data.impairment, AA.data.history,
   AA.data.risk and AA.data.tools; this file only arranges it, and never throws on missing or partial data.
   Per-clinician state lives in AA.progress 'sandbox.ddxfinder' = {f: {<featureId>: true}} (practice ticks in
   the differential finder, never linked to a patient). The question bank index is built once and cached. */
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
  function lastA() { try { return AA.shell && AA.shell.lastAssessment ? AA.shell.lastAssessment() : null; } catch (e) { return null; } }
  function go(token, label, cls) { return h('a', { href: '#' + token, 'data-go': token, class: cls || null }, label); }

  function copyLines(lines, what) {
    U.copyText(lines.join('\n')).then(function (ok) {
      U.toast(ok ? what + ' copied' : 'Copy failed. Your browser blocked the clipboard.', ok ? 'ok' : 'err');
    });
  }
  function numbered(list) { return list.map(function (t, i) { return (i + 1) + '. ' + t; }); }

  /* Move to an in-page section without touching the route (hash links would navigate). */
  function jumpTo(sec) {
    if (!sec) return;
    try { sec.scrollIntoView({ block: 'start' }); } catch (e) { sec.scrollIntoView(); }
    var hd = sec.querySelector('h2');
    if (hd) { try { hd.focus({ preventScroll: true }); } catch (e) { hd.focus(); } }
  }

  /* Section with an h2 (and optional extra nodes beside the heading, such as a copy button). */
  function section(id, title, body, side, cls) {
    var hid = id + '-h';
    return h('section', { class: 'rf-sec' + (cls ? ' ' + cls : ''), id: id, 'aria-labelledby': hid },
      side ? h('div', { class: 'rf-sec-head' }, h('h2', { id: hid, tabindex: '-1' }, title), side) : h('h2', { id: hid, tabindex: '-1' }, title),
      body);
  }

  /* Previous / next links at the foot of a reference card. p, n: {go, t} or null. */
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

  /* ---------- Differentials ---------- */

  /* Condition groups in display order (same labels as the assessment's differential step). */
  var GROUPS = { mood: 'Mood', anxiety: 'Anxiety and obsessive-compulsive', trauma: 'Trauma and stress', personality: 'Personality',
    neurodevelopmental: 'Neurodevelopmental', substance: 'Substances and behavioural addictions', psychosis: 'Psychosis', sleep: 'Sleep',
    medical: 'Physical health and medicines', cognitive: 'Cognitive', other: 'Other explanations' };
  var GROUP_ORDER = ['mood', 'anxiety', 'trauma', 'personality', 'neurodevelopmental', 'substance', 'psychosis', 'sleep', 'medical', 'cognitive', 'other'];
  var COEXIST = { yes: ['Can co-occur', 'ok'], sometimes: ['Sometimes co-occurs', 'info'], no: ['Alternative only', 'neutral'] };
  var COEXIST_TEXT = { yes: 'Yes. It often occurs alongside ADHD.', sometimes: 'Sometimes.', no: 'No. It is an alternative explanation rather than a co-occurring condition.' };
  var BAND = { strong: ['Strong fit', 'warn'], possible: ['Possible fit', 'info'], weak: ['Weak fit', 'neutral'] };
  var WEIGHT_TEXT = { 1: 'weak', 2: 'moderate', 3: 'strong' };

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
  /* Conditions grouped, then in data order. Previous/next and the grid use the same order. */
  function condsOrdered() {
    var list = conds(), out = [];
    groupsOf(list).forEach(function (g) { list.forEach(function (c) { if (groupKey(c) === g) out.push(c); }); });
    return out;
  }
  function condName(c) { return txt(c.name) || c.id; }
  /* "Depression (major depressive disorder)" -> "Depression" for running text. */
  function shortName(c) { var n = condName(c); return n.replace(/\s*\([^)]*\)\s*$/, '') || n; }
  function condById(id) { var l = conds(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function features(c) { return arr(c.features).filter(function (f) { return isObj(f) && txt(f.id); }); }
  function weightOf(f) { return U.clamp(parseInt(f.w, 10) || 1, 1, 3); }
  /* Leading ICD-11 code for compact cards ("6A70 single episode..." -> "6A70"); '' when the field starts with words. */
  function icdShort(c) { var m = txt(c.icd11).match(/^([0-9A-Z]{4}(?:\.[0-9A-Z]+)?(?:-[0-9A-Z]{4}(?:\.[0-9A-Z]+)?)?)(?![0-9A-Za-z])/); return m ? m[1] : ''; }
  function coexistBadge(c) { var m = COEXIST[c.coexist]; return m ? ui.badge(m[0], m[1]) : null; }
  function weightTag(w) {
    return h('span', { class: 'rf-w', title: 'Weight ' + w + ' of 3' },
      h('span', { class: 'rf-w-dots', 'aria-hidden': 'true' }, '●●●'.slice(0, w) + '○○○'.slice(0, 3 - w)),
      h('span', { class: 'rf-w-t' }, WEIGHT_TEXT[w]), h('span', { class: 'sr-only' }, ' pointer, weight ' + w + ' of 3'));
  }

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
    ['sud', 'Substance use'], ['asd', 'Autism'], ['culture', 'Culture and language']];
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
  /* Label as used in the bank and in links: DIVA code first ("A3 Seems not to listen"). */
  function symLabel(s) { var c = dsmCode(s), dv = divaCode(s); return (c ? c + ' ' : '') + symTitle(s) + (dv ? ' (DIVA ' + dv + ')' : ''); }
  function probeLabel(p) { var l = txt(p.label); return l && l !== p.k ? l : PROBE_LABEL[p.k] || l || txt(p.k) || 'Probes'; }

  /* ======================================================================
     Route: ddx (explainer, differential finder, all conditions)
     ====================================================================== */

  function explainer() {
    var clues = [
      ['Trait or change', 'ADHD is a lasting trait. A clear change from the person\'s usual self points to something else.'],
      ['Onset before 12', 'Several symptoms were there before age 12. A late start needs another explanation first.'],
      ['Every setting', 'ADHD shows at home, at work and with friends. Problems in one setting only suggest a cause in that setting.'],
      ['Specific triggers', 'Symptoms that come with stress, trauma reminders, social situations or substance use suggest another cause.'],
      ['Response to treatment', 'If symptoms lift with better sleep, stopping a substance or treating low mood, that was probably the cause.'],
      ['Family history', 'ADHD runs in families. A family history of bipolar disorder or psychosis means screening for it with care.']
    ];
    return h('section', { class: 'card rf-explain', 'aria-labelledby': 'rf-exp-h' },
      h('h2', { id: 'rf-exp-h' }, 'Co-occurring or better explained?'),
      h('div', { class: 'rf-explain-cols' },
        h('div', { class: 'rf-explain-col rf-co' }, h('h3', null, 'Co-occurring'),
          h('p', null, 'Both conditions are present. The ADHD symptoms were there before the other condition and carry on between its episodes. Diagnose both, and plan which to treat first.')),
        h('div', { class: 'rf-explain-col rf-be' }, h('h3', null, 'Better explained'),
          h('p', null, 'The other condition accounts for the symptoms. DSM-5-TR criterion E: do not diagnose ADHD when another mental disorder better explains the symptoms, or when they happen only during a psychotic illness.'))),
      h('h3', { class: 'rf-k-h' }, 'Clues that help you decide'),
      h('dl', { class: 'rf-clues' }, clues.map(function (c) { return h('div', null, h('dt', null, c[0]), h('dd', null, c[1])); })),
      ui.source('DSM-5-TR criterion E (paraphrased); clinical practice.'));
  }

  /* ---- Differential finder: ticks live in AA.progress('sandbox.ddxfinder.f') ---- */
  var FINDER = 'sandbox.ddxfinder';
  function readTicks() { var f = AA.progress.get(FINDER + '.f', null); return isObj(f) ? Object.assign({}, f) : {}; }

  /* The clue lists (about 500 checkboxes) are built group by group when a group is first opened or a
     search needs it, so the page opens instantly; ranking works from the saved ticks alone. */
  function finder(list) {
    var ticks = readTicks();
    var rows = [];
    var groups = groupsOf(list).map(function (g) {
      var members = list.filter(function (c) { return groupKey(c) === g && features(c).length; });
      if (!members.length) return null;
      var meta = h('span');
      var body = h('div', { class: 'rf-fbody' });
      var grp = { g: g, members: members, meta: meta, blocks: [], n: members.length, built: false, body: body,
        feats: members.reduce(function (acc, c) { return acc.concat(features(c).map(function (f) { return f.id; })); }, []) };
      grp.el = ui.details(groupLabel(g), body, { meta: meta, cls: 'rf-fgroup', onToggle: function (open) { if (open) build(grp); } });
      return grp;
    }).filter(Boolean);

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

    var status = h('p', { class: 'rf-fstatus', role: 'status', 'aria-live': 'polite' });
    var searchNote = h('p', { class: 'hint rf-fnote' });
    var noMatch = h('p', { class: 'muted rf-fnone', hidden: true }, 'No clue matches that search. Try a shorter word.');
    var rankList = h('ol', { class: 'rf-rank' });
    var rankEmpty = h('p', { class: 'muted rf-rank-empty' }, 'Tick the clues you have found. The conditions that fit best appear here, strongest first.');
    var moreNote = h('p', { class: 'hint' });
    var resetBtn = ui.btn({ label: 'Reset', kind: 'ghost', small: true, onClick: reset });

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
      searchNote.textContent = ws.length ? U.plural(shown, 'clue') + ' match "' + q + '".' : 'Open a group to see its clues. More dots means the clue points more strongly to that condition.';
    });

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
    }

    if (!groups.length) return null;
    rank();
    searchNote.textContent = 'Open a group to see its clues. More dots means the clue points more strongly to that condition.';

    return section('rf-finder', 'Differential finder', [
      h('p', { class: 'muted rf-intro' }, 'Tick every clue you have found in the history, the interview or the screens. Conditions are ranked by the total weight of their ticked clues. It prompts your thinking; it does not make a diagnosis. Ticks are saved in your profile and are not linked to any patient.'),
      h('div', { class: 'rf-fgrid' },
        h('div', { class: 'card rf-fpick' },
          h('div', { class: 'rf-fbar', role: 'search', 'aria-label': 'Filter the clues' }, search),
          status, searchNote,
          groups.map(function (g) { return g.el; }), noMatch),
        h('aside', { class: 'card rf-fres', 'aria-labelledby': 'rf-fres-h' },
          h('div', { class: 'rf-fres-head' }, h('h3', { id: 'rf-fres-h' }, 'Best fit'), resetBtn),
          rankEmpty, rankList, moreNote))]);
  }

  function condCard(c) {
    return h('a', { class: 'card card-link rf-ccard', href: '#cond-' + c.id, 'data-go': 'cond-' + c.id },
      h('span', { class: 'rf-ccard-name' }, condName(c)),
      h('span', { class: 'rf-badges' },
        c.core ? ui.badge('Core', 'accent', 'Review in every adult assessment') : null, coexistBadge(c),
        icdShort(c) ? h('span', { class: 'rf-code' }, 'ICD-11 ' + icdShort(c)) : null),
      txt(c.summary) ? h('span', { class: 'rf-ccard-sum' }, c.summary) : null);
  }

  function condGrid(list) {
    var core = list.filter(function (c) { return c.core; }).length;
    return section('rf-all', 'All conditions',
      groupsOf(list).map(function (g) {
        var members = list.filter(function (c) { return groupKey(c) === g; });
        var hid = 'rf-g-' + safeId(g);
        return h('section', { class: 'rf-cgroup', 'aria-labelledby': hid },
          h('h3', { id: hid }, h('span', null, groupLabel(g)), h('span', { class: 'rf-n' }, U.plural(members.length, 'condition'))),
          h('div', { class: 'grid rf-cgrid' }, members.map(condCard)));
      }),
      h('span', { class: 'rf-n' }, U.plural(list.length, 'condition') + (core ? ' · ' + core + ' core' : '')));
  }

  function renderDdx(el) {
    var list = condsOrdered();
    var last = lastA();
    el.appendChild(ui.pageHead({
      eyebrow: 'During the interview', title: 'Differential diagnosis',
      lead: 'Conditions that can mimic ADHD or occur alongside it. Tick the clues you have found to see which fit best, then open a condition for the questions that tell it apart.',
      actions: [
        AA.router.has('ddxguide') ? ui.btn({ label: 'Differential protocol', kind: 'ghost', go: 'ddxguide' }) : null,
        last ? ui.btn({ label: 'Differentials in the assessment', kind: 'primary', go: 'assess-' + last.id + '-ddx' }) : null
      ].filter(Boolean)
    }));
    el.appendChild(explainer());
    if (!list.length) {
      el.appendChild(h('div', { class: 'rf-sec' }, ui.empty('No conditions loaded', 'The differential diagnosis library is not available in this build.',
        ui.btn({ label: 'Go to home', kind: 'primary', go: 'home' }))));
      return;
    }
    var f = finder(list);
    if (f) el.appendChild(f);
    el.appendChild(condGrid(list));
  }

  /* ======================================================================
     Route: cond-<id> (one condition's reference card)
     ====================================================================== */

  function mimicsOf(id) {
    var out = [];
    syms().forEach(function (s) { arr(s.mimics).forEach(function (m) { if (isObj(m) && m.ddx === id) out.push({ s: s, m: m }); }); });
    return out;
  }

  function toolChips(ids) {
    return h('ul', { class: 'chip-list rf-tools' }, ids.map(function (id) {
      var t = AA.byId('tools', id);
      if (!t) return h('li', null, h('span', { class: 'chip' }, id, h('span', { class: 'sr-only' }, ' (not in the tools library)')));
      return h('li', null, h('a', { class: 'chip rf-tchip', href: '#tool-' + id, 'data-go': 'tool-' + id, title: t.name || null }, t.abbr || t.name || id));
    }));
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
    var name = condName(c), short = shortName(c);
    var last = lastA();
    el.appendChild(ui.pageHead({
      eyebrow: groupLabel(groupKey(c)), title: name, lead: txt(c.summary) || null,
      actions: [ui.btn({ label: 'All conditions', kind: 'ghost', go: 'ddx', icon: '←' }),
        last ? ui.btn({ label: 'Review in the assessment', kind: 'primary', go: 'assess-' + last.id + '-ddx' }) : null].filter(Boolean)
    }));

    /* ---- At a glance and how to decide ---- */
    var rows = [];
    if (txt(c.icd11)) rows.push(['ICD-11', c.icd11]);
    rows.push(['Core', c.core ? 'Yes: review it in every adult assessment' : 'No: consider it when the history points to it']);
    if (txt(c.prevalence)) rows.push(['How common', c.prevalence]);
    rows.push(['Can it co-occur?', h('span', null,
      coexistBadge(c) ? [coexistBadge(c), ' ', h('span', null, COEXIST_TEXT[c.coexist])] : h('span', { class: 'muted' }, 'Not stated'),
      txt(c.coexistNote) ? h('span', { class: 'rf-note' }, c.coexistNote) : null)]);
    var screens = texts(c.screen);
    rows.push(['Screening tools', screens.length ? toolChips(screens) : h('span', { class: 'muted' }, 'No screening tool listed')]);

    var dc = isObj(c.decide) ? c.decide : {};
    var dec = [['better', 'It better explains the symptoms when'], ['both', 'Diagnose both when'], ['next', 'What to do next']]
      .filter(function (d) { return txt(dc[d[0]]); });
    el.appendChild(h('div', { class: 'grid-2 rf-top' },
      h('section', { class: 'card', 'aria-labelledby': 'rf-glance-h' }, h('h2', { id: 'rf-glance-h' }, 'At a glance'), ui.kv(rows)),
      h('section', { class: 'card rf-decide', 'aria-labelledby': 'rf-dec-h' }, h('h2', { id: 'rf-dec-h' }, 'How to decide'),
        dec.length ? dec.map(function (d) { return h('div', { class: 'rf-dec' }, h('h3', null, d[1]), h('p', null, dc[d[0]])); })
          : h('p', { class: 'muted' }, 'No decision guidance recorded yet. Use the questions and features below.'))));

    var flags = texts(c.redFlags);
    if (flags.length) el.appendChild(ui.callout('warn', ui.list(flags), 'Red flags'));

    /* ---- How it differs from ADHD ---- */
    var overlap = texts(c.overlap), fa = texts(c.favoursADHD), fb = texts(c.favoursAlt);
    if (overlap.length || fa.length || fb.length) {
      el.appendChild(section('rf-diff', 'How it differs from ADHD', [
        overlap.length ? h('div', { class: 'rf-overlap' }, h('h3', null, 'Where it overlaps with ADHD'), ui.list(overlap)) : null,
        fa.length || fb.length ? h('div', { class: 'rf-cols' },
          h('div', { class: 'rf-col rf-col-adhd' }, h('h3', null, 'Points towards ADHD'), fa.length ? ui.list(fa) : h('p', { class: 'muted' }, 'Not listed.')),
          h('div', { class: 'rf-col rf-col-alt' }, h('h3', null, 'Points towards ' + short), fb.length ? ui.list(fb) : h('p', { class: 'muted' }, 'Not listed.'))) : null]));
    }

    var asks = texts(c.ask);
    if (asks.length) {
      el.appendChild(section('rf-asks', 'Questions that tell them apart', h('ol', { class: 'list rf-asklist' }, asks.map(li)),
        ui.btn({ label: 'Copy questions', kind: 'ghost', small: true, onClick: function () { copyLines(numbered(asks), 'Questions'); } })));
    }

    var feats = features(c);
    if (feats.length) {
      el.appendChild(section('rf-feat-sec', 'Features that point to ' + short, [
        h('p', { class: 'hint rf-intro' }, 'More dots means the feature points more strongly to ' + short + ' rather than ADHD. Tick them in the assessment\'s differential step.'),
        h('ul', { class: 'rf-feats' }, feats.map(function (f) { return h('li', null, h('span', null, txt(f.t) || f.id), weightTag(weightOf(f))); }))]));
    }

    var mm = mimicsOf(c.id);
    el.appendChild(section('rf-mimic', 'Symptoms it can mimic', mm.length
      ? h('ul', { class: 'rf-mlist' }, mm.map(function (x) {
        return h('li', { class: 'rf-mitem' },
          h('h3', null, go('sym-' + x.s.id, symLabel(x.s))),
          txt(x.m.clue) ? h('p', null, h('span', { class: 'rf-k' }, 'Clue '), x.m.clue) : null,
          txt(x.m.ask) ? h('p', { class: 'rf-ask' }, h('span', { class: 'rf-k' }, 'Ask '), x.m.ask) : null);
      }))
      : h('p', { class: 'muted' }, 'No symptom in the interview lists ' + short + ' as a common mimic.'),
      mm.length ? h('span', { class: 'rf-n' }, U.plural(mm.length, 'symptom')) : null));

    var inv = texts(c.investigations), pearls = texts(c.pearls);
    if (inv.length || pearls.length) {
      el.appendChild(h('div', { class: 'grid-2 rf-sec rf-pair' },
        inv.length ? h('section', { class: 'card', 'aria-labelledby': 'rf-inv-h' }, h('h2', { id: 'rf-inv-h' }, 'Investigations to consider'), ui.list(inv)) : null,
        pearls.length ? h('section', { class: 'card', 'aria-labelledby': 'rf-pearl-h' }, h('h2', { id: 'rf-pearl-h' }, 'Clinical pearls'), ui.list(pearls)) : null));
    }

    var refs = texts(c.refs);
    if (refs.length) el.appendChild(section('rf-ref-sec', 'References', h('ol', { class: 'rf-refs' }, refs.map(li)), null, 'rf-sec-refs'));

    var p = list[idx - 1], n = list[idx + 1];
    el.appendChild(pnNav(p ? { go: 'cond-' + p.id, t: condName(p) } : null, n ? { go: 'cond-' + n.id, t: condName(n) } : null, 'Previous and next condition'));
  }

  /* ======================================================================
     Route: criteria (DSM-5-TR, ICD-11, DIVA 2.0, changes, comparison, the 18 symptoms)
     The shape of AA.data.criteria is loose: strings render as paragraphs, arrays as lists and
     objects as subsections titled by their t/title field, with d/text as the body.
     ====================================================================== */

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
    from: 'Before', to: 'Now', dsm4: 'DSM-IV', dsm5: 'DSM-5-TR', icd11: 'ICD-11', diva2: 'DIVA 2.0', why: 'Why it matters' };
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
    return h('ul', { class: 'list rf-crlist' }, items.map(function (x) {
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

  function symptomTable() {
    var list = syms();
    if (!list.length) return ui.empty('Symptoms not loaded', 'The symptom content is not available in this build.');
    var groups = DIMS.map(function (d) { return { label: d[1] + ' (' + d[2] + ')', rows: list.filter(function (s) { return dimOf(s) === d[0]; }) }; });
    return h('div', { class: 'table-wrap' }, h('table', { class: 'table rf-symtab' },
      h('caption', { class: 'sr-only' }, 'The 18 DSM-5-TR symptoms with DIVA codes and ASRS items'),
      h('thead', null, h('tr', null, ['DSM-5-TR', 'DIVA', 'ASRS', 'Symptom'].map(function (c) { return h('th', { scope: 'col' }, c); }))),
      groups.filter(function (g) { return g.rows.length; }).map(function (g) {
        return h('tbody', null,
          h('tr', { class: 'rf-grow' }, h('th', { scope: 'colgroup', colspan: '4' }, g.label)),
          g.rows.map(function (s) {
            var asrs = asrsItems(s);
            return h('tr', null,
              h('th', { scope: 'row', class: 'rf-codecell' }, dsmCode(s) || '-'),
              h('td', { class: 'rf-codecell' }, divaCode(s) || '-'),
              h('td', { class: 'rf-codecell' }, asrs.length ? asrs.join(', ') : '-'),
              h('td', null, go('sym-' + s.id, symTitle(s), 'rf-sym-link'), txt(s.criterion) ? h('span', { class: 'rf-sym-crit' }, s.criterion) : null));
          }));
      })));
  }

  function renderCriteria(el) {
    var cr = AA.data.criteria;
    el.appendChild(ui.pageHead({
      eyebrow: 'During the interview', title: 'Diagnostic criteria',
      lead: 'DSM-5-TR and ICD-11 criteria for ADHD in plain words, how DIVA 2.0 applies the older DSM-IV rules, what changed, and the 18 symptoms with their codes.',
      actions: [ui.btn({ label: 'Question bank', kind: 'ghost', go: 'bank' })]
    }));
    var jump = h('nav', { class: 'rf-jump', 'aria-label': 'Jump to a section' });
    el.appendChild(jump);
    var secs = [];
    function add(id, label, body, jumpLabel) { if (!body) return; var s = section(id, label, h('div', { class: 'card rf-crcard' }, body), null, 'rf-crsec'); secs.push({ label: jumpLabel || label, el: s }); el.appendChild(s); }

    if (isObj(cr)) {
      var done = { compare: true, comparison: true, changes: true };
      var present = [];
      SYSTEMS.forEach(function (s) {
        var key = [s.k].concat(s.alt).filter(function (k) { return has(cr[k]); })[0];
        if (!key) return;
        done[key] = true;
        present.push({ label: s.label, v: cr[key] });
        add('rf-cr-' + s.k, titleOf(cr[key]) || s.label, crNode(cr[key], 3));
      });
      var cmp = compareTable(cr, present);
      if (cmp) {
        var cs = section('rf-cr-compare', 'Side by side', [h('p', { class: 'hint rf-intro' }, 'The same requirements in each system. Read the full text above before applying a rule.'), cmp], null, 'rf-crsec');
        secs.push({ label: 'Side by side', el: cs }); el.appendChild(cs);
      }
      if (has(cr.changes)) add('rf-cr-changes', 'What changed from DSM-IV to DSM-5 and DSM-5-TR', crNode(cr.changes, 3), 'What changed');
      Object.keys(cr).forEach(function (k) { if (!done[k] && has(cr[k])) add('rf-cr-' + safeId(k), keyLabel(k) || 'More', crNode(cr[k], 3)); });
    } else if (has(cr)) {
      add('rf-cr-main', 'Criteria', crNode(cr, 3));
    } else {
      el.appendChild(ui.callout('info', h('p', null, 'The criteria text is not available in this build. The 18 symptoms and their codes are below.')));
    }

    var st = section('rf-cr-syms', 'The 18 symptoms', [
      h('p', { class: 'hint rf-intro' }, 'DSM-5-TR criterion A, with the matching DIVA and ASRS v1.1 items. Open a symptom for its questions, examples and scoring rules.'),
      symptomTable()], null, 'rf-crsec');
    secs.push({ label: 'The 18 symptoms', el: st });
    el.appendChild(st);

    if (secs.length > 2) {
      jump.appendChild(h('ul', null, secs.map(function (s) {
        return h('li', null, h('button', { type: 'button', class: 'rf-chip', onclick: function () { jumpTo(s.el); } }, s.label));
      })));
    } else jump.remove();
  }

  /* ======================================================================
     Route: bank[-<symptomId>] (question bank)
     The index is built once per session (it holds every askable line in the content) and filtered in memory.
     ====================================================================== */

  var TYPES = ['Question', 'Rephrase', 'Example', 'Probe', 'Informant', 'Impairment', 'Onset', 'Collateral', 'Differential', 'History', 'Risk'];
  var TYPE_WORDS = { Question: ['main question', 'main questions'], Rephrase: ['other wording', 'other wordings'], Example: ['example', 'examples'],
    Probe: ['probe', 'probes'], Informant: ['informant question', 'informant questions'] };
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
      lead: 'Every interview question, other wording, example and probe in one place. Search with a word or two, then narrow by type, symptom, period or life area.',
      actions: [last ? ui.btn({ label: 'Back to the assessment', kind: 'ghost', go: AA.shell.resumeRoute ? AA.shell.resumeRoute(last) : 'assess-' + last.id + '-' + (last.step || 'setup'), icon: '←' }) : null].filter(Boolean)
    }));
    if (!idx.list.length) {
      el.appendChild(ui.empty('The question bank is empty', 'No interview content is loaded in this build.', ui.btn({ label: 'Go to home', kind: 'primary', go: 'home' })));
      return;
    }
    function save() { bankMemo = { q: f.q, types: f.types.slice(), sym: f.sym, period: f.period, ctx: f.ctx, param: param }; }
    save();

    /* ---- Filters ---- */
    var search = ui.search('Search questions and examples', function (q) { f.q = q; apply(); save(); }, f.q);
    search.classList.add('rf-bsearch');
    var chipEls = {};
    var chips = h('div', { class: 'rf-chips', role: 'group', 'aria-label': 'Type' }, TYPES.filter(function (t) { return idx.totals[t] > 0; }).map(function (t) {
      var n = h('span', { class: 'rf-chip-n' });
      var b = h('button', { type: 'button', class: 'rf-chip', 'aria-pressed': 'false', onclick: function () {
        var i = f.types.indexOf(t);
        if (i > -1) f.types.splice(i, 1); else f.types.push(t);
        apply(); save();
      } }, h('span', null, t), n);
      chipEls[t] = { b: b, n: n };
      return b;
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
    symSel.addEventListener('change', function () { f.sym = symSel.value; apply(); save(); });
    perSel.addEventListener('change', function () { f.period = perSel.value; apply(); save(); });
    ctxSel.addEventListener('change', function () { f.ctx = ctxSel.value; apply(); save(); });
    var clearBtn = ui.btn({ label: 'Clear all', kind: 'quiet', small: true, onClick: function () {
      f.q = ''; f.types = []; f.sym = ''; f.period = ''; f.ctx = '';
      search.value = ''; symSel.value = ''; perSel.value = ''; ctxSel.value = '';
      apply(); save(); search.focus();
    } });

    el.appendChild(h('div', { class: 'card rf-bfilters', role: 'search', 'aria-label': 'Search the question bank' },
      h('div', { class: 'rf-bsearch-row' }, search, h('span', { class: 'hint rf-kbd' }, 'Press ', h('kbd', null, '/'), ' to search')),
      chips,
      h('div', { class: 'rf-bselects' }, ui.field('Symptom', symSel), ui.field('Period', perSel), ui.field('Life area', ctxSel))));

    var countEl = h('p', { class: 'rf-bcount', role: 'status', 'aria-live': 'polite', tabindex: '-1' });
    el.appendChild(h('div', { class: 'rf-bcount-row' }, countEl, clearBtn));

    /* ---- Overview (no search or filter yet): built once ---- */
    function setSym(id) { f.sym = id; symSel.value = id; apply(); save(); countEl.focus(); }
    function setType(t) { f.types = [t]; apply(); save(); countEl.focus(); }
    var perSym = {};
    idx.list.forEach(function (e) { if (e.sym) { var m = perSym[e.sym] = perSym[e.sym] || {}; m[e.type] = (m[e.type] || 0) + 1; } });
    var overview = h('div', { class: 'rf-ov' },
      h('p', { class: 'rf-ov-tip' }, 'Type a word or two to search everything, for example ', h('q', null, 'deadline'), ', ', h('q', null, 'keys'), ' or ', h('q', null, 'school report'), '. All words must match. Or start from a symptom:'),
      DIMS.map(function (d) {
        var list = idx.syms.filter(function (s) { return dimOf(s) === d[0]; });
        if (!list.length) return null;
        return h('section', { class: 'rf-ov-sec', 'aria-labelledby': 'rf-ov-' + d[0] },
          h('h2', { id: 'rf-ov-' + d[0] }, d[1]),
          h('div', { class: 'rf-ov-grid' }, list.map(function (s) {
            var m = perSym[s.id] || {};
            var parts = Object.keys(TYPE_WORDS).filter(function (t) { return m[t]; }).map(function (t) { return fmt(m[t]) + ' ' + TYPE_WORDS[t][m[t] === 1 ? 0 : 1]; });
            return h('button', { type: 'button', class: 'rf-ov-sym', onclick: function () { setSym(s.id); } },
              h('span', { class: 'rf-ov-code' }, divaCode(s) || dsmCode(s) || ''),
              h('span', { class: 'rf-ov-title' }, symTitle(s)),
              h('span', { class: 'rf-ov-counts' }, parts.join(' · ') || 'No items'));
          })));
      }),
      (function () {
        var other = ['Impairment', 'Onset', 'Collateral', 'Differential', 'History', 'Risk'].filter(function (t) { return idx.totals[t] > 0; });
        var supp = idx.list.filter(function (e) { return e.type === 'Question' && !e.sym; }).length;
        if (!other.length && !supp) return null;
        return h('section', { class: 'rf-ov-sec', 'aria-labelledby': 'rf-ov-other' },
          h('h2', { id: 'rf-ov-other' }, 'Other question sets'),
          h('div', { class: 'rf-chips rf-ov-sets' }, other.map(function (t) {
            return h('button', { type: 'button', class: 'rf-chip', onclick: function () { setType(t); } }, h('span', null, t), h('span', { class: 'rf-chip-n' }, fmt(idx.totals[t])));
          })));
      })());

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
            h('span', { class: 'rf-type' }, e.type), sep(),
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
        var c = chipEls[t];
        c.b.setAttribute('aria-pressed', f.types.indexOf(t) > -1 ? 'true' : 'false');
        U.clear(c.n);
        U.append(c.n, [fmt(tc[t]), h('span', { class: 'sr-only' }, tc[t] === 1 ? ' match' : ' matches')]);
      });
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
     Route: sym-<id> (one symptom's reference card, outside any assessment)
     ====================================================================== */

  /* Phones fold long lists (examples, probes, informant questions) to their headings; wider screens open them. */
  function narrow() { try { return window.matchMedia('(max-width: 640px)').matches; } catch (e) { return false; } }

  function exPeriod(groups, label, fold) {
    var gs = arr(groups).filter(function (g) { return isObj(g) && texts(g.items).length; });
    if (!gs.length) return null;
    var total = gs.reduce(function (n, g) { return n + texts(g.items).length; }, 0);
    return h('div', { class: 'rf-period' },
      h('h3', null, h('span', null, label), h('span', { class: 'rf-n' }, U.plural(total, 'example'))),
      h('div', { class: 'rf-ex' }, gs.map(function (g) {
        var items = texts(g.items);
        return h('details', { class: 'rf-exg', open: !fold },
          h('summary', null, h('span', null, txt(g.label) || txt(g.ctx) || 'Examples'), h('span', { class: 'rf-exg-n' }, String(items.length), h('span', { class: 'sr-only' }, items.length === 1 ? ' example' : ' examples'))),
          h('ul', null, items.map(li)));
      })));
  }

  function miniCard(title, items, cls, fold) {
    var list = texts(items);
    if (!list.length) return null;
    return h('details', { class: 'card rf-mini' + (cls ? ' ' + cls : ''), open: !fold },
      h('summary', null, h('span', { class: 'rf-mini-t' }, title), h('span', { class: 'rf-exg-n' }, String(list.length))), ui.list(list));
  }

  function renderSym(el, params) {
    var list = syms();
    var idx = -1;
    list.forEach(function (x, i) { if (x.id === params[0]) idx = i; });
    var s = idx > -1 ? list[idx] : null;
    if (!s) {
      notFound(el, 'Question bank', 'Symptom not found', 'This symptom is not in the interview content.', 'bank', 'Question bank');
      return;
    }
    var dsm = dsmCode(s), diva = divaCode(s);
    var last = lastA();
    var useRoute = last ? 'assess-' + last.id + '-' + dimOf(s).toLowerCase() + '-' + s.id : null;
    el.appendChild(ui.pageHead({
      eyebrow: [dsm ? 'DSM-5-TR ' + dsm : '', diva ? 'DIVA ' + diva : ''].filter(Boolean).join(' · ') || (dimOf(s) === 'HI' ? 'Hyperactivity and impulsivity' : 'Inattention'),
      title: symTitle(s), lead: txt(s.criterion) || null,
      actions: [
        useRoute ? ui.btn({ label: 'Use in an assessment', kind: 'primary', go: useRoute, title: 'Open this symptom in the assessment for ' + ((last.patient && last.patient.ref) || 'the current patient') }) : null,
        ui.btn({ label: 'Search the bank', kind: 'ghost', go: 'bank-' + s.id })
      ].filter(Boolean)
    }));

    /* ---- How it shows and why ---- */
    if (txt(s.adultForm) || txt(s.why)) {
      el.appendChild(h('div', { class: 'grid-2 rf-top' },
        txt(s.adultForm) ? h('section', { class: 'card', 'aria-labelledby': 'rf-af-h' }, h('h2', { id: 'rf-af-h' }, 'How it shows in adults'), h('p', null, s.adultForm)) : null,
        txt(s.why) ? h('section', { class: 'card', 'aria-labelledby': 'rf-why-h' }, h('h2', { id: 'rf-why-h' }, 'Why it happens'), h('p', null, s.why)) : null));
    }

    /* ---- Questions ---- */
    var ask = isObj(s.ask) ? s.ask : {};
    var qs = [['adult', 'Adulthood: the last 6 months'], ['child', 'Childhood: age 5 to 12']].filter(function (q) { return txt(ask[q[0]]); });
    if (qs.length) {
      el.appendChild(section('rf-q', 'Main questions', h('div', { class: 'rf-qs' }, qs.map(function (q) {
        return h('div', { class: 'rf-q' }, h('p', { class: 'rf-q-k' }, q[1]), h('p', { class: 'sx-ask' }, ask[q[0]]));
      })), ui.btn({ label: 'Copy questions', kind: 'ghost', small: true, onClick: function () {
        copyLines(qs.map(function (q) { return q[1] + ': ' + ask[q[0]]; }), 'Questions');
      } })));
    }
    var reph = texts(s.rephrase);
    if (reph.length) {
      el.appendChild(section('rf-reph', 'Other ways to ask', h('ol', { class: 'list rf-asklist rf-reph' }, reph.map(li)),
        ui.btn({ label: 'Copy all', kind: 'ghost', small: true, onClick: function () { copyLines(reph, 'Wordings'); } })));
    }

    /* ---- Examples ---- */
    var ex = isObj(s.examples) ? s.examples : {};
    var fold = narrow();
    var exA = exPeriod(ex.adult, 'Adulthood', fold), exC = exPeriod(ex.child, 'Childhood', fold);
    if (exA || exC) el.appendChild(section('rf-ex-sec', 'Examples by life area', [h('p', { class: 'hint rf-intro' }, 'Concrete behaviours to ask about or recognise in the patient\'s account. Tick them in the interview, not here.' + (fold ? ' Open a life area to see its examples.' : '')), exA, exC]));

    /* ---- Probes and informants ---- */
    var probes = arr(s.probes).filter(function (p) { return isObj(p) && texts(p.items).length; });
    if (probes.length) el.appendChild(section('rf-probes', 'Probes', h('div', { class: 'rf-mgrid' }, probes.map(function (p) { return miniCard(probeLabel(p), p.items, null, fold); }))));
    var inf = isObj(s.informant) ? s.informant : {};
    var infCards = [miniCard('Partner', inf.partner, null, fold), miniCard('Parent or carer', inf.parent, null, fold), miniCard('School reports: look for', inf.school, null, fold)].filter(Boolean);
    if (infCards.length) el.appendChild(section('rf-inf', 'Informant questions', h('div', { class: 'rf-mgrid' }, infCards)));

    /* ---- How to score ---- */
    var counts = texts(s.counts), notCount = texts(s.notCount);
    var anchors = arr(s.anchors).filter(function (a) { return isObj(a) && (txt(a.quote) || txt(a.why)); });
    if (counts.length || notCount.length || anchors.length) {
      el.appendChild(section('rf-score', 'How to score', [
        counts.length || notCount.length ? h('div', { class: 'rf-cols' },
          counts.length ? h('div', { class: 'rf-col rf-col-adhd' }, h('h3', null, 'Count it as present when'), ui.list(counts)) : null,
          notCount.length ? h('div', { class: 'rf-col rf-col-alt' }, h('h3', null, 'Do not count it when'), ui.list(notCount)) : null) : null,
        anchors.length ? h('div', { class: 'rf-anchors-wrap' }, h('h3', null, 'Calibration examples'),
          h('ul', { class: 'rf-anchors' }, anchors.map(function (a) {
            var m = ANCHOR[a.score] || ['Score', 'neutral'];
            return h('li', null, ui.badge(m[0], m[1]),
              h('div', null, txt(a.quote) ? h('p', { class: 'rf-anchor-q' }, a.quote) : null, txt(a.why) ? h('p', { class: 'rf-anchor-why' }, a.why) : null));
          }))) : null]));
    }

    /* ---- Could it be something else? ---- */
    var mimics = arr(s.mimics).filter(function (m) { return isObj(m) && txt(m.ddx); });
    if (mimics.length) {
      el.appendChild(section('rf-sm', 'Could it be something else?', h('ul', { class: 'rf-mlist' }, mimics.map(function (m) {
        var c = condById(m.ddx);
        return h('li', { class: 'rf-mitem' },
          h('h3', null, c ? go('cond-' + c.id, condName(c)) : m.ddx),
          txt(m.clue) ? h('p', null, h('span', { class: 'rf-k' }, 'Clue '), m.clue) : null,
          txt(m.ask) ? h('p', { class: 'rf-ask' }, h('span', { class: 'rf-k' }, 'Ask '), m.ask) : null);
      })), h('span', { class: 'rf-n' }, U.plural(mimics.length, 'condition'))));
    }

    /* ---- Special populations ---- */
    var sp = isObj(s.special) ? s.special : {};
    var spRows = SPECIAL.filter(function (x) { return txt(sp[x[0]]); }).map(function (x) { return [x[1], sp[x[0]]]; });
    Object.keys(sp).forEach(function (k) { if (!SPECIAL.some(function (x) { return x[0] === k; }) && txt(sp[k])) spRows.push([keyLabel(k), sp[k]]); });
    if (spRows.length) {
      el.appendChild(section('rf-sp-sec', 'Special populations', h('dl', { class: 'rf-special' }, spRows.map(function (r) {
        return h('div', null, h('dt', null, r[0]), h('dd', null, r[1]));
      }))));
    }

    var refs = texts(s.refs);
    if (refs.length) el.appendChild(section('rf-srefs', 'References', h('ol', { class: 'rf-refs' }, refs.map(li)), null, 'rf-sec-refs'));

    if (useRoute) {
      el.appendChild(h('div', { class: 'rf-use' },
        h('p', null, 'Ready to ask it? Open ', h('strong', null, symTitle(s)), ' in the assessment for ', (last.patient && last.patient.ref) || 'the current patient', '.'),
        ui.btn({ label: 'Use in an assessment', kind: 'primary', go: useRoute })));
    }
    var p = list[idx - 1], n = list[idx + 1];
    el.appendChild(pnNav(p ? { go: 'sym-' + p.id, t: symLabel(p) } : null, n ? { go: 'sym-' + n.id, t: symLabel(n) } : null, 'Previous and next symptom'));
  }

  /* ---------- Routes ---------- */
  AA.router.register('ddx', { title: 'Differential diagnosis', render: function (el) { renderDdx(el); } });
  AA.router.register('cond', {
    title: function (p) { var c = p && p[0] ? condById(p[0]) : null; return c ? condName(c) + ' · Differentials' : 'Condition'; },
    render: function (el, params) { renderCond(el, params || []); }
  });
  AA.router.register('criteria', { title: 'Diagnostic criteria', render: function (el) { renderCriteria(el); } });
  AA.router.register('bank', { title: 'Question bank', render: function (el, params) { return renderBank(el, params || []); } });
  AA.router.register('sym', {
    title: function (p) { var s = p && p[0] ? symById(p[0]) : null; return s ? symTitle(s) + ' · Symptoms' : 'Symptom'; },
    render: function (el, params) { renderSym(el, params || []); }
  });

  AA.views.reference = { bankIndex: bankIndex, groupLabel: groupLabel };
})(window.AA);
