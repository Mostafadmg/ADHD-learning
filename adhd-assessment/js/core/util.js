/* Small DOM and utility helpers shared by every view (no framework). */
(function (AA) {
  'use strict';
  var U = AA.util = {};

  /* h('button', {class:'btn', onclick: fn}, 'Save') -> HTMLElement
     attrs: class, style (string|object), html (trusted innerHTML), on<event> handlers,
     value/checked/selected/disabled set as properties, anything else as an attribute.
     children: strings, numbers, nodes, arrays, null/false (skipped). */
  U.h = function (tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (v === null || v === undefined || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === 'value' || k === 'checked' || k === 'selected' || k === 'disabled' || k === 'indeterminate') el[k] = v;
        else el.setAttribute(k, v === true ? '' : String(v));
      }
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  };
  function append(el, c) {
    if (c === null || c === undefined || c === false || c === true) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  U.append = append;

  U.$ = function (sel, root) { return (root || document).querySelector(sel); };
  U.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  U.clear = function (el) { while (el.firstChild) el.removeChild(el.firstChild); return el; };

  U.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* Short random id without hyphens (hyphens separate route parameters). */
  U.uid = function (len) {
    var s = '', a = 'abcdefghijkmnpqrstuvwxyz23456789';
    var n = len || 8, buf = null;
    try { buf = crypto.getRandomValues(new Uint8Array(n)); } catch (e) { buf = null; }
    for (var i = 0; i < n; i++) s += a[(buf ? buf[i] : Math.floor(Math.random() * 256)) % a.length];
    return s;
  };

  U.debounce = function (fn, ms) {
    var t = null;
    var d = function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { t = null; fn.apply(self, args); }, ms);
    };
    d.flush = function () { if (t) { clearTimeout(t); t = null; fn(); } };
    return d;
  };

  U.fmtDate = function (iso, withTime) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return '';
    var opts = { day: 'numeric', month: 'short', year: 'numeric' };
    if (withTime) { opts.hour = '2-digit'; opts.minute = '2-digit'; }
    try { return d.toLocaleString('en-GB', opts); } catch (e) { return d.toISOString().slice(0, 16).replace('T', ' '); }
  };
  U.today = function () { return new Date().toISOString().slice(0, 10); };

  /* Storage that never throws (private windows, blocked storage, sandboxed previews). */
  U.storage = {
    ok: (function () {
      try { var k = '__aa_t'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; } catch (e) { return false; }
    })(),
    get: function (key, fallback) {
      try { var v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
    },
    remove: function (key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } }
  };

  /* SHA-256 hex. Uses SubtleCrypto when available, otherwise a small pure-JS fallback. */
  U.sha256 = function (text) {
    var bytes = new TextEncoder().encode(String(text));
    try {
      if (window.crypto && crypto.subtle && window.isSecureContext !== false) {
        return crypto.subtle.digest('SHA-256', bytes).then(toHex).catch(function () { return sha256js(bytes); });
      }
    } catch (e) { /* fall through */ }
    return Promise.resolve(sha256js(bytes));
  };
  function toHex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function sha256js(bytes) {
    var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var l = bytes.length, withPad = ((l + 9 + 63) >> 6) << 6, m = new Uint8Array(withPad);
    m.set(bytes); m[l] = 0x80;
    var bits = l * 8, dv = new DataView(m.buffer);
    dv.setUint32(withPad - 4, bits >>> 0); dv.setUint32(withPad - 8, Math.floor(bits / 4294967296));
    var w = new Uint32Array(64);
    for (var off = 0; off < withPad; off += 64) {
      for (var i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (i = 16; i < 64; i++) {
        var a0 = w[i - 15], a1 = w[i - 2];
        var s0 = ((a0 >>> 7) | (a0 << 25)) ^ ((a0 >>> 18) | (a0 << 14)) ^ (a0 >>> 3);
        var s1 = ((a1 >>> 17) | (a1 << 15)) ^ ((a1 >>> 19) | (a1 << 13)) ^ (a1 >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g2 = H[6], hh = H[7];
      for (i = 0; i < 64; i++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var ch = (e & f) ^ (~e & g2);
        var t1 = (hh + S1 + ch + K[i] + w[i]) | 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) | 0;
        hh = g2; g2 = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g2) | 0; H[7] = (H[7] + hh) | 0;
    }
    return H.map(function (x) { return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
  }
  U._sha256js = sha256js;

  /* True when the app runs inside a sandboxed frame (for example a hosted preview).
     There, print dialogs and file downloads are blocked, so views offer "Copy" instead. */
  U.isEmbedded = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();

  /* Copy text; resolves true on success. Falls back to selecting a hidden textarea. */
  U.copyText = function (text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacyCopy(text); });
      }
    } catch (e) { /* fall through */ }
    return Promise.resolve(legacyCopy(text));
  };
  function legacyCopy(text) {
    var ta = U.h('textarea', { 'aria-hidden': 'true', style: { position: 'fixed', left: '-9999px', top: '0' } });
    ta.value = text; document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  /* Save a file (only outside sandboxed frames). */
  U.download = function (filename, text, mime) {
    if (U.isEmbedded) return false;
    try {
      var blob = new Blob([text], { type: mime || 'application/json' });
      var a = U.h('a', { href: URL.createObjectURL(blob), download: filename });
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      return true;
    } catch (e) { return false; }
  };

  /* Toast message at the bottom of the screen. kind: 'ok' | 'warn' | 'err' | undefined */
  U.toast = function (msg, kind) {
    var host = U.$('#toasts');
    if (!host) { host = U.h('div', { id: 'toasts', class: 'toasts', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(host); }
    var t = U.h('div', { class: 'toast' + (kind ? ' toast-' + kind : '') }, msg);
    host.appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, 2600);
    setTimeout(function () { t.remove(); }, 3100);
  };

  /* In-page confirmation dialog (native confirm() is blocked in sandboxed frames).
     U.confirm({title, body, ok:'Delete', danger:true}).then(function (yes) {...}) */
  U.confirm = function (o) {
    return new Promise(function (resolve) {
      var prev = document.activeElement;
      var close = function (v) { wrap.remove(); document.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus(); resolve(v); };
      var onKey = function (e) { if (e.key === 'Escape') close(false); };
      var okBtn = U.h('button', { class: 'btn ' + (o.danger ? 'btn-danger' : 'btn-primary'), onclick: function () { close(true); } }, o.ok || 'Confirm');
      var wrap = U.h('div', { class: 'dialog-backdrop', onclick: function (e) { if (e.target === wrap) close(false); } },
        U.h('div', { class: 'dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'dlg-t' },
          U.h('h2', { id: 'dlg-t' }, o.title || 'Are you sure?'),
          o.body ? (typeof o.body === 'string' ? U.h('p', null, o.body) : o.body) : null,
          U.h('div', { class: 'dialog-actions' },
            U.h('button', { class: 'btn btn-ghost', onclick: function () { close(false); } }, o.cancel || 'Cancel'), okBtn)));
      document.body.appendChild(wrap);
      document.addEventListener('keydown', onKey);
      okBtn.focus();
    });
  };

  U.plural = function (n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); };
  U.clamp = function (n, a, b) { return Math.max(a, Math.min(b, n)); };
})(window.AA);
