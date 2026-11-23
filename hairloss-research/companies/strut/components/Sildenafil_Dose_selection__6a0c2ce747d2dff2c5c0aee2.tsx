// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect, useMemo } from 'react';

/* ============================================================
   SILDENAFIL — PathwAI product selection card

   Paste into the Sildenafil PathwAI add-to-cart / product-selection card.
   Requires pathwai-sildenafil-sdk.js on the flow event.

   Price map:
     20mg   30d=54   $30     90d=55   $90
     40mg   30d=263  $40     90d=264  $96
     60mg   30d=265  $60     90d=266  $144
     80mg   30d=267  $80     90d=268  $192
     100mg  30d=269  $100    90d=270  $240

   Add to cart → strut.addToCart → validateVisiting → pathwai.flow.next()
   Do NOT call getCurrentVisiting here — that endpoint requires auth (401 before login).
============================================================ */

type StrutHost = {
  strut?: {
    ENV?: { api?: string; checkout?: string };
    validateVisiting?: (slug: string, priceId: number) => Promise<unknown>;
    skuId?: (sizeOrKey: string) => number;
    addToCart?: (priceId: number, opts?: Record<string, unknown>) => Promise<unknown>;
  };
  strut_env?: string;
  strut_sildenafil_price_id?: number;
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

const SILDENAFIL_SLUG = 'sildenafil';

const SILDENAFIL_PRICE_IDS: Record<string, number> = {
  '20mg|s1': 54,
  '20mg|s2': 55,
  '40mg|s1': 263,
  '40mg|s2': 264,
  '60mg|s1': 265,
  '60mg|s2': 266,
  '80mg|s1': 267,
  '80mg|s2': 268,
  '100mg|s1': 269,
  '100mg|s2': 270,
  'sec1-d1|s1': 54,
  'sec1-d1|s2': 55,
  'sec1-d2|s1': 263,
  'sec1-d2|s2': 264,
  'sec1-d3|s1': 265,
  'sec1-d3|s2': 266,
  'sec1-d4|s1': 267,
  'sec1-d4|s2': 268,
  'sec1-d5|s1': 269,
  'sec1-d5|s2': 270,
};

function parseMg(text: string) {
  const m = String(text || '').match(/(\d+)\s*mg/i);
  return m ? `${m[1]}mg` : '';
}

function resolveSkuKey(doseLabel: string, supplyId: string) {
  const mg = parseMg(doseLabel);
  const days = supplyId === 's2' ? '90' : '30';
  return mg ? `${mg}_${days}` : '';
}

function resolvePriceId(doseId: string, doseLabel: string, supplyId: string) {
  const mg = parseMg(doseLabel);
  const fromLabel = mg ? Number(SILDENAFIL_PRICE_IDS[`${mg}|${supplyId}`] || 0) : 0;
  if (fromLabel > 0) return fromLabel;
  const fromSlot = Number(SILDENAFIL_PRICE_IDS[`${doseId}|${supplyId}`] || 0);
  if (fromSlot > 0) return fromSlot;
  try {
    const key = resolveSkuKey(doseLabel, supplyId);
    const fromSdk = Number(host().strut?.skuId?.(key) || 0);
    if (fromSdk > 0) return fromSdk;
  } catch { /* ignore */ }
  return 0;
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
    w.location?.href || '',
  ].join(' ');
  return /strut-test/i.test(blob) || !blob;
}

/* ============================================================
   PURE HELPERS
============================================================ */

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

