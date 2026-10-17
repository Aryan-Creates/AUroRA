/**
 * Business Slice
 * Centralized state for service discovery, filters, search, and business detail selection.
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  businesses: [],
  categories: [],
  selectedBusiness: null,
  selectedBusinessServices: [],
  selectedBusinessReviews: [],
  filters: {
    query: '',
    category: 'All',
    city: 'All',
    sortBy: 'featured',
  },
  loading: false,
  error: null,
};

export const businessSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setBusinesses(state, action) {
      state.businesses = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setSelectedBusiness(state, action) {
      state.selectedBusiness = action.payload;
    },
    setSelectedBusinessServices(state, action) {
      state.selectedBusinessServices = action.payload;
    },
    setSelectedBusinessReviews(state, action) {
      state.selectedBusinessReviews = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = {
        query: '',
        category: 'All',
        city: 'All',
        sortBy: 'featured',
      };
    },
    updateBusinessLocally(state, action) {
      const updated = action.payload;
      const index = state.businesses.findIndex((b) => b.id === updated.id);
      if (index !== -1) {
        state.businesses[index] = updated;
      }
      if (state.selectedBusiness?.id === updated.id) {
        state.selectedBusiness = updated;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setBusinesses,
  setCategories,
  setSelectedBusiness,
  setSelectedBusinessServices,
  setSelectedBusinessReviews,
  setFilters,
  resetFilters,
  updateBusinessLocally,
} = businessSlice.actions;

export const selectBusinesses = (state) => state.businesses.businesses;
export const selectCategories = (state) => state.businesses.categories;
export const selectSelectedBusiness = (state) => state.businesses.selectedBusiness;
export const selectSelectedBusinessServices = (state) => state.businesses.selectedBusinessServices;
export const selectSelectedBusinessReviews = (state) => state.businesses.selectedBusinessReviews;
export const selectBusinessFilters = (state) => state.businesses.filters;
export const selectBusinessLoading = (state) => state.businesses.loading;
export const selectBusinessError = (state) => state.businesses.error;

export default businessSlice.reducer;
