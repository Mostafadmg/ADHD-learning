#!/bin/bash
# Stage 3 (verify), second queue: waits for the first queue, then runs the rest one browser at a time.
cd "$(dirname "$0")/.." || exit 1
until grep -q "ALL DONE" runs/verify-batch.log; do sleep 5; done
bash scripts/verify_batch.sh verify-00-baseline-full verify-15-back-from-first verify-17-hers-anon-route
WALKFLAGS="--mobile" bash scripts/verify_batch.sh verify-16-mobile-all-over
sleep 5
node scripts/verify_pages.js runs/verify-pages \
  hims-hair-loss=https://www.forhims.co.uk/hair-loss \
  hims-finasteride=https://www.forhims.co.uk/hair-loss/finasteride \
  hims-minoxidil=https://www.forhims.co.uk/hair-loss/minoxidil \
  hims-combo-kit=https://www.forhims.co.uk/hair-loss/finasteride-and-minoxidil \
  hims-serum-shopping=https://www.forhims.co.uk/hair-loss/all-in-one-topical-hair-loss-solution-shopping \
  hims-combo-kit-shopping=https://www.forhims.co.uk/hair-loss/combo-kit-shopping \
  hims-safety-spray=https://www.forhims.co.uk/safety-information/topical-finasteride-and-minoxidil-spray \
  hims-safety-chew=https://www.forhims.co.uk/safety-information/finasteride-and-minoxidil-hair-hybrid \
  hims-safety-finasteride=https://www.forhims.co.uk/safety-information/finasteride \
  hims-chooser=https://www.forhims.co.uk/c \
  hims-how-it-works=https://www.forhims.co.uk/how-it-works \
  hers-hair=https://forhers.co.uk/hair \
  hers-hair-blends=https://forhers.co.uk/hair-blends
echo "[verify2] ALL DONE"
