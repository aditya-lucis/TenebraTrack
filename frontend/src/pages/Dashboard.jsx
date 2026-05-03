import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ─────────────────────────────────────────────
   DESIGN TOKENS — TenebraTrack
───────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy:         #0D2137;
  --navy-mid:     #122840;
  --navy-light:   #1a3a55;
  --navy-border:  rgba(255,255,255,0.08);
  --mint:         #00C896;
  --mint-light:   #00E5B4;
  --mint-dim:     rgba(0,200,150,0.12);
  --mint-glow:    rgba(0,200,150,0.25);
  --white:        #FFFFFF;
  --bg:           #f0f4f8;
  --bg-card:      #FFFFFF;
  --text-main:    #0D2137;
  --text-sub:     #64748b;
  --text-muted:   #94a3b8;
  --border:       #e2e8f0;
  --danger:       #ff5c7a;
  --warning:      #f59e0b;
  --info:         #3b82f6;
  --font-display: 'Syne', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --radius-sm:    8px;
  --radius-md:    16px;
  --radius-lg:    24px;
  --shadow-sm:    0 1px 4px rgba(13,33,55,0.06);
  --shadow-md:    0 4px 20px rgba(13,33,55,0.10);
  --shadow-lg:    0 8px 40px rgba(13,33,55,0.14);
  --transition:   all 0.25s cubic-bezier(0.34,1.2,0.64,1);
}

html, body, #root { height: 100%; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text-main);
  min-height: 100vh;
}

/* ══════════════════════════════════
   NAVBAR
══════════════════════════════════ */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 64px;
  background: var(--navy);
  display: flex;
  align-items: center;
  padding: 0 24px;
  z-index: 100;
  gap: 0;
  box-shadow: 0 2px 20px rgba(0,0,0,0.25);
}

/* Subtle top accent line */
.navbar::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--mint) 0%, var(--mint-light) 50%, transparent 100%);
}

/* Brand */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
  margin-right: 36px;
}

.nav-logo-box {
  width: 34px; height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, var(--mint) 0%, var(--mint-light) 100%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 16px var(--mint-glow);
}

.nav-brand-name {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.02em;
  line-height: 1;
}
.nav-brand-name span { color: var(--mint); }

/* Nav links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  cursor: pointer;
  transition: var(--transition);
  border: none;
  background: none;
  font-family: var(--font-body);
  white-space: nowrap;
  position: relative;
}

.nav-link:hover {
  color: var(--white);
  background: rgba(255,255,255,0.07);
}

.nav-link.active {
  color: var(--white);
  background: rgba(0,200,150,0.15);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 50%;
  transform: translateX(-50%);
  width: 20px; height: 2px;
  border-radius: 100px;
  background: var(--mint);
}

.nav-link svg { width: 15px; height: 15px; flex-shrink: 0; }

/* Nav badge */
.nav-badge {
  background: var(--danger);
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 100px;
  margin-left: 2px;
}

/* Nav right */
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
}

/* Period selector */
.period-select {
  display: flex;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

.period-btn {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  transition: all 0.2s;
}
.period-btn.active {
  background: var(--mint);
  color: var(--navy);
}

/* Notif bell */
.nav-icon-btn {
  width: 36px; height: 36px;
  border-radius: 9px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: rgba(255,255,255,0.6);
  position: relative;
  transition: var(--transition);
}
.nav-icon-btn:hover { background: rgba(255,255,255,0.12); color: white; }
.nav-icon-btn svg { width: 16px; height: 16px; }

.notif-dot {
  position: absolute;
  top: 7px; right: 7px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--danger);
  border: 1.5px solid var(--navy);
}

/* Avatar */
.nav-avatar {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--mint) 0%, var(--mint-light) 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 800;
  color: var(--navy);
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
  transition: var(--transition);
}
.nav-avatar:hover { border-color: var(--mint); }

/* Dropdown */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 220px;
  background: var(--navy-mid);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-md);
  padding: 8px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  z-index: 200;
  animation: drop-in 0.2s cubic-bezier(0.34,1.2,0.64,1);
}

@keyframes drop-in {
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}

.dropdown-header {
  padding: 10px 12px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  margin-bottom: 6px;
}

