import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
  IconBuilding,
  IconEye,
  IconEyeOff,
  IconCheck,
} from "../AuthPage.icons";
import { BUSINESS_TYPES, FIELD_ERROR_MAP } from "../AuthPage.utils";
import { StrengthMeter } from "./StrengthMeter";

export function RegisterForm({ onSuccess }) {
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    companyName: "",
    businessType: "",
  });

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "", api: "" }));
  }

  function validateStep1() {
    const e = {};
    if (!form.firstName) e.firstName = "Nama depan wajib diisi";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email tidak valid";
    if (!form.password || form.password.length < 8) e.password = "Min. 8 karakter";
    return e;
  }

  function validateStep2() {
    const e = {};
    if (!form.companyName) e.companyName = "Nama bisnis wajib diisi";
    return e;
  }

  async function handleNext() {
    if (step === 1) {
      const e = validateStep1();
      setErrors(e);
      if (!Object.keys(e).length) setStep(2);
    } else {
      const e = validateStep2();
      setErrors(e);
      if (Object.keys(e).length) return;

      setLoading(true);
      try {
        const { data } = await api.post("/auth/register/", {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          company_name: form.companyName,
          business_type: form.businessType,
        });
        setAuth(data.user, data.tokens);
        onSuccess(`Akun berhasil dibuat! Selamat datang, ${data.user.first_name} 🎉`);
        setTimeout(() => navigate("/dashboard"), 800);
      } catch (err) {
        const errData = err.response?.data ?? {};
        const fieldErrors = {};
        let apiMsg = "";

        for (const [key, val] of Object.entries(errData)) {
          const msg = Array.isArray(val) ? val[0] : val;
          if (FIELD_ERROR_MAP[key]) fieldErrors[FIELD_ERROR_MAP[key]] = msg;
          else apiMsg = msg;
        }

        if (Object.keys(fieldErrors).length) {
          setErrors(fieldErrors);
          if (fieldErrors.email || fieldErrors.password) setStep(1);
        } else {
          setErrors({ api: apiMsg || "Registrasi gagal. Coba lagi." });
        }
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <>
      <div className="progress-dots">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="prog-dot"
            style={{
              width: i === step ? 24 : 8,
              ...(i <= step ? { background: "var(--mint)" } : {}),
            }}
          />
        ))}
        <div
          style={{
            fontSize: 11,
            color: "var(--gray-400)",
            marginLeft: "auto",
            fontWeight: 600,
          }}
        >
          Langkah {step} dari 2
        </div>
      </div>

      <div className="form-heading">
        <div className="form-title">
          {step === 1 ? (
            <>Buat <span>Akun</span></>
          ) : (
            <>Info <span>Bisnis</span></>
          )}
        </div>
        <div className="form-subtitle">
          {step === 1
            ? "Gratis 14 hari, tanpa kartu kredit"
            : "Bantu kami mengenal bisnis Anda"}
        </div>
      </div>

      {step === 1 && (
        <>
          <div className="field-row">
            <div>
              <label className="field-label">Nama Depan</label>
              <div className="field-wrap">
                <div className="field-icon"><IconUser /></div>
                <input
                  className="field-input"
                  placeholder="Nama Pemilik Usaha"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                />
              </div>
              {errors.firstName && (
                <div className="field-error">⚠ {errors.firstName}</div>
              )}
            </div>
            <div>
              <label className="field-label">Nama Belakang</label>
              <div className="field-wrap">
                <div className="field-icon"><IconUser /></div>
                <input
                  className="field-input"
                  placeholder=""
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Email</label>
            <div className="field-wrap">
              <div className="field-icon"><IconMail /></div>
              <input
                className="field-input"
                type="email"
                placeholder="nama@bisnis.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            {errors.email && <div className="field-error">⚠ {errors.email}</div>}
          </div>

          <div className="field-group">
            <label className="field-label">No. WhatsApp</label>
            <div className="field-wrap">
              <div className="field-icon"><IconPhone /></div>
              <input
                className="field-input"
                placeholder="08xxxxxxxxxx"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <div className="field-wrap">
              <div className="field-icon"><IconLock /></div>
              <input
                className="field-input"
                type={showPw ? "text" : "password"}
                placeholder="Min. 8 karakter"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                style={{ paddingRight: 44 }}
              />
              <button
                className="eye-toggle"
                onClick={() => setShowPw(!showPw)}
                type="button"
              >
                {showPw ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            <StrengthMeter password={form.password} />
            {errors.password && (
              <div className="field-error">⚠ {errors.password}</div>
            )}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="field-group">
            <label className="field-label">Nama Bisnis / Toko</label>
            <div className="field-wrap">
              <div className="field-icon"><IconBuilding /></div>
              <input
                className="field-input"
                placeholder="CV. Maju Bersama"
                value={form.companyName}
                onChange={(e) => update("companyName", e.target.value)}
              />
            </div>
            {errors.companyName && (
              <div className="field-error">⚠ {errors.companyName}</div>
            )}
          </div>

          <div className="field-group">
            <label className="field-label">Jenis Usaha</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 2,
              }}
            >
              {BUSINESS_TYPES.map((bt) => (
                <button
                  key={bt}
                  type="button"
                  onClick={() => update("businessType", bt)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1.5px solid ${
                      form.businessType === bt ? "var(--mint)" : "#e2e8f0"
                    }`,
                    background:
                      form.businessType === bt ? "var(--mint-dim)" : "var(--gray-100)",
                    color:
                      form.businessType === bt ? "var(--mint)" : "var(--gray-400)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {form.businessType === bt && <IconCheck />} {bt}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(0,200,150,0.08) 0%, rgba(0,229,180,0.05) 100%)",
              border: "1px solid rgba(0,200,150,0.2)",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 20,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <div style={{ color: "var(--mint)", marginTop: 1, flexShrink: 0 }}>
              <IconCheck />
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--navy)",
                  marginBottom: 2,
                }}
              >
                Uji Coba Gratis 14 Hari
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--gray-400)",
                  lineHeight: 1.5,
                }}
              >
                Akses penuh semua fitur. Tidak perlu kartu kredit. Batalkan
                kapan saja.
              </div>
            </div>
          </div>
        </>
      )}

      {errors.api && (
        <div
          style={{
            background: "rgba(255,92,122,0.08)",
            border: "1px solid rgba(255,92,122,0.25)",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 13,
            color: "var(--danger)",
            fontWeight: 500,
            marginBottom: 12,
          }}
        >
          ⚠ {errors.api}
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              padding: "15px 20px",
              border: "1.5px solid #e2e8f0",
              borderRadius: 8,
              background: "white",
              color: "var(--navy)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "var(--font-body)",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            ← Kembali
          </button>
        )}
        <button
          className={`btn-submit ${loading ? "loading" : ""}`}
          onClick={handleNext}
          style={{ flex: 1 }}
        >
          <span>
            {loading
              ? "Membuat akun..."
              : step === 1
              ? "Lanjut →"
              : "Buat Akun Gratis"}
          </span>
        </button>
      </div>

      <div className="terms-text">
        Dengan mendaftar, Anda menyetujui <a href="#">Syarat & Ketentuan</a> dan{" "}
        <a href="#">Kebijakan Privasi</a> kami
      </div>
    </>
  );
}