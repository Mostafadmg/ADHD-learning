# usage: python3 -I experiments/compare.py <baseline-run> <run> [<run> ...]
# Prints, for each run, the final URL and a line diff of the plan-page text (top of page to the comparison table) against the baseline.
import re, sys, os, difflib, glob
def plan(run):
    best=None
    for f in sorted(glob.glob(os.path.join('runs',run,'[0-9][0-9].txt'))):
        t=open(f,encoding='utf8').read()
        if '/hair-treatment-plan' in t.split('\n')[1] and 'Review your plan' in t: best=(f,t)
    if not best: return None,None,[]
    f,t=best
    vis=t.split('--- VISIBLE TEXT ---')[1].split('--- CONTROLS')[0]
    i=vis.find('Clinician-Matched'); j=vis.find('Compare ')
    lines=[l.strip() for l in vis[i:j].split('\n') if l.strip()]
    url=re.search(r'^URL: (.*)$',t,re.M).group(1)
    return f,url,lines
bf,burl,bl=plan(sys.argv[1])
print('BASE',bf,burl,len(bl),'lines')
for run in sys.argv[2:]:
    f,url,l=plan(run)
    if not f: print('==',run,'no plan page reached'); continue
    d=[x for x in difflib.unified_diff(bl,l,lineterm='',n=0) if not x.startswith(('---','+++','@@'))]
    print('==',run,os.path.basename(f),url,'| diff lines:',len(d))
    for x in d: print('    ',x)
