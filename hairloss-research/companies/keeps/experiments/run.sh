#!/bin/bash
# Runs the named experiments ONE AT A TIME in the foreground. Usage: bash experiments/run.sh exp-01 exp-02 ...
# A failed or timed-out replay is retried once after 30 seconds.
cd "$(dirname "$0")/.."
for id in "$@"; do
  for try in 1 2; do
    rm -rf "runs/$id"; mkdir -p "runs/$id"
    timeout 240 node ../../tools/walk.js "experiments/$id.json" "runs/$id" --last > "runs/$id/walk.log" 2>&1
    rc=$?
    if [ $rc -eq 0 ]; then break; fi
    if [ $try -eq 1 ]; then echo "$id: exit $rc, retrying in 30 s"; sleep 30; fi
  done
  last=$(ls runs/$id/[0-9][0-9].txt 2>/dev/null | tail -1)
  url=$(grep -m1 '^URL:' "$last" 2>/dev/null)
  echo "$id | exit $rc | $(basename "$last") | $url"
  sleep 2
done
