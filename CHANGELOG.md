# Changelog

All notable changes to this project will be documented in this file.

## [2026-02-03]

### Changed

- **Personalized Mission Logs**: Updated `Events.jsx` to filter the "Mission Logs" / "Historical Archive" section to show only events the user has actually attended.
- **Enhanced Community Selector**: Replaced the horizontal button list in `Workforce.jsx` with a custom-styled glass-morphism dropdown.
- **Modernized Profile Card**: Updated `ModernProfileCard.jsx` to replace the large footer action button with a discreet "three-dot" menu for editing profile details.
- **Workforce Direct Add Fix**: Resolved 500 Internal Server Error by standardizing the role to `AJK` and ensuring automatic `organizer` role assignment for added members.
- **President Permission Fix**: Granted management rights to users with the `President` role in the Workforce dashboard, moving beyond strict ownership checks.
- **Review Visual Evidence**: Enabled photo uploads for reviews, storing "Mission Evidence" images in `public/uploads` and persisting paths in the database.
- **Student Review System**: Implemented a comprehensive feedback loop with granular "Atmos" metrics (Value, Energy, Welfare).
- **Mission Report Integration**: Integrated real review data into the `StudentDashboard` and `MissionLogCard`, replacing randomized mock scores.
- **Review Submission API**: Created `createReview` endpoint in `eventController.js` with check-in validation and multipart/form-data support.
- **Backend Review Population**: Updated `getMyBookings` to automatically attach user reviews to registration records.
- **Integrated Review UI**: Added "Rate Event" button to `MyBookings.jsx` and connected `ReviewModal.jsx` for real-time submissions.
- **Treasurer Finance Access**: Granted Treasurers specific access to the Finance module while maintaining restricted views for other management features.
- **AJK Permission Gateway**: Automated `organizer` role assignment and restricted sidebar views for newly approved committee members.

### Fixed

- **Review Submission Safety**: Resolved "onSubmit is not a function" error by adding prop validation and `readOnly` support.
- **Mission History Scoring**: Fixed logic to display actual user ratings on a 10-point scale in the dashboard.
- **Server Stability**: Fixed a critical syntax error in `eventController.js` where duplicate closing brackets caused a system crash.
- **Treasurer Routing**: Fixed a bug where Treasurers were incorrectly redirected away from the Finance route in `ProtectedRoute.jsx`.

## [2026-02-02]

### Added

- **Enhanced Event Roadmap Tooltips**: Redesigned the "Schedule Overview" tooltips with a richer UI, including category badges, correct ticket pricing (RM vs FREE), attendee capacity tracking, and merit points display.
- **Organizer Finance & Revenue Dashboard**: Launched a real-time financial tracking center for organizers to monitor revenue from paid events.
- **Financial Analytics Engine**: Implemented backend logic to calculate total revenue, ticket sales volume, and average ticket price using live registration data.
- **Revenue Performance Tracking**: Integrated monthly performance charts showing revenue trends and registration growth.
- **Transaction Explorer & Export**: Created a detailed transaction history modal with CSV export capabilities for financial reporting.
- **Dynamic KPI Growth Trends**: Enhanced finance cards to display real-time month-over-month growth percentages calculated from live registration data.
- **Insight Panel**: Added a registration trend insight card with a mini bar chart visualization showing recent activity trends.
- **Recent Activity Feed**: Integrated a live activity stream showing the latest registrations across all organizer events with relative timestamps.
- **MyEvents Command Center Enhancement**: Upgraded `DashboardStats.jsx` to fetch real-time analytics including dynamic growth trends for Total Events, Total Attendees, Monthly Growth, and Active Venues.
- **Live Insights Panel**: Updated `InsightsPanel.jsx` to display real-time registration trends, dynamic sparkline charts, and the 5 most recent registration activities sourced from backend data.
- **Event-Specific Analytics API**: Created `/api/events/:id/analytics` endpoint returning event-specific registration trends (7-day chart), combined activity feed (registrations + audit logs), and insight summaries.
- **Context-Aware InsightsPanel**: Enhanced `InsightsPanel` component to accept an `eventId` prop, displaying event-specific data when viewing an individual EventDashboard.
- **Interactive Activity Log**: Implemented row selection, bulk export, and a high-fidelity "Snapshot Viewer" modal for detailed audit trail analysis. Added toast notifications for user interactions.
- **Extended Audit Log Model**: Added organizer actions (`CREATE_EVENT`, `UPDATE_EVENT`, `CHECKIN_ATTENDEE`, `CANCEL_REGISTRATION`) to enable event-level audit tracking.

