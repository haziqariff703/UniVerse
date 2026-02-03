# Changelog

All notable changes to this project will be documented in this file.

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
- **Student Speaker Profile - 'The Visionary Dossier'**:
  - **Holographic Card UI**: Implemented a centered, glassmorphic profile card with Framer Motion animations.
  - **Strict Access Control**: Protected `/speakers` and `/speakers/:id` routes to be accessible ONLY by logged-in students.
  - **Typography**: Integrated `Geist Mono` for technical data and `Clash Display` for headers.
  - **Minimalist Data**: Restricted view to Name, Verification, Past Events ("Ticket Stubs"), and Socials ("Connection Dock").
- **Speakers Grid Overhaul - 'The Nebula Directorate'**:
  - **Spotlight Hero**: Restructured layout to a centered "Command Line" aesthetic with a massive floating search bar.
  - **Smart Filters**: Added interactive Glass Pills to filter agents by category (Science, Tech, Arts).
  - **Visual Polish**: Integrated cinematic grain textures and "Scanner Beam" hover effects on cards.
  - **Living Interactions**: Preserved 3D Tilt physics, metadata signal strips, and Typewriter Search.
  - **Headline Upgrade**: Implemented static **White-to-Fuchsia** gradient headline (`from-white via-fuchsia-400 to-purple-500`) for high-contrast visibility.
- **Architectural Refactor**:
  - **Shared Data Layer**: Extracted `MOCK_SPEAKERS` to `@/data/mockSpeakers.js` to ensure consistent data usage across the entire platform and fix routing inconsistencies.
  - **Speaker Details Overhaul**:
    - **Routing Fix**: Resolved bug where all clicks redirected to "Dr. Elena Void" by implementing dynamic logic `MOCK_SPEAKERS.find(id)`.
    - **Premium UI Redesign**: Transformed `SpeakerDetails.jsx` into a comprehensive "Agent Dossier" with a 2-column bento layout.
    - **Enhanced Metadata**: Added "Key Achievements", "Extended Bio", and "Next Transmission" (Upcoming Events) sections.
    - **Visual upgrade**: Implemented "Active Pulse" status, "Layered Identity" cards, and stats grid (Talks/Merit/Rating).
  - **Venues Hub Refinement**: Removed emojis from "Vibe Filters" (`liveVenueStatus.js`) and replaced them with professional Lucide icons (BookOpen, Snowflake, Wifi, Users) in `Venues.jsx`.
- **Interactive Activity Log**: Implemented row selection, bulk export, and a high-fidelity "Snapshot Viewer" modal for detailed audit trail analysis. Added toast notifications for user interactions.
- **Extended Audit Log Model**: Added organizer actions (`CREATE_EVENT`, `UPDATE_EVENT`, `CHECKIN_ATTENDEE`, `CANCEL_REGISTRATION`) to enable event-level audit tracking.
- **Organizer Activity Logs API**: Created `GET /api/audit/organizer` endpoint that fetches combined audit logs and registrations for an organizer's events, with support for eventId filtering, search, date range, and pagination.
- **Real-time Activity Log UI**: Connected `ActivityLog.jsx` to the backend, replacing mock data with live audit logs and registrations. Added working search, date filters, pagination, CSV export, and dynamic KPI stats.
- **Organizer Analytics & Feedback Explorer**: Implemented real-time analytics for organizers, including KPI cards (Total Reviews, Avg Rating, Sentiment), rating distribution charts, and a "Feedback Explorer" modal to view and filter all reviews by specific events.
- **Venue & Event Fetching**: Corrected API parsing for Venues and Events to handle array responses directly, ensuring dropdowns and the roadmap are correctly populated.
- **Category Intelligence Analytics**: Implemented strategic analytics by event category.
  - **Backend**: Created `getCategoryIntelligence` endpoint aggregating revenue, attendance, ratings, and sentiment per category.
  - **Analytics Page Overhaul**: Standardized layout with aligned cards for Sentiment, Ratings, and Category Matrix. Integrated Strategic Insights into a unified high-density grid.
  - **Finance Page Refinement**: Simplified view by removing redundant activity logs and registration trends, elevating "Revenue by Category" to a primary position below main performance charts.
- **Interactive Event Roadmap**: Added manual schedule management to the organizer dashboard. Organizers can now add, edit, and clear schedule items.
- **Dynamic Task Management**: Implemented a real-time to-do list module on the dashboard with add/toggle/delete functionality and backend persistence.
- **Project Knowledge Base**: Created `knowledge.md` to document strategic insights and technical logic for academic/professional reporting.
- **Community Leadership Visibility**: Implemented automatic "Viewer" access for community leaders (AJK, President, Secretary, Treasurer, Committee) to see all events organized under their community.
  - **New Helper Function**: Created `getAccessibleEventIds(userId)` in `eventController.js` to unify access logic across ownership, crew membership, and community leadership.
  - **Updated Endpoints**: `getOrganizerFinanceStats`, `getOrganizerReviews`, `getCategoryIntelligence`, `getOrganizerTransactions` now use the unified helper for consistent visibility.

### Changed

- **Backend Event Filtering**: Updated the `getAllEvents` controller to support `status=all`, allowing organizers to see all scheduled events (including pending ones) on the roadmap.
- **Frontend Fetch Strategy**: Switched to the public `/api/venues` endpoint for better consistency across roles.

### Fixed

- **Dependencies**: Resolved "Failed to resolve import `react-hot-toast`" build error by installing missing package.

## [2026-02-01]

### Community-Led Event Management

