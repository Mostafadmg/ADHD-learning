import React, { useState, useEffect } from 'react';

/* ============================================================
   PricingCardLabsFork (Hormone Panel)
   ------------------------------------------------------------
   Checkout slug is hormone-nynj. Price id depends on gender and NY / NJ:
     men   default  staging 2270 / prod 2254  $89
     men   NY/NJ    staging 2269 / prod 2238  $99
     woman default  staging 2271 / prod 2269  $89
     woman NY/NJ    staging 2272 / prod 2270  $99
   Pair with hormone-labs-sdk.js
   Persist key: strut.hormone.labSelection
   Scoped CSS prefix: pclf-
============================================================ */

const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== 'string') return `rgba(0,0,0,${alpha})`;
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/* Parse list from newline-separated string */
const parseItems = (str) => {
  if (!str || typeof str !== 'string') return [];
  return str.split('\n').map((s) => s.trim()).filter(Boolean);
};

/* ============================================================
   STRUT HORMONE PANEL IDS (env + state + gender)
   Match the active env only. Staging 2269/2270 are not prod 2269/2270.
============================================================ */
const HORMONE_PANELS = [
  {
    key: 'men-default',
    gender: 'men',
    restricted: false,
    slug: 'hormone-nynj',
    staging: 2270,
    prod: 2254,
    price: 89,
    name: 'One-Time - Hormone Panel - Men',
  },
  {
    key: 'men-ny',
    gender: 'men',
    restricted: true,
    slug: 'hormone-nynj',
    staging: 2269,
    prod: 2238,
    price: 99,
    name: 'One-Time - NY-NJ - Men',
  },
  {
    key: 'woman-default',
    gender: 'woman',
    restricted: false,
    slug: 'hormone-nynj',
    staging: 2271,
    prod: 2269,
    price: 89,
    name: 'One-Time - Hormone Panel - Woman',
  },
  {
    key: 'woman-ny',
    gender: 'woman',
    restricted: true,
    slug: 'hormone-nynj',
    staging: 2272,
    prod: 2270,
    price: 99,
    name: 'One-Time - NY-NJ - Woman',
  },
];
const RESTRICTED_STATES = ['NY', 'NJ'];
const LS_KEY = 'strut.hormone.labSelection';

const isStagingEnv = () => {
  if (typeof window === 'undefined') return false;
  const explicit = String(window.strut_env || '').toLowerCase();
  if (explicit === 'staging') return true;
  if (explicit === 'production' || explicit === 'prod') return false;
  const strut = window.strut;
  const blob = [
    strut?.ENV?.api || '',
    strut?.ENV?.checkout || '',
    typeof window.location !== 'undefined' ? window.location.href : '',
  ].join(' ');
  return /strut-test/i.test(blob);
};

const labPanelIdForPanel = (panel) => (isStagingEnv() ? panel.staging : panel.prod);

/* Keys this card writes. A bare men/woman on these is our own output, not the multiselect. */
const OWN_GENDER_KEYS = {
  gender: true,
  genderlabel: true,
  panelname: true,
  labpanelname: true,
  optiontitle: true,
  label: true,
};

const genderWord = (text) => {
  const n = String(text || '').trim().toLowerCase();
  if (!n || n.length > 48) return '';
  if (/one-time|panel|ny-nj|junction|longevity|hormone/.test(n)) return '';
  /* PathwAI gender choice: Male = a, Female = b (key k5b1qpf). */
  if (n === 'a' || n === 'men' || n === 'man' || n === 'male' || n === 'm') return 'men';
  if (n === 'b' || n === 'woman' || n === 'women' || n === 'female' || n === 'f') return 'woman';
  if (/\b(female|woman|women)\b/.test(n) && !/\b(male|men|man)\b/.test(n)) return 'woman';
  if (/\b(male|men|man)\b/.test(n) && !/\b(female|woman|women)\b/.test(n)) return 'men';
  return '';
};

