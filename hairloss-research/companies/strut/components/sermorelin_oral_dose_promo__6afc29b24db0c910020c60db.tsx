// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect, useMemo, useRef } from 'react';

/* ============================================================
   SERMORELIN ORAL — PathwAI product selection card

   Paste into the Sermorelin Oral PathwAI add-to-cart / product-selection card.
   Requires pathwai-sermorelin-oral-sdk.js on the flow event.
   Do NOT paste into the injectable Sermorelin flow.

   UI: Supply (30 / 90 / 150 day) → Dose (0.5 / 0.75 / 1 mg)

   Staging (checkout.strut-test.com/sermorelin):
     0.5mg   30d=2225 $99    90d=2230 $159   150d=2233 $319
     0.75mg  30d=2226 $109   90d=2231 $179   150d=2234 $349
     1mg     30d=2229 $139   90d=2232 $199   150d=2235 $379
   Production (checkout.struthealth.com/sermorelin):
     0.5mg   30d=1144 $99    90d=2165 $159   150d=2168 $319
     0.75mg  30d=1145 $109   90d=2166 $179   150d=2169 $349
     1mg     30d=1213 $139   90d=2167 $199   150d=2170 $379

   Env: window.strut_env = 'staging' | 'production' (set in pathwai-sermorelin-oral-sdk.js).

   Add to cart → strut.addToCart → validateVisiting → pathwai.flow.next()

   Promo codes are read from the URL (?promo= or ?coupon=), session storage, or the
   field on this card, then checked once when Apply is clicked. A valid code is priced
   for every dose/supply option on this card. Changing options uses that result and
   does not ask the server again. The discount never drops a price below $0. A code
   the backend rejects keeps base pricing and does not block Add to cart. The cart
   shows the discounted price. The order line stays at the catalog price, and
   ApplyPromoCode is the only deduction stored on the order.
============================================================ */

type StrutHost = {
  strut?: {
    ENV?: { api?: string; checkout?: string };
    validateVisiting?: (slug: string, priceId: number, opts?: { coupon?: string | null }) => Promise<unknown>;
    previewPromoCode?: (promoCode: string, productPriceId: number) => Promise<Record<string, unknown>>;
    skuId?: (sizeOrKey: string) => number;
    addToCart?: (priceId: number, opts?: Record<string, unknown>) => Promise<unknown>;
    ensurePathwaiCart?: (opts?: Record<string, unknown>) => boolean;
  };
  strut_env?: string;
  strut_sermorelin_price_id?: number;
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

const SERMORELIN_SLUG = 'sermorelin';

const DOSE_KEYS = {
  d1: '0.5mg',
  d2: '0.75mg',
  d3: '1mg',
} as const;

type DoseId = keyof typeof DOSE_KEYS;
type SupplyId = 's1' | 's2' | 's3';
type PriceKey = `${DoseId}|${SupplyId}`;

const SERMORELIN_ORAL_PRICE_IDS = {
  staging: {
    'd1|s1': 2225, 'd1|s2': 2230, 'd1|s3': 2233,
    'd2|s1': 2226, 'd2|s2': 2231, 'd2|s3': 2234,
    'd3|s1': 2229, 'd3|s2': 2232, 'd3|s3': 2235,
  },
  production: {
    'd1|s1': 1144, 'd1|s2': 2165, 'd1|s3': 2168,
    'd2|s1': 1145, 'd2|s2': 2166, 'd2|s3': 2169,
    'd3|s1': 1213, 'd3|s2': 2167, 'd3|s3': 2170,
  },
} as const;

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

function priceIdsForEnv() {
  return isStagingEnv() ? SERMORELIN_ORAL_PRICE_IDS.staging : SERMORELIN_ORAL_PRICE_IDS.production;
}

function resolveSkuKey(doseId: DoseId, supplyId: SupplyId) {
  const dose = DOSE_KEYS[doseId];
  return dose ? `oral|${dose}|${supplyId}` : '';
}

function resolvePriceId(doseId: DoseId, supplyId: SupplyId) {
  const key = `${doseId}|${supplyId}` as PriceKey;
  const fromCatalog = Number(priceIdsForEnv()[key] || 0);
  if (fromCatalog > 0) return fromCatalog;
  try {
    const skuKey = resolveSkuKey(doseId, supplyId);
    const fromSdk = Number(host().strut?.skuId?.(skuKey) || 0);
    if (fromSdk > 0) return fromSdk;
  } catch { /* ignore */ }
  return fromCatalog;
}

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
  if (a <= 0 || b <= 0 || am <= 0 || bm <= 0 || bm <= am) return 0;
  return Math.max(0, Math.round((a / am) * bm - b));
}

function calcDiscountPct(s1Price: number, s1MonthsCount: number, sPrice: number, sMonthsCount: number) {
  const savings = calcSavingsDollars(s1Price, s1MonthsCount, sPrice, sMonthsCount);
  const baseline = (Number(s1Price) / Number(s1MonthsCount)) * Number(sMonthsCount);
  if (baseline <= 0 || savings <= 0) return 0;
  return Math.max(0, Math.round((savings / baseline) * 100));
}

