/* DIVA engine tests (AA.diva). Called by tests/run.js after the real data is loaded.
   The parser is tested on a SYNTHETIC form: the same layout as the DIVA 2.0 (positions, box glyphs, headings,
   font sizes) filled with placeholder words. No DIVA wording is stored in this repository. */
'use strict';
module.exports = function (ctx) {
  const AA = ctx.AA, ok = ctx.ok;
  const eq = ctx.eq || ((a, b, m) => ok(a === b, m + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'));
  const V = AA.diva;
  ok(!!V, 'diva: AA.diva is loaded');
  if (!V) return;
  const BOX = '❑';
  const W = 595.3, H = 841.9;

  /* ---------- build a synthetic DIVA-shaped document ---------- */
  function page(n) { return { n, w: W, h: H, runs: [], boxes: [] }; }
  function run(pg, s, x, y, sz, f) { pg.runs.push({ s, x, y, sz: sz || 10, f: f || 'body', w: s.length * 4.6 }); }
  function glyph(pg, x, y) { run(pg, BOX, x, y, 13, 'zapf'); }
  /* One item: header, question (main + italic childhood part), two columns of examples, Other, and the yes/no pair. */
  function item(pg, label, top, nA, nC) {
    run(pg, label, 48, top, 16, 'bold');
    run(pg, 'Placeholder question for ' + label + '?', 94, top, 10, 'body');
    run(pg, 'And the childhood part?', 300, top, 10, 'italic');
    run(pg, 'Examples left:', 43, top - 54, 10, 'bold');
    run(pg, 'Examples right:', 306, top - 54, 10, 'bold');
    let y = top - 81;
    for (let i = 0; i < nA; i++) { glyph(pg, 43, y); run(pg, label + ' adult example ' + (i + 1), 57, y); if (i === 0) { run(pg, 'continued line', 57, y - 13.5); y -= 13.5; } y -= 13.5; }
    glyph(pg, 43, y); run(pg, 'Other:', 57, y);
    pg.boxes.push({ k: 'tx', x: 58, y: y - 52, w: 224, h: 38 });
    const presY = y - 95;
    let yc = top - 81;
    for (let i = 0; i < nC; i++) { glyph(pg, 306, yc); run(pg, label + ' child example ' + (i + 1), 320, yc); yc -= 13.5; }
    glyph(pg, 306, yc); run(pg, 'Other:', 320, yc);
    run(pg, 'Present:', 43, presY); glyph(pg, 128, presY); run(pg, 'Yes /', 141, presY); glyph(pg, 172, presY); run(pg, 'No', 186, presY);
    run(pg, 'Present:', 306, presY); glyph(pg, 391, presY); run(pg, 'Yes /', 405, presY); glyph(pg, 436, presY); run(pg, 'No', 449, presY);
  }
  function supp(pg, top) {
    run(pg, 'Supplement criterion A', 54, top, 16, 'bold');
    run(pg, 'Adulthood:', 43, top - 41, 10, 'bold'); run(pg, 'Adult supplement placeholder?', 43, top - 54);
    glyph(pg, 43, top - 81); run(pg, 'Yes /', 56, top - 81); glyph(pg, 87, top - 81); run(pg, 'No', 101, top - 81);
    run(pg, 'Childhood:', 43, top - 108, 10, 'bold'); run(pg, 'Child supplement placeholder?', 43, top - 121);
    glyph(pg, 43, top - 148); run(pg, 'Yes /', 56, top - 148); glyph(pg, 87, top - 148); run(pg, 'No', 101, top - 148);
  }
  const pages = [page(1), page(2), page(3), page(4)];
  run(pages[0], 'Cover', 100, 700, 40, 'bold');
  run(pages[3], 'Introduction placeholder', 310, 780, 16, 'bold');
  /* patient page with Part 1 and A1 */
  const p5 = page(5); pages.push(p5);
  ['Name', 'Birth', 'Sex:', 'Interview date', 'Researcher', 'Number'].forEach((l, i) => {
    const y = 779 - i * 27;
    run(p5, l, 43, y);
    if (i === 2) { glyph(p5, 150, y); run(p5, 'M /', 163, y); glyph(p5, 187, y); run(p5, 'F', 200, y); }
    else p5.boxes.push({ k: 'tx', x: 143, y: y - 5, w: 409, h: 19 });
  });
  run(p5, 'Part 1: placeholder part title', 54, 590, 16, 'bold');
  run(p5, 'Instructions: placeholder note.', 43, 549);
  item(p5, 'A1', 482, 3, 2);
  /* A2..A9: two per page */
  let pg = null;
  for (let n = 2; n <= 9; n++) {
    if (n % 2 === 0) { pg = page(pages.length + 1); pages.push(pg); }
    item(pg, 'A' + n, n % 2 === 0 ? 779 : 420, 2 + (n % 3), 2);
  }
  supp(pg, 200);
  const p10 = page(pages.length + 1); pages.push(p10);
  run(p10, 'Part 2:', 54, 800, 16, 'bold'); run(p10, 'Second placeholder part', 115, 800, 16, 'bold');
  for (let n = 1; n <= 9; n++) {
    if (n % 2 === 0) { pg = page(pages.length + 1); pages.push(pg); }
    item(n === 1 ? p10 : pg, 'H/I ' + n, n === 1 ? 700 : n % 2 === 0 ? 779 : 420, 2, 3);
  }
  const pB = page(pages.length + 1); pages.push(pB);
  supp(pB, 780);
  run(pB, 'Criterion B', 54, 520, 16, 'bold');
  run(pB, 'Onset placeholder question?', 43, 480);
  glyph(pB, 43, 453); run(pB, 'Yes (placeholder before seven).', 57, 453);
  glyph(pB, 43, 440); run(pB, 'No', 57, 440);
  run(pB, 'If no, from', 43, 426); run(pB, 'years.', 263, 426);
  pB.boxes.push({ k: 'tx', x: 220, y: 423, w: 34, h: 17 });
  /* Criterion C over two pages, five areas per column */
  const pC1 = page(pages.length + 1), pC2 = page(pages.length + 2); pages.push(pC1, pC2);
  run(pC1, 'Criterion C', 54, 779, 16, 'bold');
  run(pC1, 'Areas placeholder question?', 43, 738);
  run(pC1, 'Left stage', 43, 711); run(pC1, 'Right stage', 306, 711);
  function areaBlock(p, x, top, title, n) {
    run(p, title, x, top);
    let y = top - 13.5;
    for (let i = 0; i < n; i++) { glyph(p, x, y); run(p, title + ' problem ' + (i + 1), x + 14, y); y -= 13.5; }
    glyph(p, x, y); run(p, 'Other:', x + 14, y);
    p.boxes.push({ k: 'tx', x: x + 16, y: y - 52, w: 224, h: 38 });
    return y - 70;
  }
  let yl = areaBlock(pC1, 43, 684, 'Area one', 4); areaBlock(pC1, 43, yl, 'Area two', 3);
  let yr = areaBlock(pC1, 306, 684, 'Area uno', 3); areaBlock(pC1, 306, yr, 'Area dos', 2);
  run(pC2, 'Left stage (continued)', 43, 790); run(pC2, 'Right stage (continued)', 306, 790);
  yl = areaBlock(pC2, 43, 760, 'Area three', 2); yl = areaBlock(pC2, 43, yl, 'Area four', 3); areaBlock(pC2, 43, yl, 'Area five', 2);
  yr = areaBlock(pC2, 306, 760, 'Area tres', 2); yr = areaBlock(pC2, 306, yr, 'Area cuatro', 2); areaBlock(pC2, 306, yr, 'Area cinco', 1);
  const pT = page(pages.length + 1); pages.push(pT);
  run(pT, 'Left: two areas placeholder?', 48, 779, 11); glyph(pT, 445, 779); run(pT, 'Yes /', 458, 779); glyph(pT, 490, 779); run(pT, 'No', 503, 779);
  run(pT, 'Right: two areas placeholder?', 48, 752, 11); glyph(pT, 445, 752); run(pT, 'Yes /', 458, 752); glyph(pT, 490, 752); run(pT, 'No', 503, 752);
  run(pT, 'End placeholder.', 43, 725); run(pT, 'Details:', 43, 698);
  pT.boxes.push({ k: 'tx', x: 44, y: 604, w: 507, h: 84 });
  /* Summary page */
  const pS = page(pages.length + 1); pages.push(pS);
  run(pS, 'Summary placeholder', 54, 779, 16, 'bold');
  run(pS, 'Col', 425, 679, 11); run(pS, 'Col', 499, 679, 11);
  'abcdefghi'.split('').forEach((c, i) => { const y = 617 - i * 21; run(pS, 'A1' + c, 51, y); pS.boxes.push({ k: 'tx', x: 418, y: y - 6, w: 71, h: 20 }, { k: 'tx', x: 492, y: y - 6, w: 63, h: 20 }); });
  run(pS, '/ 9', 445, 375); run(pS, '/ 9', 519, 375);
  'abcdefghi'.split('').forEach((c, i) => { const y = 354 - i * 21; run(pS, 'A2' + c, 51, y); pS.boxes.push({ k: 'tx', x: 418, y: y - 6, w: 71, h: 20 }, { k: 'tx', x: 492, y: y - 6, w: 63, h: 20 }); });
  run(pS, '/ 9', 445, 100); run(pS, '/ 9', 519, 100);
  /* Score form: the fixed glyph pattern */
  const pF = page(pages.length + 1); pages.push(pF);
  run(pF, 'Score form', 54, 779, 16, 'bold');
  [725, 711, 671, 657, 617, 549, 536].forEach((y, i) => { run(pF, 'Row ' + i + ' placeholder?', 114, y); glyph(pF, 386, y); run(pF, 'Yes /', 399, y); glyph(pF, 431, y); run(pF, 'No', 444, y); });
  run(pF, 'E placeholder', 114, 517); glyph(pF, 386, 509); run(pF, 'No', 399, 509); run(pF, 'Yes, by', 386, 482);
  pF.boxes.push({ k: 'tx', x: 423, y: 483, w: 96, h: 15 });
  [437, 410, 396].forEach((y, i) => { run(pF, 'Source ' + i + ', i.e.', 114, y); if (i < 2) { run(pF, '**', 350, y); pF.boxes.push({ k: 'tx', x: 250, y: y - 1, w: 96, h: 15 }); } [386, 425, 454, 484].forEach((x, j) => { glyph(pF, x, y); run(pF, ['N/A', '0', '1', '2'][j], x + 13, y); }); });
  run(pF, 'Explanation:', 386, 369); pF.boxes.push({ k: 'tx', x: 388, y: 302, w: 149, h: 54 });
  run(pF, 'Diagnosis placeholder***', 114, 283); glyph(pF, 386, 279); run(pF, 'No', 399, 279);
  run(pF, 'Yes, subtype', 386, 252);
  glyph(pF, 386, 239); run(pF, 'Code one', 404, 239);
  glyph(pF, 386, 225); run(pF, 'Code two', 404, 225); run(pF, 'continues', 404, 212);
  glyph(pF, 386, 198); run(pF, 'Code three', 404, 198);
  run(pF, '* Footnote one placeholder.', 43, 144, 8); run(pF, '*** Footnote three placeholder.', 43, 77, 8);

  /* ---------- parse ---------- */
  const C = V.parse(pages);
  ok(C.ok, 'diva parse: synthetic form is readable (problems: ' + C.problems.join(' | ') + ')');
  ok(C.canFill, 'diva parse: synthetic form can be filled');
  eq(Object.keys(C.items).length, 18, 'diva parse: 18 items');
  eq(C.items.A1.q, 'Placeholder question for A1?', 'diva parse: main question');
  eq(C.items.A1.qChild, 'And the childhood part?', 'diva parse: childhood part split by font');
  eq(C.items.A1.adult.length, 3, 'diva parse: A1 adult examples (Other excluded)');
  eq(C.items.A1.adult[0].t, 'A1 adult example 1 continued line', 'diva parse: wrapped example label joined');
  eq(C.items.A1.child.length, 2, 'diva parse: A1 child examples');
  ok(!!(C.items.A1.otherA && C.items.A1.otherA.text && C.items.A1.otherA.text.w === 224), 'diva parse: Other text box from the form field');
  ok(C.items.A1.presentA.yes.x < C.items.A1.presentA.no.x, 'diva parse: present yes before no');
  eq(C.items.HI9.label, 'H/I 9', 'diva parse: H/I label kept');
  eq(C.items.HI1.child.length, 3, 'diva parse: H/I 1 child examples');
  ok(C.supp.ia && C.supp.hi && C.supp.ia.adult.q === 'Adult supplement placeholder?', 'diva parse: both supplement questions, adult question text');
  eq(C.supp.ia.adult.label, 'Adulthood:', 'diva parse: supplement label separated from the question');
  eq(C.critB.yes.t, 'Yes (placeholder before seven).', 'diva parse: criterion B yes label');
  ok(C.critB.age && C.critB.age.x === 220, 'diva parse: age box from the form field');
  eq(C.critC.adult.length, 5, 'diva parse: five adult areas');
  eq(C.critC.child.length, 5, 'diva parse: five child areas');
  eq(C.critC.adult.map((d) => d.id).join(','), 'work,relationships,social,leisure,selfimage', 'diva parse: areas mapped in order');
  eq(C.critC.adult[0].ex.length, 4, 'diva parse: area one examples');
  eq(C.critC.child[4].title, 'Area cinco', 'diva parse: area title');
  eq(C.critC.titleA, 'Left stage', 'diva parse: column title, not the question');
  ok(C.twoAreas.adult.yes && C.twoAreas.child.no && C.twoAreas.details.w === 507, 'diva parse: two areas and details box');
  eq(Object.keys(C.summary.rows).length, 18, 'diva parse: summary rows mapped to the 18 items');
  ok(C.summary.totals.iaAdult && C.summary.totals.hiChild, 'diva parse: summary totals');
  eq(C.score.pattern, V.SCORE_PATTERN, 'diva parse: score form pattern');
  eq(C.score.dx.ia.label, 'Code two continues', 'diva parse: subtype label with its wrapped line, stopping at the next box');
  eq(C.score.dx.combined.label, 'Code one', 'diva parse: first subtype label alone');
  ok(C.score.notes.length === 2 && /^\*\*\* /.test(C.score.notes[1]), 'diva parse: score form footnotes');
  ok(C.patient.ok && C.patient.rows[2].key === 'sex' && C.patient.rows[2].f, 'diva parse: patient rows and the sex boxes');
  eq(C.edition, 'unknown', 'diva parse: a synthetic copy is not the tested edition');
  ok(/^[0-9a-f]{8}$/.test(C.hash), 'diva parse: content hash');

  /* A broken copy: the parser reports what is missing and never throws. */
  const broken = V.parse([pages[0], pages[4]]);
  ok(!broken.ok && broken.problems.length > 0, 'diva parse: incomplete copy is rejected with reasons');
  ok(V.parse([]).ok === false && V.parse(null).ok === false, 'diva parse: empty input does not throw');

  /* ---------- scoring ---------- */
  const syms = {};
  V.ITEMS.forEach((it) => { syms[it.id] = { adult: 'no', child: 'no' }; });
  ['ia1', 'ia2', 'ia3', 'ia4', 'ia5', 'ia6'].forEach((id) => { syms[id] = { adult: 'yes', child: 'yes' }; });
  const a = { patient: { age: 30, sex: 'Female', ref: 'T1', date: '2026-11-20' }, symptoms: syms, supplement: { iaAdult: 'yes', iaChild: 'yes', hiAdult: 'no', hiChild: 'no' },
    onset: { always: 'yes' }, impairment: { adult: { work: { sev: 2 }, relationships: { sev: 1 } }, child: { work: { sev: 2 }, social: { sev: 2 } } },
    collateral: { parent: 2, partner: 1, school: 'na', who: { parent: 'Mother' } }, ddx: {}, diva: {} };
  let S = V.scoreForm(a);
  eq(S.A.adultIA.n, 6, 'diva score: adult A count');
  ok(S.A.adultIA.met && !S.A.adultHI.met && S.A.childMet && S.A.adultMet, 'diva score: 6 of 9 meets criterion A in both stages');
  eq(S.B.value, 'yes', 'diva score: criterion B from part 3');
  eq(S.CD.adult.value, 'yes', 'diva score: two areas, one moderate, suggests yes');
  eq(S.CD.child.value, 'yes', 'diva score: childhood two areas');
  eq(S.dx.subtype, 'ia', 'diva score: inattentive subtype from adulthood');
  /* E depends on the differential data: with no core reviewed it stays open, so no suggestion yet */
  ok(S.dx.auto === null || S.dx.auto === 'ia', 'diva score: diagnosis waits for criterion E or follows it');
  a.diva.score = { E: 'no' };
  S = V.scoreForm(a);
  eq(S.dx.value, 'ia', 'diva score: all criteria met gives the inattentive type');
  a.symptoms.ia6 = { adult: 'no', child: 'yes' };
  S = V.scoreForm(a);
  eq(S.dx.value, 'no', 'diva score: 5 of 9 in adulthood is No on the DIVA 2.0 rules');
  ok(S.A.adultIA.low, 'diva score: 5 of 9 is inside the footnote range (4 or more)');
  ok(S.dsm5.metA, 'diva score: but DSM-5-TR (5 of 9 from age 17) is met');
  a.diva.score.dx = 'ia';
  S = V.scoreForm(a);
  ok(S.dx.set && S.dx.value === 'ia', 'diva score: the clinician can overrule the suggestion');
  a.diva.twoAreas = { adult: 'no' };
  S = V.scoreForm(a);
  eq(S.CD.adult.value, 'no', 'diva score: the clinician\'s two-areas answer wins');
  eq(V.twoAreasSuggest({ impairment: { adult: { work: { sev: 1 }, social: { sev: 1 } } } }, 'adult').v, null, 'diva score: two mild areas only: no suggestion until the rest are rated');
  eq(V.twoAreasSuggest({ impairment: { adult: { work: { sev: 1 }, social: { sev: 1 }, relationships: { sev: 0 }, leisure: { sev: 0 }, selfimage: { sev: 0 } } } }, 'adult').v, 'no', 'diva score: mild only, all rated: no');
  eq(V.twoAreasSuggest({ impairment: { child: { work: { diva: { 0: true } }, social: { other: 'x' } } } }, 'child').v, 'yes', 'diva score: ticks in two areas suggest yes when nothing is rated');
  eq(V.scoreForm({}).dx.value, null, 'diva score: empty record has no diagnosis');

  /* ---------- explanation ---------- */
  const E = V.explain(a);
  ok(E.steps.length === 8 && E.steps[0].nums.length === 4, 'diva explain: eight steps, four counts');
  ok(/5 of 9/.test(E.steps[7].text) || /5 needed/.test(E.steps[7].text), 'diva explain: DSM-5-TR step names the 5 of 9 rule');

  /* ---------- fill plan ---------- */
  a.symptoms.ia1.divaA = { 0: true, 2: true };
  a.symptoms.ia1.otherA = 'Own words';
  const plan = V.fillPlan(a, C, { name: 'Test', dob: '1990-02-01', portal: { ia1A: ['Portal example'] } });
  const ticks = plan.ops.filter((o) => o.op === 'tick'), texts = plan.ops.filter((o) => o.op === 'text');
  ok(ticks.some((o) => o.box === C.items.A1.adult[0].box) && ticks.some((o) => o.box === C.items.A1.adult[2].box), 'diva fill: ticked DIVA examples are marked');
  ok(!ticks.some((o) => o.box === C.items.A1.adult[1].box), 'diva fill: unticked examples are not marked');
  ok(texts.some((o) => o.box === C.items.A1.otherA.text && o.text === 'Own words Also: Portal example'), 'diva fill: Other box gets own words and portal examples');
  ok(ticks.some((o) => o.box === C.items.A1.presentA.yes), 'diva fill: present yes ticked');
  ok(texts.some((o) => o.text === '01/02/1990'), 'diva fill: date of birth printed in UK format');
  ok(ticks.some((o) => o.box === C.patient.rows[2].f), 'diva fill: sex box');
  ok(texts.some((o) => o.box === C.summary.totals.iaAdult && o.text === '5'), 'diva fill: summary total');
  ok(ticks.some((o) => o.box === C.score.col.parent.v2) && ticks.some((o) => o.box === C.score.col.school.na), 'diva fill: collateral ratings');
  ok(ticks.some((o) => o.box === C.score.dx.ia.box), 'diva fill: diagnosis subtype');
  ok(ticks.some((o) => o.box === C.score.rows.cdAdult.no), 'diva fill: two-areas answer on the score form');
  eq(V.fillPlan({}, {}, {}).ops.length, 0, 'diva fill: nothing to fill without content');

  /* ---------- text layout ---------- */
  const measure = (t, sz) => t.length * sz * 0.5;
  let L = V.layout('short', 100, 20, measure, { size: 9 });
  ok(L.lines.length === 1 && L.size === 9 && !L.cut, 'diva layout: short text fits at full size');
  L = V.layout('word '.repeat(80), 100, 30, measure, { size: 9, min: 6 });
  ok(L.size === 6 && L.cut && /…$/.test(L.lines[L.lines.length - 1]), 'diva layout: long text shrinks, then is cut with an ellipsis');
  eq(V.ukDate('2026-11-20'), '20/11/2026', 'diva: UK date');

  /* ---------- pdf.js adapter ---------- */
  const pj = V.pageFromPdfjs(3, { w: 600, h: 800 }, { items: [{ str: BOX + ' Label', transform: [13, 0, 0, 13, 40, 500], width: 60, fontName: 'f' }, { str: '  ', transform: [10, 0, 0, 10, 0, 0] }] },
    [{ subtype: 'Widget', checkBox: true, rect: [40, 499, 50, 507] }, { subtype: 'Widget', fieldType: 'Tx', rect: [60, 400, 300, 440] }, { subtype: 'Link', rect: [0, 0, 1, 1] }]);
  ok(pj.runs.length === 2 && pj.runs[0].s === BOX && pj.runs[1].s === 'Label', 'diva adapter: a box glyph and its label in one run are split; blank runs dropped');
  ok(pj.boxes.length === 2 && pj.boxes[0].k === 'cb' && pj.boxes[1].k === 'tx', 'diva adapter: widgets kept, links dropped');

};
