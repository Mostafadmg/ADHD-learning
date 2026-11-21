/* Pre-appointment forms guide and the differential diagnosis protocol.
   Routes: "forms" (every form, grouped by purpose, with search and a group filter), "form-<id>" (how to read one
   form) and "ddxguide" (the step-by-step differential diagnosis protocol). See ARCHITECTURE.md, section 6.
   Also exports AA.components.ddxProtocol(opts), which the assessment's differential step reuses.
   Content comes from AA.data.formsGuide (5.10) and AA.data.ddxProtocol (5.11); this file only arranges it, with the
   design system builders in AA.ui (DESIGN.md) and this view's stylesheet (css/v-guides.css, prefix .gd-).
   Data without the structured introduction fields (older builds, test fixtures) still renders: the introduction is
   shown as prose and forms are grouped by who completes them.
   Per-clinician state lives in AA.progress: 'formsFilter' = {q, group} (list filter; an older {kind} value is still
   read) and 'sandbox.ddxProtocol.<checkId>' (practice ticks on the protocol page, never linked to a patient). */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui;

  /* Who completes a form. Labels forms, and groups them when the data has no purpose groups. */
  var KINDS = [
    { id: 'self', label: 'Completed by the patient', icon: 'file', note: 'Questionnaires the patient fills in about themselves.' },
    { id: 'informant', label: 'Completed by people who know the patient', icon: 'users', note: 'Questionnaires for a parent, partner, sibling or close friend.' },
    { id: 'records', label: 'Records and reports', icon: 'book', note: 'Documents written at the time, such as school reports and earlier assessments.' },
    { id: 'history', label: 'History questionnaires', icon: 'timeline', note: 'Background questionnaires that save time in the interview.' },
    { id: 'other', label: 'Other forms', icon: 'file', note: '' }
  ];
  /* Display only: icons for the purpose groups, the six tests and the four verdicts. */
  var GROUP_ICON = { adhd: 'list', childhood: 'timeline', informants: 'users', records: 'book', comorbid: 'layers', safety: 'shield' };
  var TEST_ICON = { onset: 'flag', course: 'timeline', persistence: 'repeat', pervasiveness: 'layers', specific: 'target', evidence: 'users' };
  var SPARE_ICONS = ['flag', 'timeline', 'repeat', 'layers', 'target', 'users', 'search', 'eye'];
  var VERDICTS = { 'absent': { icon: 'check' }, 'co-occurring': { icon: 'layers' }, 'better explains': { icon: 'target', tone: 'warn' }, 'uncertain': { icon: 'clock', tone: 'info' } };
  var WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  function numWord(n) { return WORDS[n] || String(n); }

  /* ---------- Data helpers (never throw on missing or partial data) ---------- */

  function arr(x) { return Array.isArray(x) ? x.filter(function (v) { return v !== null && v !== undefined && v !== ''; }) : (x ? [x] : []); }
  function txt(x) { return typeof x === 'string' ? x.trim() : (typeof x === 'number' ? String(x) : ''); }
  /* Text that says something: '', '-' and similar placeholders count as empty. */
  function filled(x) { var s = txt(x); return s && !/^[-–—\s]+$/.test(s) ? s : ''; }
  function texts(x) { return arr(x).map(filled).filter(Boolean); }
  function norm(s) { return String(s || '').toLowerCase(); }
  function stripTags(s) { return String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  /* Upper-case the first letter of authored HTML, skipping any opening tags. */
  function capHtml(s) { return String(s || '').replace(/^(\s*(?:<[^>]+>\s*)*)([a-z])/, function (m, a, b) { return a + b.toUpperCase(); }); }
  function li(t) { return h('li', null, t); }

  /* Authored tables with several wordy columns become stacked cards on phones (CSS in this view's stylesheet):
     each cell is labelled with its column heading. Short numeric tables stay as tables. */
  function stackTables(root, cls) {
    Array.prototype.forEach.call(root.querySelectorAll('table'), function (t) {
      var rows = Array.prototype.slice.call(t.rows);
      if (rows.length < 2) return;
      var headRow = t.tHead && t.tHead.rows[0] ? t.tHead.rows[0] : rows[0];
      var heads = Array.prototype.map.call(headRow.cells, function (c) { return c.tagName === 'TH' ? c.textContent.trim() : ''; });
      if (!heads.some(Boolean)) return;
      var body = rows.filter(function (r) { return r !== headRow; });
      var cells = [];
      body.forEach(function (r) { Array.prototype.forEach.call(r.cells, function (c) { cells.push(c); }); });
      if (!cells.length) return;
      var avg = cells.reduce(function (n, c) { return n + c.textContent.length; }, 0) / cells.length;
      if (!((heads.length >= 3 && avg >= 20) || (heads.length === 2 && avg >= 60))) return;
      body.forEach(function (r) { Array.prototype.forEach.call(r.cells, function (c, i) { if (heads[i]) c.setAttribute('data-label', heads[i]); }); });
      headRow.classList.add(cls + '-head');
      t.classList.add(cls);
    });
    return root;
  }
  function prose(html) { return stackTables(ui.html(html), 'gd-stack'); }
  function fromHtml(html) { var box = document.createElement('div'); box.innerHTML = filled(html) ? html : ''; return box; }

  /* Bracketed source tags such as "(NICE NG87 1.2.10; WFADHD 2021)" stay in the sentence but are set quieter, so the
     sentence reads first. A bracket that carries content (a colon, a long clause, lower-case text) is left as it is. */
  var SRC = /\b(NICE|NG\d+|CG\d+|CR235|UKAAN|AQAS|CADDRA|European Consensus|WFADHD|AADPA|ICD-11|DSM-5-TR|UKAP|RCPsych|NHSE|DHSC|et al|\d{4})\b/;
  function isCite(inner) {
    if (inner.indexOf(': ') > -1) return false;
    return inner.split(/;\s*/).every(function (part) {
      var p = part.trim();
      return !!p && /^[A-Z0-9]/.test(p) && p.split(/\s+/).length <= 8 && SRC.test(p);
    });
  }
  function cite(t) {
    var s = String(t == null ? '' : t), out = [], last = 0, m, re = /\(([^()]{2,160})\)/g;
    while ((m = re.exec(s))) {
      if (!isCite(m[1])) continue;
      if (m.index > last) out.push(s.slice(last, m.index));
      out.push(h('span', { class: 'gd-cite' }, m[0]));
      last = m.index + m[0].length;
    }
    if (last < s.length) out.push(s.slice(last));
    return out;
  }

  /* "Screening is not diagnosis. NICE NG87 ..." -> ['Screening is not diagnosis.', 'NICE NG87 ...'].
     The first sentence (or the words before a colon) becomes the headline; '' when there is no short one. */
  function splitRule(t) {
    var s = String(t || '').trim();
    var dot = s.search(/[.?!]['’"]?\s+(?=[A-Z0-9'‘"(])/);
    if (dot > 0 && dot < 120) { var e = s.slice(dot).search(/\s/) + dot; return [s.slice(0, e).trim(), s.slice(e).trim()]; }
    var col = s.indexOf(': ');
    if (col > 0 && col < 90) return [s.slice(0, col + 1).trim(), s.slice(col + 2).trim()];
    return ['', s];
  }
  /* Headline and body for a card. A headline that ended in a colon reads as a complete line without it. */
  function ruleParts(t) {
    var p = splitRule(t);
    if (!p[0] || !p[1]) return { head: '', body: String(t || '').trim() };
    if (/:$/.test(p[0])) return { head: p[0].slice(0, -1), body: cap(p[1]) };
    return { head: p[0], body: p[1] };
  }
  /* "If this: then that" rules show the condition in bold, so a list of them scans as if-then pairs. */
  function leadIn(t) {
    var s = String(t || ''), i = s.indexOf(': ');
    if (i > 0 && i <= 160) {
      var pre = s.slice(0, i);
      if ((pre.match(/\(/g) || []).length === (pre.match(/\)/g) || []).length) return [h('strong', { class: 'gd-if' }, cite(pre)), ': ', cite(s.slice(i + 2))];
    }
    return cite(s);
  }

  function copyLines(lines, what) {
    U.copyText(lines.join('\n')).then(function (ok) {
      U.toast(ok ? what + ' copied' : 'Copy failed. Your browser blocked the clipboard.', ok ? 'ok' : 'err');
    });
  }

  /* In-page jumps use buttons, not hash links: a hash link would change the route. */
  function scrollToId(id) {
    var t = document.getElementById(id);
    if (!t) return;
    try { t.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { t.scrollIntoView(); }
    var hd = t.querySelector('h2, h3, summary');
    if (!hd) return;
    if (!/^SUMMARY$/.test(hd.tagName) && !hd.hasAttribute('tabindex')) hd.setAttribute('tabindex', '-1');
    try { hd.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }
  /* "On this page" chips under a hero. items: [{id, label, n}] (null items are skipped). */
  function jumpNav(items) {
    items = items.filter(Boolean);
    if (items.length < 2) return null;
    return h('nav', { class: 'gd-jump', 'aria-label': 'On this page' },
      h('span', { class: 'gd-jump-k' }, 'On this page'),
      h('ul', { class: 'ds-chips' }, items.map(function (x) {
        return h('li', null, h('button', { type: 'button', class: 'ds-chip', onclick: function () { scrollToId(x.id); } },
          x.label, x.n !== undefined ? h('span', { class: 'ds-chip-n' }, String(x.n)) : null));
      })));
  }

  /* Principles and rules as a grid of numbered cards: the rule is always visible, its reasoning and sources open on
     demand. Returns {el, toggle} where toggle is an "Open all" button (null when there is nothing to open). */
  function ruleGrid(rules, prefix) {
    var ds = [];
    var toggle = ui.btn({ label: 'Open all', kind: 'quiet', small: true, onClick: function () {
      var open = !ds.every(function (d) { return d.open; });
      ds.forEach(function (d) { d.open = open; });
      sync();
    } });
    function sync() {
      var all = ds.length > 0 && ds.every(function (d) { return d.open; });
      toggle.lastChild.textContent = all ? 'Close all' : 'Open all';
      toggle.setAttribute('aria-expanded', all ? 'true' : 'false');
    }
    var el = h('ol', { class: 'gd-pgrid' }, rules.map(function (r, i) {
      var p = ruleParts(r);
      var num = h('span', { class: 'gd-pnum', 'aria-hidden': 'true' }, String(i + 1));
      if (!p.head) return h('li', { class: 'gd-pcard gd-pcard-plain' }, num, h('p', { class: 'gd-phead' }, cite(p.body)));
      var d = h('details', { class: 'gd-pd', id: prefix + '-' + (i + 1) },
        h('summary', null, num, h('span', { class: 'gd-phead' }, p.head)),
        h('p', { class: 'gd-pbody' }, cite(p.body)));
      d.addEventListener('toggle', sync);
      ds.push(d);
      return h('li', { class: 'gd-pcard' }, d);
    }));
    sync();
    return { el: el, toggle: ds.length > 1 ? toggle : null };
  }

  /* ======================================================================
     Forms guide data
     ====================================================================== */

  function guide() { var g = AA.data.formsGuide; return g && typeof g === 'object' ? g : {}; }
  function forms() { return arr(guide().forms).filter(function (f) { return f && typeof f === 'object' && txt(f.id); }); }
  function kindOf(f) {
    for (var i = 0; i < KINDS.length - 1; i++) if (KINDS[i].id === f.kind) return KINDS[i];
    return KINDS[KINDS.length - 1];
  }
  /* Forms grouped by purpose, in display order: formsGuide.groups when present (a form shows in the first group that
     lists it; forms no group lists go last, under "Other forms"), otherwise one group per kind. */
  function formGroups() {
    var list = forms(), byId = {}, used = {}, out = [];
    list.forEach(function (f) { byId[f.id] = f; });
    arr(guide().groups).forEach(function (g) {
      if (!g || typeof g !== 'object' || !txt(g.id)) return;
      var items = arr(g.forms).map(function (id) { return byId[id]; }).filter(function (f) {
        if (!f || used[f.id]) return false;
        used[f.id] = true;
        return true;
      });
      var label = filled(g.t) || txt(g.id);
      if (items.length) out.push({ id: txt(g.id), label: label, short: filled(g.s) || label, note: filled(g.d), icon: GROUP_ICON[g.id] || 'file', forms: items });
    });
    var rest = list.filter(function (f) { return !used[f.id]; });
    if (!out.length) {
      KINDS.forEach(function (k) {
        var items = rest.filter(function (f) { return kindOf(f) === k; });
        if (items.length) out.push({ id: k.id, label: k.label, short: k.label, note: k.note, icon: k.icon, forms: items });
      });
    } else if (rest.length) out.push({ id: 'other', label: 'Other forms', short: 'Other forms', note: '', icon: 'file', forms: rest });
    return out;
  }
  function groupOf(f) { return formGroups().filter(function (g) { return g.forms.indexOf(f) > -1; })[0] || null; }
  /* Forms in display order (group by group). Previous/next follows the same order. */
  function ordered() { var out = []; formGroups().forEach(function (g) { out = out.concat(g.forms); }); return out; }
  function formById(id) {
    var list = forms();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function formTitle(f) { return filled(f.title) || f.id; }
  function toolOf(f) { var id = f && txt(f.tool); return id ? AA.byId('tools', id) : null; }
  function scorable(t) { return !!(t && t.interactive !== false && t.items && t.items.length); }
  function toolLabel(t) { return t.abbr || t.name || t.id; }

  /* ======================================================================
     Route: forms (all pre-appointment forms)
     ====================================================================== */

  function readFilter(groups) {
    var f = AA.progress.get('formsFilter', null) || {};
    var q = typeof f.q === 'string' ? f.q : '';
    var g = typeof f.group === 'string' ? f.group : '';
    /* Older saves filtered by who completes the form ({kind}); keep that choice when one group matches it. */
    if (!g && typeof f.kind === 'string' && f.kind) {
      var m = groups.filter(function (x) { return x.forms.every(function (y) { return kindOf(y).id === f.kind; }); });
      if (m.length === 1) g = m[0].id;
    }
    if (g && !groups.some(function (x) { return x.id === g; })) g = '';
    return { q: q, group: g };
  }
  function saveFilter(f) { AA.progress.set('formsFilter', { q: f.q, group: f.group }); }

  function haystack(f, grp) {
    var t = toolOf(f);
    return norm([f.id, f.title, stripTags(f.what), texts(f.recommendedBy).join(' '), f.who, f.whenSent, f.strength, f.feedsInto,
      grp ? grp.label : '', kindOf(f).label, t ? t.abbr + ' ' + t.name : ''].join(' '));
  }

  /* First sentence or clause of a long field, for compact cards. */
  function firstPart(x, cutColon) {
    var t = filled(x);
    if (!t) return '';
    var cut = t.search(cutColon ? /\. |; |: | \(/ : /\. |; | \(/);
    if (cut > 0) t = t.slice(0, cut);
    return t.replace(/[.,;:]+$/, '');
  }
  /* A completion time worth showing on a card ("About 5 minutes", "Varies with the form"), else ''. */
  function cardTime(x) {
    var t = firstPart(x, true);
    return /minute|hour|variable|varies|depends/i.test(t) ? t : '';
  }
  function fact(icon, label, text, cls) {
    return h('span', { class: 'gd-fact' + (cls ? ' ' + cls : '') }, ui.icon(icon), h('span', { class: 'sr-only' }, label + ': '), h('span', { class: 'gd-fact-t' }, text));
  }
  function cardItem(f) {
    var who = firstPart(f.who), when = firstPart(f.whenSent), time = cardTime(f.time);
    var facts = [who ? fact('users', 'Completed by', who) : null, when ? fact('calendar', 'When to send it', when, 'gd-fact-when') : null,
      time ? fact('clock', 'Time', time) : null].filter(Boolean);
    return { title: formTitle(f), text: facts.length ? h('span', { class: 'gd-facts' }, facts) : null,
      meta: ['How to read it', h('span', { 'aria-hidden': 'true' }, ' →')], go: 'form-' + f.id };
  }

  /* What forms can and cannot do: two short lists. Open on wide screens (beside the rule), closed on phones. */
  function wideScreen() { try { return !window.matchMedia || window.matchMedia('(min-width: 861px)').matches; } catch (e) { return true; } }
  function crossIcon() {
    return h('span', { class: 'ds-ico', 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>' });
  }
  function scopeBlock(scope) {
    scope = scope && typeof scope === 'object' ? scope : {};
    var can = texts(scope.can), cannot = texts(scope.cannot);
    if (!can.length && !cannot.length) return null;
    function col(title, items, ico, cls) {
      if (!items.length) return null;
      return h('div', { class: 'gd-scope-col ' + cls }, h('h3', { class: 'gd-mini-h' }, title),
        h('ul', { class: 'gd-scope-list' }, items.map(function (t) { return h('li', null, h('span', { class: 'gd-scope-ico' }, ico()), h('span', null, t)); })));
    }
    return h('details', { class: 'gd-scope', open: wideScreen() },
      h('summary', null, h('span', null, 'What forms can and cannot do')),
      h('div', { class: 'gd-scope-cols' },
        col('Forms can', can, function () { return ui.icon('check'); }, 'is-can'),
        col('Forms cannot', cannot, crossIcon, 'is-cannot')));
  }

  function renderForms(el) {
    var root = h('div', { class: 'gd gd-forms' });
    el.appendChild(root);
    var g = guide(), groups = formGroups();
    var total = groups.reduce(function (n, x) { return n + x.forms.length; }, 0);
    var rule = g.rule && typeof g.rule === 'object' ? g.rule : null;
    root.appendChild(ui.pageHead({
      eyebrow: 'Before the appointment', title: 'Pre-appointment forms',
      lead: rule && filled(g.intro) ? stripTags(g.intro) : 'The questionnaires, records and informant forms to gather before the assessment, and how to read each one.',
      actions: [ui.btn({ label: 'Tools and scoring', kind: 'ghost', go: 'tools', icon: '▤' })]
    }));
    if (rule) {
      root.appendChild(ui.hero({ eyebrow: filled(rule.k) || null, title: filled(rule.t) || null,
        text: filled(rule.html) ? h('div', { class: 'gd-htext' }, prose(rule.html)) : null, aside: scopeBlock(g.scope) }));
    } else if (filled(g.intro)) {
      root.appendChild(ui.hero({ eyebrow: 'About this guide', text: h('div', { class: 'gd-htext' }, prose(g.intro)) }));
    }

    if (!total) {
      root.appendChild(ui.empty('No forms in this build', 'The pre-appointment forms guide is not available yet. The tools library describes every questionnaire.',
        ui.btn({ label: 'Open the tools library', kind: 'primary', go: 'tools' })));
      return;
    }

    var review = arr(g.review).filter(function (r) { return r && typeof r === 'object' && (filled(r.t) || filled(r.d)); });
    var rules = texts(g.principles);
    var jump = jumpNav([{ id: 'gd-list', label: 'The forms', n: total }, review.length ? { id: 'gd-review', label: 'Reviewing a returned pack' } : null,
      rules.length ? { id: 'gd-rules', label: 'Rules', n: rules.length } : null]);
    if (jump) root.appendChild(jump);

    /* ---- Filters: one group at a time, plus free-text search ---- */
    var f = readFilter(groups);
    var search = ui.search('Search forms or conditions', function (q) { f.q = q; apply(); saveFilter(f); }, f.q);
    function showAll() { f.q = ''; f.group = ''; search.value = ''; apply(); saveFilter(f); search.focus(); }
    var clearBtn = ui.btn({ label: 'Clear', kind: 'quiet', small: true, onClick: showAll });
    function setGroup(id) { f.group = id && f.group === id ? '' : id; apply(); saveFilter(f); }
    var chipUl = ui.chips([{ label: 'All forms', n: total, onClick: function () { setGroup(''); } }].concat(groups.map(function (x) {
      return { label: x.short, n: x.forms.length, onClick: function () { setGroup(x.id); } };
    })));
    var chipBtns = U.$$('button', chipUl);

    /* ---- Groups: every card is built once; filtering only toggles `hidden` ---- */
    var countEl = h('p', { class: 'gd-count', role: 'status', 'aria-live': 'polite' });
    var secs = groups.map(function (grp) {
      var ul = ui.cards(grp.forms.map(cardItem));
      ul.classList.add('gd-fcards');
      var lis = Array.prototype.slice.call(ul.children);
      var nEl = h('span', { class: 'gd-gcount' });
      var hid = 'gd-g-' + grp.id;
      return {
        grp: grp, nEl: nEl,
        items: grp.forms.map(function (x, i) { return { li: lis[i], hay: haystack(x, grp) }; }),
        el: h('section', { class: 'gd-group', 'aria-labelledby': hid },
          h('div', { class: 'gd-ghead' },
            h('span', { class: 'gd-gico', 'aria-hidden': 'true' }, ui.icon(grp.icon)),
            h('div', { class: 'gd-gtext' },
              h('h3', { id: hid, class: 'gd-gtitle' }, h('span', null, grp.label), nEl),
              grp.note ? h('p', { class: 'gd-gnote' }, grp.note) : null)),
          ul)
      };
    });
    var emptyEl = ui.empty('No forms match', 'Try another word or show all forms.', ui.btn({ label: 'Show all forms', kind: 'primary', onClick: showAll }));
    root.appendChild(ui.section({ id: 'gd-list', title: 'The forms', text: filled(g.order) || null }, [
      h('div', { class: 'gd-filter', role: 'search', 'aria-label': 'Filter forms' },
        h('div', { class: 'gd-filter-row' }, search, clearBtn),
        h('div', { class: 'gd-chiprow', role: 'group', 'aria-label': 'Show one group of forms' }, chipUl)),
      countEl,
      h('div', { class: 'gd-results' }, secs.map(function (s) { return s.el; }), emptyEl)]));

    function apply() {
      var words = norm(f.q).split(/\s+/).filter(Boolean);
      var shown = 0;
      secs.forEach(function (s) {
        var on = !f.group || f.group === s.grp.id;
        var n = 0;
        s.items.forEach(function (x) {
          var vis = on && words.every(function (w) { return x.hay.indexOf(w) > -1; });
          x.li.hidden = !vis;
          if (vis) n++;
        });
        s.el.hidden = !n;
        s.nEl.textContent = U.plural(n, 'form');
        shown += n;
      });
      emptyEl.hidden = shown > 0;
      chipBtns.forEach(function (b, i) {
        var on = (i === 0 ? '' : groups[i - 1].id) === f.group;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      clearBtn.hidden = !(f.q || f.group);
      countEl.textContent = f.q || f.group ? 'Showing ' + shown + ' of ' + U.plural(total, 'form')
        : U.plural(total, 'form') + ' in ' + U.plural(groups.length, 'group') + (arr(g.groups).length ? ', in the order of the assessment' : '');
    }
    apply();

    /* ---- When a pack comes back, and the rules for reading any form ---- */
    if (review.length) {
      root.appendChild(ui.section({ id: 'gd-review', title: 'How to review a returned pack', text: 'Work through a returned pack in this order.' },
        ui.steps(review.map(function (r) { return { title: filled(r.t) || filled(r.d), text: filled(r.t) ? filled(r.d) : '' }; }))));
    }
    if (rules.length) {
      var rg = ruleGrid(rules, 'gd-fr');
      root.appendChild(ui.section({ id: 'gd-rules', title: 'Rules for reading any form', text: 'Open a rule for the evidence behind it.', actions: rg.toggle }, rg.el));
    }
  }

  /* ======================================================================
     Route: form-<id> (how to read one form)
     ====================================================================== */

  /* A form's "what" HTML in three parts: the opening paragraph and the paragraph that says why the form is used (both
     shown in the hero), and the rest ("About the form"). An opening paragraph that ends in a colon introduces the list
     after it, so its last fragment ("Typical sections:") moves down with that list. */
  function whatParts(html) {
    var box = fromHtml(html), lead = null, why = null, rest = [];
    Array.prototype.slice.call(box.childNodes).forEach(function (n) {
      if (n.nodeType === 3) { if (n.textContent.trim()) rest.push(h('p', null, n.textContent.trim())); return; }
      if (n.nodeType !== 1) return;
      if (!lead && n.tagName === 'P') { lead = n; return; }
      var first = n.tagName === 'P' ? n.firstElementChild : null;
      if (!why && first && first.tagName === 'STRONG' && n.firstChild === first && /^why\b/i.test(first.textContent.trim())) { why = n; return; }
      rest.push(n);
    });
    if (lead && /:\s*$/.test(lead.textContent)) {
      var s = lead.innerHTML.replace(/\s+$/, ''), m = s.match(/^([\s\S]*[.!?])\s+([^.!?]+:)$/);
      if (m) { lead = h('p', { html: m[1] }); rest.unshift(h('p', { html: m[2] })); }
      else lead = h('p', { html: s.replace(/:$/, '.') });
    }
    return { lead: lead, why: why, rest: rest };
  }

  /* An authored ordered list as numbered steps (ds-steps): a bold opening ("<strong>Check the version.</strong>")
     becomes the step title. Anything outside the list stays as prose around it. */
  function htmlSteps(html) {
    var box = fromHtml(html), ol = box.querySelector('ol');
    if (!ol) return prose(html);
    var steps = h('ol', { class: 'ds-steps gd-hsteps' }, Array.prototype.map.call(ol.children, function (item) {
      var first = item.firstChild;
      if (first && first.nodeType === 1 && first.tagName === 'STRONG') {
        var head = first.textContent.trim();
        var restHtml = item.innerHTML.slice(first.outerHTML.length);
        if (!/^\s*,/.test(restHtml)) {
          restHtml = restHtml.replace(/^\s*[:.]?\s*/, '');
          if (/:$/.test(head)) restHtml = capHtml(restHtml);
          return h('li', null, h('span', { class: 'ds-steps-t' }, head.replace(/[.:]$/, '')), restHtml ? h('span', { class: 'ds-steps-p', html: restHtml }) : null);
        }
      }
      return h('li', { class: 'gd-hstep-only' }, h('span', { class: 'ds-steps-p', html: item.innerHTML }));
    }));
    var before = [], after = [], seen = false;
    Array.prototype.slice.call(box.childNodes).forEach(function (n) { if (n === ol) { seen = true; return; } (seen ? after : before).push(n); });
    function wrap(nodes) {
      if (!nodes.some(function (n) { return n.nodeType === 1 || n.textContent.trim(); })) return null;
      var d = h('div', { class: 'prose' });
      nodes.forEach(function (n) { d.appendChild(n); });
      return stackTables(d, 'gd-stack');
    }
    return h('div', { class: 'gd-howto' }, wrap(before), steps, wrap(after));
  }

  function meaningTable(rows) {
    rows = arr(rows).filter(function (r) { return r && typeof r === 'object' && (filled(r.result) || filled(r.means) || filled(r.action)); });
    if (!rows.length) return h('p', { class: 'gd-none' }, 'This form has no score bands. Read it for patterns and concrete examples, using the steps above, and weigh it with the rest of the history.');
    return h('div', { class: 'table-wrap gd-mwrap' }, h('table', { class: 'table gd-mtable' },
      h('caption', { class: 'sr-only' }, 'What each result means and what to do'),
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Result'), h('th', { scope: 'col' }, 'What it means'), h('th', { scope: 'col' }, 'What to do'))),
      h('tbody', null, rows.map(function (r) {
        return h('tr', null,
          h('th', { scope: 'row' }, filled(r.result) || '-'),
          h('td', { 'data-label': 'What it means' }, filled(r.means) ? cite(r.means) : '-'),
          h('td', { 'data-label': 'What to do', class: 'gd-act' }, filled(r.action) ? cite(r.action) : '-'));
      }))));
  }

  function exampleBlock(ex) {
    if (typeof ex === 'string') ex = { html: ex };
    if (!ex || typeof ex !== 'object') return null;
    var html = filled(ex.html), take = filled(ex.takeaway);
    if (!html && !take) return null;
    return h('div', { class: 'gd-ex' },
      html ? h('div', { class: 'gd-ex-body' }, prose(html)) : null,
      take ? ui.callout('ok', h('p', null, take), 'Takeaway') : null);
  }

  function renderForm(el, params) {
    var id = params[0];
    if (!id) return renderForms(el);
    var root = h('div', { class: 'gd gd-form' });
    el.appendChild(root);
    var f = formById(id);
    if (!f) {
      root.appendChild(ui.pageHead({ eyebrow: 'Pre-appointment forms', title: 'Form not found',
        lead: 'This form is not in the guide. It may have been renamed or removed.',
        actions: [ui.btn({ label: 'All forms', kind: 'primary', go: 'forms', icon: '←' })] }));
      return;
    }
    var grp = groupOf(f), t = toolOf(f), can = scorable(t), title = formTitle(f);
    root.appendChild(ui.pageHead({
      eyebrow: grp ? grp.label : kindOf(f).label, title: title,
      actions: [ui.btn({ label: 'All forms', kind: 'ghost', go: 'forms', icon: '←' }),
        can ? ui.btn({ label: 'Practise scoring', kind: 'primary', go: 'tool-' + t.id, icon: '✎' }) : null,
        t && !can ? ui.btn({ label: 'Open the tool', kind: 'ghost', go: 'tool-' + t.id }) : null].filter(Boolean)
    }));

    /* ---- Hero: what it is and why it is used, with who, when and how long ---- */
    var w = whatParts(f.what);
    var facts = [['Completed by', filled(f.who)], ['When to send it', filled(f.whenSent)], ['Time to complete', filled(f.time)]]
      .filter(function (r) { return r[1]; });
    var heroText = w.lead || w.why ? h('div', { class: 'gd-htext prose' }, w.lead, w.why) : null;
    var aside = facts.length ? h('dl', { class: 'ds-kv gd-hkv' }, facts.map(function (r) { return [h('dt', null, r[0]), h('dd', null, r[1])]; })) : null;
    if (heroText || aside) root.appendChild(ui.hero({ eyebrow: 'What it is', text: heroText, aside: aside, label: 'About ' + title }));

    /* ---- Sections in reading order (empty ones are left out) ---- */
    var secs = [];
    function add(sid, label, stitle, body, text) { if (body) secs.push({ id: 'gd-' + sid, label: label, title: stitle, body: body, text: text || null }); }
    var pits = texts(f.pitfalls), recs = texts(f.recommendedBy);
    add('about', 'About the form', 'About the form', w.rest.length ? stackTables(h('div', { class: 'prose' }, w.rest), 'gd-stack') : null);
    add('read', 'How to read it', 'How to read and score it', filled(f.howToRead) || can ? [
      filled(f.howToRead) ? htmlSteps(f.howToRead) : null,
      can ? ui.callout('info', h('div', { class: 'gd-try' },
        h('p', null, h('strong', null, 'Try it yourself. '), 'Fill in the practice form for ' + toolLabel(t) + ' and watch the score, bands and flags update. Practice answers are never linked to a patient.'),
        ui.btn({ label: 'Practise scoring this form', kind: 'primary', small: true, go: 'tool-' + t.id }))) : null] : null);
    add('meaning', 'What it means', 'What the result means', meaningTable(f.meaning));
    add('example', 'Worked example', 'Worked example', exampleBlock(f.example));
    var useRows = [['Feeds into', filled(f.feedsInto)], ['Strength of evidence', filled(f.strength)]].filter(function (r) { return r[1]; });
    add('use', 'In the assessment', 'Using it in the assessment', useRows.length ? h('dl', { class: 'ds-kv gd-kv' }, useRows.map(function (r) {
      return [h('dt', null, r[0]), h('dd', null, cite(r[1]))];
    })) : null);
    var more = [];
    if (pits.length) more.push({ title: 'Pitfalls to avoid', meta: U.plural(pits.length, 'pitfall'), render: function () { return h('ul', { class: 'gd-pits' }, pits.map(function (p) { return h('li', null, cite(p)); })); } });
    if (recs.length) more.push({ title: 'Recommended by', meta: U.plural(recs.length, 'source'), render: function () { return h('ul', { class: 'gd-recs' }, recs.map(li)); } });
    add('more', pits.length ? 'Pitfalls and sources' : 'Sources', pits.length ? 'Pitfalls and sources' : 'Sources', more.length ? ui.acc(more) : null);

    if (!secs.length) {
      root.appendChild(ui.empty('No guidance yet', 'The reading guide for this form has not been written yet.', ui.btn({ label: 'All forms', kind: 'primary', go: 'forms' })));
      return;
    }
    var main = secs.map(function (s) { return ui.section({ id: s.id, title: s.title, text: s.text }, s.body); });
    var toc = secs.length > 2 ? ui.toc(secs.map(function (s) { return { id: s.id, label: s.label }; })) : null;
    root.appendChild(toc ? ui.split(main, toc) : h('div', { class: 'gd-main' }, main));

    /* ---- Previous / next form ---- */
    var all = ordered(), idx = all.indexOf(f);
    var prev = idx > 0 ? all[idx - 1] : null, next = idx > -1 && idx < all.length - 1 ? all[idx + 1] : null;
    function pnCard(x, label, cls) {
      return h('a', { class: 'ds-card gd-pn-card ' + cls, href: '#form-' + x.id, 'data-go': 'form-' + x.id },
        h('span', { class: 'gd-pn-k' }, label), h('span', { class: 'ds-card-t' }, formTitle(x)));
    }
    if (prev || next) {
      root.appendChild(h('nav', { class: 'gd-pn', 'aria-label': 'Other forms' },
        prev ? pnCard(prev, '← Previous form', 'is-prev') : h('span'),
        next ? pnCard(next, 'Next form →', 'is-next') : h('span')));
    }
    return function () { if (toc && typeof toc.disconnect === 'function') toc.disconnect(); };
  }

  /* ======================================================================
     Component: AA.components.ddxProtocol(opts)
     opts: {checked: {<checkId>: true}, onCheck(checkId, bool), compact: bool, actions: [nodes]}
     The steps show one at a time (ui.stepper): what to do, questions and decision rules as tabs, red flags, and the
     checks to tick. The pips show each step's progress. The caller persists ticks in onCheck; the component keeps its
     own copy for the counts. Returns the element, with el.setChecked(obj) to re-sync (for example after a reset) and
     el.counts() -> {steps, stepsDone, checks, ticked}.
     ====================================================================== */

  function protocol() { var p = AA.data.ddxProtocol; return p && typeof p === 'object' ? p : {}; }

  function normStep(s, i) {
    var id = txt(s.id) || 'p' + (i + 1);
    return {
      id: id, n: typeof s.n === 'number' ? s.n : i + 1, title: filled(s.title) || 'Step ' + (i + 1), goal: filled(s.goal),
      doList: texts(s['do']), ask: texts(s.ask), tools: texts(s.tools), conds: texts(s.conds), decide: texts(s.decide), redFlags: texts(s.redFlags),
      checks: arr(s.checks).map(function (c, j) {
        if (typeof c === 'string') c = { t: c };
        if (!c || typeof c !== 'object' || !filled(c.t)) return null;
        return { id: txt(c.id) || id + '_c' + (j + 1), t: filled(c.t) };
      }).filter(Boolean)
    };
  }
  function protoSteps() { return arr(protocol().steps).filter(function (s) { return s && typeof s === 'object'; }).map(normStep); }

  function toolChips(ids) {
    return ui.chips(ids.map(function (id) {
      var t = AA.byId('tools', id);
      return t ? { label: toolLabel(t), go: 'tool-' + id } : { label: id };
    }));
  }
  /* Condition names are long ("Bipolar disorder (type I and type II)"): links in a list read better than pills, with
     a closing bracketed qualifier shown lighter. */
  function condLinks(ids) {
    return h('ul', { class: 'gd-clinks' }, ids.map(function (id) {
      var c = AA.byId('ddx', id);
      var name = (c && c.name) || id;
      var m = name.match(/^(.*?)\s*(\(.*\))$/);
      return h('li', null, h('a', { class: 'gd-clink', href: '#cond-' + id, 'data-go': 'cond-' + id },
        m ? [h('span', { class: 'gd-cname' }, m[1]), ' ', h('span', { class: 'gd-cqual' }, m[2])] : h('span', { class: 'gd-cname' }, name)));
    }));
  }
  /* "(Informant) What were they like ..." -> a small "Informant" label before the question. */
  function askItem(q) {
    var m = String(q).match(/^\(([^()]{2,24})\)\s+/);
    return h('li', null, m ? h('span', { class: 'gd-who' }, m[1]) : null, h('span', null, m ? q.slice(m[0].length) : q));
  }

  AA.components.ddxProtocol = function (opts) {
    opts = opts || {};
    var onCheck = typeof opts.onCheck === 'function' ? opts.onCheck : function () {};
    var state = {};
    function setState(obj) {
      state = {};
      if (obj && typeof obj === 'object') Object.keys(obj).forEach(function (k) { if (obj[k]) state[k] = true; });
    }
    setState(opts.checked);

    var root = h('div', { class: 'gd-proto' + (opts.compact ? ' gd-compact' : '') });
    var steps = protoSteps();
    root.setChecked = function () {};
    root.counts = function () { return { steps: 0, stepsDone: 0, checks: 0, ticked: 0 }; };
    if (!steps.length) {
      root.appendChild(ui.empty('The protocol is not available', 'No protocol steps are loaded in this build.'));
      return root;
    }

    function ticked(s) { return s.checks.filter(function (c) { return state[c.id]; }).length; }
    function isDone(s) { return s.checks.length > 0 && ticked(s) === s.checks.length; }
    function counts() {
      var c = { steps: 0, stepsDone: 0, checks: 0, ticked: 0 };
      steps.forEach(function (s) {
        var n = s.checks.length, k = ticked(s);
        c.checks += n; c.ticked += k;
        if (n) { c.steps++; if (k === n) c.stepsDone++; }
      });
      return c;
    }

    /* ---- Overall progress ---- */
    var status = h('p', { class: 'gd-pstatus', role: 'status', 'aria-live': 'polite' });
    var meter = ui.progress(0, 1, 'Protocol checks ticked');
    var acts = arr(opts.actions);
    root.appendChild(h('div', { class: 'gd-prog' }, h('div', { class: 'gd-prog-text' }, status, meter), acts.length ? h('div', { class: 'gd-prog-act' }, acts) : null));

    /* ---- One step: tabs (do, ask, decide) and red flags; checks, conditions and tools beside them ---- */
    var lastTab = 'do';
    function checklist(s) {
      if (!s.checks.length) return null;
      var n = s.checks.length;
      var countEl = h('span', { class: 'gd-ccount' });
      var mini = ui.progress(0, 1, 'Checks ticked for step ' + s.n);
      var doneEl = h('p', { class: 'gd-cdone', hidden: true }, ui.icon('check'), h('span', null, 'Step complete: every check is ticked.'));
      function paintLocal() {
        var k = ticked(s), pct = Math.round(100 * k / n);
        countEl.textContent = k + ' of ' + n;
        mini.setAttribute('aria-valuenow', String(pct));
        if (mini.firstChild) mini.firstChild.style.width = pct + '%';
        doneEl.hidden = k !== n;
      }
      var rows = s.checks.map(function (c) {
        return ui.check({ label: c.t, checked: !!state[c.id], onChange: function (v) {
          if (v) state[c.id] = true; else delete state[c.id];
          try { onCheck(c.id, !!v); } catch (e) { if (window.console) console.error(e); }
          paintLocal();
          paint();
        } });
      });
      paintLocal();
      return h('section', { class: 'gd-checks', 'aria-label': 'Checks for step ' + s.n },
        h('div', { class: 'gd-checks-head' }, h('h3', { class: 'gd-mini-h' }, 'Before you move on, confirm'), countEl),
        mini, h('div', { class: 'gd-checks-list' }, rows), doneEl);
    }
    /* Conditions and tools: shown beside the checks on wide screens; one closed row on phones (they are links). */
    function covers(s) {
      var parts = [];
      if (s.conds.length) parts.push(h('div', { class: 'gd-cov' }, h('h3', { class: 'gd-mini-h' }, 'Conditions this step covers'), condLinks(s.conds)));
      if (s.tools.length) parts.push(h('div', { class: 'gd-cov' }, h('h3', { class: 'gd-mini-h' }, 'Tools to use'), toolChips(s.tools)));
      if (!parts.length) return null;
      if (wideScreen()) return h('div', { class: 'gd-covers' }, parts);
      var meta = [s.conds.length ? U.plural(s.conds.length, 'condition') : '', s.tools.length ? U.plural(s.tools.length, 'tool') : ''].filter(Boolean).join(' · ');
      return h('details', { class: 'gd-covers-d' },
        h('summary', null, h('span', { class: 'gd-sum-tt' }, h('span', null, 'Conditions and tools'), h('span', { class: 'gd-sum-n' }, meta))),
        h('div', { class: 'gd-covers-body' }, parts));
    }
    /* Red flags: an open warning callout on wide screens; on phones a closed warning row with the count, so the
       checks stay within reach. */
    function redFlags(s) {
      if (!s.redFlags.length) return null;
      var list = h('ul', { class: 'list gd-flags' }, s.redFlags.map(function (t) { return h('li', null, cite(t)); }));
      if (wideScreen()) return ui.callout('warn', list, [ui.icon('alert'), ' Red flags']);
      return h('details', { class: 'gd-flags-d' },
        h('summary', null, ui.icon('alert'), h('span', { class: 'gd-sum-tt' }, h('span', null, 'Red flags'), h('span', { class: 'gd-sum-n' }, U.plural(s.redFlags.length, 'sign')))),
        list);
    }
    function stepBody(s) {
      var tabs = [];
      if (s.doList.length) tabs.push({ id: 'do', label: 'Do this', count: s.doList.length, render: function () {
        return h('ol', { class: 'ds-steps gd-dosteps' }, s.doList.map(function (t) { return h('li', null, h('span', { class: 'ds-steps-p' }, cite(t))); }));
      } });
      if (s.ask.length) tabs.push({ id: 'ask', label: 'Ask', count: s.ask.length, render: function () {
        return h('div', { class: 'gd-ask' },
          h('div', { class: 'gd-ask-bar' }, ui.btn({ label: 'Copy all', kind: 'quiet', small: true, icon: '⧉', aria: 'Copy all questions for step ' + s.n,
            onClick: function () { copyLines(s.ask, 'Questions'); } })),
          h('ul', { class: 'gd-asklist' }, s.ask.map(askItem)));
      } });
      if (s.decide.length) tabs.push({ id: 'decide', label: 'Decide', count: s.decide.length, render: function () {
        return h('ul', { class: 'gd-decide' }, s.decide.map(function (t) { return h('li', null, leadIn(t)); }));
      } });
      var active = tabs.some(function (x) { return x.id === lastTab; }) ? lastTab : (tabs[0] ? tabs[0].id : null);
      return h('div', { class: 'gd-sbody' }, h('div', { class: 'gd-sgrid' },
        h('div', { class: 'gd-smain' }, tabs.length ? ui.tabs(tabs, active, function (tid) { lastTab = tid; }) : null, redFlags(s)),
        h('div', { class: 'gd-sside' }, checklist(s), covers(s))));
    }

    /* Start at the first step that still has unticked checks (or the first step). */
    var startAt = 0;
    for (var i = 0; i < steps.length; i++) { if (!isDone(steps[i])) { startAt = i; break; } }
    var stepper = null;
    stepper = ui.stepper(steps.map(function (s) {
      return { title: s.title, sub: s.goal, label: String(s.n), done: function () { return isDone(s); }, render: function () { return stepBody(s); } };
    }), { start: startAt, label: 'Protocol steps', eyebrow: function (j) { return 'Step ' + steps[j].n + ' of ' + steps.length; }, onChange: function () { paintPips(); } });
    root.appendChild(stepper);

    /* Pips: done (green, from the stepper), part-done (a small bar showing how far), and a status for screen readers. */
    function paintPips() {
      if (!stepper) return;
      var cur = stepper.index();
      U.$$('.ds-stepper-pip', stepper).forEach(function (b, j) {
        var s = steps[j];
        if (!s) return;
        var n = s.checks.length, k = ticked(s);
        b.classList.toggle('gd-part', n > 0 && k > 0 && k < n && j !== cur);
        b.style.setProperty('--gd-p', (n ? Math.round(100 * k / n) : 0) + '%');
        var st = b.querySelector('.gd-pip-st');
        if (!st) { st = h('span', { class: 'sr-only gd-pip-st' }); b.appendChild(st); }
        st.textContent = !n ? '' : k === n ? ', complete' : ', ' + k + ' of ' + n + ' checks ticked';
      });
    }
    function paint() {
      var c = counts(), pct = c.checks ? Math.round(100 * c.ticked / c.checks) : 0;
      status.textContent = c.stepsDone + ' of ' + U.plural(c.steps, 'step') + ' complete · ' + c.ticked + ' of ' + U.plural(c.checks, 'check') + ' ticked';
      meter.setAttribute('aria-valuenow', String(pct));
      if (meter.firstChild) meter.firstChild.style.width = pct + '%';
      stepper.refresh();
      paintPips();
    }

    root.setChecked = function (obj) {
      setState(obj);
      stepper.show(stepper.index());
      paint();
    };
    root.counts = counts;
    paint();
    return root;
  };

  /* ======================================================================
     Route: ddxguide (differential diagnosis protocol)
     ====================================================================== */

  var SANDBOX = 'sandbox.ddxProtocol';

  /* After the last step: the four verdicts as cards, rules without a term (criterion E) as a callout, and the
     condition-specific rules and the documentation checklist on demand. */
  function termOf(t) { var i = t.indexOf(': '); return i > 0 && i <= 60 ? { term: t.slice(0, i), body: t.slice(i + 2) } : null; }
  function verdictSection(rules, docs) {
    var verdicts = [], byCond = [], plain = [];
    rules.forEach(function (t) {
      var p = termOf(t);
      if (p && VERDICTS[p.term.toLowerCase()]) verdicts.push(p);
      else if (p) byCond.push(p);
      else plain.push(t);
    });
    var content = [];
    if (verdicts.length) {
      content.push(ui.cards(verdicts.map(function (v) {
        var d = VERDICTS[v.term.toLowerCase()];
        return { icon: d.icon, tone: d.tone, title: v.term, text: cite(cap(v.body)) };
      }), { wide: true }));
    }
    if (plain.length) content.push(ui.callout('info', plain.length === 1 ? h('p', null, cite(plain[0])) : h('ul', { class: 'list' }, plain.map(function (t) { return h('li', null, cite(t)); }))));
    var more = [];
    if (byCond.length) more.push({ title: 'Rules for specific conditions', meta: U.plural(byCond.length, 'rule'), render: function () {
      return h('dl', { class: 'ds-kv gd-kv' }, byCond.map(function (p) { return [h('dt', null, p.term), h('dd', null, cite(cap(p.body)))]; }));
    } });
    if (docs.length) more.push({ title: 'What to document', meta: U.plural(docs.length, 'item'), render: function () {
      return h('div', { class: 'gd-docs' },
        h('div', { class: 'gd-docs-bar' }, ui.btn({ label: 'Copy the checklist', kind: 'quiet', small: true, icon: '⧉', aria: 'Copy what to document',
          onClick: function () { copyLines(docs.map(function (d) { return '- ' + d; }), 'Checklist'); } })),
        h('ul', { class: 'gd-doclist' }, docs.map(function (d) { return h('li', null, ui.icon('check'), h('span', null, cite(d))); })));
    } });
    if (more.length) content.push(ui.acc(more));
    return ui.section({ id: 'gd-verdict', title: verdicts.length ? 'Reach a verdict' : 'After the last step',
      text: verdicts.length ? 'Every condition gets one of ' + numWord(verdicts.length) + ' verdicts.' : null }, content);
  }

  function renderGuide(el) {
    var root = h('div', { class: 'gd gd-ddx' });
    el.appendChild(root);
    var P = protocol();
    var last = AA.shell && AA.shell.lastAssessment ? AA.shell.lastAssessment() : null;
    var ref = last && last.patient && last.patient.ref ? last.patient.ref : 'the current patient';
    function useBtn() { return last ? ui.btn({ label: 'Use with an assessment', kind: 'primary', go: 'assess-' + last.id + '-ddx', title: 'Open the differential diagnosis step for ' + ref }) : null; }
    root.appendChild(ui.pageHead({
      eyebrow: 'Step-by-step method', title: 'Differential diagnosis protocol',
      lead: 'Follow these steps in order so that no alternative explanation is missed.',
      actions: [useBtn(), ui.btn({ label: 'Conditions A to Z', kind: 'ghost', go: 'ddx' })].filter(Boolean)
    }));

    var steps = protoSteps();
    if (!steps.length) {
      root.appendChild(ui.empty('The protocol is not available', 'The differential diagnosis protocol is not loaded in this build. The differential diagnosis reference lists every condition to consider.',
        ui.btn({ label: 'Open the differential diagnosis reference', kind: 'primary', go: 'ddx' })));
      return;
    }
    var nChecks = steps.reduce(function (n, s) { return n + s.checks.length; }, 0);
    var qs = arr(P.questions).filter(function (q) { return q && typeof q === 'object' && filled(q.q); });
    var tests = arr(P.tests).filter(function (x) { return x && typeof x === 'object' && filled(x.t); });
    var structured = qs.length > 0 || tests.length > 0;
    var rules = texts(P.principles);
    var fin = P.final && typeof P.final === 'object' ? P.final : {};
    var verdictRules = texts(fin.rules), docs = texts(fin.documentation);
    var refs = texts(P.refs);

    /* ---- Hero: the two questions, and the numbers that show why both matter ---- */
    var stats = arr(P.stats).filter(function (x) { return x && typeof x === 'object' && filled(String(x.n)) && filled(x.l); })
      .map(function (x) { return { n: String(x.n), l: x.l }; })
      .concat([{ n: String(steps.length), l: 'steps, in a fixed order' }, nChecks ? { n: String(nChecks), l: 'checks to tick as you go' } : null].filter(Boolean));
    var heroText = qs.length ? h('div', { class: 'gd-htext' },
      h('p', null, 'The protocol answers ' + (qs.length === 2 ? 'two questions. Both matter.' : U.plural(qs.length, 'question') + '.')),
      h('ol', { class: 'gd-qs' }, qs.map(function (q) {
        return h('li', null, filled(q.t) ? h('strong', { class: 'gd-qs-t' }, q.t) : null, h('span', { class: 'gd-qs-q' }, q.q));
      })))
      : (filled(P.intro) ? h('div', { class: 'gd-htext' }, prose(P.intro)) : null);
    var statsEl = ui.stats(stats), nData = stats.length - (nChecks ? 2 : 1);
    /* The counted tiles (steps, checks) are small; on phones they share a row. */
    Array.prototype.forEach.call(statsEl.children, function (tile, j) { if (j >= nData) tile.classList.add('gd-stat-sm'); });
    root.appendChild(ui.hero({ eyebrow: 'What it is for', title: 'Is it ADHD, another condition, or both?', text: heroText, aside: statsEl }));

    var jump = jumpNav([
      tests.length ? { id: 'gd-tests', label: cap(numWord(tests.length)) + ' tests' } : null,
      rules.length ? { id: 'gd-principles', label: 'Principles', n: rules.length } : null,
      { id: 'gd-steps', label: 'The steps', n: steps.length },
      verdictRules.length || docs.length ? { id: 'gd-verdict', label: 'Verdicts' } : null,
      refs.length ? { id: 'gd-sources', label: 'Sources' } : null]);
    if (jump) root.appendChild(jump);

    /* ---- The six tests and the principles ---- */
    if (tests.length) {
      root.appendChild(ui.section({ id: 'gd-tests', title: 'The ' + numWord(tests.length) + ' tests', text: 'The same ' + numWord(tests.length) + ' tests run through every step.' }, [
        ui.cards(tests.map(function (x, j) { return { icon: TEST_ICON[x.id] || SPARE_ICONS[j % SPARE_ICONS.length], title: x.t, text: filled(x.q) || null }; }), { wide: true }),
        filled(P.caveat) ? ui.callout('info', h('p', { html: P.caveat })) : null]));
    }
    if (rules.length) {
      var rg = ruleGrid(rules, 'gd-pr');
      root.appendChild(ui.section({ id: 'gd-principles', title: 'Principles', text: 'The reasoning behind every step. Open a principle for the why and the sources.', actions: rg.toggle }, rg.el));
    }

    /* ---- The protocol (practice ticks in the clinician's profile) ---- */
    var saved = AA.progress.get(SANDBOX, {});
    var proto = null;
    var resetBtn = ui.btn({ label: 'Reset ticks', kind: 'quiet', small: true, icon: '↺', onClick: function () {
      U.confirm({ title: 'Clear all ticks?', body: 'Every tick on this practice copy of the protocol will be cleared. Assessments are not affected.', ok: 'Clear ticks', danger: true })
        .then(function (yes) {
          if (!yes) return;
          AA.progress.set(SANDBOX, undefined);
          if (proto) proto.setChecked({});
          U.toast('Ticks cleared', 'ok');
        });
    } });
    proto = AA.components.ddxProtocol({
      checked: saved && typeof saved === 'object' ? saved : {},
      onCheck: function (cid, v) { AA.progress.set(SANDBOX + '.' + cid, v || undefined); },
      actions: [resetBtn]
    });
    root.appendChild(ui.section({ id: 'gd-steps', title: 'The protocol, step by step',
      text: structured && filled(P.intro) ? stripTags(P.intro) : 'Work through the steps in order. Tick the checks before you move on.' }, [
      h('p', { class: 'ds-note gd-sandbox' }, ui.icon('info'), h('span', null, 'Ticks here are saved in your profile only and are not linked to any patient. ' +
        (last ? 'To record the protocol for ' + ref + ', use the differential diagnosis step of the assessment.' : 'To record it for a patient, use the differential diagnosis step of an assessment.'))),
      proto]));

    /* ---- After the last step, sources, and the way back to the assessment ---- */
    if (verdictRules.length || docs.length) root.appendChild(verdictSection(verdictRules, docs));
    if (refs.length) {
      root.appendChild(h('section', { id: 'gd-sources', class: 'gd-srcsec', 'aria-label': 'Sources' },
        ui.details('Sources', h('ol', { class: 'gd-refs' }, refs.map(li)), { cls: 'gd-src', meta: U.plural(refs.length, 'source') })));
    }
    if (last) root.appendChild(h('div', { class: 'gd-endbar' }, h('p', null, 'Ready to apply this to ' + ref + '?'), useBtn()));
  }

  /* ======================================================================
     Routes
     ====================================================================== */

  AA.router.register('forms', { title: 'Pre-appointment forms', render: function (el) { renderForms(el); } });
  AA.router.register('form', {
    title: function (p) { var f = p && p[0] ? formById(p[0]) : null; return f ? formTitle(f) : 'Pre-appointment forms'; },
    render: function (el, params) { return renderForm(el, params); }
  });
  AA.router.register('ddxguide', { title: 'Differential diagnosis protocol', render: function (el) { renderGuide(el); } });
})(window.AA);
