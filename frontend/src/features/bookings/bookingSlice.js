/**
 * Booking Slice
 * Manages customer bookings list, multi-step booking wizard workflow,
 * and slot availability checks.
 */

import { createSlice } from '@reduxjs/toolkit';

const initialDraft = {
  businessId: '',
  businessName: '',
  businessAddress: '',
  serviceId: '',
  serviceName: '',
  price: 0,
  durationMinutes: 60,
  date: '',
  timeSlot: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  specialRequests: '',
};

const initialState = {
  customerBookings: [],
  currentDraft: initialDraft,
  bookingStep: 1, // 1: Select Service, 2: Select Date & Slot, 3: Review & Customer Details, 4: Confirmed
  availableSlots: [],
  lastConfirmedBooking: null,
  loading: false,
  error: null,
};

export const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookingsLoading(state, action) {
      state.loading = action.payload;
    },
    setCustomerBookings(state, action) {
      state.customerBookings = action.payload;
      state.loading = false;
    },
    setBookingDraft(state, action) {
      state.currentDraft = { ...state.currentDraft, ...action.payload };
    },
    setBookingStep(state, action) {
      state.bookingStep = action.payload;
    },
    setAvailableSlots(state, action) {
      state.availableSlots = action.payload;
    },
    setLastConfirmedBooking(state, action) {
      state.lastConfirmedBooking = action.payload;
    },
    resetBookingDraft(state) {
      state.currentDraft = initialDraft;
      state.bookingStep = 1;
      state.availableSlots = [];
      state.lastConfirmedBooking = null;
      state.error = null;
    },
    setBookingError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addBookingToCustomerList(state, action) {
      state.customerBookings.unshift(action.payload);
    },
    updateBookingInCustomerList(state, action) {
      const updated = action.payload;
      const index = state.customerBookings.findIndex((b) => b.id === updated.id);
      if (index !== -1) {
        state.customerBookings[index] = updated;
      }
    },
  },
});

export const {
  setBookingsLoading,
  setCustomerBookings,
  setBookingDraft,
  setBookingStep,
  setAvailableSlots,
  setLastConfirmedBooking,
  resetBookingDraft,
  setBookingError,
  addBookingToCustomerList,
  updateBookingInCustomerList,
} = bookingSlice.actions;

export const selectCustomerBookings = (state) => state.bookings.customerBookings;
export const selectBookingDraft = (state) => state.bookings.currentDraft;
export const selectBookingStep = (state) => state.bookings.bookingStep;
export const selectAvailableSlots = (state) => state.bookings.availableSlots;
export const selectLastConfirmedBooking = (state) => state.bookings.lastConfirmedBooking;
export const selectBookingLoading = (state) => state.bookings.loading;
export const selectBookingError = (state) => state.bookings.error;

export default bookingSlice.reducer;
