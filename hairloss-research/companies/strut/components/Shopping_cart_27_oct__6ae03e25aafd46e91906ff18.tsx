// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect } from 'react';

/* ============================================================
   Order Summary (Shopping Cart step)
   ------------------------------------------------------------
   Renders the submission cart via window.pathwai.cart.
   Promo codes are entered on the pricing card. This step only shows a code
   that was already saved (pricing card, flow answer, or ?coupon=) and the
   discounted total after Checkout/ApplyPromoCode confirms it.
============================================================ */

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

    const stored = w.__STRUT_ENCLO_PROMO__?.code;
    if (stored && String(stored).trim()) return String(stored).trim();

    const raw = window.localStorage.getItem(PROMO_SNAPSHOT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.code && String(parsed.code).trim()) return String(parsed.code).trim();
    }

    const visiting = w.strut?.getVisiting?.();
    const visitingCoupon = visiting?.Coupon || visiting?.coupon;
    if (visitingCoupon && String(visitingCoupon).trim()) return String(visitingCoupon).trim();
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
    if (snapshot.code) {
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

  const applyPromoResult = (res: any, fallbackCode = '') => {
    const { discount, applied, code } = readPromoResult(res);
    if (!applied) {
      setDiscountAmount(0);
      setPromoStatus('error');
      setPromoMessage(`We couldn’t apply ${fallbackCode || 'that code'}. It may have expired. Showing standard pricing.`);
      persistPromoSnapshot('', 0);
      return false;
    }
    const shownCode = code || fallbackCode;
    setDiscountAmount(discount);
    setPromoStatus('success');
    setPromoCode(shownCode);
    setPromoMessage(`Promo code ${shownCode} applied.`);
    persistPromoSnapshot(shownCode, discount);
    return true;
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
      setPromoStatus('success');
      setPromoMessage(existingCode ? `Promo code ${existingCode} applied.` : 'Promo code applied.');
      persistPromoSnapshot(existingCode, existingDiscount);
    } else if (autoCoupon) {
      setPromoCode(autoCoupon);
      setPromoStatus('pending');
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

  const handleCheckout = () => {
    (window as any).pathwai?.flow?.next('checkout');
  };

  const subtotal = Number(cart.subtotal || 0);
  const total = Math.max(0, Number(cart.total || 0) - Number(discountAmount || 0));
  const items = cart.items || [];
  const checkoutDisabled = (items.length === 0 && !isPreview) || promoStatus === 'pending';

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
                  <span style={{ fontWeight: 500, flexShrink: 0 }}>{formatPrice(lineTotal(item))}</span>
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
            <span style={{ fontWeight: 500 }}>Physician Consultation</span>
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

        {promoStatus === 'success' && promoCode && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              margin: '0 var(--pw-control-padding, 1rem)',
              background: '#e3f4ea',
              color: '#0f7a4a',
              borderRadius: '8px',
              padding: '8px 10px',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            <span>
              {promoCode}
              <span style={{ fontWeight: 400, opacity: 0.85 }}> · Carried over</span>
            </span>
            <span aria-hidden="true">✓</span>
          </div>
        )}
        {promoStatus === 'pending' && promoCode && (
          <div style={{ padding: '0 var(--pw-control-padding, 1rem)', color: 'var(--pw-color-muted, #71717a)', fontSize: '0.875rem' }}>
            Applying {promoCode}…
          </div>
        )}
        {promoStatus === 'error' && (
          <div
            style={{
              margin: '0 var(--pw-control-padding, 1rem)',
              background: '#fff3d6',
              color: '#8a5a00',
              borderRadius: '8px',
              padding: '7px 10px',
              fontSize: '0.75rem',
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            {promoMessage || `We couldn’t apply ${promoCode || 'that code'}. It may have expired. Showing standard pricing.`}
          </div>
        )}

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
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--pw-color-muted, #71717a)' }}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

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
            <span>Total</span>
            <span style={{ textAlign: 'right' }}>
              {discountAmount > 0 && (
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--pw-color-muted, #71717a)',
                    textDecoration: 'line-through',
                  }}
                >
                  {formatPrice(subtotal)}
                </span>
              )}
              <span>{formatPrice(total)}</span>
              {discountAmount > 0 && (
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#0f7a4a' }}>
                  You save {formatPrice(discountAmount)}
                </span>
              )}
            </span>
          </div>
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
            you agree that, if prescribed, you will be charged the total amount in the cart for your first
            shipment and charged the full amount every month thereafter until you cancel or the prescription
            expires.
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