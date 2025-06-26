// src/services/brandService.js
import apiClient from './apiClient';

const brandService = {
  // Get brand dashboard data
  getDashboardData: async (brandId) => {
    const response = await apiClient.get(`/brands/${brandId}/dashboard`);
    return response.data;
  },

  // Get brand profile
  getBrandProfile: async (brandId) => {
    const response = await apiClient.get(`/brands/${brandId}`);
    return response.data;
  },

  // Update brand profile
  updateBrandProfile: async (brandId, data) => {
    const response = await apiClient.put(`/brands/${brandId}`, data);
    return response.data;
  },

  // Get brand tickets
  getBrandTickets: async (brandId, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/brands/${brandId}/tickets?${params}`);
    return response.data;
  },

  // Get brand credits
  getBrandCredits: async (brandId) => {
    const response = await apiClient.get(`/brands/${brandId}/credits`);
    return response.data;
  },

  // Add credits
  addCredits: async (brandId, amount) => {
    const response = await apiClient.post(`/brands/${brandId}/credits`, { amount });
    return response.data;
  },

  // Get credit transactions
  getCreditTransactions: async (brandId, skip = 0, limit = 20) => {
    const response = await apiClient.get(
      `/brands/${brandId}/transactions?skip=${skip}&limit=${limit}`
    );
    return response.data;
  },

  // Generate toll-free number
  generateTollFreeNumber: async (brandId, provider = 'twilio') => {
    const response = await apiClient.post(`/brands/${brandId}/phone-number`, { provider });
    return response.data;
  },

  // Get brand analytics
  getBrandAnalytics: async (brandId, dateRange = {}) => {
    const params = new URLSearchParams(dateRange);
    const response = await apiClient.get(`/brands/${brandId}/analytics?${params}`);
    return response.data;
  },

  // Update ticket assignment
  assignTicket: async (ticketId, userId) => {
    const response = await apiClient.put(`/tickets/${ticketId}/assign`, { 
      assigned_to: userId 
    });
    return response.data;
  },

  // Update auto-routing rules
  updateAutoRoutingRules: async (brandId, rules) => {
    const response = await apiClient.put(`/brands/${brandId}/routing-rules`, rules);
    return response.data;
  },

  // Get CRM integrations
  getCRMIntegrations: async (brandId) => {
    const response = await apiClient.get(`/brands/${brandId}/integrations`);
    return response.data;
  },

  // Configure CRM integration
  configureCRMIntegration: async (brandId, integrationData) => {
    const response = await apiClient.post(
      `/brands/${brandId}/integrations`, 
      integrationData
    );
    return response.data;
  },

  // Get billing settings
  getBillingSettings: async (brandId) => {
    const response = await apiClient.get(`/brands/${brandId}/billing-settings`);
    return response.data;
  },

  // Update billing settings
  updateBillingSettings: async (brandId, settings) => {
    const response = await apiClient.put(`/brands/${brandId}/billing-settings`, settings);
    return response.data;
  },
};

export default brandService;