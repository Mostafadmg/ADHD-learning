#!/bin/bash
# multi.sh <sessionDir> "<label 1>" ["<label 2>" ...]  — tick answers, press Next, show the next screen
dir="$1"; shift
json=$(node -e 'const s=process.argv.slice(1).map(l=>({do:"click",selector:"label:text-is("+JSON.stringify(l)+")",settle:500}));s.push({do:"click",text:"Next",settle:2800});s.push({do:"snap",settle:600});console.log(JSON.stringify({steps:s}))' "$@")
node "$(dirname "$0")/do.js" "$dir" "$json" 3000
