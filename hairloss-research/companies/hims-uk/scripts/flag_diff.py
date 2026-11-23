#!/usr/bin/env python3
"""Compare the feature flags LaunchDarkly served to each fresh anonymous browser (one per run).
Shows flags whose value differs between runs = per-visitor experiments. Usage: python3 -I scripts/flag_diff.py runs/exp-*"""
import json, glob, os, sys
vals = {}
runs = []
flowver = {}
for run in sys.argv[1:]:
    fs = glob.glob(os.path.join(run, 'net', '*app_launchdarkly_com_sdk_evalx*'))
    if not fs: continue
    try: d = json.load(open(fs[0]))
    except Exception: continue
    runs.append(run)
    for k, v in d.items():
        vals.setdefault(k, {})[run] = json.dumps(v.get('value') if isinstance(v, dict) else v, sort_keys=True)
    try:
        s = json.load(open(os.path.join(run, 'storage.json')))
        flowver[run] = s['local'].get('anonymous_flow_version_id')
    except Exception: pass
print('runs with flags:', len(runs), '| flags:', len(vals))
n = 0
for k in sorted(vals):
    distinct = set(vals[k].values())
    if len(distinct) > 1 or len(vals[k]) != len(runs):
        n += 1
        counts = {}
        for r, v in vals[k].items(): counts.setdefault(v[:80], []).append(os.path.basename(r))
        print(k, {v: len(rs) for v, rs in counts.items()}, '| missing in', len(runs) - len(vals[k]))
print('flags that differ between runs:', n)
print('flow version ids seen:', {v: list(flowver.values()).count(v) for v in set(flowver.values())})
