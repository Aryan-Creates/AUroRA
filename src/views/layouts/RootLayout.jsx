/**
 * RootLayout Component
 * Wraps all application routes with the unified top Navbar, main outlet, and Footer.
 * Includes a subtle top role-awareness indicator for hackathon demonstration.
 */

import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { selectCurrentUser, selectUserRole } from '../../features/auth/authSlice.js';

export const RootLayout = () => {
  const location = useLocation();
  const currentRole = useSelector(selectUserRole);
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink antialiased">
      {/* Simulation banner indicating Phase 1 Frontend environment & current role */}
      <div className="w-full bg-surface-deep text-on-dark py-1.5 px-4 text-[12px] font-medium border-b border-divider-dark flex items-center justify-between">
        <div className="max-w-content mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-on-dark-mute">
              Aurora Prototype Phase 1 • Active Role: <strong className="text-primary uppercase tracking-wider">{currentRole}</strong> ({currentUser?.name || 'Guest'})
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] uppercase tracking-wider text-on-dark-mute">
            <Link to="/discover" className="hover:text-white">Directory</Link>
            <span>•</span>
            <Link to="/customer/dashboard" className="hover:text-white">Customer View</Link>
            <span>•</span>
            <Link to="/provider/dashboard" className="hover:text-white">Provider View</Link>
            <span>•</span>
            <Link to="/admin/dashboard" className="hover:text-white">Admin View</Link>
          </div>
        </div>
      </div>

      <Navbar />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;
