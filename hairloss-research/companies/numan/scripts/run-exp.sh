#!/bin/bash
# run-exp.sh <expId> [NN] : generate, replay once (retry once after 30 s on failure/timeout), summarise
cd "$(dirname "$0")/.." || exit 1
id="$1"; n="${2:-xx}"; f=$(node scripts/gen-exp.js "$id") || exit 1
out="runs/x2-$n-$id"; rm -rf "$out"
timeout 330 node ../../tools/walk.js "$f" "$out" --last > "$out.log" 2>&1; rc=$?
if [ $rc -ne 0 ] && [ $rc -ne 2 ]; then sleep 30; rm -rf "$out"; timeout 330 node ../../tools/walk.js "$f" "$out" --last > "$out.log" 2>&1; rc=$?; fi
mv "$out.log" "$out/walk.log" 2>/dev/null; echo "RC=$rc"; grep -m3 -i "fail\|could not" "$out/walk.log"; node scripts/summ.js "$out"
