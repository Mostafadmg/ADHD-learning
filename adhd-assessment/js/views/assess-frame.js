/* Assessment workspace: step strip, step content, live score panel and step navigation.
   Route: "assess" (resume or choose) and "assess-<id>-<step>[-<sub>]".
   Step views register themselves in AA.steps[stepId] = {render(el, ctx)} (see ARCHITECTURE.md).
   Steps are grouped into phases (prepare, interview, diagnose, treat, report). Treatment steps get
   their own live panel (AA.components.treatPanel) when the treatment view is loaded.
   Young people (6-17): labels follow the age band (AA.diagnosis.band / bandInfo). */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui, D = AA.diagnosis;
  AA.steps = AA.steps || {};

  var STEPS = AA.STEP_LIST = [
    { id: 'setup', title: 'Before you start', short: 'Start', lead: 'Patient details, consent, who is present and what information you have.', phase: 'prepare' },
    { id: 'screen', title: 'Screening questionnaires', short: 'Screening', lead: 'Self-report scales, ideally completed before the appointment: ASRS v1.1, WURS-25 and WFIRS-S.', phase: 'prepare' },
    { id: 'risk', title: 'Safety and risk', short: 'Risk', lead: 'Check safety first. Some answers mean the ADHD assessment should pause.', phase: 'prepare' },
    { id: 'history', title: 'Clinical history', short: 'History', lead: 'Development, school, work, relationships, mental and physical health, substances, family and forensic history.', phase: 'prepare' },
    { id: 'comorbid', title: 'Co-occurring conditions screen', short: 'Comorbidity', lead: 'Brief scales for the conditions that most often co-occur with, or mimic, ADHD.', phase: 'prepare' },
    { id: 'ia', title: 'Interview part 1: inattention', short: 'Inattention', lead: 'Nine inattention symptoms (DSM-5-TR A1). Ask about adulthood first, then childhood (age 5-12).', phase: 'interview' },
    { id: 'hi', title: 'Interview part 2: hyperactivity-impulsivity', short: 'Hyperactivity', lead: 'Nine hyperactivity-impulsivity symptoms (DSM-5-TR A2), adulthood then childhood.', phase: 'interview' },
    { id: 'onset', title: 'Onset and impairment', short: 'Onset & impairment', lead: 'When symptoms started (criterion B), where they cause problems (C) and how much (D).', phase: 'interview' },
    { id: 'collateral', title: 'Collateral information', short: 'Collateral', lead: 'Informants and school reports: who supports the history, and how strongly.', phase: 'interview' },
    { id: 'ddx', title: 'Differential diagnosis', short: 'Differentials', lead: 'Could another condition explain the symptoms better (criterion E), or does it co-occur?', phase: 'diagnose' },
    { id: 'validity', title: 'Symptom validity and consistency', short: 'Validity', lead: 'How much weight can the account bear? Consistency, incentives and over-reporting.', phase: 'diagnose' },
    { id: 'summary', title: 'Scoring and diagnosis', short: 'Diagnosis', lead: 'Criteria A-E, presentation, severity, coding and your conclusion.', phase: 'diagnose' },
    { id: 'txplan', title: 'Treatment plan', short: 'Treatment plan', lead: 'Agree what happens after diagnosis: support first, then whether medicine is right, and who can prescribe it.', phase: 'treat' },
    { id: 'baseline', title: 'Pre-treatment checks', short: 'Checks', lead: 'Heart history, blood pressure, pulse, height and weight, and the safety screen before any ADHD medicine.', phase: 'treat' },
    { id: 'prescribe', title: 'Choose and prescribe', short: 'Prescribe', lead: 'The NICE order for this age, the right product and starting dose, counselling and a controlled drug prescription.', phase: 'treat' },
    { id: 'titrate', title: 'Titration and reviews', short: 'Titration', lead: 'Log each review: dose, blood pressure, pulse, weight, benefit and side effects, and decide the next step.', phase: 'treat' },
    { id: 'monitor', title: 'Monitoring and shared care', short: 'Monitoring', lead: 'The monitoring schedule, the annual review and handing prescribing to primary care.', phase: 'treat' },
    { id: 'report', title: 'Report and next steps', short: 'Report', lead: 'A draft report to copy into the record, plus the agreed plan.', phase: 'report' }
  ];
  var PHASES = AA.STEP_PHASES = [
    { id: 'prepare', label: 'Prepare' },
    { id: 'interview', label: 'Interview' },
    { id: 'diagnose', label: 'Diagnose' },
    { id: 'treat', label: 'Treat' },
    { id: 'report', label: 'Report' }
  ];
  function phaseLabel(id) { for (var i = 0; i < PHASES.length; i++) if (PHASES[i].id === id) return PHASES[i].label; return ''; }
  function stepIndex(id) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i].id === id) return i; return -1; }

  /* Age band helpers. They cope with an engine that has no band support yet (adult behaviour). */
  function ageBand(a) { try { return (D.band && D.band(a)) || 'adult'; } catch (e) { return 'adult'; } }
  function isYoung(a) { try { return !!(D.young && D.young(a)); } catch (e) { return false; } }
  function bandInfo(a) { try { return (D.bandInfo && D.bandInfo(a)) || {}; } catch (e) { return {}; } }
  /* Band 'child' (6-11): the before-12 period is the current period, so it is not shown separately. */
  function showsBefore12(a) {
    if (!isYoung(a)) return true;
    var p = bandInfo(a).periods;
    return Array.isArray(p) ? p.indexOf('child') > -1 : ageBand(a) !== 'child';
  }

  /* Step leads for young people, where the adult lead names adult tools or periods. */
  function leadFor(meta, a) {
    if (!isYoung(a)) return meta.lead;
    var before = showsBefore12(a);
    var noun = ageBand(a) === 'child' ? 'child' : 'young person';
    switch (meta.id) {
      case 'setup': return 'Age first, then the ' + noun + '\'s details, consent and agreement, who is present and what information you have.';
      case 'screen': return 'Rating scales from parents, teachers and the young person, ideally completed before the appointment. For licensed scales you enter the result.';
      case 'history': return 'Development, school and learning, family, friendships, mental and physical health, and family history.';
      case 'ia': return before ? 'Nine inattention symptoms (DSM-5-TR A1). Ask about now (the last 6 months), then before age 12.'
        : 'Nine inattention symptoms (DSM-5-TR A1), as they are now (the last 6 months), at home and at school.';
      case 'hi': return before ? 'Nine hyperactivity-impulsivity symptoms (DSM-5-TR A2), now and then before age 12.'
        : 'Nine hyperactivity-impulsivity symptoms (DSM-5-TR A2), as they are now (the last 6 months), at home and at school.';
      case 'collateral': return 'Parent or carer, teacher and the ' + noun + '\'s own view: who supports the history, and how strongly.';
      default: return meta.lead;
    }
  }

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
      /* Unknown step in the route: resume the stored step. A stored step this build does not know
         (for example from an older or newer version) falls back to the first step. */
      if (stepIndex(step) < 0) { step = a.step; sub = null; }
      if (stepIndex(step) < 0) step = 'setup';
      AA.progress.set('lastAssessment', id);
      if (a.step !== step) AA.assess.set(id, 'step', step);
      if (AA.shell && AA.shell.noteRoute) AA.shell.noteRoute('assess-' + id + '-' + step + (sub ? '-' + sub : ''));
      return workspace(el, id, step, sub);
    }
  });

  function chooser(el) {
    var last = AA.shell.lastAssessment();
    if (last) {
      setTimeout(function () {
        var t = AA.shell.resumeRoute(last);
        try { history.replaceState(null, '', '#' + t); } catch (e) { /* sandboxed */ }
        AA.router.go(t);
      }, 0);
      return;
    }
    var list = AA.assess.list();
    el.appendChild(ui.pageHead({ eyebrow: 'Assessment', title: 'Choose an assessment', actions: [ui.btn({ label: 'New assessment', kind: 'primary', go: 'new' })] }));
    if (!list.length) { el.appendChild(ui.empty('No assessments yet', 'Start a new assessment to begin.')); return; }
    el.appendChild(h('div', { class: 'a-list' }, list.map(function (a) {
      var s = stepIndex(a.step) > -1 ? a.step : 'setup';
      return h('div', { class: 'a-row' }, h('div', null, h('div', { class: 'a-row-title' }, a.patient.ref || 'Untitled patient'), h('div', { class: 'a-row-meta' }, 'Updated ' + U.fmtDate(a.updatedAt, true))),
        h('div', { class: 'a-row-actions' }, ui.btn({ label: 'Open', kind: 'primary', small: true, go: 'assess-' + a.id + '-' + s })));
    })));
  }

  /* Step progress that never throws; of = 0 means "not applicable" (for example treatment steps
     before a diagnosis is recorded). */
  function progressOf(a, stepId) {
    var pr = null;
    try { pr = D.stepProgress(a, stepId); } catch (e) { pr = null; }
    if (!pr || typeof pr.done !== 'number' || typeof pr.of !== 'number') pr = { done: 0, of: 1 };
    return pr;
  }

  function workspace(el, id, step, sub) {
    var subs = [];
    var idx = stepIndex(step);
    var meta = STEPS[idx];
    var a = AA.assess.get(id);
    var young = isYoung(a), bi = bandInfo(a);

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

    function eyebrowText(cur) {
      var b = bandInfo(cur);
      return 'Step ' + (idx + 1) + ' of ' + STEPS.length + (isYoung(cur) && b.label ? ' · ' + b.label : '') + (cur.demo ? ' · demo patient' : '');
    }
    var eyebrowEl = h('p', { class: 'eyebrow' }, eyebrowText(a)), leadEl = h('p', { class: 'lead' }, leadFor(meta, a));
    el.appendChild(h('header', { class: 'page-head ws-head' + (sub ? ' is-sub' : '') },
      h('div', { class: 'page-head-text' }, eyebrowEl, h('h1', null, meta.title), leadEl)));

    /* Step strip: one horizontally scrolling row. A small phase label (Prepare, Interview, Diagnose,
       Treat, Report) sits before the first chip of each phase. The labels are visual dividers
       (aria-hidden); screen readers hear the phase name inside the first chip of each phase. */
    var items = [], lastPhase = null;
    STEPS.forEach(function (s, i) {
      var first = s.phase !== lastPhase;
      if (first) {
        lastPhase = s.phase;
        items.push(h('li', { class: 'step-phase' + (i === 0 ? ' is-first' : '') + (s.phase === meta.phase ? ' is-cur' : ''), 'aria-hidden': 'true' }, phaseLabel(s.phase)));
      }
      items.push(h('li', null, h('button', { type: 'button', class: 'step-chip', 'aria-current': s.id === step ? 'step' : null, onclick: function () { ctx.go(s.id); } },
        first ? h('span', { class: 'sr-only' }, phaseLabel(s.phase) + ' phase: ') : null,
        h('span', { class: 'step-n', 'aria-hidden': 'true' }), h('span', { class: 'step-t' }, s.short), h('span', { class: 'sr-only step-sr' }))));
    });
    var stepList = h('ol', null, items);
    var stepper = h('nav', { class: 'stepper', 'aria-label': 'Assessment steps' }, stepList);
    function paintSteps(cur) {
      U.$$('.step-chip', stepper).forEach(function (b, i) {
        var pr = progressOf(cur, STEPS[i].id);
        var na = pr.of === 0;
        var done = !na && pr.done >= pr.of, part = !na && !done && pr.done > 0;
        b.classList.toggle('done', done);
        b.classList.toggle('part', part);
        b.querySelector('.step-n').textContent = done ? '✓' : na ? '–' : String(i + 1);
        b.querySelector('.step-sr').textContent = done ? ', complete' : na ? ', not applicable yet' : part ? ', started' : ', not started';
        b.title = STEPS[i].title + (done ? ' (complete)' : na ? ' (not applicable yet)' : ' (' + pr.done + ' of ' + pr.of + ')');
      });
    }
    paintSteps(a);
    /* Fade the edges that have more chips beyond them. */
    function paintEdges() {
      var max = stepList.scrollWidth - stepList.clientWidth;
      stepper.classList.toggle('more-left', stepList.scrollLeft > 4);
      stepper.classList.toggle('more-right', stepList.scrollLeft < max - 4);
    }
    stepList.addEventListener('scroll', paintEdges, { passive: true });
    el.appendChild(stepper);
    setTimeout(function () {
      var cur = stepper.querySelector('[aria-current="step"]');
      /* Centre the current chip; for the first chip of a phase keep its phase label in view too. */
      var li = cur ? cur.parentNode : null;
      var lab = li && li.previousSibling && li.previousSibling.classList && li.previousSibling.classList.contains('step-phase') ? li.previousSibling : null;
      if (cur) {
        var left = lab ? lab.offsetLeft : cur.offsetLeft;
        var width = cur.offsetLeft + cur.offsetWidth - left;
        stepList.scrollLeft = Math.max(0, left - (stepList.clientWidth - width) / 2);
      }
      paintEdges();
    }, 0);

    var main = h('div', { class: 'ws-main' });
    var panel = h('aside', { class: 'ws-panel', 'aria-label': 'Live summary' });
    el.appendChild(h('div', { class: 'ws' }, main, panel));

    /* Under 6: this workspace does not assess young children. The setup step shows the stop card and the
       referral details; the safety step records safeguarding; the report step builds the referral note. Every
       other step shows only the warning, so no assessment or treatment tools are used by mistake. */
    var under6 = ageBand(a) === 'under6';
    var u6Open = !under6 || step === 'setup' || step === 'risk' || step === 'report';
    if (under6 && step !== 'setup') {
      var ub = bandInfo(a);
      main.appendChild(ui.callout('err', h('div', null,
        h('p', null, step === 'risk' ? 'Record any safety or safeguarding concern about the child here, and act on it today under local procedures. It goes into the referral note.'
          : step === 'report' ? 'This is the referral note, built from the first step and the safety step.'
          : (ub.note || 'This workspace does not assess children under 6. Refer to a service with expertise in ADHD in young children.')),
        h('div', { class: 'row' },
          ui.btn({ label: 'Back to the first step', kind: 'ghost', small: true, onClick: function () { ctx.go('setup'); } }),
          step !== 'report' ? ui.btn({ label: 'Open the referral note', kind: 'ghost', small: true, onClick: function () { ctx.go('report'); } }) : null)),
        'Under 6: refer, do not assess here'));
    }

    var guide = under6 ? null : stepGuide(step, !!sub, a);
    if (guide) { main.appendChild(guide.el); guide.status(a); }

    var stepDef = u6Open ? AA.steps[step] : null;
    var stepCleanup = null;
    if (!u6Open) {
      /* nothing to render: the warning above says what to do */
    } else if (stepDef && stepDef.render) {
      try { stepCleanup = stepDef.render(main, ctx); } catch (e) {
        if (window.console) console.error(e);
        main.appendChild(ui.callout('err', h('p', null, 'This step failed to load: ' + e.message)));
      }
    } else {
      main.appendChild(ui.callout('warn', h('p', null, 'This step is not available in this build.')));
    }

    /* Previous / next. A symptom card has its own navigation, so the step buttons are left out there.
       Next is the primary action unless the step already shows its own primary action. */
    var prev = STEPS[idx - 1], next = STEPS[idx + 1];
    if (!sub) {
      var ownPrimary = !!main.querySelector('.btn-primary');
      main.appendChild(h('div', { class: 'step-nav' },
        prev ? ui.btn({ label: '← ' + prev.short, kind: 'ghost', title: 'Previous step: ' + prev.title, onClick: function () { ctx.go(prev.id); } }) : h('span'),
        next ? ui.btn({ label: 'Next: ' + next.short + ' →', kind: ownPrimary ? 'secondary' : 'primary', title: 'Next step: ' + next.title, onClick: function () { ctx.go(next.id); } })
          : ui.btn({ label: a.status === 'complete' ? 'Reopen assessment' : 'Mark assessment complete', kind: a.status === 'complete' || ownPrimary ? 'secondary' : 'primary', onClick: function () {
            var done = AA.assess.get(id, 'status') === 'complete';
            AA.assess.set(id, 'status', done ? 'active' : 'complete');
            U.toast(done ? 'Assessment reopened' : 'Assessment marked complete', 'ok');
            AA.router.refresh();
          } })));
    }

    /* Live panel and step strip refresh when the assessment changes. */
    function paintPanel(cur) {
      if (meta.phase === 'treat' && ageBand(cur) !== 'under6' && typeof AA.components.treatPanel === 'function') {
        try { U.clear(panel); AA.components.treatPanel(panel, cur, ctx); return; } catch (e) {
          if (window.console) console.error(e);
        }
      }
      renderPanel(panel, cur, ctx);
    }
    /* When the age entered in setup moves the patient into another age band, the header and the step guide
       switch at once (adult or young-person wording), without re-rendering the step being typed in. */
    var shownBand = ageBand(a);
    var refresh = U.debounce(function () {
      var cur = AA.assess.get(id);
      if (!cur) return;
      paintPanel(cur);
      paintSteps(cur);
      var nb = ageBand(cur);
      if (nb !== shownBand) {
        shownBand = nb;
        eyebrowEl.textContent = eyebrowText(cur);
        leadEl.textContent = leadFor(meta, cur);
        if (guide && nb !== 'under6') {
          var g2 = stepGuide(step, !!sub, cur);
          if (g2) { guide.el.replaceWith(g2.el); guide = g2; }
        }
      }
      if (guide) guide.status(cur);
    }, 120);
    subs.push(AA.store.subscribe(AA.assess.path(id), refresh));
    paintPanel(a);

    return function () {
      subs.forEach(function (off) { off(); });
      if (typeof stepCleanup === 'function') stepCleanup();
    };
  }

  /* ---------- "What to do in this step" guide (AA.data.stepGuide, or stepGuideYoung for 6-17) ----------
     A disclosure: the summary always shows the goal, the usual time and whether the step is complete;
     the body has tabs (do, say, watch for, done when). Open by default on large screens; closed on
     small screens and on symptom cards. Only a choice the clinician makes is remembered (per step). */
  function roomy() { try { return window.matchMedia('(min-width: 1000px) and (min-height: 700px)').matches; } catch (e) { return true; } }
  function stepGuide(step, isSub, a) {
    var gy = isYoung(a) && AA.data.stepGuideYoung ? AA.data.stepGuideYoung[step] : null;
    var g = gy || (AA.data.stepGuide && AA.data.stepGuide[step]);
    if (!g) return null;
    function list(x) { return Array.isArray(x) ? x : []; }
    var key = 'guideClosed.' + step;
    var pref = AA.progress.get(key, null);
    var open = isSub ? false : pref === null || pref === undefined ? roomy() : !pref;
    var statusHost = h('span', { class: 'guide-status' });
    var tabs = [];
    function add(id, label, items, render) { if (items.length) tabs.push({ id: id, label: label, count: items.length, render: render }); }
    var gDo = list(g.do), gSay = list(g.say), gWatch = list(g.watch), gDone = list(g.done), gSrc = list(g.src);
    add('do', 'Do this', gDo, function () { return h('ol', { class: 'guide-do' }, gDo.map(function (x) { return h('li', null, x); })); });
    add('say', [h('span', { class: 'gl-long' }, 'You can say'), h('span', { class: 'gl-short' }, 'Say')], gSay, function () { return h('div', { class: 'guide-say' }, gSay.map(function (x) { return h('p', null, x); })); });
    add('watch', 'Watch for', gWatch, function () { return ui.list(gWatch, 'list guide-watch'); });
    add('done', 'Done when', gDone, function () { return ui.list(gDone, 'guide-done'); });
    var d = h('details', { class: 'guide', open: open },
      h('summary', null,
        h('span', { class: 'guide-k' }, 'What to do in this step'),
        h('span', { class: 'guide-goal' }, g.goal || ''),
        h('span', { class: 'guide-side' },
          g.time ? h('span', { class: 'guide-time' }, h('span', { class: 'sr-only' }, 'Usual time: '), g.time) : null,
          statusHost,
          h('span', { class: 'guide-toggle', 'aria-hidden': 'true' }))),
      h('div', { class: 'guide-body' },
        tabs.length ? ui.tabs(tabs, 'do') : null,
        g.next ? h('p', { class: 'guide-next' }, h('strong', null, 'Next: '), g.next) : null,
        gSrc.length ? ui.details('Sources', h('p', { class: 'source' }, gSrc.join('; ')), { cls: 'guide-src', meta: String(gSrc.length) }) : null));
    var userToggled = false;
    d.querySelector('summary').addEventListener('click', function () { userToggled = true; });
    d.addEventListener('toggle', function () { if (userToggled && !isSub) AA.progress.set(key, !d.open); userToggled = false; });
    function status(cur) {
      var pr = progressOf(cur, step);
      U.clear(statusHost);
      statusHost.appendChild(pr.of === 0 ? ui.badge('Not applicable yet', 'neutral')
        : pr.done >= pr.of ? ui.badge('✓ Step complete', 'ok')
        : pr.done > 0 ? ui.badge(pr.done + ' of ' + pr.of + ' done', 'warn') : ui.badge('Not started', 'neutral'));
    }
    return { el: d, status: status };
  }

  /* ---------- Live summary panel ---------- */
  var wide = function () { try { return window.matchMedia('(min-width: 1240px)').matches; } catch (e) { return true; } };
  var foldOpen = null;
  function renderPanel(panel, a, ctx) {
    U.clear(panel);
    if (ageBand(a) === 'under6') { under6Panel(panel, a, ctx); return; }
    var need = D.need(a);
    var ad = D.counts(a, 'adult'), ch = D.counts(a, 'child');
    var cr = D.criteria(a);
    var out = D.outcome(a);
    var young = isYoung(a), before = showsBefore12(a);
    function cnt(v, of, thr) { return h('span', { class: 'count' + (v >= thr ? ' hit' : '') }, String(v), h('small', { class: 'muted' }, '/' + of)); }
    /* Adults: "Adult"/"Child" columns, the child column marked at the DIVA convention of 6.
       Young people: "Now"/"Before 12"; ages 6-11 show "Now" only. "Several" before 12 is not a per-domain count. */
    var grid;
    if (!young) {
      grid = h('div', { class: 'count-grid' },
        h('span'), h('span', { class: 'h' }, 'Adult'), h('span', { class: 'h' }, 'Child'),
        h('span', null, 'Inattention'), cnt(ad.IA, ad.ofIA || 9, need), cnt(ch.IA, ch.ofIA || 9, 6),
        h('span', null, 'Hyperactive-impulsive'), cnt(ad.HI, ad.ofHI || 9, need), cnt(ch.HI, ch.ofHI || 9, 6));
    } else if (before) {
      grid = h('div', { class: 'count-grid' },
        h('span'), h('span', { class: 'h' }, 'Now'), h('span', { class: 'h' }, 'Before 12'),
        h('span', null, 'Inattention'), cnt(ad.IA, ad.ofIA || 9, need), cnt(ch.IA, ch.ofIA || 9, Infinity),
        h('span', null, 'Hyperactive-impulsive'), cnt(ad.HI, ad.ofHI || 9, need), cnt(ch.HI, ch.ofHI || 9, Infinity));
    } else {
      grid = h('div', { class: 'count-grid', style: { gridTemplateColumns: 'auto minmax(0, 1fr)' } },
        h('span'), h('span', { class: 'h' }, 'Now'),
        h('span', null, 'Inattention'), cnt(ad.IA, ad.ofIA || 9, need),
        h('span', null, 'Hyperactive-impulsive'), cnt(ad.HI, ad.ofHI || 9, need));
    }
    var several = typeof D.SEVERAL === 'number' ? D.SEVERAL : 3;
    var hint = !young ? 'Adult threshold ' + need + ' (DSM-5-TR' + (need === 5 ? ', age 17+' : '') + '). Child column shows the DIVA convention of 6.'
      : 'Threshold now: ' + need + ' in either domain (DSM-5-TR, ' + (need === 5 ? 'age 17 and over' : 'under 17') + ').' +
        (before ? ' Before 12: several symptoms are needed (this app counts ' + several + ' or more in total).' : ' Ages 6 to 11: onset is judged from current symptoms and the age they started.');
    var box = h('div', { class: 'panel' },
      h('h2', null, 'Live summary'),
      grid,
      h('p', { class: 'hint' }, hint),
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
    var pill = ui.statusPill(out.code === 'met' ? 'met' : out.code === 'incomplete' ? 'pending' : out.code === 'subthreshold' ? 'partial' : 'not-met');
    var fold = h('details', { class: 'panel-fold', open: wide() || foldOpen === true },
      h('summary', null,
        h('span', { class: 'pf-title' }, 'Live summary'),
        h('span', { class: 'pf-counts' }, h('span', { class: 'sr-only' }, young ? 'Current symptoms: ' : 'Adult symptoms: '), 'IA ' + ad.IA + ' · HI ' + ad.HI),
        pill, h('span', { class: 'pf-chev', 'aria-hidden': 'true' })),
      box);
    fold.addEventListener('toggle', function () { if (!wide()) foldOpen = fold.open; });
    panel.appendChild(fold);
  }

  /* Under 6: one section instead of the symptom counts and criteria. */
  function under6Panel(panel, a, ctx) {
    var p = a.patient || {}, risk = a.risk || {};
    var todo = [['Reference', !!p.ref], ['Reason for referral', !!String(p.reason || '').trim()], ['Referral notes', !!String(p.referralNotes || '').trim()],
      ['Consent', !!p.consent], ['Safety and safeguarding', !!risk.reviewed]];
    var box = h('div', { class: 'panel' },
      h('h2', null, 'Under 6: refer'),
      h('p', { class: 'hint' }, 'This workspace does not assess or treat ADHD under 6. Record the referral and any safeguarding concern.'),
      h('div', { class: 'panel-sec' }, h('ul', { class: 'crit-list' }, todo.map(function (x) {
        return h('li', null, h('span', null, x[0]), ui.badge(x[1] ? 'Done' : 'To do', x[1] ? 'ok' : 'neutral'));
      }))),
      redFlags(a),
      h('div', { class: 'panel-sec row' },
        ctx.step !== 'report' ? ui.btn({ label: 'Referral note', small: true, kind: 'ghost', onClick: function () { ctx.go('report'); } }) : null,
        ctx.step !== 'risk' ? ui.btn({ label: 'Safety and safeguarding', small: true, kind: 'quiet', onClick: function () { ctx.go('risk'); } }) : null));
    var fold = h('details', { class: 'panel-fold', open: wide() || foldOpen === true },
      h('summary', null, h('span', { class: 'pf-title' }, 'Under 6: refer'), h('span', { class: 'pf-counts' }, todo.filter(function (x) { return x[1]; }).length + ' of ' + todo.length + ' recorded'),
        ui.badge('Refer', 'err'), h('span', { class: 'pf-chev', 'aria-hidden': 'true' })),
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
      var r = null;
      try { r = AA.scoring.forAssessment(a, tid); } catch (e) { r = null; }
      if (r) (r.flags || []).forEach(function (f) { if (f.level === 'urgent') flags.push(((AA.byId('tools', tid) || {}).abbr || tid) + ': ' + f.text); });
    });
    if (!flags.length) return null;
    return h('div', { class: 'panel-sec' }, ui.callout('err', ui.list(flags), 'Safety flags'));
  }
  AA.components.redFlags = redFlags;
})(window.AA);
