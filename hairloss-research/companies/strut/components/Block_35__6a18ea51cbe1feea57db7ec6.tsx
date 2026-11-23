import React from 'react';

/* ============================================================
   TrustRowIcons
   ------------------------------------------------------------
   Slick trust row: circle-icon-label columns with thin dividers.
   Refined icons, proper responsive scaling, lavender tint.

   Scoped CSS prefix: tri-
============================================================ */

const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== 'string') return `rgba(0,0,0,${alpha})`;
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/* ============================================================
   ICON LIBRARY — refined custom paths, cleaner geometry
============================================================ */
const ICONS = {
  'shield-lock': (
    <>
      <path d="M12 2.5 4.5 5v6.2c0 4.6 3.2 8.1 7.5 9.8 4.3-1.7 7.5-5.2 7.5-9.8V5L12 2.5z" />
      <rect x="9.25" y="11" width="5.5" height="4.5" rx="0.75" />
      <path d="M10.5 11V9.75a1.5 1.5 0 0 1 3 0V11" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M12 2.5 4.5 5v6.2c0 4.6 3.2 8.1 7.5 9.8 4.3-1.7 7.5-5.2 7.5-9.8V5L12 2.5z" />
      <path d="m8.75 12 2.25 2.25 4.25-4.5" />
    </>
  ),
  'user-lock': (
    <>
      <circle cx="9.5" cy="7.5" r="3.5" />
      <path d="M3.5 20.5v-.5a6 6 0 0 1 6-6h1.75" />
      <rect x="14" y="14.5" width="6.5" height="6" rx="0.75" />
      <path d="M15.5 14.5v-1.25a1.75 1.75 0 0 1 3.5 0v1.25" />
    </>
  ),
  shield: (
    <path d="M12 2.5 4.5 5v6.2c0 4.6 3.2 8.1 7.5 9.8 4.3-1.7 7.5-5.2 7.5-9.8V5L12 2.5z" />
  ),
  lock: (
    <>
      <rect x="4.5" y="11" width="15" height="9" rx="1.5" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </>
  ),
  check: (
    <path d="M20 6.5 9.5 17 4 11.5" />
  ),
  star: (
    <path d="M12 3l2.6 5.85 6.4.55-4.85 4.25L17.6 20 12 16.9 6.4 20l1.45-6.35L3 9.4l6.4-.55L12 3z" />
  ),
  heart: (
    <path d="M12 20.5s-7.5-4.5-7.5-10a4.5 4.5 0 0 1 7.5-3.35A4.5 4.5 0 0 1 19.5 10.5c0 5.5-7.5 10-7.5 10z" />
  ),
  truck: (
    <>
      <path d="M3 17V6h11v11" />
      <path d="M14 9h3.5l3 4V17h-6.5" />
      <circle cx="7.5" cy="17.5" r="1.75" />
      <circle cx="16.5" cy="17.5" r="1.75" />
    </>
  ),
  doctor: (
    <>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 20.5v-1a7 7 0 0 1 14 0v1" />
      <path d="M9 14v3M12 17h-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  pill: (
    <>
      <rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-30 12 12)" />
      <path d="M9.5 7.25 14.5 16.75" />
    </>
  ),
};

const renderIcon = (name) => ICONS[name] || ICONS['shield-check'];

