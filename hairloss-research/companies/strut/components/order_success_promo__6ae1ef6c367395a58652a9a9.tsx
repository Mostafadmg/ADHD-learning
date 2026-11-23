import React, { useState, useEffect } from 'react';

type CartItemVariant = {
  name: string;
  value: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variants?: CartItemVariant[];
};

type Cart = {
  items: CartItem[];
  subtotal: number;
  total: number;
};

type AppliedPromo = {
  code: string;
  discount: number;
};

const EMPTY_PROMO: AppliedPromo = { code: '', discount: 0 };
const PROMO_SNAPSHOT_KEY = 'strut.enclo.promo';
const TIRZEPATIDE_PRICE_IDS = new Set([
  2232, 2233, 2234, 2235, 2236, 2251, 2252, 2253, 2254, 2255,
]);
const MINOXIDIL_PRICE_IDS = new Set([2256, 2257, 797, 798]);
const LDN_PRICE_IDS = new Set([2264, 2265, 2252, 2253]);
const SERMORELIN_PRICE_IDS = new Set([
  1144, 1145, 1146, 1212, 1213, 2165, 2166, 2167, 2168, 2169, 2170,
  2225, 2226, 2228, 2229, 2230, 2231, 2232, 2233, 2234, 2235,
]);
const FOREIGN_THANKYOU_RE =
  /testosterone|lab panel|\blab\b|enclomiphene|semaglutide|sildenafil|tadalafil|tirzepatide|finasteride|dutasteride|paroxetine|sermorelin|\bnad\b|estradiol|progesterone|biest|bhrt/i;

