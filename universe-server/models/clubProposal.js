const mongoose = require('mongoose');

const clubProposalSchema = new mongoose.Schema({
  clubName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  advisorName: {
    type: String,
    required: true
  },
  committeeSize: {
    type: Number,
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejection_reason: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ClubProposal', clubProposalSchema);
