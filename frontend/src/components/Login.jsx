import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import googleLogo from "/assets/google-logo.svg";

const Login = () => {
  const { login, loginwithGoogle } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin/dashboard";

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true); // Set loading to true
    try {
      await login(email, password);
      alert("Logged in successfully!");
      navigate(from);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleGoogleLogin = async () => {
    try {
        const result = await loginwithGoogle();
        const user = result.user;
        alert(`Logged in as ${user.email}`);
        console.log(user);
        navigate(from);
    } catch (error) {
        let errorMessage = "An error occurred: " + error.message;
        if (error.code === "auth/popup-closed-by-user") {
            errorMessage = "Popup was closed before completing the login. Please try again.";
        } else if (error.code === "auth/cancelled-popup-request") {
          errorMessage = "Another popup is already open.  Please close other popups and try again.";
        }
         else if (error.code === "auth/auth-domain-mismatch") {
            errorMessage = "Auth domain mismatch.  Check your Firebase config and authorized domains.";
        }
         else if (error.code === "auth/network-request-failed") {
            errorMessage = "Network error.  Please check your internet connection.";
        }
        else {
            errorMessage = "An unexpected error occurred: " + error.message;
        }
        setError(errorMessage);
    }
};


  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl" />
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold">Login Form</h1>
            <form onSubmit={handleLogin} className="py-8 space-y-4">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                placeholder="Email address"
              />

              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md px-6 py-2 w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <button onClick={handleGoogleLogin} className="flex items-center justify-center w-full py-2 bg-white border rounded-md shadow-sm">
              <img src={googleLogo} alt="Google" className="w-6 h-6 mr-2" /> Login with Google
            </button>

            <p className="text-center text-gray-600 mt-4">
              If you haven't an account, please{" "}
              <Link to="/sign-up" className="text-blue-500 hover:underline">sign up here</Link>.
            </p>

            {error && <p className="text-red-500 text-center mt-2 error-message">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
