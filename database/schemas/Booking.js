/**
 * Booking Mongoose Model
 * Manages customer appointments with business/service snapshots and conflict indexing.
 */

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer reference is required'],
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business reference is required'],
      index: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    businessAddress: {
      type: String,
      trim: true,
      default: '',
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service reference is required'],
      index: true,
    },
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Booking price snapshot is required'],
      min: 0,
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Booking duration snapshot is required'],
      min: 15,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: [true, 'Appointment date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must follow YYYY-MM-DD format'],
      index: true,
    },
    timeSlot: {
      type: String, // e.g. "11:00 AM"
      required: [true, 'Time slot is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid booking status',
      },
      default: 'confirmed',
      index: true,
    },
    specialRequests: {
      type: String,
      trim: true,
      default: '',
    },
    cancelledReason: {
      type: String,
      default: null,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for slot conflict checks and provider schedule queries
bookingSchema.index({ businessId: 1, date: 1, timeSlot: 1, status: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
