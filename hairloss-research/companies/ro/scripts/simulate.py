# Offline simulator for Ro's served quiz definitions. It never touches the website.
# It walks a saved schema with a set of answers, applies the variable changes and fork rules exactly as
# written in the schema, and (men) applies the recommendation function read from raw/js/48419.chunk.js.
#
# Usage:  python3 -I scripts/simulate.py men   '{"132":["hairline","crown"],"1000":["depression"]}'  [age] [mhl=1]
#         python3 -I scripts/simulate.py women '{"1057":["yes"]}' 38
# Answers: {"<qid>": ["<answer slug>", ...]}. Any question not listed gets the DEFAULT answer below
# (the "nothing wrong" answer), so a one-change experiment is one entry.
# Result = evidence type "code": it shows what the served definition says, not what was seen live.
# Known gap: for a multi-select whose ticked options point to different next questions (only men's qid 132,
# e.g. hairline + patches) the real routing is not known; this script follows the first ticked option.
import json, os, re, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
FILES = {'men': 'quiz-definition.men-onboarding.raw.json', 'women': 'quiz-definition.women-onboarding.raw.json'}
START = {'men': 20, 'women': 4}
DEFAULT = {
 'men': {20: ['regrow-my-hair'], 22: ['hair-loss-solutions-none-of-the-above'], 26: ['didnt-want-or-need-to-until-now'], 28: ['i-want-to-maximize-results-with-a-new-or-additional-product'],
         55: [], 70: ['member-does-not-exist'], 112: ['next'], 132: ['hairline', 'crown'], 150: ['gradually'], 160: ['moderate'], 170: ['none'],
         370: ['no-never-been-diagnosed-with-high-or-low-bp'], 381: ['no-have-not-had-multiple-very-high-bp-readings'], 391: ['no-have-not-had-multiple-very-low-bp-readings'],
         395: ['i-understand-high-or-low-bp-risks'], 1000: ['none'], 1300: ['none'], 2200: ['i-dont-take-any-medications'], 2300: ['i-dont-have-allergies'],
         2350: ['trying-to-get-pregnantn-no-we-are-not'], 2355: ['if-trying-to-get-pregnant-acknowledge-and-continue'], 2400: ['none-of-the-above'], 2510: ['no'], 3177: ['continue'],
         255: ['2-point-5-mg-daily'], 265: ['oral-min-yes-continue-same-regimen'], 285: ['topical-min-yes-continue-same-regimen'], 305: ['1mg-daily'],
         315: ['oral-fin-yes-continue-same-regimen'], 335: ['topical-fin-yes-continue-same-regimen'], 3180: ['continue']},
 'women': {4: ['more-than-a-year'], 6: ['gradually'], 8: ['top-of-head-crown'], 10: ['3'], 30: ['next'], 1050: ['continue'], 1055: ['no'], 1057: ['no'], 1059: ['no'], 12: ['moderate'],
           1062: ['my-hair-is-gradually-thinning-i-m-slowly-noticing-more-of-my-scalp-showing-through-or-my-part-seems-wider-or-my-ponytail-is-thinner'], 1070: ['2'], 1074: ['none-of-the-above'],
           1076: ['yes'], 1078: ['3-somewhat'], 1080: ['3-somewhat'], 1083: ['no'], 1086: ['none-of-the-above'], 1090: ['none-of-the-above'], 1094: ['none-of-the-above'],
           1096: ['none-of-the-above'], 1185: ['no'], 1250: ['none-of-the-above'], 1254: ['no'], 1256: ['no'], 1258: ['liquid'], 1620: ['i-dont-have-conditions'], 1626: ['no'],
           1630: ['i-dont-take-any-medications'], 1640: ['i-dont-have-allergies'], 2200: ['no-answer'], 4042: ['got-it']},
}
STOP_AT = {'men': {3178, 3200, 7010, 7030, 7061, 7062}, 'women': {4025, 4030, 4040, 6000, 6010, 6020, 6030, 6040}}
MASTER = {2500: 2510, 1082: 1083, 1184: 1185, 1625: 1626}   # wrapper question -> embedded radio

def ev(expr, v):
    e = re.sub(r'\band\b', ' and ', expr, flags=re.I); e = re.sub(r'\bor\b', ' or ', e, flags=re.I)
    e = e.replace('true', 'True').replace('false', 'False')
    names = set(re.findall(r'[A-Za-z_][A-Za-z0-9_]*', e)) - {'and', 'or', 'True', 'False'}
    return bool(eval(e, {'__builtins__': {}}, {n: v.get(n, 0) for n in names}))

