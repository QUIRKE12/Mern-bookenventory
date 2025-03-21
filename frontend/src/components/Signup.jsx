import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Correct path
import googleLogo from "../assets/google-logo.svg";

const Signup = () => {
  const { createUser, loginwithGoogle } = useContext(AuthContext); // Correctly accessing context
  const [error, setError] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await createUser(email, password); // Call createUser
      alert("Sign up successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const result = await loginwithGoogle(); // Get the result of Google login
      const user = result.user; // Access the authenticated user information
      alert("Signed up successfully with Google!");
      console.log(user); // Log the user data or use it further
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
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
        />
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Sign up Form</h1>
            </div>
            <form onSubmit={handleSignUp} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <input
                id="email"
                name="email"
                type="text"
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                placeholder="Email address"
              />
              <input
                id="password"
                name="password"
                type="password"
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                placeholder="Password"
              />
              <button className="bg-blue-500 text-white rounded-md px-6 py-2">Sign up</button>
            </form>
            <button onClick={handleRegister} className="block">
              <img src={googleLogo} alt="" className="w-12 h-12 inline-block" /> Login with Google
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
