import { useState } from "react";
import { Link } from "react-router-dom";
import BarnnerCard from "./BarnnerCard";

const Banner = () => {
  const [search, setSearch] = useState("");

  return (
    <div style={{
      background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
      minHeight: "85vh",
      display: "flex",
      alignItems: "center",
      padding: "0 5%",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute", top: "-50px", right: "-50px",
        width: "400px", height: "400px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "50%",
      }} />
      <div style={{
        position: "absolute", bottom: "-80px", left: "30%",
        width: "300px", height: "300px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "50%",
      }} />

      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        gap: "40px",
        flexWrap: "wrap",
      }}>
        {/* Left content */}
        <div style={{ flex: 1, minWidth: "300px", zIndex: 1 }}>
          <div style={{
            background: "rgba(255,255,255,0.2)",
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: "20px",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "20px",
            backdropFilter: "blur(10px)",
          }}>
            🍾 Ibinyobwa Vyiza Mu Burundi
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 58px)",
            fontWeight: "900",
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: "20px",
            fontFamily: "'Inter', sans-serif",
          }}>
            Ibinyobwa Vyiza<br />
            <span style={{ color: "#FFF3E0" }}>Kaze Muri</span><br />
            GIGO COMPANY
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "16px",
            lineHeight: 1.6,
            marginBottom: "32px",
            maxWidth: "480px",
          }}>
            Turabashikiriza ibinyobwa vyiza kandi vyizewe ku giciro kibereye bose. 
            Turafise ibinyobwa vyambiye n'ibitambiye vy'ubwoko butandukanye.
          </p>

          {/* Search bar */}
          <div style={{
            display: "flex",
            maxWidth: "480px",
            background: "#fff",
            borderRadius: "50px",
            padding: "6px 6px 6px 20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            marginBottom: "32px",
          }}>
            <input
              type="text"
              placeholder="Rondera ikinyobwa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "14px",
                color: "#333",
                background: "transparent",
              }}
            />
            <Link
              to={`/shop?search=${search}`}
              style={{
                background: "linear-gradient(135deg, #FF6B35, #F7931E)",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "50px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              Rondera
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {[
              { num: "4+", label: "Amashami" },
              { num: "100+", label: "Ibinyobwa" },
              { num: "1000+", label: "Abakiriya" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: "900", color: "#fff" }}>{s.num}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Slider */}
        <div style={{ flex: 1, minWidth: "300px", maxWidth: "500px", zIndex: 1 }}>
          <BarnnerCard />
        </div>
      </div>
    </div>
  );
};

export default Banner;
