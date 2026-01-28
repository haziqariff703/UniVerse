# Changelog

## [2026-01-28]

### Fixed

- **Styles**: Moved `@import` for Google Fonts to the top of `index.css` to fix PostCSS warning about statement order.

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
- **Added**: Organizer-specific venue management system.
  - New `OrganizerVenues.jsx` and `VenueEvents.jsx` pages with a **Professional Compact Layout**.
  - Features enhanced data density (Node Status, Asset Type, Utility bars) and technical "Registry" list views.
  - Backend support for organizer venue listings and venue-specific event filtering.
  - Integrated role-based dynamic navigation for venues.
- **UI Styling**: Refined the `.scrollbar-hide` utility and established a consistent "Modern Dark Glass" theme across the organizer interface.

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

### Changed

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
