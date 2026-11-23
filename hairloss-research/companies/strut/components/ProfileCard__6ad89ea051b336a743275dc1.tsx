import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Account step before payment. Matches the legacy checkout "Complete your free account"
 * screen: first name, last name, gender, phone, email, password.
 * Continue calls strut.savePassword → auth/CompleteAccount.
 * Place this card after the questionnaire and before the payment card.
 */

declare global {
  interface Window {
    strut?: {
      ENV?: { api: string };
      getToken?: () => string | null;
      getAccessUser?: () => {
        Id?: number;
        Email?: string;
        UserName?: string;
        Phone?: string;
        PhoneNumber?: string;
        FirstName?: string;
        LastName?: string;
      } | null;
      getAuthParams?: () => {
        email?: string;
        phone?: string;
        firstName?: string;
        lastName?: string;
        gender?: string;
      } | null;
      savePassword?: (
        password: string,
        opts?: {
          firstName?: string;
          lastName?: string;
          gender?: string;
          email?: string;
          phone?: string;
          confirmPassword?: string;
        }
      ) => Promise<unknown>;
    };
    pathwai?: {
      flow?: {
        getAnswers?: () => Record<string, unknown>;
        next?: (val?: unknown) => void;
        back?: () => void;
        previous?: () => void;
      };
      user?: {
        getUser?: () => { profile?: { email?: string; phone?: string; firstName?: string; lastName?: string } };
        mergeProfile?: (partial: { email?: string; firstName?: string; lastName?: string; phone?: string }) => void;
      };
    };
  }
}

const BLOCK_ALIAS = 'block-strut-profile';
const EMAIL_RE = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
const PHONE_RE = /^[01]?[- .]?(\([2-9]\d{2}\)|[2-9]\d{2})[- .]?\d{3}[- .]?\d{4}$/;
const GENDERS = [
  { id: '1', label: 'Male' },
  { id: '2', label: 'Female' },
  { id: '3', label: 'Other' },
  { id: '0', label: 'Unknown' },
];

type Props = {
  onChange?: (out: Record<string, unknown>) => void;
};

type Seed = {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
};

function apiBase(): string {
  const api = window.strut?.ENV?.api;
  if (!api) throw new Error('Strut SDK not loaded');
  return api.replace(/\/$/, '');
}

function formatUsPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (!digits) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function textOf(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

async function readBody(res: Response): Promise<any> {
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

/**
 * Sex/gender keys across flows.
 * Mojo MCQ (node-2-age): Male = a, Female = b — a/b ONLY under gender-ish keys
 * (and nested under those keys), so other MCQs using a/b stay untouched.
 */
const GENDER_STORE_KEY = 'strut.flow.gender';

function isGenderAnswerKey(key: string): boolean {
  const k = String(key || '').toLowerCase();
  if (!k) return false;
  if (
    k === 'node-2-age'
    || k === 'gender'
    || k === 'genderlabel'
    || k === 'sex'
    || k === 'sex_at_birth'
    || k === 'block-strut-age-gender'
  ) return true;
  if (k.includes('gender') || k.includes('sex_at_birth') || k.includes('assigned')) return true;
  // "sex" alone or dotted (node.sex) — not "sexual", "sexually", etc.
  if (k === 'sex' || /(^|[._-])sex$/.test(k) || /\.sex$/.test(k)) return true;
  return false;
}

function normalizeGender(raw: unknown): string {
  if (typeof raw === 'number' && Number.isFinite(raw)) return normalizeGender(String(Math.trunc(raw)));
  if (typeof raw !== 'string') return '';
  const parts = raw.split('::').map((part) => part.trim().toLowerCase()).filter(Boolean);
  for (let i = 0; i < parts.length; i += 1) {
    const text = parts[i];
    if (text === '1' || text === 'male' || text === 'man') return '1';
    if (text === '2' || text === 'female' || text === 'woman') return '2';
    if (text === '3' || text === 'other') return '3';
  }
  return '';
}

/** Male/Female/1/2/3 plus Mojo a/b (and m/f) option values. */
function normalizeGenderChoice(raw: unknown): string {
  const standard = normalizeGender(raw);
  if (standard) return standard;
  if (typeof raw === 'number' && Number.isFinite(raw)) return normalizeGenderChoice(String(Math.trunc(raw)));
  if (typeof raw !== 'string') return '';
  const parts = raw.split('::').map((part) => part.trim().toLowerCase()).filter(Boolean);
  for (let i = 0; i < parts.length; i += 1) {
    const text = parts[i];
    if (text === 'a' || text === 'm') return '1';
    if (text === 'b' || text === 'f') return '2';
  }
  return '';
}

function rememberGender(gender: string) {
  if (!GENDERS.some((item) => item.id === gender)) return;
  try { window.localStorage.setItem(GENDER_STORE_KEY, gender); } catch { /* ignore */ }
}

function readRememberedGender(): string {
  try {
    const stored = String(window.localStorage.getItem(GENDER_STORE_KEY) || '').trim();
    return GENDERS.some((item) => item.id === stored) ? stored : '';
  } catch {
    return '';
  }
}

/**
 * Walk PathwAI answers. Under gender keys (e.g. node-2-age), nested block
 * values like { "<blockId>": "a" } still map a→Male / b→Female.
 */
function genderFromFlowAnswers(answers: Record<string, unknown>): string {
  let found = '';

  const visit = (value: unknown, keyHint: string, depth: number, allowAb: boolean) => {
    if (depth > 8 || value == null) return;
    const ab = allowAb || isGenderAnswerKey(keyHint);

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      const hit = ab ? normalizeGenderChoice(value) : normalizeGender(value);
      if (hit) found = hit;
      return;
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i += 1) visit(value[i], keyHint, depth + 1, ab);
      return;
    }

    if (typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const preferred = ['gender', 'genderLabel', 'sex', 'sex_at_birth', 'value', 'label', 'id', 'optionId', 'key', 'KeyId'];
      for (let i = 0; i < preferred.length; i += 1) {
        const key = preferred[i];
        if (!(key in record)) continue;
        visit(record[key], ab ? keyHint || key : key, depth + 1, ab || isGenderAnswerKey(key));
      }
      const entries = Object.entries(record);
      for (let i = 0; i < entries.length; i += 1) {
        const [key, nested] = entries[i];
        visit(nested, key, depth + 1, ab || isGenderAnswerKey(key));
      }
    }
  };

  const entries = Object.entries(answers);
  for (let i = 0; i < entries.length; i += 1) {
    const [key, value] = entries[i];
    visit(value, key, 0, isGenderAnswerKey(key));
  }
  return found;
}

function seedFromLocal(): Seed {
  const user = window.strut?.getAccessUser?.() || {};
  const params = window.strut?.getAuthParams?.() || {};
  const profile = window.pathwai?.user?.getUser?.()?.profile || {};
  let answer: Record<string, unknown> = {};
  let genderFromFlow = '';
  try {
    const answers = window.pathwai?.flow?.getAnswers?.() || {};
    const start = answers['block-strut-start'];
    if (start && typeof start === 'object') answer = start as Record<string, unknown>;
    genderFromFlow = genderFromFlowAnswers(answers) || readRememberedGender();
    if (genderFromFlow) rememberGender(genderFromFlow);
  } catch { /* ignore */ }
  return {
    firstName: textOf(params.firstName) || textOf(user.FirstName) || textOf(profile.firstName) || textOf(answer.firstName),
    lastName: textOf(params.lastName) || textOf(user.LastName) || textOf(profile.lastName) || textOf(answer.lastName),
    gender: genderFromFlow || normalizeGender(params.gender) || readRememberedGender(),
    email: textOf(params.email) || textOf(user.Email) || textOf(user.UserName) || textOf(profile.email) || textOf(answer.email),
    phone: formatUsPhone(textOf(params.phone) || textOf(user.PhoneNumber) || textOf(user.Phone) || textOf(profile.phone) || textOf(answer.phone)),
  };
}

