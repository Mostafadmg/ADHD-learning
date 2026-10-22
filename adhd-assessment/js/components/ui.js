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
})(window.AA);