.dropdown-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--white);
  font-family: var(--font-display);
}
.dropdown-email { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.dropdown-role {
  display: inline-block;
  margin-top: 6px;
  background: var(--mint-dim);
  border: 1px solid rgba(0,200,150,0.25);
  color: var(--mint);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 100px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: rgba(255,255,255,0.65);
  cursor: pointer;
  transition: all 0.15s;
  border: none;
  background: none;
  width: 100%;
  font-family: var(--font-body);
  text-align: left;
}
.dropdown-item:hover { background: rgba(255,255,255,0.07); color: white; }
.dropdown-item.danger { color: var(--danger); }
.dropdown-item.danger:hover { background: rgba(255,92,122,0.1); }
.dropdown-item svg { width: 14px; height: 14px; }
.dropdown-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 6px 0; }

/* Mobile hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  padding: 8px;
  border: none;
  background: none;
  margin-left: auto;
}
.hamburger span {
  display: block;
  width: 20px; height: 2px;
  background: rgba(255,255,255,0.7);
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Mobile nav drawer */
.mobile-nav {
  position: fixed;
  top: 64px; left: 0; right: 0;
  background: var(--navy-mid);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding: 12px 16px 20px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: slide-down 0.25s ease;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.mobile-nav .nav-link {
  width: 100%;
  justify-content: flex-start;
  padding: 11px 14px;
}

/* ══════════════════════════════════
   MAIN LAYOUT
══════════════════════════════════ */
.app-shell {
  padding-top: 64px;
  min-height: 100vh;
}

.page-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 28px 24px 48px;
}

/* Page header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 16px;
}

.page-title-block {}
.page-greeting {
  font-size: 13px;
  color: var(--text-sub);
  font-weight: 500;
  margin-bottom: 4px;
}
.page-title {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.5vw, 30px);
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.03em;
  line-height: 1.1;
}
.page-title span { color: var(--mint); }

.page-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--mint) 0%, var(--mint-light) 100%);
  color: var(--navy);
  box-shadow: 0 4px 20px var(--mint-glow);
  transform: translateY(-1px);
}
.btn-primary svg { width: 15px; height: 15px; }

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 16px;
  background: var(--white);
  color: var(--text-main);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}
.btn-secondary:hover { border-color: var(--mint); color: var(--mint); }
.btn-secondary svg { width: 15px; height: 15px; }

/* ══════════════════════════════════
   STAT CARDS (top row)
══════════════════════════════════ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 22px 22px 18px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  cursor: default;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.stat-card.mint::before  { background: linear-gradient(90deg, var(--mint), var(--mint-light)); }
.stat-card.blue::before  { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.stat-card.orange::before{ background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.stat-card.red::before   { background: linear-gradient(90deg, #ff5c7a, #ff8fa3); }

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.stat-icon {
  width: 42px; height: 42px;
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
}
.stat-icon svg { width: 20px; height: 20px; }

.stat-icon.mint   { background: var(--mint-dim); color: var(--mint); }
.stat-icon.blue   { background: rgba(59,130,246,0.1); color: #3b82f6; }
.stat-icon.orange { background: rgba(245,158,11,0.1); color: #f59e0b; }
.stat-icon.red    { background: rgba(255,92,122,0.1); color: var(--danger); }

.stat-change {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 100px;
}
.stat-change.up   { background: rgba(0,200,150,0.1); color: var(--mint); }
.stat-change.down { background: rgba(255,92,122,0.1); color: var(--danger); }

.stat-value {
  font-family: var(--font-display);
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-sub);
  font-weight: 500;
}

.stat-mini-bar {
  margin-top: 14px;
  height: 4px;
  background: var(--border);
  border-radius: 100px;
  overflow: hidden;
}
.stat-mini-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 1s ease;
}
.mint .stat-mini-fill   { background: linear-gradient(90deg, var(--mint), var(--mint-light)); }
.blue .stat-mini-fill   { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.orange .stat-mini-fill { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.red .stat-mini-fill    { background: linear-gradient(90deg, #ff5c7a, #ff8fa3); }

/* ══════════════════════════════════
   CHARTS ROW
══════════════════════════════════ */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;
  margin-bottom: 24px;
}

.card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px 0;
  margin-bottom: 4px;
}

.card-title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
}

