// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect, useMemo, useRef } from 'react';

/* ============================================================
   ORAL MINOXIDIL MEN — PathwAI pricing card

   Paste into the Minoxidil PathwAI product-selection card.
   Requires pathwai-minoxidil-sdk.js on the flow event.

   Staging (checkout.strut-test.com/oral_minoxidil_men):
     dose_2_5   priceId 2256  $65  90 Day Supply - 2.5 mg
     dose_1_25  priceId 2257  $55  90 Day Supply - 2.5 mg (1.25mg)
   Production (checkout.struthealth.com/oral_minoxidil_men):
     dose_2_5   priceId 797   $65  90 Day Supply - 2.5 mg
     dose_1_25  priceId 798   $55  90 Day Supply - 2.5 mg (1.25mg)

   Env: window.strut_env = 'staging' | 'production' (set in pathwai-minoxidil-sdk.js).

   Add to cart → strut.addToCart → validateVisiting → pathwai.flow.next()
   Do NOT call getCurrentVisiting here — that endpoint requires auth (401 before login).
   Order is created after the auth card via getCurrentVisiting.

   Promo codes are read from the URL (?promo= or ?coupon=), session storage, or the
   field on this card, then checked once when Apply is clicked. A valid code is priced
   for every dose on this card. Changing dose uses that result and does not ask
   the server again. The discount never drops a price below $0. A code the backend
   rejects keeps base pricing and does not block Add to cart. The cart shows the
   discounted price. The order line stays at the catalog price, and ApplyPromoCode
   is the only deduction stored on the order.
============================================================ */

