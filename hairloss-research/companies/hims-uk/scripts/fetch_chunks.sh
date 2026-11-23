#!/bin/bash
# Fetch a few more of the app's public code files (static JavaScript the site serves to every visitor), 2 s apart.
cd "$(dirname "$0")/../raw/app/chunks" || exit 1
for n in "$@"; do
  out="${n}.js"
  [ -s "$out" ] && { echo "have $out"; continue; }
  code=$(curl -sS -m 40 -A 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' -o "$out" -w '%{http_code}' "https://app.forhims.co.uk/static/js/${n}.chunk.js")
  echo "$code $(wc -c < "$out") $out"
  head -c 15 "$out" | grep -q '<!doctype\|<html' && { echo "  (not JavaScript, removed)"; rm -f "$out"; }
  sleep 2
done
