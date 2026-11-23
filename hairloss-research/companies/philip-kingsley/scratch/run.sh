#!/bin/bash
# usage: run.sh <name>  (scratch/exp/<name>.json -> runs/<name>/)
cd /home/user/ADHD-learning/hairloss-research/companies/philip-kingsley
n=$1
rm -rf runs/$n
timeout 280 node scratch/walk-eval.js scratch/exp/$n.json runs/$n --last 2>&1 | grep -E "EVAL|FAILED|FATAL|\[walk\]|^URL|nothing visible" | cut -c1-1500
r=$?
if ! [ -f runs/$n/eval.json ]; then echo "NO EVAL for $n; retry in 30s"; sleep 30; rm -rf runs/$n; timeout 280 node scratch/walk-eval.js scratch/exp/$n.json runs/$n --last 2>&1 | grep -E "EVAL|FAILED|FATAL|\[walk\]|^URL" | cut -c1-1500; fi
