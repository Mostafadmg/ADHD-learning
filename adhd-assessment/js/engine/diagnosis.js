/* Diagnostic rules engine. Pure functions over an assessment record (see ARCHITECTURE.md).
   Implements DSM-5-TR criteria A-E for ADHD in adults, the NICE NG87 impairment threshold,
   a DIVA 2.0 (DSM-IV) score-form view, ICD-11 / ICD-10-CM coding, differential scoring and an
   evidence-strength heuristic. The clinician always makes the final decision: every result
   here is a summary of what has been recorded, never a diagnosis on its own. */
(function (AA) {
  'use strict';
  var D = AA.diagnosis = {};

  /* "Several" symptoms before age 12 is not defined numerically in DSM-5-TR.
     The app treats 3 or more childhood symptoms as "several" and asks the clinician to confirm. */
  D.SEVERAL = 3;
  D.STEP_TOOLS = {
    screen: ['asrs18', 'wurs25', 'wfirs', 'asrs5'],
    screenCore: ['asrs18', 'wurs25', 'wfirs'],
    comorbid: ['phq9', 'gad7', 'mdq', 'audit', 'dast10', 'aq10', 'pcl5', 'msibpd', 'stopbang'],
    comorbidCore: ['phq9', 'gad7', 'mdq', 'audit', 'dast10', 'aq10']
  };

  function syms(dim) {
    return (AA.data.symptoms || []).filter(function (s) { return !dim || s.dim === dim; });
  }
  function ageOf(a) { var n = a && a.patient ? parseInt(a.patient.age, 10) : NaN; return isNaN(n) ? null : n; }

  /* Adult threshold: 5 symptoms from age 17, otherwise 6 (DSM-5-TR criterion A). */
  D.need = function (a) { var age = ageOf(a); return age !== null && age < 17 ? 6 : 5; };

  /* Symptom counts for one period ('adult' | 'child'). */
  D.counts = function (a, period) {
    var out = { IA: 0, HI: 0, unsureIA: 0, unsureHI: 0, answeredIA: 0, answeredHI: 0, ofIA: 0, ofHI: 0 };
    var rec = (a && a.symptoms) || {};
    syms().forEach(function (s) {
      var v = rec[s.id] ? rec[s.id][period] : null;
      out['of' + s.dim]++;
      if (v === 'yes' || v === 'no' || v === 'unsure') out['answered' + s.dim]++;
      if (v === 'yes') out[s.dim]++;
      if (v === 'unsure') out['unsure' + s.dim]++;
    });
    return out;
  };

  function status(s, detail, extra) { var o = { status: s, detail: detail }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }

  D.criterionA = function (a) {
    var c = D.counts(a, 'adult'), need = D.need(a);
    var metIA = c.IA >= need, metHI = c.HI >= need;
    var canIA = c.IA + (c.ofIA - c.answeredIA) >= need, canHI = c.HI + (c.ofHI - c.answeredHI) >= need;
    var d = 'Adulthood (past 6 months): inattention ' + c.IA + '/' + c.ofIA + ', hyperactivity-impulsivity ' + c.HI + '/' + c.ofHI + '; ' + need + ' needed in either domain.';
    var dur = a && a.onset ? a.onset.duration6m : null;
    var extra = { IA: c.IA, HI: c.HI, need: need, counts: c, duration: dur || null };
    if (metIA || metHI) {
      if (dur === 'no') return status('not-met', d + ' Symptoms have not lasted 6 months.', extra);
      return status(dur === 'yes' ? 'met' : 'pending', dur === 'yes' ? d : d + ' Confirm the 6-month duration.', extra);
    }
    if ((c.answeredIA + c.answeredHI) === 0) return status('pending', 'Symptom interview not started.', extra);
    if (!canIA && !canHI) return status('not-met', d, extra);
    return status('pending', d + ' Interview not finished.', extra);
  };

  D.criterionB = function (a) {
    var c = D.counts(a, 'child');
    var total = c.IA + c.HI;
    var before12 = a && a.onset ? a.onset.before12 : null;
    var answered = c.answeredIA + c.answeredHI, of = c.ofIA + c.ofHI;
    var d = 'Childhood (age 5-12): inattention ' + c.IA + '/' + c.ofIA + ', hyperactivity-impulsivity ' + c.HI + '/' + c.ofHI + '. ';
    var extra = { IA: c.IA, HI: c.HI, total: total, before12: before12 || null, fullChildIA: c.IA >= 6, fullChildHI: c.HI >= 6 };
    if (before12 === 'no') return status('not-met', d + 'Symptoms reported to start after age 12. Look hard for another cause before considering ADHD.', extra);
    if (before12 === 'yes' && total >= D.SEVERAL) return status('met', d + 'Several symptoms before age 12 (app uses ' + D.SEVERAL + '+).', extra);
    if (before12 === 'yes' && answered === of && total < D.SEVERAL) return status('not-met', d + 'Fewer than ' + D.SEVERAL + ' childhood symptoms recorded.', extra);
    if (answered === 0 && !before12) return status('pending', 'Childhood symptoms and age of onset not yet recorded.', extra);
    return status('pending', d + (before12 ? '' : 'Record whether symptoms were present before age 12.'), extra);
  };

  D.ADULT_DOMAINS_MIN = 2;
  function impairList(a, period) {
    var rec = (a && a.impairment && a.impairment[period]) || {};
    var doms = (AA.data.impairment && AA.data.impairment.domains) || [];
    return doms.map(function (d) {
      var r = rec[d.id] || {};
      return { id: d.id, label: d.label, sev: typeof r.sev === 'number' ? r.sev : null };
    });
  }
  D.impairment = impairList;

  D.criterionC = function (a) {
    var list = impairList(a, 'adult');
    var rated = list.filter(function (x) { return x.sev !== null; });
    var hit = rated.filter(function (x) { return x.sev >= 1; });
    var extra = { domains: hit.map(function (x) { return x.label; }), rated: rated.length, of: list.length };
    var d = hit.length + ' adult area(s) affected' + (hit.length ? ': ' + extra.domains.join(', ') : '') + '. Two or more settings are needed.';
    if (hit.length >= D.ADULT_DOMAINS_MIN) return status('met', d, extra);
    if (list.length && rated.length === list.length) return status('not-met', d, extra);
    return status('pending', rated.length ? d + ' Not all areas rated yet.' : 'Impairment areas not yet rated.', extra);
  };

  /* D: DSM-5-TR needs clear interference; NICE NG87 asks for at least moderate impairment.
     'partial' = mild only (may satisfy DSM wording, below the NICE threshold). */
  D.criterionD = function (a) {
    var list = impairList(a, 'adult');
    var rated = list.filter(function (x) { return x.sev !== null; });
    var max = rated.reduce(function (m, x) { return Math.max(m, x.sev); }, -1);
    var labels = ['none', 'mild', 'moderate', 'severe'];
    var extra = { max: max < 0 ? null : max };
    if (!rated.length) return status('pending', 'Impairment severity not yet rated.', extra);
    if (max >= 2) return status('met', 'Highest adult impairment: ' + labels[max] + ' (NICE: at least moderate).', extra);
    if (max === 1) return status('partial', 'Only mild impairment recorded. This is below the NICE threshold of at least moderate impairment.', extra);
    return status(rated.length === list.length ? 'not-met' : 'pending', 'No impairment recorded so far.', extra);
  };

  D.criterionE = function (a) {
    var conds = AA.data.ddx || [];
    var rec = (a && a.ddx) || {};
    var better = [], uncertain = [], comorbid = [], unreviewedCore = [];
    conds.forEach(function (c) {
      var v = rec[c.id] ? rec[c.id].verdict : null;
      if (v === 'better') better.push(c.name);
      else if (v === 'uncertain') uncertain.push(c.name);
      else if (v === 'comorbid') comorbid.push(c.name);
      if (c.core && !v) unreviewedCore.push(c.name);
    });
    var reviewed = conds.filter(function (c) { return rec[c.id] && rec[c.id].verdict; }).length;
    var extra = { better: better, uncertain: uncertain, comorbid: comorbid, unreviewedCore: unreviewedCore, reviewed: reviewed };
    if (!conds.length || !reviewed) return status('pending', 'Differential diagnosis review not started.', extra);
    if (better.length) return status('not-met', 'Symptoms judged better explained by: ' + better.join(', ') + '.', extra);
    if (uncertain.length) return status('pending', 'Uncertain differential(s) need more information: ' + uncertain.join(', ') + '.', extra);
    if (unreviewedCore.length) return status('pending', unreviewedCore.length + ' core differential(s) not yet reviewed: ' + unreviewedCore.join(', ') + '.', extra);
    return status('met', 'Not better explained by another condition' + (comorbid.length ? '. Co-occurring: ' + comorbid.join(', ') : '') + '.', extra);
  };

  D.criteria = function (a) {
    return { A: D.criterionA(a), B: D.criterionB(a), C: D.criterionC(a), D: D.criterionD(a), E: D.criterionE(a) };
  };

  /* Current presentation from adult counts (DSM-5-TR: based on the past 6 months). */
  D.presentation = function (a) {
    var c = D.counts(a, 'adult'), need = D.need(a);
    if (c.IA >= need && c.HI >= need) return 'combined';
    if (c.IA >= need) return 'ia';
    if (c.HI >= need) return 'hi';
    return null;
  };
  D.PRESENTATIONS = {
    combined: { label: 'Combined presentation', dsm: 'F90.2', icd11: '6A05.2' },
    ia: { label: 'Predominantly inattentive presentation', dsm: 'F90.0', icd11: '6A05.0' },
    hi: { label: 'Predominantly hyperactive-impulsive presentation', dsm: 'F90.1', icd11: '6A05.1' },
    other: { label: 'Other specified ADHD', dsm: 'F90.8', icd11: '6A05.Y' },
    unspecified: { label: 'Unspecified ADHD', dsm: 'F90.9', icd11: '6A05.Z' }
  };

  /* DSM-5-TR severity specifier, suggested from symptom excess and the worst impairment. */
  D.severity = function (a) {
    var c = D.counts(a, 'adult'), need = D.need(a);
    var excess = Math.max(c.IA - need, c.HI - need);
    var dd = D.criterionD(a);
    if (dd.max === null || excess < 0) return null;
    if (dd.max >= 3 || excess >= 3) return 'severe';
    if (dd.max <= 1 && excess <= 1) return 'mild';
    return 'moderate';
  };

  /* Collateral support (DIVA convention: 0 none/little, 1 some, 2 clear; 'na' not available). */
  D.collateral = function (a) {
    var c = (a && a.collateral) || {};
    var keys = ['parent', 'partner', 'school'];
    var rated = keys.filter(function (k) { return typeof c[k] === 'number'; });
    var best = rated.reduce(function (m, k) { return Math.max(m, c[k]); }, -1);
    var level = !rated.length ? 'unavailable' : best === 2 ? 'clear' : best === 1 ? 'some' : 'none';
    return { rated: rated.length, best: best < 0 ? null : best, level: level, sources: rated };
  };

  /* Differential: features carry weights (w, 1-3) that favour the alternative explanation.
     Returns the share of the weight that has been ticked. */
  D.ddxScore = function (cond, entry) {
    var f = (entry && entry.f) || {};
    var max = 0, score = 0, checked = 0;
    (cond.features || []).forEach(function (x) {
      var w = x.w || 1;
      max += w;
      if (f[x.id]) { score += w; checked++; }
    });
    var pct = max ? Math.round(100 * score / max) : 0;
    /* Bands are relative to the condition's total weight, so a long feature list does not inflate "strong". */
    var band = score === 0 ? 'none' : pct >= 50 ? 'strong' : pct >= 20 || score >= 4 ? 'possible' : 'weak';
    return { score: score, max: max, pct: pct, band: band, checked: checked };
  };

  /* Screening results that point to a differential (tool ids listed on the condition as cond.screen). */
  D.ddxScreens = function (a, cond) {
    return (cond.screen || []).map(function (id) {
      var r = AA.scoring.forAssessment(a, id);
      var t = AA.byId('tools', id);
      return r ? { id: id, abbr: t ? t.abbr : id, positive: r.positive === true || (r.sev !== null && r.sev >= 2), result: r } : null;
    }).filter(Boolean);
  };

  /* Evidence strength: a transparent heuristic (not a validated scale). */
  D.confidence = function (a) {
    var pts = 0, reasons = [];
    var A = D.criterionA(a), B = D.criterionB(a), E = D.criterionE(a);
    var col = D.collateral(a);
    if (col.level === 'clear') { pts += 2; reasons.push(['+', 'Collateral information clearly supports the history.']); }
    else if (col.level === 'some') { pts += 1; reasons.push(['+', 'Collateral information gives some support.']); }
    else if (col.level === 'none') { pts -= 2; reasons.push(['-', 'Collateral information does not support the history.']); }
    else { pts -= 1; reasons.push(['-', 'No collateral information yet (informant or school reports).']); }
    var asrs = AA.scoring.forAssessment(a, 'asrs18');
    if (asrs && asrs.positive !== null && A.status !== 'pending') {
      if (asrs.positive === (A.status === 'met')) { pts += 1; reasons.push(['+', 'ASRS screen agrees with the interview.']); }
      else reasons.push(['!', 'ASRS screen and interview disagree. Explore why (insight, over- or under-reporting).']);
    }
    var wurs = AA.scoring.forAssessment(a, 'wurs25');
    if (wurs && wurs.complete && B.status !== 'pending') {
      var wpos = wurs.total >= 46;
      if (wpos === (B.status === 'met')) { pts += 1; reasons.push(['+', 'Childhood recall (WURS-25) agrees with the interview.']); }
      else reasons.push(['!', 'WURS-25 and the childhood interview disagree.']);
    }
    if (E.uncertain && E.uncertain.length) { pts -= 2; reasons.push(['-', 'Unresolved differential(s): ' + E.uncertain.join(', ') + '.']); }
    if (E.comorbid && E.comorbid.length >= 2) reasons.push(['!', 'Several co-occurring conditions: attribution of symptoms is harder.']);
    var v = a && a.validity ? a.validity.concern : null;
    if (v === 'major') { pts -= 3; reasons.push(['-', 'Major concern about symptom validity.']); }
    else if (v === 'some') { pts -= 1; reasons.push(['-', 'Some concern about symptom validity.']); }
    else if (v === 'none') { pts += 1; reasons.push(['+', 'No symptom validity concerns.']); }
    var unsure = A.counts ? A.counts.unsureIA + A.counts.unsureHI : 0;
    if (unsure >= 3) { pts -= 1; reasons.push(['-', unsure + ' adult symptoms scored "unsure".']); }
    var level = pts >= 3 ? 'high' : pts >= 1 ? 'moderate' : 'low';
    return { level: level, points: pts, reasons: reasons };
  };

  /* Overall outcome of what has been recorded. */
  D.outcome = function (a) {
    var cr = D.criteria(a);
    var pres = D.presentation(a);
    var reasons = [];
    var ks = ['A', 'B', 'C', 'D', 'E'];
    var notMet = ks.filter(function (k) { return cr[k].status === 'not-met'; });
    var pending = ks.filter(function (k) { return cr[k].status === 'pending'; });
    var adult = D.counts(a, 'adult');
    var res = { criteria: cr, presentation: pres, severity: D.severity(a), confidence: D.confidence(a) };
    if (cr.E.status === 'not-met') {
      res.code = 'better-explained';
      res.title = 'Symptoms better explained by another condition';
      reasons.push(cr.E.detail);
    } else if (!notMet.length && !pending.length) {
      res.code = 'met';
      var p = D.PRESENTATIONS[pres];
      res.title = 'DSM-5-TR criteria for ADHD are met' + (p ? ': ' + p.label.toLowerCase() : '');
      res.dsm = p ? p.dsm : null; res.icd11 = p ? p.icd11 : null;
      if (cr.D.status === 'partial') reasons.push('Impairment is mild only: below the NICE NG87 threshold. Discuss whether treatment is indicated.');
    } else if (cr.A.status === 'not-met' && Math.max(adult.IA, adult.HI) >= 3 && cr.B.status !== 'not-met' && (cr.D.status === 'met' || cr.D.status === 'partial')) {
      res.code = 'subthreshold';
      res.title = 'Subthreshold: impairing symptoms below the full count';
      res.dsm = D.PRESENTATIONS.other.dsm; res.icd11 = D.PRESENTATIONS.other.icd11;
      reasons.push('Consider "Other specified ADHD" (or "in partial remission" if full criteria were met in the past). Record the reason, for example "with insufficient inattention symptoms".');
    } else if (notMet.length) {
      res.code = 'not-met';
      res.title = 'Criteria not met';
      notMet.forEach(function (k) { reasons.push('Criterion ' + k + ': ' + cr[k].detail); });
    } else {
      res.code = 'incomplete';
      res.title = 'Assessment incomplete';
      pending.forEach(function (k) { reasons.push('Criterion ' + k + ': ' + cr[k].detail); });
    }
    if (cr.D.status === 'partial' && res.code !== 'met') reasons.push(cr.D.detail);
    res.reasons = reasons;
    return res;
  };

  /* DIVA 2.0 score form (DSM-IV): 6+ per domain in childhood and adulthood, onset before 7. */
  D.diva2 = function (a) {
    var ad = D.counts(a, 'adult'), ch = D.counts(a, 'child');
    var age = a && a.onset ? parseInt(a.onset.ageOnset, 10) : NaN;
    var always = a && a.onset ? a.onset.always : null;
    return {
      childIA6: ch.IA >= 6, childHI6: ch.HI >= 6, adultIA6: ad.IA >= 6, adultHI6: ad.HI >= 6,
      adultIA4: ad.IA >= 4, adultHI4: ad.HI >= 4,
      before7: always === 'yes' ? true : (!isNaN(age) ? age < 7 : null)
    };
  };

  /* Step completion for the progress rail: {done, of}. */
  D.stepProgress = function (a, step) {
    if (!a) return { done: 0, of: 1 };
    var T = D.STEP_TOOLS;
    function toolsDone(ids) {
      return ids.filter(function (id) { var r = AA.scoring.forAssessment(a, id); return r && r.complete; }).length;
    }
    function symDone(dim) {
      var n = 0, of = 0;
      syms(dim).forEach(function (s) {
        var r = (a.symptoms || {})[s.id] || {};
        of += 2;
        if (r.adult) n++;
        if (r.child) n++;
      });
      return { done: n, of: of || 1 };
    }
    switch (step) {
      case 'setup': {
        var p = a.patient || {};
        return { done: (p.ref ? 1 : 0) + (p.age ? 1 : 0) + (p.consent ? 1 : 0), of: 3 };
      }
      case 'screen': return { done: toolsDone(T.screenCore), of: T.screenCore.length };
      case 'risk': return { done: a.risk && a.risk.reviewed ? 1 : 0, of: 1 };
      case 'history': {
        var hs = AA.data.history || [];
        var hd = hs.filter(function (s) { var r = (a.history || {})[s.id]; return r && ((r.checks && Object.keys(r.checks).some(function (k) { return r.checks[k]; })) || r.notes || r.none); }).length;
        return { done: hd, of: hs.length || 1 };
      }
      case 'comorbid': return { done: toolsDone(T.comorbidCore), of: T.comorbidCore.length };
      case 'ia':
      case 'hi': {
        /* The 18 symptom scores (adult and child) plus the DIVA-style supplement question for both periods. */
        var sd = symDone(step === 'ia' ? 'IA' : 'HI');
        var sup = a.supplement || {};
        var keys = step === 'ia' ? ['iaAdult', 'iaChild'] : ['hiAdult', 'hiChild'];
        return { done: sd.done + keys.filter(function (k) { return sup[k]; }).length, of: sd.of + keys.length };
      }
      case 'onset': {
        var o = a.onset || {};
        var adultDoms = impairList(a, 'adult'), childDoms = impairList(a, 'child');
        var rated = adultDoms.filter(function (x) { return x.sev !== null; }).length + childDoms.filter(function (x) { return x.sev !== null; }).length;
        return { done: (o.always ? 1 : 0) + (o.before12 ? 1 : 0) + (o.duration6m ? 1 : 0) + rated, of: 3 + adultDoms.length + childDoms.length };
      }
      case 'collateral': {
        var c = a.collateral || {};
        return { done: ['parent', 'partner', 'school'].filter(function (k) { return c[k] !== undefined && c[k] !== null; }).length, of: 3 };
      }
      case 'ddx': {
        var core = (AA.data.ddx || []).filter(function (x) { return x.core; });
        return { done: core.filter(function (x) { return a.ddx && a.ddx[x.id] && a.ddx[x.id].verdict; }).length, of: core.length || 1 };
      }
      case 'validity': return { done: a.validity && a.validity.concern ? 1 : 0, of: 1 };
      case 'summary': return { done: a.formulation && a.formulation.decision ? 1 : 0, of: 1 };
      case 'report': return { done: a.formulation && a.formulation.reportReviewed ? 1 : 0, of: 1 };
      default: return { done: 0, of: 1 };
    }
  };
})(typeof window !== 'undefined' ? window.AA : globalThis.AA);
