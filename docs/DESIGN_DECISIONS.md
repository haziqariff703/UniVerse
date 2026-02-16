# UniVerse Design Decisions

This document explains the key architectural and design decisions made throughout the UniVerse Event Management System, with rationale for each choice.

---

## 1. Why MongoDB (NoSQL over SQL)

**Decision:** Use MongoDB (document-oriented NoSQL) instead of a relational database like MySQL or PostgreSQL.

**Rationale:**

| Factor                        | MongoDB Advantage                                                                                                                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Schema Flexibility**        | Events contain nested arrays (`schedule[]`, `tasks[]`, `speaker_ids[]`). In SQL, these would require 3+ junction tables and complex JOINs. In MongoDB, they are embedded directly in the document — a single read returns everything. |
| **MERN Stack Synergy**        | The entire stack (Node.js, Express, React) speaks JSON natively. MongoDB stores BSON (binary JSON), eliminating the "impedance mismatch" between application objects and database records. No ORM translation layer is needed.        |
| **Denormalization for Speed** | The Digital Pass requires instant loading at crowded venues. Storing `event_snapshot` and `user_snapshot` inside the `Registration` document allows the pass to render from a single database read instead of a multi-table JOIN.     |
| **Aggregation Framework**     | Admin dashboards require real-time KPIs (revenue trends, attendance rates). MongoDB's `$lookup`, `$group`, `$match` pipeline stages compute these directly in the database engine, avoiding expensive application-level processing.   |
| **Horizontal Scalability**    | MongoDB supports sharding natively. During peak usage (club recruitment week, major events), the database can distribute load across multiple nodes without application changes.                                                      |

---

## 2. Denormalization Strategy

**Decision:** Store copies of frequently-read data inside related documents instead of always referencing the source.

**Where it is applied:**

| Document                      | Embedded Snapshot               | Source                                    |
| ----------------------------- | ------------------------------- | ----------------------------------------- |
| `Registration.event_snapshot` | `{ title, venue, date_time }`   | `Event` + `Venue`                         |
| `Registration.user_snapshot`  | `{ name, student_id }`          | `User`                                    |
| `Community.stats`             | `{ member_count, event_count }` | Computed from `CommunityMember` + `Event` |

**Rationale:**

- The Digital Pass is scanned at venue entry gates. A student opens their pass, and the system must render the event title, venue name, and time **instantly** — even on unstable campus Wi-Fi.
- Without denormalization, rendering a pass would require: `Registration → $lookup Event → $lookup Venue` (3 collections, 2 JOINs). With snapshots, it is a single document read.
- The trade-off (data staleness) is acceptable because event titles and venue names rarely change after registration.

---

## 3. Atomic Operations for Concurrency

**Decision:** Use MongoDB's `$inc` operator for all counter updates instead of read-modify-write patterns.

**Where it is applied:**

- `Event.current_attendees` — Incremented on registration, decremented on cancellation.
- `User.current_merit` — Incremented on event check-in.

**Rationale:**
When 200 students register for a popular event simultaneously, a read-modify-write pattern (`read count → add 1 → save`) causes race conditions — two concurrent reads both see `count: 50`, both write `count: 51`, and one registration is silently lost.

`$inc` is an **atomic database-level operation**. MongoDB guarantees that `{ $inc: { current_attendees: 1 } }` will never lose an increment, regardless of concurrency. This eliminates the need for application-level locks or transactions for simple counter updates.

---

## 4. Soft Deletion over Hard Deletion

**Decision:** Transition records to terminal states (`Cancelled`, `Inactive`, `Rejected`) instead of permanently removing them from the database.

**Where it is applied:**

- `Registration.status → 'Cancelled'` (not `deleteOne`)
- `CommunityMember.status → 'Inactive'`
- `Event.status → 'Cancelled'`

**Rationale:**

- **Audit Integrity**: The `audit_logs` collection references `target_id` across all collections. Hard-deleting a registration would orphan the audit record, making forensic investigation impossible.
- **Financial Accuracy**: Revenue reports aggregate from registrations. Deleting a cancelled booking would inflate revenue figures by eliminating the cancellation record from historical calculations.
- **Undo Capability**: Soft-deleted records can be restored. Hard-deleted records cannot.

