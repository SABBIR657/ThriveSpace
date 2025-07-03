import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);

  // Fetch the logged-in user on initial load
  const fetchUser = async () => {
    try {
      const res = await axios.get("/users/me", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch {
      setUser(null);
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Manually login user and set in context
  const login = (userData) => {
    setUser(userData);
  };

  // Manually logout and clear context
  const logout = async () => {
    try {
      await axios.post("/users/logout", null, {
        withCredentials: true, // ✅ Clear cookie on server
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
