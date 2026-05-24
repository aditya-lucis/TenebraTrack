import { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const FIELD = ({ label, required, error, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label
      style={{
        display: "block",
        fontSize: 11,
        fontWeight: 700,
        color: "#0D2137",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 7,
      }}
    >
      {label} {required && <span style={{ color: "#ff5c7a" }}>*</span>}
    </label>
    {children}
    {error && (
      <div style={{ fontSize: 11, color: "#ff5c7a", marginTop: 5, fontWeight: 500 }}>
        ⚠ {error}
      </div>
    )}
  </div>
);

const inputStyle = (hasError) => ({
  width: "100%",
  padding: "11px 14px",
  border: `1.5px solid ${hasError ? "#ff5c7a" : "#e2e8f0"}`,
  borderRadius: 9,
  fontSize: 14,
  color: "#0D2137",
  background: "#fafbfc",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
});

export default function CustomerModal({ open, onClose, onSave, isLoading }) {
  const [form, setForm]   = useState({ name: "", email: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setForm({ name: "", email: "", phone: "", address: "" });
      setErrors({});
    }
  }, [open]);

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Nama pelanggan wajib diisi";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid";
    return e;
  }

  function handleSave() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(form);
  }

  const focusStyle = {
    borderColor: "#00C896",
    boxShadow: "0 0 0 3px rgba(0,200,150,0.12)",
    background: "#fff",
  };

  return (
    <Modal open={open} onClose={onClose} title="Tambah Pelanggan" subtitle="Data pelanggan baru" size="sm">
      <div style={{ padding: "20px 24px 24px" }}>
        <FIELD label="Nama Pelanggan" required error={errors.name}>
          <input
            style={inputStyle(errors.name)}
            placeholder="Toko Barokah / Pak Budi"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = errors.name ? "#ff5c7a" : "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />
        </FIELD>

        <FIELD label="No. WhatsApp" error={errors.phone}>
          <input
            style={inputStyle(errors.phone)}
            placeholder="08xxxxxxxxxx"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />
        </FIELD>

        <FIELD label="Email" error={errors.email}>
          <input
            style={inputStyle(errors.email)}
            placeholder="email@pelanggan.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = errors.email ? "#ff5c7a" : "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />
        </FIELD>

        <FIELD label="Alamat">
          <textarea
            style={{ ...inputStyle(false), minHeight: 80, resize: "vertical" }}
            placeholder="Alamat lengkap (opsional)"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />
        </FIELD>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              color: "#64748b",
              transition: "all 0.15s",
            }}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            style={{
              flex: 2,
              padding: "12px",
              background: isLoading
                ? "#94a3b8"
                : "linear-gradient(135deg,#0D2137,#1a3a55)",
              color: "white",
              border: "none",
              borderRadius: 9,
              fontFamily: "'Syne', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {isLoading ? "Menyimpan..." : "Simpan Pelanggan"}
          </button>
        </div>
      </div>
    </Modal>
  );
}