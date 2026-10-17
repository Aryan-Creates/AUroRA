/**
 * ProviderLayout Component
 * Sub-layout for service provider portal: dashboard, business info, services, availability, incoming bookings.
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, Scissors, Clock, CalendarCheck, PlusCircle } from 'lucide-react';
import { SubNavPill } from '../components/SubNavPill.jsx';

export const ProviderLayout = () => {
  const location = useLocation();
  const basePath = location.pathname.startsWith('/owner') ? '/owner' : '/provider';

  const providerTabs = [
    { label: 'Dashboard', path: `${basePath}/dashboard`, icon: LayoutDashboard },
    { label: 'Business Profile', path: `${basePath}/business`, icon: Store },
    { label: 'Services Catalogue', path: `${basePath}/services`, icon: Scissors },
    { label: 'Availability & Hours', path: `${basePath}/availability`, icon: Clock },
    { label: 'Incoming Bookings', path: `${basePath}/bookings`, icon: CalendarCheck },
    { label: 'Onboard Business', path: '/owner/onboarding', icon: PlusCircle },
  ];

  return (
    <div className="w-full flex-1 bg-surface-soft pb-16">
      {/* Header Band */}
      <div className="bg-canvas border-b border-hairline py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-content mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
            Service Provider Management Portal
          </span>
          <h1 className="text-[32px] md:text-[36px] font-bold text-ink leading-tight1 mb-6">
            Partner Operations Hub
          </h1>

          {/* Sub-nav horizontal pill rail */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {providerTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link key={tab.path} to={tab.path} className="text-decoration-none">
                  <SubNavPill active={isActive} icon={tab.icon}>
                    {tab.label}
                  </SubNavPill>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Outlet */}
      <div className="max-w-content mx-auto px-4 sm:px-6 md:px-8 pt-8">
        <Outlet />
      </div>
    </div>
  );
};

export default ProviderLayout;
