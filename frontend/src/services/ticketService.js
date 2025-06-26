// src/services/ticketService.js
import apiClient from './apiClient';

const ticketService = {
  // Create a new ticket/complaint
  createTicket: async (ticketData) => {
    const response = await apiClient.post('/tickets/', ticketData);
    return response.data;
  },

  // Get single ticket
  getTicket: async (ticketId) => {
    const response = await apiClient.get(`/tickets/${ticketId}`);
    return response.data;
  },

  // List tickets with pagination
  listTickets: async (skip = 0, limit = 20, filters = {}) => {
    const params = new URLSearchParams({
      skip,
      limit,
      ...filters
    });
    const response = await apiClient.get(`/tickets/?${params}`);
    return response.data;
  },

  // Update ticket status (to be implemented in backend)
  updateTicketStatus: async (ticketId, status) => {
    const response = await apiClient.patch(`/tickets/${ticketId}/status`, { status });
    return response.data;
  },

  // Add response to ticket (to be implemented in backend)
  addTicketResponse: async (ticketId, message) => {
    const response = await apiClient.post(`/tickets/${ticketId}/responses`, { message });
    return response.data;
  },

  // Rate ticket resolution (to be implemented in backend)
  rateTicket: async (ticketId, rating, comment) => {
    const response = await apiClient.post(`/tickets/${ticketId}/rate`, { rating, comment });
    return response.data;
  },

  // Upload voice complaint (to be implemented in backend)
  uploadVoiceComplaint: async (audioBlob, metadata) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'complaint.webm');
    formData.append('metadata', JSON.stringify(metadata));
    
    const response = await apiClient.post('/tickets/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get public unresolved complaints
  getPublicComplaints: async (skip = 0, limit = 20) => {
    const response = await apiClient.get(`/tickets/public?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get ticket analytics (for brands)
  getTicketAnalytics: async (brandId, dateRange) => {
    const params = new URLSearchParams(dateRange);
    const response = await apiClient.get(`/analytics/tickets/${brandId}?${params}`);
    return response.data;
  },
};

export default ticketService;