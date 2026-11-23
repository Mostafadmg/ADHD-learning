#!/usr/bin/env python3
"""html2text.py <file.html> — visible text of a saved page (scripts/styles removed), plus consultation/purchase links."""
import re, sys, html
h = open(sys.argv[1], encoding='utf8', errors='replace').read()
links = sorted(set(html.unescape(l) for l in re.findall(r'href="([^"]+)"', h) if re.search(r'/subscribe|/purchase|/lps/|consultation', l)))
body = re.sub(r'(?is)<(script|style|noscript|svg|template)\b.*?</\1>', ' ', h)
body = re.sub(r'(?i)<(br|/p|/div|/li|/h[1-6]|/section|/tr|/button|/a)\b[^>]*>', '\n', body)
body = re.sub(r'<[^>]+>', ' ', body)
body = html.unescape(body)
lines = [re.sub(r'[ \t\xa0]+', ' ', l).strip() for l in body.split('\n')]
out = []
for l in lines:
    if l and (not out or out[-1] != l): out.append(l)
print('LINKS:', *links, sep='\n  ')
print('\nTEXT:\n' + '\n'.join(out))
