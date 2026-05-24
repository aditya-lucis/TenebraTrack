import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { STYLES } from "./AppShell.styles";
import { Navbar } from "./components/Navbar";

export default function AppShell() {
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <>
      <style>{STYLES}</style>

      <Navbar
        user={user}
        initials={initials}
        tenantName={user?.tenant?.name}
        dropOpen={dropOpen}
        onToggleDrop={() => setDropOpen((v) => !v)}
        onLogout={logout}
      />

      <div className="app-layout">
        <Outlet />
      </div>
    </>
  );
}