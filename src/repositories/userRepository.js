/**
 * User Repository
 * Data access abstraction for user entities.
 * Initializes from mockData and syncs with session storage.
 */

import { MOCK_USERS } from '../data/mockData.js';
import { storageService } from '../services/storageService.js';
import { User } from '../models/User.js';

const STORAGE_KEY = 'users';

class UserRepository {
  constructor() {
    this._initData();
  }

  _initData() {
    const existing = storageService.get(STORAGE_KEY);
    if (!existing) {
      storageService.set(STORAGE_KEY, MOCK_USERS);
    }
  }

  getAll() {
    const raw = storageService.get(STORAGE_KEY, MOCK_USERS);
    return raw.map((u) => new User(u));
  }

  getById(id) {
    const users = this.getAll();
    return users.find((u) => u.id === id) || null;
  }

  getByEmail(email) {
    if (!email) return null;
    const users = this.getAll();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  }

  create(userData) {
    const users = storageService.get(STORAGE_KEY, MOCK_USERS);
    const newUser = {
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      ...userData,
    };
    users.push(newUser);
    storageService.set(STORAGE_KEY, users);
    return new User(newUser);
  }

  update(id, updates) {
    const users = storageService.get(STORAGE_KEY, MOCK_USERS);
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates };
    storageService.set(STORAGE_KEY, users);
    return new User(users[index]);
  }

  updateStatus(id, status) {
    return this.update(id, { status });
  }
}

export const userRepository = new UserRepository();