- **Changed**: Transitioned from individual organizer model to community-led association model (all AJKs/Presidents of a club can now manage events and workforce collectively).
- **Added**: `community_id` to `Event` model and schema.
- **Added**: Backend endpoint `/api/communities/my-communities` to fetch authorized associations.
- **Improved**: `Workforce` page now supports management across multiple associations.
- **Fixed**: Authorization checks in `updateEvent` and `getEventRegistrations` to support community-wide permissions.
- **Changed**: Removed unused 'motion' and 'user' variables to resolve lint warnings.

### Added

- **Real Registration Flow Implementation**:
  - **End-to-End Persistence**: Replaced mocked registration logic in `EventDetails.jsx` and `EventCard.jsx` with real API calls to `/api/registrations`.
  - **State Synchronization**: Implemented registration fetching in `Events.jsx` to ensure "You're Going" badges reflect actual database state.
  - **Auth Integration**: Secured registration endpoints with Bearer token authentication from `localStorage`.
  - **Dynamic Capacity Updates**: Added automatic attendee count re-fetching after successful registration.

### Added

- **Community & Workforce Management System**:
  - **Backend Infrastructure**: Created `Community` and `CommunityMember` models to handle organization data and recruitment workflows.
  - **Recruitment Engine**: Implemented `/api/communities` endpoints for fetching clubs, applying for membership, and managing member statuses (Applied, Interviewing, Approved).
  - **Dual-Role Automation**: Integrated logic to automatically approve students as organizers once they are accepted into a community committee.
  - **Live Data Integration**: Refactored `Communities.jsx` to fetch and display real-time organization data and stats.
  - **Workforce Dashboard**: Developed a full recruitment Command Center in `Workforce.jsx` featuring:
    - **Applicants Queue**: Real-time management of student applications with "Set Interview" capability.
    - **Organization Council**: High-impact UI cards for Faculty Advisor and Community President.
    - **Team Roster**: Centralized management of approved committee (AJK) members.
  - **Dynamic Navigation**: Updated `StudentSidebar` to conditionally reveal the "Organizer Suite" for approved student leaders.

### Fixed

- **Real-time Social Proof**: Implemented public attendee API and wired it to `EventDetails.jsx` to show actual registration names and counts.
- **Student Merit Progress**: Integrated the `Events` dashboard with real-time student merit scores and progress tracking.
- **UI Refinement**: Removed solid black backgrounds from the Event Details page to allow global background effects to show through.
- **Mocked Registration Discrepancy**: Resolved the issue where bookings were "saved" in local session but were invisible in "My Bookings" and the database.
- **Frontend Syntax & Imports**: Cleaned up multiple parsing errors and unused/missing imports across `Events.jsx`, `EventCard.jsx`, and `EventDetails.jsx`.
- **Impure Particle Render**: Fixed React purity errors in `EventDetails.jsx` by stabilizing particle generation with `useState`.
- **JSX Fragment Consistency**: Resolved multiple "Missing Closing Tag" and "Unexpected Token" errors in `VenueManager.jsx`.
- **Lint Cleanup**: Fixed unused variables (`navigate`, `motion`) and hook dependency warnings in `Workforce.jsx` and `StudentSidebar.jsx`.

### Added

- **Frontend Approval Workflow Integration**:
  - **Rejection Modals**: Integrated sophisticated `shadcn/ui` Dialog-based rejection modals in `EventApprovals.jsx` and `OrganizerApprovals.jsx`.
  - **Backend Synchronization**: Seamlessly wired rejection reasons to the backend API.
- **Student Notification Feed (Real Data)**:
  - **Live Data Fetching**: Upgraded `Notifications.jsx` from mock signals to real-time backend data fetching (`/api/notifications`).
  - **Interaction persistence**: Implemented "Mark as Read" and "Mark All as Read" functionality synced with the database.
  - **Dynamic Chronology**: Added intelligent grouping for notifications (Today, Yesterday, Older) based on actual timestamps.
- **Administrative Logic**:
  - **Organizer Approval Workflow**: Implemented backend-to-frontend logic for elevated role transitions and status notifications.
  - **Event Approval Workflow**: integrated `rejection_reason` storage and display for organizer feedback loops.

### Fixed

- **JSX Structural Integrity**: Resolved critical syntax errors in `OrganizerApprovals.jsx` and `Notifications.jsx` caused by complex layout refactoring.
- **State Synchronization**: fixed an issue where the administrative rejection button did not correctly trigger the feedback modal.

- **Venues Hub Student Enhancements**: Transformed the Venues page into a "Live Campus Pulse" finder.
  - **Live Status Indicators**: Added real-time "Available", "Busy", and "Closed" status pulses to venue cards.
  - **Student Utility Data**: Integrated socket availability, WiFi strength, and "Next Available" slots into venue data.
  - **Smart Availability CTA**: Updated card actions to prioritize "Check Availability" over generic details.
- **Star-Field Success Animation v4.2**: Implemented cinematic registration feedback.
  - **SuccessParticles Component**: Added 40-particle spring burst animation with glowing fuchsia, violet, and cyan stardust.
  - **Glassmorphism Success Modal**: Created a personalized overlay with an animated checkmark and backdrop blur.
  - **Dynamic State Management**: Integrated automated capacity decrement and DOM cleanup post-animation.
- **Event Details Cinema Experience v4.1**: Refined typography scale for better visual balance.
  - **Typography Downscaling**: Reduced Hero titles, sidebar "FREE" text, and body headings to "normal" proportions.
  - **Tighter Layout**: Reduced card padding and section spacing for a more compact and readable interface.
