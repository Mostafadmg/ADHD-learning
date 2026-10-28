/* Standalone Form Library workspace. Its explorer is independent of the lesson,
   sharing the catalogue renderer and the Assessment workspace scoring engine. */
(function(){
  'use strict';

  var page = document.getElementById('form-library');
  var source = page && page.querySelector('[data-formlib]');
  if(!page || !source) return;

  /* Surface the tool in the permanent course menu and on the home workspace
     card. These are injected because the original navigation is deliberately
     kept as a single compact HTML line. */
  var courseMenu = document.getElementById('sb-list');
  if(courseMenu && !courseMenu.querySelector('a[href="#form-library"]')){
    var heads = courseMenu.querySelectorAll('.navhead');
    var workspaceHead = null;
    Array.prototype.forEach.call(heads, function(head){
      if(head.textContent.trim() === 'Clinician workspace') workspaceHead = head;
    });
    if(workspaceHead){
      var item = document.createElement('li');
      item.className = 'sb-form-library';
      item.innerHTML = '<a href="#form-library"><span class="num ico"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12h6M9 16h6"/></svg></span>Form library</a>';
      workspaceHead.insertAdjacentElement('afterend', item);
    }
  }
  var homeActions = document.querySelector('#home .ws-start .ws-btns');
  if(homeActions && !homeActions.querySelector('a[href="#form-library"]')){
    var homeLink = document.createElement('a');
    homeLink.className = 'btn secondary';
    homeLink.href = '#form-library';
    homeLink.textContent = 'Open form library';
    homeActions.appendChild(homeLink);
  }

  var tabs = Array.prototype.slice.call(source.querySelectorAll('.fl-tab'));
  var groups = Array.prototype.slice.call(source.querySelectorAll('.flp-col'));
  var panels = source.querySelector('.fl-panels');
  var search = page.querySelector('[data-fl-search]');
  var groupSelect = page.querySelector('[data-fl-group]');
  var tierSelect = page.querySelector('[data-fl-tier]');
  var count = page.querySelector('[data-fl-count]');
  var empty = page.querySelector('[data-fl-empty]');
  var filterButton = page.querySelector('[data-fl-filter]');
  var filterPanel = page.querySelector('[data-fl-filter-panel]');
  var scrim = page.querySelector('.flx-detail-scrim');
  var lastTrigger = null;

  var close = document.createElement('button');
  close.type = 'button';
  close.className = 'flx-detail-close';
  close.setAttribute('aria-label', 'Close form details');
  close.innerHTML = '<span aria-hidden="true">×</span><span>Back to forms</span>';
  if(panels) panels.insertBefore(close, panels.firstChild);

  var haystacks = new Map();
  tabs.forEach(function(tab){
    var panel = source.querySelector('.fl-panel[data-form="'+tab.dataset.form+'"]');
    haystacks.set(tab, (tab.textContent+' '+(panel ? panel.textContent : '')).toLowerCase().replace(/\s+/g,' '));
  });

  function normalise(value){ return (value || '').toLowerCase().trim().replace(/\s+/g,' '); }
  function applyFilters(){
    var query = normalise(search && search.value);
    var group = groupSelect ? groupSelect.value : 'all';
    var tier = tierSelect ? tierSelect.value : 'all';
    var visible = 0;

    tabs.forEach(function(tab){
      var holder = tab.closest('.flp-col');
      var groupOk = group === 'all' || (holder && holder.dataset.flGroup === group);
      var tierOk = tier === 'all' || tab.dataset.flTier === tier;
      var textOk = !query || haystacks.get(tab).indexOf(query) !== -1;
      var show = groupOk && tierOk && textOk;
      tab.hidden = !show;
      if(show) visible++;
    });
    groups.forEach(function(holder){
      holder.hidden = !holder.querySelector('.fl-tab:not([hidden])');
    });
    var selected = source.querySelector('.fl-tab[aria-selected="true"]');
    if(visible && (!selected || selected.hidden)){
      var firstVisible = tabs.find(function(tab){ return !tab.hidden; });
      if(firstVisible && window.formLibraryExplorer) window.formLibraryExplorer.select(firstVisible.dataset.form);
    }
    if(count) count.textContent = visible+' '+(visible === 1 ? 'form' : 'forms');
    if(empty) empty.hidden = visible !== 0;
    page.classList.toggle('flx-no-results', visible === 0);
    var active = !!query || group !== 'all' || tier !== 'all';
    if(filterButton) filterButton.classList.toggle('is-active', group !== 'all' || tier !== 'all');
    page.classList.toggle('flx-filtering', active);
  }

  function clearFilters(){
    if(search) search.value = '';
    if(groupSelect) groupSelect.value = 'all';
    if(tierSelect) tierSelect.value = 'all';
    applyFilters();
    if(search) search.focus();
  }
  /* External links must reveal their target even after a previous search. */
  window.__formLibraryReveal=function(id){
    if(search)search.value='';
    if(groupSelect)groupSelect.value='all';
    if(tierSelect)tierSelect.value='all';
    applyFilters();
    window.formLibraryExplorer.select(id,false);
  };

  function setFilterOpen(open){
    if(!filterPanel || !filterButton) return;
    filterPanel.hidden = !open;
    filterButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function isDrawer(){ return window.matchMedia('(max-width: 1180px)').matches; }
  function syncPanelAccess(){
    if(!panels) return;
    var offscreen = isDrawer() && !page.classList.contains('flx-detail-open');
    panels.inert = offscreen;
    if(offscreen) panels.setAttribute('aria-hidden','true');
    else panels.removeAttribute('aria-hidden');
  }
  function openDetail(){
    if(!isDrawer()) return;
    page.classList.add('flx-detail-open');
    if(scrim) scrim.hidden = false;
    syncPanelAccess();
    setTimeout(function(){ close.focus({preventScroll:true}); }, 20);
  }
  function closeDetail(restoreFocus){
    var focusBack = restoreFocus !== false ? (lastTrigger || search) : null;
    if(focusBack && document.contains(focusBack)) focusBack.focus({preventScroll:true});
    page.classList.remove('flx-detail-open');
    if(scrim) scrim.hidden = true;
    syncPanelAccess();
  }
  window.__formLibraryOpen = openDetail;

  if(search) search.addEventListener('input', applyFilters);
  if(groupSelect) groupSelect.addEventListener('change', applyFilters);
  if(tierSelect) tierSelect.addEventListener('change', applyFilters);
  page.querySelectorAll('[data-fl-clear]').forEach(function(button){ button.addEventListener('click', clearFilters); });
  if(filterButton) filterButton.addEventListener('click', function(){ setFilterOpen(filterPanel.hidden); });
  close.addEventListener('click', function(){ closeDetail(true); });
  if(scrim) scrim.addEventListener('click', function(){ closeDetail(true); });
  source.addEventListener('click', function(event){ var card = event.target.closest('.fl-tab'); if(card){ lastTrigger = card; openDetail(); } });

  document.addEventListener('click', function(event){
    if(filterPanel && !filterPanel.hidden && !event.target.closest('.flx-filter-wrap')) setFilterOpen(false);
  });
  document.addEventListener('keydown', function(event){
    if(event.key !== 'Escape') return;
    if(filterPanel && !filterPanel.hidden){ setFilterOpen(false); filterButton.focus(); }
    else if(page.classList.contains('flx-detail-open')) closeDetail(true);
  });
  window.addEventListener('resize', function(){ if(!isDrawer()) closeDetail(false); else syncPanelAccess(); });

  function syncRoute(){
    var id = location.hash.slice(1);
    var hashTarget = id && document.getElementById(id);
    var active = id === 'form-library' || !!(hashTarget && hashTarget.closest && hashTarget.closest('#form-library'));
    document.documentElement.classList.toggle('form-library-route', active);
    var navLink = document.querySelector('#sb-list a[href="#form-library"]');
    if(navLink && active) navLink.setAttribute('aria-current','page');
    if(!active) closeDetail(false);
  }
  window.addEventListener('hashchange', syncRoute);
  syncPanelAccess();
  syncRoute();
  applyFilters();
})();
