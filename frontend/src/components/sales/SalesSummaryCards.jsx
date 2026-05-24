import { Skeleton, shimmerCSS } from "../ui/Badge";

const fmt = (n) => {
  if (!n && n !== 0) return "Rp 0";
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000)         return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${Number(n).toLocaleString("id-ID")}`;
};

const CARDS = [
  {
    key:   "total_revenue",
    label: "Total Pendapatan",
    icon:  "💰",
    color: "#00C896",
    bg:    "rgba(0,200,150,0.08)",
    isCurrency: true,
  },
  {
    key:   "total_piutang",
    label: "Piutang Aktif",
    icon:  "📋",
    color: "#3b82f6",
    bg:    "rgba(59,130,246,0.08)",
    isCurrency: true,
  },
  {
    key:   "paid",
    label: "Invoice Lunas",
    icon:  "✅",
    color: "#00C896",
    bg:    "rgba(0,200,150,0.08)",
    isCurrency: false,
    suffix: " invoice",
  },
  {
    key:   "overdue",
    label: "Jatuh Tempo",
    icon:  "⚠️",
    color: "#ff5c7a",
    bg:    "rgba(255,92,122,0.08)",
    isCurrency: false,
    suffix: " invoice",
  },
];

export default function SalesSummaryCards({ data, isLoading }) {
  return (
    <>
      <style>{shimmerCSS}</style>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
        className="sales-summary-grid"
      >
        {CARDS.map((card) => (
          <div
            key={card.key}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "20px 18px 16px",
              border: "1px solid #e2e8f0",
              borderTop: `3px solid ${card.color}`,
              boxShadow: "0 1px 4px rgba(13,33,55,0.06)",
              transition: "all 0.22s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(13,33,55,0.10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 4px rgba(13,33,55,0.06)";
            }}
          >
            {isLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Skeleton h={12} w="50%" />
                <Skeleton h={26} w="75%" />
                <Skeleton h={8}  w="40%" />
              </div>
            ) : (
              <>
                {/* Icon + label */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: card.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      lineHeight: 1.3,
                    }}
                  >
                    {card.label}
                  </div>
                </div>

                {/* Value */}
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 22,
                    color: "#0D2137",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {card.isCurrency
                    ? fmt(data?.[card.key] ?? 0)
                    : `${data?.[card.key] ?? 0}${card.suffix ?? ""}`}
                </div>

                {/* Mini progress bar */}
                <div
                  style={{
                    height: 3,
                    background: "#f0f4f8",
                    borderRadius: 100,
                    marginTop: 14,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(
                        100,
                        ((data?.[card.key] ?? 0) /
                          Math.max(data?.total_revenue ?? 1, 1)) *
                          100
                      )}%`,
                      background: card.color,
                      borderRadius: 100,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .sales-summary-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .sales-summary-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </>
  );
}