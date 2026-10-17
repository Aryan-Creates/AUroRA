/**
 * PromoTile Component strictly matching DESIGN-renault.md:
 * 2-up promo grid tiles with square corners (rounded-none), 32px padding,
 * and high-contrast color blocking:
 * - promo-tile-light (White canvas)
 * - promo-tile-dark (Black canvas)
 * - promo-tile-yellow (Sunlight Yellow accent moment)
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button.jsx';

export const PromoTile = ({
  variant = 'light', // 'light', 'dark', 'yellow'
  tag,
  title,
  subtitle,
  ctaText,
  onCtaClick,
  image,
  className = '',
}) => {
  let containerStyles = 'relative p-6 sm:p-8 md:p-8 rounded-none flex flex-col justify-between overflow-hidden min-h-[260px] md:min-h-[300px] border ';
  let titleStyles = 'font-bold text-[22px] md:text-[24px] leading-tight1 mb-2.5 ';
  let textStyles = 'text-[15px] leading-relaxed mb-6 ';
  let btnVariant = 'secondary-dark';

  switch (variant) {
    case 'dark':
      containerStyles += 'bg-surface-dark text-on-dark border-transparent';
      titleStyles += 'text-on-dark';
      textStyles += 'text-on-dark-mute';
      btnVariant = 'primary';
      break;
    case 'yellow':
      containerStyles += 'bg-primary text-on-primary border-primary';
      titleStyles += 'text-on-primary';
      textStyles += 'text-charcoal';
      btnVariant = 'secondary-dark';
      break;
    case 'light':
    default:
      containerStyles += 'bg-canvas text-ink border-hairline-strong';
      titleStyles += 'text-ink';
      textStyles += 'text-mute';
      btnVariant = 'outline-dark';
      break;
  }

  return (
    <div className={`${containerStyles} ${className}`}>
      {/* Background imagery accent if provided */}
      {image && (
        <div className="absolute right-0 bottom-0 top-0 w-2/5 md:w-1/2 opacity-25 pointer-events-none mix-blend-multiply overflow-hidden">
          <img src={image} alt="" className="w-full h-full object-cover rounded-none" />
        </div>
      )}

      <div className="relative z-10 max-w-[85%]">
        {tag && (
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider mb-3 px-2 py-0.5 rounded-none bg-black/10 text-current">
            {tag}
          </span>
        )}
        <h3 className={titleStyles}>{title}</h3>
        {subtitle && <p className={textStyles}>{subtitle}</p>}
      </div>

      <div className="relative z-10 pt-2">
        {ctaText && (
          <Button variant={btnVariant} size="sm" onClick={onCtaClick}>
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PromoTile;
