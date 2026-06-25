import { useState, useEffect, useCallback } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { LanguageContext } from "../contexts/LanguageContext";
import { translations } from "../contexts/translations";
import { useNavigate } from "react-router-dom";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const API = "https://gigo-backend-4iea.onrender.com";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg: "#0D1B2A", surface: "#1E2D3D", surfaceHover: "#243547",
  accent: "#F5A623", accentDim: "rgba(245,166,35,0.15)", accentGlow: "rgba(245,166,35,0.35)",
  green: "#4A9B7F", greenDim: "rgba(74,155,127,0.15)",
  red: "#C0392B", redDim: "rgba(192,57,43,0.15)",
  blue: "#2E86AB", blueDim: "rgba(46,134,171,0.15)",
  text: "#F8F9FA", textMuted: "#8A9BB0",
  border: "rgba(255,255,255,0.07)",
};

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const BRANCHES = ["Bujumbura HQ","Kenya","Uganda","DRC"];
const ROLES = ["owner","branch_manager","sales_manager","warehouse_manager","cashier","employee"];
const CATEGORIES = ["Alcoholic","Non-Alcoholic","Food","Other"];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("fr-RW").format(Math.round(n || 0));
const fmtM = (n) => {
  const num = Number(n);
  if (isNaN(num) || num === undefined || num === null) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return String(Math.round(num));
};
const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
const stockStatus = (p) => {
  if (!p.stock || p.stock === 0) return "Out of Stock";
  if (p.stock <= p.minStockLevel) return "Critical";
  if (p.stock <= p.minStockLevel * 2) return t("lowStockLabel") || t("lowStockLabel") || "Low Stock";
  return t("inStockLabel") || "In Stock";
};

