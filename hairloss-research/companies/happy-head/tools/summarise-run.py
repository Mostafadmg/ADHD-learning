# Short, comparable summary of one run. Usage: python3 -I tools/summarise-run.py runs/s2/<id> [more runs...]
import json, sys, glob, os, html, re, urllib.parse
KEYS = ["gender_and_age", "sex_at_birth", "female_under_50", "preferred_method_of_medication", "method", "method_fem", "product_ids", "products_displayed",
        "recommended_formula_according_sex_and_age", "consult_and_valid_pid", "date_of_birth_for_api_request", "date_of_birth_formatted", "age",
        "valid_age_range", "less_than_18", "current_page_key", "highest_page_reached_key", "email_capture_variant", "pregnancy_in_household",
        "pregnancy_disclosure_selection", "prior_treatments", "reactions_to_treatments", "serious_symptoms", "health_conditions", "blood_pressure",
        "medications", "allergies", "customization_requests", "ability_to_become_pregnant", "birth_control_type", "cannot_become_pregnant_reason",
        "where_noticing_changes_male", "where_noticing_changes_female", "how_committed_to_hair_loss_v2", "how_long_experiencing_hair_loss_v2", "family_hair_loss_history"]
def screens(run):
    out = []
    for f in sorted(glob.glob(os.path.join(run, '[0-9][0-9].txt'))):
        t = open(f).read()
        head = t.split('\n', 1)[0]
        body = t.split('--- VISIBLE TEXT ---\n', 1)[1].split('\n--- CONTROLS ---', 1)[0]
        lines = [l.strip() for l in body.split('\n') if l.strip() and l.strip() != 'BACK']
        out.append((os.path.basename(f)[:2], head.replace('STEP ', '')[3:60], ' / '.join(lines[:2])[:150]))
    return out
def reco(run):
    res = []
    for line in open(os.path.join(run, 'network.jsonl')):
        try: e = json.loads(line)
        except Exception: continue
        if 'product-recommendation' in e.get('url', ''):
            r = {'status': e['status'], 'post': e.get('post')}
            if e.get('file'):
                d = json.load(open(os.path.join(run, e['file'])))
                r['groups'] = []
                for g in d:
                    for p in g:
                        r['groups'].append({'sku': p.get('sku'), 'sub': p.get('woocommerceSubscriptionProductId'), 'once': p.get('woocommerceSimpleProductId'),
                                            'items': [(html.unescape(x.get('name', '')), x.get('type'), x.get('price'), x.get('wooCommerceId'),
                                                       [m.get('name') for m in x.get('medications', [])]) for x in p.get('relatedProducts', [])]})
            res.append(r)
    return res
def state(run):
    try:
        s = json.load(open(os.path.join(run, 'storage.json')))
        u = list(json.loads(s['local']['SavvyFormUserData']).values())[0]
        return {k: u.get(k) for k in KEYS if k in u}
    except Exception as e: return {'error': str(e)}
if __name__ == '__main__':
    for run in sys.argv[1:]:
        print('=' * 100); print('RUN', run)
        sc = screens(run)
        for n, step, title in sc: print('  %s %-46s | %s' % (n, step, title))
        for r in reco(run):
            print('  RECO request:', r['post'], 'status', r['status'])
            for g in r.get('groups', []):
                print('    sku=%s sub=%s once=%s' % (g['sku'], g['sub'], g['once']))
                for it in g['items']: print('       ', it)
        st = state(run)
        print('  STATE:', json.dumps(st, ensure_ascii=False))
        n = sum(1 for l in open(os.path.join(run, 'network.jsonl')) if 'middleware%2Fembeddables' in l)
        print('  consultation posts (must be 0):', n)
