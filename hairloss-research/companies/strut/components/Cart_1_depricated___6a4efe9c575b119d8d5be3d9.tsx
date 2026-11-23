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

export default function CartDrawer({ drawerHeight }: {
  drawerHeight: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, total: 0 });

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

  const handleQuantityChange = (id: string, newQuantity: number, variants?: Array<{ name: string; value: string }>) => {
    window.pathwai?.cart?.updateQuantity(id, newQuantity, variants);
  };

  const handleRemoveItem = (id: string, variants?: Array<{ name: string; value: string }>) => {
    window.pathwai?.cart?.removeItem(id, variants);
  };

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const firstProductName = cart.items.length > 0 ? cart.items[0].name : null;

  const BANNER_HEIGHT = 56;

  return (
    <div>
      {/* Fixed bottom banner */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          opacity: isOpen ? 0 : 1,
          pointerEvents: isOpen ? 'none' : 'auto',
          transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: 'transparent',
            color: 'inherit',
            border: 'none',
            borderTop: '1px solid currentColor',
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

          {/* Right side: total + chevron */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                  <button
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
                    <button
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