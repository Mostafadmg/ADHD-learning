// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect, useMemo, useRef } from 'react';

/* ============================================================
   ENCLOMIPHENE (Strut Mojo) — PathwAI product selection card
   MOJO COMPACT COPY (21 Oct 2026): copied from "Enclomiphene + Tadalafil".
   Layout only: small thumbnail row, side-by-side supply, Tadalafil switch,
   total and CTA on one row, trust line under the CTA. Pricing, priceIds,
   cart and tracking logic are unchanged from the original.

   Paste into the Enclomiphene PathwAI add-to-cart / product-selection card.
   Requires pathwai-enclomiphene-sdk.js on the flow event.

   UI order (matches PathwAI draft screenshot):
     Strength → Tadalafil Add row → Supply → Trust → Total / CTA

   Staging (checkout.strut-test.com/enclomiphine):
     + Tadalafil   6.25mg   30d=1257 $89   90d=1259 $211
     + Tadalafil   12.5mg   30d=1260 $99   90d=1261 $235
     + Tadalafil   25mg     30d=1262 $129  90d=1263 $306
     Enclomiphene only
       6.25mg     30d=1264 $89   90d=1265 $211
       12.5mg     30d=1266 $99   90d=1267 $235
       25mg       30d=1268 $129  90d=1269 $306
   Production (checkout.struthealth.com/enclomiphine):
     + Tadalafil   6.25mg   30d=887  $79   90d=889  $189
     + Tadalafil   12.5mg   30d=890  $99   90d=891  $237
     + Tadalafil   25mg     30d=892  $119  90d=893  $285
     Enclomiphene only
       6.25mg     30d=894  $79   90d=895  $189
       12.5mg     30d=896  $99   90d=897  $237
       25mg       30d=898  $119  90d=899  $285

   Add to cart → strut.addToCart → validateVisiting → pathwai.flow.next()
============================================================ */

type StrutHost = {
  strut?: {
    ENV?: { api?: string; checkout?: string };
    validateVisiting?: (slug: string, priceId: number) => Promise<unknown>;
    skuId?: (sizeOrKey: string) => number;
    addToCart?: (priceId: number, opts?: Record<string, unknown>) => Promise<unknown>;
  };
  strut_env?: string;
  strut_enclo_price_id?: number;
  pathwai?: {
    flow?: { next?: (val?: unknown) => void };
    cart?: {
      clearCart?: () => void;
      addItem?: (item: Record<string, unknown>) => void;
    };
  };
  pwPushGtm?: (event: string, data?: Record<string, unknown>) => void;
  location?: { href: string };
};

function host(): StrutHost {
  return window as unknown as StrutHost;
}

const ENCLO_SLUG = 'enclomiphine';

const ENCLO_PRICE_IDS = {
  staging: {
    'd1|s1|tad': 1257, 'd1|s2|tad': 1259,
    'd2|s1|tad': 1260, 'd2|s2|tad': 1261,
    'd3|s1|tad': 1262, 'd3|s2|tad': 1263,
    'd1|s1|solo': 1264, 'd1|s2|solo': 1265,
    'd2|s1|solo': 1266, 'd2|s2|solo': 1267,
    'd3|s1|solo': 1268, 'd3|s2|solo': 1269,
  },
  production: {
    'd1|s1|tad': 887, 'd1|s2|tad': 889,
    'd2|s1|tad': 890, 'd2|s2|tad': 891,
    'd3|s1|tad': 892, 'd3|s2|tad': 893,
    'd1|s1|solo': 894, 'd1|s2|solo': 895,
    'd2|s1|solo': 896, 'd2|s2|solo': 897,
    'd3|s1|solo': 898, 'd3|s2|solo': 899,
  },
} as const;

type PriceKey = keyof typeof ENCLO_PRICE_IDS.staging;

function isStagingEnv() {
  if (typeof window === 'undefined') return true;
  const w = host();
  const explicit = String(w.strut_env || '').toLowerCase();
  if (explicit === 'staging') return true;
  if (explicit === 'production' || explicit === 'prod') return false;
  const blob = [
    w.strut?.ENV?.api || '',
    w.strut?.ENV?.checkout || '',
    w.location?.href || '',
  ].join(' ');
  return /strut-test/i.test(blob) || !blob;
}

function priceIdsForEnv() {
  return isStagingEnv() ? ENCLO_PRICE_IDS.staging : ENCLO_PRICE_IDS.production;
}

function resolveSkuKey(doseId: string, supplyId: string, withTadalafil: boolean) {
  const days = supplyId === 's2' ? '90' : '30';
  const variant = withTadalafil ? 'tad' : 'solo';
  return `${doseId}_${days}_${variant}`;
}

function resolvePriceId(doseId: string, supplyId: string, withTadalafil: boolean) {
  const variant = withTadalafil ? 'tad' : 'solo';
  const key = `${doseId}|${supplyId}|${variant}` as PriceKey;
  const fromCatalog = Number(priceIdsForEnv()[key] || 0);
  if (fromCatalog > 0) return fromCatalog;
  try {
    const fromSdk = Number(host().strut?.skuId?.(resolveSkuKey(doseId, supplyId, withTadalafil)) || 0);
    if (fromSdk > 0) return fromSdk;
  } catch { /* ignore */ }
  return fromCatalog;
}

function effMonthlyPrice(price: number, monthsCount: number) {
  const p = Number(price) || 0;
  const m = Number(monthsCount) || 0;
  if (p <= 0 || m <= 0) return 0;
  return Math.round(p / m);
}

function calcSavingsDollars(s1Price: number, s1MonthsCount: number, sPrice: number, sMonthsCount: number) {
  const a = Number(s1Price) || 0;
  const am = Number(s1MonthsCount) || 0;
  const b = Number(sPrice) || 0;
  const bm = Number(sMonthsCount) || 0;
  if (a <= 0 || b <= 0 || am <= 0 || bm <= 0 || bm <= am) return 0;
  return Math.max(0, Math.round((a / am) * bm - b));
}

function calcDiscountPct(s1Price: number, s1MonthsCount: number, sPrice: number, sMonthsCount: number) {
  const savings = calcSavingsDollars(s1Price, s1MonthsCount, sPrice, sMonthsCount);
  const baseline = (Number(s1Price) / Number(s1MonthsCount)) * Number(sMonthsCount);
  if (baseline <= 0 || savings <= 0) return 0;
  return Math.max(0, Math.round((savings / baseline) * 100));
}

function formatSavingsCopy(template: string, amount: number, pct: number) {
  return (template || 'Save {amount} ({pct} off)')
    .replace(/\{amount\}/g, `$${amount}`)
    .replace(/\{pct\}/g, `${pct}%`);
}

