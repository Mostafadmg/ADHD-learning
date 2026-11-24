#!/bin/bash
# Stage 3: is the recommendation code saved in stage 1 still what the site serves today? Anonymous GETs only.
D=/home/user/ADHD-learning/hairloss-research/companies/sons
O=$D/runs/verify-code-freshness
mkdir -p $O
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
[ -f $O/shop-recommendation.html ] || curl -sL -A "$UA" -o $O/shop-recommendation.html -w '%{http_code} %{url_effective}\n' https://shop.sons.co.uk/recommendation
sleep 2
[ -f $O/pages-recommendation.html ] || curl -sL -A "$UA" -o $O/pages-recommendation.html -w '%{http_code} %{url_effective}\n' https://www.sons.co.uk/pages/recommendation
sleep 2
grep -o '/_next/static/chunks/[^"]*\.js' $O/shop-recommendation.html | sort -u > $O/shop-recommendation.chunks.txt
wc -l $O/shop-recommendation.chunks.txt
grep -E 'recommendation__page|/1234-' $O/shop-recommendation.chunks.txt
# part 2: byte-compare the two engine chunks and the older page script
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
curl -s -A "$UA" -o $O/page-9574552c5f8ec4c0.js https://shop.sons.co.uk/_next/static/chunks/app/recommendation/page-9574552c5f8ec4c0.js
sleep 2
curl -s -A "$UA" -o $O/1234-6277a6fc5802d9fd.js https://shop.sons.co.uk/_next/static/chunks/1234-6277a6fc5802d9fd.js
cmp $O/page-9574552c5f8ec4c0.js $D/src/chunks/app__recommendation__page-9574552c5f8ec4c0.js && echo "recommendation chunk IDENTICAL"
cmp $O/1234-6277a6fc5802d9fd.js $D/src/chunks/1234-6277a6fc5802d9fd.js && echo "1234 chunk IDENTICAL"
