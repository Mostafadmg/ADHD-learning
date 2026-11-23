// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect, useMemo, useRef } from 'react';

/* ============================================================
   PAROXETINERX — PathwAI pricing card

   Paste into the Paroxetine PathwAI add-to-cart / product-selection card.
   Requires pathwai-paroxetine-sdk.js on the flow event.

   Production (checkout.struthealth.com/ParoxetineRx):
     b1|s1  2120  $49   10 Doses — PAROXETINE 20MG + TADALAFIL 20MG
     b2|s1  2121  $69   10 Doses — PAROXETINE 40MG + TADALAFIL 20MG
     b3|s1  2122  $99   10 Doses — PAROXETINERX MAX 2.0
     b4|s1  2126  $139  10 Doses — PAROXETINERX MAX 2.0 — DOUBLE
     b1|s2  2123  $129  30 Doses — PAROXETINE 20MG + TADALAFIL 20MG
     b2|s2  2124  $179  30 Doses — PAROXETINE 40MG + TADALAFIL 20MG
     b3|s2  2125  $249  30 Doses — PAROXETINERX MAX 2.0
     b4|s2  2127  $299  30 Doses — PAROXETINERX MAX 2.0 — DOUBLE
   Staging (checkout.strut-test.com/ParoxetineRx):
     b1|s1  2236  $49   10 Doses — PAROXETINE 20MG + TADALAFIL 20MG
     b2|s1  2237  $69   10 Doses — PAROXETINE 40MG + TADALAFIL 20MG
     b3|s1  2238  $99   10 Doses — PAROXETINERX MAX 2.0
     b4|s1  2242  $139  10 Doses — PAROXETINERX MAX 2.0 — DOUBLE
     b1|s2  2239  $129  30 Doses — PAROXETINE 20MG + TADALAFIL 20MG
     b2|s2  2240  $179  30 Doses — PAROXETINE 40MG + TADALAFIL 20MG
     b3|s2  2241  $249  30 Doses — PAROXETINERX MAX 2.0
     b4|s2  2243  $299  30 Doses — PAROXETINERX MAX 2.0 — DOUBLE

   Env: window.strut_env = 'staging' | 'production' (set in pathwai-paroxetine-sdk.js).

   Add to cart → strut.validateVisiting → pathwai.flow.next()

   Promo codes are read from the URL (?promo= or ?coupon=), session storage, or the
   field on this card, then checked once when Apply is clicked. A valid code is priced
   for every formulation/supply option on this card. Changing options uses that result
   and does not ask the server again. The discount never drops a price below $0. A code
   the backend rejects keeps base pricing and does not block Add to cart. The cart shows
   the discounted price. The order line stays at the catalog price, and ApplyPromoCode
   is the only deduction stored on the order.
============================================================ */

const PAROXETINE_SLUG = 'ParoxetineRx';

type ComboEntry = {
  slug: string;
  priceId: number;
  productId: string;
  name: string;
};

const COMBO_MAP_PROD: Record<string, ComboEntry> = {
  'b1|s1': { slug: PAROXETINE_SLUG, priceId: 2120, productId: '2120', name: '20MG + Tadalafil — 30 day' },
  'b1|s2': { slug: PAROXETINE_SLUG, priceId: 2123, productId: '2123', name: '20MG + Tadalafil — 90 day' },
  'b2|s1': { slug: PAROXETINE_SLUG, priceId: 2121, productId: '2121', name: '40MG + Tadalafil — 30 day' },
  'b2|s2': { slug: PAROXETINE_SLUG, priceId: 2124, productId: '2124', name: '40MG + Tadalafil — 90 day' },
  'b3|s1': { slug: PAROXETINE_SLUG, priceId: 2122, productId: '2122', name: 'MAX 2.0 — 30 day' },
  'b3|s2': { slug: PAROXETINE_SLUG, priceId: 2125, productId: '2125', name: 'MAX 2.0 — 90 day' },
  'b4|s1': { slug: PAROXETINE_SLUG, priceId: 2126, productId: '2126', name: 'MAX 2.0 Double — 30 day' },
  'b4|s2': { slug: PAROXETINE_SLUG, priceId: 2127, productId: '2127', name: 'MAX 2.0 Double — 90 day' },
};

const COMBO_MAP_STAGING: Record<string, ComboEntry> = {
  'b1|s1': { slug: PAROXETINE_SLUG, priceId: 2236, productId: '2236', name: '20MG + Tadalafil — 30 day' },
  'b1|s2': { slug: PAROXETINE_SLUG, priceId: 2239, productId: '2239', name: '20MG + Tadalafil — 90 day' },
  'b2|s1': { slug: PAROXETINE_SLUG, priceId: 2237, productId: '2237', name: '40MG + Tadalafil — 30 day' },
  'b2|s2': { slug: PAROXETINE_SLUG, priceId: 2240, productId: '2240', name: '40MG + Tadalafil — 90 day' },
  'b3|s1': { slug: PAROXETINE_SLUG, priceId: 2238, productId: '2238', name: 'MAX 2.0 — 30 day' },
  'b3|s2': { slug: PAROXETINE_SLUG, priceId: 2241, productId: '2241', name: 'MAX 2.0 — 90 day' },
  'b4|s1': { slug: PAROXETINE_SLUG, priceId: 2242, productId: '2242', name: 'MAX 2.0 Double — 30 day' },
  'b4|s2': { slug: PAROXETINE_SLUG, priceId: 2243, productId: '2243', name: 'MAX 2.0 Double — 90 day' },
};

const COMBO_MAP_PROD_JSON = JSON.stringify(COMBO_MAP_PROD);
const COMBO_MAP_STAGING_JSON = JSON.stringify(COMBO_MAP_STAGING);

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
  strut_paroxetine_price_id?: number;
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
  __STRUT_PRODUCT_NAME__?: string;
  location?: { href: string };
};

function host(): StrutHost {
  return window as unknown as StrutHost;
}