def setvars(v, mods):
    for k, val in mods or []:
        try: v[k] = int(val)
        except ValueError: v[k] = val

def run(flow, answers, age=None, mhl=1):
    d = json.load(open(BASE + FILES[flow])); Q = {q['qid']: q for g in d['groups'] for q in g['questions']}
    v = {'memberExists': 0, 'memberIsLoggedIn': 0, 'isGSSchema': 0, 'hasMhlConsultativeOvExperiment': mhl, 'userAge': age if age is not None else (32 if flow == 'men' else 38),
         'skipManualIdVerification': 1}
    ans = dict(DEFAULT[flow]); ans.update({int(k): val for k, val in answers.items()})
    qid, path = START[flow], []
    for _ in range(300):
        q = Q[qid]
        if q['type'] == 'fork' or (q['answers'] and all((a.get('meta') or {}).get('condition') for a in q['answers'])):
            rules = q['forking_rules'] or [[str(a['next_qid']), a['meta']['condition']] for a in sorted(q['answers'], key=lambda a: a['position'])]
            qid = next(int(t) for t, cond in rules if ev(cond, v)); continue
        if qid in MASTER: qid = MASTER[qid]; continue
        path.append((qid, q['text'][:70]))
        if qid in STOP_AT[flow]: break
        setvars(v, q['variable_modifications'])
        chosen = [a for a in sorted(q['answers'], key=lambda a: a['position']) if a['slug'] in ans.get(qid, [])]
        if q['answers'] and not chosen and qid in ans and ans[qid]:
            raise SystemExit('qid %d has no answer slug %s; options: %s' % (qid, ans[qid], [a['slug'] for a in q['answers']]))
        if q['answers'] and not chosen and q['type'] in ('choice', 'multichoice') and qid not in (55,):
            raise SystemExit('no default answer for qid %d %r; options: %s' % (qid, q['text'], [a['slug'] for a in q['answers']]))
        for a in chosen: setvars(v, a['variable_modifications'])
        path[-1] += ([a['slug'] for a in chosen],)
        nxt = (chosen[0]['next_qid'] if chosen and chosen[0]['next_qid'] else None) or q['next_qid']
        if not nxt or nxt == -1: break
        qid = nxt
    out = {'path': path, 'end': path[-1][:2]}
    if flow == 'men':
        flags = {k: v.get(k, 0) for k in ('noRecTopicalCombined', 'noRecOralFin', 'noRecOralMin')}
        order = [('hl-topical-spray-group', 'noRecTopicalCombined', 'Ro Mane Spray'), ('hs-finasteride', 'noRecOralFin', 'oral finasteride'), ('hl-oral-minoxidil', 'noRecOralMin', 'oral minoxidil')]
        ok = [name for code, f, name in order if v.get(f, 0) != 1]
        out['flags'] = flags
        out['recommended'] = (ok[0] if ok else 'no-recommendation') if path[-1][0] == 3178 else '(recommender screen not reached)'
    else:
        out['vars'] = {k: v.get(k, 0) for k in ('ifNotEligibleForOralMinoxidil', 'ifNotEligibleForTopicalMinoxidil', 'userAge')}
        out['result'] = {4025: 'choice: Oral Minoxidil / Hair Solution Rx / No preference (default oral minoxidil)', 4030: 'Hair Solution Rx only', 4040: 'Oral Minoxidil only',
                         6040: 'STOP: see an in-person dermatologist', 6020: 'STOP: pregnancy', 6010: 'STOP: under 18', 6030: 'redirect to men', 6000: 'STOP: zip'}.get(path[-1][0], 'ended at qid %d' % path[-1][0])
    return out

if __name__ == '__main__':
    pos = [a for a in sys.argv[1:] if not a.startswith('--') and not a.startswith('mhl=')]
    flow = pos[0]; answers = json.loads(pos[1]) if len(pos) > 1 else {}
    age = int(pos[2]) if len(pos) > 2 else None
    mhl = 0 if 'mhl=0' in sys.argv else 1
    r = run(flow, answers, age, mhl)
    if '--path' in sys.argv:
        for p in r['path']: print('  ', p)
    print({k: val for k, val in r.items() if k != 'path'}, '| screens:', len(r['path']))
