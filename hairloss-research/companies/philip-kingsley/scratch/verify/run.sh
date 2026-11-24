#!/bin/bash
# usage: run.sh <id>  (scratch/verify/<id>.json -> runs/verify-<id>/), one browser, foreground
cd /home/user/ADHD-learning/hairloss-research/companies/philip-kingsley
n=$1
rm -rf runs/verify-$n
timeout 290 node scratch/walk-eval.js scratch/verify/$n.json runs/verify-$n --last 2>&1 | grep -E "FAILED|FATAL|^URL|Error" | cut -c1-600
if ! [ -f runs/verify-$n/eval.json ]; then echo "NO EVAL for $n; retry in 30s"; sleep 30; rm -rf runs/verify-$n; timeout 290 node scratch/walk-eval.js scratch/verify/$n.json runs/verify-$n --last 2>&1 | grep -E "FAILED|FATAL|^URL|Error" | cut -c1-600; fi
[ -f runs/verify-$n/eval.json ] && node -e 'const e=require("./runs/verify-'$n'/eval.json");console.log("EVAL",e.quizId,e.step,"rules:",e.ruleCount,e.rulesLen,"skus:",e.skus.join(","),"| heading:",e.heading.replace(/\s+/g," ").slice(0,80))'
