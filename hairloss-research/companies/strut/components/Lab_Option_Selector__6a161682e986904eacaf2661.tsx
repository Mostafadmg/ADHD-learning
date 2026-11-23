import React, { useState, useEffect } from 'react';

/* ============================================================
   PricingCardLabsFork
   ------------------------------------------------------------
   A 3-option fork for lab requirements:
     Option A: Upload existing labs (no price)
     -- OR --
     Option B: Order lab panel #1 (priced)
     Option C: Order lab panel #2 (priced)

   Clicking an option selects + expands it inline (accordion).
   Only one expanded at a time. Expanded content differs:
     - Option A shows upload zone + recommended marker list
     - Options B & C show shared process steps

   Cart is single-select: adding B or C removes the other first.
   Scoped CSS prefix: pclf-
   Design system: Figtree headings, Plus Jakarta Sans body.
============================================================ */

/* Hex + opacity helper */
const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== 'string') return `rgba(0,0,0,${alpha})`;
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/* Parse list from newline-separated string */
const parseItems = (str) => {
  if (!str || typeof str !== 'string') return [];
  return str.split('\n').map(s => s.trim()).filter(Boolean);
};

/* ============================================================
   STRUT LAB PANEL IDS (env + state)
   ------------------------------------------------------------
   Same card is used for every state. Prod ids are invalid on
   staging and vice versa — same pattern as SuperStrut combo maps.
     B|default    testosterone-lab-panel / testosterone-lab-panel
     C|default    Comprehensive-Longevity-Panel / comp-long-lab
     B|restricted testosterone-lab-panel-ny-nj / testosterone-nynj
     C|restricted Comprehensive-Longevity-Panel-ny-nj / comp-long
   Env: window.strut_env = 'staging' | 'production'
        (also infers from strut-test URLs)
============================================================ */
const ENCLO_LAB_PANELS = [
  { key: 'B|default',    staging: 580,  prod: 2254 },
  { key: 'C|default',    staging: 2219, prod: 2255 },
  { key: 'B|restricted', staging: 2220, prod: 2238 },
  { key: 'C|restricted', staging: 2221, prod: 2239 },
];
const RESTRICTED_STATES = ['NY', 'NJ'];

const isStagingEnv = () => {
  if (typeof window === 'undefined') return false;
  const explicit = String(window.strut_env || '').toLowerCase();
  if (explicit === 'staging') return true;
  if (explicit === 'production' || explicit === 'prod') return false;
  const strut = window.strut;
  const blob = [
    strut?.ENV?.api || '',
    strut?.ENV?.checkout || '',
    typeof window.location !== 'undefined' ? window.location.href : '',
  ].join(' ');
  return /strut-test/i.test(blob);
};

const labPanelIdForKey = (key) => {
  const row = ENCLO_LAB_PANELS.find((s) => s.key === key);
  if (!row) return null;
  return isStagingEnv() ? row.staging : row.prod;
};

/* Read the visitor's selected state (2-letter, uppercased). */
const resolveUserState = () => {
  try {
    const bags = [];
    const user = (typeof window !== 'undefined' && window.pathwai?.user?.getUser?.()) || null;
    if (user) bags.push(user, user.profile, user.profile?.address, user.answers);
    if (typeof window !== 'undefined') {
      bags.push(window.pathwai?.user?.answers, window.pathwai?.answers, window.pathwai?.user);
    }
    for (const bag of bags) {
      if (!bag || typeof bag !== 'object') continue;
      const raw = bag.state || bag.State || bag.shippingState || bag.address?.state;
      if (raw) return String(raw).trim().toUpperCase();
    }
  } catch (_) { /* ignore */ }
  return '';
};

const isNyNjState = () => RESTRICTED_STATES.includes(resolveUserState());

/* Resolve the Strut labPanelId for an option ('B' | 'C') from env + state. */
const resolveLabPanelId = (optionId) => {
  const region = isNyNjState() ? 'restricted' : 'default';
  return labPanelIdForKey(`${optionId}|${region}`);
};

/* ============================================================
   HOW EACH PANEL IS BILLED BY STRUT
   ------------------------------------------------------------
   The price shown on the card is the TOTAL the customer pays.
   Strut bills it as `quantity` x `unitPrice` via FinishOrderV2
   (labPanelQuantity / labPanelPrice), which can differ from the
   single displayed figure:
     B — Testosterone Panel:            $89  = 1 x $89
     C — Comprehensive Longevity Panel: $189 = 2 x $99
   `unitPrice` omitted => the displayed price is sent as-is with
   the given quantity (default 1).
============================================================ */
const LAB_PANEL_BILLING = {
  B: { quantity: 1 },
  C: { quantity: 1 },
};

/* Resolve { labPanelQuantity, labPanelPrice } for an option, given the price
   displayed on its card. labPanelPrice is the UNIT price Strut charges. */
