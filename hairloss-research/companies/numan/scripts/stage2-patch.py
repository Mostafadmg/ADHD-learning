# Stage 2 patch: adds experiments (and later rules etc.) to company.json without rebuilding stage-1 content.
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from stage2_exps import E
p = os.path.join(os.path.dirname(__file__), '..', 'company.json')
c = json.load(open(p))
keep = [e for e in c['experiments'] if not e['id'].startswith('x2-')]
c['experiments'] = keep + [{'id': i, 'flow': f, 'changed': ch, 'result': r, 'run': 'runs/' + i} for i, f, ch, r in E]
try:
    import stage2_rules as R; R.apply(c)
except ImportError:
    pass
json.dump(c, open(p, 'w'), indent=1, ensure_ascii=False)
print('experiments', len(c['experiments']), 'rules', len(c['rules']))
