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

const VIEWPORT_EDGE_PX = 16;

const LIST_Z_INDEX = 2147483647;



function isContinueControl(el: Element, trigger: HTMLElement): boolean {

  if (el === trigger || trigger.contains(el)) return false;

  const label = (el.textContent || '').replace(/\s+/g, ' ').trim();

  if (!/\bcontinue\b/i.test(label) || label.length > 48) return false;

  const { top, height, width } = el.getBoundingClientRect();

  return top > trigger.getBoundingClientRect().bottom && height >= 28 && width >= 72;

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

  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 400;

  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;



  const top = rect.bottom + LIST_GAP_PX;

  const spaceToBottom = viewportH - VIEWPORT_EDGE_PX - top;

  const maxHeight = Math.min(LIST_MAX_HEIGHT_PX, Math.max(0, spaceToBottom));



  const width = Math.min(rect.width, viewportW - VIEWPORT_EDGE_PX * 2);

  const left = Math.max(

    VIEWPORT_EDGE_PX,

    Math.min(rect.left, viewportW - width - VIEWPORT_EDGE_PX),

  );



  return { left, width, top, maxHeight };

}



function paintImperativeMenu(

  host: HTMLDivElement,

  panelRef: React.MutableRefObject<HTMLDivElement | null>,

  layout: MenuLayout,

  listId: string,

  selectedCode: string,

  onPick: (code: string) => void,

): void {

  host.replaceChildren();

  panelRef.current = null;



  const panel = document.createElement('div');

  panelRef.current = panel;

  Object.assign(panel.style, {

    position: 'fixed',

    left: `${layout.left}px`,

    top: `${layout.top}px`,

    width: `${layout.width}px`,

    height: `${layout.maxHeight}px`,

    maxHeight: `${layout.maxHeight}px`,

    boxSizing: 'border-box',

    zIndex: String(LIST_Z_INDEX),

    pointerEvents: 'auto',

    background: 'var(--pw-input-bg, #ffffff)',

    border: '1px solid var(--pw-input-border, #e2e8f0)',

    borderRadius: 'var(--pw-radius, 0.5rem)',

    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',

    overflow: 'hidden',

    display: 'flex',

    flexDirection: 'column',

    margin: '0',

  });



  const ul = document.createElement('ul');

  ul.id = listId;

  ul.setAttribute('role', 'listbox');

  ul.setAttribute('aria-label', 'State');

  Object.assign(ul.style, {

    margin: '0',

    padding: '0.25rem 0',

    listStyle: 'none',

    overflowY: 'auto',

    flex: '1',

    minHeight: '0',

    boxSizing: 'border-box',

    fontFamily: 'var(--pw-font-family-body, system-ui, sans-serif)',

    fontSize: 'var(--pw-font-size-body, 1rem)',

  });



  for (const s of STATES) {

    const isSelected = s.code === selectedCode;

    const li = document.createElement('li');

    li.setAttribute('role', 'presentation');



    const btn = document.createElement('button');

    btn.type = 'button';

    btn.setAttribute('role', 'option');

    btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');

    btn.textContent = s.name;

    Object.assign(btn.style, {

      display: 'block',

      width: '100%',

      boxSizing: 'border-box',

      padding: '0.5rem 0.75rem',

      border: 'none',

      background: isSelected ? 'var(--pw-surface-muted, #f1f5f9)' : 'transparent',

      color: 'var(--pw-input-fg, #0f172a)',

      textAlign: 'left',

      cursor: 'pointer',

      font: 'inherit',

    });

    btn.addEventListener('click', (e) => {

      e.stopPropagation();

      onPick(s.code);

    });



    li.appendChild(btn);

    ul.appendChild(li);

  }



  panel.appendChild(ul);

  host.appendChild(panel);

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

  const portalHostRef = useRef<HTMLDivElement | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);

  const listId = useRef(`pw-state-list-${Math.random().toString(36).slice(2, 9)}`).current;



  const selectedLabel = STATES.find((s) => s.code === value)?.name ?? '';



  const pick = useCallback((code: string) => {

    setValue(code);

    setOpen(false);

  }, []);



  useEffect(() => {

    onChange?.({ value });

  }, [value, onChange]);



  useEffect(() => {

    const host = document.createElement('div');

    host.setAttribute('data-pw-state-portal', listId);

    host.style.cssText = 'position:static;width:0;height:0;overflow:visible;';

    document.body.appendChild(host);

    portalHostRef.current = host;

    return () => {

      host.remove();

      portalHostRef.current = null;

      panelRef.current = null;

    };

  }, [listId]);



  const updateMenuLayout = useCallback(() => {

    if (!triggerRef.current) return;

    setMenuLayout(measureMenu(triggerRef.current));

  }, []);



  useLayoutEffect(() => {

    if (!open) {

      setMenuLayout(null);

      portalHostRef.current?.replaceChildren();

      panelRef.current = null;

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

    const host = portalHostRef.current;

    if (!open || !menuLayout || !host) return;

    paintImperativeMenu(host, panelRef, menuLayout, listId, value, pick);

  }, [open, menuLayout, listId, value, pick]);



  useEffect(() => {

    if (!open) return;

    const hidden: { el: HTMLElement; visibility: string; pointerEvents: string }[] = [];



    document.querySelectorAll('button, a, input[type="submit"], [role="button"]').forEach((el) => {

      if (!(el instanceof HTMLElement)) return;

      if (!triggerRef.current || !isContinueControl(el, triggerRef.current)) return;

      hidden.push({

        el,

        visibility: el.style.visibility,

        pointerEvents: el.style.pointerEvents,

      });

      el.style.visibility = 'hidden';

      el.style.pointerEvents = 'none';

    });



    return () => {

      hidden.forEach(({ el, visibility, pointerEvents }) => {

        el.style.visibility = visibility;

        el.style.pointerEvents = pointerEvents;

      });

    };

  }, [open]);



  useEffect(() => {

    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {

      const target = e.target as Node;

      if (rootRef.current?.contains(target)) return;

      if (panelRef.current?.contains(target)) return;

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

    </div>

  );

}


