/**
 * AUroRA Database Inspector CLI
 * Run: node database/inspect.js [collection]
 * Examples:
 *   node database/inspect.js
 *   node database/inspect.js bookings
 *   node database/inspect.js users
 */

import mongoose from 'mongoose';
import config from './config/env.js';
import { User, Business, Service, Booking, Review, Report } from './schemas/index.js';

const inspect = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    const target = process.argv[2] ? process.argv[2].toLowerCase() : 'all';

    console.log(`\n======================================================`);
    console.log(`  AUroRA Database Inspector (Connected: ${config.mongodbUri})`);
    console.log(`======================================================\n`);

    if (target === 'all' || target === 'users') {
      const users = await User.find({}).lean();
      console.log(`--- [USERS] (${users.length} records) ---`);
      console.table(users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        status: u.status,
        created: u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A'
      })));
      console.log('');
    }

    if (target === 'all' || target === 'bookings') {
      const bookings = await Booking.find({}).lean();
      console.log(`--- [BOOKINGS] (${bookings.length} records) ---`);
      if (bookings.length === 0) {
        console.log('No bookings recorded yet.\n');
      } else {
        console.table(bookings.map(b => ({
          code: b.bookingCode || b._id.toString().slice(-6),
          customer: b.customerName,
          business: b.businessName,
          service: b.serviceName,
          date: b.date,
          time: b.timeSlot,
          price: `₹${b.price}`,
          status: b.status
        })));
        console.log('');
      }
    }

    if (target === 'all' || target === 'businesses') {
      const businesses = await Business.find({}).lean();
      console.log(`--- [BUSINESSES] (${businesses.length} records) ---`);
      console.table(businesses.map(b => ({
        id: b._id.toString(),
        name: b.name,
        category: b.category,
        city: b.city,
        rating: b.rating,
        reviews: b.reviewCount,
        status: b.status
      })));
      console.log('');
    }

    if (target === 'all' || target === 'services') {
      const services = await Service.find({}).lean();
      console.log(`--- [SERVICES] (${services.length} records) ---`);
      console.table(services.slice(0, 10).map(s => ({
        id: s._id.toString(),
        name: s.name,
        category: s.category,
        duration: `${s.durationMinutes} min`,
        price: `₹${s.price}`,
        active: s.isActive
      })));
      if (services.length > 10) console.log(`... and ${services.length - 10} more services.`);
      console.log('');
    }

    process.exit(0);
  } catch (err) {
    console.error('Inspection Error:', err.message);
    process.exit(1);
  }
};

inspect();
