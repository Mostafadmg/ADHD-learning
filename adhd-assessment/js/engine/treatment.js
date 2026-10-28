/* Treatment engine: AA.treatment (T). Pure functions over an assessment record; no DOM.
   Loads after js/engine/diagnosis.js and reads the treatment data collections
   (AA.data.txDrugs, txProducts, txSequence, txPlanItems, txCardiac, txCautions, txSideEffects,
   txCounsel, txRxChecks, txMonitor) and the safety-step items (AA.data.risk). Every collection may be
   missing: functions then return empty results instead of throwing.

   Conventions
   - Dose numbers in product.dose.<group> (start, step, max, target, overStart, overTarget) are mg PER DAY.
     The dose for one administration is the daily dose divided by the number of doses a day, or the
     unequal doses of the regimen (immediate release only).
   - Reasons, cautions, flags and warnings are objects with a `text` (and `t`) field and a toString() that
     returns the text, so a view can print them as strings or read their fields (level, src).
   - Every rule carries a `src`. Lines that are not from a named source say "Clinical practice".
   - Reviews belong to a medicine: a review may store its drug (and product). The dose, the trial, the next
     dose and the prescription use only the reviews of the medicine chosen now (T.currentReviews). Blood
     pressure, pulse and weight flags use every review, so that history carries across a switch.
   - No age recorded: no doses, maxima or licences (they all depend on the age).
   - Safety-screen answers that change doses: severe kidney impairment (lisdexamfetamine maximum 50 mg); liver
     impairment with baseline.childPugh (atomoxetine: B 50%, C 25%; A no change); ci_cyp3a4_inh (guanfacine
     halved, rounded down to whole tablets) and ci_cyp3a4_ind (warning: re-titration up to 7 mg); the older
     combined ci_cyp3a4 counts as an inhibitor, with a warning, until the two new items are answered.
   - A product's own contraindications (txProducts ci, for example Medikinet XL and Ambinet XL with
     ci_acidsuppress) block that product in T.products, T.dosePlan, T.nextDose and T.rxText.
   - dose.<group>.usualMax (dexamfetamine 20 mg): the ladder stops there and T.nextDose holds; max stays the SmPC
     maximum for a rare specialist decision (choice.overMaxReason records the reason).
   - txSideEffects items with urgent: true give an urgent flag at any rating.
   - T.sharedCarePlan(a) is T.monitorPlan(a) without the specialistOnly items (what the GP takes on).
   The clinician decides: results here are prompts and checks, never a prescription on their own. */
