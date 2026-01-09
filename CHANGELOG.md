# Changelog

All notable changes to the UniVerse project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added

- **2026-01-10**: Initial project setup with MERN stack
- **2026-01-10**: Created `universe-client` React frontend with Vite
- **2026-01-10**: Created `universe-server` Express backend
- **2026-01-10**: Implemented `Navbar`, `Hero`, `EventCard`, `Footer` components
- **2026-01-10**: Added `Dither.jsx` 3D background effect with React Three Fiber
- **2026-01-10**: Configured Tailwind CSS with custom "UniVerse" theme (void, nebula, starlight colors)
- **2026-01-10**: Set up folder structure for client (`pages`, `hooks`, `services`, `context`, `utils`, `constants`, `styles`)
- **2026-01-10**: Set up folder structure for server (`config`, `services`, `utils`, `validators`)
- **2026-01-10**: Created `FOLDER_STRUCTURE.md` documentation for both client and server
- **2026-01-10**: Added `PROJECT_RULES.md` and `CHANGELOG.md` for project governance
- **2026-01-10**: Added `FOLDER_STRUCTURE.md` for client and server
- **2026-01-10**: Enhanced Homepage UI with `Stats`, `Categories`, `Testimonials`, and `Newsletter` components

### Changed

- **2026-01-10**: Updated `.agent/rules/antigravityreactrules.md` to include mandatory changelog logging requirement
- **2026-01-10**: Renamed folder from `universeclient--` to `universe-client`
- **2026-01-10**: Updated `package.json` name to `universe-client`
- **2026-01-10**: Updated `index.html` title to "UniVerse Client"

### Fixed

- **2026-01-10**: Fixed Dither background not covering full page (z-index and transparency issues)

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
