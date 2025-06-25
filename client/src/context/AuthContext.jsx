import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch the logged-in user on initial load
  const fetchUser = async () => {
    try {
      const res = await axios.get('/users/me');
      setUser(res.data);
    } catch {
      setUser(null);
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
      await axios.post('/users/logout'); // optional, if you have logout route
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
