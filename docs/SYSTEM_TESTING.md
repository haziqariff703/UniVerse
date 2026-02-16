# UniVerse System Testing Documentation

This document provides a comprehensive verification record of all database logic, security constraints, and data integrity measures implemented in the UniVerse Event Management System.

---

## 1. Authentication Testing

### 1.1 JWT Token Lifecycle

| Test ID | Test Case                    | Input                                | Expected Result                                     | Verification Method                                                                                                                    |
| ------- | ---------------------------- | ------------------------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH-01 | Valid login generates JWT    | Correct email + password             | HTTP 200 with `token` field containing a signed JWT | Send `POST /api/auth/login` with valid credentials. Decode returned token to confirm payload contains `id`, `role`, `roles[]`, `name`. |
| AUTH-02 | Token expires after 7 days   | Valid token older than 7 days        | HTTP 401 `"Invalid or expired token."`              | Create a token with `{ expiresIn: '1s' }`, wait 2 seconds, then send it in the Authorization header. Verify rejection.                 |
| AUTH-03 | Missing Authorization header | No header on protected route         | HTTP 401 `"Access denied. No token provided."`      | Send `GET /api/auth/me` without any Authorization header.                                                                              |
| AUTH-04 | Malformed Bearer token       | `Authorization: Bearer invalidxyz`   | HTTP 401 `"Invalid or expired token."`              | Send request with a random string as the token.                                                                                        |
| AUTH-05 | Wrong secret verification    | Token signed with a different secret | HTTP 401 `"Invalid or expired token."`              | Sign a JWT with a different `JWT_SECRET` and verify that `jwt.verify()` rejects it.                                                    |

### 1.2 Password Security

| Test ID | Test Case                           | Input                            | Expected Result                                                         | Verification Method                                                                                                                |
| ------- | ----------------------------------- | -------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| AUTH-06 | Password is hashed on registration  | `password: "Test1234"`           | Stored `password` field is a bcrypt hash (starts with `$2a$` or `$2b$`) | Register a user, then query the `users` collection directly. Verify the password field is not plaintext and matches bcrypt format. |
| AUTH-07 | Correct password passes comparison  | Correct plaintext vs stored hash | `bcrypt.compare()` returns `true`                                       | Login with the correct password, verify HTTP 200.                                                                                  |
| AUTH-08 | Incorrect password fails comparison | Wrong plaintext vs stored hash   | HTTP 401 `"Invalid credentials."`                                       | Login with wrong password, verify HTTP 401.                                                                                        |
| AUTH-09 | Ambiguous error on wrong email      | Non-existent email               | HTTP 401 `"Invalid credentials."` (same message as wrong password)      | Login with a non-existent email. Verify the error message is identical to AUTH-08, preventing email enumeration.                   |

---

## 2. Role-Based Access Control (RBAC) Testing

### 2.1 Route-Level Authorization

| Test ID | Test Case                                | Route                             | Acting Role | Expected Result                                   |
| ------- | ---------------------------------------- | --------------------------------- | ----------- | ------------------------------------------------- |
| RBAC-01 | Admin can access admin routes            | `GET /api/admin/stats`            | admin       | HTTP 200 with dashboard statistics                |
| RBAC-02 | Student blocked from admin routes        | `GET /api/admin/stats`            | student     | HTTP 403 `"Access denied. Required role: admin."` |
| RBAC-03 | Organizer blocked from admin-only routes | `POST /api/admin/users`           | organizer   | HTTP 403 `"Access denied. Required role: admin."` |
| RBAC-04 | Organizer can access shared routes       | `GET /api/admin/venues`           | organizer   | HTTP 200 (route allows `admin` OR `organizer`)    |
| RBAC-05 | Event creation requires organizer+       | `POST /api/events`                | student     | HTTP 403                                          |
| RBAC-06 | Event deletion requires admin only       | `DELETE /api/events/:id`          | organizer   | HTTP 403                                          |
| RBAC-07 | Check-in requires organizer+             | `POST /api/registrations/checkin` | student     | HTTP 403                                          |
| RBAC-08 | Registration open to all authenticated   | `POST /api/registrations`         | student     | HTTP 201 (any authenticated user can register)    |