- **Event Details Cinema Experience v4**: Full-bleed cinematic overhaul based on design critique.
  - **Full-Bleed Hero**: Implemented screen-width headers with deep gradient masking and parallax effects.
  - **Participant Rewards Row**: Added high-visibility glowing section for Merit, E-Certs, and Meal icons.
  - **Social Proof & Urgency**: Added friend facepiles and animated capacity progress bars.
  - **Typography**: Restyled "FREE" to "🎟️ FREE ADMISSION" with premium Clash Display badges.
  - **Motion Magic**: Integrated staggered section entrance animations and hover-to-zoom galleries.
- **Student Events Hub v3**: Transformed the Events directory into a personalized student portal.
  - **Merit Tracker Widget**: Integrated a real-time progress bar for student merit points in `Events.jsx`.
  - **⚡ Quick Join**: Implemented frictionless one-click registration directly from the `EventCard`.
  - **Social Facepiles**: Added friend avatar stacks and social engagement signals to event cards.
  - **Intelligent RSVP States**: Added conditional logic for "YOU'RE GOING" badges and `🎟️ VIEW QR CODE` buttons for today's events.
  - **4:3 Cinema Standard**: Enforced strict aspect ratio uniformity for all event event photography.
  - **Merit Pills**: Added glowing `+X Merit` badges to cards to gamify student participation.
- **Administrative Pagination & Table Controls**: Implemented comprehensive server-side pagination across 6 major administrative modules (`Events List`, `Event Approvals`, `Organizer Approvals`, `Speaker Approvals`, `Speakers List`, `Venue Manager`).
- **Data Entry Limits**: Integrated "Items Per Page" (Limit) selectors and "Previous/Next" navigation controls to manage high-density data views efficiently.
- **Search & Filter Synchronization**: Optimized fetch logic to handle search queries and facility filters directly via the API, ensuring real-time data consistency and performance.

### Changed

- **Fetch Logic**: Migrated all admin list components from client-side filtering to `useCallback`-memoized server-side fetching with support for `page`, `limit`, and `query` parameters.
- **State Management**: Standardized `currentPage`, `totalPages`, and `itemsPerPage` state across the administrative suite.

### Fixed

- **JSX Fragment Consistency**: Resolved multiple "Missing Closing Tag" and "Unexpected Token" errors in `VenueManager.jsx` caused by complex nested ternary operations.
- **Table Data Synchronization**: Fixed an issue where the `VenueManager` table was mapped to `filteredVenues` (now deprecated) instead of the fresh paginated `venues` state.

### Added

- **Admin UI Standardization**: Replaced legacy icon-based action buttons with `shadcn/ui` Dropdown Menus across all major administrative modules (`Venue Manager`, `Users List`, `Category Manager`, `Reviews List`, `Speakers List`, `Notifications Manager`, `Events List`, `Organizers List`, `Event Approvals`, `Organizer Approvals`, `Speaker Approvals`).
- **High-Density Menu Operations**: Integrated "Management Ops" dropdowns with combined icons and semantic labels (e.g., "Inspect Details", "Authorize Clearance", "Forensic Audit") to improve scannability and density.
- **Visual Intelligence**: Standardized table action columns with `MoreVertical` triggers and premium glassmorphism menu styling.

- **Admin Navbar Intelligence**: Integrated a real-time Malaysia clock (Date & Time) and a proactive "System Alerts" panel in the global admin header.
- **Alert Synchronization**: Implemented real-time tracking for Pending Events, Organizers, and Speakers with dynamic notification badges.
- **Command Center Intelligence Enrichment**: Implemented high-density KPI descriptions across all administrative modules to provide granular operational context.
- **KPI Card Standardization**: Refactored `StatCard`, `KpiCard`, and `LogKpiCard` across 12+ components to support a unified `description` prop with premium glassmorphism styling.
- **Admin Dashboard Enhancement**: Added real-time metric explanations for Events, Users, Approvals, and Bookings.
- **Audit Log Intelligence**: Integrated forensic descriptions for Logistics, Security, and Infrastructure metrics.
- **User Registry Insights**: Added identity-focused descriptions for Student, Organizer, and Admin counts.
- **Venue & Event Analytics**: enriched Venue, Event, and Category dashboards with deep-dive metadata tooltips.
- **Talent & Sentiment Metrics**: Added descriptions for Speaker diversity and Review sentiment pulse.
- **KPI subValue Standardization**: Implemented descriptive `subValue` strings across all major administrative Command Centers to provide high-density process-level context (e.g., "Policy compliance check", "Manual review required").
- **KpiCard Universal Refactor**: Standardized the `KpiCard` component structure across 10+ modules to match the premium "Intelligence Card" aesthetic from the Categories Command Center.

### Changed

- **Visual Refinement**: Standardized all low-contrast UI elements (KPI descriptions, labels, table headers) from `text-starlight/20` to `text-starlight/60` for optimal readability in dark mode.
- **Visual Refinement**: Implemented `hover:scale-[1.02]` and smooth `shadow-sm` transitions for all Intelligence Cards.
- **Typography**: Standardized internal KPI font weights and tracking for maximum legibility in high-density views.

### Fixed

- **UI Consistency**: Restored missing Lucide icons in `EventsList.jsx` KPI cards and resolved a missing `Clock` import to ensure correct rendering.
- **System Stability**: Restored corrupted filenames in `src/pages/admin` (e.g., `SpeakersPage.jsx`) and fixed a critical `Icon` syntax error in `OrganizersList.jsx` that was causing reload failures.
- **Code Integrity**: Resolved 10+ lint warnings related to unused props (`Icon`, `CardIcon`) and missing effect dependencies (`useCallback` integration) across the admin suite.
- **State Stabilization**: Optimized `UsersList` and `OrganizersList` with stable callback dependencies to prevent redundant re-renders.

