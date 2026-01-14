const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  student_id: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['student', 'admin', 'staff', 'organizer'], 
    default: 'student' 
  },
  preferences: {
    type: [String], // Array of interests (e.g., ['Tech', 'Sports'])
    default: []
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Export the model so we can use it in our routes
module.exports = mongoose.model('User', userSchema);