/**
 * Admin Slice
 * Manages admin moderation workflows, user management, business approvals,
 * and platform oversight.
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  businesses: [],
  reports: [],
  loading: false,
  error: null,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminLoading(state, action) {
      state.loading = action.payload;
    },
    setAdminError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setAdminUsers(state, action) {
      state.users = action.payload;
      state.loading = false;
    },
    updateAdminUser(state, action) {
      const updated = action.payload;
      const index = state.users.findIndex((u) => u.id === updated.id);
      if (index !== -1) {
        state.users[index] = updated;
      }
    },
    setAdminBusinesses(state, action) {
      state.businesses = action.payload;
      state.loading = false;
    },
    updateAdminBusinessStatus(state, action) {
      const { id, status } = action.payload;
      const index = state.businesses.findIndex((b) => b.id === id);
      if (index !== -1) {
        state.businesses[index].status = status;
      }
    },
    setAdminReports(state, action) {
      state.reports = action.payload;
      state.loading = false;
    },
    updateAdminReportStatus(state, action) {
      const { id, status } = action.payload;
      const index = state.reports.findIndex((r) => r.id === id);
      if (index !== -1) {
        state.reports[index].status = status;
      }
    },
  },
});

export const {
  setAdminLoading,
  setAdminError,
  setAdminUsers,
  updateAdminUser,
  setAdminBusinesses,
  updateAdminBusinessStatus,
  setAdminReports,
  updateAdminReportStatus,
} = adminSlice.actions;

export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminBusinesses = (state) => state.admin.businesses;
export const selectAdminReports = (state) => state.admin.reports;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;

// Derived platform metrics
export const selectAdminMetrics = (state) => {
  const users = state.admin.users || [];
  const businesses = state.admin.businesses || [];
  const reports = state.admin.reports || [];

  return {
    totalUsers: users.length,
    totalCustomers: users.filter((u) => u.role === 'customer').length,
    totalProviders: businesses.length,
    pendingBusinesses: businesses.filter((b) => b.status === 'pending').length,
    pendingReports: reports.filter((r) => r.status === 'pending').length,
  };
};

export default adminSlice.reducer;
