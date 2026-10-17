/**
 * ProviderDashboardPage View
 * Overview for service providers:
 * - Real derived metrics (Total bookings, Upcoming, Pending requests, Completed, Revenue)
 * - Quick operational action buttons
 * - Pending incoming requests requiring action
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  CalendarCheck,
  Clock,
  DollarSign,
  AlertCircle,
  Plus,
  Scissors,
  CheckCircle2,
  Store,
} from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { BookingCard } from '../components/BookingCard.jsx';
import { providerController } from '../../controllers/providerController.js';
import { selectCurrentUser } from '../../features/auth/authSlice.js';
import {
  selectProviderBusiness,
  selectProviderBookings,
  selectProviderMetrics,
  selectProviderLoading,
} from '../../features/provider/providerSlice.js';

export const ProviderDashboardPage = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const business = useSelector(selectProviderBusiness);
  const bookings = useSelector(selectProviderBookings);
  const metrics = useSelector(selectProviderMetrics);
  const loading = useSelector(selectProviderLoading);

  useEffect(() => {
    if (currentUser?.id) {
      providerController.loadProviderData(currentUser.id);
    }
  }, [currentUser]);

  const handleBookingStatusChange = (bookingId, status, reason = null) => {
    providerController.changeBookingStatus(bookingId, status, reason);
  };

  const pendingBookings = bookings.filter((b) => b.status === 'pending');

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header Info */}
      <div className="bg-canvas border border-hairline-strong p-6 md:p-8 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
            Provider Operational Workspace
          </span>
          <h2 className="text-[28px] md:text-[32px] font-bold text-ink leading-tight1 mb-2">
            {business?.name || 'My Establishment'}
          </h2>
          <p className="text-[14.5px] text-mute max-w-xl">
            Manage your schedule, confirm pending customer reservations, and configure your service offerings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => navigate('/provider/availability')}
          >
            <Clock className="w-4 h-4 mr-1.5" />
            <span>Update Hours</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/provider/services')}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add Service</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards Grid (Derived from underlying state) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-canvas border border-hairline p-5 rounded-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
            Pending Requests
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#a06209] leading-none">
              {metrics.pending}
            </span>
            <span className="text-[12px] text-mute">Action needed</span>
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-5 rounded-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
            Upcoming Bookings
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-ink leading-none">
              {metrics.upcoming}
            </span>
            <span className="text-[12px] text-mute">Confirmed</span>
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-5 rounded-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
            Completed Visits
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-ink leading-none">
              {metrics.completed}
            </span>
            <span className="text-[12px] text-mute">Satisfied</span>
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-5 rounded-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
            Total Revenue
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-ink leading-none">
              ₹{metrics.totalRevenue}
            </span>
            <span className="text-[12px] text-mute">Gross</span>
          </div>
        </div>
      </div>

      {/* Pending Booking Requests Alert Section */}
      {pendingBookings.length > 0 && (
        <div className="bg-[#fffdf0] border border-primary p-6 rounded-none">
          <div className="flex items-center gap-2 text-[#8c7400] font-bold text-[14px] uppercase tracking-wider mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Pending Action: {pendingBookings.length} Inbound Requests</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                isProvider={true}
                onStatusChange={handleBookingStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Recent Inbound Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-bold text-ink leading-tight1">
            Recent Appointments Queue ({bookings.length})
          </h3>
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => navigate('/provider/bookings')}
          >
            <span>Manage All Bookings</span>
          </Button>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.slice(0, 4).map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                isProvider={true}
                onStatusChange={handleBookingStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-canvas border border-hairline text-mute text-[14px]">
            No appointments scheduled yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboardPage;
