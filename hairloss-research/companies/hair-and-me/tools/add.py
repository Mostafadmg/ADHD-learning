#!/usr/bin/env python3
# add.py <answers.json> <stepId> '<json answer>'  — add/replace one answer in an autowalk answers file
import json, sys
f, k, v = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
a = json.load(open(f)); a.setdefault('answers', {})[k] = v
json.dump(a, open(f, 'w'), indent=1, ensure_ascii=False)