const genderFromUnknown = (raw, depth) => {
  if (raw == null || depth > 8) return '';
  if (typeof raw === 'string') return genderToken(raw);
  if (typeof raw === 'number' || typeof raw === 'boolean') return '';
  if (Array.isArray(raw)) {
    const selected = raw.filter((item) => item && typeof item === 'object' && (item.selected === true || item.checked === true || item.isSelected === true));
    const pool = selected.length ? selected : raw;
    const tokens = [];
    for (let i = 0; i < pool.length; i += 1) {
      const item = pool[i];
      if (item && typeof item === 'object' && (item.selected === false || item.checked === false || item.isSelected === false)) continue;
      const g = genderFromUnknown(item, depth + 1);
      if (g && tokens.indexOf(g) === -1) tokens.push(g);
    }
    if (tokens.length === 1) return tokens[0];
    if (!selected.length) return '';
    return tokens[tokens.length - 1] || '';
  }
  if (typeof raw === 'object') {
    if (raw.selected === false || raw.checked === false || raw.isSelected === false) return '';
    const preferred = ['k5b1qpf', 'label', 'Label', 'text', 'Text', 'title', 'Title', 'name', 'Name', 'value', 'Value', 'answer', 'Answer', 'selectedValue', 'selectedLabel', 'selected'];
    for (let p = 0; p < preferred.length; p += 1) {
      if (raw[preferred[p]] == null) continue;
      const g = genderFromUnknown(raw[preferred[p]], depth + 1);
      if (g) return g;
    }
    const nested = [];
    const keys = Object.keys(raw);
    for (let k = 0; k < keys.length; k += 1) {
      if (preferred.indexOf(keys[k]) !== -1) continue;
      const g = genderFromUnknown(raw[keys[k]], depth + 1);
      if (g && nested.indexOf(g) === -1) nested.push(g);
    }
    return nested.length === 1 ? nested[0] : '';
  }
  return '';
};

const genderToken = (raw) => {
  if (raw == null || raw === '' || typeof raw === 'number' || typeof raw === 'boolean') return '';
  if (typeof raw !== 'string') return genderFromUnknown(raw, 0);
  const text = raw.trim();
  if (!text) return '';
  if (text.charAt(0) === '[' || text.charAt(0) === '{') {
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') return genderFromUnknown(parsed, 0);
    } catch (_) { /* plain string */ }
  }
  const parts = text.split('::');
  let found = '';
  for (let i = 0; i < parts.length; i += 1) {
    const g = genderWord(parts[i]);
    if (g) found = g;
  }
  return found;
};

/* Read the visitor's selected state (2-letter, uppercased). */
const resolveUserState = () => {
  try {
    const bags = [];
    const user = (typeof window !== 'undefined' && window.pathwai?.user?.getUser?.()) || null;
    if (user) bags.push(user, user.profile, user.profile?.address, user.answers);
    if (typeof window !== 'undefined') {
      bags.push(window.pathwai?.user?.answers, window.pathwai?.answers, window.pathwai?.user);
    }
    try {
      const persisted = JSON.parse(window.localStorage.getItem(LS_KEY) || 'null');
      if (persisted) bags.push(persisted);
    } catch (_) { /* ignore */ }
    for (const bag of bags) {
      if (!bag || typeof bag !== 'object') continue;
      const raw = bag.state || bag.State || bag.shippingState || bag.address?.state;
      if (raw) return String(raw).trim().toUpperCase();
    }
  } catch (_) { /* ignore */ }
  return '';
};

let lastGenderRaw = '';

const resolveUserGender = () => {
  lastGenderRaw = '';
  try {
    const answers = (typeof window !== 'undefined' && window.pathwai?.flow?.getAnswers?.()) || {};
    const keys = Object.keys(answers);
    const labeled = [];
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const value = answers[key];
      const ownEnum = OWN_GENDER_KEYS[String(key).toLowerCase()] && (value === 'men' || value === 'woman');
      if (ownEnum) continue;
      const g = typeof value === 'string' ? genderToken(value) : genderFromUnknown(value, 0);
      if (!g) continue;
      labeled.push({ gender: g, raw: typeof value === 'string' ? value : g });
    }
    if (labeled.length) {
      const hit = labeled[labeled.length - 1];
      lastGenderRaw = hit.raw;
      return hit.gender;
    }
  } catch (_) { /* ignore */ }
  return '';
};

const isNyNjState = (state) =>
  RESTRICTED_STATES.includes(String(state || resolveUserState()).trim().toUpperCase());

const resolvePanel = (state, gender) => {
  const restricted = isNyNjState(state);
  const g = gender === 'woman' ? 'woman' : 'men';
  const key = `${g}-${restricted ? 'ny' : 'default'}`;
  return HORMONE_PANELS.find((p) => p.key === key) || HORMONE_PANELS[0];
};

