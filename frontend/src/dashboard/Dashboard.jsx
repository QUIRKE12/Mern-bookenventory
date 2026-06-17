import React from "react";
import {
  HiUsers,
  HiShoppingBag,
  HiCash,
  HiPlusCircle,
  HiCube,
} from "react-icons/hi";
import { Link } from "react-router-dom";

const COLORS = {
  bg: "#0D1B2A",
  surface: "#1E2D3D",
  surfaceHover: "#243547",
  accent: "#F5A623",
  green: "#4A9B7F",
  red: "#C0392B",
  blue: "#2E86AB",
  text: "#F8F9FA",
  textMuted: "#8A9BB0",
  border: "rgba(255,255,255,0.07)",
};

const KPICard = ({ icon, label, value, iconColor, glowColor }) => (
  <div
    style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      boxShadow: `0 0 18px ${glowColor}`,
      transition: "box-shadow 0.2s",
    }}
  >
    <div
      style={{
        fontSize: "2rem",
        color: iconColor,
        background: `${glowColor}`,
        borderRadius: "10px",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
    <div>
      <p style={{ color: COLORS.textMuted, fontSize: "12px", marginBottom: "4px" }}>{label}</p>
      <p style={{ color: COLORS.text, fontSize: "20px", fontWeight: "700" }}>{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        padding: "28px",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        color: COLORS.text,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "800",
            color: COLORS.text,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "6px",
          }}
        >
          <span style={{ color: COLORS.accent }}>📊</span> GIGO COMPANY Dashboard
        </h1>
        <p style={{ color: COLORS.textMuted, fontSize: "13px" }}>
          Gucunga ibinyobwa, abakiriya, n'ibikorwa vy'ubudandaji.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <KPICard
          icon={<HiUsers />}
          label="Abakiriya"
          value="1,245"
          iconColor={COLORS.blue}
          glowColor="rgba(46,134,171,0.15)"
        />
        <KPICard
          icon={<HiCube />}
          label="Ibinyobwa"
          value="320"
          iconColor={COLORS.green}
          glowColor="rgba(74,155,127,0.15)"
        />
        <KPICard
          icon={<HiShoppingBag />}
          label="Amakomande"
          value="812"
          iconColor={COLORS.accent}
          glowColor="rgba(245,166,35,0.15)"
        />
        <KPICard
          icon={<HiCash />}
          label="Amahera Yinjiye"
          value="24,560,000 BIF"
          iconColor={COLORS.red}
          glowColor="rgba(192,57,43,0.15)"
        />
      </div>

      {/* Bottom Panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Recent Activity */}
        <div
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: COLORS.text,
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: COLORS.accent }}>📢</span> Ibikorwa Biheruka
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { icon: "🍾", text: "Ikinyobwa gishasha congewe muri sisiteme" },
              { icon: "👤", text: "Umukiriya mushasha yiyandikishije" },
              { icon: "🛒", text: "Komande nshasha yakiriwe" },
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  color: COLORS.textMuted,
                  fontSize: "13px",
                  padding: "9px 0",
                  borderBottom: i < 2 ? `1px solid ${COLORS.border}` : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>{item.icon}</span> {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: COLORS.text,
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: COLORS.accent }}>⚡</span> Ibikorwa Vyihuta
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link
              to="/admin/upload"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: COLORS.blue,
                color: COLORS.text,
                padding: "11px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "13px",
                transition: "opacity 0.15s",
              }}
            >
              <HiPlusCircle style={{ fontSize: "18px" }} />
              Ongeraho Ikinyobwa Gishasha
            </Link>
            <Link
              to="/admin/manage-products"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: COLORS.green,
                color: COLORS.text,
                padding: "11px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "13px",
                transition: "opacity 0.15s",
              }}
            >
              <HiCube style={{ fontSize: "18px" }} />
              Gucunga Ibinyobwa
            </Link>
            <Link
              to="/admin/orders"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: COLORS.accent,
                color: COLORS.bg,
                padding: "11px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "13px",
                transition: "opacity 0.15s",
              }}
            >
              <HiShoppingBag style={{ fontSize: "18px" }} />
              Reba Amakomande
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
