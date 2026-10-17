/**
 * Availability Service
 * Computes open appointment slots against business operating hours and existing bookings.
 */

import { Booking } from '../models/index.js';

export const STANDARD_TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const calculateAvailableSlots = async (business, date) => {
  if (!date || !business) return [];

  // Parse day of the week
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayName = DAYS[dateObj.getDay()];

  // Check business operating hours for this day
  const hoursMap = business.openingHours instanceof Map
    ? business.openingHours
    : new Map(Object.entries(business.openingHours || {}));

  const dayHours = hoursMap.get(dayName) || 'Closed';
  const isDayClosed = dayHours.toLowerCase() === 'closed';

  if (isDayClosed) {
    return STANDARD_TIME_SLOTS.map((slot) => ({
      slot,
      isAvailable: false,
      reason: `${business.name} is closed on ${dayName}s`,
    }));
  }

  // Find all active (non-cancelled) bookings for this business on this date
  const existingBookings = await Booking.find({
    businessId: business._id,
    date,
    status: { $ne: 'cancelled' },
  }).select('timeSlot');

  const bookedSlots = new Set(existingBookings.map((b) => b.timeSlot));

  return STANDARD_TIME_SLOTS.map((slot) => ({
    slot,
    isAvailable: !bookedSlots.has(slot),
    reason: bookedSlots.has(slot) ? 'Already reserved by another client' : null,
  }));
};

export default {
  STANDARD_TIME_SLOTS,
  calculateAvailableSlots,
};
