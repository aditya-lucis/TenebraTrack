import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function RightPanel({ tab, onTabChange, onSuccess, onRegisterSuccess }) {
  return (
    <div className="right-panel">
      <div className="form-container">
        <div className="tab-switch">
          <button
            className={`tab-btn ${tab === "login" ? "active" : ""}`}
            onClick={() => onTabChange("login")}
          >
            Masuk
          </button>
          <button
            className={`tab-btn ${tab === "register" ? "active" : ""}`}
            onClick={() => onTabChange("register")}
          >
            Daftar Gratis
          </button>
        </div>

        {tab === "login" ? (
          <LoginForm onSuccess={onSuccess} />
        ) : (
          <RegisterForm onSuccess={onRegisterSuccess} />
        )}
      </div>
    </div>
  );
}