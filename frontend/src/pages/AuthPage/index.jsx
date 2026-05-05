import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { STYLES } from "./AuthPage.styles";
import { LeftPanel } from "./components/LeftPanel";
import { RightPanel } from "./components/RightPanel";
import { Toast } from "./components/Toast";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn());

  // Kalau sudah login, langsung ke dashboard
  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard", { replace: true });
  }, [isLoggedIn, navigate]);

  return (
    <>
      <style>{STYLES}</style>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="auth-root">
        <LeftPanel />
        <RightPanel
          tab={tab}
          onTabChange={setTab}
          onSuccess={(msg) => setToast(msg)}
          onRegisterSuccess={(msg) => {
            setToast(msg);
            setTimeout(() => setTab("login"), 2000);
          }}
        />
      </div>
    </>
  );
}