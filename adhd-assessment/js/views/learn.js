/* Assessor training: modules, module quizzes, the mastery exam, practice cases and the glossary.
   Routes: "learn", "module-<id>", "quiz-<id>", "exam", "cases", "case-<id>" and "glossary" (ARCHITECTURE.md, section 6).
   Content comes from AA.data.learn, AA.data.cases and AA.data.glossary; this file only arranges it.
   Saved progress lives in AA.progress (per clinician): modules.<id>.done/.at, quizzes.<id> = {best, last, at},
   cases.<id> = {score, of, at} and exam = {best, last, at}. A quiz, exam or case in progress is short-lived UI
   state kept in memory here (so AA.router.refresh() or a quick look at the module does not lose the attempt). */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui;

  var PASS = 80;          // pass mark (percent) for module quizzes and the mastery exam
  var EXAM_SIZE = 30;     // questions per mastery exam attempt
  var LETTERS = 'ABCDEFGHIJKL';
  var LEVELS = { 1: 'Foundation', 2: 'Intermediate', 3: 'Advanced' };
  var LEVEL_KIND = { 1: 'info', 2: 'accent', 3: 'warn' };
  /* Options that refer to other options ("Both A and B", "All of the above") keep their authored order. */
  var FIXED_ORDER = /\b(of the above|of these)\b|\b(options?|answers?) [a-e]\b|^(both|neither)\b/i;

  /* ---------- Data helpers (never throw on missing or partial data) ---------- */

  function arr(x) { return Array.isArray(x) ? x.filter(function (v) { return v !== null && v !== undefined && v !== ''; }) : []; }
  function txt(x) { return typeof x === 'string' ? x.trim() : typeof x === 'number' ? String(x) : ''; }
  function texts(x) { return arr(x).map(txt).filter(Boolean); }
  function byN(a, b) { return (typeof a.n === 'number' ? a.n : 999) - (typeof b.n === 'number' ? b.n : 999); }
  function pct(a, b) { return b ? Math.round(100 * a / b) : 0; }

  /* Authored tables with several wordy columns become stacked cards on phones (CSS in this view's
     stylesheet): each cell is labelled with its column heading. Short numeric tables stay as tables. */
  function stackTables(root, cls) {
    Array.prototype.forEach.call(root.querySelectorAll('table'), function (t) {
      var rows = Array.prototype.slice.call(t.rows);
      if (rows.length < 2) return;
      var headRow = t.tHead && t.tHead.rows[0] ? t.tHead.rows[0] : rows[0];
      var heads = Array.prototype.map.call(headRow.cells, function (c) { return c.tagName === 'TH' ? c.textContent.trim() : ''; });
      if (!heads.some(Boolean)) return;
      var body = rows.filter(function (r) { return r !== headRow; });
      var cells = [];
      body.forEach(function (r) { Array.prototype.forEach.call(r.cells, function (c) { cells.push(c); }); });
      if (!cells.length) return;
      var avg = cells.reduce(function (n, c) { return n + c.textContent.length; }, 0) / cells.length;
      if (!((heads.length >= 3 && avg >= 24) || (heads.length === 2 && avg >= 60))) return;
      body.forEach(function (r) { Array.prototype.forEach.call(r.cells, function (c, i) { if (heads[i]) c.setAttribute('data-label', heads[i]); }); });
      headRow.classList.add(cls + '-head');
      t.classList.add(cls);
    });
    return root;
  }
  function prose(html) { return stackTables(ui.html(html), 'lr-stack'); }

  function modules() { return (AA.data.learn || []).filter(function (m) { return m && m.id; }).slice().sort(byN); }
  function moduleById(id) { return modules().filter(function (m) { return m.id === id; })[0] || null; }
  function modNo(m) { var i = modules().indexOf(m); return typeof m.n === 'number' ? m.n : i + 1; }
  function modTitle(m) { return txt(m.title) || 'Module ' + modNo(m); }

  function validQ(q) {
    return !!(q && txt(q.q) && Array.isArray(q.options) && q.options.length >= 2 &&
      typeof q.a === 'number' && q.a >= 0 && q.a < q.options.length && Math.floor(q.a) === q.a);
  }
  function quizOf(m) { return arr(m && m.quiz).filter(validQ); }

  function cases() { return (AA.data.cases || []).filter(function (c) { return c && c.id; }); }
  function caseById(id) { return cases().filter(function (c) { return c.id === id; })[0] || null; }
  function stagesOf(c) { return arr(c && c.stages).filter(function (s) { return typeof s === 'object'; }); }
  function caseQCount(c) { return stagesOf(c).filter(function (s) { return validQ(s.q); }).length; }
  function level(c) { return (c && LEVELS[c.difficulty]) || null; }
  /* DSM-5-TR adult threshold: 5 symptoms from age 17, otherwise 6. Age is read from "29-year-old ...". */
  function adultNeed(c) {
    var m = /(\d{1,2})[\s-]*year/i.exec(txt(c && c.patient));
    return m && parseInt(m[1], 10) < 17 ? 6 : 5;
  }

  /* ---------- Progress (AA.progress) ---------- */

  function isRead(id) { return !!AA.progress.get('modules.' + id + '.done', false); }
  function quizRec(id) { var r = AA.progress.get('quizzes.' + id, null); return r && typeof r.best === 'number' ? r : null; }
  function passed(id) { var r = quizRec(id); return !!(r && r.best >= PASS); }
  function caseRec(id) { var r = AA.progress.get('cases.' + id, null); return r && typeof r.of === 'number' ? r : null; }
  function examRec() { var r = AA.progress.get('exam', null); return r && typeof r.best === 'number' ? r : null; }

  /* Save a percentage result as {best, last, at}; returns the new best and the previous best (or null). */
  function saveScore(rel, p) {
    var prev = AA.progress.get(rel, null);
    var prevBest = prev && typeof prev.best === 'number' ? prev.best : null;
    var best = prevBest === null ? p : Math.max(prevBest, p);
    AA.progress.set(rel, { best: best, last: p, at: new Date().toISOString() });
    return { best: best, prevBest: prevBest };
  }

  function modStatus(m) {
    if (passed(m.id)) return { label: 'Quiz passed ✓', kind: 'ok', cls: 'is-passed' };
    if (isRead(m.id)) return { label: 'Read', kind: 'info', cls: 'is-read' };
    return { label: 'Not started', kind: 'neutral', cls: '' };
  }

  function stats() {
    var mods = modules(), cs = cases(), ex = examRec();
    var withQuiz = mods.filter(function (m) { return quizOf(m).length; });
    var s = {
      mods: mods.length, read: mods.filter(function (m) { return isRead(m.id); }).length,
      quizzes: withQuiz.length, passed: withQuiz.filter(function (m) { return passed(m.id); }).length,
      ncases: cs.length, cases: cs.filter(function (c) { return caseRec(c.id); }).length,
      exam: ex, examPassed: !!(ex && ex.best >= PASS), examAvail: examPool().length > 0
    };
    var total = s.mods + s.quizzes + s.ncases + (s.examAvail ? 1 : 0);
    s.overall = pct(s.read + s.passed + s.cases + (s.examPassed ? 1 : 0), total);
    return s;
  }

  /* The single most useful next action on the training page. */
  function nextStep(st) {
    var mods = modules();
    var m = mods.filter(function (x) { return !isRead(x.id); })[0];
    if (m) return { text: 'Next: read module ' + modNo(m) + ', ' + modTitle(m) + '.', label: 'Read module ' + modNo(m), go: 'module-' + m.id };
    m = mods.filter(function (x) { return quizOf(x).length && !passed(x.id); })[0];
    if (m) return { text: 'Next: pass the quiz for module ' + modNo(m) + ', ' + modTitle(m) + '.', label: 'Take quiz ' + modNo(m), go: 'quiz-' + m.id };
    var c = cases().filter(function (x) { return !caseRec(x.id); })[0];
    if (c) return { text: 'Next: work through the practice case "' + (txt(c.title) || 'Untitled case') + '".', label: 'Open the case', go: 'case-' + c.id };
    if (st.examAvail && !st.examPassed) return { text: 'Next: take the mastery exam.', label: 'Start the exam', go: 'exam' };
    return { text: 'You have finished the training. You are ready to run an assessment.', label: 'Start an assessment', go: 'new' };
  }

  /* ---------- Attempts in progress (memory only) ---------- */

  var attempts = {};
  /* The last rendered route, so a render can tell a refresh (same route again) from arriving at the page. */
  var lastToken = null;
  AA.router.onChange(function (r) { lastToken = r ? r.token : null; });
  function arriving() { var cur = AA.router.current(); return !cur || cur.token !== lastToken; }

  function akey(k) { var me = AA.auth.current(); return (me ? me.id : 'anon') + ':' + k; }
  function getAttempt(k) { return attempts[akey(k)] || null; }
  function setAttempt(k, s) { if (s) attempts[akey(k)] = s; else delete attempts[akey(k)]; }
  /* An unfinished attempt is always resumed. A finished one is shown again only on a refresh. */
  function resume(k) {
    var s = getAttempt(k);
    if (s && s.done && arriving()) { setAttempt(k, null); s = null; }
    return s;
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  /* Display order of the original option indexes for one attempt. */
  function optionOrder(q) {
    var idx = q.options.map(function (o, i) { return i; });
    return q.options.some(function (o) { return FIXED_ORDER.test(String(o)); }) ? idx : shuffle(idx);
  }
  function identity(q) { return q.options.map(function (o, i) { return i; }); }

  /* ---------- Small shared pieces ---------- */

  function wide() { try { return window.matchMedia('(min-width: 1100px)').matches; } catch (e) { return true; } }
  function smooth() { try { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }

  /* Move to an in-page heading without touching the route (hash links would navigate). */
  function jumpTo(node) {
    if (!node) return;
    try { node.scrollIntoView({ block: 'start', behavior: smooth() ? 'smooth' : 'auto' }); } catch (e) { node.scrollIntoView(); }
    var hd = node.matches && node.matches('h2, h3') ? node : node.querySelector('h2, h3');
    if (hd) { if (!hd.hasAttribute('tabindex')) hd.setAttribute('tabindex', '-1'); try { hd.focus({ preventScroll: true }); } catch (e) { hd.focus(); } }
  }
  /* Bring a node into view only when it is off screen, then focus it. */
  function reveal(node, focusEl) {
    if (!node) return;
    var r = node.getBoundingClientRect();
    if (r.top < 70 || r.top > window.innerHeight - 140) { try { node.scrollIntoView({ block: 'start' }); } catch (e) { node.scrollIntoView(); } }
    var f = focusEl || node;
    if (f) { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
  }

  function notFound(el, title, body, go, label) {
    el.appendChild(ui.pageHead({ eyebrow: 'Learn', title: title }));
    el.appendChild(ui.empty('Nothing to show here', body, ui.btn({ label: label, kind: 'primary', go: go })));
  }

  function letter(pos) { return LETTERS[pos] || String(pos + 1); }

  /* One multiple-choice question with large radio options, "Check answer" and feedback.
     o: {order:[original option indexes in display order], pick, checked, tag:'h2'|'h3', lead: node,
         onPick(orig), onCheck(orig), nextLabel, onNext(), extra: fn -> node shown in the feedback}
     After checking, the submit button becomes nextLabel (Enter works throughout); without onNext it disappears.
     The correct option is marked with a tick and the words "Correct answer", a wrong pick with a cross. */
  function ask(q, o) {
    var name = ui.nid('lrq');
    var pick = typeof o.pick === 'number' ? o.pick : null;
    var checked = !!o.checked && pick !== null;
    var head = h(o.tag || 'h2', { class: 'lr-q', tabindex: '-1', 'data-focus': '' }, txt(q.q));
    var rows = o.order.map(function (orig, pos) {
      var input = h('input', { type: 'radio', name: name, value: String(orig), checked: pick === orig });
      var mark = h('span', { class: 'lr-opt-mark' });
      var lab = h('label', { class: 'lr-opt' + (pick === orig ? ' is-picked' : '') }, input,
        h('span', { class: 'lr-opt-key', 'aria-hidden': 'true' }, letter(pos)),
        h('span', { class: 'lr-opt-t' }, String(q.options[orig])), mark);
      input.addEventListener('change', function () {
        if (!input.checked || checked) return;
        pick = orig;
        rows.forEach(function (r) { r.lab.classList.toggle('is-picked', r.orig === orig); });
        U.clear(fb);
        if (o.onPick) o.onPick(orig);
      });
      return { orig: orig, pos: pos, input: input, lab: lab, mark: mark };
    });
    var fb = h('div', { class: 'lr-fb', 'aria-live': 'polite' });
    var btn = h('button', { type: 'submit', class: 'btn btn-primary' }, 'Check answer');
    var actions = h('div', { class: 'lr-qactions' }, btn, o.tools || null);
    var form = h('form', { class: 'lr-ask', novalidate: '' }, o.lead || null,
      h('fieldset', { class: 'lr-fs' }, h('legend', { class: 'lr-legend' }, head), h('div', { class: 'lr-opts' }, rows.map(function (r) { return r.lab; }))),
      fb, actions);

    function paint() {
      var right = pick === q.a;
      var answer = rows.filter(function (r) { return r.orig === q.a; })[0];
      rows.forEach(function (r) {
        var isA = r.orig === q.a, isP = r.orig === pick;
        r.input.disabled = true;
        r.lab.classList.add('is-locked');
        r.lab.classList.toggle('is-correct', isA);
        r.lab.classList.toggle('is-wrong', isP && !isA);
        r.mark.textContent = isA ? (isP ? '✓ Your answer is correct' : '✓ Correct answer') : isP ? '✗ Your answer' : '';
        r.lab.classList.toggle('has-mark', isA || isP);
      });
      U.clear(fb);
      fb.appendChild(h('div', { class: 'lr-fb-box ' + (right ? 'lr-fb-ok' : 'lr-fb-no') },
        h('p', { class: 'lr-fb-title' }, h('span', { class: 'lr-fb-ico', 'aria-hidden': 'true' }, right ? '✓' : '✗'), right ? 'Correct.' : 'Not quite.'),
        right || !answer ? null : h('p', { class: 'lr-fb-answer' }, 'The correct answer is ' + letter(answer.pos) + ': ' + String(q.options[q.a])),
        txt(q.why) ? h('p', { class: 'lr-fb-why' }, txt(q.why)) : null,
        o.extra ? o.extra() : null));
      if (o.onNext) btn.textContent = o.nextLabel || 'Continue';
      else actions.remove();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!checked) {
        if (pick === null) {
          U.clear(fb);
          fb.appendChild(h('p', { class: 'lr-fb-need' }, 'Choose an answer first.'));
          if (rows[0]) rows[0].input.focus();
          return;
        }
        checked = true;
        if (o.onCheck) o.onCheck(pick);
        paint();
        if (btn.isConnected) btn.focus();
        return;
      }
      if (o.onNext) o.onNext();
    });
    if (checked) paint();
    return form;
  }

  /* Quiz runner shared by module quizzes and the mastery exam: one question at a time, then results.
     cfg: {key, make() -> items [{q, order, gid?, glabel?, go?, src?, ctx?()}], onFinish(result) -> {best, prevBest},
           intro(start) -> node (optional start screen), back:{label, go}, next:{label, go} (shown after a pass),
           retryLabel, extra(result, attempt) -> node (shown under the score)} */
  function runQuiz(host, cfg) {
    var s = resume(cfg.key);
    function fresh() { s = { items: cfg.make(), idx: 0, picks: {}, checked: {}, done: false, result: null }; setAttempt(cfg.key, s); }
    if (!s && !cfg.intro) fresh();

    function draw(focus) {
      U.clear(host);
      if (!s) host.appendChild(cfg.intro(function () { fresh(); draw(true); }));
      else if (s.done) host.appendChild(results());
      else host.appendChild(question());
      if (focus) reveal(host, host.querySelector('[data-focus]'));
    }

    function restart() {
      var any = Object.keys(s.checked).length > 0;
      var go = function () { fresh(); draw(true); };
      if (!any) { go(); return; }
      U.confirm({ title: 'Start again?', body: 'Your answers in this attempt will be cleared. Saved scores are kept.', ok: 'Start again' })
        .then(function (yes) { if (yes) go(); });
    }

    function question() {
      var i = s.idx, n = s.items.length, it = s.items[i];
      return h('div', { class: 'card lr-quiz' },
        h('div', { class: 'lr-quiz-top' },
          h('p', { class: 'lr-qcount' }, 'Question ' + (i + 1) + ' of ' + n),
          ui.progress(i, n, 'Questions answered')),
        ask(it.q, {
          order: it.order, pick: s.picks[i], checked: !!s.checked[i], tag: 'h2',
          lead: it.ctx ? it.ctx() : null,
          onPick: function (v) { s.picks[i] = v; },
          onCheck: function () { s.checked[i] = true; },
          extra: it.src ? function () { return h('p', { class: 'lr-fb-src' }, it.src); } : null,
          nextLabel: i < n - 1 ? 'Next question' : 'See your result',
          onNext: function () { if (i < n - 1) s.idx = i + 1; else finish(); draw(true); },
          tools: ui.btn({ label: 'Start again', kind: 'quiet', small: true, onClick: restart })
        }));
    }

    function finish() {
      if (s.done) return;
      var correct = 0, n = s.items.length;
      s.items.forEach(function (it, k) { if (s.picks[k] === it.q.a) correct++; });
      var r = { correct: correct, n: n, pct: pct(correct, n), at: new Date().toISOString() };
      r.passed = r.pct >= PASS;
      var saved = cfg.onFinish ? cfg.onFinish(r) : null;
      r.best = saved ? saved.best : r.pct;
      r.prevBest = saved ? saved.prevBest : null;
      s.done = true; s.result = r;
    }

    function results() {
      var r = s.result;
      var need = Math.ceil(PASS * r.n / 100);
      var note = r.passed ? 'You reached the pass mark of ' + PASS + '%.'
        : 'The pass mark is ' + PASS + '%: ' + need + ' of ' + r.n + ' correct. Read the explanations below, then try again.';
      var best = r.prevBest === null ? null : r.pct > r.prevBest ? 'New best score. Your previous best was ' + r.prevBest + '%.' : 'Your best score is ' + r.best + '%.';
      var showNext = r.passed && cfg.next;
      var wrap = h('div', { class: 'lr-result' },
        h('section', { class: 'card lr-score ' + (r.passed ? 'lr-score-pass' : 'lr-score-fail'), 'aria-labelledby': 'lr-res-h' },
          h('h2', { id: 'lr-res-h', tabindex: '-1', 'data-focus': '' }, 'Your result'),
          h('div', { class: 'lr-score-main', role: 'status' },
            h('span', { class: 'lr-score-pct' }, r.pct + '%'),
            h('span', { class: 'lr-score-of' }, r.correct + ' of ' + r.n + ' correct'),
            r.passed ? ui.badge('✓ Passed', 'ok') : ui.badge('Not passed yet', 'warn')),
          h('p', { class: 'lr-score-note' }, note),
          best ? h('p', { class: 'hint' }, best) : null,
          h('div', { class: 'row lr-score-actions' },
            showNext ? ui.btn({ label: cfg.next.label, kind: 'primary', go: cfg.next.go }) : null,
            ui.btn({ label: cfg.retryLabel || 'Retry', kind: r.passed ? 'ghost' : 'primary', onClick: function () { setAttempt(cfg.key, null); fresh(); draw(true); } }),
            cfg.back ? ui.btn({ label: cfg.back.label, kind: 'ghost', go: cfg.back.go }) : null)));
      if (cfg.extra) { var x = cfg.extra(r, s); if (x) wrap.appendChild(x); }
      wrap.appendChild(review());
      return wrap;
    }

    function review() {
      var wrong = s.items.filter(function (it, k) { return s.picks[k] !== it.q.a; }).length;
      var list = h('ol', { class: 'lr-review' }, s.items.map(function (it, k) {
        var q = it.q, pick = s.picks[k], right = pick === q.a;
        var opt = function (orig) { return typeof orig === 'number' ? letter(it.order.indexOf(orig)) + '. ' + String(q.options[orig]) : 'Not answered'; };
        return h('li', { class: 'lr-rv ' + (right ? 'is-right' : 'is-wrong') },
          h('p', { class: 'lr-rv-q' }, txt(q.q)),
          h('dl', { class: 'lr-rv-dl' },
            h('dt', null, 'Your answer'),
            h('dd', null, opt(pick), ' ', h('span', { class: right ? 'lr-ok' : 'lr-no' }, right ? '✓ Correct' : '✗ Incorrect')),
            right ? null : [h('dt', null, 'Correct answer'), h('dd', null, opt(q.a))]),
          txt(q.why) ? h('p', { class: 'lr-rv-why' }, txt(q.why)) : null,
          it.src ? h('p', { class: 'lr-rv-src' }, it.src) : null);
      }));
      return h('section', { class: 'section lr-review-sec', 'aria-labelledby': 'lr-rev-h' },
        h('h2', { id: 'lr-rev-h' }, 'Review your answers'),
        wrong && wrong < s.items.length ? ui.check({ label: 'Show only the questions I got wrong (' + wrong + ')', onChange: function (on) { list.classList.toggle('lr-only-wrong', on); } }) : null,
        list);
    }

    draw(false);
  }

  /* ======================================================================
     Route: learn (training home)
     ====================================================================== */

  function pathStep(n, title, body, status, done) {
    return h('li', { class: 'lr-path-step' + (done ? ' is-done' : '') },
      h('span', { class: 'lr-path-n', 'aria-hidden': 'true' }, done ? '✓' : String(n)),
      h('div', { class: 'lr-path-body' },
        h('p', { class: 'lr-path-t' }, h('span', { class: 'sr-only' }, 'Step ' + n + ': '), title, done ? h('span', { class: 'sr-only' }, ' (complete)') : null),
        h('p', { class: 'lr-path-d' }, body),
        h('p', { class: 'lr-path-s' }, status)));
  }

  function stat(k, v, sub) {
    return h('div', { class: 'stat lr-stat' }, h('div', { class: 'stat-k' }, k), h('div', { class: 'stat-v' }, String(v)), sub ? h('div', { class: 'lr-stat-sub' }, sub) : null);
  }

  function moduleItem(m) {
    var no = modNo(m), qs = quizOf(m), st = modStatus(m), r = quizRec(m.id), obj = texts(m.objectives);
    var meta = [m.minutes ? m.minutes + ' minutes' : null, qs.length ? U.plural(qs.length, 'quiz question') : 'No quiz yet',
      r ? 'quiz best ' + r.best + '%' : null].filter(Boolean).join(' · ');
    return h('li', { class: 'card lr-mod ' + st.cls },
      h('span', { class: 'lr-mod-n', 'aria-hidden': 'true' }, String(no)),
      h('div', { class: 'lr-mod-body' },
        h('div', { class: 'lr-mod-top' },
          h('h3', { class: 'lr-mod-title' }, h('span', { class: 'sr-only' }, 'Module ' + no + ': '), modTitle(m)),
          ui.badge(st.label, st.kind)),
        h('p', { class: 'lr-mod-meta' }, meta),
        txt(m.summary) ? h('p', { class: 'lr-mod-sum' }, txt(m.summary)) : null,
        obj.length ? ui.details('Learning objectives', ui.list(obj), { meta: String(obj.length), cls: 'lr-mod-obj' }) : null,
        h('div', { class: 'lr-mod-actions' },
          ui.btn({ label: 'Read', kind: isRead(m.id) ? 'ghost' : 'primary', small: true, go: 'module-' + m.id, aria: 'Read module ' + no }),
          qs.length ? ui.btn({ label: 'Quiz', kind: st.cls === 'is-read' ? 'primary' : 'ghost', small: true, go: 'quiz-' + m.id, aria: 'Quiz for module ' + no }) : null)));
  }

  function renderLearn(el) {
    var mods = modules(), cs = cases(), st = stats();
    el.appendChild(ui.pageHead({
      eyebrow: 'Learn', title: 'Assessor training',
      lead: 'Learn the method, practise it on cases, then assess. When you have finished every module, the practice cases and the mastery exam, you can run an adult ADHD assessment with confidence.'
    }));

    var learnDone = st.mods > 0 && st.read === st.mods && st.passed === st.quizzes;
    el.appendChild(h('ol', { class: 'lr-path', 'aria-label': 'Training path' },
      pathStep(1, 'Learn', 'Read each module and pass its quiz with ' + PASS + '% or more.', st.read + ' of ' + st.mods + ' read · ' + st.passed + ' of ' + st.quizzes + ' quizzes passed', learnDone),
      pathStep(2, 'Practise', 'Work through realistic cases and compare your decisions with the expert answer.', st.cases + ' of ' + st.ncases + ' cases done', st.ncases > 0 && st.cases === st.ncases),
      pathStep(3, 'Assess', 'Pass the mastery exam, then run a real assessment with the step guide open.', st.exam ? 'Exam best ' + st.exam.best + '%' + (st.examPassed ? ', passed' : '') : 'Exam not taken yet', st.examPassed)));

    var nx = nextStep(st);
    el.appendChild(h('section', { class: 'card lr-overview', 'aria-labelledby': 'lr-prog-h' },
      h('div', { class: 'lr-overview-main' },
        h('h2', { id: 'lr-prog-h' }, 'Your progress'),
        h('p', { class: 'lr-overall' }, h('span', { class: 'lr-overall-v' }, st.overall + '%'), h('span', { class: 'lr-overall-k' }, 'of the training complete')),
        ui.progress(st.overall, 100, 'Training complete'),
        h('p', { class: 'lr-next' }, nx.text)),
      h('div', { class: 'lr-overview-go' }, ui.btn({ label: nx.label, kind: 'primary', go: nx.go })),
      h('div', { class: 'stat-row lr-stats' },
        stat('Modules read', st.read + ' / ' + st.mods),
        stat('Quizzes passed', st.passed + ' / ' + st.quizzes, 'Pass mark ' + PASS + '%'),
        stat('Cases done', st.cases + ' / ' + st.ncases),
        stat('Exam best', st.exam ? st.exam.best + '%' : '–', st.exam ? (st.examPassed ? 'Passed' : 'Not passed yet') : 'Not taken'))));

    var modSec = h('section', { class: 'section', 'aria-labelledby': 'lr-mods-h' }, h('h2', { id: 'lr-mods-h' }, 'Modules'));
    if (!mods.length) modSec.appendChild(ui.empty('No modules yet', 'Training modules are not available in this build.'));
    else {
      var mins = mods.reduce(function (t, m) { return t + (typeof m.minutes === 'number' ? m.minutes : 0); }, 0);
      modSec.appendChild(h('p', { class: 'muted lr-sec-lead' }, U.plural(mods.length, 'module') + (mins ? ', about ' + (mins >= 90 ? Math.round(mins / 30) / 2 + ' hours' : mins + ' minutes') + ' of reading' : '') + '. Take them in order: each builds on the one before.'));
      modSec.appendChild(h('ol', { class: 'lr-mods' }, mods.map(moduleItem)));
    }
    el.appendChild(modSec);

    var ex = st.exam, pool = examPool().length;
    var avg = cs.map(function (c) { return caseRec(c.id); }).filter(function (r) { return r && r.of; });
    var avgPct = avg.length ? pct(avg.reduce(function (t, r) { return t + r.score; }, 0), avg.reduce(function (t, r) { return t + r.of; }, 0)) : null;
    el.appendChild(h('section', { class: 'section', 'aria-labelledby': 'lr-more-h' },
      h('h2', { id: 'lr-more-h' }, 'Practise and test yourself'),
      h('div', { class: 'grid lr-ctas' },
        h('div', { class: 'card lr-cta' },
          h('p', { class: 'eyebrow' }, 'Practise'),
          h('h3', null, 'Practice cases'),
          h('p', { class: 'muted' }, 'Staged adult cases. Decide at each step, then see the symptom profile and the expert answer.'),
          h('p', { class: 'lr-cta-s' }, cs.length ? st.cases + ' of ' + cs.length + ' done' + (avgPct !== null ? ' · ' + avgPct + '% of questions correct' : '') : 'No cases in this build yet'),
          h('div', { class: 'card-foot' }, ui.btn({ label: 'Open the cases', kind: 'primary', go: 'cases', disabled: !cs.length }))),
        h('div', { class: 'card lr-cta' },
          h('p', { class: 'eyebrow' }, 'Assess yourself'),
          h('h3', null, 'Mastery exam'),
          h('p', { class: 'muted' }, Math.min(EXAM_SIZE, pool) + ' questions from every module and the practice cases. Pass mark ' + PASS + '%. A self-assessment, not an accredited certificate.'),
          h('p', { class: 'lr-cta-s' }, ex ? 'Best ' + ex.best + '% · last ' + ex.last + '%' + (ex.at ? ' on ' + U.fmtDate(ex.at) : '') : 'Not taken yet', ex && ex.best >= PASS ? [' ', ui.badge('✓ Passed', 'ok')] : null),
          h('div', { class: 'card-foot' }, ui.btn({ label: ex ? 'Take it again' : 'Start the exam', kind: 'primary', go: 'exam', disabled: !pool }))),
        h('a', { class: 'card card-link lr-cta', href: '#glossary', 'data-go': 'glossary' },
          h('p', { class: 'eyebrow' }, 'Reference'),
          h('h3', null, 'Glossary'),
          h('p', { class: 'muted' }, 'Plain-English definitions of the terms used in the modules and the assessment.'),
          h('p', { class: 'lr-cta-s' }, U.plural((AA.data.glossary || []).length, 'term'))))));
  }

  /* ======================================================================
     Route: module-<id>
     ====================================================================== */

  function renderModule(el, params) {
    var m = moduleById(params[0]);
    if (!m) { notFound(el, 'Module not found', 'This module is not available in this build.', 'learn', 'All modules'); return; }
    var mods = modules(), i = mods.indexOf(m), no = modNo(m), qs = quizOf(m);
    el.appendChild(ui.pageHead({
      eyebrow: 'Module ' + no + ' of ' + mods.length + (m.minutes ? ' · ' + m.minutes + ' minutes' : ''),
      title: modTitle(m), lead: txt(m.summary) || null,
      actions: [ui.btn({ label: 'All modules', kind: 'ghost', go: 'learn', icon: '←' })]
    }));

    var secs = [];   // {id, label, n, node} in page order, for the contents list
    function sec(label, n, node) { secs.push({ id: node.id, label: label, n: n, node: node }); return node; }
    var article = h('div', { class: 'lr-article' });

    var obj = texts(m.objectives);
    if (obj.length) article.appendChild(h('section', { class: 'lr-objectives', 'aria-labelledby': 'lr-obj-h' },
      h('h2', { id: 'lr-obj-h' }, 'By the end of this module you can'), ui.list(obj, 'list lr-obj-list')));

    var count = 0;
    arr(m.sections).forEach(function (s) {
      if (!s || (!txt(s.h) && !s.html)) return;
      count++;
      var id = 'lr-s' + count;
      article.appendChild(sec(txt(s.h) || 'Section ' + count, count, h('section', { class: 'lr-sec', id: id, 'aria-labelledby': id + 'h' },
        h('h2', { id: id + 'h', tabindex: '-1' }, txt(s.h) || 'Section ' + count),
        prose(typeof s.html === 'string' ? s.html : ''))));
    });
    if (!count) article.appendChild(ui.callout('info', h('p', null, 'The teaching content for this module is not available in this build.')));

    var kp = texts(m.keyPoints), pit = texts(m.pitfalls), refs = texts(m.refs);
    if (kp.length) article.appendChild(sec('Key points', null, h('section', { class: 'lr-sec lr-sec-box', id: 'lr-key', 'aria-labelledby': 'lr-key-h' },
      h('div', { class: 'lr-box lr-box-key' }, h('h2', { id: 'lr-key-h', tabindex: '-1' }, 'Key points'), ui.list(kp, 'lr-ticks')))));
    if (pit.length) article.appendChild(sec('Common pitfalls', null, h('section', { class: 'lr-sec lr-sec-box', id: 'lr-pit', 'aria-labelledby': 'lr-pit-h' },
      h('div', { class: 'lr-box lr-box-warn' }, h('h2', { id: 'lr-pit-h', tabindex: '-1' }, 'Common pitfalls'), ui.list(pit, 'lr-warns')))));
    if (refs.length) article.appendChild(sec('References', null, h('section', { class: 'lr-sec lr-sec-refs', id: 'lr-refs', 'aria-labelledby': 'lr-refs-h' },
      h('h2', { id: 'lr-refs-h', tabindex: '-1' }, 'References'),
      h('ol', { class: 'lr-reflist' }, refs.map(function (r) { return h('li', { class: 'source' }, r); })))));

    /* ---- Finish bar: mark as read, quiz, previous / next ---- */
    var readStatus = h('p', { class: 'lr-read-status', 'aria-live': 'polite' });
    var toggle = h('button', { type: 'button', class: 'btn lr-toggle', 'aria-pressed': 'false' }, h('span', { class: 'lr-toggle-box', 'aria-hidden': 'true' }), 'Mark as read');
    function paintRead() {
      var on = isRead(m.id), at = AA.progress.get('modules.' + m.id + '.at', null);
      toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      readStatus.textContent = on ? 'Marked as read' + (at ? ' on ' + U.fmtDate(at) : '') + '.' : 'Not marked as read yet.';
    }
    toggle.addEventListener('click', function () {
      var on = !isRead(m.id);
      AA.progress.set('modules.' + m.id + '.done', on);
      AA.progress.set('modules.' + m.id + '.at', on ? new Date().toISOString() : undefined);
      paintRead();
    });
    paintRead();
    var qr = quizRec(m.id);
    var prev = mods[i - 1], next = mods[i + 1];
    function pager(x, k, cls) {
      return h('a', { class: 'lr-pager-link ' + cls, href: '#module-' + x.id, 'data-go': 'module-' + x.id },
        h('span', { class: 'lr-pager-k' }, k), h('span', { class: 'lr-pager-t' }, modNo(x) + '. ' + modTitle(x)));
    }
    article.appendChild(h('section', { class: 'lr-finish', 'aria-labelledby': 'lr-fin-h' },
      h('h2', { id: 'lr-fin-h', class: 'sr-only' }, 'Finish this module'),
      h('div', { class: 'lr-modbar' },
        h('div', { class: 'lr-modbar-read' }, toggle, readStatus),
        h('div', { class: 'lr-modbar-quiz' },
          qs.length ? h('p', { class: 'lr-modbar-q' }, qr ? 'Quiz best ' + qr.best + '%' + (qr.best >= PASS ? ' ✓ passed' : ' (pass mark ' + PASS + '%)') : U.plural(qs.length, 'question') + ' · pass mark ' + PASS + '%') : null,
          qs.length ? ui.btn({ label: qr && qr.best >= PASS ? 'Retake the quiz' : 'Take the quiz', kind: qr && qr.best >= PASS ? 'ghost' : 'primary', go: 'quiz-' + m.id })
            : h('p', { class: 'lr-modbar-q' }, 'No quiz for this module yet.'))),
      prev || next ? h('nav', { class: 'lr-pager', 'aria-label': 'Other modules' },
        prev ? pager(prev, '← Previous module', 'lr-pager-prev') : h('span'),
        next ? pager(next, 'Next module →', 'lr-pager-next') : h('span')) : null));

    /* ---- Contents list (buttons scroll to the headings; the route and hash stay as they are) ---- */
    var tocBtns = {};
    var toc = secs.length > 1 ? h('nav', { class: 'lr-toc', 'aria-label': 'On this page' },
      h('details', { class: 'lr-toc-d', open: wide() },
        h('summary', null, h('span', null, 'On this page'), h('span', { class: 'lr-toc-meta' }, U.plural(count, 'section'))),
        h('ol', null, secs.map(function (s) {
          var b = h('button', { type: 'button', class: 'lr-toc-btn' + (s.n ? '' : ' lr-toc-extra'), onclick: function () { jumpTo(s.node); } },
            s.n ? h('span', { class: 'lr-toc-n', 'aria-hidden': 'true' }, String(s.n)) : null, h('span', null, s.label));
          tocBtns[s.id] = b;
          return h('li', null, b);
        })))) : null;
    el.appendChild(h('div', { class: 'lr-doc' + (toc ? '' : ' lr-doc-notoc') }, toc, article));

    /* ---- Highlight the section in view in the contents list ---- */
    var spy = null;
    if (toc && typeof window.IntersectionObserver === 'function') {
      var seen = {};
      try {
        spy = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
          var cur = secs.filter(function (s) { return seen[s.id]; })[0];
          if (!cur) return;
          Object.keys(tocBtns).forEach(function (k) { if (k === cur.id) tocBtns[k].setAttribute('aria-current', 'true'); else tocBtns[k].removeAttribute('aria-current'); });
        }, { rootMargin: '-72px 0px -55% 0px' });
        secs.forEach(function (s) { spy.observe(s.node); });
      } catch (e) { spy = null; }
    }
    return function () { if (spy) spy.disconnect(); };
  }

  /* ======================================================================
     Route: quiz-<id>
     ====================================================================== */

  function priorLine(rec) {
    if (!rec) return null;
    return h('p', { class: 'lr-prior' }, 'Best ' + rec.best + '% · last ' + rec.last + '%' + (rec.at ? ' on ' + U.fmtDate(rec.at) : ''),
      rec.best >= PASS ? [' ', ui.badge('✓ Passed', 'ok')] : null);
  }

  function renderQuiz(el, params) {
    var m = moduleById(params[0]);
    if (!m) { notFound(el, 'Quiz not found', 'This module and its quiz are not available in this build.', 'learn', 'All modules'); return; }
    var mods = modules(), i = mods.indexOf(m), no = modNo(m), qs = quizOf(m);
    el.appendChild(ui.pageHead({
      eyebrow: 'Quiz · module ' + no, title: modTitle(m),
      lead: qs.length ? U.plural(qs.length, 'question') + '. Pass mark ' + PASS + '%. The options are shuffled on every attempt.' : null,
      actions: [ui.btn({ label: 'Back to module', kind: 'ghost', go: 'module-' + m.id, icon: '←' })]
    }));
    if (!qs.length) {
      el.appendChild(ui.empty('No quiz for this module yet', 'Read the module, then come back when the quiz is available.', ui.btn({ label: 'Back to module', kind: 'primary', go: 'module-' + m.id })));
      return;
    }
    var prior = priorLine(quizRec(m.id));
    if (prior) el.appendChild(prior);
    var host = h('div', { class: 'lr-quiz-host' });
    el.appendChild(host);
    var next = mods[i + 1];
    runQuiz(host, {
      key: 'quiz-' + m.id,
      make: function () { return qs.map(function (q) { return { q: q, order: optionOrder(q) }; }); },
      onFinish: function (r) { return saveScore('quizzes.' + m.id, r.pct); },
      back: { label: 'Back to module', go: 'module-' + m.id },
      next: next ? { label: 'Next module: ' + modTitle(next), go: 'module-' + next.id } : { label: 'Go to the practice cases', go: 'cases' },
      retryLabel: 'Retry'
    });
  }

  /* ======================================================================
     Route: exam (mastery exam)
     ====================================================================== */

  /* Every valid question from the module quizzes and the case stages, tagged with where it came from. */
  function examPool() {
    var out = [];
    modules().forEach(function (m) {
      var no = modNo(m);
      quizOf(m).forEach(function (q) {
        out.push({ q: q, gid: m.id, glabel: 'Module ' + no + ': ' + modTitle(m), go: 'module-' + m.id, src: 'From module ' + no + ': ' + modTitle(m) });
      });
    });
    cases().forEach(function (c) {
      var st = stagesOf(c);
      st.forEach(function (s, k) {
        if (!validQ(s.q)) return;
        out.push({ q: s.q, gid: '_cases', glabel: 'Practice cases', go: 'cases', src: 'From the practice case: ' + (txt(c.title) || 'Untitled case'), caseRef: c, stage: k });
      });
    });
    return out;
  }

  /* A case question needs its story: a short line plus the case so far, built only when opened. */
  function caseContext(c, upTo) {
    var body = h('div', { class: 'lr-ctx-body' });
    var d = ui.details('Read the case so far', body, { cls: 'lr-ctx-d' });
    var built = false;
    d.addEventListener('toggle', function () {
      if (!d.open || built) return;
      built = true;
      if (txt(c.referral)) body.appendChild(h('p', null, h('strong', null, 'Referral: '), txt(c.referral)));
      stagesOf(c).slice(0, upTo + 1).forEach(function (s, k) {
        body.appendChild(h('h3', { class: 'lr-ctx-h' }, 'Stage ' + (k + 1) + (txt(s.title) ? ': ' + txt(s.title) : '')));
        if (typeof s.html === 'string') body.appendChild(prose(s.html));
      });
    });
    return h('div', { class: 'lr-ctx' },
      h('p', { class: 'lr-ctx-line' }, 'Practice case: ' + (txt(c.title) || 'Untitled case') + (txt(c.patient) ? ' (' + txt(c.patient) + ')' : '')), d);
  }

  /* Balanced sample: round-robin over the sources (modules, cases) so every area is represented. */
  function sampleExam(pool) {
    var groups = {}, order = [];
    pool.forEach(function (x) { if (!groups[x.gid]) { groups[x.gid] = []; order.push(x.gid); } groups[x.gid].push(x); });
    order = shuffle(order);
    order.forEach(function (g) { groups[g] = shuffle(groups[g]); });
    var total = Math.min(EXAM_SIZE, pool.length), picked = [], k = 0;
    while (picked.length < total && k < pool.length * order.length + order.length) {
      var g = groups[order[k % order.length]];
      if (g.length) picked.push(g.shift());
      k++;
    }
    return shuffle(picked).map(function (x) {
      var it = { q: x.q, order: optionOrder(x.q), gid: x.gid, glabel: x.glabel, go: x.go, src: x.src };
      if (x.caseRef) { var c = x.caseRef, st = x.stage; it.ctx = function () { return caseContext(c, st); }; }
      return it;
    });
  }

  function breakdown(s) {
    var groups = {}, ids = [];
    s.items.forEach(function (it, k) {
      var g = groups[it.gid];
      if (!g) { g = groups[it.gid] = { id: it.gid, label: it.glabel, go: it.go, n: 0, ok: 0 }; ids.push(it.gid); }
      g.n++;
      if (s.picks[k] === it.q.a) g.ok++;
    });
    var mods = modules().map(function (m) { return m.id; });
    ids.sort(function (a, b) { var x = mods.indexOf(a), y = mods.indexOf(b); return (x < 0 ? 999 : x) - (y < 0 ? 999 : y); });
    var rows = ids.map(function (id) {
      var g = groups[id], p = pct(g.ok, g.n);
      return [g.label, h('span', { class: 'lr-num' }, g.ok + ' of ' + g.n + ' · ' + p + '%'),
        p >= PASS ? h('span', { class: 'lr-ok' }, '✓ Secure')
          : h('a', { href: '#' + g.go, 'data-go': g.go, class: 'lr-revise' }, id === '_cases' ? 'Revisit the cases' : 'Revise this module')];
    });
    return h('section', { class: 'section', 'aria-labelledby': 'lr-bd-h' },
      h('h2', { id: 'lr-bd-h' }, 'Results by module'),
      h('p', { class: 'muted' }, 'Areas under ' + PASS + '% are worth revising before you assess on your own.'),
      ui.table(['Area', 'Correct', 'Next'], rows, 'lr-bd'));
  }

  function statement(r) {
    var line = 'Completed the ADHD Assessment mastery exam on ' + U.fmtDate(r.at) + ' with ' + r.pct + '%.';
    var me = AA.auth.current();
    var copy = (me && me.name && !me.guest ? me.name + ': ' : '') + line + ' Self-assessment within the ADHD Assessment training; not an accredited certificate.';
    return h('section', { class: 'lr-cert', 'aria-labelledby': 'lr-cert-h' },
      h('h2', { id: 'lr-cert-h', class: 'lr-cert-k' }, 'Completion statement'),
      h('p', { class: 'lr-cert-s' }, line),
      h('p', { class: 'lr-cert-note' }, 'This is a self-assessment kept in this browser. It is not an accredited certificate, a qualification or evidence of competence for any regulator or employer.'),
      h('div', { class: 'row' }, ui.btn({ label: 'Copy statement', small: true, onClick: function () {
        U.copyText(copy).then(function (ok) { U.toast(ok ? 'Statement copied' : 'Copy failed. Your browser blocked the clipboard.', ok ? 'ok' : 'err'); });
      } })));
  }

  function renderExam(el) {
    var pool = examPool(), size = Math.min(EXAM_SIZE, pool.length);
    var nMods = modules().filter(function (m) { return quizOf(m).length; }).length;
    var hasCases = pool.some(function (x) { return x.gid === '_cases'; });
    el.appendChild(ui.pageHead({
      eyebrow: 'Assess yourself', title: 'Mastery exam',
      lead: 'A final check before you run the assessment on your own. ' + (size ? U.plural(size, 'question') + ' drawn from every module' + (hasCases ? ' and the practice cases' : '') + '. ' : '') + 'The pass mark is ' + PASS + '%.',
      actions: [ui.btn({ label: 'Assessor training', kind: 'ghost', go: 'learn', icon: '←' })]
    }));
    if (!pool.length) {
      el.appendChild(ui.empty('The exam is not available yet', 'It draws on the module quizzes, and none are available in this build.', ui.btn({ label: 'Assessor training', kind: 'primary', go: 'learn' })));
      return;
    }
    var host = h('div', { class: 'lr-quiz-host' });
    el.appendChild(host);
    var st = stats();
    runQuiz(host, {
      key: 'exam',
      intro: function (start) {
        var ex = examRec();
        return h('section', { class: 'card lr-intro', 'aria-labelledby': 'lr-intro-h' },
          h('h2', { id: 'lr-intro-h' }, 'Before you start'),
          ui.list([
            U.plural(size, 'question') + ', one at a time. You see the answer and the explanation after each one.',
            'Questions come from ' + U.plural(nMods, 'module') + (hasCases ? ' and the practice cases' : '') + '. Every attempt draws a new set and shuffles the options.',
            'Pass mark ' + PASS + '%. Your best and last scores are saved on this device, with a breakdown by module.',
            'This is a self-assessment. It is not an accredited certificate.'
          ], 'list lr-intro-list'),
          st.passed < st.quizzes ? ui.callout('info', h('p', null, 'You have passed ' + st.passed + ' of ' + st.quizzes + ' module quizzes. You can take the exam at any time, but it is easier once the modules are done.')) : null,
          ex ? priorLine(ex) : null,
          h('div', { class: 'row' }, ui.btn({ label: ex ? 'Start a new exam' : 'Start the exam', kind: 'primary', onClick: start })));
      },
      make: function () { return sampleExam(pool); },
      onFinish: function (r) { return saveScore('exam', r.pct); },
      back: { label: 'Back to training', go: 'learn' },
      retryLabel: 'Take a new exam',
      extra: function (r, s) {
        return h('div', { class: 'lr-exam-extra' }, r.passed ? statement(r) : null, breakdown(s));
      }
    });
  }

  /* ======================================================================
     Route: cases
     ====================================================================== */

  function caseCard(c) {
    var r = caseRec(c.id), lv = level(c), tags = texts(c.tags), nq = caseQCount(c), ns = stagesOf(c).length;
    var meta = [U.plural(ns, 'stage'), nq ? U.plural(nq, 'question') : null, r && r.at ? 'done ' + U.fmtDate(r.at) : null].filter(Boolean).join(' · ');
    return h('li', { class: 'card lr-case' + (r ? ' is-done' : '') },
      h('div', { class: 'lr-case-top' },
        lv ? ui.badge(lv, LEVEL_KIND[c.difficulty]) : h('span'),
        r ? ui.badge('✓ Done' + (r.of ? ': ' + r.score + ' of ' + r.of : ''), 'ok') : ui.badge('Not started', 'neutral')),
      h('h2', { class: 'lr-case-title' }, h('a', { class: 'lr-stretch', href: '#case-' + c.id, 'data-go': 'case-' + c.id }, txt(c.title) || 'Untitled case')),
      txt(c.patient) ? h('p', { class: 'lr-case-pt' }, txt(c.patient)) : null,
      h('p', { class: 'lr-case-meta' }, meta),
      tags.length ? h('ul', { class: 'chip-list lr-tags', 'aria-label': 'Topics' }, tags.map(function (t) { return h('li', { class: 'chip' }, t); })) : null);
  }

  function renderCases(el) {
    var cs = cases();
    el.appendChild(ui.pageHead({
      eyebrow: 'Practise', title: 'Practice cases',
      lead: 'Realistic adult referrals. Read each stage, commit to an answer, then compare your thinking with the symptom profile and the expert answer.',
      actions: [ui.btn({ label: 'Assessor training', kind: 'ghost', go: 'learn', icon: '←' })]
    }));
    if (!cs.length) { el.appendChild(ui.empty('No practice cases yet', 'Cases are not available in this build.', ui.btn({ label: 'Assessor training', kind: 'primary', go: 'learn' }))); return; }
    var done = cs.filter(function (c) { return caseRec(c.id); }).length;
    el.appendChild(h('div', { class: 'lr-sumbar' },
      h('p', null, h('strong', null, done + ' of ' + cs.length), ' cases done'),
      ui.progress(done, cs.length, 'Cases done'),
      h('p', { class: 'hint' }, 'Levels: Foundation, Intermediate, Advanced.')));
    el.appendChild(h('ul', { class: 'lr-cases' }, cs.map(caseCard)));
  }

  /* ======================================================================
     Route: case-<id>
     ====================================================================== */

  function profileTable(c) {
    var p = c.profile;
    if (!p || typeof p !== 'object') return null;
    var need = adultNeed(c);
    function cell(v, thr) {
      if (typeof v !== 'number') return 'Not given';
      return h('span', { class: 'lr-pf' }, h('strong', { class: 'lr-num' }, v + ' of 9'), ' ',
        v >= thr ? ui.badge('✓ Meets threshold (' + thr + ')', 'ok') : ui.badge('Below threshold (' + thr + ')', 'neutral'));
    }
    var cols = ['Adult (last 6 months)', 'Childhood (age 5-12)'];
    var table = ui.table(['Symptoms'].concat(cols), [
      ['Inattention', cell(p.adultIA, need), cell(p.childIA, 6)],
      ['Hyperactivity-impulsivity', cell(p.adultHI, need), cell(p.childHI, 6)]
    ], 'lr-pf-table');
    /* Column names repeated on each cell so the table can stack on phones. */
    U.$$('tbody tr', table).forEach(function (tr) { U.$$('td', tr).forEach(function (td, k) { td.setAttribute('data-label', cols[k]); }); });
    table.classList.add('lr-pf-wrap');
    return h('section', { class: 'card lr-profile', 'aria-labelledby': 'lr-pf-h' },
      h('h2', { id: 'lr-pf-h', tabindex: '-1' }, 'Symptom profile'),
      table,
      h('p', { class: 'hint' }, 'Adult threshold ' + need + ' (DSM-5-TR' + (need === 5 ? ', age 17 and over' : '') + '). Childhood column uses the DIVA convention of 6.'),
      txt(p.impairment) ? h('p', { class: 'lr-pf-imp' }, h('strong', null, 'Impairment: '), txt(p.impairment)) : null);
  }

  function expertAnswer(c) {
    var a = c.answer && typeof c.answer === 'object' ? c.answer : {};
    var ddx = texts(a.ddx), teach = texts(a.teaching);
    return h('section', { class: 'card lr-answer', 'aria-labelledby': 'lr-ans-h' },
      h('h2', { id: 'lr-ans-h' }, 'Expert answer'),
      txt(a.conclusion) ? h('p', { class: 'lr-conclusion' }, txt(a.conclusion)) : h('p', { class: 'muted' }, 'No expert answer is recorded for this case.'),
      txt(a.codes) ? h('p', { class: 'lr-codes' }, h('strong', null, 'Coding: '), txt(a.codes)) : null,
      ddx.length ? [h('h3', null, 'Differentials and co-occurring conditions'), ui.list(ddx)] : null,
      teach.length ? [h('h3', null, 'Teaching points'), ui.list(teach, 'lr-ticks')] : null);
  }

  function renderCase(el, params) {
    var c = caseById(params[0]);
    if (!c) { notFound(el, 'Case not found', 'This practice case is not available in this build.', 'cases', 'All cases'); return; }
    var all = cases(), ci = all.indexOf(c), next = all[ci + 1] || null;
    var stages = stagesOf(c), lv = level(c), nq = caseQCount(c), tags = texts(c.tags);
    var key = 'case-' + c.id;
    el.appendChild(ui.pageHead({
      eyebrow: 'Practice case' + (lv ? ' · ' + lv : ''), title: txt(c.title) || 'Practice case',
      lead: [txt(c.patient), U.plural(stages.length, 'stage'), nq ? U.plural(nq, 'question') : null].filter(Boolean).join(' · '),
      actions: [ui.btn({ label: 'All cases', kind: 'ghost', go: 'cases', icon: '←' })]
    }));
    var rec = caseRec(c.id);
    if (tags.length || rec) el.appendChild(h('div', { class: 'lr-case-info' },
      tags.length ? h('ul', { class: 'chip-list', 'aria-label': 'Topics' }, tags.map(function (t) { return h('li', { class: 'chip' }, t); })) : null,
      rec ? h('p', { class: 'lr-prior' }, 'Last done ' + (rec.at ? U.fmtDate(rec.at) : '') + (rec.of ? ': ' + rec.score + ' of ' + rec.of + ' correct' : '')) : null));

    var s = resume(key);
    function fresh() { s = { shown: 0, picks: {}, checked: {}, done: false, result: null }; setAttempt(key, s); }
    if (!s) fresh();
    var body = h('div', { class: 'lr-casewrap' });
    el.appendChild(body);

    function advance() {
      if (s.shown < stages.length) { s.shown++; draw('lr-st-' + (s.shown - 1)); }
      else { finish(); draw('lr-pf-h'); }
    }
    function finish() {
      if (s.done) return;
      var score = 0, of = 0;
      stages.forEach(function (st, i) { if (validQ(st.q)) { of++; if (s.picks[i] === st.q.a) score++; } });
      AA.progress.set('cases.' + c.id, { score: score, of: of, at: new Date().toISOString() });
      s.result = { score: score, of: of };
      s.done = true;
    }
    function contLabel(i) { return i >= stages.length - 1 ? 'Show the expert answer' : 'Continue'; }

    function stageEl(i) {
      var st = stages[i], current = !s.done && i === s.shown - 1;
      var li = h('li', { class: 'lr-stage' + (current ? ' is-current' : '') },
        h('div', { class: 'card lr-stage-card' },
          h('h2', { class: 'lr-stage-h', id: 'lr-st-' + i, tabindex: '-1' },
            h('span', { class: 'lr-stage-k' }, 'Stage ' + (i + 1) + ' of ' + stages.length), h('span', { class: 'sr-only' }, ': '), txt(st.title) || 'What happens next'),
          typeof st.html === 'string' && st.html ? prose(st.html) : null));
      var card = li.firstChild;
      if (validQ(st.q)) {
        card.appendChild(ask(st.q, {
          order: identity(st.q), pick: s.picks[i], checked: !!s.checked[i], tag: 'h3',
          onPick: function (v) { s.picks[i] = v; },
          onCheck: function () { s.checked[i] = true; },
          nextLabel: contLabel(i), onNext: current ? advance : null
        }));
      } else if (current) {
        card.appendChild(h('div', { class: 'lr-qactions' }, ui.btn({ label: contLabel(i), kind: 'primary', onClick: advance })));
      }
      return li;
    }

    function final() {
      var r = s.result;
      return h('div', { class: 'lr-final' },
        h('div', { class: 'callout ' + (r.of && pct(r.score, r.of) >= PASS ? 'callout-ok' : 'callout-info') + ' lr-case-score', role: 'status' },
          r.of ? h('p', null, h('strong', null, 'You answered ' + r.score + ' of ' + r.of + ' questions correctly (' + pct(r.score, r.of) + '%).'), ' Saved to your training progress.')
            : h('p', null, h('strong', null, 'Case complete.'), ' This case has no questions: compare your own thinking with the expert answer. Saved to your training progress.')),
        profileTable(c),
        expertAnswer(c),
        h('div', { class: 'row lr-final-actions' },
          next ? ui.btn({ label: 'Next case: ' + (txt(next.title) || 'Untitled case'), kind: 'primary', go: 'case-' + next.id }) : ui.btn({ label: 'Back to training', kind: 'primary', go: 'learn' }),
          ui.btn({ label: 'Try again', kind: 'ghost', onClick: function () {
            setAttempt(key, null); fresh(); draw('lr-ref-h');
            try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
          } }),
          ui.btn({ label: 'All cases', kind: 'quiet', go: 'cases' })));
    }

    function draw(focusId) {
      U.clear(body);
      body.appendChild(h('section', { class: 'card lr-referral', 'aria-labelledby': 'lr-ref-h' },
        h('h2', { id: 'lr-ref-h', tabindex: '-1' }, 'Referral'),
        h('p', null, txt(c.referral) || 'No referral text is recorded for this case.'),
        s.shown === 0 && !s.done ? h('div', { class: 'lr-qactions' }, ui.btn({ label: stages.length ? 'Start the case' : 'Show the expert answer', kind: 'primary', onClick: advance })) : null));
      if (s.shown) {
        var list = h('ol', { class: 'lr-stages' });
        for (var i = 0; i < s.shown && i < stages.length; i++) list.appendChild(stageEl(i));
        body.appendChild(list);
      }
      if (s.done) body.appendChild(final());
      if (focusId) { var t = document.getElementById(focusId); if (t) reveal(t, t); }
    }
    draw(null);
  }

  /* ======================================================================
     Route: glossary
     ====================================================================== */

  function renderGlossary(el) {
    var terms = (AA.data.glossary || []).filter(function (g) { return g && txt(g.term); })
      .map(function (g) { return { term: txt(g.term), def: txt(g.def) }; })
      .sort(function (a, b) { return a.term.localeCompare(b.term, 'en-GB', { sensitivity: 'base' }); });
    el.appendChild(ui.pageHead({
      eyebrow: 'Learn', title: 'Glossary',
      lead: 'Terms used in adult ADHD assessment and in this app, explained in plain words.',
      actions: [ui.btn({ label: 'Assessor training', kind: 'ghost', go: 'learn', icon: '←' })]
    }));
    if (!terms.length) { el.appendChild(ui.empty('No glossary yet', 'The glossary is not available in this build.')); return; }

    /* Build every entry once; the filter only toggles "hidden". */
    var groups = [], byLetter = {};
    terms.forEach(function (t) {
      var ch = t.term.charAt(0).toUpperCase();
      try { ch = ch.normalize('NFD').charAt(0); } catch (e) { /* old browsers */ }
      var L = /[A-Z]/.test(ch) ? ch : '#';
      if (!byLetter[L]) { byLetter[L] = { letter: L, items: [] }; groups.push(byLetter[L]); }
      var row = h('div', { class: 'lr-gitem' }, h('dt', null, t.term), t.def ? h('dd', null, t.def) : null);
      byLetter[L].items.push({ row: row, hay: (t.term + ' ' + t.def).toLowerCase() });
    });
    groups.sort(function (a, b) { return a.letter === '#' ? -1 : b.letter === '#' ? 1 : a.letter.localeCompare(b.letter); });
    groups.forEach(function (g) {
      g.node = h('section', { class: 'lr-gsec', id: 'lr-g-' + (g.letter === '#' ? 'num' : g.letter), 'aria-labelledby': 'lr-gh-' + (g.letter === '#' ? 'num' : g.letter) },
        h('h2', { id: 'lr-gh-' + (g.letter === '#' ? 'num' : g.letter), tabindex: '-1' }, g.letter === '#' ? '0-9' : g.letter),
        h('dl', { class: 'lr-gdl' }, g.items.map(function (x) { return x.row; })));
    });

    var countEl = h('p', { class: 'lr-gcount', 'aria-live': 'polite' });
    var none = ui.empty('No matching terms', 'Try a shorter word, or clear the search.');
    none.hidden = true;
    var letters = {};
    var alpha = ['#'].concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')).filter(function (L) { return L !== '#' || byLetter['#']; });
    var nav = h('nav', { 'aria-label': 'Jump to a letter' }, h('ul', { class: 'lr-letters' }, alpha.map(function (L) {
      var b = h('button', { type: 'button', class: 'lr-letter', 'aria-label': L === '#' ? 'Numbers and symbols' : 'Letter ' + L, onclick: function () { if (byLetter[L]) jumpTo(byLetter[L].node); } }, L === '#' ? '0-9' : L);
      letters[L] = b;
      return h('li', null, b);
    })));

    function apply(q) {
      var words = String(q || '').toLowerCase().split(/\s+/).filter(Boolean), shown = 0;
      groups.forEach(function (g) {
        var n = 0;
        g.items.forEach(function (x) {
          var ok = words.every(function (w) { return x.hay.indexOf(w) > -1; });
          x.row.hidden = !ok;
          if (ok) n++;
        });
        g.node.hidden = !n;
        shown += n;
      });
      alpha.forEach(function (L) { letters[L].disabled = !(byLetter[L] && !byLetter[L].node.hidden); });
      none.hidden = shown > 0;
      countEl.textContent = words.length ? shown + ' of ' + U.plural(terms.length, 'term') + ' match "' + q + '"' : U.plural(terms.length, 'term');
    }
    var search = ui.search('Search terms and definitions', apply);
    search.removeAttribute('aria-label');   // the visible field label names it
    el.appendChild(h('div', { class: 'lr-gtools' }, ui.field('Find a term', search), nav, countEl));
    el.appendChild(h('div', { class: 'lr-glossary' }, groups.map(function (g) { return g.node; }), none));
    apply('');
  }

  /* ---------- Routes ---------- */

  AA.router.register('learn', { title: 'Assessor training', render: renderLearn });
  AA.router.register('module', { title: function (p) { var m = moduleById(p[0]); return m ? modTitle(m) : 'Module'; }, render: renderModule });
  AA.router.register('quiz', { title: function (p) { var m = moduleById(p[0]); return m ? 'Quiz: ' + modTitle(m) : 'Quiz'; }, render: renderQuiz });
  AA.router.register('exam', { title: 'Mastery exam', render: renderExam });
  AA.router.register('cases', { title: 'Practice cases', render: renderCases });
  AA.router.register('case', { title: function (p) { var c = caseById(p[0]); return c ? txt(c.title) || 'Practice case' : 'Practice case'; }, render: renderCase });
  AA.router.register('glossary', { title: 'Glossary', render: renderGlossary });
})(window.AA);
