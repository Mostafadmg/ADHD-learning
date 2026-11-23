#!/usr/bin/env python3
"""html2text.py <file.html> : print the visible text of a saved page (scripts/styles removed). Run with python3 -I."""
import re, html, sys
s = open(sys.argv[1], encoding='utf-8', errors='replace').read()
s = re.sub(r'(?is)<(script|style|noscript|svg|template)\b.*?</\1>', ' ', s)
s = re.sub(r'(?is)<!--.*?-->', ' ', s)
s = re.sub(r'(?i)<(br|/p|/div|/li|/h[1-6]|/tr|/section|/td|/th|/button|/a|/span|/label|/option)\s*/?>', '\n', s)
s = re.sub(r'(?s)<[^>]+>', ' ', s)
s = html.unescape(s)
lines = [re.sub(r'[ \t\xa0]+', ' ', l).strip() for l in s.split('\n')]
out = []
for l in lines:
    if l and (not out or out[-1] != l):
        out.append(l)
print('\n'.join(out))
