/* Pre-assessment pack step (route assess-<id>-pack), CSS prefix pk- (css/v-pack.css).
   Onboarding a patient who wants to know if they have ADHD: what to send and to whom (AA.data.pack, linking to the
   forms guide and the course's printable forms), tracking what is back, letters to copy, the triage decision and
   booking the DIVA interview. Status logic is in js/engine/pack.js (AA.pack). */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui, D = AA.diagnosis, PK = AA.pack;
  AA.steps = AA.steps || {};

  function obj(x) { return x && typeof x === 'object' ? x : {}; }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function nil(v) { return v === null ? undefined : v; }
  function uk(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '')); return m ? m[3] + '/' + m[2] + '/' + m[1] : (s || ''); }
  var STATE = [{ v: 'sent', l: 'Sent' }, { v: 'back', l: 'Back', kind: 'yes' }, { v: 'na', l: 'Not needed', kind: 'no' }];
  var STAGES_FALLBACK = [{ id: 'referral', title: 'Referral accepted' }, { id: 'sent', title: 'Pack sent' }, { id: 'chase', title: 'Reminder' },
    { id: 'returned', title: 'Forms back' }, { id: 'triage', title: 'Triage' }, { id: 'booked', title: 'Interview booked' }];
  var current = 'send';

  function dateInput(value, onSave, label) {
    var el = h('input', { type: 'date', value: value || '', 'aria-label': label, class: 'pk-date' });
    el.addEventListener('change', function () { onSave(el.value || undefined); });
    return el;
  }

  AA.steps.pack = { render: function (el, ctx) {
    var data = obj(AA.data.pack);
    if (!PK || !arr(data.items).length) {
      el.appendChild(ui.empty('Pack content not loaded', 'The pre-assessment pack is not available in this build.'));
      return null;
    }
    var root = h('div', { class: 'pk stack' });
    var hero = h('section', { class: 'pk-hero', 'aria-live': 'polite' });
    var line = h('ol', { class: 'pk-line', 'aria-label': 'Pack timeline' });
    var tabsHost = h('div', { class: 'pk-tabs' });
    root.appendChild(hero);
    root.appendChild(line);
    root.appendChild(tabsHost);
    el.appendChild(root);

    function paintHero() {
      var a = ctx.a() || {}, s = PK.status(a);
      U.clear(hero);
      var c = s.counts;
      U.append(hero, [
        h('div', { class: 'pk-hero-main' },
          h('p', { class: 'pk-k' }, 'Next'),
          h('p', { class: 'pk-next' + (s.overdue ? ' is-late' : '') }, s.next),
          data.intro ? h('p', { class: 'pk-intro' }, data.intro) : null),
        h('div', { class: 'pk-meters' },
          meter('Required forms back', c.reqBack, c.required),
          meter('All items sent or back', c.sent + c.back + c.na, c.items))]);
    }
    function meter(label, n, of) {
      var pct = of ? Math.round(100 * n / of) : 0;
      return h('div', { class: 'pk-meter' }, h('span', { class: 'pk-meter-l' }, label), h('span', { class: 'pk-meter-n' }, n + ' of ' + of),
        h('span', { class: 'pk-bar', 'aria-hidden': 'true' }, h('span', { style: { width: pct + '%' } })));
    }
    function paintLine() {
      var a = ctx.a() || {}, pk = obj(a.pack), dates = obj(pk.dates), s = PK.status(a), iv = obj(pk.interview);
      var stages = arr(data.stages).length ? data.stages : STAGES_FALLBACK;
      var order = ['start', 'sent', 'returned', 'triage', 'booked'];
      var reached = order.indexOf(s.stage);
      U.clear(line);
      stages.forEach(function (st) {
        var info = '', done = false, cur = false, ctl = null;
        if (st.id === 'referral') { done = !!dates.referral || reached > 0; ctl = dateInput(dates.referral, function (v) { ctx.set('pack.dates.referral', v); }, 'Date the referral was accepted'); }
        else if (st.id === 'sent') { done = !!dates.sent; cur = s.stage === 'start'; ctl = dateInput(dates.sent, function (v) { ctx.set('pack.dates.sent', v); }, 'Date the pack was sent'); }
        else if (st.id === 'chase') { done = reached >= 2; cur = s.stage === 'sent' && s.overdue; info = s.returnBy ? (s.overdue ? 'Overdue since ' + uk(s.returnBy) : 'Due ' + uk(s.returnBy)) : 'Day ' + (st.day || PK.REMIND_DAYS); }
        else if (st.id === 'returned') { done = reached >= 2; cur = s.stage === 'sent' && !s.overdue; ctl = dateInput(dates.returned, function (v) { ctx.set('pack.dates.returned', v); }, 'Date the forms came back'); }
        else if (st.id === 'triage') { done = !!pk.triage; cur = s.stage === 'returned'; info = pk.triage ? (arr(data.triage).filter(function (t) { return t.id === pk.triage; })[0] || {}).label || '' : 'Not decided'; }
        else if (st.id === 'booked') { done = !!iv.date; cur = s.stage === 'triage' && pk.triage === 'tr_book'; info = iv.date ? uk(iv.date) + (iv.time ? ', ' + iv.time : '') : 'Not booked'; }
        line.appendChild(h('li', { class: 'pk-st' + (done ? ' is-done' : '') + (cur ? ' is-cur' : '') },
          h('span', { class: 'pk-dot', 'aria-hidden': 'true' }, done ? '✓' : ''),
          h('span', { class: 'pk-st-t' }, st.title, h('span', { class: 'sr-only' }, done ? ' (done)' : cur ? ' (now)' : '')),
          st.day !== undefined ? h('span', { class: 'pk-st-day' }, 'Day ' + st.day) : null,
          ctl || h('span', { class: 'pk-st-i' }, info)));
      });
    }

    function paintTabs() {
      U.clear(tabsHost);
      tabsHost.appendChild(ui.tabs([
        { id: 'send', label: '1 · Send the pack', render: sendTab },
        { id: 'letters', label: '2 · Letters', render: lettersTab },
        { id: 'triage', label: '3 · Triage', render: triageTab },
        { id: 'book', label: '4 · Book the interview', render: bookTab }
      ], current, function (id) { current = id; }));
    }

    /* ---------- 1. what to send ---------- */
    function sendTab() {
      var a = ctx.a() || {}, items = PK.items(a), pk = obj(a.pack);
      var box = h('div', { class: 'pk-send' });
      box.appendChild(h('div', { class: 'pk-tools' },
        ui.field('Service name (used in the letters)', ui.input({ value: pk.service || '', placeholder: 'For example: Adult ADHD Service', onSave: function (v) { ctx.set('pack.service', v.trim() ? v : undefined); } })),
        h('div', { class: 'pk-bulk' }, ui.btn({ label: 'Mark all required as sent today', kind: 'secondary', small: true, onClick: function () {
          var today = PK.today();
          items.forEach(function (it) { if (it.required && !PK.state(ctx.a(), it.id)) ctx.set('pack.items.' + it.id, { s: 'sent', at: today }); });
          if (!obj(obj(ctx.a()).pack).dates || !ctx.get('pack.dates.sent')) ctx.set('pack.dates.sent', today);
          U.toast('Required items marked as sent today.', 'ok');
          paintTabs();
        } }))));
      arr(data.groups).forEach(function (g) {
        var list = items.filter(function (it) { return it.group === g.id; });
        if (!list.length) return;
        box.appendChild(h('section', { class: 'pk-group' }, h('h3', { class: 'pk-gt' }, g.label, h('span', { class: 'pk-gn' }, String(list.length))),
          h('ul', { class: 'pk-items' }, list.map(function (it) { return itemRow(it); }))));
      });
      return box;
    }
    function itemRow(it) {
      var a = ctx.a() || {};
      var st = PK.state(a, it.id), rec = obj(obj(obj(a.pack).items)[it.id]);
      var row = h('li', { class: 'pk-item' + (st ? ' is-' + st : '') });
      var when = h('span', { class: 'pk-when' }, st && rec.at ? (st === 'back' ? 'Back ' : st === 'sent' ? 'Sent ' : 'Marked ') + uk(rec.at) : '');
      var seg = ui.seg({ label: it.title + ': status', hideLabel: true, small: true, value: st, options: STATE, onChange: function (v) {
        ctx.set('pack.items.' + it.id, v ? { s: v, at: PK.today() } : undefined);
        if (v === 'sent' && !ctx.get('pack.dates.sent')) ctx.set('pack.dates.sent', PK.today());
        var r2 = obj(obj(obj(ctx.a()).pack).items)[it.id];
        row.className = 'pk-item' + (v ? ' is-' + v : '');
        when.textContent = v && r2 ? (v === 'back' ? 'Back ' : v === 'sent' ? 'Sent ' : 'Marked ') + uk(r2.at) : '';
      } });
      var links = [];
      if (it.form) links.push(h('a', { href: '../forms/print.html?f=' + encodeURIComponent(it.form), target: '_blank', rel: 'noopener' }, 'Printable form'));
      if (it.official) links.push(h('a', { href: '../forms/view.html?f=' + encodeURIComponent(it.official), target: '_blank', rel: 'noopener' }, 'Official PDF'));
      if (it.guide) links.push(h('a', { href: '#form-' + it.guide, 'data-go': 'form-' + it.guide }, 'How to read it'));
      if (it.template) links.push(h('button', { type: 'button', class: 'pk-linkbtn', onclick: function () { openTemplate(it.template); } }, 'Letter'));
      if (it.tool) {
        var step = 'comorbid';
        try { if (D.stepTools(a, 'screen').indexOf(it.tool) > -1) step = 'screen'; } catch (e) { /* keep */ }
        links.push(h('button', { type: 'button', class: 'pk-linkbtn', onclick: function () { ctx.go(step); } }, 'Enter the result'));
      }
      U.append(row, [
        h('div', { class: 'pk-item-main' },
          h('p', { class: 'pk-item-t' }, it.title, it.required ? h('span', { class: 'pk-req' }, 'Required') : h('span', { class: 'pk-opt' }, 'Optional')),
          h('p', { class: 'pk-item-d' }, (it.who ? it.who + '. ' : '') + (it.why || '')),
          it.when && !it.required ? h('p', { class: 'pk-item-w' }, it.when) : null,
          links.length ? h('p', { class: 'pk-links' }, links) : null),
        h('div', { class: 'pk-item-st' }, seg, when)]);
      return row;
    }

    /* ---------- 2. letters ---------- */
    function openTemplate(id) {
      var t = arr(data.templates).filter(function (x) { return x.id === id; })[0];
      if (!t) return;
      var me = AA.auth.current() || {};
      var f = PK.fill(t, ctx.a() || {}, { clinician: me.name && me.role !== 'guest' ? me.name : '' });
      var text = (f.subject ? 'Subject: ' + f.subject + '\n\n' : '') + f.body;
      var ta = h('textarea', { class: 'pk-letter', rows: 14, 'aria-label': t.title }, text);
      ta.value = text;
      U.confirm({ title: t.title, ok: 'Copy the letter', cancel: 'Close', body: h('div', null,
        h('p', { class: 'hint' }, 'For: ' + (t.for || '') + '. Check the details in square brackets before you send it. You can edit the text here first.'), ta) })
        .then(function (go) { if (go) U.copyText(ta.value).then(function (okk) { U.toast(okk ? 'Letter copied.' : 'Copy failed: select the text and copy it.', okk ? 'ok' : 'warn'); }); });
    }
    function lettersTab() {
      return h('div', { class: 'pk-letters' },
        h('p', { class: 'hint' }, 'Each letter fills in the reference, dates, your name and the service from this record. Nothing is sent from the portal: copy the letter into your email or letter system.'),
        h('ul', { class: 'pk-tpl' }, arr(data.templates).map(function (t) {
          return h('li', null, h('button', { type: 'button', class: 'pk-tplbtn', onclick: function () { openTemplate(t.id); } },
            h('span', { class: 'pk-tpl-t' }, t.title), h('span', { class: 'pk-tpl-for' }, t.for || '')));
        })));
    }

    /* ---------- 3. triage ---------- */
    function triageTab() {
      var a = ctx.a() || {}, pk = obj(a.pack);
      var rows = [], urgent = [];
      PK.items(a).forEach(function (it) {
        if (!it.tool) return;
        var r = null;
        try { r = AA.scoring.forAssessment(a, it.tool); } catch (e) { r = null; }
        var t = AA.byId('tools', it.tool) || {};
        var res = obj(obj(obj(a.tools)[it.tool]).result);
        var txt = r ? (r.band && (r.band.label || r.band)) || (r.positive === true ? 'Above the cut-off' : r.positive === false ? 'Below the cut-off' : r.total !== undefined ? 'Score ' + r.total : 'Scored')
          : res.score || res.cutoff ? (res.score ? 'Score ' + res.score : '') + (res.cutoff ? ' · cut-off met: ' + res.cutoff : '') : null;
        if (r) arr(r.flags).forEach(function (f) { if (f.level === 'urgent') urgent.push((t.abbr || it.tool) + ': ' + f.text); });
        rows.push(h('li', { class: 'pk-res' + (txt ? '' : ' is-open') }, h('span', { class: 'pk-res-t' }, t.abbr || it.title), h('span', { class: 'pk-res-v' }, txt || 'Not entered yet')));
      });
      var notes = ui.input({ rows: 3, value: pk.triageNotes || '', placeholder: 'What the forms show, what is missing, and why you decided this', onSave: function (v) { ctx.set('pack.triageNotes', v.trim() ? v : undefined); } });
      return h('div', { class: 'pk-triage' },
        urgent.length ? ui.callout('err', h('div', null, ui.list(urgent), h('p', null, 'Act on this today: open the safety step.'), ui.btn({ label: 'Safety and risk', kind: 'danger', small: true, onClick: function () { ctx.go('risk'); } })), 'Safety flag in the returned forms') : null,
        h('div', { class: 'pk-triage-grid' },
          h('div', null, h('h3', { class: 'pk-h3' }, 'What came back'), h('ul', { class: 'pk-reslist' }, rows),
            h('p', { class: 'hint' }, 'Enter results in Screening questionnaires and Co-occurring conditions; they show here.')),
          h('div', null, h('h3', { class: 'pk-h3' }, 'Decision'),
            h('div', { class: 'pk-choices', role: 'radiogroup', 'aria-label': 'Triage decision' }, arr(data.triage).map(function (t) {
              var on = pk.triage === t.id;
              return h('button', { type: 'button', role: 'radio', 'aria-checked': on ? 'true' : 'false', class: 'pk-choice' + (on ? ' is-on' : '') + ' pk-choice-' + t.id,
                onclick: function () { ctx.set('pack.triage', on ? undefined : t.id); paintTabs(); } },
                h('span', { class: 'pk-choice-t' }, t.label), t.when ? h('span', { class: 'pk-choice-d' }, t.when) : null);
            })),
            ui.field('Triage notes', notes))));
    }

    /* ---------- 4. book the interview ---------- */
    function bookTab() {
      var a = ctx.a() || {}, iv = obj(obj(a.pack).interview), inf = obj(iv.informants);
      var time = h('input', { type: 'time', value: iv.time || '', class: 'pk-date', 'aria-label': 'Interview time' });
      time.addEventListener('change', function () { ctx.set('pack.interview.time', time.value || undefined); });
      var apptTpl = arr(data.templates).filter(function (t) { return /appoint|interview/i.test(t.id + ' ' + t.title); })[0];
      return h('div', { class: 'pk-book' },
        h('div', { class: 'pk-book-grid' },
          ui.field('Date of the DIVA interview', dateInput(iv.date, function (v) { ctx.set('pack.interview.date', v); }, 'Interview date')),
          ui.field('Time', time),
          h('div', { class: 'field' }, h('label', null, 'How'), ui.seg({ label: 'How the interview happens', hideLabel: true, value: iv.mode || null,
            options: [{ v: 'in_person', l: 'In person' }, { v: 'video', l: 'Video' }, { v: 'phone', l: 'Phone' }], onChange: function (v) { ctx.set('pack.interview.mode', nil(v)); } }))),
        h('div', { class: 'pk-inv' }, h('p', { class: 'pk-h3' }, 'Invited to the interview'),
          ui.check({ label: 'Partner or close friend (adulthood)', checked: !!inf.partner, onChange: function (on) { ctx.set('pack.interview.informants.partner', on || undefined); } }),
          ui.check({ label: 'Parent or older relative (childhood, age 5 to 12)', checked: !!inf.parent, onChange: function (on) { ctx.set('pack.interview.informants.parent', on || undefined); } })),
        ui.field('Notes for the appointment', ui.input({ rows: 2, value: iv.notes || '', placeholder: 'For example: interpreter needed, mother joins by phone for childhood', onSave: function (v) { ctx.set('pack.interview.notes', v.trim() ? v : undefined); } })),
        h('div', { class: 'row' },
          apptTpl ? ui.btn({ label: 'Appointment letter', kind: 'secondary', onClick: function () { openTemplate(apptTpl.id); } }) : null,
          ui.btn({ label: 'Go to the DIVA interview →', kind: 'quiet', onClick: function () { ctx.go('ia'); } })));
    }

    paintHero(); paintLine(); paintTabs();
    var repaint = U.debounce(function () { paintHero(); paintLine(); }, 150);
    ctx.onChange('pack', repaint);
    ctx.onChange('tools', repaint);
    return null;
  } };
})(window.AA);
