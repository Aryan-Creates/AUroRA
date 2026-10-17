/**
 * Business Repository
 * Data access abstraction for local service businesses and moderation states.
 */

import { MOCK_BUSINESSES, MOCK_CATEGORIES } from '../data/mockData.js';
import { storageService } from '../services/storageService.js';
import { Business } from '../models/Business.js';
import { Category } from '../models/SupportingModels.js';

const STORAGE_KEY = 'businesses';
const CAT_STORAGE_KEY = 'categories';

class BusinessRepository {
  constructor() {
    this._initData();
  }

  _initData() {
    if (!storageService.get(STORAGE_KEY)) {
      storageService.set(STORAGE_KEY, MOCK_BUSINESSES);
    }
    if (!storageService.get(CAT_STORAGE_KEY)) {
      storageService.set(CAT_STORAGE_KEY, MOCK_CATEGORIES);
    }
  }

  getAll() {
    const raw = storageService.get(STORAGE_KEY, MOCK_BUSINESSES);
    return raw.map((b) => new Business(b));
  }

  getAllApproved() {
    return this.getAll().filter((b) => b.status === 'approved');
  }

  getCategories() {
    const raw = storageService.get(CAT_STORAGE_KEY, MOCK_CATEGORIES);
    return raw.map((c) => new Category(c));
  }

  getById(id) {
    const list = this.getAll();
    return list.find((b) => b.id === id || b.slug === id) || null;
  }

  getByProviderId(providerId) {
    const list = this.getAll();
    return list.find((b) => b.providerId === providerId) || null;
  }

  search({ query = '', category = '', city = '', sortBy = 'featured' }) {
    let results = this.getAllApproved();

    if (category && category !== 'All' && category !== 'all') {
      const catLower = category.toLowerCase();
      results = results.filter((b) =>
        b.category.toLowerCase().includes(catLower) ||
        (b.slug && b.slug.toLowerCase().includes(catLower))
      );
    }

    if (city && city !== 'All') {
      const cityLower = city.toLowerCase();
      results = results.filter((b) => b.city.toLowerCase() === cityLower);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q) ||
          b.tagline.toLowerCase().includes(q)
      );
    }

    // Sort options
    if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      results.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // 'featured'
      results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return results;
  }

  update(id, updates) {
    const raw = storageService.get(STORAGE_KEY, MOCK_BUSINESSES);
    const index = raw.findIndex((b) => b.id === id);
    if (index === -1) return null;
    raw[index] = { ...raw[index], ...updates };
    storageService.set(STORAGE_KEY, raw);
    return new Business(raw[index]);
  }

  updateStatus(id, status) {
    return this.update(id, { status });
  }

  updateOpeningHours(id, openingHours) {
    return this.update(id, { openingHours });
  }
}

export const businessRepository = new BusinessRepository();
