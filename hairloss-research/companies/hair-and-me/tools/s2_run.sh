#!/bin/bash
# s2_run.sh <id> [<id> ...] — replay stage 2 experiments ONE AT A TIME (never in parallel), with a pause between visits.
# "base-men" / "base-women" suffixes replay a baseline: e.g. s2-base-women-1 uses baseline-women.json.
cd "$(dirname "$0")/.."
for id in "$@"; do
  case "$id" in
    s2-base-men-*) f=baseline-men.json ;;
    s2-base-women-*) f=baseline-women.json ;;
    *) f=runs/$id.json ;;
  esac
  mkdir -p runs/$id
  echo "[$(date +%H:%M:%S)] start $id"
  timeout 420 node tools/autowalk.js "$f" runs/$id > runs/$id/walk.log 2>&1
  echo "[$(date +%H:%M:%S)] done  $id exit=$? :: $(grep -E 'STOP: no answer|NO NEW STEP|could not|FATAL' runs/$id/walk.log | head -2 | cut -c1-160)"
  sleep 6
done
echo ALL-DONE
