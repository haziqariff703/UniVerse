const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './config/.env') });

async function verifyOrganizer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Event = require('./models/event');
    const User = require('./models/user');

    const event = await Event.findOne({ title: { $regex: /Bengkel PHP/i } });
    if (!event) {
      console.log("Event not found.");
      return;
    }

    const organizer = await User.findById(event.organizer_id);
    console.log("Event Title:", event.title);
    console.log("Event Status:", event.status);
    console.log("Organizer ID:", event.organizer_id);
    console.log("Organizer Email:", organizer ? organizer.email : "Not Found");
    console.log("Organizer Name:", organizer ? organizer.name : "Not Found");
    console.log("Organizer Roles:", organizer ? organizer.roles : []);
    console.log("Organizer Is Approved:", organizer ? organizer.is_organizer_approved : "N/A");

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

verifyOrganizer();
