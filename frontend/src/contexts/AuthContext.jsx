// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tok = localStorage.getItem("token");
    if (tok) {
      authService
        .getCurrentUser(tok)
        .then(setUser)
        .catch(() => localStorage.clear())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (creds) => {
    const { access_token } = await authService.login(creds);
    localStorage.setItem("token", access_token);
    const u = await authService.getCurrentUser(access_token);
    setUser(u);
    return u;
  };

  const signup = async (creds) => {
    await authService.signup(creds);
    // auto-login after signup:
    return login(creds);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
