/**
 * Validation Service
 * Domain validation helpers for forms, booking inputs, and user registration.
 */

export const validationService = {
  isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  },

  isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    // Allow phone numbers with standard international/local formatting
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    return cleaned.length >= 7 && cleaned.length <= 15;
  },

  isFutureOrTodayDate(dateString) {
    if (!dateString) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateString >= today;
  },

  validateBookingInput({ businessId, serviceId, date, timeSlot, customerName, customerEmail }) {
    const errors = {};
    if (!businessId) errors.businessId = 'Please select a business';
    if (!serviceId) errors.serviceId = 'Please select a service';
    if (!date) {
      errors.date = 'Please select an appointment date';
    } else if (!this.isFutureOrTodayDate(date)) {
      errors.date = 'Appointment date cannot be in the past';
    }
    if (!timeSlot) errors.timeSlot = 'Please select an available time slot';
    if (!customerName || customerName.trim().length < 2) {
      errors.customerName = 'Please enter your full name';
    }
    if (!this.isValidEmail(customerEmail)) {
      errors.customerEmail = 'Please provide a valid email address';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  validateServiceInput({ name, price, durationMinutes, category }) {
    const errors = {};
    if (!name || name.trim().length < 3) {
      errors.name = 'Service name must be at least 3 characters';
    }
    if (price === undefined || price === null || isNaN(price) || Number(price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    if (!durationMinutes || isNaN(durationMinutes) || Number(durationMinutes) < 15) {
      errors.durationMinutes = 'Duration must be at least 15 minutes';
    }
    if (!category || category.trim().length === 0) {
      errors.category = 'Category is required';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  validateBusinessProfileInput({ name, category, phone, email, address, city }) {
    const errors = {};
    if (!name || name.trim().length < 2) errors.name = 'Business name is required';
    if (!category) errors.category = 'Service category is required';
    if (email && !this.isValidEmail(email)) errors.email = 'Valid business email is required';
    if (!phone || phone.trim().length < 7) errors.phone = 'Business contact number is required';
    if (!address || address.trim().length < 3) errors.address = 'Street address is required';
    if (!city || city.trim().length < 2) errors.city = 'City is required';
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
