#!/usr/bin/env python3
"""Build quiz-definition.json from everything the site served to the anonymous browser.

Sources (all saved by scripts/session.js in runs/<session>/net/):
  * GET  /v1/subscriptions/<id>/sq/<question_id>   -> question text, type, options, question_index, number_of_questions
  * GET/PATCH /v1/subscriptions/<id>               -> attributes.questionnaire_with_responses.questions[]: for every question
        already answered, EVERY option with its engine result (proceed / reject + patient message / complete,
        and query_clinically = note that sends the case to a clinician queue, often with internal guidance text)
  * POST /v1/subscriptions/<id>/sq/<question_id>/answer -> traversal_hint (which question comes next for the answer given)
Usage: python3 -I scripts/build-quiz-definition.py   (run from the numan folder)
"""
import json, glob, os, re, sys
base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
qs = {}          # id -> merged question
edges = []       # observed transitions
meta = {}
for run in sorted(glob.glob(os.path.join(base, 'runs', 's*'))):
    if not os.path.isdir(run): continue
    netlog = os.path.join(run, 'network.jsonl')
    if not os.path.exists(netlog): continue
    for line in open(netlog, encoding='utf8'):
        try: e = json.loads(line)
        except Exception: continue
        url = e.get('url', ''); f = e.get('file')
        if not f or 'api.numan.com/v1/subscriptions' not in url: continue
        try: body = json.load(open(os.path.join(run, f), encoding='utf8'))
        except Exception: continue
        m = re.search(r'/sq/([a-z0-9_]+)$', url)
        if m and e.get('method') == 'GET':
            d = body.get('data', {}); a = d.get('attributes', {})
            q = qs.setdefault(d.get('id'), {'id': d.get('id')})
            q.update({'question_index': d.get('question_index'), 'type': a.get('type'), 'content': a.get('content'),
                      'is_optional': a.get('is_optional'), 'placeholder': a.get('placeholder'), 'validate_number': a.get('validate_number'), 'action': a.get('action')})
            meta['number_of_questions'] = d.get('number_of_questions')
            if a.get('options') and 'options' not in q:
                q['options'] = [dict(o) for o in a['options']]
            q.setdefault('seen_in', [])
            if os.path.basename(run) not in q['seen_in']: q['seen_in'].append(os.path.basename(run))
            continue
        m = re.search(r'/sq/([a-z0-9_]+)/answer$', url)
        if m and e.get('method') == 'POST':
            try: ans = json.loads(e.get('post') or '{}').get('data', {}).get('answer')
            except Exception: ans = None
            hint = body.get('data', {}).get('attributes', {})
            edges.append({'run': os.path.basename(run), 'question': m.group(1), 'answer': ans, 'hint': hint.get('type'), 'next': hint.get('question_id')})
            continue
        if re.search(r'/v1/subscriptions/[0-9a-f-]+$', url):
            qr = body.get('data', {}).get('attributes', {}).get('questionnaire_with_responses') or {}
            for k in ('id', 'version', 'revision'): 
                if k in qr: meta['questionnaire_' + k] = qr[k]
            for qq in qr.get('questions', []):
                q = qs.setdefault(qq['id'], {'id': qq['id']})
                q.setdefault('type', qq.get('type')); q.setdefault('content', qq.get('content'))
                if qq.get('options'):
                    q['options'] = [dict(o) for o in qq['options']]   # these carry "result"
                    q['results_known'] = True
                for k, v in qq.items():
                    if k not in ('id', 'type', 'content', 'options', 'answer', 'created_at', 'updated_at'): q[k] = v
out = {
    'source': 'Numan hair-loss consultation, served to an anonymous browser by api.numan.com (see scripts/build-quiz-definition.py for the exact endpoints)',
    'captured_on': '2026-11-23',
    'meta': meta,
    'questions': sorted(qs.values(), key=lambda q: (q.get('question_index') is None, q.get('question_index') or 0)),
    'observed_transitions': edges,
}
json.dump(out, open(os.path.join(base, 'quiz-definition.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(meta, len(out['questions']), 'questions,', len(edges), 'transitions')
for q in out['questions']:
    print(f"{q.get('question_index')!s:>4} {q['id']:<48} {q.get('type'):<14} results_known={q.get('results_known', False)} opts={len(q.get('options') or [])}")
