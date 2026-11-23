// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect, useMemo } from 'react';

/* ============================================================
   TIRZEPATIDE INJ — PathwAI pricing card

   Paste into the Tirzepatide PathwAI product-selection card.
   Requires pathwai-tirzepatide-sdk.js on the flow event.

   Staging (checkout.strut-test.com/tirzepatide):
     0.5mL  priceId 2251  $149  Tirzepatide 20mg/mL + Glycine 0.5mL vial
     1mL    priceId 2252  $199  Tirzepatide 20mg/mL + Glycine 1mL vial
     2mL    priceId 2253  $259  Tirzepatide 20mg/mL + Glycine 2mL vial
     3mL    priceId 2254  $259  Tirzepatide 20mg/mL + Glycine 3mL vial
     2×2mL  priceId 2255  $379  Tirzepatide 20mg/mL + Glycine 2x2mL vial
   Production (checkout.struthealth.com/tirzepatide):
     0.5mL  priceId 2232  $149  Tirzepatide 20mg/mL + Glycine 0.5mL vial
     1mL    priceId 2233  $199  Tirzepatide 20mg/mL + Glycine 1mL vial
     2mL    priceId 2234  $259  Tirzepatide 20mg/mL + Glycine 2mL vial
     3mL    priceId 2235  $259  Tirzepatide 20mg/mL + Glycine 3mL vial
     2×2mL  priceId 2236  $379  Tirzepatide 20mg/mL + Glycine 2x2mL vial

   Add to cart → strut.validateVisiting → pathwai.flow.next()
   Do NOT call getCurrentVisiting here — that endpoint requires auth (401 before login).
   Order is created after the auth card via getCurrentVisiting.
============================================================ */

type StrutHost = {
  strut?: {
    ENV?: { api?: string; checkout?: string };
    validateVisiting?: (slug: string, priceId: number) => Promise<unknown>;
    vialId?: (sizeOrKey: string) => number;
  };
  strut_env?: string;
  strut_tirzepatide_price_id?: number;
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

const TIRZEPATIDE_SLUG = 'tirzepatide';

const TIRZEPATIDE_CATALOG = {
  staging: {
    '0.5ml': { priceId: 2251, price: 149, label: 'Tirzepatide 20mg/mL + Glycine 0.5 mL vial', key: '0.5ml' },
    '1ml': { priceId: 2252, price: 199, label: 'Tirzepatide 20mg/mL + Glycine 1 mL vial', key: '1ml' },
    '2ml': { priceId: 2253, price: 259, label: 'Tirzepatide 20mg/mL + Glycine 2 mL vial', key: '2ml' },
    '3ml': { priceId: 2254, price: 259, label: 'Tirzepatide 20mg/mL + Glycine 3 mL vial', key: '3ml' },
    '2x2ml': { priceId: 2255, price: 379, label: 'Tirzepatide 20mg/mL + Glycine 2×2 mL vials', key: '2x2ml' },
  },
  production: {
    '0.5ml': { priceId: 2232, price: 149, label: 'Tirzepatide 20mg/mL + Glycine 0.5 mL vial', key: '0.5ml' },
    '1ml': { priceId: 2233, price: 199, label: 'Tirzepatide 20mg/mL + Glycine 1 mL vial', key: '1ml' },
    '2ml': { priceId: 2234, price: 259, label: 'Tirzepatide 20mg/mL + Glycine 2 mL vial', key: '2ml' },
    '3ml': { priceId: 2235, price: 259, label: 'Tirzepatide 20mg/mL + Glycine 3 mL vial', key: '3ml' },
    '2x2ml': { priceId: 2236, price: 379, label: 'Tirzepatide 20mg/mL + Glycine 2×2 mL vials', key: '2x2ml' },
  },
} as const;

type VialKey = keyof typeof TIRZEPATIDE_CATALOG.staging | keyof typeof TIRZEPATIDE_CATALOG.production;

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
  return isStagingEnv() ? TIRZEPATIDE_CATALOG.staging : TIRZEPATIDE_CATALOG.production;
}

