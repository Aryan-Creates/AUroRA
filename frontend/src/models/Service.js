/**
 * Service Model
 * Represents a service offering provided by a business
 */

export class Service {
  constructor({
    id,
    businessId,
    name,
    category,
    description = '',
    durationMinutes = 60,
    price = 0,
    currency = '₹',
    isPopular = false,
    availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    bufferMinutes = 15,
  }) {
    this.id = id;
    this.businessId = businessId;
    this.name = name;
    this.category = category;
    this.description = description;
    this.durationMinutes = durationMinutes;
    this.price = price;
    this.currency = currency;
    this.isPopular = isPopular;
    this.availableDays = availableDays;
    this.bufferMinutes = bufferMinutes;
  }

  getFormattedPrice() {
    return `${this.currency}${this.price.toFixed(2)}`;
  }

  getFormattedDuration() {
    if (this.durationMinutes >= 60) {
      const hours = Math.floor(this.durationMinutes / 60);
      const mins = this.durationMinutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${this.durationMinutes} mins`;
  }
}
