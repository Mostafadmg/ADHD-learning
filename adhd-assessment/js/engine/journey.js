/* Patient journey: where one patient is on the 18-step pathway, what is still open in each step, and
   what needs attention first. Pure functions (no DOM, no store); tested in tests/journey-tests.js.

   It reuses the counts the step strip has always used (AA.diagnosis.stepProgress, which in turn asks
   AA.treatment for the treatment steps) and adds three things on top:
     1. an itemised list of what is missing in each step ("gaps"), built from the same record fields,
     2. a status for every step: done | part | todo | na (not applicable yet), plus "blocked" when an earlier
        decision has to come first,
     3. attention items: safety flags first, then results that need a decision (criteria not met,
        pre-treatment checks that stop prescribing).
   Everything copes with missing data and with an engine that is not loaded: it returns empty results
   rather than throwing. Load after treatment.js.

   Levels: a step is "needed" when it has to be finished for a safe conclusion or a safe prescription
   (consent, safety review, history, symptoms, onset and impairment, differentials, the decision, the
   pre-treatment checks and the prescription). Everything else is "good practice". The app never blocks
   anyone from moving on: it only makes sure nothing is missed quietly. */
(function (AA) {
  'use strict';
  var J = AA.journey = {};

  function D() { return AA.diagnosis || {}; }
  function T() { return AA.treatment || {}; }
  function obj(x) { return x && typeof x === 'object' ? x : {}; }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function data(k) { return arr(AA.data && AA.data[k]); }
  function str(x) { return x === undefined || x === null ? '' : String(x).trim(); }

  J.PHASES = [
    { id: 'prepare', label: 'Prepare' }, { id: 'interview', label: 'Interview' }, { id: 'diagnose', label: 'Diagnose' },
    { id: 'treat', label: 'Treat' }, { id: 'report', label: 'Report' }
  ];
  /* Same order and ids as AA.STEP_LIST (the frame holds the titles). need: see the header. */
  J.ORDER = [
    { id: 'setup', phase: 'prepare', need: true }, { id: 'screen', phase: 'prepare', need: false },
    { id: 'risk', phase: 'prepare', need: true }, { id: 'history', phase: 'prepare', need: true },
    { id: 'comorbid', phase: 'prepare', need: false },
    { id: 'ia', phase: 'interview', need: true }, { id: 'hi', phase: 'interview', need: true },
    { id: 'onset', phase: 'interview', need: true }, { id: 'collateral', phase: 'interview', need: false },
    { id: 'ddx', phase: 'diagnose', need: true }, { id: 'validity', phase: 'diagnose', need: false },
    { id: 'summary', phase: 'diagnose', need: true },
    { id: 'txplan', phase: 'treat', need: false }, { id: 'baseline', phase: 'treat', need: true },
    { id: 'prescribe', phase: 'treat', need: true }, { id: 'titrate', phase: 'treat', need: false },
    { id: 'monitor', phase: 'treat', need: false },
    { id: 'report', phase: 'report', need: false }
  ];
  /* Under 6 the workspace only records the referral, the safety review and the referral note. */
  var UNDER6_OPEN = ['setup', 'risk', 'report'];

  function def(id) { for (var i = 0; i < J.ORDER.length; i++) if (J.ORDER[i].id === id) return J.ORDER[i]; return null; }
  J.index = function (id) { for (var i = 0; i < J.ORDER.length; i++) if (J.ORDER[i].id === id) return i; return -1; };

  function band(a) { try { return D().band ? D().band(a) : 'adult'; } catch (e) { return 'adult'; } }
  function young(a) { try { return !!(D().young && D().young(a)); } catch (e) { return false; } }
  function progress(a, id) {
    var pr = null;
    try { pr = D().stepProgress ? D().stepProgress(a, id) : null; } catch (e) { pr = null; }
    if (!pr || typeof pr.done !== 'number' || typeof pr.of !== 'number') pr = { done: 0, of: 1 };
    return pr;
  }
  function toolName(id) {
    var t = null;
    try { t = AA.byId ? AA.byId('tools', id) : null; } catch (e) { t = null; }
    return (t && (t.abbr || t.name)) || id;
  }
  function periodLabel(a, per) {
    var l = '';
    try { l = D().periodLabel ? D().periodLabel(a, per) : ''; } catch (e) { l = ''; }
    return l || (per === 'adult' ? 'Now' : 'Before age 12');
  }

  /* ---------- itemised gaps: [label] per step, mirroring AA.diagnosis.stepProgress ---------- */
  function toolGaps(a, key) {
    var d = D(); if (!d.stepTools) return [];
    var core = d.stepTools(a, key + 'Core') || [];
    var rec = function (id) { try { return d.toolDone(a, id); } catch (e) { return false; } };
    if (!core.length) {
      var any = (d.stepTools(a, key) || []);
      return any.length && !any.some(rec) ? ['At least one scale recorded (' + any.slice(0, 3).map(toolName).join(', ') + (any.length > 3 ? ' and others' : '') + ')'] : [];
    }
    return core.filter(function (id) { return !rec(id); }).map(function (id) { return toolName(id) + ' not recorded'; });
  }

  function gapsFor(a, id) {
    var g = [], p = obj(a && a.patient), d = D(), t = T(), periods = [];
    try { periods = d.periods ? d.periods(a) : ['adult', 'child']; } catch (e) { periods = ['adult', 'child']; }
    switch (id) {
      case 'setup':
        if (!p.ref) g.push('Patient reference');
        if (!p.age) g.push('Age');
        if (!p.consent) g.push('Consent recorded');
        if (young(a)) {
          var cb = obj(p.young).consentBasis, age = d.age ? d.age(a) : null;
          var ok = age !== null && age >= 16 ? (cb === 'capacity_16' || cb === 'lacks_capacity_16' || cb === 'parent_assent') : (cb === 'parent_assent' || cb === 'gillick');
          if (!ok) g.push('Who consents, for this age');
        }
        break;
      case 'screen': g = toolGaps(a, 'screen'); break;
      case 'comorbid': g = toolGaps(a, 'comorbid'); break;
      case 'risk': if (!(a.risk && a.risk.reviewed)) g.push('Safety review marked as done'); break;
      case 'history':
        data('history').filter(function (s) { try { return d.forAge ? d.forAge(a, s) : true; } catch (e) { return true; } }).forEach(function (s) {
          var r = obj((a.history || {})[s.id]);
          var has = (r.checks && Object.keys(r.checks).some(function (k) { return r.checks[k]; })) || r.notes || r.none;
          if (!has) g.push((young(a) && s.titleYoung ? s.titleYoung : s.title || s.id));
        });
        break;
      case 'ia':
      case 'hi': {
        var dim = id === 'ia' ? 'IA' : 'HI';
        var syms = data('symptoms').filter(function (s) { return s.dim === dim; });
        periods.forEach(function (per) {
          var scored = syms.filter(function (s) { return obj(obj(a.symptoms)[s.id])[per]; }).length;
          if (syms.length && scored < syms.length) g.push(periodLabel(a, per) + ': ' + scored + ' of ' + syms.length + ' symptoms scored');
          var key = id + (per === 'adult' ? 'Adult' : 'Child');
          if (!obj(a.supplement)[key]) g.push(periodLabel(a, per) + ': "anything else?" question');
        });
        break;
      }
      case 'onset': {
        var o = obj(a.onset);
        if (band(a) === 'child') {
          if (!(o.before12 || o.always || (o.ageOnset !== undefined && o.ageOnset !== null && str(o.ageOnset)))) g.push('When the symptoms started');
        } else {
          if (!o.always) g.push('Were the symptoms always there?');
          if (!o.before12) g.push('Several symptoms before age 12?');
        }
        if (!o.duration6m) g.push('Present for at least 6 months?');
        periods.forEach(function (per) {
          var l = [];
          try { l = d.impairment ? d.impairment(a, per) : []; } catch (e) { l = []; }
          var rated = l.filter(function (x) { return x.sev !== null; }).length;
          if (l.length && rated < l.length) g.push(periodLabel(a, per) + ': impairment rated for ' + rated + ' of ' + l.length + ' areas');
        });
        break;
      }
      case 'collateral': {
        var c = obj(a.collateral), names = { parent: 'Parent or carer', partner: 'Partner or close adult', school: 'School reports or teacher' };
        var keys = [];
        try { keys = d.collateralKeys ? d.collateralKeys(a) : []; } catch (e) { keys = []; }
        keys.forEach(function (k) { if (c[k] === undefined || c[k] === null) g.push(names[k] || k); });
        break;
      }
      case 'ddx': {
        var core = [];
        try { core = d.coreConditions ? d.coreConditions(a) : []; } catch (e) { core = []; }
        core.forEach(function (x) { if (!(a.ddx && a.ddx[x.id] && a.ddx[x.id].verdict)) g.push(x.short || x.name || x.id); });
        break;
      }
      case 'validity': if (!(a.validity && a.validity.concern)) g.push('Symptom validity concern recorded'); break;
      case 'summary': if (!(a.formulation && a.formulation.decision)) g.push('Diagnostic decision recorded'); break;
      case 'report': if (!(a.formulation && a.formulation.reportReviewed)) g.push('Report read and reviewed'); break;
      case 'txplan': {
        var app = t.applicable ? t.applicable(a) : { ok: true };
        var plan = obj(obj(a.treatment).plan);
        if (!plan.decision) g.push('Treatment plan decision');
        if (app.ok) {
          var items = t.planItems ? t.planItems(a) : [], steps = obj(plan.steps);
          var open = items.filter(function (x) { return !steps[x.id] && steps[x.id] !== 'na' && (!t.planItemApplies || t.planItemApplies(a, x)); });
          if (open.length) g.push(open.length + ' plan ' + (open.length === 1 ? 'step' : 'steps') + ' not yet agreed');
          if (plan.decision === 'medication') {
            var team = obj(plan.team), tm = [['specialist', 'Specialist involved'], ['competent', 'Prescriber competent'], ['supervised', 'Supervision in place']];
            tm.forEach(function (x) { if (team[x[0]] !== true) g.push(x[1]); });
          }
        }
        break;
      }
      case 'baseline': {
        var v = t.baselineVerdict ? t.baselineVerdict(a) : null;
        if (v) g = arr(v.missing).slice();
        break;
      }
      case 'prescribe': {
        var ch = obj(obj(a.treatment).choice);
        var base = [['drug', 'Medicine'], ['product', 'Product'], ['startDate', 'Start date']];
        base.forEach(function (x) { if (!ch[x[0]]) g.push(x[1]); });
        if (ch.startDose === undefined || ch.startDose === null || str(ch.startDose) === '') g.push('Starting dose');
        if ((ch.supplyDays === undefined || ch.supplyDays === null || str(ch.supplyDays) === '') && (ch.quantity === undefined || ch.quantity === null || str(ch.quantity) === '')) g.push('Supply length or quantity');
        var cs = obj(ch.counsel), rx = obj(ch.rx);
        var counsel = t.counselItems ? t.counselItems(a) : [];
        var cOpen = counsel.filter(function (x) { return !cs[x.id]; }).length;
        if (cOpen) g.push('Counselling: ' + (counsel.length - cOpen) + ' of ' + counsel.length + ' points covered');
        var rxs = ch.drug && t.rxChecks ? t.rxChecks(a).filter(function (x) { return x.optional !== true; }) : [];
        var rOpen = rxs.filter(function (x) { return !rx[x.id]; }).length;
        if (rOpen) g.push('Prescription checks: ' + (rxs.length - rOpen) + ' of ' + rxs.length + ' done');
        break;
      }
      case 'titrate': {
        var ms = t.medState ? t.medState(a) : null;
        if (ms) {
          if (!arr(ms.reviews).length) g.push('First review logged');
          if (ms.held) g.push('Act on the flag raised at the last review, or write down why you are carrying on');
          else if (!(ms.optimised || ms.stopped)) g.push('Dose optimised, or medicine stopped');
        }
        break;
      }
      case 'monitor': {
        var mon = obj(obj(a.treatment).monitor);
        if (!mon.shared) g.push('Monitoring or shared-care arrangement');
        if (!mon.nextReview) g.push('Date of the next review');
        var trans = t.group && t.age && t.group(a) === 'young' && t.age(a) !== null && t.age(a) >= 13;
        if (trans && !mon.transition) g.push('Transition plan for adult services');
        break;
      }
    }
    return g;
  }

  /* ---------- attention: what to look at first ---------- */
  /* -> [{step, level: 'stop'|'warn'|'refer', text}]; 'refer' (under 6) is a disposition, never counted as a stop */
  J.attention = function (a) {
    var out = [];
    if (!a) return out;
    var b = band(a);
    if (b === 'under6') out.push({ step: 'setup', level: 'refer', text: 'Under 6: refer to a service with expertise in ADHD in young children. This workspace does not assess or treat here.' });
    var risk = obj(a.risk);
    /* An urgent finding stays a stop until the safety step is marked reviewed AND the action taken is written down;
       after that it stays visible as a warning (the clinician has dealt with it), so a past event cannot block
       sign-off for ever. */
    var handled = risk.reviewed === true && str(risk.action) !== '';
    var tt = T();
    arr(AA.data && AA.data.risk && AA.data.risk.items).filter(function (it) { return it && it.id && (!tt.forAge || tt.forAge(a, it)); }).forEach(function (it) {
      if (risk[it.id] === true && it.level === 'urgent') out.push({ step: 'risk', level: handled ? 'warn' : 'stop', text: 'Safety: ' + (it.short || it.text) + (handled ? ' (reviewed, action recorded)' : '') });
      else if (risk[it.id] === true && it.level === 'high') out.push({ step: 'risk', level: 'warn', text: 'Safety: ' + (it.short || it.text) });
    });
    Object.keys(obj(a.tools)).forEach(function (tid) {
      var r = null;
      try { r = AA.scoring && AA.scoring.forAssessment ? AA.scoring.forAssessment(a, tid) : null; } catch (e) { r = null; }
      if (r) arr(r.flags).forEach(function (f) { if (f.level === 'urgent') out.push({ step: 'screen', level: handled ? 'warn' : 'stop', text: toolName(tid) + ': ' + f.text + (handled ? ' (reviewed, action recorded)' : '') }); });
    });
    /* Work has moved on but the safety step has not been reviewed. */
    var laterStarted = ['ia', 'hi', 'onset', 'ddx', 'summary', 'baseline', 'prescribe'].some(function (s) { var pr = progress(a, s); return pr.of > 0 && pr.done > 0; });
    if (b !== 'under6' && !(a.risk && a.risk.reviewed) && laterStarted) out.push({ step: 'risk', level: 'warn', text: 'The safety review has not been marked as done.' });
    var dec = obj(a.formulation).decision;
    var t = T();
    if (dec === 'deferred' && b !== 'under6') out.push({ step: 'summary', level: 'warn', text: 'Diagnosis deferred: the assessment is not finished. Come back to it when the missing information is in.' });
    if (dec === 'other-specified' && t.applicable) {
      try { var ap0 = t.applicable(a); if (ap0 && ap0.caution && ap0.reason) out.push({ step: 'summary', level: 'warn', text: ap0.reason }); } catch (e) { /* leave it out */ }
    }
    if (dec === 'met' && t.diagnosisCheck) {
      var chk = null;
      try { chk = t.diagnosisCheck(a); } catch (e) { chk = null; }
      if (chk) arr(chk.issues).slice(0, 3).forEach(function (is) { out.push({ step: 'summary', level: 'warn', text: is.text }); });
    }
    if (t.applicable && t.baselineVerdict) {
      try {
        var app = t.applicable(a), plan = obj(obj(a.treatment).plan);
        if (app.ok && plan.decision !== 'nondrug' && plan.decision !== 'refer') {
          var v = t.baselineVerdict(a);
          /* "Safety step:" reasons repeat the safety findings listed above. */
          var first = arr(v.reasons).filter(function (r) { return (r.level === 'stop' || r.level === 'cardiology' || r.level === 'ecg') && !/^Safety step:/.test(str(r.text)); })[0];
          if (first) out.push({ step: 'baseline', level: first.level === 'stop' ? 'stop' : 'warn', text: 'Pre-treatment checks: ' + first.text });
        }
      } catch (e) { /* leave it out */ }
    }
    /* Flags raised at the latest titration review: urgent ones stop until the medicine is stopped or a reason to
       carry on is written down; "act" flags are warnings. */
    if (t.applicable && t.medState && t.reviewFlags) {
      try {
        if (t.applicable(a).ok && obj(obj(a.treatment).choice).drug) {
          var ms = t.medState(a), last = ms.latest;
          if (last && last.id && !ms.stopped) {
            var over = str(last.flagOverride) !== '';
            arr(t.reviewFlags(a, last.id)).forEach(function (f) {
              if (f.level === 'urgent') out.push({ step: 'titrate', level: over ? 'warn' : 'stop', text: 'Latest review: ' + (f.text || f.t) + (over ? ' (reason to continue recorded)' : '') });
              else if (f.level === 'act' && !over) out.push({ step: 'titrate', level: 'warn', text: 'Latest review: ' + (f.text || f.t) });
            });
          }
        }
      } catch (e) { /* leave it out */ }
    }
    return out;
  };

  /* ---------- one step ---------- */
  /* -> {id, phase, need, state: 'done'|'part'|'todo'|'na', done, of, gaps: [label], blocked: null|string, attention: [..]} */
  J.step = function (a, id, att) {
    var m = def(id) || { id: id, phase: '', need: false };
    var pr = progress(a, id);
    var under6 = band(a) === 'under6' && UNDER6_OPEN.indexOf(id) < 0;
    var na = under6 || pr.of === 0;
    var state = na ? 'na' : pr.done >= pr.of ? 'done' : pr.done > 0 ? 'part' : 'todo';
    var gaps = [];
    if (state === 'part' || state === 'todo') {
      try { gaps = gapsFor(a, id); } catch (e) { gaps = []; }
      if (!gaps.length) gaps = [(pr.of - pr.done) + ' ' + (pr.of - pr.done === 1 ? 'item' : 'items') + ' still to do'];
    }
    /* The treatment plan waits for the diagnostic decision. */
    var blocked = null;
    if (id === 'txplan' && state !== 'na' && !under6) {
      try {
        var app = T().applicable ? T().applicable(a) : null;
        if (app && !app.ok && (app.code === 'nodecision' || app.code === 'deferred')) blocked = app.code === 'deferred' ? 'The diagnosis is deferred: finish the assessment first.' : 'Record the diagnostic decision first.';
      } catch (e) { blocked = null; }
    }
    var attn = (att || J.attention(a)).filter(function (x) { return x.step === id; });
    var needed = !!m.need || (id === 'collateral' && young(a));
    return { id: id, phase: m.phase, need: needed, state: state, done: pr.done, of: pr.of, gaps: gaps, blocked: blocked, attention: attn };
  };

  /* ---------- the whole case ---------- */
  /* -> {steps, phases, done, of, na, pct, current, next, attention, openNeeded, openGood, gapCount, ready, stop} */
  J.summary = function (a) {
    var att = J.attention(a);
    var steps = J.ORDER.map(function (m) { return J.step(a, m.id, att); });
    var applicable = steps.filter(function (s) { return s.state !== 'na'; });
    var done = applicable.filter(function (s) { return s.state === 'done'; }).length;
    var phases = J.PHASES.map(function (ph) {
      var mine = steps.filter(function (s) { return s.phase === ph.id; });
      var app = mine.filter(function (s) { return s.state !== 'na'; });
      var dn = app.filter(function (s) { return s.state === 'done'; }).length;
      var started = app.some(function (s) { return s.state === 'part'; });
      return { id: ph.id, label: ph.label, done: dn, of: app.length, steps: mine,
        state: !app.length ? 'na' : dn === app.length ? 'done' : (dn > 0 || started) ? 'part' : 'todo' };
    });
    var cur = J.index(a && a.step);
    if (cur < 0) cur = 0;
    function open(s) { return s.state !== 'done' && s.state !== 'na' && !s.blocked; }
    var next = null, i;
    if (steps[cur] && open(steps[cur])) next = steps[cur].id;
    for (i = cur + 1; next === null && i < steps.length; i++) if (open(steps[i])) next = steps[i].id;
    for (i = 0; next === null && i < cur; i++) if (open(steps[i])) next = steps[i].id;
    var openSteps = applicable.filter(function (s) { return s.state !== 'done'; });
    var openNeeded = openSteps.filter(function (s) { return s.need; });
    var stop = att.some(function (x) { return x.level === 'stop'; });
    var refer = att.some(function (x) { return x.level === 'refer'; });
    /* A deferred diagnosis means the assessment is not finished, even though the decision box is filled in. */
    var deferred = obj(a && a.formulation).decision === 'deferred' && band(a) !== 'under6';
    if (next === null && deferred) next = 'summary';
    return {
      steps: steps, phases: phases, done: done, of: applicable.length, na: steps.length - applicable.length,
      pct: applicable.length ? Math.round(done / applicable.length * 100) : 0,
      current: J.ORDER[cur].id, next: next, attention: att,
      openNeeded: openNeeded.length, openGood: openSteps.length - openNeeded.length,
      neededSteps: openNeeded.map(function (s) { return s.id; }),
      gapCount: openSteps.reduce(function (n, s) { return n + s.gaps.length; }, 0),
      stop: stop, refer: refer, deferred: deferred, ready: !openNeeded.length && !stop && !deferred
    };
  };
})(typeof window !== 'undefined' ? window.AA : globalThis.AA);
