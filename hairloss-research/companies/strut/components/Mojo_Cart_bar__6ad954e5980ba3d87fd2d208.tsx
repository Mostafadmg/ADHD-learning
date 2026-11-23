import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variants?: Array<{ name: string; value: string }>;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
}

const DESKTOP_MIN_WIDTH = 900;

/* Desktop bar: matches the step column width and sits centered under it */
const STEP_MAX_WIDTH = 580;

/* Light blue palette for the desktop bar */
const CARD_BG = '#EFF5FF';
const CARD_BORDER = '#DBEAFE';

/* Mojo copy (21 Oct 2026), copied from "Cart". Every number in this bar comes from ONE shared
   price snapshot (localStorage strut.mojo.pricing / window.__STRUT_MOJO_PRICING__):
   - medication: published by Mojo: Product card (compact), priced live by Strut
   - lab: published by Mojo: Free hormone panel / Mojo: Longevity upgrade, from their settings
   This bar only reads it; no prices or code percentages are typed in. A cart line with no
   matching snapshot entry shows its plain cart price. */
function readPricing(): any {
  try {
    const w = window as any;
    if (w.__STRUT_MOJO_PRICING__) return w.__STRUT_MOJO_PRICING__;
    const raw = window.localStorage.getItem('strut.mojo.pricing');
    return raw ? JSON.parse(raw) : {};
  } catch (_) { return {}; }
}

/* The per-month line in two parts: "$40.29/mo for your first 90 days" | "then $237 every 90 days
   ($79/mo)". The second part shows on its own line, lighter (Chris, 22 Oct). */
function splitPriceLine(s: string): [string, string] {
  const i = s.indexOf(' · ');
  return i < 0 ? [s, ''] : [s.slice(0, i), s.slice(i + 3)];
}

function isLabItem(item: any): boolean {
  return /lab|panel/i.test(String(item?.name || ''));
}

