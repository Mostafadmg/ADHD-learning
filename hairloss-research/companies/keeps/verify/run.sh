#!/bin/bash
# Stage 3 runner: bash verify/run.sh <actions.json> <run-id>  (one at a time, retry once after 30 s)
cd "$(dirname "$0")/.."
f=$1; id=$2
for try in 1 2; do
  rm -rf "runs/$id"; mkdir -p "runs/$id"
  timeout 280 node ../../tools/walk.js "$f" "runs/$id" --last > "runs/$id/walk.log" 2>&1
  rc=$?
  [ $rc -eq 0 ] && break
  [ $try -eq 1 ] && { echo "$id: exit $rc, retry in 30 s"; sleep 30; }
done
last=$(ls runs/$id/[0-9][0-9].txt 2>/dev/null | tail -1)
echo "$id | exit $rc | $(basename "$last") | $(grep -m1 '^URL:' "$last")"
