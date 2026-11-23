"""Make one-change variant action files from a baseline. Usage in python: from mk import *"""
import json, os, copy
HERE=os.path.dirname(os.path.abspath(__file__)); CO=os.path.dirname(HERE)
EVAL=("(()=>{const q=window.quiz;const d=(q.data&&q.data[q.quizId])||{};const ans={};"
      "for(const k in d){if(d[k]&&d[k].value!=='')ans[k]=d[k].value;}"
      "const skus=q.checkProductAvailability();"
      "return {quizId:q.quizId,step:q.state.current,url:location.pathname,skus:skus,"
      "noResultsTemplate:skus.length?null:q.resolveNoResultsTemplate(),answers:ans};})()")
def sel(q,v): return {"do":"click","selector":'.pk-quiz-control[data-quiz-question="%s"][data-quiz-selection="%s"]'%(q,v)}
NEXT={"do":"click","selector":"button.pk-quiz-action.Next"}
def load(flow):
    d=json.load(open(os.path.join(CO,'baseline-%s.json'%flow)))
    d['steps']=[s for s in d['steps'] if s['do'] not in ('wait','scroll')]
    return d
def qi(steps,q):
    for i,s in enumerate(steps):
        if '"%s"]'%q in s.get('selector','') and 'data-quiz-question="%s"'%q in s.get('selector',''): return i
    raise KeyError(q)
def variant(flow, changes=(), after=None, extra_end=None):
    """changes: list of (q, newValue or list of values for multi). after: dict q -> list of steps to insert after q's answer (and its Next if present)."""
    d=load(flow); st=d['steps']
    for q,v in changes:
        i=qi(st,q)
        if isinstance(v,list):
            st[i:i+1]=[sel(q,x) for x in v]
        else:
            st[i]=sel(q,v)
    for q,ins in (after or {}).items():
        i=qi(st,q)
        j=i
        while j+1<len(st) and 'data-quiz-question="%s"'%q in st[j+1].get('selector',''): j+=1
        if j+1<len(st) and st[j+1]==NEXT: j+=1
        st[j+1:j+1]=ins
    st.append({"do":"wait","ms":800})
    st.append({"do":"eval","js":EVAL})
    return d
def write(name, d):
    os.makedirs(os.path.join(HERE,'exp'),exist_ok=True)
    p=os.path.join(HERE,'exp',name+'.json'); json.dump(d,open(p,'w'),indent=1); return p
