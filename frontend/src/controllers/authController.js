/**
 * Auth Controller
 * Coordinates authentication, session management, registration, and role switching.
 */

import { store } from '../app/store.js';
import { userRepository } from '../repositories/userRepository.js';
import { validationService } from '../services/validationService.js';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  switchRole,
  updateProfile,
} from '../features/auth/authSlice.js';

export const authController = {
  login({ email, password }) {
    store.dispatch(loginStart());

    if (!validationService.isValidEmail(email)) {
      const err = 'Please provide a valid email address.';
      store.dispatch(loginFailure(err));
      return { success: false, error: err };
    }

    if (!password || password.length < 4) {
      const err = 'Password must be at least 4 characters.';
      store.dispatch(loginFailure(err));
      return { success: false, error: err };
    }

    // Lookup user in mock repository
    const user = userRepository.getByEmail(email);
    if (!user) {
      // For demonstration convenience, if user does not exist yet, create a simulated customer session
      const newUser = userRepository.create({
        name: email.split('@')[0],
        email: email.trim(),
        role: 'customer',
      });
      store.dispatch(loginSuccess(newUser));
      return { success: true, user: newUser, isNew: true };
    }

    if (user.status === 'suspended') {
      const err = 'This account has been suspended by the platform administrator.';
      store.dispatch(loginFailure(err));
      return { success: false, error: err };
    }

    store.dispatch(loginSuccess(user));
    return { success: true, user };
  },

  register({ name, email, password, role = 'customer', phone = '' }) {
    store.dispatch(loginStart());

    if (!name || name.trim().length < 2) {
      const err = 'Full name is required.';
      store.dispatch(loginFailure(err));
      return { success: false, error: err };
    }

    if (!validationService.isValidEmail(email)) {
      const err = 'A valid email address is required.';
      store.dispatch(loginFailure(err));
      return { success: false, error: err };
    }

    if (!password || password.length < 6) {
      const err = 'Password must be at least 6 characters.';
      store.dispatch(loginFailure(err));
      return { success: false, error: err };
    }

    const existing = userRepository.getByEmail(email);
    if (existing) {
      const err = 'An account with this email already exists.';
      store.dispatch(loginFailure(err));
      return { success: false, error: err };
    }

    const created = userRepository.create({
      name: name.trim(),
      email: email.trim(),
      role,
      phone: phone.trim(),
    });

    store.dispatch(loginSuccess(created));
    return { success: true, user: created };
  },

  logout() {
    store.dispatch(logout());
  },

  switchRole(targetRole) {
    store.dispatch(switchRole(targetRole));
    return { success: true, role: targetRole };
  },

  updateUserProfile(userId, profileData) {
    const updated = userRepository.update(userId, profileData);
    if (updated) {
      store.dispatch(updateProfile(profileData));
      return { success: true, user: updated };
    }
    return { success: false, error: 'User not found' };
  },
};
