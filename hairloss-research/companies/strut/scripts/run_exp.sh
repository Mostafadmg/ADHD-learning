#!/bin/bash
# Stage 2 helper: run experiments one after another (never in parallel) and compare each with the US baseline.
# Usage (from the strut folder): bash scripts/run_exp.sh exp-04-dose-1-25 exp-05-selfharm-yes ...
cd "$(dirname "$0")/.."
for id in "$@"; do
  echo "################ $id"
  node scripts/walk_fast.js experiments/$id.json runs/$id --last > runs/$id.log 2>&1; code=$?
  if [ $code -ne 0 ]; then echo "exit $code: waiting 30 s and retrying once"; sleep 30; node scripts/walk_fast.js experiments/$id.json runs/$id --last > runs/$id.log 2>&1; code=$?; fi
  echo "exit $code"; tail -1 runs/$id.log
  [ $code -ne 0 ] && grep -A12 "FAILED" runs/$id.log | head -30
  python3 -I scripts/compare_runs.py runs/$id runs/baseline-us | grep -v "^  \["
  cp experiments/$id.json runs/$id/actions.json
  sleep 4
done
