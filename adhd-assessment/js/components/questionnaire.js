/* Interactive questionnaire: renders a tool's items, records answers and shows a live score.
   AA.components.questionnaire(tool, {answers, onAnswer(n, value), mode:'full'|'compact'})
   The caller owns persistence (onAnswer writes to the store). The component keeps a local copy
   of the answers so the score updates instantly without re-rendering the whole page. */
(function (AA) {
  'use strict';
  var U = AA.util, h = U.h, ui = AA.ui;

  function scoreBox(tool, r) {
    var box = h('div', { class: 'q-score' });
    if (!r || !r.answered) {
      box.appendChild(h('p', { class: 'q-score-empty' }, 'Answer the items to see the score.'));
      return box;
    }
    var head = h('div', { class: 'q-score-head' },
      r.total !== null && r.max ? h('span', { class: 'q-score-num' }, String(r.total), h('small', null, ' / ' + r.max)) : null,
      r.band ? ui.sevChip(r.sev, r.band) : null,
      r.positive === true && !r.band ? ui.badge('Above cut-off', 'warn') : null,
      !r.complete ? ui.badge(r.answered + ' of ' + r.of + ' answered', 'neutral') : null);
    box.appendChild(head);
    if (r.lines && r.lines.length) box.appendChild(h('ul', { class: 'q-lines' }, r.lines.map(function (l) { return h('li', null, l); })));
    if (r.domains) {
      box.appendChild(ui.table(['Domain', 'Mean', 'Items 2+', 'Impaired'], r.domains.map(function (d) {
        return [d.label, d.mean === null ? '-' : d.mean.toFixed(2), String(d.twos), d.impaired === null ? '-' : d.impaired ? ui.badge('Yes', 'warn') : ui.badge('No', 'ok')];
      }), 'table-compact'));
    }
    if (r.subscales && r.subscales.length) {
      box.appendChild(ui.table(['Subscale', 'Score', 'Result'], r.subscales.map(function (s) {
        return [s.label, s.total + ' / ' + s.max + (s.answered < s.of ? ' (' + s.answered + '/' + s.of + ' answered)' : ''),
          s.band ? ui.sevChip(s.sev, s.band) : s.positive === true ? ui.badge('Above cut-off', 'warn') : s.positive === false ? ui.badge('Below cut-off', 'ok') : '-'];
      }), 'table-compact'));
    }
    if (r.clusters) {
      box.appendChild(h('p', { class: 'q-note' }, 'DSM-5 cluster pattern (items rated 2+): ' +
        Object.keys(r.clusters).map(function (k) { var c = r.clusters[k]; return k + ' ' + c.endorsed + '/' + c.need + (c.met ? ' ✓' : ''); }).join(' · ') +
        (r.dsmPattern === true ? ' — pattern consistent with probable PTSD; confirm by interview.' : '')));
    }
    (r.flags || []).forEach(function (f) {
      box.appendChild(ui.callout(f.level === 'urgent' ? 'err' : 'warn', h('p', null, f.text)));
    });
    return box;
  }

  AA.components.questionnaire = function (tool, o) {
    o = o || {};
    var answers = Object.assign({}, o.answers || {});
    var root = h('div', { class: 'q' + (o.mode === 'compact' ? ' q-compact' : '') });
    if (!tool.items || !tool.items.length) {
      root.appendChild(ui.callout('info', h('p', null, 'This instrument is not reproduced here because of its licence. Use the official form, then record the result in your notes.')));
      return root;
    }
    var scoreHost = h('div', { class: 'q-score-host', 'aria-live': 'polite' });
    function rescore() { U.clear(scoreHost); scoreHost.appendChild(scoreBox(tool, AA.scoring.score(tool, answers))); }

    if (tool.instructions) root.appendChild(h('p', { class: 'q-instructions' }, tool.instructions));
    var list = h('ol', { class: 'q-items' });
    var lastSection = null;
    tool.items.forEach(function (it) {
      if (it.section && it.section !== lastSection) {
        lastSection = it.section;
        list.appendChild(h('li', { class: 'q-section', 'aria-hidden': 'false' }, h('h4', null, it.section), it.sectionNote ? h('p', { class: 'hint' }, it.sectionNote) : null));
      }
      var opts = it.opts || tool.options || [];
      var li = h('li', { class: 'q-item' + (it.part === 'A' ? ' q-item-key' : '') },
        h('div', { class: 'q-item-text' }, h('span', { class: 'q-n' }, it.label || String(it.n)), h('span', null, it.t),
          it.threshold !== undefined ? h('span', { class: 'q-thr', title: 'Shaded box starts at this answer' }, 'shaded from "' + (opts.filter(function (x) { return x.v === it.threshold; })[0] || {}).l + '"') : null),
        ui.seg({
          label: 'Item ' + (it.label || it.n), hideLabel: true, small: opts.length > 4,
          options: opts.map(function (x) { return { v: x.v, l: x.l, kind: it.threshold !== undefined && typeof x.v === 'number' && x.v >= it.threshold ? 'shade' : null }; }),
          value: answers[it.n] === undefined ? null : answers[it.n],
          onChange: function (v) {
            if (v === null) delete answers[it.n]; else answers[it.n] = v;
            li.classList.toggle('answered', v !== null);
            if (o.onAnswer) o.onAnswer(it.n, v);
            rescore();
          }
        }));
      if (answers[it.n] !== undefined) li.classList.add('answered');
      list.appendChild(li);
    });
    root.appendChild(list);
    var actions = h('div', { class: 'q-actions' },
      ui.btn({ label: 'Clear answers', kind: 'quiet', small: true, onClick: function () {
        U.confirm({ title: 'Clear all answers for ' + tool.abbr + '?', ok: 'Clear', danger: true }).then(function (yes) {
          if (!yes) return;
          Object.keys(answers).forEach(function (k) { if (o.onAnswer) o.onAnswer(isNaN(+k) ? k : +k, null); });
          answers = {};
          U.$$('input[type=radio]', list).forEach(function (r) { r.checked = false; });
          U.$$('.seg', list).forEach(function (s) { s.removeAttribute('data-was'); });
          U.$$('.q-item', list).forEach(function (li) { li.classList.remove('answered'); });
          rescore();
        });
      } }));
    root.appendChild(h('div', { class: 'q-foot' }, h('h4', { class: 'q-foot-title' }, 'Score'), scoreHost, actions));
    rescore();
    return root;
  };

  /* Read-only band table for a tool (used in the library). */
  AA.components.bands = function (tool) {
    var b = tool.scoring && tool.scoring.bands;
    if (!b || !b.length) return null;
    return ui.table(['Score', 'Interpretation'], b.map(function (x) {
      return [x.max === undefined || x.max === null ? x.min + '+' : x.min + '–' + x.max, ui.sevChip(x.sev, x.label)];
    }), 'table-compact');
  };

  AA.components.scoreBox = scoreBox;
})(window.AA);
