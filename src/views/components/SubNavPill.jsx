/**
 * SubNavPill Component strictly matching DESIGN-renault.md:
 * Pill chip (rounded-pill 46px) used for category filters and sub-navigation rows.
 * Active state swaps to black background with white text.
 */

import React from 'react';

export const SubNavPill = ({
  children,
  active = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 h-[36px] md:h-[38px] px-4 md:px-5 rounded-pill text-[13px] font-bold tracking-btnSm transition-all duration-150 cursor-pointer whitespace-nowrap select-none border ${
        active
          ? 'bg-surface-dark text-on-dark border-surface-dark shadow-sm'
          : 'bg-canvas text-ink border-hairline-strong hover:bg-surface-soft active:bg-hairline'
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className={`w-3.5 h-3.5 ${active ? 'text-primary' : 'text-charcoal'}`} />}
      <span>{children}</span>
    </button>
  );
};

export default SubNavPill;
