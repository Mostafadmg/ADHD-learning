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
      { go: 'ddx', label: 'Conditions A to Z', ico: '⇄' },
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
    ] }
  ];

  /* The last assessment page visited in this session (including the symptom card), kept in memory only,
     so "back to the assessment" links return to the same place rather than the start of the step. */
  var lastAssessRoute = null, toolsOpen = false;
  shell.noteRoute = function (token) { lastAssessRoute = token; };
  shell.resumeRoute = function (a) {
    if (!a) return 'home';
    return lastAssessRoute && lastAssessRoute.indexOf('assess-' + a.id + '-') === 0 ? lastAssessRoute : 'assess-' + a.id + '-' + (a.step || 'setup');
  };

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
    /* Inside one patient's assessment (or its overview) the sidebar leads with that patient's journey rail;
       the workspace tools move into a closed "Tools and library" group below it. */
    var rail = null, jnId = route && (name === 'assess' || name === 'journey') ? route.params[0] : null;
    var jnAssess = jnId && AA.journeyUI && AA.auth.current() ? AA.assess.get(jnId) : null;
    if (jnAssess && jnAssess.clinicianId !== AA.auth.current().id) jnAssess = null;
    var host = side;
    if (jnAssess) {
      var railHost = h('div', { id: 'jn-rail' });
      side.appendChild(railHost);
      var step = name === 'journey' ? jnAssess.step : route.params[1] || jnAssess.step;
      if (!AA.journey || AA.journey.index(step) < 0) step = AA.journey && AA.journey.index(jnAssess.step) > -1 ? jnAssess.step : 'setup';
      AA.journeyUI.rail(railHost, jnAssess, step, name === 'journey');
      rail = h('details', { class: 'jn-tools', open: toolsOpen ? true : null, ontoggle: function (e) { toolsOpen = e.currentTarget.open; } }, h('summary', null, 'Tools and library'));
      side.appendChild(rail);
      host = rail;
    }
    NAV.forEach(function (g) {
      host.appendChild(h('div', { class: 'nav-group' },
        g.title ? h('p', { class: 'nav-group-title' }, g.title) : null,
        h('ul', { class: 'nav' }, g.items.map(function (it) {
          var meta = typeof it.meta === 'function' ? it.meta() : it.meta;
          return h('li', null, h('a', { href: '#' + it.go, 'data-go': it.go, 'aria-current': active === it.go ? 'page' : null },
            icon(it.go), h('span', null, it.label), meta ? h('span', { class: 'nav-meta' }, meta) : null));
        }))));
    });
    /* About, and one website: a way back to the main ADHD course (the workspace lives in its adhd-assessment/ folder). */
    host.appendChild(h('div', { class: 'nav-group nav-foot' },
      h('ul', { class: 'nav' },
        h('li', null, h('a', { href: '#about', 'data-go': 'about', 'aria-current': active === 'about' ? 'page' : null }, icon('about'), h('span', null, 'About, privacy and data'))),
        h('li', null, h('a', { href: '../index.html#home' }, icon('learn'), h('span', null, 'Back to the ADHD course'))))));
  }

  function setDrawer(open) {
    U.$('#sidebar').classList.toggle('open', open);
    U.$('#scrim').classList.toggle('open', open);
    U.$('#menu-btn').setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  /* The journey bar above a step opens the drawer at the step list, with the current step in view. */
  shell.openSteps = function () {
    setDrawer(true);
    setTimeout(function () {
      var cur = U.$('#sidebar .jn-step[aria-current="step"]') || U.$('#sidebar .jn-next') || U.$('#sidebar a');
      if (cur) { try { cur.scrollIntoView({ block: 'center' }); } catch (e) { /* old browsers */ } cur.focus(); }
    }, 60);
  };

  /* ---------- Account menu (top bar) ---------- */
  function setAcct(open) {
    var m = U.$('#acct-menu'), b = U.$('#acct-btn');
    if (!m || !b) return;
    m.hidden = !open;
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      paintAcct();
      var first = m.querySelector('.acct-tsel button[aria-pressed="true"], .acct-item');
      if (first) first.focus();
    }
  }
  function paintAcct() {
    var host = U.$('#acct-items');
    if (!host) return;
    U.clear(host);
    var cur = AA.store.get('prefs.theme', 'system');
    var opts = [['system', 'Rx portal'], ['light', 'Light'], ['dark', 'Dark']];
    host.appendChild(h('div', { class: 'acct-theme' },
      h('p', { class: 'acct-theme-l', id: 'acct-theme-l' }, 'Theme'),
      h('div', { class: 'acct-tsel', role: 'group', 'aria-labelledby': 'acct-theme-l' }, opts.map(function (o) {
        return h('button', { type: 'button', 'aria-pressed': cur === o[0] ? 'true' : 'false', title: o[0] === 'system' ? 'Match the EveryDayMeds Rx portal' : null,
          onclick: function () { AA.store.set('prefs.theme', o[0]); applyTheme(o[0]); paintAcct(); var b = U.$('.acct-tsel button[aria-pressed="true"]'); if (b) b.focus(); } }, o[1]);
      }))));
    host.appendChild(h('div', { class: 'acct-sep', role: 'presentation' }));
    host.appendChild(h('a', { class: 'acct-item', href: '#about', 'data-go': 'about' }, ui.icon('shield'), 'About, privacy and data'));
    host.appendChild(h('a', { class: 'acct-item', href: '../index.html#home' }, ui.icon('book'), 'Back to the ADHD course'));
    host.appendChild(h('div', { class: 'acct-sep', role: 'presentation' }));
  }

  function renderChrome(route) {
    var signedIn = !!AA.auth.current() && route.name !== 'signin';
    U.$('#topbar').hidden = !signedIn;
    U.$('#sidebar').hidden = !signedIn;
    U.$('#layout').style.display = signedIn ? '' : 'block';
    U.$('#main').classList.toggle('main-bare', !signedIn);
    /* Close the phone drawer on every route change, including sign-out (its scrim would block the sign-in page). */
    setDrawer(false);
    setAcct(false);
    if (!signedIn) return;
    var me = AA.auth.current();
    U.$('#who').textContent = me.name;
    var roleEl = U.$('#who-role');
    if (roleEl) roleEl.textContent = me.role || 'Clinician';
    ['#acct-av', '#acct-av2'].forEach(function (sel) { var av = U.$(sel); if (av) av.textContent = initials(me.name); });
    var ab = U.$('#acct-btn');
    if (ab) ab.setAttribute('aria-label', 'Account and settings: ' + me.name);
    renderChip();
    renderNav(route);
    var wide = route.name === 'assess' || route.name === 'journey';
    U.$('#view').parentNode.classList.toggle('main-wide', wide);
    U.$('#view').className = 'main-inner' + (wide ? ' wide' : '');
  }

  /* Current patient chip in the top bar (also refreshed while the patient details are typed). */
  function renderChip() {
    var a = AA.auth.current() ? shell.lastAssessment() : null;
    var chip = U.$('#patient-chip');
    chip.hidden = !a;
    if (!a) return;
    U.clear(chip);
    chip.appendChild(h('span', { class: 'pc-av', 'aria-hidden': 'true' }, ui.icon('user')));
    chip.appendChild(h('span', { class: 'pc-t' }, a.patient.ref || 'Untitled patient'));
    if (a.patient.age) chip.appendChild(h('span', { class: 'pc-m' }, a.patient.age + ' y'));
    chip.title = 'Open the current assessment';
    chip.setAttribute('aria-label', 'Current patient: ' + (a.patient.ref || 'Untitled patient') + (a.patient.age ? ', ' + a.patient.age + ' years' : '') + '. Open the assessment.');
    chip.onclick = function () { AA.router.go(shell.resumeRoute(a)); };
  }

  function renderSave() {
    var el = U.$('#save-state');
    if (!el) return;
    var s = AA.store.saveStatus();
    el.className = 'save-state' + (s === 'unavailable' ? ' err' : s === 'saving' ? ' is-saving' : '');
    el.textContent = s === 'unavailable' ? 'Not saved: browser storage blocked' : s === 'saving' ? 'Saving…' : 'Saved on this device';
  }

  /* ---------- Theme ---------- */
  /* 'system' means "match the EveryDayMeds Rx portal": the workspace opens inside the Rx portal as a tab,
     and the portal keeps its theme in localStorage 'pharmacare:rx-theme' ('dark', otherwise light).
     With no Rx setting the workspace is light, like the portal. */
  function rxTheme() {
    try { return window.localStorage.getItem('pharmacare:rx-theme') === 'dark' ? 'dark' : 'light'; } catch (e) { return 'light'; }
  }
  function applyTheme(t) {
    var root = document.documentElement;
    var shown = (t === 'dark' || t === 'light') ? t : rxTheme();
    if (shown === 'dark') root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    var btn = U.$('#theme-btn');
    if (btn) btn.title = 'Theme: ' + (t === 'dark' || t === 'light' ? t : 'match the Rx portal');
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
          if (ok) AA.router.afterSignIn(); else { err.textContent = 'That PIN does not match. Try again.'; pin.value = ''; pin.focus(); }
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
        AA.auth.create({ name: name.value, role: role.value, pin: pin.value }).then(function () { AA.router.afterSignIn(); });
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
          if (AA.auth.needsPin(p.id)) pinPrompt(p); else AA.auth.signIn(p.id).then(function () { AA.router.afterSignIn(); });
        } }, h('span', { class: 'avatar', 'aria-hidden': 'true' }, initials(p.name)),
          h('span', null, h('strong', null, p.name), h('span', { class: 'check-hint' }, (p.role || 'Clinician') + (p.pinHash ? ' · PIN' : ''))));
      })));
      formHost.appendChild(h('div', { class: 'row' }, ui.btn({ label: 'New profile', kind: 'ghost', onClick: showCreate })));
    }

    /* "Look around first": sign in as the guest profile and open a demo patient.
       A deep link waiting for sign-in (for example #new from the course) is dropped here: it is only
       used after a real sign-in, so the demo button always opens the demo. */
    function demoBtn(kind) {
      var young = kind === 'young';
      return h('button', { type: 'button', class: 'si-demo', onclick: function () {
        var existing = AA.auth.list().filter(function (p) { return p.guest; })[0];
        var start = existing ? AA.auth.signIn(existing.id).then(function () { return existing; }) : AA.auth.create({ name: 'Demo clinician', role: 'Guest', guest: true });
        start.then(function () {
          AA.router.takePending();
          var id = shell.loadDemo(kind);
          AA.router.go(id ? 'assess-' + id + '-summary' : 'home');
        });
      } },
        h('span', { class: 'si-demo-ico', 'aria-hidden': 'true' }, ui.icon(young ? 'school' : 'users')),
        h('span', { class: 'si-demo-t' },
          h('strong', null, young ? 'Explore with a child demo' : 'Explore with a demo patient'),
          h('span', null, young ? 'An 8-year-old: assessment and treatment' : 'An adult: DIVA, diagnosis, treatment and report')));
    }

    var feats = [
      ['mail', 'Onboard', 'Send the pre-assessment pack, track what comes back, triage and book.'],
      ['users', 'Interview', 'The DIVA 2.0 for adults, in DIVA\'s own wording from your copy, scored as you go.'],
      ['scale', 'Diagnose', 'Collateral, differentials, the DIVA score form, DSM-5-TR criteria, the filled DIVA form and a draft report.'],
      ['pill', 'Treat', 'Pre-treatment checks, prescribing, titration, monitoring and shared care.'],
      ['book', 'Learn and practise', 'Assessor training with quizzes, then realistic practice cases.']];
    el.appendChild(h('div', { class: 'signin' }, h('div', { class: 'signin-card' },
      h('section', { class: 'signin-intro' },
        h('div', { class: 'si-brand' }, brandMark(), h('span', { class: 'si-brand-t' }, h('strong', null, 'ADHD Assessment'), h('span', null, 'Clinician workspace'))),
        h('h1', null, 'One record from referral to shared care'),
        h('p', { class: 'si-lead' }, 'Assess and treat ADHD in adults and in young people aged 6 to 17, one step at a time. For a child under 6, it helps you refer to a service with expertise in young children.'),
        h('ul', { class: 'si-feats' }, feats.map(function (f) {
          return h('li', { class: 'si-feat' }, h('span', { class: 'si-feat-ico', 'aria-hidden': 'true' }, ui.icon(f[0])), h('span', null, h('strong', null, f[1]), h('span', null, f[2])));
        })),
        h('p', { class: 'si-priv' }, ui.icon('shield'), h('span', null, 'Everything is stored only in this browser. Use a patient reference, never a name. Decision support for qualified clinicians: it does not replace clinical judgement, local policy or the licensed instruments.')),
        h('p', { class: 'si-back' }, h('a', { href: '../index.html#home' }, '← Back to the ADHD course modules'))),
      h('section', { class: 'signin-form' }, formHost, h('hr', { class: 'sep' }),
        h('div', { class: 'stack' }, h('div', null, h('p', { class: 'si-demo-h' }, 'Or look around first'), h('p', { class: 'hint' }, 'Opens a demo patient. No profile needed.')),
          h('div', { class: 'si-demos' }, demoBtn('adult'), AA.data.demoYoung ? demoBtn('young') : null))))));
    showChooser();
  } });

  function brandMark() {
    return h('span', { 'aria-hidden': 'true', html: '<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0b4131"/><path d="M7 21.5 12.5 9l5.5 12.5M9.3 17h6.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="23.5" cy="11" r="2.6" fill="#bfdf72"/><path d="M21 21.5h5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>' });
  }
  function initials(n) { return String(n || '?').split(/\s+/).filter(Boolean).slice(-2).map(function (x) { return x[0].toUpperCase(); }).join(''); }

  /* ---------- Demo ---------- */
  /* kind 'young' opens the child demo (AA.data.demoYoung, marked demo: 'young'); anything else the adult demo
     (marked demo: true). Both are truthy, so "is this a demo?" checks elsewhere still work. */
  function isDemoOf(a, kind) { return kind === 'young' ? a.demo === 'young' : !!a.demo && a.demo !== 'young'; }
  shell.hasDemo = function (kind) { return AA.assess.list().some(function (a) { return isDemoOf(a, kind); }); };
  shell.loadDemo = function (kind) {
    var young = kind === 'young';
    var demo = young ? AA.data.demoYoung : AA.data.demo;
    if (!demo) { U.toast(young ? 'The child demo is not available.' : 'The demo case is not available.', 'warn'); return null; }
    /* Reopen this profile's demo patient rather than adding another copy (delete it on Home for a fresh one). */
    var existing = AA.assess.list().filter(function (a) { return isDemoOf(a, kind); })[0];
    if (existing) { AA.progress.set('lastAssessment', existing.id); return existing.id; }
    var rec = JSON.parse(JSON.stringify(demo));
    rec.demo = young ? 'young' : true;
    var id = AA.assess.insert(rec);
    AA.progress.set('lastAssessment', id);
    return id;
  };

  /* ---------- New assessment ---------- */
  /* A draft nobody has typed into yet: no reference, age or recorded answers.
     New records start with empty young-person fields and an empty treatment record, so look for any value set. */
  function isBlankDraft(a) {
    var p = a.patient || {};
    var empty = function (o) { return !o || !Object.keys(o).length; };
    var untouched = function (o) {
      if (!o) return true;
      return !Object.keys(o).some(function (k) {
        var v = o[k];
        if (v && typeof v === 'object') return !untouched(v);
        return v !== null && v !== undefined && v !== false && String(v).trim() !== '';
      });
    };
    return !a.demo && !p.ref && !p.age && !p.consent && untouched(p.young) && empty(a.tools) && empty(a.symptoms) && empty(a.history) &&
      empty(a.risk) && empty(a.ddx) && untouched(a.treatment);
  }
  shell.isBlankDraft = isBlankDraft;

  /* New patient: a short intake (the record is created only when the clinician presses Create), with what happens
     next. Then the pre-assessment pack opens; under 6 the first step opens instead (it advises referral). */
  AA.router.register('new', { title: 'New patient', render: function (el) {
    /* Remove earlier untouched drafts so abandoned "Untitled patient" rows do not pile up on Home. */
    AA.assess.list().forEach(function (a) { if (isBlankDraft(a)) AA.assess.remove(a.id); });
    var today = U.today();
    var refIn = h('input', { type: 'text', id: 'np-ref', autocomplete: 'off', placeholder: 'For example AB-1024', required: true, 'aria-describedby': 'np-ref-h' });
    var ageIn = h('input', { type: 'number', id: 'np-age', min: '0', max: '120', inputmode: 'numeric', required: true, 'aria-describedby': 'np-age-h' });
    var sexSel = h('select', { id: 'np-sex' }, [['', 'Not recorded'], ['Female', 'Female'], ['Male', 'Male'], ['Intersex', 'Intersex'], ['Prefer not to say', 'Prefer not to say']].map(function (o) { return h('option', { value: o[0] }, o[1]); }));
    var refByIn = h('input', { type: 'text', id: 'np-by', autocomplete: 'off', placeholder: 'GP, self-referral, Right to Choose…' });
    var dateIn = h('input', { type: 'date', id: 'np-date', value: today });
    var reasonIn = h('textarea', { id: 'np-reason', rows: 3, placeholder: 'What the patient wants to know, in their own words' });
    var consent = h('input', { type: 'checkbox', id: 'np-consent' });
    var err = h('p', { class: 'np-err', role: 'alert', hidden: true });
    var go = h('button', { type: 'submit', class: 'btn btn-primary np-go' }, 'Create patient and open the pack →');
    function field(id, label, control, hint, wide) {
      return h('div', { class: 'field' + (wide ? ' np-wide' : '') }, h('label', { for: id }, label), control, hint ? h('p', { class: 'hint', id: id + '-h' }, hint) : null);
    }
    var form = h('form', { class: 'np-form', novalidate: true },
      h('div', { class: 'np-grid' },
        field('np-ref', 'Reference or initials *', refIn, 'Never a name or NHS number.', true),
        field('np-age', 'Age *', ageIn, 'Sets the age group: adults 18+, young people 6 to 17.'),
        field('np-sex', 'Sex', sexSel),
        field('np-by', 'Referred by', refByIn),
        field('np-date', 'Referral accepted on', dateIn),
        field('np-reason', 'Reason for referral', reasonIn, null, true)),
      h('label', { class: 'np-consent', for: 'np-consent' }, consent, h('span', null, h('strong', null, 'Consent recorded. '), 'The patient agrees to the assessment, and to us contacting their GP and the people they name.')),
      err,
      h('div', { class: 'np-act' }, go, ui.btn({ label: 'Cancel', kind: 'ghost', go: 'home' })));
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ref = refIn.value.trim(), age = parseInt(ageIn.value, 10);
      var problems = [];
      if (!ref) problems.push('a reference');
      if (isNaN(age) || age < 0 || age > 120) problems.push('the age');
      if (problems.length) { err.textContent = 'Please add ' + problems.join(' and ') + '.'; err.hidden = false; (ref ? ageIn : refIn).focus(); return; }
      var id = AA.assess.create({ ref: ref, age: age, sex: sexSel.value, referrer: refByIn.value.trim(), reason: reasonIn.value.trim(), consent: consent.checked, date: today });
      if (dateIn.value) AA.assess.set(id, 'pack.dates.referral', dateIn.value);
      AA.progress.set('lastAssessment', id);
      var t = 'assess-' + id + '-' + (age < 6 ? 'setup' : 'pack');
      try { history.replaceState(null, '', '#' + t); } catch (e2) { /* sandboxed */ }
      U.toast('Patient ' + ref + ' created.', 'ok');
      AA.router.go(t);
    });
    var steps = FLOW;
    el.appendChild(ui.pageHead({ eyebrow: 'New patient', title: 'Start a new assessment', lead: 'A few details now. Everything else is added as you go, step by step.' }));
    el.appendChild(h('div', { class: 'np' },
      h('section', { class: 'card np-card', 'aria-label': 'Patient details' }, h('h2', { class: 'np-h' }, 'Patient details'), form),
      h('aside', { class: 'np-next', 'aria-label': 'What happens next' },
        h('h2', { class: 'np-h' }, 'What happens next'),
        h('ol', { class: 'np-steps' }, steps.map(function (s) { return h('li', null, h('strong', null, s[0]), h('span', null, s[1])); })),
        h('p', { class: 'hint' }, 'Everything stays in this browser. Use a reference, never a name.'))));
    setTimeout(function () { try { refIn.focus(); } catch (e) { /* ignore */ } }, 0);
  } });

  /* ---------- Home ---------- */
  /* The pathway in five stages: the same words on Home and on the new-patient screen. */
  var FLOW = [
    ['Onboard', 'Send the pre-assessment pack: questionnaires, informant forms, and requests for school reports and GP records.'],
    ['Triage and book', 'Enter what comes back, check safety, decide, and book the interview.'],
    ['DIVA interview', 'About 90 minutes, adulthood then childhood, with a partner or family member if possible.'],
    ['Diagnose and report', 'Differentials, the DIVA score form, DSM-5-TR criteria, the filled DIVA form and the report.'],
    ['Treat, if needed', 'Pre-treatment checks, prescribing, titration, monitoring and shared care.']];

  AA.router.register('home', { title: 'Home', render: function (el) {
    var me = AA.auth.current();
    var list = AA.assess.list();
    var active = list.filter(function (a) { return a.status !== 'complete'; });
    var done = list.filter(function (a) { return a.status === 'complete'; });

    /* "Dr Sam Patel" greets as "Dr Patel", "Sam Patel" as "Sam". */
    var nm = String(me.name || '').trim().split(/\s+/);
    var greet = nm.length > 1 && /^(dr|prof|professor|mr|mrs|ms|miss|mx)\.?$/i.test(nm[0]) ? nm[0] + ' ' + nm[nm.length - 1] : nm[0];
    var now = new Date(), hr = now.getHours();
    var hello = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
    var day = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    var lead = (active.length ? U.plural(active.length, 'patient') + ' in progress' : 'No patients in progress') + (done.length ? ' · ' + done.length + ' completed' : '') + '.';
    el.appendChild(ui.pageHead({ eyebrow: day, title: hello + ', ' + greet, lead: lead,
      actions: [ui.btn({ label: 'New patient', kind: 'primary', go: 'new', icon: '+' })] }));

    var main = h('div', { class: 'hm-main' }), side = h('div', { class: 'hm-side' });
    el.appendChild(h('div', { class: 'hm-layout' }, main, side));
    main.appendChild(patientsCard(list));
    main.appendChild(h('section', { class: 'hm-card', 'aria-labelledby': 'hm-flow-h' },
      h('div', { class: 'hm-card-h' }, h('h2', { id: 'hm-flow-h' }, 'How the pathway works'),
        h('p', { class: 'hm-card-s' }, (AA.STEP_LIST || []).length + ' guided steps for adults and young people aged 6 to 17. Each step says what to do, and scores update as you go.')),
      h('ol', { class: 'hm-flow' }, FLOW.map(function (f) { return h('li', null, h('strong', null, f[0]), h('span', null, f[1])); }))));
    side.appendChild(quickCard());
    side.appendChild(trainingCard());
    var dc = divaCard();
    if (dc) side.appendChild(dc);
  } });

  function demoAction(kind) {
    var young = kind === 'young';
    var has = shell.hasDemo(kind);
    return ui.btn({ label: young ? (has ? 'Child demo' : 'Load child demo') : (has ? 'Adult demo' : 'Load adult demo'), kind: 'ghost', small: true,
      title: young ? 'Open the demo patient aged 8' : 'Open the adult demo patient', onClick: function () {
        var id = shell.loadDemo(kind); if (id) AA.router.go('assess-' + id + '-summary');
      } });
  }

  /* Patients: filter by stage, most urgent first, one row each with the next action and progress. */
  function patientsCard(list) {
    var card = h('section', { class: 'hm-card', 'aria-labelledby': 'hm-pt-h' });
    card.appendChild(h('div', { class: 'hm-card-h' },
      h('h2', { id: 'hm-pt-h' }, 'Patients', h('span', { class: 'hm-count' }, String(list.length))),
      list.length ? h('div', { class: 'row' }, demoAction('adult'), AA.data.demoYoung ? demoAction('young') : null) : null));
    if (!list.length) {
      card.appendChild(h('div', { class: 'hm-empty' },
        h('div', { class: 'hm-empty-ico', 'aria-hidden': 'true' }, ui.icon('users')),
        h('h3', null, 'No patients yet'),
        h('p', null, 'Start a new assessment, or open a demo patient to see a finished one with scores and a report.'),
        h('div', { class: 'row' }, ui.btn({ label: 'New patient', kind: 'primary', go: 'new', icon: '+' }), demoAction('adult'), AA.data.demoYoung ? demoAction('young') : null)));
      return card;
    }
    var rows = list.map(function (a) { return { a: a, st: stageOf(a) }; });
    var rank = { onboard: 1, interview: 1, diagnose: 1, treat: 1, done: 3 };
    rows.sort(function (x, y) {
      var rx = x.st.late ? 0 : rank[x.st.group] || 2, ry = y.st.late ? 0 : rank[y.st.group] || 2;
      if (rx !== ry) return rx - ry;
      return String(y.a.updatedAt || '').localeCompare(String(x.a.updatedAt || ''));
    });
    var filter = null;
    var chipsHost = h('div', { class: 'hm-filters' });
    var listHost = h('div');
    function paint(focusIdx) {
      U.clear(chipsHost);
      var items = [{ label: 'All', n: rows.length, on: !filter, onClick: function () { filter = null; paint(0); } }];
      PIPE.forEach(function (g, i) {
        var n = rows.filter(function (x) { return x.st.group === g.id; }).length;
        var late = rows.filter(function (x) { return x.st.group === g.id && x.st.late; }).length;
        items.push({ label: g.short + (late ? ' · ' + late + ' overdue' : ''), n: n, on: filter === g.id, onClick: function () { filter = filter === g.id ? null : g.id; paint(i + 1); } });
      });
      chipsHost.appendChild(ui.chips(items));
      U.clear(listHost);
      var shown = rows.filter(function (x) { return !filter || x.st.group === filter; });
      if (!shown.length) listHost.appendChild(h('p', { class: 'hm-none' }, 'No patients at this stage.'));
      else listHost.appendChild(h('ul', { class: 'hm-pt', 'aria-label': 'Patients' }, shown.map(function (x) { return patientRow(x.a, x.st); })));
      if (typeof focusIdx === 'number') { var b = U.$$('.ds-chip', chipsHost)[focusIdx]; if (b) b.focus(); }
    }
    paint();
    card.appendChild(chipsHost);
    card.appendChild(listHost);
    return card;
  }

  function patientRow(a, stage) {
    var out = AA.diagnosis.outcome(a);
    var kinds = { met: 'ok', 'not-met': 'neutral', subthreshold: 'warn', 'better-explained': 'info', incomplete: 'neutral' };
    var labels = { met: 'Criteria met', 'not-met': 'Criteria not met', subthreshold: 'Subthreshold', 'better-explained': 'Better explained', incomplete: 'In progress' };
    var p = a.patient || {};
    var name = p.ref || 'Untitled patient';
    var st = stepState(a);
    var meta = [p.age ? p.age + ' y' : null, p.sex || null, 'updated ' + U.fmtDate(a.updatedAt)].filter(Boolean).join(' · ');
    var next = String(stage.label || '').replace(/^Next: /, '');
    var stageLabel = (PIPE.filter(function (g) { return g.id === stage.group; })[0] || {}).label || '';
    function open() { AA.progress.set('lastAssessment', a.id); AA.router.go('assess-' + a.id + '-' + (stage.step || a.step || 'setup')); }
    return h('li', { class: 'hm-pt-row' },
      h('span', { class: 'hm-av', 'aria-hidden': 'true' }, initials(name.replace(/[^A-Za-z0-9 ]+/g, ' ')) || '?'),
      h('div', { class: 'hm-pt-body' },
        h('div', { class: 'hm-pt-top' },
          h('strong', { class: 'hm-pt-name' }, name),
          a.demo ? h('span', { class: 'hm-tag' }, a.demo === 'young' ? 'Child demo' : 'Demo') : null,
          h('span', { class: 'hm-stage is-' + stage.group }, h('span', { class: 'sr-only' }, 'Stage: '), stageLabel),
          out.code !== 'incomplete' ? ui.badge(labels[out.code], kinds[out.code]) : null),
        h('p', { class: 'hm-pt-meta' }, meta),
        h('p', { class: 'hm-next' + (stage.late ? ' is-late' : '') },
          h('span', { class: 'hm-next-k' }, stage.late ? 'Overdue' : a.status === 'complete' ? 'Done' : 'Next'),
          h('span', { class: 'hm-next-t' }, next),
          a.status !== 'complete' && st.label ? h('span', { class: 'hm-next-o' }, 'on ' + st.label.replace(/^Step (\d+): /, 'step $1, ')) : null)),
      h('div', { class: 'hm-pt-side' },
        st.of ? h('div', { class: 'hm-prog' }, ui.progress(st.done, st.of, 'Steps complete for ' + name),
          h('span', { class: 'hm-prog-n', 'aria-hidden': 'true' }, st.done + '/' + st.of),
          h('span', { class: 'sr-only' }, st.done + ' of ' + st.of + ' steps complete' + (st.na ? ', ' + st.na + ' not applicable yet' : ''))) : null,
        h('div', { class: 'hm-act' },
          ui.btn({ label: a.status === 'complete' ? 'Open' : 'Continue', kind: 'primary', small: true, onClick: open }),
          h('button', { type: 'button', class: 'btn btn-quiet btn-sm hm-del', title: 'Delete', 'aria-label': 'Delete ' + name, onclick: function () {
            U.confirm({ title: 'Delete this assessment?', body: 'All answers and notes for ' + name + ' will be removed from this browser. This cannot be undone.', ok: 'Delete', danger: true })
              .then(function (yes) { if (yes) { AA.assess.remove(a.id); U.toast('Assessment deleted'); AA.router.refresh(); } });
          } }, ui.icon('trash')))));
  }

  function quickCard() {
    var links = [
      ['bank', 'Question bank', 'Every question and example, by symptom or life area'],
      ['ddxguide', 'Differential protocol', 'A step-by-step check for other explanations'],
      ['ddx', 'Conditions A to Z', 'What overlaps with ADHD and how to tell them apart'],
      ['criteria', 'Diagnostic criteria', 'DSM-5-TR and ICD-11 side by side'],
      ['forms', 'Pre-appointment forms', 'What each form is and how to read it'],
      ['tools', 'Tools and scoring', 'When to use each scale and how to score it']];
    return h('section', { class: 'hm-card', 'aria-labelledby': 'hm-q-h' },
      h('div', { class: 'hm-card-h' }, h('h2', { id: 'hm-q-h' }, 'Look something up')),
      h('ul', { class: 'hm-links' }, links.map(function (l) {
        return h('li', null, h('a', { class: 'hm-link', href: '#' + l[0], 'data-go': l[0] },
          h('span', { class: 'hm-link-ico', 'aria-hidden': 'true' }, icon(l[0])), h('span', { class: 'hm-link-t' }, h('strong', null, l[1]), h('span', null, l[2]))));
      })));
  }

  function trainingCard() {
    var mods = AA.data.learn || [], cases = AA.data.cases || [];
    var modsDone = mods.filter(function (m) { return AA.progress.get('modules.' + m.id + '.done', false); }).length;
    var casesDone = cases.filter(function (c) { var r = AA.progress.get('cases.' + c.id, null); return r && typeof r.of === 'number'; }).length;
    var ex = AA.progress.get('exam', null);
    function meter(label, n, of) {
      return h('div', { class: 'hm-meter' }, h('span', { class: 'hm-meter-l' }, label), h('span', { class: 'hm-meter-n' }, n + ' of ' + of), ui.progress(n, of, label));
    }
    return h('section', { class: 'hm-card', 'aria-labelledby': 'hm-t-h' },
      h('div', { class: 'hm-card-h' }, h('h2', { id: 'hm-t-h' }, 'Training')),
      h('div', { class: 'hm-card-b' },
        h('div', { class: 'hm-meters' },
          meter('Assessor training modules', modsDone, mods.length),
          meter('Practice cases', casesDone, cases.length),
          h('div', { class: 'hm-meter' }, h('span', { class: 'hm-meter-l' }, 'Mastery exam'), h('span', { class: 'hm-meter-n' }, ex && typeof ex.best === 'number' ? 'Best ' + ex.best + '%' : 'Not taken yet'))),
        h('div', { class: 'row' }, ui.btn({ label: modsDone ? 'Continue training' : 'Start training', kind: 'secondary', small: true, go: 'learn' }), ui.btn({ label: 'Practice cases', kind: 'quiet', small: true, go: 'cases' }))));
  }

  /* Whether this browser holds the clinician's own DIVA 2.0 copy (the interview wording and the form come from it). */
  function divaCard() {
    var S = AA.divaSource;
    if (!S) return null;
    var m = S.meta();
    return h('section', { class: 'hm-card', 'aria-labelledby': 'hm-d-h' },
      h('div', { class: 'hm-card-h' }, h('h2', { id: 'hm-d-h' }, 'Your DIVA 2.0 copy')),
      h('div', { class: 'hm-card-b' },
        h('div', { class: 'hm-diva' }, h('span', { class: 'hm-diva-dot' + (m ? ' is-on' : ''), 'aria-hidden': 'true' }),
          h('div', null,
            h('strong', null, m ? 'Loaded on this device' : 'Not loaded'),
            h('p', null, m ? (m.file || 'DIVA 2.0 PDF') + (m.loadedAt ? ', ' + U.fmtDate(m.loadedAt) : '') + '. Adult interviews show DIVA\'s own wording and fill in your form.'
              : 'Load your own copy in DIVA part 1 of any adult assessment, so the interview shows DIVA\'s own wording.'))),
        h('div', { class: 'row' }, ui.btn({ label: 'Manage', kind: 'quiet', small: true, go: 'about' }))));
  }

  /* Where an assessment is up to: steps complete and the step it is on.
     A step whose progress is {of: 0} is not applicable yet (for example the treatment steps before a
     diagnosis, or when medicine is not planned): it is neither complete nor counted in the total. */
  function stepState(a) {
    var steps = AA.STEP_LIST || [];
    var done = 0, na = 0;
    steps.forEach(function (s) {
      var pr = null;
      try { pr = AA.diagnosis.stepProgress(a, s.id); } catch (e) { pr = null; }
      if (!pr) return;
      if (!pr.of) { na++; return; }
      if (pr.done >= pr.of) done++;
    });
    var cur = steps.filter(function (s) { return s.id === (a.step || 'setup'); })[0];
    var idx = steps.indexOf(cur);
    return { done: done, of: steps.length - na, na: na, label: cur ? 'Step ' + (idx + 1) + ': ' + cur.title : '' };
  }

  /* The pipeline: one stage per patient, with the next action and the step that does it. */
  var PIPE = [{ id: 'onboard', label: 'Onboarding', short: 'Onboarding' }, { id: 'interview', label: 'DIVA interview', short: 'Interview' },
    { id: 'diagnose', label: 'Diagnosis and report', short: 'Diagnosis' }, { id: 'treat', label: 'Treatment', short: 'Treatment' }, { id: 'done', label: 'Completed', short: 'Completed' }];
  function stageOf(a) {
    var P = AA.pack, J = AA.journey, V = AA.diva;
    var started = Object.keys(a.symptoms || {}).some(function (k) { var r = a.symptoms[k] || {}; return r.adult || r.child; });
    function out(group, label, step, late) { return { group: group, label: label, step: step, late: !!late }; }
    if (a.status === 'complete') return out('done', 'Completed', 'report');
    if (!started && P) {
      var s = P.status(a);
      var iv = (a.pack || {}).interview || {};
      if (s.stage === 'booked') return out('interview', 'DIVA interview on ' + U.fmtDate(iv.date) + (iv.time ? ', ' + iv.time : ''), 'ia');
      return out('onboard', s.next, 'pack', s.overdue);
    }
    var dx = (a.formulation || {}).decision;
    if (!dx) {
      var prog = V && V.progress ? V.progress(a) : null;
      if (prog && prog.done < prog.total) return out('interview', 'DIVA interview: ' + Math.round(100 * prog.done / prog.total) + '% done', a.step && /^(ia|hi|onset)$/.test(a.step) ? a.step : 'ia');
      return out('diagnose', 'Score and diagnose', 'summary');
    }
    var sum = null;
    try { sum = J ? J.summary(a) : null; } catch (e) { sum = null; }
    var next = sum && sum.next ? (AA.STEP_LIST || []).filter(function (x) { return x.id === sum.next; })[0] : null;
    if (next && next.phase === 'treat') return out('treat', 'Next: ' + next.title, next.id);
    if (next) return out('diagnose', 'Next: ' + next.title, next.id);
    return out('diagnose', 'Review and sign off', 'report');
  }

  /* Your DIVA copy on this device: what is kept, and a way to remove it. */
  function divaCopyCard() {
    var S = AA.divaSource;
    if (!S) return null;
    var m = S.meta();
    return h('div', { class: 'callout callout-info' },
      h('p', { class: 'callout-title' }, 'Your DIVA copy on this device'),
      h('p', null, m ? 'Loaded: ' + (m.file || 'DIVA 2.0 PDF') + (m.loadedAt ? ', ' + U.fmtDate(m.loadedAt) : '') + '. Its text and the file are kept in this browser to show the wording and fill in the form.' : 'None loaded. Load it from DIVA part 1 in any adult assessment.'),
      m ? ui.btn({ label: 'Remove my DIVA copy from this browser', kind: 'secondary', small: true, onClick: function () {
        U.confirm({ title: 'Remove your DIVA copy?', body: 'The interview goes back to the portal\'s own wording until you load it again. Patient records are not changed.', ok: 'Remove', danger: true })
          .then(function (yes) { if (yes) S.clear().then(function () { U.toast('DIVA copy removed from this browser.', 'ok'); AA.router.refresh(); }); });
      } }) : null);
  }

  /* ---------- About, privacy and data ---------- */
  AA.router.register('about', { title: 'About and data', render: function (el) {
    el.appendChild(ui.pageHead({ eyebrow: 'About', title: 'About, privacy and data',
      lead: 'A training and decision-support workspace for clinicians who assess and treat ADHD in adults and in young people aged 6 to 17.' }));

    el.appendChild(ui.section({ id: 'ab-what', title: 'What this app is', text: 'One patient record runs from referral to shared care.' },
      ui.cards([
        { icon: 'route', title: 'The whole pathway', text: 'Assessment, diagnosis, treatment plan, pre-treatment checks, prescribing, titration, monitoring and the annual review.' },
        { icon: 'book', title: 'Built on the standards', text: 'It follows the structure of the DIVA diagnostic interview (Kooij and Francken) and the DSM-5-TR and ICD-11 criteria, with UK NICE NG87 for the wider assessment, treatment and monitoring.' },
        { icon: 'school', title: 'Children under 6', text: 'For a child under 6, it tells you to refer to a service with expertise in ADHD in young children.' },
        { icon: 'users', title: 'Who should use it', text: 'Diagnosing ADHD and starting medicine belong to a specialist ADHD team. Anyone doing this, including a non-medical prescriber, needs the training and expertise for that medicine and age group, and agreed governance and supervision.', tone: 'info' }
      ], { cols: 2 })));

    el.appendChild(ui.section({ id: 'ab-diva', title: 'DIVA and licensed tools' },
      h('div', { class: 'stack' },
        h('div', { class: 'prose' },
          h('p', null, 'For adults the interview follows the DIVA 2.0. DIVA is \u00a9 DIVA Foundation, so its questions and examples are not part of this app. They appear word for word only after you load your own copy of the DIVA 2.0 PDF, which is read and kept in this browser and never uploaded. The portal\'s own questions and examples are original.'),
          h('p', null, 'Licensed instruments (for example DIVA-5, CAARS 2, BAARS-IV, Conners 4, SDQ) are described and linked, not copied: you can enter their results.')),
        divaCopyCard())));

    el.appendChild(ui.section({ id: 'ab-privacy', title: 'Privacy' },
      ui.cards([
        { icon: 'shield', title: 'Stays in this browser', text: 'Everything you enter is kept in this browser (localStorage). Nothing is sent to a server.' },
        { icon: 'eye', title: 'A PIN is a lock, not encryption', text: 'Anyone using this browser profile can read the data unless your profile has a PIN.' },
        { icon: 'user', title: 'A reference, never a name', text: 'Use a patient reference or initials, not names or NHS numbers.' },
        { icon: 'file', title: 'Then delete it here', text: 'Copy the final report into your clinical record system, then delete the assessment here.' }
      ], { cols: 4 })));
    el.appendChild(h('p', { class: 'muted' }, 'It supports, and never replaces, a qualified clinician\'s judgement, local policy and the official instruments.'));

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
    el.appendChild(ui.section({ id: 'ab-data', title: 'Your data', text: 'Export a backup to move your work to another computer. Import replaces everything stored here.' },
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
      /* The first press always changes what you see: from the Rx portal's theme go to its opposite. */
      var order = rxTheme() === 'dark' ? ['system', 'light', 'dark'] : ['system', 'dark', 'light'];
      var cur = AA.store.get('prefs.theme', 'system');
      var next = order[(order.indexOf(cur) + 1) % order.length];
      AA.store.set('prefs.theme', next); applyTheme(next);
      U.toast('Theme: ' + (next === 'system' ? 'match the Rx portal' : next));
    });
    /* Follow the Rx portal live when its theme changes in another tab or the parent page (same site). */
    window.addEventListener('storage', function (e) {
      if (e.key === 'pharmacare:rx-theme' && AA.store.get('prefs.theme', 'system') === 'system') applyTheme('system');
    });
    U.$('#signout-btn').addEventListener('click', function () { AA.store.flush(); AA.auth.signOut(); AA.router.go('signin'); });
    U.$('#menu-btn').addEventListener('click', function () { setDrawer(!U.$('#sidebar').classList.contains('open')); });
    U.$('#scrim').addEventListener('click', function () { setDrawer(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var m = U.$('#acct-menu');
      if (m && !m.hidden) { setAcct(false); var b = U.$('#acct-btn'); if (b) b.focus(); return; }
      setDrawer(false);
    });
    /* Account menu: the avatar button opens it; a click outside or Escape closes it. */
    var acctBtn = U.$('#acct-btn');
    if (acctBtn) {
      acctBtn.addEventListener('click', function (e) { e.stopPropagation(); setAcct(U.$('#acct-menu').hidden); });
      document.addEventListener('click', function (e) {
        var m = U.$('#acct-menu');
        if (m && !m.hidden && !e.target.closest('.acct')) setAcct(false);
      });
      U.$('#acct-menu').addEventListener('click', function (e) { if (e.target.closest('a')) setAcct(false); });
      var so = U.$('#signout-btn');
      if (so && !so.querySelector('.ds-ico')) so.insertBefore(ui.icon('logout'), so.firstChild);
    }
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
