/* Treatment steps (phase "Treat") of the assessment workspace:
     txplan     Treatment plan              the decision, who can start the medicine (scope), support and NICE steps
     baseline   Pre-treatment checks        the live verdict, then four sets of checks one at a time: measurements,
                                            heart history, the safety screen, and medicines, misuse, pregnancy and driving
     prescribe  Choose and prescribe        six stages, one at a time: previous medicines > NICE options > product
                                            (comparison cards) > starting dose (titration ladder) > counselling > prescription
     titrate    Titration and reviews       the dose now, the trial clock and the next dose, then a timeline of reviews
     monitor    Monitoring and shared care  schedule with due and overdue chips, annual review, shared care letter, transition
   Every step has the same shape (DESIGN.md): safety and readiness notes, a summary card (ui.hero: the status, key
   facts and the next action), one card per part, and one closed "Sources" disclosure at the end. No card sits
   inside another card: inside a card, meaning is a left bar, a dot or a label.
   Also exports AA.components.treatPanel(panelEl, a, ctx) (live panel for the treatment steps),
   AA.components.treatmentReport(a) (report sections) and AA.components.sharedCareLetter(a) ({title, sections}).
   Clinical rules live in js/engine/treatment.js (AA.treatment) and js/data/tx-*.js; this file renders them
   and saves what the clinician records with ctx.set('treatment.<path>', value) (undefined deletes).
   Previous medicines and reviews are maps keyed by AA.util.uid(). Results are prompts for the clinician:
   nothing here stops them recording. Verdicts and warnings each carry a next action.
   Sources sit in one closed "Sources" disclosure at the end of each step.
   Styles: css/v-assess-tx.css (prefix .tx-). */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui;
  AA.steps = AA.steps || {};
  AA.components = AA.components || {};

  /* =================================================================================
     Small helpers
     ================================================================================= */
  function T() { return AA.treatment || null; }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function obj(x) { return x && typeof x === 'object' && !Array.isArray(x) ? x : {}; }
  function nil(v) { return v === null ? undefined : v; }
  function textOrNone(v) { return String(v == null ? '' : v).trim() ? v : undefined; }
  /* Replace a host's content, but only when the new content differs (text and classes). Live hosts are
     repainted on every change, so this keeps focus, open disclosures and screen readers quiet. */
  function sigOf(el) { return el.textContent + '#' + U.$$('*', el).map(function (n) { return typeof n.className === 'string' ? n.className : ''; }).join(','); }
  function fill(host, node) {
    var tmp = document.createElement('div');
    U.append(tmp, node);
    var sig = sigOf(tmp);
    if (host.__txSig === sig) return host;
    host.__txSig = sig;
    U.clear(host);
    while (tmp.firstChild) host.appendChild(tmp.firstChild);
    return host;
  }
  function num(v) {
    if (v === null || v === undefined || v === '' || typeof v === 'boolean') return null;
    var n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
    return isFinite(n) ? n : null;
  }
  function fmt(n) { return n === null || n === undefined ? '' : String(Math.round(n * 100) / 100); }
  function uniq(list) { var out = []; list.forEach(function (x) { if (x && out.indexOf(x) < 0) out.push(x); }); return out; }
  function lc(s) { return String(s || '').toLowerCase(); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  function txOf(a) { return obj(a && a.treatment); }
  function today() { return U.today ? U.today() : new Date().toISOString().slice(0, 10); }
  function dateText(iso) { return iso ? (U.fmtDate(iso) || String(iso)) : ''; }
  function copy(text, what) {
    U.copyText(text).then(function (ok) { U.toast(ok ? what + ' copied' : 'Copy failed. Your browser blocked the clipboard.', ok ? 'ok' : 'err'); });
  }
  /* The engine and the core data must be loaded before any treatment view can work. */
  function ready() {
    var t = T();
    return !!(t && typeof t.group === 'function' && typeof t.applicable === 'function' && arr(AA.data.txDrugs).length && arr(AA.data.txProducts).length);
  }
  function notLoaded() {
    return ui.callout('warn', h('p', null, 'Reload the page. If this message stays, the treatment files are missing from this build, so record the plan in the notes of the Report step.'), 'Treatment data not loaded');
  }
  /* Clause numbers inside engine sentences, for example "(1.7.8)" or "(NICE NG87 1.7.24)": the closed Sources
     disclosure holds them, so they are taken out of the text on screen. A few engine phrases name a clause
     without brackets; those are reworded. */
  function stripClauses(s) {
    return String(s || '')
      .replace(/\s*\((?:NICE )?(?:NG87 )?1\.\d+\.\d+[^)]*\)/g, '')
      .replace(/\ba 1\.7\.5 feature\b/g, 'on the NICE list of heart risks')
      .replace(/\b1\.7\.5 features?\b/g, 'NICE heart risks')
      .replace(/,?\s*(?:NICE (?:NG87 )?)?1\.7\.10 applies/g, ', atomoxetine or guanfacine are the next NICE step')
      .replace(/\s+([.,;:])/g, '$1');
  }

  /* Age group: 'young' (6-17), 'adult' (18+ or age missing), 'under6'. */
  function grp(a) { return T().group(a); }
  function isYoung(a) { return grp(a) === 'young'; }
  function ageOf(a) { return T().age(a); }
  function bandOf(a) { var t = T(); return t && typeof t.band === 'function' ? t.band(a) : 'adult'; }
  function who(a) { var b = bandOf(a); return b === 'child' ? 'the child' : (b === 'teen' || b === 'y17') ? 'the young person' : 'the person'; }
  /* Data items may carry ages ('young' | 'adult' | 'all'), ageMin and ageMax (years, inclusive).
     The engine's T.forAge(a, item) decides when it exists, so the view and the step counts agree. */
  function fitsAge(x, a) {
    if (!x) return false;
    var t = T();
    if (t && typeof t.forAge === 'function') return !!t.forAge(a, x);
    var g = grp(a) === 'adult' ? 'adult' : 'young', ag = x.ages;
    if (ag && ag !== 'all' && ag !== g) return false;
    var age = ageOf(a);
    if (x.ageMin !== undefined && x.ageMin !== null && age !== null && age < x.ageMin) return false;
    if (x.ageMax !== undefined && x.ageMax !== null && age !== null && age > x.ageMax) return false;
    return true;
  }

  function drugOf(id) { return id ? AA.byId('txDrugs', id) : null; }
  function prodOf(id) { return id ? AA.byId('txProducts', id) : null; }
  function drugName(id) { var d = drugOf(id); return d ? d.name : (id || ''); }
  function prodName(id) { var p = prodOf(id); return p ? p.name : (id || ''); }
  function histLabel(id) {
    var out = null;
    arr(AA.data.history).some(function (s) {
      return arr(s && s.items).some(function (it) { if (it && it.id === id) { out = it.t; return true; } return false; });
    });
    return out || id;
  }
  /* ---------- The medicine taken now: its reviews, state and dose ----------
     Each review stores the medicine it belongs to (drug and product). Only the reviews of the medicine chosen now
     set its dose, its trial and its state; blood pressure, pulse and weight history still use every review, so
     they carry across a switch. The engine works this out (currentReviews, medState, rxDose, trial, nextDose,
     rxText); the local rules below are used only when an older engine without them is loaded, so the view and the
     step progress always agree. */
  function newEngine() { var t = T(); return typeof t.medState === 'function' && typeof t.rxDose === 'function' && typeof t.currentReviews === 'function'; }
  function curReviews(a) {
    var t = T();
    if (typeof t.currentReviews === 'function') { try { return arr(t.currentReviews(a)); } catch (e) { /* use the rule below */ } }
    var ch = obj(txOf(a).choice);
    return t.reviewsSorted(a).filter(function (r) {
      if (r.drug) return r.drug === ch.drug;
      if (!ch.startDate) return true;
      return !!r.date && r.date > ch.startDate;
    });
  }
  function curLatest(a) { var rs = curReviews(a); return rs.length ? rs[rs.length - 1] : null; }
  /* The record with only the current medicine's reviews, for an older engine that does not filter them. */
  function curRec(a) {
    var t = T();
    if (!a || typeof t.currentReviews === 'function') return a;
    var keep = {}, revs = obj(txOf(a).reviews);
    curReviews(a).forEach(function (r) { keep[r.id] = revs[r.id]; });
    return Object.assign({}, a, { treatment: Object.assign({}, txOf(a), { reviews: keep }) });
  }
  /* Flags that need action before going on (heart rate or blood pressure on 2 occasions, troublesome or urgent
     side effects), and a recorded reason to go on despite them (reviews.<id>.flagOverride). */
  function seriousFlags(a, id) { return T().reviewFlags(a, id).filter(function (f) { return f.level === 'urgent' || f.level === 'act'; }); }
  function overridden(r) { return !!String(obj(r).flagOverride || '').trim(); }
  /* Where the current medicine stands, read from its latest decision (reviews with no decision yet are skipped):
       stopped    the latest decision is "Stop";
       optimised  the latest decision is "Optimised", or "Stay" after it with no increase, reduce, switch or stop
                  since, and that review raised no act or urgent flag (unless a reason to go on is recorded);
       held       the dose was marked optimised, but its flags need action first. */
  function medState(a) {
    var t = T();
    if (typeof t.medState === 'function') {
      try { var m = t.medState(a); if (m && Array.isArray(m.reviews)) return m; } catch (e) { /* use the rule below */ }
    }
    var rs = curReviews(a), out = { reviews: rs, latest: rs.length ? rs[rs.length - 1] : null, stopped: false, stopReview: null, optimised: false, optReview: null, held: false };
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
      out.held = seriousFlags(a, out.optReview.id).length > 0 && !overridden(out.optReview);
      out.optimised = !out.held;
    }
    return out;
  }
  function stopText(ms) { var r = ms.stopReview; return 'Medicine stopped at the review' + (r && r.date ? ' on ' + dateText(r.date) : ''); }
  /* The daily dose now, which is also the dose of the next prescription: {dose, stopped, reason, from, review}.
     dose is null after "Stop", and while a new dose agreed at the latest review still has to be entered (reason
     says what to do). */
  function doseNow(a) {
    var t = T(), ch = obj(txOf(a).choice), ms = medState(a);
    if (ms.stopped) return { dose: null, stopped: true, reason: stopText(ms), from: 'stop' };
    if (typeof t.rxDose === 'function') {
      try {
        var r = t.rxDose(a);
        if (typeof r === 'number' && isFinite(r)) return { dose: r, stopped: false, from: 'engine' };
        if (r && typeof r === 'object') {
          var why = String(r.reason || r.text || '').replace(/:\s*no prescription\.?$/i, '');
          if (r.stopped === true) return { dose: null, stopped: true, reason: why || stopText(ms), from: 'stop' };
          return { dose: num(r.dose), stopped: false, from: r.from || null, reason: why, review: r.review || null };
        }
      } catch (e) { /* use the rule below */ }
    }
    var last = ms.latest, rx = num(ch.rxDose);
    if (rx !== null && (!last || (ch.rxDoseDate && (!last.date || String(ch.rxDoseDate) >= String(last.date))))) return { dose: rx, stopped: false, from: 'rx' };
    if (last) {
      var nd = num(last.newDose), d = num(last.dose);
      if (nd !== null) return { dose: nd, stopped: false, from: 'review', review: last };
      if (d !== null) return { dose: d, stopped: false, from: 'review', review: last };
    }
    var sd = num(ch.startDose);
    return { dose: sd, stopped: false, from: sd !== null ? 'start' : null };
  }
  /* The daily dose the person takes now (null after "Stop"). */
  function currentDose(a) { return doseNow(a).dose; }
  /* Prescription wording from the same dose as the panel and the letter. An older engine without rxDose gets a
     copy of the record that carries this dose as the prescription dose. After "Stop": no wording. */
  function rxTextOf(a) {
    var t = T(), dn = doseNow(a), out;
    if (typeof t.rxDose === 'function') out = t.rxText(a);
    else {
      var ch = Object.assign({}, obj(txOf(a).choice));
      if (dn.dose !== null) { ch.rxDose = dn.dose; ch.rxDoseDate = '9999-12-31'; } else { delete ch.rxDose; delete ch.rxDoseDate; }
      out = t.rxText(Object.assign({}, a, { treatment: Object.assign({}, txOf(a), { choice: ch }) }));
    }
    if (dn.stopped) out = Object.assign({}, out, { lines: [], quantity: null, qtyWords: '', stopped: true, warnings: [dn.reason + ': no prescription.'] });
    return out;
  }
  /* The next dose suggestion for the current medicine, from the dose agreed at the latest review. */
  function nextDoseOf(a) {
    var t = T(), ms = medState(a);
    if (ms.stopped) return { dose: null, stopped: true, atMax: false, text: 'Medicine stopped at the last review: no next dose.' };
    if (newEngine()) return t.nextDose(a);
    var rec = curRec(a), last = ms.latest;
    if (last && num(last.newDose) !== null) {
      var revs = Object.assign({}, obj(txOf(rec).reviews));
      revs[last.id] = Object.assign({}, revs[last.id], { dose: num(last.newDose) });
      rec = Object.assign({}, rec, { treatment: Object.assign({}, txOf(rec), { reviews: revs }) });
    }
    return t.nextDose(rec);
  }
  /* The trial clock for the current medicine. An adequate trial is 6 weeks AT the optimised (or maximum) dose, not
     6 weeks since the first dose: the engine's trial gives adequate, weeksAtDose and doseDate. With an older engine
     that has no weeksAtDose, the weeks are counted here from the review that marked the dose optimised. */
  function trialView(a) {
    var t = T(), ms = medState(a);
    if (newEngine()) {
      var te = t.trial(a);
      if (te && te.weeksAtDose !== undefined) return { tr: te, ms: ms, adequate: !!te.adequate, optimised: !!te.optimised, stopped: !!te.stopped, held: !!te.held, text: te.text };
    }
    var tr = Object.assign({}, t.trial(curRec(a)));
    var opt = ms.optimised && ms.optReview && ms.optReview.date ? ms.optReview : null;
    var since = opt ? t.daysBetween(opt.date, today()) : null;
    tr.doseDate = opt ? opt.date : null;
    tr.weeksAtDose = since !== null ? Math.max(0, Math.floor(since / 7)) : 0;
    var adequate = !ms.stopped && !!opt && tr.weeksAtDose >= tr.need;
    tr.adequate = adequate;
    var text = tr.days === null ? tr.text : 'Week ' + tr.weeks + ' since starting. ';
    if (tr.days !== null) {
      if (ms.stopped) text += stopText(ms) + '.';
      else if (opt) text += adequate ? 'Adequate trial: ' + tr.weeksAtDose + ' weeks at the optimised dose (' + tr.need + ' needed).' : tr.weeksAtDose + ' of ' + tr.need + ' weeks at the optimised dose so far: not yet an adequate trial.';
      else if (ms.held) text += 'The dose was marked optimised, but the flags from that review need action first. The ' + tr.need + ' weeks start once the dose is optimised.';
      else text += 'Not yet adequate: the ' + tr.need + ' weeks start once the dose is optimised. Titrate to the best tolerated dose.';
    }
    return { tr: tr, ms: ms, adequate: adequate, optimised: ms.optimised, stopped: ms.stopped, held: ms.held, text: text };
  }
  /* The trial chip: the 6 weeks count from the optimised (or maximum) dose, not from the start. */
  function weekText(tr) {
    return tr.doseDate ? (tr.weeksAtDose || 0) + ' of ' + tr.need + ' weeks at this dose' + (tr.adequate ? ' (reached)' : '') : 'Week ' + tr.weeks + ' since starting';
  }
  function weekProg(tr) { return tr.doseDate ? Math.min(tr.weeksAtDose || 0, tr.need) : 0; }
  function bpOf(o) { var s = num(o && o.sbp), d = num(o && o.dbp); return s !== null && d !== null ? s + '/' + d : null; }
  /* Baseline blood pressure as the engine judges it. With a second reading, NICE NG136 counts the lower of
     the two. The engine's bpCheck may return that reading as `clinic` ({sbp, dbp}); without it, the same rule
     as the engine picks it: the reading with the lower systolic, then the lower diastolic. */
  function clinicBp(a, b) {
    var rep = obj(b.repeat);
    if (!bpOf(rep) || !bpOf(b) || isYoung(a)) return null;
    try { var c = bpOf(obj(T().bpCheck(a, b).clinic)); if (c) return c; } catch (e) { /* use the rule below */ }
    /* With a third reading (baseline.repeat3), the lower of the last two counts. */
    var r3 = obj(b.repeat3), x = bpOf(r3) ? { s: num(rep.sbp), d: num(rep.dbp) } : { s: num(b.sbp), d: num(b.dbp) };
    var y = bpOf(r3) ? { s: num(r3.sbp), d: num(r3.dbp) } : { s: num(rep.sbp), d: num(rep.dbp) };
    var lo = y.s < x.s || (y.s === x.s && y.d < x.d) ? y : x;
    return lo.s + '/' + lo.d;
  }
  /* The baseline reading to show: the clinic reading, else both readings, else the first. */
  function baseBp(a, b) {
    var first = bpOf(b), rep = bpOf(obj(b.repeat));
    if (!first || !rep || isYoung(a)) return first;
    return clinicBp(a, b) || first + ', then ' + rep;
  }
  /* Latest value of a measure: reviews first (newest), then the baseline. key: bp | pulse | weightKg | heightCm */
  function latestMeasure(a, key) {
    var rs = T().reviewsSorted(a);
    for (var i = rs.length - 1; i >= 0; i--) {
      var v = key === 'bp' ? bpOf(rs[i]) : num(rs[i][key]);
      if (v !== null) return { v: v, date: rs[i].date || '', from: 'review' };
    }
    var b = obj(txOf(a).baseline), bv = key === 'bp' ? baseBp(a, b) : num(b[key]);
    return bv !== null ? { v: bv, date: b.date || '', from: 'baseline' } : null;
  }
  function measureText(key, v) {
    if (v === null || v === undefined) return '';
    return key === 'bp' ? v + ' mmHg' : key === 'pulse' ? v + ' bpm' : key === 'weightKg' ? fmt(v) + ' kg' : fmt(v) + ' cm';
  }

  /* ---------- form controls ---------- */
  /* Number input: saves a number, or undefined when empty. Debounced like ui.input. */
  function numIn(value, onSave, o) {
    o = o || {};
    var el = h('input', { type: 'number', inputmode: o.int ? 'numeric' : 'decimal', step: o.int ? '1' : 'any', min: o.min === undefined ? '0' : o.min, max: o.max, placeholder: o.placeholder, autocomplete: 'off' });
    el.value = value === null || value === undefined ? '' : String(value);
    var save = U.debounce(function () {
      var raw = String(el.value || '').trim();
      var n = raw === '' ? null : parseFloat(raw.replace(',', '.'));
      onSave(n === null || !isFinite(n) ? undefined : n);
    }, 350);
    el.addEventListener('input', save);
    el.addEventListener('blur', function () { save.flush(); });
    return el;
  }
  function textIn(value, onSave, o) {
    o = o || {};
    return ui.input({ value: value || '', rows: o.rows, placeholder: o.placeholder, onSave: function (v) { onSave(textOrNone(v)); } });
  }
  function dateIn(value, onSave) {
    return ui.input({ type: 'date', value: value || '', onSave: function (v) { onSave(v || undefined); } });
  }
  function selectIn(options, value, onChange) {
    var cur = value === null || value === undefined ? '' : String(value);
    var s = h('select', null, options.map(function (o) { return h('option', { value: o[0], selected: cur === o[0] }, o[1]); }));
    s.addEventListener('change', function () { onChange(s.value); });
    return s;
  }
  function goBtn(ctx, step, label) { return ui.btn({ label: label, kind: 'ghost', small: true, onClick: function () { ctx.go(step); } }); }

  /* ---------- display pieces ---------- */
  var KIND = { ok: 'ok', caution: 'warn', ecg: 'warn', cardiology: 'err', stop: 'err', risk: 'err', stopmix: 'err', incomplete: 'info', unknown: 'info', repeat: 'warn',
    confirm: 'warn', refer: 'err', urgent: 'err', act: 'warn', watch: 'info', ci: 'err', info: 'info', warn: 'warn', err: 'err' };
  function kindOf(level) { return KIND[level] || 'info'; }
  /* A note with a coloured left bar (no tinted box, so it can sit inside a card). body: text, node or array. */
  function note(kind, title, body, actions, cls) {
    var acts = arr(actions).filter(Boolean);
    return h('div', { class: 'tx-note tx-note-' + kindOf(kind) + (cls ? ' ' + cls : '') },
      title ? h('p', { class: 'tx-note-t' }, typeof title === 'string' ? stripClauses(title) : title) : null,
      body === null || body === undefined || body === '' ? null : typeof body === 'string' ? h('p', null, stripClauses(body)) : body,
      acts.length ? h('div', { class: 'row tx-note-act' }, acts) : null);
  }
  /* Bullets and key-value rows show engine and data text, so clause numbers are taken out here too. */
  function bullets(items) { return h('ul', { class: 'tx-ul' }, items.map(function (t) { return h('li', null, stripClauses(String(t))); })); }
  function kvList(rows) {
    rows = rows.filter(function (r) { return r && r[1] !== null && r[1] !== undefined && r[1] !== ''; });
    if (!rows.length) return null;
    return h('dl', { class: 'tx-kv' }, rows.map(function (r) { return h('div', null, h('dt', null, r[0]), h('dd', null, typeof r[1] === 'string' ? stripClauses(r[1]) : r[1])); }));
  }
  /* Table that becomes labelled cards on phones (td data-label). Cells may be nodes. */
  function stackTable(head, rows, cls) {
    return h('div', { class: 'table-wrap tx-stack' + (cls ? ' ' + cls : '') }, h('table', { class: 'table table-compact' },
      h('thead', null, h('tr', null, head.map(function (c) { return h('th', { scope: 'col' }, c); }))),
      h('tbody', null, rows.map(function (r) {
        return h('tr', null, r.map(function (c, i) { return i === 0 ? h('th', { scope: 'row' }, c) : h('td', { 'data-label': head[i] }, c); }));
      }))));
  }
  /* A card. The title (h3: cards sit under a section, stage or set heading) and an aside (badges, a count) are
     optional. */
  function card(title, children, cls, aside) {
    var head = title || aside ? h('div', { class: 'tx-card-head' }, title ? h('h3', { class: 'tx-card-h' }, title) : null, aside || null) : null;
    return h(title ? 'section' : 'div', { class: 'card tx-card' + (cls ? ' ' + cls : '') }, head, children);
  }
  /* A part of the page: a heading, one line on what it is for, then its card. */
  function section(id, title, text, content, actions) {
    var acts = arr(actions).filter(Boolean);
    var s = ui.section({ id: id, title: title, text: text, actions: acts.length ? h('div', { class: 'tx-sec-act' }, acts) : null }, content);
    s.classList.add('tx-sec');
    return s;
  }
  /* Bring a part of the page into view and move the focus to its heading (summary facts and "Go to" buttons). */
  function reveal(el) {
    if (!el) return;
    try { el.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { try { el.scrollIntoView(); } catch (e2) { /* ignore */ } }
    var hd = el.querySelector && el.querySelector('h2, h3');
    if (hd) {
      if (!hd.hasAttribute('tabindex')) hd.setAttribute('tabindex', '-1');
      try { hd.focus({ preventScroll: true }); } catch (e3) { /* ignore */ }
    }
  }
  function narrow() { try { return window.matchMedia('(max-width: 760px)').matches; } catch (e) { return false; } }
  /* Lower-case the first letter of a label, but not of an acronym ("NICE options" stays as it is). */
  function low(s) { return String(s || '').replace(/^([A-Z])(?=[a-z])/, function (m) { return m.toLowerCase(); }); }
  /* "6 of 9" count chip: green with a tick when complete, amber when started (the words say it too). With nothing
     to count (every item does not apply yet), it says so. */
  function paintCnt(el, done, of, suffix) {
    var full = of > 0 && done >= of;
    var cls = 'tx-cnt' + (full ? ' is-full' : done > 0 ? ' is-part' : '');
    var txt = !of && !done ? 'Does not apply now' : (full ? '✓ ' : '') + done + ' of ' + of + (suffix ? ' ' + suffix : '');
    if (el.className !== cls) el.className = cls;
    if (el.textContent !== txt) el.textContent = txt;
    return el;
  }
  function cnt(done, of, suffix) { return paintCnt(h('span'), done, of, suffix); }
  /* Grouped disclosures (ui.acc) that keep one group open at a time. */
  function oneOpen(wrap) {
    var ds = U.$$('details', wrap).filter(function (d) { return d.parentNode === wrap; });
    ds.forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) ds.forEach(function (x) { if (x !== d && x.open) x.open = false; }); }); });
    return wrap;
  }
  /* A group title with its one-line purpose. */
  function accTitle(t, sub) { return [h('span', { class: 'tx-acc-t' }, t), sub ? h('span', { class: 'tx-acc-s' }, sub) : null]; }

  /* ---------- The summary card at the top of each step ----------
     Where things stand (a headline with an icon, a status badge and key facts) and the next action. Built on the
     shared hero card (ui.hero); its top bar, icon and badge take the tone of the status, and the words say it too. */
  var TONE_ICON = { ok: 'check', warn: 'alert', err: 'alert', info: 'info', neutral: 'info' };
  /* Key facts in a row: [{k: label, v: value, s: small line, kind: ok|warn|err|info|neutral (a dot), onClick, title}].
     A fact with onClick is a button that opens the part of the step it sums up. */
  function factList(facts) {
    facts = arr(facts).filter(Boolean);
    if (!facts.length) return null;
    return h('ul', { class: 'tx-facts' }, facts.map(function (f) {
      var inner = [h('span', { class: 'tx-fact-k' }, f.k),
        h('span', { class: 'tx-fact-v' }, f.kind ? h('span', { class: 'tx-fdot tx-fdot-' + f.kind, 'aria-hidden': 'true' }) : null, h('span', null, f.v)),
        f.s ? h('span', { class: 'tx-fact-s' }, f.s) : null];
      return h('li', null, f.onClick ? h('button', { type: 'button', class: 'tx-fact is-btn', onclick: f.onClick, title: f.title || null }, inner) : h('div', { class: 'tx-fact' }, inner));
    }));
  }
  function progLine(done, of, text, label, extra) {
    return h('div', { class: 'tx-progline' }, ui.progress(done || 0, of || 0, label || text), h('span', { class: 'tx-progtext' }, text), extra || null);
  }
  /* o: {kind: ok|warn|err|info|neutral, eyebrow, badge: [text, kind], title, text, progress (node), facts, extra
     (nodes), next (text after "Next:"), nextLabel (instead of "Next"), actions: [buttons]} */
  function summaryCard(o) {
    var kind = o.kind || 'info';
    var body = h('div', { class: 'tx-sum-body' },
      o.progress || null,
      o.text ? h('p', { class: 'tx-sum-p' }, typeof o.text === 'string' ? stripClauses(o.text) : o.text) : null,
      factList(o.facts),
      o.extra || null,
      o.next ? h('p', { class: 'tx-sum-next' }, h('strong', null, (o.nextLabel || 'Next') + ': '), typeof o.next === 'string' ? stripClauses(o.next) : o.next) : null);
    var hero = ui.hero({
      eyebrow: [h('span', { class: 'tx-sum-k' }, o.eyebrow), o.badge ? ui.badge(o.badge[0], o.badge[1]) : null],
      title: [h('span', { class: 'tx-sum-ico', 'aria-hidden': 'true' }, ui.icon(TONE_ICON[kind] || 'info')), h('span', { class: 'tx-sum-t' }, o.title)],
      label: o.eyebrow,
      text: body,
      actions: arr(o.actions).filter(Boolean)
    });
    hero.classList.add('tx-sum', 'tx-sum-' + kind);
    return hero;
  }
  function srcOf(x) {
    if (!x) return [];
    if (typeof x === 'string') return x.trim() ? [x.trim()] : [];
    return arr(x).filter(function (s) { return typeof s === 'string' && s.trim(); }).map(function (s) { return s.trim(); });
  }
  function sourcesBox(list, open) {
    list = uniq(list);
    if (!list.length) return null;
    return ui.details('Sources', h('ul', { class: 'source tx-srclist' }, list.map(function (s) { return h('li', null, s); })),
      { cls: 'guide-src tx-src', meta: String(list.length), open: !!open });
  }
  /* One closed "Sources" disclosure at the end of a step; rebuilt only when the list changes. */
  function stepSources(el, fn) {
    var host = h('div', { class: 'tx-srchost' }), key = null;
    el.appendChild(host);
    return { paint: function (a) {
      var list = [];
      fn(a).forEach(function (s) { srcOf(s).forEach(function (x) { list.push(x); }); });
      list = uniq(list);
      var k = list.join('|');
      if (k === key) return;
      key = k;
      var was = host.querySelector('details');
      fill(host, sourcesBox(list, !!(was && was.open)));
    } };
  }
  /* Shown at the top of a treatment step when treatment does not apply (no diagnosis, deferred, under 6). */
  function applicNote(ctx, a, step) {
    var ap = T().applicable(a);
    /* Treatment applies, but with a caution (other specified ADHD is outside NICE), or the age is missing. */
    if (ap.ok) {
      var bits = [];
      if (ap.caution && ap.reason) bits.push(note('warn', 'Other specified ADHD: medicine is outside NICE', stripClauses(ap.reason), [goBtn(ctx, 'summary', 'Go to scoring and diagnosis')]));
      if (ap.ageMissing) bits.push(note('warn', 'Age not recorded', stripClauses(ap.note || 'Record the age in Setup: doses, maxima and licences depend on it.'), [goBtn(ctx, 'setup', 'Go to the first step')]));
      return bits.length ? h('div', { class: 'tx-ready' }, bits) : null;
    }
    if (ap.code === 'under6' && step !== 'txplan') return null;   /* the frame already shows the under-6 card */
    var titles = { under6: 'Under 6: refer', 'not-met': 'ADHD was not diagnosed', deferred: 'The diagnosis is deferred', nodecision: 'No diagnostic decision yet' };
    var kind = ap.code === 'under6' ? 'err' : ap.code === 'not-met' ? 'info' : 'warn';
    var act = ap.code === 'under6' ? goBtn(ctx, 'setup', 'Back to the first step') : goBtn(ctx, 'summary', 'Go to scoring and diagnosis');
    var body = stripClauses(ap.reason || '') + (step === 'txplan' ? '' : ' You can still record here, but the medicine steps do not apply yet.');
    return ui.callout(kind, h('div', null, h('p', null, body), h('div', { class: 'row' }, act)), titles[ap.code] || 'Treatment does not apply yet');
  }
  /* Shown in the medicine steps when the treatment plan is not "medicine with support". */
  function planNote(ctx, a) {
    var d = obj(txOf(a).plan).decision;
    if (d === 'medication') return null;
    var t = { nondrug: ['Medicine is not planned', 'The treatment plan is support without medicine.'], refer: ['Medicine is not planned', 'The treatment plan is to refer on.'],
      defer: ['Treatment decision on hold', 'The treatment decision is deferred.'] }[d] || ['No treatment decision yet', 'Record the decision in the treatment plan first.'];
    return note('info', t[0], t[1] + ' You can still record here if plans change.', [goBtn(ctx, 'txplan', 'Open the treatment plan')]);
  }
  /* Shown in the medicine steps whenever a medicine is planned or chosen and the prescriber's scope is not
     confirmed, whatever the plan decision. Never hidden (ARCHITECTURE.md section 8). */
  function scopeNote(ctx, a) {
    var p = obj(txOf(a).plan);
    if (!(p.decision === 'medication' || obj(txOf(a).choice).drug) || scopeDone(obj(p.team)) >= SCOPE.length) return null;
    return note('warn', 'Scope not confirmed in the treatment plan', 'Do not start or change ADHD medicine on your own. Next: a specialist prescriber in your team starts the medicine and signs the prescription, or confirm your scope first.', [goBtn(ctx, 'txplan', 'Open the treatment plan')]);
  }
  /* Where the diagnosis and the recorded findings disagree, or safety is not yet reviewed: the engine's
     diagnosisCheck, else AA.components.diagnosisConflicts (assess-steps-b.js). Before starting medicine, NICE asks
     the prescriber to confirm that the person still meets the criteria for ADHD and needs treatment. */
  function dxConflicts(a) {
    var t = T(), f = AA.components.diagnosisConflicts;
    if (!t.applicable(a).ok) return [];
    if (typeof t.diagnosisCheck === 'function') {
      try { return arr(obj(t.diagnosisCheck(a)).issues).map(function (x) { return String(x && (x.text || x.t) || x); }); } catch (e) { /* use the view's list */ }
    }
    if (typeof f !== 'function') return [];
    try { return arr(f(a)).map(String); } catch (e) { return []; }
  }
  function conflictNote(ctx, a) {
    var list = dxConflicts(a);
    if (!list.length) return null;
    return note('warn', 'The recorded findings do not support the diagnosis yet',
      [bullets(list), h('p', null, 'Next: complete or correct the findings, or record in the formulation why the diagnosis stands, before starting medicine.')],
      [goBtn(ctx, 'summary', 'Go to scoring and diagnosis'), obj(a.risk).reviewed === true ? null : goBtn(ctx, 'risk', 'Go to safety and risk')]);
  }
  /* Safety-step answers (a.risk) linked to a safety-screen item: the item's own `risk` list. Until the data
     carries one, the two mental health items use the matching safety-step items (suicidal thoughts or recent
     self-harm; psychosis or mania), because the medicines' SmPCs list them as contraindications. */
  var RISK_LINK = { ci_depression: ['r_si', 'r_si_plan', 'r_selfharm_recent', 'r_y_selfharm_recent'], ci_psychosis: ['r_psychosis', 'r_mania'] };
  function riskIds(item) { return arr(item && item.risk).length ? item.risk : (RISK_LINK[item && item.id] || []); }
  function riskTicked(a, item) { var r = obj(a && a.risk); return riskIds(item).filter(function (id) { return r[id] === true; }); }
  function riskLabel(id) { var it = arr(obj(AA.data.risk).items).filter(function (x) { return x && x.id === id; })[0]; return it ? (it.short || it.text || id) : id; }
  /* Urgent or high safety-step items that are ticked: they must be acted on before starting medicine. */
  function riskFlags(a) {
    var r = obj(a && a.risk);
    return arr(obj(AA.data.risk).items).filter(function (it) { return it && r[it.id] === true && (it.level === 'urgent' || it.level === 'high'); });
  }

  /* =================================================================================
     Shared lists and labels
     ================================================================================= */
  var SCOPE = [
    { k: 'specialist', l: 'I work inside a specialist ADHD team', short: 'working inside a specialist ADHD team',
      hint: 'The diagnosis and the decision to start medicine sit with that team, not with you alone.' },
    { k: 'competent', l: 'I am trained and competent for this medicine and this age group', short: 'trained and competent for this medicine and age group',
      hint: 'Including the products, doses, monitoring and controlled drug law.' },
    { k: 'supervised', l: 'Supervision and access to the multidisciplinary team (MDT) are agreed', short: 'supervision and MDT access agreed',
      hint: 'You know who you discuss this patient with, and who covers when you are away.' }
  ];
  var SCOPE_SRC = ['NICE NG87 1.3.1 (who diagnoses ADHD)', 'NICE NG87 1.7.2 (who starts ADHD medicine)', 'NICE NG87 1.7.3 (knowing the preparations)', 'Main course Module 9 (the pharmacist\'s role and scope)'];
  function scopeDone(team) { return SCOPE.filter(function (s) { return team[s.k] === true; }).length; }
  /* Licence wording from the engine's licence note. A licence condition that is not yet confirmed (for example
     "a clinically inadequate response to methylphenidate") is not called off-label: the note says what to record. */
  function licenceLine(lic, licensedText) {
    lic = obj(lic);
    var n = stripClauses(String(lic.licenceNote || '').trim());
    if (lic.licensed) return (licensedText || 'Licensed for this age') + (n ? '. ' + n : '');
    if (!n) return 'Off-label: check the SmPC';
    if (lic.conditionUnconfirmed || lic.ageMissing || /^(Licence condition not confirmed|Off-label|Not licensed|Licensed in adults only|No ADHD medicine|Licence not recorded|Record the age)/i.test(n)) return n;
    return 'Off-label. ' + n;
  }
  function licenceBadge(lic) {
    lic = obj(lic);
    if (lic.licensed) return null;
    return lic.conditionUnconfirmed ? ui.badge('Licence condition to confirm', 'info') : ui.badge('Off-label', 'warn');
  }

  var PLAN_DECISIONS = [
    { v: 'medication', l: 'Medicine with support' },
    { v: 'nondrug', l: 'Support only' },
    { v: 'defer', l: 'Decide later' },
    { v: 'refer', l: 'Refer on' }
  ];
  var DEC_TEXT = { medication: 'Medicine with support', nondrug: 'Support without medicine', defer: 'Decision deferred', refer: 'Refer on' };
  var PLAN_GROUP_ORDER = ['Before medication', 'Non-drug support', 'If medication helps but problems remain'];

  var YN_RISK = [{ v: 'yes', l: 'Yes', kind: 'risk' }, { v: 'no', l: 'No', kind: 'no' }];
  var BP_CHARTS = ['US Fourth Report (NHBPEP, 2004)', 'AAP 2017 (Flynn and colleagues)', 'UK 2007 (Jackson and colleagues)', 'Local chart'];
  var CENTILE = [{ v: 'lt90', l: 'Below 90th' }, { v: '90to95', l: '90th to 95th' }, { v: 'gt95_once', l: 'Above 95th, once', kind: 'risk' }, { v: 'gt95_sustained', l: 'Above 95th, sustained', kind: 'bad' }];
  /* At a review each reading is one occasion; the engine compares it with the last review that has a centile
     (and the baseline), so two reviews above the 95th centile raise the "2 occasions" flag. */
  var REVIEW_CENTILE = [{ v: 'lt90', l: 'Below 90th' }, { v: '90to95', l: '90th to 95th' }, { v: 'gt95_once', l: 'Above 95th', kind: 'risk' }];
  function centileText(v) { return labelOf(REVIEW_CENTILE, v) || labelOf(CENTILE, v); }
  var ABPM = [{ v: 'not_needed', l: 'Not needed' }, { v: 'normal', l: 'Normal' }, { v: 'hypertensive', l: 'Hypertension confirmed', kind: 'bad' }];
  var ECG = [{ v: 'not_needed', l: 'Not needed' }, { v: 'normal', l: 'Normal' }, { v: 'abnormal', l: 'Abnormal', kind: 'bad' }];
  var CARDIO = [{ v: 'not_needed', l: 'Not needed' }, { v: 'referred', l: 'Referred, waiting', kind: 'risk' }, { v: 'cleared', l: 'Cleared to start' }];
  var MISUSE = [{ v: 'low', l: 'Low' }, { v: 'moderate', l: 'Moderate', kind: 'risk' }, { v: 'high', l: 'High', kind: 'bad' }];
  var PREG = [{ v: 'na', l: 'Not applicable' }, { v: 'no', l: 'Not pregnant' }, { v: 'planning', l: 'Planning', kind: 'risk' }, { v: 'pregnant', l: 'Pregnant', kind: 'risk' }, { v: 'breastfeeding', l: 'Breastfeeding', kind: 'risk' }];
  var DRIVE = [{ v: 'na', l: 'Not applicable' }, { v: 'no', l: 'Does not drive' }, { v: 'yes', l: 'Drives' }];
  var OUTCOMES = [{ v: 'not_tolerated', l: 'Not tolerated' }, { v: 'no_response', l: 'Did not help' }, { v: 'partial', l: 'Helped a little' }, { v: 'worked', l: 'Helped' }, { v: 'stopped_other', l: 'Stopped for another reason' }];
  var EFFECT = [{ v: 'none', l: 'None' }, { v: 'some', l: 'Some' }, { v: 'good', l: 'Good' }];
  var SE_LEVEL = [{ v: 'none', l: 'None', kind: 'no' }, { v: 'mild', l: 'Mild', kind: 'unsure' }, { v: 'troublesome', l: 'Troublesome', kind: 'bad' }];
  var REVIEW_DEC = [{ v: 'increase', l: 'Increase' }, { v: 'stay', l: 'Stay' }, { v: 'reduce', l: 'Reduce' }, { v: 'switch', l: 'Switch' }, { v: 'stop', l: 'Stop' }, { v: 'optimised', l: 'Optimised' }];
  var NEW_DOSE_DEC = { increase: true, stay: true, reduce: true, optimised: true };   /* decisions that agree a new daily dose */
  var PER_DAY = [{ v: 1, l: 'Once' }, { v: 2, l: 'Twice' }, { v: 3, l: 'Three times' }];
  var PER_WORD = { 1: 'once a day', 2: 'twice a day', 3: 'three times a day' };
  /* Immediate release: the product's ir flag, else its release text (the engine uses the same rule). */
  function isIRp(p) { return typeof p.ir === 'boolean' ? p.ir : /immediate/i.test(String(p.release || '') + ' ' + String(p.form || '')); }
  /* How many doses a day a product may be given in, as the engine allows them: its SmPC schedules, a product's
     own perDayOptions, 1 to 3 for immediate release and 1 or 2 for atomoxetine. */
  function perDayOptions(p) {
    var set = [];
    function add(n) { n = num(n); if (n && set.indexOf(n) < 0) set.push(n); }
    var ds = obj(p && p.dose);
    add(obj(ds.child).perDay); add(obj(ds.adult).perDay);
    arr(p && p.perDayOptions).forEach(add);
    if (p && isIRp(p)) [1, 2, 3].forEach(add);
    if (p && p.drug === 'atx') [1, 2].forEach(add);
    if (!set.length) set.push(1);
    return set.sort(function (x, y) { return x - y; });
  }
  /* How a daily dose is given, from the engine's dose step ({perDose: [mg per dose], split}). */
  function givenText(s, per) {
    var pd = arr(s && s.perDose).map(num).filter(function (x) { return x !== null; });
    if (pd.length) {
      var same = pd.every(function (x) { return x === pd[0]; });
      return same ? fmt(pd[0]) + ' mg ' + (PER_WORD[pd.length] || pd.length + ' times a day') : pd.map(fmt).join(' mg + ') + ' mg';
    }
    if (s && s.perDose === null) return 'Cannot be made from the strengths';
    return per > 1 ? fmt(num(s.dose) / per) + ' mg ' + (PER_WORD[per] || per + ' times a day') : fmt(num(s.dose)) + ' mg once a day';
  }
  var SHARED = [{ v: 'not_yet', l: 'Not yet' }, { v: 'requested', l: 'Requested' }, { v: 'agreed', l: 'Agreed' }, { v: 'declined', l: 'Declined', kind: 'risk' }, { v: 'na', l: 'Not applicable' }];
  function labelOf(list, v) { var x = list.filter(function (o) { return o.v === v; })[0]; return x ? x.l : ''; }

  /* Pre-treatment verdict headlines (AA.treatment.baselineVerdict levels). */
  var VERDICT = {
    stop: { t: 'Do not start: blood pressure needs urgent review', next: 'Next: do not start ADHD medicine. Follow NICE NG136: a same-day specialist review if there are red-flag signs; otherwise look for organ damage and repeat the reading (or arrange ABPM or HBPM) with a review within 7 days.' },
    cardiology: { t: 'Get a specialist opinion before starting', next: 'Next: get the opinion (cardiology, or a paediatric hypertension specialist for a child\'s high blood pressure), then record the outcome under Heart history.' },
    ecg: { t: 'Do an ECG before starting', next: 'Next: arrange the ECG and record the result under Heart history.' },
    incomplete: { t: 'Checks not finished', next: 'Next: record the items under "Still to record".' },
    caution: { t: 'Checks done: cautions to weigh', next: 'Next: weigh each caution when you choose the medicine and the product.' },
    ok: { t: 'Checks done: nothing found that stops treatment', next: 'Next: choose and prescribe.' },
    risk: { t: 'Act on the safety step before starting', next: 'Next: act on each safety flag (urgent ones today), record what you did in the safety step, and talk to the specialist team before any ADHD medicine is started.' },
    stopmix: { t: 'Do not start: blood pressure and the safety step need action first', next: 'Next: follow NICE NG136 for the blood pressure (a same-day specialist review if there are red-flag signs), act on each safety flag today, and record both before any ADHD medicine is started.' }
  };
  /* The engine's verdict, plus any urgent or high safety-step item it does not already name. Such an item
     outranks "ok", "caution" and "incomplete": the medicines' SmPCs list suicidal ideation and psychosis as
     contraindications, and other urgent risks need action first. */
  function verdictView(a) {
    var v = T().baselineVerdict(a), reasons = arr(v.reasons);
    var rf = riskFlags(a).filter(function (it) {
      var s = lc(it.short || it.text || it.id);
      return !reasons.some(function (r) { return lc(String(r && (r.text || r.t) || r)).indexOf(s) > -1; });
    });
    var level = rf.length && (v.level === 'ok' || v.level === 'caution' || v.level === 'incomplete') ? 'risk' : v.level;
    /* A "stop" from the safety step is not a blood pressure stop: name what stops treatment. */
    if (level === 'stop') {
      var stops = reasons.filter(function (r) { return r && r.level === 'stop'; });
      var fromRisk = stops.filter(function (r) { return /^Safety step:/.test(String(r.text || r.t || r)); }).length;
      if (fromRisk && fromRisk === stops.length) level = 'risk';
      else if (fromRisk) level = 'stopmix';
    }
    return { v: v, level: level, m: VERDICT[level] || VERDICT.incomplete, rf: rf };
  }

  /* Safety screen groups come from each txCautions item's own `group` label, in the order the data lists
     them. An item without one falls back to this map, else "Other". */
  var CAUTION_GROUPS = [
    { l: 'Heart and circulation', ids: ['ci_cvd', 'ci_cerebro', 'ci_htn', 'ci_hypotension', 'ci_qt'] },
    { l: 'Mental health', ids: ['ci_depression', 'ci_psychosis', 'ci_personality', 'ci_anorexia'] },
    { l: 'Substance use', ids: ['ci_substance'] },
    { l: 'Neurological', ids: ['ci_tics', 'ci_tourette', 'ci_epilepsy'] },
    { l: 'Eyes and hormones', ids: ['ci_glaucoma', 'ci_phaeo', 'ci_hyperthyroid'] },
    { l: 'Liver and kidneys', ids: ['ci_hepatic', 'ci_renal', 'ci_porphyria'] },
    { l: 'Medicines and interactions', ids: ['ci_maoi', 'ci_cyp2d6', 'ci_cyp3a4', 'ci_cyp3a4_inh', 'ci_cyp3a4_ind', 'ci_decongestant', 'ci_acidsuppress'] }
  ];
  /* The CYP3A4 question is asked as two items (inhibitor; inducer). Older records hold one combined answer
     (ci_cyp3a4): the engine reads it as an inhibitor until the two new items are answered. */
  var CYP_NEW = ['ci_cyp3a4_inh', 'ci_cyp3a4_ind'];
  function oldCypOpen(b) {
    var ci = obj(obj(b).ci), have = CYP_NEW.filter(function (id) { return !!AA.byId('txCautions', id); });
    return ci.ci_cyp3a4 === 'yes' && have.length > 0 && have.some(function (id) { return ci[id] !== 'yes' && ci[id] !== 'no'; });
  }
  /* Child-Pugh class (baseline.childPugh), asked when moderate or severe liver impairment is a yes. */
  var CHILD_PUGH = [{ v: 'A', l: 'A (mild)' }, { v: 'B', l: 'B (moderate)', kind: 'risk' }, { v: 'C', l: 'C (severe)', kind: 'bad' }];
  function groupLabel(c) {
    if (c.group) return String(c.group);
    var g = CAUTION_GROUPS.filter(function (x) { return x.ids.indexOf(c.id) > -1; })[0];
    return g ? g.l : 'Other';
  }
  function cautionGroups(a) {
    var out = [], by = {};
    cautionItems(a).forEach(function (c) {
      var l = groupLabel(c);
      if (!by[l]) { by[l] = { id: 'g' + out.length, l: l, items: [] }; out.push(by[l]); }
      by[l].items.push(c);
    });
    return out;
  }
  /* Pregnancy and breastfeeding are asked once, as the pregnancy question (baseline.pregnancy), so the two
     matching safety-screen items are not asked again. Their history links still show on that question. */
  var PREG_CI = ['ci_pregnancy', 'ci_breastfeeding'];
  function pregItems() { return PREG_CI.map(function (id) { return AA.byId('txCautions', id); }).filter(Boolean); }
  /* The pregnancy question is asked from age 12 (adults, or age not recorded: always). Below 12 it stays
     hidden unless the clinician opens it or an answer is already recorded. */
  var pregShown = {};   /* screen state per assessment: "Show anyway" was pressed */
  function pregDue(a) { var age = ageOf(a); return !isYoung(a) || age === null || age >= 12; }
  /* The pregnancy question takes one answer, but someone can be pregnant (or planning) and breastfeeding.
     After "pregnant", "planning" or "breastfeeding" the view asks about the other state, saved as that
     safety-screen item (baseline.ci.<id>), so both items have an answer. */
  function pregFollow(b) {
    var p = obj(b).pregnancy;
    if (p === 'pregnant' || p === 'planning') return { id: 'ci_breastfeeding', l: 'Also breastfeeding?' };
    if (p === 'breastfeeding') return { id: 'ci_pregnancy', l: 'Also pregnant, or planning a pregnancy?' };
    return null;
  }
  function pregFollowOpen(b) { var f = pregFollow(b); return !!f && !!AA.byId('txCautions', f.id) && obj(obj(b).ci)[f.id] !== 'yes' && obj(obj(b).ci)[f.id] !== 'no'; }
  /* Which medicines a caution item rules out or needs care with (txDrugs ci / caution lists), as two labelled lines. */
  function affectsNode(id) {
    var ci = [], ca = [];
    arr(AA.data.txDrugs).forEach(function (d) {
      if (arr(d.ci).indexOf(id) > -1) ci.push(d.name); else if (arr(d.caution).indexOf(id) > -1) ca.push(d.name);
    });
    if (!ci.length && !ca.length) return null;
    return [ci.length ? h('span', { class: 'tx-aff tx-aff-ci' }, h('strong', null, 'Rules out: '), ci.join(', ') + '.') : null,
      ca.length ? h('span', { class: 'tx-aff tx-aff-ca' }, h('strong', null, 'Care with: '), ca.join(', ') + '.') : null];
  }
  function histSentence(n, noun) {
    return (n === 1 ? 'One ' + noun + ' already has' : n + ' ' + noun + 's already have') + ' a yes in the clinical history. Check with the person, then save the answers.';
  }
  function cardiacItems(a) { return arr(AA.data.txCardiac).filter(function (c) { return c && c.id && fitsAge(c, a); }); }
  function cautionItems(a) { return arr(AA.data.txCautions).filter(function (c) { return c && c.id && PREG_CI.indexOf(c.id) < 0 && fitsAge(c, a); }); }
  /* The engine's list when it has one, so the view shows the items the step progress counts. */
  function planItemsFor(a) {
    var t = T();
    if (t && typeof t.planItems === 'function') { try { return arr(t.planItems(a)); } catch (e) { /* use the filter below */ } }
    return arr(AA.data.txPlanItems).filter(function (x) { return x && x.id && fitsAge(x, a); });
  }
  function groupsOf(items, order) {
    var gs = [];
    items.forEach(function (x) {
      var name = x.group || 'Other', g = gs.filter(function (y) { return y.name === name; })[0];
      if (!g) { g = { name: name, items: [] }; gs.push(g); }
      g.items.push(x);
    });
    return gs.sort(function (x, y) {
      var i = order.indexOf(x.name), j = order.indexOf(y.name);
      return (i < 0 ? 99 : i) - (j < 0 ? 99 : j);
    });
  }
  function counselFor(a) {
    var ch = obj(txOf(a).choice);
    if (!ch.drug) return [];
    return arr(AA.data.txCounsel).filter(function (c) {
      if (!c || !c.id) return false;
      return (c.drugs === 'all' || arr(c.drugs).indexOf(ch.drug) > -1) && fitsAge(c, a);
    });
  }
  function rxChecksFor(a) {
    var d = drugOf(obj(txOf(a).choice).drug);
    return arr(AA.data.txRxChecks).filter(function (c) { return c && c.id && (!c.cd || (d && d.isCD)); });
  }
  function seFor(a) {
    var d = drugOf(obj(txOf(a).choice).drug);
    var ids = d && arr(d.se).length ? d.se : arr(AA.data.txSideEffects).map(function (x) { return x && x.id; });
    return ids.map(function (id) { return AA.byId('txSideEffects', id); }).filter(function (x) { return x && fitsAge(x, a); });
  }
  function monitorData() { return obj(AA.data.txMonitor); }
  function actionsFor(a) {
    var ch = obj(txOf(a).choice);
    return arr(monitorData().actions).filter(function (x) {
      if (!x || !x.id || !fitsAge(x, a)) return false;
      if (Array.isArray(x.drugs)) return !!ch.drug && x.drugs.indexOf(ch.drug) > -1;
      return true;
    });
  }
  function transitionShown(a) { var age = ageOf(a); return isYoung(a) && age !== null && age >= 13; }

  /* A question row: the item, the question to read, a yes/no control and a "From history" line. */
  function qRow(item, ask, value, onChange, extra) {
    var histHost = h('div', { class: 'tx-q-hist' });
    var row = h('div', { class: 'tx-q' },
      h('div', { class: 'tx-q-text' },
        h('p', { class: 'tx-q-t' }, item.t),
        ask && ask !== item.t ? h('p', { class: 'tx-q-ask' }, ask) : null,
        extra ? h('p', { class: 'tx-q-extra' }, extra) : null,
        histHost),
      h('div', { class: 'tx-q-ctl' }, ui.seg({ label: item.t, hideLabel: true, small: true, options: YN_RISK, value: value === 'yes' || value === 'no' ? value : null, onChange: onChange })));
    /* History ticks, and linked safety-step answers, that pre-fill "yes" (shown, not saved until the clinician
       confirms). ans: the engine's answer for the item ({v, fromHistory, fromRisk}). A ticked safety-step item
       the engine does not count yet still shows, and asks the clinician to answer. */
    row.paintHist = function (a, recorded, ans) {
      var ids = T().histTicked(a, item.hist), rids = riskTicked(a, item);
      if (!ids.length && !rids.length) { U.clear(histHost); return; }
      var answered = recorded === 'yes' || recorded === 'no', x = obj(ans), out = [];
      if (ids.length) {
        var labels = ids.map(histLabel).join('; ');
        out.push(h('p', { class: 'tx-hist' }, ui.badge('From history', 'info'), ' ',
          h('span', null, answered ? 'History: ' + labels + '.' : 'History: ' + labels + '. Counted as yes until you answer.')));
      }
      if (rids.length) {
        var rl = rids.map(riskLabel).join('; ');
        out.push(h('p', { class: 'tx-hist' }, ui.badge('From the safety step', 'warn'), ' ',
          h('span', null, 'Safety step: ' + rl + '.' + (answered ? '' : x.fromRisk || x.fromHistory ? ' Counted as yes until you answer.' : ' Ask about it and answer here.'))));
      }
      fill(histHost, out);
    };
    return row;
  }

  /* =================================================================================
     Step: treatment plan
     Notes > summary (the decision, scope and support counts, the next action) > Decision > Who can start the
     medicine > Support and NICE steps (grouped, one group open at a time).
     ================================================================================= */
  var PLAN_GROUP_SUB = {
    'Before medication': 'Done before any ADHD medicine is started.',
    'Non-drug support': 'Support alongside medicine, or instead of it.',
    'If medication helps but problems remain': 'Only when medicine helps but significant impairment remains.'
  };
  AA.steps.txplan = { render: function (el, ctx) {
    if (!ready()) { el.appendChild(notLoaded()); return null; }
    var Tx = T(), a0 = ctx.a() || {};
    var yng = isYoung(a0);
    var an = applicNote(ctx, a0, 'txplan');
    if (an) el.appendChild(an);
    /* Findings that disagree with the diagnosis come first, above the summary. */
    var attn = h('div', { class: 'tx-ready' });
    el.appendChild(attn);
    var sumHost = h('div', { class: 'tx-sumhost' });
    el.appendChild(sumHost);
    var plan0 = obj(txOf(a0).plan), team0 = obj(plan0.team);
    var items = planItemsFor(a0);
    var groups = groupsOf(items, PLAN_GROUP_ORDER);

    /* Counts as the step progress does: a ticked item counts; an unticked one counts only when it applies to this
       person (AA.treatment.planItemApplies, for example parent training only with oppositional or conduct symptoms). */
    function applies(a, x) { var t = T(); return typeof t.planItemApplies !== 'function' || !!t.planItemApplies(a, x); }
    function tally(a, list, st) {
      var done = 0, of = 0;
      list.forEach(function (x) { var v = st[x.id]; if (v === 'na') return; if (v) { done++; of++; } else if (applies(a, x)) of++; });
      return { done: done, of: of };
    }
    var WHEN_TEXT = { oddcd: 'Only with oppositional or conduct symptoms (oppositional defiant or conduct disorder marked co-occurring or uncertain in Differentials).',
      medhelps: 'Only when medicine has helped but significant impairment remains.',
      nondrug: 'Only when non-drug treatment is indicated: the person chooses support without medicine, medicine did not help or was not tolerated, or it helped but significant impairment remains.',
      baseline: 'Counted once the pre-treatment checks are recorded.',
      medication: 'Only when medicine is planned.' };
    /* Items that apply only in some situations take "Does not apply" (stored as 'na', never counted). Gates are
       never skipped this way: the medication criteria (counted after the baseline) and the re-check before
       medicine (counted when medicine is planned). */
    var COND_IDS = { tp_parenttrain: 'oddcd', tp_cbt: 'medhelps', tp_nondrug: 'nondrug', tp_psych: 'nondrug' };
    var GATES = { tp_recheck: 1, tp_medcriteria: 1 };
    function condOf(x) {
      var w = x.when || COND_IDS[x.id];
      if (GATES[x.id] || w === 'baseline' || w === 'medication') return null;
      return x.conditional === true || !!w ? (w || 'other') : null;
    }
    var PLAN_STATE = [{ v: 'done', l: 'Done or offered' }, { v: 'na', l: 'Does not apply' }];
    function condRow(x, st, aNow) {
      var v = st[x.id] === 'na' ? 'na' : st[x.id] ? 'done' : null;
      return h('div', { class: 'tx-check tx-planq' },
        h('div', { class: 'tx-planq-t' }, h('p', null, x.t),
          !st[x.id] ? h('p', { class: 'check-hint' }, (WHEN_TEXT[condOf(x)] || 'Only when it applies to this person.') + (applies(aNow, x) ? ' It applies here.' : ' Not counted until then.')) : null),
        ui.seg({ label: x.t, hideLabel: true, small: true, options: PLAN_STATE, value: v,
          onChange: function (nv) { ctx.set('treatment.plan.steps.' + x.id, nv === 'done' ? true : nv === 'na' ? 'na' : undefined); } }));
    }
    function checkRow(x, st, aNow) {
      var box = ui.check({ label: x.t, checked: !!st[x.id] && st[x.id] !== 'na', cls: 'tx-check',
        hint: !st[x.id] && !applies(aNow, x) ? (WHEN_TEXT[x.when] || 'Only when it applies to this person.') + ' Not counted until then.' : null,
        onChange: function (on) {
          /* "Still meets the criteria and needs treatment": when the findings disagree with the diagnosis,
             the clinician reads the list before ticking it. */
          var list = on && x.id === 'tp_recheck' ? dxConflicts(ctx.a() || {}) : [];
          if (!list.length) { ctx.set('treatment.plan.steps.' + x.id, on ? true : undefined); return; }
          U.confirm({ title: 'The recorded findings do not support the diagnosis yet', body: h('div', null, bullets(list),
            h('p', null, 'Tick this only if you have checked each point and the diagnosis still stands. Record why in the formulation.')), ok: 'Tick it' })
            .then(function (yes) {
              if (yes) ctx.set('treatment.plan.steps.' + x.id, true);
              else { var inp = box.querySelector('input'); if (inp) inp.checked = false; }
            });
        } });
      return box;
    }

    /* 1. The decision */
    var decHost = h('div', { class: 'tx-live', 'aria-live': 'polite' });
    var secDec = section('tx-plan-dec', 'Decision', 'Choose one. "Medicine with support" leads on to the pre-treatment checks.', card(null, [
      ui.seg({ label: 'What happens next', hideLabel: true, options: PLAN_DECISIONS, value: plan0.decision || null, onChange: function (v) { ctx.set('treatment.plan.decision', nil(v)); } }),
      decHost,
      h('div', { class: 'form-grid tx-fields' },
        ui.field(yng ? 'What ' + who(a0) + ' and their family prefer' : 'What the person prefers',
          textIn(plan0.prefer, function (v) { ctx.set('treatment.plan.prefer', v); }, { rows: 2, placeholder: 'Goals, worries and preferences about medicine' })),
        ui.field('Notes', textIn(plan0.notes, function (v) { ctx.set('treatment.plan.notes', v); }, { rows: 3, placeholder: 'For example who you referred to and why, or what needs to happen first' })))
    ], 'tx-deccard'));

    /* 2. Who can start the medicine (pharmacist scope gate) */
    var scopeLive = h('div', { class: 'tx-live', 'aria-live': 'polite' });
    var secScope = section('tx-plan-scope', 'Who can start the medicine', 'Only a healthcare professional with training and expertise in diagnosing and managing ADHD should start ADHD medicine.', card(null, [
      h('p', { class: 'tx-lead' }, 'As a pharmacist independent prescriber, you do this only inside a specialist ADHD team, within your own competence, with supervision. Tick each one that is true.'),
      h('div', { class: 'tx-checks' }, SCOPE.map(function (s) {
        return ui.check({ label: s.l, hint: s.hint, checked: team0[s.k] === true, cls: 'tx-check',
          onChange: function (on) { ctx.set('treatment.plan.team.' + s.k, on ? true : undefined); } });
      })),
      scopeLive
    ], 'tx-scope'));

    /* 3. Support and NICE steps for this age group: one group open at a time, each with its count */
    var planCnt = h('span', { class: 'tx-cnt' });
    var gMeta = groups.map(function () { return h('span', { class: 'tx-cnt' }); });
    var st0 = obj(plan0.steps), firstOpen = -1;
    groups.forEach(function (g, i) { var c = tally(a0, g.items, st0); if (firstOpen < 0 && c.done < c.of) firstOpen = i; });
    var supportBody;
    if (items.length) {
      supportBody = oneOpen(ui.acc(groups.map(function (g, i) {
        return { title: accTitle(g.name, PLAN_GROUP_SUB[g.name]), meta: gMeta[i], open: i === firstOpen, render: function () {
          var st = obj(ctx.get('treatment.plan.steps', {})), aNow = ctx.a() || {};
          return h('div', { class: 'tx-checks' }, g.items.map(function (x) { return condOf(x) ? condRow(x, st, aNow) : checkRow(x, st, aNow); }));
        } };
      })));
      supportBody.classList.add('tx-acc');
    } else supportBody = card(null, h('p', { class: 'muted' }, 'Plan items are not available in this build. Write the plan in the decision notes.'));
    var secSupport = section('tx-plan-support', yng ? 'Support and NICE steps for children and young people' : 'Support and NICE steps',
      yng ? 'Support comes first. Tick each item when it is done or offered to ' + who(a0) + ' and their family.' : 'Tick each item when it is done or offered.',
      supportBody, items.length ? [planCnt] : null);
    el.appendChild(secDec);
    el.appendChild(secScope);
    el.appendChild(secSupport);

    function paintScope(a) {
      var n = scopeDone(obj(obj(txOf(a).plan).team));
      fill(scopeLive, n === SCOPE.length
        ? note('ok', 'Scope confirmed', 'You can start and adjust ADHD medicine for this patient within your team\'s governance.')
        : note('warn', n ? (SCOPE.length - n) + ' of 3 not confirmed' : 'Scope not confirmed',
          'Do not start ADHD medicine on your own. Next: ask the specialist prescriber in your team to start it, or agree your competence and supervision first. You can still record the plan.'));
    }
    function paintPlan(a) {
      var st = obj(obj(txOf(a).plan).steps);
      if (items.length) { var c = tally(a, items, st); paintCnt(planCnt, c.done, c.of, 'done or offered'); }
      groups.forEach(function (g, i) { var gc = tally(a, g.items, st); paintCnt(gMeta[i], gc.done, gc.of); });
    }
    function paintDecision(a) {
      var p = obj(txOf(a).plan), d = p.decision, st = obj(p.steps), out = [];
      if (d === 'medication') {
        if (!Tx.applicable(a).ok) {
          out.push(note('warn', 'No diagnosis recorded for medicine', 'ADHD medicine needs a diagnosis (criteria met, or other specified ADHD). Next: record it in Scoring and diagnosis, or change this decision.', [goBtn(ctx, 'summary', 'Go to scoring and diagnosis')]));
        }
        if (scopeDone(obj(p.team)) < SCOPE.length) {
          out.push(note('warn', 'Scope not confirmed', 'Next: a specialist prescriber in your team starts the medicine, or tick the three scope checks below once they are true.',
            [ui.btn({ label: 'Go to the scope checks', kind: 'ghost', small: true, onClick: function () { reveal(secScope); } })]));
        }
        if (yng && AA.byId('txPlanItems', 'tp_medcriteria') && !st.tp_medcriteria) {
          out.push(note('info', 'NICE conditions for medicine', 'For children and young people, NICE offers medicine only when all three conditions under "Before medication" hold. Next: tick that item when it is true.'));
        }
        if (!yng && AA.byId('txPlanItems', 'tp_envmod_adult') && !st.tp_envmod_adult) {
          out.push(note('info', 'Environmental changes first', 'NICE offers medicine to adults when significant impairment remains after changes at work, study and home have been made and reviewed. Next: tick that item under "Before medication" when done.'));
        }
      }
      fill(decHost, out);
    }
    function paintAttn(a) {
      var d = obj(txOf(a).plan).decision;
      fill(attn, d !== 'nondrug' && d !== 'refer' ? [conflictNote(ctx, a)] : []);
    }
    function paintSummary(a) {
      var ap = Tx.applicable(a), p = obj(txOf(a).plan), d = p.decision, st = obj(p.steps), sc = scopeDone(obj(p.team));
      var c = tally(a, items, st), issues = d !== 'nondrug' && d !== 'refer' ? dxConflicts(a).length : 0;
      var medicine = d === 'medication' || !!obj(txOf(a).choice).drug;
      var o = { eyebrow: 'Treatment plan', kind: 'info', actions: [] };
      if (!d) {
        o.title = 'Choose the treatment decision';
        o.next = 'choose what happens next under Decision.';
        o.actions.push(ui.btn({ label: 'Go to the decision', kind: 'ghost', small: true, onClick: function () { reveal(secDec); } }));
      } else if (d === 'medication') {
        var problem = !ap.ok ? 'record the diagnosis first' : issues ? 'check the findings first' : sc < SCOPE.length ? 'confirm who starts it' : '';
        o.kind = problem ? 'warn' : 'ok';
        o.title = problem ? 'Medicine planned: ' + problem : 'Medicine with support: ready for the checks';
        o.next = 'pre-treatment checks: heart history, blood pressure, pulse, height, weight and the safety screen.';
        o.actions.push(goBtn(ctx, 'baseline', 'Go to pre-treatment checks'));
      } else if (d === 'nondrug') {
        o.kind = 'ok'; o.title = 'Support without medicine';
        o.text = 'The medicine steps are not needed. Record the support offered and when you will review it. Medicine can be reconsidered later.';
        o.actions.push(goBtn(ctx, 'report', 'Go to the report'));
      } else if (d === 'refer') {
        o.title = 'Refer on';
        o.next = 'write who you referred to and why in the notes (for example a tertiary ADHD service, paediatrics or another specialist service).';
      } else if (d === 'defer') {
        o.title = 'Decide later';
        o.next = 'write what needs to happen first, and when you will review it, in the notes.';
      }
      o.facts = [
        { k: 'Decision', v: d ? DEC_TEXT[d] || d : 'Not chosen yet', kind: d ? 'ok' : 'neutral', onClick: function () { reveal(secDec); }, title: 'Go to the decision' },
        { k: 'Prescriber scope', v: sc >= SCOPE.length ? 'Confirmed' : sc ? sc + ' of ' + SCOPE.length + ' confirmed' : 'Not confirmed', kind: sc >= SCOPE.length ? 'ok' : medicine ? 'warn' : 'neutral',
          onClick: function () { reveal(secScope); }, title: 'Go to the scope checks' },
        items.length ? { k: 'Support and NICE steps', v: c.done + ' of ' + c.of + ' done or offered', kind: c.of && c.done >= c.of ? 'ok' : c.done ? 'warn' : 'neutral',
          onClick: function () { reveal(secSupport); }, title: 'Go to the support and NICE steps' } : null
      ];
      fill(sumHost, summaryCard(o));
    }

    var src = stepSources(el, function () { return SCOPE_SRC.concat(items.map(function (x) { return x.src; })); });
    function paintAll() { var a = ctx.a() || {}; paintAttn(a); paintSummary(a); paintScope(a); paintPlan(a); paintDecision(a); src.paint(a); }
    paintAll();
    ctx.onChange('treatment', U.debounce(function () { if (el.isConnected) paintAll(); }, 80));
    return null;
  } };

  /* =================================================================================
     Step: pre-treatment checks
     Notes > the verdict (summary: headline, progress, one fact per set of checks, reasons, next action) > the four
     sets of checks one at a time (ui.stepper): measurements, heart history, safety screen, medicines and the rest.
     ================================================================================= */
  var VERDICT_BADGE = { stop: ['Do not start', 'err'], cardiology: ['Specialist opinion first', 'err'], ecg: ['ECG first', 'warn'], incomplete: ['Checks to do', 'neutral'],
    caution: ['Cautions', 'warn'], ok: ['Checks clear', 'ok'], risk: ['Safety flags', 'err'], stopmix: ['Do not start', 'err'] };
  function verdictCard(ctx) {
    var host = h('div', { class: 'tx-sumhost' });
    var say = h('p', { class: 'sr-only', 'aria-live': 'polite' });   /* announces only a change of verdict */
    var box = h('div', { class: 'tx-verdict' }, say, host);
    function paint(a, facts) {
      var vv = verdictView(a), v = vv.v, m = vv.m;
      if (say.textContent !== 'Verdict: ' + m.t) say.textContent = 'Verdict: ' + m.t;
      var reasons = arr(v.reasons);
      var was = host.querySelector('.tx-miss');
      var missOpen = !!(was && was.open);
      var list = reasons.length || vv.rf.length ? h('ul', { class: 'tx-reasons' }, reasons.map(function (r) {
        return h('li', { class: 'tx-r tx-r-' + kindOf(r.level) }, h('span', { class: 'tx-dot', 'aria-hidden': 'true' }), h('span', null, stripClauses(String(r.text || r))));
      }).concat(vv.rf.map(function (it) {
        return h('li', { class: 'tx-r tx-r-err' }, h('span', { class: 'tx-dot', 'aria-hidden': 'true' }), h('span', null, 'Safety step: ' + (it.short || it.text) + '. Act on this before starting.'));
      }))) : null;
      fill(host, summaryCard({
        kind: kindOf(vv.level), eyebrow: 'Verdict so far', badge: VERDICT_BADGE[vv.level] || VERDICT_BADGE.incomplete, title: m.t,
        progress: progLine(v.done || 0, v.of || 0, (v.done || 0) + ' of ' + (v.of || 0) + ' checks recorded', 'Checks recorded'),
        facts: facts,
        extra: [list, arr(v.missing).length ? ui.details('Still to record', bullets(v.missing), { cls: 'tx-bare tx-miss', meta: String(v.missing.length), open: missOpen }) : null],
        next: String(m.next || '').replace(/^Next:\s*/, ''),
        actions: [vv.rf.length || vv.level === 'risk' || vv.level === 'stopmix' ? goBtn(ctx, 'risk', 'Open safety and risk') : null,
          vv.level === 'ok' || vv.level === 'caution' ? goBtn(ctx, 'prescribe', 'Go to choose and prescribe') : null]
      }));
      return v;
    }
    return { el: box, paint: paint };
  }

  /* Heart history questions answered from the examination or the readings, shown as their own group. */
  var EXAM_CX = { cx_hf: 1, cx_murmur: 1, cx_htn: 1 };

  AA.steps.baseline = { render: function (el, ctx) {
    if (!ready()) { el.appendChild(notLoaded()); return null; }
    var Tx = T(), a0 = ctx.a() || {};
    var yng = isYoung(a0), age = ageOf(a0);
    var showPreg = pregDue(a0), showDrive = !yng || (age !== null && age >= 17);
    var otherLabel = showDrive ? 'Medicines, pregnancy, driving' : showPreg ? 'Medicines and pregnancy' : 'Medicines and misuse';
    var an = applicNote(ctx, a0, 'baseline');
    if (an) el.appendChild(an);
    var pn = planNote(ctx, a0);
    if (pn) el.appendChild(h('div', { class: 'tx-ready' }, pn));

    var verdict = verdictCard(ctx);
    el.appendChild(verdict.el);

    function B() { return obj(ctx.get('treatment.baseline', {})); }
    function setB(key, v) { ctx.set('treatment.baseline.' + key, v); }
    var dateEl = null;
    /* A measurement saves the date too (today, or the date shown), so the record always has one. */
    function saveM(key) {
      return function (v) {
        if (v !== undefined && !ctx.get('treatment.baseline.date')) setB('date', (dateEl && dateEl.value) || today());
        setB(key, v);
      };
    }
    var live = {};   /* hosts of the set of checks on screen, repainted on change */
    var chartList = 'tx-bpcharts-' + U.uid();

    /* Young people: the clinician reads the centile from a chart and records which chart. NICE names none. */
    function centileBlock(b) {
      var chartIn = textIn(b.bpChart, function (v) { setB('bpChart', v); }, { placeholder: 'For example AAP 2017, or your local chart' });
      chartIn.setAttribute('list', chartList);
      return h('div', { class: 'tx-sub' },
        ui.seg({ label: 'Blood pressure centile for age and height', options: CENTILE, value: b.bpCentile || null, onChange: function (v) { setB('bpCentile', nil(v)); } }),
        h('div', { class: 'form-grid tx-fields tx-chartrow' },
          ui.field('Centile chart used', chartIn),
          h('datalist', { id: chartList }, BP_CHARTS.map(function (c) { return h('option', { value: c }); }))),
        h('p', { class: 'hint' }, 'Use the same chart at every review. This tool does not hold centile tables.'),
        ui.details('Which chart?', bullets([
          'NICE refers before starting when blood pressure is consistently above the 95th centile for age and height. It does not name a chart.',
          'Charts by age, sex and height: the US Fourth Report (from the NHBPEP, the US high blood pressure education programme, 2004) and its update, the American Academy of Pediatrics (AAP) 2017 guideline. From age 13, AAP 2017 uses adult-style categories.',
          'The UK 2007 charts (Jackson and colleagues) use age and sex, not height, and call blood pressure above the 98th centile high. They do not match the NICE wording.'
        ]), { cls: 'tx-bare' }));
    }

    /* ---- Set 1: measurements ---- */
    function measureTab() {
      var b = B();
      dateEl = ui.input({ type: 'date', value: b.date || today(), onSave: function (v) { setB('date', v || undefined); } });
      live.bp = h('div', { class: 'tx-live', 'aria-live': 'polite' });
      live.bmi = h('p', { class: 'hint tx-bmi' });
      live.repeat = h('div', { class: 'tx-repeat' });
      live.repeatSig = null;
      return h('div', null,
        h('p', { class: 'hint tx-tabhint' }, 'Use the right cuff size, with ' + who(a0) + ' seated and rested. ' + (yng ? 'Plot height and weight on the growth chart, and blood pressure on a centile chart for age and height.' : 'If the first reading is 140/90 or higher, take a second one: the lower of the two counts as the clinic blood pressure.')),
        h('div', { class: 'form-grid tx-fields tx-datef' }, ui.field('Date of the checks', dateEl)),
        h('h3', { class: 'tx-subh' }, 'Blood pressure and pulse'),
        h('div', { class: 'form-grid tx-fields tx-f2' },
          ui.field('Systolic blood pressure (mmHg)', numIn(b.sbp, saveM('sbp'), { int: true })),
          ui.field('Diastolic blood pressure (mmHg)', numIn(b.dbp, saveM('dbp'), { int: true })),
          ui.field('Pulse (beats a minute)', numIn(b.pulse, saveM('pulse'), { int: true })),
          ui.field('Cuff size', textIn(b.cuff, function (v) { setB('cuff', v); }, { placeholder: yng ? 'For example child, small adult' : 'For example standard adult, large adult' }))),
        yng ? centileBlock(b) : null,
        live.repeat,
        live.bp,
        ui.field('Notes on pulse and blood pressure', textIn(b.hrNote, function (v) { setB('hrNote', v); }, { rows: 2, placeholder: 'For example anxious at the first reading, caffeine, irregular pulse' })),
        h('h3', { class: 'tx-subh' }, 'Height and weight'),
        h('div', { class: 'form-grid tx-fields tx-f2' },
          ui.field('Height (cm)', numIn(b.heightCm, saveM('heightCm'))),
          ui.field('Weight (kg)', numIn(b.weightKg, saveM('weightKg')))),
        live.bmi);
    }
    function paintMeasure(a) {
      if (!live.bp) return;
      var b = obj(txOf(a).baseline), bp = Tx.bpCheck(a, b);
      var out = [note(bp.level, bp.level === 'unknown' ? 'Blood pressure not assessed yet' : 'Blood pressure check', bp.text)];
      if (bp.pulse) out.push(note(bp.pulse.level, 'Pulse', bp.pulse.text));
      fill(live.bp, out);
      var hgt = num(b.heightCm), wgt = num(b.weightKg);
      live.bmi.textContent = !yng && hgt && wgt ? 'BMI ' + (Math.round(10 * wgt / Math.pow(hgt / 100, 2)) / 10) + ' kg/m².' : '';
      /* Adults: second reading and ABPM or HBPM only when the first reading needs it (or something is recorded). */
      if (!yng) {
        var r3 = obj(b.repeat3), has3 = num(r3.sbp) !== null || num(r3.dbp) !== null;
        var need = bp.level === 'confirm' || bp.level === 'urgent' || bp.level === 'refer' || !!b.abpm || bpOf(obj(b.repeat)) !== null || num(obj(b.repeat).pulse) !== null || has3;
        var sig = need ? 'on' : 'off';
        if (sig !== live.repeatSig) {
          live.repeatSig = sig;
          var rep = obj(b.repeat);
          live.third = need ? h('div', { class: 'tx-third' }) : null;
          live.thirdSig = null;
          fill(live.repeat, need ? h('div', { class: 'tx-sub' },
            h('h3', { class: 'tx-subh' }, 'Second reading and confirmation'),
            h('p', { class: 'hint' }, 'Take a second reading in the same visit. The lower of the two readings counts as the clinic blood pressure. If it is 140/90 or higher but below 180/120, confirm with ambulatory or home readings.'),
            h('div', { class: 'form-grid tx-fields' },
              ui.field('Second systolic (mmHg)', numIn(rep.sbp, function (v) { setB('repeat.sbp', v); }, { int: true })),
              ui.field('Second diastolic (mmHg)', numIn(rep.dbp, function (v) { setB('repeat.dbp', v); }, { int: true })),
              ui.field('Second pulse (beats a minute)', numIn(rep.pulse, function (v) { setB('repeat.pulse', v); }, { int: true }))),
            live.third,
            ui.seg({ label: 'Ambulatory or home blood pressure (ABPM or HBPM)', options: ABPM, value: b.abpm || null, onChange: function (v) { setB('abpm', nil(v)); } })) : null);
        }
        paintThird(b);
      }
    }
    /* Third reading (baseline.repeat3): NICE NG136 asks for one when the second reading is substantially different
       from the first; the lower of the last two then counts. It opens by itself when one of the first two readings
       is 180/120 or higher, or when a third reading is recorded; otherwise a button opens it. */
    var thirdAsked = false;
    function paintThird(b) {
      if (!live.third) return;
      var rep = obj(b.repeat), r3 = obj(b.repeat3);
      var hasSecond = bpOf(rep) !== null;
      var high = function (s, d) { return (num(s) !== null && num(s) >= 180) || (num(d) !== null && num(d) >= 120); };
      var has3 = num(r3.sbp) !== null || num(r3.dbp) !== null;
      var show = has3 || (hasSecond && (high(b.sbp, b.dbp) || high(rep.sbp, rep.dbp) || thirdAsked));
      var tsig = show ? 'on' : hasSecond ? 'btn' : 'off';
      if (tsig === live.thirdSig) return;
      live.thirdSig = tsig;
      if (show) {
        fill(live.third, h('div', null,
          h('p', { class: 'hint' }, 'Third reading: take it when the second reading is very different from the first. The lower of the last two readings then counts as the clinic blood pressure.'),
          h('div', { class: 'form-grid tx-fields' },
            ui.field('Third systolic (mmHg)', numIn(r3.sbp, function (v) { setB('repeat3.sbp', v); }, { int: true })),
            ui.field('Third diastolic (mmHg)', numIn(r3.dbp, function (v) { setB('repeat3.dbp', v); }, { int: true })))));
      } else if (hasSecond) {
        fill(live.third, h('div', { class: 'row' }, ui.btn({ label: 'Add a third reading', kind: 'quiet', small: true, onClick: function () { thirdAsked = true; live.thirdSig = null; paintThird(obj(ctx.get('treatment.baseline', {}))); } }),
          h('span', { class: 'hint' }, 'Only if the first two readings are very different.')));
      } else U.clear(live.third);
    }

    /* ---- Set 2: heart history (questions to ask, then the examination and the readings) ---- */
    function heartTab() {
      var a = ctx.a() || {}, b = obj(txOf(a).baseline), map = obj(b.cardiac);
      var items = cardiacItems(a);
      live.heartRows = [];
      live.heartHist = h('div', { class: 'tx-histbar' });
      live.ecg = h('div', { class: 'tx-ecg' });
      live.ecgSig = null;
      function rowFor(c) {
        var row = qRow(c, yng && c.askYoung ? c.askYoung : c.ask, map[c.id], function (v) { setB('cardiac.' + c.id, nil(v)); },
          c.action === 'ecg' ? 'A yes means an ECG before starting.' : null);
        row.item = c;
        live.heartRows.push(row);
        return row;
      }
      var ask = items.filter(function (c) { return !EXAM_CX[c.id]; }).map(rowFor);
      var exam = items.filter(function (c) { return EXAM_CX[c.id]; }).map(rowFor);
      return h('div', null,
        h('p', { class: 'hint tx-tabhint' }, (yng ? 'The questions are worded for the parent or carer.' + (bandOf(a) === 'child' ? '' : ' Ask the young person too.') : 'Ask each question.') + ' A yes to a heart history question means a specialist heart opinion before starting.'),
        live.heartHist,
        ask.length && exam.length ? h('h3', { class: 'tx-subh' }, 'Ask about') : null,
        ask.length ? h('div', { class: 'tx-qs' }, ask) : null,
        exam.length ? h('h3', { class: 'tx-subh' }, 'Examination and readings') : null,
        exam.length ? h('div', { class: 'tx-qs' }, exam) : null,
        live.ecg);
    }
    function paintHeart(a) {
      if (!live.heartHist) return;
      var map = obj(obj(txOf(a).baseline).cardiac);
      live.heartRows.forEach(function (r) { r.paintHist(a, map[r.item.id], Tx.cardiacAnswer(a, r.item.id)); });
      var pending = live.heartRows.filter(function (r) { var x = Tx.cardiacAnswer(a, r.item.id); return x.fromHistory || x.fromRisk; }).map(function (r) { return r.item; });
      fill(live.heartHist, pending.length ? note('info', 'Answers from the clinical history', histSentence(pending.length, 'question'),
        [ui.btn({ label: 'Use answers from history (' + pending.length + ')', kind: 'ghost', small: true, onClick: function () { useHistory(pending, 'cardiac.', function (x, id) { return Tx.cardiacAnswer(x, id); }); } })]) : null);
      /* ECG and cardiology fields when the verdict needs them, or when something is recorded. */
      var b = obj(txOf(a).baseline);
      var anyYes = live.heartRows.some(function (r) { return Tx.cardiacAnswer(a, r.item.id).v === 'yes'; });
      var bpl = Tx.bpCheck(a, b).level;
      var need = anyYes || bpl === 'refer' || !!b.ecg || !!b.cardiology;
      var sig = need ? 'on' : 'off';
      if (sig !== live.ecgSig) {
        live.ecgSig = sig;
        fill(live.ecg, need ? h('div', { class: 'tx-sub' },
          h('h3', { class: 'tx-subh' }, 'ECG and specialist opinion'),
          ui.seg({ label: 'ECG', options: ECG, value: b.ecg || null, onChange: function (v) { setB('ecg', nil(v)); } }),
          ui.seg({ label: 'Cardiology or specialist opinion', options: CARDIO, value: b.cardiology || null, onChange: function (v) { setB('cardiology', nil(v)); } })) :
          h('p', { class: 'hint tx-sub' }, 'No ECG or heart opinion is needed so far. Routine ECGs are not needed before ADHD medicine.'));
      }
    }

    /* ---- Set 3: safety screen (contraindications and cautions), one group open at a time ---- */
    function safetyTab() {
      var a = ctx.a() || {}, map = obj(obj(txOf(a).baseline).ci);
      var groups = cautionGroups(a);
      live.safeRows = [];
      live.safeGroups = [];
      live.safeHist = h('div', { class: 'tx-histbar' });
      live.pregPend = h('p', { class: 'hint tx-pregpend', 'aria-live': 'polite' });
      var dets = [];
      var firstOpen = -1;
      groups.forEach(function (g, i) { if (firstOpen < 0 && g.items.some(function (c) { return Tx.ciAnswer(a, c.id).v === null; })) firstOpen = i; });
      live.cpHost = null; live.cpSig = null; live.cpNote = null;
      var groupEls = groups.map(function (g, i) {
        var meta = h('span', { class: 'tx-gmeta' });
        var rows = g.items.map(function (c) {
          var row = qRow(c, c.ask, map[c.id], function (v) { setB('ci.' + c.id, nil(v)); afterCi(c.id, v); }, affectsNode(c.id));
          row.item = c;
          if (c.id === 'ci_hepatic') {
            /* Under the whole row (after the yes/no answer on phones), across both columns. */
            live.cpHost = h('div', { class: 'tx-cp' });
            row.appendChild(live.cpHost);
          }
          live.safeRows.push(row);
          return row;
        });
        var d = ui.details(g.l, h('div', { class: 'tx-qs' }, rows), { cls: 'tx-grp', meta: meta, open: i === firstOpen, onToggle: function (open) {
          if (open) dets.forEach(function (x) { if (x !== d && x.open) x.open = false; });
        } });
        dets.push(d);
        live.safeGroups.push({ g: g, meta: meta });
        return d;
      });
      return h('div', null,
        h('p', { class: 'hint tx-tabhint' }, 'Ask about each condition and medicine. A yes shows which ADHD medicines it rules out or needs care with; the product cards use it too.'),
        live.safeHist,
        h('div', { class: 'tx-groups' }, groupEls),
        h('div', { class: 'row tx-rowend' }, ui.btn({ label: 'Mark the rest "No"', kind: 'quiet', small: true, onClick: function () {
          markRestNo(cautionItems(ctx.a() || {}), 'ci.', function (x, id) { return Tx.ciAnswer(x, id); });
        } })),
        pregItems().length ? h('div', { class: 'tx-sub tx-pregline' },
          h('p', { class: 'hint' }, showPreg || pregShown[ctx.id]
            ? 'Pregnancy and breastfeeding are not asked here. One pregnancy question covers them, under "' + otherLabel + '".'
            : 'Pregnancy and breastfeeding are not asked here. One pregnancy question covers them, from age 12.'),
          live.pregPend,
          showPreg || pregShown[ctx.id] ? h('div', { class: 'row' }, ui.btn({ label: 'Go to the pregnancy question', kind: 'quiet', small: true, onClick: function () { openSet('other'); } })) : null) : null);
    }
    function paintSafety(a) {
      if (!live.safeHist) return;
      var map = obj(obj(txOf(a).baseline).ci);
      live.safeRows.forEach(function (r) { r.paintHist(a, map[r.item.id], Tx.ciAnswer(a, r.item.id)); });
      live.safeGroups.forEach(function (x) {
        var answered = 0, yes = 0;
        x.g.items.forEach(function (c) { var v = Tx.ciAnswer(a, c.id).v; if (v) answered++; if (v === 'yes') yes++; });
        fill(x.meta, [cnt(answered, x.g.items.length, 'answered'), yes ? ui.badge(yes + ' yes', 'warn') : null]);
      });
      var bl = obj(txOf(a).baseline);
      paintChildPugh(a, bl);
      live.pregPend.textContent = (pregDue(a) || pregShown[ctx.id]) && pregFollowOpen(bl) ? 'Still to answer there: "' + pregFollow(bl).l + '"' : '';
      var pending = cautionItems(a).filter(function (c) { var x = Tx.ciAnswer(a, c.id); return x.fromHistory || x.fromRisk; });
      /* Safety-step answers the engine does not count yet: they stay unanswered until the clinician answers them. */
      var linked = cautionItems(a).filter(function (c) { return Tx.ciAnswer(a, c.id).v === null && riskTicked(a, c).length; });
      var fromRisk = pending.some(function (c) { return Tx.ciAnswer(a, c.id).fromRisk; });
      fill(live.safeHist, [
        pending.length ? note(fromRisk ? 'warn' : 'info', fromRisk ? 'Answers from the history and the safety step' : 'Answers from the clinical history',
          fromRisk ? (pending.length === 1 ? 'One item already has' : pending.length + ' items already have') + ' a yes in the clinical history or the safety step. Check with the person, then save the answers.' : histSentence(pending.length, 'item'),
          [ui.btn({ label: (fromRisk ? 'Use these answers (' : 'Use answers from history (') + pending.length + ')', kind: 'ghost', small: true, onClick: function () { useHistory(pending, 'ci.', function (x, id) { return Tx.ciAnswer(x, id); }); } })]) : null,
        linked.length ? note('warn', 'From the safety step', 'Answer ' + (linked.length === 1 ? 'this item' : 'these items') + ' with the person: ' + linked.map(function (c) { return lc(c.t); }).join('; ') + '. The safety step recorded ' + uniq([].concat.apply([], linked.map(function (c) { return riskTicked(a, c); }))).map(function (id) { return lc(riskLabel(id)); }).join(', ') + '.') : null,
        oldCypOpen(bl) ? note('warn', 'An older answer covers both CYP3A4 questions', 'This record has a yes to the earlier combined question (a CYP3A4 inhibitor or inducer). Ask which it is and answer both questions under "Medicines and interactions". Until then the guanfacine dose is worked out as for an inhibitor.') : null
      ]);
    }
    /* Child-Pugh class under the liver item, only while that item is a yes (recorded or from history). */
    function paintChildPugh(a, b) {
      if (!live.cpHost) return;
      var on = Tx.ciAnswer(a, 'ci_hepatic').v === 'yes';
      if ((on ? 'on' : 'off') !== live.cpSig) {
        live.cpSig = on ? 'on' : 'off';
        live.cpNote = on ? h('p', { class: 'hint tx-cpnote' }) : null;
        fill(live.cpHost, on ? h('div', { class: 'tx-cpq' },
          ui.seg({ label: 'Child-Pugh class', small: true, options: CHILD_PUGH, value: b.childPugh || null, onChange: function (v) { setB('childPugh', nil(v)); } }),
          live.cpNote) : null);
      }
      if (live.cpNote) {
        live.cpNote.textContent = b.childPugh === 'A'
          ? 'Child-Pugh A is mild impairment. This question is about moderate or severe impairment: if it is mild, answer No above.'
          : b.childPugh === 'B' || b.childPugh === 'C'
            ? 'Atomoxetine: the starting and target doses are ' + (b.childPugh === 'C' ? 'a quarter' : 'half') + ' of the usual dose. Check each SmPC for the other medicines.'
            : 'Record the class from the liver team or the notes. Atomoxetine: Child-Pugh B halves the starting and target doses; C cuts them to a quarter.';
      }
    }
    /* After a safety-screen answer: a liver item that is no longer yes drops its Child-Pugh class; once both new
       CYP3A4 items are answered, the older combined answer is no longer needed. */
    function afterCi(id, v) {
      if (id === 'ci_hepatic' && v !== 'yes' && ctx.get('treatment.baseline.childPugh') !== undefined) setB('childPugh', undefined);
      if (CYP_NEW.indexOf(id) > -1) {
        var ci = obj(ctx.get('treatment.baseline.ci', {}));
        if (ci.ci_cyp3a4 !== undefined && CYP_NEW.every(function (k) { return !AA.byId('txCautions', k) || ci[k] === 'yes' || ci[k] === 'no'; })) setB('ci.ci_cyp3a4', undefined);
      }
    }

    /* ---- Set 4: medicines, misuse, pregnancy, driving ---- */
    function otherTab() {
      var b = B();
      live.misuse = h('div', { class: 'tx-live', 'aria-live': 'polite' });
      return h('div', null,
        ui.field('Current medicines', textIn(b.meds, function (v) { setB('meds', v); }, { rows: 3, placeholder: 'Prescribed, over the counter, supplements, caffeine and energy drinks, and any drugs not prescribed' })),
        h('div', { class: 'tx-sub' },
          ui.seg({ label: 'Risk of misuse or diversion', options: MISUSE, value: b.misuse || null, onChange: function (v) { setB('misuse', nil(v)); } }),
          live.misuse,
          ui.field('Notes on misuse and diversion', textIn(b.misuseNotes, function (v) { setB('misuseNotes', v); }, { rows: 2, placeholder: yng ? 'Who looks after the medicine at home and school; siblings or friends at risk' : 'Substance use, who else lives at home, past diversion' }))),
        pregBlock(b),
        showDrive ? h('div', { class: 'tx-sub' },
          ui.seg({ label: 'Driving', options: DRIVE, value: b.driving || null, onChange: function (v) { setB('driving', nil(v)); } })) : null,
        h('div', { class: 'tx-sub' },
          ui.field('Other notes', textIn(b.notes, function (v) { setB('notes', v); }, { rows: 2, placeholder: 'Anything else that affects the choice of medicine' }))));
    }
    /* One pregnancy question for pregnancy, breastfeeding and contraception (it also answers the
       pregnancy and breastfeeding items of the safety screen). Under 12 it stays closed until asked for. */
    function pregBlock(b) {
      live.preg = null;
      if (!showPreg && !pregShown[ctx.id] && !b.pregnancy && b.contraception !== true) {
        return h('div', { class: 'tx-sub tx-pregoff' },
          h('p', { class: 'hint' }, 'Pregnancy and contraception are asked from age 12.'),
          h('div', { class: 'row' }, ui.btn({ label: 'Show anyway', kind: 'quiet', small: true, onClick: function () { pregShown[ctx.id] = true; openSet('other', true); src.paint(ctx.a() || {}); } })));
      }
      live.preg = h('div', { class: 'tx-live', 'aria-live': 'polite' });
      live.pregMore = h('div', { class: 'tx-live tx-pregmore' });
      live.pregMoreSig = null;
      return h('div', { class: 'tx-sub' },
        ui.seg({ label: 'Pregnancy and breastfeeding', options: PREG, value: b.pregnancy || null, onChange: function (v) {
          setB('pregnancy', nil(v));
          /* This answer settles the two hidden safety-screen items, so earlier answers to them are cleared
             (the engine reads them from this question; the follow-up below asks about the other state). */
          var ci = obj(ctx.get('treatment.baseline.ci', {}));
          PREG_CI.forEach(function (id) { if (ci[id] !== undefined) setB('ci.' + id, undefined); });
        } }),
        live.pregMore,
        h('p', { class: 'hint' }, 'Ask everyone who could become pregnant' + (yng ? ', in private where you can' : '') + '. Never assume. This answer also covers pregnancy and breastfeeding in the safety screen.'),
        live.preg,
        ui.check({ label: 'Uses reliable contraception', checked: b.contraception === true, onChange: function (on) { setB('contraception', on ? true : undefined); } }));
    }
    function paintOther(a) {
      if (!live.misuse) return;
      var b = obj(txOf(a).baseline), m = b.misuse;
      fill(live.misuse, m === 'moderate' || m === 'high'
        ? note('warn', null, 'Avoid immediate-release stimulants, and modified-release ones that are easy to inject or snort. The product cards mark them. Supervised or instalment supply may help.')
        : null);
      if (!live.preg) return;
      /* Follow-up about the other state (rebuilt only when the question changes) */
      var f = pregFollow(b), fsig = f && AA.byId('txCautions', f.id) ? f.id : '';
      if (fsig !== live.pregMoreSig) {
        live.pregMoreSig = fsig;
        fill(live.pregMore, fsig ? h('div', { class: 'tx-pregq' }, ui.seg({ label: f.l, small: true, options: YN_RISK, value: obj(b.ci)[f.id] === 'yes' || obj(b.ci)[f.id] === 'no' ? obj(b.ci)[f.id] : null,
          onChange: function (v) { setB('ci.' + f.id, nil(v)); } })) : null);
      }
      /* History ticks, or an older safety-screen answer, that point to pregnancy: shown until the question is answered. */
      var hints = [];
      if (!b.pregnancy) {
        var ids = [];
        pregItems().forEach(function (c) { T().histTicked(a, c.hist).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); }); });
        if (ids.length) hints.push('The clinical history notes: ' + ids.map(histLabel).join('; ') + '.');
        var old = pregItems().filter(function (c) { return obj(b.ci)[c.id] === 'yes'; }).map(function (c) { return lc(c.t); });
        if (old.length) hints.push('An earlier safety-screen answer was yes to: ' + old.join('; ') + '.');
      }
      fill(live.preg, hints.length ? h('p', { class: 'tx-hist' }, ui.badge('From history', 'info'), ' ', h('span', null, hints.join(' ') + ' Ask, then record the answer.')) : null);
    }

    function useHistory(items, prefix, answerFn) {
      var a = ctx.a() || {}, n = 0;
      items.forEach(function (c) { var x = answerFn(a, c.id); if (x.fromHistory || x.fromRisk) { setB(prefix + c.id, 'yes'); n++; } });
      U.toast(n ? plural(n, 'answer') + ' saved' : 'Nothing to save', n ? 'ok' : 'warn');
      if (stepper) stepper.show(stepper.index());
    }
    /* Items linked to a ticked safety-step answer are never marked "No" in bulk: the clinician answers them. */
    /* Items linked to an older combined CYP3A4 yes are not marked "No" in bulk either. */
    function markRestNo(items, prefix, answerFn) {
      var a = ctx.a() || {}, oldCyp = prefix === 'ci.' && oldCypOpen(obj(txOf(a).baseline));
      var open = items.filter(function (c) { return answerFn(a, c.id).v === null; });
      var todo = open.filter(function (c) { return !riskTicked(a, c).length && !(oldCyp && CYP_NEW.indexOf(c.id) > -1); }), kept = open.length - todo.length;
      if (!todo.length) { U.toast(kept ? 'Answer the items linked to the safety step or an earlier answer yourself' : 'Every item is answered', kept ? 'warn' : 'ok'); return; }
      U.confirm({ title: 'Answer "No" to ' + plural(todo.length, 'item') + '?', body: 'Only do this after you have asked about each one. Answers already recorded, and yes answers from the history, stay as they are.' +
        (kept ? ' ' + (kept === 1 ? 'One item is' : kept + ' items are') + ' linked to the safety step or an earlier answer and stay for you to answer.' : ''), ok: 'Mark as No' })
        .then(function (yes) {
          if (!yes) return;
          todo.forEach(function (c) { setB(prefix + c.id, 'no'); if (prefix === 'ci.') afterCi(c.id, 'no'); });
          if (stepper) stepper.show(stepper.index());
        });
    }

    /* Recorded / of, for each set of checks (the summary facts and the stepper's ticks). */
    function counts(a) {
      var b = obj(txOf(a).baseline);
      function c(list) { return { done: list.filter(Boolean).length, of: list.length }; }
      return {
        m: c([!!b.date, bpOf(b) !== null, num(b.pulse) !== null, num(b.heightCm) !== null, num(b.weightKg) !== null].concat(yng ? [!!b.bpCentile] : [])),
        heart: c(cardiacItems(a).map(function (x) { return Tx.cardiacAnswer(a, x.id).v !== null; })),
        safety: c(cautionItems(a).map(function (x) { return Tx.ciAnswer(a, x.id).v !== null; })),
        other: c([!!String(b.meds || '').trim(), !!b.misuse].concat(showPreg ? [!!b.pregnancy] : [])
          .concat(showPreg && pregFollow(b) && AA.byId('txCautions', pregFollow(b).id) ? [!pregFollowOpen(b)] : [])
          .concat(showDrive ? [!!b.driving] : []))
      };
    }
    var SETS = [
      { id: 'm', label: 'Measurements', sub: 'Blood pressure, pulse, height and weight.', render: measureTab },
      { id: 'heart', label: 'Heart history', sub: 'Heart symptoms, family history and the examination.', render: heartTab },
      { id: 'safety', label: 'Safety screen', sub: 'Conditions and medicines that rule out an ADHD medicine or need care with it.', render: safetyTab },
      { id: 'other', label: otherLabel, sub: showDrive ? 'Current medicines, misuse risk, pregnancy and driving.' : showPreg ? 'Current medicines, misuse risk and pregnancy.' : 'Current medicines and the risk of misuse.', render: otherTab }
    ];
    function setIndex(id) { for (var i = 0; i < SETS.length; i++) if (SETS[i].id === id) return i; return 0; }
    var c0 = counts(a0), start = 0;
    for (var si = 0; si < SETS.length; si++) { var x0 = c0[SETS[si].id]; if (x0.done < x0.of) { start = si; break; } }
    var curTab = SETS[start].id, stepper = null;
    stepper = ui.stepper(SETS.map(function (s) {
      return { title: s.label, sub: s.sub, label: s.label, render: s.render,
        done: function () { var x = counts(ctx.a() || {})[s.id]; return x.of > 0 && x.done >= x.of; } };
    }), { start: start, label: 'Pre-treatment checks', eyebrow: function (i) { return 'Checks ' + (i + 1) + ' of ' + SETS.length; },
      onChange: function (i) { curTab = SETS[i].id; paintTab(ctx.a() || {}); } });
    stepper.classList.add('tx-setstep');
    el.appendChild(stepper);
    /* Open one set of checks (from a summary fact or a "Go to" button) and bring it into view. */
    function openSet(id, stay) {
      stepper.show(setIndex(id));
      if (!stay) reveal(stepper);
    }

    /* Only the set on screen is painted: each set renders fresh hosts when it is shown. */
    function paintTab(a) {
      if (curTab === 'm') paintMeasure(a);
      else if (curTab === 'heart') paintHeart(a);
      else if (curTab === 'safety') paintSafety(a);
      else if (curTab === 'other') paintOther(a);
    }
    var src = stepSources(el, function (a) {
      var v = Tx.baselineVerdict(a);
      var young = isYoung(a);
      return ['NICE NG87 1.7.4 (baseline before medicine)', 'NICE NG87 1.7.5 (heart history: when to get a cardiology opinion)']
        .concat(young ? ['NICE NG87 1.7.6 (children and young people: blood pressure consistently above the 95th centile for age and height; no chart named)',
          'NHBPEP Fourth Report, Pediatrics 2004;114:555 (centiles by age, sex and height)', 'Flynn JT et al., AAP clinical practice guideline, Pediatrics 2017;140:e20171904',
          'Jackson LV, Thalange NKS, Cole TJ, Blood pressure centiles for Great Britain, Arch Dis Child 2007;92:298–303',
          'Clinical practice: record which centile chart you used, and use the same chart at every review']
          : ['NICE NG136 1.2.2 (a second reading, and a third when the second is substantially different; the lower of the last two is the clinic blood pressure)', 'NICE NG136 1.2.3–1.2.8 (confirming hypertension with ABPM or HBPM)', 'NICE NG136 1.5.1–1.5.3 (180/120 or higher)'])
        .concat([Tx.bpCheck(a, obj(txOf(a).baseline)).src])
        .concat(cardiacItems(a).map(function (x) { return x.src; }))
        .concat(arr(v.reasons).map(function (r) { return r.src; }))
        .concat(cautionItems(a).map(function (x) { return x.src; }))
        .concat(['NICE NG87 1.7.23–1.7.24 (misuse and diversion risk)'])
        .concat(pregDue(a) || pregShown[ctx.id] ? pregItems().map(function (x) { return x.src; }) : []);
    });
    /* One fact per set of checks in the verdict: how many are recorded; a tap opens that set. */
    function setFacts(a) {
      var c = counts(a);
      return SETS.map(function (s) {
        var x = c[s.id];
        return { k: s.label, v: x.done + ' of ' + x.of, kind: x.of && x.done >= x.of ? 'ok' : x.done ? 'warn' : 'neutral', title: 'Open ' + lc(s.label), onClick: function () { openSet(s.id); } };
      });
    }
    function paintAll() {
      var a = ctx.a() || {};
      verdict.paint(a, setFacts(a));
      stepper.refresh();
      paintTab(a);
      src.paint(a);
    }
    paintAll();
    ctx.onChange('treatment', U.debounce(function () { if (el.isConnected) paintAll(); }, 80));
    return null;
  } };

  /* =================================================================================
     Step: choose and prescribe (six stages, one at a time)
     Notes > summary (medicine, product, starting dose, next prescription, the next stage) > stage track > the stage:
     its own cards (NICE pathway, product comparison cards, the titration ladder, grouped checklists).
     ================================================================================= */
  var STAGES = [
    { id: 'prior', l: 'Previous medicines' },
    { id: 'options', l: 'NICE options' },
    { id: 'product', l: 'Product' },
    { id: 'dose', l: 'Starting dose' },
    { id: 'counsel', l: 'Counselling' },
    { id: 'rx', l: 'Prescription' }
  ];
  var stageMem = {};       /* current stage per assessment (screen state only) */
  function stageIndex(id) { for (var i = 0; i < STAGES.length; i++) if (STAGES[i].id === id) return i; return 0; }
  function stageDone(a, id) {
    var t = txOf(a), ch = obj(t.choice);
    switch (id) {
      case 'prior': return Object.keys(obj(t.prior)).length > 0 || !!ch.drug;
      case 'options': return !!ch.drug;
      case 'product': return !!ch.product;
      case 'dose': return num(ch.startDose) !== null && !!ch.startDate;
      case 'counsel':
        var cs = counselFor(a), done = obj(ch.counsel);
        return cs.length > 0 && cs.every(function (c) { return done[c.id]; });
      case 'rx':
        var rx = obj(ch.rx);
        return !!ch.product && (num(ch.supplyDays) !== null || num(ch.quantity) !== null) && rxChecksFor(a).every(function (c) { return rx[c.id]; });
    }
    return false;
  }
  function firstStage(a) {
    var t = txOf(a), ch = obj(t.choice);
    if (!ch.drug) return Object.keys(obj(t.prior)).length ? 'options' : 'prior';
    for (var i = 1; i < STAGES.length; i++) if (!stageDone(a, STAGES[i].id)) return STAGES[i].id;
    return 'rx';
  }
  var OPT_STATUS = { next: ['Next step', 'accent'], possible: ['Possible', 'info'], done: ['Tried', 'neutral'], tertiary: ['Specialist advice', 'warn'], blocked: ['Not yet', 'neutral'] };

  /* Choose a medicine. Changing it after a start date clears the old medicine's dose details (after a check). */
  function chooseDrug(ctx, drugId, after) {
    var ch = obj(ctx.get('treatment.choice', {}));
    if (ch.drug === drugId) { if (after) after(); return; }
    var started = !!ch.drug && (!!ch.startDate || num(ch.startDose) !== null);
    function apply() {
      ctx.set('treatment.choice.drug', drugId);
      var p = prodOf(ch.product);
      if (ch.product && (!p || p.drug !== drugId)) ctx.set('treatment.choice.product', undefined);
      if (started) ['startDose', 'startDate', 'times', 'perDay', 'doses', 'overMaxReason', 'rxDose', 'rxDoseDate', 'counsel', 'rx'].forEach(function (k) { ctx.set('treatment.choice.' + k, undefined); });
      if (after) after();
    }
    if (!started) { apply(); return; }
    U.confirm({ title: 'Change the medicine?', body: 'This clears the starting dose, start date, counselling and prescription ticks recorded for ' + lc(drugName(ch.drug)) + '. Its reviews stay in the record but no longer set the dose: the new medicine starts at its own starting dose. If it was tried, record it under previous medicines first.', ok: 'Change medicine' })
      .then(function (yes) { if (yes) apply(); });
  }
  function stageLead(text) { return h('p', { class: 'tx-stage-p' }, text); }
  function firstNote(kind, title, label, onClick) {
    return card(null, note(kind, title, null, [ui.btn({ label: label, kind: 'ghost', small: true, onClick: onClick })]));
  }

  /* ---- Stage 1: previous medicines ---- */
  function stagePrior(host, ctx) {
    var openId = null, sig = null, rows = {};
    var listHost = h('div', { class: 'tx-rows' });
    var drugs = arr(AA.data.txDrugs);
    host.appendChild(stageLead('Record each ADHD medicine taken before: the product, the highest daily dose, how many weeks, and how it went. The NICE options in the next stage use this.'));
    host.appendChild(card(null, [
      h('p', { class: 'hint tx-tabhint' }, 'A trial counts as adequate after 6 weeks at the optimised or maximum dose, not 6 weeks from the first dose. If this is the first ADHD medicine, go on to the next stage.'),
      listHost,
      h('div', { class: 'row tx-addrow' }, ui.btn({ label: '+ Add a previous medicine', kind: 'ghost', onClick: function () {
        var k = U.uid(); openId = k; ctx.set('treatment.prior.' + k, { drug: '' });
      } }))
    ], 'tx-priorcard'));
    function priorMap(a) { return obj(txOf(a).prior); }
    function sumText(p) {
      var bits = [p.drug ? drugName(p.drug) : 'Medicine not chosen'];
      if (p.product) bits.push(prodName(p.product));
      if (num(p.maxDose) !== null) bits.push('up to ' + fmt(num(p.maxDose)) + ' mg');
      if (num(p.weeks) !== null) bits.push(plural(num(p.weeks), 'week'));
      if (num(p.weeksAtDose) !== null) bits.push(num(p.weeksAtDose) + ' at the final dose');
      return bits.join(' · ');
    }
    function paintSum(k, p) {
      var r = rows[k]; if (!r) return;
      fill(r.sum, [h('span', null, sumText(p)), p.outcome ? ui.badge(labelOf(OUTCOMES, p.outcome), p.outcome === 'worked' ? 'ok' : p.outcome === 'stopped_other' ? 'neutral' : 'warn') : ui.badge('Outcome not recorded', 'neutral'),
        (p.outcome === 'no_response' || p.outcome === 'partial') && p.adequate === true ? ui.badge('Adequate trial', 'info') : null]);
    }
    function rowEl(k, p) {
      var base = 'treatment.prior.' + k + '.';
      var sum = h('span', { class: 'tx-rowsum' });
      var prods = arr(AA.data.txProducts).filter(function (x) { return x.drug === p.drug; });
      var drugSel = selectIn([['', 'Choose the medicine']].concat(drugs.map(function (d) { return [d.id, d.name]; })), p.drug || '', function (v) {
        var cur = obj(ctx.get('treatment.prior.' + k, {}));
        var pr = prodOf(cur.product);
        ctx.set(base + 'drug', v || '');
        if (cur.product && (!pr || pr.drug !== v)) ctx.set(base + 'product', undefined);
      });
      var prodSel = selectIn([['', p.drug ? 'Not known, or generic' : 'Choose the medicine first']].concat(prods.map(function (x) { return [x.id, x.name]; })), p.product || '', function (v) { ctx.set(base + 'product', v || undefined); });
      var body = h('div', { class: 'tx-rowbody' },
        h('div', { class: 'form-grid tx-fields' },
          ui.field('Medicine', drugSel),
          ui.field('Product', prodSel),
          ui.field('Highest daily dose (mg)', numIn(p.maxDose, function (v) { ctx.set(base + 'maxDose', v); })),
          ui.field('Weeks taken', numIn(p.weeks, function (v) { ctx.set(base + 'weeks', v); }, { int: true })),
          ui.field('Weeks at the final dose', numIn(p.weeksAtDose, function (v) { ctx.set(base + 'weeksAtDose', v); }, { int: true }), 'At the optimised or maximum dose.')),
        ui.seg({ label: 'How it went', options: OUTCOMES, value: p.outcome || null, onChange: function (v) { ctx.set(base + 'outcome', nil(v)); } }),
        ui.check({ label: 'Adequate trial: 6 weeks at the optimised or maximum dose', hint: 'Count the weeks at that dose, not since the first dose. This matters when the medicine did not help enough: NICE moves on only after an adequate trial.', checked: p.adequate === true,
          onChange: function (on) { ctx.set(base + 'adequate', on ? true : undefined); } }),
        ui.field('Notes', textIn(p.notes, function (v) { ctx.set(base + 'notes', v); }, { rows: 2, placeholder: 'Side effects, why it stopped, who prescribed it' })),
        h('div', { class: 'row tx-rowend' }, ui.btn({ label: 'Remove this medicine', kind: 'quiet', small: true, onClick: function () {
          U.confirm({ title: 'Remove this previous medicine?', body: sumText(obj(ctx.get('treatment.prior.' + k, {}))) + '. This cannot be undone.', ok: 'Remove', danger: true })
            .then(function (yes) { if (yes) ctx.set('treatment.prior.' + k, undefined); });
        } })));
      var d = ui.details(sum, body, { cls: 'tx-row', open: k === openId, onToggle: function (open) {
        if (open) { openId = k; Object.keys(rows).forEach(function (x) { if (x !== k && rows[x].d.open) rows[x].d.open = false; }); }
        else if (openId === k) openId = null;
      } });
      rows[k] = { d: d, sum: sum, drugSel: drugSel };
      return d;
    }
    function render(a) {
      var map = priorMap(a);
      U.clear(listHost); rows = {};
      var keys = Object.keys(map).filter(function (k) { return map[k] && typeof map[k] === 'object'; });
      if (!keys.length) { listHost.appendChild(h('p', { class: 'muted tx-empty' }, 'None recorded.')); return; }
      keys.forEach(function (k) { listHost.appendChild(rowEl(k, obj(map[k]))); paintSum(k, obj(map[k])); });
      if (openId && rows[openId] && !obj(map[openId]).drug) { try { rows[openId].drugSel.focus(); } catch (e) { /* ignore */ } }
    }
    function refresh(a) {
      var map = priorMap(a);
      var s = Object.keys(map).map(function (k) { return k + ':' + (obj(map[k]).drug || ''); }).join('|');
      if (s !== sig) { sig = s; render(a); return; }
      Object.keys(rows).forEach(function (k) { paintSum(k, obj(map[k])); });
    }
    refresh(ctx.a() || {});
    return { refresh: refresh };
  }

  /* ---- Stage 2: NICE options (a numbered pathway), then the chosen medicine ---- */
  function stageOptions(host, ctx, a0, go) {
    var Tx = T(), listHost = h('div'), infoHost = h('div', { class: 'tx-infohost', 'aria-live': 'polite' });
    host.appendChild(stageLead((isYoung(a0) ? 'The NICE order for children and young people (6 to 17).' : 'The NICE order for adults.') + ' The status of each step uses the previous medicines you recorded.'));
    host.appendChild(card(null, listHost, 'tx-pathcard'));
    host.appendChild(infoHost);
    function paint(a) {
      var opts = Tx.options(a), ch = obj(txOf(a).choice);
      if (!opts.length) {
        fill(listHost, note('err', 'No ADHD medicine in this tool for this age', 'Under 6: refer to a service with expertise in ADHD in young children.', [goBtn(ctx, 'setup', 'Back to the first step')]));
        U.clear(infoHost); infoHost.__txSig = null;
        return;
      }
      fill(listHost, h('ol', { class: 'tx-path' }, opts.map(function (o) {
        var s = OPT_STATUS[o.status] || OPT_STATUS.possible;
        return h('li', { class: 'tx-path-i tx-path-' + o.status + (o.current ? ' is-current' : '') },
          h('span', { class: 'tx-path-n', 'aria-hidden': 'true' }, String(o.n)),
          h('div', { class: 'tx-path-head' },
            h('span', { class: 'tx-path-l' }, h('span', { class: 'sr-only' }, 'Step ' + o.n + ': '), o.label),
            ui.badge(s[0], s[1]),
            o.current ? ui.badge('Chosen', 'ok') : null),
          o.when ? h('p', { class: 'tx-path-when' }, stripClauses(o.when)) : null,
          o.why ? h('p', { class: 'tx-path-why' }, stripClauses(o.why)) : null,
          o.drugs.length ? h('div', { class: 'row tx-path-act' }, o.drugs.map(function (d) {
            var chosen = ch.drug === d;
            return ui.btn({ label: chosen ? '✓ ' + drugName(d) + ' chosen' : 'Choose ' + lc(drugName(d)), kind: chosen ? 'secondary' : o.status === 'next' ? 'primary' : 'ghost', small: true,
              onClick: function () { chooseDrug(ctx, d, function () { go('product'); }); } });
          })) : null);
      })));
      paintInfo(a, opts);
    }
    function paintInfo(a, opts) {
      var ch = obj(txOf(a).choice), d = drugOf(ch.drug);
      if (!d) { fill(infoHost, h('p', { class: 'hint tx-shared' }, 'Choose a medicine with ' + who(a) + (isYoung(a) ? ' and their family' : '') + ': a shared decision.')); return; }
      var mine = opts.filter(function (o) { return o.drugs.indexOf(d.id) > -1; });
      var usual = mine.some(function (o) { return o.status === 'next' || o.status === 'possible'; });
      var cs = Tx.cautionsFor(a, d.id), ci = cs.filter(function (c) { return c.level === 'ci'; }), ca = cs.filter(function (c) { return c.level !== 'ci'; });
      var out = [];
      if (!usual) out.push(note('warn', 'Outside the usual NICE order for this age', 'Next: record the reason (for example specialist or tertiary advice) in "Reason for this choice" at the product stage.'));
      if (ci.length) out.push(note('err', 'Contraindicated for this person', [bullets(ci.map(String)), h('p', null, 'Next: do not prescribe ' + lc(d.name) + ' unless a specialist advises it. Choose another option.')]));
      if (ca.length) out.push(note('warn', 'Cautions for this person', [bullets(ca.map(String)), h('p', null, 'Next: weigh each one, check the SmPC and record your reasoning.')]));
      out.push(kvList([
        ['Legal status', d.cd],
        ['Licence', obj(d.licence)[isYoung(a) ? 'child' : 'adult']],
        ['A fair trial', d.trial && d.trial.note ? stripClauses(d.trial.note) : '']
      ]));
      var ints = arr(d.interactions);
      if (ints.length) {
        out.push(ui.details('Interactions', h('ul', { class: 'tx-ul tx-ints' }, ints.map(function (x) {
          return h('li', null, x.level === 'ci' ? ui.badge('Do not combine', 'err') : ui.badge('Caution', 'warn'), ' ', stripClauses(x.t));
        })), { cls: 'tx-bare', meta: String(ints.length) }));
      }
      if (arr(d.notes).length) out.push(ui.details('More about ' + lc(d.name), bullets(d.notes), { cls: 'tx-bare', meta: String(d.notes.length) }));
      fill(infoHost, card(d.name, out, 'tx-druginfo', h('span', { class: 'tx-cls' }, d.cls)));
    }
    paint(a0);
    return { refresh: paint };
  }

  /* ---- Stage 3: product: comparison cards grouped by release type, one product's detail below ---- */
  function productGroup(p) {
    if (p.ir) return 'Immediate release';
    var f = String(p.form || 'Other');
    return /(tablet|capsule)$/i.test(f) ? f + 's' : f;
  }
  var PSTATE = { ok: 'Licensed for this age', cond: 'Licence condition to confirm', off: 'Off-label', bad: 'Not suitable for this person' };
  function strengthLine(p) { return p.strengthText || (arr(p.strengths).length ? arr(p.strengths).join(', ') + ' ' + (p.unit || 'mg') : ''); }
  function stageProduct(host, ctx, a0, go) {
    var Tx = T(), ch0 = obj(txOf(a0).choice);
    if (!ch0.drug) {
      host.appendChild(firstNote('info', 'Choose a medicine first', 'Go to NICE options', function () { go('options'); }));
      return null;
    }
    var drug = ch0.drug, rows = Tx.products(a0, drug), byId = {};
    rows.forEach(function (r) { byId[r.id] = r; });
    var groups = [];
    arr(AA.data.txProducts).forEach(function (p) {
      if (!p || p.drug !== drug || !byId[p.id]) return;
      var key = productGroup(p), g = groups.filter(function (x) { return x.key === key; })[0];
      if (!g) { g = { key: key, ids: [] }; groups.push(g); }
      g.ids.push(p.id);
    });
    var preview = byId[ch0.product] ? ch0.product : (rows[0] && rows[0].id) || null;
    var active = 0;
    groups.forEach(function (g, i) { if (g.ids.indexOf(preview) > -1) active = i; });
    var cards = {}, chipEls = [];
    var gridHost = h('ul', { class: 'tx-pcards', 'aria-label': 'Products for ' + lc(drugName(drug)) });
    var detailHost = h('div', { class: 'tx-prodhost', 'aria-live': 'polite' });
    /* ok: licensed; cond: licensed once a licence condition is recorded; off: off-label; bad: not suitable */
    function stateOf(r) { return r.blocked.length ? 'bad' : r.licensed ? 'ok' : r.licence && r.licence.conditionUnconfirmed ? 'cond' : 'off'; }
    function cautionCount(r) { return r.cautions.filter(function (c) { return String(c) !== String(r.licenceNote || ''); }).length; }
    function recompute(a) { rows = Tx.products(a, drug); byId = {}; rows.forEach(function (r) { byId[r.id] = r; }); }
    function cardFor(pid) {
      var r = byId[pid], p = r.p;
      /* The form is left out where the release-type filter above already names it. */
      var form = groups.length > 1 && !p.ir ? '' : String(p.form || '');
      var b = h('button', { type: 'button', class: 'tx-pcard', 'aria-pressed': 'false', onclick: function () {
        preview = pid; paintGrid(); paintDetail(ctx.a() || {});
        if (narrow()) reveal(detailHost);
      } },
        h('span', { class: 'tx-pcard-top' }, h('span', { class: 'tx-pcard-n' }, p.name), h('span', { class: 'tx-pcard-c' })),
        h('span', { class: 'tx-pcard-st' }, h('span', { class: 'tx-dot', 'aria-hidden': 'true' }), h('span', { class: 'tx-pcard-stt' })),
        form || p.lasts ? h('span', { class: 'tx-pcard-f' }, [form, p.lasts ? (form ? 'lasts ' : 'Lasts ') + p.lasts : null].filter(Boolean).join(' · ')) : null,
        strengthLine(p) ? h('span', { class: 'tx-pcard-s' }, strengthLine(p)) : null);
      cards[pid] = b;
      return h('li', null, b);
    }
    function buildGrid() {
      cards = {};
      U.clear(gridHost);
      var g = groups[active];
      if (g) U.append(gridHost, g.ids.map(cardFor));
      paintGrid();
    }
    /* The cards show the state worked out now (a licence condition or a screen answer can change it). */
    function paintGrid() {
      var chosen = obj(ctx.get('treatment.choice', {})).product;
      Object.keys(cards).forEach(function (pid) {
        var b = cards[pid], r = byId[pid], st = r ? stateOf(r) : 'off', nc = r && st !== 'bad' ? cautionCount(r) : 0;
        ['ok', 'cond', 'off', 'bad'].forEach(function (k) { b.classList.toggle('st-' + k, k === st); });
        b.querySelector('.tx-pcard-stt').textContent = PSTATE[st] + (nc ? ' · ' + plural(nc, 'caution') : '');
        b.setAttribute('aria-pressed', pid === preview ? 'true' : 'false');
        b.classList.toggle('is-chosen', pid === chosen);
        b.querySelector('.tx-pcard-c').textContent = pid === chosen ? '✓ Chosen' : '';
      });
    }
    function selectGroup(i) {
      active = i;
      chipEls.forEach(function (b, j) { b.classList.toggle('is-on', j === i); b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      var g = groups[i];
      if (g && g.ids.indexOf(preview) < 0) {
        var chosen = obj(ctx.get('treatment.choice', {})).product;
        preview = g.ids.indexOf(chosen) > -1 ? chosen : g.ids.filter(function (pid) { return !byId[pid].blocked.length; })[0] || g.ids[0];
      }
      buildGrid();
      paintDetail(ctx.a() || {});
    }
    function bnfLine(p, a) {
      var key = isYoung(a) ? 'child' : 'adult', t = obj(p.bnf)[key];
      return t ? (key === 'child' ? 'BNFC: ' : 'BNF: ') + t : '';
    }
    function paintDetail(a) {
      var r = byId[preview];
      if (!r) { U.clear(detailHost); detailHost.__txSig = null; return; }
      var p = r.p, chosen = obj(txOf(a).choice).product === p.id, st = stateOf(r);
      var swallow = p.open ? (p.openHow || 'The capsule can be opened: check the SmPC.') : p.swallowWhole ? 'Swallow whole. Do not chew, divide or crush.' : '';
      var badges = h('span', { class: 'tx-badges' },
        r.blocked.length ? ui.badge('Do not offer', 'err') : null,
        r.licensed ? ui.badge('Licensed for this age', 'ok') : licenceBadge(r.licence || { licensed: false }),
        chosen ? ui.badge('Chosen', 'accent') : null);
      var out = [];
      if (p.brandNote) out.push(h('p', { class: 'hint tx-brandnote' }, p.brandNote));
      if (r.blocked.length) out.push(note('err', 'Not suitable for this person', [bullets(r.blocked.map(function (x) { return stripClauses(String(x)); })), h('p', null, 'Next: choose another product, or record the specialist advice that supports this one.')]));
      if (r.cautions.length) out.push(note('warn', 'Check before choosing', bullets(r.cautions.map(function (x) { return stripClauses(String(x)); }))));
      out.push(factList([{ k: 'Form', v: p.form }, p.lasts ? { k: 'Lasts', v: p.lasts } : null, strengthLine(p) ? { k: 'Strengths', v: strengthLine(p) } : null]));
      out.push(kvList([
        ['Release', p.release],
        ['Licence', p.licenceText],
        ['How to take', p.take],
        ['Food', p.food],
        ['Swallowing', swallow],
        ['Misuse', p.misuse],
        ['Switching', p.groupNote]
      ]));
      var more = kvList([
        ['From immediate release', p.fromIR],
        ['Excipients', p.excipients],
        ['Missed dose', p.missed],
        ['Older people', p.older],
        ['Off-label ceiling', bnfLine(p, a)]
      ]);
      if (more || arr(p.notes).length) out.push(ui.details('More about ' + p.name, [more, arr(p.notes).length ? bullets(p.notes) : null], { cls: 'tx-bare' }));
      out.push(h('div', { class: 'row tx-prod-act' }, chosen
        ? [ui.badge('✓ Chosen', 'ok'), ui.btn({ label: 'Next: starting dose →', kind: 'secondary', small: true, onClick: function () { go('dose'); } })]
        : ui.btn({ label: r.blocked.length ? 'Choose anyway' : 'Choose ' + p.name, kind: r.blocked.length ? 'ghost' : 'primary', onClick: function () {
          var was = obj(ctx.get('treatment.choice', {}));
          ctx.set('treatment.choice.product', p.id);
          if (was.drug !== p.drug) ctx.set('treatment.choice.drug', p.drug);
          /* Doses a day and an unequal split belong to the old product's strengths and schedule. */
          if (was.product && was.product !== p.id) {
            if (num(was.perDay) !== null && perDayOptions(p).indexOf(num(was.perDay)) < 0) ctx.set('treatment.choice.perDay', undefined);
            if (arr(was.doses).length) ctx.set('treatment.choice.doses', undefined);
          }
          go('dose');
        } })));
      fill(detailHost, card(p.name, out, 'tx-prod tx-prod-' + st, badges));
    }
    host.appendChild(stageLead('Products for ' + lc(drugName(drug)) + '. Each card says whether it is licensed for this age, off-label, or not suitable for this person. Pick one to see it.'));
    /* Guanfacine in children and young people is licensed only when stimulants are not suitable, not tolerated or
       not effective (Intuniv SmPC 4.1). Earlier stimulants that did not help count; otherwise the prescriber
       records it here (choice.stimulantsUnsuitable). */
    var stimCond = rows.some(function (r) { return r.licence && r.licence.condition && r.licence.condition.id === 'stim_unsuitable'; });
    if (stimCond || (isYoung(a0) && drug === 'gxr')) {
      host.appendChild(card(null, ui.check({ label: 'Stimulants are not suitable, not tolerated or not effective for ' + who(a0), checked: ch0.stimulantsUnsuitable === true,
        hint: 'The guanfacine licence for ages 6 to 17 covers only this. Previous stimulants recorded as not helping or not tolerated count too. Write why in "Reason for this choice".',
        onChange: function (on) { ctx.set('treatment.choice.stimulantsUnsuitable', on ? true : undefined); } }), 'tx-licq'));
    }
    if (!rows.length) {
      host.appendChild(card(null, note('warn', 'No products in the treatment data for this medicine', 'Next: check the SmPC and write the product in the notes.')));
    } else {
      if (groups.length > 1) {
        var chips = ui.chips(groups.map(function (g, i) { return { label: g.key, n: g.ids.length, on: i === active, onClick: function () { selectGroup(i); } }; }));
        chips.classList.add('tx-pfilter');
        chips.setAttribute('aria-label', 'Release type');
        chipEls = U.$$('button', chips);
        host.appendChild(chips);
      }
      host.appendChild(gridHost);
      host.appendChild(detailHost);
      buildGrid();
    }
    host.appendChild(card(null, ui.field('Reason for this choice', textIn(ch0.why, function (v) { ctx.set('treatment.choice.why', v); }, { rows: 2, placeholder: 'Shared decision, hours of cover needed, swallowing, misuse risk, any off-label use and why' })), 'tx-whycard'));
    paintDetail(a0);
    return { refresh: function (a) { recompute(a); paintGrid(); paintDetail(a); } };
  }

  /* The titration ladder: one rung per step of the SmPC plan, with a bar for the size of the dose, how it is
     given, and the starting dose and the maximum marked. */
  function ladderNode(plan, steps, per, startDose) {
    var doses = steps.map(function (s) { return num(s.dose); });
    var cap = num(plan.max), um = num(plan.usualMax);
    var scale = Math.max.apply(null, doses.concat(cap !== null ? [cap] : []));
    var showGiven = per > 1 || steps.some(function (s) { return arr(s.perDose).length > 1; });
    return h('ol', { class: 'tx-ladder' }, steps.map(function (s) {
      var d = num(s.dose), tags = [];
      if (startDose !== null && d === startDose) tags.push(ui.badge('Start', 'accent'));
      if (um !== null && d === um) tags.push(ui.badge('Usual maximum', 'warn'));
      else if (cap !== null && d === cap) tags.push(ui.badge('Maximum', 'neutral', plan.capLabel || (plan.maxSource === 'bnf' ? 'BNF off-label ceiling' : 'SmPC maximum')));
      var pct = scale > 0 ? Math.max(6, Math.round(100 * d / scale)) : 0;
      return h('li', { class: 'tx-rung' + (startDose !== null && d === startDose ? ' is-start' : '') },
        h('span', { class: 'tx-rung-w' }, 'Week ' + s.week),
        h('span', { class: 'tx-rung-d' }, fmt(d) + ' mg', h('span', { class: 'tx-rung-u' }, ' a day')),
        h('span', { class: 'tx-rung-m' },
          h('span', { class: 'tx-rung-bar', 'aria-hidden': 'true' }, h('span', { style: { width: pct + '%' } })),
          showGiven ? h('span', { class: 'tx-rung-g' }, givenText(s, per)) : null),
        tags.length ? h('span', { class: 'tx-rung-tags' }, tags) : null);
    }));
  }

  /* ---- Stage 4: starting dose: the SmPC plan as a ladder, then the start ---- */
  function stageDose(host, ctx, a0, go) {
    var Tx = T(), ch0 = obj(txOf(a0).choice), p = prodOf(ch0.product);
    if (!p) {
      host.appendChild(firstNote('info', 'Choose a product first', 'Go to products', function () { go('product'); }));
      return null;
    }
    var plan0 = Tx.dosePlan(a0, p.id, num(ch0.weightKg));
    var planHost = h('div', { class: 'tx-live', 'aria-live': 'polite' });
    var checkHost = h('div', { class: 'tx-live', 'aria-live': 'polite' });
    var useHost = h('span', { class: 'tx-use' });
    var wHint = h('span');
    host.appendChild(stageLead(p.name + ' for ' + (isYoung(a0) ? 'a child or young person' : 'an adult') + '. The dose plan comes from the SmPC in the treatment data.'));
    host.appendChild(card('Dose plan', [
      plan0.weightBased ? h('div', { class: 'form-grid tx-fields tx-datef' }, ui.field('Weight for dosing (kg)', numIn(ch0.weightKg, function (v) { ctx.set('treatment.choice.weightKg', v); }), wHint)) : null,
      planHost
    ], 'tx-plancard'));
    var startDate = dateIn(ch0.startDate, function (v) { ctx.set('treatment.choice.startDate', v); });
    /* The number of doses a day (choice.perDay): the prescription wording and the steps above use it. Only the
       numbers this product may be given in are offered; empty means "read it from When to take it". */
    var perOpts = perDayOptions(p);
    host.appendChild(card('Starting dose and timing', [
      h('div', { class: 'form-grid tx-fields' },
        h('div', { class: 'tx-fwrap' }, ui.field('Starting dose (mg a day)', numIn(ch0.startDose, function (v) { ctx.set('treatment.choice.startDose', v); })), useHost),
        ui.field('When to take it', textIn(ch0.times, function (v) { ctx.set('treatment.choice.times', v); }, { placeholder: p.take ? 'For example: ' + lc(String(p.take).split('. ')[0]).replace(/\.$/, '') : 'For example each morning' }),
          'One regimen only, for example "each morning" or "morning and lunchtime". Never "or".'),
        h('div', { class: 'tx-fwrap' }, ui.field('Start date', startDate),
          ui.btn({ label: 'Today', kind: 'quiet', small: true, onClick: function () { startDate.value = today(); ctx.set('treatment.choice.startDate', today()); } }))),
      perOpts.length > 1 || num(ch0.perDay) !== null ? h('div', { class: 'tx-perday' },
        ui.seg({ label: 'Doses a day', options: PER_DAY.filter(function (o) { return perOpts.indexOf(o.v) > -1 || o.v === num(ch0.perDay); }), value: num(ch0.perDay),
          onChange: function (v) { ctx.set('treatment.choice.perDay', v === null ? undefined : v); } }),
        h('p', { class: 'hint' }, 'Leave it empty to read it from "When to take it". The two must agree.')) : null,
      checkHost
    ], 'tx-startcard'));
    function paint(a) {
      var ch = obj(txOf(a).choice);
      var plan = Tx.dosePlan(a, p.id, num(ch.weightKg));
      var w = Tx.weight(a);
      wHint.textContent = num(ch.weightKg) === null ? (w !== null ? 'Empty: using the latest recorded weight, ' + fmt(w) + ' kg.' : 'No weight recorded yet.') : 'Today\'s weight is used.';
      var out = [];
      if (arr(plan.blocked).length) out.push(note('err', 'Do not prescribe', [bullets(plan.blocked.map(function (x) { return stripClauses(String(x)); })), h('p', null, 'Next: go back and choose another medicine, or record the specialist advice that supports it.')]));
      var warns = arr(plan.warnings).filter(function (x) { return !/^Do not prescribe:/.test(String(x)); });
      if (warns.length) out.push(note('warn', 'Check', bullets(warns.map(function (x) { return stripClauses(String(x)); }))));
      if (plan.text) out.push(h('p', { class: 'tx-plan' }, stripClauses(plan.text)));
      if (plan.rounding) out.push(h('p', { class: 'hint' }, plan.rounding));
      var steps = arr(plan.steps).filter(function (s) { return s && num(s.dose) !== null; });
      if (steps.length) {
        /* Each step says how it is given (the engine's perDose: 10 mg + 5 mg, or 5 mg twice a day), so a dose
           that cannot be split equally is never shown as a fraction of a tablet. */
        var per = num(ch.perDay) || num(plan.perDay) || 1;
        out.push(h('h4', { class: 'tx-subh' }, 'A guide to the steps'));
        out.push(ladderNode(plan, steps, per, num(ch.startDose)));
        out.push(h('p', { class: 'hint' }, 'Increase only if more benefit is needed and the dose is tolerated. Check the SmPC.'));
      }
      fill(planHost, out);
      var sd = num(ch.startDose);
      fill(useHost, plan.start !== null && plan.start !== undefined && sd !== plan.start
        ? ui.btn({ label: 'Use ' + fmt(plan.start) + ' mg', kind: 'quiet', small: true, onClick: function () { ctx.set('treatment.choice.startDose', plan.start); go('dose'); } }) : null);
      var c = [];
      /* "When to take it" and the number of doses must give one regimen (the prescription stage refuses otherwise). */
      var tc = typeof Tx.timesCount === 'function' ? Tx.timesCount(ch.times) : null, pd = num(ch.perDay);
      if (tc === 'or') c.push(note('err', '"When to take it" offers a choice', 'A prescription states one regimen. Next: write one, for example "each morning" or "morning and lunchtime".'));
      else if (pd !== null && typeof tc === 'number' && tc !== pd) c.push(note('err', 'The timing and the doses a day do not agree', '"When to take it" means ' + (PER_WORD[tc] || tc + ' times a day') + ', but the doses a day are set to ' + (PER_WORD[pd] || pd + ' times a day') + '. Next: make them agree.'));
      else if (typeof tc === 'number' && perDayOptions(p).indexOf(tc) < 0) c.push(note('err', 'Not a schedule for this product', p.name + ' is not given ' + (PER_WORD[tc] || tc + ' times a day') + '. Next: change "When to take it". Check the SmPC.'));
      if (sd !== null && plan.max !== null && plan.max !== undefined && sd > plan.max) {
        c.push(note('err', 'Above the maximum', fmt(sd) + ' mg a day is above the ' + (plan.capLabel || (plan.maxSource === 'bnf' ? 'BNF off-label ceiling' : 'SmPC maximum')) + ' of ' + fmt(plan.max) + ' mg. Next: check the dose. A dose above it needs specialist advice, and the reason recorded at the prescription stage.'));
      } else if (sd !== null && num(plan.usualMax) !== null && sd > num(plan.usualMax)) {
        c.push(note('warn', 'Above the usual maximum', fmt(sd) + ' mg a day is above the usual maximum of ' + fmt(num(plan.usualMax)) + ' mg. Higher doses are for rare cases only: a specialist decision. Next: record the reason at the prescription stage.'));
      } else if (sd !== null && plan.start !== null && plan.start !== undefined && sd !== plan.start) {
        c.push(note('info', 'Different from the usual starting dose', 'The usual start is ' + fmt(plan.start) + ' mg a day. Next: record why in "Reason for this choice".'));
      }
      if (!ch.startDate) c.push(h('p', { class: 'hint' }, 'Add the start date: the trial clock and the monitoring dates count from it.'));
      fill(checkHost, c);
    }
    paint(a0);
    return { refresh: paint };
  }

  /* ---- Stage 5: counselling, grouped by purpose ---- */
  /* Groups for the counselling points (presentation only: the data has no groups). An item that matches none
     goes under "Other points". */
  var COUNSEL_GROUPS = [
    { l: 'How to take it', s: 'Timing, food, swallowing, missed doses and the daily routine.', test: /^cs_(take|missed)_|^cs_routine$/ },
    { l: 'What to expect', s: 'When it works and how the dose is found.', test: /^cs_expect_/ },
    { l: 'Safety and when to get help', s: 'Warning signs, alcohol, other medicines, operations and pregnancy.', test: /^cs_(report|alcohol|otc|other|surgery|pregnancy)/ },
    { l: 'Controlled drug, storage and travel', s: 'Prescriptions, keeping it safe, school and travel.', test: /^cs_(cd|diversion|travel|school)/ },
    { l: 'Driving', s: 'Driving while taking it, and the law.', test: /^cs_driving/ }
  ];
  function counselGroups(items) {
    var gs = COUNSEL_GROUPS.map(function (g) { return { l: g.l, s: g.s, items: [] }; }), other = { l: 'Other points', s: '', items: [] };
    items.forEach(function (c) {
      var i = -1;
      COUNSEL_GROUPS.some(function (g, j) { if (g.test.test(c.id)) { i = j; return true; } return false; });
      (i > -1 ? gs[i] : other).items.push(c);
    });
    return gs.concat([other]).filter(function (g) { return g.items.length; });
  }
  function stageCounsel(host, ctx, a0, go) {
    var ch0 = obj(txOf(a0).choice);
    if (!ch0.drug) {
      host.appendChild(firstNote('info', 'Choose a medicine first', 'Go to NICE options', function () { go('options'); }));
      return null;
    }
    var items = counselFor(a0), done0 = obj(ch0.counsel), groups = counselGroups(items);
    var total = h('span', { class: 'tx-cnt' });
    var metas = groups.map(function () { return h('span', { class: 'tx-cnt' }); });
    host.appendChild(stageLead('Go through each point with ' + who(a0) + (isYoung(a0) ? ' and their parent or carer' : '') + '. Tick it when covered. Give it in writing too.'));
    var copyBtn = ui.btn({ label: 'Copy as a handout', kind: 'ghost', small: true, onClick: function () {
      var a = ctx.a() || {}, ch = obj(txOf(a).choice);
      copy(['Your ADHD medicine: ' + (ch.product ? prodName(ch.product) + ' (' + lc(drugName(ch.drug)) + ')' : drugName(ch.drug)), ''].concat(counselFor(a).map(function (c) { return '- ' + c.t; })).join('\n'), 'Counselling points');
    } });
    if (!items.length) {
      host.appendChild(card(null, [h('p', { class: 'muted' }, 'No counselling points for this medicine in this build.'), h('div', { class: 'row' }, copyBtn)]));
      return null;
    }
    var firstOpen = -1;
    groups.forEach(function (g, i) { if (firstOpen < 0 && g.items.some(function (c) { return !done0[c.id]; })) firstOpen = i; });
    var acc = oneOpen(ui.acc(groups.map(function (g, i) {
      return { title: accTitle(g.l, g.s), meta: metas[i], open: i === firstOpen, render: function () {
        var d = obj(obj(ctx.get('treatment.choice', {})).counsel);
        return h('div', { class: 'tx-checks' }, g.items.map(function (c) {
          return ui.check({ label: c.t, checked: !!d[c.id], cls: 'tx-check', onChange: function (on) { ctx.set('treatment.choice.counsel.' + c.id, on ? true : undefined); } });
        }));
      } };
    }), { title: 'Counselling points', actions: h('div', { class: 'tx-acc-act' }, total, copyBtn) }));
    acc.classList.add('tx-acc');
    host.appendChild(acc);
    function paint(a) {
      var d = obj(obj(txOf(a).choice).counsel);
      paintCnt(total, items.filter(function (c) { return d[c.id]; }).length, items.length, 'covered');
      groups.forEach(function (g, i) { paintCnt(metas[i], g.items.filter(function (c) { return d[c.id]; }).length, g.items.length); });
    }
    paint(a0);
    return { refresh: paint };
  }

  /* ---- Stage 6: prescription: dose and supply, the wording, then the checks grouped by purpose ---- */
  var RX_GROUPS = [
    { l: 'Every prescription', s: 'Patient details, directions, signature and brand.', ids: ['rx_basic', 'rx_brand'] },
    { l: 'Controlled drug wording', s: 'What a Schedule 2 prescription must show.', ids: ['rx_dose', 'rx_form', 'rx_strength', 'rx_qty_words', 'rx_signed'] },
    { l: 'Validity and supply', s: 'How long it is valid, how much to supply, and no repeats.', ids: ['rx_28days', 'rx_30days', 'rx_norepeat'] },
    { l: 'Only if used', s: 'Instalments and private prescriptions.', ids: ['rx_instal', 'rx_private'] }
  ];
  function rxGroups(checks) {
    var gs = RX_GROUPS.map(function (g) { return { l: g.l, s: g.s, items: [] }; }), other = { l: 'Other checks', s: '', items: [] };
    checks.forEach(function (c) {
      var i = -1;
      RX_GROUPS.some(function (g, j) { if (g.ids.indexOf(c.id) > -1) { i = j; return true; } return false; });
      (i > -1 ? gs[i] : other).items.push(c);
    });
    return gs.concat([other]).filter(function (g) { return g.items.length; });
  }
  function stageRx(host, ctx, a0, go) {
    var Tx = T(), ch0 = obj(txOf(a0).choice), p = prodOf(ch0.product);
    if (!p) {
      host.appendChild(firstNote('info', 'Choose a product first', 'Go to products', function () { go('product'); }));
      return null;
    }
    var d = drugOf(p.drug) || {};
    var rxHost = h('div', { class: 'tx-live', 'aria-live': 'polite' });
    var rxBadge = h('span', { class: 'tx-badges' });
    var reasonHost = h('div');
    var overHost = h('div');
    var dosesHost = h('div');
    var doseHint = h('span');
    var reasonOn = null, overOn = null, dosesOn = null;
    /* Doses through the day (choice.doses, mg, morning first), for an immediate-release product given more than
       once a day: optional, for an unequal split such as 10 mg + 5 mg. The engine checks they add up. */
    function parseDoses(s) {
      var parts = String(s || '').split(/\s*(?:\+|,|;|\/|\band\b|\bthen\b)\s*/i).map(function (x) { return num(String(x).replace(/mg/i, '').trim()); });
      return parts.length && parts.every(function (x) { return x !== null && x > 0; }) ? parts : null;
    }
    function perNow(a) {
      var ch = obj(txOf(a).choice), pd = num(ch.perDay);
      if (pd !== null) return pd;
      var tc = typeof Tx.timesCount === 'function' ? Tx.timesCount(ch.times) : null;
      if (typeof tc === 'number') return tc;
      var plan = Tx.dosePlan(a, p.id); return num(plan.perDay) || 1;
    }
    host.appendChild(stageLead(p.name + '. ' + (d.cd || '')));
    /* A typed dose belongs to this prescription: it is dated, and a newer review replaces it. */
    host.appendChild(card('Dose and supply', [
      h('div', { class: 'form-grid tx-fields' },
        ui.field('Daily dose on this prescription (mg)', numIn(ch0.rxDose, function (v) {
          ctx.set('treatment.choice.rxDose', v);
          ctx.set('treatment.choice.rxDoseDate', v === undefined ? undefined : today());
        }), doseHint),
        ui.field('Supply (days)', numIn(ch0.supplyDays, function (v) { ctx.set('treatment.choice.supplyDays', v); }, { int: true }), d.isCD ? 'Schedule 2: usually no more than 30 days.' : null),
        ui.field('Quantity (optional)', numIn(ch0.quantity, function (v) { ctx.set('treatment.choice.quantity', v); }, { int: true }), 'Leave empty to work it out from the days.')),
      dosesHost,
      overHost,
      reasonHost,
      ui.field('Prescription notes', textIn(ch0.notes, function (v) { ctx.set('treatment.choice.notes', v); }, { rows: 2, placeholder: 'For example instalments, who collects, the next prescription date' }))
    ], 'tx-supplycard'));
    host.appendChild(card('Prescription wording', rxHost, 'tx-rxcard', rxBadge));
    var checks = rxChecksFor(a0), groups = rxGroups(checks);
    var total = h('span', { class: 'tx-cnt' });
    var metas = groups.map(function () { return h('span', { class: 'tx-cnt' }); });
    var rx00 = obj(ch0.rx), firstOpen = -1;
    groups.forEach(function (g, i) { if (firstOpen < 0 && g.items.some(function (c) { return !rx00[c.id]; })) firstOpen = i; });
    if (checks.length) {
      var acc = oneOpen(ui.acc(groups.map(function (g, i) {
        return { title: accTitle(g.l, g.s), meta: metas[i], open: i === firstOpen, render: function () {
          var rx0 = obj(obj(ctx.get('treatment.choice', {})).rx);
          return h('div', { class: 'tx-checks' }, g.items.map(function (c) {
            return ui.check({ label: c.t, hint: c.optional ? 'Tick when checked, or when it does not apply.' : null, checked: !!rx0[c.id], cls: 'tx-check',
              onChange: function (on) { ctx.set('treatment.choice.rx.' + c.id, on ? true : undefined); } });
          }));
        } };
      }), { title: d.isCD ? 'Controlled drug prescription checks' : 'Prescription checks', actions: total }));
      acc.classList.add('tx-acc');
      host.appendChild(acc);
    }
    function doseSource(dn) {
      if (dn.from === 'review' && dn.review) return num(dn.review.newDose) !== null ? 'the new dose agreed at the review' + (dn.review.date ? ' on ' + dateText(dn.review.date) : '') : 'the dose at the latest review';
      return dn.from === 'start' ? 'the starting dose' : 'the current dose';
    }
    function paint(a) {
      var ch = obj(txOf(a).choice), rx = rxTextOf(a), dn = doseNow(a);
      doseHint.textContent = dn.stopped ? dn.reason + ': no prescription.'
        : num(ch.rxDose) === null ? (dn.dose !== null ? 'Empty: using ' + fmt(dn.dose) + ' mg a day (' + doseSource(dn) + ').' : stripClauses(dn.reason) || 'Enter the starting dose first.')
        : dn.dose !== null && dn.dose !== num(ch.rxDose) ? 'Not used: a newer review set ' + fmt(dn.dose) + ' mg a day (' + doseSource(dn) + '). Enter the dose again if this prescription differs.' : '';
      /* The days a supply covers: the engine works them out from the quantity too (rx.coveredDays). */
      var cov = num(rx.coveredDays) !== null ? num(rx.coveredDays) : num(ch.supplyDays);
      var on = !!d.isCD && ((cov !== null && cov > 30 + 1e-9) || !!textOrNone(ch.supplyReason));
      if (on !== reasonOn) {
        reasonOn = on;
        fill(reasonHost, on ? ui.field('Reason for more than 30 days', textIn(ch.supplyReason, function (v) { ctx.set('treatment.choice.supplyReason', v); }, { rows: 2 })) : null);
      }
      /* A dose above the maximum (or the BNF off-label ceiling) needs a recorded specialist reason. So does going
         past a usual maximum (dexamfetamine: usually 20 mg, up to 40 mg only in rare cases): the field shows
         from the usual maximum, so the reason can be recorded before the next step up. */
      var planR = Tx.dosePlan(a, p.id), mx = num(planR.max), um = num(planR.usualMax), dd = dn.dose;
      var over = dd !== null && mx !== null && dd > mx;
      var atUsual = !over && dd !== null && um !== null && dd >= um;
      var kindO = over ? 'over' : atUsual ? 'usual' : textOrNone(ch.overMaxReason) ? 'kept' : '';
      if (kindO !== overOn) {
        overOn = kindO;
        fill(overHost, kindO ? ui.field(kindO === 'usual' ? 'Reason for going above the usual maximum' : 'Reason for a dose above the maximum',
          textIn(ch.overMaxReason, function (v) { ctx.set('treatment.choice.overMaxReason', v); },
            { rows: 2, placeholder: 'Who advised it (specialist or tertiary service), why, and the plan for monitoring' }),
          kindO === 'usual' ? 'Usual maximum ' + um + ' mg a day; up to ' + (mx !== null ? mx + ' mg' : 'the SmPC maximum') + ' only in rare cases. A specialist decision: record the reason before going higher.'
            : kindO === 'over' ? 'Off-label. Until a reason is recorded, the prescription wording is marked "Do not sign yet".' : null) : null);
      }
      /* Unequal doses: immediate release given more than once a day, or already recorded. */
      var onD = (isIRp(p) && perNow(a) > 1) || arr(ch.doses).length > 0;
      if (onD !== dosesOn) {
        dosesOn = onD;
        var dIn = null;
        if (onD) {
          dIn = ui.input({ value: arr(ch.doses).map(fmt).join(' + '), placeholder: 'For example 10 + 5', onSave: function (v) {
            var list = parseDoses(v);
            ctx.set('treatment.choice.doses', String(v || '').trim() && list ? list : undefined);
          } });
        }
        fill(dosesHost, onD ? h('div', { class: 'form-grid tx-fields tx-doses' },
          ui.field('Doses through the day (mg, morning first)', dIn, 'Optional: only for an unequal split. Leave it empty and the daily dose is split for you. The doses must add up to the daily dose.')) : null);
      }
      var out = [], errsAll = arr(rx.errors);
      if (dn.stopped) {
        out.push(note('warn', 'Medicine stopped: no prescription', dn.reason + '. Do not issue a prescription for it. If it is restarted, record a new review with the decision and the dose first.', [goBtn(ctx, 'titrate', 'Open titration and reviews')]));
      } else if (rx.lines.length) {
        out.push(h('div', { class: 'tx-rx' }, rx.lines.map(function (l) { return h('p', null, l); })));
        out.push(h('div', { class: 'row' }, ui.btn({ label: 'Copy the wording', kind: 'ghost', small: true, onClick: function () { copy(rxTextOf(ctx.a() || {}).lines.join('\n'), 'Prescription wording'); } })));
        /* Errors (the engine's rxText marks them) come first, in red; the other warnings follow. */
        var errs = errsAll, rest = arr(rx.warnings).filter(function (x) { return errs.indexOf(x) < 0; });
        if (errs.length) out.push(note('err', 'Do not sign yet', bullets(errs.map(function (x) { return stripClauses(String(x)); }))));
        if (rest.length) out.push(note('info', 'Before you sign', bullets(rest.map(function (x) { return stripClauses(String(x)); }))));
      } else {
        var errs0 = errsAll, rest0 = arr(rx.warnings).filter(function (x) { return errs0.indexOf(x) < 0; });
        if (errs0.length) out.push(note('err', 'The wording cannot be written yet', bullets(errs0.map(function (x) { return stripClauses(String(x)); }))));
        if (rest0.length || !errs0.length) out.push(note('warn', errs0.length ? 'Also check' : 'The wording cannot be written yet', bullets(rest0.length ? rest0.map(function (x) { return stripClauses(String(x)); }) : ['Enter the dose and the supply.'])));
      }
      fill(rxHost, out);
      fill(rxBadge, dn.stopped ? ui.badge('No prescription', 'neutral') : errsAll.length ? ui.badge('Do not sign yet', 'err') : rx.lines.length ? ui.badge('Wording ready', 'ok') : ui.badge('Not ready', 'neutral'));
      var ok = obj(ch.rx);
      paintCnt(total, checks.filter(function (c) { return ok[c.id]; }).length, checks.length, 'checked');
      groups.forEach(function (g, i) { paintCnt(metas[i], g.items.filter(function (c) { return ok[c.id]; }).length, g.items.length); });
    }
    paint(a0);
    return { refresh: paint };
  }

  var STAGE_RENDER = { prior: stagePrior, options: stageOptions, product: stageProduct, dose: stageDose, counsel: stageCounsel, rx: stageRx };

  AA.steps.prescribe = { render: function (el, ctx) {
    if (!ready()) { el.appendChild(notLoaded()); return null; }
    var Tx = T(), a0 = ctx.a() || {};
    var an = applicNote(ctx, a0, 'prescribe');
    if (an) el.appendChild(an);
    var readyHost = h('div', { class: 'tx-ready' });
    el.appendChild(readyHost);
    var sumHost = h('div', { class: 'tx-sumhost' });
    el.appendChild(sumHost);

    var trackBtns = {};
    var trackOl = h('ol', null, STAGES.map(function (s, i) {
      var b = h('button', { type: 'button', class: 'tx-tstep', onclick: function () { go(s.id); } },
        h('span', { class: 'tx-tn', 'aria-hidden': 'true' }, String(i + 1)),
        h('span', { class: 'tx-tl' }, s.l),
        h('span', { class: 'sr-only tx-tsr' }));
      trackBtns[s.id] = b;
      return h('li', null, b);
    }));
    el.appendChild(h('nav', { class: 'tx-track', 'aria-label': 'Prescribing stages' }, trackOl));
    var stageHost = h('div', { class: 'tx-stage' });
    el.appendChild(stageHost);

    var cur = stageMem[ctx.id] || firstStage(a0), api = null, renderedDrug = null, renderedProduct = null;
    function paintTrack(a) {
      STAGES.forEach(function (s, i) {
        var b = trackBtns[s.id], done = stageDone(a, s.id);
        b.classList.toggle('is-done', done);
        if (s.id === cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        b.querySelector('.tx-tn').textContent = done ? '✓' : String(i + 1);
        b.querySelector('.tx-tsr').textContent = done ? ', done' : ', to do';
        /* On phones only the current stage shows its name, so the button carries it for screen readers. */
        b.setAttribute('aria-label', 'Stage ' + (i + 1) + ': ' + s.l + (done ? ', done' : ', to do'));
        b.title = s.l;
      });
    }
    function renderStage(focus) {
      var a = ctx.a() || {}, ch = obj(txOf(a).choice);
      renderedDrug = ch.drug || null; renderedProduct = ch.product || null;
      U.clear(stageHost);
      var idx = stageIndex(cur), s = STAGES[idx], prev = STAGES[idx - 1], next = STAGES[idx + 1];
      var hd = h('h2', { class: 'tx-stage-h', tabindex: '-1' }, s.l);
      stageHost.appendChild(h('div', { class: 'tx-stage-head' }, h('p', { class: 'tx-stage-n' }, 'Stage ' + (idx + 1) + ' of ' + STAGES.length), hd));
      var body = h('div', { class: 'tx-stage-body' });
      stageHost.appendChild(body);
      api = STAGE_RENDER[s.id](body, ctx, a, go) || null;
      stageHost.appendChild(h('div', { class: 'tx-stage-nav' },
        prev ? ui.btn({ label: '← ' + prev.l, kind: 'ghost', onClick: function () { go(prev.id); } }) : h('span'),
        next ? ui.btn({ label: 'Next: ' + low(next.l) + ' →', kind: 'secondary', onClick: function () { go(next.id); } }) : null));
      if (focus) { try { hd.focus(); } catch (e) { /* ignore */ } }
    }
    function go(sid) {
      cur = sid; stageMem[ctx.id] = sid;
      var a = ctx.a() || {};
      paintTrack(a);
      paintSummary(a);
      renderStage(true);
    }
    function paintReady(a) {
      var out = [], pn = planNote(ctx, a);
      if (pn) out.push(pn);
      out.push(scopeNote(ctx, a));
      out.push(conflictNote(ctx, a));
      var vv = verdictView(a), v = vv.v;
      var riskLines = vv.rf.map(function (it) { return 'Safety step: ' + (it.short || it.text) + '.'; })
        .concat(arr(v.reasons).filter(function (r) { return /^Safety step:/.test(String(r && (r.text || r.t) || r)); }).map(function (r) { return String(r.text || r.t || r); }));
      if (riskLines.length) {
        var rk = vv.level === 'stopmix' ? 'stopmix' : 'risk';
        out.push(note('risk', VERDICT[rk].t, [bullets(riskLines), h('p', null, VERDICT[rk].next)], [goBtn(ctx, 'risk', 'Open safety and risk'), rk === 'stopmix' ? goBtn(ctx, 'baseline', 'Open the pre-treatment checks') : null]));
      }
      if ((v.level === 'stop' && vv.level === 'stop') || v.level === 'cardiology' || v.level === 'ecg') out.push(note(v.level, VERDICT[v.level].t, VERDICT[v.level].next, [goBtn(ctx, 'baseline', 'Open the pre-treatment checks')]));
      else if (v.level === 'incomplete') out.push(note('info', 'Pre-treatment checks not finished', plural(arr(v.missing).length, 'item') + ' still to record.', [goBtn(ctx, 'baseline', 'Open the pre-treatment checks')]));
      fill(readyHost, out);
    }
    /* What is chosen so far, the state of the prescription, and the next stage to do. */
    function paintSummary(a) {
      var ch = obj(txOf(a).choice), d = drugOf(ch.drug), p = prodOf(ch.product);
      var doneN = STAGES.filter(function (s) { return stageDone(a, s.id); }).length;
      var open = STAGES.filter(function (s) { return !stageDone(a, s.id); })[0] || null;
      var rx = p ? rxTextOf(a) : null, dn = ch.drug ? doseNow(a) : null, errs = rx ? arr(rx.errors) : [];
      var lic = p ? Tx.licence(a, p) : null, sd = num(ch.startDose);
      var o = { eyebrow: 'Choose and prescribe', actions: [] };
      if (dn && dn.stopped) { o.kind = 'info'; o.badge = ['No prescription: stopped', 'neutral']; }
      else if (errs.length) { o.kind = 'err'; o.badge = ['Do not sign yet', 'err']; }
      else if (rx && rx.lines.length) { o.kind = doneN === STAGES.length ? 'ok' : 'info'; o.badge = ['Wording ready', 'ok']; }
      else { o.kind = 'info'; o.badge = [doneN + ' of ' + STAGES.length + ' stages done', 'neutral']; }
      o.title = p ? p.name + (d ? ' · ' + d.name : '') : d ? d.name + ': choose the product' : 'No medicine chosen yet';
      o.facts = [
        { k: 'Medicine', v: d ? d.name : 'Not chosen', s: d ? d.cls : null, kind: d ? 'ok' : 'neutral', onClick: function () { go('options'); }, title: 'Open the NICE options' },
        { k: 'Product', v: p ? p.name : 'Not chosen', s: lic ? (lic.licensed ? 'Licensed for this age' : lic.conditionUnconfirmed ? 'Licence condition to confirm' : 'Off-label') : null,
          kind: !p ? 'neutral' : lic && lic.licensed ? 'ok' : 'warn', onClick: function () { go('product'); }, title: 'Open the products' },
        { k: 'Starting dose', v: sd !== null ? fmt(sd) + ' mg a day' : 'Not set', s: ch.startDate ? 'From ' + dateText(ch.startDate) : 'No start date yet',
          kind: sd !== null && ch.startDate ? 'ok' : 'neutral', onClick: function () { go('dose'); }, title: 'Open the starting dose' },
        { k: 'Next prescription', v: dn && dn.stopped ? 'None: stopped' : dn && dn.dose !== null ? fmt(dn.dose) + ' mg a day' : 'Not set',
          s: num(ch.supplyDays) !== null ? plural(num(ch.supplyDays), 'day') + ' supply' : num(ch.quantity) !== null ? 'Quantity ' + num(ch.quantity) : null,
          kind: errs.length ? 'err' : rx && rx.lines.length ? 'ok' : 'neutral', onClick: function () { go('rx'); }, title: 'Open the prescription' }
      ];
      if (errs.length && !(dn && dn.stopped)) {
        o.next = 'fix ' + (errs.length === 1 ? 'the problem' : 'the ' + errs.length + ' problems') + ' in the prescription before signing.';
        o.actions.push(ui.btn({ label: 'Open the prescription', kind: 'ghost', small: true, onClick: function () { go('rx'); } }));
      } else if (open) {
        o.next = 'stage ' + (stageIndex(open.id) + 1) + ', ' + low(open.l) + '.';
        if (open.id !== cur) o.actions.push(ui.btn({ label: 'Open ' + low(open.l), kind: 'ghost', small: true, onClick: function () { go(open.id); } }));
      } else {
        o.next = 'titration and reviews. All six stages are done.';
        o.actions.push(goBtn(ctx, 'titrate', 'Go to titration and reviews'));
      }
      fill(sumHost, summaryCard(o));
    }
    var src = stepSources(el, function (a) {
      var ch = obj(txOf(a).choice), d = drugOf(ch.drug), p = prodOf(ch.product);
      return Tx.options(a).map(function (o) { return o.src; })
        .concat(d ? srcOf(d.src) : []).concat(p ? srcOf(p.src) : [])
        .concat(counselFor(a).map(function (c) { return c.src; }))
        .concat(rxChecksFor(a).map(function (c) { return c.src; }))
        .concat(['NICE NG87 1.7.23–1.7.24 (misuse and diversion risk)']);
    });
    function refresh() {
      if (!el.isConnected) return;
      var a = ctx.a() || {}, ch = obj(txOf(a).choice);
      paintReady(a); paintSummary(a); paintTrack(a); src.paint(a);
      var drugChanged = (ch.drug || null) !== renderedDrug;
      var prodChanged = (ch.product || null) !== renderedProduct && (cur === 'dose' || cur === 'rx' || cur === 'counsel');
      if (drugChanged || prodChanged) renderStage(false);
      else if (api && api.refresh) api.refresh(a);
    }
    paintReady(a0); paintSummary(a0); paintTrack(a0); renderStage(false); src.paint(a0);
    ctx.onChange('treatment', U.debounce(refresh, 80));
    return null;
  } };

  /* =================================================================================
     Step: titration and reviews
     Notes > summary (the medicine and dose now, the trial clock, the next dose) > a timeline of reviews, newest
     first, from the start date; each review opens to its four tabs.
     ================================================================================= */
  var openReview = {};   /* open review per assessment (screen state only) */
  function compareText(a, rv) {
    var b = obj(txOf(a).baseline), bits = [];
    var b0 = clinicBp(a, b) || bpOf(b), b1 = bpOf(rv);
    if (b0 && b1) bits.push('blood pressure ' + b0 + ' → ' + b1);
    var p0 = num(b.pulse), p1 = num(rv.pulse);
    if (p0 !== null && p1 !== null) bits.push('pulse ' + p0 + ' → ' + p1);
    var w0 = num(b.weightKg), w1 = num(rv.weightKg);
    if (w0 !== null && w1 !== null && w0 > 0) { var pc = Math.round(1000 * (w1 - w0) / w0) / 10; bits.push('weight ' + fmt(w0) + ' → ' + fmt(w1) + ' kg (' + (pc > 0 ? '+' : '') + pc + '%)'); }
    var h0 = num(b.heightCm), h1 = num(rv.heightCm);
    if (h0 !== null && h1 !== null) bits.push('height ' + fmt(h0) + ' → ' + fmt(h1) + ' cm');
    return bits.length ? 'Since the pre-treatment checks: ' + bits.join('; ') + '.' : '';
  }
  /* Dose for a new review of the current medicine: the start dose first, then the dose the last review moved to
     (its new dose agreed; for an increase with no new dose recorded, the suggested next step). None after "Stop". */
  function prefillDose(a) {
    var dn = doseNow(a), last = curLatest(a);
    if (dn.stopped) return null;
    if (last && last.decision === 'increase' && num(last.newDose) === null && dn.from !== 'rx') {
      var nd = nextDoseOf(a);
      if (!nd.hold && num(nd.dose) !== null) return num(nd.dose);
    }
    if (dn.dose !== null) return dn.dose;
    return last ? num(last.dose) : num(obj(txOf(a).choice).startDose);
  }
  /* The suggested next dose seen from one review, before its decision: the engine's suggestion on a copy of the
     record that ends at this review, with no decision or new dose on it. */
  function suggestAt(a, id) {
    var t = T(), all = t.reviewsSorted(a), revs = obj(txOf(a).reviews), keep = {}, at = -1;
    all.forEach(function (r, i) { if (r.id === id) at = i; });
    if (at < 0) return null;
    all.slice(0, at + 1).forEach(function (r) { keep[r.id] = revs[r.id]; });   /* earlier reviews keep the flags right */
    keep[id] = Object.assign({}, revs[id]);
    delete keep[id].decision; delete keep[id].newDose;
    var rec = Object.assign({}, a, { treatment: Object.assign({}, txOf(a), { reviews: keep }) });
    try { return t.nextDose(rec); } catch (e) { return null; }
  }

  AA.steps.titrate = { render: function (el, ctx) {
    if (!ready()) { el.appendChild(notLoaded()); return null; }
    var Tx = T(), a0 = ctx.a() || {}, yng = isYoung(a0);
    var an = applicNote(ctx, a0, 'titrate');
    if (an) el.appendChild(an);
    var readyHost = h('div', { class: 'tx-ready' });
    el.appendChild(readyHost);
    var say = h('p', { class: 'sr-only', 'aria-live': 'polite' });
    var sumHost = h('div', { class: 'tx-sumhost' });
    el.appendChild(say);
    el.appendChild(sumHost);

    var listHost = h('ol', { class: 'tx-tl', 'aria-label': 'Reviews, newest first' });
    var earlierHost = h('p', { class: 'hint tx-earlier' });
    el.appendChild(section('tx-tit-reviews', 'Reviews', 'Add a review at each contact while the dose changes. Newest first; open one at a time.',
      card(null, [earlierHost, listHost], 'tx-revcard'), [ui.btn({ label: '+ Add a review', kind: 'primary', onClick: addReview })]));
    var src = stepSources(el, function (a) {
      var list = ['NICE NG87 1.7.8, 1.7.12–1.7.13 (an adequate 6-week trial)', 'NICE NG87 1.8.11 (heart rate and blood pressure on 2 occasions)', 'NICE NG87 1.8.6 (weight loss)'];
      T().reviewsSorted(a).forEach(function (r) { T().reviewFlags(a, r.id).forEach(function (f) { list.push(f.src); }); });
      return list.concat(seFor(a).map(function (x) { return x.src; }));
    });

    function paintReady(a) {
      fill(readyHost, [planNote(ctx, a), scopeNote(ctx, a)]);
    }
    function paintSummary(a) {
      var ch = obj(txOf(a).choice);
      if (!ch.product) {
        fill(sumHost, summaryCard({ kind: 'info', eyebrow: 'Titration', title: 'No medicine chosen yet', text: 'Choose the medicine and product first.',
          actions: [goBtn(ctx, 'prescribe', 'Go to choose and prescribe')] }));
        say.textContent = '';
        return;
      }
      var tv = trialView(a), tr = tv.tr, nd = nextDoseOf(a), dose = currentDose(a), cur = curReviews(a);
      var st = cur.length ? panelState(a) : ['No reviews yet', 'neutral'];
      var last = cur.length ? cur[cur.length - 1] : null;
      var trialBadge = tv.adequate ? ui.badge('Adequate trial', 'ok') : tv.held ? ui.badge('Act on flags first', 'warn') : null;
      var title = prodName(ch.product) + (tv.stopped ? ': stopped' : dose !== null ? ' · ' + fmt(dose) + ' mg a day' : '');
      var o = {
        kind: st[1] === 'neutral' || st[1] === 'accent' ? 'info' : st[1], eyebrow: 'Titration', badge: st, title: title,
        progress: tr.days === null ? null : progLine(weekProg(tr), tr.need, weekText(tr), 'Weeks of the trial', trialBadge),
        text: tr.days === null ? null : tv.text,
        facts: [
          { k: 'Medicine', v: drugName(ch.drug), s: drugOf(ch.drug) ? drugOf(ch.drug).cls : null },
          { k: 'Started', v: ch.startDate ? dateText(ch.startDate) : 'Not recorded', s: num(ch.startDose) !== null ? 'At ' + fmt(num(ch.startDose)) + ' mg a day' : null, kind: ch.startDate ? null : 'warn' },
          { k: 'Reviews of this medicine', v: String(cur.length), s: last && last.date ? 'Latest ' + dateText(last.date) : null }
        ],
        extra: tr.days === null ? note('info', 'Start date not recorded', 'The trial clock starts on the start date.',
          [ui.btn({ label: 'Add it at the starting dose stage', kind: 'ghost', small: true, onClick: function () { stageMem[ctx.id] = 'dose'; ctx.go('prescribe'); } })]) : null,
        next: stripClauses(nd.text), nextLabel: 'Next dose',
        /* At a usual maximum (dexamfetamine 20 mg) the next step waits for a recorded specialist reason. */
        actions: nd.usualMax && !textOrNone(ch.overMaxReason) ? [ui.btn({ label: 'Record the reason', kind: 'ghost', small: true, onClick: function () { stageMem[ctx.id] = 'rx'; ctx.go('prescribe'); } })] : []
      };
      fill(sumHost, summaryCard(o));
      var line = title + '. ' + st[0] + '.';
      if (say.textContent !== line) say.textContent = line;
      earlierHost.textContent = !cur.length && Tx.reviewsSorted(a).length ? 'Reviews of an earlier medicine are kept below. They do not set this medicine\'s dose; their blood pressure, pulse and weight still count.' : '';
    }

    var rows = {}, sig = null;
    /* A new review belongs to the medicine chosen now. A dose typed on the prescription is cleared: the next
       prescription follows the dose agreed at this review. */
    function addReview() {
      var a = ctx.a() || {}, id = U.uid(), ch = obj(txOf(a).choice);
      var rec = { date: today() }, dose = prefillDose(a);
      if (dose !== null && dose !== undefined) rec.dose = dose;
      if (ch.drug) rec.drug = ch.drug;
      if (ch.product) rec.product = ch.product;
      openReview[ctx.id] = id;
      ctx.set('treatment.reviews.' + id, rec);
      if (ch.rxDose !== undefined) ctx.set('treatment.choice.rxDose', undefined);
      if (ch.rxDoseDate !== undefined) ctx.set('treatment.choice.rxDoseDate', undefined);
    }
    function reviewRow(r) {
      var id = r.id, base = 'treatment.reviews.' + id + '.';
      function cur() { return obj(ctx.get('treatment.reviews.' + id, {})); }
      function save(key) { return function (v) { ctx.set(base + key, v); }; }
      var sum = h('span', { class: 'tx-tl-sum' });
      var flagHost = h('div', { class: 'tx-flags', 'aria-live': 'polite' });
      var cmpHost = h('p', { class: 'hint tx-cmp' });
      var decHost = h('div', { class: 'tx-live', 'aria-live': 'polite' });
      var body = h('div', { class: 'tx-rowbody' }, flagHost);
      var built = false;
      function measures() {
        var rv = cur();
        return h('div', null,
          h('div', { class: 'form-grid tx-fields tx-f2' },
            ui.field('Date', dateIn(rv.date, save('date'))),
            ui.field('Dose (mg a day)', numIn(rv.dose, save('dose'))),
            ui.field('Systolic (mmHg)', numIn(rv.sbp, save('sbp'), { int: true })),
            ui.field('Diastolic (mmHg)', numIn(rv.dbp, save('dbp'), { int: true })),
            ui.field('Pulse (beats a minute)', numIn(rv.pulse, save('pulse'), { int: true })),
            ui.field('Weight (kg)', numIn(rv.weightKg, save('weightKg'))),
            yng ? ui.field('Height (cm)', numIn(rv.heightCm, save('heightCm'))) : null),
          yng ? h('div', { class: 'tx-revcent' },
            ui.seg({ label: 'Blood pressure centile (from the chart)', options: REVIEW_CENTILE, value: rv.bpCentile || null, onChange: function (v) { ctx.set(base + 'bpCentile', nil(v)); } }),
            h('p', { class: 'hint' }, 'Plot the reading on the same centile chart as at baseline.' + (textOrNone(obj(txOf(ctx.a() || {}).baseline).bpChart) ? ' Chart used then: ' + String(obj(txOf(ctx.a() || {}).baseline).bpChart).replace(/\.$/, '') + '.' : '') + ' Above the 95th centile on 2 occasions (this review and the last one with a centile, or the baseline) raises a flag to reduce the dose and refer.')) : null,
          cmpHost,
          yng ? h('p', { class: 'hint' }, 'Plot height and weight on the growth chart. Compare pulse and blood pressure with the normal range for age.') : null);
      }
      function benefit() {
        var rv = cur();
        return h('div', null,
          h('div', { class: 'form-grid tx-fields' },
            ui.field('Rating scale', textIn(rv.scale, save('scale'), { placeholder: yng ? 'For example SNAP-IV (parent), teacher scale' : 'For example ASRS v1.1' })),
            ui.field('Score', textIn(rv.scaleScore, save('scaleScore'), { placeholder: 'Score, or the change from baseline' }))),
          ui.seg({ label: 'Benefit', options: EFFECT, value: rv.effect || null, onChange: function (v) { ctx.set(base + 'effect', nil(v)); } }),
          ui.field('How long it helps in the day', textIn(rv.dayCover, save('dayCover'), { placeholder: yng ? 'For example 8am to 4pm; wears off before homework' : 'For example 7am to 5pm; wears off in the evening' })));
      }
      function sides() {
        var a = ctx.a() || {}, rv = cur(), se = obj(rv.se), list = seFor(a);
        if (!list.length) return h('p', { class: 'muted' }, 'Side effect items are not available in this build. Write them in the notes.');
        return h('div', null,
          h('p', { class: 'hint' }, 'Ask about each one. Troublesome ones raise a flag with what to do.'),
          h('div', { class: 'tx-qs' }, list.map(function (x) {
            return h('div', { class: 'tx-q' },
              h('div', { class: 'tx-q-text' }, h('p', { class: 'tx-q-t' }, x.t), x.ask ? h('p', { class: 'tx-q-ask' }, x.ask) : null),
              h('div', { class: 'tx-q-ctl' }, ui.seg({ label: x.t, hideLabel: true, small: true, options: SE_LEVEL, value: se[x.id] || null,
                onChange: function (v) { ctx.set(base + 'se.' + x.id, nil(v)); } })));
          })),
          h('div', { class: 'row tx-rowend' }, ui.btn({ label: 'Mark the rest "None"', kind: 'quiet', small: true, onClick: function () {
            var s2 = obj(cur().se), todo = seFor(ctx.a() || {}).filter(function (x) { return !s2[x.id]; });
            if (!todo.length) { U.toast('Every side effect is answered', 'ok'); return; }
            U.confirm({ title: 'Mark ' + plural(todo.length, 'side effect') + ' as "None"?', body: 'Only do this after you have asked about each one.', ok: 'Mark as None' })
              .then(function (yes) { if (!yes) return; todo.forEach(function (x) { ctx.set(base + 'se.' + x.id, 'none'); }); tabs.show('s'); });
          } })));
      }
      /* The new daily dose agreed at this review sets the next prescription and the next review's dose.
         Increase: prefilled with the suggested next step. Stay or optimised: the review dose. Reduce: required. */
      var newDoseIn = null, newDoseWrap = null, overrideWrap = null;
      function prefillNewDose(v) {
        var rv = cur();
        if (num(rv.newDose) !== null) return;
        var val = null;
        if (v === 'increase') { var s = suggestAt(ctx.a() || {}, id); if (s && !s.hold && !s.stopped && num(s.dose) !== null && num(s.dose) !== num(rv.dose)) val = num(s.dose); }
        else if (v === 'stay' || v === 'optimised') val = num(rv.dose);
        if (val === null) return;
        ctx.set(base + 'newDose', val);
        if (newDoseIn) newDoseIn.value = String(val);
      }
      function decision() {
        var rv = cur();
        newDoseIn = numIn(rv.newDose, save('newDose'));
        newDoseWrap = h('div', { class: 'form-grid tx-fields tx-newdose', hidden: !NEW_DOSE_DEC[rv.decision] },
          ui.field('New daily dose agreed (mg)', newDoseIn, 'The dose from now on. The next prescription uses it.'));
        /* A dose marked optimised while its review raised act or urgent flags needs a recorded reason. */
        overrideWrap = h('div', { class: 'tx-override', hidden: true },
          ui.field('Reason to treat this dose as optimised despite the flags', textIn(rv.flagOverride, save('flagOverride'), { rows: 2, placeholder: 'For example: discussed with the specialist team; home readings normal; plan agreed' })));
        var wrap = h('div', null,
          ui.seg({ label: 'Decision', options: REVIEW_DEC, value: rv.decision || null, onChange: function (v) { ctx.set(base + 'decision', nil(v)); prefillNewDose(v); } }),
          newDoseWrap,
          decHost,
          overrideWrap,
          ui.field('Notes', textIn(rv.notes, save('notes'), { rows: 3, placeholder: 'What was agreed and when to review' })));
        paintDecision(ctx.a() || {});
        return wrap;
      }
      var tabs = null;
      function build() {
        if (built) return;
        built = true;
        tabs = ui.tabs([
          { id: 'm', label: 'Measures', render: measures },
          { id: 'b', label: 'Benefit', render: benefit },
          { id: 's', label: 'Side effects', render: sides },
          { id: 'd', label: 'Decision', render: decision }
        ], 'm');
        U.append(body, [tabs, h('div', { class: 'row tx-rowend' }, ui.btn({ label: 'Delete this review', kind: 'quiet', small: true, onClick: function () {
          var rv = cur();
          U.confirm({ title: 'Delete this review?', body: 'The review' + (rv.date ? ' from ' + dateText(rv.date) : '') + ' is removed. This cannot be undone.', ok: 'Delete', danger: true })
            .then(function (yes) { if (yes) { if (openReview[ctx.id] === id) openReview[ctx.id] = null; ctx.set('treatment.reviews.' + id, undefined); } });
        } }))]);
        paint(ctx.a() || {});
      }
      var d = ui.details(sum, body, { cls: 'tx-row tx-rev', open: openReview[ctx.id] === id, onToggle: function (open) {
        if (open) {
          openReview[ctx.id] = id; build();
          Object.keys(rows).forEach(function (k) { if (k !== id && rows[k].d.open) rows[k].d.open = false; });
        } else if (openReview[ctx.id] === id) openReview[ctx.id] = null;
      } });
      var dot = h('span', { class: 'tx-tl-dot', 'aria-hidden': 'true' });
      var li = h('li', { class: 'tx-tl-item' }, dot, d);
      function paint(a) {
        var rv = obj(obj(txOf(a).reviews)[id]), fl = Tx.reviewFlags(a, id);
        var worst = fl.length ? fl[0].level : null, nd = num(rv.newDose), dd = num(rv.dose);
        var ch = obj(txOf(a).choice), mine = curReviews(a).some(function (x) { return x.id === id; });
        var tone = worst ? kindOf(worst) : !mine ? 'neutral' : rv.decision === 'optimised' ? 'ok' : rv.decision === 'stop' ? 'neutral' : 'accent';
        var dcls = 'tx-tl-dot tx-tl-dot-' + tone;
        if (dot.className !== dcls) dot.className = dcls;
        var vit = [bpOf(rv) ? 'BP ' + bpOf(rv) : null, rv.bpCentile ? lc(centileText(rv.bpCentile)) + ' centile' : null,
          num(rv.pulse) !== null ? 'pulse ' + num(rv.pulse) : null, num(rv.weightKg) !== null ? fmt(num(rv.weightKg)) + ' kg' : null,
          rv.effect ? 'benefit ' + lc(labelOf(EFFECT, rv.effect)) : null].filter(Boolean).join(' · ');
        fill(sum, [
          h('span', { class: 'tx-tl-line' },
            h('span', { class: 'tx-revdate' }, rv.date ? dateText(rv.date) : 'No date'),
            dd !== null ? h('span', { class: 'tx-revdose' }, fmt(dd) + ' mg a day' + (nd !== null && nd !== dd && NEW_DOSE_DEC[rv.decision] ? ' → ' + fmt(nd) + ' mg' : '')) : null,
            !mine && (rv.product || rv.drug || ch.drug) ? h('span', { class: 'tx-revmed' }, rv.product ? prodName(rv.product) : rv.drug ? drugName(rv.drug) : 'Earlier medicine') : null,
            rv.decision ? ui.badge(labelOf(REVIEW_DEC, rv.decision), rv.decision === 'optimised' ? 'ok' : rv.decision === 'stop' ? 'warn' : 'neutral') : null,
            worst ? ui.badge(plural(fl.length, 'flag'), kindOf(worst)) : null),
          vit ? h('span', { class: 'tx-tl-meta' }, vit) : null
        ]);
        if (!built) return;
        fill(flagHost, fl.map(function (f) { return note(f.level, f.text, 'Next: ' + f.do); }));
        cmpHost.textContent = compareText(a, rv);
        paintDecision(a);
      }
      function paintDecision(a) {
        var rv = obj(obj(txOf(a).reviews)[id]), dec = rv.decision, out = [];
        var nd = num(rv.newDose), dd = num(rv.dose), serious = seriousFlags(a, id);
        if (newDoseWrap) newDoseWrap.hidden = !NEW_DOSE_DEC[dec];
        if (overrideWrap) overrideWrap.hidden = !(dec === 'optimised' && serious.length);
        if (dec === 'increase') {
          var sg = suggestAt(a, id);
          if (sg && sg.text) out.push(h('p', { class: 'tx-next' }, h('strong', null, 'Suggested next step: '), stripClauses(sg.text)));
          if (nd === null) out.push(h('p', { class: 'hint' }, 'Record the new daily dose above.'));
          else if (dd !== null && nd <= dd) out.push(note('warn', null, 'The new dose is not higher than ' + fmt(dd) + ' mg a day. Check the decision or the dose.'));
        } else if (dec === 'optimised') {
          if (serious.length && !overridden(rv)) {
            out.push(note('warn', 'Act on the flags first', 'Reduce the dose and refer before treating this dose as optimised or asking for shared care. If the specialist team agrees the dose can stay, record why below.'));
          } else {
            out.push(note('ok', serious.length ? 'Dose optimised: flags reviewed' : 'Dose optimised', 'Next: the monitoring schedule and, when the dose is stable, shared care.', [goBtn(ctx, 'monitor', 'Go to monitoring')]));
          }
        } else if (dec === 'switch') {
          out.push(note('info', 'Switch', 'Next: record this medicine under previous medicines, then choose the next one in the NICE order. The new medicine starts at its own starting dose: there is no dose conversion between medicines.',
            [ui.btn({ label: 'Record it and go to prescribing', kind: 'ghost', small: true, onClick: function () { recordPrior(); } })]));
        } else if (dec === 'stop') {
          out.push(note('info', 'Stop', 'Record the reason in the notes and agree how to stop. Some medicines need to be reduced slowly: check the SmPC. No further prescription is offered for this medicine.'));
        } else if (dec === 'reduce') {
          if (nd === null) out.push(note('warn', 'Enter the new, lower dose', 'Record the new daily dose above: the next prescription and the next review use it.'));
          else if (dd !== null && nd >= dd) out.push(note('warn', null, 'The new dose is not lower than ' + fmt(dd) + ' mg a day. Check it.'));
          else out.push(h('p', { class: 'hint' }, 'Recheck at the next review.'));
        }
        fill(decHost, out);
      }
      if (d.open) build();
      return { d: d, li: li, paint: paint };
    }
    /* Switching: the current medicine goes into "previous medicines" with its weeks and highest dose. */
    function recordPrior() {
      var a = ctx.a() || {}, ch = obj(txOf(a).choice);
      if (!ch.drug) return;
      /* Only the outgoing medicine's reviews: its doses, and a new dose agreed before the switch. */
      var rs = curReviews(a), max = null;
      rs.forEach(function (r) {
        [num(r.dose), r.decision === 'switch' || r.decision === 'stop' ? null : num(r.newDose)].forEach(function (dd) { if (dd !== null && (max === null || dd > max)) max = dd; });
      });
      /* weeks: how long it was taken; weeksAtDose: weeks at the optimised or maximum dose, which is what makes a
         trial adequate (6 weeks at that dose). An adequate trial is ticked only when the trial clock says so. */
      var tv = trialView(a), tr = tv.tr, rec = { drug: ch.drug };
      if (ch.product) rec.product = ch.product;
      if (max !== null) rec.maxDose = max;
      if (tr.days !== null) rec.weeks = tr.weeks;
      if (tr.doseDate) rec.weeksAtDose = tr.weeksAtDose || 0;
      if (tv.adequate) rec.adequate = true;
      ctx.set('treatment.prior.' + U.uid(), rec);
      stageMem[ctx.id] = 'prior';
      U.toast('Added to previous medicines: record how it went', 'ok');
      ctx.go('prescribe');
    }
    /* The start of the current medicine, as the first point of the timeline. */
    function startItem(a) {
      var ch = obj(txOf(a).choice);
      if (!ch.product || !ch.startDate) return null;
      return h('li', { class: 'tx-tl-item is-start' }, h('span', { class: 'tx-tl-dot tx-tl-dot-start', 'aria-hidden': 'true' }),
        h('p', { class: 'tx-tl-start' }, h('span', { class: 'tx-revdate' }, dateText(ch.startDate)),
          h('span', null, 'Started ' + prodName(ch.product) + (num(ch.startDose) !== null ? ' at ' + fmt(num(ch.startDose)) + ' mg a day' : ''))));
    }
    function renderList(a) {
      U.clear(listHost); rows = {};
      var rs = Tx.reviewsSorted(a).slice().reverse(), ch = obj(txOf(a).choice);
      var st = startItem(a), placed = !st;
      if (!rs.length) listHost.appendChild(h('li', { class: 'tx-tl-item is-empty' }, h('span', { class: 'tx-tl-dot tx-tl-dot-neutral', 'aria-hidden': 'true' }), h('p', { class: 'muted tx-tl-start' }, 'No reviews yet.')));
      rs.forEach(function (r) {
        if (!placed && r.date && ch.startDate && r.date < ch.startDate) { listHost.appendChild(st); placed = true; }
        var row = reviewRow(r); rows[r.id] = row; listHost.appendChild(row.li); row.paint(a);
      });
      if (!placed) listHost.appendChild(st);
    }
    function paintAll() {
      var a = ctx.a() || {}, ch = obj(txOf(a).choice);
      paintReady(a); paintSummary(a); src.paint(a);
      var ids = Object.keys(obj(txOf(a).reviews)).sort().join('|') + '#' + (ch.product || '') + (ch.startDate || '') + ':' + (ch.startDose == null ? '' : ch.startDose);
      if (ids !== sig) { sig = ids; renderList(a); }
      else Object.keys(rows).forEach(function (k) { rows[k].paint(a); });
    }
    paintAll();
    ctx.onChange('treatment', U.debounce(function () { if (el.isConnected) paintAll(); }, 80));
    return null;
  } };

  /* =================================================================================
     Step: monitoring and shared care
     Notes > summary (anything overdue, the next specialist review, shared care, the annual review) > one card with
     tabs: schedule (due and overdue chips), annual review, shared care, and adult services from 13.
     ================================================================================= */
  /* Due within 30 days: a display cue only ("Due soon"), not a clinical threshold. */
  function dueSoon(due, td) { var n = T().daysBetween(td, due); return n !== null && n >= 0 && n <= 30; }
  function dueCell(x, td) {
    if (!x.due) return '-';
    var soon = !x.overdue && dueSoon(x.due, td);
    return h('span', { class: 'tx-due' }, h('span', { class: 'tx-date' }, dateText(x.due)),
      x.overdue ? ui.badge('Overdue', 'err') : soon ? ui.badge('Due soon', 'warn', 'Due within 30 days') : null);
  }
  AA.steps.monitor = { render: function (el, ctx) {
    if (!ready()) { el.appendChild(notLoaded()); return null; }
    var Tx = T(), a0 = ctx.a() || {}, M = monitorData();
    var an = applicNote(ctx, a0, 'monitor');
    if (an) el.appendChild(an);
    var readyHost = h('div', { class: 'tx-ready' });
    el.appendChild(readyHost);
    var sumHost = h('div', { class: 'tx-sumhost' });
    el.appendChild(sumHost);
    function MON() { return obj(ctx.get('treatment.monitor', {})); }
    function setM(key, v) { ctx.set('treatment.monitor.' + key, v); }
    var live = {};

    function earliestDue(a) {
      var due = Tx.monitorPlan(a).map(function (x) { return x.due; }).filter(Boolean).sort();
      return due[0] || null;
    }

    /* Monitoring items whose date is kept in treatment.monitor (for example needReviewDate: guanfacine, is it still
       needed?). The annual review date has its own tab. */
    var MEASURE_FIELDS = { bp: 1, heightCm: 1, weightKg: 1, annualDate: 1 };
    function dateItems(a) {
      var ch = obj(txOf(a).choice), g = grp(a) === 'adult' ? 'adult' : 'young';
      return arr(M[g]).filter(function (x) {
        if (!x || !x.id || !x.field || MEASURE_FIELDS[x.field] || !fitsAge(x, a)) return false;
        return !Array.isArray(x.drugs) || (!!ch.drug && x.drugs.indexOf(ch.drug) > -1);
      });
    }
    /* ---- Tab: schedule ---- */
    function scheduleTab() {
      var mon = MON(), a = ctx.a() || {};
      live.sched = h('div', { 'aria-live': 'polite' });
      live.suggest = h('span', { class: 'tx-use' });
      var nextIn = dateIn(mon.nextReview, function (v) { setM('nextReview', v); });
      live.nextIn = nextIn;
      var acts = actionsFor(a), dItems = dateItems(a);
      return h('div', null,
        live.sched,
        h('div', { class: 'form-grid tx-fields tx-schedf' },
          h('div', { class: 'tx-fwrap' }, ui.field('Next specialist review', nextIn), live.suggest),
          dItems.map(function (x) {
            return ui.field(String(x.what || x.id), dateIn(mon[x.field], function (v) { setM(x.field, v); }),
              'Date it was last done. The next due date counts from it.' + (x.specialistOnly ? ' The specialist team keeps this check.' : ''));
          })),
        acts.length ? ui.details('What to do if a result is abnormal', h('ul', { class: 'tx-actions' }, acts.map(function (x) {
          return h('li', null, h('strong', null, stripClauses(x.t)), h('span', null, stripClauses(x.do)));
        })), { cls: 'tx-bare', meta: String(acts.length) }) : null);
    }
    function paintSchedule(a) {
      if (curTab !== 'sched' || !live.sched) return;
      var plan = Tx.monitorPlan(a), ch = obj(txOf(a).choice), out = [], td = today();
      if (!ch.startDate) out.push(note('info', 'Due dates start from the start date', null, [goBtn(ctx, 'prescribe', 'Add the start date')]));
      if (!plan.length) out.push(h('p', { class: 'muted' }, 'No monitoring items for this age in the treatment data.'));
      else {
        out.push(stackTable(['What', 'How often', 'Last done', 'Next due'], plan.map(function (x) {
          return [x.specialistOnly ? h('span', null, x.what, ' ', ui.badge('Specialist team', 'neutral')) : x.what, x.freq || '', x.last ? h('span', { class: 'tx-date' }, dateText(x.last)) : '-', dueCell(x, td)];
        }), 'tx-sched'));
      }
      fill(live.sched, out);
      var e = earliestDue(a), mon = obj(txOf(a).monitor);
      fill(live.suggest, e && e !== mon.nextReview ? ui.btn({ label: 'Use ' + dateText(e), kind: 'quiet', small: true, onClick: function () { setM('nextReview', e); if (live.nextIn) live.nextIn.value = e; } }) : null);
    }

    /* ---- Tab: annual review ---- */
    /* The NICE areas carry a number (area 1 to 8); the decision and record items follow them. */
    function annualItems() { return arr(M.annual).filter(function (x) { return x && x.id; }); }
    function annualTab() {
      var mon = MON(), done = obj(mon.annual), items = annualItems();
      var areas = items.filter(function (x) { return num(x.area) !== null; }), rest = items.filter(function (x) { return num(x.area) === null; });
      live.annual = h('span', { class: 'tx-cnt' });
      live.annualRest = h('span', { class: 'tx-cnt' });
      live.annualAll = h('span', { class: 'tx-cnt' });
      function box(x) {
        var n = num(x.area);
        return ui.check({ label: n !== null ? [h('span', { class: 'tx-area', 'aria-hidden': 'true' }, String(n)), h('span', { class: 'sr-only' }, 'Area ' + n + ': '), x.t] : x.t,
          checked: !!done[x.id], cls: 'tx-check' + (n !== null ? ' tx-check-area' : ''), onChange: function (on) { setM('annual.' + x.id, on ? true : undefined); } });
      }
      return h('div', null,
        h('p', { class: 'hint tx-tabhint' }, 'At least once a year the specialist reviews the medicine and whether to continue. Tick each area as you cover it.'),
        h('div', { class: 'form-grid tx-fields tx-datef' }, ui.field('Date of the last annual review', dateIn(mon.annualDate, function (v) { setM('annualDate', v); }))),
        areas.length ? h('div', { class: 'tx-subrow' }, h('h3', { class: 'tx-subh' }, 'The ' + areas.length + ' areas to review'), live.annual) : null,
        areas.length ? h('div', { class: 'tx-checks tx-areas' }, areas.map(box)) : null,
        rest.length ? h('div', { class: 'tx-subrow' }, h('h3', { class: 'tx-subh' }, areas.length ? 'Then decide and record' : 'Annual review'), areas.length ? live.annualRest : live.annualAll) : null,
        rest.length ? h('div', { class: 'tx-checks' }, rest.map(box)) : null);
    }
    function paintAnnual(a) {
      if (curTab !== 'annual' || !live.annual) return;
      var done = obj(obj(txOf(a).monitor).annual), items = annualItems();
      var areas = items.filter(function (x) { return num(x.area) !== null; }), rest = items.filter(function (x) { return num(x.area) === null; });
      function n(list) { return list.filter(function (x) { return done[x.id]; }).length; }
      paintCnt(live.annual, n(areas), areas.length, 'covered');
      paintCnt(live.annualRest, n(rest), rest.length, 'done');
      paintCnt(live.annualAll, n(items), items.length, 'covered');
    }

    /* ---- Tab: shared care ---- */
    /* One short next step per status; the full process sits in the closed "How shared care works" list. */
    function sharedHint(a) {
      var s = obj(txOf(a).monitor).shared;
      if (s === 'not_yet') return note('info', null, 'Next: ask the GP once titration is finished and the dose is stable.');
      if (s === 'requested') return note('info', null, 'Next: keep prescribing, with enough supply to cover any delay, until the GP agrees.');
      if (s === 'agreed') return note('ok', null, 'The GP prescribes and monitors as agreed. The specialist team keeps the annual review and any trial off medicine. Copy the letter into the record.');
      if (s === 'declined') return note('warn', null, 'Next: keep prescribing and monitoring in the specialist service, and record the reason.');
      return null;
    }
    function sharedTab() {
      var mon = MON(), hb = obj(mon.handback), hbItems = arr(M.handback).filter(function (x) { return x && x.id; });
      live.sharedHint = h('div', { class: 'tx-live', 'aria-live': 'polite' });
      live.letter = h('div', { class: 'tx-letterhost' });
      live.hbCnt = h('span', { class: 'tx-cnt' });
      var letterDet = ui.details('Shared care request letter', [
        h('p', { class: 'hint' }, 'Built from this record. Check every line and fill in the parts in square brackets.'),
        h('div', { class: 'row tx-letteract' }, letterActions()),
        live.letter
      ], { cls: 'tx-bare tx-letterdet', onToggle: function (open) { if (open) paintLetter(ctx.a() || {}); } });
      live.letterDet = letterDet;
      var proc = arr(M.sharedCareProcess).filter(function (x) { return x && x.t; });
      return h('div', null,
        ui.seg({ label: 'Shared care with the GP', options: SHARED, value: mon.shared || null, onChange: function (v) { setM('shared', nil(v)); } }),
        live.sharedHint,
        proc.length ? ui.details('How shared care works', bullets(proc.map(function (x) { return x.t; })), { cls: 'tx-bare', meta: String(proc.length) }) : null,
        h('div', { class: 'form-grid tx-fields' },
          ui.field('GP practice and contact', textIn(mon.gp, function (v) { setM('gp', v); }, { placeholder: 'Practice name, and who to contact' }))),
        hbItems.length ? h('div', { class: 'tx-sub' },
          h('div', { class: 'tx-subrow' }, h('h3', { class: 'tx-subh' }, 'When the GP hands care back'), live.hbCnt),
          h('p', { class: 'hint' }, 'Tick the ones agreed with the GP. The letter lists the ticked ones, or all of them if none is ticked.'),
          h('div', { class: 'tx-checks' }, hbItems.map(function (x) {
            return ui.check({ label: x.t, checked: !!hb[x.id], cls: 'tx-check', onChange: function (on) { setM('handback.' + x.id, on ? true : undefined); } });
          }))) : null,
        letterDet,
        ui.field('Monitoring notes', textIn(mon.notes, function (v) { setM('notes', v); }, { rows: 2, placeholder: 'For example who does each check, local protocol, letters sent' })));
    }
    function letterActions() {
      var acts = [ui.btn({ label: 'Copy the letter', kind: 'primary', small: true, onClick: function () { copy(letterText(AA.components.sharedCareLetter(ctx.a() || {})), 'Letter'); } })];
      if (!U.isEmbedded) {
        acts.push(ui.btn({ label: 'Download .txt', kind: 'ghost', small: true, onClick: function () {
          var a = ctx.a() || {}, text = letterText(AA.components.sharedCareLetter(a));
          var ref = String(obj(a.patient).ref || 'patient').replace(/[^A-Za-z0-9_]+/g, '_');
          if (U.download('shared-care-request-' + ref + '-' + today() + '.txt', text, 'text/plain')) U.toast('Letter saved', 'ok');
          else copy(text, 'Letter');
        } }));
        acts.push(ui.btn({ label: 'Print', kind: 'ghost', small: true, onClick: printLetter }));
      }
      return acts;
    }
    function printLetter() {
      var body = document.body;
      try {
        body.classList.add('tx-printing');
        var done = function () { body.classList.remove('tx-printing'); window.removeEventListener('afterprint', done); };
        window.addEventListener('afterprint', done);
        window.print();
        setTimeout(done, 1500);
      } catch (e) { body.classList.remove('tx-printing'); U.toast('Printing is not available here.', 'warn'); }
    }
    function paintShared(a) {
      if (curTab !== 'shared' || !live.sharedHint) return;
      fill(live.sharedHint, sharedHint(a));
      var hbItems = arr(M.handback).filter(function (x) { return x && x.id; }), hb = obj(obj(txOf(a).monitor).handback);
      if (live.hbCnt) paintCnt(live.hbCnt, hbItems.filter(function (x) { return hb[x.id]; }).length, hbItems.length, 'agreed');
      if (live.letterDet && live.letterDet.open) paintLetter(a);
    }
    function paintLetter(a) { if (live.letter) fill(live.letter, letterNode(AA.components.sharedCareLetter(a))); }

    /* ---- Tab: moving to adult services (young people 13 and over) ---- */
    function transitionTab() {
      var mon = MON(), items = arr(M.transition).filter(function (x) { return x && x.id; }), age = ageOf(ctx.a() || {});
      return h('div', null,
        h('p', { class: 'hint tx-tabhint' }, age !== null && age >= 16 ? 'Plan the move to adult services now: transfer is usually complete by 18.' : 'Start planning the move to adult services early (by Year 9 at the latest).'),
        items.length ? ui.steps(items.map(function (x) { return x.t; })) : null,
        h('div', { class: 'tx-sub' }, ui.check({ label: 'A transition plan is in place', checked: mon.transition === true, onChange: function (on) { setM('transition', on ? true : undefined); } })));
    }

    var tabDefs = [
      { id: 'sched', label: 'Schedule', render: scheduleTab },
      { id: 'annual', label: 'Annual review', render: annualTab },
      { id: 'shared', label: 'Shared care', render: sharedTab }
    ];
    if (transitionShown(a0)) tabDefs.push({ id: 'trans', label: 'Adult services', render: transitionTab });
    var curTab = 'sched';
    var tabs = ui.tabs(tabDefs, 'sched', function (id) { curTab = id; var a = ctx.a() || {}; paintSchedule(a); paintAnnual(a); paintShared(a); });
    var monCard = card(null, [tabs], 'tx-moncard');
    el.appendChild(monCard);
    /* Open a tab from a summary fact: bring the card into view and put the focus on the tab itself. */
    function openTab(id) {
      tabs.show(id);
      try { monCard.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { /* ignore */ }
      var b = monCard.querySelector('.tab[aria-selected="true"]');
      if (b) { try { b.focus({ preventScroll: true }); } catch (e2) { /* ignore */ } }
    }

    function paintReady(a) {
      var out = [], pn = planNote(ctx, a);
      if (pn) out.push(pn);
      fill(readyHost, out);
    }
    /* Anything overdue first, then the next specialist review, shared care and the annual review. */
    function paintSummary(a) {
      var plan = Tx.monitorPlan(a), ch = obj(txOf(a).choice), mon = obj(txOf(a).monitor), td = today();
      var dated = plan.filter(function (x) { return x.due; }).sort(function (x, y) { return x.due < y.due ? -1 : x.due > y.due ? 1 : 0; });
      var over = dated.filter(function (x) { return x.overdue; });
      var soon = dated.filter(function (x) { return !x.overdue && dueSoon(x.due, td); });
      var nextDue = dated.filter(function (x) { return !x.overdue; })[0] || null;
      var annual = plan.filter(function (x) { return /annual/.test(lc(x.id)); })[0] || null;
      var revPast = !!mon.nextReview && mon.nextReview < td;
      var o = { eyebrow: 'Monitoring and shared care', actions: [] };
      if (!ch.startDate) {
        o.kind = 'info'; o.badge = ['Not started', 'neutral']; o.title = 'Due dates start from the start date';
        o.actions.push(goBtn(ctx, 'prescribe', 'Add the start date'));
      } else if (over.length) {
        o.kind = 'err'; o.badge = [plural(over.length, 'check') + ' overdue', 'err'];
        o.title = over.length === 1 ? 'One check is overdue' : over.length + ' checks are overdue';
        o.extra = h('ul', { class: 'tx-reasons', 'aria-label': 'Overdue checks' }, over.map(function (x) {
          return h('li', { class: 'tx-r tx-r-err' }, h('span', { class: 'tx-dot', 'aria-hidden': 'true' }),
            h('span', null, String(x.what || '').replace(/\?$/, ''), ' ', h('span', { class: 'tx-r-due' }, '(due ' + dateText(x.due) + ')')));
        }));
        o.actions.push(ui.btn({ label: 'Open the schedule', kind: 'ghost', small: true, onClick: function () { openTab('sched'); } }));
      } else {
        o.kind = revPast || !mon.nextReview ? 'warn' : soon.length ? 'info' : 'ok';
        o.badge = soon.length ? ['Due soon', 'warn'] : ['Up to date', 'ok'];
        o.title = revPast ? 'The specialist review date has passed' : mon.nextReview ? 'Next specialist review on ' + dateText(mon.nextReview) : 'Set the next specialist review';
        if (revPast || !mon.nextReview) {
          o.next = revPast ? 'record the review, or set a new date in the schedule.' : 'set the date of the next specialist review in the schedule.';
          o.actions.push(ui.btn({ label: 'Open the schedule', kind: 'ghost', small: true, onClick: function () { openTab('sched'); } }));
        } else if (nextDue) {
          o.next = String(nextDue.what || '').replace(/\?$/, '') + ', due ' + dateText(nextDue.due) + '.';
          o.nextLabel = 'Next check';
        }
      }
      o.facts = [
        { k: 'Next specialist review', v: mon.nextReview ? dateText(mon.nextReview) : 'Not set', s: revPast ? 'Date has passed' : null, kind: mon.nextReview ? (revPast ? 'warn' : 'ok') : 'warn',
          onClick: function () { openTab('sched'); }, title: 'Open the schedule' },
        { k: 'Shared care', v: labelOf(SHARED, mon.shared) || 'Not recorded', s: textOrNone(mon.gp) ? String(mon.gp) : null,
          kind: mon.shared === 'agreed' ? 'ok' : mon.shared === 'declined' ? 'warn' : mon.shared ? 'info' : 'neutral', onClick: function () { openTab('shared'); }, title: 'Open shared care' },
        { k: 'Annual review', v: annual && annual.due ? 'Due ' + dateText(annual.due) : 'Not set', s: mon.annualDate ? 'Last on ' + dateText(mon.annualDate) : null,
          kind: annual && annual.overdue ? 'err' : annual && annual.due ? 'ok' : 'neutral', onClick: function () { openTab('annual'); }, title: 'Open the annual review' },
        transitionShown(a) ? { k: 'Adult services', v: mon.transition === true ? 'Plan in place' : 'No plan yet', kind: mon.transition === true ? 'ok' : 'warn', onClick: function () { openTab('trans'); }, title: 'Open adult services' } : null
      ];
      fill(sumHost, summaryCard(o));
    }
    var src = stepSources(el, function (a) {
      return Tx.monitorPlan(a).map(function (x) { return x.src; })
        .concat(actionsFor(a).map(function (x) { return x.src; }))
        .concat(arr(M.annual).map(function (x) { return x && x.src; }))
        .concat(arr(M.sharedCareProcess).map(function (x) { return x && x.src; }))
        .concat(arr(M.handback).map(function (x) { return x && x.src; }))
        .concat(arr(M.sharedCareContents).map(function (x) { return x && x.src; }))
        .concat(transitionShown(a) ? arr(M.transition).map(function (x) { return x && x.src; }) : []);
    });
    function paintAll() {
      var a = ctx.a() || {};
      paintReady(a); paintSummary(a); paintSchedule(a); paintAnnual(a); paintShared(a); src.paint(a);
    }
    paintAll();
    ctx.onChange('treatment', U.debounce(function () { if (el.isConnected) paintAll(); }, 80));
    return null;
  } };

  /* =================================================================================
     Live panel for the treatment steps (same folding pattern as the frame's panel)
     ================================================================================= */
  var foldOpen = null;
  function wide() { try { return window.matchMedia('(min-width: 1240px)').matches; } catch (e) { return true; } }
  function panelState(a) {
    var Tx = T(), t = txOf(a), d = obj(t.plan).decision;
    if (!Tx.applicable(a).ok) return ['Not applicable', 'neutral'];
    if (d === 'nondrug' || d === 'refer') return ['No medicine planned', 'neutral'];
    var ms = medState(a), ch = obj(t.choice);
    if (ms.reviews.length) {
      if (ms.stopped) return ['Stopped', 'neutral'];
      var fl = Tx.latestFlags(a);
      if (fl.some(function (f) { return f.level === 'urgent'; })) return ['Urgent flag', 'err'];
      if (fl.some(function (f) { return f.level === 'act'; })) return ['Act on flags', 'warn'];
      if (ms.optimised) return ['Optimised', 'ok'];
      return ['Titrating', 'info'];
    }
    var v = verdictView(a).level;
    if (v === 'risk') return ['Safety flags', 'err'];
    if (v === 'stopmix') return ['Do not start', 'err'];
    if (Tx.reviewsSorted(a).length && ch.drug && (v === 'ok' || v === 'caution')) return ['New medicine', 'info'];
    return { stop: ['Do not start', 'err'], cardiology: ['Specialist opinion first', 'err'], ecg: ['ECG first', 'warn'], incomplete: ['Checks to do', 'neutral'], caution: ['Cautions', 'warn'], ok: ['Checks clear', 'ok'] }[v] || ['Checks to do', 'neutral'];
  }
  AA.components.treatPanel = function (panel, a, ctx) {
    U.clear(panel);
    if (!ready() || !a) {
      panel.appendChild(h('div', { class: 'panel' }, h('h2', null, 'Treatment'), h('p', { class: 'hint' }, 'Treatment data not loaded.')));
      return;
    }
    var Tx = T(), t = txOf(a), ch = obj(t.choice), ap = Tx.applicable(a), mon = obj(t.monitor);
    var st = panelState(a), dn = doseNow(a), dose = dn.dose, p = prodOf(ch.product), tv = ch.startDate ? trialView(a) : null;
    /* The state badge sits under the heading on wide screens; narrower screens show it in the folded summary. */
    var secs = [h('h2', null, 'Treatment'), h('div', { class: 'tx-pstate' }, ui.badge(st[0], st[1]))];
    if (!ap.ok) {
      secs.push(h('p', { class: 'hint' }, stripClauses(ap.reason)));
      if (ap.code !== 'under6') secs.push(h('div', { class: 'row' }, ui.btn({ label: 'Open scoring', kind: 'ghost', small: true, onClick: function () { ctx.go('summary'); } })));
    }
    /* Safety flags from the safety and risk step stay in sight while prescribing (the frame's panel is replaced here). */
    var sf = AA.components.redFlags ? AA.components.redFlags(a) : null;
    if (sf) secs.push(sf);
    /* Medicine */
    var lic = p ? Tx.licence(a, p) : null;
    secs.push(h('div', { class: 'panel-sec tx-psec' },
      h('p', { class: 'tx-pk' }, 'Medicine'),
      ch.drug ? h('p', { class: 'tx-pmed' }, p ? p.name : drugName(ch.drug)) : h('p', { class: 'hint' }, 'Not chosen yet.'),
      ch.drug && p ? h('p', { class: 'tx-pv tx-pdrug' }, drugName(ch.drug)) : null,
      dn.stopped ? h('p', { class: 'tx-pv' }, stopText(medState(a))) : dose !== null ? h('p', { class: 'tx-pdose' }, fmt(dose) + ' mg a day' + (dn.from === 'start' ? ' (starting dose)' : '')) : null,
      lic ? licenceBadge(lic) : null));
    /* Latest measures: three figures side by side */
    var cells = [['bp', 'Blood pressure', 'mmHg'], ['pulse', 'Pulse', 'bpm'], ['weightKg', 'Weight', 'kg']].map(function (k) {
      var m = latestMeasure(a, k[0]);
      return m ? h('li', null, h('span', { class: 'tx-pstat-k' }, k[1]), h('span', { class: 'tx-pstat-v' }, k[0] === 'weightKg' ? fmt(m.v) : String(m.v)), h('span', { class: 'tx-pstat-u' }, k[2])) : null;
    }).filter(Boolean);
    var flags = Tx.reviewsSorted(a).length ? Tx.latestFlags(a) : [];
    var bpl = !Tx.reviewsSorted(a).length ? Tx.bpCheck(a, obj(t.baseline)) : null;
    secs.push(h('div', { class: 'panel-sec tx-psec' },
      h('p', { class: 'tx-pk' }, 'Latest measures'),
      cells.length ? h('ul', { class: 'tx-pstats' }, cells) : h('p', { class: 'hint' }, 'None recorded yet.'),
      flags.length ? h('ul', { class: 'tx-pflags' }, flags.slice(0, 3).map(function (f) {
        return h('li', { class: 'tx-r tx-r-' + kindOf(f.level) }, h('span', { class: 'tx-dot', 'aria-hidden': 'true' }), h('span', null, stripClauses(f.text)));
      })) : bpl && bpl.level !== 'ok' && bpl.level !== 'unknown' ? h('p', { class: 'tx-r tx-r-' + kindOf(bpl.level) }, h('span', { class: 'tx-dot', 'aria-hidden': 'true' }), h('span', null, 'Blood pressure: ' + ({ repeat: 'repeat the reading', confirm: 'confirm with ABPM or HBPM', refer: 'specialist opinion first', urgent: 'urgent review' }[bpl.level] || bpl.level))) : null));
    /* Trial */
    if (tv) {
      var tr = tv.tr;
      secs.push(h('div', { class: 'panel-sec tx-psec' },
        h('p', { class: 'tx-pk' }, 'Trial'),
        h('div', { class: 'tx-trial' }, h('span', { class: 'tx-trial-k' }, weekText(tr)), ui.progress(weekProg(tr), tr.need, 'Weeks of the trial'),
          tv.stopped ? ui.badge('Stopped', 'neutral') : tv.adequate ? ui.badge('Adequate', 'ok') : null)));
    }
    /* Next review and shared care. While the dose is still being titrated, the next contact is about a week on
       (a suggestion, until a date is set); the monitoring dates take over once the dose is optimised. */
    var next = mon.nextReview || null, overdue = false, nextNote = null;
    if (!next && ch.startDate && tv && !tv.stopped) {
      if (!tv.optimised) {
        var lastRv = curLatest(a), from = lastRv && lastRv.date ? lastRv.date : ch.startDate;
        next = Tx.addDays(from, 7);
        nextNote = 'Suggested: the next titration contact, about a week after the ' + (lastRv && lastRv.date ? 'last review' : 'start') + '. Agree the date.';
      } else {
        var due = Tx.monitorPlan(a).filter(function (x) { return x.due; }).sort(function (x, y) { return x.due < y.due ? -1 : 1; })[0];
        if (due) next = due.due;
      }
    }
    if (next) overdue = next < today();
    secs.push(h('div', { class: 'panel-sec tx-psec' },
      h('p', { class: 'tx-pk' }, nextNote ? 'Next titration contact' : 'Next review'),
      next ? h('p', { class: 'tx-pv tx-pnext' }, (nextNote ? 'About ' : '') + dateText(next), overdue ? [' ', ui.badge(nextNote ? 'Due' : 'Overdue', nextNote ? 'warn' : 'err')] : null) : h('p', { class: 'hint' }, tv && !tv.optimised && !tv.stopped ? 'Not set: agree the next titration contact (about weekly).' : 'Not set.'),
      nextNote ? h('p', { class: 'hint' }, nextNote) : null,
      mon.shared ? h('p', { class: 'hint' }, 'Shared care: ' + lc(labelOf(SHARED, mon.shared))) : null));
    var links = [['txplan', 'Plan'], ['baseline', 'Checks'], ['prescribe', 'Prescribe'], ['titrate', 'Titration'], ['monitor', 'Monitoring']].filter(function (x) { return !ctx || x[0] !== ctx.step; });
    secs.push(h('div', { class: 'panel-sec tx-plinks' }, h('p', { class: 'tx-pk' }, 'Treatment steps'), h('div', { class: 'row' }, links.map(function (x) {
      return ui.btn({ label: x[1], kind: 'quiet', small: true, onClick: function () { if (ctx) ctx.go(x[0]); } });
    }))));
    var box = h('div', { class: 'panel tx-panel' }, secs);
    var fold = h('details', { class: 'panel-fold', open: wide() || foldOpen === true },
      h('summary', null,
        h('span', { class: 'pf-title' }, 'Treatment'),
        h('span', { class: 'pf-counts' }, p ? p.name + (dose !== null ? ' ' + fmt(dose) + ' mg' : '') : ch.drug ? drugName(ch.drug) : 'No medicine yet'),
        ui.badge(st[0], st[1]),
        h('span', { class: 'pf-chev', 'aria-hidden': 'true' })),
      box);
    fold.addEventListener('toggle', function () { if (!wide()) foldOpen = fold.open; });
    panel.appendChild(fold);
  };

  /* =================================================================================
     Report sections and the shared care letter (model: [{title, blocks}], blocks
     {p} | {list} | {kv: [[k, v]]} | {table: {head, rows}}; all strings)
     ================================================================================= */
  function meaningful(v) {
    if (v === null || v === undefined || v === false) return false;
    if (typeof v === 'string') return v.trim() !== '';
    if (typeof v === 'number') return isFinite(v);
    if (v === true) return true;
    if (Array.isArray(v)) return v.some(meaningful);
    if (typeof v === 'object') return Object.keys(v).some(function (k) { return meaningful(v[k]); });
    return false;
  }
  function scopeLine(team) {
    if (scopeDone(team) === SCOPE.length) return 'Confirmed: ' + SCOPE.map(function (s) { return s.short; }).join('; ') + '.';
    return 'Not confirmed: ' + SCOPE.filter(function (s) { return team[s.k] !== true; }).map(function (s) { return s.short; }).join('; ') + '. A specialist prescriber in the team starts the medicine.';
  }
  function presentationOf(a) {
    var D = AA.diagnosis || {}, f = obj(a && a.formulation), P = D.PRESENTATIONS || {};
    if (f.decision === 'met') { var k = f.presentation || (typeof D.presentation === 'function' ? D.presentation(a) : null); return P[k] || null; }
    if (f.decision === 'other-specified') return P.other || null;
    return null;
  }

  AA.components.treatmentReport = function (a) {
    if (!ready() || !a) return [];
    var Tx = T(), t = txOf(a);
    if (!meaningful(t)) return [];
    var S = [], yng = isYoung(a);
    function sec(title) { var s = { title: title, blocks: [] }; S.push(s); return s; }

    /* Treatment plan */
    var p = obj(t.plan), s1 = sec('Treatment plan'), kv = [];
    if (p.decision) kv.push(['Decision', DEC_TEXT[p.decision] || p.decision]);
    /* The scope line always prints next to a planned or chosen medicine (NICE NG87 1.7.2). */
    if (meaningful(p.team) || p.decision === 'medication' || obj(t.choice).drug) kv.push(['Prescriber scope', scopeLine(obj(p.team))]);
    if (textOrNone(p.prefer)) kv.push(['Preferences', p.prefer]);
    if (textOrNone(p.notes)) kv.push(['Notes', p.notes]);
    if (kv.length) s1.blocks.push({ kv: kv });
    var stp = obj(p.steps), doneItems = planItemsFor(a).filter(function (x) { return stp[x.id] && stp[x.id] !== 'na'; }).map(function (x) { return x.t; });
    if (doneItems.length) s1.blocks.push({ list: doneItems });

    /* Pre-treatment checks */
    var b = obj(t.baseline);
    if (meaningful(b)) {
      var s2 = sec('Pre-treatment checks'), k2 = [];
      if (b.date) k2.push(['Date', dateText(b.date)]);
      var bp = bpOf(b);
      if (bp) {
        var rep = bpOf(obj(b.repeat)), rep3 = rep ? bpOf(obj(b.repeat3)) : null;
        var cbp = rep ? clinicBp(a, b) : null, lowerOf = rep3 ? 'the lower of the last two' : 'the lower of the two';
        k2.push(['Blood pressure', bp + ' mmHg' + (b.cuff ? ' (cuff: ' + b.cuff + ')' : '') + (rep ? '; second reading ' + rep + ' mmHg' + (rep3 ? '; third reading ' + rep3 + ' mmHg' : '') + (cbp ? '; clinic blood pressure ' + cbp + ' mmHg (' + lowerOf + ')' : '; ' + lowerOf + ' counts as the clinic blood pressure') : '') + (b.abpm ? '; ABPM or HBPM: ' + lc(labelOf(ABPM, b.abpm)) : '')]);
      }
      if (b.bpCentile || textOrNone(b.bpChart)) k2.push(['Blood pressure centile', (b.bpCentile ? labelOf(CENTILE, b.bpCentile) : 'Not recorded') + (textOrNone(b.bpChart) ? ' (chart: ' + b.bpChart + ')' : '')]);
      if (num(b.pulse) !== null) k2.push(['Pulse', num(b.pulse) + ' bpm']);
      var hw = [];
      if (num(b.heightCm) !== null) hw.push('height ' + fmt(num(b.heightCm)) + ' cm');
      if (num(b.weightKg) !== null) hw.push('weight ' + fmt(num(b.weightKg)) + ' kg');
      if (!yng && num(b.heightCm) && num(b.weightKg)) hw.push('BMI ' + (Math.round(10 * num(b.weightKg) / Math.pow(num(b.heightCm) / 100, 2)) / 10));
      if (hw.length) k2.push(['Height and weight', hw.join(', ')]);
      if (textOrNone(b.hrNote)) k2.push(['Pulse and blood pressure notes', b.hrNote]);
      var cItems = cardiacItems(a), cYes = cItems.filter(function (c) { return Tx.cardiacAnswer(a, c.id).v === 'yes'; }).map(function (c) { return c.t + (Tx.cardiacAnswer(a, c.id).fromHistory ? ' (from history, not yet confirmed)' : ''); });
      var cAll = cItems.length && cItems.every(function (c) { return Tx.cardiacAnswer(a, c.id).v; });
      if (cYes.length) k2.push(['Heart history', cYes.join('; ')]);
      else if (cAll) k2.push(['Heart history', 'No heart history features reported']);
      if (b.ecg) k2.push(['ECG', labelOf(ECG, b.ecg)]);
      if (b.cardiology) k2.push(['Cardiology or specialist opinion', labelOf(CARDIO, b.cardiology)]);
      var ciList = cautionItems(a);
      var ciYes = ciList.filter(function (c) { return Tx.ciAnswer(a, c.id).v === 'yes'; }).map(function (c) { return c.t + (Tx.ciAnswer(a, c.id).fromHistory ? ' (from history, not yet confirmed)' : ''); });
      var ciAll = ciList.length && ciList.every(function (c) { return Tx.ciAnswer(a, c.id).v; });
      if (ciYes.length) k2.push(['Safety screen: yes', ciYes.join('; ')]);
      else if (ciAll) k2.push(['Safety screen', 'Nothing reported']);
      if (b.childPugh && Tx.ciAnswer(a, 'ci_hepatic').v === 'yes') k2.push(['Liver impairment', 'Child-Pugh ' + labelOf(CHILD_PUGH, b.childPugh)]);
      if (oldCypOpen(b)) k2.push(['CYP3A4', 'Earlier answer: takes a CYP3A4 inhibitor or inducer (which one is not recorded)']);
      if (textOrNone(b.meds)) k2.push(['Current medicines', b.meds]);
      if (b.misuse) k2.push(['Misuse or diversion risk', labelOf(MISUSE, b.misuse) + (textOrNone(b.misuseNotes) ? '. ' + b.misuseNotes : '')]);
      var pf = pregFollow(b), pfYes = pf && obj(b.ci)[pf.id] === 'yes' ? (pf.id === 'ci_breastfeeding' ? '; also breastfeeding' : '; also pregnant or planning a pregnancy') : '';
      if (b.pregnancy) k2.push(['Pregnancy', labelOf(PREG, b.pregnancy) + pfYes + (b.contraception === true ? '; uses reliable contraception' : '')]);
      if (b.driving) k2.push(['Driving', labelOf(DRIVE, b.driving)]);
      if (textOrNone(b.notes)) k2.push(['Notes', b.notes]);
      var vv = verdictView(a), v = vv.v;
      k2.push(['Verdict', vv.m.t + ' (' + (v.done || 0) + ' of ' + (v.of || 0) + ' checks recorded)']);
      s2.blocks.push({ kv: k2 });
      var rs2 = arr(v.reasons).filter(function (r) { return r.level !== 'ok'; }).map(function (r) { return stripClauses(String(r.text || r)); })
        .concat(vv.rf.map(function (it) { return 'Safety step: ' + (it.short || it.text) + '. Act on this before starting.'; }));
      if (rs2.length) s2.blocks.push({ list: rs2 });
    }

    /* Medicine and prescription */
    var ch = obj(t.choice), prior = obj(t.prior);
    var priorRows = Object.keys(prior).map(function (k) { return obj(prior[k]); }).filter(function (x) { return x.drug; });
    if (meaningful(ch) || priorRows.length) {
      var s3 = sec('Medicine and prescription'), k3 = [], d = drugOf(ch.drug), pr = prodOf(ch.product);
      if (d) k3.push(['Medicine', d.name + ', ' + lc(d.cls)]);
      if (pr) {
        var lic = Tx.licence(a, pr);
        k3.push(['Product', pr.name + ' (' + lc(pr.form) + ')']);
        k3.push(['Licence', licenceLine(lic)]);
      }
      if (d) k3.push(['Legal status', d.cd]);
      if (textOrNone(ch.why)) k3.push(['Reason for this choice', ch.why]);
      if (num(ch.weightKg) !== null) k3.push(['Weight used for dosing', fmt(num(ch.weightKg)) + ' kg']);
      if (num(ch.startDose) !== null) k3.push(['Starting dose', fmt(num(ch.startDose)) + ' mg a day' + (textOrNone(ch.times) ? ', ' + ch.times : '')]);
      if (ch.startDate) k3.push(['Start date', dateText(ch.startDate)]);
      if (num(ch.supplyDays) !== null || num(ch.quantity) !== null) k3.push(['Supply', (num(ch.supplyDays) !== null ? plural(num(ch.supplyDays), 'day') : '') + (num(ch.quantity) !== null ? (num(ch.supplyDays) !== null ? ', ' : '') + 'quantity ' + num(ch.quantity) : '')]);
      if (textOrNone(ch.supplyReason)) k3.push(['Reason for more than 30 days', ch.supplyReason]);
      if (textOrNone(ch.overMaxReason)) k3.push(['Reason for a dose above the usual or SmPC maximum', ch.overMaxReason]);
      if (ch.stimulantsUnsuitable === true) k3.push(['Licence condition', 'Stimulants are not suitable, not tolerated or not effective (recorded by the prescriber)']);
      var cs = counselFor(a);
      if (cs.length && ch.drug) k3.push(['Counselling', cs.filter(function (c) { return obj(ch.counsel)[c.id]; }).length + ' of ' + cs.length + ' points covered']);
      var rc = rxChecksFor(a);
      if (rc.length && ch.drug) k3.push(['Prescription checks', rc.filter(function (c) { return obj(ch.rx)[c.id]; }).length + ' of ' + rc.length + ' checked']);
      if (textOrNone(ch.notes)) k3.push(['Prescription notes', ch.notes]);
      var dn3 = ch.drug ? doseNow(a) : null;
      if (dn3 && dn3.stopped) k3.push(['Status', dn3.reason + '. No prescription.']);
      else if (dn3 && dn3.dose !== null && dn3.from !== 'start') k3.push(['Dose now', fmt(dn3.dose) + ' mg a day']);
      if (k3.length) s3.blocks.push({ kv: k3 });
      var rx = pr ? rxTextOf(a) : null;
      if (rx && rx.lines.length) s3.blocks.push({ list: rx.lines.map(function (l) { return 'Prescription: ' + l; }) });
      if (priorRows.length) {
        s3.blocks.push({ p: 'Previous ADHD medicines:' });
        s3.blocks.push({ table: { head: ['Medicine', 'Product', 'Outcome', 'Adequate trial', 'Weeks', 'Highest dose'], rows: priorRows.map(function (x) {
          return [drugName(x.drug), x.product ? prodName(x.product) : '-', x.outcome ? labelOf(OUTCOMES, x.outcome) : 'Not recorded', x.adequate === true ? 'Yes' : 'No',
            (num(x.weeks) !== null ? String(num(x.weeks)) : '-') + (num(x.weeksAtDose) !== null ? ' (' + num(x.weeksAtDose) + ' at the final dose)' : ''), num(x.maxDose) !== null ? fmt(num(x.maxDose)) + ' mg' : '-'];
        }) } });
      }
    }

    /* Titration and reviews */
    var rs = Tx.reviewsSorted(a);
    if (rs.length || ch.startDate) {
      var s4 = sec('Titration and reviews');
      if (ch.startDate) s4.blocks.push({ p: stripClauses(trialView(a).text) });
      if (rs.length) {
        /* A medicine column when the reviews cover more than one medicine (after a switch). */
        var cur4 = curReviews(a).map(function (r) { return r.id; });
        var medOf = function (r) { return r.product ? prodName(r.product) : r.drug ? drugName(r.drug) : cur4.indexOf(r.id) > -1 && ch.product ? prodName(ch.product) : 'Earlier medicine'; };
        var multi = uniq(rs.map(medOf)).length > 1;
        s4.blocks.push({ table: { head: ['Date'].concat(multi ? ['Medicine'] : []).concat(['Dose', 'BP and pulse', 'Weight', 'Benefit', 'Decision']), rows: rs.map(function (r) {
          var vit = [bpOf(r) ? bpOf(r) + (r.bpCentile ? ' (' + lc(centileText(r.bpCentile)) + ' centile)' : '') : r.bpCentile ? lc(centileText(r.bpCentile)) + ' centile' : null,
            num(r.pulse) !== null ? num(r.pulse) + ' bpm' : null].filter(Boolean).join(', ');
          var nd4 = num(r.newDose), dec4 = r.decision ? labelOf(REVIEW_DEC, r.decision) + (nd4 !== null && NEW_DOSE_DEC[r.decision] && nd4 !== num(r.dose) ? ' to ' + fmt(nd4) + ' mg' : '') : '-';
          return [r.date ? dateText(r.date) : 'No date'].concat(multi ? [medOf(r)] : []).concat([num(r.dose) !== null ? fmt(num(r.dose)) + ' mg' : '-',
            vit || '-',
            num(r.weightKg) !== null ? fmt(num(r.weightKg)) + ' kg' : '-', r.effect ? labelOf(EFFECT, r.effect) : '-', dec4]);
        }) } });
        var notes = [];
        rs.forEach(function (r) {
          var when = r.date ? dateText(r.date) : 'Undated review';
          var trouble = Object.keys(obj(r.se)).filter(function (k) { return r.se[k] === 'troublesome'; }).map(function (k) { var x = AA.byId('txSideEffects', k); return x ? x.t : k; });
          if (trouble.length) notes.push(when + ': troublesome side effects: ' + trouble.join('; ') + '.');
          Tx.reviewFlags(a, r.id).forEach(function (f) { notes.push(when + ': ' + stripClauses(f.text + ' ' + f.do)); });
          if (r.decision === 'optimised' && overridden(r)) notes.push(when + ': dose treated as optimised despite the flags. Reason: ' + String(r.flagOverride).trim());
          if (textOrNone(r.dayCover)) notes.push(when + ': cover in the day: ' + r.dayCover);
          if (textOrNone(r.scale) || textOrNone(r.scaleScore)) notes.push(when + ': ' + [r.scale, r.scaleScore].filter(textOrNone).join(' '));
          if (textOrNone(r.notes)) notes.push(when + ': ' + r.notes);
        });
        if (notes.length) s4.blocks.push({ list: notes });
      }
    }

    /* Monitoring and shared care */
    var mon = obj(t.monitor);
    if (ch.startDate || meaningful(mon)) {
      var s5 = sec('Monitoring and shared care'), plan = ch.startDate ? Tx.monitorPlan(a) : [];
      if (plan.length) s5.blocks.push({ table: { head: ['What', 'How often', 'Next due'], rows: plan.map(function (x) { return [x.what, x.freq || '-', x.due ? dateText(x.due) + (x.overdue ? ' (overdue)' : '') : '-']; }) } });
      var k5 = [];
      if (mon.nextReview) k5.push(['Next specialist review', dateText(mon.nextReview)]);
      if (mon.annualDate) k5.push(['Last annual review', dateText(mon.annualDate)]);
      var an = arr(monitorData().annual).filter(function (x) { return x && obj(mon.annual)[x.id]; }).map(function (x) { return (num(x.area) !== null ? 'Area ' + num(x.area) + ': ' : '') + x.t; });
      if (an.length) k5.push(['Annual review covered', an.join('; ')]);
      if (mon.shared) k5.push(['Shared care', labelOf(SHARED, mon.shared) + (textOrNone(mon.gp) ? ' (' + mon.gp + ')' : '')]);
      if (transitionShown(a) || mon.transition) k5.push(['Transition to adult services', mon.transition === true ? 'Plan in place' : 'No plan recorded yet']);
      if (textOrNone(mon.notes)) k5.push(['Notes', mon.notes]);
      if (k5.length) s5.blocks.push({ kv: k5 });
    }
    return S.filter(function (s) { return s.blocks.length; });
  };

  /* The monitoring the GP is asked to share: the engine's sharedCarePlan when it has one; otherwise the monitoring
     plan without the checks the specialist team keeps (specialistOnly items and the annual review). */
  function gpPlan(a) {
    var t = T();
    if (typeof t.sharedCarePlan === 'function') {
      try {
        var r = t.sharedCarePlan(a), rows = Array.isArray(r) ? r : arr(r && (r.rows || r.items || r.gp || r.plan));
        if (Array.isArray(r) || rows.length) return rows.filter(function (x) { return x && x.specialistOnly !== true; });
      } catch (e) { /* use the rule below */ }
    }
    return t.monitorPlan(a).filter(function (x) { return x && x.specialistOnly !== true && x.id !== 'annual'; });
  }
  AA.components.sharedCareLetter = function (a) {
    var title = 'Request for shared care: ADHD medicine';
    if (!ready() || !a) return { title: title, sections: [] };
    var Tx = T(), t = txOf(a), ch = obj(t.choice), mon = obj(t.monitor), f = obj(a.formulation), pt = obj(a.patient);
    var p = prodOf(ch.product), d = drugOf(ch.drug || (p && p.drug)), yng = isYoung(a), age = ageOf(a);
    var S = [];
    function sec(tt) { var s = { title: tt, blocks: [] }; S.push(s); return s; }

    sec('Patient and practice').blocks.push({ kv: [
      ['To', textOrNone(mon.gp) ? mon.gp : '[GP practice]'],
      ['From', '[Specialist ADHD team, prescriber name and role]'],
      ['Patient', (pt.ref ? 'Reference ' + pt.ref : '[Patient reference]') + (age !== null ? ', age ' + age : '') + '. [Add the name, date of birth and NHS number from the record.]'],
      ['Date', dateText(today())]
    ] });

    /* The state of the current medicine (its latest decision), not any earlier "optimised". */
    var ms = medState(a), opt = ms.optimised ? ms.optReview : null;
    var flagged = Tx.latestFlags(a).some(function (x) { return x.level === 'urgent' || x.level === 'act'; });
    sec('Request').blocks.push({ p: ms.stopped
      ? '[' + stopText(ms) + ': do not send a shared care request.]'
      : 'Please share the care of ' + (yng ? 'this young person\'s' : 'this patient\'s') + ' ADHD medicine with us under the local shared care protocol.' +
        (opt ? ' The dose was optimised' + (opt.date ? ' on ' + dateText(opt.date) : '') + ' and is stable.'
          : ms.held ? ' [The dose was marked optimised, but that review raised flags that need action: resolve them before sending.]'
          : ' [Titration is not recorded as complete: confirm the dose is stable before sending.]') +
        (flagged ? ' [The latest review raised flags that need action: resolve them before sending.]' : '') +
        ' Please reply within 14 days if you can. Shared care is voluntary, and we will keep prescribing until you agree.' });

    var P = presentationOf(a), dx = [];
    dx.push(['Diagnosis', P ? 'ADHD, ' + lc(P.label) + ' (DSM-5-TR / ICD-10-CM ' + P.dsm + '; ICD-11 ' + P.icd11 + ')' + (f.severity ? ', ' + f.severity : '') : '[Diagnosis]']);
    if (pt.date) dx.push(['Assessed', dateText(pt.date)]);
    if (textOrNone(f.comorbid)) dx.push(['Co-occurring conditions', f.comorbid]);
    dx.push(['Reason for treatment', '[Main areas of impairment and the goals of treatment]']);
    if (textOrNone(ch.why)) dx.push(['Choice of medicine', ch.why]);
    sec('Diagnosis and reason for treatment').blocks.push({ kv: dx });

    /* The dose and the prescription wording come from one source (doseNow). */
    var med = [], dnL = doseNow(a), dose = dnL.dose, rx = p ? rxTextOf(a) : { lines: [] };
    med.push(['Medicine', d ? d.name + ', ' + lc(d.cls) : '[Medicine]']);
    med.push(['Product (prescribe by this name)', p ? p.name + ' (' + lc(p.form) + ')' : '[Brand and form]']);
    med.push(['Dose and timing', dnL.stopped ? dnL.reason : dose !== null ? fmt(dose) + ' mg a day' + (textOrNone(ch.times) ? ', ' + ch.times : '') : '[Dose and timing]']);
    if (rx.lines.length) med.push(['Prescription wording', rx.lines.join(' ')]);
    if (ch.startDate) med.push(['Started', dateText(ch.startDate)]);
    if (d) med.push(['Legal status', d.cd]);
    if (p) med.push(['Licence', licenceLine(Tx.licence(a, p), 'Licensed for this use')]);
    sec('Medicine').blocks.push({ kv: med });

    var b = obj(t.baseline);
    function cell(key, src) {
      if (src === 'base') {
        var v = key === 'bp' ? baseBp(a, b) : num(b[key]);
        if (v === null) return '-';
        /* With a raised clinic reading, the ambulatory or home result shows whether hypertension was confirmed. */
        return measureText(key, v) + (key === 'bp' && clinicBp(a, b) ? (bpOf(obj(b.repeat3)) ? ' (the lower of the last 2 of 3 readings)' : ' (the lower of 2 readings)') : '') +
          (key === 'bp' && b.abpm ? '; ABPM or HBPM: ' + lc(labelOf(ABPM, b.abpm)) : '');
      }
      var m = latestMeasure(a, key);
      return m && m.from === 'review' ? measureText(key, m.v) + (m.date ? ' (' + dateText(m.date) + ')' : '') : '-';
    }
    sec('Measurements').blocks.push({ table: { head: ['Measure', 'Before treatment' + (b.date ? ' (' + dateText(b.date) + ')' : ''), 'Latest'], rows: [
      ['Height', cell('heightCm', 'base'), cell('heightCm')],
      ['Weight', cell('weightKg', 'base'), cell('weightKg')],
      ['Pulse', cell('pulse', 'base'), cell('pulse')],
      ['Blood pressure', cell('bp', 'base'), cell('bp')]
    ] } });

    var monSec = sec('Monitoring: what, how often and when'), plan = gpPlan(a);
    if (plan.length) monSec.blocks.push({ table: { head: ['What', 'How often', 'Next due'], rows: plan.map(function (x) { return [x.what, x.freq || '-', x.due ? dateText(x.due) : '-']; }) } });
    monSec.blocks.push({ kv: [['Next specialist review', mon.nextReview ? dateText(mon.nextReview) : '[Date]'], ['Who does each check', '[Agree who records each measurement and how results reach us]']] });
    var keptBy = Tx.monitorPlan(a).filter(function (x) { return x && x.specialistOnly === true && x.id !== 'annual' && !/annual|time off|trial off/i.test(String(x.what || '')); }).map(function (x) { return String(x.what || '').replace(/\?$/, ''); });
    monSec.blocks.push({ p: 'The specialist team keeps the annual review and any planned trial off medicine' + (keptBy.length ? ', and these checks: ' + keptBy.join('; ') : '') + '.' });

    var acts = actionsFor(a).map(function (x) { return stripClauses(x.t + ': ' + x.do); });
    if (acts.length) sec('What to do if a result is abnormal').blocks.push({ list: acts });

    var hbAll = arr(monitorData().handback).filter(function (x) { return x && x.id; }), hb = obj(mon.handback);
    var hbTicked = hbAll.filter(function (x) { return hb[x.id]; });
    var hbList = (hbTicked.length ? hbTicked : hbAll).map(function (x) { return x.t; });
    if (hbList.length) sec('When to hand care back to us').blocks.push({ list: hbList });

    sec('Contacts').blocks.push({ kv: [
      ['Specialist team', '[Name, phone and secure email]'],
      ['Urgent advice', '[How to reach us in working hours, and out of hours]']
    ] });
    return { title: title, sections: S, foot: 'Draft prepared on ' + dateText(today()) + '. Check every line, fill in the parts in square brackets and add the patient\'s identifiers before sending.' };
  };

  function letterText(model) {
    var out = [String(model.title || '').toUpperCase(), ''];
    arr(model.sections).forEach(function (s) {
      out.push(String(s.title).toUpperCase());
      arr(s.blocks).forEach(function (b) {
        if (b.p !== undefined) out.push(b.p);
        else if (b.list) b.list.forEach(function (x) { out.push('- ' + x); });
        else if (b.kv) b.kv.forEach(function (r) { out.push(r[0] + ': ' + r[1]); });
        else if (b.table) { out.push(b.table.head.join(' | ')); b.table.rows.forEach(function (r) { out.push(r.join(' | ')); }); }
      });
      out.push('');
    });
    if (model.foot) out.push(model.foot);
    return out.join('\n');
  }
  function letterNode(model) {
    var box = h('article', { class: 'report tx-letter', 'aria-label': model.title || 'Letter' }, h('p', { class: 'tx-letter-title' }, model.title || ''));
    arr(model.sections).forEach(function (s) {
      box.appendChild(h('h3', null, s.title));
      arr(s.blocks).forEach(function (b) {
        if (b.p !== undefined) box.appendChild(h('p', null, b.p));
        else if (b.list) box.appendChild(h('ul', null, b.list.map(function (x) { return h('li', null, x); })));
        else if (b.kv) box.appendChild(h('dl', { class: 'tx-kv' }, b.kv.map(function (r) { return h('div', null, h('dt', null, r[0]), h('dd', null, r[1])); })));
        else if (b.table) box.appendChild(stackTable(b.table.head, b.table.rows, 'tx-ltable'));
      });
    });
    if (model.foot) box.appendChild(h('p', { class: 'tx-letter-foot' }, model.foot));
    return box;
  }
  AA.components.sharedCareLetter.text = letterText;
})(window.AA);