- **Cinema Restoration**: Refactored the Venues Hub to match the signature /communities layout.
- **Horizontal Tabs**: Integrated horizontal pill-driven category filters.
- **Full-Width Landscape**: Restored high-impact single-column feed.
- **4:3 Aspect Ratio**: Enforced sharp visual uniformity for venue photography.
- **Environment Recovery**: Fixed critical `vite` not recognized and `EOVERRIDE` errors.
- **"All" category filter**: Added "All" category filter to Communities page.

- **TrueFocus**: Implemented a dynamic mouse-following "TrueFocus" effect for the Venues Hub header.
- **Vite Config Update**: Added an alias for `three` to force a single instance resolution, fixing the "Multiple instances of Three.js" warning.

### Changed

- **Venues Hub Cinema Expansion v3**: Fixed `ReferenceError`, decompressed card layout, and updated search logic.
- **Aesthetic Polish**: Refined Venue cards to "Compact Cinema" style (minimalist, uniform, sleeker typography).
- **Header**: Standardized "Venues Hub" size to match Communities page.
- **Imagery Fix**: Replaced Surau Ar-Razzaq image with local high-quality asset.

### Fixed

- **VenueLandscapeCard Crash**: Restored the missing `type` destructuring which caused a `ReferenceError` and broke page interactions.
- **Search & Filter Logic**: Fixed the `PlaceholdersAndVanishInput` component to properly sync its state with the parent component, resolving the issue where filters wouldn't apply correctly.
- **Mobile Responsiveness**: Adjusted the font size of the `TrueFocus` header on mobile devices to prevent layout breaking.
- **Card Animation**: Removed the `animate-pulse` class from venue cards to eliminate the unwanted "breathing" effect.
- **Venues Hub "Container Compression"**: Switched to dynamic height, 7xl width expansion.

### Improved

- **Search Logic**: Now includes `location_code` and robust category matching.

## [2026-01-30]

### Added

- **Refactor**: Implemented a compact, sidebar-driven layout for the Venues Hub.
- **Sidebar**: Added a sticky vertical sidebar with category filters (Academic, Residential, Social, Outdoor).
- **Venue Cards**: Compacted the card design with a fixed 4:3 image aspect ratio and reduced padding.
- **Header**: Scaled down the main header title and integrated the search bar into the feed flow.
- **Event Details "Cosmic Deep-Dive"**: Implemented a new premium hybrid layout for event pages with Parallax Heroes, Sticky Sidebars, and Bento Galleries.
- **Enriched Mock Data**: Added agendas, long descriptions, and galleries to all upcoming events.
- **Categories Command Center**: Overhauled the Categories module into a high-density, data-driven "Command Center".
- **Category Backend**: Created a dedicated `Category` Mongoose model and full CRUD API endpoints.
- **Intelligence Dashboard**: Integrated real-time KPI metrics for Taxonomy Depth, Active/Dormant Sectors, and Usage Velocity.
- **Expanded Forensic Filtering**: Implemented advanced filtering by Status and Usage Density (High/Low Demand/Unused).
- **Forensic UI Refinement**: Modernized `CategoryManager.jsx` with micro-animations, color-coded glows, and compact grid layouts.
- **Operational Safety Logic**: Added backend validation to prevent deletion of in-use categories.
- **Improved Audit Trail**: Integrated Category management actions into the system audit log.

### Changed

- **Dependencies**: Overridden `three` version to `0.167.1` to resolve conflicts.
- **Review Moderation UI**: Standardized header typography (capitalization removed) and aligned the Refresh button with other Command Centers.
- **Standardized Typography**: Enforced `Plus Jakarta Sans` for all administrative headers and labels.

- **PDF File Uploads**: Enable PDF upload for "Event Proposal/Documentation" in the Create Event form, backed by `multer` middleware.
- **Admin Event Management**: Complete overhaul of `EventApprovals` to a "Command Center" dashboard with KPI cards and compact data grid.
- **KPI Metrics**: Added real-time calculation for Total Pending, Capacity Alerts, and Urgent Events.
- **Search & Filter**: Implemented client-side filtering for efficient event management.
- **Capacity Validation**: Implemented visual warning in Admin dashboard when event capacity exceeds venue limits.
- **Proposal Viewer**: Added "FileText" icon button to quickly view uploaded proposals.
- **Backend Refinement**: Updated `adminController` to populate venue `max_capacity` for validation logic.
- **Venue Management Refactor**: Transformed `VenueManager.jsx` into a high-density "Command Center" layout with a wider `max-w-4xl` dialog and viewport-constrained internal scrolling (`90vh`).
- **Changed**: Standardized Audit Log UI layout (header, typography, and button) to match Venue Command Center.
- **Changed**: Overhauled `SpeakersList.jsx` into a high-density "Speaker Command Center" with KPI analytics and a registry table.
- **Added**: Speaker Command Center, global font standardization, and Speaker Proposal & Credential Verification System.
- **Changed**: Standardized global admin font to "Plus Jakarta Sans" and refined layout typography weights.
- **Fixed**: Replaced "Network Origin" with a "Forensic Risk Profile" and "Audit Identity Stamp" (Log ID) in audit logs.
- **Fixed**: Improved contrast for IDs and data snapshots in Audit Logs for better legibility.
- **Fixed**: Repaired syntax and resolved lint warnings in `VenueManager.jsx`.
- **Fixed**: Improved contrast for IDs and metadata in Audit Logs for better legibility.
- **Fixed**: Resolved `ReferenceError` in `EventApprovals.jsx` caused by `useEffect` dependency hoisting.
- **Fixed**: Repaired syntax errors and resolved lint warnings in `VenueManager.jsx` and `AuditLogList.jsx`.
- **Added**: Audit Logs Forensics Command Center with KPI cards and snapshot viewer.
- **Added**: Venue Image Uploads with real-time preview and Multer backend support.
- **Changed**: Enhanced Audit Logs API with advanced filtering and summary stats.
- **Changed**: Venue Management table now uses always-visible direct icons (Edit/Delete).
- **Dynamic Facilities System**: Implemented a checkbox-based asset selector with a manual "Add Custom Facility" feature.
- **Venue Image Header**: Added a premium image header with a smooth top-down fade effect to the venue dialog.
- **Venue KPI Cards**: Added metrics for Total Venues, Total Capacity, Premium Venues, and Unique Facilities.
- **Premium Data Grid**: Implemented a sophisticated table for venue management with action overlays and status badges.
- **Advanced Filtering**: Added search by name/location and filtering by facility type.
- **Simplified Structure**: Refactor `VenuesPage.jsx` to act as a lightweight wrapper for the `VenueManager` component.
- **User Management Redesign**: Overhauled `UsersPage` with the new "Command Center" layout.
- **Role Management**: Enhanced role switcher with color-coded badges and inline updating.
- `FeaturedEventSlider.jsx`: New cinematic auto-sliding component with interactive dot navigation, 4s interval, and frosted glass text containers.
- `mockEvents.js`: Added `FEATURED_EVENTS` array with content for IMSA, JPK Jasmine, and FiTA.

