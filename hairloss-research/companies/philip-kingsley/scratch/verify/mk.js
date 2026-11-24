// Stage 3 (verify) generator: node mk.js <flow> <id> [q=newSelection ...] [--rules]
// Builds scratch/verify/<id>.json from the official baseline-<flow>.json, swapping the clicked selection for each
// question given, and appends a read-only eval step at the wall (site's own checkProductAvailability()).
const fs=require('fs'),path=require('path');
const dir='/home/user/ADHD-learning/hairloss-research/companies/philip-kingsley';
const [flow,id,...rest]=process.argv.slice(2);
const base=JSON.parse(fs.readFileSync(path.join(dir,'baseline-'+flow+'.json'),'utf8'));
const withRules=rest.includes('--rules');
const subs=rest.filter(a=>a.includes('=')&&!a.startsWith('--')).map(a=>{const i=a.indexOf('=');return [a.slice(0,i),a.slice(i+1)];});
const inserts=rest.filter(a=>a.startsWith('--after:')); // --after:q7a:<json step>
const steps=[];
for(const s of base.steps){
  let st=JSON.parse(JSON.stringify(s));
  const m=st.selector&&st.selector.match(/data-quiz-question="([^"]+)"\]\[data-quiz-selection="([^"]*)"\]/);
  if(m){ for(const [q0,v] of subs){ const [qa,qb]=q0.includes('>')?q0.split('>'):[q0,q0]; const q=qb; if(qa===m[1]){ st.selector=`.pk-quiz-control[data-quiz-question="${q}"][data-quiz-selection="${v}"]`; st._changed=true; } } }
  steps.push(st);
  if(m){ for(const ins of inserts){ const p=ins.split(':'); if(p[1]===m[1]||(st.selector&&st.selector.includes(`"${p[1]}"`))){ const extra=JSON.parse(p.slice(2).join(':')); steps.push({do:'wait',ms:900}); (Array.isArray(extra)?extra:[extra]).forEach(e=>{steps.push(e);steps.push({do:'wait',ms:900});}); } } }
}
for(const [q0] of subs){ const q=q0.split('>').pop(); if(!steps.some(s=>s._changed&&s.selector.includes(`"${q}"`))) { console.error('NOT FOUND in baseline: '+q); process.exit(1);} }
steps.forEach(s=>delete s._changed);
steps.push({do:'wait',ms:1200});
steps.push({do:'eval',js:`(()=>{const q=window.quiz;const d=(q.data&&q.data[q.quizId])||{};const ans={};for(const k in d){if(d[k]&&d[k].value!=='')ans[k]=d[k].value;}const skus=q.checkProductAvailability();const rules=q.state.rules[q.quizId]||{};const out={quizId:q.quizId,step:q.state.current,url:location.pathname,skus:skus,ruleCount:Object.keys(rules).length,rulesLen:JSON.stringify(rules).length,answers:ans,heading:(document.querySelector('h1,h2')||{}).innerText||''};${withRules?'out.rules=rules;out.noResultsTpl=(q.state.templates.no_results||"").length;':''}return out;})()`});
const out={start:base.start,note:'Stage 3 verify run built from baseline-'+flow+'.json; changes: '+(subs.map(s=>s.join(' -> ')).join('; ')||'none'),steps};
fs.writeFileSync(path.join(dir,'scratch/verify',id+'.json'),JSON.stringify(out,null,1));
console.log('wrote',id,steps.length,'steps');
