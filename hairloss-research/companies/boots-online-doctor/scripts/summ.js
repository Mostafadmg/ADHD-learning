#!/usr/bin/env node
/* summ.js <runDir>: one-line end state of a replay (final URL, last order JSON: status, admin_status, product, tasks with status/flags). */
const fs=require('fs'),path=require('path');const dir=process.argv[2];
const net=path.join(dir,'net');const files=fs.existsSync(net)?fs.readdirSync(net).sort((a,b)=>parseInt(a)-parseInt(b)):[];
const txts=fs.readdirSync(dir).filter(f=>/^\d+\.txt$/.test(f)).sort((a,b)=>parseInt(a)-parseInt(b));
const last=txts.length?fs.readFileSync(path.join(dir,txts[txts.length-1]),'utf8'):'';
const url=(last.match(/URL: (\S+)/)||[])[1];
const qs=files.filter(f=>/questionnaires_\d+/.test(f)).map(f=>f.match(/questionnaires_(\d+)/)[1]);
const of=files.filter(f=>/orders_\d+\.json$/.test(f)).pop();
let o=null;if(of){const j=JSON.parse(fs.readFileSync(path.join(net,of),'utf8'));o=j.body||j;}
const out={url,questionnaires:[...new Set(qs)]};
if(o){out.order={status:o.status,category:o.category&&o.category.code,total:o.fee&&o.fee.total,
 lines:(o.orderlines||[]).map(l=>({sku:l.product.sku,code:l.product.code,price:l.product.price,admin:l.status.admin_status,
 tasks:(l.stages||[]).flatMap(s=>s.tasks.map(t=>`${t.name}:s${t.status.value}/f${t.flags}`))}))};}
console.log(JSON.stringify(out));
