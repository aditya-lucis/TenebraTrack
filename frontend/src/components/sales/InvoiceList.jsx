import { useState } from "react";
import { Badge, EmptyState, Skeleton, shimmerCSS } from "../ui/Badge";

const fmt = (n) =>
  Number(n || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 });

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const STATUS_TABS = [
  { key: "",        label: "Semua"     },
  { key: "draft",   label: "Draft"     },
  { key: "sent",    label: "Terkirim"  },
  { key: "partial", label: "Sebagian"  },
  { key: "paid",    label: "Lunas"     },
  { key: "overdue", label: "Jatuh Tempo" },
];

export default function InvoiceList({
  invoices,
  isLoading,
  onSelect,
  onStatusFilter,
  activeStatus,
  searchQuery,
  onSearch,
}) {
  return (
    <>
      <style>{shimmerCSS}{`
        .inv-row:hover { background: #f8fafc !important; cursor: pointer; }
        @media (max-width: 768px) {
          .inv-table-head { display: none !important; }
          .inv-row { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
          .inv-col-date, .inv-col-due { display: none !important; }
        }
      `}</style>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(13,33,55,0.06)",
          overflow: "hidden",
        }}
      >
        {/* ── Toolbar ── */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #f0f4f8",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
            <span
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 14,
                pointerEvents: "none",
              }}
            >
              🔍
            </span>
            <input
              style={{
                width: "100%",
                padding: "9px 12px 9px 34px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 9,
                fontSize: 13,
                color: "#0D2137",
                background: "#fafbfc",
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              placeholder="Cari nama / nomor invoice..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#00C896";
                e.target.style.background  = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.background  = "#fafbfc";
              }}
            />
          </div>

          {/* Status tabs */}
          <div
            style={{
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
              overflowX: "auto",
            }}
          >
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onStatusFilter(tab.key)}
                style={{
                  padding: "7px 13px",
                  borderRadius: 8,
                  border: "1.5px solid",
                  borderColor: activeStatus === tab.key ? "#0D2137" : "#e2e8f0",
                  background: activeStatus === tab.key ? "#0D2137" : "#fafbfc",
                  color: activeStatus === tab.key ? "#fff" : "#64748b",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table header ── */}
        <div
          className="inv-table-head"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 140px 110px 120px 100px 90px",
            gap: 8,
            padding: "10px 20px",
            background: "#f8fafc",
            borderBottom: "1px solid #f0f4f8",
          }}
        >
          {["Pelanggan / No. Invoice", "Tgl Invoice", "Jatuh Tempo", "Total", "Dibayar", "Status"].map(
            (h) => (
              <div
                key={h}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {h}
              </div>
            )
          )}
        </div>

        {/* ── Rows ── */}
        {isLoading ? (
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} h={48} r={8} />
            ))}
          </div>
        ) : (invoices ?? []).length === 0 ? (
          <EmptyState
            icon="🧾"
            title="Belum ada invoice"
            description="Buat invoice pertama Anda dan kirimkan ke pelanggan"
          />
        ) : (
          (invoices ?? []).map((inv) => (
            <div
              key={inv.id}
              className="inv-row"
              onClick={() => onSelect(inv)}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 110px 120px 100px 90px",
                gap: 8,
                padding: "14px 20px",
                borderBottom: "1px solid #f8fafc",
                alignItems: "center",
                transition: "background 0.15s",
              }}
            >
              {/* Pelanggan + nomor */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0D2137", lineHeight: 1.3 }}>
                  {inv.customer_name}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                  {inv.number}
                </div>
              </div>

              {/* Tgl invoice */}
              <div className="inv-col-date" style={{ fontSize: 12, color: "#64748b" }}>
                {fmtDate(inv.issue_date)}
              </div>

              {/* Jatuh tempo */}
              <div
                className="inv-col-due"
                style={{
                  fontSize: 12,
                  color:
                    inv.status === "overdue"
                      ? "#ff5c7a"
                      : "#64748b",
                  fontWeight: inv.status === "overdue" ? 700 : 400,
                }}
              >
                {fmtDate(inv.due_date)}
                {inv.status === "overdue" && (
                  <div style={{ fontSize: 10, color: "#ff5c7a", fontWeight: 700 }}>⚠ Lewat jatuh tempo</div>
                )}
              </div>

              {/* Total */}
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 13,
                  color: "#0D2137",
                }}
              >
                Rp {fmt(inv.total)}
              </div>

              {/* Dibayar */}
              <div style={{ fontSize: 12, color: "#00C896", fontWeight: 600 }}>
                {inv.paid_amount > 0 ? `Rp ${fmt(inv.paid_amount)}` : "—"}
              </div>

              {/* Status */}
              <div>
                <Badge status={inv.status} size="sm" />
              </div>
            </div>
          ))
        )}

        {/* Footer count */}
        {!isLoading && (invoices ?? []).length > 0 && (
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid #f0f4f8",
              fontSize: 12,
              color: "#94a3b8",
              fontWeight: 500,
            }}
          >
            Menampilkan {invoices.length} invoice
          </div>
        )}
      </div>
    </>
  );
}