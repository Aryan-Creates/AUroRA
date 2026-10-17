/**
 * CustomerLayout Component
 * Sub-layout for customer account dashboard, bookings, profile, and notifications.
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, User, Bell, LayoutDashboard } from 'lucide-react';
import { SubNavPill } from '../components/SubNavPill.jsx';

export const CustomerLayout = () => {
  const location = useLocation();

  const customerTabs = [
    { label: 'Overview', path: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'My Bookings', path: '/customer/bookings', icon: Calendar },
    { label: 'Profile & Settings', path: '/customer/profile', icon: User },
    { label: 'Notifications', path: '/customer/notifications', icon: Bell },
  ];

  return (
    <div className="w-full flex-1 bg-surface-soft pb-16">
      {/* Header Band */}
      <div className="bg-canvas border-b border-hairline py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-content mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
            Customer Account
          </span>
          <h1 className="text-[32px] md:text-[36px] font-bold text-ink leading-tight1 mb-6">
            Appointments &amp; Preferences
          </h1>

          {/* Sub-nav horizontal pill rail */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {customerTabs.map((tab) => {
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

export default CustomerLayout;
