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
- **Crew Delegation (Viewer Role)**: To support team coordination, designated crew members in the `EventCrew` collection are granted **Read-Only** access to the "Organizer Suite". They can view operational cards (Schedule/Tasks) and analytics but **cannot edit** the event structure, preserving the Organizer's control.
- **Shared "Organizer Suite" Visibility**: The dashboard uses a "Broadened Data Collection" pattern. Aggregator endpoints (Finance, Analytics, Reviews) are programmed to query both owned events and crew assignments. This ensures that collaborators see the events they manage in their own "My Events" suite and can contribute to global performance tracking.
- **Administrative Override**: Global Admins retain full CRUD capabilities across all events for mediation and oversight purposes.
