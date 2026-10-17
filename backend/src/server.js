/**
 * AUroRA Backend Express Application Server
 * REST API for Local Services Discovery & Booking Platform
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/env.js';
import connectDB from './config/database.js';
import { protect, requireRoles } from './middleware/authMiddleware.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Controllers
import authController from './controllers/authController.js';
import businessController from './controllers/businessController.js';
import bookingController from './controllers/bookingController.js';
import { User, Business, Service, Booking, Report } from './models/index.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration supporting credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development ports (Vite default 5173, 3000, etc.)
      callback(null, true);
    },
    credentials: true,
  })
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    platform: 'AUroRA Local Services Platform',
    timestamp: new Date().toISOString(),
  });
});

// --- AUTHENTICATION ROUTES ---
const authRouter = express.Router();
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', protect, authController.getMe);
authRouter.put('/profile', protect, authController.updateProfile);
app.use('/api/auth', authRouter);

// --- BUSINESS DISCOVERY & MANAGEMENT ROUTES ---
const businessRouter = express.Router();
businessRouter.get('/', businessController.getBusinesses);
businessRouter.get('/categories', businessController.getCategories);
businessRouter.get('/my/business', protect, requireRoles('provider'), businessController.getProviderBusiness);
businessRouter.get('/:id', businessController.getBusinessById);
businessRouter.get('/:id/services', businessController.getBusinessServices);
businessRouter.get('/:id/availability', businessController.getBusinessAvailability);
businessRouter.post('/', protect, requireRoles('provider', 'admin'), businessController.createBusiness);
businessRouter.put('/:id', protect, requireRoles('provider', 'admin'), businessController.updateBusiness);
businessRouter.get('/:id/reviews', businessController.getBusinessReviews);
businessRouter.post('/:id/reviews', protect, businessController.addBusinessReview);
app.use('/api/businesses', businessRouter);

// --- SERVICE CATALOGUE MANAGEMENT ROUTES ---
const serviceRouter = express.Router();
serviceRouter.post('/', protect, requireRoles('provider', 'admin'), async (req, res, next) => {
  try {
    const { businessId, name, category, description, durationMinutes, price } = req.body;
    const service = await Service.create({
      businessId,
      name,
      category,
      description,
      durationMinutes: Number(durationMinutes),
      price: Number(price),
    });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
});

serviceRouter.put('/:id', protect, requireRoles('provider', 'admin'), async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
});

serviceRouter.delete('/:id', protect, requireRoles('provider', 'admin'), async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
    res.status(200).json({ success: true, message: 'Service removed successfully' });
  } catch (error) {
    next(error);
  }
});
app.use('/api/services', serviceRouter);

// --- BOOKING OPERATIONS ROUTES ---
const bookingRouter = express.Router();
bookingRouter.post('/', protect, bookingController.createBooking);
bookingRouter.get('/my-bookings', protect, bookingController.getCustomerBookings);
bookingRouter.get('/provider-bookings', protect, requireRoles('provider'), async (req, res, next) => {
  try {
    const business = await Business.findOne({ providerId: req.user._id });
    if (!business) {
      return res.status(200).json({ success: true, data: [] });
    }
    const bookings = await Booking.find({ businessId: business._id }).sort({ date: 1, timeSlot: 1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
});

bookingRouter.get('/:id', protect, bookingController.getBookingById);
bookingRouter.post('/:id/cancel', protect, bookingController.cancelBooking);
bookingRouter.put('/:id/status', protect, requireRoles('provider', 'admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});
app.use('/api/bookings', bookingRouter);

// --- ADMIN GOVERNANCE & MODERATION ROUTES ---
const adminRouter = express.Router();
adminRouter.use(protect, requireRoles('admin'));

adminRouter.get('/metrics', async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBusinesses = await Business.countDocuments();
    const pendingBusinesses = await Business.countDocuments({ status: 'pending' });
    const totalBookings = await Booking.countDocuments();
    const totalReports = await Report.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBusinesses,
        pendingBusinesses,
        totalBookings,
        totalReports,
      },
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/users/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/businesses', async (req, res, next) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: businesses });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/businesses/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const business = await Business.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, data: business });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/reports', async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/reports/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/bookings', async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
});
app.use('/api/admin', adminRouter);

// Global Error Handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(config.port, () => {
      console.log(`[AUroRA Server] Running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
    });
    return server;
  } catch (error) {
    console.error('[AUroRA Server] Startup failed:', error.message);
  }
};

startServer();

export default app;