// ── STYLES ────────────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: C.bg, minHeight: "100vh", display: "flex", color: C.text, fontSize: "14px" },
  sidebar: { width: "220px", flexShrink: 0, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 },
  logo: { padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}` },
  logoTop: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" },
  logoIcon: { width: "36px", height: "36px", background: C.accent, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: C.bg, fontWeight: "900", flexShrink: 0 },
  logoText: { fontSize: "15px", fontWeight: "800", color: C.text, lineHeight: 1.2, letterSpacing: "0.04em" },
  logoSub: { fontSize: "10px", color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: "46px" },
  nav: { flex: 1, padding: "16px 12px", overflowY: "auto" },
  navLabel: { fontSize: "10px", color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 8px", marginBottom: "8px" },
  navItem: (a) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", cursor: "pointer", marginBottom: "2px", background: a ? C.accentDim : "transparent", borderLeft: a ? `3px solid ${C.accent}` : "3px solid transparent", color: a ? C.accent : C.textMuted, fontWeight: a ? "600" : "400", fontSize: "13.5px", transition: "all 0.15s", userSelect: "none" }),
  navIcon: { fontSize: "16px", width: "18px", textAlign: "center", flexShrink: 0 },
  sidebarFooter: { padding: "16px 12px", borderTop: `1px solid ${C.border}` },
  userCard: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: C.accentDim, borderRadius: "10px", cursor: "pointer" },
  avatar: { width: "32px", height: "32px", borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "800", color: C.bg, flexShrink: 0 },
  main: { marginLeft: "220px", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" },
  topbar: { background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 28px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
  pageTitle: { fontSize: "17px", fontWeight: "700", color: C.text },
  topbarRight: { display: "flex", alignItems: "center", gap: "12px" },
  badge: { background: C.red, color: "#fff", fontSize: "10px", fontWeight: "700", padding: "2px 6px", borderRadius: "10px" },
  content: { padding: "24px 28px", flex: 1 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "20px" },
  card: { background: C.surface, borderRadius: "12px", border: `1px solid ${C.border}`, overflow: "hidden" },
  cardHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.border}` },
  cardTitle: { fontSize: "13px", fontWeight: "700", color: C.text, letterSpacing: "0.02em", textTransform: "uppercase" },
  kpiCard: { background: C.surface, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "20px", position: "relative", overflow: "hidden" },
  kpiBar: (col) => ({ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: col }),
  kpiIcon: (col) => ({ fontSize: "20px", color: col, marginBottom: "12px", display: "block" }),
  kpiVal: { fontSize: "26px", fontWeight: "800", color: C.text, lineHeight: 1, marginBottom: "6px", letterSpacing: "-0.02em" },
  kpiLabel: { fontSize: "11px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" },
  kpiDelta: (up) => ({ fontSize: "11px", fontWeight: "600", color: up ? C.green : C.red, display: "flex", alignItems: "center", gap: "4px" }),
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: "10px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 16px", textAlign: "left", fontWeight: "600", borderBottom: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)" },
  td: { padding: "12px 16px", fontSize: "13px", color: C.text, borderBottom: `1px solid ${C.border}`, verticalAlign: "middle" },
  badge2: (st) => {
    const m = {
      t("active") || t("statusActive") || "Active": { bg: C.greenDim, col: C.green }, "active": { bg: C.greenDim, col: C.green },
      "Completed": { bg: C.greenDim, col: C.green }, "delivered": { bg: C.greenDim, col: C.green },
      t("inStockLabel") || "In Stock": { bg: C.greenDim, col: C.green }, "paid": { bg: C.greenDim, col: C.green },
      t("ordersStatusProcessing") || "Processing": { bg: C.blueDim, col: C.blue }, "processing": { bg: C.blueDim, col: C.blue },
      "pending_approval": { bg: C.blueDim, col: C.blue },
      t("ordersStatusPending") || "Pending": { bg: "rgba(245,166,35,0.15)", col: C.accent }, "pending": { bg: "rgba(245,166,35,0.15)", col: C.accent },
      t("lowStockLabel") || t("lowStockLabel") || "Low Stock": { bg: "rgba(245,166,35,0.15)", col: C.accent },
      t("inactive") || t("statusInactive") || "Inactive": { bg: C.redDim, col: C.red }, "inactive": { bg: C.redDim, col: C.red },
      "Critical": { bg: C.redDim, col: C.red }, "Out of Stock": { bg: C.redDim, col: C.red },
      "cancelled": { bg: C.redDim, col: C.red }, "unpaid": { bg: C.redDim, col: C.red },
    };
    const s = m[st] || { bg: C.border, col: C.textMuted };
    return { display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.04em", background: s.bg, color: s.col };
  },
  btn: (v = "primary") => ({ padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.04em", cursor: "pointer", border: "none", outline: "none", background: v === "primary" ? C.accent : v === "danger" ? "transparent" : C.accentDim, color: v === "primary" ? C.bg : v === "danger" ? C.red : C.accent, transition: "opacity 0.15s" }),
  input: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "8px 14px", color: C.text, fontSize: "13px", outline: "none", width: "100%" },
  select: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "8px 14px", color: C.text, fontSize: "13px", outline: "none", width: "100%" },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" },
  sectionTitle: { fontSize: "16px", fontWeight: "700", color: C.text },
  pill: (l) => { const c = l === "Alcoholic" ? { bg: "rgba(192,57,43,0.15)", col: "#E74C3C" } : { bg: C.blueDim, col: C.blue }; return { display: "inline-block", padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "700", background: c.bg, color: c.col }; },
  chartBar: (pct, col) => ({ height: "8px", background: `linear-gradient(90deg,${col} ${pct}%,${C.border} ${pct}%)`, borderRadius: "4px", width: "100%" }),
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  modalBox: { background: C.surface, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "28px", width: "480px", maxWidth: "90vw", maxHeight: "85vh", overflowY: "auto" },
  modalTitle: { fontSize: "16px", fontWeight: "800", marginBottom: "20px", color: C.text },
  formRow: { marginBottom: "14px" },
  formLabel: { fontSize: "11px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px", display: "block" },
  spinner: { display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", color: C.textMuted, fontSize: "13px" },
  alert: (t) => ({ padding: "10px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", marginBottom: "14px", background: t === "error" ? C.redDim : C.greenDim, color: t === "error" ? C.red : C.green, border: `1px solid ${t === "error" ? C.red : C.green}` }),
};

// ── RESPONSIVE CSS (mobile sidebar + grid) ───────────────────────────────────
const RESPONSIVE_CSS = `
  .gigo-app { overflow-x: hidden; }
  .gigo-hamburger { display: none; }
  .gigo-backdrop { display: none; }
  @media (max-width: 880px) {
    .gigo-main {
      overflow-x: hidden;
    }
    .gigo-sidebar {
      transform: translateX(-100%);
      transition: transform 0.25s ease;
      box-shadow: 2px 0 24px rgba(0,0,0,0.4);
    }
    .gigo-sidebar.gigo-sidebar-open {
      transform: translateX(0);
    }
    .gigo-main {
      margin-left: 0 !important;
    }
    .gigo-hamburger {
      display: flex;
    }
    .gigo-backdrop.gigo-backdrop-open {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 90;
    }
    .gigo-kpi-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 10px !important;
    }
    .gigo-2col-grid {
      grid-template-columns: 1fr !important;
    }
    .gigo-content {
      padding: 14px 12px !important;
    }
    .gigo-kpi-card {
      padding: 12px !important;
    }
    .gigo-kpi-card .gigo-kpi-val {
      font-size: 19px !important;
    }
    .gigo-kpi-card .gigo-kpi-icon {
      font-size: 16px !important;
      margin-bottom: 6px !important;
    }
    .gigo-kpi-card .gigo-kpi-label {
      font-size: 9.5px !important;
    }
    .gigo-stat-card {
      padding: 12px 14px !important;
    }
    .gigo-stat-card .gigo-stat-val {
      font-size: 19px !important;
    }
    .gigo-stat-card .gigo-stat-label {
      font-size: 9.5px !important;
    }
    .gigo-section-header {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 10px !important;
    }
    .gigo-section-header > div:last-child {
      flex-direction: column !important;
      width: 100% !important;
    }
    .gigo-section-header input,
    .gigo-section-header select,
    .gigo-section-header button {
      width: 100% !important;
    }
    .gigo-table-scroll {
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
    }
    .gigo-table-scroll table {
      min-width: 640px !important;
    }
    table.gigo-table {
      display: block !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      white-space: nowrap !important;
      border-radius: inherit;
    }
    table.gigo-table thead,
    table.gigo-table tbody {
      display: table !important;
      width: 100% !important;
      min-width: 560px !important;
    }
    .gigo-tabs-scroll {
      flex-wrap: nowrap !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      padding-bottom: 2px;
    }
    .gigo-tabs-scroll button {
      flex-shrink: 0 !important;
    }
  }
`;

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function Spinner() { return <div style={S.spinner}>Loading...</div>; }

function SparkBar({ data }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data.map(d => d.value || d.total || 0));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "60px", padding: "0 4px" }}>
      {data.map((d, i) => {
        const val = d.value || d.total || 0;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "100%", height: `${max ? ((val / max) * 48) : 4}px`, background: i === data.length - 1 ? C.accent : "rgba(245,166,35,0.3)", borderRadius: "3px 3px 0 0" }} />
            <span style={{ fontSize: "9px", color: C.textMuted }}>{d.month || d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── DASHBOARD PAGE ────────────────────────────────────────────────────────────
function Dashboard({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Removed the stray fetch() call that was outside useEffect
  useEffect(() => {
    fetch(`${API}/stats/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <Spinner />;
  if (!stats) return <div style={S.alert("error")}>Failed to load dashboard data.</div>;

  const { kpis = {}, monthlyRevenue = [], bestSellers = [], recentOrders = [] } = stats;
  const now = new Date();

  const chartData = monthlyRevenue.map(m => ({
    month: MONTH_NAMES[(m._id.month || 1) - 1],
    value: Math.round(((m.total || 0) / 1_000_000) * 10) / 10,
    total: m.total || 0,
  }));

  const kpiCards = [
    { label: t("revenueThisMonth") || "Revenue This Month", value: `FRw ${fmtM(kpis.revenueThisMonth || 0)}`, delta: kpis.revenueDelta ? `${kpis.revenueDelta > 0 ? "+" : ""}${kpis.revenueDelta}% vs last month` : t("noPrevData") || "No prev data", up: (kpis.revenueDelta || 0) >= 0, icon: "◈", color: C.accent },
    { label: t("ordersThisMonth") || "Orders This Month", value: fmt(kpis.ordersThisMonth || 0), delta: kpis.ordersDelta ? `${kpis.ordersDelta > 0 ? "+" : ""}${kpis.ordersDelta}% vs last month` : t("noPrevData") || "No prev data", up: (kpis.ordersDelta || 0) >= 0, icon: "▦", color: C.green },
    { label: t("totalProducts") || t("totalProducts") || "Total Products", value: fmt(kpis.totalProducts || 0), delta: t("registered") || "Registered", up: true, icon: "◫", color: C.blue },
    { label: t("lowStockAlerts") || "Low Stock Alerts", value: fmt(kpis.lowStockAlerts || 0), delta: (kpis.lowStockAlerts || 0) > 0 ? t("needsAttention") || "Needs attention" : t("allGood") || "All good", up: (kpis.lowStockAlerts || 0) === 0, icon: "⚠", color: C.red },
  ];

  const maxSold = bestSellers[0]?.totalSold || 1;

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "22px", fontWeight: "800", color: C.text, marginBottom: "4px" }}>Good morning, Owner 👋</div>
        <div style={{ fontSize: "13px", color: C.textMuted }}>{t("dashboardSubtitle") || "Here's what's happening across your branches today —"} {now.toLocaleDateString("en-RW", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
      </div>

      <div className="gigo-kpi-grid" style={S.grid4}>
        {kpiCards.map((k, i) => (
          <div key={i} className="gigo-kpi-card" style={S.kpiCard}>
            <div style={S.kpiBar(k.color)} />
            <span className="gigo-kpi-icon" style={S.kpiIcon(k.color)}>{k.icon}</span>
            <div className="gigo-kpi-val" style={S.kpiVal}>{k.value}</div>
            <div className="gigo-kpi-label" style={S.kpiLabel}>{k.label}</div>
            <div style={S.kpiDelta(k.up)}><span>{k.up ? "▲" : "▼"}</span>{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="gigo-2col-grid" style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardHeader}><div style={S.cardTitle}>Recent Orders</div></div>
          <table className="gigo-table" style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Customer</th>
                <th style={S.th}>Branch</th>
                <th style={S.th}>Total</th>
                <th style={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 && (
                <tr><td colSpan={4} style={{ ...S.td, textAlign: "center", color: C.textMuted }}>No orders yet</td></tr>
              )}
              {recentOrders.map((o, i) => (
                <tr key={i}>
                  <td style={S.td}>
                    <div style={{ fontWeight: "600" }}>{o.customerName}</div>
                    <div style={{ fontSize: "11px", color: C.textMuted }}>{timeAgo(o.createdAt)}</div>
                  </td>
                  <td style={{ ...S.td, color: C.textMuted, fontSize: "12px" }}>{o.branch}</td>
                  <td style={{ ...S.td, fontWeight: "700", color: C.accent }}>FRw {fmt(o.totalAmount)}</td>
                  <td style={S.td}><span style={S.badge2(o.status)}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>Best Selling Products</div>
            <span style={{ fontSize: "11px", color: C.textMuted }}>This month</span>
          </div>
          <div style={{ padding: "8px 0" }}>
            {bestSellers.length === 0 && (
              <div style={{ padding: "20px", color: C.textMuted, fontSize: "13px", textAlign: "center" }}>No sales data yet</div>
            )}
            {bestSellers.map((p, i) => (
              <div key={i} style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontWeight: "600", fontSize: "13px" }}>{p._id}</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent }}>FRw {fmtM(p.totalRevenue)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={S.chartBar(Math.round((p.totalSold / maxSold) * 100), C.accent)} />
                  <span style={{ fontSize: "11px", color: C.textMuted, whiteSpace: "nowrap" }}>{p.totalSold} sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={S.cardTitle}>Monthly Revenue</div>
          <span style={{ fontSize: "11px", color: C.green, fontWeight: "700" }}>
            {kpis.revenueDelta && kpis.revenueDelta > 0 ? `▲ +${kpis.revenueDelta}% vs last month` : ""}
          </span>
        </div>
        <div style={{ padding: "16px 20px 8px" }}>
          {chartData.length > 0 ? (
            <>
              <SparkBar data={chartData} />
              <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
                {chartData.map((d, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontWeight: "700", fontSize: "12px", color: i === chartData.length - 1 ? C.accent : C.text }}>
                      FRw {fmtM(d.total)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color: C.textMuted, fontSize: "13px", padding: "16px 0" }}>No revenue data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── PRODUCTS PAGE ─────────────────────────────────────────────────────────────
function Products({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ productName: "", brandName: "", imageURL: "", category: "", description: "", price: "", branch: "", stock: "0", minStockLevel: "10" });

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API}/all-products?limit=100&search=${search}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm({ productName: "", brandName: "", imageURL: "", category: "", description: "", price: "", branch: "", stock: "0", minStockLevel: "10" });
    setShowModal(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ productName: p.productName, brandName: p.brandName, imageURL: p.imageURL, category: p.category, description: p.description, price: p.price, branch: p.branch, stock: p.stock || 0, minStockLevel: p.minStockLevel || 10 });
    setShowModal(true);
  };

  const save = async () => {
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `${API}/product/${editing._id}` : `${API}/upload-product`;
    const body = { ...form, price: Number(form.price), stock: Number(form.stock), minStockLevel: Number(form.minStockLevel) };
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
    const d = await r.json();
    if (d.success || d.product) { setMsg({ type: "success", text: editing ? t("productUpdated") || "Product updated!" : t("productAdded") || "Product added!" }); setShowModal(false); load(); }
    else setMsg({ type: "error", text: d.error || "Failed" });
  };

  const del = async (id) => {
    if (!window.confirm(t("confirmDeleteProduct") || "Delete this product?")) return;
    const r = await fetch(`${API}/product/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    if (d.success) { setMsg({ type: "success", text: t("deleted") || "Deleted!" }); load(); }
    else setMsg({ type: "error", text: d.error || "Failed" });
  };

  return (
    <div>
      <div className="gigo-section-header" style={S.sectionHeader}>
        <div>
          <div style={S.sectionTitle}>Product Management</div>
          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>{products.length} products</div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input style={{ ...S.input, width: "200px" }} placeholder=t("search") || "Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <button style={S.btn("primary")} onClick={openAdd}>+ Add Product</button>
        </div>
      </div>
      {msg && <div style={S.alert(msg.type)}>{msg.text}</div>}
      {loading ? <Spinner /> : (
        <div style={S.card}>
          <table className="gigo-table" style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Product</th>
                <th style={S.th}>Category</th>
                <th style={S.th}>Stock</th>
                <th style={S.th}>Price</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", color: C.textMuted }}>No products found</td></tr>
              )}
              {products.map((p, i) => {
                const st = stockStatus(p);
                return (
                  <tr key={i}>
                    <td style={S.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {p.imageURL && (
                          <img src={p.imageURL} alt="" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover", background: C.bg }} onError={e => e.target.style.display = "none"} />
                        )}
                        <div>
                          <div style={{ fontWeight: "600" }}>{p.productName}</div>
                          <div style={{ fontSize: "11px", color: C.textMuted }}>{p.brandName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={S.td}><span style={S.pill(p.category)}>{p.category}</span></td>
                    <td style={{ ...S.td, fontWeight: "700", color: p.stock <= (p.minStockLevel || 10) ? C.red : C.text }}>{fmt(p.stock)}</td>
                    <td style={{ ...S.td, color: C.accent, fontWeight: "600" }}>FRw {fmt(p.price)}</td>
                    <td style={S.td}><span style={S.badge2(st)}>{st}</span></td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button style={{ ...S.btn("ghost"), padding: "5px 10px", fontSize: "11px" }} onClick={() => openEdit(p)}>Edit</button>
                        <button style={{ ...S.btn("danger"), padding: "5px 10px", fontSize: "11px", background: C.redDim }} onClick={() => del(p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={S.modalBox}>
            <div style={S.modalTitle}>{editing ? t("editProduct") || "Edit Product" : t("addNewProduct") || "Add New Product"}</div>
            {[
              { label: t("productName") || "Product Name", key: "productName", type: "text" },
              { label: t("brandName") || "Brand Name", key: "brandName", type: "text" },
              { label: t("imageURL") || "Image URL", key: "imageURL", type: "text", placeholder: "https://..." },
              { label: t("description") || "Description", key: "description", type: "text" },
              { label: t("price") || t("priceLabel") || "Price", key: "price", type: "number" },
              { label: t("stockQuantity") || "Stock Quantity", key: "stock", type: "number" },
              { label: t("minStockLevel") || t("minStockLevel") || "Min Stock Level", key: "minStockLevel", type: "number" },
            ].map(f => (
              <div key={f.key} style={S.formRow}>
                <label style={S.formLabel}>{f.label}</label>
                <input style={S.input} type={f.type} placeholder={f.placeholder || ""} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
            <div style={S.formRow}>
              <label style={S.formLabel}>Category</label>
              <select style={S.select} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={S.formRow}>
              <label style={S.formLabel}>Branch</label>
              <select style={S.select} value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>
                <option value="">Select branch</option>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            {form.imageURL && (
              <img src={form.imageURL} alt="" style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", marginBottom: "14px", background: C.bg }} onError={e => e.target.style.display = "none"} />
            )}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button style={S.btn("ghost")} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={S.btn("primary")} onClick={save}>{editing ? t("saveChanges") || "Save Changes" : t("addProduct") || "Add Product"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── INVENTORY PAGE ────────────────────────────────────────────────────────────
function Inventory({ token }) {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("in");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState("1");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/all-products?limit=100`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/inventory/low-stock`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([p, ls]) => { setProducts(p.products || []); setLowStock(ls.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openModal = (type, product = null) => { setModalType(type); setSelectedProduct(product); setQty("1"); setReason(""); setShowModal(true); };

  const submit = async () => {
    if (!selectedProduct) return;
    const r = await fetch(`${API}/inventory/stock-${modalType}`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId: selectedProduct._id, quantity: Number(qty), reason }),
    });
    const d = await r.json();
    if (d.success) { setMsg({ type: "success", text: d.message }); setShowModal(false); load(); }
    else setMsg({ type: "error", text: d.error || "Failed" });
  };

  const inStock = products.filter(p => stockStatus(p) === t("inStockLabel") || "In Stock").length;
  const lowCount = products.filter(p => stockStatus(p) === t("lowStockLabel") || t("lowStockLabel") || "Low Stock").length;
  const critical = products.filter(p => ["Critical", "Out of Stock"].includes(stockStatus(p))).length;

  return (
    <div>
      <div className="gigo-section-header" style={S.sectionHeader}>
        <div>
          <div style={S.sectionTitle}>Inventory Management</div>
          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>Real-time stock tracking</div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={S.btn("ghost")} onClick={() => openModal("in")}>Stock In</button>
          <button style={S.btn("primary")} onClick={() => openModal("out")}>Stock Out</button>
        </div>
      </div>
      {msg && <div style={S.alert(msg.type)}>{msg.text}</div>}
      {lowStock.length > 0 && (
        <div style={{ background: C.redDim, border: `1px solid ${C.red}`, borderRadius: "10px", padding: "12px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>⚠</span>
          <div>
            <span style={{ fontWeight: "700", color: C.red }}>{lowStock.length} products need attention</span>
            <span style={{ color: C.textMuted, fontSize: "12px" }}> — Low stock or critical levels detected.</span>
          </div>
        </div>
      )}
      <div className="gigo-kpi-grid" style={{ ...S.grid4, marginBottom: "20px" }}>
        {[
          { label: t("totalProducts") || t("totalProducts") || "Total Products", value: products.length, color: C.blue },
          { label: t("inStockLabel") || "In Stock", value: inStock, color: C.green },
          { label: t("lowStockLabel") || t("lowStockLabel") || "Low Stock", value: lowCount, color: C.accent },
          { label: t("criticalOut") || "Critical / Out", value: critical, color: C.red },
        ].map((s, i) => (
          <div key={i} className="gigo-stat-card" style={{ ...S.card, padding: "16px 20px" }}>
            <div className="gigo-stat-val" style={{ fontSize: "24px", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div className="gigo-stat-label" style={{ fontSize: "11px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>
      {loading ? <Spinner /> : (
        <div style={S.card}>
          <div style={S.cardHeader}><div style={S.cardTitle}>Stock Levels</div></div>
          <table className="gigo-table" style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Product</th>
                <th style={S.th}>Branch</th>
                <th style={S.th}>Stock</th>
                <th style={S.th}>Min Level</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", color: C.textMuted }}>No products found</td></tr>
              )}
              {products.map((p, i) => {
                const st = stockStatus(p);
                const max = Math.max(p.stock || 0, (p.minStockLevel || 10) * 4, 1);
                return (
                  <tr key={i}>
                    <td style={{ ...S.td, fontWeight: "600" }}>{p.productName}</td>
                    <td style={{ ...S.td, color: C.textMuted, fontSize: "12px" }}>{p.branch}</td>
                    <td style={S.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "60px", height: "6px", borderRadius: "3px", background: C.border, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(((p.stock || 0) / max) * 100, 100)}%`, background: st === "Critical" || st === "Out of Stock" ? C.red : st === t("lowStockLabel") || t("lowStockLabel") || "Low Stock" ? C.accent : C.green, borderRadius: "3px" }} />
                        </div>
                        <span style={{ fontWeight: "700", color: st === "Critical" || st === "Out of Stock" ? C.red : st === t("lowStockLabel") || t("lowStockLabel") || "Low Stock" ? C.accent : C.text }}>{fmt(p.stock || 0)}</span>
                      </div>
                    </td>
                    <td style={{ ...S.td, color: C.textMuted }}>{p.minStockLevel || 10}</td>
                    <td style={S.td}><span style={S.badge2(st)}>{st}</span></td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button style={{ ...S.btn("primary"), padding: "5px 12px", fontSize: "11px" }} onClick={() => openModal("in", p)}>+ Stock In</button>
                        <button style={{ ...S.btn("ghost"), padding: "5px 12px", fontSize: "11px" }} onClick={() => openModal("out", p)}>- Stock Out</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={S.modalBox}>
            <div style={S.modalTitle}>{modalType === "in" ? t("stockInTitle") || "Stock In — Add Stock" : t("stockOutTitle") || "Stock Out — Remove Stock"}</div>
            <div style={S.formRow}>
              <label style={S.formLabel}>Product</label>
              <select style={S.select} value={selectedProduct?._id || ""} onChange={e => setSelectedProduct(products.find(p => p._id === e.target.value) || null)}>
                <option value="">Select product</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.productName} (stock: {p.stock || 0})</option>)}
              </select>
            </div>
            <div style={S.formRow}>
              <label style={S.formLabel}>Quantity</label>
              <input style={S.input} type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} />
            </div>
            <div style={S.formRow}>
              <label style={S.formLabel}>Reason</label>
              <input style={S.input} type="text" placeholder={modalType === "in" ? t("reasonRestockPlaceholder") || "e.g. Restock" : t("reasonSalePlaceholder") || "e.g. Sale, Damaged"} value={reason} onChange={e => setReason(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button style={S.btn("ghost")} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={S.btn("primary")} onClick={submit}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ORDERS PAGE ───────────────────────────────────────────────────────────────
function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [msg, setMsg] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const q = filter !== "all" ? `?status=${filter}` : "";
    fetch(`${API}/orders${q}&limit=100`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token, filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    const r = await fetch(`${API}/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
    const d = await r.json();
    if (d.success) { setMsg({ type: "success", text: t("statusUpdated") || "Status updated!" }); load(); }
    else setMsg({ type: "error", text: d.error || "Failed" });
  };

  const approvePayment = async (id) => {
    const r = await fetch(`${API}/orders/${id}/approve-payment`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    if (d.success) { setMsg({ type: "success", text: t("paymentApproved") || "Payment approved!" }); load(); }
    else setMsg({ type: "error", text: d.error || "Failed" });
  };

  const tabs = ["all", "pending", "processing", "delivered", "cancelled"];

  return (
    <div>
      <div className="gigo-section-header" style={S.sectionHeader}>
        <div>
          <div style={S.sectionTitle}>Orders</div>
          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>{orders.length} orders</div>
        </div>
      </div>
      {msg && <div style={S.alert(msg.type)}>{msg.text}</div>}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div className="gigo-tabs-scroll" style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer", background: filter === t ? C.accent : "transparent", color: filter === t ? C.bg : C.textMuted, border: `1px solid ${filter === t ? C.accent : C.border}` }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {loading ? <Spinner /> : (
          <table className="gigo-table" style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Customer</th>
                <th style={S.th}>Branch</th>
                <th style={S.th}>Total</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Payment</th>
                <th style={S.th}>Date</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", color: C.textMuted }}>No orders found</td></tr>
              )}
              {orders.map((o, i) => (
                <tr key={i}>
                  <td style={S.td}>
                    <div style={{ fontWeight: "600" }}>{o.customerName}</div>
                    <div style={{ fontSize: "11px", color: C.textMuted }}>{o.customerEmail}</div>
                  </td>
                  <td style={{ ...S.td, color: C.textMuted, fontSize: "12px" }}>{o.branch}</td>
                  <td style={{ ...S.td, fontWeight: "700", color: C.accent }}>FRw {fmt(o.totalAmount)}</td>
                  <td style={S.td}><span style={S.badge2(o.status)}>{o.status}</span></td>
                  <td style={S.td}><span style={S.badge2(o.paymentStatus)}>{o.paymentStatus}</span></td>
                  <td style={{ ...S.td, fontSize: "11px", color: C.textMuted }}>{timeAgo(o.createdAt)}</td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {o.status === "pending" && <button style={{ ...S.btn("ghost"), padding: "4px 8px", fontSize: "10px" }} onClick={() => updateStatus(o._id, "processing")}>Process</button>}
                      {o.status === "processing" && <button style={{ ...S.btn("primary"), padding: "4px 8px", fontSize: "10px" }} onClick={() => updateStatus(o._id, "delivered")}>Deliver</button>}
                      {o.paymentStatus === "pending_approval" && <button style={{ ...S.btn("primary"), padding: "4px 8px", fontSize: "10px" }} onClick={() => approvePayment(o._id)}>✓ Pay</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── BRANCHES PAGE ─────────────────────────────────────────────────────────────
function Branches({ token }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ name: "", managerName: "", managerEmail: "", location: "", phone: "" });

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API}/branches`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setBranches(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ name: "", managerName: "", managerEmail: "", location: "", phone: "" }); setShowModal(true); };
  const openEdit = (b) => { setEditing(b); setForm({ name: b.name, managerName: b.managerName || "", managerEmail: b.managerEmail || "", location: b.location || "", phone: b.phone || "" }); setShowModal(true); };

  const save = async () => {
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `${API}/branches/${editing._id}` : `${API}/branches`;
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    const d = await r.json();
    if (d.success || d.branch) { setMsg({ type: "success", text: editing ? t("branchUpdated") || "Branch updated!" : t("branchAdded") || "Branch added!" }); setShowModal(false); load(); }
    else setMsg({ type: "error", text: d.error || "Failed" });
  };

  return (
    <div>
      <div className="gigo-section-header" style={S.sectionHeader}>
        <div>
          <div style={S.sectionTitle}>Branch Management</div>
          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>{branches.length} branches</div>
        </div>
        <button style={S.btn("primary")} onClick={openAdd}>+ Add Branch</button>
      </div>
      {msg && <div style={S.alert(msg.type)}>{msg.text}</div>}
      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {branches.length === 0 && (
            <div style={{ ...S.card, padding: "20px", color: C.textMuted, gridColumn: "1/-1", textAlign: "center" }}>No branches yet. Add your first branch.</div>
          )}
          {branches.map((b, i) => (
            <div key={i} style={{ ...S.card, padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                <div>
                  <div style={{ fontWeight: "800", fontSize: "15px", marginBottom: "3px" }}>{b.name}</div>
                  <div style={{ fontSize: "12px", color: C.textMuted }}>Manager: {b.managerName || "—"}</div>
                </div>
                <span style={S.badge2(b.status || "active")}>{b.status || "active"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                {[
                  { label: t("staff") || t("staff") || "Staff", value: b.stats?.staffCount ?? 0 },
                  { label: t("ordersLabel") || "Orders", value: fmt(b.stats?.orderCount ?? 0) },
                  { label: t("revenue") || t("revenue") || "Revenue", value: `FRw ${fmtM(b.stats?.totalRevenue ?? 0)}` },
                ].map((s, j) => (
                  <div key={j} style={{ textAlign: "center", background: C.bg, borderRadius: "8px", padding: "10px 6px" }}>
                    <div style={{ fontWeight: "800", fontSize: "15px", color: j === 2 ? C.green : C.text }}>{s.value}</div>
                    <div style={{ fontSize: "10px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {b.location && <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "12px" }}>📍 {b.location}</div>}
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ ...S.btn("ghost"), flex: 1 }} onClick={() => openEdit(b)}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={S.modalBox}>
            <div style={S.modalTitle}>{editing ? t("editBranch") || "Edit Branch" : t("addBranch") || "Add Branch"}</div>
            <div style={S.formRow}>
              <label style={S.formLabel}>Branch Name</label>
              {editing ? (
                <input style={S.input} value={form.name} disabled />
              ) : (
                <select style={S.select} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}>
                  <option value="">Select branch</option>
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              )}
            </div>
            {[
              { label: t("managerName") || "Manager Name", key: "managerName" },
              { label: t("managerEmail") || "Manager Email", key: "managerEmail" },
              { label: t("location") || "Location", key: "location" },
              { label: t("phone") || "Phone", key: "phone" },
            ].map(f => (
              <div key={f.key} style={S.formRow}>
                <label style={S.formLabel}>{f.label}</label>
                <input style={S.input} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button style={S.btn("ghost")} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={S.btn("primary")} onClick={save}>{editing ? t("saveChanges") || "Save Changes" : t("addBranch") || "Add Branch"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── USERS PAGE ────────────────────────────────────────────────────────────────
function Users({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ role: "employee", branch: "all", status: "active" });

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API}/users?limit=100`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openEdit = (u) => { setEditing(u); setForm({ role: u.role, branch: u.branch, status: u.status || "active" }); setShowModal(true); };

  const save = async () => {
    const r = await fetch(`${API}/users/${editing._id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    const d = await r.json();
    if (d.success) { setMsg({ type: "success", text: t("userUpdated") || "User updated!" }); setShowModal(false); load(); }
    else setMsg({ type: "error", text: d.error || "Failed" });
  };

  const del = async (id) => {
    if (!window.confirm(t("confirmDeleteUser") || "Delete this user?")) return;
    const r = await fetch(`${API}/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    if (d.success) { setMsg({ type: "success", text: t("userDeleted") || "User deleted!" }); load(); }
    else setMsg({ type: "error", text: d.error || "Failed" });
  };

  const roleDesc = {
    owner: t("roleOwnerDesc") || "Full system access",
    branch_manager: t("roleBranchDesc") || "Branch-level access",
    sales_manager: t("roleSalesDesc") || "Sales & orders",
    warehouse_manager: t("roleWarehouseDesc") || "Inventory access",
    cashier: t("roleCashierDesc") || "Sales & orders only",
    employee: t("roleEmployeeDesc") || "Limited access",
    customer: t("roleCustomerDesc") || "Customer access",
  };

  return (
    <div>
      <div className="gigo-section-header" style={S.sectionHeader}>
        <div>
          <div style={S.sectionTitle}>Users & Roles</div>
          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>{users.length} team members</div>
        </div>
      </div>
      {msg && <div style={S.alert(msg.type)}>{msg.text}</div>}
      <div className="gigo-2col-grid" style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardHeader}><div style={S.cardTitle}>Team Members</div></div>
          {loading ? <Spinner /> : (
            <table className="gigo-table" style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Name</th>
                  <th style={S.th}>Role</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr><td colSpan={4} style={{ ...S.td, textAlign: "center", color: C.textMuted }}>No users found</td></tr>
                )}
                {users.map((u, i) => (
                  <tr key={i}>
                    <td style={S.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ ...S.avatar, width: "28px", height: "28px", fontSize: "11px", flexShrink: 0 }}>
                          {u.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "13px" }}>{u.name}</div>
                          <div style={{ fontSize: "11px", color: C.textMuted }}>{u.branch}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...S.td, color: C.textMuted, fontSize: "12px" }}>{u.role}</td>
                    <td style={S.td}><span style={S.badge2(u.status || "active")}>{u.status || "active"}</span></td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button style={{ ...S.btn("ghost"), padding: "4px 8px", fontSize: "11px" }} onClick={() => openEdit(u)}>Edit</button>
                        <button style={{ ...S.btn("danger"), padding: "4px 8px", fontSize: "11px", background: C.redDim, color: C.red, border: "none", borderRadius: "6px", cursor: "pointer" }} onClick={() => del(u._id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div style={S.card}>
          <div style={S.cardHeader}><div style={S.cardTitle}>System Roles</div></div>
          <div style={{ padding: "8px 0" }}>
            {ROLES.map((r, i) => (
              <div key={i} style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "600", textTransform: "capitalize" }}>{r.replace("_", " ")}</div>
                  <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>{roleDesc[r]}</div>
                </div>
                <span style={{ fontSize: "11px", color: C.textMuted }}>{users.filter(u => u.role === r).length} users</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && editing && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={S.modalBox}>
            <div style={S.modalTitle}>Edit User — {editing.name}</div>
            <div style={S.formRow}>
              <label style={S.formLabel}>Role</label>
              <select style={S.select} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                {ROLES.map(r => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
              </select>
            </div>
            <div style={S.formRow}>
              <label style={S.formLabel}>Branch</label>
              <select style={S.select} value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>
                <option value="all">All Branches</option>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div style={S.formRow}>
              <label style={S.formLabel}>Status</label>
              <select style={S.select} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button style={S.btn("ghost")} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={S.btn("primary")} onClick={save}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── REPORTS PAGE ──────────────────────────────────────────────────────────────
function Reports({ token }) {
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [branchPerf, setBranchPerf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(null);

  const generate = async (type) => {
    setLoading(true); setActive(type);
    try {
      if (type === "daily") {
        const r = await fetch(`${API}/report/daily`, { headers: { Authorization: `Bearer ${token}` } });
        setDaily(await r.json());
      } else if (type === "monthly") {
        const now = new Date();
        const r = await fetch(`${API}/report/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`, { headers: { Authorization: `Bearer ${token}` } });
        setMonthly(await r.json());
      } else if (type === "branch") {
        const r = await fetch(`${API}/report/branch-performance`, { headers: { Authorization: `Bearer ${token}` } });
        setBranchPerf(await r.json());
      }
    } catch (e) {
      console.error("Report generation error:", e);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="gigo-section-header" style={S.sectionHeader}>
        <div><div style={S.sectionTitle}>Reports & Analytics</div></div>
      </div>
      <div className="gigo-kpi-grid" style={{ ...S.grid2, marginBottom: "16px" }}>
        {[
          { type: "daily", title: t("dailySalesReport") || "Daily Sales Report", icon: "◈", desc: "Today's sales summary across all branches", color: C.green },
          { type: "monthly", title: t("monthlyFinancialReport") || "Monthly Financial Report", icon: "◧", desc: `Report for ${MONTH_NAMES[new Date().getMonth()]} ${new Date().getFullYear()}`, color: C.accent },
          { type: "branch", title: t("branchPerformance") || "Branch Performance", icon: "◉", desc: "Compare revenue and orders by branch", color: C.blue },
          { type: "weekly", title: t("weeklyReport") || "Weekly Report", icon: "◫", desc: t("weeklyReportDesc") || "Last 7 days summary", color: C.red },
        ].map((r, i) => (
          <div key={i} style={{ ...S.card, padding: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ fontSize: "28px", color: r.color, marginTop: "2px" }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700", marginBottom: "4px" }}>{r.title}</div>
              <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "14px" }}>{r.desc}</div>
              <button style={S.btn("primary")} onClick={() => generate(r.type)} disabled={loading && active === r.type}>
                {loading && active === r.type ? t("generating") || "Generating..." : t("generate") || "Generate"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {daily && active === "daily" && (
        <div style={{ ...S.card, marginBottom: "16px" }}>
          <div style={S.cardHeader}><div style={S.cardTitle}>Daily Report — Today</div></div>
          <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: "24px", fontWeight: "800", color: C.accent }}>FRw {fmtM(daily.summary?.totalRevenue || 0)}</div><div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px", textTransform: "uppercase" }}>Total Revenue</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: "24px", fontWeight: "800", color: C.green }}>{daily.summary?.totalOrders || 0}</div><div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px", textTransform: "uppercase" }}>Total Orders</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: "24px", fontWeight: "800", color: C.blue }}>{Object.keys(daily.summary?.byBranch || {}).length}</div><div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px", textTransform: "uppercase" }}>Active Branches</div></div>
          </div>
          {daily.summary?.byBranch && (
            <table className="gigo-table" style={S.table}>
              <thead><tr><th style={S.th}>Branch</th><th style={S.th}>Orders</th><th style={S.th}>Revenue</th></tr></thead>
              <tbody>
                {Object.entries(daily.summary.byBranch).map(([branch, d], i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, fontWeight: "600" }}>{branch}</td>
                    <td style={S.td}>{d.orderCount}</td>
                    <td style={{ ...S.td, color: C.accent, fontWeight: "700" }}>FRw {fmt(d.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {monthly && active === "monthly" && (
        <div style={{ ...S.card, marginBottom: "16px" }}>
          <div style={S.cardHeader}><div style={S.cardTitle}>Monthly Report — {MONTH_NAMES[(monthly.period?.month || 1) - 1]} {monthly.period?.year}</div></div>
          <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "16px" }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: "24px", fontWeight: "800", color: C.accent }}>FRw {fmtM(monthly.summary?.totalRevenue || 0)}</div><div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px", textTransform: "uppercase" }}>Total Revenue</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: "24px", fontWeight: "800", color: C.green }}>{monthly.summary?.totalOrders || 0}</div><div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px", textTransform: "uppercase" }}>Total Orders</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: "24px", fontWeight: "800", color: C.blue }}>{monthly.summary?.paidOrders || 0}</div><div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px", textTransform: "uppercase" }}>Paid Orders</div></div>
          </div>
          {monthly.topProducts?.length > 0 && (
            <>
              <div style={{ ...S.cardHeader, borderTop: `1px solid ${C.border}` }}><div style={S.cardTitle}>Top Products</div></div>
              <table className="gigo-table" style={S.table}>
                <thead><tr><th style={S.th}>Product</th><th style={S.th}>Units Sold</th><th style={S.th}>Revenue</th></tr></thead>
                <tbody>
                  {monthly.topProducts.map((p, i) => (
                    <tr key={i}>
                      <td style={{ ...S.td, fontWeight: "600" }}>{p.name}</td>
                      <td style={S.td}>{p.sold}</td>
                      <td style={{ ...S.td, color: C.accent, fontWeight: "700" }}>FRw {fmt(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {branchPerf && active === "branch" && (
        <div style={S.card}>
          <div style={S.cardHeader}><div style={S.cardTitle}>Branch Performance — This Month</div></div>
          <table className="gigo-table" style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Branch</th>
                <th style={S.th}>Orders</th>
                <th style={S.th}>Revenue</th>
                <th style={S.th}>Staff</th>
                <th style={S.th}>Low Stock</th>
              </tr>
            </thead>
            <tbody>
              {(branchPerf.performance || []).map((b, i) => (
                <tr key={i}>
                  <td style={{ ...S.td, fontWeight: "600" }}>{b.branch}</td>
                  <td style={S.td}>{b.ordersThisMonth}</td>
                  <td style={{ ...S.td, color: C.accent, fontWeight: "700" }}>FRw {fmt(b.revenueThisMonth)}</td>
                  <td style={S.td}>{b.activeStaff}</td>
                  <td style={S.td}>
                    {b.lowStockAlerts > 0
                      ? <span style={S.badge2("Critical")}>{b.lowStockAlerts} alerts</span>
                      : <span style={S.badge2("active")}>OK</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── NAV CONFIG ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: t("productsCount") || "products", icon: "▦", label: "Products" },
  { id: "inventory", icon: "◫", label: "Inventory" },
  { id: t("ordersCount") || "orders", icon: "◈", label: t("ordersLabel") || "Orders" },
  { id: t("branchesCount") || "branches", icon: "◉", label: t("branchesLabel") || "Branches" },
  { id: "users", icon: "◎", label: "Users & Roles" },
  { id: "reports", icon: "◧", label: "Reports" },
];

const PAGE_LABELS = {
  dashboard: "Dashboard Overview",
  products: "Products",
  inventory: "Inventory",
  orders: t("ordersLabel") || "Orders",
  branches: t("branchesLabel") || "Branches",
  users: "Users & Roles",
  reports: t("reportsAnalytics") || "Reports & Analytics",
};

// ── APP SHELL ─────────────────────────────────────────────────────────────────
// ── APP SHELL ─────────────────────────────────────────────────────────────────
export default function GigoManagement() {
  const { user, token } = useContext(AuthContext);
  const { language, setLanguage, translations } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [lowStockCount, setLowStockCount] = useState(0);

  // Dashboard only supports EN/FR — Kirundi maps to French
  const dashLang = language === "rn" ? "fr" : language;
  const t = useCallback(
    (key) => translations[dashLang]?.[key] ?? translations["en"]?.[key] ?? key,
    [dashLang, translations]
  );

  useEffect(() => {
    if (!user && !token) navigate("/login", { replace: true });
  }, [user, token]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/inventory/low-stock`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setLowStockCount(d.count || 0))
      .catch(() => {});
  }, [token, active]);

  const logout = () => { navigate("/login", { replace: true }); };

  if (!token) {
    return (
      <div style={{ ...S.app, alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: C.textMuted, fontSize: "14px" }}>Loading...</div>
      </div>
    );
  }

  const pageProps = { token, t };
  const PAGE_MAP = {
    dashboard: <Dashboard {...pageProps} />,
    products:  <Products {...pageProps} />,
    inventory: <Inventory {...pageProps} />,
    orders:    <Orders {...pageProps} />,
    branches:  <Branches {...pageProps} />,
    users:     <Users {...pageProps} />,
    reports:   <Reports {...pageProps} />,
  };

  const NAV_ITEMS = [
    { id: "dashboard", icon: "⬡", label: t("dashboard") || "Dashboard" },
    { id: t("productsCount") || "products",  icon: "▦", label: t(t("productsCount") || "products") },
    { id: "inventory", icon: "◫", label: t("inventory") || "Inventory" },
    { id: t("ordersCount") || "orders",    icon: "◈", label: t(t("ordersCount") || "orders") },
    { id: t("branchesCount") || "branches",  icon: "◉", label: t(t("branchesCount") || "branches") || t("branchesLabel") || "Branches" },
    { id: "users",     icon: "◎", label: t("users") || "Users & Roles" },
    { id: "reports",   icon: "◧", label: t("reports") || "Reports" },
  ];

  const PAGE_LABELS = {
    dashboard: t("dashboard") || "Dashboard Overview",
    products:  t(t("productsCount") || "products"),
    inventory: t("inventory") || "Inventory",
    orders:    t(t("ordersCount") || "orders"),
    branches:  t(t("branchesCount") || "branches") || t("branchesLabel") || "Branches",
    users:     t("users") || "Users & Roles",
    reports:   t("reports") || t("reportsAnalytics") || "Reports & Analytics",
  };

  return (
    <div style={S.app}>
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoTop}>
            <div style={S.logoIcon}>G</div>
            <div style={S.logoText}>GIGO CO.</div>
          </div>
          <div style={S.logoSub}>Management System</div>
        </div>
        <nav style={S.nav}>
          <div style={S.navLabel}>Menu</div>
          {NAV_ITEMS.map(item => (
            <div key={item.id} style={S.navItem(active === item.id)} onClick={() => setActive(item.id)}>
              <span style={S.navIcon}>{item.icon}</span>
              {item.label}
              {item.id === "inventory" && lowStockCount > 0 && (
                <span style={{ ...S.badge, marginLeft: "auto" }}>{lowStockCount}</span>
              )}
            </div>
          ))}
        </nav>
        <div style={S.sidebarFooter}>
          <div style={S.userCard} onClick={logout} title={t("logout")}>
            <div style={S.avatar}>{user?.email?.slice(0, 2).toUpperCase() || "OW"}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email || "Owner"}
              </div>
              <div style={{ fontSize: "10px", color: C.textMuted }}>{t("logout")}</div>
            </div>
            <span style={{ color: C.textMuted, fontSize: "12px" }}>⏻</span>
          </div>
        </div>
      </aside>

      <main style={S.main}>
        <div style={S.topbar}>
          <div style={S.pageTitle}>{PAGE_LABELS[active]}</div>
          <div style={S.topbarRight}>
            {lowStockCount > 0 && (
              <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setActive("inventory")}>
                <span style={{ fontSize: "18px", color: C.textMuted }}>🔔</span>
                <span style={{ ...S.badge, position: "absolute", top: "-4px", right: "-6px" }}>{lowStockCount}</span>
              </div>
            )}
            {/* Language switcher — EN / FR only (rn maps to fr) */}
            <div style={{ display: "flex", gap: "4px" }}>
              {["en", "fr"].map(lang => {
                const isActive = language === lang || (language === "rn" && lang === "fr");
                return (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    style={{
                      padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700",
                      cursor: "pointer", border: `1px solid ${isActive ? C.accent : C.border}`,
                      background: isActive ? C.accent : "transparent",
                      color: isActive ? C.bg : C.textMuted,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
            <div style={{ width: "1px", height: "20px", background: C.border }} />
            <span style={{ fontSize: "12px", color: C.textMuted }}>
              {new Date().toLocaleDateString(dashLang === "fr" ? "fr-RW" : "en-RW", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
        <div style={S.content}>{PAGE_MAP[active]}</div>
      </main>
    </div>
  );
}
