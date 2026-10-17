/**
 * AdminReportsPage View
 * Moderation queue for flagged content, customer complaints, and facility violations:
 * - View dispute details, reported establishment, reporter details
 * - Mark complaints reviewed or resolved
 * - Immediate store synchronization
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Flag, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Badge } from '../components/Badge.jsx';
import { SubNavPill } from '../components/SubNavPill.jsx';
import { adminController } from '../../controllers/adminController.js';
import { selectAdminReports } from '../../features/admin/adminSlice.js';

export const AdminReportsPage = () => {
  const reports = useSelector(selectAdminReports);
  const [filter, setFilter] = useState('all');

  const handleResolve = (reportId) => {
    adminController.resolveReport(reportId, 'resolved');
  };

  const filteredReports = reports.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Controls Bar */}
      <div className="bg-canvas border border-hairline p-5 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-ink leading-tight1 mb-1">
            Platform Quality &amp; Trust Reports ({filteredReports.length})
          </h2>
          <p className="text-[13.5px] text-mute">
            Review user-submitted compliance notices, hygiene reports, or listing inaccuracies.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <SubNavPill
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All Reports ({reports.length})
          </SubNavPill>
          <SubNavPill
            active={filter === 'pending'}
            onClick={() => setFilter('pending')}
          >
            Pending ({reports.filter((r) => r.status === 'pending').length})
          </SubNavPill>
          <SubNavPill
            active={filter === 'resolved'}
            onClick={() => setFilter('resolved')}
          >
            Resolved ({reports.filter((r) => r.status === 'resolved').length})
          </SubNavPill>
        </div>
      </div>

      {/* Reports Queue */}
      <div className="flex flex-col gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-canvas border border-hairline-strong p-6 rounded-none flex flex-col md:flex-row md:items-start justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xs flex items-center justify-center flex-shrink-0 ${
                  report.status === 'pending'
                    ? 'bg-error/15 text-error'
                    : 'bg-success/15 text-success'
                }`}
              >
                <Flag className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-charcoal">
                    Subject: {report.businessName}
                  </span>
                  <Badge variant={report.status === 'resolved' ? 'success' : 'warning'}>
                    {report.status}
                  </Badge>
                </div>

                <h3 className="text-[18px] font-bold text-ink leading-tight1 mb-2">
                  {report.reason}
                </h3>

                <p className="text-[14.5px] text-mute leading-relaxed max-w-2xl mb-3">
                  {report.details}
                </p>

                <div className="text-[12.5px] text-charcoal space-x-3">
                  <span>Filed by: <strong>{report.reportedBy}</strong> ({report.reporterEmail})</span>
                  <span>•</span>
                  <span>Date: {new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-start">
              {report.status === 'pending' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleResolve(report.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  <span>Mark Resolved</span>
                </Button>
              ) : (
                <span className="text-[12.5px] font-bold text-[#2c6e18] flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Investigation Concluded</span>
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="p-8 text-center text-mute text-[14px] bg-canvas border border-hairline">
            No reports in this category. Platform quality parameters are operating nominally.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
