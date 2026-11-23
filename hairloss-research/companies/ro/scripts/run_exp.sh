#!/bin/bash
# Usage: scripts/run_exp.sh <exp-id> [<exp-id> ...]   One replay at a time, foreground, with a pause between.
# Retries once after 30 s if walk.js fails.
cd /home/user/ADHD-learning/hairloss-research/companies/ro || exit 1
for id in "$@"; do
  echo "=================== $id  $(date +%T)"
  rm -rf "runs/$id"
  if ! timeout 240 node ../../tools/walk.js "experiments/$id.json" "runs/$id" --last; then
    echo "!! $id failed, waiting 30 s and retrying once"; sleep 30
    rm -rf "runs/$id"
    timeout 240 node ../../tools/walk.js "experiments/$id.json" "runs/$id" --last || echo "!! $id FAILED TWICE"
  fi
  python3 -I scripts/redact.py "runs/$id"
  sleep 4
done
