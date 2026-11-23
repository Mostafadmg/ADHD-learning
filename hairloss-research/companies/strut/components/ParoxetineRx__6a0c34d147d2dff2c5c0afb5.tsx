// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect, useMemo } from 'react';

/* ============================================================
   PAROXETINERX — PathwAI pricing card

   Paste into the Paroxetine PathwAI add-to-cart / product-selection card.
   Requires pathwai-paroxetine-sdk.js on the flow event.

   Production (checkout.struthealth.com/ParoxetineRx):
     b1|s1  2120  $49   10 Doses — PAROXETINE 20MG + TADALAFIL 20MG
     b2|s1  2121  $69   10 Doses — PAROXETINE 40MG + TADALAFIL 20MG
     b3|s1  2122  $99   10 Doses — PAROXETINERX MAX 2.0
     b4|s1  2126  $139  10 Doses — PAROXETINERX MAX 2.0 — DOUBLE
     b1|s2  2123  $129  30 Doses — PAROXETINE 20MG + TADALAFIL 20MG
     b2|s2  2124  $179  30 Doses — PAROXETINE 40MG + TADALAFIL 20MG
     b3|s2  2125  $249  30 Doses — PAROXETINERX MAX 2.0
     b4|s2  2127  $299  30 Doses — PAROXETINERX MAX 2.0 — DOUBLE
   Staging (checkout.strut-test.com/ParoxetineRx):
     b1|s1  2236  $49   10 Doses — PAROXETINE 20MG + TADALAFIL 20MG
     b2|s1  2237  $69   10 Doses — PAROXETINE 40MG + TADALAFIL 20MG
     b3|s1  2238  $99   10 Doses — PAROXETINERX MAX 2.0
     b4|s1  2242  $139  10 Doses — PAROXETINERX MAX 2.0 — DOUBLE
     b1|s2  2239  $129  30 Doses — PAROXETINE 20MG + TADALAFIL 20MG
     b2|s2  2240  $179  30 Doses — PAROXETINE 40MG + TADALAFIL 20MG
     b3|s2  2241  $249  30 Doses — PAROXETINERX MAX 2.0
     b4|s2  2243  $299  30 Doses — PAROXETINERX MAX 2.0 — DOUBLE

   Env: window.strut_env = 'staging' | 'production' (set in pathwai-paroxetine-sdk.js).

   Add to cart → strut.validateVisiting → pathwai.flow.next()
============================================================ */

const PAROXETINE_SLUG = 'ParoxetineRx';

type ComboEntry = {
  slug: string;
  priceId: number;
  productId: string;
  name: string;
};

const COMBO_MAP_PROD: Record<string, ComboEntry> = {
  'b1|s1': { slug: PAROXETINE_SLUG, priceId: 2120, productId: '2120', name: '20MG + Tadalafil — 30 day' },
  'b1|s2': { slug: PAROXETINE_SLUG, priceId: 2123, productId: '2123', name: '20MG + Tadalafil — 90 day' },
  'b2|s1': { slug: PAROXETINE_SLUG, priceId: 2121, productId: '2121', name: '40MG + Tadalafil — 30 day' },
  'b2|s2': { slug: PAROXETINE_SLUG, priceId: 2124, productId: '2124', name: '40MG + Tadalafil — 90 day' },
  'b3|s1': { slug: PAROXETINE_SLUG, priceId: 2122, productId: '2122', name: 'MAX 2.0 — 30 day' },
  'b3|s2': { slug: PAROXETINE_SLUG, priceId: 2125, productId: '2125', name: 'MAX 2.0 — 90 day' },
  'b4|s1': { slug: PAROXETINE_SLUG, priceId: 2126, productId: '2126', name: 'MAX 2.0 Double — 30 day' },
  'b4|s2': { slug: PAROXETINE_SLUG, priceId: 2127, productId: '2127', name: 'MAX 2.0 Double — 90 day' },
};

const COMBO_MAP_STAGING: Record<string, ComboEntry> = {
  'b1|s1': { slug: PAROXETINE_SLUG, priceId: 2236, productId: '2236', name: '20MG + Tadalafil — 30 day' },
  'b1|s2': { slug: PAROXETINE_SLUG, priceId: 2239, productId: '2239', name: '20MG + Tadalafil — 90 day' },
  'b2|s1': { slug: PAROXETINE_SLUG, priceId: 2237, productId: '2237', name: '40MG + Tadalafil — 30 day' },
  'b2|s2': { slug: PAROXETINE_SLUG, priceId: 2240, productId: '2240', name: '40MG + Tadalafil — 90 day' },
  'b3|s1': { slug: PAROXETINE_SLUG, priceId: 2238, productId: '2238', name: 'MAX 2.0 — 30 day' },
  'b3|s2': { slug: PAROXETINE_SLUG, priceId: 2241, productId: '2241', name: 'MAX 2.0 — 90 day' },
  'b4|s1': { slug: PAROXETINE_SLUG, priceId: 2242, productId: '2242', name: 'MAX 2.0 Double — 30 day' },
  'b4|s2': { slug: PAROXETINE_SLUG, priceId: 2243, productId: '2243', name: 'MAX 2.0 Double — 90 day' },
};

const COMBO_MAP_PROD_JSON = JSON.stringify(COMBO_MAP_PROD);
const COMBO_MAP_STAGING_JSON = JSON.stringify(COMBO_MAP_STAGING);

