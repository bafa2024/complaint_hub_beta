import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authService
        .getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (creds) => {
    try {
      const { access_token } = await authService.login(creds);
      localStorage.setItem("token", access_token);
      const u = await authService.getCurrentUser();
      setUser(u);
      return u;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

 const signup = async (creds) => {
  try {
    console.log('AuthContext: Attempting signup with:', { ...creds, password: '***' });
    
    // Just try to create the user
    const response = await authService.signup(creds);
    console.log('AuthContext: Signup response:', response);
    
    // Don't auto-login for now, just return the response
    return response;
    
  } catch (error) {
    console.error('AuthContext: Signup error:', error);
    throw error;
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};