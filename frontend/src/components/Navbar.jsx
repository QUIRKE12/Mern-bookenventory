import { useContext, useState, useEffect } from "react";
import { FaBarsStaggered, FaBlog, FaXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user } = useContext(AuthContext); // Get user from context
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Define nav items without conditional rendering
  const navItems = [
    { link: "Home", path: "/" },
    { link: "Shop", path: "/shop" },
  ];

  return (
    <header
      className="w-full bg-transparent fixed top-0 left-0 right-0 transition-all ease-in duration-300 z-10"
    >
      <nav className={`py-4 lg:px-24 px-24 ${isSticky ? "sticky top-0 left-0 right-0 bg-blue-300" : ""}`}>
        {/* Logo */}
        <div className="flex justify-between items-center text-base gap-8">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-700">
            <FaBlog className="inline-block" /> Books
          </Link>

          {/* Navigation Links for Large Devices */}
          <ul className="md:flex space-x-12 hidden">
            {navItems.map(({ link, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="block text-base text-black uppercase cursor-pointer hover:text-blue-700"
                >
                  {link}
                </Link>
              </li>
            ))}

            {/* Conditionally render "Sell Your Book" button based on login status */}
            {user ? (
              <li>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="block text-base text-black uppercase cursor-pointer hover:text-blue-700"
                >
                  Sell Your Book
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="block text-base text-black uppercase cursor-pointer hover:text-blue-700"
                >
                  Sell Your Book
                </Link>
              </li>
            )}
          </ul>

          {/* Menu Button for Mobile Devices */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-black focus:outline-none">
              {isMenuOpen ? (
                <FaXmark className="h-5 w-5 text-black" />
              ) : (
                <FaBarsStaggered className="h-5 w-5 text-black" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md">
          <ul className="flex flex-col items-center space-y-4 py-4">
            {navItems.map(({ link, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="block text-base text-black uppercase cursor-pointer hover:text-blue-700"
                  onClick={() => setIsMenuOpen(false)} // Close menu on click
                >
                  {link}
                </Link>
              </li>
            ))}

            {/* Conditionally render "Sell Your Book" button in mobile menu */}
            {user ? (
              <li>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="block text-base text-black uppercase cursor-pointer hover:text-blue-700"
                >
                  Sell Your Book
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="block text-base text-black uppercase cursor-pointer hover:text-blue-700"
                  onClick={() => setIsMenuOpen(false)} // Close menu on click
                >
                  Sell Your Book
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
