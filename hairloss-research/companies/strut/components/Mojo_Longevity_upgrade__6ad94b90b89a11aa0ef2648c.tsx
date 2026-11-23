import React, { useState } from 'react';

const ENCLO_LAB_PANELS = [
  { key: 'B|default', staging: 2279, prod: 2289 },
  { key: 'C|default', staging: 2219, prod: 2292 },
  { key: 'B|restricted', staging: 2280, prod: 2290 },
  { key: 'C|restricted', staging: 2221, prod: 2291 },
];
const PANEL_PRODUCTS = {
  B: { default: '4520fa9c-a7ff-4a73-9537-1a61bb56d849', restricted: '851717ec-48c0-47ac-896a-bdd21acdd74f' },
  C: { default: '66a418be-eba3-4353-8da1-c4f71e74d255', restricted: '629b2f44-b4a0-4c2c-9273-27dbaf81456f' },
};
const RESTRICTED_STATES = ['NY', 'NJ'];

const isStagingEnv = () => {
  if (typeof window === 'undefined') return false;
  const w = window;
  const explicit = String(w.strut_env || '').toLowerCase();
  if (explicit === 'staging') return true;
  if (explicit === 'production' || explicit === 'prod') return false;
  const blob = [(w.strut && w.strut.ENV && w.strut.ENV.api) || '', (w.strut && w.strut.ENV && w.strut.ENV.checkout) || '', (w.location && w.location.href) || ''].join(' ');
  return /strut-test/i.test(blob);
};

