const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './config/.env') });

async function checkEventManagement() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB:", mongoose.connection.name);

    const Event = require('./models/event');
    const CommunityMember = require('./models/communityMember');
    const EventCrew = require('./models/eventCrew');

    // Find the Bengkel PHP event
    const event = await Event.findOne({ title: { $regex: /Bengkel PHP/i } });
    if (!event) {
      console.log("Bengkel PHP event not found.");
      return;
    }

    console.log("Event Details:");
    console.log("- ID:", event._id);
    console.log("- Status:", event.status);
    console.log("- Organizer ID:", event.organizer_id);
    console.log("- Community ID:", event.community_id);

    const organizerId = event.organizer_id;

    // Check memberships for this organizer
    const memberships = await CommunityMember.find({ 
      user_id: organizerId, 
      status: 'Approved' 
    });
    console.log("Organizer Memberships Count:", memberships.length);
    memberships.forEach(m => {
        console.log(`- Community: ${m.community_id}, Role: ${m.role}`);
    });

    // Check if the event's community is in the leader list
    const leadershipRoles = ['President', 'AJK', 'Committee', 'Secretary', 'Treasurer'];
    const leaderCommunityIds = memberships
      .filter(m => leadershipRoles.includes(m.role))
      .map(m => m.community_id.toString());
    
    console.log("Leader Community IDs:", leaderCommunityIds);
    if (event.community_id && leaderCommunityIds.includes(event.community_id.toString())) {
        console.log("Event is managed via Community Leadership.");
    } else {
        console.log("Event IS NOT managed via Community Leadership.");
    }

    if (event.organizer_id.toString() === organizerId.toString()) {
        console.log("Event is managed via direct Ownership.");
    }

    // Check if event shows up in upcoming/live filter of MyEvents.jsx
    const now = new Date();
    const eventDate = new Date(event.date_time);
    console.log("Current Time:", now.toISOString());
    console.log("Event Time:", eventDate.toISOString());
    console.log("Is Event Future?", eventDate >= now);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

checkEventManagement();
