// @ts-ignore
import React, { useState } from 'react';

/* ============================================================
   Mojo: Longevity upgrade (21 Oct 2026)
   ------------------------------------------------------------
   One-tap upsell shown right after "Mojo: Free hormone panel".
   Yes: swaps the free hormone panel for the Comprehensive
   Longevity Panel at the offer price, and records it the same way
   the lab selector records Option C (window.__STRUT_ENCLO_LAB__ +
   localStorage strut.enclo.labSelection) so FinishOrderV2 orders it.
   No: keeps the free hormone panel (Option B) and moves on.

   Prices shown must be real prices: the crossed-out price is
   today's regular price ($189), not a made-up "was" price.
   OPEN (Vivek): confirm Strut honors labPanelPrice 99 for panel 2255.
   Scoped CSS prefix: mlu-
============================================================ */

const ENCLO_LAB_PANELS = [
  { key: 'B|default', staging: 580, prod: 2254 },
  { key: 'C|default', staging: 2219, prod: 2255 },
];

const isStagingEnv = () => {
  if (typeof window === 'undefined') return false;
  const w = window as any;
  const explicit = String(w.strut_env || '').toLowerCase();
  if (explicit === 'staging') return true;
  if (explicit === 'production' || explicit === 'prod') return false;
  const blob = [w.strut?.ENV?.api || '', w.strut?.ENV?.checkout || '', w.location?.href || ''].join(' ');
  return /strut-test/i.test(blob);
};

const labPanelIdFor = (option: 'B' | 'C') => {
  const row = ENCLO_LAB_PANELS.find((r) => r.key === `${option}|default`);
  return row ? (isStagingEnv() ? row.staging : row.prod) : 0;
};

const persistLabSelection = (payload: Record<string, unknown>) => {
  try {
    const w = window as any;
    w.__STRUT_ENCLO_LAB__ = payload;
    w.localStorage.setItem('strut.enclo.labSelection', JSON.stringify(payload));
  } catch (_) { /* ignore */ }
};

/* Shared Mojo price snapshot (strut.mojo.pricing): on Yes this screen replaces `lab` with the
   upgrade, priced from this block's own settings. The cart bar and order summary read it. */
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

