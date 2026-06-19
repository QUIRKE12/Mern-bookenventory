import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const API = import.meta.env.VITE_API_URL || "https://gigo-backend-4iea.onrender.com";

const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session from localStorage on page refresh ──────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem("gigo_token");
    const savedUser  = localStorage.getItem("gigo_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ── Login with email + password ────────────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Backend should return { token, user: { _id, name, email, role, branch } }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("gigo_token", data.token);
      localStorage.setItem("gigo_user", JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("gigo_token");
    localStorage.removeItem("gigo_user");
  };

  // ── Create user (register) ─────────────────────────────────────────────────
  const createUser = async (email, password, name = "", role = "employee", branch = "all") => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role, branch }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      return data;
    } finally {
      setLoading(false);
    }
  };

  const authInfo = {
    user,
    token,
    loading,
    login,
    logout,
    createUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
