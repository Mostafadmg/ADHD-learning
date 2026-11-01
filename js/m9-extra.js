/* Module 9, phone layer. On screens up to 700px the six-step pathway in lesson 1 (ol.tl[data-m9tl]) becomes a route strip:
   six icons in a row, tap one to read it below. Nothing is removed from the page: the other steps stay in the markup and
   wide screens keep the full timeline. If this script does not run, phones simply get the normal vertical timeline. */
(function () {
  'use strict';
  var tl = document.querySelector('#m9 ol.tl[data-m9tl]');
  if (!tl) return;
  var items = Array.prototype.slice.call(tl.children);
  var mq = window.matchMedia ? window.matchMedia('(max-width:700px)') : { matches: false };
  var hint = null;

  function title(li) { var b = li.querySelector('b'); return b ? b.textContent.trim() : ''; }

  function select(i, focus) {
    items.forEach(function (li, k) {
      var on = k === i, node = li.querySelector('.tl-node');
      li.classList.toggle('sel', on);
      if (node) node.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (focus) { var n = items[i].querySelector('.tl-node'); if (n) n.focus(); }
  }

  function onKey(e) {
    var node = e.currentTarget, i = items.indexOf(node.parentNode);
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); select(Math.min(items.length - 1, i + 1), true); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); select(Math.max(0, i - 1), true); }
  }
  function onClick(e) { select(items.indexOf(e.currentTarget.parentNode)); }

  function on() {
    if (tl.classList.contains('m9-route')) return;
    tl.classList.add('m9-route');
    items.forEach(function (li, i) {
      var node = li.querySelector('.tl-node'); if (!node) return;
      node.setAttribute('role', 'button'); node.tabIndex = 0;
      node.setAttribute('aria-label', 'Step ' + (i + 1) + ': ' + title(li) + (li.classList.contains('in') ? ' (covered in this module)' : ' (covered elsewhere)'));
      node.addEventListener('click', onClick); node.addEventListener('keydown', onKey);
    });
    hint = document.createElement('p'); hint.className = 'm9-tl-hint'; hint.textContent = 'Tap a step to read it.';
    tl.parentNode.insertBefore(hint, tl);
    var first = items.findIndex(function (li) { return li.classList.contains('in'); });
    select(first < 0 ? 0 : first);
  }
  function off() {
    if (!tl.classList.contains('m9-route')) return;
    tl.classList.remove('m9-route');
    items.forEach(function (li) {
      li.classList.remove('sel');
      var node = li.querySelector('.tl-node'); if (!node) return;
      node.removeAttribute('role'); node.removeAttribute('tabindex'); node.removeAttribute('aria-label'); node.removeAttribute('aria-pressed');
      node.removeEventListener('click', onClick); node.removeEventListener('keydown', onKey);
    });
    if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
    hint = null;
  }
  function sync() { if (mq.matches) on(); else off(); }

  sync();
  if (mq.addEventListener) mq.addEventListener('change', sync); else if (mq.addListener) mq.addListener(sync);
})();
