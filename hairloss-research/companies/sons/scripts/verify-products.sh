#!/bin/bash
# Stage 3: download live product pages (anonymous GET, 2 s apart) for the product-fact check.
D=/home/user/ADHD-learning/hairloss-research/companies/sons
O=$D/runs/verify-products; mkdir -p $O
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
for h in finasteride minoxidil oral-minoxidil oral-minoxidil-5mg topical-hair-loss-spray topical-finasteride-minoxidil-spray combination-capsule dutasteride-combination-spray hair-growth-complex beard-booster ketoconazole biotin the-duo-plan the-non-prescription-plan; do
  [ -s $O/$h.html ] && continue
  curl -sL -A "$UA" -o $O/$h.html -w "%{http_code} $h\n" https://sons.co.uk/products/$h
  sleep 2
done
