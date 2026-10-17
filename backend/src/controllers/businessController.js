/**
 * Business Controller
 * Handles public business discovery, category listings, profile details, and reviews.
 */

import mongoose from 'mongoose';
import { Business, Service, Review } from '../models/index.js';
import { calculateAvailableSlots } from '../services/availabilityService.js';

export const getBusinesses = async (req, res, next) => {
  try {
    const { query, category, city, sortBy = 'featured' } = req.query;

    const filter = { status: 'approved' };

    if (category && category !== 'All' && category !== 'all') {
      filter.category = new RegExp(category, 'i');
    }

    if (city && city !== 'All') {
      filter.city = new RegExp(city, 'i');
    }

    if (query && query.trim()) {
      const q = query.trim();
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { category: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { address: new RegExp(q, 'i') },
        { tagline: new RegExp(q, 'i') },
      ];
    }

    let sort = {};
    if (sortBy === 'rating') {
      sort = { rating: -1, reviewCount: -1 };
    } else if (sortBy === 'reviews') {
      sort = { reviewCount: -1, rating: -1 };
    } else if (sortBy === 'name') {
      sort = { name: 1 };
    } else {
      // featured
      sort = { isFeatured: -1, rating: -1 };
    }

    const businesses = await Business.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categoriesData = [
      {
        id: 'cat-salons',
        slug: 'hair-salons',
        name: 'Hair Salons & Styling',
        description: 'Master cuts, precision coloring, balayage, and restorative hair treatments.',
        icon: 'Scissors',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'cat-spas',
        slug: 'spas-wellness',
        name: 'Spas & Wellness',
        description: 'Deep tissue therapy, holistic aromatherapy, hydrotherapy, and body rejuvenation.',
        icon: 'Sparkles',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'cat-fitness',
        slug: 'fitness-gyms',
        name: 'Fitness & Studios',
        description: 'High-intensity conditioning, boutique Pilates, personal training, and strength clubs.',
        icon: 'Dumbbell',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'cat-barbers',
        slug: 'barber-shops',
        name: 'Barbers & Grooming',
        description: 'Traditional hot towel shaves, bespoke fades, beard architectural sculpting.',
        icon: 'Razor',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'cat-nails',
        slug: 'nail-studios',
        name: 'Nails & Beauty Care',
        description: 'Gel sculpting, Japanese organic manicures, luxury pedicures, and nail artistry.',
        icon: 'Hand',
        image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'cat-yoga',
        slug: 'yoga-mindfulness',
        name: 'Yoga & Mindfulness',
        description: 'Vinyasa flow, breathwork alignment, sound baths, and meditation sanctuaries.',
        icon: 'Flower2',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      },
    ];

    // Compute live count from database
    const categoriesWithCounts = await Promise.all(
      categoriesData.map(async (cat) => {
        const count = await Business.countDocuments({
          category: cat.name,
          status: 'approved',
        });
        return { ...cat, serviceCount: count };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let business;

    if (mongoose.Types.ObjectId.isValid(id)) {
      business = await Business.findById(id);
    } else {
      business = await Business.findOne({ slug: id });
    }

    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Establishment not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessServices = async (req, res, next) => {
  try {
    const { id } = req.params;
    let businessId = id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const b = await Business.findOne({ slug: id });
      if (!b) return res.status(404).json({ success: false, error: 'Business not found' });
      businessId = b._id;
    }

    const services = await Service.find({
      businessId,
      isActive: true,
    }).sort({ isPopular: -1, price: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "date" (YYYY-MM-DD) is required.',
      });
    }

    let business;
    if (mongoose.Types.ObjectId.isValid(id)) {
      business = await Business.findById(id);
    } else {
      business = await Business.findOne({ slug: id });
    }

    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found.',
      });
    }

    const slots = await calculateAvailableSlots(business, date);

    res.status(200).json({
      success: true,
      data: {
        date,
        slots,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    let businessId = id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const b = await Business.findOne({ slug: id });
      if (!b) return res.status(404).json({ success: false, error: 'Business not found' });
      businessId = b._id;
    }

    const reviews = await Review.find({ businessId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const addBusinessReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5 stars.',
      });
    }

    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Review comment must be at least 5 characters.',
      });
    }

    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    const review = await Review.create({
      businessId: business._id,
      customerId: req.user._id,
      customerName: req.user.name,
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Update business rating and reviewCount
    const allReviews = await Review.find({ businessId: business._id });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    business.rating = Math.round(avg * 10) / 10;
    business.reviewCount = allReviews.length;
    await business.save();

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOne({ providerId: req.user._id });
    res.status(200).json({
      success: true,
      data: business || null,
    });
  } catch (error) {
    next(error);
  }
};

export const createBusiness = async (req, res, next) => {
  try {
    const existing = await Business.findOne({ providerId: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'A business profile is already registered for this provider account.',
      });
    }

    const slug = (req.body.name || 'business')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const business = await Business.create({
      ...req.body,
      providerId: req.user._id,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      status: 'approved',
    });

    res.status(201).json({
      success: true,
      message: 'Business registered successfully',
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBusiness = async (req, res, next) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Business updated successfully',
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getBusinesses,
  getCategories,
  getBusinessById,
  getBusinessServices,
  getBusinessAvailability,
  getBusinessReviews,
  addBusinessReview,
  getProviderBusiness,
  createBusiness,
  updateBusiness,
};
