/**
 * Provider Slice
 * Manages provider business state, services CRUD, booking management,
 * operating hours, and derived dashboard metrics.
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  business: null,
  services: [],
  bookings: [],
  openingHours: {},
  loading: false,
  error: null,
};

export const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    setProviderLoading(state, action) {
      state.loading = action.payload;
    },
    setProviderError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setProviderBusiness(state, action) {
      state.business = action.payload;
      if (action.payload?.openingHours) {
        state.openingHours = action.payload.openingHours;
      }
      state.loading = false;
    },
    setProviderServices(state, action) {
      state.services = action.payload;
    },
    addProviderService(state, action) {
      state.services.push(action.payload);
    },
    updateProviderService(state, action) {
      const index = state.services.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
    },
    removeProviderService(state, action) {
      state.services = state.services.filter((s) => s.id !== action.payload);
    },
    setProviderBookings(state, action) {
      state.bookings = action.payload;
      state.loading = false;
    },
    updateProviderBookingStatus(state, action) {
      const { id, status, reason } = action.payload;
      const index = state.bookings.findIndex((b) => b.id === id);
      if (index !== -1) {
        state.bookings[index].status = status;
        if (reason) state.bookings[index].cancelledReason = reason;
      }
    },
    updateProviderOpeningHours(state, action) {
      state.openingHours = { ...state.openingHours, ...action.payload };
      if (state.business) {
        state.business.openingHours = state.openingHours;
      }
    },
  },
});

export const {
  setProviderLoading,
  setProviderError,
  setProviderBusiness,
  setProviderServices,
  addProviderService,
  updateProviderService,
  removeProviderService,
  setProviderBookings,
  updateProviderBookingStatus,
  updateProviderOpeningHours,
} = providerSlice.actions;

export const selectProviderBusiness = (state) => state.provider.business;
export const selectProviderServices = (state) => state.provider.services;
export const selectProviderBookings = (state) => state.provider.bookings;
export const selectProviderOpeningHours = (state) => state.provider.openingHours;
export const selectProviderLoading = (state) => state.provider.loading;
export const selectProviderError = (state) => state.provider.error;

// Derived metrics selector directly from underlying mock dataset state
export const selectProviderMetrics = (state) => {
  const bookings = state.provider.bookings || [];
  const totalBookings = bookings.length;
  const upcoming = bookings.filter((b) => b.status === 'confirmed').length;
  const pending = bookings.filter((b) => b.status === 'pending').length;
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length;

  const totalRevenue = bookings
    .filter((b) => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  return {
    totalBookings,
    upcoming,
    pending,
    completed,
    cancelled,
    totalRevenue,
  };
};

export default providerSlice.reducer;
