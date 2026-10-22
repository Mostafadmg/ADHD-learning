/* App shell: top bar, sidebar navigation, sign-in, home dashboard and the About & data page. */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui;
  var shell = AA.shell = {};

  var ICONS = {"home": "<path d=\"M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z\"/>", "assess": "<path d=\"M9 3h6l1 2h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3z\"/><path d=\"M8.5 13l2.5 2.5 4.5-5\"/>", "new": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 8v8M8 12h8\"/>", "bank": "<circle cx=\"11\" cy=\"11\" r=\"6.5\"/><path d=\"M20 20l-4.2-4.2\"/>", "ddxguide": "<path d=\"M4 6h3M4 12h3M4 18h3\"/><path d=\"M10 6h10M10 12h10M10 18h10\"/>", "ddx": "<path d=\"M7 4 3 8l4 4\"/><path d=\"M3 8h14\"/><path d=\"M17 12l4 4-4 4\"/><path d=\"M21 16H7\"/>", "criteria": "<path d=\"M6 3h9l4 4v14H6z\"/><path d=\"M14 3v5h5M9 12h7M9 16h7\"/>", "forms": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"m3 7 9 6 9-6\"/>", "tools": "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\"/><path d=\"M8 8h8M8 12h8M8 16h5\"/>", "pathway": "<circle cx=\"5\" cy=\"6\" r=\"2\"/><circle cx=\"19\" cy=\"18\" r=\"2\"/><path d=\"M7 6h7a3 3 0 0 1 0 6H10a3 3 0 0 0 0 6h7\"/>", "learn": "<path d=\"M2 9l10-5 10 5-10 5z\"/><path d=\"M6 11v5c3 2 9 2 12 0v-5\"/>", "cases": "<rect x=\"3\" y=\"7\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12h18\"/>", "glossary": "<path d=\"M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h13\"/>", "about": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v6M12 7.5v.5\"/>"};
  function icon(k) { return h('span', { class: 'nav-ico', 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[k] || '') + '</svg>' }); }

  var NAV = [
    { title: 'Workspace', items: [
      { go: 'home', label: 'Home', ico: '⌂' },
      { go: 'assess', label: 'Assessment', ico: '✎', meta: function () { var a = shell.lastAssessment(); return a ? (a.patient.ref || 'Untitled') : ''; } },
      { go: 'new', label: 'New assessment', ico: '+' }
    ] },
    { title: 'During the interview', items: [
      { go: 'bank', label: 'Question bank', ico: '?' },
      { go: 'ddxguide', label: 'Differential protocol', ico: '✓' },
      { go: 'ddx', label: 'Differential diagnosis', ico: '⇄' },
      { go: 'criteria', label: 'Diagnostic criteria', ico: '≡' }
    ] },
    { title: 'Library', items: [
      { go: 'forms', label: 'Pre-appointment forms', ico: '✉' },
      { go: 'tools', label: 'Tools and scoring', ico: '▤' },
      { go: 'pathway', label: 'Assessment pathway', ico: '→' }
    ] },
    { title: 'Learn', items: [
      { go: 'learn', label: 'Assessor training', ico: '◆' },
      { go: 'cases', label: 'Practice cases', ico: '◎' },
      { go: 'glossary', label: 'Glossary', ico: 'Aa' }
    ] },
    { title: '', items: [{ go: 'about', label: 'About, privacy and data', ico: 'i' }] }
  ];

  shell.lastAssessment = function () {
    var id = AA.progress.get('lastAssessment', null);
    var a = id ? AA.assess.get(id) : null;
    return a && AA.auth.current() && a.clinicianId === AA.auth.current().id ? a : null;
  };

  function renderNav(route) {
    var side = U.$('#sidebar');
    U.clear(side);
    var name = route ? route.name : '';
    var map = { tool: 'tools', module: 'learn', quiz: 'learn', exam: 'learn', 'case': 'cases', cond: 'ddx', sym: 'bank', form: 'forms' };
    var active = map[name] || name;
    NAV.forEach(function (g) {
      side.appendChild(h('div', { class: 'nav-group' },
        g.title ? h('p', { class: 'nav-group-title' }, g.title) : null,
        h('ul', { class: 'nav' }, g.items.map(function (it) {
          var meta = typeof it.meta === 'function' ? it.meta() : it.meta;
          return h('li', null, h('a', { href: '#' + it.go, 'data-go': it.go, 'aria-current': active === it.go ? 'page' : null },
            icon(it.go), h('span', null, it.label), meta ? h('span', { class: 'nav-meta' }, meta) : null));
        }))));
    });
    var me = AA.auth.current();
    if (me) side.appendChild(h('div', { class: 'side-account' },
      h('p', { class: 'who-line' }, me.name + (me.role ? ' · ' + me.role : '')),
      h('div', { class: 'row' },
        ui.btn({ label: 'Theme', small: true, kind: 'ghost', onClick: function () { U.$('#theme-btn').click(); } }),
        ui.btn({ label: 'Sign out', small: true, kind: 'ghost', onClick: function () { U.$('#signout-btn').click(); } }))));
  }

  function setDrawer(open) {
    U.$('#sidebar').classList.toggle('open', open);
    U.$('#scrim').classList.toggle('open', open);
    U.$('#menu-btn').setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function renderChrome(route) {
    var signedIn = !!AA.auth.current() && route.name !== 'signin';
    U.$('#topbar').hidden = !signedIn;
    U.$('#sidebar').hidden = !signedIn;
    U.$('#layout').style.display = signedIn ? '' : 'block';
    U.$('#main').classList.toggle('main-bare', !signedIn);
    /* Close the phone drawer on every route change, including sign-out (its scrim would block the sign-in page). */
    setDrawer(false);
    if (!signedIn) return;
    var me = AA.auth.current();
    U.$('#who').textContent = me.name + (me.role ? ' · ' + me.role : '');
    renderChip();
    renderNav(route);
    U.$('#view').parentNode.classList.toggle('main-wide', route.name === 'assess');
    U.$('#view').className = 'main-inner' + (route.name === 'assess' ? ' wide' : '');
  }

  /* Current patient chip in the top bar (also refreshed while the patient details are typed). */
  function renderChip() {
    var a = AA.auth.current() ? shell.lastAssessment() : null;
    var chip = U.$('#patient-chip');
    chip.hidden = !a;
    if (!a) return;
    chip.textContent = (a.patient.ref || 'Untitled patient') + (a.patient.age ? ', ' + a.patient.age + ' y' : '');
    chip.title = 'Open the current assessment';
    chip.onclick = function () { AA.router.go('assess-' + a.id + '-' + (a.step || 'setup')); };
  }

  function renderSave() {
    var el = U.$('#save-state');
    if (!el) return;
    var s = AA.store.saveStatus();
    el.className = 'save-state' + (s === 'unavailable' ? ' err' : '');
    el.textContent = s === 'unavailable' ? 'Not saved: browser storage blocked' : s === 'saving' ? 'Saving…' : 'Saved on this device';
  }

  /* ---------- Theme ---------- */
  function applyTheme(t) {
    var root = document.documentElement;
    if (t === 'dark' || t === 'light') root.setAttribute('data-theme', t); else root.removeAttribute('data-theme');
    var btn = U.$('#theme-btn');
    if (btn) btn.title = 'Theme: ' + (t || 'system');
  }

  /* ---------- Sign-in ---------- */
  AA.router.register('signin', { title: 'Sign in', render: function (el) {
    var profiles = AA.auth.list();
    var formHost = h('div', { class: 'stack' });

    function pinPrompt(p) {
      U.clear(formHost);
      var pin = h('input', { type: 'password', inputmode: 'numeric', autocomplete: 'current-password', id: 'pin-in', maxlength: '12' });
      var err = h('p', { class: 'hint', role: 'alert' });
      var go = function () {
        AA.auth.signIn(p.id, pin.value).then(function (ok) {
          if (ok) AA.router.go('home'); else { err.textContent = 'That PIN does not match. Try again.'; pin.value = ''; pin.focus(); }
        });
      };
      pin.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
      formHost.appendChild(h('h2', null, 'Welcome back, ' + p.name));
      formHost.appendChild(ui.field('PIN', pin));
      formHost.appendChild(err);
      formHost.appendChild(h('div', { class: 'row' }, ui.btn({ label: 'Sign in', kind: 'primary', onClick: go }), ui.btn({ label: 'Back', kind: 'ghost', onClick: showChooser })));
      pin.focus();
    }

    function showCreate() {
      U.clear(formHost);
      var name = h('input', { type: 'text', id: 'p-name', autocomplete: 'name', placeholder: 'e.g. Dr Sam Patel' });
      var role = h('select', { id: 'p-role' }, ['Psychiatrist', 'Trainee psychiatrist', 'GP with extended role', 'Specialist nurse / NMP', 'Clinical psychologist', 'Paediatrician', 'Pharmacist', 'Student', 'Other'].map(function (r) { return h('option', null, r); }));
      var pin = h('input', { type: 'password', id: 'p-pin', inputmode: 'numeric', autocomplete: 'new-password', maxlength: '12', placeholder: 'Optional, 4 or more digits' });
      var err = h('p', { class: 'hint', role: 'alert' });
      var create = function () {
        if (!name.value.trim()) { err.textContent = 'Enter your name.'; name.focus(); return; }
        if (pin.value && !/^\d{4,12}$/.test(pin.value)) { err.textContent = 'The PIN must be 4 to 12 digits, or left empty.'; pin.focus(); return; }
        AA.auth.create({ name: name.value, role: role.value, pin: pin.value }).then(function () { AA.router.go('home'); });
      };
      formHost.appendChild(h('h2', null, 'Create your clinician profile'));
      formHost.appendChild(ui.field('Name', name));
      formHost.appendChild(ui.field('Role', role));
      formHost.appendChild(ui.field('PIN to lock this profile', pin, 'Stops casual access on a shared computer. It is not encryption.'));
      formHost.appendChild(err);
      formHost.appendChild(h('div', { class: 'row' }, ui.btn({ label: 'Create profile', kind: 'primary', onClick: create }),
        profiles.length ? ui.btn({ label: 'Back', kind: 'ghost', onClick: showChooser }) : null));
      name.focus();
    }

    function showChooser() {
      U.clear(formHost);
      if (!profiles.length) { showCreate(); return; }
      formHost.appendChild(h('h2', null, 'Choose your profile'));
      formHost.appendChild(h('div', { class: 'profile-list' }, profiles.map(function (p) {
        return h('button', { type: 'button', class: 'profile-btn', onclick: function () {
          if (AA.auth.needsPin(p.id)) pinPrompt(p); else AA.auth.signIn(p.id).then(function () { AA.router.go('home'); });
        } }, h('span', { class: 'avatar', 'aria-hidden': 'true' }, initials(p.name)),
          h('span', null, h('strong', null, p.name), h('span', { class: 'check-hint' }, (p.role || 'Clinician') + (p.pinHash ? ' · PIN' : ''))));
      })));
      formHost.appendChild(h('div', { class: 'row' }, ui.btn({ label: 'New profile', kind: 'ghost', onClick: showCreate })));
    }

    var demoBtn = ui.btn({ label: 'Explore with a demo patient', kind: 'secondary', onClick: function () {
      var existing = AA.auth.list().filter(function (p) { return p.guest; })[0];
      var start = existing ? AA.auth.signIn(existing.id).then(function () { return existing; }) : AA.auth.create({ name: 'Demo clinician', role: 'Guest', guest: true });
      start.then(function () {
        var id = shell.loadDemo();
        AA.router.go(id ? 'assess-' + id + '-summary' : 'home');
      });
    } });

    el.appendChild(h('div', { class: 'signin' }, h('div', { class: 'signin-card' },
      h('section', { class: 'signin-intro' },
        h('p', { class: 'eyebrow' }, 'Adult ADHD · clinician workspace'),
        h('h1', null, 'ADHD Assessment'),
        h('p', null, 'Run a full adult ADHD assessment step by step: screening questionnaires with instant scoring, a DIVA-style interview of all 18 symptoms with hundreds of example questions, onset and impairment, collateral history, differential diagnosis and a scored conclusion with a draft report.'),
        h('ul', null,
          h('li', null, 'Learn the method in the assessor training, then practise on cases.'),
          h('li', null, 'Use it live in clinic: read the question, tick what the patient describes, score as you go.'),
          h('li', null, 'Everything is stored only in this browser. Use a patient reference, not a name.')),
        h('p', { class: 'signin-note' }, 'Decision support for qualified clinicians. It does not replace clinical judgement, local policy or the licensed instruments.')),
      h('section', { class: 'signin-form' }, formHost, h('hr', { class: 'sep' }), h('div', null, h('p', { class: 'hint' }, 'No profile yet? You can look around first.'), demoBtn)))));
    showChooser();
  } });

  function initials(n) { return String(n || '?').split(/\s+/).filter(Boolean).slice(-2).map(function (x) { return x[0].toUpperCase(); }).join(''); }

  /* ---------- Demo ---------- */
  shell.loadDemo = function () {
    var demo = AA.data.demo;
    if (!demo) { U.toast('The demo case is not available.', 'warn'); return null; }
    var rec = JSON.parse(JSON.stringify(demo));
    rec.demo = true;
    var id = AA.assess.insert(rec);
    AA.progress.set('lastAssessment', id);
    return id;
  };

  /* ---------- New assessment ---------- */
  AA.router.register('new', { title: 'New assessment', render: function () {
    var id = AA.assess.create({});
    AA.progress.set('lastAssessment', id);
    setTimeout(function () { AA.router.go('assess-' + id + '-setup'); }, 0);
  } });

  /* ---------- Home ---------- */
  AA.router.register('home', { title: 'Home', render: function (el) {
    var me = AA.auth.current();
    var list = AA.assess.list();
    var active = list.filter(function (a) { return a.status !== 'complete'; });
    var done = list.filter(function (a) { return a.status === 'complete'; });
    var mods = AA.data.learn || [];
    var modsDone = mods.filter(function (m) { return AA.progress.get('modules.' + m.id + '.done', false); }).length;

    /* "Dr Sam Patel" greets as "Dr Patel", "Sam Patel" as "Sam". */
    var nm = String(me.name || '').trim().split(/\s+/);
    var greet = nm.length > 1 && /^(dr|prof|professor|mr|mrs|ms|miss|mx)\.?$/i.test(nm[0]) ? nm[0] + ' ' + nm[nm.length - 1] : nm[0];
    el.appendChild(ui.pageHead({ eyebrow: 'Workspace', title: 'Welcome, ' + greet,
      lead: 'Start or continue an assessment, look something up during the interview, or keep training.',
      actions: [ui.btn({ label: 'New assessment', kind: 'primary', go: 'new', icon: '+' }), ui.btn({ label: 'Load demo patient', kind: 'ghost', onClick: function () {
        var id = shell.loadDemo(); if (id) AA.router.go('assess-' + id + '-summary');
      } })] }));

    el.appendChild(h('div', { class: 'stat-row' },
      stat('In progress', active.length), stat('Completed', done.length),
      stat('Training modules', modsDone + ' / ' + mods.length), stat('Practice cases', Object.keys(AA.progress.get('cases', {}) || {}).length + ' / ' + (AA.data.cases || []).length)));

    var sec = h('section', { class: 'section' }, h('h2', null, 'Your assessments'));
    if (!list.length) {
      sec.appendChild(ui.empty('No assessments yet', 'Start a new one, or open the demo patient to see a completed assessment with scores and a report.',
        h('div', { class: 'row', style: { justifyContent: 'center' } }, ui.btn({ label: 'New assessment', kind: 'primary', go: 'new' }))));
    } else {
      sec.appendChild(h('div', { class: 'a-list' }, list.map(assessmentRow)));
    }
    el.appendChild(sec);

    el.appendChild(h('section', { class: 'section' }, h('h2', null, 'How to use this app'),
      h('div', { class: 'grid home-steps' },
        quick('1 · Learn', 'Assessor training', 'Criteria, interview technique, scoring rules, differentials and report writing, each with a quiz.', 'learn'),
        quick('2 · Practise', 'Practice cases', 'Work through realistic adult cases and compare your decisions with the expert answer.', 'cases'),
        quick('3 · Assess', 'Run an assessment', 'Thirteen guided steps from consent to report. Each step tells you what to do, and scores update as you go.', 'new'))));
    el.appendChild(h('section', { class: 'section' }, h('h2', null, 'Look things up'),
      h('ul', { class: 'home-links' },
        link('Question bank', 'Every interview question and example, by symptom, life area or keyword.', 'bank'),
        link('Differential protocol', 'A step-by-step method so no alternative explanation is missed.', 'ddxguide'),
        link('Pre-appointment forms', 'What each questionnaire is, how to read it and what the result means.', 'forms'),
        link('Tools and scoring', 'Every screening and rating tool: when to use it, how to score it, where to get it.', 'tools'))));
  } });

  function stat(k, v) { return h('div', { class: 'stat' }, h('div', { class: 'stat-k' }, k), h('div', { class: 'stat-v' }, String(v))); }
  function quick(eyebrow, title, body, go) {
    return h('a', { class: 'card card-link', href: '#' + go, 'data-go': go }, h('p', { class: 'eyebrow' }, eyebrow), h('h3', null, title), h('p', { class: 'muted' }, body));
  }
  function link(title, body, go) {
    return h('li', null, h('a', { class: 'home-link', href: '#' + go, 'data-go': go },
      h('span', { class: 'home-link-ico' }, icon(go)), h('span', { class: 'home-link-text' }, h('strong', null, title), h('span', null, body))));
  }
  /* Where an assessment is up to: steps complete and the step it is on. */
  function stepState(a) {
    var steps = AA.STEP_LIST || [];
    var done = steps.filter(function (s) { var pr = AA.diagnosis.stepProgress(a, s.id); return pr.done >= pr.of; }).length;
    var cur = steps.filter(function (s) { return s.id === (a.step || 'setup'); })[0];
    var idx = steps.indexOf(cur);
    return { done: done, of: steps.length, label: cur ? 'Step ' + (idx + 1) + ': ' + cur.title : '' };
  }

  function assessmentRow(a) {
    var out = AA.diagnosis.outcome(a);
    var kinds = { met: 'ok', 'not-met': 'neutral', subthreshold: 'warn', 'better-explained': 'info', incomplete: 'neutral' };
    var labels = { met: 'Criteria met', 'not-met': 'Criteria not met', subthreshold: 'Subthreshold', 'better-explained': 'Better explained', incomplete: 'In progress' };
    var p = a.patient || {};
    var st = stepState(a);
    return h('div', { class: 'a-row' },
      h('div', { class: 'a-row-main' },
        h('div', { class: 'a-row-title' }, (p.ref || 'Untitled patient') + (a.demo ? ' (demo)' : ''),
          ui.badge(labels[out.code], kinds[out.code]), a.status === 'complete' ? ui.badge('Completed', 'accent') : null),
        h('div', { class: 'a-row-meta' },
          h('span', null, [p.age ? p.age + ' y' : null, p.sex || null].filter(Boolean).join(', ') || 'Age not recorded'),
          h('span', null, 'Updated ' + U.fmtDate(a.updatedAt, true))),
        st.of ? h('div', { class: 'a-row-prog' },
          ui.progress(st.done, st.of, 'Steps complete'),
          h('span', { class: 'a-row-step' }, st.done + ' of ' + st.of + ' steps complete' + (a.status !== 'complete' && st.label ? ' · ' + st.label : ''))) : null),
      h('div', { class: 'a-row-actions' },
        ui.btn({ label: a.status === 'complete' ? 'Open' : 'Continue', kind: 'primary', small: true, onClick: function () {
          AA.progress.set('lastAssessment', a.id); AA.router.go('assess-' + a.id + '-' + (a.step || 'setup'));
        } }),
        ui.btn({ label: 'Delete', kind: 'quiet', small: true, onClick: function () {
          U.confirm({ title: 'Delete this assessment?', body: 'All answers and notes for ' + (p.ref || 'this patient') + ' will be removed from this browser. This cannot be undone.', ok: 'Delete', danger: true })
            .then(function (yes) { if (yes) { AA.assess.remove(a.id); U.toast('Assessment deleted'); AA.router.refresh(); } });
        } })));
  }

  /* ---------- About, privacy and data ---------- */
  AA.router.register('about', { title: 'About and data', render: function (el) {
    el.appendChild(ui.pageHead({ eyebrow: 'About', title: 'About, privacy and data' }));
    el.appendChild(h('div', { class: 'grid-2' },
      h('section', { class: 'card' }, h('h2', null, 'What this app is'),
        h('p', null, 'A training and decision-support workspace for clinicians who assess adults for ADHD. It follows the structure of the DIVA diagnostic interview (Kooij and Francken) and the DSM-5-TR and ICD-11 criteria, with UK NICE NG87 and international guidance for the wider assessment.'),
        h('p', null, 'Interview questions and examples in this app are written for it. They do not reproduce the licensed DIVA-5 forms. Licensed instruments (for example DIVA-5, CAARS 2, BAARS-IV) are described and linked, not copied.'),
        h('p', { class: 'muted' }, 'It supports, and never replaces, a qualified clinician\'s judgement, local policy and the official instruments.')),
      h('section', { class: 'card' }, h('h2', null, 'Privacy'),
        h('p', null, 'Everything you enter stays in this browser (localStorage). Nothing is sent to a server. Anyone using this browser profile can read the data unless your profile has a PIN, and the PIN is a lock, not encryption.'),
        h('p', null, 'Use a patient reference or initials, not names or NHS numbers. Copy the final report into your clinical record system, then delete the assessment here.'))));

    var fileIn = h('input', { type: 'file', accept: 'application/json,.json', id: 'import-file', class: 'sr-only' });
    fileIn.addEventListener('change', function () {
      var f = fileIn.files && fileIn.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var data;
        try { data = JSON.parse(String(r.result)); } catch (e) { U.toast('That file is not valid JSON.', 'err'); return; }
        U.confirm({ title: 'Replace all data in this browser?', body: 'Profiles, assessments and training progress here will be replaced by the file\'s contents.', ok: 'Replace', danger: true }).then(function (yes) {
          if (!yes) return;
          try { AA.store.replaceAll(data); AA.auth.signOut(); AA.router.go('signin'); U.toast('Data imported. Sign in again.', 'ok'); } catch (e) { U.toast(e.message, 'err'); }
        });
      };
      r.readAsText(f);
    });
    el.appendChild(h('section', { class: 'section card' }, h('h2', null, 'Your data'),
      h('p', null, 'Export a backup to move your work to another computer. Import replaces everything stored here.'),
      h('div', { class: 'row' },
        ui.btn({ label: U.isEmbedded ? 'Copy backup as text' : 'Export backup (.json)', onClick: function () {
          var text = AA.store.exportJSON();
          if (U.isEmbedded || !U.download('adhd-assessment-backup-' + U.today() + '.json', text)) {
            U.copyText(text).then(function (ok) { U.toast(ok ? 'Backup copied to the clipboard' : 'Copy failed. Your browser blocked the clipboard.', ok ? 'ok' : 'err'); });
          } else U.toast('Backup saved', 'ok');
        } }),
        h('label', { for: 'import-file', class: 'btn' }, 'Import backup'), fileIn,
        ui.btn({ label: 'Delete everything', kind: 'danger', onClick: function () {
          U.confirm({ title: 'Delete all data in this browser?', body: 'All profiles, assessments and training progress will be removed. This cannot be undone.', ok: 'Delete everything', danger: true }).then(function (yes) {
            if (yes) { AA.store.reset(); AA.auth.signOut(); AA.router.go('signin'); }
          });
        } }))));
    el.appendChild(h('p', { class: 'source' }, 'Version ' + AA.version + '. Content checked October 2026.'));
  } });

  /* ---------- Boot wiring ---------- */
  shell.init = function () {
    applyTheme(AA.store.get('prefs.theme', 'system'));
    /* Crisp menu icon (the markup has a text glyph as a fallback). */
    U.$('#menu-btn').innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2.5 4.5h13M2.5 9h13M2.5 13.5h13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    U.$('#theme-btn').addEventListener('click', function () {
      var order = ['system', 'dark', 'light'];
      var cur = AA.store.get('prefs.theme', 'system');
      var next = order[(order.indexOf(cur) + 1) % order.length];
      AA.store.set('prefs.theme', next); applyTheme(next);
      U.toast('Theme: ' + next);
    });
    U.$('#signout-btn').addEventListener('click', function () { AA.store.flush(); AA.auth.signOut(); AA.router.go('signin'); });
    U.$('#menu-btn').addEventListener('click', function () { setDrawer(!U.$('#sidebar').classList.contains('open')); });
    U.$('#scrim').addEventListener('click', function () { setDrawer(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });
    U.$('[data-skip]').addEventListener('click', function (e) { e.preventDefault(); U.$('#view').focus(); });
    AA.router.onChange(renderChrome);
    AA.store.subscribe('__save', renderSave);
    AA.store.subscribe('assessments', U.debounce(renderChip, 300));
    renderSave();

    /* Lock PIN-protected profiles after 20 minutes without activity. */
    var last = Date.now();
    ['click', 'keydown', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, function () { last = Date.now(); }, { passive: true }); });
    setInterval(function () {
      var me = AA.auth.current();
      if (me && me.pinHash && Date.now() - last > 20 * 60 * 1000) {
        AA.store.flush(); AA.auth.signOut(); AA.router.go('signin'); U.toast('Locked after 20 minutes without activity');
      }
    }, 30000);
  };
})(window.AA);
