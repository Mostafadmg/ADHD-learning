/* Patient journey screens: the step rail in the sidebar, the patient bar above each step, the sticky step bar
   with "what is still open here", and the case overview (route "journey-<id>").
   All status comes from AA.journey (js/engine/journey.js); this file only draws it.
   Exposes AA.journeyUI = { rail(a, step), refreshRail(), patientBar(a, ctx), stepBar(a, ctx, o), attentionFor(a, stepId) }. */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui, J = AA.journey;
  if (!J) return;
  var UI = AA.journeyUI = {};

  function steps() { return AA.STEP_LIST || []; }
  function meta(id) {
    var s = steps();
    for (var i = 0; i < s.length; i++) if (s[i].id === id) return s[i];
    return { id: id, title: id, short: id, lead: '' };
  }
  function bandLabel(a) { try { var b = AA.diagnosis.bandInfo && AA.diagnosis.bandInfo(a); return (b && b.label) || ''; } catch (e) { return ''; } }
  function ref(a) { return (a && a.patient && a.patient.ref) || 'Untitled patient'; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  function setVar(el, k, v) { el.style.setProperty(k, v); return el; }

  /* A step the clinician has moved past without finishing, that has to be finished: the one thing the
     journey must never let slip by quietly. */
  function missedIds(sm, curId) {
    var cur = J.index(curId), out = {};
    sm.steps.forEach(function (s, i) {
      if (i < cur && s.need && s.state !== 'done' && s.state !== 'na' && !s.blocked) out[s.id] = true;
    });
    return out;
  }
  /* Where to go next: first any needed step that was passed without being finished, otherwise the engine's
     next open step. kind: 'missed' | 'keep' (still on this step) | 'next' | null (all done). */
  function nextAction(sm, curId) {
    var m = missedIds(sm, curId);
    for (var i = 0; i < sm.steps.length; i++) if (m[sm.steps[i].id]) return { id: sm.steps[i].id, kind: 'missed' };
    if (!sm.next) return { id: null, kind: null };
    return { id: sm.next, kind: sm.next === curId ? 'keep' : 'next' };
  }
  function stateText(s) {
    if (s.state === 'done') return 'Done';
    if (s.state === 'na') return 'Not applicable yet';
    if (s.blocked) return 'Waiting: ' + s.blocked.replace(/\.$/, '');
    if (s.state === 'part') return s.done + ' of ' + s.of + ' done';
    return 'Not started';
  }
  function dot(s, n, missed) {
    var g = s.state === 'done' ? '✓' : s.state === 'na' ? '–' : String(n);
    return h('span', { class: 'jn-dot is-' + s.state + (missed ? ' is-missed' : ''), 'aria-hidden': 'true' }, g);
  }
  function flagOf(s) {
    var lv = '';
    s.attention.forEach(function (x) { if (x.level === 'stop') lv = 'stop'; else if (!lv) lv = x.level === 'refer' ? 'refer' : 'warn'; });
    return lv;
  }
  function route(id, step) { return 'assess-' + id + '-' + step; }
  function topAttention(sm) {
    var by = { stop: null, refer: null, warn: null };
    sm.attention.forEach(function (x) { if (by[x.level] === null) by[x.level] = x; });
    return by.stop || by.refer || by.warn;
  }
  function kindWord(level) { return level === 'stop' ? 'Stop' : level === 'refer' ? 'Refer' : 'Check'; }
  function calloutKind(level) { return level === 'stop' ? 'err' : level === 'refer' ? 'info' : 'warn'; }
  /* A step name from a route or record that might be unknown or stale. */
  function knownStep(id, fallback) {
    if (J.index(id) > -1) return id;
    return J.index(fallback) > -1 ? fallback : 'setup';
  }

  /* ---------------- Sidebar rail ---------------- */
  var phaseOpen = {};
  var railCtx = null, lastPhase = null;

  function railNode(a, curStep) {
    var sm = J.summary(a), id = a.id, cur = curStep || a.step || 'setup';
    var miss = missedIds(sm, cur);
    var curPhase = (sm.steps[J.index(cur)] || {}).phase;
    var na = nextAction(sm, cur), nextMeta = na.id ? meta(na.id) : null;
    var wrap = h('div', { class: 'jn-rail' });

    var ring = h('div', { class: 'jn-ring', role: 'img', 'aria-label': sm.pct + ' percent of the steps are complete' }, h('span', null, sm.pct + '%'));
    setVar(ring, '--p', sm.pct + '%');
    var band = bandLabel(a);
    var subBits = [];
    if (a.patient && a.patient.age) subBits.push(a.patient.age + ' y');
    if (band) subBits.push(band);
    if (a.demo) subBits.push('demo');
    wrap.appendChild(h('div', { class: 'jn-case' },
      h('div', { class: 'jn-case-top' }, ring,
        h('div', { class: 'jn-case-t' },
          h('p', { class: 'jn-case-name' }, ref(a)),
          h('p', { class: 'jn-case-sub' }, subBits.length ? subBits.join(' · ') : 'Patient details not entered yet'),
          h('p', { class: 'jn-case-count' }, sm.done + ' of ' + sm.of + ' steps done'))),
      sm.stop ? h('a', { class: 'jn-alert is-stop', href: '#' + route(id, (topAttention(sm) || {}).step || 'risk'), 'data-go': route(id, (topAttention(sm) || {}).step || 'risk') }, 'Safety stop: ' + ((topAttention(sm) || {}).text || 'review now')) : null,
      !sm.stop && sm.attention.length ? h('a', { class: 'jn-alert ' + (sm.refer ? 'is-refer' : 'is-warn'), href: '#journey-' + id, 'data-go': 'journey-' + id }, (sm.refer && sm.attention.length === 1 ? 'Refer: ' + sm.attention[0].text : plural(sm.attention.length, 'thing needs', 'things need') + ' your attention')) : null,
      nextMeta ? h('a', { class: 'jn-next', href: '#' + route(id, nextMeta.id), 'data-go': route(id, nextMeta.id) },
        h('span', { class: 'jn-next-k' }, na.kind === 'missed' ? 'Go back: still needed' : na.kind === 'keep' ? 'Keep going' : 'Next up'), h('span', { class: 'jn-next-t' }, nextMeta.short)) : h('p', { class: 'jn-all' }, 'Every step is complete.'),
      h('a', { class: 'jn-over', href: '#journey-' + id, 'data-go': 'journey-' + id, 'aria-current': railCtx && railCtx.overview ? 'page' : null }, 'Case overview and sign-off')));

    sm.phases.forEach(function (ph) {
      var isCur = ph.id === curPhase;
      var open = phaseOpen[ph.id] !== undefined ? phaseOpen[ph.id] : isCur;
      var listId = 'jn-ph-' + ph.id;
      var list = h('ol', { class: 'jn-steps', id: listId, hidden: open ? null : true });
      var phaseMissed = false;
      ph.steps.forEach(function (s) {
        var n = J.index(s.id) + 1, m = meta(s.id), isHere = s.id === cur && !(railCtx && railCtx.overview);
        var isMiss = !!miss[s.id];
        if (isMiss) phaseMissed = true;
        var fl = flagOf(s);
        var chip = null;
        if (s.state !== 'done' && s.state !== 'na' && !s.blocked && s.gaps.length && (s.state === 'part' || isMiss)) chip = h('span', { class: 'jn-chip' + (isMiss ? ' is-missed' : '') }, String(s.gaps.length));
        list.appendChild(h('li', null, h('a', {
          class: 'jn-step is-' + s.state + (isHere ? ' is-here' : '') + (isMiss ? ' is-missed' : ''), href: '#' + route(id, s.id), 'data-go': route(id, s.id),
          'aria-current': isHere ? 'step' : null,
          title: m.title + ' · ' + stateText(s) + (isMiss ? ' · still needed' : '') + (s.gaps.length && s.state !== 'done' ? ': ' + s.gaps.slice(0, 4).join(', ') : '')
        },
        dot(s, n, isMiss), h('span', { class: 'jn-step-t' }, m.short),
        fl ? h('span', { class: 'jn-flag is-' + fl, title: fl === 'stop' ? 'Safety stop' : fl === 'refer' ? 'Refer' : 'Needs attention', 'aria-hidden': 'true' }, fl === 'stop' ? '!' : null) : null,
        chip,
        h('span', { class: 'sr-only' }, '. ' + stateText(s) + (isMiss ? '. Still needed.' : '') + (chip ? '. ' + plural(s.gaps.length, 'item') + ' open.' : '') + (fl === 'stop' ? ' Safety stop.' : fl ? ' Needs attention.' : '')))));
      });
      wrap.appendChild(h('section', { class: 'jn-ph is-' + ph.state + (isCur ? ' is-cur' : '') },
        h('button', { type: 'button', class: 'jn-ph-h', 'aria-expanded': open ? 'true' : 'false', 'aria-controls': listId, onclick: function (e) {
          var nowOpen = list.hidden;
          list.hidden = !nowOpen;
          phaseOpen[ph.id] = nowOpen;
          e.currentTarget.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
        } },
        h('span', { class: 'jn-ph-chev', 'aria-hidden': 'true' }),
        h('span', { class: 'jn-ph-l' }, ph.label),
        phaseMissed ? h('span', { class: 'jn-ph-miss', title: 'A step you passed is still open' }, 'open') : null,
        h('span', { class: 'jn-ph-n' }, ph.of ? ph.done + '/' + ph.of : '–')),
        list));
    });
    return wrap;
  }

  /* Draws the rail into a host (the sidebar passes its own container) and remembers it for live refresh. */
  UI.rail = function (host, a, curStep, overview) {
    var ph = (J.ORDER[J.index(curStep)] || {}).phase;
    /* Moving into another phase opens it again, even if it was closed by hand earlier. */
    if (ph && ph !== lastPhase) { delete phaseOpen[ph]; lastPhase = ph; }
    railCtx = { host: host, id: a.id, step: curStep, overview: !!overview };
    U.clear(host);
    host.appendChild(railNode(a, curStep));
  };
  UI.refreshRail = function () {
    if (!railCtx || !railCtx.host || !railCtx.host.isConnected) return;
    var a = AA.assess.get(railCtx.id);
    if (!a) return;
    var side = railCtx.host.closest('.sidebar');
    var st = side ? side.scrollTop : 0;
    U.clear(railCtx.host);
    railCtx.host.appendChild(railNode(a, railCtx.step));
    if (side) side.scrollTop = st;
  };

  /* ---------------- Patient bar (above each step) ---------------- */
  UI.patientBar = function (a, ctx) {
    var el = h('div', { class: 'jn-pbar' });
    function paint(cur) {
      var sm = J.summary(cur), top = topAttention(sm);
      var band = bandLabel(cur);
      U.clear(el);
      var meter = h('div', { class: 'jn-pmeter', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(sm.pct), 'aria-label': 'Assessment progress' }, h('span', null));
      meter.firstChild.style.width = sm.pct + '%';
      el.appendChild(h('div', { class: 'jn-pbar-row' },
        h('div', { class: 'jn-pwho' },
          h('strong', null, ref(cur)),
          h('span', { class: 'jn-pmeta' }, [cur.patient && cur.patient.age ? cur.patient.age + ' y' : '', band, cur.demo ? 'demo patient' : ''].filter(Boolean).join(' · ') || 'Add age and details in the first step')),
        h('div', { class: 'jn-pprog' }, h('span', { class: 'jn-ptxt' }, sm.done + ' of ' + sm.of + ' steps · ' + sm.pct + '%'), meter),
        h('a', { class: 'btn btn-ghost btn-sm jn-pover', href: '#journey-' + ctx.id, 'data-go': 'journey-' + ctx.id }, 'Case overview')));
      if (top) {
        var m = meta(top.step);
        el.appendChild(h('a', { class: 'jn-pal is-' + top.level, href: '#' + route(ctx.id, top.step), 'data-go': route(ctx.id, top.step) },
          h('span', { class: 'jn-pal-k' }, kindWord(top.level)),
          h('span', { class: 'jn-pal-t' }, top.text),
          h('span', { class: 'jn-pal-go' }, m.short)));
      }
    }
    paint(a);
    return { el: el, paint: paint };
  };

  /* Callouts for the attention items that belong to this step. Returns {el, paint(a)}; paint rebuilds the
     callouts only when their text changed, so a screen reader is not told the same alert again. */
  UI.attentionFor = function (a, stepId) {
    var el = h('div', { class: 'jn-attn' }), sig = null;
    function paint(cur) {
      var items = J.step(cur, stepId).attention;
      var key = items.map(function (x) { return x.level + ':' + x.text; }).join('|');
      if (key === sig) return;
      sig = key;
      U.clear(el);
      items.forEach(function (x) {
        el.appendChild(ui.callout(calloutKind(x.level), h('p', null, x.text), x.level === 'stop' ? 'Stop and check' : x.level === 'refer' ? 'Refer' : 'Check this'));
      });
      el.hidden = !items.length;
    }
    paint(a);
    return { el: el, paint: paint };
  };

  /* ---------------- Sticky step bar ---------------- */
  /* o: {prev, next (step defs or null), ownPrimary, last: {label, onClick}} */
  UI.stepBar = function (a, ctx, o) {
    var el = h('div', { class: 'jn-sbar' });
    var open = false;
    function goNext(cur) {
      var st = J.step(cur, ctx.step);
      var forward = o.next ? true : false;
      if (forward && st.need && st.state !== 'done' && st.state !== 'na' && !st.blocked && st.gaps.length) {
        U.confirm({
          title: 'Move on with ' + plural(st.gaps.length, 'item') + ' still open?',
          body: h('div', null, h('p', null, 'This step is needed for a safe conclusion. Still open:'), h('ul', { class: 'jn-dlg-list' }, st.gaps.slice(0, 8).map(function (g) { return h('li', null, g); })),
            st.gaps.length > 8 ? h('p', null, 'and ' + (st.gaps.length - 8) + ' more.') : null,
            h('p', null, 'You can come back from the step list at any time.')),
          ok: 'Move on', cancel: 'Stay and finish'
        }).then(function (yes) { if (yes) ctx.go(o.next.id); });
        return;
      }
      if (o.next) ctx.go(o.next.id);
    }
    function paint(cur) {
      var st = J.step(cur, ctx.step);
      /* The bar is rebuilt on every change; keep keyboard focus on the same control. */
      var focusKey = el.contains(document.activeElement) ? document.activeElement.getAttribute('data-k') : null;
      U.clear(el);
      var n = st.gaps.length;
      var statusBtn;
      if (st.state === 'na') statusBtn = h('span', { class: 'jn-sstat is-na' }, 'Not applicable yet');
      else if (st.blocked) statusBtn = h('span', { class: 'jn-sstat is-block' }, st.blocked);
      else if (st.state === 'done') statusBtn = h('span', { class: 'jn-sstat is-done' }, h('span', { class: 'jn-tick', 'aria-hidden': 'true' }, '✓'), 'This step is complete');
      else {
        statusBtn = h('button', { type: 'button', class: 'jn-sstat is-open', 'data-k': 'status', 'aria-expanded': open ? 'true' : 'false', 'aria-controls': 'jn-pop-' + ctx.id, onclick: function () { open = !open; paint(AA.assess.get(ctx.id)); },
          onkeydown: function (e) { if (e.key === 'Escape' && open) { open = false; paint(AA.assess.get(ctx.id)); } } },
          h('span', { class: 'jn-dotn' }, String(n)), n === 1 ? '1 thing left in this step' : n + ' things left in this step', h('span', { class: 'jn-sstat-chev', 'aria-hidden': 'true' }));
      }
      if (open && n && st.state !== 'done') {
        el.appendChild(h('div', { class: 'jn-pop', id: 'jn-pop-' + ctx.id, role: 'region', 'aria-label': 'Still to do in this step' },
          h('p', { class: 'jn-pop-t' }, st.need ? 'Still to do in this step (needed)' : 'Still to do in this step (good practice)'),
          h('ul', null, st.gaps.map(function (g) { return h('li', null, g); }))));
      }
      var nextBtn;
      if (o.next) {
        var primary = !(o.ownPrimary && st.state !== 'done');
        nextBtn = h('button', { type: 'button', class: 'btn ' + (primary ? 'btn-primary' : 'btn-secondary'), 'data-k': 'next', title: 'Next step: ' + o.next.title, onclick: function () { goNext(AA.assess.get(ctx.id)); } }, 'Next: ' + o.next.short + ' →');
      } else {
        nextBtn = h('a', { class: 'btn btn-primary', href: '#journey-' + ctx.id, 'data-go': 'journey-' + ctx.id }, 'Review and finish →');
      }
      el.appendChild(h('div', { class: 'jn-srow' },
        o.prev ? h('button', { type: 'button', class: 'btn btn-ghost', title: 'Previous step: ' + o.prev.title, onclick: function () { ctx.go(o.prev.id); } }, '← ' + o.prev.short) : h('span'),
        statusBtn, nextBtn));
      if (focusKey) { var back = el.querySelector('[data-k="' + focusKey + '"]'); if (back) back.focus(); }
    }
    paint(a);
    return { el: el, paint: paint };
  };

  /* ---------------- Case overview ---------------- */
  AA.router.register('journey', {
    title: function () { return 'Case overview'; },
    render: function (el, params) {
      var id = params[0];
      var a = id ? AA.assess.get(id) : null;
      var me = AA.auth.current();
      if (!a || (me && a.clinicianId !== me.id)) {
        el.appendChild(ui.empty('Assessment not found', 'It may have been deleted, or it belongs to another profile.', ui.btn({ label: 'Go to home', kind: 'primary', go: 'home' })));
        return;
      }
      AA.progress.set('lastAssessment', id);
      return overview(el, a);
    }
  });

  function overview(el, a) {
    var id = a.id;
    var sm = J.summary(a);
    var cur = knownStep(a.step, 'setup');
    var miss = missedIds(sm, cur);
    var na = nextAction(sm, cur), nextMeta = na.id ? meta(na.id) : null;
    var done = a.status === 'complete';

    el.appendChild(h('header', { class: 'page-head' },
      h('div', { class: 'page-head-text' },
        h('p', { class: 'eyebrow' }, 'Case overview' + (a.demo ? ' · demo patient' : '')),
        h('h1', null, ref(a)),
        h('p', { class: 'lead' }, [a.patient && a.patient.age ? a.patient.age + ' years' : '', bandLabel(a)].filter(Boolean).join(' · ') || 'See every step, what is still open and what needs attention first.')),
      h('div', { class: 'page-actions' }, ui.btn({ label: 'Resume ' + meta(cur).short, kind: 'ghost', go: route(id, cur) }))));

    /* Next best action */
    var ring = h('div', { class: 'jn-ring jn-ring-lg', role: 'img', 'aria-label': sm.pct + ' percent complete' }, h('span', null, sm.pct + '%'));
    setVar(ring, '--p', sm.pct + '%');
    var first = nextMeta ? J.step(a, nextMeta.id) : null;
    var hot = topAttention(sm) || {};
    var referHero = !sm.stop && sm.refer && !nextMeta;
    var heroK = sm.stop ? 'Safety first' : referHero ? 'Refer' : na.kind === 'missed' ? 'You skipped a needed step' : sm.deferred ? 'Diagnosis deferred' : nextMeta ? 'Next best step' : 'Everything is complete';
    el.appendChild(h('section', { class: 'jn-hero' + (sm.stop ? ' is-stop' : '') },
      ring,
      h('div', { class: 'jn-hero-t' },
        h('p', { class: 'jn-hero-k' }, heroK),
        h('h2', null, sm.stop ? (hot.text || 'Review the safety flag before going on') : referHero ? (hot.text || 'Refer this child') : nextMeta ? nextMeta.title : 'Every applicable step is complete'),
        h('p', { class: 'jn-hero-s' }, sm.stop ? 'Act on this today under local procedures. The rest of the assessment can wait.'
          : referHero ? 'The safety step and the referral note are done. Send the referral note, then mark the assessment complete.'
          : nextMeta ? (first && first.gaps.length ? 'Still to do here: ' + first.gaps.slice(0, 3).join(', ') + (first.gaps.length > 3 ? ' and ' + (first.gaps.length - 3) + ' more' : '') + '.' : nextMeta.lead)
          : 'Check the sign-off box below, then finish.'),
        h('div', { class: 'row' },
          sm.stop ? ui.btn({ label: 'Go to ' + meta(hot.step || 'risk').short, kind: 'primary', go: route(id, hot.step || 'risk') }) : null,
          !sm.stop && nextMeta ? ui.btn({ label: (na.kind === 'keep' ? 'Continue: ' : na.kind === 'missed' ? 'Go back to: ' : 'Go to: ') + nextMeta.short, kind: 'primary', go: route(id, nextMeta.id) }) : null,
          sm.stop && nextMeta ? ui.btn({ label: 'Next step instead: ' + nextMeta.short, kind: 'ghost', go: route(id, nextMeta.id) }) : null))));

    /* Needs attention */
    if (sm.attention.length) {
      el.appendChild(h('section', { class: 'jn-card' },
        h('h2', { class: 'jn-h' }, 'Needs your attention', h('span', { class: 'jn-count' }, String(sm.attention.length))),
        h('ul', { class: 'jn-alist' }, sm.attention.map(function (x) {
          return h('li', { class: 'is-' + x.level },
            h('span', { class: 'jn-alist-k' }, kindWord(x.level)),
            h('span', { class: 'jn-alist-t' }, x.text),
            ui.btn({ label: meta(x.step).short, kind: 'ghost', small: true, go: route(id, x.step) }));
        }))));
    }

    /* Phases */
    var phasesEl = h('div', { class: 'jn-phases' });
    sm.phases.forEach(function (ph) {
      var rows = h('ol', { class: 'jn-rows' });
      ph.steps.forEach(function (s) {
        var m = meta(s.id), n = J.index(s.id) + 1, isMiss = !!miss[s.id];
        var gapList = s.state !== 'done' && s.state !== 'na' && !s.blocked && s.gaps.length ? h('ul', { class: 'jn-gaps' }, s.gaps.slice(0, 4).map(function (g) { return h('li', null, g); }).concat(s.gaps.length > 4 ? [h('li', { class: 'jn-more' }, 'and ' + (s.gaps.length - 4) + ' more')] : [])) : null;
        rows.appendChild(h('li', { class: 'jn-row is-' + s.state + (isMiss ? ' is-missed' : '') + (s.id === cur ? ' is-here' : '') },
          dot(s, n, isMiss),
          h('div', { class: 'jn-row-b' },
            h('p', { class: 'jn-row-t' }, m.title, s.need ? h('span', { class: 'jn-tag is-need' }, 'Needed') : h('span', { class: 'jn-tag' }, 'Good practice'),
              isMiss ? h('span', { class: 'jn-tag is-miss' }, 'Skipped') : null),
            h('p', { class: 'jn-row-s' }, stateText(s)),
            gapList),
          h('a', { class: 'btn btn-sm ' + (s.state === 'done' ? 'btn-ghost' : 'btn-secondary'), href: '#' + route(id, s.id), 'data-go': route(id, s.id) }, s.state === 'done' ? 'Review' : s.state === 'na' ? 'Look' : 'Open', h('span', { class: 'sr-only' }, ' ' + m.title))));
      });
      phasesEl.appendChild(h('section', { class: 'jn-card jn-phase is-' + ph.state },
        h('h2', { class: 'jn-h' }, ph.label, h('span', { class: 'jn-count' }, ph.of ? ph.done + ' of ' + ph.of : 'not applicable')),
        rows));
    });
    el.appendChild(phasesEl);

    /* Sign-off */
    var needed = sm.neededSteps.map(function (sid) { return meta(sid); });
    var signoff = h('section', { class: 'jn-card jn-sign ' + (done ? 'is-done' : sm.ready ? 'is-ready' : 'is-open') },
      h('h2', { class: 'jn-h' }, 'Sign-off check'),
      done ? h('p', null, 'This assessment is marked complete. Reopen it to keep editing.')
        : sm.ready ? h('p', null, sm.refer ? 'The safety step and the referral note are complete. Mark the assessment complete once the referral is sent.' : 'Every needed step is complete and there is no safety stop. Add the report, then mark the assessment complete.')
        : h('div', null, h('p', null, sm.stop ? 'A safety stop is open. Deal with it before you finish.' : sm.deferred && !needed.length ? 'The diagnosis is deferred, so the assessment is not finished. Come back to the diagnosis step when the missing information is in.' : 'These needed steps are not finished:'),
          needed.length ? h('ul', { class: 'jn-need' }, needed.map(function (m) { return h('li', null, h('a', { href: '#' + route(id, m.id), 'data-go': route(id, m.id) }, m.title)); })) : null),
      sm.openGood ? h('p', { class: 'jn-sign-s' }, plural(sm.openGood, 'good-practice step') + ' still open. They are not required, but they make the record stronger.') : null,
      h('div', { class: 'row' },
        ui.btn({ label: done ? 'Reopen assessment' : 'Mark assessment complete', kind: done ? 'secondary' : sm.ready ? 'primary' : 'secondary', onClick: function () { toggleComplete(a, sm, done); } }),
        ui.btn({ label: 'Open the report', kind: 'ghost', go: route(id, 'report') })));
    el.appendChild(signoff);
  }

  function toggleComplete(a, sm, wasDone) {
    function apply() {
      AA.assess.set(a.id, 'status', wasDone ? 'active' : 'complete');
      U.toast(wasDone ? 'Assessment reopened' : 'Assessment marked complete', 'ok');
      AA.router.refresh();
      setTimeout(function () { var b = U.$('.jn-sign .btn'); if (b) b.focus(); }, 0);
    }
    if (wasDone || sm.ready) { apply(); return; }
    var names = sm.neededSteps.map(function (sid) { return meta(sid).title; });
    U.confirm({
      title: sm.stop ? 'Finish with a safety stop open?' : sm.deferred && !names.length ? 'Finish with the diagnosis deferred?' : 'Finish with needed steps open?',
      body: h('div', null,
        sm.stop ? h('p', null, 'There is an open safety stop. Marking the assessment complete does not clear it.') : null,
        names.length ? h('p', null, 'Not finished: ' + names.join('; ') + '.') : null,
        h('p', null, 'You can reopen the assessment later.')),
      ok: 'Mark complete anyway', cancel: 'Go back', danger: sm.stop
    }).then(function (yes) { if (yes) apply(); });
  }
})(window.AA);
