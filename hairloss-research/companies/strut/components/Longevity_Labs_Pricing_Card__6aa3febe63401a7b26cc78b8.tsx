import React, { useState, useEffect } from 'react';

/* ============================================================
   Longevity Labs Card (standalone PathwAI flow)
   ------------------------------------------------------------
   Comprehensive Longevity Panel. Checkout slug is comp-long.
   Price id depends on gender (Men / Woman) and NY / NJ:
     men   default  staging 2274 / prod 2255  $189
     men   NY/NJ    staging 2273 / prod 2239  $220
     woman default  staging 2275 / prod 2267  $189
     woman NY/NJ    staging 2276 / prod 2268  $220

   Persist key: strut.longevity.labSelection
   Window flag:  window.__STRUT_LONGEVITY_LAB__
   Pair with:    pathwai-longevity-labs-sdk.js (longevity-labs-flow)

   Scoped CSS prefix: pll-
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

/* PathwAI often strips real newlines from string props — accept | , ; and \n. */
const DEFAULT_MARKERS = [
  'Total Testosterone',
  'Free Testosterone',
  'Estradiol (Sensitive E2)',
  'LH',
  'FSH',
  'SHBG',
  'Fasting Insulin',
  'Hemoglobin A1c',
  'Lipid Panel',
  'ApoB',
  'hs-CRP',
  'TSH',
  'IGF-1',
  'Vitamin D',
  'PSA',
];

const parseItems = (str) => {
  if (!str || typeof str !== 'string') return [];
  const parts = str
    .split(/\r?\n|\||;|,/)
    .map((s) => s.trim())
    .filter(Boolean);
  /* Collapsed blob (newlines removed) → fall back to known list */
  if (parts.length <= 1 && str.replace(/\s+/g, '').length > 40) {
    return DEFAULT_MARKERS;
  }
  return parts;
};

const LONGEVITY_PANELS = [
  {
    key: 'men-default',
    gender: 'men',
    restricted: false,
    slug: 'comp-long',
    staging: 2274,
    prod: 2255,
    price: 189,
    originalPrice: 349,
    label: 'Comprehensive Longevity Panel',
    name: 'One-Time - Comprehensive Longevity Panel - Men',
  },
  {
    key: 'men-ny',
    gender: 'men',
    restricted: true,
    slug: 'comp-long',
    staging: 2273,
    prod: 2239,
    price: 220,
    originalPrice: 349,
    label: 'Comprehensive Longevity Panel',
    name: 'One-Time - NY-NJ - Men',
  },
  {
    key: 'woman-default',
    gender: 'woman',
    restricted: false,
    slug: 'comp-long',
    staging: 2275,
    prod: 2267,
    price: 189,
    originalPrice: 349,
    label: 'Comprehensive Longevity Panel',
    name: 'One-Time - Comprehensive Longevity Panel - Woman',
  },
  {
    key: 'woman-ny',
    gender: 'woman',
    restricted: true,
    slug: 'comp-long',
    staging: 2276,
    prod: 2268,
    price: 220,
    originalPrice: 349,
    label: 'Comprehensive Longevity Panel',
    name: 'One-Time - NY-NJ - Woman',
  },
];
const RESTRICTED_STATES = ['NY', 'NJ'];
const LS_KEY = 'strut.longevity.labSelection';

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

const isRestrictedState = (state) =>
  RESTRICTED_STATES.includes(String(state || resolveUserState()).trim().toUpperCase());

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
      lastGenderRaw = typeof hit.raw === 'string' ? hit.raw : hit.gender;
      return hit.gender;
    }
  } catch (_) { /* ignore */ }
  return '';
};

const resolvePanel = (state, gender) => {
  const restricted = isRestrictedState(state);
  const g = gender === 'woman' ? 'woman' : 'men';
  const key = `${g}-${restricted ? 'ny' : 'default'}`;
  return LONGEVITY_PANELS.find((p) => p.key === key) || LONGEVITY_PANELS[0];
};

