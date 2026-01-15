# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-01-15

### Added

- **2026-01-15**: Created `adminController.js` with dashboard stats, user management (CRUD), and event listing endpoints.
- **2026-01-15**: Created `adminRoutes.js` with RBAC-protected routes (admin-only access).
- **2026-01-15**: Created `UsersList.jsx` component with search, role filter, pagination, role update, and delete functionality.
- **2026-01-15**: Created `seedAdmin.js` utility script to generate initial admin account.

### Changed

- **2026-01-15**: Refactored `AdminDashboard.jsx` to fetch real data from API, added view switching for Overview/Users List/Events Control.
- **2026-01-15**: Updated `universe-server/index.js` to register `authRoutes` and `adminRoutes`, fixed duplicate dotenv config.
- **2026-01-15**: Fixed `MONGO_URI` in `.env` to explicitly target `UniVerse` database instead of default `test`.
- **2026-01-15**: Added explicit `dbName: 'UniVerse'` option to `mongoose.connect` and logging to verify connected database name.
- **2026-01-15**: Implemented `Login.jsx` with full API integration, error handling, loading states, and role-based navigation.
- **2026-01-15**: Implemented `Signup.jsx` with full API integration, student ID field, error handling, and loading states.
- **2026-01-15**: Updated `AdminDashboard.jsx` with client-side RBAC protection (redirects unauthorized users) and added a Logout function.
- **2026-01-15**: Updated `User` model to include 'organizer' in role enum.
- **2026-01-15**: Updated `authController.js` to allow role selection (Student/Organizer) during registration.
- **2026-01-15**: Updated `Signup.jsx` to include role selection dropdown.
- **2026-01-15**: Created `ProtectedRoute.jsx` for authentication and role-based route protection.
- **2026-01-15**: Refactored `Navbar.jsx` with dynamic role-based navigation (Guest/Student/Admin/Organizer views).
- **2026-01-15**: Updated `App.jsx` to wrap sensitive routes with `ProtectedRoute`.
- **2026-01-15**: Created `Profile.jsx` page for users to edit their name and password.
- **2026-01-15**: Created `userController.js` with `updateProfile` endpoint.
- **2026-01-15**: Created `userRoutes.js` and registered in `index.js`.

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
- **2026-01-13**: Implemented `MyBookings.jsx` page for user registration history with glassmorphism styling.
- **2026-01-13**: Created `AdminDashboard.jsx` featuring system statistics, performance leaderboards, and cosmic activity feed.
- **2026-01-13**: Designed `CreateEvent.jsx` with a multi-step "Launch" flow for event organizers.
- **2026-01-13**: Updated `App.jsx` and `Navbar.jsx` to include routing and navigation for the new pages.
- **2026-01-13**: Created `News.jsx` displaying university updates with animated cards and `GradientText`.
- **2026-01-13**: Created `Communities.jsx` for browsing student clubs.
- **2026-01-13**: Implemented `ClubDetails.jsx` dynamic page for viewing specific club information.
- **2026-01-13**: Developed `JoinClubModal` for membership applications with success animation.
- **2026-01-13**: Fixed blank screen issue on Club Details page by replacing `framer-motion` components with CSS-only animations to improve stability.
- **2026-01-13**: Removed "Admin" and "Create Event" links from the main Navbar to streamline user navigation.
- **2026-01-13**: Updated active category button on `Events.jsx` to use a purple gradient for better visibility.
- **2026-01-13**: Enhanced `EventCard` "View Details" button with a purple gradient on hover for better visual feedback.
- **2026-01-13**: Implemented **Venues System**: Created `Venues.jsx` listing page and `VenueDetails.jsx` with facility icons and relevant mock events.
- **2026-01-13**: Implemented **Speakers System**: Developed `Speakers.jsx` grid view and `SpeakerDetails.jsx` profile page with bio and event history.
- **2026-01-13**: Implemented **Notifications System**: Created `Notifications.jsx` center with filtering and "mark as read" functionality.
- **2026-01-13**: Fixed blank screen issue by correcting syntax error in `Notifications.jsx` and replacing `framer-motion` with CSS animations for better stability.
- **2026-01-13**: Updated **Navbar** to include links for "Venues" and "Speakers", and added a Notification bell icon.

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
