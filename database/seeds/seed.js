/**
 * Seed Script for AUroRA Backend
 * Seeds initial users (Customer, Provider, Admin), 6 comprehensive businesses, services, and bookings into MongoDB.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config/env.js';
import { User, Business, Service, Booking, Review, Report } from '../schemas/index.js';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB at', config.mongodbUri);
    await mongoose.connect(config.mongodbUri);
    console.log('[Seed] Connected.');

    // Clear existing collections
    await User.deleteMany({});
    await Business.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Report.deleteMany({});
    console.log('[Seed] Cleared collections.');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Users
    const customerUser = await User.create({
      name: 'Claire Vance',
      email: 'claire.vance@example.com',
      password: hashedPassword,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98450 11022',
      address: '244 Indiranagar 100ft Rd, Bengaluru',
      status: 'active',
    });

    const providerUser = await User.create({
      name: 'Élise Laurent',
      email: 'elise@latelierbeaute.com',
      password: hashedPassword,
      role: 'provider',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98450 28901',
      address: '142 Indiranagar, Bengaluru',
      status: 'active',
    });

    const adminUser = await User.create({
      name: 'Alexander Sterling',
      email: 'admin@aurora-platform.local',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98450 08888',
      address: 'AUroRA Platform HQ, UB City, Bengaluru',
      status: 'active',
    });

    console.log('[Seed] Users created.');

    // 2. Businesses
    const biz1 = await Business.create({
      providerId: providerUser._id,
      name: 'L’Atelier Studio Beauté',
      slug: 'latelier-studio-beaute',
      category: 'Hair Salons & Styling',
      tagline: 'Haute coiffure, precision balayage & organic botanical care',
      description: 'L’Atelier Studio Beauté brings Parisian precision styling to the heart of Bengaluru. Our senior creative directors tailor architectural cuts and personalized tone glosses that complement your facial geometry. Dedicated private styling pods provide an unhurried, serene salon ritual.',
      address: '142 100ft Road, Indiranagar',
      city: 'Bengaluru',
      postalCode: '560038',
      phone: '+91 98450 28901',
      email: 'rendezvous@latelierbeaute.com',
      website: 'https://latelierbeaute.example.com',
      rating: 4.9,
      reviewCount: 142,
      images: [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
      ],
      coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      openingHours: {
        Monday: '09:00 - 19:00',
        Tuesday: '09:00 - 19:00',
        Wednesday: '09:00 - 19:00',
        Thursday: '09:00 - 20:00',
        Friday: '09:00 - 20:00',
        Saturday: '09:00 - 18:00',
        Sunday: 'Closed',
      },
      status: 'approved',
      isFeatured: true,
      isVerified: true,
      badges: ['Top Rated', 'Verified Partner', 'Sustainable'],
      amenities: ['Private Styling Pods', 'Complimentary Espresso', 'Valet Parking', 'Eco Organic Products'],
    });

    const biz2 = await Business.create({
      providerId: providerUser._id,
      name: 'Solace Thermal Bath & Spa',
      slug: 'solace-thermal-spa',
      category: 'Spas & Wellness',
      tagline: 'Mineral hydrotherapy, deep tissue release & sensory recovery',
      description: 'Solace is a subterranean sanctuary constructed from natural basalt and cedar in Bandra West, Mumbai. Featuring cedar wood dry saunas, magnesium float pools, and therapists trained in Scandinavian and neuromuscular recovery techniques.',
      address: '88 Pali Hill, Bandra West',
      city: 'Mumbai',
      postalCode: '400050',
      phone: '+91 98200 33901',
      email: 'concierge@solacespa.example.com',
      website: 'https://solacespa.example.com',
      rating: 4.85,
      reviewCount: 98,
      images: [
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      ],
      coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      openingHours: {
        Monday: '08:00 - 21:00',
        Tuesday: '08:00 - 21:00',
        Wednesday: '08:00 - 21:00',
        Thursday: '08:00 - 21:00',
        Friday: '08:00 - 22:00',
        Saturday: '08:00 - 22:00',
        Sunday: '09:00 - 20:00',
      },
      status: 'approved',
      isFeatured: true,
      isVerified: true,
      badges: ['Top Rated', 'Thermal Baths', 'Quiet Sanctuary'],
      amenities: ['Magnesium Float Pool', 'Cedar Sauna', 'Herbal Tea Lounge', 'Locker Rooms'],
    });

    const biz3 = await Business.create({
      providerId: providerUser._id,
      name: 'Apex Athletic Performance & Strength',
      slug: 'apex-athletic-performance',
      category: 'Fitness & Studios',
      tagline: 'Scientific biometric conditioning, Olympic lifting & mobility coaching',
      description: 'Apex combines elite sports science with boutique small-group guidance in Koramangala, Bengaluru. Equipped with Eleiko competition platforms, Keiser pneumatic resistance, and infrared recovery booths.',
      address: '420 80ft Road, Koramangala 4th Block',
      city: 'Bengaluru',
      postalCode: '560034',
      phone: '+91 98450 44521',
      email: 'coach@apexperformance.example.com',
      website: 'https://apexperformance.example.com',
      rating: 4.92,
      reviewCount: 84,
      images: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      ],
      coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      openingHours: {
        Monday: '06:00 - 21:00',
        Tuesday: '06:00 - 21:00',
        Wednesday: '06:00 - 21:00',
        Thursday: '06:00 - 21:00',
        Friday: '06:00 - 20:00',
        Saturday: '07:00 - 17:00',
        Sunday: '08:00 - 14:00',
      },
      status: 'approved',
      isFeatured: true,
      isVerified: true,
      badges: ['Certified Trainers', 'Olympic Gear', 'Biometrics'],
      amenities: ['Eleiko Platforms', 'Infrared Sauna', 'Towel Service', 'Protein Bar'],
    });

    const biz4 = await Business.create({
      providerId: providerUser._id,
      name: 'The Crown & Razor Grooming Parlour',
      slug: 'crown-razor-grooming',
      category: 'Barbers & Grooming',
      tagline: 'Master cutler shaves, precision taper fades & scotch lounge',
      description: 'An homage to classic barbershop craft with contemporary ergonomic styling in Connaught Place, New Delhi. Precision shear work, tailored skin fades, and eucalyptus hot towel treatments.',
      address: '19 Inner Circle, Connaught Place',
      city: 'Delhi NCR',
      postalCode: '110001',
      phone: '+91 98110 43211',
      email: 'chair@crownandrazor.example.com',
      website: 'https://crownandrazor.example.com',
      rating: 4.88,
      reviewCount: 116,
      images: [
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
      ],
      coverImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
      openingHours: {
        Monday: '10:00 - 19:00',
        Tuesday: '10:00 - 19:00',
        Wednesday: '10:00 - 19:00',
        Thursday: '10:00 - 20:00',
        Friday: '10:00 - 20:00',
        Saturday: '09:00 - 18:00',
        Sunday: 'Closed',
      },
      status: 'approved',
      isFeatured: false,
      isVerified: true,
      badges: ['Top Rated', 'Hot Towel Rituals'],
      amenities: ['Private Cutting Stations', 'Hot Towel Service', 'Custom Beard Oils'],
    });

    const biz5 = await Business.create({
      providerId: providerUser._id,
      name: 'Lumina Nail Sanctuary & Atelier',
      slug: 'lumina-nail-sanctuary',
      category: 'Nails & Beauty Care',
      tagline: 'Non-toxic Japanese gels, Russian manicures & bespoke nail art',
      description: 'Lumina is dedicated to natural nail wellness and high-fashion nail artistry in Khar West, Mumbai. Using strictly 10-free non-toxic formulations and medical-grade sterilization.',
      address: '310 Linking Road, Khar West',
      city: 'Mumbai',
      postalCode: '400052',
      phone: '+91 98200 88299',
      email: 'hello@luminanails.example.com',
      website: 'https://luminanails.example.com',
      rating: 4.79,
      reviewCount: 65,
      images: [
        'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
      ],
      coverImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
      openingHours: {
        Monday: '09:30 - 18:30',
        Tuesday: '09:30 - 18:30',
        Wednesday: '09:30 - 18:30',
        Thursday: '09:30 - 19:30',
        Friday: '09:30 - 19:30',
        Saturday: '09:00 - 18:00',
        Sunday: '10:00 - 16:00',
      },
      status: 'approved',
      isFeatured: false,
      isVerified: true,
      badges: ['Non-Toxic', 'Certified Clean'],
      amenities: ['10-Free Gel System', 'Autoclave Sterilized', 'Herbal Foot Soaks'],
    });

    const biz6 = await Business.create({
      providerId: providerUser._id,
      name: 'Prana Light Yoga & Breathwork Hub',
      slug: 'prana-light-yoga',
      category: 'Yoga & Mindfulness',
      tagline: 'Infrared heated flow, restorative sound immersion & breath mastery',
      description: 'An architectural studio enveloped in natural light, acoustic isolation, and gentle radiant infrared panels in Jubilee Hills, Hyderabad.',
      address: '715 Road No. 36, Jubilee Hills',
      city: 'Hyderabad',
      postalCode: '500033',
      phone: '+91 98490 33477',
      email: 'om@pranalight.example.com',
      website: 'https://pranalight.example.com',
      rating: 4.94,
      reviewCount: 72,
      images: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      ],
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      openingHours: {
        Monday: '07:00 - 20:30',
        Tuesday: '07:00 - 20:30',
        Wednesday: '07:00 - 20:30',
        Thursday: '07:00 - 20:30',
        Friday: '07:00 - 19:30',
        Saturday: '08:00 - 17:00',
        Sunday: '08:30 - 16:30',
      },
      status: 'approved',
      isFeatured: false,
      isVerified: true,
      badges: ['Infrared Studio', 'Certified RYT-500'],
      amenities: ['Manduka Mats Provided', 'Sound Bath Bells', 'Shower Facilities', 'Tea Bar'],
    });

    console.log('[Seed] 6 Businesses created.');

    // 3. Services
    const srv1 = await Service.create({
      businessId: biz1._id,
      name: 'Architectural Cut & Signature Blowdry',
      category: 'Hair Salons & Styling',
      description: 'Comprehensive consultation, bespoke shampoo ritual with botanical scalp massage, precision dry detailing, and voluminous editorial blowdry.',
      durationMinutes: 60,
      price: 1200,
      isPopular: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isActive: true,
    });

    const srv2 = await Service.create({
      businessId: biz1._id,
      name: 'Dimensional French Balayage & Gloss',
      category: 'Hair Salons & Styling',
      description: 'Hand-painted sunlit gradient, bond-building Olaplex step, and customized acid gloss glaze to seal radiant shine and tone.',
      durationMinutes: 150,
      price: 2800,
      isPopular: true,
      availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isActive: true,
    });

    const srv3 = await Service.create({
      businessId: biz2._id,
      name: '90-Min Neuromuscular & Hot Basalt Therapy',
      category: 'Spas & Wellness',
      description: 'Targeted deep myofascial release combined with heated volcanic basalt stones and wild arnica oil to dissolve chronic tension.',
      durationMinutes: 90,
      price: 2400,
      isPopular: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      isActive: true,
    });

    const srv4 = await Service.create({
      businessId: biz3._id,
      name: '1-on-1 Biomechanical Assessment & Strength Session',
      category: 'Fitness & Studios',
      description: 'High-speed video kinematic breakdown of squat/hinge patterns followed by an individualized 60-minute corrective training session.',
      durationMinutes: 60,
      price: 1500,
      isPopular: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      isActive: true,
    });

    const srv5 = await Service.create({
      businessId: biz4._id,
      name: 'The Executive Cut & Straight-Razor Shave',
      category: 'Barbers & Grooming',
      description: 'Tailored scissor and clipper cut, hot lather straight-edge razor shave with aromatic oils, and cold stone pore closing.',
      durationMinutes: 60,
      price: 850,
      isPopular: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isActive: true,
    });

    const srv6 = await Service.create({
      businessId: biz5._id,
      name: 'Signature Japanese Gel Manicure & Hand Therapy',
      category: 'Nails & Beauty Care',
      description: 'Dry e-file cuticle care, gentle surface prep, structural Japanese gel overlay, and botanical collagen hand massage.',
      durationMinutes: 75,
      price: 1200,
      isPopular: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isActive: true,
    });

    const srv7 = await Service.create({
      businessId: biz6._id,
      name: 'Private Infrared Breathwork & Vinyasa Alignment',
      category: 'Yoga & Mindfulness',
      description: 'Customized private session under radiant infrared warmth. Includes Pranayama breathwork, anatomical alignment, and sound bowl finale.',
      durationMinutes: 75,
      price: 950,
      isPopular: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isActive: true,
    });

    console.log('[Seed] Services created.');

    // 4. Initial Bookings
    await Booking.create({
      customerId: customerUser._id,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      customerPhone: customerUser.phone,
      businessId: biz1._id,
      businessName: biz1.name,
      businessAddress: biz1.address,
      serviceId: srv1._id,
      serviceName: srv1.name,
      price: srv1.price,
      durationMinutes: srv1.durationMinutes,
      date: '2026-10-25',
      timeSlot: '11:00 AM',
      status: 'confirmed',
      specialRequests: 'Please note scalp sensitivity to mint essential oils.',
    });

    console.log('[Seed] Database seeded with full categories successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error:', error);
    process.exit(1);
  }
};

seedDatabase();
