import { fmt, STAT_CONFIG } from "../AppShell.utils";
import { Skeleton } from "./Skeleton";

export function StatCards({ stats, isLoading }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 24,
      }}
    >
      {STAT_CONFIG.map((s, i) => {
        const value = stats[s.key];
        const change = stats[s.changeKey];

        return (
          <div
            key={i}
            style={{
              background: "white",
              borderRadius: 16,
              padding: "20px 20px 16px",
              boxShadow: "0 1px 4px rgba(13,33,55,0.06)",
              border: "1px solid #e2e8f0",
              borderTop: `3px solid ${s.color}`,
            }}
          >
            {isLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Skeleton h={14} w="60%" />
                <Skeleton h={28} w="80%" />
                <Skeleton h={10} w="50%" />
                <Skeleton h={4} r={4} />
              </div>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 10,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#0D2137",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {fmt(value)}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    marginTop: 8,
                    padding: "2px 7px",
                    borderRadius: 100,
                    background:
                      change >= 0
                        ? "rgba(0,200,150,0.1)"
                        : "rgba(255,92,122,0.1)",
                    color: change >= 0 ? "#00C896" : "#ff5c7a",
                  }}
                >
                  {change >= 0 ? "↑" : "↓"} {Math.abs(change ?? 0).toFixed(1)}%
                </div>
                <div
                  style={{
                    height: 4,
                    background: "#f0f4f8",
                    borderRadius: 100,
                    marginTop: 12,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "40%",
                      background: s.color,
                      borderRadius: 100,
                    }}
                  />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}