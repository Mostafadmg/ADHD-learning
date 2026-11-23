import json
def rt(node):
    """flatten contentful rich text / entries to plain text"""
    if node is None: return ''
    if isinstance(node,str): return node
    if isinstance(node,(int,float,bool)): return str(node)
    if isinstance(node,list): return ' | '.join(x for x in (rt(n) for n in node) if x)
    if isinstance(node,dict):
        if node.get('nodeType')=='text': return node.get('value','')
        if 'nodeType' in node:
            parts=[rt(c) for c in node.get('content',[])]
            sep='' if node['nodeType'] in ('paragraph','heading-1','heading-2','heading-3','heading-4','list-item','hyperlink') else '\n'
            s=sep.join(p for p in parts if p)
            if node['nodeType']=='list-item': s='- '+s
            return s
        if 'fields' in node: return rt(node['fields'])
        if 'en-US' in node or 'en-GS' in node: return rt(node.get('en-US', node.get('en-GS')))
        if 'sys' in node and len(node)==1: return ''
        return '{'+'; '.join(f'{k}: {rt(v)}' for k,v in node.items() if k not in ('sys','metadata') and rt(v))+'}'
    return ''
