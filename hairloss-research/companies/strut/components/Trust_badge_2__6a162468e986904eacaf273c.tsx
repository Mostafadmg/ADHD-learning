import React, { useMemo } from 'react';

/**
 * TrustBadgeStars
 * A simplified trust badge component with hardcoded values.
 * Centered container with max-width and margin auto.
 */
export default function TrustBadgeStars() {
  // Hardcoded configuration
  const RATING = 4.8;
  const TEXT = 'Rated 4.8/5 by 5,000+ happy customers';
  const STAR_COLOR = 'var(--pw-color-brand, #2563eb)';
  const STAR_EMPTY_COLOR = 'var(--pw-color-border, #e2e8f0)';
  const TEXT_COLOR = 'var(--pw-color-muted, #64748b)';
  const FONT_SIZE = '13px';
  const STAR_SIZE = 16;
  const MAX_WIDTH = '480px';
  const GAP = '10px';

  const ratingClamped = Math.min(Math.max(RATING, 0), 5);
  
  // Generate stable unique ID for gradients to avoid collisions
  const instanceId = useMemo(() => Math.random().toString(36).substring(2, 9), []);

  const stars = Array.from({ length: 5 }).map((_, i) => {
    const diff = ratingClamped - i;
    const fillPercent = diff >= 1 ? 100 : diff > 0 ? diff * 100 : 0;
    const gradientId = `star-grad-${instanceId}-${i}`;

    return (
      <svg
        key={i}
        width={STAR_SIZE}
        height={STAR_SIZE}
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ flexShrink: 0, display: 'block' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset={`${fillPercent}%`} stopColor={STAR_COLOR} />
            <stop offset={`${fillPercent}%`} stopColor={STAR_EMPTY_COLOR} />
          </linearGradient>
        </defs>
        <path
          d="M12 2L14.85 8.77L22 9.64L16.5 14.49L18.18 21.5L12 17.77L5.82 21.5L7.5 14.49L2 9.64L9.15 8.77L12 2Z"
          fill={`url(#${gradientId})`}
        />
      </svg>
    );
  });

  return (
    <div 
      className="pw-motion-enter"
      style={{
        display: 'flex',
        flexDirection:'column',
        alignItems: 'left',
        justifyContent: 'center',
        gap: GAP,
        maxWidth: MAX_WIDTH,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '0',
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
        boxSizing: 'border-box',
        marginBottom: 'var(--pw-element-gap, 1rem)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pw-element-gap, 0.5rem)' }}>
        <div
          style={{
            color: '#111827',
            fontFamily: '',
            fontSize: '1.7rem',
            fontWeight: 600,
          }}
        >Ready to get Strut Mojo</div>
        <div style={{ color: '#6b7280', fontSize: '1rem' }}>
          Prescription Enclomiphene
        </div>
    </div>
      <div 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '2px',
          marginTop:'10px'
        }}
        aria-label={`Rating: ${ratingClamped} out of 5 stars`}
        role="img"
      >
        {stars}
      </div>
      {TEXT && (
        <span 
          style={{
            fontSize: FONT_SIZE,
            color: TEXT_COLOR,
            fontWeight: 'var(--pw-font-weight-body, 500)',
            lineHeight: 1.4,
          }}
        >
          {TEXT}
        </span>
      )}
    </div>
  );
}