### 2.2 Multi-Role Authorization

| Test ID | Test Case                        | Input                                         | Expected Result                    | Verification Method                                                                                                                      |
| ------- | -------------------------------- | --------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| RBAC-09 | `roles[]` array takes precedence | User with `roles: ['student', 'organizer']`   | Access granted to organizer routes | The `authorize()` middleware checks `req.user.roles.some(r => roles.includes(r))` first, before falling back to the legacy `role` field. |
| RBAC-10 | Legacy `role` fallback works     | User with only `role: 'admin'` (no `roles[]`) | Access granted to admin routes     | If `req.user.roles` is undefined or empty, the middleware falls back to `roles.includes(req.user.role)`.                                 |

### 2.3 Role Escalation Prevention

| Test ID | Test Case                                    | Input                                              | Expected Result                                               | Verification Method                                                                                                                            |
| ------- | -------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| RBAC-11 | Registration always assigns student          | `POST /api/auth/register` with `role: "admin"`     | User created with `role: 'student'`, `roles: ['student']`     | The `register()` controller hardcodes `role: 'student'` and `roles: ['student']` regardless of the request body. Query the database to verify. |
| RBAC-12 | Organizer intent captured, not granted       | `POST /api/auth/register` with `role: "organizer"` | `organizerRequest: true` but `role: 'student'`                | The intent is stored as a flag for admin review, not as an active role.                                                                        |
| RBAC-13 | Admin role never assignable via registration | `POST /api/auth/register` with `role: "admin"`     | `validRoles` check rejects `"admin"`, defaults to `"student"` | The `validRoles` array is `['student', 'organizer']` — `admin` is excluded.                                                                    |

---

## 3. Ownership & Resource-Level Authorization Testing

### 3.1 Registration Ownership

| Test ID | Test Case                                 | Input                                        | Expected Result                                          | Verification Method                                                                                                    |
| ------- | ----------------------------------------- | -------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| OWN-01  | User can cancel own registration          | User A cancels their own registration        | HTTP 200 `"Registration cancelled successfully."`        | `cancelRegistration()` checks `registration.user_id.toString() !== req.user.id`. If they match, cancellation proceeds. |
| OWN-02  | User cannot cancel another's registration | User B tries to cancel User A's registration | HTTP 403 `"Not authorized to cancel this registration."` | The controller compares `registration.user_id` against `req.user.id` and checks for admin role.                        |
| OWN-03  | Admin can cancel any registration         | Admin cancels User A's registration          | HTTP 200                                                 | Admin passes the `!req.user.roles.includes('admin')` check.                                                            |

### 3.2 Event Ownership

| Test ID | Test Case                               | Input                                            | Expected Result                                     | Verification Method                                                                                                 |
| ------- | --------------------------------------- | ------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| OWN-04  | Organizer can update own event          | Organizer A updates their event                  | HTTP 200 with updated event                         | `updateEvent()` verifies `req.user.id === event.organizer_id` or admin role.                                        |
| OWN-05  | Organizer cannot update another's event | Organizer B updates Organizer A's event          | HTTP 403 `"Not authorized"`                         | Controller-level ownership check fails.                                                                             |
| OWN-06  | Community President can conclude event  | President of community concludes community event | HTTP 200                                            | `concludeEvent()` checks `CommunityMember` for `role: 'President'` + `status: 'Approved'` in the event's community. |
| OWN-07  | Non-president member cannot conclude    | Regular community member concludes event         | HTTP 403 `"Not authorized to conclude this event."` | The `isPresident` check fails because membership role is not `'President'`.                                         |

### 3.3 Access Control Matrix (`getAccessibleEventIds`)

