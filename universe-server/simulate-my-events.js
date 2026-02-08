const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './config/.env') });

const LEADERSHIP_ROLES = ['President', 'AJK', 'Committee', 'Secretary', 'Treasurer'];

async function simulateMyEvents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Event = require('./models/event');
    const CommunityMember = require('./models/communityMember');
    const User = require('./models/user');
    const EventCrew = require('./models/eventCrew');

    const bengkel = await Event.findOne({ title: { $regex: /Bengkel PHP/i } });
    const userId = bengkel.organizer_id;

    const user = await User.findById(userId);
    const isOrganizerApproved = user && user.is_organizer_approved;
    const memberships = await CommunityMember.find({ user_id: userId, status: 'Approved' });
    const leaderCommunityIds = memberships
      .filter(m => LEADERSHIP_ROLES.includes(m.role) || isOrganizerApproved)
      .map(m => m.community_id.toString());
    const crewAssignments = await EventCrew.find({ user_id: userId, status: 'accepted' });
    const crewEventIds = crewAssignments.map(c => c.event_id.toString());

    const events = await Event.find({ 
      $or: [
        { community_id: { $in: leaderCommunityIds } },
        { organizer_id: userId },
        { _id: { $in: crewEventIds } }
      ]
    });

    console.log("MY_EVENTS_REPORT_START");
    console.log(`TOTAL_EVENTS: ${events.length}`);
    events.forEach(e => {
        console.log(`EVENT_LOG: ${e.title} | ${e.status} | ${e._id}`);
    });
    console.log("MY_EVENTS_REPORT_END");

    await mongoose.disconnect();
  } catch (error) {}
}

simulateMyEvents();
