#!/bin/bash
# Stage 3 runner. Usage: scripts/run_verify.sh <verify-id> [...]  One replay at a time, foreground; retry once after 30 s.
cd /home/user/ADHD-learning/hairloss-research/companies/ro || exit 1
for id in "$@"; do
  echo "=================== $id  $(date +%T)"
  rm -rf "runs/$id"
  if ! timeout 240 node ../../tools/walk.js "experiments/$id.json" "runs/$id" --last > "/tmp/claude-0/-home-user/e5316970-fba8-5d89-80c3-33335b549958/scratchpad/ro-v3/$id.out" 2>&1; then
    echo "!! $id failed, waiting 30 s and retrying once"; sleep 30
    rm -rf "runs/$id"
    timeout 240 node ../../tools/walk.js "experiments/$id.json" "runs/$id" --last > "/tmp/claude-0/-home-user/e5316970-fba8-5d89-80c3-33335b549958/scratchpad/ro-v3/$id.out" 2>&1 || echo "!! $id FAILED TWICE"
  fi
  python3 -I scripts/redact.py "runs/$id"
  python3 -I scripts/trace.py "runs/$id" | cut -c1-330
  sleep 4
done
