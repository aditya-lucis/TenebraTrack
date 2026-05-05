import { useState } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import { useAuth }      from '../hooks/useAuth'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

// ── Helpers ──────────────────────────────────────────────────────────────
function fmt(angka) {
  if (!angka && angka !== 0) return "Rp 0"
  if (angka >= 1_000_000_000) return `Rp ${(angka / 1_000_000_000).toFixed(1)}M`
  if (angka >= 1_000_000)     return `Rp ${(angka / 1_000_000).toFixed(1)}jt`
  if (angka >= 1_000)         return `Rp ${(angka / 1_000).toFixed(0)}rb`
  return `Rp ${angka.toLocaleString("id-ID")}`
}

function trialDaysLabel(days) {
  if (!days || days <= 0) return "Masa uji coba telah berakhir"
  return `Masa Uji Coba Gratis — ${days} hari tersisa`
}

// ── Loading skeleton ───────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 24, r = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  )
}

// ── Error state ────────────────────────────────────────────────────────
function ErrorCard({ message, onRetry }) {
  return (
    <div style={{
      background: "rgba(255,92,122,0.06)",
      border: "1px solid rgba(255,92,122,0.2)",
      borderRadius: 12, padding: "16px 20px",
      display: "flex", alignItems: "center",
      justifyContent: "space-between", gap: 12
    }}>
      <div style={{ fontSize: 13, color: "#ff5c7a", fontWeight: 600 }}>
        ⚠ {message}
      </div>
      <button onClick={onRetry} style={{
        padding: "7px 14px", background: "#ff5c7a",
        color: "white", border: "none", borderRadius: 7,
        fontSize: 12, fontWeight: 700, cursor: "pointer",
        fontFamily: "var(--font-body)"
      }}>
        Coba Lagi
      </button>
    </div>
  )
}

