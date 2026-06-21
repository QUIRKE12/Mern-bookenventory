import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const navLinks = [
  { to: "/", label: "Ahabanza", icon: "🏠" },
  { to: "/shop", label: "Ibicuruzwa", icon: "🛍️" },
  { to: "/orders", label: "Amabwiriza", icon: "📋" },
  { to: "/profile", label: "Konti yanje", icon: "👤" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className={`gigo-navbar ${scrolled ? "scrolled" : ""}`}>
        {/* Logo */}
        <Link to="/" className="gigo-logo">
          <div className="gigo-logo-icon">⚡</div>
          <span className="gigo-logo-text">GIGO BUSINESS COMPANY</span>
        </Link>

        {/* Desktop links */}
        <ul className="gigo-nav-links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`gigo-nav-link ${location.pathname === link.to ? "active" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth buttons (desktop) */}
        <div className="gigo-nav-actions">
          <Link to="/login" className="gigo-btn-outline">Injira</Link>
          <Link to="/signup" className="gigo-btn-solid">Iyandikishe</Link>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="gigo-hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Funga menu" : "Fungura menu"}
          aria-expanded={menuOpen}
        >
          <span className={`gigo-bar ${menuOpen ? "open" : ""}`} />
          <span className={`gigo-bar ${menuOpen ? "open" : ""}`} />
          <span className={`gigo-bar ${menuOpen ? "open" : ""}`} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div className={`gigo-mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`gigo-mobile-link ${location.pathname === link.to ? "active" : ""}`}
              >
                <span className="gigo-mobile-icon">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="gigo-mobile-auth">
          <Link to="/login" className="gigo-btn-outline full">Injira</Link>
          <Link to="/signup" className="gigo-btn-solid full">Iyandikishe</Link>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className="gigo-backdrop" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
