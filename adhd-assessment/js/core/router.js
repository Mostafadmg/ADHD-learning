/* Router: a route is a plain token such as "tools", "tool-phq9" or "assess-k3j2ab9x-ia-ia3".
   The part before the first hyphen names the view; the rest are parameters.
   Tokens only use letters, digits, "_" and "-", so they survive hosted previews that strip
   anything fancier from the URL. The router keeps the current route in memory and mirrors it
   to location.hash when it can (back button support). */
(function (AA) {
  'use strict';
  var U = AA.util;
  var routes = {};
  var current = { token: '', name: '', params: [] };
  var cleanup = null;
  var outlet = null;
  var hooks = [];
  var pending = '';   /* route asked for before sign-in (e.g. a deep link from the course); opened after sign-in */

  function parse(token) {
    var t = String(token || '').replace(/^#/, '');
    var parts = t ? t.split('-') : [];
    return { token: t, name: parts[0] || '', params: parts.slice(1) };
  }

  var router = AA.router = {
    /* register('tools', {title:'Tools library', render: function (el, params) { ...; return optionalCleanupFn; }}) */
    register: function (name, def) { routes[name] = def; },
    has: function (name) { return !!routes[name]; },
    current: function () { return current; },
    /* Called after each render with (route). The shell uses it to update the sidebar. */
    onChange: function (fn) { hooks.push(fn); },
    mount: function (el) { outlet = el; },
    go: function (token, opts) {
      var r = parse(token);
      if (!AA.auth.current() && r.name !== 'signin') {
        if (r.name && r.name !== 'home' && routes[r.name]) pending = r.token;
        r = parse('signin');
      }
      if (!routes[r.name]) r = parse('home');
      render(r, opts || {});
      if (r.name !== 'signin') {
        try { if (location.hash.slice(1) !== r.token) location.hash = r.token; } catch (e) { /* sandboxed */ }
      }
    },
    refresh: function () { render(current, { keepScroll: true }); },
    /* Returns (and clears) the route requested before sign-in, or ''. */
    takePending: function () { var t = pending; pending = ''; return t; },
    /* After a successful sign-in: open the page the person came for, otherwise home. */
    afterSignIn: function () { router.go(router.takePending() || 'home'); },
    start: function () {
      window.addEventListener('hashchange', function () {
        var t = location.hash.slice(1);
        if (t && t !== current.token) router.go(t);
      });
      var initial = '';
      try { initial = location.hash.slice(1); } catch (e) { initial = ''; }
      router.go(initial || 'home');
    }
  };

  function render(r, opts) {
    if (!outlet) outlet = U.$('#view');
    var y = window.scrollY;
    if (typeof cleanup === 'function') { try { cleanup(); } catch (e) { /* ignore */ } }
    cleanup = null;
    current = r;
    U.clear(outlet);
    var def = routes[r.name];
    try {
      cleanup = def.render(outlet, r.params) || null;
    } catch (e) {
      if (window.console) console.error(e);
      U.append(outlet, U.h('div', { class: 'callout callout-err' },
        U.h('strong', null, 'This page failed to load. '), 'Try another section, or reload the app. Details: ' + (e && e.message)));
    }
    document.title = (def.title ? (typeof def.title === 'function' ? def.title(r.params) : def.title) + ' · ' : '') + 'ADHD Assessment';
    hooks.forEach(function (fn) { try { fn(r); } catch (e) { /* ignore */ } });
    if (opts.keepScroll) window.scrollTo(0, y);
    else {
      window.scrollTo(0, 0);
      if (!opts.noFocus) {
        var hd = outlet.querySelector('h1');
        if (hd) { hd.setAttribute('tabindex', '-1'); try { hd.focus({ preventScroll: true }); } catch (e) { hd.focus(); } }
      }
    }
  }

  /* Delegated navigation: any element with data-go="token" navigates on click. */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-go]') : null;
    if (!el) return;
    e.preventDefault();
    router.go(el.getAttribute('data-go'));
  });
})(window.AA);
