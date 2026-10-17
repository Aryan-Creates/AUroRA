/**
 * Footer Component strictly matching DESIGN-renault.md:
 * - Background: surface-dark (#000000)
 * - Text: on-dark (#ffffff) and on-dark-mute (rgba(255,255,255,0.72))
 * - Padding: 64px 24px (py-16 px-6)
 * - Three-column grid with divider-dark (rgba(255,255,255,0.16)) separator
 * - Geometric flat diamond logo mark
 */

import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-surface-dark text-on-dark py-16 px-4 sm:px-6 md:px-8 border-t border-divider-dark transition-colors">
      <div className="max-w-content mx-auto">
        {/* Brand & 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 pb-12">
          {/* Col 1: Aurora Brand Identity */}
          <div className="md:col-span-1 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-4 group text-decoration-none">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-8 h-8 fill-none stroke-white stroke-[9]">
                  <polygon points="50,8 92,50 50,92 8,50" />
                </svg>
                <div className="absolute w-2 h-2 bg-primary rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[19px] tracking-tight leading-none text-white">
                  AURORA
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase leading-tight mt-0.5">
                  LOCAL SERVICES
                </span>
              </div>
            </Link>
            <p className="text-[14px] text-on-dark-mute leading-relaxed max-w-xs">
              A curated platform for discovering and booking exceptional local salons, spas, wellness retreats, and athletic training studios.
            </p>
          </div>

          {/* Col 2: Customer Discovery */}
          <div className="flex flex-col gap-3">
            <h5 className="text-[12px] font-bold uppercase tracking-wider text-primary mb-1">
              Explore &amp; Book
            </h5>
            <Link to="/discover?category=Hair+Salons+%26+Styling" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              Hair Salons &amp; Styling
            </Link>
            <Link to="/discover?category=Spas+%26+Wellness" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              Spas &amp; Hydrotherapy
            </Link>
            <Link to="/discover?category=Fitness+%26+Studios" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              Fitness &amp; Performance Gyms
            </Link>
            <Link to="/discover?category=Barbers+%26+Grooming" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              Master Barbers &amp; Grooming
            </Link>
            <Link to="/discover" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              All Local Service Providers
            </Link>
          </div>

          {/* Col 3: Service Providers */}
          <div className="flex flex-col gap-3">
            <h5 className="text-[12px] font-bold uppercase tracking-wider text-primary mb-1">
              For Providers
            </h5>
            <Link to="/provider/dashboard" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              Provider Dashboard
            </Link>
            <Link to="/provider/services" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              Service Management
            </Link>
            <Link to="/provider/availability" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              Availability &amp; Hours
            </Link>
            <Link to="/provider/bookings" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              Incoming Bookings
            </Link>
            <Link to="/provider/business" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              Business Profile
            </Link>
          </div>

          {/* Col 4: Oversight & Governance */}
          <div className="flex flex-col gap-3">
            <h5 className="text-[12px] font-bold uppercase tracking-wider text-primary mb-1">
              Platform &amp; Trust
            </h5>
            <Link to="/admin/dashboard" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              Admin Moderation Center
            </Link>
            <Link to="/admin/businesses" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              Provider Verification
            </Link>
            <Link to="/admin/reports" className="text-[14px] text-on-dark-mute hover:text-white transition-colors">
              Quality &amp; Trust Reports
            </Link>
            <span className="text-[13px] text-on-dark-mute mt-2">
              Phase 1 Frontend Prototype • HACKVIBE Round 1
            </span>
          </div>
        </div>

        {/* Separator & Bottom Row */}
        <div className="pt-8 border-t border-divider-dark flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-on-dark-mute">
          <p>© {new Date().getFullYear()} Aurora Platform. Built strictly with the Renault design system specification.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Charter</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
