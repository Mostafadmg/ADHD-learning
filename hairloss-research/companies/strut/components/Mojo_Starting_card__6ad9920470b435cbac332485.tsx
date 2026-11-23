import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * MOJO COPY. First screen used on Mojo flows. Headline, trust card, and note stay configurable. Google uses the same social sign-in as the starting card.
 * Mirrors ClientCheckoutWeb registration: email, phone, consent, then Google.
 * Email continue calls CheckEmail, SignUpWithEmail, then SetVerifyIdentity.
 * Google uses CheckAccountExistsBySocial, LoginBySocial, and SignUpWithSocial.
 */
declare global {
  interface Window {
    strut: {
      ENV: { api: string; checkout?: string };
      LS: { ACCESS_TOKEN: string };
      getToken: () => string | null;
      getAccessUser: () => { Id?: number; Email?: string; UserName?: string; IsVerifyAccount?: boolean; Phone?: string } | null;
      loginWithPassword: (email: string, password: string) => Promise<{ isVerifyAccount?: boolean; accessUser?: any }>;
      rememberCustomerEmail?: (email: string) => void;
    };
    google?: {
      accounts?: {
        id?: { initialize: (opts: unknown) => void; renderButton: (el: HTMLElement | null, opts: unknown) => void };
      };
    };
    pathwai?: {
      flow?: { getAnswers: () => Record<string, unknown>; next: (val?: unknown) => void };
      user?: {
        getUser: () => { profile?: { phone?: string; email?: string; firstName?: string; lastName?: string } };
        mergeProfile?: (partial: { email?: string; firstName?: string; lastName?: string; phone?: string }) => void;
      };
    };
    pwPushGtm?: (event: string, data: any) => void;
    dataLayer?: any[];
    __STRUT_PRODUCT_NAME__?: string;
    __strutStartResume?: 'idle' | 'running' | 'done';
    __strutStartMode?: 'email' | 'google' | 'login';
  }
}

const GOOGLE_CLIENT_ID = '491126416714-do0jmia9i1bpui7158ld1k7top3uahpp.apps.googleusercontent.com';
const BLOCK_ALIAS = 'block-strut-start';
const EMAIL_RE = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
const PHONE_RE = /^[01]?[- .]?(\([2-9]\d{2}\)|[2-9]\d{2})[- .]?\d{3}[- .]?\d{4}$/;

type Mode = 'signup' | 'login';

type Props = {
  onChange?: (out: Record<string, unknown>) => void;
};

function apiBase(): string {
  const api = window.strut?.ENV?.api;
  if (!api) throw new Error('Strut SDK not loaded');
  return api.replace(/\/$/, '');
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

function formatUsPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (!digits) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function validEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim().toLowerCase());
}

function validPhone(value: string): boolean {
  const phone = value.trim();
  return phone.length >= 10 && PHONE_RE.test(phone);
}

async function readBody(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

function messageFrom(data: any, fallback: string): string {
  if (data && typeof data === 'object') return data.Message || data.message || fallback;
  if (typeof data === 'string' && data.trim()) return data;
  return fallback;
}

function storeAccessUser(accessUser: any, email?: string): void {
  const key = window.strut?.LS?.ACCESS_TOKEN;
  if (!key || !accessUser || typeof accessUser !== 'object') return;
  const resolved = String(email || accessUser.Email || accessUser.UserName || '').trim();
  if (resolved) {
    if (!accessUser.Email) accessUser.Email = resolved;
    if (!accessUser.UserName) accessUser.UserName = resolved;
  }
  try { localStorage.setItem(key, JSON.stringify(accessUser)); } catch { /* ignore */ }
}

function storeAuthParams(id: number, secureParam: string, dob = '', email = '', phone = '', firstName = '', lastName = ''): void {
  try {
    let existing: Record<string, unknown> = {};
    try { existing = JSON.parse(localStorage.getItem('AuthParams') || 'null') || {}; } catch { /* ignore */ }
    localStorage.setItem('AuthParams', JSON.stringify({
      ...existing,
      Id: id,
      secureParam,
      Flow: 'Registration',
      dob: dob || existing.dob || '',
      email: email || existing.email || '',
      phone: phone || existing.phone || '',
      firstName: firstName || existing.firstName || '',
      lastName: lastName || existing.lastName || '',
    }));
  } catch { /* ignore */ }
}

function rememberEmail(email: string): void {
  try { window.strut?.rememberCustomerEmail?.(email); } catch { /* ignore */ }
  try { window.pathwai?.user?.mergeProfile?.({ email }); } catch { /* ignore */ }
}

function pushCreateAccount(email: string, phone: string, userId?: number): void {
  try {
    const product = window.__STRUT_PRODUCT_NAME__;
    const payload = { external_id: userId, user_id: userId, email, phone };
    if (window.pwPushGtm) window.pwPushGtm('CreateAccountSuccessfully', payload);
    else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'CreateAccountSuccessfully', product_name: product, ...payload });
    }
  } catch { /* ignore */ }
}

