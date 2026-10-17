/**
 * CustomerDashboardPage View
 * Customer overview showing upcoming appointments, metrics, recent activity,
 * and quick discovery actions.
 */

import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Scissors,
} from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { BookingCard } from '../components/BookingCard.jsx';
import { bookingController } from '../../controllers/bookingController.js';
import { selectCurrentUser } from '../../features/auth/authSlice.js';
import {
  selectCustomerBookings,
  selectBookingLoading,
} from '../../features/bookings/bookingSlice.js';

export const CustomerDashboardPage = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const bookings = useSelector(selectCustomerBookings);
  const loading = useSelector(selectBookingLoading);

  useEffect(() => {
    if (currentUser?.id) {
      bookingController.loadCustomerBookings(currentUser.id);
    }
  }, [currentUser]);

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  );
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const nextAppointment = upcomingBookings[0] || null;

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you wish to cancel this scheduled appointment?')) {
      bookingController.cancelBooking(bookingId, 'Cancelled by customer from dashboard');
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="bg-canvas border border-hairline-strong p-6 md:p-8 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
            Account Dashboard
          </span>
          <h2 className="text-[28px] md:text-[32px] font-bold text-ink leading-tight1 mb-2">
            Welcome back, {currentUser?.name || 'Guest'}
          </h2>
          <p className="text-[14.5px] text-mute max-w-xl">
            Track your appointment schedule, review confirmed practitioner slots, or explore new service listings.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => navigate('/discover')}>
          <Sparkles className="w-4 h-4 mr-1.5" />
          <span>Book New Service</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-canvas border border-hairline p-5 rounded-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
            Upcoming Bookings
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-ink leading-none">
              {upcomingBookings.length}
            </span>
            <span className="text-[12px] text-mute">Active</span>
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-5 rounded-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
            Completed Visits
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-ink leading-none">
              {completedBookings.length}
            </span>
            <span className="text-[12px] text-mute">Lifetime</span>
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-5 rounded-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
            Membership Status
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-bold text-primary-deep leading-none">
              VIP Tier
            </span>
            <span className="text-[12px] text-mute">Verified</span>
          </div>
        </div>
      </div>

      {/* Next Upcoming Appointment Highlight */}
      {nextAppointment && (
        <div className="bg-surface-dark text-on-dark p-6 md:p-8 rounded-none border border-divider-dark">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary text-black font-bold text-[11px] uppercase tracking-wider rounded-none mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>Next Scheduled Appointment</span>
              </div>
              <h3 className="text-[24px] md:text-[28px] font-bold text-white leading-tight1 mb-1">
                {nextAppointment.serviceName}
              </h3>
              <p className="text-[15px] text-on-dark-mute mb-4">
                At <strong>{nextAppointment.businessName}</strong> ({nextAppointment.businessAddress})
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[14px] text-white">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <strong>{nextAppointment.date}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <strong>{nextAppointment.timeSlot}</strong>
                </span>
                <span>•</span>
                <span className="font-bold text-primary">${nextAppointment.price}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => handleCancel(nextAppointment.id)}
              >
                Cancel Appointment
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/customer/bookings')}
              >
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings Queue */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-bold text-ink leading-tight1">
            Recent Activity ({bookings.length})
          </h3>
          <Link
            to="/customer/bookings"
            className="text-[13px] font-bold text-ink underline hover:text-charcoal"
          >
            View All Bookings
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.slice(0, 4).map((b) => (
              <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-canvas border border-hairline text-mute text-[14px]">
            No booking activity recorded yet. Explore our directory to schedule your first visit.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
