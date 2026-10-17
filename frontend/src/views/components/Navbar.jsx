/**
 * Navbar Component strictly matching DESIGN-renault.md:
 * - Height: 60px
 * - Background: canvas (#ffffff) with hairline bottom border (#f2f2f2)
 * - Brand diamond mark with Sunlight Yellow accent
 * - Desktop nav links & quick role-switcher for hackathon evaluation
 * - Mobile responsive drawer
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Menu,
  X,
  Bell,
  User,
  Shield,
  Briefcase,
  Calendar,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { selectCurrentUser, selectUserRole, selectIsAuthenticated } from '../../features/auth/authSlice.js';
import { authController } from '../../controllers/authController.js';
import { Button } from './Button.jsx';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);
  const currentRole = useSelector(selectUserRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleRoleSelect = (role) => {
    authController.switchRole(role);
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);

    // Direct user to corresponding dashboard
    if (role === 'provider') {
      navigate('/provider/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  const handleLogout = () => {
    authController.logout();
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Explore', path: '/explore' },
    { label: 'Customer Area', path: '/customer/dashboard' },
    { label: 'Owner Portal', path: '/owner/dashboard' },
    { label: 'Admin Moderation', path: '/admin/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-[60px] bg-canvas border-b border-hairline transition-all">
      <div className="max-w-content mx-auto h-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Left: AUroRA Diamond Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group text-decoration-none">
          {/* Geometric flat diamond mark */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-8 h-8 fill-none stroke-ink stroke-[9] transition-transform group-hover:scale-105">
              <polygon points="50,8 92,50 50,92 8,50" />
            </svg>
            <div className="absolute w-2 h-2 bg-primary rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[18px] tracking-tight leading-none text-ink">
              AUroRA
            </span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-mute uppercase leading-tight mt-0.5">
              LOCAL SERVICES
            </span>
          </div>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[14px] font-bold tracking-btn transition-colors hover:text-ink relative py-1 ${
                  isActive
                    ? 'text-ink after:content-[""] after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[2px] after:bg-primary'
                    : 'text-mute'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Role Switcher & User Session Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Interactive Role Switcher Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="h-[36px] px-3.5 rounded-pill border border-hairline-strong bg-canvas hover:bg-surface-soft text-[12.5px] font-bold text-ink flex items-center gap-2 cursor-pointer transition-colors"
              title="Switch simulated role"
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="capitalize">Role: {currentRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-mute" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-canvas border border-hairline-strong shadow-lg rounded-none z-50 py-1">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-mute border-b border-hairline">
                  Simulate Role View
                </div>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('customer')}
                  className={`w-full px-3 py-2 text-left text-[13px] font-bold flex items-center gap-2 hover:bg-surface-soft cursor-pointer ${
                    currentRole === 'customer' ? 'bg-primary/20 text-ink' : 'text-charcoal'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-ink" />
                  <span>Customer (Claire)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('provider')}
                  className={`w-full px-3 py-2 text-left text-[13px] font-bold flex items-center gap-2 hover:bg-surface-soft cursor-pointer ${
                    currentRole === 'provider' ? 'bg-primary/20 text-ink' : 'text-charcoal'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-ink" />
                  <span>Provider (Élise)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  className={`w-full px-3 py-2 text-left text-[13px] font-bold flex items-center gap-2 hover:bg-surface-soft cursor-pointer ${
                    currentRole === 'admin' ? 'bg-primary/20 text-ink' : 'text-charcoal'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-ink" />
                  <span>Admin (Alexander)</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Notification Bell */}
          <Link
            to="/customer/notifications"
            className="w-9 h-9 rounded-xs border border-hairline-strong flex items-center justify-center text-ink hover:bg-surface-soft transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border border-black" />
          </Link>

          {/* User Account / Profile */}
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                to={
                  currentRole === 'provider'
                    ? '/provider/business'
                    : currentRole === 'admin'
                    ? '/admin/users'
                    : '/customer/profile'
                }
                className="flex items-center gap-2 py-1 px-2.5 rounded-xs hover:bg-surface-soft text-[13px] font-bold text-ink"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-hairline-strong"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-surface-dark text-on-dark flex items-center justify-center text-[11px]">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <span className="hidden md:inline truncate max-w-[120px]">{currentUser.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-8 h-8 rounded-xs flex items-center justify-center text-mute hover:text-error hover:bg-surface-soft cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button variant="primary" size="sm" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xs border border-hairline-strong flex items-center justify-center text-ink hover:bg-surface-soft cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-[60px] bg-canvas border-b border-hairline-strong shadow-xl p-5 z-50 flex flex-col gap-4 animate-fadeIn">
          {/* Role Switcher in mobile */}
          <div className="border-b border-hairline pb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-2">
              Select Role Simulation:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={currentRole === 'customer' ? 'secondary-dark' : 'outline-dark'}
                size="sm"
                onClick={() => handleRoleSelect('customer')}
              >
                Customer
              </Button>
              <Button
                variant={currentRole === 'provider' ? 'secondary-dark' : 'outline-dark'}
                size="sm"
                onClick={() => handleRoleSelect('provider')}
              >
                Provider
              </Button>
              <Button
                variant={currentRole === 'admin' ? 'secondary-dark' : 'outline-dark'}
                size="sm"
                onClick={() => handleRoleSelect('admin')}
              >
                Admin
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[16px] font-bold text-ink py-2 border-b border-hairline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Action */}
          <div className="pt-2">
            {isAuthenticated ? (
              <Button variant="outline-dark" size="sm" className="w-full" onClick={handleLogout}>
                Sign Out ({currentUser?.name})
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/auth');
                }}
              >
                Sign In / Register
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
