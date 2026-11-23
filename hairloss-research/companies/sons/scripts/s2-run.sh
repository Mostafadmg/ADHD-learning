#!/bin/bash
# Stage 2: replay the listed experiments one after another (one browser at a time, a pause between runs).
# usage: bash scripts/s2-run.sh exp-04 exp-05 ...
cd /home/user/ADHD-learning/hairloss-research || exit 1
for id in "$@"; do
  d=companies/sons/runs/$id
  node tools/walk.js "$d/actions.json" "$d" --last > "$d/walk.log" 2>&1
  echo "$id exit=$? $(grep -c . "$d/walk.log") lines"
  sleep 4
done
