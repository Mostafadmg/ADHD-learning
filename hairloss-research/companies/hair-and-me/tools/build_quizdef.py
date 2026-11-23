#!/usr/bin/env python3
"""build_quizdef.py — merge every step definition the page fetched in runs/*/steps/*.json into quiz-definition.json.

Hair + Me does not serve one quiz file. The server sends one step at a time (GET api.hairandme.com/consultation/suh/<stepId>)
and names the next step in its reply to each answer (POST ... -> {"slug": "<next>"}). This script collects:
  steps[<stepId>].variants[]  every distinct version of that step that was served (titles / question ids differ between visits)
  steps[<stepId>].seenIn      which runs, and the sex-at-birth answer in that run
  transitions[]               every observed "from -> to" edge with the answer that was posted
Run it again after new runs to refresh the file.
"""
import json, glob, os, re, collections
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
steps = collections.OrderedDict(); trans = collections.OrderedDict(); runsinfo = {}
for run in sorted(glob.glob(os.path.join(base, 'runs', '*', 'api.jsonl'))):
    rid = run.split('/')[-2]
    sex = None; order = []; ft = None
    for line in open(run):
        try: e = json.loads(line)
        except Exception: continue
        if 'feature-tests' in e['url']:
            try: ft = json.loads(e['body'])
            except Exception: pass
        m = re.search(r'/consultation/suh/([a-z0-9-]+)$', e['url'])
        if not m: continue
        sid = m.group(1)
        if e['method'] == 'GET' and e['status'] == 200:
            try: d = json.loads(e['body'])['step']
            except Exception: continue
            if sid not in order: order.append(sid)
            v = {'title': d.get('title'), 'description': d.get('description'), 'breadcrumb': d.get('breadcrumb'), 'actionsList': d.get('actionsList'), 'questions': d.get('questions')}
            # drop per-visit values so identical definitions compare equal
            key = json.dumps(v, sort_keys=True)
            key = re.sub(r'"consultationExternalId": "[^"]+"', '"consultationExternalId": "<per-visit id>"', key)
            if sid in ('ar', 'ct', 'pdsc'): key = sid + '|' + json.dumps([(q['id'], q['inputType']) for q in d['questions']]) + '|' + str(d.get('title'))
            st = steps.setdefault(sid, {'variants': collections.OrderedDict(), 'seenIn': []})
            if key not in st['variants']: st['variants'][key] = {'definition': json.loads(re.sub(r'"consultationExternalId": "[^"]+"', '"consultationExternalId": "<per-visit id>"', json.dumps(v))), 'runs': []}
            if rid not in st['variants'][key]['runs']: st['variants'][key]['runs'].append(rid)
        if e['method'] == 'POST':
            try:
                p = json.loads(e.get('post') or '{}'); nxt = json.loads(e['body']).get('slug')
            except Exception: continue
            ans = [{'questionId': q['id'], 'value': q.get('value')} for q in p.get('questions', []) if q.get('value') is not None and q['inputType'] not in ('display_text', 'markdown', 'interstitial', 'cart_summary', 'cart_totals', 'promo_code', 'display_text_with_image')]
            for a in ans:
                if a['questionId'] == 3039: sex = {1: 'Male', 2: 'Female'}.get(a['value'], a['value'])
            k = (sid, nxt)
            t = trans.setdefault(k, {'from': sid, 'to': nxt, 'examples': []})
            if len(t['examples']) < 6: t['examples'].append({'run': rid, 'posted': ans})
    runsinfo[rid] = {'sexAtBirth': sex, 'featureTest': ft, 'stepOrder': order}
    for sid in order:
        steps[sid]['seenIn'].append({'run': rid, 'sexAtBirth': sex})
out = {
  '_about': 'Hair + Me consultation "sign-up-hair" (short name "suh"), assembled from the step JSON the site served to an anonymous browser during the runs listed. It is NOT a single file the site serves: the server sends one step at a time and decides the next step itself, so branches that no run reached are not in here. Step "yd" (legal name) is the account wall; nothing after it was requested.',
  'source': 'GET https://api.hairandme.com/consultation/suh/<stepId> (step definitions) and the replies to POST .../<stepId> (next step), as recorded in runs/*/api.jsonl',
  'builtFrom': sorted(runsinfo.keys()),
  'runs': runsinfo,
  'steps': {sid: {'variants': list(s['variants'].values()), 'seenIn': s['seenIn']} for sid, s in steps.items()},
  'transitions': list(trans.values()),
}
json.dump(out, open(os.path.join(base, 'quiz-definition.json'), 'w'), indent=1, ensure_ascii=False)
print(len(steps), 'steps;', sum(len(s['variants']) for s in steps.values()), 'variants;', len(trans), 'transitions;', len(runsinfo), 'runs')
for sid, s in steps.items():
    sexes = collections.Counter(x['sexAtBirth'] for x in s['seenIn'])
    print(f"{sid:5} variants={len(s['variants'])} seen={dict(sexes)}  {list(s['variants'].values())[0]['definition']['title']}")
