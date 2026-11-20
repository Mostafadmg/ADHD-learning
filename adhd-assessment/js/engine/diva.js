/* DIVA 2.0 support for adults (AA.diva). Pure functions: no DOM, no store, no network. Tested in tests/diva-tests.js.

   Copyright. The DIVA is © DIVA Foundation. This portal ships NO DIVA wording: no questions, examples or score form
   text are stored in this repository. The clinician loads their own copy of the DIVA 2.0 PDF on their own device;
   the browser reads it with pdf.js (js/views/diva-kit.js) into plain "pages" (text runs and form boxes with their
   positions), and AA.diva.parse turns those pages into a content model that the interview shows word for word.
   At the end AA.diva.fillPlan lists the ticks and text to draw on the same PDF, so the clinician gets their own
   official form filled in. The parser only knows the LAYOUT of the form (where boxes and headings sit), never its words.

   Pages (from V.pageFromPdfjs): { n (1-based), w, h, runs: [{s, x, y, sz, f, w}], boxes: [{k: 'cb'|'rb'|'tx', x, y, w, h}] }
   PDF units, origin bottom-left, y = text baseline.

   Content model (from V.parse; every box is {p: page index (0-based), x, y, w, h}):
   { ok, problems: [], edition: 'diva2-en'|'unknown', sig, hash,
     parts: { 1: {title, note}, 2: {...}, 3: {title} },
     items: { A1: { code, label, q, qChild, titleA, titleC, adult: [{t, box}], child: [...], noteA, noteC,
                    otherA: {box, text}, otherC: {...}, presentA: {yes, no}, presentC: {yes, no} }, ... HI9 },
     supp: { ia: { title, adult: {label, q, yes, no}, child: {...} }, hi: {...} },
     critB: { title, q, yes: {t, box}, no: {t, box}, ageBefore, ageAfter, age: box },
     critC: { title, q, titleA, titleC, adult: [{id, title, ex: [{t, box}], other: {box, text}}] x5, child: [...] x5 },
     twoAreas: { adult: {q, yes, no}, child: {q, yes, no}, detailsLabel, details: box, end },
     summary: { title, rows: { A1: {adult: box, child: box}, ... }, totals: { iaAdult, iaChild, hiAdult, hiChild } },
     score: { title, rows: { aChildIA: {label, yes, no}, aChildHI, aAdultIA, aAdultHI, b, cdAdult, cdChild }, eNo: {label, box},
              eBy: {label, box}, col: { parent: {label, na, v0, v1, v2, who}, partner: {...}, school: {...} },
              explain: {label, box}, dxNo: {label, box}, dx: { combined: {label, box}, ia: {...}, hi: {...} }, notes: [] },
     patient: { rows: [{label, key, box | m/f}] },
     intro: { explain: [paragraphs], instructions: [ {h, p} ] } }

   Record keys used here (ARCHITECTURE.md section 4): symptoms.<id>.adult|child ('yes'|'no'|'unsure'), divaA / divaC
   ({<index>: true}, DIVA example ticks by position in the loaded copy), otherA / otherC, exA / exC (the portal's own
   examples); supplement.{iaAdult, iaChild, hiAdult, hiChild}; onset.always ('yes' = DIVA criterion B "yes"), onset.ageOnset;
   impairment.<adult|child>.<domain>.{sev, diva, other, ex}; collateral.{parent, partner, school, who, notes};
   ddx.<id>.verdict; diva.{twoAreas: {adult, child}, details, score: {B, E, eBy, dx}, src: {sig, hash}}. */
