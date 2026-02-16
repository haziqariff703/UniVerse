# UniVerse Security Measures

This document explains every security mechanism implemented in the UniVerse Event Management System, organized by layer.

---

## 1. Authentication (Identity Verification)

### JWT Token-Based Authentication

Every protected API request requires a valid **JSON Web Token (JWT)** in the `Authorization` header using the Bearer scheme.

**How it works:**

- On login or registration, the server signs a JWT containing the user's `id`, `role`, `roles[]`, and `name` using a secret key (`JWT_SECRET`) stored in environment variables.
- Tokens expire after **7 days**, forcing periodic re-authentication.
- The `auth` middleware intercepts every protected request, extracts the Bearer token, verifies it with `jwt.verify()`, and attaches the decoded user payload to `req.user`.
- If the token is missing, malformed, or expired, the server responds with **HTTP 401 (Unauthorized)** and refuses further processing.

**Implementation:**

```
middleware/auth.js → auth()
controllers/authController.js → login(), register()
```

### Password Hashing (Bcrypt)

Passwords are **never stored in plaintext**. Before persisting to MongoDB, every password is hashed using `bcrypt` with a **salt round of 10**.

**How it works:**

- During registration, `bcrypt.genSalt(10)` generates a unique cryptographic salt, then `bcrypt.hash(password, salt)` produces an irreversible hash.
- During login, `bcrypt.compare(plaintext, hash)` validates the input without ever decrypting the stored hash.
- This protects against database breaches—even if the `users` collection is leaked, passwords remain computationally infeasible to reverse.

**Implementation:**

```
controllers/authController.js → register() (hashing), login() (comparison)
```

---

## 2. Authorization (Access Control)

### Role-Based Access Control (RBAC)

The system enforces a **tiered permission model** with four roles: `student`, `organizer`, `admin`, and `association`. Access is restricted at the route level using the `authorize(...roles)` middleware.

**How it works:**

- `authorize('admin')` — Only admins can access the route.
- `authorize('admin', 'organizer')` — Both admins and organizers can access the route.
- The middleware first checks the `roles[]` array (multi-role support), then falls back to the legacy `role` string field.
- If no match is found, the server responds with **HTTP 403 (Forbidden)** and the message: `"Access denied. Required role: admin or organizer."`.

**Route-Level Enforcement Examples:**

| Route                                 | Required Role          | Purpose              |
| ------------------------------------- | ---------------------- | -------------------- |
| `POST /api/admin/users`               | `admin`                | Manual user creation |
| `PATCH /api/admin/events/:id/approve` | `admin`                | Event approval       |
| `POST /api/events`                    | `admin`, `organizer`   | Event creation       |
| `POST /api/registrations/checkin`     | `admin`, `organizer`   | QR code check-in     |
| `DELETE /api/events/:id`              | `admin`                | Event deletion       |
| `GET /api/registrations/my-bookings`  | Any authenticated user | Personal bookings    |

**Implementation:**

```
middleware/auth.js → authorize()
routes/adminRoutes.js — Every route uses: auth, authorize('admin')
routes/eventRoutes.js — Mixed: some public, some role-restricted
routes/registrationRoutes.js — router.use(auth) blanket + per-route authorize()
```

### Ownership-Based Authorization (Controller-Level)

Beyond route-level RBAC, controllers implement **ownership checks** to ensure users can only modify their own resources.

**How it works:**

- When updating an event, the controller verifies that `req.user.id === event.organizer_id` or that the user is an admin.
- Community events extend this to include approved community members (President, AJK, Committee).
- A `canEdit` boolean flag is dynamically injected into API responses so the frontend can conditionally render management interfaces.

**Implementation:**

```
controllers/eventController.js → updateEvent(), getEventById()
```

### Role Escalation Prevention

Users **cannot self-assign elevated roles** during registration:

- The backend ignores the `role` field from the request body and always assigns `role: 'student'` and `roles: ['student']`.
- If a user selects "organizer" during registration, this is captured as `organizerRequest: true` — a flag that admins must explicitly approve before the role is upgraded.
- The `admin` role is **never assignable** through the registration endpoint (only valid roles checked are `student` and `organizer`).

**Implementation:**

```
controllers/authController.js → register()
```

---

## 3. Data Protection

### Password Exclusion from Responses

The password field is **systematically excluded** from all API responses using Mongoose's `.select('-password')` projection. This prevents accidental leakage of password hashes through API responses, admin user lists, or profile endpoints.

**Verified in:**

- `authController.getMe()` — User profile
- `adminController.getAllUsers()` — Admin user list
- `adminController.approveOrganizer()` — Role update response
- `adminController.updateUserRole()` — Role modification
- `adminController.deleteUser()` — Pre-deletion lookup

### Compound Unique Indexes

MongoDB compound indexes enforce **data integrity at the database level**, preventing duplicates even if application-level checks fail:

| Collection          | Index                             | Purpose                       |
| ------------------- | --------------------------------- | ----------------------------- |
| `registrations`     | `{ event_id: 1, user_id: 1 }`     | Prevents double registration  |
| `reviews`           | `{ event_id: 1, user_id: 1 }`     | One review per user per event |
| `community_members` | `{ community_id: 1, user_id: 1 }` | One membership per community  |

### Input Sanitization

- **Empty String → Undefined Conversion**: The `student_id` field is sanitized during registration — empty strings are converted to `undefined` to avoid violating the sparse unique index.
- **Type Casting**: Numeric fields like `capacity` and `ticket_price` are explicitly parsed with `parseInt()` or `Number()` before database operations to prevent MongoDB Cast Errors.

