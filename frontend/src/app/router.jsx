/**
 * Router Configuration for Aurora
 * Uses React Router v6 createBrowserRouter with clear role-based layout nesting:
 * - Public routes (Landing, Directory, Business Details, Booking Wizard, Auth)
 * - Customer workspace (/customer/*)
 * - Provider workspace (/provider/*)
 * - Admin governance workspace (/admin/*)
 * - 404 Catch-All
 */

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Layouts
import RootLayout from '../views/layouts/RootLayout.jsx';
import CustomerLayout from '../views/layouts/CustomerLayout.jsx';
import ProviderLayout from '../views/layouts/ProviderLayout.jsx';
import AdminLayout from '../views/layouts/AdminLayout.jsx';

// Customer & Public Views
import HomePage from '../views/customer/HomePage.jsx';
import DiscoveryPage from '../views/customer/DiscoveryPage.jsx';
import BusinessDetailPage from '../views/customer/BusinessDetailPage.jsx';
import BookingWizardPage from '../views/customer/BookingWizardPage.jsx';
import CustomerDashboardPage from '../views/customer/CustomerDashboardPage.jsx';
import CustomerBookingsPage from '../views/customer/CustomerBookingsPage.jsx';
import CustomerProfilePage from '../views/customer/CustomerProfilePage.jsx';
import CustomerNotificationsPage from '../views/customer/CustomerNotificationsPage.jsx';
import AuthPage from '../views/customer/AuthPage.jsx';

// Provider Views
import ProviderDashboardPage from '../views/provider/ProviderDashboardPage.jsx';
import ProviderBusinessPage from '../views/provider/ProviderBusinessPage.jsx';
import ProviderServicesPage from '../views/provider/ProviderServicesPage.jsx';
import ProviderAvailabilityPage from '../views/provider/ProviderAvailabilityPage.jsx';
import ProviderBookingsPage from '../views/provider/ProviderBookingsPage.jsx';

// Admin Views
import AdminDashboardPage from '../views/admin/AdminDashboardPage.jsx';
import AdminUsersPage from '../views/admin/AdminUsersPage.jsx';
import AdminBusinessesPage from '../views/admin/AdminBusinessesPage.jsx';
import AdminReportsPage from '../views/admin/AdminReportsPage.jsx';
import AdminBookingsPage from '../views/admin/AdminBookingsPage.jsx';
import OwnerOnboardingPage from '../views/provider/OwnerOnboardingPage.jsx';

// 404 View
import NotFoundPage from '../views/NotFoundPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <RootLayout>
        <NotFoundPage />
      </RootLayout>
    ),
    children: [
      // Public & Discovery Routes
      { index: true, element: <HomePage /> },
      { path: 'discover', element: <DiscoveryPage /> },
      { path: 'explore', element: <DiscoveryPage /> },
      { path: 'business/:id', element: <BusinessDetailPage /> },
      { path: 'book/:businessId', element: <BookingWizardPage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'login', element: <AuthPage defaultMode="login" /> },
      { path: 'register', element: <AuthPage defaultMode="register" /> },

      // Customer Workspace Routes
      {
        path: 'customer',
        element: <CustomerLayout />,
        children: [
          { index: true, element: <CustomerDashboardPage /> },
          { path: 'dashboard', element: <CustomerDashboardPage /> },
          { path: 'bookings', element: <CustomerBookingsPage /> },
          { path: 'profile', element: <CustomerProfilePage /> },
          { path: 'notifications', element: <CustomerNotificationsPage /> },
        ],
      },

      // Owner Onboarding Route (Full View)
      { path: 'owner/onboarding', element: <OwnerOnboardingPage /> },

      // Owner Operations Workspace Routes (/owner/*)
      {
        path: 'owner',
        element: <ProviderLayout />,
        children: [
          { index: true, element: <ProviderDashboardPage /> },
          { path: 'dashboard', element: <ProviderDashboardPage /> },
          { path: 'business', element: <ProviderBusinessPage /> },
          { path: 'services', element: <ProviderServicesPage /> },
          { path: 'availability', element: <ProviderAvailabilityPage /> },
          { path: 'bookings', element: <ProviderBookingsPage /> },
        ],
      },

      // Provider Operations Routes (/provider/* alias)
      {
        path: 'provider',
        element: <ProviderLayout />,
        children: [
          { index: true, element: <ProviderDashboardPage /> },
          { path: 'dashboard', element: <ProviderDashboardPage /> },
          { path: 'business', element: <ProviderBusinessPage /> },
          { path: 'services', element: <ProviderServicesPage /> },
          { path: 'availability', element: <ProviderAvailabilityPage /> },
          { path: 'bookings', element: <ProviderBookingsPage /> },
        ],
      },

      // Admin Governance Routes
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'businesses', element: <AdminBusinessesPage /> },
          { path: 'reports', element: <AdminReportsPage /> },
          { path: 'bookings', element: <AdminBookingsPage /> },
        ],
      },

      // 404 Catch-All
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
