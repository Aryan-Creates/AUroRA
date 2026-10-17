/**
 * CustomerNotificationsPage View
 * Displays user alerts, booking status changes, and platform announcements.
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink, Calendar, Info } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { reportRepository } from '../../repositories/reportRepository.js';
import { selectCurrentUser } from '../../features/auth/authSlice.js';

export const CustomerNotificationsPage = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [notifications, setNotifications] = useState(
    reportRepository.getNotifications(currentUser?.id)
  );

  const handleMarkAsRead = (id) => {
    reportRepository.markNotificationAsRead(id);
    setNotifications(reportRepository.getNotifications(currentUser?.id));
  };

  return (
    <div className="max-w-3xl mx-auto bg-canvas border border-hairline-strong p-6 md:p-8 rounded-none">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-hairline">
        <div>
          <h2 className="text-[22px] font-bold text-ink leading-tight1 mb-1">
            Notifications ({notifications.length})
          </h2>
          <p className="text-[13.5px] text-mute">
            Real-time updates regarding your scheduled visits and platform notices.
          </p>
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border rounded-none transition-colors flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'bg-canvas border-hairline'
                  : 'bg-surface-soft border-hairline-strong'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xs flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    notif.type === 'booking'
                      ? 'bg-primary text-black'
                      : notif.type === 'warning'
                      ? 'bg-warning/20 text-[#a06209]'
                      : 'bg-surface-dark text-on-dark'
                  }`}
                >
                  {notif.type === 'booking' ? (
                    <Calendar className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <h4 className="text-[15.5px] font-bold text-ink leading-tight1 mb-1">
                    {notif.title}
                  </h4>
                  <p className="text-[14px] text-charcoal leading-relaxed mb-2">
                    {notif.message}
                  </p>
                  <span className="text-[11px] text-mute block">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {!notif.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="text-[12px] font-bold text-ink hover:underline cursor-pointer"
                  >
                    Mark as read
                  </button>
                )}
                {notif.link && (
                  <Link
                    to={notif.link}
                    className="text-[12px] font-bold text-ink flex items-center gap-1 hover:text-charcoal underline"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-mute text-[14px]">
          You have no notifications at this time.
        </div>
      )}
    </div>
  );
};

export default CustomerNotificationsPage;