| Test ID | Test Case                              | Input                                     | Expected Result            | Verification Method                                                                                                                                                                                           |
| ------- | -------------------------------------- | ----------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ACL-01  | User sees events they own              | Organizer with 3 events                   | Returns 3 event IDs        | `Event.find({ organizer_id: userId })` returns owned events.                                                                                                                                                  |
| ACL-02  | User sees events they crew             | User accepted as crew on 2 events         | Those 2 IDs included       | `EventCrew.find({ user_id, status: 'accepted' })` returns crew assignments.                                                                                                                                   |
| ACL-03  | Community leader sees community events | President of Club X, Club X has 5 events  | Those 5 IDs included       | `CommunityMember.find({ user_id, role: { $in: LEADERSHIP_ROLES }, status: 'Approved' })` resolves community membership, then `Event.find({ community_id: { $in: communityIds } })` fetches associated events. |
| ACL-04  | All sources deduplicated               | User owns event AND is crew on same event | Event ID appears only once | `[...new Set([...ownedEventIds, ...crewEventIds, ...communityEventIds])]` eliminates duplicates.                                                                                                              |

---

## 4. Database Logic Testing

### 4.1 Registration Workflow

| Test ID | Test Case                                | Input                                               | Expected Result                                                                                                           | Verification Method                                                                                                    |
| ------- | ---------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| DB-01   | Successful registration creates document | Valid `event_id` for open event                     | Registration created with `status: 'Confirmed'`, `qr_code_string` generated, `event_snapshot` + `user_snapshot` populated | Query `registrations` collection. Verify snapshot fields match the source event and user at the time of registration.  |
| DB-02   | Attendee count incremented atomically    | Registration for event with 50 attendees            | `current_attendees` becomes 51                                                                                            | `Event.findByIdAndUpdate(id, { $inc: { current_attendees: 1 } })` — query the event document to confirm the increment. |
| DB-03   | Event marked SoldOut at capacity         | Event with `capacity: 100`, `current_attendees: 99` | After registration: `status → 'SoldOut'`                                                                                  | Controller checks `if (event.current_attendees + 1 >= event.capacity)` and updates status.                             |
| DB-04   | Closed event blocks registration         | Event with `status: 'Cancelled'`                    | HTTP 400 `"Event is Cancelled. Registration not available."`                                                              | The `allowedStatuses` array `['approved', 'Open']` rejects all other statuses.                                         |
| DB-05   | Full event blocks registration           | Event with `current_attendees >= capacity`          | HTTP 400 `"Event is full."`                                                                                               | Controller checks `event.current_attendees >= event.capacity` before proceeding.                                       |
| DB-06   | Missing event_id rejected                | Empty body                                          | HTTP 400 `"Event ID is required."`                                                                                        | Input validation check `if (!actualEventId)`.                                                                          |

### 4.2 Cancellation Logic

| Test ID | Test Case                             | Input                                 | Expected Result                                             | Verification Method                                                                                          |
| ------- | ------------------------------------- | ------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| DB-07   | Cancellation sets status, not deletes | Cancel a confirmed registration       | `registration.status → 'Cancelled'` (document still exists) | Query the registration by ID after cancellation. Confirm it exists with `status: 'Cancelled'`.               |
| DB-08   | Attendee count decremented atomically | Cancel registration                   | `current_attendees` decremented by 1                        | `Event.findByIdAndUpdate(id, { $inc: { current_attendees: -1 } })` — verify counter.                         |
| DB-09   | SoldOut event reopens on cancellation | Cancel registration for SoldOut event | `event.status → 'Open'`                                     | Controller checks `if (event.status === 'SoldOut' && event.current_attendees < event.capacity)` and reopens. |

### 4.3 QR Code Check-In Logic

