export const STYLES = `
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

  .dot-grid {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  .left-top { position: relative; z-index: 1; }
  .left-bottom { position: relative; z-index: 1; }

  /* Brand */
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

  /* Hero */
  .hero-block { margin-top: 64px; }

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

  /* Stats */
  .stats-row {
    display: flex;
    gap: 32px;
    margin-top: 48px;
  }

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

  /* ── Right Panel ── */
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
  .form-heading { margin-bottom: 28px; }

  .form-title {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 800;
    color: var(--navy);
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 6px;
  }

  .form-title span { color: var(--mint); }

  .form-subtitle {
    font-size: 14px;
    color: var(--gray-400);
    font-weight: 400;
  }

  /* Field */
  .field-group { margin-bottom: 18px; }
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

  .field-wrap { position: relative; }

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
  .divider::before, .divider::after {
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

  /* Progress dots */
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
    .auth-root { grid-template-columns: 1fr; }
    .left-panel { display: none; }
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