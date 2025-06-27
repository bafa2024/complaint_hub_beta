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

  // Brand-specific methods
  brandSignup: async (brandData) => {
    console.log("authService.brandSignup sending:", { ...brandData, password: '***' });
    
    // Map frontend field names to backend expected names
    const payload = {
      brand_name: brandData.brandName,
      email: brandData.email,
      support_email: brandData.supportEmail,
      phone: brandData.phone,
      contact_person: brandData.contactPerson,
      password: brandData.password
    };
    
    const res = await apiClient.post("/brands/signup", payload);
    return res.data;
  },

  brandLogin: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const res = await apiClient.post("/brands/login", formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  },

  getCurrentBrand: async () => {
    const res = await apiClient.get("/brands/profile");
    return res.data;
  }
};

export default authService;