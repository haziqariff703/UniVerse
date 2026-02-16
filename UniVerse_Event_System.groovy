Project UniVerse_Event_System {
  database_type: 'MongoDB'
  Note: 'IMS560 Advanced Database Project - NoSQL Architecture (14 Collections)'
}

// ==========================================
// GROUP 1: CORE IDENTITY & GOVERNANCE
// ==========================================

Table users {
  _id ObjectId [pk, note: "Unique Identifier"]
  student_id string [unique, note: "Sparse index, 8-15 chars"]
  name string [not null]
  email string [unique, not null, note: "Lowercase"]
  password string [not null, note: "Bcrypt hashed"]
  role string [note: "Enum: 'student', 'admin', 'organizer', 'association'"]
  roles array [note: "Multi-role: ['student', 'organizer']"]
  preferences array [note: "e.g., ['Technology', 'Music']"]
  gender string [note: "Enum: 'Male', 'Female'"]
  date_of_birth date
  organizerRequest boolean [default: false, note: "Flags user for Admin review"]
  id_card_url string [note: "Supabase storage URL"]
  confirmation_letter_url string [note: "Supabase storage URL"]
  is_organizer_approved boolean [default: false]
  current_merit int [default: 0, note: "XP tracker for gamification"]
  merit_goal int [default: 500]
  avatar string
  coverImage string
  bio string [note: "Max 140 chars"]
  links object [note: "{ github, linkedin, website }"]
  dna array [note: "Interest DNA tags"]
  assets array [note: "Portfolio: [{ title, name, url, fileType, size, date }]"]
  settings object [note: "{ privacy: { visibility, searchable, readReceipts }, notifications: { mentions, reminders, announcements, emailDigest }, recoveryEmail }"]
  created_at timestamp [default: `Date.now`]

  Note: "Central identity model. Supports dual-layer roles, gamification (merit/rank), portfolio assets, and granular privacy/notification settings."
}

Table events {
  _id ObjectId [pk]
  organizer_id ObjectId [ref: > users._id, not null, note: "Event creator"]
  community_id ObjectId [ref: > communities._id, note: "Hosting club/org"]
  venue_id ObjectId [ref: > venues._id]
  speaker_ids array [ref: > speakers._id, note: "Array of Speaker ObjectIds"]
  title string [not null]
  description string
  location string [note: "Fallback text location"]
  date_time datetime [not null]
  end_time datetime
  duration_minutes int [default: 60]
  capacity int [not null]
  current_attendees int [default: 0, note: "Updated atomically via $inc"]
  ticket_price number [default: 0]
  status string [note: "Enum: 'pending', 'approved', 'rejected', 'Open', 'SoldOut', 'Cancelled', 'Completed'"]
  tags array [note: "For search indexing"]
  image string [note: "Cinematic poster URL"]
  proposal string [note: "PDF proposal URL"]
  rejection_reason string
  category string [default: 'Academic']
  category_id ObjectId [ref: > categories._id, note: "Link to Admin-managed Category"]
  is_featured boolean [default: false]
  merit_points int [default: 0, note: "XP awarded on check-in"]
  target_audience string [note: "Enum: 'All Students', 'FPM Students', 'FiTA Students', 'FSKM Students', etc."]
  schedule array [note: "Embedded: [{ time, title, description, speaker_id }]"]
  tasks array [note: "Embedded: [{ text, completed, priority, dueDate }]"]

  Note: "Core event collection. Supports lifecycle management, venue conflict checks, embedded schedules/tasks, and community association."
}

// ==========================================
// GROUP 2: MANY-TO-MANY JUNCTIONS (COMPLEXITY)
// ==========================================

Table registrations {
  _id ObjectId [pk]
  event_id ObjectId [ref: > events._id, not null]
  user_id ObjectId [ref: > users._id, not null]
  status string [note: "Enum: 'Confirmed', 'Waitlist', 'CheckedIn', 'Cancelled'"]
  booking_time timestamp [default: `Date.now`]
  qr_code_string string [note: "Unique identifier for Digital Pass"]
  event_snapshot object [note: "Denormalized: { title, venue, date_time }"]
  user_snapshot object [note: "Denormalized: { name, student_id }"]

  indexes {
    (event_id, user_id) [unique, note: "Prevents duplicate registrations"]
  }

  Note: "M:N junction between Users and Events. Uses denormalized snapshots for O(1) Digital Pass rendering."
}

