import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("AuthContext: Checking for existing token:", token ? "Found" : "Not found");
    
    if (token) {
      authService
        .getCurrentUser()
        .then(userData => {
          console.log("AuthContext: User data loaded:", userData);
          setUser(userData);
        })
        .catch((error) => {
          console.error("AuthContext: Failed to load user:", error);
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (creds) => {
    try {
      console.log("AuthContext: Logging in...");
      const { access_token } = await authService.login(creds);
      localStorage.setItem("token", access_token);
      
      const userData = await authService.getCurrentUser();
      console.log("AuthContext: User logged in:", userData);
      setUser(userData);
      
      return userData;
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
    console.log("AuthContext: Logging out...");
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