### Changed

- `Events.jsx`: Replaced static hero with `FeaturedEventSlider` and restored the 3-column grid for "Upcoming Experiences".

### Fixed

- **Fixed**: Resolved missing `@headlessui/react` dependency causing build errors (2026-01-30)
- **Fixed**: Resolved persistent `'Icon' is defined but never used` lint errors in `ReviewsList.jsx` and `CategoryManager.jsx` by implementing conditional rendering.

## [2026-01-28]

### Added

- **New Organizer Pages**: Implemented 5 high-fidelity pages for the organizer workspace:
  - **Notifications Center**: Central hub for event alerts and guest registrations.
  - **Finance Dashboard**: Revenue tracking with interactive Area Charts (Recharts).
  - **Activity Log**: Chronological timeline of management actions for accountability.
  - **Speaker Directory**: Centralized talent management with expertise tracking.
  - **Attendee Broadcast**: Mass communication tool for sending event updates.
- **Enhanced Create Event Center**: Implemented a Two-Column layout in `CreateEvent.jsx` featuring a real-time `EventRoadmap` calendar for scheduling conflict detection.
- **Advanced Organizer Schema**: Aligned event creation with backend `Venue`, `Speaker`, and `EventCrew` models, adding support for dynamic selection and multi-assignment.
- **Dynamic Form Extensions**: Added `multi-select` support to `DynamicSteppedForm.jsx` for advanced tagging and speaker management.
- **Refined Create Event Layout**: Updated `DynamicSteppedForm.jsx` to a professional, compact, minimalist design with a black container, removing `gsap` and `SpotlightCard`.
- **Unified Notifications Center**: Consolidated student and organizer notifications into a single, role-aware component in `/student/Notifications.jsx`.
- **Routing & Navigation**: Integrated the new pages into `App.jsx` routes, optimized redundant paths, and updated `MainSidebar` with corresponding icons and links.
- **Dependencies**: Added `@headlessui/react` for improved accessibility and interactive components.
- **PDF File Uploads**: Enable PDF upload for "Event Proposal/Documentation" in the Create Event form, backed by `multer` middleware.

### Changed

- **Create Event UI**: Refactored the form into a collapsible **Accordion Layout** and converted Venue selection to a native **Dropdown** for better usability.
- **Broadcast UI**: Updated the "Best Practices" container to a solid black minimalist design.
- **Speaker Cards**: Removed the "glass flip" hover effect to maintain a solid black background.

### Fixed

- **Console Stabilization** (2026-01-28 23:45):
  - Commented out failing API calls to `localhost:5000/api/events` in Home.jsx and Events.jsx
  - Now using mock data arrays until backend server is running
  - Eliminated ERR_CONNECTION_REFUSED errors flooding console
  - Cleaned console output for easier debugging

- **Styles**: Moved `@import` for Google Fonts to the top of `index.css` to fix PostCSS warning about statement order.

- **Dashboard Readability Refinement**: Transitioned all event dashboard and management containers from transparent glass to high-contrast **Solid Black Boxes** (`bg-[#050505]`).
  - **Removed SpotlightCard**: Replaced `SpotlightCard` with standard `div` containers in the dashboard header, stats ribbon (`DashboardStats`), and event cards (`EventCardCompact`).
  - **Event Roadmap**: Integrated `FullCalendar` into `MyEvents.jsx`, allowing organizers to toggle between a list grid and a calendar roadmap view for better schedule management.
  - Improved readability of the Main Header, Latest Registrations, Insights Chart, and Recent Activity.
  - Standardized styling across Schedule and Notes & Tasks for a unified, professional appearance.
  - Enhanced contrast of stat pills and metadata for better data accessibility.

- **Resolved UI Errors**:
  - Fixed `recharts` sizing and invalid `Fragment` prop errors in `InsightsPanel`.
  - Sanitized props in `DecryptedText` to remove unknown attribute DOM warnings.
  - Corrected `@import` order in `index.css` to resolve Vite HMR 500 failures.
  - **Fixed Build Errors**: Reinstalled missing `@radix-ui/react-tabs` and `@radix-ui/react-dialog` dependencies that were causing Vite resolution failures.

