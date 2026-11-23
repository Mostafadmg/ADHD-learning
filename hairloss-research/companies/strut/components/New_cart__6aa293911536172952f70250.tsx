// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect } from 'react';

/* ============================================================
   PathwAI Cart Drawer — generic in-flow cart banner + drawer

   Paste into any Strut/PathwAI checkout flow step (e.g. under
   the Continue button on desktop, fixed bottom bar on mobile).

   Product title, subtitle, audience, and variant labels are read
   from the pricing card snapshot written to:
     • pathwai.getProductDisplay()
     • window.__PATHWAI_PRODUCT_DISPLAY__
     • localStorage pathwai.productDisplay

   Cart line prices/quantities still come from window.pathwai.cart.
============================================================ */

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
  subtitle?: string;
  audienceLabel?: string;
  variants?: CartItemVariant[];
}

interface ProductDisplay {
  productTitle: string;
  productSubtitle: string;
  audienceLabel: string;
  subAxisLabel: string;
  variantLabel: string;
  variantId: string;
  priceId: number;
  price: number;
  productSlug: string;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
}

const EMPTY_CART: Cart = { items: [], subtotal: 0, total: 0 };
const DESKTOP_MIN_WIDTH = 900;
const STEP_MAX_WIDTH = 580;
const BANNER_HEIGHT = 56;

const CARD_BG = '#EFF5FF';
const CARD_BORDER = '#DBEAFE';
const PRODUCT_DISPLAY_KEY = 'pathwai.productDisplay';

function getStrut() {
  return typeof window !== 'undefined' ? (window as any).strut : null;
}

function getPathwaiCart() {
  return typeof window !== 'undefined' ? (window as any).pathwai?.cart : null;
}

function isBlankName(value: unknown) {
  const s = String(value ?? '').trim();
  return !s || s === 'undefined' || s === 'null';
}

function stripUndefinedPrefix(value: unknown) {
  return String(value ?? '').replace(/^undefined\s+/i, '').trim();
}

function pickFirstNonBlank(...values: unknown[]): string {
  for (const value of values) {
    const cleaned = stripUndefinedPrefix(value);
    if (!isBlankName(cleaned)) return cleaned;
  }
  return '';
}

/** Dose / supply / SKU text — not the product title shown on the pricing card. */
function looksLikeVariantLabel(text: string) {
  const s = stripUndefinedPrefix(text);
  if (!s) return false;
  if (/^(low|medium|high|combo|plus|starter|maintenance)$/i.test(s)) return true;
  return /lozenge|mcg|mg\/|day supply|vial|\bml\b|tablet|capsule|formula|double|\d+\s*(mg|mcg)/i.test(s)
    || /^low dose|^medium dose|^high dose/i.test(s);
}

function parseStoredJson(key: string): Record<string, unknown> | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw || raw === 'undefined') return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function normalizeProductDisplay(raw: Record<string, unknown> | null | undefined): ProductDisplay | null {
  if (!raw) return null;
  const productTitle = pickFirstNonBlank(
    raw.productTitle,
    raw.ProductTitle,
    raw.formulationLabel,
    raw.FormulationLabel,
  );
  if (isBlankName(productTitle)) return null;

  return {
    productTitle,
    productSubtitle: pickFirstNonBlank(
      raw.productSubtitle,
      raw.ProductSubtitle,
      raw.subtitle,
      raw.Subtitle,
    ),
    audienceLabel: pickFirstNonBlank(raw.audienceLabel, raw.AudienceLabel),
    subAxisLabel: pickFirstNonBlank(raw.subAxisLabel, raw.SubAxisLabel) || 'Selection',
    variantLabel: pickFirstNonBlank(
      raw.variantLabel,
      raw.VariantLabel,
      raw.label,
      raw.Label,
    ),
    variantId: String(raw.variantId ?? raw.VariantId ?? raw.formulationKey ?? raw.FormulationKey ?? '').trim(),
    priceId: Number(raw.priceId ?? raw.PriceId ?? 0),
    price: Number(raw.price ?? raw.Price ?? raw.variantPrice ?? raw.VariantPrice ?? 0),
    productSlug: String(raw.productSlug ?? raw.ProductSlug ?? '').trim(),
  };
}

