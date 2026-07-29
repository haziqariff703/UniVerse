# 🧪 UniVerse System Test Plan

This document formalizes the validation strategies, test scripts, and test datasets used to verify the operational integrity of the **UniVerse Event Management System**. 

---

## 1. Test Levels & Strategies

The UniVerse validation lifecycle operates across four distinct test levels to ensure data continuity, security, and concurrency safety:

```
[ Unit Testing ] ──> [ Integration Testing ] ──> [ System / Concurrency Testing ] ──> [ User Acceptance Testing ]
```

### 1.1 Unit Testing
* **Objective:** Validate isolated functions, schema validations, helpers, and path resolvers.
* **Scope:** Test Joi validators, custom mongoose virtual/pre hooks (e.g., category slug generation), and file type checks within `upload.js` without active network or database operations.

### 1.2 Integration Testing
* **Objective:** Verify endpoint connectivity and correct client-server headers synchronization.
* **Scope:** Validate Axios request wrappers, CORS middleware settings, Bearer token extraction hooks, and correct database insertions.

### 1.3 System & Concurrency Testing
* **Objective:** Test database state security under simulated peak traffic conditions.
* **Scope:** 
  * Validate role-based authorization blocks for endpoints.
  * Verify **race-condition prevention rules** under concurrent event bookings using database-level atomic increments (`$inc`).

### 1.4 User Acceptance Testing (UAT)
* **Objective:** Verify user flows match UI mock-up trees and user expectations.
* **Scope:** Handover walkthroughs for students, club organizers, and administrators.

---

## 2. Concurrency & Concurrency Test Cases

To fulfill **Q4 of the SDLC interview transcript**, the system must block race conditions (such as double bookings and capacity limit breaches) when multiple students register for events simultaneously. 

### 2.1 Concurrency Data Continuity Definitions
To ensure strict structural consistency across chapters, all concurrency evaluations write to and read from the exact unified datastores:
* **`D1: Users Store`** (storing salt-hashed credentials, profile info, and gamification merit points)
* **`D2: Events Store`** (storing event details, total capacity, and attendee counters)
* **`D3: Registrations Store`** (storing user-to-event tokenized relations)

### 2.2 Concurrency Test Suite Matrix

| Test ID | Testing Target | Input Action | Expected Result | Datastores Involved | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CONC-01** | Simultaneous bookings | 15 concurrent registration POSTs to `D3` | `current_attendees` in `D2` increments by exactly 15; zero lost records. | `D2`, `D3` | Execute concurrent asynchronous request loops. Verify database records in `D3` equal 15. |
| **CONC-02** | Booking cancellation | 5 concurrent cancellations | `current_attendees` in `D2` decrements by exactly 5. | `D2`, `D3` | Trigger concurrent cancellation DELETE actions. Check `D2` counter updates. |
| **CONC-03** | Event capacity limit | Event capacity set to 1; 10 concurrent bookings | 1 booking succeeds (Confirmed status); 9 get HTTP 400 "Event is full". | `D2`, `D3` | Conditional find-and-update checks via atomic `findOneAndUpdate` operations. |
| **CONC-04** | Merit points allocation | 3 concurrent QR scans for the same student | Student `current_merit` in `D1` increases by exact multiples of event merit. | `D1`, `D2` | Check database profile entry in `D1` after check-in. |

---

## 3. Realistic Test Datasets (JSON Mock Data)

To support mock executions and sandbox staging, the following JSON document states populate the database collections:

### 3.1 `D1: Users Store` (User Document Collection)
```json
[
  {
    "_id": "603f9011e4b02b54bc3e8001",
    "name": "UiTM Admin",
    "email": "admin@universe.com",
    "password": "$2a$10$hashedAdminPasswordMockExampleHere12345",
    "role": "admin",
    "roles": ["admin"],
    "created_at": "2026-07-27T12:00:00.000Z"
  },
  {
    "_id": "603f9011e4b02b54bc3e8002",
    "name": "Club Organizer",
    "email": "organizer@universe.com",
    "password": "$2a$10$hashedOrganizerPasswordMockExampleHere12345",
    "role": "organizer",
    "roles": ["student", "organizer"],
    "created_at": "2026-07-27T12:05:00.000Z"
  },
  {
    "_id": "603f9011e4b02b54bc3e8003",
    "name": "UiTM Student",
    "email": "student@universe.com",
    "password": "$2a$10$hashedStudentPasswordMockExampleHere12345",
    "role": "student",
    "roles": ["student"],
    "current_merit": 20,
    "student_id": "2024123456",
    "created_at": "2026-07-27T12:10:00.000Z"
  }
]
```

### 3.3 `D2: Events Store` (Event Document Collection)
```json
[
  {
    "_id": "603f9515e4b02b54bc3e8101",
    "organizer_id": "603f9011e4b02b54bc3e8002",
    "title": "MERN Stack Development Seminar",
    "description": "Comprehensive tutorial on Express.js and MongoDB Atlas.",
    "date_time": "2026-08-10T09:00:00.000Z",
    "capacity": 50,
    "current_attendees": 48,
    "ticket_price": 0,
    "status": "Open",
    "category": "Academic",
    "merit_points": 10
  }
]
```

### 3.3 `D3: Registrations Store` (Registration Document Collection)
```json
[
  {
    "_id": "603f9920e4b02b54bc3e8201",
    "event_id": "603f9515e4b02b54bc3e8101",
    "user_id": "603f9011e4b02b54bc3e8003",
    "status": "Confirmed",
    "booking_time": "2026-07-28T14:00:00.000Z",
    "qr_code_string": "UNIV-8101-8003-1770000000000",
    "event_snapshot": {
      "title": "MERN Stack Development Seminar",
      "date_time": "2026-08-10T09:00:00.000Z",
      "venue": "Jasmine Hall"
    },
    "user_snapshot": {
      "name": "UiTM Student",
      "student_id": "2024123456"
    }
  }
]
```

---

## 4. Automated Integration Verification

All test specifications are verified automatically using GitHub Actions pipelines. Upon opening a pull request or pushing updates to `master`, the runner spins up containers to perform clean installs and run the validations:

```bash
# Executed by automated runner pipeline
npm ci
npm run build --if-present
npm test
```