const priceIdForPanel = (panel) => (isStagingEnv() ? panel.staging : panel.prod);

const slugForPanel = (panel) => panel.slug || 'comp-long';

let loggedMissingGender = false;

const formatMoney = (n) => `$${Number(n || 0)}`;

const persistLongevitySelection = (payload) => {
  try {
    if (typeof window === 'undefined') return payload;
    window.__STRUT_LONGEVITY_LAB__ = payload;
    window.strut_longevity_price_id = payload.productPriceId;
    window.localStorage.setItem(LS_KEY, JSON.stringify(payload));
    window.localStorage.setItem('Strut.LongevityLabsPriceId', JSON.stringify(payload.productPriceId));
  } catch (_) { /* ignore */ }
  return payload;
};

export default function LongevityLabsCard({
  brandColor = '#161336',
  textColor = '#0F1714',
  textMutedColor = '#6B7670',
  borderColor = '#E5E1D8',
  borderSoftColor = '#EFECE3',
  surfaceColor = '#FFFFFF',
  cardShadowOpacity = 0.06,
  selectedBorderWidth = 2,
  borderRadius = 12,

  sectionLabel = 'Your lab panel',
  panelTitle = 'Comprehensive Longevity Panel',
  panelSubnote = 'Advanced hormone, metabolic, and wellness biomarkers for a complete longevity evaluation.',
  panelBadge = 'One-time purchase',
  markersTitle = "What's included",
  markers = DEFAULT_MARKERS.join('\n'),

  processSectionLabel = 'How the process works',
  step1Title = 'Complete checkout',
  step1Description = 'Pay once for the Comprehensive Longevity Panel. You will receive lab instructions by email.',
  step2Title = 'Complete your draw',
  step2Description = 'Book a nearby appointment or visit a partner lab. Most draws take less than 15 minutes.',
  step3Title = 'Results in your account',
  step3Description = 'When results are ready, your Labs dashboard unlocks metabolic age, marker insights, and provider notes.',
  step4Title = '',
  step4Description = '',

  trust1Label = 'Clinician-reviewed results',
  trust1Icon = 'shield',
  trust2Label = 'Secure & private',
  trust2Icon = 'lock',
  trust3Label = 'One-time purchase',
  trust3Icon = 'check',

  ctaLabel = 'Get this panel',
  complianceNote = 'Lab panels are for wellness insights and are not a diagnosis. Results are reviewed in your Strut account.',

  onChange = null,
}) {
  const [userState, setUserState] = useState(() => resolveUserState());
  const [userGender, setUserGender] = useState(() => resolveUserGender());
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
  const productPriceId = priceIdForPanel(panel);
  const price = panel.price;
  const originalPrice = panel.originalPrice;
  const productSlug = slugForPanel(panel);
  const envName = isStagingEnv() ? 'staging' : 'production';
  const restricted = !!panel.restricted;
  const genderLabel = panel.gender === 'woman' ? 'Woman' : 'Men';

  const MARKERS = parseItems(markers);
  const STEPS = [
    { title: step1Title, description: step1Description },
    { title: step2Title, description: step2Description },
    { title: step3Title, description: step3Description },
    { title: step4Title, description: step4Description },
  ].filter((s) => s.title);
  const TRUST = [
    { label: trust1Label, icon: trust1Icon },
    { label: trust2Label, icon: trust2Icon },
    { label: trust3Label, icon: trust3Icon },
  ].filter((t) => t.label);

  const buildOutputs = () => {
    const payload = {
      productPriceId: Number(productPriceId) || 0,
      productSlug,
      price: Number(price) || 0,
      optionPrice: formatMoney(price),
      optionTitle: panelTitle || panel.label,
      label: panelTitle || panel.label,
      state: userState || '',
      gender: userGender || '',
      genderLabel,
      panelName: panel.name,
      restricted,
      env: envName,
      /* Aliases so older templates / SDK fallbacks still resolve */
      labPanelId: Number(productPriceId) || 0,
      labPanelPrice: Number(price) || 0,
      labPanelQuantity: 1,
      labPanelName: panelTitle || panel.label,
      skipLabPanelOrder: false,
    };
    return persistLongevitySelection(payload);
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
        price,
        gender: userGender || '(not found — still on Men panel)',
        genderRaw: lastGenderRaw,
        state: userState || '',
        env: envName,
        slug: productSlug,
        checkoutUrl: `${checkoutBase}/${productSlug}?priceId=${productPriceId}`,
      },
    );
    if (!userGender && !loggedMissingGender) {
      loggedMissingGender = true;
      let answers = null;
      try { answers = window.pathwai?.flow?.getAnswers?.(); } catch (_) { /* ignore */ }
      console.log('%c[strut] Gender not found — defaulted to Men. PathwAI answers:', 'color:#6c47ff;font-weight:bold', JSON.stringify(answers));
    }
    onChange?.(buildOutputs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productPriceId, productSlug, price, userState, userGender, restricted, envName, panelTitle, panel.name, genderLabel]);

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
      const outputs = buildOutputs();
      const w = window;

      if (typeof w.strut?.validateVisiting === 'function') {
        console.log('%c[strut] Selected panel:', 'color:#6c47ff;font-weight:bold', panel.name, {
          priceId: productPriceId,
          price,
          gender: userGender || '',
          state: userState || '',
          slug: productSlug,
        });
        await w.strut.validateVisiting(productSlug, productPriceId, { state: userState, gender: userGender || '' });
      } else if (typeof w.strut?.rememberProduct === 'function') {
        w.strut.rememberProduct(productPriceId);
      }

      const cart = w.pathwai?.cart;
      if (cart) {
        try { cart.clearCart?.(); } catch (_) { /* ignore */ }
        cart.addItem({
          id: String(productPriceId),
          name: panelTitle || panel.label,
          price: Number(price) || 0,
          quantity: 1,
          variants: [
            { name: 'Panel', value: panel.name },
            { name: 'Gender', value: genderLabel },
            { name: 'Region', value: restricted ? 'NY / NJ' : 'Standard' },
            { name: 'Type', value: 'One-time' },
          ],
        });
      }

      try {
        w.pwPushGtm?.('Added to Cart', {
          product_price_id: productPriceId,
          product_slug: productSlug,
          price,
          state: userState || '',
        });
      } catch (_) { /* ignore */ }

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

        .pll-root, .pll-root * { box-sizing: border-box; }
        .pll-root {
          --pll-brand: ${brandColor};
          --pll-text: ${textColor};
          --pll-text-muted: ${textMutedColor};
          --pll-border: ${borderColor};
          --pll-border-soft: ${borderSoftColor};
          --pll-surface: ${surfaceColor};
          --pll-radius: ${borderRadius}px;
          --pll-sel-border: ${selectedBorderWidth}px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          color: var(--pll-text);
          background: transparent;
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          padding: 16px 16px 20px 16px;
          display: flex;
          flex-direction: column;
        }

        .pll-label-row {
          font-family: 'Figtree', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          line-height: 1.33;
          text-transform: uppercase;
          color: var(--pll-text);
          margin-bottom: 14px;
        }

        .pll-card {
          position: relative;
          background: var(--pll-surface);
          border: var(--pll-sel-border) solid var(--pll-brand);
          border-radius: var(--pll-radius);
          padding: calc(18px - (var(--pll-sel-border) - 1px));
          box-shadow: ${shadowSoft};
          text-align: left;
          width: 100%;
          overflow: hidden;
          margin-bottom: 20px;
          transition: box-shadow 0.18s ease;
        }
        .pll-card:hover { box-shadow: ${shadowLift}; }

        .pll-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }
        .pll-card-left { flex: 1; min-width: 0; }

        .pll-card-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--pll-text-muted);
          margin-bottom: 6px;
        }
        .pll-card-title {
          font-family: 'Figtree', sans-serif;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.3;
          margin: 0 0 10px 0;
          color: var(--pll-text);
          letter-spacing: -0.01em;
        }

        .pll-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
        .pll-price-main {
          font-family: 'Figtree', sans-serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.01em;
          color: var(--pll-text);
          font-variant-numeric: tabular-nums;
        }
        .pll-price-original {
          font-family: 'Figtree', sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 1;
          color: var(--pll-text-muted);
          text-decoration: line-through;
          text-decoration-thickness: 1.5px;
          font-variant-numeric: tabular-nums;
          opacity: 0.75;
        }
        .pll-price-note {
          width: 100%;
          margin-top: 6px;
          font-size: 12px;
          color: var(--pll-text-muted);
        }

        .pll-subnote {
          font-size: 13px;
          font-weight: 400;
          line-height: 1.5;
          color: var(--pll-text-muted);
          margin-top: 10px;
        }

        .pll-bubble {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--pll-brand);
          color: #fff;
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.2;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .pll-markers {
          margin-top: 16px;
        }
        .pll-markers-boxed {
          background: ${hexToRgba(brandColor, 0.04)};
          border: 1px solid var(--pll-border-soft);
          border-radius: 8px;
          padding: 14px 14px 10px;
        }
        .pll-markers-title {
          font-family: 'Figtree', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin: 0 0 10px 0;
          color: var(--pll-text);
        }
        .pll-markers-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 10px;
        }
        .pll-marker-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12.5px;
          line-height: 1.4;
          color: var(--pll-text);
        }
        .pll-marker-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--pll-brand);
          margin-top: 5px;
          flex-shrink: 0;
        }

        .pll-process {
          margin-top: 16px;
        }
        .pll-process.has-divider {
          border-top: 1px solid var(--pll-border-soft);
          padding-top: 16px;
        }
        .pll-process-label {
          font-family: 'Figtree', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin: 0 0 12px 0;
          color: var(--pll-text);
        }
        .pll-process-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pll-process-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .pll-process-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--pll-brand);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .pll-process-step-title {
          font-family: 'Figtree', sans-serif;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: var(--pll-text);
        }
        .pll-process-desc {
          font-size: 12.5px;
          line-height: 1.5;
          color: var(--pll-text-muted);
          margin: 0;
        }

        .pll-cta-wrap { margin-top: 4px; margin-bottom: 18px; }
        .pll-cta {
          width: 100%;
          border: none;
          border-radius: 10px;
          background: var(--pll-brand);
          color: #fff;
          font-family: 'Figtree', sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 14px 18px;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .pll-cta:hover { opacity: 0.92; }
        .pll-cta:disabled { opacity: 0.55; cursor: not-allowed; }
        .pll-cta-error {
          color: #DC2626;
          font-size: 13px;
          margin-top: 8px;
          text-align: center;
        }

        .pll-trust {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          border-top: 1px solid var(--pll-border-soft);
          padding-top: 14px;
          margin-bottom: 12px;
        }
        .pll-trust-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: var(--pll-text-muted);
          text-align: center;
        }
        .pll-trust-label {
          font-size: 11px;
          line-height: 1.3;
          margin: 0;
        }

        .pll-compliance {
          font-size: 11.5px;
          line-height: 1.45;
          color: var(--pll-text-muted);
          text-align: center;
          margin: 0;
        }

        @media (max-width: 420px) {
          .pll-markers-list { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="pll-root">
        {sectionLabel && <div className="pll-label-row">{sectionLabel}</div>}

        <div className="pll-card" aria-label={panelTitle || panel.label}>
          <div className="pll-card-top">
            <div className="pll-card-left">
              <div className="pll-card-eyebrow">
                {`${restricted ? 'NY / NJ' : 'Standard'} · ${genderLabel}`}
              </div>
              <h3 className="pll-card-title">{panelTitle || panel.label}</h3>
              <div className="pll-price-row">
                <span className="pll-price-main">{formatMoney(price)}</span>
                {originalPrice ? (
                  <span className="pll-price-original">{formatMoney(originalPrice)}</span>
                ) : null}
                <span className="pll-price-note">One-time · no subscription</span>
              </div>
            </div>
            {panelBadge && <span className="pll-bubble">{panelBadge}</span>}
          </div>

          {panelSubnote && <div className="pll-subnote">{panelSubnote}</div>}

          {MARKERS.length > 0 && (
            <div className="pll-markers pll-markers-boxed">
              {markersTitle && <p className="pll-markers-title">{markersTitle}</p>}
              <ul className="pll-markers-list">
                {MARKERS.map((m, i) => (
                  <li key={i} className="pll-marker-item">
                    <span className="pll-marker-dot" aria-hidden="true" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {STEPS.length > 0 && (
            <div className={`pll-process ${MARKERS.length > 0 ? 'has-divider' : ''}`}>
              {processSectionLabel && <p className="pll-process-label">{processSectionLabel}</p>}
              <ol className="pll-process-list">
                {STEPS.map((step, i) => (
                  <li key={i} className="pll-process-item">
                    <span className="pll-process-num">{i + 1}</span>
                    <div>
                      <h4 className="pll-process-step-title">{step.title}</h4>
                      {step.description && <p className="pll-process-desc">{step.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="pll-cta-wrap">
          <button
            type="button"
            className="pll-cta"
            onClick={handleCtaClick}
            disabled={submitting || !productPriceId}
          >
            {submitting ? 'Adding…' : ctaLabel}
          </button>
          {saveError && <p className="pll-cta-error">{saveError}</p>}
        </div>

        {TRUST.length > 0 && (
          <div className="pll-trust">
            {TRUST.map((t, i) => (
              <div key={i} className="pll-trust-item">
                {renderIcon(t.icon)}
                <p className="pll-trust-label">{t.label}</p>
              </div>
            ))}
          </div>
        )}

        {complianceNote && <p className="pll-compliance">{complianceNote}</p>}
      </div>
    </>
  );
}

export const propSchema = {
  panelTitle: {
    type: 'string',
    title: 'Panel title',
    defaultValue: 'Comprehensive Longevity Panel',
  },
  panelSubnote: {
    type: 'string',
    title: 'Panel subnote',
    defaultValue: 'Advanced hormone, metabolic, and wellness biomarkers for a complete longevity evaluation.',
  },
  markers: {
    type: 'string',
    title: 'Included markers (newline or | separated)',
    defaultValue: DEFAULT_MARKERS.join('\n'),
  },
  ctaLabel: {
    type: 'string',
    title: 'CTA label',
    defaultValue: 'Get this panel',
  },
};

export const outputSchema = {
  productPriceId: {
    type: 'number',
    title: 'Strut productPriceId',
    description: 'Gender + state + env. Staging men 2274/2273, woman 2275/2276. Prod men 2255/2239, woman 2267/2268.',
    required: true,
  },
  productSlug: {
    type: 'string',
    title: 'Checkout product slug',
    description: 'comp-long for every gender and state variant.',
    required: true,
  },
  price: { type: 'number', title: 'Display price number', description: '189 or 220' },
  optionPrice: { type: 'string', title: 'Display price string', description: 'e.g. $189' },
  optionTitle: { type: 'string', title: 'Panel title' },
  state: { type: 'string', title: 'Resolved 2-letter state' },
  gender: { type: 'string', title: 'Resolved gender', description: 'men | woman' },
  panelName: { type: 'string', title: 'Selected panel name' },
  restricted: { type: 'boolean', title: 'NY/NJ restricted pricing' },
  env: { type: 'string', title: 'Resolved env', description: 'staging | production' },
};
