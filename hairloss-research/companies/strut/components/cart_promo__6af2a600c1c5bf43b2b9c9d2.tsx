import React, { useState, useEffect, useMemo } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  listPrice?: number;
  originalPrice?: number;
  discount?: number;
  discountAmount?: number;
  coupon?: string;
  couponCode?: string;
  image?: string;
  variants?: Array<{ name: string; value: string }>;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
  discount?: number;
  couponCode?: string;
}

const DESKTOP_MIN_WIDTH = 900;

/* Desktop bar: matches the step column width and sits centered under it */
const STEP_MAX_WIDTH = 580;

/* Light blue palette for the desktop bar */
const CARD_BG = '#EFF5FF';
const CARD_BORDER = '#DBEAFE';

function readStoredPromo(): { code: string; discount: number } {
  try {
    const raw = sessionStorage.getItem('strut.finasteride.promo') || sessionStorage.getItem('strut.promo') || sessionStorage.getItem('promo');
    if (raw && raw.startsWith('{')) {
      const parsed = JSON.parse(raw);
      return {
        code: String(parsed.code || parsed.coupon || parsed.couponCode || '').trim(),
        discount: Number(parsed.discount || parsed.discountAmount || 0),
      };
    }
    if (raw) {
      return { code: raw.trim(), discount: 0 };
    }
  } catch { /* ignore */ }

  try {
    const display = localStorage.getItem('pathwai.productDisplay');
    if (display) {
      const parsed = JSON.parse(display);
      return {
        code: String(parsed.coupon || parsed.couponCode || '').trim(),
        discount: Number(parsed.discount || parsed.discountAmount || 0),
      };
    }
  } catch { /* ignore */ }

  return { code: '', discount: 0 };
}