/** Pricing cards call syncPathwaiProductDisplay — read that snapshot here. */
function readProductDisplay(): ProductDisplay | null {
  const w = window as any;
  try {
    if (typeof w.pathwai?.getProductDisplay === 'function') {
      const fromApi = normalizeProductDisplay(w.pathwai.getProductDisplay());
      if (fromApi) return fromApi;
    }
    const fromWindow = normalizeProductDisplay(w.__PATHWAI_PRODUCT_DISPLAY__);
    if (fromWindow) return fromWindow;
    return normalizeProductDisplay(parseStoredJson(PRODUCT_DISPLAY_KEY));
  } catch {
    return null;
  }
}

function productDisplayFromRaw(raw: Record<string, unknown>): ProductDisplay | null {
  return normalizeProductDisplay({
    productTitle: pickFirstNonBlank(raw.productTitle, raw.ProductTitle, raw.productName, raw.ProductName),
    productSubtitle: pickFirstNonBlank(raw.productSubtitle, raw.ProductSubtitle, raw.subtitle, raw.Subtitle),
    audienceLabel: pickFirstNonBlank(raw.audienceLabel, raw.AudienceLabel),
    subAxisLabel: pickFirstNonBlank(raw.subAxisLabel, raw.SubAxisLabel),
    variantLabel: pickFirstNonBlank(raw.variantLabel, raw.VariantLabel, raw.label, raw.Label),
    variantId: raw.variantId ?? raw.VariantId ?? raw.formulationKey ?? raw.FormulationKey,
    priceId: raw.priceId ?? raw.PriceId ?? raw.id ?? raw.Id ?? raw.ProductPriceId,
    price: raw.price ?? raw.Price,
    productSlug: raw.productSlug ?? raw.ProductSlug,
  });
}

function buildVariantsFromDisplay(display: ProductDisplay): CartItemVariant[] {
  if (!display.variantLabel) return [];
  return [{
    name: display.subAxisLabel || 'Selection',
    value: display.variantLabel,
  }];
}

function itemMatchesDisplay(item: CartItem, display: ProductDisplay): boolean {
  if (display.priceId > 0 && String(item.id) === String(display.priceId)) return true;
  return false;
}

function upsertVariant(
  variants: CartItemVariant[],
  name: string,
  value: string,
): CartItemVariant[] {
  const axis = name || 'Selection';
  const val = stripUndefinedPrefix(value);
  if (!val || variants.some((v) => v.value === val)) return variants;
  return [{ name: axis, value: val }, ...variants];
}

function finalizeCartItem(item: CartItem, display: ProductDisplay | null): CartItem {
  const productTitle = pickFirstNonBlank(
    display?.productTitle,
    resolveProductTitle(),
  );
  const subAxisLabel = display?.subAxisLabel || 'Selection';
  let variants = [...(item.variants || [])];

  const rawName = stripUndefinedPrefix(item.name);
  if (rawName && productTitle && rawName.toLowerCase() !== productTitle.toLowerCase()) {
    if (looksLikeVariantLabel(rawName)) {
      variants = upsertVariant(variants, subAxisLabel, rawName);
    }
  }

  if (display?.variantLabel) {
    variants = upsertVariant(variants, display.subAxisLabel || subAxisLabel, display.variantLabel);
  }

  const name = productTitle
    || (looksLikeVariantLabel(rawName) ? '' : rawName)
    || 'Your item';

  return {
    ...item,
    name,
    subtitle: pickFirstNonBlank(display?.productSubtitle, item.subtitle) || undefined,
    audienceLabel: pickFirstNonBlank(display?.audienceLabel, item.audienceLabel) || undefined,
    price: display && display.price > 0 ? display.price : item.price,
    variants,
  };
}

function finalizeCart(cart: Cart, display: ProductDisplay | null): Cart {
  if (!cart.items.length) {
    if (!display) return cart;
    return withTotals([{
      id: String(display.priceId || 'product-item'),
      name: display.productTitle,
      subtitle: display.productSubtitle || undefined,
      audienceLabel: display.audienceLabel || undefined,
      price: display.price > 0 ? display.price : 0,
      quantity: 1,
      variants: buildVariantsFromDisplay(display),
    }]);
  }

  const items = cart.items.map((item, index) => {
    const itemDisplay = display && (cart.items.length === 1 || itemMatchesDisplay(item, display))
      ? display
      : display && index === 0
        ? display
        : null;
    return finalizeCartItem(item, itemDisplay);
  });

  return withTotals(items);
}

