// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect } from 'react';

/* ============================================================
   Order Summary (Shopping Cart step)
   ------------------------------------------------------------
   Renders the submission cart via window.pathwai.cart.
   Promo codes call window.strut.applyPromoCode → Checkout/ApplyPromoCode.

   MOJO COPY (21 Oct 2026), copied from "Shopping Cart". Changes:
   1. Billing terms state the real recurring amount and frequency
      (from the medication line's supply, e.g. "every 90 days") and that
      labs are a one-time charge.
   2. "Physician Consultation" is "Medical provider review".
   3. Lab line follows the Mojo lab screens (shared price snapshot): the
      regular price crossed out next to what the patient pays. The free
      panel and upgrade prices are only honest once Strut charges the same
      (Vivek's server rule); do not go live before.
   4. Totals: "Total today" crossed out against the regular total, the
      per-month line, and a green "You save".
============================================================ */

/* Shared Mojo price snapshot (localStorage strut.mojo.pricing / window.__STRUT_MOJO_PRICING__).
   The product screen publishes `medication` (priced live by Strut, the same server this screen
   asks) and the lab screens publish `lab` from their own settings. This screen takes the
   medication price and discount from Strut, and the lab line and the per-month wording from
   the snapshot. No prices are typed into code. */
function readPricing(): any {
  try {
    const w = window as any;
    if (w.__STRUT_MOJO_PRICING__) return w.__STRUT_MOJO_PRICING__;
    const raw = window.localStorage.getItem('strut.mojo.pricing');
    return raw ? JSON.parse(raw) : {};
  } catch (_) { return {}; }
}

function supplyDays(item: any): number {
  const parts = [String(item?.name || '')]
    .concat((item?.variants || []).map((v: any) => String(v?.value || '')));
  for (const p of parts) {
    const m = p.match(/(\d+)\s*-?\s*day/i);
    if (m) return Number(m[1]);
    const mo = p.match(/(\d+)\s*-?\s*month/i);
    if (mo) return Number(mo[1]) * 30;
    if (/monthly|per month/i.test(p)) return 30;
  }
  return 0;
}

function billingTerms(items: any[], total: number) {
  const rx = items.find((it) => !isLabLine(it));
  const hasLab = items.some((it) => isLabLine(it));
  const rxPrice = rx ? Number(rx.price || 0) * (Number(rx.quantity) || 1) : 0;
  const days = rx ? supplyDays(rx) : 0;
  const every = days >= 28 && days <= 31 ? 'every month' : days > 0 ? `every ${days} days` : 'for each refill';
  return {
    first: formatPrice(total),
    recurring: rxPrice > 0 ? formatPrice(rxPrice) : 'the medication price',
    every,
    hasLab,
  };
}

function getStrut() {
  return typeof window !== 'undefined' ? (window as any).strut : null;
}

function getPathwaiCart() {
  return typeof window !== 'undefined' ? (window as any).pathwai?.cart : null;
}

function getCouponFromPathwaiOrUrl(): string {
  if (typeof window === 'undefined') return '';
  try {
    const w = window as any;
    /* 0. The Mojo product screen already decided (applied, rejected or removed): follow it, so
          a code removed there is not re-applied from the link here. */
    const snapMed = readPricing().medication;
    if (snapMed && typeof snapMed.requestedCode === 'string') return snapMed.requestedCode.trim();
    const answers = w.pathwai?.flow?.getAnswers?.() || {};

    // 1. Check answers directly or inside variables object
    const flowCoupon = answers.coupon || answers.variables?.coupon;
    if (flowCoupon && String(flowCoupon).trim()) {
      return String(flowCoupon).trim();
    }

    // 2. Fallback: Parse directly from URL search params if PathwAI variables haven't populated yet
    const params = new URLSearchParams(window.location.search);
    const urlCoupon = params.get('coupon');
    if (urlCoupon && urlCoupon.trim()) {
      return urlCoupon.trim();
    }

    // 3. Code entered on the Mojo product screen (Mojo: Product card (compact))
    const mojoCoupon = w.__STRUT_MOJO_COUPON__ || window.localStorage.getItem('strut.mojo.coupon');
    if (mojoCoupon && String(mojoCoupon).trim()) {
      return String(mojoCoupon).trim();
    }
  } catch (_) { /* ignore */ }
  return '';
}

function promoErrorMessage(err: any) {
  if (err?.status === 401) return 'Please sign in to apply a promo code.';
  const body = err?.body;
  if (typeof body === 'string' && body.trim()) return body;
  return (
    body?.Message ||
    body?.message ||
    err?.message ||
    'Could not apply promo code. Please try again.'
  );
}

function readPromoResult(res: any) {
  const discount = Number(res?.OrderDiscount ?? 0);
  const applied = res?.IsAppliedPromoCode === true || discount > 0;
  const code = String(res?.PromoCode || '').trim();
  return { discount, applied, code };
}

const PROMO_SNAPSHOT_KEY = 'strut.enclo.promo';

