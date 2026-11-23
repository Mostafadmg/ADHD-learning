// cmp.js <runDir> [baseRunDir]: compare a giwalk run with the baseline run, screen by screen (by slug).
const fs=require('fs'),path=require('path');
const [run,base='runs/baseline-men-gi']=process.argv.slice(2);
const load=d=>{const r=JSON.parse(fs.readFileSync(path.join(d,'result.json'),'utf8'));return r;};
const a=load(base),b=load(run);
const norm=t=>(t||'').replace(/Already have an account\? Sign In/g,'').trim();
const bm={};for(const s of a.steps)bm[s.slug]=s;
console.log('BASE path:',a.steps.map(s=>s.slug).join(' > '));
console.log('RUN  path:',b.steps.map(s=>s.slug).join(' > '));
console.log('RUN  end :',JSON.stringify(b.end));
for(const s of b.steps){const o=bm[s.slug];
 if(!o){console.log(`\n+ NEW SCREEN [${s.slug}] (${s.serverSlug})\n  text: ${norm(s.text).replace(/\n+/g,' / ').slice(0,700)}\n  choices: ${s.choices.map(c=>c.label).join(' | ')}\n  fields: ${s.fields.map(f=>f.type+':'+f.label).join(' | ')}\n  chosen: ${JSON.stringify(s.chosen)}`);continue;}
 const tA=norm(o.text),tB=norm(s.text);
 const cA=o.choices.map(c=>c.label).join('|'),cB=s.choices.map(c=>c.label).join('|');
 if(tA!==tB||cA!==cB){console.log(`\n~ CHANGED [${s.slug}]\n  base: ${tA.replace(/\n+/g,' / ').slice(0,600)}\n  run : ${tB.replace(/\n+/g,' / ').slice(0,600)}`);}
}
for(const s of a.steps){if(!b.steps.find(x=>x.slug===s.slug))console.log(`\n- MISSING SCREEN [${s.slug}]`);}
