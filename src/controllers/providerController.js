/**
 * Provider Controller
 * Coordinates service provider workflows: services CRUD, booking approvals,
 * availability schedules, and business profile updates.
 */

import { store } from '../app/store.js';
import { businessRepository } from '../repositories/businessRepository.js';
import { serviceRepository } from '../repositories/serviceRepository.js';
import { bookingRepository } from '../repositories/bookingRepository.js';
import { validationService } from '../services/validationService.js';
import {
  setProviderLoading,
  setProviderError,
  setProviderBusiness,
  setProviderServices,
  addProviderService,
  updateProviderService,
  removeProviderService,
  setProviderBookings,
  updateProviderBookingStatus,
  updateProviderOpeningHours,
} from '../features/provider/providerSlice.js';
import { updateBusinessLocally } from '../features/businesses/businessSlice.js';

export const providerController = {
  loadProviderData(providerId) {
    store.dispatch(setProviderLoading(true));
    try {
      // Find business associated with this provider
      let business = businessRepository.getByProviderId(providerId);
      if (!business) {
        // Fallback to first business for quick provider demo
        const all = businessRepository.getAll();
        business = all[0];
      }

      const services = serviceRepository.getByBusinessId(business.id);
      const bookings = bookingRepository.getByBusinessId(business.id);

      store.dispatch(setProviderBusiness(business));
      store.dispatch(setProviderServices(services));
      store.dispatch(setProviderBookings(bookings));
      store.dispatch(setProviderLoading(false));

      return { success: true, business, services, bookings };
    } catch (err) {
      store.dispatch(setProviderError(err.message));
      return { success: false, error: err.message };
    }
  },

  updateBusinessProfile(businessId, updates) {
    const validation = validationService.validateBusinessProfileInput(updates);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      return { success: false, error: firstError, errors: validation.errors };
    }

    try {
      const updated = businessRepository.update(businessId, updates);
      if (updated) {
        store.dispatch(setProviderBusiness(updated));
        store.dispatch(updateBusinessLocally(updated));
        return { success: true, business: updated };
      }
      return { success: false, error: 'Business not found' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  createService(businessId, serviceData) {
    const validation = validationService.validateServiceInput(serviceData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      return { success: false, error: firstError, errors: validation.errors };
    }

    try {
      const created = serviceRepository.create({
        ...serviceData,
        businessId,
      });
      store.dispatch(addProviderService(created));
      return { success: true, service: created };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  updateService(serviceId, updates) {
    const validation = validationService.validateServiceInput(updates);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      return { success: false, error: firstError, errors: validation.errors };
    }

    try {
      const updated = serviceRepository.update(serviceId, updates);
      if (updated) {
        store.dispatch(updateProviderService(updated));
        return { success: true, service: updated };
      }
      return { success: false, error: 'Service not found' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  deleteService(serviceId) {
    try {
      const ok = serviceRepository.delete(serviceId);
      if (ok) {
        store.dispatch(removeProviderService(serviceId));
        return { success: true };
      }
      return { success: false, error: 'Failed to delete service' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  updateOperatingHours(businessId, openingHours) {
    try {
      const updated = businessRepository.updateOpeningHours(businessId, openingHours);
      if (updated) {
        store.dispatch(updateProviderOpeningHours(openingHours));
        return { success: true, openingHours };
      }
      return { success: false, error: 'Failed to update hours' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  changeBookingStatus(bookingId, status, reason = null) {
    try {
      const updated = bookingRepository.updateStatus(bookingId, status, reason);
      if (updated) {
        store.dispatch(updateProviderBookingStatus({ id: bookingId, status, reason }));
        return { success: true, booking: updated };
      }
      return { success: false, error: 'Booking not found' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};
