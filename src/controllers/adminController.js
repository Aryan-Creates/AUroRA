/**
 * Admin Controller
 * Coordinates platform oversight, user management, business moderation,
 * and dispute resolution.
 */

import { store } from '../app/store.js';
import { userRepository } from '../repositories/userRepository.js';
import { businessRepository } from '../repositories/businessRepository.js';
import { reportRepository } from '../repositories/reportRepository.js';
import {
  setAdminLoading,
  setAdminError,
  setAdminUsers,
  updateAdminUser,
  setAdminBusinesses,
  updateAdminBusinessStatus,
  setAdminReports,
  updateAdminReportStatus,
} from '../features/admin/adminSlice.js';
import { updateBusinessLocally } from '../features/businesses/businessSlice.js';

export const adminController = {
  loadAdminData() {
    store.dispatch(setAdminLoading(true));
    try {
      const users = userRepository.getAll();
      const businesses = businessRepository.getAll();
      const reports = reportRepository.getAllReports();

      store.dispatch(setAdminUsers(users));
      store.dispatch(setAdminBusinesses(businesses));
      store.dispatch(setAdminReports(reports));
      store.dispatch(setAdminLoading(false));

      return { success: true, users, businesses, reports };
    } catch (err) {
      store.dispatch(setAdminError(err.message));
      return { success: false, error: err.message };
    }
  },

  setUserStatus(userId, status) {
    try {
      const updated = userRepository.updateStatus(userId, status);
      if (updated) {
        store.dispatch(updateAdminUser(updated));
        return { success: true, user: updated };
      }
      return { success: false, error: 'User not found' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  moderateBusiness(businessId, status) {
    try {
      const updated = businessRepository.updateStatus(businessId, status);
      if (updated) {
        store.dispatch(updateAdminBusinessStatus({ id: businessId, status }));
        store.dispatch(updateBusinessLocally(updated));
        return { success: true, business: updated };
      }
      return { success: false, error: 'Business not found' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  resolveReport(reportId, status = 'resolved') {
    try {
      const updated = reportRepository.updateReportStatus(reportId, status);
      if (updated) {
        store.dispatch(updateAdminReportStatus({ id: reportId, status }));
        return { success: true, report: updated };
      }
      return { success: false, error: 'Report not found' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};
