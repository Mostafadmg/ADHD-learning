// verify_pdp.js <outDir> <url>... : stage 3 product check. Loads each product page WITH JavaScript (one browser, one page
// at a time, 3 s pause), saves the visible text of <main>, and prints the price and ingredient lines near the top.
const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
(async()=>{const [out,...urls]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();const ctx=await b.newContext({locale:'en-US',timezoneId:'America/New_York',viewport:{width:1280,height:900}});
for(const u of urls){const p=await ctx.newPage();try{await p.goto(u,{waitUntil:'domcontentloaded',timeout:60000});await p.waitForTimeout(6000);
const t=await p.evaluate(()=>document.body.innerText);const n=u.replace(/^https?:\/\//,'').replace(/[^a-z0-9]+/gi,'_');fs.writeFileSync(path.join(out,n+'.txt'),u+'\n'+t);
const lines=t.split('\n').map(s=>s.trim()).filter(Boolean);const top=lines.slice(0,140).filter(l=>/\$\d|mg\b|%|plan|month|upfront|stock/i.test(l)).slice(0,14);
console.log('=== '+u);console.log(top.map(l=>'  '+l.slice(0,160)).join('\n'));}catch(e){console.log('ERR '+u+' '+e.message.slice(0,100))}await p.close();await new Promise(r=>setTimeout(r,3000));}
await b.close();})();
