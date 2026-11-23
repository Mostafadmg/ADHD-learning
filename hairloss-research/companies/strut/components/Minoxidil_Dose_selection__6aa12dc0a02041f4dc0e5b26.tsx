// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect, useMemo } from 'react';

/* ============================================================
   ORAL MINOXIDIL MEN — PathwAI pricing card

   Paste into the Minoxidil PathwAI product-selection card.
   Requires pathwai-minoxidil-sdk.js on the flow event.

   Staging (checkout.strut-test.com/oral_minoxidil_men):
     dose_2_5   priceId 2256  $65  90 Day Supply - 2.5 mg
     dose_1_25  priceId 2257  $55  90 Day Supply - 1.25mg
   Production (checkout.struthealth.com/oral_minoxidil_men):
     dose_2_5   priceId 797   $65  90 Day Supply - 2.5 mg
     dose_1_25  priceId 798   $55  90 Day Supply - 1.25mg

   Env: window.strut_env = 'staging' | 'production' (set in pathwai-minoxidil-sdk.js).

   Add to cart → strut.addToCart → validateVisiting → pathwai.flow.next()
   Do NOT call getCurrentVisiting here — that endpoint requires auth (401 before login).
   Order is created after the auth card via getCurrentVisiting.
============================================================ */

type StrutHost = {
  strut?: {
    ENV?: { api?: string; checkout?: string };
    validateVisiting?: (slug: string, priceId: number) => Promise<unknown>;
    skuId?: (sizeOrKey: string) => number;
    addToCart?: (priceId: number, opts?: Record<string, unknown>) => Promise<unknown>;
  };
  strut_env?: string;
  strut_minoxidil_price_id?: number;
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

const MINOXIDIL_SLUG = 'oral_minoxidil_men';

const MINOXIDIL_CATALOG = {
  staging: {
    dose_2_5:  { priceId: 2256, price: 65, doseLabel: '2.5 mg', supplyLabel: '90 Day Supply', key: 'dose_2_5' },
    dose_1_25: { priceId: 2257, price: 55, doseLabel: '2.5 mg (1.25mg)', supplyLabel: '90 Day Supply', key: 'dose_1_25' },
  },
  production: {
    dose_2_5:  { priceId: 797, price: 65, doseLabel: '2.5 mg', supplyLabel: '90 Day Supply', key: 'dose_2_5' },
    dose_1_25: { priceId: 798, price: 55, doseLabel: '1.25 mg', supplyLabel: '90 Day Supply', key: 'dose_1_25' },
  },
} as const;

type DoseKey = 'dose_2_5' | 'dose_1_25';

function formatDoseVariantLabel(row: { doseLabel: string; supplyLabel: string }) {
  const dose = String(row.doseLabel || '').trim();
  const supply = String(row.supplyLabel || '').trim();
  if (dose && supply) return `${dose} · ${supply}`;
  return dose || supply;
}

function isStagingEnv() {
  if (typeof window === 'undefined') return true;
  const w = host();
  const explicit = String(w.strut_env || '').toLowerCase();
  if (explicit === 'staging') return true;
  if (explicit === 'production' || explicit === 'prod') return false;
  const blob = [
    w.strut?.ENV?.api || '',
    w.strut?.ENV?.checkout || '',
    typeof window.location !== 'undefined' ? window.location.href : '',
  ].join(' ');
  return /strut-test/i.test(blob) || !blob;
}

function catalogForEnv() {
  return isStagingEnv() ? MINOXIDIL_CATALOG.staging : MINOXIDIL_CATALOG.production;
}

function resolvePriceId(dose: DoseKey): number {
  const row = catalogForEnv()[dose];
  const fromCatalog = Number(row?.priceId || 0);
  if (fromCatalog > 0) return fromCatalog;
  try {
    const fromSdk = Number(host().strut?.skuId?.(dose) || 0);
    if (fromSdk > 0) return fromSdk;
  } catch { /* ignore */ }
  return fromCatalog;
}

function hexToRgba(hex: string, alpha: number) {
  const clean = String(hex || '').replace('#', '');
  if (clean.length !== 6) return `rgba(22, 19, 54, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function MinoxidilPricingCard({
  brandColor = '#161336',
  discColor = '#f1ece1',
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

  title = 'Minoxidil Tablets',
  subtitle = 'Oral minoxidil for hair loss · compounded by a US licensed pharmacy',
  imageUrl = 'https://placehold.co/440x440/f1ece1/161336/png?text=Minoxidil',
  subAxisLabel = 'Dose',
  defaultDose = 'dose_2_5',
  pricePeriodSuffix = 'for 90 days',

  trustItem1 = '',
  trustItem2 = '',
  totalLabel = 'Total today',
  ctaLabel = 'Add to cart',
  borderRadius = 12,

  onCta = null as null | ((payload: Record<string, unknown>) => void),
  onChange = null as null | ((payload: Record<string, unknown>) => void),
}) {
  const doses = useMemo(() => {
    const cat = catalogForEnv();
    return (Object.keys(cat) as DoseKey[]).map((id) => {
      const row = cat[id];
      return {
        id,
        doseLabel: row.doseLabel,
        supplyLabel: row.supplyLabel,
        label: formatDoseVariantLabel(row),
        price: row.price,
        priceId: resolvePriceId(id),
        key: row.key,
      };
    });
  }, []);

  const [doseId, setDoseId] = useState<DoseKey>(() => {
    const d = String(defaultDose || 'dose_2_5').toLowerCase().replace(/\s+/g, '') as DoseKey;
    if (d === 'dose_1_25') return d;
    return 'dose_2_5';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ctaError, setCtaError] = useState<string | null>(null);

  const dose = doses.find((v) => v.id === doseId) || doses[0];
  const totalNow = dose?.price || 0;
  const selectedTint = hexToRgba(selectedBgColor, selectedBgOpacity);
  const selectedTintStrong = hexToRgba(selectedBgColor, Math.min(selectedBgOpacity * 2, 0.2));

  useEffect(() => {
    if (!onChange || !dose) return;
    onChange({
      formulationKey: dose.id,
      formulationLabel: title,
      variantId: dose.id,
      variantLabel: dose.label,
      variantPrice: dose.price,
      priceId: dose.priceId,
      withAddon: false,
      addonPrice: 0,
      totalPrice: totalNow,
      productSlug: MINOXIDIL_SLUG,
      env: isStagingEnv() ? 'staging' : 'production',
    });
  }, [onChange, dose, totalNow, title]);

  const handleCta = async () => {
    if (!dose) return;
    setCtaError(null);
    setIsLoading(true);

    const payload = {
      formulationKey: dose.id,
      formulationLabel: title,
      variantId: dose.id,
      variantLabel: dose.label,
      variantPrice: dose.price,
      priceId: dose.priceId,
      withAddon: false,
      addonPrice: 0,
      totalPrice: totalNow,
      productSlug: MINOXIDIL_SLUG,
    };

    try {
      if (onCta) {
        onCta(payload);
        return;
      }

      const w = host();
      const priceIdNum = Number(dose.priceId || 0);
      if (!priceIdNum) {
        throw new Error('Missing Minoxidil priceId — check MINOXIDIL_CATALOG and pathwai-minoxidil-sdk.js');
      }

      try { w.strut_minoxidil_price_id = priceIdNum; } catch { /* ignore */ }

      if (typeof w.strut?.addToCart === 'function') {
        await w.strut.addToCart(priceIdNum, { price: dose.price, label: dose.label });
        return;
      }

      if (typeof w.strut?.validateVisiting !== 'function') {
        throw new Error('Minoxidil SDK not loaded — paste pathwai-minoxidil-sdk.js into the flow event');
      }

      // Visiting only — GetCurrentVisiting needs a Bearer token and runs after login.
      await w.strut.validateVisiting(MINOXIDIL_SLUG, priceIdNum);

      const cartApi = w.pathwai?.cart;
      if (cartApi?.clearCart && cartApi?.addItem) {
        cartApi.clearCart();
        cartApi.addItem({
          id: String(priceIdNum),
          name: dose.label,
          price: dose.price,
          quantity: 1,
          variants: [{ name: 'Dose', value: dose.id }],
        });
      }

      try {
        w.pwPushGtm?.('Added to Cart', {
          product_name: 'Oral Minoxidil Men',
          price_id: priceIdNum,
          price: dose.price,
          sku: dose.id,
        });
      } catch { /* ignore */ }

      w.pathwai?.flow?.next?.();
    } catch (e) {
      console.error('[minoxidil] Add to cart error:', e);
      setCtaError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!doses.length) {
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
        Minoxidil dose catalog is empty.
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&display=swap');

        .pcd-root, .pcd-root * { box-sizing: border-box; }
        .pcd-root {
          font-family: 'Figtree', system-ui, sans-serif;
          color: var(--pcd-text);
          background: #ffffff;
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          padding: 20px 0 220px 0;
          display: flex;
          flex-direction: column;
        }
        .pcd-body {
          padding: 12px 24px 16px 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .pcd-hero {
          display: flex;
          justify-content: center;
          padding: 8px 0 4px 0;
        }
        .pcd-disc {
          width: 220px;
          height: 220px;
          max-width: 100%;
          border-radius: 999px;
          background: var(--pcd-disc);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .pcd-disc img {
          width: var(--pcd-img-size, 100%);
          height: var(--pcd-img-size, 100%);
          object-fit: var(--pcd-img-fit, cover);
        }
        .pcd-title-wrap { text-align: center; margin-bottom: 22px; }
        .pcd-title {
          font-family: 'Figtree', sans-serif;
          font-weight: 700;
          font-size: 26px;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin: 0 0 6px 0;
          color: var(--pcd-text);
          overflow-wrap: anywhere;
        }
        .pcd-subtitle {
          font-size: 13px;
          color: var(--pcd-text-muted);
          font-weight: 500;
          line-height: 1.4;
        }
        .pcd-label-row {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--pcd-text);
          margin-bottom: 10px;
        }
        .pcd-variant-rows {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .pcd-variant-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: var(--pcd-radius);
          border: 1.5px solid var(--pcd-border);
          background: #fff;
          color: var(--pcd-text);
          font-family: 'Figtree', sans-serif;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: border-color 0.15s ease, background 0.15s ease;
          min-height: 52px;
        }
        .pcd-variant-row:hover { border-color: var(--pcd-border-hover); }
        .pcd-variant-row.is-selected {
          border-color: var(--pcd-brand);
          background: var(--pcd-selected-bg);
        }
        .pcd-row-radio {
          width: 20px;
          height: 20px;
          margin-top: 2px;
          border-radius: 999px;
          border: 1.5px solid var(--pcd-control-off);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcd-variant-row.is-selected .pcd-row-radio {
          border-color: var(--pcd-brand);
          background: var(--pcd-brand);
        }
        .pcd-row-radio-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #fff;
        }
        .pcd-row-body {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding-top: 1px;
        }
        .pcd-row-copy {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pcd-row-label-main {
          font-weight: 500;
          font-size: 15px;
          line-height: 1.35;
          word-break: break-word;
        }
        .pcd-row-label-sub {
          font-weight: 500;
          font-size: 13px;
          line-height: 1.35;
          color: var(--pcd-text-muted);
          word-break: break-word;
        }
        .pcd-variant-row.is-selected .pcd-row-label-main { font-weight: 600; }
        .pcd-row-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          flex-shrink: 0;
          padding-top: 1px;
          text-align: right;
        }
        .pcd-row-price-amount {
          font-weight: 600;
          font-size: 16px;
          letter-spacing: -0.01em;
          line-height: 1.2;
          white-space: nowrap;
        }
        .pcd-row-price-suffix {
          font-weight: 400;
          font-size: 11px;
          color: var(--pcd-text-muted);
          letter-spacing: 0;
          line-height: 1.2;
          white-space: nowrap;
        }
        .pcd-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 11.5px;
          color: var(--pcd-text-muted);
          margin-top: auto;
          padding-top: 8px;
          font-weight: 500;
        }
        .pcd-error {
          margin-top: 10px;
          font-size: 12.5px;
          color: #b42318;
          font-weight: 500;
          line-height: 1.4;
        }
        .pcd-checkout {
          padding: 14px 24px 28px 24px;
          border-top: 1px solid var(--pcd-border-soft);
          background: #fff;
        }
        .pcd-checkout-top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .pcd-checkout-label {
          font-size: 11.5px;
          color: var(--pcd-text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .pcd-checkout-price {
          font-family: 'Figtree', sans-serif;
          font-weight: 700;
          font-size: 26px;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .pcd-cta {
          position: relative;
          z-index: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 40px;
          min-width: 80px;
          padding: 0 16px;
          gap: 8px;
          appearance: none;
          -webkit-appearance: none;
          border: none;
          outline: 2px solid transparent;
          outline-offset: 2px;
          background: var(--pcd-brand);
          color: #fff;
          border-radius: 6px;
          font-family: 'Figtree', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          overflow: hidden;
          transform: translateZ(0);
          transition: transform 0.15s ease, background-color 0.15s ease, opacity 0.15s ease;
        }
        .pcd-cta:hover { opacity: 0.8; }
        .pcd-cta:active { transform: scale(0.97); }
        .pcd-cta:disabled { opacity: 0.55; cursor: wait; }
        .pcd-cta:focus-visible { outline-color: var(--pcd-brand); z-index: 10; }
        .pcd-cta-arrow { display: inline-flex; align-items: center; line-height: 1; }
        .pcd-checkout-wrap-mobile {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          z-index: 1001;
          padding-bottom: env(safe-area-inset-bottom);
          background: #fff;
        }
        .pcd-checkout-wrap-mobile .pcd-checkout-inner {
          max-width: 460px;
          margin: 0 auto;
        }
        .pcd-checkout-wrap-inline { display: none; }
        @media (min-width: 600px) {
          .pcd-root { max-width: 480px; padding: 24px 0 28px 0; }
          .pcd-checkout-wrap-mobile { display: none; }
          .pcd-checkout-wrap-inline { display: block; }
        }
        @media (min-width: 900px) {
          .pcd-root { max-width: 500px; padding: 32px 0 32px 0; }
        }
        @media (max-width: 380px) {
          .pcd-root { padding: 16px 0 200px 0; }
          .pcd-body { padding: 10px 18px 16px 18px; }
          .pcd-disc { width: 180px; height: 180px; }
          .pcd-title { font-size: 22px; }
          .pcd-variant-row { padding: 12px 14px; gap: 10px; min-height: 48px; }
          .pcd-row-body { gap: 12px; }
          .pcd-row-label-main { font-size: 14px; }
          .pcd-row-label-sub { font-size: 12px; }
          .pcd-row-price-amount { font-size: 15px; }
          .pcd-row-price-suffix { font-size: 10px; }
          .pcd-checkout-price { font-size: 23px; }
          .pcd-checkout { padding: 12px 18px 24px 18px; }
        }
      `}</style>

      <div
        className="pcd-root"
        style={{
          ['--pcd-brand' as string]: brandColor,
          ['--pcd-disc' as string]: discColor,
          ['--pcd-text' as string]: textColor,
          ['--pcd-text-muted' as string]: textMutedColor,
          ['--pcd-border' as string]: borderColor,
          ['--pcd-border-soft' as string]: borderSoftColor,
          ['--pcd-border-hover' as string]: borderHoverColor,
          ['--pcd-surface' as string]: surfaceColor,
          ['--pcd-control-off' as string]: controlOffColor,
          ['--pcd-selected-bg' as string]: selectedTint,
          ['--pcd-selected-bg-strong' as string]: selectedTintStrong,
          ['--pcd-radius' as string]: `${borderRadius}px`,
        }}
      >
        <div className="pcd-body">
          <div className="pcd-hero">
            <div
              className="pcd-disc"
              style={{
                ['--pcd-img-fit' as string]: imageFit,
                ['--pcd-img-size' as string]: imageFit === 'cover' ? '100%' : '78%',
              }}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={title}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>
          </div>

          <div className="pcd-title-wrap">
            <h1 className="pcd-title">{title}</h1>
            <div className="pcd-subtitle">{subtitle}</div>
          </div>

          <div className="pcd-label-row">{subAxisLabel}</div>
          <div className="pcd-variant-rows">
            {doses.map((v) => {
              const isSel = doseId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  className={`pcd-variant-row ${isSel ? 'is-selected' : ''}`}
                  onClick={() => setDoseId(v.id)}
                  aria-pressed={isSel}
                >
                  <span className="pcd-row-radio">
                    {isSel && <span className="pcd-row-radio-dot" />}
                  </span>
                  <span className="pcd-row-body">
                    <span className="pcd-row-copy">
                      <span className="pcd-row-label-main">{v.doseLabel}</span>
                      <span className="pcd-row-label-sub">{v.supplyLabel}</span>
                    </span>
                    <span className="pcd-row-price">
                      <span className="pcd-row-price-amount">${v.price}</span>
                      {pricePeriodSuffix && (
                        <span className="pcd-row-price-suffix">{pricePeriodSuffix}</span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pcd-trust">
            {trustItem1 && <span>✓ {trustItem1}</span>}
            {trustItem2 && <span>✓ {trustItem2}</span>}
          </div>

          {ctaError && <div className="pcd-error">{ctaError}</div>}
        </div>

        <div className="pcd-checkout-wrap-inline">
          <div className="pcd-checkout">
            <div className="pcd-checkout-top">
              <span className="pcd-checkout-label">{totalLabel}</span>
              <span className="pcd-checkout-price">${totalNow}</span>
            </div>
            <button type="button" className="pcd-cta" onClick={handleCta} disabled={isLoading}>
              <span>{isLoading ? 'Adding…' : ctaLabel}</span>
              {!isLoading && <span className="pcd-cta-arrow" aria-hidden="true">→</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="pcd-checkout-wrap-mobile" style={{
          ['--pcd-brand' as string]: brandColor,
          ['--pcd-disc' as string]: discColor,
          ['--pcd-text' as string]: textColor,
          ['--pcd-text-muted' as string]: textMutedColor,
          ['--pcd-border' as string]: borderColor,
          ['--pcd-border-soft' as string]: borderSoftColor,
          ['--pcd-border-hover' as string]: borderHoverColor,
          ['--pcd-surface' as string]: surfaceColor,
          ['--pcd-control-off' as string]: controlOffColor,
          ['--pcd-selected-bg' as string]: selectedTint,
          ['--pcd-selected-bg-strong' as string]: selectedTintStrong,
          ['--pcd-radius' as string]: `${borderRadius}px`,
        }}>
        <div className="pcd-checkout-inner">
          <div className="pcd-checkout">
            <div className="pcd-checkout-top">
              <span className="pcd-checkout-label">{totalLabel}</span>
              <span className="pcd-checkout-price">${totalNow}</span>
            </div>
            <button type="button" className="pcd-cta" onClick={handleCta} disabled={isLoading}>
              <span>{isLoading ? 'Adding…' : ctaLabel}</span>
              {!isLoading && <span className="pcd-cta-arrow" aria-hidden="true">→</span>}
            </button>
            {ctaError && <div className="pcd-error">{ctaError}</div>}
          </div>
        </div>
      </div>
    </>
  );
}

export const propSchema = {
  brandColor: { type: 'color', title: 'Brand Color', defaultValue: '#161336' },
  discColor: { type: 'color', title: 'Hero Disc Background', defaultValue: '#f1ece1' },
  imageFit: { type: 'enum', title: 'Image Fit', defaultValue: 'cover', options: ['cover', 'contain'] },
  textColor: { type: 'color', title: 'Text Color', defaultValue: '#0F1714' },
  textMutedColor: { type: 'color', title: 'Text Color (Muted)', defaultValue: '#6B7670' },
  borderColor: { type: 'color', title: 'Border Color (Default)', defaultValue: '#E5E1D8' },
  borderSoftColor: { type: 'color', title: 'Border Color (Soft, dividers)', defaultValue: '#EFECE3' },
  surfaceColor: { type: 'color', title: 'Surface Color', defaultValue: '#FBFAF7' },
  controlOffColor: { type: 'color', title: 'Control Color (radio off)', defaultValue: '#D9D4C5' },
  borderHoverColor: { type: 'color', title: 'Border Color (Hover)', defaultValue: '#C9C2AF' },
  selectedBgColor: { type: 'color', title: 'Selected Background Tint', defaultValue: '#161336' },
  selectedBgOpacity: {
    type: 'number', title: 'Selected Background Opacity', defaultValue: 0.06, min: 0, max: 1, step: 0.01,
  },
  title: { type: 'string', title: 'Product Title', defaultValue: 'Minoxidil Tablets' },
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue: 'Oral minoxidil for hair loss · compounded by a US licensed pharmacy',
  },
  imageUrl: {
    type: 'string',
    title: 'Image URL',
    defaultValue: 'https://placehold.co/440x440/f1ece1/161336/png?text=Minoxidil',
  },
  subAxisLabel: { type: 'string', title: 'Variant Section Label', defaultValue: 'Dose' },
  defaultDose: { type: 'enum', title: 'Default Dose', defaultValue: 'dose_2_5', options: ['dose_2_5', 'dose_1_25'] },
  pricePeriodSuffix: {
    type: 'string',
    title: 'Price Suffix',
    defaultValue: 'for 90 days',
  },
  totalLabel: { type: 'string', title: 'Total Label', defaultValue: 'Total today' },
  ctaLabel: { type: 'string', title: 'CTA Label', defaultValue: 'Add to cart' },
  borderRadius: { type: 'number', title: 'Card Border Radius', defaultValue: 12, min: 0, max: 24, step: 1 },
};

export const outputSchema = {
  type: 'object',
  fields: {
    formulationKey: 'string',
    formulationLabel: 'string',
    variantId: 'string',
    variantLabel: 'string',
    variantPrice: 'number',
    priceId: 'number',
    withAddon: 'boolean',
    addonPrice: 'number',
    totalPrice: 'number',
    productSlug: 'string',
    env: 'string',
  },
};
