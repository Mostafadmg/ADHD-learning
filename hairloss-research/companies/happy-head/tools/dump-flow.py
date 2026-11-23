# Turn quiz-definition.json (Embeddables flow) into readable text. Run: python3 -I tools/dump-flow.py
import json, re, os, sys
base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(os.path.join(base, 'quiz-definition.json')))
e = d['embeddables_data'][0]; f = e['flow']
out = []
def conds(c):
    if not c: return ''
    return ' AND '.join('%s %s %s' % (x.get('key'), x.get('operator'), json.dumps(x.get('values')) if x.get('values') else '') for x in c)
def strip(t):
    t = re.sub(r'<[^>]+>', ' ', t or ''); return re.sub(r'\s+', ' ', t).strip()
types = {}
for i, p in enumerate(f['pages']):
    out.append('\n' + '=' * 100)
    out.append('PAGE %d  key=%s  id=%s  tags=%s' % (i, p.get('key'), p.get('id'), p.get('tags')))
    if p.get('conditions'): out.append('  SHOWN WHEN: ' + conds(p['conditions']))
    for k in p:
        if k not in ('key', 'id', 'tags', 'conditions', 'components', 'showNav', 'outputs_onload', 'outputs_oncomplete'):
            out.append('  page.%s = %s' % (k, json.dumps(p[k])[:300]))
    out.append('  outputs_onload=%s outputs_oncomplete=%s' % (p.get('outputs_onload'), p.get('outputs_oncomplete')))
    for c in p.get('components', []):
        t = c.get('type'); types[t] = types.get(t, 0) + 1
        cs = conds(c.get('conditions'))
        line = None
        if t in ('PlainText', 'RichTextMarkdown', 'RichText'):
            txt = strip(c.get('text') or c.get('content') or '')
            if txt: line = '  [%s %s] %s' % (t, c.get('key'), txt)
        elif t == 'OptionSelector':
            line = '  [OptionSelector key=%s multiple=%s required=%s] label=%s' % (c.get('key'), c.get('multiple'), c.get('validation_required') or c.get('required'), strip(c.get('label', '')))
            extra = {k: v for k, v in c.items() if k not in ('type', 'buttons', 'tags', 'key', 'id', 'parent_id', 'conditions', 'label')}
            if extra: line += '\n      props=' + json.dumps(extra)[:500]
            for b in c.get('buttons', []):
                bx = {k: v for k, v in b.items() if k not in ('id', 'key', 'text')}
                line += '\n      - %s  (key=%s) %s' % (strip(b.get('text', '')), b.get('key'), json.dumps(bx) if bx else '')
        elif t in ('InputBox', 'Dropdown', 'TextArea', 'Checkbox', 'DatePicker', 'FileUpload', 'Slider'):
            extra = {k: v for k, v in c.items() if k not in ('type', 'tags', 'id', 'parent_id', 'conditions')}
            line = '  [%s] %s' % (t, json.dumps(extra)[:900])
        elif t == 'CustomButton':
            extra = {k: v for k, v in c.items() if k not in ('type', 'tags', 'id', 'parent_id', 'conditions')}
            line = '  [CustomButton] %s' % json.dumps(extra)[:500]
        elif t == 'CustomHTML':
            txt = strip(c.get('html') or c.get('content') or '')
            if txt: line = '  [CustomHTML %s] %s' % (c.get('key'), txt[:1500])
        elif t in ('Container', 'Image', 'MediaImage', 'ProgressBar', 'Lottie', 'Icon'):
            if cs and t == 'Container': line = '  [Container %s tags=%s]' % (c.get('key'), c.get('tags'))
        else:
            extra = {k: v for k, v in c.items() if k not in ('tags', 'id', 'parent_id', 'conditions')}
            line = '  [%s] %s' % (t, json.dumps(extra)[:600])
        if line:
            if cs: line += '\n      SHOWN WHEN: ' + cs
            out.append(line)
out.append('\n\nCOMPONENT TYPES: ' + json.dumps(types))
out.append('\n\n' + '#' * 100 + '\nGLOBAL COMPONENTS (%d)' % len(f['components']))
for c in f['components']:
    out.append(json.dumps({k: v for k, v in c.items() if k not in ('tags',)})[:700])
out.append('\n\n' + '#' * 100 + '\nCOMPUTED FIELDS (%d)' % len(f['computedFields']))
for c in f['computedFields']:
    out.append('\n--- computed: key=%s id=%s inputs=%s' % (c.get('key'), c.get('id'), c.get('input_triggers') or c.get('inputs')))
    for k, v in c.items():
        if k not in ('key', 'id', 'input_triggers', 'inputs'):
            out.append('  %s: %s' % (k, v if isinstance(v, str) else json.dumps(v)))
out.append('\n\n' + '#' * 100 + '\nDATA OUTPUTS (%d)' % len(f['dataOutputs']))
for c in f['dataOutputs']:
    out.append('\n--- output: ' + json.dumps({k: v for k, v in c.items() if k not in ('code', 'body')})[:800])
    for k in ('code', 'body'):
        if c.get(k): out.append('  %s: %s' % (k, c[k] if isinstance(c[k], str) else json.dumps(c[k])))
out.append('\n\n' + '#' * 100 + '\nEXPERIMENTS: ' + json.dumps(f.get('experiments'), indent=1))
out.append('\nLOAD TAGS: ' + json.dumps(f.get('load_tags'))[:3000])
out.append('\nDEFAULTS: ' + json.dumps(f.get('defaults'))[:3000])
out.append('\nREGISTERED KEYS: ' + f.get('registered_keys', '').replace('\n', ', '))
out.append('\nURL KEYS: ' + f.get('url_keys', '').replace('\n', ', '))
out.append('\nOUTPUTS ONLOADFLOW: ' + json.dumps(f.get('outputs_onloadflow')))
for k in ('js', 'client_side_js', 'client_side_js_v3'):
    out.append('\n\n' + '#' * 100 + '\n' + k + ':\n' + e.get(k, ''))
open(os.path.join(base, 'raw', 'flow-dump.txt'), 'w').write('\n'.join(out))
print('written', len('\n'.join(out)), 'chars;', 'types', types)
