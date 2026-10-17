/**
 * AdminBookingsPage View
 * Comprehensive platform booking oversight for administrators:
 * - Search by customer name, email, establishment, service, or booking ref
 * - Filter by lifecycle status: All, Confirmed, Pending, Completed, Cancelled
 * - View booking details modal with full summary
 * - Admin actions: Override status (Cancel appointment, Mark Completed)
 * - Strict alignment with DESIGN-renault.md tokens
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Badge } from '../components/Badge.jsx';
import { SubNavPill } from '../components/SubNavPill.jsx';
import { Modal } from '../components/Modal.jsx';
import { bookingRepository } from '../../repositories/bookingRepository.js';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadBookings = () => {
    const list = bookingRepository.getAll();
    setBookings(list);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusChange = (bookingId, newStatus) => {
    bookingRepository.updateStatus(bookingId, newStatus);
    loadBookings();
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const filteredBookings = bookings.filter((bk) => {
    const matchesSearch =
      bk.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      bk.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      bk.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      bk.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      bk.id?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || bk.status === statusFilter;

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
            placeholder="Search by customer, business, service, or ref #..."
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
            All ({bookings.length})
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'confirmed'}
            onClick={() => setStatusFilter('confirmed')}
          >
            Confirmed ({bookings.filter((b) => b.status === 'confirmed').length})
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'pending'}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({bookings.filter((b) => b.status === 'pending').length})
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'completed'}
            onClick={() => setStatusFilter('completed')}
          >
            Completed ({bookings.filter((b) => b.status === 'completed').length})
          </SubNavPill>
          <SubNavPill
            active={statusFilter === 'cancelled'}
            onClick={() => setStatusFilter('cancelled')}
          >
            Cancelled ({bookings.filter((b) => b.status === 'cancelled').length})
          </SubNavPill>
        </div>
      </div>

      {/* Bookings Table / List */}
      <div className="bg-canvas border border-hairline rounded-none overflow-hidden">
        <div className="p-4 border-b border-hairline flex items-center justify-between">
          <span className="text-[13px] font-bold text-ink">
            Showing {filteredBookings.length} Bookings
          </span>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
            }}
            className="text-[12px] font-bold text-charcoal hover:text-ink underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center text-mute text-[14px]">
            No appointments match the current filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-hairline">
            {filteredBookings.map((bk) => (
              <div
                key={bk.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-surface-soft/60 transition-colors"
              >
                {/* Details Left */}
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-mute">
                      REF #{bk.id}
                    </span>
                    <Badge variant={bk.status}>{bk.status}</Badge>
                  </div>

                  <h3 className="text-[18px] font-bold text-ink leading-tight1 mb-1">
                    {bk.serviceName}
                  </h3>
                  <p className="text-[14px] text-mute font-medium mb-3">
                    Provider: <span className="text-ink font-bold">{bk.businessName}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[13px] text-charcoal">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-mute" />
                      <span>{bk.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-mute" />
                      <span>{bk.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-mute" />
                      <span className="truncate max-w-xs">{bk.businessAddress || 'Location Confirmed'}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info & Price Center */}
                <div className="lg:text-right border-t lg:border-t-0 pt-3 lg:pt-0 border-hairline">
                  <div className="text-[14px] font-bold text-ink mb-0.5">
                    {bk.customerName}
                  </div>
                  <div className="text-[12.5px] text-mute mb-2">
                    {bk.customerEmail} {bk.customerPhone && `• ${bk.customerPhone}`}
                  </div>
                  <div className="text-[20px] font-bold text-ink">
                    ₹{bk.price}
                  </div>
                </div>

                {/* Actions Right */}
                <div className="flex items-center gap-2 self-start lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-hairline w-full lg:w-auto justify-end">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(bk);
                      setModalOpen(true);
                    }}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span>Inspect</span>
                  </Button>

                  {bk.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusChange(bk.id, 'confirmed')}
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      <span>Approve</span>
                    </Button>
                  )}

                  {bk.status === 'confirmed' && (
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => handleStatusChange(bk.id, 'completed')}
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      <span>Complete</span>
                    </Button>
                  )}

                  {bk.status !== 'cancelled' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusChange(bk.id, 'cancelled')}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      <span>Cancel</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {selectedBooking && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Booking Oversight #${selectedBooking.id}`}
          subtitle="Administrative inspection of reservation record"
        >
          <div className="flex flex-col gap-4 text-[14px]">
            <div className="p-3 bg-surface-soft border border-hairline flex items-center justify-between">
              <span className="font-bold text-ink">Current Status</span>
              <Badge variant={selectedBooking.status}>{selectedBooking.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
                  Customer
                </span>
                <p className="font-bold text-ink">{selectedBooking.customerName}</p>
                <p className="text-mute">{selectedBooking.customerEmail}</p>
                <p className="text-mute">{selectedBooking.customerPhone || 'N/A'}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
                  Establishment
                </span>
                <p className="font-bold text-ink">{selectedBooking.businessName}</p>
                <p className="text-mute">{selectedBooking.businessAddress}</p>
              </div>
            </div>

            <div className="border-t border-hairline pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-mute block mb-1">
                Service &amp; Schedule
              </span>
              <p className="font-bold text-ink">{selectedBooking.serviceName}</p>
              <p className="text-charcoal mt-1">
                {selectedBooking.date} at {selectedBooking.timeSlot} ({selectedBooking.durationMinutes} mins)
              </p>
              <p className="text-[18px] font-bold text-ink mt-2">
                Total: ₹{selectedBooking.price}
              </p>
            </div>

            {selectedBooking.specialRequests && (
              <div className="p-3 bg-[#fffdf0] border-l-2 border-primary">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-0.5">
                  Client Special Requests
                </span>
                <p className="text-ink italic">"{selectedBooking.specialRequests}"</p>
              </div>
            )}

            <div className="border-t border-hairline pt-4 flex items-center justify-end gap-2">
              {selectedBooking.status !== 'cancelled' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    handleStatusChange(selectedBooking.id, 'cancelled');
                    setModalOpen(false);
                  }}
                >
                  Override &amp; Cancel
                </Button>
              )}
              {selectedBooking.status !== 'completed' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    handleStatusChange(selectedBooking.id, 'completed');
                    setModalOpen(false);
                  }}
                >
                  Mark Completed
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminBookingsPage;