type StrutHost = {
  strut?: {
    ENV?: { api?: string; checkout?: string };
    validateVisiting?: (slug: string, priceId: number) => Promise<unknown>;
    skuId?: (sizeOrKey: string) => number;
    addToCart?: (priceId: number, opts?: Record<string, unknown>) => Promise<unknown>;
    ensurePathwaiCart?: (opts?: Record<string, unknown>) => boolean;
  };
  strut_env?: string;
  strut_paroxetine_price_id?: number;
  pathwai?: {
    flow?: { next?: (val?: unknown) => void };
    cart?: {
      clearCart?: () => void;
      addItem?: (item: Record<string, unknown>) => void;
    };
  };
  pwPushGtm?: (event: string, data?: Record<string, unknown>) => void;
  __STRUT_PRODUCT_NAME__?: string;
  location?: { href: string };
};

function host(): StrutHost {
  return window as unknown as StrutHost;
}

function isStagingEnv() {
  if (typeof window === 'undefined') return false;
  const w = host();
  const api = String(w.strut?.ENV?.api || '');
  if (/checkout-api\.struthealth\.com/i.test(api)) return false;
  if (/checkout-api\.strut-test\.com/i.test(api)) return true;
  const explicit = String(w.strut_env || '').toLowerCase();
  if (explicit === 'production' || explicit === 'prod') return false;
  if (explicit === 'staging') return true;
  const href = typeof window.location !== 'undefined' ? window.location.href : '';
  return /strut-test/i.test(href);
}

function resolveComboPriceId(comboKey: string, comboEntry: ComboEntry | undefined) {
  const fromMap = Number(comboEntry?.priceId || 0);
  if (fromMap > 0) return fromMap;
  try {
    const fromSdk = Number(host().strut?.skuId?.(comboKey) || 0);
    if (fromSdk > 0) return fromSdk;
  } catch { /* ignore */ }
  return fromMap;
}

function effMonthlyPrice(price: number, monthsCount: number) {
  const p = Number(price) || 0;
  const m = Number(monthsCount) || 0;
  if (p <= 0 || m <= 0) return 0;
  return Math.round(p / m);
}

function calcSavingsDollars(s1Price: number, s1MonthsCount: number, sPrice: number, sMonthsCount: number) {
  const a = Number(s1Price) || 0;
  const am = Number(s1MonthsCount) || 0;
  const b = Number(sPrice) || 0;
  const bm = Number(sMonthsCount) || 0;
  if (a <= 0 || b <= 0 || am <= 0 || bm <= 0) return 0;
  if (bm <= am) return 0;
  const perMonth = a / am;
  const baseline = perMonth * bm;
  return Math.max(0, Math.round(baseline - b));
}

function calcDiscountPct(s1Price: number, s1MonthsCount: number, sPrice: number, sMonthsCount: number) {
  const a = Number(s1Price) || 0;
  const am = Number(s1MonthsCount) || 0;
  const b = Number(sPrice) || 0;
  const bm = Number(sMonthsCount) || 0;
  if (a <= 0 || b <= 0 || am <= 0 || bm <= 0) return 0;
  if (bm <= am) return 0;
  const perMonth = a / am;
  const baseline = perMonth * bm;
  if (baseline <= 0) return 0;
  return Math.max(0, Math.round(((baseline - b) / baseline) * 100));
}

function formatSavingsCopy(template: string, amount: number, pct: number) {
  const tpl = template || 'Save {amount} ({pct} off)';
  return tpl
    .replace(/\{amount\}/g, `$${amount}`)
    .replace(/\{pct\}/g, `${pct}%`);
}

const PAROXETINE_SUPPLY2_LABEL = '30 doses · 90 day supply';

/** PathwAI saves supply labels on the card; older flows used plain "90 day supply". */
function resolveParoxetineSupply2Label(label: string) {
  const trimmed = String(label || '').trim();
  if (!trimmed) return PAROXETINE_SUPPLY2_LABEL;
  if (/^90\s*day\s*(supply|order)$/i.test(trimmed)) return PAROXETINE_SUPPLY2_LABEL;
  return trimmed;
}

