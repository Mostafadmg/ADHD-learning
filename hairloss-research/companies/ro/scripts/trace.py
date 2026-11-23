# Print the screen sequence of a run: step, URL tail, heading / first lines, controls. Usage: python3 -I scripts/trace.py runs/<id> [...]
import glob, os, re, sys, json
def trace(d):
    out = []
    for f in sorted(glob.glob(os.path.join(d, '[0-9][0-9].txt'))):
        s = open(f, encoding='utf8').read()
        step = s.split('\n', 1)[0]
        url = re.search(r'^URL: (.*)$', s, re.M).group(1)
        vis = s.split('--- VISIBLE TEXT ---', 1)[1].split('--- CONTROLS ---', 1)[0]
        lines = [l.strip() for l in vis.split('\n') if l.strip()]
        ctr = s.split('--- CONTROLS ---', 1)[1].split('--- LINKS ---', 1)[0].strip() if '--- CONTROLS ---' in s else ''
        out.append({'file': os.path.basename(f), 'step': step, 'url': url.replace('https://start.ro.co', ''), 'lines': lines, 'controls': ctr})
    return out
if __name__ == '__main__':
    for d in sys.argv[1:]:
        print('#####', d)
        for o in trace(d):
            print(' ', o['file'], '|', o['step'][:60], '|', o['url'], '|', ' / '.join(o['lines'][:6])[:260])
