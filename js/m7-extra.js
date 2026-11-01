/* Module 7 extras (phones).
   1. Heart and blood pressure, "Contraindications" tab: the 5-medicine matrix is a wide table. On a phone it is
      replaced by a medicine picker: choose a medicine, see its row for every condition (pill + SmPC note).
      The table stays in the page (it is what wider screens show, and the no-JS fallback); CSS swaps them at 700px.
   Nothing here adds or changes clinical text: everything is copied from the table's own cells. */
(function () {
  'use strict';
  var root = document.getElementById('m7');
  if (!root) return;

  /* ---------- 1. medicine picker ---------- */
  var tbl = root.querySelector('table.cmp');
  var wrap = tbl && tbl.closest('.cmp-wrap');
  if (tbl && wrap && wrap.parentNode && !wrap.parentNode.querySelector('.m7-mp')) {
    var heads = Array.prototype.map.call(tbl.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); }).slice(1);
    var rows = Array.prototype.map.call(tbl.querySelectorAll('tbody tr'), function (tr) {
      var th = tr.querySelector('th');
      return { c: th ? th.innerHTML : '', cells: Array.prototype.map.call(tr.querySelectorAll('td'), function (td) { return td.innerHTML; }) };
    });
    var cap = tbl.querySelector('caption');
    var mp = document.createElement('div');
    mp.className = 'm7-mp';
    var chips = document.createElement('div');
    chips.className = 'm7-mp-chips';
    chips.setAttribute('role', 'tablist');
    chips.setAttribute('aria-label', 'Choose a medicine');
    var list = document.createElement('ul');
    list.className = 'm7-mp-list';
    list.setAttribute('role', 'tabpanel');
    list.setAttribute('aria-live', 'polite');
    var btns = heads.map(function (h, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.textContent = h;
      b.addEventListener('click', function () { show(k, false); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          show((k + (e.key === 'ArrowRight' ? 1 : -1) + heads.length) % heads.length, true);
        }
      });
      chips.appendChild(b);
      return b;
    });
    function show(k, focus) {
      btns.forEach(function (b, i) { b.setAttribute('aria-selected', i === k ? 'true' : 'false'); b.tabIndex = i === k ? 0 : -1; });
      list.innerHTML = rows.map(function (r) {
        return '<li><div class="m7-mp-c">' + r.c + '</div><div class="m7-mp-v">' + (r.cells[k] || '') + '</div></li>';
      }).join('');
      if (focus) btns[k].focus();
    }
    mp.appendChild(chips);
    mp.appendChild(list);
    if (cap) {
      var p = document.createElement('p');
      p.className = 'm7-mp-cap';
      p.innerHTML = cap.innerHTML;
      mp.appendChild(p);
    }
    wrap.parentNode.insertBefore(mp, wrap);
    wrap.parentNode.classList.add('m7-mp-on');
    show(0, false);
  }
})();