export const propSchema = {
  thankYouTitle: {
    type: 'string',
    title: 'Thank you title',
    defaultValue: 'Order completed',
  },
  thankYouMessage: {
    type: 'string',
    title: 'Thank you message',
    defaultValue: 'Thank you — we received your order.',
  },
  reviewMessage: {
    type: 'string',
    title: 'Review message',
    defaultValue:
      'A doctor from our team will review your order and we will email you once your prescription has been written.',
  },
  expectationMessage: {
    type: 'string',
    title: 'Expectation message',
    defaultValue: 'You should hear from us within 48 hours.',
  },
  detailsHeading: {
    type: 'string',
    title: 'Order details heading',
    defaultValue: 'Your order',
  },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function parseLsJson(key: string): any {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw || raw === 'undefined') return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function promoFromOrder(order: any): AppliedPromo {
  const discount = Number(order?.Cart?.OrderDiscount ?? order?.OrderDiscount ?? 0);
  const code = String(order?.PromoCodeUsed || order?.Cart?.PromoCode || '').trim();
  return {
    code,
    discount: Number.isFinite(discount) && discount > 0 ? discount : 0,
  };
}

/** PathwAI cart has catalog line prices only. Promo lives on the Strut order. */
function isTirzepatideCheckout() {
  try {
    const w = window as any;
    const slug = String(w.strut?.getVisiting?.()?.ProductSlug || '');
    const name = String(w.__STRUT_PRODUCT_NAME__ || '');
    return /tirzepatide/i.test(`${name} ${slug}`);
  } catch {
    return false;
  }
}

function isTirzepatidePriceId(id: string | number) {
  return TIRZEPATIDE_PRICE_IDS.has(Number(id));
}

function isTirzepatideCartLine(item: CartItem) {
  const blob = `${item.id || ''} ${item.name || ''}`;
  return /tirzepatide/i.test(item.name || '') || isTirzepatidePriceId(item.id);
}

function isMinoxidilCheckout() {
  try {
    const w = window as any;
    const slug = String(w.strut?.getVisiting?.()?.ProductSlug || '');
    const name = String(w.__STRUT_PRODUCT_NAME__ || '');
    return /minoxidil|oral_minoxidil_men/i.test(`${name} ${slug}`);
  } catch {
    return false;
  }
}

function isMinoxidilPriceId(id: string | number) {
  return MINOXIDIL_PRICE_IDS.has(Number(id));
}

function isMinoxidilCartLine(item: CartItem) {
  const blob = `${item.id || ''} ${item.name || ''}`;
  return /minoxidil/i.test(item.name || '') || isMinoxidilPriceId(item.id);
}

function isLdnCheckout() {
  try {
    const w = window as any;
    const slug = String(w.strut?.getVisiting?.()?.ProductSlug || '');
    const name = String(w.__STRUT_PRODUCT_NAME__ || '');
    return /ldn|naltrexone|low dose naltrexone/i.test(`${name} ${slug}`);
  } catch {
    return false;
  }
}

function isLdnPriceId(id: string | number) {
  return LDN_PRICE_IDS.has(Number(id));
}

function isLdnCartLine(item: CartItem) {
  const blob = `${item.id || ''} ${item.name || ''}`;
  return /ldn|naltrexone|low dose naltrexone/i.test(item.name || '') || isLdnPriceId(item.id);
}

function isSermorelinCheckout() {
  try {
    const w = window as any;
    const slug = String(w.strut?.getVisiting?.()?.ProductSlug || '');
    const name = String(w.__STRUT_PRODUCT_NAME__ || '');
    return /sermorelin/i.test(`${name} ${slug}`);
  } catch {
    return false;
  }
}

function isSermorelinPriceId(id: string | number) {
  return SERMORELIN_PRICE_IDS.has(Number(id));
}

function isSermorelinCartLine(item: CartItem) {
  const blob = `${item.id || ''} ${item.name || ''}`;
  return /sermorelin/i.test(item.name || '') || isSermorelinPriceId(item.id);
}

function sanitizeThankYouItems(items: CartItem[]): CartItem[] {
  const list = Array.isArray(items) ? items : [];
  const onTirz = isTirzepatideCheckout() || list.some(isTirzepatideCartLine);
  const onMinox = isMinoxidilCheckout() || list.some(isMinoxidilCartLine);
  const onSermorelin = isSermorelinCheckout() || list.some(isSermorelinCartLine);
  const onLdn = isLdnCheckout() || list.some(isLdnCartLine);
  if (!onTirz && !onMinox && !onSermorelin && !onLdn) return list;

  const isOwnLine = (it: CartItem) =>
    (onTirz && isTirzepatideCartLine(it))
    || (onMinox && isMinoxidilCartLine(it))
    || (onSermorelin && isSermorelinCartLine(it))
    || (onLdn && isLdnCartLine(it));

  const cleaned = list.filter((it) => {
    const blob = `${it.id || ''} ${it.name || ''}`;
    if (/testosterone|lab panel|\blab\b/i.test(blob)) return false;
    if (isOwnLine(it)) return true;
    return !FOREIGN_THANKYOU_RE.test(blob);
  });

  const ownLines = cleaned.filter(isOwnLine);
  return ownLines.length ? ownLines : cleaned;
}

function withThankYouTotals(cart: Cart | null): Cart {
  const items = sanitizeThankYouItems(cart?.items || []);
  const subtotal = items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0);
  return { items, subtotal, total: subtotal };
}

function readPathwaiCart(): Cart {
  const cartApi = (window as any).pathwai?.cart;
  if (!cartApi?.getCart) return { items: [], subtotal: 0, total: 0 };
  return withThankYouTotals(cartApi.getCart());
}

