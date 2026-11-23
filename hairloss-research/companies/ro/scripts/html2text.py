import re,sys,html
h=open(sys.argv[1],encoding='utf-8',errors='replace').read()
m=re.search(r'<main.*?</main>',h,flags=re.S)
body=m.group(0) if m else h
body=re.sub(r'<script.*?</script>','',body,flags=re.S)
body=re.sub(r'<style.*?</style>','',body,flags=re.S)
body=re.sub(r'<svg.*?</svg>','',body,flags=re.S)
body=re.sub(r'<(br|/p|/div|/li|/h[1-6]|/section|/tr|/button|/a)[^>]*>','\n',body)
body=re.sub(r'<[^>]+>',' ',body)
body=html.unescape(body)
lines=[re.sub(r'[ \t\xa0]+',' ',l).strip() for l in body.split('\n')]
out=[]
for l in lines:
    if l and (not out or out[-1]!=l): out.append(l)
print('\n'.join(out))
