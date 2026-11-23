// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect, useMemo } from 'react';

/* ============================================================
   SERMORELIN ORAL — PathwAI product selection card

   Paste into the Sermorelin Oral PathwAI add-to-cart / product-selection card.
   Requires pathwai-sermorelin-oral-sdk.js on the flow event.
   Do NOT paste into the injectable Sermorelin flow.

   UI: Supply (30 / 90 / 150 day) → Dose (0.5 / 0.75 / 1 mg)

   Staging (checkout.strut-test.com/sermorelin):
     0.5mg   30d=2225 $99    90d=2230 $159   150d=2233 $319
     0.75mg  30d=2226 $109   90d=2231 $179   150d=2234 $349
     1mg     30d=2229 $139   90d=2232 $199   150d=2235 $379
   Production (checkout.struthealth.com/sermorelin):
     0.5mg   30d=1144 $99    90d=2165 $159   150d=2168 $319
     0.75mg  30d=1145 $109   90d=2166 $179   150d=2169 $349
     1mg     30d=1213 $139   90d=2167 $199   150d=2170 $379

   Env: window.strut_env = 'staging' | 'production' (set in pathwai-sermorelin-oral-sdk.js).

   Add to cart → strut.addToCart → validateVisiting → pathwai.flow.next()
============================================================ */

type StrutHost = {
  strut?: {
    ENV?: { api?: string; checkout?: string };
    validateVisiting?: (slug: string, priceId: number) => Promise<unknown>;
    skuId?: (sizeOrKey: string) => number;
    addToCart?: (priceId: number, opts?: Record<string, unknown>) => Promise<unknown>;
  };
  strut_env?: string;
  strut_sermorelin_price_id?: number;
  pathwai?: {
    flow?: { next?: (val?: unknown) => void };
    cart?: {
      clearCart?: () => void;
      addItem?: (item: Record<string, unknown>) => void;
    };
  };
  pwPushGtm?: (event: string, data?: Record<string, unknown>) => void;
  location?: { href: string };
};

function host(): StrutHost {
  return window as unknown as StrutHost;
}

const SERMORELIN_SLUG = 'sermorelin';

const DOSE_KEYS = {
  d1: '0.5mg',
  d2: '0.75mg',
  d3: '1mg',
} as const;

type DoseId = keyof typeof DOSE_KEYS;
type SupplyId = 's1' | 's2' | 's3';
type PriceKey = `${DoseId}|${SupplyId}`;

const SERMORELIN_ORAL_PRICE_IDS = {
  staging: {
    'd1|s1': 2225, 'd1|s2': 2230, 'd1|s3': 2233,
    'd2|s1': 2226, 'd2|s2': 2231, 'd2|s3': 2234,
    'd3|s1': 2229, 'd3|s2': 2232, 'd3|s3': 2235,
  },
  production: {
    'd1|s1': 1144, 'd1|s2': 2165, 'd1|s3': 2168,
    'd2|s1': 1145, 'd2|s2': 2166, 'd2|s3': 2169,
    'd3|s1': 1213, 'd3|s2': 2167, 'd3|s3': 2170,
  },
} as const;

function isStagingEnv() {
  if (typeof window === 'undefined') return true;
  const w = host();
  const explicit = String(w.strut_env || '').toLowerCase();
  if (explicit === 'staging') return true;
  if (explicit === 'production' || explicit === 'prod') return false;
  const blob = [
    w.strut?.ENV?.api || '',
    w.strut?.ENV?.checkout || '',
    w.location?.href || '',
  ].join(' ');
  return /strut-test/i.test(blob) || !blob;
}

function priceIdsForEnv() {
  return isStagingEnv() ? SERMORELIN_ORAL_PRICE_IDS.staging : SERMORELIN_ORAL_PRICE_IDS.production;
}

function resolveSkuKey(doseId: DoseId, supplyId: SupplyId) {
  const dose = DOSE_KEYS[doseId];
  return dose ? `oral|${dose}|${supplyId}` : '';
}

