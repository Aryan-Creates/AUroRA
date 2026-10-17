/**
 * Category, Review, Notification, and Report models
 */

export class Category {
  constructor({ id, slug, name, description, icon, image, serviceCount = 0 }) {
    this.id = id;
    this.slug = slug;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.image = image;
    this.serviceCount = serviceCount;
  }
}

export class Review {
  constructor({
    id,
    businessId,
    customerId,
    customerName,
    rating = 5,
    comment,
    date = new Date().toISOString().split('T')[0],
  }) {
    this.id = id;
    this.businessId = businessId;
    this.customerId = customerId;
    this.customerName = customerName;
    this.rating = rating;
    this.comment = comment;
    this.date = date;
  }
}

export class Notification {
  constructor({
    id,
    userId,
    title,
    message,
    type = 'info', // 'info', 'success', 'warning', 'booking'
    isRead = false,
    createdAt = new Date().toISOString(),
    link = '',
  }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.message = message;
    this.type = type;
    this.isRead = isRead;
    this.createdAt = createdAt;
    this.link = link;
  }
}

export class Report {
  constructor({
    id,
    businessId,
    businessName,
    reportedBy,
    reporterEmail,
    reason,
    details = '',
    status = 'pending', // 'pending', 'resolved', 'dismissed'
    createdAt = new Date().toISOString(),
  }) {
    this.id = id;
    this.businessId = businessId;
    this.businessName = businessName;
    this.reportedBy = reportedBy;
    this.reporterEmail = reporterEmail;
    this.reason = reason;
    this.details = details;
    this.status = status;
    this.createdAt = createdAt;
  }
}
