# UniVerse Project Knowledge Base

This document serves as a repository for technical logic, strategic design decisions, and system insights intended for use in project reports and academic documentation.

## 1. Category Intelligence Engine (Heuristic Analysis)

The system utilizes a **Heuristic Intelligence Engine** to provide automated post-mortem analysis of event performance.

### A. Classification Algorithms

Events are categorized into performance tiers using multi-dimensional data points:

- **High Performer**: (Revenue > Mean) && (Rating >= 4.0).
- **Quality Issue**: (Revenue > Mean) && (Rating < 3.5).
- **Community Builder**: (Attendance > Mean) && (Ticket Price < Median).
- **Needs Attention**: (Attendance < Mean) && (Revenue < Mean).

### B. Strategic Insight Logic

- **Revenue Concentration**: Analyzes Gini-coefficient style distribution of revenue across categories to identify growth dependency.
- **Sentiment Thresholding**: Triggers warnings if sentiment scores drop below **70%** despite high engagement, signifying technical or operational friction.
- **Audience Demand Matching**: Correlates high sentiment (**>90%**) with low frequency to recommend expansion in high-potential niches.

## 2. Digital Pass Architecture (Student Experience)

The "Digital Pass Wallet" transitions the system from simple booking lists to a high-fidelity credential system.

- **Visual Psychological Cues**: Uses perforation effects and high-contrast typography to increase perceived value and professionalism.
- **Data Densification**: Groups fragmented event data (Venue, Time, Category, Merit) into a single scan-ready component (QR-based check-in).

## 3. Financial Stewardship (Organizer Tools)

The Finance module implements real-time GAAP-adjacent tracking for independent organizers.

- **KPI Trend Analysis**: Uses Month-over-Month (MoM) growth calculations to provide organizers with immediate feedback on marketing campaign efficacy.
- **Revenue-by-Category Visualizations**: Implements a percentage-share breakdown to allow organizers to see their "Portfolio" of events at a glance.

## 4. Audit Trail & Transparency (Security)

The system maintains a comprehensive audit log utilizing an event-sourcing lite approach.

- **Immutable Action Logging**: Every critical action (Created, Updated, Checked-in) is stamped with User, Time, and a data snapshot.
- **Snapshot Viewer**: Allows administrators to compare the state of an event before and after critical changes for accountability.

## 5. Interactive Roadmap & Collective Tasking

The dashboard implements a real-time coordination layer for event staff.

- **Dynamic Run-of-Show (RoS)**: Organizers can build an event timeline on the fly. The system handles partial array updates via specialized PUT endpoints to ensure high performance and low data collision.
- **Task Synchronization**: A "shared-state" to-do list allows organizers to track operational readiness (e.g., AV checks, catering). The UI uses optimistic updates and toggles to provide a seamless management experience.
- **Management Heuristics**: The "Three-Dot" management menu on the schedule uses destructive action protection (confirmation dialogs) to prevent accidental data loss during high-pressure event execution.

## 6. Collaborative Permission Model (Security & Delegation)

The system implements a tiered authorization structure to balance security with operational efficiency.

- **Identity-Based Ownership**: Events are strictly tied to a `organizer_id`. General users and even other "Approved Organizers" are restricted from modifying events they do not own to maintain data integrity.
- **Community Leadership Permissions**: For events hosted by a specific club or organization, a **Community-Led Association Model** is applied. Authorized leaders (President, AJK, Committee, Secretary, Treasurer) are granted full **CRUD/Edit** access to community events.
- **Team Collaboration Model (Member/AJK/President)**: The system implements a shared-management approach for community events. All **Approved** members of a community (regardless of role tier) are granted **Edit** permissions on events hosted by their club. This allows collaborative efforts in managing schedules, tasks, and historical logs.
- **Dynamic Permission UI (canEdit Flag)**: The backend dynamically injects a `canEdit` boolean flag into event responses based on membership status: (Admin OR System Organizer OR Owner OR Approved Community Member). This flag controls the visibility of all management interfaces.
- **Unified Activity Log Access**: Access to "View All History" is granted to anyone with `canEdit` permissions, ensuring that the entire event team has visibility into the audit trail while restricting it for visitors.
- **Administrative Override**: Global Admins retain full CRUD capabilities across all events for mediation and oversight purposes.

## 7. Robust Data Ingestion & Sanitization (Stability)

