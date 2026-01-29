# Changelog

## [2026-01-30]

### Added

- **PDF File Uploads**: Enable PDF upload for "Event Proposal/Documentation" in the Create Event form, backed by `multer` middleware.
- **Admin Event Management**: Complete overhaul of `EventApprovals` to a "Command Center" dashboard with KPI cards and compact data grid.
- **KPI Metrics**: Added real-time calculation for Total Pending, Capacity Alerts, and Urgent Events.
- **Search & Filter**: Implemented client-side filtering for efficient event management.
- **Capacity Validation**: Implemented visual warning in Admin dashboard when event capacity exceeds venue limits.
- **Proposal Viewer**: Added "FileText" icon button to quickly view uploaded proposals.
- **Backend Refinement**: Updated `adminController` to populate venue `max_capacity` for validation logic.
- **User Management Redesign**: Overhauled `UsersPage` with the new "Command Center" layout.
- **Role Management**: Enhanced role switcher with color-coded badges and inline updating.
- `FeaturedEventSlider.jsx`: New cinematic auto-sliding component with interactive dot navigation, 4s interval, and frosted glass text containers.
- `mockEvents.js`: Added `FEATURED_EVENTS` array with content for IMSA, JPK Jasmine, and FiTA.

### Changed

- `Events.jsx`: Replaced static hero with `FeaturedEventSlider` and restored the 3-column grid for "Upcoming Experiences".

### Fixed

- **Fixed**: Resolved missing `@headlessui/react` dependency causing build errors (2026-01-30)

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
- **Changed**: Adjusted Admin Page Layout padding for consistency.
- **Added**: Implemented shadcn `navbar-03` with responsive hamburger menu.
- **Added**: Implemented `ThemeContext` for Light/Dark mode support (Minimalist White Default).
- **Changed**: Refactored `MainSidebar` to be controllable via the new Navbar.
- **Removed**: Deleted legacy `TopNavbar` component.
- **Added**: Created physics-based Lanyard component and reusable StatCard for the new Profile Dashboard. (2026-01-20)
