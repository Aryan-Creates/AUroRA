/**
 * Booking Service
 * Enforces booking integrity, conflict prevention, snapshots, and authorization rules.
 */

import { Booking, Business, Service, User } from '../models/index.js';
import { calculateAvailableSlots } from './availabilityService.js';

export const createBooking = async ({
  customer,
  businessId,
  serviceId,
  date,
  timeSlot,
  customerName,
  customerEmail,
  customerPhone = '',
  specialRequests = '',
}) => {
  // 1. Validate Date (cannot be in past)
  const todayStr = new Date().toISOString().split('T')[0];
  if (date < todayStr) {
    const error = new Error('Appointment date cannot be in the past.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Verify Business exists and is approved
  const business = await Business.findById(businessId);
  if (!business) {
    const error = new Error('Specified business does not exist.');
    error.statusCode = 404;
    throw error;
  }

  if (business.status !== 'approved') {
    const error = new Error('This business is currently pending moderation and not accepting bookings.');
    error.statusCode = 400;
    throw error;
  }

  // 3. Verify Service exists, is active, and belongs to this business
  const service = await Service.findById(serviceId);
  if (!service) {
    const error = new Error('Specified service does not exist.');
    error.statusCode = 404;
    throw error;
  }

  if (service.businessId.toString() !== business._id.toString()) {
    const error = new Error('The selected service does not belong to this business.');
    error.statusCode = 400;
    throw error;
  }

  if (!service.isActive) {
    const error = new Error('This service offering is currently inactive.');
    error.statusCode = 400;
    throw error;
  }

  // 4. Verify operating hours & availability
  const slots = await calculateAvailableSlots(business, date);
  const targetSlot = slots.find((s) => s.slot === timeSlot);

  if (!targetSlot) {
    const error = new Error(`Time slot '${timeSlot}' is not recognized.`);
    error.statusCode = 400;
    throw error;
  }

  if (!targetSlot.isAvailable) {
    const error = new Error(targetSlot.reason || 'The requested appointment slot is not available.');
    error.statusCode = 409; // Conflict
    throw error;
  }

  // 5. Concurrency & Conflict Prevention: Check for existing active booking
  const existingConflict = await Booking.findOne({
    businessId: business._id,
    date,
    timeSlot,
    status: { $ne: 'cancelled' },
  });

  if (existingConflict) {
    const error = new Error('Conflict: This time slot was just reserved by another client. Please select another slot.');
    error.statusCode = 409;
    throw error;
  }

  // 6. Create booking with permanent historical snapshot of price and duration
  const booking = await Booking.create({
    customerId: customer._id,
    customerName: customerName || customer.name,
    customerEmail: (customerEmail || customer.email).toLowerCase().trim(),
    customerPhone: customerPhone || customer.phone || '',
    businessId: business._id,
    businessName: business.name,
    businessAddress: business.address,
    serviceId: service._id,
    serviceName: service.name,
    price: service.price, // Immutable price snapshot
    durationMinutes: service.durationMinutes, // Immutable duration snapshot
    date,
    timeSlot,
    status: 'confirmed',
    specialRequests: specialRequests ? specialRequests.trim() : '',
  });

  return booking;
};

export const cancelBooking = async ({ bookingId, user, reason }) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const error = new Error('Booking not found.');
    error.statusCode = 404;
    throw error;
  }

  if (booking.status === 'cancelled') {
    const error = new Error('This booking is already cancelled.');
    error.statusCode = 400;
    throw error;
  }

  // Authorization check: Customer owner, or Provider owner of the business, or Admin
  const isCustomerOwner = booking.customerId.toString() === user._id.toString();
  let isBusinessOwner = false;

  if (user.role === 'provider') {
    const business = await Business.findById(booking.businessId);
    if (business && business.providerId.toString() === user._id.toString()) {
      isBusinessOwner = true;
    }
  }

  const isAdmin = user.role === 'admin';

  if (!isCustomerOwner && !isBusinessOwner && !isAdmin) {
    const error = new Error('Forbidden: You are not authorized to cancel this booking.');
    error.statusCode = 403;
    throw error;
  }

  booking.status = 'cancelled';
  booking.cancelledReason = reason || `Cancelled by ${user.role} (${user.name})`;
  booking.cancelledBy = user._id;
  await booking.save();

  return booking;
};

export const updateBookingStatus = async ({ bookingId, status, user, reason }) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const error = new Error('Booking not found.');
    error.statusCode = 404;
    throw error;
  }

  // Authorization check: Provider owner or Admin
  let isAuthorized = user.role === 'admin';
  if (user.role === 'provider') {
    const business = await Business.findById(booking.businessId);
    if (business && business.providerId.toString() === user._id.toString()) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    const error = new Error('Forbidden: Only the provider or an administrator can update booking status.');
    error.statusCode = 403;
    throw error;
  }

  booking.status = status;
  if (reason) booking.cancelledReason = reason;
  await booking.save();

  return booking;
};

export default {
  createBooking,
  cancelBooking,
  updateBookingStatus,
};
