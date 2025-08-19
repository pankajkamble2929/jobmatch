// src/context/AuthProvider.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });

      const loggedInUser = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      };
      const token = res.data.token;

      // Save user and token in localStorage
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("authToken", token);

      // Set defaults
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(loggedInUser);
      setToken(token);

      return { success: true, user: loggedInUser };
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook
export function useAuth() {
  return useContext(AuthContext);
}
