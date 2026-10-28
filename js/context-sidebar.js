/* Context-aware course navigation: inside a module, the sidebar becomes its lesson menu. */
(function(){
  'use strict';

  var nav = document.querySelector('nav.sidebar');
  var courseMenu = document.getElementById('sb-list');
  var toggle = nav && nav.querySelector('.sb-toggle');
  var mobileToggle = document.querySelector('.menu-btn');
  var main = document.getElementById('main');
  if(!nav || !courseMenu || !main) return;

  var context = document.createElement('div');
  context.className = 'sb-context';
  context.id = 'sb-context';
  context.hidden = true;
  courseMenu.insertAdjacentElement('afterend', context);

  var pending = false;
  var activeModule = null;

  function sourceLink(id){
    var links = courseMenu.querySelectorAll('a[href^="#"]');
    for(var i=0;i<links.length;i++) if(links[i].getAttribute('href') === '#'+id) return links[i];
    return null;
  }

  function moduleBadge(module){
    var link = sourceLink(module.id);
    var n = link && link.querySelector('.num');
    return n ? n.textContent.trim() : module.id.replace(/^m/, '').toUpperCase();
  }

  function moduleLabel(badge){
    if(/^\d+[A-Z]$/.test(badge)) return 'Module '+badge.slice(0,-1)+' · Section '+badge.slice(-1);
    return /^\d+$/.test(badge) ? 'Module '+badge : (/^[A-Z]$/.test(badge) ? 'Section '+badge : 'Course section');
  }

  function lessonState(box){
    var lessons = Array.prototype.slice.call(box.querySelectorAll(':scope > .lesson'));
    var current = -1;
    lessons.forEach(function(lesson, i){ if(!lesson.hidden) current = i; });
    var generated = box.querySelectorAll('.ls-menu button[data-i]');
    var done = {};
    Array.prototype.forEach.call(generated, function(button){
      var i = +button.dataset.i;
      if(i >= 0 && button.classList.contains('done')) done[i] = true;
    });
    return {lessons:lessons, current:current, done:done};
  }

  function closeMobileMenu(){
    nav.classList.remove('open');
    if(mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
  }

  function resetNavScroll(){
    nav.scrollTop = 0;
    requestAnimationFrame(function(){ nav.scrollTop = 0; });
  }

  courseMenu.addEventListener('click', function(event){
    if(event.target.closest('a[href^="#"]')) closeMobileMenu();
  });

  function openLesson(box, index){
    var trigger = box.querySelector('.ls-menu button[data-i="'+index+'"]');
    if(trigger) trigger.click();
    else if(index >= 0 && window.__lessonReveal){
      var lessons = box.querySelectorAll(':scope > .lesson');
      if(lessons[index]) window.__lessonReveal(lessons[index]);
    }
    closeMobileMenu();
    schedule();
  }

  function showCourseMenu(){
    var menuChanged = activeModule !== null;
    activeModule = null;
    context.hidden = true;
    context.replaceChildren();
    courseMenu.hidden = false;
    nav.setAttribute('aria-label', 'Course modules');
    if(toggle) toggle.setAttribute('aria-controls', 'sb-list');
    if(menuChanged) resetNavScroll();
  }

  function showModuleMenu(module){
    var box = module.querySelector('[data-lessons]');
    if(!box) { showCourseMenu(); return; }
    var state = lessonState(box);
    if(!state.lessons.length) { showCourseMenu(); return; }

    var moduleChanged = !activeModule || activeModule.id !== module.id;
    activeModule = module;
    var badge = moduleBadge(module);
    var doneCount = Object.keys(state.done).length;
    var position = state.current < 0 ? 'Overview' : 'Lesson '+(state.current+1)+' of '+state.lessons.length;

    courseMenu.hidden = true;
    context.hidden = false;
    nav.setAttribute('aria-label', module.dataset.title+' lessons');
    if(toggle) toggle.setAttribute('aria-controls', 'sb-context');
    context.replaceChildren();

    var back = document.createElement('a');
    back.className = 'sb-context-back';
    back.href = '#home';
    back.innerHTML = '<span class="sb-back-ic" aria-hidden="true">←</span><span class="sb-back-label">All modules</span>';
    back.addEventListener('click', closeMobileMenu);
    context.appendChild(back);

    var start = document.createElement('a');
    start.className = 'sb-context-back sb-context-start';
    start.href = 'adhd-assessment/index.html#new';
    start.innerHTML = '<span class="sb-back-ic" aria-hidden="true">+</span><span class="sb-back-label">Start an assessment</span>';
    context.appendChild(start);

    var head = document.createElement('div');
    head.className = 'sb-context-head';
    head.innerHTML = '<span class="sb-context-num">'+badge+'</span><span class="sb-context-meta"><span class="sb-context-kicker">'+moduleLabel(badge)+'</span><strong class="sb-context-title"></strong><span class="sb-context-progress"></span></span>';
    head.querySelector('.sb-context-title').textContent = module.dataset.title;
    head.querySelector('.sb-context-progress').textContent = position+' · '+doneCount+'/'+state.lessons.length+' complete';
    context.appendChild(head);

    var rule = document.createElement('div');
    rule.className = 'sb-context-rule';
    context.appendChild(rule);

    var list = document.createElement('ol');
    list.className = 'sb-context-list';
    list.setAttribute('aria-label', module.dataset.title+' lesson menu');

    function addItem(index, title, minutes, isDone){
      var item = document.createElement('li');
      var button = document.createElement('button');
      var current = index === state.current;
      button.type = 'button';
      button.dataset.i = index;
      button.classList.toggle('done', !!isDone);
      button.setAttribute('aria-current', current ? 'step' : 'false');
      button.title = index < 0 ? 'Module overview' : 'Lesson '+(index+1)+': '+title;
      var number = index < 0 ? 'i' : String(index+1);
      var status = current ? 'Current' : (isDone ? 'Completed' : (index < 0 ? 'Start here' : 'Not completed'));
      button.setAttribute('aria-label', (index < 0 ? 'Module overview' : 'Lesson '+(index+1)+': '+title)+', '+status+(minutes ? ', '+minutes+' minutes' : ''));
      button.innerHTML = '<span class="sb-lesson-num">'+number+'</span><span class="sb-lesson-copy"><span class="sb-lesson-title"></span><span class="sb-lesson-state">'+status+'</span></span>'+(minutes ? '<span class="sb-lesson-time">'+minutes+' min</span>' : '');
      button.querySelector('.sb-lesson-title').textContent = title;
      button.addEventListener('click', function(){ openLesson(box, index); });
      item.appendChild(button);
      list.appendChild(item);
    }

    addItem(-1, 'Overview', '', false);
    state.lessons.forEach(function(lesson, index){
      addItem(index, lesson.dataset.title || 'Lesson '+(index+1), lesson.dataset.min || '', state.done[index]);
    });
    context.appendChild(list);
    if(moduleChanged) resetNavScroll();
  }

  function currentModule(){
    return main.querySelector('.module.active') || document.getElementById('home');
  }

  function sync(){
    pending = false;
    var module = currentModule();
    if(!module || module.id === 'home' || !module.querySelector('[data-lessons]')) showCourseMenu();
    else showModuleMenu(module);
  }

  function schedule(){
    if(pending) return;
    pending = true;
    requestAnimationFrame(sync);
  }

  window.addEventListener('hashchange', schedule);
  window.addEventListener('load', resetNavScroll);
  new MutationObserver(function(records){
    for(var i=0;i<records.length;i++){
      var target = records[i].target;
      if(target.classList && (target.classList.contains('module') || target.classList.contains('lesson') || target.classList.contains('ls-seg') || target.matches('.ls-menu button[data-i]'))){ schedule(); return; }
    }
  }).observe(main, {subtree:true, attributes:true, attributeFilter:['class','hidden']});

  /* Collapsed rail: show each item's name in a label beside it on hover or keyboard focus. */
  var tip = document.createElement('div');
  tip.className = 'sb-tip';
  tip.hidden = true;
  tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);
  function tipName(el){
    if(el.classList.contains('sb-context-start')) return 'Start an assessment';
    if(el.classList.contains('sb-context-back')) return 'All modules';
    if(el.classList.contains('sb-context-head')) return el.querySelector('.sb-context-title').textContent;
    var t = el.querySelector('.sb-lesson-title');
    if(t) return (el.dataset.i < 0 ? '' : 'Lesson '+(+el.dataset.i+1)+': ')+t.textContent;
    return el.title || el.textContent.trim();
  }
  function showTip(event){
    var el = event.target.closest && event.target.closest('a, button, .sb-context-head');
    if(!el || !nav.contains(el) || el.classList.contains('sb-toggle') || !document.documentElement.classList.contains('sb-collapsed')){ tip.hidden = true; return; }
    var r = el.getBoundingClientRect();
    tip.textContent = tipName(el);
    tip.style.left = (nav.getBoundingClientRect().right + 8)+'px';
    tip.style.top = (r.top + r.height/2)+'px';
    tip.hidden = false;
  }
  function hideTip(){ tip.hidden = true; }
  nav.addEventListener('mouseover', showTip);
  nav.addEventListener('focusin', showTip);
  nav.addEventListener('mouseleave', hideTip);
  nav.addEventListener('focusout', hideTip);
  nav.addEventListener('scroll', hideTip);
  nav.addEventListener('click', hideTip);

  sync();
})();