type StrutHost = {
  strut?: {
    ENV?: { api?: string; checkout?: string };
    validateVisiting?: (slug: string, priceId: number, opts?: { coupon?: string | null }) => Promise<unknown>;
    previewPromoCode?: (promoCode: string, productPriceId: number) => Promise<Record<string, unknown>>;
    skuId?: (sizeOrKey: string) => number;
    addToCart?: (priceId: number, opts?: Record<string, unknown>) => Promise<unknown>;
  };
  strut_env?: string;
  strut_minoxidil_price_id?: number;
  pathwai?: {
    flow?: {
      next?: (val?: unknown) => void;
      setVariable?: (name: string, value: unknown) => void;
      getAnswers?: () => Record<string, any>;
    };
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

function syncPathwaiProductDisplay(data: Record<string, unknown>) {
  const w = window as any;
  if (typeof w.pathwai?.persistProductDisplay === 'function') {
    w.pathwai.persistProductDisplay(data);
    return;
  }
  try {
    const coupon = String(data.coupon ?? data.couponCode ?? '').trim();
    const discount = Number(data.discount ?? data.discountAmount ?? 0);
    const listPrice = Number(data.listPrice ?? data.variantPrice ?? 0);
    const price = Number(data.price ?? data.totalPrice ?? listPrice);

    w.__PATHWAI_PRODUCT_DISPLAY__ = {
      productTitle: String(data.productTitle ?? data.formulationLabel ?? '').trim(),
      productSubtitle: String(data.productSubtitle ?? data.subtitle ?? '').trim(),
      audienceLabel: String(data.audienceLabel ?? '').trim(),
      subAxisLabel: String(data.subAxisLabel ?? '').trim(),
      variantLabel: String(data.variantLabel ?? '').trim(),
      variantId: String(data.variantId ?? data.formulationKey ?? '').trim(),
      priceId: Number(data.priceId ?? 0),
      price,
      totalPrice: price,
      listPrice,
      variantPrice: listPrice,
      discount,
      discountAmount: discount,
      coupon,
      couponCode: coupon,
      productSlug: String(data.productSlug ?? '').trim(),
    };
    window.localStorage.setItem('pathwai.productDisplay', JSON.stringify(w.__PATHWAI_PRODUCT_DISPLAY__));
  } catch { /* ignore */ }
}

const MINOXIDIL_SLUG = 'oral_minoxidil_men';

type DoseKey = 'dose_2_5' | 'dose_1_25';

type DoseCatalogRow = {
  priceId: number;
  price: number;
  key: DoseKey;
  doseLabel: string;
  supplyLabel: string;
};

function formatDoseVariantLabel(row: Pick<DoseCatalogRow, 'doseLabel' | 'supplyLabel'>) {
  const dose = String(row.doseLabel || '').trim();
  const supply = String(row.supplyLabel || '').trim();
  if (dose && supply) return `${dose} · ${supply}`;
  return dose || supply;
}

const MINOXIDIL_CATALOG: {
  staging: Record<DoseKey, DoseCatalogRow>;
  production: Record<DoseKey, DoseCatalogRow>;
} = {
  staging: {
    dose_2_5: {
      priceId: 2256,
      price: 65,
      key: 'dose_2_5',
      doseLabel: '2.5 mg',
      supplyLabel: '90 Day Supply',
    },
    dose_1_25: {
      priceId: 2257,
      price: 55,
      key: 'dose_1_25',
      doseLabel: '2.5 mg (1.25mg)',
      supplyLabel: '90 Day Supply',
    },
  },
  production: {
    dose_2_5: {
      priceId: 797,
      price: 65,
      key: 'dose_2_5',
      doseLabel: '2.5 mg',
      supplyLabel: '90 Day Supply',
    },
    dose_1_25: {
      priceId: 798,
      price: 55,
      key: 'dose_1_25',
      doseLabel: '2.5 mg (1.25mg)',
      supplyLabel: '90 Day Supply',
    },
  },
};

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

function validateVisitingSlug(_priceId: number): string {
  return MINOXIDIL_SLUG;
}

function resolvePriceId(formula: DoseKey): number {
  const row = catalogForEnv()[formula];
  const fromCatalog = Number(row?.priceId || 0);
  if (fromCatalog > 0) return fromCatalog;
  try {
    const fromSdk = Number(host().strut?.skuId?.(formula) || 0);
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

const PROMO_SESSION_KEY = 'strut.minoxidil.promo';
const PROMO_SESSION_ALIASES = ['promo', 'coupon', 'promoCode', 'coupon_code', 'strut.promo', 'strut.coupon', 'strut.finasteride.promo'];

type PromoRule = (
  | { mode: 'pct'; value: number; maxDiscount?: number | null }
  | { mode: 'fix'; value: number }
  | { mode: 'override'; value: number }
) & { onlyPriceId?: number };

function formatMoney(amount: number) {
  const n = Number(amount || 0);
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

function ruleFromPreview(res: Record<string, unknown> | null | undefined): PromoRule | null {
  if (!res) return null;
  const valid = res.valid === true || res.Valid === true;
  if (!valid) return null;
  const mode = String(res.mode || res.Mode || '').toLowerCase();
  const value = Number(res.value ?? res.Value);
  if (!Number.isFinite(value) || value < 0) return null;
  const onlyRaw = Number(res.onlyPriceId ?? res.OnlyPriceId ?? 0);
  const onlyPriceId = onlyRaw > 0 ? onlyRaw : undefined;
  if (mode === 'pct') {
    if (value <= 0 || value > 100) return null;
    const maxRaw = res.maxDiscount ?? res.MaxDiscount;
    const maxDiscount = maxRaw == null || maxRaw === '' ? null : Number(maxRaw);
    return { mode: 'pct', value, maxDiscount: maxDiscount && maxDiscount > 0 ? maxDiscount : null, onlyPriceId };
  }
  if (mode === 'fix') {
    if (value <= 0) return null;
    return { mode: 'fix', value, onlyPriceId };
  }
  if (mode === 'override') return { mode: 'override', value, onlyPriceId };
  return null;
}

function quotePrice(list: number, rule: PromoRule | null, priceId?: number) {
  const base = Number(list || 0);
  if (!rule) return { base, final: base, tag: '', save: 0 };
  if (rule.onlyPriceId && Number(priceId || 0) !== Number(rule.onlyPriceId)) {
    return { base, final: base, tag: '', save: 0 };
  }
  if (rule.mode === 'pct') {
    let save = Math.max(0, Math.round(base * (rule.value / 100) * 100) / 100);
    if (rule.maxDiscount && rule.maxDiscount > 0) save = Math.min(save, rule.maxDiscount);
    save = Math.min(save, Math.max(0, base));
    const final = Math.max(0, Math.round((base - save) * 100) / 100);
    return { base, final, tag: save > 0 ? `${rule.value}% off applied` : '', save };
  }
  if (rule.mode === 'override') {
    const final = Math.max(0, Math.round(Number(rule.value) * 100) / 100);
    const save = Math.max(0, Math.round((base - final) * 100) / 100);
    const offLabel = Number.isInteger(save) ? String(save) : save.toFixed(2);
    return { base, final, tag: save > 0 ? `−$${offLabel}` : '', save };
  }
  const off = Math.min(rule.value, Math.max(0, base));
  const final = Math.max(0, Math.round((base - off) * 100) / 100);
  const save = Math.max(0, Math.round((base - final) * 100) / 100);
  const offLabel = Number.isInteger(off) ? String(off) : off.toFixed(2);
  return { base, final, tag: save > 0 ? `−$${offLabel}` : '', save };
}

function bannerDetail(rule: PromoRule) {
  const scope = rule.onlyPriceId ? 'the selected dose.' : 'every dose.';
  if (rule.mode === 'pct') return `${rule.value}% off applied on ${scope}`;
  if (rule.mode === 'override') return `Special price applied on ${scope}`;
  const label = Number.isInteger(rule.value) ? String(rule.value) : rule.value.toFixed(2);
  return `$${label} off applied on ${scope}`;
}

function moneyClose(a: number, b: number, eps = 0.02) {
  return Math.abs(a - b) <= eps;
}

type PromoSample = { priceId: number; list: number; discount: number };

function inferUniversalRule(samples: PromoSample[]): PromoRule | null {
  const rows = samples.filter((s) => s.list > 0 && s.discount > 0);
  if (!rows.length) return null;
  if (rows.length < 2) {
    return { mode: 'fix', value: Math.round(rows[0].discount * 100) / 100 };
  }
  const discounts = rows.map((s) => Math.round(s.discount * 100) / 100);
  const ratios = rows.map((s) => s.discount / s.list);
  const finals = rows.map((s) => Math.max(0, Math.round((s.list - s.discount) * 100) / 100));
  const same = (vals: number[], eps: number) => vals.every((n) => moneyClose(n, vals[0], eps));
  if (same(ratios, 0.015)) {
    const raw = ratios[0] * 100;
    const value = Math.abs(raw - Math.round(raw)) < 0.2 ? Math.round(raw) : Math.round(raw * 10) / 10;
    if (value > 0 && value <= 100) return { mode: 'pct', value };
  }
  if (same(discounts, 0.01)) return { mode: 'fix', value: discounts[0] };
  if (same(finals, 0.01)) return { mode: 'override', value: finals[0] };
  return null;
}

function quotesFromSamples(samples: PromoSample[]) {
  const out: Record<number, { base: number; final: number; tag: string; save: number }> = {};
  samples.forEach((s) => {
    const save = Math.min(Math.max(0, s.discount), Math.max(0, s.list));
    const final = Math.max(0, Math.round((s.list - save) * 100) / 100);
    const offLabel = Number.isInteger(save) ? String(save) : save.toFixed(2);
    out[s.priceId] = { base: s.list, final, tag: save > 0 ? `−$${offLabel}` : '', save };
  });
  return out;
}

function discountSample(body: Record<string, unknown> | null | undefined, fallbackList: number) {
  const discount = Number(body?.OrderDiscount ?? body?.orderDiscount ?? 0);
  const listRaw = Number(body?.Price ?? body?.price ?? fallbackList);
  const list = listRaw > 0 ? listRaw : fallbackList;
  const ok = body?.IsAppliedPromoCode === true || body?.isAppliedPromoCode === true || discount > 0;
  return { ok, discount, list };
}

function promoApiMessage(err: unknown) {
  const body = (err as { body?: unknown })?.body;
  if (typeof body === 'string' && body.trim() && body.trim().charAt(0) !== '<') return body.trim();
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>;
    const message = record.Message || record.message;
    if (message && String(message).trim()) return String(message).trim();
  }
  return '';
}

function rememberPromoCode(code: string) {
  try {
    window.sessionStorage.setItem('promo', code);
    window.sessionStorage.setItem('coupon', code);
    window.sessionStorage.setItem('coupon_code', code);
    window.sessionStorage.setItem(PROMO_SESSION_KEY, JSON.stringify({ code, coupon: code, couponCode: code }));
  } catch { /* ignore */ }
}

async function confirmPromoForSupplies(
  code: string,
  rows: { priceId: number; list: number }[],
  selectedPriceId: number,
): Promise<Record<string, unknown>> {
  const strut = host().strut as (NonNullable<ReturnType<typeof host>['strut']> & {
    confirmPromoCode?: (promoCode: string, productPriceId: number) => Promise<Record<string, unknown>>;
    isLogged?: () => Promise<number>;
    getOrderId?: () => number | undefined;
    getOrder?: () => { Cart?: { ProductPriceId?: number } } | null;
    getCurrentVisiting?: () => Promise<unknown>;
    saveDosage?: (productPriceId: number) => Promise<unknown>;
    applyPromoCode?: (promoCode: string) => Promise<Record<string, unknown>>;
    getCartItem?: () => Promise<Record<string, unknown>>;
  }) | undefined;

  const selected = rows.find((row) => row.priceId === selectedPriceId) || rows[0];
  if (!selected) {
    return { valid: false, message: 'Promo code is invalid or expired.' };
  }

  if (typeof strut?.previewPromoCode === 'function') {
    try {
      const preview = await strut.previewPromoCode(code, selected.priceId);
      const accepted = preview?.valid === true || preview?.Valid === true;
      if (accepted) {
        const next = { ...preview };
        delete next.onlyPriceId;
        delete next.OnlyPriceId;
        return next;
      }
      return preview;
    } catch (err) {
      if (Number((err as { status?: number })?.status) !== 404) throw err;
    }
  }

  if (typeof strut?.applyPromoCode !== 'function') {
    const missing = new Error('Promo check is not available');
    (missing as { status?: number }).status = 404;
    throw missing;
  }

  let logged = 0;
  try { logged = Number(await strut.isLogged?.()); } catch { logged = 0; }
  if (!logged) {
    const signedOut = new Error('Not signed in');
    (signedOut as { status?: number }).status = 401;
    throw signedOut;
  }

  if (typeof strut.validateVisiting === 'function') {
    await strut.validateVisiting(validateVisitingSlug(selected.priceId), selected.priceId, { coupon: code });
  }
  if (!Number(strut.getOrderId?.() || 0) && typeof strut.getCurrentVisiting === 'function') {
    await strut.getCurrentVisiting();
  } else if (typeof strut.saveDosage === 'function') {
    const current = Number(strut.getOrder?.()?.Cart?.ProductPriceId || 0);
    if (current && current !== selected.priceId) {
      try { await strut.saveDosage(selected.priceId); } catch { /* apply checks the order product */ }
    }
  }

  let applied: Record<string, unknown>;
  try {
    applied = await strut.applyPromoCode(code);
  } catch (err) {
    const message = promoApiMessage(err);
    if (message) return { valid: false, message };
    throw err;
  }
  const first = discountSample(applied, selected.list);
  if (!first.ok) return { valid: false, message: 'Promo code is invalid or expired.' };

  const samples: PromoSample[] = [{ priceId: selected.priceId, list: first.list, discount: first.discount }];
  const others = rows.filter((row) => row.priceId !== selected.priceId);
  let movedOffSelected = false;
  for (const row of others) {
    if (typeof strut.saveDosage !== 'function') break;
    try { await strut.saveDosage(row.priceId); } catch { break; }
    movedOffSelected = true;
    let next = first;
    try {
      if (typeof strut.getCartItem === 'function') next = discountSample(await strut.getCartItem(), row.list);
      else next = discountSample(await strut.applyPromoCode(code), row.list);
    } catch { break; }
    if (!next.ok) break;
    samples.push({ priceId: row.priceId, list: next.list || row.list, discount: next.discount });
  }
  if (movedOffSelected && typeof strut.saveDosage === 'function') {
    try { await strut.saveDosage(selected.priceId); } catch { /* card prices every formula locally */ }
  }

  const rule = samples.length >= rows.length ? inferUniversalRule(samples) : null;
  if (!rule) return { valid: true, quotes: samples };
  if (rule.mode === 'pct') return { valid: true, mode: 'pct', value: rule.value, maxDiscount: rule.maxDiscount ?? null };
  return { valid: true, mode: rule.mode, value: rule.value };
}

function previewErrorMessage(code: string, err: unknown) {
  const status = Number((err as { status?: number })?.status || 0);
  if (status === 404) return 'Promo check is not available right now. Showing standard pricing.';
  return `We could not check ${code} right now. Showing standard pricing.`;
}

function codeFromStorageValue(raw: string | null): string {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const code = parsed?.code || parsed?.promo || parsed?.coupon || parsed?.promoCode || parsed?.coupon_code;
      if (code && String(code).trim()) return String(code).trim();
    } catch { /* plain string */ }
  }
  return trimmed;
}

function codeFromPage(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('promo') || params.get('coupon') || params.get('promoCode') || params.get('coupon_code');
    if (fromUrl && fromUrl.trim()) return fromUrl.trim();
  } catch { /* ignore */ }
  try {
    const snapshot = codeFromStorageValue(window.sessionStorage.getItem(PROMO_SESSION_KEY));
    if (snapshot) return snapshot;
    for (const key of PROMO_SESSION_ALIASES) {
      const code = codeFromStorageValue(window.sessionStorage.getItem(key));
      if (code) return code;
    }
  } catch { /* ignore */ }
  try {
    const answers = (window as any).pathwai?.flow?.getAnswers?.() || {};
    const flow = answers.promo || answers.coupon || answers.promoCode || answers.coupon_code
      || answers.variables?.promo || answers.variables?.coupon;
    if (flow && String(flow).trim()) return String(flow).trim();
  } catch { /* ignore */ }
  return '';
}

function writePromoSession(
  code: string,
  rule: PromoRule,
  quote?: { price: number; listPrice: number; discount: number; priceId?: number },
) {
  const snapshot: Record<string, unknown> = {
    code,
    coupon: code,
    couponCode: code,
    mode: rule.mode,
    value: rule.value,
  };
  if (quote && Number.isFinite(quote.price) && quote.price >= 0) {
    snapshot.price = quote.price;
    snapshot.totalPrice = quote.price;
    snapshot.listPrice = quote.listPrice;
    snapshot.discount = quote.discount;
    snapshot.discountAmount = quote.discount;
    if (quote.priceId) snapshot.priceId = quote.priceId;
  }
  try {
    const json = JSON.stringify(snapshot);
    window.sessionStorage.setItem('promo', code);
    window.sessionStorage.setItem('coupon', code);
    window.sessionStorage.setItem('coupon_code', code);
    window.sessionStorage.setItem(PROMO_SESSION_KEY, json);
    window.sessionStorage.setItem('strut.promo', json);
    window.sessionStorage.setItem('strut.coupon', json);
  } catch { /* ignore */ }
}

function clearPromoSession(code?: string) {
  const rejected = String(code || '').trim().toUpperCase();
  try {
    window.sessionStorage.removeItem(PROMO_SESSION_KEY);
    for (const key of PROMO_SESSION_ALIASES) {
      const current = codeFromStorageValue(window.sessionStorage.getItem(key)).toUpperCase();
      if (!rejected || current === rejected) window.sessionStorage.removeItem(key);
    }
  } catch { /* ignore */ }
}

function initialPromoState() {
  const detected = typeof window === 'undefined' ? '' : codeFromPage().trim().toUpperCase();
  return { code: detected };
}

function trackPromoDisplayed(payload: { coupon_code: string; discount_amount: number; product_id: string }) {
  const w = host();
  if (typeof w.pwPushGtm === 'function') {
    w.pwPushGtm('questionnaire_promo_displayed', payload);
    return;
  }
  try {
    const dataLayer = (window as any).dataLayer;
    if (Array.isArray(dataLayer)) dataLayer.push({ event: 'questionnaire_promo_displayed', ...payload });
  } catch { /* ignore */ }
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
  audienceLabel = '',
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
  const [seed] = useState(initialPromoState);
  const [promoCode, setPromoCode] = useState(seed.code);
  const [submittedCode, setSubmittedCode] = useState(seed.code);
  const [checkNonce, setCheckNonce] = useState(0);
  const [promoStatus, setPromoStatus] = useState<'idle' | 'pending' | 'success' | 'error'>(seed.code ? 'pending' : 'idle');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoHeld, setPromoHeld] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoRule, setPromoRule] = useState<PromoRule | null>(null);
  const [promoQuotes, setPromoQuotes] = useState<Record<number, { base: number; final: number; tag: string; save: number }> | null>(null);

  const dose = doses.find((v) => v.id === doseId) || doses[0];
  const doseRef = useRef(dose);
  doseRef.current = dose;
  const listPrice = dose?.price || 0;
  const activeRule = promoApplied ? promoRule : null;
  const selectedCached = dose?.priceId && promoQuotes ? promoQuotes[dose.priceId] : null;
  const selectedQuote = selectedCached || quotePrice(listPrice, activeRule, dose?.priceId);
  const totalNow = selectedQuote.final;
  const selectedTint = hexToRgba(selectedBgColor, selectedBgOpacity);
  const selectedTintStrong = hexToRgba(selectedBgColor, Math.min(selectedBgOpacity * 2, 0.2));

  useEffect(() => {
    const shown = String(submittedCode || '').trim().toUpperCase();
    const rows = doses
      .map((row) => ({ priceId: Number(row.priceId || 0), list: Number(row.price || 0) }))
      .filter((row) => row.priceId > 0);
    if (!shown || !rows.length) return;
    let cancelled = false;
    const selectedPriceId = Number(doseRef.current?.priceId || rows[0].priceId);
    setPromoCode(shown);
    setPromoStatus('pending');
    setPromoApplied(false);
    setPromoHeld(false);
    setPromoRule(null);
    setPromoQuotes(null);
    setPromoMessage('');

    (async () => {
      try {
        const res = await confirmPromoForSupplies(shown, rows, selectedPriceId);
        if (cancelled) return;
        const sampleList = Array.isArray(res?.quotes) ? res.quotes as PromoSample[] : null;
        const rule = sampleList ? null : ruleFromPreview(res);
        if (!rule && !sampleList?.length) {
          const message = String(
            res?.message || res?.Message || `We could not apply ${shown}. It may have expired. Showing standard pricing.`
          );
          setPromoApplied(false);
          setPromoHeld(false);
          setPromoRule(null);
          setPromoQuotes(null);
          setPromoStatus('error');
          setPromoMessage(message);
          clearPromoSession(shown);
          return;
        }
        setPromoApplied(true);
        setPromoHeld(false);
        setPromoRule(rule);
        setPromoQuotes(sampleList ? quotesFromSamples(sampleList) : null);
        setPromoStatus('success');
        setPromoMessage('');
      } catch (err) {
        if (cancelled) return;
        const status = Number((err as { status?: number })?.status || 0);
        const apiMessage = promoApiMessage(err);
        setPromoApplied(false);
        setPromoRule(null);
        setPromoQuotes(null);
        if (apiMessage && status !== 401 && status !== 404) {
          setPromoHeld(false);
          setPromoStatus('error');
          setPromoMessage(apiMessage);
          clearPromoSession(shown);
          return;
        }
        if (status === 401 || status === 404) {
          rememberPromoCode(shown);
          setPromoHeld(true);
          setPromoStatus('error');
          setPromoMessage('This code is saved. Checkout will apply it if it is valid for Minoxidil.');
          return;
        }
        setPromoHeld(false);
        setPromoStatus('error');
        setPromoMessage(previewErrorMessage(shown, err));
        clearPromoSession(shown);
      }
    })();

    return () => { cancelled = true; };
  }, [submittedCode, checkNonce, doses]);

  const handleApplyPromo = () => {
    const shown = promoCode.trim().toUpperCase();
    if (!shown || promoStatus === 'pending') return;
    setPromoCode(shown);
    setSubmittedCode(shown);
    setCheckNonce((n) => n + 1);
  };

  const handleRemovePromo = () => {
    clearPromoSession(promoCode);
    setPromoCode('');
    setSubmittedCode('');
    setPromoApplied(false);
    setPromoHeld(false);
    setPromoRule(null);
    setPromoQuotes(null);
    setPromoStatus('idle');
    setPromoMessage('');
  };

  useEffect(() => {
    if (!promoApplied || !promoCode || (!promoRule && !promoQuotes)) return;
    const rule = promoRule || { mode: 'fix' as const, value: selectedQuote.save };
    writePromoSession(promoCode, rule, {
      price: selectedQuote.final,
      listPrice: selectedQuote.base,
      discount: selectedQuote.save,
      priceId: dose?.priceId,
    });
  }, [promoApplied, promoRule, promoQuotes, promoCode, selectedQuote.final, selectedQuote.base, selectedQuote.save, dose?.priceId]);

  useEffect(() => {
    if (!promoApplied || !promoCode || !dose) return;
    trackPromoDisplayed({
      coupon_code: promoCode,
      discount_amount: selectedQuote.save,
      product_id: dose.id,
    });
  }, [promoApplied, promoCode, dose?.id, selectedQuote.save]);

  useEffect(() => {
    if (!dose) return;
    const coupon = (promoApplied || promoHeld) ? promoCode : '';
    const discount = promoApplied ? selectedQuote.save : 0;
    const payload = {
      formulationKey: dose.id,
      formulationLabel: title,
      variantId: dose.id,
      variantLabel: dose.label,
      variantPrice: dose.price,
      priceId: dose.priceId,
      withAddon: false,
      addonPrice: 0,
      listPrice,
      totalPrice: totalNow,
      couponCode: coupon,
      coupon,
      discountAmount: discount,
      discount,
      productSlug: MINOXIDIL_SLUG,
      audienceLabel,
      env: isStagingEnv() ? 'staging' : 'production',
    };
    syncPathwaiProductDisplay({
      productTitle: title,
      productSubtitle: subtitle,
      audienceLabel,
      subAxisLabel,
      variantLabel: payload.variantLabel,
      variantId: dose.id,
      priceId: dose.priceId,
      price: totalNow,
      totalPrice: totalNow,
      listPrice,
      discount,
      discountAmount: discount,
      coupon,
      couponCode: coupon,
      productSlug: MINOXIDIL_SLUG,
    });
    if (onChange) onChange(payload);
  }, [onChange, dose, totalNow, listPrice, promoApplied, promoHeld, promoCode, selectedQuote.save, title, subtitle, subAxisLabel, audienceLabel]);

  const handleCta = async () => {
    if (!dose) return;
    setCtaError(null);
    setIsLoading(true);

    const coupon = (promoApplied || promoHeld) ? promoCode : '';
    const discount = promoApplied ? selectedQuote.save : 0;

    const payload = {
      formulationKey: dose.id,
      formulationLabel: title,
      variantId: dose.id,
      variantLabel: dose.label,
      variantPrice: dose.price,
      priceId: dose.priceId,
      withAddon: false,
      addonPrice: 0,
      listPrice,
      totalPrice: totalNow,
      couponCode: coupon,
      coupon,
      discountAmount: discount,
      discount,
      productSlug: MINOXIDIL_SLUG,
      audienceLabel,
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
            ? 'Missing Minoxidil priceId'
            : 'Missing Minoxidil priceId — check MINOXIDIL_CATALOG and pathwai-minoxidil-sdk.js'
        );
      }

      try { w.strut_minoxidil_price_id = priceIdNum; } catch { /* ignore */ }

      syncPathwaiProductDisplay({
        productTitle: title,
        productSubtitle: subtitle,
        audienceLabel,
        subAxisLabel,
        variantLabel: payload.variantLabel,
        variantId: dose.id,
        priceId: priceIdNum,
        price: totalNow,
        totalPrice: totalNow,
        listPrice,
        discount,
        discountAmount: discount,
        coupon,
        couponCode: coupon,
        productSlug: MINOXIDIL_SLUG,
      });

      const cartItemData = {
        id: String(priceIdNum),
        name: title,
        productName: title,
        price: totalNow,
        totalPrice: totalNow,
        listPrice,
        originalPrice: listPrice,
        discount,
        discountAmount: discount,
        coupon,
        couponCode: coupon,
        quantity: 1,
        variants: [{ name: subAxisLabel, value: payload.variantLabel }],
      };

      const syncCartState = () => {
        const cartApi = w.pathwai?.cart;
        if (cartApi?.clearCart && cartApi?.addItem) {
          cartApi.clearCart();
          cartApi.addItem(cartItemData);
        }
        try {
          w.pathwai?.flow?.setVariable?.('promo', coupon);
          w.pathwai?.flow?.setVariable?.('coupon', coupon);
          w.pathwai?.flow?.setVariable?.('discount', discount);
          w.pathwai?.flow?.setVariable?.('discountAmount', discount);
        } catch { /* ignore */ }
      };

      if (typeof w.strut?.addToCart === 'function') {
        syncCartState();
        await w.strut.addToCart(priceIdNum, {
          price: totalNow,
          totalPrice: totalNow,
          listPrice,
          discount,
          discountAmount: discount,
          coupon,
          couponCode: coupon,
          label: payload.variantLabel,
          productTitle: title,
          productSubtitle: subtitle,
          audienceLabel,
          subAxisLabel,
          variantLabel: payload.variantLabel,
          variantId: dose.id,
          productSlug: MINOXIDIL_SLUG,
        });
        return;
      }

      if (typeof w.strut?.validateVisiting !== 'function') {
        throw new Error('Minoxidil SDK not loaded — paste pathwai-minoxidil-sdk.js into the flow event');
      }

      // Visiting only — GetCurrentVisiting needs a Bearer token and runs after login.
      await w.strut.validateVisiting(validateVisitingSlug(priceIdNum), priceIdNum, { coupon: coupon || null });

      syncCartState();

      try {
        w.pwPushGtm?.('Added to Cart', {
          product_name: 'Oral Minoxidil Men',
          audience: audienceLabel,
          price_id: priceIdNum,
          price: totalNow,
          list_price: listPrice,
          discount_amount: discount,
          coupon_code: coupon,
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
        .pcd-audience {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--pcd-brand);
          background: var(--pcd-selected-bg);
          border: 1px solid var(--pcd-border-soft);
          border-radius: 999px;
          padding: 4px 10px;
          margin-bottom: 10px;
        }
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
          display: flex;
          flex-direction: column;
          gap: 2px;
          word-break: break-word;
        }
        .pcd-row-label-main {
          font-weight: 500;
          font-size: 15px;
          line-height: 1.3;
        }
        .pcd-row-label-sub {
          font-weight: 500;
          font-size: 13px;
          line-height: 1.3;
          color: var(--pcd-text-muted);
        }
        .pcd-variant-row.is-selected .pcd-row-label-main { font-weight: 600; }
        .pcd-row-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: -0.01em;
          flex-shrink: 0;
          text-align: right;
          white-space: nowrap;
        }
        .pcd-row-price-was {
          font-size: 12px;
          font-weight: 500;
          color: var(--pcd-text-muted);
          text-decoration: line-through;
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
        .pcd-promo-tag {
          display: inline-block;
          margin-top: 2px;
          background: #e3f4ea;
          color: #0f7a4a;
          font-size: 10.5px;
          font-weight: 700;
          border-radius: 20px;
          padding: 2px 7px;
          line-height: 1.3;
        }
        .pcd-promo { margin-bottom: 12px; }
        .pcd-promo-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 8px;
        }
        .pcd-promo-input {
          width: 100%;
          min-width: 0;
          height: 40px;
          padding: 0 12px;
          border-radius: var(--pcd-radius);
          border: 1.5px solid var(--pcd-border);
          background: #fff;
          color: var(--pcd-text);
          font-family: inherit;
          font-size: 14px;
        }
        .pcd-promo-btn {
          height: 40px;
          padding: 0 14px;
          border: none;
          border-radius: var(--pcd-radius);
          background: var(--pcd-surface);
          color: var(--pcd-text);
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .pcd-promo-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .pcd-promo-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          background: #e3f4ea;
          color: #0f7a4a;
          border-radius: 8px;
          padding: 8px 10px;
          margin-bottom: 10px;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.35;
        }
        .pcd-promo-banner small { display: block; font-weight: 400; opacity: 0.85; }
        .pcd-promo-notice {
          background: #fff3d6;
          color: #8a5a00;
          border-radius: 8px;
          padding: 7px 10px;
          margin-bottom: 10px;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.4;
        }
        .pcd-promo-pending {
          color: var(--pcd-text-muted);
          margin-bottom: 10px;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.4;
        }
        .pcd-promo-remove {
          margin: 0 0 10px;
          padding: 0;
          border: none;
          background: none;
          color: var(--pcd-text-muted);
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }
        .pcd-code-row { display: flex; gap: 8px; }
        .pcd-code-input {
          flex: 1;
          min-width: 0;
          height: 40px;
          padding: 0 12px;
          border: 1px solid var(--pcd-border);
          border-radius: 6px;
          background: var(--pcd-surface);
          color: var(--pcd-text);
          font-family: 'Figtree', sans-serif;
          font-size: 14px;
        }
        .pcd-code-input:focus { outline: 2px solid var(--pcd-brand); outline-offset: 1px; }
        .pcd-code-apply {
          height: 40px;
          padding: 0 14px;
          border: none;
          border-radius: 6px;
          background: var(--pcd-brand);
          color: #fff;
          font-family: 'Figtree', sans-serif;
          font-size: 14px;
          cursor: pointer;
        }
        .pcd-code-apply:disabled { opacity: 0.5; cursor: default; }
        .pcd-code-applied {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          min-height: 40px;
          padding: 8px 12px;
          border-radius: 6px;
          background: var(--pcd-surface);
          border: 1px solid var(--pcd-border);
          font-size: 13px;
        }
        .pcd-code-remove {
          border: none;
          background: transparent;
          color: var(--pcd-brand);
          font-family: 'Figtree', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .pcd-checkout {
          padding: 14px 24px 28px 24px;
          border-top: 1px solid var(--pcd-border-soft);
          background: #fff;
        }
        .pcd-checkout-top {
          display: flex;
          align-items: center;
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
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-family: 'Figtree', sans-serif;
          font-weight: 700;
          font-size: 26px;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .pcd-checkout-price-was {
          font-size: 13px;
          font-weight: 500;
          color: var(--pcd-text-muted);
          text-decoration: line-through;
        }
        .pcd-checkout-save {
          margin-top: 2px;
          font-size: 12px;
          font-weight: 600;
          color: #0f7a4a;
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
          .pcd-row-label-main { font-size: 14px; }
          .pcd-row-label-sub { font-size: 12px; }
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
            {audienceLabel ? <div className="pcd-audience">{audienceLabel}</div> : null}
            <h1 className="pcd-title">{title}</h1>
            <div className="pcd-subtitle">{subtitle}</div>
          </div>

          {promoApplied && (promoRule || promoQuotes) && (
            <div className="pcd-promo-banner">
              <span>
                Code {promoCode} applied
                <small>{promoRule ? bannerDetail(promoRule) : 'Discount applied on every dose.'}</small>
              </span>
              <span aria-hidden="true">✓</span>
            </div>
          )}
          {promoStatus === 'pending' && (
            <div className="pcd-promo-pending">Checking {promoCode || submittedCode}…</div>
          )}
          {promoStatus === 'error' && promoMessage && (
            <div className="pcd-promo-notice">{promoMessage}</div>
          )}
          {!promoApplied && (
            <div className="pcd-promo">
              <div className="pcd-promo-row">
                <input
                  className="pcd-promo-input"
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  autoComplete="off"
                  onChange={(e) => {
                    const next = e.target.value;
                    setPromoCode(next);
                    if (promoApplied || promoHeld) {
                      clearPromoSession(promoCode);
                      setPromoApplied(false);
                      setPromoHeld(false);
                      setPromoRule(null);
                      setPromoQuotes(null);
                      setSubmittedCode('');
                    }
                    if (promoStatus !== 'idle') {
                      setPromoStatus('idle');
                      setPromoMessage('');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyPromo();
                    }
                  }}
                />
                <button type="button" className="pcd-promo-btn" onClick={handleApplyPromo} disabled={!promoCode.trim() || promoStatus === 'pending'}>
                  {promoStatus === 'pending' ? 'Checking…' : 'Apply'}
                </button>
              </div>
            </div>
          )}
          {promoApplied && (
            <button type="button" className="pcd-promo-remove" onClick={handleRemovePromo}>
              Remove code
            </button>
          )}

          <div className="pcd-label-row">{subAxisLabel}</div>
          <div className="pcd-variant-rows">
            {doses.map((v) => {
              const isSel = doseId === v.id;
              const quote = (promoQuotes && promoQuotes[v.priceId]) || quotePrice(v.price, activeRule, v.priceId);
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
                  <span className="pcd-row-label">
                    <span className="pcd-row-label-main">{v.doseLabel}</span>
                    {v.supplyLabel ? (
                      <span className="pcd-row-label-sub">{v.supplyLabel}</span>
                    ) : null}
                  </span>
                  <span className="pcd-row-price">
                    {quote.save > 0 && (
                      <span className="pcd-row-price-was">{formatMoney(quote.base)}</span>
                    )}
                    <span>
                      {formatMoney(quote.final)}
                      {pricePeriodSuffix && (
                        <span className="pcd-row-price-suffix">{pricePeriodSuffix}</span>
                      )}
                    </span>
                    {quote.tag ? <span className="pcd-promo-tag">{quote.tag}</span> : null}
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
              <span className="pcd-checkout-price">
                {selectedQuote.save > 0 && (
                  <span className="pcd-checkout-price-was">{formatMoney(selectedQuote.base)}</span>
                )}
                <span>{formatMoney(selectedQuote.final)}</span>
                {selectedQuote.save > 0 && (
                  <span className="pcd-checkout-save">You save {formatMoney(selectedQuote.save)}</span>
                )}
              </span>
            </div>
            <button type="button" className="pcd-cta" onClick={handleCta} disabled={isLoading}>
              <span>{isLoading ? 'Adding…' : ctaLabel}</span>
              {!isLoading && <span className="pcd-cta-arrow" aria-hidden="true">→</span>}
            </button>
          </div>
        </div>
      </div>

      <div
        className="pcd-checkout-wrap-mobile"
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
        <div className="pcd-checkout-inner">
          <div className="pcd-checkout">
            <div className="pcd-checkout-top">
              <span className="pcd-checkout-label">{totalLabel}</span>
              <span className="pcd-checkout-price">
                {selectedQuote.save > 0 && (
                  <span className="pcd-checkout-price-was">{formatMoney(selectedQuote.base)}</span>
                )}
                <span>{formatMoney(selectedQuote.final)}</span>
                {selectedQuote.save > 0 && (
                  <span className="pcd-checkout-save">You save {formatMoney(selectedQuote.save)}</span>
                )}
              </span>
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
  audienceLabel: { type: 'string', title: 'Audience Label', defaultValue: '' },
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
  trustItem1: { type: 'string', title: 'Trust Item 1', defaultValue: '' },
  trustItem2: { type: 'string', title: 'Trust Item 2', defaultValue: '' },
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
    listPrice: 'number',
    totalPrice: 'number',
    couponCode: 'string',
    discountAmount: 'number',
    productSlug: 'string',
    audienceLabel: 'string',
    env: 'string',
  },
};
