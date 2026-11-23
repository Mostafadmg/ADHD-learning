import React from 'react';

/**
 * A simplified, hard-coded Badge component.
 * Aligned to the start (left) of the content column using standard flexbox.
 */
export default function Badge() {
  return (
    <div
      className="pw-motion-enter"
      style={{
        display: 'flex',
        width: '100%',
        // Standard flex-start ensures it stays within the content column's bounds
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 'var(--pw-element-gap, 12px) 0',
        boxSizing: 'border-box',
        maxWidth: '480px',
          marginRight:'auto',
        marginLeft:'auto'
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--pw-color-brand, #c4697c)',
          color: 'var(--pw-color-brand-contrast, #ffffff)',
          padding: '4px 10px',
          borderRadius: 'var(--pw-radius, 4px)',
          fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.02em',
          lineHeight: '1.2',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          boxShadow: 'var(--pw-shadow, none)',
          textTransform: 'none',
          
        }}
      >
        Medical questionnaire
      </span>
    </div>
  );
}