function resolvePriceId(vial: VialKey): number {
  const row = catalogForEnv()[vial];
  const fromCatalog = Number(row?.priceId || 0);
  if (fromCatalog > 0) return fromCatalog;
  try {
    const fromSdk = Number(host().strut?.vialId?.(vial) || 0);
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

export default function TirzepatidePricingCard({
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

  title = 'Tirzepatide Injection',
  subtitle = 'Compounded Tirzepatide + Glycine vials · US licensed pharmacy',
  imageUrl = 'https://placehold.co/440x440/f1ece1/161336/png?text=Tirzepatide',
  subAxisLabel = 'Vial size',
  defaultVial = '1ml',
  pricePeriodSuffix = 'for 30 days',

  trustItem1 = '',
  trustItem2 = '',
  totalLabel = 'Total today',
  ctaLabel = 'Add to cart',
  borderRadius = 12,

  onCta = null as null | ((payload: Record<string, unknown>) => void),
  onChange = null as null | ((payload: Record<string, unknown>) => void),
}) {
  const vials = useMemo(() => {
    const cat = catalogForEnv();
    return (Object.keys(cat) as VialKey[]).map((id) => ({
      id,
      label: cat[id].label,
      price: cat[id].price,
      priceId: resolvePriceId(id),
      key: cat[id].key,
    }));
  }, []);

  const [vialId, setVialId] = useState<VialKey>(() => {
    const d = String(defaultVial || '1ml').toLowerCase().replace(/\s+/g, '') as VialKey;
    const keys = Object.keys(catalogForEnv()) as VialKey[];
    if (keys.includes(d)) return d;
    return keys[0] || '1ml';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ctaError, setCtaError] = useState<string | null>(null);

  const vial = vials.find((v) => v.id === vialId) || vials[0];
  const totalNow = vial?.price || 0;
  const selectedTint = hexToRgba(selectedBgColor, selectedBgOpacity);
  const selectedTintStrong = hexToRgba(selectedBgColor, Math.min(selectedBgOpacity * 2, 0.2));

  useEffect(() => {
    if (!onChange || !vial) return;
    onChange({
      formulationKey: 'f1',
      formulationLabel: title,
      variantId: vial.id,
      variantLabel: vial.label,
      variantPrice: vial.price,
      priceId: vial.priceId,
      withAddon: false,
      addonPrice: 0,
      totalPrice: totalNow,
      productSlug: TIRZEPATIDE_SLUG,
      env: isStagingEnv() ? 'staging' : 'production',
    });
  }, [onChange, vial, totalNow, title]);

  const handleCta = async () => {
    if (!vial) return;
    setCtaError(null);
    setIsLoading(true);

    const payload = {
      formulationKey: 'f1',
      formulationLabel: title,
      variantId: vial.id,
      variantLabel: vial.label,
      variantPrice: vial.price,
      priceId: vial.priceId,
      withAddon: false,
      addonPrice: 0,
      totalPrice: totalNow,
      productSlug: TIRZEPATIDE_SLUG,
    };

    try {
      if (onCta) {
        onCta(payload);
        return;
      }

      const w = host();
      const priceIdNum = Number(vial.priceId || 0);
      if (!priceIdNum) {
        throw new Error(
          isStagingEnv()
            ? 'Missing Tirzepatide priceId'
            : 'Production Tirzepatide priceIds are not set yet — update TIRZEPATIDE_CATALOG.production'
        );
      }

      try { w.strut_tirzepatide_price_id = priceIdNum; } catch { /* ignore */ }

      if (typeof w.strut?.validateVisiting !== 'function') {
        throw new Error('Tirzepatide SDK not loaded — paste pathwai-tirzepatide-sdk.js into the flow event');
      }

      // Visiting only — GetCurrentVisiting needs a Bearer token and runs after login.
      await w.strut.validateVisiting(TIRZEPATIDE_SLUG, priceIdNum);

      const cartApi = w.pathwai?.cart;
      if (cartApi?.clearCart && cartApi?.addItem) {
        cartApi.clearCart();
        cartApi.addItem({
          id: String(priceIdNum),
          name: vial.label,
          price: vial.price,
          quantity: 1,
          variants: [{ name: 'Vial size', value: vial.id }],
        });
      }

      try {
        w.pwPushGtm?.('Added to Cart', {
          product_name: 'Tirzepatide Inj',
          price_id: priceIdNum,
          price: vial.price,
          vial: vial.id,
        });
      } catch { /* ignore */ }

      w.pathwai?.flow?.next?.();
    } catch (e) {
      console.error('[tirzepatide] Add to cart error:', e);
      setCtaError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!vials.length) {
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
        Tirzepatide vial catalog is empty.
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
          align-items: center;
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
        .pcd-row-label {
          flex: 1;
          min-width: 0;
          font-weight: 500;
          font-size: 15px;
          line-height: 1.3;
          word-break: break-word;
        }
        .pcd-variant-row.is-selected .pcd-row-label { font-weight: 600; }
        .pcd-row-price {
          font-weight: 600;
          font-size: 16px;
          letter-spacing: -0.01em;
          flex-shrink: 0;
        }
        .pcd-row-price-suffix {
          font-weight: 400;
          font-size: 12px;
          color: var(--pcd-text-muted);
          letter-spacing: 0;
          margin-left: 4px;
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
          .pcd-row-label { font-size: 14px; }
          .pcd-row-price { font-size: 15px; }
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
            {vials.map((v) => {
              const isSel = vialId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  className={`pcd-variant-row ${isSel ? 'is-selected' : ''}`}
                  onClick={() => setVialId(v.id)}
                  aria-pressed={isSel}
                >
                  <span className="pcd-row-radio">
                    {isSel && <span className="pcd-row-radio-dot" />}
                  </span>
                  <span className="pcd-row-label">{v.label}</span>
                  <span className="pcd-row-price">
                    ${v.price}
                    {pricePeriodSuffix && (
                      <span className="pcd-row-price-suffix">{pricePeriodSuffix}</span>
                    )}
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
  title: { type: 'string', title: 'Product Title', defaultValue: 'Tirzepatide' },
  subtitle: { type: 'string', title: 'Subtitle', defaultValue: 'Compounded by a US licensed pharmacy' },
  imageUrl: {
    type: 'string',
    title: 'Image URL',
    defaultValue: 'https://placehold.co/440x440/f1ece1/161336/png?text=Tirzepatide',
  },
  subAxisLabel: { type: 'string', title: 'Variant Section Label', defaultValue: 'Vial size' },
  defaultVial: {
    type: 'enum',
    title: 'Default Vial',
    defaultValue: '1ml',
    options: ['0.5ml', '1ml', '2ml', '3ml', '2x2ml'],
  },
  pricePeriodSuffix: {
    type: 'string',
    title: 'Price Suffix',
    defaultValue: 'for 30 days',
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
