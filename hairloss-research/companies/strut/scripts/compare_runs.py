#!/usr/bin/env python3
# Stage 2 helper: list the distinct screens of a run and compare with a baseline run.
# Usage: python3 -I scripts/compare_runs.py runs/<run> [runs/<baseline>]
import sys, os, re, glob
def screens(run):
    out = []
    for f in sorted(glob.glob(os.path.join(run, '[0-9][0-9].txt'))):
        t = open(f, encoding='utf-8', errors='replace').read()
        url = (re.search(r'^URL: (.*)$', t, re.M) or [None, ''])[1]
        vis = t.split('--- VISIBLE TEXT ---', 1)[-1].split('--- CONTROLS ---', 1)[0]
        lines = [l.strip() for l in vis.splitlines() if l.strip()]
        pct = next((l for l in lines if re.fullmatch(r'\d+%', l)), '')
        head = next((l for l in lines if not re.fullmatch(r'\d+%', l)), '(blank)')
        m = re.search(r'Dose: (.*)\nSupply: (.*)\nTotal\n(\$[\d.]+)', vis)
        cart = ('%s | %s | %s' % (m[1].strip(), m[2].strip(), m[3])) if m else ''
        body = re.sub(r'\n1\n.*', '', vis, flags=re.S) if m else vis   # screen text without the cart strip
        out.append(dict(step=os.path.basename(f)[:2], url=url, pct=pct, head=head, cart=cart, body=re.sub(r'\s+', ' ', body).strip()))
    return out
def distinct(sc):
    seq = []
    for s in sc:
        if not seq or seq[-1]['head'] != s['head']: seq.append(s)
    return seq
run = sys.argv[1]; a = distinct(screens(run))
print('RUN', run, '-', len(a), 'distinct screens')
for s in a: print('  [%s] %-4s %s%s' % (s['step'], s['pct'], s['head'][:95], ('   {cart: %s}' % s['cart']) if s['cart'] else ''))
last = screens(run)[-1]
print('END  url=%s  pct=%s  head=%s' % (last['url'], last['pct'], last['head']))
print('END TEXT:', last['body'][:600])
if len(sys.argv) > 2:
    b = distinct(screens(sys.argv[2]))
    ha = [s['head'] for s in a]; hb = [s['head'] for s in b]
    print('ADDED vs baseline  :', [h for h in ha if h not in hb] or 'none')
    print('MISSING vs baseline:', [h for h in hb if h not in ha] or 'none')
    ca = sorted(set(s['cart'] for s in a if s['cart'])); cb = sorted(set(s['cart'] for s in b if s['cart']))
    print('CART this run:', ca); print('CART baseline:', cb, '=> same' if ca == cb else '=> DIFFERENT')
    # wording changes on shared screens
    bb = {s['head']: s['body'] for s in b}
    diff = [s['head'] for s in a if s['head'] in bb and re.sub(r'\d+%', '', bb[s['head']]) != re.sub(r'\d+%', '', s['body'])]
    print('REWORDED shared screens:', diff or 'none')
    pa = {s['head']: s['pct'] for s in a}; pb = {s['head']: s['pct'] for s in b}
    print('PROGRESS differences:', {h: (pb[h], pa[h]) for h in pa if h in pb and pa[h] != pb[h]} or 'none')