function hexToRgba(hex: string, alpha: number) {
  const clean = String(hex || '').replace('#', '');
  if (clean.length !== 6) return `rgba(28, 28, 33, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildSkuLabel(
  supplyLabel: string,
  doseLabel: string,
  withTadalafil: boolean,
  tadalafilDetail: string,
) {
  const supply = supplyLabel.replace(/^(\d+)\s*day\s*supply$/i, '$1 Day Supply');
  const dose = withTadalafil
    ? `${doseLabel} + ${tadalafilDetail}`
    : doseLabel;
  return `${supply} - Enclomiphene ${dose}`;
}

/* ONE price snapshot for the Mojo flow: localStorage strut.mojo.pricing and
   window.__STRUT_MOJO_PRICING__. This screen owns `medication` (priced live by Strut:
   validateVisiting -> getCurrentVisiting -> applyPromoCode -> getCartItem). The lab screens own
   `lab`. Mojo: Cart bar and Mojo: Order summary only read it, so every screen shows the same
   numbers. No prices or code percentages are typed into code. */
const PRICING_KEY = 'strut.mojo.pricing';

function readPricing(): any {
  try {
    const w = window as any;
    if (w.__STRUT_MOJO_PRICING__) return w.__STRUT_MOJO_PRICING__;
    const raw = window.localStorage.getItem(PRICING_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) { return {}; }
}

function writePricing(patch: Record<string, unknown>) {
  try {
    const next = { ...readPricing(), ...patch, updatedAt: Date.now() };
    (window as any).__STRUT_MOJO_PRICING__ = next;
    window.localStorage.setItem(PRICING_KEY, JSON.stringify(next));
  } catch (_) { /* ignore */ }
}

/* Strut's own reason when it rejects a code (e.g. new customers only). */
function promoMessage(err: any): string {
  if (err?.status === 401) return 'Sign in to use a promo code.';
  const body = err?.body;
  if (typeof body === 'string' && body.trim() && body.length < 160) return body.trim();
  return body?.Message || body?.message || "This code can't be used on this order.";
}

/** A code in the link (?coupon=) or a coupon answer on this visit. Not a code left in this browser by an earlier visit. */
function readIncomingCoupon(): string {
  if (typeof window === 'undefined') return '';
  try {
    /* Drop a code saved by an earlier visit. This is what was filling the field with "forvivek". */
    window.localStorage.removeItem('strut.mojo.coupon');
    const w = window as any;
    const params = new URLSearchParams(window.location.search);
    const urlCoupon = params.get('coupon') || params.get('Coupon');
    if (urlCoupon && urlCoupon.trim()) return urlCoupon.trim();

    const answers = w.pathwai?.flow?.getAnswers?.() || {};
    const flowCoupon = answers.coupon || answers.variables?.coupon;
    if (flowCoupon && String(flowCoupon).trim()) return String(flowCoupon).trim();

    /* Same page session only (patient went back to this step). A new visit has neither. */
    const live = w.__STRUT_MOJO_COUPON__;
    if (live && String(live).trim()) return String(live).trim();
  } catch (_) { return ''; }
  return '';
}

function persistMojoCoupon(code: string) {
  try {
    const shown = String(code || '').trim();
    (window as any).__STRUT_MOJO_COUPON__ = shown;
    (window as any).__STRUT_PROMO_CODE__ = shown;
    window.localStorage.removeItem('strut.mojo.coupon');
  } catch (_) { /* ignore */ }
}

function formatMoney(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

/* The per-month sentence under the total. Published in the snapshot, so the cart bar and the
   order summary show the same words. */
function buildPriceLine(listPrice: number, payToday: number, months: number): string {
  const days = months * 30;
  const discounted = payToday < listPrice;
  if (months === 1) {
    return discounted
      ? '$' + formatMoney(payToday) + ' for your first month · then $' + formatMoney(listPrice) + '/mo'
      : '$' + formatMoney(listPrice) + '/mo';
  }
  const perToday = Math.round((payToday / months) * 100) / 100;
  const perRefill = Math.round((listPrice / months) * 100) / 100;
  return discounted
    ? '$' + formatMoney(perToday) + '/mo for your first ' + days + ' days · then $' + formatMoney(listPrice) + ' every ' + days + ' days ($' + formatMoney(perRefill) + '/mo)'
    : '$' + formatMoney(perRefill) + '/mo · billed $' + formatMoney(listPrice) + ' every ' + days + ' days';
}

/* The per-month line in two parts; the second shows on its own line, lighter (Chris, 22 Oct). */
function splitPriceLine(s: string): [string, string] {
  const i = s.indexOf(' · ');
  return i < 0 ? [s, ''] : [s.slice(0, i), s.slice(i + 3)];
}

/* Ask Strut for the real price of one choice: set the product on the order, then apply (or
   clear) the code and read the cart price at the same time. */
async function quoteFromStrut(strut: any, priceId: number, code: string, fallbackPrice: number, clearOldCode: boolean) {
  await strut.validateVisiting(ENCLO_SLUG, priceId);
  await strut.getCurrentVisiting();
  const promo: Promise<any> = code
    ? strut.applyPromoCode(code).then((res: any) => ({ res }), (err: any) => ({ err }))
    : clearOldCode
      ? strut.applyPromoCode('').then(() => null, () => null)
      : Promise.resolve(null);
  const item: Promise<any> = strut.getCartItem().then((r: any) => r, () => null);
  const [p, it] = await Promise.all([promo, item]);
  let discount = 0;
  let codeOk = false;
  let codeMsg = '';
  if (code && p) {
    if (p.err) {
      codeMsg = promoMessage(p.err);
    } else {
      discount = Number(p.res?.OrderDiscount ?? 0) || 0;
      codeOk = p.res?.IsAppliedPromoCode === true || discount > 0;
      if (!codeOk) codeMsg = "This code can't be used on this order.";
    }
  }
  const serverPrice = Number(it?.Price || 0);
  return { price: serverPrice > 0 ? serverPrice : fallbackPrice, discount, codeOk, codeMsg };
}

export default function EnclomiphenePricingCard({
  brandColor = '#1C1C21',
  discColor = '#F1F0E8',
  bottleImageUrl = 'https://placehold.co/440x440/F1F0E8/1C1C21/png?text=Enclomiphene',
  imageFit = 'cover',
  textColor = '#1C1C21',
  textMutedColor = '#71717a',
  borderColor = '#EFEFEC',
  borderSoftColor = '#EFEFEC',
  surfaceColor = '#FBFAF7',
  controlOffColor = '#EFEFEC',
  borderHoverColor = '#8399BF',
  selectedBgColor = '#1C1C21',
  selectedBgOpacity = 0.06,

  titleBase = 'Enclomiphene',
  subtitle = 'Compounded by a US licensed pharmacy',
  supplyLabel = 'Supply',
  doseLabel = 'Strength',

  supply1Label = '30 day supply',
  supply1MonthsCount = 1,
  supply2Label = '90 day supply',
  supply2MonthsCount = 3,
  defaultSupplyIndex = 2,

  dose1Label = '6.25mg',
  dose1Supply1Price = 79,
  dose1Supply2Price = 189,
  dose2Label = '12.5mg',
  dose2Supply1Price = 99,
  dose2Supply2Price = 237,
  dose3Label = '25mg',
  dose3Supply1Price = 119,
  dose3Supply2Price = 285,
  /** Legacy recommended was 12.5mg + Tadalafil */
  defaultDoseIndex = 2,
  recommendedDoseIndex = 2,
  recommendedDoseBadge = '',

  tadalafilSectionLabel = '',
  tadalafilLabel = '',
  tadalafilBenefit = 'Auto-paired to your dose · no extra cost',
  tadalafilIncludedLabel = '',
  tadalafilAddLabel = 'Add',
  tadalafilRemoveLabel = 'Remove',
  tadalafilDose1Detail = 'Tadalafil 2.5mg',
  tadalafilDose2Detail = 'Tadalafil 2.5mg',
  tadalafilDose3Detail = 'Tadalafil 5mg',
  defaultWithTadalafil = true,

  savingsCopyFormat = 'Save {amount} ({pct} off)',
  supply1Note = 'Billed monthly',
  supply2Note = 'Billed every 90 days',
  flexibilityCopy = '',
  doctorReviewCopy = '',
  trustItem1 = 'Doctor consult',
  trustItem2 = 'FDA-registered pharmacy',
  totalLabel = 'Total today',
  ctaLabel = 'Add to cart',
  ctaBgColor = '#161336',
  cardRadius = 22,
  innerRadius = 12,

  onCta = null as null | ((payload: Record<string, unknown>) => void),
  onChange = null as null | ((payload: Record<string, unknown>) => void),
}) {
  const DOSES = useMemo(() => [
    { id: 'd1', label: dose1Label, tadDetail: tadalafilDose1Detail, s1: Number(dose1Supply1Price) || 0, s2: Number(dose1Supply2Price) || 0 },
    { id: 'd2', label: dose2Label, tadDetail: tadalafilDose2Detail, s1: Number(dose2Supply1Price) || 0, s2: Number(dose2Supply2Price) || 0 },
    { id: 'd3', label: dose3Label, tadDetail: tadalafilDose3Detail, s1: Number(dose3Supply1Price) || 0, s2: Number(dose3Supply2Price) || 0 },
  ].filter(d => d.label && (d.s1 > 0 || d.s2 > 0)), [
    dose1Label, dose1Supply1Price, dose1Supply2Price,
    dose2Label, dose2Supply1Price, dose2Supply2Price,
    dose3Label, dose3Supply1Price, dose3Supply2Price,
    tadalafilDose1Detail, tadalafilDose2Detail, tadalafilDose3Detail,
  ]);

  const SUPPLIES = useMemo(() => [
    { id: 's1', label: supply1Label, monthsCount: Number(supply1MonthsCount) || 1 },
    { id: 's2', label: supply2Label, monthsCount: Number(supply2MonthsCount) || 1 },
  ].filter(s => s.label), [supply1Label, supply1MonthsCount, supply2Label, supply2MonthsCount]);

  const [supplyId, setSupplyId] = useState(() => {
    const idx = Math.max(0, Math.min(SUPPLIES.length - 1, (Number(defaultSupplyIndex) || 1) - 1));
    return SUPPLIES[idx]?.id || 's1';
  });

  const [doseId, setDoseId] = useState(() => {
    const idx = Math.max(0, Math.min(DOSES.length - 1, (Number(defaultDoseIndex) || 1) - 1));
    return DOSES[idx]?.id || 'd1';
  });

  const [withTadalafil, setWithTadalafil] = useState(!!defaultWithTadalafil);
  const [isLoading, setIsLoading] = useState(false);
  const [ctaError, setCtaError] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [quote, setQuote] = useState<null | { key: string; price: number; discount: number; codeOk: boolean; codeMsg: string }>(null);
  const [quoting, setQuoting] = useState(false);
  /* Strut price checks run one at a time: overlapping ones can leave the wrong choice or drop
     the code on the order. A request for the choice already being checked joins that check, so
     Add to cart tapped mid-check waits for it instead of starting another. A queued check that a
     newer choice replaced before it started is skipped. */
  const inflight = useRef<null | { key: string; promise: Promise<any> }>(null);
  const strutQueue = useRef<Promise<unknown>>(Promise.resolve());
  const latestKey = useRef('');
  const codeOnOrder = useRef<string>(String(readPricing().medication?.code || ''));
  const adding = useRef(false);
  const runQuote = (strut: any, key: string, pid: number, code: string, fallbackPrice: number): Promise<any> => {
    latestKey.current = key;
    if (inflight.current && inflight.current.key === key) return inflight.current.promise;
    const promise = strutQueue.current.then(async () => {
      if (latestKey.current !== key) throw new Error('superseded');
      const q = await quoteFromStrut(strut, pid, code, fallbackPrice, !code && !!codeOnOrder.current);
      if (code && q.codeOk) codeOnOrder.current = code;
      else if (!code) codeOnOrder.current = '';
      return q;
    });
    const entry = { key, promise };
    inflight.current = entry;
    strutQueue.current = promise.then(() => {}, () => {}).then(() => {
      if (inflight.current === entry) inflight.current = null;
    });
    return promise;
  };

  const applyCode = (raw: string) => {
    const code = String(raw || '').trim().toUpperCase();
    if (!code) return;
    setAppliedCode(code);
    persistMojoCoupon(code);
  };
  const removeCode = () => {
    setAppliedCode('');
    setCodeInput('');
    persistMojoCoupon('');
  };

  useEffect(() => {
    /* A lab choice from an earlier pass (patient went back to change the dose) must not
       count yet: the lab screens after this one record it again. Same for its cart line. */
    try {
      const w = window as any;
      const prev = w.__STRUT_ENCLO_LAB__ || JSON.parse(window.localStorage.getItem('strut.enclo.labSelection') || 'null');
      w.__STRUT_ENCLO_LAB__ = undefined;
      window.localStorage.removeItem('strut.enclo.labSelection');
      const cart = w.pathwai?.cart;
      if (cart && prev && prev.labTestProductId) { try { cart.removeItem(prev.labTestProductId); } catch (_) { /* ignore */ } }
    } catch (_) { /* ignore */ }
    writePricing({ lab: null });

    /* A promo saved in this browser belongs to an earlier visit. Do not treat it as this order's code. */
    try {
      const pricing = readPricing();
      if (pricing && pricing.medication && (pricing.medication.code || pricing.medication.requestedCode)) {
        pricing.medication.code = '';
        pricing.medication.requestedCode = '';
        (window as any).__STRUT_MOJO_PRICING__ = pricing;
        window.localStorage.setItem(PRICING_KEY, JSON.stringify(pricing));
      }
    } catch (_) { /* ignore */ }
    codeOnOrder.current = '';

    /* Auto-fill only a code on this visit's link or answers. */
    let seeded = false;
    const tryApplyCoupon = () => {
      if (seeded) return;
      const incoming = readIncomingCoupon();
      if (!incoming) return;
      seeded = true;
      applyCode(incoming);
    };
    tryApplyCoupon();
    /* PathwAI may hydrate flow variables shortly after first paint. */
    const retry = window.setTimeout(tryApplyCoupon, 300);
    return () => window.clearTimeout(retry);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (DOSES.length && !DOSES.find(d => d.id === doseId)) setDoseId(DOSES[0].id);
  }, [DOSES, doseId]);

  useEffect(() => {
    if (SUPPLIES.length && !SUPPLIES.find(s => s.id === supplyId)) setSupplyId(SUPPLIES[0].id);
  }, [SUPPLIES, supplyId]);

  const selectedDose = DOSES.find(d => d.id === doseId) || DOSES[0];
  const supply = SUPPLIES.find(s => s.id === supplyId) || SUPPLIES[0];
  const supply1 = SUPPLIES.find(s => s.id === 's1');

  const totalNow = selectedDose?.[supplyId as 's1' | 's2'] || 0;
  const monthlyEff = supply ? effMonthlyPrice(totalNow, supply.monthsCount) : 0;
  const priceId = selectedDose ? resolvePriceId(selectedDose.id, supplyId, withTadalafil) : 0;
  const skuKey = selectedDose ? resolveSkuKey(selectedDose.id, supplyId, withTadalafil) : '';
  const skuLabel = selectedDose && supply
    ? buildSkuLabel(supply.label, selectedDose.label, withTadalafil, selectedDose.tadDetail)
    : titleBase;

  const selectedTint = hexToRgba(selectedBgColor, selectedBgOpacity);

  /* Live price from Strut for exactly this selection and code. Waits ~400ms for clicking to
     stop; responses for an older selection are ignored. Without a signed-in Strut session
     (builder canvas) the screen shows the list price and applies the code at checkout. */
  const canQuote = typeof window !== 'undefined'
    && typeof (window as any).strut?.validateVisiting === 'function'
    && typeof (window as any).strut?.getCurrentVisiting === 'function'
    && !!(window as any).strut?.getToken?.();
  const quoteKey = String(priceId) + '|' + appliedCode;
  useEffect(() => {
    if (!priceId || !canQuote) { setQuote(null); setQuoting(false); return; }
    const strut = (window as any).strut;
    let cancelled = false;
    setQuoting(true);
    const timer = setTimeout(async () => {
      if (adding.current) { if (!cancelled) setQuoting(false); return; }
      try {
        const q = await runQuote(strut, quoteKey, priceId, appliedCode, totalNow);
        if (!cancelled && !adding.current) setQuote({ key: quoteKey, ...q });
      } catch (_) {
        if (!cancelled && !adding.current) setQuote(null);
      } finally {
        if (!cancelled) setQuoting(false);
      }
    }, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteKey, canQuote]);

  const live = quote && quote.key === quoteKey ? quote : null;
  const listPrice = live ? live.price : totalNow;
  /* While Strut re-prices a new choice, a code it already accepted keeps showing its discount
     at the rate from Strut's last answer for that code (no "Checking" flash, no full-price
     flash). Strut's exact figure replaces it a few seconds later. */
  const lastForCode = !live && appliedCode && quote && quote.codeOk && quote.price > 0 && quote.key.endsWith('|' + appliedCode) ? quote : null;
  const discount = live
    ? (live.codeOk ? Math.min(live.discount, listPrice) : 0)
    : lastForCode ? Math.round(listPrice * (lastForCode.discount / lastForCode.price) * 100) / 100 : 0;
  const payToday = Math.round((listPrice - discount) * 100) / 100;
  const months = supply?.monthsCount || 1;
  const saved = Math.round((listPrice - payToday) * 100) / 100;
  const priceLine = buildPriceLine(listPrice, payToday, months);

  /* Publish this screen's line for the cart bar and the order summary. */
  useEffect(() => {
    if (!selectedDose || !supply || !priceId) return;
    writePricing({
      medication: {
        name: skuLabel,
        priceId,
        regular: listPrice,
        paid: payToday,
        refill: listPrice,
        months,
        code: discount > 0 ? appliedCode : '',
        requestedCode: appliedCode,
        confirmedByStrut: !!live,
        priceLine,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skuLabel, priceId, listPrice, payToday, months, appliedCode, discount, !!live, priceLine]);

  useEffect(() => {
    if (priceId) {
      try { host().strut_enclo_price_id = priceId; } catch { /* ignore */ }
    }
    if (!onChange || !selectedDose || !supply) return;
    onChange({
      doseId,
      doseLabel: selectedDose.label,
      supplyId,
      supplyLabel: supply.label,
      supplyMonthsCount: supply.monthsCount,
      withTadalafil,
      withAddon: withTadalafil,
      addonLabel: withTadalafil ? selectedDose.tadDetail : '',
      totalPrice: totalNow,
      effectiveMonthly: monthlyEff,
      priceId,
      sku: skuKey,
      productSlug: ENCLO_SLUG,
      env: isStagingEnv() ? 'staging' : 'production',
    });
  }, [doseId, supplyId, withTadalafil, selectedDose, supply, totalNow, monthlyEff, priceId, skuKey, onChange]);

  const handleCta = async () => {
    if (!selectedDose || !supply) return;
    if (!priceId) {
      setCtaError(
        isStagingEnv()
          ? 'Missing Enclomiphene priceId for this selection'
          : 'Production Enclomiphene priceIds are not set yet — update ENCLO_PRICE_IDS.production'
      );
      return;
    }
    setCtaError(null);
    setIsLoading(true);

    const payload = {
      doseId,
      doseLabel: selectedDose.label,
      supplyId,
      supplyLabel: supply.label,
      withTadalafil,
      totalPrice: totalNow,
      priceId,
      sku: skuKey,
      productSlug: ENCLO_SLUG,
    };

    try {
      if (onCta) {
        onCta(payload);
        return;
      }

      const w = host();
      try { w.strut_enclo_price_id = priceId; } catch { /* ignore */ }

      if (typeof w.strut?.addToCart === 'function') {
        await w.strut.addToCart(priceId, { price: totalNow, label: skuLabel });
        return;
      }

      if (typeof w.strut?.validateVisiting !== 'function') {
        throw new Error('Enclomiphene SDK not loaded — paste pathwai-enclomiphene-sdk.js into the flow event');
      }

      /* If Strut already priced exactly this choice, the order is already right: instant.
         If the patient tapped while the price check was still running, price it now, record
         Strut's answer for the cart bar and order summary, then move on. */
      let addPrice = listPrice;
      if (!live) {
        const strutAny = w.strut as any;
        if (typeof strutAny.getCurrentVisiting === 'function') {
          adding.current = true;
          const q = await runQuote(strutAny, quoteKey, priceId, appliedCode, totalNow);
          const d = q.codeOk ? Math.min(q.discount, q.price) : 0;
          const paid = Math.round((q.price - d) * 100) / 100;
          addPrice = q.price;
          setQuote({ key: quoteKey, ...q });
          writePricing({
            medication: {
              name: skuLabel,
              priceId,
              regular: q.price,
              paid,
              refill: q.price,
              months,
              code: d > 0 ? appliedCode : '',
              requestedCode: appliedCode,
              confirmedByStrut: true,
              priceLine: buildPriceLine(q.price, paid, months),
            },
          });
        } else {
          await w.strut.validateVisiting(ENCLO_SLUG, priceId);
        }
      }

      const cartApi = w.pathwai?.cart;
      if (cartApi?.clearCart && cartApi?.addItem) {
        cartApi.clearCart();
        cartApi.addItem({
          id: String(priceId),
          name: skuLabel,
          price: addPrice,
          quantity: 1,
          variants: [
            { name: 'Dose', value: selectedDose.label },
            { name: 'Supply', value: supply.label },
            ...(withTadalafil ? [{ name: 'Addon', value: selectedDose.tadDetail }] : []),
          ],
        });
      }

      try {
        w.pwPushGtm?.('Added to Cart', {
          product_name: 'Strut Mojo (Enclomiphene)',
          price_id: priceId,
          sku: skuKey,
          price: totalNow,
          with_tadalafil: withTadalafil,
        });
      } catch { /* ignore */ }

      w.pathwai?.flow?.next?.();
    } catch (e) {
      adding.current = false;
      console.error('[enclomiphene] Add to cart error:', e);
      setCtaError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!DOSES.length || !SUPPLIES.length) {
    return (
      <div style={{
        padding: 24,
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#71717a',
        fontSize: 14,
        textAlign: 'center',
        border: '1px dashed #EFEFEC',
        borderRadius: 22,
      }}>
        Configure at least one dose and one supply option.
      </div>
    );
  }

  const cssVars = {
    ['--pcg-brand' as string]: brandColor,
    ['--pcg-disc' as string]: discColor,
    ['--pcg-text' as string]: textColor,
    ['--pcg-text-muted' as string]: textMutedColor,
    ['--pcg-border' as string]: borderColor,
    ['--pcg-border-soft' as string]: borderSoftColor,
    ['--pcg-border-hover' as string]: borderHoverColor,
    ['--pcg-surface' as string]: surfaceColor,
    ['--pcg-control-off' as string]: controlOffColor,
    ['--pcg-selected-bg' as string]: selectedTint,
    ['--pcg-cta-bg' as string]: ctaBgColor,
    ['--pcg-card-radius' as string]: `${cardRadius}px`,
    ['--pcg-inner-radius' as string]: `${innerRadius}px`,
  } as React.CSSProperties;

  const checkoutBlock = (mobile: boolean) => (
    <div className="pcg-checkout">
      <div className="pcg-checkout-row">
        <div className="pcg-checkout-top">
          <span className="pcg-checkout-label">{totalLabel}</span>
          <span className="pcg-checkout-price">
            {discount > 0 ? <span className="pcg-was">${formatMoney(listPrice)}</span> : null}
            ${formatMoney(payToday)}
          </span>
        </div>
        <button
          type="button"
          className="pcg-cta"
          data-strut-enclomiphene-cta=""
          onClick={handleCta}
          disabled={isLoading || !priceId}
        >
          <span>{isLoading ? 'Adding…' : ctaLabel}</span>
          {!isLoading && <span className="pcg-cta-arrow" aria-hidden="true">→</span>}
        </button>
      </div>
      <div className="pcg-permonth">
        {splitPriceLine(priceLine)[0]}
        {splitPriceLine(priceLine)[1] ? <span className="pcg-permonth-2">{splitPriceLine(priceLine)[1]}</span> : null}
      </div>
      <div className="pcg-after-cta">
          <div className="pcg-code">
            {appliedCode ? (
              <div className={'pcg-code-applied' + (live && !live.codeOk ? ' pcg-code-applied--bad' : '')}>
                <span>
                  <strong>{appliedCode}</strong>
                  {' · '}
                  {live
                    ? (live.codeOk ? '$' + formatMoney(discount) + ' off this order' : live.codeMsg || "This code can't be used on this order.")
                    : !canQuote
                      ? 'Applied at checkout'
                      : lastForCode
                        ? '$' + formatMoney(discount) + ' off this order'
                        : quoting || isLoading
                          ? 'Checking…'
                          : "This code can't be used on this order."}
                </span>
                <button type="button" className="pcg-code-remove" onClick={removeCode}>Remove</button>
              </div>
            ) : (
              <div className="pcg-code-row">
                <input
                  className="pcg-code-input"
                  value={codeInput}
                  placeholder="Promo code"
                  onChange={(e) => setCodeInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') applyCode(codeInput); }}
                />
                <button
                  type="button"
                  className="pcg-code-apply"
                  onClick={() => applyCode(codeInput)}
                  disabled={!codeInput.trim()}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {saved > 0 && (
            <div className="pcg-savings">
              <div className="pcg-savings-row">
                <span className="pcg-savings-headline">
                  You're saving <span className="pcg-savings-amount">${formatMoney(saved)}</span>
                </span>
              </div>
              <div className="pcg-savings-detail">
                {'$' + formatMoney(listPrice) + ' regular price, $' + formatMoney(payToday) + ' today with code ' + appliedCode}
              </div>
            </div>
          )}
      </div>
      {(trustItem1 || trustItem2) && (
        <div className="pcg-trust">
          {trustItem1 && <span>✓ {trustItem1}</span>}
          {trustItem2 && <span>✓ {trustItem2}</span>}
        </div>
      )}
      {ctaError && mobile && <div className="pcg-error">{ctaError}</div>}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .pcg-root, .pcg-root * { box-sizing: border-box; }
        .pcg-root {
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--pcg-text);
          background: transparent;
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          padding: 16px 16px 220px 16px;
          display: flex;
          flex-direction: column;
        }
        .pcg-body { display: flex; flex-direction: column; flex: 1; }
        .pcg-card {
          background: #fff;
          border-radius: var(--pcg-card-radius);
          padding: 28px 20px 24px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pcg-hero { display: flex; justify-content: center; margin-bottom: 20px; }
        .pcg-disc {
          width: 200px; height: 200px; max-width: 100%;
          border-radius: 999px; background: var(--pcg-disc);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
        }
        .pcg-disc img {
          width: var(--pcg-img-size, 100%);
          height: var(--pcg-img-size, 100%);
          object-fit: var(--pcg-img-fit, cover);
        }
        .pcg-title-wrap { text-align: center; }
        .pcg-title {
          font-family: 'Figtree', sans-serif;
          font-weight: 500; font-size: 18px; line-height: 1.2;
          letter-spacing: -0.01em; margin: 0 0 6px 0;
          color: var(--pcg-text); overflow-wrap: anywhere;
        }
        .pcg-subtitle {
          font-size: 13px; color: var(--pcg-text-muted);
          font-weight: 400; line-height: 1.4;
        }
        .pcg-label-row {
          font-family: 'Figtree', sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.04em; line-height: 1.33;
          text-transform: uppercase; color: var(--pcg-text);
          margin-bottom: 10px;
        }
        .pcg-section + .pcg-section { margin-top: 4px; }
        .pcg-section { margin-bottom: 4px; }
        .pcg-supply-list {
          display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;
        }
        .pcg-supply {
          padding: 14px 16px;
          border-radius: var(--pcg-inner-radius);
          border: 1.5px solid var(--pcg-border);
          background: #fff; color: var(--pcg-text);
          font-family: 'Inter', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; text-align: left; width: 100%;
          transition: border-color 0.15s ease, background 0.15s ease;
          min-height: 60px;
        }
        .pcg-supply:hover { border-color: var(--pcg-border-hover); }
        .pcg-supply.is-selected {
          border-color: var(--pcg-brand); background: var(--pcg-selected-bg);
        }
        .pcg-supply:disabled { opacity: 0.55; cursor: wait; }
        .pcg-supply-left {
          display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;
        }
        .pcg-tad-card {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          width: 100%; padding: 14px 14px; margin: 0 0 20px 0;
          border-radius: 10px;
          border: 1.5px dashed #D8D8D4;
          background: #fff; color: var(--pcg-text);
          font-family: 'Inter', sans-serif; cursor: pointer;
          text-align: left;
          transition: border-color 0.15s ease;
        }
        .pcg-tad-card:hover { border-color: #C4C4C0; }
        .pcg-tad-card.is-checked { border-color: #D8D8D4; background: #fff; }
        .pcg-tad-card:disabled { opacity: 0.55; cursor: wait; }
        .pcg-tad-body {
          display: flex; flex-direction: column; gap: 3px;
          min-width: 0; flex: 1;
        }
        .pcg-tad-label {
          font-weight: 600; font-size: 14px; line-height: 1.25;
          color: var(--pcg-text);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pcg-tad-benefit {
          font-size: 12px; color: var(--pcg-text-muted);
          font-weight: 400; line-height: 1.35;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pcg-tad-action {
          flex-shrink: 0;
          width: 40px; height: 40px; padding: 0;
          border-radius: 8px;
          border: 1.5px solid var(--pcg-brand);
          background: #fff; color: var(--pcg-brand);
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
          display: inline-flex; align-items: center; justify-content: center;
          line-height: 1;
        }
        .pcg-tad-card.is-checked .pcg-tad-action {
          text-decoration: none;
          background: #fff;
          border-color: var(--pcg-brand);
          color: #000;
          font-size: 0;
          padding: 0;
        }
        .pcg-tad-card.is-checked:hover .pcg-tad-action {
          background: #fff;
          border-color: #000;
        }
        .pcg-tad-x {
          width: 18px;
          height: 18px;
          display: block;
        }
        .pcg-radio, .pcg-check {
          width: 18px; height: 18px; flex-shrink: 0;
          border: 1.5px solid var(--pcg-control-off); background: #fff;
          display: flex; align-items: center; justify-content: center;
        }
        .pcg-radio { border-radius: 999px; }
        .pcg-check { border-radius: 4px; transition: border-color 0.15s ease, background 0.15s ease; }
        .pcg-supply.is-selected .pcg-radio {
          border-color: var(--pcg-brand); background: var(--pcg-brand);
        }
        .pcg-radio-dot {
          width: 6px; height: 6px; border-radius: 999px; background: #fff;
        }
        .pcg-check-mark {
          color: #fff; font-size: 12px; font-weight: 700; line-height: 1;
        }
        .pcg-supply-text { display: flex; flex-direction: column; min-width: 0; }
        .pcg-supply-primary { font-weight: 500; font-size: 14px; }
        .pcg-supply-sub {
          font-size: 12px; color: var(--pcg-brand); font-weight: 500; margin-top: 2px;
        }
        .pcg-supply-price { font-family: 'Figtree', sans-serif; font-weight: 500; font-size: 18px; flex-shrink: 0; }
        .pcg-dose-grid {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 16px;
        }
        .pcg-dose {
          padding: 10px 8px; border-radius: var(--pcg-inner-radius);
          border: 1.5px solid var(--pcg-border); background: #fff;
          color: var(--pcg-text); font-family: 'Inter', sans-serif;
          cursor: pointer; font-weight: 500; font-size: 14px;
          min-height: 44px; display: flex; align-items: center;
          justify-content: center; text-align: center;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pcg-dose:hover { border-color: var(--pcg-border-hover); }
        .pcg-dose.is-selected { border-color: var(--pcg-brand); background: var(--pcg-selected-bg); }
        .pcg-dose:disabled { opacity: 0.55; cursor: wait; }
        .pcg-dose-badge {
          display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.02em;
          color: var(--pcg-text-muted); line-height: 1.2; margin-top: 2px;
        }
        .pcg-dose.is-selected .pcg-dose-badge { color: var(--pcg-brand); }
        .pcg-reassure {
          display: flex; flex-direction: column; gap: 8px;
          margin: 4px 0 16px 0; padding: 14px 16px;
          border-radius: var(--pcg-inner-radius);
          background: var(--pcg-surface);
          border: 1px solid var(--pcg-border-soft);
        }
        .pcg-reassure-item {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 12.5px; line-height: 1.4; color: var(--pcg-text);
          font-weight: 500;
        }
        .pcg-reassure-icon {
          flex-shrink: 0; width: 18px; height: 18px; margin-top: 1px;
          border-radius: 999px; background: var(--pcg-selected-bg);
          color: var(--pcg-brand); font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .pcg-reassure-muted { color: var(--pcg-text-muted); font-weight: 400; }
        .pcg-trust {
          display: flex; flex-wrap: nowrap; align-items: center;
          gap: 12px; white-space: nowrap;
          font-size: 12px; color: var(--pcg-text-muted);
          margin-top: auto; padding-top: 4px; font-weight: 500;
          overflow-x: auto;
        }
        .pcg-trust span { flex-shrink: 0; }
        .pcg-error {
          margin-top: 10px; font-size: 12.5px; color: #b42318;
          font-weight: 500; line-height: 1.4;
        }
        .pcg-checkout {
          padding: 14px 16px 28px 16px;
          border-top: 1px solid var(--pcg-border-soft); background: #fff;
        }
        .pcg-checkout-top {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 10px; margin-bottom: 12px; flex-wrap: wrap;
        }
        .pcg-checkout-label {
          font-family: 'Figtree', sans-serif; font-size: 12px;
          color: var(--pcg-text-muted); letter-spacing: 0.04em;
          text-transform: uppercase; font-weight: 700;
        }
        .pcg-checkout-price {
          font-family: 'Figtree', sans-serif; font-weight: 500;
          font-size: 22px; letter-spacing: -0.01em;
        }
        .pcg-checkout-permo {
          font-size: 13px; color: var(--pcg-text-muted);
          font-weight: 400; margin-left: 6px;
        }
        .pcg-cta {
          display: inline-flex; align-items: center; justify-content: center;
          width: 100%; height: 44px; gap: 8px;
          border: none; background: var(--pcg-cta-bg); color: #fff;
          border-radius: 10px; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 500; cursor: pointer;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .pcg-cta:hover { opacity: 0.85; }
        .pcg-cta:active { transform: scale(0.97); }
        .pcg-cta:disabled { opacity: 0.55; cursor: wait; }
        .pcg-checkout-wrap-mobile {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 50;
          padding-bottom: env(safe-area-inset-bottom); background: #fff;
        }
        .pcg-checkout-wrap-mobile .pcg-checkout-inner { max-width: 460px; margin: 0 auto; }
        .pcg-checkout-wrap-inline { display: none; }
        @media (min-width: 600px) {
          .pcg-root { max-width: 480px; padding: 24px 16px 28px 16px; }
          .pcg-checkout-wrap-mobile { display: none; }
          .pcg-checkout-wrap-inline { display: block; }
        }
        @media (max-width: 380px) {
          .pcg-dose-grid { grid-template-columns: 1fr; }
        }

        /* ---- Mojo compact layer: fits a phone screen without scrolling ---- */
        .pcg-root { padding: 4px 0 240px 0; }
        .pcg-card {
          flex-direction: row; align-items: center; gap: 12px;
          padding: 0; margin-bottom: 14px; background: transparent;
        }
        .pcg-hero { margin: 0; }
        .pcg-disc { width: 56px; height: 56px; }
        .pcg-title-wrap { text-align: left; }
        .pcg-title { font-size: 17px; margin: 0 0 2px 0; }
        .pcg-subtitle { font-size: 12px; }
        .pcg-label-row { font-size: 11px; margin-bottom: 6px; }
        .pcg-dose-grid { margin-bottom: 10px; gap: 6px; }
        .pcg-dose { min-height: 40px; padding: 8px 6px; }
        .pcg-tad-card {
          padding: 10px 12px; margin: 0 0 14px 0;
          border-style: solid; border-color: var(--pcg-border);
          border-radius: var(--pcg-inner-radius);
        }
        .pcg-tad-card.is-checked, .pcg-tad-card:hover { border-color: var(--pcg-border); }
        .pcg-switch {
          flex-shrink: 0; position: relative;
          width: 40px; height: 24px; border-radius: 999px;
          background: var(--pcg-control-off);
          transition: background 0.15s ease;
        }
        .pcg-switch-knob {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 999px;
          background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          transition: transform 0.15s ease;
        }
        .pcg-tad-card.is-checked .pcg-switch { background: var(--pcg-brand); }
        .pcg-tad-card.is-checked .pcg-switch-knob { transform: translateX(16px); }
        .pcg-supply-list {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 4px;
        }
        .pcg-supply {
          flex-direction: column; align-items: flex-start; justify-content: flex-start;
          gap: 6px; padding: 10px 12px; min-height: 0;
        }
        .pcg-supply-left { gap: 8px; align-items: flex-start; }
        .pcg-radio { margin-top: 1px; }
        .pcg-supply-primary { font-size: 13.5px; }
        .pcg-supply-sub { font-size: 11.5px; }
        .pcg-supply-sub--muted { color: var(--pcg-text-muted); }
        .pcg-supply-price { font-size: 17px; padding-left: 26px; }
        .pcg-checkout { padding: 10px 16px 14px 16px; }
        .pcg-checkout-row { display: flex; align-items: center; gap: 12px; }
        .pcg-checkout-top {
          display: flex; flex-direction: column; align-items: flex-start;
          gap: 0; margin: 0; flex-wrap: nowrap; flex-shrink: 0;
        }
        .pcg-checkout-label { font-size: 10.5px; }
        .pcg-checkout-price { font-size: 20px; line-height: 1.15; white-space: nowrap; }
        .pcg-checkout-permo { font-size: 12px; margin-left: 4px; }
        .pcg-cta { flex: 1; width: auto; height: 46px; }
        .pcg-trust {
          justify-content: center; font-size: 11px;
          margin-top: 8px; padding-top: 0; gap: 10px;
        }
        .pcg-code { margin: 12px 0 2px; }
        .pcg-permonth { margin-top: 6px; font-size: 12px; color: var(--pcg-text-muted); line-height: 1.4; }
        .pcg-permonth-2 { display: block; opacity: 0.7; }
        .pcg-code-applied--bad { background: #FEF2F2; color: #7F1D1D; }
        .pcg-after-cta { margin-top: 10px; }
        .pcg-after-cta .pcg-code { margin: 0; }
        .pcg-savings {
          margin: 8px 0 0; padding: 10px 12px; border-radius: var(--pcg-inner-radius);
          border: 1px solid #BBF7D0; background: #F0FDF4;
        }
        .pcg-savings-row { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
        .pcg-savings-label {
          font-family: 'Figtree', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: 0.04em; text-transform: uppercase; color: #166534;
        }
        .pcg-savings-headline { font-family: 'Figtree', sans-serif; font-weight: 600; font-size: 15px; color: #166534; }
        .pcg-savings-amount { font-family: 'Figtree', sans-serif; font-weight: 700; font-size: 17px; color: #15803D; }
        .pcg-savings-detail { margin-top: 2px; font-size: 12px; color: #166534; opacity: 0.85; }
        .pcg-code-row { display: flex; gap: 8px; }
        .pcg-code-input {
          flex: 1; min-width: 0; height: 40px; padding: 0 12px;
          border: 1.5px solid var(--pcg-border); border-radius: var(--pcg-inner-radius);
          font-family: 'Inter', sans-serif; font-size: 14px; color: var(--pcg-text);
          background: #fff; text-transform: uppercase;
        }
        .pcg-code-apply {
          height: 40px; padding: 0 16px; border-radius: var(--pcg-inner-radius);
          border: 1.5px solid var(--pcg-brand); background: #fff; color: var(--pcg-brand);
          font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer;
        }
        .pcg-code-apply:disabled { opacity: 0.45; cursor: default; }
        .pcg-code-applied {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          padding: 9px 12px; border-radius: var(--pcg-inner-radius);
          background: var(--pcg-selected-bg); font-size: 13px; color: var(--pcg-text);
        }
        .pcg-code-remove {
          border: none; background: none; padding: 0; cursor: pointer;
          color: var(--pcg-text-muted); font-size: 12px; text-decoration: underline;
        }
        .pcg-was {
          text-decoration: line-through; color: var(--pcg-text-muted);
          font-size: 15px; font-weight: 400; margin-right: 6px;
        }
        @media (min-width: 600px) {
          .pcg-root { padding: 8px 0; }
          .pcg-checkout { padding: 12px 0 4px 0; }
        }
        @media (max-width: 380px) {
          .pcg-dose-grid { grid-template-columns: 1fr 1fr 1fr; }
        }
      `}</style>

      <div
        className="pcg-root"
        data-strut-enclomiphene-card=""
        style={cssVars}
      >
        <div className="pcg-body">
          <div className="pcg-card">
            <div className="pcg-hero">
              <div
                className="pcg-disc"
                style={{
                  ['--pcg-img-fit' as string]: imageFit,
                  ['--pcg-img-size' as string]: imageFit === 'cover' ? '100%' : '78%',
                }}
              >
                {bottleImageUrl && (
                  <img
                    src={bottleImageUrl}
                    alt={titleBase}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            </div>
            <div className="pcg-title-wrap">
              <h1 className="pcg-title">{titleBase}</h1>
              {subtitle && <div className="pcg-subtitle">{subtitle}</div>}
            </div>
          </div>

          <div className="pcg-section">
            <div className="pcg-label-row">{doseLabel}</div>
            <div className="pcg-dose-grid">
              {DOSES.map((d, i) => {
                const isSel = doseId === d.id;
                const isRecommended = recommendedDoseBadge
                  && i === Math.max(0, (Number(recommendedDoseIndex) || 2) - 1);
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`pcg-dose ${isSel ? 'is-selected' : ''}`}
                    onClick={() => setDoseId(d.id)}
                    aria-pressed={isSel}
                    disabled={isLoading}
                  >
                    <span>{d.label}</span>
                    {isRecommended && (
                      <span className="pcg-dose-badge">{recommendedDoseBadge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pcg-section">
            {tadalafilSectionLabel && (
              <div className="pcg-label-row">{tadalafilSectionLabel}</div>
            )}
            <button
              type="button"
              className={`pcg-tad-card ${withTadalafil ? 'is-checked' : ''}`}
              onClick={() => setWithTadalafil(v => !v)}
              aria-pressed={withTadalafil}
              aria-label={withTadalafil ? (tadalafilRemoveLabel || 'Remove') : (tadalafilAddLabel || 'Add')}
              disabled={isLoading}
            >
              <span className="pcg-tad-body">
                <span className="pcg-tad-label">
                  {tadalafilLabel || selectedDose?.tadDetail || 'Tadalafil'}
                </span>
                {tadalafilBenefit && (
                  <span className="pcg-tad-benefit">{tadalafilBenefit}</span>
                )}
              </span>
              <span className="pcg-switch" aria-hidden="true">
                <span className="pcg-switch-knob" />
              </span>
            </button>
          </div>

          <div className="pcg-section">
            <div className="pcg-label-row">{supplyLabel}</div>
            <div className="pcg-supply-list">
              {SUPPLIES.map(s => {
                const isSel = supplyId === s.id;
                const price = selectedDose[s.id as 's1' | 's2'] || 0;
                const note = s.id === 's1' ? supply1Note : supply2Note;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`pcg-supply ${isSel ? 'is-selected' : ''}`}
                    onClick={() => setSupplyId(s.id)}
                    aria-pressed={isSel}
                    disabled={isLoading}
                  >
                    <div className="pcg-supply-left">
                      <div className="pcg-radio">
                        {isSel && <div className="pcg-radio-dot" />}
                      </div>
                      <div className="pcg-supply-text">
                        <div className="pcg-supply-primary">{s.label}</div>
                        {note ? (
                          <div className="pcg-supply-sub pcg-supply-sub--muted">{note}</div>
                        ) : null}
                      </div>
                    </div>
                    <span className="pcg-supply-price">${price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {(flexibilityCopy || doctorReviewCopy) && (
            <div className="pcg-reassure" role="note">
              {flexibilityCopy && (
                <div className="pcg-reassure-item">
                  <span className="pcg-reassure-icon" aria-hidden="true">✓</span>
                  <span>{flexibilityCopy}</span>
                </div>
              )}
              {doctorReviewCopy && (
                <div className="pcg-reassure-item">
                  <span className="pcg-reassure-icon" aria-hidden="true">✓</span>
                  <span className="pcg-reassure-muted">{doctorReviewCopy}</span>
                </div>
              )}
            </div>
          )}

          {ctaError && <div className="pcg-error">{ctaError}</div>}
        </div>

        <div className="pcg-checkout-wrap-inline">{checkoutBlock(false)}</div>
      </div>

      {/* The phone bar sits outside .pcg-root, so it needs the same color variables, or the
          Add to cart button renders with no background (white on white). */}
      <div
        className="pcg-checkout-wrap-mobile"
        style={{ ...cssVars, fontFamily: "'Inter', system-ui, sans-serif", color: 'var(--pcg-text)' }}
      >
        <div className="pcg-checkout-inner">{checkoutBlock(true)}</div>
      </div>
    </>
  );
}

export const propSchema = {
  brandColor: { type: 'color', title: 'Brand Color', defaultValue: '#1C1C21' },
  discColor: { type: 'color', title: 'Hero Disc Background', defaultValue: '#F1F0E8' },
  bottleImageUrl: {
    type: 'string',
    title: 'Bottle Image URL',
    defaultValue: 'https://placehold.co/440x440/F1F0E8/1C1C21/png?text=Enclomiphene',
  },
  imageFit: { type: 'enum', title: 'Image Fit', defaultValue: 'cover', options: ['cover', 'contain'] },
  textColor: { type: 'color', title: 'Text Color', defaultValue: '#1C1C21' },
  textMutedColor: { type: 'color', title: 'Text Color (Muted)', defaultValue: '#71717a' },
  borderColor: { type: 'color', title: 'Border Color (Default)', defaultValue: '#EFEFEC' },
  borderSoftColor: { type: 'color', title: 'Border Color (Soft)', defaultValue: '#EFEFEC' },
  surfaceColor: { type: 'color', title: 'Surface Color', defaultValue: '#FBFAF7' },
  controlOffColor: { type: 'color', title: 'Control Color (off)', defaultValue: '#EFEFEC' },
  borderHoverColor: { type: 'color', title: 'Border Color (Hover)', defaultValue: '#8399BF' },
  selectedBgColor: { type: 'color', title: 'Selected Background Tint', defaultValue: '#1C1C21' },
  selectedBgOpacity: { type: 'number', title: 'Selected Background Opacity', defaultValue: 0.06, min: 0, max: 1, step: 0.01 },

  titleBase: { type: 'string', title: 'Product Title', defaultValue: 'Enclomiphene' },
  subtitle: { type: 'string', title: 'Subtitle', defaultValue: 'Compounded by a US licensed pharmacy' },
  supplyLabel: { type: 'string', title: 'Supply Section Label', defaultValue: 'Supply' },
  doseLabel: { type: 'string', title: 'Dose Section Label', defaultValue: 'Strength' },

  supply1Label: { type: 'string', title: 'Supply 1 Label', defaultValue: '30 day supply' },
  supply1MonthsCount: { type: 'number', title: 'Supply 1 Months', defaultValue: 1, min: 1, step: 1 },
  supply2Label: { type: 'string', title: 'Supply 2 Label', defaultValue: '90 day supply' },
  supply2MonthsCount: { type: 'number', title: 'Supply 2 Months', defaultValue: 3, min: 1, step: 1 },
  defaultSupplyIndex: { type: 'number', title: 'Default Supply (1–2)', defaultValue: 2, min: 1, max: 2, step: 1 },

  dose1Label: { type: 'string', title: 'Dose 1 Label', defaultValue: '6.25mg' },
  dose1Supply1Price: { type: 'number', title: 'Dose 1 — 30 day Price ($)', defaultValue: 79, min: 0, step: 1 },
  dose1Supply2Price: { type: 'number', title: 'Dose 1 — 90 day Price ($)', defaultValue: 189, min: 0, step: 1 },
  dose2Label: { type: 'string', title: 'Dose 2 Label', defaultValue: '12.5mg' },
  dose2Supply1Price: { type: 'number', title: 'Dose 2 — 30 day Price ($)', defaultValue: 99, min: 0, step: 1 },
  dose2Supply2Price: { type: 'number', title: 'Dose 2 — 90 day Price ($)', defaultValue: 237, min: 0, step: 1 },
  dose3Label: { type: 'string', title: 'Dose 3 Label', defaultValue: '25mg' },
  dose3Supply1Price: { type: 'number', title: 'Dose 3 — 30 day Price ($)', defaultValue: 119, min: 0, step: 1 },
  dose3Supply2Price: { type: 'number', title: 'Dose 3 — 90 day Price ($)', defaultValue: 285, min: 0, step: 1 },
  defaultDoseIndex: { type: 'number', title: 'Default Dose (1–3)', defaultValue: 2, min: 1, max: 3, step: 1 },
  recommendedDoseIndex: { type: 'number', title: 'Recommended Dose Badge Index (1–3)', defaultValue: 2, min: 1, max: 3, step: 1 },
  recommendedDoseBadge: { type: 'string', title: 'Recommended Dose Badge', defaultValue: '' },

  tadalafilSectionLabel: { type: 'string', title: 'Tadalafil Section Label', defaultValue: '' },
  tadalafilLabel: { type: 'string', title: 'Tadalafil Override Label (blank = dose-paired)', defaultValue: '' },
  tadalafilBenefit: { type: 'string', title: 'Tadalafil Benefit Line', defaultValue: 'Auto-paired to your dose · no extra cost' },
  tadalafilIncludedLabel: { type: 'string', title: 'Tadalafil Price Badge (unused)', defaultValue: '' },
  tadalafilAddLabel: { type: 'string', title: 'Tadalafil Add Button', defaultValue: 'Add' },
  tadalafilRemoveLabel: { type: 'string', title: 'Tadalafil Remove Button', defaultValue: 'Remove' },
  tadalafilDose1Detail: { type: 'string', title: 'Tadalafil detail (6.25mg dose)', defaultValue: 'Tadalafil 2.5mg' },
  tadalafilDose2Detail: { type: 'string', title: 'Tadalafil detail (12.5mg dose)', defaultValue: 'Tadalafil 2.5mg' },
  tadalafilDose3Detail: { type: 'string', title: 'Tadalafil detail (25mg dose)', defaultValue: 'Tadalafil 5mg' },
  defaultWithTadalafil: { type: 'boolean', title: 'Tadalafil Checked by Default', defaultValue: true },

  savingsCopyFormat: { type: 'string', title: 'Savings Copy', defaultValue: 'Save {amount} ({pct} off)' },
  supply1Note: { type: 'string', title: 'Supply 1 note (under the label)', defaultValue: 'Billed monthly' },
  supply2Note: { type: 'string', title: 'Supply 2 note (under the label)', defaultValue: 'Billed every 90 days' },
  flexibilityCopy: { type: 'string', title: 'Cancel / Flexibility Copy', defaultValue: '' },
  doctorReviewCopy: { type: 'string', title: 'Doctor Review Copy', defaultValue: '' },
  trustItem1: { type: 'string', title: 'Trust Item 1', defaultValue: 'Doctor consult' },
  trustItem2: { type: 'string', title: 'Trust Item 2', defaultValue: 'FDA-registered pharmacy' },
  totalLabel: { type: 'string', title: 'Total Label', defaultValue: 'Total today' },
  ctaLabel: { type: 'string', title: 'CTA Label', defaultValue: 'Add to cart' },
  ctaBgColor: { type: 'color', title: 'CTA Button Color', defaultValue: '#161336' },
  cardRadius: { type: 'number', title: 'Card Border Radius', defaultValue: 22, min: 0, max: 32, step: 1 },
  innerRadius: { type: 'number', title: 'Inner Element Radius', defaultValue: 12, min: 0, max: 24, step: 1 },
};

export const outputSchema = {
  type: 'object',
  fields: {
    doseId: 'string',
    doseLabel: 'string',
    supplyId: 'string',
    supplyLabel: 'string',
    supplyMonthsCount: 'number',
    withTadalafil: 'boolean',
    withAddon: 'boolean',
    addonLabel: 'string',
    totalPrice: 'number',
    effectiveMonthly: 'number',
    priceId: 'number',
    sku: 'string',
    productSlug: 'string',
    env: 'string',
  },
};

export { effMonthlyPrice, calcSavingsDollars, calcDiscountPct, formatSavingsCopy };
