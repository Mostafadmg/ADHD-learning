/* Reusable UI building blocks. Each returns a DOM element; none of them touch the store.
   Use these (and the CSS classes in css/app.css) instead of inventing new widgets. */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h;
  var ui = AA.ui = {};
  var seq = 0;
  function nid(p) { seq += 1; return (p || 'f') + '_' + seq; }
  ui.nid = nid;

  /* Page heading. o: {eyebrow, title, lead, actions:[nodes]} */
  ui.pageHead = function (o) {
    return h('header', { class: 'page-head' },
      h('div', { class: 'page-head-text' },
        o.eyebrow ? h('p', { class: 'eyebrow' }, o.eyebrow) : null,
        h('h1', null, o.title),
        o.lead ? (typeof o.lead === 'string' ? h('p', { class: 'lead' }, o.lead) : o.lead) : null),
      o.actions && o.actions.length ? h('div', { class: 'page-actions' }, o.actions) : null);
  };

  /* Button. o: {label, kind:'primary'|'ghost'|'danger'|'quiet', onClick, icon, go:'route', small, title} */
  ui.btn = function (o) {
    return h('button', {
      type: 'button', class: 'btn btn-' + (o.kind || 'secondary') + (o.small ? ' btn-sm' : '') + (o.cls ? ' ' + o.cls : ''),
      onclick: o.onClick, 'data-go': o.go, title: o.title, 'aria-label': o.aria, disabled: o.disabled
    }, o.icon ? h('span', { class: 'ico', 'aria-hidden': 'true' }, o.icon) : null, o.label);
  };

  /* Badge. kind: 'ok' | 'warn' | 'err' | 'info' | 'neutral' | 'accent' */
  ui.badge = function (text, kind, title) { return h('span', { class: 'badge badge-' + (kind || 'neutral'), title: title }, text); };

  /* Criterion status pill: met | not-met | pending | partial */
  ui.statusPill = function (s) {
    var map = { met: ['Met', 'ok'], 'not-met': ['Not met', 'err'], pending: ['Pending', 'neutral'], partial: ['Partly met', 'warn'] };
    var m = map[s] || map.pending;
    return h('span', { class: 'pill pill-' + m[1] }, h('span', { class: 'pill-dot', 'aria-hidden': 'true' }), m[0]);
  };

  /* Severity chip from a 0-3 sev value (as returned by scoring). */
  ui.sevChip = function (sev, text) {
    var k = sev === null || sev === undefined ? 'neutral' : sev >= 3 ? 'err' : sev === 2 ? 'warn' : sev === 1 ? 'info' : 'ok';
    return ui.badge(text, k);
  };

  ui.callout = function (kind, content, title) {
    return h('div', { class: 'callout callout-' + (kind || 'info'), role: kind === 'err' ? 'alert' : null },
      title ? h('p', { class: 'callout-title' }, title) : null,
      typeof content === 'string' ? h('div', { html: content }) : content);
  };

  /* Trusted, authored HTML from data files (never user input). */
  ui.html = function (str, tag) { return h(tag || 'div', { class: 'prose', html: str || '' }); };

  ui.list = function (items, cls) {
    return h('ul', { class: cls || 'list' }, (items || []).map(function (t) { return h('li', null, t); }));
  };

  /* <details> disclosure. */
  ui.details = function (summary, content, o) {
    o = o || {};
    var d = h('details', { class: 'disclosure' + (o.cls ? ' ' + o.cls : ''), open: !!o.open },
      h('summary', null, h('span', { class: 'disclosure-title' }, summary), o.meta ? h('span', { class: 'disclosure-meta' }, o.meta) : null),
      h('div', { class: 'disclosure-body' }, content));
    if (o.onToggle) d.addEventListener('toggle', function () { o.onToggle(d.open); });
    return d;
  };

  /* Segmented control built from real radio inputs (keyboard and screen-reader friendly).
     o: {label, options:[{v, l, kind}], value, onChange(v), name, small, hideLabel} */
  ui.seg = function (o) {
    var name = o.name || nid('seg');
    var wrap = h('div', { class: 'seg' + (o.small ? ' seg-sm' : ''), role: 'radiogroup', 'aria-label': o.label });
    o.options.forEach(function (opt) {
      var id = nid('r');
      var input = h('input', { type: 'radio', id: id, name: name, value: String(opt.v), checked: o.value === opt.v });
      input.addEventListener('change', function () { if (input.checked) o.onChange(opt.v); });
      /* Clicking the selected option again clears it. */
      input.addEventListener('click', function () {
        if (wrap.getAttribute('data-was') === String(opt.v)) { input.checked = false; wrap.removeAttribute('data-was'); o.onChange(null); }
        else wrap.setAttribute('data-was', String(opt.v));
      });
      wrap.appendChild(h('span', { class: 'seg-opt' + (opt.kind ? ' seg-' + opt.kind : '') }, input, h('label', { for: id, title: opt.title }, opt.l)));
    });
    if (o.value !== null && o.value !== undefined) wrap.setAttribute('data-was', String(o.value));
    if (o.hideLabel || !o.label) return wrap;
    return h('div', { class: 'seg-field' }, h('span', { class: 'seg-label' }, o.label), wrap);
  };

  /* Checkbox row. o: {label, checked, onChange(bool), hint} */
  ui.check = function (o) {
    var id = nid('c');
    var input = h('input', { type: 'checkbox', id: id, checked: !!o.checked });
    input.addEventListener('change', function () { o.onChange(input.checked); });
    return h('div', { class: 'check' + (o.cls ? ' ' + o.cls : '') }, input,
      h('label', { for: id }, o.label, o.hint ? h('span', { class: 'check-hint' }, o.hint) : null));
  };

  /* Labelled field. control is an element; hint optional. */
  ui.field = function (label, control, hint) {
    if (!control.id) control.id = nid('i');
    return h('div', { class: 'field' }, h('label', { for: control.id }, label), control, hint ? h('p', { class: 'hint' }, hint) : null);
  };

  /* Text input / textarea that saves while typing (debounced). o: {value, onSave(v), placeholder, rows, type} */
  ui.input = function (o) {
    var el = o.rows ? h('textarea', { rows: o.rows, placeholder: o.placeholder, id: o.id }) : h('input', { type: o.type || 'text', placeholder: o.placeholder, id: o.id, inputmode: o.inputmode, min: o.min, max: o.max, autocomplete: 'off' });
    el.value = o.value == null ? '' : o.value;
    var save = U.debounce(function () { o.onSave(el.value); }, 350);
    el.addEventListener('input', save);
    el.addEventListener('blur', function () { save.flush(); });
    return el;
  };

  /* Search box. onInput(text) fires as the user types (debounced 150 ms). */
  ui.search = function (placeholder, onInput, value) {
    var el = h('input', { type: 'search', class: 'search', placeholder: placeholder, 'aria-label': placeholder });
    el.value = value || '';
    var fire = U.debounce(function () { onInput(el.value.trim()); }, 150);
    el.addEventListener('input', fire);
    return el;
  };

  /* Thin progress bar. */
  ui.progress = function (done, of, label) {
    var pct = of ? Math.round(100 * done / of) : 0;
    return h('div', { class: 'meter', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct), 'aria-label': label || 'Progress' },
      h('span', { style: { width: pct + '%' } }));
  };

  /* Tabs. tabs: [{id, label, render: function () { return node; }}]; active id; onChange(id) optional. */
  ui.tabs = function (tabs, active, onChange) {
    var cur = active || (tabs[0] && tabs[0].id);
    var bar = h('div', { class: 'tabs', role: 'tablist' });
    var panel = h('div', { class: 'tab-panel', role: 'tabpanel' });
    var btns = {};
    function show(id) {
      cur = id;
      Object.keys(btns).forEach(function (k) { btns[k].setAttribute('aria-selected', k === id ? 'true' : 'false'); btns[k].tabIndex = k === id ? 0 : -1; });
      U.clear(panel);
      var t = tabs.filter(function (x) { return x.id === id; })[0];
      if (t) U.append(panel, t.render());
      if (onChange) onChange(id);
    }
    tabs.forEach(function (t, i) {
      var b = h('button', { type: 'button', role: 'tab', class: 'tab', id: nid('tab') }, t.label, t.count !== undefined ? h('span', { class: 'tab-count' }, t.count) : null);
      b.addEventListener('click', function () { show(t.id); });
      b.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        var n = tabs[(i + dir + tabs.length) % tabs.length];
        show(n.id); btns[n.id].focus();
      });
      btns[t.id] = b; bar.appendChild(b);
    });
    var wrap = h('div', { class: 'tabs-wrap' }, bar, panel);
    show(cur);
    wrap.show = show;
    /* Update the count badge of a tab without re-rendering. */
    wrap.setCount = function (id, n) {
      var b = btns[id];
      if (!b) return;
      var c = b.querySelector('.tab-count');
      if (!c) { c = h('span', { class: 'tab-count' }); b.appendChild(c); }
      c.textContent = String(n);
    };
    return wrap;
  };

  /* Empty state. */
  ui.empty = function (title, body, action) {
    return h('div', { class: 'empty' }, h('p', { class: 'empty-title' }, title), body ? h('p', null, body) : null, action || null);
  };

  /* Key/value grid. rows: [[label, value], ...] */
  ui.kv = function (rows) {
    return h('dl', { class: 'kv' }, rows.map(function (r) { return [h('dt', null, r[0]), h('dd', null, r[1])]; }));
  };

  /* Simple table. head: [..], rows: [[..], ..] (cells may be nodes). Wrapped for horizontal scroll. */
  ui.table = function (head, rows, cls) {
    return h('div', { class: 'table-wrap' }, h('table', { class: 'table' + (cls ? ' ' + cls : '') },
      head ? h('thead', null, h('tr', null, head.map(function (c) { return h('th', { scope: 'col' }, c); }))) : null,
      h('tbody', null, rows.map(function (r) { return h('tr', null, r.map(function (c, i) { return i === 0 ? h('th', { scope: 'row' }, c) : h('td', null, c); })); }))));
  };

  /* Source line under clinical content. */
  ui.source = function (text) { return h('p', { class: 'source' }, h('span', { class: 'source-k' }, 'Source: '), text); };

  /* ================= Design system building blocks (css/ds.css, DESIGN.md) ================= */
  /* Line icons. ui.icon(name) -> span.ds-ico with an inline SVG; unknown names give an empty span. */
  var ICON = {
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.5v.5"/>', info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.5v.5"/>',
    book: '<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h13"/>', layers: '<path d="M12 3 2.5 8 12 13l9.5-5z"/><path d="M2.5 12.5 12 17.5l9.5-5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>', users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.9.7 3.2 2.4 3.5 5.2"/>',
    file: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h7"/>', compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>', repeat: '<path d="M17 2.5 20.5 6 17 9.5"/><path d="M4 11V9a3 3 0 0 1 3-3h13.5M7 21.5 3.5 18 7 14.5"/><path d="M20 13v2a3 3 0 0 1-3 3H3.5"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>', shield: '<path d="M12 3 4.5 6v6c0 4.4 3.2 7.8 7.5 9 4.3-1.2 7.5-4.6 7.5-9V6z"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z"/>', brain: '<path d="M9 4.5a3 3 0 0 0-3 3v.4A3 3 0 0 0 4.5 13a3 3 0 0 0 1.8 4.7A3 3 0 0 0 12 19V5.6A3 3 0 0 0 9 4.5zM15 4.5a3 3 0 0 1 3 3v.4a3 3 0 0 1 1.5 5.1 3 3 0 0 1-1.8 4.7A3 3 0 0 1 12 19"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".9"/><circle cx="4.5" cy="12" r=".9"/><circle cx="4.5" cy="18" r=".9"/>', link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>', calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    pill: '<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="m8.5 8.5 7 7"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    route: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h7a3 3 0 0 1 0 6H10a3 3 0 0 0 0 6h7"/>', school: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>', scale: '<path d="M12 4v16M5 20h14M4 8h16"/><path d="m4 8-2.5 6a3 3 0 0 0 5 0zM20 8l-2.5 6a3 3 0 0 0 5 0z"/>',
    timeline: '<path d="M4 12h16"/><circle cx="7" cy="12" r="2"/><circle cx="17" cy="12" r="2"/><path d="M12 7v10"/>', moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    drop: '<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z"/>', spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c.8-4 3.8-6.2 7.5-6.2s6.7 2.2 7.5 6.2"/>', logout: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M9.5 16.5 5 12l4.5-4.5M5 12h10.5"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>', steps: '<path d="M4 6h4v4H4zM10 14h4v4h-4zM16 6h4v4h-4z"/><path d="M8 8h8M12 10v4"/>'
  };
  ui.icon = function (name) {
    return h('span', { class: 'ds-ico', 'aria-hidden': 'true', html: ICON[name] ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICON[name] + '</svg>' : '' });
  };
  ui.ICONS = Object.keys(ICON);

  /* Hero card. o: {eyebrow, title, text (string or node), actions: [nodes], aside: node (for example ui.stats)} */
  ui.hero = function (o) {
    return h('section', { class: 'ds-hero' + (o.aside ? '' : ' no-aside'), 'aria-label': o.label || o.title },
      h('div', null,
        o.eyebrow ? h('p', { class: 'ds-hero-k' }, o.eyebrow) : null,
        o.title ? h(o.h1 ? 'h1' : 'h2', { class: 'ds-hero-t' }, o.title) : null,
        o.text ? (typeof o.text === 'string' ? h('p', { class: 'ds-hero-p' }, o.text) : o.text) : null,
        o.actions && o.actions.length ? h('div', { class: 'ds-hero-act' }, o.actions) : null),
      o.aside || null);
  };

  /* Stat tiles. items: [{n: '51.7%', l: 'what it means', s: 'source (small)'}] */
  ui.stats = function (items, o) {
    o = o || {};
    return h('div', { class: 'ds-stats' + (o.cls ? ' ' + o.cls : '') }, (items || []).map(function (x) {
      return h('div', { class: 'ds-stat' }, h('span', { class: 'ds-stat-n' }, String(x.n)), h('span', { class: 'ds-stat-l' }, x.l), x.s ? h('span', { class: 'ds-stat-s' }, x.s) : null);
    }));
  };

  /* Icon cards. items: [{icon: 'name' | n: '1', title, text, meta, tone: 'warn'|'err'|'info', go: 'route', onClick}] ; o: {wide} */
  ui.cards = function (items, o) {
    o = o || {};
    return h('ul', { class: 'ds-cards' + (o.wide ? ' is-2' : '') + (o.cols ? ' cols-' + o.cols : '') }, (items || []).map(function (x) {
      var inner = [
        x.icon || x.n !== undefined ? h('span', { class: 'ds-card-ico', 'aria-hidden': 'true' }, x.icon ? ui.icon(x.icon) : String(x.n)) : null,
        h('span', { class: 'ds-card-t' }, x.title),
        x.text ? h('span', { class: 'ds-card-p' }, x.text) : null,
        x.meta ? h('span', { class: 'ds-card-m' }, x.meta) : null];
      var cls = 'ds-card' + (x.tone ? ' tone-' + x.tone : '');
      var el = x.go ? h('a', { class: cls, href: '#' + x.go, 'data-go': x.go }, inner)
        : x.onClick ? h('button', { type: 'button', class: cls, onclick: x.onClick }, inner)
        : h('div', { class: cls }, inner);
      return h('li', null, el);
    }));
  };

  /* Numbered steps for a short process. items: [{title, text}] or strings. */
  ui.steps = function (items) {
    return h('ol', { class: 'ds-steps' }, (items || []).map(function (x) {
      if (typeof x === 'string') return h('li', null, h('span', { class: 'ds-steps-p' }, x));
      return h('li', null, h('span', { class: 'ds-steps-t' }, x.title), x.text ? h('span', { class: 'ds-steps-p' }, x.text) : null);
    }));
  };

  /* One-at-a-time stepper for long sets. items: [{title, sub, label (short pip text), done: fn|bool, render: fn -> node}]
     o: {start, eyebrow (fn(i) or string), onChange(i), label} -> element with .show(i), .index() and .refresh() */
  ui.stepper = function (items, o) {
    o = o || {};
    var cur = Math.max(0, Math.min(items.length - 1, o.start || 0));
    var track = h('nav', { class: 'ds-stepper-track', 'aria-label': o.label || 'Steps' });
    var head = h('div', { class: 'ds-stepper-head' }), body = h('div', { class: 'ds-stepper-body' });
    var count = h('span', { class: 'ds-stepper-n', 'aria-live': 'polite' });
    var prev = h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { show(cur - 1, true); } }, '← Previous');
    var next = h('button', { type: 'button', class: 'btn btn-primary', onclick: function () { show(cur + 1, true); } }, 'Next →');
    var pips = items.map(function (x, i) {
      return h('button', { type: 'button', class: 'ds-stepper-pip', title: x.title, onclick: function () { show(i, true); } },
        x.label || String(i + 1), h('span', { class: 'sr-only' }, ': ' + x.title));
    });
    U.append(track, pips);
    var root = h('section', { class: 'ds-stepper', 'aria-label': o.label || 'Steps' }, track, head, body, h('div', { class: 'ds-stepper-foot' }, prev, count, next));
    function isDone(x) { return typeof x.done === 'function' ? !!x.done() : !!x.done; }
    function paintPips() {
      pips.forEach(function (b, i) {
        b.classList.toggle('is-done', isDone(items[i]) && i !== cur);
        if (i === cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
    }
    function show(i, user) {
      if (i < 0 || i >= items.length) return;
      cur = i;
      var x = items[i];
      U.clear(head); U.clear(body);
      var k = typeof o.eyebrow === 'function' ? o.eyebrow(i) : o.eyebrow ? o.eyebrow + ' ' + (i + 1) + ' of ' + items.length : 'Step ' + (i + 1) + ' of ' + items.length;
      var title = h('h2', { class: 'ds-stepper-t', tabindex: '-1' }, x.title);
      U.append(head, [h('p', { class: 'ds-stepper-k' }, k), title, x.sub ? h('p', { class: 'ds-stepper-s' }, x.sub) : null]);
      U.append(body, x.render ? x.render() : null);
      prev.disabled = i === 0; next.disabled = i === items.length - 1;
      next.textContent = i === items.length - 1 ? 'Last step' : 'Next: ' + (items[i + 1].label && items[i + 1].label.length > 3 ? items[i + 1].label : 'step ' + (i + 2)) + ' →';
      count.textContent = (i + 1) + ' of ' + items.length;
      paintPips();
      var pip = pips[i];
      if (pip && pip.scrollIntoView && track.scrollWidth > track.clientWidth) { try { track.scrollLeft = pip.offsetLeft - track.clientWidth / 2 + pip.offsetWidth / 2; } catch (e) { /* ignore */ } }
      if (user) {
        if (root.getBoundingClientRect && root.getBoundingClientRect().top < 0 && root.scrollIntoView) root.scrollIntoView({ block: 'start' });
        try { title.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
      }
      if (o.onChange) o.onChange(i);
    }
    root.show = function (i) { show(i, false); };
    root.index = function () { return cur; };
    root.refresh = paintPips;
    show(cur, false);
    return root;
  };

  /* Grouped accordion in one card. items: [{title, meta, n, render: fn -> node, open}] ; o: {title, actions} */
  ui.acc = function (items, o) {
    o = o || {};
    var wrap = h('div', { class: 'ds-acc' });
    if (o.title) wrap.appendChild(h('div', { class: 'ds-acc-head' }, h('h3', null, o.title), o.actions || null));
    (items || []).forEach(function (x) {
      var body = h('div', { class: 'disclosure-body' });
      var built = false;
      var d = h('details', { class: 'disclosure', open: !!x.open },
        h('summary', null, x.n !== undefined ? h('span', { class: 'ds-acc-n', 'aria-hidden': 'true' }, String(x.n)) : null,
          h('span', { class: 'disclosure-title' }, x.title), x.meta ? h('span', { class: 'disclosure-meta' }, x.meta) : null), body);
      function fill() { if (built) return; built = true; U.append(body, x.render ? x.render() : x.content || null); }
      d.addEventListener('toggle', function () { if (d.open) fill(); });
      if (x.open) fill();
      wrap.appendChild(d);
    });
    return wrap;
  };

  /* Section with a heading and a one-line purpose. o: {id, title, text, actions} */
  ui.section = function (o, content) {
    return h('section', { class: 'ds-section' + (o.cls ? ' ' + o.cls : ''), id: o.id || null, 'aria-labelledby': o.id ? o.id + '-h' : null },
      h('div', { class: 'ds-section-head' }, h('h2', { id: o.id ? o.id + '-h' : null }, o.title), o.actions || null, o.text ? h('p', { class: 'ds-section-p' }, o.text) : null),
      content);
  };

  /* On-page contents for long pages. sections: [{id, label}] ; highlights the section in view. */
  ui.toc = function (sections, o) {
    o = o || {};
    var links = sections.map(function (s) {
      return h('li', null, h('a', { href: '#' + s.id, onclick: function (e) {
        e.preventDefault();
        var t = document.getElementById(s.id);
        if (t && t.scrollIntoView) t.scrollIntoView({ block: 'start', behavior: 'smooth' });
      } }, s.label));
    });
    var nav = h('nav', { class: 'ds-toc', 'aria-label': o.label || 'On this page' }, h('p', { class: 'ds-toc-k' }, o.label || 'On this page'), h('ol', null, links));
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = en.target.id;
          U.$$('a', nav).forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + id ? 'true' : 'false'); });
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      setTimeout(function () { sections.forEach(function (s) { var t = document.getElementById(s.id); if (t) obs.observe(t); }); }, 0);
      nav.disconnect = function () { obs.disconnect(); };
    }
    return nav;
  };

  /* Content with a side column. aside sticks on wide screens and moves above the content on narrow ones. */
  ui.split = function (main, aside, o) {
    o = o || {};
    return h('div', { class: 'ds-split' + (o.left ? ' is-left' : '') }, o.left ? h('aside', { class: 'ds-aside' }, aside) : h('div', { class: 'ds-main' }, main),
      o.left ? h('div', { class: 'ds-main' }, main) : h('aside', { class: 'ds-aside' }, aside));
  };

  /* Chips. items: [{label, n, on, onClick, go}] */
  ui.chips = function (items) {
    return h('ul', { class: 'ds-chips' }, (items || []).map(function (x) {
      var inner = [x.label, x.n !== undefined ? h('span', { class: 'ds-chip-n' }, String(x.n)) : null];
      var el = x.go ? h('a', { class: 'ds-chip', href: '#' + x.go, 'data-go': x.go }, inner)
        : x.onClick ? h('button', { type: 'button', class: 'ds-chip' + (x.on ? ' is-on' : ''), 'aria-pressed': x.on ? 'true' : 'false', onclick: x.onClick }, inner)
        : h('span', { class: 'ds-chip' }, inner);
      return h('li', null, el);
    }));
  };
})(window.AA);
