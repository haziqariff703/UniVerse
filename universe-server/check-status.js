const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './config/.env') });

async function exactStatus() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Event = require('./models/event');
    const event = await Event.findOne({ title: { $regex: /Bengkel PHP/i } });
    if (event) {
        console.log("EXACT_STATUS_START");
        console.log(event.status);
        console.log("EXACT_STATUS_END");
    }
    await mongoose.disconnect();
  } catch (error) {}
}
exactStatus();