.card-subtitle {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.card-action {
  font-size: 12px;
  font-weight: 600;
  color: var(--mint);
  cursor: pointer;
  border: none;
  background: none;
  font-family: var(--font-body);
  transition: opacity 0.2s;
}
.card-action:hover { opacity: 0.7; }

.card-body { padding: 16px 22px 20px; }

/* Chart tab pills */
.chart-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg);
  border-radius: 8px;
  padding: 3px;
}
.chart-tab {
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-sub);
  font-family: var(--font-body);
  transition: all 0.2s;
}
.chart-tab.active { background: var(--white); color: var(--navy); box-shadow: var(--shadow-sm); }

/* Custom Tooltip */
.custom-tooltip {
  background: var(--navy);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 10px 14px;
  font-family: var(--font-body);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}
.tooltip-label { font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 6px; font-weight: 600; }
.tooltip-row {
  display: flex; align-items: center; gap: 7px;
  font-size: 13px; color: white; font-weight: 600;
  margin-bottom: 2px;
}
.tooltip-dot { width: 8px; height: 8px; border-radius: 50%; }

/* Pie legend */
.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 22px 20px;
}
.pie-legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pie-legend-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.pie-legend-label { font-size: 12px; color: var(--text-sub); flex: 1; }
.pie-legend-val {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
}
.pie-legend-pct {
  font-size: 11px;
  color: var(--text-muted);
  margin-left: 4px;
}

/* ══════════════════════════════════
   BOTTOM ROW
══════════════════════════════════ */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Transactions */
.txn-list { display: flex; flex-direction: column; }
.txn-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 22px;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
  cursor: pointer;
}
.txn-item:last-child { border-bottom: none; }
.txn-item:hover { background: #f8fafc; }

.txn-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}

.txn-name { font-size: 13px; font-weight: 600; color: var(--text-main); }
.txn-cat  { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.txn-date { font-size: 10px; color: var(--text-muted); margin-top: 1px; }
.txn-meta { flex: 1; }

.txn-amount {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  text-align: right;
}
.txn-amount.in  { color: var(--mint); }
.txn-amount.out { color: var(--danger); }

.txn-status {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 100px;
  margin-top: 3px;
  text-align: right;
}
.txn-status.lunas   { background: rgba(0,200,150,0.1);  color: var(--mint); }
.txn-status.pending { background: rgba(245,158,11,0.1); color: var(--warning); }
.txn-status.proses  { background: rgba(59,130,246,0.1); color: var(--info); }

/* Piutang aging */
.aging-list { padding: 0 22px 20px; }
.aging-item { margin-bottom: 14px; }
.aging-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}
.aging-name  { font-size: 13px; font-weight: 600; color: var(--text-main); }
.aging-val   { font-family: var(--font-display); font-size: 13px; font-weight: 700; }
.aging-days  { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
.aging-track {
  height: 5px;
  background: var(--border);
  border-radius: 100px;
  overflow: hidden;
}
.aging-fill  { height: 100%; border-radius: 100px; transition: width 1s ease; }

/* Trial banner */
.trial-banner {
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
  border-radius: var(--radius-md);
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}
.trial-banner::before {
  content: '';
  position: absolute;
  top: -40px; right: -40px;
  width: 160px; height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,200,150,0.2) 0%, transparent 70%);
}
.trial-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: var(--mint-dim);
  border: 1px solid rgba(0,200,150,0.3);
  display: flex; align-items: center; justify-content: center;
  color: var(--mint);
  flex-shrink: 0;
}
.trial-text { flex: 1; }
.trial-title { font-family: var(--font-display); font-size: 14px; font-weight: 800; color: white; }
.trial-sub   { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 2px; }
.btn-upgrade {
  padding: 9px 18px;
  background: linear-gradient(135deg, var(--mint) 0%, var(--mint-light) 100%);
  color: var(--navy);
  border: none;
  border-radius: 8px;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: var(--transition);
  flex-shrink: 0;
}
.btn-upgrade:hover { transform: scale(1.03); box-shadow: 0 4px 16px var(--mint-glow); }

