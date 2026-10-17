/**
 * CustomerBookingsPage View
 * Comprehensive booking management for customers:
 * - Status filter tabs: All, Upcoming, Completed, Cancelled
 * - Cancellation lifecycle action with reason feedback
 * - Direct appointment card display
 */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Calendar, Filter, Sparkles } from 'lucide-react';
import { BookingCard } from '../components/BookingCard.jsx';
import { Button } from '../components/Button.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { SubNavPill } from '../components/SubNavPill.jsx';
import { bookingController } from '../../controllers/bookingController.js';
import { selectCurrentUser } from '../../features/auth/authSlice.js';
import {
  selectCustomerBookings,
  selectBookingLoading,
} from '../../features/bookings/bookingSlice.js';

export const CustomerBookingsPage = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const bookings = useSelector(selectCustomerBookings);
  const loading = useSelector(selectBookingLoading);

  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (currentUser?.id) {
      bookingController.loadCustomerBookings(currentUser.id);
    }
  }, [currentUser]);

  const handleCancelBooking = (bookingId) => {
    const reason = window.prompt(
      'Please indicate the reason for cancelling this appointment (optional):',
      'Schedule conflict'
    );
    if (reason !== null) {
      bookingController.cancelBooking(bookingId, reason || 'Customer requested cancellation');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (statusFilter === 'completed') return b.status === 'completed';
    if (statusFilter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Controls Bar */}
      <div className="bg-canvas border border-hairline p-5 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-ink leading-tight1 mb-1">
            My Appointments ({filteredBookings.length})
          </h2>
          <p className="text-[13.5px] text-mute">
            Review your upcoming services or cancel active reservations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <SubNavPill
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          >
            All ({bookings.length})
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'upcoming'}
            onClick={() => setStatusFilter('upcoming')}
          >
            Upcoming (
            {
              bookings.filter(
                (b) => b.status === 'confirmed' || b.status === 'pending'
              ).length
            }
            )
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'completed'}
            onClick={() => setStatusFilter('completed')}
          >
            Past ({bookings.filter((b) => b.status === 'completed').length})
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'cancelled'}
            onClick={() => setStatusFilter('cancelled')}
          >
            Cancelled ({bookings.filter((b) => b.status === 'cancelled').length})
          </SubNavPill>
        </div>
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelBooking}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No bookings in this category"
          description="You do not currently have any appointments matching this filter status."
          actionLabel="Browse Available Services"
          onAction={() => navigate('/discover')}
        />
      )}
    </div>
  );
};

export default CustomerBookingsPage;
