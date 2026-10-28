/* Also wraps each table in a horizontal scroller so tables fill the width when they fit and scroll when they do not.
   Figure zoom: on narrow screens, each static teaching figure (svg.ag-svg) gets an "Enlarge figure" button
   that opens it full-screen at a readable size (scroll sideways or pinch to zoom). */
(function(){'use strict';
var MQ=window.matchMedia?window.matchMedia('(max-width:759px)'):{matches:false},last=null;
function add(s){if(!s.isConnected||!s.parentNode||s.closest('#ag-app .ag-vis, #ag-app .ag-fig, #sp .ag-fig, .ag-image-dialog'))return;if(s.__fz)return;s.__fz=1;if(s.querySelector('a,[tabindex],button'))return;var b=document.createElement('button');b.type='button';b.className='fz-btn';b.innerHTML='<span aria-hidden="true">\u2922</span> Enlarge figure';b.setAttribute('aria-label','Enlarge figure: '+(s.getAttribute('aria-label')||'diagram'));b.__svg=s;s.parentNode.insertBefore(b,s.nextSibling);}
function wrapT(t){if(t.__tw)return;t.__tw=1;var p=t.parentElement;if(!p||p.classList.contains('table-wrap')||p.classList.contains('tbl-sc')||!t.closest('main'))return;var w=document.createElement('div');w.className='tbl-sc';p.insertBefore(w,t);w.appendChild(t);}
function scan(r){r=r||document;if(!r.querySelectorAll)return;r.querySelectorAll('svg.ag-svg').forEach(add);r.querySelectorAll('table').forEach(wrapT);}
function open(s){last=document.activeElement;var ov=document.createElement('div');ov.className='fz-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label',s.getAttribute('aria-label')||'Figure');
 ov.innerHTML='<div class="fz-bar"><p class="fz-t"></p><button type="button" class="fz-x">Close</button></div><div class="fz-sc" tabindex="0"></div><p class="fz-h">Scroll sideways or pinch to zoom. The text beside the figure in the module explains it.</p>';
 ov.querySelector('.fz-t').textContent=s.getAttribute('aria-label')||'Figure';var c=s.cloneNode(true);c.classList.add('fz-svg');ov.querySelector('.fz-sc').appendChild(c);
 document.body.appendChild(ov);document.documentElement.classList.add('fz-lock');ov.querySelector('.fz-x').focus();
 function close(){ov.remove();document.documentElement.classList.remove('fz-lock');document.removeEventListener('keydown',kd);if(last&&last.focus)last.focus();}
 function kd(e){if(e.key==='Escape')close();if(e.key==='Tab'){e.preventDefault();var f=[ov.querySelector('.fz-x'),ov.querySelector('.fz-sc')],i=f.indexOf(document.activeElement);f[(i+(e.shiftKey?f.length-1:1))%f.length].focus();}}
 ov.querySelector('.fz-x').addEventListener('click',close);ov.addEventListener('click',function(e){if(e.target===ov)close();});document.addEventListener('keydown',kd);}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.fz-btn');if(b&&b.__svg){open(b.__svg);return;}
 var s=e.target.closest&&e.target.closest('svg.ag-svg');if(s&&MQ.matches&&s.__fz&&!e.target.closest('a,button,[tabindex]')&&s.nextSibling&&s.nextSibling.classList&&s.nextSibling.classList.contains('fz-btn'))open(s);});
function start(){scan();new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;if(n.matches&&n.matches('svg.ag-svg'))add(n);else if(n.matches&&n.matches('table'))wrapT(n);else scan(n);});});}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
