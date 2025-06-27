import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    console.log("AuthContext: Checking for existing token:", token ? "Found" : "Not found");
    console.log("AuthContext: User role:", userRole);
    
    if (token) {
      // If it's a brand user, get brand profile instead
      if (userRole === 'brand') {
        authService
          .getCurrentBrand()
          .then(brandData => {
            console.log("AuthContext: Brand data loaded:", brandData);
            setUser({ ...brandData, is_brand: true });
          })
          .catch((error) => {
            console.error("AuthContext: Failed to load brand:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
          })
          .finally(() => setLoading(false));
      } else {
        authService
          .getCurrentUser()
          .then(userData => {
            console.log("AuthContext: User data loaded:", userData);
            setUser(userData);
          })
          .catch((error) => {
            console.error("AuthContext: Failed to load user:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
          })
          .finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (creds) => {
    try {
      console.log("AuthContext: Logging in...");
      const { access_token } = await authService.login(creds);
      localStorage.setItem("token", access_token);
      localStorage.setItem("userRole", "user");
      
      const userData = await authService.getCurrentUser();
      console.log("AuthContext: User logged in:", userData);
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const brandLogin = async (email, password) => {
    try {
      console.log("AuthContext: Brand logging in...");
      const { access_token } = await authService.brandLogin(email, password);
      localStorage.setItem("token", access_token);
      localStorage.setItem("userRole", "brand");
      
      const brandData = await authService.getCurrentBrand();
      console.log("AuthContext: Brand logged in:", brandData);
      setUser({ ...brandData, is_brand: true });
      
      return brandData;
    } catch (error) {
      console.error("Brand login error:", error);
      throw error;
    }
  };

  const signup = async (creds) => {
    try {
      console.log('AuthContext: Attempting signup with:', { ...creds, password: '***' });
      
      const response = await authService.signup(creds);
      console.log('AuthContext: Signup response:', response);
      
      return response;
      
    } catch (error) {
      console.error('AuthContext: Signup error:', error);
      throw error;
    }
  };

  const brandSignup = async (brandData) => {
    try {
      console.log('AuthContext: Attempting brand signup with:', { ...brandData, password: '***' });
      
      const response = await authService.brandSignup(brandData);
      console.log('AuthContext: Brand signup response:', response);
      
      return response;
      
    } catch (error) {
      console.error('AuthContext: Brand signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log("AuthContext: Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout,
      brandLogin,
      brandSignup 
    }}>
      {children}
    </AuthContext.Provider>
  );
};