---

## 5. Dual-Layer Role System

**Decision:** Maintain both a `role` (string) and a `roles[]` (array) field on the User model.

**Rationale:**

- `role` is the **legacy primary role** — a single value like `'student'` or `'admin'`. This was the original design and is still used for backward compatibility in token payloads and older authorization checks.
- `roles[]` is the **multi-role array** — allowing a single user to hold `['student', 'organizer']` simultaneously. This enables context switching (e.g., viewing the student dashboard while also managing events).
- The `authorize()` middleware checks `roles[]` first, then falls back to `role`. This ensures zero breakage during the transition from single-role to multi-role architecture.
- Users **always start as `['student']`**. The `organizer` role is only appended after admin approval, preventing self-escalation.

---

## 6. Relative API Routing (No Hardcoded URLs)

**Decision:** The frontend uses relative paths (`/api/events`, `/public/uploads/...`) instead of hardcoded URLs (`http://localhost:5000/api/events`).

**How it works:**

- In development, Vite's proxy configuration forwards `/api/*` and `/public/*` requests to `http://localhost:5000`.
- In production, the same relative paths work directly against the deployed domain without any code changes.

**Rationale:**

- Eliminates the **"localhost leak"** problem — hardcoded `localhost:5000` references break immediately upon deployment.
- Requires **zero environment-specific configuration** in the frontend. The same build works on `localhost`, Vercel, Railway, or any custom domain.
- Simplifies the codebase by removing `API_BASE` concatenation logic from most components.

---

## 7. Hybrid Cloud/Local Storage

**Decision:** Support both Supabase Storage (cloud) and local disk (`public/uploads/assets`) with automatic fallback.

**How it works:**

1. The upload middleware checks for `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` environment variables.
2. If present → files are uploaded to Supabase Storage via a custom Multer storage engine.
3. If absent → files are saved to the local `public/uploads/assets` directory.
4. The `pathResolver.js` utility normalizes all paths: cloud URLs pass through unchanged; local paths are converted to relative public URLs (`/public/uploads/assets/...`).

**Rationale:**

- **Development simplicity**: Developers can run the full system locally without needing Supabase credentials — local disk storage works automatically.
- **Production reliability**: In deployment, Supabase provides CDN-backed, persistent storage that survives container restarts (unlike ephemeral local filesystems on platforms like Railway or Render).
- **Single resolution logic**: The `resolveFilePath()` function handles both cases, so controllers and components never need to know which storage engine is active.

---

## 8. Compound Unique Indexes

**Decision:** Enforce uniqueness constraints at the database level using compound indexes, not just application-level checks.

**Where it is applied:**

| Collection          | Index                             | Business Rule                         |
| ------------------- | --------------------------------- | ------------------------------------- |
| `registrations`     | `{ event_id: 1, user_id: 1 }`     | One registration per user per event   |
| `reviews`           | `{ event_id: 1, user_id: 1 }`     | One review per user per event         |
| `community_members` | `{ community_id: 1, user_id: 1 }` | One membership per user per community |

**Rationale:**
Application-level checks (e.g., `findOne({ event_id, user_id })` before `save()`) are vulnerable to race conditions — two simultaneous requests can both pass the check and create duplicate records. A database-level unique index guarantees that the second `save()` will fail with a duplicate key error, regardless of timing.

---

## 9. Polymorphic Audit References (refPath)

**Decision:** Use Mongoose's `refPath` feature for the `target_id` field in `AuditLog` instead of a fixed `ref`.

**How it works:**

```javascript
target_type: { type: String, enum: ['Event', 'User', 'Venue', ...] },
target_id: { type: ObjectId, refPath: 'target_type' }
```

**Rationale:**
The audit log tracks actions across **9 different entity types** (Event, User, Venue, Registration, Category, Review, Community, System, Speaker). Without `refPath`, the system would need either:

- **9 separate foreign key fields** (most of which would be `null` on any given log entry), or
- **No referential integrity** (storing raw IDs without population support).

`refPath` provides a single `target_id` field that dynamically resolves to the correct collection based on `target_type`, enabling `.populate('target_id')` to work correctly regardless of the entity type.

