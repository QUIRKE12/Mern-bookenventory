import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./Navbar.css";

const navLinks = [
  { to: "/",       label: "Ahabanza" },
  { to: "/shop",   label: "Ibicuruzwa" },
  { to: "/about",  label: "Ibitwerekeye" },
  { to: "/blog",   label: "Amakuru" },
];

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <>
      <nav className={`gigo-navbar ${scrolled ? "scrolled" : ""}`}>
        {/* Logo */}
        <Link to="/" className="gigo-logo">
          <div className="gigo-logo-icon">⚡</div>
          <span className="gigo-logo-text">GIGO COMPANY</span>
        </Link>

        {/* Desktop nav links */}
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

        {/* Desktop auth */}
        <div className="gigo-nav-actions">
          {user ? (
            <>
              <Link to="/orders" className="gigo-btn-outline">Commande</Link>
              <Link to="/profile" className="gigo-avatar" title={user.displayName || user.email}>
                {user.photoURL
                  ? <img src={user.photoURL} alt="avatar" />
                  : initials}
              </Link>
              <button onClick={handleLogout} className="gigo-btn-solid">Sohoka</button>
            </>
          ) : (
            <>
              <Link to="/login"  className="gigo-btn-outline">Injira</Link>
              <Link to="/signup" className="gigo-btn-solid">Iyandikishe</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
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
                {link.label}
              </Link>
            </li>
          ))}
          {user ? (
            <>
              <li><Link to="/orders"  className="gigo-mobile-link">📋 commande Zanje</Link></li>
              <li><Link to="/profile" className="gigo-mobile-link">👤 Konti Yanje</Link></li>
            </>
          ) : null}
        </ul>

        <div className="gigo-mobile-auth">
          {user ? (
            <>
              <div className="gigo-mobile-user">
                <div className="gigo-avatar-sm">
                  {user.photoURL
                    ? <img src={user.photoURL} alt="avatar" />
                    : initials}
                </div>
                <div>
                  <div className="gigo-mobile-name">{user.displayName || "Umukoresha"}</div>
                  <div className="gigo-mobile-email">{user.email}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="gigo-btn-solid full">Sohoka</button>
            </>
          ) : (
            <>
              <Link to="/login"  className="gigo-btn-outline full">Injira</Link>
              <Link to="/signup" className="gigo-btn-solid full">Iyandikishe</Link>
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className="gigo-backdrop" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
