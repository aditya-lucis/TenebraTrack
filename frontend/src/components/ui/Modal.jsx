import { useEffect } from "react";

/**
 * Reusable Modal wrapper
 * Props: open, onClose, title, subtitle, size (sm|md|lg|xl|full), children
 */
export default function Modal({ open, onClose, title, subtitle, size = "md", children }) {
  // Lock body scroll saat modal terbuka
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const widthMap = {
    sm:   "420px",
    md:   "560px",
    lg:   "720px",
    xl:   "900px",
    full: "calc(100vw - 48px)",
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(13,33,55,0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        animation: "fade-backdrop 0.2s ease",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: widthMap[size] ?? widthMap.md,
          maxHeight: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 64px rgba(13,33,55,0.22)",
          animation: "modal-up 0.25s cubic-bezier(0.34,1.2,0.64,1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div
            style={{
              padding: "22px 24px 18px",
              borderBottom: "1px solid #f0f4f8",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div>
              {title && (
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 18,
                    color: "#0D2137",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </div>
              )}
              {subtitle && (
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
                  {subtitle}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1.5px solid #e2e8f0",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                color: "#64748b",
                fontSize: 16,
                fontWeight: 700,
                lineHeight: 1,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fee2e2";
                e.currentTarget.style.borderColor = "#fca5a5";
                e.currentTarget.style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#64748b";
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fade-backdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modal-up {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </div>
  );
}