function resolvePriceId(doseId: DoseId, supplyId: SupplyId) {
  const key = `${doseId}|${supplyId}` as PriceKey;
  const fromCatalog = Number(priceIdsForEnv()[key] || 0);
  if (fromCatalog > 0) return fromCatalog;
  try {
    const skuKey = resolveSkuKey(doseId, supplyId);
    const fromSdk = Number(host().strut?.skuId?.(skuKey) || 0);
    if (fromSdk > 0) return fromSdk;
  } catch { /* ignore */ }
  return fromCatalog;
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
  if (a <= 0 || b <= 0 || am <= 0 || bm <= 0 || bm <= am) return 0;
  return Math.max(0, Math.round((a / am) * bm - b));
}

function calcDiscountPct(s1Price: number, s1MonthsCount: number, sPrice: number, sMonthsCount: number) {
  const savings = calcSavingsDollars(s1Price, s1MonthsCount, sPrice, sMonthsCount);
  const baseline = (Number(s1Price) / Number(s1MonthsCount)) * Number(sMonthsCount);
  if (baseline <= 0 || savings <= 0) return 0;
  return Math.max(0, Math.round((savings / baseline) * 100));
}

function formatSavingsCopy(template: string, amount: number, pct: number) {
  return (template || 'Save {amount} ({pct} off)')
    .replace(/\{amount\}/g, `$${amount}`)
    .replace(/\{pct\}/g, `${pct}%`);
}

