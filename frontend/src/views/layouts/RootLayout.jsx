/**
 * RootLayout Component
 * Wraps all application routes with the unified top Navbar, main outlet, and Footer.
 * Includes a subtle top role-awareness indicator for hackathon demonstration.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';

export const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink antialiased">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;
