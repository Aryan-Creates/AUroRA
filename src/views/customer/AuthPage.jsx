/**
 * AuthPage View
 * Simulated authentication & registration experience:
 * - Direct 1-click demo accounts (Customer, Provider, Admin)
 * - Sign in form with input validation
 * - Registration form with role selection
 * - Transparent frontend prototype disclosure
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Briefcase, Key, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Input, Select } from '../components/Input.jsx';
import { authController } from '../../controllers/authController.js';
import { MOCK_USERS } from '../../data/mockData.js';

export const AuthPage = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('claire.vance@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('customer');

  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const res = authController.login({
      email: loginEmail,
      password: loginPassword,
    });
    if (res.success) {
      if (res.user.role === 'provider') {
        navigate('/provider/dashboard');
      } else if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } else {
      setError(res.error);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const res = authController.register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole,
    });
    if (res.success) {
      if (res.user.role === 'provider') {
        navigate('/provider/dashboard');
      } else if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } else {
      setError(res.error);
    }
  };

  const handleQuickDemoSelect = (user) => {
    authController.login({ email: user.email, password: 'password123' });
    if (user.role === 'provider') {
      navigate('/provider/dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  return (
    <div className="w-full flex-1 bg-surface-soft py-16 px-4 sm:px-6 md:px-8 flex items-center justify-center">
      <div className="max-w-md w-full flex flex-col gap-6">
        {/* Quick Demo Role Selector Panel */}
        <div className="bg-canvas border border-hairline-strong p-5 rounded-none shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-2">
            1-Click Evaluator Accounts:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoSelect(MOCK_USERS[0])}
              className="p-2 border border-hairline hover:border-hairline-strong bg-surface-soft text-center cursor-pointer"
            >
              <User className="w-4 h-4 mx-auto mb-1 text-ink" />
              <span className="text-[12px] font-bold block leading-tight text-ink">Customer</span>
              <span className="text-[10px] text-mute">Claire</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoSelect(MOCK_USERS[1])}
              className="p-2 border border-hairline hover:border-hairline-strong bg-surface-soft text-center cursor-pointer"
            >
              <Briefcase className="w-4 h-4 mx-auto mb-1 text-ink" />
              <span className="text-[12px] font-bold block leading-tight text-ink">Provider</span>
              <span className="text-[10px] text-mute">Élise</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoSelect(MOCK_USERS[2])}
              className="p-2 border border-hairline hover:border-hairline-strong bg-surface-soft text-center cursor-pointer"
            >
              <Shield className="w-4 h-4 mx-auto mb-1 text-ink" />
              <span className="text-[12px] font-bold block leading-tight text-ink">Admin</span>
              <span className="text-[10px] text-mute">Alexander</span>
            </button>
          </div>
        </div>

        {/* Main Auth Form Card */}
        <div className="bg-canvas border border-hairline-strong p-6 md:p-8 rounded-none shadow-md">
          <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
            <h2 className="text-[24px] font-bold text-ink leading-tight1">
              {isRegister ? 'Create Account' : 'Sign In to Aurora'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-[13px] font-bold text-ink underline cursor-pointer hover:text-charcoal"
            >
              {isRegister ? 'Already have an account?' : 'Register new'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-error/15 border-l-4 border-error text-error text-[13.5px] font-semibold">
              {error}
            </div>
          )}

          {isRegister ? (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              <Input
                label="Full Name"
                required
                placeholder="e.g. Jordan Smith"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />

              <Input
                label="Email Address"
                type="email"
                required
                placeholder="jordan@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
              />

              <Select
                label="Select Intended Role"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                options={[
                  { value: 'customer', label: 'Customer (Discover & Book Services)' },
                  { value: 'provider', label: 'Service Provider (Manage Business & Bookings)' },
                ]}
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" className="w-full">
                  <span>Register Account</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="name@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" className="w-full">
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>
          )}

          {/* Prototype Disclosure Notice */}
          <div className="mt-6 pt-4 border-t border-hairline text-[12px] text-mute leading-relaxed text-center">
            Phase 1 Frontend Prototype. Authentication operations are handled via the mock repository layer. No real backend required.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
