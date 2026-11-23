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
/** Shared with the flow SDKs so one order is never reported twice (also survives reloads). */
const ORDER_PLACED_SENT_KEY = 'Strut.OrderPlacedSent';
const STATUS_RETRY_MS = 1500;
const STATUS_MAX_ATTEMPTS = 5;

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

function readOrderId(): string {
  const w = window as any;
  const id = w.strut?.getOrderId?.() ?? parseLsJson('Visiting.OrderId')?.OrderId;
  return id != null && id !== '' ? String(id) : '';
}

function wasOrderPlacedSent(orderId: string): boolean {
  const w = window as any;
  if (w.__STRUT_ORDER_PLACED_IDS__?.[orderId]) return true;
  const sent = parseLsJson(ORDER_PLACED_SENT_KEY);
  return Array.isArray(sent) && sent.includes(orderId);
}

function markOrderPlacedSent(orderId: string) {
  const w = window as any;
  w.__STRUT_ORDER_PLACED_IDS__ = w.__STRUT_ORDER_PLACED_IDS__ || {};
  w.__STRUT_ORDER_PLACED_IDS__[orderId] = true;
  try {
    const sent = parseLsJson(ORDER_PLACED_SENT_KEY);
    const list: string[] = Array.isArray(sent) ? sent : [];
    if (!list.includes(orderId)) list.push(orderId);
    window.localStorage.setItem(ORDER_PLACED_SENT_KEY, JSON.stringify(list.slice(-20)));
  } catch {
    /* ignore */
  }
}

/**
 * Asks checkout-api whether the order really finished. GetStatusOrder only returns
 * resultGoogle when the FinishOrderV2 call completed, so DQ endings, declined cards
 * and unpaid sessions all come back empty and never fire a purchase.
 */
async function fetchPlacedOrderRows(orderId: string): Promise<any[] | null> {
  const strut = (window as any).strut;
  if (typeof strut?.getOrderStatus !== 'function') return null;
  for (let attempt = 1; attempt <= STATUS_MAX_ATTEMPTS; attempt++) {
    const status = await strut.getOrderStatus(orderId).catch(() => null);
    if (!status || status.isFaled || status.isCompletedButNullResult) return null;
    if (!status.isProcessing) {
      const rows = status.resultGoogle;
      return Array.isArray(rows) && rows.length > 0 ? rows : null;
    }
    await new Promise((resolve) => setTimeout(resolve, STATUS_RETRY_MS));
  }
  return null;
}

/** The flow SDKs put flow_id / submission_id on their QuestionnaireStarted push. */
function readFlowContext(): { flowId?: string; submissionId?: string } {
  const layer = (window as any).dataLayer;
  let flowId: string | undefined;
  let submissionId: string | undefined;
  if (Array.isArray(layer)) {
    for (let i = layer.length - 1; i >= 0; i--) {
      const entry = layer[i];
      if (!flowId && entry?.flow_id) flowId = String(entry.flow_id);
      if (!submissionId && entry?.submission_id) submissionId = String(entry.submission_id);
      if (flowId && submissionId) break;
    }
  }
  return { flowId, submissionId };
}

function readDiscountCode(): string {
  const w = window as any;
  try {
    const order = w.strut?.getOrder?.();
    const fromOrder = order?.PromoCodeUsed || order?.Cart?.PromoCode;
    if (fromOrder && String(fromOrder).trim()) return String(fromOrder).trim();
  } catch { /* ignore */ }
  const live = w.__STRUT_PROMO_CODE__ || w.__STRUT_MOJO_COUPON__;
  if (live && String(live).trim()) return String(live).trim();
  return '';
}

