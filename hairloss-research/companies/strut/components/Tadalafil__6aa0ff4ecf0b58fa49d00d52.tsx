import React, { useState, useEffect, useMemo } from 'react';

/* ============================================================
   TADALAFIL — PathwAI pricing card

   Paste into the Tadalafil PathwAI add-to-cart / product-selection card.
   Requires pathwai-tadalafil-sdk.js on the flow event.

   Staging (checkout.strut-test.com/tadalafil):
     5mg        30d=57  $30    90d=58  $72
     5mg Daily  30d=271 $90    90d=272 $216
     10mg       30d=273 $60    90d=274 $144
     20mg       30d=286 $120   90d=287 $288

   Add to cart → strut.addToCart → validateVisiting → pathwai.flow.next()
   Do NOT call getCurrentVisiting here — that endpoint requires auth (401 before login).
============================================================ */

declare global {
  interface Window {
    strut?: {
      ENV?: { api?: string; checkout?: string };
      validateVisiting?: (slug: string, priceId: number) => Promise<unknown>;
      skuId?: (sizeOrKey: string) => number;
      addToCart?: (priceId: number, opts?: Record<string, unknown>) => Promise<unknown>;
    };
    strut_env?: string;
    strut_tadalafil_price_id?: number;
    pathwai?: {
      flow?: { next?: (val?: unknown) => void };
      cart?: {
        clearCart?: () => void;
        addItem?: (item: Record<string, unknown>) => void;
      };
    };
    pwPushGtm?: (event: string, data?: Record<string, unknown>) => void;
  }
}

const TADALAFIL_SLUG = 'tadalafil';

type StrengthId = '5mg' | '5mg_daily' | '10mg' | '20mg';
type SupplyId = '30' | '90';

const STRENGTHS: { id: StrengthId; label: string; daily: boolean; mg: number; perDoseNote: string }[] = [
  { id: '5mg', label: '5mg', daily: false, mg: 5, perDoseNote: '(one 5mg tab per dose)' },
  { id: '5mg_daily', label: '5mg (Daily)', daily: true, mg: 5, perDoseNote: '(one 5mg tab per dose)' },
  { id: '10mg', label: '10mg', daily: false, mg: 10, perDoseNote: '(two 5mg tabs per dose)' },
  { id: '20mg', label: '20mg', daily: false, mg: 20, perDoseNote: '(four 5mg tabs per dose)' },
];

const SUPPLIES: { id: SupplyId; label: string; days: number }[] = [
  { id: '30', label: '30 Day Supply', days: 30 },
  { id: '90', label: '90 Day Supply', days: 90 },
];

const TADALAFIL_SKUS: Record<string, { priceId: number; price: number; label: string; key: string }> = {
  '5mg|30': { priceId: 57, price: 30, label: '30 Day Supply - 5mg', key: '5mg_30' },
  '5mg|90': { priceId: 58, price: 72, label: '90 Day Supply - 5mg', key: '5mg_90' },
  '5mg_daily|30': { priceId: 271, price: 90, label: '30 Day Supply - 5mg (Daily)', key: '5mg_daily_30' },
  '5mg_daily|90': { priceId: 272, price: 216, label: '90 Day Supply - 5mg (Daily)', key: '5mg_daily_90' },
  '10mg|30': { priceId: 273, price: 60, label: '30 Day Supply - 10mg', key: '10mg_30' },
  '10mg|90': { priceId: 274, price: 144, label: '90 Day Supply - 10mg', key: '10mg_90' },
  '20mg|30': { priceId: 286, price: 120, label: '30 Day Supply - 20mg', key: '20mg_30' },
  '20mg|90': { priceId: 287, price: 288, label: '90 Day Supply - 20mg', key: '20mg_90' },
};

function isStagingEnv() {
  if (typeof window === 'undefined') return true;
  const explicit = String(window.strut_env || '').toLowerCase();
  if (explicit === 'staging') return true;
  if (explicit === 'production' || explicit === 'prod') return false;
  const blob = [
    window.strut?.ENV?.api || '',
    window.strut?.ENV?.checkout || '',
    typeof window.location !== 'undefined' ? window.location.href : '',
  ].join(' ');
  return /strut-test/i.test(blob) || !blob;
}

