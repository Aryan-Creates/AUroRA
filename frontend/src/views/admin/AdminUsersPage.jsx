/**
 * AdminUsersPage View
 * User management interface for administrators:
 * - Search by name or email
 * - Filter by role (Customer, Provider, Admin)
 * - Inspect account status
 * - Toggle Active / Suspended account states with immediate persistence
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Users, Shield, UserX, UserCheck } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { Badge } from '../components/Badge.jsx';
import { SubNavPill } from '../components/SubNavPill.jsx';
import { adminController } from '../../controllers/adminController.js';
import { selectAdminUsers } from '../../features/admin/adminSlice.js';

export const AdminUsersPage = () => {
  const users = useSelector(selectAdminUsers);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const handleToggleStatus = (user) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    adminController.setUserStatus(user.id, nextStatus);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
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
            placeholder="Search users by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full bg-transparent text-[14px] outline-none text-ink placeholder:text-ash font-medium"
          />
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <SubNavPill
            active={roleFilter === 'all'}
            onClick={() => setRoleFilter('all')}
          >
            All Roles ({users.length})
          </SubNavPill>
          <SubNavPill
            active={roleFilter === 'customer'}
            onClick={() => setRoleFilter('customer')}
          >
            Customers ({users.filter((u) => u.role === 'customer').length})
          </SubNavPill>
          <SubNavPill
            active={roleFilter === 'provider'}
            onClick={() => setRoleFilter('provider')}
          >
            Providers ({users.filter((u) => u.role === 'provider').length})
          </SubNavPill>
          <SubNavPill
            active={roleFilter === 'admin'}
            onClick={() => setRoleFilter('admin')}
          >
            Admins ({users.filter((u) => u.role === 'admin').length})
          </SubNavPill>
        </div>
      </div>

      {/* Users Table / List */}
      <div className="bg-canvas border border-hairline-strong rounded-none overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline-strong bg-surface-soft text-[11px] font-bold uppercase tracking-wider text-charcoal">
              <th className="py-3 px-5">User</th>
              <th className="py-3 px-5">Email</th>
              <th className="py-3 px-5">Role</th>
              <th className="py-3 px-5">Account Status</th>
              <th className="py-3 px-5">Created</th>
              <th className="py-3 px-5 text-right">Moderation Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline text-[14px]">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-surface-soft transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-hairline"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-surface-dark text-on-dark flex items-center justify-center text-[12px] font-bold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-ink block leading-tight">{user.name}</span>
                      <span className="text-[11px] text-mute">{user.id}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-charcoal">{user.email}</td>
                <td className="py-3.5 px-5">
                  <span className="font-bold uppercase text-[11.5px] px-2 py-0.5 rounded-none bg-black/5 text-ink">
                    {user.role}
                  </span>
                </td>
                <td className="py-3.5 px-5">
                  <Badge variant={user.status === 'active' ? 'success' : 'error'}>
                    {user.status || 'Active'}
                  </Badge>
                </td>
                <td className="py-3.5 px-5 text-mute text-[13px]">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <Button
                    variant={user.status === 'active' ? 'outline-dark' : 'primary'}
                    size="sm"
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.status === 'active' ? 'Suspend User' : 'Reactivate User'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-mute text-[14px]">
            No users found matching your search term or role filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
