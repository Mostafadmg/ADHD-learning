/* Module 5 medicine lab: one engine for every per-medicine graph and conversion tool.
   Each medicine registers a definition with M5LAB.add(id, def) (files js/m5-lab-<medicine>.js); a lesson shows it with an
   empty <div data-ml="<id>"></div>. The engine draws the tabs, controls, chart and results; the data files hold the facts.
   Curves come from the shared release model (js/release-model.js, window.RELMODEL), so they match the release
   explorer (lesson 3) and the day builder (lesson 4). Heights are RELATIVE (schematic), never blood levels.

   DEFINITION
   { title: 'optional heading', note: 'optional footer text (default: the schematic warning)',
     tabs: [ TAB, ... ] }                       one tab = one thing at a time

   TAB kind 'day' (pick a product or regimen, see one day, tap or drag across it)
   { kind:'day', label:'Through the day',
     x:{from:6,to:22,tick:3,fmt:'clock'},        fmt: 'clock' | 'day' (multi-day, hours from 0) | 'hours'
     doseAt:7.5, doseTimes:[6.5,7,7.5,8,8.5,9],  doseTimes omitted = no "dose time" control
     bedtime:21, bands:[{from:8.75,to:15.25,label:'School',tone:'blue'|'amber'}],
     picks:[ { id, chip, tag, color:'#0b6664', tint:'#e3f4f3', name,
               regimen:[{model:'oros',at:0,mg:1}],           at = hours after the first dose; mg = weight (default 1)
               series:[{label,model,color,dashed,mg,at}],    optional: several named curves instead of one total
               lasts:12, lastsTxt:'about 12 hours',         from the product information, drawn as a bar
               inside:'text', moments:[{t:'Peak at 6-8 h',d:'text',h:6.8} | {t,d,end:true}],
               practice:['text'], note:'text', toggle:{label:'Add a lunchtime dose',regimen:[{model:'ir',at:4.5}]} } ],
     compare:true }                              adds a "Compare with" select

   TAB kind 'tool' (fields in, answer and chart out; used for conversions and calculators)
   { kind:'tool', label:'Convert', intro:'text',
     fields:[ { id, type:'select'|'seg'|'step'|'range', label, value, options:[{v,l}] | function(vals),
                min,max,step,unit, show:function(vals) } ],
     swap:['from','to'],                         adds a swap button between the two fields
     compute:function(v){ return { tone:'ok'|'info'|'warn'|'stop', badge:'SmPC table', head:'text',
        rows:[{h:'What to prescribe',t:'text'}], notes:['text'], src:'text',
        chart:{ kind:'day', x, bedtime, bands, series:[{label,color,tint,dashed,doses:[{model,at,mg}]}], moments:[{h,t}] }
              | { kind:'weeks', x:{from:0,to:8,unit:'week'}, y:{max:100,label:'mg a day'},
                  steps:[{a:0,b:1,v:10,label:'Week 1'}], effect:[[0,0],[4,60]], effectLabel:'Effect (schematic)',
                  marks:[{x:4,t:'Review'}] } } } }

   Chart text uses plain strings (escaped here). rows/notes/head/intro/src accept limited HTML (<b>, <em>, <br>): write
   only trusted text there. */
