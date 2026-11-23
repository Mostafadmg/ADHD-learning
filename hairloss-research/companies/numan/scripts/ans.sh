#!/bin/bash
# ans.sh <sessionDir> "<option label text>"  — click an answer label, wait, show the next screen
dir="$1"; label="$2"
json=$(node -e 'console.log(JSON.stringify({steps:[{do:"click",selector:"label:text-is("+JSON.stringify(process.argv[1])+")",settle:2800},{do:"snap",settle:600}]}))' "$label")
node "$(dirname "$0")/do.js" "$dir" "$json" "${3:-3000}"