export default function MojoLongevityUpgrade({
  panelName = 'Comprehensive Longevity Panel',
  regularPrice = 189,
  offerPrice = 99,
  savingsLabel = 'Save $90',
  blurb = '55+ biomarkers in one draw: hormones, metabolic, thyroid, heart (lipids, ApoB), inflammation and blood sugar.',
  yesLabel = 'Yes, upgrade for $99',
  noLabel = 'No thanks',
  freePanelName = "Men's Hormone Panel",
  freePanelProductId = '',
  productId = '',
  brandColor = '#161336',
  textColor = '#1C1C21',
  mutedColor = '#71717a',
  borderColor = '#EFEFEC',
  onChange = null as null | ((payload: Record<string, unknown>) => void),
}) {
  const [busy, setBusy] = useState(false);

  const finish = (evt: any, upgrade: boolean) => {
    if (busy) return;
    setBusy(true);
    const stepForm = evt?.currentTarget?.closest?.('form') ?? null;
    const outputs = upgrade
      ? {
          labTestOptionId: 'C', optionType: 'panel', upgraded: true, skipLabPanelOrder: false,
          labPanelId: labPanelIdFor('C'), labPanelPrice: Number(offerPrice) || 0, labPanelQuantity: 1,
          labPanelName: panelName, labTestProductId: productId,
        }
      : {
          labTestOptionId: 'B', optionType: 'panel', upgraded: false, skipLabPanelOrder: false,
          labPanelId: labPanelIdFor('B'), labPanelPrice: 0, labPanelQuantity: 1,
          labPanelName: freePanelName, labTestProductId: freePanelProductId,
        };
    if (upgrade) {
      try {
        const cart = (window as any).pathwai?.cart;
        if (cart && productId) {
          [freePanelProductId, productId].filter(Boolean)
            .forEach((id) => { try { cart.removeItem(id); } catch (_) { /* ignore */ } });
          cart.addItem({ id: productId, name: panelName, price: Number(offerPrice) || 0, quantity: 1 });
        }
      } catch (_) { /* ignore */ }
      persistLabSelection(outputs);
    }
    if (upgrade) writePricing({ lab: { name: panelName, regular: Number(regularPrice) || 0, paid: Number(offerPrice) || 0 } });
    onChange?.(outputs);
    if (stepForm && typeof stepForm.requestSubmit === 'function') stepForm.requestSubmit();
    else (window as any).pathwai?.flow?.next?.();
  };

  return (
    <>
      <style>{`
        .mlu-root, .mlu-root * { box-sizing: border-box; }
        .mlu-root { width: 100%; font-family: 'Inter', system-ui, sans-serif; color: var(--mlu-text); }
        .mlu-card { border: 1.5px solid var(--mlu-brand); border-radius: 14px; padding: 16px; background: #fff; }
        .mlu-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
        .mlu-name { font-family: 'Figtree', sans-serif; font-weight: 600; font-size: 17px; }
        .mlu-price { display: flex; align-items: baseline; gap: 8px; flex-shrink: 0; }
        .mlu-was { color: var(--mlu-muted); text-decoration: line-through; font-size: 15px; }
        .mlu-now { font-family: 'Figtree', sans-serif; font-weight: 700; font-size: 22px; color: var(--mlu-brand); }
        .mlu-save {
          display: inline-block; margin-top: 10px; padding: 4px 10px; border-radius: 999px;
          background: var(--mlu-brand); color: #fff; font-size: 12px; font-weight: 600;
        }
        .mlu-blurb { margin-top: 10px; font-size: 13px; line-height: 1.5; }
        .mlu-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
        .mlu-yes, .mlu-no {
          width: 100%; height: 48px; border-radius: 10px; font-family: 'Inter', sans-serif;
          font-size: 15px; font-weight: 500; cursor: pointer;
        }
        .mlu-yes { border: none; background: var(--mlu-brand); color: #fff; }
        .mlu-no { border: 1.5px solid var(--mlu-border); background: #fff; color: var(--mlu-text); }
        .mlu-yes:disabled, .mlu-no:disabled { opacity: 0.6; cursor: wait; }
      `}</style>
      <div
        className="mlu-root"
        style={{
          ['--mlu-brand' as string]: brandColor,
          ['--mlu-text' as string]: textColor,
          ['--mlu-muted' as string]: mutedColor,
          ['--mlu-border' as string]: borderColor,
        }}
      >
        <div className="mlu-card">
          <div className="mlu-row">
            <span className="mlu-name">{panelName}</span>
            <span className="mlu-price">
              {Number(regularPrice) > 0 && <span className="mlu-was">${regularPrice}</span>}
              <span className="mlu-now">${offerPrice}</span>
            </span>
          </div>
          {savingsLabel && <span className="mlu-save">{savingsLabel}</span>}
          {blurb && <div className="mlu-blurb">{blurb}</div>}
        </div>
        <div className="mlu-actions">
          <button type="button" className="mlu-yes" onClick={(e) => finish(e, true)} disabled={busy}>{yesLabel}</button>
          <button type="button" className="mlu-no" onClick={(e) => finish(e, false)} disabled={busy}>{noLabel}</button>
        </div>
      </div>
    </>
  );
}

export const propSchema = {
  panelName: { type: 'string', title: 'Panel name', defaultValue: 'Comprehensive Longevity Panel' },
  regularPrice: { type: 'number', title: 'Regular price (crossed out, must be a real price)', defaultValue: 189, min: 0, step: 1 },
  offerPrice: { type: 'number', title: 'Offer price', defaultValue: 99, min: 0, step: 1 },
  savingsLabel: { type: 'string', title: 'Savings chip', defaultValue: 'Save $90' },
  blurb: { type: 'string', title: 'Selling line', defaultValue: '55+ biomarkers in one draw: hormones, metabolic, thyroid, heart (lipids, ApoB), inflammation and blood sugar.' },
  yesLabel: { type: 'string', title: 'Yes button', defaultValue: 'Yes, upgrade for $99' },
  noLabel: { type: 'string', title: 'No button', defaultValue: 'No thanks' },
  freePanelName: { type: 'string', title: 'Free panel name', defaultValue: "Men's Hormone Panel" },
  freePanelProductId: { type: 'string', title: 'Cart product id (free hormone panel)', defaultValue: '' },
  productId: { type: 'string', title: 'Cart product id (longevity panel)', defaultValue: '' },
  brandColor: { type: 'color', title: 'Brand color', defaultValue: '#161336' },
  textColor: { type: 'color', title: 'Text color', defaultValue: '#1C1C21' },
  mutedColor: { type: 'color', title: 'Muted text color', defaultValue: '#71717a' },
  borderColor: { type: 'color', title: 'Border color', defaultValue: '#EFEFEC' },
};

export const outputSchema = {
  labTestOptionId: { type: 'string', title: 'Lab option (B kept, C upgraded)' },
  upgraded: { type: 'boolean', title: 'Upgraded to longevity panel' },
  labPanelId: { type: 'number', title: 'Strut lab panel id' },
  labPanelPrice: { type: 'number', title: 'Lab panel price sent' },
  labPanelQuantity: { type: 'number', title: 'Lab panel quantity' },
};
