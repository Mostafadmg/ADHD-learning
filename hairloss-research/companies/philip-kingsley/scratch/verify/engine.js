// Stage 3 independent port of the site's rule check (quiz.min.js checkProductAvailability / processConditions /
// getValuesByLabel), written from the served code, not from stage 1's engine.py.
// usage: node engine.js <flow> [q=value ...]   (value may be a|b for multi-select). Base answers = live baseline storage.
const fs=require('fs'),path=require('path');
const dir='/home/user/ADHD-learning/hairloss-research/companies/philip-kingsley';
function labelMap(def,flow){const m={};for(const [k,t] of Object.entries(def.templates)){if(!k.startsWith(flow+'_quiz'))continue;
  const re=/data-quiz-question="([^"]+)"[^>]*?data-quiz-label="([^"]*)"[^>]*?data-quiz-selection="([^"]*)"/g;let x;
  while((x=re.exec(t))){m[x[1]+'::'+x[3]]=x[2];m[x[1]+'::*']=m[x[1]+'::*']||x[2];}
  const re2=/data-quiz-question="([^"]+)"[^>]*?data-quiz-label="([^"]*)"/g; while((x=re2.exec(t))){m[x[1]+'::*']=m[x[1]+'::*']||x[2];}}
  return m;}
function vals(qd,label){for(const k of Object.keys(qd)){if(qd[k].label==label)return String(qd[k].value).split('|');}return null;}
function gen(qd,c,dv){const v=vals(qd,c.question);if(!v)return dv;if(c.operator==='and'){let r=true;c.values.forEach(x=>r=r&&v.indexOf(x)!==-1);return r;}let r=false;c.values.forEach(x=>r=r||v.indexOf(x)!==-1);return r;}
function comp(qd,c,dv){let r=c.operator==='and';for(const ch of c.conditions){const y=ch.type==='GenericCondition'?gen(qd,ch,dv):comp(qd,ch,dv);r=c.operator==='and'?(r&&y):(r||y);}return r;}
function cond(qd,c,dv){return c.type==='GenericCondition'?gen(qd,c,dv):comp(qd,c,dv);}
function run(flow,changes){
  const def=JSON.parse(fs.readFileSync(path.join(dir,'quiz-definition-'+flow+'.json'),'utf8'));
  const st=JSON.parse(JSON.parse(fs.readFileSync(path.join(dir,'runs/verify-b-'+flow+'/storage.json'),'utf8')).local.quizData)[flow+'_quiz'];
  const qd=JSON.parse(JSON.stringify(st)); const lm=labelMap(def,flow);
  for(const [q,v] of changes){const first=v.split('|')[0];const lab=lm[q+'::'+first]||lm[q+'::*'];if(!lab)throw new Error('no label for '+q+' '+v);qd[q]={label:lab,value:v};}
  const out=[];for(const r of Object.values(def.rules[flow+'_quiz'])){const b=r.blockers?cond(qd,r.blockers,false):false;const c=r.conditions?cond(qd,r.conditions,true):true;if(!b&&c)out.push(r.sku);}
  return out;}
module.exports={run};
if(require.main===module){const [flow,...rest]=process.argv.slice(2);const ch=rest.map(a=>{const i=a.indexOf('=');return [a.slice(0,i),a.slice(i+1)];});console.log(run(flow,ch).join(','));}
