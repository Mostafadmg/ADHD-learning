/* Accessible enlargement for Assessment Guide, Special presentations and Module 4 visuals. */
(function(){
'use strict';
var selector='#ag-app .ag-vis > svg, #ag-app .ag-vis > picture, #ag-app .ag-fig > svg, #sp .ag-fig > svg, #sp .sp-ai-figure > picture, #m4 figure.wt .overlay-fig > picture, #m4 .ag-zoom-trigger > picture';
function add(art){
 var img=art.matches('picture')?art.querySelector('img'):art;
 if(!img || art.querySelector('a,button,[tabindex]'))return;
 var label=img.getAttribute('aria-label')||img.getAttribute('alt')||'Assessment teaching figure';
 var existing=art.closest('.ag-zoom-trigger');
 if(existing){if(art.closest('#m4'))existing.setAttribute('aria-label','Enlarge image: '+label);return;}
 var button=document.createElement('button');button.type='button';button.className='ag-zoom-trigger';
 button.setAttribute('aria-label','Enlarge image: '+label);button.setAttribute('aria-haspopup','dialog');
 art.parentNode.insertBefore(button,art);button.appendChild(art);
 if(art.closest('#m4')){button.title='Enlarge this step’s illustration';return;}
 var hint=document.createElement('span');hint.className='ag-zoom-hint';hint.textContent='⤢ Enlarge image';hint.setAttribute('aria-hidden','true');button.appendChild(hint);
}
function scan(){document.querySelectorAll(selector).forEach(add);}
function open(button){
 if(document.querySelector('.ag-image-dialog'))return;
 var original=button.querySelector('svg,img'),figure=button.closest('figure'),caption=figure&&figure.querySelector('figcaption');
 var walkthroughStep=button.closest('#m4')&&figure&&figure.querySelector('ol.walk li.cur');
 /* During a cross-fade the incoming image already belongs to the selected step. */
 if(walkthroughStep)original=button.querySelector('img.wt-fade')||original;
 var label=original.getAttribute('aria-label')||original.getAttribute('alt')||'Assessment teaching figure';
 var dialog=document.createElement('dialog');dialog.className='ag-image-dialog';dialog.setAttribute('aria-labelledby','ag-image-title');
 if(button.closest('#sp,.ag-ai-portrait'))dialog.classList.add('sp-image-dialog');
 dialog.innerHTML='<div class="ag-image-head"><h2 id="ag-image-title"></h2><button type="button" class="btn secondary ag-image-zoom" aria-pressed="false">Zoom in</button><button type="button" class="btn ag-image-close" autofocus>Close</button></div><div class="ag-image-scroll" tabindex="0" role="region" aria-label="Enlarged image; scroll when zoomed"><div class="ag-image-art"></div></div><p class="ag-image-caption"></p>';
 dialog.querySelector('h2').textContent=original.matches('svg')?label:(figure&&figure.dataset.title||'Assessment illustration');
 if(walkthroughStep)dialog.querySelector('h2').textContent='Module 4 · '+((walkthroughStep.querySelector('b,strong')||walkthroughStep).textContent);
 var copy=original.cloneNode(true);copy.removeAttribute('width');copy.removeAttribute('height');copy.removeAttribute('tabindex');
 if(walkthroughStep){copy.classList.remove('wt-fade');copy.removeAttribute('aria-hidden');copy.alt='AI-generated teaching illustration: '+walkthroughStep.textContent;}
 if(copy.matches('img')){copy.src=original.currentSrc||original.src;copy.removeAttribute('srcset');copy.loading='eager';}
 /* Legacy SVG charts have local paint IDs: isolate them from the page copy. */
 var ids={};copy.querySelectorAll('[id]').forEach(function(n){ids[n.id]='ag-modal-'+n.id;n.id=ids[n.id];});
 [copy].concat(Array.from(copy.querySelectorAll('*'))).forEach(function(n){Array.from(n.attributes||[]).forEach(function(a){var value=a.value;Object.keys(ids).forEach(function(id){value=value.split('url(#'+id+')').join('url(#'+ids[id]+')');if(value==='#'+id)value='#'+ids[id];});if(value!==a.value)n.setAttribute(a.name,value);});});
 dialog.querySelector('.ag-image-art').appendChild(copy);
 dialog.querySelector('.ag-image-caption').textContent=caption?caption.textContent:(original.querySelector('desc')||{}).textContent||label;
 if(walkthroughStep)dialog.querySelector('.ag-image-caption').textContent=walkthroughStep.textContent+' AI-generated teaching illustration, not a real patient.';
 document.body.appendChild(dialog);document.documentElement.classList.add('ag-image-lock');
 dialog.querySelector('.ag-image-close').addEventListener('click',function(){dialog.close();});
 dialog.addEventListener('keydown',function(ev){
  if(ev.key==='Escape'){ev.preventDefault();ev.stopPropagation();dialog.close();}
  if(ev.key==='Tab'){var focusable=Array.from(dialog.querySelectorAll('button,[tabindex="0"]')),i=focusable.indexOf(document.activeElement);ev.preventDefault();focusable[(i+(ev.shiftKey?focusable.length-1:1))%focusable.length].focus();}
 });
 dialog.querySelector('.ag-image-zoom').addEventListener('click',function(){var zoomed=dialog.classList.toggle('is-zoomed');this.setAttribute('aria-pressed',String(zoomed));this.textContent=zoomed?'Fit image':'Zoom in';});
 dialog.addEventListener('click',function(ev){if(ev.target!==dialog)return;var r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)dialog.close();});
 dialog.addEventListener('close',function(){dialog.remove();document.documentElement.classList.remove('ag-image-lock');if(button.isConnected)button.focus({preventScroll:true});},{once:true});
 dialog.showModal();
}
document.addEventListener('click',function(ev){var button=ev.target.closest('.ag-zoom-trigger');if(button)open(button);});
function start(){scan();var queued=false,observer=new MutationObserver(function(){if(queued)return;queued=true;queueMicrotask(function(){queued=false;scan();});});document.querySelectorAll('#ag-app,#sp,#m4').forEach(function(root){observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['alt']});});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
