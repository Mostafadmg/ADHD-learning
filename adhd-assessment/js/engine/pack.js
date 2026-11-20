/* Pre-assessment pack (AA.pack): where a patient is between referral and the DIVA interview, what is due and
   what to do next. Pure functions over the record's `pack` block and AA.data.pack; no DOM. Tested in
   tests/pack-tests.js. Load after diagnosis.js (it uses AA.diagnosis.young when present).

   Record: pack: { service, dates: { referral, sent, returned }, items: { <itemId>: { s: 'sent'|'back'|'na', at } },
                   triage: '<triage id>', triageNotes, interview: { date, time, mode, informants: { partner, parent }, notes } } */
(function (AA) {
  'use strict';
  var P = AA.pack = {};
  P.REMIND_DAYS = 14;   // reminder and "please return by": 14 days after sending (clinical practice)

  function obj(x) { return x && typeof x === 'object' ? x : {}; }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function data() { return obj(AA.data && AA.data.pack); }
  function young(a) { try { return !!(AA.diagnosis && AA.diagnosis.young && AA.diagnosis.young(a)); } catch (e) { return false; } }
  function iso(d) { return d.toISOString().slice(0, 10); }
  P.today = function () { return iso(new Date()); };
  /* 2026-11-20 -> 20/11/2026 for text shown to people. */
  P.uk = function (s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '')); return m ? m[3] + '/' + m[2] + '/' + m[1] : String(s || ''); };
  P.addDays = function (s, n) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
    if (!m) return null;
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    d.setUTCDate(d.getUTCDate() + n);
    return iso(d);
  };

  /* The items for this patient's age: ages 'adult' | 'young' | 'all' (missing = all). */
  P.items = function (a) {
    var y = young(a);
    return arr(data().items).filter(function (it) { var g = it.ages || 'all'; return g === 'all' || (y ? g === 'young' : g === 'adult'); });
  };
  P.state = function (a, id) { var r = obj(obj(obj(a && a.pack).items)[id]); return r.s === 'sent' || r.s === 'back' || r.s === 'na' ? r.s : null; };

  /* Counts and the stage reached. today: 'YYYY-MM-DD' (defaults to now). */
  P.status = function (a, today) {
    today = today || P.today();
    var pk = obj(a && a.pack), dates = obj(pk.dates), iv = obj(pk.interview);
    var items = P.items(a), req = items.filter(function (it) { return it.required; });
    var c = { items: items.length, required: req.length, sent: 0, back: 0, na: 0, reqOpen: 0, reqBack: 0 };
    items.forEach(function (it) { var s = P.state(a, it.id); if (s) c[s]++; });
    /* A required item is complete when it is back or not needed; a letter that only goes out (outgoing) when sent. */
    req.forEach(function (it) { var s = P.state(a, it.id); if (s === 'back' || s === 'na' || (it.outgoing && s === 'sent')) c.reqBack++; else c.reqOpen++; });
    var sent = dates.sent || null;
    var returnBy = sent ? P.addDays(sent, P.REMIND_DAYS) : null;
    var allBack = req.length > 0 && c.reqOpen === 0;
    var stage, next, due = null, overdue = false;
    if (iv.date) { stage = 'booked'; next = 'Interview on ' + P.uk(iv.date) + (iv.time ? ' at ' + iv.time : ''); due = iv.date; }
    else if (pk.triage) {
      stage = 'triage';
      next = pk.triage === 'tr_book' ? 'Book the DIVA interview' : pk.triage === 'tr_safety' ? 'Act on the safety concern first' : pk.triage === 'tr_wait' ? 'Chase the missing information' : 'Arrange the other route';
    }
    else if (allBack || dates.returned) { stage = 'returned'; next = 'Score the forms and make the triage decision'; }
    else if (sent) {
      stage = 'sent';
      overdue = returnBy && today > returnBy;
      next = overdue ? 'Chase the forms: they were due back on ' + P.uk(returnBy) : 'Waiting for the forms (due back by ' + P.uk(returnBy) + ')';
      due = returnBy;
    }
    else { stage = 'start'; next = 'Send the pre-assessment pack'; }
    return { stage: stage, next: next, due: due, overdue: !!overdue, returnBy: returnBy, counts: c, allBack: allBack };
  };

  /* Step progress for the pack step: pack sent, required forms back (or not needed), triage decision, interview booked. */
  P.progress = function (a) {
    var pk = obj(a && a.pack), s = P.status(a);
    var done = (obj(pk.dates).sent ? 1 : 0) + (s.allBack ? 1 : 0) + (pk.triage ? 1 : 0) + (obj(pk.interview).date ? 1 : 0);
    return { done: done, of: 4 };
  };
  P.gaps = function (a) {
    var pk = obj(a && a.pack), s = P.status(a), g = [];
    if (!obj(pk.dates).sent) g.push('Pack sent');
    if (!s.allBack) g.push(s.counts.reqOpen + ' required ' + (s.counts.reqOpen === 1 ? 'form' : 'forms') + ' not back');
    if (!pk.triage) g.push('Triage decision');
    if (!obj(pk.interview).date) g.push('Interview date');
    return g;
  };

  /* Fill a letter template. Unknown placeholders stay visible so nothing is silently dropped. */
  P.fill = function (tpl, a, extra) {
    extra = extra || {};
    var pk = obj(a && a.pack), dates = obj(pk.dates), iv = obj(pk.interview), p = obj(a && a.patient);
    function uk(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '')); return m ? m[3] + '/' + m[2] + '/' + m[1] : (s || ''); }
    var sent = dates.sent || P.today();
    var vals = { ref: p.ref || '[reference]', clinician: extra.clinician || '[clinician]', service: pk.service || extra.service || '[service]',
      sentDate: uk(sent), returnBy: uk(P.addDays(sent, P.REMIND_DAYS)), interviewDate: iv.date ? uk(iv.date) : '[date]',
      interviewTime: iv.time || '[time]', interviewMode: { in_person: 'in person', video: 'by video call', phone: 'by phone' }[iv.mode] || '[in person or by video]' };
    function sub(s) { return String(s || '').replace(/\{([a-zA-Z]+)\}/g, function (m, k) { return vals[k] !== undefined ? vals[k] : m; }); }
    return { subject: sub(tpl && tpl.subject), body: sub(tpl && tpl.body) };
  };
})(typeof window !== 'undefined' ? window.AA : globalThis.AA);
