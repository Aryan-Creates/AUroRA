/**
 * Booking Controller
 * Coordinates the full end-to-end 7-step booking workflow,
 * slot availability checks, booking creation, and customer booking lifecycle.
 */

import { store } from '../app/store.js';
import { bookingRepository } from '../repositories/bookingRepository.js';
import { validationService } from '../services/validationService.js';
import {
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
} from '../features/bookings/bookingSlice.js';

export const bookingController = {
  initializeBookingWizard(business, service = null) {
    store.dispatch(resetBookingDraft());
    const authUser = store.getState().auth.currentUser;

    store.dispatch(
      setBookingDraft({
        businessId: business.id,
        businessName: business.name,
        businessAddress: business.address,
        serviceId: service ? service.id : '',
        serviceName: service ? service.name : '',
        price: service ? service.price : 0,
        durationMinutes: service ? service.durationMinutes : 60,
        customerName: authUser ? authUser.name : '',
        customerEmail: authUser ? authUser.email : '',
        customerPhone: authUser ? authUser.phone || '' : '',
      })
    );

    // If service was provided, proceed straight to Step 2 (Date & Slot)
    if (service) {
      store.dispatch(setBookingStep(2));
    } else {
      store.dispatch(setBookingStep(1));
    }
  },

  selectService(service) {
    store.dispatch(
      setBookingDraft({
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        durationMinutes: service.durationMinutes,
      })
    );
    store.dispatch(setBookingStep(2));
  },

  loadAvailableSlots(businessId, serviceId, date) {
    if (!date) return [];
    try {
      const slots = bookingRepository.getAvailableSlots(businessId, serviceId, date);
      store.dispatch(setAvailableSlots(slots));
      return slots;
    } catch (err) {
      console.error('[bookingController] Failed to load slots:', err);
      return [];
    }
  },

  selectDateAndSlot(date, timeSlot) {
    if (!date || !timeSlot) {
      store.dispatch(setBookingError('Please pick both an appointment date and an available time slot.'));
      return false;
    }
    store.dispatch(
      setBookingDraft({
        date,
        timeSlot,
      })
    );
    store.dispatch(setBookingStep(3)); // Proceed to Review & Customer Details
    return true;
  },

  updateCustomerDetails(details) {
    store.dispatch(setBookingDraft(details));
  },

  goToStep(stepNumber) {
    store.dispatch(setBookingStep(stepNumber));
  },

  confirmBooking() {
    const draft = store.getState().bookings.currentDraft;
    const authUser = store.getState().auth.currentUser;

    const validation = validationService.validateBookingInput({
      businessId: draft.businessId,
      serviceId: draft.serviceId,
      date: draft.date,
      timeSlot: draft.timeSlot,
      customerName: draft.customerName,
      customerEmail: draft.customerEmail,
    });

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      store.dispatch(setBookingError(firstError));
      return { success: false, errors: validation.errors };
    }

    store.dispatch(setBookingsLoading(true));

    try {
      const created = bookingRepository.create({
        customerId: authUser ? authUser.id : 'usr-cust-guest',
        customerName: draft.customerName,
        customerEmail: draft.customerEmail,
        customerPhone: draft.customerPhone,
        businessId: draft.businessId,
        businessName: draft.businessName,
        businessAddress: draft.businessAddress,
        serviceId: draft.serviceId,
        serviceName: draft.serviceName,
        price: draft.price,
        durationMinutes: draft.durationMinutes,
        date: draft.date,
        timeSlot: draft.timeSlot,
        specialRequests: draft.specialRequests,
      });

      store.dispatch(setLastConfirmedBooking(created));
      store.dispatch(addBookingToCustomerList(created));
      store.dispatch(setBookingStep(4)); // Step 4: Confirmation screen
      store.dispatch(setBookingsLoading(false));

      return { success: true, booking: created };
    } catch (err) {
      store.dispatch(setBookingError(err.message));
      return { success: false, error: err.message };
    }
  },

  loadCustomerBookings(customerId) {
    store.dispatch(setBookingsLoading(true));
    try {
      const list = bookingRepository.getByCustomerId(customerId);
      store.dispatch(setCustomerBookings(list));
      return list;
    } catch (err) {
      console.error('[bookingController] Failed to load bookings:', err);
      return [];
    }
  },

  cancelBooking(bookingId, reason = 'Cancelled by customer') {
    try {
      const updated = bookingRepository.cancelBooking(bookingId, reason);
      if (updated) {
        store.dispatch(updateBookingInCustomerList(updated));
        return { success: true, booking: updated };
      }
      return { success: false, error: 'Booking not found' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};
