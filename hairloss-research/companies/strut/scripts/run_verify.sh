#!/bin/bash
# Stage 3 helper: re-run a stage 2 experiment file fresh into runs/verify-<exp-id>, one at a time, and compare with the
# fresh stage 3 baseline runs/verify-baseline-min. Usage: bash scripts/run_verify.sh exp-01-age-under18 ...
cd "$(dirname "$0")/.."
for id in "$@"; do
  out=runs/verify-$id; echo "################ $out"
  node scripts/walk_fast.js experiments/$id.json $out --last > $out.log 2>&1; code=$?
  if [ $code -ne 0 ]; then echo "exit $code: waiting 30 s and retrying once"; sleep 30; node scripts/walk_fast.js experiments/$id.json $out --last > $out.log 2>&1; code=$?; fi
  echo "exit $code"; [ $code -ne 0 ] && grep -A12 "FAILED" $out.log | head -30
  python3 -I scripts/compare_runs.py $out runs/verify-baseline-min | grep -v "^  \["
  cp experiments/$id.json $out/actions.json
  sleep 4
done