- **CosArt & ArtsyXpose Images**: Replaced broken Unsplash image URLs with working alternatives for proper display

- **Typography Cleanup**: Eliminated ALL Space Grotesk/Geist Mono (font-space) references throughout Communities Hub
  - Subheading now uses Plus Jakarta Sans (default) for better readability hierarchy
  - All tab labels (Academic, Leadership, Uniformed) now use Clash Display
  - Removed font-space from SearchBar, enhanced-card-hover, ClubDetailModal, and empty state components
  - Taglines remain italic with default sans-serif for elegant presentation

### Changed

- **Event Dashboard**: Overhauled the header into a "Compact Minimalist Control Bar" with **Black Glass** aesthetics.
- **Edit Event Page**: Fixed a critical runtime error and refined the design for a cleaner, more professional appearance.
- **Improved UI/UX**:
  - Replaced `SpotlightCard` with minimal **Glass Black Containers**.
  - **Standardized Typography**: Aligned the page with the global `Plus Jakarta Sans` theme, removing `font-clash` for a more consistent brand identity.
  - Streamlined layout by grouping relevant fields (Price/Capacity).
  - Updated all labels to natural, user-friendly language.
  - `DatePicker`: Integrated `react-day-picker` and `popover` for professional date selection.
  - `TimePicker`: Custom-built selection module for precise temporal control (HH:MM).
  - `Label`, `Textarea`, `Input`: Themed shadcn/ui components for consistent "Dark Glass" styling.
- **Changed**: Replaced standard HTML inputs with a compact, high-legibility "Operational Registry" layout.
- **Changed**: Implemented dynamic venue selection using a `Select` component populated from the backend.
- **UI Styling**: Established a consistent "Modern Dark Glass" theme and refined the `.scrollbar-hide` utility.
- **Changed**: Improved `EditEvent.jsx` UI/UX with `DecryptedText`, `ShinyText`, and `Magnet` components.

### Added

- **Organizer-specific venue management system**:
  - New `OrganizerVenues.jsx` and `VenueEvents.jsx` pages with a **Professional Compact Layout**.
  - Features enhanced data density (Node Status, Asset Type, Utility bars) and technical "Registry" list views.
  - Backend support for organizer venue listings and venue-specific event filtering.
  - Integrated role-based dynamic navigation for venues.
- **UI Styling**: Refined the `.scrollbar-hide` utility and established a consistent "Modern Dark Glass" theme across the organizer interface.

### Added

- **Campus Life in Motion Video Section** (2026-01-28 23:45):
  - New section on Home page between "Campus at a Glance" stats and Categories
  - YouTube video player integration using react-player (57 packages)
  - UiTM Puncak Perdana campus tour video: https://www.youtube.com/watch?v=wIqrceknPEk
  - 60/40 responsive grid layout (video left, info right, stacks on mobile)
  - Refined copy: "Discover the architecture of your journey. From the high-tech halls of FPM..."
  - Typography: Clash Display for header, default sans for description, generic monospace for timestamps
  - Button hierarchy:
    - Primary: "Browse Communities" (gradient purple→cyan, routes to /communities)
    - Secondary: "Initialize Satellite View" (ghost style, cyan border, pulsing live signal dot, links to Google Maps 3D)
  - Navigation timestamps: FPM (00:27), Student Spaces (01:15), Facilities (02:03), Recreation (02:45)
  - Glassmorphism styling with cyan/purple glow and rounded-3xl container
  - `light={true}` prop for fast page load (thumbnail preview, plays on click)

- **Communities Hub - Master Executive Implementation** (Complete Overhaul):
  - **Typography System**:
    - Clash Display for all organization titles
    - Space Grotesk for taglines, stats, tags, and technical text
    - Consistent UniVerse purple/cyan color palette
  - **Search & Filter Architecture**:
    - Minimalist search bar with "Charging Border" effect (purple/cyan glow on focus)
    - Real-time filtering across title, tagline, tags, and description
    - Clear search button with smooth animations
    - Empty state with helpful messaging
  - **Enhanced Hover Cards**:
    - 16:9 Unsplash image headers with gradient fade to card body
    - Taglines (1-line objectives) in purple
    - Color-coded pill tags (20+ tag categories: Academic, Tech, Creative, Arts, etc.)
    - Metadata row with Members count and Founded date (Lucide icons)
    - "View Details" gradient button with purple glow effect
    - Smooth hover animations with purple backdrop
  - **Official Puncak Perdana Database** (14 organizations):
    - **Academic & Faculty** (8): IMSA, CASA, Fita Teater Production, Penglipur Layar, FDT, CosArt, Hobi Kreatif, ArtsyXpose
    - **Leadership & Welfare** (4): SMF, PMH, JPK Jasmine, Kelab PEERS
    - **Uniformed Bodies** (2): PALAPES Darat, Kor SUKSIS
    - Each with: full name, tagline, description (Malay), tags, Unsplash images, member count, founded date, social media
  - **Club Detail Modal System**:
    - Shadcn Dialog with glassmorphism design
    - Full organization description and history
    - Social media links (Instagram, Email) with hover effects
    - "Contact Admin" button (mailto integration)
    - "Explore Events" button (filters /events page by club)
    - Responsive scrollable content
  - **Tab Navigation**:
    - 3-tab system: Academic, Leadership, Uniformed
    - Dynamic count badges showing filtered results
    - Lucide icons for each category (BookOpen, Users, Shield)
    - Purple selection highlight
  - **Data Architecture**:
    - Centralized club database in `/data/clubsData.js`
    - Tag color mapping helper function (20+ tag categories)
    - getAllClubs() helper for cross-category operations

