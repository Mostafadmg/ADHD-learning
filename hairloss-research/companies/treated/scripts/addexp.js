// addexp.js '<json array of experiments>' : upsert into company.json experiments by id
const fs=require('fs');const c=JSON.parse(fs.readFileSync('company.json','utf8'));
for(const e of JSON.parse(process.argv[2])){const i=c.experiments.findIndex(x=>x.id===e.id);if(i>=0)c.experiments[i]=e;else c.experiments.push(e);}
fs.writeFileSync('company.json',JSON.stringify(c,null,1));console.log('experiments',c.experiments.length);