| Test ID | Test Case                         | Input                                      | Expected Result                                                      | Verification Method                                                                                                 |
| ------- | --------------------------------- | ------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --- | --------------------------------------------------------------------------------- |
| DB-10   | Valid QR check-in succeeds        | Correct QR code string, within time window | HTTP 200 `"Check-in successful!"`, `status → 'CheckedIn'`            | Registration.findOne({ qr_code_string: qr_code }) resolves the document, status updated.                            |
| DB-11   | Invalid QR code rejected          | Random/malformed QR string                 | HTTP 404 `"Invalid QR code."`                                        | No document found matching the QR string.                                                                           |
| DB-12   | Early check-in blocked            | QR scanned >20 minutes before event        | HTTP 400 `"Check-in only opens 20 minutes before the event starts."` | `msUntilStart > checkInWindowMs (20 * 60 * 1000)` comparison blocks premature check-in.                             |
| DB-13   | Double check-in blocked           | Same QR code scanned twice                 | HTTP 400 `"Already checked in."`                                     | `if (registration.status === 'CheckedIn')` guard prevents re-processing.                                            |
| DB-14   | Cancelled registration blocked    | QR code for cancelled registration         | HTTP 400 `"This registration was cancelled."`                        | `if (registration.status === 'Cancelled')` guard rejects the scan.                                                  |
| DB-15   | Merit points awarded on check-in  | Event with `merit_points: 10`              | `user.current_merit` incremented by 10                               | `User.findByIdAndUpdate(id, { $inc: { current_merit: event.merit_points } })` — verify user's merit after check-in. |
| DB-16   | Self-healing snapshot on check-in | Registration with empty `user_snapshot`    | Snapshot populated from User model during check-in                   | If `!userData                                                                                                       |     | !userData.name`, the controller fetches the user and updates the snapshot inline. |

### 4.4 Review Submission Logic

| Test ID | Test Case                                  | Input                                            | Expected Result                                                                         | Verification Method                                                                                          |
| ------- | ------------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --- | --------------------------------------- |
| DB-17   | Only checked-in users can review           | User with `status: 'Confirmed'` (not checked in) | HTTP 403 `"You can only review events you have attended and checked in to."`            | Controller queries `Registration.findOne({ event_id, user_id, status: 'CheckedIn' })`. No match → rejection. |
| DB-18   | Duplicate review blocked (app-level)       | User already reviewed this event                 | HTTP 400 `"You have already reviewed this event."`                                      | `Review.findOne({ event_id, user_id })` returns existing document → rejection.                               |
| DB-19   | Speaker rating update uses rolling average | Event with speakers, `speaker_rating: 8`         | Speaker's `stats.rating` updated: `((currentRating * count) + newRating) / (count + 1)` | Query speaker after review. Verify `stats.rating` reflects the weighted average calculation.                 |
| DB-20   | Atmosphere metrics default to mid-score    | Missing `value`, `energy`, `welfare` fields      | Defaults to `5` for each                                                                | `value: value                                                                                                |     | 5` — verify stored review has defaults. |

### 4.5 Event Lifecycle

| Test ID | Test Case                           | Input                                              | Expected Result                                                                                          | Verification Method                                                                  |
| ------- | ----------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| DB-21   | Event created as pending            | `POST /api/events` by organizer                    | `status: 'pending'`                                                                                      | Schema default `default: 'pending'`. Query event to verify.                          |
| DB-22   | Admin approval transitions status   | `PATCH /api/admin/events/:id/approve`              | `status → 'approved'`                                                                                    | Controller updates status and logs `AuditLog.create({ action: 'APPROVE_EVENT' })`.   |
| DB-23   | Admin rejection sets reason         | `PATCH /api/admin/events/:id/reject` with `reason` | `status → 'rejected'`, `rejection_reason` populated                                                      | Controller stores the rejection reason from the request body.                        |
| DB-24   | Conclude event awards speaker merit | `POST /api/events/:id/conclude`                    | `event.status → 'Completed'`, each speaker gets `$inc: { 'stats.talks': 1, 'stats.merit': meritPoints }` | Query speakers after conclusion. Verify `stats.talks` and `stats.merit` incremented. |
| DB-25   | Double conclusion blocked           | Conclude already-completed event                   | HTTP 400 `"Event is already completed."`                                                                 | `if (event.status === 'Completed')` guard prevents re-processing.                    |

### 4.6 Organizer Approval Workflow

| Test ID | Test Case                           | Input                                         | Expected Result                                                                                    | Verification Method                                                               |
| ------- | ----------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| DB-26   | Pending organizers listed correctly | User registered with `organizerRequest: true` | Appears in `GET /api/admin/organizers/pending`                                                     | Query filters `{ organizerRequest: true, is_organizer_approved: { $ne: true } }`. |
| DB-27   | Organizer approval grants role      | `PATCH /api/admin/organizers/:id/approve`     | User gets `role: 'organizer'`, `roles` array includes `'organizer'`, `is_organizer_approved: true` | Controller updates all three fields and creates an audit log entry.               |
| DB-28   | Organizer rejection sets flags      | `PATCH /api/admin/organizers/:id/reject`      | `organizerRequest: false`, `is_organizer_approved: false`                                          | Controller clears the request without granting the role.                          |

---

## 5. Data Integrity Testing

### 5.1 Compound Unique Index Enforcement

| Test ID | Test Case                                 | Collection          | Index                             | Expected Result                            | Verification Method                                                                                                                                                     |
| ------- | ----------------------------------------- | ------------------- | --------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INT-01  | Duplicate registration blocked (DB-level) | `registrations`     | `{ event_id: 1, user_id: 1 }`     | MongoDB error `E11000 duplicate key error` | Attempt to insert two registrations with the same `event_id` and `user_id` directly via `Registration.create()`. Verify the second insert throws a duplicate key error. |
| INT-02  | Duplicate review blocked (DB-level)       | `reviews`           | `{ event_id: 1, user_id: 1 }`     | MongoDB error `E11000 duplicate key error` | Same approach — insert two reviews for the same event and user.                                                                                                         |
| INT-03  | Duplicate membership blocked (DB-level)   | `community_members` | `{ community_id: 1, user_id: 1 }` | MongoDB error `E11000 duplicate key error` | Insert two membership records for the same community and user.                                                                                                          |

### 5.2 Schema Validation (Mongoose Enum)

| Test ID | Test Case                              | Field                   | Valid Values                                                       | Expected Result                                          |
| ------- | -------------------------------------- | ----------------------- | ------------------------------------------------------------------ | -------------------------------------------------------- |
| INT-04  | Invalid user role rejected             | `user.role`             | `student, admin, organizer, association`                           | `ValidationError: role is not a valid enum value`        |
| INT-05  | Invalid event status rejected          | `event.status`          | `pending, approved, rejected, Open, SoldOut, Cancelled, Completed` | `ValidationError: status is not a valid enum value`      |
| INT-06  | Invalid registration status rejected   | `registration.status`   | `Confirmed, CheckedIn, Cancelled, Attended, NoShow`                | `ValidationError: status is not a valid enum value`      |
| INT-07  | Invalid review rating rejected         | `review.rating`         | `1–5` (min: 1, max: 5)                                             | `ValidationError: rating exceeds min/max bounds`         |
| INT-08  | Invalid speaker rating rejected        | `review.speaker_rating` | `1–10` (min: 1, max: 10)                                           | `ValidationError: speaker_rating exceeds min/max bounds` |
| INT-09  | Invalid community member role rejected | `communityMember.role`  | `Member, AJK, Secretary, Treasurer, President, Committee`          | `ValidationError: role is not a valid enum value`        |
| INT-10  | Invalid broadcast priority rejected    | `broadcastLog.priority` | `low, medium, high`                                                | `ValidationError: priority is not a valid enum value`    |

### 5.3 Required Field Validation

