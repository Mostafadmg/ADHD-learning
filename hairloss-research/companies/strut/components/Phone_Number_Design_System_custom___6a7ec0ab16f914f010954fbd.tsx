import { useState, useEffect } from 'react';

export const propSchema = {
  placeholder: { type: 'string', title: 'Placeholder', defaultValue: "Enter phone number..." },
};

export const outputSchema = {
  value: { type: 'string', title: 'Answer', description: 'The value the respondent entered.' },
};

export default function PhoneBlock({
  placeholder = "Enter phone number...",
  onChange,
}: {
  placeholder?: string;
  onChange?: (outputs: { value: string }) => void;
}) {
  const [value, setValue] = useState('');

  useEffect(() => {
    onChange?.({ value });
  }, [value, onChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pw-element-gap, 0.5rem)', padding: 20 }}>
      <input
        type="tel"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '0.625rem 0.75rem',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
            color: 'var(--pw-input-fg, #0f172a)',
            background: 'var(--pw-input-bg, #ffffff)',
            border: '1px solid var(--pw-input-border, #e2e8f0)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            outline: 'none',
          }}
      />
    </div>
  );
}