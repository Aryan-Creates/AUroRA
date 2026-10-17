/**
 * Business Controller
 * Coordinates search, filtering, category loading, and business profile inspection.
 */

import { store } from '../app/store.js';
import { businessRepository } from '../repositories/businessRepository.js';
import { serviceRepository } from '../repositories/serviceRepository.js';
import { reviewRepository } from '../repositories/reviewRepository.js';
import {
  setLoading,
  setError,
  setBusinesses,
  setCategories,
  setSelectedBusiness,
  setSelectedBusinessServices,
  setSelectedBusinessReviews,
  setFilters,
  resetFilters,
} from '../features/businesses/businessSlice.js';

export const businessController = {
  loadCategories() {
    try {
      const categories = businessRepository.getCategories();
      store.dispatch(setCategories(categories));
      return categories;
    } catch (err) {
      console.error('[businessController] Failed to load categories:', err);
      return [];
    }
  },

  searchBusinesses(customFilters = {}) {
    store.dispatch(setLoading(true));
    try {
      const currentFilters = store.getState().businesses.filters;
      const mergedFilters = { ...currentFilters, ...customFilters };

      // Update Redux filter state
      store.dispatch(setFilters(customFilters));

      const results = businessRepository.search(mergedFilters);
      store.dispatch(setBusinesses(results));
      return { success: true, count: results.length, data: results };
    } catch (err) {
      store.dispatch(setError(err.message));
      return { success: false, error: err.message };
    }
  },

  resetFiltersAndSearch() {
    store.dispatch(resetFilters());
    const results = businessRepository.search({ query: '', category: 'All', city: 'All', sortBy: 'featured' });
    store.dispatch(setBusinesses(results));
  },

  loadBusinessDetails(idOrSlug) {
    store.dispatch(setLoading(true));
    try {
      const business = businessRepository.getById(idOrSlug);
      if (!business) {
        store.dispatch(setError('Business not found.'));
        store.dispatch(setSelectedBusiness(null));
        return { success: false, error: 'Business not found' };
      }

      const services = serviceRepository.getByBusinessId(business.id);
      const reviews = reviewRepository.getByBusinessId(business.id);

      store.dispatch(setSelectedBusiness(business));
      store.dispatch(setSelectedBusinessServices(services));
      store.dispatch(setSelectedBusinessReviews(reviews));
      store.dispatch(setLoading(false));

      return { success: true, business, services, reviews };
    } catch (err) {
      store.dispatch(setError(err.message));
      return { success: false, error: err.message };
    }
  },

  addReview(businessId, { rating, comment }) {
    const currentUser = store.getState().auth.currentUser;
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to post a review.' };
    }
    if (!comment || comment.trim().length < 5) {
      return { success: false, error: 'Review text must be at least 5 characters.' };
    }

    const review = reviewRepository.create({
      businessId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      rating: Number(rating) || 5,
      comment: comment.trim(),
    });

    // Refresh reviews in state
    const updatedReviews = reviewRepository.getByBusinessId(businessId);
    store.dispatch(setSelectedBusinessReviews(updatedReviews));

    return { success: true, review };
  },
};