| Test ID | Test Case                     | Collection      | Required Fields                                           | Expected Result                                    |
| ------- | ----------------------------- | --------------- | --------------------------------------------------------- | -------------------------------------------------- |
| INT-11  | Event missing title           | `events`        | `title` (required)                                        | `ValidationError: Path 'title' is required`        |
| INT-12  | Event missing organizer       | `events`        | `organizer_id` (required)                                 | `ValidationError: Path 'organizer_id' is required` |
| INT-13  | Registration missing event_id | `registrations` | `event_id` (required)                                     | `ValidationError: Path 'event_id' is required`     |
| INT-14  | Registration missing user_id  | `registrations` | `user_id` (required)                                      | `ValidationError: Path 'user_id' is required`      |
| INT-15  | Audit log missing action      | `audit_logs`    | `action, admin_id, target_type, target_id` (all required) | `ValidationError: Path 'action' is required`       |
| INT-16  | Category missing name         | `categories`    | `name` (required)                                         | `ValidationError: Path 'name' is required`         |

### 5.4 Referential Integrity

| Test ID | Test Case                           | Input                                           | Expected Result                                         | Verification Method                                                                                         |
| ------- | ----------------------------------- | ----------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| INT-17  | Registration references valid event | `event_id` pointing to non-existent event       | HTTP 404 `"Event not found."`                           | Controller calls `Event.findById(actualEventId)` — returns `null` → rejection.                              |
| INT-18  | Registration references valid user  | `req.user.id` from JWT                          | `User.findById(user_id)` resolves to valid user         | User data is fetched for snapshot creation. If the user doesn't exist, the snapshot will have empty fields. |
| INT-19  | Audit log uses polymorphic ref      | `target_type: 'Event'`, `target_id: <event_id>` | `.populate('target_id')` resolves to the Event document | The `refPath: 'target_type'` directive dynamically resolves the referenced collection.                      |

### 5.5 Auto-Generated Fields

| Test ID | Test Case                         | Input                       | Expected Result                              | Verification Method                                                                                                         |
| ------- | --------------------------------- | --------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| INT-20  | Category slug auto-generated      | `name: "Tech & Innovation"` | `slug: "tech--innovation"`                   | `categorySchema.pre('validate')` hook converts name to lowercase, removes special characters, replaces spaces with hyphens. |
| INT-21  | QR code string uniquely generated | Two different registrations | Different QR strings                         | Format: `UNIV-{eventIdLast4}-{userIdLast4}-{timestamp}` — timestamp ensures uniqueness.                                     |
| INT-22  | Timestamps auto-populated         | Any document creation       | `createdAt` and `updatedAt` fields populated | Mongoose `timestamps: true` option on all schemas.                                                                          |

---

## 6. File Upload Security Testing

| Test ID | Test Case                    | Input                                    | Expected Result                        | Verification Method                                                                                                     |
| ------- | ---------------------------- | ---------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| FILE-01 | Image upload accepted        | `Content-Type: image/png`                | File saved, path returned              | MIME check `file.mimetype.startsWith("image/")` passes.                                                                 |
| FILE-02 | PDF upload accepted          | `Content-Type: application/pdf`          | File saved, path returned              | MIME check `file.mimetype === "application/pdf"` passes.                                                                |
| FILE-03 | Executable rejected          | `Content-Type: application/x-msdownload` | HTTP 400 `"Unsupported file type."`    | Neither image nor PDF check passes → error thrown.                                                                      |
| FILE-04 | JavaScript file rejected     | `Content-Type: text/javascript`          | HTTP 400 `"Unsupported file type."`    | MIME type not in allowed list.                                                                                          |
| FILE-05 | File exceeding 10MB rejected | 15MB image file                          | Multer rejects before processing       | `limits: { fileSize: 10000000 }` — Multer throws `LIMIT_FILE_SIZE` error.                                               |
| FILE-06 | Filename sanitized           | Upload `../../etc/passwd.jpg`            | Stored as `{userId}-{timestamp}.jpg`   | `filename` function in disk storage uses `${userId}-${Date.now()}${extension}` — original name is completely discarded. |
| FILE-07 | Supabase fallback to local   | No `SUPABASE_URL` env var                | File saved to `public/uploads/assets/` | `isSupabaseConfigured` evaluates to `false` → `diskStorage` used.                                                       |
| FILE-08 | Cloud URL passthrough        | Supabase returns `https://...` URL       | Stored as-is in database               | `resolveFilePath()` checks `file.path.startsWith("http")` → returns unchanged.                                          |