export default function CartDrawer({ drawerHeight }: {
  drawerHeight: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, total: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const cartApi = (window as any).pathwai?.cart;
    if (!cartApi) return;

    try {
      const initial = cartApi.getCart();
      if (initial) setCart(initial);
    } catch (e) {
      console.error('Error initializing cart:', e);
    }

    const handleCartUpdate = (event: CustomEvent<{ cart: Cart }>) => {
      if (event.detail?.cart) {
        setCart(event.detail.cart);
      }
    };

    window.addEventListener('pathwai:cart:updated', handleCartUpdate as EventListener);
    return () => window.removeEventListener('pathwai:cart:updated', handleCartUpdate as EventListener);
  }, []);

  /* Desktop vs Mobile Breakpoint */
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handleQuantityChange = (id: string, newQuantity: number, variants?: Array<{ name: string; value: string }>) => {
    (window as any).pathwai?.cart?.updateQuantity(id, newQuantity, variants);
  };

  const handleRemoveItem = (id: string, variants?: Array<{ name: string; value: string }>) => {
    (window as any).pathwai?.cart?.removeItem(id, variants);
  };

  /* Calculate active promo details across items or from fallback storage */
  const promoInfo = useMemo(() => {
    const fallback = readStoredPromo();
    let totalDiscount = 0;
    let appliedCode = fallback.code;

    cart.items.forEach((item) => {
      const itemDisc = Number(item.discountAmount ?? item.discount ?? 0);
      const itemCode = String(item.couponCode ?? item.coupon ?? '').trim();
      if (itemCode) appliedCode = itemCode;
      if (itemDisc > 0) {
        totalDiscount += itemDisc * (item.quantity || 1);
      }
    });

    if (totalDiscount === 0 && fallback.discount > 0) {
      totalDiscount = fallback.discount;
    }

    return {
      code: appliedCode,
      discount: totalDiscount,
    };
  }, [cart]);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const firstProductName = cart.items.length > 0 ? cart.items[0].name : null;

  const BANNER_HEIGHT = 56;

  /* Empty cart renders nothing — desktop and mobile alike. */
  if (cart.items.length === 0) return null;

  /* ============================================================
     DESKTOP: collapsible light-blue bar under Continue button.
  ============================================================ */
  if (isDesktop) {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: `${STEP_MAX_WIDTH}px`,
          margin: '4px auto 0',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          color: '#111827',
        }}
      >
        <div
          style={{
            backgroundColor: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          {/* Collapsed bar (click to open/close) */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            title="Shopping Cart"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '12px 18px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#111827',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {/* Left: icon + badge + product name */}
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, color: '#374151' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {totalItems > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-7px',
                      right: '-9px',
                      minWidth: '15px',
                      height: '15px',
                      padding: '0 4px',
                      borderRadius: '999px',
                      backgroundColor: '#EF4444',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                      boxSizing: 'border-box',
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {firstProductName}
                {totalItems > 1 && <span style={{ fontWeight: '400', color: '#6B7280' }}> ({totalItems})</span>}
              </span>
            </span>

            {/* Right: total + discount tag + chevron */}
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              {promoInfo.discount > 0 && (
                <span
                  style={{
                    backgroundColor: '#e3f4ea',
                    color: '#0f7a4a',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '999px',
                  }}
                >
                  Save ${promoInfo.discount.toFixed(2)}
                </span>
              )}
              <span style={{ fontSize: '14px', fontWeight: '700' }}>${cart.total.toFixed(2)}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease',
                  opacity: 0.55,
                  flexShrink: 0,
                }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>

          {/* Drawer content (expands downward) */}
          <div
            style={{
              maxHeight: isOpen ? '500px' : '0px',
              opacity: isOpen ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
            }}
          >
            <div style={{ padding: '0 18px 14px' }}>
              {cart.items.map((item, index) => {
                const listPrice = Number(item.listPrice ?? item.originalPrice ?? 0);
                const showStrike = listPrice > item.price;

                return (
                  <div
                    key={`${item.id}-${index}`}
                    style={{
                      padding: '12px 0',
                      borderTop: `1px solid ${CARD_BORDER}`,
                    }}
                  >
                    {/* Name + line total */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontWeight: '600', fontSize: '14px', lineHeight: 1.35 }}>{item.name}</span>
                      <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {showStrike && (
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#9CA3AF',
                              textDecoration: 'line-through',
                              marginRight: '6px',
                            }}
                          >
                            ${(listPrice * item.quantity).toFixed(2)}
                          </span>
                        )}
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Variants + unit price */}
                    <div style={{ marginTop: '3px', fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>
                      {item.variants && item.variants.map((v, i) => (
                        <div key={i}>{v.name}: {v.value}</div>
                      ))}
                      {item.quantity > 1 && <div>${item.price.toFixed(2)} each</div>}
                    </div>
                  </div>
                );
              })}

              {/* Promo deduction row */}
              {promoInfo.discount > 0 && (
                <div
                  style={{
                    paddingTop: '10px',
                    borderTop: `1px dashed ${CARD_BORDER}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                    color: '#0f7a4a',
                    fontWeight: '600',
                  }}
                >
                  <span>Coupon {promoInfo.code ? `(${promoInfo.code})` : 'Applied'}</span>
                  <span>−${promoInfo.discount.toFixed(2)}</span>
                </div>
              )}

              {/* Total */}
              <div
                style={{
                  paddingTop: '10px',
                  marginTop: '8px',
                  borderTop: `1px solid ${CARD_BORDER}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontSize: '13px', color: '#6B7280' }}>Total</span>
                <span style={{ fontSize: '15px', fontWeight: '700' }}>${cart.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     MOBILE / NARROW: bottom banner + drawer
  ============================================================ */
  return (
    <div>
      {/* Reserves space so fixed bar never covers content */}
      <div style={{ height: `calc(${BANNER_HEIGHT}px + env(safe-area-inset-bottom))` }} />

      {/* Fixed bottom banner */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#ffffff',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          opacity: isOpen ? 0 : 1,
          pointerEvents: isOpen ? 'none' : 'auto',
          transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: 'transparent',
            color: '#111827',
            border: 'none',
            borderTop: '1px solid #E5E7EB',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            opacity: 1,
            transition: 'opacity 0.2s',
            fontFamily: 'inherit',
            margin: 0,
            height: `${BANNER_HEIGHT}px`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          title="Shopping Cart"
        >
          {/* Left side: cart icon + product info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span style={{ fontSize: '15px', fontWeight: '600', color: 'inherit' }}>
              {firstProductName
                ? <>{firstProductName} {totalItems > 1 && <span style={{ fontWeight: '400', opacity: 0.7 }}>({totalItems})</span>}</>
                : <span style={{ fontWeight: '400', opacity: 0.7 }}>Your cart is empty</span>
              }
            </span>
          </div>

          {/* Right side: total + discount badge + chevron */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {promoInfo.discount > 0 && (
              <span
                style={{
                  backgroundColor: '#e3f4ea',
                  color: '#0f7a4a',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                Save ${promoInfo.discount.toFixed(2)}
              </span>
            )}
            {cart.items.length > 0 && (
              <span style={{ fontSize: '15px', fontWeight: '700', color: 'inherit' }}>
                ${cart.total.toFixed(2)}
              </span>
            )}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                flexShrink: 0,
              }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
          }}
        />
      )}

      {/* Bottom Drawer */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${drawerHeight}px`,
          backgroundColor: '#ffffff',
          color: '#1f2937',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.15)',
          zIndex: 999,
          paddingBottom: 'env(safe-area-inset-bottom)',
          transform: isOpen ? 'translateY(0)' : `translateY(${drawerHeight}px)`,
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          visibility: isOpen ? 'visible' : 'hidden',
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
        }}
      >
        {/* Drawer Handle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '12px 0 4px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '40px',
              height: '4px',
              backgroundColor: '#d1d5db',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Drawer Header */}
        <div
          style={{
            padding: '8px 20px 12px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>Shopping Cart</h2>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#111827')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {cart.items.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '32px' }}>Your cart is empty</p>
          ) : (
            cart.items.map((item, index) => {
              const listPrice = Number(item.listPrice ?? item.originalPrice ?? 0);
              const showStrike = listPrice > item.price;

              return (
                <div
                  key={`${item.id}-${index}`}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '500', fontSize: '14px', color: '#111827' }}>{item.name}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id, item.variants); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '0',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      Remove
                    </button>
                  </div>

                  {item.variants && item.variants.length > 0 && (
                    <div style={{ marginBottom: '8px', fontSize: '12px', color: '#6b7280' }}>
                      {item.variants.map((v, i) => (
                        <div key={i}>{v.name}: {v.value}</div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280', fontSize: '13px' }}>
                      ${item.price.toFixed(2)} each
                      {showStrike && (
                        <span style={{ marginLeft: '6px', textDecoration: 'line-through', color: '#9CA3AF' }}>
                          ${listPrice.toFixed(2)}
                        </span>
                      )}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, item.quantity - 1, item.variants); }}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '1px solid #d1d5db',
                          backgroundColor: '#f9fafb',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#374151',
                        }}
                      >
                        −
                      </button>
                      <span style={{ width: '28px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: '#111827' }}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, item.quantity + 1, item.variants); }}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '1px solid #d1d5db',
                          backgroundColor: '#f9fafb',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#374151',
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontWeight: '600', fontSize: '14px', color: '#111827' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {cart.items.length > 0 && (
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {promoInfo.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: '#0f7a4a' }}>
                <span>Coupon Discount {promoInfo.code ? `(${promoInfo.code})` : ''}</span>
                <span>−${promoInfo.discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
              <span>Total:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const propSchema = {
  drawerHeight: {
    type: 'number',
    title: 'Drawer Height (px)',
    defaultValue: 480,
    min: 300,
    max: 800,
    step: 10,
  },
};