import React, { useState, useEffect } from 'react';

/* ============================================================
   BHRT Single Product Card (clean card style)
   One product, one supply. Reuse for 90/150 day by changing
   supplyLabel, price, originalPrice, priceId props.
   Defaults = Progesterone E4M 100mg, 30 day supply.
   Scoped prefix: bpc-
============================================================ */

const hexToRgba = (hex: string, alpha: number) => {
  if (!hex || typeof hex !== 'string') return `rgba(0,0,0,${alpha})`;
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const parseItems = (str: string) => {
  if (!str || typeof str !== 'string') return [];
  return str.split('\n').map(s => s.trim()).filter(Boolean);
};

export default function BHRTProductCard({
  /* THEME */
  brandColor = '#161336',
  textColor = '#0F1714',
  textMutedColor = '#6B7670',
  borderColor = '#E5E1D8',
  borderSoftColor = '#EFECE3',
  surfaceColor = '#FFFFFF',
  cardShadowOpacity = 0.06,
  borderRadius = 12,

  /* PRODUCT */
  title = 'Progesterone E4M Oral Capsule',
  subtitle = '100mg · Oral capsule',
  supplyLabel = '30 day supply',
  price = '$69',
  originalPrice = '',
  perMonthNote = '',
  badge = '',
  subnote = 'Compounded and shipped by a US licensed pharmacy.',

  /* MARKERS (optional, one per line) */
  markersTitle = "What's included",
  markers = '',

  /* TRUST FOOTER */
  trust1Label = 'Clinician-reviewed',
  trust1Icon = 'shield',
  trust2Label = 'Secure & private',
  trust2Icon = 'lock',
  trust3Label = 'Cancel anytime',
  trust3Icon = 'check',

  /* COMPLIANCE */
  complianceNote = '',

  /* CTA + CHECKOUT */
  yesLabel = 'Yes - add Progesterone Capsule 100mg to cart',
  noLabel = 'No',
  baseCheckoutUrl = 'https://checkout.strut-test.com/female-bhrt',
  priceId = '2154',

  /* ROUTING: must match the block\'s Output Alias in the step editor */
  answerKey = 'progesterone',

  onChange,
}: {
  brandColor?: string;
  textColor?: string;
  textMutedColor?: string;
  borderColor?: string;
  borderSoftColor?: string;
  surfaceColor?: string;
  cardShadowOpacity?: number;
  borderRadius?: number;
  title?: string;
  subtitle?: string;
  supplyLabel?: string;
  price?: string;
  originalPrice?: string;
  perMonthNote?: string;
  badge?: string;
  subnote?: string;
  markersTitle?: string;
  markers?: string;
  trust1Label?: string;
  trust1Icon?: 'shield' | 'lock' | 'check';
  trust2Label?: string;
  trust2Icon?: 'shield' | 'lock' | 'check';
  trust3Label?: string;
  trust3Icon?: 'shield' | 'lock' | 'check';
  complianceNote?: string;
  yesLabel?: string;
  noLabel?: string;
  baseCheckoutUrl?: string;
  priceId?: string;
  answerKey?: string;
  onChange?: (outputs: { choice: string }) => void;
}) {
  const [choice, setChoice] = useState<string | null>(null);

  const MARKERS = parseItems(markers);

  const TRUST = [
    { label: trust1Label, icon: trust1Icon },
    { label: trust2Label, icon: trust2Icon },
    { label: trust3Label, icon: trust3Icon },
  ].filter(t => t.label);

  useEffect(() => {
    if (choice !== null) {
      onChange?.({ choice });
    }
  }, [choice, onChange]);

const PROG_PRICE_IDS = [
  { staging: 1295, prod: 2154 }, // E4M 100mg 30-day (prod has no 90/150 rows)
  { staging: 2209, prod: 2154 },
  { staging: 2214, prod: 2154 },
  { staging: 2202, prod: 2202 }, // E4M 200mg
  { staging: 2210, prod: 2202 },
  { staging: 2215, prod: 2202 },
  { staging: 2208, prod: 2201 }, // cream
];

const isProdStrut = () => {
  const strutAny = (window as any).strut;
  const env = (window as any).strut_env;
  const api = String(strutAny?.ENV?.api || '');
  if (env === 'staging' || /strut-test/i.test(api)) return false;
  return true;
};

const resolveAddonPriceId = (raw: string | number) => {
  const n = Number(raw);
  if (!n) return 0;
  const prod = isProdStrut();
  if (prod) {
    const hit = PROG_PRICE_IDS.find(r => r.staging === n || r.prod === n);
    return hit ? hit.prod : n;
  }
  const byStaging = PROG_PRICE_IDS.find(r => r.staging === n);
  if (byStaging) return byStaging.staging;
  const byProd = PROG_PRICE_IDS.find(r => r.prod === n);
  return byProd ? byProd.staging : n;
};

// Local only. FinishOrderV2 / flushSecondRxAfterAuth persist after login.
const syncAddOnWithStrut = async (action: 'add' | 'remove') => {
  const strutAny = (window as any).strut;
  if (!strutAny) {
    console.error('[progesterone] window.strut missing — BHRT SDK not loaded');
    return;
  }

  if (action === 'remove') {
    (window as any).strut_bhrt_two_product = false;
    strutAny.clearSecondRx?.();
    console.log('[progesterone] Second Rx cleared locally');
    return;
  }

  const resolved = resolveAddonPriceId(priceId);
  if (!resolved) {
    console.error('[progesterone] missing priceId');
    return;
  }

  (window as any).strut_bhrt_two_product = true;
  const stored = await strutAny.addSecondRx?.(
    { priceId: resolved },
    { persist: false }
  );
  console.log('[progesterone] Second Rx saved locally', {
    env: isProdStrut() ? 'production' : 'staging',
    fromProp: priceId,
    resolved,
    stored,
  });
};

const handleChoice = async (selected: 'yes' | 'no') => {
  setChoice(selected);
  onChange?.({ choice: selected });

  const advance = () => setTimeout(
    () => (window as any).pathwai?.flow?.next?.({ [answerKey]: { choice: selected } }),
  0);

  if (selected !== 'yes') {
    syncAddOnWithStrut('remove').catch(() => {});
    advance();
    return;
  }

  try {
    // Do not validateVisiting with this card's priceId — that replaces the estrogen visiting.
    const resolved = String(resolveAddonPriceId(priceId) || priceId);
    const cartApi = typeof window !== 'undefined' ? (window as any).pathwai?.cart : null;
    if (cartApi && resolved) {
      const priceNumeric = parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
      cartApi.addItem({ id: resolved, name: title, price: priceNumeric, quantity: 1 });
    }
    await syncAddOnWithStrut('add');
  } catch (e) {
    console.error('BHRT add to cart error:', e);
  }
  advance();
};

  const renderIcon = (icon: string) => {
    if (icon === 'shield') return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 1L3 5V11C3 16.55 7.84 21.74 12 23C16.16 21.74 21 16.55 21 11V5L12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
    if (icon === 'lock') return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M19 11H5C3.9 11 3 11.9 3 13V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V13C21 11.9 20.1 11 19 11ZM19 13V11C19 9.34 17.66 8 16 8H8C6.34 8 5 9.34 5 11V13H19Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    );
    if (icon === 'check') return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M7 12L10.5 15.5L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
    return null;
  };

  const shadowSoft = `0 2px 8px ${hexToRgba('#000000', cardShadowOpacity)}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .bpc-root, .bpc-root * { box-sizing: border-box; }
        .bpc-root {
          --bpc-brand: ${brandColor};
          --bpc-text: ${textColor};
          --bpc-muted: ${textMutedColor};
          --bpc-border: ${borderColor};
          --bpc-border-soft: ${borderSoftColor};
          --bpc-surface: ${surfaceColor};
          --bpc-radius: ${borderRadius}px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          color: var(--bpc-text);
          background: transparent;
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          padding: 16px 16px 20px 16px;
          display: flex;
          flex-direction: column;
        }

        .bpc-card {
          position: relative;
          background: var(--bpc-surface);
          border: 1px solid var(--bpc-border);
          border-radius: var(--bpc-radius);
          padding: 28px 20px;
          box-shadow: ${shadowSoft};
          margin-bottom: 20px;
        }

        .bpc-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          display: inline-flex;
          align-items: center;
          background: var(--bpc-brand);
          color: #fff;
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.2;
          white-space: nowrap;
        }

        .bpc-title { 
          font-family: 'Figtree', sans-serif; font-size: 20px; font-weight: 600; 
          line-height: 1.3; letter-spacing: -0.01em; margin: 0 0 6px 0;
          color: var(--bpc-text); text-align: center; overflow-wrap: anywhere;
        }
        .bpc-subtitle {
          font-size: 14px; font-weight: 400; line-height: 1.4;
          color: var(--bpc-muted); text-align: center; margin-bottom: 18px;
        }

        .bpc-price-row {
          display: flex; align-items: baseline; justify-content: center;
          gap: 8px; flex-wrap: wrap; margin-bottom: 4px;
        }
        .bpc-price-main {
          font-family: 'Figtree', sans-serif; font-size: 32px; font-weight: 700;
          line-height: 1; letter-spacing: -0.01em; color: var(--bpc-text);
          font-variant-numeric: tabular-nums;
        }
        .bpc-price-original {
          font-family: 'Figtree', sans-serif; font-size: 16px; font-weight: 500;
          line-height: 1; color: var(--bpc-muted); text-decoration: line-through;
          text-decoration-thickness: 1.5px; font-variant-numeric: tabular-nums; opacity: 0.75;
        }
        .bpc-supply-line {
          text-align: center; font-size: 14px; font-weight: 500;
          color: var(--bpc-muted); margin-bottom: 2px;
        }
        .bpc-permo {
          color: var(--bpc-muted); font-weight: 400;
        }

        .bpc-subnote {
          font-size: 13px; font-weight: 400; line-height: 1.5;
          color: var(--bpc-muted); text-align: center; margin-top: 18px;
        }

        .bpc-markers {
          margin-top: 20px;
          background: ${hexToRgba(brandColor, 0.04)};
          border: 1px solid var(--bpc-border-soft);
          border-radius: 10px;
          padding: 16px 18px;
        }
        .bpc-markers-title { font-size: 12px; font-weight: 600; color: var(--bpc-text); margin: 0 0 10px 0; }
        .bpc-markers-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr; gap: 10px 16px; }
        .bpc-marker-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--bpc-muted); line-height: 1.4; }
        .bpc-marker-dot { width: 4px; height: 4px; border-radius: 999px; background: var(--bpc-brand); flex-shrink: 0; opacity: 0.5; margin-top: 7px; }

        .bpc-compliance {
          display: flex; align-items: flex-start; gap: 10px;
          background: ${hexToRgba(brandColor, 0.06)}; color: var(--bpc-text);
          padding: 12px 14px; border-radius: 6px; margin-bottom: 20px;
        }
        .bpc-compliance-icon { flex-shrink: 0; width: 16px; height: 16px; color: var(--bpc-brand); margin-top: 1px; }
        .bpc-compliance-text { font-size: 12.5px; font-weight: 500; line-height: 1.5; color: var(--bpc-text); margin: 0; }

        .bpc-choice { margin-top: 4px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px; }
        .bpc-btn {
          width: 100%; min-height: 48px; padding: 12px 18px;
          border-radius: 8px; font-family: 'Figtree', sans-serif;
          font-size: 15px; font-weight: 600; line-height: 1.3;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          text-align: center; transition: opacity 0.18s ease, transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
        }
        .bpc-btn:active { transform: scale(0.98); }
        .bpc-btn-yes { background: var(--bpc-brand); color: #fff; border: none; }
        .bpc-btn-yes:hover { opacity: 0.92; }
        .bpc-btn-no { background: transparent; color: var(--bpc-muted); border: 1px solid var(--bpc-border); }
        .bpc-btn-no:hover { border-color: var(--bpc-muted); color: var(--bpc-text); }

        .bpc-trust {
          padding-top: 18px; border-top: 1px solid var(--bpc-border-soft);
          display: flex; justify-content: space-around; align-items: center; gap: 16px;
        }
        .bpc-trust-item { display: flex; align-items: center; gap: 8px; color: var(--bpc-muted); flex: 1 1 auto; min-width: 0; }
        .bpc-trust-label { font-size: 11px; font-weight: 500; line-height: 1.3; color: var(--bpc-muted); margin: 0; }

        @media (min-width: 600px) {
          .bpc-root { max-width: 480px; padding: 24px 16px 28px 16px; }
          .bpc-card { padding: 32px 28px; }
          .bpc-title { font-size: 22px; }
          .bpc-subtitle { font-size: 15px; }
          .bpc-price-main { font-size: 36px; }
          .bpc-markers-list { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 900px) {
          .bpc-root { max-width: 500px; padding: 32px 16px 32px 16px; }
          .bpc-title { font-size: 24px; }
        }
        @media (max-width: 380px) {
          .bpc-root { padding: 12px 12px 16px 12px; }
          .bpc-card { padding: 24px 16px; }
          .bpc-price-main { font-size: 28px; }
          .bpc-trust { gap: 8px; }
          .bpc-trust-label { font-size: 10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bpc-btn { transition: none; }
          .bpc-btn:active { transform: none; }
        }
      `}</style>

      <div className="bpc-root">
        <div className="bpc-card">
          {badge && <span className="bpc-badge">{badge}</span>}

          <h1 className="bpc-title">{title}</h1>
          {subtitle && <div className="bpc-subtitle">{subtitle}</div>}

          <div className="bpc-price-row">
            <span className="bpc-price-main">{price}</span>
            {originalPrice && <span className="bpc-price-original">{originalPrice}</span>}
          </div>
          {(supplyLabel || perMonthNote) && (
            <div className="bpc-supply-line">
              {supplyLabel}
              {perMonthNote && <span className="bpc-permo"> · {perMonthNote}</span>}
            </div>
          )}

          {subnote && <div className="bpc-subnote">{subnote}</div>}

          {MARKERS.length > 0 && (
            <div className="bpc-markers">
              {markersTitle && <p className="bpc-markers-title">{markersTitle}</p>}
              <ul className="bpc-markers-list">
                {MARKERS.map((m, i) => (
                  <li key={i} className="bpc-marker-item">
                    <span className="bpc-marker-dot" aria-hidden="true" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {complianceNote && (
          <div className="bpc-compliance">
            <svg className="bpc-compliance-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M12 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="1" fill="currentColor" />
            </svg>
            <p className="bpc-compliance-text">{complianceNote}</p>
          </div>
        )}

        <div className="bpc-choice">
          <button type="button" className="bpc-btn bpc-btn-yes" onClick={() => handleChoice('yes')}>
            {yesLabel}
          </button>
          <button type="button" className="bpc-btn bpc-btn-no" onClick={() => handleChoice('no')}>
            {noLabel}
          </button>
        </div>

        {TRUST.length > 0 && (
          <div className="bpc-trust">
            {TRUST.map((t, i) => (
              <div key={i} className="bpc-trust-item">
                {renderIcon(t.icon)}
                <p className="bpc-trust-label">{t.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export const propSchema = {
  brandColor: { type: 'color', title: 'Brand Color', defaultValue: '#161336' },
  textColor: { type: 'color', title: 'Text Color', defaultValue: '#0F1714' },
  textMutedColor: { type: 'color', title: 'Text Muted', defaultValue: '#6B7670' },
  borderColor: { type: 'color', title: 'Border', defaultValue: '#E5E1D8' },
  borderSoftColor: { type: 'color', title: 'Border Soft', defaultValue: '#EFECE3' },
  surfaceColor: { type: 'color', title: 'Card Background', defaultValue: '#FFFFFF' },
  cardShadowOpacity: { type: 'number', title: 'Card Shadow Opacity', defaultValue: 0.06, min: 0, max: 0.3, step: 0.01 },
  borderRadius: { type: 'number', title: 'Border Radius', defaultValue: 12, min: 0, max: 32, step: 1 },

  title: { type: 'string', title: 'Title', defaultValue: 'Progesterone E4M Oral Capsule' },
  subtitle: { type: 'string', title: 'Subtitle', defaultValue: '100mg · Oral capsule' },
  supplyLabel: { type: 'string', title: 'Supply Label', defaultValue: '30 day supply' },
  price: { type: 'string', title: 'Price', defaultValue: '$69' },
  originalPrice: { type: 'string', title: 'Original Price (empty hides)', defaultValue: '' },
  perMonthNote: { type: 'string', title: 'Per-month Note (e.g. $50/mo)', defaultValue: '' },
  badge: { type: 'string', title: 'Badge (empty hides)', defaultValue: '' },
  subnote: { type: 'string', title: 'Subnote', defaultValue: 'Compounded and shipped by a US licensed pharmacy.' },

  markersTitle: { type: 'string', title: 'Markers Heading', defaultValue: "What's included" },
  markers: { type: 'string', title: 'Markers (one per line, empty hides)', defaultValue: '' },

  trust1Label: { type: 'string', title: 'Trust 1 Label', defaultValue: 'Clinician-reviewed' },
  trust1Icon: { type: 'enum', title: 'Trust 1 Icon', defaultValue: 'shield', options: ['shield', 'lock', 'check'] },
  trust2Label: { type: 'string', title: 'Trust 2 Label', defaultValue: 'Secure & private' },
  trust2Icon: { type: 'enum', title: 'Trust 2 Icon', defaultValue: 'lock', options: ['shield', 'lock', 'check'] },
  trust3Label: { type: 'string', title: 'Trust 3 Label', defaultValue: 'Cancel anytime' },
  trust3Icon: { type: 'enum', title: 'Trust 3 Icon', defaultValue: 'check', options: ['shield', 'lock', 'check'] },

  complianceNote: { type: 'string', title: 'Compliance Note (empty hides)', defaultValue: '' },

  yesLabel: { type: 'string', title: 'Yes Button Label', defaultValue: 'Yes - add Progesterone Capsule 100mg to cart' },
  noLabel: { type: 'string', title: 'No Button Label', defaultValue: 'No' },
  baseCheckoutUrl: { type: 'string', title: 'Checkout Base URL', defaultValue: 'https://checkout.struthealth.com/female-bhrt' },
  priceId: { type: 'string', title: 'Price ID', defaultValue: '2154' },

  answerKey: { type: 'string', title: 'Answer Key (block output alias)', defaultValue: 'progesterone' },
};

export const outputSchema = {
  choice: { type: 'string', title: 'Choice', description: '"yes" or "no" - which button was clicked' },
};