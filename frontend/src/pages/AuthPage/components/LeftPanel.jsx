import { LogoIcon, IconChart } from "../AuthPage.icons";

export function LeftPanel() {
  return (
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
          <div className="hero-badge">Platform Keuangan Untuk Bisnismu</div>
          <div className="hero-title">
            Kendalikan<br />
            Keuangan Bisnis<br />
            <span className="accent">Lebih Cerdas</span>
          </div>
          <div className="hero-desc">
            Dari kasir harian hingga laporan laba rugi — semua dalam satu platform yang mudah digunakan siapa saja.
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
  );
}