const formatMoney = (n) => `$${Number(n || 0)}`;

let loggedMissingGender = false;

const LAB_PANEL_BILLING = {
  B: { quantity: 1 },
};

const resolveLabPanelBilling = (optionId, displayedPrice) => {
  const billing = LAB_PANEL_BILLING[optionId] || {};
  const quantity = billing.quantity != null ? Number(billing.quantity) : 1;
  const unitPrice = billing.unitPrice != null ? Number(billing.unitPrice) : displayedPrice;
  return { labPanelQuantity: quantity, labPanelPrice: unitPrice };
};

const persistStrutLabSelection = (outputs) => {
  const optionId = String(outputs.labTestOptionId || '');
  const optionType = String(outputs.optionType || '');
  const isPanel = optionType === 'panel';
  const qty = Number(outputs.labPanelQuantity) || 0;
  const productPriceId = Number(outputs.productPriceId || outputs.labPanelId) || 0;
  const payload = {
    labTestOptionId: optionId,
    optionType: optionType,
    skipLabPanelOrder: !isPanel,
    labPanelId: productPriceId,
    productPriceId,
    productSlug: String(outputs.productSlug || 'hormone-nynj'),
    labPanelQuantity: qty,
    labPanelPrice: Number(outputs.labPanelPrice) || 0,
    price: Number(outputs.labPanelPrice) || 0,
    labPanelName: String(outputs.panelName || outputs.optionTitle || outputs.labPanelName || ''),
    panelName: String(outputs.panelName || ''),
    gender: String(outputs.gender || ''),
    state: String(outputs.state || ''),
    restricted: !!outputs.restricted,
  };
  try {
    if (typeof window !== 'undefined') {
      window.__STRUT_HORMONE_LAB__ = payload;
      window.strut_hormone_price_id = productPriceId;
      const raw = JSON.stringify(payload);
      window.localStorage.setItem(LS_KEY, raw);
      window.localStorage.setItem('Strut.HormoneLabsPriceId', JSON.stringify(productPriceId));
    }
  } catch (_) { /* ignore */ }
  return outputs;
};

