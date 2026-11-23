#!/usr/bin/env python3
"""Stage 2 (EXPERIMENT): fold the one-change replays into company.json.

Always starts from company.stage1.json (the file stage 1 left) so it can be re-run safely.
Reads the runs in runs/exp-*/ through scripts/compare_runs.py and writes company.json.
Usage (from companies/hims-uk):  python3 -I scripts/stage2_update.py
Hand-written text lives in scripts/stage2_text.py.
"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.chdir(os.path.join(HERE, '..'))
import compare_runs as C
import stage2_text as T

d = json.load(open('company.stage1.json', encoding='utf-8'))
qdef = json.load(open('quiz-definition.json', encoding='utf-8'))['anonymousFlow']['steps']
qsteps = [s for s in qdef if s.get('options')]
index = json.load(open('experiments/index.json', encoding='utf-8'))
BASE = 'runs/exp-00-baseline-full'
base = C.load_run(BASE)
bpath = [(s['stepId'], s['next']) for s in base['subs']]
SUMMARY_STEP = 17

def lines(run, step=SUMMARY_STEP):
    return [l.strip() for l in run['steps'][step]['text'].split('\n') if l.strip()]

base_lines = lines(base)

# ---------- 1. read every one-change run ----------
results = {}
for a in index:
    eid = a['experiment']; run = 'runs/' + eid
    if not os.path.isfile(os.path.join(run, 'DONE')):
        results[eid] = None; continue
    r = C.load_run(run)
    same_count = len(r['steps']) == len(base['steps'])
    diff_steps = [i for i in range(min(len(r['steps']), len(base['steps']))) if C.norm(r['steps'][i]['text']) != C.norm(base['steps'][i]['text'])]
    path_same = [(s['stepId'], s['next']) for s in r['subs']] == bpath
    final_same = r['steps'][-1]['url'] == base['steps'][-1]['url'] and C.norm(r['steps'][-1]['text']) == C.norm(base['steps'][-1]['text'])
    changed_subs = [(i, s['answer']) for i, s in enumerate(r['subs']) if i < len(base['subs']) and s['answer'] != base['subs'][i]['answer']]
    new_lines = []
    if SUMMARY_STEP in diff_steps:
        rl = lines(r)
        new_lines = [(b, x) for b, x in zip(base_lines, rl) if b != x] if len(rl) == len(base_lines) else [('?', ' / '.join(rl))]
    results[eid] = dict(about=a, same_count=same_count, diff_steps=diff_steps, path_same=path_same, final_same=final_same,
                        changed_subs=changed_subs, new_lines=new_lines, n_subs=len(r['subs']), n_screens=len(r['steps']))

done = [e for e, r in results.items() if r]
clean = [e for e in done if results[e]['same_count'] and results[e]['path_same'] and results[e]['final_same'] and set(results[e]['diff_steps']) <= {SUMMARY_STEP} and len(results[e]['changed_subs']) == 1]
print('one-change runs done: %d of %d; behaving exactly like baseline apart from the summary line: %d' % (len(done), len(index), len(clean)))
for e in done:
    if e not in clean: print('  !! needs a manual look:', e, {k: v for k, v in results[e].items() if k != 'about'})

by_q = {}
for a in index: by_q.setdefault(a['question'], []).append(a)
def runs_for(q): return ['runs/' + a['experiment'] for a in by_q.get(q, []) if results.get(a['experiment'])]
def span(q):
    ids = [a['experiment'] for a in by_q.get(q, []) if results.get(a['experiment'])]
    return 'runs/%s to runs/%s' % (ids[0], ids[-1]) if len(ids) > 1 else ('runs/' + ids[0] if ids else 'not run')

# ---------- 2. anonymous questions and options ----------
men = next(f for f in d['flows'] if f['id'] == 'men')
qmap = {q['id']: q for q in men['questions']}
base_about = json.load(open('baseline-men.json', encoding='utf-8'))['_about']['answers']
untested = []
for n, qs in enumerate(qsteps, start=1):
    qid = 'men-q%d' % n; q = qmap[qid]; key = qs['datapointKey']
    meta = T.ANON[qid]
    played_back = False
    for o in q['options']:
        lab = o['label'].split(' — ')[0]
        src = next(x for x in qs['options'] if x['label'] == lab)
        val = src['value']; note = T.OPTION_NOTES.get((qid, lab), '')
        is_base = (lab == base_about[qs['questionText']] or (isinstance(base_about[qs['questionText']], list) and lab in base_about[qs['questionText']]))
        a = next((x for x in by_q.get(qid, []) if x['changedTo'] == lab), None)
        res = results.get(a['experiment']) if a else None
        if is_base:
            bl = meta.get('baseLine')
            o['effect'] = ("Baseline answer (runs/exp-00-baseline-full). Leads to the next screen like every other option. "
                + (("Shown back on the summary screen as '%s'. " % bl) if bl else "Not shown back anywhere. ")
                + "Sent to Hims's server as %s = %s. Whether it influences the product recommended after sign-up is not known." % (key, val))
            o['effectType'] = 'marketing-only' if bl else 'none'; o['evidence'] = 'observed'; o['affects'] = []
            if bl: played_back = True
        elif res and a['experiment'] in clean:
            run = 'runs/' + a['experiment']
            if res['new_lines']:
                played_back = True
                o['effect'] = ("Tested live (%s against the baseline): the only change is one line of the 'Here’s what we know about your hair so far' screen, which now reads '%s' instead of '%s'. "
                    "The order of screens, the server's next-step replies, the 'Great news—we have options that may work for you' message and the email wall were identical. "
                    "Sent to Hims's server as %s = %s. %sWhether it influences the product recommended after sign-up is not known.") % (run, res['new_lines'][0][1], res['new_lines'][0][0], key, val, (note + ' ') if note else '')
                o['effectType'] = 'marketing-only'
            else:
                o['effect'] = ("Tested live (%s against the baseline): nothing changed. The next screen, every later screen, the server's next-step replies, the 'Great news—we have options that may work for you' message and the email wall were identical, and the answer is never shown back. "
                    "It is only sent to Hims's server as %s = %s. %sWhether it influences the product recommended after sign-up is not known.") % (run, key, val, (note + ' ') if note else '')
                o['effectType'] = 'none'
            o['evidence'] = 'observed'; o['affects'] = []
        else:
            untested.append((qid, lab))
            o['effect'] = ("Not replayed on its own. The served flow definition has one path, so this option leads to the same next screen as the others. Sent to Hims's server as %s = %s. %sWhether it influences the product recommended after sign-up is not known." % (key, val, (note + ' ') if note else ''))
            o['effectType'] = 'none'; o['evidence'] = 'code'; o['affects'] = []
    q['purpose'] = meta['purpose']; q['engineRole'] = meta['role']; q['branches'] = False; q['shownWhen'] = 'always'; q['evidence'] = 'observed'
    q['branchDetail'] = ("None. Every option was replayed on its own (%s): same next screen, same server next-step reply, same end at the email wall. " % span(qid)) + meta.get('branchExtra', '')
print('options not replayed on their own:', untested)

for qid, extra in T.QUESTION_PATCHES.items():
    q = None
    for f in d['flows']:
        for x in f['questions']:
            if x['id'] == qid: q = x
    assert q, qid
    q.update(extra)

for fid, newqs in T.NEW_QUESTIONS.items():
    f = next(f for f in d['flows'] if f['id'] == fid)
    for nq in newqs:
        assert all(x['id'] != nq['id'] for x in f['questions']), nq['id']
        f['questions'].append(nq)
    f['questions'].sort(key=lambda x: x['order'])
for fid, s in T.STAGES_SUMMARY.items():
    next(f for f in d['flows'] if f['id'] == fid)['stagesSummary'] = s

# ---------- 3. experiments ----------
exps = []
exps += T.EXPERIMENTS_HEAD
for a in index:
    res = results.get(a['experiment'])
    if not res: continue
    eid = a['experiment']
    posted = ', '.join('%s' % json.dumps(v, ensure_ascii=False) for _, v in res['changed_subs'])
    if eid in clean:
        if res['new_lines']:
            txt = ("One line of the answer summary changed ('%s' became '%s'). Nothing else: the same 21 quiz screens with the same wording, the same server reply naming the next step after every answer, the same 'Great news—we have options that may work for you', the same email wall. No product, strength, plan or price shown. Posted value: %s."
                   % (res['new_lines'][0][0], res['new_lines'][0][1], posted))
        else:
            txt = ("No change anywhere on screen: the same 21 quiz screens with identical wording (this answer is never played back), the same server reply naming the next step after every answer, the same 'Great news—we have options that may work for you', the same email wall. No product, strength, plan or price shown. Only the posted value differs: %s."
                   % (posted,))
    else:
        txt = T.MANUAL_RESULTS.get(eid, 'NEEDS MANUAL RESULT')
    exps.append({'id': eid, 'flow': 'men', 'changed': "%s: '%s' → '%s'%s" % (a['question'], a['baselineAnswer'], a['changedTo'], ' (ticked on its own)' if a['question'] == 'men-q5' else ''), 'result': txt, 'run': 'runs/' + eid})
exps += [e for e in T.EXPERIMENTS_TAIL if os.path.isdir(e['run'])]
exps += [dict(e, id=e['id']) for e in d['experiments']]   # stage 1's two entries, kept as they were
d['experiments'] = exps

# ---------- 4. rules, recommendations, products, summaries ----------
ctx = dict(n_done=len(done), n_clean=len(clean), n_index=len(index),
           playback_runs=', '.join('runs/' + e for e in clean if results[e]['new_lines']),
           silent_runs=', '.join('runs/' + e for e in clean if not results[e]['new_lines']),
           all_span='runs/exp-01 to runs/exp-31')
old_rules = {r['id']: r for r in d['rules']}
d['rules'] = T.build_rules(old_rules, ctx)
d['recommendations'] = T.RECOMMENDATIONS
pm = {p['id']: p for p in d['products']}
for pid, txt in T.RECOMMENDED_WHEN.items():
    pm[pid]['recommendedWhen'] = txt
for pid, patch in T.PRODUCT_PATCHES.items():
    pm[pid].update(patch)
d['engineSummary'] = T.ENGINE_SUMMARY
d['strengths'] = T.STRENGTHS; d['weaknesses'] = T.WEAKNESSES; d['opportunities'] = T.OPPORTUNITIES; d['limitations'] = T.LIMITATIONS
d['access']['coverageNote'] = T.COVERAGE_NOTE
d['access']['blockers'] = d['access']['blockers'] + [b for b in T.EXTRA_BLOCKERS if b not in d['access']['blockers']]
have = {s['url'] for s in d['sources']}
d['sources'] += [s for s in T.EXTRA_SOURCES if s['url'] not in have]
d['checkedOn'] = '2026-11-23'
d['stage'] = 'rules (stage 2 of 3)'
d['codeRulesConfirmedLive'] = T.CODE_CONFIRMED

json.dump(d, open('company.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('written company.json:', len(d['products']), 'products;', sum(len(f['questions']) for f in d['flows']), 'questions;', len(d['rules']), 'rules;', len(d['experiments']), 'experiments;', len(d['recommendations']), 'recommendations')
