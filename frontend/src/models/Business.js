/**
 * Business Model
 * Domain representation of local service provider businesses
 */

export const BUSINESS_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected',
};

export class Business {
  constructor({
    id,
    providerId,
    name,
    slug,
    category,
    tagline = '',
    description = '',
    address = '',
    city = '',
    postalCode = '',
    phone = '',
    email = '',
    website = '',
    rating = 4.8,
    reviewCount = 0,
    images = [],
    coverImage = '',
    openingHours = {},
    status = BUSINESS_STATUS.APPROVED,
    isFeatured = false,
    isVerified = true,
    badges = [],
    amenities = [],
    createdAt = new Date().toISOString(),
  }) {
    this.id = id;
    this.providerId = providerId;
    this.name = name;
    this.slug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    this.category = category;
    this.tagline = tagline;
    this.description = description;
    this.address = address;
    this.city = city;
    this.postalCode = postalCode;
    this.phone = phone;
    this.email = email;
    this.website = website;
    this.rating = rating;
    this.reviewCount = reviewCount;
    this.images = images.length > 0 ? images : [coverImage];
    this.coverImage = coverImage || (images[0] || '');
    this.openingHours = openingHours;
    this.status = status;
    this.isFeatured = isFeatured;
    this.isVerified = isVerified;
    this.badges = badges;
    this.amenities = amenities;
    this.createdAt = createdAt;
  }
}
