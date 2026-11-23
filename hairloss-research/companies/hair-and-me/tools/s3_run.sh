#!/bin/bash
# s3_run.sh <id> [<id> ...] — stage 3 (VERIFY) replays, ONE AT A TIME (never in parallel), with a pause between visits.
# verify-base-men* / verify-base-women* replay a baseline answer file; any other id uses runs/<id>.json (written by tools/s3_make.py).
cd "$(dirname "$0")/.."
for id in "$@"; do
  case "$id" in
    verify-base-men*) f=baseline-men.json ;;
    verify-base-women*) f=baseline-women.json ;;
    *) f=runs/$id.json ;;
  esac
  mkdir -p runs/$id
  echo "[$(date +%H:%M:%S)] start $id"
  timeout 420 node tools/autowalk.js "$f" runs/$id > runs/$id/walk.log 2>&1
  echo "[$(date +%H:%M:%S)] done  $id exit=$? :: $(grep -E 'STOP: no answer|NO NEW STEP|could not|FATAL' runs/$id/walk.log | head -2 | cut -c1-200)"
  sleep 6
done
echo ALL-DONE
