#!/bin/bash
# Run one-change experiments one after another (one browser at a time, pause between runs).
# Usage: bash scripts/run_batch.sh exp-01 exp-02 ...     (from companies/hims-uk)
cd "$(dirname "$0")/.." || exit 1
for id in "$@"; do
  if [ -f "runs/$id/DONE" ]; then echo "[batch] $id already done"; continue; fi
  echo "[batch] $(date +%H:%M:%S) start $id"
  node scripts/walk-full.js "experiments/$id.json" "runs/$id" --last > "runs/$id.log" 2>&1
  code=$?
  python3 -I scripts/redact.py "runs/$id" >> "runs/$id.log" 2>&1
  echo "[batch] $(date +%H:%M:%S) end $id exit $code"
  [ $code -eq 0 ] && touch "runs/$id/DONE"
  sleep 6
done
echo "[batch] ALL DONE"
