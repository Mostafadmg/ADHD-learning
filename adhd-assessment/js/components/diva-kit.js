/* The clinician's own DIVA 2.0 PDF: load it once on this device, read it, keep it, and fill it in.
   AA.pdfkit     loads the vendored PDF libraries on demand (vendor/README.md) and fills or previews a PDF.
   AA.divaSource keeps the parsed DIVA content (localStorage, so screens can read it at once) and the PDF bytes
                 (IndexedDB, needed to fill the form) on this device only. Nothing is uploaded anywhere.
   The parser and the list of marks are pure (js/engine/diva.js); this file only does the browser work.
   See ARCHITECTURE.md section 3 (AA.diva) and section 8 (DIVA content rule). */
(function (AA) {
  'use strict';
  var U = AA.util;
  var VER = '20261120dv1';
  var LIBS = {
    pdfjs: { src: 'vendor/pdfjs/pdf.min.js', global: 'pdfjsLib' },
    pdflib: { src: 'vendor/pdf-lib/pdf-lib.min.js', global: 'PDFLib' }
  };
  var loading = {};

  var K = AA.pdfkit = {};
  /* Load a vendored library once; resolves with its global. */
  K.load = function (name) {
    var L = LIBS[name];
    if (!L) return Promise.reject(new Error('Unknown library ' + name));
    if (window[L.global]) return Promise.resolve(window[L.global]);
    if (loading[name]) return loading[name];
    loading[name] = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = L.src + '?v=' + VER;
      s.async = true;
      s.onload = function () {
        var g = window[L.global];
        if (!g) { reject(new Error('The PDF tools did not start.')); return; }
        if (name === 'pdfjs' && g.GlobalWorkerOptions) g.GlobalWorkerOptions.workerSrc = 'vendor/pdfjs/pdf.worker.min.js?v=' + VER;
        resolve(g);
      };
      s.onerror = function () { loading[name] = null; reject(new Error('The PDF tools could not be loaded. Check the internet connection, or use the hosted version rather than the single-file copy.')); };
      document.head.appendChild(s);
    });
    return loading[name];
  };

  /* Read a PDF into the plain pages AA.diva.parse expects. */
  K.readPages = function (bytes) {
    return K.load('pdfjs').then(function (pdfjs) {
      return pdfjs.getDocument({ data: bytes.slice ? bytes.slice(0) : bytes, isEvalSupported: false }).promise;
    }).then(function (doc) {
      var out = [], n = doc.numPages, chain = Promise.resolve();
      for (var i = 1; i <= n; i++) {
        (function (k) {
          chain = chain.then(function () { return doc.getPage(k); }).then(function (page) {
            var vp = page.getViewport({ scale: 1 });
            return Promise.all([page.getTextContent(), page.getAnnotations()]).then(function (r) {
              out.push(AA.diva.pageFromPdfjs(k, { w: vp.width, h: vp.height }, r[0], r[1]));
            });
          });
        })(i);
      }
      return chain.then(function () { try { doc.destroy(); } catch (e) { /* ignore */ } return out; });
    });
  };

  /* Draw the marks of AA.diva.fillPlan on a copy of the PDF. Works with pdf-lib in the browser or in node.
     The form's own fields are removed first: some of its yes/no boxes are wired as one radio group across
     both columns, so they cannot hold two answers. The result is a printable, flat copy of the form. */
  K.fillWith = function (PL, bytes, plan, opts) {
    opts = opts || {};
    var ink = PL.rgb(0.06, 0.15, 0.45);
    return PL.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false }).then(function (doc) {
      var pages = doc.getPages();
      pages.forEach(function (pg) {
        var annots = pg.node.lookup(PL.PDFName.of('Annots'));
        if (!annots || typeof annots.size !== 'function') return;
        var keep = [];
        for (var i = 0; i < annots.size(); i++) {
          var ref = annots.get(i), d = doc.context.lookup(ref);
          var st = d && d.get ? d.get(PL.PDFName.of('Subtype')) : null;
          if (!(st && String(st) === '/Widget')) keep.push(ref);
        }
        if (keep.length) pg.node.set(PL.PDFName.of('Annots'), doc.context.obj(keep));
        else pg.node.delete(PL.PDFName.of('Annots'));
      });
      doc.catalog.delete(PL.PDFName.of('AcroForm'));
      return Promise.all([doc.embedFont(PL.StandardFonts.Helvetica), doc.embedFont(PL.StandardFonts.HelveticaBold)]).then(function (fonts) {
        var regular = fonts[0], bold = fonts[1];
        function safe(font, s) {
          var out = '', map = { '≥': '>=', '≤': '<=', '✓': 'v', '✔': 'v', '→': '->', ' ': ' ', '\t': ' ' };
          Array.from(String(s)).forEach(function (ch) {
            var t = map[ch] !== undefined ? map[ch] : ch;
            try { font.encodeText(t); out += t; } catch (e) { out += '?'; }
          });
          return out;
        }
        (plan.ops || []).forEach(function (op) {
          var pg = pages[op.box.p];
          if (!pg) return;
          var b = op.box;
          if (op.op === 'tick') {
            /* A hand-drawn style tick that fills the box. */
            var x = b.x, y = b.y, w = Math.max(b.w, 8), h = Math.max(b.h, 7);
            pg.drawLine({ start: { x: x + w * 0.12, y: y + h * 0.52 }, end: { x: x + w * 0.42, y: y + h * 0.12 }, thickness: 1.5, color: ink });
            pg.drawLine({ start: { x: x + w * 0.42, y: y + h * 0.12 }, end: { x: x + w * 1.02, y: y + h * 1.12 }, thickness: 1.5, color: ink });
            return;
          }
          var font = op.bold ? bold : regular;
          var pad = op.single ? 2 : 3;
          var text = safe(font, op.text);
          var measure = function (t, sz) { return font.widthOfTextAtSize(safe(font, t), sz); };
          var L = AA.diva.layout(text, b.w - pad * 2, b.h - pad * 2, measure, { size: op.size || 9, min: op.single ? Math.min(6, op.size || 9) : 5.5 });
          if (op.single && L.lines.length > 1) L = { size: L.size, lines: [L.lines.join(' ')], lead: L.lead };
          var y0 = op.single ? b.y + (b.h - L.size * 0.72) / 2 : b.y + b.h - pad - L.size * 0.86;
          L.lines.forEach(function (line, i) {
            var w = font.widthOfTextAtSize(line, L.size);
            var x0 = op.align === 'center' ? b.x + (b.w - w) / 2 : b.x + pad;
            pg.drawText(line, { x: x0, y: y0 - i * L.lead, size: L.size, font: font, color: ink });
          });
        });
        if (opts.title) { try { doc.setTitle(opts.title); } catch (e) { /* ignore */ } }
        try { doc.setProducer('ADHD Assessment (filled on this device)'); } catch (e) { /* ignore */ }
        return doc.save({ useObjectStreams: true, updateFieldAppearances: false });
      });
    });
  };
  K.fill = function (bytes, plan, opts) {
    return K.load('pdflib').then(function (PL) { return K.fillWith(PL, bytes, plan, opts); });
  };

  /* Render page images of a PDF into a container (preview). Resolves with the number of pages drawn. */
  K.preview = function (bytes, host, opts) {
    opts = opts || {};
    return K.load('pdfjs').then(function (pdfjs) {
      return pdfjs.getDocument({ data: bytes.slice ? bytes.slice(0) : bytes, isEvalSupported: false }).promise;
    }).then(function (doc) {
      var pagesWanted = opts.pages || null, chain = Promise.resolve(), n = 0;
      for (var i = 1; i <= doc.numPages; i++) {
        if (pagesWanted && pagesWanted.indexOf(i) < 0) continue;
        (function (k) {
          chain = chain.then(function () { return doc.getPage(k); }).then(function (page) {
            var scale = opts.scale || 1.4;
            var vp = page.getViewport({ scale: scale });
            var c = document.createElement('canvas');
            c.width = Math.floor(vp.width); c.height = Math.floor(vp.height);
            c.className = 'dv-pv-page';
            c.setAttribute('aria-label', 'Page ' + k);
            host.appendChild(c);
            n++;
            return page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
          });
        })(i);
      }
      return chain.then(function () { try { doc.destroy(); } catch (e) { /* ignore */ } return n; });
    });
  };

  /* ---------- the clinician's DIVA copy on this device ---------- */
  var KEY = 'aa.diva2.content', DB = 'aa-diva', STORE = 'files', FILE = 'diva2';
  var memo = { content: null, bytes: null };
  function idb() {
    return new Promise(function (resolve, reject) {
      try {
        if (!window.indexedDB) { reject(new Error('no indexedDB')); return; }
        var r = indexedDB.open(DB, 1);
        r.onupgradeneeded = function () { r.result.createObjectStore(STORE); };
        r.onsuccess = function () { resolve(r.result); };
        r.onerror = function () { reject(r.error || new Error('indexedDB')); };
      } catch (e) { reject(e); }
    });
  }
  function idbDo(mode, fn) {
    return idb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, mode), st = tx.objectStore(STORE), req = fn(st);
        tx.oncomplete = function () { resolve(req ? req.result : undefined); db.close(); };
        tx.onerror = function () { reject(tx.error); db.close(); };
      });
    });
  }

  var S = AA.divaSource = {};
  var listeners = [];
  S.onChange = function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; };
  function emit() { listeners.slice().forEach(function (f) { try { f(S.content()); } catch (e) { /* ignore */ } }); }

  /* The parsed content, or null. Synchronous: localStorage first, then this session's memory. */
  S.content = function () {
    if (memo.content) return memo.content;
    var c = U.storage.get(KEY, null);
    if (c && c.ok && c.items) memo.content = c;
    return memo.content;
  };
  S.has = function () { return !!S.content(); };
  /* Only the parts the screens need; the score form is still read from the full copy when filling. */
  S.meta = function () { var c = S.content(); return c ? c.meta || {} : null; };

  /* At start-up the content may be only in IndexedDB (localStorage full or cleared): fetch it once. */
  S.restore = function () {
    if (S.content()) return Promise.resolve(S.content());
    return idbDo('readonly', function (st) { return st.get(FILE + '.content'); }).then(function (c) {
      if (c && c.ok && c.items) { memo.content = c; U.storage.set(KEY, c); emit(); }
      return memo.content;
    }).catch(function () { return null; });
  };

  /* Read a File the clinician chose. Resolves {ok, content, problems}. Saves only when the copy is readable. */
  S.importFile = function (file) {
    if (!file) return Promise.reject(new Error('No file chosen.'));
    if (file.size > 30 * 1024 * 1024) return Promise.reject(new Error('That file is too large to be the DIVA form.'));
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(new Uint8Array(fr.result)); };
      fr.onerror = function () { reject(new Error('The file could not be read.')); };
      fr.readAsArrayBuffer(file);
    }).then(function (bytes) {
      return K.readPages(bytes).then(function (pages) {
        var C = AA.diva.parse(pages);
        C.meta = { file: file.name, size: file.size, loadedAt: new Date().toISOString(), edition: C.edition, sig: C.sig, hash: C.hash, pages: pages.length };
        if (!C.ok) return { ok: false, content: C, problems: C.problems };
        memo.content = C; memo.bytes = bytes;
        U.storage.set(KEY, C);
        return idbDo('readwrite', function (st) { st.put(bytes, FILE); return st.put(C, FILE + '.content'); })
          .then(function () { return true; }, function () { return false; })
          .then(function (stored) { emit(); return { ok: true, content: C, problems: C.problems, storedPdf: stored }; });
      });
    });
  };

  /* The PDF bytes for filling: memory, then IndexedDB. Resolves null when not kept (pick the file again). */
  S.bytes = function () {
    if (memo.bytes) return Promise.resolve(memo.bytes);
    return idbDo('readonly', function (st) { return st.get(FILE); }).then(function (b) {
      if (b) memo.bytes = b instanceof Uint8Array ? b : new Uint8Array(b);
      return memo.bytes;
    }).catch(function () { return null; });
  };
  /* Use a re-chosen copy for this session only when the stored bytes are missing; it must match the content. */
  S.useFileForFill = function (file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(new Uint8Array(fr.result)); };
      fr.onerror = function () { reject(new Error('The file could not be read.')); };
      fr.readAsArrayBuffer(file);
    }).then(function (bytes) {
      return K.readPages(bytes).then(function (pages) {
        var C = AA.diva.parse(pages), cur = S.content();
        if (!C.ok || (cur && C.hash !== cur.hash)) throw new Error('This is not the same DIVA copy that was loaded before. Load it again from the DIVA screen.');
        memo.bytes = bytes;
        idbDo('readwrite', function (st) { return st.put(bytes, FILE); }).catch(function () { /* keep in memory */ });
        return bytes;
      });
    });
  };

  S.clear = function () {
    memo.content = null; memo.bytes = null;
    U.storage.remove(KEY);
    return idbDo('readwrite', function (st) { st.delete(FILE); return st.delete(FILE + '.content'); }).catch(function () { /* ignore */ }).then(function () { emit(); });
  };

  /* Ask the browser for a file. Resolves the File or null. */
  S.pick = function () {
    return new Promise(function (resolve) {
      var inp = U.h('input', { type: 'file', accept: 'application/pdf,.pdf', style: { position: 'fixed', left: '-9999px' } });
      inp.addEventListener('change', function () { var f = inp.files && inp.files[0]; inp.remove(); resolve(f || null); });
      document.body.appendChild(inp);
      inp.click();
    });
  };
})(window.AA);
