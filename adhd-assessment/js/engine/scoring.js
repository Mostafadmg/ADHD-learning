/* Questionnaire scoring. Pure functions: no DOM, no store. Tested in tests/engine.test.js.
   A tool definition (see ARCHITECTURE.md, "Tool") carries its items, options and a scoring block.
   score(tool, answers) returns:
   { complete, answered, total, max, band, sev, positive, subscales:[], flags:[], lines:[], method } */
(function (AA) {
  'use strict';
  var S = AA.scoring = {};

  function optsFor(tool, item) { return item.opts || tool.options || []; }
  function num(v) { return typeof v === 'number' && !isNaN(v) ? v : null; }

  /* Value of an answer for scoring. Answers store the option value; items may remap
     with item.score (object keyed by option value) for keyed or weighted items. */
  function valueOf(item, raw) {
    if (raw === null || raw === undefined || raw === '') return null;
    if (item.score && Object.prototype.hasOwnProperty.call(item.score, String(raw))) return item.score[String(raw)];
    if (item.reverse && item.max != null && typeof raw === 'number') return item.max - raw;
    return typeof raw === 'number' ? raw : (raw === true ? 1 : raw === false ? 0 : null);
  }
  S.valueOf = valueOf;

  function scored(tool) { return (tool.items || []).filter(function (it) { return !it.unscored; }); }

  function band(bands, total) {
    if (!bands || total === null) return null;
    for (var i = 0; i < bands.length; i++) {
      var b = bands[i];
      if (total >= b.min && (b.max === undefined || b.max === null || total <= b.max)) return b;
    }
    return null;
  }

  function maxFor(tool, item) {
    if (item.score) return Math.max.apply(null, Object.keys(item.score).map(function (k) { return item.score[k]; }));
    var o = optsFor(tool, item).map(function (x) { return x.v; }).filter(function (v) { return typeof v === 'number'; });
    return o.length ? Math.max.apply(null, o) : 1;
  }

  function flagsFor(tool, answers) {
    var out = [];
    ((tool.scoring && tool.scoring.flags) || []).forEach(function (f) {
      var it = (tool.items || []).filter(function (x) { return x.n === f.item; })[0];
      if (!it) return;
      var raw = answers[f.item];
      var v = valueOf(it, raw);
      var hit = f.equals !== undefined ? raw === f.equals : (v !== null && v >= (f.min === undefined ? 1 : f.min));
      if (hit) out.push({ level: f.level || 'warn', text: f.text, item: f.item });
    });
    return out;
  }

  function subscales(tool, answers) {
    return ((tool.scoring && tool.scoring.subscales) || []).map(function (s) {
      var tot = 0, n = 0, max = 0;
      s.items.forEach(function (num_) {
        var it = (tool.items || []).filter(function (x) { return x.n === num_; })[0];
        if (!it) return;
        max += maxFor(tool, it);
        var v = valueOf(it, answers[num_]);
        if (v !== null) { tot += v; n++; }
      });
      var r = { id: s.id, label: s.label, total: tot, answered: n, of: s.items.length, max: max };
      if (s.cutoff !== undefined) r.positive = n === s.items.length ? tot >= s.cutoff : null;
      if (s.bands) { var b = band(s.bands, n === s.items.length ? tot : null); r.band = b ? b.label : null; r.sev = b ? b.sev : null; }
      return r;
    });
  }

  /* ---------- methods ---------- */
  var M = {};

  /* Sum of item values. scoring: {bands, cutoff:{value, text}, flags, subscales} */
  M.sum = function (tool, answers) {
    var items = scored(tool), total = 0, answered = 0, max = 0;
    items.forEach(function (it) {
      max += maxFor(tool, it);
      var v = valueOf(it, answers[it.n]);
      if (v !== null) { total += v; answered++; }
    });
    var complete = answered === items.length;
    var sc = tool.scoring || {};
    var b = complete ? band(sc.bands, total) : null;
    var r = { complete: complete, answered: answered, of: items.length, total: total, max: max, band: b ? b.label : null, sev: b ? b.sev : null };
    if (sc.cutoff) r.positive = complete ? total >= sc.cutoff.value : null;
    return r;
  };

  /* Count of items whose scored value is 1 (yes / keyed answer). Same options as sum. */
  M.count = M.sum;

  /* ASRS v1.1: each item has item.threshold (lowest option value that falls in the shaded box).
     Part A = items with item.part === 'A'. Part A positive when shaded count >= scoring.partA (default 4). */
  M.asrs18 = function (tool, answers) {
    var base = M.sum(tool, answers);
    var aShaded = 0, bShaded = 0, aAnswered = 0, aCount = 0;
    (tool.items || []).forEach(function (it) {
      var raw = answers[it.n];
      var isA = it.part === 'A';
      if (isA) aCount++;
      if (raw === null || raw === undefined) return;
      if (isA) aAnswered++;
      if (it.threshold !== undefined && raw >= it.threshold) { if (isA) aShaded++; else bShaded++; }
    });
    var need = (tool.scoring && tool.scoring.partA) || 4;
    base.partA = { shaded: aShaded, of: aCount, complete: aAnswered === aCount, need: need };
    base.partB = { shaded: bShaded };
    base.positive = aAnswered === aCount ? aShaded >= need : null;
    base.band = base.positive === null ? null : base.positive ? 'Part A screen positive' : 'Part A screen negative';
    base.sev = base.positive ? 2 : base.positive === false ? 0 : null;
    return base;
  };

  /* WFIRS-S style: options 0-3 plus 'na' (not applicable, excluded).
     scoring.domains: [{id,label,items:[n...]}]; a domain is impaired when it has
     >= scoring.rule.twos items scored 2+ or >= scoring.rule.threes items scored 3 (default 2 and 1),
     or its mean is >= scoring.rule.mean (if given). */
  M.wfirs = function (tool, answers) {
    var rule = (tool.scoring && tool.scoring.rule) || { twos: 2, threes: 1 };
    var doms = ((tool.scoring && tool.scoring.domains) || []).map(function (d) {
      var sum = 0, n = 0, twos = 0, threes = 0, na = 0, blank = 0;
      d.items.forEach(function (k) {
        var raw = answers[k];
        if (raw === 'na') { na++; return; }
        if (raw === null || raw === undefined) { blank++; return; }
        sum += raw; n++;
        if (raw >= 2) twos++;
        if (raw >= 3) threes++;
      });
      var mean = n ? sum / n : null;
      var impaired = twos >= rule.twos || threes >= rule.threes || (rule.mean !== undefined && mean !== null && mean >= rule.mean);
      return { id: d.id, label: d.label, mean: mean, answered: n, na: na, blank: blank, of: d.items.length, twos: twos, threes: threes, impaired: n ? impaired : null };
    });
    var answered = 0, total = 0, n = 0;
    (tool.items || []).forEach(function (it) {
      var raw = answers[it.n];
      if (raw !== null && raw !== undefined) answered++;
      if (typeof raw === 'number') { total += raw; n++; }
    });
    var impairedCount = doms.filter(function (d) { return d.impaired; }).length;
    return {
      complete: answered === (tool.items || []).length, answered: answered, of: (tool.items || []).length,
      total: total, max: n * 3, mean: n ? total / n : null, domains: doms, impairedDomains: impairedCount,
      positive: answered ? impairedCount >= 2 : null,
      band: answered ? (impairedCount + ' of ' + doms.length + ' domains impaired') : null,
      sev: !answered ? null : impairedCount >= 4 ? 3 : impairedCount >= 2 ? 2 : impairedCount === 1 ? 1 : 0
    };
  };

  /* MDQ: part 1 items (part:'1') yes=1; item with part:'2' (several at the same time) yes/no;
     item with part:'3' graded impact (0 none, 1 minor, 2 moderate, 3 serious).
     Positive: part1 >= scoring.part1 (default 7) AND part2 yes AND part3 >= 2. */
  M.mdq = function (tool, answers) {
    var p1 = 0, p1n = 0, p1of = 0, p2 = null, p3 = null;
    (tool.items || []).forEach(function (it) {
      var raw = answers[it.n];
      if (it.part === '1') { p1of++; if (raw !== null && raw !== undefined) { p1n++; if (raw === 1 || raw === true) p1++; } }
      else if (it.part === '2') p2 = raw === undefined ? null : raw;
      else if (it.part === '3') p3 = raw === undefined ? null : raw;
    });
    var need = (tool.scoring && tool.scoring.part1) || 7;
    var complete = p1n === p1of && p2 !== null && p3 !== null;
    var positive = complete ? (p1 >= need && (p2 === 1 || p2 === true) && p3 >= 2) : null;
    return {
      complete: complete, answered: p1n + (p2 !== null ? 1 : 0) + (p3 !== null ? 1 : 0), of: p1of + 2,
      total: p1, max: p1of, part1: p1, part2: p2, part3: p3, positive: positive,
      band: positive === null ? null : positive ? 'Positive screen' : 'Negative screen', sev: positive ? 2 : positive === false ? 0 : null
    };
  };

  /* PCL-5: sum 0-80 plus a DSM-5 provisional cluster check (item rated 2+ counts as endorsed):
     B >= 1 (items in cluster B), C >= 1, D >= 2, E >= 2. scoring.clusters: {B:[..],C:[..],D:[..],E:[..]} */
  M.pcl5 = function (tool, answers) {
    var r = M.sum(tool, answers);
    var cl = (tool.scoring && tool.scoring.clusters) || {};
    var need = { B: 1, C: 1, D: 2, E: 2 };
    var res = {}, all = true;
    Object.keys(need).forEach(function (k) {
      var c = (cl[k] || []).filter(function (n) { return typeof answers[n] === 'number' && answers[n] >= 2; }).length;
      res[k] = { endorsed: c, need: need[k], met: c >= need[k] };
      if (!res[k].met) all = false;
    });
    r.clusters = res;
    r.dsmPattern = r.complete ? all : null;
    return r;
  };

  /* C-SSRS screen (or any rule-based triage): scoring.levels [{level:'high', any:[n...], text}] checked in order;
     an item counts when answered yes (1/true). */
  M.triage = function (tool, answers) {
    var answered = 0;
    (tool.items || []).forEach(function (it) { if (answers[it.n] !== null && answers[it.n] !== undefined) answered++; });
    var hit = null;
    ((tool.scoring && tool.scoring.levels) || []).some(function (lv) {
      var yes = (lv.any || []).some(function (n) { return answers[n] === 1 || answers[n] === true; });
      if (yes) { hit = lv; return true; }
      return false;
    });
    return {
      complete: answered === (tool.items || []).length, answered: answered, of: (tool.items || []).length,
      total: null, max: null, positive: hit ? true : (answered ? false : null),
      band: hit ? hit.label : (answered ? 'No risk items endorsed' : null), sev: hit ? hit.sev : (answered ? 0 : null),
      action: hit ? hit.text : null
    };
  };

  S.methods = M;

  /* Main entry. answers: {itemNumber: value}. */
  S.score = function (tool, answers) {
    answers = answers || {};
    var method = (tool.scoring && tool.scoring.method) || 'sum';
    var fn = M[method] || M.sum;
    var r = fn(tool, answers);
    r.method = method;
    r.flags = flagsFor(tool, answers);
    r.subscales = subscales(tool, answers);
    r.lines = summaryLines(tool, r);
    return r;
  };

  function summaryLines(tool, r) {
    var out = [];
    if (r.method === 'asrs18') {
      out.push('Part A: ' + r.partA.shaded + ' of ' + r.partA.of + ' in the shaded range (screen positive at ' + r.partA.need + '+).');
      out.push('Part B: ' + r.partB.shaded + ' item(s) in the shaded range.');
    } else if (r.method === 'wfirs') {
      out.push(r.impairedDomains + ' domain(s) meet the impairment rule.');
    } else if (r.method === 'mdq') {
      out.push('Part 1: ' + r.part1 + ' of ' + r.max + ' yes; same period: ' + (r.part2 === 1 ? 'yes' : r.part2 === 0 ? 'no' : '-') + '; problem level: ' + (r.part3 === null ? '-' : ['none', 'minor', 'moderate', 'serious'][r.part3]) + '.');
    } else if (r.method === 'triage') {
      if (r.action) out.push(r.action);
    } else if (r.total !== null) {
      out.push('Total ' + r.total + ' / ' + r.max + (r.band ? ' (' + r.band + ')' : '') + '.');
    }
    if (!r.complete && r.method !== 'wfirs') out.push((r.of - r.answered) + ' item(s) unanswered; the result is provisional.');
    return out;
  }

  /* Convenience: score a tool by id from an assessment record. */
  S.forAssessment = function (a, toolId) {
    var tool = AA.byId('tools', toolId);
    if (!tool || !tool.items || !tool.items.length) return null;
    var t = a && a.tools && a.tools[toolId];
    if (!t || !t.answers || !Object.keys(t.answers).length) return null;
    return S.score(tool, t.answers);
  };
})(typeof window !== 'undefined' ? window.AA : globalThis.AA);
