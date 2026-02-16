const mongoose = require('mongoose');
const path = require('path');
const Community = require('../models/community');
const CommunityMember = require('../models/communityMember');
const User = require('../models/user');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const seedCommunities = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/UniVerse");
    console.log("Connected to DB for seeding communities... ✅");

    // Find an owner for the communities - Prioritize 'rasyid' or any organizer for testing convenience
    let owner = await User.findOne({ name: 'rasyid' });
    if (!owner) owner = await User.findOne({ role: { $in: ['admin', 'organizer'] } });
    
    if (!owner) {
      console.log("No administrative user found to own communities. Please sign up or run seedAdmin.js first.");
      process.exit(1);
    }
    
    console.log(`Assigning communities to owner: ${owner.name} (${owner.role})`);

    const communities = [
      {
        name: "Creative Arts Student Association (CASA)",
        slug: "casa",
        tagline: "The home for film, theater, and animation enthusiasts!",
        description: "CASA is a vibrant community of students from the Faculty of Film, Theater, and Animation (FiTA). We aim to nurture creativity and provides a platform for students to showcase their artistic talents through various events and productions.",
        category: "Creative",
        advisor: {
          name: "Dr. Rohani Jamil",
          title: "Senior Lecturer",
          email: "rohani@uitm.edu.my"
        },
        stats: {
          member_count: 550,
          event_count: 12,
          founded_year: 2012
        },
        owner_id: owner._id,
        is_verified: true
      },
      {
        name: "Information Management Student Association (IMSA)",
        slug: "imsa",
        tagline: "Empowering future information professionals.",
        description: "IMSA represents students from the Faculty of Information Management. We focus on academic excellence, professional development, and community engagement in the field of information science and technology.",
        category: "Academic",
        advisor: {
          name: "En. Ahmad Zaki",
          title: "Program Coordinator",
          email: "zaki@uitm.edu.my"
        },
        stats: {
          member_count: 820,
          event_count: 15,
          founded_year: 2005
        },
        owner_id: owner._id,
        is_verified: true
      }
    ];

    for (const comm of communities) {
      const upsertedCommunity = await Community.findOneAndUpdate(
        { slug: comm.slug },
        comm,
        { upsert: true, new: true }
      );
      console.log(`Seeded community: ${comm.name}`);
      
      // Also add the owner as a President in the CommunityMember collection
      await CommunityMember.findOneAndUpdate(
        { community_id: upsertedCommunity._id, user_id: owner._id },
        {
          community_id: upsertedCommunity._id,
          user_id: owner._id,
          role: 'President',
          department: 'Executive',
          status: 'Approved',
          joined_at: new Date()
        },
        { upsert: true, new: true }
      );
      console.log(`  -> Added ${owner.name} as President to ${comm.name}`);
    }

    console.log("Communities seeding complete! ✅");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed! ❌", error);
    process.exit(1);
  }
};

seedCommunities();