function persistPromoSnapshot(code: string, discount: number) {
  const snapshot = {
    code: String(code || '').trim(),
    discount: Number(discount || 0),
  };
  try {
    (window as any).__STRUT_ENCLO_PROMO__ = snapshot;
    if (snapshot.discount > 0 && snapshot.code) {
      window.localStorage.setItem(PROMO_SNAPSHOT_KEY, JSON.stringify(snapshot));
    } else {
      window.localStorage.removeItem(PROMO_SNAPSHOT_KEY);
    }
  } catch (_) { /* ignore */ }
}

function isGenericLabName(name: string) {
  const n = String(name || '').trim().toLowerCase();
  return n === 'lab' || n === 'labs' || n === 'lab panel' || n === 'lab panels';
}

function isLabLine(item: CartItem) {
  const id = String(item?.id || '').toLowerCase();
  const name = String(item?.name || '');
  if (id === 'lab-panel' || id === 'preview-lab') return true;
  if (/lab/i.test(name) || /panel/i.test(name)) return true;
  return false;
}

function labLineScore(item: CartItem) {
  const name = String(item?.name || '');
  if (isGenericLabName(name) || item.id === 'lab-panel' || item.id === 'preview-lab') return 0;
  return 1;
}

function dedupeLabLines(items: CartItem[]): CartItem[] {
  const labs: CartItem[] = [];
  const rest: CartItem[] = [];
  for (const it of items || []) {
    if (isLabLine(it)) labs.push(it);
    else rest.push(it);
  }
  if (labs.length <= 1) return [...rest, ...labs];
  const best = labs.reduce((chosen, next) => (labLineScore(next) > labLineScore(chosen) ? next : chosen));
  return [...rest, best];
}

const FOREIGN_CART_RE =
  /testosterone|enclomiphene|semaglutide|sildenafil|tadalafil|tirzepatide|minoxidil|finasteride|dutasteride|paroxetine|sermorelin|estradiol|progesterone|super\s*strut|\bbhrt\b|\bnad\b/i;

function flowBlob() {
  try {
    const w = window as any;
    const visit = w.strut?.getVisiting?.() || {};
    return [
      w.__STRUT_PRODUCT_NAME__,
      visit.ProductSlug,
      visit.ProductName,
    ].join(' ');
  } catch {
    return '';
  }
}

function isTirzepatideFlow() {
  return /tirzepatide/i.test(flowBlob());
}

function isTirzepatideLine(item: CartItem) {
  return /tirzepatide/i.test(String(item?.name || ''));
}

function isMinoxidilFlow() {
  return /minoxidil|oral_minoxidil_men/i.test(flowBlob());
}

function isMinoxidilLine(item: CartItem) {
  const blob = `${item?.id || ''} ${item?.name || ''}`;
  return /minoxidil/i.test(String(item?.name || '')) || /^(2256|2257|797|798)$/.test(String(item?.id || ''));
}

const SERMORELIN_PRICE_IDS = new Set([
  1144, 1145, 1146, 1212, 1213, 2165, 2166, 2167, 2168, 2169, 2170,
  2225, 2226, 2228, 2229, 2230, 2231, 2232, 2233, 2234, 2235,
]);

const SEMAGLUTIDE_INJ_PRICE_IDS = new Set([613, 614, 952, 953]);

const SEMAGLUTIDE_INJ_CATALOG: Record<number, { price: number; label: string }> = {
  613: { price: 289, label: '2.5mg + B6 2mL vial' },
  614: { price: 399, label: '2.5mg + B6 4mL vial' },
  952: { price: 289, label: '2.5mg + B6 2mL vial' },
  953: { price: 399, label: '2.5mg + B6 4mL vial' },
};

function isSermorelinFlow() {
  return /sermorelin/i.test(flowBlob());
}

function isSermorelinLine(item: CartItem) {
  const blob = `${item?.id || ''} ${item?.name || ''}`;
  return /sermorelin/i.test(String(item?.name || '')) || SERMORELIN_PRICE_IDS.has(Number(item?.id || 0));
}

function isSemaglutideInjFlow() {
  const blob = flowBlob();
  return /semaglutide/i.test(blob) && !/semaglutide_oral|semaglutide-oral/i.test(blob);
}

function isSemaglutideInjLine(item: CartItem) {
  const blob = `${item?.id || ''} ${item?.name || ''}`;
  return /semaglutide/i.test(String(item?.name || '')) || SEMAGLUTIDE_INJ_PRICE_IDS.has(Number(item?.id || 0));
}