(function () {
  'use strict';
  var RM = window.RELMODEL;
  if (!RM) return;
  var STEP = 0.1;
  var NOTE = 'Schematic: shapes follow the timings in the product information. Heights are relative, not blood levels, and real responses vary.';
  /* Mount at once (elements above the script already exist) and again when the page has loaded (any that come later). */
  var LAB = window.M5LAB = { defs: {}, add: function (id, def) {
    LAB.defs[id] = def; mount(id);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { mount(id); });
  } };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function clock(h) { var m = Math.round(((h % 24) + 24) % 24 * 60); return pad(Math.floor(m / 60) % 24) + ':' + pad(m % 60); }
  function hrs(h) { var m = Math.round(h * 60), hh = Math.floor(m / 60), mm = m % 60; return hh ? hh + ' h' + (mm ? ' ' + mm + ' min' : '') : mm + ' min'; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function fmtX(h, f) {
    if (f === 'hours') return Math.round(h) + ' h';
    if (f === 'day') return h % 24 === 0 ? 'Day ' + (h / 24 + 1) : clock(h);
    return clock(h);
  }

  /* ---------- curves: unit-area copies of the model curves, so a level is "mg × shape" ---------- */
  var NC = {};
  function norm(model, span) {
    var id = model + '|' + span;
    if (NC[id]) return NC[id];
    var raw = RM.curve(model, null, span);
    if (!raw) return (NC[id] = new Float64Array(0));
    var a = 0, i; for (i = 0; i < raw.length; i++) a += raw[i] * RM.DT;
    var out = new Float64Array(raw.length); for (i = 0; i < raw.length; i++) out[i] = a ? raw[i] / a : 0;
    return (NC[id] = out);
  }
  function levelAt(doses, h, span) {
    var s = 0;
    doses.forEach(function (d) {
      var n = norm(d.model, span), k = Math.round((h - d.at) / RM.DT);
      if (k >= 0 && k < n.length) s += (d.mg == null ? 1 : d.mg) * n[k];
    });
    return s;
  }
  /* Every series sampled every STEP hours across x, then divided by the highest value shown (so the top of the chart is 1). */
  function sample(series, x) {
    var span = Math.ceil(x.to) + 2, t = [], h, out = series.map(function () { return []; }), top = 0;
    for (h = x.from; h <= x.to + 1e-9; h += STEP) {
      t.push(+h.toFixed(2));
      series.forEach(function (s, j) { var v = levelAt(s.doses, h, span); out[j].push(v); if (v > top) top = v; });
    }
    if (top > 0) out.forEach(function (a) { for (var i = 0; i < a.length; i++) a[i] /= top; });
    return { t: t, v: out, top: top };
  }
  function peakAt(S) { var a = S.data.v[0], k = 0; for (var i = 1; i < a.length; i++) if (a[i] > a[k]) k = i; return S.data.t[k]; }
  function idxOf(S, h) { return clamp(Math.round((h - S.x.from) / STEP), 0, Math.round((S.x.to - S.x.from) / STEP)); }

  /* ---------- the chart: one controller per chart box (draw, time cursor, resize) ---------- */
  function Chart(host, onMoment, onCursor) {
    var C = { spec: null, cur: null, drag: false, mo: -1 };
    host.innerHTML = '<div class="ml-chart" tabindex="0"><svg class="ml-svg" role="img"></svg></div><div class="ml-leg"></div>';
    var wrap = host.firstChild, svg = wrap.firstChild, leg = host.lastChild;
    C.wrap = wrap;

    function geom(W, S) {
      var narrow = W < 460;
      return { W: W, H: narrow ? 236 : 292, ML: 22, MR: 22, PT: S.bands && S.bands.length ? 30 : 16, PB: S.lasts ? 58 : 32 };
    }
    function drawDay() {
      var S = C.spec, W = Math.max(250, wrap.clientWidth || 300), g = geom(W, S), PH = g.H - g.PT - g.PB, PW = W - g.ML - g.MR;
      var d = S.data || (S.data = sample(S.series, S.x)), base = g.PT + PH, s = '', i;
      function X(h) { return g.ML + (h - S.x.from) / (S.x.to - S.x.from) * PW; }
      function Y(v) { return g.PT + (1 - Math.min(v, 1.1) / 1.1) * PH; }
      C.X = X; C.g = g; C.PW = PW;
      (S.bands || []).forEach(function (b) {
        var tone = b.tone === 'amber' ? ['#fbf1da', '#8a5a00'] : ['#e9f0f7', '#4d6680'];
        var x0 = X(Math.max(b.from, S.x.from)), x1 = X(Math.min(b.to, S.x.to));
        if (x1 <= x0) return;
        s += '<rect x="' + x0 + '" y="' + (g.PT - 14) + '" width="' + (x1 - x0) + '" height="' + (base - g.PT + 14) + '" fill="' + tone[0] + '"/>';
        s += '<text x="' + (x0 + x1) / 2 + '" y="' + (g.PT - 3) + '" class="ml-bl" fill="' + tone[1] + '">' + esc(b.label) + '</text>';
      });
      var tick = S.x.tick || 3, nt = (S.x.to - S.x.from) / tick;
      while (PW / nt < 46 && tick < 24) { tick *= 2; nt = (S.x.to - S.x.from) / tick; }
      var t0 = Math.ceil(S.x.from / tick) * tick;
      for (var a = t0; a <= S.x.to + 1e-9; a += tick) {
        s += '<line x1="' + X(a) + '" x2="' + X(a) + '" y1="' + g.PT + '" y2="' + base + '" stroke="#dfe6ee" stroke-dasharray="2 4"/>';
      }
      if (S.bedtime != null && S.bedtime <= S.x.to) {
        s += '<line x1="' + X(S.bedtime) + '" x2="' + X(S.bedtime) + '" y1="' + g.PT + '" y2="' + base + '" stroke="#6b4fa3" stroke-width="1.5" stroke-dasharray="3 3"/>';
        s += '<text x="' + (X(S.bedtime) - 4) + '" y="' + (g.PT + 11) + '" class="ml-dl" fill="#6b4fa3" text-anchor="end">Bed</text>';
      }
      (S.doseMarks || []).forEach(function (h, k) {
        if (h < S.x.from || h > S.x.to) return;
        s += '<line x1="' + X(h) + '" x2="' + X(h) + '" y1="' + (g.PT - 2) + '" y2="' + base + '" stroke="#16324f" stroke-width="1.5" stroke-dasharray="4 3"/>';
        if (k < 3) s += '<text x="' + (X(h) + 4) + '" y="' + (g.PT + 11) + '" class="ml-dl">' + (S.doseMarks.length > 1 ? 'Dose ' + (k + 1) : 'Dose') + '</text>';
      });
      function line(arr) { var o = ''; for (var j = 0; j < d.t.length; j++) o += (j ? 'L' : 'M') + X(d.t[j]).toFixed(1) + ' ' + Y(arr[j]).toFixed(1); return o; }
      function area(arr) { var o = line(arr); for (var j = d.t.length - 1; j >= 0; j--) o += 'L' + X(d.t[j]).toFixed(1) + ' ' + base; return o + 'Z'; }
      S.series.forEach(function (sr, j) {
        if (j === 0 && sr.fill !== false) s += '<path d="' + area(d.v[j]) + '" fill="' + (sr.tint || sr.color) + '" opacity="' + (S.series.length > 1 ? '.55' : '.9') + '"/>';
      });
      S.series.forEach(function (sr, j) {
        s += '<path d="' + line(d.v[j]) + '" fill="none" stroke="' + sr.color + '" stroke-width="' + (sr.dashed ? 2.2 : 2.6) + '" stroke-linejoin="round"' + (sr.dashed ? ' stroke-dasharray="6 4"' : '') + '/>';
      });
      /* time cursor */
      if (C.cur != null) {
        var ci = idxOf(S, C.cur);
        s += '<line class="ml-cur" x1="' + X(C.cur) + '" x2="' + X(C.cur) + '" y1="' + (g.PT - 2) + '" y2="' + base + '"/>';
        S.series.forEach(function (sr, j) { s += '<circle cx="' + X(C.cur) + '" cy="' + Y(d.v[j][ci]) + '" r="4.5" fill="#fff" stroke="' + sr.color + '" stroke-width="2.5"/>'; });
      }
      /* numbered moments */
      (S.moments || []).forEach(function (m, k) {
        var h = clamp(m.h, S.x.from, S.x.to), v = d.v[0][idxOf(S, h)], on = k === C.mo, cy = Math.max(g.PT + 6, Y(v) - (m.end ? 0 : 17));
        s += '<g class="ml-mk' + (on ? ' on' : '') + '" data-m="' + k + '"><circle cx="' + X(h) + '" cy="' + cy + '" r="' + (on ? 13 : 11) + '" fill="' + (on ? '#16324f' : '#fff') + '" stroke="' + (on ? '#16324f' : S.series[0].color) + '" stroke-width="2.5"/>' +
          '<text x="' + X(h) + '" y="' + (cy + 4.5) + '" class="ml-mn" fill="' + (on ? '#fff' : S.series[0].color) + '">' + (k + 1) + '</text></g>';
      });
      /* axis */
      s += '<line x1="' + g.ML + '" x2="' + (W - g.MR) + '" y1="' + base + '" y2="' + base + '" stroke="#9aa8b6" stroke-width="1.5"/>';
      for (var b2 = t0; b2 <= S.x.to + 1e-9; b2 += tick) s += '<text x="' + X(b2) + '" y="' + (base + 16) + '" class="ml-ax">' + fmtX(b2, S.x.fmt) + '</text>';
      /* how long it lasts: from the product information, not from the curve */
      if (S.lasts) {
        var by = base + 24, col = S.series[0].color, x0 = X(S.lasts.from), x1 = X(Math.min(S.x.to, S.lasts.to)), lab = S.lasts.label, tw = lab.length * 6.6;
        s += '<rect x="' + x0 + '" y="' + by + '" width="' + Math.max(2, x1 - x0) + '" height="15" rx="7.5" fill="' + col + '"/>';
        if (x1 - x0 >= tw + 16) s += '<text x="' + (x0 + 8) + '" y="' + (by + 11.5) + '" class="ml-ll ml-lli">' + esc(lab) + '</text>';
        else if (x1 + 8 + tw <= W - 2) s += '<text x="' + (x1 + 8) + '" y="' + (by + 11.5) + '" class="ml-ll">' + esc(lab) + '</text>';
        else s += '<text x="' + (x0 - 6) + '" y="' + (by + 11.5) + '" class="ml-ll" text-anchor="end">' + esc(lab) + '</text>';
      }
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + g.H); svg.setAttribute('width', W); svg.setAttribute('height', g.H);
      svg.innerHTML = '<title>' + esc(S.title || 'Chart') + '</title>' + s;
      bindMarks();
    }

    function drawWeeks() {
      var S = C.spec, W = Math.max(250, wrap.clientWidth || 300), g = { W: W, H: W < 460 ? 236 : 292, ML: 22, MR: 22, PT: 24, PB: 34 };
      var PH = g.H - g.PT - g.PB, PW = W - g.ML - g.MR, base = g.PT + PH, s = '', ymax = S.y.max;
      function X(w) { return g.ML + (w - S.x.from) / (S.x.to - S.x.from) * PW; }
      function Y(v) { return g.PT + (1 - Math.min(v, ymax) / ymax) * PH; }
      C.X = X; C.g = g; C.PW = PW;
      var span = S.x.to - S.x.from, tick = span > 12 ? 2 : 1;
      while (PW / (span / tick) < 28) tick *= 2;
      for (var a = S.x.from; a <= S.x.to + 1e-9; a += tick) s += '<line x1="' + X(a) + '" x2="' + X(a) + '" y1="' + g.PT + '" y2="' + base + '" stroke="#e5ebf1"/>';
      var col = S.color || '#0b6664', tint = S.tint || '#a3d5cf';
      (S.steps || []).forEach(function (st) {
        var x0 = X(st.a), x1 = X(st.b), y = Y(st.v);
        s += '<rect x="' + (x0 + 1) + '" y="' + y + '" width="' + Math.max(1, x1 - x0 - 2) + '" height="' + (base - y) + '" rx="4" fill="' + tint + '"/>';
        s += '<rect x="' + (x0 + 1) + '" y="' + y + '" width="' + Math.max(1, x1 - x0 - 2) + '" height="3" fill="' + col + '"/>';
        if (x1 - x0 > 30) s += '<text x="' + (x0 + x1) / 2 + '" y="' + (y - 5) + '" class="ml-wv" fill="' + col + '">' + esc(st.v) + '</text>';
      });
      if (S.effect && S.effect.length) {
        var d = '';
        S.effect.forEach(function (p, k) { d += (k ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + (g.PT + (1 - p[1] / 100) * PH).toFixed(1); });
        s += '<path d="' + d + '" fill="none" stroke="#a8432e" stroke-width="2.6" stroke-dasharray="6 4" stroke-linejoin="round"/>';
      }
      (S.marks || []).forEach(function (m, k) {
        var x = X(m.x), on = k === C.mo;
        s += '<g class="ml-mk' + (on ? ' on' : '') + '" data-m="' + k + '"><line x1="' + x + '" x2="' + x + '" y1="' + (g.PT - 4) + '" y2="' + base + '" stroke="#16324f" stroke-width="1.5" stroke-dasharray="4 3"/>' +
          '<circle cx="' + x + '" cy="' + (g.PT - 2) + '" r="' + (on ? 12 : 10) + '" fill="' + (on ? '#16324f' : '#fff') + '" stroke="#16324f" stroke-width="2.5"/>' +
          '<text x="' + x + '" y="' + (g.PT + 2) + '" class="ml-mn" fill="' + (on ? '#fff' : '#16324f') + '">' + (k + 1) + '</text></g>';
      });
      if (C.cur != null) s += '<line class="ml-cur" x1="' + X(C.cur) + '" x2="' + X(C.cur) + '" y1="' + g.PT + '" y2="' + base + '"/>';
      s += '<line x1="' + g.ML + '" x2="' + (W - g.MR) + '" y1="' + base + '" y2="' + base + '" stroke="#9aa8b6" stroke-width="1.5"/>';
      for (var b = S.x.from; b <= S.x.to + 1e-9; b += tick) s += '<text x="' + X(b) + '" y="' + (base + 16) + '" class="ml-ax">' + (S.x.unit === 'day' ? 'D' : 'W') + b + '</text>';
      s += '<text x="' + (W / 2) + '" y="' + (base + 30) + '" class="ml-ax ml-axt">' + esc(S.x.title || (S.x.unit === 'day' ? 'Day' : 'Week')) + '</text>';
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + g.H); svg.setAttribute('width', W); svg.setAttribute('height', g.H);
      svg.innerHTML = '<title>' + esc(S.title || 'Chart') + '</title>' + s;
      bindMarks();
    }
    function bindMarks() {
      Array.prototype.forEach.call(svg.querySelectorAll('.ml-mk'), function (el) {
        el.addEventListener('click', function (e) { e.stopPropagation(); if (onMoment) onMoment(+el.dataset.m); });
      });
    }
    function legend() {
      var S = C.spec, items = [];
      if (S.kind === 'weeks') {
        items.push('<span><i style="background:' + (S.tint || '#a3d5cf') + ';border-top:3px solid ' + (S.color || '#0b6664') + '"></i>' + esc(S.y.label || 'Dose') + '</span>');
        if (S.effect && S.effect.length) items.push('<span><i class="ml-dash" style="border-color:#a8432e"></i>' + esc(S.effectLabel || 'Effect (schematic)') + '</span>');
      } else {
        S.series.forEach(function (s) { items.push('<span><i class="' + (s.dashed ? 'ml-dash' : '') + '" style="' + (s.dashed ? 'border-color:' + s.color : 'background:' + s.color) + '"></i>' + esc(s.label) + '</span>'); });
      }
      leg.innerHTML = items.join('');
      leg.hidden = !items.length || (S.kind !== 'weeks' && S.series.length < 2 && !S.forceLegend);
    }
    C.draw = function () { if (!C.spec) return; if (C.spec.kind === 'weeks') drawWeeks(); else drawDay(); };
    C.set = function (spec, keepCursor) {
      C.spec = spec; C.mo = -1;
      if (spec.kind !== 'weeks' && !spec.data) spec.data = sample(spec.series, spec.x);
      if (!keepCursor || C.cur == null) C.cur = spec.cur != null ? spec.cur : (spec.kind === 'weeks' ? spec.x.from : peakAt(spec));
      legend(); C.draw();
    };
    C.cursor = function (h) {
      var S = C.spec; if (!S) return;
      C.cur = clamp(h, S.x.from, S.x.to); C.mo = -1; C.draw(); if (onCursor) onCursor(C.cur);
    };
    C.moment = function (k) { C.mo = k; C.draw(); };
    function fromX(clientX) {
      var r = svg.getBoundingClientRect(), x = (clientX - r.left) * (svg.viewBox.baseVal.width / r.width), S = C.spec;
      return S.x.from + (x - C.g.ML) / C.PW * (S.x.to - S.x.from);
    }
    function snap(v) { var S = C.spec; return S.kind === 'weeks' ? Math.round(v) : Math.round(v * 4) / 4; }
    svg.addEventListener('pointerdown', function (e) { C.drag = true; try { svg.setPointerCapture(e.pointerId); } catch (x) {} C.cursor(snap(fromX(e.clientX))); });
    svg.addEventListener('pointermove', function (e) { if (C.drag || e.pointerType === 'mouse') C.cursor(snap(fromX(e.clientX))); });
    svg.addEventListener('pointerup', function () { C.drag = false; });
    svg.addEventListener('pointercancel', function () { C.drag = false; });
    wrap.addEventListener('keydown', function (e) {
      var S = C.spec; if (!S) return;
      var big = S.kind === 'weeks' ? 1 : 1, small = S.kind === 'weeks' ? 1 : 0.25, d = { ArrowRight: small, ArrowLeft: -small, PageUp: big, PageDown: -big }[e.key];
      if (e.key === 'Home') d = S.x.from - (C.cur == null ? S.x.from : C.cur); if (e.key === 'End') d = S.x.to - (C.cur == null ? S.x.from : C.cur);
      if (d == null) return;
      e.preventDefault(); C.cursor((C.cur == null ? S.x.from : C.cur) + d);
    });
    if (window.ResizeObserver) { var lastW = 0; new ResizeObserver(function () { var w = wrap.clientWidth; if (w && w !== lastW) { lastW = w; C.draw(); } }).observe(wrap); }
    else window.addEventListener('resize', C.draw);
    return C;
  }

  /* ---------- the day tab ---------- */
  function buildDay(body, T) {
    var picks = T.picks, byId = {}, S = { k: picks[0].id, t0: T.doseAt == null ? 7.5 : T.doseAt, tg: false, cmp: '', mo: -1 };
    picks.forEach(function (p) { byId[p.id] = p; });
    body.innerHTML =
      (picks.length > 1 ? '<div class="ml-picks" role="group" aria-label="Choose one">' + picks.map(function (p) {
        return '<button type="button" class="ml-pick" data-k="' + esc(p.id) + '" aria-pressed="false" style="--c:' + p.color + ';--l:' + (p.tint || '#eef3f7') + '"><i aria-hidden="true"></i><b>' + p.chip + '</b>' + (p.tag ? '<small>' + esc(p.tag) + '</small>' : '') + '</button>';
      }).join('') + '</div>' : '') +
      '<div class="ml-chartbox"></div><div class="ml-read" aria-live="polite"></div>' +
      '<div class="ml-opts"></div><div class="ml-panel"></div>';
    var box = body.querySelector('.ml-chartbox'), read = body.querySelector('.ml-read'), opts = body.querySelector('.ml-opts'), panel = body.querySelector('.ml-panel');
    var chart = Chart(box, function (k) { S.mo = k; chart.moment(k); var m = moments()[k]; if (m) { chart.cursor(m.h); chart.mo = k; chart.draw(); } paintMoments(); }, function () { S.mo = -1; paintMoments(); readout(); });

    function pk() { return byId[S.k]; }
    function dosesOf(p, tg) {
      var base = p.regimen || [];
      var all = base.concat(tg && p.toggle ? p.toggle.regimen : []);
      return all.map(function (d) { return { model: d.model, at: S.t0 + d.at, mg: d.mg }; });
    }
    function moments() {
      var p = pk(); return (p.moments || []).map(function (m) {
        var h = m.end ? S.t0 + (p.lasts || 8) : S.t0 + m.h; return { t: m.t, d: m.d, h: h, end: !!m.end };
      });
    }
    function spec() {
      var p = pk(), tg = S.tg && p.toggle, series, x = T.x || { from: 6, to: 22, tick: 3 };
      if (p.series) series = p.series.map(function (s) { return { label: s.label, color: s.color || p.color, tint: s.tint, dashed: s.dashed, fill: s.fill, doses: [{ model: s.model, at: S.t0 + (s.at || 0), mg: s.mg }] }; });
      else series = [{ label: p.name || p.chip, color: p.color, tint: p.tint, doses: dosesOf(p, tg) }];
      if (S.cmp && S.cmp !== S.k && byId[S.cmp]) series.push({ label: byId[S.cmp].chip, color: '#16324f', dashed: true, doses: dosesOf(byId[S.cmp], false) });
      var marks = dosesOf(p, tg).map(function (d) { return d.at; }).filter(function (h, i, a) { return a.indexOf(h) === i; });
      var lasts = p.lasts ? { from: S.t0, to: S.t0 + p.lasts, label: 'Lasts ' + (p.lastsTxt || 'about ' + p.lasts + ' h').replace(/^about /, 'about ') } : null;
      return { kind: 'day', x: x, bands: T.bands, bedtime: T.bedtime, series: series, doseMarks: tg ? marks : [S.t0], moments: moments(), lasts: lasts,
        title: (p.name || p.chip) + ': one day. ' + (p.moments || []).map(function (m) { return m.t; }).join('; ') + '.', cur: clamp(S.t0 + 1.5, x.from, x.to) };
    }
    function paintMoments() {
      Array.prototype.forEach.call(panel.querySelectorAll('[data-m]'), function (b) { var on = +b.dataset.m === S.mo; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    }
    function renderPanel() {
      var p = pk(), ms = p.moments || [];
      panel.style.setProperty('--c', p.color);
      panel.innerHTML =
        '<header class="ml-ph"><h4>' + esc(p.name || p.chip) + '</h4>' + (p.lastsTxt ? '<p>Lasts <b>' + esc(p.lastsTxt) + '</b></p>' : '') + '</header>' +
        (p.inside ? '<section class="ml-sec"><h5>What is inside</h5>' + (p.split ? splitBar(p) : '') + '<p>' + p.inside + '</p></section>' : '') +
        (ms.length ? '<section class="ml-sec"><h5>Through the day</h5><ol class="ml-mo">' + ms.map(function (m, i) {
          return '<li><button type="button" data-m="' + i + '" aria-pressed="false"><span class="ml-n">' + (i + 1) + '</span><span><b>' + esc(m.t) + '</b>' + (m.d ? m.d : '') + '</span></button></li>';
        }).join('') + '</ol></section>' : '') +
        ((p.practice && p.practice.length) ? '<section class="ml-sec"><h5>In practice</h5><ul class="ml-pr">' + p.practice.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' + (p.note ? '<p class="ml-br">' + p.note + '</p>' : '') + '</section>' : (p.note ? '<section class="ml-sec"><p class="ml-br">' + p.note + '</p></section>' : ''));
      Array.prototype.forEach.call(panel.querySelectorAll('[data-m]'), function (b) { b.addEventListener('click', function () { var i = +b.dataset.m, m = moments()[i]; S.mo = i; chart.cur = clamp(m.h, chart.spec.x.from, chart.spec.x.to); chart.mo = i; chart.draw(); paintMoments(); readout(); }); });
    }
    function splitBar(p) {
      return '<div class="ml-split" role="img" aria-label="' + p.split[0] + '% released at once, ' + p.split[1] + '% released later"><span style="width:' + p.split[0] + '%;background:' + p.color + '">' + p.split[0] + '%</span>' +
        (p.split[1] ? '<span style="width:' + p.split[1] + '%;background:' + (p.tint || '#cfe') + ';color:#16324f">' + p.split[1] + '%</span>' : '') + '</div>' +
        '<p class="ml-splitk"><span><i style="background:' + p.color + '"></i>At once</span>' + (p.split[1] ? '<span><i style="background:' + (p.tint || '#cfe') + '"></i>Later</span>' : '') + '</p>';
    }
    function renderOpts() {
      var p = pk(), h = '';
      if (T.doseTimes && T.doseTimes.length > 1) h += '<label class="ml-lbl">First dose at <select class="ml-dt">' + T.doseTimes.map(function (t) { return '<option value="' + t + '"' + (t === S.t0 ? ' selected' : '') + '>' + clock(t) + '</option>'; }).join('') + '</select></label>';
      if (p.toggle) h += '<label class="ml-tg"><input type="checkbox" class="ml-tgc"' + (S.tg ? ' checked' : '') + '> ' + esc(p.toggle.label) + '</label>';
      if (T.compare && picks.length > 1) h += '<label class="ml-lbl">Compare with <select class="ml-cmp"><option value="">Nothing</option>' + picks.map(function (o) { return o.id === S.k ? '' : '<option value="' + esc(o.id) + '"' + (o.id === S.cmp ? ' selected' : '') + '>' + esc(o.chip.replace(/&shy;|­/g, '')) + '</option>'; }).join('') + '</select></label>';
      opts.innerHTML = h; opts.hidden = !h;
      var dt = opts.querySelector('.ml-dt'), tg = opts.querySelector('.ml-tgc'), cm = opts.querySelector('.ml-cmp');
      if (dt) dt.addEventListener('change', function () { S.t0 = +dt.value; redraw(true); });
      if (tg) tg.addEventListener('change', function () { S.tg = tg.checked; renderPanel(); redraw(true); });
      if (cm) cm.addEventListener('change', function () { S.cmp = cm.value; redraw(true); });
    }
    function readout() {
      var sp = chart.spec, d = sp.data, h = chart.cur, i = idxOf(sp, h), p = pk();
      var head = '<b class="ml-rt">' + fmtX(h, sp.x.fmt) + '</b><span class="ml-ra">' + (h < S.t0 ? 'before the dose' : hrs(h - S.t0) + ' after the dose') + '</span>';
      var rows = sp.series.map(function (s, j) {
        var v = Math.round(d.v[j][i] * 100);
        return '<span class="ml-rv"><i class="' + (s.dashed ? 'ml-dash' : '') + '" style="' + (s.dashed ? 'border-color:' + s.color : 'background:' + s.color) + '"></i>' + (sp.series.length > 1 ? esc(s.label) + ': ' : 'Level: ') + '<b>' + v + '%</b> of the highest point shown</span>';
      }).join('');
      var end = p.lasts ? '<span class="ml-rn">From the product information the effect lasts ' + esc(p.lastsTxt || 'about ' + p.lasts + ' h') + ', so a first dose at ' + clock(S.t0) + ' wears off around ' + clock(S.t0 + p.lasts) +
        (T.bedtime != null && S.t0 + p.lasts > T.bedtime ? ': <b>after the ' + clock(T.bedtime) + ' bedtime marker</b>.' : '.') + '</span>' : '';
      read.innerHTML = head + rows + end;
    }
    function redraw(keep) {
      var sp = spec(); chart.set(sp, keep); chart.cur = clamp(chart.cur == null ? sp.cur : chart.cur, sp.x.from, sp.x.to);
      chart.draw(); readout(); paintMoments();
    }
    function setPick(k) {
      S.k = k; S.mo = -1; S.tg = false; if (S.cmp === k) S.cmp = '';
      Array.prototype.forEach.call(body.querySelectorAll('.ml-pick'), function (b) { var on = b.dataset.k === k; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      renderOpts(); renderPanel(); var sp = spec(); chart.cur = null; chart.set(sp); chart.draw(); readout(); paintMoments();
    }
    Array.prototype.forEach.call(body.querySelectorAll('.ml-pick'), function (b) { b.addEventListener('click', function () { setPick(b.dataset.k); }); });
    setPick(S.k);
  }

  /* ---------- the tool tab (conversion and calculators) ---------- */
  function buildTool(body, T) {
    var V = {};
    T.fields.forEach(function (f) { V[f.id] = f.value; });
    body.innerHTML = (T.intro ? '<p class="ml-intro">' + T.intro + '</p>' : '') + '<div class="ml-fields"></div><div class="ml-out" aria-live="polite"></div>';
    var fbox = body.querySelector('.ml-fields'), out = body.querySelector('.ml-out'), chart = null, lastKind = '';
    function opts(f) { return typeof f.options === 'function' ? f.options(V) : (f.options || []); }
    function fixValue(f) {
      if (f.type === 'select' || f.type === 'seg') { var o = opts(f); if (o.length && !o.some(function (x) { return String(x.v) === String(V[f.id]); })) V[f.id] = o[0].v; }
      if (f.type === 'step' || f.type === 'range') { V[f.id] = clamp(+V[f.id], f.min, f.max); }
    }
    function fieldHTML(f) {
      var id = 'ml-f-' + f.id, lab = '<span class="ml-fl">' + esc(f.label) + '</span>', h;
      if (f.type === 'select') h = '<label class="ml-field" data-f="' + f.id + '">' + lab + '<select data-id="' + f.id + '">' + opts(f).map(function (o) { return '<option value="' + esc(o.v) + '"' + (String(o.v) === String(V[f.id]) ? ' selected' : '') + '>' + esc(o.l) + '</option>'; }).join('') + '</select></label>';
      else if (f.type === 'seg') h = '<div class="ml-field" data-f="' + f.id + '" role="group" aria-label="' + esc(f.label) + '">' + lab + '<div class="ml-seg">' + opts(f).map(function (o) { return '<button type="button" data-id="' + f.id + '" data-v="' + esc(o.v) + '" aria-pressed="' + (String(o.v) === String(V[f.id])) + '">' + esc(o.l) + '</button>'; }).join('') + '</div></div>';
      else if (f.type === 'step') h = '<div class="ml-field" data-f="' + f.id + '" role="group" aria-label="' + esc(f.label) + '">' + lab + '<div class="ml-step"><button type="button" data-id="' + f.id + '" data-d="-1" aria-label="Less">&minus;</button><output>' + esc(V[f.id]) + (f.unit ? ' <small>' + esc(f.unit) + '</small>' : '') + '</output><button type="button" data-id="' + f.id + '" data-d="1" aria-label="More">+</button></div></div>';
      else h = '<label class="ml-field" data-f="' + f.id + '">' + lab + '<span class="ml-rng"><input type="range" data-id="' + f.id + '" min="' + f.min + '" max="' + f.max + '" step="' + (f.step || 1) + '" value="' + V[f.id] + '"><output>' + esc(V[f.id]) + (f.unit ? ' ' + esc(f.unit) : '') + '</output></span></label>';
      return h;
    }
    function renderFields() {
      T.fields.forEach(fixValue);
      var h = '';
      T.fields.forEach(function (f) {
        if (f.show && !f.show(V)) return;
        h += fieldHTML(f);
        if (T.swap && T.swap[0] === f.id) h += '<button type="button" class="ml-swap" aria-label="Swap the two products" title="Swap"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4v13M7 17l-3-3M7 17l3-3M17 20V7M17 7l-3 3M17 7l3 3"/></svg></button>';
      });
      fbox.innerHTML = h;
      Array.prototype.forEach.call(fbox.querySelectorAll('select'), function (el) { el.addEventListener('change', function () { V[el.dataset.id] = el.value; update(true); }); });
      Array.prototype.forEach.call(fbox.querySelectorAll('.ml-seg button'), function (el) { el.addEventListener('click', function () { V[el.dataset.id] = el.dataset.v; update(true); }); });
      Array.prototype.forEach.call(fbox.querySelectorAll('.ml-step button'), function (el) {
        el.addEventListener('click', function () { var f = T.fields.filter(function (x) { return x.id === el.dataset.id; })[0], st = f.step || 1; V[f.id] = +(clamp(+V[f.id] + (+el.dataset.d) * st, f.min, f.max)).toFixed(4); update(true); });
      });
      Array.prototype.forEach.call(fbox.querySelectorAll('input[type=range]'), function (el) {
        el.addEventListener('input', function () { V[el.dataset.id] = +el.value; var o = el.parentNode.querySelector('output'), f = T.fields.filter(function (x) { return x.id === el.dataset.id; })[0]; o.textContent = el.value + (f.unit ? ' ' + f.unit : ''); update(false); });
      });
      var sw = fbox.querySelector('.ml-swap');
      if (sw) sw.addEventListener('click', function () { var a = T.swap[0], b = T.swap[1], t = V[a]; V[a] = V[b]; V[b] = t; update(true); });
    }
    function rowsHTML(rows) { return (rows && rows.length) ? '<dl class="ml-rows">' + rows.map(function (r) { return '<div><dt>' + esc(r.h) + '</dt><dd>' + r.t + '</dd></div>'; }).join('') + '</dl>' : ''; }
    function update(rebuildFields) {
      if (rebuildFields) renderFields();
      var r = T.compute(V) || {};
      var kind = r.chart ? r.chart.kind : '';
      if (kind !== lastKind || !out.querySelector('.ml-chartbox')) {
        out.innerHTML = '<div class="ml-res"><div class="ml-rh"></div><div class="ml-chartbox"></div><div class="ml-rbody"></div></div>';
        chart = null; lastKind = kind;
      }
      var res = out.querySelector('.ml-res'), rh = res.querySelector('.ml-rh'), cb = res.querySelector('.ml-chartbox'), rb = res.querySelector('.ml-rbody');
      res.className = 'ml-res ml-t-' + (r.tone || 'info');
      rh.innerHTML = (r.badge ? '<span class="ml-badge">' + esc(r.badge) + '</span>' : '') + '<h4>' + (r.head || '') + '</h4>';
      cb.hidden = !r.chart;
      if (r.chart) {
        var sp = r.chart; sp.title = sp.title || r.head || 'Chart';
        if (!chart) chart = Chart(cb, function (k) { chart.cursor(sp.kind === 'weeks' ? sp.marks[k].x : sp.moments[k].h); chart.mo = k; chart.draw(); }, function () { tail(); });
        if (sp.kind !== 'weeks') { sp.series.forEach(function (s) { s.tint = s.tint || s.color; }); }
        sp.forceLegend = true; chart.set(sp, true); tail();
      }
      rb.innerHTML = '<div class="ml-ct"></div>' + rowsHTML(r.rows) + ((r.notes && r.notes.length) ? '<ul class="ml-notes">' + r.notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>' : '') + (r.src ? '<p class="ml-src">' + r.src + '</p>' : '');
      tail();
    }
    function tail() {
      var ct = out.querySelector('.ml-ct'); if (!ct || !chart || !chart.spec) { if (ct) ct.hidden = true; return; }
      var sp = chart.spec, h = chart.cur, txt;
      if (sp.kind === 'weeks') {
        var st = (sp.steps || []).filter(function (s) { return h >= s.a && h < s.b; })[0] || (sp.steps || [])[sp.steps.length - 1];
        txt = '<b>' + (sp.x.unit === 'day' ? 'Day ' : 'Week ') + h + ':</b> ' + (st ? esc(sp.read ? sp.read(h, st) : st.v + ' ' + (sp.y.label || '')) : '');
      } else {
        var i = idxOf(sp, h);
        txt = '<b>' + fmtX(h, sp.x.fmt) + '</b> ' + sp.series.map(function (s, j) { return '<span class="ml-rv"><i class="' + (s.dashed ? 'ml-dash' : '') + '" style="' + (s.dashed ? 'border-color:' + s.color : 'background:' + s.color) + '"></i>' + esc(s.label.split(':')[0]) + ' <b>' + Math.round(sp.data.v[j][i] * 100) + '%</b></span>'; }).join('');
      }
      ct.hidden = false; ct.innerHTML = txt;
    }
    update(true);
  }

  /* ---------- tabs and mounting ---------- */
  function build(box, def) {
    box.classList.add('ml');
    var tabs = def.tabs, many = tabs.length > 1;
    box.innerHTML = (def.title ? '<h3 class="ml-title">' + esc(def.title) + '</h3>' : '') +
      (many ? '<div class="ml-tabs" role="tablist">' + tabs.map(function (t, i) { return '<button type="button" role="tab" class="ml-tab" data-i="' + i + '" aria-selected="false">' + esc(t.label) + '</button>'; }).join('') + '</div>' : '') +
      '<div class="ml-body" role="tabpanel"></div><p class="ml-foot">' + esc(def.note || NOTE) + '</p>';
    var body = box.querySelector('.ml-body'), btns = box.querySelectorAll('.ml-tab');
    function show(i) {
      Array.prototype.forEach.call(btns, function (b, j) { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); b.tabIndex = j === i ? 0 : -1; });
      body.innerHTML = '';
      var t = tabs[i]; body.dataset.kind = t.kind;
      if (t.kind === 'day') buildDay(body, t); else buildTool(body, t);
    }
    Array.prototype.forEach.call(btns, function (b) { b.addEventListener('click', function () { show(+b.dataset.i); }); });
    var tl = box.querySelector('.ml-tabs');
    if (tl) tl.addEventListener('keydown', function (e) {
      var cur = Array.prototype.indexOf.call(btns, document.activeElement), n = btns.length;
      if (cur < 0 || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      var nx = (cur + (e.key === 'ArrowRight' ? 1 : n - 1)) % n; e.preventDefault(); btns[nx].focus(); show(nx);
    });
    show(0);
  }
  function mount(id) {
    var def = LAB.defs[id]; if (!def) return;
    Array.prototype.forEach.call(document.querySelectorAll('[data-ml="' + id + '"]'), function (box) { if (box.__ml) return; box.__ml = 1; build(box, def); });
  }
  LAB.mount = mount;
  LAB.curve = function (model, hours) { return norm(model, hours); };
})();
