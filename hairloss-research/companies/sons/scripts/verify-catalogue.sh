#!/bin/bash
# Stage 3: live product sitemap vs the catalogue in company.json (anonymous GET of the public sitemap).
D=/home/user/ADHD-learning/hairloss-research/companies/sons
O=$D/runs/verify-catalogue; mkdir -p $O
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
[ -s $O/sitemap.xml ] || curl -sL -A "$UA" -o $O/sitemap.xml https://sons.co.uk/sitemap.xml
sleep 2
P=$(grep -o 'https://[^<]*sitemap_products[^<]*' $O/sitemap.xml | head -1 | sed 's/&amp;/\&/g')
echo "products sitemap: $P"
[ -s $O/sitemap-products.xml ] || curl -sL -A "$UA" -o $O/sitemap-products.xml "$P"
grep -o '<loc>https://sons.co.uk/products/[^<]*' $O/sitemap-products.xml | sed 's#.*/products/##' | sort -u > $O/live-handles.txt
wc -l < $O/live-handles.txt
