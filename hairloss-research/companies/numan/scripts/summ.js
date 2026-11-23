#!/usr/bin/env node
// summarise a run: questions served (from network.jsonl), last engine flags, product screen (featured + others with prices)
const fs=require('fs'),path=require('path');const d=process.argv[2];
const nl=fs.readFileSync(path.join(d,'network.jsonl'),'utf8').trim().split('\n').map(l=>JSON.parse(l));
const qs=nl.filter(r=>r.method==='GET'&&/\/sq\/[a-z_0-9]+$/.test(r.url)).map(r=>r.url.split('/sq/')[1]);
const rej=nl.filter(r=>/\/reject\//.test(r.url)).map(r=>r.url.split('/sq/')[1]);
console.log('QUESTIONS('+qs.length+'):',qs.join(' > '), rej.length?' REJECT:'+rej.join(','):'');
const fl=nl.filter(r=>/calculate-web-directives/.test(r.url)&&r.file);
if(fl.length){const s=fs.readFileSync(path.join(d,fl[fl.length-1].file),'utf8');const pick={};
 for(const k of ['isFinasterideEligible','isMinoxidilEligible','hasAllergyToFinasteride','hasAllergyToMinoxidil','allergies','numberOfQuestions']){const m=s.match(new RegExp('"'+k+'":(\\[[^\\]]*\\]|[^,}]+)'));if(m)pick[k]=m[1]}
 console.log('FLAGS:',JSON.stringify(pick));}
const txt=fs.readdirSync(d).filter(f=>/^\d+\.txt$/.test(f)).sort();const last=fs.readFileSync(path.join(d,txt[txt.length-1]),'utf8');
const url=(last.match(/URL: (\S+)/)||[])[1];console.log('URL:',url);
const body=last.replace(/\s+/g,' ');
const N=['Hair Kit - Medicated Spray, Finasteride & Supplement','Hair Kit - Medicated Spray & Finasteride','Hair Kit - Combination Spray & Supplement','Finasteride Finasteride is','Triple-Action Spray Combat','Extra Strength Spray Extra','Regaine','Rosemary Oil'];
const i0=body.indexOf('Please select your treatment');
if(i0<0){console.log('SCREEN:',body.slice(0,900));process.exit(0)}
const sel=body.slice(i0);const iOther=sel.indexOf('OTHER TREATMENTS');
const feat=sel.slice(0,iOther<0?undefined:iOther);
const badge=(feat.match(/(Most effective|Recommended for you)/)||[])[1];
const fn=N.find(n=>feat.includes(n.split(' ').slice(0,n.startsWith('Hair Kit')?99:2).join(' ')));
console.log('FEATURED:',fn,'|',badge,'|',(feat.match(/Price (£[\d.]+)/)||[])[1]);
if(iOther>=0){const o=sel.slice(iOther);const got=[];for(const n of N){const k=n.startsWith('Hair Kit')?n:n.split(' ').slice(0,n.startsWith('Regaine')||n.startsWith('Rosemary')?2:1).join(' ');const j=o.indexOf(n.startsWith('Hair Kit')?n+' ':n);if(j>=0){const p=(o.slice(j).match(/£[\d.]+/)||[])[0];got.push(k+' '+p)}}console.log('OTHERS:',got.join(' ; '))}
