// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect, useMemo } from 'react';

/* ============================================================
   TIRZEPATIDE ORAL + B6 — PathwAI pricing card

   Paste into the Tirzepatide Oral PathwAI product-selection card.
   Requires pathwai-tirzepatide-oral-sdk.js on the flow event (slug tirzepatide).
   Do NOT paste this into the injectable Tirzepatide flow.

   Staging (checkout.strut-test.com/tirzepatide):
     Lozenges  starting=2244 $199  medium=2245 $249  high=2246 $299  max=2247 $349
   Production (checkout.struthealth.com/tirzepatide):
     Lozenges
       starting  priceId 1012  $199  3mg/5mg · 30 lozenges
       medium    priceId 1013  $249  4mg/5mg · 30 lozenges
       high      priceId 1014  $299  5mg/5mg · 30 lozenges
       max       priceId 1015  $349  6mg/5mg · 30 lozenges

   Add to cart → strut.addToCart / validateVisiting → pathwai.flow.next()
============================================================ */

type StrutHost = {
  strut?: {
    ENV?: { api?: string; checkout?: string };
    validateVisiting?: (slug: string, priceId: number) => Promise<unknown>;
    skuId?: (sizeOrKey: string) => number;
    doseId?: (sizeOrKey: string) => number;
    addToCart?: (priceId: number, opts?: Record<string, unknown>) => Promise<unknown>;
  };
  strut_env?: string;
  strut_tirzepatide_oral_price_id?: number;
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

const TIRZEPATIDE_ORAL_SLUG = 'tirzepatide';

const FORMULATION_ID = 'lozenge' as const;
const FORMULATION_LABEL = 'Lozenges';
type DoseId = 'starting' | 'medium' | 'high' | 'max';
type CatalogKey = `${typeof FORMULATION_ID}|${DoseId}`;

const LOZENGE_DOSES: DoseId[] = ['starting', 'medium', 'high', 'max'];

const TIRZEPATIDE_ORAL_CATALOG = {
  staging: {
    'lozenge|starting': { priceId: 2244, price: 199, badge: 'Starting Dose', doseLabel: '3 mg / 5 mg', supplyLabel: '30 lozenges', key: 'lozenge|starting' },
    'lozenge|medium': { priceId: 2245, price: 249, badge: 'Medium Dose', doseLabel: '4 mg / 5 mg', supplyLabel: '30 lozenges', key: 'lozenge|medium' },
    'lozenge|high': { priceId: 2246, price: 299, badge: 'High Dose', doseLabel: '5 mg / 5 mg', supplyLabel: '30 lozenges', key: 'lozenge|high' },
    'lozenge|max': { priceId: 2247, price: 349, badge: 'Max Dose', doseLabel: '6 mg / 5 mg', supplyLabel: '30 lozenges', key: 'lozenge|max' },
  },
  production: {
    'lozenge|starting': { priceId: 1012, price: 199, badge: 'Starting Dose', doseLabel: '3 mg / 5 mg', supplyLabel: '30 lozenges', key: 'lozenge|starting' },
    'lozenge|medium': { priceId: 1013, price: 249, badge: 'Medium Dose', doseLabel: '4 mg / 5 mg', supplyLabel: '30 lozenges', key: 'lozenge|medium' },
    'lozenge|high': { priceId: 1014, price: 299, badge: 'High Dose', doseLabel: '5 mg / 5 mg', supplyLabel: '30 lozenges', key: 'lozenge|high' },
    'lozenge|max': { priceId: 1015, price: 349, badge: 'Max Dose', doseLabel: '6 mg / 5 mg', supplyLabel: '30 lozenges', key: 'lozenge|max' },
  },
} as const;

function formatDoseVariantLabel(row: { badge: string; doseLabel: string; supplyLabel: string }) {
  const badge = String(row.badge || '').trim();
  const dose = String(row.doseLabel || '').trim();
  const supply = String(row.supplyLabel || '').trim();
  if (badge && dose && supply) return `${badge} ${dose} · ${supply}`;
  if (badge && dose) return `${badge} ${dose}`;
  return badge || dose || supply;
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
  return isStagingEnv() ? TIRZEPATIDE_ORAL_CATALOG.staging : TIRZEPATIDE_ORAL_CATALOG.production;
}

function resolvePriceId(dose: DoseId): number {
  const key = `${FORMULATION_ID}|${dose}` as CatalogKey;
  const row = catalogForEnv()[key];
  const fromCatalog = Number(row?.priceId || 0);
  if (fromCatalog > 0) return fromCatalog;
  try {
    const w = host().strut;
    const fromSdk = Number(w?.skuId?.(key) || w?.doseId?.(key) || 0);
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

export default function TirzepatideOralPricingCard({
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
  badgeColor = '#C62828',

  title = 'Tirzepatide Oral + B6',
  subtitle = '30-day supply · Tirzepatide + B6 (Pyridoxine) · compounded by a US licensed pharmacy',
  imageUrl = 'https://www.struthealth.com/assets/v3-wl-oral-tirzepatide.webp',
  doseLabel = 'Dose',
  defaultDose = 'starting',
  pricePeriodSuffix = 'for 30 days',

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
    return LOZENGE_DOSES.map((id) => {
      const key = `${FORMULATION_ID}|${id}` as CatalogKey;
      const row = cat[key];
      return {
        id,
        badge: row?.badge || id,
        doseLabel: row?.doseLabel || id,
        supplyLabel: row?.supplyLabel || '',
        price: row?.price || 0,
        priceId: resolvePriceId(id),
        key: row?.key || key,
      };
    }).filter((d) => d.price > 0 || d.priceId > 0);
  }, []);

  const [doseId, setDoseId] = useState<DoseId>(() => {
    const d = String(defaultDose || 'starting').toLowerCase() as DoseId;
    if (LOZENGE_DOSES.includes(d)) return d;
    return LOZENGE_DOSES[0] || 'starting';
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
      formulationKey: FORMULATION_ID,
      formulationLabel: FORMULATION_LABEL,
      variantId: dose.id,
      variantLabel: formatDoseVariantLabel(dose),
      variantPrice: dose.price,
      priceId: dose.priceId,
      withAddon: false,
      addonPrice: 0,
      totalPrice: totalNow,
      productSlug: TIRZEPATIDE_ORAL_SLUG,
      env: isStagingEnv() ? 'staging' : 'production',
    });
  }, [onChange, dose, totalNow]);

  const handleCta = async () => {
    if (!dose) return;
    setCtaError(null);
    setIsLoading(true);

    const payload = {
      formulationKey: FORMULATION_ID,
      formulationLabel: FORMULATION_LABEL,
      variantId: dose.id,
      variantLabel: formatDoseVariantLabel(dose),
      variantPrice: dose.price,
      priceId: dose.priceId,
      withAddon: false,
      addonPrice: 0,
      totalPrice: totalNow,
      productSlug: TIRZEPATIDE_ORAL_SLUG,
    };

    try {
      if (onCta) {
        onCta(payload);
        return;
      }

      const w = host();
      const priceIdNum = Number(dose.priceId || 0);
      if (!priceIdNum) {
        throw new Error(
          isStagingEnv()
            ? 'Missing Tirzepatide Oral staging priceId for this selection'
            : 'Production Tirzepatide Oral priceIds are not set — update TIRZEPATIDE_ORAL_CATALOG.production'
        );
      }

      try { w.strut_tirzepatide_oral_price_id = priceIdNum; } catch { /* ignore */ }

      if (typeof w.strut?.addToCart === 'function') {
        await w.strut.addToCart(priceIdNum, { price: dose.price, label: payload.variantLabel });
        return;
      }

      if (typeof w.strut?.validateVisiting !== 'function') {
        throw new Error('Tirzepatide Oral SDK not loaded — paste pathwai-tirzepatide-oral-sdk.js into this flow');
      }

      await w.strut.validateVisiting(TIRZEPATIDE_ORAL_SLUG, priceIdNum);

      const cartApi = w.pathwai?.cart;
      if (cartApi?.clearCart && cartApi?.addItem) {
        cartApi.clearCart();
        cartApi.addItem({
          id: String(priceIdNum),
          name: payload.variantLabel,
          price: dose.price,
          quantity: 1,
          variants: [
            { name: 'Formulation', value: FORMULATION_LABEL },
            { name: 'Dose', value: dose.badge },
          ],
        });
      }

      try {
        w.pwPushGtm?.('Added to Cart', {
          product_name: 'Tirzepatide Oral',
          price_id: priceIdNum,
          price: dose.price,
          formulation: FORMULATION_ID,
          dose: dose.id,
        });
      } catch { /* ignore */ }

      w.pathwai?.flow?.next?.();
    } catch (e) {
      console.error('[tirzepatide-oral] Add to cart error:', e);
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
        Tirzepatide Oral catalog is empty for this environment.
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
        .pcd-pill-row {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .pcd-pill {
          flex: 1;
          min-height: 44px;
          padding: 10px 12px;
          border-radius: var(--pcd-radius);
          border: 1.5px solid var(--pcd-border);
          background: #fff;
          color: var(--pcd-text);
          font-family: 'Figtree', sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.2;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcd-pill:hover { border-color: var(--pcd-border-hover); }
        .pcd-pill.is-selected {
          border-color: var(--pcd-brand);
          background: var(--pcd-selected-bg);
          font-weight: 600;
        }
        .pcd-variant-rows {
          display: flex;
          flex-direction: column;
          gap: 12px;
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
        .pcd-row-badge {
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.01em;
          color: var(--pcd-badge);
          line-height: 1.3;
        }
        .pcd-row-label-main {
          font-weight: 500;
          font-size: 14px;
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
        .pcd-variant-row.is-selected .pcd-row-badge,
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
          .pcd-pill { min-height: 40px; padding: 9px 10px; font-size: 13px; }
          .pcd-variant-row { padding: 12px 14px; gap: 10px; min-height: 48px; }
          .pcd-row-body { gap: 12px; }
          .pcd-row-label-main { font-size: 13px; }
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
          ['--pcd-badge' as string]: badgeColor,
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

          <div className="pcd-label-row">{doseLabel}</div>
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
                      <span className="pcd-row-badge">{v.badge}</span>
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
          ['--pcd-badge' as string]: badgeColor,
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
  badgeColor: { type: 'color', title: 'Dose Badge Color', defaultValue: '#C62828' },
  title: { type: 'string', title: 'Product Title', defaultValue: 'Tirzepatide Oral + B6' },
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue: '30-day supply · Tirzepatide + B6 (Pyridoxine) · compounded by a US licensed pharmacy',
  },
  imageUrl: {
    type: 'string',
    title: 'Image URL',
    defaultValue: 'https://www.struthealth.com/assets/v3-wl-oral-tirzepatide.webp',
  },
  doseLabel: { type: 'string', title: 'Dose Section Label', defaultValue: 'Dose' },
  defaultDose: {
    type: 'enum',
    title: 'Default Dose',
    defaultValue: 'starting',
    options: ['starting', 'medium', 'high', 'max'],
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
    totalPrice: 'number',
    productSlug: 'string',
    env: 'string',
  },
};
