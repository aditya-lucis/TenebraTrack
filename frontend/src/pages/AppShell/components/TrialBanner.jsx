import { trialDaysLabel } from "../AppShell.utils";

export function TrialBanner({ daysLeft }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#0D2137,#1a3a55)",
        borderRadius: 16,
        padding: "18px 22px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            color: "white",
            fontSize: 14,
          }}
        >
          ⏳ {trialDaysLabel(daysLeft)}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            marginTop: 3,
          }}
        >
          Upgrade untuk akses laporan pajak & multi-pengguna
        </div>
      </div>
      <button
        style={{
          padding: "9px 18px",
          background: "linear-gradient(135deg,#00C896,#00E5B4)",
          color: "#0D2137",
          border: "none",
          borderRadius: 8,
          fontFamily: "'Syne',sans-serif",
          fontSize: 12,
          fontWeight: 800,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        ⚡ Upgrade Pro
      </button>
    </div>
  );
}