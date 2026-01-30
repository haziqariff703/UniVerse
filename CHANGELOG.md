# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

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

### Changed

- **Dependencies**: Overridden `three` version to `0.167.1` to resolve conflicts.
