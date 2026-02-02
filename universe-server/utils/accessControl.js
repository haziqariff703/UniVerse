const mongoose = require('mongoose');
const Event = require('../models/event');
const EventCrew = require('../models/eventCrew');
const CommunityMember = require('../models/communityMember');
const User = require('../models/user');

// Leadership roles that grant event visibility
const LEADERSHIP_ROLES = ['President', 'Secretary', 'Treasurer', 'Committee', 'AJK'];

/**
 * Helper function to get all event IDs a user has access to.
 * Access is granted if the user is:
 * 1. The organizer (owner) of the event.
 * 2. An accepted crew member of the event.
 * 3. A leader (AJK, President, etc.) of the community that hosts the event.
 */
const getAccessibleEventIds = async (userId) => {
  if (!userId) return [];

  // 1. Get events owned by the user
  const ownedEvents = await Event.find({ organizer_id: userId }).select('_id');
  const ownedEventIds = ownedEvents.map(e => e._id.toString());

  // 2. Get events where user is an accepted crew member
  const crewAssignments = await EventCrew.find({ user_id: userId, status: 'accepted' }).select('event_id');
  const crewEventIds = crewAssignments.map(c => c.event_id.toString());

  // Check if user is an approved organizer
  const user = await User.findById(userId);
  const isOrganizerApproved = user && user.is_organizer_approved;

  // 3. Get communities where user is a leader OR an approved organizer member
  const membershipFilter = {
    user_id: userId,
    status: 'Approved'
  };

  if (!isOrganizerApproved) {
    membershipFilter.role = { $in: LEADERSHIP_ROLES };
  }

  const leaderMemberships = await CommunityMember.find(membershipFilter).select('community_id');
  const leaderCommunityIds = leaderMemberships.map(m => m.community_id);

  // Get events belonging to those communities
  const communityEvents = await Event.find({ community_id: { $in: leaderCommunityIds } }).select('_id');
  const communityEventIds = communityEvents.map(e => e._id.toString());

  // Combine and deduplicate
  const allEventIds = [...new Set([
    ...ownedEventIds,
    ...crewEventIds,
    ...communityEventIds
  ])];

  return allEventIds.map(id => new mongoose.Types.ObjectId(id));
};

module.exports = {
  getAccessibleEventIds,
  LEADERSHIP_ROLES
};
