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
    try {
      const params = new URLSearchParams({
        skip,
        limit,
        ...filters
      });
      const response = await apiClient.get(`/tickets/?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Return empty array as fallback
      return [];
    }
  },

  // Update ticket status (to be implemented in backend)
  updateTicketStatus: async (ticketId, status) => {
    try {
      const response = await apiClient.patch(`/tickets/${ticketId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }
  },

  // Add response to ticket (to be implemented in backend)
  addTicketResponse: async (ticketId, message) => {
    try {
      const response = await apiClient.post(`/tickets/${ticketId}/responses`, { message });
      return response.data;
    } catch (error) {
      console.error('Error adding ticket response:', error);
      throw error;
    }
  },

  // Rate ticket resolution (to be implemented in backend)
  rateTicket: async (ticketId, rating, comment) => {
    try {
      const response = await apiClient.post(`/tickets/${ticketId}/rate`, { rating, comment });
      return response.data;
    } catch (error) {
      console.error('Error rating ticket:', error);
      throw error;
    }
  },

  // Upload voice complaint (to be implemented in backend)
  uploadVoiceComplaint: async (audioBlob, metadata) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'complaint.webm');
      formData.append('metadata', JSON.stringify(metadata));
      
      const response = await apiClient.post('/tickets/voice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading voice complaint:', error);
      throw error;
    }
  },

  // Get public unresolved complaints
  getPublicComplaints: async (skip = 0, limit = 20) => {
    try {
      const response = await apiClient.get(`/tickets/public?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public complaints:', error);
      return [];
    }
  },

  // Get ticket analytics (for brands)
  getTicketAnalytics: async (brandId, dateRange) => {
    try {
      const params = new URLSearchParams(dateRange);
      const response = await apiClient.get(`/analytics/tickets/${brandId}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket analytics:', error);
      throw error;
    }
  },
};

export default ticketService;