The system implements strict defensive coding patterns to ensure state persistence across heterogeneous device environments.

- **Dynamic Type Parsing**: The frontend `EditEvent` flow performs explicit type casting (e.g., `parseInt(capacity) || 0`) for all numeric fields. This prevents "Cast Error" 400 Bad Request failures caused by `NaN` or empty strings reaching the MongoDB layer.
- **Reference Integrity**: Reference IDs (e.g., `venue_id`, `community_id`) are conditionally stripped of "placeholder" values (like "other") before submission, maintaining referential integrity in the database.
- **Cross-Component Prop Propagation**: The system uses a "Destructured Prop Safety" pattern in dashboard widgets (`InsightsPanel`, `EventTimeline`) to ensure that critical authorization flags like `canEdit` are consistently scoped, preventing ReferenceErrors during fragmented component updates.
- **Responsive Container Constraints**: Recharts components are wrapped in `ResponsiveContainer` units with explicit `min-height` and `min-width` fallback styles to prevent rendering failures and console warnings during initial layout calculations.

## 8. Organizer/Club Creation Ecosystem (Onboarding & Automation)

The system implements a seamless "Student-to-Leader" transition flow, automating the technical overhead of organization management.

- **Integrated Proposal Pipeline**: Students initiate organizer requests through a structured **Club Proposal** system. This captures legal and operational metadata (Mission, Advisor, Faculty) at the point of entry, ensuring all required organizational data is ready for platform instantiation.
- **Atomic Approval-to-Activation Logic**: The Admin approval process triggers an atomic backend operation that simultaneously:
  1. Promotes the user to the `organizer` role.
  2. Instantiates a new **Community** record based on proposal metadata.
  3. Assigns the user as the permanent **Owner/President** and first member of that community.
  4. Marks the proposal as officially **Approved** for audit purposes.
- **Metadata-Driven UI Hydration**: The Admin moderation interface (`OrganizerApprovals`) uses a **Populated Review Pattern**, dynamically fetching associated proposal documents only when needed. This ensures high performance for long approval queues while providing deep contextual data for moderation decisions.
- **Multi-Role Session Sync**: The system implements an **Optimistic Role Refresh** strategy. Upon login or profile sync, the backend computes the user's effective permissions based on their primary `role` and their `roles` array, ensuring that newly approved organizers gain immediate access to the "Organizer Suite" without requiring a re-login.

## 9. Venue Real-time Intelligence (Live Vibe Architecture)

The system implements a real-time status and density visualization layer to enhance campus navigation for students.

### A. Live Pulse Algorithm

The `getLiveVenueStatus` engine transitions venues from static "Office Hours" views to dynamic reactive states:

- **Event-Driven Occupancy**: Computes live status by cross-referencing Malaysian time against a venue's approved event schedule.
- **Dynamic Capacity Tracking**: Calculates real-time occupancy percentages (`(attendees / capacity) * 100`) to provide "Live Vibe" signals (e.g., "Full House", "Vibing", "Chilled").
- **Sequential Timer Logic**: Automatically switches between an "Ends in" timer for active events and a "Next Event in" countdown for transition periods.

### B. Venue Pulse Heatmap

The Heatmap component provides a visual "Registry" of a venue's daily availability.

- **Hourly Density Mapping**: Discretizes the venue's access hours into blocks, highlighting booked slots based on event start/end times.
- **Visual Psychological Signalling**: Uses color-coded glows (Fuchsia for Booked, Low-opacity for Free) to help students identify low-density study windows at a glance.
- **Client-Side Optimization**: Centralizes event fetching in the parent list component (`Venues.jsx`) to associate event data with venues in a single pass, preventing N+1 API overhead.

## 10. Temporal Event State Management (Stability & Correctness)

The system implements a robust temporal logic for event status to ensure UI consistency and accurate reporting.

- **Outcome-Based Status Determination**: Transitions from a simple "Start-Time" check to a more accurate `end_time` logic. Events are only considered "Past" or "Completed" after their full duration has elapsed.
- **Fallback Heuristics**: In cases where `end_time` is not explicitly defined, the system falls back to `date_time` (start time) to ensure no breakage.
- **Cross-Layer Synchronization**: This temporal logic is synchronized across the Backend (Filtering API, Analytics Engine) and Frontend (Status Badges, Roadmap Displays) to prevent cognitive dissonance for users (e.g., an event appearing as "Completed" while it is still happening).
