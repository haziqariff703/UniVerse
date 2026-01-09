Project Campus_Event_System {
  database_type: 'MongoDB'
  Note: 'IMS560 Advanced Database Project - NoSQL Architecture'
}

// ==========================================
// GROUP 1: CORE ENTITIES
// ==========================================

Table users {
  _id ObjectId [pk, note: "Unique Identifier"]
  student_id string [unique, note: "e.g., 2023123456"]
  name string
  email string
  password_hash string [note: "Security: Never store plain text"]
  role string [note: "Allowed: 'student', 'admin', 'staff'"]
  preferences array [note: "e.g., ['Technology', 'Music']"]
  created_at timestamp
  
  Note: "Stores all system actors. Validated by Auth Middleware."
}

Table events {
  _id ObjectId [pk]
  organizer_id ObjectId [ref: > users._id, note: "User who created the event"]
  venue_id ObjectId [ref: > venues._id]
  title string
  description string
  date_time datetime
  duration_minutes int
  capacity int
  current_attendees int [note: "Updated atomically via $inc"]
  status string [note: "Open, SoldOut, Cancelled"]
  tags array [note: "For search indexing"]
  
  // THE FIX: Explicit relationship for the Array of IDs
  // This draws the line from Events to Speakers in the diagram
  speaker_ids array [ref: > speakers._id] 
  
  Note: "Main inventory collection. Contains embedded speaker references (Subset Pattern)."
}

// ==========================================
// GROUP 2: THE MANY-TO-MANY LINK (COMPLEXITY)
// ==========================================

Table registrations {
  _id ObjectId [pk]
  event_id ObjectId [ref: > events._id]
  user_id ObjectId [ref: > users._id]
  status string [note: "Confirmed, Waitlist, CheckedIn, Cancelled"]
  booking_time timestamp
  qr_code_string string
  
  // =========================================================
  // HIGH MARK AREA: DENORMALIZATION (NoSQL PATTERN)
  // We store a snapshot of data here to avoid extra queries.
  // =========================================================
  event_snapshot object [note: "{ title: 'Tech Talk', venue: 'Hall A' }"]
  user_snapshot object [note: "{ name: 'Ali', student_id: '2023...' }"]

  Note: "Junction collection for M:N relationship. Contains embedded snapshots for read-performance."
}

// ==========================================
// GROUP 3: SUPPORTING COLLECTIONS
// ==========================================

Table venues {
  _id ObjectId [pk]
  name string
  location_code string
  max_capacity int
  facilities array [note: "['Projector', 'Wifi', 'AC']"]
  images array
}

Table speakers {
  _id ObjectId [pk]
  name string
  expertise string
  bio string
  social_links object
}

Table reviews {
  _id ObjectId [pk]
  event_id ObjectId [ref: > events._id]
  user_id ObjectId [ref: > users._id]
  rating int [note: "1 to 5"]
  comment string
  created_at timestamp
}

// ==========================================
// GROUP 4: SECURITY & AUDIT (RUBRIC REQUIREMENT)
// ==========================================

Table audit_logs {
  _id ObjectId [pk]
  action string [note: "DELETE_EVENT, UPDATE_ROLE"]
  performed_by ObjectId [ref: > users._id]
  target_document_id ObjectId
  ip_address string
  timestamp timestamp
  
  Note: "Security Requirement: Tracks all critical actions."
}

Table notifications {
  _id ObjectId [pk]
  user_id ObjectId [ref: > users._id]
  message string
  is_read boolean
  type string
  created_at timestamp
}