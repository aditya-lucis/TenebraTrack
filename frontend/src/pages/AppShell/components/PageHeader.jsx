export function PageHeader({ userName }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 13,
            color: "#64748b",
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          Selamat datang kembali, {userName} 👋
        </div>
        <div
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: "#0D2137",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Dashboard <span style={{ color: "#00C896" }}>Keuangan</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 16px",
            background: "white",
            border: "1.5px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
            color: "#0D2137",
          }}
        >
          ↓ Export
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 18px",
            background: "linear-gradient(135deg,#0D2137,#1a3a55)",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontFamily: "'Syne',sans-serif",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Transaksi Baru
        </button>
      </div>
    </div>
  );
}