export default function TrustRowIcons({
  /* ===== COLUMN 1 ===== */
  col1Icon = 'shield-lock',
  col1Label = 'HIPAA Secure',

  /* ===== COLUMN 2 ===== */
  col2Icon = 'shield-check',
  col2Label = 'No Spam',

  /* ===== COLUMN 3 ===== */
  col3Icon = 'user-lock',
  col3Label = 'Secure Physician Communication',

  /* ===== OPTIONAL COLUMNS (empty hides) ===== */
  col4Icon = '',
  col4Label = '',
  col5Icon = '',
  col5Label = '',

  /* ===== STYLE OPTIONS ===== */
  showDividers = true,

  /* ===== THEME ===== */
  brandColor = '#161336',
  circleBgColor = '#F1EFF7',   // soft lavender default
  iconColor = '',              // empty = brand
  labelColor = '#1A1A2E',
  dividerColor = '#E5E5EC',

  /* ===== TYPOGRAPHY ===== */
  labelFontWeight = 500,

  /* ===== LAYOUT ===== */
  maxWidth = 672,
  paddingY = 28,
}) {
  const columns = [
    { icon: col1Icon, label: col1Label },
    { icon: col2Icon, label: col2Label },
    { icon: col3Icon, label: col3Label },
    { icon: col4Icon, label: col4Label },
    { icon: col5Icon, label: col5Label },
  ].filter(c => c.icon || c.label);

  if (columns.length === 0) return null;

  const resolvedIconColor = iconColor || brandColor;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap');

        .tri-root, .tri-root * { box-sizing: border-box; }
        .tri-root {
          --tri-brand: ${brandColor};
          --tri-circle-bg: ${circleBgColor};
          --tri-icon: ${resolvedIconColor};
          --tri-label: ${labelColor};
          --tri-divider: ${dividerColor};
          font-family: 'Figtree', system-ui, sans-serif;
          width: 100%;
          max-width: ${maxWidth}px;
          margin: 0 auto;
          padding: ${paddingY}px 16px;
        }

        .tri-grid {
          display: grid;
          grid-template-columns: repeat(${columns.length}, 1fr);
          align-items: start;
          gap: 0;
        }

        .tri-col {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          text-align: center;
          padding: 0 12px;
          min-width: 0;
        }

        ${showDividers ? `
        .tri-col + .tri-col::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 1px;
          background: var(--tri-divider);
        }
        ` : ''}

        .tri-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--tri-circle-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          flex-shrink: 0;
        }

        .tri-icon {
          width: 32px;
          height: 32px;
          stroke: var(--tri-icon);
          fill: none;
          stroke-width: 1.75;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .tri-label {
          font-family: 'Figtree', sans-serif;
          font-size: 14px;
          font-weight: ${labelFontWeight};
          line-height: 1.4;
          color: var(--tri-label);
          margin: 0;
          letter-spacing: -0.005em;
          word-wrap: break-word;
          hyphens: auto;
        }

        /* ===== TIER 5: <=340 (small phones) ===== */
        @media (max-width: 340px) {
          .tri-root { padding: 14px 4px; }
          .tri-col { padding: 0 4px; }
          .tri-circle { width: 44px; height: 44px; margin-bottom: 8px; }
          .tri-icon { width: 20px; height: 20px; stroke-width: 1.85; }
          .tri-label { font-size: 10.5px; line-height: 1.3; }
        }

        /* ===== TIER 4: 341-380 ===== */
        @media (max-width: 380px) and (min-width: 341px) {
          .tri-root { padding: 16px 6px; }
          .tri-col { padding: 0 6px; }
          .tri-circle { width: 48px; height: 48px; margin-bottom: 9px; }
          .tri-icon { width: 22px; height: 22px; stroke-width: 1.85; }
          .tri-label { font-size: 11px; line-height: 1.3; }
        }

        /* ===== TIER 3: 381-499 (most mobile) ===== */
        @media (max-width: 499px) and (min-width: 381px) {
          .tri-root { padding: 18px 8px; }
          .tri-col { padding: 0 8px; }
          .tri-circle { width: 54px; height: 54px; margin-bottom: 10px; }
          .tri-icon { width: 24px; height: 24px; }
          .tri-label { font-size: 12px; line-height: 1.35; }
        }

        /* ===== TIER 3b: 500-599 (large mobile/small tablet) ===== */
        @media (max-width: 599px) and (min-width: 500px) {
          .tri-root { padding: 20px 10px; }
          .tri-col { padding: 0 10px; }
          .tri-circle { width: 60px; height: 60px; margin-bottom: 11px; }
          .tri-icon { width: 26px; height: 26px; }
          .tri-label { font-size: 13px; }
        }

        /* ===== TIER 2: 600-899 (tablet) ===== */
        @media (min-width: 600px) and (max-width: 899px) {
          .tri-root { padding: 24px 14px; }
          .tri-col { padding: 0 12px; }
          .tri-circle { width: 66px; height: 66px; margin-bottom: 13px; }
          .tri-icon { width: 30px; height: 30px; }
          .tri-label { font-size: 13.5px; }
        }

        /* ===== TIER 1: >=900 (desktop) ===== */
        @media (min-width: 900px) {
          .tri-root { padding: ${paddingY}px 16px; }
          .tri-circle { width: 72px; height: 72px; margin-bottom: 14px; }
          .tri-icon { width: 32px; height: 32px; }
          .tri-label { font-size: 14px; }
        }
      `}</style>

      <div className="tri-root" role="list" aria-label="Trust indicators">
        <div className="tri-grid">
          {columns.map((col, idx) => (
            <div className="tri-col" key={idx} role="listitem">
              {col.icon && (
                <div className="tri-circle" aria-hidden="true">
                  <svg className="tri-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {renderIcon(col.icon)}
                  </svg>
                </div>
              )}
              {col.label && <p className="tri-label">{col.label}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ============================================================
   PROP SCHEMA
============================================================ */

const ICON_OPTIONS = [
  'shield-lock',
  'shield-check',
  'user-lock',
  'shield',
  'lock',
  'check',
  'star',
  'heart',
  'truck',
  'doctor',
  'clock',
  'pill',
];

export const propSchema = {
  /* ===== COLUMN 1 ===== */
  col1Icon: { type: 'enum', title: 'Column 1 Icon', defaultValue: 'shield-lock', options: ICON_OPTIONS },
  col1Label: { type: 'string', title: 'Column 1 Label', defaultValue: 'HIPAA Secure' },

  /* ===== COLUMN 2 ===== */
  col2Icon: { type: 'enum', title: 'Column 2 Icon', defaultValue: 'shield-check', options: ICON_OPTIONS },
  col2Label: { type: 'string', title: 'Column 2 Label', defaultValue: 'No Spam' },

  /* ===== COLUMN 3 ===== */
  col3Icon: { type: 'enum', title: 'Column 3 Icon', defaultValue: 'user-lock', options: ICON_OPTIONS },
  col3Label: { type: 'string', title: 'Column 3 Label', defaultValue: 'Secure Physician Communication' },

  /* ===== COLUMN 4 (empty hides) ===== */
  col4Icon: { type: 'enum', title: 'Column 4 Icon (empty hides)', defaultValue: '', options: ['', ...ICON_OPTIONS] },
  col4Label: { type: 'string', title: 'Column 4 Label', defaultValue: '' },

  /* ===== COLUMN 5 (empty hides) ===== */
  col5Icon: { type: 'enum', title: 'Column 5 Icon (empty hides)', defaultValue: '', options: ['', ...ICON_OPTIONS] },
  col5Label: { type: 'string', title: 'Column 5 Label', defaultValue: '' },

  /* ===== STYLE ===== */
  showDividers: { type: 'boolean', title: 'Show Dividers Between Columns', defaultValue: true },

  /* ===== THEME ===== */
  brandColor: { type: 'color', title: 'Brand Color (icons)', defaultValue: '#161336' },
  circleBgColor: { type: 'color', title: 'Circle Background', defaultValue: '#F1EFF7' },
  iconColor: { type: 'color', title: 'Icon Color (empty = brand)', defaultValue: '' },
  labelColor: { type: 'color', title: 'Label Color', defaultValue: '#1A1A2E' },
  dividerColor: { type: 'color', title: 'Divider Color', defaultValue: '#E5E5EC' },

  /* ===== TYPOGRAPHY ===== */
  labelFontWeight: { type: 'enum', title: 'Label Font Weight', defaultValue: 500, options: [400, 500, 600, 700] },

  /* ===== LAYOUT ===== */
  maxWidth: { type: 'number', title: 'Max Width (px)', defaultValue: 672, min: 320, max: 1200, step: 8 },
  paddingY: { type: 'number', title: 'Vertical Padding (Desktop)', defaultValue: 28, min: 0, max: 60, step: 2 },
};

export const outputSchema = { type: 'object', fields: {} };