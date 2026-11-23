import re, json, sys
src, outprefix = sys.argv[1], sys.argv[2]
h=open(src,encoding='utf-8').read()
i=h.find('// Constants')
end=h.find('</script>',i)
body=h[i:end]
dec=json.JSONDecoder()
for name in ['HIMS_EXPERIMENT_CONTEXT','HIMS_LAUNCH_DARKLY','HIMS_TANSTACK_STORE']:
    m=re.search(r'window\.'+name+r'\s*=\s*', body)
    if not m: print('missing',name); continue
    try:
        obj,idx=dec.raw_decode(body, m.end())
    except Exception as e:
        print('fail',name,e); continue
    json.dump(obj, open(outprefix+'.'+name+'.json','w',encoding='utf-8'), indent=1, ensure_ascii=False)
    print(name, 'ok', idx-m.end())