function skuFor(strength: StrengthId, supply: SupplyId) {
  return TADALAFIL_SKUS[`${strength}|${supply}`] || null;
}

function resolvePriceId(strength: StrengthId, supply: SupplyId): number {
  const row = skuFor(strength, supply);
  const fromCatalog = Number(row?.priceId || 0);
  if (fromCatalog > 0) return fromCatalog;
  try {
    const fromSdk = Number(window.strut?.skuId?.(row?.key || `${strength}_${supply}`) || 0);
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

function parseDefaultStrength(raw: string): StrengthId {
  const d = String(raw || '5mg').toLowerCase().replace(/\s+/g, '_');
  if (d === '5mg_daily' || d === '5mgdaily') return '5mg_daily';
  if (d === '10mg') return '10mg';
  if (d === '20mg') return '20mg';
  return '5mg';
}

export default function TadalafilPricingCard({
  brandColor = '#161336',
  discColor = '#f1ece1',
  imageFit = 'cover',
  textColor = '#0F1714',
  textMutedColor = '#6B7670',
  borderColor = '#E5E1D8',
  borderSoftColor = '#EFECE3',
  borderHoverColor = '#C9C2AF',
  controlOffColor = '#D9D4C5',
  selectedBgColor = '#161336',
  selectedBgOpacity = 0.06,

  title = 'Tadalafil',
  subtitle = 'Compounded by a US licensed pharmacy',
  imageUrl = 'https://placehold.co/440x440/f1ece1/161336/png?text=Tadalafil',
  strengthLabel = 'Strength',
  perDose5mg = '(one 5mg tab per dose)',
  perDose5mgDaily = '(one 5mg tab per dose)',
  perDose10mg = '(two 5mg tabs per dose)',
  perDose20mg = '(four 5mg tabs per dose)',
  supplyLabel = 'Supply',
  defaultStrength = '5mg',
  defaultSupply = '30',

  totalLabel = 'Total today',
  ctaLabel = 'Add to cart',
  borderRadius = 12,

  onCta = null as null | ((payload: Record<string, unknown>) => void),
  onChange = null as null | ((payload: Record<string, unknown>) => void),
}) {
  const [strengthId, setStrengthId] = useState<StrengthId>(() => (
    parseDefaultStrength(String(defaultStrength || '5mg'))
  ));
  const [supplyId, setSupplyId] = useState<SupplyId>(() => (
    String(defaultSupply || '30') === '90' ? '90' : '30'
  ));
  const [isLoading, setIsLoading] = useState(false);
  const [ctaError, setCtaError] = useState<string | null>(null);

  const perDoseById: Record<StrengthId, string> = {
    '5mg': perDose5mg,
    '5mg_daily': perDose5mgDaily,
    '10mg': perDose10mg,
    '20mg': perDose20mg,
  };

  const strengthMeta = STRENGTHS.find((s) => s.id === strengthId) || STRENGTHS[0];
  const strength = {
    id: strengthId,
    label: strengthMeta.label,
    daily: strengthMeta.daily,
    mg: strengthMeta.mg,
    perDoseNote: perDoseById[strengthMeta.id] || strengthMeta.perDoseNote,
  };
  const supply = SUPPLIES.find((s) => s.id === supplyId) || SUPPLIES[0];
  const sku = useMemo(() => skuFor(strength.id, supply.id), [strength.id, supply.id]);
  const priceId = resolvePriceId(strength.id, supply.id);
  const price = Number(sku?.price || 0);
  const selectedTint = hexToRgba(selectedBgColor, selectedBgOpacity);
  const selectedTintStrong = hexToRgba(selectedBgColor, Math.min(selectedBgOpacity * 2, 0.2));

  useEffect(() => {
    if (priceId) {
      try { window.strut_tadalafil_price_id = priceId; } catch { /* ignore */ }
    }
    if (!onChange || !sku) return;
    onChange({
      formulationKey: strength.id,
      formulationLabel: title,
      variantId: sku.key,
      variantLabel: sku.label,
      variantPrice: price,
      priceId,
      strength: strength.label,
      perDoseNote: strength.perDoseNote,
      supply: supply.label,
      totalPrice: price,
      productSlug: TADALAFIL_SLUG,
      env: isStagingEnv() ? 'staging' : 'production',
    });
  }, [onChange, sku, priceId, price, strength, supply, title]);

  const handleCta = async () => {
    if (!sku || !priceId) return;
    setCtaError(null);
    setIsLoading(true);

    const payload = {
      formulationKey: strength.id,
      formulationLabel: title,
      variantId: sku.key,
      variantLabel: sku.label,
      variantPrice: price,
      priceId,
      strength: strength.label,
      supply: supply.label,
      totalPrice: price,
      productSlug: TADALAFIL_SLUG,
    };

    try {
      if (onCta) {
        onCta(payload);
        return;
      }

      const w = window;
      try { w.strut_tadalafil_price_id = priceId; } catch { /* ignore */ }

      if (typeof w.strut?.addToCart === 'function') {
        await w.strut.addToCart(priceId, { price, label: sku.label });
        return;
      }

      if (typeof w.strut?.validateVisiting !== 'function') {
        throw new Error('Tadalafil SDK not loaded — paste pathwai-tadalafil-sdk.js into the flow event');
      }

      await w.strut.validateVisiting(TADALAFIL_SLUG, priceId);

      const cartApi = w.pathwai?.cart;
      if (cartApi?.clearCart && cartApi?.addItem) {
        cartApi.clearCart();
        cartApi.addItem({
          id: String(priceId),
          name: sku.label,
          price,
          quantity: 1,
          variants: [
            { name: 'Strength', value: strength.label },
            { name: 'Supply', value: supply.label },
          ],
        });
      }

      try {
        w.pwPushGtm?.('Added to Cart', {
          product_name: 'Tadalafil',
          price_id: priceId,
          sku: sku.key,
          price,
        });
      } catch { /* ignore */ }

      w.pathwai?.flow?.next?.();
    } catch (e) {
      console.error('[tadalafil] Add to cart error:', e);
      setCtaError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
        .pcd-dose-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 20px;
        }
        .pcd-dose {
          min-height: 48px;
          padding: 10px 8px;
          border-radius: var(--pcd-radius);
          border: 1.5px solid var(--pcd-border);
          background: #fff;
          color: var(--pcd-text);
          font-family: 'Figtree', sans-serif;
          font-weight: 500;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 4px;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcd-dose-main { line-height: 1.2; }
        .pcd-dose-sub {
          font-size: 11px;
          font-weight: 500;
          color: var(--pcd-text-muted);
          line-height: 1.25;
        }
        .pcd-dose:hover { border-color: var(--pcd-border-hover); }
        .pcd-dose.is-selected {
          border-color: var(--pcd-brand);
          background: var(--pcd-selected-bg);
          font-weight: 600;
        }
        .pcd-dose.is-selected .pcd-dose-sub { color: var(--pcd-text-muted); }
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
        }
        .pcd-variant-row.is-selected .pcd-row-label { font-weight: 600; }
        .pcd-row-price {
          font-weight: 600;
          font-size: 16px;
          letter-spacing: -0.01em;
          flex-shrink: 0;
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
          font-size: 20px;
          letter-spacing: -0.02em;
          line-height: 1.2;
          text-align: right;
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
          .pcd-checkout-price { font-size: 18px; }
          .pcd-checkout { padding: 12px 18px 24px 18px; }
        }
      `}</style>

      <div
        className="pcd-root"
        data-strut-tadalafil-card=""
        style={{
          ['--pcd-brand' as string]: brandColor,
          ['--pcd-disc' as string]: discColor,
          ['--pcd-text' as string]: textColor,
          ['--pcd-text-muted' as string]: textMutedColor,
          ['--pcd-border' as string]: borderColor,
          ['--pcd-border-soft' as string]: borderSoftColor,
          ['--pcd-border-hover' as string]: borderHoverColor,
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

          <div className="pcd-label-row">{strengthLabel}</div>
          <div className="pcd-dose-grid">
            {STRENGTHS.map((s) => {
              const isSel = strengthId === s.id;
              const note = perDoseById[s.id] || s.perDoseNote;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`pcd-dose ${isSel ? 'is-selected' : ''}`}
                  onClick={() => setStrengthId(s.id)}
                  aria-pressed={isSel}
                  disabled={isLoading}
                >
                  <span className="pcd-dose-main">{s.label}</span>
                  {note ? <span className="pcd-dose-sub">{note}</span> : null}
                </button>
              );
            })}
          </div>

          <div className="pcd-label-row">{supplyLabel}</div>
          <div className="pcd-variant-rows">
            {SUPPLIES.map((s) => {
              const isSel = supplyId === s.id;
              const row = skuFor(strength.id, s.id);
              const rowPrice = Number(row?.price || 0);
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`pcd-variant-row ${isSel ? 'is-selected' : ''}`}
                  onClick={() => setSupplyId(s.id)}
                  aria-pressed={isSel}
                  disabled={isLoading}
                >
                  <span className="pcd-row-radio">
                    {isSel && <span className="pcd-row-radio-dot" />}
                  </span>
                  <span className="pcd-row-label">{s.label}</span>
                  {rowPrice > 0 && <span className="pcd-row-price">${rowPrice}</span>}
                </button>
              );
            })}
          </div>

          {ctaError && <div className="pcd-error">{ctaError}</div>}
        </div>

        <div className="pcd-checkout-wrap-inline">
          <div className="pcd-checkout">
            <div className="pcd-checkout-top">
              <span className="pcd-checkout-label">{totalLabel}</span>
              <span className="pcd-checkout-price">
                {price > 0 ? `$${price}` : (sku?.label || 'Tadalafil')}
              </span>
            </div>
            <button
              type="button"
              className="pcd-cta"
              data-strut-tadalafil-cta=""
              onClick={handleCta}
              disabled={isLoading || !priceId}
            >
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
          ['--pcd-control-off' as string]: controlOffColor,
          ['--pcd-selected-bg' as string]: selectedTint,
          ['--pcd-selected-bg-strong' as string]: selectedTintStrong,
          ['--pcd-radius' as string]: `${borderRadius}px`,
        }}>
        <div className="pcd-checkout-inner">
          <div className="pcd-checkout">
            <div className="pcd-checkout-top">
              <span className="pcd-checkout-label">{totalLabel}</span>
              <span className="pcd-checkout-price">
                {price > 0 ? `$${price}` : (sku?.label || 'Tadalafil')}
              </span>
            </div>
            <button
              type="button"
              className="pcd-cta"
              data-strut-tadalafil-cta=""
              onClick={handleCta}
              disabled={isLoading || !priceId}
            >
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
  borderHoverColor: { type: 'color', title: 'Border Color (Hover)', defaultValue: '#C9C2AF' },
  controlOffColor: { type: 'color', title: 'Control Color (radio off)', defaultValue: '#D9D4C5' },
  selectedBgColor: { type: 'color', title: 'Selected Background Tint', defaultValue: '#161336' },
  selectedBgOpacity: {
    type: 'number', title: 'Selected Background Opacity', defaultValue: 0.06, min: 0, max: 1, step: 0.01,
  },
  title: { type: 'string', title: 'Product Title', defaultValue: 'Tadalafil' },
  subtitle: { type: 'string', title: 'Subtitle', defaultValue: 'Compounded by a US licensed pharmacy' },
  imageUrl: {
    type: 'string',
    title: 'Image URL',
    defaultValue: 'https://placehold.co/440x440/f1ece1/161336/png?text=Tadalafil',
  },
  strengthLabel: { type: 'string', title: 'Strength Section Label', defaultValue: 'Strength' },
  perDose5mg: { type: 'string', title: '5mg — per dose note', defaultValue: '(one 5mg tab per dose)' },
  perDose5mgDaily: { type: 'string', title: '5mg Daily — per dose note', defaultValue: '(one 5mg tab per dose)' },
  perDose10mg: { type: 'string', title: '10mg — per dose note', defaultValue: '(two 5mg tabs per dose)' },
  perDose20mg: { type: 'string', title: '20mg — per dose note', defaultValue: '(four 5mg tabs per dose)' },
  supplyLabel: { type: 'string', title: 'Supply Section Label', defaultValue: 'Supply' },
  defaultStrength: {
    type: 'enum', title: 'Default Strength', defaultValue: '5mg',
    options: ['5mg', '5mg_daily', '10mg', '20mg'],
  },
  defaultSupply: { type: 'enum', title: 'Default Supply', defaultValue: '30', options: ['30', '90'] },
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
    strength: 'string',
    perDoseNote: 'string',
    supply: 'string',
    totalPrice: 'number',
    productSlug: 'string',
    env: 'string',
  },
};