function hexToRgba(hex: string, alpha: number) {
  const clean = String(hex || '').replace('#', '');
  if (clean.length !== 6) return `rgba(22, 19, 54, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ParoxetinePricingCard({
  brandColor = '#161336',
  discColor = '#f1ece1',
  bottleImageUrl = 'https://placehold.co/440x440/f1ece1/161336/png?text=ParoxetineRx',
  imageFit = 'cover',
  textColor = '#0F1714',
  textMutedColor = '#6B7670',
  borderColor = '#E5E1D8',
  borderSoftColor = '#EFECE3',
  surfaceColor = '#FBFAF7',
  controlOffColor = '#D9D4C5',
  borderHoverColor = '#C9C2AF',
  selectedBgColor = '#161336',
  selectedBgOpacity = 0.06,
  titleBase = 'ParoxetineRx',
  subtitle = 'Compounded by a US licensed pharmacy',
  bundleSectionLabel = 'Choose your formulation',
  bundle1Title = '20MG + Tadalafil',
  bundle1Ingredients = 'Paroxetine 20mg + Tadalafil 20mg',
  bundle1Supply1Price = 49,
  bundle1Supply2Price = 129,
  bundle1Badge = '',
  bundle1Caption = '',
  bundle2Title = '40MG + Tadalafil',
  bundle2Ingredients = 'Paroxetine 40mg + Tadalafil 20mg',
  bundle2Supply1Price = 69,
  bundle2Supply2Price = 179,
  bundle2Badge = '',
  bundle2Caption = '',
  bundle3Title = 'MAX 2.0',
  bundle3Ingredients = 'Paroxetine 20mg + Sildenafil 60mg + Tadalafil 7.5mg + Apomorphine 2mg',
  bundle3Supply1Price = 99,
  bundle3Supply2Price = 249,
  bundle3Badge = 'Most popular',
  bundle3Caption = '',
  bundle4Title = 'MAX 2.0 Double',
  bundle4Ingredients = 'Paroxetine 20mg + Sildenafil 60mg + Tadalafil 7.5mg + Apomorphine 2mg · double dose',
  bundle4Supply1Price = 139,
  bundle4Supply2Price = 299,
  bundle4Badge = '',
  bundle4Caption = '',
  bundle5Title = '',
  bundle5Ingredients = '',
  bundle5Supply1Price = 0,
  bundle5Supply2Price = 0,
  bundle5Badge = '',
  bundle5Caption = '',
  defaultBundleIndex = 1,
  supply1Label = '10 doses · 30 day order',
  supply1MonthsCount = 1,
  supply2Label = '30 doses · 90 day supply',
  supply2MonthsCount = 3,
  defaultSupplyIndex = 1,
  fromPriceLabel = 'from',
  savingsCopyFormat = 'Save {amount} ({pct} off)',
  showAddon = 'false' as string | boolean,
  addonLabel = 'Add a daily multivitamin',
  addonDescription = 'Delivered with your first order',
  addonNoteText = 'no extra cost',
  addonPrice = 0,
  addonDefaultOn = 'false' as string | boolean,
  trustItem1 = '',
  trustItem2 = '',
  totalLabel = 'Total today',
  ctaLabel = 'Add to cart',
  borderRadius = 12,
  onCta = null as null | ((payload: Record<string, unknown>) => void),
  comboMap = COMBO_MAP_PROD_JSON,
  comboMapStaging = COMBO_MAP_STAGING_JSON,
  onChange = null as null | ((payload: Record<string, unknown>) => void),
}) {
  const showAddonBool = showAddon === 'true' || showAddon === true;
  const addonDefaultOnBool = addonDefaultOn === 'true' || addonDefaultOn === true;

  const BUNDLES = useMemo(() => {
    return [
      { id: 'b1', title: bundle1Title, ingredients: bundle1Ingredients, s1: Number(bundle1Supply1Price) || 0, s2: Number(bundle1Supply2Price) || 0, badge: bundle1Badge, caption: bundle1Caption },
      { id: 'b2', title: bundle2Title, ingredients: bundle2Ingredients, s1: Number(bundle2Supply1Price) || 0, s2: Number(bundle2Supply2Price) || 0, badge: bundle2Badge, caption: bundle2Caption },
      { id: 'b3', title: bundle3Title, ingredients: bundle3Ingredients, s1: Number(bundle3Supply1Price) || 0, s2: Number(bundle3Supply2Price) || 0, badge: bundle3Badge, caption: bundle3Caption },
      { id: 'b4', title: bundle4Title, ingredients: bundle4Ingredients, s1: Number(bundle4Supply1Price) || 0, s2: Number(bundle4Supply2Price) || 0, badge: bundle4Badge, caption: bundle4Caption },
      { id: 'b5', title: bundle5Title, ingredients: bundle5Ingredients, s1: Number(bundle5Supply1Price) || 0, s2: Number(bundle5Supply2Price) || 0, badge: bundle5Badge, caption: bundle5Caption },
    ].filter(b => b.title && (b.s1 > 0 || b.s2 > 0));
  }, [
    bundle1Title, bundle1Ingredients, bundle1Supply1Price, bundle1Supply2Price, bundle1Badge, bundle1Caption,
    bundle2Title, bundle2Ingredients, bundle2Supply1Price, bundle2Supply2Price, bundle2Badge, bundle2Caption,
    bundle3Title, bundle3Ingredients, bundle3Supply1Price, bundle3Supply2Price, bundle3Badge, bundle3Caption,
    bundle4Title, bundle4Ingredients, bundle4Supply1Price, bundle4Supply2Price, bundle4Badge, bundle4Caption,
    bundle5Title, bundle5Ingredients, bundle5Supply1Price, bundle5Supply2Price, bundle5Badge, bundle5Caption,
  ]);

  const SUPPLIES = useMemo(() => {
    return [
      { id: 's1', label: supply1Label, monthsCount: Number(supply1MonthsCount) || 1 },
      { id: 's2', label: resolveParoxetineSupply2Label(supply2Label), monthsCount: Number(supply2MonthsCount) || 1 },
    ].filter(s => s.label);
  }, [supply1Label, supply1MonthsCount, supply2Label, supply2MonthsCount]);

  const [bundleId, setBundleId] = useState(() => {
    const idx = Math.max(0, Math.min(BUNDLES.length - 1, (Number(defaultBundleIndex) || 1) - 1));
    return BUNDLES[idx]?.id || BUNDLES[0]?.id || 'b1';
  });

  const [supplyId, setSupplyId] = useState(() => {
    const idx = Math.max(0, Math.min(SUPPLIES.length - 1, (Number(defaultSupplyIndex) || 1) - 1));
    return SUPPLIES[idx]?.id || SUPPLIES[0]?.id || 's1';
  });

  const [withAddon, setWithAddon] = useState(showAddonBool && addonDefaultOnBool);
  const [isLoading, setIsLoading] = useState(false);
  const [ctaError, setCtaError] = useState<string | null>(null);

  useEffect(() => {
    if (BUNDLES.length && !BUNDLES.find(b => b.id === bundleId)) {
      setBundleId(BUNDLES[0].id);
    }
  }, [BUNDLES, bundleId]);

  useEffect(() => {
    if (SUPPLIES.length && !SUPPLIES.find(s => s.id === supplyId)) {
      setSupplyId(SUPPLIES[0].id);
    }
  }, [SUPPLIES, supplyId]);

  useEffect(() => {
    if (!showAddonBool && withAddon) setWithAddon(false);
  }, [showAddonBool, withAddon]);

  const staging = isStagingEnv();
    const parsedComboMap: Record<string, ComboEntry> = (() => {
    try {
      const m = JSON.parse(String((staging ? comboMapStaging : comboMap) || ''));
      if (m && typeof m === 'object') return m as Record<string, ComboEntry>;
    } catch { /* fall back to built-in map */ }
    return staging ? COMBO_MAP_STAGING : COMBO_MAP_PROD;
  })();

  const bundle = BUNDLES.find(b => b.id === bundleId) || BUNDLES[0];
  const supply = SUPPLIES.find(s => s.id === supplyId) || SUPPLIES[0];
  const supply1 = SUPPLIES.find(s => s.id === 's1');
  const comboKey = `${bundleId}|${supplyId}`;
  const comboEntry = parsedComboMap[comboKey] || {};
  const resolvedSlug = comboEntry.slug || PAROXETINE_SLUG;  
  const resolvedPriceId = resolveComboPriceId(comboKey, comboEntry);
  const missingSlug = !resolvedPriceId;

  const bundlePrice = bundle ? (bundle[supplyId as 's1' | 's2'] || 0) : 0;
  const effectiveWithAddon = showAddonBool && withAddon;
  const addonPriceNum = Number(addonPrice) || 0;
  const totalNow = bundlePrice + (effectiveWithAddon ? addonPriceNum : 0);
  const monthlyEff = effMonthlyPrice(totalNow, supply?.monthsCount || 1);

  const selectedTint = hexToRgba(selectedBgColor, selectedBgOpacity);
  const selectedTintStrong = hexToRgba(selectedBgColor, Math.min(selectedBgOpacity * 2, 0.2));

  useEffect(() => {
    if (!onChange || !bundle || !supply) return;
    onChange({
      bundleId,
      bundleTitle: bundle.title,
      bundleIngredients: bundle.ingredients,
      bundleBadge: bundle.badge,
      supplyId,
      supplyLabel: supply.label,
      supplyMonthsCount: supply.monthsCount,
      bundlePrice,
      withAddon: effectiveWithAddon,
      addonPrice: effectiveWithAddon ? addonPriceNum : 0,
      totalPrice: totalNow,
      effectiveMonthly: monthlyEff,
      slug: resolvedSlug,
      priceId: resolvedPriceId,
    });
  }, [
    bundleId, bundle, supplyId, supply, bundlePrice, effectiveWithAddon, addonPriceNum,
    totalNow, monthlyEff, onChange, resolvedSlug, resolvedPriceId,
  ]);

  if (!BUNDLES.length || !SUPPLIES.length) {
    return (
      <div style={{
        padding: 24,
        fontFamily: 'Figtree, system-ui, sans-serif',
        color: '#6B7670',
        fontSize: 13,
        textAlign: 'center',
        border: '1px dashed #E5E1D8',
        borderRadius: 12,
      }}>
        Configure at least one bundle and one supply.
      </div>
    );
  }

  const handleCta = async () => {
    setCtaError(null);
    if (missingSlug) {
      setCtaError('This option is not available right now. Please choose another or contact support.');
      return;
    }
    setIsLoading(true);

    const pid = Number(resolvedPriceId);
    const cartLabel = comboEntry.name || `${titleBase} ${bundle.title} (${supply.label})`;
    const payload = {
      bundleId,
      bundleTitle: bundle.title,
      supplyId,
      supplyLabel: supply.label,
      bundlePrice,
      totalPrice: totalNow,
      slug: resolvedSlug,
      priceId: pid,
    };

    try {
      if (onCta) {
        onCta(payload);
        return;
      }

      const w = host();
      try { w.strut_paroxetine_price_id = pid; } catch { /* ignore */ }

      if (typeof w.strut?.addToCart === 'function') {
        await w.strut.addToCart(pid, {
          price: totalNow,
          label: cartLabel,
          bundleTitle: bundle.title,
          supplyLabel: supply.label,
        });
        return;
      }

      if (typeof w.strut?.validateVisiting !== 'function') {
        throw new Error('Paroxetine SDK not loaded — paste pathwai-paroxetine-sdk.js into the flow event');
      }

      console.log('[paroxetine] add to cart', {
        env: staging ? 'staging' : 'production',
        comboKey,
        slug: resolvedSlug,
        priceId: pid,
        displayedTotal: totalNow,
        api: w.strut?.ENV?.api,
      });

      await w.strut.validateVisiting(resolvedSlug, pid);

      if (typeof w.strut?.ensurePathwaiCart === 'function') {
        w.strut.ensurePathwaiCart({
          priceId: pid,
          label: cartLabel,
          price: totalNow,
          bundleTitle: bundle.title,
          supplyLabel: supply.label,
          force: true,
        });
      } else {
        const cartApi = w.pathwai?.cart;
        if (cartApi?.clearCart && cartApi?.addItem) {
          cartApi.clearCart();
          cartApi.addItem({
            id: comboEntry.productId || String(pid),
            name: cartLabel,
            price: totalNow,
            quantity: 1,
            variants: [{ name: 'Plan', value: bundle.title }, { name: 'Supply', value: supply.label }],
          });
        }
      }

      try {
        const productName = w.__STRUT_PRODUCT_NAME__ || titleBase;
        w.pwPushGtm?.('Added to Cart', {
          AddedItemProductID: productName,
          variant_name: comboEntry?.name || '',
          price: totalNow,
        });
      } catch { /* ignore */ }

      w.pathwai?.flow?.next?.();
    } catch (e) {
      setCtaError(e instanceof Error ? e.message : 'Something went wrong starting your order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{
        flexShrink: 0,
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
        color: 'currentColor',
      }}
    >
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap');
        .pcb-root, .pcb-root * { box-sizing: border-box; }
        .pcb-root {
          font-family: 'Figtree', system-ui, sans-serif;
          color: var(--pcb-text);
          background: transparent;
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          padding: 4px 16px 20px 16px;
          display: flex;
          flex-direction: column;
        }
        .pcb-body { display: flex; flex-direction: column; flex: 1; }
        .pcb-card {
          background: #fff;
          border-radius: var(--pcb-radius);
          padding: 28px 20px 24px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pcb-hero { display: flex; justify-content: center; margin-bottom: 20px; }
        .pcb-disc {
          width: 200px; height: 200px; max-width: 100%;
          border-radius: 999px; background: var(--pcb-disc);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
        }
        .pcb-disc img {
          width: var(--pcb-img-size, 100%);
          height: var(--pcb-img-size, 100%);
          object-fit: var(--pcb-img-fit, cover);
        }
        .pcb-title-wrap { text-align: center; }
        .pcb-title {
          font-family: 'Figtree', sans-serif;
          font-weight: 600; font-size: 20px; line-height: 1.2;
          letter-spacing: -0.01em; margin: 0 0 6px 0;
          color: var(--pcb-text); overflow-wrap: anywhere;
        }
        .pcb-subtitle {
          font-family: 'Figtree', sans-serif;
          font-size: 13px; color: var(--pcb-text-muted);
          font-weight: 400; line-height: 1.4;
        }
        .pcb-label-row {
          font-family: 'Figtree', sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.04em; line-height: 1.33;
          text-transform: uppercase; color: var(--pcb-text);
          margin-bottom: 10px;
        }
        .pcb-bundle-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .pcb-bundle {
          border-radius: var(--pcb-radius);
          border: 1.5px solid var(--pcb-border);
          background: #fff; overflow: hidden;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcb-bundle:hover { border-color: var(--pcb-border-hover); }
        .pcb-bundle.is-expanded {
          border-color: var(--pcb-brand);
          background: var(--pcb-selected-bg);
        }
        .pcb-bundle-header {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 16px; width: 100%;
          background: transparent; border: none; cursor: pointer;
          font-family: 'Figtree', sans-serif; color: var(--pcb-text);
          text-align: left; -webkit-tap-highlight-color: transparent;
        }
        .pcb-bundle-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
        .pcb-bundle-top {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; flex-wrap: wrap;
        }
        .pcb-bundle-top-left { display: flex; align-items: center; gap: 8px; min-width: 0; flex-wrap: wrap; }
        .pcb-bundle-title { font-weight: 600; font-size: 16px; line-height: 1.25; }
        .pcb-bundle-badge {
          font-size: 10.5px; font-weight: 600; color: var(--pcb-brand);
          background: var(--pcb-selected-bg-strong);
          padding: 3px 8px; border-radius: 999px;
          letter-spacing: 0.02em; text-transform: uppercase; white-space: nowrap;
        }
        .pcb-bundle-top-right { display: flex; align-items: center; gap: 8px; color: var(--pcb-text-muted); flex-shrink: 0; }
        .pcb-bundle-from { font-size: 14px; font-weight: 500; color: var(--pcb-text-muted); white-space: nowrap; }
        .pcb-bundle.is-expanded .pcb-bundle-from { display: none; }
        .pcb-bundle-ingredients { font-size: 13px; color: var(--pcb-text-muted); line-height: 1.4; word-break: break-word; }
        .pcb-bundle-caption { font-size: 12px; color: var(--pcb-brand); font-weight: 500; margin-top: 2px; }
        .pcb-radio {
          width: 18px; height: 18px; margin-top: 2px;
          border-radius: 999px; border: 1.5px solid var(--pcb-control-off);
          background: #fff; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcb-bundle.is-expanded .pcb-bundle-header .pcb-radio { border-color: var(--pcb-brand); background: var(--pcb-brand); }
        .pcb-radio-dot { width: 6px; height: 6px; border-radius: 999px; background: #fff; }
        .pcb-supply-section {
          padding: 12px 16px 14px 46px;
          display: flex; flex-direction: column; gap: 8px;
          border-top: 1px solid var(--pcb-border-soft);
        }
        .pcb-supply {
          padding: 12px 14px; border-radius: 10px;
          border: 1.5px solid var(--pcb-border); background: #fff;
          cursor: pointer; display: flex; align-items: center;
          justify-content: space-between; gap: 10px;
          text-align: left; width: 100%;
          font-family: 'Figtree', sans-serif; color: var(--pcb-text);
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcb-supply:hover { border-color: var(--pcb-border-hover); }
        .pcb-supply.is-selected { border-color: var(--pcb-brand); background: var(--pcb-selected-bg); }
        .pcb-supply-left { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
        .pcb-supply.is-selected .pcb-radio { border-color: var(--pcb-brand); background: var(--pcb-brand); }
        .pcb-supply-text { display: flex; flex-direction: column; min-width: 0; }
        .pcb-supply-primary { font-weight: 500; font-size: 14px; }
        .pcb-supply-sub { font-size: 12px; color: var(--pcb-brand); font-weight: 500; margin-top: 2px; }
        .pcb-supply-price { font-weight: 600; font-size: 16px; letter-spacing: -0.01em; flex-shrink: 0; }
        .pcb-addon {
          background: var(--pcb-surface); border: 1px solid var(--pcb-border-soft);
          border-radius: var(--pcb-radius); padding: 14px; margin-bottom: 18px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; cursor: pointer; width: 100%;
          font-family: 'Figtree', sans-serif; color: inherit; text-align: left;
        }
        .pcb-addon-body { display: flex; flex-direction: column; min-width: 0; flex: 1; }
        .pcb-addon-top { font-size: 14px; font-weight: 600; }
        .pcb-addon-desc { font-size: 12px; color: var(--pcb-text-muted); margin-top: 4px; line-height: 1.4; }
        .pcb-addon-note { color: var(--pcb-brand); font-weight: 600; }
        .pcb-switch {
          width: 50px; height: 30px; border-radius: 999px;
          background: var(--pcb-control-off); position: relative;
          flex-shrink: 0; border: none; padding: 0; cursor: pointer;
        }
        .pcb-switch.is-on { background: var(--pcb-brand); }
        .pcb-switch::after {
          content: ''; position: absolute; top: 2px; left: 2px;
          width: 26px; height: 26px; border-radius: 999px;
          background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          transition: transform 0.15s ease;
        }
        .pcb-switch.is-on::after { transform: translateX(20px); }
        .pcb-trust {
          display: flex; flex-wrap: wrap; gap: 16px;
          font-size: 12px; color: var(--pcb-text-muted);
          margin-top: auto; padding-top: 8px; font-weight: 500;
        }
        .pcb-checkout { padding: 20px 0 24px 0; }
        .pcb-checkout-top {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 10px; margin-bottom: 18px; flex-wrap: wrap;
        }
        .pcb-checkout-label {
          font-size: 12px; color: var(--pcb-text-muted);
          letter-spacing: 0.04em; text-transform: uppercase;
          font-weight: 700; line-height: 1.33;
        }
        .pcb-checkout-price { font-weight: 600; font-size: 22px; letter-spacing: -0.01em; }
        .pcb-checkout-permo { font-size: 13px; color: var(--pcb-text-muted); font-weight: 400; margin-left: 6px; }
        .pcb-cta {
          display: inline-flex; align-items: center; justify-content: center;
          width: 100%; height: 44px; gap: 8px;
          border: none; background: var(--pcb-brand); color: #fff;
          border-radius: 10px; font-family: 'Figtree', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .pcb-cta:hover { opacity: 0.85; }
        .pcb-cta:active { transform: scale(0.97); }
        .pcb-cta:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (min-width: 600px) {
          .pcb-root { max-width: 480px; }
          .pcb-title { font-size: 22px; }
          .pcb-checkout-price { font-size: 28px; }
        }
      `}</style>

      <div
        className="pcb-root"
        style={{
          ['--pcb-brand' as string]: brandColor,
          ['--pcb-disc' as string]: discColor,
          ['--pcb-text' as string]: textColor,
          ['--pcb-text-muted' as string]: textMutedColor,
          ['--pcb-border' as string]: borderColor,
          ['--pcb-border-soft' as string]: borderSoftColor,
          ['--pcb-border-hover' as string]: borderHoverColor,
          ['--pcb-surface' as string]: surfaceColor,
          ['--pcb-control-off' as string]: controlOffColor,
          ['--pcb-selected-bg' as string]: selectedTint,
          ['--pcb-selected-bg-strong' as string]: selectedTintStrong,
          ['--pcb-radius' as string]: `${borderRadius}px`,
        }}
      >
        <div className="pcb-body">
          <div className="pcb-card">
            <div className="pcb-hero">
              <div
                className="pcb-disc"
                style={{
                  ['--pcb-img-fit' as string]: imageFit,
                  ['--pcb-img-size' as string]: imageFit === 'cover' ? '100%' : '78%',
                }}
              >
                {bottleImageUrl && (
                  <img
                    src={bottleImageUrl}
                    alt={titleBase}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            </div>
            <div className="pcb-title-wrap">
              <h1 className="pcb-title">{titleBase}</h1>
              {subtitle && <div className="pcb-subtitle">{subtitle}</div>}
            </div>
          </div>

          <div className="pcb-label-row">{bundleSectionLabel}</div>
          <div className="pcb-bundle-list">
            {BUNDLES.map(b => {
              const isExpanded = bundleId === b.id;
              const fromPrice = b.s1 || b.s2;
              return (
                <div key={b.id} className={`pcb-bundle ${isExpanded ? 'is-expanded' : ''}`}>
                  <button
                    type="button"
                    className="pcb-bundle-header"
                    onClick={() => setBundleId(b.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="pcb-radio">
                      {isExpanded && <div className="pcb-radio-dot" />}
                    </div>
                    <div className="pcb-bundle-content">
                      <div className="pcb-bundle-top">
                        <div className="pcb-bundle-top-left">
                          <span className="pcb-bundle-title">{b.title}</span>
                          {b.badge && <span className="pcb-bundle-badge">{b.badge}</span>}
                        </div>
                        <div className="pcb-bundle-top-right">
                          {!isExpanded && fromPrice > 0 && (
                            <span className="pcb-bundle-from">{fromPriceLabel} ${fromPrice}</span>
                          )}
                          <ChevronIcon open={isExpanded} />
                        </div>
                      </div>
                      <div className="pcb-bundle-ingredients">{b.ingredients}</div>
                      {b.caption && <div className="pcb-bundle-caption">{b.caption}</div>}
                    </div>
                  </button>

                  {isExpanded && SUPPLIES.length > 0 && (
                    <div className="pcb-supply-section">
                      {SUPPLIES.map(s => {
                        const isSelSupply = supplyId === s.id;
                        const price = b[s.id as 's1' | 's2'] || 0;
                        const supplySavings = supply1
                          ? calcSavingsDollars(b.s1, supply1.monthsCount, price, s.monthsCount)
                          : 0;
                        const supplyPct = supply1
                          ? calcDiscountPct(b.s1, supply1.monthsCount, price, s.monthsCount)
                          : 0;
                        const showSavings = s.id !== 's1' && supplySavings > 0;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            className={`pcb-supply ${isSelSupply ? 'is-selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSupplyId(s.id);
                            }}
                            aria-pressed={isSelSupply}
                          >
                            <div className="pcb-supply-left">
                              <div className="pcb-radio">
                                {isSelSupply && <div className="pcb-radio-dot" />}
                              </div>
                              <div className="pcb-supply-text">
                                <span className="pcb-supply-primary">{s.label}</span>
                                {showSavings && (
                                  <span className="pcb-supply-sub">
                                    {formatSavingsCopy(savingsCopyFormat, supplySavings, supplyPct)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="pcb-supply-price">${price}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {showAddonBool && (
            <button
              type="button"
              className="pcb-addon"
              onClick={() => setWithAddon(v => !v)}
              aria-pressed={withAddon}
            >
              <div className="pcb-addon-body">
                <div className="pcb-addon-top">{addonLabel}</div>
                <div className="pcb-addon-desc">
                  {addonDescription}
                  {addonNoteText && (
                    <>
                      {' '}<span className="pcb-addon-note">· {addonNoteText}</span>
                    </>
                  )}
                </div>
              </div>
              <span className={`pcb-switch ${withAddon ? 'is-on' : ''}`} />
            </button>
          )}

          <div className="pcb-trust">
            {trustItem1 && <span>✓ {trustItem1}</span>}
            {trustItem2 && <span>✓ {trustItem2}</span>}
          </div>
        </div>

        <div className="pcb-checkout">
          <div className="pcb-checkout-top">
            <span className="pcb-checkout-label">{totalLabel}</span>
            <span className="pcb-checkout-price">
              ${totalNow}
              {monthlyEff > 0 && (supply?.monthsCount || 1) > 1 && (
                <span className="pcb-checkout-permo">· ${monthlyEff}/mo</span>
              )}
            </span>
          </div>
          <button
            type="button"
            className="pcb-cta"
            onClick={handleCta}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Please wait…' : ctaLabel}</span>
            {!isLoading && <span aria-hidden="true">→</span>}
          </button>
          {ctaError ? (
            <div role="alert" style={{ marginTop: 10, color: '#b42318', fontSize: 13, lineHeight: 1.4 }}>
              {ctaError}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export const propSchema = {
  brandColor: { type: 'color', title: 'Brand Color', defaultValue: '#161336' },
  discColor: { type: 'color', title: 'Hero Disc Background', defaultValue: '#f1ece1' },
  bottleImageUrl: {
    type: 'string',
    title: 'Product Image URL',
    defaultValue: 'https://placehold.co/440x440/f1ece1/161336/png?text=ParoxetineRx',
  },
  imageFit: { type: 'enum', title: 'Image Fit', defaultValue: 'cover', options: ['cover', 'contain'] },
  textColor: { type: 'color', title: 'Text Color', defaultValue: '#0F1714' },
  textMutedColor: { type: 'color', title: 'Text Color (Muted)', defaultValue: '#6B7670' },
  borderColor: { type: 'color', title: 'Border Color (Default)', defaultValue: '#E5E1D8' },
  borderSoftColor: { type: 'color', title: 'Border Color (Soft)', defaultValue: '#EFECE3' },
  surfaceColor: { type: 'color', title: 'Surface Color', defaultValue: '#FBFAF7' },
  controlOffColor: { type: 'color', title: 'Control Color (off)', defaultValue: '#D9D4C5' },
  borderHoverColor: { type: 'color', title: 'Border Color (Hover)', defaultValue: '#C9C2AF' },
  selectedBgColor: { type: 'color', title: 'Selected Background Tint', defaultValue: '#161336' },
  selectedBgOpacity: { type: 'number', title: 'Selected Background Opacity', defaultValue: 0.06, min: 0, max: 1, step: 0.01 },
  titleBase: { type: 'string', title: 'Product Title', defaultValue: 'ParoxetineRx' },
  subtitle: { type: 'string', title: 'Subtitle', defaultValue: 'Compounded by a US licensed pharmacy' },
  bundleSectionLabel: { type: 'string', title: 'Bundle Section Label', defaultValue: 'Choose your formulation' },
  bundle1Title: { type: 'string', title: 'Bundle 1 — Title', defaultValue: '20MG + Tadalafil' },
  bundle1Ingredients: { type: 'string', title: 'Bundle 1 — Ingredients', defaultValue: 'Paroxetine 20mg + Tadalafil 20mg' },
  bundle1Supply1Price: { type: 'number', title: 'Bundle 1 — 30 day Price ($)', defaultValue: 49, min: 0, step: 1 },
  bundle1Supply2Price: { type: 'number', title: 'Bundle 1 — 90 day Price ($)', defaultValue: 129, min: 0, step: 1 },
  bundle1Badge: { type: 'string', title: 'Bundle 1 — Badge', defaultValue: '' },
  bundle1Caption: { type: 'string', title: 'Bundle 1 — Caption', defaultValue: '' },
  bundle2Title: { type: 'string', title: 'Bundle 2 — Title', defaultValue: '40MG + Tadalafil' },
  bundle2Ingredients: { type: 'string', title: 'Bundle 2 — Ingredients', defaultValue: 'Paroxetine 40mg + Tadalafil 20mg' },
  bundle2Supply1Price: { type: 'number', title: 'Bundle 2 — 30 day Price ($)', defaultValue: 69, min: 0, step: 1 },
  bundle2Supply2Price: { type: 'number', title: 'Bundle 2 — 90 day Price ($)', defaultValue: 179, min: 0, step: 1 },
  bundle2Badge: { type: 'string', title: 'Bundle 2 — Badge', defaultValue: '' },
  bundle2Caption: { type: 'string', title: 'Bundle 2 — Caption', defaultValue: '' },
  bundle3Title: { type: 'string', title: 'Bundle 3 — Title', defaultValue: 'MAX 2.0' },
  bundle3Ingredients: { type: 'string', title: 'Bundle 3 — Ingredients', defaultValue: 'Paroxetine 20mg + Sildenafil 60mg + Tadalafil 7.5mg + Apomorphine 2mg' },
  bundle3Supply1Price: { type: 'number', title: 'Bundle 3 — 30 day Price ($)', defaultValue: 99, min: 0, step: 1 },
  bundle3Supply2Price: { type: 'number', title: 'Bundle 3 — 90 day Price ($)', defaultValue: 249, min: 0, step: 1 },
  bundle3Badge: { type: 'string', title: 'Bundle 3 — Badge', defaultValue: 'Most popular' },
  bundle3Caption: { type: 'string', title: 'Bundle 3 — Caption', defaultValue: '' },
  bundle4Title: { type: 'string', title: 'Bundle 4 — Title', defaultValue: 'MAX 2.0 Double' },
  bundle4Ingredients: { type: 'string', title: 'Bundle 4 — Ingredients', defaultValue: 'Paroxetine 20mg + Sildenafil 60mg + Tadalafil 7.5mg + Apomorphine 2mg · double dose' },
  bundle4Supply1Price: { type: 'number', title: 'Bundle 4 — 30 day Price ($)', defaultValue: 139, min: 0, step: 1 },
  bundle4Supply2Price: { type: 'number', title: 'Bundle 4 — 90 day Price ($)', defaultValue: 299, min: 0, step: 1 },
  bundle4Badge: { type: 'string', title: 'Bundle 4 — Badge', defaultValue: '' },
  bundle4Caption: { type: 'string', title: 'Bundle 4 — Caption', defaultValue: '' },
  bundle5Title: { type: 'string', title: 'Bundle 5 — Title (leave empty to hide)', defaultValue: '' },
  bundle5Ingredients: { type: 'string', title: 'Bundle 5 — Ingredients', defaultValue: '' },
  bundle5Supply1Price: { type: 'number', title: 'Bundle 5 — 30 day Price ($)', defaultValue: 0, min: 0, step: 1 },
  bundle5Supply2Price: { type: 'number', title: 'Bundle 5 — 90 day Price ($)', defaultValue: 0, min: 0, step: 1 },
  bundle5Badge: { type: 'string', title: 'Bundle 5 — Badge', defaultValue: '' },
  bundle5Caption: { type: 'string', title: 'Bundle 5 — Caption', defaultValue: '' },
  defaultBundleIndex: { type: 'number', title: 'Default Selected Bundle (1–5)', defaultValue: 1, min: 1, max: 5, step: 1 },
  supply1Label: { type: 'string', title: 'Supply 1 Label', defaultValue: '10 doses · 30 day order' },
  supply1MonthsCount: { type: 'number', title: 'Supply 1 Months', defaultValue: 1, min: 1, step: 1 },
  supply2Label: { type: 'string', title: 'Supply 2 Label', defaultValue: '30 doses · 90 day supply' },
  supply2MonthsCount: { type: 'number', title: 'Supply 2 Months', defaultValue: 3, min: 1, step: 1 },
  defaultSupplyIndex: { type: 'number', title: 'Default Selected Supply (1–2)', defaultValue: 1, min: 1, max: 2, step: 1 },
  fromPriceLabel: { type: 'string', title: 'Collapsed Bundle Price Prefix', defaultValue: 'from' },
  savingsCopyFormat: { type: 'string', title: 'Savings Copy', defaultValue: 'Save {amount} ({pct} off)' },
  showAddon: { type: 'enum', title: 'Show Addon Section', defaultValue: 'false', options: ['true', 'false'] },
  addonLabel: { type: 'string', title: 'Addon Label', defaultValue: 'Add a daily multivitamin' },
  addonDescription: { type: 'string', title: 'Addon Description', defaultValue: 'Delivered with your first order' },
  addonNoteText: { type: 'string', title: 'Addon Note', defaultValue: 'no extra cost' },
  addonPrice: { type: 'number', title: 'Addon Price ($)', defaultValue: 0, min: 0, step: 1 },
  addonDefaultOn: { type: 'enum', title: 'Addon Default On', defaultValue: 'false', options: ['true', 'false'] },
  ctaLabel: { type: 'string', title: 'CTA Label', defaultValue: 'Add to cart' },
  comboMap: { type: 'string', title: 'Combo Map — PRODUCTION (JSON)', defaultValue: COMBO_MAP_PROD_JSON },
  comboMapStaging: { type: 'string', title: 'Combo Map — STAGING (JSON)', defaultValue: COMBO_MAP_STAGING_JSON },
  borderRadius: { type: 'number', title: 'Border Radius', defaultValue: 12, min: 0, max: 32, step: 1 },
};

export const outputSchema = {
  type: 'object',
  fields: {
    bundleId: 'string',
    bundleTitle: 'string',
    bundleIngredients: 'string',
    bundleBadge: 'string',
    supplyId: 'string',
    supplyLabel: 'string',
    supplyMonthsCount: 'number',
    bundlePrice: 'number',
    withAddon: 'boolean',
    addonPrice: 'number',
    totalPrice: 'number',
    effectiveMonthly: 'number',
    slug: 'string',
    priceId: 'number',
  },
};

export {
  effMonthlyPrice,
  calcSavingsDollars,
  calcDiscountPct,
  formatSavingsCopy,
  COMBO_MAP_PROD,
  COMBO_MAP_STAGING,
};
