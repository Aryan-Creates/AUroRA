/**
 * OwnerOnboardingPage View
 * Comprehensive multi-step registration workflow for new service business owners:
 * - Step 1: Business Profile (Name, Category, Tagline, Description)
 * - Step 2: Location & Contact Details (Address, Indian Metro City, Phone, Email, Website)
 * - Step 3: Operating Hours & Key Amenities (Opening/Closing, Facilities, Cover Imagery)
 * - Step 4: Primary Launch Service (Name, Price in ₹, Duration)
 * - Validation, submission, and direct onboarding redirect to Owner Dashboard
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Store,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Building2,
  Tag,
} from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Input, Select, Textarea } from '../components/Input.jsx';
import { businessRepository } from '../../repositories/businessRepository.js';
import { serviceRepository } from '../../repositories/serviceRepository.js';
import { userRepository } from '../../repositories/userRepository.js';
import { selectCurrentUser, updateProfile } from '../../features/auth/authSlice.js';
import { businessController } from '../../controllers/businessController.js';
import { providerController } from '../../controllers/providerController.js';
import { useDispatch } from 'react-redux';

export const OwnerOnboardingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hair Salons & Styling');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80'
  );
  const [amenities, setAmenities] = useState('Complimentary Wi-Fi, Valet Parking, Card Payments');
  const [weekdayHours, setWeekdayHours] = useState('09:00 - 20:00');
  const [weekendHours, setWeekendHours] = useState('10:00 - 18:00');

  // Initial Service Offering
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('60');

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!name.trim()) return setError('Please enter your business or establishment name.');
      if (!description.trim()) return setError('Please provide a brief description of your services.');
      setStep(2);
    } else if (step === 2) {
      if (!address.trim()) return setError('Please provide the physical address.');
      if (!phone.trim() || phone.trim() === '+91') return setError('Please enter a valid business contact number.');
      setStep(3);
    } else if (step === 3) {
      if (!coverImage.trim()) return setError('Please provide a valid cover photo URL.');
      setStep(4);
    }
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!serviceName.trim()) return setError('Please specify your initial service title.');
    if (!servicePrice || Number(servicePrice) <= 0) return setError('Please enter a valid service price in ₹.');

    setIsSubmitting(true);

    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const businessId = `biz-${Date.now()}`;

      // 1. Register business in repository
      const newBusiness = businessRepository.create({
        id: businessId,
        providerId: currentUser?.id || 'usr-prov-1',
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        category,
        tagline: tagline || `${category} specialist in ${city}`,
        description,
        address,
        city,
        postalCode: postalCode || '560001',
        phone,
        email: email || currentUser?.email || 'contact@business.com',
        website,
        rating: 5.0,
        reviewCount: 1,
        coverImage,
        images: [coverImage],
        openingHours: {
          Monday: weekdayHours,
          Tuesday: weekdayHours,
          Wednesday: weekdayHours,
          Thursday: weekdayHours,
          Friday: weekdayHours,
          Saturday: weekendHours,
          Sunday: 'Closed',
        },
        status: 'approved',
        isFeatured: false,
        isVerified: true,
        badges: ['New Partner', 'Verified Provider'],
        amenities: amenities.split(',').map((a) => a.trim()).filter(Boolean),
      });

      // 2. Register initial service in repository
      serviceRepository.create({
        businessId: newBusiness.id,
        name: serviceName,
        category,
        description: `Signature ${serviceName} offering provided by ${name}.`,
        durationMinutes: Number(serviceDuration),
        price: Number(servicePrice),
        currency: '₹',
        isPopular: true,
      });

      // 3. Update logged-in user profile with new provider role & business reference
      if (currentUser) {
        userRepository.update(currentUser.id, {
          role: 'provider',
          businessId: newBusiness.id,
        });
        dispatch(updateProfile({ role: 'provider', businessId: newBusiness.id }));
      }

      // 4. Reload businesses and provider dashboard data
      businessController.loadBusinesses();
      providerController.loadProviderData(newBusiness.providerId);

      // 5. Navigate to owner dashboard
      navigate('/owner/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex-1 bg-surface-soft py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {/* Onboarding Header */}
        <div className="bg-canvas border border-hairline p-6 md:p-8 rounded-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
            Establishment Onboarding
          </span>
          <h1 className="text-[32px] md:text-[36px] font-bold text-ink leading-tight1 mb-3">
            Register Your Business On AUroRA
          </h1>
          <p className="text-[14.5px] text-mute leading-relaxed">
            Join our curated network of premium salons, spas, gyms, and grooming parlours. Start receiving verified, real-time appointments.
          </p>

          {/* Stepper indicators */}
          <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-hairline">
            {[
              { num: 1, title: 'Profile' },
              { num: 2, title: 'Location' },
              { num: 3, title: 'Schedule' },
              { num: 4, title: 'Service' },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-2 px-3 border-t-2 text-[11px] font-bold tracking-wider uppercase transition-colors ${
                  step === s.num
                    ? 'border-primary text-ink'
                    : step > s.num
                    ? 'border-hairline-strong text-mute'
                    : 'border-hairline text-stone'
                }`}
              >
                <span>Step {s.num}: {s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-canvas border border-hairline-strong p-6 md:p-8 rounded-none shadow-sm">
          {error && (
            <div className="mb-6 p-3 bg-error/15 border-l-4 border-error text-error text-[13.5px] font-semibold">
              {error}
            </div>
          )}

          {/* STEP 1: BUSINESS PROFILE */}
          {step === 1 && (
            <form onSubmit={handleNext} className="flex flex-col gap-5">
              <h2 className="text-[20px] font-bold text-ink leading-tight1 border-b border-hairline pb-3">
                1. Basic Business Identity
              </h2>

              <Input
                label="Business or Establishment Name"
                required
                placeholder="e.g. Aura Luxury Salon & Bridal Atelier"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Select
                label="Primary Business Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'Hair Salons & Styling', label: 'Hair Salons & Styling' },
                  { value: 'Spas & Wellness', label: 'Spas & Wellness' },
                  { value: 'Fitness & Studios', label: 'Fitness & Gyms' },
                  { value: 'Barbers & Grooming', label: 'Barbers & Men’s Grooming' },
                  { value: 'Nails & Beauty Care', label: 'Beauty Parlours & Nails' },
                  { value: 'Yoga & Mindfulness', label: 'Yoga & Wellness Sanctuaries' },
                ]}
              />

              <Input
                label="Catchy Tagline (Optional)"
                placeholder="e.g. Master cuts, balayage & organic botanicals"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />

              <Textarea
                label="Business Description"
                required
                rows={4}
                placeholder="Describe your salon, facilities, and unique service philosophy to prospective customers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="primary" size="md">
                  <span>Continue to Location</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: LOCATION & CONTACT */}
          {step === 2 && (
            <form onSubmit={handleNext} className="flex flex-col gap-5">
              <h2 className="text-[20px] font-bold text-ink leading-tight1 border-b border-hairline pb-3">
                2. Location &amp; Contact Details
              </h2>

              <Input
                label="Street Address / Building Suite"
                required
                placeholder="e.g. 142 100ft Road, Indiranagar"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="City / Metro Region"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  options={[
                    { value: 'Bengaluru', label: 'Bengaluru' },
                    { value: 'Mumbai', label: 'Mumbai' },
                    { value: 'Delhi NCR', label: 'Delhi NCR' },
                    { value: 'Hyderabad', label: 'Hyderabad' },
                    { value: 'Pune', label: 'Pune' },
                  ]}
                />

                <Input
                  label="PIN / Postal Code"
                  placeholder="e.g. 560038"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  placeholder="+91 98450 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <Input
                  label="Business Email"
                  type="email"
                  placeholder="booking@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Input
                label="Official Website or Social Link (Optional)"
                placeholder="https://mybusiness.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />

              <div className="pt-4 flex items-center justify-between">
                <Button type="button" variant="outline-dark" size="md" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Back</span>
                </Button>
                <Button type="submit" variant="primary" size="md">
                  <span>Continue to Schedule</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: SCHEDULE & AMENITIES */}
          {step === 3 && (
            <form onSubmit={handleNext} className="flex flex-col gap-5">
              <h2 className="text-[20px] font-bold text-ink leading-tight1 border-b border-hairline pb-3">
                3. Operating Hours &amp; Visuals
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Weekday Hours (Mon - Fri)"
                  placeholder="09:00 - 20:00"
                  value={weekdayHours}
                  onChange={(e) => setWeekdayHours(e.target.value)}
                />

                <Input
                  label="Saturday Hours"
                  placeholder="10:00 - 18:00"
                  value={weekendHours}
                  onChange={(e) => setWeekendHours(e.target.value)}
                />
              </div>

              <Input
                label="Featured Cover Image URL"
                required
                placeholder="https://images.unsplash.com/..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />

              <Input
                label="Facilities &amp; Amenities (Comma Separated)"
                placeholder="Valet Parking, Wi-Fi, Card Accepted, Steam Room"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
              />

              <div className="pt-4 flex items-center justify-between">
                <Button type="button" variant="outline-dark" size="md" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Back</span>
                </Button>
                <Button type="submit" variant="primary" size="md">
                  <span>Continue to Service Setup</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 4: INITIAL SERVICE LAUNCH */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h2 className="text-[20px] font-bold text-ink leading-tight1 border-b border-hairline pb-3">
                4. Primary Launch Service
              </h2>

              <p className="text-[14px] text-mute leading-relaxed">
                Add at least one service offering so customers can immediately discover and book your business upon registration. (You can add more services at any time from your Services tab).
              </p>

              <Input
                label="Service Title"
                required
                placeholder="e.g. Signature Precision Haircut & Styling"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (₹ Indian Rupees)"
                  type="number"
                  required
                  min={1}
                  placeholder="e.g. 1200"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                />

                <Select
                  label="Duration (Minutes)"
                  value={serviceDuration}
                  onChange={(e) => setServiceDuration(e.target.value)}
                  options={[
                    { value: '30', label: '30 mins' },
                    { value: '45', label: '45 mins' },
                    { value: '60', label: '60 mins (1 hour)' },
                    { value: '90', label: '90 mins (1.5 hours)' },
                    { value: '120', label: '120 mins (2 hours)' },
                  ]}
                />
              </div>

              {/* Summary Card */}
              <div className="p-4 bg-surface-soft border border-hairline rounded-none mt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
                  Registration Summary
                </span>
                <p className="font-bold text-ink">{name} ({category})</p>
                <p className="text-[13px] text-mute">{address}, {city}</p>
                <p className="text-[13px] text-mute mt-1">
                  Initial Service: <span className="text-ink font-bold">{serviceName || 'Untitled'}</span> — ₹{servicePrice || '0'} ({serviceDuration} mins)
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button type="button" variant="outline-dark" size="md" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Back</span>
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>{isSubmitting ? 'Registering...' : 'Complete Registration & Open Portal'}</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerOnboardingPage;
