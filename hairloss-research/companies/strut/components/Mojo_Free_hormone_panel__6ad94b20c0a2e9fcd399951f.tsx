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

export default function MojoFreeHormonePanel(props) {
  const panelName = props.panelName || "Men's Hormone Panel";
  const markers = props.markers || 'Total T · Free T · Estradiol · LH · FSH';
  const regularPrice = props.regularPrice == null ? 89 : props.regularPrice;
  const freeLabel = props.freeLabel || 'FREE';
  const terms = props.terms || 'Included with your order · new patients';
  const note = props.note || 'Medication ships after your provider reviews your labs.';
  const ctaLabel = props.ctaLabel || 'Continue';
  const productId = props.productId || '';
  const otherPanelProductIds = props.otherPanelProductIds || '';
  const region = props.region || 'auto';
  const brandColor = props.brandColor || '#161336';
  const textColor = props.textColor || '#1C1C21';
  const mutedColor = props.mutedColor || '#71717a';
  const borderColor = props.borderColor || '#EFEFEC';
  const onChange = props.onChange || null;
  const [busy, setBusy] = useState(false);
  const resolvedProductId = productIdFor('B', productId, region);
  const outputs = {
    labTestOptionId: 'B',
    optionType: 'panel',
    freePanel: true,
    skipLabPanelOrder: false,
    labPanelId: labPanelIdFor('B', region),
    labPanelPrice: 0,
    labPanelQuantity: 1,
    labPanelName: panelName,
    labTestProductId: resolvedProductId,
    state: resolveUserState(),
  };
  const handleContinue = (evt) => {
    if (busy) return;
    setBusy(true);
    const stepForm = evt && evt.currentTarget && evt.currentTarget.closest ? evt.currentTarget.closest('form') : null;
    try {
      const cart = window.pathwai && window.pathwai.cart;
      if (cart && resolvedProductId) {
        String(otherPanelProductIds).split(',').map((s) => s.trim()).filter(Boolean)
          .concat(Object.values(PANEL_PRODUCTS.B), Object.values(PANEL_PRODUCTS.C), resolvedProductId)
          .forEach((id) => { try { cart.removeItem(id); } catch (e) { /* ignore */ } });
        cart.addItem({ id: resolvedProductId, name: panelName + ' (free with your order)', price: 0, quantity: 1 });
      }
    } catch (e) { /* ignore */ }
    persistLabSelection(outputs);
    writePricing({ lab: { name: panelName, regular: Number(regularPrice) || 0, paid: 0 } });
    if (onChange) onChange(outputs);
    if (stepForm && typeof stepForm.requestSubmit === 'function') stepForm.requestSubmit();
    else if (window.pathwai && window.pathwai.flow && window.pathwai.flow.next) window.pathwai.flow.next();
  };
  const css = '.mfhp-root,.mfhp-root *{box-sizing:border-box}.mfhp-root{width:100%;font-family:Inter,system-ui,sans-serif;color:var(--mfhp-text)}.mfhp-card{border:1.5px solid var(--mfhp-brand);border-radius:14px;padding:16px;background:#fff}.mfhp-row{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.mfhp-name{font-family:Figtree,sans-serif;font-weight:600;font-size:17px}.mfhp-price{display:flex;align-items:baseline;gap:8px;flex-shrink:0}.mfhp-was{color:var(--mfhp-muted);text-decoration:line-through;font-size:15px}.mfhp-free{font-family:Figtree,sans-serif;font-weight:700;font-size:20px;color:var(--mfhp-brand)}.mfhp-markers{margin-top:8px;font-size:13px;line-height:1.45}.mfhp-terms{display:inline-block;margin-top:10px;padding:4px 10px;border-radius:999px;background:var(--mfhp-tint);color:var(--mfhp-brand);font-size:12px;font-weight:600}.mfhp-note{margin:14px 2px 0;font-size:13px;color:var(--mfhp-muted);line-height:1.45}.mfhp-cta{margin-top:16px;width:100%;height:48px;border:none;border-radius:10px;background:var(--mfhp-brand);color:#fff;font-size:15px;font-weight:500;cursor:pointer}.mfhp-cta:disabled{opacity:.6;cursor:wait}';
  return (
    <>
      <style>{css}</style>
      <div className="mfhp-root" style={{ '--mfhp-brand': brandColor, '--mfhp-text': textColor, '--mfhp-muted': mutedColor, '--mfhp-border': borderColor, '--mfhp-tint': 'rgba(22, 19, 54, 0.07)' }}>
        <div className="mfhp-card">
          <div className="mfhp-row">
            <span className="mfhp-name">{panelName}</span>
            <span className="mfhp-price">
              {Number(regularPrice) > 0 && <span className="mfhp-was">${regularPrice}</span>}
              <span className="mfhp-free">{freeLabel}</span>
            </span>
          </div>
          {markers && <div className="mfhp-markers">{markers}</div>}
          {terms && <span className="mfhp-terms">{terms}</span>}
        </div>
        {note && <p className="mfhp-note">{note}</p>}
        <button type="button" className="mfhp-cta" onClick={handleContinue} disabled={busy}>{busy ? 'One moment...' : ctaLabel}</button>
      </div>
    </>
  );
}

export const propSchema = {
  panelName: { type: 'string', title: 'Panel name', defaultValue: "Men's Hormone Panel" },
  markers: { type: 'string', title: 'Markers line', defaultValue: 'Total T · Free T · Estradiol · LH · FSH' },
  regularPrice: { type: 'number', title: 'Regular price (crossed out, must be a real price)', defaultValue: 89, min: 0, step: 1 },
  freeLabel: { type: 'string', title: 'Free label', defaultValue: 'FREE' },
  terms: { type: 'string', title: 'Terms chip', defaultValue: 'Included with your order · new patients' },
  note: { type: 'string', title: 'Note under the card', defaultValue: 'Medication ships after your provider reviews your labs.' },
  ctaLabel: { type: 'string', title: 'Button label', defaultValue: 'Continue' },
  productId: { type: 'string', title: 'Cart product id override (blank = NY/NJ or default id from state)', defaultValue: '' },
  otherPanelProductIds: { type: 'string', title: 'Other panel product ids to clear (comma separated)', defaultValue: '' },
  region: { type: 'string', title: 'Panel region (auto, ny-nj, or default)', defaultValue: 'auto' },
  brandColor: { type: 'color', title: 'Brand color', defaultValue: '#161336' },
  textColor: { type: 'color', title: 'Text color', defaultValue: '#1C1C21' },
  mutedColor: { type: 'color', title: 'Muted text color', defaultValue: '#71717a' },
  borderColor: { type: 'color', title: 'Border color', defaultValue: '#EFEFEC' },
};

export const outputSchema = {
  labTestOptionId: { type: 'string', title: 'Lab option (always B)' },
  freePanel: { type: 'boolean', title: 'Took the free panel' },
  labPanelId: { type: 'number', title: 'Strut lab panel id' },
  labPanelPrice: { type: 'number', title: 'Lab panel price sent (0)' },
  labPanelQuantity: { type: 'number', title: 'Lab panel quantity' },
};
