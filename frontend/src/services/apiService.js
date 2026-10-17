/**
 * Centralized API Client Service for AUroRA
 * Integrates with the Express REST API backend when active,
 * with configurable base URL and cookie/credential management.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('aurora_token');

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || `HTTP Error ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.warn(`[ApiService] Request to ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  // --- HEALTH & STATUS ---
  async checkHealth() {
    return this.request('/health');
  }

  // --- AUTHENTICATION ---
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // --- BUSINESSES ---
  async getBusinesses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/businesses${query ? `?${query}` : ''}`);
  }

  async getCategories() {
    return this.request('/businesses/categories');
  }

  async getBusinessById(id) {
    return this.request(`/businesses/${id}`);
  }

  async getBusinessServices(id) {
    return this.request(`/businesses/${id}/services`);
  }

  async getBusinessAvailability(id, date, serviceId) {
    const query = new URLSearchParams({ date, ...(serviceId ? { serviceId } : {}) }).toString();
    return this.request(`/businesses/${id}/availability?${query}`);
  }

  async createBusiness(businessData) {
    return this.request('/businesses', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
  }

  // --- SERVICES ---
  async createService(serviceData) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(id, updates) {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteService(id) {
    return this.request(`/services/${id}`, { method: 'DELETE' });
  }

  // --- BOOKINGS ---
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getCustomerBookings() {
    return this.request('/bookings/my-bookings');
  }

  async getProviderBookings() {
    return this.request('/bookings/provider-bookings');
  }

  async cancelBooking(id, reason) {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async updateBookingStatus(id, status) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // --- ADMIN ---
  async getAdminMetrics() {
    return this.request('/admin/metrics');
  }

  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async getAdminBusinesses() {
    return this.request('/admin/businesses');
  }

  async moderateBusiness(id, status) {
    return this.request(`/admin/businesses/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminReports() {
    return this.request('/admin/reports');
  }

  async getAdminBookings() {
    return this.request('/admin/bookings');
  }
}

export const apiService = new ApiService();
export default apiService;