function seedCartFromStrut(): Cart | null {
  const w = window as any;
  const strut = w.strut;
  if (!strut) return null;

  if (typeof strut.ensurePathwaiCart === 'function') {
    try { strut.ensurePathwaiCart(); } catch { /* ignore */ }
    const seeded = readPathwaiCart();
    if (seeded.items.length) return seeded;
  }

  const order = strut.getOrder?.();
  const visiting = strut.getVisiting?.();
  const orderCart = order?.Cart;
  const priceId = Number(
    orderCart?.ProductPriceId ||
    strut.resolveCheckoutPriceId?.() ||
    visiting?.ProductPriceId ||
    w.strut_tirzepatide_price_id ||
    w.strut_minoxidil_price_id ||
    w.strut_ldn_price_id ||
    0
  );
  let name = String(
    orderCart?.ProductName ||
    order?.ProductName ||
    visiting?.ProductName ||
    w.__STRUT_PRODUCT_NAME__ ||
    ''
  ).trim();
  if ((!name || name === 'Your order' || name === 'LDN') && isLdnPriceId(priceId)) {
    name = 'Low Dose Naltrexone';
  }
  if ((!name || name === 'Your order') && isTirzepatidePriceId(priceId)) {
    name = 'Tirzepatide Inj';
  }
  if ((!name || name === 'Your order') && isMinoxidilPriceId(priceId)) {
    name = 'Minoxidil Tablets';
  }
  const price = Number(orderCart?.Price || 0);
  const qty = Number(orderCart?.Quantity || 1) || 1;

  if (!priceId && !name) return null;

  return withThankYouTotals({
    items: [{
      id: String(priceId || 'order-item'),
      name: name || 'Your order',
      price: price > 0 ? price : 0,
      quantity: qty,
    }],
    subtotal: 0,
    total: 0,
  });
}

function mergeThankYouApiCart(prev: Cart, data: any): Cart {
  const apiName = String(data?.ProductName || data?.Name || '').trim();
  const apiPriceId = Number(data?.ProductPriceId || 0);
  const rxPrice = Number(data?.Price || 0);
  let items = [...(prev.items || [])];

  if (!items.length && apiPriceId > 0 && apiName) {
    items = [{
      id: String(apiPriceId),
      name: apiName,
      price: rxPrice > 0 ? rxPrice : 0,
      quantity: Number(data?.Quantity || 1) || 1,
    }];
  } else if (items.length && rxPrice > 0) {
    items = items.map((it, idx) => (
      idx === 0 ? { ...it, price: rxPrice, name: apiName || it.name } : it
    ));
  }

  return withThankYouTotals({ items, subtotal: 0, total: 0 });
}

function resolveThankYouCart(): Cart {
  const fromPathwai = readPathwaiCart();
  if (fromPathwai.items.length) return fromPathwai;
  return seedCartFromStrut() || { items: [], subtotal: 0, total: 0 };
}

const FINASTERIDE_TABLET_LIST: Record<number, number> = { 48: 25, 49: 49 };

function readFinasterideTabletPromo(): { code: string; price: number; listPrice: number; discount: number } | null {
  try {
    const raw = window.sessionStorage.getItem('strut.finasterideTablets.promo');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const price = Number(parsed?.price);
    const listPrice = Number(parsed?.listPrice);
    if (!Number.isFinite(price) || price < 0) return null;
    const list = Number.isFinite(listPrice) && listPrice > 0 ? listPrice : price;
    const discount = Number(parsed?.discount);
    return {
      code: String(parsed?.code || '').trim(),
      price,
      listPrice: list,
      discount: Number.isFinite(discount) && discount > 0 ? discount : Math.max(0, list - price),
    };
  } catch {
    return null;
  }
}

function tabletCatalogPrice(item: CartItem, sale: { listPrice: number } | null): number {
  const fromId = FINASTERIDE_TABLET_LIST[Number(item.id)] || 0;
  if (fromId > 0) return fromId;
  if (sale && sale.listPrice > 0 && /day supply/i.test(String(item.name || ''))) return sale.listPrice;
  return 0;
}

