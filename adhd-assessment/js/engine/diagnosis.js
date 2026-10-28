/* Diagnostic rules engine. Pure functions over an assessment record (see ARCHITECTURE.md).
   Implements DSM-5-TR criteria A-E for ADHD in adults and young people (6-17), the NICE NG87
   impairment threshold, a DIVA 2.0 (DSM-IV) score-form view for adults, ICD-11 / ICD-10-CM coding,
   differential scoring and an evidence-strength heuristic. The clinician always makes the final
   decision: every result here is a summary of what has been recorded, never a diagnosis on its own.

   Age bands are worked out from patient.age, never stored. Record keys keep one meaning at every age:
   symptoms.<id>.adult and impairment.adult = the current period (last 6 months);
   symptoms.<id>.child and impairment.child = before age 12. For a child aged 6-11 the before-12
   period IS the current period, so only the current period is used and criterion B is judged
   from current symptoms plus the onset answers. */
(function (AA) {
  'use strict';
  var D = AA.diagnosis = {};

  /* "Several" symptoms before age 12 is not defined numerically in DSM-5-TR.
     The app treats 3 or more childhood symptoms as "several" and asks the clinician to confirm. */
  D.SEVERAL = 3;
  /* Adult tool lists. Young people use the lists in AA.data.ageBands (see D.stepTools). */
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
  function arr(x) { return Array.isArray(x) ? x : []; }
  /* Keep only ids that exist in a collection. When the collection is not loaded, keep the list as it is. */
  function known(name, ids) {
    var list = arr(AA.data[name]);
    var clean = arr(ids).filter(function (id) { return typeof id === 'string' && id; });
    if (!list.length) return clean.slice();
    return clean.filter(function (id) { return !!AA.byId(name, id); });
  }

  /* ---------- Age bands ---------- */

  D.BANDS = ['under6', 'child', 'teen', 'y17', 'adult'];
  D.age = function (a) { return ageOf(a); };
  /* under6 (<6) | child (6-11) | teen (12-16) | y17 (17) | adult (18+ or age missing). */
  D.band = function (a) {
    var n = ageOf(a);
    if (n === null || n >= 18) return 'adult';
    if (n < 6) return 'under6';
    if (n <= 11) return 'child';
    if (n <= 16) return 'teen';
    return 'y17';
  };
  D.young = function (a) { var b = D.band(a); return b === 'child' || b === 'teen' || b === 'y17'; };
  D.bandInfo = function (a) {
    var all = AA.data && AA.data.ageBands;
    var bi = all && typeof all === 'object' ? all[D.band(a)] : null;
    return bi && typeof bi === 'object' ? bi : {};
  };
  /* Record periods in use: the 6-11 band has only the current period. */
  D.periods = function (a) { return D.band(a) === 'child' ? ['adult'] : ['adult', 'child']; };
  D.PERIOD_LABELS = {
    young: { adult: 'Now (last 6 months)', child: 'Before age 12' },
    adult: { adult: 'Adulthood (last 6 months)', child: 'Childhood (age 5 to 12)' }
  };
  D.periodLabel = function (a, key) {
    var set = D.young(a) ? D.PERIOD_LABELS.young : D.PERIOD_LABELS.adult;
    return set[key] || '';
  };

  /* Does a data item apply to this person? ages: 'young' | 'adult' | 'all' (missing = all) and, when
     given, bands: [band ids]. Used for history sections (the history view filters the same way). */
  D.forAge = function (a, x) {
    if (!x || typeof x !== 'object') return false;
    var g = x.ages;
    if (g && g !== 'all' && g !== (D.young(a) ? 'young' : 'adult')) return false;
    return !(Array.isArray(x.bands) && x.bands.length && x.bands.indexOf(D.band(a)) < 0);
  };

  /* Tool ids for the screening and comorbidity steps.
     key: 'screen' | 'screenCore' | 'comorbid' | 'comorbidCore'.
     Adults always use D.STEP_TOOLS. Young people use their band's list (ids that exist in the tools
     library). When the band has no list for the key, young people get the library tools whose numeric
     age range (ageMin/ageMax) covers their age, never the adult list (see youngTools). */
  D.stepTools = function (a, key) {
    var base = D.STEP_TOOLS[key];
    if (!base) return [];
    if (!D.young(a)) return base.slice();
    var list = D.bandInfo(a)[key];
    return Array.isArray(list) ? known('tools', list) : youngTools(a, key);
  };
  /* Fallback tool list for a young person whose band has no list for this step.
     - A tool counts only when its numeric ageMin/ageMax covers the age (a tool with neither counts as an
       adult tool and is left out, as the views do).
     - screen: ADHD scales used before the interview (groups adhd-screen, adhd-childhood, adhd-impairment,
       adhd-rating and child, with stage 'referral' or 'pre').
     - comorbid: the other tools marked for the 'comorbid' stage (C-SSRS stays with the risk step).
     - Core keys: none. Young bands have empty core lists, so the step counts as done when any listed tool
       has a result. */
  var ADHD_SCREEN_GROUPS = ['adhd-screen', 'adhd-childhood', 'adhd-impairment', 'adhd-rating', 'child'];
  function hasStage(t, s) { return arr(t.stage).indexOf(s) > -1; }
  function screenTool(t) { return ADHD_SCREEN_GROUPS.indexOf(t.group) > -1 && (hasStage(t, 'referral') || hasStage(t, 'pre')); }
  function toolFitsAge(t, age) {
    var lo = typeof t.ageMin === 'number' ? t.ageMin : null, hi = typeof t.ageMax === 'number' ? t.ageMax : null;
    if (age === null || (lo === null && hi === null)) return false;
    return (lo === null || age >= lo) && (hi === null || age <= hi);
  }
  function youngTools(a, key) {
    if (/Core$/.test(key)) return [];
    var age = ageOf(a);
    var fit = arr(AA.data.tools).filter(function (t) { return t && t.id && t.id !== 'cssrs' && toolFitsAge(t, age); });
    var pick = key === 'screen' ? fit.filter(screenTool) : fit.filter(function (t) { return hasStage(t, 'comorbid') && !screenTool(t); });
    return pick.map(function (t) { return t.id; });
  }

  /* A tool counts as recorded when its scored answers are complete, or when a result from a
     licensed (information-only) scale has been entered: tools.<id>.result = { score, cutoff, rater, date, notes }. */
  D.toolDone = function (a, id) {
    var t = a && a.tools ? a.tools[id] : null;
    var res = t && t.result;
    if (res && typeof res === 'object') {
      var sc = res.score;
      if ((sc !== undefined && sc !== null && String(sc).trim() !== '') || res.cutoff) return true;
    }
    var r = AA.scoring && AA.scoring.forAssessment ? AA.scoring.forAssessment(a, id) : null;
    return !!(r && r.complete);
  };

  /* Adult threshold: 5 symptoms from age 17, otherwise 6 (DSM-5-TR criterion A). */
  D.need = function (a) { var age = ageOf(a); return age !== null && age < 17 ? 6 : 5; };

  /* Symptom counts for one period ('adult' = current | 'child' = before 12). */
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
    var lead = D.young(a) ? 'Current (past 6 months)' : 'Adulthood (past 6 months)';
    var d = lead + ': inattention ' + c.IA + '/' + c.ofIA + ', hyperactivity-impulsivity ' + c.HI + '/' + c.ofHI + '; ' + need + ' needed in either domain.';
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

  /* Has any onset question been answered? (age of onset, "always there", or before age 12). */
  function onsetAnswered(o) {
    o = o || {};
    return !!(o.before12 || o.always || (o.ageOnset !== undefined && o.ageOnset !== null && String(o.ageOnset).trim() !== ''));
  }

  /* Criterion B for a child aged 6-11: the current period is also before age 12, so the current
     symptoms count and DSM-5-TR criterion B (several symptoms before 12) is met by them. The onset
     answers are still needed, because a sudden or recent start points to another cause.
     onset.before12 'no' records that the symptoms are not a long-standing pattern: that is a red flag
     for another explanation (criterion E holds back, see D.criterionE), not a failure of B
     (ICD-11 CDDR 6A05: abrupt onset suggests other causes; NICE NG87 1.3.3). */
  function criterionBChild(a) {
    var c = D.counts(a, 'adult');
    var total = c.IA + c.HI;
    var o = (a && a.onset) || {};
    var before12 = o.before12 || null;
    var answered = c.answeredIA + c.answeredHI, of = c.ofIA + c.ofHI;
    var d = 'Age 6 to 11: the current period is also before age 12, so current symptoms count (inattention ' + c.IA + '/' + c.ofIA + ', hyperactivity-impulsivity ' + c.HI + '/' + c.ofHI + '). ';
    var extra = { IA: c.IA, HI: c.HI, total: total, before12: before12, fullChildIA: c.IA >= 6, fullChildHI: c.HI >= 6, fromCurrent: true, abrupt: before12 === 'no' };
    var caution = before12 === 'no'
      ? ' Onset recorded as a sudden or recent start, not a long-standing pattern. That is a red flag: look hard for another cause, such as a medical problem, trauma, abuse or a change at home or school, and record which differential explains or excludes it (criterion E).'
      : o.always === 'no' ? ' Symptoms have not always been there: check whether the start was gradual or sudden. A sudden start is a red flag for another cause.' : '';
    if (before12 === 'unsure') return status('pending', d + 'Onset recorded as "unsure": check whether this is a long-standing pattern or a sudden or recent change.', extra);
    if (!onsetAnswered(o)) {
      if (answered === 0) return status('pending', 'Current symptoms and age of onset not yet recorded.', extra);
      return status('pending', d + 'Record the age of onset and whether the start was gradual or sudden.', extra);
    }
    if (total >= D.SEVERAL) return status('met', d + 'Several symptoms present (app uses ' + D.SEVERAL + '+).' + caution, extra);
    if (answered === of) return status('not-met', d + 'Fewer than ' + D.SEVERAL + ' current symptoms recorded.' + caution, extra);
    return status('pending', d + 'Current symptom interview not finished.' + caution, extra);
  }

  D.criterionB = function (a) {
    if (D.band(a) === 'child') return criterionBChild(a);
    var young = D.young(a);
    var c = D.counts(a, 'child');
    var total = c.IA + c.HI;
    var before12 = a && a.onset ? a.onset.before12 : null;
    var answered = c.answeredIA + c.answeredHI, of = c.ofIA + c.ofHI;
    var d = (young ? 'Before age 12' : 'Childhood (age 5-12)') + ': inattention ' + c.IA + '/' + c.ofIA + ', hyperactivity-impulsivity ' + c.HI + '/' + c.ofHI + '. ';
    var extra = { IA: c.IA, HI: c.HI, total: total, before12: before12 || null, fullChildIA: c.IA >= 6, fullChildHI: c.HI >= 6 };
    if (before12 === 'no') return status('not-met', d + 'Symptoms reported to start after age 12. Look hard for another cause before considering ADHD.', extra);
    if (before12 === 'yes' && total >= D.SEVERAL) return status('met', d + 'Several symptoms before age 12 (app uses ' + D.SEVERAL + '+).', extra);
    if (before12 === 'yes' && answered === of && total < D.SEVERAL) return status('not-met', d + 'Fewer than ' + D.SEVERAL + (young ? ' symptoms recorded before age 12.' : ' childhood symptoms recorded.'), extra);
    if (answered === 0 && !before12) return status('pending', (young ? 'Symptoms before age 12' : 'Childhood symptoms') + ' and age of onset not yet recorded.', extra);
    return status('pending', d + (before12 ? '' : 'Record whether symptoms were present before age 12.'), extra);
  };

  D.ADULT_DOMAINS_MIN = 2;
  /* Impairment ratings for one period. Young people see their band's domain labels
     (ageBands[band].impairmentLabels), for example "School and learning" for work. */
  function impairList(a, period) {
    var rec = (a && a.impairment && a.impairment[period]) || {};
    var doms = (AA.data.impairment && AA.data.impairment.domains) || [];
    var labels = D.young(a) ? (D.bandInfo(a).impairmentLabels || {}) : {};
    return doms.map(function (d) {
      var r = rec[d.id] || {};
      return { id: d.id, label: labels[d.id] || d.label, sev: typeof r.sev === 'number' ? r.sev : null };
    });
  }
  D.impairment = impairList;

  /* Criterion C for young people: several symptoms present in two or more settings (home, school, with
     friends or relatives, other activities). The impairment areas are mapped to settings; self-esteem and
     accidents are areas of impairment, not settings. A parent and a teacher who both report symptoms
     (collateral rated 1 or 2, or 3+ symptoms rated "yes" by each) also show home and school.
     DSM-5-TR criterion C; NICE NG87 1.3.3 ("2 or more important settings"). Adults keep the DIVA-style
     count of affected areas. */
  D.SETTING_OF_DOMAIN = { work: 'school', relationships: 'home', daily: 'home', social: 'friends', leisure: 'activities' };
  var SETTING_LABEL = { school: 'school or college', home: 'home', friends: 'with friends', activities: 'other activities' };
  function sourceSettings(a) {
    var c = (a && a.collateral) || {}, rec = (a && a.symptoms) || {}, out = [];
    var byYes = function (who) { return syms().filter(function (s) { var by = rec[s.id] && rec[s.id].by; return by && by[who] === 'yes'; }).length; };
    if ((typeof c.parent === 'number' && c.parent >= 1) || byYes('parent') >= D.SEVERAL) out.push('home');
    if ((typeof c.school === 'number' && c.school >= 1) || byYes('teacher') >= D.SEVERAL) out.push('school');
    return out;
  }
  D.criterionC = function (a) {
    var young = D.young(a);
    var list = impairList(a, 'adult');
    var rated = list.filter(function (x) { return x.sev !== null; });
    var hit = rated.filter(function (x) { return x.sev >= 1; });
    var extra = { domains: hit.map(function (x) { return x.label; }), rated: rated.length, of: list.length };
    if (!young) {
      var dA = hit.length + ' adult area(s) affected' + (hit.length ? ': ' + extra.domains.join(', ') : '') + '. Two or more settings are needed.';
      if (hit.length >= D.ADULT_DOMAINS_MIN) return status('met', dA, extra);
      if (list.length && rated.length === list.length) return status('not-met', dA, extra);
      return status('pending', rated.length ? dA + ' Not all areas rated yet.' : 'Impairment areas not yet rated.', extra);
    }
    var settings = [];
    hit.forEach(function (x) { var s = D.SETTING_OF_DOMAIN[x.id]; if (s && settings.indexOf(s) < 0) settings.push(s); });
    var fromSources = sourceSettings(a);
    fromSources.forEach(function (s) { if (settings.indexOf(s) < 0) settings.push(s); });
    extra.settings = settings; extra.fromSources = fromSources;
    var d = hit.length + ' current area(s) affected' + (hit.length ? ': ' + extra.domains.join(', ') : '') +
      '. Settings affected: ' + (settings.length ? settings.map(function (s) { return SETTING_LABEL[s] || s; }).join(', ') : 'none yet') +
      (fromSources.length ? ' (including parent or teacher reports)' : '') + '. Two or more settings are needed (for example home and school).';
    if (settings.length >= 2) return status('met', d, extra);
    if (list.length && rated.length === list.length) return status('not-met', d + ' Self-esteem and accidents are areas of impairment, not settings. If problems are only at school or only at home, look harder for another explanation.', extra);
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
    if (max >= 2) return status('met', (D.young(a) ? 'Highest current impairment: ' : 'Highest adult impairment: ') + labels[max] + ' (NICE: at least moderate).', extra);
    if (max === 1) return status('partial', 'Only mild impairment recorded. This is below the NICE threshold of at least moderate impairment.', extra);
    return status(rated.length === list.length ? 'not-met' : 'pending', 'No impairment recorded so far.', extra);
  };

  /* Differentials that must be reviewed. Young people: the band's ddxCore ids that exist in the
     differential library (falls back to the adult core set when none of them is loaded). */
  D.coreConditions = function (a) {
    var conds = arr(AA.data.ddx);
    if (D.young(a)) {
      var ids = D.bandInfo(a).ddxCore;
      if (Array.isArray(ids) && ids.length) {
        var list = conds.filter(function (c) { return ids.indexOf(c.id) > -1; });
        if (list.length) return list;
      }
    }
    return conds.filter(function (c) { return c.core; });
  };

  D.criterionE = function (a) {
    var conds = AA.data.ddx || [];
    var rec = (a && a.ddx) || {};
    var core = D.coreConditions(a).map(function (c) { return c.id; });
    var better = [], uncertain = [], comorbid = [], unreviewedCore = [];
    conds.forEach(function (c) {
      var v = rec[c.id] ? rec[c.id].verdict : null;
      if (v === 'better') better.push(c.name);
      else if (v === 'uncertain') uncertain.push(c.name);
      else if (v === 'comorbid') comorbid.push(c.name);
      if (core.indexOf(c.id) > -1 && !v) unreviewedCore.push(c.name);
    });
    var reviewed = conds.filter(function (c) { return rec[c.id] && rec[c.id].verdict; }).length;
    var extra = { better: better, uncertain: uncertain, comorbid: comorbid, unreviewedCore: unreviewedCore, reviewed: reviewed, core: core };
    /* Age 6-11 with a sudden or recent start (onset.before12 'no'): E stays pending until the clinician records
       which differential explains or excludes it (onset.abruptReviewed true, or onset.abruptNote). */
    var o = (a && a.onset) || {};
    var abrupt = D.band(a) === 'child' && o.before12 === 'no' && !(o.abruptReviewed === true || String(o.abruptNote || '').trim());
    var abruptTxt = 'Sudden or recent start recorded: record which differential explains or excludes it before confirming criterion E.';
    if (abrupt) extra.abrupt = true;
    if (!conds.length || !reviewed) return status('pending', 'Differential diagnosis review not started.' + (abrupt ? ' ' + abruptTxt : ''), extra);
    if (better.length) return status('not-met', 'Symptoms judged better explained by: ' + better.join(', ') + '.', extra);
    if (uncertain.length) return status('pending', 'Uncertain differential(s) need more information: ' + uncertain.join(', ') + '.' + (abrupt ? ' ' + abruptTxt : ''), extra);
    if (unreviewedCore.length) return status('pending', unreviewedCore.length + ' core differential(s) not yet reviewed: ' + unreviewedCore.join(', ') + '.' + (abrupt ? ' ' + abruptTxt : ''), extra);
    if (abrupt) return status('pending', abruptTxt + (comorbid.length ? ' Co-occurring: ' + comorbid.join(', ') + '.' : ''), extra);
    return status('met', 'Not better explained by another condition' + (comorbid.length ? '. Co-occurring: ' + comorbid.join(', ') : '') + '.', extra);
  };

  D.criteria = function (a) {
    return { A: D.criterionA(a), B: D.criterionB(a), C: D.criterionC(a), D: D.criterionD(a), E: D.criterionE(a) };
  };

  /* Current presentation from current counts (DSM-5-TR: based on the past 6 months). */
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

  /* Collateral sources rated 0/1/2 for this age: young people parent (now) and school (teacher);
     adults parent (looking back), partner and school reports. */
  D.collateralKeys = function (a) { return D.young(a) ? ['parent', 'school'] : ['parent', 'partner', 'school']; };

  /* Collateral support (DIVA convention: 0 none/little, 1 some, 2 clear; 'na' not available). */
  D.collateral = function (a) {
    var c = (a && a.collateral) || {};
    var keys = D.collateralKeys(a);
    var rated = keys.filter(function (k) { return typeof c[k] === 'number'; });
    var best = rated.reduce(function (m, k) { return Math.max(m, c[k]); }, -1);
    var level = !rated.length ? 'unavailable' : best === 2 ? 'clear' : best === 1 ? 'some' : 'none';
    return { rated: rated.length, best: best < 0 ? null : best, level: level, sources: rated, keys: keys };
  };

  /* Parent versus teacher, from the optional per-source ratings symptoms.<id>.by.{parent, teacher}.
     Only symptoms that both rated 'yes' or 'no' are compared. */
  D.agreement = function (a) {
    var rec = (a && a.symptoms) || {};
    var out = { pairs: 0, agree: 0, bothYes: 0, differ: [] };
    syms().forEach(function (s) {
      var by = rec[s.id] && rec[s.id].by;
      if (!by || typeof by !== 'object') return;
      var p = by.parent, t = by.teacher;
      if ((p !== 'yes' && p !== 'no') || (t !== 'yes' && t !== 'no')) return;
      out.pairs++;
      if (p === t) { out.agree++; if (p === 'yes') out.bothYes++; } else out.differ.push(s.id);
    });
    return out;
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

  /* ADHD symptom rating scales whose result can be compared with the interview (young people). */
  D.ADHD_RATING_IDS = ['conners4', 'adhdrs5', 'vanderbilt', 'snap4'];
  function isAdhdRating(id) {
    if (D.ADHD_RATING_IDS.indexOf(id) > -1) return true;
    var t = AA.byId('tools', id);
    return !!(t && /^adhd-(screen|childhood|rating|interview)$/.test(t.group || ''));
  }
  /* true / false / null: scored answers first, then an entered result (cut-off met yes/no). */
  function ratingPositive(a, id) {
    var r = AA.scoring && AA.scoring.forAssessment ? AA.scoring.forAssessment(a, id) : null;
    if (r && r.complete && (r.positive === true || r.positive === false)) return r.positive;
    var t = a && a.tools ? a.tools[id] : null;
    var cut = t && t.result ? t.result.cutoff : null;
    return cut === 'yes' ? true : cut === 'no' ? false : null;
  }
  function ratingLabel(a, id) {
    var t = AA.byId('tools', id);
    var rec = a && a.tools ? a.tools[id] : null;
    var rater = rec && rec.result && rec.result.rater;
    return (t && t.abbr ? t.abbr : id) + (rater ? ' (' + rater + ')' : '');
  }

  /* Evidence strength: a transparent heuristic (not a validated scale). */
  D.confidence = function (a) {
    var pts = 0, reasons = [];
    var young = D.young(a);
    var A = D.criterionA(a), B = D.criterionB(a), E = D.criterionE(a);
    var col = D.collateral(a);
    if (col.level === 'clear') { pts += 2; reasons.push(['+', 'Collateral information clearly supports the history.']); }
    else if (col.level === 'some') { pts += 1; reasons.push(['+', 'Collateral information gives some support.']); }
    else if (col.level === 'none') { pts -= 2; reasons.push(['-', 'Collateral information does not support the history.']); }
    else { pts -= 1; reasons.push(['-', young ? 'No parent or school information yet.' : 'No collateral information yet (informant or school reports).']); }
    var ag = D.agreement(a);
    if (ag.pairs) {
      if (ag.agree / ag.pairs >= 0.75) {
        if (ag.pairs >= 3) pts += 1;
        reasons.push(['+', 'Parent and teacher agree on ' + ag.agree + ' of ' + ag.pairs + ' symptoms they both rated.']);
      } else {
        reasons.push(['!', 'Parent and teacher disagree on ' + ag.differ.length + ' of ' + ag.pairs + ' symptoms they both rated. Explore why: different settings and demands, or one informant over- or under-reporting.']);
      }
    }
    if (young) {
      /* ASRS and WURS-25 are adult scales: they are not expected here, so their absence costs nothing.
         An ADHD rating scale result (scored, or a licensed scale's entered cut-off) plays the same role. */
      if (A.status !== 'pending') {
        var met = A.status === 'met', agree = [], differ = [];
        D.stepTools(a, 'screen').forEach(function (id) {
          if (!isAdhdRating(id)) return;
          var pos = ratingPositive(a, id);
          if (pos === null) return;
          (pos === met ? agree : differ).push(ratingLabel(a, id));
        });
        if (agree.length && !differ.length) { pts += 1; reasons.push(['+', 'Rating scale result agrees with the interview: ' + agree.join(', ') + '.']); }
        else if (differ.length) reasons.push(['!', 'Rating scale result and interview disagree: ' + differ.join(', ') + '. Explore why (who rated it, in which setting, over- or under-reporting).']);
      }
    } else {
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
    }
    if (E.uncertain && E.uncertain.length) { pts -= 2; reasons.push(['-', 'Unresolved differential(s): ' + E.uncertain.join(', ') + '.']); }
    if (E.comorbid && E.comorbid.length >= 2) reasons.push(['!', 'Several co-occurring conditions: attribution of symptoms is harder.']);
    var v = a && a.validity ? a.validity.concern : null;
    if (v === 'major') { pts -= 3; reasons.push(['-', 'Major concern about symptom validity.']); }
    else if (v === 'some') { pts -= 1; reasons.push(['-', 'Some concern about symptom validity.']); }
    else if (v === 'none') { pts += 1; reasons.push(['+', 'No symptom validity concerns.']); }
    var unsure = A.counts ? A.counts.unsureIA + A.counts.unsureHI : 0;
    if (unsure >= 3) { pts -= 1; reasons.push(['-', unsure + (young ? ' current symptoms scored "unsure".' : ' adult symptoms scored "unsure".')]); }
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

  /* DIVA 2.0 score form (DSM-IV): 6+ per domain in childhood and adulthood, onset before 7.
     It is an adult interview: applies is false under 18 and the view should hide it. */
  D.diva2 = function (a) {
    var ad = D.counts(a, 'adult'), ch = D.counts(a, 'child');
    var age = a && a.onset ? parseInt(a.onset.ageOnset, 10) : NaN;
    var always = a && a.onset ? a.onset.always : null;
    var applies = D.band(a) === 'adult';
    var out = {
      applies: applies,
      childIA6: ch.IA >= 6, childHI6: ch.HI >= 6, adultIA6: ad.IA >= 6, adultHI6: ad.HI >= 6,
      adultIA4: ad.IA >= 4, adultHI4: ad.HI >= 4,
      before7: always === 'yes' ? true : (!isNaN(age) ? age < 7 : null)
    };
    if (!applies) out.note = 'DIVA 2.0 is an adult interview with DSM-IV rules. It does not apply under 18.';
    return out;
  };

  /* Step completion for the progress rail: {done, of}. Band-aware: only the periods, collateral
     sources and tool lists that apply at this age are counted. Treatment steps are answered by
     AA.treatment.stepProgress when that engine is loaded. */
  D.stepProgress = function (a, step) {
    if (!a) return { done: 0, of: 1 };
    var band = D.band(a), periods = D.periods(a);
    function toolsStep(key) {
      var core = D.stepTools(a, key + 'Core');
      var rec = function (id) { return D.toolDone(a, id); };
      if (!core.length) return { done: D.stepTools(a, key).some(rec) ? 1 : 0, of: 1 };
      return { done: core.filter(rec).length, of: core.length };
    }
    function symDone(dim) {
      var n = 0, of = 0;
      syms(dim).forEach(function (s) {
        var r = (a.symptoms || {})[s.id] || {};
        periods.forEach(function (p) { of++; if (r[p]) n++; });
      });
      return { done: n, of: of || 1 };
    }
    switch (step) {
      case 'setup': {
        /* Young people (6-17) also need a consent basis that fits the age: under 16, parent consent with the
           child's assent, or Gillick competence; at 16 and 17, the young person's own consent (presumed
           capacity), or parent involvement when they lack capacity (ARCHITECTURE 5.12). */
        var p = a.patient || {};
        var base = (p.ref ? 1 : 0) + (p.age ? 1 : 0) + (p.consent ? 1 : 0);
        if (!D.young(a)) return { done: base, of: 3 };
        var cb = (p.young || {}).consentBasis, yAge = ageOf(a);
        var okBasis = yAge !== null && yAge >= 16 ? (cb === 'capacity_16' || cb === 'lacks_capacity_16' || cb === 'parent_assent') : (cb === 'parent_assent' || cb === 'gillick');
        return { done: base + (okBasis ? 1 : 0), of: 4 };
      }
      case 'screen': return toolsStep('screen');
      case 'risk': return { done: a.risk && a.risk.reviewed ? 1 : 0, of: 1 };
      case 'history': {
        /* Only the sections shown at this age (ages, and bands when given). */
        var hs = arr(AA.data.history).filter(function (s) { return D.forAge(a, s); });
        var hd = hs.filter(function (s) { var r = (a.history || {})[s.id]; return r && ((r.checks && Object.keys(r.checks).some(function (k) { return r.checks[k]; })) || r.notes || r.none); }).length;
        return { done: hd, of: hs.length || 1 };
      }
      case 'comorbid': return toolsStep('comorbid');
      case 'ia':
      case 'hi': {
        /* The symptom scores for each period in use, plus the DIVA-style supplement question for each period. */
        var sd = symDone(step === 'ia' ? 'IA' : 'HI');
        var sup = a.supplement || {};
        var keys = periods.map(function (per) { return step + (per === 'adult' ? 'Adult' : 'Child'); });
        return { done: sd.done + keys.filter(function (k) { return sup[k]; }).length, of: sd.of + keys.length };
      }
      case 'onset': {
        var o = a.onset || {};
        var doms = 0, rated = 0;
        periods.forEach(function (per) {
          var l = impairList(a, per);
          doms += l.length;
          rated += l.filter(function (x) { return x.sev !== null; }).length;
        });
        /* Age 6-11: one onset answer (age of onset, "always there" or before 12) is enough. */
        if (band === 'child') return { done: (onsetAnswered(o) ? 1 : 0) + (o.duration6m ? 1 : 0) + rated, of: 2 + doms };
        return { done: (o.always ? 1 : 0) + (o.before12 ? 1 : 0) + (o.duration6m ? 1 : 0) + rated, of: 3 + doms };
      }
      case 'collateral': {
        var c = a.collateral || {};
        var ck = D.collateralKeys(a);
        return { done: ck.filter(function (k) { return c[k] !== undefined && c[k] !== null; }).length, of: ck.length };
      }
      case 'ddx': {
        var core = D.coreConditions(a);
        return { done: core.filter(function (x) { return a.ddx && a.ddx[x.id] && a.ddx[x.id].verdict; }).length, of: core.length || 1 };
      }
      case 'validity': return { done: a.validity && a.validity.concern ? 1 : 0, of: 1 };
      case 'summary': return { done: a.formulation && a.formulation.decision ? 1 : 0, of: 1 };
      case 'report': return { done: a.formulation && a.formulation.reportReviewed ? 1 : 0, of: 1 };
      default: {
        if (AA.treatment && AA.treatment.stepProgress) { var r = AA.treatment.stepProgress(a, step); if (r) return r; }
        return { done: 0, of: 1 };
      }
    }
  };
})(typeof window !== 'undefined' ? window.AA : globalThis.AA);
