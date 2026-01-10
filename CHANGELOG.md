# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-01-10

### Changed

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
