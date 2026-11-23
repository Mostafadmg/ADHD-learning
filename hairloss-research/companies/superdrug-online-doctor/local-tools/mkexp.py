#!/usr/bin/env python3
"""mkexp.py — build a one-change answer file from a baseline.
Usage: python3 mkexp.py <baseline.json> <out.json> "<what changed>" <op> [<op> ...]
Each op is JSON:
  {"replace": "<selector prefix of the baseline step>", "with": [steps]}   swap one baseline step for new steps
  {"after":   "<selector prefix>", "add": [steps]}                          add steps after a baseline step
Selectors are matched by prefix against step.selector. Exactly one baseline step must match."""
import json, sys
base, out, changed, *ops = sys.argv[1:]
d = json.load(open(base))
steps = d['steps']
for raw in ops:
    op = json.loads(raw)
    key = op.get('replace') or op.get('after')
    idx = [i for i, s in enumerate(steps) if s.get('selector', '').startswith(key)]
    assert len(idx) == 1, (key, idx)
    i = idx[0]
    if 'replace' in op: steps[i:i+1] = op['with']
    else: steps[i+1:i+1] = op['add']
d['_changed'] = changed
d['_about'] = 'ONE-CHANGE EXPERIMENT from ' + base.split('/')[-1] + ': ' + changed
json.dump(d, open(out, 'w'), indent=2)
print('wrote', out, len(steps), 'steps')
