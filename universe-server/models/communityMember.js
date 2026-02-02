const mongoose = require('mongoose');

const communityMemberSchema = new mongoose.Schema({
  community_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['Member', 'AJK', 'Committee', 'Secretary', 'Treasurer', 'President', 'Advisor'],
    default: 'Member'
  },
  department: {
    type: String,
    default: 'General'
  },
  status: {
    type: String,
    enum: ['Applied', 'Interviewing', 'Approved', 'Rejected', 'Inactive'],
    default: 'Applied'
  },
  interview_date: {
    type: Date
  },
  interview_note: {
    type: String
  },
  joined_at: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only have one membership record per community
communityMemberSchema.index({ community_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('CommunityMember', communityMemberSchema);
