/* Site search: one box in the top bar that searches the whole course.
   Indexes, on first use: modules, lessons, headings, key-point cards, flashcards, practice questions (with answers),
   the glossary, the 19 Assessment Guide steps and the standalone Form library. Understands abbreviations and brand
   names, UK/US spellings and small typos. Results show where they live and jump straight there. */
(function(){
  'use strict';
  var bar = document.querySelector('.topbar'); if(!bar) return;
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function clean(s){ return String(s || '').replace(/\s+/g, ' ').trim(); }

  /* ---------- text normalising ---------- */
  var STOP = {the:1,a:1,an:1,of:1,and:1,or:1,to:1,in:1,on:1,for:1,is:1,are:1,be:1,with:1,what:1,how:1,when:1,why:1,which:1,who:1,do:1,does:1,i:1,it:1,at:1,by:1,can:1,should:1,my:1,me:1,about:1,vs:1,versus:1};
  var SPELL = [[/apnea/g,'apnoea'],[/behavior/g,'behaviour'],[/pediatric/g,'paediatric'],[/esophag/g,'oesophag'],[/anemia/g,'anaemia'],[/titrat(e|ion|ing)/g,'titrat'],[/amphetamine/g,'amfetamine'],[/center/g,'centre'],[/organiz/g,'organis'],[/hyperactiv\w*/g,'hyperactiv']];
  function norm(s){ s = String(s || '').toLowerCase().replace(/[‘’']/g, '').replace(/[–—]/g, '-'); SPELL.forEach(function(p){ s = s.replace(p[0], p[1]); }); return s.replace(/([a-z]{2,})-(\d{1,3})/g, '$1$2 $1-$2'); }
  function words(s){ return norm(s).split(/[^a-z0-9.+]+/).map(function(w){ return w.replace(/^\.+|\.+$/g, ''); }).filter(function(w){ return w && !STOP[w]; }); }

  /* Abbreviations, brands and lay words -> what the course calls them. */
  var SYN = {
    mph:['methylphenidate'], ritalin:['methylphenidate'], concerta:['methylphenidate','concerta'], medikinet:['methylphenidate'], equasym:['methylphenidate'], xaggitin:['methylphenidate'], delmosart:['methylphenidate'], meflynate:['methylphenidate'], metyrol:['methylphenidate'], focusim:['methylphenidate'], affenid:['methylphenidate'], atenza:['methylphenidate'], matoride:['methylphenidate'], xenidate:['methylphenidate'],
    lisdex:['lisdexamfetamine'], ldx:['lisdexamfetamine'], elvanse:['lisdexamfetamine','elvanse'], vyvanse:['lisdexamfetamine'], dex:['dexamfetamine'], dexedrine:['dexamfetamine'], amfexa:['dexamfetamine'],
    atx:['atomoxetine'], strattera:['atomoxetine'], intuniv:['guanfacine'], gxr:['guanfacine'], stimulant:['stimulant','methylphenidate','lisdexamfetamine'], nonstimulant:['atomoxetine','guanfacine'],
    ecg:['ecg','electrocardiogram'], ekg:['ecg'], bp:['blood','pressure'], hr:['pulse','heart'], htn:['hypertension'], cd:['controlled'], cds:['controlled'],
    asd:['autism','autistic'], autistic:['autism'], id:['intellectual'], ld:['learning','intellectual'], bpd:['borderline'], eupd:['borderline','emotionally'], ptsd:['trauma','ptsd'], osa:['apnoea','sleep'],
    odd:['oppositional'], cd2:['conduct'], tics:['tic'], tourette:['tic'], epilepsy:['epilepsy','seizure'], seizures:['seizure','epilepsy'], fits:['seizure'],
    pregnant:['pregnancy'], breastfeeding:['breastfeeding','lactation'], menopause:['menopause','perimenopause'], driving:['driving','dvla'], dvla:['dvla','driving'],
    suicide:['suicide','suicidal','self-harm','cssrs'], selfharm:['self-harm'], cssrs:['c-ssrs','suicide'], qbtest:['qbtest'], qb:['qbtest'], diva:['diva'], asrs:['asrs'], wfirs:['wfirs','impairment'], wurs:['wurs'], snap:['snap-iv'],
    nice:['nice','ng87'], ng87:['ng87','nice'], dsm:['dsm-5-tr','dsm'], icd:['icd-11','icd'], bnf:['bnf'], spc:['smpc','spc'], smpc:['smpc','spc'], mhra:['mhra'],
    kids:['child','children'], kid:['child'], child:['child','children'], teen:['adolescent','young'], adult:['adult','adults'], elderly:['older'], old:['older'], women:['women','girls','female'], girls:['girls','women','female'],
    dose:['dose','dosing','titrat'], doses:['dose','dosing'], weight:['weight'], appetite:['appetite'], sleep:['sleep','insomnia'], insomnia:['sleep','insomnia'], heart:['cardiac','heart','cardiovascular'], cardiac:['cardiac','cardiovascular','heart'],
    misuse:['misuse','diversion','substance'], pip:['prescriber','independent'], cdao:['accountable','controlled'], ssp:['shortage','protocol'], owing:['owing','owings'], diversion:['diversion','misuse'], drugs:['substance','drug'], alcohol:['alcohol','audit'], cannabis:['cannabis','substance'],
    shared:['shared','care'], review:['review','annual'], monitoring:['monitoring','monitor'], side:['adverse','side'], effects:['effects','adverse'], interaction:['interaction','interactions'], interactions:['interaction','interactions']
  };

  /* ---------- index ---------- */
  var IDX = null, VOCAB = null, seq = 0;
  function modInfo(sec){ var k = sec.querySelector('.kicker'); return {id: sec.id, title: sec.dataset.title || sec.id, kicker: k ? clean(k.textContent) : ''}; }
  function tid(el){ if(!el.id) el.id = 'sx-' + (++seq); return el.id; }
  function add(e){ e.tw = words(e.title); e.xw = words(e.text || ''); e.tn = norm(e.title); e.xn = norm(e.text || ''); IDX.push(e); }
  function textAfter(h){ var out = '', n = h.nextElementSibling; while(n && !/^H[1-4]$/.test(n.tagName) && out.length < 1500){ if(!n.matches('.quiz,.practice,script,noscript')) out += ' ' + n.textContent; n = n.nextElementSibling; } return clean(out); }
  function build(){
    IDX = [];
    $$('main .module').forEach(function(sec){
      var M = modInfo(sec); if(sec.id === 'home') return;
      var mt = M.kicker ? M.kicker + ' · ' + M.title : M.title;
      var intro = sec.querySelector('.mod-head p');
      add({type:'Section', title:M.title, ctx:M.kicker || 'Course', text: intro ? intro.textContent : '', go:{hash:M.id}});
      $$('.lesson', sec).forEach(function(ls, i){
        var h = ls.querySelector('.ls-h') || ls; var lt = ls.dataset.title || clean(h.textContent);
        if(/^recap/i.test(lt)) lt = lt + ': ' + M.title;
        add({type:'Lesson', title:lt, ctx: mt + ' › Lesson ' + (i + 1), text: clean(ls.textContent).slice(0, 2500), go:{hash: tid(h)}});
      });
      $$('h3, h4', sec).forEach(function(h){
        if(h.closest('.quiz,.flip,.ag-app,.fl,.takeaways h3')) return;
        var t = clean(h.textContent); if(!t || t.length > 120) return;
        var ls = h.closest('.lesson'); var where = mt + (ls ? ' › ' + ls.dataset.title : '');
        if(t.split(/\s+/).length <= 3) t = t + ' · ' + (ls ? ls.dataset.title : M.title);
        add({type:'Topic', title:t, ctx:where, text:textAfter(h), go:{hash: tid(h)}});
      });
      $$('.ev-group li > b, .risk-grid li > strong, .clin-c .clin-t, .mf-q, .tk-tool h4, .stat .stat-l, .takeaways li > strong', sec).forEach(function(b){
        var host = b.closest('li, .clin-c, .mf, .tk-tool, .stat') || b; var t = clean(b.textContent); if(!t || t.length > 110) return;
        var ls = b.closest('.lesson');
        add({type:'Key point', title:t, ctx: mt + (ls ? ' › ' + ls.dataset.title : ''), text: clean(host.textContent).slice(0, 600), go:{hash: tid(host)}});
      });
      $$('.flip', sec).forEach(function(f){
        var fr = f.querySelector('.front .ftxt'), bk = f.querySelector('.back .ftxt'); if(!fr) return;
        var pr = f.closest('.practice') || f;
        add({type:'Flashcard', title: clean(fr.textContent), ctx: mt + ' › Flashcards', text: bk ? clean(bk.textContent) : '', answer: bk ? clean(bk.textContent) : '', go:{hash: tid(pr), card: f}});
      });
    });
    /* practice questions, with the answer and explanation */
    var Q = window.QUIZ || {}, seen = {};
    Object.keys(Q).forEach(function(k){
      var mid = (k.match(/^(m\d+|ag|dx|sim|sp|exam|final)/) || [])[1]; var sec = mid && document.getElementById(mid); if(!sec) return;
      var M = modInfo(sec);
      (Q[k] || []).forEach(function(q){
        if(!q || !q.q || seen[q.q]) return; seen[q.q] = 1;
        var right = q.o && q.o[q.a] != null ? q.o[q.a] : '';
        var qz = sec.querySelector('.quiz[data-quiz="' + k + '"]') || sec.querySelector('.quiz');
        add({type:'Question', title: clean(q.q), ctx: (M.kicker ? M.kicker + ' · ' : '') + M.title + ' › Practice', text: right + ' ' + (q.e || ''), answer: right, why: q.e || '', go: qz ? {hash: tid(qz), quiz: qz} : {hash: M.id}});
      });
    });
    /* glossary */
    (window.GLOSS || []).forEach(function(g){ add({type:'Glossary', title:g.t, ctx:'Glossary', text:g.d, answer:g.d, go:{hash:'gloss'}}); });
    /* Assessment Guide steps (rendered one at a time, so indexed from their data) */
    (window.AGSTEPS || []).forEach(function(s){
      add({type:'Guide step', title:'Step ' + s.n + ': ' + s.t, ctx:'Section B · Assessment Guide', text: clean(s.s + ' ' + String(s.teach || '').replace(/<[^>]+>/g, ' ') + ' ' + (s.chk || []).join(' ')), go:{hash:'ag', ag: s.n}});
    });
    /* Standalone form library */
    (window.M3FORMS || []).forEach(function(g){ (g.forms || []).forEach(function(f){
      add({type:'Form', title: f.ab + ' (' + f.full + ')', ctx:'Form library', text: clean([f.use, f.what, f.score, f.watch, f.basis].join(' ')).replace(/<[^>]+>/g, ' '), go:{hash:'form-library', form: f.id}});
    }); });
    VOCAB = {}; IDX.forEach(function(e){ e.tw.concat(e.xw).forEach(function(w){ if(w.length > 2) VOCAB[w] = 1; }); });
    VOCAB = Object.keys(VOCAB);
  }

  /* ---------- matching ---------- */
  function lev(a, b, max){ if(Math.abs(a.length - b.length) > max) return max + 1; var p = [], c, i, j; for(j = 0; j <= b.length; j++) p[j] = j;
    for(i = 1; i <= a.length; i++){ c = [i]; var best = i; for(j = 1; j <= b.length; j++){ c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); if(c[j] < best) best = c[j]; } if(best > max) return max + 1; p = c; } return p[b.length]; }
  var fuzzyCache = {};
  function variants(tok){
    var v = [{w:tok, k:1}];
    (SYN[tok] || []).forEach(function(s){ words(s).forEach(function(w){ if(w !== tok) v.push({w:w, k:.9}); }); });
    if(tok.length > 3 && tok.slice(-1) === 's') v.push({w:tok.slice(0, -1), k:.95});
    if(tok.length >= 5){
      if(!fuzzyCache[tok]){ var max = tok.length >= 8 ? 2 : 1, out = [];
        for(var i = 0; i < VOCAB.length && out.length < 6; i++){ var w = VOCAB[i]; if(w !== tok && w[0] === tok[0] && lev(tok, w, max) <= max) out.push(w); }
        fuzzyCache[tok] = out; }
      fuzzyCache[tok].forEach(function(w){ v.push({w:w, k:.6}); });
    }
    return v;
  }
  var TYPEW = {Section:1.15, Lesson:1.2, Topic:1.15, 'Guide step':1.1, Form:1.15, Glossary:1.1, 'Key point':1, Flashcard:.95, Question:.85};
  function scoreEntry(e, groups, phrase){
    var total = 0, missing = 0;
    groups.forEach(function(g){
      var best = 0;
      g.forEach(function(v){
        var w = v.w, s = 0;
        if(e.tw.indexOf(w) >= 0) s = 12; else if(e.tw.some(function(t){ return t.indexOf(w) === 0; })) s = 8;
        else if(e.xw.indexOf(w) >= 0) s = 4; else if(w.length > 2 && e.xw.some(function(t){ return t.indexOf(w) === 0; })) s = 2.5;
        s *= v.k; if(s > best) best = s;
      });
      if(best) total += best; else missing++;
    });
    if(!total) return 0;
    if(missing) total *= Math.pow(.35, missing);
    if(phrase.length > 3){ if(e.tn.indexOf(phrase) >= 0) total += 15; else if(e.xn.indexOf(phrase) >= 0) total += 6; }
    if(e.type === 'Glossary' && e.tn === phrase) total += 25;
    return total * (TYPEW[e.type] || 1);
  }
  function search(q){
    if(!IDX) build();
    var toks = words(q); if(!toks.length) return [];
    var groups = toks.map(variants), phrase = norm(q).trim();
    var res = [];
    IDX.forEach(function(e){ var s = scoreEntry(e, groups, phrase); if(s > 3) res.push({e:e, s:s}); });
    res.sort(function(a, b){ return b.s - a.s; });
    /* keep variety: at most 4 practice questions and 3 flashcards in the top list */
    var out = [], cnt = {};
    for(var i = 0; i < res.length && out.length < 14; i++){ var t = res[i].e.type, lim = t === 'Question' ? 4 : t === 'Flashcard' ? 3 : 99; cnt[t] = (cnt[t] || 0) + 1; if(cnt[t] <= lim) out.push(res[i].e); }
    return {list:out, total:res.length, terms: groups.map(function(g){ return g.map(function(v){ return v.w; }); })};
  }

  /* ---------- UI ---------- */
  var wrap = document.createElement('div'); wrap.className = 'ss';
  wrap.innerHTML = '<button type="button" class="ss-open" aria-label="Search the course"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></button>'
    + '<div class="ss-box" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-owns="ss-list"><svg class="ss-ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>'
    + '<input type="search" class="ss-in" placeholder="Search the course: a drug, a form, a NICE rule…" aria-label="Search the course" aria-autocomplete="list" aria-controls="ss-list" autocomplete="off" spellcheck="false"><kbd class="ss-kbd">/</kbd><button type="button" class="ss-x" aria-label="Close search">×</button></div>'
    + '<div class="ss-drop" hidden><div class="ss-list" id="ss-list" role="listbox"></div><div class="ss-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div></div>';
  var spacer = bar.querySelector('.spacer'); bar.insertBefore(wrap, spacer ? spacer.nextSibling : null);
  var input = wrap.querySelector('.ss-in'), drop = wrap.querySelector('.ss-drop'), list = wrap.querySelector('.ss-list'), box = wrap.querySelector('.ss-box');
  var cur = -1, items = [], timer;
  var SUGGEST = ['ECG before stimulants','ASRS scoring','Titrating methylphenidate','Elvanse in older adults','Autism and ADHD','Driving and the DVLA','Pregnancy','PHQ-9 item 9','Shared care','Onset before 12'];
  function recent(){ try { return JSON.parse(localStorage.getItem('ss-recent') || '[]'); } catch(e){ return []; } }
  function remember(q){ try { var r = recent().filter(function(x){ return x !== q; }); r.unshift(q); localStorage.setItem('ss-recent', JSON.stringify(r.slice(0, 6))); } catch(e){} }
  function hl(text, terms){
    var t = esc(text); var flat = []; terms.forEach(function(g){ g.forEach(function(w){ if(w.length > 1) flat.push(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); }); });
    if(!flat.length) return t; flat.sort(function(a, b){ return b.length - a.length; });
    return t.replace(new RegExp('\\b(' + flat.join('|') + ')', 'gi'), '<mark>$1</mark>');
  }
  function snippet(e, terms){
    var tx = e.answer && e.type !== 'Question' ? e.answer : (e.text || ''); if(!tx) return '';
    var low = norm(tx), at = -1; terms.some(function(g){ return g.some(function(w){ var i = low.indexOf(w); if(i >= 0){ at = i; return true; } return false; }); });
    var st = Math.max(0, at - 60), s = tx.slice(st, st + 170); return (st > 0 ? '…' : '') + s + (st + 170 < tx.length ? '…' : '');
  }
  var ICON = {Section:'S', Lesson:'L', Topic:'T', 'Key point':'K', Flashcard:'F', Question:'Q', Glossary:'G', 'Guide step':'A', Form:'F'};
  function renderList(q){
    items = []; cur = -1;
    if(!q.trim()){
      var r = recent(), h = '';
      if(r.length) h += '<p class="ss-hd">Recent</p><div class="ss-chips">' + r.map(function(x){ return '<button type="button" class="ss-chip">' + esc(x) + '</button>'; }).join('') + '</div>';
      h += '<p class="ss-hd">Try</p><div class="ss-chips">' + SUGGEST.map(function(x){ return '<button type="button" class="ss-chip">' + esc(x) + '</button>'; }).join('') + '</div>';
      list.innerHTML = h; return;
    }
    var R = search(q);
    if(!R.list || !R.list.length){ list.innerHTML = '<p class="ss-none">No matches for “' + esc(q) + '”. Try a drug, a form name, a NICE clause or a symptom.</p>'; return; }
    var top = R.list[0], h = '';
    if((top.type === 'Glossary' || top.type === 'Flashcard') && R.list.length){
      h += '<div class="ss-answer"><span class="ss-t ss-' + top.type.replace(/\s/g, '') + '">' + (top.type === 'Glossary' ? 'Definition' : 'Quick answer') + '</span><b>' + esc(top.title) + '</b><p>' + esc(top.answer) + '</p></div>';
    }
    h += '<p class="ss-hd">' + R.total + ' result' + (R.total === 1 ? '' : 's') + (R.total > R.list.length ? ' · best ' + R.list.length + ' shown' : '') + '</p>';
    R.list.forEach(function(e, i){
      items.push(e);
      var extra = e.type === 'Question' && e.answer ? '<span class="ss-ans"><b>Answer:</b> ' + esc(e.answer) + '</span>' : '';
      h += '<div class="ss-it" role="option" id="ss-o' + i + '" data-i="' + i + '" aria-selected="false"><span class="ss-ic ss-' + e.type.replace(/\s/g, '') + '" aria-hidden="true">' + ICON[e.type] + '</span><span class="ss-bd"><span class="ss-tl">' + hl(e.title, R.terms) + '<span class="ss-t ss-' + e.type.replace(/\s/g, '') + '">' + e.type + '</span></span><span class="ss-ctx">' + esc(e.ctx) + '</span><span class="ss-sn">' + hl(snippet(e, R.terms), R.terms) + '</span>' + extra + '</span></div>';
    });
    list.innerHTML = h;
  }
  function openDrop(){ drop.hidden = false; box.setAttribute('aria-expanded', 'true'); wrap.classList.add('open'); if(!IDX) build(); renderList(input.value); }
  function closeDrop(){ drop.hidden = true; box.setAttribute('aria-expanded', 'false'); wrap.classList.remove('open'); cur = -1; }
  function move(d){ var els = $$('.ss-it', list); if(!els.length) return; cur = (cur + d + els.length) % els.length; els.forEach(function(el, i){ el.setAttribute('aria-selected', i === cur ? 'true' : 'false'); }); els[cur].scrollIntoView({block:'nearest'}); input.setAttribute('aria-activedescendant', els[cur].id); }
  function flash(el){ if(!el) return; el.classList.remove('ss-flash'); void el.offsetWidth; el.classList.add('ss-flash'); setTimeout(function(){ el.classList.remove('ss-flash'); }, 2400); }
  function goTo(e){
    remember(input.value.trim()); closeDrop(); input.blur();
    var g = e.go || {};
    if(g.ag){ location.hash = 'ag'; setTimeout(function(){ if(window.__agGo) window.__agGo(g.ag); }, 60); return; }
    if(g.form){ location.hash = 'form-library'; setTimeout(function(){ if(window.__m3form) window.__m3form(g.form); var p = document.querySelector('#form-library .fl-panel[data-form="' + g.form + '"]'); flash(p); }, 60); return; }
    var el = document.getElementById(g.hash);
    /* open the practice tab that holds the flashcard or quiz, and show that flashcard */
    var inner = g.card || g.quiz;
    if(inner){ var pnl = inner.closest('.pr-panel'), pr = inner.closest('.practice');
      if(pnl && pr){ var idx = $$('.pr-panel', pr).indexOf(pnl), tab = $$('.pr-tab', pr)[idx]; if(tab && tab.getAttribute('aria-selected') !== 'true') tab.click(); }
      if(g.card){ var deck = g.card.closest('[data-deck]'); if(deck && g.card.hidden){ var cards = $$('.flip', deck), want = cards.indexOf(g.card), nav = deck.nextElementSibling, nx = nav && nav.querySelector('.js-dnext'); for(var k = 0; k < cards.length && g.card.hidden && nx; k++) nx.click(); } } }
    if(location.hash === '#' + g.hash){ window.dispatchEvent(new HashChangeEvent('hashchange')); } else location.hash = g.hash;
    setTimeout(function(){ flash(g.card || el); }, 120);
  }
  input.addEventListener('focus', openDrop);
  input.addEventListener('input', function(){ clearTimeout(timer); timer = setTimeout(function(){ renderList(input.value); }, 90); });
  input.addEventListener('keydown', function(e){
    if(e.key === 'ArrowDown'){ e.preventDefault(); move(1); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); move(-1); }
    else if(e.key === 'Enter'){ e.preventDefault(); var t = items[cur >= 0 ? cur : 0]; if(t) goTo(t); }
    else if(e.key === 'Escape'){ closeDrop(); input.blur(); }
  });
  list.addEventListener('mousedown', function(e){ e.preventDefault(); });
  list.addEventListener('click', function(e){
    var it = e.target.closest('.ss-it'); if(it){ goTo(items[+it.dataset.i]); return; }
    var c = e.target.closest('.ss-chip'); if(c){ input.value = c.textContent; renderList(input.value); input.focus(); }
  });
  wrap.querySelector('.ss-open').addEventListener('click', function(){ wrap.classList.add('mob'); input.focus(); });
  wrap.querySelector('.ss-x').addEventListener('click', function(){ input.value = ''; closeDrop(); wrap.classList.remove('mob'); });
  document.addEventListener('click', function(e){ if(!wrap.contains(e.target)){ closeDrop(); wrap.classList.remove('mob'); } });
  document.addEventListener('keydown', function(e){
    var t = e.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    if((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K'))){ e.preventDefault(); wrap.classList.add('mob'); input.focus(); input.select(); }
  });
})();