const takeState = (raw, found) => {
  const v = String(raw == null ? '' : raw).trim().toUpperCase();
  if (/^[A-Z]{2}$/.test(v)) found.push(v);
};
const walkState = (node, depth, found) => {
  if (!node || depth > 6) return;
  if (typeof node === 'string') { takeState(node, found); return; }
  if (typeof node !== 'object') return;
  takeState(node.state, found);
  takeState(node.State, found);
  takeState(node.value, found);
  takeState(node.stateCode, found);
  Object.keys(node).forEach((key) => {
    const child = node[key];
    if (child && typeof child === 'object') walkState(child, depth + 1, found);
    else {
      const v = String(child == null ? '' : child).trim().toUpperCase();
      if (v === 'NY' || v === 'NJ' || /state|value/i.test(key)) takeState(child, found);
    }
  });
};
const resolveUserState = () => {
  const found = [];
  try {
    const w = window;
    const user = w.pathwai && w.pathwai.user && w.pathwai.user.getUser && w.pathwai.user.getUser();
    if (user) walkState(user, 0, found);
    walkState(w.pathwai && w.pathwai.user && w.pathwai.user.answers, 0, found);
    walkState(w.pathwai && w.pathwai.answers, 0, found);
    walkState(w.pathwai && w.pathwai.flow && w.pathwai.flow.getAnswers && w.pathwai.flow.getAnswers(), 0, found);
  } catch (e) { /* ignore */ }
  return found.find((code) => RESTRICTED_STATES.indexOf(code) !== -1) || found[0] || '';
};
const regionKeyFor = (region) => {
  const forced = String(region || 'auto').toLowerCase();
  if (forced === 'ny-nj' || forced === 'nynj' || forced === 'restricted') return 'restricted';
  if (forced === 'default' || forced === 'other') return 'default';
  return RESTRICTED_STATES.indexOf(resolveUserState()) !== -1 ? 'restricted' : 'default';
};
const labPanelIdFor = (option, region) => {
  const row = ENCLO_LAB_PANELS.find((r) => r.key === option + '|' + regionKeyFor(region));
  return row ? (isStagingEnv() ? row.staging : row.prod) : 0;
};
const productIdFor = (option, explicit, region) => {
  const given = String(explicit || '').trim();
  if (given) return given;
  return PANEL_PRODUCTS[option][regionKeyFor(region)];
};
const persistLabSelection = (payload) => {
  try {
    window.__STRUT_ENCLO_LAB__ = payload;
    window.localStorage.setItem('strut.enclo.labSelection', JSON.stringify(payload));
  } catch (e) { /* ignore */ }
};
const PRICING_KEY = 'strut.mojo.pricing';
function readPricing() {
  try {
    if (window.__STRUT_MOJO_PRICING__) return window.__STRUT_MOJO_PRICING__;
    const raw = window.localStorage.getItem(PRICING_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function writePricing(patch) {
  try {
    const next = Object.assign({}, readPricing(), patch, { updatedAt: Date.now() });
    window.__STRUT_MOJO_PRICING__ = next;
    window.localStorage.setItem(PRICING_KEY, JSON.stringify(next));
  } catch (e) { /* ignore */ }
}

export default function MojoLongevityUpgrade(props) {
  const panelName = props.panelName || 'Comprehensive Longevity Panel';
  const regularPrice = props.regularPrice == null ? 189 : props.regularPrice;
  const offerPrice = props.offerPrice == null ? 99 : props.offerPrice;
  const savingsLabel = props.savingsLabel || 'Save $90';
  const blurb = props.blurb || '55+ biomarkers in one draw: hormones, metabolic, thyroid, heart (lipids, ApoB), inflammation and blood sugar.';
  const yesLabel = props.yesLabel || 'Yes, upgrade for $99';
  const noLabel = props.noLabel || 'No thanks';
  const freePanelName = props.freePanelName || "Men's Hormone Panel";
  const freePanelProductId = props.freePanelProductId || '';
  const productId = props.productId || '';
  const region = props.region || 'auto';
  const brandColor = props.brandColor || '#161336';
  const textColor = props.textColor || '#1C1C21';
  const mutedColor = props.mutedColor || '#71717a';
  const borderColor = props.borderColor || '#EFEFEC';
  const onChange = props.onChange || null;
  const [busy, setBusy] = useState(false);
  const finish = (evt, upgrade) => {
    if (busy) return;
    setBusy(true);
    const stepForm = evt && evt.currentTarget && evt.currentTarget.closest ? evt.currentTarget.closest('form') : null;
    const freeId = productIdFor('B', freePanelProductId, region);
    const upgradeId = productIdFor('C', productId, region);
    const outputs = upgrade
      ? { labTestOptionId: 'C', optionType: 'panel', upgraded: true, skipLabPanelOrder: false, labPanelId: labPanelIdFor('C', region), labPanelPrice: Number(offerPrice) || 0, labPanelQuantity: 1, labPanelName: panelName, labTestProductId: upgradeId, state: resolveUserState() }
      : { labTestOptionId: 'B', optionType: 'panel', upgraded: false, skipLabPanelOrder: false, labPanelId: labPanelIdFor('B', region), labPanelPrice: 0, labPanelQuantity: 1, labPanelName: freePanelName, labTestProductId: freeId, state: resolveUserState() };
    try {
      const cart = window.pathwai && window.pathwai.cart;
      const nextId = upgrade ? upgradeId : freeId;
      const nextName = upgrade ? panelName : freePanelName + ' (free with your order)';
      const nextPrice = upgrade ? (Number(offerPrice) || 0) : 0;
      if (cart && nextId) {
        Object.values(PANEL_PRODUCTS.B).concat(Object.values(PANEL_PRODUCTS.C)).forEach((id) => { try { cart.removeItem(id); } catch (e) { /* ignore */ } });
        cart.addItem({ id: nextId, name: nextName, price: nextPrice, quantity: 1 });
      }
    } catch (e) { /* ignore */ }
    persistLabSelection(outputs);
    if (upgrade) writePricing({ lab: { name: panelName, regular: Number(regularPrice) || 0, paid: Number(offerPrice) || 0 } });
    if (onChange) onChange(outputs);
    onChange?.(outputs);
    if (stepForm && typeof stepForm.requestSubmit === 'function') stepForm.requestSubmit();
    else if (window.pathwai && window.pathwai.flow && window.pathwai.flow.next) window.pathwai.flow.next();
  };
  const css = '.mlu-root,.mlu-root *{box-sizing:border-box}.mlu-root{width:100%;font-family:Inter,system-ui,sans-serif;color:var(--mlu-text)}.mlu-card{border:1.5px solid var(--mlu-brand);border-radius:14px;padding:16px;background:#fff}.mlu-row{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.mlu-name{font-family:Figtree,sans-serif;font-weight:600;font-size:17px}.mlu-price{display:flex;align-items:baseline;gap:8px}.mlu-was{color:var(--mlu-muted);text-decoration:line-through;font-size:15px}.mlu-now{font-family:Figtree,sans-serif;font-weight:700;font-size:22px;color:var(--mlu-brand)}.mlu-save{display:inline-block;margin-top:10px;padding:4px 10px;border-radius:999px;background:var(--mlu-brand);color:#fff;font-size:12px;font-weight:600}.mlu-blurb{margin-top:10px;font-size:13px;line-height:1.5}.mlu-actions{display:flex;flex-direction:column;gap:8px;margin-top:16px}.mlu-yes,.mlu-no{width:100%;height:48px;border-radius:10px;font-size:15px;font-weight:500;cursor:pointer}.mlu-yes{border:none;background:var(--mlu-brand);color:#fff}.mlu-no{border:1.5px solid var(--mlu-border);background:#fff;color:var(--mlu-text)}.mlu-yes:disabled,.mlu-no:disabled{opacity:.6;cursor:wait}';
  return (
    <>
      <style>{css}</style>
      <div className="mlu-root" style={{ '--mlu-brand': brandColor, '--mlu-text': textColor, '--mlu-muted': mutedColor, '--mlu-border': borderColor }}>
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
  freePanelProductId: { type: 'string', title: 'Cart product id override (free hormone panel)', defaultValue: '' },
  productId: { type: 'string', title: 'Cart product id override (longevity panel)', defaultValue: '' },
  region: { type: 'string', title: 'Panel region (auto, ny-nj, or default)', defaultValue: 'auto' },
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
