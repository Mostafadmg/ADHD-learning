import json,sys
d=json.load(open(sys.argv[1]))
out=[]
out.append(f"SCHEMA name={d['name']!r} code={d['code']} version={d['version']} id={d['id']} type={d['type']}/{d['sub_type']} condition={d.get('condition_code')} meta={json.dumps(d.get('meta'))}")
for g in d['groups']:
    out.append(f"\nGROUP {g['name']} pos={g['position']} n={len(g['questions'])}")
    for q in sorted(g['questions'],key=lambda q:q['position']):
        meta=dict(q['meta'] or {})
        out.append(f"\n### qid {q['qid']} [{q['type']}] show_as={q['show_as_type']} required={q['required']} next={q['next_qid']} alias={q['alias']} id={q['id']}")
        out.append(f"TEXT: {q['text']!r}")
        if q.get('range_from') is not None or q.get('range_to') is not None: out.append(f"RANGE: {q['range_from']}..{q['range_to']}")
        if q['choice_open']: out.append("choice_open: true")
        if meta: out.append("META: "+json.dumps(meta,ensure_ascii=False))
        for k in ('variable_modifications','dynamic_x_rules','forking_rules'):
            if q[k]: out.append(f"{k.upper()}: "+json.dumps(q[k],ensure_ascii=False))
        for a in sorted(q['answers'],key=lambda a:a['position']):
            s=f"  - [{a['slug']}] {a['text']!r} -> next={a['next_qid']}"
            if a.get('exclusive'): s+=" EXCLUSIVE"
            if a.get('meta'): s+=" meta="+json.dumps(a['meta'],ensure_ascii=False)
            if a.get('variable_modifications'): s+=" varmods="+json.dumps(a['variable_modifications'],ensure_ascii=False)
            out.append(s)
print('\n'.join(out))