function startResumeState(): 'idle' | 'running' | 'done' {
  const value = window.__strutStartResume;
  return value === 'running' || value === 'done' ? value : 'idle';
}

function setStartResume(value: 'idle' | 'running' | 'done'): void {
  window.__strutStartResume = value;
}

async function fetchCustomerInfo(): Promise<Record<string, any> | null> {
  try {
    const customerId = window.strut.getAccessUser?.()?.Id;
    if (!customerId) return null;
    const token = window.strut.getToken?.();
    const res = await fetch(`${apiBase()}/checkout/GetCustomerInfo?customerId=${encodeURIComponent(String(customerId))}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function decodeGoogleCredential(credential: string): any {
  const parts = (credential || '').split('.');
  if (parts.length !== 3) return null;
  try { return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch { return null; }
}

async function strutPost(path: string, body: Record<string, unknown>, token?: string | null): Promise<any> {
  const headers: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${apiBase()}/${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await readBody(res);
  if (!res.ok) throw new Error(messageFrom(data, 'Google sign-in failed'));
  return data;
}

async function socialLogin(googleId: string, email: string): Promise<any | null> {
  try {
    const existsRes = await fetch(`${apiBase()}/auth/CheckAccountExistsBySocial?id=${encodeURIComponent(googleId)}`, { headers: { Accept: 'application/json' } });
    if (existsRes.ok) {
      const exists = await existsRes.json();
      if (!exists) return null;
    }
    const res = await strutPost('auth/LoginBySocial', { SocialId: googleId, UserName: email });
    if (res && res.isVerifyAccount && res.accessUser) {
      storeAccessUser(res.accessUser, email);
      return res.accessUser;
    }
    return null;
  } catch {
    return null;
  }
}

async function socialSignup(opts: { email: string; firstName: string; lastName: string; googleId: string; phone: string }): Promise<any> {
  const su = await strutPost('auth/SignUpWithSocial', { FirstName: opts.firstName, LastName: opts.lastName, Email: opts.email, GoogleId: opts.googleId, FaceBookId: '' });
  if (!su || !su.Id) throw new Error('Could not create your account with Google.');
  const verified = await fetch(`${apiBase()}/auth/SetVerifyIdentity?id=${su.Id}&secureParam=${encodeURIComponent(su.secureParam)}`, { method: 'PUT', headers: { Accept: 'application/json', 'Content-Length': '0' } });
  const user = await readBody(verified);
  if (!verified.ok || !user?.Id) throw new Error(messageFrom(user, 'Could not verify your Google account.'));
  storeAccessUser(user, opts.email);
  storeAuthParams(su.Id, su.secureParam, '', opts.email, opts.phone, opts.firstName, opts.lastName);
  const token = (user && user.AccessToken && user.AccessToken.Token) || window.strut.getToken?.();
  const pw = `G${Math.random().toString(36).slice(2)}A1!`;
  await strutPost('auth/CompleteAccount', { SecureParam: su.secureParam, FirstName: opts.firstName, LastName: opts.lastName, Email: opts.email, Password: pw, ConfirmPassword: pw, Phone: opts.phone, Gender: 0 }, token);
  return user;
}

const STYLES = `
.strut-start { width: 100%; display: flex; justify-content: center; padding: 12px 16px 28px; box-sizing: border-box; font-family: var(--pw-font-family-body, "Basis Grotesque Pro", ui-sans-serif, system-ui, -apple-system, sans-serif); color: #222222; }
.strut-start *, .strut-start *::before, .strut-start *::after { box-sizing: border-box; }
.strut-start__wrap { width: 100%; max-width: 520px; }
.strut-start__heading { margin: 0 0 15px; font-weight: 500; font-size: 36px; line-height: 1.15; color: #222222; }
.strut-start__sub { margin: 0 0 8px; font-weight: 400; font-size: 20px; line-height: 1.3; color: #222222; }
.strut-start__field { margin-top: 24px; }
.strut-start__input { width: 100%; height: 60px; margin: 0; padding: 15px; border: 1px solid #cccccc; border-radius: 8px; background: #fff; color: #161336; font: inherit; font-size: 14px; outline: none; }
.strut-start__input::placeholder { color: #707070; }
.strut-start__input:focus { border-color: #ff8268; box-shadow: 0 0 8px 0 rgba(255, 130, 104, 0.25); }
.strut-start__password { position: relative; }
.strut-start__password .strut-start__input { padding-right: 72px; }
.strut-start__eye { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); border: 0; background: transparent; color: #707070; font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; }
.strut-start__hint { margin: 6px 0 0; font-size: 12px; color: #d2471e; }
.strut-start__consent { display: flex; align-items: flex-start; gap: 10px; margin: 20px 0; font-size: 14px; font-weight: 500; line-height: 1.45; color: #222222; }
.strut-start__consent input { margin-top: 3px; accent-color: #ff8268; flex: 0 0 auto; }
.strut-start__consent a { color: inherit; text-decoration: underline; }
.strut-start__submit { width: 100%; padding: 0.625rem 1.5rem; font-size: var(--pw-font-size-body, 1rem); font-weight: 600; font-family: var(--pw-font-family-body, system-ui, sans-serif); color: var(--pw-button-fg, #ffffff); background: var(--pw-button-bg, var(--pw-color-brand, #2563eb)); border: none; border-radius: var(--pw-radius, 0.5rem); cursor: pointer; }
.strut-start__submit:disabled { opacity: 0.5; cursor: not-allowed; }
.strut-start__submit--login { margin-top: 32px; }
.strut-start__account { margin: 25px 0 0; text-align: center; font-size: 12px; line-height: 1.3; color: #222222; }
.strut-start__link { border: 0; background: none; padding: 0; font: inherit; font-weight: 600; color: #ff8268; cursor: pointer; }
.strut-start__or { position: relative; margin: 20px 0; text-align: center; font-size: 12px; font-weight: 400; color: #222222; }
.strut-start__or::before, .strut-start__or::after { content: ""; position: absolute; top: 50%; width: 42%; height: 2px; background: #dddddd; }
.strut-start__or::before { left: 0; }
.strut-start__or::after { right: 0; }
.strut-start__google { display: flex; justify-content: center; width: 100%; min-height: 44px; overflow: hidden; border-radius: 30px; }
.strut-start__google iframe, .strut-start__google > div { border-radius: 30px !important; }
.strut-start__error { margin-top: 16px; padding: 12px 14px; border-radius: 8px; background: #fef2f2; color: #7f1d1d; font-size: 12px; line-height: 1.45; }
@media (max-width: 768px) { .strut-start__heading { font-size: 20px; } .strut-start__sub { font-size: 16px; } }
`;

export default function StartingCard({
  onChange,
  headline = 'See your treatment options',
  subheadline = 'A U.S. licensed physician reviews your labs and creates a personalized treatment plan.',
  trustLine1 = 'Trusted by 10,000+ men',
  trustLine2 = 'Doctor-prescribed',
  note = 'Takes 5 minutes \u00b7 free to start',
}: Props & { headline?: string; subheadline?: string; trustLine1?: string; trustLine2?: string; note?: string }) {
  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const [containerWidth, setContainerWidth] = useState(360);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const googleScriptLoaded = useRef(false);
  const advancedRef = useRef(false);

  const advance = useCallback((payload: Record<string, unknown>) => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    onChange?.(payload);
    try { window.pathwai?.flow?.next?.({ [BLOCK_ALIAS]: payload }); } catch { /* ignore */ }
  }, [onChange]);

  const finishSession = useCallback(async (opts: { email: string; phone?: string; userId?: number; firstName?: string; lastName?: string; mode: 'email' | 'google' | 'login' }) => {
    const info = await fetchCustomerInfo();
    const emailVal = (info && info.Email) || opts.email;
    const phoneVal = (info && info.PhoneNumber) || opts.phone || '';
    const firstName = (info && info.FirstName) || opts.firstName || '';
    const lastName = (info && info.LastName) || opts.lastName || '';
    const partial: { email?: string; phone?: string; firstName?: string; lastName?: string } = {};
    if (emailVal) partial.email = emailVal;
    if (phoneVal) partial.phone = phoneVal;
    if (firstName) partial.firstName = firstName;
    if (lastName) partial.lastName = lastName;
    try { window.pathwai?.user?.mergeProfile?.(partial); } catch { /* ignore */ }
    try { window.__strutStartMode = opts.mode; } catch { /* ignore */ }
    rememberEmail(emailVal);
    advance({ authenticated: true, mode: opts.mode, email: emailVal, phone: phoneVal, userId: opts.userId || window.strut.getAccessUser?.()?.Id || 0, firstName, lastName });
  }, [advance]);

  useEffect(() => {
    const resume = startResumeState();
    if (resume === 'running') return;
    if (resume === 'done') { setVisible(true); return; }
    const user = window.strut?.getAccessUser?.();
    const token = window.strut?.getToken?.();
    const looksLoggedIn = !!((user?.Id || user?.Email || user?.UserName) && token && !isTokenExpired(token));
    if (!looksLoggedIn) { setVisible(true); return; }
    setStartResume('running');
    finishSession({ email: user?.Email || user?.UserName || '', phone: user?.Phone || '', userId: user?.Id, mode: 'login' }).then(() => setStartResume('done')).catch(() => { setStartResume('idle'); setVisible(true); });
  }, [finishSession]);

  const handleContinue = useCallback(async () => {
    setError(null);
    if (!validEmail(email) || !validPhone(phone) || !agreed) return;
    setLoading(true);
    try {
      const check = await fetch(`${apiBase()}/auth/CheckEmail`, { method: 'PUT', headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ email: email.trim() }) });
      if (!check.ok) { setError(messageFrom(await readBody(check), 'That e-mail cannot be used. Sign in if you already have an account.')); return; }
      const signup = await fetch(`${apiBase()}/auth/SignUpWithEmail`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ Email: email.trim(), Phone: phone.trim() }) });
      const signupBody = await readBody(signup);
      if (!signup.ok || !signupBody?.Id) throw new Error(messageFrom(signupBody, 'Could not create your account.'));
      const verified = await fetch(`${apiBase()}/auth/SetVerifyIdentity?id=${signupBody.Id}&secureParam=${encodeURIComponent(signupBody.secureParam)}`, { method: 'PUT', headers: { Accept: 'application/json', 'Content-Length': '0' } });
      const user = await readBody(verified);
      if (!verified.ok || !user?.Id) throw new Error(messageFrom(user, 'Could not verify your account.'));
      storeAccessUser(user, email.trim());
      storeAuthParams(signupBody.Id, signupBody.secureParam, '', email.trim(), phone.trim());
      pushCreateAccount(email.trim(), phone.trim(), user.Id);
      await finishSession({ email: user.Email || email.trim(), phone: phone.trim(), userId: user.Id, mode: 'email' });
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }, [email, phone, agreed, finishSession]);

  const handleLogin = useCallback(async () => {
    setError(null);
    if (!validEmail(email) || !password) return;
    setLoading(true);
    try {
      const res = await window.strut.loginWithPassword(email.trim(), password);
      if (!res || (!res.isVerifyAccount && !res.accessUser)) throw new Error('Invalid email or password.');
      const info = await fetchCustomerInfo();
      await finishSession({ email: (info && info.Email) || email.trim(), phone: (info && info.PhoneNumber) || '', userId: res.accessUser?.Id, firstName: info?.FirstName || '', lastName: info?.LastName || '', mode: 'login' });
    } catch (e: any) {
      setError((e && e.body && e.body.Message) || (e instanceof Error ? e.message : 'Sign in failed'));
    } finally {
      setLoading(false);
    }
  }, [email, password, finishSession]);

  const handleGoogleSuccess = useCallback(async (response: { credential?: string }) => {
    if (!response.credential) return;
    const claims = decodeGoogleCredential(response.credential);
    if (!claims?.email) { setError('Failed to process Google sign-in'); return; }
    setError(null);
    setLoading(true);
    try {
      const googleId = String(claims.sub || '');
      const gEmail = String(claims.email);
      const gFirst = String(claims.given_name || '');
      const gLast = String(claims.family_name || '');
      const existing = await socialLogin(googleId, gEmail);
      if (existing) {
        await finishSession({ email: existing.Email || gEmail, phone: existing.Phone || existing.PhoneNumber || '', userId: existing.Id, firstName: existing.FirstName || gFirst, lastName: existing.LastName || gLast, mode: 'google' });
        return;
      }
      if (!validPhone(phone)) { setError('Please enter your phone number above, then continue with Google.'); return; }
      const user = await socialSignup({ email: gEmail, firstName: gFirst, lastName: gLast, googleId, phone: phone.trim() });
      pushCreateAccount(gEmail, phone.trim(), user?.Id);
      await finishSession({ email: user?.Email || gEmail, phone: phone.trim(), userId: user?.Id, firstName: gFirst, lastName: gLast, mode: 'google' });
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  }, [phone, finishSession]);

  const googleHandlerRef = useRef(handleGoogleSuccess);
  googleHandlerRef.current = handleGoogleSuccess;

  useEffect(() => {
    if (googleScriptLoaded.current) return;
    googleScriptLoaded.current = true;
    const init = () => {
      window.google?.accounts?.id?.initialize({ client_id: GOOGLE_CLIENT_ID, callback: (resp: { credential?: string }) => googleHandlerRef.current(resp) });
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
    const observer = new ResizeObserver((entries) => { for (const entry of entries) { const width = Math.floor(entry.contentRect.width); if (width > 0) setContainerWidth(width); } });
    observer.observe(googleButtonRef.current);
    return () => observer.disconnect();
  }, [visible, mode]);

  useEffect(() => {
    if (!gsiReady || !visible || !googleButtonRef.current) return;
    const el = googleButtonRef.current;
    el.innerHTML = '';
    const finalWidth = Math.max(200, Math.min(400, containerWidth || 360));
    window.google?.accounts?.id?.renderButton(el, { theme: 'outline', size: 'large', type: 'standard', shape: 'pill', text: 'signin_with', logo_alignment: 'left', width: finalWidth });
  }, [gsiReady, visible, mode, containerWidth]);

  const signupValid = validEmail(email) && validPhone(phone) && agreed;
  const loginValid = validEmail(email) && !!password;
  const isSignup = mode === 'signup';
  if (!visible) return null;

  return (
    <div className="strut-start">
      <style>{STYLES}</style>
      <div className="strut-start__wrap">
        {isSignup ? (
          <>
            <h1 className="strut-start__heading">{headline}</h1>
            {subheadline ? <p className="strut-start__sub">{subheadline}</p> : null}
            {trustLine1 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '4px 0 18px', padding: '14px 18px', border: '1px solid #EFEFEC', borderRadius: 16, background: '#FFFFFF' }}>
                <span aria-label="5 out of 5 stars" role="img" style={{ display: 'inline-flex', gap: 2, flexShrink: 0 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <svg key={i} width={18} height={18} viewBox="0 0 24 24" aria-hidden="true"><path fill="#161336" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" /></svg>
                  ))}
                </span>
                <span style={{ display: 'grid', gap: 2, fontSize: 14, fontWeight: 600, color: '#1C1C21' }}>
                  <span>{trustLine1}</span>
                  {trustLine2 ? <span>{trustLine2}</span> : null}
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <h1 className="strut-start__heading">Sign in to your account</h1>
            <p className="strut-start__sub">Already a Strut patient? Pick up where you left off.</p>
          </>
        )}
        <div className="strut-start__field">
          <input className="strut-start__input" type="email" inputMode="email" autoComplete="email" maxLength={256} placeholder="Enter your e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          {email && !validEmail(email) ? <p className="strut-start__hint">Enter a valid e-mail.</p> : null}
        </div>
        {isSignup ? (
          <div className="strut-start__field">
            <input className="strut-start__input" type="tel" inputMode="tel" autoComplete="tel" maxLength={14} placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(formatUsPhone(e.target.value))} />
            {phone && !validPhone(phone) ? <p className="strut-start__hint">Enter a valid US phone number.</p> : null}
          </div>
        ) : (
          <div className="strut-start__field strut-start__password">
            <input className="strut-start__input" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="strut-start__eye" onClick={() => setShowPassword((v) => !v)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        )}
        {isSignup ? (
          <label className="strut-start__consent">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>
              By creating an account using e-mail, Google, I agree to the{' '}
              <a target="_blank" rel="noreferrer" href="https://www.struthealth.com/telemedicine-consent?_gl=1*mj0uer*_gcl_au*MjEzODIxNjQ2My4xNzkyNTY1NDUy">Telemedicine Consent</a>,{' '}
              <a target="_blank" rel="noreferrer" href="https://www.struthealth.com/privacy-policy?_gl=1*14bje5y*_gcl_au*MjEzODIxNjQ2My4xNzkyNTY1NDUy">Privacy Policy</a>,{' '}
              <a target="_blank" rel="noreferrer" href="https://www.struthealth.com/refund-policy?_gl=1*1p8r0up*_gcl_au*MjEzODIxNjQ2My4xNzkyNTY1NDUy">Refund Policy</a>
              {' '}and{' '}
              <a target="_blank" rel="noreferrer" href="https://www.struthealth.com/terms-and-conditions?_gl=1*1p8r0up*_gcl_au*MjEzODIxNjQ2My4xNzkyNTY1NDUy">Terms & Conditions</a>
            </span>
          </label>
        ) : null}
        <button type="button" className={isSignup ? 'strut-start__submit' : 'strut-start__submit strut-start__submit--login'} disabled={loading || (isSignup ? !signupValid : !loginValid)} onClick={isSignup ? handleContinue : handleLogin}>
          {loading ? 'Please wait…' : (isSignup ? 'Continue' : 'Sign in')}
        </button>
        {isSignup && note ? <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: 13, color: '#71717a' }}>{note}</p> : null}
        <p className="strut-start__account">
          {isSignup ? 'Already have an account? ' : 'Not currently a Strut patient? '}
          <button type="button" className="strut-start__link" onClick={() => { setMode(isSignup ? 'login' : 'signup'); setError(null); setPassword(''); setShowPassword(false); }}>
            {isSignup ? 'Sign In.' : 'Sign up'}
          </button>
        </p>
        <div className="strut-start__or">or</div>
        <div ref={googleButtonRef} className="strut-start__google" />
        {error ? <div className="strut-start__error" role="alert">{error}</div> : null}
      </div>
    </div>
  );
}

export const propSchema = {
  headline: { type: 'string', title: 'Sign-up heading', defaultValue: 'See your treatment options' },
  subheadline: { type: 'string', title: 'Line under the heading', defaultValue: 'A U.S. licensed physician reviews your labs and creates a personalized treatment plan.' },
  trustLine1: { type: 'string', title: 'Star card line 1 (empty hides the card)', defaultValue: 'Trusted by 10,000+ men' },
  trustLine2: { type: 'string', title: 'Star card line 2', defaultValue: 'Doctor-prescribed' },
  note: { type: 'string', title: 'Note under Continue', defaultValue: 'Takes 5 minutes \u00b7 free to start' },
};

export const outputSchema = {
  authenticated: { type: 'boolean', title: 'Authenticated' },
  mode: { type: 'string', title: 'How they continued (email, google, login)' },
  email: { type: 'string', title: 'Email' },
  phone: { type: 'string', title: 'Phone' },
  userId: { type: 'number', title: 'User id' },
  firstName: { type: 'string', title: 'First name' },
  lastName: { type: 'string', title: 'Last name' },
};