---

## 10. Event Lifecycle State Machine

**Decision:** Events follow a strict status progression managed through enum validation.

**Status Flow:**

```
pending → approved → Open → SoldOut / Completed / Cancelled
       ↘ rejected
```

**Statuses and Their Meaning:**

| Status      | Meaning                                  |
| ----------- | ---------------------------------------- |
| `pending`   | Newly created, awaiting admin approval   |
| `approved`  | Admin-approved, ready for registration   |
| `rejected`  | Admin-rejected (with `rejection_reason`) |
| `Open`      | Actively accepting registrations         |
| `SoldOut`   | `current_attendees >= capacity`          |
| `Cancelled` | Manually cancelled by organizer/admin    |
| `Completed` | Event `end_time` has passed              |

**Rationale:**

- The enum constraint at the schema level (`enum: ['pending', 'approved', ...]`) prevents invalid state transitions at the database level.
- The `pending → approved` gate ensures no event is publicly visible without admin review — a critical governance requirement for a university platform.
- Temporal logic uses `end_time` (not `date_time`) to determine completion, preventing events from being marked "past" while still in progress.

---

## 11. Separation of Concerns (MVC Pattern)

**Decision:** Organize the backend into distinct layers: Models, Controllers, Routes, Middleware, and Utilities.

**Structure:**

```
universe-server/
├── models/          → 14 Mongoose schemas (data structure)
├── controllers/     → Business logic (what happens)
├── routes/          → HTTP endpoint mapping (where requests go)
├── middleware/      → Cross-cutting concerns (auth, upload)
└── utils/           → Shared helpers (pathResolver, accessControl)
```

**Rationale:**

- **Models** define only the data shape and validation rules — no business logic.
- **Controllers** contain all database queries, authorization checks, and response formatting — they are the "brain" of each module.
- **Routes** map HTTP verbs and paths to controller functions and chain middleware — they are thin and declarative.
- **Middleware** handles concerns that span multiple routes (authentication, file uploads) without duplicating logic.
- This separation ensures that changing how authentication works (e.g., switching from JWT to OAuth) only requires modifying the middleware, not every controller.

---

## 12. Decoupled Auth State Synchronization

**Decision:** Use browser `CustomEvent` dispatch for cross-component authentication state changes instead of centralized state management.

**How it works:**

- On logout, the component dispatches `window.dispatchEvent(new Event("authChange"))`.
- The root `Layout` component listens for this event and resets its `user` state to `null`.
- This triggers immediate re-rendering of the Navbar from "Authenticated" to "Public" mode.

**Rationale:**

- The Admin layout and Student layout are separate component trees. A centralized state manager (like Redux or Context) would require wrapping both trees in a shared provider, adding complexity.
- The `CustomEvent` pattern is lightweight, works across any component tree, and avoids "ghosted" UI elements (e.g., a logged-out user still seeing their name in the Navbar) without requiring a full page reload.

---

## Summary Table

| Decision              | Trade-off                     | Benefit                                                |
| --------------------- | ----------------------------- | ------------------------------------------------------ |
| MongoDB over SQL      | No strong schema enforcement  | Schema flexibility, native JSON, aggregation power     |
| Denormalization       | Data can become stale         | O(1) reads for Digital Pass                            |
| Atomic `$inc`         | None (pure improvement)       | Race-condition-free counter updates                    |
| Soft deletion         | Storage grows over time       | Audit integrity, financial accuracy, undo capability   |
| Dual-layer roles      | Slight complexity             | Multi-role support with backward compatibility         |
| Relative API paths    | Requires Vite proxy in dev    | Zero-config deployment across any domain               |
| Hybrid storage        | Two code paths to maintain    | Works locally and in production without config changes |
| Compound indexes      | Slightly slower writes        | Database-guaranteed uniqueness, race-condition proof   |
| Polymorphic `refPath` | Slightly more complex queries | Single audit log for 9 entity types                    |
| Status state machine  | More status values to manage  | Clear lifecycle governance, temporal accuracy          |
| MVC separation        | More files to navigate        | Clean modularity, independent layer changes            |
| Event-based auth sync | No centralized state store    | Lightweight, cross-tree state propagation              |
