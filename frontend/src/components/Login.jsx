import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Login = () => {
  const { login, loginwithGoogle } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    setError("");
    if (!validateEmail(email)) {
      setError("Shiramwo Email ibereye.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      alert("Winjiye neza muri sisiteme!");
      navigate(from);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginwithGoogle();
      const user = result.user;
      alert(`Murakaza neza ${user.email}`);
      navigate(from);
    } catch (error) {
      let errorMessage = "Habaye ikibazo. Gerageza kandi.";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Mwarafunze idirisha rya Google mutararangiza kwinjira.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Hari irindi dirisha rya Google rifunguye. Ribanze murifunge.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Internet ntiyabonetse neza. Suzuma internet yawe.";
      }
      setError(errorMessage);
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
            <p className="text-gray-600 mt-2">Injira muri konti yawe</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              name="email"
              required
              placeholder="Shiramwo Email Yawe"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Shiramwo Ijambo Banga"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-gray-500"
              >
                {showPassword ? "Hisha" : "Raba"}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
            >
              {loading ? "Turiko Twinjira..." : "Injira"}
            </button>
          </form>

          <div className="my-5 flex items-center">
            <div className="flex-grow border-t"></div>
            <span className="px-3 text-gray-500">canke</span>
            <div className="flex-grow border-t"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full border rounded-lg py-3 hover:bg-gray-50"
          >
            <img
              src="/assets/google-logo.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Injira ukoresheje Google
          </button>

          <p className="text-center text-gray-600 mt-6">
            Ntufise konti?{" "}
            <Link to="/sign-up" className="text-blue-700 font-semibold hover:underline">
              Iyandikishe hano
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

export default Login;
