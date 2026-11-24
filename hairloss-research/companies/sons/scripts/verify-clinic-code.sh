#!/bin/bash
# Stage 3: fetch the partner-clinic page and its page chunk (anonymous GETs) to read the procedure-date rule.
D=/home/user/ADHD-learning/hairloss-research/companies/sons
O=$D/runs/verify-clinic-code; mkdir -p $O
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
[ -s $O/clinic.html ] || curl -sL -A "$UA" -o $O/clinic.html https://shop.sons.co.uk/clinics/british-hair-clinic
C=$(grep -o 'static/chunks/app/clinics/[^"\\]*\.js' $O/clinic.html | sort -u | head -1)
echo "clinic page chunk: $C"
sleep 2
[ -s $O/clinic-page.js ] || curl -s -A "$UA" -o $O/clinic-page.js "https://shop.sons.co.uk/_next/$C"
wc -c $O/clinic-page.js
# part 2: the clinic page's other chunks that stage 1 did not save
for c in 4062-18354781e29ab8fb.js 48507feb-d0fc1c111b0d1a90.js 9081a741-4e86f0ef42609600.js 9746-e1b6787305c00c47.js; do
  [ -s $O/$c ] || { curl -s -A "$UA" -o $O/$c "https://shop.sons.co.uk/_next/static/chunks/$c"; sleep 2; }
done
grep -l 'procedure_date' $O/*.js
