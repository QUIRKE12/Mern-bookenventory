import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { BsBoxArrowRight } from "react-icons/bs"; // Import logout icon

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      alert("User logged out successfully");

      // Redirect to home after logout
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center mt-5">
      <BsBoxArrowRight 
        onClick={handleLogout} 
        className="text-red-600 text-2xl cursor-pointer hover:text-red-800 transition duration-300"
      />
    </div>
  );
};

export default Logout;
