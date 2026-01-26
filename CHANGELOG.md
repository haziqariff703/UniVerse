# Changelog

## [2026-01-27]

### Fixed

- **Event Dashboard**: Fixed visibility issues by switching default theme to Dark Mode (aligning with `text-white` styling).
- **Event Dashboard**: Improved error message styling to ensure visibility on all backgrounds.
- **API**: Fixed critical bug where `my-events` endpoint was unreachable because it was shadowed by the generic `/:id` route.
- **Event Dashboard**: Fixed blank screen/crash issue by adding robust data safeguards for registration filtering and Chart rendering.
- **Event Dashboard**: Fixed blank screen/crash issue by adding robust data safeguards for registration filtering and Chart rendering.
- **Event Dashboard**: Removed interfering grid background to match the application aesthetic.
- **Event Dashboard**: Added `ErrorBoundary` to catch and display runtime errors for easier debugging.
- **Event Dashboard**: Decoupled event and registration fetching to prevent "Event not found" error when registrations fail to load (e.g. for new events).
- **Sidebar**: Fixed crash when viewing organizer event routes; divider items were not handled in render loop, causing React to crash when trying to render `undefined` as a component.
- **API**: Fixed critical bug where `/api/registrations/...` routes were never mounted in `server/index.js`, causing 404 errors on the Event Dashboard.

## [2026-01-26]

### Added

- **Background**: Implemented global `StarsBackground` using `@animate-ui` (excluded from admin routes).
- **Navbar**: Added UniVerse logo and Rocket icon to the student navbar.

- **Club Proposal**: Added `ClubProposalForm` and `/start-club` page for students to request new organizations.
- **Club Proposal**: Refactored proposal form into a multi-step stepper wizard using `@react-bits/Stepper-HTML-TW` for enhanced UX/UI.

### Changed

- **Sidebar**: Refactored `MainSidebar` to be fully collapsible (width 0) instead of showing icon-only mode.
- **Sidebar**: Removed duplicate logo from the sidebar header.
- **Cleanup**: Removed unused `Dark_Veil` and `Squares` background components.

## [2026-01-21]

### Fixed

- **Navigation**: Corrected "My Events" sidebar link for organizers to point to `/organizer/my-events` instead of public events page.
- **Event Dashboard**: Uncommented "Scan QR" button to enable navigation to check-in functionality.
- **DynamicSteppedForm**: Added missing `motion` import from `framer-motion`.
- **DynamicSteppedForm**: Replaced `useGSAP` hook with standard `useEffect` to fix React 19 compatibility issue causing "Invalid hook call" error that prevented organizer pages from loading.
- **Tailwind Config**: Resolved ambiguous `cubic-bezier` class warnings by adding `spring` and `spring-extra` custom easing utilities and updating usages in `Navbar03`.

## [2026-01-20]

### Changed

- **Profile Page**: Moved navigation from sidebar to top navbar using `Navbar07` component.
- **Navbar07**: Added `tabs`, `activeTab`, `onTabChange`, and `onSignOut` props for flexible navigation.
- **Navbar07**: Fixed import paths from `~/` to `@/` to match project's Vite alias.
- **Lanyard**: Fixed physics simulation crash caused by undefined `pin` variable.

## 2026-01-20

- **Added**: Implemented Audit Trail System including `AuditLog` model, controller, and routes.
- **Added**: Frontend Audit Logs page with filtering and pagination at `/admin/audit-logs`.
- **Added**: Audit logging for critical admin actions (Event Approve/Reject, User Delete, Venue Create/Update/Delete).
- **Changed**: Updated `AdminSidebar` to include Audit Logs link and synced logo with main sidebar.
- **Changed**: Adjusted Admin Page Layout padding for consistency.
- **Added**: Implemented shadcn `navbar-03` with responsive hamburger menu.
- **Added**: Implemented `ThemeContext` for Light/Dark mode support (Minimalist White Default).
- **Changed**: Refactored `MainSidebar` to be controllable via the new Navbar.
- **Removed**: Deleted legacy `TopNavbar` component.
- **Added**: Created physics-based Lanyard component and reusable StatCard for the new Profile Dashboard. (2026-01-20)
