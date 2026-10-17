/**
 * Booking Model
 * Domain entity for appointment bookings
 */

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export class Booking {
  constructor({
    id,
    customerId,
    customerName,
    customerEmail,
    customerPhone = '',
    businessId,
    businessName,
    businessAddress = '',
    serviceId,
    serviceName,
    price = 0,
    durationMinutes = 60,
    date, // YYYY-MM-DD
    timeSlot, // e.g. "10:00 AM"
    status = BOOKING_STATUS.CONFIRMED,
    specialRequests = '',
    createdAt = new Date().toISOString(),
    cancelledReason = null,
  }) {
    this.id = id;
    this.customerId = customerId;
    this.customerName = customerName;
    this.customerEmail = customerEmail;
    this.customerPhone = customerPhone;
    this.businessId = businessId;
    this.businessName = businessName;
    this.businessAddress = businessAddress;
    this.serviceId = serviceId;
    this.serviceName = serviceName;
    this.price = price;
    this.durationMinutes = durationMinutes;
    this.date = date;
    this.timeSlot = timeSlot;
    this.status = status;
    this.specialRequests = specialRequests;
    this.createdAt = createdAt;
    this.cancelledReason = cancelledReason;
  }
}
