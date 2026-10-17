/**
 * AdminDashboardPage View
 * Platform oversight summary for administrators:
 * - Summary metrics (Total users, Active providers, Pending moderations, Quality reports)
 * - Pending business verification alert panel
 * - Quick administrative routing
 */

import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ShieldCheck,
  Users,
  Building2,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Badge } from '../components/Badge.jsx';
import { adminController } from '../../controllers/adminController.js';
import {
  selectAdminUsers,
  selectAdminBusinesses,
  selectAdminReports,
  selectAdminMetrics,
  selectAdminLoading,
} from '../../features/admin/adminSlice.js';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const users = useSelector(selectAdminUsers);
  const businesses = useSelector(selectAdminBusinesses);
  const reports = useSelector(selectAdminReports);
  const metrics = useSelector(selectAdminMetrics);
  const loading = useSelector(selectAdminLoading);

  useEffect(() => {
    adminController.loadAdminData();
  }, []);

  const pendingBusinesses = businesses.filter((b) => b.status === 'pending');
  const pendingReports = reports.filter((r) => r.status === 'pending');

  const handleModerate = (bizId, status) => {
    adminController.moderateBusiness(bizId, status);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Overview Banner */}
      <div className="bg-canvas border border-hairline-strong p-6 md:p-8 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-1">
            Platform Administration Console
          </span>
          <h2 className="text-[28px] md:text-[32px] font-bold text-ink leading-tight1 mb-2">
            Governance &amp; Trust Oversight
          </h2>
          <p className="text-[14.5px] text-mute max-w-xl">
            Monitor registered members, review new service provider verification applications, and resolve customer quality reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/businesses')}
          >
            Review Businesses
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-canvas border border-hairline p-5 rounded-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
            Registered Users
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-ink leading-none">
              {metrics.totalUsers}
            </span>
            <span className="text-[12px] text-mute">Accounts</span>
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-5 rounded-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
            Service Establishments
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-ink leading-none">
              {metrics.totalProviders}
            </span>
            <span className="text-[12px] text-mute">Partners</span>
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-5 rounded-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
            Pending Moderations
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#a06209] leading-none">
              {metrics.pendingBusinesses}
            </span>
            <span className="text-[12px] text-mute">Requires approval</span>
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-5 rounded-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
            Dispute Reports
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-error leading-none">
              {metrics.pendingReports}
            </span>
            <span className="text-[12px] text-mute">Active</span>
          </div>
        </div>
      </div>

      {/* Pending Businesses Needing Review */}
      {pendingBusinesses.length > 0 && (
        <div className="bg-canvas border border-hairline-strong p-6 rounded-none">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-hairline">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <h3 className="text-[18px] font-bold text-ink leading-tight1">
                Pending Provider Applications ({pendingBusinesses.length})
              </h3>
            </div>
            <Link
              to="/admin/businesses"
              className="text-[13px] font-bold text-ink underline"
            >
              View All
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {pendingBusinesses.map((biz) => (
              <div
                key={biz.id}
                className="p-4 bg-surface-soft border border-hairline flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-mute">
                      {biz.category}
                    </span>
                    <Badge variant="warning">Pending Moderation</Badge>
                  </div>
                  <h4 className="text-[17px] font-bold text-ink leading-tight1">{biz.name}</h4>
                  <p className="text-[13.5px] text-mute mt-0.5">
                    {biz.address}, {biz.city} • Contact: {biz.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleModerate(biz.id, 'approved')}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Approve Listing</span>
                  </Button>
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => handleModerate(biz.id, 'rejected')}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    <span>Reject</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Reported Quality Cases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-bold text-ink leading-tight1">
            Platform Quality Reports ({reports.length})
          </h3>
          <Link
            to="/admin/reports"
            className="text-[13px] font-bold text-ink underline hover:text-charcoal"
          >
            Review Reports Queue
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-canvas border border-hairline p-5 rounded-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-mute">
                    Target: {rep.businessName}
                  </span>
                  <Badge variant={rep.status === 'resolved' ? 'success' : 'warning'}>
                    {rep.status}
                  </Badge>
                </div>
                <h4 className="text-[16px] font-bold text-ink mb-1">{rep.reason}</h4>
                <p className="text-[13.5px] text-mute mb-3 leading-relaxed">{rep.details}</p>
                <span className="text-[11.5px] text-mute">Reported by: {rep.reportedBy}</span>
              </div>

              {rep.status === 'pending' && (
                <div className="pt-3 border-t border-hairline flex justify-end">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => adminController.resolveReport(rep.id, 'resolved')}
                  >
                    Mark Resolved
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
