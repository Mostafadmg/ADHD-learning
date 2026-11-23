# Compact view of product-recommendation responses. Usage: python3 -I tools/reco-compact.py <run-dir>
import json, sys, glob, os, html
run = sys.argv[1]
for fn in sorted(glob.glob(os.path.join(run, 'net', '*middleware_2Fprodu*.json'))):
    d = json.load(open(fn))
    print('FILE', os.path.basename(fn), '| groups:', [[p.get('sku') for p in g] for g in d])
    for g in d:
        for p in g:
            print('\n SKU %s  subscriptionWooId=%s  oneTimeWooId=%s' % (p.get('sku'), p.get('woocommerceSubscriptionProductId'), p.get('woocommerceSimpleProductId')))
            for r in p.get('relatedProducts', []):
                print('   - %-62s %-12s $%s  every %s %s  woo=%s  plan=%s  dist=%s' % (html.unescape(r.get('name', '')), r.get('type'), r.get('price'), r.get('subscriptionPeriodInterval'), r.get('subscriptionPeriod'), r.get('wooCommerceId'), r.get('planName'), r.get('distributor')))
                print('       cats=%s' % ','.join(c['slug'] for c in r.get('categories', [])))
                for m in r.get('medications', []):
                    print('       MED: %s | %s %s | %s days | refills %s | %s | %s | controlled=%s' % (m.get('name'), m.get('quantity'), m.get('dispense_unit'), m.get('days_supply'), m.get('refills'), m.get('pharmacy_name'), m.get('directions'), m.get('is_controlled_substance')))
