import React, { useCallback, useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    strut: {
      ENV: { api: string };
      LS: { ACCESS_TOKEN: string };
      getToken: () => string | null;
      loginWithPassword: (email: string, password: string) => Promise<{ isVerifyAccount?: boolean; accessUser?: unknown }>;
      signup: (
        email: string,
        password: string,
        phone: string,
        opts?: { firstName?: string; lastName?: string; gender?: number }
      ) => Promise<{ Id?: number; Email?: string }>;
      saveDob: (dateOfBirth: string) => Promise<unknown>;
      getCurrentVisiting: () => Promise<unknown>;
      hasPasswordAndBirthday: (email: string) => Promise<{ HasPassword: boolean; HasBirthDate: boolean }>;
      getAccessUser: () => { Id?: number; Email?: string; UserName?: string; IsVerifyAccount?: boolean } | null;
    };
    google?: {
      accounts?: {
        id?: { initialize: (opts: unknown) => void; renderButton: (el: HTMLElement | null, opts: unknown) => void };
        oauth2?: {
          initTokenClient: (opts: {
            client_id: string;
            scope: string;
            callback: (resp: { access_token?: string; error?: string }) => void;
            error_callback?: (err: unknown) => void;
          }) => { requestAccessToken: (opts?: unknown) => void };
        };
      };
    };
    pathwai?: {
      flow?: { getAnswers: () => Record<string, unknown>; next: (val?: unknown) => void };
      user?: {
        getUser: () => { profile?: { phone?: string; firstName?: string; lastName?: string } };
        mergeProfile?: (partial: { email?: string; firstName?: string; lastName?: string; phone?: string; address?: Record<string, unknown> }) => void;
      };
    };
    pwPushGtm?: (event: string, data: any) => void;
    dataLayer?: any[];
    __STRUT_PRODUCT_NAME__?: string;
  }
}

const PHONE_NODE_ID = 'node-1779911375525';
const SEX_NODE_ID = 'node-6-sex-assigned';
const GOOGLE_CLIENT_ID = '491126416714-do0jmia9i1bpui7158ld1k7top3uahpp.apps.googleusercontent.com';
const BIRTHDAY_SCOPE = 'https://www.googleapis.com/auth/user.birthday.read';

function genderText(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  const parts = raw.split('::');
  return ((parts.length > 1 ? parts[1] : parts[0]) || '').toLowerCase();
}

function resolveGenderText(answers: Record<string, unknown>): string {
  const direct = genderText(answers[SEX_NODE_ID]);
  if (direct === 'male' || direct === 'female') return direct;
  for (const v of Object.values(answers)) {
    const g = genderText(v);
    if (g === 'male' || g === 'female') return g;
  }
  return '';
}

function genderToStrut(text: string): number {
  if (text === 'male') return 1;
  if (text === 'female') return 2;
  return 0;
}

function toApiDob(iso: string): string {
  const [y, m, d] = (iso || '').split('-');
  if (!y || !m || !d) return '';
  return `${Number(m)}/${Number(d)}/${y}`;
}

function normalizeDob(raw: unknown): string {
  if (typeof raw !== 'string' || !raw) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return `${m[3]}-${String(m[1]).padStart(2, '0')}-${String(m[2]).padStart(2, '0')}`;
  return '';
}

