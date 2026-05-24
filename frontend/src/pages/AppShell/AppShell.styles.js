export const STYLES = `
  /* ── Layout ── */
  .app-layout {
    padding-top: 64px;
    min-height: 100vh;
    background: #f0f4f8;
  }

  .app-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 28px 24px 48px;
  }

  @media (max-width: 768px) {
    .app-container {
      padding: 16px 16px 32px;
    }
  }

  /* ── Navbar ── */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: #0D2137;
    display: flex;
    align-items: center;
    padding: 0 24px;
    z-index: 100;
    gap: 8;
    box-shadow: 0 2px 20px rgba(0,0,0,0.25);
    border-top: 2px solid #00C896;
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 10;
    margin-right: 32px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .brand-logo {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: linear-gradient(135deg,#00C896,#00E5B4);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 16px rgba(0,200,150,0.3);
  }

  .brand-logo span {
    font-size: 14px;
    font-weight: 900;
    color: #0D2137;
    font-family: serif;
  }

  .brand-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 17px;
    color: white;
    letter-spacing: -0.02em;
  }

  .brand-text span {
    color: #00C896;
  }

  /* Desktop nav links */
  .nav-links-desktop {
    display: flex;
    gap: 2;
    flex: 1;
  }

  .nav-link {
    padding: 8px 13px;
    border-radius: 7px;
    border: none;
    background: none;
    color: rgba(255,255,255,0.5);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }

  .nav-link.active {
    background: rgba(0,200,150,0.15);
    color: white;
    border-bottom-color: #00C896;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 10;
    margin-left: auto;
  }

  .tenant-name {
    font-size: 11px;
    color: rgba(255,255,255,0.4);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .avatar-wrapper {
    position: relative;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    cursor: pointer;
    background: linear-gradient(135deg,#00C896,#00E5B4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 13px;
    color: #0D2137;
    transition: all 0.2s;
  }

  /* Dropdown */
  .dropdown-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 210px;
    background: #122840;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 8px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
    z-index: 200;
    animation: drop-in 0.2s ease;
  }

  .dropdown-header {
    padding: 10px 12px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    margin-bottom: 6px;
  }

  .dropdown-name {
    font-weight: 700;
    color: white;
    font-size: 13px;
    font-family: 'Syne', sans-serif;
  }

  .dropdown-email {
    font-size: 11px;
    color: #64748b;
    margin-top: 2px;
  }

  .dropdown-role {
    display: inline-block;
    margin-top: 6px;
    background: rgba(0,200,150,0.12);
    border: 1px solid rgba(0,200,150,0.25);
    color: #00C896;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 100;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .dropdown-item {
    display: block;
    width: 100%;
    padding: 9px 12px;
    background: none;
    border: none;
    text-align: left;
    color: rgba(255,255,255,0.65);
    font-size: 13px;
    cursor: pointer;
    border-radius: 7;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }

  .dropdown-item:hover {
    background: rgba(255,255,255,0.07);
  }

  .dropdown-item.logout {
    color: #ff5c7a;
  }

  .dropdown-item.logout:hover {
    background: rgba(255,92,122,0.1);
  }

  .dropdown-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 6px 0;
  }

  /* Hamburger — hidden desktop */
  .hamburger {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
  }

  /* Mobile Menu */
  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #0D2137;
    z-index: 999;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    animation: slide-in 0.3s ease;
  }

  .mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .mobile-menu-header button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
  }

  .mobile-nav-link {
    padding: 14px 0;
    background: none;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.6);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    text-align: left;
    transition: all 0.2s;
  }

  .mobile-nav-link.active {
    color: #00C896;
    font-weight: 700;
  }

  .mobile-menu-footer {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
    color: white;
    font-size: 14px;
    font-weight: 600;
  }

  .mobile-menu-email {
    font-size: 12px;
    color: #64748b;
    margin-top: 4px;
    margin-bottom: 16px;
  }

  .mobile-logout {
    width: 100%;
    padding: 12px;
    background: rgba(255,92,122,0.1);
    border: 1px solid rgba(255,92,122,0.2);
    border-radius: 8;
    color: #ff5c7a;
    font-weight: 700;
    cursor: pointer;
    font-size: 14px;
  }

  /* ── Responsive Breakpoints ── */
  @media (max-width: 1024px) {
    .nav-links-desktop {
      display: none;
    }
    
    .tenant-name {
      display: none;
    }
    
    .hamburger {
      display: block;
    }
  }

  @media (max-width: 768px) {
    .navbar {
      padding: 0 16px;
    }
    
    .navbar-brand {
      margin-right: auto;
    }
  }

  /* ── Dashboard Responsive ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }

  .charts-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 1024px) {
    .charts-grid {
      grid-template-columns: 1fr;
    }
  }

  .grid-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 900px) {
    .grid-2col {
      grid-template-columns: 1fr;
    }
  }

  /* Trial banner responsive */
  .trial-banner {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
  }

  @media (max-width: 640px) {
    .trial-banner {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    
    .trial-banner button {
      width: 100%;
    }
  }

  /* Page header responsive */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    gap: 16px;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    .page-header {
      flex-direction: column;
      gap: 12px;
    }
    
    .page-header .actions {
      width: 100%;
    }
    
    .page-header .actions button {
      flex: 1;
    }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes drop-in {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes slide-in {
    from { opacity: 0; transform: translateX(100%); }
    to   { opacity: 1; transform: translateX(0); }
  }
`;