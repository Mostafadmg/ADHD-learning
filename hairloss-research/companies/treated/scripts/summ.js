// summ.js <runDir> : mode, message, offered products and pre-selected product from gettreatmentoptions; last screen head.
const fs=require('fs'),path=require('path');const d=process.argv[2];
const lines=fs.readFileSync(path.join(d,'network.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
const t=lines.filter(l=>/gettreatmentoptions/.test(l.url)).pop();
if(!t){console.log('NO gettreatmentoptions');}else{
 const j=JSON.parse(fs.readFileSync(path.join(d,t.file),'utf8'));const p=j.prescription||{};
 const lists={};for(const k of Object.keys(p))if(Array.isArray(p[k])&&p[k].length&&p[k][0].productUID)lists[k]=p[k].map(a=>a.name+'('+a.productUID+' £'+a.minimumPrice+' ds:'+a.dosages.map(x=>x.name+(x.isOutOfStock?'[OOS]':'')).join('/')+')');
 const sel=(Object.values(p).flat().find(a=>a&&a.productId===j.selectedProductId)||{}).name;
 console.log('mode',p.mode,'| approvalReq',p.autoOfferApprovalRequired,'| selected',sel,'| msg:',p.displayMessage);console.log(JSON.stringify(lists));
 console.log('post-answers', JSON.parse(t.post).answers.length, 'mp', JSON.stringify(JSON.parse(t.post).medicalProfile).slice(0,300));
}
const txt=fs.readdirSync(d).filter(f=>/^\d+\.txt$/.test(f)).sort().pop();
console.log('LAST',txt, fs.readFileSync(path.join(d,txt),'utf8').slice(0,900).replace(/\n+/g,' | '));
