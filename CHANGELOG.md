# Changelog

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
