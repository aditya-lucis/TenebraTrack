import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../AppShell.utils";

export function Navbar({ user, initials, tenantName, dropOpen, onToggleDrop, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activePage = location.pathname.split("/")[1] || "dashboard";

  return (
    <>
      <nav className="navbar">
        {/* Brand */}
        <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
          <div className="brand-logo">
            <span>₨</span>
          </div>
          <div className="brand-text">
            TENEBRA<span>TRACK</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="nav-links-desktop">
          {NAV_ITEMS.map(({ key, label }) => (
            <button
              key={key}
              className={`nav-link ${activePage === key ? "active" : ""}`}
              onClick={() => navigate(`/${key}`)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right: tenant + avatar */}
        <div className="nav-right">
          {tenantName && <span className="tenant-name">{tenantName}</span>}
          
          <div className="avatar-wrapper">
            <div className="avatar" onClick={onToggleDrop}>
              {initials}
            </div>
            
            {dropOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-name">{user?.first_name} {user?.last_name}</div>
                  <div className="dropdown-email">{user?.email}</div>
                  <span className="dropdown-role">{user?.role}</span>
                </div>
                {["Profil Saya", "Pengaturan"].map(label => (
                  <button key={label} className="dropdown-item">{label}</button>
                ))}
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={onLogout}>
                  Keluar
                </button>
              </div>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button 
            className="hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <div className="brand-text">TENEBRA<span>TRACK</span></div>
            <button onClick={() => setMobileOpen(false)}>✕</button>
          </div>
          {NAV_ITEMS.map(({ key, label }) => (
            <button
              key={key}
              className={`mobile-nav-link ${activePage === key ? "active" : ""}`}
              onClick={() => {
                navigate(`/${key}`);
                setMobileOpen(false);
              }}
            >
              {label}
            </button>
          ))}
          <div className="mobile-menu-footer">
            <div>{user?.first_name} {user?.last_name}</div>
            <div className="mobile-menu-email">{user?.email}</div>
            <button className="mobile-logout" onClick={onLogout}>
              Keluar
            </button>
          </div>
        </div>
      )}
    </>
  );
}