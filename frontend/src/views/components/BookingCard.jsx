/**
 * BookingCard Component
 * Displays scheduled customer appointments and provider bookings with status badges and lifecycle controls.
 */

import React from 'react';
import { Calendar, Clock, MapPin, AlertCircle, XCircle, CheckCircle } from 'lucide-react';
import { Badge } from './Badge.jsx';
import { Button } from './Button.jsx';

export const BookingCard = ({
  booking,
  onCancel,
  onStatusChange,
  isProvider = false,
  className = '',
}) => {
  const {
    id,
    businessName,
    businessAddress,
    serviceName,
    date,
    timeSlot,
    price,
    status,
    customerName,
    customerEmail,
    customerPhone,
    specialRequests,
    cancelledReason,
  } = booking;

  const isCancellable = status === 'confirmed' || status === 'pending';

  return (
    <div
      className={`bg-canvas rounded-none border border-hairline hover:border-hairline-strong transition-all p-5 md:p-6 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header row: Reference ID & Status */}
        <div className="flex items-center justify-between gap-3 mb-3 border-b border-hairline pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-mute">
              REF #{id}
            </span>
          </div>
          <Badge variant={status}>{status}</Badge>
        </div>

        {/* Core details */}
        <div className="mb-4">
          <h4 className="text-[20px] font-bold text-ink leading-tight1 mb-1">
            {isProvider ? serviceName : businessName}
          </h4>
          <p className="text-[14px] text-mute font-medium">
            {isProvider ? `Customer: ${customerName} (${customerEmail})` : serviceName}
          </p>
        </div>

        {/* Timing & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[13.5px] text-charcoal mb-4 bg-surface-soft p-3 rounded-none">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-ink flex-shrink-0" />
            <span className="font-semibold">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ink flex-shrink-0" />
            <span className="font-semibold">{timeSlot}</span>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <MapPin className="w-4 h-4 text-ink flex-shrink-0" />
            <span className="truncate">{businessAddress || 'Confirmed location'}</span>
          </div>
        </div>

        {specialRequests && (
          <p className="text-[12.5px] text-mute italic mb-4 bg-[#fffdf0] border-l-2 border-primary p-2">
            "{specialRequests}"
          </p>
        )}

        {status === 'cancelled' && cancelledReason && (
          <p className="text-[12.5px] text-error mb-4 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Reason: {cancelledReason}</span>
          </p>
        )}
      </div>

      {/* Footer row: Total price and contextual action */}
      <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-mute block">Total</span>
          <span className="text-[18px] font-bold text-ink">₹{price}</span>
        </div>

        <div className="flex items-center gap-2">
          {isProvider ? (
            <>
              {status === 'pending' && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onStatusChange(id, 'confirmed')}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => onStatusChange(id, 'cancelled', 'Declined by provider')}
                  >
                    Decline
                  </Button>
                </>
              )}
              {status === 'confirmed' && (
                <Button
                  variant="secondary-dark"
                  size="sm"
                  onClick={() => onStatusChange(id, 'completed')}
                >
                  Mark Completed
                </Button>
              )}
            </>
          ) : (
            <>
              {isCancellable && onCancel && (
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => onCancel(id)}
                  className="text-error border-error/50 hover:bg-error/10"
                >
                  Cancel Booking
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
