#!/usr/bin/env python3
"""Compare one-change runs with the baseline run.
For every run it reports:
  - final URL and final screen text
  - the list of screens (first line of visible text per step) and which steps differ from baseline
  - what the browser posted for each step (stored value) and which step the server said comes next
Usage: python3 -I scripts/compare_runs.py <baseline-run> <run> [<run> ...] [--json out.json]
"""
import json, os, re, sys, glob

def load_run(run):
    steps = []
    for f in sorted(glob.glob(os.path.join(run, '[0-9][0-9].txt'))):
        s = open(f, encoding='utf-8').read()
        url = re.search(r'^URL: (.*)$', s, re.M)
        m = re.search(r'--- VISIBLE TEXT ---\n(.*?)\n\n--- CONTROLS ---\n(.*?)\n\n--- LINKS ---', s, re.S)
        text = m.group(1).strip() if m else ''
        controls = m.group(2).strip() if m else ''
        steps.append({'file': os.path.basename(f), 'url': url.group(1) if url else '', 'text': text, 'controls': controls,
                      'label': s.split('\n', 1)[0]})
    subs = []
    nl = os.path.join(run, 'network.jsonl')
    if os.path.isfile(nl):
        for l in open(nl, encoding='utf-8'):
            try: r = json.loads(l)
            except Exception: continue
            p = r.get('post') or ''
            if 'SubmitStepResponseAnonymously' in p or 'SubmitFlowAnonymously' in p:
                try: j = json.loads(p)
                except Exception: continue
                inp = j.get('variables', {}).get('input', {})
                nxt = None; typ = None; raw = None
                try:
                    raw = json.load(open(os.path.join(run, r['file']), encoding='utf-8'))
                    pay = raw['data'].get('submitStepResponseAnonymously') or {}
                    ns = pay.get('nextStep')
                    nxt = ns and ns.get('id'); typ = ns and ns.get('__typename')
                except Exception: pass
                subs.append({'op': j.get('operationName'), 'stepId': inp.get('stepId'), 'answer': inp.get('answer'), 'next': nxt, 'nextType': typ,
                             'errors': (raw or {}).get('errors') if isinstance(raw, dict) else None})
    return {'run': run, 'steps': steps, 'subs': subs}

def norm(t):
    return re.sub(r'\s+', ' ', t).strip()

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    out = None
    if '--json' in sys.argv:
        out = sys.argv[sys.argv.index('--json') + 1]; args.remove(out)
    base = load_run(args[0]); results = []
    bpath = [(s['stepId'], s['next']) for s in base['subs']]
    print('BASELINE %s: %d screens, %d submissions, final %s' % (args[0], len(base['steps']), len(base['subs']), base['steps'][-1]['url']))
    for run in args[1:]:
        r = load_run(run)
        res = {'run': run, 'screens': len(r['steps']), 'finalUrl': r['steps'][-1]['url'] if r['steps'] else None,
               'finalText': norm(r['steps'][-1]['text'])[:300] if r['steps'] else None}
        diffs = []
        for i in range(max(len(base['steps']), len(r['steps']))):
            b = base['steps'][i] if i < len(base['steps']) else None
            x = r['steps'][i] if i < len(r['steps']) else None
            if not b or not x: diffs.append({'step': i, 'kind': 'missing-in-' + ('run' if not x else 'baseline')}); continue
            d = {}
            if norm(b['text']) != norm(x['text']): d['text'] = {'baseline': norm(b['text'])[:400], 'run': norm(x['text'])[:400]}
            if re.sub(r'\?.*', '', b['url']) != re.sub(r'\?.*', '', x['url']) or b['url'] != x['url']:
                if b['url'] != x['url']: d['url'] = {'baseline': b['url'], 'run': x['url']}
            if d: d['step'] = i; d['label'] = x['label']; diffs.append(d)
        res['screenDiffs'] = diffs
        path = [(s['stepId'], s['next']) for s in r['subs']]
        res['serverPathSame'] = path == bpath
        res['submissions'] = len(r['subs'])
        ans = []
        for i, s in enumerate(r['subs']):
            b = base['subs'][i] if i < len(base['subs']) else None
            if not b or b['answer'] != s['answer'] or b['stepId'] != s['stepId'] or b['next'] != s['next']:
                ans.append({'n': i, 'stepId': s['stepId'], 'answer': s['answer'], 'baselineAnswer': b and b['answer'], 'next': s['next'], 'baselineNext': b and b['next']})
        res['submissionDiffs'] = ans
        res['errors'] = [s['errors'] for s in r['subs'] if s['errors']]
        results.append(res)
        print('\n== %s: %d screens, final %s' % (run, res['screens'], res['finalUrl']))
        print('   server next-step path same as baseline: %s (%d submissions)' % (res['serverPathSame'], res['submissions']))
        for a in ans: print('   submission %d: answer %s (baseline %s) next %s (baseline %s)' % (a['n'], json.dumps(a['answer']), json.dumps(a['baselineAnswer']), (a['next'] or '')[:8], (a['baselineNext'] or '')[:8]))
        if not diffs: print('   screens: identical text on every step')
        for d in diffs:
            if 'kind' in d: print('   step %02d: %s' % (d['step'], d['kind'])); continue
            print('   step %02d differs (%s)' % (d['step'], d['label'][:60]))
            if 'text' in d:
                bw = d['text']['baseline']; xw = d['text']['run']
                # show the first differing region
                k = 0
                while k < min(len(bw), len(xw)) and bw[k] == xw[k]: k += 1
                print('      baseline: …%s' % bw[max(0, k - 40):k + 110]); print('      run     : …%s' % xw[max(0, k - 40):k + 110])
            if 'url' in d: print('      url baseline %s | run %s' % (d['url']['baseline'], d['url']['run']))
    if out: json.dump(results, open(out, 'w'), indent=1, ensure_ascii=False)

if __name__ == '__main__':
    main()