function pushOrderPlaced(orderId: string, rows: any[]) {
  // SAN-019 / SAN-020 (analytics deck 2 Nov 2026): non-zero value, transaction_id.
  // GTM Ads + GA4 tags listen for OrderPlaced and read cart_total, order_id, and ecommerce.items.
  const w = window as any;
  let value = 0;
  const items: { item_id: string; item_name: string; price: number; quantity: number }[] = [];
  for (const row of rows) {
    const revenue = row?.Transaction?.revenue;
    if (revenue != null && revenue !== '') value += Number(revenue) || 0;
    const lineItems = Array.isArray(row?.ItemDatas) ? row.ItemDatas : [];
    for (const item of lineItems) {
      items.push({
        item_id: String(item.id != null ? item.id : row.ProductId != null ? row.ProductId : ''),
        item_name: item.name || '',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      });
    }
  }

  const visitingId = w.strut?.getVisitingId?.();
  const { flowId, submissionId } = readFlowContext();
  const roundedValue = Math.round(value * 100) / 100;
  const discountCode = readDiscountCode();
  const ecommerce: {
    transaction_id: string;
    value: number;
    currency: string;
    items: typeof items;
    coupon?: string;
  } = { transaction_id: orderId, value: roundedValue, currency: 'USD', items };
  if (discountCode) ecommerce.coupon = discountCode;
  const payload: {
    order_id: string;
    transaction_id: string;
    value: number;
    currency: string;
    product_name?: string;
    items: typeof items;
    visiting_id?: string;
    submission_id?: string;
    flow_id?: string;
    cart_total: number;
    discount_code?: string;
    ecommerce: typeof ecommerce;
  } = {
    order_id: orderId,
    transaction_id: orderId,
    value: roundedValue,
    currency: 'USD',
    product_name: w.__STRUT_PRODUCT_NAME__ || items[0]?.item_name || undefined,
    items,
    visiting_id: visitingId ? String(visitingId) : undefined,
    submission_id: submissionId,
    flow_id: flowId,
    cart_total: roundedValue,
    ecommerce,
  };
  if (discountCode) payload.discount_code = discountCode;

  markOrderPlacedSent(orderId);
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ ecommerce: null });
  if (typeof w.pwPushGtm === 'function') {
    w.pwPushGtm('OrderPlaced', payload);
    // Flow Start and other product SDKs also emit OrderCompleted. pwPushGtm beacons that as order_completed.
    w.pwPushGtm('OrderCompleted', payload);
  } else {
    w.dataLayer.push({ event: 'OrderPlaced', ...payload });
    w.dataLayer.push({ event: 'OrderCompleted', ...payload });
  }
  // Do not also push event "purchase". GTM-TB82HJR v160 fires the Ads purchase
  // tag on both OrderPlaced and purchase, once per event. OrderPlaced alone
  // fires Ads, GA4 purchase, and GA4 purchase_event.
  console.log('[strut] OrderPlaced (SAN-019/SAN-020)', payload);
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

    setCart(cartApi.getCart());
    setPromo(readAppliedPromo());

    const handleCartUpdate = (event: Event) => {
      const custom = event as CustomEvent<{ cart: Cart }>;
      setCart(custom.detail.cart);
      setPromo(readAppliedPromo());
    };

    window.addEventListener('pathwai:cart:updated', handleCartUpdate);
    return () => window.removeEventListener('pathwai:cart:updated', handleCartUpdate);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const orderId = readOrderId();
      if (!orderId) {
        console.log('[strut] OrderPlaced skipped (no order id)');
        return;
      }
      if (wasOrderPlacedSent(orderId)) {
        console.log('[strut] OrderPlaced skipped (already pushed)', orderId);
        return;
      }
      const rows = await fetchPlacedOrderRows(orderId);
      if (cancelled) return;
      if (!rows) {
        console.log('[strut] OrderPlaced skipped (order not confirmed as placed)', orderId);
        return;
      }
      if (wasOrderPlacedSent(orderId)) return;
      pushOrderPlaced(orderId, rows);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const discountAmount = promo.discount;
  const total =
    discountAmount > 0 ? Math.max(0, subtotal - discountAmount) : cart?.total ?? 0;
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
