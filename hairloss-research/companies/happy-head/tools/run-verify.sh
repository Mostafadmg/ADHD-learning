#!/bin/bash
# Stage 3 runner: one replay at a time. Usage: bash tools/run-verify.sh id ...  (answers in runs/verify/<id>.json, output runs/verify-<id>/)
cd "$(dirname "$0")/.."
for id in "$@"; do
  s=$(date +%s)
  node tools/walk-fast.js runs/verify/$id.json runs/$id --last > runs/verify/$id.log 2>&1; rc=$?
  if [ $rc -ne 0 ] && ! grep -q 'FAILED' runs/verify/$id.log; then echo "[$id] exit $rc, retry after 30 s"; sleep 30; node tools/walk-fast.js runs/verify/$id.json runs/$id --last > runs/verify/$id.log 2>&1; rc=$?; fi
  posts=$(grep -c 'middleware%2Fembeddables' runs/$id/network.jsonl)
  echo "[$id] exit $rc, $(( $(date +%s) - s )) s, consultation posts: $posts | $(grep -m1 'FAILED' runs/verify/$id.log)"
done
