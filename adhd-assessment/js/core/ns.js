/* Namespace and data registry. Loaded first.
   Every other file attaches to window.AA. Data files register content with AA.add(),
   so a collection (for example "tools") can be split across several files. */
(function (g) {
  'use strict';
  var AA = g.AA = g.AA || {};
  AA.version = '1.0.0';
  AA.data = AA.data || {};
  AA.views = AA.views || {};
  AA.components = AA.components || {};

  /* AA.add('tools', [...]) appends to an array collection.
     AA.add('impairment', {...}) merges into an object collection. */
  AA.add = function (name, value) {
    var cur = AA.data[name];
    if (Array.isArray(value)) {
      AA.data[name] = (Array.isArray(cur) ? cur : []).concat(value);
    } else if (value && typeof value === 'object') {
      AA.data[name] = Object.assign({}, cur || {}, value);
    } else {
      AA.data[name] = value;
    }
    return AA.data[name];
  };

  /* Look up one record by id in an array collection. */
  AA.byId = function (name, id) {
    var list = AA.data[name] || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };
})(typeof window !== 'undefined' ? window : globalThis);
