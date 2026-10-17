# Aurora — Local Services Discovery & Booking Platform

**HACKVIBE Round 1 | Phase 1 Frontend Implementation**

Aurora is a local services discovery and appointment booking platform designed to connect discerning clients with salons, thermal spas, wellness sanctuaries, fitness studios, and master grooming parlours.

The frontend is built with **React 18**, **Vite 6**, **Tailwind CSS 3**, **Redux Toolkit**, and **React Router v6**, adhering to an **MVC (Model-View-Controller)** architecture and strict compliance with the **Renault Design Specification (`DESIGN-renault.md`)**.

---

## 1. Quick Start & Local Execution

This project is completely self-contained for Phase 1. It does **not** require any backend, Node/Express server, MongoDB database, or environment variables.

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+ or v11+)

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

The Vite dev server will start instantly at `http://localhost:3000`.

---

## 2. Design System Compliance (`DESIGN-renault.md`)

Aurora strictly enforces the design principles and tokens specified in `DESIGN-renault.md`:

### Palette Tokens
- **Brand Accent:** Sunlight Yellow (`#ffed00` / `primary`) reserved strictly for high-impact CTAs, "NEW" badges, and accent promo tiles. Yellow is always paired with black (`on-primary: #000000`), never white.
- **Storytelling Canvas:** Two-tone canvas cycle between white catalogue mode (`#ffffff` / `canvas`) and black storytelling mode (`#000000` / `surface-dark`, `#111111` / `surface-deep`).
- **Hairlines:** Structural borders use `hairline` (`#f2f2f2`) and `hairline-strong` (`#000000`) rather than arbitrary drop shadows.
- **Semantic States:** Functional colors (`#be6464` error, `#8dc572` success, `#f0ad4e` warning).

### Typography Scale
Set in **NouvelR** (with licensed open-source substitutes **Inter Tight** and **Manrope** imported from Google Fonts):
- `display-xl`: 56px, 700, line-height: 0.95 (clamped across mobile breakpoints)
- `display-lg`: 40px, 700, line-height: 0.95
- `heading-lg`: 24px, 700, line-height: 0.95
- `heading-md`: 20px, 700, line-height: 0.95
- `body-md`: 16px, 400, line-height: 1.4
- `button-md`: 14.4px, 700, line-height: 1.0, letter-spacing: 0.144px

### Geometry & Shape Discipline
- **Square Corners Dominate:** Product cards, promo tiles, photo containers, and inputs use `rounded: none` (0px).
- **Buttons:** Subtle near-flat corner radius `rounded: xs` (2px).
- **Sub-Nav Pills & Badges:** `rounded: pill` (46px) or `rounded: full` (9999px) reserved exclusively for category rails and status badges.
- **Photography:** Full-bleed square-cornered photography with text stacked beneath, never overlaid.

---

## 3. Genuine MVC Architecture

Aurora is structured using clear architectural separation of concerns:

