# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-01-10

### Changed

- **2026-01-12**: Replaced `Dither` background component with "Liquid Ether" from React Bits.
- **2026-01-12**: Fixed visibility issue with Liquid Ether background by making body background transparent and moving background color to the component container.
- **2026-01-13**: Renamed `Dither` component file and export to `LiquidEther` (`src/components/backgrounds/Liquid_Ether.jsx`).
- **2026-01-13**: Implemented Dynamic UI updates (staggered text, 3D tilt cards, scroll-aware navbar).
- **2026-01-13**: Replaced `LiquidEther` with `DarkVeil` component for improved background aesthetics.
- **2026-01-13**: Added `react-router-dom` and implemented client-side routing (`Home`, `Login`, `Signup`).
- **2026-01-13**: Created authentication pages (`Login.jsx`, `Signup.jsx`) with glassmorphism design.
- **2026-01-13**: Enhanced UI buttons with vibrant gradients in Navbar and Hero sections.
- **2026-01-13**: Updated `App.jsx` to show Navbar on authentication pages for better navigation.
- **2026-01-13**: Increased top padding in `Login.jsx` and `Signup.jsx` for better visual separation from the Navbar.
- **2026-01-13**: Updated `App.jsx` to show Footer on authentication pages, making the layout consistent globally.
- **2026-01-13**: Implemented minimalist, Gen-Z styled `Events.jsx` page with search, categories, and grid view.
- **2026-01-13**: Created `EventDetails.jsx` page with immersive hero section, glassmorphic panels, and registration flow.
- **2026-01-13**: Integrated routing for `/events` and `/events/:id` in `App.jsx`.
- **2026-01-13**: Fixed blank screen issue on Events page by correcting imports and restore full implementation in `EventCard.jsx`.
- **2026-01-13**: Configured "Events" link in `Navbar.jsx` and "View All" button in `Home.jsx` to correctly navigate to `/events`.

- **2026-01-10**: Configured project for shadcn/ui:
  - Created `jsconfig.json` with `@` alias pointing to `./src`.
  - Updated `vite.config.js` to resolve `@` alias using `path` and `url` (ESM compatible).
- **2026-01-10**: Restructured `src/components` directory:
  - Created `layout`, `common`, `home`, `backgrounds` subdirectories.
  - Moved components to appropriate subfolders to support shadcn/ui organization.
  - Updated imports in `App.jsx` and `FOLDER_STRUCTURE.md`.
- **2026-01-10**: Implemented Backend API:
  - Created `middleware/auth.js` with JWT authentication and role-based authorization.
  - Created `controllers/authController.js` with register, login, and getMe functions.
  - Created `routes/authRoutes.js` for authentication endpoints.
  - Expanded `controllers/eventController.js` with full CRUD (Get, GetById, Create, Update, Delete).
  - Updated `routes/eventRoutes.js` with protected routes.
  - Created `controllers/registrationController.js` with event registration, my-bookings, cancel, and check-in.
  - Created `routes/registrationRoutes.js` for registration endpoints.
  - Updated `index.js` with new routes and global error handler.
- **2026-01-10**: Updated typography: Replaced Orbitron/Inter with Manrope (Header) and Raleway (Text)
- **2026-01-10**: Updated `.agent/rules/antigravityreactrules.md` to include mandatory changelog logging requirement
- **2026-01-10**: Renamed folder from `universeclient--` to `universe-client`
- **2026-01-10**: Updated `package.json` name to `universe-client`
- **2026-01-10**: Updated `index.html` title to "UniVerse Client"

### Fixed

- **2026-01-10**: Fixed Dither background not covering full page (z-index and transparency issues)
- **2026-01-11**: Fixed incorrect `.env` file path in `universe-server/index.js` causing database connection errors
- **2026-01-11**: Resolved missing `tailwindcss-animate` dependency in `universe-client` by running `npm install`

### Added (Models)

- **2026-01-10**: Created `venue.js` model with location_code, max_capacity, facilities
- **2026-01-10**: Created `auditLog.js` model for security tracking
- **2026-01-10**: Created `notification.js` model with user_id reference
- **2026-01-10**: Created `review.js` model with event_id and user_id relationships

### Changed (Models - ERD Alignment)

- **2026-01-10**: Updated `user.js` - Added 'staff' to role enum
- **2026-01-10**: Updated `event.js` - Added `organizer_id`, `speaker_ids`, `duration_minutes` per ERD
- **2026-01-10**: Updated `registration.js` - Added `status`, `qr_code_string`, `user_snapshot` per ERD

### Removed

- **2026-01-10**: Deleted `speakers.js` (replaced with corrected `speaker.js`)

---

## Version History

### [0.1.0] - 2026-01-10

- Initial development release
- Basic UI components
- 3D Dither background effect
- Event fetching from backend API