---

## 7. Audit Trail Completeness Testing

| Test ID  | Test Case                 | Action                                         | Expected Audit Entry                                                     | Verification Method                                                          |
| -------- | ------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| AUDIT-01 | Event approval logged     | Admin approves event                           | `{ action: 'APPROVE_EVENT', target_type: 'Event', admin_id: <adminId> }` | Query `audit_logs` with `{ action: 'APPROVE_EVENT', target_id: <eventId> }`. |
| AUDIT-02 | Event rejection logged    | Admin rejects event                            | `{ action: 'REJECT_EVENT', details: { reason: '...' } }`                 | Verify `details` contains the rejection reason.                              |
| AUDIT-03 | User deletion logged      | Admin deletes user                             | `{ action: 'DELETE_USER', target_type: 'User', target_id: <userId> }`    | Query audit logs filter by action and target.                                |
| AUDIT-04 | Role change logged        | Admin updates user role                        | `{ action: 'UPDATE_USER_ROLE', details: { previous_role, new_role } }`   | Verify `details` captures the before and after state.                        |
| AUDIT-05 | Organizer approval logged | Admin approves organizer                       | `{ action: 'APPROVE_ORGANIZER' }`                                        | Audit log entry created with the correct target user ID.                     |
| AUDIT-06 | Venue CRUD logged         | Admin creates/updates/deletes venue            | `CREATE_VENUE`, `UPDATE_VENUE`, `DELETE_VENUE`                           | Each operation creates a corresponding audit log entry.                      |
| AUDIT-07 | Speaker CRUD logged       | Admin creates/updates/deletes/verifies speaker | `CREATE_SPEAKER`, `UPDATE_SPEAKER`, `DELETE_SPEAKER`, `VERIFY_SPEAKER`   | Each operation creates a corresponding audit log entry.                      |
| AUDIT-08 | Category CRUD logged      | Admin creates/updates/deletes category         | `CREATE_CATEGORY`, `UPDATE_CATEGORY`, `DELETE_CATEGORY`                  | Each operation creates a corresponding audit log entry.                      |
| AUDIT-09 | Community CRUD logged     | Admin creates/updates/deletes community        | `CREATE_COMMUNITY_MANUAL`, `UPDATE_COMMUNITY`, `DELETE_COMMUNITY`        | Each operation creates a corresponding audit log entry.                      |
| AUDIT-10 | Review deletion logged    | Admin deletes review                           | `{ action: 'DELETE_REVIEW', target_type: 'Review' }`                     | Audit log entry preserves the review content in `details`.                   |
| AUDIT-11 | Broadcast logged          | Admin creates notification                     | `{ action: 'BROADCAST_NOTIFICATION' }`                                   | Audit log entry created for platform-wide broadcast.                         |

---

## 8. Password Exclusion Testing

| Test ID | Test Case                              | Route                                     | Expected Result                                 | Verification Method                                                  |
| ------- | -------------------------------------- | ----------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| PWD-01  | `/api/auth/me` excludes password       | `GET /api/auth/me`                        | Response JSON does not contain `password` field | `User.findById(id).select('-password')` — verify the response body.  |
| PWD-02  | Admin user list excludes password      | `GET /api/admin/users`                    | No user object contains `password`              | `.select('-password')` applied to the query.                         |
| PWD-03  | Organizer approval excludes password   | `PATCH /api/admin/organizers/:id/approve` | Response does not contain `password`            | `.select('-password')` on the returned user.                         |
| PWD-04  | Role update excludes password          | `PUT /api/admin/users/:id/role`           | Response does not contain `password`            | `.select('-password')` on the returned user.                         |
| PWD-05  | User deletion lookup excludes password | `DELETE /api/admin/users/:id`             | Internal lookup uses `.select('-password')`     | Even the pre-deletion lookup does not load the password into memory. |