async function fetchCustomerInfo(): Promise<Record<string, any> | null> {
  try {
    const order = await window.strut.getCurrentVisiting().catch(() => null);
    const customerId = (order && (order as any).CustomerId) || window.strut.getAccessUser?.()?.Id;
    if (!customerId) return null;
    const token = window.strut.getToken?.();
    const res = await fetch(
      `${window.strut.ENV.api}/checkout/GetCustomerInfo?customerId=${encodeURIComponent(String(customerId))}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function decodeGoogleCredential(credential: string): any {
  const parts = (credential || '').split('.');
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && Date.now() / 1000 >= payload.exp;
  } catch {
    return false;
  }
}

async function strutPost(path: string, body: Record<string, unknown>, token?: string | null): Promise<any> {
  const headers: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${window.strut.ENV.api}/${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await res.text();
  let data: any; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error((data && data.Message) || `${path} → ${res.status}`);
  return data;
}

function storeAccessUser(accessUser: unknown): void {
  try { localStorage.setItem(window.strut.LS.ACCESS_TOKEN, JSON.stringify(accessUser)); } catch { /* ignore */ }
}

async function socialLogin(googleId: string, email: string): Promise<any | null> {
  try {
    // New Google users: skip LoginBySocial (avoids a failed login during signup)
    const existsRes = await fetch(
      `${window.strut.ENV.api}/auth/CheckAccountExistsBySocial?id=${encodeURIComponent(googleId)}`,
      { headers: { Accept: 'application/json' } }
    );
    if (existsRes.ok) {
      const exists = await existsRes.json();
      if (!exists) return null;
    }

    const res = await strutPost('auth/LoginBySocial', { SocialId: googleId, UserName: email });
    if (res && res.isVerifyAccount && res.accessUser) {
      storeAccessUser(res.accessUser);
      return res.accessUser;
    }
    return null;
  } catch {
    return null;
  }
}

async function socialSignup(opts: { email: string; firstName: string; lastName: string; googleId: string; phone: string; gender: number }): Promise<any> {
  const su = await strutPost('auth/SignUpWithSocial', {
    FirstName: opts.firstName, LastName: opts.lastName, Email: opts.email, GoogleId: opts.googleId, FaceBookId: '',
  });
  if (!su || !su.Id) throw new Error('Could not create your account with Google.');
  const user = await fetch(
    `${window.strut.ENV.api}/auth/SetVerifyIdentity?id=${su.Id}&secureParam=${encodeURIComponent(su.secureParam)}`,
    { method: 'PUT', headers: { Accept: 'application/json', 'Content-Length': '0' } }
  ).then((r) => r.json());
  storeAccessUser(user);
  const token = (user && user.AccessToken && user.AccessToken.Token) || window.strut.getToken?.();
  const pw = `G${Math.random().toString(36).slice(2)}A1!`;
  await strutPost('auth/CompleteAccount', {
    SecureParam: su.secureParam, FirstName: opts.firstName, LastName: opts.lastName, Email: opts.email,
    Password: pw, ConfirmPassword: pw, Phone: opts.phone, Gender: opts.gender,
  }, token);
  return user;
}

/** Request OAuth access token with birthday scope (People API). */
function requestBirthdayAccessToken(): Promise<string | null> {
  return new Promise((resolve) => {
    const oauth2 = window.google?.accounts?.oauth2;
    if (!oauth2?.initTokenClient) {
      resolve(null);
      return;
    }
    try {
      const tokenClient = oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: BIRTHDAY_SCOPE,
        callback: (tokenResponse) => {
          if (tokenResponse && !tokenResponse.error && tokenResponse.access_token) {
            resolve(tokenResponse.access_token);
          } else {
            resolve(null);
          }
        },
        error_callback: () => resolve(null),
      });
      tokenClient.requestAccessToken();
    } catch {
      resolve(null);
    }
  });
}

/** Fetch DOB from Google People API. Returns YYYY-MM-DD when year+month+day are present. */
async function fetchGoogleBirthdayIso(accessToken: string | null): Promise<string> {
  if (!accessToken) return '';
  try {
    const res = await fetch('https://people.googleapis.com/v1/people/me?personFields=birthdays', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return '';
    const data = await res.json();
    const birthdays = Array.isArray(data?.birthdays) ? data.birthdays : [];
    for (const birthday of birthdays) {
      const date = birthday?.date;
      if (!date || date.year == null || date.month == null || date.day == null) continue;
      const y = String(date.year);
      const m = String(date.month).padStart(2, '0');
      const d = String(date.day).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return '';
  } catch {
    return '';
  }
}

function resolvePhone(): string {
  const answers = window.pathwai?.flow?.getAnswers?.() || {};
  const fromAnswer = answers[PHONE_NODE_ID];
  if (typeof fromAnswer === 'string' && fromAnswer.trim()) return fromAnswer.trim();
  const fromProfile = window.pathwai?.user?.getUser?.()?.profile?.phone;
  if (typeof fromProfile === 'string' && fromProfile.trim()) return fromProfile.trim();
  const guess = Object.values(answers).find(
    (val) => typeof val === 'string' && /^[\d\s\-\+\(\)]{7,}$/.test(val)
  );
  return typeof guess === 'string' ? guess.trim() : '';
}

type Props = {
  onChange?: (out: Record<string, unknown>) => void;
  defaultMode?: string;
};

const STYLES = `
@keyframes strutAuthIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.strut-auth {
  --sa-brand: var(--pw-color-brand, #0f766e);
  --sa-brand-soft: var(--pw-color-brand-surface, rgba(15, 118, 110, 0.08));
  --sa-surface: var(--pw-color-surface, #ffffff);
  --sa-on-surface: var(--pw-color-on-surface, #111827);
  --sa-muted: var(--pw-color-muted, #6b7280);
  --sa-border: var(--pw-color-border, #e5e7eb);
  --sa-input-bg: var(--pw-input-bg, #f8fafc);
  --sa-input-fg: var(--pw-input-fg, #111827);
  --sa-btn-bg: var(--pw-button-bg, #0f766e);
  --sa-btn-fg: var(--pw-button-fg, #ffffff);
  --sa-radius: var(--pw-radius, 16px);
  --sa-shadow: var(--pw-shadow, 0 8px 32px rgba(15, 23, 42, 0.08));
  position: relative;
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--pw-font-family-body, ui-sans-serif, system-ui, -apple-system, sans-serif);
  background:
    radial-gradient(120% 80% at 10% 0%, var(--sa-brand-soft), transparent 55%),
    radial-gradient(90% 60% at 100% 100%, color-mix(in srgb, var(--sa-brand) 6%, transparent), transparent 50%);
}
.strut-auth *, .strut-auth *::before, .strut-auth *::after { box-sizing: border-box; }
.strut-auth__card {
  position: relative;
  width: 100%;
  max-width: 500px;
  background: var(--sa-surface);
  border: 1px solid color-mix(in srgb, var(--sa-border) 85%, transparent);
  border-radius: var(--sa-radius);
  box-shadow: var(--sa-shadow);
  padding: clamp(24px, 5vw, 40px) clamp(18px, 4.5vw, 32px) clamp(28px, 5vw, 44px);
  animation: strutAuthIn 0.35s ease-out both;
}
.strut-auth__heading {
  margin: 0 0 6px;
  font-size: clamp(1.5rem, 4.5vw, 1.875rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
  text-align: center;
  color: var(--sa-on-surface);
}
.strut-auth__sub {
  margin: 0 0 clamp(20px, 4vw, 28px);
  font-size: clamp(0.875rem, 2.5vw, 0.95rem);
  line-height: 1.5;
  text-align: center;
  color: var(--sa-muted);
}
.strut-auth__tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  margin-bottom: clamp(18px, 3.5vw, 24px);
  border-radius: 12px;
  background: color-mix(in srgb, var(--sa-border) 55%, transparent);
}
.strut-auth__tab {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--sa-muted);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 10px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
  min-height: 44px;
}
.strut-auth__tab[data-active="true"] {
  background: var(--sa-surface);
  color: var(--sa-on-surface);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}
.strut-auth__tab:hover:not([data-active="true"]) {
  color: var(--sa-on-surface);
}
.strut-auth__error {
  background: var(--pw-color-error-surface, #fef2f2);
  border: 1px solid var(--pw-color-error, #fecaca);
  color: var(--pw-color-on-error-surface, #7f1d1d);
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.45;
  margin-bottom: 16px;
}
.strut-auth__google {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 44px;
  overflow: hidden;
  margin-bottom: 4px;
}
.strut-auth__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: clamp(16px, 3vw, 22px) 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--sa-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.strut-auth__divider-line {
  flex: 1;
  height: 1px;
  background: var(--sa-border);
}
.strut-auth__fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.strut-auth__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.strut-auth__field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.strut-auth__label {
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--sa-brand) 85%, var(--sa-muted));
}
.strut-auth__input {
  width: 100%;
  min-height: 48px;
  padding: 12px 14px;
  font: inherit;
  font-size: 16px;
  color: var(--sa-input-fg);
  background: var(--sa-input-bg);
  border: 1.5px solid var(--sa-border);
  border-radius: 12px;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  -webkit-appearance: none;
  appearance: none;
}
.strut-auth__input::placeholder { color: color-mix(in srgb, var(--sa-muted) 80%, transparent); }
.strut-auth__input:hover { border-color: color-mix(in srgb, var(--sa-brand) 35%, var(--sa-border)); }
.strut-auth__input:focus {
  border-color: var(--sa-brand);
  background: color-mix(in srgb, var(--sa-brand-soft) 70%, var(--sa-surface));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--sa-brand) 14%, transparent);
}
.strut-auth__password-wrap { position: relative; }
.strut-auth__password-wrap .strut-auth__input { padding-right: 72px; }
.strut-auth__eye {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  appearance: none;
  border: none;
  background: transparent;
  color: var(--sa-muted);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  min-height: 36px;
}
.strut-auth__eye:hover { color: var(--sa-on-surface); background: color-mix(in srgb, var(--sa-border) 40%, transparent); }
.strut-auth__hint {
  margin: 0;
  font-size: 0.75rem;
  color: var(--sa-muted);
  line-height: 1.4;
}
.strut-auth__submit {
  margin-top: 8px;
  width: 100%;
  min-height: 52px;
  padding: 14px 16px;
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--sa-btn-fg);
  background: var(--sa-btn-bg);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease, filter 0.15s ease;
}
.strut-auth__submit:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
}
.strut-auth__submit:active:not(:disabled) { transform: translateY(0); }
.strut-auth__submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  filter: grayscale(0.15);
  transform: none;
}
.strut-auth__footer {
  margin: 18px 0 0;
  text-align: center;
  font-size: 0.875rem;
  color: var(--sa-muted);
  line-height: 1.5;
}
.strut-auth__link {
  appearance: none;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  font: inherit;
  font-weight: 700;
  color: var(--sa-brand);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.strut-auth__link:hover { filter: brightness(0.92); }

@media (max-width: 420px) {
  .strut-auth__row { grid-template-columns: 1fr; gap: 14px; }
  .strut-auth__card { border-radius: 14px; }
  .strut-auth__tabs { margin-bottom: 16px; }
}
@media (max-width: 360px) {
  .strut-auth { padding: 0; }
  .strut-auth__card { padding: 20px 14px 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .strut-auth__card { animation: none; }
  .strut-auth__submit { transition: none; }
  .strut-auth__submit:hover:not(:disabled) { transform: none; }
}
`;

export default function StrutAuth({ onChange, defaultMode = 'signup' }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [phonePrefilled, setPhonePrefilled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState(defaultMode === 'login' ? 'login' : 'signup');
  const googleScriptLoaded = useRef(false);
  const [gsiReady, setGsiReady] = useState(false);
  const [containerWidth, setContainerWidth] = useState(360);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resolved = resolvePhone();
    setPhone(resolved);
    setPhonePrefilled(!!resolved);
  }, []);

  const advancedRef = useRef(false);
  const AUTH_BLOCK_ALIAS = 'block-strut-login';
  const advanceFlow = useCallback((answer?: unknown) => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    try { window.pathwai?.flow?.next?.(answer); } catch (e) { /* ignore */ }
  }, []);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const emitSuccess = useCallback(
    async (userEmail: string, extras: { firstName?: string; lastName?: string; dob?: string; gender?: string } = {}) => {
      try { await window.strut.getCurrentVisiting(); } catch (_) { /* ignore */ }
      const gate = await window.strut.hasPasswordAndBirthday(userEmail);
      const user = window.strut.getAccessUser();
      const resolvedEmail = String(user?.Email ?? user?.UserName ?? userEmail ?? '').trim();
      // PathwAI payment (Authorize.Net create-customer-profile) requires profile.email
      try {
        const partial: Record<string, unknown> = {};
        if (resolvedEmail) partial.email = resolvedEmail;
        if (extras.firstName) partial.firstName = extras.firstName;
        if (extras.lastName) partial.lastName = extras.lastName;
        if (Object.keys(partial).length) {
          window.pathwai?.user?.mergeProfile?.(partial);
        }
      } catch (_) { /* ignore */ }
      const payload = {
        authenticated: true,
        userId:        user?.Id ?? 0,
        email:         resolvedEmail,
        firstName:     extras.firstName ?? '',
        lastName:      extras.lastName ?? '',
        dob:           extras.dob ?? '',
        gender:        extras.gender ?? '',
        needsDob:      !gate.HasBirthDate,
        needsPassword: !gate.HasPassword,
      };
      onChangeRef.current?.(payload);
      advanceFlow({ [AUTH_BLOCK_ALIAS]: payload });
    },
    [advanceFlow]
  );

  const handleSignUp = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const answers = window.pathwai?.flow?.getAnswers?.() || {};
      const gText = resolveGenderText(answers);
      const gender = genderToStrut(gText);
      const user = await window.strut.signup(email, password, phone, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
      });
      try {
        var __pn = (typeof window !== 'undefined' && window.__STRUT_PRODUCT_NAME__) || undefined;
        var __extId = (user && (user.Id !== undefined ? user.Id : (user as any).id)) || undefined;
        if (typeof window !== 'undefined' && window.pwPushGtm) {
          window.pwPushGtm('CreateAccountSuccessfully', { external_id: __extId, user_id: __extId, email: email, first_name: firstName.trim(), last_name: lastName.trim(), phone: phone });
        } else if (typeof window !== 'undefined') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'CreateAccountSuccessfully', product_name: __pn, external_id: __extId, user_id: __extId, email: email, first_name: firstName.trim(), last_name: lastName.trim(), phone: phone });
        }
      } catch (e) {}
      const dobOk = await window.strut.saveDob(toApiDob(dob));
      if (!dobOk) throw new Error('Please enter a valid date of birth.');
      window.pathwai?.user?.mergeProfile?.({
        email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      });
      await emitSuccess(user.Email ?? email, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dob,
        gender: gText,
      });
    } catch (e: any) {
      setError((e && e.body && e.body.Message) || (e instanceof Error ? e.message : 'Sign up failed'));
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, dob, email, password, phone, emitSuccess]);

  const handleLogin = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await window.strut.loginWithPassword(email, password);
      if (!res || (!res.isVerifyAccount && !res.accessUser)) {
        throw new Error('Invalid email or password.');
      }
      const info = await fetchCustomerInfo();
      const answers = window.pathwai?.flow?.getAnswers?.() || {};
      const gText = resolveGenderText(answers);
      const firstNameVal = (info && info.FirstName) || '';
      const lastNameVal = (info && info.LastName) || '';
      const dobVal = normalizeDob(info && info.Birthday);
      const partial: Record<string, unknown> = { email: (info && info.Email) || email };
      if (firstNameVal) partial.firstName = firstNameVal;
      if (lastNameVal) partial.lastName = lastNameVal;
      if (info && info.PhoneNumber) partial.phone = info.PhoneNumber;
      if (info && (info.Address1 || info.City)) {
        partial.address = { street: info.Address1, city: info.City, state: info.Region, zip: info.Zip, country: info.Country };
      }
      window.pathwai?.user?.mergeProfile?.(partial);
      await emitSuccess((info && info.Email) || email, { firstName: firstNameVal, lastName: lastNameVal, dob: dobVal, gender: gText });
    } catch (e: any) {
      setError((e && e.body && e.body.Message) || (e instanceof Error ? e.message : 'Sign in failed'));
    } finally {
      setLoading(false);
    }
  }, [email, password, emitSuccess]);

  useEffect(() => {
    let cancelled = false;
    const user = window.strut?.getAccessUser();
    const token = window.strut?.getToken?.();
    const looksLoggedIn = !!(user?.IsVerifyAccount && token && !isTokenExpired(token));
    if (!looksLoggedIn) {
      setVisible(true);
      return;
    }
    (async () => {
      try {
        await emitSuccess(user.Email ?? user.UserName ?? '');
      } catch {
        if (cancelled) return;
        try { localStorage.removeItem(window.strut.LS.ACCESS_TOKEN); } catch {}
        setError('Your session expired. Please sign in to continue.');
        setVisible(true);
      }
    })();
    return () => { cancelled = true; };
  }, [emitSuccess]);

  const handleGoogleSuccess = useCallback(
    async (response: { credential?: string }) => {
      if (!response.credential) return;
      const payload = decodeGoogleCredential(response.credential);
      if (!payload || !payload.email) { setError('Failed to process Google sign-in'); return; }
      setError(null);
      setLoading(true);
      try {
        const googleId = String(payload.sub || '');
        const gEmail = String(payload.email);
        const gFirst = String(payload.given_name || '');
        const gLast = String(payload.family_name || '');
        const answers = window.pathwai?.flow?.getAnswers?.() || {};
        const gText = resolveGenderText(answers);

        // Request birthday scope + read DOB from People API (optional; falls back to form DOB)
        const accessToken = await requestBirthdayAccessToken();
        const googleDobIso = await fetchGoogleBirthdayIso(accessToken);

        const existing = await socialLogin(googleId, gEmail);
        if (existing) {
          const info = await fetchCustomerInfo();
          const fn = (info && info.FirstName) || gFirst;
          const ln = (info && info.LastName) || gLast;
          let dobVal = normalizeDob(info && info.Birthday) || googleDobIso;
          if (!normalizeDob(info && info.Birthday) && googleDobIso) {
            try { await window.strut.saveDob(toApiDob(googleDobIso)); } catch { /* ignore */ }
          }
          const partial: Record<string, unknown> = { email: (info && info.Email) || gEmail };
          if (fn) partial.firstName = fn;
          if (ln) partial.lastName = ln;
          if (info && info.PhoneNumber) partial.phone = info.PhoneNumber;
          if (info && (info.Address1 || info.City)) {
            partial.address = { street: info.Address1, city: info.City, state: info.Region, zip: info.Zip, country: info.Country };
          }
          window.pathwai?.user?.mergeProfile?.(partial);
          await emitSuccess((info && info.Email) || gEmail, { firstName: fn, lastName: ln, dob: dobVal, gender: gText });
          return;
        }

        const dobIso = googleDobIso || dob;
        if (!dobIso) {
          setError('Google did not share your birthday. Please enter your date of birth above, then continue with Google.');
          setLoading(false);
          return;
        }
        const phoneVal = resolvePhone();
        if (!phoneVal && !phone) {
          setError('Please enter your phone number above, then continue with Google.');
          setLoading(false);
          return;
        }
        await socialSignup({ email: gEmail, firstName: gFirst, lastName: gLast, googleId, phone: phoneVal || phone, gender: genderToStrut(gText) });
        const dobOk = await window.strut.saveDob(toApiDob(dobIso));
        if (!dobOk) throw new Error('Please enter a valid date of birth.');
        window.pathwai?.user?.mergeProfile?.({ email: gEmail, firstName: gFirst, lastName: gLast, phone: phoneVal || phone });
        await emitSuccess(gEmail, { firstName: gFirst, lastName: gLast, dob: dobIso, gender: gText });
      } catch (e: any) {
        setError(e instanceof Error ? e.message : 'Google sign-in failed');
      } finally {
        setLoading(false);
      }
    },
    [dob, phone, emitSuccess]
  );

  const googleHandlerRef = useRef(handleGoogleSuccess);
  googleHandlerRef.current = handleGoogleSuccess;

  useEffect(() => {
    if (googleScriptLoaded.current) return;
    googleScriptLoaded.current = true;
    const init = () => {
      window.google?.accounts?.id?.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp: { credential?: string }) => googleHandlerRef.current(resp),
      });
      setGsiReady(true);
    };
    if (window.google?.accounts?.id) { init(); return; }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = init;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!googleButtonRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.floor(entry.contentRect.width);
        if (width > 0) setContainerWidth(width);
      }
    });
    observer.observe(googleButtonRef.current);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!gsiReady || !visible || !googleButtonRef.current) return;
    const el = googleButtonRef.current;
    el.innerHTML = '';
    const finalWidth = Math.max(200, Math.min(400, containerWidth || 360));
    window.google?.accounts?.id?.renderButton(el, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'rectangular',
      text: 'continue_with',
      logo_alignment: 'center',
      width: finalWidth,
    });
  }, [gsiReady, visible, mode, containerWidth]);

  const isSignup = mode === 'signup';
  const signupValid = !!(firstName.trim() && lastName.trim() && dob && email && password.length >= 8 && phone.trim());
  const loginValid = !!(email && password);
  const isValid = isSignup ? signupValid : loginValid;

  const switchMode = (next: 'signup' | 'login') => {
    setMode(next);
    setError(null);
    setShowPassword(false);
  };

  if (!visible) return null;

  return (
    <div className="strut-auth">
      <style>{STYLES}</style>
      <div className="strut-auth__card">
        <h2 className="strut-auth__heading">{isSignup ? 'Create account' : 'Welcome back'}</h2>
        <p className="strut-auth__sub">
          {isSignup ? 'A few details and you are ready to continue.' : 'Sign in to pick up where you left off.'}
        </p>

        <div className="strut-auth__tabs" role="tablist" aria-label="Account mode">
          <button
            type="button"
            role="tab"
            aria-selected={isSignup}
            data-active={isSignup}
            className="strut-auth__tab"
            onClick={() => switchMode('signup')}
          >
            Sign up
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isSignup}
            data-active={!isSignup}
            className="strut-auth__tab"
            onClick={() => switchMode('login')}
          >
            Sign in
          </button>
        </div>

        {error ? <div className="strut-auth__error" role="alert">{error}</div> : null}

        <div ref={googleButtonRef} className="strut-auth__google" />

        <div className="strut-auth__divider">
          <div className="strut-auth__divider-line" />
          <span>or</span>
          <div className="strut-auth__divider-line" />
        </div>

        <div className="strut-auth__fields">
          {isSignup ? (
            <>
              <div className="strut-auth__row">
                <div className="strut-auth__field">
                  <label className="strut-auth__label" htmlFor="strut-first-name">First name</label>
                  <input
                    id="strut-first-name"
                    className="strut-auth__input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    placeholder="Jane"
                    type="text"
                  />
                </div>
                <div className="strut-auth__field">
                  <label className="strut-auth__label" htmlFor="strut-last-name">Last name</label>
                  <input
                    id="strut-last-name"
                    className="strut-auth__input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    placeholder="Doe"
                    type="text"
                  />
                </div>
              </div>

              <div className="strut-auth__field">
                <label className="strut-auth__label" htmlFor="strut-dob">Date of birth</label>
                <input
                  id="strut-dob"
                  className="strut-auth__input"
                  type="date"
                  value={dob}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDob(e.target.value)}
                  autoComplete="bday"
                />
              </div>

              {!phonePrefilled && (
                <div className="strut-auth__field">
                  <label className="strut-auth__label" htmlFor="strut-phone">Phone number</label>
                  <input
                    id="strut-phone"
                    className="strut-auth__input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="(555) 000-0000"
                    type="tel"
                    inputMode="tel"
                  />
                </div>
              )}
            </>
          ) : null}

          <div className="strut-auth__field">
            <label className="strut-auth__label" htmlFor="strut-email">Email</label>
            <input
              id="strut-email"
              className="strut-auth__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              type="email"
              inputMode="email"
            />
          </div>

          <div className="strut-auth__field">
            <label className="strut-auth__label" htmlFor="strut-password">Password</label>
            <div className="strut-auth__password-wrap">
              <input
                id="strut-password"
                className="strut-auth__input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
              />
              <button
                type="button"
                className="strut-auth__eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {isSignup && password.length > 0 && password.length < 8 ? (
              <p className="strut-auth__hint">Use at least 8 characters.</p>
            ) : null}
          </div>

          <button
            type="button"
            className="strut-auth__submit"
            disabled={loading || !isValid}
            onClick={isSignup ? handleSignUp : handleLogin}
          >
            {loading ? 'Please wait…' : (isSignup ? 'Create account' : 'Sign in')}
          </button>
        </div>

        <p className="strut-auth__footer">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="strut-auth__link"
            onClick={() => switchMode(isSignup ? 'login' : 'signup')}
          >
            {isSignup ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  );
}

export const propSchema = {
  defaultMode: {
    type: 'string',
    title: 'Initial view',
    description: "Which view to show first: 'signup' (default) or 'login'.",
    defaultValue: 'signup',
  },
};

export const outputSchema = {
  authenticated:  { type: 'boolean', title: 'Authenticated' },
  userId:         { type: 'number',  title: 'User id' },
  email:          { type: 'string',  title: 'Email' },
  firstName:      { type: 'string',  title: 'First name' },
  lastName:       { type: 'string',  title: 'Last name' },
  dob:            { type: 'string',  title: 'Date of birth (YYYY-MM-DD)' },
  gender:         { type: 'string',  title: 'Gender (male/female)' },
  needsDob:       { type: 'boolean', title: 'DOB step required' },
  needsPassword:  { type: 'boolean', title: 'Password step required' },
};