/** The pricing card stores the discounted amount on the cart line. The order also has that promo, so the receipt must not subtract it again. */
function restoreTabletListPrice(
  items: CartItem[],
  discount: number,
  sale: { price: number; listPrice: number } | null,
): CartItem[] {
  if (discount <= 0) return items;
  return items.map((item) => {
    const list = tabletCatalogPrice(item, sale);
    if (!list) return item;
    const qty = Number(item.quantity || 1) || 1;
    const line = Number(item.price || 0) * qty;
    const catalogLine = list * qty;
    if (Math.abs(line - catalogLine) < 0.02) return item;
    const matchesSale = !!sale
      && Math.abs(line - Number(sale.price) * qty) < 0.05
      && Math.abs(list - Number(sale.listPrice)) < 0.05;
    const matchesDiscount = Math.abs(line + discount - catalogLine) < 0.05;
    if (!matchesSale && !matchesDiscount) return item;
    return { ...item, price: list };
  });
}

function readAppliedPromo(): AppliedPromo {
  const w = window as any;
  const fromStrut = promoFromOrder(w.strut?.getOrder?.());
  if (fromStrut.discount > 0) return fromStrut;

  const snapshot = parseLsJson(PROMO_SNAPSHOT_KEY) || w.__STRUT_ENCLO_PROMO__;
  const snapshotDiscount = Number(snapshot?.discount || 0);
  if (snapshotDiscount > 0) {
    return {
      code: String(snapshot?.code || '').trim(),
      discount: snapshotDiscount,
    };
  }

  const fromStoredOrder = promoFromOrder(parseLsJson('Visiting.OrderId'));
  if (fromStoredOrder.discount > 0) return fromStoredOrder;

  return EMPTY_PROMO;
}