### Changed

- **Communities Page**: Complete replacement of static data with official UiTM Puncak Perdana organizations
- **Card Design**: From simple text cards to rich media cards with images, tags, and metadata
- **Navigation**: From "All/Academic/Leadership/Uniformed" tabs to "Academic/Leadership/Uniformed" with search
- **Typography**: Implemented dual-font system (Clash Display + Space Grotesk)

## [2026-01-27]

### Added

### Added

- **Hero Command Center Overhaul** (The Club Command Center - Final Polish):
  - **Clash Display Typography**: Headlines only use `font-clash` at `text-5xl md:text-7xl`
  - **Flip Words Component** (Official Aceternity UI):
    - Animated word rotation: "Programs" → "Events" with smooth letter-by-letter blur/fade
    - Fixed positioning: Wrapped in `relative inline-block overflow-hidden` with `min-w-[260px] md:min-w-[320px]`
    - Added `mode="wait"` to AnimatePresence to prevent afterimages/overlapping
    - Applied `font-clash` directly to ensure consistent typography during animations
    - Removed exploding exit effect (blur/scale), now simple fade-out
  - **Default Font Consistency**: Description and buttons use `font-sans` (Plus Jakarta Sans/Inter) to match Stats section and site-wide typography
  - **Smooth Animations**: Removed Text Generate Effect (was causing jarring motion), replaced with simple fade-in
  - **New Button Styles** (Smaller Scale):
    - Primary "Enter the Galaxy": `bg-gradient-to-r from-purple-600 to-cyan-500` at `px-7 py-2.5` with `scale-1.03` hover
    - Secondary "Explore Events": Glassmorphism ghost style (`backdrop-blur-sm border-white/20`)
  - **Layout Refinements**:
    - Added `pr-32` padding-right to prevent text touching Spline
    - Description constrained to `max-w-md` for readability
    - Removed Hero Highlight - Clash Display stands alone
    - Removed Moving Beams - performance optimization
  - **Spline Scaling**: Reduced to original 1.0x size (was too large at 1.3x) with subtle breathing (`scale: [1.0, 1.02, 1.0]`)
  - **Routing**: Buttons link to `/signup` and `/events`

- **Glass Portal CTA** (Final Premium Section - Replaced MacBook):
  - **Celestial Gateway Lamp**: Purple→cyan gradient glow pulsing from top (0.4→0.7 opacity, 8s loop, `blur-[120px]`)
  - **Enhanced Dashboard Grid**: Events Calendar, Venue Map at 30% opacity (removed grayscale for color visibility)
    - Pulsing calendar dots: Scale 1→1.2→1 animation with staggered delays
    - Animated map pins: Gentle scale pulse on each location marker
  - **Gradient Text Animation**: Headline uses `bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400` with 30s infinite loop
  - **Shimmer Effect**: Sign Up button has sweeping light effect (3s duration, 2s delay, infinite loop)
  - **Dual CTA Layout** (60/40 split):
    - Left: Newsletter form with "Join the Newsletter" label, charging border animation, Subscribe button with magnetic effect
    - Right: "Create Your Identity" gradient button with shimmer + magnetic effect → `/signup`
  - **Sign In Link**: "Already a traveler? Sign In" → `/login`
  - **Fade-in-up Animations**: Title, subtitle, and CTA fade in sequentially (0.6s duration, staggered delays)
  - **Typography**: "Unlock the UniVerse. Your Puncak Perdana Pass Awaits." `text-4xl md:text-5xl font-bold tracking-tight`
  - **Layout**: `min-h-[80vh] flex items-center justify-center` - no scroll conflicts
  - **Performance**: Removed MacBook scroll component for reliability and speed
- **Cosmic Horizon Footer**:
  - **3-Column Grid**: Orbit (Home, Events, Venues), Connect (About, Map, Feedback), Signals (Instagram, GitHub, Email)
  - **Gradient Underline Links**: Purple→cyan underline animates on hover (`bg-[length:0%_2px]` → `bg-[length:100%_2px]`)
  - **UiTM Signature**: "Designed for UiTM Puncak Perdana" in `text-[10px] tracking-[0.3em] uppercase text-slate-700`, hover: purple color shift
  - **Styling**: `bg-slate-950 border-t border-white/5`, Inter Variable typography
  - **Fixed**: Now appears naturally at bottom (no z-index conflicts)
- **Infinite Moving Testimonials** (Aceternity UI): Cinematic horizontal scroll with premium enhancements:
  - Slow drift speed (80s duration) for high-end SaaS feel
  - Gradient masking: Cards fade in/out at edges (`linear-gradient(to_right,transparent,white_20%,white_80%,transparent)`)
  - Pause on hover with smooth animation-play-state
  - Scale-105 micro-interaction on hover for responsive feel
  - Premium styling: `bg-slate-950/40 backdrop-blur-xl border-white/5`
  - Purple outer glow: `shadow-[0_0_20px_rgba(168,85,247,0.1)]` → `0_0_30px` on hover
  - 5 Malaysian student testimonials (Siti Khadijah, Megat Naufal, Faris Afizuan, Nurul Aisyah, Ahmad Zaki)
  - Inter Variable typography: Names `font-semibold text-slate-200`, Faculty `text-[10px] tracking-widest text-slate-500`
  - Infinite loop with seamless cloning
  - Avatar gradient badges (purple→cyan)
