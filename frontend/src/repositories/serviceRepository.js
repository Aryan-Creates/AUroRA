/**
 * Service Repository
 * Data access abstraction for service listings and provider service management.
 */

import { MOCK_SERVICES } from '../data/mockData.js';
import { storageService } from '../services/storageService.js';
import { Service } from '../models/Service.js';

const STORAGE_KEY = 'services';

class ServiceRepository {
  constructor() {
    this._initData();
  }

  _initData() {
    if (!storageService.get(STORAGE_KEY)) {
      storageService.set(STORAGE_KEY, MOCK_SERVICES);
    }
  }

  getAll() {
    const raw = storageService.get(STORAGE_KEY, MOCK_SERVICES);
    return raw.map((s) => new Service(s));
  }

  getById(id) {
    const list = this.getAll();
    return list.find((s) => s.id === id) || null;
  }

  getByBusinessId(businessId) {
    const list = this.getAll();
    return list.filter((s) => s.businessId === businessId);
  }

  create(serviceData) {
    const raw = storageService.get(STORAGE_KEY, MOCK_SERVICES);
    const newService = {
      id: `srv-${Date.now()}`,
      currency: '₹',
      isPopular: false,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      ...serviceData,
      price: Number(serviceData.price),
      durationMinutes: Number(serviceData.durationMinutes),
    };
    raw.push(newService);
    storageService.set(STORAGE_KEY, raw);
    return new Service(newService);
  }

  update(id, updates) {
    const raw = storageService.get(STORAGE_KEY, MOCK_SERVICES);
    const index = raw.findIndex((s) => s.id === id);
    if (index === -1) return null;
    raw[index] = {
      ...raw[index],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : raw[index].price,
      durationMinutes: updates.durationMinutes !== undefined ? Number(updates.durationMinutes) : raw[index].durationMinutes,
    };
    storageService.set(STORAGE_KEY, raw);
    return new Service(raw[index]);
  }

  delete(id) {
    const raw = storageService.get(STORAGE_KEY, MOCK_SERVICES);
    const filtered = raw.filter((s) => s.id !== id);
    if (filtered.length !== raw.length) {
      storageService.set(STORAGE_KEY, filtered);
      return true;
    }
    return false;
  }
}

export const serviceRepository = new ServiceRepository();