export default function OrderSuccess({
  thankYouTitle = 'Order completed',
  thankYouMessage = 'Thank you — we received your order.',
  reviewMessage = 'A doctor from our team will review your order and we will email you once your prescription has been written.',
  expectationMessage = 'You should hear from us within 48 hours.',
  detailsHeading = 'Your order',
}: {
  thankYouTitle?: string;
  thankYouMessage?: string;
  reviewMessage?: string;
  expectationMessage?: string;
  detailsHeading?: string;
}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [promo, setPromo] = useState<AppliedPromo>(EMPTY_PROMO);

  useEffect(() => {
    const cartApi = window.pathwai?.cart;
    if (!cartApi) {
      setCart({ items: [], subtotal: 0, total: 0 });
      setPromo(readAppliedPromo());
      return;
    }

    setCart(resolveThankYouCart());
    setPromo(readAppliedPromo());

    const handleCartUpdate = () => {
      setCart((prev) => {
        const resolved = resolveThankYouCart();
        if (resolved.items.length) return resolved;
        return prev?.items?.length ? prev : resolved;
      });
      setPromo(readAppliedPromo());
    };

    window.addEventListener('pathwai:cart:updated', handleCartUpdate);

    let cancelled = false;
    (async () => {
      const strut = (window as any).strut;
      if (!strut) return;

      try {
        const finish = strut.completeStrutOrder || strut.submitPaidOrder;
        if (typeof finish === 'function') {
          await finish.call(strut).catch((err: unknown) => {
            console.error('[strut] completeStrutOrder from thank-you failed', err);
          });
        }
      } catch { /* ignore */ }

      if (cancelled) return;

      if (typeof strut.ensurePathwaiCart === 'function') {
        try { strut.ensurePathwaiCart(); } catch { /* ignore */ }
      }

      const refreshed = resolveThankYouCart();
      if (refreshed.items.length) setCart(refreshed);

      if (typeof strut.getCartItem !== 'function') return;

      try {
        if (!strut.getOrderId?.()) {
          if (strut.getVisitingId?.() && typeof strut.getCurrentVisiting === 'function') {
            await strut.getCurrentVisiting().catch(() => {});
          }
        }
        if (!strut.getOrderId?.()) return;
        const data = await strut.getCartItem();
        if (cancelled || !data) return;
        setCart((prev) => mergeThankYouApiCart(prev, data));
      } catch {
        /* cart pricing refresh is optional */
      }
    })();

    return () => {
      cancelled = true;
      window.removeEventListener('pathwai:cart:updated', handleCartUpdate);
    };
  }, []);

  const sale = readFinasterideTabletPromo();
  const rawItems = cart?.items ?? [];
  const promoDiscount = promo.discount > 0 ? promo.discount : Number(sale?.discount || 0);
  const lineAlreadyDiscounted = !!sale
    && promoDiscount > 0
    && rawItems.some((item) => {
      const qty = Number(item.quantity || 1) || 1;
      const line = Number(item.price || 0) * qty;
      return Math.abs(line - Number(sale.price) * qty) < 0.05
        && Math.abs(line - Number(sale.listPrice) * qty) > 0.05;
    });
  const items = lineAlreadyDiscounted ? rawItems : restoreTabletListPrice(rawItems, promoDiscount, sale);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
  const discountAmount = lineAlreadyDiscounted ? 0 : promoDiscount;
  const total = discountAmount > 0
    ? Math.max(0, subtotal - discountAmount)
    : subtotal;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-section-gap, 1.5rem)',
        fontFamily: 'var(--pw-font-family-body, Inter, system-ui, sans-serif)',
        color: 'var(--pw-color-on-surface, #1C1C21)',
        boxSizing: 'border-box',
      }}
    >
      {/* Hero success */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--pw-element-gap, 1.25rem)',
          paddingTop: 'var(--pw-space-base, 1.5rem)',
          ['--pw-motion-enter-delay' as string]: '0ms',
        }}
      >
        <div
          className="pw-motion-pop"
          aria-hidden
          style={{
            width: 64,
            height: 64,
            borderRadius: '999px',
            background: 'var(--pw-color-success-surface, #ecfdf5)',
            color: 'var(--pw-color-success, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '28rem' }}>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-title, 1.75rem)',
              fontWeight: 'var(--pw-font-weight-title, 500)' as unknown as number,
              lineHeight: 'var(--pw-font-line-height-title, 1.2)',
              letterSpacing: 'var(--pw-font-letter-spacing-title, -0.01em)',
              color: 'var(--pw-label-fg, #002021)',
            }}
          >
            {thankYouTitle}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-body, 1rem)',
              fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
              lineHeight: 'var(--pw-font-line-height-body, 1.55)',
              color: 'var(--pw-label-sublabel-fg, #545454)',
            }}
          >
            {thankYouMessage}
            {itemCount > 0
              ? ` We have ${itemCount} item${itemCount === 1 ? '' : 's'} on file for review.`
              : ''}
          </p>
        </div>
      </div>

      {/* Order details — checkout-style cart summary */}
      <section
        className="pw-motion-enter"
        aria-labelledby="order-details-heading"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          padding: 'var(--pw-control-padding, 1rem)',
          background: 'var(--pw-color-surface, #ffffff)',
          border: '1px solid var(--pw-color-border, #EFEFEC)',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          boxShadow: 'var(--pw-shadow, 0 2px 8px rgba(0,0,0,0.06))',
          ['--pw-motion-enter-delay' as string]: '100ms',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 'var(--pw-element-gap, 1.25rem)',
            flexWrap: 'wrap',
            marginBottom: 'var(--pw-element-gap, 1.25rem)',
          }}
        >
          <h2
            id="order-details-heading"
            style={{
              margin: 0,
              fontFamily: 'var(--pw-font-family-title, Figtree, system-ui, sans-serif)',
              fontSize: '1.125rem',
              fontWeight: 600,
              lineHeight: 1.3,
              color: 'var(--pw-label-fg, #002021)',
            }}
          >
            {detailsHeading}
          </h2>
          {items.length > 0 && (
            <span
              style={{
                fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                color: 'var(--pw-color-muted, #71717a)',
              }}
            >
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <p
            style={{
              margin: 0,
              fontSize: 'var(--pw-font-size-body, 1rem)',
              lineHeight: 'var(--pw-font-line-height-body, 1.55)',
              color: 'var(--pw-color-muted, #71717a)',
            }}
          >
            Your order details will appear here once available.
          </p>
        ) : (
          <>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {items.map((item, index) => {
                const variantLabel =
                  item.variants && item.variants.length > 0
                    ? item.variants.map((v) => `${v.name}: ${v.value}`).join(' · ')
                    : null;
                const lineTotal = item.price * item.quantity;

                return (
                  <li
                    key={`${item.id}-${index}`}
                    className="pw-motion-enter"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--pw-answer-gap, 0.75rem)',
                      paddingTop: index === 0 ? 0 : 'var(--pw-control-padding, 1rem)',
                      paddingBottom: 'var(--pw-control-padding, 1rem)',
                      borderBottom: '1px solid var(--pw-color-border, #EFEFEC)',
                      ['--pw-motion-enter-delay' as string]: `${150 + index * 80}ms`,
                    }}
                  >
                    {/* Product details */}
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          alignItems: 'flex-start',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: 'var(--pw-font-size-body, 1rem)',
                            fontWeight: 500,
                            lineHeight: 1.35,
                            color: 'var(--pw-color-on-surface, #1C1C21)',
                            wordBreak: 'break-word',
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 'var(--pw-font-size-body, 1rem)',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            color: 'var(--pw-color-on-surface, #1C1C21)',
                            flexShrink: 0,
                          }}
                        >
                          {formatCurrency(lineTotal)}
                        </p>
                      </div>

                      {variantLabel && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                            lineHeight: 1.4,
                            color: 'var(--pw-answer-subtext-fg, #545454)',
                            wordBreak: 'break-word',
                          }}
                        >
                          {variantLabel}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginTop: '0.15rem',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            minHeight: 28,
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--pw-radius, 0.5rem)',
                            background: 'var(--pw-state-active, #EFEFEC)',
                            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                            fontWeight: 500,
                            color: 'var(--pw-color-on-surface, #1C1C21)',
                          }}
                        >
                          Qty {item.quantity}
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
                            color: 'var(--pw-color-muted, #71717a)',
                          }}
                        >
                          {formatCurrency(item.price)}
                          {item.quantity > 1 ? ' each' : ''}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Totals — read-only like checkout */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                paddingTop: 'var(--pw-control-padding, 1rem)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                    fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
                    color: 'var(--pw-color-muted, #71717a)',
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                    fontWeight: 500,
                    color: 'var(--pw-color-on-surface, #1C1C21)',
                  }}
                >
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--pw-font-size-body, 1rem)',
                      fontWeight: 500,
                      color: 'var(--pw-color-brand, #161336)',
                    }}
                  >
                    Discount{promo.code ? ` (${promo.code})` : ''}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--pw-font-size-body, 1rem)',
                      fontWeight: 600,
                      color: 'var(--pw-color-brand, #161336)',
                    }}
                  >
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--pw-font-size-body, 1rem)',
                    fontWeight: 600,
                    color: 'var(--pw-label-fg, #002021)',
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--pw-label-fg, #002021)',
                  }}
                >
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* What happens next */}
      <div
        className="pw-motion-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          padding: 'var(--pw-control-padding, 1rem)',
          background: 'var(--pw-color-info-surface, #F1F0E8)',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          ['--pw-motion-enter-delay' as string]: '220ms',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 'var(--pw-font-size-caption, 0.875rem)',
            fontWeight: 600,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            color: 'var(--pw-label-sublabel-fg, #545454)',
          }}
        >
          What happens next
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 'var(--pw-font-weight-body, 400)' as unknown as number,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            color: 'var(--pw-content-fg, #1C1C21)',
          }}
        >
          {reviewMessage}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 500,
            lineHeight: 'var(--pw-font-line-height-body, 1.55)',
            color: 'var(--pw-label-fg, #002021)',
          }}
        >
          {expectationMessage}
        </p>
      </div>
    </div>
  );
}