```text
src/
├── app/
│   ├── App.jsx             # Top-level React application root
│   ├── router.jsx          # Client-side route tree & role layout groups
│   └── store.js            # Redux Toolkit store assembling feature slices
├── models/                 # Domain entity definitions
│   ├── User.js             # User model with role predicates
│   ├── Business.js         # Business / provider profile entity
│   ├── Service.js          # Service offering entity with duration & price formatting
│   ├── Booking.js          # Appointment booking lifecycle entity
│   ├── SupportingModels.js # Category, Review, Notification, Report models
│   └── index.js
├── views/                  # Presentation Layer
│   ├── components/         # Reusable UI primitives (Button, Input, Badge, Cards, Modal)
│   ├── layouts/            # Shared layouts (RootLayout, CustomerLayout, ProviderLayout, AdminLayout)
│   ├── customer/           # Public & Customer views (Home, Discover, Detail, BookingWizard, Bookings, Profile)
│   ├── provider/           # Provider portal views (Dashboard, Business, Services CRUD, Availability, Bookings)
│   ├── admin/              # Admin governance views (Dashboard, Users, Moderation, Reports)
│   └── NotFoundPage.jsx    # 404 handler
├── controllers/            # Workflow Coordination Layer
│   ├── authController.js       # Login, registration, role-switching, profile updates
│   ├── businessController.js   # Search, filters, business details, reviews
│   ├── bookingController.js    # Multi-step booking wizard, slot availability, confirmation, cancellation
│   ├── providerController.js   # Service CRUD, operating hours, booking approval/completion
│   └── adminController.js      # User status toggles, business approvals/suspensions, report resolutions
├── repositories/           # Data-Access Abstraction Layer
│   ├── userRepository.js
│   ├── businessRepository.js
│   ├── serviceRepository.js
│   ├── bookingRepository.js
│   ├── reviewRepository.js
│   └── reportRepository.js
├── services/               # Reusable Cross-Cutting Services
│   ├── storageService.js       # Session-backed persistence sync
│   └── validationService.js    # Form input, email, phone, and booking validators
├── features/               # Redux Toolkit Shared Slices
│   ├── auth/authSlice.js
│   ├── businesses/businessSlice.js
│   ├── bookings/bookingSlice.js
│   ├── provider/providerSlice.js
│   └── admin/adminSlice.js
├── data/
│   └── mockData.js         # Rich, consistent mock dataset with service imagery
└── styles/
    ├── tokens.css          # Raw CSS variables from DESIGN-renault.md
    ├── components.css      # Component style definitions
    └── globals.css         # Tailwind directives & base styling
```

---

## 4. Role-Based Experiences & Walkthrough

The platform provides an interactive **Role Switcher** in the top navigation bar to test all three user perspectives:

### A. Customer Experience
1. **Landing & Discovery:** Search by keywords, category pills, city locations, and sort options.
2. **Business Detail:** Inspect rich descriptions, photos, amenities, operating hours, service prices, and customer reviews.
3. **End-to-End Booking Wizard:**
   - Step 1: Select service.
   - Step 2: Pick date and view verified open time slots.
   - Step 3: Review summary, input contact details, and add special requests.
   - Step 4: Instant confirmation with reference ID and calendar entry.
4. **Customer Area:** View active upcoming bookings, past history, self-service cancellation with reason prompt, profile management, and notification alerts.

### B. Service Provider Portal
1. **Operational Dashboard:** Real-time metrics calculated from actual mock bookings: Total Bookings, Upcoming Appointments, Pending Inbound Requests, and Gross Revenue.
2. **Business Profile:** Edit business name, category, address, contact numbers, and descriptions.
3. **Services Catalogue CRUD:** Add new services, edit durations and prices, or delete offerings with confirmation.
4. **Availability & Hours:** Set weekly opening hours or mark days closed. Changes propagate to the booking wizard.
5. **Inbound Booking Operations:** Confirm pending bookings, decline with reasons, or mark completed.

### C. Administrator Governance
1. **Admin Dashboard:** Platform summary metrics (total accounts, active establishments, pending moderations, active reports).
2. **User Management:** Search and filter users by role, inspect accounts, and toggle between Active and Suspended states.
3. **Business Moderation:** Review newly submitted establishments (e.g. *Nordic Cryo & Kinetic Recovery*) with 1-click Approve or Reject actions.
4. **Quality & Trust Reports:** Review customer reports and conclude investigations.

---

## 5. Technology Stack Summary

| Technology | Purpose |
|---|---|
| **React 18** | Declarative Component Architecture |
| **Vite 6** | Ultra-fast local dev runtime and production bundler |
| **Tailwind CSS 3** | Utility styling custom-configured to `DESIGN-renault.md` tokens |
| **React Router v6** | Client-side routing with nested layout groups |
| **Redux Toolkit** | Centralized application state & feature-based selectors |
| **Lucide React** | Monochrome, lightweight SVG interface icons |

---

## 6. Phase 1 Boundary

- **No backend, Express server, or database connection is required.**
- Mock repositories interact through clean JavaScript abstractions that can be swapped for REST/GraphQL API clients in Phase 2 without rewriting presentation views.
- Session storage ensures user actions (created bookings, edited services, moderation approvals) persist seamlessly across browser refreshes during local testing.