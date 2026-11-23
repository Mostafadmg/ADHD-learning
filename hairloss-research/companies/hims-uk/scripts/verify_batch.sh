#!/bin/bash
# Stage 3 (verify): run reviewer replays one after another (one browser at a time, pause between runs).
# Usage: bash scripts/verify_batch.sh verify-01-no-hair ...   (from companies/hims-uk). Extra walk flags: WALKFLAGS="--mobile"
cd "$(dirname "$0")/.." || exit 1
for id in "$@"; do
  if [ -f "runs/$id/DONE" ]; then echo "[verify] $id already done"; continue; fi
  echo "[verify] $(date +%H:%M:%S) start $id"
  node scripts/walk-full.js "experiments/$id.json" "runs/$id" --last $WALKFLAGS > "runs/$id.log" 2>&1
  code=$?
  python3 -I scripts/redact.py "runs/$id" >> "runs/$id.log" 2>&1
  echo "[verify] $(date +%H:%M:%S) end $id exit $code"
  [ $code -eq 0 ] && touch "runs/$id/DONE"
  sleep 6
done
echo "[verify] ALL DONE"