---

## 9. API Error Handling Testing

| Test ID | Test Case                                         | Input                                 | Expected Result                                 | Verification Method                                                                                                                               |
| ------- | ------------------------------------------------- | ------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| ERR-01  | Global error handler catches unhandled exceptions | Force an unhandled error in any route | HTTP 500 `{ message: "Internal Server Error" }` | The global handler `app.use((err, req, res, next) => ...)` catches all unhandled errors and returns a generic JSON response without stack traces. |
| ERR-02  | Invalid MongoDB ObjectId handled                  | `GET /api/events/notavalidid`         | HTTP 500 with `CastError` caught by try-catch   | Most controllers wrap logic in try-catch and return HTTP 500 with `error.message`.                                                                |
| ERR-03  | Database connection failure exits process         | Invalid `MONGO_URI`                   | `process.exit(1)` — process terminates          | The `startServer()` function catches connection errors and calls `process.exit(1)` to prevent serving requests without a database.                |
| ERR-04  | Non-existent resource returns 404                 | `GET /api/events/:invalidId`          | HTTP 404 `"Event not found."`                   | Controllers check `if (!event)` after `findById()` calls.                                                                                         |

---

## 10. Concurrency & Atomicity Testing

| Test ID | Test Case                                          | Input                                                   | Expected Result                                                 | Verification Method                                                                                                                                          |
| ------- | -------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CONC-01 | Simultaneous registrations maintain accurate count | 10 concurrent `POST /api/registrations` for same event  | `current_attendees` incremented by exactly 10                   | All updates use `{ $inc: { current_attendees: 1 } }` which is atomic at the MongoDB engine level. Verify final count matches total successful registrations. |
| CONC-02 | Simultaneous cancellations maintain accurate count | 5 concurrent cancellations for same event               | `current_attendees` decremented by exactly 5                    | Same `$inc: -1` atomicity guarantee.                                                                                                                         |
| CONC-03 | Capacity breach prevented under load               | Event with `capacity: 1`, 10 simultaneous registrations | Only 1 registration succeeds; 9 get HTTP 400 `"Event is full."` | Application-level check `if (current_attendees >= capacity)` combined with unique index prevents double registration.                                        |
| CONC-04 | Merit points atomically updated                    | 3 concurrent check-ins with `merit_points: 10`          | User's `current_merit` incremented by exactly 30                | `$inc: { current_merit: merit_points }` is atomic.                                                                                                           |

---

## Summary Matrix

| Testing Category   | Test Count | Coverage Area                                                                                  |
| ------------------ | ---------- | ---------------------------------------------------------------------------------------------- |
| Authentication     | 9          | JWT lifecycle, bcrypt hashing, ambiguous errors                                                |
| RBAC               | 13         | Route-level, multi-role, escalation prevention                                                 |
| Ownership & ACL    | 7+4        | Registration/event ownership, community leadership, access control matrix                      |
| Database Logic     | 28         | Registration, cancellation, check-in, review, lifecycle, organizer approval                    |
| Data Integrity     | 22         | Unique indexes, enum validation, required fields, referential integrity, auto-generated fields |
| File Upload        | 8          | MIME filtering, size limits, filename sanitization, storage fallback                           |
| Audit Trail        | 11         | All CRUD operations, approvals, broadcasts                                                     |
| Password Exclusion | 5          | All user-returning endpoints                                                                   |
| Error Handling     | 4          | Global handler, cast errors, connection failure, 404s                                          |
| Concurrency        | 4          | Atomic increments/decrements, capacity breach, merit points                                    |

**Total Test Cases: 115**
