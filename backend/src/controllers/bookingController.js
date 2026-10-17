/**
 * Booking Controller
 * Handles booking creation, customer appointments retrieval, and cancellations.
 */

import { Booking } from '../models/index.js';
import bookingService from '../services/bookingService.js';

export const createBooking = async (req, res, next) => {
  try {
    const {
      businessId,
      serviceId,
      date,
      timeSlot,
      customerName,
      customerEmail,
      customerPhone,
      specialRequests,
    } = req.body;

    if (!businessId || !serviceId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking parameters: businessId, serviceId, date, timeSlot.',
      });
    }

    const booking = await bookingService.createBooking({
      customer: req.user,
      businessId,
      serviceId,
      date,
      timeSlot,
      customerName,
      customerEmail,
      customerPhone,
      specialRequests,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment reserved successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id }).sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await bookingService.cancelBooking({
      bookingId: id,
      user: req.user,
      reason,
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Ownership check
    const isCustomer = booking.customerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isProvider = req.user.role === 'provider';

    if (!isCustomer && !isAdmin && !isProvider) {
      return res.status(403).json({ success: false, error: 'Forbidden: Access denied.' });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createBooking,
  getCustomerBookings,
  cancelBooking,
  getBookingById,
};
