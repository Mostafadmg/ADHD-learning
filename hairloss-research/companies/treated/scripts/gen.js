// gen.js <out.json> '<json overrides>'  : build a walk.js action file for the men's flow from the baseline answers.
// keys: pattern[], when, doctor, used[], usedOther, scars, bp, checked, cond[], sym[], extra, gp, ht:[ft,in], wt:[st,lb], saveAfter(bool)
const fs=require('fs');
const B={pattern:["It's receding from the front","It's thinning all over the top"],when:"More than 3 months ago",doctor:"No",used:["I've never used any"],
scars:"No",bp:"Normal (Between 90/60 - 140/90)",checked:"In the last six months",cond:["None of the above"],sym:["No, none of the above"],extra:"No",gp:"No",ht:["5","10"],wt:["12","0"]};
const o=Object.assign({},B,JSON.parse(process.argv[3]||'{}'));
const S=[]; const c=t=>S.push({do:"click",text:t}); const w=ms=>S.push({do:"wait",ms});
w(6000);c("Male");c("Continue");w(3000);
o.pattern.forEach(c); if(o.pattern.includes("Other")){w(800);S.push({do:"fill",selector:"textarea, input[type=text]",value:"thinning"});} c("Continue");
c(o.when);c(o.doctor);
o.used.forEach(c); if(o.used.includes("Other")){w(800);S.push({do:"fill",selector:"textarea, input[type=text]",value:"shampoo"});} c("Continue");
c(o.scars);c(o.bp); if(o.checked) c(o.checked);
o.cond.forEach(c); w(800); if(o.condPopup) c(o.condPopup); c("Continue");
o.sym.forEach(c);c("Continue");
c(o.extra); if(o.extra==="Yes"){w(800);S.push({do:"fill",selector:"textarea, input[type=text]",value:"none"});c("Continue");}
c(o.gp);w(1500);c("Okay");w(1500);
S.push({do:"fill",label:"Feet",value:o.ht[0]},{do:"fill",label:"Inches",value:o.ht[1]},{do:"fill",label:"Stone",value:o.wt[0]},{do:"fill",label:"Pounds",value:o.wt[1]});
c("Continue");w(1500);(o.profile||[]).forEach(s=>S.push(s));if(o.stopAfterProfile){fs.writeFileSync(process.argv[2],JSON.stringify({start:"https://start.treated.com/GBR/en/#/choose-gender/024",steps:S},null,1));process.exit(0);}c("Continue");c("Yes, correct");w(8000);
if(o.extra2) (o.extra2).forEach(s=>S.push(s));
fs.writeFileSync(process.argv[2],JSON.stringify({start:o.start||"https://start.treated.com/GBR/en/#/choose-gender/024",steps:S},null,1));
