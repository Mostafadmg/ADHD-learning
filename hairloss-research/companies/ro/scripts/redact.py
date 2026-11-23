# Replace the anonymous draft session token in saved run files with [redacted]. Usage: python3 -I scripts/redact.py runs/<id>
import json, os, re, sys
d = sys.argv[1]
n = 0
for root, _, files in os.walk(d):
    for f in files:
        if not f.endswith(('.json', '.jsonl', '.txt')): continue
        p = os.path.join(root, f)
        s = open(p, encoding='utf8', errors='replace').read()
        s2 = re.sub(r'("key"\s*:\s*")[^"\[]{8,}(")', r'\1[redacted]\2', s)
        s2 = re.sub(r'("(?:token|access_token|session_token|auth_token)"\s*:\s*")[^"\[]{8,}(")', r'\1[redacted]\2', s2)
        if s2 != s:
            open(p, 'w', encoding='utf8').write(s2); n += 1
print('redacted files:', n)
