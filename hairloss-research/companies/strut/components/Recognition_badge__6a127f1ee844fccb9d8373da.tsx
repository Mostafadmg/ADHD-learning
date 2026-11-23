import React from 'react';

export default function TrustBadgeRow() {
  const iconColor = 'var(--pw-color-muted, #6B7280)';
  const textColor = 'var(--pw-color-muted, #6B7280)';
  const iconSize = 16;

  const badges = [
    {
      label: "HIPAA Compliant",
      icon: (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M12 2L4 5v6c0 5.55 3.5 9.74 8 11 4.5-1.26 8-5.45 8-11V5l-8-3z" />
        </svg>
      )
    },
    {
      label: "SSL Secure Checkout",
      icon: (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      )
    },
    {
      label: "LegitScript Certified",
      icon: (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>
      )
    }
  ];

  return (
    <div 
      className="pw-motion-enter"
      style={{
        width: '100%',
        maxWidth: '480px',
        marginTop: '0px', // Reduced top whitespace by half as requested
        marginBottom: '8px',
        marginLeft: 'auto',
        marginRight:'auto',
        boxSizing: 'border-box',
        fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {badges.map((badge, i) => (
          <div 
            key={i} 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: 0,
            }}
          >
            {badge.icon}
            <span style={{
              fontSize: '11px',
              fontWeight: 500,
              color: textColor,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
            }}>
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}