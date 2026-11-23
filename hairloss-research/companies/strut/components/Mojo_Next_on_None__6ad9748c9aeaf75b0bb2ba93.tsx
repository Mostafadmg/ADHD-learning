// PathwAI host provides React at runtime; this folder has no node_modules.
// @ts-ignore
import React, { useEffect, useRef } from 'react';

/**
 * Mojo: Next on None (21 Oct 2026)
 *
 * Put this block on a screen with one multi-select question. When the patient picks
 * "None of the above", the screen moves on by itself, the way a single-select screen does.
 * Picking any other option leaves the screen alone: they press Continue as usual.
 *
 * PathwAI's own "Advance after the user picks an option" only works on single-select
 * screens, which is why this block exists. It moves on by submitting the screen's form
 * (same as pressing Continue), so the answer is saved the normal way. It shows nothing.
 */

export default function MojoNextOnNone({
  optionText = 'None of the above',
  delayMs = 250,
}: {
  optionText?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let done = false;
    let timer: any = null;
    const onClick = (e: MouseEvent) => {
      const here = ref.current;
      const btn = (e.target as HTMLElement | null)?.closest?.('button[aria-pressed]') as HTMLElement | null;
      if (done || !here || !btn) return;
      if ((btn.textContent || '').trim() !== optionText) return;
      /* Only this screen: the click must be inside the same form as this block. */
      const form = here.closest('form');
      if (form ? !form.contains(btn) : !here.parentElement?.parentElement?.contains(btn)) return;
      clearTimeout(timer);
      /* Wait for the answer to register, then move on only if None is now picked
         (a second tap un-picks it). */
      timer = setTimeout(() => {
        if (done || !btn.isConnected || btn.getAttribute('aria-pressed') !== 'true') return;
        done = true;
        if (form && typeof (form as HTMLFormElement).requestSubmit === 'function') (form as HTMLFormElement).requestSubmit();
        else (window as any).pathwai?.flow?.next?.();
      }, Number(delayMs) || 0);
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      clearTimeout(timer);
    };
  }, [optionText, delayMs]);

  return <div ref={ref} aria-hidden="true" style={{ height: 0, overflow: 'hidden' }} />;
}

export const propSchema = {
  optionText: { type: 'string', title: 'Option that moves on by itself', defaultValue: 'None of the above' },
  delayMs: { type: 'number', title: 'Delay before moving on (ms)', defaultValue: 250, min: 0, step: 50 },
};

export const outputSchema = {};
