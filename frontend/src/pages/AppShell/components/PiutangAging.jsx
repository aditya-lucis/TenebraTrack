import { fmt } from "../AppShell.utils";
import { Skeleton } from "./Skeleton";

export function PiutangAging({ aging, isLoading }) {
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
          Piutang Jatuh Tempo
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
          Kirim WA →
        </button>
      </div>

      {isLoading ? (
        <div
          style={{
            padding: "0 22px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} h={44} r={8} />
          ))}
        </div>
      ) : aging.length === 0 ? (
        <div
          style={{ padding: "32px 22px", textAlign: "center", color: "#94a3b8" }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            Semua piutang lunas!
          </div>
          <div style={{ fontSize: 11, marginTop: 4 }}>
            Tidak ada tagihan yang jatuh tempo
          </div>
        </div>
      ) : (
        <div style={{ padding: "4px 22px 20px" }}>
          {aging.map((p, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 6,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0D2137",
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      marginTop: 1,
                    }}
                  >
                    {p.days_label}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: p.color ?? "#ff5c7a",
                  }}
                >
                  {fmt(p.amount)}
                </div>
              </div>
              <div
                style={{
                  height: 5,
                  background: "#f0f4f8",
                  borderRadius: 100,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${p.urgency_pct ?? 50}%`,
                    background: p.color ?? "#ff5c7a",
                    borderRadius: 100,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}