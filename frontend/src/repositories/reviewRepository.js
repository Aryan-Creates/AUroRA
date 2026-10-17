/**
 * Review Repository
 * Access for client feedback, ratings, and customer reviews.
 */

import { MOCK_REVIEWS } from '../data/mockData.js';
import { storageService } from '../services/storageService.js';
import { Review } from '../models/SupportingModels.js';

const STORAGE_KEY = 'reviews';

class ReviewRepository {
  constructor() {
    this._initData();
  }

  _initData() {
    if (!storageService.get(STORAGE_KEY)) {
      storageService.set(STORAGE_KEY, MOCK_REVIEWS);
    }
  }

  getAll() {
    const raw = storageService.get(STORAGE_KEY, MOCK_REVIEWS);
    return raw.map((r) => new Review(r));
  }

  getByBusinessId(businessId) {
    return this.getAll().filter((r) => r.businessId === businessId);
  }

  create(reviewData) {
    const raw = storageService.get(STORAGE_KEY, MOCK_REVIEWS);
    const newReview = {
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...reviewData,
    };
    raw.unshift(newReview);
    storageService.set(STORAGE_KEY, raw);
    return new Review(newReview);
  }
}

export const reviewRepository = new ReviewRepository();
