export function ErrorCard({ message, onRetry }) {
  return (
    <div
      style={{
        background: "rgba(255,92,122,0.06)",
        border: "1px solid rgba(255,92,122,0.2)",
        borderRadius: 12,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 13, color: "#ff5c7a", fontWeight: 600 }}>
        ⚠ {message}
      </div>
      <button
        onClick={onRetry}
        style={{
          padding: "7px 14px",
          background: "#ff5c7a",
          color: "white",
          border: "none",
          borderRadius: 7,
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "var(--font-body)",
        }}
      >
        Coba Lagi
      </button>
    </div>
  );
}