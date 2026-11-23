#!/bin/bash
# Stage 3 (verify), last queue: waits for verify_batch3.sh, then runs three more replays one browser at a time.
cd "$(dirname "$0")/.." || exit 1
until grep -q "\[verify3\] ALL DONE" runs/verify-batch3.log; do sleep 5; done
sleep 5
bash scripts/verify_batch.sh verify-18-delete-confirm verify-19-all-warning-signs verify-20-gst-combo-kit
echo "[verify4] ALL DONE"