function hexToRgba(hex: string, alpha: number) {
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

export default function SildenafilPricingCard({
  /* ===== BRAND + HERO ===== */
  brandColor = '#1C1C21',
  discColor = '#F1F0E8',
  bottleImageUrl = 'https://placehold.co/440x440/F1F0E8/1C1C21/png?text=Sildenafil',
  imageFit = 'cover',

  /* ===== STANDARD COLOURS ===== */
  textColor = '#1C1C21',
  textMutedColor = '#71717a',
  borderColor = '#EFEFEC',
  borderSoftColor = '#EFEFEC',
  surfaceColor = '#FBFAF7',
  controlOffColor = '#EFEFEC',

  /* ===== HOVER COLOUR ===== */
  borderHoverColor = '#8399BF',

  /* ===== SELECTED COLOUR ===== */
  selectedBgColor = '#1C1C21',
  selectedBgOpacity = 0.06,

  /* ===== COPY (TOP) ===== */
  titleBase = 'Sildenafil',
  subtitle = 'Compounded by a US licensed pharmacy',
  supplyLabel = 'Supply',

  /* ===== SECTION 1 (strength) ===== */
  sec1Label = 'Strength',
  sec1Dose1Label = '20mg',
  sec1Dose1Supply1Price = 30,
  sec1Dose1Supply2Price = 90,
  sec1Dose2Label = '40mg',
  sec1Dose2Supply1Price = 40,
  sec1Dose2Supply2Price = 96,
  sec1Dose3Label = '60mg',
  sec1Dose3Supply1Price = 60,
  sec1Dose3Supply2Price = 144,
  sec1Dose4Label = '80mg',
  sec1Dose4Supply1Price = 80,
  sec1Dose4Supply2Price = 192,
  sec1Dose5Label = '100mg',
  sec1Dose5Supply1Price = 100,
  sec1Dose5Supply2Price = 240,

  /* ===== SECTION 2 (unused for sildenafil — leave empty to hide) ===== */
  sec2Label = '',
  sec2Dose1Label = '',
  sec2Dose1Supply1Price = 0,
  sec2Dose1Supply2Price = 0,
  sec2Dose2Label = '',
  sec2Dose2Supply1Price = 0,
  sec2Dose2Supply2Price = 0,
  sec2Dose3Label = '',
  sec2Dose3Supply1Price = 0,
  sec2Dose3Supply2Price = 0,
  sec2Dose4Label = '',
  sec2Dose4Supply1Price = 0,
  sec2Dose4Supply2Price = 0,
  sec2Dose5Label = '',
  sec2Dose5Supply1Price = 0,
  sec2Dose5Supply2Price = 0,

  /* ===== DEFAULT SELECTED ===== */
  defaultSection = '1',
  defaultDoseIndex = 1,

  /* ===== DISPLAY MODE (per section) ===== */
  sec1Display = 'chips',
  sec2Display = 'chips',

  /* ===== SECTION 2 VISIBILITY LINK ===== */
  sec2VisibleOnlyWhenSec1Dose = 'always',

  /* ===== SUPPLY 1 ===== */
  supply1Label = '30 day supply',
  supply1MonthsCount = 1,

  /* ===== SUPPLY 2 ===== */
  supply2Label = '90 day supply',
  supply2MonthsCount = 3,

  defaultSupplyIndex = 1,

  /* ===== SAVINGS COPY ===== */
  savingsCopyFormat = 'Save {amount} ({pct} off)',

  /* ===== TRUST ===== */
  trustItem1 = 'Doctor consult',
  trustItem2 = 'FDA-registered pharmacy',

  /* ===== CHECKOUT ===== */
  totalLabel = 'Total today',
  ctaLabel = 'Add to cart',
  ctaBgColor = '#161336',

  cardRadius = 22,
  innerRadius = 12,

  onCta = null as null | ((payload: Record<string, unknown>) => void),
  onChange = null as null | ((payload: Record<string, unknown>) => void),
}) {
  /* ===== BUILD ARRAYS FROM PROPS ===== */
  const SEC1_DOSES = useMemo(() => {
    return [
      { id: 'sec1-d1', label: sec1Dose1Label, s1: Number(sec1Dose1Supply1Price) || 0, s2: Number(sec1Dose1Supply2Price) || 0 },
      { id: 'sec1-d2', label: sec1Dose2Label, s1: Number(sec1Dose2Supply1Price) || 0, s2: Number(sec1Dose2Supply2Price) || 0 },
      { id: 'sec1-d3', label: sec1Dose3Label, s1: Number(sec1Dose3Supply1Price) || 0, s2: Number(sec1Dose3Supply2Price) || 0 },
      { id: 'sec1-d4', label: sec1Dose4Label, s1: Number(sec1Dose4Supply1Price) || 0, s2: Number(sec1Dose4Supply2Price) || 0 },
      { id: 'sec1-d5', label: sec1Dose5Label, s1: Number(sec1Dose5Supply1Price) || 0, s2: Number(sec1Dose5Supply2Price) || 0 },
    ].filter(d => d.label && (d.s1 > 0 || d.s2 > 0));
  }, [
    sec1Dose1Label, sec1Dose1Supply1Price, sec1Dose1Supply2Price,
    sec1Dose2Label, sec1Dose2Supply1Price, sec1Dose2Supply2Price,
    sec1Dose3Label, sec1Dose3Supply1Price, sec1Dose3Supply2Price,
    sec1Dose4Label, sec1Dose4Supply1Price, sec1Dose4Supply2Price,
    sec1Dose5Label, sec1Dose5Supply1Price, sec1Dose5Supply2Price,
  ]);

  const SEC2_DOSES = useMemo(() => {
    return [
      { id: 'sec2-d1', label: sec2Dose1Label, s1: Number(sec2Dose1Supply1Price) || 0, s2: Number(sec2Dose1Supply2Price) || 0 },
      { id: 'sec2-d2', label: sec2Dose2Label, s1: Number(sec2Dose2Supply1Price) || 0, s2: Number(sec2Dose2Supply2Price) || 0 },
      { id: 'sec2-d3', label: sec2Dose3Label, s1: Number(sec2Dose3Supply1Price) || 0, s2: Number(sec2Dose3Supply2Price) || 0 },
      { id: 'sec2-d4', label: sec2Dose4Label, s1: Number(sec2Dose4Supply1Price) || 0, s2: Number(sec2Dose4Supply2Price) || 0 },
      { id: 'sec2-d5', label: sec2Dose5Label, s1: Number(sec2Dose5Supply1Price) || 0, s2: Number(sec2Dose5Supply2Price) || 0 },
    ].filter(d => d.label && (d.s1 > 0 || d.s2 > 0));
  }, [
    sec2Dose1Label, sec2Dose1Supply1Price, sec2Dose1Supply2Price,
    sec2Dose2Label, sec2Dose2Supply1Price, sec2Dose2Supply2Price,
    sec2Dose3Label, sec2Dose3Supply1Price, sec2Dose3Supply2Price,
    sec2Dose4Label, sec2Dose4Supply1Price, sec2Dose4Supply2Price,
    sec2Dose5Label, sec2Dose5Supply1Price, sec2Dose5Supply2Price,
  ]);

  const SUPPLIES = useMemo(() => {
    return [
      { id: 's1', label: supply1Label, monthsCount: Number(supply1MonthsCount) || 1 },
      { id: 's2', label: supply2Label, monthsCount: Number(supply2MonthsCount) || 1 },
    ].filter(s => s.label);
  }, [supply1Label, supply1MonthsCount, supply2Label, supply2MonthsCount]);

  const ALL_DOSES = useMemo(() => [...SEC1_DOSES, ...SEC2_DOSES], [SEC1_DOSES, SEC2_DOSES]);

  /* ===== STATE ===== */
  const [selectedDoseKey, setSelectedDoseKey] = useState(() => {
    const wantSec2 = String(defaultSection) === '2';
    const targetSec = wantSec2 ? SEC2_DOSES : SEC1_DOSES;
    const idx = Math.max(0, Math.min(Math.max(0, targetSec.length - 1), (Number(defaultDoseIndex) || 1) - 1));
    return targetSec[idx]?.id || SEC1_DOSES[0]?.id || SEC2_DOSES[0]?.id || 'sec1-d1';
  });

  const [supplyId, setSupplyId] = useState(() => {
    const idx = Math.max(0, Math.min(SUPPLIES.length - 1, (Number(defaultSupplyIndex) || 1) - 1));
    return SUPPLIES[idx]?.id || SUPPLIES[0]?.id || 's1';
  });

  const [sec1SliderIdx, setSec1SliderIdx] = useState(() => {
    if (String(defaultSection) === '1') {
      return Math.max(0, Math.min(Math.max(0, SEC1_DOSES.length - 1), (Number(defaultDoseIndex) || 1) - 1));
    }
    return 0;
  });
  const [sec2SliderIdx, setSec2SliderIdx] = useState(() => {
    if (String(defaultSection) === '2') {
      return Math.max(0, Math.min(Math.max(0, SEC2_DOSES.length - 1), (Number(defaultDoseIndex) || 1) - 1));
    }
    return 1;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [ctaError, setCtaError] = useState<string | null>(null);

  /* ===== RECOVERY ===== */
  useEffect(() => {
    if (ALL_DOSES.length && !ALL_DOSES.find(d => d.id === selectedDoseKey)) {
      setSelectedDoseKey(ALL_DOSES[0].id);
    }
  }, [ALL_DOSES, selectedDoseKey]);

  useEffect(() => {
    if (SUPPLIES.length && !SUPPLIES.find(s => s.id === supplyId)) {
      setSupplyId(SUPPLIES[0].id);
    }
  }, [SUPPLIES, supplyId]);

  /* ===== DERIVED ===== */
  const selectedDose = ALL_DOSES.find(d => d.id === selectedDoseKey) || ALL_DOSES[0];
  const supply = SUPPLIES.find(s => s.id === supplyId) || SUPPLIES[0];
  const supply1 = SUPPLIES.find(s => s.id === 's1');

  const totalNow = selectedDose?.[supplyId as 's1' | 's2'] || 0;
  const monthlyEff = supply ? effMonthlyPrice(totalNow, supply.monthsCount) : 0;

  const selectedSavings = selectedDose && supply && supply1
    ? calcSavingsDollars(selectedDose.s1, supply1.monthsCount, totalNow, supply.monthsCount)
    : 0;
  const selectedDiscountPct = selectedDose && supply && supply1
    ? calcDiscountPct(selectedDose.s1, supply1.monthsCount, totalNow, supply.monthsCount)
    : 0;

  const selectedSectionId = selectedDoseKey.startsWith('sec2-') ? 2 : 1;
  const selectedSectionLabel = selectedSectionId === 2 ? sec2Label : sec1Label;
  const priceId = selectedDose
    ? resolvePriceId(selectedDose.id, selectedDose.label, supplyId)
    : 0;
  const skuKey = selectedDose ? resolveSkuKey(selectedDose.label, supplyId) : '';
  const skuLabel = selectedDose && supply
    ? `${supply.label.replace(/^(\d+)\s*day\s*supply$/i, '$1 Day Supply')} - ${selectedDose.label}`
    : 'Sildenafil';

  const sec2VisibleByLink = (() => {
    const rule = String(sec2VisibleOnlyWhenSec1Dose || 'always');
    if (rule === 'always') return true;
    if (selectedDoseKey.startsWith('sec2-')) return true;
    const linkedIdx = Number(rule);
    if (Number.isFinite(linkedIdx) && linkedIdx > 0) {
      return selectedDoseKey === `sec1-d${linkedIdx}`;
    }
    return true;
  })();

  const linkedSec1DoseId = (() => {
    const rule = String(sec2VisibleOnlyWhenSec1Dose || 'always');
    if (rule === 'always') return null;
    const idx = Number(rule);
    if (Number.isFinite(idx) && idx > 0) return `sec1-d${idx}`;
    return null;
  })();
  const isLinkedHighlight = (doseId: string) => {
    if (!linkedSec1DoseId) return false;
    if (doseId !== linkedSec1DoseId) return false;
    return selectedDoseKey.startsWith('sec2-');
  };

  const titleText = titleBase;
  const selectedTint = hexToRgba(selectedBgColor, selectedBgOpacity);

  /* ===== OUTPUT EMIT ===== */
  useEffect(() => {
    if (priceId) {
      try { host().strut_sildenafil_price_id = priceId; } catch { /* ignore */ }
    }
    if (!onChange || !selectedDose || !supply) return;
    onChange({
      doseId: selectedDoseKey,
      doseLabel: selectedDose.label,
      doseSection: selectedSectionId,
      doseSectionLabel: selectedSectionLabel,
      supplyId,
      supplyLabel: supply.label,
      supplyMonthsCount: supply.monthsCount,
      totalPrice: totalNow,
      effectiveMonthly: monthlyEff,
      savings: selectedSavings,
      discountPct: selectedDiscountPct,
      priceId,
      sku: skuKey,
      productSlug: SILDENAFIL_SLUG,
      env: isStagingEnv() ? 'staging' : 'production',
    });
  }, [
    selectedDoseKey, supplyId, selectedDose, supply, totalNow, monthlyEff,
    selectedSavings, selectedDiscountPct, selectedSectionId, selectedSectionLabel,
    priceId, skuKey, onChange,
  ]);

  /* ===== HANDLERS ===== */
  const handleCta = async () => {
    if (!selectedDose || !supply || !priceId) return;
    setCtaError(null);
    setIsLoading(true);

    const payload = {
      doseId: selectedDoseKey,
      doseLabel: selectedDose.label,
      doseSection: selectedSectionId,
      doseSectionLabel: selectedSectionLabel,
      supplyId,
      supplyLabel: supply.label,
      supplyMonthsCount: supply.monthsCount,
      totalPrice: totalNow,
      priceId,
      sku: skuKey,
      productSlug: SILDENAFIL_SLUG,
    };

    try {
      if (onCta) {
        onCta(payload);
        return;
      }

      const w = host();
      try { w.strut_sildenafil_price_id = priceId; } catch { /* ignore */ }

      if (typeof w.strut?.addToCart === 'function') {
        await w.strut.addToCart(priceId, { price: totalNow, label: skuLabel });
        return;
      }

      if (typeof w.strut?.validateVisiting !== 'function') {
        throw new Error('Sildenafil SDK not loaded — paste pathwai-sildenafil-sdk.js into the flow event');
      }

      await w.strut.validateVisiting(SILDENAFIL_SLUG, priceId);

      const cartApi = w.pathwai?.cart;
      if (cartApi?.clearCart && cartApi?.addItem) {
        cartApi.clearCart();
        cartApi.addItem({
          id: String(priceId),
          name: skuLabel,
          price: totalNow,
          quantity: 1,
          variants: [
            { name: 'Strength', value: selectedDose.label },
            { name: 'Supply', value: supply.label },
          ],
        });
      }

      try {
        w.pwPushGtm?.('Added to Cart', {
          product_name: 'Sildenafil',
          price_id: priceId,
          sku: skuKey,
          price: totalNow,
        });
      } catch { /* ignore */ }

      w.pathwai?.flow?.next?.();
    } catch (e) {
      console.error('[sildenafil] Add to cart error:', e);
      setCtaError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ===== EMPTY GUARD ===== */
  if (!ALL_DOSES.length || !SUPPLIES.length) {
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
        Configure at least one dose (in either section) and one supply.
      </div>
    );
  }

  /* ===== RENDER HELPERS ===== */
  const renderDoseRow = (doses: typeof ALL_DOSES) => (
    <div className={`pcg-dose-grid cols-${doses.length}`}>
      {doses.map(d => {
        const isSel = selectedDoseKey === d.id;
        const showAsSelected = isSel || isLinkedHighlight(d.id);
        return (
          <button
            key={d.id}
            type="button"
            className={`pcg-dose ${showAsSelected ? 'is-selected' : ''}`}
            onClick={() => setSelectedDoseKey(d.id)}
            aria-pressed={isSel}
            disabled={isLoading}
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );

  const renderDoseSlider = (
    doses: typeof ALL_DOSES,
    sliderIdx: number,
    setSliderIdx: (value: number | ((prev: number) => number)) => void,
  ) => {
    if (!doses.length) return null;
    const max = Math.max(0, doses.length - 1);
    const safeIdx = Math.max(0, Math.min(max, sliderIdx));
    const currentDose = doses[safeIdx];
    const isSelected = selectedDoseKey === currentDose.id;
    const pct = max > 0 ? (safeIdx / max) * 100 : 0;

    const trackBg = isSelected
      ? `linear-gradient(to right, var(--pcg-brand) 0%, var(--pcg-brand) ${pct}%, var(--pcg-control-off) ${pct}%, var(--pcg-control-off) 100%)`
      : `var(--pcg-control-off)`;

    return (
      <div
        className={`pcg-slider-card ${isSelected ? 'is-selected' : ''}`}
        onClick={() => setSelectedDoseKey(currentDose.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedDoseKey(currentDose.id);
          }
        }}
      >
        <div className="pcg-slider-top">
          <span className="pcg-slider-value">{currentDose.label}</span>
        </div>
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={safeIdx}
          onChange={(e) => {
            const newIdx = Number(e.target.value);
            setSliderIdx(newIdx);
            setSelectedDoseKey(doses[newIdx]?.id);
          }}
          onClick={(e) => e.stopPropagation()}
          className="pcg-slider-range"
          style={{ background: trackBg }}
          aria-label={currentDose.label}
        />
        <div
          className="pcg-slider-ticks"
          style={{ gridTemplateColumns: `repeat(${doses.length}, 1fr)` }}
        >
          {doses.map((d, i) => (
            <span
              key={d.id}
              className={`pcg-slider-tick ${i === safeIdx ? 'is-current' : ''}`}
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

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
        data-strut-sildenafil-cta=""
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
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

        .pcg-root, .pcg-root * { box-sizing: border-box; }
        .pcg-root {
          font-family: 'Inter', system-ui, sans-serif;
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

        /* ===== CARD (wraps hero + title) ===== */
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
          width: 200px;
          height: 200px;
          max-width: 100%;
          border-radius: 999px;
          background: var(--pcg-disc);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .pcg-disc img {
          width: var(--pcg-img-size, 100%);
          height: var(--pcg-img-size, 100%);
          object-fit: var(--pcg-img-fit, cover);
        }

        .pcg-title-wrap { text-align: center; }
        .pcg-title {
          font-family: 'Figtree', sans-serif;
          font-weight: 500;
          font-size: 18px;
          line-height: 1.2;
          letter-spacing: -0.01em;
          margin: 0 0 6px 0;
          color: var(--pcg-text);
          overflow-wrap: anywhere;
        }
        .pcg-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: var(--pcg-text-muted);
          font-weight: 400;
          line-height: 1.4;
        }

        /* ===== EYEBROW LABEL ===== */
        .pcg-label-row {
          font-family: 'Figtree', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          line-height: 1.33;
          text-transform: uppercase;
          color: var(--pcg-text);
          margin-bottom: 10px;
        }
        .pcg-section + .pcg-section { margin-top: 4px; }

        /* ===== DOSE CHIPS ===== */
        .pcg-dose-grid {
          display: grid;
          gap: 8px;
          margin-bottom: 20px;
        }
        .pcg-dose-grid.cols-1 { grid-template-columns: 1fr; }
        .pcg-dose-grid.cols-2 { grid-template-columns: 1fr 1fr; }
        .pcg-dose-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
        .pcg-dose-grid.cols-4 { grid-template-columns: 1fr 1fr; }
        .pcg-dose-grid.cols-5 { grid-template-columns: 1fr 1fr 1fr; }
        .pcg-dose {
          padding: 10px 8px;
          border-radius: var(--pcg-inner-radius);
          border: 1.5px solid var(--pcg-border);
          background: #fff;
          color: var(--pcg-text);
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          line-height: 1.25;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          word-break: break-word;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcg-dose:hover { border-color: var(--pcg-border-hover); }
        .pcg-dose.is-selected {
          border-color: var(--pcg-brand);
          background: var(--pcg-selected-bg);
        }
        .pcg-dose:disabled { opacity: 0.55; cursor: wait; }

        /* ===== DOSE SLIDER ===== */
        .pcg-slider-card {
          padding: 16px 18px 14px;
          border-radius: var(--pcg-inner-radius);
          border: 1.5px solid var(--pcg-border);
          background: #fff;
          margin-bottom: 20px;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcg-slider-card:hover { border-color: var(--pcg-border-hover); }
        .pcg-slider-card.is-selected {
          border-color: var(--pcg-brand);
          background: var(--pcg-selected-bg);
        }
        .pcg-slider-top {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 14px;
        }
        .pcg-slider-value {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 15px;
          color: var(--pcg-text);
        }
        .pcg-slider-card:not(.is-selected) .pcg-slider-value {
          color: var(--pcg-text-muted);
        }

        .pcg-slider-range {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
          padding: 0;
          margin: 0 0 12px 0;
          background: var(--pcg-control-off);
        }
        .pcg-slider-range::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: transparent;
        }
        .pcg-slider-range::-moz-range-track {
          height: 6px;
          border-radius: 999px;
          background: transparent;
        }
        .pcg-slider-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          margin-top: -7px;
          border-radius: 999px;
          background: var(--pcg-brand);
          border: 3px solid #fff;
          box-shadow: 0 0 0 1.5px var(--pcg-brand), 0 1px 3px rgba(0,0,0,0.1);
          cursor: grab;
          transition: transform 0.1s ease;
        }
        .pcg-slider-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: var(--pcg-brand);
          border: 3px solid #fff;
          box-shadow: 0 0 0 1.5px var(--pcg-brand), 0 1px 3px rgba(0,0,0,0.1);
          cursor: grab;
          transition: transform 0.1s ease;
        }
        .pcg-slider-range:active::-webkit-slider-thumb { cursor: grabbing; transform: scale(1.08); }
        .pcg-slider-range:active::-moz-range-thumb { cursor: grabbing; transform: scale(1.08); }

        .pcg-slider-card:not(.is-selected) .pcg-slider-range::-webkit-slider-thumb {
          background: #fff;
          box-shadow: 0 0 0 1.5px var(--pcg-control-off), 0 1px 3px rgba(0,0,0,0.08);
        }
        .pcg-slider-card:not(.is-selected) .pcg-slider-range::-moz-range-thumb {
          background: #fff;
          box-shadow: 0 0 0 1.5px var(--pcg-control-off), 0 1px 3px rgba(0,0,0,0.08);
        }

        .pcg-slider-ticks {
          display: grid;
          gap: 4px;
          padding: 0 2px;
        }
        .pcg-slider-tick {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: var(--pcg-text-muted);
          text-align: center;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pcg-slider-tick.is-current {
          color: var(--pcg-brand);
          font-weight: 600;
        }
        .pcg-slider-card:not(.is-selected) .pcg-slider-tick.is-current {
          color: var(--pcg-text-muted);
          font-weight: 500;
        }

        /* ===== SUPPLY CARDS ===== */
        .pcg-supply-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .pcg-supply {
          padding: 14px 16px;
          border-radius: var(--pcg-inner-radius);
          border: 1.5px solid var(--pcg-border);
          background: #fff;
          color: var(--pcg-text);
          font-family: 'Inter', sans-serif;
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
        .pcg-supply:hover { border-color: var(--pcg-border-hover); }
        .pcg-supply.is-selected {
          border-color: var(--pcg-brand);
          background: var(--pcg-selected-bg);
        }
        .pcg-supply:disabled { opacity: 0.55; cursor: wait; }
        .pcg-supply-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }
        .pcg-radio {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 1.5px solid var(--pcg-control-off);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pcg-supply.is-selected .pcg-radio {
          border-color: var(--pcg-brand);
          background: var(--pcg-brand);
        }
        .pcg-radio-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #fff;
        }
        .pcg-supply-text { display: flex; flex-direction: column; min-width: 0; }
        .pcg-supply-primary {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 14px;
        }
        .pcg-supply-sub {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: var(--pcg-brand);
          font-weight: 500;
          margin-top: 2px;
        }
        .pcg-supply-price {
          font-family: 'Figtree', sans-serif;
          font-weight: 500;
          font-size: 18px;
          letter-spacing: -0.01em;
          flex-shrink: 0;
        }

        /* ===== TRUST ===== */
        .pcg-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: var(--pcg-text-muted);
          margin-top: auto;
          padding-top: 8px;
          font-weight: 500;
        }
        .pcg-error {
          margin-top: 10px;
          font-size: 12.5px;
          color: #b42318;
          font-weight: 500;
          line-height: 1.4;
        }

        /* ===== CHECKOUT ===== */
        .pcg-checkout {
          padding: 14px 16px 28px 16px;
          border-top: 1px solid var(--pcg-border-soft);
          background: #fff;
        }
        .pcg-checkout-top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .pcg-checkout-label {
          font-family: 'Figtree', sans-serif;
          font-size: 12px;
          color: var(--pcg-text-muted);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-weight: 700;
          line-height: 1.33;
        }
        .pcg-checkout-price {
          font-family: 'Figtree', sans-serif;
          font-weight: 500;
          font-size: 22px;
          letter-spacing: -0.01em;
          line-height: 1.0;
        }
        .pcg-checkout-permo {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: var(--pcg-text-muted);
          font-weight: 400;
          margin-left: 6px;
          white-space: nowrap;
        }

        /* ===== CTA ===== */
        .pcg-cta {
          position: relative;
          z-index: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 44px;
          min-width: 80px;
          padding: 0 16px;
          gap: 8px;
          appearance: none;
          -webkit-appearance: none;
          border: none;
          outline: 2px solid transparent;
          outline-offset: 2px;
          background: var(--pcg-cta-bg);
          color: #fff;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          overflow: hidden;
          transform: translateZ(0);
          transition: transform 0.15s ease, background-color 0.15s ease, opacity 0.15s ease;
        }
        .pcg-cta:hover { opacity: 0.85; }
        .pcg-cta:active { transform: scale(0.97); }
        .pcg-cta:disabled { opacity: 0.55; cursor: wait; }
        .pcg-cta:focus-visible {
          outline-color: var(--pcg-border-hover);
          z-index: 10;
        }
        .pcg-cta-arrow { display: inline-flex; align-items: center; line-height: 1; }
        @media (prefers-reduced-motion: reduce) {
          .pcg-cta { transition: none; }
          .pcg-cta:active { transform: none; }
        }

        .pcg-checkout-wrap-mobile {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          z-index: 1001;
          padding-bottom: env(safe-area-inset-bottom);
          background: #fff;
        }
        .pcg-checkout-wrap-mobile .pcg-checkout-inner {
          max-width: 460px;
          margin: 0 auto;
        }
        .pcg-checkout-wrap-inline { display: none; }

        @media (min-width: 600px) {
          .pcg-root { max-width: 480px; padding: 24px 16px 28px 16px; }
          .pcg-checkout-wrap-mobile { display: none; }
          .pcg-checkout-wrap-inline { display: block; }
          .pcg-card { padding: 32px 24px 28px; }
          .pcg-title { font-size: 20px; }
          .pcg-subtitle { font-size: 14px; }
          .pcg-dose { font-size: 16px; }
          .pcg-dose-grid.cols-5 { grid-template-columns: 1fr 1fr 1fr 1fr 1fr; }
          .pcg-supply-primary { font-size: 16px; }
          .pcg-supply-sub { font-size: 13px; }
          .pcg-trust { font-size: 14px; }
          .pcg-checkout-price { font-size: 28px; }
          .pcg-checkout-permo { font-size: 14px; }
        }

        @media (min-width: 900px) {
          .pcg-root { max-width: 500px; padding: 32px 16px 32px 16px; }
          .pcg-title { font-size: 24px; }
          .pcg-checkout-price { font-size: 32px; }
        }

        @media (max-width: 380px) {
          .pcg-root { padding: 12px 12px 200px 12px; }
          .pcg-card { padding: 22px 16px 20px; }
          .pcg-disc { width: 170px; height: 170px; }
          .pcg-dose { font-size: 13.5px; padding: 11px 4px; }
          .pcg-supply { padding: 12px 14px; min-height: 56px; }
          .pcg-supply-price { font-size: 17px; }
          .pcg-checkout { padding: 12px 12px 24px 12px; }
        }

        @media (max-width: 340px) {
          .pcg-root { padding: 10px 10px 200px 10px; }
          .pcg-card { padding: 18px 14px 16px; }
          .pcg-disc { width: 140px; height: 140px; }
          .pcg-title { font-size: 17px; }
          .pcg-subtitle { font-size: 12px; }
          .pcg-dose { font-size: 13px; padding: 11px 2px; }
          .pcg-supply-primary { font-size: 13.5px; }
          .pcg-supply-price { font-size: 16px; }
          .pcg-trust { flex-direction: column; gap: 6px; }
          .pcg-checkout { padding: 10px 10px 24px 10px; }
          .pcg-checkout-price { font-size: 21px; }
          .pcg-dose-grid.cols-5 { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div
        className="pcg-root"
        data-strut-sildenafil-card=""
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
              <h1 className="pcg-title">{titleText}</h1>
              {subtitle && <div className="pcg-subtitle">{subtitle}</div>}
            </div>
          </div>

          {SEC1_DOSES.length > 0 && sec1Label && (
            <div className="pcg-section">
              <div className="pcg-label-row">{sec1Label}</div>
              {sec1Display === 'slider'
                ? renderDoseSlider(SEC1_DOSES, sec1SliderIdx, setSec1SliderIdx)
                : renderDoseRow(SEC1_DOSES)}
            </div>
          )}

          {SEC2_DOSES.length > 0 && sec2Label && sec2VisibleByLink && (
            <div className="pcg-section">
              <div className="pcg-label-row">{sec2Label}</div>
              {sec2Display === 'slider'
                ? renderDoseSlider(SEC2_DOSES, sec2SliderIdx, setSec2SliderIdx)
                : renderDoseRow(SEC2_DOSES)}
            </div>
          )}

          <div className="pcg-label-row">{supplyLabel}</div>
          <div className="pcg-supply-list">
            {SUPPLIES.map(s => {
              const isSel = supplyId === s.id;
              const price = selectedDose[s.id as 's1' | 's2'] || 0;
              const supplySavings = supply1
                ? calcSavingsDollars(selectedDose.s1, supply1.monthsCount, price, s.monthsCount)
                : 0;
              const supplyPct = supply1
                ? calcDiscountPct(selectedDose.s1, supply1.monthsCount, price, s.monthsCount)
                : 0;
              const showSavings = s.id !== 's1' && supplySavings > 0;
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

          <div className="pcg-trust">
            {trustItem1 && <span>✓ {trustItem1}</span>}
            {trustItem2 && <span>✓ {trustItem2}</span>}
          </div>

          {ctaError && <div className="pcg-error">{ctaError}</div>}
        </div>

        <div className="pcg-checkout-wrap-inline">
          {checkoutBlock(false)}
        </div>
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
        <div className="pcg-checkout-inner">
          {checkoutBlock(true)}
        </div>
      </div>
    </>
  );
}

/* ============================================================
   PROP SCHEMA
============================================================ */

export const propSchema = {
  brandColor: { type: 'color', title: 'Brand Color', defaultValue: '#1C1C21' },
  discColor: { type: 'color', title: 'Hero Disc Background', defaultValue: '#F1F0E8' },
  bottleImageUrl: {
    type: 'string',
    title: 'Bottle Image URL',
    defaultValue: 'https://placehold.co/440x440/F1F0E8/1C1C21/png?text=Sildenafil',
  },
  imageFit: { type: 'enum', title: 'Image Fit', defaultValue: 'cover', options: ['cover', 'contain'] },

  textColor: { type: 'color', title: 'Text Color', defaultValue: '#1C1C21' },
  textMutedColor: { type: 'color', title: 'Text Color (Muted)', defaultValue: '#71717a' },
  borderColor: { type: 'color', title: 'Border Color (Default)', defaultValue: '#EFEFEC' },
  borderSoftColor: { type: 'color', title: 'Border Color (Soft, dividers)', defaultValue: '#EFEFEC' },
  surfaceColor: { type: 'color', title: 'Surface Color', defaultValue: '#FBFAF7' },
  controlOffColor: { type: 'color', title: 'Control Color (radio off)', defaultValue: '#EFEFEC' },

  borderHoverColor: { type: 'color', title: 'Border Color (Hover)', defaultValue: '#8399BF' },

  selectedBgColor: { type: 'color', title: 'Selected Background Tint', defaultValue: '#1C1C21' },
  selectedBgOpacity: {
    type: 'number', title: 'Selected Background Opacity', defaultValue: 0.06, min: 0, max: 1, step: 0.01,
  },

  titleBase: { type: 'string', title: 'Product Title', defaultValue: 'Sildenafil' },
  subtitle: { type: 'string', title: 'Subtitle', defaultValue: 'Compounded by a US licensed pharmacy' },
  supplyLabel: { type: 'string', title: 'Supply Section Label', defaultValue: 'Supply' },

  sec1Label: { type: 'string', title: 'Section 1 — Header (leave empty to hide section)', defaultValue: 'Strength' },
  sec1Dose1Label: { type: 'string', title: 'Section 1 — Dose 1 Label', defaultValue: '20mg' },
  sec1Dose1Supply1Price: { type: 'number', title: 'Section 1 — Dose 1 Supply 1 Price ($)', defaultValue: 30, min: 0, step: 1 },
  sec1Dose1Supply2Price: { type: 'number', title: 'Section 1 — Dose 1 Supply 2 Price ($)', defaultValue: 90, min: 0, step: 1 },
  sec1Dose2Label: { type: 'string', title: 'Section 1 — Dose 2 Label', defaultValue: '40mg' },
  sec1Dose2Supply1Price: { type: 'number', title: 'Section 1 — Dose 2 Supply 1 Price ($)', defaultValue: 40, min: 0, step: 1 },
  sec1Dose2Supply2Price: { type: 'number', title: 'Section 1 — Dose 2 Supply 2 Price ($)', defaultValue: 96, min: 0, step: 1 },
  sec1Dose3Label: { type: 'string', title: 'Section 1 — Dose 3 Label (empty to hide)', defaultValue: '60mg' },
  sec1Dose3Supply1Price: { type: 'number', title: 'Section 1 — Dose 3 Supply 1 Price ($)', defaultValue: 60, min: 0, step: 1 },
  sec1Dose3Supply2Price: { type: 'number', title: 'Section 1 — Dose 3 Supply 2 Price ($)', defaultValue: 144, min: 0, step: 1 },
  sec1Dose4Label: { type: 'string', title: 'Section 1 — Dose 4 Label (empty to hide)', defaultValue: '80mg' },
  sec1Dose4Supply1Price: { type: 'number', title: 'Section 1 — Dose 4 Supply 1 Price ($)', defaultValue: 80, min: 0, step: 1 },
  sec1Dose4Supply2Price: { type: 'number', title: 'Section 1 — Dose 4 Supply 2 Price ($)', defaultValue: 192, min: 0, step: 1 },
  sec1Dose5Label: { type: 'string', title: 'Section 1 — Dose 5 Label (empty to hide)', defaultValue: '100mg' },
  sec1Dose5Supply1Price: { type: 'number', title: 'Section 1 — Dose 5 Supply 1 Price ($)', defaultValue: 100, min: 0, step: 1 },
  sec1Dose5Supply2Price: { type: 'number', title: 'Section 1 — Dose 5 Supply 2 Price ($)', defaultValue: 240, min: 0, step: 1 },

  sec2Label: { type: 'string', title: 'Section 2 — Header (leave empty to hide section)', defaultValue: '' },
  sec2Dose1Label: { type: 'string', title: 'Section 2 — Dose 1 Label', defaultValue: '' },
  sec2Dose1Supply1Price: { type: 'number', title: 'Section 2 — Dose 1 Supply 1 Price ($)', defaultValue: 0, min: 0, step: 1 },
  sec2Dose1Supply2Price: { type: 'number', title: 'Section 2 — Dose 1 Supply 2 Price ($)', defaultValue: 0, min: 0, step: 1 },
  sec2Dose2Label: { type: 'string', title: 'Section 2 — Dose 2 Label', defaultValue: '' },
  sec2Dose2Supply1Price: { type: 'number', title: 'Section 2 — Dose 2 Supply 1 Price ($)', defaultValue: 0, min: 0, step: 1 },
  sec2Dose2Supply2Price: { type: 'number', title: 'Section 2 — Dose 2 Supply 2 Price ($)', defaultValue: 0, min: 0, step: 1 },
  sec2Dose3Label: { type: 'string', title: 'Section 2 — Dose 3 Label (empty to hide)', defaultValue: '' },
  sec2Dose3Supply1Price: { type: 'number', title: 'Section 2 — Dose 3 Supply 1 Price ($)', defaultValue: 0, min: 0, step: 1 },
  sec2Dose3Supply2Price: { type: 'number', title: 'Section 2 — Dose 3 Supply 2 Price ($)', defaultValue: 0, min: 0, step: 1 },
  sec2Dose4Label: { type: 'string', title: 'Section 2 — Dose 4 Label (empty to hide)', defaultValue: '' },
  sec2Dose4Supply1Price: { type: 'number', title: 'Section 2 — Dose 4 Supply 1 Price ($)', defaultValue: 0, min: 0, step: 1 },
  sec2Dose4Supply2Price: { type: 'number', title: 'Section 2 — Dose 4 Supply 2 Price ($)', defaultValue: 0, min: 0, step: 1 },
  sec2Dose5Label: { type: 'string', title: 'Section 2 — Dose 5 Label (empty to hide)', defaultValue: '' },
  sec2Dose5Supply1Price: { type: 'number', title: 'Section 2 — Dose 5 Supply 1 Price ($)', defaultValue: 0, min: 0, step: 1 },
  sec2Dose5Supply2Price: { type: 'number', title: 'Section 2 — Dose 5 Supply 2 Price ($)', defaultValue: 0, min: 0, step: 1 },

  defaultSection: { type: 'enum', title: 'Default Selected Section', defaultValue: '1', options: ['1', '2'] },
  defaultDoseIndex: {
    type: 'number', title: 'Default Selected Dose Within Section (1-5)', defaultValue: 1, min: 1, max: 5, step: 1,
  },

  sec1Display: {
    type: 'enum',
    title: 'Section 1 Display Mode (chips = grid, slider = range slider)',
    defaultValue: 'chips',
    options: ['chips', 'slider'],
  },
  sec2Display: {
    type: 'enum',
    title: 'Section 2 Display Mode (chips = grid, slider = range slider)',
    defaultValue: 'chips',
    options: ['chips', 'slider'],
  },

  sec2VisibleOnlyWhenSec1Dose: {
    type: 'enum',
    title: 'Section 2 Visibility (always = always shown; 1-5 = only when that Section 1 dose is selected)',
    defaultValue: 'always',
    options: ['always', '1', '2', '3', '4', '5'],
  },

  supply1Label: { type: 'string', title: 'Supply 1 — Label', defaultValue: '30 day supply' },
  supply1MonthsCount: { type: 'number', title: 'Supply 1 — Months Count', defaultValue: 1, min: 1, step: 1 },
  supply2Label: { type: 'string', title: 'Supply 2 — Label (empty to hide)', defaultValue: '90 day supply' },
  supply2MonthsCount: { type: 'number', title: 'Supply 2 — Months Count', defaultValue: 3, min: 1, step: 1 },
  defaultSupplyIndex: {
    type: 'number', title: 'Default Selected Supply (1-2)', defaultValue: 1, min: 1, max: 2, step: 1,
  },

  savingsCopyFormat: {
    type: 'string',
    title: 'Savings Copy ({amount} and {pct} are filled in)',
    defaultValue: 'Save {amount} ({pct} off)',
  },

  trustItem1: { type: 'string', title: 'Trust Item 1', defaultValue: 'Doctor consult' },
  trustItem2: { type: 'string', title: 'Trust Item 2', defaultValue: 'FDA-registered pharmacy' },

  totalLabel: { type: 'string', title: 'Total Label', defaultValue: 'Total today' },
  ctaLabel: { type: 'string', title: 'CTA Label', defaultValue: 'Add to cart' },
  ctaBgColor: { type: 'color', title: 'CTA Button Color', defaultValue: '#161336' },
  cardRadius: { type: 'number', title: 'Card Border Radius (outer)', defaultValue: 22, min: 0, max: 32, step: 1 },
  innerRadius: { type: 'number', title: 'Inner Element Radius (chips, supply)', defaultValue: 12, min: 0, max: 24, step: 1 },
};

export const outputSchema = {
  type: 'object',
  fields: {
    doseId: 'string',
    doseLabel: 'string',
    doseSection: 'number',
    doseSectionLabel: 'string',
    supplyId: 'string',
    supplyLabel: 'string',
    supplyMonthsCount: 'number',
    totalPrice: 'number',
    effectiveMonthly: 'number',
    savings: 'number',
    discountPct: 'number',
    priceId: 'number',
    sku: 'string',
    productSlug: 'string',
    env: 'string',
  },
};

export { effMonthlyPrice, calcSavingsDollars, calcDiscountPct, formatSavingsCopy };
