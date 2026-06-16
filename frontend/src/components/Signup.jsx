import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Signup = () => {
  const { createUser, loginwithGoogle } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSignUp = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    setError("");
    setLoading(true);
    try {
      const result = await createUser(email, password);
      const user = result.user;

      // Save user to MongoDB
      await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName || email.split("@")[0],
          email: user.email,
          photoURL: user.photoURL || "",
        }),
      });

      alert("Konti yawe yaremwe neza!");
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await loginwithGoogle();
      const user = result.user;

      // Save user to MongoDB
      await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName || "",
          email: user.email,
          photoURL: user.photoURL || "",
        }),
      });

      alert(`Murakaza neza ${user.displayName || user.email}`);
      navigate(from, { replace: true });
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        setError("Mwarafunze idirisha rya Google mutararangiza kwiyandikisha.");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-700">
              GIGO COMPANY LIMITED
            </h1>
            <p className="text-gray-600 mt-2">
              Iyandikishe kugira ukoreshe sisiteme yacu
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <input
              type="email"
              name="email"
              required
              placeholder="Shiramwo Email Yawe"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              required
              placeholder="Shiramwo Ijambo Banga"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
            >
              {loading ? "Turiko Twiyandikisha..." : "Iyandikishe"}
            </button>
          </form>

          <div className="my-5 flex items-center">
            <div className="flex-grow border-t"></div>
            <span className="px-3 text-gray-500">canke</span>
            <div className="flex-grow border-t"></div>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center w-full border rounded-lg py-3 hover:bg-gray-50"
          >
            <img
              src="/assets/google-logo.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Iyandikishe ukoresheje Google
          </button>

          <p className="text-center text-gray-600 mt-6">
            Urasanzwe ufise konti?{" "}
            <Link
              to="/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Injira hano
            </Link>
          </p>

          {error && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