function resolveProductTitleFromFlow(): string {
  try {
    const w = window as any;
    const slug = String(w.strut?.getVisiting?.()?.ProductSlug || '').toLowerCase();
    const href = String(typeof window !== 'undefined' ? window.location?.href : '').toLowerCase();
    const blob = `${slug} ${href}`;
    if (/semaglutide_oral|semaglutide-oral/.test(blob)) return 'Semaglutide Oral + B6';
    if (/semaglutide_inj|semaglutide-inj/.test(blob)) return 'Semaglutide Inj';
    if (/womens-finasteride|womens_finasteride/.test(blob)) return 'Finasteride';
    if (/finasteride/.test(blob)) return 'Finasteride';
    if (/tirzepatide.*oral|tirzepatide_oral/.test(blob)) return 'Tirzepatide Oral';
    if (/tirzepatide/.test(blob)) return 'Tirzepatide Inj';
    if (/minoxidil/.test(blob)) return 'Minoxidil Tablets';
    if (/paroxetine/.test(blob)) return 'ParoxetineRx';
  } catch { /* ignore */ }
  return '';
}

function resolveProductTitle(): string {
  const display = readProductDisplay();
  if (display?.productTitle) return display.productTitle;

  const w = window as any;
  const strut = w.strut;
  return pickFirstNonBlank(
    strut?.getOrder?.()?.Cart?.ProductName,
    strut?.getOrder?.()?.ProductName,
    strut?.getVisiting?.()?.ProductName,
    resolveProductTitleFromFlow(),
    w.__STRUT_PRODUCT_NAME__,
  );
}

function normalizeVariants(raw: Record<string, unknown>): CartItemVariant[] {
  const list = (raw?.variants ?? raw?.Variations ?? []) as Array<Record<string, unknown>>;
  if (!Array.isArray(list)) return [];
  return list.map((v) => ({
    name: String(v?.name ?? v?.Name ?? '').trim(),
    value: String(v?.value ?? v?.Value ?? '').trim(),
  })).filter((v) => v.name || v.value);
}

function normalizeCartItem(raw: Record<string, unknown>): CartItem {
  const fromRawDisplay = productDisplayFromRaw(raw);
  const productTitle = pickFirstNonBlank(
    fromRawDisplay?.productTitle,
    raw?.productTitle,
    raw?.ProductTitle,
    raw?.productName,
    raw?.ProductName,
  );

  const lineLabel = pickFirstNonBlank(
    raw?.name,
    raw?.Name,
    raw?.title,
    raw?.Title,
    raw?.label,
    raw?.Label,
    raw?.description,
    raw?.Description,
  );

  let variants = normalizeVariants(raw);
  const subAxisLabel = pickFirstNonBlank(
    fromRawDisplay?.subAxisLabel,
    raw?.subAxisLabel,
    raw?.SubAxisLabel,
  ) || 'Selection';
  const variantLabel = pickFirstNonBlank(
    fromRawDisplay?.variantLabel,
    raw?.variantLabel,
    raw?.VariantLabel,
  );

  const resolvedTitle = pickFirstNonBlank(productTitle, resolveProductTitle());

  if (variantLabel) {
    variants = upsertVariant(variants, subAxisLabel, variantLabel);
  }
  if (lineLabel && lineLabel.toLowerCase() !== resolvedTitle.toLowerCase()) {
    if (looksLikeVariantLabel(lineLabel) || variants.length === 0) {
      variants = upsertVariant(variants, subAxisLabel, lineLabel);
    }
  }

  const displayName = resolvedTitle
    || (looksLikeVariantLabel(lineLabel) ? '' : lineLabel)
    || 'Your item';

  return {
    id: String(raw?.id ?? raw?.Id ?? raw?.ProductPriceId ?? raw?.productPriceId ?? ''),
    name: displayName,
    subtitle: pickFirstNonBlank(
      fromRawDisplay?.productSubtitle,
      raw?.productSubtitle,
      raw?.ProductSubtitle,
    ) || undefined,
    audienceLabel: pickFirstNonBlank(
      fromRawDisplay?.audienceLabel,
      raw?.audienceLabel,
      raw?.AudienceLabel,
    ) || undefined,
    price: Number(raw?.price ?? raw?.Price ?? fromRawDisplay?.price ?? 0),
    quantity: Math.max(1, Number(raw?.quantity ?? raw?.Quantity ?? 1) || 1),
    image: (raw?.image ?? raw?.Image) as string | undefined,
    variants,
  };
}