export default function AppShell() {
  const [activePage, setActivePage] = useState("dashboard")
  const [chartTab,   setChartTab]   = useState("area")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen,   setDropOpen]   = useState(false)

  const { user, logout } = useAuth()
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useDashboard()

  // Inisial nama user untuk avatar
  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "?"

  // Data dari API atau fallback kosong
  const tenant    = data?.tenant    ?? {}
  const stats     = data?.stats     ?? {}
  const cashflow  = data?.cashflow_chart  ?? []
  const weekly    = data?.weekly_sales    ?? []
  const breakdown = data?.income_breakdown ?? []
  const txns      = data?.recent_transactions ?? []
  const aging     = data?.piutang_aging       ?? []

  const NAV_ITEMS = [
    { key:"dashboard",  label:"Dashboard"  },
    { key:"sales",      label:"Penjualan"  },
    { key:"purchase",   label:"Pembelian"  },
    { key:"inventory",  label:"Stok"       },
    { key:"expenses",   label:"Pengeluaran"},
    { key:"contacts",   label:"Kontak"     },
    { key:"reports",    label:"Laporan"    },
  ]

  return (
    <>
      {/* ── Navbar ─────────────────────────────────── */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0,
        height:64, background:"#0D2137",
        display:"flex", alignItems:"center",
        padding:"0 24px", zIndex:100, gap:8,
        boxShadow:"0 2px 20px rgba(0,0,0,0.25)",
        borderTop:"2px solid #00C896",
      }}>
        {/* Brand */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginRight:32, flexShrink:0 }}>
          <div style={{
            width:34, height:34, borderRadius:9,
            background:"linear-gradient(135deg,#00C896,#00E5B4)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 0 16px rgba(0,200,150,0.3)"
          }}>
            <span style={{ fontSize:14, fontWeight:900, color:"#0D2137", fontFamily:"serif" }}>₨</span>
          </div>
          <div style={{
            fontFamily:"'Syne',sans-serif", fontWeight:800,
            fontSize:17, color:"white", letterSpacing:"-0.02em"
          }}>
            TENEBRA<span style={{ color:"#00C896" }}>TRACK</span>
          </div>
        </div>

        {/* Links desktop */}
        <div style={{ display:"flex", gap:2, flex:1 }}>
          {NAV_ITEMS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              style={{
                padding:"8px 13px", borderRadius:7,
                border:"none", background: activePage===key ? "rgba(0,200,150,0.15)" : "none",
                color: activePage===key ? "white" : "rgba(255,255,255,0.5)",
                fontSize:13, fontWeight:500, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",
                borderBottom: activePage===key ? "2px solid #00C896" : "2px solid transparent",
                transition:"all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right: tenant name + avatar */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginLeft:"auto" }}>
          {tenant.name && (
            <div style={{
              fontSize:11, color:"rgba(255,255,255,0.4)",
              fontWeight:600, letterSpacing:"0.04em",
              textTransform:"uppercase", maxWidth:120,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"
            }}>
              {tenant.name}
            </div>
          )}

          {/* Avatar dropdown */}
          <div style={{ position:"relative" }}>
            <div
              onClick={() => setDropOpen(v => !v)}
              style={{
                width:36, height:36, borderRadius:10, cursor:"pointer",
                background:"linear-gradient(135deg,#00C896,#00E5B4)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Syne',sans-serif", fontWeight:800,
                fontSize:13, color:"#0D2137",
                border: dropOpen ? "2px solid #00C896" : "2px solid transparent",
                transition:"all 0.2s"
              }}
            >
              {initials}
            </div>

            {dropOpen && (
              <div style={{
                position:"absolute", top:"calc(100% + 10px)", right:0,
                width:210, background:"#122840",
                border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:14, padding:8,
                boxShadow:"0 16px 48px rgba(0,0,0,0.4)",
                zIndex:200,
                animation:"drop-in 0.2s ease"
              }}>
                <div style={{ padding:"10px 12px 12px", borderBottom:"1px solid rgba(255,255,255,0.07)", marginBottom:6 }}>
                  <div style={{ fontWeight:700, color:"white", fontSize:13, fontFamily:"'Syne',sans-serif" }}>
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{user?.email}</div>
                  <div style={{
                    display:"inline-block", marginTop:6,
                    background:"rgba(0,200,150,0.12)",
                    border:"1px solid rgba(0,200,150,0.25)",
                    color:"#00C896", fontSize:10, fontWeight:700,
                    padding:"2px 8px", borderRadius:100,
                    textTransform:"uppercase", letterSpacing:"0.05em"
                  }}>
                    {user?.role}
                  </div>
                </div>
                {[
                  { label:"Profil Saya", onClick: () => {} },
                  { label:"Pengaturan",  onClick: () => {} },
                ].map(item => (
                  <button key={item.label} onClick={item.onClick} style={{
                    display:"block", width:"100%", padding:"9px 12px",
                    background:"none", border:"none", textAlign:"left",
                    color:"rgba(255,255,255,0.65)", fontSize:13, cursor:"pointer",
                    borderRadius:7, fontFamily:"'DM Sans',sans-serif",
                    transition:"all 0.15s"
                  }}
                  onMouseEnter={e => e.target.style.background="rgba(255,255,255,0.07)"}
                  onMouseLeave={e => e.target.style.background="none"}
                  >
                    {item.label}
                  </button>
                ))}
                <div style={{ height:1, background:"rgba(255,255,255,0.07)", margin:"6px 0" }} />
                <button onClick={logout} style={{
                  display:"block", width:"100%", padding:"9px 12px",
                  background:"none", border:"none", textAlign:"left",
                  color:"#ff5c7a", fontSize:13, cursor:"pointer",
                  borderRadius:7, fontFamily:"'DM Sans',sans-serif",
                  transition:"all 0.15s"
                }}
                onMouseEnter={e => e.target.style.background="rgba(255,92,122,0.1)"}
                onMouseLeave={e => e.target.style.background="none"}
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Page Content ───────────────────────────── */}
      <div style={{ paddingTop:64, minHeight:"100vh", background:"#f0f4f8" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"28px 24px 48px" }}>

          {/* Error banner */}
          {isError && (
            <div style={{ marginBottom:20 }}>
              <ErrorCard
                message={`Gagal memuat data: ${error?.message ?? "Koneksi bermasalah"}`}
                onRetry={refetch}
              />
            </div>
          )}

          {/* Trial banner */}
          {tenant.trial_ends_at && (
            <div style={{
              background:"linear-gradient(135deg,#0D2137,#1a3a55)",
              borderRadius:16, padding:"18px 22px",
              display:"flex", alignItems:"center", gap:16,
              marginBottom:24, position:"relative", overflow:"hidden"
            }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"white", fontSize:14 }}>
                  ⏳ {trialDaysLabel(tenant.trial_days_left)}
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:3 }}>
                  Upgrade untuk akses laporan pajak & multi-pengguna
                </div>
              </div>
              <button style={{
                padding:"9px 18px",
                background:"linear-gradient(135deg,#00C896,#00E5B4)",
                color:"#0D2137", border:"none", borderRadius:8,
                fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:800,
                cursor:"pointer", whiteSpace:"nowrap"
              }}>
                ⚡ Upgrade Pro
              </button>
            </div>
          )}

          {/* Page heading */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, gap:16, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:13, color:"#64748b", fontWeight:500, marginBottom:4 }}>
                Selamat datang kembali, {user?.first_name} 👋
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#0D2137", letterSpacing:"-0.03em", lineHeight:1.1 }}>
                Dashboard <span style={{ color:"#00C896" }}>Keuangan</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{
                display:"flex", alignItems:"center", gap:7, padding:"10px 16px",
                background:"white", border:"1.5px solid #e2e8f0", borderRadius:8,
                fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", color:"#0D2137"
              }}>
                ↓ Export
              </button>
              <button style={{
                display:"flex", alignItems:"center", gap:7, padding:"10px 18px",
                background:"linear-gradient(135deg,#0D2137,#1a3a55)",
                color:"white", border:"none", borderRadius:8,
                fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer"
              }}>
                + Transaksi Baru
              </button>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
            {[
              { label:"Saldo Kas & Bank",    value: fmt(stats.saldo_kas),    change: stats.saldo_change,   color:"#00C896" },
              { label:"Piutang Belum Lunas", value: fmt(stats.total_piutang),change: stats.piutang_change, color:"#3b82f6" },
              { label:"Utang ke Supplier",   value: fmt(stats.total_utang),  change: stats.utang_change,   color:"#f59e0b" },
              { label:"Laba Bersih Bulan Ini",value:fmt(stats.laba_bersih), change: stats.laba_change,    color:"#00C896" },
            ].map((s, i) => (
              <div key={i} style={{
                background:"white", borderRadius:16, padding:"20px 20px 16px",
                boxShadow:"0 1px 4px rgba(13,33,55,0.06)", border:"1px solid #e2e8f0",
                borderTop:`3px solid ${s.color}`,
              }}>
                {isLoading ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <Skeleton h={14} w="60%" />
                    <Skeleton h={28} w="80%" />
                    <Skeleton h={10} w="50%" />
                    <Skeleton h={4}  r={4} />
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize:11, color:"#64748b", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>
                      {s.label}
                    </div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:"#0D2137", letterSpacing:"-0.03em", lineHeight:1 }}>
                      {s.value}
                    </div>
                    <div style={{
                      display:"inline-flex", alignItems:"center", gap:4,
                      fontSize:11, fontWeight:700, marginTop:8, padding:"2px 7px", borderRadius:100,
                      background: s.change >= 0 ? "rgba(0,200,150,0.1)" : "rgba(255,92,122,0.1)",
                      color: s.change >= 0 ? "#00C896" : "#ff5c7a"
                    }}>
                      {s.change >= 0 ? "↑" : "↓"} {Math.abs(s.change ?? 0).toFixed(1)}%
                    </div>
                    <div style={{ height:4, background:"#f0f4f8", borderRadius:100, marginTop:12, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:"40%", background:s.color, borderRadius:100 }} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* ── Charts ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, marginBottom:24 }}>
            {/* Area/Bar */}
            <div style={{ background:"white", borderRadius:16, boxShadow:"0 1px 4px rgba(13,33,55,0.06)", border:"1px solid #e2e8f0", padding:"20px 22px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:"#0D2137" }}>Arus Keuangan</div>
                  <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>7 bulan terakhir</div>
                </div>
                <div style={{ display:"flex", gap:4, background:"#f0f4f8", borderRadius:8, padding:3 }}>
                  {["area","bar"].map(t => (
                    <button key={t} onClick={() => setChartTab(t)} style={{
                      padding:"5px 12px", borderRadius:6, border:"none",
                      background: chartTab===t ? "white" : "none",
                      color: chartTab===t ? "#0D2137" : "#64748b",
                      fontSize:11, fontWeight:600, cursor:"pointer",
                      fontFamily:"'DM Sans',sans-serif",
                      boxShadow: chartTab===t ? "0 1px 4px rgba(13,33,55,0.08)" : "none"
                    }}>
                      {t === "area" ? "Tren" : "Mingguan"}
                    </button>
                  ))}
                </div>
              </div>
              {isLoading ? <Skeleton h={200} r={10} /> : (
                <ResponsiveContainer width="100%" height={200}>
                  {chartTab === "area" ? (
                    <AreaChart data={cashflow} margin={{ top:5, right:5, bottom:0, left:-20 }}>
                      <defs>
                        <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C896" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff5c7a" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#ff5c7a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                      <XAxis dataKey="bln" tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}jt`}/>
                      <Tooltip formatter={(v, n) => [`Rp ${v}jt`, n === "pendapatan" ? "Pendapatan" : "Pengeluaran"]}
                        contentStyle={{ background:"#0D2137", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, fontFamily:"DM Sans" }}
                        labelStyle={{ color:"rgba(255,255,255,0.5)", fontSize:11 }} itemStyle={{ color:"white" }}/>
                      <Area type="monotone" dataKey="pendapatan" stroke="#00C896" strokeWidth={2.5} fill="url(#gP)" dot={{ r:3, fill:"#00C896" }}/>
                      <Area type="monotone" dataKey="pengeluaran" stroke="#ff5c7a" strokeWidth={2} fill="url(#gE)" dot={{ r:3, fill:"#ff5c7a" }}/>
                    </AreaChart>
                  ) : (
                    <BarChart data={weekly} margin={{ top:5, right:5, bottom:0, left:-20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                      <XAxis dataKey="hari" tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}jt`}/>
                      <Tooltip formatter={v => [`Rp ${v}jt`, "Penjualan"]}
                        contentStyle={{ background:"#0D2137", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10 }}
                        labelStyle={{ color:"rgba(255,255,255,0.5)", fontSize:11 }} itemStyle={{ color:"white" }}/>
                      <Bar dataKey="val" fill="#00C896" radius={[6,6,0,0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie */}
            <div style={{ background:"white", borderRadius:16, boxShadow:"0 1px 4px rgba(13,33,55,0.06)", border:"1px solid #e2e8f0", padding:"20px 22px" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:"#0D2137", marginBottom:4 }}>Komposisi Pendapatan</div>
              <div style={{ fontSize:11, color:"#94a3b8", marginBottom:8 }}>Bulan ini</div>
              {isLoading ? <Skeleton h={160} r={10} /> : (
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={breakdown} cx="50%" cy="50%" innerRadius={46} outerRadius={70}
                      paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                      {breakdown.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip formatter={v => [`${v}%`, ""]}
                      contentStyle={{ background:"#0D2137", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10 }}
                      itemStyle={{ color:"white" }}/>
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:8 }}>
                {breakdown.map((d, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:d.color, flexShrink:0 }} />
                    <div style={{ flex:1, fontSize:12, color:"#64748b" }}>{d.name}</div>
                    <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Syne',sans-serif", color:d.color }}>{d.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Transaksi + Piutang ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {/* Transaksi */}
            <div style={{ background:"white", borderRadius:16, boxShadow:"0 1px 4px rgba(13,33,55,0.06)", border:"1px solid #e2e8f0", overflow:"hidden" }}>
              <div style={{ padding:"20px 22px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:"#0D2137" }}>Transaksi Terbaru</div>
                <button style={{ fontSize:12, fontWeight:600, color:"#00C896", background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                  Lihat Semua →
                </button>
              </div>
              {isLoading ? (
                <div style={{ padding:"0 22px 20px", display:"flex", flexDirection:"column", gap:12 }}>
                  {[1,2,3].map(i => <Skeleton key={i} h={52} r={10} />)}
                </div>
              ) : txns.length === 0 ? (
                <div style={{ padding:"32px 22px", textAlign:"center", color:"#94a3b8" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>📭</div>
                  <div style={{ fontSize:13, fontWeight:600 }}>Belum ada transaksi</div>
                  <div style={{ fontSize:11, marginTop:4 }}>Mulai tambahkan penjualan atau pengeluaran</div>
                </div>
              ) : (
                txns.map((t, i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"center", gap:14,
                    padding:"12px 22px", borderBottom:"1px solid #f0f4f8",
                    cursor:"pointer"
                  }}>
                    <div style={{
                      width:36, height:36, borderRadius:9,
                      background:"rgba(0,200,150,0.1)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:16, flexShrink:0
                    }}>
                      {t.icon ?? "💰"}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#0D2137" }}>{t.name}</div>
                      <div style={{ fontSize:11, color:"#94a3b8", marginTop:1 }}>{t.category} · {t.date}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color: t.type === "in" ? "#00C896" : "#ff5c7a" }}>
                        {t.type === "in" ? "+" : "-"}{fmt(t.amount)}
                      </div>
                      <div style={{
                        fontSize:10, fontWeight:600, padding:"2px 6px", borderRadius:100, marginTop:2,
                        background: t.status === "lunas" ? "rgba(0,200,150,0.1)" : "rgba(245,158,11,0.1)",
                        color: t.status === "lunas" ? "#00C896" : "#f59e0b"
                      }}>
                        {t.status === "lunas" ? "✓ Lunas" : "⏳ Pending"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Piutang Aging */}
            <div style={{ background:"white", borderRadius:16, boxShadow:"0 1px 4px rgba(13,33,55,0.06)", border:"1px solid #e2e8f0", overflow:"hidden" }}>
              <div style={{ padding:"20px 22px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:"#0D2137" }}>Piutang Jatuh Tempo</div>
                <button style={{ fontSize:12, fontWeight:600, color:"#00C896", background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                  Kirim WA →
                </button>
              </div>
              {isLoading ? (
                <div style={{ padding:"0 22px 20px", display:"flex", flexDirection:"column", gap:14 }}>
                  {[1,2,3].map(i => <Skeleton key={i} h={44} r={8} />)}
                </div>
              ) : aging.length === 0 ? (
                <div style={{ padding:"32px 22px", textAlign:"center", color:"#94a3b8" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>✅</div>
                  <div style={{ fontSize:13, fontWeight:600 }}>Semua piutang lunas!</div>
                  <div style={{ fontSize:11, marginTop:4 }}>Tidak ada tagihan yang jatuh tempo</div>
                </div>
              ) : (
                <div style={{ padding:"4px 22px 20px" }}>
                  {aging.map((p, i) => (
                    <div key={i} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:6 }}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#0D2137" }}>{p.name}</div>
                          <div style={{ fontSize:11, color:"#94a3b8", marginTop:1 }}>{p.days_label}</div>
                        </div>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:p.color ?? "#ff5c7a" }}>
                          {fmt(p.amount)}
                        </div>
                      </div>
                      <div style={{ height:5, background:"#f0f4f8", borderRadius:100, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${p.urgency_pct ?? 50}%`, background:p.color ?? "#ff5c7a", borderRadius:100 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes drop-in {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>
    </>
  )
}