(function (AA) {
  'use strict';
  var V = AA.diva = {};

  /* ---------- fixed structure of the DIVA 2.0 (codes only, no wording) ---------- */
  V.ITEMS = [];
  ['IA', 'HI'].forEach(function (dim) {
    for (var n = 1; n <= 9; n++) {
      V.ITEMS.push({ code: (dim === 'IA' ? 'A' : 'HI') + n, label: dim === 'IA' ? 'A' + n : 'H/I ' + n, id: dim.toLowerCase() + n,
        dim: dim, n: n, dsm4: (dim === 'IA' ? 'A1' : 'A2') + 'abcdefghi'.charAt(n - 1) });
    }
  });
  V.DOMAINS = ['work', 'relationships', 'social', 'leisure', 'selfimage'];
  V.THRESHOLD = 6;            // DIVA 2.0 score form, DSM-IV: 6 or more of 9 in a domain
  V.THRESHOLD_LOW = 4;        // the score form footnote: 4 or more may be enough in adults (Kooij 2005)
  /* Structure of the English DIVA 2.0 (2010) this parser was built and tested on: example counts per item
     (adulthood/childhood, without "Other") and per impairment area. Numbers only. */
  V.EXPECT_SIG = 'A1:7/7 A2:5/6 A3:5/5 A4:5/5 A5:10/8 A6:6/5 A7:7/5 A8:5/3 A9:6/5 HI1:5/6 HI2:5/4 HI3:3/4 HI4:5/4 HI5:4/4 HI6:6/6 HI7:5/5 HI8:5/5 HI9:6/4 C:11,10,6,10,6/10,4,8,9,5';

  V.item = function (code) { for (var i = 0; i < V.ITEMS.length; i++) if (V.ITEMS[i].code === code || V.ITEMS[i].id === code) return V.ITEMS[i]; return null; };

  function arr(x) { return Array.isArray(x) ? x : []; }
  function obj(x) { return x && typeof x === 'object' ? x : {}; }
  function r1(n) { return Math.round(n * 10) / 10; }
  function str(x) { return x === undefined || x === null ? '' : String(x).trim(); }
  var GLYPH = /^[❑❏❒☐□◻▢]$/;
  var GLYPH_START = /^([❑❏❒☐□◻▢])\s*(.+)$/;

  /* ---------- pdf.js output -> plain page ---------- */
  V.pageFromPdfjs = function (n, size, textContent, annotations) {
    var runs = [], boxes = [];
    arr(textContent && textContent.items).forEach(function (it) {
      if (!it || typeof it.str !== 'string') return;
      var s = it.str.replace(/\s+/g, ' ').trim();
      if (!s) return;
      var t = it.transform || [1, 0, 0, 1, 0, 0];
      var sz = r1(Math.sqrt(t[0] * t[0] + t[1] * t[1]));
      var run = { s: s, x: r1(t[4]), y: r1(t[5]), sz: sz, f: it.fontName || '', w: r1(it.width || 0) };
      var m = GLYPH_START.exec(s);
      if (m && s.length > 1) {   // a box glyph and its label in one run: split them
        runs.push({ s: m[1], x: run.x, y: run.y, sz: sz, f: run.f, w: r1(sz * 0.78) });
        runs.push({ s: m[2], x: r1(run.x + sz * 1.05), y: run.y, sz: 10, f: run.f + '+', w: r1(Math.max(0, run.w - sz * 1.05)) });
      } else runs.push(run);
    });
    arr(annotations).forEach(function (a) {
      if (!a || a.subtype !== 'Widget' || !Array.isArray(a.rect)) return;
      var k = a.checkBox ? 'cb' : a.radioButton ? 'rb' : a.fieldType === 'Tx' ? 'tx' : null;
      if (!k) return;
      var r = a.rect;
      boxes.push({ k: k, x: r1(Math.min(r[0], r[2])), y: r1(Math.min(r[1], r[3])), w: r1(Math.abs(r[2] - r[0])), h: r1(Math.abs(r[3] - r[1])) });
    });
    return { n: n, w: size && size.w || 595.3, h: size && size.h || 841.9, runs: runs, boxes: boxes };
  };

  /* ---------- small layout helpers ---------- */
  function isGlyph(r) { return GLYPH.test(r.s); }
  function textRuns(pg) { return pg.runs.filter(function (r) { return !isGlyph(r); }); }
  function glyphs(pg) { return pg.runs.filter(isGlyph); }
  function byPos(a, b) { return (b.y - a.y) || (a.x - b.x); }
  function sameLine(a, b, tol) { return Math.abs(a.y - b.y) <= (tol || 2.6); }
  /* Group runs into lines (top to bottom, left to right). */
  function lines(runs) {
    var sorted = runs.slice().sort(byPos), out = [];
    sorted.forEach(function (r) {
      var L = out.length ? out[out.length - 1] : null;
      if (L && sameLine(L, r)) { L.runs.push(r); L.runs.sort(function (a, b) { return a.x - b.x; }); L.x = Math.min(L.x, r.x); }
      else out.push({ y: r.y, x: r.x, runs: [r] });
    });
    out.forEach(function (L) { L.s = joinRuns(L.runs); });
    return out;
  }
  function joinRuns(runs) { return runs.map(function (r) { return r.s; }).join(' ').replace(/\s+/g, ' ').replace(/ ([.,;:)?!])/g, '$1').trim(); }
  /* Superscript reference markers ("7", "4-6") in running text. */
  function isRefMark(r) { return r.sz < 8 && /^[\d,\-–]+$/.test(r.s); }
  /* Join wrapped lines; a line ending in a hyphen joins the next one without a space ("concen-" + "tration"). */
  function joinLines(ls) {
    var out = '';
    ls.forEach(function (s) {
      s = str(s);
      if (!s) return;
      if (!out) out = s;
      else if (/[a-z]-$/.test(out) && /^[a-z]/.test(s)) out = out.slice(0, -1) + s;
      else out += ' ' + s;
    });
    return out;
  }
  /* Where a mark goes: the form widget at that spot when there is one, else the glyph's own outline. */
  function glyphBox(pg, g) {
    var w = null;
    pg.boxes.forEach(function (b) {
      if (w || b.k === 'tx') return;
      if (Math.abs(b.x - g.x) <= 3.5 && Math.abs(b.y - g.y) <= 3.5) w = b;
    });
    if (w) return { p: pg.n - 1, x: w.x, y: w.y, w: w.w, h: w.h };
    return { p: pg.n - 1, x: r1(g.x - 0.4), y: r1(g.y - 0.3), w: r1(g.sz * 0.76), h: r1(g.sz * 0.63) };
  }
  function txBox(pg, b) { return { p: pg.n - 1, x: b.x, y: b.y, w: b.w, h: b.h }; }
  function inRect(r, x0, x1, yTop, yBot) { return r.x >= x0 && r.x < x1 && r.y <= yTop && r.y >= yBot; }

  /* Headings: runs of 14 pt or more, merged when they wrap ("Part 2:" + title + "(DSM-IV ...)"). */
  function headings(pg) {
    var big = pg.runs.filter(function (r) { return r.sz >= 14 && !isGlyph(r); }).sort(byPos), out = [];
    big.forEach(function (r) {
      var H = out.length ? out[out.length - 1] : null;
      var code = codeOf(r.s);
      if (H && !H.code && !code && H.yLow - r.y <= 24 && H.y - r.y >= -2.6 && r.x >= H.x - 6) {
        H.s = (sameLine(H, r) || H.yLow === r.y ? H.s + ' ' + r.s : joinLines([H.s, r.s])).replace(/\s+/g, ' ');
        H.yLow = Math.min(H.yLow, r.y);
        return;
      }
      out.push({ p: pg.n - 1, x: r.x, y: r.y, yLow: r.y, w: r.w, s: r.s, code: code });
    });
    out.forEach(function (H) { H.kind = H.code ? 'item' : kindOf(H.s); });
    return out;
  }
  function codeOf(s) {
    var m = /^(A|H\s*\/\s*I)\s*([1-9])$/i.exec(str(s));
    return m ? (/^A$/i.test(m[1]) ? 'A' : 'HI') + m[2] : null;
  }
  function kindOf(s) {
    if (/^part\s*\d/i.test(s)) return 'part';
    if (/supplement/i.test(s)) return 'supp';
    if (/criterion\s*b\b/i.test(s)) return 'critB';
    if (/criterion\s*c\b/i.test(s)) return 'critC';
    if (/summary/i.test(s)) return 'summary';
    if (/score/i.test(s)) return 'score';
    return 'other';
  }

  /* ---------- the parser ---------- */
  V.parse = function (pagesIn) {
    var pages = arr(pagesIn).map(function (pg, i) {
      pg = obj(pg);
      return { n: pg.n || i + 1, w: pg.w || 595.3, h: pg.h || 841.9, runs: arr(pg.runs).filter(function (r) { return r && typeof r.s === 'string'; }), boxes: arr(pg.boxes) };
    });
    var C = { ok: false, problems: [], edition: 'unknown', parts: {}, items: {}, supp: {}, critB: null, critC: null, twoAreas: null,
      summary: null, score: null, patient: null, intro: {}, pages: pages.length };
    var heads = [];
    pages.forEach(function (pg) { heads = heads.concat(headings(pg)); });
    heads.sort(function (a, b) { return (a.p - b.p) || (b.y - a.y); });
    function nextHeadY(H) {
      var y = 36;
      heads.forEach(function (o) { if (o.p === H.p && o.y < H.yLow - 1 && o.y > y) y = o.y; });
      return y;
    }
    var lastDim = null, partN = 0, firstItemPage = null, critCPage = null;
    heads.forEach(function (H) {
      var pg = pages[H.p];
      try {
        if (H.kind === 'part') {
          var pm = /part\s*(\d)/i.exec(H.s); partN = pm ? +pm[1] : partN + 1;
          C.parts[partN] = { title: H.s, note: partNote(pg, H, heads) };
        } else if (H.kind === 'item') {
          var it = parseItem(pg, H, nextHeadY(H));
          if (it) { C.items[H.code] = it; lastDim = /^A/.test(H.code) ? 'ia' : 'hi'; if (firstItemPage === null) firstItemPage = H.p; }
        } else if (H.kind === 'supp') {
          var dim = lastDim === 'hi' ? 'hi' : 'ia';
          if (C.supp[dim]) dim = dim === 'ia' ? 'hi' : 'ia';
          C.supp[dim] = parseSupp(pg, H, nextHeadY(H));
        } else if (H.kind === 'critB') {
          C.critB = parseCritB(pg, H, nextHeadY(H));
        } else if (H.kind === 'critC') {
          critCPage = H.p;
          var cc = parseCritC(pages, H);
          C.critC = cc.critC; C.twoAreas = cc.twoAreas;
        } else if (H.kind === 'summary') {
          C.summary = parseSummary(pg, H);
        } else if (H.kind === 'score') {
          C.score = parseScore(pg, H);
        }
      } catch (e) {
        C.problems.push('Could not read the section "' + H.s.slice(0, 40) + '" on page ' + (H.p + 1) + '.');
      }
    });
    if (firstItemPage !== null) {
      try { C.patient = parsePatient(pages[firstItemPage], heads); } catch (e) { C.patient = null; }
      try { C.intro = parseIntro(pages, firstItemPage, heads); } catch (e) { C.intro = {}; }
    }
    validate(C);
    return C;
  };

  /* Instructions printed under a Part heading, down to the first item heading below it. */
  function partNote(pg, H, heads) {
    var below = heads.filter(function (o) { return o.p === H.p && o.y < H.yLow - 1; }).sort(function (a, b) { return b.y - a.y; })[0];
    var bottom = below ? below.y + 14 : 40;
    var ls = lines(textRuns(pg).filter(function (r) { return r.sz < 14 && r.y < H.yLow - 4 && r.y > bottom; }));
    return joinLines(ls.map(function (L) { return L.s; }));
  }

  function parseItem(pg, H, bottomY) {
    var mid = pg.w / 2;
    var bannerTop = H.y + 4, bannerBot = H.y - 30;
    var banner = textRuns(pg).filter(function (r) { return r.sz < 14 && r.y <= bannerTop && r.y >= bannerBot && r.x > H.x + 20; }).sort(byPos);
    if (!banner.length) return null;
    var mainFont = banner[0].f;
    var main = banner.filter(function (r) { return r.f === mainFont; }), child = banner.filter(function (r) { return r.f !== mainFont; });
    var it = { code: H.code, label: H.s.replace(/\s+/g, ' '), q: joinLines(lines(main).map(function (L) { return L.s; })),
      qChild: joinLines(lines(child).map(function (L) { return L.s; })) };
    var top = bannerBot - 1;
    var colA = column(pg, 0, mid, top, bottomY), colC = column(pg, mid, pg.w, top, bottomY);
    it.titleA = colA.title; it.titleC = colC.title;
    it.adult = colA.ex; it.child = colC.ex;
    it.noteA = colA.note; it.noteC = colC.note;
    it.otherA = colA.other; it.otherC = colC.other;
    it.presentA = colA.present; it.presentC = colC.present;
    return it;
  }

  /* One column of an item (or of an impairment area): title, ticked examples with their labels, the "Other"
     box, footnotes and the yes/no pair at the bottom. */
  function column(pg, x0, x1, yTop, yBot) {
    var runs = textRuns(pg).filter(function (r) { return r.sz < 14 && inRect(r, x0, x1, yTop, yBot); });
    var gs = glyphs(pg).filter(function (g) { return inRect(g, x0, x1, yTop, yBot); }).sort(byPos);
    var out = { title: '', ex: [], note: '', other: null, present: null };
    if (!gs.length) return out;
    var edge = Math.min.apply(null, gs.map(function (g) { return g.x; }));
    var exG = gs.filter(function (g) { return g.x < edge + 6; });
    var pairG = gs.filter(function (g) { return g.x >= edge + 40; });
    if (pairG.length >= 2) {
      var pl = lines(pairG), last = pl[pl.length - 1];
      if (last && last.runs.length >= 2) out.present = { yes: glyphBox(pg, last.runs[0]), no: glyphBox(pg, last.runs[1]) };
    }
    var titleLs = lines(runs.filter(function (r) { return r.y > exG[0].y + 4; }));
    out.title = titleLs.map(function (L) { return L.s; }).join(' ');
    exG.forEach(function (g, i) {
      var next = exG[i + 1];
      var lab = runs.filter(function (r) { return sameLine(r, g) && r.x > g.x + 4; });
      if (!lab.length) return;
      var lx = Math.min.apply(null, lab.map(function (r) { return r.x; }));
      var ls = [joinRuns(lab.sort(function (a, b) { return a.x - b.x; }))], lastY = g.y;
      var cont = lines(runs.filter(function (r) { return r.y < g.y - 2.6 && (!next || r.y > next.y + 2.6) && Math.abs(r.x - lx) <= 3; }));
      for (var k = 0; k < cont.length; k++) {
        if (lastY - cont[k].y > 16) break;
        ls.push(cont[k].s); lastY = cont[k].y;
      }
      var t = joinLines(ls);
      var entry = { t: t, box: glyphBox(pg, g), y: g.y };
      if (/^other\b/i.test(t) && t.length <= 8) out.other = entry; else out.ex.push(entry);
    });
    var lastEx = out.other || out.ex[out.ex.length - 1];
    if (out.other) {
      var presY = out.present ? out.present.yes.y : yBot;
      var tb = pg.boxes.filter(function (b) { return b.k === 'tx' && b.x >= x0 - 2 && b.x < x1 && b.y + b.h <= out.other.y + 2 && b.y >= presY - 2; })
        .sort(function (a, b) { return (b.y + b.h) - (a.y + a.h); })[0];
      out.other.text = tb ? txBox(pg, tb) : { p: pg.n - 1, x: r1(out.other.box.x + 15), y: r1(out.other.y - 52), w: r1(Math.min(224, x1 - out.other.box.x - 20)), h: 38 };
    }
    if (lastEx) {
      var notes = lines(runs.filter(function (r) { return r.y < lastEx.y - 2.6 && /^\*/.test(r.s); }));
      if (notes.length) {
        var nl = lines(runs.filter(function (r) { return r.y <= notes[0].y + 1 && r.y < lastEx.y - 2.6 && (!out.present || r.y > out.present.yes.y + 4); }));
        out.note = joinLines(nl.map(function (L) { return L.s; }));
      }
    }
    out.ex.forEach(function (e) { delete e.y; });
    if (out.other) delete out.other.y;
    return out;
  }

  /* Supplement question: two blocks (adulthood, childhood), each a question and a yes/no pair. */
  function parseSupp(pg, H, bottomY) {
    var runs = textRuns(pg).filter(function (r) { return r.sz < 14 && r.y < H.yLow - 4 && r.y > bottomY; });
    var gl = lines(glyphs(pg).filter(function (g) { return g.y < H.yLow - 4 && g.y > bottomY; })).filter(function (L) { return L.runs.length >= 2; });
    var out = { title: H.s };
    var prevY = H.yLow;
    ['adult', 'child'].forEach(function (per, i) {
      var L = gl[i];
      if (!L) return;
      var qls = lines(runs.filter(function (r) { return r.y < prevY - 2.6 && r.y > L.y + 2.6; }));
      var label = '';
      if (qls.length && /:$/.test(qls[0].s) && qls[0].s.split(' ').length <= 4) label = qls.shift().s;
      out[per] = { label: label, q: joinLines(qls.map(function (x) { return x.s; })), yes: glyphBox(pg, L.runs[0]), no: glyphBox(pg, L.runs[1]) };
      prevY = L.y;
    });
    return out;
  }

  function parseCritB(pg, H, bottomY) {
    var runs = textRuns(pg).filter(function (r) { return r.sz < 14 && r.y < H.yLow - 4 && r.y > bottomY - 40; });
    var gs = glyphs(pg).filter(function (g) { return g.y < H.yLow - 4 && g.y > bottomY - 40; }).sort(byPos);
    if (gs.length < 2) return null;
    var out = { title: H.s };
    out.q = joinLines(lines(runs.filter(function (r) { return r.y > gs[0].y + 2.6; })).map(function (L) { return L.s; }));
    ['yes', 'no'].forEach(function (k, i) {
      var g = gs[i];
      out[k] = { t: joinRuns(runs.filter(function (r) { return sameLine(r, g) && r.x > g.x; })), box: glyphBox(pg, g) };
    });
    var below = lines(runs.filter(function (r) { return r.y < gs[1].y - 2.6; }))[0];
    if (below) {
      var rs = below.runs;
      out.ageBefore = rs[0] ? rs[0].s : '';
      out.ageAfter = rs.length > 1 ? joinRuns(rs.slice(1)) : '';
      var tb = pg.boxes.filter(function (b) { return b.k === 'tx' && Math.abs(b.y + b.h / 2 - (below.y + 3)) <= 10; })[0];
      if (tb) out.age = txBox(pg, tb);
      else if (rs.length > 1) out.age = { p: pg.n - 1, x: r1(rs[0].x + rs[0].w + 3), y: r1(below.y - 3.5), w: r1(Math.max(20, rs[1].x - rs[0].x - rs[0].w - 6)), h: 16 };
    }
    return out;
  }

  /* Criterion C runs over two pages; the "two or more areas" question follows on the next page. */
  function parseCritC(pages, H) {
    var critC = { title: H.s, adult: [], child: [] }, twoAreas = null;
    for (var pi = H.p; pi < pages.length && pi <= H.p + 4; pi++) {
      var pg = pages[pi], mid = pg.w / 2;
      var top = pi === H.p ? H.yLow - 4 : pg.h;
      /* The yes/no question about two or more areas: glyph pairs far to the right. */
      var pairs = lines(glyphs(pg).filter(function (g) { return g.x > mid + 100 && g.y < top; })).filter(function (L) { return L.runs.length >= 2; });
      var hasDomains = glyphs(pg).some(function (g) { return g.x < mid - 200 && g.y < top; });
      if (pairs.length >= 2 && !hasDomains) { twoAreas = parseTwoAreas(pg, pairs); break; }
      if (pi === H.p) {
        var qL = lines(textRuns(pg).filter(function (r) { return r.sz < 14 && r.y < top; }))[0];
        if (qL) { critC.q = qL.s; top = qL.y - 4; }
      }
      [['adult', 0, mid], ['child', mid, pg.w]].forEach(function (c) {
        var res = domainsIn(pg, c[1], c[2], top);
        if (pi === H.p && res.head) critC[c[0] === 'adult' ? 'titleA' : 'titleC'] = res.head;
        critC[c[0]] = critC[c[0]].concat(res.domains);
      });
    }
    critC.adult.forEach(function (d, i) { d.id = V.DOMAINS[i] || 'd' + i; });
    critC.child.forEach(function (d, i) { d.id = V.DOMAINS[i] || 'd' + i; });
    return { critC: critC, twoAreas: twoAreas };
  }
  function domainsIn(pg, x0, x1, top) {
    var runs = textRuns(pg).filter(function (r) { return r.sz < 14 && inRect(r, x0, x1, top, 36); });
    var gs = glyphs(pg).filter(function (g) { return inRect(g, x0, x1, top, 36); }).sort(byPos);
    var out = { head: '', domains: [] };
    if (!gs.length) return out;
    var edge = Math.min.apply(null, gs.map(function (g) { return g.x; }));
    var ls = lines(runs);
    var titles = ls.filter(function (L) {
      if (Math.abs(L.x - edge) > 3.5) return false;
      if (gs.some(function (g) { return sameLine(g, L); })) return false;
      return gs.some(function (g) { return g.y < L.y - 2.6 && L.y - g.y <= 16; });
    });
    var first = ls.filter(function (L) { return Math.abs(L.x - edge) <= 3.5 && !gs.some(function (g) { return sameLine(g, L); }); })[0];
    if (first && titles.length && first !== titles[0] && first.y > titles[0].y) out.head = first.s;
    titles.forEach(function (T, i) {
      var nextY = titles[i + 1] ? titles[i + 1].y : 36;
      var col = column(pg, x0, x1, T.y - 2.6, nextY + 2.6);
      out.domains.push({ title: T.s, ex: col.ex, other: col.other });
    });
    return out;
  }
  function parseTwoAreas(pg, pairs) {
    var out = {};
    var runs = textRuns(pg);
    ['adult', 'child'].forEach(function (per, i) {
      var L = pairs[i];
      out[per] = { q: joinRuns(runs.filter(function (r) { return sameLine(r, L) && r.x < L.runs[0].x; }).sort(function (a, b) { return a.x - b.x; })),
        yes: glyphBox(pg, L.runs[0]), no: glyphBox(pg, L.runs[1]) };
    });
    var below = lines(runs.filter(function (r) { return r.y < pairs[1].y - 2.6; }));
    var lab = below.filter(function (L) { return /:$/.test(L.s); })[0];
    out.end = below.filter(function (L) { return L !== lab && (!lab || L.y > lab.y); }).map(function (L) { return L.s; }).join(' ');
    out.detailsLabel = lab ? lab.s : '';
    var tb = pg.boxes.filter(function (b) { return b.k === 'tx' && b.y < pairs[1].y; }).sort(function (a, b) { return b.w * b.h - a.w * a.h; })[0];
    out.details = tb ? txBox(pg, tb) : lab ? { p: pg.n - 1, x: 44, y: r1(lab.y - 94), w: r1(pg.w - 88), h: 84 } : null;
    return out;
  }

  function parseSummary(pg, H) {
    var out = { title: H.s, rows: {}, totals: {} };
    var mid = pg.w / 2;
    var runs = textRuns(pg).filter(function (r) { return r.y < H.yLow - 4; });
    var heads = lines(runs.filter(function (r) { return r.x > mid; }));
    var colX = null;
    heads.some(function (L) { if (L.runs.length >= 2 && L.runs[0].s === L.runs[1].s) { colX = [L.runs[0].x, L.runs[1].x]; return true; } return false; });
    runs.forEach(function (r) {
      var m = /^A([12])([a-i])$/.exec(r.s);
      if (!m || r.x > 120) return;
      var item = V.ITEMS[(m[1] === '1' ? 0 : 9) + 'abcdefghi'.indexOf(m[2])];
      var row = {};
      var tbs = pg.boxes.filter(function (b) { return b.k === 'tx' && b.x > mid && r.y >= b.y - 3 && r.y <= b.y + b.h + 3; }).sort(function (a, b) { return a.x - b.x; });
      if (tbs.length >= 2) { row.adult = txBox(pg, tbs[0]); row.child = txBox(pg, tbs[1]); }
      else if (colX) {
        row.adult = { p: pg.n - 1, x: r1(colX[0] - 7), y: r1(r.y - 6), w: r1(colX[1] - colX[0] - 2), h: 20 };
        row.child = { p: pg.n - 1, x: r1(colX[1] - 7), y: r1(r.y - 6), w: 62, h: 20 };
      }
      if (row.adult) out.rows[item.code] = row;
    });
    var tot = lines(runs.filter(function (r) { return /^\/\s*9$/.test(r.s); })).filter(function (L) { return L.runs.length >= 2; });
    tot.forEach(function (L, i) {
      var keys = i === 0 ? ['iaAdult', 'iaChild'] : ['hiAdult', 'hiChild'];
      L.runs.slice(0, 2).forEach(function (r, j) {
        var b = pg.boxes.filter(function (x) { return x.k !== 'tx' && Math.abs(x.x + x.w - r.x) <= 6 && Math.abs(x.y - r.y) <= 10; })[0];
        out.totals[keys[j]] = b ? txBox(pg, b) : { p: pg.n - 1, x: r1(r.x - 20.5), y: r1(r.y - 4.5), w: 17.5, h: 17 };
      });
    });
    return out;
  }

  /* Score form: the glyph rows have a fixed pattern from top to bottom:
     4 x yes/no (criterion A), 1 x yes/no (B), 2 x yes/no (C and D), 1 single (E "No"), 3 x 4 (collateral
     N/A 0 1 2), 1 single (diagnosis "No"), 3 singles (subtypes). */
  V.SCORE_PATTERN = '2,2,2,2,2,2,2,1,4,4,4,1,1,1,1';
  function parseScore(pg, H) {
    var mid = pg.w / 2;
    var runs = textRuns(pg).filter(function (r) { return r.y < H.yLow - 4; });
    var notes = lines(runs.filter(function (r) { return r.sz <= 8.5 && r.y < 160 && r.y > 36; }));
    var body = runs.filter(function (r) { return !(r.sz <= 8.5 && r.y < 160); });
    var rows = lines(glyphs(pg).filter(function (g) { return g.y < H.yLow - 4; }));
    var glyphYs = rows.map(function (L) { return L.y; });
    var pattern = rows.map(function (L) { return L.runs.length; }).join(',');
    var out = { title: H.s, pattern: pattern, rows: {}, col: {}, dx: {}, notes: [] };
    var note = [], noteLines = notes.map(function (L) { return L.s; });
    noteLines.forEach(function (s) { if (/^\*/.test(s) || !note.length) note.push(s); else note[note.length - 1] = joinLines([note[note.length - 1], s]); });
    out.notes = note;
    if (pattern !== V.SCORE_PATTERN) return out;
    var midRuns = body.filter(function (r) { return r.x > 100 && r.x < rows[0].runs[0].x - 4; });
    var blocks = [];
    lines(midRuns).forEach(function (L) {
      var B = blocks[blocks.length - 1];
      if (B && B.yLow - L.y <= 14.5) { B.ls.push(L.s); B.yLow = L.y; } else blocks.push({ yTop: L.y, yLow: L.y, ls: [L.s] });
    });
    function labelFor(y) {
      var same = lines(midRuns.filter(function (r) { return Math.abs(r.y - y) <= 4.5; }));
      if (same.length) return same.map(function (L) { return L.s; }).join(' ');
      var inB = blocks.filter(function (B) { return y <= B.yTop + 6 && y >= B.yLow - 6; })[0];
      if (inB) return joinLines(inB.ls);
      var above = blocks.filter(function (B) { return B.yLow > y; }).sort(function (a, b) { return a.yLow - b.yLow; })[0];
      return above ? joinLines(above.ls) : '';
    }
    /* The text to the right of a single box, with its wrapped lines, stopping at the next box's line. */
    function rightLabel(g) {
      var ls = lines(body.filter(function (r) { return r.x > g.x + 4 && r.y <= g.y + 2.6 && r.y > g.y - 30; }));
      var outL = [], lastY = null, stop = false;
      ls.forEach(function (L) {
        if (stop) return;
        var own = sameLine(L, g);
        if (!own && glyphYs.some(function (y) { return Math.abs(y - L.y) <= 2.6; })) { stop = lastY !== null; return; }
        if (lastY === null ? own : lastY - L.y <= 15) { outL.push(L.s); lastY = L.y; }
      });
      return joinLines(outL);
    }
    var yn = ['aChildIA', 'aChildHI', 'aAdultIA', 'aAdultHI', 'b', 'cdAdult', 'cdChild'];
    yn.forEach(function (k, i) { var L = rows[i]; out.rows[k] = { label: labelFor(L.y), yes: glyphBox(pg, L.runs[0]), no: glyphBox(pg, L.runs[1]) }; });
    var eL = rows[7];
    out.eNo = { label: labelFor(eL.y), opt: rightLabel(eL.runs[0]), box: glyphBox(pg, eL.runs[0]) };
    var byRun = body.filter(function (r) { return r.y < eL.y - 4 && r.y > rows[8].y + 4 && r.x >= eL.runs[0].x - 3; })[0];
    var byBox = pg.boxes.filter(function (b) { return b.k === 'tx' && b.x > mid && b.y < eL.y && b.y > rows[8].y; })[0];
    out.eBy = { label: byRun ? byRun.s : '', box: byBox ? txBox(pg, byBox) : byRun ? { p: pg.n - 1, x: r1(byRun.x + byRun.w + 4), y: r1(byRun.y - 4), w: 96, h: 15 } : null };
    ['parent', 'partner', 'school'].forEach(function (k, i) {
      var L = rows[8 + i];
      var c = { label: labelFor(L.y), na: glyphBox(pg, L.runs[0]), v0: glyphBox(pg, L.runs[1]), v1: glyphBox(pg, L.runs[2]), v2: glyphBox(pg, L.runs[3]) };
      if (i < 2) {
        var tb = pg.boxes.filter(function (b) { return b.k === 'tx' && b.x < L.runs[0].x - 10 && Math.abs(b.y + b.h / 2 - (L.y + 3)) <= 9; })[0];
        if (tb) c.who = txBox(pg, tb);
        else {
          var lr = body.filter(function (r) { return sameLine(r, L) && r.x < L.runs[0].x - 10; }).sort(function (a, b) { return a.x - b.x; });
          if (lr.length >= 2) c.who = { p: pg.n - 1, x: r1(lr[0].x + lr[0].w + 3), y: r1(L.y - 4), w: r1(Math.max(30, lr[lr.length - 1].x - lr[0].x - lr[0].w - 6)), h: 15 };
        }
      }
      out.col[k] = c;
    });
    var expRun = body.filter(function (r) { return r.x >= rows[8].runs[0].x - 3 && r.y < rows[10].y - 4 && r.y > rows[11].y + 4; })[0];
    var expBox = pg.boxes.filter(function (b) { return b.k === 'tx' && b.x > mid && b.y + b.h < rows[10].y && b.y > rows[11].y; })[0];
    out.explain = { label: expRun ? expRun.s : '', box: expBox ? txBox(pg, expBox) : expRun ? { p: pg.n - 1, x: r1(expRun.x + 2), y: r1(expRun.y - 66), w: 149, h: 54 } : null };
    out.dxNo = { label: labelFor(rows[11].y), opt: rightLabel(rows[11].runs[0]), box: glyphBox(pg, rows[11].runs[0]) };
    ['combined', 'ia', 'hi'].forEach(function (k, i) { var g = rows[12 + i].runs[0]; out.dx[k] = { label: rightLabel(g), box: glyphBox(pg, g) }; });
    var yesSub = body.filter(function (r) { return r.x >= rows[11].runs[0].x - 3 && r.y < rows[11].y - 4 && r.y > rows[12].y + 4; })[0];
    out.dxYesLabel = yesSub ? yesSub.s : '';
    return out;
  }

  /* Patient details: the labelled lines above the Part 1 heading on the first item page. */
  V.PATIENT_KEYS = ['name', 'dob', 'sex', 'date', 'researcher', 'number'];
  function parsePatient(pg, heads) {
    var part = heads.filter(function (o) { return o.p === pg.n - 1 && o.kind === 'part'; })[0];
    var floor = part ? part.y + 10 : pg.h / 2;
    var labels = lines(textRuns(pg).filter(function (r) { return r.y > floor && r.x < 140; }));
    var gls = lines(glyphs(pg).filter(function (g) { return g.y > floor; }));
    var rows = [];
    labels.forEach(function (L) {
      var g = gls.filter(function (G) { return sameLine(G, L); })[0];
      var row = { label: L.s };
      if (g && g.runs.length >= 2) { row.m = glyphBox(pg, g.runs[0]); row.f = glyphBox(pg, g.runs[1]); row.glyph = true; }
      else {
        var tb = pg.boxes.filter(function (b) { return b.k === 'tx' && L.y >= b.y - 2 && L.y <= b.y + b.h + 2; })[0];
        row.box = tb ? txBox(pg, tb) : { p: pg.n - 1, x: 143, y: r1(L.y - 5.5), w: r1(pg.w - 186), h: 19 };
      }
      rows.push(row);
    });
    if (rows.length !== 6 || !rows[2].glyph) return { rows: rows, ok: false };
    rows.forEach(function (r, i) { r.key = V.PATIENT_KEYS[i]; });
    return { rows: rows, ok: true };
  }

  /* Instructions and the explanation for the patient, from the pages before the interview starts. */
  function parseIntro(pages, firstItemPage, heads) {
    var out = { explain: [], instructions: [] };
    for (var pi = 1; pi < firstItemPage; pi++) {
      var pg = pages[pi], mid = pg.w / 2;
      var counts = {};
      textRuns(pg).forEach(function (r) { if (r.sz < 14) counts[r.f] = (counts[r.f] || 0) + r.s.length; });
      var body = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
      var pageHead = heads.filter(function (H) { return H.p === pi; });
      var isInstr = pageHead.some(function (H) { return /instruction/i.test(H.s); });
      [[0, mid], [mid, pg.w]].forEach(function (c) {
        var ls = lines(textRuns(pg).filter(function (r) { return r.sz < 14 && !isRefMark(r) && r.x >= c[0] && r.x < c[1] && r.y > 40 && r.y < pg.h - 40; }));
        var paras = [], cur = null, lastY = null, inExplain = false;
        ls.forEach(function (L) {
          var head = L.runs.every(function (r) { return r.f !== body; }) && L.s.length < 90 && !/^\d/.test(L.s);
          if (head) { cur = { h: L.s, p: '' }; paras.push(cur); lastY = L.y; inExplain = /^explanation/i.test(L.s); return; }
          if (!cur || (lastY !== null && lastY - L.y > 16)) { cur = { h: '', p: '' }; paras.push(cur); }
          cur.p = joinLines([cur.p, L.s]);
          cur.explain = inExplain;
          lastY = L.y;
        });
        paras.forEach(function (P, i) {
          /* A column that starts mid-sentence continues the last paragraph of the column before it. */
          var prev = out.instructions[out.instructions.length - 1];
          if (isInstr && i === 0 && !P.h && prev && /^[a-z]/.test(P.p)) { prev.p = joinLines([prev.p, P.p]); return; }
          if (P.explain && P.p) out.explain.push(P.p);
          if (isInstr && (P.p || P.h)) out.instructions.push({ h: P.h, p: P.p });
        });
      });
      /* The instructions run on to the next page until the next heading. */
      if (!isInstr && out.instructions.length && pi === firstItemPage - 1) {
        var cont = lines(textRuns(pg).filter(function (r) { return r.sz < 14 && !isRefMark(r) && r.x < mid && r.y > 40; }));
        var pre = [];
        for (var k = 0; k < cont.length; k++) { if (cont[k].runs.every(function (r) { return r.f !== body; })) break; pre.push(cont[k].s); }
        var last = out.instructions[out.instructions.length - 1];
        if (pre.length && last && /^[a-z]/.test(pre[0])) last.p = joinLines([last.p, joinLines(pre)]);
        else if (pre.length) out.instructions.push({ h: '', p: joinLines(pre) });
      }
    }
    return out;
  }

  /* ---------- validation and fingerprint ---------- */
  V.sigOf = function (C) {
    var parts = V.ITEMS.map(function (it) {
      var x = C.items[it.code];
      return it.code + ':' + (x ? arr(x.adult).length + '/' + arr(x.child).length : '-');
    });
    var cc = C.critC || {};
    parts.push('C:' + arr(cc.adult).map(function (d) { return arr(d.ex).length; }).join(',') + '/' + arr(cc.child).map(function (d) { return arr(d.ex).length; }).join(','));
    return parts.join(' ');
  };
  /* FNV-1a over all extracted wording: tells two copies apart without storing the words anywhere else. */
  V.hash = function (s) {
    var h = 0x811c9dc5;
    s = String(s || '');
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0; }
    return ('00000000' + h.toString(16)).slice(-8);
  };
  function allText(C) {
    var t = [];
    V.ITEMS.forEach(function (it) {
      var x = C.items[it.code];
      if (!x) return;
      t.push(x.q, x.qChild);
      arr(x.adult).forEach(function (e) { t.push(e.t); });
      arr(x.child).forEach(function (e) { t.push(e.t); });
    });
    return t.join('|');
  }
  function validate(C) {
    var P = C.problems;
    var missing = V.ITEMS.filter(function (it) {
      var x = C.items[it.code];
      return !x || !x.q || arr(x.adult).length < 2 || arr(x.child).length < 2 || !x.presentA || !x.presentC;
    }).map(function (it) { return it.label; });
    if (missing.length) P.push('Symptom questions not found or incomplete: ' + missing.join(', ') + '.');
    ['ia', 'hi'].forEach(function (d) {
      var s = C.supp[d];
      if (!s || !s.adult || !s.child) P.push('Supplement question for ' + (d === 'ia' ? 'attention deficit' : 'hyperactivity-impulsivity') + ' not found.');
    });
    if (!C.critB || !C.critB.yes || !C.critB.no) P.push('Criterion B (onset) not found.');
    if (!C.critC || arr(C.critC.adult).length !== 5 || arr(C.critC.child).length !== 5) P.push('Criterion C: expected 5 areas of life for adulthood and 5 for childhood.');
    if (!C.twoAreas || !C.twoAreas.adult || !C.twoAreas.child) P.push('The "two or more areas" question was not found.');
    if (!C.score || C.score.pattern !== V.SCORE_PATTERN) P.push('The score form layout was not recognised.');
    if (!C.summary || Object.keys(C.summary.rows || {}).length !== 18) P.push('The summary table was not recognised (the form can still be filled without it).');
    C.sig = V.sigOf(C);
    C.hash = V.hash(allText(C));
    C.edition = C.sig === V.EXPECT_SIG ? 'diva2-en' : 'unknown';
    /* Essential for the interview: all 18 items, both supplements, B and C. The score form and summary can be missing. */
    C.ok = !missing.length && !!(C.supp.ia && C.supp.hi && C.critB && C.critC && arr(C.critC.adult).length === 5 && arr(C.critC.child).length === 5);
    C.canFill = C.ok && !!(C.twoAreas && C.score && C.score.pattern === V.SCORE_PATTERN);
    return C;
  }

  /* ---------- scoring from the assessment record ---------- */
  function sym(a, id) { return obj(obj(a && a.symptoms)[id]); }
  V.counts = function (a, period) {
    var out = { IA: 0, HI: 0, answeredIA: 0, answeredHI: 0, unsureIA: 0, unsureHI: 0, yesIds: [], openIds: [] };
    V.ITEMS.forEach(function (it) {
      var v = sym(a, it.id)[period];
      if (v === 'yes' || v === 'no' || v === 'unsure') out['answered' + it.dim]++;
      if (v === 'yes') { out[it.dim]++; out.yesIds.push(it.code); }
      if (v === 'unsure') out['unsure' + it.dim]++;
      if (v !== 'yes' && v !== 'no') out.openIds.push(it.code);
    });
    return out;
  };
  function yn(v) { return v === 'yes' || v === 'no' ? v : null; }

  /* Impairment for one period over the five DIVA areas: rated severity (0-3) and ticked DIVA examples. */
  V.impairment = function (a, period) {
    var rec = obj(obj(a && a.impairment)[period]);
    return V.DOMAINS.map(function (id) {
      var r = obj(rec[id]);
      var ticks = Object.keys(obj(r.diva)).filter(function (k) { return r.diva[k]; }).length + Object.keys(obj(r.ex)).filter(function (k) { return r.ex[k]; }).length + (str(r.other) ? 1 : 0);
      return { id: id, sev: typeof r.sev === 'number' ? r.sev : null, ticks: ticks };
    });
  };
  /* Suggested answer to "evidence of impairment in two or more areas?" for one period. Ratings win; with no
     rating at all, ticked examples are used and the suggestion says so. */
  V.twoAreasSuggest = function (a, period) {
    var list = V.impairment(a, period);
    var rated = list.filter(function (d) { return d.sev !== null; });
    if (rated.length) {
      var hit = rated.filter(function (d) { return d.sev >= 1; });
      var max = rated.reduce(function (m, d) { return Math.max(m, d.sev); }, 0);
      if (hit.length >= 2 && max >= 2) return { v: 'yes', from: 'ratings', areas: hit.map(function (d) { return d.id; }), max: max };
      if (rated.length === list.length || (hit.length < 2 && rated.length >= 4)) return { v: 'no', from: 'ratings', areas: hit.map(function (d) { return d.id; }), max: max };
      return { v: null, from: 'ratings', areas: hit.map(function (d) { return d.id; }), max: max };
    }
    var ticked = list.filter(function (d) { return d.ticks > 0; });
    if (ticked.length >= 2) return { v: 'yes', from: 'ticks', areas: ticked.map(function (d) { return d.id; }), max: null };
    return { v: null, from: 'none', areas: ticked.map(function (d) { return d.id; }), max: null };
  };

  /* Criterion E from the differential step: "No" (not better explained) once the core differentials are
     reviewed with none judged to explain the picture better; "Yes, by ..." when one does. */
  V.eSuggest = function (a) {
    var conds = arr(AA.data && AA.data.ddx), rec = obj(a && a.ddx);
    var better = conds.filter(function (c) { return obj(rec[c.id]).verdict === 'better'; }).map(function (c) { return c.name; });
    var uncertain = conds.filter(function (c) { return obj(rec[c.id]).verdict === 'uncertain'; }).length;
    var core = conds.filter(function (c) { return c.core; });
    if (AA.diagnosis && AA.diagnosis.coreConditions) { try { core = AA.diagnosis.coreConditions(a); } catch (e) { /* keep */ } }
    var open = core.filter(function (c) { return !obj(rec[c.id]).verdict; }).length;
    if (better.length) return { v: 'yes', by: better.join(', '), why: 'Better explained by ' + better.join(', ') + ' (differential step).' };
    if (!conds.length) return { v: null, by: '', why: 'Differential data not loaded.' };
    if (uncertain) return { v: null, by: '', why: uncertain + ' differential(s) still uncertain.' };
    if (open) return { v: null, by: '', why: open + ' core differential(s) not yet reviewed.' };
    return { v: 'no', by: '', why: 'Core differentials reviewed; none explains the symptoms better.' };
  };

  /* The DIVA 2.0 score form, worked out from the record as the form prints it (DSM-IV: 6 or more of 9,
     symptoms before age 7), with the clinician's own answers (diva.score, diva.twoAreas) taking precedence.
     dsm5 holds the DSM-5-TR comparison (5 or more from age 17; several symptoms before 12). */
  V.scoreForm = function (a) {
    a = obj(a);
    var dv = obj(a.diva), sc = obj(dv.score), two = obj(dv.twoAreas), o = obj(a.onset), col = obj(a.collateral);
    var ad = V.counts(a, 'adult'), ch = V.counts(a, 'child');
    /* open: items without a firm Yes or No ("not sure yet" can still become Yes). */
    function row(c, dim) {
      var n = c[dim], ans = c['answered' + dim], open = 9 - ans + c['unsure' + dim];
      return { n: n, of: 9, answered: ans, met: n >= V.THRESHOLD, done: ans === 9, low: n >= V.THRESHOLD_LOW && n < V.THRESHOLD, can: n + open >= V.THRESHOLD };
    }
    var A = { childIA: row(ch, 'IA'), childHI: row(ch, 'HI'), adultIA: row(ad, 'IA'), adultHI: row(ad, 'HI') };
    A.childMet = A.childIA.met || A.childHI.met;
    A.adultMet = A.adultIA.met || A.adultHI.met;
    A.done = A.childIA.done && A.childHI.done && A.adultIA.done && A.adultHI.done;
    var bAuto = yn(o.always);
    var B = { auto: bAuto, value: yn(sc.B) || bAuto, set: !!yn(sc.B), ageOnset: str(o.ageOnset),
      why: o.always === 'yes' ? 'Part 3: symptoms were always there (several before age 7).'
        : o.always === 'no' ? 'Part 3: symptoms started later' + (str(o.ageOnset) ? ', from age ' + str(o.ageOnset) : '') + '.' : 'Part 3, criterion B not answered yet.' };
    function cd(per) {
      var s = V.twoAreasSuggest(a, per);
      return { auto: s.v, value: yn(two[per]) || s.v, set: !!yn(two[per]), areas: s.areas, from: s.from, max: s.max };
    }
    var CD = { adult: cd('adult'), child: cd('child') };
    var e = V.eSuggest(a);
    var E = { auto: e.v, value: sc.E === 'yes' || sc.E === 'no' ? sc.E : e.v, set: sc.E === 'yes' || sc.E === 'no', by: str(sc.eBy) || e.by, why: e.why };
    function colRow(k) { var v = col[k]; return { v: v === 'na' || v === 0 || v === 1 || v === 2 ? v : null, who: str(obj(col.who)[k]) }; }
    var COL = { parent: colRow('parent'), partner: colRow('partner'), school: colRow('school'), note: str(col.notes) };
    /* Diagnosis as the form prints it. */
    var reasons = [], pending = [];
    if (!A.done) pending.push('Not every symptom has a Yes or No for both life stages yet.');
    if (!A.adultMet && !A.adultIA.can && !A.adultHI.can) reasons.push('Adulthood: fewer than 6 of 9 in both groups (attention deficit ' + A.adultIA.n + ', hyperactivity-impulsivity ' + A.adultHI.n + ').');
    if (!A.childMet && !A.childIA.can && !A.childHI.can) reasons.push('Childhood: fewer than 6 of 9 in both groups (attention deficit ' + A.childIA.n + ', hyperactivity-impulsivity ' + A.childHI.n + ').');
    if (B.value === 'no') reasons.push('Criterion B: no lifelong pattern recorded.'); else if (!B.value) pending.push('Criterion B not answered.');
    ['adult', 'child'].forEach(function (per) {
      var v = CD[per].value, nm = per === 'adult' ? 'adulthood' : 'childhood';
      if (v === 'no') reasons.push('Criteria C and D: no evidence of impairment in two or more areas in ' + nm + '.');
      else if (!v) pending.push('Criteria C and D (' + nm + ') not answered.');
    });
    if (E.value === 'yes') reasons.push('Criterion E: better explained by ' + (E.by || 'another disorder') + '.'); else if (!E.value) pending.push('Criterion E: ' + E.why);
    var subtype = A.adultIA.met && A.adultHI.met ? 'combined' : A.adultIA.met ? 'ia' : A.adultHI.met ? 'hi' : null;
    var auto = reasons.length ? 'no' : pending.length ? null : subtype;
    var dxSet = sc.dx === 'no' || sc.dx === 'combined' || sc.dx === 'ia' || sc.dx === 'hi';
    var DX = { auto: auto, value: dxSet ? sc.dx : auto, set: dxSet, subtype: subtype, reasons: reasons, pending: pending };
    return { A: A, B: B, CD: CD, E: E, col: COL, dx: DX, dsm5: dsm5(a, ad, ch), adult: ad, child: ch };
  };
  V.SUBTYPES = { combined: { code: '314.01', label: 'Combined type' }, ia: { code: '314.00', label: 'Predominantly inattentive type' }, hi: { code: '314.01', label: 'Predominantly hyperactive-impulsive type' } };

  /* DSM-5-TR comparison (what NICE NG87 and UK services use now). Uses AA.diagnosis when it is loaded. */
  function dsm5(a, ad, ch) {
    var D = AA.diagnosis;
    var need = D && D.need ? D.need(a) : 5;
    var out = { need: need, adultIA: ad.IA, adultHI: ad.HI, childTotal: ch.IA + ch.HI, metA: ad.IA >= need || ad.HI >= need,
      presentation: ad.IA >= need && ad.HI >= need ? 'combined' : ad.IA >= need ? 'ia' : ad.HI >= need ? 'hi' : null, outcome: null };
    if (D && D.outcome) { try { var oc = D.outcome(a); out.outcome = { code: oc.code, title: oc.title, presentation: oc.presentation }; } catch (e) { out.outcome = null; } }
    return out;
  }

  /* ---------- plain-language explanation of the score, with this patient's numbers ---------- */
  V.explain = function (a) {
    var S = V.scoreForm(a);
    var A = S.A, steps = [];
    function mark(v) { return v === true ? 'yes' : v === false ? 'no' : 'open'; }
    steps.push({ id: 'count', title: 'Count the Yes answers',
      text: 'Each of the 18 symptoms gets a Yes or No twice: for adulthood (the last 6 months) and for childhood (age 5 to 12). Add up the Yes answers in each group of 9.',
      nums: [['Adulthood, attention deficit (A1 to A9)', A.adultIA.n], ['Adulthood, hyperactivity-impulsivity (H/I 1 to 9)', A.adultHI.n],
        ['Childhood, attention deficit', A.childIA.n], ['Childhood, hyperactivity-impulsivity', A.childHI.n]],
      state: A.done ? 'yes' : 'open' });
    steps.push({ id: 'a', title: 'Criterion A: 6 or more of 9, in childhood and in adulthood',
      text: 'DIVA 2.0 asks whether each group reaches 6 of 9. Only one group needs to reach 6 in each life stage. Childhood: ' +
        (A.childMet ? 'reached (' + Math.max(A.childIA.n, A.childHI.n) + ').' : 'not reached (highest ' + Math.max(A.childIA.n, A.childHI.n) + ').') +
        ' Adulthood: ' + (A.adultMet ? 'reached (' + Math.max(A.adultIA.n, A.adultHI.n) + ').' : 'not reached (highest ' + Math.max(A.adultIA.n, A.adultHI.n) + ').'),
      state: mark(A.done ? A.childMet && A.adultMet : (A.childMet && A.adultMet) || null) });
    steps.push({ id: 'b', title: 'Criterion B: a lifelong pattern',
      text: 'The symptoms should have been there since childhood. DIVA 2.0 asks whether several were present before age 7 (DSM-IV). ' + S.B.why,
      state: S.B.value === 'yes' ? 'yes' : S.B.value === 'no' ? 'no' : 'open' });
    steps.push({ id: 'cd', title: 'Criteria C and D: problems in two or more areas of life',
      text: 'The symptoms must cause at least moderate problems in two or more of the five areas (work or education, relationships and family, social contacts, free time and hobbies, self-confidence and self-image), in adulthood and in childhood. Adulthood: ' +
        (S.CD.adult.value || 'not answered') + '. Childhood: ' + (S.CD.child.value || 'not answered') + '.',
      state: S.CD.adult.value === 'yes' && S.CD.child.value === 'yes' ? 'yes' : S.CD.adult.value === 'no' || S.CD.child.value === 'no' ? 'no' : 'open' });
    steps.push({ id: 'e', title: 'Criterion E: not better explained by something else',
      text: 'Another condition (for example depression, anxiety, bipolar disorder or substance use) must not explain the symptoms better. ' + S.E.why,
      state: S.E.value === 'no' ? 'yes' : S.E.value === 'yes' ? 'no' : 'open' });
    steps.push({ id: 'type', title: 'Which type? Decided by adulthood',
      text: 'Both groups 6 or more: combined type (314.01). Attention deficit only: predominantly inattentive type (314.00). Hyperactivity-impulsivity only: predominantly hyperactive-impulsive type (314.01). If childhood and adulthood differ, the adult type is used.',
      state: S.dx.subtype ? 'yes' : 'open', result: S.dx.subtype ? V.SUBTYPES[S.dx.subtype].label : null });
    steps.push({ id: 'col', title: 'Collateral information: how much do others support it?',
      text: 'Rate each source: 0 = none or little support, 1 = some support, 2 = clear support (N/A when there is none). It does not change the count, but it shows how much weight the account can bear.',
      state: S.col.parent.v !== null || S.col.partner.v !== null || S.col.school.v !== null ? 'yes' : 'open' });
    var d5 = S.dsm5;
    steps.push({ id: 'dsm5', title: 'Today\'s rules (DSM-5-TR, used by NICE)',
      text: 'DIVA 2.0 was written for DSM-IV. DSM-5-TR needs 5 of 9 (not 6) in a group from age 17, and several symptoms before age 12 (not 7). With these numbers: ' +
        (d5.metA ? 'the adult count is met (' + Math.max(d5.adultIA, d5.adultHI) + ' of 9, ' + d5.need + ' needed).' : 'the adult count is not met (' + Math.max(d5.adultIA, d5.adultHI) + ' of 9, ' + d5.need + ' needed).') +
        (d5.outcome ? ' Overall: ' + d5.outcome.title + '.' : ''),
      state: d5.outcome ? (d5.outcome.code === 'met' ? 'yes' : d5.outcome.code === 'incomplete' ? 'open' : 'no') : 'open' });
    return { steps: steps, S: S };
  };

  /* ---------- filling the official form ---------- */
  /* Word-wrap text into a box. measure(text, size) -> width. Shrinks from size down to minSize, then cuts the
     last line with an ellipsis. Pure, so the browser filler and the tests share it. */
  V.layout = function (text, w, h, measure, opts) {
    opts = opts || {};
    var size = opts.size || 9, min = opts.min || 6, lead = opts.lead || 1.18;
    var words = str(text).replace(/\s*\n\s*/g, ' \n ').split(/ +/);
    function wrap(sz) {
      var ls = [], cur = '';
      words.forEach(function (wd) {
        if (wd === '\n') { ls.push(cur); cur = ''; return; }
        var t = cur ? cur + ' ' + wd : wd;
        if (measure(t, sz) <= w || !cur) cur = t; else { ls.push(cur); cur = wd; }
      });
      if (cur) ls.push(cur);
      return ls.filter(function (l, i) { return l || i < ls.length - 1; });
    }
    var ls = wrap(size);
    while (size > min && ls.length * size * lead > h) { size = Math.max(min, Math.round((size - 0.5) * 10) / 10); ls = wrap(size); }
    var fit = Math.max(1, Math.floor(h / (size * lead)));
    var cut = false;
    if (ls.length > fit) {
      ls = ls.slice(0, fit);
      var last = ls[fit - 1];
      while (last.length > 1 && measure(last + '…', size) > w) last = last.slice(0, -1);
      ls[fit - 1] = last.replace(/\s+$/, '') + '…';
      cut = true;
    }
    return { size: size, lines: ls, lead: size * lead, cut: cut };
  };

  /* The marks to put on the user's own PDF: [{op: 'tick'|'text', box, text, size, align}]. extra = details that
     are typed at export and not saved (name, date of birth), plus labels for the portal's own examples. */
  V.fillPlan = function (a, C, extra) {
    a = obj(a); C = obj(C); extra = obj(extra);
    var ops = [], cut = [];
    function tick(box) { if (box) ops.push({ op: 'tick', box: box }); }
    function text(box, t, o) { t = str(t); if (box && t) ops.push(Object.assign({ op: 'text', box: box, text: t }, o || {})); }
    function yesNo(pair, v) { if (pair && (v === 'yes' || v === 'no')) tick(pair[v]); }
    var p = obj(a.patient);
    /* Patient details */
    arr(obj(C.patient).rows).forEach(function (r) {
      if (r.key === 'sex') { if (/^f/i.test(p.sex)) tick(r.f); else if (/^m/i.test(p.sex)) tick(r.m); return; }
      var v = r.key === 'name' ? extra.name : r.key === 'dob' ? V.ukDate(extra.dob) : r.key === 'date' ? V.ukDate(extra.date || p.date) : r.key === 'researcher' ? extra.researcher : r.key === 'number' ? (extra.number || p.ref) : '';
      text(r.box, v, { size: 10, single: true });
    });
    /* Parts 1 and 2: every item */
    V.ITEMS.forEach(function (it) {
      var x = obj(C.items)[it.code];
      if (!x) return;
      var s = sym(a, it.id);
      [['A', 'adult', 'divaA', 'otherA', 'exA', 'presentA'], ['C', 'child', 'divaC', 'otherC', 'exC', 'presentC']].forEach(function (c) {
        var list = arr(x[c[1]]), ticks = obj(s[c[2]]);
        Object.keys(ticks).forEach(function (k) { if (ticks[k] && list[+k]) tick(list[+k].box); });
        var extraEx = arr(obj(extra.portal)[it.id + c[0]]);
        var other = [str(s[c[3]])].concat(extraEx.length ? ['Also: ' + extraEx.join('; ')] : []).filter(Boolean).join(' ');
        var ob = x['other' + c[0]];
        if (other && ob) { tick(ob.box); text(ob.text, other, { size: 8 }); }
        yesNo(x['present' + c[0]], s[c[1]]);
      });
    });
    /* Supplements */
    ['ia', 'hi'].forEach(function (d) {
      var sp = obj(C.supp)[d], sup = obj(a.supplement);
      if (!sp) return;
      yesNo(sp.adult, sup[d + 'Adult']);
      yesNo(sp.child, sup[d + 'Child']);
    });
    /* Criterion B */
    var o = obj(a.onset), B = C.critB;
    if (B) {
      if (o.always === 'yes') tick(B.yes && B.yes.box);
      else if (o.always === 'no') { tick(B.no && B.no.box); text(B.age, o.ageOnset, { size: 10, align: 'center', single: true }); }
    }
    /* Criterion C */
    var cc = C.critC;
    if (cc) ['adult', 'child'].forEach(function (per) {
      arr(cc[per]).forEach(function (d) {
        var r = obj(obj(obj(a.impairment)[per])[d.id]);
        var ticks = obj(r.diva);
        Object.keys(ticks).forEach(function (k) { if (ticks[k] && d.ex[+k]) tick(d.ex[+k].box); });
        var extraEx = arr(obj(extra.portalImp)[per + '.' + d.id]);
        var other = [str(r.other)].concat(extraEx.length ? ['Also: ' + extraEx.join('; ')] : []).filter(Boolean).join(' ');
        if (other && d.other) { tick(d.other.box); text(d.other.text, other, { size: 8 }); }
      });
    });
    var S = V.scoreForm(a);
    var two = C.twoAreas;
    if (two) {
      yesNo(two.adult, S.CD.adult.value);
      yesNo(two.child, S.CD.child.value);
      text(two.details, obj(a.diva).details, { size: 9 });
    }
    /* Summary of symptoms */
    var sm = C.summary;
    if (sm) {
      V.ITEMS.forEach(function (it) {
        var row = obj(sm.rows)[it.code], s = sym(a, it.id);
        if (!row) return;
        if (s.adult === 'yes') tick(centre(row.adult));
        if (s.child === 'yes') tick(centre(row.child));
      });
      var t = obj(sm.totals);
      text(t.iaAdult, String(S.A.adultIA.n), { size: 11, align: 'center', single: true, bold: true });
      text(t.iaChild, String(S.A.childIA.n), { size: 11, align: 'center', single: true, bold: true });
      text(t.hiAdult, String(S.A.adultHI.n), { size: 11, align: 'center', single: true, bold: true });
      text(t.hiChild, String(S.A.childHI.n), { size: 11, align: 'center', single: true, bold: true });
    }
    /* Score form */
    var sf = C.score;
    if (sf && sf.pattern === V.SCORE_PATTERN) {
      function metYN(r) { return r.answered ? (r.met ? 'yes' : r.done ? 'no' : null) : null; }
      yesNo(sf.rows.aChildIA, metYN(S.A.childIA)); yesNo(sf.rows.aChildHI, metYN(S.A.childHI));
      yesNo(sf.rows.aAdultIA, metYN(S.A.adultIA)); yesNo(sf.rows.aAdultHI, metYN(S.A.adultHI));
      yesNo(sf.rows.b, S.B.value);
      yesNo(sf.rows.cdAdult, S.CD.adult.value); yesNo(sf.rows.cdChild, S.CD.child.value);
      if (S.E.value === 'no') tick(sf.eNo.box);
      else if (S.E.value === 'yes') text(sf.eBy.box, S.E.by || 'another disorder (see report)', { size: 8 });
      ['parent', 'partner', 'school'].forEach(function (k) {
        var c = sf.col[k], v = S.col[k].v;
        if (!c) return;
        if (v === 'na') tick(c.na); else if (v === 0) tick(c.v0); else if (v === 1) tick(c.v1); else if (v === 2) tick(c.v2);
        text(c.who, S.col[k].who, { size: 8, single: true });
      });
      text(sf.explain.box, S.col.note, { size: 8 });
      var dx = S.dx.value;
      if (dx === 'no') tick(sf.dxNo.box);
      else if (dx && sf.dx[dx]) tick(sf.dx[dx].box);
    }
    return { ops: ops, cut: cut };
  };
  function centre(b) { return b ? { p: b.p, x: r1(b.x + b.w / 2 - 5), y: r1(b.y + b.h / 2 - 4), w: 10, h: 8.2 } : null; }
  /* 2026-11-20 -> 20/11/2026; anything else is left as typed. */
  V.ukDate = function (s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str(s));
    return m ? m[3] + '/' + m[2] + '/' + m[1] : str(s);
  };

  /* ---------- progress through the DIVA (for the hub) ---------- */
  V.progress = function (a) {
    var out = { items: 0, of: 36, supp: 0, b: false, c: 0, cOf: 10, two: 0 };
    V.ITEMS.forEach(function (it) { var s = sym(a, it.id); if (yn(s.adult)) out.items++; if (yn(s.child)) out.items++; });
    var sup = obj(a && a.supplement);
    ['iaAdult', 'iaChild', 'hiAdult', 'hiChild'].forEach(function (k) { if (yn(sup[k])) out.supp++; });
    out.b = !!yn(obj(a && a.onset).always);
    ['adult', 'child'].forEach(function (per) { V.impairment(a, per).forEach(function (d) { if (d.sev !== null) out.c++; }); });
    var S = V.scoreForm(a);
    if (S.CD.adult.value) out.two++;
    if (S.CD.child.value) out.two++;
    out.done = out.items + out.supp + (out.b ? 1 : 0) + out.c + out.two;
    out.total = 36 + 4 + 1 + 10 + 2;
    return out;
  };
})(typeof window !== 'undefined' ? window.AA : globalThis.AA);
