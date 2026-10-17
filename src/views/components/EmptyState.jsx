/**
 * EmptyState Component
 * Clean, meaningful empty state representation for search with zero matches,
 * empty booking queues, or missing items.
 */

import React from 'react';
import { SearchX, CalendarX, Sparkles, Inbox } from 'lucide-react';
import { Button } from './Button.jsx';

export const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No results found',
  description = 'Try adjusting your search criteria, clearing filters, or browsing other service categories.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`w-full py-16 px-6 text-center bg-surface-soft border border-hairline flex flex-col items-center justify-center rounded-none ${className}`}
    >
      <div className="w-14 h-14 rounded-xs border border-hairline-strong bg-canvas flex items-center justify-center text-ink mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-[20px] font-bold text-ink leading-tight1 mb-2">{title}</h3>
      <p className="text-[14.5px] text-mute max-w-md leading-relaxed mb-6">{description}</p>

      {actionLabel && onAction && (
        <Button variant="outline-dark" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
