import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext
import { useNavigate, useLocation, Link } from "react-router-dom"; // Import useNavigate, useLocation, and Link
import googleLogo from "../assets/google-logo.svg";

const Login = () => {
  const { login, loginwithGoogle } = useContext(AuthContext); // Use signin for email login
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Get the location from the router
 

  // Get the redirect path, default to '/admin/dashboard' if not provided
  const from = location.state?.from || "/admin/dashboard";

  // Handle email/password login
  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await login(email, password); // Call signin instead of createUser
      alert("Logged in successfully!");
      navigate(from); // Redirect user to the saved location (either dashboard or default)
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await loginwithGoogle(); // Get Google login result
      const user = result.user;
      alert(`Logged in as ${user.email}`);
      console.log(user); // Log user info if needed
      navigate(from); // Redirect to the saved location after Google login
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        alert("Popup was closed before completing the login. Please try again.");
      } else {
        alert("An error occurred: " + error.message);
      }
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
              <input
                id="email"
                name="email"
                type="email"
                required
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                placeholder="Email address"
              />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                placeholder="Password"
              />
              
              <button type="submit" className="bg-blue-500 text-white rounded-md px-6 py-2 w-full">
                Log in
              </button>
            </form>
            <button onClick={handleGoogleLogin} className="flex items-center justify-center w-full py-2 bg-white border rounded-md shadow-sm">
              <img src={googleLogo} alt="Google" className="w-6 h-6 mr-2" /> Login with Google
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 mt-4">
              If you haven't an account, please{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                sign up here
              </Link>
              .
            </p>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
