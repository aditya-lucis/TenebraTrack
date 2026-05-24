import { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const fmt = (n) =>
  Number(n || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 });

const inputStyle = (hasError = false) => ({
  width: "100%",
  padding: "10px 12px",
  border: `1.5px solid ${hasError ? "#ff5c7a" : "#e2e8f0"}`,
  borderRadius: 8,
  fontSize: 13,
  color: "#0D2137",
  background: "#fafbfc",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
});

const focusBorder = (e) => {
  e.target.style.borderColor = "#00C896";
  e.target.style.boxShadow   = "0 0 0 3px rgba(0,200,150,0.12)";
  e.target.style.background  = "#fff";
};
const blurBorder = (e, hasError) => {
  e.target.style.borderColor = hasError ? "#ff5c7a" : "#e2e8f0";
  e.target.style.boxShadow   = "none";
};

const LABEL = ({ text, required }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 700,
      color: "#0D2137",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginBottom: 6,
    }}
  >
    {text} {required && <span style={{ color: "#ff5c7a" }}>*</span>}
  </div>
);

const EMPTY_ITEM = () => ({
  description: "",
  quantity: "1",
  unit: "pcs",
  unit_price: "",
  amount: 0,
});

export default function InvoiceForm({ open, onClose, onSave, customers, isLoading, errors: apiErrors }) {
  const today = new Date().toISOString().split("T")[0];
  const due14 = new Date(Date.now() + 14 * 864e5).toISOString().split("T")[0];

  const [form, setForm] = useState({
    customer_id: "",
    issue_date:  today,
    due_date:    due14,
    notes:       "",
    discount_pct:"0",
    tax_pct:     "11",
    items:       [EMPTY_ITEM()],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setForm({
        customer_id: "",
        issue_date:  today,
        due_date:    due14,
        notes:       "",
        discount_pct:"0",
        tax_pct:     "11",
        items:       [EMPTY_ITEM()],
      });
      setErrors({});
    }
  }, [open]);

  // Sync API errors
  useEffect(() => {
    if (apiErrors) setErrors((e) => ({ ...e, ...apiErrors }));
  }, [apiErrors]);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  // ── Item handlers ────────────────────────────────────────────────────────
  function updateItem(idx, key, val) {
    setForm((f) => {
      const items = [...f.items];
      items[idx]  = { ...items[idx], [key]: val };
      // Hitung amount
      const qty   = parseFloat(items[idx].quantity)   || 0;
      const price = parseFloat(items[idx].unit_price) || 0;
      items[idx].amount = qty * price;
      return { ...f, items };
    });
  }

  function addItem() {
    setForm((f) => ({ ...f, items: [...f.items, EMPTY_ITEM()] }));
  }

  function removeItem(idx) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }

  // ── Calculations ─────────────────────────────────────────────────────────
  const subtotal = form.items.reduce((s, i) => s + (i.amount || 0), 0);
  const discAmt  = subtotal * (parseFloat(form.discount_pct) / 100 || 0);
  const taxable  = subtotal - discAmt;
  const taxAmt   = taxable  * (parseFloat(form.tax_pct) / 100 || 0);
  const total    = taxable  + taxAmt;

  // ── Validation ───────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.customer_id) e.customer_id = "Pilih pelanggan";
    if (!form.issue_date)  e.issue_date  = "Tanggal invoice wajib diisi";
    if (!form.due_date)    e.due_date    = "Tanggal jatuh tempo wajib diisi";
    form.items.forEach((item, i) => {
      if (!item.description.trim()) e[`item_${i}_desc`]  = "Deskripsi wajib";
      if (!item.unit_price || parseFloat(item.unit_price) <= 0)
        e[`item_${i}_price`] = "Harga wajib";
    });
    return e;
  }

  function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({
      customer_id:  form.customer_id,
      issue_date:   form.issue_date,
      due_date:     form.due_date,
      notes:        form.notes,
      discount_pct: parseFloat(form.discount_pct) || 0,
      tax_pct:      parseFloat(form.tax_pct)      || 11,
      items: form.items.map((item) => ({
        description: item.description,
        quantity:    parseFloat(item.quantity)   || 1,
        unit:        item.unit,
        unit_price:  parseFloat(item.unit_price) || 0,
      })),
    });
  }

  const sectionTitle = (text) => (
    <div
      style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: 13,
        color: "#0D2137",
        letterSpacing: "-0.01em",
        marginBottom: 14,
        paddingBottom: 10,
        borderBottom: "1px solid #f0f4f8",
      }}
    >
      {text}
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Buat Invoice Baru"
      subtitle="Isi detail faktur untuk pelanggan"
      size="xl"
    >
      <div style={{ padding: "20px 24px" }}>
        {/* ── Info Dasar ── */}
        {sectionTitle("📋 Informasi Invoice")}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 14,
            marginBottom: 20,
          }}
          className="invoice-top-grid"
        >
          {/* Pelanggan */}
          <div style={{ gridColumn: "1 / -1" }}>
            <LABEL text="Pelanggan" required />
            <select
              style={{ ...inputStyle(!!errors.customer_id), cursor: "pointer" }}
              value={form.customer_id}
              onChange={(e) => set("customer_id", e.target.value)}
              onFocus={focusBorder}
              onBlur={(e) => blurBorder(e, !!errors.customer_id)}
            >
              <option value="">— Pilih Pelanggan —</option>
              {(customers ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ""}
                </option>
              ))}
            </select>
            {errors.customer_id && (
              <div style={{ fontSize: 11, color: "#ff5c7a", marginTop: 4 }}>
                ⚠ {errors.customer_id}
              </div>
            )}
          </div>

          {/* Tanggal */}
          <div>
            <LABEL text="Tanggal Invoice" required />
            <input
              type="date"
              style={inputStyle(!!errors.issue_date)}
              value={form.issue_date}
              onChange={(e) => set("issue_date", e.target.value)}
              onFocus={focusBorder}
              onBlur={(e) => blurBorder(e, !!errors.issue_date)}
            />
          </div>

          <div>
            <LABEL text="Jatuh Tempo" required />
            <input
              type="date"
              style={inputStyle(!!errors.due_date)}
              value={form.due_date}
              onChange={(e) => set("due_date", e.target.value)}
              onFocus={focusBorder}
              onBlur={(e) => blurBorder(e, false)}
            />
          </div>

          <div>
            <LABEL text="PPN (%)" />
            <select
              style={{ ...inputStyle(false), cursor: "pointer" }}
              value={form.tax_pct}
              onChange={(e) => set("tax_pct", e.target.value)}
            >
              <option value="0">0% — Tanpa PPN</option>
              <option value="11">11% — PPN Standar</option>
              <option value="12">12% — PPN Baru</option>
            </select>
          </div>
        </div>

        {/* ── Line Items ── */}
        {sectionTitle("📦 Daftar Produk / Jasa")}

        {/* Header tabel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 90px 120px 100px 32px",
            gap: 8,
            marginBottom: 8,
            padding: "0 4px",
          }}
          className="item-grid"
        >
          {["Deskripsi", "Qty", "Satuan", "Harga Satuan", "Subtotal", ""].map((h, i) => (
            <div
              key={i}
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
          ))}
        </div>

        {/* Item rows */}
        {form.items.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 80px 90px 120px 100px 32px",
              gap: 8,
              marginBottom: 8,
              alignItems: "start",
              padding: "10px 8px",
              background: idx % 2 === 0 ? "#fafbfc" : "#fff",
              borderRadius: 8,
              border: "1px solid #f0f4f8",
            }}
            className="item-row"
          >
            {/* Deskripsi */}
            <div>
              <input
                style={inputStyle(!!errors[`item_${idx}_desc`])}
                placeholder="Nama produk / jasa"
                value={item.description}
                onChange={(e) => updateItem(idx, "description", e.target.value)}
                onFocus={focusBorder}
                onBlur={(e) => blurBorder(e, !!errors[`item_${idx}_desc`])}
              />
              {errors[`item_${idx}_desc`] && (
                <div style={{ fontSize: 10, color: "#ff5c7a", marginTop: 3 }}>
                  ⚠ {errors[`item_${idx}_desc`]}
                </div>
              )}
            </div>

            {/* Qty */}
            <input
              type="number"
              min="0.01"
              step="any"
              style={{ ...inputStyle(false), textAlign: "center" }}
              value={item.quantity}
              onChange={(e) => updateItem(idx, "quantity", e.target.value)}
              onFocus={focusBorder}
              onBlur={(e) => blurBorder(e, false)}
            />

            {/* Satuan */}
            <select
              style={{ ...inputStyle(false), cursor: "pointer", padding: "10px 8px" }}
              value={item.unit}
              onChange={(e) => updateItem(idx, "unit", e.target.value)}
            >
              {["pcs", "kg", "gram", "liter", "meter", "box", "lusin", "karton", "jam"].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>

            {/* Harga */}
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 12,
                  color: "#94a3b8",
                  fontWeight: 600,
                  pointerEvents: "none",
                }}
              >
                Rp
              </span>
              <input
                type="number"
                min="0"
                step="any"
                style={{
                  ...inputStyle(!!errors[`item_${idx}_price`]),
                  paddingLeft: 30,
                }}
                placeholder="0"
                value={item.unit_price}
                onChange={(e) => updateItem(idx, "unit_price", e.target.value)}
                onFocus={focusBorder}
                onBlur={(e) => blurBorder(e, !!errors[`item_${idx}_price`])}
              />
            </div>

            {/* Subtotal */}
            <div
              style={{
                padding: "10px 12px",
                background: "rgba(0,200,150,0.06)",
                border: "1px solid rgba(0,200,150,0.15)",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                color: "#0D2137",
                fontFamily: "'Syne', sans-serif",
                textAlign: "right",
              }}
            >
              {fmt(item.amount)}
            </div>

            {/* Hapus */}
            <button
              onClick={() => removeItem(idx)}
              disabled={form.items.length === 1}
              style={{
                width: 32,
                height: 36,
                borderRadius: 7,
                border: "1.5px solid #fee2e2",
                background: "#fff0f0",
                color: "#ff5c7a",
                cursor: form.items.length === 1 ? "not-allowed" : "pointer",
                opacity: form.items.length === 1 ? 0.4 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                transition: "all 0.15s",
                flexShrink: 0,
              }}
              title="Hapus item"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Tambah item */}
        <button
          onClick={addItem}
          style={{
            width: "100%",
            padding: "10px",
            border: "1.5px dashed #00C896",
            borderRadius: 8,
            background: "rgba(0,200,150,0.04)",
            color: "#00C896",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: 24,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,200,150,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0,200,150,0.04)";
          }}
        >
          + Tambah Item
        </button>

        {/* ── Summary & Catatan ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: 20,
            alignItems: "start",
          }}
          className="invoice-bottom-grid"
        >
          {/* Catatan */}
          <div>
            <LABEL text="Catatan (opsional)" />
            <textarea
              style={{ ...inputStyle(false), minHeight: 80, resize: "vertical" }}
              placeholder="Terima kasih atas kepercayaan Anda..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              onFocus={focusBorder}
              onBlur={(e) => blurBorder(e, false)}
            />

            <div style={{ marginTop: 12 }}>
              <LABEL text="Diskon (%)" />
              <input
                type="number"
                min="0"
                max="100"
                style={{ ...inputStyle(false), maxWidth: 120 }}
                value={form.discount_pct}
                onChange={(e) => set("discount_pct", e.target.value)}
                onFocus={focusBorder}
                onBlur={(e) => blurBorder(e, false)}
              />
            </div>
          </div>

          {/* Total breakdown */}
          <div
            style={{
              background: "#0D2137",
              borderRadius: 14,
              padding: "18px 20px",
              color: "white",
            }}
          >
            {[
              { label: "Subtotal",  val: subtotal },
              { label: `Diskon (${form.discount_pct}%)`, val: -discAmt, hide: !discAmt },
              { label: `PPN (${form.tax_pct}%)`,         val: taxAmt,   hide: !parseFloat(form.tax_pct) },
            ]
              .filter((r) => !r.hide)
              .map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  <span>{row.label}</span>
                  <span style={{ fontWeight: 600, color: row.val < 0 ? "#ff5c7a" : "rgba(255,255,255,0.85)" }}>
                    {row.val < 0 ? "−" : ""}Rp {fmt(Math.abs(row.val))}
                  </span>
                </div>
              ))}

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.12)",
                paddingTop: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 14,
                  color: "white",
                }}
              >
                TOTAL
              </span>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  color: "#00E5B4",
                  letterSpacing: "-0.03em",
                }}
              >
                Rp {fmt(total)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Footer actions ── */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 24,
            paddingTop: 20,
            borderTop: "1px solid #f0f4f8",
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "13px",
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              color: "#64748b",
            }}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              flex: 3,
              padding: "13px",
              background: isLoading
                ? "#94a3b8"
                : "linear-gradient(135deg,#0D2137,#1a3a55)",
              color: "white",
              border: "none",
              borderRadius: 9,
              fontFamily: "'Syne', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isLoading)
                e.currentTarget.style.background =
                  "linear-gradient(135deg,#00C896,#00E5B4)";
              if (!isLoading) e.currentTarget.style.color = "#0D2137";
            }}
            onMouseLeave={(e) => {
              if (!isLoading)
                e.currentTarget.style.background =
                  "linear-gradient(135deg,#0D2137,#1a3a55)";
              if (!isLoading) e.currentTarget.style.color = "white";
            }}
          >
            {isLoading ? "Membuat Invoice..." : "📄 Buat Invoice"}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .item-grid { display: none !important; }
          .item-row {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          .invoice-top-grid { grid-template-columns: 1fr !important; }
          .invoice-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Modal>
  );
}