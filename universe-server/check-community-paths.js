const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

const Community = require('./models/community');

async function checkPaths() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const communities = await Community.find({}, 'name logo banner');
    console.log('Community Image Paths:');
    communities.forEach(c => {
      console.log(`- ${c.name}:`);
      console.log(`  Logo: ${c.logo}`);
      console.log(`  Banner: ${c.banner}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkPaths();
