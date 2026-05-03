import { useState, useEffect } from "react";

// ─── Color tokens from TenebraTrack logo ───────────────────────────────────
// Navy:  #0D2137  (primary dark)
// Mint:  #00C896 → #00E5B4 (accent gradient)
// ──────────────────────────────────────────────────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:        #0D2137;
    --navy-mid:    #122840;
    --navy-light:  #1a3a55;
    --navy-border: #1e4060;
    --mint:        #00C896;
    --mint-light:  #00E5B4;
    --mint-dim:    rgba(0,200,150,0.12);
    --mint-glow:   rgba(0,200,150,0.25);
    --white:       #FFFFFF;
    --gray-100:    #f0f4f8;
    --gray-300:    #94a3b8;
    --gray-400:    #64748b;
    --danger:      #ff5c7a;
    --font-display: 'Syne', sans-serif;
    --font-body:    'DM Sans', sans-serif;
    --radius-sm:   8px;
    --radius-md:   16px;
    --radius-lg:   24px;
    --transition:  all 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
  }

  body {
    font-family: var(--font-body);
    background: var(--navy);
    color: var(--white);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Layout ── */
  .auth-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
  }

  /* ── Left Panel ── */
  .left-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    overflow: hidden;
    background: linear-gradient(145deg, #0a1c2e 0%, #0D2137 50%, #0f2a42 100%);
  }

  .left-panel::before {
    content: '';
    position: absolute;
    top: -120px; left: -120px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,150,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .left-panel::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 380px; height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,180,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Grid decorative dots */
  .dot-grid {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image:
      radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  .left-top { position: relative; z-index: 1; }
  .left-bottom { position: relative; z-index: 1; }

  /* Brand logo area */
  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .brand-logo-wrap {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--mint) 0%, var(--mint-light) 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 24px var(--mint-glow);
    flex-shrink: 0;
  }

  .brand-logo-wrap svg { width: 28px; height: 28px; }

  .brand-name {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .brand-name span { color: var(--mint); }
  .brand-sub {
    font-size: 10px;
    color: var(--gray-300);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-top: 2px;
    font-weight: 500;
  }

  /* Hero text */
  .hero-block {
    margin-top: 64px;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--mint-dim);
    border: 1px solid rgba(0,200,150,0.3);
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 11px;
    font-weight: 600;
    color: var(--mint-light);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  .hero-badge::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--mint);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.7); }
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(32px, 3.5vw, 48px);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
  }

  .hero-title .accent {
    background: linear-gradient(90deg, var(--mint) 0%, var(--mint-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-desc {
    font-size: 15px;
    color: var(--gray-300);
    line-height: 1.7;
    max-width: 380px;
    font-weight: 300;
  }

  /* Stats row */
  .stats-row {
    display: flex;
    gap: 32px;
    margin-top: 48px;
  }

  .stat-item { }
  .stat-num {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .stat-num span { color: var(--mint); }
  .stat-label {
    font-size: 11px;
    color: var(--gray-400);
    margin-top: 4px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* Floating card */
  .float-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--radius-md);
    padding: 20px 24px;
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
    animation: float 4s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }

  .float-icon {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: var(--mint-dim);
    border: 1px solid rgba(0,200,150,0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--mint);
    flex-shrink: 0;
  }

  .float-text-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--white);
  }

  .float-text-sub {
    font-size: 11px;
    color: var(--gray-300);
    margin-top: 2px;
  }

  .float-amount {
    margin-left: auto;
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 700;
    color: var(--mint);
  }

  /* ── Right Panel (Form) ── */
  .right-panel {
    background: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 56px;
    position: relative;
    overflow: hidden;
  }

  .right-panel::before {
    content: '';
    position: absolute;
    top: -100px; right: -100px;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,150,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .form-container {
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
  }

  /* Tab switcher */
  .tab-switch {
    display: flex;
    background: var(--gray-100);
    border-radius: var(--radius-sm);
    padding: 4px;
    margin-bottom: 36px;
  }

  .tab-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    background: transparent;
    color: var(--gray-400);
  }

  .tab-btn.active {
    background: var(--navy);
    color: var(--white);
    box-shadow: 0 2px 12px rgba(13,33,55,0.25);
  }

  /* Form heading */
  .form-heading {
    margin-bottom: 28px;
  }

  .form-title {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 800;
    color: var(--navy);
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 6px;
  }

  .form-title span {
    color: var(--mint);
  }

  .form-subtitle {
    font-size: 14px;
    color: var(--gray-400);
    font-weight: 400;
  }

  /* Field */
  .field-group {
    margin-bottom: 18px;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 18px;
  }

  .field-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 8px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .field-wrap {
    position: relative;
  }

  .field-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-300);
    width: 16px; height: 16px;
    pointer-events: none;
    transition: color 0.2s;
  }

  .field-input {
    width: 100%;
    padding: 13px 14px 13px 42px;
    border: 1.5px solid #e2e8f0;
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--navy);
    background: #fafbfc;
    transition: var(--transition);
    outline: none;
  }

  .field-input::placeholder { color: #b0bec5; }

  .field-input:focus {
    border-color: var(--mint);
    background: var(--white);
    box-shadow: 0 0 0 3px var(--mint-dim);
  }

  .field-input:focus + .field-icon,
  .field-wrap:focus-within .field-icon {
    color: var(--mint);
  }

  .field-icon { left: 14px; }
  .field-input { padding-left: 42px; }

  /* eye toggle */
  .eye-toggle {
    position: absolute;
    right: 14px;
    top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--gray-300);
    padding: 0;
    display: flex; align-items: center;
    transition: color 0.2s;
  }
  .eye-toggle:hover { color: var(--navy); }

  /* Error */
  .field-error {
    font-size: 11px;
    color: var(--danger);
    margin-top: 5px;
    font-weight: 500;
    display: flex; align-items: center; gap: 4px;
  }

  /* Forgot */
  .forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-top: -10px;
    margin-bottom: 20px;
  }

  .forgot-link {
    font-size: 12px;
    font-weight: 600;
    color: var(--mint);
    text-decoration: none;
    letter-spacing: 0.02em;
  }
  .forgot-link:hover { text-decoration: underline; }

  /* Submit button */
  .btn-submit {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, var(--navy) 0%, #1a3a55 100%);
    color: var(--white);
    border: none;
    border-radius: var(--radius-sm);
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(13,33,55,0.3);
  }

  .btn-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--mint) 0%, var(--mint-light) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .btn-submit:hover::before { opacity: 1; }
  .btn-submit:hover { box-shadow: 0 6px 28px var(--mint-glow); transform: translateY(-1px); }
  .btn-submit:active { transform: translateY(0); }

  .btn-submit span { position: relative; z-index: 1; }

  .btn-submit.loading { pointer-events: none; opacity: 0.8; }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
    color: var(--gray-300);
    font-size: 12px;
    font-weight: 500;
  }
  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  /* Google btn */
  .btn-google {
    width: 100%;
    padding: 13px;
    background: var(--white);
    border: 1.5px solid #e2e8f0;
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    color: var(--navy);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: var(--transition);
  }
  .btn-google:hover { border-color: var(--navy); background: var(--gray-100); }

  /* Terms */
  .terms-text {
    font-size: 11px;
    color: var(--gray-300);
    text-align: center;
    margin-top: 20px;
    line-height: 1.6;
  }
  .terms-text a { color: var(--mint); text-decoration: none; font-weight: 600; }

  /* Progress dots for register */
  .progress-dots {
    display: flex;
    gap: 6px;
    margin-bottom: 28px;
  }
  .prog-dot {
    height: 4px;
    border-radius: 100px;
    background: #e2e8f0;
    transition: all 0.3s ease;
  }
  .prog-dot.active {
    background: var(--mint);
    width: 24px !important;
  }

  /* Strength meter */
  .strength-meter {
    margin-top: 8px;
    display: flex;
    gap: 4px;
  }
  .strength-bar {
    height: 3px;
    flex: 1;
    border-radius: 100px;
    background: #e2e8f0;
    transition: all 0.3s ease;
  }
  .strength-bar.weak   { background: #ff5c7a; }
  .strength-bar.medium { background: #f59e0b; }
  .strength-bar.strong { background: var(--mint); }

  /* Success toast */
  .toast {
    position: fixed;
    top: 24px; right: 24px;
    background: var(--navy);
    border: 1px solid rgba(0,200,150,0.3);
    border-radius: var(--radius-sm);
    padding: 14px 20px;
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; font-weight: 600;
    color: var(--white);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 999;
    animation: slide-in 0.4s cubic-bezier(0.34,1.2,0.64,1);
  }
  @keyframes slide-in {
    from { transform: translateX(120px); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  .toast-icon { color: var(--mint); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .auth-root {
      grid-template-columns: 1fr;
    }
    .left-panel {
      display: none;
    }
    .right-panel {
      padding: 40px 24px;
      min-height: 100vh;
      align-items: flex-start;
      padding-top: 60px;
    }
    .form-container { max-width: 100%; }
  }

  @media (max-width: 480px) {
    .right-panel { padding: 40px 20px; }
    .field-row { grid-template-columns: 1fr; }
  }
`;

// ── Icons ─────────────────────────────────────────────────────────────────
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
  </svg>
);
const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.17 3.38 2 2 0 0 1 3.14 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
  </svg>
);

// TenebraTrack Logo SVG inline
const LogoIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="18" fontFamily="sans-serif" fontWeight="900" fontSize="14" fill="#0D2137">Rp</text>
    <polyline points="6,22 12,14 17,18 24,8" stroke="#0D2137" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <polyline points="21,8 24,8 24,11" stroke="#0D2137" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// Google logo
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

// ── Password strength ─────────────────────────────────────────────────────
function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

function StrengthMeter({ password }) {
  const s = getStrength(password);
  const labels = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
  const colors = ["", "weak", "medium", "strong", "strong"];
  return (
    <div>
      <div className="strength-meter">
        {[1,2,3,4].map(i => (
          <div key={i} className={`strength-bar ${i <= s ? colors[s] : ""}`} />
        ))}
      </div>
      {password && (
        <div style={{ fontSize: 11, marginTop: 4, color: s >= 3 ? "var(--mint)" : s === 2 ? "#f59e0b" : "var(--danger)", fontWeight: 600 }}>
          {labels[s]}
        </div>
      )}
    </div>
  );
}

// ── Login Form ────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!email) e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Format email tidak valid";
    if (!password) e.password = "Password wajib diisi";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    onSuccess("Login berhasil! Selamat datang kembali 👋");
  }

  return (
    <>
      <div className="form-heading">
        <div className="form-title">Selamat <span>Datang</span></div>
        <div className="form-subtitle">Masuk ke akun TenebraTrack Anda</div>
      </div>

      <div className="field-group">
        <label className="field-label">Email</label>
        <div className="field-wrap">
          <div className="field-icon"><IconMail /></div>
          <input
            className="field-input"
            type="email"
            placeholder="nama@perusahaan.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: "" })); }}
          />
        </div>
        {errors.email && <div className="field-error">⚠ {errors.email}</div>}
      </div>

      <div className="field-group">
        <label className="field-label">Password</label>
        <div className="field-wrap">
          <div className="field-icon"><IconLock /></div>
          <input
            className="field-input"
            type={showPw ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: "" })); }}
            style={{ paddingRight: 44 }}
          />
          <button className="eye-toggle" onClick={() => setShowPw(!showPw)} type="button">
            {showPw ? <IconEyeOff /> : <IconEye />}
          </button>
        </div>
        {errors.password && <div className="field-error">⚠ {errors.password}</div>}
      </div>

      <div className="forgot-row">
        <a href="#" className="forgot-link">Lupa password?</a>
      </div>

      <button className={`btn-submit ${loading ? "loading" : ""}`} onClick={handleSubmit}>
        <span>{loading ? "Memproses..." : "Masuk ke Dashboard"}</span>
      </button>

      <div className="divider">atau masuk dengan</div>

      <button className="btn-google">
        <GoogleIcon />
        Lanjutkan dengan Google
      </button>

      <div className="terms-text">
        Dengan masuk, Anda menyetujui <a href="#">Syarat & Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> kami
      </div>
    </>
  );
}

// ── Register Form ─────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }) {
  const [step, setStep] = useState(1); // 1 = personal, 2 = company
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstName: "", lastName: "",
    email: "", phone: "",
    password: "",
    companyName: "", businessType: "",
  });

  function update(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  }

  function validateStep1() {
    const e = {};
    if (!form.firstName) e.firstName = "Nama depan wajib diisi";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email tidak valid";
    if (!form.password || form.password.length < 8) e.password = "Min. 8 karakter";
    return e;
  }

  function validateStep2() {
    const e = {};
    if (!form.companyName) e.companyName = "Nama bisnis wajib diisi";
    return e;
  }

  async function handleNext() {
    if (step === 1) {
      const e = validateStep1();
      setErrors(e);
      if (!Object.keys(e).length) setStep(2);
    } else {
      const e = validateStep2();
      setErrors(e);
      if (!Object.keys(e).length) {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1600));
        setLoading(false);
        onSuccess("Akun berhasil dibuat! Cek email untuk verifikasi ✉️");
      }
    }
  }

  const businessTypes = ["Retail / Toko", "F&B / Kuliner", "Jasa / Servis", "Manufaktur", "Perdagangan", "Lainnya"];

  return (
    <>
      <div className="progress-dots">
        {[1,2].map(i => (
          <div key={i} className="prog-dot" style={{ width: i === step ? 24 : 8, ...(i <= step ? { background: "var(--mint)" } : {}) }} />
        ))}
        <div style={{ fontSize: 11, color: "var(--gray-400)", marginLeft: "auto", fontWeight: 600 }}>
          Langkah {step} dari 2
        </div>
      </div>

      <div className="form-heading">
        <div className="form-title">
          {step === 1 ? <>Buat <span>Akun</span></> : <>Info <span>Bisnis</span></>}
        </div>
        <div className="form-subtitle">
          {step === 1 ? "Gratis 14 hari, tanpa kartu kredit" : "Bantu kami mengenal bisnis Anda"}
        </div>
      </div>

      {step === 1 && (
        <>
          <div className="field-row">
            <div>
              <label className="field-label">Nama Depan</label>
              <div className="field-wrap">
                <div className="field-icon"><IconUser /></div>
                <input className="field-input" placeholder="Nama Depan" value={form.firstName} onChange={e => update("firstName", e.target.value)} />
              </div>
              {errors.firstName && <div className="field-error">⚠ {errors.firstName}</div>}
            </div>
            <div>
              <label className="field-label">Nama Belakang</label>
              <div className="field-wrap">
                <div className="field-icon"><IconUser /></div>
                <input className="field-input" placeholder="Nama Belakang" value={form.lastName} onChange={e => update("lastName", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Email</label>
            <div className="field-wrap">
              <div className="field-icon"><IconMail /></div>
              <input className="field-input" type="email" placeholder="nama@bisnis.com" value={form.email} onChange={e => update("email", e.target.value)} />
            </div>
            {errors.email && <div className="field-error">⚠ {errors.email}</div>}
          </div>

          <div className="field-group">
            <label className="field-label">No. WhatsApp</label>
            <div className="field-wrap">
              <div className="field-icon"><IconPhone /></div>
              <input className="field-input" placeholder="08xxxxxxxxxx" value={form.phone} onChange={e => update("phone", e.target.value)} />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <div className="field-wrap">
              <div className="field-icon"><IconLock /></div>
              <input
                className="field-input"
                type={showPw ? "text" : "password"}
                placeholder="Min. 8 karakter"
                value={form.password}
                onChange={e => update("password", e.target.value)}
                style={{ paddingRight: 44 }}
              />
              <button className="eye-toggle" onClick={() => setShowPw(!showPw)} type="button">
                {showPw ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            <StrengthMeter password={form.password} />
            {errors.password && <div className="field-error">⚠ {errors.password}</div>}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="field-group">
            <label className="field-label">Nama Bisnis / Toko</label>
            <div className="field-wrap">
              <div className="field-icon"><IconBuilding /></div>
              <input className="field-input" placeholder="CV. Maju Bersama" value={form.companyName} onChange={e => update("companyName", e.target.value)} />
            </div>
            {errors.companyName && <div className="field-error">⚠ {errors.companyName}</div>}
          </div>

          <div className="field-group">
            <label className="field-label">Jenis Usaha</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 2 }}>
              {businessTypes.map(bt => (
                <button
                  key={bt}
                  type="button"
                  onClick={() => update("businessType", bt)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1.5px solid ${form.businessType === bt ? "var(--mint)" : "#e2e8f0"}`,
                    background: form.businessType === bt ? "var(--mint-dim)" : "var(--gray-100)",
                    color: form.businessType === bt ? "var(--mint)" : "var(--gray-400)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {form.businessType === bt && <IconCheck />} {bt}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            background: "linear-gradient(135deg, rgba(0,200,150,0.08) 0%, rgba(0,229,180,0.05) 100%)",
            border: "1px solid rgba(0,200,150,0.2)",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 20,
            display: "flex",
            gap: 10,
            alignItems: "flex-start"
          }}>
            <div style={{ color: "var(--mint)", marginTop: 1, flexShrink: 0 }}><IconCheck /></div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 2 }}>Uji Coba Gratis 14 Hari</div>
              <div style={{ fontSize: 11, color: "var(--gray-400)", lineHeight: 1.5 }}>
                Akses penuh semua fitur. Tidak perlu kartu kredit. Batalkan kapan saja.
              </div>
            </div>
          </div>
        </>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              padding: "15px 20px",
              border: "1.5px solid #e2e8f0",
              borderRadius: 8,
              background: "white",
              color: "var(--navy)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "var(--font-body)",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            ← Kembali
          </button>
        )}
        <button className={`btn-submit ${loading ? "loading" : ""}`} onClick={handleNext} style={{ flex: 1 }}>
          <span>{loading ? "Membuat akun..." : step === 1 ? "Lanjut →" : "Buat Akun Gratis"}</span>
        </button>
      </div>

      <div className="terms-text">
        Dengan mendaftar, Anda menyetujui <a href="#">Syarat & Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> kami
      </div>
    </>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="toast">
      <span className="toast-icon"><IconCheck /></span>
      {message}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [toast, setToast] = useState(null);

  return (
    <>
      <style>{STYLES}</style>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="auth-root">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="dot-grid" />

          <div className="left-top">
            <div className="brand">
              <div className="brand-logo-wrap">
                <LogoIcon />
              </div>
              <div>
                <div className="brand-name">TENEBRA<span>TRACK</span></div>
                <div className="brand-sub">Financial Tracker</div>
              </div>
            </div>

            <div className="hero-block">
              <div className="hero-badge">Platform Keuangan UMKM #1</div>
              <div className="hero-title">
                Kendalikan<br />
                Keuangan Bisnis<br />
                <span className="accent">Lebih Cerdas</span>
              </div>
              <div className="hero-desc">
                Dari kasir harian hingga laporan laba rugi — semua dalam satu platform yang mudah digunakan siapa saja, tanpa perlu jadi akuntan.
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-num">12<span>K+</span></div>
                <div className="stat-label">UMKM Aktif</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">Rp<span>2T+</span></div>
                <div className="stat-label">Transaksi Diproses</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">4<span>.9★</span></div>
                <div className="stat-label">Rating Pengguna</div>
              </div>
            </div>
          </div>

          <div className="left-bottom">
            <div className="float-card">
              <div className="float-icon"><IconChart /></div>
              <div>
                <div className="float-text-title">Pendapatan Bulan Ini</div>
                <div className="float-text-sub">↑ 24% dari bulan lalu</div>
              </div>
              <div className="float-amount">Rp 48,5jt</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="form-container">
            <div className="tab-switch">
              <button className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>
                Masuk
              </button>
              <button className={`tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>
                Daftar Gratis
              </button>
            </div>

            {tab === "login"
              ? <LoginForm onSuccess={msg => setToast(msg)} />
              : <RegisterForm onSuccess={msg => { setToast(msg); setTimeout(() => setTab("login"), 2000); }} />
            }
          </div>
        </div>
      </div>
    </>
  );
}