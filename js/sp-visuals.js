/* Section E: scalable teaching diagrams, not diagnostic instruments. */
(function(){
'use strict';
var navy='#16324f',teal='#0b6664',coral='#a8432e';
function esc(s){return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
function t(x,y,s,size,color,weight){return '<text x="'+x+'" y="'+y+'" font-size="'+(size||24)+'" fill="'+(color||navy)+'" font-weight="'+(weight||500)+'">'+esc(s)+'</text>';}
function lines(x,y,a,size,color){return a.map(function(s,i){return t(x,y+i*(size+9),s,size,color);}).join('');}
function rect(x,y,w,h,fill,stroke){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="16" fill="'+fill+'" stroke="'+(stroke||'none')+'" stroke-width="2"/>';}
function card(x,y,w,h,title,body,color){return '<g data-card="'+[x,y,w,h].join(',')+'">'+rect(x,y,w,h,'#fff','#cbdee4')+t(x+20,y+34,title,25,color,700)+lines(x+20,y+68,body,23)+'</g>';}
function frame(title,sub,h,body,desc){return '<svg class="ag-svg lab-svg sp-explainer" viewBox="0 0 800 '+h+'" role="img" aria-label="'+esc(title)+'" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif"><title>'+esc(title)+'</title><desc>'+esc(desc)+'</desc>'+rect(0,0,800,h,'#f3f8fa')+'<path d="M16 0H784Q800 0 800 16V108H0V16Q0 0 16 0" fill="'+navy+'"/>'+t(28,47,title,34,'#fff',750)+t(28,83,sub,23,'#d4e7ef')+body+'</svg>';}
window.SPVIS={
mask:function(){
 var b=t(28,150,'WHAT OTHERS MAY SEE',23,teal,750);
 b+=card(28,172,306,154,'Looks organised',['Planner filled in;','work handed in;','good or average marks.'],teal);
 b+=card(466,172,306,154,'Seems to cope',['Quiet in class;','polite and cooperative;','difficulties go unnoticed.'],teal);
 b+='<path d="M344 360L400 206L456 360Z" fill="#fff" stroke="'+teal+'" stroke-width="3"/>'+t(365,340,'Seen',22,teal,700);
 b+='<path d="M0 360Q100 344 200 360T400 360T600 360T800 360V810H0Z" fill="#dceef2"/><path d="M0 360Q100 344 200 360T400 360T600 360T800 360" fill="none" stroke="'+teal+'" stroke-width="3"/>';
 b+='<path d="M344 363L286 744L522 770L456 363Z" fill="#f4fbfd" stroke="#79a9ba" stroke-width="2"/><path d="M400 373L349 706L463 717Z" fill="#c7e3eb"/>';
 b+=t(28,402,'WHAT MAY BE HIDDEN',23,coral,750);
 b+=card(28,425,342,146,'Difficulties',['Losing track; daydreaming;','needing repeated reminders.'],coral);
 b+=card(430,497,342,146,'Compensation',['Lists, alarms and checking;','hours of extra preparation.'],teal);
 b+=card(28,603,342,154,'Personal cost',['Late-night catch-up;','lost sleep and exhaustion;','anxiety or low self-esteem.'],coral);
 b+='<path d="M370 494H394 M430 570H413 M370 676H395" stroke="#557f93" stroke-width="3" stroke-linecap="round"/>';
 b+=rect(24,832,752,150,navy)+t(46,870,'ASK ABOUT EFFORT, NOT JUST RESULTS',25,'#fff',700)+lines(46,909,['How much time and support does this take?','What happens when demands rise or support stops?'],23,'#fff');
 b+=lines(28,1022,['Examples, not diagnostic signs. Masking can occur in any gender.','Assess childhood history, settings, impairment and alternatives.'],22,navy);
 b+=t(28,1093,'Sources: NICE NG87 1.2.2; Young et al., 2020',20,'#536b7e');
 return frame('Masking: look beneath the surface','Good results do not show the effort needed to achieve them.',1120,b,'Iceberg metaphor. Visible organisation or quiet behaviour can coexist with hidden difficulties, compensatory effort and a personal cost. These examples do not diagnose ADHD. Ask about effort and support, and assess the full history.');
},
life:function(){
 var b=rect(24,128,752,108,'#e3f2f1')+t(46,166,'OUTWARD MOVEMENT → INNER RESTLESSNESS',25,teal,750)+lines(46,202,['Hyperactivity may become less obvious; difficulties can remain.'],23,navy);
 var rows=[
 ['Pre-school','Climbs or runs when expected to stay still.','Consider developmental level and supervision.'],
 ['Primary school','Leaves the seat; loses track of instructions.','Unfinished work and repeated reminders.'],
 ['Adolescence','Feels restless; struggles to plan homework.','Late assignments as independence increases.'],
 ['Adulthood','Restlessness, disorganisation, missed tasks.','Impact at work, home, with money or driving.'],
 ['Older adulthood','A longstanding pattern may still be present.','New cognitive decline needs separate assessment.']
 ];
 b+='<path d="M48 286V858" stroke="#8bb9bd" stroke-width="4"/>';
 rows.forEach(function(r,i){var y=262+i*142;var color=i<2?coral:teal;b+='<circle cx="48" cy="'+(y+31)+'" r="23" fill="'+color+'"/>'+t(41,y+39,String(i+1),24,'#fff',700);b+=card(90,y,686,124,r[0],[r[1],r[2]],color);});
 b+=rect(24,998,752,126,navy)+t(46,1036,'SAME ASSESSMENT PRINCIPLES, DIFFERENT EXAMPLES',24,'#fff',700)+lines(46,1074,['Explore the lifelong pattern, settings and real-life impact.','Symptoms and support needs vary; this is not a fixed trajectory.'],22,'#fff');
 b+=t(28,1162,'Illustrative examples, not measured data • NICE NG87 1.3.5',21,'#536b7e');
 return frame('ADHD across life stages','Follow how difficulties may look as everyday demands change.',1190,b,'Five illustrative stages from pre-school to older adulthood connect possible symptoms to daily-life impact. Hyperactivity may become less visible with age, but difficulties can persist. People vary; new cognitive decline requires separate assessment.');
}
};
})();