export default function PricingCardLabsFork({
  /* ===== BRAND + THEME ===== */
  brandColor = '#161336',
  textColor = '#0F1714',
  textMutedColor = '#6B7670',
  borderColor = '#E5E1D8',
  borderSoftColor = '#EFECE3',
  surfaceColor = '#FFFFFF',
  cardShadowOpacity = 0.06,

  /* ===== SELECTION ===== */
  selectedBorderWidth = 2,

  /* ===== SECTION LABEL ===== */
  pricingSectionLabel = 'Your lab panel',

  /* ===== OPTION B: LAB PANEL ===== */
  optionBTitle = 'Hormone panel',
  optionBPrice = '$89',
  optionBOriginalPrice = '$149',
  optionBProductId = 'c5fd3651-1088-48de-8c0a-e0674ea14fe6',
  optionBSubnote = 'Includes essential hormone testing required for treatment review.',
  optionBBadge = 'One-time purchase',
  optionBMarkers = 'Total Testosterone\nFree Testosterone\nEstradiol (Sensitive E2)\nLuteinizing Hormone (LH)\nFollicle Stimulating Hormone (FSH)',

  /* ===== PANEL MARKERS ===== */
  panelMarkersTitle = "What's included",

  /* ===== PROCESS STEPS ===== */
  processSectionLabel = 'How the process works',
  step1Title = 'Complete checkout',
  step1Description = 'Pay once for the Hormone panel. You will receive lab instructions by email.',
  step2Title = 'Complete your draw',
  step2Description = 'Book a nearby appointment or visit a partner lab. Most draws take less than 15 minutes.',
  step3Title = 'Results in your account',
  step3Description = 'When results are ready, your Labs dashboard unlocks metabolic age, marker insights, and provider notes.',
  step4Title = '',
  step4Description = '',

  /* ===== TRUST FOOTER ===== */
  trust1Label = 'Clinician-reviewed results',
  trust1Icon = 'shield',
  trust2Label = 'Secure & private',
  trust2Icon = 'lock',
  trust3Label = 'One-time purchase',
  trust3Icon = 'check',

  borderRadius = 12,

  /* ===== CTA ===== */
  ctaLabel = 'Get this panel',

  /* ===== COMPLIANCE NOTE ===== */
  complianceNote = 'Lab panels are for wellness insights and are not a diagnosis. Results are reviewed in your Strut account.',

  onChange = null,
}) {
  const [userState, setUserState] = useState(() => resolveUserState());
  const [userGender, setUserGender] = useState(() => resolveUserGender());
  const [cartAdded, setCartAdded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState(null);

  /* Re-read state and gender after the state selector and gender multiselect. */
  useEffect(() => {
    const refresh = () => {
      const nextState = resolveUserState();
      const nextGender = resolveUserGender();
      setUserState((prev) => (prev === nextState ? prev : nextState));
      setUserGender((prev) => (prev === nextGender ? prev : nextGender));
    };
    refresh();
    const id = window.setInterval(refresh, 800);
    return () => window.clearInterval(id);
  }, []);

  const panel = resolvePanel(userState, userGender);
  const productPriceId = labPanelIdForPanel(panel);
  const priceNumber = panel.price;
  const priceLabel = formatMoney(priceNumber);
  const restricted = !!panel.restricted;
  const genderLabel = panel.gender === 'woman' ? 'Woman' : 'Men';
  const envName = isStagingEnv() ? 'staging' : 'production';

  const option = {
    id: 'B',
    optionType: 'panel',
    title: optionBTitle,
    subnote: optionBSubnote,
    badge: optionBBadge,
    price: priceLabel,
    originalPrice: optionBOriginalPrice,
    productId: optionBProductId,
  };

  /* Process steps */
  const STEPS = [
    { title: step1Title, description: step1Description },
    { title: step2Title, description: step2Description },
    { title: step3Title, description: step3Description },
    { title: step4Title, description: step4Description },
  ].filter((s) => s.title);

  /* Markers */
  const MARKERS_B = parseItems(optionBMarkers);

  /* Trust footer */
  const TRUST = [
    { label: trust1Label, icon: trust1Icon },
    { label: trust2Label, icon: trust2Icon },
    { label: trust3Label, icon: trust3Icon },
  ].filter((t) => t.label);

  const buildOutputs = (cartAddedFlag) => {
    const billing = resolveLabPanelBilling(option.id, priceNumber);

    return persistStrutLabSelection({
      labTestOptionId: option.id,
      labTestProductId: option.productId || '',
      optionType: option.optionType,
      optionTitle: option.title,
      optionPrice: priceLabel,
      cartAdded: !!cartAddedFlag,
      skipLabPanelOrder: false,
      productPriceId,
      productSlug: panel.slug,
      labPanelId: productPriceId,
      labPanelPrice: billing ? billing.labPanelPrice : priceNumber,
      labPanelQuantity: billing ? billing.labPanelQuantity : 1,
      labPanelName: panel.name,
      panelName: panel.name,
      gender: userGender || '',
      state: userState || '',
      restricted,
    });
  };

  useEffect(() => {
    const checkoutBase = isStagingEnv()
      ? 'https://checkout.strut-test.com'
      : 'https://checkout.struthealth.com';
    console.log(
      `%c[strut] Selected panel: ${panel.name}`,
      'color:#6c47ff;font-weight:bold',
      {
        panel: panel.name,
        priceId: productPriceId,
        price: priceNumber,
        gender: userGender || '(not found — still on Men panel)',
        genderRaw: lastGenderRaw,
        state: userState || '',
        env: envName,
        slug: panel.slug,
        checkoutUrl: `${checkoutBase}/${panel.slug}?priceId=${productPriceId}`,
      },
    );
    if (!userGender && !loggedMissingGender) {
      loggedMissingGender = true;
      let answers = null;
      try { answers = window.pathwai?.flow?.getAnswers?.(); } catch (_) { /* ignore */ }
      console.log('%c[strut] Gender not found — defaulted to Men. PathwAI answers:', 'color:#6c47ff;font-weight:bold', JSON.stringify(answers));
    }
    onChange?.(buildOutputs(cartAdded));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartAdded, userState, userGender, restricted, productPriceId, priceNumber, panel.name, envName]);

  const handleCtaClick = async (evt) => {
    if (submitting) return;
    setSaveError(null);
    setSubmitting(true);

    const stepForm = evt?.currentTarget?.closest?.('form') ?? null;
    const advance = (outputs) => {
      onChange?.(outputs);
      if (stepForm && typeof stepForm.requestSubmit === 'function') {
        stepForm.requestSubmit();
      } else {
        window.pathwai?.flow?.next?.();
      }
    };

    try {
      const outputs = buildOutputs(true);
      const w = window;
      console.log('%c[strut] Selected panel:', 'color:#6c47ff;font-weight:bold', panel.name, {
        priceId: productPriceId,
        price: priceNumber,
        gender: userGender || '',
        state: userState || '',
        slug: panel.slug,
      });
      if (typeof w.strut?.validateVisiting === 'function') {
        await w.strut.validateVisiting(panel.slug, productPriceId, {
          state: userState,
          gender: userGender || '',
        });
      } else if (typeof w.strut?.rememberProduct === 'function') {
        w.strut.rememberProduct(productPriceId);
      }

      const cart = w.pathwai?.cart;
      if (cart) {
        try { cart.clearCart?.(); } catch (_) { /* ignore */ }
        cart.addItem({
          id: String(productPriceId),
          name: option.title,
          price: priceNumber,
          quantity: 1,
          variants: [
            { name: 'Panel', value: panel.name },
            { name: 'Gender', value: genderLabel },
            { name: 'Region', value: restricted ? 'NY / NJ' : 'Standard' },
            { name: 'Type', value: 'One-time' },
          ],
        });
      }
      setCartAdded(true);
      advance(outputs);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const shadowSoft = `0 2px 8px ${hexToRgba('#000000', cardShadowOpacity)}`;
  const shadowLift = `0 6px 16px ${hexToRgba('#000000', cardShadowOpacity * 1.6)}`;

  const renderIcon = (icon) => {
    if (icon === 'shield') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 1L3 5V11C3 16.55 7.84 21.74 12 23C16.16 21.74 21 16.55 21 11V5L12 1Z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    }
    if (icon === 'lock') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 11H5C3.9 11 3 11.9 3 13V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V13C21 11.9 20.1 11 19 11Z"
            stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    }
    if (icon === 'check') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M7 12L10.5 15.5L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return null;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .pclf-root, .pclf-root * { box-sizing: border-box; }
        .pclf-root {
          --pclf-brand: ${brandColor};
          --pclf-text: ${textColor};
          --pclf-text-muted: ${textMutedColor};
          --pclf-border: ${borderColor};
          --pclf-border-soft: ${borderSoftColor};
          --pclf-surface: ${surfaceColor};
          --pclf-radius: ${borderRadius}px;
          --pclf-sel-border: ${selectedBorderWidth}px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          color: var(--pclf-text);
          background: transparent;
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          padding: 16px 16px 20px 16px;
          display: flex;
          flex-direction: column;
        }

        /* ===== SECTION LABEL ===== */
        .pclf-label-row {
          font-family: 'Figtree', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          line-height: 1.33;
          text-transform: uppercase;
          color: var(--pclf-text);
          margin-bottom: 14px;
        }

        /* ===== CARD ===== */
        .pclf-card {
          position: relative;
          background: var(--pclf-surface);
          border: var(--pclf-sel-border) solid var(--pclf-brand);
          border-radius: var(--pclf-radius);
          padding: calc(18px - (var(--pclf-sel-border) - 1px));
          box-shadow: ${shadowSoft};
          text-align: left;
          width: 100%;
          overflow: hidden;
          margin-bottom: 20px;
          transition: box-shadow 0.18s ease;
        }
        .pclf-card:hover { box-shadow: ${shadowLift}; }

        .pclf-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }
        .pclf-card-left { flex: 1; min-width: 0; }

        .pclf-card-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--pclf-text-muted);
          margin-bottom: 6px;
        }
        .pclf-card-title {
          font-family: 'Figtree', sans-serif;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.3;
          margin: 0 0 10px 0;
          color: var(--pclf-text);
          letter-spacing: -0.01em;
        }

        .pclf-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
        .pclf-price-main {
          font-family: 'Figtree', sans-serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.01em;
          color: var(--pclf-text);
          font-variant-numeric: tabular-nums;
        }
        .pclf-price-original {
          font-family: 'Figtree', sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 1;
          color: var(--pclf-text-muted);
          text-decoration: line-through;
          text-decoration-thickness: 1.5px;
          font-variant-numeric: tabular-nums;
          opacity: 0.75;
        }
        .pclf-price-note {
          width: 100%;
          margin-top: 6px;
          font-size: 12px;
          color: var(--pclf-text-muted);
        }

        .pclf-subnote {
          font-size: 13px;
          font-weight: 400;
          line-height: 1.5;
          color: var(--pclf-text-muted);
          margin-top: 10px;
        }

        /* ===== BUBBLE ===== */
        .pclf-bubble {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--pclf-brand);
          color: #fff;
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.2;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ===== MARKERS LIST ===== */
        .pclf-markers {
          margin-top: 16px;
        }
        .pclf-markers-boxed {
          background: ${hexToRgba(brandColor, 0.04)};
          border: 1px solid var(--pclf-border-soft);
          border-radius: 8px;
          padding: 14px 14px 10px;
        }
        .pclf-markers-title {
          font-family: 'Figtree', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin: 0 0 10px 0;
          color: var(--pclf-text);
        }
        .pclf-markers-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 10px;
        }
        .pclf-marker-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12.5px;
          line-height: 1.4;
          color: var(--pclf-text);
        }
        .pclf-marker-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--pclf-brand);
          margin-top: 5px;
          flex-shrink: 0;
        }

        /* ===== PROCESS LIST ===== */
        .pclf-process {
          margin-top: 16px;
        }
        .pclf-process.has-divider {
          border-top: 1px solid var(--pclf-border-soft);
          padding-top: 16px;
        }
        .pclf-process-label {
          font-family: 'Figtree', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin: 0 0 12px 0;
          color: var(--pclf-text);
        }
        .pclf-process-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pclf-process-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .pclf-process-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--pclf-brand);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .pclf-process-step-title {
          font-family: 'Figtree', sans-serif;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: var(--pclf-text);
        }
        .pclf-process-desc {
          font-size: 12.5px;
          line-height: 1.5;
          color: var(--pclf-text-muted);
          margin: 0;
        }

        /* ===== CTA BUTTON ===== */
        .pclf-cta-wrap { margin-top: 4px; margin-bottom: 18px; }
        .pclf-cta {
          width: 100%;
          border: none;
          border-radius: 10px;
          background: var(--pclf-brand);
          color: #fff;
          font-family: 'Figtree', sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 14px 18px;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .pclf-cta:hover { opacity: 0.92; }
        .pclf-cta:disabled { opacity: 0.55; cursor: not-allowed; }
        .pclf-cta-error {
          color: #DC2626;
          font-size: 13px;
          margin-top: 8px;
          text-align: center;
        }

        /* ===== TRUST FOOTER ===== */
        .pclf-trust {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          border-top: 1px solid var(--pclf-border-soft);
          padding-top: 14px;
          margin-bottom: 12px;
        }
        .pclf-trust-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: var(--pclf-text-muted);
          text-align: center;
        }
        .pclf-trust-label {
          font-size: 11px;
          line-height: 1.3;
          margin: 0;
        }

        /* ===== COMPLIANCE NOTE ===== */
        .pclf-compliance {
          font-size: 11.5px;
          line-height: 1.45;
          color: var(--pclf-text-muted);
          text-align: center;
          margin: 0;
        }

        @media (max-width: 420px) {
          .pclf-markers-list { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pclf-card { transition: none; }
          .pclf-cta { transition: none; }
          .pclf-cta:active { transform: none; }
        }
      `}</style>

      <div className="pclf-root">
        {/* ===== SECTION LABEL ===== */}
        {pricingSectionLabel && <div className="pclf-label-row">{pricingSectionLabel}</div>}

        {/* ===== PANEL CARD ===== */}
        <div className="pclf-card" aria-label={option.title}>
          <div className="pclf-card-top">
            <div className="pclf-card-left">
              <div className="pclf-card-eyebrow">
                {`${restricted ? 'NY / NJ' : 'Standard'} · ${genderLabel}`}
              </div>
              <h3 className="pclf-card-title">{option.title}</h3>
              {(option.price || option.originalPrice) && (
                <div className="pclf-price-row">
                  {option.price && <span className="pclf-price-main">{option.price}</span>}
                  {option.originalPrice && (
                    <span className="pclf-price-original">{option.originalPrice}</span>
                  )}
                  <span className="pclf-price-note">One-time · no subscription</span>
                </div>
              )}
            </div>

            {option.badge && <span className="pclf-bubble">{option.badge}</span>}
          </div>

          {option.subnote && <div className="pclf-subnote">{option.subnote}</div>}

          {MARKERS_B.length > 0 && (
            <div className="pclf-markers pclf-markers-boxed">
              {panelMarkersTitle && <p className="pclf-markers-title">{panelMarkersTitle}</p>}
              <ul className="pclf-markers-list">
                {MARKERS_B.map((m, i) => (
                  <li key={i} className="pclf-marker-item">
                    <span className="pclf-marker-dot" aria-hidden="true" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {STEPS.length > 0 && (
            <div className={`pclf-process ${MARKERS_B.length > 0 ? 'has-divider' : ''}`}>
              {processSectionLabel && <p className="pclf-process-label">{processSectionLabel}</p>}
              <ol className="pclf-process-list">
                {STEPS.map((step, i) => (
                  <li key={i} className="pclf-process-item">
                    <span className="pclf-process-num">{i + 1}</span>
                    <div>
                      <h4 className="pclf-process-step-title">{step.title}</h4>
                      {step.description && <p className="pclf-process-desc">{step.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* ===== CTA BUTTON ===== */}
        {ctaLabel && (
          <div className="pclf-cta-wrap">
            <button
              type="button"
              className="pclf-cta"
              onClick={handleCtaClick}
              disabled={submitting}
            >
              {submitting ? 'Adding…' : ctaLabel}
            </button>
            {saveError && <p className="pclf-cta-error">{saveError}</p>}
          </div>
        )}

        {/* ===== TRUST FOOTER ===== */}
        {TRUST.length > 0 && (
          <div className="pclf-trust">
            {TRUST.map((t, i) => (
              <div key={i} className="pclf-trust-item">
                {renderIcon(t.icon)}
                <p className="pclf-trust-label">{t.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ===== COMPLIANCE FOOTER NOTE ===== */}
        {complianceNote && <p className="pclf-compliance">{complianceNote}</p>}
      </div>
    </>
  );
}

export const propSchema = {
  optionBPrice: {
    type: 'string',
    title: 'Hormone Panel Price',
    description: 'Fallback label only. The card shows $89, or $99 for NY / NJ.',
    defaultValue: '$89',
  },
  optionBProductId: {
    type: 'string',
    title: 'Hormone Panel Product ID',
    description: 'Junction lab_test_id for Hormone Panel',
    defaultValue: 'c5fd3651-1088-48de-8c0a-e0674ea14fe6',
  },
  ctaLabel: {
    type: 'string',
    title: 'CTA label',
    defaultValue: 'Get this panel',
  },
};

export const outputSchema = {
  labTestOptionId: {
    type: 'string',
    title: 'Selected Option ID',
    description: 'Always "B" for Hormone Panel.',
    required: true,
  },
  labTestProductId: { type: 'string', title: 'Selected Junction Lab Test ID', description: 'Junction lab_test_id for the Hormone panel' },
  optionType:  { type: 'string',  title: 'Selected Option Type',  description: 'panel' },
  optionTitle: { type: 'string',  title: 'Selected Option Title', description: 'Display name of the panel' },
  optionPrice: { type: 'string',  title: 'Selected Option Price', description: 'Price string of the panel' },
  cartAdded:   { type: 'boolean', title: 'Cart Added',             description: 'True when panel is added to cart' },
  skipLabPanelOrder: { type: 'boolean', title: 'Skip Strut lab order', description: 'Always false for panel' },
  labPanelId:  { type: 'number',  title: 'Strut lab panel id',     description: 'Gender + state + env. Staging men 2270/2269, woman 2271/2272. Prod men 2254/2238, woman 2269/2270.' },
  labPanelPrice:    { type: 'number', title: 'Lab panel unit price', description: 'UNIT price Strut charges.' },
  labPanelQuantity: { type: 'number', title: 'Lab panel quantity',   description: 'Units Strut bills.' },
  state: { type: 'string', title: 'Resolved 2-letter state' },
  gender: { type: 'string', title: 'Resolved gender', description: 'men | woman' },
  panelName: { type: 'string', title: 'Selected panel name' },
  restricted: { type: 'boolean', title: 'NY/NJ restricted pricing' },
};