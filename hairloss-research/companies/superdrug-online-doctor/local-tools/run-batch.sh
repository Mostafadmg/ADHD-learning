#!/bin/bash
# run-batch.sh <exp-id> [<exp-id> ...] — runs experiments ONE AT A TIME in the foreground, 3 s apart; retries once after 30 s on failure.
cd "$(dirname "$0")/.."
for id in "$@"; do
  echo "=================== $id"
  node local-tools/exp.js actions/$id.json runs/$id > runs/.last.log 2>&1; rc=$?
  if [ $rc -ne 0 ]; then echo "(failed rc=$rc, waiting 30 s and retrying once)"; sleep 30; node local-tools/exp.js actions/$id.json runs/$id > runs/.last.log 2>&1; rc=$?; fi
  python3 - "$id" "$rc" <<'PY'
import json,sys
i,rc=sys.argv[1],sys.argv[2]
try:
    s=json.load(open(f'runs/{i}/summary.json'))
    print('rc',rc,'| changed:',s.get('changed'))
    print('  failed:',s.get('failedStep'),'| product screen:',s.get('reachedProductScreen'),'| retries:',s.get('retries',0))
    print('  products:',' ; '.join(s.get('products',[])))
    print('  save:',s.get('saveReply')); print('  rules:',s.get('productRulesReply'))
    if not s.get('reachedProductScreen'): print('  POST TEXT:',(s.get('postText') or '')[:1500])
except Exception as e: print('no summary',e)
PY
  sleep 3
done
