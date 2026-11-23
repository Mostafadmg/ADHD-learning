// Load the consultation entry page once in a normal browser and save every first-party JS/HTML/CSS-free response
// usage: node grab-js.js <url> <outDir>
const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
(async()=>{
  const url=process.argv[2],out=process.argv[3];fs.mkdirSync(out,{recursive:true});
  const b=await chromium.launch();const ctx=await b.newContext({userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',viewport:{width:1280,height:900}});
  const page=await ctx.newPage();const log=[];
  page.on('response',async r=>{try{const u=r.url();const ct=(r.headers()['content-type']||'');
    if(/javascript|html/.test(ct)&&/(boots\.com|lemonaid)/.test(new URL(u).hostname)){const body=await r.body();const name=u.replace(/^https?:\/\//,'').replace(/[^A-Za-z0-9._-]+/g,'_').slice(0,150);fs.writeFileSync(path.join(out,name),body);log.push(r.status()+' '+body.length+' '+u);}
  }catch(e){}});
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  try{await page.waitForLoadState('networkidle',{timeout:20000});}catch(e){}
  await page.waitForTimeout(3000);
  fs.writeFileSync(path.join(out,'_log.txt'),log.join('\n'));console.log(log.join('\n'));
  await b.close();
})();