function withTotals(items: CartItem[]): Cart {
  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
    0
  );
  return { items, subtotal, total: subtotal };
}

function normalizeCart(raw: Record<string, unknown> | null | undefined): Cart {
  if (!raw) return EMPTY_CART;
  const items = ((raw?.items ?? raw?.Items ?? []) as Array<Record<string, unknown>>)
    .map(normalizeCartItem)
    .filter((it) => it.id || !isBlankName(it.name));
  const computed = withTotals(items);
  const subtotal = Number(raw?.subtotal ?? raw?.Subtotal ?? computed.subtotal);
  const total = Number(raw?.total ?? raw?.Total ?? subtotal);
  return {
    items: computed.items,
    subtotal: Number.isFinite(subtotal) ? subtotal : computed.subtotal,
    total: Number.isFinite(total) ? total : computed.total,
  };
}

function readPathwaiCart(): Cart {
  const cartApi = getPathwaiCart();
  if (!cartApi?.getCart) return EMPTY_CART;
  try {
    return normalizeCart(cartApi.getCart());
  } catch {
    return EMPTY_CART;
  }
}

/** Seed a single line from Strut order/visiting when PathwAI cart is empty. */
function seedCartFromStrut(): Cart | null {
  const w = window as any;
  const strut = w.strut;
  if (!strut) return null;

  const order = strut.getOrder?.();
  const visiting = strut.getVisiting?.();
  const orderCart = order?.Cart;
  const priceId = Number(
    orderCart?.ProductPriceId ||
    strut.resolveCheckoutPriceId?.() ||
    visiting?.ProductPriceId ||
    w.strut_tirzepatide_price_id ||
    w.strut_minoxidil_price_id ||
    w.strut_womens_finasteride_price_id ||
    w.strut_finasteride_price_id ||
    w.strut_semaglutide_oral_price_id ||
    w.strut_semaglutide_price_id ||
    0
  );
  const name = resolveProductTitle();
  const price = Number(orderCart?.Price || 0);
  const qty = Number(orderCart?.Quantity || 1) || 1;

  if (!priceId && !name) return null;

  const seeded = withTotals([{
    id: String(priceId || 'order-item'),
    name: name || 'Your item',
    price: price > 0 ? price : 0,
    quantity: qty,
  }]);

  return finalizeCart(seeded, readProductDisplay());
}

function resolveDrawerCart(rawCart?: Record<string, unknown> | null): Cart {
  const strut = getStrut();
  if (typeof strut?.ensurePathwaiCart === 'function') {
    try { strut.ensurePathwaiCart(); } catch { /* ignore */ }
  }

  const display = readProductDisplay();
  const fromPathwai = rawCart ? normalizeCart(rawCart) : readPathwaiCart();

  if (fromPathwai.items.length) {
    return finalizeCart(fromPathwai, display);
  }

  if (display) {
    return finalizeCart(EMPTY_CART, display);
  }

  return seedCartFromStrut() || EMPTY_CART;
}

function resolveBannerLabel(items: CartItem[]): string | null {
  if (!items.length) return null;
  const title = pickFirstNonBlank(items[0]?.name, resolveProductTitle());
  return title || null;
}

function formatMoney(amount: number) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

export default function CartDrawer({
  drawerHeight = 480,
}: {
  drawerHeight?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setCart(resolveDrawerCart());

    const handleCartUpdate = (event: CustomEvent<{ cart: Cart }>) => {
      setCart(resolveDrawerCart(event.detail?.cart as unknown as Record<string, unknown>));
    };

    window.addEventListener('pathwai:cart:updated', handleCartUpdate as EventListener);
    return () => window.removeEventListener('pathwai:cart:updated', handleCartUpdate as EventListener);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handleQuantityChange = (
    id: string,
    newQuantity: number,
    variants?: CartItemVariant[]
  ) => {
    getPathwaiCart()?.updateQuantity?.(id, newQuantity, variants);
  };

  const handleRemoveItem = (id: string, variants?: CartItemVariant[]) => {
    getPathwaiCart()?.removeItem?.(id, variants);
  };

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const bannerLabel = resolveBannerLabel(cart.items);

  if (cart.items.length === 0) return null;

  const renderItemMeta = (item: CartItem) => (
    <>
      {item.audienceLabel && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#374151',
          }}
        >
          {item.audienceLabel}
        </div>
      )}
      {item.subtitle && (
        <div style={{ marginTop: '4px', fontSize: '12px', color: '#6B7280', lineHeight: 1.4 }}>
          {item.subtitle}
        </div>
      )}
    </>
  );

  const renderItemVariants = (item: CartItem) => {
    if (!item.variants?.length) return null;
    return (
      <div style={{ marginTop: '6px', fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>
        {item.variants.map((v, i) => (
          <div key={i}>{v.name ? `${v.name}: ` : ''}{v.value}</div>
        ))}
        {item.quantity > 1 && <div>{formatMoney(item.price)} each</div>}
      </div>
    );
  };

  const renderDesktopItem = (item: CartItem, index: number) => (
    <div
      key={`${item.id}-${index}`}
      style={{
        padding: '12px 0',
        borderTop: `1px solid ${CARD_BORDER}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
        <span style={{ fontWeight: '600', fontSize: '14px', lineHeight: 1.35 }}>{item.name}</span>
        <span style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' }}>
          {formatMoney(item.price * item.quantity)}
        </span>
      </div>
      {renderItemMeta(item)}
      {renderItemVariants(item)}
    </div>
  );

  const renderMobileItem = (item: CartItem, index: number) => (
    <div
      key={`${item.id}-${index}`}
      style={{
        padding: '12px',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ minWidth: 0, paddingRight: '12px' }}>
          <div style={{ fontWeight: '500', fontSize: '14px', color: '#111827' }}>{item.name}</div>
          {renderItemMeta(item)}
        </div>
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
            flexShrink: 0,
            alignSelf: 'flex-start',
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
            <div key={i}>{v.name ? `${v.name}: ` : ''}{v.value}</div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: '#6b7280', fontSize: '13px' }}>{formatMoney(item.price)} each</span>
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
          <span style={{ width: '28px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            {item.quantity}
          </span>
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
        {formatMoney(item.price * item.quantity)}
      </div>
    </div>
  );

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
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, color: '#374151' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
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
                {bannerLabel}
                {totalItems > 1 && (
                  <span style={{ fontWeight: '400', color: '#6B7280' }}> ({totalItems})</span>
                )}
              </span>
            </span>

            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>{formatMoney(cart.total)}</span>
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
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>

          <div
            style={{
              maxHeight: isOpen ? '500px' : '0px',
              opacity: isOpen ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
            }}
          >
            <div style={{ padding: '0 18px 14px' }}>
              {cart.items.map(renderDesktopItem)}

              <div
                style={{
                  paddingTop: '12px',
                  borderTop: `1px solid ${CARD_BORDER}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontSize: '13px', color: '#6B7280' }}>Total</span>
                <span style={{ fontSize: '15px', fontWeight: '700' }}>{formatMoney(cart.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ height: `calc(${BANNER_HEIGHT}px + env(safe-area-inset-bottom))` }} />

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
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span style={{ fontSize: '15px', fontWeight: '600', color: 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {bannerLabel ? (
                <>
                  {bannerLabel}
                  {totalItems > 1 && (
                    <span style={{ fontWeight: '400', opacity: 0.7 }}> ({totalItems})</span>
                  )}
                </>
              ) : (
                <span style={{ fontWeight: '400', opacity: 0.7 }}>Your cart</span>
              )}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {cart.items.length > 0 && (
              <span style={{ fontSize: '15px', fontWeight: '700', color: 'inherit' }}>
                {formatMoney(cart.total)}
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
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>
      </div>

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
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0 }}>
          <div style={{ width: '40px', height: '4px', backgroundColor: '#d1d5db', borderRadius: '2px' }} />
        </div>

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

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {cart.items.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '32px' }}>Your cart is empty</p>
          ) : (
            cart.items.map(renderMobileItem)
          )}
        </div>

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
              <span>{formatMoney(cart.total)}</span>
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