function isStagingEnv() {
  if (typeof window === 'undefined') return false;
  const w = host();
  const api = String(w.strut?.ENV?.api || '');
  if (/checkout-api\.struthealth\.com/i.test(api)) return false;
  if (/checkout-api\.strut-test\.com/i.test(api)) return true;
  const explicit = String(w.strut_env || '').toLowerCase();
  if (explicit === 'production' || explicit === 'prod') return false;
  if (explicit === 'staging') return true;
  const href = typeof window.location !== 'undefined' ? window.location.href : '';
  return /strut-test/i.test(href);
}

function resolveComboPriceId(comboKey: string, comboEntry: ComboEntry | undefined) {
  const fromMap = Number(comboEntry?.priceId || 0);
  if (fromMap > 0) return fromMap;
  try {
    const fromSdk = Number(host().strut?.skuId?.(comboKey) || 0);
    if (fromSdk > 0) return fromSdk;
  } catch { /* ignore */ }
  return fromMap;
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

const PAROXETINE_SUPPLY2_LABEL = '30 doses · 90 day supply';

/** PathwAI saves supply labels on the card; older flows used plain "90 day supply". */
function resolveParoxetineSupply2Label(label: string) {
  const trimmed = String(label || '').trim();
  if (!trimmed) return PAROXETINE_SUPPLY2_LABEL;
  if (/^90\s*day\s*(supply|order)$/i.test(trimmed)) return PAROXETINE_SUPPLY2_LABEL;
  return trimmed;
}

function hexToRgba(hex: string, alpha: number) {
  const clean = String(hex || '').replace('#', '');
  if (clean.length !== 6) return `rgba(22, 19, 54, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function validateVisitingSlug(_priceId?: number): string {
  return PAROXETINE_SLUG;
}

const PROMO_SESSION_KEY = 'strut.paroxetine.promo';
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


export default function ParoxetinePricingCard({
  brandColor = '#161336',
  discColor = '#f1ece1',
  bottleImageUrl = 'https://placehold.co/440x440/f1ece1/161336/png?text=ParoxetineRx',
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
  titleBase = 'ParoxetineRx',
  subtitle = 'Compounded by a US licensed pharmacy',
  bundleSectionLabel = 'Choose your formulation',
  bundle1Title = '20MG + Tadalafil',
  bundle1Ingredients = 'Paroxetine 20mg + Tadalafil 20mg',
  bundle1Supply1Price = 49,
  bundle1Supply2Price = 129,
  bundle1Badge = '',
  bundle1Caption = '',
  bundle2Title = '40MG + Tadalafil',
  bundle2Ingredients = 'Paroxetine 40mg + Tadalafil 20mg',
  bundle2Supply1Price = 69,
  bundle2Supply2Price = 179,
  bundle2Badge = '',
  bundle2Caption = '',
  bundle3Title = 'MAX 2.0',
  bundle3Ingredients = 'Paroxetine 20mg + Sildenafil 60mg + Tadalafil 7.5mg + Apomorphine 2mg',
  bundle3Supply1Price = 99,
  bundle3Supply2Price = 249,
  bundle3Badge = 'Most popular',
  bundle3Caption = '',
  bundle4Title = 'MAX 2.0 Double',
  bundle4Ingredients = 'Paroxetine 20mg + Sildenafil 60mg + Tadalafil 7.5mg + Apomorphine 2mg · double dose',
  bundle4Supply1Price = 139,
  bundle4Supply2Price = 299,
  bundle4Badge = '',
  bundle4Caption = '',
  bundle5Title = '',
  bundle5Ingredients = '',
  bundle5Supply1Price = 0,
  bundle5Supply2Price = 0,
  bundle5Badge = '',
  bundle5Caption = '',
  defaultBundleIndex = 1,
  supply1Label = '10 doses · 30 day order',
  supply1MonthsCount = 1,
  supply2Label = '30 doses · 90 day supply',
  supply2MonthsCount = 3,
  defaultSupplyIndex = 1,
  fromPriceLabel = 'from',
  savingsCopyFormat = 'Save {amount} ({pct} off)',
  showAddon = 'false' as string | boolean,
  addonLabel = 'Add a daily multivitamin',
  addonDescription = 'Delivered with your first order',
  addonNoteText = 'no extra cost',
  addonPrice = 0,
  addonDefaultOn = 'false' as string | boolean,
  trustItem1 = 'Doctor consult',
  trustItem2 = 'FDA-registered pharmacy',
  totalLabel = 'Total today',
  ctaLabel = 'Add to cart',
  borderRadius = 12,
  onCta = null as null | ((payload: Record<string, unknown>) => void),
  comboMap = COMBO_MAP_PROD_JSON,
  comboMapStaging = COMBO_MAP_STAGING_JSON,
  onChange = null as null | ((payload: Record<string, unknown>) => void),
}) {
  const showAddonBool = showAddon === 'true' || showAddon === true;
  const addonDefaultOnBool = addonDefaultOn === 'true' || addonDefaultOn === true;

  const BUNDLES = useMemo(() => {
    return [
      { id: 'b1', title: bundle1Title, ingredients: bundle1Ingredients, s1: Number(bundle1Supply1Price) || 0, s2: Number(bundle1Supply2Price) || 0, badge: bundle1Badge, caption: bundle1Caption },
      { id: 'b2', title: bundle2Title, ingredients: bundle2Ingredients, s1: Number(bundle2Supply1Price) || 0, s2: Number(bundle2Supply2Price) || 0, badge: bundle2Badge, caption: bundle2Caption },
      { id: 'b3', title: bundle3Title, ingredients: bundle3Ingredients, s1: Number(bundle3Supply1Price) || 0, s2: Number(bundle3Supply2Price) || 0, badge: bundle3Badge, caption: bundle3Caption },
      { id: 'b4', title: bundle4Title, ingredients: bundle4Ingredients, s1: Number(bundle4Supply1Price) || 0, s2: Number(bundle4Supply2Price) || 0, badge: bundle4Badge, caption: bundle4Caption },
      { id: 'b5', title: bundle5Title, ingredients: bundle5Ingredients, s1: Number(bundle5Supply1Price) || 0, s2: Number(bundle5Supply2Price) || 0, badge: bundle5Badge, caption: bundle5Caption },
    ].filter(b => b.title && (b.s1 > 0 || b.s2 > 0));
  }, [
    bundle1Title, bundle1Ingredients, bundle1Supply1Price, bundle1Supply2Price, bundle1Badge, bundle1Caption,
    bundle2Title, bundle2Ingredients, bundle2Supply1Price, bundle2Supply2Price, bundle2Badge, bundle2Caption,
    bundle3Title, bundle3Ingredients, bundle3Supply1Price, bundle3Supply2Price, bundle3Badge, bundle3Caption,
    bundle4Title, bundle4Ingredients, bundle4Supply1Price, bundle4Supply2Price, bundle4Badge, bundle4Caption,
    bundle5Title, bundle5Ingredients, bundle5Supply1Price, bundle5Supply2Price, bundle5Badge, bundle5Caption,
  ]);

  const SUPPLIES = useMemo(() => {
    return [
      { id: 's1', label: supply1Label, monthsCount: Number(supply1MonthsCount) || 1 },
      { id: 's2', label: resolveParoxetineSupply2Label(supply2Label), monthsCount: Number(supply2MonthsCount) || 1 },
    ].filter(s => s.label);
  }, [supply1Label, supply1MonthsCount, supply2Label, supply2MonthsCount]);

  const [bundleId, setBundleId] = useState(() => {
    const idx = Math.max(0, Math.min(BUNDLES.length - 1, (Number(defaultBundleIndex) || 1) - 1));
    return BUNDLES[idx]?.id || BUNDLES[0]?.id || 'b1';
  });

  const [supplyId, setSupplyId] = useState(() => {
    const idx = Math.max(0, Math.min(SUPPLIES.length - 1, (Number(defaultSupplyIndex) || 1) - 1));
    return SUPPLIES[idx]?.id || SUPPLIES[0]?.id || 's1';
  });

  const [withAddon, setWithAddon] = useState(showAddonBool && addonDefaultOnBool);
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
    if (BUNDLES.length && !BUNDLES.find(b => b.id === bundleId)) {
      setBundleId(BUNDLES[0].id);
    }
  }, [BUNDLES, bundleId]);

  useEffect(() => {
    if (SUPPLIES.length && !SUPPLIES.find(s => s.id === supplyId)) {
      setSupplyId(SUPPLIES[0].id);
    }
  }, [SUPPLIES, supplyId]);

  useEffect(() => {
    if (!showAddonBool && withAddon) setWithAddon(false);
  }, [showAddonBool, withAddon]);

  const staging = isStagingEnv();
  const parsedComboMap = staging ? COMBO_MAP_STAGING : COMBO_MAP_PROD;

  const bundle = BUNDLES.find(b => b.id === bundleId) || BUNDLES[0];
  const supply = SUPPLIES.find(s => s.id === supplyId) || SUPPLIES[0];
  const supply1 = SUPPLIES.find(s => s.id === 's1');
  const comboKey = `${bundleId}|${supplyId}`;
  const comboEntry = parsedComboMap[comboKey] || ({} as ComboEntry);
  const resolvedSlug = PAROXETINE_SLUG;
  const resolvedPriceId = resolveComboPriceId(comboKey, comboEntry);
  const missingSlug = !resolvedPriceId;

  const listPrice = bundle ? (bundle[supplyId as 's1' | 's2'] || 0) : 0;
  const allSkuRows = useMemo(() => {
    const rows: { priceId: number; list: number }[] = [];
    for (const b of BUNDLES) {
      for (const s of SUPPLIES) {
        const key = `${b.id}|${s.id}`;
        const entry = parsedComboMap[key];
        const priceId = resolveComboPriceId(key, entry);
        const list = Number(b[s.id as 's1' | 's2'] || 0);
        if (priceId > 0 && list > 0) rows.push({ priceId, list });
      }
    }
    return rows;
  }, [BUNDLES, SUPPLIES, staging]);
  const selectedRef = useRef({ priceId: resolvedPriceId, listPrice });
  selectedRef.current = { priceId: resolvedPriceId, listPrice };
  const activeRule = promoApplied ? promoRule : null;
  const selectedCached = resolvedPriceId && promoQuotes ? promoQuotes[resolvedPriceId] : null;
  const selectedQuote = selectedCached || quotePrice(listPrice, activeRule, resolvedPriceId);
  const effectiveWithAddon = showAddonBool && withAddon;
  const addonPriceNum = Number(addonPrice) || 0;
  const discountedBundle = selectedQuote.final;
  const totalNow = discountedBundle + (effectiveWithAddon ? addonPriceNum : 0);
  const monthlyEff = effMonthlyPrice(totalNow, supply?.monthsCount || 1);
  const bundlePrice = listPrice;

  const selectedTint = hexToRgba(selectedBgColor, selectedBgOpacity);
  const selectedTintStrong = hexToRgba(selectedBgColor, Math.min(selectedBgOpacity * 2, 0.2));

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
          setPromoMessage('This code is saved. Checkout will apply it if it is valid for ParoxetineRx.');
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
      priceId: resolvedPriceId,
    });
  }, [promoApplied, promoRule, promoQuotes, promoCode, selectedQuote.final, selectedQuote.base, selectedQuote.save, resolvedPriceId]);

  useEffect(() => {
    if (!promoApplied || !promoCode || !resolvedPriceId) return;
    trackPromoDisplayed({
      coupon_code: promoCode,
      discount_amount: selectedQuote.save,
      product_id: String(resolvedPriceId),
    });
  }, [promoApplied, promoCode, resolvedPriceId, selectedQuote.save]);

  useEffect(() => {
    if (!onChange || !bundle || !supply) return;
    const coupon = (promoApplied || promoHeld) ? promoCode : '';
    const discount = promoApplied ? selectedQuote.save : 0;
    onChange({
      bundleId,
      bundleTitle: bundle.title,
      bundleIngredients: bundle.ingredients,
      bundleBadge: bundle.badge,
      supplyId,
      supplyLabel: supply.label,
      supplyMonthsCount: supply.monthsCount,
      bundlePrice,
      listPrice,
      withAddon: effectiveWithAddon,
      addonPrice: effectiveWithAddon ? addonPriceNum : 0,
      totalPrice: totalNow,
      couponCode: coupon,
      coupon,
      discountAmount: discount,
      discount,
      effectiveMonthly: monthlyEff,
      slug: resolvedSlug,
      priceId: resolvedPriceId,
    });
  }, [
    bundleId, bundle, supplyId, supply, bundlePrice, listPrice, effectiveWithAddon, addonPriceNum,
    totalNow, monthlyEff, onChange, resolvedSlug, resolvedPriceId, promoApplied, promoHeld, promoCode, selectedQuote.save,
  ]);

  if (!BUNDLES.length || !SUPPLIES.length) {
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
        Configure at least one bundle and one supply.
      </div>
    );
  }

  const handleCta = async () => {
    setCtaError(null);
    if (missingSlug) {
      setCtaError('This option is not available right now. Please choose another or contact support.');
      return;
    }
    setIsLoading(true);

    const pid = Number(resolvedPriceId);
    const cartLabel = comboEntry.name || `${titleBase} ${bundle.title} (${supply.label})`;
    const coupon = (promoApplied || promoHeld) ? promoCode : '';
    const discount = promoApplied ? selectedQuote.save : 0;
    const payload = {
      bundleId,
      bundleTitle: bundle.title,
      supplyId,
      supplyLabel: supply.label,
      bundlePrice,
      listPrice,
      totalPrice: totalNow,
      couponCode: coupon,
      coupon,
      discountAmount: discount,
      discount,
      slug: resolvedSlug,
      priceId: pid,
    };

    try {
      if (onCta) {
        onCta(payload);
        return;
      }

      const w = host();
      try { w.strut_paroxetine_price_id = pid; } catch { /* ignore */ }

      const cartOpts = {
        priceId: pid,
        label: cartLabel,
        price: totalNow,
        totalPrice: totalNow,
        listPrice,
        discount,
        discountAmount: discount,
        coupon,
        couponCode: coupon,
        bundleTitle: bundle.title,
        supplyLabel: supply.label,
        force: true,
      };

      const syncCartState = () => {
        if (typeof w.strut?.ensurePathwaiCart === 'function') {
          w.strut.ensurePathwaiCart(cartOpts);
        } else {
          const cartApi = w.pathwai?.cart;
          if (cartApi?.clearCart && cartApi?.addItem) {
            cartApi.clearCart();
            cartApi.addItem({
              id: comboEntry.productId || String(pid),
              name: cartLabel,
              price: totalNow,
              totalPrice: totalNow,
              listPrice,
              originalPrice: listPrice,
              discount,
              discountAmount: discount,
              coupon,
              couponCode: coupon,
              quantity: 1,
              variants: [{ name: 'Plan', value: bundle.title }, { name: 'Supply', value: supply.label }],
            });
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
        await w.strut.addToCart(pid, {
          price: totalNow,
          totalPrice: totalNow,
          listPrice,
          discount,
          discountAmount: discount,
          coupon,
          couponCode: coupon,
          label: cartLabel,
          bundleTitle: bundle.title,
          supplyLabel: supply.label,
        });
        return;
      }

      if (typeof w.strut?.validateVisiting !== 'function') {
        throw new Error('Paroxetine SDK not loaded — paste pathwai-paroxetine-sdk.js into the flow event');
      }

      console.log('[paroxetine] add to cart', {
        env: staging ? 'staging' : 'production',
        comboKey,
        slug: resolvedSlug,
        priceId: pid,
        displayedTotal: totalNow,
        listPrice,
        discount,
        coupon,
        api: w.strut?.ENV?.api,
      });

      await w.strut.validateVisiting(resolvedSlug, pid, { coupon: coupon || null });
      syncCartState();

      try {
        const productName = w.__STRUT_PRODUCT_NAME__ || titleBase;
        w.pwPushGtm?.('Added to Cart', {
          AddedItemProductID: productName,
          variant_name: comboEntry?.name || '',
          price: totalNow,
          list_price: listPrice,
          discount_amount: discount,
          coupon_code: coupon,
        });
      } catch { /* ignore */ }

      w.pathwai?.flow?.next?.();
    } catch (e) {
      setCtaError(e instanceof Error ? e.message : 'Something went wrong starting your order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{
        flexShrink: 0,
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
        color: 'currentColor',
      }}
    >
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap');
        .pcb-root, .pcb-root * { box-sizing: border-box; }
        .pcb-root {
          font-family: 'Figtree', system-ui, sans-serif;
          color: var(--pcb-text);
          background: transparent;
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          padding: 4px 16px 20px 16px;
          display: flex;
          flex-direction: column;
        }
        .pcb-body { display: flex; flex-direction: column; flex: 1; }
        .pcb-card {
          background: #fff;
          border-radius: var(--pcb-radius);
          padding: 28px 20px 24px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pcb-hero { display: flex; justify-content: center; margin-bottom: 20px; }
        .pcb-disc {
          width: 200px; height: 200px; max-width: 100%;
          border-radius: 999px; background: var(--pcb-disc);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
        }
        .pcb-disc img {
          width: var(--pcb-img-size, 100%);
          height: var(--pcb-img-size, 100%);
          object-fit: var(--pcb-img-fit, cover);
        }
        .pcb-title-wrap { text-align: center; }
        .pcb-title {
          font-family: 'Figtree', sans-serif;
          font-weight: 600; font-size: 20px; line-height: 1.2;
          letter-spacing: -0.01em; margin: 0 0 6px 0;
          color: var(--pcb-text); overflow-wrap: anywhere;
        }
        .pcb-subtitle {
          font-family: 'Figtree', sans-serif;
          font-size: 13px; color: var(--pcb-text-muted);
          font-weight: 400; line-height: 1.4;
        }
        .pcb-label-row {
          font-family: 'Figtree', sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.04em; line-height: 1.33;
          text-transform: uppercase; color: var(--pcb-text);
          margin-bottom: 10px;
        }
        .pcb-bundle-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .pcb-bundle {
          border-radius: var(--pcb-radius);
          border: 1.5px solid var(--pcb-border);
          background: #fff; overflow: hidden;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcb-bundle:hover { border-color: var(--pcb-border-hover); }
        .pcb-bundle.is-expanded {
          border-color: var(--pcb-brand);
          background: var(--pcb-selected-bg);
        }
        .pcb-bundle-header {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 16px; width: 100%;
          background: transparent; border: none; cursor: pointer;
          font-family: 'Figtree', sans-serif; color: var(--pcb-text);
          text-align: left; -webkit-tap-highlight-color: transparent;
        }
        .pcb-bundle-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
        .pcb-bundle-top {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; flex-wrap: wrap;
        }
        .pcb-bundle-top-left { display: flex; align-items: center; gap: 8px; min-width: 0; flex-wrap: wrap; }
        .pcb-bundle-title { font-weight: 600; font-size: 16px; line-height: 1.25; }
        .pcb-bundle-badge {
          font-size: 10.5px; font-weight: 600; color: var(--pcb-brand);
          background: var(--pcb-selected-bg-strong);
          padding: 3px 8px; border-radius: 999px;
          letter-spacing: 0.02em; text-transform: uppercase; white-space: nowrap;
        }
        .pcb-bundle-top-right { display: flex; align-items: center; gap: 8px; color: var(--pcb-text-muted); flex-shrink: 0; }
        .pcb-bundle-from { font-size: 14px; font-weight: 500; color: var(--pcb-text-muted); white-space: nowrap; }
        .pcb-bundle.is-expanded .pcb-bundle-from { display: none; }
        .pcb-bundle-ingredients { font-size: 13px; color: var(--pcb-text-muted); line-height: 1.4; word-break: break-word; }
        .pcb-bundle-caption { font-size: 12px; color: var(--pcb-brand); font-weight: 500; margin-top: 2px; }
        .pcb-radio {
          width: 18px; height: 18px; margin-top: 2px;
          border-radius: 999px; border: 1.5px solid var(--pcb-control-off);
          background: #fff; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcb-bundle.is-expanded .pcb-bundle-header .pcb-radio { border-color: var(--pcb-brand); background: var(--pcb-brand); }
        .pcb-radio-dot { width: 6px; height: 6px; border-radius: 999px; background: #fff; }
        .pcb-supply-section {
          padding: 12px 16px 14px 46px;
          display: flex; flex-direction: column; gap: 8px;
          border-top: 1px solid var(--pcb-border-soft);
        }
        .pcb-supply {
          padding: 12px 14px; border-radius: 10px;
          border: 1.5px solid var(--pcb-border); background: #fff;
          cursor: pointer; display: flex; align-items: center;
          justify-content: space-between; gap: 10px;
          text-align: left; width: 100%;
          font-family: 'Figtree', sans-serif; color: var(--pcb-text);
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcb-supply:hover { border-color: var(--pcb-border-hover); }
        .pcb-supply.is-selected { border-color: var(--pcb-brand); background: var(--pcb-selected-bg); }
        .pcb-supply-left { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
        .pcb-supply.is-selected .pcb-radio { border-color: var(--pcb-brand); background: var(--pcb-brand); }
        .pcb-supply-text { display: flex; flex-direction: column; min-width: 0; }
        .pcb-supply-primary { font-weight: 500; font-size: 14px; }
        .pcb-supply-sub { font-size: 12px; color: var(--pcb-brand); font-weight: 500; margin-top: 2px; }
        .pcb-supply-price {
          display: flex; flex-direction: column; align-items: flex-end; gap: 2px;
          font-weight: 700; font-size: 16px; letter-spacing: -0.01em; flex-shrink: 0;
          text-align: right; white-space: nowrap;
        }
        .pcb-supply-price-was {
          font-size: 12px; font-weight: 500; color: var(--pcb-text-muted);
          text-decoration: line-through;
        }
        .pcb-promo-tag {
          display: inline-block; margin-top: 2px; background: #e3f4ea; color: #0f7a4a;
          font-size: 10.5px; font-weight: 700; border-radius: 20px; padding: 2px 7px; line-height: 1.3;
        }
        .pcb-promo { margin-bottom: 12px; }
        .pcb-promo-row {
          display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px;
        }
        .pcb-promo-input {
          width: 100%; min-width: 0; height: 40px; padding: 0 12px;
          border-radius: var(--pcb-radius); border: 1.5px solid var(--pcb-border);
          background: #fff; color: var(--pcb-text); font-family: inherit; font-size: 14px;
        }
        .pcb-promo-btn {
          height: 40px; padding: 0 14px; border: none; border-radius: var(--pcb-radius);
          background: #FBFAF7; color: var(--pcb-text); font-family: inherit;
          font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .pcb-promo-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .pcb-promo-banner {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          background: #e3f4ea; color: #0f7a4a; border-radius: 8px; padding: 8px 10px;
          margin-bottom: 10px; font-size: 13px; font-weight: 600; line-height: 1.35;
        }
        .pcb-promo-banner small { display: block; font-weight: 400; opacity: 0.85; }
        .pcb-promo-notice {
          background: #fff3d6; color: #8a5a00; border-radius: 8px; padding: 7px 10px;
          margin-bottom: 10px; font-size: 12px; font-weight: 500; line-height: 1.4;
        }
        .pcb-promo-pending {
          color: var(--pcb-text-muted); margin-bottom: 10px; font-size: 12px;
          font-weight: 500; line-height: 1.4;
        }
        .pcb-promo-remove {
          margin: 0 0 10px; padding: 0; border: none; background: none;
          color: var(--pcb-text-muted); font-family: inherit; font-size: 12px;
          font-weight: 600; cursor: pointer; text-decoration: underline;
        }
        .pcb-addon {
          background: var(--pcb-surface); border: 1px solid var(--pcb-border-soft);
          border-radius: var(--pcb-radius); padding: 14px; margin-bottom: 18px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; cursor: pointer; width: 100%;
          font-family: 'Figtree', sans-serif; color: inherit; text-align: left;
        }
        .pcb-addon-body { display: flex; flex-direction: column; min-width: 0; flex: 1; }
        .pcb-addon-top { font-size: 14px; font-weight: 600; }
        .pcb-addon-desc { font-size: 12px; color: var(--pcb-text-muted); margin-top: 4px; line-height: 1.4; }
        .pcb-addon-note { color: var(--pcb-brand); font-weight: 600; }
        .pcb-switch {
          width: 50px; height: 30px; border-radius: 999px;
          background: var(--pcb-control-off); position: relative;
          flex-shrink: 0; border: none; padding: 0; cursor: pointer;
        }
        .pcb-switch.is-on { background: var(--pcb-brand); }
        .pcb-switch::after {
          content: ''; position: absolute; top: 2px; left: 2px;
          width: 26px; height: 26px; border-radius: 999px;
          background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          transition: transform 0.15s ease;
        }
        .pcb-switch.is-on::after { transform: translateX(20px); }
        .pcb-trust {
          display: flex; flex-wrap: wrap; gap: 16px;
          font-size: 12px; color: var(--pcb-text-muted);
          margin-top: auto; padding-top: 8px; font-weight: 500;
        }
        .pcb-checkout { padding: 20px 0 24px 0; }
        .pcb-checkout-top {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; margin-bottom: 18px; flex-wrap: wrap;
        }
        .pcb-checkout-label {
          font-size: 12px; color: var(--pcb-text-muted);
          letter-spacing: 0.04em; text-transform: uppercase;
          font-weight: 700; line-height: 1.33;
        }
        .pcb-checkout-price {
          display: flex; flex-direction: column; align-items: flex-end;
          font-weight: 600; font-size: 22px; letter-spacing: -0.01em; text-align: right;
        }
        .pcb-checkout-price-was {
          font-size: 13px; font-weight: 500; color: var(--pcb-text-muted);
          text-decoration: line-through;
        }
        .pcb-checkout-save {
          margin-top: 2px; font-size: 12px; font-weight: 600; color: #0f7a4a;
        }
        .pcb-checkout-permo { font-size: 13px; color: var(--pcb-text-muted); font-weight: 400; margin-top: 2px; }
        .pcb-cta {
          display: inline-flex; align-items: center; justify-content: center;
          width: 100%; height: 44px; gap: 8px;
          border: none; background: var(--pcb-brand); color: #fff;
          border-radius: 10px; font-family: 'Figtree', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .pcb-cta:hover { opacity: 0.85; }
        .pcb-cta:active { transform: scale(0.97); }
        .pcb-cta:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (min-width: 600px) {
          .pcb-root { max-width: 480px; }
          .pcb-title { font-size: 22px; }
          .pcb-checkout-price { font-size: 28px; }
        }
      `}</style>

      <div
        className="pcb-root"
        style={{
          ['--pcb-brand' as string]: brandColor,
          ['--pcb-disc' as string]: discColor,
          ['--pcb-text' as string]: textColor,
          ['--pcb-text-muted' as string]: textMutedColor,
          ['--pcb-border' as string]: borderColor,
          ['--pcb-border-soft' as string]: borderSoftColor,
          ['--pcb-border-hover' as string]: borderHoverColor,
          ['--pcb-surface' as string]: surfaceColor,
          ['--pcb-control-off' as string]: controlOffColor,
          ['--pcb-selected-bg' as string]: selectedTint,
          ['--pcb-selected-bg-strong' as string]: selectedTintStrong,
          ['--pcb-radius' as string]: `${borderRadius}px`,
        }}
      >
        <div className="pcb-body">
          <div className="pcb-card">
            <div className="pcb-hero">
              <div
                className="pcb-disc"
                style={{
                  ['--pcb-img-fit' as string]: imageFit,
                  ['--pcb-img-size' as string]: imageFit === 'cover' ? '100%' : '78%',
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
            <div className="pcb-title-wrap">
              <h1 className="pcb-title">{titleBase}</h1>
              {subtitle && <div className="pcb-subtitle">{subtitle}</div>}
            </div>
          </div>

          {promoApplied && (promoRule || promoQuotes) && (
            <div className="pcb-promo-banner">
              <span>
                Code {promoCode} applied
                <small>{promoRule ? bannerDetail(promoRule) : 'Discount applied on every option.'}</small>
              </span>
              <span aria-hidden="true">✓</span>
            </div>
          )}
          {promoStatus === 'pending' && (
            <div className="pcb-promo-pending">Checking {promoCode || submittedCode}…</div>
          )}
          {promoStatus === 'error' && promoMessage && (
            <div className="pcb-promo-notice">{promoMessage}</div>
          )}
          {!promoApplied && (
            <div className="pcb-promo">
              <div className="pcb-promo-row">
                <input
                  className="pcb-promo-input"
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
                <button type="button" className="pcb-promo-btn" onClick={handleApplyPromo} disabled={!promoCode.trim() || promoStatus === 'pending'}>
                  {promoStatus === 'pending' ? 'Checking…' : 'Apply'}
                </button>
              </div>
            </div>
          )}
          {promoApplied && (
            <button type="button" className="pcb-promo-remove" onClick={handleRemovePromo}>
              Remove code
            </button>
          )}

          <div className="pcb-label-row">{bundleSectionLabel}</div>
          <div className="pcb-bundle-list">
            {BUNDLES.map(b => {
              const isExpanded = bundleId === b.id;
              const fromCandidates = SUPPLIES.map((s) => {
                const key = `${b.id}|${s.id}`;
                const entry = parsedComboMap[key];
                const rowPriceId = resolveComboPriceId(key, entry);
                const rowList = Number(b[s.id as 's1' | 's2'] || 0);
                const quote = (promoQuotes && rowPriceId && promoQuotes[rowPriceId]) || quotePrice(rowList, activeRule, rowPriceId);
                return quote.final > 0 ? quote.final : rowList;
              }).filter((n) => n > 0);
              const fromPrice = fromCandidates.length ? Math.min(...fromCandidates) : (b.s1 || b.s2);
              return (
                <div key={b.id} className={`pcb-bundle ${isExpanded ? 'is-expanded' : ''}`}>
                  <button
                    type="button"
                    className="pcb-bundle-header"
                    onClick={() => setBundleId(b.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="pcb-radio">
                      {isExpanded && <div className="pcb-radio-dot" />}
                    </div>
                    <div className="pcb-bundle-content">
                      <div className="pcb-bundle-top">
                        <div className="pcb-bundle-top-left">
                          <span className="pcb-bundle-title">{b.title}</span>
                          {b.badge && <span className="pcb-bundle-badge">{b.badge}</span>}
                        </div>
                        <div className="pcb-bundle-top-right">
                          {!isExpanded && fromPrice > 0 && (
                            <span className="pcb-bundle-from">{fromPriceLabel} {formatMoney(fromPrice)}</span>
                          )}
                          <ChevronIcon open={isExpanded} />
                        </div>
                      </div>
                      <div className="pcb-bundle-ingredients">{b.ingredients}</div>
                      {b.caption && <div className="pcb-bundle-caption">{b.caption}</div>}
                    </div>
                  </button>

                  {isExpanded && SUPPLIES.length > 0 && (
                    <div className="pcb-supply-section">
                      {SUPPLIES.map(s => {
                        const isSelSupply = supplyId === s.id;
                        const price = b[s.id as 's1' | 's2'] || 0;
                        const key = `${b.id}|${s.id}`;
                        const entry = parsedComboMap[key];
                        const rowPriceId = resolveComboPriceId(key, entry);
                        const quote = (promoQuotes && rowPriceId && promoQuotes[rowPriceId]) || quotePrice(price, activeRule, rowPriceId);
                        const supplySavings = supply1
                          ? calcSavingsDollars(b.s1, supply1.monthsCount, price, s.monthsCount)
                          : 0;
                        const supplyPct = supply1
                          ? calcDiscountPct(b.s1, supply1.monthsCount, price, s.monthsCount)
                          : 0;
                        const showSavings = s.id !== 's1' && supplySavings > 0;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            className={`pcb-supply ${isSelSupply ? 'is-selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSupplyId(s.id);
                            }}
                            aria-pressed={isSelSupply}
                          >
                            <div className="pcb-supply-left">
                              <div className="pcb-radio">
                                {isSelSupply && <div className="pcb-radio-dot" />}
                              </div>
                              <div className="pcb-supply-text">
                                <span className="pcb-supply-primary">{s.label}</span>
                                {showSavings && (
                                  <span className="pcb-supply-sub">
                                    {formatSavingsCopy(savingsCopyFormat, supplySavings, supplyPct)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="pcb-supply-price">
                              {quote.save > 0 && (
                                <span className="pcb-supply-price-was">{formatMoney(quote.base)}</span>
                              )}
                              <span>{formatMoney(quote.final)}</span>
                              {quote.tag ? <span className="pcb-promo-tag">{quote.tag}</span> : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {showAddonBool && (
            <button
              type="button"
              className="pcb-addon"
              onClick={() => setWithAddon(v => !v)}
              aria-pressed={withAddon}
            >
              <div className="pcb-addon-body">
                <div className="pcb-addon-top">{addonLabel}</div>
                <div className="pcb-addon-desc">
                  {addonDescription}
                  {addonNoteText && (
                    <>
                      {' '}<span className="pcb-addon-note">· {addonNoteText}</span>
                    </>
                  )}
                </div>
              </div>
              <span className={`pcb-switch ${withAddon ? 'is-on' : ''}`} />
            </button>
          )}

          <div className="pcb-trust">
            {trustItem1 && <span>✓ {trustItem1}</span>}
            {trustItem2 && <span>✓ {trustItem2}</span>}
          </div>
        </div>

        <div className="pcb-checkout">
          <div className="pcb-checkout-top">
            <span className="pcb-checkout-label">{totalLabel}</span>
            <span className="pcb-checkout-price">
              {selectedQuote.save > 0 && (
                <span className="pcb-checkout-price-was">{formatMoney(listPrice + (effectiveWithAddon ? addonPriceNum : 0))}</span>
              )}
              <span>{formatMoney(totalNow)}</span>
              {selectedQuote.save > 0 && (
                <span className="pcb-checkout-save">You save {formatMoney(selectedQuote.save)}</span>
              )}
              {monthlyEff > 0 && (supply?.monthsCount || 1) > 1 && (
                <span className="pcb-checkout-permo">· {formatMoney(monthlyEff)}/mo</span>
              )}
            </span>
          </div>
          <button
            type="button"
            className="pcb-cta"
            onClick={handleCta}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Please wait…' : ctaLabel}</span>
            {!isLoading && <span aria-hidden="true">→</span>}
          </button>
          {ctaError ? (
            <div role="alert" style={{ marginTop: 10, color: '#b42318', fontSize: 13, lineHeight: 1.4 }}>
              {ctaError}
            </div>
          ) : null}
        </div>
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
    defaultValue: 'https://placehold.co/440x440/f1ece1/161336/png?text=ParoxetineRx',
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
  titleBase: { type: 'string', title: 'Product Title', defaultValue: 'ParoxetineRx' },
  subtitle: { type: 'string', title: 'Subtitle', defaultValue: 'Compounded by a US licensed pharmacy' },
  bundleSectionLabel: { type: 'string', title: 'Bundle Section Label', defaultValue: 'Choose your formulation' },
  bundle1Title: { type: 'string', title: 'Bundle 1 — Title', defaultValue: '20MG + Tadalafil' },
  bundle1Ingredients: { type: 'string', title: 'Bundle 1 — Ingredients', defaultValue: 'Paroxetine 20mg + Tadalafil 20mg' },
  bundle1Supply1Price: { type: 'number', title: 'Bundle 1 — 30 day Price ($)', defaultValue: 49, min: 0, step: 1 },
  bundle1Supply2Price: { type: 'number', title: 'Bundle 1 — 90 day Price ($)', defaultValue: 129, min: 0, step: 1 },
  bundle1Badge: { type: 'string', title: 'Bundle 1 — Badge', defaultValue: '' },
  bundle1Caption: { type: 'string', title: 'Bundle 1 — Caption', defaultValue: '' },
  bundle2Title: { type: 'string', title: 'Bundle 2 — Title', defaultValue: '40MG + Tadalafil' },
  bundle2Ingredients: { type: 'string', title: 'Bundle 2 — Ingredients', defaultValue: 'Paroxetine 40mg + Tadalafil 20mg' },
  bundle2Supply1Price: { type: 'number', title: 'Bundle 2 — 30 day Price ($)', defaultValue: 69, min: 0, step: 1 },
  bundle2Supply2Price: { type: 'number', title: 'Bundle 2 — 90 day Price ($)', defaultValue: 179, min: 0, step: 1 },
  bundle2Badge: { type: 'string', title: 'Bundle 2 — Badge', defaultValue: '' },
  bundle2Caption: { type: 'string', title: 'Bundle 2 — Caption', defaultValue: '' },
  bundle3Title: { type: 'string', title: 'Bundle 3 — Title', defaultValue: 'MAX 2.0' },
  bundle3Ingredients: { type: 'string', title: 'Bundle 3 — Ingredients', defaultValue: 'Paroxetine 20mg + Sildenafil 60mg + Tadalafil 7.5mg + Apomorphine 2mg' },
  bundle3Supply1Price: { type: 'number', title: 'Bundle 3 — 30 day Price ($)', defaultValue: 99, min: 0, step: 1 },
  bundle3Supply2Price: { type: 'number', title: 'Bundle 3 — 90 day Price ($)', defaultValue: 249, min: 0, step: 1 },
  bundle3Badge: { type: 'string', title: 'Bundle 3 — Badge', defaultValue: 'Most popular' },
  bundle3Caption: { type: 'string', title: 'Bundle 3 — Caption', defaultValue: '' },
  bundle4Title: { type: 'string', title: 'Bundle 4 — Title', defaultValue: 'MAX 2.0 Double' },
  bundle4Ingredients: { type: 'string', title: 'Bundle 4 — Ingredients', defaultValue: 'Paroxetine 20mg + Sildenafil 60mg + Tadalafil 7.5mg + Apomorphine 2mg · double dose' },
  bundle4Supply1Price: { type: 'number', title: 'Bundle 4 — 30 day Price ($)', defaultValue: 139, min: 0, step: 1 },
  bundle4Supply2Price: { type: 'number', title: 'Bundle 4 — 90 day Price ($)', defaultValue: 299, min: 0, step: 1 },
  bundle4Badge: { type: 'string', title: 'Bundle 4 — Badge', defaultValue: '' },
  bundle4Caption: { type: 'string', title: 'Bundle 4 — Caption', defaultValue: '' },
  bundle5Title: { type: 'string', title: 'Bundle 5 — Title (leave empty to hide)', defaultValue: '' },
  bundle5Ingredients: { type: 'string', title: 'Bundle 5 — Ingredients', defaultValue: '' },
  bundle5Supply1Price: { type: 'number', title: 'Bundle 5 — 30 day Price ($)', defaultValue: 0, min: 0, step: 1 },
  bundle5Supply2Price: { type: 'number', title: 'Bundle 5 — 90 day Price ($)', defaultValue: 0, min: 0, step: 1 },
  bundle5Badge: { type: 'string', title: 'Bundle 5 — Badge', defaultValue: '' },
  bundle5Caption: { type: 'string', title: 'Bundle 5 — Caption', defaultValue: '' },
  defaultBundleIndex: { type: 'number', title: 'Default Selected Bundle (1–5)', defaultValue: 1, min: 1, max: 5, step: 1 },
  supply1Label: { type: 'string', title: 'Supply 1 Label', defaultValue: '10 doses · 30 day order' },
  supply1MonthsCount: { type: 'number', title: 'Supply 1 Months', defaultValue: 1, min: 1, step: 1 },
  supply2Label: { type: 'string', title: 'Supply 2 Label', defaultValue: '30 doses · 90 day supply' },
  supply2MonthsCount: { type: 'number', title: 'Supply 2 Months', defaultValue: 3, min: 1, step: 1 },
  defaultSupplyIndex: { type: 'number', title: 'Default Selected Supply (1–2)', defaultValue: 1, min: 1, max: 2, step: 1 },
  fromPriceLabel: { type: 'string', title: 'Collapsed Bundle Price Prefix', defaultValue: 'from' },
  savingsCopyFormat: { type: 'string', title: 'Savings Copy', defaultValue: 'Save {amount} ({pct} off)' },
  showAddon: { type: 'enum', title: 'Show Addon Section', defaultValue: 'false', options: ['true', 'false'] },
  addonLabel: { type: 'string', title: 'Addon Label', defaultValue: 'Add a daily multivitamin' },
  addonDescription: { type: 'string', title: 'Addon Description', defaultValue: 'Delivered with your first order' },
  addonNoteText: { type: 'string', title: 'Addon Note', defaultValue: 'no extra cost' },
  addonPrice: { type: 'number', title: 'Addon Price ($)', defaultValue: 0, min: 0, step: 1 },
  addonDefaultOn: { type: 'enum', title: 'Addon Default On', defaultValue: 'false', options: ['true', 'false'] },
  trustItem1: { type: 'string', title: 'Trust Item 1', defaultValue: 'Doctor consult' },
  trustItem2: { type: 'string', title: 'Trust Item 2', defaultValue: 'FDA-registered pharmacy' },
  totalLabel: { type: 'string', title: 'Total Label', defaultValue: 'Total today' },
  ctaLabel: { type: 'string', title: 'CTA Label', defaultValue: 'Add to cart' },
  comboMap: { type: 'string', title: 'Combo Map — PRODUCTION (JSON)', defaultValue: COMBO_MAP_PROD_JSON },
  comboMapStaging: { type: 'string', title: 'Combo Map — STAGING (JSON)', defaultValue: COMBO_MAP_STAGING_JSON },
  borderRadius: { type: 'number', title: 'Border Radius', defaultValue: 12, min: 0, max: 32, step: 1 },
};

export const outputSchema = {
  type: 'object',
  fields: {
    bundleId: 'string',
    bundleTitle: 'string',
    bundleIngredients: 'string',
    bundleBadge: 'string',
    supplyId: 'string',
    supplyLabel: 'string',
    supplyMonthsCount: 'number',
    bundlePrice: 'number',
    listPrice: 'number',
    withAddon: 'boolean',
    addonPrice: 'number',
    totalPrice: 'number',
    couponCode: 'string',
    discountAmount: 'number',
    effectiveMonthly: 'number',
    slug: 'string',
    priceId: 'number',
  },
};

export {
  effMonthlyPrice,
  calcSavingsDollars,
  calcDiscountPct,
  formatSavingsCopy,
  COMBO_MAP_PROD,
  COMBO_MAP_STAGING,
};
