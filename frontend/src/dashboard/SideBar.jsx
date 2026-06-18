import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiOutlineCloudUpload,
  HiShoppingBag,
  HiUser,
} from "react-icons/hi";

const COLORS = {
  bg: "#0D1B2A",
  surface: "#1E2D3D",
  accent: "#F5A623",
  accentDim: "rgba(245,166,35,0.15)",
  text: "#F8F9FA",
  textMuted: "#8A9BB0",
  border: "rgba(255,255,255,0.07)",
  redDim: "rgba(192,57,43,0.15)",
};

const NAV_ITEMS = [
  { label: "Dashboard", icon: HiChartPie, href: "/admin/dashboard" },
  { label: "Add Product", icon: HiOutlineCloudUpload, href: "/admin/upload" },
  { label: "Manage Products", icon: HiInbox, href: "/admin/manage-products" },
  { label: "Orders", icon: HiShoppingBag, href: "/admin/orders" },
  { label: "Users", icon: HiUser, href: "/admin/users" },
];

const SideBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Profile */}
      <div
        style={{
          padding: "20px 16px",
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <img
          src={user?.photoURL || "/assets/salvator.jpg"}
          alt="Profile"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: `2px solid ${COLORS.accent}`,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              fontWeight: "700",
              fontSize: "13px",
              color: COLORS.text,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.displayName || "Admin"}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: COLORS.textMuted,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.email || "admin@gigo.com"}
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
        <div
          style={{
            fontSize: "10px",
            color: COLORS.textMuted,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "0 8px",
            marginBottom: "8px",
          }}
        >
          Main Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <div
              key={item.href}
              onClick={() => navigate(item.href)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                marginBottom: "2px",
                background: active ? COLORS.accentDim : "transparent",
                borderLeft: active
                  ? `3px solid ${COLORS.accent}`
                  : "3px solid transparent",
                color: active ? COLORS.accent : COLORS.textMuted,
                fontWeight: active ? "600" : "400",
                fontSize: "13.5px",
                transition: "all 0.15s",
                userSelect: "none",
              }}
            >
              <Icon style={{ fontSize: "17px", flexShrink: 0 }} />
              {item.label}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px", borderTop: `1px solid ${COLORS.border}` }}>
        <div
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            color: "#C0392B",
            background: "transparent",
            fontSize: "13.5px",
            fontWeight: "500",
            transition: "background 0.15s",
            borderLeft: "3px solid transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.redDim)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <HiArrowSmRight style={{ fontSize: "17px" }} />
          Logout
        </div>
      </div>
    </div>
  );
};

export default SideBar;
