import { fmt } from "../AppShell.utils";
import { Skeleton } from "./Skeleton";

export function TransactionsList({ transactions, isLoading }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        boxShadow: "0 1px 4px rgba(13,33,55,0.06)",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px 22px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            fontSize: 15,
            color: "#0D2137",
          }}
        >
          Transaksi Terbaru
        </div>
        <button
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#00C896",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Lihat Semua →
        </button>
      </div>

      {isLoading ? (
        <div
          style={{
            padding: "0 22px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} h={52} r={10} />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div
          style={{ padding: "32px 22px", textAlign: "center", color: "#94a3b8" }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            Belum ada transaksi
          </div>
          <div style={{ fontSize: 11, marginTop: 4 }}>
            Mulai tambahkan penjualan atau pengeluaran
          </div>
        </div>
      ) : (
        transactions.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 22px",
              borderBottom: "1px solid #f0f4f8",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "rgba(0,200,150,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {t.icon ?? "💰"}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{ fontSize: 13, fontWeight: 600, color: "#0D2137" }}
              >
                {t.name}
              </div>
              <div
                style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}
              >
                {t.category} · {t.date}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: t.type === "in" ? "#00C896" : "#ff5c7a",
                }}
              >
                {t.type === "in" ? "+" : "-"}
                {fmt(t.amount)}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: 100,
                  marginTop: 2,
                  background:
                    t.status === "lunas"
                      ? "rgba(0,200,150,0.1)"
                      : "rgba(245,158,11,0.1)",
                  color: t.status === "lunas" ? "#00C896" : "#f59e0b",
                }}
              >
                {t.status === "lunas" ? "✓ Lunas" : "⏳ Pending"}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}