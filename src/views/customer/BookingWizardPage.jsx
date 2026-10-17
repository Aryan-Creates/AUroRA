/**
 * BookingWizardPage View
 * Complete end-to-end 7-step booking workflow:
 * 1. Select Business (preselected or selectable)
 * 2. Select Service from catalogue
 * 3. Pick Date
 * 4. Pick Available Time Slot
 * 5. Review Booking Summary & Input Client Information
 * 6. Confirm Booking
 * 7. Display Clear Confirmation Screen with Booking Reference
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Input, Textarea } from '../components/Input.jsx';
import { bookingController } from '../../controllers/bookingController.js';
import { businessController } from '../../controllers/businessController.js';
import {
  selectBookingDraft,
  selectBookingStep,
  selectAvailableSlots,
  selectLastConfirmedBooking,
  selectBookingLoading,
  selectBookingError,
} from '../../features/bookings/bookingSlice.js';
import {
  selectSelectedBusiness,
  selectSelectedBusinessServices,
} from '../../features/businesses/businessSlice.js';

export const BookingWizardPage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();

  const business = useSelector(selectSelectedBusiness);
  const services = useSelector(selectSelectedBusinessServices);
  const draft = useSelector(selectBookingDraft);
  const currentStep = useSelector(selectBookingStep);
  const availableSlots = useSelector(selectAvailableSlots);
  const lastConfirmed = useSelector(selectLastConfirmedBooking);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);

  // Local state for date & slot selection
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(draft.date || todayStr);
  const [selectedSlot, setSelectedSlot] = useState(draft.timeSlot || '');

  // Local state for customer fields
  const [custName, setCustName] = useState(draft.customerName || '');
  const [custEmail, setCustEmail] = useState(draft.customerEmail || '');
  const [custPhone, setCustPhone] = useState(draft.customerPhone || '');
  const [specialReq, setSpecialReq] = useState(draft.specialRequests || '');

  useEffect(() => {
    if (businessId) {
      businessController.loadBusinessDetails(businessId);
    }
  }, [businessId]);

  // Load available slots whenever date or businessId changes
  useEffect(() => {
    if (businessId && selectedDate) {
      bookingController.loadAvailableSlots(businessId, draft.serviceId, selectedDate);
    }
  }, [businessId, selectedDate, draft.serviceId]);

  // Update customer fields state whenever draft changes
  useEffect(() => {
    if (draft.customerName) setCustName(draft.customerName);
    if (draft.customerEmail) setCustEmail(draft.customerEmail);
    if (draft.customerPhone) setCustPhone(draft.customerPhone);
  }, [draft]);

  const handleSelectService = (srv) => {
    bookingController.selectService(srv);
  };

  const handleDateSlotNext = () => {
    if (!selectedDate || !selectedSlot) {
      alert('Please pick both an appointment date and an available time slot.');
      return;
    }
    bookingController.selectDateAndSlot(selectedDate, selectedSlot);
  };

  const handleConfirm = () => {
    bookingController.updateCustomerDetails({
      customerName: custName,
      customerEmail: custEmail,
      customerPhone: custPhone,
      specialRequests: specialReq,
    });
    bookingController.confirmBooking();
  };

  return (
    <div className="w-full flex-1 bg-surface-soft pb-20">
      {/* Step Progress Bar Band */}
      <div className="bg-canvas border-b border-hairline py-6 px-4 sm:px-6 md:px-8">
        <div className="max-w-content mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-0.5">
                Step-By-Step Reservation
              </span>
              <h1 className="text-[28px] md:text-[32px] font-bold text-ink leading-tight1">
                Booking at {business?.name || draft.businessName || 'Local Business'}
              </h1>
            </div>

            {/* Back link */}
            {currentStep < 4 && (
              <button
                type="button"
                onClick={() => {
                  if (currentStep > 1) {
                    bookingController.goToStep(currentStep - 1);
                  } else {
                    navigate(`/business/${businessId}`);
                  }
                }}
                className="flex items-center gap-1.5 text-[13px] font-bold text-charcoal hover:text-ink cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{currentStep > 1 ? 'Previous Step' : 'Back to Business'}</span>
              </button>
            )}
          </div>

          {/* Stepper Indicators */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { num: 1, label: '1. Select Service' },
              { num: 2, label: '2. Date & Time' },
              { num: 3, label: '3. Client Details' },
              { num: 4, label: '4. Confirmed' },
            ].map((step) => (
              <div
                key={step.num}
                className={`py-2 px-3 border-t-2 text-[12px] font-bold tracking-wider uppercase transition-colors ${
                  currentStep === step.num
                    ? 'border-primary text-ink'
                    : currentStep > step.num
                    ? 'border-surface-dark text-mute'
                    : 'border-hairline text-ash'
                }`}
              >
                {step.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Booking Container */}
      <div className="max-w-content mx-auto px-4 sm:px-6 md:px-8 pt-8">
        {/* STEP 1: SELECT SERVICE */}
        {currentStep === 1 && (
          <div className="max-w-3xl mx-auto bg-canvas border border-hairline-strong p-6 md:p-8 rounded-none">
            <h2 className="text-[22px] font-bold text-ink leading-tight1 mb-2">
              Choose Your Required Treatment
            </h2>
            <p className="text-[14px] text-mute mb-6">
              Pick the service to schedule with practitioner availability.
            </p>

            <div className="flex flex-col gap-3">
              {services.map((srv) => {
                const isSelected = draft.serviceId === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => handleSelectService(srv)}
                    className={`p-5 border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-hairline-strong bg-surface-soft ring-1 ring-black'
                        : 'border-hairline bg-canvas hover:border-hairline-strong'
                    }`}
                  >
                    <div>
                      <h4 className="text-[17px] font-bold text-ink leading-tight1">{srv.name}</h4>
                      <p className="text-[13.5px] text-mute mt-1">{srv.description}</p>
                      <div className="flex items-center gap-3 text-[12.5px] text-charcoal mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{srv.durationMinutes} mins</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className="text-[20px] font-bold text-ink block">${srv.price}</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal underline mt-1 block">
                        Select Service
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DATE & TIME SLOT */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Summary panel */}
            <div className="lg:col-span-4 bg-canvas border border-hairline-strong p-6 rounded-none self-start">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
                Selected Booking
              </span>
              <h3 className="text-[20px] font-bold text-ink leading-tight1 mb-1">
                {draft.serviceName}
              </h3>
              <p className="text-[14px] text-mute mb-4">{business?.name || draft.businessName}</p>

              <div className="border-t border-hairline py-3 flex justify-between text-[14px]">
                <span className="text-mute">Duration</span>
                <span className="font-bold text-ink">{draft.durationMinutes} mins</span>
              </div>
              <div className="border-t border-hairline py-3 flex justify-between text-[16px]">
                <span className="font-bold text-ink">Price</span>
                <span className="font-bold text-ink">${draft.price}</span>
              </div>

              <Button
                variant="outline-dark"
                size="sm"
                className="w-full mt-4"
                onClick={() => bookingController.goToStep(1)}
              >
                Change Service
              </Button>
            </div>

            {/* Right: Date picker & Slots list */}
            <div className="lg:col-span-8 bg-canvas border border-hairline-strong p-6 md:p-8 rounded-none">
              <h2 className="text-[22px] font-bold text-ink leading-tight1 mb-2">
                Select Date &amp; Available Slot
              </h2>
              <p className="text-[14px] text-mute mb-6">
                Appointments are held strictly for you with zero double-booking.
              </p>

              {/* Date Input */}
              <div className="mb-6 max-w-sm">
                <label className="text-[12px] font-bold uppercase tracking-wider text-charcoal block mb-1.5">
                  Appointment Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-12 bg-canvas border border-hairline-strong px-4 text-[15px] font-semibold text-ink outline-none"
                  />
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="mb-8">
                <label className="text-[12px] font-bold uppercase tracking-wider text-charcoal block mb-3">
                  Available Starting Times ({availableSlots.filter((s) => s.isAvailable).length} slots open)
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {availableSlots.map(({ slot, isAvailable }) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-2 text-[14px] font-bold rounded-none border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-surface-dark text-on-dark border-surface-dark ring-2 ring-primary'
                            : isAvailable
                            ? 'bg-canvas text-ink border-hairline hover:border-hairline-strong hover:bg-surface-soft'
                            : 'bg-surface-soft text-ash border-hairline line-through cursor-not-allowed opacity-40'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Step Action */}
              <div className="flex items-center justify-between pt-4 border-t border-hairline">
                <span className="text-[13.5px] text-charcoal font-medium">
                  {selectedDate && selectedSlot ? (
                    <>
                      Selected: <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>
                    </>
                  ) : (
                    'Please choose a time slot to proceed'
                  )}
                </span>
                <Button
                  variant="primary"
                  size="md"
                  disabled={!selectedDate || !selectedSlot}
                  onClick={handleDateSlotNext}
                >
                  <span>Continue To Details</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW SUMMARY & CUSTOMER DETAILS */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Final Summary Review */}
            <div className="lg:col-span-5 bg-canvas border border-hairline-strong p-6 md:p-7 rounded-none self-start">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-2">
                Booking Summary Review
              </span>
              <h3 className="text-[22px] font-bold text-ink leading-tight1 mb-1">
                {draft.serviceName}
              </h3>
              <p className="text-[14px] text-mute mb-6">{business?.name || draft.businessName}</p>

              <div className="space-y-3 border-t border-hairline py-4 text-[14px]">
                <div className="flex items-center justify-between">
                  <span className="text-mute flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Date
                  </span>
                  <span className="font-bold text-ink">{draft.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-mute flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Time Slot
                  </span>
                  <span className="font-bold text-ink">{draft.timeSlot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-mute">Duration</span>
                  <span className="font-bold text-ink">{draft.durationMinutes} Minutes</span>
                </div>
              </div>

              <div className="border-t border-b border-hairline py-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-mute block">
                    Total Due At Appointment
                  </span>
                  <span className="text-[24px] font-bold text-ink">${draft.price}</span>
                </div>
                <span className="text-[12px] text-mute">No upfront deposit required</span>
              </div>

              <div className="pt-4 flex items-center gap-2 text-[12.5px] text-charcoal">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Instant confirmation guaranteed with zero automated cancellation fees.</span>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7 bg-canvas border border-hairline-strong p-6 md:p-8 rounded-none">
              <h2 className="text-[22px] font-bold text-ink leading-tight1 mb-2">
                Confirm Guest Details
              </h2>
              <p className="text-[14px] text-mute mb-6">
                Your confirmation notice and receipt will be dispatched to this email address.
              </p>

              {error && (
                <div className="mb-6 p-3 bg-error/10 border-l-4 border-error text-error text-[13.5px] font-semibold">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <Input
                  label="Full Name"
                  required
                  placeholder="e.g. Claire Vance"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                />

                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                />

                <Textarea
                  label="Special Notes or Sensitivity Requests"
                  placeholder="Any allergies, mobility requirements, or styling preferences..."
                  rows={3}
                  value={specialReq}
                  onChange={(e) => setSpecialReq(e.target.value)}
                />

                <div className="pt-4 border-t border-hairline flex items-center justify-between gap-4">
                  <Button
                    variant="outline-dark"
                    size="md"
                    onClick={() => bookingController.goToStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    disabled={loading || !custName || !custEmail}
                    onClick={handleConfirm}
                  >
                    <span>{loading ? 'Confirming...' : 'Complete Reservation'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CLEAR CONFIRMATION STATE */}
        {currentStep === 4 && lastConfirmed && (
          <div className="max-w-2xl mx-auto bg-canvas border border-hairline-strong p-8 md:p-12 text-center rounded-none shadow-xl">
            <div className="w-16 h-16 bg-primary text-black flex items-center justify-center rounded-full mx-auto mb-6 shadow-md">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <span className="text-[12px] font-bold uppercase tracking-wider text-charcoal block mb-1">
              Reservation Confirmed
            </span>
            <h2 className="text-[32px] md:text-[36px] font-bold text-ink leading-tight1 mb-3">
              We Have Locked Your Slot!
            </h2>
            <p className="text-[15.5px] text-mute max-w-lg mx-auto mb-8">
              A booking confirmation has been registered for <strong>{lastConfirmed.customerName}</strong>. Reference: <strong className="text-ink">#{lastConfirmed.id}</strong>.
            </p>

            <div className="bg-surface-soft border border-hairline p-5 text-left mb-8 max-w-md mx-auto text-[14px] space-y-2.5">
              <div className="flex justify-between border-b border-hairline pb-2">
                <span className="text-mute">Service:</span>
                <span className="font-bold text-ink">{lastConfirmed.serviceName}</span>
              </div>
              <div className="flex justify-between border-b border-hairline pb-2">
                <span className="text-mute">Provider:</span>
                <span className="font-bold text-ink">{lastConfirmed.businessName}</span>
              </div>
              <div className="flex justify-between border-b border-hairline pb-2">
                <span className="text-mute">Date &amp; Time:</span>
                <span className="font-bold text-ink">{lastConfirmed.date} at {lastConfirmed.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mute">Total:</span>
                <span className="font-bold text-ink">${lastConfirmed.price}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/customer/bookings')}
              >
                View in My Bookings
              </Button>
              <Button
                variant="outline-dark"
                size="md"
                onClick={() => navigate('/discover')}
              >
                Explore More Services
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingWizardPage;
