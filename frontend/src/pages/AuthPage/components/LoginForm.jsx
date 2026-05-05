import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";
import { IconMail, IconLock, IconEye, IconEyeOff, GoogleIcon } from "../AuthPage.icons";

export function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  function validate() {
    const e = {};
    if (!email) e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Format email tidak valid";
    if (!password) e.password = "Password wajib diisi";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login/", { email, password });
      setAuth(data.user, data.tokens);
      onSuccess(`Selamat datang, ${data.user.first_name}! 👋`);
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ??
        err.response?.data?.detail ??
        "Login gagal. Periksa email dan password.";
      setErrors({ api: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="form-heading">
        <div className="form-title">
          Selamat <span>Datang</span>
        </div>
        <div className="form-subtitle">Masuk ke akun TenebraTrack Anda</div>
      </div>

      <div className="field-group">
        <label className="field-label">Email</label>
        <div className="field-wrap">
          <div className="field-icon"><IconMail /></div>
          <input
            className="field-input"
            type="email"
            placeholder="nama@perusahaan.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((v) => ({ ...v, email: "" }));
            }}
          />
        </div>
        {errors.email && <div className="field-error">⚠ {errors.email}</div>}
      </div>

      <div className="field-group">
        <label className="field-label">Password</label>
        <div className="field-wrap">
          <div className="field-icon"><IconLock /></div>
          <input
            className="field-input"
            type={showPw ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((v) => ({ ...v, password: "" }));
            }}
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
        {errors.password && <div className="field-error">⚠ {errors.password}</div>}
      </div>

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
            marginBottom: 4,
          }}
        >
          ⚠ {errors.api}
        </div>
      )}

      <div className="forgot-row">
        <a href="#" className="forgot-link">Lupa password?</a>
      </div>

      <button
        className={`btn-submit ${loading ? "loading" : ""}`}
        onClick={handleSubmit}
      >
        <span>{loading ? "Memproses..." : "Masuk ke Dashboard"}</span>
      </button>

      <div className="divider">atau masuk dengan</div>

      <button className="btn-google">
        <GoogleIcon />
        Lanjutkan dengan Google
      </button>

      <div className="terms-text">
        Dengan masuk, Anda menyetujui <a href="#">Syarat & Ketentuan</a> dan{" "}
        <a href="#">Kebijakan Privasi</a> kami
      </div>
    </>
  );
}