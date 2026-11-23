import React, { useState, useEffect, useMemo } from 'react';

/* ============================================================
   PURE HELPERS
============================================================ */

function effMonthlyPrice(price, monthsCount) {
  const p = Number(price) || 0;
  const m = Number(monthsCount) || 0;
  if (p <= 0 || m <= 0) return 0;
  return Math.round(p / m);
}

function calcSavingsDollars(s1Price, s1MonthsCount, sPrice, sMonthsCount) {
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

function calcDiscountPct(s1Price, s1MonthsCount, sPrice, sMonthsCount) {
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

function formatSavingsCopy(template, amount, pct) {
  const tpl = template || 'Save {amount} ({pct} off)';
  return tpl
    .replace(/\{amount\}/g, `$${amount}`)
    .replace(/\{pct\}/g, `${pct}%`);
}

function hexToRgba(hex, alpha) {
  const clean = String(hex || '').replace('#', '');
  if (clean.length !== 6) return `rgba(28, 28, 33, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function PricingCardSupply({
  /* ===== BRAND + HERO (Strut Light Canvas defaults) ===== */
  brandColor = '#1C1C21',        // --primary
  discColor = '#F1F0E8',         // --secondary (warm cream)
  bottleImageUrl = 'https://placehold.co/440x440/F1F0E8/1C1C21/png?text=Product+Image',
  imageFit = 'cover',

  /* ===== STANDARD COLOURS ===== */
  textColor = '#1C1C21',         // --foreground
  textMutedColor = '#71717a',    // --muted-foreground
  borderColor = '#EFEFEC',       // --border
  borderSoftColor = '#EFEFEC',   // --border
  controlOffColor = '#EFEFEC',   // --border

  /* ===== HOVER (Strut --accent) ===== */
  borderHoverColor = '#8399BF',  // --accent

  /* ===== SELECTED ===== */
  selectedBgColor = '#1C1C21',   // primary at low opacity = ~secondary tint
  selectedBgOpacity = 0.06,

  /* ===== COPY (TOP) — placeholders ===== */
  smallLabel = '',
  titleBase = 'Product Name',
  doseText = '',
  asLowAsPrefix = 'As low as $',
  asLowAsSuffix = '/month',
  showAsLowAs = 'true',
  asLowAsTextOverride = '',

  badge1Text = '',
  badge2Text = '',

  supplyLabel = 'Supply',

  /* ===== SUPPLY 1 ===== */
  supply1Label = '30 day supply',
  supply1Price = 25,
  supply1MonthsCount = 1,

  /* ===== SUPPLY 2 ===== */
  supply2Label = '90 day supply',
  supply2Price = 30,
  supply2MonthsCount = 3,

  /* ===== SUPPLY 3 ===== */
  supply3Label = '',
  supply3Price = 0,
  supply3MonthsCount = 6,

  /* ===== SUPPLY 4 ===== */
  supply4Label = '',
  supply4Price = 0,
  supply4MonthsCount = 12,

  defaultSupplyIndex = 2,

  /* ===== SAVINGS COPY ===== */
  savingsCopyFormat = 'Save {amount} ({pct} off)',

  /* ===== TRUST ===== */
  trustItem1 = 'Doctor consult',
  trustItem2 = 'FDA-registered pharmacy',

  /* ===== CHECKOUT ===== */
  totalLabel = 'Total today',
  ctaLabel = 'Add to cart',
  ctaBgColor = '#161336',

  borderRadius = 22,             // Strut rounded-2xl

  onCta = null,
  onChange = null,
}) {
  const showAsLowAsBool = showAsLowAs === 'true' || showAsLowAs === true;

  /* ===== BUILD SUPPLIES ARRAY ===== */
  const SUPPLIES = useMemo(() => {
    return [
      { id: 's1', label: supply1Label, price: Number(supply1Price) || 0, monthsCount: Number(supply1MonthsCount) || 1 },
      { id: 's2', label: supply2Label, price: Number(supply2Price) || 0, monthsCount: Number(supply2MonthsCount) || 1 },
      { id: 's3', label: supply3Label, price: Number(supply3Price) || 0, monthsCount: Number(supply3MonthsCount) || 1 },
      { id: 's4', label: supply4Label, price: Number(supply4Price) || 0, monthsCount: Number(supply4MonthsCount) || 1 },
    ].filter(s => s.label && s.price > 0);
  }, [
    supply1Label, supply1Price, supply1MonthsCount,
    supply2Label, supply2Price, supply2MonthsCount,
    supply3Label, supply3Price, supply3MonthsCount,
    supply4Label, supply4Price, supply4MonthsCount,
  ]);

  /* ===== STATE ===== */
  const [supplyId, setSupplyId] = useState(() => {
    const idx = Math.max(0, Math.min(SUPPLIES.length - 1, (Number(defaultSupplyIndex) || 1) - 1));
    return SUPPLIES[idx]?.id || SUPPLIES[0]?.id || 's1';
  });

  /* ===== RECOVERY ===== */
  useEffect(() => {
    if (SUPPLIES.length && !SUPPLIES.find(s => s.id === supplyId)) {
      setSupplyId(SUPPLIES[0].id);
    }
  }, [SUPPLIES, supplyId]);

  /* ===== EMPTY GUARD ===== */
  if (!SUPPLIES.length) {
    return (
      <div style={{
        padding: 24,
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#71717a',
        fontSize: 14,
        textAlign: 'center',
        border: '1px dashed #EFEFEC',
        borderRadius: 22,
      }}>
        Configure at least one supply.
      </div>
    );
  }

  /* ===== DERIVED ===== */
  const supply = SUPPLIES.find(s => s.id === supplyId) || SUPPLIES[0];
  const totalNow = supply.price;
  const monthlyEff = effMonthlyPrice(totalNow, supply.monthsCount);

  const lowestPerMonth = useMemo(() => {
    if (!SUPPLIES.length) return 0;
    return SUPPLIES.reduce((min, s) => {
      const perMo = effMonthlyPrice(s.price, s.monthsCount);
      return min === 0 ? perMo : Math.min(min, perMo);
    }, 0);
  }, [SUPPLIES]);

  const asLowAsText = asLowAsTextOverride
    ? asLowAsTextOverride
    : (lowestPerMonth > 0 ? `${asLowAsPrefix}${lowestPerMonth}${asLowAsSuffix}` : '');

  const selectedTint = hexToRgba(selectedBgColor, selectedBgOpacity);
  const selectedTintStrong = hexToRgba(selectedBgColor, Math.min(selectedBgOpacity * 2, 0.2));

  /* ===== OUTPUT EMIT ===== */
  useEffect(() => {
    if (!onChange) return;
    onChange({
      supplyId,
      supplyLabel: supply.label,
      supplyMonthsCount: supply.monthsCount,
      totalPrice: totalNow,
      effectiveMonthly: monthlyEff,
    });
  }, [supplyId, supply, totalNow, monthlyEff, onChange]);

  /* ===== CTA ===== */
  const handleCta = () => {
    if (!onCta) return;
    onCta({
      supplyId,
      supplyLabel: supply.label,
      supplyMonthsCount: supply.monthsCount,
      totalPrice: totalNow,
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

        .pcsp-root, .pcsp-root * { box-sizing: border-box; }

        /* Strut typography roles */
        .pcsp-display { font-family: 'Figtree', system-ui, sans-serif; }
        .pcsp-ui      { font-family: 'Inter', system-ui, sans-serif; }

        .pcsp-root {
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--pcsp-text);
          background: #ffffff;
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          padding: 16px 16px 220px 16px;
          display: flex;
          flex-direction: column;
        }

        /* ===== CARD (image + title only) ===== */
        .pcsp-card {
          background: #fff;
          border: 1px solid var(--pcsp-border-soft);
          border-radius: var(--pcsp-radius);
          padding: 24px 24px 24px 24px;
          margin-bottom: 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* ===== HERO (circular disc + image) ===== */
        .pcsp-hero {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
        }
        .pcsp-disc {
          width: 200px;
          height: 200px;
          max-width: 100%;
          border-radius: 999px;
          background: var(--pcsp-disc);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .pcsp-disc img {
          width: var(--pcsp-img-size, 100%);
          height: var(--pcsp-img-size, 100%);
          object-fit: var(--pcsp-img-fit, cover);
        }

        /* ===== TITLE BLOCK (Strut type scale: h3 card + eyebrow + body) ===== */

        /* Product eyebrow: 12px / 700 / uppercase / 1.33 line-height */
        .pcsp-small-label {
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.33;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--pcsp-brand);
          margin-bottom: 8px;
        }

        /* h3 card: 18 / 20 / 24, weight 500, line-height 1.2 */
        .pcsp-title {
          font-family: 'Figtree', system-ui, sans-serif;
          font-weight: 500;
          font-size: 18px;
          line-height: 1.2;
          letter-spacing: -0.01em;
          margin: 0 0 4px 0;
          color: var(--pcsp-text);
          overflow-wrap: anywhere;
        }

        /* Body: 14 / 16, weight 400, muted */
        .pcsp-dose {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.43;
          color: var(--pcsp-text-muted);
          font-weight: 400;
          margin: 0 0 8px 0;
        }

        /* Body emphasis, brand color */
        .pcsp-as-low-as {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.43;
          color: var(--pcsp-brand);
          font-weight: 500;
        }

        /* ===== BELOW CARD ===== */

        .pcsp-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }
        .pcsp-badge {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: var(--pcsp-brand);
          background: var(--pcsp-selected-bg-strong);
          padding: 4px 10px;
          border-radius: 999px;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        /* Product eyebrow style section label */
        .pcsp-label-row {
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.33;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--pcsp-text);
          margin-bottom: 10px;
        }

        /* Supply cards */
        .pcsp-supply-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .pcsp-supply {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid var(--pcsp-border);
          background: #fff;
          color: var(--pcsp-text);
          font-family: 'Inter', system-ui, sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          text-align: left;
          transition: border-color 0.15s ease, background 0.15s ease;
          width: 100%;
          min-height: 60px;
        }
        .pcsp-supply:hover { border-color: var(--pcsp-border-hover); }
        .pcsp-supply.is-selected {
          border-color: var(--pcsp-brand);
          background: var(--pcsp-selected-bg);
        }
        .pcsp-supply-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }
        .pcsp-radio {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 1.5px solid var(--pcsp-control-off);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pcsp-supply.is-selected .pcsp-radio {
          border-color: var(--pcsp-brand);
          background: var(--pcsp-brand);
        }
        .pcsp-radio-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #fff;
        }
        .pcsp-supply-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        /* Body: 14, weight 500 */
        .pcsp-supply-primary {
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 500;
          font-size: 14px;
          line-height: 1.43;
        }
        /* Body small + brand */
        .pcsp-supply-sub {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          line-height: 1.43;
          color: var(--pcsp-brand);
          font-weight: 500;
          margin-top: 2px;
        }
        /* Product title: 18 / 500 / 1.2 — Figtree (heading-y) */
        .pcsp-supply-price {
          font-family: 'Figtree', system-ui, sans-serif;
          font-weight: 500;
          font-size: 18px;
          line-height: 1.2;
          flex-shrink: 0;
        }

        /* Trust: body small */
        .pcsp-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.43;
          color: var(--pcsp-text-muted);
          font-weight: 400;
          margin-bottom: 4px;
        }

        /* ===== CHECKOUT ===== */
        .pcsp-checkout {
          padding: 4px 4px 0 4px;
        }
        .pcsp-checkout-top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        /* Product eyebrow */
        .pcsp-checkout-label {
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.33;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--pcsp-text-muted);
        }
        /* h3 large: 22 / 28 / 32, weight 500 */
        .pcsp-checkout-price {
          font-family: 'Figtree', system-ui, sans-serif;
          font-weight: 500;
          font-size: 22px;
          line-height: 1.0;
          letter-spacing: -0.01em;
        }
        .pcsp-checkout-permo {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          color: var(--pcsp-text-muted);
          font-weight: 400;
          margin-left: 8px;
          white-space: nowrap;
        }

        /* ===== CTA (Strut button: 14 / 500, primary filled) ===== */
        .pcsp-cta {
          position: relative;
          z-index: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 44px;
          padding: 0 18px;
          gap: 8px;
          appearance: none;
          -webkit-appearance: none;
          border: none;
          outline: 2px solid transparent;
          outline-offset: 2px;
          background: var(--pcsp-cta-bg);
          color: #fff;
          border-radius: 10px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.43;
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          overflow: hidden;
          transform: translateZ(0);
          transition: transform 0.15s ease, background-color 0.15s ease, opacity 0.15s ease;
        }
        .pcsp-cta:hover { opacity: 0.85; }
        .pcsp-cta:active { transform: scale(0.98); }
        .pcsp-cta:focus-visible { outline-color: var(--pcsp-border-hover); z-index: 10; }
        .pcsp-cta-arrow { display: inline-flex; align-items: center; line-height: 1; }
        @media (prefers-reduced-motion: reduce) {
          .pcsp-cta { transition: none; }
          .pcsp-cta:active { transform: none; }
        }

        /* ===== TIER 3: 381-599 (mobile default). Sticky checkout. ===== */
        .pcsp-checkout-wrap-mobile {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          z-index: 50;
          padding: 12px 16px;
          padding-bottom: calc(12px + env(safe-area-inset-bottom));
          background: #fff;
          border-top: 1px solid var(--pcsp-border-soft);
        }
        .pcsp-checkout-wrap-mobile .pcsp-checkout-inner {
          max-width: 460px;
          margin: 0 auto;
        }
        .pcsp-checkout-wrap-mobile .pcsp-checkout { padding: 0; }
        .pcsp-checkout-wrap-inline { display: none; }

        /* ===== TIER 2: 600-899. md sizes. Inline checkout. ===== */
        @media (min-width: 600px) {
          .pcsp-root { max-width: 480px; padding: 24px 16px 28px 16px; }
          .pcsp-checkout-wrap-mobile { display: none; }
          .pcsp-checkout-wrap-inline { display: block; }
          .pcsp-title { font-size: 20px; }
          .pcsp-dose { font-size: 16px; }
          .pcsp-as-low-as { font-size: 16px; }
          .pcsp-supply-primary { font-size: 16px; }
          .pcsp-supply-sub { font-size: 14px; }
          .pcsp-checkout-price { font-size: 28px; }
        }

        /* ===== TIER 1: >=900. xl sizes. ===== */
        @media (min-width: 900px) {
          .pcsp-root { max-width: 500px; padding: 32px 16px 32px 16px; }
          .pcsp-title { font-size: 24px; }
          .pcsp-checkout-price { font-size: 32px; }
        }

        /* ===== TIER 4: <=380. Tighter padding only. ===== */
        @media (max-width: 380px) {
          .pcsp-root { padding: 12px 12px 200px 12px; }
          .pcsp-card { padding: 20px 18px; }
          .pcsp-disc { width: 170px; height: 170px; }
          .pcsp-supply { padding: 12px 14px; min-height: 56px; }
          .pcsp-supply-price { font-size: 17px; }
          .pcsp-checkout-price { font-size: 20px; }
        }

        /* ===== TIER 5: <=340. Even tighter. ===== */
        @media (max-width: 340px) {
          .pcsp-root { padding: 10px 10px 200px 10px; }
          .pcsp-card { padding: 18px 14px; }
          .pcsp-disc { width: 140px; height: 140px; }
          .pcsp-title { font-size: 17px; }
          .pcsp-supply-price { font-size: 16px; }
          .pcsp-trust { flex-direction: column; gap: 6px; }
          .pcsp-checkout-price { font-size: 19px; }
        }
      `}</style>

      <div
        className="pcsp-root"
        style={{
          '--pcsp-brand': brandColor,
          '--pcsp-disc': discColor,
          '--pcsp-text': textColor,
          '--pcsp-text-muted': textMutedColor,
          '--pcsp-border': borderColor,
          '--pcsp-border-soft': borderSoftColor,
          '--pcsp-border-hover': borderHoverColor,
          '--pcsp-control-off': controlOffColor,
          '--pcsp-selected-bg': selectedTint,
          '--pcsp-selected-bg-strong': selectedTintStrong,
          '--pcsp-cta-bg': ctaBgColor,
          '--pcsp-radius': `${borderRadius}px`,
        }}
      >
        {/* ===== CARD: image + title block only ===== */}
        <div className="pcsp-card">
          <div className="pcsp-hero">
            <div
              className="pcsp-disc"
              style={{
                '--pcsp-img-fit': imageFit,
                '--pcsp-img-size': imageFit === 'cover' ? '100%' : '78%',
              }}
            >
              {bottleImageUrl && (
                <img
                  src={bottleImageUrl}
                  alt={titleBase || 'Product'}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
            </div>
          </div>

          {smallLabel && <div className="pcsp-small-label">{smallLabel}</div>}
          {titleBase && <h1 className="pcsp-title">{titleBase}</h1>}
          {doseText && <div className="pcsp-dose">{doseText}</div>}
          {showAsLowAsBool && asLowAsText && (
            <div className="pcsp-as-low-as">{asLowAsText}</div>
          )}
        </div>

        {/* ===== BELOW CARD ===== */}
        {(badge1Text || badge2Text) && (
          <div className="pcsp-badges">
            {badge1Text && <span className="pcsp-badge">{badge1Text}</span>}
            {badge2Text && <span className="pcsp-badge">{badge2Text}</span>}
          </div>
        )}

        <div className="pcsp-label-row">{supplyLabel}</div>
        <div className="pcsp-supply-list">
          {SUPPLIES.map(s => {
            const isSel = supplyId === s.id;
            const supplySavings = calcSavingsDollars(SUPPLIES[0].price, SUPPLIES[0].monthsCount, s.price, s.monthsCount);
            const supplyPct = calcDiscountPct(SUPPLIES[0].price, SUPPLIES[0].monthsCount, s.price, s.monthsCount);
            const showSavings = s.id !== SUPPLIES[0].id && supplySavings > 0;
            return (
              <button
                key={s.id}
                type="button"
                className={`pcsp-supply ${isSel ? 'is-selected' : ''}`}
                onClick={() => setSupplyId(s.id)}
                aria-pressed={isSel}
              >
                <div className="pcsp-supply-left">
                  <div className="pcsp-radio">
                    {isSel && <div className="pcsp-radio-dot" />}
                  </div>
                  <div className="pcsp-supply-text">
                    <div className="pcsp-supply-primary">{s.label}</div>
                    {showSavings && (
                      <div className="pcsp-supply-sub">
                        {formatSavingsCopy(savingsCopyFormat, supplySavings, supplyPct)}
                      </div>
                    )}
                  </div>
                </div>
                <span className="pcsp-supply-price">${s.price}</span>
              </button>
            );
          })}
        </div>

        <div className="pcsp-trust">
          {trustItem1 && <span>✓ {trustItem1}</span>}
          {trustItem2 && <span>✓ {trustItem2}</span>}
        </div>

        {/* CHECKOUT — inline (tablet+) */}
        <div className="pcsp-checkout-wrap-inline">
          <div className="pcsp-checkout">
            <div className="pcsp-checkout-top">
              <span className="pcsp-checkout-label">{totalLabel}</span>
              <span className="pcsp-checkout-price">
                ${totalNow}
                {monthlyEff > 0 && supply.monthsCount > 1 && (
                  <span className="pcsp-checkout-permo">· ${monthlyEff}/mo</span>
                )}
              </span>
            </div>
            <button type="button" className="pcsp-cta" onClick={handleCta}>
              <span>{ctaLabel}</span>
              <span className="pcsp-cta-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* CHECKOUT — sticky (mobile) */}
      <div className="pcsp-checkout-wrap-mobile">
        <div className="pcsp-checkout-inner">
          <div className="pcsp-checkout">
            <div className="pcsp-checkout-top">
              <span className="pcsp-checkout-label">{totalLabel}</span>
              <span className="pcsp-checkout-price">
                ${totalNow}
                {monthlyEff > 0 && supply.monthsCount > 1 && (
                  <span className="pcsp-checkout-permo">· ${monthlyEff}/mo</span>
                )}
              </span>
            </div>
            <button type="button" className="pcsp-cta" onClick={handleCta}>
              <span>{ctaLabel}</span>
              <span className="pcsp-cta-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   PROP SCHEMA
============================================================ */

export const propSchema = {
  /* ===== BRAND + HERO ===== */
  brandColor: { type: 'color', title: 'Brand Color (Strut --primary)', defaultValue: '#1C1C21' },
  discColor: { type: 'color', title: 'Hero Disc Background (Strut --secondary)', defaultValue: '#F1F0E8' },
  bottleImageUrl: {
    type: 'string',
    title: 'Product Image URL',
    defaultValue: 'https://placehold.co/440x440/F1F0E8/1C1C21/png?text=Product+Image',
  },
  imageFit: { type: 'enum', title: 'Image Fit', defaultValue: 'cover', options: ['cover', 'contain'] },

  /* ===== STANDARD COLOURS ===== */
  textColor: { type: 'color', title: 'Text Color (--foreground)', defaultValue: '#1C1C21' },
  textMutedColor: { type: 'color', title: 'Text Color Muted (--muted-foreground)', defaultValue: '#71717a' },
  borderColor: { type: 'color', title: 'Border Color (supply card, --border)', defaultValue: '#EFEFEC' },
  borderSoftColor: { type: 'color', title: 'Border Color (card outline)', defaultValue: '#EFEFEC' },
  controlOffColor: { type: 'color', title: 'Control Color (radio off)', defaultValue: '#EFEFEC' },
  borderHoverColor: { type: 'color', title: 'Hover Color (--accent)', defaultValue: '#8399BF' },

  /* ===== SELECTED ===== */
  selectedBgColor: { type: 'color', title: 'Selected Background Tint', defaultValue: '#1C1C21' },
  selectedBgOpacity: {
    type: 'number', title: 'Selected Background Opacity', defaultValue: 0.06, min: 0, max: 1, step: 0.01,
  },

  /* ===== COPY (TOP) ===== */
  smallLabel: { type: 'string', title: 'Pre-Title Label (optional uppercase eyebrow)', defaultValue: '' },
  titleBase: { type: 'string', title: 'Product Title', defaultValue: 'Product Name' },
  doseText: { type: 'string', title: 'Dose / Strength Line (optional)', defaultValue: '' },

  showAsLowAs: { type: 'enum', title: 'Show "As Low As" Line', defaultValue: 'true', options: ['true', 'false'] },
  asLowAsPrefix: { type: 'string', title: '"As Low As" Prefix', defaultValue: 'As low as $' },
  asLowAsSuffix: { type: 'string', title: '"As Low As" Suffix', defaultValue: '/month' },
  asLowAsTextOverride: {
    type: 'string',
    title: '"As Low As" Override (overrides auto-calc when set)',
    defaultValue: '',
  },

  badge1Text: { type: 'string', title: 'Badge 1 (optional, e.g. "Recommended")', defaultValue: '' },
  badge2Text: { type: 'string', title: 'Badge 2 (optional)', defaultValue: '' },

  supplyLabel: { type: 'string', title: 'Supply Section Label', defaultValue: 'Supply' },

  /* ===== SUPPLY 1 ===== */
  supply1Label: { type: 'string', title: 'Supply 1 — Label', defaultValue: '30 day supply' },
  supply1Price: { type: 'number', title: 'Supply 1 — Price ($)', defaultValue: 25, min: 0, step: 1 },
  supply1MonthsCount: { type: 'number', title: 'Supply 1 — Months Count', defaultValue: 1, min: 1, step: 1 },

  /* ===== SUPPLY 2 ===== */
  supply2Label: { type: 'string', title: 'Supply 2 — Label (leave empty to hide)', defaultValue: '90 day supply' },
  supply2Price: { type: 'number', title: 'Supply 2 — Price ($)', defaultValue: 30, min: 0, step: 1 },
  supply2MonthsCount: { type: 'number', title: 'Supply 2 — Months Count', defaultValue: 3, min: 1, step: 1 },

  /* ===== SUPPLY 3 ===== */
  supply3Label: { type: 'string', title: 'Supply 3 — Label (leave empty to hide)', defaultValue: '' },
  supply3Price: { type: 'number', title: 'Supply 3 — Price ($)', defaultValue: 0, min: 0, step: 1 },
  supply3MonthsCount: { type: 'number', title: 'Supply 3 — Months Count', defaultValue: 6, min: 1, step: 1 },

  /* ===== SUPPLY 4 ===== */
  supply4Label: { type: 'string', title: 'Supply 4 — Label (leave empty to hide)', defaultValue: '' },
  supply4Price: { type: 'number', title: 'Supply 4 — Price ($)', defaultValue: 0, min: 0, step: 1 },
  supply4MonthsCount: { type: 'number', title: 'Supply 4 — Months Count', defaultValue: 12, min: 1, step: 1 },

  defaultSupplyIndex: {
    type: 'number', title: 'Default Selected Supply (1-4)', defaultValue: 2, min: 1, max: 4, step: 1,
  },

  /* ===== SAVINGS COPY ===== */
  savingsCopyFormat: {
    type: 'string',
    title: 'Savings Copy ({amount} and {pct} are filled in)',
    defaultValue: 'Save {amount} ({pct} off)',
  },

  /* ===== TRUST ===== */
  trustItem1: { type: 'string', title: 'Trust Item 1', defaultValue: 'Doctor consult' },
  trustItem2: { type: 'string', title: 'Trust Item 2', defaultValue: 'FDA-registered pharmacy' },

  /* ===== CHECKOUT ===== */
  totalLabel: { type: 'string', title: 'Total Label', defaultValue: 'Total today' },
  ctaLabel: { type: 'string', title: 'CTA Label', defaultValue: 'Add to cart' },
  ctaBgColor: { type: 'color', title: 'CTA Button Color', defaultValue: '#161336' },

  borderRadius: { type: 'number', title: 'Card Border Radius (Strut --radius-2xl = 22)', defaultValue: 22, min: 0, max: 32, step: 1 },
};

/* ============================================================
   OUTPUT SCHEMA
============================================================ */

export const outputSchema = {
  type: 'object',
  fields: {
    supplyId: 'string',
    supplyLabel: 'string',
    supplyMonthsCount: 'number',
    totalPrice: 'number',
    effectiveMonthly: 'number',
  },
};

export { effMonthlyPrice, calcSavingsDollars, calcDiscountPct, formatSavingsCopy };