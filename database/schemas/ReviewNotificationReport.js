/**
 * Review, Notification, and Report Mongoose Models
 */

import mongoose from 'mongoose';

// --- REVIEW SCHEMA ---
const reviewSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business reference is required'],
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer reference is required'],
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Minimum rating is 1 star'],
      max: [5, 'Maximum rating is 5 stars'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      minlength: [5, 'Comment must be at least 5 characters'],
      trim: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model('Review', reviewSchema);

// --- NOTIFICATION SCHEMA ---
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Target user is required'],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'booking'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    link: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);

// --- REPORT SCHEMA ---
const reportSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Reported business reference is required'],
      index: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    reportedBy: {
      type: String,
      required: true,
      trim: true,
    },
    reporterEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason for report is required'],
      trim: true,
    },
    details: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model('Report', reportSchema);
