import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Date-of-birth step for PathwAI flows that use startingCard instead of pathwai-strut-auth.
 * Matches the legacy checkout Year / Month / Day screen and saves through strut.saveDob
 * (auth/BirthDateValidation) on the flow event file.
 *
 * MOJO COPY (21 Oct 2026), copied from "DOB Card". Changes:
 * - No heading of its own: the flow's label block is the heading.
 * - Month / Day / Year order, one full-width Continue, no Back (the header arrow covers it),
 *   no side padding so it lines up with the rest of the screen.
 * - Under-18 check: a minor sees the old stop-screen wording and cannot continue; the date
 *   is not saved. Returning patients with a saved date still skip ahead (if 18 or older).
 */

const MIN_AGE = 18;
const UNDER_AGE_MESSAGE = 'Enclomiphene is only available for patients 18 and older through Strut Health.';

function ageOn(month: number, day: number, year: number, today = new Date()): number {
  let age = today.getFullYear() - year;
  const m = today.getMonth() + 1;
  if (m < month || (m === month && today.getDate() < day)) age -= 1;
  return age;
}

declare global {
  interface Window {
    strut?: {
      ENV?: { api: string };
      getToken?: () => string | null;
      getAccessUser?: () => { Id?: number; Email?: string } | null;
      getAuthParams?: () => { dob?: string; Id?: number; secureParam?: string } | null;
      saveDob?: (dateOfBirth: string) => Promise<unknown>;
    };
    pathwai?: {
      flow?: {
        next?: (val?: unknown) => void;
        back?: () => void;
        previous?: () => void;
      };
    };
  }
}

const BLOCK_ALIAS = 'block-strut-dob';

const MONTHS = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 },
];

type Props = {
  onChange?: (out: Record<string, unknown>) => void;
};

type ParsedDob = { month: number; day: number; year: number };

function apiBase(): string {
  const api = window.strut?.ENV?.api;
  if (!api) throw new Error('Strut SDK not loaded');
  return api.replace(/\/$/, '');
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function parseDob(raw: unknown): ParsedDob | null {
  if (raw == null || raw === false) return null;
  let text = '';
  if (typeof raw === 'string') text = raw.trim();
  else if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    const nested = obj.DateOfBirth || obj.dateOfBirth || obj.Birthday || obj.birthday || obj.dob;
    if (typeof nested === 'string') text = nested.trim();
  }
  if (!text) return null;
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return { year: Number(iso[1]), month: Number(iso[2]), day: Number(iso[3]) };
  const us = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (us) return { month: Number(us[1]), day: Number(us[2]), year: Number(us[3]) };
  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return { year: parsed.getFullYear(), month: parsed.getMonth() + 1, day: parsed.getDate() };
  }
  return null;
}

function toApiDob(month: number, day: number, year: number): string {
  return `${month}/${day}/${year}`;
}

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

function messageFrom(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const obj = data as { Message?: string; message?: string };
    return obj.Message || obj.message || fallback;
  }
  if (typeof data === 'string' && data.trim()) return data;
  return fallback;
}

