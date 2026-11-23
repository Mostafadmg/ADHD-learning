# Summarise a product-recommendation API response saved by walk.js. Usage: python3 -I tools/parse-reco.py <run-dir>
import json, sys, glob, os, html
run = sys.argv[1]
for fn in sorted(glob.glob(os.path.join(run, 'net', '*middleware_2Fprodu*.json'))):
    d = json.load(open(fn))
    print('FILE', os.path.basename(fn), 'groups:', len(d))
    for gi, g in enumerate(d):
        print(' GROUP %d (%d product%s)' % (gi + 1, len(g), 's' if len(g) > 1 else ''))
        for p in g:
            print('   SKU %s  subWooId=%s  oneTimeWooId=%s' % (p.get('sku'), p.get('woocommerceSubscriptionProductId'), p.get('woocommerceSimpleProductId')))
            for k in p:
                if k not in ('sku', 'relatedProducts', 'woocommerceId', 'imageSrc', 'simpleProductId', 'woocommerceSimpleProductId', 'subscriptionProductId', 'woocommerceSubscriptionProductId'):
                    print('     other key:', k, json.dumps(p[k])[:200])
            for r in p.get('relatedProducts', []):
                print('     - %s | type=%s | price=%s | period=%s x%s | wooId=%s | cats=%s' % (html.unescape(r.get('name', '')), r.get('type'), r.get('price'), r.get('subscriptionPeriod'), r.get('subscriptionPeriodInterval'), r.get('wooCommerceId'), ','.join(c['slug'] for c in r.get('categories', []))))
                print('       permalink:', r.get('permalink'))
                for k in r:
                    if k not in ('id', 'created', 'updated', 'sku', 'name', 'wooCommerceId', 'shortenedName', 'permalink', 'type', 'price', 'subscriptionPeriod', 'subscriptionPeriodInterval', 'categories', 'medications'):
                        print('       other:', k, json.dumps(r[k])[:300])
                for m in r.get('medications', []):
                    print('       MED: %s | qty %s %s | days %s | refills %s | pharmacy %s | directions: %s' % (m.get('name'), m.get('quantity'), m.get('dispense_unit'), m.get('days_supply'), m.get('refills'), m.get('pharmacy_name'), m.get('directions')))
                    print('            pharmacy_notes:', (m.get('pharmacy_notes') or '')[:400])
                    for k in m:
                        if k not in ('name', 'order', 'title', 'active', 'refills', 'metadata', 'quantity', 'schedule', 'created_at', 'directions', 'updated_at', 'days_supply', 'pharmacy_id', 'clinical_note', 'dispense_unit', 'pharmacy_name', 'effective_date', 'pharmacy_notes'):
                            print('            other:', k, json.dumps(m[k])[:300])
