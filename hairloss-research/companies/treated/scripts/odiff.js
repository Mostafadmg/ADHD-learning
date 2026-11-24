// odiff.js <runA> <runB> : list differing leaf paths in gettreatmentoptions (ignoring ids/dates)
const fs=require('fs'),path=require('path');
const get=d=>{const l=fs.readFileSync(path.join(d,'network.jsonl'),'utf8').trim().split('\n').map(JSON.parse).filter(x=>/gettreatmentoptions/.test(x.url)).pop();return JSON.parse(fs.readFileSync(path.join(d,l.file),'utf8'));};
const flat=(o,p='',r={})=>{if(o&&typeof o==='object'){for(const k of Object.keys(o))flat(o[k],p+'.'+k,r);}else r[p]=o;return r;};
const a=flat(get(process.argv[2])),b=flat(get(process.argv[3]));const ks=new Set([...Object.keys(a),...Object.keys(b)]);
let n=0;for(const k of ks){if(/onboardingId|Date|consultationAnswers|\.id$|tracking/i.test(k))continue;if(a[k]!==b[k]){if(n++<40)console.log(k,':',JSON.stringify(a[k]).slice(0,80),'->',JSON.stringify(b[k]).slice(0,80));}}console.log('diffs',n);