(function (AA) {
  'use strict';
  var T = AA.treatment = {};

  /* ---------------- small helpers ---------------- */
  function data(name) { return (AA.data && AA.data[name]) || null; }
  function list(name) { var v = data(name); return Array.isArray(v) ? v : []; }
  function tx(a) { return (a && a.treatment) || {}; }
  function obj(x) { return x && typeof x === 'object' ? x : {}; }
  function num(v) {
    if (v === null || v === undefined || v === '' || typeof v === 'boolean') return null;
    var n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
    return isFinite(n) ? n : null;
  }
  function r1(n) { return Math.round(n * 10) / 10; }
  function r2(n) { return Math.round(n * 100) / 100; }
  function fmt(n) { if (n === null || n === undefined) return ''; var x = Math.round(n * 100) / 100; return String(x); }
  function lc(s) { return String(s || '').toLowerCase(); }
  function uniq(arr) { var out = []; arr.forEach(function (x) { if (x && out.indexOf(x) < 0) out.push(x); }); return out; }
  function rep(x, n) { var out = []; for (var i = 0; i < n; i++) out.push(x); return out; }
  function nice(c) { return 'NICE NG87 ' + c; }

  /* A reason / caution / flag / warning. Prints as its text. */
  function Item(fields) { for (var k in fields) if (Object.prototype.hasOwnProperty.call(fields, k)) this[k] = fields[k]; }
  Item.prototype.toString = function () { return this.text || this.t || ''; };
  function reason(level, text, src, extra) {
    var o = { level: level, text: text, t: text, src: src || '' };
    if (extra) for (var k in extra) o[k] = extra[k];
    return new Item(o);
  }
  function warnItem(text, src) { return reason('warn', text, src || 'Clinical practice'); }

  var AGE_MSG = 'Record the age in Setup: doses, maxima and licences depend on it.';
  var AGE_SRC = 'SmPC section 4.1–4.2 (licences and doses by age); clinical practice';

  /* ---------------- dates ---------------- */
  T.today = function () { return new Date().toISOString().slice(0, 10); };
  function parseISO(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || ''));
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function iso(ms) { return new Date(ms).toISOString().slice(0, 10); }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  function dateText(s) { var t = parseISO(s); if (t === null) return String(s || ''); var d = new Date(t); return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
  T.addDays = function (s, n) { var t = parseISO(s); return t === null ? null : iso(t + n * 86400000); };
  T.addMonths = function (s, n) {
    var t = parseISO(s); if (t === null) return null;
    var d = new Date(t), y = d.getUTCFullYear(), mo = d.getUTCMonth() + n, day = d.getUTCDate();
    var last = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();   /* clamp 31 Jan + 1 month to 28/29 Feb */
    return iso(Date.UTC(y, mo, Math.min(day, last)));
  };
  T.daysBetween = function (from, to) {
    var a = parseISO(from), b = parseISO(to);
    return a === null || b === null ? null : Math.round((b - a) / 86400000);
  };

  /* ---------------- age and group ---------------- */
  var D = function () { return AA.diagnosis || {}; };
  T.age = function (a) {
    var d = D();
    if (typeof d.age === 'function') { var v = d.age(a); if (v === null || typeof v === 'number') return v; }
    var n = a && a.patient ? parseInt(a.patient.age, 10) : NaN;
    return isNaN(n) ? null : n;
  };
  var BANDS = ['under6', 'child', 'teen', 'y17', 'adult'];
  T.band = function (a) {
    var d = D();
    if (typeof d.band === 'function') { var b = d.band(a); if (BANDS.indexOf(b) >= 0) return b; }
    var age = T.age(a);
    if (age === null || age >= 18) return 'adult';
    if (age < 6) return 'under6';
    if (age <= 11) return 'child';
    if (age <= 16) return 'teen';
    return 'y17';
  };
  T.group = function (a) {
    var b = T.band(a), age = T.age(a);
    if (b === 'under6' || (age !== null && age < 6)) return 'under6';
    if (b === 'child' || b === 'teen' || b === 'y17' || (age !== null && age < 18)) return 'young';
    return 'adult';
  };
  function doseKey(a) { return T.group(a) === 'adult' ? 'adult' : 'child'; }

  /* Does a data item apply at this age? Items may carry ages ('young' | 'adult' | 'all'; missing = all),
     ageMin and ageMax (years, inclusive; ignored when the age is not recorded) and bands (age band ids).
     Under 6 counts as young here, as in the treatment view. Every list and count in this engine uses it,
     so the views should filter with T.forAge too and their counts then match. */
  T.forAge = function (a, x) {
    if (!x || typeof x !== 'object') return false;
    var g = T.group(a) === 'adult' ? 'adult' : 'young', ag = x.ages;
    if (ag && ag !== 'all' && ag !== g) return false;
    var age = T.age(a), lo = num(x.ageMin), hi = num(x.ageMax);
    if (lo !== null && age !== null && age < lo) return false;
    if (hi !== null && age !== null && age > hi) return false;
    if (Array.isArray(x.bands) && x.bands.length && x.bands.indexOf(T.band(a)) < 0) return false;
    return true;
  };
  /* The pregnancy and breastfeeding items of the safety screen are asked from age 12 (as the pregnancy
     question is), even if the data item has no ageMin of its own. */
  var PREG_CI = { ci_pregnancy: true, ci_breastfeeding: true };
  function cautionFits(a, c) {
    if (!T.forAge(a, c)) return false;
    if (PREG_CI[c.id] && num(c.ageMin) === null && T.group(a) !== 'adult') { var age = T.age(a); if (age !== null && age < 12) return false; }
    return true;
  }

  /* ---------------- lookups ---------------- */
  T.drug = function (id) { return AA.byId ? AA.byId('txDrugs', id) : null; };
  T.product = function (id) { return AA.byId ? AA.byId('txProducts', id) : null; };
  function drugName(id) { var d = T.drug(id); return d ? d.name : ({ mph: 'Methylphenidate', lisdex: 'Lisdexamfetamine', dex: 'Dexamfetamine', atx: 'Atomoxetine', gxr: 'Guanfacine' }[id] || id); }
  function isStimulant(d) { return !!d && (d.isCD === true || /stimulant/i.test(d.cls || '') && !/non/i.test(d.cls || '')); }

  T.reviewsSorted = function (a) {
    var map = obj(tx(a).reviews);
    return Object.keys(map).filter(function (k) { return map[k] && typeof map[k] === 'object'; }).map(function (k) {
      var r = Object.assign({}, map[k]); r.id = k; return r;
    }).sort(function (x, y) {
      var dx = parseISO(x.date), dy = parseISO(y.date);
      if (dx === null && dy === null) return x.id < y.id ? -1 : x.id > y.id ? 1 : 0;
      if (dx === null) return 1;            /* undated reviews go last */
      if (dy === null) return -1;
      return dx - dy || (x.id < y.id ? -1 : x.id > y.id ? 1 : 0);
    });
  };
  T.latestReview = function (a) { var r = T.reviewsSorted(a); return r.length ? r[r.length - 1] : null; };
  /* The reviews of the medicine chosen now (oldest first). A review that stores its medicine counts when the
     drug matches and it is not dated before the start date (a restart of the same medicine begins again).
     An older review without a medicine counts only when dated after the start date (all of them when there is
     no start date), so a switch-day review of the previous medicine is left out. */
  T.currentReviews = function (a) {
    var ch = obj(tx(a).choice), start = parseISO(ch.startDate);
    return T.reviewsSorted(a).filter(function (r) {
      var rd = parseISO(r.date);
      if (r.drug) {
        if (ch.drug && r.drug !== ch.drug) return false;
        return start === null || rd === null || rd >= start;
      }
      return start === null || rd === null || rd > start;
    });
  };
  T.currentLatest = function (a) { var r = T.currentReviews(a); return r.length ? r[r.length - 1] : null; };
  /* The daily dose from a review onwards: the new dose agreed at it, else the dose taken at it. */
  function doseAfter(r) { if (!r) return null; var n = num(r.newDose); return n !== null ? n : num(r.dose); }

  /* Latest recorded weight: an explicit value, then the latest review, then the baseline. */
  T.weight = function (a) {
    var rs = T.reviewsSorted(a);
    for (var i = rs.length - 1; i >= 0; i--) { var w = num(rs[i].weightKg); if (w !== null) return w; }
    var b = num(obj(tx(a).baseline).weightKg); if (b !== null) return b;
    return num(obj(tx(a).choice).weightKg);
  };

  /* History items ticked anywhere in a.history.<section>.checks */
  T.histTicked = function (a, ids) {
    if (!Array.isArray(ids) || !ids.length) return [];
    var h = obj(a && a.history), hit = [];
    Object.keys(h).forEach(function (sec) {
      var c = obj(h[sec]).checks;
      if (c) ids.forEach(function (id) { if (c[id] && hit.indexOf(id) < 0) hit.push(id); });
    });
    return hit;
  };
  /* Safety-step (a.risk) items linked to a screen item: the item's own `risk` list, else these defaults
     (current suicidal thoughts or recent self-harm -> ci_depression; psychosis or mania -> ci_psychosis).
     The methylphenidate and dexamfetamine SmPCs (section 4.3) list both as contraindications. */
  var RISK_LINKS = { ci_depression: ['r_si', 'r_si_plan', 'r_selfharm_recent', 'r_y_selfharm_recent'], ci_psychosis: ['r_psychosis', 'r_mania'] };
  function riskIds(item) { return item && Array.isArray(item.risk) && item.risk.length ? item.risk : (RISK_LINKS[item && item.id] || []); }
  function riskTicked(a, ids) { var r = obj(a && a.risk); return (ids || []).filter(function (id) { return r[id] === true; }); }
  /* The safety-step items for this age (AA.data.risk.items). */
  function riskItems(a) {
    var R = data('risk'), items = Array.isArray(R) ? R : (R && Array.isArray(R.items) ? R.items : []);
    return items.filter(function (it) { return it && it.id && T.forAge(a, it); });
  }
  /* The separate pregnancy question (baseline.pregnancy) answers the two pregnancy items of the safety screen:
     pregnant or planning -> ci_pregnancy yes ("Pregnant or planning a pregnancy"); breastfeeding ->
     ci_breastfeeding yes; no or not applicable -> both no. Anything else leaves the item to the clinician. */
  function pregAnswer(b, id) {
    var p = obj(b).pregnancy;
    if (p === 'no' || p === 'na') return 'no';
    if (id === 'ci_pregnancy' && (p === 'pregnant' || p === 'planning')) return 'yes';
    if (id === 'ci_breastfeeding' && p === 'breastfeeding') return 'yes';
    return null;
  }
  /* Effective answer for a screen item: the recorded yes/no; then, for the two pregnancy items, the pregnancy
     question (once it is answered, the history pre-fill no longer applies to them); then 'yes' when a linked
     safety-step item is ticked (fromRisk); then 'yes' when a linked history item is ticked (fromHistory).
     Pass the baseline as b for safety-screen items. */
  function answerOf(a, map, item, b) {
    var v = obj(map)[item.id];
    if (v === 'yes' || v === 'no') return { v: v, fromHistory: false, fromPregnancy: false, fromRisk: false };
    if (b && PREG_CI[item.id] && obj(b).pregnancy) {
      var pv = pregAnswer(b, item.id);
      return { v: pv, fromHistory: false, fromPregnancy: !!pv, fromRisk: false };
    }
    if (riskTicked(a, riskIds(item)).length) return { v: 'yes', fromHistory: false, fromPregnancy: false, fromRisk: true };
    if (T.histTicked(a, item.hist).length) return { v: 'yes', fromHistory: true, fromPregnancy: false, fromRisk: false };
    return { v: null, fromHistory: false, fromPregnancy: false, fromRisk: false };
  }
  function fromWhere(ans) { return ans.fromRisk ? ' (from the safety step)' : ans.fromHistory ? ' (from history)' : ''; }
  T.cardiacAnswer = function (a, id) {
    var item = AA.byId('txCardiac', id) || { id: id };
    return answerOf(a, obj(tx(a).baseline).cardiac, item);
  };
  T.ciAnswer = function (a, id) {
    var item = AA.byId('txCautions', id) || { id: id }, b = obj(tx(a).baseline);
    return answerOf(a, b.ci, item, b);
  };
  function yes(a, id) { return T.ciAnswer(a, id).v === 'yes'; }
  function yesAny(a, ids) { return ids.some(function (id) { return yes(a, id); }); }

  /* ---------------- item lists for this age (what the views show and the counts use) ---------------- */
  T.cardiacItems = function (a) { return list('txCardiac').filter(function (c) { return c && c.id && T.forAge(a, c); }); };
  T.cautionItems = function (a) { return list('txCautions').filter(function (c) { return c && c.id && cautionFits(a, c); }); };
  T.planItems = function (a) { return list('txPlanItems').filter(function (x) { return x && x.id && T.forAge(a, x); }); };
  /* Counselling for a medicine (default: the chosen one). None until a medicine is chosen. */
  T.counselItems = function (a, drugId) {
    var drug = drugId || obj(tx(a).choice).drug;
    if (!drug) return [];
    return list('txCounsel').filter(function (c) {
      return c && c.id && (c.drugs === 'all' || (Array.isArray(c.drugs) && c.drugs.indexOf(drug) >= 0)) && T.forAge(a, c);
    });
  };
  /* Prescription checks: CD-only items only for a controlled drug (default: the chosen medicine).
     Items marked optional (instalments, private forms) are listed but never counted in step progress. */
  T.rxChecks = function (a, isCD) {
    if (isCD === undefined) { var d = T.drug(obj(tx(a).choice).drug); isCD = !!(d && d.isCD); }
    return list('txRxChecks').filter(function (c) { return c && c.id && (!c.cd || isCD) && T.forAge(a, c); });
  };
  /* Side effects to ask about at reviews: the medicine's own list (default: the chosen one), else all. */
  T.sideEffects = function (a, drugId) {
    var d = T.drug(drugId || obj(tx(a).choice).drug);
    var ids = d && Array.isArray(d.se) && d.se.length ? d.se : list('txSideEffects').map(function (x) { return x && x.id; });
    return ids.map(function (id) { return id ? AA.byId('txSideEffects', id) : null; }).filter(function (x) { return x && T.forAge(a, x); });
  };

  /* ---------------- applicability ---------------- */
  T.applicable = function (a) {
    if (T.group(a) === 'under6') {
      return { ok: false, code: 'under6', reason: 'Under 6: this tool does not cover ADHD treatment (no ADHD medicine is licensed under 6). Refer to a service with expertise in ADHD in young children. Under 5, NICE puts group parent training first and asks for a second specialist opinion before any medicine; at 5, NICE follows the 5-and-over pathway, with medicine used off-label.', src: nice('1.5.7–1.5.10, 1.7.7') + '; SmPC section 4.1 (licences from 6)' };
    }
    var dec = obj(a && a.formulation).decision;
    var ageNote = T.age(a) === null ? { ageMissing: true, note: AGE_MSG } : {};
    if (dec === 'met') return Object.assign({ ok: true, code: dec, reason: '' }, ageNote);
    if (dec === 'other-specified') {
      return Object.assign({ ok: true, code: dec, caution: true,
        reason: 'Other specified ADHD does not meet full DSM-5-TR or ICD-11 criteria. NICE NG87 medicine recommendations assume a diagnosis that meets the criteria, so medicine here is outside NICE. It needs a consultant or multidisciplinary team decision, with the reason recorded.',
        src: nice('1.3.3, 1.5.13, 1.5.15') }, ageNote);
    }
    if (dec === 'not-met') return { ok: false, code: 'not-met', reason: 'ADHD was not diagnosed, so ADHD medicine is not indicated. Follow the plan for the person\'s other needs.' };
    if (dec === 'deferred') return { ok: false, code: 'deferred', reason: 'The diagnosis is deferred. Finish the assessment before planning ADHD treatment.' };
    return { ok: false, code: 'nodecision', reason: 'Record the diagnostic decision in the Summary step first.' };
  };
  /* Does the recorded assessment still support the diagnostic decision? NICE NG87 1.7.4: before starting
     medicine, confirm the person continues to meet the criteria for ADHD and needs treatment.
     -> {ok, issues: [{level, text, src}], src}. Empty when no medicine decision applies. */
  T.diagnosisCheck = function (a) {
    var dec = obj(a && a.formulation).decision, issues = [], d = D();
    if (dec !== 'met' && dec !== 'other-specified') return { ok: true, issues: [], src: nice('1.7.4') };
    if (dec === 'met' && typeof d.outcome === 'function') {
      var o = d.outcome(a) || {}, cr = obj(o.criteria);
      if (o.code && o.code !== 'met') issues.push(warnItem('The recorded findings give "' + (o.title || o.code) + '", not "criteria met".', nice('1.3.3, 1.7.4')));
      ['A', 'B', 'C', 'D', 'E'].forEach(function (k) {
        var c = obj(cr[k]);
        if (c.status === 'pending') issues.push(warnItem('Criterion ' + k + ' not yet decided: ' + (c.detail || ''), 'DSM-5-TR; ' + nice('1.3.3')));
        else if (c.status === 'not-met') issues.push(warnItem('Criterion ' + k + ' not met: ' + (c.detail || ''), 'DSM-5-TR; ' + nice('1.3.3')));
        else if (c.status === 'partial') issues.push(warnItem('Criterion ' + k + ': ' + (c.detail || 'only mild impairment recorded.'), nice('1.3.3')));
      });
    }
    if (!(a && a.risk && a.risk.reviewed === true)) issues.push(warnItem('The safety and risk step is not marked as reviewed.', nice('1.7.4') + '; clinical practice'));
    return { ok: !issues.length, issues: issues, src: nice('1.3.1, 1.3.3, 1.7.4') };
  };
  /* Medication steps do not apply when the plan is non-drug support only or a referral. */
  function medicationPlanned(a) { var d = obj(tx(a).plan).decision; return d !== 'nondrug' && d !== 'refer'; }

  /* ---------------- blood pressure and pulse ---------------- */
  /* Adult clinic reading (NICE NG136 1.2.2): with a second reading, the lower of the two; with a third reading
     (taken when the first two differ a lot), the lower of the last two. The lower reading is the one with the
     lower systolic, then the lower diastolic, and it keeps its own diastolic. */
  function clinicReading(rec) {
    rec = obj(rec);
    var s1 = num(rec.sbp), d1 = num(rec.dbp);
    if (s1 === null || d1 === null) return null;
    var rp = obj(rec.repeat), s2 = num(rp.sbp), d2 = num(rp.dbp);
    var r3 = obj(rec.repeat3), s3 = num(r3.sbp), d3 = num(r3.dbp);
    var first = { s: s1, d: d1 }, second = s2 !== null && d2 !== null ? { s: s2, d: d2 } : null;
    var third = second && s3 !== null && d3 !== null ? { s: s3, d: d3 } : null;
    function lower(x, y) { return y.s < x.s || (y.s === x.s && y.d < x.d) ? y : x; }
    var use = third ? lower(second, third) : second ? lower(first, second) : first;
    return { s: use.s, d: use.d, first: first, second: second, third: third };
  }
  T.bpCheck = function (a, rec) {
    rec = obj(rec);
    var out;
    var pulse = num(rec.pulse);
    if (T.group(a) === 'young') {
      var c = rec.bpCentile, ys = num(rec.sbp), yd = num(rec.dbp), yage = T.age(a);
      var yTxt = ys !== null && yd !== null ? ys + '/' + yd : ys !== null ? 'systolic ' + ys : yd !== null ? 'diastolic ' + yd : '';
      var yHigh = function (s, d) { return (ys !== null && ys >= s) || (yd !== null && yd >= d); };
      if (yHigh(180, 120)) {
        out = { level: 'urgent', text: 'Blood pressure ' + yTxt + ' (180/120 or higher): do not start ADHD medicine. Arrange a same-day paediatric assessment, whatever the centile entry says.', src: 'Clinical practice (a reading this high needs same-day assessment at any age); ' + nice('1.7.6') };
      } else if (yage !== null && yage >= 13 && yHigh(130, 80) && (!c || c === 'lt90' || c === '90to95')) {
        out = { level: 'repeat', text: 'Blood pressure ' + yTxt + '. From age 13, 130/80 or higher counts as high blood pressure in the American Academy of Pediatrics guideline, so it cannot be ' + (c === 'lt90' ? 'below the 90th centile' : c === '90to95' ? 'between the 90th and 95th centile' : 'normal') + '. ' + (c ? 'Re-check the chart and the centile band' : 'Plot it on the centile chart and record the band') + ', and repeat the reading with the right cuff size, before starting.', src: 'Flynn JT et al. AAP clinical practice guideline, Pediatrics 2017;140:e20171904; ' + nice('1.7.4, 1.7.6') };
      } else if (c === 'lt90' && yHigh(140, 90)) {
        out = { level: 'repeat', text: 'Blood pressure ' + yTxt + ' looks high for "below the 90th centile". Re-check the chart and the centile band, and repeat the reading with the right cuff size, before starting.', src: 'Clinical practice; ' + nice('1.7.4, 1.7.6') };
      } else if (c === 'gt95_sustained') out = { level: 'refer', text: 'Blood pressure is consistently above the 95th centile for age and height. Refer to a paediatric hypertension specialist before starting ADHD medicine.', src: nice('1.7.6') };
      else if (c === 'gt95_once') out = { level: 'repeat', text: 'Above the 95th centile on one reading. Repeat it on another occasion with the right cuff size before deciding.', src: nice('1.7.6') + '; clinical practice (repeat a single high reading)' };
      else if (c === '90to95') out = { level: 'ok', text: 'Between the 90th and 95th centile. Not a reason to delay, but watch it before and after each dose change.', src: 'Clinical practice' };
      else if (c === 'lt90') out = { level: 'ok', text: 'Below the 90th centile for age and height.', src: nice('1.7.4') };
      else out = { level: 'unknown', text: 'Plot the blood pressure on a centile chart for age and height, then record the centile band. This tool does not hold centile tables.', src: nice('1.7.4, 1.7.6') };
    } else {
      var cr = clinicReading(rec);
      if (!cr) {
        out = { level: 'unknown', text: 'Record the systolic and diastolic blood pressure (right-sized cuff).', src: nice('1.7.4') };
      } else {
        /* NICE NG136 1.2.2: record the lower of the two readings (or of the last two, after a third reading). */
        var s = cr.s, d = cr.d, s1 = cr.first.s, d1 = cr.first.d, hasRep = !!cr.second, has3 = !!cr.third;
        var note = has3
          ? 'Clinic blood pressure ' + s + '/' + d + ': NICE NG136 records the lower of the last two readings (first ' + s1 + '/' + d1 + ', second ' + cr.second.s + '/' + cr.second.d + ', third ' + cr.third.s + '/' + cr.third.d + '). '
          : hasRep
            ? 'Clinic blood pressure ' + s + '/' + d + ': NICE NG136 records the lower of the two readings (first ' + s1 + '/' + d1 + ', second ' + cr.second.s + '/' + cr.second.d + '). '
            : 'Clinic reading ' + s1 + '/' + d1 + '. ';
        var recUrgent = s >= 180 || d >= 120, firstUrgent = s1 >= 180 || d1 >= 120;
        var secondUrgent = hasRep && (cr.second.s >= 180 || cr.second.d >= 120);
        var severe = 'Same-day specialist assessment if there are signs of accelerated hypertension (bleeding in the retina or a swollen optic disc), life-threatening symptoms (new confusion, chest pain, signs of heart failure or acute kidney injury) or a suspected phaeochromocytoma. Otherwise look for damage to the heart, kidneys and eyes as soon as possible, and repeat the clinic reading or arrange ambulatory or home readings, with a review within 7 days.';
        if (recUrgent) {
          out = { level: 'urgent', text: note + 'Clinic blood pressure 180/120 or higher (severe hypertension): do not start ADHD medicine. ' + severe, src: 'NICE NG136 1.2.2, 1.5.1–1.5.3; ' + nice('1.7.5') };
        } else if (rec.abpm === 'hypertensive') {
          out = { level: 'refer', text: note + 'Hypertension confirmed on ambulatory or home readings. That is a 1.7.5 feature: get a cardiology opinion before starting, and manage blood pressure as in NICE NG136.', src: nice('1.7.5') + '; NICE NG136' };
        } else if (s >= 140 || d >= 90) {
          if (rec.abpm === 'normal') out = { level: 'ok', text: note + 'Clinic reading raised, but ambulatory or home readings are normal. Recheck before and after each dose change.', src: 'NICE NG136 1.2' };
          else out = { level: 'confirm', text: note + (hasRep ? '' : 'Take a second reading in this consultation: NICE NG136 records the lower of the two. ') + 'Clinic blood pressure 140/90 or higher: offer ABPM (or HBPM) to confirm hypertension. If hypertension is confirmed, that is a 1.7.5 feature: refer for a cardiology opinion before starting.', src: 'NICE NG136 1.2.2–1.2.4; ' + nice('1.7.5') };
        } else {
          out = { level: 'ok', text: note + 'Below 140/90.', src: nice('1.7.4') + (hasRep ? '; NICE NG136 1.2.2' : '') };
        }
        /* One of the first two readings 180/120 or higher and the other much lower: NG136 asks for a third
           reading. Once it is recorded (repeat3) the lower of the last two is the clinic reading, above. */
        if (!has3 && (firstUrgent || secondUrgent) && out.level !== 'urgent' && out.level !== 'refer') {
          out = { level: 'confirm', text: out.text + ' The ' + (firstUrgent ? 'first' : 'second') + ' reading was 180/120 or higher, much higher than the other: NICE NG136 says to take a third reading when readings differ this much, and record the lower of the last two. Do not start ADHD medicine until you have it. If the clinic blood pressure stays at 180/120 or higher, treat it as severe hypertension. ' + severe, src: out.src + '; NICE NG136 1.2.2, 1.5.1–1.5.3' };
        }
        if (has3) out.src += '; NICE NG136 1.2.2';
        out.clinic = { sbp: s, dbp: d };
      }
    }
    out.pulse = pulse !== null && pulse > 120 ? {
      level: 'watch',
      text: 'Resting pulse ' + pulse + ' bpm (over 120). NICE gives no baseline heart-rate threshold. Recheck it at rest and look for a cause (caffeine, decongestants, anxiety) before starting.',
      src: 'Clinical practice (NG87 1.8.11 uses over 120 during treatment)'
    } : null;
    return new Item(out);
  };

  /* ---------------- pre-treatment checks ---------------- */
  /* Which medicines (txDrugs ci / caution) and which products (txProducts ci: a contraindication of that
     product only, such as Medikinet XL with acid-suppressing medicines) a screen item rules out or needs care with. */
  function cautionDrugs(id) {
    var ci = [], ca = [];
    list('txDrugs').forEach(function (d) {
      if ((d.ci || []).indexOf(id) >= 0) ci.push(d.name);
      else if ((d.caution || []).indexOf(id) >= 0) ca.push(d.name);
    });
    list('txProducts').forEach(function (p) {
      if (p && Array.isArray(p.ci) && p.ci.indexOf(id) >= 0 && ci.indexOf(p.name) < 0) {
        var dn = obj(T.drug(p.drug)).name;
        if (!dn || ci.indexOf(dn) < 0) ci.push(p.name);
      }
    });
    return { ci: ci, caution: ca };
  }
  /* Product-level contraindications answered yes (txProducts ci), as 'ci' reasons. A drug-level item is left to
     cautionsFor, so it is not listed twice. */
  function productBlocks(a, p) {
    var out = [], b = obj(tx(a).baseline), d = T.drug(p && p.drug) || {};
    (p && Array.isArray(p.ci) ? p.ci : []).forEach(function (id) {
      if ((d.ci || []).indexOf(id) >= 0) return;
      var c = AA.byId('txCautions', id) || { id: id, t: id };
      if (!cautionFits(a, c)) return;
      var ans = answerOf(a, b.ci, c, b);
      if (ans.v === 'yes') out.push(reason('ci', 'Contraindicated with ' + p.name + ': ' + c.t + fromWhere(ans) + '.', c.src || (p.name + ' SmPC section 4.3'), { id: id, product: p.id }));
    });
    return out;
  }
  /* The combined CYP3A4 item of older records (ci_cyp3a4, inhibitor or inducer) counts only while neither of the
     two items that replaced it has an answer. */
  var CYP3A4_INH = ['ci_cyp3a4_inh', 'ci_cyp3a4_inhib', 'ci_cyp3a4_inhibitor'];
  var CYP3A4_IND = ['ci_cyp3a4_ind', 'ci_cyp3a4_induc', 'ci_cyp3a4_inducer'];
  function cyp3a4Legacy(a) {
    return yes(a, 'ci_cyp3a4') && CYP3A4_INH.concat(CYP3A4_IND).every(function (id) { return T.ciAnswer(a, id).v === null; });
  }
  /* Checklist behind baselineVerdict and stepProgress: [{key, label, done, group}] */
  function baselineChecklist(a, verdictBits) {
    var b = obj(tx(a).baseline), young = T.group(a) === 'young', age = T.age(a);
    var rows = [];
    function add(key, label, done, group) { rows.push({ key: key, label: label, done: !!done, group: group || null }); }
    add('date', 'Date of the checks', b.date);
    add('bp', 'Blood pressure', num(b.sbp) !== null && num(b.dbp) !== null);
    if (young) add('centile', 'Blood pressure centile (from the chart)', b.bpCentile);
    add('pulse', 'Pulse', num(b.pulse) !== null);
    add('height', 'Height', num(b.heightCm) !== null);
    add('weight', 'Weight', num(b.weightKg) !== null);
    T.cardiacItems(a).forEach(function (c) { add('cx.' + c.id, c.t, answerOf(a, b.cardiac, c).v, 'cardiac'); });
    var cautions = T.cautionItems(a);
    if (cautions.length) add('ci', 'Contraindication and caution screen', cautions.every(function (c) { return answerOf(a, b.ci, c, b).v; }));
    add('meds', 'Current medicines, including over-the-counter and illicit', String(b.meds || '').trim());
    add('misuse', 'Misuse and diversion risk', b.misuse);
    if (!young || (age !== null && age >= 12)) add('pregnancy', 'Pregnancy and contraception', b.pregnancy);
    if (!young || (age !== null && age >= 17)) add('driving', 'Driving', b.driving);
    if (verdictBits) {
      if (verdictBits.needAbpm) add('abpm', 'ABPM or HBPM result', b.abpm === 'normal' || b.abpm === 'hypertensive');
      if (verdictBits.needEcg) add('ecg', 'ECG result', b.ecg === 'normal' || b.ecg === 'abnormal');
      if (verdictBits.needCardiology) add('cardiology', 'Cardiology or specialist opinion', b.cardiology === 'referred' || b.cardiology === 'cleared');
    }
    return rows;
  }

  T.baselineVerdict = function (a) {
    var b = obj(tx(a).baseline), reasons = [], bits = { needAbpm: false, needEcg: false, needCardiology: false };
    var cleared = b.cardiology === 'cleared';

    /* Heart history (1.7.5) and ECG items (1.7.4) */
    var cardioHits = [], ecgHits = [];
    T.cardiacItems(a).forEach(function (c) {
      var ans = answerOf(a, b.cardiac, c);
      if (ans.v !== 'yes') return;
      var label = c.t + fromWhere(ans);
      if (c.action === 'ecg') ecgHits.push({ c: c, label: label }); else cardioHits.push({ c: c, label: label });
    });
    if (cardioHits.length) {
      bits.needCardiology = true;
      if (cleared) reasons.push(reason('ok', 'Cardiology opinion recorded as cleared to start, for: ' + cardioHits.map(function (x) { return x.label; }).join('; ') + '.', nice('1.7.5')));
      else reasons.push(reason('cardiology', 'Heart history: ' + cardioHits.map(function (x) { return x.label; }).join('; ') + '. Get a cardiology opinion before starting ADHD medicine' + (b.cardiology === 'referred' ? ' (referred: wait for the opinion).' : '.') + ' The cardiology assessment will include an ECG.', uniq(cardioHits.map(function (x) { return x.c.src; })).join('; ') || nice('1.7.4–1.7.5')));
    }
    if (ecgHits.length) {
      bits.needEcg = true;
      var ecgFor = ecgHits.map(function (x) { return x.label; }).join('; ');
      if (b.ecg === 'normal') reasons.push(reason('ok', 'ECG done and normal for: ' + ecgFor + '.', nice('1.7.4')));
      else if (cleared && b.ecg !== 'abnormal') reasons.push(reason('ok', 'Cardiology opinion recorded as cleared to start. Record the ECG result for: ' + ecgFor + '.', nice('1.7.4')));
      else if (b.ecg !== 'abnormal') reasons.push(reason('ecg', 'Do an ECG before starting: ' + ecgFor + '.', uniq(ecgHits.map(function (x) { return x.c.src; })).join('; ') || nice('1.7.4')));
    }
    if (b.ecg === 'abnormal') {
      bits.needCardiology = true;
      if (!cleared) reasons.push(reason('cardiology', 'The ECG is abnormal: get a cardiology opinion before starting.', 'Clinical practice; ' + nice('1.7.4–1.7.5')));
    }

    /* Blood pressure and pulse */
    var bp = T.bpCheck(a, b);
    if (bp.level === 'urgent') reasons.push(reason('stop', bp.text, bp.src));
    else if (bp.level === 'refer') {
      bits.needCardiology = true;
      if (cleared) reasons.push(reason('ok', 'Blood pressure: specialist opinion recorded as cleared to start.', bp.src));
      else reasons.push(reason('cardiology', bp.text, bp.src));
    } else if (bp.level === 'confirm') { bits.needAbpm = true; reasons.push(reason('caution', bp.text, bp.src)); }
    else if (bp.level === 'repeat') reasons.push(reason('caution', bp.text, bp.src));
    else if (bp.level === 'ok') reasons.push(reason('ok', 'Blood pressure: ' + bp.text, bp.src));
    if (bp.pulse) reasons.push(reason('caution', bp.pulse.text, bp.pulse.src));

    /* Contraindication and caution screen. A pregnancy item answered by the pregnancy question is covered by
       the pregnancy line below, so it is not repeated here. */
    T.cautionItems(a).forEach(function (c) {
      var ans = answerOf(a, b.ci, c, b);
      if (ans.v !== 'yes' || ans.fromPregnancy) return;
      var who = cautionDrugs(c.id), parts = [], extra = '';
      if (who.ci.length) parts.push('rules out ' + who.ci.join(', '));
      if (who.caution.length) parts.push('use with care: ' + who.caution.join(', '));
      if (c.id === 'ci_hepatic') {
        var hc = hepaticClass(a);
        extra = hc ? ' Child-Pugh class ' + hc + (hc === 'A' ? ': no atomoxetine dose change in the SmPC.' : ': atomoxetine starting and target doses at ' + (hc === 'C' ? '25%' : '50%') + '.')
          : ' Record the Child-Pugh class: atomoxetine starting and target doses are 50% for class B and 25% for class C.';
      }
      reasons.push(reason('caution', c.t + fromWhere(ans) + ': ' + (parts.length ? parts.join('; ') + '.' : 'check each medicine\'s SmPC.') + extra, c.src || 'SmPC section 4.3–4.4'));
    });
    if (cyp3a4Legacy(a)) {
      reasons.push(reason('caution', 'An older answer says a CYP3A4 inhibitor or inducer is taken, without saying which. Answer the two CYP3A4 questions: guanfacine is halved with an inhibitor and may need re-titration with an inducer.', 'Intuniv SmPC sections 4.2, 4.5'));
    }

    /* Safety step: an urgent risk item stops treatment until it is acted on; a high-level item is a caution. */
    var risk = obj(a && a.risk);
    riskItems(a).forEach(function (it) {
      if (risk[it.id] !== true) return;
      var label = it.short || it.text || it.id;
      if (it.level === 'urgent') reasons.push(reason('stop', 'Safety step: ' + label + '. Act on this before starting ADHD medicine.', 'Safety and risk step; ' + nice('1.7.4') + '; clinical practice'));
      else if (it.level === 'high') reasons.push(reason('caution', 'Safety step: ' + label + '. Review it before starting ADHD medicine.', 'Safety and risk step; ' + nice('1.7.4') + '; clinical practice'));
    });

    /* Misuse, pregnancy, driving */
    if (b.misuse === 'moderate' || b.misuse === 'high') {
      reasons.push(reason('caution', 'Risk of misuse or diversion: be cautious with stimulants. Do not offer immediate-release stimulants, or modified-release stimulants that can easily be injected or snorted.', nice('1.7.23–1.7.24')));
    }
    if (b.pregnancy === 'pregnant' || b.pregnancy === 'planning' || b.pregnancy === 'breastfeeding') {
      reasons.push(reason('caution', { pregnant: 'Pregnant', planning: 'Planning a pregnancy', breastfeeding: 'Breastfeeding' }[b.pregnancy] + ': NICE NG87 does not cover this. Check each medicine\'s SmPC (section 4.6), get advice from UKTIS or UKDILAS and agree a plan with the person.', 'SmPC section 4.6; UKTIS; UKDILAS'));
    }
    if (b.driving === 'yes') {
      reasons.push(reason('ok', 'Drives: explain that driving while impaired is an offence, that amfetamines (including lisdexamfetamine) are specified drugs with a medical defence, and that the person must tell the DVLA if their driving is affected.', 'Road Traffic Act 1988 s5A; DVLA'));
    }

    var rows = baselineChecklist(a, bits);
    var missing = [], cardiacMissing = 0;
    rows.forEach(function (r) {
      if (r.done) return;
      if (r.group === 'cardiac') cardiacMissing++; else missing.push(r.label);
    });
    if (cardiacMissing) missing.splice(0, 0, 'Heart history questions: ' + cardiacMissing + ' not answered');

    var has = function (lv) { return reasons.some(function (x) { return x.level === lv; }); };
    var level = has('stop') ? 'stop' : has('cardiology') ? 'cardiology' : has('ecg') ? 'ecg' : missing.length ? 'incomplete' : has('caution') ? 'caution' : 'ok';
    var order = { stop: 0, cardiology: 1, ecg: 2, caution: 3, ok: 4 };
    reasons.sort(function (x, y) { return order[x.level] - order[y.level]; });
    return { level: level, reasons: reasons, missing: missing, done: rows.filter(function (r) { return r.done; }).length, of: rows.length, bp: bp };
  };

  /* ---------------- cautions for one medicine ---------------- */
  /* Pregnancy and breastfeeding lines from SmPC section 4.6 (as checked in the main course).
     A drug record may override them with `pregnancy` / `breastfeeding` text. */
  var PREG = {
    mph: { pregnant: 'Not recommended in pregnancy unless delaying treatment is a greater risk.', breastfeeding: 'Decide whether to stop breastfeeding or not use methylphenidate.' },
    lisdex: { pregnant: 'Use in pregnancy only if the benefit justifies the risk.', breastfeeding: 'Should not be used while breastfeeding.' },
    dex: { pregnant: 'Not recommended in pregnancy; stop when a pregnancy is planned.', breastfeeding: 'Decide whether to stop breastfeeding or not use dexamfetamine.' },
    atx: { pregnant: 'Use in pregnancy only if the benefit justifies the risk.', breastfeeding: 'Avoid while breastfeeding.' },
    gxr: { pregnant: 'Not recommended in pregnancy, or in anyone who could become pregnant and is not using contraception.', breastfeeding: 'Decide whether to stop breastfeeding or not use guanfacine.' }
  };
  T.cautionsFor = function (a, drugId) {
    var d = T.drug(drugId), out = [];
    if (!d) return out;
    var b = obj(tx(a).baseline), age = T.age(a);
    function push(id, level, text, src) { out.push(new Item({ id: id, t: text, text: text, level: level, src: src || '' })); }
    /* Screen items that apply at this age. A pregnancy item answered by the pregnancy question is covered by
       the medicine's own pregnancy or breastfeeding line below. */
    function screened(id, level) {
      var c = AA.byId('txCautions', id) || { id: id, t: id };
      if (!cautionFits(a, c)) return;
      var ans = answerOf(a, b.ci, c, b);
      if (ans.v === 'yes' && !ans.fromPregnancy) push(id, level, c.t + fromWhere(ans), c.src || (d.src || []).join('; '));
    }
    (d.ci || []).forEach(function (id) { screened(id, 'ci'); });
    (d.caution || []).forEach(function (id) { if ((d.ci || []).indexOf(id) < 0) screened(id, 'caution'); });
    if ((d.caution || []).concat(d.ci || []).some(function (id) { return /^ci_cyp3a4_/.test(id); }) && cyp3a4Legacy(a)) {
      push('ci_cyp3a4', 'caution', 'Takes a CYP3A4 inhibitor or inducer (older answer that does not say which: answer the two CYP3A4 questions)', 'Intuniv SmPC sections 4.2, 4.5');
    }
    var pg = PREG[drugId] || {};
    var advice = ' Get advice from UKTIS or UKDILAS. In an unplanned pregnancy do not stop suddenly: arrange a specialist review.';
    if (b.pregnancy === 'pregnant' || b.pregnancy === 'planning') {
      push('preg_' + b.pregnancy, 'caution', (b.pregnancy === 'planning' ? 'Planning a pregnancy. ' : 'Pregnant. ') + (d.pregnancy || pg.pregnant || 'Check SmPC section 4.6.') + advice, 'SmPC section 4.6; UKTIS');
    } else if (b.pregnancy === 'breastfeeding') {
      push('preg_breastfeeding', 'caution', 'Breastfeeding. ' + (d.breastfeeding || pg.breastfeeding || 'Check SmPC section 4.6.') + ' Get advice from UKDILAS.', 'SmPC section 4.6; UKDILAS');
    }
    if (drugId === 'gxr' && (b.pregnancy === 'no') && b.contraception !== true) {
      push('preg_contraception', 'caution', 'Guanfacine is not recommended for anyone who could become pregnant and is not using contraception. Discuss contraception.', 'SmPC section 4.6');
    }
    if (isStimulant(d) && (b.misuse === 'moderate' || b.misuse === 'high')) {
      push('misuse_risk', 'caution', 'Risk of misuse or diversion (' + b.misuse + '): be cautious with stimulants; no immediate-release stimulants or easily injected or snorted modified-release ones.', nice('1.7.23–1.7.24'));
    }
    if (age !== null && age >= 60) {
      push('older_adult', 'caution', 'Age ' + age + ': ADHD medicines have little or no data in older adults, and some product information says not to use them. Check SmPC section 4.2.', 'SmPC section 4.2');
    }
    return out;
  };

  /* ---------------- NICE sequence ---------------- */
  T.SEQUENCE = {
    young: [
      { n: 1, drugs: ['mph'], when: 'First choice: short- or long-acting methylphenidate', clause: '1.7.7' },
      { n: 2, drugs: ['lisdex'], when: 'After a 6-week trial of methylphenidate at an adequate dose that did not help enough', clause: '1.7.8' },
      { n: 3, drugs: ['dex'], when: 'If lisdexamfetamine helps but its longer effect cannot be tolerated', clause: '1.7.9' },
      { n: 4, drugs: ['atx', 'gxr'], when: 'If methylphenidate or lisdexamfetamine cannot be tolerated, or neither helped after separate 6-week trials', clause: '1.7.10' },
      { n: 5, drugs: [], action: 'tertiary', when: 'No response to one or more stimulants and one non-stimulant: second opinion or tertiary referral', clause: '1.7.16' }
    ],
    adult: [
      { n: 1, drugs: ['lisdex', 'mph'], when: 'First choice: lisdexamfetamine or methylphenidate, as a shared decision', clause: '1.7.11' },
      { n: 2, drugs: ['lisdex', 'mph'], when: 'Switch to the other one after a 6-week trial at an adequate dose that did not help enough', clause: '1.7.12–1.7.13' },
      { n: 3, drugs: ['dex'], when: 'If lisdexamfetamine helps but its longer effect cannot be tolerated (off-label in adults)', clause: '1.7.14' },
      { n: 4, drugs: ['atx'], when: 'If lisdexamfetamine or methylphenidate cannot be tolerated, or neither helped after separate 6-week trials', clause: '1.7.15' },
      { n: 5, drugs: [], action: 'tertiary', when: 'No response to one or more stimulants and one non-stimulant: second opinion or tertiary referral. Guanfacine and other medicines only with tertiary advice', clause: '1.7.16–1.7.17' }
    ]
  };

  /* What has been tried, from treatment.prior. */
  function priorList(a) { var prior = obj(tx(a).prior); return Object.keys(prior).map(function (k) { return obj(prior[k]); }).filter(function (p) { return !!p.drug; }); }
  function priorState(a) {
    var st = {};
    function s(id) { return st[id] || (st[id] = { tried: false, worked: false, intolerant: false, failed: false, inadequate: false, stoppedOther: false, outcomes: [] }); }
    priorList(a).forEach(function (p) {
      var x = s(p.drug); x.tried = true; x.outcomes.push(p.outcome || null);
      if (p.outcome === 'worked') x.worked = true;
      else if (p.outcome === 'not_tolerated') x.intolerant = true;
      else if (p.outcome === 'no_response' || p.outcome === 'partial') { if (p.adequate === true) x.failed = true; else x.inadequate = true; }
      else if (p.outcome === 'stopped_other') x.stoppedOther = true;
      else x.inadequate = x.inadequate || !p.outcome;   /* outcome not recorded yet */
    });
    ['mph', 'lisdex', 'dex', 'atx', 'gxr'].forEach(s);
    return st;
  }
  function finished(x) { return x.worked || x.failed || x.intolerant; }
  function triedStatus(x, name) {
    if (x.worked) return { status: 'done', why: name + ' helped.' };
    if (x.failed) return { status: 'done', why: name + ': a 6-week trial at an adequate dose did not help enough.' };
    if (x.intolerant) return { status: 'done', why: name + ' was not tolerated.' };
    if (x.inadequate) return { status: 'next', why: name + ': the trial is not complete. Titrate to the best tolerated dose for 6 weeks (and consider another preparation) before moving on.' };
    return { status: 'possible', why: name + ' was stopped for another reason. It can be tried again.' };
  }
  /* Dexamfetamine (1.7.9, 1.7.14): only when lisdexamfetamine HELPED but its longer effect could not be
     tolerated. Not when lisdexamfetamine did not help enough after an adequate trial. */
  function dexAllowed(l) { return l.tried && !l.failed && (l.worked || l.intolerant); }
  function drugStatus(group, id, S) {
    var x = S[id] || { tried: false }, name = drugName(id);
    if (x.tried) return triedStatus(x, name);
    var m = S.mph, l = S.lisdex;
    var nonStimTrigger = m.intolerant || l.intolerant || (m.failed && l.failed);
    var trigWhy = m.failed && l.failed ? 'Neither methylphenidate nor lisdexamfetamine helped enough after separate 6-week trials.' : (m.intolerant ? 'Methylphenidate' : 'Lisdexamfetamine') + ' was not tolerated.';
    if (group === 'young') {
      if (id === 'mph') return { status: 'next', why: 'First choice for children 5 and over and young people.' };
      if (id === 'lisdex') {
        if (m.failed) return { status: 'next', why: 'Methylphenidate did not help enough after an adequate 6-week trial (1.7.8).' };
        if (m.intolerant) return { status: 'possible', why: 'NICE names lisdexamfetamine after too little benefit from methylphenidate (1.7.8). After intolerance, 1.7.10 applies.' };
        return { status: 'blocked', why: m.worked ? 'Methylphenidate is helping: keep optimising it.' : 'Only after a 6-week trial of methylphenidate at an adequate dose that did not help enough (1.7.8).' };
      }
      if (id === 'dex') {
        if (dexAllowed(l)) return { status: 'possible', why: 'Only if lisdexamfetamine helped but its longer effect could not be tolerated (1.7.9).' };
        return { status: 'blocked', why: 'Only for a child or young person who responds to lisdexamfetamine but cannot tolerate its longer effect (1.7.9).' };
      }
      if (id === 'atx' || id === 'gxr') {
        if (nonStimTrigger) return { status: 'next', why: trigWhy + ' Atomoxetine or guanfacine, having considered other preparations and adequate doses (1.7.10).' };
        return { status: 'blocked', why: 'When methylphenidate or lisdexamfetamine cannot be tolerated, or neither helped after separate 6-week trials (1.7.10).' };
      }
    } else {
      if (id === 'mph' || id === 'lisdex') {
        var other = id === 'mph' ? l : m, oname = id === 'mph' ? 'Lisdexamfetamine' : 'Methylphenidate', cl = id === 'mph' ? '1.7.13' : '1.7.12';
        if (!other.tried) return { status: 'next', why: 'First choice for adults, with ' + oname.toLowerCase() + ': a shared decision (1.7.11).' };
        if (other.failed) return { status: 'next', why: oname + ' did not help enough after an adequate 6-week trial: switch (' + cl + ').' };
        if (other.intolerant) return { status: 'possible', why: oname + ' was not tolerated. This is the other first-line choice (1.7.11); atomoxetine is also an option (1.7.15).' };
        if (other.worked) return { status: 'blocked', why: oname + ' is helping: keep optimising it.' };
        if (other.inadequate) return { status: 'blocked', why: 'Finish an adequate 6-week trial of ' + oname.toLowerCase() + ' first (' + cl + ').' };
        return { status: 'possible', why: 'The other first-line choice (1.7.11).' };
      }
      if (id === 'dex') {
        if (dexAllowed(l)) return { status: 'possible', why: 'Only if lisdexamfetamine helped but its longer effect could not be tolerated (1.7.14). Off-label in adults.' };
        return { status: 'blocked', why: 'Only for an adult who responds to lisdexamfetamine but cannot tolerate its longer effect (1.7.14).' };
      }
      if (id === 'atx') {
        if (nonStimTrigger) return { status: 'next', why: trigWhy + ' Offer atomoxetine, having considered other preparations and adequate doses (1.7.15).' };
        return { status: 'blocked', why: 'When lisdexamfetamine or methylphenidate cannot be tolerated, or neither helped after separate 6-week trials (1.7.15).' };
      }
      if (id === 'gxr') return { status: 'tertiary', why: 'Adults: guanfacine only with advice from a tertiary ADHD service (1.7.17).' };
    }
    return { status: 'possible', why: 'Not in the NICE sequence for this age: specialist advice.' };
  }
  /* NICE NG87 1.7.16: symptoms unresponsive to one or more stimulants and one non-stimulant, that is no
     response after an adequate trial. Intolerance leads to the other NICE options (1.7.10, 1.7.15), not here. */
  function tertiaryTrigger(S) {
    var stim = ['mph', 'lisdex', 'dex'].some(function (k) { return S[k].failed; });
    var non = ['atx', 'gxr'].some(function (k) { return S[k].failed; });
    return stim && non;
  }
  /* Both classes could not be tolerated (or one failed and the other was not tolerated): clinical practice. */
  function bothClassesStopped(S) {
    var stim = ['mph', 'lisdex', 'dex'].some(function (k) { return S[k].failed || S[k].intolerant; });
    var non = ['atx', 'gxr'].some(function (k) { return S[k].failed || S[k].intolerant; });
    return stim && non;
  }

  T.options = function (a) {
    var group = T.group(a);
    if (group === 'under6') return [];
    var seqData = data('txSequence');
    var seq = seqData && Array.isArray(seqData[group]) && seqData[group].length ? seqData[group] : T.SEQUENCE[group];
    seq = seq.filter(function (step) { return T.forAge(a, step); });
    var S = priorState(a), tert = tertiaryTrigger(S), soft = !tert && bothClassesStopped(S);
    var working = ['mph', 'lisdex', 'dex', 'atx', 'gxr'].filter(function (k) { return S[k].worked; });
    var cur = obj(tx(a).choice).drug || null;
    var rank = { next: 4, possible: 3, tertiary: 2, blocked: 1, done: 0 };
    return seq.map(function (step, i) {
      var drugs = Array.isArray(step.drugs) ? step.drugs.slice() : [];
      var clause = String(step.clause || '');
      var isTert = step.action === 'tertiary' || !drugs.length;
      var kind = isTert ? 'tertiary' : group === 'adult' && /1\.7\.11/.test(clause) ? 'first' : group === 'adult' && /1\.7\.1[23]/.test(clause) ? 'switch' : 'drugs';
      var status, why, src = null;
      if (kind === 'tertiary') {
        if (tert) { status = 'tertiary'; why = 'At least one stimulant and one non-stimulant did not help after an adequate trial: ask for a second opinion or refer to a tertiary service (1.7.16).'; }
        else if (soft) { status = 'possible'; why = 'A stimulant and a non-stimulant were stopped because they could not be tolerated (or did not help). Clinical practice: consider specialist or tertiary advice if the remaining NICE options are also unsuitable.'; src = 'Clinical practice'; }
        else { status = 'blocked'; why = 'If there is no response to one or more stimulants and one non-stimulant (1.7.16). Medicines outside the NICE list only with tertiary advice (1.7.17).'; }
      } else if (kind === 'first') {
        var triedK = drugs.filter(function (k) { return S[k] && S[k].tried; });
        var running = triedK.filter(function (k) { return !finished(S[k]) && S[k].inadequate; });
        if (!triedK.length) { status = 'next'; why = 'Choose lisdexamfetamine or methylphenidate with the person (1.7.11).'; }
        else if (running.length && !triedK.some(function (k) { return finished(S[k]); })) { status = 'next'; why = triedStatus(S[running[0]], drugName(running[0])).why; }
        else { status = 'done'; why = 'First-line medicine already tried: ' + triedK.map(drugName).join(' and ') + '.'; }
      } else {
        var anyTriedHere = drugs.some(function (k) { return S[k] && S[k].tried; });
        /* A switch step is about the medicine not yet tried. */
        var consider = kind === 'switch' && anyTriedHere && drugs.some(function (k) { return !S[k] || !S[k].tried; }) ? drugs.filter(function (k) { return !S[k] || !S[k].tried; }) : drugs;
        var sts = consider.map(function (k) { return { k: k, r: drugStatus(group, k, S) }; });
        if (kind === 'switch' && !anyTriedHere) {
          status = 'blocked'; why = 'After a 6-week trial of the first choice at an adequate dose that did not help enough (1.7.12–1.7.13).';
        } else if (sts.every(function (x) { return x.r.status === 'done'; })) {
          status = 'done'; why = uniq(sts.map(function (x) { return x.r.why; })).join(' ');
        } else {
          var open = sts.filter(function (x) { return x.r.status !== 'done'; });
          var best = open.reduce(function (m, x) { return rank[x.r.status] > rank[m] ? x.r.status : m; }, 'blocked');
          status = best;
          why = uniq(open.filter(function (x) { return x.r.status === best; }).map(function (x) { return x.r.why; })).join(' ');
        }
        if (status === 'next' && (tert || working.length)) {
          status = 'possible';
          why += tert ? ' A second opinion or tertiary referral is now advised (1.7.16).' : ' ' + working.map(drugName).join(' and ') + ' helped, so this is not needed unless that changes.';
        }
      }
      var label = isTert ? 'Second opinion or tertiary referral' : drugs.map(function (k, j) { var n = drugName(k); return j ? n.toLowerCase() : n; }).join(' or ');
      return {
        n: step.n || i + 1, drugs: drugs, label: step.label || label, when: step.when || '', clause: clause,
        status: status, why: why, action: isTert ? 'tertiary' : step.action || null,
        current: !!cur && drugs.indexOf(cur) >= 0, src: src || step.src || (clause ? nice(clause) : '')
      };
    });
  };

  /* ---------------- products and licences ---------------- */
  function continuing(a, p) {
    var prior = obj(tx(a).prior), ch = obj(tx(a).choice);
    if (ch.product === p.id && ch.continuing === true) return true;
    return Object.keys(prior).some(function (k) { var x = obj(prior[k]); return x.product === p.id && x.outcome === 'worked'; });
  }
  /* Licence conditions in SmPC section 4.1 that depend on earlier treatment or on the history. A product may
     set its own in licensed.conditions ({ child, adult }: a condition id, or null for none); otherwise these
     defaults by medicine apply. */
  var LIC_COND = {
    young: { lisdex: 'mph_inadequate', dex: 'mph_inadequate', gxr: 'stim_unsuitable' },
    adult: { lisdex: 'childhood_symptoms', atx: 'childhood_symptoms' }
  };
  var LIC_TEXT = {
    mph_inadequate: 'a clinically inadequate response to methylphenidate',
    stim_unsuitable: 'stimulants that are unsuitable, not tolerated or not effective',
    childhood_symptoms: 'ADHD symptoms that were present in childhood'
  };
  function licenceCondition(a, p, group) {
    var L = obj(p.licensed), own = obj(L.conditions), key = group === 'young' ? 'child' : 'adult';
    var cond = Object.prototype.hasOwnProperty.call(own, key) ? own[key] : obj(LIC_COND[group])[p.drug];
    if (!cond) return null;
    var pr = priorList(a), out = { id: cond, text: LIC_TEXT[cond] || String(cond), state: 'unconfirmed', note: '', src: 'SmPC section 4.1' };
    if (cond === 'mph_inadequate') {
      if (p.drug === 'dex' && pr.some(function (x) { return x.drug === 'lisdex' && x.outcome === 'not_tolerated'; })) {
        out.state = 'not_met';
        out.note = 'Off-label use: dexamfetamine is not licensed for a child or young person who responded to lisdexamfetamine but could not tolerate it. Explain this to the young person and their family and record the reason.';
        out.src = 'SmPC section 4.1; ' + nice('1.7.9') + ' (footnote)';
        return out;
      }
      if (pr.some(function (x) { return x.drug === 'mph' && ['no_response', 'partial', 'not_tolerated'].indexOf(x.outcome) >= 0; })) out.state = 'met';
    } else if (cond === 'stim_unsuitable') {
      if (obj(tx(a).choice).stimulantsUnsuitable === true || pr.some(function (x) { return ['mph', 'lisdex', 'dex'].indexOf(x.drug) >= 0 && ['no_response', 'partial', 'not_tolerated', 'stopped_other'].indexOf(x.outcome) >= 0; })) out.state = 'met';
    } else if (cond === 'childhood_symptoms') {
      if (continuing(a, p)) out.state = 'met';
      else {
        var B = typeof D().criterionB === 'function' ? D().criterionB(a) : null;
        if (B && B.status === 'met') out.state = 'met';
        else if (B && B.status === 'not-met') { out.state = 'not_met'; out.src = 'SmPC section 4.1; ' + nice('1.8.14') + ' (off-label in adults with no ADHD symptoms in childhood)'; }
      }
    }
    if (out.state === 'unconfirmed') out.note = 'Licence condition not confirmed: the licence covers ' + out.text + '. Record it, or treat this as off-label use and record the reason.';
    else if (out.state === 'not_met' && !out.note) out.note = 'Off-label use: the licence covers ' + out.text + ', and that is not what is recorded here. Explain this and record the reason.';
    return out;
  }
  T.licence = function (a, p) {
    var group = T.group(a), L = p && p.licensed, res;
    if (!p) return { licensed: false, licenceNote: 'Product not found.', src: '' };
    if (group === 'under6') return { licensed: false, licenceNote: 'No ADHD medicine is licensed under 6. Refer to a specialist service.', src: 'SmPC section 4.1' };
    if (T.age(a) === null) return { licensed: false, licenceNote: AGE_MSG, ageMissing: true, src: AGE_SRC };
    if (!L || typeof L !== 'object') return { licensed: false, licenceNote: 'Licence not recorded: check the SmPC.', src: 'SmPC section 4.1' };
    if (group === 'young') {
      res = L.child === true ? { licensed: true, licenceNote: '' } : { licensed: false, licenceNote: 'Not licensed under 18: off-label use. Explain this to the young person and their family and record the reason.' };
    } else if (L.adultStart === true) res = { licensed: true, licenceNote: '' };
    else if (L.adultContinue === true) {
      res = continuing(a, p) ? { licensed: true, licenceNote: 'Licensed to continue in adults when treatment began in childhood.' }
        : { licensed: false, licenceNote: 'Licensed in adults only to continue treatment that began in childhood. Starting it in an adult is off-label.' };
    } else res = { licensed: false, licenceNote: 'Not licensed in adults: off-label use. Explain this to the person and record the reason.' };
    res.src = 'SmPC section 4.1';
    if (res.licensed) {
      var c = licenceCondition(a, p, group);
      if (c) {
        res.condition = c;
        if (c.state !== 'met') { res.licensed = false; res.licenceNote = c.note; res.src = c.src; res.conditionUnconfirmed = c.state === 'unconfirmed'; }
      }
    }
    return res;
  };
  /* Immediate release: the product's own ir flag when it has one; otherwise read the release text. */
  function isIR(p) {
    if (typeof p.ir === 'boolean') return p.ir;
    return /immediate/i.test(String(p.release || '') + ' ' + String(p.form || '')) || /\bIR\b/.test(p.name || '');
  }

  T.products = function (a, drugId) {
    var d = T.drug(drugId), group = T.group(a), b = obj(tx(a).baseline);
    var risk = b.misuse === 'moderate' || b.misuse === 'high';
    var cautions = T.cautionsFor(a, drugId);
    var rows = list('txProducts').filter(function (p) { return p.drug === drugId; }).map(function (p, i) {
      var lic = T.licence(a, p), blocked = [], cs = [];
      if (group === 'under6') blocked.push(reason('ci', 'Under 6: no ADHD medicine in this tool. Refer to a specialist service.', 'This tool\'s scope; SmPC section 4.1'));
      cautions.forEach(function (c) {
        if (c.level === 'ci') blocked.push(reason('ci', 'Contraindicated: ' + c.t + '.', c.src, { id: c.id }));
        else cs.push(reason('caution', c.t, c.src, { id: c.id }));
      });
      productBlocks(a, p).forEach(function (x) { blocked.push(x); });
      if (risk && isStimulant(d)) {
        if (isIR(p)) blocked.push(reason('ci', 'Immediate-release stimulant with a risk of misuse or diversion: do not offer.', nice('1.7.24')));
        else if (p.diversionLower === false) blocked.push(reason('ci', 'Modified-release stimulant that is easier to inject or snort, with a risk of misuse or diversion: do not offer.', nice('1.7.24')));
        else if (p.diversionLower !== true) cs.push(reason('caution', 'Risk of misuse or diversion: check whether this product can easily be injected or snorted.', nice('1.7.24')));
      }
      if (group === 'adult' && drugId === 'gxr') cs.push(reason('caution', 'Adults: guanfacine only with advice from a tertiary ADHD service.', nice('1.7.17')));
      if (!lic.licensed && lic.licenceNote) cs.push(reason('caution', lic.licenceNote, lic.src || 'SmPC section 4.1'));
      return { p: p, id: p.id, licensed: lic.licensed, licenceNote: lic.licenceNote, licence: lic, offLabel: !lic.licensed, blocked: blocked, cautions: cs, notes: Array.isArray(p.notes) ? p.notes.slice() : [], _i: i };
    });
    rows.sort(function (x, y) {
      var rx = (x.blocked.length ? 2 : 0) + (x.licensed ? 0 : 1), ry = (y.blocked.length ? 2 : 0) + (y.licensed ? 0 : 1);
      return rx - ry || x._i - y._i;
    });
    rows.forEach(function (r) { delete r._i; });
    return rows;
  };

  /* ---------------- making a dose from the strengths ---------------- */
  function unitNoun(p) {
    var f = lc(p.form);
    if (/solution|liquid|suspension/.test(f)) return 'ml';
    if (/capsule/.test(f)) return 'capsule';
    if (/tablet/.test(f)) return 'tablet';
    return 'unit';
  }
  function strengthsOf(p) { return (p.strengths || []).map(num).filter(function (x) { return x !== null && x > 0; }); }
  /* Closest daily dose that one or two units of the available strengths can make (ties: fewer units, then lower dose). */
  function strengthCands(strengths) {
    var ss = (strengths || []).map(num).filter(function (x) { return x !== null && x > 0; }).sort(function (x, y) { return x - y; });
    var cands = [];
    ss.forEach(function (s, i) {
      cands.push({ dose: s, units: [s] });
      for (var j = i; j < ss.length; j++) cands.push({ dose: s + ss[j], units: [ss[j], s] });
    });
    return cands;
  }
  function candText(c, noun) { return c.units.length === 1 ? 'one ' + c.units[0] + ' mg ' + noun : (c.units[0] === c.units[1] ? 'two ' + c.units[0] + ' mg ' + noun + 's' : 'one ' + c.units[0] + ' mg and one ' + c.units[1] + ' mg ' + noun); }
  T.roundToStrengths = function (mg, strengths, noun) {
    noun = noun || 'capsule';
    var cands = strengthCands(strengths);
    if (!cands.length || !(mg > 0)) return null;
    cands.sort(function (x, y) {
      return Math.abs(x.dose - mg) - Math.abs(y.dose - mg) || x.units.length - y.units.length || x.dose - y.dose;
    });
    var c = cands[0];
    return { dose: c.dose, units: c.units, text: candText(c, noun) };
  };
  /* The largest dose not above mg that one or two units can make (ties: fewer units). Null when even the
     smallest unit is above mg. Used for targets and maxima, which must not be exceeded. */
  T.roundDownToStrengths = function (mg, strengths, noun) {
    noun = noun || 'capsule';
    var cands = strengthCands(strengths).filter(function (c) { return c.dose <= mg + 1e-9; });
    if (!cands.length || !(mg > 0)) return null;
    cands.sort(function (x, y) { return y.dose - x.dose || x.units.length - y.units.length; });
    var c = cands[0];
    return { dose: c.dose, units: c.units, text: candText(c, noun) };
  };
  /* One administration from the strengths: whole units of up to two strengths (at most 4 units), with halves
     of a scored tablet when allowed. Picks the fewest pieces (a half counts as one), then no halves, then one
     strength, then fewer tablets. -> [{s, n}] or null. */
  function makeDose(mg, strengths, scored) {
    var ss = (strengths || []).map(num).filter(function (x) { return x !== null && x > 0; }).sort(function (x, y) { return y - x; });
    if (!ss.length || !(mg > 0)) return null;
    var step = scored ? 0.5 : 1, best = null;
    function cmp(x, y) { for (var i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] - y[i]; return 0; }
    function consider(parts) {
      var total = 0, pieces = 0, halves = 0, tabs = 0;
      parts.forEach(function (x) { total += x.s * x.n; pieces += Math.ceil(x.n); if (x.n % 1 !== 0) halves++; tabs += x.n; });
      if (Math.abs(total - mg) > 1e-9) return;
      var score = [pieces, halves, parts.length, tabs];
      if (!best || cmp(score, best.score) < 0) best = { parts: parts, score: score };
    }
    for (var i = 0; i < ss.length; i++) {
      for (var n1 = step; n1 <= 4 + 1e-9; n1 += step) {
        consider([{ s: ss[i], n: n1 }]);
        for (var j = i + 1; j < ss.length; j++) for (var n2 = step; n1 + n2 <= 4 + 1e-9; n2 += step) consider([{ s: ss[i], n: n1 }, { s: ss[j], n: n2 }]);
      }
    }
    return best ? best.parts : null;
  }
  function hasHalf(parts) { return (parts || []).some(function (x) { return x.n % 1 !== 0; }); }
  function gcd(x, y) { x = Math.round(x * 100); y = Math.round(y * 100); while (y) { var t = y; y = x % y; x = t; } return x / 100; }
  /* How many doses a day a product may be given in: its SmPC schedules for both age groups, plus 1 to 3 for
     immediate release ("divided doses, usually 2 to 3"; start "once or twice daily") and 1 or 2 for
     atomoxetine (once daily, or two evenly divided doses). A product may list perDayOptions. */
  function allowedPerDay(p) {
    var set = [];
    function add(n) { n = num(n); if (n && set.indexOf(n) < 0) set.push(n); }
    var ds = obj(p.dose);
    add(obj(ds.child).perDay); add(obj(ds.adult).perDay);
    (Array.isArray(p.perDayOptions) ? p.perDayOptions : []).forEach(add);
    if (isIR(p)) [1, 2, 3].forEach(add);
    if (p.drug === 'atx') [1, 2].forEach(add);
    if (!set.length) set.push(1);
    return set.sort(function (x, y) { return x - y; });
  }
  function perWord(n) { return n === 1 ? 'once a day' : n === 2 ? 'twice a day' : T.words(n) + ' times a day'; }
  function allowedText(set) { return set.length === 1 ? perWord(set[0]) : set.length === 2 && set[0] === 1 && set[1] === 2 ? 'once or twice a day' : set[0] + ' to ' + set[set.length - 1] + ' times a day'; }
  /* Units for unequal doses: the best units for each dose (fewest pieces), unless one strength can give every
     dose with no more halves and at most one extra piece in the day (one item on the prescription instead of
     two). -> [[{s, n}]] or null. */
  function makeDoses(doses, ss, scored) {
    var step = scored ? 0.5 : 1, best = null;
    function score(parts) {
      var pieces = 0, halves = 0;
      parts.forEach(function (dose) { dose.forEach(function (x) { pieces += Math.ceil(x.n); if (x.n % 1 !== 0) halves++; }); });
      return { pieces: pieces, halves: halves };
    }
    var each = doses.map(function (x) { return makeDose(x, ss, scored); });
    var mixed = each.some(function (x) { return !x; }) ? null : each, ms = mixed ? score(mixed) : null;
    ss.slice().sort(function (x, y) { return y - x; }).forEach(function (s) {
      var parts = doses.map(function (x) { var n = x / s; return Math.abs(n / step - Math.round(n / step)) < 1e-9 && n >= step - 1e-9 && n <= 4 + 1e-9 ? [{ s: s, n: Math.round(n / step) * step }] : null; });
      if (parts.some(function (x) { return !x; })) return;
      var sc = score(parts);
      if (!best || sc.halves < best.sc.halves || (sc.halves === best.sc.halves && sc.pieces < best.sc.pieces)) best = { parts: parts, sc: sc };
    });
    if (best && (!ms || (best.sc.halves <= ms.halves && best.sc.pieces <= ms.pieces + 1))) return best.parts;
    return mixed;
  }
  /* How a daily dose is given: {perDay, doses: [mg per administration, morning first], made: [[{s, n}]],
     equal, halves, text}. In order: equal doses with whole units; for immediate release in 2 doses, a larger
     morning dose with whole units; equal doses with half tablets (scored tablets only); unequal doses with half
     tablets; then, only when the prescriber did not set the number of doses, 3 equal doses of an immediate-
     release product. Liquids can give any dose. null when the strengths cannot make it. */
  function regimen(p, daily, perDay, flex) {
    if (!(daily > 0) || !(perDay >= 1)) return null;
    var noun = unitNoun(p), usual = perDay;
    function done(r) { r.text = r.equal ? (r.perDay === usual ? '' : 'in ' + r.perDay + ' doses of ' + fmt(r.doses[0]) + ' mg') : r.doses.map(fmt).join(' mg + ') + ' mg'; return r; }
    if (noun === 'ml') return done({ perDay: perDay, doses: rep(r2(daily / perDay), perDay), made: null, equal: true, halves: false });
    var ss = strengthsOf(p), scored = p.scored === true && noun === 'tablet', ir = isIR(p);
    function equal(n) {
      var each = daily / n, m = makeDose(each, ss, scored);
      return m ? { perDay: n, doses: rep(r2(each), n), made: rep(m, n), equal: true, halves: hasHalf(m) } : null;
    }
    function unequal(n) {
      if (n !== 2 || !ir || !ss.length) return null;
      var g = ss.reduce(function (x, y) { return gcd(x, y); });
      if (scored) g = g / 2;
      var best = null;
      for (var m = g; m < daily - 1e-9; m = r2(m + g)) {
        if (m <= daily / 2 + 1e-9) continue;
        var rest = r2(daily - m), made = makeDoses([r2(m), rest], ss, scored);
        if (!made) continue;
        var cand = { perDay: 2, doses: [r2(m), rest], made: made, equal: false, halves: made.some(hasHalf) };
        if (!best || (best.halves && !cand.halves)) best = cand;
        if (best && !best.halves) break;
      }
      return best;
    }
    var e = equal(perDay), u = unequal(perDay);
    var r = (e && !e.halves ? e : null) || (u && !u.halves ? u : null) || e || u || (flex && ir && perDay !== 3 ? equal(3) : null);
    return r ? done(r) : null;
  }
  /* Exported for the views: how the daily dose of a product would be given. perDay defaults to the chosen
     number of doses (choice.perDay) or the SmPC schedule for this age. */
  T.regimen = function (a, productId, daily, perDay) {
    var p = T.product(productId); if (!p) return null;
    var ch = obj(tx(a).choice), d = obj(obj(p.dose)[doseKey(a)]);
    var chosen = ch.product === p.id ? num(ch.perDay) : null;
    return regimen(p, num(daily), num(perDay) || chosen || num(d.perDay) || 1, num(perDay) === null && chosen === null);
  };

  /* ---------------- dose plan ---------------- */
  function perDayText(n) { return !n || n === 1 ? 'once a day' : 'a day in ' + n + ' doses'; }
  function stepOf(d) {
    if (typeof d.step === 'number') return { n: d.step, text: d.step + ' mg' };
    if (Array.isArray(d.step) && d.step.length) { var lo = num(d.step[0]), hi = num(d.step[d.step.length - 1]); return { n: lo, text: lo === hi ? lo + ' mg' : lo + '–' + hi + ' mg' }; }
    var s = num(d.step); return s === null ? null : { n: s, text: s + ' mg' };
  }
  function ladder(start, step, max, limit) {
    var out = [], dose = start, wk = 1;
    if (start === null) return out;
    out.push({ week: 1, dose: start });
    if (!step || !(step > 0) || max === null) return out;
    while (out.length < (limit || 12)) {
      dose = r1(dose + step); wk++;
      if (dose > max + 1e-9) break;
      out.push({ week: wk, dose: dose });
    }
    return out;
  }
  /* Guanfacine maximum by age and weight (Intuniv SmPC 4.2 tables). The weight bands are contiguous: a row's
     upper limit is its kgBelow (exclusive), else the next row's kgMin for the same ages (exclusive), else its
     kgMax (inclusive). So 41.45 kg at 14 falls in the 34 to 41.4 kg row, not between rows. */
  function guanfacineMax(table, age, kg) {
    if (!Array.isArray(table) || age === null || kg === null) return null;
    function sameAges(x, y) { return x.ageMin == y.ageMin && x.ageMax == y.ageMax; }   /* eslint-disable-line eqeqeq */
    function upper(t) {
      if (t.kgBelow != null) return { v: num(t.kgBelow), strict: true };
      var nexts = table.filter(function (x) { return x !== t && sameAges(x, t) && x.kgMin != null && (t.kgMin == null || num(x.kgMin) > num(t.kgMin)); }).map(function (x) { return num(x.kgMin); });
      if (nexts.length) return { v: Math.min.apply(null, nexts), strict: true };
      if (t.kgMax != null) return { v: num(t.kgMax), strict: false };
      return null;
    }
    var hits = table.filter(function (t) {
      if (t.ageMin != null && age < t.ageMin) return false;
      if (t.ageMax != null && age > t.ageMax) return false;
      if (t.kgMin != null && kg < num(t.kgMin)) return false;
      var u = upper(t);
      if (u && u.v !== null && (u.strict ? kg >= u.v : kg > u.v)) return false;
      return true;
    });
    hits.sort(function (x, y) { return (y.kgMin || 0) - (x.kgMin || 0); });
    return hits[0] || null;
  }
  /* Off-label ceiling from the BNF/BNFC line (numeric bnfMax first, else "maximum N mg" / "up to N mg" in the
     text; per-kg figures are skipped). */
  function bnfCeiling(p, key) {
    var n = num(obj(p.bnfMax)[key]);
    if (n !== null) return n;
    var m = /(?:maximum|max\.?|up to)\s+(\d+(?:\.\d+)?)\s*mg(?!\s*\/)/i.exec(String(obj(p.bnf)[key] || ''));
    return m ? num(m[1]) : null;
  }
  /* Safety-screen answers that change the dose (SmPC section 4.2). The Child-Pugh class (baseline.childPugh:
     'A' | 'B' | 'C') is asked only when the liver item (ci_hepatic) is yes, so it is read only then. Older
     records may hold ci_hepatic_b / ci_hepatic_c items instead. */
  function hepaticClass(a) {
    if (yesAny(a, ['ci_hepatic_c', 'ci_childpugh_c'])) return 'C';
    if (yesAny(a, ['ci_hepatic_b', 'ci_childpugh_b'])) return 'B';
    if (!yes(a, 'ci_hepatic')) return null;
    var b = obj(tx(a).baseline), c = String(b.childPugh || b.hepaticClass || '').toUpperCase().replace(/^CHILD-PUGH\s*(CLASS\s*)?/, '').trim();
    return c === 'A' || c === 'B' || c === 'C' ? c : null;
  }
  function doseAdjust(a, p) {
    var out = { renal: false, hepatic: null, hepaticKnown: false, hepaticMild: false, cyp2d6: false, cyp3a4inh: false, cyp3a4ind: false, cyp3a4unclear: false };
    if (p.drug === 'lisdex' && yes(a, 'ci_renal')) out.renal = true;
    if (p.drug === 'atx') {
      var hc = hepaticClass(a);
      if (hc === 'A') out.hepaticMild = true;
      else if (hc || yes(a, 'ci_hepatic')) { out.hepatic = hc || 'B'; out.hepaticKnown = !!hc; }
      if (yes(a, 'ci_cyp2d6')) out.cyp2d6 = true;
    }
    if (p.drug === 'gxr') {
      var inh = yesAny(a, CYP3A4_INH), ind = yesAny(a, CYP3A4_IND);
      if (!inh && !ind && cyp3a4Legacy(a)) { out.cyp3a4unclear = true; inh = true; }
      out.cyp3a4inh = inh; out.cyp3a4ind = ind;
    }
    return out;
  }

  T.dosePlan = function (a, productId, weightKg) {
    var p = T.product(productId);
    var res = { start: null, unit: 'mg', perDay: 1, step: null, every: '', max: null, usualMax: null, maxText: '', maxSource: null, bnfText: '', bnfMax: null,
      ceiling: null, soft: null, capLabel: '', target: null, targetPerKg: null, weightBased: false, needWeight: false, fallback: false, ageMissing: false, scheme: null,
      adjust: null, text: '', steps: [], warnings: [], blocked: [], licensed: false, licenceNote: '', rounding: '', note: '' };
    if (!p) { res.text = 'Choose a product first.'; res.warnings.push('Product not found in the treatment data.'); return res; }
    var group = T.group(a), key = doseKey(a), other = key === 'adult' ? 'child' : 'adult';
    var age = T.age(a), kg = num(weightKg); if (kg === null) kg = T.weight(a);
    res.unit = p.unit || 'mg';
    /* No age: no doses, maxima or licence (all depend on it). */
    if (age === null) { res.ageMissing = true; res.text = AGE_MSG; res.licenceNote = AGE_MSG; res.warnings.push(warnItem(AGE_MSG, AGE_SRC)); return res; }
    var lic = T.licence(a, p);
    res.licensed = lic.licensed; res.licenceNote = lic.licenceNote; res.licence = lic;
    if (!lic.licensed && lic.licenceNote) res.warnings.push(warnItem(lic.licenceNote, lic.src || 'SmPC section 4.1'));
    T.cautionsFor(a, p.drug).forEach(function (c) { if (c.level === 'ci') res.blocked.push(reason('ci', 'Contraindicated: ' + c.t + '.', c.src, { id: c.id })); });
    productBlocks(a, p).forEach(function (x) { res.blocked.push(x); });
    if (group === 'under6') res.blocked.push(reason('ci', 'Under 6: no ADHD medicine in this tool. Refer to a specialist service.', 'This tool\'s scope; SmPC section 4.1'));
    if (res.blocked.length) res.warnings.push(warnItem('Do not prescribe: ' + res.blocked.map(String).join(' '), uniq(res.blocked.map(function (x) { return x.src; })).join('; ')));
    if (group === 'adult' && p.drug === 'gxr') res.warnings.push(warnItem('Guanfacine in adults: tertiary advice only (1.7.17).', nice('1.7.17') + '; Intuniv SmPC section 4.2'));

    var doses = obj(p.dose), d = doses[key];
    var groupWord = key === 'adult' ? 'adult' : 'child', otherWord = other === 'adult' ? 'adult' : 'child';
    if (!d && doses[other]) {
      d = doses[other]; res.fallback = true;
      res.warnings.push(warnItem('The SmPC gives no ' + groupWord + ' dose for this product. The ' + otherWord + ' schedule is shown for reference only: check the SmPC/BNF.', 'SmPC section 4.2'));
    }
    if (p.bnf && p.bnf[key]) res.bnfText = 'BNF' + (key === 'child' ? 'C' : '') + ': ' + p.bnf[key] + (/off-label/i.test(p.bnf[key]) ? '' : ' (off-label above the SmPC maximum)');
    res.bnfMax = bnfCeiling(p, key);
    if (!d) { res.text = 'No dose in the treatment data for this product and age. Check the SmPC/BNF.'; return res; }
    res.perDay = num(d.perDay) || 1;
    res.every = d.every || '';
    res.note = d.note || '';
    var everyTxt = res.every ? (/^(each|every)\b/.test(res.every) ? res.every : 'every ' + res.every) : 'every week';
    var noun = unitNoun(p), adj = doseAdjust(a, p);
    res.adjust = adj;
    /* The number of doses the prescriber chose for this product (choice.perDay, or "When to take it"). */
    var chs = obj(tx(a).choice), perPref = res.perDay, flex = true;
    if (chs.product === p.id) {
      var tcP = timesCount(chs.times), chosenP = num(chs.perDay);
      if (chosenP !== null) { perPref = chosenP; flex = false; } else if (typeof tcP === 'number' && allowedPerDay(p).indexOf(tcP) >= 0) { perPref = tcP; flex = false; }
    }
    function annotate() {
      var out = [];
      res.steps.forEach(function (s) {
        var reg = regimen(p, s.dose, perPref, flex);
        if (!reg && out.length) return;     /* leave out later steps that the strengths cannot make */
        out.push(Object.assign({}, s, { perDay: reg ? reg.perDay : perPref, perDose: reg ? reg.doses : null, split: reg ? reg.text : '' }));
      });
      out.forEach(function (s, i) { s.week = i + 1; });
      res.steps = out;
    }
    function finish() {
      if (res.bnfText) res.text += ' ' + res.bnfText + '.';
      if (res.note) res.text += ' ' + res.note;
      res.sources = uniq(res.warnings.map(function (w) { return w && w.src; }).concat((p.src || []).slice ? (p.src || []).slice() : []));
      return res;
    }

    /* Atomoxetine: mg per kg up to the weight cut-off (young people); fixed start and target over it and in adults */
    if (d.mgPerKg || p.drug === 'atx') {
      res.scheme = 'atx';
      var over = num(d.overKg) || 70;
      if (d.mgPerKg && kg === null) { res.weightBased = true; res.needWeight = true; res.text = 'Enter the weight to calculate the dose.'; res.warnings.push(warnItem('Weight needed: up to ' + over + ' kg the dose is worked out per kg.', 'Atomoxetine SmPC section 4.2')); return res; }
      var hf = adj.hepatic === 'C' ? 0.25 : adj.hepatic === 'B' ? 0.5 : 1;
      if (adj.hepatic) {
        res.warnings.push(warnItem('Liver impairment (' + (adj.hepaticKnown ? 'Child-Pugh ' + adj.hepatic : 'Child-Pugh class not recorded, so treated as class B') + '): the SmPC reduces the starting and target doses to ' + (hf * 100) + '% of the usual dose. This tool reduces the maximum in the same way (clinical practice).' + (adj.hepaticKnown ? '' : ' Record the Child-Pugh class: Child-Pugh C needs 25%.'), 'Atomoxetine SmPC section 4.2; clinical practice (maximum)'));
      } else if (adj.hepaticMild) {
        res.warnings.push(warnItem('Liver impairment recorded as Child-Pugh A (mild): the SmPC reduces atomoxetine doses only for Child-Pugh B and C, so the usual doses apply. Check the class if the liver disease may be worse.', 'Atomoxetine SmPC section 4.2'));
      }
      if (adj.cyp2d6) res.warnings.push(warnItem('Strong CYP2D6 inhibitor or known poor metaboliser: start lower and titrate more slowly.', 'Atomoxetine SmPC sections 4.2 and 4.5'));
      if (d.mgPerKg && kg <= over) {
        res.weightBased = true;
        var sMg = r1(num(d.mgPerKg.start) * kg * hf), tMg = r1(num(d.mgPerKg.target) * kg * hf);
        var sR = T.roundToStrengths(sMg, p.strengths, noun), tR = T.roundDownToStrengths(tMg, p.strengths, noun);
        res.start = sR ? sR.dose : sMg; res.target = tR ? tR.dose : null;
        if (res.target !== null && res.target < res.start) res.target = res.start;
        res.max = null;   /* the SmPC sets no fixed maximum up to 70 kg */
        res.soft = r1(num(d.mgPerKg.target) * kg * hf);
        res.ceiling = r1(Math.min(1.8 * kg, 120) * hf);
        res.maxText = 'SmPC: aim for about ' + fmt(num(d.mgPerKg.target)) + ' mg/kg a day (' + fmt(tMg) + ' mg for ' + fmt(kg) + ' kg' + (hf < 1 ? ', reduced for liver impairment' : '') + '); no extra benefit has been shown above this. Doses above 1.8 mg/kg a day (' + fmt(res.ceiling) + ' mg) have not been systematically evaluated; the BNFC maximum is 1.8 mg/kg and 120 mg a day.';
        res.rounding = 'The start is rounded to the nearest dose one or two capsules can give (ties go to fewer capsules, then the lower dose); the target is rounded down, so it is never above the per-kg target: start ' + fmt(sMg) + ' mg → ' + res.start + ' mg (' + (sR ? sR.text : '') + '); target ' + fmt(tMg) + ' mg → ' + (res.target !== null ? res.target + ' mg (' + (tR ? tR.text : '') + ')' : 'below the smallest capsule') + '.';
        if (sR && sR.dose > sMg * 1.5) res.warnings.push(warnItem('The nearest capsule dose (' + sR.dose + ' mg) is well above the calculated ' + fmt(sMg) + ' mg: get specialist advice (for example a liquid preparation).', 'Atomoxetine SmPC section 4.2; clinical practice'));
        res.steps = res.target !== null ? [{ week: 1, dose: res.start }, { week: 2, dose: res.target }] : [{ week: 1, dose: res.start }];
        res.text = 'Weight ' + fmt(kg) + ' kg. Start about ' + fmt(num(d.mgPerKg.start) * hf) + ' mg/kg a day = ' + fmt(sMg) + ' mg, given as ' + res.start + ' mg' + (sR ? ' (' + sR.text + ')' : '') + ' ' + perDayText(res.perDay) + ' for at least 7 days. Then about ' + fmt(num(d.mgPerKg.target) * hf) + ' mg/kg a day = ' + fmt(tMg) + ' mg' + (res.target !== null ? ', given as ' + res.target + ' mg' + (tR ? ' (' + tR.text + ')' : '') : '') + '. ' + res.maxText;
      } else {
        res.weightBased = !!d.mgPerKg;
        res.start = num(d.overStart) !== null ? num(d.overStart) : num(d.start);
        res.target = num(d.overTarget) !== null ? num(d.overTarget) : num(d.target);
        if (res.target === null && res.start !== null && num(d.step) !== null) res.target = res.start + num(d.step);
        res.max = num(d.max); res.maxSource = res.max !== null ? 'smpc' : null;
        var smpcMax = res.max;
        if (hf < 1) {
          res.capLabel = 'maximum reduced for liver impairment';
          var sR2 = res.start !== null ? T.roundToStrengths(res.start * hf, p.strengths, noun) : null;
          var tR2 = res.target !== null ? T.roundDownToStrengths(res.target * hf, p.strengths, noun) : null;
          var mR2 = res.max !== null ? T.roundDownToStrengths(res.max * hf, p.strengths, noun) : null;
          if (sR2) res.start = sR2.dose; if (tR2) res.target = tR2.dose; if (mR2) res.max = mR2.dose;
        }
        res.steps = res.target !== null ? [{ week: 1, dose: res.start }, { week: 2, dose: res.target }] : ladder(res.start, null, null);
        res.maxText = res.max === null ? '' : hf < 1
          ? 'Maximum: ' + res.max + ' mg a day (the SmPC maximum of ' + smpcMax + ' mg reduced to ' + (hf * 100) + '% for liver impairment: clinical practice).'
          : 'SmPC maximum: ' + res.max + ' mg a day.';
        res.text = (d.mgPerKg ? 'Weight ' + fmt(kg) + ' kg (over ' + over + ' kg). ' : '') + 'Start ' + res.start + ' mg ' + perDayText(res.perDay) + ' for at least 7 days' +
          (res.target !== null ? ', then ' + res.target + ' mg' + (key === 'adult' && res.max !== null && res.max > res.target ? ' (maintenance ' + res.target + '–' + res.max + ' mg)' : '') : '') + '. ' + res.maxText;
      }
      annotate();
      return finish();
    }

    /* Guanfacine-style: fixed steps, target range per kg, maximum by age and weight */
    if (d.targetMgPerKg) {
      res.scheme = 'gxr'; res.weightBased = true;
      res.start = num(d.start); var st = stepOf(d); res.step = st ? st.n : null;
      res.targetPerKg = [num(d.targetMgPerKg[0]), num(d.targetMgPerKg[1])];
      if (kg === null) { res.needWeight = true; res.text = 'Enter the weight to work out the target range and maximum.'; res.warnings.push(warnItem('Weight needed for the target range and the maximum dose.', 'Intuniv SmPC section 4.2')); res.steps = ladder(res.start, null, null); return res; }
      var gf = adj.cyp3a4inh ? 0.5 : 1;
      var lo = Math.round(res.targetPerKg[0] * kg * gf * 100) / 100, hi = Math.round(res.targetPerKg[1] * kg * gf * 100) / 100;
      res.target = [lo, hi];
      var row = guanfacineMax(d.maxTable, age, kg);
      if (row) {
        res.max = num(row.max); res.maxSource = 'smpc';
        res.maxText = 'SmPC maximum for age ' + age + ' and ' + fmt(kg) + ' kg: ' + res.max + ' mg a day.' + (row.note ? ' ' + row.note : '');
      } else if (num(d.max) !== null && key === 'adult' && !res.fallback) {
        res.max = num(d.max); res.maxSource = 'smpc'; res.maxText = 'Maximum: ' + res.max + ' mg a day.';
      } else {
        res.max = null;
        res.maxText = 'No SmPC maximum applies at this age and weight (guanfacine: under 25 kg at 6 to 12 years, under 34 kg at 13 to 17 years, or an adult). Do not increase without specialist or tertiary advice.';
        res.warnings.push(warnItem(res.maxText, 'Intuniv SmPC section 4.2 (Tables 1 and 2); ' + nice('1.7.17')));
      }
      if (adj.cyp3a4inh) {
        if (res.max !== null) {
          /* SmPC 4.2: a 50% dose reduction. The tablets must not be broken, so a half that is not a whole-tablet dose
             is rounded down (7 mg -> 3.5 -> 3 mg). */
          var halfMax = r2(res.max * 0.5), wholeMax = Math.max(num(res.start) || 1, Math.floor(halfMax + 1e-9));
          res.maxHalved = halfMax; res.max = wholeMax; res.capLabel = 'SmPC maximum halved for a CYP3A4 inhibitor';
          res.maxText += ' Halved for a CYP3A4 inhibitor: ' + fmt(halfMax) + ' mg' + (wholeMax !== halfMax ? ', rounded down to ' + wholeMax + ' mg a day because the tablets must not be broken (clinical practice)' : ' a day') + '.';
        }
        res.warnings.push(warnItem(adj.cyp3a4unclear
          ? 'Takes a CYP3A4 inhibitor or inducer: the record does not say which. Until it does, the dose range and maximum are halved, as for an inhibitor. A strong inducer instead may need re-titration up to 7 mg a day (specialist decision).'
          : 'Moderate or strong CYP3A4 inhibitor: halve the guanfacine dose. The target range and maximum here are halved.', 'Intuniv SmPC sections 4.2 and 4.5'));
      }
      if (adj.cyp3a4ind) res.warnings.push(warnItem('Strong CYP3A4 inducer: the guanfacine level falls. Specialist re-titration up to a maximum of 7 mg a day may be considered.', 'Intuniv SmPC sections 4.2 and 4.5'));
      res.steps = ladder(res.start, res.step, res.max !== null ? res.max : res.start, 8);
      res.text = 'Start ' + res.start + ' mg once a day. Increase by no more than ' + (st ? st.text : '1 mg') + ' ' + everyTxt + '. Target about ' + fmt(res.targetPerKg[0]) + '–' + fmt(res.targetPerKg[1]) + ' mg/kg a day = ' + fmt(lo) + '–' + fmt(hi) + ' mg for ' + fmt(kg) + ' kg' + (gf < 1 ? ' (halved for a CYP3A4 inhibitor)' : '') + '. ' + res.maxText;
      annotate();
      return finish();
    }

    /* Fixed dosing */
    res.scheme = 'fixed';
    res.start = num(d.start);
    var stp = stepOf(d); res.step = stp ? stp.n : null;
    if (res.fallback) {
      /* Borrowed schedule: there is no SmPC maximum for this age. Use the BNF off-label ceiling, if any. */
      res.max = res.bnfMax; res.maxSource = res.bnfMax !== null ? 'bnf' : null;
      res.maxText = 'No ' + groupWord + ' licence: no SmPC ' + groupWord + ' maximum.' + (num(d.max) !== null ? ' The ' + otherWord + ' SmPC maximum (' + num(d.max) + ' mg a day) is for reference only.' : '') +
        (res.bnfMax !== null ? ' Off-label ceiling (BNF' + (key === 'child' ? 'C' : '') + '): ' + res.bnfMax + ' mg a day.' : ' No ceiling in the data: check the BNF and get specialist advice before increasing.');
    } else {
      res.max = num(d.max); res.maxSource = res.max !== null ? 'smpc' : null;
      if (d.maxMgPerKg) {
        res.weightBased = true;
        var mpk = num(d.maxMgPerKg);
        if (kg === null) {
          res.needWeight = true;
          res.maxText = 'SmPC maximum: no more than ' + fmt(mpk) + ' mg/kg a day and never more than ' + fmt(res.max) + ' mg a day. Enter the weight.';
          res.warnings.push(warnItem('Maximum ' + fmt(mpk) + ' mg/kg and never more than ' + fmt(res.max) + ' mg a day: enter the weight.', p.name + ' SmPC section 4.2'));
        } else {
          var ss0 = strengthsOf(p), smallest = ss0.length ? Math.min.apply(null, ss0) : 1, unitMg = perPref * smallest;
          var cap = Math.floor(mpk * kg / unitMg + 1e-9) * unitMg;
          if (res.max === null || cap < res.max) {
            res.max = cap; res.capLabel = 'SmPC maximum for this weight';
            res.maxText = 'SmPC maximum: ' + fmt(num(d.max)) + ' mg a day and no more than ' + fmt(mpk) + ' mg/kg (' + fmt(r1(mpk * kg)) + ' mg for ' + fmt(kg) + ' kg; ' + cap + ' mg is the highest dose that ' + perPref + ' equal dose' + (perPref === 1 ? '' : 's') + ' can give within it).';
          }
        }
      }
    }
    if (adj.renal) {
      if (res.max === null || res.max > 50) { res.max = 50; res.capLabel = 'maximum in severe kidney impairment'; }
      res.maxText = (res.maxText ? res.maxText + ' ' : '') + 'Severe kidney impairment: maximum 50 mg a day.';
      res.warnings.push(warnItem('Severe kidney impairment: maximum 50 mg a day; consider less on dialysis.', 'Elvanse SmPC section 4.2'));
    }
    /* A usual maximum below the SmPC maximum (dexamfetamine: usually 20 mg, 40 mg only in rare cases): the ladder
       stops at the usual maximum; the higher dose is a specialist decision with a recorded reason. */
    var um = res.fallback ? null : num(d.usualMax);
    if (um !== null && res.max !== null && um < res.max) {
      res.usualMax = um;
      res.maxText = 'SmPC (' + (key === 'adult' ? 'adults' : 'children and young people') + '): usually a maximum of ' + um + ' mg a day; up to ' + res.max + ' mg a day only in rare cases (a specialist decision; record the reason).' + (adj.renal ? ' Severe kidney impairment: maximum 50 mg a day.' : '');
    }
    if (!res.maxText && res.max !== null) res.maxText = 'SmPC maximum (' + (key === 'adult' ? 'adults' : 'children and young people') + '): ' + res.max + ' mg a day.';
    var ladderTop = res.usualMax !== null ? res.usualMax : res.max;
    if (num(d.target) !== null) {
      res.target = num(d.target);
      res.steps = stp ? ladder(res.start, res.step, ladderTop) : [{ week: 1, dose: res.start }, { week: 2, dose: res.target }];
    } else res.steps = ladder(res.start, res.step, ladderTop);
    annotate();
    res.text = (res.start !== null ? 'Start ' + res.start + ' mg ' + perDayText(res.perDay) + '. ' : '') +
      (stp ? 'If needed, increase by ' + stp.text + ' a day ' + everyTxt + '. ' : '') +
      (res.target !== null && !stp ? 'Then ' + res.target + ' mg. ' : '') + res.maxText;
    return finish();
  };

  /* ---------------- where the current medicine stands ---------------- */
  function seriousFlags(a, r) { return T.reviewFlags(a, r.id).filter(function (f) { return f.level === 'urgent' || f.level === 'act'; }); }
  function overridden(r) { return !!String(obj(r).flagOverride || '').trim(); }
  /* From the current medicine's reviews (reviews with no decision are skipped):
       stopped    the latest decision is "Stop";
       optimised  the latest decision is "Optimised", or "Stay" after it with no increase, reduce, switch or stop
                  since, and that review raised no act or urgent flag (unless a reason to go on is recorded in
                  reviews.<id>.flagOverride);
       held       the dose was marked optimised, but that review's flags need action first. */
  T.medState = function (a) {
    var rs = T.currentReviews(a), out = { reviews: rs, latest: rs.length ? rs[rs.length - 1] : null, stopped: false, stopReview: null, optimised: false, optReview: null, held: false };
    var decided = rs.filter(function (r) { return !!r.decision; });
    var lastDec = decided.length ? decided[decided.length - 1] : null;
    if (lastDec && lastDec.decision === 'stop') { out.stopped = true; out.stopReview = lastDec; }
    else {
      for (var i = decided.length - 1; i >= 0; i--) {
        if (decided[i].decision === 'stay') continue;
        if (decided[i].decision === 'optimised') out.optReview = decided[i];
        break;
      }
    }
    if (out.optReview) {
      out.held = seriousFlags(a, out.optReview).length > 0 && !overridden(out.optReview);
      out.optimised = !out.held;
    }
    return out;
  };

  /* ---------------- trial clock ---------------- */
  function capName(plan) { return plan.capLabel || (plan.maxSource === 'bnf' ? 'BNF off-label ceiling' : 'SmPC maximum'); }
  /* The top of the usual ladder: the usual maximum when the SmPC sets one below its maximum, else the maximum. */
  function topOf(plan) { return plan && plan.usualMax != null ? plan.usualMax : plan ? plan.max : null; }
  function atTop(plan, dose) { var top = topOf(plan); return !!plan && dose !== null && (top !== null ? dose >= top : (typeof plan.target === 'number' && dose >= plan.target)); }
  /* An adequate trial is 6 weeks AT the optimised (best tolerated) dose, or at the maximum or target dose, not
     6 weeks from the first dose (NICE NG87 1.7.8, 1.7.12–1.7.13). The clock starts at the first review that
     reached that dose with no act or urgent flag (unless overridden), when no later review is at a lower dose
     or decided to reduce it. `weeks` stays the time since starting, for the progress display. */
  T.trial = function (a, today) {
    var ch = obj(tx(a).choice), d = T.drug(ch.drug);
    var need = (d && d.trial && num(d.trial.weeks)) || 6;
    today = today || T.today();
    var ms = T.medState(a);
    var res = { weeks: 0, days: null, need: need, adequate: false, optimised: ms.optimised, stopped: ms.stopped, held: ms.held, atMax: false, dose: null,
      weeksAtDose: 0, doseDate: null, text: '', src: nice('1.7.8, 1.7.12–1.7.13') };
    var days = T.daysBetween(ch.startDate, today);
    if (days === null) { res.text = 'Not started yet: record the start date.'; return res; }
    res.days = days;
    var weeks = res.weeks = Math.max(0, Math.floor(days / 7));
    var rs = ms.reviews, last = ms.latest;
    var plan = ch.product ? T.dosePlan(a, ch.product) : null;
    res.dose = last ? doseAfter(last) : num(ch.startDose);
    res.atMax = atTop(plan, res.dose);
    var anchor = null, anchorKind = '';
    for (var i = 0; i < rs.length && !anchor; i++) {
      var r = rs[i], rd = num(r.dose);
      if (!r.date || rd === null || r.decision === 'reduce') continue;
      var kind = r.decision === 'optimised' ? 'optimised' : atTop(plan, rd) ? 'top' : '';
      if (!kind || (seriousFlags(a, r).length && !overridden(r))) continue;
      var keeps = rs.slice(i + 1).every(function (x) {
        var xd = num(x.dose), xn = num(x.newDose);
        return (xd === null || xd >= rd) && (xn === null || xn >= rd) && x.decision !== 'reduce';
      }) && !(num(r.newDose) !== null && num(r.newDose) < rd);
      if (keeps) { anchor = r; anchorKind = kind; }
    }
    if (anchor) {
      res.doseDate = anchor.date;
      res.weeksAtDose = Math.max(0, Math.floor((T.daysBetween(anchor.date, today) || 0) / 7));
      res.adequate = res.weeksAtDose >= need;
    }
    var at = anchorKind === 'optimised' ? 'the optimised dose' : 'the maximum or target dose';
    var text = 'Week ' + weeks + ' since starting. ';
    if (ms.stopped) text += 'Medicine stopped at the review' + (ms.stopReview && ms.stopReview.date ? ' on ' + dateText(ms.stopReview.date) : '') + '. ';
    if (anchor) text += res.adequate ? 'Adequate trial: ' + res.weeksAtDose + ' weeks at ' + at + ' (' + need + ' needed).' : res.weeksAtDose + ' of ' + need + ' weeks at ' + at + ' so far: not yet an adequate trial.';
    else if (ms.held) text += 'The dose was marked optimised, but the flags from that review need action first. The ' + need + ' weeks start once the dose is optimised.';
    else text += 'Not yet adequate: the ' + need + ' weeks start once the dose is optimised (or at the maximum dose). Titrate to the best tolerated dose.';
    res.text = text;
    return res;
  };

  /* ---------------- review flags ---------------- */
  function seItem(id) { return AA.byId('txSideEffects', id); }
  /* Reported at any level, these need same-day action: psychosis or mania, signs of liver injury, new or worse
     seizures, suicidal thoughts, chest pain or fainting on exertion, and any item marked urgent in the data. */
  var URGENT_SE = { se_liver: 1, se_seizure: 1, se_suicidal: 1, se_chest: 1 };
  function isUrgentSe(id, item) { return (item && (item.urgent === true || item.stop === true)) || !!URGENT_SE[id] || /psychos|mania|manic/.test(id); }
  function sideEffectRated(r, id) { var v = obj(obj(r).se)[id]; return v === 'none' || v === 'mild' || v === 'troublesome'; }
  /* The most recent earlier review with a measurement (so a phone review without readings does not break the
     "2 occasions" rule). */
  function prevWith(rs, idx, has) { for (var j = idx - 1; j >= 0; j--) if (has(rs[j])) return rs[j]; return null; }
  function hasBP(x) { return num(x.sbp) !== null && num(x.dbp) !== null; }
  function gt95(c) { return c === 'gt95_once' || c === 'gt95_sustained'; }
  T.reviewFlags = function (a, reviewId) {
    var rs = T.reviewsSorted(a), idx = -1;
    rs.forEach(function (r, i) { if (r.id === reviewId) idx = i; });
    if (idx < 0) return [];
    var r = rs[idx], b = obj(tx(a).baseline), flags = [];
    var young = T.group(a) === 'young';
    var referTo = young ? 'a paediatric hypertension specialist' : 'an adult physician';
    function flag(level, text, doText, src) { flags.push(new Item({ level: level, text: text, t: text, do: doText, src: src })); }
    var hasSuicidalItem = !!AA.byId('txSideEffects', 'se_suicidal');

    /* Urgent side effects: any report at all is urgent. An urgent item with its own action uses it as the "do". */
    Object.keys(obj(r.se)).forEach(function (id) {
      var v = r.se[id], item = seItem(id);
      if (item && !T.forAge(a, item)) return;
      if ((v === 'mild' || v === 'troublesome') && isUrgentSe(id, item)) {
        var psy = /psychos|mania|manic/.test(id);
        var own = item && item.action && (item.urgent === true || item.stop === true || URGENT_SE[id]) ? item.action : null;
        flag('urgent', (item ? item.t : 'Psychotic or manic symptoms') + (psy ? ': stop ADHD medicine.' : ': urgent.'),
          own || (psy ? 'Stop all ADHD medicine now and arrange an urgent mental health review. Consider restarting only after the episode has resolved.' : 'Same-day review by the prescriber or a doctor. Do not give the next dose until assessed.'),
          own ? (item.src || 'Clinical practice') : psy ? nice('1.7.19') + '; clinical practice (urgent review)' : 'Clinical practice');
      } else if (id === 'se_mood' && v === 'mild' && (!hasSuicidalItem || !sideEffectRated(r, 'se_suicidal'))) {
        /* Low mood with no answer about suicidal thoughts: older data (one item covered both) or the suicidal
           thoughts item left blank at this review. Ask directly before going on. */
        flag('act', (item ? item.t : 'Low mood or thoughts of self-harm') + ': reported, with no answer recorded about suicidal thoughts.', 'Ask directly about thoughts of self-harm or suicide' + (hasSuicidalItem ? ' and record the answer in that item' : '') + '. Any suicidal thoughts: assess risk the same day.', 'Clinical practice (always ask about suicidal thoughts when mood is low); SmPC section 4.4');
      }
    });

    /* Heart rate: over 120 on 2 occasions, comparing with the last review that measured it */
    var p1 = num(r.pulse), pp = prevWith(rs, idx, function (x) { return num(x.pulse) !== null; }), p0 = pp ? num(pp.pulse) : null;
    if (p1 !== null && p1 > 120) {
      if (p0 !== null && p0 > 120) flag('act', 'Resting heart rate over 120 bpm on 2 occasions (' + p0 + ', then ' + p1 + ').', 'Reduce the dose and refer to ' + referTo + '.', nice('1.8.11'));
      else flag('watch', 'Resting heart rate ' + p1 + ' bpm (over 120) on one reading.', 'Repeat it at rest and look for causes (caffeine, decongestants, anxiety). Two readings over 120: reduce the dose and refer.', nice('1.8.11') + '; clinical practice (single reading)');
    }

    /* Blood pressure */
    var s1 = num(r.sbp), d1 = num(r.dbp), pb = prevWith(rs, idx, hasBP);
    var s0 = pb ? num(pb.sbp) : null, d0 = pb ? num(pb.dbp) : null;
    var veryHigh = (s1 !== null && s1 >= 180) || (d1 !== null && d1 >= 120);
    if (veryHigh) {
      var bpT = (s1 !== null ? s1 : '?') + '/' + (d1 !== null ? d1 : '?');
      if (young) flag('urgent', 'Blood pressure ' + bpT + ' (180/120 or higher).', 'Same-day paediatric assessment (urgent referral to the paediatric team). Do not give further doses until reviewed.', nice('1.7.6, 1.8.11') + '; clinical practice');
      else flag('urgent', 'Blood pressure ' + bpT + ' (180/120 or higher).', 'Follow NICE NG136 for same-day referral criteria. Do not increase the dose; discuss stopping with the prescriber.', 'NICE NG136; clinical practice');
    } else if (!young && s1 !== null && d1 !== null) {
      /* Adults: NICE asks for a clinically significant increase on 2 occasions. Compared with the baseline clinic
         reading: a rise of 15 mmHg systolic or 10 mmHg diastolic, or 140/90 or higher when the baseline was below
         it (or was not cleared by ambulatory or home readings). Both numbers are this tool's, not NICE's. */
      var base = clinicReading(b), wc = !!base && (base.s >= 140 || base.d >= 90) && b.abpm === 'normal';
      var trig = function (x) {
        var s = num(x.sbp), d = num(x.dbp);
        var rise = !!base && (s - base.s >= 15 || d - base.d >= 10), high = s >= 140 || d >= 90;
        return { rise: rise, high: high, on: rise || (high && !wc) };
      };
      var t1 = trig(r), t0 = pb ? trig(pb) : null;
      var why = function (t) { return t.rise ? 'a rise from the baseline ' + base.s + '/' + base.d : '140/90 or higher'; };
      var bpSrc = nice('1.8.11') + '; NICE NG136 1.2.3–1.2.8. Clinical practice: NICE does not define a clinically significant rise; this tool flags a rise of 15 mmHg systolic or 10 mmHg diastolic from the baseline, or 140/90 or higher (the adult clinic threshold in NG136)';
      if (t1.on && t0 && t0.on) flag('act', 'Blood pressure raised on 2 occasions (' + s0 + '/' + d0 + ', then ' + s1 + '/' + d1 + '; ' + why(t1) + ').', 'Reduce the dose and refer to an adult physician.', bpSrc);
      else if (t1.on) flag('watch', 'Blood pressure ' + s1 + '/' + d1 + ' (' + why(t1) + ') on one reading.', 'Repeat it and look for causes. If it stays raised on 2 occasions, reduce the dose and refer.', bpSrc);
      else if (t1.high && wc) flag('watch', 'Blood pressure ' + s1 + '/' + d1 + ': 140/90 or higher, but no rise from the baseline ' + base.s + '/' + base.d + ', where ambulatory or home readings were normal (white-coat effect).', 'A stable clinic reading. If it rises, or you are unsure, repeat ambulatory or home readings.', 'NICE NG136 1.2.3–1.2.8; ' + nice('1.8.11'));
    }
    if (young) {
      /* Systolic above the 95th centile on 2 occasions (the centile band read from the chart at each review; the
         baseline counts as an earlier occasion when no earlier review has one). */
      var c1 = r.bpCentile;
      if (gt95(c1)) {
        var pc = prevWith(rs, idx, function (x) { return !!x.bpCentile; });
        var prevC = pc ? pc.bpCentile : b.bpCentile;
        if (c1 === 'gt95_sustained' || gt95(prevC)) flag('act', 'Systolic blood pressure above the 95th centile on 2 occasions.', 'Reduce the dose and refer to a paediatric hypertension specialist.', nice('1.8.9, 1.8.11'));
        else flag('watch', 'Systolic blood pressure above the 95th centile on one reading.', 'Repeat it with the right cuff size and plot it on the centile chart. Above the 95th centile on 2 occasions: reduce the dose and refer to a paediatric hypertension specialist.', nice('1.8.11') + '; clinical practice (repeat a single high reading)');
      }
      var sb = num(b.sbp);
      if (sb !== null && s1 !== null && s1 - sb >= 15) {
        var ps = prevWith(rs, idx, function (x) { return num(x.sbp) !== null; }), sp0 = ps ? num(ps.sbp) : null;
        if (sp0 !== null && sp0 - sb >= 15) flag('act', 'Systolic blood pressure ' + (s1 - sb) + ' mmHg above the baseline on 2 reviews in a row (' + sp0 + ', then ' + s1 + '; baseline ' + sb + ').', 'Check it against the centile chart. Above the 95th centile or a clinically significant rise on 2 occasions: reduce the dose and refer to a paediatric hypertension specialist.', nice('1.8.11') + '. Clinical practice: "clinically significant rise" is not defined by NICE; this tool flags 15 mmHg or more');
        else flag('watch', 'Systolic blood pressure ' + (s1 - sb) + ' mmHg above the baseline (' + sb + ' to ' + s1 + ').', 'Plot it on the centile chart and repeat at the next review.', 'Clinical practice: "clinically significant rise" is not defined by NICE; this tool flags 15 mmHg or more');
      }
    }

    /* Weight */
    var w0 = num(b.weightKg), w1 = num(r.weightKg);
    if (w0 !== null && w1 !== null && w0 > 0 && (w0 - w1) / w0 >= 0.05) {
      var pct = Math.round(100 * (w0 - w1) / w0);
      flag('watch', 'Weight down ' + pct + '% from the baseline (' + fmt(w0) + ' to ' + fmt(w1) + ' kg).', 'Options: take the medicine with or after food; extra meals early in the morning or late in the evening; dietary advice; high-calorie nutritious foods; a planned break; or a change of medicine.' + (young ? ' Plot weight and height on the growth chart.' : ''), nice('1.8.6') + '. Clinical practice: NICE gives no percentage; this tool flags 5% or more');
    }

    /* Troublesome side effects */
    Object.keys(obj(r.se)).forEach(function (id) {
      var item = seItem(id);
      if (item && !T.forAge(a, item)) return;
      if (r.se[id] === 'troublesome' && !isUrgentSe(id, item)) {
        flag('act', (item ? item.t : id) + ': troublesome.', (item && item.action) || 'Review the dose, timing or product.', (item && item.src) || 'Clinical practice');
      }
    });

    var order = { urgent: 0, act: 1, watch: 2 };
    flags.sort(function (x, y) { return order[x.level] - order[y.level]; });
    return flags;
  };
  T.latestFlags = function (a) { var r = T.latestReview(a); return r ? T.reviewFlags(a, r.id) : []; };

  /* ---------------- next dose suggestion ---------------- */
  /* A suggestion only, within the SmPC maximum (or the BNF ceiling when there is no licence for this age), and
     only doses the strengths can make. It starts from the dose agreed at the current medicine's latest review. */
  T.nextDose = function (a) {
    var ch = obj(tx(a).choice);
    if (!ch.product) return { dose: null, text: 'Choose a product first.', atMax: false };
    if (T.age(a) === null) return { dose: null, text: AGE_MSG, atMax: false, hold: true };
    var p = T.product(ch.product);
    var plan = T.dosePlan(a, ch.product), ms = T.medState(a), last = ms.latest;
    if (ms.stopped) return { dose: null, stopped: true, hold: true, atMax: false, text: 'Medicine stopped at the last review: no next dose.' };
    var cur = last ? doseAfter(last) : num(ch.startDose);
    if (cur === null) return { dose: plan.start, text: plan.start !== null ? 'Starting dose: ' + plan.start + ' mg a day.' : plan.text, atMax: false };
    var lastAny = T.latestReview(a);
    var flags = (last ? T.reviewFlags(a, last.id) : []).concat(lastAny && (!last || lastAny.id !== last.id) ? T.reviewFlags(a, lastAny.id) : []);
    var capWord = 'the ' + capName(plan);
    var atMaxNow = topOf(plan) !== null && cur >= topOf(plan);
    if (plan.blocked && plan.blocked.length) return { dose: cur, hold: true, atMax: atMaxNow, text: 'Do not increase: ' + plan.blocked.map(String).join(' ') };
    if (flags.some(function (f) { return f.level === 'urgent' || f.level === 'act'; })) {
      return { dose: cur, text: 'Do not increase: act on the flags from the last review first.', atMax: atMaxNow, hold: true };
    }
    if (last && last.decision === 'optimised' && !ms.held) return { dose: cur, text: 'Dose optimised at ' + cur + ' mg a day: keep it unless something changes.', atMax: atMaxNow };
    if (plan.needWeight) return { dose: cur, hold: true, atMax: false, text: 'Enter the weight: ' + (plan.maxText || 'the maximum depends on it.') };
    if (plan.scheme === 'gxr' && plan.max === null) return { dose: cur, hold: true, atMax: false, text: 'No SmPC maximum applies at this age and weight (guanfacine: under 25 kg at 6 to 12 years, under 34 kg at 13 to 17 years, or an adult). Do not increase without specialist or tertiary advice.' };
    if (plan.ceiling !== null && cur > plan.ceiling) return { dose: cur, hold: true, atMax: true, overMax: true, text: cur + ' mg a day is above 1.8 mg/kg a day (' + plan.ceiling + ' mg): not systematically evaluated in the SmPC and above the BNFC maximum. Reduce, or record specialist advice.' };
    if (plan.max !== null && cur > plan.max) return { dose: cur, hold: true, atMax: true, overMax: true, text: cur + ' mg a day is above ' + capWord + ' of ' + plan.max + ' mg: off-label. Record the specialist reason, or reduce.' + (plan.bnfText && plan.maxSource !== 'bnf' ? ' ' + plan.bnfText + '.' : '') };
    /* At or above the usual maximum (dexamfetamine 20 mg): hold. Going on towards the SmPC maximum is a specialist
       decision; once its reason is recorded (choice.overMaxReason) the next step is offered. */
    var umReason = String(ch.overMaxReason || '').trim().replace(/[.\s]+$/, '');
    if (plan.usualMax !== null && cur >= plan.usualMax && (plan.max === null || cur < plan.max) && !umReason) {
      return { dose: cur, hold: true, atMax: true, usualMax: true, text: cur + ' mg a day is ' + (cur > plan.usualMax ? 'above ' : '') + 'the usual maximum' + (cur > plan.usualMax ? ' of ' + plan.usualMax + ' mg' : '') + '. Up to ' + plan.max + ' mg a day only in rare cases: a specialist decision; record the reason before going higher.' };
    }
    if (plan.max !== null && cur >= plan.max) return { dose: cur, text: cur + ' mg a day is ' + capWord + '. Do not go higher' + (plan.maxSource === 'bnf' ? '.' : (plan.bnfText ? ' except with specialist off-label advice (' + plan.bnfText + ')' : '') + '.'), atMax: true };
    if (plan.max === null && typeof plan.target === 'number' && cur >= plan.target) {
      return { dose: cur, text: 'At the usual target dose. ' + plan.maxText, atMax: true };
    }
    var next = null;
    if (typeof plan.target === 'number' && plan.step === null) next = cur < plan.target ? plan.target : (plan.max !== null && plan.max > cur ? plan.max : null);
    else if (plan.step) {
      if (plan.max === null) return { dose: cur, hold: true, atMax: false, text: 'No maximum in the data for this product and age: check the SmPC and BNF and get specialist advice before increasing.' };
      next = r1(cur + plan.step);
    }
    if (next === null) return { dose: cur, text: 'No standard next step in the data: check the SmPC.', atMax: false };
    if (plan.max !== null && next > plan.max) next = plan.max;
    /* Only doses the strengths can make in the number of doses a day (immediate release may use unequal doses). */
    var perPref = num(ch.perDay) || (function () { var tc = timesCount(ch.times); return typeof tc === 'number' ? tc : null; }()) || plan.perDay || 1;
    var flex = num(ch.perDay) === null && typeof timesCount(ch.times) !== 'number';
    var reg = p ? regimen(p, next, perPref, flex) : null;
    while (p && !reg && plan.step && plan.max !== null && r1(next + plan.step) <= plan.max + 1e-9) { next = r1(next + plan.step); reg = regimen(p, next, perPref, flex); }
    if (p && !reg) return { dose: cur, text: 'No higher dose that ' + p.name + ' can make in ' + perWord(perPref) + ' within ' + capWord + ': check the SmPC, or change the number of doses a day.', atMax: false };
    var capTxt = plan.usualMax !== null && next <= plan.usualMax ? 'usual maximum ' + plan.usualMax + ' mg; up to ' + plan.max + ' mg only in rare cases'
      : plan.max !== null ? capName(plan) + ' ' + plan.max + ' mg' : plan.ceiling !== null ? 'no extra benefit above about ' + plan.soft + ' mg' : 'maximum not recorded';
    var text = 'If more benefit is needed and the dose is tolerated: ' + next + ' mg a day' + (reg && reg.text ? ' (' + reg.text + ')' : '') + ' (suggestion only; ' + capTxt + ').';
    if (plan.usualMax !== null && next > plan.usualMax) text += ' Above the usual maximum of ' + plan.usualMax + ' mg a day: a specialist decision for rare cases (reason recorded: ' + umReason + ').';
    if (Array.isArray(plan.target) && next > plan.target[1]) text += ' This is above the recommended maintenance range of ' + fmt(plan.targetPerKg ? plan.targetPerKg[0] : 0.05) + '–' + fmt(plan.targetPerKg ? plan.targetPerKg[1] : 0.12) + ' mg/kg a day (' + fmt(plan.target[0]) + '–' + fmt(plan.target[1]) + ' mg): increase only if it is tolerated and needed.';
    if (plan.scheme === 'gxr' && next === 7) text += ' 7 mg only after at least 1 week on 6 mg and a thorough review of tolerability and efficacy.';
    if (plan.soft !== null && next > plan.soft) text += ' Above about 1.2 mg/kg a day no extra benefit has been shown.';
    if (plan.adjust && plan.adjust.cyp2d6) text += ' CYP2D6 inhibitor or poor metaboliser: titrate more slowly.';
    return { dose: next, text: text, atMax: false, regimen: reg };
  };

  /* ---------------- monitoring schedule ---------------- */
  function fieldFor(item) {
    if (item.field) return item.field;
    var s = lc(item.id) + ' ' + lc(item.what);
    if (/height/.test(s)) return 'heightCm';
    if (/weight|bmi/.test(s)) return 'weightKg';
    if (/\bbp\b|blood pressure|pulse|heart rate|_hr\b|_bp\b/.test(s)) return 'bp';
    return null;
  }
  function hasField(r, f) { return f === 'bp' ? num(r.sbp) !== null || num(r.pulse) !== null : num(r[f]) !== null; }
  T.monitorPlan = function (a, today) {
    var M = data('txMonitor'); if (!M) return [];
    var group = T.group(a); if (group === 'under6') return [];
    var items = Array.isArray(M[group]) ? M[group] : [];
    var ch = obj(tx(a).choice), mon = obj(tx(a).monitor), start = ch.startDate || null;
    var rs = T.reviewsSorted(a);
    today = today || T.today();
    var out = items.filter(function (it) {
      if (!T.forAge(a, it)) return false;
      if (Array.isArray(it.drugs) && ch.drug && it.drugs.indexOf(ch.drug) < 0) return false;
      if (Array.isArray(it.drugs) && !ch.drug) return false;
      return true;
    }).map(function (it) {
      var f = fieldFor(it), last = null;
      /* A field that is not a review measure is a date kept in treatment.monitor (needReviewDate, annualDate). */
      if (f && f !== 'bp' && f !== 'heightCm' && f !== 'weightKg') last = parseISO(mon[f]) !== null ? String(mon[f]).slice(0, 10) : null;
      else if (f) for (var i = rs.length - 1; i >= 0; i--) if (rs[i].date && hasField(rs[i], f)) { last = rs[i].date; break; }
      var due = null, months = num(it.months);
      if (start) {
        if (Array.isArray(it.schedule) && it.schedule.length) {
          var after = last ? T.addDays(last, 30) : start, pts = it.schedule.map(function (m) { return T.addMonths(start, m); });
          for (var j = 0; j < pts.length; j++) if (pts[j] > after) { due = pts[j]; break; }
          if (!due && months) { var base = last && last > pts[pts.length - 1] ? last : pts[pts.length - 1]; due = T.addMonths(base, months); }
        } else if (months) due = T.addMonths(last || start, months);
        else due = mon.nextReview || null;
      }
      return { id: it.id, what: it.what || it.t || it.id, freq: it.freq || '', due: due, last: last, overdue: !!due && due < today, specialistOnly: it.specialistOnly === true, src: it.src || '' };
    });
    if (!out.some(function (x) { return /annual/.test(lc(x.id)); })) {
      var ad = mon.annualDate ? T.addMonths(mon.annualDate, 12) : start ? T.addMonths(start, 12) : null;
      out.push({ id: 'annual', what: 'Annual review: whether to continue, in the 8 NICE areas', freq: 'At least once a year', due: ad, last: mon.annualDate || null, overdue: !!ad && ad < today, specialistOnly: true, src: nice('1.10.1–1.10.3') });
    }
    return out;
  };
  /* The checks the GP takes on under shared care: the monitoring plan without the items the specialist team
     keeps (specialistOnly: the annual review, a planned trial off medicine, guanfacine "still needed?"). */
  T.sharedCarePlan = function (a, today) {
    return T.monitorPlan(a, today).filter(function (x) { return !x.specialistOnly; });
  };

  /* ---------------- the dose on the next prescription ---------------- */
  /* -> {dose, from: 'rx'|'review'|'start'|null, stopped, reason, review, warnings[]}.
     After "Stop" (the latest decision of the current medicine): no dose. After "Increase" or "Reduce": the new
     dose agreed at that review (reviews.<id>.newDose); without it, no dose until it is entered. A dose typed for
     the prescription (choice.rxDose) wins when it was entered after the latest review (choice.rxDoseDate); an
     undated typed dose is used with a check when it differs from the review. Otherwise the latest review's dose,
     else the starting dose. */
  T.rxDose = function (a) {
    var ch = obj(tx(a).choice), ms = T.medState(a), last = ms.latest;
    var out = { dose: null, from: null, stopped: false, reason: '', review: last || null, warnings: [] };
    var when = last && last.date ? 'on ' + dateText(last.date) : 'at the last review';
    if (ms.stopped) {
      var sr = ms.stopReview;
      out.stopped = true; out.from = 'stop';
      out.reason = 'Medicine stopped at the review' + (sr && sr.date ? ' on ' + dateText(sr.date) : '') + ': no prescription.';
      return out;
    }
    var typed = num(ch.rxDose), typedDate = ch.rxDoseDate || null;
    var agreed = null, need = false, dec = last ? last.decision : null;
    if (last) {
      var nd = num(last.newDose);
      if (nd !== null) agreed = nd;
      else if (dec === 'reduce' || dec === 'increase') need = true;
      else if (dec === 'switch') need = 'switch';
      else agreed = num(last.dose);
    }
    var typedNewer = typed !== null && (!last || (!!typedDate && (!last.date || String(typedDate) >= String(last.date))));
    if (typedNewer) { out.dose = typed; out.from = 'rx'; return out; }
    if (typed !== null && typedDate) {
      out.warnings.push('The dose typed for this prescription (' + fmt(typed) + ' mg a day) was entered before the review ' + when + ', so it is not used. Enter it again if it is still right.');
    } else if (typed !== null) {
      if (need === 'switch') { out.reason = 'The last review decided to switch medicine. Record the new medicine and its start date: the prescription then uses its starting dose.'; return out; }
      out.dose = typed; out.from = 'rx';
      if (need) out.warnings.push('Check that ' + fmt(typed) + ' mg a day is the new dose agreed at the review ' + when + ' (decision: ' + dec + ').');
      else if (agreed !== null && agreed !== typed) out.warnings.push('The dose typed for this prescription (' + fmt(typed) + ' mg a day) differs from the dose recorded at the review ' + when + ' (' + fmt(agreed) + ' mg a day): check which is right.');
      return out;
    }
    if (need === 'switch') { out.reason = 'The last review decided to switch medicine. Record the new medicine and its start date: the prescription then uses its starting dose.'; return out; }
    if (need) {
      var sug = '';
      if (dec === 'increase') { var nx = T.nextDose(a); if (!nx.hold && num(nx.dose) !== null) sug = ' Suggested: ' + fmt(num(nx.dose)) + ' mg a day.'; }
      out.reason = 'Enter the new daily dose agreed at the review ' + when + ' (decision: ' + dec + ').' + sug;
      return out;
    }
    if (agreed !== null) { out.dose = agreed; out.from = 'review'; return out; }
    var sd = num(ch.startDose);
    if (sd !== null) { out.dose = sd; out.from = 'start'; return out; }
    out.reason = 'Enter the dose.';
    return out;
  };

  /* ---------------- prescription text ---------------- */
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function under1000(n) {
    var h = Math.floor(n / 100), rest = n % 100, s = '';
    if (h) s = ONES[h] + ' hundred' + (rest ? ' and ' : '');
    if (rest || !h) s += rest < 20 ? ONES[rest] : TENS[Math.floor(rest / 10)] + (rest % 10 ? '-' + ONES[rest % 10] : '');
    return s;
  }
  /* A quantity in words: whole numbers (28 -> 'twenty-eight') and decimals to 2 places (52.5 -> 'fifty-two
     point five'), so a Schedule 2 quantity is never left in figures only. */
  T.words = function (n) {
    n = num(n);
    if (n === null) return '';
    if (n < 0) return String(n);
    if (Math.floor(n) !== n) {
      var parts = String(Math.round(n * 100) / 100).split('.');
      if (parts.length < 2) return T.words(num(parts[0]));
      return T.words(parseInt(parts[0], 10)) + ' point ' + parts[1].split('').map(function (c) { return ONES[+c]; }).join(' ');
    }
    if (n < 1000) return under1000(n);
    if (n < 1000000) { var th = Math.floor(n / 1000), rest = n % 1000; return under1000(th) + ' thousand' + (rest ? (rest < 100 ? ' and ' : ' ') + under1000(rest) : ''); }
    return String(n);
  };
  function formPlural(p) {
    if (p.formRx) return p.formRx;
    var f = lc(p.form).trim();
    return /(tablet|capsule)$/.test(f) ? f + 's' : f;
  }
  /* How many doses a day "When to take it" means: a number, 'or' when it offers a choice of regimens, or null
     when it cannot be read. */
  var TIME_SLOTS = ['morning|breakfast|mane|on waking', 'midday|lunch|noon', 'afternoon|after school', 'evening|teatime|tea time', 'night|bedtime|nocte'];
  var TIME_WORD = '(?:once|twice|morning|breakfast|midday|lunch|lunchtime|noon|afternoon|evening|night|bedtime|split|daily|times?)';
  function timesCount(t) {
    t = lc(t).trim();
    if (!t) return null;
    if (new RegExp('\\b' + TIME_WORD + '\\b[^.]*\\bor\\b[^.]*\\b' + TIME_WORD + '\\b').test(t)) return 'or';
    if (/\b(four times|4 times|qds|qid)\b/.test(t)) return 4;
    if (/\b(three times|3 times|thrice|tds|tid)\b/.test(t)) return 3;
    if (/\b(twice|two times|2 times|bd|bid)\b/.test(t)) return 2;
    if (/\b(once|one time|1 time|od|daily)\b/.test(t)) return 1;
    var slots = 0;
    TIME_SLOTS.forEach(function (re) { if (new RegExp('\\b(?:' + re + ')').test(t)) slots++; });
    var clocks = (t.match(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b|\b\d{1,2}:\d{2}\b/g) || []).length;
    return slots || clocks ? Math.max(slots, clocks) : null;
  }
  T.timesCount = timesCount;
  /* The direction for equal doses. A typed timing is used as written (its number of doses already agrees with
     the regimen); otherwise one plain regimen, never the product's "or" options. */
  function timesText(ch, p, perDay, warn) {
    var t = String(ch.times || '').trim();
    if (t) return /^(each|every|in|at|once|twice|three|four|on|with|before|after)\b/i.test(t) ? t : 'each ' + t;
    if (perDay === 1) {
      if (/^once each morning/i.test(String(p.take || '').trim())) return 'each morning';
      warn('Add when to take it (for example each morning, or each evening).', 'Misuse of Drugs Regulations 2001 reg 15; clinical practice');
      return 'once a day';
    }
    if (perDay === 2) return 'twice a day';
    return T.words(perDay) + ' times a day';
  }
  var DOSE_TIMES = { 2: ['in the morning', 'at lunchtime'], 3: ['in the morning', 'at lunchtime', 'in the late afternoon'] };
  function takeWords(n, s, noun) {
    if (n === 0.5) return 'HALF a ' + noun + ' (' + fmt(s / 2) + ' mg)';
    var whole = Math.floor(n), half = n - whole > 1e-9;
    return T.words(whole).toUpperCase() + (half ? ' AND A HALF' : '') + ' ' + noun + (n > 1 ? 's' : '') + (half ? ' (' + fmt(n * s) + ' mg)' : '');
  }

  T.rxText = function (a) {
    var ch = obj(tx(a).choice), p = T.product(ch.product), d = p ? T.drug(p.drug) : null;
    var out = { lines: [], checks: [], qtyWords: '', quantity: null, warnings: [], errors: [], isCD: !!(d && d.isCD), dose: null, perDay: null, doses: null, coveredDays: null, stopped: false };
    function warn(t, src) { out.warnings.push(reason('warn', t, src || 'Clinical practice')); }
    function err(t, src) { var x = reason('err', t, src || 'Clinical practice'); out.errors.push(x); out.warnings.push(x); }
    out.checks = T.rxChecks(a, out.isCD).map(function (c) { return { id: c.id, t: c.t, ok: obj(ch.rx)[c.id] === true ? true : null, optional: c.optional === true, src: c.src || '' }; });
    if (!p) { warn('Choose a product first.'); return out; }
    if (T.age(a) === null) { err(AGE_MSG, AGE_SRC); return out; }

    var rd = T.rxDose(a);
    rd.warnings.forEach(function (w) { warn(w); });
    if (rd.dose === null) {
      if (rd.stopped) { out.stopped = true; err(rd.reason, 'Clinical practice'); }
      else warn(rd.reason || 'Enter the dose.');
      return out;
    }
    var daily = rd.dose, plan = T.dosePlan(a, p.id);
    out.dose = daily;

    /* Safety checks next to the wording: contraindications, misuse, the maximum, atomoxetine per kg. */
    (plan.blocked || []).forEach(function (x) { err('Do not prescribe: ' + x.text, x.src); });
    var b = obj(tx(a).baseline);
    if (isStimulant(d) && (b.misuse === 'moderate' || b.misuse === 'high')) {
      if (isIR(p)) err('Immediate-release stimulant with a risk of misuse or diversion: do not offer.', nice('1.7.24'));
      else if (p.diversionLower === false) err('Modified-release stimulant that is easier to inject or snort, with a risk of misuse or diversion: do not offer.', nice('1.7.24'));
    }
    if (plan.max !== null && daily > plan.max) {
      var capT = 'the ' + capName(plan);
      var overTxt = fmt(daily) + ' mg a day is above ' + capT + ' of ' + plan.max + ' mg: specialist off-label advice and a recorded reason are needed.' + (plan.bnfText && plan.maxSource !== 'bnf' ? ' ' + plan.bnfText + '.' : '');
      if (String(ch.overMaxReason || '').trim()) warn(overTxt + ' Reason recorded: ' + String(ch.overMaxReason).trim(), 'SmPC section 4.2; BNF');
      else err(overTxt, 'SmPC section 4.2; BNF');
    } else if (plan.usualMax !== null && daily > plan.usualMax) {
      var umWhy = String(ch.overMaxReason || '').trim();
      warn(fmt(daily) + ' mg a day is above the usual maximum of ' + plan.usualMax + ' mg a day. Up to ' + plan.max + ' mg a day is for rare cases only: a specialist decision. ' + (umWhy ? 'Reason recorded: ' + umWhy : 'Record the reason.'), (p.name || 'Dexamfetamine') + ' SmPC section 4.2');
    }
    if (plan.ceiling !== null && daily > plan.ceiling) err(fmt(daily) + ' mg a day is above 1.8 mg/kg a day (' + plan.ceiling + ' mg): doses this high have not been systematically evaluated, and it is above the BNFC maximum.', 'Atomoxetine SmPC section 4.2; BNFC');
    else if (plan.soft !== null && daily > plan.soft) warn(fmt(daily) + ' mg a day is above about 1.2 mg/kg a day (' + plan.soft + ' mg): no extra benefit has been shown above this.', 'Atomoxetine SmPC section 4.2');
    if (plan.needWeight) warn('Enter the weight: ' + (plan.maxText || 'the maximum depends on it.'), 'SmPC section 4.2');

    /* The number of doses a day: chosen (choice.perDay), or read from "When to take it", else the SmPC schedule. */
    var times = String(ch.times || '').trim(), tc = timesCount(times), chosen = num(ch.perDay), usual = plan.perDay || 1;
    var regSrc = 'Misuse of Drugs Regulations 2001 reg 15; SmPC section 4.2';
    if (tc === 'or') { err('"When to take it" gives a choice ("' + times + '"). A prescription must state one regimen, for example "each morning".', regSrc); return out; }
    if (tc === null && times && (chosen || usual) > 1) { err('It is not clear how many doses a day "' + times + '" means. Write it as, for example, "twice a day" or "morning and lunchtime".', regSrc); return out; }
    if (chosen !== null && typeof tc === 'number' && chosen !== tc) { err('"When to take it" says ' + perWord(tc) + ', but the dose is set to ' + perWord(chosen) + ': make them agree.', regSrc); return out; }
    var per = chosen !== null ? chosen : typeof tc === 'number' ? tc : usual, fixed = chosen !== null || typeof tc === 'number';
    var allowed = allowedPerDay(p);
    if (allowed.indexOf(per) < 0) { err(p.name + ' is given ' + allowedText(allowed) + ', but this prescription has ' + perWord(per) + '. Change "When to take it".', 'SmPC section 4.2'); return out; }
    if (per !== usual) warn('Written as ' + perWord(per) + '; the usual schedule for this product at this age is ' + perWord(usual) + '. Check that this is intended.', 'SmPC section 4.2');

    var noun = unitNoun(p), days = num(ch.supplyDays), qtySet = num(ch.quantity), reg = null;
    var typedDoses = Array.isArray(ch.doses) ? ch.doses.map(num).filter(function (x) { return x !== null && x > 0; }) : [];
    if (typedDoses.length) {
      var sum = r2(typedDoses.reduce(function (s, x) { return s + x; }, 0));
      if (Math.abs(sum - daily) > 1e-9) { err('The doses entered (' + typedDoses.map(fmt).join(' + ') + ' mg) add up to ' + fmt(sum) + ' mg, not ' + fmt(daily) + ' mg a day: correct them.', regSrc); return out; }
      if (typedDoses.length !== per) { err(typedDoses.length + ' doses are entered, but the prescription has ' + perWord(per) + ': make them agree.', regSrc); return out; }
      if (noun === 'ml') reg = { perDay: per, doses: typedDoses, made: null, equal: false };
      else {
        var mades = typedDoses.map(function (x) { return makeDose(x, strengthsOf(p), p.scored === true && noun === 'tablet'); });
        if (mades.some(function (m) { return !m; })) { warn(typedDoses.filter(function (x, i) { return !mades[i]; }).map(fmt).join(' mg, ') + ' mg cannot be made from the strengths of ' + p.name + ' (' + (p.strengths || []).join(', ') + ' mg).'); return out; }
        reg = { perDay: per, doses: typedDoses, made: mades, equal: typedDoses.every(function (x) { return x === typedDoses[0]; }) };
      }
    } else reg = regimen(p, daily, per, !fixed);
    if (!reg) {
      warn(fmt(daily / per) + ' mg cannot be made from the strengths of ' + p.name + ' (' + (p.strengths || []).join(', ') + ' mg).' + (isIR(p) ? ' Choose another number of doses a day (for example once a day for a small starting dose), or enter unequal doses.' : ''), 'SmPC section 4.2');
      return out;
    }
    if (reg.perDay !== per) warn('Written as ' + perWord(reg.perDay) + ': ' + fmt(daily) + ' mg a day cannot be split into ' + per + ' doses with these strengths. Check this suits the person, or change the dose.', 'SmPC section 4.2 (divided doses, usually 2 to 3)');
    else if (!reg.equal && !typedDoses.length) warn('Written as unequal doses (' + reg.doses.map(fmt).join(' mg + ') + ' mg): ' + fmt(daily) + ' mg a day cannot be split equally with these strengths. Check this suits the person.', 'SmPC section 4.2 (divided doses)');
    out.perDay = reg.perDay; out.doses = reg.doses.slice();
    var when = reg.equal ? timesText(ch, p, reg.perDay, warn) : null;
    var labels = DOSE_TIMES[reg.perDay] || reg.doses.map(function (x, i) { return 'dose ' + (i + 1); });

    if (noun === 'ml') {
      var conc = num((p.strengths || [])[0]) || 1;
      var mls = reg.doses.map(function (x) { return r2(x / conc); }), mlDay = r2(mls.reduce(function (s, x) { return s + x; }, 0));
      var qml = qtySet !== null ? qtySet : days !== null ? Math.ceil(mlDay * days - 1e-9) : null;
      out.quantity = qml; out.qtyWords = qml !== null ? T.words(qml) : '';
      out.coveredDays = days !== null ? days : (qml !== null && mlDay > 0 ? qml / mlDay : null);
      var takeMl = reg.equal ? fmt(mls[0]) + ' ml (' + fmt(reg.doses[0]) + ' mg) ' + when
        : mls.map(function (m, i) { return fmt(m) + ' ml (' + fmt(reg.doses[i]) + ' mg) ' + labels[i]; }).join(' and ') + ' (' + fmt(daily) + ' mg a day)';
      out.lines.push(p.name + ' ' + conc + ' mg/ml ' + formPlural(p) + '. Take ' + takeMl + '. ' +
        (qml !== null ? 'Supply ' + fmt(qml) + ' (' + out.qtyWords + ') ml.' : 'Supply: enter the supply days or the quantity.'));
    } else {
      /* Group the units by strength across the doses of the day. */
      var byS = {}, order = [];
      reg.made.forEach(function (parts, i) {
        parts.forEach(function (pt) {
          if (!byS[pt.s]) { byS[pt.s] = { s: pt.s, uses: [], perDayUnits: 0 }; order.push(pt.s); }
          byS[pt.s].uses.push({ i: i, n: pt.n }); byS[pt.s].perDayUnits += pt.n;
        });
      });
      var qs = order.map(function (s) { return days !== null ? Math.ceil(byS[s].perDayUnits * days - 1e-9) : null; });
      var covered = days;
      if (days === null && qtySet !== null) {
        if (order.length === 1) { qs[0] = qtySet; covered = qtySet / byS[order[0]].perDayUnits; }
        else {
          var dCov = qtySet / byS[order[0]].perDayUnits;
          if (Math.abs(dCov - Math.round(dCov)) < 1e-9) {
            covered = Math.round(dCov);
            qs = order.map(function (s, k) { return k === 0 ? qtySet : Math.ceil(byS[s].perDayUnits * covered - 1e-9); });
            warn('The quantity ' + qtySet + ' was read as the number of ' + order[0] + ' mg ' + noun + 's (' + covered + ' days); the other strength is worked out for the same days.', 'Misuse of Drugs Regulations 2001 reg 15');
          } else warn('For a dose made from more than one strength, enter the supply in days: ' + qtySet + ' ' + order[0] + ' mg ' + noun + 's is not a whole number of days.', 'Misuse of Drugs Regulations 2001 reg 15');
        }
      }
      out.coveredDays = covered;
      order.forEach(function (s, k) {
        var e = byS[s], q = qs[k], w = q !== null ? T.words(q) : '';
        if (k === 0) { out.quantity = q; out.qtyWords = w; }
        var take, others = order.filter(function (x) { return x !== s; });
        if (reg.equal) {
          var n = e.uses[0].n;
          var withTxt = others.length ? ' with ' + others.map(function (o) { var on = byS[o].uses[0].n; return (on === 0.5 ? 'half a ' + o + ' mg ' + noun : lc(takeWords(on, o, noun)).replace(noun, o + ' mg ' + noun)); }).join(' and ') + ' (' + fmt(reg.doses[0]) + ' mg in total)' : '';
          take = takeWords(n, s, noun) + ' ' + when + withTxt;
        } else {
          take = e.uses.map(function (u) { return takeWords(u.n, s, noun) + ' ' + labels[u.i]; }).join(' and ') +
            (others.length ? ' (' + fmt(daily) + ' mg a day in total with the ' + others.join(' mg and ') + ' mg ' + noun + 's)' : ' (' + fmt(daily) + ' mg a day)');
        }
        out.lines.push(p.name + ' ' + s + ' mg ' + formPlural(p) + '. Take ' + take + '. ' +
          (q !== null ? 'Supply ' + q + ' (' + w + ') ' + noun + (q === 1 ? '' : 's') + '.' : qtySet !== null ? 'Supply: enter the supply in days.' : 'Supply: enter the supply days or the quantity.'));
      });
    }
    if (out.isCD) {
      if (out.coveredDays !== null && out.coveredDays > 30 + 1e-9 && !String(ch.supplyReason || '').trim()) warn('Schedule 2 controlled drug: supply is over 30 days (' + Math.floor(out.coveredDays + 1e-9) + ' days). Good practice is 30 days or less; record the reason if more is needed.', 'NICE NG46 1.5.5');
      warn('Schedule 2 controlled drug: total quantity in words and figures; valid for 28 days; no repeats and no emergency supply.', 'Misuse of Drugs Regulations 2001 regs 15–16; Human Medicines Regulations 2012');
    }
    if (!plan.licensed && plan.licenceNote) warn(plan.licenceNote, (plan.licence && plan.licence.src) || 'SmPC section 4.1');
    return out;
  };

  /* ---------------- step progress ---------------- */
  /* Plan items that apply only in some situations (NICE NG87): parent training with oppositional or conduct
     symptoms (1.5.11); CBT when medicine helped but problems remain (1.5.14); adult non-drug treatment when the
     person chooses not to take medicine, cannot take it, or it did not work or was not tolerated, or alongside
     medicine that helped but left significant impairment (1.5.16–1.5.18); the medication criteria once the
     baseline checks are done (1.5.13, 1.7.4); the diagnosis re-check before medicine (tp_recheck, 1.7.4) unless the
     plan is non-drug support only or a referral ('medication'). A data item may set `when` to one of these keys. An
     item answered 'na' (not applicable) is never counted; a ticked item always counts. */
  var PLAN_WHEN = { tp_parenttrain: 'oddcd', tp_cbt: 'medhelps', tp_nondrug: 'nondrug', tp_psych: 'nondrug', tp_medcriteria: 'baseline', tp_recheck: 'medication' };
  function latestEffect(a) { var rs = T.currentReviews(a); for (var i = rs.length - 1; i >= 0; i--) if (rs[i].effect) return rs[i].effect; return null; }
  T.planItemApplies = function (a, x) {
    if (!x) return false;
    var w = x.when || PLAN_WHEN[x.id];
    if (!w) return true;
    if (w === 'oddcd') { var dd = obj(a && a.ddx); return ['odd', 'conduct'].some(function (k) { var v = obj(dd[k]).verdict; return v === 'comorbid' || v === 'uncertain'; }); }
    if (w === 'medhelps') return latestEffect(a) === 'some';
    if (w === 'nondrug') {
      if (obj(tx(a).plan).decision === 'nondrug') return true;
      if (priorList(a).some(function (p) { return ['not_tolerated', 'no_response', 'partial'].indexOf(p.outcome) >= 0; })) return true;
      return latestEffect(a) === 'some';
    }
    if (w === 'baseline') return T.baselineVerdict(a).missing.length === 0;
    if (w === 'medication') return medicationPlanned(a);
    return true;
  };
  var TX_STEPS = ['txplan', 'baseline', 'prescribe', 'titrate', 'monitor'];
  T.STEPS = TX_STEPS.slice();
  T.stepProgress = function (a, stepId) {
    if (TX_STEPS.indexOf(stepId) < 0) return null;
    if (!a) return { done: 0, of: 1 };
    var app = T.applicable(a), t = tx(a), plan = obj(t.plan);
    if (stepId === 'txplan') {
      if (!app.ok) return { done: plan.decision ? 1 : 0, of: 1 };
      var steps = obj(plan.steps), team = obj(plan.team);
      var done = plan.decision ? 1 : 0, of = 1;
      T.planItems(a).forEach(function (x) {
        var v = steps[x.id];
        if (v === 'na') return;
        if (v) { done++; of++; return; }
        if (T.planItemApplies(a, x)) of++;
      });
      if (plan.decision === 'medication') { of += 3; done += ['specialist', 'competent', 'supervised'].filter(function (k) { return team[k] === true; }).length; }
      return { done: done, of: of };
    }
    if (!app.ok || !medicationPlanned(a)) return { done: 0, of: 0 };
    if (stepId === 'baseline') { var v = T.baselineVerdict(a); return { done: v.done, of: v.of }; }
    if (stepId === 'prescribe') {
      /* Counselling and prescription checks count once a medicine is chosen (the view shows them then).
         Optional prescription checks (instalments, private forms) are never counted. */
      var ch = obj(t.choice);
      var counsel = T.counselItems(a);
      var rxs = ch.drug ? T.rxChecks(a).filter(function (c) { return c.optional !== true; }) : [];
      var cs = obj(ch.counsel), rx = obj(ch.rx);
      var base = [ch.drug, ch.product, num(ch.startDose) !== null, ch.startDate, num(ch.supplyDays) !== null || num(ch.quantity) !== null];
      return {
        done: base.filter(Boolean).length + counsel.filter(function (c) { return cs[c.id]; }).length + rxs.filter(function (c) { return rx[c.id]; }).length,
        of: base.length + counsel.length + rxs.length
      };
    }
    if (stepId === 'titrate') {
      /* The current medicine: at least one review, and a dose optimised (with no flag left to act on) or stopped. */
      var ms = T.medState(a);
      return { done: (ms.reviews.length ? 1 : 0) + (ms.optimised || ms.stopped ? 1 : 0), of: 2 };
    }
    /* monitor. The transition plan counts from 13, when the view shows it: NICE NG43 1.2.1 starts planning
       for adult services by Year 9 (age 13 to 14) at the latest. */
    var mon = obj(t.monitor), age = T.age(a), trans = T.group(a) === 'young' && age !== null && age >= 13;
    return { done: (mon.shared ? 1 : 0) + (mon.nextReview ? 1 : 0) + (trans && mon.transition ? 1 : 0), of: 2 + (trans ? 1 : 0) };
  };
})(typeof window !== 'undefined' ? window.AA : globalThis.AA);
