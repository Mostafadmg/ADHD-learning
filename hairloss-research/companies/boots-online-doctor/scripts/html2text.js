// usage: node html2text.js <file.html>  -> prints visible text and links (script/style stripped)
const fs=require('fs');
let h=fs.readFileSync(process.argv[2],'utf8');
h=h.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<noscript[\s\S]*?<\/noscript>/gi,'').replace(/<svg[\s\S]*?<\/svg>/gi,'');
h=h.replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,(m,u,t)=>' ['+t.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()+']('+u+') ');
h=h.replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr|\/section|\/summary|\/button)\b[^>]*>/gi,'\n').replace(/<[^>]+>/g,' ');
h=h.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&pound;/g,'£').replace(/&#163;/g,'£').replace(/&rsquo;|&#39;|&#x27;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
console.log(h.split('\n').map(l=>l.replace(/[ \t]+/g,' ').trim()).filter(Boolean).join('\n'));
