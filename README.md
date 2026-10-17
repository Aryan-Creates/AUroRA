# AUroRA — Local Services Discovery & Booking Platform

**HACKVIBE Round 1 | System Architecture & Folder Separation**

AUroRA is a full-stack local services discovery and appointment booking platform designed according to the **Renault Design Specification (`DESIGN-renault.md`)**.

The repository is systematically organized into three dedicated workspaces:

- **`frontend/`**: Modern React 18 + Vite 6 + Tailwind CSS 3 client application (MVC pattern with Redux Toolkit).
- **`backend/`**: Express.js REST API server with JWT authentication, RBAC authorization, booking conflict resolution, and MongoDB aggregation pipelines.
- **`database/`** (also accessible as **`databse/`**): MongoDB Mongoose schemas, seed scripts, fixture datasets, and complete data dictionary documentation (`SCHEMA.md`).

---

## 1. Directory Structure

```text
AUroRA/
├── DESIGN-renault.md         # Immutable Renault Design System Specification
├── README.md                 # Project Overview & Architecture Guide
├── package.json              # Root workspace orchestrator
│
├── frontend/                 # Client Application
│   ├── index.html            # Vite HTML entry point
│   ├── vite.config.js        # Vite configuration & server proxy
│   ├── tailwind.config.js    # Renault design tokens & typography
│   ├── postcss.config.js     # PostCSS configuration
│   ├── package.json          # Frontend dependencies & scripts
│   ├── dist/                 # Production distribution bundle
│   └── src/                  # React application code
│       ├── app/              # Router, Redux store, and route guards
│       ├── controllers/      # MVC controllers (Auth, Business, Booking)
│       ├── data/             # Initial datasets & constants
│       ├── models/           # Domain models & validation
│       ├── repositories/     # Repository layer (local storage & remote API)
│       ├── services/         # API client & local persistence services
│       └── views/            # UI components, layouts, customer/provider/admin pages
│
├── backend/                  # Server Application
│   ├── package.json          # Backend dependencies & scripts
│   ├── .env                  # Environment configuration
│   ├── .env.example          # Environment template
│   └── src/
│       ├── config/           # Database and environment configurations
│       ├── controllers/      # REST API route controllers
│       ├── middleware/       # JWT auth, RBAC, error handling, rate limiting
│       ├── models/           # Mongoose entity models
│       ├── scripts/          # Seed runners
│       ├── services/         # Business logic services (Auth, Booking, Availability)
│       └── server.js         # Express HTTP server setup
│
└── database/                 # Database Layer (symlinked as databse/)
    ├── package.json          # Database scripts & dependencies
    ├── SCHEMA.md             # Complete Mongoose schemas & ER diagram
    ├── config/               # Database connection utilities
    ├── fixtures/             # Seedable JSON fixtures
    ├── schemas/              # Mongoose schema definitions
    └── seeds/                # Database seeder scripts (seed.js)
```

---

## 2. Quick Start & Execution

### Starting the Full Platform

From the repository root:

```bash
# 1. Seed the MongoDB database with initial sample data
npm run seed:database
# or: npm run seed:backend

# 2. Launch backend server (http://localhost:5000)
npm run dev:backend

# 3. Launch frontend dev server (http://localhost:3000)
npm run dev:frontend
```

### Running Each Layer Individually

#### Frontend (`frontend/`)
```bash
cd frontend
npm run dev      # Starts Vite development server at http://localhost:3000
npm run build    # Produces optimized production bundle in frontend/dist
npm run preview  # Previews production build
```

#### Backend (`backend/`)
```bash
cd backend
npm run dev      # Starts nodemon development server at http://localhost:5000
npm run seed     # Resets & seeds MongoDB with users, businesses, services, and bookings
npm start        # Starts production Express server
```

#### Database (`database/` or `databse/`)
```bash
cd database
npm run seed     # Populates local MongoDB (mongodb://127.0.0.1:27017/aurora)
```

---

## 3. Design System Compliance (`DESIGN-renault.md`)

The frontend strictly adheres to the visual design rules outlined in `DESIGN-renault.md`:
- **Color Palette:** Sunlight Yellow (`#ffed00`) scarcity rule (sparingly applied to primary CTAs and badges, paired with black), two-tone canvas switching, hairline borders (`#f2f2f2` / `#000000`).
- **Typography:** Display & Heading tokens set in **Inter Tight** and **Manrope** with line-height `0.95`.
- **Geometry:** Square corners (`rounded: none`) for cards, tiles, photos, and inputs; `rounded: xs` (`2px`) for buttons.
- **Indian Localization:** Currency formatted in Indian Rupees (`₹`), with primary service coverage across Indian metro hubs (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune).