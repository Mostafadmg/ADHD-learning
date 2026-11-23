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

  const BUNDLE_LINE_PREFIX = 'bundle-';

  function isBundleLine(item: CartItem) {
    return String(item?.id || '').indexOf(BUNDLE_LINE_PREFIX) === 0;
  }

  function isLabLine(item: CartItem) {
    if (isBundleLine(item)) return false;
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

  function isForeignProductLine(item: CartItem) {
    if (isBundleLine(item)) return false;
    if (isLabLine(item)) return true;
    return FOREIGN_CART_RE.test(`${item?.id || ''} ${item?.name || ''}`);
  }

  function sanitizeCartItems(items: CartItem[]): CartItem[] {
    const all = Array.isArray(items) ? items : [];
    const bundles = all.filter(isBundleLine);
    return [...sanitizeProductLines(all.filter((it) => !isBundleLine(it))), ...bundles];
  }

  function sanitizeProductLines(list: CartItem[]): CartItem[] {
    const onTirz = isTirzepatideFlow() || list.some(isTirzepatideLine);
    const onMinox = isMinoxidilFlow() || list.some(isMinoxidilLine);
    const onSermorelin = isSermorelinFlow() || list.some(isSermorelinLine);
    const onSemaglutideInj = isSemaglutideInjFlow() || list.some(isSemaglutideInjLine);
    if (!onTirz && !onMinox && !onSermorelin && !onSemaglutideInj) return list;
    const cleaned = list.filter((it) => !isForeignProductLine(it));
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

  /** Product lines only; carousel add-on lines are rendered from the SDK selection. */
  function withCartTotals(items: CartItem[]): Cart {
    const unique = sanitizeCartItems(dedupeLabLines(items)).filter((it) => !isBundleLine(it));
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
      if (next.length === current.length) return;
      cartApi.clearCart();
      next.forEach((it: CartItem) => cartApi.addItem(it));
    } catch { /* ignore */ }
  }

  function shouldSkipEncloLab() {
    return isTirzepatideFlow() || isMinoxidilFlow() || isSermorelinFlow()
      || /semaglutide|sildenafil|tadalafil|finasteride|dutasteride|bhrt/i.test(flowBlob());
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

  function readPathwaiCartItems(): CartItem[] {
    try {
      return getPathwaiCart()?.getCart?.()?.items || [];
    } catch {
      return [];
    }
  }

  /** Main product line from the stored GetCurrentVisiting order; Cart.Price is the line total. */
  function mainLineFromOrder(order: any): CartItem | null {
    const c = order?.Cart;
    const priceId = Number(c?.ProductPriceId || 0);
    if (!priceId || !(Number(c?.Price) > 0)) return null;
    const variants: CartItemVariant[] = [];
    if (c.Strength) variants.push({ name: 'Strength', value: String(c.Strength) });
    return {
      id: String(priceId),
      name: String(c.ProductName || 'Your treatment'),
      price: Number(c.Price),
      quantity: 1,
      variants: variants.length ? variants : undefined,
    };
  }

  function mergeApiCart(prev: Cart, data: any): Cart {
    const apiName = String(data?.ProductName || data?.Name || '');
    const apiPriceId = Number(data?.ProductPriceId || 0);
    const apiIsTirzepatide = /tirzepatide/i.test(apiName);
    const apiIsMinoxidil = /minoxidil/i.test(apiName);
    const apiIsSemaglutideInj = /semaglutide/i.test(apiName) || SEMAGLUTIDE_INJ_PRICE_IDS.has(apiPriceId);
    const rxPrice = Number(data?.Price || 0);
    let rxPatched = false;
    let source = sanitizeCartItems(prev.items || []).filter((it) => !isBundleLine(it));
    if (!source.length && apiPriceId > 0 && (apiName || apiIsSemaglutideInj)) {
      const semaDetails = apiIsSemaglutideInj
        ? semaglutideInjLineDetails(apiPriceId, apiName, rxPrice)
        : { name: apiName, price: rxPrice > 0 ? rxPrice : 0 };
      source = [{
        id: String(apiPriceId),
        name: semaDetails.name,
        price: semaDetails.price > 0 ? semaDetails.price : (rxPrice > 0 ? rxPrice : 0),
        // GetCartItem Price is already the sum of line totals; Quantity is the unit count (e.g. 30 tablets).
        quantity: 1,
        variants: apiIsSemaglutideInj ? [{
          name: 'Vial size',
          value: apiPriceId === 614 || apiPriceId === 953 ? '4mL Maintenance Dose' : '2mL Starting Dose',
        }] : undefined,
      }];
    }
    const items = source.map((it) => {
      if (!rxPatched && !isLabLine(it) && !isBundleLine(it) && (rxPrice > 0 || apiIsSemaglutideInj) && (apiIsTirzepatide || apiIsMinoxidil || apiIsSemaglutideInj || (!isTirzepatideFlow() && !isMinoxidilFlow()))) {
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

  /* ---------- Product Carousel (Prescription Management → Carousel mapping) ---------- */

  interface BundleProduct {
    Id: number;
    Name?: string;
    Description?: string;
    Description50?: string;
    ImageUrl?: string;
    Price?: number;
    Quantity?: number;
    Strength?: string;
    SubscriptionDurationName?: string;
    OtcOrRxProductPortalItemId?: number | null;
  }

  function hasBundleApi(strut: any) {
    return typeof strut?.getBundleProducts === 'function'
      && typeof strut?.getBundleSelection === 'function'
      && typeof strut?.selectBundleProduct === 'function'
      && typeof strut?.removeBundleProduct === 'function';
  }

  function isRxBundle(p: BundleProduct) {
    return Number(p?.OtcOrRxProductPortalItemId || 0) > 0;
  }

  /** Must match strut.bundleKey in the SDK. */
  function bundleKeyOf(p: BundleProduct) {
    return isRxBundle(p) ? `rx-${Number(p.OtcOrRxProductPortalItemId)}` : `otc-${Number(p?.Id || 0)}`;
  }

  const bundleLineId = (key: string) => `${BUNDLE_LINE_PREFIX}${key}`;

  function bundleSubtitle(p: BundleProduct) {
    const parts = [p.Strength, p.SubscriptionDurationName]
      .map((s) => String(s || '').trim())
      .filter(Boolean);
    if (parts.length) return parts.join(' · ');
    return String(p.Description50 || p.Description || '').trim();
  }

  /** Rx add-ons are charged once at ProductPrice.Price; OTC add-ons at Price × Quantity. */
  function bundleQuantity(p: BundleProduct) {
    return isRxBundle(p) ? 1 : Number(p.Quantity || 1) || 1;
  }

  function bundleCartLine(p: BundleProduct): CartItem {
    const variants: CartItemVariant[] = [];
    if (p.Strength) variants.push({ name: 'Strength', value: String(p.Strength) });
    if (p.SubscriptionDurationName) variants.push({ name: 'Supply', value: String(p.SubscriptionDurationName) });
    return {
      id: bundleLineId(bundleKeyOf(p)),
      name: String(p.Name || 'Add-on'),
      price: Number(p.Price || 0),
      quantity: bundleQuantity(p),
      image: p.ImageUrl,
      variants: variants.length ? variants : undefined,
    };
  }

  function usableImageUrl(url?: string) {
    const u = String(url || '').trim();
    if (!u || /\/$/.test(u) || /(undefined|null)$/i.test(u)) return '';
    return u;
  }

  function removeCartLine(cartApi: any, id: string) {
    if (typeof cartApi.removeItem === 'function') {
      cartApi.removeItem(id);
      return;
    }
    const rest = (cartApi.getCart()?.items || []).filter((it: CartItem) => it.id !== id);
    cartApi.clearCart();
    rest.forEach((it: CartItem) => cartApi.addItem(it));
  }

  /** Make pathwai.cart bundle lines match the SDK selection (survives step reloads). */
  function reconcileBundleLines(products: BundleProduct[]) {
    const cartApi = getPathwaiCart();
    const strut = getStrut();
    if (!cartApi?.getCart || !cartApi?.addItem || !hasBundleApi(strut)) return;
    try {
      const selectedKeys = new Set<string>((strut.getBundleSelection() || []).map(bundleKeyOf));
      const byKey = new Map(products.map((p) => [bundleKeyOf(p), p] as [string, BundleProduct]));
      const current: CartItem[] = cartApi.getCart()?.items || [];
      current.filter(isBundleLine).forEach((it) => {
        const key = it.id.slice(BUNDLE_LINE_PREFIX.length);
        if (!selectedKeys.has(key) || !byKey.has(key)) removeCartLine(cartApi, it.id);
      });
      const remaining: CartItem[] = cartApi.getCart()?.items || [];
      selectedKeys.forEach((key) => {
        const p = byKey.get(key);
        if (p && !remaining.some((it) => it.id === bundleLineId(key))) cartApi.addItem(bundleCartLine(p));
      });
    } catch (e) {
      console.error('OrderSummary: failed to sync carousel add-ons', e);
    }
  }

  function PlusIcon() {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  function CheckIcon() {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    );
  }

  function BundleCard({
    product,
    selected,
    onToggle,
  }: {
    product: BundleProduct;
    selected: boolean;
    onToggle: () => void;
  }) {
    const [imageFailed, setImageFailed] = useState(false);
    const name = String(product.Name || 'Add-on');
    const subtitle = bundleSubtitle(product);
    const image = imageFailed ? '' : usableImageUrl(product.ImageUrl);
    const price = Number(product.Price || 0) * bundleQuantity(product);

    return (
      <div
        role="listitem"
        style={{
          flex: '0 0 min(240px, 78%)',
          scrollSnapAlign: 'start',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--pw-color-surface, #ffffff)',
          border: `1px solid ${selected ? 'var(--pw-color-brand, #161336)' : 'var(--pw-color-border, #E4E4E7)'}`,
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(22, 19, 54, 0.06)',
          boxSizing: 'border-box',
          transition: 'border-color var(--pw-motion-duration, 180ms) var(--pw-motion-ease, ease)',
        }}
      >
        <div
          style={{
            height: '170px',
            background: 'linear-gradient(180deg, #C9D3DE 0%, #E4E8EC 70%, #D7D5D0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <span
              style={{
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--pw-color-brand, #161336)',
                opacity: 0.5,
                padding: '0 1rem',
                textAlign: 'center',
              }}
            >
              {name}
            </span>
          )}
        </div>
        <div
          style={{
            padding: '1rem 1.125rem 1.125rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            flex: 1,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: '1.125rem',
              lineHeight: 1.3,
              color: 'var(--pw-color-brand, #161336)',
            }}
          >
            {name}
          </span>
          {subtitle ? (
            <span
              style={{
                fontSize: '0.9375rem',
                color: 'var(--pw-color-muted, #71717a)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {subtitle}
            </span>
          ) : null}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              marginTop: 'auto',
              paddingTop: '0.75rem',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--pw-color-brand, #161336)' }}>
              {formatPrice(price)}
            </span>
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={selected}
              aria-label={selected ? `Remove ${name} from order` : `Add ${name} to order`}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: 'none',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: selected ? 'var(--pw-color-brand, #161336)' : '#EFEFF4',
                color: selected ? '#ffffff' : 'var(--pw-color-brand, #161336)',
                transition: 'background var(--pw-motion-duration, 180ms) var(--pw-motion-ease, ease)',
              }}
            >
              {selected ? <CheckIcon /> : <PlusIcon />}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
    const [bundleProducts, setBundleProducts] = useState<BundleProduct[]>([]);
    const [selectedBundleKeys, setSelectedBundleKeys] = useState<string[]>([]);
    const [bundleError, setBundleError] = useState('');

    useEffect(() => {
      const strut = getStrut();
      if (!getPathwaiCart() || !hasBundleApi(strut)) return;

      let cancelled = false;
      const refreshSelection = () => {
        try {
          setSelectedBundleKeys((strut.getBundleSelection() || []).map(bundleKeyOf));
        } catch { /* ignore */ }
      };

      (async () => {
        const list = typeof strut.loadBundleProducts === 'function'
          ? await strut.loadBundleProducts()
          : strut.getBundleProducts();
        if (cancelled) return;
        const products: BundleProduct[] = (Array.isArray(list) ? list : []).filter(isRxBundle);
        setBundleProducts(products);
        refreshSelection();
        reconcileBundleLines(products);
      })().catch((e) => console.error('OrderSummary: failed to load carousel products', e));

      window.addEventListener('strut:bundle:updated', refreshSelection);
      return () => {
        cancelled = true;
        window.removeEventListener('strut:bundle:updated', refreshSelection);
      };
    }, []);

    const toggleBundle = (product: BundleProduct) => {
      const key = bundleKeyOf(product);
      const isSelected = selectedBundleKeys.includes(key);
      setBundleError('');

      const strut = getStrut();
      if (!hasBundleApi(strut)) return;

      try {
        if (isSelected) strut.removeBundleProduct(key);
        else strut.selectBundleProduct(key);
      } catch (e: any) {
        setBundleError(e?.message || 'Could not update your order. Please try again.');
        return;
      }
      setSelectedBundleKeys((strut.getBundleSelection() || []).map(bundleKeyOf));
      reconcileBundleLines(bundleProducts);
    };

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
        const atMount = cartApi.getCart()?.items || [];
        console.info('[OrderSummary] pathwai.cart at mount', atMount);
        const cleaned = withCartTotals(atMount);
        setCart(cleaned);
        syncPathwaiCart(cleaned.items);
      } catch (e) {
        console.error('OrderSummary: failed to read cart', e);
        setCart(EMPTY_CART);
      }

      const handleCartUpdate = (event: CustomEvent<{ cart: Cart }>) => {
        if (!event.detail?.cart) return;
        const cleaned = withCartTotals(event.detail.cart.items || []);
        // pathwai.cart may hold only add-on lines, or an unpriced main line, while the
        // displayed main line came from GetCartItem; keep it unless the product changed.
        setCart((prev) => {
          if (!cleaned.items.length) return prev;
          const prevItems = prev.items || [];
          const sameLines = cleaned.items.length === prevItems.length
            && cleaned.items.every((it, i) => it.id === prevItems[i]?.id);
          return sameLines ? prev : cleaned;
        });
      };

      window.addEventListener('pathwai:cart:updated', handleCartUpdate as EventListener);

      // pathwai.cart can be empty when this step mounts; fall back to the stored order.
      const ensureMainLine = (reason: string) => {
        setCart((prev) => {
          if ((prev.items || []).length) return prev;
          const fromPathwai = withCartTotals(readPathwaiCartItems());
          if (fromPathwai.items.length) {
            console.info('[OrderSummary] main line from pathwai.cart', reason);
            return fromPathwai;
          }
          const line = mainLineFromOrder(getStrut()?.getOrder?.());
          if (line) {
            console.info('[OrderSummary] main line from stored order', reason, line);
            return withCartTotals([line]);
          }
          return prev;
        });
      };
      const retryTimers = [300, 1000, 2500].map((ms) => setTimeout(() => ensureMainLine(`retry-${ms}ms`), ms));

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
        if (strut && !strut.getOrderId?.() && strut.getVisitingId?.() && typeof strut.getCurrentVisiting === 'function') {
          await strut.getCurrentVisiting().catch((e: any) => console.warn('[OrderSummary] GetCurrentVisiting failed', e));
        }
        if (cancelled) return;
        ensureMainLine('order-loaded');
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
          console.warn('[OrderSummary] GetCartItem refresh failed', e);
        }
        if (!cancelled) ensureMainLine('after-cart-item');
      })();

      return () => {
        cancelled = true;
        retryTimers.forEach(clearTimeout);
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

    const bundleLines = bundleProducts
      .filter((p) => selectedBundleKeys.includes(bundleKeyOf(p)))
      .map(bundleCartLine);
    const items = [...(cart.items || []), ...bundleLines];
    const subtotal = items.reduce((sum, it) => sum + lineTotal(it), 0);
    const total = Math.max(0, subtotal - Number(discountAmount || 0));
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

          {/* Product Carousel */}
          {bundleProducts.length > 0 && (
            <div
              style={{
                padding: 'var(--pw-control-padding, 1rem)',
                borderTop: '1px solid var(--pw-color-border, #EFEFEC)',
                minWidth: 0,
                boxSizing: 'border-box',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontFamily: 'var(--pw-font-family-title, inherit)',
                  fontSize: '1.375rem',
                  fontWeight: 700,
                  color: 'var(--pw-color-brand, #161336)',
                }}
              >
                You May Also Like
              </h3>
              <p
                style={{
                  margin: '0.25rem 0 0',
                  fontSize: '1rem',
                  color: 'var(--pw-color-muted, #71717a)',
                }}
              >
                Add to your current order
              </p>
              <div
                role="list"
                style={{
                  display: 'flex',
                  gap: '1rem',
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  padding: '1rem 0.125rem 0.25rem',
                  margin: '0 -0.125rem',
                } as React.CSSProperties}
              >
                {bundleProducts.map((product) => {
                  const key = bundleKeyOf(product);
                  return (
                    <BundleCard
                      key={key}
                      product={product}
                      selected={selectedBundleKeys.includes(key)}
                      onToggle={() => toggleBundle(product)}
                    />
                  );
                })}
              </div>
              {bundleError && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--pw-color-error, #ef4444)',
                  }}
                >
                  {bundleError}
                </div>
              )}
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