function formatSavingsCopy(template: string, amount: number, pct: number) {
  return (template || 'Save {amount} ({pct} off)')
    .replace(/\{amount\}/g, `$${amount}`)
    .replace(/\{pct\}/g, `${pct}%`);
}

function hexToRgba(hex: string, alpha: number) {
  const clean = String(hex || '').replace('#', '');
  if (clean.length !== 6) return `rgba(22, 19, 54, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildSkuLabel(supplyLabel: string, doseLabel: string) {
  const supply = supplyLabel.replace(/^(\d+)\s*day\s*supply$/i, '$1 Day Supply');
  return `${supply} - Sermorelin ${doseLabel}`;
}

function parseDoseMg(label: string) {
  const m = String(label || '').match(/([\d.]+)\s*mg/i);
  return m ? Number(m[1]) || 0 : 0;
}

function formatQuantityCopy(template: string, count: number, totalMg: number) {
  return (template || '')
    .replace(/\{count\}/g, String(count))
    .replace(/\{totalMg\}/g, String(totalMg))
    .trim();
}

function validateVisitingSlug(_priceId?: number): string {
  return SERMORELIN_SLUG;
}

const PROMO_SESSION_KEY = 'strut.sermorelin-oral.promo';
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
  const scope = rule.onlyPriceId ? 'the selected option.' : 'every option.';
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


export default function SermorelinOralPricingCard({
  brandColor = '#161336',
  discColor = '#f1ece1',
  bottleImageUrl = 'https://placehold.co/440x440/f1ece1/161336/png?text=Sermorelin+Oral',
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

  titleBase = 'Sermorelin Oral',
  subtitle = 'Growth hormone support · compounded Sermorelin troche by a US licensed pharmacy',
  supplyLabel = 'Supply',
  doseLabel = 'Dose',

  supply1Label = '30 day supply',
  supply1MonthsCount = 1,
  supply1TrocheCount = 30,
  supply2Label = '90 day supply',
  supply2MonthsCount = 3,
  supply2TrocheCount = 90,
  supply3Label = '150 day supply',
  supply3MonthsCount = 5,
  supply3TrocheCount = 150,
  defaultSupplyIndex = 1,

  supplyQuantityFormat = '{count} troches',
  doseQuantityFormat = '{totalMg} mg total',

  dose1Label = '0.5mg',
  dose1Supply1Price = 99,
  dose1Supply2Price = 159,
  dose1Supply3Price = 319,
  dose2Label = '0.75mg',
  dose2Supply1Price = 109,
  dose2Supply2Price = 179,
  dose2Supply3Price = 349,
  dose3Label = '1mg',
  dose3Supply1Price = 139,
  dose3Supply2Price = 199,
  dose3Supply3Price = 379,
  defaultDoseIndex = 1,

  savingsCopyFormat = 'Save {amount} ({pct} off)',
  trustItem1 = 'Doctor consult',
  trustItem2 = 'FDA-registered pharmacy',
  totalLabel = 'Total today',
  ctaLabel = 'Add to cart',
  ctaBgColor = '#161336',
  cardRadius = 22,
  innerRadius = 12,

  onCta = null as null | ((payload: Record<string, unknown>) => void),
  onChange = null as null | ((payload: Record<string, unknown>) => void),
}) {
  const DOSES = useMemo(() => [
    {
      id: 'd1' as DoseId,
      label: dose1Label,
      s1: Number(dose1Supply1Price) || 0,
      s2: Number(dose1Supply2Price) || 0,
      s3: Number(dose1Supply3Price) || 0,
    },
    {
      id: 'd2' as DoseId,
      label: dose2Label,
      s1: Number(dose2Supply1Price) || 0,
      s2: Number(dose2Supply2Price) || 0,
      s3: Number(dose2Supply3Price) || 0,
    },
    {
      id: 'd3' as DoseId,
      label: dose3Label,
      s1: Number(dose3Supply1Price) || 0,
      s2: Number(dose3Supply2Price) || 0,
      s3: Number(dose3Supply3Price) || 0,
    },
  ].filter(d => d.label && (d.s1 > 0 || d.s2 > 0 || d.s3 > 0)), [
    dose1Label, dose1Supply1Price, dose1Supply2Price, dose1Supply3Price,
    dose2Label, dose2Supply1Price, dose2Supply2Price, dose2Supply3Price,
    dose3Label, dose3Supply1Price, dose3Supply2Price, dose3Supply3Price,
  ]);

  const SUPPLIES = useMemo(() => [
    {
      id: 's1' as SupplyId,
      label: supply1Label,
      monthsCount: Number(supply1MonthsCount) || 1,
      trocheCount: Number(supply1TrocheCount) || 30,
    },
    {
      id: 's2' as SupplyId,
      label: supply2Label,
      monthsCount: Number(supply2MonthsCount) || 3,
      trocheCount: Number(supply2TrocheCount) || 90,
    },
    {
      id: 's3' as SupplyId,
      label: supply3Label,
      monthsCount: Number(supply3MonthsCount) || 5,
      trocheCount: Number(supply3TrocheCount) || 150,
    },
  ].filter(s => s.label), [
    supply1Label, supply1MonthsCount, supply1TrocheCount,
    supply2Label, supply2MonthsCount, supply2TrocheCount,
    supply3Label, supply3MonthsCount, supply3TrocheCount,
  ]);

  const [supplyId, setSupplyId] = useState<SupplyId>(() => {
    const idx = Math.max(0, Math.min(SUPPLIES.length - 1, (Number(defaultSupplyIndex) || 1) - 1));
    return SUPPLIES[idx]?.id || 's1';
  });

  const [doseId, setDoseId] = useState<DoseId>(() => {
    const idx = Math.max(0, Math.min(DOSES.length - 1, (Number(defaultDoseIndex) || 1) - 1));
    return DOSES[idx]?.id || 'd1';
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

  useEffect(() => {
    if (DOSES.length && !DOSES.find(d => d.id === doseId)) setDoseId(DOSES[0].id);
  }, [DOSES, doseId]);

  useEffect(() => {
    if (SUPPLIES.length && !SUPPLIES.find(s => s.id === supplyId)) setSupplyId(SUPPLIES[0].id);
  }, [SUPPLIES, supplyId]);

  const selectedDose = DOSES.find(d => d.id === doseId) || DOSES[0];
  const supply = SUPPLIES.find(s => s.id === supplyId) || SUPPLIES[0];
  const supply1 = SUPPLIES.find(s => s.id === 's1');

  const listPrice = selectedDose?.[supplyId] || 0;
  const priceId = selectedDose ? resolvePriceId(selectedDose.id, supplyId) : 0;
  const allSkuRows = useMemo(() => {
    const rows: { priceId: number; list: number }[] = [];
    for (const d of DOSES) {
      for (const s of SUPPLIES) {
        const pid = resolvePriceId(d.id, s.id);
        const list = Number(d[s.id] || 0);
        if (pid > 0 && list > 0) rows.push({ priceId: pid, list });
      }
    }
    return rows;
  }, [DOSES, SUPPLIES]);
  const selectedRef = useRef({ priceId, listPrice });
  selectedRef.current = { priceId, listPrice };
  const activeRule = promoApplied ? promoRule : null;
  const selectedCached = priceId && promoQuotes ? promoQuotes[priceId] : null;
  const selectedQuote = selectedCached || quotePrice(listPrice, activeRule, priceId);
  const totalNow = selectedQuote.final;
  const monthlyEff = supply ? effMonthlyPrice(totalNow, supply.monthsCount) : 0;
  const skuKey = selectedDose ? resolveSkuKey(selectedDose.id, supplyId) : '';
  const skuLabel = selectedDose && supply
    ? buildSkuLabel(supply.label, selectedDose.label)
    : titleBase;

  const selectedTrocheCount = supply?.trocheCount || 0;
  const selectedDoseMg = selectedDose ? parseDoseMg(selectedDose.label) : 0;
  const selectedTotalDosageMg = selectedTrocheCount > 0 && selectedDoseMg > 0
    ? Math.round(selectedDoseMg * selectedTrocheCount * 1000) / 1000
    : 0;

  const selectedTint = hexToRgba(selectedBgColor, selectedBgOpacity);

  useEffect(() => {
    const shown = String(submittedCode || '').trim().toUpperCase();
    if (!shown || !allSkuRows.length) return;
    let cancelled = false;
    const selectedPriceId = Number(selectedRef.current.priceId || allSkuRows[0].priceId);
    setPromoCode(shown);
    setPromoStatus('pending');
    setPromoApplied(false);
    setPromoHeld(false);
    setPromoRule(null);
    setPromoQuotes(null);
    setPromoMessage('');

    (async () => {
      try {
        const res = await confirmPromoForSupplies(shown, allSkuRows, selectedPriceId);
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
          setPromoMessage('This code is saved. Checkout will apply it if it is valid for Sermorelin Oral.');
          return;
        }
        setPromoHeld(false);
        setPromoStatus('error');
        setPromoMessage(previewErrorMessage(shown, err));
        clearPromoSession(shown);
      }
    })();

    return () => { cancelled = true; };
  }, [submittedCode, checkNonce, allSkuRows]);

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
      priceId,
    });
  }, [promoApplied, promoRule, promoQuotes, promoCode, selectedQuote.final, selectedQuote.base, selectedQuote.save, priceId]);

  useEffect(() => {
    if (!promoApplied || !promoCode || !skuKey) return;
    trackPromoDisplayed({
      coupon_code: promoCode,
      discount_amount: selectedQuote.save,
      product_id: skuKey,
    });
  }, [promoApplied, promoCode, skuKey, selectedQuote.save]);

  useEffect(() => {
    if (priceId) {
      try { host().strut_sermorelin_price_id = priceId; } catch { /* ignore */ }
    }
    if (!onChange || !selectedDose || !supply) return;
    const coupon = (promoApplied || promoHeld) ? promoCode : '';
    const discount = promoApplied ? selectedQuote.save : 0;
    onChange({
      doseId,
      doseLabel: selectedDose.label,
      supplyId,
      supplyLabel: supply.label,
      supplyMonthsCount: supply.monthsCount,
      trocheCount: supply.trocheCount,
      totalDosageMg: selectedTotalDosageMg,
      listPrice,
      totalPrice: totalNow,
      couponCode: coupon,
      coupon,
      discountAmount: discount,
      discount,
      effectiveMonthly: monthlyEff,
      priceId,
      sku: skuKey,
      productSlug: SERMORELIN_SLUG,
      env: isStagingEnv() ? 'staging' : 'production',
    });
  }, [doseId, supplyId, selectedDose, supply, selectedTotalDosageMg, listPrice, totalNow, monthlyEff, priceId, skuKey, onChange, promoApplied, promoHeld, promoCode, selectedQuote.save]);

  const handleCta = async () => {
    if (!selectedDose || !supply) return;
    if (!priceId) {
      setCtaError(
        isStagingEnv()
          ? 'Missing Sermorelin oral staging priceId for this selection'
          : 'Production Sermorelin oral priceIds are not set — update SERMORELIN_ORAL_PRICE_IDS.production'
      );
      return;
    }
    setCtaError(null);
    setIsLoading(true);

    const coupon = (promoApplied || promoHeld) ? promoCode : '';
    const discount = promoApplied ? selectedQuote.save : 0;

    const payload = {
      doseId,
      doseLabel: selectedDose.label,
      supplyId,
      supplyLabel: supply.label,
      listPrice,
      totalPrice: totalNow,
      couponCode: coupon,
      coupon,
      discountAmount: discount,
      discount,
      priceId,
      sku: skuKey,
      productSlug: SERMORELIN_SLUG,
    };

    try {
      if (onCta) {
        onCta(payload);
        return;
      }

      const w = host();
      try { w.strut_sermorelin_price_id = priceId; } catch { /* ignore */ }

      const cartItemData = {
        id: String(priceId),
        name: skuLabel,
        price: totalNow,
        totalPrice: totalNow,
        listPrice,
        originalPrice: listPrice,
        discount,
        discountAmount: discount,
        coupon,
        couponCode: coupon,
        quantity: 1,
        variants: [
          { name: 'Dose', value: selectedDose.label },
          { name: 'Supply', value: supply.label },
        ],
      };

      const syncCartState = () => {
        if (typeof w.strut?.ensurePathwaiCart === 'function') {
          w.strut.ensurePathwaiCart({
            priceId,
            label: skuLabel,
            price: totalNow,
            listPrice,
            discount,
            discountAmount: discount,
            coupon,
            couponCode: coupon,
            doseLabel: selectedDose.label,
            supplyLabel: supply.label,
            force: true,
          });
        } else {
          const cartApi = w.pathwai?.cart;
          if (cartApi?.clearCart && cartApi?.addItem) {
            cartApi.clearCart();
            cartApi.addItem(cartItemData);
          }
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
        await w.strut.addToCart(priceId, {
          price: totalNow,
          totalPrice: totalNow,
          listPrice,
          discount,
          discountAmount: discount,
          coupon,
          couponCode: coupon,
          label: skuLabel,
          doseLabel: selectedDose.label,
          supplyLabel: supply.label,
        });
        return;
      }

      if (typeof w.strut?.validateVisiting !== 'function') {
        throw new Error('Sermorelin Oral SDK not loaded — paste pathwai-sermorelin-oral-sdk.js into the flow event');
      }

      await w.strut.validateVisiting(SERMORELIN_SLUG, priceId, { coupon: coupon || null });
      syncCartState();

      try {
        w.pwPushGtm?.('Added to Cart', {
          product_name: 'Sermorelin Oral',
          price_id: priceId,
          sku: skuKey,
          price: totalNow,
          list_price: listPrice,
          discount_amount: discount,
          coupon_code: coupon,
        });
      } catch { /* ignore */ }

      w.pathwai?.flow?.next?.();
    } catch (e) {
      console.error('[sermorelin-oral] Add to cart error:', e);
      setCtaError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!DOSES.length || !SUPPLIES.length) {
    return (
      <div style={{
        padding: 24,
        fontFamily: 'Figtree, system-ui, sans-serif',
        color: '#6B7670',
        fontSize: 14,
        textAlign: 'center',
        border: '1px dashed #E5E1D8',
        borderRadius: 22,
      }}>
        Configure at least one dose and one supply option.
      </div>
    );
  }

  const checkoutBlock = (mobile: boolean) => (
    <div className="pcg-checkout">
      <div className="pcg-checkout-top">
        <span className="pcg-checkout-label">{totalLabel}</span>
        <span className="pcg-checkout-price">
          {selectedQuote.save > 0 && (
            <span className="pcg-checkout-price-was">{formatMoney(selectedQuote.base)}</span>
          )}
          <span>{formatMoney(selectedQuote.final)}</span>
          {selectedQuote.save > 0 && (
            <span className="pcg-checkout-save">You save {formatMoney(selectedQuote.save)}</span>
          )}
          {monthlyEff > 0 && supply.monthsCount > 1 && (
            <span className="pcg-checkout-permo">· {formatMoney(monthlyEff)}/mo</span>
          )}
        </span>
      </div>
      <button
        type="button"
        className="pcg-cta"
        data-strut-sermorelin-oral-cta=""
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
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700&display=swap');
        .pcg-root, .pcg-root * { box-sizing: border-box; }
        .pcg-root {
          font-family: 'Figtree', system-ui, sans-serif;
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
          width: 200px; height: 200px; max-width: 100%;
          border-radius: 999px; background: var(--pcg-disc);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
        }
        .pcg-disc img {
          width: var(--pcg-img-size, 100%);
          height: var(--pcg-img-size, 100%);
          object-fit: var(--pcg-img-fit, cover);
        }
        .pcg-title-wrap { text-align: center; }
        .pcg-title {
          font-family: 'Figtree', sans-serif;
          font-weight: 700; font-size: 26px; line-height: 1.2;
          letter-spacing: -0.02em; margin: 0 0 6px 0;
          color: var(--pcg-text); overflow-wrap: anywhere;
        }
        .pcg-subtitle {
          font-size: 13px; color: var(--pcg-text-muted);
          font-weight: 500; line-height: 1.4;
        }
        .pcg-label-row {
          font-family: 'Figtree', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; line-height: 1.33;
          text-transform: uppercase; color: var(--pcg-text);
          margin-bottom: 10px;
        }
        .pcg-section + .pcg-section { margin-top: 4px; }
        .pcg-supply-list {
          display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;
        }
        .pcg-supply {
          padding: 14px 16px;
          border-radius: var(--pcg-inner-radius);
          border: 1.5px solid var(--pcg-border);
          background: #fff; color: var(--pcg-text);
          font-family: 'Figtree', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; text-align: left; width: 100%;
          transition: border-color 0.15s ease, background 0.15s ease;
          min-height: 60px;
        }
        .pcg-supply:hover { border-color: var(--pcg-border-hover); }
        .pcg-supply.is-selected {
          border-color: var(--pcg-brand); background: var(--pcg-selected-bg);
        }
        .pcg-supply:disabled { opacity: 0.55; cursor: wait; }
        .pcg-supply-left {
          display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;
        }
        .pcg-radio {
          width: 20px; height: 20px; flex-shrink: 0;
          border: 1.5px solid var(--pcg-control-off); background: #fff;
          border-radius: 999px;
          display: flex; align-items: center; justify-content: center;
        }
        .pcg-supply.is-selected .pcg-radio {
          border-color: var(--pcg-brand); background: var(--pcg-brand);
        }
        .pcg-radio-dot {
          width: 7px; height: 7px; border-radius: 999px; background: #fff;
        }
        .pcg-supply-text { display: flex; flex-direction: column; min-width: 0; }
        .pcg-supply-primary { font-weight: 500; font-size: 15px; }
        .pcg-supply-sub {
          font-size: 12px; color: var(--pcg-brand); font-weight: 500; margin-top: 2px;
        }
        .pcg-supply-quantity {
          font-size: 12px; color: var(--pcg-text-muted); font-weight: 500; margin-top: 2px;
        }
        .pcg-dose {
          padding: 10px 8px; border-radius: var(--pcg-inner-radius);
          border: 1.5px solid var(--pcg-border); background: #fff;
          color: var(--pcg-text); font-family: 'Figtree', sans-serif;
          cursor: pointer; font-weight: 500; font-size: 14px;
          min-height: 44px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center; gap: 2px;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcg-dose-main { line-height: 1.2; }
        .pcg-dose-sub {
          font-size: 11px; font-weight: 500; line-height: 1.2;
          color: var(--pcg-text-muted);
        }
        .pcg-dose.is-selected .pcg-dose-sub { color: var(--pcg-text-muted); }
        .pcg-supply-price {
          display: flex; flex-direction: column; align-items: flex-end; gap: 2px;
          font-family: 'Figtree', sans-serif; font-weight: 700; font-size: 16px; flex-shrink: 0;
          text-align: right; white-space: nowrap;
        }
        .pcg-supply-price-was {
          font-size: 12px; font-weight: 500; color: var(--pcg-text-muted);
          text-decoration: line-through;
        }
        .pcg-promo-tag {
          display: inline-block; margin-top: 2px; background: #e3f4ea; color: #0f7a4a;
          font-size: 10.5px; font-weight: 700; border-radius: 20px; padding: 2px 7px; line-height: 1.3;
        }
        .pcg-promo { margin-bottom: 12px; }
        .pcg-promo-row {
          display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px;
        }
        .pcg-promo-input {
          width: 100%; min-width: 0; height: 40px; padding: 0 12px;
          border-radius: var(--pcg-inner-radius); border: 1.5px solid var(--pcg-border);
          background: #fff; color: var(--pcg-text); font-family: inherit; font-size: 14px;
        }
        .pcg-promo-btn {
          height: 40px; padding: 0 14px; border: none; border-radius: var(--pcg-inner-radius);
          background: #FBFAF7; color: var(--pcg-text); font-family: inherit;
          font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .pcg-promo-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .pcg-promo-banner {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          background: #e3f4ea; color: #0f7a4a; border-radius: 8px; padding: 8px 10px;
          margin-bottom: 10px; font-size: 13px; font-weight: 600; line-height: 1.35;
        }
        .pcg-promo-banner small { display: block; font-weight: 400; opacity: 0.85; }
        .pcg-promo-notice {
          background: #fff3d6; color: #8a5a00; border-radius: 8px; padding: 7px 10px;
          margin-bottom: 10px; font-size: 12px; font-weight: 500; line-height: 1.4;
        }
        .pcg-promo-pending {
          color: var(--pcg-text-muted); margin-bottom: 10px; font-size: 12px;
          font-weight: 500; line-height: 1.4;
        }
        .pcg-promo-remove {
          margin: 0 0 10px; padding: 0; border: none; background: none;
          color: var(--pcg-text-muted); font-family: inherit; font-size: 12px;
          font-weight: 600; cursor: pointer; text-decoration: underline;
        }
        .pcg-dose-grid {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px;
        }
        .pcg-dose:hover { border-color: var(--pcg-border-hover); }
        .pcg-dose.is-selected { border-color: var(--pcg-brand); background: var(--pcg-selected-bg); }
        .pcg-dose:disabled { opacity: 0.55; cursor: wait; }
        .pcg-trust {
          display: flex; flex-wrap: wrap; gap: 16px;
          font-size: 11.5px; color: var(--pcg-text-muted);
          margin-top: auto; padding-top: 8px; font-weight: 500;
        }
        .pcg-error {
          margin-top: 10px; font-size: 12.5px; color: #b42318;
          font-weight: 500; line-height: 1.4;
        }
        .pcg-checkout {
          padding: 14px 16px 28px 16px;
          border-top: 1px solid var(--pcg-border-soft); background: #fff;
        }
        .pcg-checkout-top {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; margin-bottom: 12px; flex-wrap: wrap;
        }
        .pcg-checkout-label {
          font-family: 'Figtree', sans-serif; font-size: 11.5px;
          color: var(--pcg-text-muted); letter-spacing: 0.06em;
          text-transform: uppercase; font-weight: 600;
        }
        .pcg-checkout-price {
          display: flex; flex-direction: column; align-items: flex-end;
          font-family: 'Figtree', sans-serif; font-weight: 700;
          font-size: 26px; letter-spacing: -0.02em; text-align: right;
        }
        .pcg-checkout-price-was {
          font-size: 13px; font-weight: 500; color: var(--pcg-text-muted);
          text-decoration: line-through;
        }
        .pcg-checkout-save {
          margin-top: 2px; font-size: 12px; font-weight: 600; color: #0f7a4a;
        }
        .pcg-checkout-permo {
          font-size: 13px; color: var(--pcg-text-muted);
          font-weight: 400; margin-top: 2px;
        }
        .pcg-cta {
          display: inline-flex; align-items: center; justify-content: center;
          width: 100%; height: 40px; gap: 8px;
          border: none; background: var(--pcg-cta-bg); color: #fff;
          border-radius: 6px; font-family: 'Figtree', sans-serif;
          font-size: 16px; font-weight: 400; cursor: pointer;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .pcg-cta:hover { opacity: 0.85; }
        .pcg-cta:active { transform: scale(0.97); }
        .pcg-cta:disabled { opacity: 0.55; cursor: wait; }
        .pcg-checkout-wrap-mobile {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 1001;
          padding-bottom: env(safe-area-inset-bottom); background: #fff;
        }
        .pcg-checkout-wrap-mobile .pcg-checkout-inner { max-width: 460px; margin: 0 auto; }
        .pcg-checkout-wrap-inline { display: none; }
        @media (min-width: 600px) {
          .pcg-root { max-width: 480px; padding: 24px 16px 28px 16px; }
          .pcg-checkout-wrap-mobile { display: none; }
          .pcg-checkout-wrap-inline { display: block; }
        }
        @media (max-width: 380px) {
          .pcg-dose-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="pcg-root"
        data-strut-sermorelin-oral-card=""
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
              <h1 className="pcg-title">{titleBase}</h1>
              {subtitle && <div className="pcg-subtitle">{subtitle}</div>}
            </div>
          </div>

          {promoApplied && (promoRule || promoQuotes) && (
            <div className="pcg-promo-banner">
              <span>
                Code {promoCode} applied
                <small>{promoRule ? bannerDetail(promoRule) : 'Discount applied on every option.'}</small>
              </span>
              <span aria-hidden="true">✓</span>
            </div>
          )}
          {promoStatus === 'pending' && (
            <div className="pcg-promo-pending">Checking {promoCode || submittedCode}…</div>
          )}
          {promoStatus === 'error' && promoMessage && (
            <div className="pcg-promo-notice">{promoMessage}</div>
          )}
          {!promoApplied && (
            <div className="pcg-promo">
              <div className="pcg-promo-row">
                <input
                  className="pcg-promo-input"
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
                <button type="button" className="pcg-promo-btn" onClick={handleApplyPromo} disabled={!promoCode.trim() || promoStatus === 'pending'}>
                  {promoStatus === 'pending' ? 'Checking…' : 'Apply'}
                </button>
              </div>
            </div>
          )}
          {promoApplied && (
            <button type="button" className="pcg-promo-remove" onClick={handleRemovePromo}>
              Remove code
            </button>
          )}

          <div className="pcg-section">
            <div className="pcg-label-row">{supplyLabel}</div>
            <div className="pcg-supply-list">
              {SUPPLIES.map(s => {
                const isSel = supplyId === s.id;
                const price = selectedDose[s.id] || 0;
                const rowPriceId = selectedDose ? resolvePriceId(selectedDose.id, s.id) : 0;
                const quote = (promoQuotes && rowPriceId && promoQuotes[rowPriceId]) || quotePrice(price, activeRule, rowPriceId);
                const supplySavings = supply1
                  ? calcSavingsDollars(selectedDose.s1, supply1.monthsCount, price, s.monthsCount)
                  : 0;
                const supplyPct = supply1
                  ? calcDiscountPct(selectedDose.s1, supply1.monthsCount, price, s.monthsCount)
                  : 0;
                const showSavings = s.id !== 's1' && supplySavings > 0;
                const trocheCopy = s.trocheCount > 0 && supplyQuantityFormat
                  ? formatQuantityCopy(supplyQuantityFormat, s.trocheCount, 0)
                  : '';
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
                        {trocheCopy && (
                          <div className="pcg-supply-quantity">{trocheCopy}</div>
                        )}
                        {showSavings && (
                          <div className="pcg-supply-sub">
                            {formatSavingsCopy(savingsCopyFormat, supplySavings, supplyPct)}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="pcg-supply-price">
                      {quote.save > 0 && (
                        <span className="pcg-supply-price-was">{formatMoney(quote.base)}</span>
                      )}
                      <span>{formatMoney(quote.final)}</span>
                      {quote.tag ? <span className="pcg-promo-tag">{quote.tag}</span> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pcg-section">
            <div className="pcg-label-row">{doseLabel}</div>
            <div className="pcg-dose-grid">
              {DOSES.map(d => {
                const isSel = doseId === d.id;
                const doseMg = parseDoseMg(d.label);
                const troches = supply?.trocheCount || 0;
                const totalMg = troches > 0 && doseMg > 0
                  ? Math.round(doseMg * troches * 1000) / 1000
                  : 0;
                const doseQtyCopy = totalMg > 0 && doseQuantityFormat
                  ? formatQuantityCopy(doseQuantityFormat, troches, totalMg)
                  : '';
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`pcg-dose ${isSel ? 'is-selected' : ''}`}
                    onClick={() => setDoseId(d.id)}
                    aria-pressed={isSel}
                    disabled={isLoading}
                  >
                    <span className="pcg-dose-main">{d.label}</span>
                    {doseQtyCopy ? <span className="pcg-dose-sub">{doseQtyCopy}</span> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pcg-trust">
            {trustItem1 && <span>✓ {trustItem1}</span>}
            {trustItem2 && <span>✓ {trustItem2}</span>}
          </div>

          {ctaError && <div className="pcg-error">{ctaError}</div>}
        </div>

        <div className="pcg-checkout-wrap-inline">{checkoutBlock(false)}</div>
      </div>

      <div className="pcg-checkout-wrap-mobile">
        <div className="pcg-checkout-inner">{checkoutBlock(true)}</div>
      </div>
    </>
  );
}

export const propSchema = {
  brandColor: { type: 'color', title: 'Brand Color', defaultValue: '#161336' },
  discColor: { type: 'color', title: 'Hero Disc Background', defaultValue: '#f1ece1' },
  bottleImageUrl: {
    type: 'string',
    title: 'Product Image URL',
    defaultValue: 'https://placehold.co/440x440/f1ece1/161336/png?text=Sermorelin+Oral',
  },
  imageFit: { type: 'enum', title: 'Image Fit', defaultValue: 'cover', options: ['cover', 'contain'] },
  textColor: { type: 'color', title: 'Text Color', defaultValue: '#0F1714' },
  textMutedColor: { type: 'color', title: 'Text Color (Muted)', defaultValue: '#6B7670' },
  borderColor: { type: 'color', title: 'Border Color (Default)', defaultValue: '#E5E1D8' },
  borderSoftColor: { type: 'color', title: 'Border Color (Soft)', defaultValue: '#EFECE3' },
  surfaceColor: { type: 'color', title: 'Surface Color', defaultValue: '#FBFAF7' },
  controlOffColor: { type: 'color', title: 'Control Color (off)', defaultValue: '#D9D4C5' },
  borderHoverColor: { type: 'color', title: 'Border Color (Hover)', defaultValue: '#C9C2AF' },
  selectedBgColor: { type: 'color', title: 'Selected Background Tint', defaultValue: '#161336' },
  selectedBgOpacity: { type: 'number', title: 'Selected Background Opacity', defaultValue: 0.06, min: 0, max: 1, step: 0.01 },

  titleBase: { type: 'string', title: 'Product Title', defaultValue: 'Sermorelin Oral' },
  subtitle: {
    type: 'string',
    title: 'Subtitle',
    defaultValue: 'Growth hormone support · compounded Sermorelin troche by a US licensed pharmacy',
  },
  supplyLabel: { type: 'string', title: 'Supply Section Label', defaultValue: 'Supply' },
  doseLabel: { type: 'string', title: 'Dose Section Label', defaultValue: 'Dose' },

  supply1Label: { type: 'string', title: 'Supply 1 Label', defaultValue: '30 day supply' },
  supply1MonthsCount: { type: 'number', title: 'Supply 1 Months', defaultValue: 1, min: 1, step: 1 },
  supply1TrocheCount: { type: 'number', title: 'Supply 1 Troche Count', defaultValue: 30, min: 1, step: 1 },
  supply2Label: { type: 'string', title: 'Supply 2 Label', defaultValue: '90 day supply' },
  supply2MonthsCount: { type: 'number', title: 'Supply 2 Months', defaultValue: 3, min: 1, step: 1 },
  supply2TrocheCount: { type: 'number', title: 'Supply 2 Troche Count', defaultValue: 90, min: 1, step: 1 },
  supply3Label: { type: 'string', title: 'Supply 3 Label', defaultValue: '150 day supply' },
  supply3MonthsCount: { type: 'number', title: 'Supply 3 Months', defaultValue: 5, min: 1, step: 1 },
  supply3TrocheCount: { type: 'number', title: 'Supply 3 Troche Count', defaultValue: 150, min: 1, step: 1 },
  defaultSupplyIndex: { type: 'number', title: 'Default Supply (1–3)', defaultValue: 1, min: 1, max: 3, step: 1 },

  supplyQuantityFormat: { type: 'string', title: 'Supply Quantity Copy', defaultValue: '{count} troches' },
  doseQuantityFormat: { type: 'string', title: 'Dose Total Quantity Copy', defaultValue: '{totalMg} mg total' },

  dose1Label: { type: 'string', title: 'Dose 1 Label', defaultValue: '0.5mg' },
  dose1Supply1Price: { type: 'number', title: 'Dose 1 — 30 day Price ($)', defaultValue: 99, min: 0, step: 1 },
  dose1Supply2Price: { type: 'number', title: 'Dose 1 — 90 day Price ($)', defaultValue: 159, min: 0, step: 1 },
  dose1Supply3Price: { type: 'number', title: 'Dose 1 — 150 day Price ($)', defaultValue: 319, min: 0, step: 1 },
  dose2Label: { type: 'string', title: 'Dose 2 Label', defaultValue: '0.75mg' },
  dose2Supply1Price: { type: 'number', title: 'Dose 2 — 30 day Price ($)', defaultValue: 109, min: 0, step: 1 },
  dose2Supply2Price: { type: 'number', title: 'Dose 2 — 90 day Price ($)', defaultValue: 179, min: 0, step: 1 },
  dose2Supply3Price: { type: 'number', title: 'Dose 2 — 150 day Price ($)', defaultValue: 349, min: 0, step: 1 },
  dose3Label: { type: 'string', title: 'Dose 3 Label', defaultValue: '1mg' },
  dose3Supply1Price: { type: 'number', title: 'Dose 3 — 30 day Price ($)', defaultValue: 139, min: 0, step: 1 },
  dose3Supply2Price: { type: 'number', title: 'Dose 3 — 90 day Price ($)', defaultValue: 199, min: 0, step: 1 },
  dose3Supply3Price: { type: 'number', title: 'Dose 3 — 150 day Price ($)', defaultValue: 379, min: 0, step: 1 },
  defaultDoseIndex: { type: 'number', title: 'Default Dose (1–3)', defaultValue: 1, min: 1, max: 3, step: 1 },

  savingsCopyFormat: { type: 'string', title: 'Savings Copy', defaultValue: 'Save {amount} ({pct} off)' },
  trustItem1: { type: 'string', title: 'Trust Item 1', defaultValue: 'Doctor consult' },
  trustItem2: { type: 'string', title: 'Trust Item 2', defaultValue: 'FDA-registered pharmacy' },
  totalLabel: { type: 'string', title: 'Total Label', defaultValue: 'Total today' },
  ctaLabel: { type: 'string', title: 'CTA Label', defaultValue: 'Add to cart' },
  ctaBgColor: { type: 'color', title: 'CTA Button Color', defaultValue: '#161336' },
  cardRadius: { type: 'number', title: 'Card Border Radius', defaultValue: 22, min: 0, max: 32, step: 1 },
  innerRadius: { type: 'number', title: 'Inner Element Radius', defaultValue: 12, min: 0, max: 24, step: 1 },
};

export const outputSchema = {
  type: 'object',
  fields: {
    doseId: 'string',
    doseLabel: 'string',
    supplyId: 'string',
    supplyLabel: 'string',
    supplyMonthsCount: 'number',
    trocheCount: 'number',
    totalDosageMg: 'number',
    listPrice: 'number',
    totalPrice: 'number',
    couponCode: 'string',
    discountAmount: 'number',
    effectiveMonthly: 'number',
    priceId: 'number',
    sku: 'string',
    productSlug: 'string',
    env: 'string',
  },
};

export { effMonthlyPrice, calcSavingsDollars, calcDiscountPct, formatSavingsCopy };
