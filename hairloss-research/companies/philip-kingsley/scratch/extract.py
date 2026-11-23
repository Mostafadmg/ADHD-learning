import sys, json
src, out = sys.argv[1], sys.argv[2]
h = open(src, encoding='utf-8').read()
i = h.find('quiz.loadState(')
if i < 0: print('no loadState'); sys.exit(1)
j = i + len('quiz.loadState(')
dec = json.JSONDecoder()
obj, end = dec.raw_decode(h[j:])
json.dump(obj, open(out, 'w'), indent=1, ensure_ascii=False)
print('keys', list(obj.keys()))
print('templates', list(obj.get('templates', {}).keys()))
print('transitions', obj.get('transitions'))
print('conditional', obj.get('conditional_transitions'))
for k in obj:
    if k not in ('templates',): print(k, str(obj[k])[:600])
