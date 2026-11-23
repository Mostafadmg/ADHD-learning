import json,sys
d=json.load(open(sys.argv[1]))
LIM=int(sys.argv[2]) if len(sys.argv)>2 else 500
out=[]
out.append(f"SCHEMA name={d['name']!r} code={d['code']} version={d['version']} id={d['id']} meta={json.dumps(d.get('meta'))}")
def short(v,n=LIM):
    s=v if isinstance(v,str) else json.dumps(v,ensure_ascii=False)
    return s if len(s)<=n else s[:n]+f'…[+{len(s)-n}]'
for g in sorted(d['groups'],key=lambda g:g['position']):
    out.append(f"\n================ GROUP {g['name']} pos={g['position']} n={len(g['questions'])}")
    for q in sorted(g['questions'],key=lambda q:q['position']):
        meta=dict(q['meta'] or {})
        out.append(f"\n### qid {q['qid']} [{q['type']}] next={q['next_qid']}" + (f" alias={q['alias']!r}" if q['alias'] else '') + (f" mtype={meta.get('type')}" if meta.get('type') else ''))
        out.append(f"TEXT: {q['text']!r}")
        if q.get('range_from') is not None or q.get('range_to') is not None: out.append(f"RANGE: {q['range_from']}..{q['range_to']}")
        for k in list(meta.keys()):
            if k in ('type','header','question_wrapper_type','questionWrapperType','question_header_type','questionHeaderType','button_text','message_type','no_history','noHistory','has_help_button','trackEvents','desktop_img','mobile_img','image'): continue
            out.append(f"  m.{k}: {short(meta[k])}")
        for k in ('variable_modifications','dynamic_x_rules','forking_rules'):
            if q[k]: out.append(f"{k.upper()}: "+json.dumps(q[k],ensure_ascii=False))
        for a in sorted(q['answers'],key=lambda a:a['position']):
            s=f"  - [{a['slug']}] {a['text']!r} -> {a['next_qid']}"
            if a.get('exclusive'): s+=" EXCL"
            am=dict(a.get('meta') or {})
            am.pop('props',None); am.pop('datapoints',None)
            if am: s+=" meta="+short(am,400)
            if a.get('variable_modifications'): s+=" VARS="+json.dumps(a['variable_modifications'],ensure_ascii=False)
            out.append(s)
print('\n'.join(out))
