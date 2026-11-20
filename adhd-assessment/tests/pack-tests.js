/* Pre-assessment pack engine tests (AA.pack). Called by tests/run.js after the real data is loaded.
   Uses its own small item list so the checks do not depend on the wording of js/data/pack.js. */
'use strict';
module.exports = function (ctx) {
  const AA = ctx.AA, ok = ctx.ok;
  const eq = ctx.eq || ((a, b, m) => ok(a === b, m + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'));
  const P = AA.pack;
  ok(!!P, 'pack: AA.pack is loaded');
  if (!P) return;
  const real = AA.data.pack;
  AA.data.pack = { items: [
    { id: 'pk_a', group: 'self', ages: 'adult', title: 'A', required: true },
    { id: 'pk_b', group: 'self', ages: 'adult', title: 'B', required: true },
    { id: 'pk_c', group: 'self', ages: 'all', title: 'C', required: false },
    { id: 'pk_l', group: 'letters', ages: 'adult', title: 'L', required: true, outgoing: true },
    { id: 'pk_y', group: 'self', ages: 'young', title: 'Y', required: true }
  ], templates: [{ id: 't1', subject: 'Ref {ref}', body: 'Back by {returnBy}; interview {interviewDate} {interviewMode}; {unknown}' }] };
  try {
    const adult = { patient: { age: 30, ref: 'R1' }, pack: {} };
    eq(P.items(adult).map((x) => x.id).join(','), 'pk_a,pk_b,pk_c,pk_l', 'pack: adult items by age');
    eq(P.items({ patient: { age: 10 } }).map((x) => x.id).join(','), 'pk_c,pk_y', 'pack: young items by age');
    let s = P.status(adult, '2026-11-20');
    ok(s.stage === 'start' && /Send/.test(s.next), 'pack: nothing sent yet: send the pack');
    eq(P.progress(adult).done, 0, 'pack: no progress');
    adult.pack = { dates: { sent: '2026-11-01' }, items: { pk_a: { s: 'sent' }, pk_b: { s: 'sent' }, pk_l: { s: 'sent' } } };
    s = P.status(adult, '2026-11-10');
    ok(s.stage === 'sent' && !s.overdue && s.returnBy === '2026-11-15', 'pack: sent, back by day 14');
    s = P.status(adult, '2026-11-20');
    ok(s.overdue && /Chase/.test(s.next), 'pack: overdue after 14 days');
    adult.pack.items.pk_a.s = 'back'; adult.pack.items.pk_b.s = 'na';
    s = P.status(adult, '2026-11-20');
    ok(s.stage === 'returned' && s.allBack && s.counts.reqBack === 3, 'pack: required back, not needed, or an outgoing letter sent: ready to triage');
    adult.pack.triage = 'tr_book';
    s = P.status(adult, '2026-11-20');
    ok(s.stage === 'triage' && /Book/.test(s.next), 'pack: triage book');
    adult.pack.interview = { date: '2026-12-03', time: '10:00', mode: 'video' };
    s = P.status(adult, '2026-11-20');
    eq(s.stage, 'booked', 'pack: booked');
    eq(P.progress(adult).done, 4, 'pack: all four parts done');
    eq(P.gaps(adult).length, 0, 'pack: no gaps when done');
    const f = P.fill(AA.data.pack.templates[0], adult, {});
    ok(f.subject === 'Ref R1' && /Back by 15\/11\/2026/.test(f.body) && /interview 03\/12\/2026 by video call/.test(f.body) && /\{unknown\}/.test(f.body), 'pack: template filled in UK dates, unknown placeholders kept');
    eq(P.addDays('2026-12-25', 14), '2027-01-08', 'pack: dates across the year end');
    ok(P.status({}, '2026-11-20').stage === 'start' && P.addDays('bad', 1) === null, 'pack: empty record and bad dates do not throw');
  } finally { AA.data.pack = real; }
  if (real) {
    const ids = new Set();
    (real.items || []).forEach((it) => { ok(/^[a-z0-9_]+$/.test(it.id) && !ids.has(it.id), 'pack data: id ' + it.id + ' unique and valid'); ids.add(it.id); });
    ok((real.items || []).some((it) => it.required && it.ages !== 'young') && (real.items || []).some((it) => it.ages === 'young'), 'pack data: adult and young items');
    ok(Array.isArray(real.triage) && real.triage.some((t) => t.id === 'tr_book') && real.triage.some((t) => t.id === 'tr_safety'), 'pack data: triage has tr_book and tr_safety (used by the engine)');
  }
};
