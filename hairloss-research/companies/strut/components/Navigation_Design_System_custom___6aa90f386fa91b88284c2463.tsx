export default function NavigationButtonsBlock() {
  const flow = typeof window !== 'undefined' ? window.pathwai?.flow : undefined;
  const isFirstStep = flow?.isFirstStep() ?? true;
  const onBack = () => flow?.back();
  const onNext = () => flow?.next();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginTop: 'var(--pw-block-gap, 0.75rem)',
      }}
    >
      {!isFirstStep ? (
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '0.625rem 1.25rem',
            fontSize: 'var(--pw-font-size-body, 1rem)',
            fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
            color: 'var(--pw-color-on-surface, #0f172a)',
            background: 'transparent',
            border: '1px solid var(--pw-color-border, #e2e8f0)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            cursor: 'pointer',
          }}
        >
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        style={{
          padding: '0.625rem 1.5rem',
          fontSize: 'var(--pw-font-size-body, 1rem)',
          fontWeight: 600,
          fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
          color: 'var(--pw-button-fg, #ffffff)',
          background: 'var(--pw-button-bg, var(--pw-color-brand, #2563eb))',
          border: 'none',
          borderRadius: 'var(--pw-radius, 0.5rem)',
          cursor: 'pointer',
        }}
      >
        Continue
      </button>
    </div>
  );
}
