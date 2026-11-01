/* M5 lesson 3: release profile explorer. Pick a product to see one dose at 07:30 across the day. The part released
   at once (IR) and the part released later (MR) are stacked, numbered markers show the key moments (explained in the
   side panel), and a time cursor (drag or tap the chart, or use the arrow keys) shows which part is working.
   Shapes come from the shared release model (js/release-model.js, also used by the lesson 4 day builder) and heights
   are relative. Timings and durations in the text, and the "lasts" bars, are from the SmPCs and SPS (28 Aug 2025).
   Markup: an empty [data-rp] box; this script builds everything inside it. */
(function () {
  'use strict';
  var RM = window.RELMODEL;
  if (!RM) return;
  var H0 = 6, H1 = 22, DOSE = 7.5, IR2 = 12, VMAX = 1.2, STEP = 0.1;
  var SCHOOL = [8.75, 15.25], HOME = [16, 18];
  var COL = { ir: ['#a8432e', '#e8bcb1'], b8: ['#2f6fb3', '#b9d1ec'], h12: ['#0b6664', '#a3d5cf'], lis: ['#6b4fa3', '#d5c9ec'] };
  var P = {
    ir: {
      chip: 'IR tablets', tag: 'all at once', name: 'Immediate-release tablets', fam: 'ir', model: 'ir', split: [100, 0], lasts: 4, lastsTxt: 'about 4 hours',
      inside: 'A plain tablet: the whole dose is released at once.',
      moments: [
        { k: 'p1', t: 'Peak at 1–2 hours', d: 'Levels rise quickly and peak 1–2 hours after the dose.' },
        { k: 'end', t: 'Gone after about 4 hours', d: 'The effect wears off by late morning, so the afternoon needs a second dose.' }
      ],
      moments2: [
        { k: 'p1', t: 'Peak at 1–2 hours', d: 'The breakfast dose peaks 1–2 hours later and lasts about 4 hours.' },
        { k: 'p2', t: 'Second dose at 12:00', d: 'A lunchtime dose gives a second peak and covers the afternoon.' },
        { k: 'end', t: 'Gone by about 16:00', d: 'About 4 hours after the second dose the effect has gone, before homework.' }
      ],
      practice: ['A lunchtime dose means a controlled drug at school or work.', 'Flexible: useful while finding the dose, and as a later top-up.', 'Give the last dose at least 4 hours before bedtime.'],
      brands: 'Ritalin tablets (children and adults), Medikinet tablets and generic tablets (children only).',
      strengths: 'Medikinet 5, 10, 20 mg; Ritalin 10 mg.'
    },
    eq: {
      chip: 'Equasym XL', tag: '30:70', name: 'Equasym XL capsules', fam: 'b8', model: 'eq', split: [30, 70], lasts: 8, lastsTxt: 'about 8 hours',
      inside: 'A capsule of beads: 30% release at once, 70% release later.',
      moments: [
        { k: 'p1', t: 'First peak at 1–2 hours', d: 'The 30% immediate part gives a quick start, like an IR tablet.' },
        { k: 'p2', t: 'Second peak at about 4.5 hours', d: 'The 70% later part starts about 3 hours after the dose. Its peak is, on average, a little higher than the first.' },
        { k: 'end', t: 'Gone after about 8 hours', d: 'A 07:30 dose covers the school day and fades around 15:30, before homework.' }
      ],
      practice: ['Take it in the morning before breakfast.', 'Levels can be lower after school than with IR at breakfast and lunch.'],
      brands: 'No other product is interchangeable with Equasym XL: never switch it or prescribe it generically. Addepta XL capsules and Tuzulby chewable tablets use the same 30:70 design, but they are separate products.',
      strengths: '10, 20, 30 mg.'
    },
    mk: {
      chip: 'Medikinet XL', tag: '50:50 · with food', name: 'Medikinet XL capsules', fam: 'b8', model: 'mk', split: [50, 50], lasts: 8, lastsTxt: 'about 8 hours',
      inside: 'A capsule of beads: 50% release at once; the other 50% are coated and release only after they leave the stomach.',
      moments: [
        { k: 'p1', t: 'Strong start', d: 'Half the dose works at once, so the morning effect is strong, like an IR tablet.' },
        { k: 'p2', t: 'Second rise about 3 hours later', d: 'The coated half keeps levels at 75% of the peak or more for 3–4 hours.' },
        { k: 'end', t: 'Gone after about 8 hours', d: 'A 07:30 dose fades around 15:30.' }
      ],
      practice: ['Must be taken with or after food: on an empty stomach it can release too much at once, giving a high peak and a shorter effect.', 'Acid-reducing medicines (PPIs, H2 blockers, antacids) can do the same, so they must not be taken with it.'],
      brands: 'Ambinet XL has the same 50:50, with-food design but is not interchangeable. Medikinet XL is not fully bioequivalent with the Ritalin XL group, so switch between them only with particular care.',
      strengths: '5, 10, 20, 30, 40, 50, 60 mg.'
    },
    rxl: {
      chip: 'Ritalin XL', tag: '50:50', name: 'Ritalin XL capsules', fam: 'b8', model: 'rxl', split: [50, 50], lasts: 8, lastsTxt: 'about 8 hours',
      inside: 'Equal amounts of immediate-release beads and delayed-release beads; the delayed beads dissolve after about 4 hours.',
      moments: [
        { k: 'p1', t: 'First peak at 1–2 hours', d: 'The immediate beads work like a breakfast IR dose.' },
        { k: 'p2', t: 'Second peak at 5–7 hours', d: 'The delayed beads work like a built-in lunchtime dose: two distinct peaks about 4 hours apart.' },
        { k: 'end', t: 'Gone after about 8 hours', d: 'A 07:30 dose fades around 15:30.' }
      ],
      practice: ['It copies IR at breakfast and lunch, without a dose at school or work.', 'With or without food. The capsule can be opened onto cool soft food.'],
      brands: 'Meflynate XL, Metyrol XL and Focusim XL are bioequivalent: they can be swapped at the same dose and quantity.',
      strengths: 'Ritalin XL 10–40 mg; Meflynate XL and Metyrol XL 10–60 mg; Focusim XL 10–40 mg.'
    },
    oros: {
      chip: 'Concerta XL', tag: '22:78', name: 'Concerta XL tablets', fam: 'h12', model: 'oros', split: [22, 78], lasts: 12, lastsTxt: 'about 12 hours',
      inside: 'An osmotic tablet: a coat holding 22% dissolves at once, and the core releases the other 78% gradually.',
      moments: [
        { k: 'p1', t: 'Small first rise at 1–2 hours', d: 'Only about a fifth works straight away, so the first lesson or meeting can feel slow.' },
        { k: 'p2', t: 'Peak at 6–8 hours', d: 'The core keeps releasing, so levels keep climbing into the afternoon.' },
        { k: 'end', t: 'Gone after about 12 hours', d: 'A 07:30 dose covers homework and fades around 19:30.' }
      ],
      practice: ['Swallow whole: never chew, divide or crush, or the slow release is lost.', 'It may still be working in the evening: ask about sleep.'],
      brands: 'Affenid XL, Atenza XL, Delmosart, Matoride XL, Xaggitin XL and Xenidate XL are bioequivalent: they can be swapped at the same dose and quantity. Delmosart and Xaggitin XL release 25:75. Kixel XL has the same timings but is not on the bioequivalence list.',
      strengths: '18, 27, 36, 54 mg (Atenza XL also 45 mg; Matoride XL 18, 36, 54 mg).'
    },
    lis: {
      chip: 'Lisdex­amfetamine', tag: 'for comparison', name: 'Lisdexamfetamine (Elvanse)', fam: 'lis', model: 'lis', split: null, lasts: 13, lastsTxt: '13 hours in children, 14 in adults',
      inside: 'No IR or MR parts. It is an inactive prodrug: red blood cells slowly turn it into dexamfetamine, so the effect rises smoothly.',
      moments: [
        { k: 'p1', t: 'Smooth peak at about 4 hours', d: 'Dexamfetamine levels build steadily and peak about 3.5–4 hours after the dose.' },
        { k: 'end', t: 'Still working at 13–14 hours', d: 'In studies the effect was still there 13 hours after the dose in children and 14 hours in adults.' }
      ],
      practice: ['Not methylphenidate: shown to compare the shape of the day.', 'Give it in the morning; afternoon doses can stop sleep. Watch evening appetite.'],
      brands: 'Elvanse. Lesson 5 covers it in full.',
      strengths: ''
    }
  };
  var ORDER = ['ir', 'eq', 'mk', 'rxl', 'oros', 'lis'];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function clock(h) { var m = Math.round(h * 60); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
  function after(h) {
    var m = Math.round((h - DOSE) * 60), hh = Math.floor(m / 60), mm = m % 60;
    return hh ? hh + ' h' + (mm ? ' ' + mm + ' min' : '') + ' after the dose' : mm + ' min after the dose';
  }

  /* The curves for one product, sampled every STEP hours from H0 to H1 and scaled so a single dose peaks at 1. */
  var seriesCache = {};
  function series(key, ir2) {
    var id = key + (ir2 ? '+' : '');
    if (seriesCache[id]) return seriesCache[id];
    var p = P[key], m = RM.MODEL[p.model], span = H1 - DOSE + 0.5, DT = RM.DT;
    var single = RM.curve(p.model, null, span), peak = 0;
    for (var i = 0; i < single.length; i++) if (single[i] > peak) peak = single[i];
    var raws = [];
    if (ir2) raws = [{ a: single, at: DOSE }, { a: single, at: IR2 }];
    else if (m.comps.length > 1) raws = m.comps.map(function (c, j) { return { a: RM.curve(p.model, j, span), at: DOSE }; });
    else raws = [{ a: single, at: DOSE }];
    var t = [], parts = raws.map(function () { return []; }), total = [];
    for (var h = H0; h <= H1 + 1e-9; h += STEP) {
      var sum = 0;
      raws.forEach(function (r, j) {
        var k = Math.round((h - r.at) / DT), v = k < 0 || k >= r.a.length ? 0 : r.a[k] / peak;
        parts[j].push(v); sum += v;
      });
      t.push(+h.toFixed(2)); total.push(sum);
    }
    /* Marker positions: the highest point; or, for two-part products, the first point where the curve stops
       rising (the first peak, within 2.5 hours or before the 12:00 dose) and then the highest point. */
    var top = 0, j;
    for (j = 0; j < total.length; j++) if (total[j] > total[top]) top = j;
    var peaks = [top];
    if (ir2 || m.comps.length > 1) {
      var a0 = idxOf(DOSE), cut = idxOf(ir2 ? IR2 : DOSE + 2.5), p1 = -1;
      for (j = a0; j < cut && p1 < 0; j++) if (total[j] > 0.3 && total[j] >= total[j + 1]) p1 = j;
      if (p1 < 0) { p1 = a0; for (j = a0; j <= cut; j++) if (total[j] > total[p1]) p1 = j; }
      peaks = [p1, top];
    }
    return (seriesCache[id] = { t: t, parts: parts, total: total, peaks: peaks, top: top });
  }
  function idxOf(h) { return Math.max(0, Math.min(Math.round((h - H0) / STEP), Math.round((H1 - H0) / STEP))); }

  document.querySelectorAll('[data-rp]').forEach(function (box) {
    var S = { k: 'oros', parts: true, ir2: false, cmp: '', cur: 12, mo: -1 };
    box.innerHTML =
      '<div class="rp-picks" role="group" aria-label="Choose a product">' + ORDER.map(function (k) {
        var p = P[k];
        return '<button type="button" class="rp-pick rp-f-' + p.fam + '" data-k="' + k + '" aria-pressed="false"><i aria-hidden="true"></i><b>' + p.chip + '</b><small>' + p.tag + '</small></button>';
      }).join('') + '</div>' +
      '<div class="rp-main"><div class="rp-left">' +
        '<div class="rp-chart" tabindex="0" aria-label="Release chart. Use the left and right arrow keys to move the time cursor."><svg class="rp-svg" role="img" aria-labelledby="rp-svg-t"><title id="rp-svg-t"></title></svg></div>' +
        '<div class="rp-read" aria-live="polite"></div>' +
        '<div class="rp-opts">' +
          '<label class="rp-tg rp-tg-parts"><input type="checkbox" checked> Show the two parts</label>' +
          '<label class="rp-tg rp-tg-ir2" hidden><input type="checkbox"> Add a 12:00 dose</label>' +
          '<label class="rp-cmp">Compare with <select><option value="">Nothing</option>' + ORDER.map(function (k) { return '<option value="' + k + '">' + esc(P[k].chip) + '</option>'; }).join('') + '</select></label>' +
        '</div>' +
        '<p class="rp-note">Schematic: the shapes follow the timings in the product information. Heights are relative, not blood levels, and real responses vary.</p>' +
      '</div><div class="rp-panel"></div></div>';
    function q(s) { return box.querySelector(s); }
    var picks = Array.prototype.slice.call(box.querySelectorAll('.rp-pick'));
    var wrap = q('.rp-chart'), svg = q('.rp-svg'), read = q('.rp-read'), panel = q('.rp-panel');
    var tgParts = q('.rp-tg-parts input'), tgIr2 = q('.rp-tg-ir2 input'), cmpSel = q('.rp-cmp select');

    function moments() { var p = P[S.k]; return S.k === 'ir' && S.ir2 ? p.moments2 : p.moments; }
    function momentAt(m, d) {   /* clock hour of a moment */
      if (m.k === 'end') return S.k === 'ir' && S.ir2 ? IR2 + 4 : DOSE + P[S.k].lasts;
      var pk = d.peaks[m.k === 'p1' ? 0 : 1];
      return pk == null ? DOSE + 1 : d.t[pk];
    }

    function renderPanel() {
      var p = P[S.k], c = COL[p.fam];
      var split = p.split
        ? '<div class="rp-split" role="img" aria-label="' + p.split[0] + '% released at once, ' + p.split[1] + '% released later">' +
            '<span style="width:' + p.split[0] + '%;background:' + c[0] + '">' + p.split[0] + '%</span>' +
            (p.split[1] ? '<span style="width:' + p.split[1] + '%;background:' + c[1] + ';color:#16324f">' + p.split[1] + '%</span>' : '') + '</div>' +
          '<p class="rp-splitk"><span><i style="background:' + c[0] + '"></i>At once (IR part)</span>' + (p.split[1] ? '<span><i style="background:' + c[1] + '"></i>Later (MR part)</span>' : '') + '</p>'
        : '';
      panel.innerHTML =
        '<header class="rp-ph" style="--c:' + c[0] + '"><h4>' + esc(p.name) + '</h4><p>Lasts <b>' + esc(p.lastsTxt) + '</b></p></header>' +
        '<section class="rp-sec"><h5>What is inside</h5>' + split + '<p>' + esc(p.inside) + '</p></section>' +
        '<section class="rp-sec"><h5>Through the day</h5><ol class="rp-mo">' + moments().map(function (m, i) {
          return '<li><button type="button" data-m="' + i + '" style="--c:' + c[0] + '"><span class="rp-n">' + (i + 1) + '</span><span><b>' + esc(m.t) + '</b>' + esc(m.d) + '</span></button></li>';
        }).join('') + '</ol></section>' +
        '<section class="rp-sec"><h5>In practice</h5><ul class="rp-pr">' + p.practice.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
        '<p class="rp-br"><b>Brands:</b> ' + esc(p.brands) + (p.strengths ? '<br><b>Strengths:</b> ' + esc(p.strengths) : '') + '</p></section>';
      Array.prototype.forEach.call(panel.querySelectorAll('[data-m]'), function (b) {
        b.addEventListener('click', function () { pickMoment(+b.dataset.m); });
        b.addEventListener('mouseenter', function () { pickMoment(+b.dataset.m); });
      });
      paintMoments();
    }
    function paintMoments() {
      Array.prototype.forEach.call(panel.querySelectorAll('[data-m]'), function (b) { b.classList.toggle('on', +b.dataset.m === S.mo); b.setAttribute('aria-pressed', +b.dataset.m === S.mo ? 'true' : 'false'); });
    }
    function pickMoment(i) {
      var d = series(S.k, S.ir2), m = moments()[i]; if (!m) return;
      S.mo = i; S.cur = Math.min(H1, Math.max(H0, momentAt(m, d)));
      paintMoments(); draw(); readout();
    }

    function draw() {
      var p = P[S.k], c = COL[p.fam], d = series(S.k, S.ir2);
      var W = Math.max(280, wrap.clientWidth), narrow = W < 520, H = narrow ? 262 : 330;
      var ML = 22, MR = 22, PT = 34, PB = 66, PH = H - PT - PB, PW = W - ML - MR;
      function X(h) { return ML + (h - H0) / (H1 - H0) * PW; }
      function Y(v) { return PT + (1 - Math.min(v, VMAX) / VMAX) * PH; }
      var base = Y(0), s = '';
      /* day context */
      [[SCHOOL, '#e9f0f7', '#4d6680', 'School'], [HOME, '#fbf1da', '#8a5a00', 'Homework']].forEach(function (b) {
        s += '<rect x="' + X(b[0][0]) + '" y="' + (PT - 20) + '" width="' + (X(b[0][1]) - X(b[0][0])) + '" height="' + (base - PT + 20) + '" fill="' + b[1] + '"/>';
        s += '<text x="' + (X(b[0][0]) + X(b[0][1])) / 2 + '" y="' + (PT - 6) + '" class="rp-bl" fill="' + b[2] + '">' + b[3] + '</text>';
      });
      for (var g = 9; g <= 21; g += 3) s += '<line x1="' + X(g) + '" x2="' + X(g) + '" y1="' + PT + '" y2="' + base + '" stroke="#dfe6ee" stroke-dasharray="2 4"/>';
      /* dose lines */
      var doses = S.k === 'ir' && S.ir2 ? [DOSE, IR2] : [DOSE];
      doses.forEach(function (h, i) {
        s += '<line x1="' + X(h) + '" x2="' + X(h) + '" y1="' + (PT - 2) + '" y2="' + base + '" stroke="#16324f" stroke-width="1.5" stroke-dasharray="4 3"/>';
        s += '<text x="' + (X(h) + (i ? -4 : 4)) + '" y="' + (PT + 10) + '" class="rp-dl"' + (i ? ' text-anchor="end"' : '') + '>' + (i ? '2nd dose' : 'Dose') + '</text>';
      });
      /* areas: stacked parts, or the whole curve */
      function line(arr, off) {
        var out = '';
        for (var i = 0; i < d.t.length; i++) out += (i ? 'L' : 'M') + X(d.t[i]).toFixed(1) + ' ' + Y(arr[i] + (off ? off[i] : 0)).toFixed(1);
        return out;
      }
      function area(top, low) {
        var out = line(top, low);
        for (var i = d.t.length - 1; i >= 0; i--) out += 'L' + X(d.t[i]).toFixed(1) + ' ' + Y(low ? low[i] : 0).toFixed(1);
        return out + 'Z';
      }
      var stacked = d.parts.length > 1 && (S.parts || S.ir2);
      if (stacked) {
        s += '<path d="' + area(d.parts[0]) + '" fill="' + c[0] + '" opacity=".88"/>';
        s += '<path d="' + area(d.parts[1], d.parts[0]) + '" fill="' + (S.ir2 ? c[0] : c[1]) + '" opacity="' + (S.ir2 ? '.55' : '.95') + '"/>';
      } else {
        s += '<path d="' + area(d.total) + '" fill="' + (p.split ? c[1] : c[1]) + '" opacity=".9"/>';
      }
      s += '<path d="' + line(d.total) + '" fill="none" stroke="' + c[0] + '" stroke-width="2.5" stroke-linejoin="round"/>';
      /* compare */
      var cs = null;
      if (S.cmp && S.cmp !== S.k) {
        cs = series(S.cmp, false);
        var cl = '';
        for (var i = 0; i < cs.t.length; i++) cl += (i ? 'L' : 'M') + X(cs.t[i]).toFixed(1) + ' ' + Y(cs.total[i]).toFixed(1);
        s += '<path d="' + cl + '" fill="none" stroke="#16324f" stroke-width="2" stroke-dasharray="6 4" opacity=".85"/>';
        var cpk = cs.top;
        s += '<text x="' + X(cs.t[cpk]) + '" y="' + (Y(cs.total[cpk]) - 8) + '" class="rp-cl">' + esc(P[S.cmp].chip) + '</text>';
      }
      /* time cursor */
      var ci = idxOf(S.cur);
      s += '<line class="rp-cur" x1="' + X(S.cur) + '" x2="' + X(S.cur) + '" y1="' + (PT - 2) + '" y2="' + base + '"/>';
      s += '<circle cx="' + X(S.cur) + '" cy="' + Y(d.total[ci]) + '" r="5" fill="#fff" stroke="#16324f" stroke-width="2.5"/>';
      /* moments */
      moments().forEach(function (m, i) {
        var h = momentAt(m, d), v = d.total[idxOf(h)], on = i === S.mo, r = on ? 13 : 11, cy = Math.max(PT + 2, Y(v) - (m.k === 'end' ? 0 : 16));
        s += '<g class="rp-mk' + (on ? ' on' : '') + '" data-m="' + i + '"><circle cx="' + X(h) + '" cy="' + cy + '" r="' + r + '" fill="' + (on ? '#16324f' : '#fff') + '" stroke="' + (on ? '#16324f' : c[0]) + '" stroke-width="2.5"/>' +
          '<text x="' + X(h) + '" y="' + (cy + 4.5) + '" class="rp-mn" fill="' + (on ? '#fff' : c[0]) + '">' + (i + 1) + '</text></g>';
      });
      /* axis */
      s += '<line x1="' + ML + '" x2="' + (W - MR) + '" y1="' + base + '" y2="' + base + '" stroke="#9aa8b6" stroke-width="1.5"/>';
      for (var a = 6; a <= 21; a += 3) s += '<text x="' + X(a) + '" y="' + (base + 17) + '" class="rp-ax">' + clock(a) + '</text>';
      /* how long it lasts (from the product information, not the curve) */
      var by = base + 26, BH = 15, segs = S.k === 'ir' && S.ir2 ? [[DOSE, DOSE + 4], [IR2, IR2 + 4]] : [[DOSE, DOSE + p.lasts]];
      segs.forEach(function (g2) { s += '<rect x="' + X(g2[0]) + '" y="' + by + '" width="' + (X(Math.min(H1, g2[1])) - X(g2[0])) + '" height="' + BH + '" rx="7.5" fill="' + c[0] + '"/>'; });
      if (S.k === 'lis') s += '<rect x="' + X(DOSE + 13) + '" y="' + by + '" width="' + (X(DOSE + 14) - X(DOSE + 13)) + '" height="' + BH + '" rx="7.5" fill="' + c[1] + '"/>';
      var lab = 'Lasts ' + (S.k === 'lis' ? '13–14 h' : (S.k === 'ir' && S.ir2 ? 'about 4 h each' : 'about ' + p.lasts + ' h'));
      var tw = lab.length * 6.6, x0 = X(segs[0][0]), w0 = X(Math.min(H1, segs[0][1])) - x0, x1 = X(Math.min(H1, segs[segs.length - 1][1]));
      if (w0 >= tw + 16) s += '<text x="' + (x0 + 8) + '" y="' + (by + 11.5) + '" class="rp-ll rp-lli">' + lab + '</text>';
      else if (x1 + 8 + tw <= W - 2) s += '<text x="' + (x1 + 8) + '" y="' + (by + 11.5) + '" class="rp-ll">' + lab + '</text>';
      else s += '<text x="' + (x0 - 6) + '" y="' + (by + 11.5) + '" class="rp-ll" text-anchor="end">' + lab + '</text>';
      if (cs) {
        var cp = P[S.cmp];
        s += '<rect x="' + X(DOSE) + '" y="' + (by + BH + 5) + '" width="' + (X(Math.min(H1, DOSE + cp.lasts)) - X(DOSE)) + '" height="7" rx="3.5" fill="none" stroke="#16324f" stroke-dasharray="4 3"/>';
      }
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.setAttribute('width', W); svg.setAttribute('height', H);
      svg.innerHTML = '<title id="rp-svg-t">' + esc(p.name + ': one dose at 07:30. ' + moments().map(function (m) { return m.t; }).join('; ') + '.') + '</title>' + s;
      Array.prototype.forEach.call(svg.querySelectorAll('.rp-mk'), function (g3) { g3.addEventListener('click', function (e) { e.stopPropagation(); pickMoment(+g3.dataset.m); }); });
      draw.X = X; draw.PW = PW; draw.ML = ML;
    }

    function readout() {
      var p = P[S.k], c = COL[p.fam], d = series(S.k, S.ir2), i = idxOf(S.cur), tot = d.total[i];
      var head = '<b class="rp-rt">' + clock(S.cur) + '</b><span class="rp-ra">' + (S.cur < DOSE ? 'before the dose' : after(S.cur).replace('the dose', S.ir2 ? 'the first dose' : 'the dose')) + '</span>';
      var body, of = S.ir2 ? 'one dose’s highest point' : 'its highest point';
      if (S.cur < DOSE) body = '<span class="rp-rn">Nothing taken yet.</span>';
      else if (tot < 0.02) body = '<span class="rp-rn">' + (S.cur < DOSE + 1 ? 'Just taken: not absorbed yet.' : 'Almost nothing left.') + '</span>';
      else if (d.parts.length > 1) {
        var a = Math.round(d.parts[0][i] / tot * 100), b = 100 - a;
        var n0 = S.ir2 ? 'the first dose' : 'the IR part', n1 = S.ir2 ? 'the second dose' : 'the MR part';
        body = '<span class="rp-rbar" role="img" aria-label="' + a + '% from ' + n0 + ', ' + b + '% from ' + n1 + '"><i style="width:' + a + '%;background:' + c[0] + '"></i><i style="width:' + b + '%;background:' + (S.ir2 ? c[0] : c[1]) + (S.ir2 ? ';opacity:.55' : '') + '"></i></span>' +
          '<span class="rp-rn">Level <b>' + Math.round(tot * 100) + '%</b> of ' + of + ': <b>' + a + '%</b> from ' + n0 + ', <b>' + b + '%</b> from ' + n1 + '.</span>';
      } else body = '<span class="rp-rn">Level <b>' + Math.round(tot * 100) + '%</b> of ' + of + '.</span>';
      read.innerHTML = head + body;
    }

    function setProduct(k) {
      S.k = k; S.mo = -1;
      if (k !== 'ir') S.ir2 = false;
      picks.forEach(function (b) { var on = b.dataset.k === k; b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.classList.toggle('on', on); });
      q('.rp-tg-ir2').hidden = k !== 'ir'; tgIr2.checked = S.ir2;
      var single = !P[k].split || P[k].split[1] === 0;
      tgParts.disabled = single; q('.rp-tg-parts').classList.toggle('off', single);
      Array.prototype.forEach.call(cmpSel.options, function (o) { o.disabled = o.value === k; });
      if (S.cmp === k) { S.cmp = ''; cmpSel.value = ''; }
      renderPanel(); draw(); readout();
    }
    picks.forEach(function (b) { b.addEventListener('click', function () { setProduct(b.dataset.k); }); });
    tgParts.addEventListener('change', function () { S.parts = tgParts.checked; draw(); });
    tgIr2.addEventListener('change', function () { S.ir2 = tgIr2.checked; S.mo = -1; renderPanel(); draw(); readout(); });
    cmpSel.addEventListener('change', function () { S.cmp = cmpSel.value; draw(); });

    /* time cursor: drag or tap the chart, or arrow keys when it has focus */
    function fromX(clientX) {
      var r = svg.getBoundingClientRect(), x = (clientX - r.left) * (svg.viewBox.baseVal.width / r.width);
      return Math.max(H0, Math.min(H1, H0 + (x - draw.ML) / draw.PW * (H1 - H0)));
    }
    var dragging = false;
    function move(clientX) { S.cur = Math.round(fromX(clientX) * 4) / 4; S.mo = -1; paintMoments(); draw(); readout(); }
    svg.addEventListener('pointerdown', function (e) { dragging = true; try { svg.setPointerCapture(e.pointerId); } catch (x) {} move(e.clientX); });
    svg.addEventListener('pointermove', function (e) { if (dragging || e.pointerType === 'mouse') move(e.clientX); });
    svg.addEventListener('pointerup', function () { dragging = false; });
    svg.addEventListener('pointercancel', function () { dragging = false; });
    wrap.addEventListener('keydown', function (e) {
      var d = { ArrowRight: 0.25, ArrowLeft: -0.25, PageUp: 1, PageDown: -1 }[e.key];
      if (e.key === 'Home') d = H0 - S.cur; if (e.key === 'End') d = H1 - S.cur;
      if (d == null) return;
      e.preventDefault(); S.cur = Math.max(H0, Math.min(H1, S.cur + d)); S.mo = -1; paintMoments(); draw(); readout();
    });
    if (window.ResizeObserver) { var lastW = 0; new ResizeObserver(function () { var w = wrap.clientWidth; if (w && w !== lastW) { lastW = w; draw(); } }).observe(wrap); }
    else window.addEventListener('resize', draw);
    setProduct(S.k);
  });
})();
