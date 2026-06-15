import { useContext, useEffect, useState } from "react";
import { FaBarsStaggered, FaXmark, FaWineBottle } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { link: "Ahabanza", path: "/" },
    { link: "Ibinyobwa", path: "/shop" },
    { link: "Turi Bande", path: "/about" },
    { link: "Amakuru", path: "/blog" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50">
      <nav
        className={`py-4 lg:px-24 px-6 transition-all duration-300 ${
          isSticky ? "bg-blue-200 shadow-md" : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-blue-700"
          >
            <FaWineBottle />
            GIGO COMPANY
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {navItems.map(({ link, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="text-black font-medium hover:text-blue-700 transition"
                >
                  {link}
                </Link>
              </li>
            ))}
            <li>
              {user ? (
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Dashboard
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Injira
                </Link>
              )}
            </li>
          </ul>

          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isMenuOpen ? (
                <FaXmark className="w-6 h-6 text-black" />
              ) : (
                <FaBarsStaggered className="w-6 h-6 text-black" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md">
          <ul className="flex flex-col items-center gap-6 py-6">
            {navItems.map(({ link, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="text-black font-medium hover:text-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link}
                </Link>
              </li>
            ))}
            <li>
              {user ? (
                <button
                  onClick={() => {
                    navigate("/admin/dashboard");
                    setIsMenuOpen(false);
                  }}
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Dashboard
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Injira
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
