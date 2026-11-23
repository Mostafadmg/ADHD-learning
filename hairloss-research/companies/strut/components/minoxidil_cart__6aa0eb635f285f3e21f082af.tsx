// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect } from 'react';

/* ============================================================
   Order Summary (Shopping Cart step)
   ------------------------------------------------------------
   Renders the submission cart via window.pathwai.cart.
   Promo codes call window.strut.applyPromoCode → Checkout/ApplyPromoCode.
============================================================ */

function getStrut() {
  return typeof window !== 'undefined' ? (window as any).strut : null;
}

function getPathwaiCart() {
  return typeof window !== 'undefined' ? (window as any).pathwai?.cart : null;
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

function isForeignProductLine(item: CartItem) {
  if (isLabLine(item)) return true;
  return FOREIGN_CART_RE.test(`${item?.id || ''} ${item?.name || ''}`);
}

function sanitizeCartItems(items: CartItem[]): CartItem[] {
  const list = Array.isArray(items) ? items : [];
  const onTirz = isTirzepatideFlow() || list.some(isTirzepatideLine);
  const onMinox = isMinoxidilFlow() || list.some(isMinoxidilLine);
  if (!onTirz && !onMinox) return list;
  const cleaned = list.filter((it) => !isForeignProductLine(it));
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
  return isTirzepatideFlow() || isMinoxidilFlow() || /semaglutide|sildenafil|tadalafil|finasteride|dutasteride|bhrt/i.test(flowBlob());
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
  const rxPrice = Number(data?.Price || 0);
  let rxPatched = false;
  let source = sanitizeCartItems(prev.items || []);
  if (!source.length && apiPriceId > 0 && apiName) {
    source = [{
      id: String(apiPriceId),
      name: apiName,
      price: rxPrice > 0 ? rxPrice : 0,
      quantity: Number(data?.Quantity || 1) || 1,
    }];
  }
  const items = source.map((it) => {
    if (!rxPatched && !isLabLine(it) && rxPrice > 0 && (apiIsTirzepatide || apiIsMinoxidil || (!isTirzepatideFlow() && !isMinoxidilFlow()))) {
      rxPatched = true;
      return { ...it, price: rxPrice, name: apiName || it.name };
    }
    return it;
  });
  const labId = Number(data?.LabPanelId || 0);
  const labPrice = Number(data?.LabPanelPrice || 0);
  const labQty = Number(data?.LabPanelQuantity || 1) || 1;
  const labName = String(data?.LabPanelName || '').trim();
  const persisted = readPersistedLab();
  if (isTirzepatideFlow() || isMinoxidilFlow() || shouldSkipEncloLab() || source.some(isTirzepatideLine) || source.some(isMinoxidilLine)) {
    return withCartTotals(items.filter((it) => !isLabLine(it) && !isForeignProductLine(it)));
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
    const existingCode = String(order?.PromoCodeUsed || order?.Cart?.PromoCode || '').trim();
    if (existingDiscount > 0 || existingCode) {
      setPromoCode(existingCode);
      setDiscountAmount(existingDiscount);
      setPromoApplied(true);
      setPromoStatus('success');
      setPromoMessage(existingCode ? `Promo code ${existingCode} applied.` : 'Promo code applied.');
      persistPromoSnapshot(existingCode, existingDiscount);
    }

    let cancelled = false;
    (async () => {
      if (!strut?.getCartItem || !strut.getOrderId?.()) return;
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
          const existingCode = String(strut.getOrder?.()?.PromoCodeUsed || strut.getOrder?.()?.Cart?.PromoCode || '').trim();
          if (existingCode && typeof strut.applyPromoCode === 'function') {
            await strut.applyPromoCode(existingCode).catch(() => {});
          }
        }
        const data = await strut.getCartItem();
        if (cancelled || !data) return;
        setCart((prev) => mergeApiCart(prev, data));
        const { discount, applied, code } = readPromoResult(data);
        if (applied) {
          setDiscountAmount(discount);
          setPromoApplied(true);
          setPromoStatus('success');
          if (code) setPromoCode(code);
          setPromoMessage(code ? `Promo code ${code} applied.` : 'Promo code applied.');
          persistPromoSnapshot(code, discount);
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

  return (
    <div
      style={{
        maxWidth: 'var(--pw-step-max-width, 617px)',
        margin: '0 auto',
        width: '100%',
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

        {/* Promo Code Section */}
        <div
          style={{
            padding: 'var(--pw-control-padding, 1rem)',
            borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
            background: 'var(--pw-color-background, #f9fafb)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                flex: 1,
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
                padding: '0 1.25rem',
                borderRadius: 'var(--pw-radius, 0.5rem)',
                background: 'var(--pw-color-border, #EFEFEC)',
                color: 'var(--pw-color-on-surface, #1C1C21)',
                border: 'none',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: '0.875rem',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--pw-color-muted, #71717a)' }}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'var(--pw-color-brand, #161336)',
                fontWeight: 500,
              }}
            >
              <span>Discount</span>
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
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        className="pw-motion-enter"
        disabled={checkoutDisabled}
        style={{
          width: '100%',
          marginTop: '0.5rem',
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
          '--pw-motion-enter-delay': '200ms',
        } as React.CSSProperties}
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
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        {buttonText}
      </button>
    </div>
  );
}
