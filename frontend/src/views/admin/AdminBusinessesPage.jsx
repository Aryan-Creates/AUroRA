/**
 * AdminBusinessesPage View
 * Business listing moderation interface for administrators:
 * - Search by establishment name or category
 * - Filter by approval status: All, Approved, Pending, Rejected
 * - Approve or reject pending applications
 * - Immediate store synchronization with public directory
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Building2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Badge } from '../components/Badge.jsx';
import { SubNavPill } from '../components/SubNavPill.jsx';
import { adminController } from '../../controllers/adminController.js';
import { selectAdminBusinesses } from '../../features/admin/adminSlice.js';

export const AdminBusinessesPage = () => {
  const businesses = useSelector(selectAdminBusinesses);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleModerate = (bizId, status) => {
    adminController.moderateBusiness(bizId, status);
  };

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-canvas border border-hairline p-5 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center bg-surface-soft px-3 h-11 border border-hairline max-w-md w-full">
          <Search className="w-4 h-4 text-mute mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search establishments by name, category, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full bg-transparent text-[14px] outline-none text-ink placeholder:text-ash font-medium"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <SubNavPill
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          >
            All ({businesses.length})
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'approved'}
            onClick={() => setStatusFilter('approved')}
          >
            Approved ({businesses.filter((b) => b.status === 'approved').length})
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'pending'}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({businesses.filter((b) => b.status === 'pending').length})
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'rejected'}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected ({businesses.filter((b) => b.status === 'rejected').length})
          </SubNavPill>
        </div>
      </div>

      {/* Businesses Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBusinesses.map((biz) => (
          <div
            key={biz.id}
            className="bg-canvas border border-hairline hover:border-hairline-strong p-6 rounded-none flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-0.5">
                    {biz.category}
                  </span>
                  <h3 className="text-[20px] font-bold text-ink leading-tight1">{biz.name}</h3>
                </div>
                <Badge variant={biz.status}>{biz.status}</Badge>
              </div>

              <p className="text-[14px] text-mute line-clamp-2 mt-2 leading-relaxed">
                {biz.description}
              </p>

              <div className="border-t border-hairline pt-3 mt-3 text-[13px] text-charcoal space-y-1">
                <div>Location: <strong>{biz.address}, {biz.city}</strong></div>
                <div>Contact: {biz.phone} • {biz.email}</div>
                <div>Rating: {biz.rating} ({biz.reviewCount} reviews)</div>
              </div>
            </div>

            <div className="pt-4 border-t border-hairline mt-4 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-mute">
                ID: {biz.id}
              </span>

              <div className="flex items-center gap-2">
                {biz.status === 'pending' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleModerate(biz.id, 'approved')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>Approve</span>
                    </Button>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => handleModerate(biz.id, 'rejected')}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      <span>Reject</span>
                    </Button>
                  </>
                )}

                {biz.status === 'approved' && (
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => handleModerate(biz.id, 'rejected')}
                  >
                    Suspend Listing
                  </Button>
                )}

                {biz.status === 'rejected' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleModerate(biz.id, 'approved')}
                  >
                    Reinstate Listing
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="p-8 text-center text-mute text-[14px] bg-canvas border border-hairline">
          No businesses found matching this criteria.
        </div>
      )}
    </div>
  );
};

export default AdminBusinessesPage;
