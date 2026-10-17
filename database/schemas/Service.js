/**
 * Service Mongoose Model
 * Individual treatments, classes, and service offerings provided by businesses.
 */

import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Associated business reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      maxlength: [150, 'Service name cannot exceed 150 characters'],
    },
    category: {
      type: String,
      required: [true, 'Service category is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [15, 'Service duration must be at least 15 minutes'],
      default: 60,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a non-negative number'],
    },
    currency: {
      type: String,
      default: '$',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model('Service', serviceSchema);
export default Service;