async function fetchSavedDob(): Promise<ParsedDob | null> {
  const fromParams = parseDob(window.strut?.getAuthParams?.()?.dob);
  if (fromParams) return fromParams;
  const user = window.strut?.getAccessUser?.();
  const token = window.strut?.getToken?.();
  if (!user?.Id || !token) return null;
  try {
    const res = await fetch(
      `${apiBase()}/checkout/GetBirthDay?customerId=${encodeURIComponent(String(user.Id))}`,
      { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return null;
    return parseDob(await readBody(res));
  } catch {
    return null;
  }
}

const STYLES = `
.strut-dob {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 4px 0 8px;
  box-sizing: border-box;
  font-family: var(--pw-font-family-body, "Basis Grotesque Pro", ui-sans-serif, system-ui, -apple-system, sans-serif);
  color: #222222;
}
.strut-dob *, .strut-dob *::before, .strut-dob *::after { box-sizing: border-box; }
.strut-dob__wrap { width: 100%; }
.strut-dob__heading {
  margin: 0 0 21px;
  font-weight: 500;
  font-size: 28px;
  line-height: 1.15;
  letter-spacing: -0.5px;
  color: #222222;
}
.strut-dob__fields { display: flex; flex-wrap: nowrap; gap: 8px; }
.strut-dob__select { position: relative; height: 52px; flex: 1 1 0; min-width: 0; width: auto; }
.strut-dob__select--month { flex: 1.45 1 0; }
.strut-dob__select--year { flex: 1.1 1 0; }
.strut-dob__trigger {
  width: 100%;
  height: 52px;
  border: 1px solid var(--pw-color-border, #D4D4D8);
  border-radius: 10px;
  background: #fff;
  color: #161336;
  font: inherit;
  font-size: 14px;
  padding: 8px 10px 8px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  cursor: pointer;
  text-align: left;
}
.strut-dob__trigger span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
.strut-dob__trigger[data-placeholder="true"] { color: #707070; }
.strut-dob__trigger:disabled {
  background: #eeeeee;
  cursor: not-allowed;
}
.strut-dob__chevron {
  width: 8px;
  height: 8px;
  border-right: 2px solid #222;
  border-bottom: 2px solid #222;
  transform: rotate(45deg) translateY(-2px);
  flex: 0 0 auto;
}
.strut-dob__options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  z-index: 5;
}
.strut-dob__options li { margin: 0; padding: 0; }
.strut-dob__option {
  width: 100%;
  border: 0;
  background: #fff;
  color: #161336;
  font: inherit;
  font-size: 14px;
  text-align: left;
  padding: 8px 12px;
  cursor: pointer;
}
.strut-dob__option:hover,
.strut-dob__option[data-selected="true"] {
  background: var(--pw-button-bg, var(--pw-color-brand, #2563eb));
  color: #fff;
}
.strut-dob__error {
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fef2f2;
  color: #7f1d1d;
  font-size: 12px;
  line-height: 1.45;
}
.strut-dob__actions {
  display: flex;
  margin-top: 24px;
}
.strut-dob__btn {
  width: 50%;
  height: 44px;
  border-radius: 45px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.strut-dob__back {
  height: auto;
  padding: 0.625rem 1.5rem;
  font-size: var(--pw-font-size-body, 1rem);
  font-weight: 600;
  font-family: var(--pw-font-family-body, system-ui, sans-serif);
  color: var(--pw-button-fg, #ffffff);
  background: var(--pw-button-bg, var(--pw-color-brand, #2563eb));
  border: none;
  border-radius: var(--pw-radius, 0.5rem);
  cursor: pointer;
}
.strut-dob__continue {
  width: 100%;
  height: 48px;
  padding: 0 1.5rem;
  font-size: var(--pw-font-size-body, 1rem);
  font-weight: 600;
  font-family: var(--pw-font-family-body, system-ui, sans-serif);
  color: var(--pw-button-fg, #ffffff);
  background: var(--pw-button-bg, var(--pw-color-brand, #2563eb));
  border: none;
  border-radius: var(--pw-radius, 0.5rem);
  cursor: pointer;
}
.strut-dob__continue:disabled { opacity: 0.5; cursor: not-allowed; }
@media (max-width: 600px) {
  .strut-dob__btn { width: 100%; }
}
`;

export default function DOBCard({ onChange }: Props) {
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = currentYear; y >= 1900; y -= 1) list.push(y);
    return list;
  }, [currentYear]);

  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [open, setOpen] = useState<'year' | 'month' | 'day' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const advancedRef = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const dates = useMemo(() => {
    if (!month) return [];
    /* Before a year is picked, allow 29 Feb (2000 is a leap year); the effect below
       clears an impossible day once the year is known. */
    return Array.from({ length: daysInMonth(month, year || 2000) }, (_, i) => i + 1);
  }, [month, year]);

  const advance = useCallback((dob: string, age: number) => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    const payload = { dob, saved: true, age, isAdult: age >= MIN_AGE };
    onChangeRef.current?.(payload);
    try { window.pathwai?.flow?.next?.({ [BLOCK_ALIAS]: payload }); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const existing = await fetchSavedDob();
      if (cancelled) return;
      if (existing) {
        const age = ageOn(existing.month, existing.day, existing.year);
        if (age >= MIN_AGE) {
          advance(toApiDob(existing.month, existing.day, existing.year), age);
          return;
        }
        setMonth(existing.month);
        setDay(existing.day);
        setYear(existing.year);
        setError(UNDER_AGE_MESSAGE);
      }
      setVisible(true);
    })();
    return () => { cancelled = true; };
  }, [advance]);

  useEffect(() => {
    if (day && month && year && day > daysInMonth(month, year)) setDay(null);
  }, [day, month, year]);

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const monthName = MONTHS.find((item) => item.value === month)?.name || 'Month';

  const save = async () => {
    if (!month || !day || !year) return;
    setError(null);
    const age = ageOn(month, day, year);
    if (age < MIN_AGE) {
      setError(UNDER_AGE_MESSAGE);
      return;
    }
    if (!window.strut?.saveDob) {
      setError('Strut SDK not loaded');
      return;
    }
    if (!window.strut.getToken?.()) {
      setError('Sign in before entering your date of birth.');
      return;
    }
    setLoading(true);
    try {
      const dob = toApiDob(month, day, year);
      const ok = await window.strut.saveDob(dob);
      if (!ok) {
        setError('Date of Birth is not valid. Please enter a valid Date of Birth.');
        return;
      }
      advance(dob, age);
    } catch (e: any) {
      setError(messageFrom(e && e.body, e instanceof Error ? e.message : 'Date of Birth is not valid. Please enter a valid Date of Birth.'));
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="strut-dob" ref={rootRef}>
      <style>{STYLES}</style>
      <div className="strut-dob__wrap">
        <div className="strut-dob__fields">
          <div className="strut-dob__select strut-dob__select--month">
            <button
              type="button"
              className="strut-dob__trigger"
              data-placeholder={month == null}
              onClick={() => setOpen(open === 'month' ? null : 'month')}
            >
              <span>{monthName}</span>
              <span className="strut-dob__chevron" />
            </button>
            {open === 'month' ? (
              <ul className="strut-dob__options">
                {MONTHS.map((item) => (
                  <li key={item.value}>
                    <button
                      type="button"
                      className="strut-dob__option"
                      data-selected={item.value === month}
                      onClick={() => { setMonth(item.value); setOpen(null); }}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="strut-dob__select strut-dob__select--day">
            <button
              type="button"
              className="strut-dob__trigger"
              data-placeholder={day == null}
              disabled={!dates.length}
              onClick={() => setOpen(open === 'day' ? null : 'day')}
            >
              <span>{day ?? 'Day'}</span>
              <span className="strut-dob__chevron" />
            </button>
            {open === 'day' ? (
              <ul className="strut-dob__options">
                {dates.map((value) => (
                  <li key={value}>
                    <button
                      type="button"
                      className="strut-dob__option"
                      data-selected={value === day}
                      onClick={() => { setDay(value); setOpen(null); }}
                    >
                      {value}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="strut-dob__select strut-dob__select--year">
            <button
              type="button"
              className="strut-dob__trigger"
              data-placeholder={year == null}
              onClick={() => setOpen(open === 'year' ? null : 'year')}
            >
              <span>{year ?? 'Year'}</span>
              <span className="strut-dob__chevron" />
            </button>
            {open === 'year' ? (
              <ul className="strut-dob__options">
                {years.map((value) => (
                  <li key={value}>
                    <button
                      type="button"
                      className="strut-dob__option"
                      data-selected={value === year}
                      onClick={() => { setYear(value); setOpen(null); setError(null); }}
                    >
                      {value}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {error ? <div className="strut-dob__error" role="alert">{error}</div> : null}

        <div className="strut-dob__actions">
          <button
            type="button"
            className="strut-dob__btn strut-dob__continue"
            disabled={loading || !year || !month || !day}
            onClick={save}
          >
            {loading ? 'Please wait…' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export const propSchema = {};

export const outputSchema = {
  dob: { type: 'string', title: 'Date of birth (M/D/YYYY)' },
  saved: { type: 'boolean', title: 'Saved' },
  age: { type: 'number', title: 'Age in years' },
  isAdult: { type: 'boolean', title: '18 or older' },
};