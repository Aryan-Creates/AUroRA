/**
 * Storage Service
 * Provides session/local persistence abstraction for the mock repositories.
 * Allows mock data updates to persist across client-side refreshes without any backend.
 */

const STORAGE_PREFIX = 'aurora_';

export const storageService = {
  get(key, defaultValue = null) {
    try {
      const data = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (err) {
      console.warn(`[storageService] Failed to read ${key}:`, err);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (err) {
      console.warn(`[storageService] Failed to write ${key}:`, err);
    }
  },

  remove(key) {
    try {
      sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (err) {
      console.warn(`[storageService] Failed to remove ${key}:`, err);
    }
  },

  clear() {
    try {
      Object.keys(sessionStorage).forEach((k) => {
        if (k.startsWith(STORAGE_PREFIX)) {
          sessionStorage.removeItem(k);
        }
      });
    } catch (err) {
      console.warn('[storageService] Failed to clear storage:', err);
    }
  },
};
