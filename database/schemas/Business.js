/**
 * Business Mongoose Model
 * Represents verified and pending service provider businesses.
 */

import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Provider reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [150, 'Business name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Service category is required'],
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    postalCode: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Business phone is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: '',
    },
    openingHours: {
      type: Map,
      of: String,
      default: {
        Monday: '09:00 - 19:00',
        Tuesday: '09:00 - 19:00',
        Wednesday: '09:00 - 19:00',
        Thursday: '09:00 - 20:00',
        Friday: '09:00 - 20:00',
        Saturday: '09:00 - 18:00',
        Sunday: 'Closed',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: '{VALUE} is not a valid business status',
      },
      default: 'approved',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    badges: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Business = mongoose.model('Business', businessSchema);
export default Business;
