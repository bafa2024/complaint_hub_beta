import apiClient from "./apiClient";

const authService = {
  signup: async ({ name, email, phone, password }) => {
    console.log("authService.signup sending:", { name, email, phone, password });
    
    const res = await apiClient.post("/auth/signup", { 
      name, 
      email, 
      phone, 
      password 
    });
    return res.data;
  },

  login: async ({ email, password }) => {
    // Create form data for OAuth2 format
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const res = await apiClient.post("/auth/login", formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/';
  },

  brandLogin: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const res = await apiClient.post("/auth/brand-login", formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  }
};

export default authService;