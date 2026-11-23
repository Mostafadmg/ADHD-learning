// Builds companies/sons/company.json from the saved survey definitions plus hand-written metadata.
// Question wording and option labels are copied by code from the definitions the site served, so they cannot drift.
// usage: node scripts/build-company.js   (run from companies/sons)
const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const load = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const strip = h => String(h || '').replace(/<li>/g, ' • ').replace(/<[^>]+>/g, ' ').replace(/&rsquo;/g, '’').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const SITE = 'https://sons.co.uk';

// ---------------------------------------------------------------- products
const P = (id, name, category, actives, form, audience, legalStatus, price, priceDetail, url, recommendedWhen, evidence, extra) =>
  Object.assign({ id, name, category, actives, form, audience, legalStatus, price, priceDetail, url, recommendedWhen, evidence }, extra || {});
const PROMO = 'List prices from the public product feed (sons.co.uk/products.json, 23 Nov 2026). A Black Friday offer was running on the day: about 40% off the first order of selected 6-month plans and 35% off 3-month plans, new customers only; later orders renew at list price. Delivery is free over £40, otherwise £2.99.';
const products = [
  P('p-fin', 'Finasteride ("Hair Loss Tablet" / "Oral Tablet")', 'rx-oral', [{ name: 'finasteride', strength: '1 mg' }], 'tablet, one a day', 'men',
    'POM, licensed. Careforsons Ltd is named as marketing authorisation holder in its own leaflet and in the consultation statement.',
    '£136 for 6 months (£22.67 a month) list price', '1 month £29 · 3 months £83 · 6 months £136 · 12 months £272. Page headline "From £13.60 / month" is the first-order offer price. ' + PROMO,
    SITE + '/products/finasteride',
    'In both served recommendation lists. Removed when oral finasteride is blocked: sudden onset, PHQ answer of "More than half the days" or worse, past finasteride side effects, severe kidney or liver disease, prostate/breast/testicular cancer group, rheumatoid/lupus/methotrexate group, lactose allergy, sexual dysfunction, age over 65, or the account tag finasteride_disallowed. Shown as one card with a Tablet/Spray toggle paired with topical finasteride.',
    'code', { handles: ['finasteride', 'oral-tablet'], ageOnPage: '18-75', leaflet: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Finasteride_PIL_04.06.pdf' }),
  P('p-min', 'Minoxidil Spray', 'otc-medicine', [{ name: 'minoxidil', strength: '5% cutaneous solution' }], 'scalp spray, 1 ml (10 pumps) twice a day', 'men',
    'Licensed non-prescription medicine (Careforsons says it holds the marketing authorisation for 5% minoxidil solution). Whether it is classed P or GSL was not confirmed. The shop still routes new buyers through the consultation.',
    '£99 for 6 months (£16.50 a month) list price', '1 month £33 · 3 months £54 · 6 months £99 · 12 months £180. ' + PROMO,
    SITE + '/products/minoxidil',
    'In both lists. Removed when topical minoxidil is blocked: high blood pressure, cardiovascular disease, scalp disorder, past minoxidil side effects, tag minoxidil_disallowed (and, in the newer code only, age over 65). It is one of the few items left after a "sudden onset" answer.',
    'code', { handles: ['minoxidil'], ageOnPage: '18-65', leaflet: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Minoxidil_PIL_2C_v5_2C_260526.pdf' }),
  P('p-oralmin', 'Oral Minoxidil ("Oral Capsule")', 'rx-oral-compounded', [{ name: 'minoxidil', strength: '2.5 mg' }, { name: 'biotin', strength: '50 micrograms' }], 'capsule, one a day', 'men',
    'POM, unlicensed special, used off-label for hair loss. Leaflet: made by Xeal Pharma Ltd (MS 46688) for Careforsons.',
    '£142 for 6 months (£23.67 a month) list price', '3 months £77 · 6 months £142. Page headline "From £14.20 / month" is the first-order offer price. ' + PROMO,
    SITE + '/products/oral-minoxidil',
    'In both lists. Removed when oral minoxidil is blocked: sudden onset, high blood pressure, cardiovascular disease, phaeochromocytoma, lactose allergy, past minoxidil side effects, age over 65, tag minoxidil_disallowed. Shown as one card with a Capsule/Spray toggle paired with Minoxidil Spray. The basket code also has an off-label consent tick for oral minoxidil.',
    'code', { handles: ['oral-minoxidil', 'oral-capsule'], ageOnPage: '18-65', leaflet: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_Oral_Minoxidil__Biotin_PIL_Outlined_4.pdf' }),
  P('p-oralmin5', 'Oral Minoxidil 5mg (two 2.5 mg capsules a day)', 'rx-oral-compounded', [{ name: 'minoxidil', strength: '5 mg a day (2 x 2.5 mg)' }], 'capsules', 'men',
    'POM, unlicensed special, off-label.',
    '£187.20 for 6 months (£31.20 a month)', '3 months £105.30 · 6 months £187.20.',
    SITE + '/products/oral-minoxidil-5mg',
    'Existing customers only: the product page shows "Log In", and a separate four-question step-up consultation (flow oral-minoxidil-5mg) is for men already on 2.5 mg. The basket data has a server flag is_oral_minoxidil_eligible; how it is set is unknown.',
    'code', { handles: ['oral-minoxidil-5mg'], ageOnPage: '18-65' }),
  P('p-topfin', 'Topical Finasteride ("Hair Loss Spray")', 'rx-topical-compounded', [{ name: 'finasteride', strength: '0.15%' }], 'scalp spray, 4 pumps (0.664 ml) once a day', 'men',
    'POM, unlicensed medicine (the product page and leaflet say so).',
    '£136 for 6 months (£22.67 a month) list price', '3 months £83 · 6 months £136. ' + PROMO,
    SITE + '/products/topical-hair-loss-spray',
    'In both lists, paired with finasteride tablets on one card. Removed when topical finasteride is blocked: sudden onset, PHQ answer of "More than half the days" or worse, past finasteride side effects, kidney/liver, prostate/cancer, rheumatoid/lupus/methotrexate, sexual dysfunction, age over 65, tag finasteride_disallowed. It survives a lactose allergy answer. The product page button says "Log In" for visitors, yet the code offers it to new customers after the consultation.',
    'code', { handles: ['topical-hair-loss-spray'], leaflet: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Topical_Finasteride_PIL_Site_Version.pdf' }),
  P('p-combospray', 'Combination Spray ("Finasteride and Minoxidil", with tretinoin)', 'rx-topical-compounded',
    [{ name: 'finasteride', strength: '0.15%' }, { name: 'minoxidil', strength: '5%' }, { name: 'tretinoin', strength: '0.015%' }], 'scalp spray, 4 pumps (0.664 ml) once a day; one bottle lasts 90 days', 'men',
    'POM, unlicensed medicine made for Careforsons.',
    '£189 for 6 months (£31.50 a month) list price', '3 months £106 · 6 months £189. Page headline "From £18.90 / month" is the first-order offer price. ' + PROMO,
    SITE + '/products/topical-finasteride-minoxidil-spray',
    'In both lists. In the newer code it is the first item of both lists, so it is the single primary recommendation for a man with no blocks. Removed when the "topical combo" flag is off, which nearly every block switches off: sudden onset, PHQ answers, any past side effects (finasteride, minoxidil or combination), high blood pressure, cardiovascular disease, kidney/liver, prostate/cancer, rheumatoid/lupus/methotrexate, scalp disorder, sexual dysfunction, age over 65, either account tag. It survives phaeochromocytoma and lactose allergy.',
    'code', { handles: ['topical-finasteride-minoxidil-spray'], ageOnPage: '18-70', leaflet: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_MinoFinaTret_Topical_PIL_1126_site.pdf',
      strengthNote: 'Strengths are from the November 2026 leaflet and the shop app code. The topical finasteride product page still says its 0.15% is "slightly higher" than the Combination Spray, which suggests the page text predates a reformulation.' }),
  P('p-combocap', 'Combination Capsule', 'rx-oral-compounded', [{ name: 'finasteride', strength: '1 mg' }, { name: 'minoxidil', strength: '2.5 mg' }, { name: 'biotin', strength: '50 micrograms' }], 'capsule, one a day', 'men',
    'POM, unlicensed medicine.',
    '£189 for 6 months (£31.50 a month) list price', '1 month £32 · 3 months £106 · 6 months £189. Partner-clinic routes apply codes worth 50-55% off (HQHT45, KSLCLINIC, BHC50 appear in the code).',
    SITE + '/products/combination-capsule',
    'Not in the standard lists. Added to the top only when the account carries the tag combo_pill_eligible AND the visit came through a "combo" route (consultation URL with combo_pill=true or a partner-clinic flag). Needs oral finasteride and oral minoxidil both allowed. The product page shows "Log In" to visitors.',
    'code', { handles: ['combination-capsule', 'combination-capsule-ads'], ageOnPage: '18-70', leaflet: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_Combo_Cap_Leaflet_01_Site.pdf' }),
  P('p-dutaspray', 'Dutasteride Combination Spray', 'rx-topical-compounded', [{ name: 'dutasteride', strength: '0.1%' }, { name: 'minoxidil', strength: '5%' }, { name: 'tretinoin', strength: '0.01%' }], 'scalp spray', 'men',
    'POM, unlicensed medicine made for Careforsons.',
    '£199 for 6 months (£33.17 a month)', '3 months £111 · 6 months £199.',
    SITE + '/products/dutasteride-combination-spray',
    'Not in the standard lists. Added to the top only when the account carries the tag dutasteride_eligible (how an account earns that tag is unknown; likely set by the clinical team for men who did not respond to finasteride). The product page shows "Log In" to visitors.',
    'code', { handles: ['dutasteride-combination-spray'], leaflet: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_Dutasteride_Mino_Tret_PIL_0726.pdf' }),
  P('p-keto', 'Ketoconazole Shampoo', 'otc-medicine', [{ name: 'ketoconazole', strength: '2%' }], 'medicated shampoo, 60 ml', 'men',
    'Medicated anti-dandruff shampoo (non-prescription medicine; P or GSL class not confirmed). The checkout code makes the buyer accept ketoconazole terms.',
    '£16 for 6 months', '3 months £9.49 · 6 months £16.',
    SITE + '/products/ketoconazole',
    'Not in the recommendation lists. Sold as an add-on; the scalp questions (5613-5615) added to the consultation look designed to support it, but no served rule links them (unknown).',
    'docs', { handles: ['ketoconazole', 'ketoconazole-1'] }),
  P('p-hgc', 'Hair Growth Complex', 'supplement', [{ name: 'nine-ingredient blend including AnaGain, marine collagen, biotin, saw palmetto', strength: 'not stated' }], 'capsule/tablet, daily', 'men',
    'Food supplement.', '£168 for 6 months (£28 a month) list price', '1 month £35 · 3 months £96 · 6 months £168 · 12 months £300. Can be added to the basket without a consultation.',
    SITE + '/products/hair-growth-complex',
    'Last item of both lists and never removed by any block, so it is always offered. Also inside the Ultimate and Advanced plans.',
    'code', { handles: ['hair-growth-complex', 'hair-growth-complex-1'] }),
  P('p-biotin', 'Biotin', 'supplement', [{ name: 'biotin', strength: '900 micrograms (from the shop app code)' }], 'tablet, daily', 'men',
    'Food supplement.', '£54 for 6 months (£9 a month)', '1 month £12.99 · 3 months £30 · 6 months £54 · 12 months £96. Add to cart without a consultation.',
    SITE + '/products/biotin', 'Not recommended on its own; part of the Non-Prescription, Full Works and Simplicity plans.', 'docs', { handles: ['biotin'] }),
  P('p-shampoo', 'Strengthening Shampoo ("DHT-blocking")', 'cosmetic', [{ name: 'saw palmetto, caffeine, argan oil, vitamin B3', strength: 'cosmetic' }], 'shampoo, 200 ml', 'men',
    'Cosmetic.', '£66 for 6 months (£11 a month)', '1 month £15 · 3 months £39 · 6 months £66 · 12 months £108. Add to cart without a consultation.',
    SITE + '/products/shampoo', 'Not recommended on its own; part of the Ultimate, Non-Prescription, Full Works and Simplicity plans.', 'docs', { handles: ['shampoo'] }),
  P('p-conditioner', 'Strengthening Conditioner', 'cosmetic', [{ name: 'Octopirox, biotin, argan oil, amino acids', strength: 'cosmetic' }], 'conditioner', 'men',
    'Cosmetic.', '£66 for 6 months (£11 a month)', '1 month £17.99 · 3 months £39 · 6 months £66 · 12 months £108.',
    SITE + '/products/conditioner', 'Never recommended by the consultation; add-on.', 'docs', { handles: ['conditioner'] }),
  P('p-showerduo', 'Shower Duo (shampoo + conditioner)', 'bundle', [{ name: 'see shampoo and conditioner', strength: 'cosmetic' }], 'shampoo and conditioner', 'men',
    'Cosmetic bundle.', '£120 for 6 months (£20 a month)', '1 month £28 · 3 months £72 · 6 months £120.',
    SITE + '/products/shampoo-conditioner', 'Never recommended by the consultation; add-on.', 'docs', { handles: ['shampoo-conditioner'] }),
  P('p-clay', 'Thickening Hair Clay', 'cosmetic', [{ name: 'kaolin clay, caffeine, biotin', strength: 'cosmetic' }], 'styling clay, 75 ml', 'men',
    'Cosmetic.', '£54 for 6 months (£9 a month)', '1 month £15.99 · 3 months £30 · 6 months £54.',
    SITE + '/products/hair-thickening-clay', 'Never recommended by the consultation; add-on.', 'docs', { handles: ['hair-thickening-clay'] }),
  P('p-dermaroller', 'Dermaroller', 'device', [], 'microneedling roller', 'men', 'Device/accessory.', '£14 one pack', 'One-off item.',
    SITE + '/products/dermaroller', 'Never recommended by the consultation; pitched at men already using the minoxidil spray.', 'docs', { handles: ['dermaroller'] }),
  P('p-shine', 'Ultimate Shine Spray (a joke product)', 'cosmetic', [], 'spray', 'men', 'Novelty item; the page says "this product is a joke".', '£10 one bottle', '',
    SITE + '/products/ultimate-shine-spray', 'Never recommended; marketing stunt.', 'docs', { handles: ['ultimate-shine-spray'] }),
  // bundles
  P('p-core', 'Core Plan (spray version)', 'bundle', [{ name: 'finasteride', strength: '1 mg tablet' }, { name: 'minoxidil', strength: '5% spray' }], 'tablet + scalp spray', 'men',
    'Bundle of a licensed POM (finasteride) and a licensed non-prescription medicine (minoxidil 5%).',
    '£189 for 6 months (£31.50 a month) list price', '1 month £43 · 3 months £106 · 6 months £189 · 12 months £378. Page headline "From £18.90 / month" is the first-order offer price. ' + PROMO,
    SITE + '/products/the-duo-plan',
    'Top of the "topical" list in the older code (shown first when the man prefers sprays). Needs oral finasteride and topical minoxidil both allowed. Shown as one card with a Spray/Capsule toggle with Core Plan - Capsule.',
    'code', { handles: ['the-duo-plan'], ageOnPage: '18-65' }),
  P('p-core-cap', 'Core Plan - Capsule', 'bundle', [{ name: 'finasteride', strength: '1 mg tablet' }, { name: 'minoxidil', strength: '2.5 mg capsule (with biotin 50 micrograms)' }], 'tablet + capsule', 'men',
    'Bundle of a licensed POM and an unlicensed special (oral minoxidil).',
    '£189 for 6 months (£31.50 a month) list price', '3 months £106 · 6 months £189. ' + PROMO,
    SITE + '/products/oral-duo-plan',
    'Top of the "oral" list in the older code (shown first when the man prefers capsules or does not mind). Needs oral finasteride and oral minoxidil both allowed. If the man arrived from the Core Plan product page, the code treats that stored choice as this capsule version.',
    'code', { handles: ['oral-duo-plan'], ageOnPage: '18-65' }),
  P('p-ultimate', 'Ultimate Plan (spray version)', 'bundle', [{ name: 'finasteride', strength: '1 mg tablet' }, { name: 'minoxidil', strength: '5% spray' }, { name: 'Hair Growth Complex', strength: 'supplement' }, { name: 'Strengthening Shampoo', strength: 'cosmetic' }], 'tablet + spray + supplement + shampoo', 'men',
    'Bundle: licensed POM + licensed non-prescription medicine + supplement + cosmetic.',
    '£299 for 6 months (£49.83 a month) list price', '1 month £59 · 3 months £168 · 6 months £299 · 12 months £566.40. Page headline "From £29.90 / month" is the first-order offer price. ' + PROMO,
    SITE + '/products/ultimate-hair-loss-plan',
    'In both lists (fifth or sixth). Needs oral finasteride and topical minoxidil allowed. Tagged "most popular". Toggle card with the capsule version.',
    'code', { handles: ['ultimate-hair-loss-plan'], ageOnPage: '18-65' }),
  P('p-ultimate-cap', 'Ultimate Plan - Capsule', 'bundle', [{ name: 'finasteride', strength: '1 mg tablet' }, { name: 'minoxidil', strength: '2.5 mg capsule' }, { name: 'Hair Growth Complex', strength: 'supplement' }, { name: 'Strengthening Shampoo', strength: 'cosmetic' }], 'tablet + capsule + supplement + shampoo', 'men',
    'Bundle: licensed POM + unlicensed special + supplement + cosmetic.',
    '£299 for 6 months (£49.83 a month) list price', '3 months £168 · 6 months £299. ' + PROMO,
    SITE + '/products/ultimate-hair-loss-plan-capsule',
    'In both lists. Needs oral finasteride and oral minoxidil allowed.', 'code', { handles: ['ultimate-hair-loss-plan-capsule'], ageOnPage: '18-65' }),
  P('p-topfin-oralmin', 'Topical Finasteride & Oral Minoxidil', 'bundle', [{ name: 'finasteride', strength: '0.15% spray' }, { name: 'minoxidil', strength: '2.5 mg capsule' }], 'scalp spray + capsule', 'men',
    'Bundle of two unlicensed medicines (POM).',
    '£189 for 6 months (£31.50 a month) list price', '3 months £106 · 6 months £189. ' + PROMO,
    SITE + '/products/hair-loss-spray-hair-loss-capsule',
    'Fourth in both lists. Needs topical finasteride and oral minoxidil allowed. It is the main option left for a man with a scalp disorder or lactose allergy? No: lactose blocks oral minoxidil, so it is removed there; with a scalp disorder alone it stays.',
    'code', { handles: ['hair-loss-spray-hair-loss-capsule'] }),
  P('p-nonrx', 'Non-Prescription plan', 'bundle', [{ name: 'minoxidil', strength: '5% spray' }, { name: 'biotin', strength: 'supplement' }, { name: 'Strengthening Shampoo', strength: 'cosmetic' }], 'spray + supplement + shampoo', 'men',
    'Bundle with no prescription-only medicine. The product page lets a visitor pick a plan length and add it to the cart without the consultation.',
    '£198 for 6 months (£33 a month) list price', '1 month £42 · 3 months £109 · 6 months £198 · 12 months £380. On the day: 6 months £118.80 first order (40% off), then £198 every 6 months.',
    SITE + '/products/the-non-prescription-plan',
    'In both lists (second to last). Removed only when topical minoxidil is blocked. It is what is left, with minoxidil spray and Hair Growth Complex, when finasteride and oral minoxidil are blocked (for example sudden onset). The medical FAQ also points men trying for a baby to it.',
    'code', { handles: ['the-non-prescription-plan'] }),
  P('p-advanced', 'Advanced Plan and Advanced Plan - Capsule', 'bundle', [{ name: 'finasteride', strength: '1 mg tablet' }, { name: 'minoxidil', strength: '5% spray or 2.5 mg capsule' }, { name: 'Hair Growth Complex', strength: 'supplement' }], 'tablet + spray or capsule + supplement', 'men',
    'Bundle: POM + minoxidil + supplement.', '£254 for 6 months (£42.33 a month)', 'Spray version: 1 month £48 · 3 months £142 · 6 months £254 · 12 months £460.80. Capsule version: 3 months £142 · 6 months £254.',
    SITE + '/products/advanced-hair-loss-plan', 'Published product pages, but not in the served recommendation lists and not on the current plans page. Reachable as a cross-sell and through the plan customiser.', 'docs', { handles: ['advanced-hair-loss-plan', 'advanced-hair-loss-plan-capsule'] }),
  P('p-fullworks', 'Full Works and Oral Full Works', 'bundle', [{ name: 'finasteride', strength: '1 mg tablet' }, { name: 'minoxidil', strength: '5% spray or 2.5 mg capsule' }, { name: 'biotin', strength: 'supplement' }, { name: 'Strengthening Shampoo', strength: 'cosmetic' }], 'tablet + spray or capsule + supplement + shampoo', 'men',
    'Bundle: POM + minoxidil + supplement + cosmetic.', '£269 for 6 months (£44.83 a month)', 'Full Works: 1 month £54 · 3 months £148 · 6 months £269 · 12 months £422.40. Oral Full Works: 3 months £148 · 6 months £269.',
    SITE + '/products/the-full-works-plan', 'Older flagship plan. Still published and tagged "consultation" and "most popular", but not in the served recommendation lists (the Ultimate Plan has taken its place).', 'docs', { handles: ['the-full-works-plan', 'oral-full-works'] }),
  P('p-simplicity', 'Simplicity plan', 'bundle', [{ name: 'finasteride', strength: '1 mg tablet' }, { name: 'biotin', strength: 'supplement' }, { name: 'Strengthening Shampoo', strength: 'cosmetic' }], 'tablet + supplement + shampoo', 'men',
    'Bundle: POM + supplement + cosmetic.', '£254 for 6 months (£42.33 a month)', '1 month £48 · 3 months £142 · 6 months £254 · 12 months £412.80.',
    SITE + '/products/the-simplicity-plan', 'Older plan; published but not in the served recommendation lists.', 'docs', { handles: ['the-simplicity-plan'] }),
  P('p-legacy-combos', 'Customiser combination plans (12 legacy two- and three-item plans)', 'bundle', [{ name: 'mixes of finasteride, minoxidil (spray or capsule), biotin, shampoo', strength: 'as the single products' }], 'various', 'men',
    'Mixed: prescription and non-prescription combinations.', 'From £78 for 6 months (Biotin & Shampoo) to £213 for 6 months (oral three-item plans)',
    'Feed handles and list prices (1 / 3 / 6 / 12 months where sold): shampoo-biotin-plan £18/£42/£78/£201.50 · shampoo-minoxidil-plan, biotin-minoxidil-plan, shampoo-finasteride-plan, bioitin-finasteride-plan £31/£84/£150/£326.30 · no-biotin-plan and no-shampoo-plan £48/£118/£208/£412.80 · shampoo-oral-minoxidil-plan and biotin-oral-minoxidil-plan 3 months £96, 6 months £169 · oral-no-biotin-plan and oral-no-shampoo-plan 3 months £119, 6 months £213.',
    SITE + '/collections/all', 'Not recommended by the consultation. These are the plan SKUs the "customise products" tool in the account maps to when a customer removes or swaps an item.', 'docs',
    { handles: ['shampoo-biotin-plan', 'shampoo-minoxidil-plan', 'biotin-minoxidil-plan', 'shampoo-finasteride-plan', 'bioitin-finasteride-plan', 'no-biotin-plan', 'no-shampoo-plan', 'shampoo-oral-minoxidil-plan', 'biotin-oral-minoxidil-plan', 'oral-no-biotin-plan', 'oral-no-shampoo-plan'] }),
  P('p-transplant-bundle', 'Hair Transplant Clinic Bundle', 'bundle', [{ name: 'finasteride', strength: 'not stated' }, { name: 'minoxidil', strength: 'not stated' }, { name: 'ketoconazole shampoo', strength: 'not stated' }, { name: 'Hair Growth Complex', strength: 'supplement' }, { name: 'shampoo', strength: 'cosmetic' }], 'bundle', 'men',
    'Bundle containing prescription medicine (contents taken from the product tags).', '£142.97 for 3 months', '3 months £142.97 · 6 months £257.23 (marked unavailable in the feed).',
    SITE + '/products/hair-transplant-clinic-bundle', 'Offered through partner hair-transplant clinic pages (pre- and post-procedure plan lists come from the clinic record), not through the standard recommendation lists.', 'code', { handles: ['hair-transplant-clinic-bundle'] }),
  P('p-marketplace-packs', 'One-off retail packs (minoxidil 5% spray, ketoconazole shampoo, hair clay)', 'otc-medicine', [{ name: 'minoxidil', strength: '5%' }, { name: 'ketoconazole', strength: '2%' }], 'spray / shampoo / clay packs', 'men',
    'Non-prescription medicines and a cosmetic, sold as fixed packs.', '£29.99 for minoxidil 60 ml + ketoconazole 60 ml',
    'Minoxidil 5% 3 x 60 ml + ketoconazole 2 x 60 ml £79.99 · minoxidil 1 x 60 ml + ketoconazole 1 x 60 ml £29.99 · ketoconazole 60 ml + clay 75 ml £19.99 · ketoconazole 2 x 60 ml + clay 3 x 75 g £49.99 · ketoconazole 60 ml £9.46, two for £14.25. SKUs end in "TM"; they read like marketplace listings and are not linked from the main site menus.',
    SITE + '/collections/all', 'Not part of the consultation.', 'docs', {}),
  P('p-free-packs', 'Free packs (Welcome Pack; post-transplant Free Care Pack)', 'bundle', [], 'wash bag, pill box, travel bottles; or neck pillow, saline spray, anti-itch shampoo', 'men',
    'Not medicines.', '£0 (gift)', 'Welcome Pack: free with selected first 6-month plans during the offer. Free Care Pack "worth £49.99": for men referred by a partner transplant clinic who give a procedure date.',
    SITE + '/products/the-sons-welcome-pack', 'Gift logic, not clinical.', 'docs', {}),
  P('p-beard', 'Beard Booster', 'rx-topical-compounded', [{ name: 'minoxidil', strength: '6%' }, { name: 'tretinoin', strength: '0.01%' }], 'cream/serum for the beard area', 'men',
    'POM, unlicensed medicine.', '£180 for 6 months (£30 a month)', '1 month £46 · 3 months £105 · 6 months £180.',
    SITE + '/products/beard-booster', 'Separate beard consultation (flow beard). Facial hair, not scalp hair loss; listed because it shares the engine.', 'docs', { handles: ['beard-booster'], ageOnPage: '18-75', leaflet: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_Beard_Booster_PIL_A522UKA01_260526.pdf' }),
];
// fix one clumsy sentence written above
products.find(p => p.id === 'p-topfin-oralmin').recommendedWhen = 'Fourth in both lists. Needs topical finasteride and oral minoxidil both allowed. It stays on offer for a man who ticks only "Scalp Disorders" (topical minoxidil blocked) and goes when oral minoxidil or topical finasteride is blocked.';

// ---------------------------------------------------------------- effect helpers (from the served recommendation code)
const ALL_FIN = ['p-fin', 'p-topfin', 'p-combospray', 'p-core', 'p-core-cap', 'p-ultimate', 'p-ultimate-cap', 'p-topfin-oralmin', 'p-combocap', 'p-dutaspray'];
const ALL_MIN = ['p-min', 'p-oralmin', 'p-combospray', 'p-core', 'p-core-cap', 'p-ultimate', 'p-ultimate-cap', 'p-topfin-oralmin', 'p-nonrx', 'p-combocap', 'p-dutaspray'];
const TOP_MIN = ['p-min', 'p-combospray', 'p-core', 'p-ultimate', 'p-nonrx', 'p-dutaspray'];
const ORAL_MIN = ['p-oralmin', 'p-core-cap', 'p-ultimate-cap', 'p-topfin-oralmin', 'p-combocap'];
const ORAL_FIN_AND_ORAL_MIN = ['p-fin', 'p-core', 'p-core-cap', 'p-ultimate', 'p-ultimate-cap', 'p-oralmin', 'p-topfin-oralmin', 'p-combocap'];
const SUDDEN = ['p-fin', 'p-topfin', 'p-oralmin', 'p-combospray', 'p-core', 'p-core-cap', 'p-ultimate', 'p-ultimate-cap', 'p-topfin-oralmin', 'p-combocap', 'p-dutaspray'];
const CODE = 'recommendation-engine.excerpt.js (older page script) and src/chunks/app__recommendation__page-9574552c5f8ec4c0.pretty.js (newer app code)';
const NEXT = { effect: 'Moves to the next question. No effect on what is offered.', effectType: 'next-question', affects: [], evidence: 'observed' };
const FLAGONLY = why => ({ effect: 'No effect on the plans shown: the answer is stored and sent with the consultation, but neither copy of the served recommendation code reads it. What the server or the prescriber does with it is unknown. ' + why, effectType: 'none', affects: [], evidence: 'code' });
const rm = (what, affects, more) => ({ effect: 'Recommendation code switches off ' + what + ', so these are taken out of the list of plans shown' + (more ? '. ' + more : '.'), effectType: 'product-removed', affects, evidence: 'code' });

// ---------------------------------------------------------------- main flow: copy wording from the definition
const def = load('quiz-definition.json').data.data;
const el = {}; def.pages.forEach(p => (Array.isArray(p.elements) ? p.elements : [p.elements]).forEach(e => { el[e.name] = e; }));
const page = n => def.pages.find(p => p.name === n);
const optLabels = e => { const o = (e.choices || []).map(c => (typeof c === 'object' ? { label: strip(c.text), value: c.value } : { label: strip(c), value: c })); if (e.showNoneItem) o.push({ label: e.noneText || 'None', value: 'none' }); return o; };
let order = 0; const mq = [];
const Q = (name, m) => {
  const e = el[name]; if (!e) throw new Error('no element ' + name);
  const text = strip(e.title) || name; const detail = strip(e.description) || undefined;
  const type = m.type || ({ radiogroup: 'single', imagepicker: 'single', checkbox: 'multi', comment: 'text', text: 'text', html: 'info' }[e.type] || 'info');
  const opts = (m.noOptions ? [] : optLabels(e)).map(o => Object.assign({ label: o.label, value: o.value }, (m.opt && (m.opt[o.value] || m.opt[o.label])) || m.optDefault || NEXT));
  mq.push({ id: 'men-q' + String(++order).padStart(2, '0'), order, codeId: name, stage: m.stage || 'anonymous', text: m.text || text, detail: m.detail || detail, type, required: e.isRequired === true, options: opts,
    purpose: m.purpose, engineRole: m.engineRole, branches: !!m.branches, branchDetail: m.branchDetail || '', shownWhen: m.shownWhen || 'always (for anyone who answered Male)', visibleIfInCode: e.visibleIf || undefined, evidence: m.evidence || 'observed' });
};
const TXT = (why, shownWhen, ev) => ({ type: 'text', noOptions: true, purpose: why, engineRole: 'safety-screen', shownWhen, evidence: ev || 'observed' });

Q('5140', { purpose: 'Sends existing customers to sign in instead of creating a second account.', engineRole: 'identity', branches: true, branchDetail: 'Yes leaves the questionnaire for the sign-in page.', shownWhen: 'always (first screen)',
  opt: { 1: { effect: 'The questionnaire is cleared and the browser goes to sons.co.uk/account/login?return_url=/pages/consultation-hair. Account wall straight away.', effectType: 'skip-questions', affects: [], evidence: 'observed' }, 0: NEXT } });
Q('5141', { purpose: 'Sons only treats people born male. This is the only stop screen before the account form.', engineRole: 'eligibility-gate', branches: true, branchDetail: 'Female hides every other page and shows the female notice.', shownWhen: 'always (second screen)',
  opt: { 1: { effect: 'Hard stop. Shows the notice "Sons products are formulated for those born male…" with a "Finish Consultation" button. The code then shows the message "Unfortunately you are ineligible for prescription based products. Redirecting to the home page." and nothing is sent.', effectType: 'hard-stop', affects: [], evidence: 'observed' }, 0: NEXT } });
Q('5142', { type: 'consent', purpose: 'Self-declaration: male, over 18, lives in the UK, sole user, accepts terms, answers honestly. Age is not checked here; date of birth is only asked on the account form.', engineRole: 'consent', branches: false,
  optDefault: { effect: 'Required tick. Without it the Continue button will not move on.', effectType: 'next-question', affects: [], evidence: 'observed' } });
Q('5147', { purpose: 'Rough pattern of hair loss, picked from four drawings. It is the only "how bad is it" question; there is no Norwood scale.', engineRole: 'diagnosis', branches: false,
  branchDetail: 'No branch and no stop for any option, including "Random patches" and "Completely bald" (seen live: the next question is the same for all).',
  opt: { 0: FLAGONLY('Typical male pattern.'), 1: FLAGONLY('Typical male pattern (used for the baseline man).'), 2: FLAGONLY('Patchy loss would normally point away from male pattern baldness, yet no warning or stop appears. Whether the prescriber acts on it is unknown.'), 3: FLAGONLY('No stop screen appears even though treatment cannot help a fully bald scalp. The app code knows notice pages called "extensive-loss-notice" and "Sudden Hair Loss Notice" (from another market or an earlier version), but the current UK questionnaire contains neither.') } });
Q('5143', { purpose: 'Separates slow male-pattern loss from sudden shedding, which needs a doctor.', engineRole: 'safety-screen', branches: true, branchDetail: 'Suddenly adds three yes/no questions (body hair, new medicines, other symptoms).',
  opt: { 0: NEXT, 1: Object.assign(rm('oral finasteride, topical finasteride, oral minoxidil and the combination spray', SUDDEN, 'Topical minoxidil is NOT switched off, so Minoxidil Spray, the Non-Prescription plan and Hair Growth Complex are still offered. It also adds three follow-up questions (seen live).'), { effectType: 'product-removed' }) } });
Q('5144', { purpose: 'Looks for alopecia areata / general hair loss.', engineRole: 'safety-screen', shownWhen: 'only if hair loss started "Suddenly"', optDefault: FLAGONLY('Likely for the prescriber (not confirmed).') });
Q('5145', { purpose: 'Looks for drug-induced hair loss.', engineRole: 'safety-screen', shownWhen: 'only if hair loss started "Suddenly"', optDefault: FLAGONLY('Likely for the prescriber (not confirmed). Note there is no free-text box to name the medicine.') });
Q('5146', { purpose: 'Looks for illness behind sudden shedding.', engineRole: 'safety-screen', shownWhen: 'only if hair loss started "Suddenly"', optDefault: FLAGONLY('Likely for the prescriber (not confirmed). No free-text box follows.') });
Q('3216', { purpose: 'Finasteride mood warning (MHRA). Opens a short depression screen.', engineRole: 'safety-screen', branches: true, branchDetail: 'Yes adds a free-text box and two PHQ-2 style questions.',
  opt: { 1: { effect: 'Adds three screens: a free-text box and two "over the past two weeks" questions. On its own it does not remove any product: the line that would block finasteride for a plain Yes is commented out in the served code.', effectType: 'extra-questions', affects: [], evidence: 'observed' }, 0: NEXT } });
Q('3217', TXT('Free text on diagnosis, treatment, last review, changes in mood, energy or sex drive. Required.', 'only if mood question = Yes'));
const PHQ = { 0: { effect: 'No product change.', effectType: 'none', affects: [], evidence: 'code' }, 1: { effect: 'No product change.', effectType: 'none', affects: [], evidence: 'code' },
  2: rm('oral finasteride, topical finasteride and the combination spray (score of 2 or more on either question)', ALL_FIN, 'Minoxidil products stay.'), 3: rm('oral finasteride, topical finasteride and the combination spray (score of 2 or more on either question)', ALL_FIN, 'Minoxidil products stay.') };
Q('3275', { purpose: 'First PHQ-2 depression question.', engineRole: 'safety-screen', shownWhen: 'only if mood question = Yes', opt: PHQ });
Q('3276', { purpose: 'Second PHQ-2 depression question.', engineRole: 'safety-screen', shownWhen: 'only if mood question = Yes', opt: PHQ });
Q('5148', { purpose: 'Treatment history; decides which side-effect questions follow.', engineRole: 'safety-screen', branches: true, branchDetail: 'Each ticked medicine adds its own "Have you experienced any adverse effects?" screen, shown after the treatment preference question.',
  opt: { 0: { effect: 'Adds the finasteride side-effect question later.', effectType: 'extra-questions', affects: [], evidence: 'observed' }, 1: { effect: 'Adds the minoxidil side-effect question later.', effectType: 'extra-questions', affects: [], evidence: 'observed' }, 2: { effect: 'Adds the combination side-effect question later.', effectType: 'extra-questions', affects: [], evidence: 'observed' }, none: NEXT } });
Q('What treatment type do you prefer?', { text: 'What treatment type do you prefer?', purpose: 'The one product-choice question. It only changes the ORDER of plans, never what is allowed.', engineRole: 'product-selector', branches: false,
  opt: { 0: { effect: 'Uses the "topical" order. Older page script: Core Plan (tablet + minoxidil spray) first, each paired card opens on its spray version. Newer app code: the Combination Spray is first either way.', effectType: 'product-switched', affects: ['p-core', 'p-core-cap', 'p-combospray'], evidence: 'code' },
    1: { effect: 'Uses the "oral" order. Older page script: Core Plan - Capsule first, paired cards open on the capsule/tablet version.', effectType: 'product-switched', affects: ['p-core-cap', 'p-core', 'p-combospray'], evidence: 'code' },
    2: { effect: 'Treated exactly like "Oral capsule" (the code only tests for answer 0 = topical).', effectType: 'product-switched', affects: ['p-core-cap', 'p-core', 'p-combospray'], evidence: 'code' } } });
const SE = (what, affects, more) => ({ 1: Object.assign(rm(what, affects, more), {}), 0: { effect: 'No product change.', effectType: 'none', affects: [], evidence: 'code' } });
Q('5149', { purpose: 'Past finasteride side effects.', engineRole: 'safety-screen', branches: true, branchDetail: 'Yes adds an optional free-text box.', shownWhen: 'only if "Finasteride or Propecia" was ticked', opt: SE('oral finasteride, topical finasteride and the combination spray', ALL_FIN, 'Also opens a free-text box (seen live).') });
Q('5150', TXT('Free text about finasteride side effects. Optional.', 'only if finasteride side effects = Yes'));
Q('5151', { purpose: 'Past minoxidil side effects.', engineRole: 'safety-screen', branches: true, branchDetail: 'Yes adds an optional free-text box.', shownWhen: 'only if "Minoxidil or Regaine" was ticked', opt: SE('oral minoxidil, topical minoxidil and the combination spray', ALL_MIN, 'Also opens a free-text box (seen live).') });
Q('5152', TXT('Free text about minoxidil side effects. Optional.', 'only if minoxidil side effects = Yes'));
Q('5153', { purpose: 'Past side effects from a topical finasteride + minoxidil mix.', engineRole: 'safety-screen', branches: true, branchDetail: 'Yes adds an optional free-text box.', shownWhen: 'only if "Topical Finasteride Minoxidil Combination" was ticked', opt: SE('the combination spray only', ['p-combospray', 'p-dutaspray'], 'Separate finasteride and minoxidil products stay. Also opens a free-text box (seen live).') });
Q('5154', TXT('Free text about combination side effects. Optional.', 'only if combination side effects = Yes'));
Q('5155', { purpose: 'The main medical screen: nine tick boxes. Each one switches whole drug families off in the recommendation code and opens its own free-text box.', engineRole: 'safety-screen', branches: true,
  branchDetail: 'Every ticked condition adds a free-text screen. Scalp Disorders adds four screens. No tick causes a stop: with all nine ticked the flow still reaches the account form (run all-branches-men).',
  opt: { 0: rm('oral minoxidil, topical minoxidil and the combination spray', ALL_MIN, 'Finasteride tablets, topical finasteride and Hair Growth Complex stay. No check of whether blood pressure is controlled in this version. Adds an optional free-text box.'),
    1: rm('oral minoxidil, topical minoxidil and the combination spray', ALL_MIN, 'Same effect as High Blood Pressure. Adds a required free-text box.'),
    2: rm('oral finasteride, topical finasteride and the combination spray', ALL_FIN, 'Minoxidil spray, oral minoxidil, Non-Prescription plan and Hair Growth Complex stay. Adds a required free-text box.'),
    3: rm('oral finasteride, topical finasteride and the combination spray', ALL_FIN, 'Adds a required free-text box.'),
    4: rm('oral finasteride, topical finasteride and the combination spray', ALL_FIN, 'Adds a required free-text box about medicines.'),
    5: rm('topical minoxidil and the combination spray', TOP_MIN, 'Oral routes stay: Core Plan - Capsule, Ultimate - Capsule, oral minoxidil, finasteride tablets, topical finasteride. Adds four screens: free text plus three scalp tick-box questions.'),
    6: rm('oral minoxidil only', ORAL_MIN, 'Topical minoxidil and all finasteride options stay. Adds a required free-text box.'),
    7: rm('oral finasteride and oral minoxidil (both contain lactose)', ORAL_FIN_AND_ORAL_MIN, 'Left on offer: Combination Spray, Minoxidil Spray, topical finasteride, Non-Prescription plan, Hair Growth Complex. Adds a required free-text box.'),
    8: rm('oral finasteride, topical finasteride and the combination spray', ALL_FIN, 'Adds a required free-text box.'),
    none: NEXT } });
Q('5158', TXT('Detail on high blood pressure. Optional (the only condition box that can be left empty).', 'only if High Blood Pressure ticked'));
Q('5159', TXT('Detail on cardiovascular disease. Required.', 'only if Cardiovascular Disease ticked'));
Q('5160', TXT('Detail on severe kidney or liver disease. Required.', 'only if Severe Kidney or Liver Disease ticked'));
Q('5161', TXT('Detail on prostate disease or cancer. Required.', 'only if Prostate Disease, Male Breast Cancer or Testicular Cancer ticked'));
Q('5162', TXT('Medicines for rheumatoid arthritis or lupus (methotrexate). Required.', 'only if Rheumatoid Arthritis, Systemic Lupus or on Methotrexate ticked'));
Q('5163', TXT('Detail on the scalp condition. Required.', 'only if Scalp Disorders ticked'));
const SCALP = why => ({ purpose: why, engineRole: 'diagnosis', shownWhen: 'only if Scalp Disorders ticked', optDefault: FLAGONLY('Optional question; Continue works with nothing ticked (seen live). Probably supports the newer ketoconazole shampoo (not confirmed).') });
Q('5613', SCALP('Dandruff / seborrhoeic dermatitis symptom list. Newer question ids (56xx) than the rest, so recently added.'));
Q('5614', SCALP('What the man has already tried for his scalp.'));
Q('5615', SCALP('Scalp red flags: open sores, infection, severe pain. No warning or stop appears when ticked (not ticked in any run; from the definition there is no linked page).'));
Q('5164', TXT('Detail on phaeochromocytoma. Required.', 'only if Phaeochromocytoma ticked'));
Q('5165', TXT('Detail on lactose allergy. Required. The wording tells the man the oral treatments hold only tiny amounts of lactose.', 'only if Diagnosed Lactose Allergy ticked'));
Q('5166', TXT('Detail on sexual dysfunction. Required.', 'only if Sexual Dysfunction ticked'));
Q('5167', { type: 'date', noOptions: true, purpose: 'Internal field for staff/system use. It has no input type, so it is never drawn on screen.', engineRole: 'data-capture', shownWhen: 'never shown to the patient (blank question type in the definition)', evidence: 'code' });
Q('5168', { type: 'date', noOptions: true, purpose: 'Internal field for the repeat "health check". Never drawn on screen.', engineRole: 'data-capture', shownWhen: 'never shown to the patient (blank question type in the definition)', evidence: 'code' });
Q('finasteride-statement', { type: 'info', noOptions: true, text: "Please confirm that you've read and understood the following:", detail: strip(el['finasteride-statement'].html),
  purpose: 'Finasteride safety statement: mood and sexual side effects, stop three months before trying for a baby, and a note that some plans contain off-label or unlicensed "specials". Shown to every man whatever he answered.', engineRole: 'expectation-setting' });
Q('finasteride-agreement', { type: 'consent', text: 'I confirm that I have read and understood the above statement', purpose: 'Required tick before the account form.', engineRole: 'consent',
  optDefault: { effect: 'Required. Unlocks the account form.', effectType: 'next-question', affects: [], evidence: 'observed' } });
Q('nhs-summary-of-care', { type: 'consent', text: 'NHS Summary Of Care (optional): "Do you consent to us accessing your NHS Summary Care Record (the medical details held by your GP) or requesting further information on your medical history from your GP?"',
  purpose: 'Optional consent for the prescriber to read the NHS Summary Care Record. Product pages say the final decision rests on the consultation "and NHS Summary Care Record".', engineRole: 'consent',
  optDefault: { effect: 'Opens a second tick box "I agree". Optional; no effect on the plans shown.', effectType: 'flag-for-clinician', affects: [], evidence: 'code' }, evidence: 'code' });
Q('gp-share', { type: 'consent', text: 'GP Consent (optional): "Do you consent to us sharing consultation information with your GP?"', purpose: 'Optional consent to tell the GP. If agreed, the account form adds GP surgery name and address fields.', engineRole: 'consent', branches: true, branchDetail: 'Agreeing adds five GP surgery fields to the account form.',
  optDefault: { effect: 'Opens a second tick box "I agree"; agreeing adds GP surgery fields to the account form.', effectType: 'extra-questions', affects: [], evidence: 'code' }, evidence: 'code' });
// account wall
const acc = page('account-create');
mq.push({ id: 'men-q' + String(++order).padStart(2, '0'), order, codeId: 'account-create', stage: 'anonymous', text: acc.title, type: 'contact',
  detail: 'Fields: ' + acc.elements.map(e => strip(e.title) || (e.choices || []).join(' / ')).filter(Boolean).join(' · ') + '. Button: "Get my personalised plan". Marketing consent boxes (Email, SMS and Postal Mail; Whatsapp) are pre-ticked.',
  required: true, options: [], purpose: 'THE ACCOUNT WALL. Name, email, phone, date of birth and a password are needed to see any recommendation. Pressing the button creates the account and sends the whole consultation in one request (customer/survey). Date of birth is checked here: under 18 is refused on screen.',
  engineRole: 'identity', branches: false, branchDetail: '', shownWhen: 'always, after the finasteride statement', evidence: 'observed' });
const fem = page('female-client-notice').elements;
mq.push({ id: 'men-q' + String(++order).padStart(2, '0'), order, codeId: 'female-client-notice', stage: 'anonymous', text: strip(fem.html), type: 'info', required: false, options: [],
  purpose: 'Stop screen for anyone who answers Female.', engineRole: 'eligibility-gate', branches: false, branchDetail: '', shownWhen: 'only if gender at birth = Female', evidence: 'observed' });
// after the wall: from served code and public docs only
const after = (codeId, stage, text, type, options, purpose, engineRole, shownWhen, detail) => mq.push({ id: 'men-q' + String(++order).padStart(2, '0'), order, codeId, stage, text, type, detail, required: false, options, purpose, engineRole, branches: false, branchDetail: '', shownWhen, evidence: 'code' });
const U = l => ({ label: l, effect: 'Not tested (behind the account wall).', effectType: 'unknown', affects: [], evidence: 'unknown' });
after('recommendation', 'after-account', 'Based on your responses in the consultation, our medical team recommend the following plan for you:', 'info', [],
  'Recommendation screen ("<first name>\'s Hair Growth Recommendations"). One or two primary plan cards, then "See more plans". The list is built in the browser from the answers by the code saved in recommendation-engine.excerpt.js.', 'product-selector', 'after account creation', 'Not seen live. Wording from the page script.');
after('plan-length', 'after-account', 'Choose your plan (subscription length)', 'single', ['1 month', '3 months', '6 months', '12 months'].map(l => ({ label: l, effect: 'Sets how many months are sent and billed up front; longer plans cost less per month. Not every product has every length (minoxidil 1-month is hidden on the recommendation page).', effectType: 'marketing-only', affects: [], evidence: 'code' })),
  'Plan length = billing period. Paid up front, renews at the same interval.', 'personalisation', 'after account creation');
after('how_did_you_hear', 'checkout', 'How did you hear about Sons?', 'single', ['Facebook/Instagram', 'Search Engine', 'Recommended by Friend / Family', 'TV Advertisement', 'Print Media (magazines, billboards)', 'Sports Team Partnership', 'Podcast / Radio', 'Clinic Referral', 'Online Reviews', 'Tiktok', 'Reddit', 'Youtube', 'ChatGPT', 'Train Poster'].map(l => ({ label: l, effect: 'Marketing attribution only.', effectType: 'marketing-only', affects: [], evidence: 'code' })),
  'Attribution survey at checkout.', 'marketing', 'checkout');
after('oral_minoxidil_consent', 'checkout', 'I confirm that I have been informed that Minoxidil 2.5mg is approved for the treatment of high blood pressure, but is prescribed off-label for hair loss treatment and that approved alternatives exist. I agree to this off-label prescription.', 'consent', [U('I have read the notice and explicitly agree to off-label prescription.')],
  'Off-label consent for oral minoxidil. The text sits in the shared translation file with an error message "Please accept terms & conditions for this oral minoxidil product"; which markets show it was not confirmed.', 'consent', 'checkout, when the basket holds oral minoxidil (market not confirmed)');
after('keto_terms', 'checkout', 'Ketoconazole terms and conditions (exact wording not served to anonymous visitors)', 'consent', [], 'The checkout refuses to place the order until "all terms and conditions for this Ketoconazole product" are accepted.', 'consent', 'checkout, when the basket holds ketoconazole shampoo');
after('pharmacy_disclaimer', 'checkout', 'Pharmacy disclaimer (exact wording not served to anonymous visitors)', 'consent', [], 'Error text in code: "Please accept the pharmacy disclaimer."', 'consent', 'checkout');
after('identity', 'checkout', 'Identity verification: British passport or driving licence number', 'text', [], 'If automatic identity checks fail, the customer is asked for passport MRZ digits or driving licence number. Orders "without a male patient name will be held".', 'identity', 'after order, only if the automatic check fails');
after('health_check', 'after-account', "Before your next order can be dispatched, we require you to confirm if you've experienced any changes in your health status whilst using your prescription medication", 'single', [U('No changes in my health status'), U('My health status has changed')],
  'Repeat "health check" for subscribers. "Changed" reopens the consultation in health_check mode; the answer page can report "eligibility_changed".', 'safety-screen', 'existing subscribers, before a renewal is sent');

// ---------------------------------------------------------------- oral minoxidil 5 mg flow
const om = load('src/survey-oral_minoxidil_5mg_consultation.raw.json').data.data.pages[0].elements; let o2 = 0;
const omMeta = {
  '5712': ['Has 2.5 mg worked? Step-up is pitched at men who have plateaued.', 'personalisation'],
  '5713': ['Side effects on 2.5 mg.', 'safety-screen'], '5714': ['Free text on side effects.', 'safety-screen'],
  '5715': ['Changes in health or medicines since starting.', 'safety-screen'], '5716': ['Free text on what changed.', 'safety-screen'],
  '5717': ['Consent to double the dose.', 'consent'] };
const omq = om.map(e => ({ id: 'om5-q' + (++o2), order: o2, codeId: e.name, stage: 'anonymous', text: e.title, type: e.type === 'comment' ? 'text' : e.type === 'checkbox' ? 'consent' : 'single', required: !!e.isRequired,
  options: (e.choices || []).map(c => ({ label: c, effect: e.name === '5713' || e.name === '5715' ? (c === 'Yes' ? 'Opens a required free-text box. Effect on approval unknown (reviewed by the prescriber).' : 'No extra box.') : 'Effect on approval unknown; the form is a single page with no stop screens.', effectType: (e.name === '5713' || e.name === '5715') && c === 'Yes' ? 'extra-questions' : 'unknown', affects: (e.name === '5713' || e.name === '5715') && c === 'Yes' ? [] : ['p-oralmin5'], evidence: (e.name === '5713' || e.name === '5715') && c === 'Yes' ? 'code' : 'unknown' })),
  purpose: omMeta[e.name][0], engineRole: omMeta[e.name][1], branches: e.name === '5713' || e.name === '5715', branchDetail: e.name === '5713' || e.name === '5715' ? 'Yes shows the free-text box that follows.' : '',
  shownWhen: e.visibleIf ? 'only if the question before = Yes' : 'always', evidence: e.visibleIf ? 'code' : 'observed' }));

// ---------------------------------------------------------------- beard flow
const bd = load('src/survey-beard.raw.json').data.data; let o3 = 0; const bq = [];
const bMeta = {
  '5140': ['Existing customers are sent to sign in.', 'identity'], '5141': ['Born-male gate (same as the hair flow).', 'eligibility-gate'], '5142': ['Self-declaration tick.', 'consent'],
  '5172': ['Pattern of beard loss. Sudden well-defined patches or inflamed skin point away from simple patchy growth.', 'diagnosis'], '5173': ['Hair loss elsewhere on the body.', 'safety-screen'], '5174': ['Free text.', 'safety-screen'],
  '5175': ['Minoxidil history.', 'safety-screen'], '5176': ['Minoxidil side effects.', 'safety-screen'], '5177': ['Free text.', 'safety-screen'], '5178': ['Allergy to either active ingredient.', 'safety-screen'],
  '5179': ['Skin conditions of the face.', 'safety-screen'], '5180': ['Informed-risk question for psoriasis.', 'consent'], '5181': ['Free text.', 'safety-screen'] };
bd.pages.forEach(p => { if (!Array.isArray(p.elements) || p.name === 'account-create') return; p.elements.forEach(e => { if (!bMeta[e.name]) return;
  bq.push({ id: 'beard-q' + (++o3), order: o3, codeId: e.name, stage: 'anonymous', text: strip(e.title), detail: strip(e.description) || undefined, type: e.type === 'comment' ? 'text' : e.name === '5142' ? 'consent' : e.type === 'checkbox' ? 'multi' : 'single', required: !!e.isRequired,
    options: optLabels(e).map(o => ({ label: o.label, effect: 'Not tested. The app code names a "Beard Booster Not Recommended" notice, but the current definition has no such page.', effectType: 'unknown', affects: ['p-beard'], evidence: 'unknown' })),
    purpose: bMeta[e.name][0], engineRole: bMeta[e.name][1], branches: ['5173', '5175', '5176', '5179'].includes(e.name), branchDetail: '', shownWhen: e.visibleIf ? 'code condition: ' + e.visibleIf : 'always', evidence: 'code' }); }); });
bq.push({ id: 'beard-q' + (++o3), order: o3, codeId: 'account-create', stage: 'anonymous', text: 'Based on your questionnaire results, we are now preparing your personalised health plan. Please complete your account set up to continue.', type: 'contact', required: true, options: [],
  purpose: 'Account wall (same form as the hair flow). After it the code sends the man to the Beard Booster product page.', engineRole: 'identity', branches: false, branchDetail: '', shownWhen: 'always, last screen', evidence: 'code' });

// ---------------------------------------------------------------- clinic flow
const cq = [
  { id: 'clinic-q1', order: 1, codeId: 'treatment_type', stage: 'anonymous', text: 'What is your treatment type?', type: 'single', required: true,
    options: [{ label: 'transplant (the only value in the clinic record for British Hair Clinic; the on-screen label was not opened)', effect: 'Unknown. The clinic record carries separate pre-procedure and post-procedure plan lists.', effectType: 'unknown', affects: ['p-transplant-bundle'], evidence: 'unknown' }],
    purpose: 'Partner hair-transplant clinic landing page. Ties the man to the clinic and to a pre- or post-procedure plan list.', engineRole: 'product-selector', branches: true, branchDetail: 'Leads to a procedure date question, then the standard consultation with clinic_id attached.', shownWhen: 'on shop.sons.co.uk/clinics/<clinic>', evidence: 'observed' },
  { id: 'clinic-q2', order: 2, codeId: 'procedure_date', stage: 'anonymous', text: 'What is your procedure date?', type: 'date', required: true, options: [],
    purpose: 'Decides pre-op versus post-op plans and the free post-op pack ("You\'re eligible for a free* post-op transplant pack worth £49.99").', engineRole: 'product-selector', branches: false, branchDetail: '', shownWhen: 'after treatment type', evidence: 'code' } ];

// ---------------------------------------------------------------- rules (read from code; none tested live because the result sits behind the account wall)
const R = (id, when, then, effectType, affects, confidence, extra) => Object.assign({ id, flow: 'men', when, then, effectType, affects, evidence: 'code', proof: CODE, confidence }, extra || {});
const rules = [
  R('R1', "Gender at birth = Female", 'Hard stop with a notice; redirected to the home page; nothing sent.', 'hard-stop', [], 'high', { evidence: 'observed', proof: 'runs/baseline-women' }),
  R('R2', "Existing Sons customer = Yes", 'Questionnaire dropped; sent to the sign-in page.', 'skip-questions', [], 'high', { evidence: 'observed', proof: 'runs/existing-customer-yes' }),
  R('R3', "Male, any combination of answers", 'No stop screen before the account form. Even sudden onset + every condition ticked reaches the account form.', 'none', [], 'high', { evidence: 'observed', proof: 'runs/all-branches-men vs runs/baseline-men' }),
  R('R4', "Treatment preference = Topical sprays", 'Plan list uses the topical order; otherwise the oral order ("I don\'t mind" counts as oral).', 'product-switched', ['p-core', 'p-core-cap', 'p-combospray'], 'medium'),
  R('R5', "Hair loss started Suddenly", 'Oral finasteride, topical finasteride, oral minoxidil and the combination spray are removed. Minoxidil spray, Non-Prescription plan and Hair Growth Complex remain.', 'product-removed', SUDDEN, 'medium'),
  R('R6', "Either PHQ question = More than half the days or Nearly every day", 'All finasteride (tablet, spray, combination) removed.', 'product-removed', ALL_FIN, 'medium'),
  R('R7', "Mood question = Yes but both PHQ answers below 2", 'No product removed (the blocking line is commented out).', 'none', [], 'medium'),
  R('R8', "Past finasteride side effects = Yes", 'All finasteride removed.', 'product-removed', ALL_FIN, 'medium'),
  R('R9', "Past minoxidil side effects = Yes", 'All minoxidil (spray, capsule, combination, Non-Prescription plan) removed.', 'product-removed', ALL_MIN, 'medium'),
  R('R10', "Past combination side effects = Yes", 'Combination spray removed only.', 'product-removed', ['p-combospray', 'p-dutaspray'], 'medium'),
  R('R11', "High Blood Pressure or Cardiovascular Disease ticked", 'All minoxidil removed, topical included. Finasteride tablet, topical finasteride and Hair Growth Complex remain.', 'product-removed', ALL_MIN, 'medium'),
  R('R12', "Severe Kidney or Liver Disease, Prostate/Breast/Testicular cancer group, Rheumatoid/Lupus/Methotrexate, or Sexual Dysfunction ticked", 'All finasteride removed. Minoxidil options remain.', 'product-removed', ALL_FIN, 'medium'),
  R('R13', "Scalp Disorders ticked", 'Topical minoxidil and the combination spray removed. Oral options and topical finasteride remain.', 'product-removed', TOP_MIN, 'medium'),
  R('R14', "Phaeochromocytoma ticked", 'Oral minoxidil removed only.', 'product-removed', ORAL_MIN, 'medium'),
  R('R15', "Diagnosed Lactose Allergy ticked", 'Finasteride tablets and oral minoxidil removed; sprays remain.', 'product-removed', ORAL_FIN_AND_ORAL_MIN, 'medium'),
  R('R16', "Age over 65 (from date of birth on the account)", 'Older page script: finasteride (tablet and spray), oral minoxidil and combination spray removed, minoxidil spray kept. Newer app code: everything including minoxidil spray removed. Product pages meanwhile say finasteride suits ages 18-75.', 'product-removed', SUDDEN, 'low'),
  R('R17', "Date of birth under 18 on the account form", 'Form refuses: "You must be at least 18 years old to continue."', 'hard-stop', [], 'medium'),
  R('R18', "Account tag finasteride_disallowed / minoxidil_disallowed (set by staff or server; trigger unknown)", 'Removes that whole drug family from the list.', 'product-removed', ALL_FIN.concat(['p-min', 'p-oralmin', 'p-nonrx']), 'medium'),
  R('R19', "Account tag dutasteride_eligible", 'Dutasteride Combination Spray is put first in the list.', 'product-added', ['p-dutaspray'], 'medium'),
  R('R20', "Account tag combo_pill_eligible AND a combo route (combo_pill=true or partner-clinic flag)", 'Combination Capsule is put first in the list.', 'product-added', ['p-combocap'], 'medium'),
  R('R21', "Visitor came from a product page that stored a chosen product", 'That product is moved to the top (Core Plan is swapped for Core Plan - Capsule, Oral Capsule for Oral Minoxidil, Oral Tablet for Finasteride) if it survives the blocks.', 'product-switched', ['p-core-cap', 'p-oralmin', 'p-fin'], 'low'),
  R('R22', "Hair-loss picture (any of four), body hair loss, new medicines, other symptoms, scalp tick boxes, free-text answers", 'Not read by the recommendation code. Saved for the prescriber; effect on approval unknown.', 'none', [], 'medium'),
  R('R23', "Nothing blocked", 'Older page script shows two primary cards (first two of the list); if finasteride tablets or minoxidil spray are blocked it shows one. Newer app code always shows one primary card. Hair Growth Complex is never removed.', 'none', ['p-hgc'], 'medium'),
];

// ---------------------------------------------------------------- assemble
const out = {
  slug: 'sons', company: 'Sons', market: 'UK', website: 'https://www.sons.co.uk/', parent: 'Careforsons Ltd (trading as Sons), company number 11557956, London. Sister sites sons.ie and sonshaar.de.',
  audiences: ['men'],
  model: "Men-only UK hair-loss subscription brand. Its own Shopify store and consultation app sell licensed finasteride 1 mg and minoxidil 5% (Sons holds the licences), unlicensed compounded sprays and capsules, supplements and shampoos; prescribing and dispensing are done by a partner, The Independent Pharmacy (ABSM Healthcare Ltd, GPhC 9012559).",
  checkedOn: '2026-11-23',
  access: {
    howTested: ['live-walk', 'site-code', 'public-docs'],
    accountWall: 'After the last consent screen (finasteride statement). The next screen is an account form (first name, last name, email, phone, date of birth, password) titled "Based on your questionnaire results, we are now preparing your personalised health plan. Please complete your account set up to continue." No recommendation, product or price is shown before it. Pressing "Get my personalised plan" creates the account and sends the consultation together. Answering "Yes" to "Are you an existing Sons customer?" hits the sign-in page at question 1.',
    blockers: ['sons.co.uk/agents.md (listed in the sitemap) returned a Cloudflare "Verifying your connection" check to curl; not pursued.', 'Recommendation, plan choice, basket and checkout screens need an account, so they were read from served code only.'],
    coverageNote: 'Walked live with the baseline man to the account form (11 screens), then once more with every branch switched on, so all 24 conditional screens were also seen live. The baseline woman is stopped at question 2. The full question set (38 pages) was read from the survey definition the page itself downloads, and the rules that turn answers into plans were read from two copies of the recommendation code that the site serves to anonymous visitors. Nothing behind the account form was tested live: no account, email, phone or order was created. Product strengths come from public leaflets and the shop app code; prices from the public product feed.'
  },
  products,
  flows: [
    { id: 'men', name: "Hair-loss consultation (the only route in for scalp hair loss; survey code uk_consultation)", audience: 'men', entryUrl: 'https://shop.sons.co.uk/consultation/?logged_in=false',
      stagesSummary: '2 gate questions (existing customer, sex at birth) → self-declaration tick → 6 core screens for a healthy man (picture, onset, mood, past medicines, format preference, conditions) with up to 24 extra conditional screens → finasteride statement and optional NHS/GP consents → ACCOUNT WALL (account form; consultation is sent with it) → recommendation page, plan length, basket, checkout, identity check, prescriber review (not tested; read from code and public pages).',
      entryPoints: [
        { label: '"Start consultation" on sons.co.uk/pages/consultation-hair (linked from the home page, menu "Consultation", and the "Get started" button on almost every hair product and plan page)', url: 'https://sons.co.uk/pages/consultation-hair', evidence: 'observed' },
        { label: 'Duplicate landing page', url: 'https://sons.co.uk/pages/consultation-hair-2', evidence: 'docs' },
        { label: 'The app itself', url: 'https://shop.sons.co.uk/consultation/?logged_in=false', evidence: 'observed' },
        { label: 'URL switches read by the app, all loading the same questions: combo_pill=true, from_clinic=yes, from_ksl_clinic=yes, bhc-clinic=yes (send the man to a "combo" recommendation page), is_google=true (recommendation/google), health_check=true (repeat health check for subscribers), clinic_consultation + clinic_id (partner clinic), customer=<token> (auto sign-in)', url: 'https://shop.sons.co.uk/consultation/', evidence: 'code' },
        { label: 'Product pages for Oral Minoxidil 5mg, Combination Capsule, Dutasteride spray, Topical Finasteride and Topical Finasteride & Oral Minoxidil show "Log In" instead of "Get started"', url: 'https://sons.co.uk/products/combination-capsule', evidence: 'docs' },
        { label: 'No consultation at all: Non-Prescription plan, Hair Growth Complex, biotin, shampoo, conditioner, clay, dermaroller have plan pickers / "Add to cart" on their pages', url: 'https://sons.co.uk/products/the-non-prescription-plan', evidence: 'docs' }
      ],
      questions: mq },
    { id: 'oral-minoxidil-5mg', name: 'Oral minoxidil 5 mg step-up consultation (existing customers on 2.5 mg)', audience: 'men', entryUrl: 'https://shop.sons.co.uk/consultation/?logged_in=false&oral_minoxidil_5mg=true',
      stagesSummary: 'One page, four visible questions plus two conditional text boxes. The questions render for an anonymous visitor; submitting needs a signed-in customer (not tested).', questions: omq },
    { id: 'beard', name: 'Beard consultation (Beard Booster; facial hair, not scalp)', audience: 'men', entryUrl: 'https://shop.sons.co.uk/beard-consultation/',
      stagesSummary: 'Same two gates and declaration → 4 to 9 beard questions → ACCOUNT WALL → Beard Booster product page. Only the first screen was seen live; the rest is from the definition the page downloaded.', questions: bq },
    { id: 'clinic', name: 'Partner hair-transplant clinic entry', audience: 'men', entryUrl: 'https://shop.sons.co.uk/clinics/british-hair-clinic',
      stagesSummary: 'Clinic landing page (treatment type, procedure date) → the standard hair consultation with the clinic attached → clinic recommendation page with the clinic\'s own pre-/post-procedure plan list. Only the landing page was opened.', questions: cq }
  ],
  rules,
  experiments: [],
  recommendations: [
    { profile: 'Man, 32, temples and crown, gradual onset, no mood concerns, no past treatment, no conditions, "I don\'t mind" on format (the baseline man)', offered: ['p-core-cap', 'p-core', 'p-combospray', 'p-topfin-oralmin', 'p-ultimate-cap', 'p-ultimate', 'p-oralmin', 'p-min', 'p-fin', 'p-topfin', 'p-nonrx', 'p-hgc'], default: 'p-core-cap',
      note: 'READ FROM CODE, NOT SEEN LIVE (the page needs an account). Older page script on sons.co.uk/pages/recommendation: two primary cards, Core Plan (opening on the capsule version, spray on a toggle) and the Combination Spray; the other ten sit under "See more plans". Newer app code at shop.sons.co.uk/recommendation: one primary card, the Combination Spray, then the rest. Which copy a new customer lands on today was not confirmed; the consultation code redirects to the sons.co.uk page. The newer function was also run offline on these answers (node scripts/engine-run.js) and returned the Combination Spray as the primary card.', evidence: 'code' },
    { profile: 'Woman, 38 (the baseline woman)', offered: [], default: null, note: 'Stopped at question 2 with a notice to see a GP or hair-loss specialist. The medical FAQ adds that 5% minoxidil "cannot be sold to females as Sons are not permitted to do so under UK licensing".', evidence: 'observed' }
  ],
  engineSummary: "One short questionnaire for men only. It never stops a man before the account form: sex at birth is the only gate. Every clinical answer is carried forward and, after sign-up, a script running in the customer's browser turns the answers into five on/off switches (finasteride tablet, finasteride spray, minoxidil capsule, minoxidil spray, combination spray). Each ticked condition or reported side effect flips whole drug families off, a fixed ordered list of twelve plans is filtered by those switches, and the format preference only picks which of two orders is used. The top one or two survivors are shown as the recommendation. The partner pharmacy's prescriber reviews the order afterwards. Rules below are read from the served code, not yet replayed.",
  strengths: [
    'Very short: a healthy man clicks through 10 screens before the account form, most of them one tap.',
    'Holds its own UK licences for finasteride 1 mg and minoxidil 5%, and says so; it is open that sprays and capsules are unlicensed specials.',
    'Wide format choice (tablet, spray, capsule, combined spray, combined capsule) with a Spray/Capsule toggle on each plan card.',
    'PHQ-2 style mood questions and a finasteride safety statement sit inside the flow.',
    'Optional NHS Summary Care Record and GP-sharing consents.',
    'Money-back "Sons Promise" after six months, a repeat health check before renewals, and a partner-clinic programme for transplant patients.'
  ],
  weaknesses: [
    'No recommendation, price or product is shown until the visitor hands over name, email, phone, date of birth and a password.',
    'The hair picture (including "Random patches" and "Completely bald") and the sudden-onset follow-ups do not change what is offered in the served code; a man with sudden patchy loss is still shown minoxidil and a supplement.',
    'Age is not asked before the wall; the over-65 rule differs between the two code copies and from the product pages (18-75 for finasteride).',
    'No questions on current medicines (apart from one yes/no after sudden onset), allergies, low blood pressure, family history, how long hair has been thinning, or goals.',
    'The whole rule set runs in the browser and is readable by anyone, with a hidden "Debug (Dev Only)" block of reasons in the page.',
    'Women are turned away with no alternative product or signposting beyond "see a GP".',
    'Small wording and data slips: "Is their hair loss over other parts of your body?", the drawing for "Random patches" looks like a larger temples-and-crown pattern rather than patches, product pages that disagree with the leaflet on the combination spray strength.'
  ],
  opportunities: [
    'Show a provisional plan and price before asking for contact details.',
    'Use the pattern picture and onset answers for real triage (stop or refer for patchy, sudden or scarring loss) and explain why.',
    'Serve women, whom Sons refuses outright.',
    'Ask about current medicines, blood pressure and goals, and explain each exclusion to the patient instead of silently hiding plans.',
    'Offer a clear route for men over 65 and men trying for a baby.'
  ],
  sources: [
    { title: 'Sons consultation landing page', url: 'https://sons.co.uk/pages/consultation-hair' },
    { title: 'Consultation app', url: 'https://shop.sons.co.uk/consultation/?logged_in=false' },
    { title: 'Survey definition requested by the consultation page (saved as quiz-definition.json)', url: 'https://api.sons.co.uk/barber/survey/code/loader?code=uk_consultation&pharmacy=tip' },
    { title: 'Recommendation page whose inline script holds the rules (saved as recommendation-engine.excerpt.js)', url: 'https://sons.co.uk/pages/recommendation' },
    { title: 'Public product feed', url: 'https://sons.co.uk/products.json?limit=250' },
    { title: 'Hair loss plans page', url: 'https://sons.co.uk/pages/hair-loss' },
    { title: 'Medical FAQs', url: 'https://sons.co.uk/pages/medical-faqs' },
    { title: 'Subscription and order FAQs', url: 'https://sons.co.uk/pages/subscription-faqs' },
    { title: 'Finasteride FAQs', url: 'https://sons.co.uk/pages/finasteride-faqs' },
    { title: 'Minoxidil FAQs', url: 'https://sons.co.uk/pages/minoxidil-faqs' },
    { title: 'Terms and conditions (pharmacy partner, prescribers, subscription, cancellation)', url: 'https://sons.co.uk/pages/terms-conditions' },
    { title: 'Sons Promise (money-back guarantee terms)', url: 'https://sons.co.uk/pages/sons-promise' },
    { title: 'Refund policy', url: 'https://sons.co.uk/pages/refund-policy' },
    { title: 'Leaflet: topical finasteride 0.15%, minoxidil 5%, tretinoin 0.015% spray', url: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_MinoFinaTret_Topical_PIL_1126_site.pdf' },
    { title: 'Leaflet: finasteride topical spray 0.15%', url: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Topical_Finasteride_PIL_Site_Version.pdf' },
    { title: 'Leaflet: minoxidil 2.5 mg and biotin capsules', url: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_Oral_Minoxidil__Biotin_PIL_Outlined_4.pdf' },
    { title: 'Leaflet: finasteride, minoxidil and biotin combination capsule', url: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_Combo_Cap_Leaflet_01_Site.pdf' },
    { title: 'Leaflet: dutasteride 0.1%, minoxidil 5%, tretinoin 0.01% spray', url: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_Dutasteride_Mino_Tret_PIL_0726.pdf' },
    { title: 'Leaflet: Beard Booster (minoxidil 6%, tretinoin 0.01%)', url: 'https://cdn.shopify.com/s/files/1/0255/7725/9086/files/Sons_Beard_Booster_PIL_A522UKA01_260526.pdf' },
    { title: 'Partner clinic page (example)', url: 'https://shop.sons.co.uk/clinics/british-hair-clinic' },
    { title: 'The Independent Pharmacy hair-loss page (partner pharmacy)', url: 'https://www.theindependentpharmacy.co.uk/hair-loss-treatments' }
  ],
  limitations: [
    'Nothing after the account form was seen live. The recommendation rules are read from code the site serves; the server may add or override them (it can send its own ordered list and sets account tags such as finasteride_disallowed).',
    'What the prescriber at the partner pharmacy does with the answers, how often orders are refused, and whether photos are ever requested are unknown.',
    'Two copies of the recommendation code disagree in places (order of the list, number of primary cards, over-65 rule). Which one new customers see was not confirmed.',
    'Prices are list prices on one day during a Black Friday sale; first-order discounts change often.',
    'Legal class of the minoxidil spray and ketoconazole shampoo (P or GSL) was not checked against the MHRA register.',
    'The exact wording of checkout consents (pharmacy disclaimer, ketoconazole terms) is not served to anonymous visitors.'
  ]
};
fs.writeFileSync(path.join(ROOT, 'company.json'), JSON.stringify(out, null, 1));
console.log('products', products.length, '| men questions', mq.length, '| options', mq.reduce((a, q) => a + q.options.length, 0), '| om5', omq.length, '| beard', bq.length, '| clinic', cq.length, '| rules', rules.length);
