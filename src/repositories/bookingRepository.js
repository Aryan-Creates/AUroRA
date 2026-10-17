/**
 * Booking Repository
 * Data access abstraction for appointment booking lifecycle and availability verification.
 */

import { MOCK_BOOKINGS, TIME_SLOTS } from '../data/mockData.js';
import { storageService } from '../services/storageService.js';
import { Booking, BOOKING_STATUS } from '../models/Booking.js';

const STORAGE_KEY = 'bookings';

class BookingRepository {
  constructor() {
    this._initData();
  }

  _initData() {
    if (!storageService.get(STORAGE_KEY)) {
      storageService.set(STORAGE_KEY, MOCK_BOOKINGS);
    }
  }

  getAll() {
    const raw = storageService.get(STORAGE_KEY, MOCK_BOOKINGS);
    return raw.map((b) => new Booking(b));
  }

  getById(id) {
    const list = this.getAll();
    return list.find((b) => b.id === id) || null;
  }

  getByCustomerId(customerId) {
    const list = this.getAll();
    return list
      .filter((b) => b.customerId === customerId)
      .sort((a, b) => new Date(b.date + ' ' + b.timeSlot) - new Date(a.date + ' ' + a.timeSlot));
  }

  getByBusinessId(businessId) {
    const list = this.getAll();
    return list
      .filter((b) => b.businessId === businessId)
      .sort((a, b) => new Date(b.date + ' ' + b.timeSlot) - new Date(a.date + ' ' + a.timeSlot));
  }

  getAvailableSlots(businessId, serviceId, date) {
    if (!date) return [];
    // Find all active bookings for this business on this date
    const all = this.getAll();
    const bookedSlots = all
      .filter(
        (b) =>
          b.businessId === businessId &&
          b.date === date &&
          b.status !== BOOKING_STATUS.CANCELLED
      )
      .map((b) => b.timeSlot);

    // Return slots with availability flag
    return TIME_SLOTS.map((slot) => ({
      slot,
      isAvailable: !bookedSlots.includes(slot),
    }));
  }

  create(bookingData) {
    const raw = storageService.get(STORAGE_KEY, MOCK_BOOKINGS);
    const newBooking = {
      id: `bk-${Date.now()}`,
      status: BOOKING_STATUS.CONFIRMED,
      createdAt: new Date().toISOString(),
      cancelledReason: null,
      ...bookingData,
    };
    raw.unshift(newBooking);
    storageService.set(STORAGE_KEY, raw);
    return new Booking(newBooking);
  }

  updateStatus(id, status, reason = null) {
    const raw = storageService.get(STORAGE_KEY, MOCK_BOOKINGS);
    const index = raw.findIndex((b) => b.id === id);
    if (index === -1) return null;
    raw[index].status = status;
    if (reason) {
      raw[index].cancelledReason = reason;
    }
    storageService.set(STORAGE_KEY, raw);
    return new Booking(raw[index]);
  }

  cancelBooking(id, reason = 'Cancelled by user') {
    return this.updateStatus(id, BOOKING_STATUS.CANCELLED, reason);
  }
}

export const bookingRepository = new BookingRepository();
