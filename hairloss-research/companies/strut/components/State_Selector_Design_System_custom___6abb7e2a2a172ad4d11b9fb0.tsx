import { useState, useEffect } from 'react';

const STATES: { code: string; name: string }[] = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' }, { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' }, { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' }, { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' }, { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' }, { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' }, { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' }, { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

export const propSchema = {
  placeholder: { type: 'string', title: 'Placeholder', defaultValue: "Select a state or territory..." },
};

export const outputSchema = {
  value: { type: 'string', title: 'State', description: 'The selected two-letter state code.' },
};

export default function StateSelectorBlock({
  placeholder = "Select a state or territory...",
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pw-element-gap, 0.5rem)' }}>
      <select
        value={value}
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
          zIndex:100
        }}
      >
        <option value="">{placeholder}</option>
        {STATES.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
