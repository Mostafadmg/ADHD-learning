/* Interview steps: inattention (ia), hyperactivity-impulsivity (hi), onset and impairment (onset)
   and collateral information (collateral). See ARCHITECTURE.md, section 6.
   These steps are used live while the patient is in the room, so every control writes straight to
   the store and then updates only the small parts of the page that depend on it (counts, hints,
   status pills). Ticking an example never re-renders the card, so scroll position and focus stay put.
   Routes: assess-<id>-ia (overview of the nine symptoms) and assess-<id>-ia-ia3 (one symptom); same for hi.

   Age mode. Adults (18+, or no age) see the adult interview: adulthood then childhood.
   Young people (6-17) see the same record keys with young labels: symptoms.<id>.adult is "Now (last 6
   months)" and symptoms.<id>.child is "Before age 12". A child of 6-11 has only the current period
   (it is also before 12). Questions come from ask.parent / ask.teen / ask.teacher, per-source ratings
   are saved in symptoms.<id>.by.{parent,teacher,self}, and collateral uses parent now, teacher and the
   young person's own view. Under 6: no interview (refer). Band helpers come from AA.diagnosis, with
   local fallbacks so the view still works if the engine or the band data is older. */
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
  var SPECIAL_YOUNG = [['young', 'Children and young people'], ['women', 'Women and girls'], ['highIQ', 'High ability or high IQ'],
    ['sud', 'Substance use'], ['asd', 'Autism'], ['culture', 'Culture and language']];
  var PROBE_LABEL = { frequency: 'How often', severity: 'How severe', pervasive: 'In which settings', duration: 'How long',
    peers: 'Compared with others', impact: 'Impact', compensation: 'Coping and compensation', onset: 'When it started' };
  var SEV_DEFAULT = [{ v: 0, l: 'None' }, { v: 1, l: 'Mild' }, { v: 2, l: 'Moderate' }, { v: 3, l: 'Severe' }];

  /* Labels for the two record periods. Adults keep the original wording; young people read
     "Now" and "Before age 12" (long labels come from D.periodLabel when it is available). */
  var LBL_ADULT = {
    adult: { tab: 'Adulthood', long: 'Adulthood (last 6 months)', short: 'Adult', col: 'Adult', imp: 'Adulthood', of: 'adult' },
    child: { tab: 'Childhood', long: 'Childhood (age 5-12)', short: 'Child', col: 'Child', imp: 'Childhood and adolescence', of: 'child' }
  };
  var LBL_YOUNG = {
    adult: { tab: 'Now', long: 'Now (last 6 months)', short: 'Now', col: 'Now', of: 'now' },
    child: { tab: 'Before age 12', long: 'Before age 12', short: 'Before 12', col: 'Before 12', of: 'before 12' }
  };
  /* Fallback young impairment labels (the band data, ageBands[band].impairmentLabels, wins when loaded). */
  var YOUNG_IMP = { work: 'School and learning', relationships: 'Family and home', social: 'Friends and peers', leisure: 'Play and activities',
    selfimage: 'Self-esteem', daily: 'Self-care and independence', safety: 'Accidents and risk-taking' };
  /* Differentials that only apply to adults, hidden from a young person's symptom card unless already
     flagged (a differential's own ages: 'adult' field wins when present). */
  var ADULT_ONLY_DDX = ['mci', 'menopause', 'burnout', 'aspd'];

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
  function scoreBadge(v) { return v && SCORE_LABEL[v] ? ui.badge(SCORE_LABEL[v], SCORE_KIND[v]) : h('span', { class: 'iv-none' }, 'Not scored'); }
  function ddxName(id) { var c = AA.byId('ddx', id); return c ? c.name : id; }
  function sevList() { var s = arr(imp().severity); return s.length ? s : SEV_DEFAULT; }
  function sevLabel(v) { var m = sevList().filter(function (x) { return x.v === v; })[0]; return m ? m.l : String(v); }
  function supKey(dim, p) { return dim.toLowerCase() + (p === 'adult' ? 'Adult' : 'Child'); }

  /* ---------- Age mode ---------- */
  function ageOf(a) { var n = a && a.patient ? parseInt(a.patient.age, 10) : NaN; return isNaN(n) ? null : n; }
  function callD(name, a, extra) {
    try { if (D && typeof D[name] === 'function') return extra === undefined ? D[name](a) : D[name](a, extra); } catch (e) { /* use the fallback */ }
    return undefined;
  }
  function bandOf(a) {
    var b = callD('band', a);
    if (typeof b === 'string' && b) return b;
    var n = ageOf(a);
    return n === null || n >= 18 ? 'adult' : n < 6 ? 'under6' : n < 12 ? 'child' : n < 17 ? 'teen' : 'y17';
  }
  /* The mode object every step works from: band, young or not, the periods in use and their labels. */
  function modeOf(a) {
    a = a || {};
    var b = bandOf(a);
    var bi = callD('bandInfo', a);
    if (!bi || typeof bi !== 'object') bi = (AA.data.ageBands && AA.data.ageBands[b]) || {};
    var yd = callD('young', a);
    var young = b !== 'under6' && (typeof yd === 'boolean' ? yd : (b === 'child' || b === 'teen' || b === 'y17'));
    var pers = ['adult', 'child'];
    if (young) {
      var p = callD('periods', a);
      if (!Array.isArray(p) || !p.length) p = arr(bi.periods).length ? bi.periods : (b === 'child' ? ['adult'] : ['adult', 'child']);
      pers = ['adult', 'child'].filter(function (k) { return p.indexOf(k) > -1; });
      if (!pers.length) pers = ['adult'];
    }
    var plabels = bi.periodLabels || {};
    var m = {
      a: a, band: b, info: bi, young: young, stop: b === 'under6', pers: pers, one: pers.length === 1,
      child: young && b === 'child',
      selfLabel: b === 'child' ? 'Child' : 'Young person',
      selfWho: b === 'child' ? 'child' : 'young person',
      need: callD('need', a) || 6,
      several: (D && typeof D.SEVERAL === 'number') ? D.SEVERAL : 3
    };
    m.L = function (p, kind) {
      if (!young) return (LBL_ADULT[p] || LBL_ADULT.adult)[kind] || '';
      var set = LBL_YOUNG[p] || LBL_YOUNG.adult;
      if (kind === 'long' || kind === 'imp') {
        var s = callD('periodLabel', a, p);
        return (typeof s === 'string' && s) || plabels[p] || set.long;
      }
      return set[kind] || '';
    };
    /* Young: done when every period in use is scored (a child of 6-11 has one period). */
    m.state = function (r) {
      r = r || {};
      var n = pers.filter(function (p) { return r[p]; }).length;
      return n === pers.length ? 'done' : n ? 'part' : 'todo';
    };
    m.domLabel = function (d) {
      if (!young) return d.label || d.id;
      var il = bi.impairmentLabels || {};
      return il[d.id] || YOUNG_IMP[d.id] || d.label || d.id;
    };
    return m;
  }
  /* The per-source ratings shown for young people (current period only). */
  function sources(m) { return [{ k: 'parent', l: 'Parent' }, { k: 'teacher', l: 'Teacher' }, { k: 'self', l: m.selfLabel }]; }

  /* Under 6: this tool does not assess. Shown instead of an interview step. */
  function stopCard(el, ctx, m) {
    el.appendChild(h('section', { class: 'card iv-stop' },
      h('h2', null, 'No interview for children under 6'),
      h('p', null, m.info.note || 'This tool does not assess children under 6. Refer to a service with expertise in ADHD in young children.'),
      ui.btn({ label: '← Back to setup', kind: 'secondary', onClick: function () { ctx.go('setup'); } })));
  }

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
      var m = modeOf(ctx.a());
      if (m.stop) { stopCard(el, ctx, m); return null; }
      var list = symsOf(dim);
      if (!list.length) {
        el.appendChild(ui.empty('Symptom content not loaded', 'The interview questions for this part are not available in this build.'));
        return null;
      }
      if (ctx.sub) {
        var idx = -1;
        list.forEach(function (s, i) { if (s.id === ctx.sub) idx = i; });
        if (idx > -1) return renderSymptom(el, ctx, list, idx, m);
        el.appendChild(ui.callout('warn', h('p', null, 'That symptom is not part of this section. Here is the overview instead.')));
      }
      return renderOverview(el, ctx, dim, list, m);
    } };
  }
  AA.steps.ia = interviewStep('IA');
  AA.steps.hi = interviewStep('HI');

  /* How-to rules for the overview. Adults keep the original list. */
  function howTo(m) {
    if (!m.young) return [
      'Adulthood means the last 6 months. Childhood means age 5 to 12.',
      'Look for long-standing traits, present most of the time. Problems that only appear during an episode of low mood, anxiety, stress or substance use do not count.',
      'Ask for real examples from the patient\'s own life. A general "yes, that\'s me" is not enough.',
      'Tick the examples the patient describes, note their own words, then score Yes, Unsure or No.',
      'Score Yes only when the problem is clearly more frequent or severe than in most people of the same age, and it causes difficulties.'
    ];
    var who = m.child ? 'children' : 'young people';
    return [
      m.one ? 'Ask about the last 6 months. For a child under 12, these answers also show that symptoms were present before age 12.'
        : 'Now means the last 6 months. Before age 12 means the primary school years. Score both for each symptom.',
      m.child ? 'Ask the parent or carer for examples from home, and the teacher for examples from school. Ask the child for their own view too.'
        : 'Ask the young person, and see them alone for part of the time. Ask the parent or carer and the teacher for examples too.',
      'Look for long-standing traits, present most of the time and in more than one setting, such as home and school. Problems that only appear with low mood, anxiety, stress, a change at home or school, or substance use do not count.',
      'Tick the examples given and note their own words. Then score Yes, Unsure or No as your overall judgement across all the sources.',
      'Score Yes only when the problem is clearly more frequent or severe than in most ' + who + ' of the same age and developmental level, and it causes difficulties.',
      'Being one of the youngest in the school year can make a child look less mature than classmates. Compare with children of the same age, not only the same class.'
    ];
  }

  /* ---------- Overview: instructions, the nine symptoms, supplement question ---------- */
  function renderOverview(el, ctx, dim, list, m) {
    var key = dim.toLowerCase();
    var a = ctx.a() || {};
    var rec = a.symptoms || {};
    var need = m.need, ad = D.counts(a, 'adult'), ch = D.counts(a, 'child');
    var first = list.filter(function (s) { return m.state(rec[s.id]) !== 'done'; })[0];
    var started = list.some(function (s) { return m.state(rec[s.id]) !== 'todo'; });
    var wrap = h('div', { class: 'iv stack' });

    function tally(name, n, unsure, answered, of, thr, thrNote, hit, hitText) {
      return h('div', { class: 'iv-tally-item' },
        h('p', { class: 'iv-tally-k' }, name),
        h('p', { class: 'iv-tally-v' }, h('span', { class: 'num' }, String(n)), h('small', null, ' of ' + of + ' present')),
        h('p', { class: 'hint' }, [unsure ? unsure + ' unsure' : null, of - answered ? (of - answered) + ' not scored' : null, thrNote + (thr === null ? '' : ' ' + thr)].filter(Boolean).join(' · ')),
        (hit === undefined ? n >= thr : hit) ? ui.badge(hitText || 'Threshold reached', 'ok') : null);
    }
    function openSym(sid) { focusCard = true; ctx.go(ctx.step, sid); }
    var cta = first
      ? ui.btn({ label: (started ? 'Continue with ' : 'Start with ') + label(first), kind: 'primary', onClick: function () { openSym(first.id); } })
      : ui.btn({ label: 'Review from ' + label(list[0]), kind: 'secondary', onClick: function () { openSym(list[0].id); } });
    var supNote = h('span', { class: 'iv-cta-sup', 'aria-live': 'polite' });
    function paintSupNote() {
      var sp = ctx.get('supplement', {}) || {};
      U.clear(supNote);
      var done = m.pers.every(function (p) { return sp[supKey(dim, p)]; });
      supNote.appendChild(done ? ui.badge('Supplement question answered', 'ok')
        : h('span', null, 'Next: answer the supplement question below.'));
    }

    var tallies;
    if (!m.young) {
      tallies = [
        tally('Adulthood', ad[dim], ad['unsure' + dim], ad['answered' + dim], list.length, need, 'DSM-5-TR threshold'),
        tally('Childhood', ch[dim], ch['unsure' + dim], ch['answered' + dim], list.length, 6, 'DIVA convention')];
    } else {
      tallies = [tally(m.L('adult', 'long'), ad[dim], ad['unsure' + dim], ad['answered' + dim], list.length, need, 'DSM-5-TR threshold')];
      if (!m.one) {
        /* Criterion B asks for several symptoms before 12, counted across both parts (not a full count). */
        tallies.push(tally(m.L('child', 'long'), ch[dim], ch['unsure' + dim], ch['answered' + dim], list.length, null,
          'Criterion B needs several before age 12, counted across both parts (this app uses ' + m.several + ' or more)',
          (ch.IA + ch.HI) >= m.several, 'Several before 12 (both parts)'));
      }
    }

    wrap.appendChild(h('section', { class: 'card iv-intro' },
      h('h2', null, 'Progress in this part'),
      h('div', { class: 'iv-tally' + (tallies.length === 1 ? ' is-one' : '') }, tallies),
      h('div', { class: 'iv-cta' }, cta,
        first ? null : h('p', { class: 'iv-cta-note' }, ui.badge('All ' + list.length + ' symptoms scored', 'ok'), supNote)),
      ui.details('How to run this part', ui.list(howTo(m), 'list iv-rules'), { open: !started, cls: 'iv-howto' })));

    /* Symptom table: each row opens the symptom. On phones the rows stack into compact cards. */
    var tbody = h('tbody');
    var srcList = m.young ? sources(m) : [];
    list.forEach(function (s) {
      var r = rec[s.id] || {};
      var open = function () { openSym(s.id); };
      var flags = Object.keys(r.flags || {}).filter(function (k) { return r.flags[k]; }).map(ddxName);
      var inf = [];
      if (m.young) {
        var by = r.by || {};
        srcList.forEach(function (src) { if (SCORE_LABEL[by[src.k]]) inf.push(src.l + ' ' + SCORE_LABEL[by[src.k]].toLowerCase()); });
        if (has(r.infA)) inf.push((m.one ? 'Support ' : 'Now ') + INF_LABEL[r.infA]);
        if (!m.one && has(r.infC)) inf.push('Before 12 ' + INF_LABEL[r.infC]);
      } else {
        if (has(r.infA)) inf.push('Adult ' + INF_LABEL[r.infA]);
        if (has(r.infC)) inf.push('Child ' + INF_LABEL[r.infC]);
      }
      var nA = size(r.exA), nC = size(r.exC);
      var exTxt = !(nA || (!m.one && nC)) ? null
        : m.one ? 'Examples ticked: ' + nA
        : 'Examples ticked: ' + nA + ' ' + m.L('adult', 'of') + ', ' + nC + ' ' + m.L('child', 'of');
      tbody.appendChild(h('tr', { class: 'iv-row is-' + m.state(r), onclick: function (e) { if (!e.target.closest('button, a')) open(); } },
        h('td', { class: 'iv-code num' }, code(s)),
        h('th', { scope: 'row' },
          h('button', { type: 'button', class: 'iv-link', onclick: open }, s.title || s.id),
          exTxt ? h('span', { class: 'iv-sub' }, exTxt) : null),
        m.pers.map(function (p) {
          return h('td', { 'data-label': m.L(p, 'col'), class: 'iv-c-' + p }, scoreBadge(r[p]));
        }),
        h('td', { 'data-label': m.young ? 'Sources' : 'Informant', class: 'iv-c-inf' }, inf.length ? inf.join(', ') : h('span', { class: 'iv-none' }, 'Not rated')),
        h('td', { 'data-label': 'Differentials', class: 'iv-c-ddx' }, flags.length ? flags.join(', ') : h('span', { class: 'iv-none' }, 'None'))));
    });
    var head = ['Code', 'Symptom'].concat(m.pers.map(function (p) { return m.L(p, 'col'); }), [m.young ? 'Sources' : 'Informant', 'Differentials flagged']);
    wrap.appendChild(h('section', { class: 'iv-sec' },
      h('h2', null, 'Symptoms in this part'),
      h('p', { class: 'hint' }, 'Select a symptom to open it. Scores update here as you go.'),
      h('div', { class: 'table-wrap iv-tablewrap' }, h('table', { class: 'table iv-table' + (m.one ? ' is-one' : '') },
        h('thead', null, h('tr', null, head.map(function (c) { return h('th', { scope: 'col' }, c); }))),
        tbody))));

    /* DIVA-style supplement question. Young people: the current question comes from supplement.<dim>.young. */
    var sup = (imp().supplement || {})[key] || {};
    var supHead = h('h2', { tabindex: '-1' }, 'Supplement question');
    var supSec = h('section', { class: 'card iv-sup' }, supHead,
      h('p', { class: 'muted' }, m.young
        ? 'Ask once the nine symptoms are done. It checks the overall picture: are these problems greater than in other ' + (m.child ? 'children' : 'young people') + ' of the same age and developmental level?'
        : 'Ask once the nine symptoms are done. It checks the overall picture: are these problems greater than in other people of the same age?'));
    m.pers.forEach(function (p) {
      var path = 'supplement.' + supKey(dim, p);
      var head2 = m.young ? m.L(p, 'long') : (p === 'adult' ? 'Adulthood' : 'Childhood (age 5-12)');
      var q = m.young && p === 'adult' ? (sup.young || sup.adult) : sup[p];
      supSec.appendChild(h('div', { class: 'iv-sup-item' },
        h('h3', null, head2),
        h('p', { class: 'iv-sup-q' }, q || 'The supplement question is not available in this build. Ask whether these problems are greater than in others of the same age.'),
        ui.seg({ label: 'Supplement answer, ' + head2.toLowerCase(), hideLabel: true, options: YN, value: ctx.get(path, null), onChange: function (v) { ctx.set(path, nil(v)); } })));
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

  /* Example groups for one period. Adults: examples.adult / examples.child as written.
     Young people now: the child contexts (school, homework, home, play, activities), plus the
     secondary school group from 12 (shown first); before 12: every child context except secondary school.
     Ticked keys stay "<ctx>.<index>", so the order shown here never changes what is stored. */
  function exampleGroups(s, p, m) {
    var ex = s.examples || {};
    if (!m.young) return arr(ex[p]);
    var ch = arr(ex.child).filter(Boolean);
    if (p === 'adult') {
      var teenOk = m.band !== 'child';
      var gs = ch.filter(function (g) { return g.ctx !== 'reports' && (g.ctx !== 'teen' || teenOk); });
      return gs.filter(function (g) { return g.ctx === 'teen'; }).concat(gs.filter(function (g) { return g.ctx !== 'teen'; }));
    }
    return ch.filter(function (g) { return g.ctx !== 'teen'; });
  }

  /* The question box: the main question to read aloud, and for young people the other informants' questions. */
  function askBox(s, p, m) {
    var ask = s.ask || {};
    var isA = p === 'adult';
    if (!m.young) {
      return h('div', { class: 'sx-ask iv-ask' },
        h('span', { class: 'iv-ask-k' }, isA ? 'Ask about the last 6 months' : 'Ask about age 5 to 12'),
        h('span', { class: 'iv-ask-q' }, ask[p] || (isA ? 'Ask how this affects the patient now.' : 'Ask how this was in primary school.')),
        !isA && ask.adult ? h('span', { class: 'sx-ask-sub' }, 'Adult question, for context: ' + ask.adult) : null);
    }
    var k, q, more = [];
    if (!isA) {
      k = 'Ask the young person about before age 12';
      q = ask.child || 'Ask how this was at primary school, before age 12.';
    } else if (m.child) {
      k = 'Ask the parent or carer · last 6 months';
      q = ask.parent || 'Ask the parent or carer how this shows now, at home and at school.';
      if (ask.teacher) more.push(['Ask the teacher', ask.teacher]);
    } else {
      k = 'Ask the young person · last 6 months';
      q = ask.teen || 'Ask the young person how this affects them now, at school, at home and with friends.';
      if (ask.parent) more.push(['Ask the parent or carer', ask.parent]);
      if (ask.teacher) more.push(['Ask the teacher', ask.teacher]);
    }
    return h('div', { class: 'sx-ask iv-ask' },
      h('span', { class: 'iv-ask-k' }, k),
      h('span', { class: 'iv-ask-q' }, q),
      !isA ? h('span', { class: 'sx-ask-sub' }, 'Ask the parent or carer the same, using the questions under Informant below.') : null,
      more.map(function (x) {
        return h('span', { class: 'iv-ask-alt' }, h('span', { class: 'iv-ask-k' }, x[0]), h('span', { class: 'iv-ask-aq' }, x[1]));
      }));
  }

  /* Mimics to offer. Young people do not see adult-only differentials, unless one is already flagged. */
  function mimicsFor(s, m, r) {
    var list = arr(s.mimics).filter(function (x) { return x && x.ddx; });
    if (!m.young) return list;
    var flags = (r && r.flags) || {};
    return list.filter(function (x) {
      if (flags[x.ddx]) return true;
      var c = AA.byId('ddx', x.ddx);
      if (c && c.ages) return c.ages !== 'adult';
      return ADULT_ONLY_DDX.indexOf(x.ddx) < 0;
    });
  }

  /* ---------- One symptom ---------- */
  function renderSymptom(el, ctx, list, idx, m) {
    var s = list[idx];
    var base = 'symptoms.' + s.id;
    var rec = function () { return ctx.get(base, {}) || {}; };
    var r0 = rec();
    var prevS = list[idx - 1], nextS = list[idx + 1];
    var ready = false;
    var two = !m.one;
    var curTab = two && r0.adult && !r0.child ? 'child' : 'adult';
    var titleId = ui.nid('sx');

    function goTo(i) {
      if (i < 0) { ctx.go(ctx.step); return; }
      if (i >= list.length) { focusSupplement = true; ctx.go(ctx.step); return; }
      focusCard = true;
      ctx.go(ctx.step, list[i].id);
    }

    var root = h('article', { class: 'iv iv-sym' + (m.young ? ' is-young' : ''), 'aria-labelledby': titleId });

    /* Header: codes, title, position and previous / next. DIVA and ASRS item codes are adult tools, so
       young people see the DSM-5-TR code only. */
    var codes = s.codes || {};
    var asrs = arr(codes.asrs);
    var title = h('h2', { class: 'iv-title', id: titleId, tabindex: '-1' }, s.title || s.id);
    root.appendChild(h('header', { class: 'iv-head' },
      h('div', { class: 'iv-head-main' },
        h('div', { class: 'iv-codes' },
          codes.dsm5 ? ui.badge('DSM-5-TR ' + codes.dsm5, 'accent') : null,
          !m.young && codes.diva ? ui.badge('DIVA ' + codes.diva, 'neutral') : null,
          !m.young && asrs.length ? ui.badge('ASRS ' + (asrs.length > 1 ? 'items ' : 'item ') + asrs.join(', '), 'neutral') : null),
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
    var doneTxt = m.one ? 'scored' : m.young ? 'now and before 12 scored' : 'adult and child scored';
    function paintChip(i, r) {
      var st = m.state(r);
      var b = chips[i];
      b.className = 'iv-chip is-' + st;
      var txt = { done: doneTxt, part: 'partly scored', todo: 'not scored' }[st];
      b.setAttribute('aria-label', label(list[i]) + ', ' + txt + (i === idx ? ', current' : ''));
      b.title = label(list[i]) + ' (' + txt + ')';
    }
    var all = ctx.get('symptoms', {}) || {};
    list.forEach(function (x, i) { paintChip(i, all[x.id]); });
    root.appendChild(strip);
    root.appendChild(h('p', { class: 'hint iv-keys' }, 'Shortcut: press ', h('kbd', null, '←'), ' or ', h('kbd', null, '→'), ' to move between symptoms when you are not typing.'));

    /* Score panel: sticky under the step strip on large screens; a compact bar fixed to the bottom of the
       screen on phones and tablets, so the clinician can tick examples and score without scrolling back.
       It is always the clinician's overall rating, whatever the sources said. */
    var nudge = {};
    m.pers.forEach(function (p) { nudge[p] = h('p', { class: 'iv-nudge', 'aria-live': 'polite' }); });
    /* Current period first, then before 12 / childhood, for every symptom (DIVA order). */
    var tabs = null;
    function showChild() { if (tabs) tabs.show('child'); if (root.scrollIntoView) root.scrollIntoView({ block: 'start' }); }
    var toChild = two ? ui.btn({ label: m.young ? 'Ask about before age 12' : 'Ask about childhood', kind: 'quiet', small: true, onClick: showChild }) : null;
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
    /* Phone bar: once the current score is set, the main button first leads to the second period. */
    var barNextAria = nextS ? 'Next symptom: ' + label(nextS) : 'Finish: supplement question and summary';
    var barLabel = h('span', null, nextS ? 'Next' : 'Finish');
    var barNext = h('button', { type: 'button', class: 'btn btn-primary iv-bar-next', 'aria-label': barNextAria, onclick: function () {
      if (barNext.getAttribute('data-child') === 'true') showChild(); else goTo(idx + 1);
    } }, barLabel, h('span', { 'aria-hidden': 'true' }, '→'));
    var score = h('section', { class: 'sx-score iv-score' + (two ? '' : ' is-one'), 'aria-label': 'Score this symptom', 'data-tab': curTab },
      m.pers.map(function (p) { return scoreCol(p, m.L(p, 'long'), m.L(p, 'short'), p === 'child' ? toChild : null); }),
      barNext);
    root.appendChild(score);

    /* Period tabs. Each tab is built once and kept, so filters and ticks survive switching.
       A child of 6-11 has one period, so the card shows it without tabs. */
    var cache = {};
    var periodHost = null;
    if (two) {
      tabs = ui.tabs(m.pers.map(function (p) {
        var exKey = p === 'adult' ? 'exA' : 'exC';
        return { id: p, label: [m.L(p, 'tab'), h('span', { class: 'sr-only' }, ', examples ticked:')], count: size(r0[exKey]),
          render: function () { return cache[p] || (cache[p] = buildPeriod(p)); } };
      }), curTab, function (id) { curTab = id; score.setAttribute('data-tab', id); if (ready) sync(); });
      tabs.classList.add('iv-tabs');
      root.appendChild(tabs);
    } else {
      periodHost = h('div', { class: 'iv-tabs iv-one' }, buildPeriod('adult'));
      root.appendChild(periodHost);
    }

    function buildPeriod(p) {
      var isA = p === 'adult';
      var exKey = isA ? 'exA' : 'exC', otherKey = isA ? 'otherA' : 'otherC', infKey = isA ? 'infA' : 'infC';
      var r = rec();
      var box = h('div', { class: 'iv-period' });

      box.appendChild(askBox(s, p, m));
      /* Other wordings are written for the person themselves: adults, and young people of 12+ now. */
      if (arr(s.rephrase).length && (!m.young || (isA && !m.child))) box.appendChild(ui.details('Other ways to ask', ui.list(s.rephrase), { meta: String(s.rephrase.length) }));

      /* Examples checklist with filter. */
      var groups = exampleGroups(s, p, m);
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
      var tickWho = m.young ? 'Tick what the parent, teacher or ' + m.selfWho + ' describes. ' : 'Tick what the patient describes. ';
      box.appendChild(h('div', { class: 'iv-ex-head' },
        h('h3', null, 'Examples'),
        h('p', { class: 'hint' }, total ? tickWho + total + ' examples in ' + groups.length + ' areas of life.' : 'No examples are available for this symptom in this build.')));
      if (total) {
        box.appendChild(h('div', { class: 'iv-tools' }, search, onlyBtn));
        box.appendChild(exHost);
        box.appendChild(empty);
      }

      /* Own words. */
      var ownLabel, ownPh;
      if (!m.young) {
        ownLabel = isA ? 'Patient\'s own examples (adulthood)' : 'Patient\'s own examples (childhood)';
        ownPh = isA ? 'In their words: what happens, where, how often' : 'In their words, or what parents and teachers said';
      } else if (isA) {
        ownLabel = m.one ? 'Examples in their own words' : 'Examples in their own words (now)';
        ownPh = 'What the parent, teacher or ' + m.selfWho + ' said: what happens, where, how often';
      } else {
        ownLabel = 'Examples in their own words (before age 12)';
        ownPh = 'What the young person and parent remember, or what old school reports said';
      }
      box.appendChild(ui.field(ownLabel, ui.input({ rows: 3, value: r[otherKey] || '', placeholder: ownPh,
        onSave: function (v) { ctx.set(base + '.' + otherKey, v.trim() ? v : undefined); sync(); } })));

      /* Informant agreement (and, for young people now, who reports it). */
      var inf = s.informant || {};
      var infBox = h('div', { class: 'iv-inf' }, h('h3', null, m.young && isA ? 'Sources' : 'Informant'));
      if (m.young && isA) {
        var by = r.by || {};
        infBox.appendChild(h('div', { class: 'iv-by', role: 'group', 'aria-label': 'Who reports this now (optional)' },
          h('p', { class: 'iv-by-k' }, 'Who reports it now', h('span', { class: 'hint' }, ' · optional')),
          h('div', { class: 'iv-by-grid' }, sources(m).map(function (src) {
            return h('div', { class: 'iv-by-item' },
              h('span', { class: 'iv-by-l', 'aria-hidden': 'true' }, src.l),
              ui.seg({ label: src.l + ': reports this symptom now', hideLabel: true, small: true, options: YNU, value: by[src.k] || null,
                onChange: function (v) { ctx.set(base + '.by.' + src.k, nil(v)); } }));
          })),
          h('p', { class: 'hint iv-by-hint' }, 'Record what each source says. Your score stays your overall clinical judgement across all of them.')));
      }
      var infQ = !m.young ? (isA ? 'Does a partner or close friend confirm this?' : 'Does a parent or school report confirm this?')
        : isA ? 'Does a second source confirm it (for example the teacher as well as the parent)?' : 'Does a parent or an old school report confirm this?';
      var infHint = m.young && isA ? '0 none or little, 1 some, 2 clear support. Use n/a if only one source has commented.'
        : '0 none or little, 1 some, 2 clear support. Use n/a if nobody has commented.';
      infBox.appendChild(qrow(infQ,
        ui.seg({ label: m.L(p, 'tab') + ' informant support', hideLabel: true, options: INF_OPTS, value: has(r[infKey]) ? r[infKey] : null,
          onChange: function (v) { ctx.set(base + '.' + infKey, nil(v)); } }),
        h('span', { class: 'hint' }, infHint)));
      if (!m.young) {
        if (isA && arr(inf.partner).length) infBox.appendChild(ui.details('Questions for a partner or close friend', ui.list(inf.partner), { meta: String(inf.partner.length) }));
        if (!isA && arr(inf.parent).length) infBox.appendChild(ui.details('Questions for a parent or older relative', ui.list(inf.parent), { meta: String(inf.parent.length) }));
        if (!isA && arr(inf.school).length) infBox.appendChild(ui.details('What to look for in school reports', ui.list(inf.school), { meta: String(inf.school.length) }));
      } else if (isA) {
        if (arr(inf.teacher).length) infBox.appendChild(ui.details('What a teacher may say', ui.list(inf.teacher), { meta: String(inf.teacher.length) }));
        if (arr(inf.school).length) infBox.appendChild(ui.details('What to look for in school reports', ui.list(inf.school), { meta: String(inf.school.length) }));
      } else {
        if (arr(inf.parent).length) infBox.appendChild(ui.details('Questions for a parent or carer (before age 12)', ui.list(inf.parent), { meta: String(inf.parent.length) }));
        if (arr(inf.school).length) infBox.appendChild(ui.details('What to look for in primary school reports', ui.list(inf.school), { meta: String(inf.school.length) }));
      }
      box.appendChild(infBox);
      return box;
    }

    /* Reference sections, collapsed. */
    var refs = h('div', { class: 'iv-refs' });

    if (arr(s.counts).length || arr(s.notCount).length || arr(s.anchors).length) {
      var scoreHelp = h('div', { class: 'stack' },
        m.young ? h('p', { class: 'hint iv-young-note' }, 'These rules were written with adults in mind. For a ' + m.selfWho + ', compare with others of the same age and developmental level, and look for the problem both at home and at school.') : null,
        h('div', { class: 'iv-rules-grid' },
          arr(s.counts).length ? h('div', { class: 'iv-rule iv-rule-yes' }, h('h3', null, 'Score Yes when'), ui.list(s.counts)) : null,
          arr(s.notCount).length ? h('div', { class: 'iv-rule iv-rule-no' }, h('h3', null, 'Do not count it when'), ui.list(s.notCount)) : null));
      if (arr(s.anchors).length) {
        scoreHelp.appendChild(h('div', null,
          h('h3', null, 'Calibration examples'),
          h('p', { class: 'hint' }, m.young ? 'Realistic adult answers and how to score them. Use them to calibrate, then judge against the child\'s age.' : 'Realistic answers and how to score them.'),
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

    var mimics = mimicsFor(s, m, r0);
    if (mimics.length) {
      var flagMeta = function () { var n = size(rec().flags); return n ? n + ' flagged' : String(mimics.length) + ' to consider'; };
      var mimicBox = h('div', { class: 'iv-mimics' }, h('p', { class: 'hint' }, 'Flagged conditions are listed for review in the differential diagnosis step.'));
      var mimicDet = ui.details('Could it be something else?', mimicBox, { meta: flagMeta() });
      mimics.forEach(function (mm) {
        var btn = h('button', { type: 'button', class: 'btn btn-ghost btn-sm iv-flag' });
        var paint = function (on) {
          btn.setAttribute('aria-pressed', on ? 'true' : 'false');
          U.clear(btn);
          U.append(btn, [h('span', { class: 'iv-flag-box', 'aria-hidden': 'true' }, on ? '✓' : ''), on ? 'Flagged for differential review' : 'Flag for differential review']);
        };
        paint(!!(rec().flags || {})[mm.ddx]);
        btn.addEventListener('click', function () {
          var on = btn.getAttribute('aria-pressed') !== 'true';
          ctx.set(base + '.flags.' + mm.ddx, on ? true : undefined);
          paint(on);
          setMeta(mimicDet, flagMeta());
        });
        mimicBox.appendChild(h('div', { class: 'iv-mimic' },
          h('div', { class: 'iv-mimic-head' },
            h('h3', null, h('a', { href: '#cond-' + mm.ddx, 'data-go': 'cond-' + mm.ddx }, ddxName(mm.ddx))),
            btn),
          mm.clue ? h('p', null, h('strong', null, 'Points to it: '), mm.clue) : null,
          mm.ask ? h('p', { class: 'iv-mimic-ask' }, h('strong', null, 'Ask: '), mm.ask) : null));
      });
      refs.appendChild(mimicDet);
    }

    var sp = s.special || {};
    var spRows = (m.young ? SPECIAL_YOUNG : SPECIAL).filter(function (x) { return sp[x[0]]; });
    if (spRows.length) {
      refs.appendChild(ui.details('Special populations', h('dl', { class: 'iv-dl iv-dl-grid' }, spRows.map(function (x) {
        return h('div', null, h('dt', null, x[1]), h('dd', null, sp[x[0]]));
      }))));
    }

    var what = [['Criterion (paraphrased)', s.criterion], m.young ? null : ['How it shows in adults', s.adultForm], ['What underlies it', s.why]]
      .filter(function (x) { return x && x[1]; });
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
      m.pers.forEach(function (p) {
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
      var askChild = !!(two && r.adult && !r.child && curTab === 'adult');
      if (toChild) toChild.hidden = !askChild || !nudge.child.hidden;
      barNext.setAttribute('data-child', askChild ? 'true' : 'false');
      barNext.setAttribute('aria-label', askChild ? (m.young ? 'Ask about before age 12 for this symptom' : 'Ask about childhood for this symptom') : barNextAria);
      barLabel.textContent = askChild ? (m.young ? 'Before 12' : 'Child') : nextS ? 'Next' : 'Finish';
      if (tabs && tabs.setCount) m.pers.forEach(function (p) { tabs.setCount(p, size(r[p === 'adult' ? 'exA' : 'exC'])); });
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
    var m = modeOf(ctx.a());
    if (m.stop) { stopCard(el, ctx, m); return null; }
    var I = imp(), on = I.onset || {}, dur = I.duration || {};
    var o0 = ctx.get('onset', {}) || {};
    var wrap = h('div', { class: 'iv stack' });
    var ageNow = ageOf(ctx.a());

    /* ---------- Onset ---------- */
    var asks = m.young ? arr(on.askYoung) : arr(on.ask);
    var asksAdapted = false;
    if (m.young && !asks.length) { asks = arr(on.ask); asksAdapted = asks.length > 0; }
    var ageIn = ui.input({ type: 'number', inputmode: 'numeric', min: '0', max: '90', value: o0.ageOnset || '', placeholder: 'Age',
      onSave: function (v) { ctx.set('onset.ageOnset', String(v).trim() ? String(v).trim() : undefined); } });
    ageIn.classList.add('iv-age');
    ageIn.setAttribute('aria-label', m.young ? 'Age when the problems were first noticed' : 'Age when the symptoms started');
    var ageRow = m.young
      ? qrow('Age when the problems were first noticed', ageIn, h('span', { class: 'hint' }, 'Best estimate. Use school years, nursery or family events to anchor it.'))
      : qrow('Age when they started', ageIn, h('span', { class: 'hint' }, 'Best estimate. Use school years or life events to anchor it.'));
    /* Adults: asked only when the symptoms have not always been there. Young people: always asked. */
    ageRow.hidden = !m.young && o0.always !== 'no';

    var late = arr(on.lateOnset);
    var lateBox = ui.callout('warn', h('div', null,
      h('p', null, 'Symptoms that start after childhood need a careful search for another cause before ADHD is considered.'),
      late.length ? ui.list(late) : null), 'Onset after age 12: take care');
    lateBox.hidden = m.child || o0.before12 !== 'no';
    /* Age 6-11: the engine reads onset.before12 'no' as "not a long-standing pattern" (a sudden or recent start).
       Criterion E then stays pending until the clinician records that the other causes were considered
       (onset.abruptReviewed) or writes which differential explains or excludes it (onset.abruptNote). */
    var abruptBox = null;
    if (m.child) {
      abruptBox = h('div', { class: 'iv-abrupt' },
        ui.callout('warn', h('p', null, 'A sudden or recent start is not typical of ADHD, which is a long-standing developmental condition. Look hard for another cause, such as a medical or neurological problem, trauma or abuse, or a change at home or school, before considering ADHD.'), 'Sudden or recent start: a red flag'),
        h('div', { class: 'iv-abrupt-rec' },
          ui.check({ label: 'Medical, trauma, safeguarding and school causes of a sudden start considered', checked: o0.abruptReviewed === true,
            hint: 'Criterion E stays pending until this is ticked or the note below is written.',
            onChange: function (on) { ctx.set('onset.abruptReviewed', on ? true : undefined); paintB(); } }),
          ui.field('Which differential explains or excludes the sudden start', ui.input({ rows: 2, value: o0.abruptNote || '',
            placeholder: 'For example: no head injury or seizures; no change at home; safeguarding checked; started with the move to a new class',
            onSave: function (v) { ctx.set('onset.abruptNote', String(v || '').trim() ? v : undefined); paintB(); } }))));
      abruptBox.hidden = o0.before12 !== 'no';
    }

    var bBox = h('div', { class: 'iv-crit', 'aria-live': 'polite' });
    /* A later age at onset and "Yes" before 12 contradict each other: ask the clinician to check. */
    var ageWarn = h('p', { class: 'iv-nudge is-warn', 'aria-live': 'polite', hidden: true });
    function paintB() {
      var oc = ctx.get('onset', {}) || {}, n = parseInt(oc.ageOnset, 10);
      var msg = '';
      if (!isNaN(n) && ageNow !== null && m.young && n > ageNow) msg = 'Age at onset is ' + n + ', older than the age now (' + ageNow + '). Check the number.';
      else if (!m.child && (oc.always === 'no' || m.young) && !isNaN(n) && n >= 12 && oc.before12 === 'yes')
        msg = 'Age at onset is ' + n + ', but "several symptoms before age 12" is Yes. Check which is right: symptoms are often present earlier and only cause problems later.';
      ageWarn.textContent = msg;
      ageWarn.hidden = !msg;
      var b = D.criterionB(ctx.a() || {});
      U.clear(bBox);
      U.append(bBox, [h('div', { class: 'iv-crit-head' }, h('strong', null, 'Criterion B · several symptoms before age 12'), ui.statusPill(b.status)), h('p', { class: 'hint' }, b.detail)]);
    }

    var qAlways = m.young ? 'Have the problems been there since early childhood?' : 'Have the symptoms always been there?';
    var rows = h('div', { class: 'iv-qrows' },
      qrow(qAlways, ui.seg({ label: qAlways, hideLabel: true, options: YN, value: o0.always || null,
        onChange: function (v) { ctx.set('onset.always', nil(v)); if (!m.young) ageRow.hidden = v !== 'no'; } })),
      ageRow,
      ageWarn);
    if (m.child) {
      var qLong = 'Is this a long-standing pattern, rather than a sudden or recent start?';
      rows.appendChild(qrow(qLong, ui.seg({ label: qLong, hideLabel: true, options: YNU, value: o0.before12 || null,
        onChange: function (v) { ctx.set('onset.before12', nil(v)); abruptBox.hidden = v !== 'no'; } }),
        h('span', { class: 'hint' }, 'Answer No if the problems started suddenly, over days or weeks, or only recently.')));
      rows.appendChild(abruptBox);
    } else {
      rows.appendChild(qrow('Were several symptoms present before age 12?', ui.seg({ label: 'Were several symptoms present before age 12?', hideLabel: true, options: YNU, value: o0.before12 || null,
        onChange: function (v) { ctx.set('onset.before12', nil(v)); lateBox.hidden = v !== 'no'; } }),
        h('span', { class: 'hint' }, 'DSM-5-TR needs several symptoms before age 12, not a diagnosis at that age.')));
      rows.appendChild(lateBox);
    }
    rows.appendChild(qrow('Have the symptoms lasted at least 6 months?', ui.seg({ label: 'Have the symptoms lasted at least 6 months?', hideLabel: true, options: YN, value: o0.duration6m || null,
      onChange: function (v) { ctx.set('onset.duration6m', nil(v)); } }),
      h('span', { class: 'hint' }, 'Criterion A needs symptoms for at least 6 months.')));

    var durAsk = m.young && arr(dur.askYoung).length ? dur.askYoung : arr(dur.ask);
    var onsetCard = h('section', { class: 'card iv-onset' },
      h('h2', null, 'Onset (criterion B)'),
      m.child ? ui.callout('info', h('p', null, 'This child is under 12, so the symptoms you scored for the last 6 months also count as symptoms before age 12. There is no separate before-12 interview. Still record when the problems were first noticed, and check whether they started suddenly: a sudden start points to another cause.'), 'Under 12: symptoms now count as before age 12') : null,
      on.intro ? ui.details('About criterion B', h('p', { class: 'iv-intro-p' }, on.intro), { cls: 'iv-about' }) : null,
      asks.length ? h('div', { class: 'iv-asks' },
        h('h3', null, 'Questions to ask'),
        asksAdapted ? h('p', { class: 'hint' }, 'These are written for adults looking back. Ask the parent or carer the same things about the ' + m.selfWho + ', and ask the ' + m.selfWho + ' too.') : null,
        ui.list(asks.slice(0, 6), 'list iv-asklist'),
        asks.length > 6 ? ui.details('More onset questions', ui.list(asks.slice(6), 'list iv-asklist'), { meta: String(asks.length - 6) }) : null) : null,
      arr(on.memoryAids).length ? ui.details('Memory aids', ui.list(on.memoryAids), { meta: m.young ? 'Help the family date it' : 'Help the patient date it' }) : null,
      rows,
      durAsk.length ? ui.details('Questions about duration', ui.list(durAsk)) : null,
      bBox,
      arr(on.pitfalls).length ? ui.details('Common pitfalls when dating onset', ui.list(on.pitfalls)) : null,
      ui.field('Notes on onset', ui.input({ rows: 2, value: o0.notes || '',
        placeholder: m.young ? 'What the parent, teacher and ' + m.selfWho + ' said about when it started' : 'What the patient and informants said about when it started',
        onSave: function (v) { ctx.set('onset.notes', v.trim() ? v : undefined); } })));
    if (!I.onset) onsetCard.insertBefore(ui.callout('info', h('p', null, 'Onset questions are not loaded in this build. You can still record the answers.')), onsetCard.children[1]);
    wrap.appendChild(onsetCard);
    paintB();

    /* ---------- Impairment ---------- */
    var doms = arr(I.domains);
    var sevs = sevList();
    var sumBox = h('div', { class: 'iv-imp-sum', 'aria-live': 'polite' });
    var domLabel = {};
    doms.forEach(function (d) { domLabel[d.id] = m.domLabel(d); });
    function stats(a, p) {
      var list = D.impairment(a, p);
      var rated = list.filter(function (x) { return x.sev !== null; });
      var hit = rated.filter(function (x) { return x.sev >= 1; });
      var worst = rated.reduce(function (mx, x) { return Math.max(mx, x.sev); }, -1);
      return { of: list.length, rated: rated.length, hit: hit, worst: worst };
    }
    function paintSum() {
      var a = ctx.a() || {};
      var C = D.criterionC(a), Dd = D.criterionD(a);
      U.clear(sumBox);
      var per = h('div', { class: 'iv-imp-grid' }, m.pers.map(function (p) {
        var st = stats(a, p);
        return h('div', { class: 'iv-imp-per' },
          h('p', { class: 'iv-imp-k' }, m.L(p, 'imp')),
          h('p', null, h('strong', { class: 'num' }, st.hit.length + ' of ' + st.of), ' areas affected (mild or worse)'),
          st.hit.length ? h('p', { class: 'hint' }, st.hit.map(function (x) { return domLabel[x.id] || x.label; }).join(', ')) : null,
          h('p', { class: 'iv-imp-worst' }, 'Worst: ', st.worst < 0 ? h('span', { class: 'iv-none' }, 'not rated') : ui.sevChip(st.worst, sevLabel(st.worst)),
            st.rated < st.of ? h('span', { class: 'hint' }, ' · ' + (st.of - st.rated) + ' not rated') : null));
      }));
      sumBox.appendChild(per);
      sumBox.appendChild(h('ul', { class: 'iv-crit-list' },
        h('li', null, h('div', { class: 'iv-crit-head' }, h('strong', null, 'Criterion C · two or more settings'), ui.statusPill(C.status)), h('p', { class: 'hint' }, C.detail)),
        h('li', null, h('div', { class: 'iv-crit-head' }, h('strong', null, 'Criterion D · clear impairment'), ui.statusPill(Dd.status)), h('p', { class: 'hint' }, Dd.detail))));
      sumBox.appendChild(h('p', { class: 'iv-nice' }, h('strong', null, 'NICE threshold: '), m.young
        ? 'NICE NG87 asks for symptoms that cause at least moderate psychological, social or educational impairment and are pervasive, in two or more important settings such as home and school. Mild problems alone do not meet it.'
        : 'NICE NG87 asks for symptoms that cause at least moderate impairment and are pervasive, in two or more important settings such as work and home. Mild problems alone do not meet it.'));
    }

    var cache = {};
    function ratedCount(p) { var a = ctx.a() || {}; return stats(a, p).rated + '/' + doms.length; }
    var tabs = null, impHost;
    if (m.one) {
      impHost = h('div', { class: 'iv-tabs iv-one' }, buildImpair('adult'));
    } else {
      tabs = ui.tabs(m.pers.map(function (p) {
        return { id: p, label: [m.young ? m.L(p, 'tab') : m.L(p, 'imp'), h('span', { class: 'sr-only' }, ', areas rated:')], count: ratedCount(p),
          render: function () { return cache[p] || (cache[p] = buildImpair(p)); } };
      }), 'adult');
      tabs.classList.add('iv-tabs');
      impHost = tabs;
    }

    function buildImpair(p) {
      var box = h('div', { class: 'stack iv-doms' });
      if (!doms.length) { box.appendChild(ui.empty('Impairment areas not loaded', 'The impairment content is not available in this build.')); return box; }
      var hint;
      if (!m.young) hint = p === 'adult'
        ? 'Rate each area for the last 6 months. Ask what happens, how often and what it costs the patient.'
        : 'Rate each area for childhood and the teenage years, using the patient\'s memories, informants and school reports.';
      else hint = p === 'adult'
        ? 'Rate each area for the last 6 months, at home, at school and with friends. Ask the parent or carer, the teacher and the ' + m.selfWho + ' what happens and what it costs.'
        : 'Rate each area before age 12, using what the parent remembers, primary school reports and the young person\'s own memories.';
      box.appendChild(h('p', { class: 'hint' }, hint));
      doms.forEach(function (d) { box.appendChild(domainCard(d, p)); });
      return box;
    }

    /* The prompts for one domain and period. Young people now: the domain's young block (questions and
       anchors), with the child examples; before 12: the child block as written. */
    function blockFor(d, p) {
      if (!m.young || p !== 'adult') return d[p] || null;
      var y = d.young || null, c = d.child || {};
      if (!y && !arr(c.items).length) return null;
      y = y || {};
      return { ask: arr(y.ask), items: arr(y.items).length ? y.items : arr(c.items), anchors: y.anchors || c.anchors || {}, missingAsk: !arr(y.ask).length };
    }

    function domainCard(d, p) {
      var dp = blockFor(d, p) || {};
      var name = domLabel[d.id] || d.label || d.id;
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
      var seg = ui.seg({ label: 'Severity, ' + name, hideLabel: true, options: sevs.map(function (x) { return { v: x.v, l: x.v + ' ' + x.l }; }),
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
      var card = h('section', { class: 'card iv-dom', 'aria-label': name },
        h('div', { class: 'iv-dom-head' }, h('h3', null, name), badge),
        h('div', { class: 'seg-field' }, h('span', { class: 'seg-label', 'aria-hidden': 'true' }, 'Severity'), seg),
        anchorBox,
        d.why && !m.young ? ui.details('About this area', h('p', { class: 'iv-dom-why' }, d.why)) : null,
        m.young && d.young && d.young.why ? ui.details('About this area', h('p', { class: 'iv-dom-why' }, d.young.why)) : null,
        arr(dp.ask).length ? ui.details('Questions to ask', ui.list(dp.ask), { meta: String(dp.ask.length) }) : null,
        exDet,
        levels.length ? ui.details('What each level means here', h('dl', { class: 'iv-dl' }, levels.map(function (x) {
          return [h('dt', null, x.v + ' ' + x.l), h('dd', null, anchors[x.v])];
        }))) : null,
        ui.field('Notes on ' + String(name).toLowerCase(), ui.input({ rows: 2, value: cur.notes || '',
          onSave: function (v) { ctx.set(base + '.notes', v.trim() ? v : undefined); } })));
      if (!blockFor(d, p)) card.appendChild(h('p', { class: 'hint' }, 'No prompts for this period in this build. You can still rate it.'));
      else if (dp.missingAsk) card.appendChild(h('p', { class: 'hint' }, 'Questions for young people are not loaded in this build. You can still rate it.'));
      paint(typeof cur.sev === 'number' ? cur.sev : null);
      return card;
    }

    function paintTabCounts() {
      if (!tabs || !tabs.setCount) return;
      m.pers.forEach(function (p) { tabs.setCount(p, ratedCount(p)); });
    }

    wrap.appendChild(h('section', { class: 'iv-sec iv-imp' },
      h('h2', null, 'Impairment (criteria C and D)'),
      h('p', { class: 'muted' }, !m.young ? 'How much the symptoms get in the way, and where. Rate adulthood and childhood separately.'
        : m.one ? 'How much the symptoms get in the way, and where. Rate the last 6 months.'
        : 'How much the symptoms get in the way, and where. Rate now and before age 12 separately.'),
      sumBox, impHost));
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
    var a = ctx.a() || {};
    var m = modeOf(a);
    if (m.stop) { stopCard(el, ctx, m); return null; }
    var C = imp().collateral || {};
    var rating = arr(C.rating).length ? C.rating : [{ v: 0, l: 'None or little support' }, { v: 1, l: 'Some support' }, { v: 2, l: 'Clear support' }];
    var c0 = a.collateral || {};
    var pat = a.patient || {};
    var inf = pat.informants || {}, srcs = pat.sources || {}, yp = pat.young || {};
    var wrap = h('div', { class: 'iv stack' });

    var intro = m.young ? C.introYoung : C.intro;
    wrap.appendChild(h('div', { class: 'iv-col-intro' },
      h('p', { class: 'iv-lead' }, m.young
        ? 'Rate how far each source supports the history: the parent or carer now, and the teacher or school. Then record the ' + m.selfWho + '\'s own view. Use n/a when a source is not available.'
        : 'Rate how far each source supports the history: a parent or older relative for childhood, a partner or close friend for now, and school reports. Use n/a when a source is not available.'),
      intro ? ui.details('Why collateral matters', h('p', { class: 'iv-intro-p' }, intro), { cls: 'iv-about' }) : null));

    function ratingCtl(k, name) {
      var desc = h('p', { class: 'hint iv-rate-desc', 'aria-live': 'polite' });
      var paint = function (v) {
        var mm = rating.filter(function (x) { return x.v === v; })[0];
        desc.textContent = v === 'na' ? 'Not available: no one to ask, or not yet obtained.' : mm ? (mm.d || '') : 'Not rated yet.';
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
    function questionsOf(sec) { return arr(sec && sec.questions).filter(function (q) { return q && q.k; }); }
    function whoField(k, ph) {
      return ui.field('Who gave the information', ui.input({ value: ctx.get('collateral.who.' + k, ''), placeholder: ph,
        onSave: function (v) { ctx.set('collateral.who.' + k, v.trim() ? v : undefined); } }));
    }
    var ASK_HINT = 'Tick each question the informant confirms. Leave it blank if not asked or not confirmed.';

    function sourceCard(k, title, sec, setupNote) {
      sec = sec || {};
      var qs = questionsOf(sec);
      return h('section', { class: 'card iv-src' },
        h('div', { class: 'iv-src-head' }, h('h3', null, title), setupNote ? ui.badge(setupNote, 'info') : null),
        sec.intro ? h('p', { class: 'muted' }, sec.intro) : null,
        whoField(k, k === 'parent' ? (m.young ? 'e.g. mother, in clinic' : 'e.g. mother, by phone') : 'e.g. partner of 6 years, in clinic'),
        ratingCtl(k, title),
        qs.length ? checkList(qs, function (q) { return q.k; }, function (q) { return q.q; }, 'Questions to ask', 'confirmed', ASK_HINT) : null);
    }

    var school = C.school || {};
    var look = arr(school.lookFor);
    var srcSec = h('section', { class: 'iv-sec stack' }, h('h2', null, 'Sources'));
    if (!m.young) {
      var parentNote = inf.parent ? 'Parent available (setup)' : inf.sibling ? 'Sibling available (setup)' : null;
      srcSec.appendChild(sourceCard('parent', 'Parent or older relative (childhood)', C.parent, parentNote));
      srcSec.appendChild(sourceCard('partner', 'Partner or close friend (adulthood)', C.partner, inf.partner ? 'Partner available (setup)' : null));
      srcSec.appendChild(h('section', { class: 'card iv-src' },
        h('div', { class: 'iv-src-head' }, h('h3', null, 'School reports'), srcs.schoolReports ? ui.badge('Reports available (setup)', 'info') : null),
        school.intro ? h('p', { class: 'muted' }, school.intro) : null,
        ratingCtl('school', 'School reports'),
        look.length ? checkList(look, function (x, i) { return 'school_' + i; }, function (x) { return x; }, 'Phrases to look for', 'found', 'Tick each phrase, or one with the same meaning, that you find in the reports.') : null,
        arr(school.caution).length ? ui.callout('warn', ui.list(school.caution), 'Read reports with care') : null));
    } else {
      /* Young people: parent or carer now, teacher or school, and the young person's own view. No partner. */
      srcSec.appendChild(sourceCard('parent', 'Parent or carer (now)', C.parentNow, inf.parent ? 'Parent or carer available (setup)' : null));
      var tSec = C.teacher || {};
      var tQs = questionsOf(tSec);
      var tNote = inf.teacher ? 'Teacher informant (setup)' : srcs.schoolReports ? 'Reports available (setup)' : null;
      srcSec.appendChild(h('section', { class: 'card iv-src' },
        h('div', { class: 'iv-src-head' }, h('h3', null, 'Teacher or school'), tNote ? ui.badge(tNote, 'info') : null),
        tSec.intro ? h('p', { class: 'muted' }, tSec.intro) : null,
        yp.schoolConsent ? null : h('p', { class: 'hint iv-col-consent' }, 'Consent to contact the school is not recorded in setup. Record it before you contact the school.'),
        whoField('school', 'e.g. class teacher and SENCO, by questionnaire'),
        ratingCtl('school', 'Teacher or school'),
        tQs.length ? checkList(tQs, function (q) { return q.k; }, function (q) { return q.q; }, 'Questions to ask the teacher', 'confirmed', ASK_HINT) : null,
        look.length ? checkList(look, function (x, i) { return 'school_' + i; }, function (x) { return x; }, 'Phrases to look for in reports', 'found', 'Tick each phrase, or one with the same meaning, that you find in school reports or teacher comments.') : null,
        arr(school.caution).length ? ui.callout('warn', ui.list(school.caution), 'Read reports with care') : null));
      var ySec = C.youngSelf || {};
      var yQs = questionsOf(ySec);
      var selfTitle = m.child ? 'The child\'s own view' : 'The young person\'s own view';
      srcSec.appendChild(h('section', { class: 'card iv-src' },
        h('div', { class: 'iv-src-head' }, h('h3', null, selfTitle), m.child ? null : (yp.seenAlone ? ui.badge('Seen alone (setup)', 'info') : null)),
        ySec.intro ? h('p', { class: 'muted' }, ySec.intro) : null,
        yQs.length ? checkList(yQs, function (q) { return q.k; }, function (q) { return q.q; }, 'Questions to ask', 'answered', 'Tick each question you asked and they answered.') : null,
        ui.field('In their own words', ui.input({ rows: 4, value: c0.self || '',
          placeholder: 'What they say about school, home, friends, their attention and activity, and what they want from the assessment',
          onSave: function (v) { ctx.set('collateral.self', v.trim() ? v : undefined); } }))));
    }
    wrap.appendChild(srcSec);

    /* Live summary. */
    var sumBox = h('div', { class: 'iv-col-live', 'aria-live': 'polite' });
    var LEVEL = {
      clear: ['Clear support', 'ok', 'At least one source clearly supports the history. This strengthens the diagnosis.'],
      some: ['Some support', 'info', 'Sources partly support the history. Note where they agree and where they do not.'],
      none: ['Little or no support', 'warn', m.young
        ? 'The sources rated do not support the history. Explore why, and look at how the ' + m.selfWho + ' manages at home and at school, before going further.'
        : 'The sources rated do not support the history. Explore why before relying on self-report alone.'],
      unavailable: ['No source rated', 'neutral', m.young
        ? 'No parent, carer or teacher rated yet. Aim for both a home and a school source; if one cannot be obtained, record why.'
        : 'No informant or report rated yet. If none can be obtained, record why and how you weighed the self-report.']
    };
    function paintSum() {
      var cur = ctx.a() || {};
      var res = D.collateral(cur);
      var L = LEVEL[res.level] || LEVEL.unavailable;
      var cc = cur.collateral || {};
      var show = function (v) { return v === 'na' ? 'Not available' : typeof v === 'number' ? v + ' · ' + ((rating.filter(function (x) { return x.v === v; })[0] || {}).l || '') : 'Not rated'; };
      U.clear(sumBox);
      var rowsDl = m.young
        ? [h('dt', null, 'Parent or carer (now)'), h('dd', null, show(cc.parent)),
          h('dt', null, 'Teacher or school'), h('dd', null, show(cc.school)),
          h('dt', null, m.child ? 'Child\'s own view' : 'Young person\'s own view'), h('dd', null, String(cc.self || '').trim() ? 'Recorded' : 'Not recorded')]
        : [h('dt', null, 'Parent or relative'), h('dd', null, show(cc.parent)),
          h('dt', null, 'Partner or friend'), h('dd', null, show(cc.partner)),
          h('dt', null, 'School reports'), h('dd', null, show(cc.school))];
      U.append(sumBox, [
        h('p', { class: 'iv-col-level' }, ui.badge(L[0], L[1]), h('span', null, L[2])),
        h('dl', { class: 'iv-dl iv-dl-inline' }, rowsDl)
      ]);
      /* Parent versus teacher, from the per-source symptom ratings (young people). */
      if (m.young && D && typeof D.agreement === 'function') {
        var ag = null;
        try { ag = D.agreement(cur); } catch (e) { ag = null; }
        if (ag && ag.pairs) {
          sumBox.appendChild(h('p', { class: 'hint iv-col-agree' }, 'Parent and teacher agree on ' + ag.agree + ' of ' + ag.pairs + ' symptoms they both rated' +
            (ag.differ && ag.differ.length ? '. Explore the ' + ag.differ.length + ' where they differ: different settings and demands, or one source over- or under-reporting.' : '.')));
        }
      }
    }
    paintSum();
    wrap.appendChild(h('section', { class: 'card iv-col-sum' },
      h('h2', null, 'Overall collateral support'), sumBox));

    var disc = m.young ? arr(C.discrepancyYoung) : arr(C.discrepancy);
    var noInf = m.young ? arr(C.noInformantYoung) : arr(C.noInformant);
    wrap.appendChild(h('div', null,
      disc.length ? ui.details('When informants disagree', ui.list(disc)) : null,
      noInf.length ? ui.details(m.young ? 'When a parent or school source is missing' : 'No informant available', ui.list(noInf)) : null));

    wrap.appendChild(ui.field('Notes on collateral information', ui.input({ rows: 3, value: c0.notes || '', placeholder: 'Who was contacted, what they said, how reliable it seems',
      onSave: function (v) { ctx.set('collateral.notes', v.trim() ? v : undefined); } })));

    if (!imp().collateral) wrap.insertBefore(ui.callout('info', h('p', null, 'Collateral guidance is not loaded in this build. You can still record the ratings.')), wrap.firstChild);
    ctx.onChange('collateral', paintSum);
    el.appendChild(wrap);
    return null;
  } };
})(window.AA);
