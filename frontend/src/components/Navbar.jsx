import { useContext, useEffect, useState } from "react";
import { FaBarsStaggered, FaXmark, FaWineBottle, FaCartShopping } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { link: "Ahabanza", path: "/" },
    { link: "Ibinyobwa", path: "/shop" },
    { link: "Turi Bande", path: "/about" },
  ];

  return (
    <header style={{ width: "100%", position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <nav style={{
        padding: "14px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: isSticky ? "#fff" : "transparent",
        boxShadow: isSticky ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.3s ease",
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: "flex", alignItems: "center", gap: "8px",
          textDecoration: "none", fontSize: "20px", fontWeight: "900",
          color: isSticky ? "#FF6B35" : "#fff",
          fontFamily: "'Inter', sans-serif", transition: "color 0.3s",
        }}>
          <FaWineBottle />
          GIGO COMPANY
        </Link>

        {/* Desktop nav */}
        <ul style={{
          display: "flex", alignItems: "center", gap: "32px",
          listStyle: "none", margin: 0, padding: 0,
        }} className="hidden-mobile">
          {navItems.map(({ link, path }) => (
            <li key={path}>
              <Link to={path} style={{
                textDecoration: "none",
                color: isSticky ? "#333" : "#fff",
                fontWeight: "600", fontSize: "15px", transition: "color 0.3s",
              }}
                onMouseEnter={e => e.target.style.color = "#FF6B35"}
                onMouseLeave={e => e.target.style.color = isSticky ? "#333" : "#fff"}
              >
                {link}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <Link to="/orders" style={{
                color: isSticky ? "#333" : "#fff",
                textDecoration: "none", fontSize: "20px", transition: "color 0.3s",
              }}>
                <FaCartShopping />
              </Link>
            </li>
          )}
          <li>
            {user ? (
              <button onClick={() => navigate("/admin/management")} style={{
                background: "linear-gradient(135deg, #FF6B35, #F7931E)",
                color: "#fff", border: "none", padding: "10px 24px",
                borderRadius: "50px", fontWeight: "700", fontSize: "14px",
                cursor: "pointer", boxShadow: "0 4px 15px rgba(255,107,53,0.3)",
              }}>
                Dashboard
              </button>
            ) : (
              <Link to="/login" style={{
                background: isSticky ? "linear-gradient(135deg, #FF6B35, #F7931E)" : "#fff",
                color: isSticky ? "#fff" : "#FF6B35",
                padding: "10px 24px", borderRadius: "50px",
                fontWeight: "700", fontSize: "14px", textDecoration: "none",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}>
                Injira
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          style={{
            background: isSticky ? "#FFF3E0" : "rgba(255,255,255,0.2)",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: isSticky ? "#FF6B35" : "#fff",
            display: "none",
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s",
          }}
          className="show-mobile"
        >
          {isMenuOpen ? <FaXmark /> : <FaBarsStaggered />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div style={{
          background: "#fff",
          padding: "20px 5%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          {navItems.map(({ link, path }) => (
            <Link key={path} to={path} onClick={() => setIsMenuOpen(false)} style={{
              textDecoration: "none", color: "#333", fontWeight: "600",
              fontSize: "16px", padding: "12px 0",
              borderBottom: "1px solid #f5f5f5",
            }}>
              {link}
            </Link>
          ))}
          {user && (
            <Link to="/orders" onClick={() => setIsMenuOpen(false)} style={{
              textDecoration: "none", color: "#333", fontWeight: "600",
              fontSize: "16px", padding: "12px 0",
              borderBottom: "1px solid #f5f5f5",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <FaCartShopping /> Amakomande
            </Link>
          )}
          <div style={{ marginTop: "8px" }}>
            {user ? (
              <button onClick={() => { navigate("/admin/management"); setIsMenuOpen(false); }} style={{
                background: "linear-gradient(135deg, #FF6B35, #F7931E)",
                color: "#fff", border: "none", padding: "13px 24px",
                borderRadius: "50px", fontWeight: "700", fontSize: "15px",
                cursor: "pointer", width: "100%",
              }}>
                Dashboard
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{
                background: "linear-gradient(135deg, #FF6B35, #F7931E)",
                color: "#fff", padding: "13px 24px", borderRadius: "50px",
                fontWeight: "700", fontSize: "15px", textDecoration: "none",
                textAlign: "center", display: "block",
              }}>
                Injira
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