export default function CartDrawer({ drawerHeight, compact = false }: {
  drawerHeight: number;
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, total: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const cartApi = window.pathwai?.cart;
    if (!cartApi) return;

    try {
      setCart(cartApi.getCart());
    } catch (e) {
      console.error('Error initializing cart:', e);
    }

    const handleCartUpdate = (event: CustomEvent<{ cart: Cart }>) => {
      setCart(event.detail.cart);
    };

    window.addEventListener('pathwai:cart:updated', handleCartUpdate as EventListener);
    return () => window.removeEventListener('pathwai:cart:updated', handleCartUpdate as EventListener);
  }, []);

  /* Desktop = compact collapsible bar under the Continue button.
     Narrow screens keep the original fixed bottom banner + drawer. */
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handleQuantityChange = (id: string, newQuantity: number, variants?: Array<{ name: string; value: string }>) => {
    window.pathwai?.cart?.updateQuantity(id, newQuantity, variants);
  };

  const handleRemoveItem = (id: string, variants?: Array<{ name: string; value: string }>) => {
    window.pathwai?.cart?.removeItem(id, variants);
  };

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  /* ONE RULE for every number in this bar: each line has a regular price and a price paid,
     both from the snapshot. Total = sum of prices paid, crossed out against the sum of regular
     prices. "You save" = the difference. */
  const pricing = readPricing();
  const medItem = cart.items.find((it: any) => !isLabItem(it));
  const med = pricing.medication && medItem && String(pricing.medication.priceId) === String(medItem.id)
    ? pricing.medication
    : null;
  const linePair = (item: any) => {
    const line = Number(item.price || 0) * Number(item.quantity || 1);
    if (isLabItem(item) && pricing.lab) {
      const now = Number(pricing.lab.paid) || 0;
      return { was: Math.max(now, Number(pricing.lab.regular) || line), now };
    }
    if (!isLabItem(item) && med && item === medItem) {
      const now = Number(med.paid) || 0;
      return { was: Math.max(now, Number(med.regular) || line), now };
    }
    return { was: line, now: line };
  };
  const priceLine = med && med.priceLine ? String(med.priceLine) : '';
  const [priceLine1, priceLine2] = splitPriceLine(priceLine);
  const pairs = cart.items.map(linePair);
  const regularTotal = Math.round(pairs.reduce((s: number, p: any) => s + p.was, 0) * 100) / 100;
  const payTotal = Math.round(pairs.reduce((s: number, p: any) => s + p.now, 0) * 100) / 100;
  const totalSaved = Math.round((regularTotal - payTotal) * 100) / 100;
  const SavingsPill = () => (totalSaved > 0 ? (
    <span
      style={{
        fontSize: '11px', fontWeight: 600, color: '#166534', background: '#DCFCE7',
        borderRadius: '999px', padding: '2px 8px', marginRight: 8, whiteSpace: 'nowrap',
      }}
    >
      You save ${totalSaved.toFixed(2)}
    </span>
  ) : null);
  const TotalText = () => (regularTotal > payTotal ? (
    <>
      <SavingsPill />
      <span style={{ textDecoration: 'line-through', fontWeight: 400, color: '#6B7280', marginRight: 6 }}>
        ${regularTotal.toFixed(2)}
      </span>
      ${payTotal.toFixed(2)}
    </>
  ) : <><SavingsPill />${payTotal.toFixed(2)}</>);
  const LinePrice = ({ item }: { item: any }) => {
    const p = linePair(item);
    if (p.was > p.now) {
      return (
        <>
          <span style={{ textDecoration: 'line-through', fontWeight: 400, color: '#6B7280', marginRight: 6 }}>
            ${p.was.toFixed(2)}
          </span>
          {p.now > 0 ? '$' + p.now.toFixed(2) : 'Free'}
        </>
      );
    }
    return <>${p.now.toFixed(2)}</>;
  };
  /* The receipt Chris asked for (21 Oct): original price, savings, percent saved, total.
     Same numbers as everything above; nothing typed in. */
  const savedPct = regularTotal > 0 ? Math.round((totalSaved / regularTotal) * 100) : 0;
  const money = (n: number) => '$' + Number(n || 0).toFixed(2);
  const SummaryLines = ({ pad, showPriceLine = true }: { pad: string; showPriceLine?: boolean }) => (
    <div
      style={{
        padding: pad,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: '12px',
        rowGap: '3px',
        fontSize: '13px',
        lineHeight: 1.4,
        color: '#111827',
      }}
    >
      {totalSaved > 0 ? (
        <>
          <span style={{ color: '#6B7280' }}>Original price</span>
          <span style={{ color: '#6B7280', textAlign: 'right' }}>{money(regularTotal)}</span>
          <span style={{ color: '#166534', fontWeight: 600 }}>Your savings today</span>
          <span style={{ color: '#15803D', fontWeight: 700, textAlign: 'right' }}>{money(totalSaved)}</span>
          <span style={{ color: '#166534', fontWeight: 600 }}>You're saving</span>
          <span style={{ color: '#15803D', fontWeight: 700, textAlign: 'right' }}>{savedPct}%</span>
        </>
      ) : null}
      <span style={{ fontWeight: 700, fontSize: '14px', marginTop: totalSaved > 0 ? '4px' : 0 }}>Total at checkout</span>
      <span style={{ fontWeight: 700, fontSize: '14px', textAlign: 'right', marginTop: totalSaved > 0 ? '4px' : 0 }}>{money(payTotal)}</span>
      {priceLine && showPriceLine ? (
        <span style={{ gridColumn: '1 / -1', fontSize: '12px', color: '#6B7280', textAlign: 'right' }}>
          {priceLine1}
          {priceLine2 ? <span style={{ display: 'block', color: '#9CA3AF' }}>{priceLine2}</span> : null}
        </span>
      ) : null}
    </div>
  );
  /* Compact mode (Chris, 21 Oct): from height and weight on, the bar is one line, the per-month
     price. Tapping it opens the full receipt. */
  const compactLine = priceLine || 'Total at checkout ' + money(payTotal);
  const [compact1, compact2] = splitPriceLine(compactLine);
  /* Phone bar is pinned to the bottom of the screen: two lines; tapping opens the full receipt. */
  const SUMMARY_COMPACT_HEIGHT = 44;
  const SummaryCompact = () => (
    <div
      style={{
        padding: '0 24px 10px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: '12px',
        rowGap: '2px',
        fontSize: '13px',
        lineHeight: 1.35,
        color: '#111827',
      }}
    >
      {totalSaved > 0 ? (
        <>
          <span style={{ color: '#166534', fontWeight: 600 }}>You save ({savedPct}%)</span>
          <span style={{ color: '#15803D', fontWeight: 700, textAlign: 'right' }}>{money(totalSaved)}</span>
        </>
      ) : null}
      <span style={{ fontWeight: 700 }}>Total at checkout</span>
      <span style={{ fontWeight: 700, textAlign: 'right' }}>{money(payTotal)}</span>
    </div>
  );
  const firstProductName = cart.items.length > 0 ? cart.items[0].name : null;

  const BANNER_HEIGHT = 56;

  /* Empty cart renders nothing — desktop and mobile alike. */
  if (cart.items.length === 0) return null;

  /* ============================================================
     DESKTOP: collapsible light-blue bar under the Continue button.
     Closed by default (one compact row), expands downward like a
     drawer. Capped at the step column width and centered, so it
     never stretches across the page. Empty cart renders nothing.
  ============================================================ */
  if (isDesktop) {
    if (cart.items.length === 0) return null;

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
          <button type="button"
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
              {compact ? (
                <span style={{ fontSize: '13px', fontWeight: '600', lineHeight: 1.35, textAlign: 'left' }}>
                  {compact1}
                  {compact2 ? <span style={{ display: 'block', fontWeight: 400, color: '#6B7280' }}>{compact2}</span> : null}
                </span>
              ) : (
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
              )}
            </span>

            {/* Right: chevron (the totals sit in the receipt below) */}
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
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
              {cart.items.map((item, index) => (
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
                    <span style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      <LinePrice item={item} />
                    </span>
                  </div>

                  {/* Variants + unit price, muted */}
                  <div style={{ marginTop: '3px', fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>
                    {item.variants && item.variants.map((v, i) => (
                      <div key={i}>{v.name}: {v.value}</div>
                    ))}
                    {item.quantity > 1 && <div>${item.price.toFixed(2)} each</div>}
                  </div>

                  {/* Quantity stepper + remove
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '9px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: '#ffffff',
                        border: `1px solid ${CARD_BORDER}`,
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <button type="button"
                        onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, item.quantity - 1, item.variants); }}
                        style={{
                          width: '26px',
                          height: '26px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6B7280',
                          padding: 0,
                        }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '13px', fontWeight: '500' }}>{item.quantity}</span>
                      <button type="button"
                        onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, item.quantity + 1, item.variants); }}
                        style={{
                          width: '26px',
                          height: '26px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6B7280',
                          padding: 0,
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button type="button"
                      onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id, item.variants); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6B7280',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '0',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
                    >
                      Remove
                    </button>
                  </div> */}
                </div>
              ))}

            </div>
          </div>

          {/* Receipt: always visible, under the line items when the cart is open.
              Compact mode: only when open (the per-month line is already in the bar). */}
          {(!compact || isOpen) && (
            <div style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
              <SummaryLines pad="10px 18px 12px" showPriceLine={!compact} />
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ============================================================
     MOBILE / NARROW: original bottom banner + drawer, unchanged
  ============================================================ */
  return (
    <div>
      {/* Reserves space in the page flow so the fixed bar never covers content */}
      <div style={{ height: `calc(${BANNER_HEIGHT + (compact ? 0 : SUMMARY_COMPACT_HEIGHT)}px + env(safe-area-inset-bottom))` }} />

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
        <button type="button"
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
            {compact ? (
              <span style={{ fontSize: '13px', fontWeight: '600', lineHeight: 1.3, textAlign: 'left' }}>
                {compact1}
                {compact2 ? <span style={{ display: 'block', fontWeight: 400, color: '#6B7280' }}>{compact2}</span> : null}
              </span>
            ) : (
            <span style={{ fontSize: '15px', fontWeight: '600', color: 'inherit' }}>
              {firstProductName
                ? <>{firstProductName} {totalItems > 1 && <span style={{ fontWeight: '400', opacity: 0.7 }}>({totalItems})</span>}</>
                : <span style={{ fontWeight: '400', opacity: 0.7 }}>Your cart is empty</span>
              }
            </span>
            )}
          </div>

          {/* Right side: chevron (the totals sit in the two lines below) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        {!compact && <SummaryCompact />}
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
          <button type="button"
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
            cart.items.map((item, index) => (
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
                  <button type="button"
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
                  <span style={{ color: '#6b7280', fontSize: '13px' }}>${item.price.toFixed(2)} each</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button type="button"
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
                    <button type="button"
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
                  <LinePrice item={item} />
                </div>
              </div>
            ))
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
            }}
          >
            <SummaryLines pad="0" />
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
  compact: {
    type: 'boolean',
    title: 'Compact: one line (per-month price), tap for the receipt',
    defaultValue: false,
  },
};