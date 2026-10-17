/**
 * CustomerProfilePage View
 * Allows viewing and editing customer personal information, phone, and preferences.
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Phone, MapPin, CheckCircle, Shield } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { selectCurrentUser } from '../../features/auth/authSlice.js';
import { authController } from '../../controllers/authController.js';

export const CustomerProfilePage = () => {
  const currentUser = useSelector(selectCurrentUser);

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    const res = authController.updateUserProfile(currentUser.id, {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    if (res.success) {
      setSavedSuccess(true);
      setError('');
      setTimeout(() => setSavedSuccess(false), 3000);
    } else {
      setError(res.error || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-canvas border border-hairline-strong p-6 md:p-8 rounded-none">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-hairline">
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover border border-hairline-strong"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-surface-dark text-on-dark flex items-center justify-center text-[22px] font-bold">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
        )}

        <div>
          <h2 className="text-[22px] font-bold text-ink leading-tight1">{currentUser?.name}</h2>
          <span className="text-[12px] font-bold uppercase tracking-wider text-mute block mt-0.5">
            Role: {currentUser?.role} • Status: {currentUser?.status || 'Active'}
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-3 bg-success/15 border-l-4 border-success text-[#2c6e18] text-[13.5px] font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Profile changes updated successfully.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-error/15 border-l-4 border-error text-error text-[13.5px] font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Email Address"
          type="email"
          disabled
          value={email}
          helperText="Email cannot be changed in simulated frontend mode"
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Input
          label="Residential Street Address"
          placeholder="123 Example Blvd, Apt 4"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="pt-4 border-t border-hairline flex items-center justify-between">
          <span className="text-[12px] text-mute flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-primary" />
            <span>Simulated session persistence enabled.</span>
          </span>
          <Button type="submit" variant="primary" size="md">
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerProfilePage;
