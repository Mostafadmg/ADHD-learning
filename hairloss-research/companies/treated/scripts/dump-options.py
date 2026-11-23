#!/usr/bin/env python3
"""dump-options.py <gettreatmentoptions.json> : print products, dosages, quantities/prices and auto-offer restrictions.
Run with: python3 -I scripts/dump-options.py treatment-options-baseline-men.json"""
import json, sys
d = json.load(open(sys.argv[1], encoding='utf-8'))
p = d.get('prescription') or {}
print('mode:', p.get('mode'), '| autoOfferApprovalRequired:', p.get('autoOfferApprovalRequired'), '| selectedProductId:', d.get('selectedProductId'))
print('displayMessage:', p.get('displayMessage'))
print('consultant:', json.dumps(p.get('consultant'), ensure_ascii=False))
print('filter:', json.dumps(p.get('treatmentOptionFilter'), ensure_ascii=False))
for key in ('advised', 'notAdvised', 'recommended', 'others'):
    if key in p and p[key] is not None: print('list', key, len(p[key]))
for a in p.get('advised') or []:
    print('\n===', a['name'], '| UID', a['productUID'], '| id', a['productId'], '| active', a['activeIngredient'], '| minPrice', a['minimumPrice'], '| rank', a['rank'],
          '| filterUnit', a['filterUnit'], '| isGeneric', a['isGeneric'], '| onDemand', a['isOnDemand'], '| subscribeSave', a['isSubscribeSave'], a['subscribeDiscount'],
          '| upgradeOffer', a['isUpgradeOffer'], a['upgradeDiscount'], '| preOrder', a['isPreOrder'], '| label', a['mostPopularLabel'])
    print('  excerpt:', a['excerpt'])
    print('  tags:', json.dumps(a['productTags'], ensure_ascii=False))
    ao = (a.get('restriction') or {}).get('autoOffer')
    print('  product autoOffer:', json.dumps(ao, ensure_ascii=False))
    for ds in a['dosages']:
        print('  -- dosage', ds['name'], '| UID', ds['dosageUID'], '| unit', ds['unit'], '| mostPopular', ds['mostPopular'], '| isOfflineOffer', ds['isOfflineOffer'],
              '| outOfStock', ds['isOutOfStock'], '| rank', ds['rank'], '| tag', ds['dosageTag'], '| upgrade', ds['isUpgradeOffer'])
        print('     directions:', ds['description'])
        dao = (ds.get('restriction') or {})
        same = json.dumps(dao.get('autoOffer'), sort_keys=True) == json.dumps(ao, sort_keys=True)
        print('     dosage restriction:', 'same as product' if same else json.dumps(dao, ensure_ascii=False))
        for q in ds['quantities']:
            qao = (q.get('restriction') or {}).get('autoOffer')
            rs = 'same' if json.dumps(qao, sort_keys=True) == json.dumps(ao, sort_keys=True) else json.dumps(qao, ensure_ascii=False)
            dur = ', '.join(f"{x['name']} (value {x['value']})" for x in q.get('durations') or [])
            print(f"     qty {q.get('displayQty') or q.get('text')}: price {q.get('price')} | save {q.get('savePrice')} | perUnit {round(q.get('pricePerPill') or 0, 4)} | popular {q.get('isPopular')} | offlineOffer {q.get('isOfflineOffer')} | deliver: {dur} | rank {q.get('rank')} | restriction {rs}")
            pd = q.get('priceDetails') or {}
            odd = {k: v for k, v in pd.items() if v not in (0, 0.0, False, None) and k not in ('medicinePrice', 'total', 'countryCode')}
            if odd: print('        priceDetails extras:', json.dumps(odd))
print('\nconsultationAnswers:')
for a in d.get('consultationAnswers') or []:
    opts = '; '.join(f"{o['oText']} [front={o['frontendAction']} back={o['backendAction']}]" for o in a.get('answerOptions') or [])
    print(f"  {a['qText']} -> {opts} | q.frontendAction={a.get('frontendAction')} code={a.get('code')}")