async function fetchFlag(path: string): Promise<boolean | null> {
  const token = window.strut?.getToken?.();
  if (!token) return null;
  try {
    const res = await fetch(`${apiBase()}${path}`, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const body = await readBody(res);
    return body === true;
  } catch {
    return null;
  }
}

async function fetchCustomerSeed(seed: Seed): Promise<Seed> {
  const customerId = window.strut?.getAccessUser?.()?.Id;
  const token = window.strut?.getToken?.();
  if (!customerId || !token) return seed;
  try {
    const res = await fetch(
      `${apiBase()}/checkout/GetCustomerInfo?customerId=${encodeURIComponent(String(customerId))}`,
      { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return seed;
    const info = await readBody(res);
    if (!info || typeof info !== 'object') return seed;
    return {
      firstName: seed.firstName || textOf(info.FirstName),
      lastName: seed.lastName || textOf(info.LastName),
      gender: seed.gender || normalizeGender(info.Gender),
      email: seed.email || textOf(info.Email),
      phone: seed.phone || formatUsPhone(textOf(info.PhoneNumber) || textOf(info.Phone)),
    };
  } catch {
    return seed;
  }
}

function answerModeIsGoogle(value: unknown, depth = 0): boolean {
  if (!value || typeof value !== 'object' || depth > 4) return false;
  const record = value as Record<string, unknown>;
  if (record.mode === 'google') return true;
  return Object.values(record).some((inner) => answerModeIsGoogle(inner, depth + 1));
}

function startedWithGoogle(): boolean {
  try {
    if ((window as unknown as { __strutStartMode?: string }).__strutStartMode === 'google') return true;
    const answers = window.pathwai?.flow?.getAnswers?.() || {};
    return Object.values(answers).some((value) => answerModeIsGoogle(value));
  } catch {
    return false;
  }
}

/** Skip the form only when Strut already has a real name and gender. "0" / Unknown is not enough. */
function profileIsComplete(seed: Seed): boolean {
  return Boolean(
    seed.firstName &&
    seed.lastName &&
    (seed.gender === '1' || seed.gender === '2' || seed.gender === '3')
  );
}

let profileCheck: 'idle' | 'running' | 'done' = 'idle';

const STYLES = `
.strut-profile {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 12px 16px 28px;
  box-sizing: border-box;
  font-family: var(--pw-font-family-body, "Basis Grotesque Pro", ui-sans-serif, system-ui, -apple-system, sans-serif);
  color: #222222;
}
.strut-profile *, .strut-profile *::before, .strut-profile *::after { box-sizing: border-box; }
.strut-profile__wrap { width: 100%; max-width: 520px; }
.strut-profile__heading {
  margin: 0 0 8px;
  font-weight: 500;
  font-size: 32px;
  line-height: 1.15;
  color: #222222;
}
.strut-profile__sub {
  margin: 0 0 8px;
  font-size: 16px;
  line-height: 1.35;
  color: #222222;
}
.strut-profile__row { display: flex; gap: 12px; }
.strut-profile__field { margin-top: 16px; flex: 1 1 0; min-width: 0; }
.strut-profile__input, .strut-profile__select {
  width: 100%;
  height: 52px;
  margin: 0;
  padding: 12px 14px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  background: #fff;
  color: #161336;
  font: inherit;
  font-size: 14px;
  outline: none;
}
.strut-profile__select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, #222 50%), linear-gradient(135deg, #222 50%, transparent 50%); background-position: calc(100% - 18px) 22px, calc(100% - 12px) 22px; background-size: 6px 6px, 6px 6px; background-repeat: no-repeat; }
.strut-profile__input::placeholder { color: #707070; }
.strut-profile__input:focus, .strut-profile__select:focus {
  border-color: #ff8268;
  box-shadow: 0 0 8px 0 rgba(255, 130, 104, 0.25);
}
.strut-profile__password { position: relative; }
.strut-profile__password .strut-profile__input { padding-right: 64px; }
.strut-profile__eye {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #707070;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.strut-profile__note { margin: 8px 0 0; font-size: 12px; line-height: 1.4; color: #555; }
.strut-profile__consent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 18px 0 0;
  font-size: 14px;
  line-height: 1.45;
}
.strut-profile__consent input { margin-top: 3px; accent-color: #ff8268; flex: 0 0 auto; }
.strut-profile__consent a { color: inherit; text-decoration: underline; }
.strut-profile__error {
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fef2f2;
  color: #7f1d1d;
  font-size: 12px;
  line-height: 1.45;
}
.strut-profile__actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 28px;
}
.strut-profile__btn {
  width: 50%;
  height: 44px;
  border-radius: 45px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.strut-profile__back {
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
.strut-profile__continue {
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
.strut-profile__continue:disabled { opacity: 0.5; cursor: not-allowed; }
@media (max-width: 600px) {
  .strut-profile__heading { font-size: 22px; }
  .strut-profile__row { flex-direction: column; gap: 0; }
  .strut-profile__actions { gap: 12px; }
  .strut-profile__btn { width: 100%; }
}
`;

export default function ProfileCard({ onChange }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const advancedRef = useRef(false);

  const advance = useCallback((payload: Record<string, unknown>) => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    onChange?.(payload);
    try { window.pathwai?.flow?.next?.({ [BLOCK_ALIAS]: payload }); } catch { /* ignore */ }
  }, [onChange]);

  useEffect(() => {
    if (startedWithGoogle()) {
      if (advancedRef.current) return;
      profileCheck = 'running';
      (async () => {
        const seed = await fetchCustomerSeed(seedFromLocal());
        if (!profileIsComplete(seed)) {
          if (seed.gender) rememberGender(seed.gender);
          setFirstName(seed.firstName);
          setLastName(seed.lastName);
          setGender(GENDERS.some((item) => item.id === seed.gender) ? seed.gender : '');
          setEmail(seed.email);
          setPhone(seed.phone);
          profileCheck = 'done';
          setVisible(true);
          return;
        }
        profileCheck = 'done';
        advance({
          profileComplete: true,
          skipped: true,
          firstName: seed.firstName,
          lastName: seed.lastName,
          gender: seed.gender,
          email: seed.email,
          phone: seed.phone,
        });
      })().catch(() => {
        profileCheck = 'done';
        setVisible(true);
      });
      return;
    }
    if (profileCheck === 'running') return;
    if (profileCheck === 'done') {
      setVisible(true);
      return;
    }
    profileCheck = 'running';
    (async () => {
      let seed = await fetchCustomerSeed(seedFromLocal());
      // PathwAI answers can hydrate slightly after first paint — retry gender once.
      if (!seed.gender) {
        await new Promise((resolve) => window.setTimeout(resolve, 250));
        const again = seedFromLocal();
        if (again.gender) seed = { ...seed, gender: again.gender };
      }
      if (seed.gender) rememberGender(seed.gender);
      setFirstName(seed.firstName);
      setLastName(seed.lastName);
      setGender(GENDERS.some((item) => item.id === seed.gender) ? seed.gender : '');
      setEmail(seed.email);
      setPhone(seed.phone);
      const emailValue = seed.email;
      if (emailValue && window.strut?.getToken?.()) {
        const encoded = encodeURIComponent(emailValue);
        const [profile, hasPassword] = await Promise.all([
          fetchFlag(`/auth/HasProfileByEmail?email=${encoded}`),
          fetchFlag(`/auth/HasPasswordByEmail?email=${encoded}`),
        ]);
        if (profile === true && hasPassword === true && profileIsComplete(seed)) {
          profileCheck = 'done';
          advance({
            profileComplete: true,
            skipped: true,
            firstName: seed.firstName,
            lastName: seed.lastName,
            gender: seed.gender,
            email: seed.email,
            phone: seed.phone,
          });
          return;
        }
      }
      profileCheck = 'done';
      setVisible(true);
    })().catch(() => {
      profileCheck = 'idle';
      setVisible(true);
    });
  }, [advance]);

  const goBack = () => {
    const flow = window.pathwai?.flow;
    if (flow?.back) flow.back();
    else flow?.previous?.();
  };

  const submit = async () => {
    setError(null);
    const first = firstName.trim();
    const last = lastName.trim();
    const emailValue = email.trim();
    const phoneValue = phone.trim();
    if (!first || !last) {
      setError('Enter your first and last name.');
      return;
    }
    if (!gender) {
      setError('Select a gender.');
      return;
    }
    if (!EMAIL_RE.test(emailValue)) {
      setError('Enter a valid email.');
      return;
    }
    if (!PHONE_RE.test(phoneValue)) {
      setError('Enter a valid US phone number.');
      return;
    }
    if (password.length < 8) {
      setError('Password needs at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the policies before continuing.');
      return;
    }
    if (!window.strut?.savePassword) {
      setError('Strut SDK not loaded. Paste the updated event file into this flow.');
      return;
    }
    if (!window.strut.getToken?.()) {
      setError('Sign in before completing your account.');
      return;
    }
    setLoading(true);
    try {
      await window.strut.savePassword(password, {
        firstName: first,
        lastName: last,
        gender,
        email: emailValue,
        phone: phoneValue,
        confirmPassword,
      });
      try {
        window.pathwai?.user?.mergeProfile?.({
          email: emailValue,
          firstName: first,
          lastName: last,
          phone: phoneValue,
        });
      } catch { /* ignore */ }
      advance({
        profileComplete: true,
        skipped: false,
        firstName: first,
        lastName: last,
        gender,
        email: emailValue,
        phone: phoneValue,
      });
    } catch (e: any) {
      setError((e && e.body && e.body.Message) || (e instanceof Error ? e.message : 'Could not save your account.'));
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="strut-profile">
      <style>{STYLES}</style>
      <div className="strut-profile__wrap">
        <h1 className="strut-profile__heading">Complete your free account</h1>
        <p className="strut-profile__sub">All fields are required.</p>
        <div className="strut-profile__row">
          <div className="strut-profile__field">
            <input className="strut-profile__input" placeholder="First name*" value={firstName} autoComplete="given-name" onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="strut-profile__field">
            <input className="strut-profile__input" placeholder="Last name*" value={lastName} autoComplete="family-name" onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div className="strut-profile__field">
          <select
            className="strut-profile__select"
            value={gender}
            onChange={(e) => {
              const next = e.target.value;
              setGender(next);
              rememberGender(next);
            }}
            style={{ color: gender ? '#161336' : '#707070' }}
          >
            <option value="" disabled>Gender*</option>
            {GENDERS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>
        <div className="strut-profile__field">
          <input className="strut-profile__input" placeholder="Phone*" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(formatUsPhone(e.target.value))} />
        </div>
        <div className="strut-profile__field">
          <input className="strut-profile__input" placeholder="Email*" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="strut-profile__field strut-profile__password">
          <input className="strut-profile__input" placeholder="Password*" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="strut-profile__eye" onClick={() => setShowPassword((v) => !v)}>{showPassword ? 'Hide' : 'Show'}</button>
        </div>
        <div className="strut-profile__field strut-profile__password">
          <input className="strut-profile__input" placeholder="Confirm password*" type={showConfirm ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button type="button" className="strut-profile__eye" onClick={() => setShowConfirm((v) => !v)}>{showConfirm ? 'Hide' : 'Show'}</button>
        </div>
        <p className="strut-profile__note">Use at least 8 characters. Don’t use a password from another site, or something too obvious like your pet’s name.</p>
        <label className="strut-profile__consent">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>
            By creating an account, I agree to the{' '}
            <a target="_blank" rel="noreferrer" href="https://www.struthealth.com/telemedicine-consent?_gl=1*mj0uer*_gcl_au*MjEzODIxNjQ2My4xNzkyNTY1NDUy">Telemedicine Consent</a>,{' '}
            <a target="_blank" rel="noreferrer" href="https://www.struthealth.com/privacy-policy?_gl=1*14bje5y*_gcl_au*MjEzODIxNjQ2My4xNzkyNTY1NDUy">Privacy Policy</a>,{' '}
            <a target="_blank" rel="noreferrer" href="https://www.struthealth.com/refund-policy?_gl=1*1p8r0up*_gcl_au*MjEzODIxNjQ2My4xNzkyNTY1NDUy">Refund Policy</a>
            {' '}and{' '}
            <a target="_blank" rel="noreferrer" href="https://www.struthealth.com/terms-and-conditions?_gl=1*1p8r0up*_gcl_au*MjEzODIxNjQ2My4xNzkyNTY1NDUy">Terms & Conditions</a>
          </span>
        </label>
        {error ? <div className="strut-profile__error" role="alert">{error}</div> : null}
        <div className="strut-profile__actions">
          <button type="button" className="strut-profile__btn strut-profile__back" onClick={goBack}>Back</button>
          <button type="button" className="strut-profile__btn strut-profile__continue" disabled={loading} onClick={submit}>{loading ? 'Saving…' : 'Continue'}</button>
        </div>
      </div>
    </div>
  );
}

export const propSchema = {};

export const outputSchema = {
  profileComplete: { type: 'boolean', title: 'Profile saved' },
  skipped: { type: 'boolean', title: 'Already had a profile and password' },
  firstName: { type: 'string', title: 'First name' },
  lastName: { type: 'string', title: 'Last name' },
  gender: { type: 'string', title: 'Gender (0 unknown, 1 male, 2 female, 3 other)' },
  email: { type: 'string', title: 'Email' },
  phone: { type: 'string', title: 'Phone' },
};
