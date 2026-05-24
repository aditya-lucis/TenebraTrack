import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { Badge } from "../ui/Badge";

const fmt = (n) =>
  Number(n || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 });

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

const parseNum = (val) => {
  if (typeof val === "number") return val;
  if (typeof val === "string") return parseFloat(val) || 0;
  return 0;
};

// ─── Payment Modal ────────────────────────────────────────────────────────────
export function PaymentModal({ open, onClose, invoice, onSave, isLoading }) {
  const [form, setForm] = useState({
    amount: "",
    method: "cash",
    reference: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && invoice) {
      setForm({
        amount: String(parseNum(invoice.balance_due) || parseNum(invoice.total)),
        method: "cash",
        reference: "",
        notes: "",
      });
      setErrors({});
    }
  }, [open, invoice]);

  const methods = [
    { key: "cash",     label: "💵 Tunai",   color: "#00C896" },
    { key: "transfer", label: "🏦 Transfer", color: "#3b82f6" },
    { key: "qris",     label: "📱 QRIS",    color: "#8b5cf6" },
    { key: "other",    label: "🔖 Lainnya", color: "#64748b" },
  ];

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 9,
    fontSize: 14,
    color: "#0D2137",
    background: "#fafbfc",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  function validate() {
    const e = {};
    const amt = parseFloat(form.amount);
    const balanceDue = parseNum(invoice?.balance_due) || parseNum(invoice?.total);
    if (!form.amount || isNaN(amt) || amt <= 0)
      e.amount = "Nominal wajib diisi";
    else if (amt > balanceDue)
      e.amount = `Melebihi sisa tagihan (Rp ${fmt(balanceDue)})`;
    return e;
  }

  function handleSave() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({
      id:        invoice.id,
      amount:    parseFloat(form.amount),
      method:    form.method,
      reference: form.reference,
      notes:     form.notes,
    });
  }

  const balanceDue = parseNum(invoice?.balance_due) || parseNum(invoice?.total);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Catat Pembayaran"
      subtitle={invoice ? `Invoice ${invoice.number}` : ""}
      size="sm"
    >
      <div style={{ padding: "16px 24px 24px" }}>
        {/* Sisa tagihan info */}
        {invoice && (
          <div
            style={{
              background: "linear-gradient(135deg,#0D2137,#1a3a55)",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase" }}>
                Sisa Tagihan
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#00E5B4", letterSpacing: "-0.03em" }}>
                Rp {fmt(balanceDue)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Total Invoice</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
                Rp {fmt(parseNum(invoice.total))}
              </div>
            </div>
          </div>
        )}

        {/* Metode pembayaran */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0D2137", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Metode Pembayaran
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {methods.map((m) => (
              <button
                key={m.key}
                onClick={() => setForm((f) => ({ ...f, method: m.key }))}
                style={{
                  padding: "10px 12px",
                  borderRadius: 9,
                  border: `1.5px solid ${form.method === m.key ? m.color : "#e2e8f0"}`,
                  background: form.method === m.key ? `${m.color}18` : "#fafbfc",
                  color: form.method === m.key ? m.color : "#64748b",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s",
                  textAlign: "left",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nominal */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0D2137", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 7 }}>
            Nominal <span style={{ color: "#ff5c7a" }}>*</span>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
              Rp
            </span>
            <input
              type="number"
              min="0"
              step="any"
              style={{ ...inputStyle, paddingLeft: 36, border: `1.5px solid ${errors.amount ? "#ff5c7a" : "#e2e8f0"}` }}
              value={form.amount}
              onChange={(e) => {
                setForm((f) => ({ ...f, amount: e.target.value }));
                setErrors((err) => ({ ...err, amount: "" }));
              }}
            />
          </div>
          {errors.amount && (
            <div style={{ fontSize: 11, color: "#ff5c7a", marginTop: 4 }}>⚠ {errors.amount}</div>
          )}
        </div>

        {/* Referensi */}
        {["transfer", "qris"].includes(form.method) && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0D2137", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 7 }}>
              No. Referensi / Bukti Transfer
            </div>
            <input
              style={inputStyle}
              placeholder="Nomor transaksi / kode booking"
              value={form.reference}
              onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
            />
          </div>
        )}

        {/* Catatan */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0D2137", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 7 }}>
            Catatan (opsional)
          </div>
          <input
            style={inputStyle}
            placeholder="Bayar sebagian / DP / Pelunasan"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "12px", background: "#f8fafc",
              border: "1.5px solid #e2e8f0", borderRadius: 9,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", color: "#64748b",
            }}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            style={{
              flex: 2, padding: "12px",
              background: isLoading ? "#94a3b8" : "linear-gradient(135deg,#00C896,#00E5B4)",
              color: isLoading ? "white" : "#0D2137",
              border: "none", borderRadius: 9,
              fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer", transition: "all 0.2s",
            }}
          >
            {isLoading ? "Menyimpan..." : "✅ Simpan Pembayaran"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Invoice Detail Modal ─────────────────────────────────────────────────────
export function InvoiceDetail({ open, onClose, invoice, isLoading, onPay, onSendWA, isSending }) {
  if (!open) return null;

  // Loading state
  if (isLoading) {
    return (
      <Modal open={true} onClose={onClose} title="Memuat invoice..." size="lg">
        <div style={{ padding: "24px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: 16,
                borderRadius: 6,
                marginBottom: 14,
                background: "linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.4s infinite",
                width: i === 1 ? "60%" : i === 2 ? "40%" : i === 3 ? "80%" : "50%",
              }}
            />
          ))}
          <style>{`@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }`}</style>
        </div>
      </Modal>
    );
  }

  if (!invoice) return null;

  const progressPct =
    parseNum(invoice.total) > 0
      ? Math.min(100, (parseNum(invoice.paid_amount) / parseNum(invoice.total)) * 100)
      : 0;

  const canAct = invoice.status !== "void" && invoice.status !== "paid";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Invoice ${invoice.number}`}
      subtitle={`Dibuat ${fmtDate(invoice.created_at)}`}
      size="lg"
    >
      <div style={{ padding: "16px 24px 24px" }}>

        {/* ── Customer + Status ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 18,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 18,
                color: "#0D2137",
                marginBottom: 4,
              }}
            >
              {invoice.customer?.name ?? "—"}
            </div>
            {invoice.customer?.phone && (
              <div style={{ fontSize: 13, color: "#64748b" }}>
                📱 {invoice.customer.phone}
              </div>
            )}
            {invoice.customer?.email && (
              <div style={{ fontSize: 13, color: "#64748b" }}>
                ✉️ {invoice.customer.email}
              </div>
            )}
          </div>
          <Badge status={invoice.status} />
        </div>

        {/* ── Tanggal ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {[
            { label: "Tanggal Invoice", val: fmtDate(invoice.issue_date) },
            { label: "Jatuh Tempo",     val: fmtDate(invoice.due_date)   },
          ].map((d) => (
            <div
              key={d.label}
              style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: "12px 14px",
                border: "1px solid #f0f4f8",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#94a3b8",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 4,
                }}
              >
                {d.label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0D2137" }}>
                {d.val}
              </div>
            </div>
          ))}
        </div>

        {/* ── Items Table ── */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#0D2137",
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Daftar Item
          </div>
          <div
            style={{
              border: "1px solid #f0f4f8",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Deskripsi", "Qty", "Harga", "Subtotal"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 14px",
                        textAlign: h === "Deskripsi" ? "left" : "right",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid #f0f4f8",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(invoice.items ?? []).length > 0 ? (
                  invoice.items.map((item, i) => (
                    <tr key={item.id || i} style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td style={{ padding: "10px 14px", color: "#0D2137", fontWeight: 500 }}>
                        {item.description}
                        <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 6 }}>
                          {item.unit}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "right", color: "#64748b" }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "right", color: "#64748b" }}>
                        Rp {fmt(parseNum(item.unit_price))}
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#0D2137" }}>
                        Rp {fmt(parseNum(item.amount))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                      Tidak ada item
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Totals ── */}
        <div
          style={{
            background: "#0D2137",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 20,
          }}
        >
          {/* Subtotal */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
            <span>Subtotal</span>
            <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
              Rp {fmt(parseNum(invoice.subtotal))}
            </span>
          </div>

          {/* Diskon */}
          {parseNum(invoice.discount_amount) > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
              <span>Diskon ({invoice.discount_pct}%)</span>
              <span style={{ color: "#ff5c7a", fontWeight: 600 }}>
                −Rp {fmt(parseNum(invoice.discount_amount))}
              </span>
            </div>
          )}

          {/* PPN */}
          {parseNum(invoice.tax_amount) > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
              <span>PPN ({invoice.tax_pct}%)</span>
              <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                Rp {fmt(parseNum(invoice.tax_amount))}
              </span>
            </div>
          )}

          {/* Total */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: "white" }}>
              TOTAL
            </span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#00E5B4", letterSpacing: "-0.03em" }}>
              Rp {fmt(parseNum(invoice.total))}
            </span>
          </div>

          {/* Payment progress */}
          {parseNum(invoice.paid_amount) > 0 && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                <span>Sudah dibayar</span>
                <span style={{ color: "#00C896", fontWeight: 700 }}>
                  Rp {fmt(parseNum(invoice.paid_amount))}
                </span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 100, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: "linear-gradient(90deg,#00C896,#00E5B4)",
                    borderRadius: 100,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
              {parseNum(invoice.balance_due) > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
                  <span>Sisa tagihan</span>
                  <span style={{ color: "#ff5c7a", fontWeight: 700 }}>
                    Rp {fmt(parseNum(invoice.balance_due))}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Riwayat Pembayaran ── */}
        {(invoice.payments ?? []).length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#0D2137",
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Riwayat Pembayaran
            </div>
            {invoice.payments.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "#f8fafc",
                  borderRadius: 8,
                  marginBottom: 6,
                  border: "1px solid #f0f4f8",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0D2137" }}>
                    Rp {fmt(parseNum(p.amount))}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                    {fmtDate(p.paid_at)}
                  </div>
                </div>
                <Badge status={p.method} size="sm" />
              </div>
            ))}
          </div>
        )}

        {/* ── Catatan ── */}
        {invoice.notes && (
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: 13,
              color: "#92400e",
            }}
          >
            📝 {invoice.notes}
          </div>
        )}

        {/* ── Action Buttons ── */}
        {canAct ? (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {/* Tandai Terkirim — hanya kalau masih Draft */}
            {invoice.status === "draft" && (
              <button
                onClick={() => onSendWA(invoice.id)}
                disabled={isSending}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: isSending ? "#94a3b8" : "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 9,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: isSending ? "not-allowed" : "pointer",
                  color: "#0D2137",
                  transition: "all 0.2s",
                  minWidth: 140,
                }}
              >
                {isSending ? "Memproses..." : "📤 Kirim & Tandai Terkirim"}
              </button>
            )}

            {/* Kirim WA — untuk status sent / partial */}
            {invoice.status !== "draft" && (
              <button
                onClick={() => onSendWA(invoice.id)}
                disabled={isSending}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: isSending ? "#94a3b8" : "#25D366",
                  color: "white",
                  border: "none",
                  borderRadius: 9,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: isSending ? "not-allowed" : "pointer",
                  opacity: isSending ? 0.7 : 1,
                  transition: "all 0.2s",
                  minWidth: 140,
                }}
              >
                {isSending ? "Memproses..." : "📲 Kirim via WA"}
              </button>
            )}

            {/* Catat Pembayaran */}
            <button
              onClick={() => onPay(invoice)}
              style={{
                flex: 2,
                padding: "12px",
                background: "linear-gradient(135deg,#00C896,#00E5B4)",
                color: "#0D2137",
                border: "none",
                borderRadius: 9,
                fontFamily: "'Syne', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                minWidth: 160,
              }}
            >
              💳 Catat Pembayaran
            </button>
          </div>
        ) : invoice.status === "paid" ? (
          <div
            style={{
              textAlign: "center",
              padding: "14px",
              background: "rgba(0,200,150,0.08)",
              border: "1px solid rgba(0,200,150,0.2)",
              borderRadius: 9,
              color: "#00C896",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            ✅ Invoice ini sudah LUNAS
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "14px",
              background: "rgba(100,116,139,0.08)",
              border: "1px solid rgba(100,116,139,0.2)",
              borderRadius: 9,
              color: "#64748b",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Invoice ini sudah dibatalkan
          </div>
        )}
      </div>
    </Modal>
  );
}