- **Bento Grid Faculty Layout**: Asymmetric anti-box design with visual hierarchy:
  - Information Science: Large (4 columns) - full IM faculty prominence
  - Performing Arts: Tall (2 columns, 2 rows) - vertical FiTA emphasis
  - Creative Technology: Standard (2 columns) - cross-faculty blend
  - Digital Content: Standard (2 columns) - supporting program
- **Spotlight Border Effect**: Zero-lag mouse-following laser border using `useMotionValue` + `useSpring`:
  - Purple/cyan radial gradient follows cursor
  - Only activates on hover
  - Smooth 400px spotlight radius
  - CSS-only (no canvas rendering)
- **Abstract Gradient Shapes**: Replaced generic icons with blurred gradient orbs in top-right corner
- **NumberTicker Component**: Scroll-triggered count-up animation with smooth easing for stats display.
- **Realistic Campus Data**: Updated stats with Puncak Perdana metrics (10k students, 500 events, 2 faculties, 98% engagement).
- **Course-Based Categories**: Redesigned from cosmic themes to real academic structure:
  - Information Science (IM) - Records Management, Library Science
  - Creative Technology (IM + FiTA) - Animation, Game Design, Interactive Media
  - Performing Arts & Screen (FiTA) - Film, Theatre, Production
  - Digital Content & Writing (Cross-Faculty) - Creative Writing, Content Strategy
- **Inter Variable Font**: Premium SaaS typography with variable weights (supports custom weights like 550, 575).
- **Custom Tracking**: `tracking-tighter-plus` (-0.05em) for Vercel-style ultra-tight text.
- **3D Breathing Animation**: Spline object pulses with scale animation (1.0 → 1.04, 8s loop) for organic feel.
- **Text Drop Shadow**: `drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]` on headline for contrast against animated 3D art.
- **3D Overlap Effect**: Spline positioned with `md:-mr-24` and `z-0` to tuck behind text (text at `z-30`).
- **Background Beams**: Subtle CSS gradient nebula effect with ultra-slow pulse (8s) animation.
- **Navbar (Vercel-style)**:
  - Sliding pill hover animation using Framer Motion `layoutId`
  - Scroll blur effect triggers at 20px (`bg-black/40`, `backdrop-blur-md`)
  - Guest view: Login (ghost) + Sign Up (white capsule button)
  - Logged-in view: User dropdown with integrated theme toggle, notifications, and settings
  - max-w-1440px container for ultrawide monitor support
- **Aceternity UI Integration**: BackgroundBeams component with flattenColorPalette plugin.
- **Grain Overlay**: 2% opacity film texture for cinematic depth.

##### Added

- **Communities Logo Loop**: New section on Home page showcasing 7 association logos with infinite scroll and faculty-based glow effects (2026-01-29)
- **Noise Background Component**: Custom Aceternity-style noise background for primary buttons and cards (2026-01-29)
- **Moving Border Component**: Animated gradient border for secondary buttons (2026-01-29)
- **Spotlight Component**: Mouse-tracking radial gradient effect for event cards (2026-01-29)

### Changed

- **Home Page Hero**: Upgraded "Enter the Galaxy" button with vibrant Noise Background and "Explore Events" with Moving Border (2026-01-29)
- **Upcoming Events**: Redesigned with Spotlight cards and dynamic faculty-based color theming (Cyan for Tech, Purple for Arts) (2026-01-29)
- **Newsletter Section**: Completely redesigned into "Dual Command Cards" layout using NoiseBackgrounds (2026-01-29)
- **Typography**: Standardized all Home page section headings to Clash Display with consistent gradient accents (2026-01-29)
- **Sidebar**: Now only visible for authenticated users (hidden for guests).
- **Hamburger Toggle**: Conditionally rendered - only shows when user is logged in.
- **Hero Typography**: Reduced headline size by 10% (`text-5xl md:text-7xl`), changed to `font-semibold` (600 weight).
- **Hero Sub-headline**: Updated to "The definitive hub for student engagement and campus life." in `text-slate-400`.
- **Spline Positioning**: Moved from `15%` to `5%` horizontal translation to create "tucked behind text" depth effect.
- **Background**: Removed stars/particles, replaced with smooth gradient + 2% grain overlay for cinematic texture.
- **Cards**: All components (EventCard, Categories, StatCard) now use ghost borders (`border-white/[3%]`) and floating shadows (`shadow-[0_0_80px_rgba(0,0,0,0.95)]`).
- **Categories**: Glassmorphic cards (`bg-white/5`, `backdrop-blur-lg`, `border-white/10`).
- **EventCard**: Ghost-glass styling with hover glow effect.
- **Background**: Global navy-to-black gradient (`#020617` → `#000000`).
- **Backend**: Implemented async MongoDB connection - server now waits for DB before starting (prevents buffering timeouts).

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
- **Changed**: Standardized Admin Page layout for Speakers, Reviews, and Notifications (removed redundant back buttons).
- **Fixed**: Duplicate import syntax error in `SpeakersList.jsx`, `ReviewsList.jsx`, and `NotificationsManager.jsx`.
- **Fixed**: Runtime `TypeError` in `FloatingLines.jsx` background component.
- **Added**: Empty state UI for `SpeakersList.jsx`.
- **Added**: Page titles for new admin routes in `AdminLayout.jsx`.
- **Added**: Implemented shadcn `navbar-03` with responsive hamburger menu.
- **Added**: Implemented `ThemeContext` for Light/Dark mode support (Minimalist White Default).
- **Changed**: Refactored `MainSidebar` to be controllable via the new Navbar.
- **Removed**: Deleted legacy `TopNavbar` component.
- **Added**: Created physics-based Lanyard component and reusable StatCard for the new Profile Dashboard. (2026-01-20)
