/**
 * ProviderBookingsPage View
 * Comprehensive appointment management for service providers:
 * - Filter by status: All, Pending, Confirmed, Completed, Cancelled
 * - Confirm pending booking requests
 * - Reject/decline with reason
 * - Mark completed
 * - Instant state synchronization
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CalendarCheck, Filter } from 'lucide-react';
import { BookingCard } from '../components/BookingCard.jsx';
import { SubNavPill } from '../components/SubNavPill.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { providerController } from '../../controllers/providerController.js';
import {
  selectProviderBookings,
  selectProviderLoading,
} from '../../features/provider/providerSlice.js';

export const ProviderBookingsPage = () => {
  const bookings = useSelector(selectProviderBookings);
  const loading = useSelector(selectProviderLoading);

  const [statusFilter, setStatusFilter] = useState('all');

  const handleBookingStatusChange = (bookingId, status, reason = null) => {
    providerController.changeBookingStatus(bookingId, status, reason);
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Filter Rail */}
      <div className="bg-canvas border border-hairline p-5 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-ink leading-tight1 mb-1">
            Customer Bookings Queue ({filteredBookings.length})
          </h2>
          <p className="text-[13.5px] text-mute">
            Review incoming appointments, confirm requests, or update service status.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <SubNavPill
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          >
            All ({bookings.length})
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'pending'}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({bookings.filter((b) => b.status === 'pending').length})
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'confirmed'}
            onClick={() => setStatusFilter('confirmed')}
          >
            Confirmed ({bookings.filter((b) => b.status === 'confirmed').length})
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'completed'}
            onClick={() => setStatusFilter('completed')}
          >
            Completed ({bookings.filter((b) => b.status === 'completed').length})
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
          {filteredBookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              isProvider={true}
              onStatusChange={handleBookingStatusChange}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings in this status queue"
          description="There are currently no customer bookings corresponding to this filter."
        />
      )}
    </div>
  );
};

export default ProviderBookingsPage;
