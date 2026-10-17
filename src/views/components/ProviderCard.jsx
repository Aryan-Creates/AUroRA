/**
 * ProviderCard Component strictly matching DESIGN-renault.md card principles:
 * Full-bleed product/business photography on top (square-cornered, rounded-none),
 * typography stacked cleanly beneath (never overlaid on top of photos).
 */

import React from 'react';
import { Star, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from './Badge.jsx';

export const ProviderCard = ({
  business,
  onSelect,
  className = '',
}) => {
  const {
    name,
    category,
    tagline,
    city,
    address,
    rating,
    reviewCount,
    coverImage,
    isVerified,
    isFeatured,
    badges = [],
  } = business;

  return (
    <div
      onClick={onSelect}
      className={`group bg-canvas rounded-none border border-hairline hover:border-hairline-strong transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${className}`}
    >
      <div>
        {/* Full-bleed photo strictly rounded-none */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-soft">
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Yellow Badge anchored bottom-left or top-left per DESIGN-renault.md */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {isFeatured && <Badge variant="new">Featured</Badge>}
            {badges.includes('Top Rated') && !isFeatured && (
              <span className="bg-surface-dark text-on-dark text-[11px] font-bold px-2.5 py-1 rounded-none uppercase tracking-wider">
                Top Rated
              </span>
            )}
          </div>
        </div>

        {/* Structured copy stacked cleanly beneath */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal">
              {category}
            </span>
            <div className="flex items-center gap-1 text-[13px] font-bold text-ink">
              <Star className="w-3.5 h-3.5 fill-primary text-black" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-mute font-normal text-[12px]">({reviewCount})</span>
            </div>
          </div>

          <h4 className="text-[19px] font-bold text-ink leading-tight1 group-hover:text-charcoal transition-colors flex items-center gap-1.5">
            <span>{name}</span>
            {isVerified && (
              <CheckCircle2 className="w-4 h-4 text-ink flex-shrink-0" title="Verified Provider" />
            )}
          </h4>

          <p className="text-mute text-[13.5px] line-clamp-2 mt-2 leading-snug">
            {tagline || business.description}
          </p>

          <div className="flex items-center gap-1.5 text-mute text-[12.5px] mt-3 pt-3 border-t border-hairline">
            <MapPin className="w-3.5 h-3.5 text-charcoal flex-shrink-0" />
            <span className="truncate">{address || city}</span>
          </div>
        </div>
      </div>

      {/* Trailing action link with animated arrow */}
      <div className="px-5 pb-5 pt-0 flex items-center justify-between text-[13px] font-bold text-ink group-hover:translate-x-0.5 transition-transform">
        <span className="underline underline-offset-4 decoration-1">Explore Services</span>
        <div className="w-8 h-8 rounded-xs border border-hairline-strong flex items-center justify-center bg-canvas group-hover:bg-primary transition-colors">
          <ArrowRight className="w-4 h-4 text-ink" />
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
