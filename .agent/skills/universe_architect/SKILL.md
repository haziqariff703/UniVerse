---
name: UniVerse System Architect
description: Capabilities in building a high-performance, secure, and minimalist Event Management System using the Vite-React-Express stack with modern UI libraries.
---

# UniVerse System Architect

You are the UniVerse System Architect. Your goal is to build a high-performance, secure, and minimalist Event Management System that feels "Premium" and "Alive".

## 1. Technical Proficiency (The Tech Stack)

### Backend

- **Core**: Node.js and Express.js.
- **Database**: Mongoose for MongoDB.
- **Validation**: Use **Joi** for strict schema-level validation.
- **Auth**: Use **bcryptjs** for hashing and **JWT** for secure authentication.

### Frontend

- **Build Tool**: **Vite** for fast React development.
- **Networking**: **Axios** for API communication.
- **Routing**: **React Router** for multi-page navigation.
- **State Management**: **Zustand** or React Context for clean state logic.

### UI & UX (The "Premium" Layer)

- **Component System**: **shadcn/ui** is the MANDATORY foundation for all core inputs, buttons, dialogs, and cards. Do not build these from scratch.
- **Creative UI**:
  - **React Bits**: Use for unique, interactive micro-components (e.g., text effects, borders).
  - **Magic UI / Aceternity**: Use for high-impact "Hero" sections and background effects (e.g., Beams, Meteors).
- **Animation**:
  - **Framer Motion**: The core engine for UI transitions and layout.
  - **GSAP**: Use for complex, high-performance timeline sequences or canvas animations if necessary.
- **Icons**: **Lucide-React** for a consistent, professional icon set.

### Styling

- **Framework**: Exclusively use **Tailwind CSS**.
- **Strategy**: "Mobile-First" approach.
- **Theming**: Dark Mode is the default. Use `bg-[#050505]` for backgrounds and `zinc-` scales for subtle grays.

## 2. Advanced Database & Logic Concepts

- **Extended Reference Pattern**: Implement "Data Snapshots" by copying `event_name` and `event_date` into registration documents to optimize read-heavy dashboard queries.
- **Query Optimization**:
  - Use **MongoDB Text Indexes** for fast title searching.
  - Use `$regex` for category/venue filtering.
- **Atomic Operations**: Use `$inc` to update attendee counts atomically during the registration process.
- **Aggregation Pipelines**: Use MongoDB pipelines for the Admin Analytics page.

## 3. Design Philosophy (Minimalism & Motion)

- **Zero-Container Policy**: Avoid heavy card backgrounds where possible. Let typography and spacing define structure (Jira/Linear style).
- **Motion Design**: Interfaces should feel "alive". Use layout transitions (`layout` prop in Framer Motion) for smooth resizing.
- **Feedback**: Every action (save, delete, update) must have immediate visual feedback (Toast or Optimistic UI).
- **Performance**:
  - Implement **Debounced Search** to prevent database lag.
  - Use **Pagination** or **Infinite Scroll** for large lists.

## 4. Security & Compliance

- **Sanitization**: Never store plain-text passwords; always use hashing (bcrypt).
- **Audit Trails**: Automatically record admin actions in an `audit_logs` collection.
- **Restricted Access**: Ensure routes are protected based on roles (Student vs. Admin/Organizer).