---

## 4. Audit Logging (Forensic Accountability)

### Comprehensive Action Tracking

The system logs **every critical administrative and organizer action** to the `audit_logs` collection. There are **22+ audit points** across the codebase, covering 27 distinct action types.

**What is logged:**

- `admin_id` — Who performed the action
- `action` — What was done (e.g., `APPROVE_EVENT`, `DELETE_USER`, `UPDATE_VENUE`)
- `target_type` — The entity affected (`Event`, `User`, `Venue`, `Speaker`, etc.)
- `target_id` — The specific document modified (uses `refPath` for polymorphic references)
- `details` — A snapshot of the change or relevant metadata
- `ip_address` — The origin of the request

**Action Types Tracked:**

| Category   | Actions                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Events     | `CREATE_EVENT`, `APPROVE_EVENT`, `REJECT_EVENT`, `DELETE_EVENT`, `UPDATE_EVENT`                                               |
| Users      | `DELETE_USER`, `UPDATE_USER_ROLE`, `CREATE_USER_MANUAL`                                                                       |
| Organizers | `APPROVE_ORGANIZER`, `REJECT_ORGANIZER`                                                                                       |
| Venues     | `CREATE_VENUE`, `UPDATE_VENUE`, `DELETE_VENUE`                                                                                |
| Speakers   | `CREATE_SPEAKER`, `UPDATE_SPEAKER`, `DELETE_SPEAKER`, `VERIFY_SPEAKER`, `REJECT_SPEAKER_PROPOSAL`                             |
| Operations | `CHECKIN_ATTENDEE`, `CANCEL_REGISTRATION`, `UPDATE_REGISTRATION`                                                              |
| Governance | `CREATE_CATEGORY`, `UPDATE_CATEGORY`, `DELETE_CATEGORY`, `DELETE_REVIEW`, `CREATE_COMMUNITY_MANUAL`, `BROADCAST_NOTIFICATION` |

**Implementation:**

```
controllers/adminController.js — 20+ AuditLog.create() calls
controllers/eventController.js — 2 AuditLog.create() calls
models/auditLog.js — Schema with refPath polymorphic reference
```

---

## 5. File Upload Security

### MIME Type Validation

The upload middleware (`multer`) enforces strict file type restrictions:

- **Allowed**: `image/*` (all image formats) and `application/pdf`
- **Rejected**: All other file types return **HTTP 400** with the message: `"Unsupported file type."`

### File Size Limit

All uploads are capped at **10 MB** (`10,000,000 bytes`). Files exceeding this limit are rejected before reaching the application logic.

### Secure Filename Generation

Uploaded files are renamed using a deterministic pattern: `{userId}-{timestamp}{extension}`. This eliminates:

- Path traversal attacks via malicious filenames (e.g., `../../etc/passwd`)
- Filename collisions between concurrent uploads

**Implementation:**

```
middleware/upload.js → checkFileType(), multer config
```

---

## 6. API Security

### CORS (Cross-Origin Resource Sharing)

The server enables CORS via the `cors()` middleware, allowing the React frontend to communicate with the Express backend across different origins during development.

### Global Error Handler

A centralized error handler catches all unhandled exceptions and returns a **generic JSON error response** instead of leaking internal stack traces to the client:

```javascript
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || "Internal Server Error" });
});
```

This prevents:

- Exposure of internal file paths or database structure
- Stack trace leakage in production

### Ambiguous Error Messages

Authentication endpoints use **identical error messages** for both "user not found" and "wrong password" scenarios:

- `"Invalid credentials."` — This prevents attackers from using login responses to enumerate valid email addresses.

### Database Connection Failure Handling

The server uses an **async startup pattern** — if the MongoDB connection fails, the process exits immediately (`process.exit(1)`) instead of serving requests without a database. This prevents undefined behavior and data corruption.

**Implementation:**

```
index.js → startServer(), global error handler
```

---

## 7. Soft Deletion & Data Preservation

Instead of permanently deleting records, the system transitions them to terminal states:

- Registrations → `status: 'Cancelled'` (instead of `deleteOne`)
- Events → `status: 'Cancelled'` or `'Completed'`
- Community Members → `status: 'Inactive'` or `'Rejected'`

This preserves the full data history for audit purposes and ensures that financial reports, attendance analytics, and audit logs remain accurate even after operational changes.

---

## Summary Table

| Layer                | Mechanism                              | Key File                                                    |
| -------------------- | -------------------------------------- | ----------------------------------------------------------- |
| Authentication       | JWT (Bearer Token, 7-day expiry)       | `middleware/auth.js`                                        |
| Password Security    | Bcrypt hashing (salt: 10)              | `controllers/authController.js`                             |
| Authorization        | RBAC (`authorize()` middleware)        | `middleware/auth.js`                                        |
| Ownership Checks     | Controller-level identity verification | `controllers/eventController.js`                            |
| Role Escalation      | Forced `student` on registration       | `controllers/authController.js`                             |
| Password Exclusion   | `.select('-password')` on all queries  | `controllers/adminController.js`                            |
| Duplicate Prevention | Compound unique indexes                | `models/registration.js`, `review.js`, `communityMember.js` |
| Audit Trail          | 22+ log points, 27 action types        | `controllers/adminController.js`                            |
| Upload Security      | MIME filter + 10MB limit               | `middleware/upload.js`                                      |
| Error Handling       | Global handler, ambiguous auth errors  | `index.js`                                                  |
| Data Preservation    | Soft deletes via status transitions    | `controllers/registrationController.js`                     |
