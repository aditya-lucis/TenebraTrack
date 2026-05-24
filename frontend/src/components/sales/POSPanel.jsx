import { useState } from "react";

const fmt = (n) =>
  Number(n || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 });

const EMPTY_ITEM = () => ({
  description: "",
  quantity: "1",
  unit_price: "",
  amount: 0,
});

const METHODS = [
  { key: "cash",     label: "💵 Tunai"   },
  { key: "transfer", label: "🏦 Transfer" },
  { key: "qris",     label: "📱 QRIS"    },
];

export default function POSPanel({ onSubmit, isLoading, customers }) {
  const [items,   setItems]   = useState([EMPTY_ITEM()]);
  const [method,  setMethod]  = useState("cash");
  const [paid,    setPaid]    = useState("");
  const [custId,  setCustId]  = useState("");
  const [errors,  setErrors]  = useState({});
  const [success, setSuccess] = useState(null);

  // ── Item handlers ─────────────────────────────────────────────────────────
  function updateItem(idx, key, val) {
    setItems((prev) => {
      const next = [...prev];
      next[idx]  = { ...next[idx], [key]: val };
      const qty  = parseFloat(next[idx].quantity)   || 0;
      const price= parseFloat(next[idx].unit_price) || 0;
      next[idx].amount = qty * price;
      return next;
    });
    setErrors((e) => ({ ...e, [`item_${idx}`]: "" }));
  }

  function addItem()      { setItems((p) => [...p, EMPTY_ITEM()]); }
  function removeItem(i)  { setItems((p) => p.filter((_, idx) => idx !== i)); }

  // ── Calculations ──────────────────────────────────────────────────────────
  const total  = items.reduce((s, i) => s + (i.amount || 0), 0);
  const change = Math.max(0, (parseFloat(paid) || 0) - total);

  // ── Submit ────────────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    items.forEach((item, i) => {
      if (!item.description.trim())          e[`item_${i}`] = "Nama item wajib";
      if (!item.unit_price || parseFloat(item.unit_price) <= 0) e[`item_${i}_price`] = "Harga wajib";
    });
    if (!paid || parseFloat(paid) < total) e.paid = "Nominal bayar kurang dari total";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const result = await onSubmit({
      customer_id: custId || null,
      method,
      paid_amount: parseFloat(paid),
      items: items.map((item) => ({
        description: item.description,
        quantity:    parseFloat(item.quantity)   || 1,
        unit_price:  parseFloat(item.unit_price) || 0,
      })),
    });

    if (result?.number) {
      setSuccess({ number: result.number, change: result.change, total });
      setItems([EMPTY_ITEM()]);
      setPaid("");
      setCustId("");
      setMethod("cash");
    }
  }

  // ── Success receipt ───────────────────────────────────────────────────────
  if (success) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(13,33,55,0.06)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#00C896,#00E5B4)",
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 20,
              color: "#0D2137",
              marginBottom: 4,
            }}
          >
            Transaksi Berhasil!
          </div>
          <div style={{ fontSize: 13, color: "rgba(13,33,55,0.6)" }}>
            {success.number}
          </div>
        </div>
        <div style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            <span style={{ color: "#64748b" }}>Total</span>
            <span style={{ fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
              Rp {fmt(success.total)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 24,
              fontSize: 16,
              paddingTop: 12,
              borderTop: "2px dashed #e2e8f0",
            }}
          >
            <span style={{ fontWeight: 700, color: "#0D2137" }}>Kembalian</span>
            <span
              style={{
                fontWeight: 800,
                fontFamily: "'Syne', sans-serif",
                fontSize: 20,
                color: "#00C896",
              }}
            >
              Rp {fmt(success.change)}
            </span>
          </div>
          <button
            onClick={() => setSuccess(null)}
            style={{
              width: "100%",
              padding: "13px",
              background: "linear-gradient(135deg,#0D2137,#1a3a55)",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontFamily: "'Syne', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + Transaksi Baru
          </button>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(13,33,55,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#0D2137",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 20 }}>🛒</span>
        <div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 15,
              color: "white",
            }}
          >
            Kasir Cepat
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            Transaksi tanpa invoice formal
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 20px" }}>
        {/* Pelanggan (opsional) */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Pelanggan (opsional)
          </div>
          <select
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1.5px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 13,
              color: "#0D2137",
              background: "#fafbfc",
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
              cursor: "pointer",
            }}
            value={custId}
            onChange={(e) => setCustId(e.target.value)}
          >
            <option value="">— Pelanggan walk-in —</option>
            {(customers ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Items */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0D2137", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
            Item Belanja
          </div>

          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#f8fafc",
                border: "1px solid #f0f4f8",
                borderRadius: 10,
                padding: "12px",
                marginBottom: 8,
              }}
            >
              {/* Nama item */}
              <input
                style={{
                  width: "100%",
                  padding: "9px 11px",
                  border: `1.5px solid ${errors[`item_${idx}`] ? "#ff5c7a" : "#e2e8f0"}`,
                  borderRadius: 7,
                  fontSize: 13,
                  marginBottom: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  background: "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#0D2137",
                }}
                placeholder="Nama produk / jasa"
                value={item.description}
                onChange={(e) => updateItem(idx, "description", e.target.value)}
              />

              {/* Qty + Harga row */}
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 32px", gap: 8, alignItems: "center" }}>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  style={{
                    padding: "9px 10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 7,
                    fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif",
                    background: "#fff",
                    outline: "none",
                    textAlign: "center",
                    color: "#0D2137",
                  }}
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                />
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#94a3b8", fontWeight: 600, pointerEvents: "none" }}>
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    style={{
                      width: "100%",
                      padding: "9px 10px 9px 28px",
                      border: `1.5px solid ${errors[`item_${idx}_price`] ? "#ff5c7a" : "#e2e8f0"}`,
                      borderRadius: 7,
                      fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif",
                      background: "#fff",
                      outline: "none",
                      boxSizing: "border-box",
                      color: "#0D2137",
                    }}
                    placeholder="Harga satuan"
                    value={item.unit_price}
                    onChange={(e) => updateItem(idx, "unit_price", e.target.value)}
                  />
                </div>
                <button
                  onClick={() => removeItem(idx)}
                  disabled={items.length === 1}
                  style={{
                    width: 32, height: 36,
                    borderRadius: 7,
                    border: "1.5px solid #fee2e2",
                    background: "#fff0f0",
                    color: "#ff5c7a",
                    cursor: items.length === 1 ? "not-allowed" : "pointer",
                    opacity: items.length === 1 ? 0.4 : 1,
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Subtotal row */}
              {item.amount > 0 && (
                <div style={{ fontSize: 12, color: "#00C896", fontWeight: 700, marginTop: 6, textAlign: "right" }}>
                  = Rp {fmt(item.amount)}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addItem}
            style={{
              width: "100%",
              padding: "9px",
              border: "1.5px dashed #00C896",
              borderRadius: 8,
              background: "rgba(0,200,150,0.04)",
              color: "#00C896",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 16,
            }}
          >
            + Tambah Item
          </button>
        </div>

        {/* Metode */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0D2137", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Pembayaran
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {METHODS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                style={{
                  flex: 1,
                  padding: "9px 6px",
                  borderRadius: 8,
                  border: `1.5px solid ${method === m.key ? "#00C896" : "#e2e8f0"}`,
                  background: method === m.key ? "rgba(0,200,150,0.1)" : "#fafbfc",
                  color: method === m.key ? "#00C896" : "#64748b",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s",
                  textAlign: "center",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nominal bayar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0D2137", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 7 }}>
            Nominal Bayar <span style={{ color: "#ff5c7a" }}>*</span>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
              Rp
            </span>
            <input
              type="number"
              min="0"
              step="any"
              style={{
                width: "100%",
                padding: "11px 14px 11px 36px",
                border: `1.5px solid ${errors.paid ? "#ff5c7a" : "#e2e8f0"}`,
                borderRadius: 9,
                fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                background: "#fafbfc",
                outline: "none",
                boxSizing: "border-box",
                color: "#0D2137",
                fontWeight: 600,
              }}
              placeholder="0"
              value={paid}
              onChange={(e) => {
                setPaid(e.target.value);
                setErrors((err) => ({ ...err, paid: "" }));
              }}
            />
          </div>
          {errors.paid && (
            <div style={{ fontSize: 11, color: "#ff5c7a", marginTop: 4 }}>⚠ {errors.paid}</div>
          )}
        </div>

        {/* Total + kembalian display */}
        <div
          style={{
            background: "#0D2137",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            <span>Total Belanja</span>
            <span style={{ color: "white", fontWeight: 700 }}>Rp {fmt(total)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "white" }}>Kembalian</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: change >= 0 && paid ? "#00E5B4" : "rgba(255,255,255,0.3)" }}>
              Rp {fmt(change)}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || total === 0}
          style={{
            width: "100%",
            padding: "14px",
            background:
              isLoading || total === 0
                ? "#94a3b8"
                : "linear-gradient(135deg,#00C896,#00E5B4)",
            color: isLoading || total === 0 ? "white" : "#0D2137",
            border: "none",
            borderRadius: 10,
            fontFamily: "'Syne', sans-serif",
            fontSize: 15,
            fontWeight: 800,
            cursor: isLoading || total === 0 ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            letterSpacing: "-0.01em",
          }}
        >
          {isLoading ? "Memproses..." : `💳 Bayar Rp ${fmt(total)}`}
        </button>
      </div>
    </div>
  );
}