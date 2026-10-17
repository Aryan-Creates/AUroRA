/**
 * Auth Slice
 * Centralized state for simulated authentication, active role, and session user.
 */

import { createSlice } from '@reduxjs/toolkit';
import { MOCK_USERS } from '../../data/mockData.js';
import { storageService } from '../../services/storageService.js';

const SESSION_USER_KEY = 'current_user';

// Default to customer Claire Vance for instant rich interaction
const initialUser = storageService.get(SESSION_USER_KEY, MOCK_USERS[0]);

const initialState = {
  currentUser: initialUser,
  isAuthenticated: !!initialUser,
  role: initialUser ? initialUser.role : 'customer',
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.error = null;
      storageService.set(SESSION_USER_KEY, action.payload);
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.role = 'customer';
      state.error = null;
      storageService.remove(SESSION_USER_KEY);
    },
    switchRole(state, action) {
      const targetRole = action.payload;
      // Find a matching mock user for quick role demo
      const matchingUser = MOCK_USERS.find((u) => u.role === targetRole) || {
        id: `usr-${targetRole}-demo`,
        name: `Demo ${targetRole.toUpperCase()}`,
        email: `${targetRole}@aurora-demo.local`,
        role: targetRole,
        businessId: targetRole === 'provider' ? 'biz-1' : null,
      };
      state.currentUser = matchingUser;
      state.isAuthenticated = true;
      state.role = targetRole;
      storageService.set(SESSION_USER_KEY, matchingUser);
    },
    updateProfile(state, action) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        storageService.set(SESSION_USER_KEY, state.currentUser);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  switchRole,
  updateProfile,
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
