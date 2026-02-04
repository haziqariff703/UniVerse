# Merit System Architecture

## Overview

The Merit System is a core gamification feature that rewards students for attending events. It is fully integrated between the backend database and the frontend Profile UI.

## Data Flow

1.  **Event Definition**: Each `Event` document has a `merit_points` field.
2.  **Attendance Trigger**: When a student scans their QR Code at an event, the `registrationController.checkIn` function executes.
3.  **Database Update**: The backend adds `event.merit_points` to the `User`'s `current_merit` field using `$inc`.
4.  **Frontend Binding**: `Profile.jsx` fetches the user data and maps `userData.current_merit` to the `xp` prop of the gamification component.
5.  **Visualization**: `RankAscension.jsx` takes the raw XP value and calculates the current Rank (Cadet, Scout, etc.) and progress percentage towards the next rank.

## Key Constraints

- Points are awarded **only upon Check-In** (attendance), not just registration.
- Points are cumulative and persistent in the `User` model.
- The Rank System is purely visual and derived from the `current_merit` total.
