/**
 * Report & Notification Repository
 * Access for administrative dispute moderation and system alerts.
 */

import { MOCK_REPORTS, MOCK_NOTIFICATIONS } from '../data/mockData.js';
import { storageService } from '../services/storageService.js';
import { Report, Notification } from '../models/SupportingModels.js';

const REPORT_KEY = 'reports';
const NOTIF_KEY = 'notifications';

class ReportRepository {
  constructor() {
    this._initData();
  }

  _initData() {
    if (!storageService.get(REPORT_KEY)) {
      storageService.set(REPORT_KEY, MOCK_REPORTS);
    }
    if (!storageService.get(NOTIF_KEY)) {
      storageService.set(NOTIF_KEY, MOCK_NOTIFICATIONS);
    }
  }

  getAllReports() {
    const raw = storageService.get(REPORT_KEY, MOCK_REPORTS);
    return raw.map((r) => new Report(r));
  }

  updateReportStatus(id, status) {
    const raw = storageService.get(REPORT_KEY, MOCK_REPORTS);
    const index = raw.findIndex((r) => r.id === id);
    if (index === -1) return null;
    raw[index].status = status;
    storageService.set(REPORT_KEY, raw);
    return new Report(raw[index]);
  }

  createReport(data) {
    const raw = storageService.get(REPORT_KEY, MOCK_REPORTS);
    const newReport = {
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...data,
    };
    raw.unshift(newReport);
    storageService.set(REPORT_KEY, raw);
    return new Report(newReport);
  }

  getNotifications(userId) {
    const raw = storageService.get(NOTIF_KEY, MOCK_NOTIFICATIONS);
    return raw
      .filter((n) => !userId || n.userId === userId)
      .map((n) => new Notification(n));
  }

  markNotificationAsRead(id) {
    const raw = storageService.get(NOTIF_KEY, MOCK_NOTIFICATIONS);
    const index = raw.findIndex((n) => n.id === id);
    if (index === -1) return null;
    raw[index].isRead = true;
    storageService.set(NOTIF_KEY, raw);
    return new Notification(raw[index]);
  }
}

export const reportRepository = new ReportRepository();
