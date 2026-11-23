#!/usr/bin/env python3
"""pagebody.py <page.txt> — drop the repeated site navigation from a html2text.py output."""
import sys
L = open(sys.argv[1], encoding='utf8').read().split('\n')
idx = [i for i, l in enumerate(L) if l.strip() in ('Find your treatment', 'View all tests')]
start = idx[-1] + 1 if idx else 0
print('\n'.join(L[start:]))
