/**
 * Authentication Service
 * Handles user registration, credentials verification, JWT issuance, and profile updates.
 */

import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { User } from '../models/index.js';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );
};

export const registerUser = async ({ name, email, password, role = 'customer', phone = '' }) => {
  // Prevent public registration from assigning admin role
  const safeRole = role === 'admin' ? 'customer' : role;

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    const error = new Error('An account with this email address already exists.');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: safeRole,
    phone: phone.trim(),
  });

  const token = generateToken(user);
  return { user, token };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (user.status === 'suspended') {
    const error = new Error('This account has been suspended by a platform administrator.');
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  return { user, token };
};

export default {
  generateToken,
  registerUser,
  loginUser,
};
