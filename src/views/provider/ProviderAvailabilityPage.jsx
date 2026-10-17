/**
 * ProviderAvailabilityPage View
 * Operating hours and weekly schedule management for providers:
 * - Configure operating hours for Monday through Sunday
 * - Set days as Closed or Open with custom start and end times
 * - Save and verify that customer booking flow reflects updated hours
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Clock, CheckCircle, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { providerController } from '../../controllers/providerController.js';
import {
  selectProviderBusiness,
  selectProviderOpeningHours,
} from '../../features/provider/providerSlice.js';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const ProviderAvailabilityPage = () => {
  const business = useSelector(selectProviderBusiness);
  const openingHours = useSelector(selectProviderOpeningHours);

  const [schedule, setSchedule] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (openingHours && Object.keys(openingHours).length > 0) {
      setSchedule(openingHours);
    } else if (business?.openingHours) {
      setSchedule(business.openingHours);
    } else {
      const defaultSchedule = {};
      DAYS_OF_WEEK.forEach((day) => {
        defaultSchedule[day] = day === 'Sunday' ? 'Closed' : '09:00 - 19:00';
      });
      setSchedule(defaultSchedule);
    }
  }, [openingHours, business]);

  const handleTimeChange = (day, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  const handleToggleClosed = (day) => {
    setSchedule((prev) => {
      const current = prev[day];
      return {
        ...prev,
        [day]: current === 'Closed' ? '09:00 - 18:00' : 'Closed',
      };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!business?.id) return;

    const res = providerController.updateOperatingHours(business.id, schedule);
    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-canvas border border-hairline-strong p-6 md:p-8 rounded-none">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-hairline">
        <div className="w-10 h-10 rounded-xs bg-surface-dark text-on-dark flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-[22px] font-bold text-ink leading-tight1">
            Operating Hours &amp; Booking Availability
          </h2>
          <span className="text-[12px] text-mute">
            Configure the working schedule and hours visible to booking clients.
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-3 bg-success/15 border-l-4 border-success text-[#2c6e18] text-[13.5px] font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Operating hours updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="divide-y divide-hairline">
          {DAYS_OF_WEEK.map((day) => {
            const currentHours = schedule[day] || 'Closed';
            const isClosed = currentHours === 'Closed';

            return (
              <div
                key={day}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="w-32">
                  <span className="font-bold text-[15px] text-ink">{day}</span>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end">
                  {isClosed ? (
                    <span className="px-3 py-1 bg-surface-soft text-mute text-[13px] font-bold uppercase rounded-none border border-hairline">
                      Closed
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={currentHours}
                      onChange={(e) => handleTimeChange(day, e.target.value)}
                      placeholder="e.g. 09:00 - 19:00"
                      className="h-10 px-3 bg-canvas border border-hairline-strong text-[14px] text-ink font-semibold rounded-none outline-none focus:ring-1 focus:ring-ink w-44"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => handleToggleClosed(day)}
                    className="text-[12.5px] font-bold underline text-mute hover:text-ink cursor-pointer px-2"
                  >
                    {isClosed ? 'Set Open' : 'Mark Closed'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-6 border-t border-hairline flex items-center justify-between">
          <span className="text-[12px] text-mute flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Updated schedules are respected by customer booking slots.</span>
          </span>
          <Button type="submit" variant="primary" size="md">
            Save Weekly Schedule
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProviderAvailabilityPage;
