#!/bin/bash
# Runs the named experiments one after another (never in parallel). Usage: bash tools/run-batch.sh id1 id2 ...
cd "$(dirname "$0")/.."
for id in "$@"; do
  s=$(date +%s)
  node tools/walk-fast.js runs/s2/$id.json runs/s2/$id --last > runs/s2/$id.log 2>&1; rc=$?
  if [ $rc -ne 0 ]; then echo "[$id] exit $rc, retry after 30 s"; sleep 30; node tools/walk-fast.js runs/s2/$id.json runs/s2/$id --last > runs/s2/$id.log 2>&1; rc=$?; fi
  posts=$(grep -c 'middleware%2Fembeddables' runs/s2/$id/network.jsonl)
  echo "[$id] exit $rc, $(( $(date +%s) - s )) s, consultation posts: $posts | $(grep -m1 'FAILED' runs/s2/$id.log)"
  sleep 3
done
