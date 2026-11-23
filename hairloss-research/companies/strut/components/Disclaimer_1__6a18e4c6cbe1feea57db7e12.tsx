import React from 'react';

/* ============================================================
   DisclaimerNote
   ------------------------------------------------------------
   A compact inline notice block: icon + short text on a tinted
   background. Useful for compliance notes, warnings, success
   confirmations, or neutral info callouts.

   Scoped CSS prefix: pdn-
   Design system: Plus Jakarta Sans body, Figtree headings.
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

export default function DisclaimerNote({
  /* ===== CONTENT ===== */
  text = 'Please note: medication cannot be shipped until required labs have been completed and medically approved.',
  icon = 'info', // 'info' | 'warning' | 'shield' | 'lock' | 'check'

  /* ===== VARIANT ===== */
  variant = 'brand', // 'brand' | 'warning' | 'success' | 'neutral'

  /* ===== THEME ===== */
  brandColor = '#161336',
  textColor = '#0F1714',
  warningColor = '#B45309', // amber-ish
  successColor = '#1F6638', // green-ish
  neutralColor = '#6B7670',

  /* ===== LAYOUT ===== */
  borderRadius = 6,
  fontSize = 12.5,
  showIcon = true,
  marginTop = null,    // null = use responsive defaults, number = override (px)
  marginBottom = null, // null = use responsive defaults, number = override (px)
}) {
  /* Variant color resolution */
  const VARIANT_COLORS = {
    brand: brandColor,
    warning: warningColor,
    success: successColor,
    neutral: neutralColor,
  };
  const accentColor = VARIANT_COLORS[variant] || brandColor;

  const renderIcon = (iconName) => {
    if (iconName === 'info') {
      return (
        <svg className="pdn-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M12 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1" fill="currentColor" />
        </svg>
      );
    }
    if (iconName === 'warning') {
      return (
        <svg className="pdn-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L22 20H2L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M12 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      );
    }
    if (iconName === 'shield') {
      return (
        <svg className="pdn-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 1L3 5V11C3 16.55 7.84 21.74 12 23C16.16 21.74 21 16.55 21 11V5L12 1Z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    }
    if (iconName === 'lock') {
      return (
        <svg className="pdn-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 11H5C3.9 11 3 11.9 3 13V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V13C21 11.9 20.1 11 19 11ZM19 13V11C19 9.34 17.66 8 16 8H8C6.34 8 5 9.34 5 11V13H19Z"
            stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    }
    if (iconName === 'check') {
      return (
        <svg className="pdn-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M7 12L10.5 15.5L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return null;
  };

  if (!text) return null;

  /* Margin overrides (null = use responsive CSS defaults) */
  const rootStyle = {};
  if (marginTop !== null && marginTop !== undefined) rootStyle.marginTop = `${marginTop}px`;
  if (marginBottom !== null && marginBottom !== undefined) rootStyle.marginBottom = `${marginBottom}px`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .pdn-root, .pdn-root * { box-sizing: border-box; }
        .pdn-root {
          --pdn-accent: ${accentColor};
          --pdn-text: ${textColor};
          --pdn-radius: ${borderRadius}px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          width: 100%;
          max-width: 460px;
          margin: 16px auto;
        }

        .pdn-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: ${hexToRgba(accentColor, 0.06)};
          color: var(--pdn-text);
          padding: 12px 14px;
          border-radius: var(--pdn-radius);
        }

        .pdn-icon {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          color: var(--pdn-accent);
          margin-top: 2px;
        }

        .pdn-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: ${fontSize}px;
          font-weight: 500;
          line-height: 1.5;
          color: var(--pdn-text);
          margin: 0;
        }

        /* ===== TIER 5: <=340 ===== */
        @media (max-width: 340px) {
          .pdn-root { margin: 10px auto; }
          .pdn-note { padding: 10px 12px; gap: 8px; }
          .pdn-icon { width: 14px; height: 14px; }
        }

        /* ===== TIER 4: 341-380 ===== */
        @media (max-width: 380px) and (min-width: 341px) {
          .pdn-root { margin: 12px auto; }
        }

        /* ===== TIER 3: 381-599 ===== */
        @media (max-width: 599px) and (min-width: 381px) {
          .pdn-root { margin: 12px auto; }
        }

        /* ===== TIER 2: 600-899 ===== */
        @media (min-width: 600px) {
          .pdn-root { max-width: 480px; margin: 16px auto; }
        }

        /* ===== TIER 1: >=900 ===== */
        @media (min-width: 900px) {
          .pdn-root { max-width: 672px; margin: 20px auto; }
        }
      `}</style>

      <div className="pdn-root" style={rootStyle}>
        <div className="pdn-note" role="note">
          {showIcon && renderIcon(icon)}
          <p className="pdn-text">{text}</p>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   PROP SCHEMA
============================================================ */

export const propSchema = {
  /* ===== CONTENT ===== */
  text: {
    type: 'string',
    title: 'Disclaimer Text',
    defaultValue: 'Please note: medication cannot be shipped until required labs have been completed and medically approved.',
  },
  icon: {
    type: 'enum',
    title: 'Icon',
    defaultValue: 'info',
    options: ['info', 'warning', 'shield', 'lock', 'check'],
  },
  showIcon: { type: 'boolean', title: 'Show Icon', defaultValue: true },

  /* ===== VARIANT ===== */
  variant: {
    type: 'enum',
    title: 'Variant (color theme)',
    defaultValue: 'brand',
    options: ['brand', 'warning', 'success', 'neutral'],
  },

  /* ===== THEME ===== */
  brandColor: { type: 'color', title: 'Brand Color (used when variant = brand)', defaultValue: '#161336' },
  textColor: { type: 'color', title: 'Text Color', defaultValue: '#0F1714' },
  warningColor: { type: 'color', title: 'Warning Color (used when variant = warning)', defaultValue: '#B45309' },
  successColor: { type: 'color', title: 'Success Color (used when variant = success)', defaultValue: '#1F6638' },
  neutralColor: { type: 'color', title: 'Neutral Color (used when variant = neutral)', defaultValue: '#6B7670' },

  /* ===== LAYOUT ===== */
  borderRadius: { type: 'number', title: 'Border Radius', defaultValue: 6, min: 0, max: 24, step: 1 },
  fontSize: { type: 'number', title: 'Font Size (px)', defaultValue: 12.5, min: 10, max: 18, step: 0.5 },
  marginTop: {
    type: 'number',
    title: 'Margin Top Override (px) -- leave blank for responsive default',
    defaultValue: null,
    min: 0,
    max: 80,
    step: 2,
  },
  marginBottom: {
    type: 'number',
    title: 'Margin Bottom Override (px) -- leave blank for responsive default',
    defaultValue: null,
    min: 0,
    max: 80,
    step: 2,
  },
};

export const outputSchema = {
  type: 'null',
};