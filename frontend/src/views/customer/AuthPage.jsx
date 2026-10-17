/**
 * AuthPage View
 * Authentication & Registration Experience strictly matching DESIGN-renault.md:
 * - Direct 1-click evaluator accounts (Customer, Business Owner, Admin)
 * - Sign in form with validation and password visibility toggle
 * - Registration form with role selection (Customer vs Business Owner; no public admin registration)
 * - Transparent prototype / backend status disclosure
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, Briefcase, Key, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Input, Select } from '../components/Input.jsx';
import { authController } from '../../controllers/authController.js';
import { MOCK_USERS } from '../../data/mockData.js';

export const AuthPage = ({ defaultMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterRoute = defaultMode === 'register' || location.pathname === '/register';
  const [isRegister, setIsRegister] = useState(isRegisterRoute);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsRegister(isRegisterRoute);
  }, [isRegisterRoute]);

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
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = authController.login({
      email: loginEmail,
      password: loginPassword,
    });

    setLoading(false);
    if (res.success) {
      if (res.user.role === 'provider') {
        navigate('/owner/dashboard');
      } else if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } else {
      setError(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = authController.register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole,
    });

    setLoading(false);
    if (res.success) {
      if (res.user.role === 'provider') {
        navigate('/owner/onboarding');
      } else {
        navigate('/customer/dashboard');
      }
    } else {
      setError(res.error || 'Registration failed. Please try again.');
    }
  };

  const handleQuickDemoSelect = (user) => {
    authController.login({ email: user.email, password: 'password123' });
    if (user.role === 'provider') {
      navigate('/owner/dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  return (
    <div className="w-full flex-1 bg-surface-soft py-16 px-4 sm:px-6 md:px-8 flex items-center justify-center">
      <div className="max-w-md w-full flex flex-col gap-6">
        {/* Quick Demo Role Selector Panel for Evaluators */}
        <div className="bg-canvas border border-hairline-strong p-5 rounded-none shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-2">
            Instant 1-Click Evaluator Accounts:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoSelect(MOCK_USERS[0])}
              className="p-2 border border-hairline hover:border-hairline-strong bg-surface-soft text-center cursor-pointer transition-colors"
            >
              <User className="w-4 h-4 mx-auto mb-1 text-ink" />
              <span className="text-[12px] font-bold block leading-tight text-ink">Customer</span>
              <span className="text-[10px] text-mute">Claire</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoSelect(MOCK_USERS[1])}
              className="p-2 border border-hairline hover:border-hairline-strong bg-surface-soft text-center cursor-pointer transition-colors"
            >
              <Briefcase className="w-4 h-4 mx-auto mb-1 text-ink" />
              <span className="text-[12px] font-bold block leading-tight text-ink">Business Owner</span>
              <span className="text-[10px] text-mute">Élise</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoSelect(MOCK_USERS[2])}
              className="p-2 border border-hairline hover:border-hairline-strong bg-surface-soft text-center cursor-pointer transition-colors"
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
              {isRegister ? 'Create Account' : 'Sign In to HACKVIBE'}
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
                placeholder="e.g. Aryan Gupta"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />

              <Input
                label="Email Address"
                type="email"
                required
                placeholder="aryan@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98450 00000"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
              />

              <Select
                label="Select Account Role"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                options={[
                  { value: 'customer', label: 'Customer (Discover, Compare & Book)' },
                  { value: 'provider', label: 'Business Owner (Manage Salon & Services)' },
                ]}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-mute hover:text-ink cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
                  <span>{loading ? 'Creating...' : 'Register Account'}</span>
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

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-mute hover:text-ink cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
                  <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
