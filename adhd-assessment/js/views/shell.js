/* App shell: top bar, sidebar navigation, sign-in, home dashboard and the About & data page. */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui;
  var shell = AA.shell = {};

  var NAV = [
    { title: 'Workspace', items: [
      { go: 'home', label: 'Home', ico: '⌂' },
      { go: 'assess', label: 'Assessment', ico: '✎', meta: function () { var a = shell.lastAssessment(); return a ? (a.patient.ref || 'Untitled') : ''; } },
      { go: 'new', label: 'New assessment', ico: '+' }
    ] },
    { title: 'During the interview', items: [
      { go: 'bank', label: 'Question bank', ico: '?' },
      { go: 'ddx', label: 'Differential diagnosis', ico: '⇄' },
      { go: 'criteria', label: 'Diagnostic criteria', ico: '≡' }
    ] },
    { title: 'Library', items: [
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
    var map = { tool: 'tools', module: 'learn', quiz: 'learn', exam: 'learn', 'case': 'cases', cond: 'ddx', sym: 'bank' };
    var active = map[name] || name;
    NAV.forEach(function (g) {
      side.appendChild(h('div', { class: 'nav-group' },
        g.title ? h('p', { class: 'nav-group-title' }, g.title) : null,
        h('ul', { class: 'nav' }, g.items.map(function (it) {
          var meta = typeof it.meta === 'function' ? it.meta() : it.meta;
          return h('li', null, h('a', { href: '#' + it.go, 'data-go': it.go, 'aria-current': active === it.go ? 'page' : null },
            h('span', { class: 'nav-ico', 'aria-hidden': 'true' }, it.ico), h('span', null, it.label), meta ? h('span', { class: 'nav-meta' }, meta) : null));
        }))));
    });
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
    if (!signedIn) return;
    var me = AA.auth.current();
    U.$('#who').textContent = me.name + (me.role ? ' · ' + me.role : '');
    var a = shell.lastAssessment();
    var chip = U.$('#patient-chip');
    chip.hidden = !a;
    if (a) {
      chip.textContent = 'Patient: ' + (a.patient.ref || 'Untitled') + (a.patient.age ? ', ' + a.patient.age : '');
      chip.onclick = function () { AA.router.go('assess-' + a.id + '-' + (a.step || 'setup')); };
    }
    renderNav(route);
    setDrawer(false);
    U.$('#view').parentNode.classList.toggle('main-wide', route.name === 'assess');
    U.$('#view').className = 'main-inner' + (route.name === 'assess' ? ' wide' : '');
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
        h('p', { class: 'eyebrow', style: { color: '#7fd6d1' } }, 'Adult ADHD · clinician workspace'),
        h('h1', null, 'ADHD Assessment'),
        h('p', null, 'Run a full adult ADHD assessment step by step: screening questionnaires with instant scoring, a DIVA-style interview of all 18 symptoms with hundreds of example questions, onset and impairment, collateral history, differential diagnosis and a scored conclusion with a draft report.'),
        h('ul', null,
          h('li', null, 'Learn the method in the assessor training, then practise on cases.'),
          h('li', null, 'Use it live in clinic: read the question, tick what the patient describes, score as you go.'),
          h('li', null, 'Everything is stored only in this browser. Use a patient reference, not a name.')),
        h('p', { style: { fontSize: '.85rem' } }, 'Decision support for qualified clinicians. It does not replace clinical judgement, local policy or the licensed instruments.')),
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

    el.appendChild(ui.pageHead({ eyebrow: 'Workspace', title: 'Welcome, ' + me.name.split(' ')[0],
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
      h('div', { class: 'grid' },
        quick('1 · Learn', 'Assessor training', 'Criteria, interview technique, scoring rules, differentials and report writing, each with a quiz.', 'learn'),
        quick('2 · Practise', 'Practice cases', 'Work through realistic adult cases and compare your decisions with the expert answer.', 'cases'),
        quick('3 · Assess', 'Run an assessment', 'Thirteen guided steps from consent to report. Scores and criteria update as you go.', 'new'),
        quick('Any time', 'Question bank', 'Search every interview question and example by symptom, life area or keyword.', 'bank'),
        quick('Any time', 'Differential diagnosis', 'What else could explain the symptoms, and the questions that tell them apart.', 'ddx'),
        quick('Any time', 'Tools and scoring', 'Every screening and rating tool: when to use it, how to score it, where to get it.', 'tools'))));
  } });

  function stat(k, v) { return h('div', { class: 'stat' }, h('div', { class: 'stat-k' }, k), h('div', { class: 'stat-v' }, String(v))); }
  function quick(eyebrow, title, body, go) {
    return h('a', { class: 'card card-link', href: '#' + go, 'data-go': go }, h('p', { class: 'eyebrow' }, eyebrow), h('h3', null, title), h('p', { class: 'muted' }, body));
  }

  function assessmentRow(a) {
    var out = AA.diagnosis.outcome(a);
    var kinds = { met: 'ok', 'not-met': 'neutral', subthreshold: 'warn', 'better-explained': 'info', incomplete: 'neutral' };
    var labels = { met: 'Criteria met', 'not-met': 'Criteria not met', subthreshold: 'Subthreshold', 'better-explained': 'Better explained', incomplete: 'In progress' };
    var p = a.patient || {};
    return h('div', { class: 'a-row' },
      h('div', null,
        h('div', { class: 'a-row-title' }, (p.ref || 'Untitled patient') + (a.demo ? ' (demo)' : '')),
        h('div', { class: 'a-row-meta' },
          h('span', null, [p.age ? p.age + ' y' : null, p.sex || null].filter(Boolean).join(', ') || 'Age not recorded'),
          h('span', null, 'Updated ' + U.fmtDate(a.updatedAt, true)),
          ui.badge(labels[out.code], kinds[out.code]), a.status === 'complete' ? ui.badge('Completed', 'accent') : null)),
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
