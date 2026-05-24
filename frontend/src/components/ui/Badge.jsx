// ─── Badge ───────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  draft:   { bg: "rgba(100,116,139,0.1)", color: "#64748b", label: "Draft" },
  sent:    { bg: "rgba(59,130,246,0.1)",  color: "#3b82f6", label: "Terkirim" },
  partial: { bg: "rgba(245,158,11,0.1)",  color: "#f59e0b", label: "Sebagian" },
  paid:    { bg: "rgba(0,200,150,0.12)",  color: "#00C896", label: "Lunas" },
  overdue: { bg: "rgba(255,92,122,0.1)",  color: "#ff5c7a", label: "Jatuh Tempo" },
  void:    { bg: "rgba(100,116,139,0.08)",color: "#94a3b8", label: "Dibatalkan" },
  // payment methods
  cash:     { bg: "rgba(0,200,150,0.1)",  color: "#00C896", label: "Tunai" },
  transfer: { bg: "rgba(59,130,246,0.1)", color: "#3b82f6", label: "Transfer" },
  qris:     { bg: "rgba(139,92,246,0.1)", color: "#8b5cf6", label: "QRIS" },
  other:    { bg: "rgba(100,116,139,0.1)",color: "#64748b", label: "Lainnya" },
};

/**
 * Status/type badge
 * Props: status (string key), label (override), size (sm|md)
 */
export function Badge({ status, label, size = "md" }) {
  const style = BADGE_STYLES[status] ?? {
    bg: "rgba(100,116,139,0.1)",
    color: "#64748b",
    label: status,
  };

  const padding  = size === "sm" ? "2px 7px"  : "4px 10px";
  const fontSize = size === "sm" ? "10px"      : "11px";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding,
        borderRadius: 100,
        background: style.bg,
        color: style.color,
        fontSize,
        fontWeight: 700,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: style.color,
          flexShrink: 0,
        }}
      />
      {label ?? style.label}
    </span>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
/**
 * Empty state with icon, title, description, optional action
 * Props: icon, title, description, actionLabel, onAction
 */
export function EmptyState({ icon = "📭", title, description, actionLabel, onAction }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "56px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16, lineHeight: 1 }}>{icon}</div>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 16,
          color: "#0D2137",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      {description && (
        <div
          style={{
            fontSize: 13,
            color: "#94a3b8",
            maxWidth: 280,
            lineHeight: 1.6,
            marginBottom: actionLabel ? 20 : 0,
          }}
        >
          {description}
        </div>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg,#0D2137,#1a3a55)",
            color: "white",
            border: "none",
            borderRadius: 9,
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg,#00C896,#00E5B4)";
            e.currentTarget.style.color = "#0D2137";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg,#0D2137,#1a3a55)";
            e.currentTarget.style.color = "white";
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function Skeleton({ w = "100%", h = 16, r = 6 }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background:
          "linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

export const shimmerCSS = `
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
`;