## [2026-02-02]

- **Added**: Full Organizer/Club Proposal system.
- **Added**: `ClubProposal` model and controller for student club requests.
- **Added**: Backend API endpoints `POST /api/proposals` and `GET /api/proposals/my-proposals`.
- **Added**: Integrated Club Proposal review modal in Admin `OrganizerApprovals` UI.
- **Changed**: Automated community creation upon organizer approval. Approved students are now automatically assigned as 'President' and owner of their new organization.
- **Changed**: Enhanced Admin `getPendingOrganizers` to populate associated proposals for better moderation.
- **Changed**: Improved role-based sidebar logic in `App.jsx`. Organizers and Association roles now correctly retain the premium glassy sidebar (`StudentSidebar`) instead of falling back to legacy layouts.
- **Fixed**: Real-time session synchronization. Role and approval updates are now proactively pushed to the UI on navigation and window focus, granting students immediate access to the Organizer Suite.
- **Changed**: Refined `StudentSidebar` icons to match the design system (e.g., Analytics now uses `TrendingUp`).
- **Fixed**: Multi-role synchronization issue where role updates were not immediately reflected in the frontend session.
- **Fixed**: UI bug in `OrganizerApprovals` where the table would sometimes break on empty proposal metadata.

## [2026-01-31]

- **Professional Overhaul (v10)**: Re-standardized student workspace for premium corporate aesthetic.
  - **Dashboard Reversion**: Restored full-bleed layout, removed container constraints, and eliminated fixed student sidebar.
  - **Terminology Shift**: Shifted from sci-fi "Missions/Ranks" to professional context (**Upcoming Schedule**, **Participation History**, **Merit Status**, **Live Status**).
  - **Booking Evolution**: Completely refactored `MyBookings.jsx` into a high-end **Digital Pass Wallet**.
    - **Ticket Card UI**: Implemented segmented digital passes with perforation effects.
    - **Header**: Added `TrueFocus` dynamic title to "My Bookings".
    - **Sliding Tabs**: Created a custom glass-pill tab switcher using Framer Motion.
  - **Venues Hub Finalization**: Integrated **Vibe Tags assistant**, `rounded-[2.5rem]` geometry, and strictly enforced `Geist Mono` for all data visualizations.
- **Real Data Integration & Compact UI Refinement**:
  - **Live Data**: Synced `MyBookings.jsx` with `UPCOMING_EVENTS` and `PAST_EVENTS` from `mockEvents.js`.
  - **Venue Consistency**: Auto-populated pass locations from real event venue data.
  - **Compact Typography**: Reduced event title scales for a tighter, more professional ticket aesthetic.
  - **Direct Linking**: Wired "View Details" buttons directly to the `/events/:id` portal for seamless navigation.
- **Signal Center Refactor (Notifications)**:
  - **Visual Overhaul**: Transformed the notifications list into a "Signal Center" with `TrueFocus` headers and aurora backgrounds.
  - **Signal Cards**: Implemented `rounded-[2.5rem]` glass cards with color-coded **Halo Glows** (Green/Blue/Rose) for instant status recognition.
  - **Chronological Logic**: Grouped alerts by "Today", "Yesterday", and "Older" for better cognitive load management.
  - **Hero HUD**: Added a minimalist glass tab switcher for "All" vs "Unread" filtering.