function readProductDisplaySnapshot() {
  try {
    const w = window as any;
    if (typeof w.pathwai?.getProductDisplay === 'function') {
      return w.pathwai.getProductDisplay();
    }
    const raw = window.localStorage.getItem('pathwai.productDisplay');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function semaglutideInjLineDetails(priceId: number, fallbackName = '', fallbackPrice = 0) {
  const catalog = SEMAGLUTIDE_INJ_CATALOG[priceId];
  const display = readProductDisplaySnapshot();
  const displayMatches = Number(display?.priceId || 0) === priceId
    && /semaglutide/i.test(String(display?.productSlug || ''))
    && !/oral/i.test(String(display?.productSlug || ''));
  return {
    name: String(
      (displayMatches && display?.variantLabel) ||
      catalog?.label ||
      fallbackName ||
      'Semaglutide + B6'
    ).trim(),
    price: Number(
      (displayMatches && display?.price) ||
      catalog?.price ||
      fallbackPrice ||
      0
    ),
  };
}

/** FOREIGN_CART_RE also matches this flow's own product name. Keep that line. */
function isOwnFlowLine(item: CartItem) {
  if (isSemaglutideInjFlow() && isSemaglutideInjLine(item)) return true;
  if (isSermorelinFlow() && isSermorelinLine(item)) return true;
  if (isMinoxidilFlow() && isMinoxidilLine(item)) return true;
  if (isTirzepatideFlow() && isTirzepatideLine(item)) return true;
  return false;
}

function isForeignProductLine(item: CartItem) {
  if (isLabLine(item)) return true;
  if (isOwnFlowLine(item)) return false;
  return FOREIGN_CART_RE.test(`${item?.id || ''} ${item?.name || ''}`);
}

function sanitizeCartItems(items: CartItem[]): CartItem[] {
  const list = Array.isArray(items) ? items : [];
  const onTirz = isTirzepatideFlow() || list.some(isTirzepatideLine);
  const onMinox = isMinoxidilFlow() || list.some(isMinoxidilLine);
  const onSermorelin = isSermorelinFlow() || list.some(isSermorelinLine);
  const onSemaglutideInj = isSemaglutideInjFlow() || list.some(isSemaglutideInjLine);
  if (!onTirz && !onMinox && !onSermorelin && !onSemaglutideInj) return list;
  const cleaned = list.filter((it) => {
    if (onSemaglutideInj && isSemaglutideInjLine(it)) return true;
    if (onSermorelin && isSermorelinLine(it)) return true;
    if (onMinox && isMinoxidilLine(it)) return true;
    if (onTirz && isTirzepatideLine(it)) return true;
    return !isForeignProductLine(it);
  });
  if (onSemaglutideInj) {
    const vials = cleaned.filter(isSemaglutideInjLine);
    return vials.length ? vials : cleaned;
  }
  if (onSermorelin) {
    const doses = cleaned.filter(isSermorelinLine);
    return doses.length ? doses : cleaned;
  }
  if (onMinox) {
    const doses = cleaned.filter(isMinoxidilLine);
    return doses.length ? doses : cleaned;
  }
  const vials = cleaned.filter(isTirzepatideLine);
  return vials.length ? vials : cleaned;
}

function withCartTotals(items: CartItem[]): Cart {
  const unique = sanitizeCartItems(dedupeLabLines(items));
  const subtotal = unique.reduce(
    (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
    0
  );
  return { items: unique, subtotal, total: subtotal };
}

function syncPathwaiCart(items: CartItem[]) {
  try {
    const cartApi = getPathwaiCart();
    if (!cartApi?.clearCart || !cartApi?.addItem || !cartApi?.getCart) return;
    const current = cartApi.getCart()?.items || [];
    const next = sanitizeCartItems(current);
    if (next.length === current.length && items.length === current.length) return;
    cartApi.clearCart();
    next.forEach((it: CartItem) => cartApi.addItem(it));
  } catch { /* ignore */ }
}

function shouldSkipEncloLab() {
  return isTirzepatideFlow() || isMinoxidilFlow() || isSermorelinFlow()
    || /semaglutide|sildenafil|tadalafil|finasteride|dutasteride|bhrt/i.test(flowBlob());
}

/** The checkout product itself matches FOREIGN_CART_RE (finasteride, etc.). Keep that line. */
function isApiProductLine(item: CartItem, apiName: string, apiPriceId: number, apiProductId = 0) {
  const id = String(item?.id || '');
  if (apiPriceId > 0 && id === String(apiPriceId)) return true;
  if (apiProductId > 0 && id === String(apiProductId)) return true;
  const name = String(item?.name || '').trim();
  const product = apiName.trim();
  if (!name || !product) return false;
  if (name.toLowerCase() === product.toLowerCase()) return true;
  const key = product.match(FOREIGN_CART_RE)?.[0];
  return !!key && new RegExp(key, 'i').test(name);
}

function apiProductLine(data: any, apiName: string, apiPriceId: number, rxPrice: number): CartItem {
  const strength = String(data?.Strength || '').trim();
  const supply = String(data?.SubscriptionDurationName || '').trim();
  const variants: CartItemVariant[] = [];
  if (strength) variants.push({ name: 'Strength', value: strength });
  if (supply) variants.push({ name: 'Supply', value: supply });
  return {
    id: String(apiPriceId),
    name: apiName,
    price: rxPrice > 0 ? rxPrice : 0,
    quantity: Number(data?.Quantity || 1) || 1,
    image: data?.ImageUrl || undefined,
    variants: variants.length ? variants : undefined,
  };
}

function readPersistedLab() {
  if (shouldSkipEncloLab()) return null;
  try {
    const w = (window as any).__STRUT_ENCLO_LAB__;
    if (w && Number(w.labPanelId) > 0 && w.skipLabPanelOrder !== true) return w;
    const raw = window.localStorage.getItem('strut.enclo.labSelection');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Number(parsed.labPanelId) > 0 && parsed.skipLabPanelOrder !== true) return parsed;
  } catch (_) { /* ignore */ }
  return null;
}

function mergeApiCart(prev: Cart, data: any): Cart {
  const apiName = String(data?.ProductName || data?.Name || '');
  const apiPriceId = Number(data?.ProductPriceId || 0);
  const apiIsTirzepatide = /tirzepatide/i.test(apiName);
  const apiIsMinoxidil = /minoxidil/i.test(apiName);
  const apiIsSemaglutideInj = /semaglutide/i.test(apiName) || SEMAGLUTIDE_INJ_PRICE_IDS.has(apiPriceId);
  const rxPrice = Number(data?.Price || 0);
  let rxPatched = false;
  let source = sanitizeCartItems(prev.items || []);
  if (!source.length && apiPriceId > 0 && (apiName || apiIsSemaglutideInj)) {
    const semaDetails = apiIsSemaglutideInj
      ? semaglutideInjLineDetails(apiPriceId, apiName, rxPrice)
      : { name: apiName, price: rxPrice > 0 ? rxPrice : 0 };
    source = [{
      id: String(apiPriceId),
      name: semaDetails.name,
      price: semaDetails.price > 0 ? semaDetails.price : (rxPrice > 0 ? rxPrice : 0),
      quantity: Number(data?.Quantity || 1) || 1,
      variants: apiIsSemaglutideInj ? [{
        name: 'Vial size',
        value: apiPriceId === 614 || apiPriceId === 953 ? '4mL Maintenance Dose' : '2mL Starting Dose',
      }] : undefined,
    }];
  }
  const items = source.map((it) => {
    if (!rxPatched && !isLabLine(it) && (rxPrice > 0 || apiIsSemaglutideInj) && (apiIsTirzepatide || apiIsMinoxidil || apiIsSemaglutideInj || (!isTirzepatideFlow() && !isMinoxidilFlow()))) {
      rxPatched = true;
      if (apiIsSemaglutideInj) {
        const semaDetails = semaglutideInjLineDetails(apiPriceId, apiName || it.name, rxPrice || it.price);
        return {
          ...it,
          id: String(apiPriceId || it.id),
          price: semaDetails.price > 0 ? semaDetails.price : it.price,
          name: semaDetails.name || it.name,
          variants: it.variants?.length ? it.variants : [{
            name: 'Vial size',
            value: apiPriceId === 614 || apiPriceId === 953 ? '4mL Maintenance Dose' : '2mL Starting Dose',
          }],
        };
      }
      return { ...it, price: rxPrice, name: apiName || it.name };
    }
    return it;
  });
  const labId = Number(data?.LabPanelId || 0);
  const labPrice = Number(data?.LabPanelPrice || 0);
  const labQty = Number(data?.LabPanelQuantity || 1) || 1;
  const labName = String(data?.LabPanelName || '').trim();
  const persisted = readPersistedLab();
  if (
    isTirzepatideFlow() || isMinoxidilFlow() || isSermorelinFlow() || isSemaglutideInjFlow() || shouldSkipEncloLab()
    || source.some(isTirzepatideLine) || source.some(isMinoxidilLine) || source.some(isSermorelinLine)
    || source.some(isSemaglutideInjLine)
  ) {
    const apiProductId = Number(data?.ProductId || 0);
    const kept = items.filter((it) => {
      if (isLabLine(it)) return false;
      if (isApiProductLine(it, apiName, apiPriceId, apiProductId)) return true;
      return !isForeignProductLine(it);
    });
    if (!kept.length && apiPriceId > 0 && apiName) {
      kept.push(apiProductLine(data, apiName, apiPriceId, rxPrice));
    }
    return withCartTotals(kept);
  }
  let next = dedupeLabLines(items);

  if (!next.some(isLabLine)) {
    if (labId > 0 && labPrice > 0) {
      next.push({
        id: 'lab-panel',
        name: labName || 'Lab panel',
        price: labPrice,
        quantity: labQty,
      });
    } else if (persisted && Number(persisted.labPanelPrice) > 0) {
      next.push({
        id: 'lab-panel',
        name: String(persisted.labPanelName || labName || 'Lab panel'),
        price: Number(persisted.labPanelPrice),
        quantity: Number(persisted.labPanelQuantity) > 0 ? Number(persisted.labPanelQuantity) : 1,
      });
    }
  } else if (labPrice > 0 || labName) {
    next = next.map((it) => {
      if (!isLabLine(it)) return it;
      return {
        ...it,
        name: isGenericLabName(it.name) && labName ? labName : it.name,
        price: labPrice > 0 ? labPrice : it.price,
        quantity: labQty > 0 ? labQty : it.quantity,
      };
    });
  }

  /* Mojo lab offers: the lab line exactly as the lab screens published it. */
  const snapLab = readPricing().lab;
  if (snapLab && next.some(isLabLine)) {
    const paid = Number(snapLab.paid) || 0;
    const offer = {
      id: 'lab-panel',
      name: String(snapLab.name || labName || 'Lab panel'),
      price: paid,
      quantity: 1,
      wasPrice: Math.max(paid, Number(snapLab.regular) || 0),
    } as any;
    next = next.filter((it) => !isLabLine(it)).concat(offer);
  }

  return withCartTotals(next);
}

export const propSchema = {
  buttonText: {
    type: 'string',
    title: 'Checkout Button Text',
    defaultValue: 'Proceed to Checkout',
  },
};

interface CartItemVariant {
  name: string;
  value: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variants?: CartItemVariant[];
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
}

const EMPTY_CART: Cart = { items: [], subtotal: 0, total: 0 };

/** Editor/preview fallback when the cart API is not mounted. */
const PREVIEW_CART: Cart = {
  items: [
    {
      id: 'preview-treatment',
      name: 'Product(Monthly)',
      price: 89,
      quantity: 1,
      variants: [
        { name: 'Strength', value: '12.5mg' },
        { name: 'Supply', value: 'Monthly' },
      ],
    },
    {
      id: 'preview-lab',
      name: 'Lab',
      price: 89,
      quantity: 1,
    },
  ],
  subtotal: 178,
  total: 178,
};

const formatPrice = (price: number) => `$${Number(price || 0).toFixed(2)}`;

const lineTotal = (item: CartItem) => Number(item.price || 0) * Number(item.quantity || 0);

const formatVariants = (variants?: CartItemVariant[]) => {
  if (!variants || variants.length === 0) return '';
  return variants.map((v) => v.value).filter(Boolean).join(' · ');
};

export default function OrderSummary({
  buttonText = 'Proceed to Checkout',
}: {
  buttonText?: string;
}) {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [isPreview, setIsPreview] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoStatus, setPromoStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [promoApplied, setPromoApplied] = useState(false);

  const applyPromoResult = (res: any, fallbackCode = '') => {
    const { discount, applied, code } = readPromoResult(res);
    if (!applied) {
      setDiscountAmount(0);
      setPromoApplied(false);
      setPromoStatus('error');
      setPromoMessage('Promo code is invalid or expired.');
      return false;
    }
    const shownCode = code || fallbackCode;
    setDiscountAmount(discount);
    setPromoApplied(true);
    setPromoStatus('success');
    setPromoCode(shownCode);
    setPromoMessage(`Promo code ${shownCode} applied.`);
    persistPromoSnapshot(shownCode, discount);
    return true;
  };

  const clearPromoState = () => {
    setDiscountAmount(0);
    setPromoApplied(false);
    setPromoStatus('idle');
    setPromoMessage('');
    persistPromoSnapshot('', 0);
  };

  useEffect(() => {
    const cartApi = getPathwaiCart();
    if (!cartApi) {
      setIsPreview(true);
      setCart(PREVIEW_CART);
      return;
    }

    setIsPreview(false);
    const strut = getStrut();
    try {
      if (typeof strut?.ensurePathwaiCart === 'function') {
        strut.ensurePathwaiCart();
      }
      const cleaned = withCartTotals(cartApi.getCart()?.items || []);
      setCart(cleaned);
      syncPathwaiCart(cleaned.items);
    } catch (e) {
      console.error('OrderSummary: failed to read cart', e);
      setCart(EMPTY_CART);
    }

    const handleCartUpdate = (event: CustomEvent<{ cart: Cart }>) => {
      if (!event.detail?.cart) return;
      const cleaned = withCartTotals(event.detail.cart.items || []);
      setCart(cleaned);
    };

    window.addEventListener('pathwai:cart:updated', handleCartUpdate as EventListener);

    const order = strut?.getOrder?.();
    const existingDiscount = Number(order?.Cart?.OrderDiscount || 0);
    let existingCode = String(order?.PromoCodeUsed || order?.Cart?.PromoCode || '').trim();
    
    // Read the coupon variable from PathwAI or URL directly
    const autoCoupon = getCouponFromPathwaiOrUrl();

    if (existingDiscount > 0 || existingCode) {
      setPromoCode(existingCode);
      setDiscountAmount(existingDiscount);
      setPromoApplied(true);
      setPromoStatus('success');
      setPromoMessage(existingCode ? `Promo code ${existingCode} applied.` : 'Promo code applied.');
      persistPromoSnapshot(existingCode, existingDiscount);
    } else if (autoCoupon) {
      setPromoCode(autoCoupon);
    }

    let cancelled = false;
    (async () => {
      if (!strut) return;
      try {
        if (typeof strut.syncSelectedPriceAndPromo === 'function') {
          await strut.syncSelectedPriceAndPromo().catch(() => {});
        } else {
          if (typeof strut.getDosage === 'function') {
            await strut.getDosage().catch(() => {});
          }
          const selectedId = typeof strut.resolveCheckoutPriceId === 'function'
            ? strut.resolveCheckoutPriceId()
            : 0;
          const currentPriceId = Number(strut.getOrder?.()?.Cart?.ProductPriceId || 0);
          if (selectedId && typeof strut.saveDosage === 'function' && currentPriceId !== Number(selectedId)) {
            await strut.saveDosage(selectedId).catch(() => {});
          }

          // Target code: prioritized existing order promo code, or auto code from coupon parameter
          const targetCode = existingCode || autoCoupon;
          if (targetCode && typeof strut.applyPromoCode === 'function') {
            setPromoStatus('pending');
            const res = await strut.applyPromoCode(targetCode).catch((err: any) => {
              setPromoStatus('error');
              setPromoMessage(promoErrorMessage(err));
              return null;
            });
            if (res) {
              applyPromoResult(res, targetCode.toUpperCase());
            }
          }
        }

        if (strut.getCartItem && strut.getOrderId?.()) {
          const data = await strut.getCartItem();
          if (cancelled || !data) return;
          setCart((prev) => mergeApiCart(prev, data));

          const { discount, applied, code } = readPromoResult(data);
          if (applied) {
            setDiscountAmount(discount);
            setPromoApplied(true);
            setPromoStatus('success');
            const finalCode = code || existingCode || autoCoupon;
            if (finalCode) setPromoCode(finalCode);
            setPromoMessage(finalCode ? `Promo code ${finalCode} applied.` : 'Promo code applied.');
            persistPromoSnapshot(finalCode, discount);
          }
        }
      } catch (e) {
        /* cart pricing refresh is optional; local order state is enough */
      }
    })();

    return () => {
      cancelled = true;
      window.removeEventListener('pathwai:cart:updated', handleCartUpdate as EventListener);
    };
  }, []);

  const handleApplyPromo = async () => {
    const code = promoCode.trim();
    if (!code) {
      clearPromoState();
      return;
    }
    if (promoStatus === 'pending') return;

    if (isPreview) {
      setPromoStatus('error');
      setPromoMessage('Promo codes apply in the live checkout, not preview.');
      return;
    }

    const strut = getStrut();
    if (!strut?.applyPromoCode) {
      setPromoStatus('error');
      setPromoMessage('Checkout is not ready. Please try again.');
      return;
    }

    setPromoStatus('pending');
    setPromoMessage('');
    try {
      if (
        typeof strut.syncCheckoutCart === 'function' &&
        (!strut.getOrderId?.() || !strut.getVisitingId?.())
      ) {
        await strut.syncCheckoutCart();
      }
      const res = await strut.applyPromoCode(code);
      applyPromoResult(res, code.toUpperCase());
      try {
        const data = await strut.getCartItem?.();
        if (data) setCart((prev) => mergeApiCart(prev, data));
      } catch (_) { /* cart refresh is optional after a successful promo apply */ }
    } catch (err) {
      setDiscountAmount(0);
      setPromoApplied(false);
      setPromoStatus('error');
      setPromoMessage(promoErrorMessage(err));
    }
  };

  const handleRemovePromo = async () => {
    if (promoStatus === 'pending') return;
    const strut = getStrut();
    if (!strut?.applyPromoCode) {
      clearPromoState();
      setPromoCode('');
      return;
    }
    setPromoStatus('pending');
    setPromoMessage('');
    try {
      await strut.applyPromoCode('');
      setPromoCode('');
      clearPromoState();
      try {
        const data = await strut.getCartItem?.();
        if (data) setCart((prev) => mergeApiCart(prev, data));
      } catch (_) { /* cart refresh is optional after promo remove */ }
    } catch (err) {
      setPromoStatus('error');
      setPromoMessage(promoErrorMessage(err));
    }
  };

  const handleCheckout = () => {
    (window as any).pathwai?.flow?.next('checkout');
  };

  const subtotal = Number(cart.subtotal || 0);
  const total = Math.max(0, Number(cart.total || 0) - Number(discountAmount || 0));
  const items = cart.items || [];
  const checkoutDisabled = (items.length === 0 && !isPreview) || promoStatus === 'pending';
  const terms = billingTerms(items, total);
  /* Same rule as the cart bar: regular total = every line at its regular price (lab offers at
     their crossed-out price); what you pay = the total after Strut's discount; "You save" =
     the difference = (original medication + original labs) - what we charge. */
  const regularTotal = Math.round(items.reduce((sum: number, it: any) => sum + (Number(it.wasPrice) > 0 ? Number(it.wasPrice) : lineTotal(it)), 0) * 100) / 100;
  const totalSaved = Math.max(0, Math.round((regularTotal - total) * 100) / 100);
  const snapMed = readPricing().medication;
  const rxItem = items.find((it: any) => !isLabLine(it));
  const priceLine = snapMed && rxItem && String(snapMed.priceId) === String(rxItem.id) && snapMed.priceLine
    ? String(snapMed.priceLine)
    : '';

  return (
    <div
      style={{
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-element-gap, 1.25rem)',
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
      }}
    >
      <h2
        className="pw-motion-enter"
        style={{
          margin: 0,
          fontFamily: 'var(--pw-font-family-title, inherit)',
          fontSize: 'var(--pw-font-size-title, 1.5rem)',
          fontWeight: 'var(--pw-font-weight-title, 600)',
          color: 'var(--pw-label-fg, inherit)',
          '--pw-motion-enter-delay': '0ms',
        } as React.CSSProperties}
      >
        Order Summary
      </h2>

      <div
        className="pw-motion-enter"
        style={{
          background: 'var(--pw-color-surface, #ffffff)',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          border: '1px solid var(--pw-color-border, #EFEFEC)',
          overflow: 'hidden',
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          '--pw-motion-enter-delay': '100ms',
        } as React.CSSProperties}
      >
        {/* Line Items from cart */}
        <div style={{ padding: 'var(--pw-control-padding, 1rem)' }}>
          {items.length === 0 ? (
            <div
              style={{
                padding: '0.75rem 0',
                color: 'var(--pw-color-muted, #71717a)',
                fontSize: '0.95rem',
              }}
            >
              Your cart is empty.
            </div>
          ) : (
            items.map((item, index) => {
              const variantText = formatVariants(item.variants);
              return (
                <div
                  key={`${item.id}-${index}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid var(--pw-color-border, #EFEFEC)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0 }}>
                    <span style={{ fontWeight: 500 }}>
                      {item.name}
                      {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                    </span>
                    {variantText ? (
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--pw-color-muted, #71717a)',
                        }}
                      >
                        {variantText}
                      </span>
                    ) : null}
                  </div>
                  {(item as any).wasPrice > 0 ? (
                    <span style={{ fontWeight: 500, flexShrink: 0, display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--pw-color-muted, #71717a)', fontWeight: 400 }}>
                        {formatPrice((item as any).wasPrice)}
                      </span>
                      <span>{lineTotal(item) > 0 ? formatPrice(lineTotal(item)) : 'Free'}</span>
                    </span>
                  ) : (
                    <span style={{ fontWeight: 500, flexShrink: 0 }}>{formatPrice(lineTotal(item))}</span>
                  )}
                </div>
              );
            })
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '0.75rem 0',
              borderBottom: '1px solid var(--pw-color-border, #EFEFEC)',
            }}
          >
            <span style={{ fontWeight: 500 }}>Medical provider review</span>
            <span style={{ fontWeight: 500 }}>Included</span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '0.75rem 0',
            }}
          >
            <span style={{ fontWeight: 500 }}>Shipping</span>
            <span style={{ fontWeight: 500 }}>Included</span>
          </div>
        </div>

        {/* Promo Code Section */}
        <div
          style={{
            padding: 'var(--pw-control-padding, 1rem)',
            borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
            background: 'var(--pw-color-background, #f9fafb)',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              gap: '0.5rem',
              width: '100%',
              minWidth: 0,
              alignItems: 'stretch',
            }}
          >
            <input
              type="text"
              placeholder="Promo Code"
              value={promoCode}
              readOnly={promoApplied}
              disabled={promoStatus === 'pending'}
              autoComplete="off"
              onChange={(e) => {
                setPromoCode(e.target.value);
                if (promoStatus === 'error') {
                  setPromoStatus('idle');
                  setPromoMessage('');
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (!promoApplied) handleApplyPromo();
                }
              }}
              style={{
                width: '100%',
                minWidth: 0,
                boxSizing: 'border-box',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                border: '1px solid var(--pw-input-border, #E0E0E0)',
                background: promoApplied
                  ? 'var(--pw-color-background, #f9fafb)'
                  : 'var(--pw-input-bg, #ffffff)',
                color: 'var(--pw-input-fg, #1C1C21)',
                fontFamily: 'inherit',
                fontSize: '1rem',
                outline: 'none',
                opacity: promoStatus === 'pending' ? 0.7 : 1,
              }}
            />
            <button
              type="button"
              onClick={promoApplied ? handleRemovePromo : handleApplyPromo}
              disabled={promoStatus === 'pending' || (!promoApplied && !promoCode.trim())}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                background: 'var(--pw-color-border, #EFEFEC)',
                color: 'var(--pw-color-on-surface, #1C1C21)',
                border: 'none',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxSizing: 'border-box',
                cursor:
                  promoStatus === 'pending' || (!promoApplied && !promoCode.trim())
                    ? 'not-allowed'
                    : 'pointer',
                opacity: promoStatus === 'pending' || (!promoApplied && !promoCode.trim()) ? 0.6 : 1,
                transition: 'background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, ease)',
              }}
              onMouseOver={(e) => {
                if (!(promoStatus === 'pending' || (!promoApplied && !promoCode.trim()))) {
                  e.currentTarget.style.background = 'var(--pw-state-hover, #F1F0E8)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--pw-color-border, #EFEFEC)';
              }}
            >
              {promoStatus === 'pending' ? (promoApplied ? 'Removing…' : 'Applying…') : promoApplied ? 'Remove' : 'Apply'}
            </button>
          </div>
          {promoMessage && (
            <div
              style={{
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                color:
                  promoStatus === 'error'
                    ? 'var(--pw-color-error, #ef4444)'
                    : promoStatus === 'success'
                      ? 'var(--pw-color-brand, #161336)'
                      : 'var(--pw-color-muted, #71717a)',
                fontWeight: 500,
              }}
            >
              {promoMessage}
            </div>
          )}
        </div>

        {/* Cost Breakdown */}
        <div
          style={{
            background: 'var(--pw-color-background, #f9fafb)',
            padding: 'var(--pw-control-padding, 1rem)',
            borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {discountAmount > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'var(--pw-color-brand, #161336)',
                fontWeight: 500,
              }}
            >
              <span>Discount{promoCode ? ' (' + promoCode + ')' : ''}</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem',
              paddingTop: '0.5rem',
              borderTop: '1px dashed var(--pw-color-border, #EFEFEC)',
              fontWeight: 'var(--pw-font-weight-title, 600)',
              fontSize: '1.125rem',
              color: 'var(--pw-color-on-surface, #1C1C21)',
            }}
          >
            <span>Total today</span>
            <span>
              {regularTotal > total ? (
                <span style={{ textDecoration: 'line-through', fontWeight: 400, color: 'var(--pw-color-muted, #71717a)', marginRight: '0.5rem', fontSize: '0.95rem' }}>
                  {formatPrice(regularTotal)}
                </span>
              ) : null}
              {formatPrice(total)}
            </span>
          </div>
          {priceLine ? (
            <div style={{ fontSize: '0.8125rem', color: 'var(--pw-color-muted, #71717a)', textAlign: 'right' }}>
              {priceLine.split(' · ')[0]}
              {priceLine.indexOf(' · ') >= 0 ? <span style={{ display: 'block', opacity: 0.7 }}>{priceLine.slice(priceLine.indexOf(' · ') + 3)}</span> : null}
            </div>
          ) : null}
          {totalSaved > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.375rem',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#166534',
              }}
            >
              <span>You save</span>
              <span style={{ color: '#15803D' }}>{formatPrice(totalSaved)}</span>
            </div>
          )}
        </div>
      </div>

      <div
        className="pw-motion-enter"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          '--pw-motion-enter-delay': '180ms',
        } as React.CSSProperties}
      >
        <div
          style={{
            padding: '1rem 1rem 1rem 0.875rem',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            border: '1px solid var(--pw-color-border, #EFEFEC)',
            background: 'var(--pw-color-surface, #ffffff)',
            boxShadow:
              'inset 4px 0 0 var(--pw-color-brand, #161336), var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          }}
        >
          <p
            style={{
              margin: 0,
              paddingLeft: '0.625rem',
              fontSize: '0.8125rem',
              lineHeight: 1.55,
              fontWeight: 400,
              color: 'var(--pw-color-muted, #71717a)',
              textAlign: 'justify',
              textAlignLast: 'left',
              hyphens: 'auto',
            }}
          >
            By clicking{' '}
            <span
              style={{
                fontWeight: 700,
                color: 'var(--pw-color-on-surface, #1C1C21)',
              }}
            >
              {buttonText}
            </span>{' '}
            you agree that, if prescribed, you will be charged {terms.first} for your first shipment, then{' '}
            <span style={{ fontWeight: 700, color: 'var(--pw-color-on-surface, #1C1C21)' }}>
              {terms.recurring} {terms.every}
            </span>{' '}
            until you cancel or the prescription expires.
            {terms.hasLab ? ' Labs are a one-time charge.' : ''}
          </p>
          <div
            style={{
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              paddingLeft: '0.625rem',
              borderTop: '1px dashed var(--pw-color-border, #D4D4D8)',
            }}
          >
            <div
              style={{
                padding: '0.625rem 0.75rem',
                borderRadius: 'calc(var(--pw-radius, 0.5rem) - 2px)',
                background: 'linear-gradient(135deg, rgba(22, 19, 54, 0.06) 0%, rgba(22, 19, 54, 0.02) 100%)',
                border: '1px solid rgba(22, 19, 54, 0.08)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.8125rem',
                  lineHeight: 1.5,
                  fontWeight: 400,
                  color: 'var(--pw-color-muted, #71717a)',
                  textAlign: 'left',
                }}
              >
                You can{' '}
                <span
                  style={{
                    fontWeight: 600,
                    color: 'var(--pw-color-on-surface, #1C1C21)',
                  }}
                >
                  cancel your plan anytime
                </span>{' '}
                by logging into your account.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={checkoutDisabled}
          style={{
            width: '100%',
            padding: 'var(--pw-control-padding, 1rem)',
            background: 'var(--pw-button-bg, #161336)',
            color: 'var(--pw-button-fg, #ffffff)',
            border: 'none',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            fontFamily: 'var(--pw-font-family-body, inherit)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: checkoutDisabled ? 'not-allowed' : 'pointer',
            opacity: checkoutDisabled ? 0.5 : 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'opacity var(--pw-motion-duration, 180ms) var(--pw-motion-ease, ease)',
          }}
          onMouseOver={(e) => {
            if (!checkoutDisabled) e.currentTarget.style.opacity = '0.9';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = checkoutDisabled ? '0.5' : '1';
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          {buttonText}
        </button>
      </div>
    </div>
  );
}