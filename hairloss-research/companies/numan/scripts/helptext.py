#!/usr/bin/env python3
"""helptext.py <intercom-article.html> — article title and body text of a help.numan.com page."""
import re, sys, html
h = open(sys.argv[1], encoding='utf8', errors='replace').read()
m = re.search(r'(?is)<article\b.*?</article>', h) or re.search(r'(?is)<main\b.*?</main>', h)
b = m.group(0) if m else h
b = re.sub(r'(?is)<(script|style|svg)\b.*?</\1>', ' ', b)
b = re.sub(r'(?i)<(br|/p|/div|/li|/h[1-6]|/tr|/td|/th)\b[^>]*>', '\n', b)
b = html.unescape(re.sub(r'<[^>]+>', ' ', b))
out = []
for l in b.split('\n'):
    l = re.sub(r'[ \t\xa0]+', ' ', l).strip()
    if l and (not out or out[-1] != l): out.append(l)
print('\n'.join(out))
