/**
 * Badge Component matching DESIGN-renault.md badge specifications
 * - badge-new: Sunlight Yellow (#ffed00), rounded-full, text black, uppercase
 * - status variants: approved (success), pending (warning), cancelled (error), verified
 */

import React from 'react';

export const Badge = ({
  children,
  variant = 'new', // 'new', 'verified', 'success', 'warning', 'error', 'neutral'
  className = '',
}) => {
  let style = '';

  switch (variant) {
    case 'new':
      style = 'bg-primary text-on-primary font-bold text-[13px] px-3.5 py-1 rounded-full uppercase tracking-btnSm';
      break;
    case 'verified':
      style = 'bg-surface-dark text-on-dark font-bold text-[12px] px-3 py-0.5 rounded-full uppercase tracking-wider';
      break;
    case 'success':
    case 'approved':
    case 'confirmed':
    case 'completed':
      style = 'bg-[#eef7ec] text-[#2c6e18] border border-[#8dc572] font-bold text-[12px] px-2.5 py-0.5 rounded-xs uppercase tracking-wider';
      break;
    case 'warning':
    case 'pending':
      style = 'bg-[#fff8ee] text-[#a06209] border border-[#f0ad4e] font-bold text-[12px] px-2.5 py-0.5 rounded-xs uppercase tracking-wider';
      break;
    case 'error':
    case 'cancelled':
    case 'rejected':
      style = 'bg-[#fdf2f2] text-[#9b2c2c] border border-[#be6464] font-bold text-[12px] px-2.5 py-0.5 rounded-xs uppercase tracking-wider';
      break;
    case 'neutral':
    default:
      style = 'bg-surface-soft text-charcoal border border-hairline-strong/20 font-medium text-[12px] px-2.5 py-0.5 rounded-xs';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1 leading-none select-none ${style} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