const resolveLabPanelBilling = (optionId, displayedPrice) => {
  const billing = LAB_PANEL_BILLING[optionId] || {};
  const quantity = billing.quantity != null ? Number(billing.quantity) : 1;
  const unitPrice = billing.unitPrice != null ? Number(billing.unitPrice) : displayedPrice;
  return { labPanelQuantity: quantity, labPanelPrice: unitPrice };
};

/* Render text with **bold** segments highlighted in brand color */
const renderHighlighted = (text) => {
  if (!text || typeof text !== 'string') return text;
  if (!text.includes('**')) return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="pclf-highlight">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
};

export default function PricingCardLabsFork({
  /* ===== BRAND + THEME ===== */
  brandColor = '#161336',
  textColor = '#0F1714',
  textMutedColor = '#6B7670',
  borderColor = '#E5E1D8',
  borderSoftColor = '#EFECE3',
  surfaceColor = '#FFFFFF',
  cardShadowOpacity = 0.06,

  /* ===== SELECTION ===== */
  selectedBorderWidth = 2,

  /* ===== SECTION LABEL ===== */
  pricingSectionLabel = 'Choose your lab option',

  /* ===== OPTION A: UPLOAD EXISTING LABS ===== */
  optionATitle = 'Upload Recent Labs',
  optionASubnote = 'Use bloodwork completed within the last 6 months.',
  optionABadge = 'No additional cost',
  optionANoteText = "You'll upload your bloodwork in the next step.",
  optionAMarkersTitle = 'Recommended markers include:',
  optionAMarkers = 'Total Testosterone\nFree Testosterone\nEstradiol\nLH/FSH\nCBC\nCMP',

  /* ===== DIVIDER ===== */
  dividerLabel = 'OR',

  /* ===== OPTION B: LAB PANEL #1 ===== */
  optionBTitle = 'Testosterone Panel',
  optionBPrice = '$89',
  optionBOriginalPrice = '$149',
  optionBProductId = 'c5fd3651-1088-48de-8c0a-e0674ea14fe6',
  optionBSubnote = 'Includes essential hormone testing required for treatment review.',
  optionBBadge = '',
  optionBMarkers = 'Total Testosterone\nFree Testosterone\nEstradiol (Sensitive E2)\nLuteinizing Hormone (LH)\nFollicle Stimulating Hormone (FSH)',

  /* ===== OPTION C: LAB PANEL #2 ===== */
  optionCTitle = 'Comprehensive Longevity Panel',
  optionCPrice = '$189',
  optionCOriginalPrice = '$349',
  optionCProductId = '655f6919-a4dc-4e89-95ba-9824e65687a0',
  optionCSubnote = 'Advanced hormone, metabolic, and wellness biomarkers for a more complete health evaluation.',
  optionCBadge = 'Most popular',
  optionCMarkersIntro = 'Everything in the Essential panel, plus:',
  optionCMarkers = 'SHBG\nFasting Insulin\nHemoglobin A1c\nLipid Panel\nApoB\nhs-CRP\nTSH\nIGF-1\nVitamin D\nPSA',

  /* ===== PANEL MARKERS (shown in B & C expanded panels) ===== */
  panelMarkersTitle = "What's included",

  /* ===== SHARED PROCESS STEPS (for B & C expanded panels) ===== */
  processSectionLabel = 'How the Process Works',
  step1Title = 'Complete checkout as normal.',
  step1Description = 'If needed, you will receive instructions to complete your selected lab panel.',
  step2Title = 'Submit your labs for review',
  step2Description = 'Once your labs are reviewed and approved by a Strut medical provider, your prescription will be processed and shipped.',
  step3Title = '',
  step3Description = '',
  step4Title = 'Medication shipped',
  step4Description = 'Once approved, your medication is processed and shipped. Most results complete within a few business days.',
  step5Title = '',
  step5Description = '',

  /* ===== "WHAT HAPPENS AFTER YOU JOIN" SECTION (standalone, below cards) ===== */
  joinSectionLabel = 'What happens next',
  joinStep1Title = 'Complete your medical intake',
  joinStep1Description = 'Answer a few secure questions about your health, history, and treatment goals.',
  joinStep2Title = 'Complete your labs',
  joinStep2Description = 'Upload existing bloodwork or order a panel above. Junction emails you simple instructions, and **appointments take less than 15 minutes**.',
  joinStep3Title = 'Physician review & ships',
  joinStep3Description = 'A Strut medical provider reviews your results. Once approved, your medication is processed and shipped to your door. **Most reviews complete within 24-48 hours.**',
  joinStep4Title = '',
  joinStep4Description = '',
  joinStep5Title = '',
  joinStep5Description = '',

  /* ===== DEFAULT SELECTION ===== */
  defaultOption = 'B', // 'A' | 'B' | 'C'

  /* ===== TRUST FOOTER ===== */
  trust1Label = 'Clinician-reviewed results',
  trust1Icon = 'shield',
  trust2Label = 'Secure & private',
  trust2Icon = 'lock',
  trust3Label = 'Cancel anytime',
  trust3Icon = 'check',

  borderRadius = 12,

  /* ===== CTA (different label per option type) ===== */
  ctaUploadLabel = 'Upload your labs',
  ctaCartLabel = 'Add to cart',

  /* ===== COMPLIANCE NOTE ===== */
  complianceNote = 'Please note: medication cannot be shipped until required labs have been completed and medically approved.',

  onChange = null
}) {
  /* Build options array */
  const OPTIONS = [
    {
      id: 'A',
      optionType: 'upload',
      title: optionATitle,
      subnote: optionASubnote,
      badge: optionABadge,
      price: '',
      originalPrice: '',
      productId: '',
    },
    {
      id: 'B',
      optionType: 'panel',
      title: optionBTitle,
      subnote: optionBSubnote,
      badge: optionBBadge,
      price: optionBPrice,
      originalPrice: optionBOriginalPrice,
      productId: optionBProductId,
    },
    {
      id: 'C',
      optionType: 'panel',
      title: optionCTitle,
      subnote: optionCSubnote,
      badge: optionCBadge,
      price: optionCPrice,
      originalPrice: optionCOriginalPrice,
      productId: optionCProductId,
    },
  ];

  /* All panel product IDs — used to clear cart before adding new selection */
  const ALL_PANEL_IDS = OPTIONS.filter(_ => !!_.productId);

  /* Default selection */
  const validDefault = ['A', 'B', 'C'].includes(defaultOption) ? defaultOption : 'B';
  const [selectedId, setSelectedId] = useState(validDefault);
  const [cartAdded, setCartAdded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState(null);

  /* Reset cartAdded when selection changes */
  useEffect(() => {
    setCartAdded(false);
  }, [selectedId]);

  /* Process steps for panel options (inside expanded B/C) */
  const STEPS = [
    { title: step1Title, description: step1Description },
    { title: step2Title, description: step2Description },
    { title: step3Title, description: step3Description },
    { title: step4Title, description: step4Description },
    { title: step5Title, description: step5Description },
  ].filter(s => s.title);

  /* "What happens after you join" steps (standalone section below cards) */
  const JOIN_STEPS = [
    { title: joinStep1Title, description: joinStep1Description },
    { title: joinStep2Title, description: joinStep2Description },
    { title: joinStep3Title, description: joinStep3Description },
    { title: joinStep4Title, description: joinStep4Description },
    { title: joinStep5Title, description: joinStep5Description },
  ].filter(s => s.title);

  /* Markers for upload option */
  const MARKERS = parseItems(optionAMarkers);

  /* Markers for panel options (B & C) */
  const MARKERS_B = parseItems(optionBMarkers);
  const MARKERS_C = parseItems(optionCMarkers);

  /* Trust footer */
  const TRUST = [
    { label: trust1Label, icon: trust1Icon },
    { label: trust2Label, icon: trust2Icon },
    { label: trust3Label, icon: trust3Icon },
  ].filter(t => t.label);

/* Persist the selected lab option so FinishOrderV2 can drop panel fields
   for Option A even if the PathwAI event still interpolates labPanelId. */
const persistStrutLabSelection = (outputs) => {
  const optionId = String(outputs.labTestOptionId || outputs.labTestOptionId || '');
  const optionType = String(outputs.optionType || outputs.optionType || '');
  const isPanel = optionType === 'panel';
  const qty = Number(outputs.labPanelQuantity || outputs.labPanelQuantity) || 0;
  const payload = {
    labTestOptionId: optionId,
    optionType: optionType,
    skipLabPanelOrder: !isPanel,
    labPanelId: Number(outputs.labPanelId) || 0,
    labPanelQuantity: qty,
    labPanelPrice: Number(outputs.labPanelPrice) || 0,
    labPanelName: String(outputs.optionTitle || outputs.labPanelName || ''),
  };
  payload.labTestOptionId = optionId;
  payload.optionType = optionType;
  payload.skipLabPanelOrder = !isPanel;
  payload.labPanelQuantity = qty;
  try {
    if (typeof window !== 'undefined') {
      window.__STRUT_ENCLO_LAB__ = payload;
      window.__STRUT_ENCLO_LAB__ = payload;
      const raw = JSON.stringify(payload);
      window.localStorage.setItem('strut.enclo.labSelection', raw);
      window.localStorage.setItem('strut.enclo.labSelection', raw);
    }
  } catch (_) { /* ignore */ }
  return outputs;
};

  /* Build the flat outputSchema payload for the selected option.
     labTestOptionId is ALWAYS the letter "A" | "B" | "C" — this is what flow
     routing conditions match (e.g. …labTestOptionId equal "A"). */
  const buildOutputs = (opt, cartAddedFlag) => {
    const isPanel = opt.optionType === 'panel';
    const labPanelId = isPanel ? resolveLabPanelId(opt.id) : null;
    /* The card shows the TOTAL; Strut is billed quantity x unitPrice
       (e.g. Comprehensive: $198 shown = 2 x $99 sent). */
    const displayedPrice = parseFloat(String(opt.price).replace(/[^0-9.-]/g, '')) || 0;
    const billing = isPanel ? resolveLabPanelBilling(opt.id, displayedPrice) : null;
    const optionId = String(opt.id); // "A" | "B" | "C"
    return persistStrutLabSelection({
      labTestOptionId: optionId,
      labTestProductId: opt.productId || '', // Junction lab_test_id ('' for upload)
      optionType: opt.optionType,
      optionTitle: opt.title,
      optionPrice: opt.price || '',
      cartAdded: !!cartAddedFlag,
      skipLabPanelOrder: !isPanel,
      labPanelId: isPanel && labPanelId != null ? Number(labPanelId) : 0,
      labPanelPrice: billing ? billing.labPanelPrice : 0,
      labPanelQuantity: billing ? billing.labPanelQuantity : 0,
      labPanelName: isPanel ? String(opt.title || '') : '',
    });
  };

  /* Emit selection whenever it changes (and on mount).
     The Strut lab-panel details (state-dependent id + price + qty) are emitted
     here so the FINALIZE step can pass them to FinishOrderV2 — we no longer call
     SaveLabPanel from this step. Empty for Option A (upload), which has no panel. */
  useEffect(() => {
    const opt = OPTIONS.find(o => o.id === selectedId);
    if (!opt) return;
    onChange?.(buildOutputs(opt, cartAdded));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, cartAdded]);

  const handleCtaClick = async (evt) => {
    const opt = OPTIONS.find(o => o.id === selectedId);
    if (!opt || submitting) return;
    setSaveError(null);

    /* Submit the enclosing step form to COMMIT the selected option into the
       flow's answers (this is what path routing reads), then advance. Captured
       before any await because the event's currentTarget is cleared once the
       handler returns. Falls back to a plain next() if no form is found. */
    const stepForm = evt?.currentTarget?.closest?.('form') ?? null;
    const advance = (outputs) => {
      /* Flush outputs into the step form RIGHT BEFORE submit so routing always
         sees labTestOptionId = "A"|"B"|"C" even if the last useEffect emit was
         skipped or raced with cartAdded. */
      onChange?.(outputs);
      if (stepForm && typeof stepForm.requestSubmit === 'function') {
        stepForm.requestSubmit();
      } else {
        window.pathwai?.flow?.next();
      }
    };

    /* Option A (upload): no cart / no panel save — just advance. */
    if (opt.optionType !== 'panel' || !opt.productId) {
      advance(buildOutputs(opt, false));
      return;
    }

    setSubmitting(true);
    try {
      /* Clear any existing panel items, then add only the selected one. */
      const cart = window.pathwai?.cart;
      if (cart) {
        ALL_PANEL_IDS.forEach(pid => { try { cart.removeItem(pid.productId); } catch (_) {} });
        const priceNumeric = parseFloat(String(opt.price).replace(/[^0-9.-]/g, '')) || 0;
        cart.addItem({ id: opt.productId, name: opt.title, price: priceNumeric, quantity: 1 });
      }
      setCartAdded(true);

      /* Panel details are emitted via onChange and sent to Strut at the end of
         the flow through FinishOrderV2 (no SaveLabPanel call here anymore). */
      advance(buildOutputs(opt, true));
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const shadowSoft = `0 2px 8px ${hexToRgba('#000000', cardShadowOpacity)}`;
  const shadowLift = `0 6px 16px ${hexToRgba('#000000', cardShadowOpacity * 1.6)}`;

  const renderIcon = (icon) => {
    if (icon === 'shield') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 1L3 5V11C3 16.55 7.84 21.74 12 23C16.16 21.74 21 16.55 21 11V5L12 1Z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    }
    if (icon === 'lock') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 11H5C3.9 11 3 11.9 3 13V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V13C21 11.9 20.1 11 19 11ZM19 13V11C19 9.34 17.66 8 16 8H8C6.34 8 5 9.34 5 11V13H19Z"
            stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    }
    if (icon === 'check') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M7 12L10.5 15.5L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (icon === 'x') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M8 8L16 16M16 8L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }
    return null;
  };

  const renderOptionCard = (opt) => {
    const isSelected = selectedId === opt.id;
    return (
      <button
        type="button"
        key={opt.id}
        className={`pclf-card ${isSelected ? 'is-selected' : ''}`}
        onClick={() => setSelectedId(opt.id)}
        aria-pressed={isSelected}
        aria-expanded={isSelected}
      >
        <div className="pclf-card-top">
          <div className="pclf-card-left">
            <div className="pclf-card-eyebrow">Option {opt.id}</div>
            <h3 className="pclf-card-title">{opt.title}</h3>
            {(opt.price || opt.originalPrice) && (
              <div className="pclf-price-row">
                {opt.price && <span className="pclf-price-main">{opt.price}</span>}
                {opt.originalPrice && <span className="pclf-price-original">{opt.originalPrice}</span>}
              </div>
            )}
          </div>

          {opt.badge && (
            <div className="pclf-bubble-wrap">
              <span className={`pclf-bubble ${opt.id === 'A' ? 'is-soft' : ''}`}>{opt.badge}</span>
            </div>
          )}
        </div>

        {opt.subnote && <div className="pclf-subnote">{opt.subnote}</div>}

        {/* ===== EXPANDED CONTENT ===== */}
        {isSelected && (
          <div className="pclf-expanded">
            {opt.optionType === 'upload' ? (
              /* ===== UPLOAD INFO (markers only, upload happens next step) ===== */
              <>
                {optionANoteText && (
                  <div className="pclf-upload-note">
                    <svg className="pclf-upload-note-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M12 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
                    </svg>
                    <p className="pclf-upload-note-text">{optionANoteText}</p>
                  </div>
                )}

                {MARKERS.length > 0 && (
                  <div className="pclf-markers">
                    {optionAMarkersTitle && (
                      <p className="pclf-markers-title">{optionAMarkersTitle}</p>
                    )}
                    <ul className="pclf-markers-list">
                      {MARKERS.map((m, i) => (
                        <li key={i} className="pclf-marker-item">
                          <span className="pclf-marker-dot" aria-hidden="true" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (() => {
              /* ===== PANEL: included markers + process steps ===== */
              const panelMarkers = opt.id === 'C' ? MARKERS_C : MARKERS_B;
              const panelIntro = opt.id === 'C' ? optionCMarkersIntro : '';
              return (
                <>
                  {panelMarkers.length > 0 && (
                    <div className="pclf-markers pclf-markers-boxed">
                      {panelMarkersTitle && (
                        <p className="pclf-markers-title">{panelMarkersTitle}</p>
                      )}
                      {panelIntro && (
                        <p className="pclf-markers-intro">{panelIntro}</p>
                      )}
                      <ul className="pclf-markers-list">
                        {panelMarkers.map((m, i) => (
                          <li key={i} className="pclf-marker-item">
                            <span className="pclf-marker-dot" aria-hidden="true" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {STEPS.length > 0 && (
                    <div className={`pclf-process ${panelMarkers.length > 0 ? 'has-divider' : ''}`}>
                      {processSectionLabel && (
                        <p className="pclf-process-label">{processSectionLabel}</p>
                      )}
                      <ol className="pclf-process-list">
                        {STEPS.map((step, i) => (
                          <li key={i} className="pclf-process-item">
                            <span className="pclf-process-num">{i + 1}</span>
                            <div className="pclf-process-body">
                              <h4 className="pclf-process-step-title">{step.title}</h4>
                              {step.description && <p className="pclf-process-desc">{step.description}</p>}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </button>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .pclf-root, .pclf-root * { box-sizing: border-box; }
        .pclf-root {
          --pclf-brand: ${brandColor};
          --pclf-text: ${textColor};
          --pclf-text-muted: ${textMutedColor};
          --pclf-border: ${borderColor};
          --pclf-border-soft: ${borderSoftColor};
          --pclf-surface: ${surfaceColor};
          --pclf-radius: ${borderRadius}px;
          --pclf-sel-border: ${selectedBorderWidth}px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          color: var(--pclf-text);
          background: transparent;
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          padding: 16px 16px 20px 16px;
          display: flex;
          flex-direction: column;
        }

        /* ===== SECTION LABEL ===== */
        .pclf-label-row {
          font-family: 'Figtree', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          line-height: 1.33;
          text-transform: uppercase;
          color: var(--pclf-text);
          margin-bottom: 14px;
        }

        /* ===== CARD LIST ===== */
        .pclf-card-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }

        .pclf-card {
          position: relative;
          background: var(--pclf-surface);
          border: 1px solid var(--pclf-border);
          border-radius: var(--pclf-radius);
          padding: 18px 18px;
          cursor: pointer;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          box-shadow: ${shadowSoft};
          text-align: left;
          font-family: inherit;
          color: inherit;
          width: 100%;
          overflow: hidden;
        }
        .pclf-card:hover { box-shadow: ${shadowLift}; }
        .pclf-card.is-selected {
          border: var(--pclf-sel-border) solid var(--pclf-brand);
          padding: calc(18px - (var(--pclf-sel-border) - 1px)) calc(18px - (var(--pclf-sel-border) - 1px));
        }

        .pclf-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }
        .pclf-card-left { flex: 1; min-width: 0; }

        .pclf-card-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--pclf-text-muted);
          margin-bottom: 6px;
        }
        .pclf-card-title {
          font-family: 'Figtree', sans-serif;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.3;
          margin: 0 0 10px 0;
          color: var(--pclf-text);
          letter-spacing: -0.01em;
        }

        .pclf-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
        .pclf-price-main {
          font-family: 'Figtree', sans-serif;
          font-size: 26px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.01em;
          color: var(--pclf-text);
          font-variant-numeric: tabular-nums;
        }
        .pclf-price-original {
          font-family: 'Figtree', sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 1;
          color: var(--pclf-text-muted);
          text-decoration: line-through;
          text-decoration-thickness: 1.5px;
          font-variant-numeric: tabular-nums;
          opacity: 0.75;
        }

        .pclf-subnote {
          font-size: 13px;
          font-weight: 400;
          line-height: 1.5;
          color: var(--pclf-text-muted);
          margin-top: 10px;
        }

        /* ===== BUBBLE ===== */
        .pclf-bubble-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }
        .pclf-bubble {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--pclf-brand);
          color: #fff;
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.2;
          white-space: nowrap;
        }
        .pclf-bubble.is-soft {
          background: ${hexToRgba('#2A7F4A', 0.12)};
          color: #1F6638;
        }

        /* ===== EXPANDED PANEL ===== */
        .pclf-expanded {
          margin-top: 18px;
        }

        /* ===== UPLOAD NOTE (Option A) ===== */
        .pclf-upload-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: ${hexToRgba(brandColor, 0.06)};
          color: var(--pclf-text);
          padding: 10px 12px;
          border-radius: 6px;
        }
        .pclf-upload-note-icon {
          flex-shrink: 0;
          width: 14px;
          height: 14px;
          color: var(--pclf-brand);
          margin-top: 2px;
        }
        .pclf-upload-note-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          line-height: 1.5;
          color: var(--pclf-text);
          margin: 0;
        }

        /* ===== MARKERS LIST ===== */
        .pclf-markers {
          margin-top: 16px;
        }
        .pclf-markers-boxed {
          margin-top: 0;
          background: ${hexToRgba(brandColor, 0.04)};
          border: 1px solid var(--pclf-border-soft);
          border-radius: 10px;
          padding: 14px 16px;
        }
        .pclf-markers-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--pclf-text);
          margin: 0 0 8px 0;
        }
        .pclf-markers-intro {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--pclf-text-muted);
          line-height: 1.45;
          margin: 0 0 10px 0;
        }
        .pclf-markers-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 9px 16px;
        }
        .pclf-marker-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12.5px;
          color: var(--pclf-text-muted);
          line-height: 1.4;
        }
        .pclf-marker-dot {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: var(--pclf-brand);
          flex-shrink: 0;
          opacity: 0.5;
          margin-top: 6px;
        }

        /* ===== PROCESS LIST (inside expanded panel) ===== */
        .pclf-process.has-divider {
          margin-top: 18px;
        }
        .pclf-process-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--pclf-text-muted);
          margin: 0 0 14px 0;
        }
        .pclf-process-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .pclf-process-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .pclf-process-num {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: ${hexToRgba(brandColor, 0.08)};
          color: var(--pclf-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Figtree', sans-serif;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
        }
        .pclf-process-body { flex: 1; min-width: 0; }
        .pclf-process-step-title {
          font-family: 'Figtree', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          line-height: 1.4;
          margin: 0 0 3px 0;
          color: var(--pclf-text);
        }
        .pclf-process-desc {
          font-size: 12.5px;
          color: var(--pclf-text-muted);
          line-height: 1.55;
          margin: 0;
        }

        /* ===== OR DIVIDER ===== */
        .pclf-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
          color: var(--pclf-text-muted);
        }
        .pclf-divider::before,
        .pclf-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--pclf-border-soft);
        }
        .pclf-divider-label {
          font-family: 'Figtree', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--pclf-text-muted);
        }

        /* ===== "WHAT HAPPENS AFTER YOU JOIN" SECTION (standalone) ===== */
        .pclf-join {
          margin-bottom: 24px;
        }
        .pclf-join-label {
          font-family: 'Figtree', sans-serif;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.3;
          letter-spacing: -0.01em;
          color: var(--pclf-text);
          margin: 0 0 16px 0;
        }
        .pclf-join-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .pclf-join-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .pclf-join-num {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          background: ${hexToRgba(brandColor, 0.08)};
          color: var(--pclf-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Figtree', sans-serif;
          font-size: 13px;
          font-weight: 700;
          line-height: 1;
        }
        .pclf-join-body { flex: 1; min-width: 0; }
        .pclf-join-step-title {
          font-family: 'Figtree', sans-serif;
          font-size: 14.5px;
          font-weight: 600;
          line-height: 1.4;
          margin: 0 0 3px 0;
          color: var(--pclf-text);
        }
        .pclf-join-desc {
          font-size: 13px;
          color: var(--pclf-text-muted);
          line-height: 1.55;
          margin: 0;
        }
        .pclf-highlight {
          color: var(--pclf-brand);
          font-weight: 600;
        }

        /* ===== COMPLIANCE NOTE ===== */
        .pclf-compliance {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: ${hexToRgba(brandColor, 0.06)};
          color: var(--pclf-text);
          padding: 12px 14px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .pclf-compliance-icon {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          color: var(--pclf-brand);
          margin-top: 1px;
        }
        .pclf-compliance-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          line-height: 1.5;
          color: var(--pclf-text);
          margin: 0;
        }

        /* ===== CTA BUTTON ===== */
        .pclf-cta-wrap {
          margin-top: 4px;
          margin-bottom: 28px;
        }
        .pclf-cta {
          width: 100%;
          height: 44px;
          background: var(--pclf-brand);
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 0 16px;
          font-family: 'Figtree', sans-serif;
          font-size: 16px;
          font-weight: 500;
          line-height: 1;
          cursor: pointer;
          transition: opacity 0.18s ease, transform 0.18s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pclf-cta-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
        .pclf-cta:hover { opacity: 0.92; }
        .pclf-cta:active { transform: scale(0.97); }
        .pclf-cta:focus-visible {
          outline: 2px solid var(--pclf-brand);
          outline-offset: 2px;
        }

        /* ===== TRUST FOOTER ===== */
        .pclf-trust {
          padding-top: 20px;
          border-top: 1px solid var(--pclf-border-soft);
          display: flex;
          justify-content: space-around;
          align-items: center;
          gap: 16px;
          flex-wrap: nowrap;
        }
        .pclf-trust-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          color: var(--pclf-text-muted);
          flex: 1 1 auto;
          min-width: 0;
        }
        .pclf-trust-label {
          font-size: 11px;
          font-weight: 500;
          line-height: 1.3;
          color: var(--pclf-text-muted);
          margin: 0;
        }

        /* ===== TIER 5: <=340 ===== */
        @media (max-width: 340px) {
          .pclf-root { padding: 10px 10px 14px 10px; }
          .pclf-card { padding: 14px 14px; }
          .pclf-card.is-selected { padding: calc(14px - (var(--pclf-sel-border) - 1px)) calc(14px - (var(--pclf-sel-border) - 1px)); }
          .pclf-price-main { font-size: 22px; }
          .pclf-markers-boxed { padding: 12px 12px; }
          .pclf-trust { gap: 8px; }
          .pclf-trust-label { font-size: 10px; }
        }

        /* ===== TIER 4: <=380 ===== */
        @media (max-width: 380px) and (min-width: 341px) {
          .pclf-root { padding: 12px 12px 16px 12px; }
          .pclf-card { padding: 16px 16px; }
          .pclf-card.is-selected { padding: calc(16px - (var(--pclf-sel-border) - 1px)) calc(16px - (var(--pclf-sel-border) - 1px)); }
          .pclf-price-main { font-size: 24px; }
          .pclf-markers-boxed { padding: 12px 14px; }
        }

        /* ===== TIER 2: 600-899 ===== */
        @media (min-width: 600px) {
          .pclf-root { max-width: 480px; padding: 24px 16px 28px 16px; }
          .pclf-card { padding: 20px 20px; }
          .pclf-card.is-selected { padding: calc(20px - (var(--pclf-sel-border) - 1px)) calc(20px - (var(--pclf-sel-border) - 1px)); }
          .pclf-price-main { font-size: 28px; }
          .pclf-markers-list { grid-template-columns: 1fr 1fr; }
        }

        /* ===== TIER 1: >=900 ===== */
        @media (min-width: 900px) {
          .pclf-root { max-width: 500px; padding: 32px 16px 32px 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pclf-card { transition: none; }
          .pclf-cta { transition: none; }
          .pclf-cta:active { transform: none; }
        }
      `}</style>

      <div className="pclf-root">
        {/* ===== SECTION LABEL ===== */}
        {pricingSectionLabel && <div className="pclf-label-row">{pricingSectionLabel}</div>}

        {/* ===== OPTIONS LIST ===== */}
        <div className="pclf-card-list">
          {/* Option A */}
          {renderOptionCard(OPTIONS[0])}

          {/* OR divider */}
          {dividerLabel && (
            <div className="pclf-divider" aria-hidden="true">
              <span className="pclf-divider-label">{dividerLabel}</span>
            </div>
          )}

          {/* Option B */}
          {renderOptionCard(OPTIONS[1])}

          {/* Option C */}
          {renderOptionCard(OPTIONS[2])}
        </div>

        {/* ===== "WHAT HAPPENS AFTER YOU JOIN" SECTION ===== */}
        {JOIN_STEPS.length > 0 && (
          <div className="pclf-join">
            {joinSectionLabel && (
              <h3 className="pclf-join-label">{joinSectionLabel}</h3>
            )}
            <ol className="pclf-join-list">
              {JOIN_STEPS.map((step, i) => (
                <li key={i} className="pclf-join-item">
                  <span className="pclf-join-num">{i + 1}</span>
                  <div className="pclf-join-body">
                    <h4 className="pclf-join-step-title">{step.title}</h4>
                    {step.description && <p className="pclf-join-desc">{renderHighlighted(step.description)}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ===== COMPLIANCE NOTE ===== */}
        {complianceNote && (
          <div className="pclf-compliance">
            <svg className="pclf-compliance-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M12 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="1" fill="currentColor" />
            </svg>
            <p className="pclf-compliance-text">{complianceNote}</p>
          </div>
        )}

        {/* ===== CTA (dynamic label per option) ===== */}
        {(() => {
          const activeCtaLabel = selectedId === 'A' ? ctaUploadLabel : ctaCartLabel;
          if (!activeCtaLabel) return null;
          return (
            <div className="pclf-cta-wrap">
              <button
                type="button"
                className="pclf-cta"
                onClick={handleCtaClick}
                disabled={submitting}
                style={submitting ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
              >
                <span>{submitting ? 'Saving…' : activeCtaLabel}</span>
                <svg className="pclf-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              {saveError && (
                <p style={{ color: '#DC2626', fontSize: 13, marginTop: 8, textAlign: 'center' }}>{saveError}</p>
              )}
            </div>
          );
        })()}

        {/* ===== TRUST FOOTER ===== */}
        {TRUST.length > 0 && (
          <div className="pclf-trust">
            {TRUST.map((t, i) => (
              <div key={i} className="pclf-trust-item">
                {renderIcon(t.icon)}
                <p className="pclf-trust-label">{t.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ============================================================
   PROP SCHEMA
============================================================ */

/* Option B/C display price + Junction lab_test product ids are editable in the
   builder. Strut labPanelIds resolve from env + visitor state
   (see ENCLO_LAB_PANELS above). */
export const propSchema = {
  optionBPrice: {
    type: 'string',
    title: 'Option B Price',
    description: 'Displayed total price for Option B (Testosterone Panel), e.g. $89',
    defaultValue: '$89',
  },
  optionBProductId: {
    type: 'string',
    title: 'Option B Product ID',
    description: 'Junction lab_test_id for Option B (Testosterone Panel)',
    defaultValue: 'c5fd3651-1088-48de-8c0a-e0674ea14fe6',
  },
  optionCPrice: {
    type: 'string',
    title: 'Option C Price',
    description: 'Displayed total price for Option C (Comprehensive Longevity Panel), e.g. $198',
    defaultValue: '$198',
  },
  optionCProductId: {
    type: 'string',
    title: 'Option C Product ID',
    description: 'Junction lab_test_id for Option C (Comprehensive Longevity Panel)',
    defaultValue: '655f6919-a4dc-4e89-95ba-9824e65687a0',
  },
};

/* ============================================================
   OUTPUT SCHEMA
   These flat keys are emitted via onChange and are referenceable
   in routing conditions and {{...}} templates downstream.
============================================================ */
export const outputSchema = {
  labTestOptionId: {
    type: 'string',
    title: 'Selected Option ID',
    description: 'Letter of the selected option: "A" (upload), "B" (Testosterone Panel), or "C" (Comprehensive). Use this for path routing.',
    required: true,
  },
  labTestProductId: { type: 'string', title: 'Selected Junction Lab Test ID', description: 'Junction lab_test_id for the selected panel (empty for Option A upload)' },
  optionType:  { type: 'string',  title: 'Selected Option Type',  description: 'upload (Option A) or panel (Options B/C)' },
  optionTitle: { type: 'string',  title: 'Selected Option Title', description: 'Display name of the selected option' },
  optionPrice: { type: 'string',  title: 'Selected Option Price', description: 'Price string of the selected option, empty for Option A' },
  cartAdded:   { type: 'boolean', title: 'Cart Added',             description: 'True when Option B or C is added to cart' },
  skipLabPanelOrder: { type: 'boolean', title: 'Skip Strut lab order', description: 'True for Option A (upload). FinishOrderV2 must omit labPanelId / qty / price.' },
  labPanelId:  { type: 'number',  title: 'Strut lab panel id',     description: 'State-dependent Strut labPanelId for B/C (0 for Option A upload). Do not send on FinishOrderV2 for Option A.' },
  labPanelPrice:    { type: 'number', title: 'Lab panel unit price', description: 'UNIT price Strut charges. 0 for Option A. Do not send on FinishOrderV2 for Option A.' },
  labPanelQuantity: { type: 'number', title: 'Lab panel quantity',   description: 'Units Strut bills (B/C). 0 for Option A. Do not send on FinishOrderV2 for Option A.' },
};