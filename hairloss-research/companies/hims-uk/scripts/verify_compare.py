#!/usr/bin/env python3
"""Stage 3 (verify): the reviewer's own comparison of replays, written independently of scripts/compare_runs.py.
For each run it prints: final URL and text; which screens differ from the baseline run (text or controls);
every answer the browser posted with the next step the server named; and whether the server's path matches the baseline.
Usage: python3 -I scripts/verify_compare.py <baseline-run> <run> [<run> ...]"""
import sys, re, glob, os, json

def screens(run):
    out = []
    for f in sorted(glob.glob(os.path.join(run, '[0-9][0-9].txt'))):
        s = open(f, encoding='utf-8').read()
        url = re.search(r'^URL: (.*)$', s, re.M)
        vt = s.split('--- VISIBLE TEXT ---', 1)[1] if '--- VISIBLE TEXT ---' in s else ''
        text = vt.split('--- CONTROLS ---')[0]
        ctr = vt.split('--- CONTROLS ---')[1].split('--- LINKS ---')[0] if '--- CONTROLS ---' in vt else ''
        out.append({'f': os.path.basename(f), 'label': s.split('\n', 1)[0], 'url': url.group(1) if url else '',
                    'text': re.sub(r'\s+', ' ', text).strip(), 'ctrl': re.sub(r'\s+', ' ', ctr).strip()})
    return out

def posts(run):
    out = []
    p = os.path.join(run, 'network.jsonl')
    if not os.path.isfile(p): return out
    for l in open(p, encoding='utf-8'):
        try: r = json.loads(l)
        except Exception: continue
        body = r.get('post') or ''
        if 'graphql' not in r.get('url', '') or not body: continue
        try: j = json.loads(body)
        except Exception: continue
        op = j.get('operationName') or ''
        if not re.search(r'Anonymous|Flow|Claim|Delete|Reset|Discard', op): continue
        inp = (j.get('variables') or {}).get('input', {}) or {}
        reply = None
        if r.get('file'):
            try: reply = json.load(open(os.path.join(run, r['file']), encoding='utf-8'))
            except Exception: reply = None
        nxt = None; keys = None
        if isinstance(reply, dict) and isinstance(reply.get('data'), dict):
            pay = next(iter(reply['data'].values()), None)
            if isinstance(pay, dict):
                keys = sorted(k for k in pay if k != '__typename')
                ns = pay.get('nextStep')
                nxt = ns.get('id') if isinstance(ns, dict) else ('(none)' if 'nextStep' in pay else None)
        out.append({'op': op, 'step': inp.get('stepId'), 'answer': inp.get('answer'), 'status': r.get('status'), 'next': nxt, 'replyKeys': keys,
                    'errors': reply.get('errors') if isinstance(reply, dict) else None})
    return out

def first_diff(x, y):
    k = 0
    while k < min(len(x), len(y)) and x[k] == y[k]: k += 1
    return '…%s  |vs|  …%s' % (x[max(0, k - 40):k + 100], y[max(0, k - 40):k + 100])

base = sys.argv[1]; B = screens(base); BP = posts(base)
bpath = [(p['op'], p['step'], p['next']) for p in BP if p['op'].startswith('Submit')]
print('BASELINE %s: %d screens, %d posts, ends %s' % (base, len(B), len(BP), B[-1]['url'] if B else None))
for run in sys.argv[2:]:
    S = screens(run); P = posts(run)
    print('\n== %s: %d screens, ends %s' % (run, len(S), S[-1]['url'] if S else None))
    if S: print('   final text: %s' % S[-1]['text'][:160])
    if len(S) == len(B):
        d = [i for i in range(len(S)) if S[i]['text'] != B[i]['text'] or S[i]['url'] != B[i]['url']]
        dc = [i for i in range(len(S)) if S[i]['ctrl'] != B[i]['ctrl'] and i not in d]
        print('   screens that differ in text or address: %s' % (d or 'none'))
        for i in d: print('     step %02d: %s' % (i, first_diff(B[i]['text'] + ' @' + B[i]['url'], S[i]['text'] + ' @' + S[i]['url'])))
        if dc: print('   screens that differ only in controls: %s' % dc)
    else:
        print('   different number of screens from the baseline (%d against %d): compare by hand' % (len(S), len(B)))
    path = [(p['op'], p['step'], p['next']) for p in P if p['op'].startswith('Submit')]
    print('   server path same as baseline: %s (%d submit posts)' % (path == bpath, len(path)))
    ba = {p['step']: p['answer'] for p in BP if p['op'].startswith('SubmitStep')}
    for p in P:
        if p['op'].startswith('SubmitStep'):
            if p['answer'] != ba.get(p['step']) or p['errors']:
                print('   posted for step %s: %s (baseline %s) -> next %s %s' % ((p['step'] or '')[:8], json.dumps(p['answer'], ensure_ascii=False), json.dumps(ba.get(p['step']), ensure_ascii=False), (p['next'] or '')[:8], 'ERRORS ' + json.dumps(p['errors'])[:200] if p['errors'] else ''))
        else:
            print('   %s status %s reply fields %s %s' % (p['op'], p['status'], p['replyKeys'], 'ERRORS ' + json.dumps(p['errors'])[:200] if p['errors'] else ''))
