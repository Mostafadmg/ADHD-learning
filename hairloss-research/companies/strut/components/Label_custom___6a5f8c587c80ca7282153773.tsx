export const propSchema = {
  label: { type: 'string', title: 'Title', defaultValue: "Ready to get Strut Mojo" },
  sublabel: { type: 'string', title: 'Subtitle', defaultValue: "Prescription Strength Enclomiphene" },
};

export default function LabelBlock({
  label = "",
  sublabel = "Prescription Strength Enclomiphene",
}: {
  label?: string;
  sublabel?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pw-element-gap, 0.5rem)' }}>
      {label ? (
        <div
          style={{
            color: 'var(--pw-label-fg, #111827)',
            fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 600,
          }}
        >
          Ready to get Strut Mojo        </div>
      ) : null}
        <div style={{ color: 'var(--pw-label-sublabel-fg, #6b7280)', fontSize: '0.875rem' }}>
          Prescription Strength Enclomiphene
        </div>
    </div>
  );
}