Table event_crew {
  _id ObjectId [pk]
  event_id ObjectId [ref: > events._id, not null]
  user_id ObjectId [ref: > users._id]
  temp_name string [note: "For inviting non-registered users"]
  role string [not null, note: "e.g., 'Main Speaker', 'Head of Logistics'"]
  type string [not null, note: "Enum: 'talent', 'crew'"]
  department string [default: 'General', note: "e.g., 'Protocol', 'Technical', 'Stage'"]
  status string [note: "Enum: 'invited', 'accepted', 'rejected', 'applied'"]
  joined_at date
  created_at timestamp [default: `Date.now`]

  Note: "Staffing and talent assignment per event. Separates core workforce (crew) from featured presenters (talent)."
}

Table community_members {
  _id ObjectId [pk]
  community_id ObjectId [ref: > communities._id, not null]
  user_id ObjectId [ref: > users._id, not null]
  role string [note: "Enum: 'Member', 'AJK', 'Committee', 'Secretary', 'Treasurer', 'President', 'Advisor'"]
  department string [default: 'General']
  status string [note: "Enum: 'Applied', 'Interviewing', 'Approved', 'Rejected', 'Inactive'"]
  interview_date date
  interview_note string
  joined_at date
  created_at timestamp [default: `Date.now`]

  indexes {
    (community_id, user_id) [unique, note: "One membership record per user per community"]
  }

  Note: "Workforce hierarchy and recruitment lifecycle for communities. Supports HR-style interview tracking."
}

// ==========================================
// GROUP 3: ORGANIZATIONAL ENTITIES
// ==========================================

Table communities {
  _id ObjectId [pk]
  name string [unique, not null]
  slug string [unique, not null, note: "Lowercase URL-friendly identifier"]
  tagline string
  description string [not null]
  category string [not null]
  logo string [note: "Supabase/local storage URL"]
  banner string [note: "Supabase/local storage URL"]
  advisor object [note: "{ name (required), title, email }"]
  social_links object [note: "{ instagram, facebook, website, twitter }"]
  stats object [note: "Cached: { member_count, event_count, founded_year }"]
  owner_id ObjectId [ref: > users._id, not null, note: "President/Creator"]
  is_verified boolean [default: false]
  created_at timestamp [default: `Date.now`]

  Note: "Student organizations (Clubs/Associations). Stats are cached for performance; live counts use $lookup aggregation."
}

Table club_proposals {
  _id ObjectId [pk]
  clubName string [not null]
  category string [not null]
  mission string [not null]
  advisorName string [not null]
  committeeSize int [not null]
  student_id ObjectId [ref: > users._id, not null, note: "Proposing student"]
  constitution_url string [note: "PDF upload"]
  consent_letter_url string
  logo_url string
  banner_url string
  status string [note: "Enum: 'pending', 'approved', 'rejected'"]
  rejection_reason string
  created_at timestamp [default: `Date.now`]

  Note: "Pipeline for new club applications. Upon approval, triggers atomic Community creation and role promotion."
}

// ==========================================
// GROUP 4: SUPPORTING COLLECTIONS
// ==========================================

Table venues {
  _id ObjectId [pk]
  name string [not null]
  location_code string [not null, note: "e.g., 'A-101'"]
  max_capacity int [not null]
  type string [not null, note: "Enum: 'Academic', 'Residential', 'Social', 'Outdoor', 'Other'"]
  description string
  facilities array [note: "['Projector', 'Wifi', 'AC']"]
  bestFor array [note: "['Workshop', 'Seminar']"]
  image string [note: "Primary image URL"]
  images array [note: "Gallery image URLs"]
  glowColor string [default: 'purple', note: "UI heatmap cosmetic"]
  occupancyStatus string [note: "Enum: 'Available', 'Busy', 'Moderate', 'Closed'"]
  liveOccupancy int [default: 0]
  nextAvailable string [default: 'Now']
  accessHours string [default: '08:00 - 22:00']
  accessLevel string [default: 'Student ID']
  managedBy string [default: 'HEP Office']

  Note: "Campus location registry with real-time status. Supports Live Pulse Algorithm and Heatmap visualization. Uses Mongoose timestamps."
}

Table speakers {
  _id ObjectId [pk]
  name string [not null]
  role string [default: 'Guest Speaker']
  expertise string
  category string [note: "Enum: 'Science', 'Tech', 'Arts', 'Leadership', 'Other'"]
  bio string [note: "Short bio for cards"]
  about string [note: "Long bio for details page"]
  image string
  social_links object [note: "{ linkedin, twitter, website }"]
  stats object [note: "{ talks: 0, merit: 0, rating: 0.0 }"]
  achievements array
  past_events array [note: "Embedded: [{ year, title }]"]
  upcoming string [note: "Title of next event"]
  status string [note: "Enum: 'pending', 'verified', 'rejected'"]
  proposal_url string
  requested_by ObjectId [ref: > users._id, note: "Organizer who proposed"]
  user_id ObjectId [ref: > users._id, note: "Optional: Link to internal User account (Student/Staff)"]

  Note: "Speaker profiles and proposal pipeline. Verified speakers can be assigned to events via speaker_ids."
}