function hexToRgba(hex: string, alpha: number) {
  const clean = String(hex || '').replace('#', '');
  if (clean.length !== 6) return `rgba(22, 19, 54, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildSkuLabel(supplyLabel: string, doseLabel: string) {
  const supply = supplyLabel.replace(/^(\d+)\s*day\s*supply$/i, '$1 Day Supply');
  return `${supply} - Sermorelin ${doseLabel}`;
}

function parseDoseMg(label: string) {
  const m = String(label || '').match(/([\d.]+)\s*mg/i);
  return m ? Number(m[1]) || 0 : 0;
}

function formatQuantityCopy(template: string, count: number, totalMg: number) {
  return (template || '')
    .replace(/\{count\}/g, String(count))
    .replace(/\{totalMg\}/g, String(totalMg))
    .trim();
}

export default function SermorelinOralPricingCard({
  brandColor = '#161336',
  discColor = '#f1ece1',
  bottleImageUrl = 'https://placehold.co/440x440/f1ece1/161336/png?text=Sermorelin+Oral',
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

  titleBase = 'Sermorelin Oral',
  subtitle = 'Growth hormone support · compounded Sermorelin troche by a US licensed pharmacy',
  supplyLabel = 'Supply',
  doseLabel = 'Dose',

  supply1Label = '42 day supply',
  supply1MonthsCount = 1,
  supply1TrocheCount = 30,
  supply2Label = '84 day supply',
  supply2MonthsCount = 3,
  supply2TrocheCount = 60,
  supply3Label = '150 day supply',
  supply3MonthsCount = 5,
  supply3TrocheCount = 150,
  defaultSupplyIndex = 1,

  supplyQuantityFormat = '{count} troches',
  doseQuantityFormat = '{totalMg} mg total',

  dose1Label = '0.5mg',
  dose1Supply1Price = 99,
  dose1Supply2Price = 159,
  dose1Supply3Price = 319,
  dose2Label = '0.75mg',
  dose2Supply1Price = 109,
  dose2Supply2Price = 179,
  dose2Supply3Price = 349,
  dose3Label = '1mg',
  dose3Supply1Price = 139,
  dose3Supply2Price = 199,
  dose3Supply3Price = 379,
  defaultDoseIndex = 1,

  savingsCopyFormat = 'Save {amount} ({pct} off)',
  trustItem1 = '',
  trustItem2 = '',
  totalLabel = 'Total today',
  ctaLabel = 'Add to cart',
  ctaBgColor = '#161336',
  cardRadius = 22,
  innerRadius = 12,

  onCta = null as null | ((payload: Record<string, unknown>) => void),
  onChange = null as null | ((payload: Record<string, unknown>) => void),
}) {
  const DOSES = useMemo(() => [
    {
      id: 'd1' as DoseId,
      label: dose1Label,
      s1: Number(dose1Supply1Price) || 0,
      s2: Number(dose1Supply2Price) || 0,
      s3: Number(dose1Supply3Price) || 0,
    },
    {
      id: 'd2' as DoseId,
      label: dose2Label,
      s1: Number(dose2Supply1Price) || 0,
      s2: Number(dose2Supply2Price) || 0,
      s3: Number(dose2Supply3Price) || 0,
    },
    {
      id: 'd3' as DoseId,
      label: dose3Label,
      s1: Number(dose3Supply1Price) || 0,
      s2: Number(dose3Supply2Price) || 0,
      s3: Number(dose3Supply3Price) || 0,
    },
  ].filter(d => d.label && (d.s1 > 0 || d.s2 > 0 || d.s3 > 0)), [
    dose1Label, dose1Supply1Price, dose1Supply2Price, dose1Supply3Price,
    dose2Label, dose2Supply1Price, dose2Supply2Price, dose2Supply3Price,
    dose3Label, dose3Supply1Price, dose3Supply2Price, dose3Supply3Price,
  ]);

  const SUPPLIES = useMemo(() => [
    {
      id: 's1' as SupplyId,
      label: supply1Label,
      monthsCount: Number(supply1MonthsCount) || 1,
      trocheCount: Number(supply1TrocheCount) || 30,
    },
    {
      id: 's2' as SupplyId,
      label: supply2Label,
      monthsCount: Number(supply2MonthsCount) || 3,
      trocheCount: Number(supply2TrocheCount) || 90,
    },
    {
      id: 's3' as SupplyId,
      label: supply3Label,
      monthsCount: Number(supply3MonthsCount) || 5,
      trocheCount: Number(supply3TrocheCount) || 150,
    },
  ].filter(s => s.label), [
    supply1Label, supply1MonthsCount, supply1TrocheCount,
    supply2Label, supply2MonthsCount, supply2TrocheCount,
    supply3Label, supply3MonthsCount, supply3TrocheCount,
  ]);

  const [supplyId, setSupplyId] = useState<SupplyId>(() => {
    const idx = Math.max(0, Math.min(SUPPLIES.length - 1, (Number(defaultSupplyIndex) || 1) - 1));
    return SUPPLIES[idx]?.id || 's1';
  });

  const [doseId, setDoseId] = useState<DoseId>(() => {
    const idx = Math.max(0, Math.min(DOSES.length - 1, (Number(defaultDoseIndex) || 1) - 1));
    return DOSES[idx]?.id || 'd1';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [ctaError, setCtaError] = useState<string | null>(null);

  useEffect(() => {
    if (DOSES.length && !DOSES.find(d => d.id === doseId)) setDoseId(DOSES[0].id);
  }, [DOSES, doseId]);

  useEffect(() => {
    if (SUPPLIES.length && !SUPPLIES.find(s => s.id === supplyId)) setSupplyId(SUPPLIES[0].id);
  }, [SUPPLIES, supplyId]);

  const selectedDose = DOSES.find(d => d.id === doseId) || DOSES[0];
  const supply = SUPPLIES.find(s => s.id === supplyId) || SUPPLIES[0];
  const supply1 = SUPPLIES.find(s => s.id === 's1');

  const totalNow = selectedDose?.[supplyId] || 0;
  const monthlyEff = supply ? effMonthlyPrice(totalNow, supply.monthsCount) : 0;
  const priceId = selectedDose ? resolvePriceId(selectedDose.id, supplyId) : 0;
  const skuKey = selectedDose ? resolveSkuKey(selectedDose.id, supplyId) : '';
  const skuLabel = selectedDose && supply
    ? buildSkuLabel(supply.label, selectedDose.label)
    : titleBase;

  const selectedTrocheCount = supply?.trocheCount || 0;
  const selectedDoseMg = selectedDose ? parseDoseMg(selectedDose.label) : 0;
  const selectedTotalDosageMg = selectedTrocheCount > 0 && selectedDoseMg > 0
    ? Math.round(selectedDoseMg * selectedTrocheCount * 1000) / 1000
    : 0;

  const selectedTint = hexToRgba(selectedBgColor, selectedBgOpacity);

  useEffect(() => {
    if (priceId) {
      try { host().strut_sermorelin_price_id = priceId; } catch { /* ignore */ }
    }
    if (!onChange || !selectedDose || !supply) return;
    onChange({
      doseId,
      doseLabel: selectedDose.label,
      supplyId,
      supplyLabel: supply.label,
      supplyMonthsCount: supply.monthsCount,
      trocheCount: supply.trocheCount,
      totalDosageMg: selectedTotalDosageMg,
      totalPrice: totalNow,
      effectiveMonthly: monthlyEff,
      priceId,
      sku: skuKey,
      productSlug: SERMORELIN_SLUG,
      env: isStagingEnv() ? 'staging' : 'production',
    });
  }, [doseId, supplyId, selectedDose, supply, selectedTotalDosageMg, totalNow, monthlyEff, priceId, skuKey, onChange]);

  const handleCta = async () => {
    if (!selectedDose || !supply) return;
    if (!priceId) {
      setCtaError(
        isStagingEnv()
          ? 'Missing Sermorelin oral staging priceId for this selection'
          : 'Production Sermorelin oral priceIds are not set — update SERMORELIN_ORAL_PRICE_IDS.production'
      );
      return;
    }
    setCtaError(null);
    setIsLoading(true);

    const payload = {
      doseId,
      doseLabel: selectedDose.label,
      supplyId,
      supplyLabel: supply.label,
      totalPrice: totalNow,
      priceId,
      sku: skuKey,
      productSlug: SERMORELIN_SLUG,
    };

    try {
      if (onCta) {
        onCta(payload);
        return;
      }

      const w = host();
      try { w.strut_sermorelin_price_id = priceId; } catch { /* ignore */ }

      if (typeof w.strut?.addToCart === 'function') {
        await w.strut.addToCart(priceId, { price: totalNow, label: skuLabel });
        return;
      }

      if (typeof w.strut?.validateVisiting !== 'function') {
        throw new Error('Sermorelin Oral SDK not loaded — paste pathwai-sermorelin-oral-sdk.js into the flow event');
      }

      await w.strut.validateVisiting(SERMORELIN_SLUG, priceId);

      const cartApi = w.pathwai?.cart;
      if (cartApi?.clearCart && cartApi?.addItem) {
        cartApi.clearCart();
        cartApi.addItem({
          id: String(priceId),
          name: skuLabel,
          price: totalNow,
          quantity: 1,
          variants: [
            { name: 'Dose', value: selectedDose.label },
            { name: 'Supply', value: supply.label },
          ],
        });
      }

      try {
        w.pwPushGtm?.('Added to Cart', {
          product_name: 'Sermorelin Oral',
          price_id: priceId,
          sku: skuKey,
          price: totalNow,
        });
      } catch { /* ignore */ }

      w.pathwai?.flow?.next?.();
    } catch (e) {
      console.error('[sermorelin-oral] Add to cart error:', e);
      setCtaError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!DOSES.length || !SUPPLIES.length) {
    return (
      <div style={{
        padding: 24,
        fontFamily: 'Figtree, system-ui, sans-serif',
        color: '#6B7670',
        fontSize: 14,
        textAlign: 'center',
        border: '1px dashed #E5E1D8',
        borderRadius: 22,
      }}>
        Configure at least one dose and one supply option.
      </div>
    );
  }

  const checkoutBlock = (mobile: boolean) => (
    <div className="pcg-checkout">
      <div className="pcg-checkout-top">
        <span className="pcg-checkout-label">{totalLabel}</span>
        <span className="pcg-checkout-price">
          ${totalNow}
          {monthlyEff > 0 && supply.monthsCount > 1 && (
            <span className="pcg-checkout-permo">· ${monthlyEff}/mo</span>
          )}
        </span>
      </div>
      <button
        type="button"
        className="pcg-cta"
        data-strut-sermorelin-oral-cta=""
        onClick={handleCta}
        disabled={isLoading || !priceId}
      >
        <span>{isLoading ? 'Adding…' : ctaLabel}</span>
        {!isLoading && <span className="pcg-cta-arrow" aria-hidden="true">→</span>}
      </button>
      {ctaError && mobile && <div className="pcg-error">{ctaError}</div>}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700&display=swap');
        .pcg-root, .pcg-root * { box-sizing: border-box; }
        .pcg-root {
          font-family: 'Figtree', system-ui, sans-serif;
          color: var(--pcg-text);
          background: transparent;
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          padding: 16px 16px 220px 16px;
          display: flex;
          flex-direction: column;
        }
        .pcg-body { display: flex; flex-direction: column; flex: 1; }
        .pcg-card {
          background: #fff;
          border-radius: var(--pcg-card-radius);
          padding: 28px 20px 24px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pcg-hero { display: flex; justify-content: center; margin-bottom: 20px; }
        .pcg-disc {
          width: 200px; height: 200px; max-width: 100%;
          border-radius: 999px; background: var(--pcg-disc);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
        }
        .pcg-disc img {
          width: var(--pcg-img-size, 100%);
          height: var(--pcg-img-size, 100%);
          object-fit: var(--pcg-img-fit, cover);
        }
        .pcg-title-wrap { text-align: center; }
        .pcg-title {
          font-family: 'Figtree', sans-serif;
          font-weight: 700; font-size: 26px; line-height: 1.2;
          letter-spacing: -0.02em; margin: 0 0 6px 0;
          color: var(--pcg-text); overflow-wrap: anywhere;
        }
        .pcg-subtitle {
          font-size: 13px; color: var(--pcg-text-muted);
          font-weight: 500; line-height: 1.4;
        }
        .pcg-label-row {
          font-family: 'Figtree', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; line-height: 1.33;
          text-transform: uppercase; color: var(--pcg-text);
          margin-bottom: 10px;
        }
        .pcg-section + .pcg-section { margin-top: 4px; }
        .pcg-supply-list {
          display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;
        }
        .pcg-supply {
          padding: 14px 16px;
          border-radius: var(--pcg-inner-radius);
          border: 1.5px solid var(--pcg-border);
          background: #fff; color: var(--pcg-text);
          font-family: 'Figtree', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; text-align: left; width: 100%;
          transition: border-color 0.15s ease, background 0.15s ease;
          min-height: 60px;
        }
        .pcg-supply:hover { border-color: var(--pcg-border-hover); }
        .pcg-supply.is-selected {
          border-color: var(--pcg-brand); background: var(--pcg-selected-bg);
        }
        .pcg-supply:disabled { opacity: 0.55; cursor: wait; }
        .pcg-supply-left {
          display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;
        }
        .pcg-radio {
          width: 20px; height: 20px; flex-shrink: 0;
          border: 1.5px solid var(--pcg-control-off); background: #fff;
          border-radius: 999px;
          display: flex; align-items: center; justify-content: center;
        }
        .pcg-supply.is-selected .pcg-radio {
          border-color: var(--pcg-brand); background: var(--pcg-brand);
        }
        .pcg-radio-dot {
          width: 7px; height: 7px; border-radius: 999px; background: #fff;
        }
        .pcg-supply-text { display: flex; flex-direction: column; min-width: 0; }
        .pcg-supply-primary { font-weight: 500; font-size: 15px; }
        .pcg-supply-sub {
          font-size: 12px; color: var(--pcg-brand); font-weight: 500; margin-top: 2px;
        }
        .pcg-supply-quantity {
          font-size: 12px; color: var(--pcg-text-muted); font-weight: 500; margin-top: 2px;
        }
        .pcg-dose {
          padding: 10px 8px; border-radius: var(--pcg-inner-radius);
          border: 1.5px solid var(--pcg-border); background: #fff;
          color: var(--pcg-text); font-family: 'Figtree', sans-serif;
          cursor: pointer; font-weight: 500; font-size: 14px;
          min-height: 44px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center; gap: 2px;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcg-dose-main { line-height: 1.2; }
        .pcg-dose-sub {
          font-size: 11px; font-weight: 500; line-height: 1.2;
          color: var(--pcg-text-muted);
        }
        .pcg-dose.is-selected .pcg-dose-sub { color: var(--pcg-text-muted); }
        .pcg-supply-price { font-family: 'Figtree', sans-serif; font-weight: 600; font-size: 16px; flex-shrink: 0; }
        .pcg-dose-grid {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px;
        }
        .pcg-dose:hover { border-color: var(--pcg-border-hover); }
        .pcg-dose.is-selected { border-color: var(--pcg-brand); background: var(--pcg-selected-bg); }
        .pcg-dose:disabled { opacity: 0.55; cursor: wait; }
        .pcg-trust {
          display: flex; flex-wrap: wrap; gap: 16px;
          font-size: 11.5px; color: var(--pcg-text-muted);
          margin-top: auto; padding-top: 8px; font-weight: 500;
        }
        .pcg-error {
          margin-top: 10px; font-size: 12.5px; color: #b42318;
          font-weight: 500; line-height: 1.4;
        }
        .pcg-checkout {
          padding: 14px 16px 28px 16px;
          border-top: 1px solid var(--pcg-border-soft); background: #fff;
        }
        .pcg-checkout-top {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 10px; margin-bottom: 12px; flex-wrap: wrap;
        }
        .pcg-checkout-label {
          font-family: 'Figtree', sans-serif; font-size: 11.5px;
          color: var(--pcg-text-muted); letter-spacing: 0.06em;
          text-transform: uppercase; font-weight: 600;
        }
        .pcg-checkout-price {
          font-family: 'Figtree', sans-serif; font-weight: 700;
          font-size: 26px; letter-spacing: -0.02em;
        }
        .pcg-checkout-permo {
          font-size: 13px; color: var(--pcg-text-muted);
          font-weight: 400; margin-left: 6px;
        }
        .pcg-cta {
          display: inline-flex; align-items: center; justify-content: center;
          width: 100%; height: 40px; gap: 8px;
          border: none; background: var(--pcg-cta-bg); color: #fff;
          border-radius: 6px; font-family: 'Figtree', sans-serif;
          font-size: 16px; font-weight: 400; cursor: pointer;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .pcg-cta:hover { opacity: 0.85; }
        .pcg-cta:active { transform: scale(0.97); }
        .pcg-cta:disabled { opacity: 0.55; cursor: wait; }
        .pcg-checkout-wrap-mobile {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 1001;
          padding-bottom: env(safe-area-inset-bottom); background: #fff;
        }
        .pcg-checkout-wrap-mobile .pcg-checkout-inner { max-width: 460px; margin: 0 auto; }
        .pcg-checkout-wrap-inline { display: none; }
        @media (min-width: 600px) {
          .pcg-root { max-width: 480px; padding: 24px 16px 28px 16px; }
          .pcg-checkout-wrap-mobile { display: none; }
          .pcg-checkout-wrap-inline { display: block; }
        }
        @media (max-width: 380px) {
          .pcg-dose-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="pcg-root"
        data-strut-sermorelin-oral-card=""
        style={{
          ['--pcg-brand' as string]: brandColor,
          ['--pcg-disc' as string]: discColor,
          ['--pcg-text' as string]: textColor,
          ['--pcg-text-muted' as string]: textMutedColor,
          ['--pcg-border' as string]: borderColor,
          ['--pcg-border-soft' as string]: borderSoftColor,
          ['--pcg-border-hover' as string]: borderHoverColor,
          ['--pcg-surface' as string]: surfaceColor,
          ['--pcg-control-off' as string]: controlOffColor,
          ['--pcg-selected-bg' as string]: selectedTint,
          ['--pcg-cta-bg' as string]: ctaBgColor,
          ['--pcg-card-radius' as string]: `${cardRadius}px`,
          ['--pcg-inner-radius' as string]: `${innerRadius}px`,
        }}
      >
        <div className="pcg-body">
          <div className="pcg-card">
            <div className="pcg-hero">
              <div
                className="pcg-disc"
                style={{
                  ['--pcg-img-fit' as string]: imageFit,
                  ['--pcg-img-size' as string]: imageFit === 'cover' ? '100%' : '78%',
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
            <div className="pcg-title-wrap">
              <h1 className="pcg-title">{titleBase}</h1>
              {subtitle && <div className="pcg-subtitle">{subtitle}</div>}
            </div>
          </div>

          <div className="pcg-section">
            <div className="pcg-label-row">{supplyLabel}</div>
            <div className="pcg-supply-list">
              {SUPPLIES.map(s => {
                const isSel = supplyId === s.id;
                const price = selectedDose[s.id] || 0;
                const supplySavings = supply1
                  ? calcSavingsDollars(selectedDose.s1, supply1.monthsCount, price, s.monthsCount)
                  : 0;
                const supplyPct = supply1
                  ? calcDiscountPct(selectedDose.s1, supply1.monthsCount, price, s.monthsCount)
                  : 0;
                const showSavings = s.id !== 's1' && supplySavings > 0;
                const trocheCopy = s.trocheCount > 0 && supplyQuantityFormat
                  ? formatQuantityCopy(supplyQuantityFormat, s.trocheCount, 0)
                  : '';
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`pcg-supply ${isSel ? 'is-selected' : ''}`}
                    onClick={() => setSupplyId(s.id)}
                    aria-pressed={isSel}
                    disabled={isLoading}
                  >
                    <div className="pcg-supply-left">
                      <div className="pcg-radio">
                        {isSel && <div className="pcg-radio-dot" />}
                      </div>
                      <div className="pcg-supply-text">
                        <div className="pcg-supply-primary">{s.label}</div>
                        {trocheCopy && (
                          <div className="pcg-supply-quantity">{trocheCopy}</div>
                        )}
                        {showSavings && (
                          <div className="pcg-supply-sub">
                            {formatSavingsCopy(savingsCopyFormat, supplySavings, supplyPct)}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="pcg-supply-price">${price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pcg-section">
            <div className="pcg-label-row">{doseLabel}</div>
            <div className="pcg-dose-grid">
              {DOSES.map(d => {
                const isSel = doseId === d.id;
                const doseMg = parseDoseMg(d.label);
                const troches = supply?.trocheCount || 0;
                const totalMg = troches > 0 && doseMg > 0
                  ? Math.round(doseMg * troches * 1000) / 1000
                  : 0;
                const doseQtyCopy = totalMg > 0 && doseQuantityFormat
                  ? formatQuantityCopy(doseQuantityFormat, troches, totalMg)
                  : '';
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`pcg-dose ${isSel ? 'is-selected' : ''}`}
                    onClick={() => setDoseId(d.id)}
                    aria-pressed={isSel}
                    disabled={isLoading}
                  >
                    <span className="pcg-dose-main">{d.label}</span>
                    {doseQtyCopy ? <span className="pcg-dose-sub">{doseQtyCopy}</span> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pcg-trust">
            {trustItem1 && <span>✓ {trustItem1}</span>}
            {trustItem2 && <span>✓ {trustItem2}</span>}
          </div>

          {ctaError && <div className="pcg-error">{ctaError}</div>}
        </div>

        <div className="pcg-checkout-wrap-inline">{checkoutBlock(false)}</div>
      </div>

      <div className="pcg-checkout-wrap-mobile" style={{
          ['--pcg-brand' as string]: brandColor,
          ['--pcg-disc' as string]: discColor,
          ['--pcg-text' as string]: textColor,
          ['--pcg-text-muted' as string]: textMutedColor,
          ['--pcg-border' as string]: borderColor,
          ['--pcg-border-soft' as string]: borderSoftColor,
          ['--pcg-border-hover' as string]: borderHoverColor,
          ['--pcg-surface' as string]: surfaceColor,
          ['--pcg-control-off' as string]: controlOffColor,
          ['--pcg-selected-bg' as string]: selectedTint,
          ['--pcg-cta-bg' as string]: ctaBgColor,
          ['--pcg-card-radius' as string]: `${cardRadius}px`,
          ['--pcg-inner-radius' as string]: `${innerRadius}px`,
        }}>
        <div className="pcg-checkout-inner">{checkoutBlock(true)}</div>
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
    defaultValue: 'https://placehold.co/440x440/f1ece1/161336/png?text=Sermorelin+Oral',
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

  titleBase: { type: 'string', title: 'Product Title', defaultValue: 'Sermorelin Oral' },
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue: 'Growth hormone support · compounded Sermorelin troche by a US licensed pharmacy',
  },
  supplyLabel: { type: 'string', title: 'Supply Section Label', defaultValue: 'Supply' },
  doseLabel: { type: 'string', title: 'Dose Section Label', defaultValue: 'Dose' },

  supply1Label: { type: 'string', title: 'Supply 1 Label', defaultValue: '30 day supply' },
  supply1MonthsCount: { type: 'number', title: 'Supply 1 Months', defaultValue: 1, min: 1, step: 1 },
  supply1TrocheCount: { type: 'number', title: 'Supply 1 Troche Count', defaultValue: 30, min: 1, step: 1 },
  supply2Label: { type: 'string', title: 'Supply 2 Label', defaultValue: '90 day supply' },
  supply2MonthsCount: { type: 'number', title: 'Supply 2 Months', defaultValue: 3, min: 1, step: 1 },
  supply2TrocheCount: { type: 'number', title: 'Supply 2 Troche Count', defaultValue: 90, min: 1, step: 1 },
  supply3Label: { type: 'string', title: 'Supply 3 Label', defaultValue: '150 day supply' },
  supply3MonthsCount: { type: 'number', title: 'Supply 3 Months', defaultValue: 5, min: 1, step: 1 },
  supply3TrocheCount: { type: 'number', title: 'Supply 3 Troche Count', defaultValue: 150, min: 1, step: 1 },
  defaultSupplyIndex: { type: 'number', title: 'Default Supply (1–3)', defaultValue: 1, min: 1, max: 3, step: 1 },

  supplyQuantityFormat: { type: 'string', title: 'Supply Quantity Copy', defaultValue: '{count} troches' },
  doseQuantityFormat: { type: 'string', title: 'Dose Total Quantity Copy', defaultValue: '{totalMg} mg total' },

  dose1Label: { type: 'string', title: 'Dose 1 Label', defaultValue: '0.5mg' },
  dose1Supply1Price: { type: 'number', title: 'Dose 1 — 30 day Price ($)', defaultValue: 99, min: 0, step: 1 },
  dose1Supply2Price: { type: 'number', title: 'Dose 1 — 90 day Price ($)', defaultValue: 159, min: 0, step: 1 },
  dose1Supply3Price: { type: 'number', title: 'Dose 1 — 150 day Price ($)', defaultValue: 319, min: 0, step: 1 },
  dose2Label: { type: 'string', title: 'Dose 2 Label', defaultValue: '0.75mg' },
  dose2Supply1Price: { type: 'number', title: 'Dose 2 — 30 day Price ($)', defaultValue: 109, min: 0, step: 1 },
  dose2Supply2Price: { type: 'number', title: 'Dose 2 — 90 day Price ($)', defaultValue: 179, min: 0, step: 1 },
  dose2Supply3Price: { type: 'number', title: 'Dose 2 — 150 day Price ($)', defaultValue: 349, min: 0, step: 1 },
  dose3Label: { type: 'string', title: 'Dose 3 Label', defaultValue: '1mg' },
  dose3Supply1Price: { type: 'number', title: 'Dose 3 — 30 day Price ($)', defaultValue: 139, min: 0, step: 1 },
  dose3Supply2Price: { type: 'number', title: 'Dose 3 — 90 day Price ($)', defaultValue: 199, min: 0, step: 1 },
  dose3Supply3Price: { type: 'number', title: 'Dose 3 — 150 day Price ($)', defaultValue: 379, min: 0, step: 1 },
  defaultDoseIndex: { type: 'number', title: 'Default Dose (1–3)', defaultValue: 1, min: 1, max: 3, step: 1 },

  savingsCopyFormat: { type: 'string', title: 'Savings Copy', defaultValue: 'Save {amount} ({pct} off)' },
  totalLabel: { type: 'string', title: 'Total Label', defaultValue: 'Total today' },
  ctaLabel: { type: 'string', title: 'CTA Label', defaultValue: 'Add to cart' },
  ctaBgColor: { type: 'color', title: 'CTA Button Color', defaultValue: '#161336' },
  cardRadius: { type: 'number', title: 'Card Border Radius', defaultValue: 22, min: 0, max: 32, step: 1 },
  innerRadius: { type: 'number', title: 'Inner Element Radius', defaultValue: 12, min: 0, max: 24, step: 1 },
};

export const outputSchema = {
  type: 'object',
  fields: {
    doseId: 'string',
    doseLabel: 'string',
    supplyId: 'string',
    supplyLabel: 'string',
    supplyMonthsCount: 'number',
    trocheCount: 'number',
    totalDosageMg: 'number',
    totalPrice: 'number',
    effectiveMonthly: 'number',
    priceId: 'number',
    sku: 'string',
    productSlug: 'string',
    env: 'string',
  },
};

export { effMonthlyPrice, calcSavingsDollars, calcDiscountPct, formatSavingsCopy };
