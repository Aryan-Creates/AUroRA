/**
 * AdminLayout Component
 * Sub-layout for administrative oversight: platform metrics, users, business approvals, and dispute moderation.
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Users, Building2, Flag } from 'lucide-react';
import { SubNavPill } from '../components/SubNavPill.jsx';

export const AdminLayout = () => {
  const location = useLocation();

  const adminTabs = [
    { label: 'Platform Overview', path: '/admin/dashboard', icon: ShieldCheck },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Business Moderation', path: '/admin/businesses', icon: Building2 },
    { label: 'Reports & Quality', path: '/admin/reports', icon: Flag },
  ];

  return (
    <div className="w-full flex-1 bg-surface-soft pb-16">
      {/* Header Band */}
      <div className="bg-canvas border-b border-hairline py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-content mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
            Platform Administration &amp; Moderation
          </span>
          <h1 className="text-[32px] md:text-[36px] font-bold text-ink leading-tight1 mb-6">
            Governance &amp; Trust Control
          </h1>

          {/* Sub-nav horizontal pill rail */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {adminTabs.map((tab) => {
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

export default AdminLayout;
