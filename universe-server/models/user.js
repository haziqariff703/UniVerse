const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  student_id: { 
    type: String, 
    sparse: true, // Allows multiple null/undefined values
    unique: true,
    trim: true,
    minlength: 10,
    maxlength: 10
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
    type: [String],
    default: []
  },
  ic_number: {
    type: String,
    sparse: true,
    unique: true,
    trim: true,
    minlength: 12,
    maxlength: 12
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: false
  },
  date_of_birth: {
    type: Date,
    required: false
  },
  organizerRequest: {
    type: Boolean,
    default: false
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Export the model so we can use it in our routes
module.exports = mongoose.model('User', userSchema);