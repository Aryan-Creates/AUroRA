/**
 * Redux Store Configuration
 * Centralized store assembling all domain feature slices.
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import businessReducer from '../features/businesses/businessSlice.js';
import bookingReducer from '../features/bookings/bookingSlice.js';
import providerReducer from '../features/provider/providerSlice.js';
import adminReducer from '../features/admin/adminSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    businesses: businessReducer,
    bookings: bookingReducer,
    provider: providerReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Allows clean handling of date-like ISO strings
    }),
});

export default store;