Table categories {
  _id ObjectId [pk]
  name string [unique, not null]
  slug string [unique, not null, note: "Auto-generated from name, lowercase"]
  description string
  color string [default: '#8b5cf6']
  icon string [default: 'Tag', note: "Lucide icon name"]
  is_active boolean [default: true]
  created_at timestamp [default: `Date.now`]

  Note: "Admin-managed event categories with visual branding. Slug is auto-generated via pre-validate hook."
}

Table reviews {
  _id ObjectId [pk]
  event_id ObjectId [ref: > events._id, not null]
  user_id ObjectId [ref: > users._id, not null]
  rating int [not null, note: "1-5 stars"]
  speaker_rating int [note: "1-10 scale"]
  value int [default: 5, note: "Merit/Career Value (1-10)"]
  energy int [default: 5, note: "Vibe/Hype (1-10)"]
  welfare int [default: 5, note: "Food/Facilities (1-10)"]
  comment string
  photos array [note: "User-uploaded photo URLs"]
  created_at timestamp [default: `Date.now`]

  indexes {
    (event_id, user_id) [unique, note: "One review per user per event"]
  }

  Note: "Feedback with Atmosphere Metrics (value, energy, welfare). Powers organizer analytics and sentiment analysis."
}

// ==========================================
// GROUP 5: SECURITY, AUDIT & COMMUNICATIONS
// ==========================================

Table audit_logs {
  _id ObjectId [pk]
  admin_id ObjectId [ref: > users._id, not null, note: "Acting user"]
  action string [not null, note: "Enum: 'APPROVE_EVENT', 'REJECT_EVENT', 'DELETE_EVENT', 'APPROVE_ORGANIZER', 'REJECT_ORGANIZER', 'CREATE_VENUE', 'UPDATE_VENUE', 'DELETE_VENUE', 'DELETE_USER', 'UPDATE_USER_ROLE', 'CREATE_USER_MANUAL', 'CREATE_CATEGORY', 'UPDATE_CATEGORY', 'DELETE_CATEGORY', 'DELETE_REVIEW', 'CREATE_COMMUNITY_MANUAL', 'BROADCAST_NOTIFICATION', 'CREATE_SPEAKER', 'UPDATE_SPEAKER', 'DELETE_SPEAKER', 'VERIFY_SPEAKER', 'REJECT_SPEAKER_PROPOSAL', 'CREATE_EVENT', 'UPDATE_EVENT', 'CHECKIN_ATTENDEE', 'CANCEL_REGISTRATION', 'UPDATE_REGISTRATION'"]
  target_type string [not null, note: "Enum: 'Event', 'User', 'Venue', 'Registration', 'Category', 'Review', 'Community', 'System', 'Speaker'"]
  target_id ObjectId [not null, note: "Dynamic ref via refPath on target_type"]
  details object [note: "Snapshot of changes/metadata"]
  ip_address string
  created_at timestamp [default: `Date.now`]

  Note: "Forensic action log. Uses refPath for polymorphic references. Tracks 27 distinct action types across Admin and Organizer operations."
}

Table notifications {
  _id ObjectId [pk]
  recipient_id ObjectId [ref: > users._id, not null]
  title string [not null]
  message string [not null]
  type string [note: "Enum: 'info', 'alert', 'success'"]
  read boolean [default: false]
  related_event_id ObjectId [ref: > events._id, note: "Optional context link"]
  created_at timestamp [default: `Date.now`]

  Note: "Internal alert system for user engagement and event reminders."
}

Table broadcast_logs {
  _id ObjectId [pk]
  sender_id ObjectId [ref: > users._id, not null]
  target_role string [note: "Enum: 'all', 'student', 'organizer'"]
  target_event_id ObjectId [ref: > events._id, note: "Optional event scoping"]
  title string [not null]
  message string [not null]
  type string [note: "Enum: 'info', 'alert', 'success'"]
  category string [note: "Enum: 'campus', 'club', 'official', 'event', 'lifestyle', 'transport'"]
  priority string [note: "Enum: 'low', 'medium', 'high'"]
  image_url string [note: "Poster/attachment URL"]
  is_public boolean [default: true, note: "Visible on Campus News Hub"]
  created_at timestamp [default: `Date.now`]

  Note: "Platform-wide signal and news hub entries. Supports tiered targeting (role/event) and public broadcasting for the Campus News Hub."
}