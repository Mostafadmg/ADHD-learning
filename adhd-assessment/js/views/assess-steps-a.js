/* Assessment steps, part A: before you start, screening questionnaires, safety and risk,
   clinical history and the co-occurring conditions screen.
   Each step registers AA.steps.<id> = {render(el, ctx)} (see ARCHITECTURE.md, section 6).
   The frame renders the h1, step strip, live panel and previous/next buttons, so step content
   starts at h2. Steps write through ctx.set (undefined deletes) and re-read with ctx.get. */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui;
  AA.steps = AA.steps || {};

  /* ---------- Shared helpers ---------- */

  function stepTools(key) {
    var T = (AA.diagnosis && AA.diagnosis.STEP_TOOLS) || {};
    return T[key] || [];
  }
  function toolList(ids) {
    return ids.map(function (id) { return AA.byId('tools', id); }).filter(Boolean);
  }
  function hasItems(t) { return !!(t && t.interactive !== false && t.items && t.items.length); }

  /* Score a tool from the stored answers. Never throws: odd data gives null. */
  function resultFor(ctx, t) {
    if (!hasItems(t)) return null;
    try { return AA.scoring.score(t, ctx.get('tools.' + t.id + '.answers', {}) || {}); } catch (e) { return null; }
  }
  /* Same rule as AA.diagnosis.ddxScreens: positive flag, or a band of moderate or above. */
  function isPositive(r) { return !!r && r.answered > 0 && (r.positive === true || (r.sev !== null && r.sev !== undefined && r.sev >= 2)); }
  function isNegative(r) {
    if (!r || !r.answered || isPositive(r)) return false;
    return r.positive === false || (r.complete && r.sev !== null && r.sev !== undefined && r.sev < 2);
  }
  function urgentFlags(r) { return r && r.flags ? r.flags.filter(function (f) { return f.level === 'urgent'; }) : []; }

  function answeredNode(t, r) {
    if (!hasItems(t)) return h('span', { class: 'muted' }, 'Use the official form');
    if (!r || !r.answered) return h('span', { class: 'muted' }, '0 of ' + (r ? r.of : t.items.length));
    if (r.complete) return ui.badge('Complete', 'ok');
    return h('span', null, r.answered + ' of ' + r.of);
  }
  function resultNode(r) {
    if (!r || !r.answered) return h('span', { class: 'muted' }, '-');
    var num = r.total !== null && r.total !== undefined && r.max ? h('span', { class: 'as-num' }, r.total + ' / ' + r.max) : null;
    var band = r.band ? ui.sevChip(r.sev, r.band) : null;
    if (!num && !band) return h('span', { class: 'muted' }, 'Provisional');
    return h('span', { class: 'as-res' }, num, band);
  }
  function screenNode(r) {
    var out = h('span', { class: 'as-res' });
    if (!r || !r.answered) out.appendChild(ui.badge('Not started', 'neutral'));
    else if (isPositive(r)) out.appendChild(ui.badge('Positive', 'warn'));
    else if (isNegative(r)) out.appendChild(ui.badge('Negative', 'ok'));
    else out.appendChild(ui.badge('Incomplete', 'neutral'));
    if (urgentFlags(r).length) out.appendChild(ui.badge('Urgent flag', 'err'));
    return out;
  }
  function fill(host, node) { U.clear(host); U.append(host, node); }

  /* <details> whose body is built the first time it opens (questionnaires can be long). */
  function lazyDetails(summary, build, o) {
    var body = h('div', { class: 'as-dbody' });
    var built = false;
    function ensure() { if (!built) { built = true; build(body); } }
    var d = ui.details(summary, body, { open: !!o.open, meta: o.meta, cls: o.cls, onToggle: function (open) { if (open) ensure(); } });
    if (o.open) ensure();
    d.ensure = ensure;
    return d;
  }

  /* Open a disclosure, build it if needed and move focus to its summary. */
  function reveal(d) {
    if (!d) return;
    d.open = true;
    if (d.ensure) d.ensure();
    var s = d.querySelector('summary');
    try { d.scrollIntoView({ block: 'start' }); } catch (e) { /* old browsers */ }
    if (s) { try { s.focus({ preventScroll: true }); } catch (e) { s.focus(); } }
  }

  /* Short "about this tool" block: who, time, purpose, when, plus how and ADHD notes on demand. */
  /* The facts line stays visible; the longer guidance folds away so the items come first. */
  function aboutTool(t) {
    var facts = [t.who, t.time, t.items_n ? U.plural(t.items_n, 'item') : null, t.ages].filter(Boolean).join(' · ');
    var more = [
      t.purpose ? h('p', null, t.purpose) : null,
      t.when ? h('p', null, h('strong', null, 'When: '), t.when) : null,
      t.how ? [h('h4', { class: 'as-abouth' }, 'How to give it'), h('p', null, t.how)] : null,
      t.adhdNotes ? [h('h4', { class: 'as-abouth' }, 'Reading the result in an ADHD assessment'), h('p', null, t.adhdNotes)] : null
    ].filter(Boolean);
    return h('div', { class: 'as-about' },
      facts ? h('p', { class: 'hint' }, facts) : null,
      more.length ? ui.details('About this questionnaire', h('div', { class: 'as-aboutbody' }, more), { cls: 'as-aboutdet' }) : null);
  }

  /* One questionnaire inside a disclosure: about, items with live score, notes, library link.
     o: {open, optional, extra(t) -> {el, update}} */
  function toolBlock(ctx, t, o) {
    var meta = h('span', { class: 'as-meta' });
    var extra = null;
    var d = lazyDetails(h('span', null, h('strong', null, t.abbr || t.id), t.name ? h('span', { class: 'as-tname-inline' }, ' ' + t.name) : null), function (body) {
      body.appendChild(aboutTool(t));
      if (hasItems(t)) {
        body.appendChild(h('h3', { class: 'as-subh' }, 'Items and score'));
        body.appendChild(AA.components.questionnaire(t, {
          answers: ctx.get('tools.' + t.id + '.answers', {}) || {},
          onAnswer: function (n, v) { ctx.set('tools.' + t.id + '.answers.' + n, v === null ? undefined : v); }
        }));
      } else {
        body.appendChild(ui.callout('info', h('p', null, 'This instrument is not reproduced here because of its licence. Use the official form, then record the result in the notes below.')));
      }
      if (o.extra) { extra = o.extra(t); extra.update(resultFor(ctx, t)); body.appendChild(extra.el); }
      body.appendChild(h('div', { class: 'as-notes' }, ui.field('Notes on ' + (t.abbr || t.id), ui.input({
        rows: 2, value: ctx.get('tools.' + t.id + '.notes', ''),
        placeholder: 'For example: checked the answers with the patient, items they were unsure about, who completed it.',
        onSave: function (v) { ctx.set('tools.' + t.id + '.notes', v.trim() ? v : undefined); }
      }))));
      body.appendChild(h('div', { class: 'row as-foot' }, ui.btn({ label: 'Scoring guide in the tools library', kind: 'quiet', small: true, go: 'tool-' + t.id })));
    }, { open: o.open, meta: meta, cls: 'as-tool' });
    d.id = 'as-tool-' + t.id;
    function update(r) {
      U.clear(meta);
      if (o.optional) meta.appendChild(ui.badge('Optional', 'neutral'));
      if (!hasItems(t)) meta.appendChild(ui.badge('Official form', 'neutral'));
      else if (!r || !r.answered) meta.appendChild(h('span', null, 'Not started'));
      else {
        meta.appendChild(r.complete ? ui.badge('Complete', 'ok') : h('span', null, r.answered + ' of ' + r.of));
        if (isPositive(r)) meta.appendChild(ui.badge('Positive', 'warn'));
        else if (isNegative(r)) meta.appendChild(ui.badge('Negative', 'ok'));
        if (urgentFlags(r).length) meta.appendChild(ui.badge('Urgent flag', 'err'));
      }
      if (extra && extra.update) extra.update(r);
    }
    return { el: d, update: update, t: t };
  }

  /* Live results table. Rows stack into labelled blocks on phones.
     o: {optional(t) -> bool, points: bool, onOpen(id)} */
  function resultsTable(ctx, list, o) {
    var head = ['Tool', 'Answered', 'Result', 'Screen'];
    if (o.points) head.push('Points to');
    var rows = list.map(function (t) {
      var c = { ans: h('td', { 'data-label': 'Answered' }), res: h('td', { 'data-label': 'Result' }), pos: h('td', { 'data-label': 'Screen' }),
        pts: o.points ? h('td', { 'data-label': 'Points to' }) : null };
      var name = h('button', { type: 'button', class: 'as-linkbtn', onclick: function () { o.onOpen(t.id); }, 'aria-label': 'Go to ' + (t.abbr || t.id) },
        t.abbr || t.id);
      c.tr = h('tr', null,
        h('th', { scope: 'row' }, name, t.name ? h('span', { class: 'as-tname' }, t.name) : null, o.optional(t) ? ui.badge('Optional', 'neutral') : null),
        c.ans, c.res, c.pos, c.pts);
      c.t = t;
      return c;
    });
    var el = h('div', { class: 'table-wrap as-sum' }, h('table', { class: 'table' },
      h('thead', null, h('tr', null, head.map(function (x) { return h('th', { scope: 'col' }, x); }))),
      h('tbody', null, rows.map(function (c) { return c.tr; }))));
    function update(results) {
      rows.forEach(function (c) {
        var r = results[c.t.id];
        fill(c.ans, answeredNode(c.t, r));
        fill(c.res, resultNode(r));
        fill(c.pos, screenNode(r));
        if (c.pts) fill(c.pts, pointsNode(ctx, c.t, r));
      });
    }
    return { el: el, update: update };
  }

  /* Differentials whose screen list includes this tool. */
  function condsFor(toolId) {
    return (AA.data.ddx || []).filter(function (c) { return (c.screen || []).indexOf(toolId) > -1; });
  }
  /* Condition names without the bracketed detail, for compact lists (the full name is in the title). */
  function shortName(c) { return String(c.name || c.id).replace(/\s*\([^)]*\)/g, '').trim() || c.id; }
  function condLinks(conds) {
    return h('ul', { class: 'as-plist' }, conds.map(function (c) {
      return h('li', null, h('a', { href: '#cond-' + c.id, 'data-go': 'cond-' + c.id, title: c.name }, shortName(c)));
    }));
  }
  function pointsNode(ctx, t, r) {
    var conds = condsFor(t.id);
    if (!conds.length) return h('span', { class: 'muted' }, '-');
    var list = conds.length > 3 ? ui.details(U.plural(conds.length, 'differential'), condLinks(conds), { cls: 'as-pts' }) : condLinks(conds);
    return h('div', { class: 'as-points' }, list,
      isPositive(r) ? ui.btn({ label: 'Review in differentials', kind: 'ghost', small: true, onClick: function () { ctx.go('ddx'); } }) : null);
  }

  /* Questionnaire flags for a set of tools, shown prominently. Re-renders only when the set changes,
     so screen readers do not hear the same alert again on every answer. */
  function flagPanel(ctx) {
    var host = h('div', { class: 'as-flagpanel' });
    var sig = '';
    function update(list, results) {
      var urgent = [], warn = [];
      list.forEach(function (t) {
        var r = results[t.id];
        ((r && r.flags) || []).forEach(function (f) {
          var line = h('li', null, h('strong', null, (t.abbr || t.id) + (f.item !== undefined ? ' item ' + f.item : '') + ': '), f.text);
          (f.level === 'urgent' ? urgent : warn).push({ key: t.id + ':' + f.item + ':' + f.level, node: line });
        });
      });
      var next = urgent.concat(warn).map(function (x) { return x.key; }).join('|');
      if (next === sig) return;
      sig = next;
      U.clear(host);
      if (urgent.length) {
        host.appendChild(ui.callout('err', h('div', null, h('ul', { class: 'list' }, urgent.map(function (x) { return x.node; })),
          h('p', null, 'Ask about this now and record what you find in the safety and risk step.'),
          ui.btn({ label: 'Go to safety and risk', kind: 'secondary', small: true, onClick: function () { ctx.go('risk'); } })), 'Urgent: act on this today'));
      }
      if (warn.length) host.appendChild(ui.callout('warn', h('ul', { class: 'list' }, warn.map(function (x) { return x.node; })), 'Items to follow up'));
    }
    return { el: host, update: update };
  }

  /* Shared body of the screening and co-occurring steps. */
  function questionnaireStep(el, ctx, o) {
    var list = o.tools;
    if (!list.length) {
      el.appendChild(ui.empty('No questionnaires available', 'The tools library has not loaded, so there is nothing to score here. Record results in your notes.'));
      return null;
    }
    var results = {};
    function rescoreAll() { list.forEach(function (t) { results[t.id] = resultFor(ctx, t); }); }
    rescoreAll();

    el.appendChild(o.intro);
    var flags = flagPanel(ctx);
    el.appendChild(flags.el);

    var blocks = {};
    function openTool(id) { if (blocks[id]) reveal(blocks[id].el); }
    var table = resultsTable(ctx, list, { optional: o.optional, points: !!o.points, onOpen: openTool });
    var live = h('p', { class: 'as-live', 'aria-live': 'polite' });
    el.appendChild(h('section', { class: 'as-sec' }, h('h2', null, 'Results at a glance'), live, table.el,
      h('p', { class: 'hint' }, 'Select a tool name to jump to it. Scores update as you answer.')));

    var firstOpen = null;
    list.forEach(function (t) {
      var r = results[t.id];
      if (!firstOpen && hasItems(t) && !(r && r.complete)) firstOpen = t.id;
    });

    o.groups.forEach(function (g) {
      var members = list.filter(g.filter);
      if (!members.length) return;
      var sec = h('section', { class: 'as-sec' }, h('h2', null, g.title), g.hint ? h('p', { class: 'hint' }, g.hint) : null);
      members.forEach(function (t) {
        var b = toolBlock(ctx, t, { open: t.id === firstOpen, optional: o.optional(t), extra: o.extra || null });
        blocks[t.id] = b;
        sec.appendChild(b.el);
      });
      el.appendChild(sec);
    });

    function update() {
      rescoreAll();
      table.update(results);
      flags.update(list, results);
      list.forEach(function (t) { if (blocks[t.id]) blocks[t.id].update(results[t.id]); });
      var core = list.filter(function (t) { return !o.optional(t) && hasItems(t); });
      var done = core.filter(function (t) { return results[t.id] && results[t.id].complete; }).length;
      var pos = list.filter(function (t) { return isPositive(results[t.id]); }).map(function (t) { return t.abbr || t.id; });
      live.textContent = 'Core scales complete: ' + done + ' of ' + core.length + '. ' +
        (pos.length ? 'Positive: ' + pos.join(', ') + '.' : 'No positive screens so far.');
    }
    update();
    ctx.onChange('tools', U.debounce(function () { if (el.isConnected) update(); }, 60));
    return { update: update };
  }

  /* ---------- 1. Before you start ---------- */

  var SEXES = [['', 'Not recorded'], ['Female', 'Female'], ['Male', 'Male'], ['Intersex', 'Intersex'], ['Prefer not to say', 'Prefer not to say']];
  var PRESENT = [['patient', 'The patient'], ['partner', 'Partner'], ['parent', 'Parent or carer'], ['sibling', 'Brother or sister']];
  var PREP = [
    ['questionnaires', 'Pre-appointment questionnaires returned and checked'],
    ['informant', 'Informant here today, or can be contacted later'],
    ['school', 'School reports or early records to hand, or requested'],
    ['time', 'Enough time booked (allow 1.5 to 3 hours)'],
    ['room', 'Quiet, private room with few interruptions'],
    ['records', 'Referral letter, previous records and assessments reviewed'],
    ['physical', 'Physical health baseline possible (pulse, blood pressure, weight, height)']
  ];

  AA.steps.setup = { render: function (el, ctx) {
    var p = ctx.get('patient', {}) || {};
    if (!p.date) ctx.set('patient.date', U.today());

    /* What this step needs (mirrors AA.diagnosis.stepProgress: reference, age, consent). */
    var todo = h('div', { class: 'as-todo', 'aria-live': 'polite' });
    function renderTodo() {
      var q = ctx.get('patient', {}) || {};
      U.clear(todo);
      todo.appendChild(h('span', { class: 'as-todo-k' }, 'Needed to complete this step:'));
      [['Reference', !!q.ref], ['Age', !!q.age], ['Consent', !!q.consent]].forEach(function (x) {
        todo.appendChild(h('span', { class: 'as-req' + (x[1] ? ' is-done' : '') }, h('span', { class: 'as-req-i', 'aria-hidden': 'true' }, x[1] ? '✓' : ''), x[0],
          h('span', { class: 'sr-only' }, x[1] ? ', done' : ', to do')));
      });
    }
    el.appendChild(todo);

    /* Patient details */
    var refMsg = h('p', { class: 'as-warnmsg', id: ui.nid('refmsg'), 'aria-live': 'polite' });
    var refHint = h('p', { class: 'hint', id: ui.nid('refhint') }, 'Required. Never a name or NHS number.');
    var refIn = ui.input({ value: p.ref, placeholder: 'For example AB0412 or J.S.', onSave: function (v) { ctx.set('patient.ref', v.trim()); refCheck(); } });
    refIn.setAttribute('aria-required', 'true');
    refIn.setAttribute('aria-describedby', refHint.id + ' ' + refMsg.id);
    var refField = ui.field('Reference or initials', refIn);
    refField.appendChild(refHint);
    refField.appendChild(refMsg);
    function refCheck() {
      var v = String(ctx.get('patient.ref', '') || '').trim();
      refMsg.textContent = /\d{3}\s?\d{3}\s?\d{4}/.test(v) ? 'This looks like an NHS number. Use a local reference instead.'
        : /^[A-Z][a-z]+\s+[A-Z][a-z'-]+$/.test(v) ? 'This looks like a full name. Use initials or a reference.' : '';
    }
    refCheck();

    var ageHost = h('div', { class: 'as-span' });
    function ageNote() {
      var n = parseInt(ctx.get('patient.age'), 10);
      U.clear(ageHost);
      if (isNaN(n) || n >= 18) return;
      ageHost.appendChild(ui.callout('warn', h('div', null,
        h('p', null, 'This app follows adult criteria and an adult interview. ' + (n < 16
          ? 'For children and young people under 16, use a child and adolescent pathway (for example the Young DIVA-5, for ages 5 to 17).'
          : 'For 16 and 17 year olds, check local policy on transition between services.')),
        h('p', null, n < 17 ? 'Under 17, DSM-5-TR needs 6 symptoms in a domain rather than 5. The scoring applies this automatically.'
          : 'From age 17 the adult threshold of 5 symptoms in a domain applies.')), 'Patient under 18'));
    }
    var ageIn = ui.input({ type: 'number', inputmode: 'numeric', min: 0, max: 120, value: p.age === null || p.age === undefined ? '' : p.age,
      onSave: function (v) { var n = parseInt(v, 10); ctx.set('patient.age', isNaN(n) ? null : n); ageNote(); } });
    ageNote();

    var sexSel = h('select', null, SEXES.map(function (o) { return h('option', { value: o[0], selected: (p.sex || '') === o[0] }, o[1]); }));
    sexSel.addEventListener('change', function () { ctx.set('patient.sex', sexSel.value); });

    function text(key, ph, rows) {
      return ui.input({ value: p[key], placeholder: ph, rows: rows, onSave: function (v) { ctx.set('patient.' + key, v); } });
    }
    el.appendChild(h('section', { class: 'card as-card' },
      h('h2', null, 'Patient details'),
      h('div', { class: 'form-grid' },
        refField,
        ui.field('Age (years)', ageIn),
        ageHost,
        ui.field('Sex', sexSel),
        ui.field('Gender identity (optional)', text('gender', 'How the patient describes themselves')),
        ui.field('Occupation', text('occupation', 'For example nurse, student, between jobs')),
        ui.field('Referred by', text('referrer', 'For example GP, self-referral, CAMHS transition')),
        ui.field('Date of assessment', ui.input({ type: 'date', value: p.date || U.today(), onSave: function (v) { ctx.set('patient.date', v || undefined); } })),
        h('div', { class: 'as-span' }, ui.field('Reason for referral', text('reason', 'The main concerns in the referral and in the patient\'s own words', 3))))));

    /* Who is here and what information you have */
    var inf = p.informants || {}, src = p.sources || {};
    el.appendChild(h('div', { class: 'grid-2 as-grid' },
      h('section', { class: 'card as-card' },
        h('h2', null, 'Who is present today'),
        h('p', { class: 'hint' }, 'The most useful informant knew the patient before age 12. If nobody is here, note who could be contacted.'),
        PRESENT.map(function (x) {
          return ui.check({ label: x[1], checked: !!inf[x[0]], onChange: function (v) { ctx.set('patient.informants.' + x[0], v); } });
        }),
        ui.field('Someone else (who)', ui.input({ value: inf.other, placeholder: 'For example friend, support worker', onSave: function (v) { ctx.set('patient.informants.other', v.trim()); } }))),
      h('section', { class: 'card as-card' },
        h('h2', null, 'Information available'),
        ui.check({ label: 'School reports', hint: 'Primary school reports are the most useful.', checked: !!src.schoolReports, onChange: function (v) { ctx.set('patient.sources.schoolReports', v); } }),
        ui.check({ label: 'Previous records or assessments', hint: 'For example GP records, CAMHS letters, educational psychology reports.', checked: !!src.previousRecords, onChange: function (v) { ctx.set('patient.sources.previousRecords', v); } }),
        h('hr', { class: 'sep as-sep' }),
        ui.check({ label: 'Interpreter needed', hint: 'Book a professional interpreter. Avoid family members interpreting.', checked: !!p.interpreter, onChange: function (v) { ctx.set('patient.interpreter', v); } }))));

    /* Explain the interview */
    el.appendChild(h('section', { class: 'card as-card' },
      h('h2', null, 'Explain the interview'),
      h('p', { class: 'hint' }, 'Read this aloud or say it in your own words.'),
      h('div', { class: 'as-script' },
        h('p', null, 'Thank you for coming. Before we start, I will explain how today works.'),
        h('ul', null,
          h('li', null, 'I will ask about things like concentration, getting organised, restlessness and acting on the spur of the moment.'),
          h('li', null, 'First we talk about the last six months. Then we go back to when you were at primary school, roughly age 5 to 12.'),
          h('li', null, 'For each question I will ask for real examples from your own life. Examples help me understand what it is like for you.'),
          h('li', null, 'With your permission, I would also like to hear from someone who knew you as a child, or knows you well now.'),
          h('li', null, 'It usually takes between one and a half and three hours. We can take a break whenever you need one.'),
          h('li', null, 'This is a conversation, not a test. There are no right or wrong answers. "I don\'t know" or "I can\'t remember" are fine answers.'),
          h('li', null, 'At the end I will tell you what I think, or explain what else I need before I can give you an answer.'),
          h('li', null, 'What you tell me is confidential. The exception is if I am worried about your safety or someone else\'s: then I may need to share it.')),
        h('p', null, 'Do you have any questions before we begin?')),
      h('div', { class: 'as-confirm' },
        ui.check({ label: 'Patient understands the purpose and agrees to the assessment', hint: 'Record verbal consent. If the patient does not agree, stop and note why.',
          checked: !!p.consent, onChange: function (v) { ctx.set('patient.consent', v); } }))));

    /* Preparation checklist */
    var prepLive = h('p', { class: 'as-live', 'aria-live': 'polite' });
    var prepMeter = h('div', { class: 'as-meter' });
    function renderPrep() {
      var pr = ctx.get('patient.prep', {}) || {};
      var n = PREP.filter(function (x) { return pr[x[0]]; }).length;
      prepLive.textContent = n + ' of ' + PREP.length + ' ready';
      fill(prepMeter, ui.progress(n, PREP.length, 'Preparation checklist'));
    }
    var prep = ctx.get('patient.prep', {}) || {};
    el.appendChild(h('section', { class: 'card as-card' },
      h('h2', null, 'Have you got everything?'),
      h('div', { class: 'as-prephead' }, prepLive, prepMeter),
      h('div', { class: 'as-checkgrid' }, PREP.map(function (x) {
        return ui.check({ label: x[1], checked: !!prep[x[0]], onChange: function (v) { ctx.set('patient.prep.' + x[0], v ? true : undefined); } });
      })),
      h('p', { class: 'hint' }, 'Missing something is not a reason to stop. Note it, and plan how to fill the gap (for example, phone an informant later).')));

    renderTodo();
    renderPrep();
    ctx.onChange('patient', U.debounce(function () { if (el.isConnected) { renderTodo(); renderPrep(); } }, 60));
  } };

  /* ---------- 2. Screening questionnaires ---------- */

  AA.steps.screen = { render: function (el, ctx) {
    var core = stepTools('screenCore');
    var list = toolList(stepTools('screen'));
    questionnaireStep(el, ctx, {
      tools: list,
      optional: function (t) { return core.indexOf(t.id) < 0; },
      intro: ui.callout('info', h('p', null, 'Rating scales support the assessment but never make the diagnosis (NICE NG87). A positive screen means "assess carefully". A negative screen does not rule ADHD out, especially in people who mask or have little insight.'), 'Scales support, the interview decides'),
      groups: [{ title: 'Questionnaires', hint: 'Ideally completed before the appointment. Go through the answers with the patient and ask for an example of any high score.', filter: function () { return true; } }]
    });
  } };

  /* ---------- 3. Safety and risk ---------- */

  var LEVELS = [
    { id: 'urgent', badge: 'Urgent', kind: 'err', title: 'Act today' },
    { id: 'high', badge: 'High', kind: 'warn', title: 'Act and plan' },
    { id: 'note', badge: 'Note', kind: 'info', title: 'Note for the plan' }
  ];
  function levelOf(it) { return it.level === 'urgent' || it.level === 'high' ? it.level : 'note'; }

  AA.steps.risk = { render: function (el, ctx) {
    var R = AA.data.risk || {};
    var items = R.items || [];
    var cssrs = AA.byId('tools', 'cssrs');

    el.appendChild(ui.callout('warn', h('p', null, 'Ask about safety early, and again if anything changes. If there is immediate risk, pause the ADHD assessment and follow your local crisis pathway.'), 'Safety first'));

    el.appendChild(h('section', { class: 'card as-card' },
      h('h2', null, 'Ask about safety'),
      R.intro ? h('p', null, R.intro) : null,
      R.ask && R.ask.length ? h('ol', { class: 'list as-asklist' }, R.ask.map(function (q) { return h('li', null, q); }))
        : h('p', { class: 'muted' }, 'Risk prompts are not available in this build. Use your local risk assessment.')));

    /* Findings, grouped by level. Ticks are stored as risk.<itemId> = true. */
    var alerts = h('div', { class: 'as-alerts' });
    var findings = h('section', { class: 'card as-card' }, h('h2', null, 'What did you find?'),
      h('p', { class: 'hint' }, 'Tick anything the patient describes. Actions appear below as you tick.'));
    LEVELS.forEach(function (lv) {
      var its = items.filter(function (it) { return levelOf(it) === lv.id; });
      if (!its.length) return;
      findings.appendChild(h('div', { class: 'as-level' },
        h('h3', null, ui.badge(lv.badge, lv.kind), h('span', null, lv.title)),
        its.map(function (it) {
          return ui.check({ label: it.text || it.short || it.id, checked: !!ctx.get('risk.' + it.id), cls: 'as-rcheck',
            onChange: function (v) { ctx.set('risk.' + it.id, v ? true : undefined); renderAlerts(); } });
        })));
    });
    if (!items.length) findings.appendChild(h('p', { class: 'muted' }, 'No risk items available. Record what you found in the notes.'));
    findings.appendChild(alerts);
    el.appendChild(findings);

    /* C-SSRS screen, when the tools library has it. */
    if (cssrs) {
      var cs = h('section', { class: 'card as-card' }, h('h2', null, cssrs.name || cssrs.abbr || 'C-SSRS'), aboutTool(cssrs));
      if (hasItems(cssrs)) {
        cs.appendChild(AA.components.questionnaire(cssrs, {
          answers: ctx.get('tools.cssrs.answers', {}) || {},
          onAnswer: function (n, v) { ctx.set('tools.cssrs.answers.' + n, v === null ? undefined : v); renderAlerts(); }
        }));
      } else {
        cs.appendChild(ui.callout('info', h('p', null, 'Not reproduced here. Use the official form and record the result in the notes.')));
      }
      cs.appendChild(h('div', { class: 'row as-foot' }, ui.btn({ label: 'Scoring guide in the tools library', kind: 'quiet', small: true, go: 'tool-cssrs' })));
      el.appendChild(cs);
    }

    /* Notes and plan */
    var actionHint = h('p', { class: 'as-warnmsg', 'aria-live': 'polite' });
    el.appendChild(h('section', { class: 'card as-card' },
      h('h2', null, 'Notes and plan'),
      h('div', { class: 'stack' },
        ui.field('What the patient said', ui.input({ rows: 3, value: ctx.get('risk.notes', ''), placeholder: 'Their words, protective factors, supports, access to means.',
          onSave: function (v) { ctx.set('risk.notes', v.trim() ? v : undefined); } })),
        ui.field('Action taken or safety plan', ui.input({ rows: 3, value: ctx.get('risk.action', ''), placeholder: 'Who you told, what was agreed, crisis contacts given, follow-up.',
          onSave: function (v) { ctx.set('risk.action', v.trim() ? v : undefined); } })))));

    el.appendChild(h('section', { class: 'as-sec' },
      h('h2', null, 'Confirm'),
      h('div', { class: 'as-confirm' },
        ui.check({ label: 'Safety reviewed: no immediate risk, or risk plan in place', hint: 'This completes the step. You can come back and change it at any time.',
          checked: !!ctx.get('risk.reviewed'), onChange: function (v) { ctx.set('risk.reviewed', v); } }),
        actionHint)));

    function serious() {
      var r = ctx.get('risk', {}) || {};
      return items.filter(function (it) { return r[it.id] && levelOf(it) !== 'note'; });
    }
    function cssrsResult() {
      if (!hasItems(cssrs)) return null;
      try { var ans = ctx.get('tools.cssrs.answers', {}) || {}; return Object.keys(ans).length ? AA.scoring.score(cssrs, ans) : null; } catch (e) { return null; }
    }
    /* Urgent flags from other questionnaires (for example a depression scale item on self-harm). */
    function toolFlags() {
      var out = [];
      Object.keys(ctx.get('tools', {}) || {}).forEach(function (id) {
        if (id === 'cssrs') return;
        var t = AA.byId('tools', id);
        var r = hasItems(t) ? resultFor(ctx, t) : null;
        urgentFlags(r).forEach(function (f) { out.push({ key: id + ':' + f.item, label: (t.abbr || id) + (f.item !== undefined ? ' item ' + f.item : ''), text: f.text }); });
      });
      return out;
    }

    var sig = null;
    function renderAlerts() {
      var r = ctx.get('risk', {}) || {};
      var hi = serious();
      var notes = items.filter(function (it) { return r[it.id] && levelOf(it) === 'note'; });
      var cr = cssrsResult();
      var crHit = cr && cr.answered && cr.sev !== null && cr.sev !== undefined && cr.sev >= 2;
      var tf = toolFlags();
      var next = hi.map(function (x) { return x.id; }).join(',') + '|' + notes.map(function (x) { return x.id; }).join(',') + '|' + (crHit ? cr.band : '') + '|' + tf.map(function (x) { return x.key; }).join(',');
      if (next !== sig) {
        sig = next;
        U.clear(alerts);
        if (hi.length || crHit || tf.length) {
          var lines = hi.map(function (it) {
            return h('li', null, h('strong', null, (it.short || it.text) + ': '), it.action || 'Act on this today and record what you did.');
          });
          if (crHit) lines.push(h('li', null, h('strong', null, (cssrs.abbr || 'C-SSRS') + ': ' + (cr.band || 'risk endorsed') + '. '), cr.action || 'Follow your local suicide risk pathway.'));
          tf.forEach(function (f) { lines.push(h('li', null, h('strong', null, f.label + ': '), f.text)); });
          alerts.appendChild(ui.callout('err', h('div', null,
            h('ul', { class: 'list' }, lines),
            R.actions && R.actions.length ? h('div', null, h('p', { class: 'as-strong' }, 'In every case'), ui.list(R.actions)) : null), 'Act on these before you continue'));
        }
        if (notes.length) {
          alerts.appendChild(ui.callout('info', h('ul', { class: 'list' }, notes.map(function (it) {
            return h('li', null, h('strong', null, (it.short || it.text) + ': '), it.action || 'Include in the plan.');
          })), 'For the plan'));
        }
      }
      var needAction = (hi.length || crHit) && !String(ctx.get('risk.action', '') || '').trim();
      actionHint.textContent = needAction ? 'Risk items are ticked: record the action taken or the safety plan above.' : '';
    }
    renderAlerts();
    ctx.onChange('risk', U.debounce(function () { if (el.isConnected) renderAlerts(); }, 80));
  } };

  /* ---------- 4. Clinical history ---------- */

  var FLAG_TAG = { adhd: ['Supports ADHD', 'accent'], ddx: ['Consider differential', 'warn'], risk: ['Risk', 'err'], treat: ['Relevant to treatment', 'info'] };

  function condName(id) { var c = AA.byId('ddx', id); return c ? c.name : id; }
  function condLink(id, text) {
    if (!AA.byId('ddx', id)) return h('span', null, text || id);
    return h('a', { href: '#cond-' + id, 'data-go': 'cond-' + id }, text || condName(id));
  }
  function flagTags(it) {
    var tags = [];
    var f = FLAG_TAG[it.flag];
    if (f && it.flag !== 'ddx') tags.push(ui.badge(f[0], f[1]));
    if (it.flag === 'ddx' || it.ddx) {
      var b = ui.badge(it.ddx ? 'Consider: ' + condName(it.ddx) : f ? f[0] : 'Consider differential', 'warn');
      tags.push(it.ddx && AA.byId('ddx', it.ddx)
        ? h('a', { class: 'as-taglink', href: '#cond-' + it.ddx, 'data-go': 'cond-' + it.ddx, title: 'Open the differential: ' + condName(it.ddx) }, b)
        : b);
    }
    return tags.length ? h('span', { class: 'as-tags' }, tags) : null;
  }

  AA.steps.history = { render: function (el, ctx) {
    var secs = AA.data.history || [];
    if (!secs.length) {
      el.appendChild(ui.empty('History prompts are not available', 'Take the history as usual and record it in your notes.'));
      return;
    }

    var live = h('p', { class: 'as-live', 'aria-live': 'polite' });
    var flagHost = h('div');
    el.appendChild(h('section', { class: 'card as-card as-flags' }, h('h2', null, 'Flags from the history'), live, flagHost));

    var metas = {};
    var rec0 = ctx.get('history', {}) || {};
    var firstOpen = null;
    secs.forEach(function (s) { if (!firstOpen && !covered(rec0[s.id])) firstOpen = s.id; });

    var list = h('section', { class: 'as-sec' }, h('h2', null, 'History by area'),
      h('p', { class: 'hint' }, 'Open each area, ask the prompts that fit, and tick what applies. If there is nothing of note, tick "Nothing relevant".'));
    secs.forEach(function (s) {
      var r = rec0[s.id] || {};
      var checks = r.checks || {};
      var meta = h('span', { class: 'as-meta' });
      metas[s.id] = meta;
      var body = h('div', { class: 'as-dbody' },
        s.why ? h('p', { class: 'muted' }, s.why) : null,
        s.prompts && s.prompts.length ? [h('h3', { class: 'as-subh' }, 'Ask'), h('ul', { class: 'list as-prompts' }, s.prompts.map(function (q) { return h('li', null, q); }))] : null,
        s.items && s.items.length ? [h('h3', { class: 'as-subh' }, 'Tick what applies'), h('div', { class: 'as-items' }, s.items.map(function (it) {
          var row = ui.check({ label: it.t, hint: it.note || null, checked: !!checks[it.id], cls: 'as-item',
            onChange: function (v) { ctx.set('history.' + s.id + '.checks.' + it.id, v ? true : undefined); } });
          var tags = flagTags(it);
          if (tags) row.appendChild(tags);
          return row;
        }))] : null,
        h('div', { class: 'as-none' }, ui.check({ label: 'Nothing relevant in this area', checked: !!r.none,
          onChange: function (v) { ctx.set('history.' + s.id + '.none', v ? true : undefined); } })),
        ui.field('Notes: ' + s.title, ui.input({ rows: 3, value: r.notes || '', placeholder: 'Details, dates and the patient\'s own words.',
          onSave: function (v) { ctx.set('history.' + s.id + '.notes', v.trim() ? v : undefined); } })));
      var d = ui.details(s.title, body, { open: s.id === firstOpen, meta: meta, cls: 'as-hsec' });
      d.id = 'as-h-' + s.id;
      list.appendChild(d);
    });
    el.appendChild(list);

    /* Mental state observations (NICE NG87 1.3.1). Stored with the history as history.mse.notes. */
    el.appendChild(h('section', { class: 'card as-card as-mse' },
      h('h2', null, 'Mental state observations'),
      h('p', { class: 'hint' }, 'Observe throughout the interview. Note anything that points away from ADHD or needs action today, such as low mood, elation, psychotic features or intoxication.'),
      h('ul', { class: 'chip-list as-mse-areas', 'aria-label': 'Areas to cover' },
        ['Appearance and behaviour', 'Restlessness and distractibility', 'Speech', 'Mood and affect', 'Thought form and content', 'Perception', 'Cognition', 'Insight'].map(function (x) { return h('li', { class: 'chip' }, x); })),
      ui.field('What you observed', ui.input({ rows: 4, value: ctx.get('history.mse.notes', ''), placeholder: 'For example: casually dressed, fidgeting throughout, speech normal rate, mood "fed up", reactive affect, no psychotic features, good insight.',
        onSave: function (v) { ctx.set('history.mse.notes', v.trim() ? v : undefined); } }))));

    function covered(r) {
      return !!(r && ((r.checks && Object.keys(r.checks).some(function (k) { return r.checks[k]; })) || r.notes || r.none));
    }

    function update() {
      var rec = ctx.get('history', {}) || {};
      var byDdx = {}, order = [], treat = [], risk = [], adhd = 0, ticked = 0, done = 0;
      secs.forEach(function (s) {
        var r = rec[s.id] || {};
        var c = r.checks || {};
        var n = 0;
        (s.items || []).forEach(function (it) {
          if (!c[it.id]) return;
          n++; ticked++;
          if (it.ddx) {
            if (!byDdx[it.ddx]) { byDdx[it.ddx] = []; order.push(it.ddx); }
            byDdx[it.ddx].push(it.t);
          }
          if (it.flag === 'treat') treat.push([it.t, s.title]);
          if (it.flag === 'risk') risk.push([it.t, s.title]);
          if (it.flag === 'adhd') adhd++;
        });
        if (covered(r)) done++;
        var m = metas[s.id];
        U.clear(m);
        if (n) m.appendChild(ui.badge(n + ' ticked', 'accent'));
        if (r.notes) m.appendChild(ui.badge('Notes', 'info'));
        if (r.none) m.appendChild(ui.badge('Nothing relevant', 'neutral'));
        if (!covered(r)) m.appendChild(h('span', null, 'Not covered yet'));
      });
      live.textContent = done + ' of ' + secs.length + ' areas covered. ' + U.plural(ticked, 'item') + ' ticked' + (adhd ? ', ' + adhd + ' supporting ADHD' : '') + '.';

      U.clear(flagHost);
      if (!order.length && !treat.length && !risk.length) {
        flagHost.appendChild(h('p', { class: 'muted' }, 'Nothing flagged yet. Items that point to a differential, to risk or to treatment choices will collect here.'));
        return;
      }
      if (order.length) {
        flagHost.appendChild(h('h3', null, 'Consider in the differential'));
        flagHost.appendChild(h('ul', { class: 'as-flaglist' }, order.map(function (id) {
          return h('li', null, h('span', { class: 'as-fl-name' }, condLink(id)), h('span', { class: 'as-fl-items' }, byDdx[id].join('; ')));
        })));
        flagHost.appendChild(h('div', { class: 'row' }, ui.btn({ label: 'Review in differentials', kind: 'ghost', small: true, onClick: function () { ctx.go('ddx'); } })));
      }
      if (risk.length) {
        flagHost.appendChild(h('h3', null, 'Risk'));
        flagHost.appendChild(h('ul', { class: 'as-flaglist' }, risk.map(function (x) { return h('li', null, h('span', { class: 'as-fl-name' }, x[0]), h('span', { class: 'as-fl-items' }, x[1])); })));
        flagHost.appendChild(h('div', { class: 'row' }, ui.btn({ label: 'Go to safety and risk', kind: 'ghost', small: true, onClick: function () { ctx.go('risk'); } })));
      }
      if (treat.length) {
        flagHost.appendChild(h('h3', null, 'Relevant to treatment'));
        flagHost.appendChild(h('ul', { class: 'as-flaglist' }, treat.map(function (x) { return h('li', null, h('span', { class: 'as-fl-name' }, x[0]), h('span', { class: 'as-fl-items' }, x[1])); })));
      }
    }
    update();
    ctx.onChange('history', U.debounce(function () { if (el.isConnected) update(); }, 80));
  } };

  /* ---------- 5. Co-occurring conditions screen ---------- */

  AA.steps.comorbid = { render: function (el, ctx) {
    var listed = stepTools('comorbid');
    var core = stepTools('comorbidCore');
    var skip = stepTools('screen').concat(['cssrs']);
    var ids = core.concat(listed.filter(function (id) { return core.indexOf(id) < 0; }));
    (AA.data.tools || []).forEach(function (t) {
      if (ids.indexOf(t.id) < 0 && skip.indexOf(t.id) < 0 && hasItems(t) && (t.stage || []).indexOf('comorbid') > -1) ids.push(t.id);
    });
    var list = toolList(ids);
    function optional(t) { return core.indexOf(t.id) < 0; }

    questionnaireStep(el, ctx, {
      tools: list,
      optional: optional,
      points: true,
      intro: ui.callout('info', h('div', null,
        h('p', null, 'These brief scales look for conditions that often co-occur with ADHD or can mimic it. A positive screen is a prompt to explore in the interview and the differential step. It is not a diagnosis.'),
        h('p', null, 'Most scales describe the last two weeks or the current state. Low mood, anxiety or poor sleep on the day can raise scores.')), 'Screen widely, then ask'),
      groups: [
        { title: 'Core screens', hint: 'Complete these for everyone.', filter: function (t) { return !optional(t); } },
        { title: 'Optional screens', hint: 'Use these when the history or the interview points to them.', filter: optional }
      ],
      /* Inside each tool: which differentials it informs, and a prompt when it is positive. */
      extra: function (t) {
        var conds = condsFor(t.id);
        var host = h('div', { class: 'as-pointsbox' });
        return { el: host, update: function (r) {
          U.clear(host);
          if (!conds.length) return;
          host.appendChild(h('p', { class: 'as-strong' }, 'Informs these differentials'));
          host.appendChild(condLinks(conds));
          if (isPositive(r)) {
            host.appendChild(ui.callout('warn', h('div', null,
              h('p', null, 'Positive screen. Explore it in the interview, then weigh it in the differential step.'),
              ui.btn({ label: 'Review in differentials', kind: 'ghost', small: true, onClick: function () { ctx.go('ddx'); } }))));
          }
        } };
      }
    });
  } };
})(window.AA);
