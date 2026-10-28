/* State management: one state object (single source of truth), immutable updates by path,
   path-based subscriptions (observer pattern) and debounced persistence to localStorage.
   Nothing here touches the DOM. Views read with get() and write with set(). */
(function (AA) {
  'use strict';
  var U = AA.util;
  var KEY = 'aa.v1';
  var SESSION_KEY = 'aa.session';

  function blankState() {
    return { v: 1, clinicians: {}, assessments: {}, progress: {}, prefs: { theme: 'system' } };
  }

  var state = U.storage.get(KEY, null);
  if (!state || state.v !== 1) state = blankState();
  var listeners = [];
  var saveStatus = U.storage.ok ? 'saved' : 'unavailable';

  function split(path) {
    if (Array.isArray(path)) return path;
    return path === '' || path == null ? [] : String(path).split('.');
  }
  function getIn(obj, parts) {
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }
  /* Returns a new object with value set at parts; only the objects along the path are copied. */
  function setIn(obj, parts, value) {
    if (!parts.length) return value;
    var head = parts[0];
    var base = obj && typeof obj === 'object' ? obj : {};
    var copy = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    if (parts.length === 1 && value === undefined) delete copy[head];
    else copy[head] = setIn(base[head], parts.slice(1), value);
    return copy;
  }

  var persist = U.debounce(function () {
    var ok = U.storage.set(KEY, state);
    saveStatus = ok ? 'saved' : 'unavailable';
    emit('__save', saveStatus);
  }, 300);

  function emit(path, value) {
    listeners.slice().forEach(function (l) {
      if (l.prefix === '*' || path === '' || path === l.prefix || path.indexOf(l.prefix + '.') === 0 || l.prefix.indexOf(path + '.') === 0) {
        try { l.fn(path, value); } catch (e) { if (window.console) console.error(e); }
      }
    });
  }

  var store = AA.store = {
    get state() { return state; },
    /* get('assessments.k3j2.symptoms.ia1.adult', fallback) */
    get: function (path, fallback) {
      var v = getIn(state, split(path));
      return v === undefined ? fallback : v;
    },
    /* set(path, value). value undefined deletes the key. */
    set: function (path, value) {
      var parts = split(path);
      state = setIn(state, parts, value);
      saveStatus = 'saving';
      persist();
      emit(parts.join('.'), value);
    },
    update: function (path, fn) { store.set(path, fn(store.get(path))); },
    /* subscribe('assessments.k3j2.symptoms', fn) -> unsubscribe function.
       fn(changedPath, value) runs when the changed path is inside the prefix or contains it.
       Use '*' for every change and '__save' for the save status. */
    subscribe: function (prefix, fn) {
      var l = { prefix: prefix, fn: fn };
      listeners.push(l);
      return function () { listeners = listeners.filter(function (x) { return x !== l; }); };
    },
    saveStatus: function () { return saveStatus; },
    flush: function () { persist.flush(); },
    replaceAll: function (next) {
      if (!next || next.v !== 1) throw new Error('This file is not an ADHD Assessment export.');
      state = next; persist(); emit('', state);
    },
    exportJSON: function () { return JSON.stringify(state, null, 2); },
    reset: function () { state = blankState(); persist(); emit('', state); }
  };

  window.addEventListener('beforeunload', function () { persist.flush(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) persist.flush(); });

  /* ---------- Clinician profiles ("sign-in"). Local only: a convenience lock, not a security boundary. ---------- */
  var sessionId = null;
  try { sessionId = sessionStorage.getItem(SESSION_KEY); } catch (e) { sessionId = null; }
  function pinHash(id, pin) { return U.sha256('aa:' + id + ':' + pin); }

  var auth = AA.auth = {
    list: function () {
      var c = state.clinicians || {};
      return Object.keys(c).map(function (k) { return c[k]; }).sort(function (a, b) { return (b.lastSeen || '').localeCompare(a.lastSeen || ''); });
    },
    current: function () { return sessionId && state.clinicians[sessionId] ? state.clinicians[sessionId] : null; },
    create: function (o) {
      var id = U.uid(6);
      var now = new Date().toISOString();
      var rec = { id: id, name: (o.name || 'Clinician').trim(), role: o.role || '', pinHash: null, createdAt: now, lastSeen: now, guest: !!o.guest };
      var p = o.pin ? pinHash(id, o.pin) : Promise.resolve(null);
      return p.then(function (hash) {
        rec.pinHash = hash;
        store.set('clinicians.' + id, rec);
        auth._start(id);
        return rec;
      });
    },
    needsPin: function (id) { var c = state.clinicians[id]; return !!(c && c.pinHash); },
    signIn: function (id, pin) {
      var c = state.clinicians[id];
      if (!c) return Promise.resolve(false);
      if (!c.pinHash) { auth._start(id); return Promise.resolve(true); }
      return pinHash(id, pin || '').then(function (h) {
        if (h !== c.pinHash) return false;
        auth._start(id); return true;
      });
    },
    _start: function (id) {
      sessionId = id;
      try { sessionStorage.setItem(SESSION_KEY, id); } catch (e) { /* ignore */ }
      store.set('clinicians.' + id + '.lastSeen', new Date().toISOString());
      emit('__auth', id);
    },
    signOut: function () {
      sessionId = null;
      try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
      emit('__auth', null);
    },
    removeProfile: function (id) {
      var all = state.assessments || {};
      Object.keys(all).forEach(function (k) { if (all[k].clinicianId === id) store.set('assessments.' + k, undefined); });
      store.set('progress.' + id, undefined);
      store.set('clinicians.' + id, undefined);
      if (sessionId === id) auth.signOut();
    }
  };

  /* ---------- Assessments ---------- */
  /* Fields used only for children and young people (6-17). Empty for adults.
     consentBasis: 'parent_assent' (under 16, not Gillick competent: a person with parental responsibility consents and
     the child assents) | 'gillick' (under 16, competent) | 'capacity_16' (16 or 17, capacity presumed) |
     'lacks_capacity_16' (16 or 17, assessed as lacking capacity for this decision) | null. */
  function blankYoung() {
    return { school: '', year: '', sen: null, pr: '', consentBasis: null, assent: false, seenAlone: false,
      lac: false, socialWorker: '', schoolConsent: false };
  }
  function blankAssessment(id, clinicianId, patient) {
    var now = new Date().toISOString();
    return {
      id: id, clinicianId: clinicianId, createdAt: now, updatedAt: now, status: 'active', step: 'setup',
      /* referralNotes: the referral note for a child under 6 (concerns, impact, support tried, parent training, safeguarding). */
      patient: Object.assign({ ref: '', age: null, sex: '', gender: '', occupation: '', referrer: '', reason: '', referralNotes: '', date: U.today(),
        informants: { partner: false, parent: false, sibling: false, teacher: false, other: '' }, sources: { schoolReports: false, previousRecords: false },
        consent: false, interpreter: false, young: blankYoung() }, patient || {}),
      tools: {}, risk: {}, history: {}, symptoms: {}, supplement: {}, onset: {}, impairment: { adult: {}, child: {} },
      collateral: {}, ddx: {}, validity: {}, formulation: {}, treatment: {}
    };
  }

  var assess = AA.assess = {
    create: function (patient, opts) {
      var me = auth.current();
      var id = U.uid(8);
      var rec = blankAssessment(id, me ? me.id : 'anon', patient);
      if (opts && opts.demo) rec.demo = opts.demo === 'young' ? 'young' : true;
      store.set('assessments.' + id, rec);
      return id;
    },
    /* Create from a full record (used by the demo loader and import). */
    insert: function (rec) {
      var me = auth.current();
      var id = U.uid(8);
      var full = Object.assign(blankAssessment(id, me ? me.id : 'anon'), rec, { id: id, clinicianId: me ? me.id : 'anon' });
      store.set('assessments.' + id, full);
      return id;
    },
    list: function () {
      var me = auth.current();
      var all = state.assessments || {};
      return Object.keys(all).map(function (k) { return all[k]; })
        .filter(function (a) { return !me || a.clinicianId === me.id; })
        .sort(function (a, b) { return (b.updatedAt || '').localeCompare(a.updatedAt || ''); });
    },
    get: function (id, rel, fallback) {
      return store.get('assessments.' + id + (rel ? '.' + rel : ''), fallback);
    },
    /* set(id, 'symptoms.ia1.adult', 'yes') also stamps updatedAt. */
    set: function (id, rel, value) {
      if (!state.assessments[id]) return;
      store.set('assessments.' + id + '.' + rel, value);
      store.set('assessments.' + id + '.updatedAt', new Date().toISOString());
    },
    remove: function (id) { store.set('assessments.' + id, undefined); },
    path: function (id, rel) { return 'assessments.' + id + (rel ? '.' + rel : ''); }
  };

  /* ---------- Learning progress (per clinician) ---------- */
  AA.progress = {
    get: function (rel, fallback) {
      var me = auth.current();
      return me ? store.get('progress.' + me.id + (rel ? '.' + rel : ''), fallback) : fallback;
    },
    set: function (rel, value) {
      var me = auth.current();
      if (me) store.set('progress.' + me.id + '.' + rel, value);
    }
  };
})(window.AA);
