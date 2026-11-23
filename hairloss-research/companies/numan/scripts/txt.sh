#!/bin/bash
# txt.sh <sessionDir> "<free text>"  — type a (fictional, non-contact) free-text answer, press Next, show the next screen
dir="$1"; text="$2"
json=$(node -e 'console.log(JSON.stringify({steps:[{do:"fill",selector:"textarea, input[type=text], input[type=number]",value:process.argv[1]},{do:"click",text:"Next",settle:2800},{do:"snap",settle:600}]}))' "$text")
node "$(dirname "$0")/do.js" "$dir" "$json" 3000
