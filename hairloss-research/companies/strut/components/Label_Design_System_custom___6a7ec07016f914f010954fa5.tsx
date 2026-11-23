export const propSchema = {
  label: { type: 'string', title: 'Title', defaultValue: "What's your phone number?" },
  sublabel: { type: 'string', title: 'Subtitle', defaultValue: "" },
};

export default function LabelBlock({
  label = "What's your phone number?",
  sublabel = "",
}: {
  label?: string;
  sublabel?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--pw-element-gap, 0.5rem)',
        padding: 20,
      }}
    >
      {label ? (
        <div
          style={{
            color: 'var(--pw-label-fg, #111827)',
            fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontWeight: 600,
          }}
        >
          {label}
        </div>
      ) : null}
      {sublabel ? (
        <div style={{ color: 'var(--pw-label-sublabel-fg, #6b7280)', fontSize: '0.875rem' }}>
          {sublabel}
        </div>
      ) : null}
    </div>
  );
}