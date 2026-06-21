import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BestSellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/all-products`)
      .then(res => res.json())
      .then(data => { setProducts((data.products || []).slice(0, 8)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "60px 5%", background: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ display: "inline-block", background: "#FFF3E0", color: "#FF6B35", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>
          🏆 Ibikunzwe Cyane
        </div>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "900", color: "#1a1a2e", marginBottom: "12px" }}>
          Best Seller Products
        </h2>
        <p style={{ color: "#666", fontSize: "15px", maxWidth: "500px", margin: "0 auto" }}>
          Ibinyobwa bikunzwe n'abakiriya bacu bose
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>Loading...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>Nta binyobwa bibonetse</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
          {products.map((product, i) => (
            <Link key={i} to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: hovered === i ? "0 20px 60px rgba(255,107,53,0.25)" : "0 4px 20px rgba(0,0,0,0.08)",
                  transform: hovered === i ? "translateY(-8px)" : "translateY(0)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                  <img
                    src={product.imageURL}
                    alt={product.productName}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered === i ? "scale(1.08)" : "scale(1)", transition: "transform 0.4s ease" }}
                    onError={e => e.target.src = "https://via.placeholder.com/300x200?text=No+Image"}
                  />
                  <div style={{ position: "absolute", top: "12px", left: "12px", background: "linear-gradient(135deg, #FF6B35, #F7931E)", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>
                    {product.category}
                  </div>
                  {hovered === i && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(255,107,53,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ background: "#FF6B35", color: "#fff", padding: "12px 28px", borderRadius: "50px", fontWeight: "700", fontSize: "14px" }}>
                        🛒 Gura Nonaha
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ padding: "18px" }}>
                  <h3 style={{ fontWeight: "800", fontSize: "15px", color: "#1a1a2e", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {product.productName}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#999", marginBottom: "14px" }}>{product.brandName}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "900", fontSize: "18px", color: "#FF6B35" }}>
                      FRw {product.price?.toLocaleString()}
                    </span>
                    <span style={{ background: hovered === i ? "linear-gradient(135deg, #FF6B35, #F7931E)" : "#FFF3E0", color: hovered === i ? "#fff" : "#FF6B35", padding: "8px 16px", borderRadius: "50px", fontSize: "12px", fontWeight: "700", transition: "all 0.3s" }}>
                      Gura →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <Link to="/shop" style={{ display: "inline-block", background: "linear-gradient(135deg, #FF6B35, #F7931E)", color: "#fff", padding: "14px 40px", borderRadius: "50px", textDecoration: "none", fontWeight: "700", fontSize: "15px", boxShadow: "0 8px 24px rgba(255,107,53,0.3)" }}>
          Reba Ibinyobwa Byose →
        </Link>
      </div>
    </div>
  );
};

export default BestSellerProducts;
