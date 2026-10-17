/**
 * BusinessDetailPage View
 * Displays complete business profile: gallery, description, amenities,
 * operating hours, full service catalogue, reviews, and booking initiation.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  CheckCircle2,
  Calendar,
  Share2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard.jsx';
import { Button } from '../components/Button.jsx';
import { Badge } from '../components/Badge.jsx';
import { Modal } from '../components/Modal.jsx';
import { businessController } from '../../controllers/businessController.js';
import { bookingController } from '../../controllers/bookingController.js';
import {
  selectSelectedBusiness,
  selectSelectedBusinessServices,
  selectSelectedBusinessReviews,
  selectBusinessLoading,
} from '../../features/businesses/businessSlice.js';

export const BusinessDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const business = useSelector(selectSelectedBusiness);
  const services = useSelector(selectSelectedBusinessServices);
  const reviews = useSelector(selectSelectedBusinessReviews);
  const loading = useSelector(selectBusinessLoading);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (id) {
      businessController.loadBusinessDetails(id);
    }
  }, [id]);

  const handleStartBooking = (service = null) => {
    if (!business) return;
    bookingController.initializeBookingWizard(business, service);
    navigate(`/book/${business.id}`);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || newComment.length < 5) {
      setReviewError('Please write at least 5 characters for your review.');
      return;
    }

    const res = businessController.addReview(business.id, {
      rating: newRating,
      comment: newComment,
    });

    if (res.success) {
      setNewComment('');
      setReviewModalOpen(false);
      setReviewError('');
    } else {
      setReviewError(res.error || 'Failed to submit review');
    }
  };

  if (loading || !business) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center bg-canvas">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-[14px] text-mute font-medium">Loading business details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 bg-canvas pb-20">
      {/* 1. Header Banner & Business Identity */}
      <section className="w-full bg-surface-dark text-on-dark py-12 px-4 sm:px-6 md:px-8 border-b border-divider-dark">
        <div className="max-w-content mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {business.category}
                </span>
                {business.isVerified && (
                  <Badge variant="verified">Verified Establishment</Badge>
                )}
              </div>

              <h1 className="text-[34px] sm:text-[42px] md:text-[46px] font-bold text-on-dark leading-tight1 mb-3">
                {business.name}
              </h1>

              <p className="text-[17px] text-on-dark-mute max-w-2xl font-normal leading-relaxed mb-4">
                {business.tagline || business.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[13.5px] text-on-dark-mute">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span>{business.rating.toFixed(1)}</span>
                  <span className="text-on-dark-mute font-normal">({business.reviewCount} customer reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{business.address}, {business.city}</span>
                </div>
              </div>
            </div>

            {/* Top Action Box */}
            <div className="flex items-center gap-3 self-start md:self-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleStartBooking(services[0] || null)}
              >
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>Book Appointment</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Photo Gallery (Square photography strictly matching DESIGN-renault.md) */}
      <section className="w-full bg-surface-soft border-b border-hairline py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {business.images.map((imgUrl, idx) => (
              <div key={idx} className="relative aspect-[16/10] overflow-hidden bg-canvas border border-hairline">
                <img
                  src={imgUrl}
                  alt={`${business.name} photograph ${idx + 1}`}
                  className="w-full h-full object-cover rounded-none transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Information & Service Catalogue Grid */}
      <section className="max-w-content mx-auto px-4 sm:px-6 md:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column: Services Catalogue & Reviews */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            {/* Service Catalogue */}
            <div>
              <div className="flex items-end justify-between mb-6 pb-2 border-b border-hairline">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
                    Available Treatments &amp; Offerings
                  </span>
                  <h2 className="text-[26px] md:text-[30px] font-bold text-ink leading-tight1">
                    Services Catalogue ({services.length})
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {services.map((srv) => (
                  <ServiceCard
                    key={srv.id}
                    service={srv}
                    onBook={() => handleStartBooking(srv)}
                  />
                ))}
              </div>
            </div>

            {/* About & Amenities */}
            <div className="border-t border-hairline pt-10">
              <h3 className="text-[22px] font-bold text-ink leading-tight1 mb-4">
                About The Establishment
              </h3>
              <p className="text-[15.5px] text-body leading-relaxed mb-6">
                {business.description}
              </p>

              {business.amenities?.length > 0 && (
                <div>
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-charcoal mb-3">
                    Facility Amenities
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {business.amenities.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 bg-surface-soft border border-hairline rounded-none text-[13.5px] font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-ink flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customer Reviews Section */}
            <div className="border-t border-hairline pt-10">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-hairline">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
                    Verified Feedback
                  </span>
                  <h3 className="text-[24px] font-bold text-ink leading-tight1">
                    Customer Reviews
                  </h3>
                </div>
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => setReviewModalOpen(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  <span>Write Review</span>
                </Button>
              </div>

              {reviews.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 bg-surface-soft border border-hairline rounded-none flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[14px] text-ink">{rev.customerName}</span>
                        <div className="flex items-center gap-1 text-[13px] font-bold">
                          <Star className="w-3.5 h-3.5 fill-primary text-black" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-[14px] text-charcoal leading-relaxed">{rev.comment}</p>
                      <span className="text-[11px] text-mute">{rev.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-mute">No reviews yet for this business.</p>
              )}
            </div>
          </div>

          {/* Sidebar Column: Hours, Contact, & Instant Booking Card */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Sticky Action Card */}
            <div className="bg-canvas border border-hairline-strong p-6 rounded-none shadow-sm sticky top-[80px]">
              <h4 className="text-[18px] font-bold text-ink leading-tight1 mb-3">
                Ready For Your Visit?
              </h4>
              <p className="text-[14px] text-mute mb-5 leading-snug">
                Select from verified openings and lock your preferred practitioner slot instantly.
              </p>

              <Button
                variant="primary"
                size="md"
                className="w-full mb-6"
                onClick={() => handleStartBooking(services[0] || null)}
              >
                <span>Book With This Provider</span>
              </Button>

              {/* Contact Information */}
              <div className="border-t border-hairline pt-5 mb-5 flex flex-col gap-3 text-[13.5px]">
                {business.phone && (
                  <div className="flex items-center gap-2.5 text-charcoal">
                    <Phone className="w-4 h-4 text-mute flex-shrink-0" />
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center gap-2.5 text-charcoal">
                    <Mail className="w-4 h-4 text-mute flex-shrink-0" />
                    <span>{business.email}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center gap-2.5 text-charcoal">
                    <Globe className="w-4 h-4 text-mute flex-shrink-0" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noreferrer"
                      className="underline truncate"
                    >
                      {business.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Operating Hours Grid */}
              <div className="border-t border-hairline pt-5">
                <div className="flex items-center gap-2 mb-3 text-[12px] font-bold uppercase tracking-wider text-charcoal">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Business Hours</span>
                </div>

                <div className="flex flex-col gap-2 text-[13px]">
                  {Object.entries(business.openingHours || {}).map(([day, hours]) => (
                    <div key={day} className="flex justify-between py-0.5 border-b border-hairline">
                      <span className="text-mute">{day}</span>
                      <span className="font-semibold text-ink">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Submission Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Share Your Experience"
        subtitle={`Leave honest client feedback for ${business.name}`}
      >
        <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider text-charcoal block mb-1.5">
              Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newRating ? 'fill-primary text-black' : 'text-stone'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider text-charcoal block mb-1.5">
              Your Review
            </label>
            <textarea
              rows={4}
              placeholder="Describe the atmosphere, technician quality, and results..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-canvas text-ink text-[15px] p-3 border border-hairline-strong rounded-none outline-none focus:ring-1 focus:ring-ink"
            />
          </div>

          {reviewError && <p className="text-error text-[13px] font-medium">{reviewError}</p>}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-hairline">
            <Button
              variant="outline-dark"
              size="sm"
              onClick={() => setReviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BusinessDetailPage;
