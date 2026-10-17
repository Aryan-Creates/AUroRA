/**
 * ProviderBusinessPage View
 * Business details and profile management for service providers:
 * - Edit business name, category, description, address, and contacts
 * - Real-time input validation & persistence
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Store, CheckCircle, Shield } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Input, Textarea, Select } from '../components/Input.jsx';
import { providerController } from '../../controllers/providerController.js';
import { selectProviderBusiness } from '../../features/provider/providerSlice.js';

export const ProviderBusinessPage = () => {
  const business = useSelector(selectProviderBusiness);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (business) {
      setName(business.name || '');
      setCategory(business.category || '');
      setTagline(business.tagline || '');
      setDescription(business.description || '');
      setAddress(business.address || '');
      setCity(business.city || '');
      setPhone(business.phone || '');
      setEmail(business.email || '');
      setWebsite(business.website || '');
    }
  }, [business]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!business?.id) return;

    const res = providerController.updateBusinessProfile(business.id, {
      name: name.trim(),
      category: category.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      address: address.trim(),
      city: city.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
    });

    if (res.success) {
      setSavedSuccess(true);
      setError('');
      setTimeout(() => setSavedSuccess(false), 3000);
    } else {
      setError(res.error || 'Failed to update business profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-canvas border border-hairline-strong p-6 md:p-8 rounded-none">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-hairline">
        <div className="w-10 h-10 rounded-xs bg-surface-dark text-on-dark flex items-center justify-center">
          <Store className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-[22px] font-bold text-ink leading-tight1">
            Business Profile &amp; Contact Details
          </h2>
          <span className="text-[12px] text-mute">
            Status: <strong className="uppercase text-ink">{business?.status || 'Active'}</strong>
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-3 bg-success/15 border-l-4 border-success text-[#2c6e18] text-[13.5px] font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Business information updated and synchronized across all views.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-error/15 border-l-4 border-error text-error text-[13.5px] font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Business Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Select
          label="Service Category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[
            { value: 'Hair Salons & Styling', label: 'Hair Salons & Styling' },
            { value: 'Spas & Wellness', label: 'Spas & Wellness' },
            { value: 'Fitness & Studios', label: 'Fitness & Studios' },
            { value: 'Barbers & Grooming', label: 'Barbers & Grooming' },
            { value: 'Nails & Beauty Care', label: 'Nails & Beauty Care' },
            { value: 'Yoga & Mindfulness', label: 'Yoga & Mindfulness' },
          ]}
        />

        <Input
          label="Tagline / Short Summary"
          placeholder="e.g. Precision hair styling & organic treatments"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />

        <Textarea
          label="Full Business Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Street Address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Input
            label="City / Neighbourhood"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Contact Phone"
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="Business Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Website URL"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-hairline flex items-center justify-between">
          <span className="text-[12px] text-mute flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-primary" />
            <span>Updates immediately take effect in client discovery.</span>
          </span>
          <Button type="submit" variant="primary" size="md">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProviderBusinessPage;
