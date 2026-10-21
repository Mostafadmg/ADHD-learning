/* Assessment workspace: step strip, step content, live score panel and step navigation.
   Route: "assess" (resume or choose) and "assess-<id>-<step>[-<sub>]".
   Step views register themselves in AA.steps[stepId] = {render(el, ctx)} (see ARCHITECTURE.md). */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui, D = AA.diagnosis;
  AA.steps = AA.steps || {};

  var STEPS = AA.STEP_LIST = [
    { id: 'setup', title: 'Before you start', short: 'Start', lead: 'Patient details, consent, who is present and what information you have.' },
    { id: 'screen', title: 'Screening questionnaires', short: 'Screening', lead: 'Self-report scales, ideally completed before the appointment: ASRS v1.1, WURS-25 and WFIRS-S.' },
    { id: 'risk', title: 'Safety and risk', short: 'Risk', lead: 'Check safety first. Some answers mean the ADHD assessment should pause.' },
    { id: 'history', title: 'Clinical history', short: 'History', lead: 'Development, school, work, relationships, mental and physical health, substances, family and forensic history.' },
    { id: 'comorbid', title: 'Co-occurring conditions screen', short: 'Comorbidity', lead: 'Brief scales for the conditions that most often co-occur with, or mimic, ADHD.' },
    { id: 'ia', title: 'Interview part 1: inattention', short: 'Inattention', lead: 'Nine inattention symptoms (DSM-5-TR A1). Ask about adulthood first, then childhood (age 5-12).' },
    { id: 'hi', title: 'Interview part 2: hyperactivity-impulsivity', short: 'Hyperactivity', lead: 'Nine hyperactivity-impulsivity symptoms (DSM-5-TR A2), adulthood then childhood.' },
    { id: 'onset', title: 'Onset and impairment', short: 'Onset & impairment', lead: 'When symptoms started (criterion B), where they cause problems (C) and how much (D).' },
    { id: 'collateral', title: 'Collateral information', short: 'Collateral', lead: 'Informants and school reports: who supports the history, and how strongly.' },
    { id: 'ddx', title: 'Differential diagnosis', short: 'Differentials', lead: 'Could another condition explain the symptoms better (criterion E), or does it co-occur?' },
    { id: 'validity', title: 'Symptom validity and consistency', short: 'Validity', lead: 'How much weight can the account bear? Consistency, incentives and over-reporting.' },
    { id: 'summary', title: 'Scoring and diagnosis', short: 'Diagnosis', lead: 'Criteria A-E, presentation, severity, coding and your conclusion.' },
    { id: 'report', title: 'Report and next steps', short: 'Report', lead: 'A draft report to copy into the record, plus the agreed plan.' }
  ];
  function stepIndex(id) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i].id === id) return i; return -1; }

  AA.router.register('assess', {
    title: function (p) { var s = STEPS[stepIndex(p[1])]; return s ? s.title : 'Assessment'; },
    render: function (el, params) {
      var id = params[0], step = params[1], sub = params[2];
      if (!id) return chooser(el);
      var a = AA.assess.get(id);
      var me = AA.auth.current();
      if (!a || (me && a.clinicianId !== me.id)) {
        el.appendChild(ui.empty('Assessment not found', 'It may have been deleted, or it belongs to another profile.', ui.btn({ label: 'Go to home', kind: 'primary', go: 'home' })));
        return;
      }
      if (stepIndex(step) < 0) step = a.step || 'setup';
      AA.progress.set('lastAssessment', id);
      if (a.step !== step) AA.assess.set(id, 'step', step);
      return workspace(el, id, step, sub);
    }
  });

  function chooser(el) {
    var last = AA.shell.lastAssessment();
    if (last) { setTimeout(function () { AA.router.go('assess-' + last.id + '-' + (last.step || 'setup')); }, 0); return; }
    var list = AA.assess.list();
    el.appendChild(ui.pageHead({ eyebrow: 'Assessment', title: 'Choose an assessment', actions: [ui.btn({ label: 'New assessment', kind: 'primary', go: 'new' })] }));
    if (!list.length) { el.appendChild(ui.empty('No assessments yet', 'Start a new assessment to begin.')); return; }
    el.appendChild(h('div', { class: 'a-list' }, list.map(function (a) {
      return h('div', { class: 'a-row' }, h('div', null, h('div', { class: 'a-row-title' }, a.patient.ref || 'Untitled patient'), h('div', { class: 'a-row-meta' }, 'Updated ' + U.fmtDate(a.updatedAt, true))),
        h('div', { class: 'a-row-actions' }, ui.btn({ label: 'Open', kind: 'primary', small: true, go: 'assess-' + a.id + '-' + (a.step || 'setup') })));
    })));
  }

  function workspace(el, id, step, sub) {
    var subs = [];
    var idx = stepIndex(step);
    var meta = STEPS[idx];
    var a = AA.assess.get(id);
    var p = a.patient || {};

    var ctx = {
      id: id, step: step, sub: sub || null,
      a: function () { return AA.assess.get(id); },
      get: function (rel, fb) { return AA.assess.get(id, rel, fb); },
      set: function (rel, value) { AA.assess.set(id, rel, value); },
      go: function (s, sb) { AA.router.go('assess-' + id + '-' + s + (sb ? '-' + sb : '')); },
      /* Subscribe to changes inside this assessment; removed automatically when leaving the step. */
      onChange: function (rel, fn) { var off = AA.store.subscribe(AA.assess.path(id, rel), fn); subs.push(off); return off; },
      meta: meta
    };

    el.appendChild(h('header', { class: 'page-head' },
      h('div', { class: 'page-head-text' },
        h('p', { class: 'eyebrow' }, 'Step ' + (idx + 1) + ' of ' + STEPS.length + (a.demo ? ' · demo patient' : '')),
        h('h1', null, meta.title),
        h('p', { class: 'lead' }, meta.lead))));

    var stepper = h('nav', { class: 'stepper', 'aria-label': 'Assessment steps' }, h('ol', null, STEPS.map(function (s, i) {
      var pr = D.stepProgress(a, s.id);
      var cls = 'step-chip' + (pr.done >= pr.of ? ' done' : pr.done > 0 ? ' part' : '');
      return h('li', null, h('button', { type: 'button', class: cls, 'aria-current': s.id === step ? 'step' : null, title: s.title + ' (' + pr.done + '/' + pr.of + ')', onclick: function () { ctx.go(s.id); } },
        h('span', { class: 'step-n' }, pr.done >= pr.of ? '✓' : String(i + 1)), s.short));
    })));
    el.appendChild(stepper);
    setTimeout(function () { var cur = stepper.querySelector('[aria-current="step"]'); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest', inline: 'center' }); }, 0);

    var main = h('div', { class: 'ws-main' });
    var panel = h('aside', { class: 'ws-panel', 'aria-label': 'Live summary' });
    el.appendChild(h('div', { class: 'ws' }, main, panel));

    var guide = stepGuide(step);
    if (guide) main.appendChild(guide);

    var stepDef = AA.steps[step];
    var stepCleanup = null;
    if (stepDef && stepDef.render) {
      try { stepCleanup = stepDef.render(main, ctx); } catch (e) {
        if (window.console) console.error(e);
        main.appendChild(ui.callout('err', h('p', null, 'This step failed to load: ' + e.message)));
      }
    } else {
      main.appendChild(ui.callout('warn', h('p', null, 'This step is not available in this build.')));
    }

    /* Previous / next */
    var prev = STEPS[idx - 1], next = STEPS[idx + 1];
    main.appendChild(h('div', { class: 'step-nav' },
      prev ? ui.btn({ label: '← ' + prev.short, kind: 'ghost', onClick: function () { ctx.go(prev.id); } }) : h('span'),
      next ? ui.btn({ label: next.short + ' →', kind: 'primary', onClick: function () { ctx.go(next.id); } })
        : ui.btn({ label: a.status === 'complete' ? 'Reopen assessment' : 'Mark assessment complete', kind: a.status === 'complete' ? 'ghost' : 'primary', onClick: function () {
          var done = AA.assess.get(id, 'status') === 'complete';
          AA.assess.set(id, 'status', done ? 'active' : 'complete');
          U.toast(done ? 'Assessment reopened' : 'Assessment marked complete', 'ok');
          AA.router.refresh();
        } })));

    /* Live panel and step strip refresh when the assessment changes. */
    var refresh = U.debounce(function () {
      var cur = AA.assess.get(id);
      if (!cur) return;
      renderPanel(panel, cur, ctx);
      U.$$('.step-chip', stepper).forEach(function (b, i) {
        var pr = D.stepProgress(cur, STEPS[i].id);
        b.classList.toggle('done', pr.done >= pr.of);
        b.classList.toggle('part', pr.done > 0 && pr.done < pr.of);
        b.querySelector('.step-n').textContent = pr.done >= pr.of ? '✓' : String(i + 1);
        b.title = STEPS[i].title + ' (' + pr.done + '/' + pr.of + ')';
      });
    }, 120);
    subs.push(AA.store.subscribe(AA.assess.path(id), refresh));
    renderPanel(panel, a, ctx);

    return function () {
      subs.forEach(function (off) { off(); });
      if (typeof stepCleanup === 'function') stepCleanup();
    };
  }

  /* ---------- "What to do in this step" guide (AA.data.stepGuide) ---------- */
  function stepGuide(step) {
    var g = AA.data.stepGuide && AA.data.stepGuide[step];
    if (!g) return null;
    var key = 'guideClosed.' + step;
    var d = h('details', { class: 'guide', open: !AA.progress.get(key, false) },
      h('summary', null,
        h('span', { class: 'guide-k' }, 'What to do in this step'),
        h('span', { class: 'guide-goal' }, g.goal),
        g.time ? h('span', { class: 'badge badge-neutral guide-time' }, g.time) : null),
      h('div', { class: 'guide-body' },
        g.do && g.do.length ? h('div', { class: 'guide-col' }, h('h3', null, 'Do this'), h('ol', { class: 'guide-do' }, g.do.map(function (x) { return h('li', null, x); }))) : null,
        h('div', { class: 'guide-col' },
          g.say && g.say.length ? [h('h3', null, 'You can say'), h('div', { class: 'guide-say' }, g.say.map(function (x) { return h('p', null, x); }))] : null,
          g.watch && g.watch.length ? [h('h3', null, 'Watch out for'), ui.list(g.watch, 'list guide-watch')] : null,
          g.done && g.done.length ? [h('h3', null, 'Done when'), ui.list(g.done, 'list guide-done')] : null,
          g.next ? h('p', { class: 'guide-next' }, h('strong', null, 'Next: '), g.next) : null,
          g.src && g.src.length ? ui.source(g.src.join('; ')) : null)));
    d.addEventListener('toggle', function () { AA.progress.set(key, !d.open); });
    return d;
  }

  /* ---------- Live summary panel ---------- */
  var wide = function () { try { return window.matchMedia('(min-width: 1240px)').matches; } catch (e) { return true; } };
  var foldOpen = null;
  function renderPanel(panel, a, ctx) {
    U.clear(panel);
    var need = D.need(a);
    var ad = D.counts(a, 'adult'), ch = D.counts(a, 'child');
    var cr = D.criteria(a);
    var out = D.outcome(a);
    function cnt(v, of, thr) { return h('span', { class: 'count' + (v >= thr ? ' hit' : '') }, String(v), h('small', { class: 'muted' }, '/' + of)); }
    var box = h('div', { class: 'panel' },
      h('h2', null, 'Live summary'),
      h('div', { class: 'count-grid' },
        h('span'), h('span', { class: 'h' }, 'Adult'), h('span', { class: 'h' }, 'Child'),
        h('span', null, 'Inattention'), cnt(ad.IA, ad.ofIA || 9, need), cnt(ch.IA, ch.ofIA || 9, 6),
        h('span', null, 'Hyperactive-impulsive'), cnt(ad.HI, ad.ofHI || 9, need), cnt(ch.HI, ch.ofHI || 9, 6)),
      h('p', { class: 'hint' }, 'Adult threshold ' + need + ' (DSM-5-TR' + (need === 5 ? ', age 17+' : '') + '). Child column shows the DIVA convention of 6.'),
      h('div', { class: 'panel-sec' },
        h('ul', { class: 'crit-list' }, ['A', 'B', 'C', 'D', 'E'].map(function (k) {
          var names = { A: 'A · Symptoms', B: 'B · Onset before 12', C: 'C · Two or more settings', D: 'D · Impairment', E: 'E · Not better explained' };
          return h('li', { title: cr[k].detail }, h('span', null, names[k]), ui.statusPill(cr[k].status));
        }))),
      h('div', { class: 'panel-sec' },
        h('p', { style: { margin: 0, fontWeight: 700 } }, out.title),
        out.presentation ? h('p', { class: 'hint' }, D.PRESENTATIONS[out.presentation].label + (out.severity ? ', ' + out.severity + ' (suggested)' : '')) : null,
        h('p', { class: 'hint' }, 'Evidence strength: ' + out.confidence.level)),
      redFlags(a),
      h('div', { class: 'panel-sec row' },
        ctx.step !== 'summary' ? ui.btn({ label: 'Open scoring', small: true, kind: 'ghost', onClick: function () { ctx.go('summary'); } }) : null,
        ui.btn({ label: 'Question bank', small: true, kind: 'quiet', go: 'bank' })));
    var adultSum = 'Adult ' + ad.IA + ' IA · ' + ad.HI + ' HI';
    var fold = h('details', { class: 'panel-fold', open: wide() || foldOpen === true },
      h('summary', null, h('span', null, 'Live summary'), h('span', { class: 'muted', style: { fontWeight: 400 } }, adultSum), ui.statusPill(out.code === 'met' ? 'met' : out.code === 'incomplete' ? 'pending' : out.code === 'subthreshold' ? 'partial' : 'not-met')),
      box);
    fold.addEventListener('toggle', function () { if (!wide()) foldOpen = fold.open; });
    panel.appendChild(fold);
  }

  /* Urgent flags gathered from risk answers and questionnaire flags. */
  function redFlags(a) {
    var flags = [];
    var risk = a.risk || {};
    ((AA.data.risk && AA.data.risk.items) || []).forEach(function (it) {
      if (risk[it.id] && (it.level === 'urgent' || it.level === 'high')) flags.push(it.short || it.text);
    });
    Object.keys(a.tools || {}).forEach(function (tid) {
      var r = AA.scoring.forAssessment(a, tid);
      if (r) r.flags.forEach(function (f) { if (f.level === 'urgent') flags.push(((AA.byId('tools', tid) || {}).abbr || tid) + ': ' + f.text); });
    });
    if (!flags.length) return null;
    return h('div', { class: 'panel-sec' }, ui.callout('err', ui.list(flags), 'Safety flags'));
  }
  AA.components.redFlags = redFlags;
})(window.AA);
