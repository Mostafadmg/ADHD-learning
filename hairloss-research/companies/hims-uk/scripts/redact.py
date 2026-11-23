#!/usr/bin/env python3
"""Replace guest tokens (JWT-shaped strings) in a run folder with a placeholder.
Usage: python3 -I scripts/redact.py runs/<run-id> [...]"""
import re, sys, os, glob
JWT = re.compile(r'eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}')
for run in sys.argv[1:]:
    n = 0
    for f in [os.path.join(run, 'network.jsonl'), os.path.join(run, 'storage.json')] + glob.glob(os.path.join(run, 'net', '*.json')) + glob.glob(os.path.join(run, '*.txt')):
        if not os.path.isfile(f): continue
        try: s = open(f, encoding='utf-8').read()
        except Exception: continue
        s2, k = JWT.subn('<guest-token-redacted>', s)
        if k: open(f, 'w', encoding='utf-8').write(s2); n += k
    print(run, 'redacted', n)
