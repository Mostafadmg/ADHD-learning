R () 
{ 
    node scripts/gen.js scripts/exp/$1.json "$2" && node ../../tools/walk.js scripts/exp/$1.json runs/$1 --last > runs/$1.log 2>&1;
    echo "$1 exit $?";
    node scripts/summ.js runs/$1 | cut -c1-700
}