/* ══════════════════════════════════
   RESPONSIVE
══════════════════════════════════ */
@media (max-width: 1100px) {
  .charts-row { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .period-select { display: none; }
  .hamburger { display: flex; }
  .page-content { padding: 20px 16px 40px; }
  .bottom-row { grid-template-columns: 1fr; }
  .page-header { flex-direction: column; }
  .page-actions { width: 100%; }
  .btn-primary, .btn-secondary { flex: 1; justify-content: center; }
  .trial-banner { flex-direction: column; text-align: center; }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat-card { padding: 16px 14px 12px; }
  .stat-value { font-size: 18px; }
}

/* Stagger animation on load */
.fade-up {
  animation: fade-up 0.5s cubic-bezier(0.34,1.2,0.64,1) both;
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.delay-1 { animation-delay: 0.05s; }
.delay-2 { animation-delay: 0.10s; }
.delay-3 { animation-delay: 0.15s; }
.delay-4 { animation-delay: 0.20s; }
.delay-5 { animation-delay: 0.25s; }
.delay-6 { animation-delay: 0.30s; }
`;

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */
const areaData = [
  { bln: "Jan", pendapatan: 32, pengeluaran: 21 },
  { bln: "Feb", pendapatan: 28, pengeluaran: 18 },
  { bln: "Mar", pendapatan: 41, pengeluaran: 26 },
  { bln: "Apr", pendapatan: 35, pengeluaran: 22 },
  { bln: "Mei", pendapatan: 52, pengeluaran: 30 },
  { bln: "Jun", pendapatan: 47, pengeluaran: 28 },
  { bln: "Jul", pendapatan: 61, pengeluaran: 35 },
];

const barData = [
  { hari: "Sen", val: 8.2 },
  { hari: "Sel", val: 12.5 },
  { hari: "Rab", val: 7.8 },
  { hari: "Kam", val: 15.3 },
  { hari: "Jum", val: 11.1 },
  { hari: "Sab", val: 18.7 },
  { hari: "Min", val: 9.4 },
];

const pieData = [
  { name: "Penjualan Produk", value: 58, color: "#00C896" },
  { name: "Jasa / Servis",    value: 24, color: "#3b82f6" },
  { name: "Lainnya",          value: 18, color: "#f59e0b" },
];

const transactions = [
  { id:1, name:"Toko Sembako Bu Dewi", cat:"Pembayaran Invoice #INV-089", date:"Hari ini, 10:24", amount:"+Rp 4.250.000", type:"in",  status:"lunas",   icon:"🏪", iconBg:"rgba(0,200,150,0.1)" },
  { id:2, name:"Tagihan Listrik PLN",  cat:"Biaya Operasional",           date:"Hari ini, 09:11", amount:"-Rp 852.000",   type:"out", status:"lunas",   icon:"⚡", iconBg:"rgba(245,158,11,0.1)" },
  { id:3, name:"CV. Maju Distribusi",  cat:"Pembelian Stok Barang",       date:"Kemarin, 15:30",  amount:"-Rp 12.500.000",type:"out", status:"pending", icon:"📦", iconBg:"rgba(59,130,246,0.1)" },
  { id:4, name:"Pelanggan Walk-in",    cat:"Kasir POS",                   date:"Kemarin, 13:45",  amount:"+Rp 185.000",   type:"in",  status:"lunas",   icon:"🛒", iconBg:"rgba(0,200,150,0.1)" },
  { id:5, name:"Gaji Karyawan",        cat:"Pengeluaran SDM",             date:"28 Jul",          amount:"-Rp 8.000.000", type:"out", status:"proses",  icon:"👥", iconBg:"rgba(255,92,122,0.1)" },
];

const piutang = [
  { name:"Toko Barokah",    val:"Rp 6.800.000", days:"Jatuh tempo 3 hari", pct:85, color:"#ff5c7a" },
  { name:"UD. Sejahtera",   val:"Rp 3.250.000", days:"Jatuh tempo 8 hari", pct:55, color:"#f59e0b" },
  { name:"CV. Anugerah",    val:"Rp 1.900.000", days:"Jatuh tempo 15 hari",pct:30, color:"#00C896" },
  { name:"Bu Sri (Retail)", val:"Rp 750.000",   days:"Jatuh tempo 21 hari",pct:15, color:"#3b82f6" },
];

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const Ic = {
  Dashboard:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Sales:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Purchase:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2H4a2 2 0 0 0-2 2v4"/><path d="M18 2h2a2 2 0 0 1 2 2v4"/><path d="M2 12h20"/><path d="M2 18h20"/><path d="M6 22H4a2 2 0 0 1-2-2v-2"/><path d="M18 22h2a2 2 0 0 0 2-2v-2"/></svg>,
  Inventory:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
  Expenses:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  Contacts:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Reports:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Bell:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Settings:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Plus:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Download:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  ArrowUp:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  ArrowDown:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  Wallet:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  TrendUp:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Invoice:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Star:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  User:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>,
  Menu:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X:          () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const NAV_ITEMS = [
  { key:"dashboard",  label:"Dashboard",  Icon:Ic.Dashboard },
  { key:"sales",      label:"Penjualan",  Icon:Ic.Sales,    badge:3 },
  { key:"purchase",   label:"Pembelian",  Icon:Ic.Purchase },
  { key:"inventory",  label:"Stok",       Icon:Ic.Inventory },
  { key:"expenses",   label:"Pengeluaran",Icon:Ic.Expenses },
  { key:"contacts",   label:"Kontak",     Icon:Ic.Contacts },
  { key:"reports",    label:"Laporan",    Icon:Ic.Reports },
];

function Navbar({ active, setActive }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    function handle(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <>
      <nav className="navbar">
        {/* Brand */}
        <a className="nav-brand" href="#" onClick={e => { e.preventDefault(); setActive("dashboard"); }}>
          <div className="nav-logo-box">
            <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
              <text x="2" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="13" fill="#0D2137">Rp</text>
              <polyline points="6,22 12,14 17,18 24,8" stroke="#0D2137" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="21,8 24,8 24,11" stroke="#0D2137" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="nav-brand-name">TENEBRA<span>TRACK</span></div>
          </div>
        </a>

        {/* Desktop links */}
        <div className="nav-links">
          {NAV_ITEMS.map(({ key, label, Icon, badge }) => (
            <button
              key={key}
              className={`nav-link ${active === key ? "active" : ""}`}
              onClick={() => setActive(key)}
            >
              <Icon />
              {label}
              {badge && <span className="nav-badge">{badge}</span>}
            </button>
          ))}
        </div>

        {/* Right section */}
        <div className="nav-right">
          {/* Period selector — desktop only */}
          <div className="period-select">
            {["Hari","Minggu","Bulan","Tahun"].map(p => (
              <button key={p} className={`period-btn ${p==="Bulan"?"active":""}`}>{p}</button>
            ))}
          </div>

          {/* Bell */}
          <div className="nav-icon-btn">
            <Ic.Bell />
            <span className="notif-dot" />
          </div>

          {/* Avatar + dropdown */}
          <div style={{ position:"relative" }} ref={dropRef}>
            <div className="nav-avatar" onClick={() => setDropOpen(v => !v)}>BS</div>
            {dropOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-name">Budi Santoso</div>
                  <div className="dropdown-email">budi@tokojaya.com</div>
                  <span className="dropdown-role">Owner</span>
                </div>
                <button className="dropdown-item"><Ic.User />Profil Saya</button>
                <button className="dropdown-item"><Ic.Settings />Pengaturan</button>
                <button className="dropdown-item"><Ic.Star />Upgrade Plan</button>
                <div className="dropdown-divider" />
                <button className="dropdown-item danger"><Ic.Logout />Keluar</button>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <Ic.X /> : <Ic.Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mobile-nav">
          {NAV_ITEMS.map(({ key, label, Icon, badge }) => (
            <button
              key={key}
              className={`nav-link ${active === key ? "active" : ""}`}
              onClick={() => { setActive(key); setMobileOpen(false); }}
            >
              <Icon />{label}
              {badge && <span className="nav-badge">{badge}</span>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   CUSTOM CHART TOOLTIP
───────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="tooltip-row">
          <div className="tooltip-dot" style={{ background: p.color }} />
          {p.name}: <strong>Rp {p.value}jt</strong>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────────────────── */
function DashboardPage() {
  const [chartTab, setChartTab] = useState("area");

  const statCards = [
    { label:"Saldo Kas & Bank",   value:"Rp 84,3jt",  change:"+12,4%", up:true,  color:"mint",   icon:<Ic.Wallet />,   fill:72 },
    { label:"Piutang Belum Lunas",value:"Rp 23,6jt",  change:"+3,1%",  up:false, color:"blue",   icon:<Ic.Invoice />,  fill:44 },
    { label:"Utang ke Supplier",  value:"Rp 18,2jt",  change:"-8,3%",  up:true,  color:"orange", icon:<Ic.Purchase />, fill:35 },
    { label:"Laba Bersih Bulan Ini",value:"Rp 14,7jt",change:"+22,5%", up:true,  color:"mint",   icon:<Ic.TrendUp />,  fill:68 },
  ];

  return (
    <div className="page-content">
      {/* Trial banner */}
      <div className="trial-banner fade-up">
        <div className="trial-icon"><Ic.Star /></div>
        <div className="trial-text">
          <div className="trial-title">Masa Uji Coba Gratis — 11 hari tersisa</div>
          <div className="trial-sub">Upgrade sekarang untuk akses penuh laporan pajak & multi-pengguna</div>
        </div>
        <button className="btn-upgrade">⚡ Upgrade Pro</button>
      </div>

      {/* Page header */}
      <div className="page-header fade-up delay-1">
        <div className="page-title-block">
          <div className="page-greeting">Selamat pagi, Budi 👋</div>
          <div className="page-title">Dashboard <span>Keuangan</span></div>
        </div>
        <div className="page-actions">
          <button className="btn-secondary"><Ic.Download />Export</button>
          <button className="btn-primary"><Ic.Plus />Transaksi Baru</button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className={`stat-card ${s.color} fade-up delay-${i+2}`}>
            <div className="stat-card-top">
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className={`stat-change ${s.up ? "up" : "down"}`}>
                {s.up ? <Ic.ArrowUp /> : <Ic.ArrowDown />}
                {s.change}
              </div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-mini-bar">
              <div className="stat-mini-fill" style={{ width:`${s.fill}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="charts-row">
        {/* Area / Bar chart */}
        <div className="card fade-up delay-3">
          <div className="card-header">
            <div>
              <div className="card-title">Arus Keuangan</div>
              <div className="card-subtitle">Pendapatan vs Pengeluaran — 7 bulan terakhir</div>
            </div>
            <div className="chart-tabs">
              <button className={`chart-tab ${chartTab==="area"?"active":""}`} onClick={() => setChartTab("area")}>Tren</button>
              <button className={`chart-tab ${chartTab==="bar"?"active":""}`}  onClick={() => setChartTab("bar")}>Mingguan</button>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              {chartTab === "area" ? (
                <AreaChart data={areaData} margin={{ top:5, right:5, bottom:0, left:-20 }}>
                  <defs>
                    <linearGradient id="gPend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#00C896" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gPeng" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ff5c7a" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ff5c7a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                  <XAxis dataKey="bln" tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}jt`}/>
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="pendapatan" name="Pendapatan" stroke="#00C896" strokeWidth={2.5} fill="url(#gPend)" dot={{ r:3, fill:"#00C896" }} activeDot={{ r:5 }}/>
                  <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#ff5c7a" strokeWidth={2} fill="url(#gPeng)" dot={{ r:3, fill:"#ff5c7a" }} activeDot={{ r:5 }}/>
                </AreaChart>
              ) : (
                <BarChart data={barData} margin={{ top:5, right:5, bottom:0, left:-20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                  <XAxis dataKey="hari" tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}jt`}/>
                  <Tooltip formatter={v => [`Rp ${v}jt`, "Penjualan"]} contentStyle={{ background:"#0D2137", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, fontFamily:"DM Sans" }} labelStyle={{ color:"rgba(255,255,255,0.5)", fontSize:11 }} itemStyle={{ color:"white" }}/>
                  <Bar dataKey="val" fill="#00C896" radius={[6,6,0,0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={i === 5 ? "#00E5B4" : "#00C896"} opacity={i === 5 ? 1 : 0.7} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className="card fade-up delay-4">
          <div className="card-header">
            <div>
              <div className="card-title">Komposisi Pendapatan</div>
              <div className="card-subtitle">Bulan Juli 2025</div>
            </div>
          </div>
          <div className="card-body" style={{ paddingBottom:8 }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={48} outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90} endAngle={-270}
                >
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={v => [`${v}%`, ""]} contentStyle={{ background:"#0D2137", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10 }} itemStyle={{ color:"white" }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend">
            {pieData.map((d, i) => (
              <div key={i} className="pie-legend-item">
                <div className="pie-legend-dot" style={{ background:d.color }} />
                <div className="pie-legend-label">{d.name}</div>
                <div>
                  <span className="pie-legend-val" style={{ color:d.color }}>{d.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="bottom-row">
        {/* Transactions */}
        <div className="card fade-up delay-5">
          <div className="card-header" style={{ padding:"20px 22px 14px" }}>
            <div>
              <div className="card-title">Transaksi Terbaru</div>
              <div className="card-subtitle">5 aktivitas terakhir</div>
            </div>
            <button className="card-action">Lihat Semua →</button>
          </div>
          <div className="txn-list">
            {transactions.map(t => (
              <div key={t.id} className="txn-item">
                <div className="txn-icon" style={{ background:t.iconBg }}>{t.icon}</div>
                <div className="txn-meta">
                  <div className="txn-name">{t.name}</div>
                  <div className="txn-cat">{t.cat}</div>
                  <div className="txn-date">{t.date}</div>
                </div>
                <div>
                  <div className={`txn-amount ${t.type}`}>{t.amount}</div>
                  <div className={`txn-status ${t.status}`}>
                    {t.status === "lunas" ? "✓ Lunas" : t.status === "pending" ? "⏳ Pending" : "🔄 Diproses"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Piutang aging */}
        <div className="card fade-up delay-6">
          <div className="card-header" style={{ padding:"20px 22px 14px" }}>
            <div>
              <div className="card-title">Piutang Mendekati Jatuh Tempo</div>
              <div className="card-subtitle">Segera ditagih agar arus kas lancar</div>
            </div>
            <button className="card-action">Kirim WA →</button>
          </div>
          <div className="aging-list" style={{ marginTop:16 }}>
            {piutang.map((p, i) => (
              <div key={i} className="aging-item">
                <div className="aging-top">
                  <div>
                    <div className="aging-name">{p.name}</div>
                    <div className="aging-days">{p.days}</div>
                  </div>
                  <div className="aging-val" style={{ color:p.color }}>{p.val}</div>
                </div>
                <div className="aging-track">
                  <div className="aging-fill" style={{ width:`${p.pct}%`, background:p.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{
            margin:"4px 22px 20px",
            padding:"14px 16px",
            background:"rgba(245,158,11,0.06)",
            border:"1px solid rgba(245,158,11,0.2)",
            borderRadius:10,
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center"
          }}>
            <div>
              <div style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>Total Piutang Aktif</div>
              <div style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:800, color:"var(--text-main)", letterSpacing:"-0.02em", marginTop:2 }}>Rp 12.700.000</div>
            </div>
            <button style={{
              padding:"8px 14px",
              background:"var(--warning)",
              color:"white",
              border:"none",
              borderRadius:8,
              fontFamily:"var(--font-display)",
              fontSize:12,
              fontWeight:700,
              cursor:"pointer",
            }}>
              Tagih Semua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PLACEHOLDER PAGE (untuk menu lain)
───────────────────────────────────────────── */
function PlaceholderPage({ name }) {
  return (
    <div className="page-content" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🚧</div>
        <div style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:800, color:"var(--text-main)", marginBottom:8 }}>
          Halaman <span style={{ color:"var(--mint)" }}>{name}</span>
        </div>
        <div style={{ color:"var(--text-sub)", fontSize:14 }}>Modul ini sedang dalam pengembangan</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const pageMap = {
    dashboard: <DashboardPage />,
    sales:     <PlaceholderPage name="Penjualan" />,
    purchase:  <PlaceholderPage name="Pembelian" />,
    inventory: <PlaceholderPage name="Stok Barang" />,
    expenses:  <PlaceholderPage name="Pengeluaran" />,
    contacts:  <PlaceholderPage name="Kontak" />,
    reports:   <PlaceholderPage name="Laporan" />,
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-shell">
        <Navbar active={activePage} setActive={setActivePage} />
        {pageMap[activePage]}
      </div>
    </>
  );
}