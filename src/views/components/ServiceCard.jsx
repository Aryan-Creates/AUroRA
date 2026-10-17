/**
 * ServiceCard Component
 * Displays a specific service offering with duration, price, and instant booking trigger.
 */

import React from 'react';
import { Clock, Check } from 'lucide-react';
import { Button } from './Button.jsx';

export const ServiceCard = ({
  service,
  onBook,
  onEdit,
  onDelete,
  isProviderView = false,
  className = '',
}) => {
  const { name, category, description, durationMinutes, price, currency = '$', isPopular } = service;

  const formattedDuration =
    durationMinutes >= 60
      ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60 > 0 ? (durationMinutes % 60) + 'm' : ''}`
      : `${durationMinutes}m`;

  return (
    <div
      className={`bg-canvas rounded-none border border-hairline hover:border-hairline-strong transition-all duration-150 p-5 flex flex-col justify-between ${
        isPopular ? 'border-t-2 border-t-primary' : ''
      } ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            {category && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
                {category}
              </span>
            )}
            <h4 className="text-[18px] font-bold text-ink leading-tight1">{name}</h4>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-[20px] font-bold text-ink leading-none">
              {currency}{price}
            </span>
          </div>
        </div>

        <p className="text-[14px] text-mute line-clamp-3 leading-relaxed mb-4">{description}</p>

        <div className="flex items-center gap-4 text-[13px] text-charcoal mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-mute" />
            <span>{formattedDuration}</span>
          </div>
          {isPopular && (
            <span className="text-[11px] font-bold uppercase px-2 py-0.5 bg-primary/20 text-ink rounded-none">
              Popular Choice
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2">
        {isProviderView ? (
          <div className="flex items-center gap-2 w-full justify-end">
            <Button variant="outline-dark" size="sm" onClick={() => onEdit(service)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(service.id)}>
              Delete
            </Button>
          </div>
        ) : (
          <Button variant="primary" size="sm" className="w-full" onClick={() => onBook(service)}>
            Book Appointment
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
