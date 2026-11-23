// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';

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

const LIST_GAP_PX = 8;
const LIST_MAX_HEIGHT_PX = 280;
const FALLBACK_FOOTER_RESERVE_PX = 120;
/** Max practical z-index so the list stays above PathwAI Continue / cart chrome. */
const LIST_Z_INDEX = 2147483646;

function findContinueTop(): number | null {
  if (typeof document === 'undefined') return null;
  let best: number | null = null;
  const nodes = document.querySelectorAll('button, a[role="button"], [role="button"]');
  nodes.forEach((el) => {
    const label = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!/^continue$/i.test(label)) return;
    const { top, height, width } = el.getBoundingClientRect();
    if (height < 24 || width < 80) return;
    if (top < window.innerHeight * 0.12) return;
    if (best == null || top < best) best = top;
  });
  return best;
}

function bottomCeilingPx(): number {
  const continueTop = findContinueTop();
  if (continueTop != null) return continueTop - LIST_GAP_PX;
  return window.innerHeight - FALLBACK_FOOTER_RESERVE_PX;
}

export const propSchema = {
  placeholder: { type: 'string', title: 'Placeholder', defaultValue: 'Select a state or territory...' },
};

export const outputSchema = {
  value: {
    type: 'string',
    title: 'State',
    description: 'The selected two-letter state code.',
    required: true,
  },
};

type MenuLayout = {
  left: number;
  width: number;
  top: number;
  maxHeight: number;
};

function measureMenu(trigger: HTMLElement): MenuLayout {
  const rect = trigger.getBoundingClientRect();
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 400;
  const ceiling = typeof window !== 'undefined' ? bottomCeilingPx() : viewportH - FALLBACK_FOOTER_RESERVE_PX;

  const spaceBelow = ceiling - rect.bottom - LIST_GAP_PX;
  const spaceAbove = rect.top - LIST_GAP_PX;
  const openUp = spaceBelow < 180 && spaceAbove > spaceBelow;

  let maxHeight = Math.max(
    120,
    Math.min(LIST_MAX_HEIGHT_PX, openUp ? spaceAbove : spaceBelow),
  );
  let top = openUp
    ? rect.top - maxHeight - LIST_GAP_PX
    : rect.bottom + LIST_GAP_PX;

  if (!openUp && top + maxHeight > ceiling) {
    maxHeight = Math.max(120, ceiling - top);
  }
  if (openUp) {
    top = Math.max(LIST_GAP_PX, top);
    maxHeight = Math.min(maxHeight, rect.top - LIST_GAP_PX * 2);
  }

  const width = Math.min(rect.width, viewportW - LIST_GAP_PX * 2);
  const left = Math.max(LIST_GAP_PX, Math.min(rect.left, viewportW - width - LIST_GAP_PX));

  return { left, width, top, maxHeight };
}

/** PathwAI preview panes use transform, which breaks fixed positioning unless the node is on body. */
function mountMenuOnBody(menu: HTMLDivElement, root: HTMLDivElement): () => void {
  const anchor = document.createComment('pw-state-menu');
  root.appendChild(anchor);
  document.body.appendChild(menu);
  return () => {
    if (anchor.parentNode) {
      anchor.parentNode.insertBefore(menu, anchor);
      anchor.remove();
    }
  };
}

export default function StateSelectorBlock({
  placeholder = 'Select a state or territory...',
  onChange,
}: {
  placeholder?: string;
  onChange?: (outputs: { value: string }) => void;
}) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [menuLayout, setMenuLayout] = useState<MenuLayout | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useRef(`pw-state-list-${Math.random().toString(36).slice(2, 9)}`).current;

  const selectedLabel = STATES.find((s) => s.code === value)?.name ?? '';

  useEffect(() => {
    onChange?.({ value });
  }, [value, onChange]);

  const updateMenuLayout = useCallback(() => {
    if (!triggerRef.current) return;
    setMenuLayout(measureMenu(triggerRef.current));
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuLayout(null);
      return;
    }
    updateMenuLayout();
    const onReflow = () => updateMenuLayout();
    window.addEventListener('resize', onReflow);
    window.addEventListener('scroll', onReflow, true);
    return () => {
      window.removeEventListener('resize', onReflow);
      window.removeEventListener('scroll', onReflow, true);
    };
  }, [open, updateMenuLayout]);

  useLayoutEffect(() => {
    if (!open || !menuRef.current || !rootRef.current) return;
    return mountMenuOnBody(menuRef.current, rootRef.current);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const pick = (code: string) => {
    setValue(code);
    setOpen(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.625rem 0.75rem',
    paddingRight: '2rem',
    fontSize: 'var(--pw-font-size-body, 1rem)',
    fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
    color: value ? 'var(--pw-input-fg, #0f172a)' : 'var(--pw-color-muted, #64748b)',
    background: 'var(--pw-input-bg, #ffffff)',
    border: '1px solid var(--pw-input-border, #e2e8f0)',
    borderRadius: 'var(--pw-radius, 0.5rem)',
    outline: 'none',
    textAlign: 'left',
    cursor: 'pointer',
  };

  return (
    <div
      ref={rootRef}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pw-element-gap, 0.5rem)' }}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-required
          aria-controls={open ? listId : undefined}
          onClick={() => setOpen((prev) => !prev)}
          style={inputStyle}
        >
          {value ? selectedLabel : placeholder}
        </button>
        <span
          aria-hidden
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
            transition: 'transform 0.15s ease',
            pointerEvents: 'none',
            color: 'var(--pw-color-muted, #64748b)',
            fontSize: '0.75rem',
          }}
        >
          ▼
        </span>
      </div>
      {open && menuLayout && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            left: menuLayout.left,
            top: menuLayout.top,
            width: menuLayout.width,
            maxHeight: menuLayout.maxHeight,
            boxSizing: 'border-box',
            zIndex: LIST_Z_INDEX,
            margin: 0,
            pointerEvents: 'auto',
            background: 'var(--pw-input-bg, #ffffff)',
            border: '1px solid var(--pw-input-border, #e2e8f0)',
            borderRadius: 'var(--pw-radius, 0.5rem)',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
            overflow: 'hidden',
          }}
        >
          <ul
            id={listId}
            role="listbox"
            aria-label="State"
            style={{
              margin: 0,
              padding: '0.25rem 0',
              listStyle: 'none',
              overflowY: 'auto',
              maxHeight: menuLayout.maxHeight,
              boxSizing: 'border-box',
              fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',
              fontSize: 'var(--pw-font-size-body, 1rem)',
            }}
          >
            {STATES.map((s) => {
              const selected = s.code === value;
              return (
                <li key={s.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => pick(s.code)}
                    style={{
                      display: 'block',
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.5rem 0.75rem',
                      border: 'none',
                      background: selected ? 'var(--pw-surface-muted, #f1f5f9)' : 'transparent',
                      color: 'var(--pw-input-fg, #0f172a)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      font: 'inherit',
                    }}
                  >
                    {s.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
