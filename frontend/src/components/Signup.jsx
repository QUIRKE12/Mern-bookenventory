import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom"; // Import navigation hooks
import googleLogo from "/assets/google-logo.svg";

const Signup = () => {
  const { createUser, loginwithGoogle } = useContext(AuthContext);
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); // Initialize navigation
  const location = useLocation(); // Get the current location
  const from = location.state?.from?.pathname || "/"; // Redirect back to original page or home

  // ✅ Handle Email/Password Signup
  const handleSignUp = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await createUser(email, password); // Call createUser function from AuthContext
      alert("Sign up successful!");
      navigate(from, { replace: true }); // Redirect user after signup
    } catch (error) {
      setError(error.message);
    }
  };

  // ✅ Handle Google Signup
  const handleRegister = async () => {
    try {
      const result = await loginwithGoogle();
      const user = result.user;
      alert(`Welcome, ${user.displayName}! Signed up successfully with Google.`);
      navigate(from, { replace: true }); // Redirect user after Google login
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        alert("Popup was closed before completing the login. Please try again.");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl" />
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold">Sign Up Form</h1>
            <form onSubmit={handleSignUp} className="py-8 space-y-4">
              <input
                name="email"
                type="email"
                required
                className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                placeholder="Email address"
              />
              <input
                name="password"
                type="password"
                required
                className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                placeholder="Password"
              />
              <button type="submit" className="w-full bg-blue-500 text-white rounded-md px-6 py-2 hover:bg-blue-600">
                Sign Up
              </button>
            </form>
            
            {/* Google Login Button */}
            <button onClick={handleRegister} className="w-full flex items-center justify-center gap-2 border px-4 py-2 rounded-md hover:bg-gray-100">
              <img src={googleLogo} alt="Google" className="w-6 h-6" />
              Sign up with Google
            </button>

            {/* Error Message */}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
